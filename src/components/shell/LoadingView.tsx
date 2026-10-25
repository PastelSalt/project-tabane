import { PocketWatch } from "@/components/motifs";
import { AppLayout, Sidebar } from "./AppLayout";
import styles from "./notFound.module.css";

/** Shown while a page's data loads: the shell stays, with still (non-animated) card outlines. */
export function LoadingView({ cards = 6 }: { cards?: number }) {
  return (
    <AppLayout
      sidebar={
        <Sidebar title="Loading" label="Loading">
          <span />
        </Sidebar>
      }
    >
      <p className={styles.loadingNote} role="status">
        <PocketWatch size={22} /> Loading…
      </p>
      <div className={styles.skeletonGrid} aria-hidden>
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} className={styles.skeleton}>
            <span />
            <span />
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
