---
title: Kotoha · Keyset pagination, server and client
layer: backend
origin: own-project
stack:
  - node-js
  - javascript
  - neon-postgres
feature:
  - pagination
status: proven
target: website
reuseNote: Lists sorted newest-first need stable paging that never skips or repeats rows, and an infinite list on the page.
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: lib/paging.js
  ref: 41d4bd8
projectFile: kotoha-fansite
diagrams:
  - id: system
    level: 1
    title: One page of a list
    file: level-1-system.mmd
  - id: cursor
    level: 2
    parent: system
    expands: page
    title: Cursor
    file: level-2-cursor.mmd
related:
  - kotoha-news-notes
  - kotoha-year-timeline
  - kotoha-sleeping-db-cache
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Cursor pages by (date, id), newest first and stable on ties, with an infinite list on the client.

- **Server:** fetch `limit + 1` rows; if there is an extra row, there is a next page. The cursor is base64url of `"<date or timestamp>|<id>"`.
- **Validated cursors:** `decodeCursor` checks the date (or timestamp) and a positive safe integer id, else `400 BAD_CURSOR`.
- **SQL pattern:** `($1 is null or (date_col, id) < ($1, $2)) order by date_col desc, id desc limit $3`; default 20 per page, at most 50.
- **List table:** `api/public.js` maps each list name to its SQL, cursor kind, key and mapper (snake_case → camelCase); only published rows are returned.
- **Client** (`lists.js` `pagedList`): first page on `load()`; a sentinel inside the scrolling container loads more (vertical, or sideways with `axis: 'x'`); `render` may return several nodes (the timeline's year pills); `rerender()` after a language change; an error note with retry.

## Key code

```js path=lib/paging.js
export function encodeCursor(key, id) {
  return Buffer.from(`${key}|${id}`, 'utf8').toString('base64url');
}

/** Returns { key, id } or null. `kind` is 'date' (YYYY-MM-DD) or 'timestamp' (ISO). */
export function decodeCursor(cursor, kind) {
  if (!cursor) return null;
  let raw;
  try {
    raw = Buffer.from(String(cursor), 'base64url').toString('utf8');
  } catch {
    throw new HttpError(400, 'BAD_CURSOR', 'Invalid cursor');
  }
  const [key, idText] = raw.split('|');
  const id = Number.parseInt(idText, 10);
  const keyOk = kind === 'date' ? /^\d{4}-\d{2}-\d{2}$/.test(key) : !Number.isNaN(Date.parse(key));
  if (!keyOk || !Number.isSafeInteger(id) || id <= 0) throw new HttpError(400, 'BAD_CURSOR', 'Invalid cursor');
  return { key, id };
}

/** Given rows fetched with limit+1, returns { items, nextCursor }. */
export function page(rows, limit, keyOf) {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const last = items[items.length - 1];
  return { items, nextCursor: hasMore && last ? encodeCursor(keyOf(last), last.id) : null };
}
```
