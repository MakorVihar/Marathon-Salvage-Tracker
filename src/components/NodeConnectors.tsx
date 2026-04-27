import React from "react";
import { NodeDef, Density } from "../types";
import { gridSizes, makeConnectorHelpers } from "../layout/gridSizes";

interface Props {
  nodes: NodeDef[];
  cols: number;
  rows: number;
  acc: string;
  density: Density;
}

export function NodeConnectors({ nodes, cols, rows, acc, density }: Props) {
  const { cellW, cellH, cardW, cardMinH } = gridSizes(density);
  const { gcx, gRight, gLeft, gBottom, gTop, gMidY } = makeConnectorHelpers(cellW, cellH, cardW, cardMinH);
  const W = cols * cellW, H = rows * cellH;

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", overflow: "visible" }}
      width={W}
      height={H}
    >
      {nodes.map((node, i) => {
        if (!node.requires) return null;
        const parent = nodes.find(n => n.id === node.requires);
        if (!parent) return null;
        const pId = `p-${node.id}`;
        const goingRight = node.col > parent.col;
        const goingLeft  = node.col < parent.col;
        let d = "";
        if (parent.row === node.row) {
          const y = gMidY(parent.row);
          d = `M${Math.min(goingRight ? gRight(parent.col) : gLeft(parent.col), goingRight ? gLeft(node.col) : gRight(node.col))},${y} L${Math.max(goingRight ? gRight(parent.col) : gLeft(parent.col), goingRight ? gLeft(node.col) : gRight(node.col))},${y}`;
        } else if (parent.col === node.col) {
          d = `M${gcx(parent.col)},${gBottom(parent.row)} L${gcx(parent.col)},${gTop(node.row)}`;
        } else {
          const px = gcx(parent.col), py = gBottom(parent.row), cy = gMidY(node.row);
          const cx = goingRight ? gLeft(node.col) : gRight(node.col);
          d = `M${px},${py} L${px},${cy} L${cx},${cy}`;
        }
        const chevron = (parent.row === node.row && goingLeft) ? "‹" : "›";
        return (
          <g key={i}>
            <path id={pId} d={d} fill="none" stroke="none" />
            <text dy="0.25em" style={{ fontSize: density === "icon" ? 36 : 52, fill: acc, userSelect: "none" }}>
              <textPath href={`#${pId}`} spacing="exact" method="stretch">{chevron.repeat(100)}</textPath>
            </text>
          </g>
        );
      })}
    </svg>
  );
}