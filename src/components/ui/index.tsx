import Link from "next/link";
import type { ReactNode } from "react";
import { statuses, type Status } from "@/lib/tags";
import styles from "./ui.module.css";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

/** Status label: Proven is violet, Candidate yellow, Outdated struck through. */
export function StatusPill({ status }: { status: Status }) {
  return <span className={cx(styles.pill, styles[`status-${status}`])}>{statuses[status]}</span>;
}

/** A plain outlined pill, such as the layer or target. */
export function Pill({ children }: { children: ReactNode }) {
  return <span className={styles.pill}>{children}</span>;
}

/** A small blue-tinted tag for stack and feature values. */
export function Tag({ children }: { children: ReactNode }) {
  return <span className={styles.tag}>{children}</span>;
}

export type ChipColor = "blue" | "yellow" | "violet" | "white";

/** A filter chip. A link when it changes the page, otherwise a plain label. */
export function Chip({
  children,
  href,
  selected = false,
  color = "blue",
  small = false,
  title,
}: {
  children: ReactNode;
  href?: string;
  selected?: boolean;
  color?: ChipColor;
  small?: boolean;
  title?: string;
}) {
  const className = cx(styles.chip, small && styles.chipSmall, selected && styles[`chip-${color}`]);
  if (!href) return <span className={className}>{children}</span>;
  return (
    <Link href={href} className={className} aria-pressed={selected} scroll={false} title={title}>
      {children}
    </Link>
  );
}

/** The chunky button: blue by default, yellow for secondary calls. */
export function ButtonLink({ href, children, color = "blue" }: { href: string; children: ReactNode; color?: "blue" | "yellow" }) {
  return (
    <Link href={href} className={cx(styles.button, color === "yellow" && styles.buttonYellow)} scroll={false}>
      {children}
    </Link>
  );
}

export const buttonClass = styles.button;
