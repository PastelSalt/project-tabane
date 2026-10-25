import type { Metadata } from "next";
import { Flower } from "@/components/motifs";
import { AppLayout, SectionHeading, Sidebar } from "@/components/shell";
import { Placeholder, PlaceholderGroup } from "@/components/shell/Placeholder";
import { getPlaybooks } from "@/lib/data";

export const metadata: Metadata = { title: "Playbook" };

export default function PlaybookPage() {
  const playbooks = getPlaybooks();
  return (
    <AppLayout
      sidebar={
        <Sidebar title="Filters" label="Playbook filters">
          <PlaceholderGroup label="Kind" color="--violet">Filters arrive in step 10.</PlaceholderGroup>
          <PlaceholderGroup label="Status" color="--yellow">Status and Target.</PlaceholderGroup>
        </Sidebar>
      }
    >
      <SectionHeading number="02" title="Playbook" subtitle={`${playbooks.length} playbooks · owner only`} decoration={<Flower size={28} />} />
      <Placeholder>Playbook cards arrive in step 10.</Placeholder>
    </AppLayout>
  );
}
