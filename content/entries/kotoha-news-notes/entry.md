---
title: Kotoha · Paper news notes
layer: ui-ux
origin: own-project
stack:
  - javascript
  - css
feature:
  - cards
status: proven
target: website
reuseNote: News items should look like pinned paper notes, with recent ones stamped NEW and up to three link chips.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/public/render.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: three paper news notes in a row, each with a date chip, headline, summary and link chips, one stamped NEW and pinned"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's news notes
related:
  - kotoha-keyset-pagination
  - kotoha-scrapbook-design-system
usedIn:
  - Kotoha Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

News items rendered as paper notes pinned or taped to the page.

- **Builder:** `newsNote` builds each note from the API row with `el()` and `textContent` only (database text never goes through `innerHTML`).
- **Parts:** a date chip, the headline, a short summary, a **NEW** stamp when the item is 45 days old or less (`isRecent`), a pin or washi tape, and up to three link chips (watch, listen, details, tickets, official, shop) from a fixed label list.
- **Tracked links:** each chip carries `data-track` attributes, so news-link clicks show up in the statistics.
- **Paging:** the list is a keyset-paged list that loads more as you scroll, with a friendly retry note on errors.
- **Lean:** notes carry `.lean`, so they tilt slightly with scroll speed (the single scroll ticker).
