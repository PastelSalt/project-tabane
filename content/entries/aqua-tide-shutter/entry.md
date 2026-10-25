---
title: Aqua Iro · Tide shutter page transition
layer: ui-ux
origin: own-project
stack:
  - astro
  - typescript
feature:
  - page-transition
  - motion
status: proven
target: website
reuseNote: Page changes on a multi-page site should feel like an anime eyecatch, without slowing down when motion is off.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/scripts/shutter.ts
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe of the shutter mid-change: the navy deep covering the screen with a glowing crest, and a tilted paper ticket with the destination's number and name"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the tide shutter covering the page during a change of chapter
related:
  - aqua-splash-title-screen
  - aqua-harbour-design-system
  - aqua-motion-budget
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The page switch: the deep rises over the screen carrying a ticket with the destination, then drains up off the new page.

- **Hooks ClientRouter:** on `astro:before-preparation` the deep rises with the destination's paper ticket (its number and name, the tape in the chapter tint) in 220 ms while the next page loads; on `astro:after-swap` it drains up in 260 ms.
- **Eyecatch:** on the first visit to a chapter in a session it holds about 700 ms like an anime eyecatch (the ticket settles, bubbles rise, a tiny production credit shows); a click or any key skips the hold. Seen chapters are kept in sessionStorage (`aia:eyecatch`), plus a once-per-session flower bubble.
- **No character art:** type and tint carry it; the ticket's corner seal is the Moeko Works flower.
- **Skipped** for same-page hash moves and with Motion OFF (pages then cut straight across).
- **Motion OFF is also fast:** `document.startViewTransition` is wrapped so the swap runs *without* a native view transition, because its snapshot of the old page took seconds on GPU-less WebKit.
- **Persisted** across swaps (`transition:persist`).

## Key code

```ts path=src/scripts/shutter.ts
// Motion OFF: page changes cut straight across, so Astro's native view transition is pure cost — its snapshot
// of the old page takes seconds on GPU-less WebKit. Run the swap without one; Motion ON is untouched.
const nativeVT = document.startViewTransition?.bind(document);
if (nativeVT)
  document.startViewTransition = ((arg?: Parameters<typeof nativeVT>[0]) => {
    if (motionOn()) return nativeVT(arg);
    const update = typeof arg === 'function' ? arg : arg?.update;
    const done = Promise.resolve()
      .then(() => update?.())
      .then(() => undefined);
    const settled = done.catch(() => undefined);
    return {
      updateCallbackDone: done,
      ready: settled,
      finished: settled,
      skipTransition() {},
      types: new Set<string>(),
    } as unknown as ViewTransition;
  }) as typeof document.startViewTransition;
```
