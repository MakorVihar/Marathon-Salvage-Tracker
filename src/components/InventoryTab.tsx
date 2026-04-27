import React, { useState } from "react";
import { SALVAGE, R } from "../data/salvage";
import { SalvageIcon } from "./SalvageIcon";
import { InvCell } from "./InvCell";

const RARITY_ORDER_INV = ["c", "p", "su", "d", "e", "s"] as const;

interface Props {
  owned: Record<string, number>;
  setOwned: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  BG0: string;
  BG1: string;
  BG2: string;
  BG3: string;
  BORDER: string;
  TEXT: string;
  MUTED: string;
  DIM: string;
}

export function InventoryTab({ owned, setOwned, BG0, BG1, BG2, BG3, BORDER, TEXT, MUTED, DIM }: Props) {
  const [batchMode,  setBatchMode]  = useState<"add" | "remove" | null>(null);
  const [batchItems, setBatchItems] = useState<Record<string, number>>({});

  const onSet = (name: string, v: number) => setOwned(p => ({ ...p, [name]: v }));

  const applyBatch = (mode: "add" | "remove") => {
    setOwned(prev => {
      const next = { ...prev };
      Object.entries(batchItems).forEach(([name, qty]) => {
        if (mode === "add") next[name] = (next[name] || 0) + qty;
        else next[name] = Math.max(0, (next[name] || 0) - qty);
      });
      return next;
    });
    setBatchItems({});
    setBatchMode(null);
  };

  const totalItems = Object.values(owned).reduce((a, b) => a + b, 0);
  const totalTypes = Object.values(owned).filter(v => v > 0).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", minHeight: 0 }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20, padding: "16px 28px",
        borderBottom: `1px solid ${BORDER}`, background: BG1, flexShrink: 0, flexWrap: "wrap",
      }}>
        <div style={{ fontSize: 22, color: MUTED }}>
          <span style={{ color: TEXT, fontWeight: 600 }}>{totalTypes}</span> types &nbsp;·&nbsp;
          <span style={{ color: TEXT, fontWeight: 600 }}>{totalItems}</span> total
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => { setBatchItems({}); setBatchMode("add"); }}
          style={{ padding: "8px 24px", borderRadius: 8, border: `1px solid #5A9E3088`, background: "#5A9E3014", color: "#5A9E30", fontSize: 22, fontWeight: 600, cursor: "pointer" }}
        >+ ADD LOOT</button>
        <button
          onClick={() => { setBatchItems({}); setBatchMode("remove"); }}
          style={{ padding: "8px 24px", borderRadius: 8, border: `1px solid #cc552288`, background: "#cc552214", color: "#cc5522", fontSize: 22, fontWeight: 600, cursor: "pointer" }}
        >− USE ITEMS</button>
        {totalItems > 0 && (
          <button
            onClick={() => setOwned({})}
            style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 22, cursor: "pointer" }}
          >Clear all</button>
        )}
      </div>

      {/* Batch bar */}
      {batchMode && (
        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${BORDER}`, background: BG0, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.08em", color: batchMode === "add" ? "#5A9E30" : "#cc5522" }}>
              {batchMode === "add" ? "ADD LOOT FROM MATCH" : "DEDUCT USED ITEMS"}
            </span>
            <span style={{ fontSize: 20, color: MUTED, flex: 1 }}>— click items to set quantities</span>
            <button
              onClick={() => applyBatch(batchMode)}
              disabled={Object.keys(batchItems).length === 0}
              style={{
                padding: "8px 28px", borderRadius: 8, border: "none",
                background: batchMode === "add" ? "#5A9E30" : "#cc5522",
                color: "#fff", fontSize: 22, fontWeight: 700,
                cursor: Object.keys(batchItems).length === 0 ? "default" : "pointer",
                opacity: Object.keys(batchItems).length === 0 ? 0.4 : 1,
              }}
            >Apply {Object.keys(batchItems).length > 0 ? `(${Object.keys(batchItems).length})` : ""}</button>
            <button
              onClick={() => setBatchMode(null)}
              style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 22, cursor: "pointer" }}
            >Cancel</button>
          </div>
          {Object.keys(batchItems).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(batchItems).map(([name, qty]) => {
                const rc = R[SALVAGE[name]?.r || "s"].color;
                return (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px 4px 8px", borderRadius: 8, background: rc + "22", border: `1px solid ${rc}55`, fontSize: 20 }}>
                    <SalvageIcon name={name} size={28} />
                    <span style={{ color: TEXT }}>{name}</span>
                    <span style={{ color: rc, fontWeight: 700 }}>×{qty}</span>
                    <button
                      onMouseDown={() => setBatchItems(p => { const n = { ...p }; delete n[name]; return n; })}
                      style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 22, padding: 0, lineHeight: 1, marginLeft: 2 }}
                    >×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Item grid */}
      <div style={{ overflowY: "auto", flex: 1, padding: "24px 28px" }}>
        {RARITY_ORDER_INV.map(tier => {
          const items = Object.keys(SALVAGE).filter(n => SALVAGE[n].r === tier).sort();
          if (!items.length) return null;
          const rc = R[tier].color;
          return (
            <div key={tier} style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: rc, flexShrink: 0 }} />
                <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.14em", color: rc, textTransform: "uppercase" }}>{R[tier].label}</span>
                <div style={{ flex: 1, height: 2, background: BORDER }} />
                <span style={{ fontSize: 18, color: DIM }}>{items.filter(n => (owned[n] || 0) > 0).length}/{items.length}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 2, background: "#000", border: "2px solid #000", width: "fit-content" }}>
                {items.map(name => {
                  const qty = batchMode ? (batchItems[name] || 0) : (owned[name] || 0);
                  return (
                    <InvCell
                      key={name}
                      name={name}
                      qty={qty}
                      onSet={batchMode
                        ? (n, v) => setBatchItems(p => v === 0 ? (({ [n]: _, ...r }) => r)(p) : { ...p, [n]: v })
                        : onSet
                      }
                      forBatch={!!batchMode}
                      batchMode={batchMode}
                      BG0={BG0}
                      TEXT={TEXT}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}