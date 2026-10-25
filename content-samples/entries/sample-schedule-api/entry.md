---
title: Sample · Schedule API
layer: backend
origin: own-project
stack:
  - node-js
  - typescript
feature:
  - countdown
  - admin-panel
status: proven
target: website
reuseNote: A site needs a small list of upcoming events that an admin can edit.
repository:
  name: PastelSalt/sample-site
  url: https://github.com/PastelSalt/sample-site
codeLocation:
  path: api/schedule.ts
  ref: a1b2c3d
diagrams:
  - id: system
    level: 1
    title: System
    file: level-1-system.mmd
  - id: schedule-api
    level: 2
    parent: system
    expands: api
    title: Schedule API
    file: level-2-schedule-api.mmd
related:
  - sample-countdown-tiles
usedIn:
  - Sample fan site
shared: false
created: 2026-10-04
updated: 2026-10-20
---

## Technical details

The admin panel saves events to a JSON file. A small route returns the next event, which the countdown tiles read.
