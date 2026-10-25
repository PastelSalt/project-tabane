import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiagramLevels } from "@/components/entry/DiagramLevels";
import { EntryHeader } from "@/components/entry/EntryHeader";
import { Panel } from "@/components/entry/Panel";
import { EntrySidebar } from "@/components/entry/EntrySidebar";
import styles from "@/components/entry/entry.module.css";
import {
  DetailsPanel,
  KeyCodePanel,
  LiveSitePanel,
  WireframePanel,
  type FrameMode,
  type WireframeView,
} from "@/components/entry/views";
import { AppLayout } from "@/components/shell";
import { Placeholder } from "@/components/shell/Placeholder";
import { getEntry } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/library/[slug]">): Promise<Metadata> {
  const entry = getEntry((await params).slug);
  return { title: entry?.title ?? "Entry not found" };
}

export default async function EntryPage({ params, searchParams }: PageProps<"/library/[slug]">) {
  const entry = getEntry((await params).slug);
  if (!entry) notFound();

  const query = await searchParams;
  const view: WireframeView = query.view === "phone" ? "phone" : "desktop";
  const frame: FrameMode = query.frame === "screenshot" ? "screenshot" : "live";
  const isApp = entry.target !== "website";

  return (
    <AppLayout sidebar={<EntrySidebar entry={entry} />}>
      <EntryHeader entry={entry} />

      {entry.layer === "backend" && entry.diagrams ? (
        <Panel
          title="Diagram"
          color="violet"
          tape="yellow"
          flush
          actions={<span>{entry.diagrams.length === 1 ? "1 level" : `${entry.diagrams.length} diagrams`}</span>}
        >
          <DiagramLevels diagrams={entry.diagrams} initial={typeof query.diagram === "string" ? query.diagram : undefined} />
        </Panel>
      ) : (
        <div className={styles.row}>
          <WireframePanel entry={entry} view={view} frame={frame} />
          {isApp ? (
            <Placeholder>The screenshot gallery and clip for apps arrive in step 9.</Placeholder>
          ) : (
            <LiveSitePanel entry={entry} view={view} frame={frame} />
          )}
        </div>
      )}

      <div className={styles.row}>
        <DetailsPanel entry={entry} />
        <KeyCodePanel entry={entry} />
      </div>
    </AppLayout>
  );
}
