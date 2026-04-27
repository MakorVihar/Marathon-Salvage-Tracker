export function expandContainers(containers: string[]): string[] {
  const out: string[] = [];
  for (const ct of containers) {
    if (ct === "Locked Rooms [Deluxe, Superior, Prestige]") {
      out.push("Locked Rooms [Deluxe]", "Locked Rooms [Superior]", "Locked Rooms [Prestige]");
    } else if (ct === "Locked Rooms [Superior, Prestige]") {
      out.push("Locked Rooms [Superior]", "Locked Rooms [Prestige]");
    } else {
      out.push(ct);
    }
  }
  return out;
}