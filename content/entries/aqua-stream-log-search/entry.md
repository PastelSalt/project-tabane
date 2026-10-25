---
title: Aqua Iro · Prerendered list, instant filter, lazy search
layer: ui-ux
origin: own-project
stack:
  - astro
  - typescript
  - fuse-js
feature:
  - search
  - statistics
status: proven
target: website
reuseNote: A static site lists hundreds of items that must filter instantly and search fuzzily, without loading a search library up front.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/lib/streams/filter.ts
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: a per-year heatmap and totals at the top, then year tabs, a search box and tag chips, then rows of streams with date, title, length and tags"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Aqua Iro Archive's stream log with its filters
related:
  - aqua-docking-filter-bar
  - aqua-data-build
  - aqua-time-travel
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The Streaming chapter's log of 639 archived streams (about 2,013 hours), fast on a static site.

- **Prerendered rows:** all 639 rows are in the HTML; filtering by year and tag only toggles `hidden` and must run in under 16 ms (`streams/filter.ts`).
- **Lazy fuzzy search:** a Fuse.js index is built at build time (`build-streams.ts` → `public/data/stream-search.json`) and loaded on the first focus of the search box.
- **Tags:** first-pass rules (`streams/tags.ts`) plus hand overrides (`data/overrides/stream-categories.yaml`).
- **Heatmap:** one SVG per year, drawing only days with streams; records and yearly totals beside it.
- **Honest numbers:** the page says counts are "as of 2026-10-11" and that 2018–2019 are undercounted because most of those streams were privated or deleted; dates are archive dates in JST.
