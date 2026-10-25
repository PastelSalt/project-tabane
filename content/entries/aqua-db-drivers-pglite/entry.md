---
title: Aqua Iro · Two drivers by job, PGlite tests
layer: backend
origin: own-project
stack:
  - neon-postgres
  - drizzle
  - pglite
  - vitest
feature:
  - database
  - testing
status: proven
target: website
reuseNote: A serverless app needs fast single queries in public routes, real transactions in admin routes, and tests on real Postgres.
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/server/db/types.ts
  ref: 616052f
projectFile: aqua-iro-archive
diagrams:
  - id: system
    level: 1
    title: Drivers
    file: level-1-system.mmd
related:
  - hanon-pglite-preview
  - kotoha-sleeping-db-cache
  - aqua-build-gates
usedIn:
  - Aqua Iro Archive
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Two Neon drivers chosen by job, and the same code tested on an in-process Postgres.

- **Public endpoints:** Neon's HTTP driver for single statements and CTEs (`db/http.ts`): the fastest choice per request.
- **Auth and admin:** Neon's WebSocket Pool for interactive transactions (`db/pool.ts`), "because neon-http has no interactive transactions".
- **One type for all:** `db/types.ts` covers neon-http, the Pool and PGlite, so the board code runs the same in production and in tests.
- **Integration tests on PGlite:** the board pipeline and moderation run against an in-process Postgres loaded with the real migrations (`tests/integration/*`, Vitest), so they run anywhere with no database account. Migrations are also applied to a temporary Neon branch in CI when a Neon API key exists.
- **Schema** (Drizzle): `messages` (crew number from a sequence, status, holds, report count, hashes with retention), `reports`, `admin_actions`, `blocked_terms`, `settings`, `app_errors`, and Better Auth's tables.
