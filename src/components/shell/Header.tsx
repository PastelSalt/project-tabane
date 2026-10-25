import Link from "next/link";
import { ChessStrip, RabbitEars } from "@/components/motifs";
import { NavPills } from "./NavPills";
import styles from "./shell.module.css";

/** Full-width blue bar: logo on the left, page links in the middle, owner on the right. */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/library" className={styles.brand} aria-label="Tabane, go to the Library">
          <span className={styles.brandMark}>
            <RabbitEars size={36} />
          </span>
          <span className={styles.brandWord}>Tabane</span>
        </Link>
        <NavPills />
        <OwnerBadge />
      </div>
      <ChessStrip />
    </header>
  );
}

/** Who is signed in. A fixed placeholder until GitHub sign-in arrives in Phase 5. */
function OwnerBadge() {
  return (
    <div className={styles.owner} title="Placeholder until GitHub sign-in arrives in Phase 5">
      <span className={styles.ownerText}>Signed in with GitHub</span>
      <span className={styles.avatar} aria-hidden>
        PS
      </span>
    </div>
  );
}
