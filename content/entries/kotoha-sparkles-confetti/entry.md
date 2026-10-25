---
title: Kotoha · Cursor sparkles, confetti and boing
layer: ui-ux
origin: own-project
stack:
  - javascript
  - canvas-confetti
feature:
  - motion
status: proven
target: website
reuseNote: A playful site wants a cursor trail, celebratory confetti and squishy taps, without slowing the page or annoying anyone.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/public/fx.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the About pose with a trail of small sparkles following the cursor and a confetti burst, with notes on when each plays"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's About pose, the main target for boing and confetti
related:
  - kotoha-motion-calm-mode
  - kotoha-profile-card
usedIn:
  - Kotoha Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Three small delights, all off in calm mode.

- **Cursor sparkles** (`motion/sparkles.js`): mouse only; a pool of four SVGs per shape (sparkle, heart, clover) in one `contain: strict` layer, reused round-robin; each `<use>` keeps its symbol, so nothing is re-pointed per move.
- **Confetti** (`fx.js`): canvas-confetti is injected with Subresource Integrity when the browser is idle after the loader (or on the first burst), with a 🍀 shape drawn from text and the site's colours. Bursts on the logo and the About pose, and twice on the special days (June 10 and July 8, Japan time).
- **Boing:** `boing(el)` is a Web Animations squash-and-tilt, no library.
- **Home intro:** GSAP slides the nav and Home columns in and spins the badge, timed in beats, animating wrapper columns only.
