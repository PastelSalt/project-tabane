---
title: Kotoha · Profile card and clover stage
layer: ui-ux
origin: own-project
stack:
  - html
  - css
feature:
  - cards
status: proven
target: website
reuseNote: An About section with a character standing on a big illustrated shape and a neat fact card beside it.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/public/main.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: a character on a big clover shape on the left, a stitched profile card with name, pills and a fact list on the right"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's About section with the profile card and the clover stage
related:
  - kotoha-bilingual-i18n
  - kotoha-sparkles-confetti
usedIn:
  - Kotoha Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The About section: a stitched profile card of facts beside the character standing on a big illustrated clover.

- **Profile card** (`.profile`, `.facts`): name, kana, role pills and a fact list rendered by `renderAbout` from the locale files (`about.pills`), so both languages come from the same data.
- **Clover stage** (`.clover-stage`): the full-body pose stands on a large sprite clover; the pose is a button, and tapping it does a squash (`boing`) and a small confetti burst (full motion only).
- **Mascot cameo:** the mascot sticker peeks from the card's corner.
- **No invented quotes:** speech bubbles are the site's voice, never words put in Kotoha's mouth.
