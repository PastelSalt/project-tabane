---
title: Aqua Iro · Visual-novel dialogue box (Talk)
layer: ui-ux
origin: own-project
stack:
  - preact
  - typescript
  - astro
feature:
  - dialogue
status: proven
target: website
reuseNote: A character page wants short branching conversations, written as data and checked at build, that work before JavaScript loads.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/components/talk/DialogueBox.tsx
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the character pose on the right and a visual-novel dialogue box along the bottom with a name plate, the line being typed, three choice buttons and LOG and AUTO controls"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Aqua Iro Archive's Home with the Talk dialogue box
related:
  - aqua-log-drawer
  - aqua-time-travel
  - aqua-build-gates
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

"Talk with Aqua": a visual-novel dialogue box on Home with branching, fan-written conversations written in YAML.

- **States:** hidden ⇄ idle → speaking(i) → choosing → responding(i) → (choosing | ended) → idle.
- **No JavaScript first:** server-rendered with its first line, so text shows without JS; it hydrates `client:idle` and fetches the prerendered `/talk.json`, where expressions are already resolved to optimized pose URLs.
- **Authoring:** 21 conversations in five categories (ask, tease, cheer, explore, special) plus idle lines that type in on their own every 20–30 s (Motion ON) and an expression → pose table. Each conversation has a bilingual title, weight, `rare` (a ~5 % pool, shown ✦ in the album), `when` triggers (time of day, birthday, anniversary, graduation, first visit, returning), lines, and choices: 4–6 candidates, 3 shown, at most one `goto` and at least one that stays.
- **Checked at build:** one Zod schema plus a graph validator (`talk/schema.ts`) used by the build gate, the endpoint and the unit tests; the build fails on errors.
- **Picking:** `crypto.getRandomValues` (injectable for tests); triggers from the visitor's local clock.
- **Never navigates by itself:** a `goto` offers "Take me there →" after the reply.
- **Memory:** a session backlog and a memory album of conversations seen, shared with the LOG drawer.
- **Honesty:** the box and the LOG drawer say the lines are fan-written, not her words. The same box, smaller, is the site's loading, empty and error state.

## Key code

```yaml path=src/content/talk/README.md
- id: favorite-game # kebab-case, unique
  title: { ja: '…', en: '…' } # shown in the Memory album
  category: ask # ask | tease | cheer | explore | special
  weight: 10 # relative; default 10
  rare: false # ~5% pool, ✦ in the album
  when: [any] # any | morning | day | evening | night | birthday | anniversary | graduation | first-visit | returning
  lines:
    - { exp: smile, ja: '…', en: '…' }
  choices: # 4–6 candidates; 3 are shown (≤ 1 goto, ≥ 1 non-goto)
    - id: fav
      ja: '…'
      en: '…'
      reply:
        - { exp: excited, ja: '…', en: '…' }
      next: rematch # optional: a node in this conversation
      goto: streaming # optional: offers "Take me there →" after the reply (never auto-navigates)
  nodes:
    rematch:
      lines: [{ exp: pout, ja: '…', en: '…' }]
      choices: [] # empty = the conversation ends
```
