---
title: Aqua Iro · Message board island
layer: ui-ux
origin: own-project
stack:
  - preact
  - turnstile
feature:
  - forms
  - moderation
status: proven
target: website
reuseNote: Visitors leave short anonymous notes on a static site, with live rule feedback, undo and reporting, and nothing unsafe rendered.
liveSite:
  url: https://aqua-iro-archive.vercel.app/messages
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/components/board/BoardApp.tsx
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the board in the deep band, a composer card on the left with the next crew number, a text box, the character count, Pin it and a Turnstile box, and notes on coloured paper on the right with their crew numbers"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the message board's composer and the notes beside it
  - file: screenshot-phone.webp
    alt: Phone screenshot of the message board composer
related:
  - aqua-posting-pipeline
  - aqua-report-auto-hide
  - aqua-moderation-audit
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

No.07 寄せ書き, the message board: one Preact island with the composer, the board and the report popover.

- **Composer:** live feedback from the same text rules the server enforces (300 graphemes, 6 lines, 20 emoji, no links or personal info), a preview of the next crew number, a draft saved per browser (`aia:board.draft`), and Cloudflare Turnstile loaded on demand (one single-use token per post).
- **After posting:** the note appears at once (optimistic insert) with its crew number and a 10-minute **undo**; the undo token is kept per browser (`aia:board.mine`).
- **The board:** notes on coloured paper, sort order remembered, loaded from the edge-cached list endpoint.
- **Report popover:** a reason (spam, hate, sexual, personal info, impersonation, other), an optional note and its own Turnstile; reports you made are remembered so the button reflects it.
- **Safe by construction:** notes are always rendered as escaped text (Preact text nodes), never as HTML.
- **Friendly errors:** stable error codes from the server (`RATE`, `DUPLICATE`, `LINK` …) map to friendly text in both languages.
