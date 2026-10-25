---
title: Himawari · Admin statistics with release downloads
layer: backend
origin: own-project
stack:
  - typescript
  - astro
feature:
  - statistics
  - dashboard
status: proven
target: website
reuseNote: An admin page shows visits per day, week and month plus top tens from a self-hosted counter, and the product's download counts from GitHub.
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/server/stats.ts
  ref: 4eb655c
projectFile: himawari-website
diagrams:
  - id: system
    level: 1
    title: Statistics
    file: level-1-system.mmd
related:
  - himawari-server-charts
  - himawari-daily-salt-counter
  - kotoha-analytics-dashboard
usedIn:
  - Himawari Website
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The numbers behind `/admin/stats` (`stats.ts`).

- **Visits** per day (30 days), per week from Monday (12 weeks) and per month (12 months).
- **Breakdowns** for 7, 30 or 88 days: totals, plus top tens of pages, sources, countries, devices, browsers and languages, and views by hour.
- **Two sources, one series:** recent days come from single views (kept 90 days), older days from the daily totals. **88 days, not 90**, so the cron's deletion never cuts a day in half.
- **Visitors are per day:** one person on two days is two visitors (stated in the code), a consequence of the daily salt.
- **Installer downloads per release** are read live from GitHub's own counts (`releaseDownloads()`); nothing is stored.
- **Drawn on the server** (`himawari-server-charts`); times in Manila time.
