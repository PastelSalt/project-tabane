// The only place pages get entries and playbooks from.
// Phase 1 reads the samples; Phase 2 changes this file alone to read content/ files instead.

import { samplePlaybooks, sampleEntries } from "./samples";
import { entryTags, playbookKinds, playbookStatuses, targets, type EntryTagName } from "./tags";
import type { Entry, Playbook } from "./types";

/** Who is looking. Visitors with an access code only ever get Shared entries, never the Playbook. */
export type Audience = "owner" | "visitor";

export type EntryFilters = {
  /** Text search over title, feature and reuse note. */
  q?: string;
} & { [Tag in EntryTagName]?: string[] };

export type PlaybookFilters = {
  kind?: string[];
  status?: string[];
  target?: string[];
};

// ---------- Entries ----------

/** Entries matching the filters, newest first. Within a tag, any selected value matches; across tags, all must. */
export function getEntries(filters: EntryFilters = {}, audience: Audience = "owner"): Entry[] {
  const q = filters.q?.trim().toLowerCase();
  return visibleEntries(audience)
    .filter((entry) =>
      (Object.keys(entryTags) as EntryTagName[]).every((tag) => {
        const wanted = filters[tag];
        if (!wanted || wanted.length === 0) return true;
        const values: string[] = Array.isArray(entry[tag]) ? (entry[tag] as string[]) : [entry[tag] as string];
        return values.some((value) => wanted.includes(value));
      }),
    )
    .filter((entry) => !q || searchText(entry).includes(q))
    .sort((a, b) => b.created.localeCompare(a.created));
}

export function getEntry(slug: string, audience: Audience = "owner"): Entry | undefined {
  return visibleEntries(audience).find((entry) => entry.slug === slug);
}

/** The entries an entry pairs with, in the order listed. */
export function getRelatedEntries(entry: Entry, audience: Audience = "owner"): Entry[] {
  return entry.related.flatMap((slug) => getEntry(slug, audience) ?? []);
}

/** The playbooks that use an entry. Owner only. */
export function getPlaybooksUsing(entry: Entry): Playbook[] {
  return samplePlaybooks.filter((playbook) => playbook.basedOn.entries.includes(entry.slug));
}

/** How many of the given entries carry each value of each tag, for the filter sidebar. */
export function countTags(entries: Entry[]): Record<EntryTagName, Record<string, number>> {
  const counts = Object.fromEntries(Object.keys(entryTags).map((tag) => [tag, {}])) as Record<
    EntryTagName,
    Record<string, number>
  >;
  for (const entry of entries) {
    for (const tag of Object.keys(entryTags) as EntryTagName[]) {
      const values = Array.isArray(entry[tag]) ? (entry[tag] as string[]) : [entry[tag] as string];
      for (const value of values) counts[tag][value] = (counts[tag][value] ?? 0) + 1;
    }
  }
  return counts;
}

/** Reads Library filters from the URL, such as ?layer=ui-ux&status=proven,candidate&q=countdown. */
export function parseEntryFilters(params: Record<string, string | string[] | undefined>): EntryFilters {
  const filters: EntryFilters = {};
  const q = first(params.q);
  if (q) filters.q = q;
  for (const tag of Object.keys(entryTags) as EntryTagName[]) {
    const allowed = Object.keys(entryTags[tag].values);
    const values = list(params[tag]).filter((value) => allowed.includes(value));
    if (values.length > 0) filters[tag] = values;
  }
  return filters;
}

// ---------- Playbooks ----------

export function getPlaybooks(filters: PlaybookFilters = {}): Playbook[] {
  return samplePlaybooks.filter(
    (playbook) =>
      (!filters.kind?.length || filters.kind.includes(playbook.kind)) &&
      (!filters.status?.length || filters.status.includes(playbook.status)) &&
      (!filters.target?.length || filters.target.includes(playbook.target)),
  );
}

export function getPlaybook(slug: string): Playbook | undefined {
  return samplePlaybooks.find((playbook) => playbook.slug === slug);
}

export function parsePlaybookFilters(params: Record<string, string | string[] | undefined>): PlaybookFilters {
  const pick = (name: string, allowed: object) => list(params[name]).filter((value) => value in allowed);
  return { kind: pick("kind", playbookKinds), status: pick("status", playbookStatuses), target: pick("target", targets) };
}

// ---------- Helpers ----------

function visibleEntries(audience: Audience): Entry[] {
  if (audience === "owner") return sampleEntries;
  // Visitors: Shared entries only, and never a link to a repository.
  return sampleEntries
    .filter((entry) => entry.shared)
    .map((entry) => ({
      ...entry,
      repository: undefined,
      codeLocation: undefined,
      related: entry.related.filter(isShared),
    }));
}

function isShared(slug: string): boolean {
  return sampleEntries.some((entry) => entry.slug === slug && entry.shared);
}

function searchText(entry: Entry): string {
  const featureLabels = entry.feature.map((value) => entryTags.feature.values[value]);
  return [entry.title, ...featureLabels, entry.reuseNote].join(" ").toLowerCase();
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).flatMap((part) => part.split(",")).filter(Boolean);
}

// ---------- Check ----------
// The Phase 1 stand-in for the Phase 2 schema check: a bad sample fails the build.

function check() {
  const problems: string[] = [];
  const slugs = new Set<string>();
  for (const entry of sampleEntries) {
    if (slugs.has(entry.slug)) problems.push(`duplicate slug ${entry.slug}`);
    slugs.add(entry.slug);
  }
  for (const entry of sampleEntries) {
    for (const tag of Object.keys(entryTags) as EntryTagName[]) {
      const values = Array.isArray(entry[tag]) ? (entry[tag] as string[]) : [entry[tag] as string];
      for (const value of values) {
        if (!(value in entryTags[tag].values)) problems.push(`${entry.slug}: unknown ${tag} "${value}"`);
      }
    }
    for (const slug of entry.related) if (!slugs.has(slug)) problems.push(`${entry.slug}: related entry "${slug}" does not exist`);
    const diagramIds = new Set(entry.diagrams?.map((diagram) => diagram.id));
    for (const diagram of entry.diagrams ?? []) {
      if (diagram.parent && !diagramIds.has(diagram.parent)) problems.push(`${entry.slug}: diagram "${diagram.id}" has no parent "${diagram.parent}"`);
    }
    if (entry.layer === "backend" && !entry.diagrams?.length) problems.push(`${entry.slug}: backend entries need diagrams`);
    if (entry.layer === "ui-ux" && !entry.wireframe) problems.push(`${entry.slug}: UI/UX entries need a wireframe`);
  }
  for (const playbook of samplePlaybooks) {
    for (const slug of playbook.basedOn.entries) if (!slugs.has(slug)) problems.push(`${playbook.slug}: based-on entry "${slug}" does not exist`);
  }
  if (problems.length > 0) throw new Error(`Sample data problems:\n- ${problems.join("\n- ")}`);
}

check();
