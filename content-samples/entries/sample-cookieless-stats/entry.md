---
title: Sample · Cookieless statistics
layer: backend
origin: own-project
stack:
  - nextjs
  - typescript
  - neon-postgres
feature:
  - statistics
status: proven
target: website
reuseNote: A site needs visit counts without cookies or a consent banner.
repository:
  name: PastelSalt/sample-portfolio
  url: https://github.com/PastelSalt/sample-portfolio
codeLocation:
  path: src/app/api/hit/route.ts
  ref: f00ba12
diagrams:
  - id: system
    level: 1
    title: System
    file: level-1-system.mmd
  - id: collector
    level: 2
    parent: system
    title: Collector
    file: level-2-collector.mmd
  - id: store
    level: 3
    parent: collector
    title: Store
    file: level-3-store.mmd
related:
  - sample-project-cards
usedIn:
  - Sample portfolio
shared: true
created: 2026-09-12
updated: 2026-10-21
---

## Technical details

Each page view sends one small request. The server hashes the day and the page path, drops known bots and adds one to that day's counter. No cookie or ID is stored.

- A visitor cannot be followed from one day to the next.
- The stats page only reads the daily totals.

## Key code

```ts path=src/app/api/hit/route.ts
// one visit: count it without knowing who it was
const key = hash(today() + path);
if (isBot(request)) return ok();
await counters.increment(key);
```
