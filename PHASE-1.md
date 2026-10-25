# Phase 1 · Working UI

2026-10-25 · Plan by Claude for Kyle Q. Zoleta

## Goal

Turn the approved mock-up into a real, working Tabane site that runs on this machine. Every page, layout, motif and interaction works, filled with **sample entries only**. No real project content goes in during this phase.

When Phase 1 is done, Tabane looks and behaves like the finished site. Phase 2 then only has to swap the sample data for real content files.

## Starting point

- **Design reference:** `.drafts/mockup.html`. It is hidden: the folder has the Windows hidden attribute and is listed in `.gitignore`, so it never reaches GitHub. It is kept until the design is settled.
- **Spec:** `Project-Tabane-v2.md`, especially Site design, Entry model, Site map and Playbook.
- **Repository:** [PastelSalt/project-tabane](https://github.com/PastelSalt/project-tabane), not yet set up locally.

## In scope

- The Next.js app, set up in this folder.
- The design system: colors, tints, rounded shapes, sticker shadows, graph-paper background, font.
- Every motif as a reusable component.
- The app shell: header, chessboard strip, reusable left sidebar, main area.
- Every page in the Site map, built against sample data:
  - Library
  - UI/UX entry, Backend entry and app entry
  - Playbook list and playbook page
  - Access codes (look only)
  - Not found
- Working search and tag filters over the sample data.
- Clickable diagram levels drawn from Mermaid text.
- Light motion (card lift, ticking watch), reduced-motion support.
- Phone layout and accessibility.
- A starter `CLAUDE.md` for working on the code.

## Out of scope (later phases)

| Not in Phase 1 | Comes in |
|---|---|
| Real entries from my projects, `content/` files, the Markdown loader, `tags.yml`, the schema check, entry templates | Phase 2 |
| Screenshot script, link-check script | Phase 3 |
| Deploying to Vercel, the password gate | Phase 4 |
| GitHub sign-in, access codes that work, Neon | Phase 5 |
| Dark mode | After Phase 5 |

## Rules for this phase

- Commits stay local. Claude does not push and does not ask to push; Kyle says when.
- Every change gets a line in `LOG.md`.
- Sample entries are clearly fake (titled "Sample · …") so they can never be mistaken for real content.

## Technical choices

| Choice | Decision | Why |
|---|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript | Same versions as the Moeko Works Portfolio |
| Package manager | npm | Same as the Portfolio |
| Styling | Global CSS for design tokens, CSS Modules per component | The mock-up's CSS carries over almost as is; no extra library |
| Font | Nunito, loaded with `next/font` | Rounded letters that suit the rounded UI |
| Diagrams | Mermaid, rendered in the browser with a Tabane theme | The spec stores diagrams as Mermaid text |
| Code blocks | Shiki, highlighted at build time with Tabane colors | Pretty code with no extra code sent to the browser |
| Search and filters | Held in the URL (for example `?layer=ui-ux&status=proven&q=countdown`), filtered on the server | Links can be shared and bookmarked, and the spec says search runs on the server |
| Checks | `npm run typecheck`, `npm run lint`, `npm run build`, then a visual check in the browser pane | Same scripts as the Portfolio |

## Pages

| Route | Page | Sidebar shows | Main area |
|---|---|---|---|
| `/` | Goes to `/library` | | |
| `/library` | 01 Library | Tag filters: Layer, Origin, Status, Target, Stack, Feature | "01" badge, title, entry count, search bar, active filter chips, card grid, Show more |
| `/library/[slug]` | Entry page, in three variants (below) | The entry's fields, reuse sticky note, links, related entries, playbooks | Depends on the variant |
| `/playbook` | 02 Playbook | Filters: Kind, Status, Target | Playbook cards, grouped by Kind |
| `/playbook/[slug]` | A playbook | Kind, Goal, Status, Target, Last verified, Based on (entry links) | Before you start, numbered steps, gotchas, finished looks like |
| `/access-codes` | 03 Access codes | What codes do and how long they last | Generate button and code list with revoke and inline confirmation. Look only: nothing is saved until Phase 5 |
| any other | Not found | Library filters | Carrot-pod empty state with a way back |

### Entry page variants

| Variant | When | Main area |
|---|---|---|
| UI/UX | Layer is UI/UX and Target is Website | Wireframe with Desktop/Phone toggle, live site in a browser frame (embedded, or the screenshot when it cannot be), technical details, key code |
| Backend | Layer is Backend | Diagram with level tabs, breadcrumb and clickable boxes, Mermaid source below it, technical details, key code |
| App | Target is Mobile or Desktop Application | Wireframe, screenshot gallery, optional clip, technical details, key code |

## Components

| Group | Components |
|---|---|
| Motifs | `RabbitEars` (logo), `Flower`, `PocketWatch` (ticking), `Teacup`, `CarrotPod`, `SuitBadge`, `WashiTape`, `Stamp`, `ChessStrip`, `MoekoWorksLogo` (copied from the Portfolio repository into `public/brand/`) |
| Shell | `Header`, `NavPills`, `OwnerBadge`, `AppLayout` (sidebar + main), `Sidebar`, `SectionHeading` (number badge + title) |
| Library | `SearchBar`, `FilterGroup`, `ActiveFilters`, `EntryCard`, `CardPreview` (wireframe or diagram thumbnail), `EmptyState` |
| Entry | `EntryHeader`, `FieldList`, `ReuseNote`, `LinkList`, `Panel`, `WireframeView`, `LiveSiteFrame`, `ScreenshotGallery`, `DiagramLevels`, `MermaidSource`, `TechnicalDetails`, `KeyCode` |
| Small parts | `Pill`, `Chip`, `Tag`, `Button`, `StatusPill` |

## Sample data

- One module, `src/lib/data.ts`, gives every page its data through `getEntries(filters)`, `getEntry(slug)`, `getPlaybooks(filters)` and `getPlaybook(slug)`. In Phase 2 only this module changes, to read the real content files.
- The TypeScript types follow the Entry model and Playbook fields in the spec exactly, so Phase 2 content fits without changes.
- Around 12 sample entries, chosen to cover every case the UI must handle:
  - every Layer, Origin, Status and Target
  - Shared on and off
  - with and without a live site
  - an embeddable and a non-embeddable site
  - an Outdated entry
  - a Backend entry with three diagram levels
  - a desktop app with screenshots and a clip
  - related entries in both directions
  - a long title
- Two sample playbooks: a Replication guide and a Personal workflow.
- Sample tag lists, so the filters are populated.

## Design system

| Token | Value |
|---|---|
| Colors | Blue #7D98EC, Yellow #FFD45C, White #FFFFFF, Black #0B0B0B, Violet #9F5CA6 |
| Tints (surfaces only) | Blue #E4EAFB, Yellow #FFF4CC, Violet #F1E6F3 |
| Radius | 20 px for cards and panels, 14 px for inner parts, pills fully round |
| Outlines | 2.5 px black on cards, panels, buttons |
| Shadows | Solid offset (6 px), in blue, yellow or violet; black on buttons |
| Background | White with a blue 28 px grid and a yellow line every fourth square |
| Text | Black only; blue is never used for text |
| Focus | A thick yellow ring with a black edge on every link, button and input, so keyboard use is always visible |

Motion follows the spec: cards lift on hover, the pocket watch ticks, nothing else moves on the site itself, and everything stops for reduced motion. Concepts inside entry pages may move.

## Steps

Each step ends with a local commit and a `LOG.md` line.

| # | Step | Done when |
|---|---|---|
| 1 | **Repository setup.** `git init`, set `origin` to PastelSalt/project-tabane, create the Next.js 16 app with TypeScript and ESLint, keep `.drafts/` ignored, add a starter `CLAUDE.md` | `npm run dev` shows the starter page; first local commit made |
| 2 | **Design tokens and global styles.** Colors, tints, radius, shadows, grid background, Nunito, focus ring, reduced-motion rule | A test page shows every token correctly |
| 3 | **Motifs.** All motif components, including the ticking watch and the Moeko Works logo | Each motif renders at several sizes and matches the mock-up |
| 4 | **App shell.** Header with nav pills and the current page highlighted, chessboard strip, sidebar and main layout, phone layout | Moving between the three pages keeps the shell; at phone width the sidebar sits above the content |
| 5 | **Types and sample data.** Entry and Playbook types from the spec, the samples, `data.ts` | Every page can load its data; typecheck passes |
| 6 | **Library.** Search, filters in the URL, active filter chips, card grid with previews, suit badges and tape, Show more, empty state | Filtering and searching change the cards and the URL; clearing returns all cards |
| 7 | **UI/UX entry page.** Fields sidebar, reuse sticky note, wireframe toggle, live-site frame with screenshot fallback, technical details, key code | The sample with a live site embeds it; the non-embeddable sample shows its screenshot |
| 8 | **Backend entry page.** Mermaid diagrams in the Tabane theme, level tabs, breadcrumb, clickable boxes, Mermaid source | Clicking a box opens the next level, and the breadcrumb leads back up |
| 9 | **App entry page.** Screenshot gallery and optional clip | The desktop sample shows its screenshots and clip |
| 10 | **Playbook.** List page with filters, playbook page with numbered steps and linked entries | Both sample playbooks open and link to their entries |
| 11 | **Access codes (look only).** Generate button, code list, revoke with inline confirmation, a note that codes arrive in Phase 5 | The page looks finished, and nothing pretends to save |
| 12 | **Not found and loading states.** Carrot-pod empty state, simple loading placeholders | An unknown address shows the not-found page |
| 13 | **Motion and polish.** Card lift, ticking watch, washi tape, stamp, stickers placed so they never cover controls | Matches the mock-up; reduced motion makes the site still |
| 14 | **Phone and accessibility pass.** 390 px layout, keyboard use, focus ring, contrast rules, alt text, labels | Every page works at 390 px and by keyboard alone |
| 15 | **Final check.** Typecheck, lint, build, visual check of every page at 1366 px and 390 px, review with Kyle | All checks pass and Kyle approves Phase 1 |

## Finished looks like

- `npm run dev` runs Tabane locally, and every page in the Pages table works with sample data.
- It matches the approved mock-up, now as a real site with working search, filters and diagram levels.
- Typecheck, lint and build all pass.
- All commits are local and logged; nothing is pushed until Kyle says.
- `.drafts/mockup.html` is still there, hidden, for reference.

## Choices Kyle may want to change

- **Show more vs pages:** the Library loads 12 cards, then a Show more button adds 12 more. Numbered pages are the alternative.
- **Playbook grouping:** the playbook list is grouped by Kind. A single grid with filters is the alternative.
