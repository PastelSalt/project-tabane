# Phase 2 · Content system and project files

2026-10-25 · Plan by Claude for Kyle Q. Zoleta (revised the same day: entries now come from project files)

## Goal

Replace the Phase 1 sample data with real content files, and set up the way real content gets in: **one project file per project or site**.

When Kyle asks, Claude writes a Markdown file holding everything about that project or site. Kyle reviews it, and when Kyle says to apply it, Claude turns it into Tabane entries and a replication guide.

When Phase 2 is done:

- Every entry and playbook is a file in `content/`.
- A check stops any bad file from reaching the site.
- The project-file template and the apply steps are written down.
- `CLAUDE.md` tells any future Claude session exactly how to write a project file, apply it, and add or update entries.
- At least one project file has been written and applied end to end, so the Library shows real entries.

## How content gets in

| Step | Who | What happens |
|---|---|---|
| 1. Ask | Kyle | "Make the project file for Kotoha" (or a site to research) |
| 2. Write | Claude | Pulls and reads the project's repository (or reads the site's pages), then writes `projects/<name>.md` with everything about it, citing where each fact came from |
| 3. Review | Kyle | Reads the file, edits it or asks for changes, and answers its open questions |
| 4. Apply | Claude, when Kyle says | Turns the project file into entries (UI/UX and Backend) and a replication guide, runs the content check, commits, and logs it |
| 5. Update | Claude, when asked | If the project file changes later, applying it again updates the entries to match |

- **The project file is the source of truth.** The entries are made from it, and every entry links back to it.
- **Project files are source notes.** They stay in the repository but are not shown on the site.

## Project file format

`projects/<name>.md`, one per project or site, from `projects/_template.md`:

| Section | Holds |
|---|---|
| Header | Name, kind (own project or researched site), live URL, repository and local folder, the commit (or date) it was read at, Target |
| Overview | What it is and what it is for, in a few lines |
| Stack | Languages, frameworks, libraries, hosting and data, using `tags.yml` names where they exist; new values marked as proposed |
| Structure | The folder layout and the main files, with what each does |
| UI/UX pieces | Every interface piece worth reusing: what it does, where its code lives, how it works, what it looks like (enough to draw a wireframe), and whether it is reusable on its own |
| Backend pieces | Every backend piece: what it does, where its code lives, how data flows (enough to draw diagrams in levels) |
| How it was built | The order it was built in, setup steps, deploy steps (the base for the replication guide) |
| Gotchas and quirks | Things that went wrong, workarounds, my own habits seen in the code |
| Proposed entries | The entries Claude plans to create from this file: slug, layer, one-line summary, related entries |
| Open questions | Anything Claude could not tell from the code or site, for Kyle to answer before applying |
| Sources | The files and pages each fact came from |

**Researched sites** use the same format, written from the site's own pages:

- They hold only notes and links, never copied code, images or text.
- Their entries get Origin "Researched" and a Source and license note.

## Starting point

- **The working UI from Phase 1:** every page reads data through `src/lib/data.ts`, so only that file's insides change.
- **The spec:** `Project-Tabane-v2.md`, especially Entry model, Data and storage, How Claude works on Tabane and Playbook fields.
- **Your repositories:** all five, cloned under `C:\Users\Myaako\Documents\MoekoWorks\`.

## In scope

- **Content folder:** `content/`, `tags.yml`, and the entry and playbook templates.
- **Loader:** reads entry and playbook files (front matter, Markdown body, Mermaid diagram files) in place of `samples.ts`.
- **Content check:** validates every file against the Entry model, the Playbook fields and `tags.yml`, and runs before every build.
- **Image route:** serves entry images through the site rather than the public folder.
- **Sample data:** the Phase 1 samples become files in `content-samples/`, used only for UI testing.
- **Search improvement:** search matches the beginnings of words, so "stats" finds "statistics".
- **Project files:** the `projects/` folder, its template, and the write and apply steps in `CLAUDE.md`.
- **One project end to end:** the first project file (the one you ask for first) written, reviewed and applied.

## Out of scope

| Not in Phase 2 | When |
|---|---|
| The other project files | Whenever you ask, one at a time, during or after Phase 2 |
| Saving screenshots of live sites (the screenshot script) and the link-check script | Phase 3 |
| Deploying to Vercel and the password gate | Phase 4 |
| GitHub sign-in, working access codes, Neon | Phase 5 |

## Rules for this phase

- Commits stay local. Claude does not push and does not ask to push.
- Every step, and every project file written or applied, gets a line in `LOG.md` and one local commit.
- Claude only reads your project repositories. It runs `git pull` before reading and never commits to them.
- **Nothing is invented.** Every fact in a project file comes from the code or the site, with its source listed. Anything unclear goes under Open questions instead of being guessed.
- **Nothing is applied without your say-so.** A project file becomes entries only when you say to apply it.
- All entries start with **Shared off**.
- Replication guides start as **Draft**, and become Verified only after you've actually followed one.

## Content format

### Folder layout

```text
projects/                                 project files: source notes, not shown on the site
  _template.md
  kotoha-fansite.md
content/
  tags.yml                                every tag's fixed list, with labels
  templates/
    entry.md
    playbook.md
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
projectFile: kotoha-fansite
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

- **Front matter:** every field from the Entry model, plus `projectFile`, which names the project file the entry came from.
- **Body:** a `## Technical details` section, then an optional `## Key code` section with one fenced code block.
- **Images and diagrams:** named relative to the entry's folder.

### Tags

- **Where the values live:** `tags.yml` holds every list, each value with its label.
- **Fixed lists:** Layer, Origin, Status, Target, and the Playbook's Kind and Status also stay fixed in the code, because pages behave differently for them. The check fails if the two ever disagree.
- **Growing lists:** Stack and Feature grow by editing `tags.yml`. A project file can propose new values, which are added when it is applied.

## Technical choices

| Choice | Decision | Why |
|---|---|---|
| Front matter | The `yaml` package, plus a small splitter for the `---` block | Small, maintained and strict about YAML |
| Content check | `zod` schemas that mirror the Entry and Playbook types | Readable errors; the types and the check can't drift apart |
| Check command | `npm run check:content` (run with `tsx`), and also as `prebuild` | A bad file fails before the site builds |
| Project-file check | The same command also checks each `projects/*.md` has every section, and that every entry's `projectFile` exists | Applied entries always trace back to a project file |
| Reading files | `data.ts` reads `content/` once per server start, and again on every request in development | Edits show up instantly while working; production stays fast |
| Which folder | `TABANE_CONTENT` setting: `content` by default, `content-samples` for UI testing | Keeps the Researched, Outdated and mobile-app layouts testable |
| Images | A route at `/content/<slug>/<file>` that reads from the entry's folder | Images stay out of the public folder, so later login and Shared rules can protect them |
| Deployment | Tell Next.js to include `content/` with the server code (`outputFileTracingIncludes`) | Set now so Phase 4's deploy just works |
| Live site framing | Claude checks each live site's headers (`X-Frame-Options`, `Content-Security-Policy`) while writing the project file | Recorded once, as the spec says |

## Steps

Each step ends with a local commit and a `LOG.md` line.

| # | Step | Done when |
|---|---|---|
| 1 | **Content format.** Create `content/`, `tags.yml`, the entry and playbook templates; convert the 12 sample entries and 2 sample playbooks into files in `content-samples/` | Every sample exists as a file in the new format |
| 2 | **Loader.** Front matter and body parsing, diagram files, the `TABANE_CONTENT` folder switch; `data.ts` reads files instead of `samples.ts`, which is deleted | With `TABANE_CONTENT=content-samples`, every Phase 1 page looks exactly as before |
| 3 | **Content check.** `zod` schemas and cross-checks (tags, related entries, diagram parents and boxes, playbook links, image files exist), `npm run check:content`, `prebuild` | A deliberately broken sample fails with a clear message, and the fixed one passes |
| 4 | **Images route.** `/content/<slug>/<file>` serves entry images, with an allow-list of image types and no access outside the entry's folder; `outputFileTracingIncludes` set | Sample images load through the route; a path like `../` is refused |
| 5 | **Search by word start** | "stats" finds "statistics" |
| 6 | **Project files.** `projects/_template.md` with every section; `projectFile` field on entries; the project-file check | A template-shaped file passes the check, and one missing a section fails |
| 7 | **Full CLAUDE.md.** Step by step: writing a project file, applying it, updating entries when it changes, adding and updating entries and playbooks by hand, naming, image, tag and commit/log rules | A new Claude session could write and apply a project file from CLAUDE.md alone |
| 8 | **First project file.** When Kyle asks for one, Claude writes it | **Kyle reviews it and answers its open questions** |
| 9 | **Apply the first project file.** When Kyle says, Claude creates its entries (wireframes, diagrams, details, key code, code locations) and its Draft replication guide | Entries pass the check and look right on the site |
| 10 | **Switch to real content.** `content/` becomes the default; the samples stay only for UI testing; sample images move out of `public/` | The Library shows only real entries, and every one opens correctly |
| 11 | **Final check.** Content check, typecheck, lint, build; every real entry and guide opened at desktop and phone width; review with Kyle | All checks pass and Kyle approves Phase 2 |

Steps 1 to 7 need nothing from you and can run back to back. Step 8 waits for you to name the first project.

## Known gaps after Phase 2

- **Other projects:** only the first project is in Tabane. The rest arrive one project file at a time, whenever you ask.
- **No screenshots yet:** live sites that can't be framed show "No screenshot saved yet" until Phase 3's screenshot script runs.
- **Last checked:** it holds the date the site's headers were checked while writing the project file, until Phase 3's link check takes over.

## Finished looks like

- **Content system:** `content/`, `tags.yml`, the templates, the loader, the image route and the content check all work, and `npm run check:content` runs before every build.
- **Project files:** `projects/_template.md` exists, and the first project file is written, reviewed and applied.
- **Library:** shows that project's real entries, with wireframes, diagrams and code locations, plus its Draft replication guide.
- **Samples:** `TABANE_CONTENT=content-samples` still brings back the Phase 1 samples for UI testing.
- **CLAUDE.md:** explains how to write and apply a project file, and how to add and update everything.
- **Commits and checks:** all commits are local and logged, and typecheck, lint and build pass.

## Choices Kyle may want to change

- **Where project files live:** `projects/` in the Tabane repository. Keeping them outside Tabane is the alternative.
- **Showing project files:** they are not shown on the site. A read-only page for each one, owner only, is the alternative.
- **Shared:** every entry starts with Shared off. Setting Shared inside the project file is the alternative.
- **Samples:** they stay as test content in `content-samples/`. Deleting them entirely is the alternative.
