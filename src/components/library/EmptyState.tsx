import Link from "next/link";
import { CarrotPod } from "@/components/motifs";
import styles from "./library.module.css";

/** Shown when nothing matches: the carrot pod, and a way back to everything. */
export function EmptyState({
  title = "No entries match",
  href = "/library",
  linkText = "see every entry",
}: {
  title?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className={styles.empty}>
      <CarrotPod size={40} />
      <div>
        <h2>{title}</h2>
        <p>
          Try fewer filters or a different word, or <Link href={href}>{linkText}</Link>.
        </p>
      </div>
    </div>
  );
}
