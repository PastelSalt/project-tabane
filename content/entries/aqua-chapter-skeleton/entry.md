---
title: Aqua Iro · Numbered chapter page skeleton
layer: ui-ux
origin: own-project
stack:
  - astro
feature:
  - layout
  - navigation
status: proven
target: website
reuseNote: A multi-page site wants each page to feel like a numbered chapter of an anime official site, built from one layout.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/layouts/Page.astro
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe of a chapter page head: key visual on the right, the NO.04 label, a bilingual title and intro, a vertical Japanese column, then a wave seam and the page body, with Prev and Next cards at the end"
screenshots:
  - file: screenshot-desktop.webp
    alt: "Screenshot of the About chapter's head: number, bilingual title, intro and key visual"
  - file: screenshot-phone.webp
    alt: Phone screenshot of the About chapter's head
related:
  - aqua-bottom-dock
  - aqua-filler-kit
  - aqua-bilingual-islands
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

One layout (`Page.astro`) gives every chapter the same anime-site structure; eight fixed chapters live in `src/lib/chapters.ts` (NO.00 Home … NO.07 Message Board), each with its title in both languages, tint and dock icon.

- **Order:** key visual → label `NO.0X — EN` → bilingual h1 + JP subtitle + intro → optional vertical Japanese column → a wave seam → the page body → a hashtag marquee → related → Prev/Next banner cards that wrap around the eight chapters.
- **Art per chapter** (`chapter-art.ts`): which official artwork is the key visual, which art section feeds the side-rail filmstrip, and the rail title. Art is cropped, framed or moved, never edited, and framed on her face.
- **Lifecycle for ClientRouter** (`lifecycle.ts`): module scripts run once, so every page script registers `onPage(init)`; `init` runs on every `astro:page-load`, bails out when its element isn't on the page, and returns a cleanup that runs on `astro:before-swap`.
- **Metadata:** title pattern `NO.0X 日本語 — English | Aqua Iro Archive`, per-chapter share images, JSON-LD.

## Key code

```ts path=src/lib/lifecycle.ts
type Cleanup = void | (() => void);

export function onPage(init: () => Cleanup): void {
  let cleanup: Cleanup;
  const stop = () => {
    try {
      cleanup?.();
    } finally {
      cleanup = undefined;
    }
  };
  document.addEventListener('astro:page-load', () => {
    stop();
    cleanup = init();
  });
  document.addEventListener('astro:before-swap', stop);
}

/** Run `fn` now and whenever Motion is toggled; returns an unsubscribe. */
export function onMotion(fn: (on: boolean) => void): () => void {
  const h = () => fn(document.documentElement.dataset.motion === 'on');
  h();
  window.addEventListener('aia:motion', h);
  return () => window.removeEventListener('aia:motion', h);
}
```
