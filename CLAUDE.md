@AGENTS.md

# Project Tabane

Kyle's (Moeko Works) private library of reusable UI/UX and backend concepts. Claude is the only one who writes to it. Kyle reads it and plans new projects with Claude using its entries.

## Read first

- `Project-Tabane-v2.md`: the full spec. It wins over anything else.
- `PHASE-2.md`: the current phase and its steps. Work one step at a time, in order.
- `LOG.md`: what has happened so far, newest first.
- `projects/OPEN-QUESTIONS.md`: every project file's questions and Kyle's answers. Follow the answers.
- `.drafts/mockup.html`: the approved design. Hidden and git-ignored; never delete it, never commit it.

## Rules

- **Never push** to GitHub and never ask to push. Commit locally; Kyle says when to push.
- **Log everything:** after each change, add one line to the top of the `LOG.md` table (date, who, what). Also log Kyle's decisions and requests.
- **Nothing is invented.** Every entry comes from a project file; every project file fact comes from the code, the live site or the project's own docs. Anything unclear becomes an open question, never a guess.
- **Other repositories are read-only** (`C:\Users\Myaako\Documents\MoekoWorks\…`): `git pull` before reading, never commit to them, unless Kyle asks for a change there as its own task.
- **Data access goes through `src/lib/data.ts`**, which reads files through `src/lib/content.ts`. Pages never read files themselves.
- **Design tokens only:** colors, radius, shadows and spacing come from the CSS variables in `src/app/globals.css`. Blue (#7D98EC) is never used for text.
- **Motion:** only the card lift on hover and the ticking pocket watch move on the site itself, and both stop under `prefers-reduced-motion`.
- **No popups or modals:** everything is its own page; confirmations happen inline.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local site at http://localhost:3000 |
| `npm run check:content` | The content check: tags, every entry and playbook, project files (also runs before `build`) |
| `npm run wireframes [-- <slug>]` | Draws `wireframe.svg` / `wireframe-phone.svg` from each `wireframe.yml` |
| `npm run screenshots -- <slug or site>` | Captures the shots listed in each `capture.yml` from the live site |
| `npm run typecheck` | Generates route types, then checks TypeScript |
| `npm run lint` | ESLint |
| `npm run build` | Content check, then the production build |

Run the content check, typecheck, lint and build before marking a step done.

## Where things live

```text
projects/<name>.md            project files: source notes, not shown on the site (_template.md, _template-derived.md)
projects/OPEN-QUESTIONS.md    every project file's questions, answers, and "Answered and applied"
content/tags.yml              every tag list with labels; Stack and Feature grow here
content/entries/<slug>/       entry.md + wireframe.yml/.svg + capture.yml + screenshot-*.webp + level-N-*.mmd
content/playbooks/<slug>.md   playbooks (replication guides first)
content/templates/            entry.md and playbook.md to copy
content-samples/              the Phase 1 samples, for UI testing only (TABANE_CONTENT=content-samples)
scripts/                      check-content, wireframe-kit + wireframes, cdp + screenshots + screenshot-sites.yml
```

`TABANE_CONTENT` picks the folder the site reads: `content-samples` until Phase 2 step 15, then `content`.

## Writing a project file (when Kyle names a project or site)

1. `git pull` the project (or read the live site for a researched one). Note the commit and date.
2. Copy `projects/_template.md` to `projects/<name>.md` (`<name>` = the repository or site name as a slug). A project built by copying another gets `_template-derived.md` instead: only what differs, with a "Derived from" row and a section map back to the base file.
3. Read everything: docs, config, every page and component, styles, scripts, server code, migrations, tests, the git history. Check the live site's headers for **Embeddable** (`X-Frame-Options`, `frame-ancestors`) and its public endpoints. Never read secrets (`.env.local`).
4. Fill every section. Cite every source in the last section. Propose entries (slug, title, pieces, stack, feature, related), a replication guide and any new tag values.
5. Add the file's open questions to `projects/OPEN-QUESTIONS.md` under a new heading (newest last), each with a recommendation and an empty `_Answer:_`.
6. `npm run check:content` (it checks the file's header and sections), log, commit.

When the project changes later (as Kotoha's and Hanon's admin refresh did), update the file first: new "Read at" commit, the changed sections, new pieces and gotchas, and rewrite any open question that no longer applies.

## Applying a project file (only when Kyle says "apply")

All of its questions in `OPEN-QUESTIONS.md` must be answered first; follow the answers.

1. `git pull` the project; if it changed since the file's "Read at" commit, update the file first.
2. Add any new tag values to `content/tags.yml` (one spelling: lowercase words joined by hyphens, such as `node-js`).
3. For each proposed entry, make `content/entries/<slug>/` from `content/templates/entry.md`:
   - **Front matter:** every field. `origin: own-project`, `status: proven` for a live own project, `shared: false`, `projectFile: <name>`, `codeLocation.ref` = the file's "Read at" commit, `usedIn` = every project that contains the piece, the origin first. `lastChecked` = the capture date. Dates as `YYYY-MM-DD`.
   - **Technical details:** how it works, from the file's front-end or back-end sections, in plain words with short lists. No invented behaviour.
   - **Key code** (own projects, optional): one excerpt of a few dozen lines from the file's key-code list, with its path, copied from the repository at the ref.
   - **UI/UX:** a `wireframe.yml` (see below) → `npm run wireframes -- <slug>`, a `capture.yml` → `npm run screenshots -- <slug>`, then both listed in the front matter with alt text that says what each shows.
   - **Backend:** Mermaid diagrams in levels, one `level-N-<id>.mmd` per diagram: exactly one level 1 (the whole system), each deeper one with a `parent` and the box it opens (`expands`, when the box name differs from its id). Start from the file's architecture diagrams.
   - **Related:** the slugs the file lists; pair every UI/UX entry with the Backend entry behind it.
4. The replication guide as `content/playbooks/replicate-<name>.md` from the playbook template: `status: draft`, `projectFile: <name>`, steps that point to entries by slug, gotchas, finished looks like.
5. Update earlier entries the file names (Used in, notes, Related).
6. `npm run check:content` (once the file is listed as applied, the check requires every slug it proposes), typecheck, lint, build; open several new entries on the site at desktop and phone width.
7. Move the project's section in `OPEN-QUESTIONS.md` under "Answered and applied" with the date. Log. One commit per project.

## Entries by hand (no project file)

Only for Researched or Created-for-Tabane entries Kyle asks for. Same folder and fields; `origin: researched` needs `sourceAndLicense` and never copies code, images or text, only Claude's own notes, wireframes and links. A researched or created entry is `candidate` until a project uses it.

## Naming

- **Entry slugs:** `<project prefix>-<piece>`, lowercase words joined by hyphens: `kotoha-`, `hanon-`, `aqua-`, `himawari-`, `moekoworks-`. The folder name is the slug.
- **Titles:** `Project · Piece` (for example `Kotoha · Stream ticket and week strip`).
- **Files in an entry folder:** `entry.md`, `wireframe.yml`, `wireframe.svg`, `wireframe-phone.svg`, `capture.yml`, `screenshot-desktop.webp`, `screenshot-phone.webp` (more as `screenshot-<what>.webp`), `level-1-system.mmd`, `level-2-<id>.mmd`.
- **Playbooks:** `replicate-<project>` for replication guides.

## Wireframes (`scripts/wireframe-kit.ts`)

`wireframe.yml` has a `desktop:` and/or `phone:` frame, in units of 10 px (desktop 144×90, phone 39×84 by default). Each box is `[kind, x, y, w, h, label]` or `{ kind, x, y, w, h, label, r }` (`r` = tilt in degrees). Kinds: `bar`, `panel`, `box`, `dashed`, `image`, `heading`, `text`, `button`, `pill`, `input`, `circle`, `dot`, `line`, `chart`, `label`, `note`. Use `note` (violet, dashed) for behaviour a still can't show, such as "hover: video plays". Draw the layout from the project file's visual-design section and the screenshots, not from memory. Never edit the SVGs by hand: the check fails when they don't match the YAML.

## Screenshots (`scripts/screenshots.ts`)

- Site settings in `scripts/screenshot-sites.yml`: the URL, the site's **analytics paths to block** (a capture must never count as a visit), storage keys that skip splashes and tours, a ready expression, reduced motion. Take the keys from the project file.
- Each entry's `capture.yml` lists its shots: `file`, `device` (desktop 1366×768, phone 390×844 at 2×), and `scrollTo`, `element`, `before`, `wait` as needed. Check every capture by looking at it, and that it reports blocked analytics requests.
- Screenshots show public pages only. Admin panels are wireframes: Claude never signs in to Kyle's admin panels.

## Commits and log

- One commit per step, per project file written, and per project applied. Message: what changed, then the trailer the session's instructions give.
- `LOG.md`: one line per action at the top of the table, Claude's and Kyle's.
