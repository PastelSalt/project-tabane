---
title: Himawari · Migrations in every build (Neon branches)
layer: backend
origin: own-project
stack:
  - neon-postgres
  - drizzle
feature:
  - database
  - cron
status: proven
target: website
reuseNote: With a database branch per preview, each build can migrate its own database, so schema changes ship with the code.
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: scripts/migrate.ts
  ref: 4eb655c
projectFile: himawari-website
diagrams:
  - id: system
    level: 1
    title: Migrations per environment
    file: level-1-system.mmd
related:
  - aqua-db-drivers-pglite
  - himawari-db-news-static
usedIn:
  - Himawari Website
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

`migrate.ts` applies `db/migrations` when a database is configured, in every build.

- **Previews migrate their own branch:** with the Neon integration each Vercel preview has its own database branch, so previews migrate their branch and production migrates production.
- **Skipped without a database:** without `DATABASE_URL_UNPOOLED` (local builds, CI) it does nothing.
- **Order in the build:** release sync → migrate → `astro check` → `astro build` → CSP hashes.
- **Migrations:** `0000_init` (counter), `0001_admin_and_news`, `0002_seed_news` (with drizzle-kit's meta snapshots).
- **Tested:** integration tests run on PGlite with the real migrations (`tests/integration`: track, stats, admin).
- **Careful:** any build with `DATABASE_URL_UNPOOLED` set, including a local one pointed at production, migrates that database.

## Key code

```ts path=scripts/migrate.ts
/**
 * Applies db/migrations when a database is configured (WEBSITE.md §9.3). Runs in every build: with the Neon
 * integration each Vercel preview has its own database branch, so previews migrate their branch and production
 * migrates production. Without DATABASE_URL_UNPOOLED (local builds, CI) it does nothing.
 */
import { execSync } from 'node:child_process';

if (!process.env.DATABASE_URL_UNPOOLED) {
  console.log('migrate: no DATABASE_URL_UNPOOLED, skipped');
} else {
  execSync('npx drizzle-kit migrate', { stdio: 'inherit' });
}
```
