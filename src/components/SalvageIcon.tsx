import React, { useState } from "react";
import { ICONS } from "../data/icons";
import { SALVAGE, R } from "../data/salvage";
import { SalvageInfo } from "../types";

interface Props {
  name: string;
  size?: number;
}

export function SalvageIcon({ name, size = 20 }: Props) {
  const [err, setErr] = useState(false);
  const info = (SALVAGE[name] || {}) as SalvageInfo;
  const col = R[info.r || "s"]?.color || "#888";
  const src = ICONS[name];
  if (err || !src) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 3,
        background: col + "22", border: `1px solid ${col}55`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.5, color: col, fontWeight: 700, flexShrink: 0,
      }}>
        {name[0]}
      </div>
    );
  }
  return (
    <img
      src={src}
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
      onError={() => setErr(true)}
    />
  );
}