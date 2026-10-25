import Link from "next/link";
import { Sidebar } from "@/components/shell";
import { Chip, type ChipColor } from "@/components/ui";
import type { PlaybookFilters as Filters } from "@/lib/data";
import { playbookKinds, playbookStatuses, targets } from "@/lib/tags";
import styles from "./playbook.module.css";

const groups = [
  { name: "kind", label: "Kind", values: playbookKinds, color: "violet" },
  { name: "status", label: "Status", values: playbookStatuses, color: "yellow" },
  { name: "target", label: "Target", values: targets, color: "blue" },
] as const;

/** Playbook address for a set of filters, such as /playbook?kind=replication-guide. */
export function playbookHref(filters: Filters): string {
  const params = new URLSearchParams();
  for (const { name } of groups) if (filters[name]?.length) params.set(name, filters[name]!.join(","));
  const query = params.toString().replaceAll("%2C", ",");
  return query ? `/playbook?${query}` : "/playbook";
}

function toggle(filters: Filters, name: keyof Filters, value: string): Filters {
  const current = filters[name] ?? [];
  return { ...filters, [name]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] };
}

/** The Playbook's filters: Kind, Status and Target, in the same reusable sidebar as the Library. */
export function PlaybookFilters({ filters, counts }: { filters: Filters; counts: Record<string, number> }) {
  const any = groups.some(({ name }) => filters[name]?.length);
  return (
    <Sidebar title="Filters" label="Playbook filters">
      {groups.map(({ name, label, values, color }) => (
        <div key={name} className={styles.group}>
          <h3 className={styles.groupHead}>
            <i style={{ background: `var(--${color})` }} aria-hidden />
            {label}
          </h3>
          <div className={styles.chips}>
            {(Object.entries(values) as [string, string][]).map(([value, text]) => (
              <Chip
                key={value}
                href={playbookHref(toggle(filters, name, value))}
                selected={filters[name]?.includes(value) ?? false}
                color={color as ChipColor}
              >
                {text}
                <span className={styles.count}>{counts[`${name}:${value}`] ?? 0}</span>
              </Chip>
            ))}
          </div>
        </div>
      ))}
      {any ? (
        <Link href="/playbook" className={styles.clear} scroll={false}>
          Clear all filters
        </Link>
      ) : null}
    </Sidebar>
  );
}
