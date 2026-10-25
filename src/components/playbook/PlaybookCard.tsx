import Link from "next/link";
import { PocketWatch, SuitBadge } from "@/components/motifs";
import { Pill, PlaybookStatusPill } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { playbookKinds, targets } from "@/lib/tags";
import type { Playbook } from "@/lib/types";
import styles from "./playbook.module.css";

const shadows = ["var(--violet)", "var(--yellow)", "var(--blue)"];

/** One playbook in the list: kind, status, goal, and how big it is. */
export function PlaybookCard({ playbook, index }: { playbook: Playbook; index: number }) {
  return (
    <article className={styles.card} style={{ ["--card-shadow" as string]: shadows[index % 3] }}>
      <SuitBadge suit="spade" className={styles.cardSuit} />
      <div className={styles.meta}>
        <PlaybookStatusPill status={playbook.status} />
        <Pill>{playbookKinds[playbook.kind]}</Pill>
        <Pill>{targets[playbook.target]}</Pill>
      </div>
      <h3 className={styles.cardTitle}>
        <Link href={`/playbook/${playbook.slug}`} className={styles.cardLink}>
          {playbook.title}
        </Link>
      </h3>
      <p className={styles.goal}>{playbook.goal}</p>
      <div className={styles.facts}>
        <span>{playbook.steps.length} steps</span>
        <span>{playbook.basedOn.entries.length} entries</span>
        {playbook.lastVerified ? (
          <span className={styles.verified}>
            <PocketWatch size={16} ticking={false} />
            verified {formatDate(playbook.lastVerified)}
          </span>
        ) : (
          <span>not verified yet</span>
        )}
      </div>
    </article>
  );
}
