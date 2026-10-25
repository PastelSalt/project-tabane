"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Diagram } from "@/lib/types";
import styles from "./diagram.module.css";

/** The box in a parent diagram that opens a child. */
const boxOf = (diagram: Diagram) => diagram.expands ?? diagram.id;

let renderCount = 0;

/**
 * A backend entry's diagrams, level by level. Boxes that have a deeper level are outlined in violet;
 * clicking one (or pressing Enter on it) opens that level. Tabs and the breadcrumb move between levels too.
 */
export function DiagramLevels({ diagrams, initial }: { diagrams: Diagram[]; initial?: string }) {
  const ordered = useMemo(() => [...diagrams].sort((a, b) => a.level - b.level), [diagrams]);
  const root = ordered[0];
  const [currentId, setCurrentId] = useState(ordered.some((d) => d.id === initial) ? initial! : root.id);
  const current = ordered.find((d) => d.id === currentId) ?? root;
  const children = useMemo(() => ordered.filter((d) => d.parent === current.id), [ordered, current.id]);

  // Root → … → current, for the breadcrumb
  const path: Diagram[] = [];
  for (let d: Diagram | undefined = current; d; d = ordered.find((other) => other.id === d!.parent)) path.unshift(d);

  const open = useCallback(
    (id: string) => {
      setCurrentId(id);
      // Keep the open level in the address, so a link can point straight at it
      const url = new URL(window.location.href);
      if (id === root.id) url.searchParams.delete("diagram");
      else url.searchParams.set("diagram", id);
      window.history.replaceState(null, "", url);
    },
    [root.id],
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs} role="group" aria-label="Diagram levels">
        {ordered.map((diagram) => (
          <button
            key={diagram.id}
            type="button"
            className={diagram.id === current.id ? `${styles.tab} ${styles.tabOn}` : styles.tab}
            aria-pressed={diagram.id === current.id}
            onClick={() => open(diagram.id)}
          >
            Level {diagram.level} · {diagram.title}
          </button>
        ))}
      </div>

      <nav className={styles.crumbs} aria-label="Diagram path">
        {path.map((diagram, i) =>
          i < path.length - 1 ? (
            <span key={diagram.id}>
              <button type="button" className={styles.crumb} onClick={() => open(diagram.id)}>
                {diagram.title}
              </button>
              <span aria-hidden> / </span>
            </span>
          ) : (
            <span key={diagram.id} aria-current="location">
              {diagram.title}
            </span>
          ),
        )}
        {children.length ? <span className={styles.hint}>Click a violet box to go one level down</span> : null}
      </nav>

      <MermaidView diagram={current} childDiagrams={children} onOpen={open} />

      <details className={styles.source}>
        <summary>Mermaid source (what Claude reads)</summary>
        <pre>{current.mermaid}</pre>
      </details>
    </div>
  );
}

/** Draws one Mermaid diagram in the Tabane theme and wires its expandable boxes. */
function MermaidView({
  diagram,
  childDiagrams,
  onOpen,
}: {
  diagram: Diagram;
  childDiagrams: Diagram[];
  onOpen: (id: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"drawing" | "done" | "failed">("drawing");

  useEffect(() => {
    let cancelled = false;
    const target = box.current;
    if (!target) return;

    (async () => {
      setState("drawing");
      const { default: mermaid } = await import("mermaid");
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        fontFamily: getComputedStyle(document.body).fontFamily,
        themeVariables: {
          primaryColor: "#ffffff",
          primaryTextColor: "#0b0b0b",
          primaryBorderColor: "#0b0b0b",
          lineColor: "#0b0b0b",
          fontSize: "16px",
        },
        flowchart: { curve: "basis", padding: 14, nodeSpacing: 40, rankSpacing: 56 },
      });

      // Mark the boxes that open a deeper level, and add a ↓ to their labels
      let source = diagram.mermaid;
      const boxes = childDiagrams.map(boxOf);
      for (const id of boxes) {
        source = source.replace(new RegExp(`(^|[\\s>])${id}\\[([^\\]]+)\\]`, "m"), `$1${id}["$2 ↓"]`);
      }
      source += "\n  classDef default fill:#ffffff,stroke:#0b0b0b,stroke-width:2.5px";
      if (boxes.length) {
        source += `\n  classDef expand fill:#ffffff,stroke:#9f5ca6,stroke-width:3.5px\n  class ${boxes.join(",")} expand`;
      }

      try {
        const { svg } = await mermaid.render(`tabane-diagram-${++renderCount}`, source);
        if (cancelled) return;
        target.innerHTML = svg;
        for (const child of childDiagrams) {
          const node = findNode(target, boxOf(child));
          if (!node) continue;
          node.classList.add(styles.expandable);
          node.setAttribute("tabindex", "0");
          node.setAttribute("role", "button");
          node.setAttribute("aria-label", `Open level ${child.level}: ${child.title}`);
          node.addEventListener("click", () => onOpen(child.id));
          node.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpen(child.id);
            }
          });
        }
        setState("done");
      } catch {
        if (!cancelled) setState("failed");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [diagram, childDiagrams, onOpen]);

  return (
    <div className={styles.canvas}>
      <div
        ref={box}
        className={styles.svg}
        role="group"
        aria-label={`Diagram: ${diagram.title}`}
        hidden={state === "failed"}
      />
      {state === "drawing" ? <p className={styles.status}>Drawing the diagram…</p> : null}
      {state === "failed" ? (
        <p className={styles.status}>This diagram could not be drawn. Its Mermaid source is below.</p>
      ) : null}
    </div>
  );
}

/** Mermaid puts each box in a <g class="node"> whose data-id (or id) carries the box id. */
function findNode(root: HTMLElement, id: string): SVGGElement | null {
  const nodes = [...root.querySelectorAll<SVGGElement>("g.node")];
  return (
    nodes.find((node) => node.dataset.id === id) ??
    nodes.find((node) => new RegExp(`-${id}-\\d+$`).test(node.id)) ??
    null
  );
}
