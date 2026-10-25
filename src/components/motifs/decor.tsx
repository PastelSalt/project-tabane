import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./motifs.module.css";

export type Suit = "heart" | "spade" | "diamond" | "club";

const suitGlyph: Record<Suit, string> = { heart: "♥", spade: "♠", diamond: "♦", club: "♣" };
const suitName: Record<Suit, string> = { heart: "Hearts", spade: "Spades", diamond: "Diamonds", club: "Clubs" };

/** Playing-card suit in a round white badge. Hearts and diamonds are violet, the others black. */
export function SuitBadge({ suit, size = 32, className }: { suit: Suit; size?: number; className?: string }) {
  const red = suit === "heart" || suit === "diamond";
  return (
    <span
      className={[styles.suit, red ? styles.suitRed : "", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, fontSize: size / 2 }}
      aria-hidden
      title={suitName[suit]}
    >
      {suitGlyph[suit]}
    </span>
  );
}

/** A strip of striped washi tape. The parent positions it. */
export function WashiTape({
  color = "yellow",
  tilt = -3,
  className,
}: {
  color?: "yellow" | "blue";
  tilt?: number;
  className?: string;
}) {
  return (
    <span
      className={[styles.tape, color === "blue" ? styles.tapeBlue : styles.tapeYellow, className].filter(Boolean).join(" ")}
      style={{ ["--tilt" as string]: `${tilt}deg` }}
      aria-hidden
    />
  );
}

/** A small tilted rubber stamp, such as "Genius approved". */
export function Stamp({ children = "Genius approved", tilt = 6, className }: { children?: ReactNode; tilt?: number; className?: string }) {
  return (
    <span className={[styles.stamp, className].filter(Boolean).join(" ")} style={{ ["--tilt" as string]: `${tilt}deg` }} aria-hidden>
      {children}
    </span>
  );
}

/** The black-and-white chessboard strip under the header: Wonderland's floor. */
export function ChessStrip({ className }: { className?: string }) {
  return <div className={[styles.chess, className].filter(Boolean).join(" ")} aria-hidden />;
}

/** The Moeko Works logo, from the Portfolio repository's brand folder. */
export function MoekoWorksLogo({ width = 180, className }: { width?: number; className?: string }) {
  // The logo's viewBox is 3000 x 653
  return (
    <Image
      src="/brand/moekoworks-logo.svg"
      alt="Moeko Works"
      width={width}
      height={Math.round((width * 653) / 3000)}
      className={className}
    />
  );
}
