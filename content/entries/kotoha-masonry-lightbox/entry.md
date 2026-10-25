---
title: Kotoha · Masonry gallery with growing lightbox
layer: ui-ux
origin: own-project
stack:
  - javascript
  - css
feature:
  - gallery
status: proven
target: website
reuseNote: A fan-art or photo gallery with mixed aspect ratios, credits, endless loading and a lightbox that grows out of the picture.
liveSite:
  url: https://kotoha-fansite.vercel.app/
  embeddable: false
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/public/gallery.js
  ref: 41d4bd8
projectFile: kotoha-fansite
wireframe:
  desktop:
    file: wireframe.svg
    alt: "Wireframe: four masonry columns of images with different heights and credit lines, a Load more button, and a note that the lightbox grows out of the tile"
screenshots:
  - file: screenshot-desktop.webp
    alt: Screenshot of Kotoha's masonry gallery
  - file: screenshot-lightbox.webp
    alt: Screenshot of Kotoha's gallery lightbox open on one artwork
related:
  - kotoha-cloudinary-uploads
  - kotoha-footer-credits
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
lastChecked: 2026-10-25
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

A JavaScript masonry gallery with credits on every tile and a native-dialog lightbox whose image grows out of its tile.

- **Masonry without layout reads:** 2–5 columns by container width; each image goes into the shortest column using its stored aspect ratio, so placing never waits for images to load.
- **Endless + button:** a sentinel 600 px before the end loads the next page; a "Load more" button does the same for keyboards. A `ResizeObserver` re-lays out only when the column count changes.
- **Tiles** (`galleryTile`): Cloudinary URLs at 400/800 widths in `srcset`, the artist credit linking to the source (tracked), unknown artists labelled as such.
- **Lightbox:** a native `<dialog>` with `showModal()`: focus is trapped, Escape closes, arrow keys and buttons move, and stepping near the end preloads the next page.
- **Growing open:** a View Transition gives the thumbnail and the big image the same temporary `view-transition-name`, so the artwork grows out of its tile. Calm mode or no View Transitions: it simply opens.

## Key code

```js path=public/js/public/gallery.js
function openLightbox(index, tile) {
  current = index;
  const dlg = document.getElementById('lightbox');
  if (dlg.open) { fillLightbox(); return; }
  const pic = document.getElementById('lightbox-img');
  const thumb = tile?.querySelector('img');
  const show = async () => {
    fillLightbox();
    dlg.classList.add('no-anim');
    dlg.showModal();
    await pic.decode().catch(() => {});
  };
  if (!document.startViewTransition || isCalm() || !thumb) { dlg.classList.remove('no-anim'); show(); return; }
  thumb.style.viewTransitionName = 'artwork';
  const vt = document.startViewTransition(async () => {
    thumb.style.viewTransitionName = '';
    pic.style.viewTransitionName = 'artwork';
    await show();
  });
  vt.finished.finally(() => { pic.style.viewTransitionName = ''; dlg.classList.remove('no-anim'); });
}
```
