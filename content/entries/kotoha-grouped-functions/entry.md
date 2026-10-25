---
title: Kotoha · Grouped Vercel Functions and HTTP helpers
layer: backend
origin: own-project
stack:
  - node-js
  - javascript
  - vercel
feature:
  - api
status: proven
target: website
reuseNote: A small site on Vercel's free plan needs many API routes without many functions, with consistent errors and CSRF checks.
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: lib/http.js
  ref: 41d4bd8
projectFile: kotoha-fansite
diagrams:
  - id: system
    level: 1
    title: Four grouped functions
    file: level-1-system.mmd
  - id: request
    level: 2
    parent: system
    expands: fn
    title: One request inside a group
    file: level-2-request.mmd
related:
  - kotoha-sleeping-db-cache
  - kotoha-security-headers
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Four plain Node functions serve every route, grouped by area, with shared helpers for errors, bodies and origins.

- **Groups:** `api/public.js` (home, geo, lists), `api/auth.js` (login, logout, me, change-password, preferences, logout-others), `api/admin.js` (content, gallery, archive, activity, summary, analytics, accounts), `api/track.js` (beacons). Fewer functions keep cold starts and the function count low.
- **Routing:** `vercel.json` rewrites `/api/<group>/<route>` to `/api/<group>?__route=<route>`; `routeOf(req, group)` reads `__route` (or the path when local), so one file serves many routes.
- **Errors:** `handle(fn)` turns `HttpError(status, code, message, fields)` into `{ error: { code, message, fields } }` and hides anything unexpected as `500 SERVER_ERROR`.
- **Requests:** `readJson(req, limitBytes)` caps body size (413); `methodGuard`; `clientIp` from `x-forwarded-for`.
- **CSRF:** `assertSameOrigin(req)` requires an `Origin` matching the host, `VERCEL_URL` or `ALLOWED_ORIGINS` on every state-changing request, alongside `SameSite=Strict` cookies.
- **Cache presets:** `PUBLIC_CACHE` (`s-maxage=60, stale-while-revalidate=86400`) and `NO_STORE`.
- **Local server:** `scripts/dev-server.js` mirrors the rewrites and the `vercel.json` headers, so local behaviour matches production.
