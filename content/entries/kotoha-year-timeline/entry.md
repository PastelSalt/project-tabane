---
title: Kotoha · Year-grouped timeline
layer: ui-ux
origin: own-project
stack:
  - javascript
  - css
feature:
  - timeline
status: proven
target: website
reuseNote: A list of achievements or events reads better grouped by year, without grouping the data first.
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
    alt: "Wireframe: a vertical stitched line with year pills and dated rows of text beside it, inside a scrolling box"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's achievements timeline
related:
  - kotoha-keyset-pagination
  - kotoha-record-sleeves
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

A stitched vertical timeline of achievements where a year pill appears whenever the year changes.

- **Grouping while rendering:** `achievementRows` remembers the last year it drew; when an item's year differs it returns two nodes (a year pill, then the row). The paged list accepts several nodes per item, so the grouping survives "load more".
- **Rows:** a dot on the stitched line, the date, the achievement text, and an optional link.
- **Scrollable box:** the list scrolls inside its own container (`tabindex="0"`, so it can be scrolled with the keyboard) and loads more as it nears the end.
- **Data:** achievements come from the admin's CRUD, newest first by keyset pagination.
