---
title: Aqua Iro · Motion system with a budget
layer: ui-ux
origin: own-project
stack:
  - css
  - typescript
  - gsap
feature:
  - motion
status: proven
target: website
reuseNote: A very animated site must stay smooth on a weak laptop, with one switch that stills everything.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/styles/motion.css
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the Events voyage rope with stops along it, ghost numbers, and notes on the four kinds of motion and the budget"
screenshots:
  - file: screenshot-desktop.webp
    alt: "Screenshot of the Events voyage timeline: the rope with its year ports and event cards on both sides"
related:
  - kotoha-motion-calm-mode
  - kotoha-scroll-reveals
  - aqua-filler-kit
  - aqua-tide-shutter
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Four kinds of animation, each with its own rules, behind one Motion switch (`docs/IMPROVEMENT-PLAN.md` §1.4).

- **Gate:** every animation sits behind `html[data-motion='on']`; reduced-motion devices start with Motion OFF.
- **Ambient loops** (marquee, motifs, bubbles, seams): transform and opacity only, at most 12 on screen, paused off screen (`offscreen.ts` sets `[data-offscreen]`).
- **Entrances** (title cards, section reveals): at most 700 ms, staggered by at most 240 ms; `reveal.ts` animates section-level blocks only (not single tiles, which left gaps on 190-tile galleries) and leaves anything already on screen alone.
- **Scroll-driven** (parallax, ghost numbers, the Events rope, filmstrip speed): CSS scroll-driven animations where supported, GSAP ScrollTrigger otherwise (the Events rope); one scroll listener for all chrome (`chrome-scroll.ts`).
- **Interaction** (hover tilt ±8° with glare, mouse and pen only; click sparkles; press squash): under 300 ms.
- **Budget** on a Ryzen 3 at 1366×649: scrolling ≥ 55 fps, idle main thread < 15 % busy, ≤ 40 KB of JS added per page, the bubble canvas ≤ 30 fps and ≤ 40 sprites; measured by `scripts/dev/perf.mjs`.
- **Odometer:** digits roll as strips of 0–9 moved with transform only, so masonry never re-lays out; screen readers get the plain number.
- **Lesson:** off-screen pausing must not freeze one-shot entrances (content appeared late or stayed invisible).
