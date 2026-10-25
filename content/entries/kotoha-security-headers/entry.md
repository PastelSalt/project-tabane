---
title: Kotoha · CSP, SRI and no inline scripts
layer: backend
origin: own-project
stack:
  - javascript
  - vercel
feature:
  - security
status: proven
target: website
reuseNote: A static site wants a strict Content Security Policy without computing script hashes, and safe CDN libraries.
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: vercel.json
  ref: 41d4bd8
projectFile: kotoha-fansite
diagrams:
  - id: system
    level: 1
    title: Headers on every response
    file: level-1-system.mmd
related:
  - kotoha-grouped-functions
  - kotoha-sparkles-confetti
usedIn:
  - Kotoha Fan Site
  - Hanon Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Security headers set once in `vercel.json`, made simple by one rule: no inline scripts anywhere.

- **CSP:** `default-src 'self'`; scripts only from self, cdnjs and jsdelivr; styles from self, inline, Google Fonts and the CDNs; images from self, data, blob, `i.ytimg.com` and `res.cloudinary.com`; connect to self and `api.cloudinary.com`; frames only `youtube-nocookie.com`; `object-src 'none'`; `frame-ancestors 'none'`.
- **No inline scripts:** pre-paint logic lives in tiny classic files (`motion-boot.js`, `prepaint.js`), so the policy needs no hashes or nonces. Inline styles are allowed.
- **Subresource Integrity:** every CDN script and stylesheet is pinned (sha256 or sha384); confetti is injected later with its integrity attribute. Google Fonts CSS is the one exception, because it differs per browser.
- **Other headers:** `X-Frame-Options: DENY`, `nosniff`, `strict-origin-when-cross-origin`, a Permissions-Policy turning off camera, microphone, geolocation, payment and USB, HSTS for two years.
- **Admin and API:** `X-Robots-Tag: noindex, nofollow`; admin and login pages `no-store`.
- **Caching:** `/assets/` 7 days + a day stale; locales 5 minutes + an hour stale; CSS and JS keep default revalidation because their file names aren't versioned.
