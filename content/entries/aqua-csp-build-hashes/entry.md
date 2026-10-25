---
title: Aqua Iro · Build-time CSP hashes
layer: backend
origin: own-project
stack:
  - astro
  - vercel
feature:
  - security
status: proven
target: website
reuseNote: A static site keeps a strict script policy while still allowing its own inline scripts and the framework's hydration runtime.
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: scripts/csp-hash.ts
  ref: 616052f
projectFile: aqua-iro-archive
diagrams:
  - id: system
    level: 1
    title: Hashes at build
    file: level-1-system.mmd
related:
  - kotoha-security-headers
  - aqua-build-gates
usedIn:
  - Aqua Iro Archive
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

A strict `script-src` that still allows exactly the inline scripts the build produced.

- **After `astro build`:** `csp-hash.ts` reads every built HTML file, collects each executable inline `<script>` (the pre-paint preferences script plus Astro's island-hydration runtime), skips JSON and `ld+json`, hashes each with SHA-256, and rewrites `script-src` in `vercel.json`, replacing old hashes.
- **The pre-paint script must stay byte-identical**, or its hash changes.
- **Served from the committed file:** the live hashes match the committed `vercel.json`, so after changing an inline script or upgrading Astro, build locally and commit `vercel.json` (answer A4).
- **The rest of the policy:** `script-src 'self'` + the hashes + Turnstile and YouTube hosts, `frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'`, `upgrade-insecure-requests`; HSTS with preload, `nosniff`, a Permissions-Policy; CSRF by Astro's `checkOrigin`.

## Key code

```ts path=scripts/csp-hash.ts
const hashes = new Set<string>();
for (const file of walk(ROOT)) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1] ?? '';
    const body = m[2] ?? '';
    if (/\ssrc=/.test(attrs) || !body.trim()) continue;
    const type = /type="([^"]+)"/.exec(attrs)?.[1];
    if (type && !['module', 'text/javascript', 'application/javascript'].includes(type)) continue; // JSON/ld+json are not executed
    hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
}
if (!hashes.size) throw new Error('no inline scripts found — did the build run?');
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
let n = 0;
for (const h of vercel.headers)
  for (const kv of h.headers) {
    if (kv.key !== 'Content-Security-Policy') continue;
    kv.value = kv.value.replace(/script-src [^;]*/, (src: string) => {
      const kept = src.split(' ').filter((t: string) => !t.startsWith("'sha256-"));
      return [kept[0], kept[1], ...hashes, ...kept.slice(2)].join(' ');
    });
    n++;
  }
writeFileSync('vercel.json', JSON.stringify(vercel, null, 2) + '\n');
```
