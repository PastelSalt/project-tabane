import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClipPanel, ScreenshotGallery } from "@/components/entry/AppMedia";
import { DiagramLevels } from "@/components/entry/DiagramLevels";
import { EntryHeader } from "@/components/entry/EntryHeader";
import { EntrySidebar } from "@/components/entry/EntrySidebar";
import { Panel } from "@/components/entry/Panel";
import styles from "@/components/entry/entry.module.css";
import {
  DetailsPanel,
  KeyCodePanel,
  LiveSitePanel,
  WireframePanel,
  entryHref,
  type FrameMode,
  type WireframeView,
} from "@/components/entry/views";
import { AppLayout } from "@/components/shell";
import { getEntry } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/library/[slug]">): Promise<Metadata> {
  const entry = getEntry((await params).slug);
  return { title: entry?.title ?? "Entry not found" };
}

/**
 * One entry, in one of three variants:
 * UI/UX website (wireframe + live site), Backend (diagram levels), App (screenshots + clip instead of a live site).
 */
export default async function EntryPage({ params, searchParams }: PageProps<"/library/[slug]">) {
  const entry = getEntry((await params).slug);
  if (!entry) notFound();

  const query = await searchParams;
  const view: WireframeView = query.view === "phone" ? "phone" : "desktop";
  const frame: FrameMode = query.frame === "screenshot" ? "screenshot" : "live";
  const shot = Math.max(0, (Number(query.shot) || 1) - 1);
  const isApp = entry.target !== "website";
  const shotHref = (i: number) => entryHref(entry.slug, { view, frame, shot: i });

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
            <ScreenshotGallery entry={entry} selected={shot} hrefFor={shotHref} />
          ) : (
            <LiveSitePanel entry={entry} view={view} frame={frame} />
          )}
        </div>
      )}

      {/* Backend apps show their screenshots under the diagram */}
      {entry.layer === "backend" && isApp ? <ScreenshotGallery entry={entry} selected={shot} hrefFor={shotHref} /> : null}
      {isApp ? <ClipPanel entry={entry} /> : null}

      <div className={styles.row}>
        <DetailsPanel entry={entry} />
        <KeyCodePanel entry={entry} />
      </div>
    </AppLayout>
  );
}
