---
title: Aqua Iro · Single-admin auth with forced TOTP
layer: backend
origin: own-project
stack:
  - better-auth
  - astro
feature:
  - auth
status: proven
target: website
reuseNote: One admin signs in with a passphrase and a mandatory authenticator code, with no sign-up page and alerts on every sign-in.
repository:
  name: PastelSalt/aqua-iro-archive
  url: https://github.com/PastelSalt/aqua-iro-archive
codeLocation:
  path: src/middleware.ts
  ref: 616052f
projectFile: aqua-iro-archive
diagrams:
  - id: system
    level: 1
    title: Keeper sign-in
    file: level-1-system.mmd
  - id: middleware
    level: 2
    parent: system
    expands: guard
    title: Middleware
    file: level-2-middleware.mmd
related:
  - aqua-keeper-panel
  - aqua-moderation-audit
  - kotoha-admin-auth
  - himawari-admin-auth
usedIn:
  - Aqua Iro Archive
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Better Auth configured for exactly one admin (the "keeper"), with two-factor enforced in middleware.

- **No sign-up:** the app never allows it; the keeper is created once from the command line (`scripts/create-admin.ts`, passphrase typed in, never stored). The first sign-in forces TOTP enrollment.
- **Passphrase:** 14–256 characters. **Sessions:** 7 days, refreshed daily; secure cookies with the prefix `aia-keeper`.
- **Rate limits in the database:** sign-in 5 per 10 minutes, two-factor 10 per 10 minutes.
- **Two-factor:** the `twoFactor` plugin; the QR code is drawn with `uqr`; `scripts/reset-2fa.ts` is the runbook for lost backup codes and writes an audit row.
- **Sign-in hook:** logs `login` or `login_failed` with the country and the first two IP octets; a Discord alert on each successful step, and when failures reach 5 in an hour.
- **Middleware guard:** `/keeper` (except sign-in and two-factor pages), `/api/admin` and `/_actions/keeper.*` need a session **and** `twoFactorEnabled`; keeper pages redirect, APIs answer 401 or 403; every keeper response is `no-store` and `noindex`. Keeper actions check again inside each handler.

## Key code

```ts path=src/middleware.ts
export const onRequest = defineMiddleware(async (ctx, next) => {
  if (ctx.isPrerendered) return next();
  const p = ctx.url.pathname;
  const isKeeperPage = p.startsWith('/keeper');
  const open = p.startsWith('/keeper/login') || p.startsWith('/keeper/two-factor');
  const needsAdmin =
    (isKeeperPage && !open) || p.startsWith('/api/admin') || p.startsWith('/_actions/keeper.');
  const needsSession = p.startsWith('/keeper/two-factor/setup');
  if (needsAdmin || needsSession) {
    const { auth } = await import('./server/auth');
    const s = await auth().api.getSession({ headers: ctx.request.headers });
    if (!s)
      return isKeeperPage ? ctx.redirect('/keeper/login') : new Response('Unauthorized', { status: 401 });
    const user = s.user as { id: string; email: string; name: string; twoFactorEnabled?: boolean | null };
    if (needsAdmin && !user.twoFactorEnabled)
      return isKeeperPage
        ? ctx.redirect('/keeper/two-factor/setup')
        : new Response('2FA required', { status: 403 });
    ctx.locals.admin = user;
  }
  const res = await next();
  if (isKeeperPage || p.startsWith('/api/admin')) {
    res.headers.set('Cache-Control', 'no-store');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return res;
});
```
