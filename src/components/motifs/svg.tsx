import type { SVGProps } from "react";

// Hand-drawn SVG motifs. All original line art drawn for Tabane; colors come from the tokens.
// Decorative by default (hidden from screen readers); pass `title` to give one a name.

type MotifProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number;
  title?: string;
};

function a11y(title?: string) {
  return title ? { role: "img", "aria-label": title } : { "aria-hidden": true };
}

/** The Tabane logo: robotic rabbit ears, white with violet inner lines. */
export function RabbitEars({ size = 40, title, ...rest }: MotifProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} {...a11y(title)} {...rest}>
      <path d="M12 34 C6 22 6 6 12 4 C18 6 18 22 16 34" fill="var(--white)" stroke="var(--black)" strokeWidth="2" />
      <path d="M12 28 C9 20 9 10 12 8" fill="none" stroke="var(--violet)" strokeWidth="2" />
      <path d="M24 34 C24 22 26 7 32 5 C37 8 33 22 28 34" fill="var(--white)" stroke="var(--black)" strokeWidth="2" />
      <path d="M27 28 C28 20 29 12 32 9" fill="none" stroke="var(--violet)" strokeWidth="2" />
      <path d="M8 34 H32" stroke="var(--black)" strokeWidth="2" />
    </svg>
  );
}

/** Five-petal flower, yellow with a violet centre. */
export function Flower({ size = 24, title, ...rest }: MotifProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...a11y(title)} {...rest}>
      <g fill="var(--yellow)" stroke="var(--black)" strokeWidth="1.4">
        <circle cx="12" cy="6" r="4" />
        <circle cx="17.7" cy="10.2" r="4" />
        <circle cx="15.5" cy="17" r="4" />
        <circle cx="8.5" cy="17" r="4" />
        <circle cx="6.3" cy="10.2" r="4" />
      </g>
      <circle cx="12" cy="12" r="2.6" fill="var(--violet)" stroke="var(--black)" strokeWidth="1.2" />
    </svg>
  );
}

/** Tea-party cup on a blue saucer. */
export function Teacup({ size = 80, title, ...rest }: MotifProps) {
  return (
    <svg viewBox="0 0 80 60" width={size} height={(size * 60) / 80} {...a11y(title)} {...rest}>
      <ellipse cx="38" cy="52" rx="30" ry="6" fill="var(--blue)" stroke="var(--black)" strokeWidth="2.5" />
      <path d="M14 18 h48 c0 18 -8 30 -24 30 c-16 0 -24 -12 -24 -30z" fill="var(--white)" stroke="var(--black)" strokeWidth="2.5" />
      <path d="M62 24 c10 0 10 14 -2 14" fill="none" stroke="var(--black)" strokeWidth="2.5" />
      <path d="M22 28 c6 4 26 4 32 0" fill="none" stroke="var(--blue)" strokeWidth="3" />
      <circle cx="30" cy="36" r="2.2" fill="var(--violet)" />
      <circle cx="38" cy="38" r="2.2" fill="var(--yellow)" stroke="var(--black)" strokeWidth="0.8" />
      <circle cx="46" cy="36" r="2.2" fill="var(--violet)" />
      <path
        d="M30 6 c-4 4 4 6 0 10 M40 4 c-4 4 4 6 0 10"
        fill="none"
        stroke="var(--black)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The carrot-shaped pod Tabane arrives in. */
export function CarrotPod({ size = 34, title, ...rest }: MotifProps) {
  return (
    <svg viewBox="0 0 40 80" width={size} height={size * 2} {...a11y(title)} {...rest}>
      <path d="M20 76 L8 26 C8 18 32 18 32 26 Z" fill="var(--yellow)" stroke="var(--black)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M12 38 h8 M14 50 h8 M17 62 h6" stroke="var(--black)" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M20 20 C14 10 10 8 8 2 C16 4 19 10 20 16 C21 10 24 4 32 2 C30 8 26 10 20 20Z"
        fill="var(--blue)"
        stroke="var(--black)"
        strokeWidth="2"
      />
    </svg>
  );
}
