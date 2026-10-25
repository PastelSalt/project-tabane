# Project Name · project file

<!-- Full project file (PHASE-2.md "Project file format"). Copy to projects/<name>.md. Every fact comes from the code,
     the site or the project's own docs, with its source in §16; anything unclear goes in §15 and in
     projects/OPEN-QUESTIONS.md, never guessed. A copy of another project gets _template-derived.md instead.
     The content check (npm run check:content) requires every header row and every numbered section below. -->

One paragraph: what this file is, which codebase it reads, and that nothing here has been applied to Tabane yet.

| | |
|---|---|
| Name | Full name, one line on what it is |
| Kind | Own project (Moeko Works) · or Researched site |
| Live site | https://… |
| Repository | [owner/repo](https://github.com/owner/repo) (private) · or — for researched sites |
| Local folder | `C:\Users\Myaako\Documents\MoekoWorks\…` · or — |
| Read at | commit `abc1234` (`main`, date), N commits, read date · or the date the site was read |
| Target | Website · Mobile Application · Desktop Application |
| Status on the site | Live / Beta / gone, with dates |
| Embeddable | Yes / **No**, with the header that decides it (`X-Frame-Options`, `frame-ancestors`) |
| Size | Lines of code and docs |

## Contents

Numbered links to sections 1–16.

## 1. Overview

What it is, its pages or screens, signature features, what it is for from Tabane's view.

## 2. Stack

| Layer | What | Tabane tag |
|---|---|---|

Tag values from `content/tags.yml`; new ones marked *(new)* and listed in §14.

## 3. Architecture

Mermaid diagrams: 3.1 Level 1 · System, then Level 2 diagrams per path (read, write, upload, sign-in, upkeep …).

## 4. Repository structure

A `text` block of the folders and main files, with what each does.

## 5. Visual design

Identity, tokens, components, layout and breakpoints, icons, imagery: enough to draw wireframes.

## 6. How the front end operates

One subsection per behaviour: pre-paint, navigation, motion, data on the page, tracking, failure handling, admin.

## 7. How the back end operates

One subsection per piece: routing, database access, auth, content, uploads, analytics, security and delivery.

## 8. Data model

Tables (or collections) with their fields, constraints and retention.

## 9. How it was built (process)

9.1 Timeline from the commit history · 9.2 Working method seen in the repo · 9.3 Operations.

## 10. Reusable pieces catalogue

Reusability: High / Medium / Low.

| # | Piece | Files | What it gives a new project | Reuse | What to change when lifting |
|---|---|---|---|---|---|

10.1 UI/UX pieces (U1 …) · 10.2 Backend pieces (B1 …).

## 11. Gotchas and quirks

| # | Gotcha | Detail |
|---|---|---|

## 12. Proposed entries

Defaults for every entry (Origin, Status, Target, Shared, `projectFile`, Used in, live site, Embeddable, code ref), then:

| Slug | Title | Pieces | Stack | Feature | Related |
|---|---|---|---|---|---|

12.1 UI/UX entries · 12.2 Backend entries · the total · 12.3 Key code candidates.

## 13. Proposed replication guide

`replicate-…` · Replication guide · Draft · Target. Numbered steps pointing to the pieces, the gotchas that apply, and what finished looks like.

## 14. Proposed new tag values

| Tag | Value | Label | Used by |
|---|---|---|---|

## 15. Open questions

Numbered, each with a recommendation; also copied into `projects/OPEN-QUESTIONS.md`.

## 16. Sources

| Area | Files read |
|---|---|
