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

// Get all pedias
app.get('/api/pedias', async (req, res) => {
  const pedias = await readJSON('pairs.json');
  res.json(pedias);
});

// Get single pedia with connections
app.get('/api/pedias/:id', async (req, res) => {
  const pedias = await readJSON('pairs.json');
  const connections = await readJSON('connections.json');
  
  const pedia = pedias.find(p => p.id === req.params.id);
  if (!pedia) return res.status(404).json({ error: 'not found' });
  
  const related = connections
    .filter(c => c.from === pedia.id || c.to === pedia.id)
    .map(c => {
      const otherId = c.from === pedia.id ? c.to : c.from;
      const other = pedias.find(p => p.id === otherId);
      return { pedia: other, label: c.label, created: c.created };
    });
  
  res.json({ ...pedia, connections: related });
});

// Get all connections
app.get('/api/connections', async (req, res) => {
  const connections = await readJSON('connections.json');
  res.json(connections);
});

// Get full graph
app.get('/api/graph', async (req, res) => {
  const pedias = await readJSON('pairs.json');
  const connections = await readJSON('connections.json');
  res.json({ pedias, connections });
});

// Legacy endpoints for compatibility
app.get('/api/pairs', async (req, res) => {
  const pedias = await readJSON('pairs.json');
  res.json(pedias);
});

// Add a pedia
app.post('/api/pedias', async (req, res) => {
  const { id, name, owner, url, emoji, tagline } = req.body;
  
  if (!id || !name || !owner) {
    return res.status(400).json({ error: 'id, name, owner required' });
  }
  
  const pedias = await readJSON('pairs.json');
  const existing = pedias.find(p => p.id === id);
  
  if (existing) {
    Object.assign(existing, { name, owner, url, emoji, tagline });
  } else {
    pedias.push({ id, name, owner, url, emoji, tagline });
  }
  
  await writeJSON('pairs.json', pedias);
  res.json({ ok: true });
});

// Add a connection
app.post('/api/connections', async (req, res) => {
  const { from, to, label } = req.body;
  
  const pedias = await readJSON('pairs.json');
  if (!pedias.find(p => p.id === from) || !pedias.find(p => p.id === to)) {
    return res.status(400).json({ error: 'invalid pedia ids' });
  }
  
  const connections = await readJSON('connections.json');
  const existing = connections.find(
    c => (c.from === from && c.to === to) || (c.from === to && c.to === from)
  );
  
  if (existing) {
    existing.label = label;
  } else {
    connections.push({ from, to, label, created: new Date().toISOString().split('T')[0] });
  }
  
  await writeJSON('connections.json', connections);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AIPEDIA Graph running on ${PORT}`));
