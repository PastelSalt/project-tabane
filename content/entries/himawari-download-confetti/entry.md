---
title: Himawari · CSP-safe download confetti
layer: ui-ux
origin: own-project
stack:
  - canvas-confetti
  - typescript
feature:
  - motion
status: proven
target: website
reuseNote: A celebratory click effect that costs nothing until used and works under a strict Content Security Policy.
liveSite:
  url: https://himawari-moekoworks.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/scripts/confetti.ts
  ref: 4eb655c
projectFile: himawari-website
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the download button with confetti bursting from its centre in three colours"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of confetti bursting from the Himawari download button (the capture cancelled the download itself)
related:
  - kotoha-sparkles-confetti
  - himawari-release-download
usedIn:
  - Himawari Website
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The download buttons burst into yellow, white and black confetti (`confetti.ts`).

- **Marked buttons:** any element with `data-confetti`; one delegated click listener on the document.
- **Loaded on first click:** canvas-confetti is imported dynamically the first time, so it costs nothing until then.
- **CSP-safe:** `useWorker: false`, drawing on the main thread, because the library's worker needs a `blob:` URL the CSP doesn't allow (instead of loosening the CSP).
- **From the button:** 70 particles from the button's centre, in the palette's yellow, white and black.
- **Motion ON only:** nothing happens when `html[data-motion]` is off.
