---
title: Kotoha · Click-to-load YouTube polaroid and film strip
layer: ui-ux
origin: own-project
stack:
  - javascript
  - css
feature:
  - video
  - cards
status: proven
target: website
reuseNote: A page shows YouTube videos without loading YouTube until the visitor asks, styled as a keepsake.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/public/render.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: a tilted polaroid with a video thumbnail and play button, a caption, and a film strip of five more videos below"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's video polaroid and film strip in the News section
related:
  - kotoha-content-crud-archive
  - kotoha-news-notes
usedIn:
  - Kotoha Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The latest video as a tilted polaroid that only loads YouTube when clicked, with a film strip to pick other videos.

- **Facade:** `videoPolaroid` renders a thumbnail button (from `i.ytimg.com`) with a play mark; nothing from YouTube runs until the click. Then it swaps in a `youtube-nocookie.com` iframe with autoplay (the privacy-enhanced domain; the CSP allows only that frame host).
- **Look:** a tilted polaroid with a shine sweep on hover; a caption underneath.
- **Film strip** (`filmFrame`): other videos as frames in a horizontal scroll-snap strip; picking one loads it into the polaroid. The strip is a paged list (`pagedList` with `axis: 'x'`), so more frames load as you scroll sideways.
- **Tracking:** `data-track` attributes are read in the capture phase, before the facade replaces itself, so video plays are still counted.
- Titles come from the admin's YouTube lookup (oEmbed), never typed twice.
