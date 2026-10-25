import type { Metadata } from "next";
import { Flower } from "@/components/motifs";
import { AppLayout, SectionHeading, Sidebar } from "@/components/shell";
import { Placeholder, PlaceholderGroup } from "@/components/shell/Placeholder";
import { getEntries } from "@/lib/data";

export const metadata: Metadata = { title: "Library" };

export default function LibraryPage() {
  const entries = getEntries();
  return (
    <AppLayout
      sidebar={
        <Sidebar title="Filters" label="Library filters">
          <PlaceholderGroup label="Layer" color="--blue">Filters arrive in step 6.</PlaceholderGroup>
          <PlaceholderGroup label="Origin" color="--yellow">Origin, Status, Target, Stack, Feature.</PlaceholderGroup>
        </Sidebar>
      }
    >
      <SectionHeading number="01" title="Library" subtitle={`${entries.length} entries · newest first`} decoration={<Flower size={28} />} />
      <Placeholder>The search bar and card grid arrive in step 6.</Placeholder>
    </AppLayout>
  );
}
