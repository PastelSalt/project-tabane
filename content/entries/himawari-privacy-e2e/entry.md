---
title: Himawari · Privacy-first e2e checks
layer: backend
origin: own-project
stack:
  - playwright
feature:
  - testing
  - security
status: proven
target: website
reuseNote: A site that promises no cookies and no third-party requests proves it in every end-to-end test, on the built site with its real headers.
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: tests/e2e/fixtures.ts
  ref: 4eb655c
projectFile: himawari-website
diagrams:
  - id: system
    level: 1
    title: e2e checks
    file: level-1-system.mmd
related:
  - aqua-build-gates
  - hanon-cdp-test-harness
usedIn:
  - Himawari Website
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Playwright tests that fail on anything that breaks the site's privacy promise (`tests/e2e/*`).

- **One fixture for every test** (`fixtures.ts`): it collects uncaught page errors, console errors, CSP violations and **any request that leaves the site's origin**, and fails the test if there are any.
- **Real headers:** `scripts/dev/serve-dist.mjs` serves the built site with the headers from `vercel.json`, so the CSP is the one visitors get.
- **Checks on every page:** axe, broken links, exactly one `h1`, the right `lang`, no sideways scroll, and no cookies.
- **Browsers:** Chromium, WebKit and a mobile profile.
- **Quality bars as tests:** no third-party requests, no CSP violations, no cookies, no broken links, axe on every page, 40 KB of JS per page (the budget script).
- **Stale comment:** `serve-dist.mjs` was copied from Aqua and still says it doesn't serve `/_actions` and `/keeper`, which don't exist here.

## Key code

```ts path=tests/e2e/fixtures.ts
import { test as base, expect } from '@playwright/test';

/**
 * Every test fails on uncaught errors, CSP violations, or any request that leaves the site
 * (WEBSITE.md §10: no third-party requests).
 */
export const test = base.extend<{ errors: string[] }>({
  errors: async ({ page, baseURL }, use) => {
    const errors: string[] = [];
    const origin = new URL(baseURL!).origin;
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (m) => {
      const t = m.text();
      if (m.type() === 'error') errors.push(`console: ${t}`);
      if (/Content Security Policy|Refused to (execute|load|apply)/i.test(t)) errors.push(`csp: ${t}`);
    });
    page.on('request', (r) => {
      const u = r.url();
      if (!u.startsWith(origin) && !u.startsWith('data:')) errors.push(`third-party request: ${u}`);
    });
    await use(errors);
    expect(errors, errors.join('\n')).toEqual([]);
  },
});
export { expect };
```
