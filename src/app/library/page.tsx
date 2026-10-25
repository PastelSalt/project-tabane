import type { Metadata } from "next";
import { ActiveFilters } from "@/components/library/ActiveFilters";
import { EmptyState } from "@/components/library/EmptyState";
import { EntryCard } from "@/components/library/EntryCard";
import { FilterSidebar } from "@/components/library/FilterSidebar";
import { SearchBar } from "@/components/library/SearchBar";
import styles from "@/components/library/library.module.css";
import { CarrotPod, Flower, PocketWatch, Stamp, Teacup } from "@/components/motifs";
import { AppLayout, SectionHeading } from "@/components/shell";
import { ButtonLink } from "@/components/ui";
import { countTags, getEntries, parseEntryFilters } from "@/lib/data";
import { libraryHref } from "@/lib/url";

export const metadata: Metadata = { title: "Library" };

/** Cards loaded at first, and added by each "Show more". */
const PAGE_SIZE = 12;

export default async function LibraryPage({ searchParams }: PageProps<"/library">) {
  const params = await searchParams;
  const filters = parseEntryFilters(params);
  const all = getEntries();
  const matches = getEntries(filters);
  const show = Math.max(PAGE_SIZE, Number(params.show) || PAGE_SIZE);
  const visible = matches.slice(0, show);

  return (
    <AppLayout sidebar={<FilterSidebar filters={filters} counts={countTags(all)} />}>
      <CarrotPod size={34} className={`${styles.sticker} ${styles.stickerCarrot}`} />
      <Stamp className={`${styles.sticker} ${styles.stickerStamp}`} />

      <SectionHeading
        number="01"
        title="Library"
        subtitle={`${all.length} entries · newest first`}
        decoration={<Flower size={28} />}
      >
        <SearchBar filters={filters} />
      </SectionHeading>

      <ActiveFilters filters={filters} shown={matches.length} total={all.length} />

      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className={styles.grid}>
          {visible.map((entry, index) => (
            <li key={entry.slug}>
              <EntryCard entry={entry} index={index} />
            </li>
          ))}
        </ul>
      )}

      {matches.length > visible.length ? (
        <div className={styles.moreRow}>
          <ButtonLink href={libraryHref(filters, { show: show + PAGE_SIZE })} color="yellow">
            Show more entries ({matches.length - visible.length} more)
          </ButtonLink>
        </div>
      ) : null}

      <PocketWatch size={64} className={`${styles.sticker} ${styles.stickerWatch}`} />
      <Teacup size={80} className={`${styles.sticker} ${styles.stickerCup}`} />
    </AppLayout>
  );
}
