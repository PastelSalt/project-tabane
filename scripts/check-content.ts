// The content check (PHASE-2.md step 3). Reads every entry and playbook in content/ and content-samples/ and lists
// every problem, so a bad file never reaches the site. Runs as `npm run check:content` and before every build.
// Usage: tsx scripts/check-content.ts [root …]   (default: content content-samples)

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { listContent, readEntry, readPlaybook, sections, splitFrontMatter } from "../src/lib/content";
import { layers, origins, playbookKinds, playbookStatuses, statuses, tagsFile, targets } from "../src/lib/tags";
import type { Entry, Playbook } from "../src/lib/types";

const problems: string[] = [];
const problem = (where: string, what: string) => problems.push(`${where}: ${what}`);

// ---------- tags.yml ----------

const VALUE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const fixed: Record<string, Record<string, string>> = {
  layer: layers,
  origin: origins,
  status: statuses,
  target: targets,
  playbookKind: playbookKinds,
  playbookStatus: playbookStatuses,
};
for (const name of [...Object.keys(fixed), "stack", "feature"]) {
  const list = tagsFile[name];
  if (!list?.label || !list.values) {
    problem("content/tags.yml", `"${name}" needs a label and values`);
    continue;
  }
  for (const value of Object.keys(list.values)) if (!VALUE.test(value)) problem("content/tags.yml", `${name} value "${value}" must be lowercase words joined by hyphens`);
  if (fixed[name] && JSON.stringify(list.values) !== JSON.stringify(fixed[name])) {
    problem("content/tags.yml", `"${name}" must match the fixed list in src/lib/tags.ts`);
  }
}
const allowed = (name: string) => Object.keys(tagsFile[name]?.values ?? {}) as [string, ...string[]];
/** A value from one of the tags.yml lists. */
const tag = (name: string) => z.enum(allowed(name), { message: `not a value in content/tags.yml → ${name}` });

// ---------- schemas (front matter as written) ----------

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "a date as YYYY-MM-DD");
const str = z.string().trim().min(1);
const fileRef = z.union([str, z.object({ file: str, alt: str.optional() }).strict()]);
const url = z.string().url().refine((u) => u.startsWith("https://"), "must start with https://");
const slugs = z.array(z.string().regex(VALUE, "a slug (lowercase words joined by hyphens)"));

const EntryFront = z
  .object({
    title: str,
    layer: tag("layer"),
    origin: tag("origin"),
    stack: z.array(tag("stack")).min(1),
    feature: z.array(tag("feature")).min(1),
    status: tag("status"),
    target: tag("target"),
    reuseNote: str,
    liveSite: z.object({ url, embeddable: z.boolean() }).strict().optional(),
    repository: z.object({ name: str, url }).strict().optional(),
    codeLocation: z.object({ path: str, ref: z.union([str, z.number()]) }).strict().optional(),
    sourceAndLicense: str.optional(),
    projectFile: z.string().regex(VALUE).optional(),
    wireframe: z.object({ desktop: fileRef.optional(), phone: fileRef.optional() }).strict().optional(),
    screenshots: z.array(fileRef).optional(),
    clip: z.object({ file: str, poster: str.optional() }).strict().optional(),
    diagrams: z
      .array(
        z
          .object({
            id: z.string().regex(VALUE),
            level: z.number().int().min(1),
            parent: z.string().optional(),
            expands: z.string().optional(),
            title: str,
            file: z.string().regex(/\.mmd$/, "a .mmd file"),
          })
          .strict(),
      )
      .optional(),
    related: slugs,
    usedIn: z.array(str),
    shared: z.boolean(),
    lastChecked: date.optional(),
    created: date,
    updated: date,
  })
  .strict();

const PlaybookFront = z
  .object({
    title: str,
    kind: tag("playbookKind"),
    goal: str,
    basedOn: z
      .object({ entries: slugs, sites: z.array(z.object({ label: str, url }).strict()) })
      .strict(),
    status: tag("playbookStatus"),
    target: tag("target"),
    lastVerified: date.optional(),
    projectFile: z.string().regex(VALUE).optional(),
  })
  .strict();

const zodProblems = (where: string, error: z.ZodError) =>
  error.issues.forEach((issue) => problem(where, `${issue.path.join(".") || "front matter"}: ${issue.message}`));

// ---------- per root ----------

function checkRoot(root: string) {
  const real = root === "content";
  const { entrySlugs, playbookSlugs } = listContent(root);
  const entries: Entry[] = [];

  for (const slug of entrySlugs) {
    const where = `${root}/entries/${slug}`;
    if (!VALUE.test(slug)) problem(where, "folder name must be a slug (lowercase words joined by hyphens)");
    const file = join(root, "entries", slug, "entry.md");
    if (!existsSync(file)) {
      problem(where, "missing entry.md");
      continue;
    }
    try {
      const { data, body } = splitFrontMatter(readFileSync(file, "utf8"));
      const parsed = EntryFront.safeParse(data);
      if (!parsed.success) zodProblems(where, parsed.error);
      const parts = sections(body);
      for (const heading of parts.keys()) {
        if (heading !== "Technical details" && heading !== "Key code") problem(where, `unexpected section "## ${heading}"`);
      }
      if (!parts.get("Technical details")) problem(where, `needs a "## Technical details" section`);
    } catch (error) {
      problem(where, (error as Error).message);
      continue;
    }
    try {
      entries.push(readEntry(root, slug));
    } catch (error) {
      problem(where, (error as Error).message);
    }
  }

  const known = new Set(entries.map((e) => e.slug));
  for (const e of entries) {
    const where = `${root}/entries/${e.slug}`;
    // the Entry model's "applies to" rules
    if (e.layer === "ui-ux" && !e.wireframe?.desktop && !e.wireframe?.phone) problem(where, "UI/UX entries need a wireframe");
    if (e.layer === "backend" && !e.diagrams?.length) problem(where, "Backend entries need diagrams");
    if (e.origin === "own-project" && (!e.repository || !e.codeLocation)) problem(where, "own-project entries need repository and codeLocation");
    if (e.origin === "researched" && !e.sourceAndLicense) problem(where, "researched entries need sourceAndLicense");
    if (e.layer === "ui-ux" && e.liveSite && !e.screenshots?.length) problem(where, "UI/UX entries with a live site need screenshots");
    if (e.target !== "website" && !e.screenshots?.length) problem(where, "app entries need screenshots");
    if (e.clip && e.target === "website") problem(where, "clips are for mobile and desktop app entries only");
    if (e.status === "proven" && !e.usedIn.length) problem(where, "Proven entries list at least one project under usedIn");
    if (e.updated < e.created) problem(where, "updated is before created");
    if (real) {
      if (!e.projectFile) problem(where, "real entries need projectFile");
      if (e.liveSite && !e.lastChecked) problem(where, "entries with a live site need lastChecked");
    }
    if (e.projectFile && !existsSync(join("projects", `${e.projectFile}.md`))) problem(where, `projectFile "${e.projectFile}" is not in projects/`);
    for (const slug of e.related) {
      if (slug === e.slug) problem(where, "related lists the entry itself");
      else if (!known.has(slug)) problem(where, `related entry "${slug}" does not exist`);
    }
    // diagrams: ids unique, one level 1, parents one level up, the expanded box exists in the parent
    const diagrams = e.diagrams ?? [];
    const ids = new Set<string>();
    for (const d of diagrams) {
      if (ids.has(d.id)) problem(where, `diagram id "${d.id}" is used twice`);
      ids.add(d.id);
    }
    if (diagrams.length && diagrams.filter((d) => d.level === 1).length !== 1) problem(where, "needs exactly one level-1 diagram");
    for (const d of diagrams) {
      if (d.level === 1 && d.parent) problem(where, `level-1 diagram "${d.id}" can't have a parent`);
      if (d.level > 1) {
        const parent = diagrams.find((p) => p.id === d.parent);
        if (!parent) {
          problem(where, `diagram "${d.id}" needs a parent diagram`);
          continue;
        }
        if (parent.level !== d.level - 1) problem(where, `diagram "${d.id}" (level ${d.level}) must sit one level under "${parent.id}"`);
        const box = d.expands ?? d.id;
        if (!new RegExp(`(^|[\\s>(|&])${box}(\\[|\\(|\\{|\\s|$)`, "m").test(parent.mermaid)) {
          problem(where, `diagram "${d.id}" opens box "${box}", which is not in "${parent.id}"`);
        }
      }
    }
  }
  const dupTitles = entries.map((e) => e.title).filter((t, i, all) => all.indexOf(t) !== i);
  for (const t of new Set(dupTitles)) problem(root, `two entries share the title "${t}"`);

  for (const slug of playbookSlugs) {
    const where = `${root}/playbooks/${slug}.md`;
    let playbook: Playbook | undefined;
    try {
      const { data, body } = splitFrontMatter(readFileSync(join(root, "playbooks", `${slug}.md`), "utf8"));
      const parsed = PlaybookFront.safeParse(data);
      if (!parsed.success) zodProblems(where, parsed.error);
      const expected = ["Before you start", "Steps", "Gotchas", "Finished looks like"];
      const found = [...sections(body).keys()];
      if (JSON.stringify(found) !== JSON.stringify(expected)) problem(where, `sections must be, in order: ${expected.map((h) => `## ${h}`).join(", ")}`);
      playbook = readPlaybook(root, slug);
    } catch (error) {
      problem(where, (error as Error).message);
      continue;
    }
    if (!playbook.steps.length) problem(where, "needs at least one ### step under ## Steps");
    if (playbook.status === "verified" && !playbook.lastVerified) problem(where, "a Verified playbook needs lastVerified");
    if (playbook.status === "draft" && playbook.lastVerified) problem(where, "a Draft playbook has no lastVerified");
    for (const entry of playbook.basedOn.entries) if (!known.has(entry)) problem(where, `based-on entry "${entry}" does not exist`);
    if (playbook.projectFile && !existsSync(join("projects", `${playbook.projectFile}.md`))) problem(where, `projectFile "${playbook.projectFile}" is not in projects/`);
    if (real && playbook.kind === "replication-guide" && !playbook.projectFile) problem(where, "real replication guides need projectFile");
  }
  return { entries: entries.length, playbooks: playbookSlugs.length };
}

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ["content", "content-samples"];
const counts = roots.map((root) => ({ root, ...checkRoot(root) }));

if (problems.length) {
  console.error(`Content check failed: ${problems.length} problem${problems.length === 1 ? "" : "s"}\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log(`Content check passed: ${counts.map((c) => `${c.root} (${c.entries} entries, ${c.playbooks} playbooks)`).join(", ")}`);
