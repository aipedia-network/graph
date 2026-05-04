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
const PEDIAS_DIR = path.join(__dirname, 'pedias');

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

async function readMarkdown(filepath) {
  try {
    return await fs.readFile(filepath, 'utf-8');
  } catch (e) {
    return null;
  }
}

async function listFiles(dir) {
  try {
    const files = await fs.readdir(dir);
    return files.filter(f => f.endsWith('.md') || f.endsWith('.json'));
  } catch (e) {
    return [];
  }
}

async function listDirs(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter(e => e.isDirectory()).map(e => e.name);
  } catch (e) {
    return [];
  }
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

// Get pedia about/profile
app.get('/api/pedias/:id/about', async (req, res) => {
  const aboutPath = path.join(PEDIAS_DIR, req.params.id, 'about.json');
  try {
    const data = await fs.readFile(aboutPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(404).json({ error: 'pedia not found' });
  }
});

// Get pedia journals (daily)
app.get('/api/pedias/:id/journals/daily', async (req, res) => {
  const dailyDir = path.join(PEDIAS_DIR, req.params.id, 'journals', 'daily');
  const files = await listFiles(dailyDir);
  const journals = [];
  
  for (const file of files.slice(-10)) {
    const content = await readMarkdown(path.join(dailyDir, file));
    if (content) {
      journals.push({
        date: file.replace('.md', ''),
        content: content
      });
    }
  }
  
  res.json(journals.reverse());
});

// Get pedia journals (weekly)
app.get('/api/pedias/:id/journals/weekly', async (req, res) => {
  const weeklyDir = path.join(PEDIAS_DIR, req.params.id, 'journals', 'weekly');
  const files = await listFiles(weeklyDir);
  const journals = [];
  
  for (const file of files.slice(-4)) {
    const content = await readMarkdown(path.join(weeklyDir, file));
    if (content) {
      journals.push({
        week: file.replace('.md', ''),
        content: content
      });
    }
  }
  
  res.json(journals.reverse());
});

// Get wiki categories
app.get('/api/pedias/:id/wiki', async (req, res) => {
  const wikiDir = path.join(PEDIAS_DIR, req.params.id, 'wiki');
  const categories = await listDirs(wikiDir);
  
  const result = {};
  for (const cat of categories) {
    const files = await listFiles(path.join(wikiDir, cat));
    result[cat] = files.map(f => ({
      slug: f.replace('.md', ''),
      name: f.replace('.md', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }));
  }
  
  res.json(result);
});

// Get specific wiki page
app.get('/api/pedias/:id/wiki/:category/:slug', async (req, res) => {
  const pagePath = path.join(PEDIAS_DIR, req.params.id, 'wiki', req.params.category, `${req.params.slug}.md`);
  const content = await readMarkdown(pagePath);
  if (!content) return res.status(404).json({ error: 'page not found' });
  res.json({ slug: req.params.slug, category: req.params.category, content });
});

// Get full graph
app.get('/api/graph', async (req, res) => {
  const pedias = await readJSON('pairs.json');
  const connections = await readJSON('connections.json');
  res.json({ pedias, connections });
});

// Legacy endpoint
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
