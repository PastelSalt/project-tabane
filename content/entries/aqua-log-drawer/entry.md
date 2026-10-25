---
title: Aqua Iro · LOG drawer
layer: ui-ux
origin: own-project
stack:
  - preact
feature:
  - navigation
status: proven
target: website
reuseNote: A site with a story, collectables and credits gathers them in one drawer, like a game's log menu.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/components/chrome/LogDrawer.tsx
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: a drawer from the side with four tabs (Backlog, Memory album, Credits, Shortcuts) and the backlog's lines listed"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the LOG drawer open
related:
  - aqua-dialogue-box
  - aqua-bottom-dock
  - aqua-onboarding-tour
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

One drawer for everything that isn't a chapter, like a visual novel's LOG menu.

- **Tabs:** Backlog (this session's Talk lines), Memory album (conversations seen, rare ones marked ✦), Credits & sources, and Shortcuts.
- **Opened** by the dock's LOG button, Esc, or the dialogue box (the `aia:log` window event).
- **Shared state:** the backlog and album are module singletons (`talk/store.ts`) shared with the dialogue box; the album is saved per browser (`aia:talk.album`).
- **Persisted** across page changes; loads `client:idle`.
- **Look:** a paper drawer with the deep's tide edge, from the harbour design system.
