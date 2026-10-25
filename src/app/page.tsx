import Link from "next/link";

// Temporary home until the Library exists (step 6); then "/" goes to /library.
export default function Home() {
  return (
    <main style={{ padding: "var(--space-9) var(--space-6)" }}>
      <h1 style={{ fontSize: "var(--text-3xl)" }}>Tabane</h1>
      <p style={{ marginTop: "var(--space-3)" }}>
        Phase 1 in progress. See the <Link href="/styleguide">styleguide</Link>.
      </p>
    </main>
  );
}
