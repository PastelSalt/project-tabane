import Link from "next/link";
import { Chip } from "@/components/ui";
import type { EntryFilters } from "@/lib/data";
import { entryTags, type EntryTagName } from "@/lib/tags";
import { libraryHref, toggleFilter } from "@/lib/url";
import styles from "./library.module.css";

/** "Showing 3 of 12", then one removable chip per active filter and the search text. */
export function ActiveFilters({ filters, shown, total }: { filters: EntryFilters; shown: number; total: number }) {
  const active = (Object.keys(entryTags) as EntryTagName[]).flatMap((tag) =>
    (filters[tag] ?? []).map((value) => ({ tag, value, label: (entryTags[tag].values as Record<string, string>)[value] })),
  );
  const filtered = active.length > 0 || Boolean(filters.q);
  return (
    <div className={styles.active} aria-live="polite">
      <span>
        Showing {shown} of {total}
        {filtered ? " ·" : ""}
      </span>
      {filters.q ? (
        <Chip href={libraryHref({ ...filters, q: undefined })} selected color="violet" title="Remove search">
          “{filters.q}” <span aria-hidden>✕</span>
          <span className="visually-hidden">remove search</span>
        </Chip>
      ) : null}
      {active.map(({ tag, value, label }) => (
        <Chip key={`${tag}-${value}`} href={libraryHref(toggleFilter(filters, tag, value))} selected color="yellow" title={`Remove ${label}`}>
          {label} <span aria-hidden>✕</span>
          <span className="visually-hidden">remove filter</span>
        </Chip>
      ))}
      {filtered ? (
        <Link href="/library" className={styles.clear} scroll={false}>
          Clear all
        </Link>
      ) : null}
    </div>
  );
}
