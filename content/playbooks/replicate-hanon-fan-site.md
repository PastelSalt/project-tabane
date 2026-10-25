---
title: Derive a sister fan site from Kotoha (the Hanon way)
kind: replication-guide
goal: A new fan site with its own identity, built by copying the Kotoha fan site and rebranding it, then tested end to end before launch. The main guide for new fan sites.
basedOn:
  entries:
    - hanon-sazanami-theme
    - hanon-sticker-sprite
    - hanon-pglite-preview
    - hanon-admin-smoke-test
    - hanon-cdp-test-harness
    - kotoha-scrapbook-design-system
    - kotoha-clover-loader
    - kotoha-stream-ticket-week
    - kotoha-image-pipeline
    - kotoha-bilingual-i18n
    - kotoha-admin-panel
    - kotoha-admin-auth
    - kotoha-content-crud-archive
    - kotoha-db-scripts
    - kotoha-security-headers
  sites:
    - label: Hanon Fan Site
      url: https://hanon-fansite.vercel.app/
    - label: Kotoha Fan Site (the base)
      url: https://kotoha-fansite.vercel.app/
status: draft
target: website
projectFile: hanon-fansite
---

## Before you start

- The Kotoha fan site's repository (or the latest sister site), at a known commit; its `FORHANON.md` lists everything that carries the Kotoha name.
- The new subject's name logo, a transparent full-body model, and section artwork with credits for every piece. Where something is missing, plan a substitute first (Hanon: no mascot → the penguin sticker; one loader artwork short → reuse section art).
- Owner approval, per resource, before creating the Neon database, the Cloudinary folder and preset, and the Vercel project.

## Steps

### Plan with an asset gap table

Read the base site's handoff notes, list every asset the base uses and what the new site has for each, map artwork to sections and the loader, and ask the owner the open questions with a recommendation and a confidence level each.

### Import and rename

Copy the base site's `main`, then work through the rename checklist: grep for every name, kana, nickname, storage-key prefix, symbol id and emoji of the old subject (Hanon grepped `kotoha|Kotoha|KOTOHA|ことは|ことリス|Kotorisu|kf_|clover|cl-leaf|🍀`), and change cookies, storage keys, Cloudinary names, guessable password words, the stream schedule, special days, copy, palette and sprite. Grep again at the end in both languages.

### New identity: tokens, sprite, loader

Replace the colour scales in the tokens and check every pair's contrast; build the sticker sprite with one class and colour variables; change the loader's shape while keeping its timing model. Stop for a style-tile review with the owner. See `hanon-sazanami-theme` and `hanon-sticker-sprite`, built on `kotoha-scrapbook-design-system` and `kotoha-clover-loader`.

### Artwork

Wire the artwork into the sections and the loader, update the image script's list, and make the favicon from the new sticker with fixed colours. See `kotoha-image-pipeline`.

### Copy and both languages

Rewrite the English and Japanese locale files for the new subject; facts come from official sources only, and the site's voice never puts words in the subject's mouth. Write the stream schedule as one exported constant. See `kotoha-bilingual-i18n` and `kotoha-stream-ticket-week`.

### Preview without a database

Add the PGlite hook so the public pages run with seed content before any database exists, and to prove the migrations run. See `hanon-pglite-preview`.

### Infrastructure, one approval at a time

Create the Neon database, the Cloudinary folder and preset, and the Vercel project only after the owner approves each; run the migrations and seed; link the sister sites to each other. See `kotoha-db-scripts`.

### Admin smoke test on a throwaway branch

Copy production to a throwaway Neon branch, run the local server against it, run the 50 admin checks, then delete the branch. See `hanon-admin-smoke-test`, covering `kotoha-admin-auth` and `kotoha-content-crud-archive`.

### Commit the browser harness

Commit the DevTools-protocol harness and run the behaviour suite and the scroll benchmark; fix what it finds before launch (Hanon found the marquee bug this way). See `hanon-cdp-test-harness`.

### Keep the admin in step with the base

When the base site's admin is redesigned, port it by theme only: same layout, components, behaviour and locale keys, with only the colour roles and sprite symbols mapped. See `kotoha-admin-panel`.

### QA and launch

Check every section in both languages at desktop and phone sizes with no console errors or CSP violations (see `kotoha-security-headers`), reset test data, and launch with the owner's OK.

## Gotchas

- Rebranding leaves leftovers: grep the whole rename list again after the copy, in English and Japanese, keeping only intentional mentions of the sister.
- A `<symbol>` brings its own `viewBox`; a second one on the `<svg>` that uses it shifts the shape by half its size.
- Favicons can't use CSS variables or `<use>`; flatten the sticker to fixed colours.
- The PGlite preview covers the public API only; admin and auth need the real database.
- The admin smoke test changes data: only against a throwaway database branch, never production, and delete the branch afterwards.
- White text on light brand gradients can fail contrast; keep sticker labels at 19 px bold or larger.
- A role colour must not be a decorative-only colour (Hanon's visitors became gold, not logo pink).
- Scroll benchmarks differ by machine; compare back-to-back on one machine only.

## Finished looks like

The new site passes the behaviour suite in English and Japanese, the admin smoke test passes 50/50 on a throwaway branch, no trace of the old subject remains, and the owner approved the style tile, the QA and the launch.
