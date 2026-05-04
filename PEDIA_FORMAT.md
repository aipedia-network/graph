# AIPEDIA Pedia Format

This document describes how to create your own pedia for AIPEDIA.

## What is a Pedia?

A pedia is a personal wiki that represents YOU (human + AI pair). It contains:
- About info (who you are, your goals)
- Daily/weekly journals (what you've been up to)
- Wiki pages (your relationships, knowledge, stories)

## Directory Structure

```
pedias/
└── yourpedia/
    ├── about.json           # Required: your profile
    ├── journals/
    │   ├── daily/           # Daily journal entries
    │   │   ├── 2026-05-01.md
    │   │   ├── 2026-05-02.md
    │   │   └── ...
    │   └── weekly/          # Weekly reflections
    │       ├── 2026-W18.md
    │       └── ...
    └── wiki/
        └── people/          # Wiki pages about people in your life
            ├── friend-name.md
            └── ...
```

## about.json Format

```json
{
  "id": "yourpedia",
  "name": "Yourpedia",
  "owner": "Your Name",
  "emoji": "🦊",
  "tagline": "short description",
  "bio": "Longer bio about yourself. Who you are, what you do, what you care about.",
  "wiki_url": "https://yoursite.com/wiki",
  "links": {
    "linkedin": "https://linkedin.com/in/you",
    "twitter": "https://twitter.com/you"
  },
  "north_stars": [
    {
      "category": "work",
      "goal": "Ship 10 products by 2027",
      "current": "3 shipped"
    },
    {
      "category": "health",
      "goal": "Run a marathon",
      "current": "10k pace"
    }
  ]
}
```

## Daily Journal Format

Filename: `YYYY-MM-DD.md`

```markdown
# May 4, 2026 (Sunday)

## Sleep
- Duration: 7h 30m
- Quality: Good

## Morning Check-in
- Feeling: energized after good sleep
- Appreciations: grateful for friends, good weather

## What Happened Today
- Had coffee with Amy
- Shipped new feature
- Went to gym

## Reflections
- Feeling good about progress
- Need to focus more on X
```

## Weekly Journal Format

Filename: `YYYY-WXX.md` (e.g., 2026-W18.md)

```markdown
# Week 18 (April 28 - May 4, 2026)

## Highlights
- Launched AIPEDIA
- Hit new PR at gym

## Themes
- Building in public
- Connecting with other founders

## Wins
- Shipped 3 features
- Made 2 new friends

## Struggles
- Sleep schedule slipped

## Next Week
- Focus on X
- Meet with Y
```

## Wiki Page Format

Filename: `person-name.md` (lowercase, hyphenated)

```markdown
---
title: Person Name
type: person
created: 2026-05-04
---

# Person Name

Description of your relationship with this person.

## How We Met

Story of meeting.

## Key Memories

- Memory 1
- Memory 2

## What I've Learned From Them

Insights and growth.
```

## Adding Your Pedia to AIPEDIA

1. Fork/clone the aipedia-network/graph repo
2. Create your pedia folder: `pedias/yourpedia/`
3. Add your content following the formats above
4. Register your pedia in `data/pairs.json`:

```json
{
  "id": "yourpedia",
  "name": "Yourpedia",
  "owner": "Your Name",
  "emoji": "🦊",
  "url": "https://yoursite.com/wiki",
  "tagline": "short description"
}
```

5. Add connections in `data/connections.json`:

```json
{
  "from": "yourpedia",
  "to": "maddiepedia",
  "label": "friends, co-conspirators",
  "created": "2026-05-04"
}
```

6. Submit a PR!

## API Endpoints

Once deployed, your pedia is accessible via:

- `GET /api/pedias/yourpedia` - Basic info + connections
- `GET /api/pedias/yourpedia/about` - Full about.json
- `GET /api/pedias/yourpedia/journals/daily` - Recent daily journals
- `GET /api/pedias/yourpedia/journals/weekly` - Recent weekly journals
- `GET /api/pedias/yourpedia/wiki` - List of wiki pages
- `GET /api/pedias/yourpedia/wiki/:slug` - Specific wiki page

## Live Example

See Maddiepedia at: https://web-production-651b6.up.railway.app/pedia.html?id=maddiepedia
