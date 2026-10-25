---
title: Kotoha · Clover Scrapbook design system
layer: ui-ux
origin: own-project
stack:
  - css
feature:
  - layout
  - design-system
status: proven
target: website
reuseNote: "A cute, dense Japanese fan-site look is wanted: paper, stitching, tape, stickers and big numbered section titles, all from tokens."
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/css/v2/tokens.css
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe style tile: colour swatches, a tilted paper card with tape, a sticker, a stamp, a speech bubble, a numbered section title and a stitched card"
screenshots:
  - file: screenshot-desktop.webp
    alt: "Screenshot of Kotoha's News section: paper notes, stamps and a numbered section title"
related:
  - kotoha-crossfade-backdrop
  - kotoha-news-notes
  - kotoha-profile-card
  - kotoha-admin-panel
  - hanon-sazanami-theme
  - hanon-sticker-sprite
  - aqua-harbour-design-system
  - himawari-sticker-design-system
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The "Clover Scrapbook" design system (`docs/DESIGN_SYSTEM.md`): one token file, cascade layers, and a small vocabulary of paper surfaces.

- **Tokens** (`css/v2/tokens.css`): pink and clover-green scales, paper `#fffaf2`, ink and ink-soft, tinted shadows, a type scale and radii; every colour pair's contrast noted.
- **Cascade layers:** base, components, sections, layout and motion live in named layers, so overrides are predictable.
- **Surfaces** (`components.css`): paper cards, stitched (dashed) borders, washi tape, die-cut stickers, stamps, speech bubbles, labels; paper textures, grain and pattern fills.
- **Section title block:** dense numbered EN/JA headings (`.sec-title`, `.mini-title`), giant outlined background words (`.bg-word`), vertical Japanese taglines (`.v-text`) and a rotating circular text badge (`.badge-round`, its text path inline because `textPath` can't reference an external sprite).
- **Sprite:** one SVG sprite of clover and UI symbols, recoloured with CSS variables (`--c1`…`--c4`). Never put `--` in a sprite comment: it silently breaks the whole sprite.
- **Rules learned:** keep `[hidden] { display: none !important }` (grid overrides `hidden`); apply Japanese line-height to body text only, or display titles stretch.
- The Hanon fan site re-themes the same system (`hanon-sazanami-theme`), and the admin panel reuses its tokens in a calmer form.
- **Hanon Fan Site:** Hanon re-themes the whole system as Sazanami Scrapbook (`hanon-sazanami-theme`) with one multi-shape sticker sprite (`hanon-sticker-sprite`).
