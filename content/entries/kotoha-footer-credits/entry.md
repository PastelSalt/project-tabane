---
title: Kotoha · Footer with maker card and merged credits
layer: ui-ux
origin: own-project
stack:
  - html
  - css
  - javascript
feature:
  - layout
status: proven
target: website
reuseNote: A fan site must credit every artist properly and quietly sign who made it, with links to sister sites.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/public/main.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: a scallop-edged footer with the logo and links on the left, credit columns in the middle, and a maker card and sister-site banner on the right"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's footer with credits and the maker card
related:
  - kotoha-masonry-lightbox
  - kotoha-scrapbook-design-system
usedIn:
  - Kotoha Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

A scallop-edged footer that credits every artist and signs the site.

- **Credits** (`renderFooterCredits`): artist credits merged from the static list in `data.js` (`CREDITS`, where `null` means "artist unknown") and from the gallery's published artworks; unknown artists are grouped under one line instead of repeated.
- **Maker card:** a quiet card for Moeko Works with a link to its contact form, plus banner links to the sister sites (the Hanon fan site).
- **Links:** official and social links, the JP/EN switch, and the non-affiliation disclaimer.
- **Friendly states:** lists everywhere use mascot state notes (`stateNote`) for empty and error states, each with a retry button.
