---
title: Aqua Iro · One-size bottom dock
layer: ui-ux
origin: own-project
stack:
  - preact
  - typescript
  - css
feature:
  - navigation
status: proven
target: website
reuseNote: A multi-page site wants app-like bottom navigation that never jumps, with system toggles beside the pages.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/components/chrome/Dock.tsx
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the wide dock with eight chapter buttons and six system buttons, the current chapter on a pill"
  phone:
    file: wireframe-phone.svg
    alt: "Phone wireframe: the narrow dock with five chapters and MORE, and the sheet MORE opens with every chapter and system button"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the wide dock at the bottom of Aqua Iro Archive's Streaming page
  - file: screenshot-phone.webp
    alt: Phone screenshot of the dock's MORE sheet open
related:
  - aqua-chapter-skeleton
  - aqua-log-drawer
  - aqua-bgm-capsule
  - kotoha-nav-pill-circle-menu
  - himawari-nav-panels
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

A dock at the bottom of every page that keeps one size, rebuilt that way after an audit found it "balloons then snaps" and had four different behaviours (`docs/DOCK-PLAN.md`, `docs/AUDIT-2026-10-13.md`).

- **One size:** it never changes while you scroll or hover.
- **Wide (≥ 1024 px):** the 8 chapters and 6 system buttons (BGM, MOTION, JP/EN, LOG, TIME, HELP). **Narrow:** 5 chapters (Home, Clips, Disco, Stream, Board) plus MORE, which opens one sheet with everything; the current chapter is always on the bar, taking Clips' place when it isn't one of the five. Which buttons show is decided by CSS only.
- **One button** (`DockButton.tsx`): a Phosphor duotone icon with one short label in the visitor's language; chapters are links, system buttons are buttons, same size and states.
- **Its only motion:** the current-chapter pill slides to the new chapter after a page change.
- **Keyboard:** Alt+M motion, Alt+L language, Esc log; shortcuts can be turned off and are skipped while typing or inside a dialog; the system toolbar has roving focus with arrow keys.
- **Persisted:** `transition:persist`, so it stays mounted across ClientRouter page changes; it listens for `astro:page-load` to move the pill.
- **Server render matches:** it renders with the page's own path, so `aria-current` is right before hydration.
