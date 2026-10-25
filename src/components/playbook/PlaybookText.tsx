import Link from "next/link";
import Markdown from "react-markdown";
import { getEntry } from "@/lib/data";

/**
 * Playbook text in Markdown (code, bold, links). A code span that is an entry's slug, such as `kotoha-admin-auth`,
 * links to that entry. `inline` drops the paragraph wrapper, for list items.
 */
export function PlaybookText({ text, inline = false }: { text: string; inline?: boolean }) {
  return (
    <Markdown
      components={{
        p: ({ children }) => (inline ? <>{children}</> : <p>{children}</p>),
        code: ({ children }) => {
          const value = String(children);
          const entry = getEntry(value);
          return entry ? (
            <Link href={`/library/${entry.slug}`} title={entry.title}>
              <code>{value}</code>
            </Link>
          ) : (
            <code>{value}</code>
          );
        },
      }}
    >
      {text}
    </Markdown>
  );
}
