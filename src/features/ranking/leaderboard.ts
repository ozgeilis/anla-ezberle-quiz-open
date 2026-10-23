import type { LeaderboardEntry } from "../online/types";
/** Pagination never invents ranks or persists public/private account snapshots. */
export function mergeRankedEntries(
  previous: readonly LeaderboardEntry[],
  next: readonly LeaderboardEntry[],
) {
  const byId = new Map(previous.map((e) => [e.player.id, e]));
  for (const entry of next) byId.set(entry.player.id, entry);
  return [...byId.values()].sort(
    (a, b) => a.rank - b.rank || a.player.id.localeCompare(b.player.id),
  );
}
