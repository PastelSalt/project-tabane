---
title: Kotoha · Clover loader with real progress
layer: ui-ux
origin: own-project
stack:
  - html
  - css
  - javascript
feature:
  - loader
status: proven
target: website
reuseNote: A site needs a loading screen that shows real progress, paints before any script, and can never trap a visitor.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/public/loader.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: full-screen loader art, two turning clovers in the centre with petals filling, a wavy Loading line and a rotating fact"
screenshots:
  - file: screenshot-desktop.webp
    alt: "Screenshot of the Kotoha loader: the clover spinner over loader artwork"
related:
  - kotoha-crossfade-backdrop
  - kotoha-motion-calm-mode
  - hanon-sazanami-theme
  - aqua-splash-title-screen
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

A loading screen that is static markup in `index.html`, so it paints and spins before any JavaScript arrives, then reports real progress and opens like an iris onto the page.

- **Spinner:** two filled clovers in inline SVG; the outer turns every 4 s, the inner the other way every 2.5 s, as CSS animations from the first paint. Calm mode slows them (12 s / 8 s) but keeps them turning, because they are the loading indicator.
- **Real progress:** the inner clover's four quadrant rectangles, clipped to the clover path, scale in clockwise as tasks finish (`setProgress(finished / total)`).
- **Timing model:** `waitForAssets({ tier1, tier2 })` returns when at least 3 s have passed **and** tier 1 is done **and** (tier 2 is done **or** 6 s have passed), or at a 10 s cap. A failed task counts as done; the page shows fallbacks.
- **Tiers:** tier 1 = language, fonts, GSAP (≤ 6 s), Home art and Home data (≤ 4 s); tier 2 = other artwork, the pose, all lists, the first gallery page.
- **Text:** "Loading…" as a wave of per-character spans (screen readers get a hidden plain copy); "Did you know?" facts from the About data rotate every 2.8 s.
- **Exit:** all petals lit → a fast spin → a circular iris opens from the clover's centre (`--iris` mask with `@property`) → the loader leaves the DOM. Calm mode or no `@property`: a fade.
- **Never traps anyone:** an inline `<style>` fades the loader after 12 s even if no script runs, and `boot().catch` hides it on errors.
- **Random art:** `prepaint.js` picks one of three loader artworks (`data-loader-art`) before paint.
- **Hanon Fan Site:** Hanon's variant: a four-point star with gold rays and a still penguin in the centre (`hanon-sazanami-theme`).

## Key code

```js path=public/js/public/loader.js
export async function waitForAssets({ tier1, tier2 }) {
  const start = performance.now();
  const elapsed = () => performance.now() - start;
  const total = tier1.length + tier2.length;
  let finished = 0;
  const run = (tasks) => Promise.allSettled(tasks.map((fn) => Promise.resolve().then(fn).finally(() => {
    finished += 1;
    spinner?.setProgress(finished / total);
  })));
  const t1 = run(tier1);
  const t2 = t1.then(() => run(tier2));
  await Promise.race([
    (async () => {
      await t1;
      await Promise.race([t2, sleep(SOFT_MS - elapsed())]);
    })(),
    sleep(CAP_MS),
  ]);
  await sleep(MIN_MS - elapsed());
  return Math.round(elapsed());
}
```
