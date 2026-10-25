---
title: Aqua Iro · Time-travel archive (Aqua Time)
layer: ui-ux
origin: own-project
stack:
  - preact
  - typescript
  - css
feature:
  - timeline
status: proven
target: website
reuseNote: An archive of a finished career (or any dated history) lets visitors set a date and see the whole site as it was that day.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/lib/aquatime.ts
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe of the tape deck: a cassette window, the chosen date, a scrubber from debut to graduation, step buttons and On this day, with a date badge under the logo"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the Aqua Time tape deck open over Home
related:
  - aqua-dialogue-box
  - aqua-stream-log-search
  - aqua-bottom-dock
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

「あくあ時間」 Aqua Time: a VHS-style tape deck that travels the whole archive to any of the 2,212 days between debut and graduation.

- **The deck** (`AquaTime.tsx`, opened by the dock's TIME button): drag the scrubber or step by day, week or month, or jump to "On this day".
- **The whole site follows:** the Home outfit, the Talk greeting, the stream log, the discography and the counters all show that day; a badge under the logo tab shows where you are and returns you to the present.
- **State** (`aquatime.ts`): a `timeDate` signal (null = the present), stored per browser; `setTime` dispatches `aia:time` and sets `html[data-time]` and `html[data-season]`, so CSS can react; `aquatime.css` shifts the page wash with the season. "Art is never tinted: only the colour tokens shift."
- **Data:** `/aqua-time.json` (134 KB) is built at compile time from existing content (streams, timeline events, songs, art, outfits), re-indexed by day, and fetched only when the deck opens or for the once-a-session check.
- **On this day:** once per session a toast lists what happened on today's date in past years.

## Key code

```ts path=src/lib/aquatime.ts
export const timeDate = signal<string | null>(valid(stored) ? stored : null);

export function season(d: string): 'spring' | 'summer' | 'autumn' | 'winter' {
  const m = Number(d.slice(5, 7));
  return m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'autumn' : 'winter';
}

function reflect(d: string | null) {
  if (!isBrowser) return;
  const h = document.documentElement;
  if (d) {
    h.dataset.time = d;
    h.dataset.season = season(d);
  } else {
    delete h.dataset.time;
    delete h.dataset.season;
  }
}

export function setTime(d: string | null) {
  const v = d && valid(d) ? d : null;
  timeDate.value = v;
  if (v) write(KEY, v);
  else remove(KEY);
  reflect(v);
  window.dispatchEvent(new CustomEvent('aia:time', { detail: v }));
}
```
