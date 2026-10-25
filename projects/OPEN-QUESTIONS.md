# Open questions · project files

Every open question from every project file, in one place, for Kyle to answer later. A project file is applied to Tabane only after its questions here are answered.

**How it works:**

- **Adding questions:** when Claude writes a new project file, its open questions are added here under a new heading, newest project last. The project file's own "Open questions" section stays as it is.
- **Answering:** Kyle writes the answer under each question (replace `_Answer:_` with the answer) and ticks the box.
- **Closing:** when a project file is applied, its section moves to "Answered and applied" at the bottom, with the date.
- **Recommendations:** each question carries Claude's recommendation, so leaving a question blank isn't an answer; Claude will ask before applying.

**Answered 2026-10-25:** Kyle asked Claude to answer every question below with its recommended answer. Questions that had no recommendation got one first, then the same answer. Kyle can still change any answer before its project file is applied.

---

## Aqua Iro Archive · [`aqua-iro-archive.md`](aqua-iro-archive.md) §15

- [x] **A1. Entry granularity:** 28 entries; the board alone is four (pipeline, reports, moderation, island). Keep this split, or merge the board into one or two entries?
  *Recommended:* keep the split; the pipeline and the report trick are each worth finding on their own.
  _Answer:_ Keep the split: 28 entries.
- [x] **A2. Overlap with Kotoha:** where Aqua does the same job differently (loader, lightbox, motion, bilingual, analytics, auth), keep separate entries linked under Related, or one entry per idea with both projects under Used in?
  *Recommended:* separate entries; the stacks differ (plain JS vs Astro + Preact), so the code can't be shared.
  _Answer:_ Separate entries, linked under Related.
- [x] **A3. Signature features:** Talk and Aqua Time are written around Aqua. Keep them as Proven entries, or file them as Candidate patterns?
  *Recommended:* Proven; they are live and the parts that change (character, dataset) are listed in the entry.
  _Answer:_ Proven.
- [x] **A4. CSP hashes in `vercel.json`:** the live hashes match the committed file, but `csp-hash.ts` also rewrites it during the build. Do you commit `vercel.json` after a local build when inline scripts change, or does the Vercel build's rewrite take effect?
  *Recommended:* treat the committed `vercel.json` as what is served (that is what the live check showed), and write the rule into the entry: after changing an inline script or upgrading Astro, build locally and commit `vercel.json`.
  _Answer:_ As recommended: the entry says the committed `vercel.json` is what is served, and gives the build-locally-and-commit rule (gotcha G2).
- [x] **A5. BudouX:** a dependency named in Credits but not imported anywhere. Dropped, or planned?
  *Recommended:* leave it out of the entries either way.
  _Answer:_ Leave it out of Aqua's entries and Stack. (Himawari's `himawari-budoux-phrases` shows the working use.)
- [x] **A6. Shared:** every entry starts with Shared off. Are any safe to show visitors (for example the filler kit or the motion budget)?
  *Recommended:* keep all off for now.
  _Answer:_ Keep all off for now.
- [x] **A7. Replication guide order:** is the order in §13 how you would rebuild it?
  *Recommended:* yes; it follows the commit history and the plan docs.
  _Answer:_ Yes, use the §13 order.
- [x] **A8. New tag values:** add all 15 proposed in §14, or only some?
  *Recommended:* add all.
  _Answer:_ Add all 15.

## Himawari Website · [`himawari-website.md`](himawari-website.md) §15

The site only; the engine and Studio are out of scope.

- [x] **W1. Shared pieces:** where Himawari reuses Aqua's or Kotoha's code (CSP hashes, build gates, reveals, `make-og`), add Himawari to those entries' Used in rather than making new entries?
  *Recommended:* yes.
  _Answer:_ Yes.
- [x] **W2. Auth:** Himawari's admin auth is Kotoha's design rewritten in TypeScript with Drizzle and an env bootstrap. Its own entry, or a second implementation inside `kotoha-admin-auth`?
  *Recommended:* its own entry; the code differs and it's the one to copy for Astro projects.
  _Answer:_ Its own entry (`himawari-admin-auth`), linked to `kotoha-admin-auth`.
- [x] **W3. Preact:** installed and configured but unused. Remove it from the site later (its own task), or is an island planned?
  *Recommended:* leave Preact out of the entries' Stack, and remove it from the site later as its own small task in the website repository.
  _Answer:_ As recommended: Preact is left out of the Stack; removing it from the site is a later task of its own.
- [x] **W4. The portfolio:** the counter and the user-agent parser come from "the portfolio" (`moekoworks_official`). Write that project file next, so these entries can point to the original?
  *Recommended:* yes.
  _Answer:_ Yes; done the same day (`moekoworks-official.md`). `himawari-daily-salt-counter` links to `moekoworks-event-analytics` as its source.
- [x] **W5. Shared:** every entry starts with Shared off. Are any safe to show visitors (for example the release sync or the design system)?
  *Recommended:* keep all off for now.
  _Answer:_ Keep all off for now.
- [x] **W6. Replication guide order:** is the order in §13 how you would rebuild it?
  *Recommended:* yes; it follows the commits and the plan's milestones.
  _Answer:_ Yes, use the §13 order.
- [x] **W7. New tag values:** add all 3 proposed in §14?
  *Recommended:* add all.
  _Answer:_ Add all 3.

## Moeko Works Portfolio · [`moekoworks-official.md`](moekoworks-official.md) §15

- [x] **M1. Hard rule 6 in Tabane:** the portfolio never links source code, codenames, a photo or your handle. Should entries from this file still leave out the repository link and anything rule 6 covers, in case an entry is ever Shared?
  *Recommended:* keep the repository link (Tabane hides it from visitors anyway), and nothing else rule 6 covers.
  _Answer:_ Keep the repository link (hidden from visitors by Tabane); leave out codenames, photos and the handle.
- [x] **M2. Analytics lineage:** the portfolio's analytics as its own entry, with Himawari's counter linking to it as a smaller copy, or one "cookieless analytics" entry with Kotoha, the portfolio and Himawari under Used in?
  *Recommended:* its own entry; it is event-based and much wider.
  _Answer:_ Its own entry (`moekoworks-event-analytics`).
- [x] **M3. The rebrand:** keep the rebrand script as an entry and the incident as notes in the guide, or also make a "renaming a live project" playbook?
  *Recommended:* script as an entry, incident as notes.
  _Answer:_ The script as an entry; the incident as notes in the replication guide.
- [x] **M4. CSP:** still report-only with `'unsafe-inline'`. Record it as is, or is enforcing it planned soon?
  *Recommended:* record as is.
  _Answer:_ Record it as is (gotcha G16); update the entry if it is enforced later.
- [x] **M5. GSAP:** installed but unused. Leave it out of the Stack?
  *Recommended:* leave it out.
  _Answer:_ Leave it out.
- [x] **M6. Shared:** every entry starts with Shared off. Are any safe to show visitors (for example the accent theming or the capture pipeline)?
  *Recommended:* keep all off for now.
  _Answer:_ Keep all off for now.
- [x] **M7. Replication guide order:** is the order in §13 how you would rebuild it?
  *Recommended:* yes; it follows the plan's phases and `PROGRESS.md`.
  _Answer:_ Yes, use the §13 order.
- [x] **M8. New tag values:** add all 3 proposed in §14?
  *Recommended:* add all.
  _Answer:_ Add all 3.

---

## Answered and applied

Each section moves here when its project file is applied, with the date.

### Kotoha Fan Site · [`kotoha-fansite.md`](kotoha-fansite.md) §15 · applied 2026-10-25 (29 entries, guide `replicate-kotoha-fan-site`)

- [x] **K1. Entry granularity:** 29 entries is fine-grained (for example, the motion system is split into four). Keep this split, or merge into fewer, bigger entries (for example one "motion system" entry)?
  *Recommended:* keep the split; small entries are easier to find and lift.
  _Answer:_ Keep the split: 29 entries.
- [x] **K2. Hanon under Used in:** list Hanon Fan Site under Used in on the Kotoha entries now?
  *Recommended:* yes; the Hanon file (§7.1) confirms every Kotoha piece is in Hanon.
  _Answer:_ Yes. Every Kotoha entry lists Hanon Fan Site under Used in, with the notes from the Hanon file §7.1.
- [x] **K3. The unused wipe (`wipe.js`):** leave it out, or add it as a Candidate entry?
  *Recommended:* leave it out.
  _Answer:_ Leave it out.
- [x] **K4. Shared:** every entry starts with Shared off. Are any safe to show visitors (for example the design system or the loader)?
  *Recommended:* keep all off for now.
  _Answer:_ Keep all off for now.
- [x] **K5. Replication guide order:** is the build order in §13 how you would rebuild it?
  *Recommended:* yes; it follows the commit history and `FORHANON.md`.
  _Answer:_ Yes, use the §13 order.
- [x] **K6. New tag values:** add all 18 proposed in §14, or only some?
  *Recommended:* add all.
  _Answer:_ Add all 18.
- [x] **K7. Admin look** *(rewritten 2026-10-25 after the admin UI refresh)*: the admin now uses the public site's theme, calmer (Kotoha §6.10, piece U27; Hanon has the same in its own theme). Fold its look into `kotoha-admin-panel`, or make "admin UI kit in the site's theme" its own entry?
  *Recommended:* fold it into `kotoha-admin-panel`; the kit only makes sense with that panel.
  _Answer:_ Fold it into `kotoha-admin-panel`.

### Hanon Fan Site · [`hanon-fansite.md`](hanon-fansite.md) §9 · applied 2026-10-25 (5 entries, Hanon added to the 29 Kotoha entries, guide `replicate-hanon-fan-site`)

- [x] **H1. Marquee fix in Kotoha:** apply Hanon's marquee fix to the Kotoha repository? That is a change outside Tabane, so it would be its own task.
  *Recommended:* yes, as its own task in the Kotoha repository, not part of Tabane work.
  _Answer:_ Yes, as its own task. Until it's done, `kotoha-scroll-life` keeps the note that Kotoha still has the bug (G24).
  *Done 2026-10-25:* ported (`c4dcee4`), merged into Kotoha's `main` (`52e0184`) with Kyle's OK, live and checked on the live site.
- [x] **H2. Sazanami theme:** keep `hanon-sazanami-theme` as its own entry, or fold it into `kotoha-scrapbook-design-system` as a "theme variant" section?
  *Recommended:* its own entry.
  _Answer:_ Its own entry.
- [x] **H3. Main replication guide:** keep both guides, or make the Hanon one ("derive a sister fan site from Kotoha") the main guide for new fan sites?
  *Recommended:* Hanon's as the main guide.
  _Answer:_ Hanon's guide is the main guide for new fan sites; Kotoha's guide stays as the history of how the original was built.
- [x] **H4. Harness reach:** the test harness also works on Kotoha. List Kotoha under its Used in?
  *Recommended:* no, not until it has actually been run on Kotoha.
  _Answer:_ No, not until it has been run on Kotoha.
