---
title: Replicate the Kotoha fan site
kind: replication-guide
goal: A bilingual, cookieless one-page fan site with no build step, a themed admin panel, signed image uploads and its own statistics, running on Vercel, Neon and Cloudinary's free plans.
basedOn:
  entries:
    - kotoha-grouped-functions
    - kotoha-sleeping-db-cache
    - kotoha-db-scripts
    - kotoha-keyset-pagination
    - kotoha-admin-auth
    - kotoha-content-crud-archive
    - kotoha-cloudinary-uploads
    - kotoha-image-pipeline
    - kotoha-scrapbook-design-system
    - kotoha-clover-loader
    - kotoha-crossfade-backdrop
    - kotoha-nav-pill-circle-menu
    - kotoha-stream-ticket-week
    - kotoha-youtube-polaroid
    - kotoha-news-notes
    - kotoha-record-sleeves
    - kotoha-year-timeline
    - kotoha-masonry-lightbox
    - kotoha-profile-card
    - kotoha-footer-credits
    - kotoha-bilingual-i18n
    - kotoha-motion-calm-mode
    - kotoha-scroll-life
    - kotoha-scroll-reveals
    - kotoha-sparkles-confetti
    - kotoha-admin-panel
    - kotoha-analytics-dashboard
    - kotoha-cookieless-analytics
    - kotoha-security-headers
  sites:
    - label: Kotoha Fan Site
      url: https://kotoha-fansite.vercel.app/
status: draft
target: website
projectFile: kotoha-fansite
---

## Before you start

- Node 22 or newer, a GitHub repository, and free Vercel, Neon and Cloudinary accounts.
- The original artwork and logos, kept outside `public/` (they stay out of the deploy).
- Written permission and credits for every piece of fan art you will show.
- This is the history of how the original was built. For a new fan site, start from `replicate-hanon-fan-site` instead: it derives a sister site from this one.

## Steps

### Set up the repository

Static `public/`, `api/`, `lib/`, `scripts/` and `db/` folders; `package.json` with ES modules; `vercel.json` with the `/api/<group>/<route>` → `?__route=` rewrites; `.vercelignore` with patterns that start with `/`. See `kotoha-grouped-functions`.

### Create the database and image accounts

A Neon database and a Cloudinary account with a signed upload preset and a folder; copy `.env.example` to `.env.local` and fill it in. See `kotoha-sleeping-db-cache` and `kotoha-cloudinary-uploads`.

### Write the schema and seeds

`db/migrations/0001_init.sql` (admin users and sessions, login attempts, the content tables, gallery images, the archive, the activity log, raw and daily analytics), run the migrations, and write an idempotent `seed.sql`. See `kotoha-db-scripts`.

### Server libraries and the public API

`lib/http.js`, `lib/db.js` with the safe retry, `lib/paging.js`, `lib/validate.js`; then `api/public.js` with its list table, and `scripts/dev-server.js` mirroring the rewrites and headers. See `kotoha-grouped-functions`, `kotoha-sleeping-db-cache` and `kotoha-keyset-pagination`.

### Auth

`lib/password.js` (Argon2id, policy, guessable words, Have I Been Pwned), `lib/auth.js` (sessions, guards, activity log) and `api/auth.js`; bootstrap the Owner with `npm run admin:bootstrap`. See `kotoha-admin-auth`.

### Admin API

Config-driven CRUD with drafts, archive instead of delete, the activity log, the YouTube oEmbed lookup and Cloudinary signing. See `kotoha-content-crud-archive` and `kotoha-cloudinary-uploads`.

### Image pipeline

Originals in `assets/`, then `npm run images:optimize` for widths, focal-point phone crops, icons and the share image. See `kotoha-image-pipeline`.

### Design system

Tokens, base, components and the sprite first, then layout and motion files, all in cascade layers. See `kotoha-scrapbook-design-system`.

### The page

Loader, backdrop, nav and phone menu, the five sections and the footer, the lightbox; the builders in `render.js` and the paged lists. See `kotoha-clover-loader`, `kotoha-crossfade-backdrop`, `kotoha-nav-pill-circle-menu`, `kotoha-stream-ticket-week`, `kotoha-youtube-polaroid`, `kotoha-news-notes`, `kotoha-record-sleeves`, `kotoha-year-timeline`, `kotoha-masonry-lightbox`, `kotoha-profile-card` and `kotoha-footer-credits`.

### Two languages

JA and EN dictionaries, `data-i18n` bindings, the geo default and the pre-paint language. See `kotoha-bilingual-i18n`.

### Motion

The motion preference and calm mode first, then the beat, the single scroll ticker, the marquee, the reveals, sparkles, confetti and the GSAP arrivals. See `kotoha-motion-calm-mode`, `kotoha-scroll-life`, `kotoha-scroll-reveals` and `kotoha-sparkles-confetti`.

### Admin panel

The shell, the UI kit in the site's theme, the config-driven forms and the gallery manager. See `kotoha-admin-panel`.

### Statistics

The tracker, the beacon endpoint, the lazy rollups and the dashboard. See `kotoha-cookieless-analytics` and `kotoha-analytics-dashboard`.

### Security headers

CSP and SRI in `vercel.json`; verify every SRI hash against the bytes actually served. See `kotoha-security-headers`.

### Performance and tests from the start

Follow the performance rules (one scroll ticker, nothing per frame on `<html>`, no smooth-scroll library, `.is-far`), and commit the browser test scripts instead of keeping them in a scratchpad.

### Deploy and launch

Deploy, run `prelaunch-reset.js` (dry run first) to wipe test data, then have the Owner sign in and change the password.

## Gotchas

- `.vercelignore` patterns must start with `/`: an unanchored `assets` also removed `public/assets`.
- Never put `--` in an SVG sprite comment; it silently breaks the whole sprite.
- `display: grid` overrides the `hidden` attribute; keep `[hidden] { display: none !important }`.
- Render each admin page into its own container behind a guard, or a slow page overwrites the current one.
- GSAP and a CSS scroll-driven `transform` on the same element fight; animate a wrapper.
- `content-visibility: auto` on sections hung Chrome during View Transitions; use `.is-far` instead.
- Write the stream schedule once; the original keeps it in two files.
- A per-frame custom property on `<html>` restyles the whole document; write it only on the elements that need it.
- No CSS transition on a property JavaScript changes every frame.
- The free database sleeps: edge stale-while-revalidate, a 15 s client timeout, and a loader that waits at most 4 s for data.
- No inline scripts, or the CSP needs hashes; pre-paint logic lives in small classic files.
- An infinite Web Animation played in reverse finishes at 0 and `play()` throws; start it far into its timeline.
- SVG chart text scales with its `viewBox`; draw charts at their real pixel width.

## Finished looks like

The public page passes the behaviour checks in English and Japanese with no console errors or CSP violations, the admin can publish, upload, archive and restore, and the dashboard shows the first production visits.
