---
title: Aqua Iro · Splash with a title screen
layer: ui-ux
origin: own-project
stack:
  - astro
  - css
feature:
  - loader
status: proven
target: website
reuseNote: "A fan archive wants its loading screen to feel like starting a game: studio card, loading harbour, then PRESS START."
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/components/chrome/Splash.astro
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe of the title screen: key visual with her on the right, the logo on the left, PRESS START, a version line and a copyright line on the deep band"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the title screen with PRESS START on a first visit
related:
  - aqua-tide-shutter
  - aqua-onboarding-tour
  - kotoha-clover-loader
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

A loading screen in three beats ("出航準備" → title screen), shown once per browser session.

1. **Studio card:** 「制作 Moeko Works」 with the flowers blooming in (about 600 ms; first-ever visit only).
2. **The harbour:** her under-the-sea key visual, softly blurred; the logo and NOW LOADING bobbing like buoys; a tide gauge with the Moeko Works flower riding the waterline and the percentage; TIPS in the Talk box in her voice; a low band of the deep.
3. **Title screen** (first-ever visit, or a tour replay): the key visual comes into focus with her on the right and the logo on the left; PRESS START, a version line and a copyright line on the deep. No menu: "a website needs no continue or config".

- **Between beats** the tide comes in over the screen and goes back out, like the page-switch shutter; leaving, the deep surges over and drains away.
- **Later sessions** get beat 2 only (1.6–3.2 s). Skip (▸▸, Esc) always works.
- **No flash:** the pre-paint script sets `html[data-splash=seen]` when it already showed this session, which hides it before paint.
- **Motion OFF:** still frames, no studio beat, no tide.
- **State:** `aia:splash` in sessionStorage, `aia:title` in localStorage once the title screen has been seen; HELP's "Replay the tour" sets `aia:replay` so both come back.
