---
title: Kotoha · Admin panel shell, UI kit and config-driven forms
layer: ui-ux
origin: own-project
stack:
  - javascript
  - css
feature:
  - admin-panel
  - forms
status: proven
target: website
reuseNote: A no-build site needs a calm, themed admin panel where one config per content type gives its list, form, drafts and archive.
liveSite:
  url: https://kotoha-fansite.vercel.app/login
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/admin/content.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the admin panel with a grouped sidebar, a sticker page title, a toolbar, list rows with thumbnails and status pills, and an edit dialog"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the Kotoha admin sign-in page in the refreshed theme
related:
  - kotoha-admin-auth
  - kotoha-content-crud-archive
  - kotoha-scrapbook-design-system
  - kotoha-analytics-dashboard
  - aqua-keeper-panel
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The admin panel at `/admin` (vanilla ES modules, no build step), refreshed on 2026-10-25 into the public site's theme, calmer.

- **Shell** (`admin/main.js`): checks `auth/me`, applies the user's language, hash router (`#/videos` …). Each navigation renders into its own container behind a `renderSeq` guard, so a slow page can't overwrite the current one. Forced password change screen; owner-only links.
- **API client** (`admin/api.js`): JSON in and out, same-origin cookies, translated error codes, a "waking up the database" toast after 2.5 s, redirect to `/login` on `UNAUTHENTICATED`.
- **Config-driven forms** (`admin/content.js` `RESOURCES`): each resource lists its fields (`text`, `textarea`, `date`, `url`, `select`, `youtube`, `links`, `status`) and how its list rows look; one form builder and one list renderer serve videos, news, achievements and discography.
- **Gallery manager** (`admin/gallery.js`): shrinks oversize images in the browser before a signed upload with a progress bar; edit credits; delete.
- **Look (2026-10-25 refresh):** tokens copied from the public site into `admin.css`; brand-pink page with dots, paper cards, green sticker titles with the sprite clover; colour meaning fixed (green = content and actions, pink = visitors, dashed = draft).
- **Shell details:** sidebar grouped Content / Records / Account; on phones a scrim, Escape and tap-outside close the menu, and focus moves in and back.
- **UI kit** (`admin/ui.js`): toasts with an icon per kind, a promise-based `<dialog>` with a sticky action row, `stateBox` for empty and error states, `skeletonRows` at final size, sticker titles.
- **Rules:** database text only through `textContent`; every behaviour kept when the look changed (front-end-only refresh).
- **Hanon Fan Site:** Hanon has the same refreshed admin in its Sazanami theme, with visitors in gold instead of pink: one redesign, two sites, only the theme mapped.
