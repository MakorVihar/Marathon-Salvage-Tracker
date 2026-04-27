export type Density = "full" | "compact" | "icon";

export interface RankDef {
  name: string;
  fx: string;
  cr: number;
  req: [string, number][];
}

export interface NodeDef {
  id: string;
  name: string;
  requires: string | null;
  col: number;
  row: number;
  ranks: RankDef[];
}

export interface SalvageInfo {
  r?: string;
  locs?: { map: string; poi: string }[];
  containers?: string[];
}