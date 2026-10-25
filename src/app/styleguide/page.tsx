import type { Metadata } from "next";
import {
  CarrotPod,
  ChessStrip,
  Flower,
  MoekoWorksLogo,
  PocketWatch,
  RabbitEars,
  Stamp,
  SuitBadge,
  Teacup,
  WashiTape,
} from "@/components/motifs";
import styles from "./styleguide.module.css";

export const metadata: Metadata = { title: "Styleguide" };

const colors = [
  { name: "Blue", token: "--blue", hex: "#7D98EC", role: "Main: header, main buttons, selected filters, card shadows. Never text." },
  { name: "Yellow", token: "--yellow", hex: "#FFD45C", role: "Main: current page, highlights, number badges, grid major lines." },
  { name: "White", token: "--white", hex: "#FFFFFF", role: "Cards, sidebar and the page under the grid." },
  { name: "Black", token: "--black", hex: "#0B0B0B", role: "Text and outlines." },
  { name: "Violet", token: "--violet", hex: "#9F5CA6", role: "Secondary: Proven labels, accents, sidebar shadow." },
];

const tints = [
  { name: "Blue tint", token: "--blue-tint", hex: "#E4EAFB" },
  { name: "Yellow tint", token: "--yellow-tint", hex: "#FFF4CC" },
  { name: "Violet tint", token: "--violet-tint", hex: "#F1E6F3" },
];

const contrast = [
  { label: "Black on white", bg: "--white", fg: "--black", ratio: "about 20:1", use: "All text" },
  { label: "Black on yellow", bg: "--yellow", fg: "--black", ratio: "about 14:1", use: "Badges, buttons" },
  { label: "Black on blue", bg: "--blue", fg: "--black", ratio: "about 7:1", use: "Header, blue buttons" },
  { label: "White on violet", bg: "--violet", fg: "--white", ratio: "about 4.6:1", use: "Proven labels" },
  { label: "Violet on white", bg: "--white", fg: "--violet", ratio: "about 4.6:1", use: "Accents" },
];

const type = [
  { token: "--text-3xl", size: "44px", sample: "Library" },
  { token: "--text-2xl", size: "32px", sample: "Section heading" },
  { token: "--text-xl", size: "24px", sample: "Panel heading" },
  { token: "--text-lg", size: "18px", sample: "Card title" },
  { token: "--text-md", size: "15px", sample: "Body text, the default size" },
  { token: "--text-sm", size: "13px", sample: "Reuse notes, filters, meta" },
  { token: "--text-xs", size: "12px", sample: "Tags and small labels" },
];

const radii = [
  { token: "--radius-lg", size: "20px", use: "Cards, panels, sidebar" },
  { token: "--radius-md", size: "14px", use: "Inner parts, previews" },
  { token: "--radius-sm", size: "10px", use: "Small boxes, focus ring" },
  { token: "--radius-pill", size: "999px", use: "Buttons, chips, tags" },
];

const shadows = [
  { token: "--shadow-blue", use: "Cards" },
  { token: "--shadow-yellow", use: "Cards" },
  { token: "--shadow-violet", use: "Cards, sidebar" },
  { token: "--shadow-button", use: "Buttons, badges" },
];

const spaces = ["--space-1", "--space-2", "--space-3", "--space-4", "--space-5", "--space-6", "--space-7", "--space-8", "--space-9"];

export default function Styleguide() {
  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1>Styleguide</h1>
        <p>
          Every design token from <code>src/app/globals.css</code>. A working reference for Phase 1; the page background is
          the graph-paper grid itself.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Colors</h2>
        <div className={styles.swatches}>
          {colors.map((c) => (
            <div key={c.token} className={styles.swatch}>
              <div className={styles.chipColor} style={{ background: `var(${c.token})` }} />
              <div className={styles.swatchText}>
                <strong>{c.name}</strong>
                <code>{c.hex}</code>
                <code>{c.token}</code>
                <span>{c.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Tints</h2>
        <p className={styles.note}>Surfaces only, such as card preview backgrounds. Never used for text.</p>
        <div className={styles.swatches}>
          {tints.map((c) => (
            <div key={c.token} className={styles.swatch}>
              <div className={styles.chipColor} style={{ background: `var(${c.token})` }} />
              <div className={styles.swatchText}>
                <strong>{c.name}</strong>
                <code>{c.hex}</code>
                <code>{c.token}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Text on color</h2>
        <p className={styles.note}>Blue on white is about 2.8:1, so blue is never used for text.</p>
        <div className={styles.contrast}>
          {contrast.map((c) => (
            <div key={c.label} className={styles.pair} style={{ background: `var(${c.bg})`, color: `var(${c.fg})` }}>
              <strong>{c.label}</strong>
              <span>
                {c.ratio} · {c.use}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Type</h2>
        <p className={styles.note}>
          Nunito for everything, weights 400 to 800. JetBrains Mono for code: <code>const left = target - now;</code>
        </p>
        <div className={styles.typeList}>
          {type.map((t) => (
            <div key={t.token} className={styles.typeRow}>
              <code>
                {t.token} · {t.size}
              </code>
              <span style={{ fontSize: `var(${t.token})`, fontWeight: t.size === "15px" || t.size === "13px" || t.size === "12px" ? 600 : 800 }}>
                {t.sample}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Radius</h2>
        <div className={styles.row}>
          {radii.map((r) => (
            <div key={r.token} className={styles.radiusBox} style={{ borderRadius: `var(${r.token})` }}>
              <code>{r.token}</code>
              <span>
                {r.size} · {r.use}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Outlines and shadows</h2>
        <p className={styles.note}>
          <code>--line</code> 2.5 px on cards, panels and buttons; <code>--line-thin</code> 2 px on chips. Shadows are solid
          offsets, never blurred.
        </p>
        <div className={styles.row}>
          {shadows.map((s) => (
            <div key={s.token} className={styles.shadowBox} style={{ boxShadow: `var(${s.token})` }}>
              <code>{s.token}</code>
              <span>{s.use}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Spacing</h2>
        <div className={styles.spaceList}>
          {spaces.map((s) => (
            <div key={s} className={styles.spaceRow}>
              <code>{s}</code>
              <span className={styles.spaceBar} style={{ width: `var(${s})` }} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Focus ring</h2>
        <p className={styles.note}>Press Tab to move through these. Every link, button and input shows the same ring.</p>
        <div className={styles.row}>
          <button type="button" className={styles.button}>
            A button
          </button>
          <input className={styles.input} placeholder="An input" aria-label="Sample input" />
          <a href="#focus">A link</a>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Motifs</h2>
        <p className={styles.note}>
          From <code>@/components/motifs</code>. Decorative, so hidden from screen readers unless given a title. Shown at
          small, medium and large sizes.
        </p>
        <div className={styles.motifGrid}>
          <figure className={styles.motif}>
            <div className={styles.motifRow}>
              <RabbitEars size={20} />
              <RabbitEars size={40} />
              <RabbitEars size={72} title="Tabane" />
            </div>
            <figcaption>RabbitEars · the logo</figcaption>
          </figure>
          <figure className={styles.motif}>
            <div className={styles.motifRow}>
              <Flower size={16} />
              <Flower size={28} />
              <Flower size={56} />
            </div>
            <figcaption>Flower</figcaption>
          </figure>
          <figure className={styles.motif}>
            <div className={styles.motifRow}>
              <PocketWatch size={18} ticking={false} />
              <PocketWatch size={40} />
              <PocketWatch size={72} />
            </div>
            <figcaption>PocketWatch · ticks</figcaption>
          </figure>
          <figure className={styles.motif}>
            <div className={styles.motifRow}>
              <Teacup size={40} />
              <Teacup size={80} />
            </div>
            <figcaption>Teacup</figcaption>
          </figure>
          <figure className={styles.motif}>
            <div className={styles.motifRow}>
              <CarrotPod size={16} />
              <CarrotPod size={34} />
              <CarrotPod size={48} />
            </div>
            <figcaption>CarrotPod</figcaption>
          </figure>
          <figure className={styles.motif}>
            <div className={styles.motifRow}>
              <SuitBadge suit="heart" />
              <SuitBadge suit="spade" />
              <SuitBadge suit="diamond" />
              <SuitBadge suit="club" />
              <SuitBadge suit="heart" size={56} />
            </div>
            <figcaption>SuitBadge</figcaption>
          </figure>
          <figure className={styles.motif}>
            <div className={styles.motifRow}>
              <WashiTape />
              <WashiTape color="blue" tilt={4} />
            </div>
            <figcaption>WashiTape · yellow and blue</figcaption>
          </figure>
          <figure className={styles.motif}>
            <div className={styles.motifRow}>
              <Stamp />
              <Stamp tilt={-4}>Proven</Stamp>
            </div>
            <figcaption>Stamp</figcaption>
          </figure>
          <figure className={`${styles.motif} ${styles.motifWide}`}>
            <ChessStrip />
            <figcaption>ChessStrip</figcaption>
          </figure>
          <figure className={`${styles.motif} ${styles.motifWide}`}>
            <div className={styles.motifRow}>
              <MoekoWorksLogo width={120} />
              <MoekoWorksLogo />
              <MoekoWorksLogo width={260} />
            </div>
            <figcaption>MoekoWorksLogo</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Motion</h2>
        <p className={styles.note}>
          Hover the card: it lifts using <code>--lift-duration</code> and <code>--lift-ease</code>. Under reduced motion it
          stays still.
        </p>
        <div className={styles.liftCard}>Hover me</div>
      </section>
    </main>
  );
}
