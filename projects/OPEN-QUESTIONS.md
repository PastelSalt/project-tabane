# Open questions · project files

Every open question from every project file, in one place, for Kyle to answer later. A project file is applied to Tabane only after its questions here are answered.

**How it works:**

- **Adding questions:** when Claude writes a new project file, its open questions are added here under a new heading, newest project last. The project file's own "Open questions" section stays as it is.
- **Answering:** Kyle writes the answer under each question (replace `_Answer:_` with the answer) and ticks the box.
- **Closing:** when a project file is applied, its section moves to "Answered and applied" at the bottom, with the date.
- **Recommendations:** each question carries Claude's recommendation, so leaving a question blank isn't an answer; Claude will ask before applying.

---

## Kotoha Fan Site · [`kotoha-fansite.md`](kotoha-fansite.md) §15

- [ ] **K1. Entry granularity:** 29 entries is fine-grained (for example, the motion system is split into four). Keep this split, or merge into fewer, bigger entries (for example one "motion system" entry)?
  *Recommended:* keep the split; small entries are easier to find and lift.
  _Answer:_
- [ ] **K2. Hanon under Used in:** list Hanon Fan Site under Used in on the Kotoha entries now?
  *Recommended:* yes; the Hanon file (§7.1) confirms every Kotoha piece is in Hanon.
  _Answer:_
- [ ] **K3. The unused wipe (`wipe.js`):** leave it out, or add it as a Candidate entry?
  *Recommended:* leave it out.
  _Answer:_
- [ ] **K4. Shared:** every entry starts with Shared off. Are any safe to show visitors (for example the design system or the loader)?
  *Recommended:* keep all off for now.
  _Answer:_
- [ ] **K5. Replication guide order:** is the build order in §13 how you would rebuild it?
  _Answer:_
- [ ] **K6. New tag values:** add all 18 proposed in §14, or only some?
  *Recommended:* add all.
  _Answer:_
- [ ] **K7. Admin look:** the admin panel keeps an older, calmer look (`admin.css`). Treat its look as reusable too, or only its behaviour?
  *Recommended:* behaviour only.
  _Answer:_

## Hanon Fan Site · [`hanon-fansite.md`](hanon-fansite.md) §9

- [ ] **H1. Marquee fix in Kotoha:** apply Hanon's marquee fix to the Kotoha repository? That is a change outside Tabane, so it would be its own task.
  _Answer:_
- [ ] **H2. Sazanami theme:** keep `hanon-sazanami-theme` as its own entry, or fold it into `kotoha-scrapbook-design-system` as a "theme variant" section?
  *Recommended:* its own entry.
  _Answer:_
- [ ] **H3. Main replication guide:** keep both guides, or make the Hanon one ("derive a sister fan site from Kotoha") the main guide for new fan sites?
  *Recommended:* Hanon's as the main guide.
  _Answer:_
- [ ] **H4. Harness reach:** the test harness also works on Kotoha. List Kotoha under its Used in?
  *Recommended:* no, not until it has actually been run on Kotoha.
  _Answer:_

## Aqua Iro Archive · [`aqua-iro-archive.md`](aqua-iro-archive.md) §15

- [ ] **A1. Entry granularity:** 28 entries; the board alone is four (pipeline, reports, moderation, island). Keep this split, or merge the board into one or two entries?
  *Recommended:* keep the split; the pipeline and the report trick are each worth finding on their own.
  _Answer:_
- [ ] **A2. Overlap with Kotoha:** where Aqua does the same job differently (loader, lightbox, motion, bilingual, analytics, auth), keep separate entries linked under Related, or one entry per idea with both projects under Used in?
  *Recommended:* separate entries; the stacks differ (plain JS vs Astro + Preact), so the code can't be shared.
  _Answer:_
- [ ] **A3. Signature features:** Talk and Aqua Time are written around Aqua. Keep them as Proven entries, or file them as Candidate patterns?
  *Recommended:* Proven; they are live and the parts that change (character, dataset) are listed in the entry.
  _Answer:_
- [ ] **A4. CSP hashes in `vercel.json`:** the live hashes match the committed file, but `csp-hash.ts` also rewrites it during the build. Do you commit `vercel.json` after a local build when inline scripts change, or does the Vercel build's rewrite take effect?
  _Answer:_
- [ ] **A5. BudouX:** a dependency named in Credits but not imported anywhere. Dropped, or planned?
  *Recommended:* leave it out of the entries either way.
  _Answer:_
- [ ] **A6. Shared:** every entry starts with Shared off. Are any safe to show visitors (for example the filler kit or the motion budget)?
  *Recommended:* keep all off for now.
  _Answer:_
- [ ] **A7. Replication guide order:** is the order in §13 how you would rebuild it?
  _Answer:_
- [ ] **A8. New tag values:** add all 15 proposed in §14, or only some?
  *Recommended:* add all.
  _Answer:_

---

## Answered and applied

None yet.
