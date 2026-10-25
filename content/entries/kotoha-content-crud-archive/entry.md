---
title: Kotoha · Config-driven CRUD with archive and activity log
layer: backend
origin: own-project
stack:
  - node-js
  - neon-postgres
feature:
  - admin-panel
  - database
status: proven
target: website
reuseNote: Several dated content types need create, edit, drafts and delete, and nothing should ever be lost.
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: lib/archive.js
  ref: 41d4bd8
projectFile: kotoha-fansite
diagrams:
  - id: system
    level: 1
    title: Admin write path
    file: level-1-system.mmd
  - id: archive
    level: 2
    parent: system
    title: Archive and restore
    file: level-2-archive.mmd
related:
  - kotoha-admin-panel
  - kotoha-admin-auth
  - kotoha-cloudinary-uploads
  - hanon-admin-smoke-test
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

One CRUD implementation for every content type, where deleting archives a snapshot and every write is logged.

- **Config** (`api/admin.js` `CONTENT`): each resource names its table, date column, select list, fields (`key`, `col`, `type`, `required`, `max`, `default`) and mapper. `readFields` validates every field on create and only the present ones on update. Videos, news, achievements and discography share it.
- **Validation** (`lib/validate.js`): `text`, `date`, `url`, `oneOf`, `youtubeId`, `links` and `id` methods record an error per field; `throwIfInvalid()` answers `422 VALIDATION_FAILED` with `fields`. Links: up to three `{ url, label_key }` from a fixed list.
- **Drafts:** status `draft` or `published`; `published_at` is set on the first publish only.
- **YouTube lookup:** `videos/lookup` turns any YouTube link (bare id, youtu.be, watch, embed, shorts, live, music) into a validated id and its title through oEmbed, with no API key.
- **Archive instead of delete:** `archiveRow` copies the row as JSONB into `archived_content` (with reason, who, when) and deletes it, in one transaction. `restoreArchived` puts it back with its original id (`jsonb_populate_record` + `overriding system value`); unique conflicts → 409. Gallery files are destroyed on Cloudinary, so gallery archive entries are history only.
- **Activity log:** every write records the username, action (`news.create`, `gallery.delete` …), entity and details; the username survives the user.

## Key code

```js path=lib/archive.js
export async function archiveRow(table, id, admin, { reason = null, note = null } = {}) {
  if (!Object.hasOwn(SECTIONS, table) || table === 'admin_users') throw new Error(`archiveRow: bad table ${table}`);
  const s = sql();
  const [inserted, deleted] = await s.transaction([
    s.query(
      `insert into archived_content
         (source_table, source_section, original_id, record, archived_by_id, archived_by_username, reason, note)
       select $1, $2, t.id, to_jsonb(t), $3, $4, $5, $6 from ${table} t where t.id = $7
       returning id`,
      [table, SECTIONS[table], admin.id, admin.username, reason, note, id],
    ),
    s.query(`delete from ${table} where id = $1 returning id`, [id]),
  ]);
  if (!inserted.length || !deleted.length) throw new HttpError(404, 'NOT_FOUND', 'Item not found');
  return Number(inserted[0].id);
}
```
