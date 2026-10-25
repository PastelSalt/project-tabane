import Link from "next/link";
import { CarrotPod } from "@/components/motifs";
import styles from "./library.module.css";

/** Shown when no entry matches: the carrot pod, and a way back to everything. */
export function EmptyState() {
  return (
    <div className={styles.empty}>
      <CarrotPod size={40} />
      <div>
        <h2>No entries match</h2>
        <p>
          Try fewer filters or a different word, or <Link href="/library">see every entry</Link>.
        </p>
      </div>
    </div>
  );
}
