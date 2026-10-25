// The tag lists (spec: "Organizing entries" and "Playbook fields"). content/tags.yml holds every list with its labels.
// Layer, Origin, Status, Target and the Playbook's Kind and Status are also fixed here, because pages behave
// differently for them (scripts/check-content.ts fails if tags.yml disagrees). Stack and Feature grow, so they are
// read from tags.yml. Server-only: reads the file system.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

type TagList = Record<string, { label: string; values: Record<string, string> }>;
/** content/tags.yml as written. The samples use the same file. */
export const tagsFile: TagList = parse(readFileSync(join(process.cwd(), "content", "tags.yml"), "utf8"));

export const layers = { "ui-ux": "UI/UX", backend: "Backend" } as const;

export const origins = {
  "own-project": "Own project",
  researched: "Researched",
  "created-for-tabane": "Created for Tabane",
} as const;

export const statuses = { proven: "Proven", candidate: "Candidate", outdated: "Outdated" } as const;

export const targets = {
  website: "Website",
  "mobile-application": "Mobile Application",
  "desktop-application": "Desktop Application",
} as const;

/** Growing lists, from content/tags.yml. */
export const stacks: Record<string, string> = tagsFile.stack.values;
export const features: Record<string, string> = tagsFile.feature.values;

export const playbookKinds = {
  "replication-guide": "Replication guide",
  "reverse-engineered-idea": "Reverse-engineered idea",
  "personal-workflow": "Personal workflow",
} as const;

export const playbookStatuses = { draft: "Draft", verified: "Verified", outdated: "Outdated" } as const;

export type Layer = keyof typeof layers;
export type Origin = keyof typeof origins;
export type Status = keyof typeof statuses;
export type Target = keyof typeof targets;
/** Any value listed in tags.yml → stack (checked by scripts/check-content.ts, not by the compiler). */
export type Stack = string;
/** Any value listed in tags.yml → feature. */
export type Feature = string;
export type PlaybookKind = keyof typeof playbookKinds;
export type PlaybookStatus = keyof typeof playbookStatuses;

/** Every entry tag, in the order the Library sidebar shows them. */
export const entryTags = {
  layer: { label: "Layer", values: layers },
  origin: { label: "Origin", values: origins },
  status: { label: "Status", values: statuses },
  target: { label: "Target", values: targets },
  stack: { label: "Stack", values: stacks },
  feature: { label: "Feature", values: features },
} as const;

export type EntryTagName = keyof typeof entryTags;
