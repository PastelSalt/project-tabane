---
title: Hanon · In-memory Postgres preview with PGlite
layer: backend
origin: own-project
stack:
  - node-js
  - pglite
feature:
  - database
  - testing
status: proven
target: website
reuseNote: A database-backed site should preview with real seed content before any database exists, and prove its migrations run.
repository:
  name: PastelSalt/hanon-fansite
  url: https://github.com/PastelSalt/hanon-fansite
codeLocation:
  path: scripts/dev-db.js
  ref: 1e5d114
projectFile: hanon-fansite
diagrams:
  - id: system
    level: 1
    title: Preview database
    file: level-1-system.mmd
related:
  - kotoha-db-scripts
  - kotoha-grouped-functions
  - hanon-cdp-test-harness
  - aqua-db-drivers-pglite
usedIn:
  - Hanon Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

When there is no `DATABASE_URL`, the local server runs on an in-memory Postgres instead of Neon.

- **How:** `scripts/dev-server.js` opens PGlite (Postgres compiled to WASM) through `scripts/dev-db.js`, runs every migration in `db/migrations/` and `db/seed.sql`, and puts it on `globalThis.__hfDevDb`. `lib/db.js` returns that object instead of the Neon client, with the same `query(text, params) → rows` shape.
- **Gives:** the public pages with real seed content before any database exists, and proof that the migrations and seed run on real Postgres (`node scripts/dev-db.js` prints row counts).
- **Limit:** the public API only. Admin and auth need the real database, because they use the `sql` tagged template and transactions.
- **Development only:** `@electric-sql/pglite` is a dev dependency and the hook is never active in production.
- **Reused later:** the Moeko Works portfolio's capture pipeline starts a site's own server on an in-memory copy the same way to take admin screenshots.
