import type { Metadata } from "next";
import { CodeList, type SampleCode } from "@/components/access/CodeList";
import styles from "@/components/access/access.module.css";
import { Panel } from "@/components/entry/Panel";
import { CarrotPod, PocketWatch } from "@/components/motifs";
import { AppLayout, SectionHeading, Sidebar } from "@/components/shell";
import { getEntries } from "@/lib/data";

export const metadata: Metadata = { title: "Access codes" };

/** Sample codes for the look of the list. Real codes arrive with Neon in Phase 5. */
const sampleCodes: SampleCode[] = [
  { id: "a", label: "Sample · Client preview", created: "2026.10.25 09:00", expires: "2026.10.27 09:00", state: "unused" },
  { id: "b", label: "Sample · Job interview", created: "2026.10.24 14:30", expires: "2026.10.26 14:30", state: "in-use" },
  { id: "c", label: "Sample · Friend", created: "2026.10.20 18:00", expires: "2026.10.22 18:00", state: "used" },
  { id: "d", label: "Sample · Old pitch", created: "2026.10.10 10:00", expires: "2026.10.12 10:00", state: "expired" },
  { id: "e", label: "Sample · Sent by mistake", created: "2026.10.18 11:15", expires: "2026.10.18 11:40", state: "revoked" },
];

/** 03 Access codes: make one-time codes for visitors, see and revoke them. Look only until Phase 5. */
export default function AccessCodesPage() {
  const shared = getEntries({}, "visitor").length;
  const total = getEntries().length;

  const sidebar = (
    <Sidebar title="About codes" label="About access codes">
      <ul className={styles.rules}>
        <li>A code works once, within 48 hours of being made.</li>
        <li>Using it starts a visitor session that ends when those 48 hours are up.</li>
        <li>Revoking a code also ends any session it started.</li>
        <li>Codes are stored hashed, so each one is shown only once, when it is made.</li>
        <li>
          Visitors see only Shared entries ({shared} of {total} right now), never the Playbook, this page or private
          repository links.
        </li>
      </ul>
    </Sidebar>
  );

  return (
    <AppLayout sidebar={sidebar}>
      <SectionHeading
        number="03"
        title="Access codes"
        subtitle="One-time codes for clients and employers"
        decoration={<PocketWatch size={30} />}
      />

      <p className={styles.phaseNote}>
        <CarrotPod size={20} />
        Look only: making and revoking codes starts working in Phase 5, with sign-in. The codes below are samples.
      </p>

      <Panel title="Make a code" color="blue" tape="yellow">
        <form className={styles.make} aria-describedby="make-hint">
          <div className={styles.makeRow}>
            <label htmlFor="code-label" className="visually-hidden">
              Who is it for?
            </label>
            <input id="code-label" name="label" placeholder="Who is it for? e.g. Client preview" disabled />
            <button type="submit" disabled>
              Make a 48-hour code
            </button>
          </div>
          <p id="make-hint" className={styles.hint}>
            The new code appears here once. Copy it and send it; Tabane keeps only its hash.
          </p>
        </form>
      </Panel>

      <Panel title="Codes" color="violet" actions={<span>{sampleCodes.length} samples</span>}>
        <CodeList codes={sampleCodes} />
      </Panel>
    </AppLayout>
  );
}
