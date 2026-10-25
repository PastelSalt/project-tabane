---
title: Kotoha · Bilingual i18n with attribute bindings
layer: ui-ux
origin: own-project
stack:
  - javascript
  - node-js
feature:
  - localization
status: proven
target: website
reuseNote: A static site needs two languages with no build step, picking Japanese for visitors in Japan and remembering an explicit choice.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/shared/i18n-core.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the same page section shown in English and in Japanese side by side, with the JP/EN switch and notes on bindings and the geo default"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's Home in Japanese
  - file: screenshot-phone.webp
    alt: Phone screenshot of Kotoha's About section in Japanese
related:
  - kotoha-nav-pill-circle-menu
  - kotoha-profile-card
usedIn:
  - Kotoha Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Japanese and English from JSON dictionaries, bound in HTML with attributes, with a sensible first guess.

- **Dictionaries:** `/locales/{en,ja}.json` (admin strings in `/locales/admin/`), fetched once per language and cached; values may be strings, arrays or objects (`about.pills`, `home.days`).
- **Bindings:** `data-i18n="a.b"` replaces text; `data-i18n-attr="aria-label:key;title:key2"` replaces attributes; `t('key', { vars })` fills `{placeholders}` in code.
- **First language:** an explicit choice (`?lang=` or stored `kf_lang`) wins; otherwise `/api/public/geo` reads Vercel's country header (Japan → Japanese) within 2.5 s; otherwise English. Only explicit choices are stored. The geo answer is never cached.
- **Before paint:** `prepaint.js` applies the stored or URL language, so the page doesn't flash in the wrong one.
- **Switching:** `mountLangSwitches` renders JP/EN buttons in the nav, the phone menu and the footer; `onLangChange` listeners re-render everything built from data, and the URL gets `?lang=`.
