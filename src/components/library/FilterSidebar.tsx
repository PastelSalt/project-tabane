import Link from "next/link";
import { Sidebar } from "@/components/shell";
import { Chip, type ChipColor } from "@/components/ui";
import type { EntryFilters } from "@/lib/data";
import { entryTags, type EntryTagName } from "@/lib/tags";
import { libraryHref, toggleFilter } from "@/lib/url";
import styles from "./library.module.css";

/** Each tag group's colour: its dot and its selected chips. */
const groupColor: Record<EntryTagName, ChipColor> = {
  layer: "blue",
  origin: "yellow",
  status: "violet",
  target: "white",
  stack: "blue",
  feature: "yellow",
};

/** Long groups show this many values, then the rest behind "more". */
const SHOWN = 6;

/** The Library's tag filters. Every chip is a link that switches one value on or off. */
export function FilterSidebar({
  filters,
  counts,
}: {
  filters: EntryFilters;
  counts: Record<EntryTagName, Record<string, number>>;
}) {
  const anySelected = (Object.keys(entryTags) as EntryTagName[]).some((tag) => filters[tag]?.length);
  return (
    <Sidebar title="Filters" label="Library filters">
      {(Object.keys(entryTags) as EntryTagName[]).map((tag) => {
        const values = Object.entries(entryTags[tag].values) as [string, string][];
        const selected = filters[tag] ?? [];
        // Selected values always stay visible, even inside a long group
        const shown = values.filter(([value], i) => i < SHOWN || selected.includes(value));
        const hidden = values.filter(([value], i) => i >= SHOWN && !selected.includes(value));
        const chip = ([value, label]: [string, string]) => (
          <Chip
            key={value}
            href={libraryHref(toggleFilter(filters, tag, value))}
            selected={selected.includes(value)}
            color={groupColor[tag]}
            title={`${counts[tag][value] ?? 0} entries`}
          >
            {label}
            <span className={styles.count}>{counts[tag][value] ?? 0}</span>
          </Chip>
        );
        return (
          <div key={tag} className={styles.group}>
            <h3 className={styles.groupHead}>
              <i className={styles.dot} style={{ background: `var(--${groupColor[tag] === "white" ? "white" : groupColor[tag]})` }} />
              {entryTags[tag].label}
            </h3>
            <div className={styles.chips}>{shown.map(chip)}</div>
            {hidden.length > 0 ? (
              <details className={styles.more}>
                <summary>{hidden.length} more</summary>
                <div className={styles.chips}>{hidden.map(chip)}</div>
              </details>
            ) : null}
          </div>
        );
      })}
      {anySelected ? (
        <Link href={libraryHref({ q: filters.q })} className={styles.clear} scroll={false}>
          Clear all filters
        </Link>
      ) : null}
    </Sidebar>
  );
}
