---
title: Himawari · Sessions, lockout and password policy (TypeScript)
layer: backend
origin: own-project
stack:
  - typescript
  - argon2
  - drizzle
feature:
  - auth
status: proven
target: website
reuseNote: "A single-owner admin needs safe sign-in in TypeScript with Drizzle: hashed sessions, lockout, timing safety and a password policy that checks leaks."
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/server/auth.ts
  ref: 4eb655c
projectFile: himawari-website
diagrams:
  - id: system
    level: 1
    title: Sessions and passwords
    file: level-1-system.mmd
related:
  - kotoha-admin-auth
  - aqua-keeper-auth-totp
  - himawari-scriptless-admin
usedIn:
  - Himawari Website
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

Kotoha's admin auth design, rewritten in TypeScript with Drizzle (`auth.ts`, `password.ts`). The env bootstrap of the first owner is in `himawari-scriptless-admin`.

- **Sessions:** a 32-byte random token, only its SHA-256 stored; cookie `__Host-hws_admin` (`hws_admin_dev` over plain http, since `__Host-` cookies need HTTPS), httpOnly, `SameSite=Strict`; ends after 2 idle hours or 7 days; `last_seen_at` refreshed at most every 5 minutes.
- **Throttling:** failures counted per daily-salted IP hash over 15 minutes (5 for one username, 20 in total); 5 wrong passwords lock the account for 15 minutes; unknown usernames burn a dummy Argon2 verify so timing doesn't reveal accounts.
- **Hashing:** Argon2id at the OWASP baseline (19 MiB, 2 iterations, 1 lane).
- **Password policy:** 12–128 characters; rejects passwords containing the username, the same as the current one, or made **only** of guessable site words (a word-break check over a list: himawari, studio, sunflower, moeko, password, admin…).
- **Leak check:** Have I Been Pwned's k-anonymity range check with padding and a 3 s timeout; only the first 5 hex characters of the SHA-1 leave the server, and an unreachable service doesn't block.
- **Changing the password** signs out every browser and returns a fresh session for this one.
- **Retention:** sign-in attempts deleted after 30 days, ended sessions after 7 (the daily cron).

## Key code

```ts path=src/server/password.ts
function onlyGuessableWords(letters: string): boolean {
  if (!letters) return true;
  // word-break DP: can `letters` be split entirely into GUESSABLE_WORDS?
  const ok = new Array<boolean>(letters.length + 1).fill(false);
  ok[0] = true;
  for (let i = 1; i <= letters.length; i++) {
    for (const w of GUESSABLE_WORDS) {
      if (w.length <= i && ok[i - w.length] && letters.slice(i - w.length, i) === w) {
        ok[i] = true;
        break;
      }
    }
  }
  return ok[letters.length]!;
}

/**
 * Have I Been Pwned's k-anonymity range check: only the first 5 hex characters of the SHA-1 leave the server.
 * true (leaked), false (not found), or null (service unreachable: the caller doesn't block on it).
 */
export async function isLeakedPassword(
  plain: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean | null> {
  const sha1 = createHash('sha1').update(String(plain)).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  try {
    const res = await fetchImpl(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true', 'User-Agent': 'himawari-website' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const body = await res.text();
    return body.split('\n').some((line) => {
      const [hashSuffix, count] = line.trim().split(':');
      return hashSuffix === suffix && Number(count) > 0;
    });
  } catch {
    return null;
  }
}
```
