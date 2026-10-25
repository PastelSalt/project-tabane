---
title: Sample · Countdown tiles
layer: ui-ux
origin: own-project
stack:
  - javascript
  - gsap
feature:
  - countdown
status: proven
target: website
reuseNote: "A page counts down to a scheduled event: launches, streams, releases."
liveSite:
  url: https://example.com/
  embeddable: true
repository:
  name: PastelSalt/sample-site
  url: https://github.com/PastelSalt/sample-site
codeLocation:
  path: src/js/countdown.js
  ref: a1b2c3d
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: heading, four countdown tiles and a button"
screenshots:
  - file: screenshot-1.svg
    alt: Screenshot of the countdown section
related:
  - sample-schedule-api
usedIn:
  - Sample fan site
shared: true
lastChecked: 2026-10-25
created: 2026-10-04
updated: 2026-10-25
---

## Technical details

One script reads the event time, works out the time left once a second and writes it into four tiles. When the time passes, the block switches to a "Live now" link.

- The event time is stored in UTC and shown in the visitor's own time zone.
- GSAP only animates the digit change; the countdown itself is plain JavaScript.

## Key code

```js path=src/js/countdown.js
// time left until the event, in whole seconds
const left = Math.max(0, Math.floor((target - Date.now()) / 1000));
const d = Math.floor(left / 86400);
const h = Math.floor((left % 86400) / 3600);
const m = Math.floor((left % 3600) / 60);
const s = left % 60;
```
