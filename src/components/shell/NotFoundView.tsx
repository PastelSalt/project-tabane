import Link from "next/link";
import { FilterSidebar } from "@/components/library/FilterSidebar";
import { CarrotPod, Teacup } from "@/components/motifs";
import { countTags, getEntries } from "@/lib/data";
import { AppLayout, SectionHeading } from "./AppLayout";
import styles from "./notFound.module.css";

/** Not-found page: the Library filters on the left, the carrot pod and ways back on the right. */
export function NotFoundView({ title, message }: { title: string; message: string }) {
  return (
    <AppLayout sidebar={<FilterSidebar filters={{}} counts={countTags(getEntries())} />}>
      <SectionHeading number="?" title={title} subtitle="404 · down the rabbit hole" />
      <div className={styles.box}>
        <CarrotPod size={56} />
        <div>
          <p>{message}</p>
          <div className={styles.ways}>
            <Link href="/library" className={styles.way}>
              Go to the Library
            </Link>
            <Link href="/playbook" className={styles.way}>
              Go to the Playbook
            </Link>
          </div>
        </div>
        <Teacup size={70} className={styles.cup} />
      </div>
    </AppLayout>
  );
}
