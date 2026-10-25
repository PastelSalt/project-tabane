import Link from "next/link";
import type { ReactNode } from "react";
import { PocketWatch, SuitBadge } from "@/components/motifs";
import { Sidebar } from "@/components/shell";
import { Chip, StatusPill } from "@/components/ui";
import { getPlaybooksUsing, getRelatedEntries } from "@/lib/data";
import { formatDate, suitFor } from "@/lib/format";
import { features, layers, origins, stacks, targets } from "@/lib/tags";
import type { Entry } from "@/lib/types";
import styles from "./entry.module.css";

/** The entry page's sidebar: every field, the reuse note as a sticky note, then links, related entries and playbooks. */
export function EntrySidebar({ entry }: { entry: Entry }) {
  const related = getRelatedEntries(entry);
  const playbooks = getPlaybooksUsing(entry);
  return (
    <Sidebar title="Entry" label="Entry details">
      <dl className={styles.fields}>
        <Field name="Layer">
          <Chip selected small color="blue">
            {layers[entry.layer]}
          </Chip>
        </Field>
        <Field name="Origin">
          <Chip selected small color="yellow">
            {origins[entry.origin]}
          </Chip>
        </Field>
        <Field name="Status">
          <StatusPill status={entry.status} />
        </Field>
        <Field name="Target">{targets[entry.target]}</Field>
        <Field name="Stack">{entry.stack.map((value) => stacks[value]).join(", ")}</Field>
        <Field name="Feature">{entry.feature.map((value) => features[value]).join(", ")}</Field>
        <Field name="Used in">{entry.usedIn.length ? entry.usedIn.join(", ") : "Not yet"}</Field>
        {entry.lastChecked ? (
          <Field name="Last checked">
            <PocketWatch size={18} ticking={false} />
            {formatDate(entry.lastChecked)}
          </Field>
        ) : null}
        <Field name="Shared">
          <Chip selected={entry.shared} small color="violet">
            {entry.shared ? "On" : "Off"}
          </Chip>
        </Field>
        <Field name="Created">{formatDate(entry.created)}</Field>
        <Field name="Updated">{formatDate(entry.updated)}</Field>
      </dl>

      <div className={styles.sticky}>
        <b>Reuse when</b>
        {entry.reuseNote}
      </div>

      <LinkGroup title="Links" color="blue">
        {entry.repository ? (
          <SideLink href={entry.repository.url} mark="⌘" external>
            {entry.repository.name}
          </SideLink>
        ) : null}
        {entry.liveSite ? (
          <SideLink href={entry.liveSite.url} mark="↗" external>
            Live site
          </SideLink>
        ) : null}
      </LinkGroup>

      {entry.codeLocation ? (
        <LinkGroup title="Code location" color="yellow">
          <li className={styles.codeLocation}>
            <code>{entry.codeLocation.path}</code>
            <span>at {entry.codeLocation.ref}</span>
          </li>
        </LinkGroup>
      ) : null}

      {entry.sourceAndLicense ? (
        <LinkGroup title="Source and license" color="violet">
          <li className={styles.sourceNote}>{entry.sourceAndLicense}</li>
        </LinkGroup>
      ) : null}

      {related.length ? (
        <LinkGroup title="Related entries" color="violet">
          {related.map((other) => (
            <SideLink key={other.slug} href={`/library/${other.slug}`} suit={suitFor(other.slug)}>
              {other.title.replace(/^Sample · /, "")}
            </SideLink>
          ))}
        </LinkGroup>
      ) : null}

      {playbooks.length ? (
        <LinkGroup title="Playbook" color="yellow">
          {playbooks.map((playbook) => (
            <SideLink key={playbook.slug} href={`/playbook/${playbook.slug}`} mark="♠">
              {playbook.title.replace(/^Sample · /, "")}
            </SideLink>
          ))}
        </LinkGroup>
      ) : null}
    </Sidebar>
  );
}

function Field({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className={styles.field}>
      <dt>{name}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function LinkGroup({ title, color, children }: { title: string; color: string; children: ReactNode }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  if (Array.isArray(items) && items.length === 0) return null;
  return (
    <div className={styles.linkGroup}>
      <h3>
        <i style={{ background: `var(--${color})` }} aria-hidden />
        {title}
      </h3>
      <ul>{items}</ul>
    </div>
  );
}

function SideLink({
  href,
  mark,
  suit,
  external = false,
  children,
}: {
  href: string;
  mark?: string;
  suit?: ReturnType<typeof suitFor>;
  external?: boolean;
  children: ReactNode;
}) {
  const icon = suit ? <SuitBadge suit={suit} size={22} /> : <span className={styles.sideMark} aria-hidden>{mark}</span>;
  return (
    <li>
      {external ? (
        <a href={href} className={styles.sideLink} target="_blank" rel="noreferrer">
          {icon}
          {children}
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      ) : (
        <Link href={href} className={styles.sideLink}>
          {icon}
          {children}
        </Link>
      )}
    </li>
  );
}
