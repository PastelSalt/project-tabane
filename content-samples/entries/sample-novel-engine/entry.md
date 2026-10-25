---
title: Sample · Visual novel engine
layer: backend
origin: own-project
stack:
  - c
  - sdl-3
  - freetype
feature:
  - export-pipeline
status: candidate
target: desktop-application
reuseNote: A desktop app needs a render loop with text, images and a simple script runner.
repository:
  name: PastelSalt/sample-engine
  url: https://github.com/PastelSalt/sample-engine
codeLocation:
  path: src/engine.c
  ref: 0ddba11
screenshots:
  - file: screenshot-1.svg
    alt: Screenshot of the engine window with a scene
  - file: screenshot-2.svg
    alt: Screenshot of the engine's export screen
diagrams:
  - id: system
    level: 1
    title: System
    file: level-1-system.mmd
  - id: script-runner
    level: 2
    parent: system
    expands: script
    title: Script runner
    file: level-2-script-runner.mmd
related:
  - sample-live-preview-editor
usedIn: []
shared: false
created: 2026-10-23
updated: 2026-10-23
---

## Technical details

SDL 3 opens the window and handles input; FreeType draws text; a small interpreter steps through the script.
