---
title: Rebuild Aqua Iro Archive (an Astro fan archive with a moderated board)
kind: replication-guide
goal: A static Astro fan archive in numbered chapters with persisted chrome, a measured motion and fill budget, and a small on-demand back end for an anonymous, moderated message board with a single two-factor admin.
basedOn:
  entries:
    - aqua-harbour-design-system
    - aqua-filler-kit
    - aqua-chapter-skeleton
    - aqua-bilingual-islands
    - aqua-bottom-dock
    - aqua-splash-title-screen
    - aqua-tide-shutter
    - aqua-onboarding-tour
    - aqua-dialog-lightbox
    - aqua-docking-filter-bar
    - aqua-stream-log-search
    - aqua-motion-budget
    - aqua-dialogue-box
    - aqua-time-travel
    - aqua-data-build
    - aqua-db-drivers-pglite
    - aqua-posting-pipeline
    - aqua-report-auto-hide
    - aqua-message-board
    - aqua-keeper-auth-totp
    - aqua-moderation-audit
    - aqua-keeper-panel
    - aqua-hobby-ops
    - aqua-csp-build-hashes
    - aqua-first-party-umami
    - aqua-build-gates
  sites:
    - label: Aqua Iro Archive
      url: https://aqua-iro-archive.vercel.app/
status: draft
target: website
projectFile: aqua-iro-archive
---

## Before you start

- A plan document: the chapters, the three design layers, and the budgets (JS per page, motion, empty area), with a "Decisions" section the owner dates as they decide.
- The content: official art with credits for every piece, raw data tables, and the facts from official sources only. Lines written for the character are labelled as fan-written.
- Owner approval before creating the Neon database, the Turnstile keys, the Umami site and the Vercel project.

## Steps

### Plan first

Write the plan document before any code: chapters, layers and budgets, and a Decisions section. Each later big change gets its own plan and is built in parts named after it.

### Create the Astro project

Static output with the Vercel adapter, Preact, the sitemap, typed environment variables and `checkOrigin`; TypeScript strict, ESLint and Prettier.

### Content and data

Content collections with Zod schemas, a one-time import of the raw tables to YAML (the YAML is the source of truth afterwards), and data build scripts that fail the build when an assertion does not hold. See `aqua-data-build`.

### Tokens and the three layers

The wash, paper and the deep, colour roles, the tilt rule and the two card shapes; one SVG sprite and the icons; a contrast script over every text pair. See `aqua-harbour-design-system`.

### Base layout

The pre-paint preferences script, the Japanese fonts as one cached stylesheet, ClientRouter with the `onPage()` lifecycle, safe storage, and the bilingual `<T>` with `useLang`. See `aqua-bilingual-islands` and `aqua-chapter-skeleton`.

### Chapters and fillers

The numbered page skeleton and the chapter list, then the filler kit and the "no empty area" pixel test. See `aqua-chapter-skeleton` and `aqua-filler-kit`.

### Persisted chrome

The one-size dock, the LOG drawer, the BGM capsule and HELP, all `transition:persist`; then the splash, the tide shutter and the tour. See `aqua-bottom-dock`, `aqua-log-drawer`, `aqua-bgm-capsule`, `aqua-splash-title-screen`, `aqua-tide-shutter` and `aqua-onboarding-tour`.

### Chapter pages

The lightbox, the docking filter bar, and prerendered lists with instant filters and a lazy search index. See `aqua-dialog-lightbox`, `aqua-docking-filter-bar` and `aqua-stream-log-search`.

### Motion with a budget

Every animation behind one Motion switch, in four kinds with their own rules, measured against the budget on a weak laptop. See `aqua-motion-budget`.

### Signature features

The features written around the subject (for Aqua: Talk and Aqua Time), with their content checked at build. See `aqua-dialogue-box` and `aqua-time-travel`.

### Database

Neon with a Drizzle schema and migrations, the HTTP driver for public routes and the WebSocket Pool for transactions, and integration tests on PGlite. See `aqua-db-drivers-pglite`.

### The board

Shared text rules, the posting pipeline, reports with auto-hide, undo, settings and the word filter, then the board island. See `aqua-posting-pipeline`, `aqua-report-auto-hide` and `aqua-message-board`.

### The keeper

Better Auth with forced TOTP, the middleware guard, moderation with an audit row for every action, the keeper pages and the admin scripts. See `aqua-keeper-auth-totp`, `aqua-moderation-audit` and `aqua-keeper-panel`.

### Upkeep

Discord alerts, the error log table, the daily clean-up cron and encrypted weekly backups. See `aqua-hobby-ops`.

### Security and analytics

Security headers and build-time CSP hashes; Umami served through the site's own paths. See `aqua-csp-build-hashes` and `aqua-first-party-umami`.

### Quality gates and CI

Unit, data and PGlite tests, e2e on Chromium and WebKit with accessibility and visual baselines, the JS budget, and migrations on a temporary Neon branch. See `aqua-build-gates`.

### Deploy, open the board, audit

Deploy, open the board with the setup checklist (Turnstile keys, the keeper account, alerts), then audit at real screen sizes and fix the findings in order.

## Gotchas

- ClientRouter copies `<html>` attributes from the incoming page, so `data-motion`, `data-lang` and `lang` vanish; re-apply them on `astro:after-swap`.
- The CSP hashes are written into `vercel.json` after the build, and the committed copy is what is served: after changing an inline script or upgrading Astro, build locally and commit `vercel.json`. The pre-paint script must stay byte-identical.
- Inlining the Japanese fonts made every page about 250 KB gzipped; serve them once from a cached stylesheet.
- Astro emits original images nobody uses; prune unreferenced images to stay under the 80 MB deploy budget.
- The native view transition takes seconds on GPU-less WebKit; with Motion OFF, run the swap without one.
- Pausing off-screen animations must not freeze one-shot entrances; only loops may be paused.
- Revealing single tiles on a 190-tile gallery left gaps; reveal section-level blocks only.
- Several scroll listeners deciding the chrome's state disagreed; use one module, and keep the dock one size.
- Islands are server-rendered in Japanese, so the first client render must be Japanese too.
- Browser auto-translate breaks islands; mark the page `notranslate`.
- Bare "www" is laughter in Japanese; link detection needs a domain after `www.`.
- WebKit e2e needs reduced motion, or the dock isn't clickable there.
- Google Fonts downloads are flaky in CI; cache Astro's downloads and retry the build once.
- Vercel Hobby keeps runtime logs for one hour; write errors to a table too.
- Neon's HTTP driver has no interactive transactions; use the WebSocket Pool for admin and auth.
- YAML flow maps split on commas; quote every Talk line.
- Storage can throw; wrap every call and make the site work with it blocked.

## Finished looks like

Every chapter passes the e2e and visual checks at laptop and phone sizes with Motion on and off, the board accepts and moderates a note end to end, and the keeper signs in only with TOTP.
