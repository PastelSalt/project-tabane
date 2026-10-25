---
title: Aqua Iro · Onboarding tour with replay
layer: ui-ux
origin: own-project
stack:
  - preact
feature:
  - onboarding
status: proven
target: website
reuseNote: A site full of controls should show a first visitor around in half a minute, and let anyone replay it later.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/components/chrome/Tour.tsx
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the page dimmed except a spotlight around one dock button, with a speech-style step card beside it showing Next, Skip and the step count"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the onboarding tour spotlighting a control on Home
related:
  - aqua-bottom-dock
  - aqua-splash-title-screen
  - aqua-log-drawer
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

A first-visit spotlight tour and a HELP drawer that can replay it.

- **Tour** (`Tour.tsx`): about 30 seconds of spotlight steps over the logo, Talk and its buttons, the outfit dots, Three Moments, the chapter dock, BGM, MOTION, JP/EN, LOG and HELP; steps that only exist on Home drop out on other pages.
- **When:** it starts once the splash has gone; Esc or Skip ends it; finishing or skipping stores `aia:tour.done`.
- **Not fighting the dock:** while the tour runs it holds the dock expanded instead of letting its own scrolling look like the visitor's (an audit finding).
- **HELP drawer** (`HelpDrawer.tsx`): what each control does, plus "Replay the tour" with a confirm step. Replaying sets `aia:replay` and reloads, so the splash and tour run again; settings, the memory album and board drafts are kept.
- **Persisted** across page changes; loads `client:idle` with a 1.5 s timeout.
