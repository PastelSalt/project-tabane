---
title: Hanon · Headless Chrome test harness without Puppeteer
layer: backend
origin: own-project
stack:
  - node-js
  - javascript
feature:
  - testing
  - performance
status: proven
target: website
reuseNote: A no-build site needs committed browser tests, screenshots and scroll benchmarks that run against any copy of the codebase.
repository:
  name: PastelSalt/hanon-fansite
  url: https://github.com/PastelSalt/hanon-fansite
codeLocation:
  path: scripts/perf/cdp.js
  ref: 1e5d114
projectFile: hanon-fansite
diagrams:
  - id: system
    level: 1
    title: Harness
    file: level-1-system.mmd
  - id: server
    level: 2
    parent: system
    title: Test server
    file: level-2-server.mmd
related:
  - hanon-admin-smoke-test
  - kotoha-scroll-life
  - kotoha-scroll-reveals
  - aqua-build-gates
  - himawari-privacy-e2e
usedIn:
  - Hanon Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Browser tests kept in the repository (Kotoha's lived in a scratchpad and were lost), driving headless Chrome over the DevTools protocol with Node's built-in `WebSocket`, no Puppeteer.

- **`cdp.js` (119 lines):** launches Chrome headless with a debugging port and drives one page: `newPage`, `goto`, `waitFor(expr)`, `eval`, `send`, `screenshot`.
- **`server.js` (57):** serves a site's `public/` with the CSP and headers from its `vercel.json`, proxies `/api/public/*` to a deployed site (read-only GETs, cached in memory) and answers `/api/track` with 204, so tests never pollute the statistics. So the same harness runs against any build, Kotoha included.
- **`behaviour.js` (132):** 21 checks, one PASS or FAIL line each, non-zero exit on failure: the loader spinner paints and turns from first paint; confetti isn't loaded during the loader; Home opens with its art; one wheel notch scrolls and stays; the marquee is one Web Animation, reverses scrolling up and runs again after calm → full; the progress meter fills; lean is never written to off-screen cards or on `<html>`; far sections get `.is-far`; the lightbox opens, locks scroll and closes on Escape; the motion toggle; switching to Japanese; no console errors or CSP violations; a reduced-motion device starts calm; the phone menu opens, locks scroll, and a link closes it on its section.
- **`scroll-bench.js` (101):** wheel-scrolls the page down and up, records every frame and long task; options for size, CPU slowdown, GPU, runs, language, a timeline trace, and **`OFF="css"` isolation experiments** that switch one effect off to measure its cost.
- **`shots.js` (45):** screenshots of every section at 1920×1080, 1366×768 and 390×844, per language and motion mode, optionally the loader.
- **Findings it produced:** the marquee bug (fixed here, later ported to Kotoha); on the owner's GPU the rebrand cost nothing (Hanon 13.1 fps vs Kotoha 12.6), and the time goes to the GPU process. Compare benchmarks only back-to-back on one machine.
