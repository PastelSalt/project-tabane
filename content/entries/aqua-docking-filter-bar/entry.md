---
title: Aqua Iro · Docking filter bar
layer: ui-ux
origin: own-project
stack:
  - typescript
  - css
feature:
  - search
  - navigation
status: proven
target: website
reuseNote: A long filtered list keeps its filters at hand while scrolling, without the bar overlapping the footer or other sections.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/scripts/topbar.ts
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the filter bar docked at the top beside the logo tab, with year tabs scrolling sideways and a Filters button, over a long list"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the Streaming filter bar docked at the top while scrolling the stream log
related:
  - aqua-stream-log-search
  - aqua-bottom-dock
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

One shared pattern for the filter bars on Discography, Streaming and Arts (`topbar.ts`), made consistent after an audit found three that behaved differently.

- **In place:** the bar sits in its section.
- **Docked:** once its slot scrolls under the top edge, and while its section is still on screen, it becomes one fixed row: beside the logo tab on desktop, under it on phones.
- **Primary and secondary:** the row holds the primary control (year tabs, tabs or sections), which scrolls sideways with faded edges; secondary controls (search, sort, view, tags) open from a Filters button.
- **Undocks** when the section has scrolled past (so it never sits over the footer) or when you scroll back above the slot.
- **Markup:** `.topbar-slot > [data-topbar]` with `[data-topbar-primary]`, `[data-topbar-more]` and `[data-topbar-secondary]`.
