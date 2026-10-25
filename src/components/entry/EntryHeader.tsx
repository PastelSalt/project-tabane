import Link from "next/link";
import { CarrotPod, SuitBadge } from "@/components/motifs";
import { Pill, StatusPill, Tag } from "@/components/ui";
import { suitFor } from "@/lib/format";
import { features, layers, stacks, targets } from "@/lib/tags";
import type { Entry } from "@/lib/types";
import styles from "./entry.module.css";

/** Back link and breadcrumb, then the suit, the highlighted title and the entry's labels. */
export function EntryHeader({ entry }: { entry: Entry }) {
  return (
    <>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link href="/library" className={styles.back}>
          <span aria-hidden>←</span> Library
        </Link>
        <span>
          Library / {layers[entry.layer]} / <span aria-current="page">{entry.slug}</span>
        </span>
      </nav>
      <header className={styles.head}>
        <SuitBadge suit={suitFor(entry.slug)} size={64} className={styles.bigSuit} />
        <div>
          <h1 className={styles.title}>
            <mark>{entry.title}</mark>
          </h1>
          <div className={styles.labels}>
            <StatusPill status={entry.status} />
            <Pill>{layers[entry.layer]}</Pill>
            <Pill>{targets[entry.target]}</Pill>
            {entry.stack.map((value) => (
              <Tag key={value}>{stacks[value]}</Tag>
            ))}
            {entry.feature.map((value) => (
              <Tag key={value}>{features[value]}</Tag>
            ))}
          </div>
        </div>
        <CarrotPod size={30} className={styles.headSticker} />
      </header>
    </>
  );
}
