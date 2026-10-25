---
title: Aqua Iro · Data import and list build
layer: backend
origin: own-project
stack:
  - typescript
  - sharp
feature:
  - image-pipeline
status: proven
target: website
reuseNote: A data-heavy static site turns raw exports and curated art into checked content, compact images and share cards at build.
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: scripts/build-streams.ts
  ref: 616052f
projectFile: aqua-iro-archive
diagrams:
  - id: system
    level: 1
    title: Data and images
    file: level-1-system.mmd
related:
  - aqua-stream-log-search
  - aqua-time-travel
  - kotoha-image-pipeline
usedIn:
  - Aqua Iro Archive
  - Himawari Website
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The scripts that turn raw material into the archive's content.

- **One-time import** (`import-rawdata.ts`): the planning document's tables became YAML content files; "after this runs once, the YAML files are the source of truth".
- **Content collections** (`content.config.ts`): Astro `file()` loaders over YAML with Zod schemas (profile, lore, relationships, links, clips, five song lists, milestones, records, subscribers, yearly totals, timeline, brands, 190 artworks), sharing small schemas for both-language text, YouTube ids and partial dates.
- **Streams** (`build-streams.ts`): `streams.full.tsv` plus overrides → `streams.json` and a prebuilt Fuse index; the build fails if any assertion does not hold.
- **Images** (`prepare-images.ts`): copies only files the art list, poses and logos reference; long edge 2000 px, metadata stripped, near-lossless WebP for transparent images and JPEG otherwise; writes image, credit and source back into `arts.yaml` (comments kept); fails above a size budget. Astro re-encodes to AVIF/WebP at build; one 1600 px lightbox size.
- **Share images** (`make-og.ts`): 1200×630 per chapter from official art, the title and a credit line.
- **Curation rule:** press images, duplicates, animated GIFs and pin-up pieces were left out to keep the archive all-ages.
- **Himawari Website:** reuses `make-og.ts` for English and Japanese 1200×630 share images, run by hand with the output committed; sharp's text renderer can't read woff2, so it fetches the fonts as TTF into `node_modules/.cache/og-fonts`.
