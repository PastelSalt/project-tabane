import type { ReactNode } from "react";
import { CarrotPod } from "@/components/motifs";
import styles from "./placeholder.module.css";

/** Temporary stand-in for page content still to be built in a later Phase 1 step. */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <div className={styles.placeholder}>
      <CarrotPod size={28} />
      <p>{children}</p>
    </div>
  );
}

/** Temporary sidebar group with a coloured dot, used until the real sidebar content exists. */
export function PlaceholderGroup({ label, color, children }: { label: string; color: string; children: ReactNode }) {
  return (
    <div className={styles.group}>
      <h3>
        <i style={{ background: `var(${color})` }} />
        {label}
      </h3>
      <p>{children}</p>
    </div>
  );
}
