---
title: Aqua Iro · Filler kit and "no empty area" test
layer: ui-ux
origin: own-project
stack:
  - astro
  - css
feature:
  - layout
  - testing
status: proven
target: website
reuseNote: A design that should feel full needs a measurable rule for empty space and one set of parts to fill it.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/styles/fill.css
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: a page with side rails in both margins, a ghost number behind a section, a wave seam between sections, a postcard at the end of a masonry column, and drifting motifs"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Aqua Iro Archive's Clips page with seams, stickers and ghost numbers filling the space
related:
  - aqua-harbour-design-system
  - aqua-chapter-skeleton
  - aqua-motion-budget
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

"No empty area", turned into a test and a kit (`docs/IMPROVEMENT-PLAN.md` §1.2–1.3).

- **The test:** split a screenshot into 120×120 px cells; a cell is empty when its pixels hardly vary (standard deviation under about 6). Target: at most 8 % empty cells per screen, at 1366×649, 1920×953 and 390×664, top to bottom (`scripts/dev/fill.mjs`, with a heat map of the empty cells).
- **Side rails** (`SideRails.astro`, ≥ 1440 px): a filmstrip of the chapter's official art drifting up in the left margin; the vertical chapter title and a running percentage in the right.
- **Credit rails** (`CreditRails.astro`): a slow credits roll beside the text pages (Credits, Privacy).
- **Ghost numbers:** huge outlined numbers at low opacity behind sections.
- **Section seams** (`Seam.astro`): wave, tilted ticker or rope with buoys between sections, rotating so pages don't repeat.
- **Motif field** (`Motifs.astro`): anchors, bubbles, stars, hearts and ribbons at fixed positions, each a compositor-only CSS loop, paused by Motion OFF.
- **Stickers and stamps** on card corners; **postcards** (`Postcard.astro`) at the end of masonry columns so they don't end on bare space; fan-written lines are labelled as such.
- **Ambient key visual** behind each title card.
