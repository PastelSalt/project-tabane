// Entry and Playbook shapes, field for field from the spec's "Entry model" and "Playbook fields".
// src/lib/content.ts reads them from content/entries/<slug>/entry.md and content/playbooks/<slug>.md.

import type { Feature, Layer, Origin, PlaybookKind, PlaybookStatus, Stack, Status, Target } from "./tags";

/** A date as YYYY-MM-DD. */
export type IsoDate = string;

export type Image = {
  /** Served by the image route: /content/<entry slug>/<file in the entry's folder> */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Diagram = {
  id: string;
  /** 1 is the whole system, then 2, 3 and lower. */
  level: number;
  /** The diagram one level up; empty for level 1. */
  parent?: string;
  /** The box in the parent diagram that opens this one. Defaults to this diagram's id. */
  expands?: string;
  title: string;
  /** Mermaid source, so Claude can read it. */
  mermaid: string;
};

export type Entry = {
  slug: string;
  title: string;
  layer: Layer;
  origin: Origin;
  stack: Stack[];
  feature: Feature[];
  status: Status;
  target: Target;
  /** One or two lines on when to reuse it. */
  reuseNote: string;

  liveSite?: {
    url: string;
    /** False when the site refuses to be shown in a frame; the screenshot is shown instead. */
    embeddable: boolean;
  };
  /** Own projects only. */
  repository?: { name: string; url: string };
  /** Own projects only: where the reusable code lives. */
  codeLocation?: { path: string; ref: string };
  /** Own projects, optional: a short excerpt of the code that makes it work. */
  keyCode?: { language: string; path: string; code: string };
  /** Researched entries: where the idea came from and its usage terms. */
  sourceAndLicense?: string;
  /** The project file in projects/ this entry was made from (all real entries; the samples have none). */
  projectFile?: string;

  /** UI/UX entries. */
  wireframe?: { desktop?: Image; phone?: Image };
  /** UI/UX with a live site, and every app entry. */
  screenshots?: Image[];
  /** Mobile or desktop apps, optional; shown only on the entry page. */
  clip?: { src: string; poster?: string };

  /** Markdown. */
  technicalDetails: string;
  /** Backend entries. */
  diagrams?: Diagram[];

  /** Slugs of entries this one pairs with. */
  related: string[];
  /** Projects that have reused this entry. */
  usedIn: string[];
  /** Off by default; only Shared entries are visible to someone using an access code. */
  shared: boolean;
  lastChecked?: IsoDate;
  created: IsoDate;
  updated: IsoDate;
};

export type Playbook = {
  slug: string;
  title: string;
  kind: PlaybookKind;
  /** The end result in one or two lines. */
  goal: string;
  basedOn: { entries: string[]; sites: { label: string; url: string }[] };
  beforeYouStart: string[];
  steps: { title: string; body: string }[];
  gotchas: string[];
  finishedLooksLike: string;
  lastVerified?: IsoDate;
  status: PlaybookStatus;
  target: Target;
  /** Replication guides: the project file in projects/ the guide was made from. */
  projectFile?: string;
};
