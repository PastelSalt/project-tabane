---
title: Kotoha · Signed Cloudinary uploads without an SDK
layer: backend
origin: own-project
stack:
  - node-js
  - javascript
  - cloudinary
feature:
  - uploads
  - gallery
status: proven
target: website
reuseNote: Admins upload images straight to Cloudinary from the browser, on the free plan, with the server still in control.
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: public/js/admin/gallery.js
  ref: 41d4bd8
projectFile: kotoha-fansite
diagrams:
  - id: system
    level: 1
    title: Gallery upload
    file: level-1-system.mmd
related:
  - kotoha-masonry-lightbox
  - kotoha-content-crud-archive
  - kotoha-admin-panel
usedIn:
  - Kotoha Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Images go straight from the admin's browser to Cloudinary with a server signature; the server then checks what actually arrived.

- **Shrink first** (`admin/gallery.js` `prepareFile`): images over Cloudinary's free limits (10 MB, 25 MP) are redrawn on a canvas as WebP, stepping quality and scale down up to six times; HEIC that the browser can't decode must already be small.
- **Signing without an SDK** (`lib/cloudinary.js`): `signParams` sorts `key=value` pairs, joins them with `&`, appends the secret and hashes with SHA-1; `signedUploadParams()` gives the browser a timestamp, folder, preset, tags and signature.
- **Upload:** an XHR upload with a progress bar.
- **Trust but verify:** the server checks the response signature (`verifyUploadResponse`), then asks Cloudinary's Admin API for the authoritative size, format and folder (`getResource`). Too big, wrong format or wrong folder → the file is destroyed and the request answers `422 UPLOAD_REJECTED`.
- **Delete:** `destroyImage` with CDN invalidation; the gallery row is archived as history.
- **Delivery:** `deliveryUrl` with `f_auto,q_auto,c_limit,w_<n>`; public tiles use 400 and 800 widths in `srcset`.

## Key code

```js path=public/js/admin/gallery.js
async function prepareFile(file) {
  let bitmap = null;
  try { bitmap = await createImageBitmap(file); } catch { /* e.g. HEIC outside Safari */ }
  if (!bitmap) {
    if (file.size > MAX_BYTES) throw new Error('heicTooBig');
    return { file, shrunk: false };
  }
  const pixels = bitmap.width * bitmap.height;
  if (file.size <= MAX_BYTES && pixels <= MAX_PIXELS) { bitmap.close(); return { file, shrunk: false }; }
  let scale = Math.min(1, Math.sqrt(MAX_PIXELS / pixels) * 0.98);
  let quality = 0.92;
  for (let attempt = 0; attempt < 6; attempt++) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', quality));
    if (blob && blob.size <= MAX_BYTES) {
      bitmap.close();
      return { file: new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' }), shrunk: true };
    }
    quality = Math.max(0.7, quality - 0.08);
    scale *= 0.85;
  }
  bitmap.close();
  throw new Error('tooBig');
}
```
