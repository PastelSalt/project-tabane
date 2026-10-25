import type { EntryFilters } from "./data";
import { entryTags, type EntryTagName } from "./tags";

/** Library address for a set of filters, such as /library?layer=ui-ux&status=proven,candidate&q=card. */
export function libraryHref(filters: EntryFilters, extra: { show?: number } = {}): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  for (const tag of Object.keys(entryTags) as EntryTagName[]) {
    const values = filters[tag];
    if (values?.length) params.set(tag, values.join(","));
  }
  if (extra.show) params.set("show", String(extra.show));
  const query = params.toString().replaceAll("%2C", ",");
  return query ? `/library?${query}` : "/library";
}

/** The same filters with one tag value switched on or off. */
export function toggleFilter(filters: EntryFilters, tag: EntryTagName, value: string): EntryFilters {
  const current = filters[tag] ?? [];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  return { ...filters, [tag]: next };
}
