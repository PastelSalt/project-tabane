---
title: Hanon · Admin API smoke test on a throwaway branch
layer: backend
origin: own-project
stack:
  - node-js
  - neon-postgres
feature:
  - testing
  - auth
status: proven
target: website
reuseNote: Before launch, every admin flow should be exercised end to end against a disposable copy of the real database.
repository:
  name: PastelSalt/hanon-fansite
  url: https://github.com/PastelSalt/hanon-fansite
codeLocation:
  path: scripts/perf/admin-smoke.js
  ref: 1e5d114
projectFile: hanon-fansite
diagrams:
  - id: system
    level: 1
    title: Smoke test run
    file: level-1-system.mmd
related:
  - hanon-cdp-test-harness
  - kotoha-admin-auth
  - kotoha-content-crud-archive
usedIn:
  - Hanon Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Fifty API-level checks of every admin flow, run against a local server backed by a throwaway copy of production.

- **Safety first:** it refuses any base URL that isn't `http://localhost` or `127.0.0.1`, because it creates, archives and restores content and accounts. Run it against a Neon branch copied from production, never production itself, and delete the branch afterwards.
- **Setup:** a test owner with a forced password change; `node --env-file=<test env> scripts/perf/admin-smoke.js http://localhost:PORT`.
- **Auth:** `me` without a session → 401; wrong password → 401; forced change; API blocked until changed → 403; weak password → 422; change → 200.
- **Videos:** YouTube lookup; a draft isn't public; duplicate → 409; publish; archive; restore.
- **News:** 4 links → 422; no headline → 422; publish; edit; archive.
- **Achievements and releases:** draft, publish, archive; a future release shows as coming soon.
- **Gallery:** edit a credit and revert it.
- **Accounts:** an admin can't manage accounts → 403; the owner resets and removes an admin; a removed admin can't sign in.
- **Other:** the activity log records actions; analytics → 200 and a bad range → 400; logout closes the API; a request without `Origin` → 403; lockout → 429.
- **Result recorded:** 50/50 before launch.
