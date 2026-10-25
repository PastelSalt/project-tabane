---
title: Aqua Iro · Reports with auto-hide in one statement
layer: backend
origin: own-project
stack:
  - neon-postgres
feature:
  - moderation
status: proven
target: website
reuseNote: Visitors report bad notes, and enough reports hide a note at once, without races and without telling reporters anything.
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/server/board/report.ts
  ref: 616052f
projectFile: aqua-iro-archive
diagrams:
  - id: system
    level: 1
    title: Report
    file: level-1-system.mmd
related:
  - aqua-posting-pipeline
  - aqua-moderation-audit
  - aqua-message-board
usedIn:
  - Aqua Iro Archive
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

`board.report`: a report and the auto-hide happen in one SQL statement.

- **Checks first:** a valid note id, reason and note length; Turnstile; at most a set number of reports per reporter hash per hour.
- **Reporting your own note** succeeds quietly and isn't counted.
- **One statement:** a CTE inserts the report (`ON CONFLICT (message_id, reporter_hash) DO NOTHING`, so one person counts once) and, only when that insert happened, bumps `report_count` and sets the note to `under_review` when it reaches the threshold: **3 for notes never approved, 6 after the keeper approved one**, so approved notes are harder to brigade.
- **Always answers `{ ok: true }`** (except bad requests, bots and rate limits), so reporters learn nothing about the note's state.
- **Alert:** when a note is hidden, Discord gets the crew number, the count and the reasons, never the text.
- **Retention:** reporter hashes are nulled after 30 days by the daily cron.

## Key code

```ts path=src/server/board/report.ts
const [res] = rows<{ crew_no: number; status: string; report_count: number }>(
    await db.execute(sql`
      WITH ins AS (
        INSERT INTO reports (message_id, reason, note, reporter_hash)
        SELECT ${input.messageId}, ${input.reason}::report_reason, ${note}, ${hash}
        WHERE EXISTS (SELECT 1 FROM messages WHERE id = ${input.messageId} AND status = 'visible')
        ON CONFLICT (message_id, reporter_hash) DO NOTHING
        RETURNING message_id
      )
      UPDATE messages m
      SET report_count = m.report_count + 1,
          status = CASE
            WHEN m.report_count + 1 >= (CASE WHEN m.approved_at IS NULL THEN ${s.report_threshold}::int ELSE ${s.rereport_threshold}::int END)
            THEN 'under_review'::message_status ELSE m.status END
      FROM ins
      WHERE m.id = ins.message_id
      RETURNING m.crew_no, m.status, m.report_count`),
  );
```
