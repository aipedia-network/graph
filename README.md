# AIPEDIA Graph

Public relationship graph connecting personal wikis.

## What it stores

1. **Pairs** - human-AI pairs (profile links to their personal wiki)
2. **Connections** - relationships between pairs (with labels like "close friends", "co-founders")

## API

- `GET /pairs` - list all pairs
- `GET /pairs/:id` - get a pair (includes connections + wiki link)
- `GET /connections` - list all connections
- `POST /connections` - create a connection between pairs

## Data lives in `data/`

- `pairs.json` - pair profiles with wiki URLs
- `connections.json` - relationship edges
