// Reads entries and playbooks from the content folder (spec: "Data and storage"). Server-only: uses the file system.
// TABANE_CONTENT picks the folder: "content" (the real library) or "content-samples" (Phase 1 samples, for UI
// testing). Until Phase 2 step 15 the samples are the default, so the site keeps working while real entries are added.
// Read once per server start in production, again on every call in development so edits show at once.
// The same parser is used by scripts/check-content.ts, which reports every problem instead of stopping at the first.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import type { Diagram, Entry, Image, Playbook } from "./types";

export const contentRoot = () => process.env.TABANE_CONTENT || "content-samples";
// The content folders reach the server through next.config.ts outputFileTracingIncludes, so the tracer can skip this.
const abs = (...parts: string[]) => join(/*turbopackIgnore: true*/ process.cwd(), ...parts);

export type Content = { entries: Entry[]; playbooks: Playbook[] };

/** Front matter (YAML between the first two `---` lines) and the Markdown body. */
export function splitFrontMatter(text: string): { data: Record<string, unknown>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error("no front matter (the file must start with ---)");
  const data = parse(match[1]);
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("front matter is not a YAML map");
  return { data: data as Record<string, unknown>, body: match[2] };
}

/** The body's `## Heading` sections, by heading text. */
export function sections(body: string): Map<string, string> {
  const out = new Map<string, string>();
  const parts = body.replace(/\r\n/g, "\n").split(/^## +(.+)$/m);
  for (let i = 1; i < parts.length; i += 2) out.set(parts[i].trim(), parts[i + 1].trim());
  return out;
}

/** Width and height of an SVG (width/height or viewBox), PNG (IHDR) or WebP (VP8, VP8L, VP8X) file. */
export function imageSize(file: string): { width: number; height: number } {
  if (file.endsWith(".png")) {
    const buf = readFileSync(file);
    if (buf.toString("ascii", 1, 4) !== "PNG") throw new Error(`${file} is not a PNG`);
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (file.endsWith(".webp")) {
    const buf = readFileSync(file);
    if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") throw new Error(`${file} is not a WebP`);
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const [b0, b1, b2, b3] = [buf[21], buf[22], buf[23], buf[24]];
      return { width: 1 + (((b1 & 0x3f) << 8) | b0), height: 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)) };
    }
    throw new Error(`${file}: unknown WebP chunk "${chunk}"`);
  }
  if (file.endsWith(".svg")) {
    const head = readFileSync(file, "utf8").slice(0, 2000);
    const svg = /<svg\b[^>]*>/.exec(head)?.[0] ?? "";
    const num = (name: string) => Number(new RegExp(`\\s${name}="([\\d.]+)(px)?"`).exec(svg)?.[1]);
    const box = /viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/.exec(svg);
    const width = num("width") || Number(box?.[1]);
    const height = num("height") || Number(box?.[2]);
    if (!width || !height) throw new Error(`${file}: SVG needs width/height or a viewBox`);
    return { width, height };
  }
  throw new Error(`${file}: only .svg, .png and .webp images are supported`);
}

type FileRef = string | { file: string; alt?: string };
const fileOf = (ref: FileRef) => (typeof ref === "string" ? ref : ref.file);

function image(slug: string, dir: string, ref: FileRef, fallbackAlt: string): Image {
  const file = fileOf(ref);
  const { width, height } = imageSize(join(dir, file));
  const alt = (typeof ref === "object" && ref.alt) || fallbackAlt;
  return { src: `/content/${slug}/${file}`, alt, width, height };
}

/** One entry folder → Entry. Throws with a readable message when something can't be read. */
export function readEntry(root: string, slug: string): Entry {
  const dir = abs(root, "entries", slug);
  const { data: d, body } = splitFrontMatter(readFileSync(join(dir, "entry.md"), "utf8"));
  const parts = sections(body);
  const title = String(d.title ?? "");

  const keyCodeBlock = parts.get("Key code");
  let keyCode: Entry["keyCode"];
  if (keyCodeBlock) {
    const m = /^```(\w+)\s+path=(\S+)\n([\s\S]*?)\n```/m.exec(keyCodeBlock);
    if (!m) throw new Error("## Key code needs one fenced block: ```lang path=file/path");
    keyCode = { language: m[1], path: m[2], code: m[3] };
  }

  const wf = d.wireframe as { desktop?: FileRef; phone?: FileRef } | undefined;
  const clip = d.clip as { file: string; poster?: string } | undefined;
  const diagrams = (d.diagrams as (Omit<Diagram, "mermaid"> & { file: string })[] | undefined)?.map(
    ({ file, ...diagram }) => ({ ...diagram, mermaid: readFileSync(join(dir, file), "utf8").trim() }),
  );

  return {
    slug,
    title,
    layer: d.layer as Entry["layer"],
    origin: d.origin as Entry["origin"],
    stack: (d.stack as string[]) ?? [],
    feature: (d.feature as string[]) ?? [],
    status: d.status as Entry["status"],
    target: d.target as Entry["target"],
    reuseNote: String(d.reuseNote ?? ""),
    liveSite: d.liveSite as Entry["liveSite"],
    repository: d.repository as Entry["repository"],
    codeLocation: d.codeLocation
      ? { ...(d.codeLocation as { path: string; ref: string }), ref: String((d.codeLocation as { ref: unknown }).ref) }
      : undefined,
    keyCode,
    sourceAndLicense: d.sourceAndLicense as string | undefined,
    projectFile: d.projectFile as string | undefined,
    wireframe: wf
      ? {
          desktop: wf.desktop ? image(slug, dir, wf.desktop, `${title}: wireframe`) : undefined,
          phone: wf.phone ? image(slug, dir, wf.phone, `${title}: phone wireframe`) : undefined,
        }
      : undefined,
    screenshots: (d.screenshots as FileRef[] | undefined)?.map((ref, i) => image(slug, dir, ref, `${title}: screenshot ${i + 1}`)),
    clip: clip
      ? { src: `/content/${slug}/${clip.file}`, poster: clip.poster ? `/content/${slug}/${clip.poster}` : undefined }
      : undefined,
    technicalDetails: parts.get("Technical details") ?? "",
    diagrams,
    related: (d.related as string[]) ?? [],
    usedIn: (d.usedIn as string[]) ?? [],
    shared: d.shared === true,
    lastChecked: d.lastChecked as string | undefined,
    created: String(d.created ?? ""),
    updated: String(d.updated ?? ""),
  };
}

const bullets = (text = "") =>
  text
    .split("\n")
    .filter((line) => /^\s*[-*] /.test(line))
    .map((line) => line.replace(/^\s*[-*] /, "").trim());

/** One playbook file → Playbook. */
export function readPlaybook(root: string, slug: string): Playbook {
  const { data: d, body } = splitFrontMatter(readFileSync(abs(root, "playbooks", `${slug}.md`), "utf8"));
  const parts = sections(body);
  const stepsText = parts.get("Steps") ?? "";
  const steps = stepsText
    .split(/^### +(.+)$/m)
    .slice(1)
    .reduce<{ title: string; body: string }[]>((acc, part, i, all) => {
      if (i % 2 === 0) acc.push({ title: part.trim(), body: (all[i + 1] ?? "").trim() });
      return acc;
    }, []);
  const basedOn = (d.basedOn ?? {}) as Partial<Playbook["basedOn"]>;
  return {
    slug,
    title: String(d.title ?? ""),
    kind: d.kind as Playbook["kind"],
    goal: String(d.goal ?? ""),
    basedOn: { entries: basedOn.entries ?? [], sites: basedOn.sites ?? [] },
    beforeYouStart: bullets(parts.get("Before you start")),
    steps,
    gotchas: bullets(parts.get("Gotchas")),
    finishedLooksLike: parts.get("Finished looks like") ?? "",
    lastVerified: d.lastVerified ? String(d.lastVerified) : undefined,
    status: d.status as Playbook["status"],
    target: d.target as Playbook["target"],
    projectFile: d.projectFile as string | undefined,
  };
}

/** Entry folder names and playbook slugs in a content root. */
export function listContent(root = contentRoot()) {
  const entriesDir = abs(root, "entries");
  const playbooksDir = abs(root, "playbooks");
  return {
    entrySlugs: existsSync(entriesDir)
      ? readdirSync(entriesDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
      : [],
    playbookSlugs: existsSync(playbooksDir)
      ? readdirSync(playbooksDir).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3)).sort()
      : [],
  };
}

let cached: Content | undefined;

/** Everything in the content folder. The site build fails loudly if a file can't be read. */
export function loadContent(): Content {
  if (cached && process.env.NODE_ENV === "production") return cached;
  const root = contentRoot();
  const { entrySlugs, playbookSlugs } = listContent(root);
  const read = <T,>(what: string, slug: string, fn: () => T): T => {
    try {
      return fn();
    } catch (error) {
      throw new Error(`${root}/${what}/${slug}: ${(error as Error).message}`);
    }
  };
  cached = {
    entries: entrySlugs.map((slug) => read("entries", slug, () => readEntry(root, slug))),
    playbooks: playbookSlugs.map((slug) => read("playbooks", slug, () => readPlaybook(root, slug))),
  };
  return cached;
}
