---
title: Himawari · Sunflower sticker design system
layer: ui-ux
origin: own-project
stack:
  - css
  - astro
feature:
  - design-system
  - layout
status: proven
target: website
reuseNote: A product site wants a warm, friendly look with one accent, where what you can click is obvious and motion can be turned off everywhere at once.
liveSite:
  url: https://himawari-moekoworks.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/styles/tokens.css
  ref: 4eb655c
projectFile: himawari-website
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe of the sticker style: a pill section title on a rule, sticker buttons with offset shadows, a window frame with a yellow offset shadow and a title bar with three dots, a thin-bordered card and flower ornaments"
screenshots:
  - file: screenshot-desktop.webp
    alt: "Screenshot of the Himawari home page top: header, pill-styled nav, the hero with sticker buttons and the Studio window with its sunflower offset shadow"
related:
  - aqua-harbour-design-system
  - kotoha-scrapbook-design-system
  - himawari-product-home
usedIn:
  - Himawari Website
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Taken from nanahira.jp's layout and re-coloured to the logo's sunflower (`WEBSITE.md` §6.1).

- **Paper and one accent:** warm paper `#FFFCF2`; sunflower yellow (`--sun #f5d57c`) only for fills, highlights and shadows, **never text on light**; body text `#45404D` (9.77:1), headings `--ink`, dates and captions `--gray-500` only.
- **Rule of weight:** thick 2.5 px black outlines only on things you click and on window frames; 1.5 px on pills and small controls; 1 px on cards.
- **Sticker button:** thick outline and an offset shadow (`4px 5px 0`) that closes up when pressed; `primary` yellow with a black shadow, `ghost` white with a yellow shadow, `wide` the pale-yellow full-width "more" button.
- **Window frame:** thick outline, a sunflower offset shadow (`8px 10px 0`), a pale-yellow title bar with three dots; can be one labelled image to assistive technology.
- **Pill section title:** one capitalised word in a thin double-line pill on a full-width rule; each letter its own span so it can pop in, while screen readers hear the label once.
- **Ornaments:** the logo's five-petal flower drawn in SVG (yellow with a dark centre, or white with a yellow centre) between sections.
- **One dark band** per page (the coming-soon band); **one moving thing per screen**; light theme only.
- **Labels in capitals stay English** in both languages, with the Japanese name under them in the phone menu.
- **Motion switch:** a pre-paint script reads `hws:prefs`, falls back to `prefers-reduced-motion` and sets `html[data-motion]`; **`?still` in the address turns motion off for that visit without saving it**. The duration tokens (`--dur-1/2/3`: 120, 220, 700 ms) are **set to 0 ms when Motion is off**, so every transition built on them stops at once.
- **Tokens:** fluid type steps (≈ 12 px to ≈ 52 px), a 1000 px column, a 3 px black focus ring with a 2 px white gap; every text pair checked at WCAG AA by `scripts/contrast-check.ts` in CI.
- **Icons:** one inline sprite with Phosphor icons copied in at build time; `.icon--duo` makes them black with a solid sunflower fill. No emoji anywhere.
