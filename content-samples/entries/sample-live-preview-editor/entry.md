---
title: Sample · Live-preview editor
layer: ui-ux
origin: own-project
stack:
  - typescript
  - node-js
feature:
  - editor
status: proven
target: desktop-application
reuseNote: An editor where changes show in a preview pane as you type.
repository:
  name: PastelSalt/sample-engine
  url: https://github.com/PastelSalt/sample-engine
codeLocation:
  path: studio/src/preview.ts
  ref: 0ddba11
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: file list, editor and preview pane"
screenshots:
  - file: screenshot-1.svg
    alt: Screenshot of the editor with a script open
  - file: screenshot-2.svg
    alt: Screenshot of the preview pane
clip:
  file: clip.webm
  poster: screenshot-2.svg
related:
  - sample-novel-engine
usedIn:
  - Sample studio
shared: true
created: 2026-10-23
updated: 2026-10-24
---

## Technical details

The editor sends the script to the preview after a short pause in typing, so the preview never blocks typing.
