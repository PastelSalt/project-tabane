@AGENTS.md

# Project Tabane

Kyle's (Moeko Works) private library of reusable UI/UX and backend concepts. Claude is the only one who writes to it.

## Read first

- `Project-Tabane-v2.md`: the full spec. It wins over anything else.
- `PHASE-1.md`: the current phase and its steps. Work one step at a time, in order.
- `LOG.md`: what has happened so far, newest first.
- `.drafts/mockup.html`: the approved design. Hidden and git-ignored; never delete it, never commit it.

## Rules

- **Never push** to GitHub and never ask to push. Commit locally; Kyle says when to push.
- **Log everything:** after each change, add one line to the top of the `LOG.md` table (date, who, what). Also log Kyle's decisions and requests.
- **Phase 1 uses sample data only.** No real project content. Sample entries are titled "Sample · …".
- **Data access goes through `src/lib/data.ts`** so Phase 2 can swap samples for content files in one place.
- **Design tokens only:** colors, radius, shadows and spacing come from the CSS variables in `src/app/globals.css`. Blue (#7D98EC) is never used for text.
- **Motion:** only the card lift on hover and the ticking pocket watch move on the site itself, and both stop under `prefers-reduced-motion`.
- **No popups or modals:** everything is its own page; confirmations happen inline.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local site at http://localhost:3000 |
| `npm run typecheck` | Generates route types, then checks TypeScript |
| `npm run lint` | ESLint |
| `npm run build` | Production build |

Run typecheck, lint and build before marking a step done.
