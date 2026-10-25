---
title: Kotoha · Motion toggle and calm mode
layer: ui-ux
origin: own-project
stack:
  - javascript
  - css
feature:
  - motion
status: proven
target: website
reuseNote: A lively site needs a visible motion on/off switch that respects the device setting and never flashes.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/public/motion/prefs.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the nav pill with the Motion toggle highlighted and notes on when calm mode applies"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's Home with the Motion toggle in the nav
related:
  - kotoha-scroll-life
  - kotoha-clover-loader
  - kotoha-sparkles-confetti
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

A site-wide motion switch and the "calm" mode it turns on, timed to one tempo.

- **Before first paint:** `motion-boot.js` (a small classic file, because the CSP allows no inline scripts) sets `html[data-motion]` to `calm` when the device asks for reduced motion or the visitor stored `kf_motion=off`, else `full`.
- **API** (`motion/prefs.js`): `motionMode()`, `isCalm()`, `onMotionChange(cb)`, `setMotionOff(bool)`, `mountMotionToggles()`. The toggle is disabled when the device itself asks for reduced motion.
- **Calm mode:** idle loops stop, transitions shorten to 0.15 s, hovers flatten, View Transitions and lean turn off, confetti and sparkles never start. The loader keeps turning slowly, because it is the loading indicator.
- **One tempo:** `motion/beat.js` sets 128 BPM; every duration and stagger is expressed in beats (`beats(n)`, `beatsMs(n)`), so motion feels coordinated.
- **Property ownership:** `transform` belongs to scroll-driven keyframes, `translate`/`scale` to hover and tap, `rotate` to the resting tilt and lean, so effects never fight.
