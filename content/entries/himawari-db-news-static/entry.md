---
title: Himawari · Database news on a static site
layer: backend
origin: own-project
stack:
  - astro
  - neon-postgres
  - drizzle
feature:
  - admin-panel
  - database
status: proven
target: website
reuseNote: A static site's news is edited in an admin panel and stored in a database, then baked into the pages by a rebuild.
repository:
  name: PastelSalt/himawari-website
  url: https://github.com/PastelSalt/himawari-website
codeLocation:
  path: src/lib/news-loader.ts
  ref: 4eb655c
projectFile: himawari-website
diagrams:
  - id: system
    level: 1
    title: Publishing news
    file: level-1-system.mmd
related:
  - kotoha-content-crud-archive
  - himawari-scriptless-admin
usedIn:
  - Himawari Website
shared: false
created: 2026-10-25
updated: 2026-10-25
---

## Technical details

News is edited in `/admin`, stored in Neon, and pulled in at build time by a custom Astro content loader.

- **The loader** (`news-loader.ts`): with `DATABASE_URL` (every Vercel build) it reads published rows from `news_posts` and stores one entry per language that has a title, summary and body (`en/<slug>`, `ja/<slug>`), rendering the Markdown body. Without it (local builds, CI) the Markdown files in `src/content/news` stand in.
- **Fails rather than goes stale:** if the database is configured but can't be read, the build fails instead of publishing out-of-date news; Vercel keeps the last good deployment live.
- **Editor form** (`NewsForm`, Zod): slug (lowercase, single hyphens), date, category (`Release` or `Announcement`), optional `https://` link, English title, summary and body required, Japanese all three or none.
- **Save, publish, unpublish, delete** write `activity_log` rows. Any change to what's public calls the Vercel deploy hook (8 s timeout) and the page shows one of three notes: rebuilding (live in about two minutes), no hook set, or rebuild failed.
- **Bigint arrives as a string** from Neon: `Number(r.id)`.
- **One source:** `0002_seed_news.sql` moved the two Markdown release posts into the database "so all news is edited in the admin panel".

## Key code

```ts path=src/lib/news-loader.ts
export function newsLoader(): Loader {
  return {
    name: 'himawari-news',
    load: async (ctx) => {
      const url = process.env.DATABASE_URL;
      if (!url) {
        ctx.logger.info('no DATABASE_URL: news from src/content/news');
        return markdown.load(ctx);
      }
      const rows = (await neon(url)`
        select id, slug, posted_on::text, category, link, title_en, summary_en, body_en, title_ja, summary_ja, body_ja
        from news_posts where status = 'published'`) as Row[];
      ctx.store.clear();
      for (const r of rows) {
        for (const lang of ['en', 'ja'] as const) {
          const title = lang === 'en' ? r.title_en : r.title_ja;
          const summary = lang === 'en' ? r.summary_en : r.summary_ja;
          const body = lang === 'en' ? r.body_en : r.body_ja;
          if (!title || !summary || !body) continue;
          const id = `${lang}/${r.slug}`;
          const data = await ctx.parseData({
            id,
            data: {
              title,
              summary,
              date: r.posted_on,
              category: r.category,
              link: r.link ?? undefined,
              seq: Number(r.id), // bigint arrives as a string
            },
          });
          ctx.store.set({
            id,
            data,
            body,
            rendered: await ctx.renderMarkdown(body),
            digest: ctx.generateDigest({ data, body }),
          });
        }
      }
      ctx.logger.info(`${rows.length} published posts from the database`);
    },
  };
}

// src/server/news.ts
export async function triggerRebuild(
  hookUrl: string | undefined,
  fetchImpl: typeof fetch = fetch,
): Promise<RebuildResult> {
  if (!hookUrl) return 'no_hook';
  try {
    const res = await fetchImpl(hookUrl, { method: 'POST', signal: AbortSignal.timeout(8000) });
    return res.ok ? 'started' : 'failed';
  } catch {
    return 'failed';
  }
}
```
