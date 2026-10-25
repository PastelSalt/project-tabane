---
title: Aqua Iro · Anonymous posting pipeline
layer: backend
origin: own-project
stack:
  - typescript
  - neon-postgres
  - drizzle
  - turnstile
feature:
  - moderation
  - security
status: proven
target: website
reuseNote: Anonymous visitors may post short public notes, and spam, raids, duplicates and personal data must be stopped before anything is stored.
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/server/board/post.ts
  ref: 616052f
projectFile: aqua-iro-archive
diagrams:
  - id: system
    level: 1
    title: Posting a note
    file: level-1-system.mmd
  - id: checks
    level: 2
    parent: system
    expands: post
    title: The checks, cheapest first
    file: level-2-checks.mmd
related:
  - aqua-message-board
  - aqua-report-auto-hide
  - aqua-moderation-audit
  - aqua-hobby-ops
usedIn:
  - Aqua Iro Archive
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

`board.post`: fourteen ordered checks, cheapest first, all before the insert.

1. **Shape:** body and token lengths.
2. **Paused:** the board setting.
3. **Turnstile:** the server checks the single-use token with the client IP and allowed hostnames.
4.–6. **Shared text rules** (`lib/text/normalize.ts`, the same file the composer uses, "so client and server never disagree"): clean control characters and zalgo (at most 2 combining marks per grapheme); 300 graphemes, 6 lines, 20 emoji; no links (including spelled-out "h t t p" and `t.me/`; `www.` only when a domain follows, because bare "www" is laughter in Japanese); no personal info (e-mails, @handles, 10+ digit runs).
7. **IP hash:** HMAC-SHA256 of `YYYYMM|ip` with a secret, first 32 hex characters; the month makes hashes unlinkable from one month to the next; raw IPs are never stored.
8. **Rate limit and raid detection in one query:** this hash's posts in 10 minutes and 24 hours, and the whole site's posts in 5 minutes. A site-wide burst over the raid threshold switches the newcomer hold on automatically and sends a Discord alert.
9. **Duplicates:** the same text (compare form) in the last 24 hours from anyone, or ever from this hash.
10. **Word filter:** the `obscenity` English matcher plus database `blocked_terms` (substring, word or regex; reject or hold), cached 60 s.
11. **Hold:** filter, newcomer or raid holds keep the note hidden for review.
12. **Insert**, returning the crew number from a sequence.
13. **Alert** the keeper about held notes on Discord: crew number and reason only, never the text.
14. **Response** with an undo token (only its hash is stored; valid 10 minutes).

Errors are stable codes the UI translates: `BAD_REQUEST`, `PAUSED`, `BOT`, `EMPTY`, `LENGTH`, `EMOJI`, `LINK`, `PERSONAL`, `RATE`, `DUPLICATE`, `FILTER`, `INTERNAL`. The pipeline runs as an Astro Action: POST + JSON, CSRF-protected by `checkOrigin`, validated with Zod.

## Key code

```ts path=src/server/board/post.ts
// 7. IP hash
  const hash = ipHash(deps.ipSecret, deps.clientIp, deps.now?.());
  // 8. rate limit + raid detection in one query
  const [rate] = rows<{ m10: number; d1: number; site5: number }>(
    await db.execute(sql`
      SELECT
        count(*) FILTER (WHERE ip_hash = ${hash} AND created_at > now() - interval '10 minutes')::int AS m10,
        count(*) FILTER (WHERE ip_hash = ${hash} AND created_at > now() - interval '24 hours')::int AS d1,
        count(*) FILTER (WHERE created_at > now() - interval '5 minutes')::int AS site5
      FROM messages WHERE created_at > now() - interval '24 hours'`),
  );
  if ((rate?.m10 ?? 0) >= s.rate_post_10m || (rate?.d1 ?? 0) >= s.rate_post_day)
    return { ok: false, code: 'RATE' };
  let newcomerHold = s.newcomer_hold;
  if ((rate?.site5 ?? 0) >= s.raid_posts_5m && !newcomerHold) {
    newcomerHold = true;
    await setSetting(db, 'newcomer_hold', true);
    await setSetting(db, 'newcomer_hold_auto_at', new Date().toISOString());
    alertLater(
      deps.discordWebhook,
      `🚨 Raid guard: ${rate!.site5} notes in 5 min — newcomer hold ON · ${deps.siteUrl}/keeper/settings`,
    );
  }

// src/server/security/iphash.ts
export function ipHash(secret: string, ip: string, now = new Date()): string {
  if (!secret) throw new Error('IP_HASH_SECRET is not set');
  return createHmac('sha256', secret)
    .update(`${monthKey(now)}|${ip.trim().toLowerCase()}`)
    .digest('hex')
    .slice(0, 32);
}
```
