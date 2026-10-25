# Tabane log

Everything that happens on Project Tabane, by Kyle and by Claude. Newest first. One line per action; Claude adds a line for each of its own changes and for each decision or request from Kyle.

| Date | Who | Action |
|---|---|---|
| 2026-10-25 | Claude | Phase 1 step 1 done: Next.js 16.3.8 app (React 19, TypeScript, ESLint, npm, `src/` layout) set up in this folder; `typecheck` script runs `next typegen` first; starter `CLAUDE.md` and README; `.drafts/` stays git-ignored; `git init` with `origin` set to PastelSalt/project-tabane; first local commit. Not pushed |
| 2026-10-25 | Kyle | Started Phase 1 step 1 (repository setup); commit locally only |
| 2026-10-25 | Claude | Wrote `PHASE-1.md` (working UI with sample data: pages, components, design tokens, 15 steps). Spec: build phases re-ordered (1 Working UI, 2 Content, 3 Upkeep tools, 4 Deploy, 5 Login) |
| 2026-10-25 | Claude | Moved the mock-up to `.drafts/mockup.html`, set the folder hidden, and added `.gitignore` so it stays out of Git |
| 2026-10-25 | Kyle | Approved the mock-up with its entry pages. Asked to hide it (not delete), and to plan Phase 1 as the working UI only, with no project content |
| 2026-10-25 | Claude | Mock-up: added two entry pages in the new style, opened from the first two cards. UI/UX (Kotoha countdown): fields sidebar, reuse sticky note, wireframe, live-site stand-in with a working countdown, technical details, key code. Backend (cookieless statistics): clickable 3-level diagram, Mermaid source, details, key code |
| 2026-10-25 | Kyle | Asked to see what the inside of a clicked card looks like |
| 2026-10-25 | Claude | Mock-up: cards lift and tilt on hover, the pocket watch ticks (second hand each second, minute hand creeping), all off for reduced motion. Spec: motion rule rewritten, open question closed |
| 2026-10-25 | Kyle | Loved the new mock-up. Asked for light motion on the site itself: cards lifting on hover and a ticking pocket watch |
| 2026-10-25 | Claude | Spec: replaced the palette with Alice in Wonderland colors, added the wireframe layout, look and feel, motifs table; added the motion open question |
| 2026-10-25 | Claude | Rebuilt `mockup.html` to Kyle's wireframe: blue header with chessboard strip, left filter sidebar with the Moeko Works logo, rounded sticker cards with washi tape, blue-and-yellow grid, watch, teacup, carrot and stamp motifs. Kept the rabbit logo. Dropped the entry-page mock-ups for now |
| 2026-10-25 | Kyle | Reviewed the first mock-up: too bland. Asked for more rounded UI, more color (Alice in Wonderland: blue, yellow, white, black, violet secondary), a blue and yellow grid background, more motifs and life, and the layout from Kyle's own wireframe. Keep the rabbit logo |
| 2026-10-25 | Claude | Created `mockup.html`, a throwaway mock-up of the Library and an Entry page in the Tabane palette, to delete later |
| 2026-10-25 | Claude | Created this LOG.md and filled it in with everything so far |
| 2026-10-25 | Claude | Spec: recorded the GitHub repository, the push rule and LOG.md |
| 2026-10-25 | Kyle | Gave the repository: [PastelSalt/project-tabane](https://github.com/PastelSalt/project-tabane). Said to keep planning for now, and that Claude should not ask to push again and again; Kyle will say when to push. Asked for LOG.md and a page mock-up |
| 2026-10-25 | Claude | Spec: added each project's local folder and GitHub link, the free domain and GitHub sign-in; no open questions left |
| 2026-10-25 | Kyle | Answered: all project repos are local under `C:\Users\Myaako\Documents\MoekoWorks`, use the free `vercel.app` address, use Sign in with GitHub |
| 2026-10-25 | Claude | Spec: added the gap answers (Key code, Used in, status rule, how entries are made, app entries, link check, search privacy, other people's work, naming, CLAUDE.md first) |
| 2026-10-25 | Kyle | Asked for all gaps to be written in, with only real decisions left as open questions |
| 2026-10-25 | Claude | Reviewed the spec and listed 11 gaps |
| 2026-10-25 | Claude | Sampled Tabane Shinonono's anime colors: hair #9D5AA1 and dress #7B96EA match the purple and blue swatches. Spec: split each project into UI/UX, Backend and a replication guide; anime look leads |
| 2026-10-25 | Kyle | Answered: split each project into UI/UX, backend and how it was created; research her again; use all sources but prefer the anime look |
| 2026-10-25 | Claude | Spec: moved entries and playbooks to files in the repository; Neon kept only for access codes |
| 2026-10-25 | Kyle | Chose files in the GitHub repository over Neon for entries and playbooks |
| 2026-10-25 | Claude | Spec: rewrote the workflow around Claude as the only writer; removed the edit page |
| 2026-10-25 | Kyle | Explained the workflow: Claude adds concepts, Kyle deliberates new projects with Claude using Tabane, and asks Claude to update the site |
| 2026-10-25 | Claude | Spec: turned all recommendations into decisions (Next.js, password gate, tag lists, access codes, Playbook, light and dark mode) |
| 2026-10-25 | Kyle | Asked for all recommendations to be applied |
| 2026-10-25 | Claude | Spec: unified the tag vocabulary, reordered sections, fixed typos and the diagram placeholder, added open questions |
| 2026-10-25 | Claude | Analyzed the spec and reported issues |
| 2026-10-24 | Kyle | Wrote the Project Tabane spec (`Project-Tabane-v2.md`) |
