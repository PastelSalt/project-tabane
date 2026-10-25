---
title: Kotoha · Neon with safe retries and edge cache
layer: backend
origin: own-project
stack:
  - node-js
  - neon-postgres
feature:
  - database
  - performance
status: proven
target: website
reuseNote: A free database that sleeps when idle must still give visitors fast pages and never run a statement twice.
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: lib/db.js
  ref: 41d4bd8
projectFile: kotoha-fansite
diagrams:
  - id: system
    level: 1
    title: Public read path
    file: level-1-system.mmd
  - id: edge
    level: 2
    parent: system
    title: Edge cache
    file: level-2-edge.mmd
  - id: retry
    level: 2
    parent: system
    expands: neon
    title: Safe retry
    file: level-2-retry.mmd
related:
  - kotoha-grouped-functions
  - kotoha-keyset-pagination
  - aqua-db-drivers-pglite
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

How a free Neon database that sleeps after a few idle minutes stays invisible to visitors.

- **Safe retries:** a custom `fetchFunction` for the Neon HTTP client retries up to three times (500 ms × attempt) **only** when the connection itself failed to open (`UND_ERR_CONNECT_TIMEOUT`, `ECONNREFUSED`, `ENOTFOUND`, `EAI_AGAIN`), so a statement can never run twice.
- **Edge cache:** public routes answer with `s-maxage=60, stale-while-revalidate=86400`, so the edge serves the last good answer for a day while it revalidates in the background; visitors rarely meet a cold database.
- **Client patience:** `getJson` waits up to 15 s (waking takes about 10 s); the loader waits at most 4 s for Home data before showing loading cards.
- **Admins:** the admin API client shows a "waking up the database" toast after 2.5 s.
- **Queries:** `sql` tagged templates (always parameterised), `query(text, params)` for dynamic SQL, and `transaction(build)`.

## Key code

```js path=lib/db.js
const SAFE_TO_RETRY = new Set(['UND_ERR_CONNECT_TIMEOUT', 'ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN']);
neonConfig.fetchFunction = async (url, init) => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetch(url, init);
    } catch (err) {
      if (attempt >= 3 || !SAFE_TO_RETRY.has(err?.cause?.code)) throw err;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
};
```
