import Image from "next/image";
import Link from "next/link";
import { SuitBadge, WashiTape, type Suit } from "@/components/motifs";
import { Pill, StatusPill, Tag } from "@/components/ui";
import { outlineMermaid } from "@/lib/mermaid-outline";
import { features, layers, stacks } from "@/lib/tags";
import type { Entry } from "@/lib/types";
import styles from "./library.module.css";

const suits: Suit[] = ["heart", "club", "diamond", "spade"];
const shadows = ["var(--blue)", "var(--violet)", "var(--yellow)"];
const tints = ["var(--yellow-tint)", "var(--blue-tint)", "var(--violet-tint)"];

/** The same entry always gets the same suit. */
function suitFor(slug: string): Suit {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return suits[hash % suits.length];
}

/** 2026-10-04 → 2026.10.04 */
export function formatDate(date: string): string {
  return date.replaceAll("-", ".");
}

/** One concept card: a preview, then status, layer, date, title, reuse note and tags. Opens the entry page. */
export function EntryCard({ entry, index }: { entry: Entry; index: number }) {
  return (
    <article
      className={styles.card}
      style={{ ["--card-shadow" as string]: shadows[index % 3], ["--card-tint" as string]: tints[(index + 1) % 3] }}
    >
      <WashiTape color={index % 2 ? "blue" : "yellow"} tilt={index % 2 ? 4 : -3} className={styles.cardTape} />
      <div className={styles.preview}>
        <CardPreview entry={entry} />
      </div>
      <SuitBadge suit={suitFor(entry.slug)} className={styles.cardSuit} />
      <div className={styles.cardBody}>
        <div className={styles.meta}>
          <StatusPill status={entry.status} />
          <Pill>{layers[entry.layer]}</Pill>
          <span className={styles.date}>{formatDate(entry.created)}</span>
        </div>
        <h2 className={styles.cardTitle}>
          {/* The link covers the whole card; its name is just the title */}
          <Link href={`/library/${entry.slug}`} className={styles.cardLink}>
            {entry.title}
          </Link>
        </h2>
        <p className={styles.reuse}>{entry.reuseNote}</p>
        <div className={styles.tags}>
          {entry.stack.map((value) => (
            <Tag key={value}>{stacks[value]}</Tag>
          ))}
          {entry.feature.map((value) => (
            <Tag key={value}>{features[value]}</Tag>
          ))}
        </div>
      </div>
    </article>
  );
}

/** UI/UX: the wireframe. Backend: a thumbnail of the level-1 diagram. */
function CardPreview({ entry }: { entry: Entry }) {
  const wireframe = entry.wireframe?.desktop ?? entry.wireframe?.phone;
  if (wireframe) {
    return (
      <Image
        src={wireframe.src}
        alt=""
        width={wireframe.width}
        height={wireframe.height}
        className={entry.wireframe?.desktop ? styles.previewImage : styles.previewPhone}
      />
    );
  }
  const system = entry.diagrams?.find((diagram) => diagram.level === 1);
  if (system) return <DiagramThumbnail source={system.mermaid} />;
  return null;
}

function DiagramThumbnail({ source }: { source: string }) {
  const W = 320;
  const H = 200;
  const { nodes, edges } = outlineMermaid(source, W, H);
  const at = new Map(nodes.map((node) => [node.id, node]));
  const columns = new Set(nodes.map((node) => node.x)).size;
  const boxW = Math.min(96, (W / columns) * 0.82);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.previewImage} aria-hidden>
      <g stroke="var(--black)" strokeWidth="2" fill="none">
        {edges.map(({ from, to }) => {
          const a = at.get(from)!;
          const b = at.get(to)!;
          const midX = (a.x + b.x) / 2;
          return <path key={`${from}-${to}`} d={`M${a.x} ${a.y} C${midX} ${a.y} ${midX} ${b.y} ${b.x} ${b.y}`} />;
        })}
      </g>
      {nodes.map((node) => (
        <g key={node.id}>
          <rect x={node.x - boxW / 2} y={node.y - 18} width={boxW} height={36} rx={12} fill="var(--white)" stroke="var(--black)" strokeWidth="2" />
          <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--black)">
            {node.label.length > 14 ? `${node.label.slice(0, 13)}…` : node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
