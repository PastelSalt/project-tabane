import Link from "next/link";
import Markdown from "react-markdown";
import { getEntry, getPlaybook } from "@/lib/data";

/**
 * Playbook text in Markdown (code, bold, links). A code span that is an entry's or playbook's slug, such as `kotoha-admin-auth`,
 * links to it. `inline` drops the paragraph wrapper, for list items.
 */
export function PlaybookText({ text, inline = false }: { text: string; inline?: boolean }) {
  return (
    <Markdown
      components={{
        p: ({ children }) => (inline ? <>{children}</> : <p>{children}</p>),
        code: ({ children }) => {
          const value = String(children);
          const entry = getEntry(value);
          const playbook = entry ? undefined : getPlaybook(value);
          const target = entry ? { href: `/library/${entry.slug}`, title: entry.title } : playbook ? { href: `/playbook/${playbook.slug}`, title: playbook.title } : null;
          return target ? (
            <Link href={target.href} title={target.title}>
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
