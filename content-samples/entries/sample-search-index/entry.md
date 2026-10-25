---
title: Sample · Search index
layer: backend
origin: created-for-tabane
stack:
  - typescript
feature:
  - search
status: candidate
target: website
reuseNote: A small site needs text search without a search service.
diagrams:
  - id: system
    level: 1
    title: System
    file: level-1-system.mmd
related: []
usedIn: []
shared: false
created: 2026-10-19
updated: 2026-10-19
---

## Technical details

At build time, titles and notes are split into words and stored in a map from word to pages.
