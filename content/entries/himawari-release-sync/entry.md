---
title: Himawari · Release sync at build
layer: backend
origin: own-project
stack:
  - typescript
  - astro
feature:
  - download
  - api
status: proven
target: website
reuseNote: A product site's download button and screenshots should follow the latest GitHub release by themselves, and survive GitHub being down at build time.
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: scripts/sync-release.ts
  ref: 4eb655c
projectFile: himawari-website
diagrams:
  - id: system
    level: 1
    title: Build
    file: level-1-system.mmd
related:
  - himawari-release-download
  - himawari-docs-import
usedIn:
  - Himawari Website
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

`sync-release.ts` runs before every build and makes the site follow the engine's latest release.

- **Reads** `releases/latest` and all releases of `PastelSalt/himawari-c`; finds the installer by name (`Himawari-Studio-Setup-*.exe`) and takes its SHA-256 from the asset's `digest` field.
- **Writes `src/data/release.json`:** tag, version, name, date, notes URL, installer (name, URL, bytes, sha256, downloads) and `history` (every non-draft, non-prerelease release with an installer). The file is committed and rewritten only when it changed.
- **Copies** three screenshots from the tagged source (`docs/images/`) and every `docs/**/*.md` from the tag's git tree, passing each through `adaptDoc` (`himawari-docs-import`).
- **All or nothing:** everything is downloaded first and written only once it has all arrived; if GitHub can't be reached the committed files stay and the build goes on. It fails only when there is no last known release at all.
- **Optional `GITHUB_TOKEN`:** only raises the API rate limit on shared build machines.
- **Helpers** (`site.ts`): `RELEASE`, `atTag(path)` for links pinned to the released tag, `releaseDate(lang)` in Manila time, `installerSize()` in MiB as Windows shows it.

## Key code

```ts path=scripts/sync-release.ts
const raw = (p: string) => get(`https://raw.githubusercontent.com/${REPO}/${r.tag_name}/${p}`);

  // Everything is downloaded first and written only once it has all arrived, so a failure halfway leaves the
  // last known files as they were.
  const shots = await Promise.all(
    SHOTS.map(async (f) => [f, Buffer.from(await (await raw(`docs/images/${f}`)).arrayBuffer())] as const),
  );
  // the docs at the released tag (Markdown only; they reference no images)
  const tree = (await (
    await get(`https://api.github.com/repos/${REPO}/git/trees/${r.tag_name}?recursive=1`)
  ).json()) as { tree: { path: string; type: string }[] };
  const docPaths = tree.tree.filter((t) => t.type === 'blob' && /^docs\/.+\.md$/.test(t.path));
  if (!docPaths.length) throw new Error(`no docs at ${r.tag_name}`);
  const docs = await Promise.all(
    docPaths.map(async (d) => [d.path, await (await raw(d.path)).text()] as const),
  );

  mkdirSync(SHOTS_DIR, { recursive: true });
  for (const [f, buf] of shots) writeFileSync(join(SHOTS_DIR, f), buf);
  rmSync(DOCS_DIR, { recursive: true, force: true });
  for (const [p, text] of docs) {
    const out = join(DOCS_DIR, p.slice('docs/'.length));
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, adaptDoc(text, p, `https://github.com/${REPO}/blob/${r.tag_name}`));
  }

  const before = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  const after = JSON.stringify(release, null, 2) + '\n';
  if (before !== after) writeFileSync(OUT, after);
  console.log(
    `release: ${release.version} (${release.publishedAt.slice(0, 10)}), ${release.history.length} versions, ${SHOTS.length} screenshots, ${docs.length} docs`,
  );
}

main().catch((e: unknown) => {
  if (!existsSync(OUT)) {
    console.error('release: could not read the latest release, and there is no last known one', e);
    process.exit(1);
  }
  console.warn(`release: could not read the latest release, keeping the last known values (${String(e)})`);
});
```
