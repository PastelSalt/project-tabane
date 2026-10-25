---
title: Kotoha · Image pipeline with focal-point crops
layer: backend
origin: own-project
stack:
  - node-js
  - sharp
feature:
  - image-pipeline
  - export-pipeline
status: proven
target: website
reuseNote: A site with large artwork needs every size, phone crops centred on the subject, icons and a share image from one script.
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: scripts/optimize-images.js
  ref: 41d4bd8
projectFile: kotoha-fansite
diagrams:
  - id: system
    level: 1
    title: Image script
    file: level-1-system.mmd
related:
  - kotoha-crossfade-backdrop
  - kotoha-clover-loader
usedIn:
  - Kotoha Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

One script turns the original artwork into everything the site serves.

- **Section and loader art:** WebP at several widths for `srcset`.
- **Phone crops:** portrait 9:16 versions centred on a focal point set per image, so faces stay in frame on phones.
- **UI images:** logos and poses at 1x and 2x.
- **Icons:** favicon as SVG and PNG, and an apple-touch icon.
- **Share image:** an Open Graph image composited from artwork and the logo.
- **Inputs stay untouched:** originals live in `assets/`, outside `public/`, and `.vercelignore` keeps them out of the deploy (patterns must start with `/`: an unanchored `assets` also removed `public/assets`).
- **Rebuild:** `npm run images:optimize` skips up-to-date files; `-- --force` rebuilds everything.
