import Image from "next/image";
import Markdown from "react-markdown";
import { codeToHtml, type ThemeRegistration } from "shiki";
import { Chip } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { Entry } from "@/lib/types";
import styles from "./entry.module.css";
import { Panel } from "./Panel";

export type WireframeView = "desktop" | "phone";
export type FrameMode = "live" | "screenshot";

/** Entry page address with its view choices, such as /library/x?view=phone&frame=screenshot. */
export function entryHref(slug: string, choices: { view?: WireframeView; frame?: FrameMode }): string {
  const params = new URLSearchParams();
  if (choices.view === "phone") params.set("view", "phone");
  if (choices.frame === "screenshot") params.set("frame", "screenshot");
  const query = params.toString();
  return `/library/${slug}${query ? `?${query}` : ""}`;
}

/** The wireframe, with a Desktop / Phone switch when the entry has both. */
export function WireframePanel({ entry, view, frame }: { entry: Entry; view: WireframeView; frame: FrameMode }) {
  const { desktop, phone } = entry.wireframe ?? {};
  const shown = view === "phone" ? (phone ?? desktop) : (desktop ?? phone);
  if (!shown) return null;
  const isPhone = shown === phone;
  const actions =
    desktop && phone ? (
      <>
        <Chip small href={entryHref(entry.slug, { view: "desktop", frame })} selected={!isPhone} color="blue">
          Desktop
        </Chip>
        <Chip small href={entryHref(entry.slug, { view: "phone", frame })} selected={isPhone} color="blue">
          Phone
        </Chip>
      </>
    ) : (
      <span>{isPhone ? "Phone · 390 px" : "Desktop · 1440 px"}</span>
    );
  return (
    <Panel title="Wireframe" color="yellow" tape="yellow" actions={actions} tint="yellow">
      <Image
        src={shown.src}
        alt={shown.alt}
        width={shown.width}
        height={shown.height}
        className={isPhone ? styles.wireframePhone : styles.wireframe}
      />
    </Panel>
  );
}

/**
 * The live site in a browser frame. Falls back to the saved screenshot when the site cannot be embedded
 * or the entry is Outdated, and lets me switch to the screenshot when both exist.
 */
export function LiveSitePanel({ entry, view, frame }: { entry: Entry; view: WireframeView; frame: FrameMode }) {
  const site = entry.liveSite;
  const screenshot = entry.screenshots?.[0];
  if (!site && !screenshot) return null;

  const canEmbed = Boolean(site?.embeddable) && entry.status !== "outdated";
  const showLive = canEmbed && frame === "live";
  const reason = !site
    ? "No live site; saved screenshot"
    : entry.status === "outdated"
      ? "The live site is gone; saved screenshot"
      : !site.embeddable
        ? "This site can't be shown in a frame; saved screenshot"
        : "Saved screenshot";

  const actions = (
    <>
      {canEmbed && screenshot ? (
        <>
          <Chip small href={entryHref(entry.slug, { view, frame: "live" })} selected={showLive} color="blue">
            Live
          </Chip>
          <Chip small href={entryHref(entry.slug, { view, frame: "screenshot" })} selected={!showLive} color="blue">
            Screenshot
          </Chip>
        </>
      ) : null}
      {entry.lastChecked ? <span>checked {formatDate(entry.lastChecked)}</span> : null}
    </>
  );

  return (
    <Panel title={site ? "Live site" : "Screenshot"} color="blue" tape="blue" actions={actions} flush>
      <div className={styles.browser}>
        <i style={{ background: "var(--violet)" }} />
        <i style={{ background: "var(--yellow)" }} />
        <i style={{ background: "var(--blue)" }} />
        <span className={styles.url}>{site ? site.url.replace(/^https?:\/\//, "") : "screenshot"}</span>
        {site ? (
          <a href={site.url} target="_blank" rel="noreferrer" className={styles.open}>
            Open <span aria-hidden>↗</span>
            <span className="visually-hidden"> the live site in a new tab</span>
          </a>
        ) : null}
      </div>
      {showLive && site ? (
        <iframe
          src={site.url}
          title={`Live site for ${entry.title}`}
          className={styles.frame}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer"
        />
      ) : screenshot ? (
        <figure className={styles.shot}>
          <Image src={screenshot.src} alt={screenshot.alt} width={screenshot.width} height={screenshot.height} />
          <figcaption>{reason}</figcaption>
        </figure>
      ) : (
        <p className={styles.noShot}>No screenshot saved yet.</p>
      )}
    </Panel>
  );
}

/** Technical details, written in Markdown. */
export function DetailsPanel({ entry }: { entry: Entry }) {
  return (
    <Panel title="Technical details" color="violet">
      <div className={styles.prose}>
        <Markdown>{entry.technicalDetails}</Markdown>
      </div>
    </Panel>
  );
}

/** Code colours on black, from the palette. */
const tabaneCode: ThemeRegistration = {
  name: "tabane",
  type: "dark",
  colors: { "editor.background": "#0b0b0b", "editor.foreground": "#ffffff" },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#ffd45c" } },
    { scope: ["keyword", "storage", "storage.type", "keyword.control"], settings: { foreground: "#7d98ec" } },
    { scope: ["string", "string.quoted"], settings: { foreground: "#f1e6f3" } },
    { scope: ["constant.numeric", "constant.language"], settings: { foreground: "#ffd45c" } },
    { scope: ["entity.name.function", "support.function"], settings: { foreground: "#e4eafb" } },
  ],
};

/** A short excerpt of the code that makes the piece work, highlighted on the server. */
export async function KeyCodePanel({ entry }: { entry: Entry }) {
  if (!entry.keyCode) return null;
  const html = await codeToHtml(entry.keyCode.code, { lang: entry.keyCode.language, theme: tabaneCode });
  return (
    <Panel
      title="Key code"
      color="yellow"
      shadow="blue"
      flush
      actions={
        <Chip small>
          <code>{entry.keyCode.path}</code>
        </Chip>
      }
    >
      <div className={styles.code} dangerouslySetInnerHTML={{ __html: html }} />
    </Panel>
  );
}
