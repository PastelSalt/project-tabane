---
title: Kotoha · Floating nav pill and circle-reveal menu
layer: ui-ux
origin: own-project
stack:
  - html
  - css
  - javascript
feature:
  - navigation
status: proven
target: website
reuseNote: A one-page site needs a compact floating nav with language and motion controls, and a phone menu that feels special.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/public/main.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: a floating pill nav with logo, links, language and motion controls over the page"
  phone:
    file: wireframe-phone.svg
    alt: "Phone wireframe: the full-screen menu opened as a circle, with big links and the language switch"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's floating nav pill above Home
  - file: screenshot-phone.webp
    alt: Phone screenshot of Kotoha's full-screen menu
related:
  - kotoha-bilingual-i18n
  - kotoha-motion-calm-mode
usedIn:
  - Kotoha Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

A floating pill nav on wide screens and a full-screen menu on phones that opens as a circle growing from the menu button.

- **Pill nav:** logo, section links with a sliding active marker (`markNav` follows the active section), JP/EN switch, motion toggle, and a small scroll-progress icon that fills as you read (`setupNavProgress`).
- **Phone menu** (`setupMenu`): the menu button opens `#mobile-menu` (`role="dialog"`, `aria-modal`) with a circular clip-path growing from the button; focus is trapped inside, Escape and every link close it, and it closes itself when the window grows past the phone breakpoint. The page behind is `inert` and scroll-locked (`lockScroll` with `scrollbar-gutter: stable`, so nothing shifts).
- **In-page links** glide with `scrollIntoView` (instant in calm mode) and update the hash.
- Both menus carry the JP/EN switch (`mountLangSwitches`), whose sliding highlight is pure CSS (`data-active`).
