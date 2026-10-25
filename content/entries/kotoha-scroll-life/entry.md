---
title: "Kotoha · One scroll ticker: lean, marquee, progress"
layer: ui-ux
origin: own-project
stack:
  - javascript
  - css
feature:
  - motion
  - performance
status: proven
target: website
reuseNote: Several effects follow scrolling (tilt, a ticker ribbon, a progress meter) and the page must stay smooth on a weak laptop.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/public/motion/scroll-life.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: cards tilted slightly by scroll speed, a marquee ribbon across the bottom whose speed follows the scroll, and a progress meter in the nav"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's Home with the marquee ribbon at the bottom
related:
  - kotoha-scroll-reveals
  - kotoha-motion-calm-mode
  - hanon-cdp-test-harness
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

One `requestAnimationFrame` loop drives every scroll-linked JavaScript effect, and only while the page is scrolling.

- **The ticker** (`startScrollLife`): runs while scrolling plus 150 ms, then stops; computes a smoothed velocity and publishes it to subscribers (`onScrollVelocity`); caches the page height with a `ResizeObserver` for `pageProgress()`.
- **Lean:** cards marked `.lean` tilt up to ±2° with scroll speed. `--lean` is written only on cards that are on screen (IntersectionObserver plus a MutationObserver for cards added later), never on `<html>`, because a per-frame property on the root restyles the whole document.
- **Marquee** (`motion/marquee.js`): one looping Web Animation per ribbon on the compositor; scroll speed only changes its `playbackRate`, negative when scrolling up. It starts `HEADROOM` loops into its timeline, because an infinite animation played in reverse finishes at 0 and `play()` then throws (fixed 2026-10-25, ported from the Hanon site).
- **Rules that made it smooth:** no CSS transition on any property JavaScript changes every frame; no smooth-scroll library or snapping (both were removed for lag); off-screen and calm mode stop everything.
- **Hanon Fan Site:** The marquee's reverse-playback fix came from Hanon and has been in both sites since 2026-10-25.

## Key code

```js path=public/js/public/motion/scroll-life.js
function frame(t) {
  const y = window.scrollY;
  const dt = Math.max(8, t - lastT);
  const instant = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, (y - lastY) / dt));
  lastY = y;
  lastT = t;
  velocity += (instant - velocity) * 0.25;
  const calm = isCalm();
  if (!calm) lean += (Math.max(-MAX_LEAN, Math.min(MAX_LEAN, velocity * 1.4)) - lean) * 0.12;
  const settled = t - lastEvent > QUIET_MS && Math.abs(lean) < 0.01 && Math.abs(velocity) < 0.003;
  if (settled) { velocity = 0; lean = 0; }
  if (!calm && (settled ? written !== 0 : Math.abs(lean - written) > 0.004)) writeLean(lean);
  listeners.forEach((cb) => cb(velocity));
  raf = settled ? 0 : requestAnimationFrame(frame);
}
```
