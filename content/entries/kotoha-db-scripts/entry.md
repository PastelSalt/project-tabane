---
title: Kotoha · Migrations, seeds and launch scripts
layer: backend
origin: own-project
stack:
  - node-js
  - neon-postgres
feature:
  - database
status: proven
target: website
reuseNote: A small Postgres-backed site needs ordered migrations, safe re-runnable seeds and a careful launch-day wipe.
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: scripts/migrate.js
  ref: 41d4bd8
projectFile: kotoha-fansite
diagrams:
  - id: system
    level: 1
    title: Setup and launch scripts
    file: level-1-system.mmd
related:
  - kotoha-admin-auth
  - kotoha-sleeping-db-cache
  - hanon-pglite-preview
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The scripts that set up and reset the database.

- **Migrations** (`scripts/migrate.js`): ordered SQL files in `db/migrations/`, applied once each and recorded; `npm run db:status` shows what ran. The first migration creates 12 tables (admin users and sessions, login attempts, the four content tables, gallery images, the archive, the activity log, raw and daily analytics) with `timestamptz` everywhere and a shared `set_updated_at()` trigger.
- **Seeds:** `db/seed.sql` is idempotent (safe to run again); `seed-gallery.js` uploads the starter gallery to Cloudinary, also idempotent.
- **First Owner:** `npm run admin:bootstrap` creates the Owner from environment values and refuses if one exists; the first sign-in forces a password change.
- **Launch day:** `prelaunch-reset.js` wipes test data so launch starts clean; it is a dry run by default and only acts with `-- --yes-reset-everything`. Needed because development and production share one database and Cloudinary folder.
- **Hanon Fan Site:** Hanon adds an in-memory Postgres preview for running without a database (`hanon-pglite-preview`).
