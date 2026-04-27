import React, { useState, useMemo } from "react";
import { SALVAGE, MAPS, R, CONTAINER_MAPS } from "./data/salvage";
import { FACTIONS } from "./data/factions";
import { lsGet, lsSet } from "./utils/storage";
import { expandContainers } from "./utils/containers";
import { useWindowWidth } from "./hooks/useWindowWidth";
import { gridSizes } from "./layout/gridSizes";
import { SalvageIcon } from "./components/SalvageIcon";
import { NodeConnectors } from "./components/NodeConnectors";
import { NodeCard } from "./components/NodeCard";
import { ItemRow } from "./components/ItemRow";
import { InventoryTab } from "./components/InventoryTab";
import { Density, SalvageInfo } from "./types";

export default function App() {
  const windowWidth = useWindowWidth();
  const density: Density = windowWidth >= 2400 ? "full" : windowWidth >= 1400 ? "compact" : "icon";

  const [faction,    setFaction]    = useState("CyberAcme");
  const [tracked,    setTracked]    = useState<Set<string>>(() => new Set(lsGet<string[]>("marathon_tracked", [])));
  const [ignored,    setIgnored]    = useState<Set<string>>(() => new Set(lsGet<string[]>("marathon_ignored", [])));
  const [view,       setView]       = useState("upgrades");
  const [activePOI,  setActivePOI]  = useState<{ map: string; poi: string } | null>(null);
  const [owned,      setOwned]      = useState<Record<string, number>>(() => lsGet("marathon_owned", {}));
  const [rightOpen,  setRightOpen]  = useState(() => window.innerWidth >= 2400);

  React.useEffect(() => { lsSet("marathon_owned",   owned);          }, [owned]);
  React.useEffect(() => { lsSet("marathon_tracked",  [...tracked]);  }, [tracked]);
  React.useEffect(() => { lsSet("marathon_ignored",  [...ignored]);  }, [ignored]);

  const fd = FACTIONS[faction];
  const toggleTrack  = (rankId: string) => setTracked(p => { const n = new Set(p); n.has(rankId) ? n.delete(rankId) : n.add(rankId); return n; });
  const toggleIgnore = (name: string)   => setIgnored(p => { const n = new Set(p); n.has(name)   ? n.delete(name)   : n.add(name);   return n; });
  const clearFaction    = () => setTracked(p => { const n = new Set(p); fd.nodes.forEach(node => node.ranks.forEach((_, i) => n.delete(`${node.id}:${i}`))); return n; });
  const trackAllFaction = () => setTracked(p => { const n = new Set(p); fd.nodes.forEach(node => node.ranks.forEach((_, i) => n.add(`${node.id}:${i}`))); return n; });
  const clearAll        = () => setTracked(new Set());

  const needed = useMemo(() => {
    const agg: Record<string, number> = {};
    Object.values(FACTIONS).forEach(fac => fac.nodes.forEach(node => node.ranks.forEach((rank, i) => {
      if (!tracked.has(`${node.id}:${i}`)) return;
      rank.req.forEach(([item, qty]) => agg[item] = (agg[item] || 0) + qty);
    })));
    return agg;
  }, [tracked]);

  const totalCr = useMemo(() => {
    let t = 0;
    Object.values(FACTIONS).forEach(fac => fac.nodes.forEach(node => node.ranks.forEach((rank, i) => {
      if (tracked.has(`${node.id}:${i}`)) t += rank.cr;
    })));
    return t;
  }, [tracked]);

  const sortedItems = useMemo(() => {
    const order = ["c", "p", "su", "d", "e", "s"];
    return Object.entries(needed).sort(([a], [b]) =>
      order.indexOf(SALVAGE[a]?.r || "s") - order.indexOf(SALVAGE[b]?.r || "s")
    );
  }, [needed]);

  const remaining = useMemo(() => {
    const rem: Record<string, number> = {};
    Object.entries(needed).forEach(([name, qty]) => {
      if (ignored.has(name)) return;
      const r = Math.max(0, (qty as number) - (owned[name] || 0));
      if (r > 0) rem[name] = r;
    });
    return rem;
  }, [needed, owned, ignored]);

  const locationScores = useMemo(() => {
    const gc: Record<string, number> = {}, cc: Record<string, number> = {};
    Object.entries(remaining).forEach(([name, qty]) => {
      const info = (SALVAGE[name] || {}) as SalvageInfo;
      if (!info) return;
      info.locs!.forEach(({ map, poi }) => { const k = `${map}|||${poi}`; gc[k] = (gc[k] || 0) + qty; });
      expandContainers(info.containers!).forEach(ct => {
        (CONTAINER_MAPS[ct] || []).forEach(map => { const k = `${map}|||${ct}`; cc[k] = (cc[k] || 0) + qty; });
      });
    });
    const byMap: Record<string, { groundTotal: number; containerTotal: number; pois: { poi: string; count: number }[]; containers: { name: string; count: number }[] }> = {};
    const em = (map: string) => { if (!byMap[map]) byMap[map] = { groundTotal: 0, containerTotal: 0, pois: [], containers: [] }; };
    Object.entries(gc).forEach(([k, c]) => { const [map, poi] = k.split("|||"); em(map); byMap[map].groundTotal += c; byMap[map].pois.push({ poi, count: c }); });
    Object.entries(cc).forEach(([k, c]) => { const [map, ct]  = k.split("|||"); em(map); byMap[map].containerTotal += c; byMap[map].containers.push({ name: ct, count: c }); });
    return Object.entries(byMap).map(([map, d]) => ({
      map,
      total: d.groundTotal + d.containerTotal,
      groundTotal: d.groundTotal,
      containerTotal: d.containerTotal,
      pois:       d.pois.sort((a, b) => b.count - a.count),
      containers: d.containers.sort((a, b) => b.count - a.count),
    })).sort((a, b) => b.total - a.total);
  }, [remaining]);

  const poiItems = useMemo(() => {
    if (!activePOI) return [];
    const { map, poi } = activePOI;
    const isContainer = poi in CONTAINER_MAPS;
    return Object.entries(remaining).filter(([name]) => {
      const info = (SALVAGE[name] || {}) as SalvageInfo;
      if (!info) return false;
      if (isContainer) return expandContainers(info.containers!).includes(poi) && (CONTAINER_MAPS[poi] || []).includes(map);
      return info.locs!.some(l => l.map === map && l.poi === poi);
    }).map(([name, qty]) => ({ name, qty: qty as number }))
      .sort((a, b) => (SALVAGE[b.name]?.r || "s").localeCompare(SALVAGE[a.name]?.r || "s"));
  }, [activePOI, remaining]);

  const factionTrackedCount = (fname: string) =>
    FACTIONS[fname].nodes.reduce((acc, node) => acc + node.ranks.filter((_, i) => tracked.has(`${node.id}:${i}`)).length, 0);
  const allFactionTracked = fd.nodes.every(node => node.ranks.every((_, i) => tracked.has(`${node.id}:${i}`)));
  const curFacCount = factionTrackedCount(faction);
  const togglePOI = (map: string, poi: string) =>
    setActivePOI(p => p && p.map === map && p.poi === poi ? null : { map, poi });

  const BG0 = "#090b0e", BG1 = "#0f1318", BG2 = "#161c24", BG3 = "#1e2738";
  const BORDER = "rgba(255,255,255,0.07)";
  const TEXT = "#d6dde8", MUTED = "#6a7a8e", DIM = "#3a4a5a";
  const acc = fd.accent;
  const { cellW, cellH } = gridSizes(density);
  const RIGHT_W = 460;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: BG0, color: TEXT, fontFamily: "system-ui,sans-serif", fontSize: 26, overflow: "hidden" }}>

      {/* ── Top bar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", borderBottom: `1px solid ${BORDER}`, background: BG1, flexShrink: 0, minHeight: 60, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: acc, boxShadow: `0 0 16px ${acc}`, flexShrink: 0 }} />
          <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: "0.1em", color: TEXT, whiteSpace: "nowrap" }}>MARATHON</span>
          {windowWidth >= 1200 && <span style={{ fontSize: 22, color: MUTED, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>SALVAGE TRACKER</span>}
        </div>
        <div style={{ display: "flex", gap: 4, padding: "4px", background: BG0, borderRadius: 12, border: `1px solid ${BORDER}`, flexShrink: 0 }}>
          {["upgrades", "inventory"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 20, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
              background: view === v ? BG3 : "transparent", color: view === v ? TEXT : MUTED, transition: "all 0.15s", whiteSpace: "nowrap",
            }}>{v}</button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }} />
        <button
          onClick={() => {
            const state = { owned, tracked: [...tracked], ignored: [...ignored], faction, view };
            const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `marathon-tracker-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
          }}
          style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 20, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}
        >↓ Export</button>
        <label style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 20, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
          ↑ Import
          <input type="file" accept=".json" style={{ display: "none" }} onChange={e => {
            const f = e.target.files?.[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = () => {
              try {
                const d = JSON.parse(r.result as string);
                if (typeof d === "object" && !Array.isArray(d)) {
                  if (d.owned)   setOwned(d.owned);
                  if (d.tracked) setTracked(new Set(d.tracked));
                  if (d.ignored) setIgnored(new Set(d.ignored));
                  if (d.faction && d.faction in FACTIONS) setFaction(d.faction);
                  if (d.view)    setView(d.view);
                } else { alert("Invalid backup file."); }
              } catch { alert("Failed to parse backup file."); }
            };
            r.readAsText(f);
            e.target.value = "";
          }} />
        </label>
        {tracked.size > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, flexShrink: 0 }}>
            {windowWidth >= 960 && <span style={{ color: MUTED, whiteSpace: "nowrap" }}>{tracked.size} tracked</span>}
            <span style={{ color: "#D4922A", fontWeight: 600, whiteSpace: "nowrap" }}>◆ {totalCr.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* ── Faction tabs ── */}
      {view !== "inventory" && (
        <div style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${BORDER}`, background: BG1, flexShrink: 0, overflowX: "auto" }}>
          {Object.entries(FACTIONS).map(([name, f]) => {
            const active = name === faction, cnt = factionTrackedCount(name);
            return (
              <button key={name} onClick={() => setFaction(name)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "16px 28px", border: "none",
                borderBottom: `3px solid ${active ? f.accent : "transparent"}`,
                background: "transparent", color: active ? f.accent : MUTED,
                cursor: "pointer", fontSize: 20, fontWeight: 600,
                letterSpacing: "0.08em", whiteSpace: "nowrap", transition: "color 0.15s", flexShrink: 0,
              }}>
                {name.toUpperCase()}
                {cnt > 0 && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: f.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: BG0, fontWeight: 700 }}>{cnt}</div>
                )}
              </button>
            );
          })}
          <div style={{ flex: 1 }} />
          {tracked.size > 0 && (
            <button onClick={clearAll} style={{ padding: "10px 24px", margin: "0 16px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: "#cc5555", fontSize: 20, cursor: "pointer", fontWeight: 600, letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0 }}>
              CLEAR ALL
            </button>
          )}
        </div>
      )}

      {/* ── Inventory tab ── */}
      {view === "inventory" && (
        <InventoryTab
          owned={owned} setOwned={setOwned}
          BG0={BG0} BG1={BG1} BG2={BG2} BG3={BG3}
          BORDER={BORDER} TEXT={TEXT} MUTED={MUTED} DIM={DIM}
        />
      )}

      {/* ── Upgrades tab ── */}
      {view !== "inventory" && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

          {/* Grid area */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "auto", padding: 32 }}>
            {/* Faction banner */}
            <div style={{
              display: "flex", alignItems: "center", gap: 20, marginBottom: 32,
              padding: "20px 28px", background: BG2, borderRadius: 16,
              border: `1px solid ${acc}33`, borderLeft: `6px solid ${acc}`, flexWrap: "wrap",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: acc, letterSpacing: "0.08em", marginBottom: 4 }}>{faction.toUpperCase()}</div>
                <div style={{ fontSize: 22, color: MUTED }}>{fd.tag} · Rep: {fd.rep}</div>
              </div>
              <button
                onClick={allFactionTracked ? clearFaction : trackAllFaction}
                style={{ padding: "8px 22px", borderRadius: 8, border: `1px solid ${acc}88`, background: allFactionTracked ? acc + "22" : "transparent", color: acc, fontSize: 20, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}
              >{allFactionTracked ? "✓ ALL TRACKED" : "TRACK ALL"}</button>
              {curFacCount > 0 && (
                <button onClick={clearFaction} style={{ padding: "8px 22px", borderRadius: 8, border: `1px solid #cc555588`, background: "transparent", color: "#cc5555", fontSize: 20, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                  CLEAR {faction.toUpperCase()}
                </button>
              )}
            </div>

            {/* Node grid */}
            <div style={{ position: "relative", width: fd.cols * cellW, minHeight: fd.rows * cellH }}>
              <NodeConnectors nodes={fd.nodes} cols={fd.cols} rows={fd.rows} acc={acc} density={density} />
              {fd.nodes.map(node => (
                <div key={node.id} style={{ position: "absolute", left: (node.col - 1) * cellW, top: (node.row - 1) * cellH, width: gridSizes(density).cardW }}>
                  <NodeCard node={node} acc={acc} tracked={tracked} onTrack={toggleTrack} density={density} BG2={BG2} BORDER={BORDER} TEXT={TEXT} MUTED={MUTED} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Right panel ── */}
          <div style={{ width: rightOpen ? RIGHT_W : 44, borderLeft: `1px solid ${BORDER}`, background: BG1, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", transition: "width 0.2s ease", position: "relative" }}>
            <button
              onClick={() => setRightOpen(o => !o)}
              style={{ position: "absolute", top: 16, left: rightOpen ? 16 : 8, zIndex: 10, width: 28, height: 28, borderRadius: 8, border: `1px solid ${BORDER}`, background: BG2, color: MUTED, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >{rightOpen ? "›" : "‹"}</button>

            {rightOpen && (sortedItems.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 48, paddingTop: 72 }}>
                <div style={{ fontSize: 56, color: DIM }}>□</div>
                <div style={{ fontSize: 22, color: MUTED, textAlign: "center", lineHeight: 1.6 }}>Track upgrade ranks to build your salvage list</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", paddingTop: 60 }}>
                <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", color: MUTED, flex: 1 }}>SALVAGE REQUIRED</span>
                    {Object.keys(owned).length > 0 && (
                      <button onClick={() => setOwned({})} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, cursor: "pointer", background: "transparent", color: "#cc5555", fontSize: 18, fontWeight: 700 }}>✕</button>
                    )}
                  </div>
                  <div style={{ fontSize: 22, color: TEXT }}>
                    {sortedItems.length} items · {tracked.size} tracked · <span style={{ color: "#D4922A" }}>◆ {totalCr.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ overflowY: "auto", flex: 1 }}>
                  {/* Location scores */}
                  {locationScores.length > 0 && (
                    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
                      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", color: MUTED, marginBottom: 16 }}>BEST LOCATIONS TO FARM</div>
                      {locationScores.slice(0, 4).map(({ map, total, pois, containers }, i) => {
                        const m = MAPS[map] || { color: "#888" };
                        return (
                          <div key={map} style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                              <div style={{ width: 12, height: 12, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                              <span style={{ fontSize: 22, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? TEXT : MUTED, flex: 1 }}>{map}</span>
                              <span style={{ fontSize: 20, fontWeight: 700, color: m.color }}>{total}</span>
                            </div>
                            {pois.length > 0 && (
                              <div style={{ marginBottom: 8 }}>
                                <div style={{ fontSize: 16, letterSpacing: "0.1em", color: DIM, paddingLeft: 26, marginBottom: 4 }}>GROUND</div>
                                {pois.map(({ poi, count }, j) => {
                                  const isActive = activePOI?.map === map && activePOI?.poi === poi;
                                  return (
                                    <div key={poi}>
                                      <div
                                        onClick={() => togglePOI(map, poi)}
                                        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, cursor: "pointer", borderRadius: 8, padding: "6px 8px 6px 26px", background: isActive ? m.color + "22" : "transparent", border: `1px solid ${isActive ? m.color + "55" : "transparent"}` }}
                                      >
                                        <span style={{ color: j === 0 ? m.color : DIM, fontSize: 16, flexShrink: 0 }}>↳</span>
                                        <span style={{ fontSize: 18, color: isActive ? m.color : j === 0 ? TEXT : MUTED, fontWeight: j === 0 ? 600 : 400, flex: 1 }}>{poi}</span>
                                        <span style={{ fontSize: 18, fontWeight: 700, color: isActive ? m.color : MUTED, flexShrink: 0 }}>{count}</span>
                                        <span style={{ fontSize: 16, color: DIM, flexShrink: 0 }}>{isActive ? "▲" : "▼"}</span>
                                      </div>
                                      {isActive && (
                                        <div style={{ marginLeft: 44, marginBottom: 8, padding: "12px 16px", background: BG0, borderRadius: 8, border: `1px solid ${m.color}33` }}>
                                          {poiItems.length === 0
                                            ? <div style={{ fontSize: 18, color: MUTED }}>No items needed here</div>
                                            : poiItems.map(({ name, qty }) => {
                                              const rc = R[SALVAGE[name]?.r || "s"].color;
                                              return (
                                                <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                                  <SalvageIcon name={name} size={32} />
                                                  <span style={{ fontSize: 18, color: rc, flex: 1 }}>{name}</span>
                                                  <span style={{ fontSize: 18, fontWeight: 700, color: TEXT }}>×{qty}</span>
                                                </div>
                                              );
                                            })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {containers.length > 0 && (
                              <div>
                                <div style={{ fontSize: 16, letterSpacing: "0.1em", color: DIM, paddingLeft: 26, marginBottom: 4 }}>CONTAINERS & EVENTS</div>
                                {containers.map(({ name: ct, count }, j) => {
                                  const isActive = activePOI?.map === map && activePOI?.poi === ct;
                                  const cc = "#C8922A";
                                  return (
                                    <div key={ct}>
                                      <div
                                        onClick={() => togglePOI(map, ct)}
                                        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, cursor: "pointer", borderRadius: 8, padding: "6px 8px 6px 26px", background: isActive ? cc + "22" : "transparent", border: `1px solid ${isActive ? cc + "55" : "transparent"}` }}
                                      >
                                        <span style={{ color: isActive ? cc : DIM, fontSize: 16, flexShrink: 0 }}>◈</span>
                                        <span style={{ fontSize: 18, color: isActive ? cc : j === 0 ? MUTED : DIM, fontWeight: 400, flex: 1, fontStyle: "italic" }}>{ct}</span>
                                        <span style={{ fontSize: 18, fontWeight: 700, color: isActive ? cc : DIM, flexShrink: 0 }}>{count}</span>
                                        <span style={{ fontSize: 16, color: DIM, flexShrink: 0 }}>{isActive ? "▲" : "▼"}</span>
                                      </div>
                                      {isActive && (
                                        <div style={{ marginLeft: 44, marginBottom: 8, padding: "12px 16px", background: BG0, borderRadius: 8, border: `1px solid ${cc}33` }}>
                                          {poiItems.length === 0
                                            ? <div style={{ fontSize: 18, color: MUTED }}>No items needed here</div>
                                            : poiItems.map(({ name, qty }) => {
                                              const rc = R[SALVAGE[name]?.r || "s"].color;
                                              return (
                                                <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                                  <SalvageIcon name={name} size={32} />
                                                  <span style={{ fontSize: 18, color: rc, flex: 1 }}>{name}</span>
                                                  <span style={{ fontSize: 18, fontWeight: 700, color: TEXT }}>×{qty}</span>
                                                </div>
                                              );
                                            })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Salvage list by rarity */}
                  <div style={{ padding: "20px 24px", flex: 1 }}>
                    {["c", "p", "su", "d", "e", "s"].map(tier => {
                      const items = sortedItems.filter(([n]) => (SALVAGE[n]?.r || "s") === tier);
                      if (!items.length) return null;
                      const rc = R[tier].color;
                      return (
                        <div key={tier} style={{ marginBottom: 24 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 12, height: 12, borderRadius: 2, background: rc, flexShrink: 0 }} />
                            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", color: rc }}>{R[tier].label.toUpperCase()}</span>
                            <div style={{ flex: 1, height: "2px", background: BORDER }} />
                          </div>
                          {items.map(([name, qty]) => (
                            <ItemRow
                              key={name} name={name} qty={qty as number} have={owned[name] || 0}
                              isIgnored={ignored.has(name)} toggleIgnore={toggleIgnore}
                              BG0={BG0} BG2={BG2} BORDER={BORDER} TEXT={TEXT} MUTED={MUTED} DIM={DIM}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}