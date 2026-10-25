// The fixed tag lists from the spec ("Organizing entries" and "Playbook fields").
// Every entry and playbook may only use these values. In Phase 2 these move to content/tags.yml.

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

export const stacks = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  nextjs: "Next.js",
  preact: "Preact",
  astro: "Astro",
  "material-ui": "Material UI",
  gsap: "GSAP",
  nodejs: "Node.js",
  c: "C",
  "sdl-3": "SDL 3",
  freetype: "FreeType",
  "neon-postgres": "Neon Postgres",
} as const;

export const features = {
  auth: "Auth",
  "admin-panel": "Admin panel",
  dashboard: "Dashboard",
  cards: "Cards",
  gallery: "Gallery",
  forms: "Forms",
  search: "Search",
  timeline: "Timeline",
  countdown: "Countdown",
  statistics: "Statistics",
  layout: "Layout",
  editor: "Editor",
  "export-pipeline": "Export pipeline",
} as const;

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
export type Stack = keyof typeof stacks;
export type Feature = keyof typeof features;
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
