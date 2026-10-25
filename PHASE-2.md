# Phase 2 · Content system and the five projects

2026-10-25 · Plan by Claude for Kyle Q. Zoleta. Revised twice the same day: first around project files, then (v3) for **all five project files at once**, now that they are written and their open questions answered.

## Where things stand

| Ready | Not ready |
|---|---|
| The working UI from Phase 1, on sample data | The content system: no `content/` folder, loader, content check, image route or templates yet (the site still reads `src/lib/samples.ts`) |
| Five project files in `projects/`: Kotoha, Hanon, Aqua Iro Archive, Himawari website, Moeko Works portfolio | The entries themselves: **98 entries** (58 UI/UX, 40 Backend) and **5 replication guides** still have to be written as files, with wireframes, diagrams and screenshots |
| All 34 open questions answered (`projects/OPEN-QUESTIONS.md`) | A way to draw ~58 wireframes that look alike, and to save screenshots of five sites that all refuse to be framed |

So the projects can't go on the site yet. This plan builds the system first (steps 1–9), then applies the projects one at a time (steps 10–14).

## Goal

When Phase 2 is done:

- Every entry and playbook is a file in `content/`, checked before every build.
- The five project files are applied: 98 entries and 5 Draft replication guides, each traceable to its project file.
- Every UI/UX entry has a wireframe and screenshots; every Backend entry has leveled diagrams.
- The Library shows only real entries; the Phase 1 samples stay for UI testing only.
- `CLAUDE.md` tells any future Claude session how to write, apply and update a project file.

## How content gets in

| Step | Who | What happens |
|---|---|---|
| 1. Ask | Kyle | "Make the project file for X" |
| 2. Write | Claude | Pulls and reads the project, writes `projects/<name>.md`, adds its questions to `projects/OPEN-QUESTIONS.md` |
| 3. Review | Kyle | Reads the file and answers its questions |
| 4. Apply | Claude, when Kyle says | Turns the file into entries and a replication guide, runs the content check, commits, logs, moves its questions to "Answered and applied" |
| 5. Update | Claude, when asked | If the project or its file changes, applying again updates the entries to match |

- **The project file is the source of truth.** Entries are made from it and link back to it.
- **Project files are source notes:** in the repository, not shown on the site.

## Counts per project

| Project file | UI/UX | Backend | Guide | Notes |
|---|---|---|---|---|
| `kotoha-fansite.md` | 19 | 10 | `replicate-kotoha-fan-site` | applied first; Hanon builds on it |
| `hanon-fansite.md` | 2 | 3 | `replicate-hanon-fan-site` (**the main fan-site guide**, H3) | differences-only file; also adds Hanon to Used in on the 29 Kotoha entries, with notes |
| `aqua-iro-archive.md` | 18 | 10 | `replicate-aqua-iro-archive` | |
| `himawari-website.md` | 9 | 9 | `replicate-himawari-website` | the site only; adds Himawari to Used in on the Aqua and Kotoha entries it reuses (W1) |
| `moekoworks-official.md` | 10 | 8 | `replicate-moekoworks-portfolio` | Himawari's counter links to it as its source (W4, M2) |
| **Total** | **58** | **40** | **5** | **98 entries** |

## Project file format

`projects/<name>.md`, one per project or site, from `projects/_template.md`. Two kinds:

- **Full file** (Kotoha, Aqua Iro, Himawari website, portfolio): the 16 sections the four real files use — header, overview, stack, architecture, structure, visual design, front end, back end, data model, process, reusable pieces, gotchas, proposed entries, replication guide, new tag values, open questions, sources.
- **Differences-only file** (Hanon): a header with **Derived from**, a section map back to the base file, then only what is unique, its own pieces, gotchas, proposed entries, guide, tags, questions and sources. Used when a project is a copy of another.

The template and the project-file check cover both kinds. **Researched sites** use the full kind, with notes and links only, never copied code, images or text.

## In scope

- **Content folder:** `content/`, `tags.yml`, entry and playbook templates.
- **Loader:** entry and playbook files (front matter, Markdown body, Mermaid files) in place of `samples.ts`.
- **Content check:** every file against the Entry model, the Playbook fields, `tags.yml` and the project files; runs before every build.
- **Image route:** entry images served through the site, not the public folder.
- **Search by word start.**
- **Project files:** `_template.md` (both kinds) and the project-file check.
- **Wireframe kit** *(new in v3)*: one way to draw every wireframe so 58 of them look alike.
- **Screenshot capture** *(moved here from Phase 3)*: all five sites refuse to be framed, so without it every UI/UX entry would show "No screenshot saved yet".
- **Full CLAUDE.md.**
- **All five project files applied**, then the switch to real content.

## Out of scope

| Not in Phase 2 | When |
|---|---|
| The link-check script (Last checked, Outdated) | Phase 3 |
| Re-capturing screenshots automatically when a site changes | Phase 3 (Phase 2 captures once, by hand, per project) |
| Himawari engine and Studio entries (`himawari-c`) | Only if Kyle asks for a project file for them later |
| Deploying, the password gate | Phase 4 |
| GitHub sign-in, access codes, Neon | Phase 5 |

## Rules for this phase

- Commits stay local. Claude does not push and does not ask to push.
- Every step, and every project applied, gets a line in `LOG.md` and one local commit.
- Claude only reads the project repositories (`git pull` before reading) and never commits to them.
- **Nothing is invented:** every entry comes from its project file; if the project changed since the file was written, the file is updated first (as with the Kotoha and Hanon admin refresh).
- **The answers in `OPEN-QUESTIONS.md` are followed** (for example: keep the fine-grained split, all entries Shared off, Hanon's guide is the main fan-site guide, the portfolio's repository link kept).
- Replication guides start as **Draft**.
- Screenshot runs never count as visits on the live sites: each site's analytics requests are blocked during capture.

## Content format

### Folder layout

```text
projects/                                 project files: source notes, not shown on the site
  _template.md
  OPEN-QUESTIONS.md
  kotoha-fansite.md … moekoworks-official.md
content/
  tags.yml                                every tag's fixed list, with labels
  templates/
    entry.md
    playbook.md
  entries/
    kotoha-stream-ticket-week/
      entry.md                            front matter + Technical details + Key code
      wireframe.yml                       the wireframe as a layout spec (input to the kit)
      wireframe.svg                       generated desktop wireframe
      wireframe-phone.svg                 generated phone wireframe, optional
      screenshot-desktop.png              captured from the live site
      screenshot-phone.png
    kotoha-sleeping-db-cache/
      entry.md
      level-1-system.mmd                  one Mermaid file per diagram
      level-2-retry.mmd
  playbooks/
    replicate-kotoha-fan-site.md
content-samples/                          the Phase 1 samples, as files, for UI testing only
scripts/
  check-content.ts                        the content check
  wireframes.ts                           the wireframe kit
  screenshots.ts                          the screenshot capture
```

### An entry file

~~~markdown
---
title: Kotoha · Stream ticket and week strip
layer: ui-ux
origin: own-project
stack: [javascript, css]
feature: [countdown]
status: proven
target: website
reuseNote: A page counts down to the next scheduled stream and shows the week at a glance.
liveSite: { url: https://kotoha-fansite.vercel.app/, embeddable: false }
repository: { name: PastelSalt/kotoha-fansite, url: https://github.com/PastelSalt/kotoha-fansite }
codeLocation: { path: public/js/public/countdown.js, ref: 2fa67f2 }
projectFile: kotoha-fansite
wireframe: { desktop: wireframe.svg }
screenshots: [screenshot-desktop.png, screenshot-phone.png]
diagrams: []
related: [kotoha-scrapbook-design-system]
usedIn: [Kotoha Fan Site, Hanon Fan Site]
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

How it works, in plain words, with short bullet lists.

## Key code

```js path=public/js/public/countdown.js
// a short excerpt, a few dozen lines at most
```
~~~

- **Front matter:** every Entry model field, plus `projectFile`.
- **Body:** `## Technical details`, then an optional `## Key code` with one fenced block.
- **Images and diagrams:** named relative to the entry's folder.
- **Code location ref:** the commit the project file was read at (for Kotoha and Hanon, the admin-refresh update commit).

### Tags

- **`tags.yml`** holds every list with labels. Layer, Origin, Status, Target and the Playbook's Kind and Status also stay fixed in code; the check fails if the two disagree.
- **Stack and Feature** start from the spec's lists plus the **41 values the five project files propose** (Kotoha 18, Hanon 2, Aqua 15, Himawari 3, portfolio 3), merged in step 1.
- **One spelling per value:** the project files mix `nodejs` and `node-js`; step 1 settles on `node-js` (matching the spec's "Node.js" label pattern) and the apply steps use it.

## Technical choices

| Choice | Decision | Why |
|---|---|---|
| Front matter | The `yaml` package plus a small `---` splitter | Small and strict |
| Content check | `zod` schemas mirroring the Entry and Playbook types | Readable errors; types and check can't drift |
| Check command | `npm run check:content` (with `tsx`), also as `prebuild` | A bad file fails before the build |
| Project-file check | Every `projects/*.md` has the sections of its kind; every entry's `projectFile` exists; every slug a project file proposes exists once applied | Applied entries always trace back |
| Reading files | `data.ts` reads `content/` once per server start, on every request in development | Fast in production, instant while editing |
| Which folder | `TABANE_CONTENT`: `content` by default, `content-samples` for UI testing | Keeps the Researched, Outdated and app layouts testable |
| Images | `/content/<slug>/<file>` route reading from the entry's folder | Images stay out of `public/`, so later login and Shared rules can protect them |
| Deployment | `outputFileTracingIncludes` for `content/` | Phase 4's deploy just works |
| Wireframes | A layout spec per entry (`wireframe.yml`: frame size, boxes with labels, kinds such as text, image, button, chart, list) rendered to SVG by `scripts/wireframes.ts` in the Alice palette and hand-drawn line style; outputs committed | 58 wireframes that match, cheap to change, readable by Claude |
| Screenshots | `scripts/screenshots.ts` with the installed Chrome over the DevTools protocol (Hanon's `cdp.js` approach, no Puppeteer): desktop 1366×768 and phone 390×844, per entry's section or selector, saved as PNG in the entry folder | All five sites refuse framing |
| Capture hygiene | Block each site's analytics (`/api/track`, Aqua's `/s/*`); skip splashes and tours through each site's own storage keys (the portfolio's capture scripts already know them); wait for fonts and images | Clean statistics and stable shots |
| Used in | Lists every project that contains the piece, **including the project it came from** | The project files and the K2/W1 answers already use it this way; see "Choices Kyle may want to change" |

## Steps

Each step ends with a local commit and a `LOG.md` line. Steps 1–9 need nothing from Kyle and run back to back.

| # | Step | Done when |
|---|---|---|
| 1 | **Content format.** `content/`, `tags.yml` (spec lists + the 41 proposed values, one spelling each), entry and playbook templates; the 12 sample entries and 2 sample playbooks as files in `content-samples/` | Every sample exists as a file in the new format |
| 2 | **Loader.** Front matter, body, diagram files, `TABANE_CONTENT`; `data.ts` reads files; `samples.ts` deleted | With `TABANE_CONTENT=content-samples`, every Phase 1 page looks exactly as before |
| 3 | **Content check.** Schemas and cross-checks (tags, related slugs, diagram parents and boxes, playbook links, images exist, status rule), `npm run check:content`, `prebuild` | A deliberately broken sample fails with a clear message; the fixed one passes |
| 4 | **Image route** with an allow-list of image types and no access outside the entry's folder; `outputFileTracingIncludes` | Sample images load through the route; `../` is refused |
| 5 | **Search by word start** | "stats" finds "statistics" |
| 6 | **Project files.** `projects/_template.md` with both kinds; `projectFile` field; the project-file check, run on the five real files | All five files pass; a file missing a section fails |
| 7 | **Wireframe kit.** `wireframe.yml` format, `scripts/wireframes.ts`, `npm run wireframes`; the sample wireframes redrawn with it | Desktop and phone sample wireframes generate and look right on the entry page |
| 8 | **Screenshot capture.** `scripts/screenshots.ts` and `npm run screenshots -- <project>`, with per-site settings (URL, analytics paths to block, storage keys to skip intros, selectors per entry) | One Kotoha entry's desktop and phone shots captured, with no visit counted |
| 9 | **Full CLAUDE.md.** Writing a project file (both kinds), applying it, updating it, wireframes, screenshots, naming, tags, commit and log rules | A new session could apply a project file from CLAUDE.md alone |
| 10 | **Apply Kotoha** (29 entries, its guide). ✋ **Kyle reviews the first project on the site** before the rest, so any format change happens once | Entries pass the check; Kyle approves how they look |
| 11 | **Apply Hanon** (5 entries, the main fan-site guide, Hanon added to Used in on the Kotoha entries with notes) | Check passes |
| 12 | **Apply Aqua Iro Archive** (28 entries, guide) | Check passes |
| 13 | **Apply Himawari website** (18 entries, guide, Himawari added to Used in where it reuses Aqua and Kotoha) | Check passes |
| 14 | **Apply Moeko Works portfolio** (18 entries, guide, lineage links from Himawari) | Check passes; all 34 questions moved to "Answered and applied" |
| 15 | **Switch to real content.** `content/` becomes the default; sample images move out of `public/` | The Library shows only the 98 real entries and every one opens |
| 16 | **Final check.** Content check, typecheck, lint, build; every entry and guide opened at desktop and phone width; search and filters across 98 entries; review with Kyle ✋ | All checks pass and Kyle approves Phase 2 |

Steps 11–14 run back to back after Kyle's OK at step 10. Each applied project gets its own commit.

### How one project is applied (steps 10–14)

1. `git pull` the project; if it changed since the file was read, update the project file first (and its read-at commit).
2. Add any new tag values (already in `tags.yml` from step 1, so normally none).
3. Per proposed entry: folder, `entry.md` (front matter from the file's tables, Technical details from its front-end/back-end sections, Key code from its key-code list), `wireframe.yml` → SVG for UI/UX, Mermaid files for Backend (starting from the file's architecture diagrams, split into levels), screenshots for UI/UX.
4. The replication guide as a Draft playbook.
5. Used in and Related updates on earlier projects' entries.
6. `npm run check:content`, typecheck, lint, build; open a sample of the new entries on the site.
7. Move the project's questions to "Answered and applied" with the date; log; commit.

## Effort and order

- **The size:** 98 entries is about 400 files (entry, wireframe spec and SVGs, screenshots, diagrams). Each project is a long session of its own; Kotoha and Aqua are the biggest.
- **Why Kotoha first:** Hanon builds on it, and it has the most varied pieces, so the format gets tested early.
- **Why one review stop:** reviewing every project would add four waits; reviewing the first one catches format problems before they repeat 98 times.

## Known gaps after Phase 2

- **No link check yet:** `lastChecked` is the capture date until Phase 3.
- **Screenshots are a snapshot:** re-capturing when a site changes is by hand until Phase 3 automates it.
- **Himawari engine and Studio** are not in Tabane (the project file covers the website only).
- **Admin screens:** screenshots cover public pages only; admin panels appear as wireframes (Claude can't sign in to Kyle's admin panels).

## Finished looks like

- **Content system:** `content/`, `tags.yml`, templates, loader, image route, content check, wireframe kit and screenshot capture all work; `npm run check:content` runs before every build.
- **Library:** 98 real entries with wireframes, screenshots, diagrams and code locations, plus 5 Draft replication guides, each tracing back to its project file.
- **Samples:** `TABANE_CONTENT=content-samples` still brings back the Phase 1 samples.
- **CLAUDE.md:** explains writing, applying and updating project files.
- **Commits and checks:** all local and logged; typecheck, lint and build pass.

## Choices Kyle may want to change

- **Used in includes the origin project** (default). The spec's wording says Used in lists projects that *reused* an entry; the alternative is to leave Used in empty for the origin and show the origin only through the live site and project file. The default matches how the project files and the K2/W1 answers already use it.
- **Screenshots in Phase 2** (default) instead of placeholders until Phase 3.
- **One review stop after Kotoha** (default) instead of a review after every project.
- **Generated wireframes** (default) instead of hand-drawn SVGs per entry.
- **Where project files live:** `projects/` in the Tabane repository (default), or outside it.
- **Samples:** kept as test content in `content-samples/` (default), or deleted.
