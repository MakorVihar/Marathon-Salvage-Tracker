import React, { useState } from "react";
import { NodeDef, Density } from "../types";
import { SALVAGE, R } from "../data/salvage";
import { UPGRADE_ICONS } from "../data/upgradeIcons";
import { gridSizes, FULL_CARD_W, FULL_CARD_MIN_H, COMPACT_CARD_W, COMPACT_CARD_MIN_H, ICON_CARD_W, ICON_CARD_H } from "../layout/gridSizes";
import { SalvageIcon } from "./SalvageIcon";

interface Props {
  node: NodeDef;
  acc: string;
  tracked: Set<string>;
  onTrack: (r: string) => void;
  density: Density;
  BG2: string;
  BORDER: string;
  TEXT: string;
  MUTED: string;
}

export function NodeCard({ node, acc, tracked, onTrack, density, BG2, BORDER, TEXT, MUTED }: Props) {
  const [viewing, setViewing] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const vRank = node.ranks[viewing];
  const hasMulti = node.ranks.length > 1;
  const anyTracked = node.ranks.some((_, i) => tracked.has(`${node.id}:${i}`));
  const iconSlug = UPGRADE_ICONS[node.name];
  const iconSrc = iconSlug ? `src/assets/upgrades/${iconSlug}.png` : null;

  if (density === "icon") {
    const dotRows = Math.ceil(node.ranks.length / 6);
    const cardH = ICON_CARD_H + (dotRows - 1) * 28;
    return (
      <div
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        style={{
          width: ICON_CARD_W, height: cardH, borderRadius: 10, background: BG2,
          border: `2px solid ${anyTracked ? acc : BORDER}`,
          boxShadow: anyTracked ? `0 0 36px ${acc}88, inset 0 0 56px ${acc}33` : "none",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "10px 8px", position: "relative", userSelect: "none",
        }}
      >
        {tooltipVisible && (
          <div style={{
            position: "absolute", bottom: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)",
            background: "#0a0d10", border: `2px solid ${acc}88`, borderRadius: 10,
            padding: "10px 16px", zIndex: 100, whiteSpace: "nowrap", pointerEvents: "none",
            boxShadow: "0 8px 32px #000a",
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: acc, marginBottom: 4 }}>{node.name}</div>
            <div style={{ fontSize: 16, color: MUTED }}>{node.ranks[viewing].fx}</div>
          </div>
        )}
        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", flexWrap: "wrap", width: "100%", marginBottom: 8 }}>
          {node.ranks.map((_, i) => {
            const rid = `${node.id}:${i}`;
            const isTracked = tracked.has(rid);
            return (
              <div
                key={i}
                onClick={e => { e.stopPropagation(); setViewing(i); onTrack(rid); }}
                style={{
                  width: 16, height: 16, borderRadius: "50%", cursor: "pointer", flexShrink: 0,
                  background: isTracked ? acc : "transparent",
                  border: `3px solid ${isTracked ? acc : MUTED}`,
                  transition: "background 0.12s",
                }}
              />
            );
          })}
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          {iconSrc
            ? <img src={iconSrc} alt={node.name} style={{ width: 52, height: 52, objectFit: "contain", opacity: anyTracked ? 1 : 0.4, filter: anyTracked ? `drop-shadow(0 0 8px ${acc})` : "grayscale(1)" }} />
            : <div style={{ width: 52, height: 52, borderRadius: 8, background: acc + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: acc, fontWeight: 700 }}>{node.name[0]}</div>
          }
        </div>
      </div>
    );
  }

  const cardW = density === "full" ? FULL_CARD_W : COMPACT_CARD_W;
  const minH  = density === "full" ? FULL_CARD_MIN_H : COMPACT_CARD_MIN_H;
  return (
    <div style={{
      width: cardW, minHeight: minH, borderRadius: 12, padding: "16px 16px 12px", background: BG2,
      border: `2px solid ${anyTracked ? acc : BORDER}`,
      boxShadow: anyTracked ? `0 0 36px ${acc}88, inset 0 0 56px ${acc}33` : "none",
      display: "flex", flexDirection: "column", gap: 8, transition: "border-color 0.15s",
    }}>
      <div style={{ fontSize: density === "full" ? 20 : 18, fontWeight: 700, color: anyTracked ? acc : TEXT, lineHeight: 1.2, marginBottom: 4 }}>
        {node.name}
      </div>
      {hasMulti && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {node.ranks.map((_, i) => {
            const rid = `${node.id}:${i}`;
            const isViewing  = viewing === i;
            const isTracked  = tracked.has(rid);
            return (
              <button key={i} onClick={() => setViewing(i)} style={{
                width: 36, height: 36, borderRadius: 6,
                border: `3px solid ${isViewing ? acc : isTracked ? acc + "88" : BORDER}`,
                background: isViewing ? acc + "22" : "transparent",
                color: isViewing ? acc : isTracked ? acc : MUTED,
                fontSize: 16, fontWeight: 700, cursor: "pointer", lineHeight: 1,
                display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
              }}>
                {i + 1}
                {isTracked && (
                  <span style={{
                    position: "absolute", top: -6, right: -6, width: 10, height: 10,
                    borderRadius: "50%", background: acc, border: `2px solid ${BG2}`, pointerEvents: "none",
                  }} />
                )}
              </button>
            );
          })}
        </div>
      )}
      <div style={{ fontSize: 16, color: MUTED, lineHeight: 1.35 }}>{vRank.fx}</div>
      {density === "full" && (
        <div style={{ fontSize: 16, color: "#D4922A", fontWeight: 600 }}>◆ {vRank.cr.toLocaleString()}</div>
      )}
      <div style={{ flex: 1 }}>
        {vRank.req.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {vRank.req.map(([item, qty]) => {
              const rc = R[SALVAGE[item]?.r || "s"]?.color || "#888";
              return (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <SalvageIcon name={item} size={24} />
                  <span style={{ fontSize: 14, color: rc, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: TEXT, flexShrink: 0 }}>×{qty}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <button
        onClick={() => onTrack(`${node.id}:${viewing}`)}
        style={{
          marginTop: "auto", padding: "6px 0", borderRadius: 6, fontSize: 16, fontWeight: 700,
          border: `2px solid ${tracked.has(`${node.id}:${viewing}`) ? acc : BORDER}`,
          background: tracked.has(`${node.id}:${viewing}`) ? acc + "22" : "transparent",
          color: tracked.has(`${node.id}:${viewing}`) ? acc : MUTED,
          cursor: "pointer", letterSpacing: "0.04em",
        }}
      >
        {tracked.has(`${node.id}:${viewing}`) ? "✓ TRACKED" : "TRACK"}
      </button>
    </div>
  );
}