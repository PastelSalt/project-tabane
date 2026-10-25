"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./shell.module.css";

/**
 * The sidebar's heading and body. On phones the body starts folded behind a Show / Hide button,
 * so the page content isn't pushed far down; on desktop the button is hidden and the body always shows.
 */
export function SidebarFrame({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  return (
    <>
      <div className={styles.sidebarHead}>
        <h2 className={styles.sidebarTitle}>{title}</h2>
        <span className={styles.suits} aria-hidden>
          <span className={styles.suitRed}>♥</span>♠<span className={styles.suitRed}>♦</span>♣
        </span>
        <button
          type="button"
          className={styles.sidebarToggle}
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>
      <div id={bodyId} className={styles.sidebarFold} data-open={open}>
        {children}
      </div>
    </>
  );
}
