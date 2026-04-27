import React, { useState, useRef, useEffect } from "react";
import { ICONS } from "../icons";
import { SALVAGE, R } from "../data/salvage";

const UNIT = 112;
const CELL_SPAN: Record<string, { cols: number; rows: number }> = {
  c:  { cols: 2, rows: 2 },
  p:  { cols: 2, rows: 2 },
  su: { cols: 2, rows: 2 },
  d:  { cols: 2, rows: 1 },
  e:  { cols: 1, rows: 1 },
  s:  { cols: 1, rows: 1 },
};

interface Props {
  name: string;
  qty: number;
  onSet: (n: string, v: number) => void;
  forBatch?: boolean;
  batchMode?: "add" | "remove" | null;
  BG0: string;
  TEXT: string;
}

export function InvCell({ name, qty, onSet, forBatch, batchMode, BG0, TEXT }: Props) {
  const info = SALVAGE[name] || {};
  const rc   = R[info.r || "s"].color;
  const src  = ICONS[name];
  const span = CELL_SPAN[info.r || "s"];
  const W = span.cols * UNIT, H = span.rows * UNIT;
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState("0");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (!editing) setDraft(String(qty)); }, [qty, editing]);
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const v = parseInt(draft);
    onSet(name, isNaN(v) || v < 0 ? 0 : v);
    setEditing(false);
  };
  const adj = (d: number) => {
    const n = Math.max(0, (parseInt(draft) || 0) + d);
    setDraft(String(n));
    onSet(name, n);
  };

  const btnSz  = Math.max(36, Math.min(56, Math.round(W * 0.22)));
  const inputW = Math.max(64, Math.round(W * 0.38));
  const isRemove = forBatch && batchMode === "remove";

  return (
    <div
      style={{
        position: "relative", width: W, height: H, cursor: "pointer", flexShrink: 0,
        outline: editing ? `4px solid ${rc}` : undefined, outlineOffset: -4, zIndex: editing ? 2 : 1,
      }}
      onClick={!editing ? () => { setDraft(String(qty)); setEditing(true); } : undefined}
      title={name}
    >
      <img
        src={src || ""}
        alt={name}
        style={{
          display: "block", width: "100%", height: "100%", objectFit: "cover",
          opacity: editing ? 0.18 : qty > 0 ? 1 : 0.28,
          transition: "opacity 0.1s", userSelect: "none", pointerEvents: "none",
        }}
      />
      {!editing && qty > 0 && (
        <div style={{
          position: "absolute", bottom: 6, right: 8,
          fontSize: Math.min(30, Math.round(W * 0.22)), fontWeight: 700,
          color: isRemove ? "#ff5555" : "#fff",
          textShadow: "0 2px 8px #000,0 0 16px #000", pointerEvents: "none", lineHeight: 1,
        }}>
          {isRemove ? `−${qty}` : `×${qty}`}
        </div>
      )}
      {!editing && qty === 0 && (
        <div style={{ position: "absolute", inset: 0, background: rc + "0d", pointerEvents: "none" }} />
      )}
      {editing && (
        <div
          style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8, background: BG0 + "cc",
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onMouseDown={e => { e.preventDefault(); adj(-1); }}
              style={{
                width: btnSz, height: btnSz, borderRadius: 6, border: "none",
                background: rc + "44", color: "#fff", fontSize: btnSz * 0.75,
                fontWeight: 700, cursor: "pointer", lineHeight: 1,
                display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none",
              }}
            >−</button>
            <input
              ref={inputRef}
              value={draft}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, "");
                setDraft(v);
                const n = parseInt(v);
                if (!isNaN(n)) onSet(name, n);
              }}
              onBlur={commit}
              onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
              style={{
                width: inputW, height: btnSz, textAlign: "center", background: "#000",
                border: `3px solid ${rc}`, color: "#fff", fontSize: 26, fontWeight: 700, borderRadius: 6,
              }}
            />
            <button
              onMouseDown={e => { e.preventDefault(); adj(1); }}
              style={{
                width: btnSz, height: btnSz, borderRadius: 6, border: "none",
                background: rc + "44", color: "#fff", fontSize: btnSz * 0.75,
                fontWeight: 700, cursor: "pointer", lineHeight: 1,
                display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none",
              }}
            >+</button>
          </div>
        </div>
      )}
    </div>
  );
}