---
title: "Kotoha · Admin auth: Argon2id, sessions, lockout"
layer: backend
origin: own-project
stack:
  - node-js
  - neon-postgres
  - argon2
feature:
  - auth
  - security
status: proven
target: website
reuseNote: A small site needs its own admin sign-in that resists guessing and leaks, with an owner who creates admins.
repository:
  name: PastelSalt/kotoha-fansite
  url: https://github.com/PastelSalt/kotoha-fansite
codeLocation:
  path: lib/password.js
  ref: 41d4bd8
projectFile: kotoha-fansite
diagrams:
  - id: system
    level: 1
    title: Sign-in
    file: level-1-system.mmd
  - id: password-policy
    level: 2
    parent: system
    expands: change
    title: Password policy
    file: level-2-password-policy.mmd
  - id: sessions
    level: 2
    parent: system
    expands: session
    title: Sessions
    file: level-2-sessions.mmd
related:
  - kotoha-admin-panel
  - kotoha-content-crud-archive
usedIn:
  - Kotoha Fan Site
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

A complete admin sign-in without an auth service.

- **Passwords:** Argon2id at the OWASP baseline (19 MiB, 2 iterations, 1 lane). Policy: 12–128 characters, not containing the username, different from the current one, and not made **only** of guessable site words (a word-break check over a blocklist such as kotoha, clover, password, admin). Then Have I Been Pwned's k-anonymity range (only five hex characters leave the server; if it can't be reached, it doesn't block).
- **Unknown users:** a dummy Argon2 verify (`burnVerifyTime`), so timing doesn't reveal which usernames exist.
- **Throttling:** failed attempts per (IP hash, username) ≤ 5 and per IP hash ≤ 20 in 15 minutes; 5 wrong passwords lock the account for 15 minutes. IPs are stored only as salted hashes.
- **Sessions:** 32 random bytes as base64url in a `__Host-kf_session` cookie (HttpOnly, SameSite=Strict, Secure; a plain name on http localhost); only the SHA-256 is stored; 2-hour idle and 7-day absolute expiry; `last_seen_at` touched at most every 5 minutes.
- **Guards:** `requireAdmin(req, { allowPasswordChange, ownerOnly })` → 401, `403 PASSWORD_CHANGE_REQUIRED` or `403 FORBIDDEN`.
- **Accounts:** exactly one Owner (unique partial index), bootstrapped by `scripts/admin-bootstrap.js`; the Owner creates admins with numbered usernames and 8-character temporary passwords (no look-alike characters, valid 7 days, shown once); reset revokes sessions; removal deactivates and archives a snapshot without the hash. Changing a password signs out every other device.

## Key code

```js path=lib/password.js
function onlyGuessableWords(letters) {
  if (!letters) return true;
  // Word-break DP: can `letters` be split entirely into GUESSABLE_WORDS?
  const ok = new Array(letters.length + 1).fill(false);
  ok[0] = true;
  for (let i = 1; i <= letters.length; i++) {
    for (const w of GUESSABLE_WORDS) {
      if (w.length <= i && ok[i - w.length] && letters.slice(i - w.length, i) === w) {
        ok[i] = true;
        break;
      }
    }
  }
  return ok[letters.length];
}

export async function isLeakedPassword(plain) {
  const sha1 = createHash('sha1').update(String(plain)).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true', 'User-Agent': 'kotoha-fansite' },
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
