import type { Metadata } from "next";
import { PocketWatch } from "@/components/motifs";
import { AppLayout, SectionHeading, Sidebar } from "@/components/shell";
import { Placeholder, PlaceholderGroup } from "@/components/shell/Placeholder";

export const metadata: Metadata = { title: "Access codes" };

export default function AccessCodesPage() {
  return (
    <AppLayout
      sidebar={
        <Sidebar title="About codes" label="About access codes">
          <PlaceholderGroup label="How codes work" color="--blue">
            One use, within 48 hours. Visitors see only Shared entries.
          </PlaceholderGroup>
        </Sidebar>
      }
    >
      <SectionHeading
        number="03"
        title="Access codes"
        subtitle="Look only until Phase 5"
        decoration={<PocketWatch size={30} />}
      />
      <Placeholder>The code list arrives in step 11.</Placeholder>
    </AppLayout>
  );
}
