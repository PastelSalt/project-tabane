---
title: Himawari · Docs import with link adaptation
layer: backend
origin: own-project
stack:
  - typescript
feature:
  - docs
status: proven
target: website
reuseNote: Another repository's Markdown docs, at a release tag, become site pages with their links rewritten and their code untouched.
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/lib/doc-links.ts
  ref: 4eb655c
projectFile: himawari-website
diagrams:
  - id: system
    level: 1
    title: Docs import
    file: level-1-system.mmd
related:
  - himawari-docs-pages
  - himawari-release-sync
usedIn:
  - Himawari Website
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

`adaptDoc()` rewrites each docs file once, as the release sync copies it in (`doc-links.ts`).

- **URLs:** `docs/how-to/x.md` → `/docs/how-to/x`; `docs/ja/…` → `/ja/docs/…`; `index` drops out.
- **Links:** relative links to other docs pages become site URLs; links to anything else in the engine repository (the spec, the policies) point at GitHub at the released tag; absolute links and anchors are left alone.
- **Emoji removed** (the site never shows them), but not ©, ® and ™.
- **Code untouched:** fenced blocks and inline code spans keep their exact text.

## Key code

```ts path=src/lib/doc-links.ts
/** A link in the docs file at `from` (a repo path such as docs/how-to/x.md), as the site should show it. */
export function resolveDocHref(href: string, from: string, blob: string): string {
  if (/^([a-z]+:|#|\/)/i.test(href)) return href;
  const [target = '', hash] = href.split('#');
  const resolved = posix.normalize(posix.join(posix.dirname(from), target));
  const tail = hash ? `#${hash}` : '';
  if (resolved.startsWith('docs/') && resolved.endsWith('.md')) return docUrl(resolved) + tail;
  return `${blob}/${resolved}${tail}`;
}

/** Rewrites the inline links and drops the emoji of one docs file. Code spans and blocks are left alone. */
export function adaptDoc(markdown: string, from: string, blob: string): string {
  let fenced = false;
  return markdown
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fenced = !fenced;
        return line;
      }
      if (fenced) return line;
      // split around inline code so `examples` keep their exact text
      return line
        .split(/(`[^`]*`)/)
        .map((part) =>
          part.startsWith('`')
            ? part
            : part
                .replace(/\]\(([^)\s]+)\)/g, (_, href: string) => `](${resolveDocHref(href, from, blob)})`)
                .replace(EMOJI, '')
                .replace(/^(#+) +/, '$1 '),
        )
        .join('');
    })
    .join('\n');
}
```
