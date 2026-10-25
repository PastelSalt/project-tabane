---
title: Himawari · Japanese line breaks with BudouX
layer: ui-ux
origin: own-project
stack:
  - budoux
  - astro
feature:
  - localization
status: proven
target: website
reuseNote: Japanese headlines should wrap between phrases, never inside a word, without breaking the tags inside them.
liveSite:
  url: https://himawari-moekoworks.vercel.app/ja
  embeddable: false
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/lib/phrase.ts
  ref: 4eb655c
projectFile: himawari-website
wireframe:
  phone:
    file: wireframe-phone.svg
    alt: "Phone wireframe: a Japanese headline whose lines break between phrase boxes, never inside one"
screenshots:
  - file: screenshot-phone.webp
    alt: Phone screenshot of the Japanese home page, whose headline breaks between phrases
related:
  - aqua-bilingual-islands
  - himawari-docs-pages
usedIn:
  - Himawari Website
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

BudouX splits a Japanese headline into phrases at build time (`phrase.ts`).

- **Each phrase is a span that doesn't wrap** (`.ph` in `base.css`), so lines break between phrases, never inside a word.
- **Tags survive:** only the text between tags is split, so `<mark>` and `<code>` in the copy stay intact.
- **Why:** it replaced `<wbr>` with `word-break: keep-all`, which broke inside words in Chrome where a phrase met a tag.
- **English is untouched:** `phrase(html, 'en')` returns the text as it is.
- **Languages by URL:** `/` is English and `/ja/...` Japanese; copy lives in typed files (`src/i18n/en.ts`, `ja.ts`) and the Japanese file has to match the English `Copy` type.

## Key code

```ts path=src/lib/phrase.ts
import { loadDefaultJapaneseParser } from 'budoux';
import type { Lang } from './site';

const parser = loadDefaultJapaneseParser();

export function phrase(html: string, lang: Lang): string {
  if (lang !== 'ja') return html;
  return html
    .split(/(<[^>]+>)/)
    .map((part) =>
      part.startsWith('<') || !part
        ? part
        : parser
            .parse(part)
            .map((p) => `<span class="ph">${p}</span>`)
            .join(''),
    )
    .join('');
}
```
