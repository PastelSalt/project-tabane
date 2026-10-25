---
title: Himawari · Daily-salt cookieless counter
layer: backend
origin: own-project
stack:
  - typescript
  - neon-postgres
  - drizzle
feature:
  - statistics
status: proven
target: website
reuseNote: A site wants its own visit numbers with no cookies, no third parties, and no way to follow a visitor from one day to the next.
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/server/track.ts
  ref: 4eb655c
projectFile: himawari-website
diagrams:
  - id: system
    level: 1
    title: Counting a visit
    file: level-1-system.mmd
related:
  - kotoha-cookieless-analytics
  - aqua-first-party-umami
  - himawari-admin-stats
usedIn:
  - Himawari Website
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Cookieless visit counting (`track.ts`, `ua.ts`, `/api/track`); the code says it comes from the portfolio's `/api/track`.

- **Client:** sent with `sendBeacon` only over HTTPS and only when neither Global Privacy Control nor Do Not Track is set; carries the path, the language and the referring site's host name (not the full address).
- **Endpoint:** body ≤ 1 KB, Zod-validated; **always answers 204 with no body**; errors go to Discord, never to the caller. Reads `x-forwarded-for`.
- **Visitor hash:** HMAC of a **daily random salt** stored in `analytics_salts` (created on first use, deleted after two days) over IP, user agent and host. Visitors can't be followed across days; IPs and full user agents are never stored. So one person on two days counts as two visitors.
- **Stored per view:** path, language, referrer host (not if it's this site), device type and browser family, country (two letters only, from Vercel's header), visitor hash, environment (production, preview, development).
- **Bots:** a user-agent pattern (crawlers, previewers, headless browsers, Lighthouse, curl, node-fetch…) is never counted.
- **Rate limit:** a generic `overLimit(bucket, keyHash, limit, windowMs)` on fixed windows with one upsert (`rate_limits`), 60 views a minute per hashed IP; any bucket can use it.
- **Daily cron** (16:30 UTC, about 00:30 Manila, `Bearer CRON_SECRET` checked with `timingSafeEqual`): rolls the last three Manila days of production views into `daily_page_views` (per path plus a `*` total), idempotent; deletes views after 90 days, salts and rate rows after 2, sign-in attempts after 30, ended sessions after 7.
- **Privacy page in step:** `/privacy` describes exactly what is stored; the code comment says to keep the two in step.

## Key code

```ts path=src/server/track.ts
/** Today's salt, created on first use. */
export async function saltFor(db: DB, day: string): Promise<string> {
  await db
    .insert(schema.analyticsSalts)
    .values({ day, salt: randomBytes(32).toString('hex') })
    .onConflictDoNothing();
  const [row] = await db
    .select()
    .from(schema.analyticsSalts)
    .where(eq(schema.analyticsSalts.day, day))
    .limit(1);
  if (!row) throw new Error(`no salt for ${day}`);
  return row.salt;
}

/** Counts a hit for `keyHash` in the current window; true when it's over `limit`. */
export async function overLimit(
  db: DB,
  bucket: string,
  keyHash: string,
  limit: number,
  windowMs: number,
  now = new Date(),
): Promise<boolean> {
  const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
  const [row] = await db
    .insert(schema.rateLimits)
    .values({ bucket, keyHash, windowStart, hits: 1 })
    .onConflictDoUpdate({
      target: [schema.rateLimits.bucket, schema.rateLimits.keyHash, schema.rateLimits.windowStart],
      set: { hits: sql`${schema.rateLimits.hits} + 1` },
    })
    .returning({ hits: schema.rateLimits.hits });
  return (row?.hits ?? 0) > limit;
}

// src/scripts/global.ts
const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
if (location.protocol === 'https:' && !nav.globalPrivacyControl && nav.doNotTrack !== '1') {
  let r: string | undefined;
  try {
    const h = document.referrer ? new URL(document.referrer).hostname : '';
    if (h && h !== location.hostname) r = h;
  } catch {
    /* no usable referrer */
  }
  const l = html.lang === 'ja' ? 'ja' : 'en';
  navigator.sendBeacon?.('/api/track', JSON.stringify({ p: location.pathname, l, r }));
}
```
