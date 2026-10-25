// A tiny reader for Mermaid diagrams, used only to draw card thumbnails without loading Mermaid.
// Flowcharts: nodes in any common shape (`id[Label]`, `id[(Label)]`, `id{Label}`, `id((Label))` …) and arrows
// (`-->`, `-.->`, `==>`, `---`), with arrow labels (`-->|yes|`) ignored. Sequence diagrams: the participants in a row.
// Anything else gives an empty outline.

export type Outline = {
  nodes: { id: string; label: string; x: number; y: number }[];
  edges: { from: string; to: string }[];
};

const SKIP = /^\s*(classDef|class|style|linkStyle|subgraph|end|direction|%%)\b/;
const ARROW = /\s*(?:-->|-\.->|==>|---|-\.-)\s*/;
// id, then an optional shape; the first group that matched is the label
const NODE = /^([A-Za-z0-9_-]+)\s*(?:\[\(([^)]*)\)\]|\(\[([^\]]*)\]\)|\(\(([^)]*)\)\)|\[\/([^\]]*)\/\]|\[([^\]]*)\]|\{([^}]*)\}|\(([^)]*)\))?/;

export function outlineMermaid(source: string, width: number, height: number): Outline {
  const lines = source.split("\n");
  const kind = lines[0]?.trim().split(/\s+/)[0] ?? "";
  if (kind === "sequenceDiagram") return sequenceOutline(lines.slice(1), width, height);
  if (kind !== "flowchart" && kind !== "graph") return { nodes: [], edges: [] };

  const labels = new Map<string, string>();
  const edgeKeys = new Set<string>();
  const edges: Outline["edges"] = [];

  for (const raw of lines.slice(1)) {
    if (SKIP.test(raw) || !raw.trim()) continue;
    const parts = raw.replace(/\|[^|]*\|/g, " ").split(ARROW).map((part) => part.trim());
    const ids = parts.map((part) => {
      const match = part.match(NODE);
      if (!match) return undefined;
      const id = match[1];
      const label = match.slice(2).find((group) => group !== undefined)?.replace(/^"|"$/g, "").trim();
      if (label || !labels.has(id)) labels.set(id, label || labels.get(id) || id);
      return id;
    });
    for (let i = 0; i + 1 < ids.length; i++) {
      const from = ids[i];
      const to = ids[i + 1];
      if (!from || !to || from === to || edgeKeys.has(`${from}-${to}`)) continue;
      edgeKeys.add(`${from}-${to}`);
      edges.push({ from, to });
    }
  }

  // Columns by depth from the starting nodes, rows spread within a column
  const depth = new Map<string, number>();
  const ids = [...labels.keys()];
  for (const id of ids) if (!edges.some((edge) => edge.to === id)) depth.set(id, 0);
  for (let pass = 0; pass < ids.length; pass++) {
    for (const { from, to } of edges) {
      const d = (depth.get(from) ?? 0) + 1;
      if (!depth.has(to) || depth.get(to)! < d) depth.set(to, Math.min(d, ids.length));
    }
  }
  const columns = Math.max(0, ...ids.map((id) => depth.get(id) ?? 0)) + 1;
  const byColumn = new Map<number, string[]>();
  for (const id of ids) {
    const column = depth.get(id) ?? 0;
    byColumn.set(column, [...(byColumn.get(column) ?? []), id]);
  }
  const nodes = ids.map((id) => {
    const column = depth.get(id) ?? 0;
    const siblings = byColumn.get(column)!;
    const row = siblings.indexOf(id);
    return {
      id,
      label: labels.get(id)!,
      x: ((column + 0.5) / columns) * width,
      y: ((row + 0.5) / siblings.length) * height,
    };
  });
  return { nodes, edges };
}

/** Sequence diagrams: participants in one row, one line per pair that exchanges messages. */
function sequenceOutline(lines: string[], width: number, height: number): Outline {
  const labels = new Map<string, string>();
  const edgeKeys = new Set<string>();
  const edges: Outline["edges"] = [];
  for (const line of lines) {
    const participant = /^\s*(?:participant|actor)\s+(\w+)(?:\s+as\s+(.+))?$/.exec(line);
    if (participant) {
      labels.set(participant[1], participant[2]?.trim() ?? participant[1]);
      continue;
    }
    const message = /^\s*(\w+)\s*--?>>?[+-]?\s*(\w+)\s*:/.exec(line);
    if (!message) continue;
    const [, from, to] = message;
    for (const id of [from, to]) if (!labels.has(id)) labels.set(id, id);
    const key = [from, to].sort().join("-");
    if (from !== to && !edgeKeys.has(key)) {
      edgeKeys.add(key);
      edges.push({ from, to });
    }
  }
  const ids = [...labels.keys()];
  const nodes = ids.map((id, i) => ({ id, label: labels.get(id)!, x: ((i + 0.5) / ids.length) * width, y: height / 2 }));
  return { nodes, edges };
}
