---
title: Aqua Iro · Harbour design system
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
reuseNote: A dense, decorated site needs one rule that decides where patterns, reading surfaces and the big dark band go.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/styles/tokens.css
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe of the three layers: the patterned wash, paper cards on top, and one navy deep band with a glowing wave crest across the page"
screenshots:
  - file: screenshot-desktop.webp
    alt: "Screenshot of Aqua Iro Archive's Discography head: the chapter title and a paper record card over the faded key visual on the wash"
related:
  - aqua-filler-kit
  - kotoha-scrapbook-design-system
  - aqua-tide-shutter
  - himawari-sticker-design-system
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

"The site is a harbour, and Aqua's colours are the sea" (`docs/FULL-UPDATE-PLAN.md`): everything belongs to one of three layers.

- **The wash:** the pastel seigaiha (wave) ground with drifting motifs; the only place for patterns, motifs and ghost numbers.
- **Paper:** everything you read sits on paper (cards, tickets, notes, drawers), pinned or taped; no patterns or ghost numbers on paper.
- **The deep:** navy water with a pink-to-cyan glow on its crest and wave edges top and bottom. **Exactly one deep band per chapter page**, on its headline block, and the same deep *is* the page-switch and loading animation.
- **Colour roles:** ink = navy; the Aqua palette (pink → cyan) is the signature (crest, progress, active states, splash); a chapter tint only marks which chapter it is (dock pill, banner card bar, ticket tape), never a big background.
- **Tilt rule:** paper you read is straight; small grouped cards may tilt −2° to +2°; stickers, stamps and the eyecatch ticket up to ±12°; nothing else tilts.
- **Two card shapes:** the banner card (icon + title + small line + tint bar: maker card, sister sites, Prev/Next, the shutter ticket) and the content card (a paper block with optional tape or pin).
- **"Aqua talks":** one speaking component (the Home dialogue box) reused for loading, empty and error states (`AquaWait.astro`).
- **Tokens** (`tokens.css`): brand pinks, blues, mint, navy, lavender, paper `#fffbfe`; text-safe pairs checked at WCAG AA by `scripts/contrast-check.ts` in CI; per-chapter tints and dock icon fills; the `--iro` and `--wash` gradients; a fluid type scale (360 → 1600 px); a 4 px spacing scale; radii up to a dog-eared note.
- **Icons:** one inline SVG sprite (`Sprite.astro`) plus Phosphor duotone icons copied in at build time, their fill layer tinted by CSS variables.
