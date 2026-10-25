---
# Copy to content/entries/<slug>/entry.md. The folder name is the slug. Delete the lines that don't apply.
title: Project · Name of the piece
layer: ui-ux                      # ui-ux | backend (content/tags.yml)
origin: own-project               # own-project | researched | created-for-tabane
stack: [javascript, css]          # values from tags.yml → stack
feature: [layout]                 # values from tags.yml → feature
status: proven                    # proven (own live project) | candidate | outdated
target: website                   # website | mobile-application | desktop-application
reuseNote: One or two lines on when to reuse it.
liveSite: { url: "https://example.com/", embeddable: false }
repository: { name: PastelSalt/repo, url: "https://github.com/PastelSalt/repo" }   # own projects
codeLocation: { path: src/file.js, ref: abc1234 }                                    # own projects
sourceAndLicense: Where the idea came from and its usage terms.                      # researched only
projectFile: project-file-name    # projects/<name>.md this entry was made from
wireframe:                        # UI/UX: files in this folder (generated from wireframe.yml)
  desktop: { file: wireframe.svg, alt: "Wireframe: what it shows" }
  phone: { file: wireframe-phone.svg, alt: "Phone wireframe: what it shows" }
screenshots:                      # UI/UX with a live site, and every app entry
  - { file: screenshot-desktop.webp, alt: "Screenshot of …" }
clip: { file: clip.webm, poster: poster.png }   # apps only, optional
diagrams:                         # backend: one Mermaid file per diagram, exactly one level 1
  - { id: system, level: 1, title: System, file: level-1-system.mmd }
  - { id: part, level: 2, parent: system, expands: part, title: Part, file: level-2-part.mmd }
related: []                       # slugs of entries this one pairs with
usedIn: [Project Name]            # every project that contains the piece, the origin first
shared: false
lastChecked: 2026-10-25           # with a live site
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

How it works, in plain words, with short bullet lists.

## Key code

```js path=src/file.js
// optional: a short excerpt, a few dozen lines at most
```
