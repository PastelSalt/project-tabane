---
title: Himawari · Hover/focus nav panels and popover menu
layer: ui-ux
origin: own-project
stack:
  - astro
  - css
feature:
  - navigation
status: proven
target: website
reuseNote: A site's top navigation shows rich panels (download, latest posts, FAQ) on hover and keyboard focus, and a phone menu that needs no script.
liveSite:
  url: https://himawari-moekoworks.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/components/chrome/Header.astro
  ref: 4eb655c
projectFile: himawari-website
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: the sticky nav row with DOWNLOAD focused and its panel open below: the download button with version, date and size, and links to notes and earlier versions"
  phone:
    file: wireframe-phone.svg
    alt: "Phone wireframe: the yellow menu button and the native popover menu with a close button, the sections in capitals and a link to the other language"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of the Himawari nav row with the DOWNLOAD panel open under it
  - file: screenshot-phone.webp
    alt: Phone screenshot of the Himawari menu open as a popover
related:
  - himawari-product-home
  - aqua-bottom-dock
  - kotoha-nav-pill-circle-menu
usedIn:
  - Himawari Website
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The header, a sticky nav row with panels on wide screens, and a native popover menu on phones (`Header.astro`, `NavPanel.astro`, `global.ts`).

- **Header:** logo, `EN / 日本語`, a MOTION ON/OFF pill (`aria-pressed`), GitHub and contact icon buttons.
- **Sticky nav row:** "HIMAWARI", a thin rule, and the home sections; on the home page the links are anchors, elsewhere they go to `/#section`.
- **Panels, opened by CSS:** DOWNLOAD, LEARN, NEWS and FAQ open a panel under the bar **on hover or keyboard focus**. They hold the download button with its meta and links, five "learn" cards, the latest three posts, or the seven questions.
- **Dismissible (WCAG 1.4.13):** Escape closes the open one and returns focus to its link, and choosing a link closes it too (`is-dismissed`); it can open again once the pointer or focus has left.
- **Phone menu:** a yellow button with `popovertarget`, a native popover that needs no script to open or close; choosing a link hides it. It lists the sections in English capitals (on the Japanese pages with the Japanese name under each) and a link to the other language.

## Key code

```ts path=src/scripts/global.ts
// ---- the panels under the navigation (NavPanel.astro): CSS opens them on hover and focus. Escape closes the one
// that's open (content shown on hover must be dismissible, WCAG 1.4.13), and so does choosing a link in it. It can
// open again once the pointer or focus has left.
const items = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-item]'));
const dismiss = (item: HTMLElement, refocus: boolean) => {
  item.classList.add('is-dismissed');
  if (refocus && item.contains(document.activeElement))
    item.querySelector<HTMLElement>('.nav__link')?.focus();
};
for (const item of items) {
  const reset = () => item.classList.remove('is-dismissed');
  item.addEventListener('pointerleave', reset);
  item.addEventListener('focusout', (e) => {
    if (!item.contains(e.relatedTarget as Node | null)) reset();
  });
  for (const a of item.querySelectorAll('[data-panel-link]'))
    a.addEventListener('click', () => {
      dismiss(item, false);
      (document.activeElement as HTMLElement | null)?.blur();
    });
}
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  // the one keyboard focus is in, else the one under the pointer
  const open =
    items.find((i) => i.contains(document.activeElement)) ?? items.find((i) => i.matches(':hover'));
  if (open) dismiss(open, true);
});
```
