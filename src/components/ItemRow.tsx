import React, { useState } from "react";
import { SALVAGE, R } from "../data/salvage";
import { SalvageIcon } from "./SalvageIcon";

interface Props {
  name: string;
  qty: number;
  have: number;
  isIgnored: boolean;
  toggleIgnore: (n: string) => void;
  BG0: string;
  BG2: string;
  BORDER: string;
  TEXT: string;
  MUTED: string;
  DIM: string;
}

export function ItemRow({ name, qty, have, isIgnored, toggleIgnore, BG0, BG2, BORDER, TEXT, MUTED, DIM }: Props) {
  const [hovered, setHovered] = useState(false);
  const info = SALVAGE[name] || {};
  const rc   = R[info.r || "s"].color;
  const rem  = isIgnored ? 0 : Math.max(0, qty - have);
  const done = !isIgnored && rem === 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "8px 14px", marginBottom: 6, borderRadius: 8,
        background: isIgnored ? BG0 : done ? "rgba(58,138,48,0.08)" : BG2,
        border: `1px solid ${isIgnored ? BORDER : done ? "rgba(58,138,48,0.25)" : BORDER}`,
        borderLeft: `4px solid ${isIgnored ? DIM : done ? "#3A8A30" : rc}`,
        opacity: isIgnored ? 0.45 : done ? 0.7 : 1,
        transition: "opacity 0.1s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <SalvageIcon name={name} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 20, fontWeight: 600,
            color: isIgnored ? MUTED : done ? "#5A9E30" : TEXT,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            textDecoration: isIgnored ? "line-through" : "none",
          }}>
            {done && !isIgnored && <span style={{ marginRight: 6 }}>✓</span>}
            {name}
          </div>
          {hovered && have > 0 && (
            <div style={{ fontSize: 16, color: "#3A8A30", fontWeight: 600, lineHeight: 1.3 }}>
              have ×{have}{done && !isIgnored ? ` / ×${qty}` : ""}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {!isIgnored && !done && (
            <div style={{ fontSize: 22, fontWeight: 700, color: rc, background: rc + "22", borderRadius: 8, padding: "2px 12px" }}>
              ×{rem}
            </div>
          )}
          {!isIgnored && done && (
            <div style={{ fontSize: 18, fontWeight: 700, color: "#3A8A30", background: "rgba(58,138,48,0.15)", borderRadius: 8, padding: "2px 12px" }}>
              done
            </div>
          )}
          {hovered && (
            <button
              onClick={e => { e.stopPropagation(); toggleIgnore(name); }}
              style={{
                padding: "2px 10px", borderRadius: 6,
                border: `1px solid ${isIgnored ? DIM : BORDER}`,
                background: "transparent", color: isIgnored ? MUTED : DIM,
                fontSize: 16, cursor: "pointer", letterSpacing: "0.04em",
                fontWeight: 600, lineHeight: 1.4,
              }}
            >
              {isIgnored ? "UNIGNORE" : "IGNORE"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}