// Entry images, served from the entry's own folder (PHASE-2.md step 4): /content/<slug>/<file>.
// Images stay out of public/, so later the login and Shared rules can protect them here.
// Only plain file names of an allowed type, inside one entry folder: no "..", no slashes, no other folders.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { NextRequest } from "next/server";
import { contentRoot } from "@/lib/content";

const TYPES: Record<string, string> = {
  svg: "image/svg+xml",
  png: "image/png",
  webp: "image/webp",
  jpg: "image/jpeg",
  webm: "video/webm",
};
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FILE = /^[a-z0-9]+(-[a-z0-9]+)*\.([a-z0-9]+)$/;

export async function GET(_request: NextRequest, ctx: RouteContext<"/content/[slug]/[file]">) {
  const { slug, file } = await ctx.params;
  const type = TYPES[FILE.exec(file)?.[2] ?? ""];
  if (!SLUG.test(slug) || !type) return new Response("Not found", { status: 404 });
  try {
    const body = await readFile(join(process.cwd(), contentRoot(), "entries", slug, file));
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": type,
        "Cache-Control": process.env.NODE_ENV === "production" ? "public, max-age=3600" : "no-store",
        "X-Content-Type-Options": "nosniff",
        // an SVG opened on its own can't run scripts or load anything
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
