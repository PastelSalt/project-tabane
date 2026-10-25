import type { ReactNode } from "react";
import { WashiTape } from "@/components/motifs";
import styles from "./entry.module.css";

type Color = "blue" | "yellow" | "violet";

/** A rounded sticker panel with a heading bar: wireframe, live site, details, key code, diagrams. */
export function Panel({
  title,
  color = "blue",
  shadow,
  tape,
  actions,
  flush = false,
  tint,
  children,
}: {
  title: string;
  /** The dot beside the title. */
  color?: Color;
  /** The panel's sticker shadow; defaults to the dot colour. */
  shadow?: Color;
  tape?: "yellow" | "blue";
  /** Small controls on the right of the heading bar. */
  actions?: ReactNode;
  /** No inner padding, for frames and code that run edge to edge. */
  flush?: boolean;
  tint?: Color;
  children: ReactNode;
}) {
  return (
    <section
      className={styles.panel}
      style={{ ["--panel-shadow" as string]: `var(--${shadow ?? color})` }}
      aria-label={title}
    >
      {tape ? <WashiTape color={tape} tilt={tape === "blue" ? 4 : -3} className={styles.panelTape} /> : null}
      <div className={styles.panelHead}>
        <span className={styles.panelDot} style={{ background: `var(--${color})` }} aria-hidden />
        <h2>{title}</h2>
        {actions ? <div className={styles.panelActions}>{actions}</div> : null}
      </div>
      <div
        className={flush ? styles.panelFlush : styles.panelBody}
        style={tint ? { background: `var(--${tint}-tint)` } : undefined}
      >
        {children}
      </div>
    </section>
  );
}
