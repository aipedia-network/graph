## One-Liner

A social network of AI personal wikis (known as "pedias"). Every person has their own AIpedia (Ameliapedia, Maddiepedia, Amypedia), authored mostly by AI from real signals. AIpedia is the protocol that wires these wikis together into a real graph - so if Amelia and Maddie are friends, Ameliapedia and Maddiepedia are friends too.


## The Problem

People are increasingly building personal wikis. As AI gets better at writing people from real signals - texts, daily notes, calendar, conversation transcripts - the personal wiki is emerging as the truest representation of the self in an AI world.

But to understand a person, you need to understand their world. Their friends, their collaborators, their family, their mentors. Who they know, how they know them, what they share.

Today's personal wikis are isolated. Maddie has Maddiepedia. Amelia has Ameliapedia. Amy has Amypedia. Each contains rich information about its owner, and even mentions the others by name - but there's no protocol that wires them together. No notion of two AIpedias being "friends", corresponding to the real life relationship. No way for a wikilink to Maddie Wang inside Ameliapedia to resolve into Maddiepedia. No way to traverse from one person to the people they actually know.

We're building that protocol.


## The Vision

A network of personal wikis that know about each other. AIpedia (the protocol) lets these wikis declare relationships, link entries across each other, and gate visibility per viewer.

**Wikis are the truest representation of the self, in an AI world.**

If Amelia and Maddie are friends, then Ameliapedia and Maddiepedia are friends too. A wikilink to Maddie Wang inside Ameliapedia resolves into Maddiepedia, with Maddie's permissioning rules deciding what the viewer (Amelia) gets to see. Shared entities like Maddie Wang & Amelia Lin live canonically in one place, with each owner free to extend them privately.

When someone wants to know you - a new collaborator, a date, a parent, an agent - they can read your AIpedia. When you want to know who you're meeting, you traverse the graph. Friends-of-friends becomes a real query.


## Mental Model

Personal wikis are the nodes. AIpedia is the wiring.

Think of each AIpedia as what Wikipedia would look like if it were about you, written by your AI - structured prose, frontmatter categories, wikilinks, redirects, lead-as-TLDR. AIpedia (the protocol) is the layer on top that turns a collection of these wikis into a social network: how two wikis declare friendship, how a link in mine resolves into yours, how visibility gets enforced when you read mine.


## Co-Founders

AIpedia is being built collaboratively by Maddie Wang, Amelia Lin, and Amy Zhou, known as the AIpedians, founded at a meetup in Dolores Park on 2026-05-02. Each co-founder is building her own AIpedia in parallel; the protocol layer (shared schema, cross-pedia linking, permissioning) is the joint product.


## The Node: What Each Pedia Looks Like

Each personal wiki ("Ameliapedia," "Maddiepedia," "Amypedia") follows the conventions defined in Wiki.md. Full per-pedia spec is deferred. Starter rules in place:

- One file per named entity. Stubs are fine and encouraged.
- Frontmatter: `category:` (single-valued), `tags:` (array, includes category + descriptors), `aliases:` for redirect-style alternate names.
- Wikipedia conventions: bold the subject on first mention, lead paragraph as TLDR, "See also" for related links, "External links" at the bottom.
- Liberal `wikilinks`. Every named entity is linkable. Always stub on first mention.
- Categories grow as needed: `person`, `relationship`, `community`, `project`, `place`, `era`, `event`, `pattern`, `artifact`.

Authorship rules (AI-written, human-curated) will be documented in Wiki.md.


## The Graph (Social Network Layer)

The product is the network, not any individual AIpedia.

- Each AIpedia is a node. Cross-pedia wikilinks are edges.
- **Shared schema across all AIpedias.** Strict enough that the graph resolves cleanly across owners.
- **Shared entities live canonically on AIpedia.** Relationships (Maddie Wang & Amelia Lin), communities, events, mutual friends, places - one canonical entry, owned by no single AIpedia. Each AIpedia can extend a canonical entry with private content (e.g., Amelia storing private context on her relationship with Maddie inside Ameliapedia).
- Discovery is graph-native by default: you find new AIpedias by traversing edges from people you know. (See Hosting and Distribution for the index layer.)


## Privacy and Permissioning

A core design constraint, not a TODO.

- **Visibility primitives: public / friends / private.** Per-entry, declarative.
- **No sensitive contact info in entries by default.** Phone numbers, addresses, etc. should be private fields, not free-form prose.
- **Connections are double opt-in.** Friend-request semantics, not follow semantics. One person sends a request; the other must accept before either AIpedia treats them as "friends" for visibility purposes.
- **Permissioning protocol** is being scoped now. Lives in the shared schema so all AIpedias enforce the same rules at render time.

## Hosting and Distribution

- Source of truth: a markdown repo per owner, pushed by the owner's agent.
- Each AIpedia deploys to a per-person URL. Current live examples: maddiewang.com/wiki5
- Static-site hosting (Vercel today; portable to any static host).
- **Public index of AIpedias** at the network level - an opt-in registry that lets people discover AIpedias beyond pure graph traversal. Index visibility itself is a per-owner choice.
- Cross-pedia links resolve across domains via shared schema. Mechanism TBD - this will be important.


## Naming Convention

| Concept                   | Name                                                 |
| ------------------------- | ---------------------------------------------------- |
| The protocol / network    | **AIpedia**                                          |
| An individual wiki        | **Pedia** - e.g., Ameliapedia, Maddiepedia, Amypedia |
| The community of builders | AIpedians                                        |


## Inspiration

- **Andrej Karpathy** on AI-native software and the human-as-director model (via [Farza](https://x.com/FarzaTV/status/2040563939797504467)).
- **Wikipedia's editorial conventions** - applied to personal context.
- **Social graphs of social networks** - but with content optimized for an AI future.


## Core Design Principles

| Principle                 | What it means                                                  | Why                                                            |
| ------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| **Wiki-first**            | Personal wikis already exist or are emerging; we connect them | The protocol is the novelty, not the wiki                      |
| **Plural by default**     | Many AIpedias, not one                                         | A network, not a wiki                                          |
| **Per-person ownership**  | Each owner controls her AIpedia and its source repo            | Author authority; no central editor wars                       |
| **Permissioned by entry** | Visibility is per-entry and per-viewer                         | Privacy is a feature, not a postscript                         |
| **Graph-native**          | Cross-pedia wikilinks resolve into a real graph                | Friends-of-friends, communities, relationships are first-class |
| **Wikipedia-shaped**      | Lead-as-TLDR, See also, External links, redirects              | A century of editorial conventions, free                       |
| **Static-deployable**     | Plain markdown to static site                                  | Cheap, portable, AI-readable                                   |


## What This is NOT

- **Not Wikipedia.** Pedias are about you and everyday people, vs notable strangers.
- **Not LinkedIn.** Multi-faceted, includes personal as well as professional, AI-authored.
- **Not a journaling app.** Pedias are entity-shaped (person, relationship, project), not time-shaped.
- **Not a CRM.** Reflects you as a person, vs a tool, though it can and will enable tools to run off of it.

## Open Questions

- **Write authority.** Can other owners' agents propose edits to your AIpedia, or only your own agent? (e.g., Maddie's agent updating Ameliapedia's Maddie Wang entry.)
- **Identity verification.** Double opt-in is the connection model, but how does a viewer prove who they are at read time to unlock friends-only entries? (OAuth? Magic link? Wallet? Something new?)
- **Index gating.** What does opt-in to the public index actually look like, and how does the registry handle abuse (impersonation, squatting on names)?

## Next Steps

1. Lock the per-pedia spec (separate doc, build out within Wiki.md).
2. Define the shared schema (frontmatter, categories, link format) all founders' AIpedias will validate against.
3. Permissioning protocol v0.
4. First cross-pedia graph test: bidirectional link, e.g. between Amelia Lin in Maddiepedia and Maddie Wang in Ameliapedia.
