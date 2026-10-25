// A tiny reader for simple Mermaid flowcharts, used only to draw card thumbnails without loading Mermaid.
// It understands `id[Label]` nodes and `a --> b` edges, which is all the level-1 diagrams use.

export type Outline = {
  nodes: { id: string; label: string; x: number; y: number }[];
  edges: { from: string; to: string }[];
};

export function outlineMermaid(source: string, width: number, height: number): Outline {
  const labels = new Map<string, string>();
  const edges: Outline["edges"] = [];
  const node = /([A-Za-z0-9_-]+)(?:\[([^\]]+)\])?/;

  for (const line of source.split("\n").slice(1)) {
    const parts = line.split("-->").map((part) => part.trim());
    const ids = parts.map((part) => {
      const match = part.match(node);
      if (!match) return undefined;
      const [, id, label] = match;
      if (label || !labels.has(id)) labels.set(id, label ?? labels.get(id) ?? id);
      return id;
    });
    for (let i = 0; i + 1 < ids.length; i++) {
      const from = ids[i];
      const to = ids[i + 1];
      if (from && to) edges.push({ from, to });
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
  const columns = Math.max(...ids.map((id) => depth.get(id) ?? 0)) + 1;
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
