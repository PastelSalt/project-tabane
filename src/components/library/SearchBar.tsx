import Form from "next/form";
import { buttonClass } from "@/components/ui";
import type { EntryFilters } from "@/lib/data";
import { entryTags, type EntryTagName } from "@/lib/tags";
import styles from "./library.module.css";

/** Search over title, feature and reuse note. Submitting keeps the current filters. */
export function SearchBar({ filters }: { filters: EntryFilters }) {
  return (
    <Form action="/library" className={styles.search} role="search">
      <label htmlFor="library-search" className="visually-hidden">
        Search entries
      </label>
      <input
        id="library-search"
        name="q"
        type="search"
        defaultValue={filters.q ?? ""}
        placeholder="Search title, feature or reuse note"
        className={styles.searchInput}
        autoComplete="off"
      />
      {(Object.keys(entryTags) as EntryTagName[]).map((tag) =>
        filters[tag]?.length ? <input key={tag} type="hidden" name={tag} value={filters[tag]!.join(",")} /> : null,
      )}
      <button type="submit" className={buttonClass}>
        Search
      </button>
    </Form>
  );
}
