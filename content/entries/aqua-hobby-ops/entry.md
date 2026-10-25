---
title: Aqua Iro · Alerts, error log, privacy cron, backups
layer: backend
origin: own-project
stack:
  - vercel
  - neon-postgres
feature:
  - cron
  - database
status: proven
target: website
reuseNote: A small site on free plans still needs alerts, a lasting error log, data retention and encrypted backups.
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/server/board/cleanup.ts
  ref: 616052f
projectFile: aqua-iro-archive
diagrams:
  - id: system
    level: 1
    title: Upkeep
    file: level-1-system.mmd
  - id: retention
    level: 2
    parent: system
    title: Retention
    file: level-2-retention.mmd
related:
  - aqua-posting-pipeline
  - aqua-moderation-audit
  - aqua-db-drivers-pglite
usedIn:
  - Aqua Iro Archive
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The operations that keep a free-plan site safe to run.

- **Discord alerts** (`alerts.ts`): sent with `waitUntil`, so the visitor's request never waits; messages carry numbers and reasons only, never note text (Discord is a third party).
- **Error log** (`log.ts`): errors also go to `app_errors`, because Vercel Hobby keeps runtime logs for one hour; the keeper has an Errors page.
- **Daily cron** (`/api/cron/cleanup` at 18:15 UTC, `Authorization: Bearer $CRON_SECRET`): IP hashes nulled after 30 days, undo-token hashes after 10 minutes, reporter hashes after 30 days; errors pruned after 14 days; expired sessions and verifications deleted; an automatic raid hold switched off after 24 hours when nothing waits; then a digest (notes, reports, errors in 24 hours) to Discord.
- **Weekly backups** (GitHub Actions, Sunday 03:00 Manila): `pg_dump` 17 in custom format, encrypted with `age` to a public key kept in the repo (`ops/backup-recipient.txt`), uploaded as a 90-day artifact.
