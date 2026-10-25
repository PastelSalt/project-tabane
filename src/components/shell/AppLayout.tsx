import type { ReactNode } from "react";
import { MoekoWorksLogo } from "@/components/motifs";
import { SidebarFrame } from "./SidebarFrame";
import styles from "./shell.module.css";

/**
 * Every page's layout from Kyle's wireframe: the reusable left sidebar and the main area.
 * On a phone the sidebar moves above the main area.
 */
export function AppLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.app}>
      {sidebar}
      <main id="main" className={styles.main}>
        {children}
      </main>
    </div>
  );
}

/** The sidebar card: a heading with card suits, the page's own content, and the Moeko Works logo at the bottom. */
export function Sidebar({ title, label, children }: { title: string; label: string; children: ReactNode }) {
  return (
    <aside className={styles.sidebar} aria-label={label}>
      <SidebarFrame title={title}>
        <div className={styles.sidebarBody}>{children}</div>
        <div className={styles.sidebarFoot}>
          <MoekoWorksLogo />
          <small>Private library of Moeko Works</small>
        </div>
      </SidebarFrame>
    </aside>
  );
}

/** The numbered section heading: a tilted yellow number badge, the page name, a subtitle, and room for actions. */
export function SectionHeading({
  number,
  title,
  subtitle,
  decoration,
  children,
}: {
  number: string;
  title: string;
  subtitle?: ReactNode;
  decoration?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={styles.sectionHead}>
      <div className={styles.numberBadge} aria-hidden>
        {number}
      </div>
      <div className={styles.sectionTitle}>
        <h1>
          {title}
          {decoration}
        </h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children ? <div className={styles.sectionActions}>{children}</div> : null}
    </div>
  );
}
