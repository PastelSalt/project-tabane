"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./shell.module.css";

const pages = [
  { href: "/library", number: "01", label: "Library" },
  { href: "/playbook", number: "02", label: "Playbook" },
  { href: "/access-codes", number: "03", label: "Access codes" },
] as const;

/** The three page links. The current page is yellow and marked for screen readers. */
export function NavPills() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav} aria-label="Pages">
      {pages.map((page) => {
        const current = pathname === page.href || pathname.startsWith(`${page.href}/`);
        return (
          <Link
            key={page.href}
            href={page.href}
            className={current ? `${styles.navPill} ${styles.navPillCurrent}` : styles.navPill}
            aria-current={current ? "page" : undefined}
          >
            <span className={styles.navNumber}>{page.number}</span>
            {page.label}
          </Link>
        );
      })}
    </nav>
  );
}
