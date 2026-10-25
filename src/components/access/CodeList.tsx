"use client";

import { useState } from "react";
import styles from "./access.module.css";

export type SampleCode = {
  id: string;
  /** Who the code was made for. Codes themselves are stored hashed, so only the label is shown. */
  label: string;
  created: string;
  expires: string;
  state: "unused" | "in-use" | "used" | "expired" | "revoked";
};

const stateText: Record<SampleCode["state"], string> = {
  unused: "Not used yet",
  "in-use": "In use",
  used: "Session ended",
  expired: "Expired unused",
  revoked: "Revoked",
};

/**
 * The code list with revoke and its inline confirmation (no popups).
 * Look only in Phase 1: confirming says so instead of pretending to revoke.
 */
export function CodeList({ codes }: { codes: SampleCode[] }) {
  const [confirming, setConfirming] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <ul className={styles.list}>
      {codes.map((code) => {
        const live = code.state === "unused" || code.state === "in-use";
        return (
          <li key={code.id} className={styles.code}>
            <div className={styles.codeMain}>
              <strong>{code.label}</strong>
              <span className={`${styles.state} ${styles[`state-${code.state}`]}`}>{stateText[code.state]}</span>
            </div>
            <div className={styles.times}>
              <span>Made {code.created}</span>
              <span>{live ? "Ends" : "Ended"} {code.expires}</span>
            </div>
            {live ? (
              confirming === code.id ? (
                <div className={styles.confirm} role="group" aria-label={`Revoke the code for ${code.label}?`}>
                  <span>Revoke this code? Anyone using it is signed out.</span>
                  <button
                    type="button"
                    className={styles.danger}
                    onClick={() => {
                      setConfirming(null);
                      setNotice(code.id);
                    }}
                  >
                    Yes, revoke
                  </button>
                  <button type="button" className={styles.quiet} onClick={() => setConfirming(null)}>
                    Keep it
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.quiet}
                  onClick={() => {
                    setConfirming(code.id);
                    setNotice(null);
                  }}
                >
                  Revoke
                </button>
              )
            ) : null}
            {notice === code.id ? (
              <p className={styles.notice} role="status">
                Nothing was changed: revoking starts working in Phase 5.
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
