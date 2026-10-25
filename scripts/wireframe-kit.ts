// The wireframe kit (PHASE-2.md step 7): turns an entry's wireframe.yml into wireframe.svg (desktop) and
// wireframe-phone.svg (phone), so every wireframe in Tabane has the same plain grey look. Used by
// scripts/wireframes.ts (writes the files) and scripts/check-content.ts (checks they are up to date).
//
// wireframe.yml, in units of 10 px:
//   desktop:                     # and/or phone:
//     size: [144, 90]            # optional; default 144×90 (1440×900) desktop, 39×84 (390×840) phone
//     boxes:
//       - [bar, 0, 0, 144, 7]                       # kind, x, y, w, h, optional label
//       - { kind: panel, x: 33, y: 32, w: 17, h: 20, label: DAYS, r: -3 }   # r = tilt in degrees
//
// Kinds: bar (header/footer strip) · panel (white card) · box (grey area) · dashed (empty or drop zone) ·
// image (picture placeholder) · heading · text (lines of text) · button · pill (chip or tag) · input ·
// circle · dot · line (thin rule, horizontal or vertical) · chart (bars) · label (words only) ·
// note (violet annotation: behaviour you can't see in a still, like "hover: video plays").

import { parse } from "yaml";

const UNIT = 10;
const FONT = "Segoe UI, sans-serif";
const C = { page: "#f4f4f7", light: "#c9c9d2", mid: "#9a9aa3", ink: "#6c6c75", soft: "#e3e3ea", white: "#fff", note: "#7a5cc9" };
export const KINDS = ["bar", "panel", "box", "dashed", "image", "heading", "text", "button", "pill", "input", "circle", "dot", "line", "chart", "label", "note"] as const;
type Kind = (typeof KINDS)[number];
type Box = { kind: Kind; x: number; y: number; w: number; h: number; label?: string; r?: number };
type Frame = { size?: [number, number]; boxes: (Box | [Kind, number, number, number, number, string?])[] };
export type WireframeSpec = { desktop?: Frame; phone?: Frame };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const n = (v: number) => Math.round(v * UNIT * 10) / 10;

function text(x: number, y: number, label: string, size: number, fill: string, anchor = "middle", weight = 700) {
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="middle">${esc(label)}</text>`;
}

/** Centred text that wraps onto as many lines as the box needs, shrinking the size if it still doesn't fit. */
function wrapped(cx: number, cy: number, label: string, size: number, fill: string, maxW: number, maxH: number, weight = 700) {
  const words = label.split(/\s+/);
  for (let s = size; ; s -= 1) {
    const perLine = Math.max(1, Math.floor((maxW - 16) / (s * 0.56)));
    const lines: string[] = [];
    for (const word of words) {
      const last = lines[lines.length - 1];
      if (last !== undefined && (last + " " + word).length <= perLine) lines[lines.length - 1] = `${last} ${word}`;
      else lines.push(word);
    }
    if ((lines.length * s * 1.2 <= maxH - 8 && lines.every((l) => l.length <= perLine)) || s <= 12) {
      if (lines.length === 1) return text(cx, cy, label, s, fill, "middle", weight);
      const top = cy - ((lines.length - 1) * s * 1.2) / 2;
      return lines.map((line, i) => text(cx, top + i * s * 1.2, line, s, fill, "middle", weight)).join("");
    }
  }
}

function draw(b: Box): string {
  const [x, y, w, h] = [n(b.x), n(b.y), n(b.w), n(b.h)];
  const cx = x + w / 2;
  const cy = y + h / 2;
  const fs = Math.max(18, Math.min(30, h * 0.45));
  const corner = (label: string) => text(x + 18, y + 24, label.toUpperCase(), 20, C.ink, "start");
  const fit = (label: string, size: number, fill: string, weight = 700) => wrapped(cx, cy, label, size, fill, w, h, weight);
  switch (b.kind) {
    case "bar":
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.light}"/>${b.label ? text(x + 24, cy, b.label, 22, C.ink, "start") : ""}`;
    case "panel":
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="${C.white}" stroke="${C.mid}" stroke-width="4"/>${b.label ? corner(b.label) : ""}`;
    case "box":
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${C.soft}"/>${b.label ? fit(b.label, fs, C.ink) : ""}`;
    case "dashed":
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="none" stroke="${C.mid}" stroke-width="4" stroke-dasharray="14 10"/>${b.label ? fit(b.label, fs, C.ink) : ""}`;
    case "image":
      return (
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${C.light}"/>` +
        `<path d="M${x + 12} ${y + 12} L${x + w - 12} ${y + h - 12} M${x + w - 12} ${y + 12} L${x + 12} ${y + h - 12}" stroke="${C.page}" stroke-width="4" stroke-linecap="round"/>` +
        (b.label ? `<rect x="${cx - Math.min(w - 24, b.label.length * 13 + 32) / 2}" y="${cy - 18}" width="${Math.min(w - 24, b.label.length * 13 + 32)}" height="36" rx="18" fill="${C.light}"/>${text(cx, cy, b.label, 22, C.ink)}` : "")
      );
    case "heading":
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${C.mid}"/>`;
    case "text": {
      const lines = Math.max(1, Math.floor((b.h + 0.6) / 2));
      return Array.from({ length: lines }, (_, i) => {
        const lw = i === lines - 1 && lines > 1 ? w * 0.6 : w;
        return `<rect x="${x}" y="${y + i * 2 * UNIT}" width="${lw}" height="${UNIT * 1.2}" rx="${UNIT * 0.6}" fill="${C.light}"/>`;
      }).join("");
    }
    case "button":
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${C.mid}"/>${b.label ? text(cx, cy, b.label, Math.min(24, fs), C.white) : ""}`;
    case "pill":
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${C.light}"/>${b.label ? text(cx, cy, b.label, Math.min(20, fs), C.ink, "middle", 600) : ""}`;
    case "input":
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${C.white}" stroke="${C.mid}" stroke-width="3"/>${b.label ? text(x + 18, cy, b.label, 20, C.mid, "start", 500) : ""}`;
    case "circle":
      return `<circle cx="${cx}" cy="${cy}" r="${Math.min(w, h) / 2}" fill="${C.light}"/>${b.label ? text(cx, cy, b.label, Math.min(18, fs), C.ink) : ""}`;
    case "dot":
      return `<circle cx="${cx}" cy="${cy}" r="${Math.min(w, h) / 2}" fill="${C.mid}"/>`;
    case "line":
      return w >= h
        ? `<rect x="${x}" y="${cy - 2}" width="${w}" height="4" rx="2" fill="${C.mid}"/>`
        : `<rect x="${cx - 2}" y="${y}" width="4" height="${h}" rx="2" fill="${C.mid}"/>`;
    case "chart": {
      const bars = Math.max(4, Math.round(b.w / 3));
      const gap = w / bars;
      const heights = [0.35, 0.55, 0.45, 0.7, 0.6, 0.85, 0.5, 0.75, 0.4, 0.9, 0.65, 0.8];
      return (
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${C.white}" stroke="${C.light}" stroke-width="3"/>` +
        Array.from({ length: bars }, (_, i) => {
          const bh = (h - 24) * heights[i % heights.length];
          return `<rect x="${x + i * gap + gap * 0.22}" y="${y + h - 12 - bh}" width="${gap * 0.56}" height="${bh}" rx="4" fill="${C.light}"/>`;
        }).join("")
      );
    }
    case "label":
      return fit(b.label ?? "", fs, C.ink);
    case "note":
      return (
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="none" stroke="${C.note}" stroke-width="3" stroke-dasharray="8 7"/>` +
        (b.label ? fit(b.label, Math.min(22, fs), C.note, 600) : "")
      );
  }
}

function asBox(item: Frame["boxes"][number], where: string): Box {
  const box = Array.isArray(item) ? { kind: item[0], x: item[1], y: item[2], w: item[3], h: item[4], label: item[5] } : item;
  if (!KINDS.includes(box.kind)) throw new Error(`${where}: unknown kind "${box.kind}" (one of ${KINDS.join(", ")})`);
  for (const k of ["x", "y", "w", "h"] as const) {
    if (typeof box[k] !== "number" || Number.isNaN(box[k])) throw new Error(`${where}: "${k}" must be a number`);
  }
  if (box.w <= 0 || box.h <= 0) throw new Error(`${where}: w and h must be above 0`);
  return box;
}

/** One frame → an SVG string. */
export function renderFrame(frame: Frame, which: "desktop" | "phone"): string {
  const [uw, uh] = frame.size ?? (which === "desktop" ? [144, 90] : [39, 84]);
  const [W, H] = [uw * UNIT, uh * UNIT];
  const body = frame.boxes
    .map((item, i) => {
      const box = asBox(item, `${which} box ${i + 1}`);
      if (box.x + box.w > uw + 0.01 || box.y + box.h > uh + 0.01 || box.x < 0 || box.y < 0) {
        throw new Error(`${which} box ${i + 1} (${box.kind}) is outside the ${uw}×${uh} frame`);
      }
      const svg = draw(box);
      if (!box.r) return svg;
      const [cx, cy] = [n(box.x + box.w / 2), n(box.y + box.h / 2)];
      return `<g transform="rotate(${box.r} ${cx} ${cy})">${svg}</g>`;
    })
    .join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">\n<rect width="${W}" height="${H}" fill="${C.page}"/>\n${body}\n</svg>\n`;
}

/** wireframe.yml text → the SVG files it makes ({ "wireframe.svg": "…", "wireframe-phone.svg": "…" }). */
export function renderSpec(yamlText: string): Record<string, string> {
  const spec = parse(yamlText) as WireframeSpec | null;
  if (!spec || (!spec.desktop && !spec.phone)) throw new Error("wireframe.yml needs a desktop: or phone: frame");
  const out: Record<string, string> = {};
  if (spec.desktop) out["wireframe.svg"] = renderFrame(spec.desktop, "desktop");
  if (spec.phone) out["wireframe-phone.svg"] = renderFrame(spec.phone, "phone");
  return out;
}
