import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/entry/Panel";
import entryStyles from "@/components/entry/entry.module.css";
import { Flower, PocketWatch, SuitBadge } from "@/components/motifs";
import styles from "@/components/playbook/playbook.module.css";
import { AppLayout, Sidebar } from "@/components/shell";
import { Chip, Pill, PlaybookStatusPill } from "@/components/ui";
import { getEntry, getPlaybook } from "@/lib/data";
import { formatDate, suitFor } from "@/lib/format";
import { playbookKinds, targets } from "@/lib/tags";

export async function generateMetadata({ params }: PageProps<"/playbook/[slug]">): Promise<Metadata> {
  const playbook = getPlaybook((await params).slug);
  return { title: playbook?.title ?? "Playbook not found" };
}

/** One playbook: what it needs, the numbered steps, the gotchas, and how I know it worked. */
export default async function PlaybookDetail({ params }: PageProps<"/playbook/[slug]">) {
  const playbook = getPlaybook((await params).slug);
  if (!playbook) notFound();
  const entries = playbook.basedOn.entries.flatMap((slug) => getEntry(slug) ?? []);

  const sidebar = (
    <Sidebar title="Playbook" label="Playbook details">
      <dl className={entryStyles.fields}>
        <div className={entryStyles.field}>
          <dt>Kind</dt>
          <dd>
            <Chip selected small color="violet">
              {playbookKinds[playbook.kind]}
            </Chip>
          </dd>
        </div>
        <div className={entryStyles.field}>
          <dt>Status</dt>
          <dd>
            <PlaybookStatusPill status={playbook.status} />
          </dd>
        </div>
        <div className={entryStyles.field}>
          <dt>Target</dt>
          <dd>{targets[playbook.target]}</dd>
        </div>
        <div className={entryStyles.field}>
          <dt>Last verified</dt>
          <dd>
            {playbook.lastVerified ? (
              <>
                <PocketWatch size={18} ticking={false} />
                {formatDate(playbook.lastVerified)}
              </>
            ) : (
              "Not yet"
            )}
          </dd>
        </div>
      </dl>

      <div className={entryStyles.sticky}>
        <b>Goal</b>
        {playbook.goal}
      </div>

      {entries.length ? (
        <div className={entryStyles.linkGroup}>
          <h3>
            <i style={{ background: "var(--blue)" }} aria-hidden />
            Based on entries
          </h3>
          <ul>
            {entries.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/library/${entry.slug}`} className={entryStyles.sideLink}>
                  <SuitBadge suit={suitFor(entry.slug)} size={22} />
                  {entry.title.replace(/^Sample · /, "")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {playbook.basedOn.sites.length ? (
        <div className={entryStyles.linkGroup}>
          <h3>
            <i style={{ background: "var(--yellow)" }} aria-hidden />
            Based on sites
          </h3>
          <ul>
            {playbook.basedOn.sites.map((site) => (
              <li key={site.url}>
                <a href={site.url} className={entryStyles.sideLink} target="_blank" rel="noreferrer">
                  <span className={entryStyles.sideMark} aria-hidden>
                    ↗
                  </span>
                  {site.label}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Sidebar>
  );

  return (
    <AppLayout sidebar={sidebar}>
      <nav className={entryStyles.crumbs} aria-label="Breadcrumb">
        <Link href="/playbook" className={entryStyles.back}>
          <span aria-hidden>←</span> Playbook
        </Link>
        <span>
          Playbook / {playbookKinds[playbook.kind]} / <span aria-current="page">{playbook.slug}</span>
        </span>
      </nav>

      <header className={entryStyles.head}>
        <SuitBadge suit="spade" size={64} className={entryStyles.bigSuit} />
        <div>
          <h1 className={entryStyles.title}>
            <mark>{playbook.title}</mark>
          </h1>
          <div className={entryStyles.labels}>
            <PlaybookStatusPill status={playbook.status} />
            <Pill>{playbookKinds[playbook.kind]}</Pill>
            <Pill>{targets[playbook.target]}</Pill>
          </div>
        </div>
      </header>

      <div className={entryStyles.row}>
        <Panel title="Before you start" color="blue">
          <ul className={styles.checklist}>
            {playbook.beforeYouStart.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Panel>
        <Panel title="Gotchas" color="violet">
          <ul className={styles.gotchas}>
            {playbook.gotchas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Steps" color="yellow" tape="yellow" actions={<span>{playbook.steps.length} steps</span>}>
        <ol className={styles.steps}>
          {playbook.steps.map((step) => (
            <li key={step.title} className={styles.step}>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Finished looks like" color="yellow" shadow="violet" tint="yellow">
        <p className={styles.finished}>
          <Flower size={32} />
          {playbook.finishedLooksLike}
        </p>
      </Panel>
    </AppLayout>
  );
}
