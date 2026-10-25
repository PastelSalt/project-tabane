---
title: Aqua Iro · Build quality gates and CI
layer: backend
origin: own-project
stack:
  - typescript
  - playwright
feature:
  - testing
  - performance
status: proven
target: website
reuseNote: A site with strict design and speed rules enforces them in the build and CI, not by memory.
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: scripts/check-budget.ts
  ref: 616052f
projectFile: aqua-iro-archive
diagrams:
  - id: system
    level: 1
    title: Build and CI
    file: level-1-system.mmd
  - id: ci
    level: 2
    parent: system
    expands: e2e
    title: CI job
    file: level-2-ci.mmd
related:
  - aqua-csp-build-hashes
  - aqua-db-drivers-pglite
  - hanon-cdp-test-harness
  - himawari-privacy-e2e
usedIn:
  - Aqua Iro Archive
  - Himawari Website
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The build and CI refuse anything that breaks the site's own rules.

- **Build order:** data (streams build with assertions) → Talk validation → `astro check` → `astro build` → prune unused images → CSP hashes.
- **JS budget** (`check-budget.ts`): sums the gzip size of every script a page loads (`<script src>`, modulepreloads, island component and renderer URLs, static imports only) and fails above 110 % of the budget: Home 120 KB, Streaming 80 KB, other pages 70 KB.
- **Contrast** (`contrast-check.ts`): every text colour pair in the tokens at WCAG AA.
- **Talk validation** (`validate-talk.ts`): schema and graph checks; errors fail the build, warnings print.
- **Pruning** (`prune-assets.ts`): deletes images Astro emitted that no HTML, CSS, JS or JSON references, keeping the deploy under 80 MB.
- **CI** (`.github/workflows/ci.yml`): Turnstile testing keys; a cache for Astro's font and image downloads (flaky without it); lint, contrast, unit, data and PGlite integration tests; migrations and seed on a temporary Neon branch when a key exists; the build retried once; the JS budget; Playwright on Chromium and WebKit (WebKit with reduced motion), axe accessibility, 37 visual baselines, a "nothing covers content" check; the report uploaded on failure; the Neon branch deleted.
- **Himawari Website:** the same gates, smaller: contrast script, a 40 KB JS budget per page, build retried once, Playwright on Chromium, WebKit and a mobile profile, plus `npm audit` in CI and a privacy fixture on every e2e test (`himawari-privacy-e2e`).

## Key code

```ts path=scripts/check-budget.ts
const BUDGET_KB: Record<string, number> = { '/': 120, '/streaming': 80 };
const DEFAULT_KB = 70;
// …
for (const html of pages(DIST)) {
  const route =
    '/' +
    html
      .slice(DIST.length + 1)
      .replace(/(index)?\.html$/, '')
      .replace(/\/$/, '');
  if (SKIP.some((s) => route.startsWith(s))) continue;
  const doc = readFileSync(html, 'utf8');
  const seen = new Set<string>();
  for (const m of doc.matchAll(/(?:src|href|component-url|renderer-url)="(\/_astro\/[^"]+\.js)"/g))
    imports(join(DIST, m[1]!), seen);
  const kb = [...seen].reduce((a, f) => a + size(f), 0) / 1024;
  const budget = BUDGET_KB[route] ?? DEFAULT_KB;
  const ok = kb <= budget * 1.1;
  if (!ok) fail++;
  console.log(`${ok ? '✓' : '✗'} ${route.padEnd(14)} ${kb.toFixed(1).padStart(6)} KB gz (budget ${budget})`);
}
if (fail) process.exit(1);
```
