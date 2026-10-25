---
title: Himawari · Script-free admin panel
layer: backend
origin: own-project
stack:
  - astro
  - neon-postgres
feature:
  - admin-panel
  - security
status: proven
target: website
reuseNote: "A small admin panel on a static site with a strict CSP: on-demand pages, plain forms, no scripts, and an owner created from environment values on first sign-in."
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/server/admin.ts
  ref: 4eb655c
projectFile: himawari-website
diagrams:
  - id: system
    level: 1
    title: Admin panel
    file: level-1-system.mmd
  - id: sign-in
    level: 2
    parent: system
    expands: login
    title: Sign-in
    file: level-2-sign-in.mmd
related:
  - kotoha-admin-panel
  - aqua-keeper-panel
  - himawari-admin-auth
  - himawari-db-news-static
  - himawari-server-charts
usedIn:
  - Himawari Website
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

The admin panel at `/admin`: overview (news list and recent activity), news editor, statistics, password, sign-in and sign-out.

- **No scripts at all:** admin pages are rendered on demand, so their inline scripts couldn't be hashed into the CSP that is computed from the static build. Forms are plain HTML posts guarded by Astro's `checkOrigin`; charts are drawn on the server (`himawari-server-charts`).
- **`requireAdmin()`** returns the database and session, or redirects to the sign-in page, or to the password page while the temporary password is still in use.
- **Owner from environment values on first sign-in:** when no account exists and the username and password match `ADMIN_USERNAME` / `ADMIN_TEMP_PASSWORD` (compared in constant time), the account is created with `must_change_password`. Once an account exists those values are ignored, so the temporary password stops working the moment it's replaced; the README says to delete them afterwards. (Kotoha used a bootstrap script instead.)
- **Client IP** from `x-forwarded-for` (then `x-real-ip`), because `clientAddress` throws on this adapter; only ever stored hashed.
- **Never cached or indexed:** `vercel.json` adds `no-store` and `noindex` to `/admin` and `/api`. Times are shown in Manila time.
- **Look:** `admin.css` reuses the site's tokens and buttons with a small header, no decoration.

## Key code

```ts path=src/server/admin.ts
/**
 * The signed-in owner, or a redirect: to the sign-in page when signed out, and to the password page while the
 * temporary password is still in use (unless this is the password page).
 */
export async function requireAdmin(
  Astro: AstroGlobal,
  { allowPasswordChange = false } = {},
): Promise<AdminContext | Response> {
  if (!databaseReady()) return Astro.redirect('/admin/login');
  const session = await getSession(db(), sessionToken(Astro));
  if (!session) return Astro.redirect('/admin/login');
  if (session.user.mustChangePassword && !allowPasswordChange) return Astro.redirect('/admin/password');
  return { db: db(), session };
}

// src/server/auth.ts, in login()
  if (!user) {
    // the first sign-in: create the owner from the env values, once
    const [{ n } = { n: 0 }] = await db.select({ n: count() }).from(schema.adminUsers);
    const b = input.bootstrap;
    const bootUser = (b.username ?? '').trim().toLowerCase();
    if (
      n === 0 &&
      bootUser &&
      b.tempPassword &&
      /^[a-z0-9_.-]{3,40}$/.test(bootUser) &&
      sameSecret(username, bootUser) &&
      sameSecret(password, b.tempPassword)
    ) {
      [user] = await db
        .insert(schema.adminUsers)
        .values({ username: bootUser, passwordHash: await hashPassword(password), mustChangePassword: true })
        .returning();
      await logActivity(db, bootUser, 'account.created_from_env');
    } else {
      await burnVerifyTime(password);
      await attempt(false);
      return { ok: false, error: 'invalid' };
    }
  }
```
