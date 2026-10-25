---
title: Aqua Iro · Self-hosted Umami through the site
layer: backend
origin: own-project
stack:
  - umami
  - vercel
feature:
  - statistics
status: proven
target: website
reuseNote: A site wants proper analytics from its own domain, never blocked as third-party, with numbers in its own admin.
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/server/umami.ts
  ref: 616052f
projectFile: aqua-iro-archive
diagrams:
  - id: system
    level: 1
    title: Analytics through the site
    file: level-1-system.mmd
related:
  - aqua-keeper-panel
  - kotoha-cookieless-analytics
  - himawari-daily-salt-counter
usedIn:
  - Aqua Iro Archive
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Self-hosted Umami, served through the site's own paths.

- **Only when configured:** the script tag renders only when `PUBLIC_UMAMI_WEBSITE_ID` is set. On 2026-10-25 the live pages had no Umami script and `/s/ui.js` answered 404, so analytics was not switched on in production.
- **First-party paths:** `vercel.json` rewrites `/s/ui.js` and `/s/api/pulse` to the Umami server, so the script and beacons come from the site's own origin.
- **Script options:** `data-do-not-track` and `data-exclude-search`; persisted across page changes.
- **Typed wrapper** (`lib/analytics.ts`): `track()` is a no-op when Umami is missing (blocked, Do Not Track, local, preview) and never sends personal data or note text. Outbound links and Core Web Vitals (LCP, INP, CLS, FCP, TTFB, through a lazy `web-vitals`) are tracked.
- **Numbers in the keeper** (`server/umami.ts`, `/api/admin/stats`): the API token is cached 12 hours and responses 5 minutes per range; endpoint shapes are isolated in one file because they changed between Umami versions (v3 `path`, v2 `url`); stats are `private, max-age=300` and drawn with uPlot.
