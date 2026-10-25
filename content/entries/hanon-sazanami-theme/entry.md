---
title: Hanon · Sazanami Scrapbook re-theme
layer: ui-ux
origin: own-project
stack:
  - css
  - javascript
feature:
  - layout
  - design-system
  - loader
status: proven
target: website
reuseNote: "A sister site should share a design system but get its own identity: palette, stickers, loader shape, artwork."
liveSite:
  url: https://hanon-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/hanon-fansite
  url: https://github.com/PastelSalt/hanon-fansite
codeLocation:
  path: public/css/v2/tokens.css
  ref: 1e5d114
projectFile: hanon-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: Hanon's Home in the Sazanami theme: nav pill, left column with logo, socials and next-stream ticket, right column with news and video, and a note on the star loader"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Hanon's Home in the Sazanami theme
  - file: screenshot-phone.webp
    alt: Phone screenshot of Hanon's Home
  - file: screenshot-loader.webp
    alt: Screenshot of Hanon's star-and-penguin loader
related:
  - kotoha-scrapbook-design-system
  - kotoha-clover-loader
  - hanon-sticker-sprite
usedIn:
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

"Sazanami Scrapbook" (さざなみ, ripples): the Kotoha scrapbook system moved to Hanon's sky blue and penguin gold, with every layout, breakpoint and surface left as it was.

- **Tokens** (`css/v2/tokens.css`): the pink and green scales are replaced by a sky scale (50–900; 300 `#b7d7ef` is the page, 700 `#1f5e9e` the buttons, links and stickers) and a gold scale (700 `#a35f00` for the NEW stamp, ribbons and active link). Logo pink `#f898c0` is decorative only, never text. Paper `#f7fbff`, ink `#22324a`. Every colour pair's measured contrast is written next to it.
- **Section accents** picked from each artwork (Home gold, About pink, News café peach, Discography space lavender, Gallery balloon aqua); shadows tinted navy instead of pink; focus ring white + gold-700; a faint drops-and-ripples pattern instead of clovers.
- **Loader shape** (`motion/spinner.js`): a four-point star instead of the clover; progress fills four wedge "rays" between the diagonals (gold on a pale-blue star) instead of quadrants; a small penguin in the centre that never turns, because it sits in its own SVG outside the two turning stars. Same timing model, facts and iris exit as Kotoha.
- **About:** the full-body pose stands on a pale star with a ripple ring at her feet (`.ripple-stage`); the penguin sticker replaces the mascot.
- **Other swaps:** `.sticker--gold` for "coming soon", blue vertical text, a penguin progress meter in the nav, 🐧 confetti in blue, white and gold, special days March 6 and July 9 (JST).
- **Text sizes:** inherited 9–12 px labels raised so nothing readable is under 13 px.
- **Admin:** the refreshed admin uses the same theme mapping, with visitors in gold (`kotoha-admin-panel`).
- **Artwork:** 7 backgrounds for 5 sections and the loader; on the three-column Home the art is widened and cropped so her face sits between the columns.
