---
title: Kotoha · Cookieless analytics with lazy rollups
layer: backend
origin: own-project
stack:
  - javascript
  - node-js
  - neon-postgres
feature:
  - statistics
status: proven
target: website
reuseNote: A site wants useful visit statistics without cookies, a consent banner, a third party or a cron job.
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: lib/analytics.js
  ref: 41d4bd8
projectFile: kotoha-fansite
diagrams:
  - id: system
    level: 1
    title: Analytics path
    file: level-1-system.mmd
  - id: rollup
    level: 2
    parent: system
    expands: daily
    title: Lazy rollup
    file: level-2-rollup.mmd
related:
  - kotoha-analytics-dashboard
usedIn:
  - Kotoha Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

First-party visit statistics with no cookie and no cron: events in, daily totals out, rolled up lazily.

- **Client** (`track.js`): a random visit id in memory only; any element with `data-track`, `data-track-id`, `data-track-target`, `data-track-type` is captured in the capture phase (before facades replace themselves); section dwell time from the active-section observer; batched and sent with `sendBeacon` (fallback `fetch` keepalive) at 25 events, on page hide and when the tab hides.
- **Events:** page_view, section_dwell, video_play, outbound_click, news_link_click, gallery_open, gallery_credit_click, language_switch, loader_timing; every field validated or dropped (`parseBeacon`), ≤ 50 per beacon, dwell capped at an hour.
- **Privacy:** visitor hash = SHA-256 of `salt | Japan-time day | IP | user agent`, truncated, so it changes daily; no raw IP, no cookie. Admin sessions, bots, cross-origin posts and floods (200 events per visitor per 5 minutes, per instance) are ignored. Always answers 204.
- **Lazy rollups** (`rollupIfStale`): called from the tracker and the dashboard, at most once a day per instance (retried after 10 minutes on failure): one aggregation SQL computes every metric per Japan-time day into `analytics_daily` (idempotent upserts and a `_rolled` marker), then deletes raw events older than 90 days and stale sessions and login attempts older than 30 days.
- **Dashboard data:** rolled days plus today computed live; daily, weekly and monthly series; breakdowns for 7 / 30 / 90 / 365 days; ids resolved to titles.

## Key code

```js path=lib/analytics.js
export function visitorHash(ip, ua) {
  const salt = process.env.ANALYTICS_SALT || (environment() === 'production' ? null : 'dev-salt');
  if (!salt) throw new Error('ANALYTICS_SALT is not set');
  return createHash('sha256').update(`${salt}|${jstDay()}|${ip}|${ua}`).digest('hex').slice(0, 32);
}

export async function rollupIfStale({ force = false } = {}) {
  const today = jstDay();
  if (!force && (rolledThisDay === today || Date.now() - lastAttempt < 10 * 60 * 1000)) return { skipped: true };
  lastAttempt = Date.now();
  const yesterday = addDays(today, -1);
  const last = await lastRolledDay();
  let from;
  if (last) from = addDays(last, 1);
  else {
    const [first] = await sql()`select to_char(min(occurred_at at time zone 'Asia/Tokyo'), 'YYYY-MM-DD') as day from analytics_events`;
    from = first?.day || today;
  }
  // … one transaction: delete the days being rolled, then insert every metric from AGGREGATE_SQL
}
```
