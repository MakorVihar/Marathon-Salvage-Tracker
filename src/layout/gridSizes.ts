import { Density } from "../types";

export const FULL_CELL_W = 360, FULL_CELL_H = 380, FULL_CARD_W = 320, FULL_CARD_MIN_H = 220;
export const COMP_CELL_W = 240, COMP_CELL_H = 320, COMPACT_CARD_W = 208, COMPACT_CARD_MIN_H = 200;
export const ICON_CELL_W = 144, ICON_CELL_H = 160, ICON_CARD_W = 120, ICON_CARD_H = 136;

export function gridSizes(d: Density): { cellW: number; cellH: number; cardW: number; cardMinH: number } {
  if (d === "full")    return { cellW: FULL_CELL_W, cellH: FULL_CELL_H, cardW: FULL_CARD_W,    cardMinH: FULL_CARD_MIN_H };
  if (d === "compact") return { cellW: COMP_CELL_W, cellH: COMP_CELL_H, cardW: COMPACT_CARD_W, cardMinH: COMPACT_CARD_MIN_H };
  return                      { cellW: ICON_CELL_W, cellH: ICON_CELL_H, cardW: ICON_CARD_W,    cardMinH: ICON_CARD_H };
}

export function makeConnectorHelpers(cellW: number, cellH: number, cardW: number, cardMinH: number) {
  const gcx     = (col: number) => (col - 1) * cellW + cardW / 2;
  const gRight  = (col: number) => (col - 1) * cellW + cardW;
  const gLeft   = (col: number) => (col - 1) * cellW;
  const gBottom = (row: number) => (row - 1) * cellH + cardMinH;
  const gTop    = (row: number) => (row - 1) * cellH;
  const gMidY   = (row: number) => (row - 1) * cellH + cardMinH / 2;
  return { gcx, gRight, gLeft, gBottom, gTop, gMidY };
}