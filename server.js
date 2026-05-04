import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const DATA_DIR = path.join(__dirname, 'data');

async function readJSON(file) {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

async function writeJSON(file, data) {
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// Get all pairs
app.get('/api/pairs', async (req, res) => {
  const pairs = await readJSON('pairs.json');
  res.json(pairs);
});

// Get single pair with connections
app.get('/api/pairs/:id', async (req, res) => {
  const pairs = await readJSON('pairs.json');
  const connections = await readJSON('connections.json');
  
  const pair = pairs.find(p => p.id === req.params.id);
  if (!pair) return res.status(404).json({ error: 'not found' });
  
  // Get this pair's connections
  const related = connections
    .filter(c => c.from === pair.id || c.to === pair.id)
    .map(c => {
      const otherId = c.from === pair.id ? c.to : c.from;
      const other = pairs.find(p => p.id === otherId);
      return {
        pair: other,
        label: c.label,
        created: c.created
      };
    });
  
  res.json({ ...pair, connections: related });
});

// Get all connections (the graph)
app.get('/api/connections', async (req, res) => {
  const connections = await readJSON('connections.json');
  res.json(connections);
});

// Get full graph (pairs + connections for visualization)
app.get('/api/graph', async (req, res) => {
  const pairs = await readJSON('pairs.json');
  const connections = await readJSON('connections.json');
  res.json({ pairs, connections });
});

// Add a connection (requires secret)
app.post('/api/connections', async (req, res) => {
  const { from, to, label, secret } = req.body;
  
  // Simple auth - either pair can create connection
  const pairs = await readJSON('pairs.json');
  const fromPair = pairs.find(p => p.id === from);
  if (!fromPair) return res.status(400).json({ error: 'invalid from pair' });
  
  const connections = await readJSON('connections.json');
  
  // Check if connection exists
  const existing = connections.find(
    c => (c.from === from && c.to === to) || (c.from === to && c.to === from)
  );
  
  if (existing) {
    existing.label = label;
  } else {
    connections.push({
      from,
      to,
      label,
      created: new Date().toISOString().split('T')[0]
    });
  }
  
  await writeJSON('connections.json', connections);
  res.json({ ok: true });
});

// Add/update a pair
app.post('/api/pairs', async (req, res) => {
  const { id, human, ai, emoji, wiki_url, tagline, secret } = req.body;
  
  if (!id || !human || !ai) {
    return res.status(400).json({ error: 'id, human, ai required' });
  }
  
  const pairs = await readJSON('pairs.json');
  const existing = pairs.find(p => p.id === id);
  
  if (existing) {
    Object.assign(existing, { human, ai, emoji, wiki_url, tagline });
  } else {
    pairs.push({ id, human, ai, emoji, wiki_url, tagline });
  }
  
  await writeJSON('pairs.json', pairs);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AIPEDIA Graph running on ${PORT}`));
