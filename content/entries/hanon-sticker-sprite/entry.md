---
title: Hanon · Multi-shape recolourable sticker sprite
layer: ui-ux
origin: own-project
stack:
  - css
feature:
  - design-system
status: proven
target: website
reuseNote: A site needs several illustrated sticker shapes in many colour variants, placed anywhere, from one SVG sprite.
liveSite:
  url: https://hanon-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/hanon-fansite
  url: https://github.com/PastelSalt/hanon-fansite
codeLocation:
  path: public/assets/svg/v2-sprite.svg
  ref: 1e5d114
projectFile: hanon-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe style sheet: the seven sticker symbols in a row, then the penguin in several colour variants, and where each symbol is used"
screenshots:
  - file: screenshot-desktop.webp
    alt: "Screenshot of Hanon's About section: the ripple stage with the star and penguin stickers"
related:
  - hanon-sazanami-theme
  - kotoha-scrapbook-design-system
usedIn:
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

One SVG sprite of illustrated stickers, all drawn by one CSS class and recoloured through custom properties.

- **Seven symbols** in `v2-sprite.svg` (7.3 KB): `#pg-penguin` (pins, timeline markers, footer credits, social fallback, empty and error states, the mascot cameo, stream days, sleeve covers), `#star` (sparkles, gold timeline stars, the About stage), `#drop`, `#ripple` and `#shell` (decorations, the About ring, the fan-art title), `#spark` and `#heart` (kept from Kotoha).
- **One class, `.pg`:** used as `<svg class="pg"><use href="/assets/svg/v2-sprite.svg#pg-penguin"/></svg>`.
- **Colours through custom properties:** the penguin reads `--pg-body`, `--pg-shade` and `--pg-bow`; the other shapes read `--c1` (main), `--c2` (inner), `--c3` (light) and `--c4` (deep line), the same scheme as Kotoha's clovers.
- **Variants recolour both schemes at once:** `.pg--gold` (gold bow and gold star), `--pink`, `--mint`, `--lav`, `--navy`, `--pale`, `--white`. So any sticker can sit anywhere in any variant.
- **Why it matters:** Kotoha's sprite has one family (clovers); this is one class and one variable scheme for several different shapes.
- **Gotchas:** a `<symbol>` brings its own `viewBox`; adding another on the `<svg>` that uses it shifts the shape by half its size. Favicons can't use CSS variables or `<use>`, so the favicon is the penguin flattened to fixed colours by the image script.
