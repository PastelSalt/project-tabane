import type { Suit } from "@/components/motifs";

const suits: Suit[] = ["heart", "club", "diamond", "spade"];

/** The same entry always gets the same playing-card suit, on its card and its page. */
export function suitFor(slug: string): Suit {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return suits[hash % suits.length];
}

/** 2026-10-04 → 2026.10.04 */
export function formatDate(date: string): string {
  return date.replaceAll("-", ".");
}
