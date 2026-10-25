# Phase 2 · Content system and first entries

2026-10-25 · Plan by Claude for Kyle Q. Zoleta

## Goal

Replace the Phase 1 sample data with real content files, then fill Tabane with the first real entries from the five Moeko Works projects. Each project is split into UI/UX entries, Backend entries and a replication guide.

When Phase 2 is done:

- Every entry and playbook is a file in `content/`.
- A check stops any bad file from reaching the site.
- `CLAUDE.md` tells any future Claude session exactly how to add or update an entry.
- The Library shows real entries from your projects.

## Starting point

- **The working UI from Phase 1:** every page reads its data through `src/lib/data.ts`, so only that file's insides change.
- **The spec:** `Project-Tabane-v2.md`, especially Entry model, Data and storage, How Claude works on Tabane, First entries and Playbook fields.
- **Your project repositories:** all five, cloned under `C:\Users\Myaako\Documents\MoekoWorks\`.

## In scope

- **Content folder:** the `content/` folder, `tags.yml`, and templates for an entry and a playbook.
- **Loader:** reads entry and playbook files (front matter, Markdown body, Mermaid diagram files) in place of `samples.ts`.
- **Content check:** validates every file against the Entry model, the Playbook fields and `tags.yml`, and runs before every build.
- **Image route:** serves entry images through the site rather than from the public folder, so later login and Shared rules protect them too.
- **Full CLAUDE.md:** the exact steps for adding and updating entries and playbooks.
- **Sample data:** the Phase 1 samples become content files in their own folder, used only for testing the UI.
- **Inventory:** each of the five projects is read and a list of proposed entries is made, which Kyle approves before any are written.
- **The first entries:** wireframes, diagrams, technical details, key code and code locations, plus a replication guide per project.
- **Search improvement:** search matches the beginnings of words, so "stats" finds "statistics".

## Out of scope (later phases)

| Not in Phase 2 | Comes in |
|---|---|
| Saving screenshots of live sites (the screenshot script) and the link-check script | Phase 3 |
| Deploying to Vercel and the password gate | Phase 4 |
| GitHub sign-in, working access codes, Neon | Phase 5 |
| Researched entries from other people's sites | When Kyle asks, after Phase 2 |

## Rules for this phase

- Commits stay local. Claude does not push and does not ask to push.
- Every step gets a line in `LOG.md` and one local commit.
- Claude only reads your project repositories. It runs `git pull` before reading and never commits to them.
- All first entries start with **Shared off**. You choose later which ones visitors may see.
- No entry text is invented. Everything in an entry comes from reading the project's code or its live site. Anything unclear is listed for you instead of guessed.

## Content format

### Folder layout

```text
content/
  tags.yml                                every tag's fixed list, with labels
  templates/
    entry.md                              starting point for a new entry
    playbook.md                           starting point for a new playbook
  entries/
    kotoha-stream-countdown/
      entry.md                            front matter + Technical details + Key code
      wireframe.svg                       UI/UX: desktop wireframe
      wireframe-phone.svg                 UI/UX, optional: phone wireframe
      screenshot.png                      added in Phase 3
    portfolio-cookieless-stats/
      entry.md
      level-1-system.mmd                  one Mermaid file per diagram
      level-2-collector.mmd
  playbooks/
    replicate-kotoha-fan-site.md
content-samples/                          the Phase 1 samples, as files, for UI testing only
```

### An entry file

~~~markdown
---
title: Kotoha · Stream countdown
layer: ui-ux
origin: own-project
stack: [javascript, gsap]
feature: [countdown]
status: proven
target: website
reuseNote: A page counts down to a scheduled event, such as a launch or a stream.
liveSite: { url: https://…, embeddable: true }
repository: { name: PastelSalt/kotoha-fansite, url: https://github.com/PastelSalt/kotoha-fansite }
codeLocation: { path: js/countdown.js, ref: <commit> }
wireframe: { desktop: wireframe.svg }
diagrams: []
related: [kotoha-admin-panel]
usedIn: [Kotoha Fan Site]
shared: false
lastChecked: 2026-10-26
created: 2026-10-26
updated: 2026-10-26
---

## Technical details

How it works, in plain words, with short bullet lists.

## Key code

```js path=js/countdown.js
// a short excerpt, a few dozen lines at most
```
~~~

- **Front matter:** every field from the Entry model, with the same names the code already uses.
- **Body:** a `## Technical details` section, then an optional `## Key code` section holding one fenced code block. The block's language and `path=` give the Key code's language and file.
- **Images and diagrams:** named relative to the entry's folder.

### Tags

- **Where the values live:** `tags.yml` holds every list, each value with its label.
- **Fixed lists:** Layer, Origin, Status, Target, and the Playbook's Kind and Status also stay fixed in the code, because pages behave differently for them. The check fails if `tags.yml` and the code ever disagree.
- **Growing lists:** Stack and Feature grow only by editing `tags.yml`.

## Technical choices

| Choice | Decision | Why |
|---|---|---|
| Front matter | The `yaml` package, plus a small splitter for the `---` block | Small, maintained and strict about YAML |
| Content check | `zod` schemas that mirror the Entry and Playbook types | Readable error messages; the types and the check can't drift apart |
| Check command | `npm run check:content` (run with `tsx`), and also as `prebuild` | A bad file fails before the site builds, as the spec requires |
| Reading files | `data.ts` reads `content/` once per server start, and again on every request in development | Edits show up instantly while working; production stays fast |
| Which folder | `TABANE_CONTENT` setting: `content` by default, `content-samples` for UI testing | The samples stay useful for testing the variants the first real entries don't cover (Researched, Outdated, mobile app) |
| Images | A route at `/content/<slug>/<file>` that reads from the entry's folder | Images stay out of the public folder, so later login and Shared rules can protect them |
| Deployment | Tell Next.js to include `content/` with the server code (`outputFileTracingIncludes`) | Set now so Phase 4's deploy just works |
| Live site framing | Claude checks each live site's headers (`X-Frame-Options`, `Content-Security-Policy`) to set Embeddable | Recorded once per entry, as the spec says |

## First entries

The **inventory** step reads each project and proposes the final list. You approve it before any entries are written. The starting point, from the spec:

| Project | UI/UX entries | Backend entries | Replication guide |
|---|---|---|---|
| Kotoha Fan Site | Clover-scrapbook layout, stream countdown, discography, fan-art gallery | Admin panel and how the site's content is managed | Replicate the Kotoha fan site (written first) |
| Hanon Fan Site | Ripple-scrapbook layout | Links to the Kotoha backend entries it shares | Replicate the Hanon fan site, building on the Kotoha guide |
| Moeko Works Portfolio | Project cards, story-style project pages | Cookieless statistics | Replicate the portfolio |
| Aqua Iro Archive | Timeline travel, search, note-leaving, visual-novel structure | How notes are stored, how search works | Replicate the archive |
| Himawari Studio and Engine | Live-preview editor | Engine (C, SDL 3, FreeType), export pipeline | Replicate the studio and engine |

Each entry gets:

- **Every field** in the Entry model.
- **A hand-written grey wireframe** (UI/UX entries).
- **Mermaid diagrams in levels** (Backend entries).
- **Technical details** written from the code.
- **A Key code excerpt** where one helps.
- **Code location:** the file path and the commit it was read at.
- **Embeddable**, from the live site's headers.

Each replication guide starts as **Draft**. It becomes Verified only after you have actually followed it.

## Steps

Each step ends with a local commit and a `LOG.md` line.

| # | Step | Done when |
|---|---|---|
| 1 | **Content format.** Create `content/`, `tags.yml` (the current lists), the entry and playbook templates, and convert the 12 sample entries and 2 sample playbooks into files in `content-samples/` | Every sample exists as a file in the new format |
| 2 | **Loader.** Front matter and body parsing, diagram files, `TABANE_CONTENT` folder switch; `data.ts` reads files instead of `samples.ts`, which is deleted | With `TABANE_CONTENT=content-samples`, every Phase 1 page looks exactly as before |
| 3 | **Content check.** `zod` schemas, cross-checks (tags, related entries, diagram parents and boxes, playbook links, image files exist), `npm run check:content`, `prebuild` | A deliberately broken sample fails the check with a clear message, and the fixed one passes |
| 4 | **Images route.** `/content/<slug>/<file>` serves entry images, with an allow-list of image types and no access outside the entry's folder; `outputFileTracingIncludes` set | Sample wireframes and screenshots load through the route; a path like `../` is refused |
| 5 | **Search by word start, and full CLAUDE.md.** Search matches the beginnings of words; CLAUDE.md gets the step-by-step for adding and updating entries and playbooks, naming rules, image rules, tag rules and commit/log rules | "stats" finds "statistics"; a new Claude session could add an entry from CLAUDE.md alone |
| 6 | **Inventory.** Pull and read the five repositories; list the proposed entries per project with a one-line summary each, plus anything unclear | **Kyle approves the list** (the one stop in this phase) |
| 7 | **Kotoha entries and guide.** Write the approved Kotoha entries and the Kotoha replication guide | Entries pass the check and look right on the site |
| 8 | **Hanon entries and guide.** Including links to the shared Kotoha backend entries | Same |
| 9 | **Portfolio entries and guide** | Same |
| 10 | **Aqua Iro entries and guide** | Same |
| 11 | **Himawari entries and guide.** Code locations note which of the two repositories each entry comes from | Same |
| 12 | **Switch to real content.** `content/` becomes the default; the samples stay only for UI testing; sample images move out of `public/` | The Library shows only real entries, and every one opens correctly |
| 13 | **Final check.** Content check, typecheck, lint, build; every real entry and guide opened at desktop and phone width; review with Kyle | All checks pass and Kyle approves Phase 2 |

## Known gaps after Phase 2

- **No screenshots yet:** live sites that can't be framed show "No screenshot saved yet" until Phase 3's screenshot script runs.
- **Last checked:** it holds the date Claude checked the site's headers in Phase 2, until Phase 3's link check takes over.
- **Researched entries:** none yet. The samples keep that layout testable.

## Finished looks like

- **Content:** `content/` holds the approved first entries and five Draft replication guides, all passing `npm run check:content`.
- **Library:** shows only real entries, with real wireframes, diagrams and code locations.
- **Samples:** `TABANE_CONTENT=content-samples` still brings back the Phase 1 samples for UI testing.
- **CLAUDE.md:** explains how to add and update everything.
- **Commits and checks:** all commits are local and logged, and typecheck, lint and build pass.

## Choices Kyle may want to change

- **Shared:** every first entry starts with Shared off. Turning some on now is the alternative.
- **Samples:** they stay as test content in `content-samples/`. Deleting them entirely is the alternative.
- **Screenshots:** they wait for Phase 3's script. Taking them by hand in Phase 2 is the alternative, but they would have to be redone by the script anyway.
