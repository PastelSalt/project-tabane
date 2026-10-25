// Screenshot capture (PHASE-2.md step 8). All five first projects refuse to be shown in a frame, so UI/UX entries
// show WebP screenshots saved from the live site. Each entry folder may hold a capture.yml:
//
//   site: kotoha-fansite                 # a key in scripts/screenshot-sites.yml
//   shots:
//     - file: screenshot-desktop.webp    # written into the entry's folder (WebP: a tenth of a PNG's size)
//       device: desktop                  # desktop (1366×768) | phone (390×844 at 2×)
//       path: /                          # optional, added to the site's url
//       scrollTo: "#home"                # optional: scroll this element to the top of the screen first
//       before: "document.querySelector('#menu-button').click()"   # optional JS before the shot
//       wait: 800                        # optional extra milliseconds before the shot
//       element: "#home"                 # optional: capture this whole element instead of the screen
//       maxHeight: 1400                  # with element: cap the height
//
// Usage: npm run screenshots -- <entry slug | site key> …
// Analytics are blocked per site (screenshot-sites.yml), and the run reports how many requests it blocked.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { listContent } from "../src/lib/content";
import { launchChrome, sleep, type Page } from "./cdp";

type Site = { url: string; block?: string[]; local?: Record<string, string>; session?: Record<string, string>; ready?: string; settle?: number; motion?: boolean };
type Shot = { file: string; device?: "desktop" | "phone"; path?: string; scrollTo?: string; before?: string; wait?: number; element?: string; maxHeight?: number };
type Capture = { site: string; shots: Shot[] };

const sites = parse(readFileSync(join("scripts", "screenshot-sites.yml"), "utf8")) as Record<string, Site>;
const DEVICES = {
  desktop: { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false },
  phone: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
};
const PHONE_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";

// which entries to capture
const args = process.argv.slice(2);
if (!args.length) {
  console.error("Usage: npm run screenshots -- <entry slug | site key> …");
  process.exit(1);
}
const jobs: { dir: string; slug: string; capture: Capture }[] = [];
for (const root of ["content", "content-samples"]) {
  for (const slug of listContent(root).entrySlugs) {
    const file = join(root, "entries", slug, "capture.yml");
    if (!existsSync(file)) continue;
    const capture = parse(readFileSync(file, "utf8")) as Capture;
    if (args.includes(slug) || args.includes(capture.site)) jobs.push({ dir: join(root, "entries", slug), slug, capture });
  }
}
if (!jobs.length) {
  console.error(`No capture.yml found for: ${args.join(", ")}`);
  process.exit(1);
}

async function preparePage(page: Page, site: Site, device: "desktop" | "phone", blocked: { count: number }) {
  await page.send("Network.setBlockedURLs", { urls: site.block ?? [] });
  page.on("Network.loadingFailed", (p) => {
    if (p.blockedReason) blocked.count++;
  });
  await page.send("Emulation.setDeviceMetricsOverride", DEVICES[device]);
  if (device === "phone") {
    await page.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await page.send("Network.setUserAgentOverride", { userAgent: PHONE_UA });
  }
  await page.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: site.motion ? "no-preference" : "reduce" }],
  });
  // storage before the site's own scripts run, on its own origin only
  const origin = new URL(site.url).origin;
  const sets = [
    ...Object.entries(site.local ?? {}).map(([k, v]) => `localStorage.setItem(${JSON.stringify(k)}, ${JSON.stringify(v)});`),
    ...Object.entries(site.session ?? {}).map(([k, v]) => `sessionStorage.setItem(${JSON.stringify(k)}, ${JSON.stringify(v)});`),
  ].join("");
  if (sets) await page.send("Page.addScriptToEvaluateOnNewDocument", { source: `if (location.origin === ${JSON.stringify(origin)}) { try { ${sets} } catch (e) {} }` });
}

async function shoot(page: Page, shot: Shot): Promise<Buffer> {
  if (shot.scrollTo) {
    await page.eval(`(() => { const el = document.querySelector(${JSON.stringify(shot.scrollTo)}); if (!el) throw new Error('scrollTo: no element ' + ${JSON.stringify(shot.scrollTo)}); window.scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'instant' }); })()`);
  }
  if (shot.before) await page.eval(shot.before);
  await sleep(shot.wait ?? 1200);
  let clip: Record<string, number> | undefined;
  if (shot.element) {
    const rect = await page.eval<{ x: number; y: number; width: number; height: number }>(
      `(() => { const el = document.querySelector(${JSON.stringify(shot.element)}); if (!el) throw new Error('element: no element ' + ${JSON.stringify(shot.element)}); const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; })()`,
    );
    clip = { ...rect, height: Math.min(rect.height, shot.maxHeight ?? 1400), scale: 1 };
  }
  const { data } = await page.send<{ data: string }>("Page.captureScreenshot", {
    format: "webp",
    quality: 82,
    ...(clip ? { clip, captureBeyondViewport: true } : {}),
  });
  return Buffer.from(data, "base64");
}

async function main() {
  const chrome = await launchChrome();
  let failed = 0;
  try {
    for (const job of jobs) {
      const site = sites[job.capture.site];
      if (!site) {
        console.error(`${job.slug}: site "${job.capture.site}" is not in scripts/screenshot-sites.yml`);
        failed++;
        continue;
      }
      for (const shot of job.capture.shots) {
        const device = shot.device ?? "desktop";
        const blocked = { count: 0 };
        const page = await chrome.newPage();
        try {
          await preparePage(page, site, device, blocked);
          await page.send("Page.navigate", { url: site.url + (shot.path ?? "/") });
          await page.waitFor("document.readyState === 'complete'", 45_000);
          if (site.ready) await page.waitFor(site.ready, 45_000);
          await sleep(site.settle ?? 800);
          const png = await shoot(page, shot);
          writeFileSync(join(job.dir, shot.file), png);
          console.log(`${job.slug}/${shot.file}  ${device}  ${(png.length / 1024).toFixed(0)} KB  (${blocked.count} analytics request${blocked.count === 1 ? "" : "s"} blocked)`);
        } catch (error) {
          failed++;
          console.error(`${job.slug}/${shot.file}: ${(error as Error).message}`);
        } finally {
          page.close();
        }
      }
    }
  } finally {
    await chrome.close();
  }
  process.exit(failed ? 1 : 0);
}

void main();
