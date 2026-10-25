import type { SVGProps } from "react";
import styles from "./motifs.module.css";

type Props = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number;
  title?: string;
  /** Ticking hands. Off for tiny inline uses where motion would distract. */
  ticking?: boolean;
};

/**
 * The White Rabbit's pocket watch. When ticking, the violet second hand jumps once a second
 * and the minute hand creeps round. Both stop under reduced motion (see globals.css).
 */
export function PocketWatch({ size = 64, title, ticking = true, ...rest }: Props) {
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };
  return (
    <svg viewBox="0 0 64 72" width={size} height={(size * 72) / 64} {...a11y} {...rest}>
      <path d="M26 6 h12 v6 h-12z" fill="var(--yellow)" stroke="var(--black)" strokeWidth="2.5" />
      <circle cx="32" cy="42" r="26" fill="var(--yellow)" stroke="var(--black)" strokeWidth="2.5" />
      <circle cx="32" cy="42" r="19" fill="var(--white)" stroke="var(--black)" strokeWidth="2" />
      <g stroke="var(--black)" strokeWidth="2" strokeLinecap="round">
        <path d="M32 26 v3" />
        <path d="M32 55 v3" />
        <path d="M16 42 h3" />
        <path d="M45 42 h3" />
        <path className={ticking ? styles.minuteHand : undefined} d="M32 42 V31" />
        <path d="M32 42 L38 45" />
      </g>
      <path
        className={ticking ? styles.secondHand : undefined}
        d="M32 46 V26"
        stroke="var(--violet)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="32" cy="42" r="2.4" fill="var(--violet)" />
    </svg>
  );
}
