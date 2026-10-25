---
title: Himawari · Product home page layout
layer: ui-ux
origin: own-project
stack:
  - astro
feature:
  - layout
status: proven
target: website
reuseNote: "A free product (an app, a tool, an engine) needs one long home page that answers a visitor's questions in order: what, why, how it looks, download, learn, news, help."
liveSite:
  url: https://himawari-moekoworks.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/components/home/HomePage.astro
  ref: 4eb655c
projectFile: himawari-website
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe of the home page order: news bar, hero with a Studio window, three promise cards, feature rows, a black coming-soon band, download, learn cards, news rows and a FAQ list"
  phone:
    file: wireframe-phone.svg
    alt: "Phone wireframe of the home page lower half: download block, learn cards, news rows and the FAQ as expandable questions"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the Himawari home page's promise cards and feature rows
  - file: screenshot-phone.webp
    alt: Phone screenshot of the Himawari home page's FAQ
related:
  - himawari-nav-panels
  - himawari-live-app-hero
  - himawari-release-download
usedIn:
  - Himawari Website
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

One long home page with anchored sections, each a component in `src/components/home/`.

- **Order:** news bar → hero (with a live Studio window) → three promises (About) → features → a black "coming soon" band → download → Learn → news → FAQ → Get involved. Small flower ornaments sit between sections.
- **News bar:** a yellow speech bubble with the latest post and a bobbing white flower.
- **Promise cards:** thin border, duotone icon.
- **Feature rows:** kicker with icon, heading, paragraph, a list with yellow markers, and a visual: a real Studio screenshot in a window frame (refreshed from the release by the build), or real script. Cards without screenshots say nothing is drawn rather than faking art.
- **Coming-soon band:** the page's one dark moment; flowers fall behind it, CSS only, positions fixed at build. No dates or names for the coming visual novel "until the owner announces them".
- **News rows:** icon tile, title, "date | category", one line.
- **FAQ:** native `<details>`, each with an address `#faq-n`; a link to one question opens it, also on `hashchange`.
- **Both languages:** `HomePage.astro` renders either language; `src/pages/ja/index.astro` is a thin wrapper.
