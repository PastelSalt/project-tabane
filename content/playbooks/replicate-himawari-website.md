---
title: Rebuild the Himawari website (a product site for a free desktop app)
kind: replication-guide
goal: A bilingual static site for a free desktop app that follows its GitHub releases by itself, shows the product's docs at the released version, counts visits without cookies, and has a small script-free admin panel for news and statistics.
basedOn:
  entries:
    - himawari-sticker-design-system
    - himawari-budoux-phrases
    - himawari-release-sync
    - himawari-release-download
    - himawari-docs-import
    - himawari-docs-pages
    - himawari-product-home
    - himawari-nav-panels
    - himawari-live-app-hero
    - himawari-download-confetti
    - himawari-build-migrations
    - himawari-daily-salt-counter
    - himawari-scriptless-admin
    - himawari-admin-auth
    - himawari-db-news-static
    - himawari-admin-stats
    - himawari-server-charts
    - himawari-privacy-e2e
    - aqua-csp-build-hashes
    - aqua-build-gates
    - aqua-motion-budget
    - aqua-data-build
  sites:
    - label: Himawari website
      url: https://himawari-moekoworks.vercel.app/
status: draft
target: website
projectFile: himawari-website
---

## Before you start

- The product's repository with tagged GitHub releases, an installer asset per release, screenshots in its source and Markdown docs in a `docs/` folder.
- A plan in the product's repository: the visitors and their questions, the site map, each home section, a reference site and what changes from it, motion, quality bars, and questions for the owner with recommendations; plus an approved HTML mockup.
- Owner approval before creating the Neon database, the Vercel project, its deploy hook and the environment values.

## Steps

### Plan first

Write the plan and the mockup before any code. Reuse earlier projects by name, and say in each module's comment where it came from.

### Create the Astro project

Static output, the Vercel adapter with the rolldown stub, the sitemap with i18n alternates, fonts (the Japanese one as a cached `/fonts/jp.css`), typed environment values and `checkOrigin`.

### Tokens and the sticker style

Paper, one accent used only for fills, thick outlines with offset shadows on clickable things and windows, pill section titles, the code-drawn flower, the icon sprite and the contrast script. See `himawari-sticker-design-system`.

### Base layout and languages

Meta and hreflang, the pre-paint Motion switch with `?still`; English at `/` and Japanese at `/ja` with typed copy files; BudouX phrases for Japanese headlines. See `himawari-budoux-phrases`.

### Releases and docs

The release sync before every build, the download block and page; the docs import with link adaptation and the docs pages. See `himawari-release-sync`, `himawari-release-download`, `himawari-docs-import` and `himawari-docs-pages`.

### Home page

The sections in order, the header with nav panels and the popover menu, the FAQ, and the live app-window hero. See `himawari-product-home`, `himawari-nav-panels` and `himawari-live-app-hero`.

### Motion

Reveals, letter pops, off-screen pausing, idle loops and the download confetti, all behind the Motion switch. See `aqua-motion-budget` and `himawari-download-confetti`.

### Database

Neon with a Drizzle schema and migrations, migrations in every build (each preview on its own branch), and integration tests on PGlite. See `himawari-build-migrations`.

### Visit counter

The cookieless counter with its daily salt, the rate limit, the daily cron, and a Privacy page that describes exactly what is stored. See `himawari-daily-salt-counter`.

### Security headers

Security headers in `vercel.json` and the build-time CSP hashes. See `aqua-csp-build-hashes`.

### Admin panel

The owner created from environment values on first sign-in, the auth, the script-free pages, and database news with the custom loader and the deploy hook. See `himawari-scriptless-admin`, `himawari-admin-auth` and `himawari-db-news-static`.

### Statistics

The admin statistics with download counts per release, and the server-drawn charts. See `himawari-admin-stats` and `himawari-server-charts`.

### Tests and CI

e2e with the privacy fixture, axe and link checks; the JS budget; CI. See `himawari-privacy-e2e` and `aqua-build-gates`.

### Share images and launch

Make the share images and icons, deploy, set the environment values, sign in, change the password, then delete the temporary values. See `aqua-data-build`.

## Gotchas

- `@astrojs/vercel` 11.0.13 leaks `import "rolldown"` into the function, so every on-demand route fails; alias it to an empty stub.
- `clientAddress` throws on this adapter; read `x-forwarded-for`, then `x-real-ip`.
- On-demand pages can't use inline scripts hashed at build, so the admin panel runs no scripts at all.
- canvas-confetti's worker needs a `blob:` URL; use `useWorker: false` instead of loosening the CSP.
- `<wbr>` with `word-break: keep-all` broke inside words in Chrome where a phrase met a tag; use BudouX phrase spans.
- sharp's text renderer can't read woff2; fetch the fonts as TTF for the share images.
- Content shown on hover must be dismissible: Escape and choosing a link close the nav panels (WCAG 1.4.13).
- The default dark code theme fails contrast; turn syntax highlighting off.
- A configured but unreadable database must fail the build, or old news gets published; Vercel keeps the last good deploy.
- Neon returns bigint as a string.
- Deleting views at 90 days can cut a day in half; statistics use single views for at most 88 days.
- Daily salts mean daily visitors: one person on two days counts twice.
- GitHub can be unreachable or rate-limited at build; download everything first, write only when it has all arrived, keep the committed files otherwise.
- Show the installer size in MiB, as Windows shows it.
- `__Host-` cookies need HTTPS; plain-http local development needs another cookie name.
- Any build with `DATABASE_URL_UNPOOLED` set migrates that database, including a local build pointed at production.

## Finished looks like

Every page passes the e2e checks in both languages with no cookies and no third-party requests, the download button shows the latest release on its own after a new release and a rebuild, and a news post published in `/admin` is live in about two minutes.
