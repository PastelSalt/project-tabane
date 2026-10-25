---
title: Kotoha · Next-stream ticket and week strip
layer: ui-ux
origin: own-project
stack:
  - javascript
  - css
feature:
  - countdown
status: proven
target: website
reuseNote: A page counts down to the next regular stream (or any weekly event) and shows this week at a glance.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/public/countdown.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: a notched ticket with a NEXT STREAM stub, the schedule line and four flip-digit boxes, then a seven-day week strip with two stream days highlighted"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's Home with the next-stream ticket and week strip on the left
  - file: screenshot-phone.webp
    alt: Phone screenshot of the next-stream ticket and week strip
related:
  - kotoha-content-crud-archive
  - kotoha-scrapbook-design-system
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

A notched ticket that counts down to the next stream, and a Monday-first strip of this week with the stream days marked.

- **Next stream:** `nextStream(now)` walks the next nine days in UTC and returns the first Tuesday or Friday 21:00 JST (12:00 UTC) still ahead, or the one running now (LIVE for 2 hours).
- **Flip digits:** days, hours, minutes and seconds tick once a second; each digit restarts its flip animation only when its value changes.
- **LIVE state:** the ticket turns live (`is-live`) during the stream.
- **Local time:** the schedule line's tooltip shows the start in the visitor's own time zone (`Intl.DateTimeFormat`).
- **Screen readers:** a hidden sentence updates once a minute, not every second.
- **Week strip** (`home.js` `renderWeek`): the current Japan-time week, Monday first, stream days highlighted with their time, today ringed.
- **Known wrinkle:** the schedule is written twice (`STREAM_DAYS` in `countdown.js` and a hard-coded check in `home.js`); the Hanon site exports one constant instead.
- **Hanon Fan Site:** Hanon exports one `STREAM_DAYS` constant (Mon and Thu) used by both the countdown and the week strip, instead of writing the schedule twice.

## Key code

```js path=public/js/public/countdown.js
const START_UTC_HOUR = 12;
const LIVE_MS = 2 * 60 * 60 * 1000;

export function nextStream(now = Date.now()) {
  const d = new Date(now);
  for (let i = -1; i < 9; i++) {
    const start = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + i, START_UTC_HOUR);
    if (!STREAM_DAYS.includes(new Date(start).getUTCDay())) continue;
    if (now < start) return { start, live: false };
    if (now < start + LIVE_MS) return { start, live: true };
  }
  return null;
}
```
