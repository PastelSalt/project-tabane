---
title: Aqua Iro · Dialog lightbox
layer: ui-ux
origin: own-project
stack:
  - typescript
feature:
  - gallery
  - video
status: proven
target: website
reuseNote: An archive of art and videos needs one accessible viewer that works on every page and falls back to plain links.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/scripts/lightbox.ts
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: a dialog over a blurred backdrop with a large artwork, previous and next buttons, a close button and a credit bar along the bottom"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the Aqua Iro Archive lightbox open on an artwork
related:
  - kotoha-masonry-lightbox
  - aqua-filler-kit
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

One lightbox for images and videos across the site.

- **One `<dialog>`** opened with `showModal()`: a blurred mint backdrop (the deep, after the full update), a credit bar fixed at the bottom, focus returned to the trigger on close.
- **Delegated triggers,** so they work on every page after ClientRouter swaps: `<a data-lb="video" data-yt="…">` loads `lite-youtube` lazily; `<a data-lb="image" data-group="arts" data-srcset="…" data-credit="…" data-source="…">` shows the large image with its credit and source.
- **No JavaScript:** the anchors simply open YouTube or the image file.
- **Analytics:** opening a clip sends a typed event (`clip_open`) through the first-party Umami wrapper.
