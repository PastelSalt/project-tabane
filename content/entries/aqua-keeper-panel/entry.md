---
title: Aqua Iro · Keeper admin panel
layer: ui-ux
origin: own-project
stack:
  - astro
  - uplot
feature:
  - admin-panel
  - dashboard
status: proven
target: website
reuseNote: "A one-person admin for moderation and statistics: queues, notes, audit, errors and settings, calm and fast."
liveSite:
  url: https://aqua-iro-archive.vercel.app/keeper/login
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/pages/keeper/index.astro
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe of the keeper overview: a side menu (Overview, Queue, Notes, Audit, Errors, Settings), stat tiles, two charts and a short queue preview"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the keeper sign-in page
related:
  - aqua-moderation-audit
  - aqua-keeper-auth-totp
  - aqua-first-party-umami
  - kotoha-admin-panel
  - himawari-scriptless-admin
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The keeper area at `/keeper`: on-demand Astro pages for the one admin, behind forced two-factor sign-in.

- **Pages:** Overview (board and visitor statistics with uPlot charts), Queue (reported and held notes), Notes (every note with filters), Audit log, Errors (from `app_errors`, since Vercel Hobby keeps runtime logs for one hour), Settings (board limits and holds), and sign-in with two-factor setup and entry (a QR code drawn with `uqr`).
- **Actions:** approve, remove with a reason, restore, and purge (which needs the crew number typed in); every action writes an audit row.
- **Look:** `keeper.css` is "the calm working-tool variant: same tokens, no decorations".
- **Never cached or indexed:** `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow` on every keeper response; `/keeper` redirects to the sign-in page when signed out.
