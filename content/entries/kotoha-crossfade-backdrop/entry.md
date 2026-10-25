---
title: Kotoha · Crossfading artwork backdrop
layer: ui-ux
origin: own-project
stack:
  - css
  - javascript
feature:
  - layout
status: proven
target: website
reuseNote: A one-page site wants a different artwork behind each section, changing smoothly as you scroll.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/public/motion/backdrop.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: one full-bleed artwork behind the page with content cards on top and a note that the art crossfades per section"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's About section over its own artwork
related:
  - kotoha-scroll-reveals
  - kotoha-clover-loader
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

One fixed layer behind the page holds an artwork per section and crossfades between them as you scroll.

- **Which art:** `startBackdrop(backdrop, sections, { onChange })` picks the section that crosses the middle of the viewport; that section's art fades in over 0.9 s.
- **Cheap:** faded art becomes `visibility: hidden`, so only one or two images are ever composited; a single `.backdrop__pan` layer pans with the page through a CSS scroll timeline (`scroll(root)`).
- **Readable:** a veil sits between the art and the content; cards use a solid 94 % fill instead of `backdrop-filter`, which was the most expensive effect on the page.
- **Section artwork** comes from the image pipeline at several widths plus 9:16 focal-point crops for phones.
