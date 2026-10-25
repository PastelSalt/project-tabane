---
title: Aqua Iro · Moderation with audit log
layer: backend
origin: own-project
stack:
  - drizzle
  - neon-postgres
feature:
  - moderation
  - admin-panel
status: proven
target: website
reuseNote: An admin moderates user content, every action must be on record, and nothing is deleted by accident.
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/server/board/moderation.ts
  ref: 616052f
projectFile: aqua-iro-archive
diagrams:
  - id: system
    level: 1
    title: Moderation
    file: level-1-system.mmd
related:
  - aqua-keeper-panel
  - aqua-posting-pipeline
  - aqua-report-auto-hide
  - kotoha-content-crud-archive
usedIn:
  - Aqua Iro Archive
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The keeper's moderation tools and the settings that steer the board.

- **Actions** (`moderation.ts`, `actions/keeper.ts`): approve, remove (with a reason), restore, purge, the reported and held queues, the notes list, the audit list and board statistics.
- **Audit in the same transaction:** every mutation writes an `admin_actions` row inside its own transaction (over the Neon WebSocket Pool, because the HTTP driver has no interactive transactions).
- **Nothing hard-deleted** except by Purge, which needs the crew number typed in to confirm.
- **Defence in depth:** middleware guards `/_actions/keeper.*`, and every handler checks the admin again.
- **Settings table** (`settings.ts`): key/value JSON rows with a 60 s in-memory cache per function instance and clamped ranges: report threshold 3, re-report 6, posting paused, newcomer hold, 3 posts per 10 minutes, 10 per day, 20 reports per hour, raid at 40 posts in 5 minutes, 300 characters, 6 lines, board cache 10 s. Tunable without a redeploy.
- **Blocked terms** managed in the keeper (substring, word or regex; hold or reject), seeded by `db/seed/blocked-terms.sql`.
