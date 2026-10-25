---
title: Aqua Iro · BGM capsule
layer: ui-ux
origin: own-project
stack:
  - preact
feature:
  - audio
  - video
status: proven
target: website
reuseNote: A fan site wants optional background music from official uploads that keeps playing between pages and never autoplays.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/components/chrome/BgmCapsule.tsx
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: a small capsule near the dock with a disc, the track name and a play button, and a note that music starts only on press"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Home with the BGM button in the dock; the capsule stays hidden until the first press, so it is shown in the wireframe only
related:
  - aqua-bottom-dock
  - aqua-dialog-lightbox
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Background music in a small capsule, from official YouTube uploads only.

- **Nothing loads until asked:** the YouTube IFrame Player API is loaded only after the first press of ♪.
- **Hidden player:** a 1 px player on `youtube-nocookie.com`, volume 40 %; the capsule shows a spinning disc and the track name (`aria-live`).
- **Never autoplays:** the BGM signal starts off on every visit.
- **Keeps playing between chapters:** the capsule is `transition:persist`, so ClientRouter keeps it mounted across page changes.
- **Allowed by the CSP:** frames only from YouTube's two domains.
