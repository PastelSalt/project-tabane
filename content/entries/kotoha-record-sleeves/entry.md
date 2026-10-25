---
title: Kotoha · Record sleeves and coming-soon cards
layer: ui-ux
origin: own-project
stack:
  - javascript
  - css
feature:
  - cards
  - countdown
status: proven
target: website
reuseNote: A discography should feel like records on a shelf, with upcoming releases counting down.
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
    alt: "Wireframe: a row of square record sleeves, one with its vinyl sliding out, and a wide coming-soon card with days left"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's discography with record sleeves
related:
  - kotoha-content-crud-archive
  - kotoha-year-timeline
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Releases shown as record sleeves, plus cards for releases that aren't out yet.

- **Sleeves** (`releaseSleeve`): cover art in a square sleeve; on hover a vinyl disc slides out to the side. Type (single, album, EP, tie-in, cover, collab) as a label, date, and links.
- **No art yet:** a designed placeholder cover (title on a patterned sleeve) instead of an empty box.
- **Coming soon** (`home.js` `renderSoon`): the nearest future release appears as a mini card on Home and a wide card in Discography, with the number of days left.
- **Data:** releases come from the admin's config-driven CRUD; a future date is all it takes to show as coming soon.
