---
title: Himawari · Docs pages from a product repo
layer: ui-ux
origin: own-project
stack:
  - astro
feature:
  - docs
  - localization
status: proven
target: website
reuseNote: A product's documentation lives in its own repository and should appear on the website at the released version, in both languages.
liveSite:
  url: https://himawari-moekoworks.vercel.app/docs
  embeddable: false
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/components/pages/DocsPage.astro
  ref: 4eb655c
projectFile: himawari-website
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe of a docs page: a sidebar with Start and four groups (Tutorials, How-to guides, Reference, Explanation), the version line with a GitHub link, and the page's text with a plain code block"
screenshots:
  - file: screenshot-desktop.webp
    alt: "Screenshot of the Himawari docs home: the sidebar groups, the version line and the page"
  - file: screenshot-phone.webp
    alt: Phone screenshot of the Japanese docs home
related:
  - himawari-docs-import
  - himawari-budoux-phrases
usedIn:
  - Himawari Website
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

One page of the engine's docs at the released version (`DocsPage.astro`, `src/lib/docs.ts`), from Markdown the release sync copied in.

- **Sidebar:** a "Start" group first (pages that belong to no group), then four groups: Tutorials, How-to guides, Reference, Explanation.
- **Version line:** each page says which release it is for ("For Himawari 0.4.1") and links to "This page on GitHub".
- **Language fallback:** Japanese pages list their own first, then the English ones, marked.
- **Language switch:** goes to the same page in the other language when it exists, else that language's docs home.
- **Plain code blocks:** `markdown.syntaxHighlight: false`, because the default dark code theme failed contrast; ink on white passes.
- **Links already adapted:** docs links are site URLs and everything else in the engine repository points at GitHub at the released tag (`himawari-docs-import`).
