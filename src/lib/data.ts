// The only place pages get entries and playbooks from: the content folder, through src/lib/content.ts.

import { loadContent } from "./content";
import { entryTags, playbookKinds, playbookStatuses, targets, type EntryTagName } from "./tags";
import type { Entry, Playbook } from "./types";

/** Who is looking. Visitors with an access code only ever get Shared entries, never the Playbook. */
export type Audience = "owner" | "visitor";

export type EntryFilters = {
  /** Search by word start over title, feature, stack and reuse note ("stats" finds "statistics"). */
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
    .filter((entry) => !q || matches(searchWords(entry), q))
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
  return loadContent().playbooks.filter((playbook) => playbook.basedOn.entries.includes(entry.slug));
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
  return loadContent().playbooks.filter(
    (playbook) =>
      (!filters.kind?.length || filters.kind.includes(playbook.kind)) &&
      (!filters.status?.length || filters.status.includes(playbook.status)) &&
      (!filters.target?.length || filters.target.includes(playbook.target)),
  );
}

export function getPlaybook(slug: string): Playbook | undefined {
  return loadContent().playbooks.find((playbook) => playbook.slug === slug);
}

export function parsePlaybookFilters(params: Record<string, string | string[] | undefined>): PlaybookFilters {
  const pick = (name: string, allowed: object) => list(params[name]).filter((value) => value in allowed);
  return { kind: pick("kind", playbookKinds), status: pick("status", playbookStatuses), target: pick("target", targets) };
}

// ---------- Helpers ----------

function visibleEntries(audience: Audience): Entry[] {
  const { entries } = loadContent();
  if (audience === "owner") return entries;
  // Visitors: Shared entries only, and never a link to a repository.
  return entries
    .filter((entry) => entry.shared)
    .map((entry) => ({
      ...entry,
      repository: undefined,
      codeLocation: undefined,
      related: entry.related.filter(isShared),
    }));
}

function isShared(slug: string): boolean {
  return loadContent().entries.some((entry) => entry.slug === slug && entry.shared);
}

/** The words search looks at: title, feature and stack labels, and the reuse note. */
function searchWords(entry: Entry): string[] {
  const featureLabels = entry.feature.map((value) => entryTags.feature.values[value] ?? value);
  const stackLabels = entry.stack.map((value) => entryTags.stack.values[value] ?? value);
  return words([entry.title, ...featureLabels, ...stackLabels, entry.reuseNote].join(" "));
}

/** Lowercase words, with a trailing plural "s" dropped, so "stats" and "statistics" share a start. */
function words(text: string): string[] {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).map((word) =>
    word.length > 3 && word.endsWith("s") && !word.endsWith("ss") ? word.slice(0, -1) : word,
  );
}

/** Every word of the query starts some word of the entry: "stats" finds "statistics", "count" finds "countdown". */
export function matches(entryWords: string[], query: string): boolean {
  return words(query).every((part) => entryWords.some((word) => word.startsWith(part)));
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).flatMap((part) => part.split(",")).filter(Boolean);
}

