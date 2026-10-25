---
title: Kotoha · Scroll-driven reveals and far-section pausing
layer: ui-ux
origin: own-project
stack:
  - css
  - javascript
feature:
  - motion
  - performance
status: proven
target: website
reuseNote: Sections should rise in and art should drift as you scroll, without JavaScript per frame and without cost off screen.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/css/v2/motion.css
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: stacked sections, one rising into place, with notes on scroll-driven entrances and far sections pausing"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of a Kotoha section mid-page
related:
  - kotoha-scroll-life
  - kotoha-crossfade-backdrop
  - aqua-motion-budget
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Entrances, parallax and art camera moves as native CSS scroll-driven animations, plus a switch that stops every animation in sections far from view.

- **Progressive enhancement:** everything sits inside `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`; other browsers simply show the final state.
- **Classes:** `.reveal` rises in on entry and eases back on exit; `.reveal-pop` pops headings in; `.art-camera` pans and zooms artwork; `.deco-parallax` drifts decorations.
- **Title letter pops:** section titles pop in letter by letter the first time they are 60 % visible (`popTitlesOnArrival`), with an accessible hidden copy.
- **Far sections:** an IntersectionObserver in `main.js` toggles `.is-far` on sections more than a screen away, which sets `animation: none !important`, so off-screen loops cost nothing.
- **Why not `content-visibility`:** `content-visibility: auto` on sections hung Chrome during any View Transition, so `.is-far` is used instead.
- **Don't mix:** GSAP and a scroll-driven `transform` on the same element fight; GSAP animates wrapper columns instead.
