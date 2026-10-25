// Writes wireframe.svg / wireframe-phone.svg from every entry's wireframe.yml (the wireframe kit, PHASE-2.md step 7).
// Usage: npm run wireframes [-- <slug> …]   (default: every entry in content/ and content-samples/ with a wireframe.yml)

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { listContent } from "../src/lib/content";
import { renderSpec } from "./wireframe-kit";

const only = new Set(process.argv.slice(2));
let written = 0;
let failed = 0;
for (const root of ["content", "content-samples"]) {
  for (const slug of listContent(root).entrySlugs) {
    if (only.size && !only.has(slug)) continue;
    const dir = join(root, "entries", slug);
    const spec = join(dir, "wireframe.yml");
    if (!existsSync(spec)) continue;
    try {
      for (const [file, svg] of Object.entries(renderSpec(readFileSync(spec, "utf8")))) {
        writeFileSync(join(dir, file), svg);
        written++;
      }
    } catch (error) {
      failed++;
      console.error(`${dir}/wireframe.yml: ${(error as Error).message}`);
    }
  }
}
console.log(`${written} wireframe file${written === 1 ? "" : "s"} written${failed ? `, ${failed} failed` : ""}`);
process.exit(failed ? 1 : 0);
