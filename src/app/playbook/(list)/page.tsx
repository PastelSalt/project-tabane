import type { Metadata } from "next";
import { EmptyState } from "@/components/library/EmptyState";
import { Flower, SuitBadge } from "@/components/motifs";
import { PlaybookCard } from "@/components/playbook/PlaybookCard";
import { PlaybookFilters } from "@/components/playbook/PlaybookFilters";
import styles from "@/components/playbook/playbook.module.css";
import { AppLayout, SectionHeading } from "@/components/shell";
import { getPlaybooks, parsePlaybookFilters } from "@/lib/data";
import { playbookKinds, type PlaybookKind } from "@/lib/tags";

export const metadata: Metadata = { title: "Playbook" };

/** 02 Playbook: every playbook, grouped by kind, with Kind / Status / Target filters. Owner only. */
export default async function PlaybookPage({ searchParams }: PageProps<"/playbook">) {
  const filters = parsePlaybookFilters(await searchParams);
  const all = getPlaybooks();
  const matches = getPlaybooks(filters);

  const counts: Record<string, number> = {};
  for (const playbook of all) {
    for (const key of [`kind:${playbook.kind}`, `status:${playbook.status}`, `target:${playbook.target}`]) {
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }

  return (
    <AppLayout sidebar={<PlaybookFilters filters={filters} counts={counts} />}>
      <SectionHeading
        number="02"
        title="Playbook"
        subtitle={`${all.length} playbooks · how I rebuild and apply things · owner only`}
        decoration={<Flower size={28} />}
      />

      {matches.length === 0 ? (
        <EmptyState title="No playbooks match" href="/playbook" linkText="see every playbook" />
      ) : (
        (Object.keys(playbookKinds) as PlaybookKind[]).map((kind) => {
          const ofKind = matches.filter((playbook) => playbook.kind === kind);
          if (ofKind.length === 0) return null;
          return (
            <section key={kind} className={styles.kind} aria-labelledby={`kind-${kind}`}>
              <h2 id={`kind-${kind}`} className={styles.kindHead}>
                <SuitBadge suit="spade" size={28} />
                {playbookKinds[kind]}
                <span>{ofKind.length}</span>
              </h2>
              <ul className={styles.grid}>
                {ofKind.map((playbook, index) => (
                  <li key={playbook.slug}>
                    <PlaybookCard playbook={playbook} index={index} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </AppLayout>
  );
}
