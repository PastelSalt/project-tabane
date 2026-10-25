---
title: Aqua Iro · Bilingual islands without flicker
layer: ui-ux
origin: own-project
stack:
  - astro
  - preact
feature:
  - localization
status: proven
target: website
reuseNote: A static site with interactive islands ships two languages in the HTML and switches instantly, with no hydration mismatch.
liveSite:
  url: https://aqua-iro-archive.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/lib/useLang.ts
  ref: 616052f
projectFile: aqua-iro-archive
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: a heading and text shown as two stacked spans, Japanese and English, with the English hidden, the JP/EN dock button, and notes on the island trick"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Aqua Iro Archive's Home in Japanese
  - file: screenshot-phone.webp
    alt: Phone screenshot of the About chapter in Japanese
related:
  - kotoha-bilingual-i18n
  - aqua-chapter-skeleton
  - himawari-budoux-phrases
usedIn:
  - Aqua Iro Archive
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Japanese and English both ship in every page; CSS shows one.

- **Both in the HTML:** `<T>` renders `<span data-l="ja" lang="ja">` and `<span data-l="en" lang="en">`; CSS hides the one that doesn't match `html[data-lang]`. Strings live in `content/i18n/{ja,en}.json`; `t(key, vars)` returns a `{ ja, en }` pair and `pick()` falls back to the other language.
- **Before paint:** the pre-paint script reads `aia:prefs` (or the browser language) and sets `data-lang` and `<html lang>`.
- **Islands hydrate in Japanese, then switch:** islands are server-rendered in Japanese, so `useLang()` returns `'ja'` on the first client render (matching the HTML) and the visitor's language on the next, which makes Preact patch every attribute that differs (aria-labels, titles).
- **ClientRouter drops `<html>` attributes** when it swaps pages, so `data-lang`, `data-motion` and `lang` are re-applied on `astro:after-swap`.
- **Write only on change:** rewriting `lang` re-matches every `:lang()` rule, so it is compared first.
- **No auto-translate:** `notranslate` and `translate="no"`, because browser translation garbled names and broke islands.

## Key code

```ts path=src/lib/useLang.ts
/**
 * The language an island should render with. Preact's hydration keeps the server's attributes
 * (aria-labels, titles), and islands are server-rendered in Japanese, so the first client render
 * uses 'ja' to match that HTML and the next one switches to the visitor's language, which makes
 * Preact patch every label that differs.
 */
import { useEffect, useState } from 'preact/hooks';
import { lang, type Lang } from './prefs';

export function useLang(): Lang {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready ? lang.value : 'ja';
}
```
