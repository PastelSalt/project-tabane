import Image from "next/image";
import Link from "next/link";
import type { Entry } from "@/lib/types";
import styles from "./entry.module.css";
import { Panel } from "./Panel";

/**
 * Screenshots for app entries, which have no live site to embed: one large, the rest as thumbnails.
 * Choosing a thumbnail is a link (?shot=2), so it works without JavaScript.
 */
export function ScreenshotGallery({ entry, selected, hrefFor }: { entry: Entry; selected: number; hrefFor: (shot: number) => string }) {
  const shots = entry.screenshots ?? [];
  if (shots.length === 0) return null;
  const index = Math.min(Math.max(selected, 0), shots.length - 1);
  const shown = shots[index];
  const phone = shown.height > shown.width;
  return (
    <Panel
      title="Screenshots"
      color="blue"
      tape="blue"
      actions={<span>{shots.length === 1 ? "1 screenshot" : `${index + 1} of ${shots.length}`}</span>}
      tint="blue"
    >
      <figure className={styles.gallery}>
        <Image
          src={shown.src}
          alt={shown.alt}
          width={shown.width}
          height={shown.height}
          className={phone ? styles.galleryPhone : styles.galleryMain}
        />
        <figcaption>{shown.alt}</figcaption>
      </figure>
      {shots.length > 1 ? (
        <ul className={styles.thumbs} aria-label="Choose a screenshot">
          {shots.map((shot, i) => (
            <li key={shot.src}>
              <Link
                href={hrefFor(i)}
                scroll={false}
                className={i === index ? `${styles.thumb} ${styles.thumbOn}` : styles.thumb}
                aria-current={i === index ? "true" : undefined}
              >
                <Image src={shot.src} alt={`Screenshot ${i + 1}: ${shot.alt}`} width={shot.width} height={shot.height} />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </Panel>
  );
}

/** A short silent clip of the app in use. Shown only on the entry page, never on cards, and never plays by itself. */
export function ClipPanel({ entry }: { entry: Entry }) {
  if (!entry.clip) return null;
  return (
    <Panel title="Clip" color="violet" flush>
      <video
        className={styles.clip}
        src={entry.clip.src}
        poster={entry.clip.poster}
        controls
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`Clip of ${entry.title} in use`}
      />
    </Panel>
  );
}
