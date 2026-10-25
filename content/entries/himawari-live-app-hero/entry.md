---
title: Himawari · Live app-window hero
layer: ui-ux
origin: own-project
stack:
  - astro
  - typescript
feature:
  - motion
status: proven
target: website
reuseNote: "A product site shows what the app does in its hero without a video: a small live recreation of the app's window."
liveSite:
  url: https://himawari-moekoworks.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/scripts/hero.ts
  ref: 4eb655c
projectFile: himawari-website
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe of the Studio window: a title bar, a screenplay row with speaker, mood chip and a line being typed, and beside it a tiny game scene with a character and a textbox showing the same line"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the live Studio window in the Himawari hero, showing its finished first line
related:
  - himawari-product-home
  - himawari-sticker-design-system
usedIn:
  - Himawari Website
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

An HTML/CSS recreation of Himawari Studio in the hero (`StudioScene.astro`), driven by a small script (`hero.ts`).

- **The scene:** a screenplay row (speaker, mood chip, typed text, caret, add buttons) beside a tiny game (sky, field, a character with a face, a textbox).
- **The loop:** a line types itself into the screenplay row and the game's textbox together (42 ms per character, `[...text]` so Japanese counts by character), holds 1.7 s, then the mood chip and face change with a small bump (Web Animations) and the next line starts; three lines loop.
- **Still state first:** the page is server-rendered with the first line finished, which is what Motion OFF shows; turning Motion off puts that line back.
- **Stops when unseen:** an IntersectionObserver stops the loop off screen, and `visibilitychange` stops it while the tab is hidden.
- **Accessible:** the whole window is one image to assistive technology, described by its label.
- **Not an island:** the plan called it "a small island", but it is a plain script (Preact is installed but unused, answer W3).

## Key code

```ts path=src/scripts/hero.ts
function tick() {
    timer = 0;
    if (!running()) return;
    const len = [...lines[li]!.text].length;
    if (n < len) {
      n++;
      show();
      timer = window.setTimeout(tick, TYPE_MS);
      return;
    }
    timer = window.setTimeout(() => {
      timer = 0;
      if (!running()) return;
      li = (li + 1) % lines.length;
      n = 0;
      setMood(true);
      show();
      tick();
    }, HOLD_MS);
  }
  const start = () => {
    if (!timer && running()) tick();
  };
  const stop = () => {
    clearTimeout(timer);
    timer = 0;
  };

  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) start();
    else stop();
  }).observe(root);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
```
