import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeRankedEntries } from "../src/features/ranking/leaderboard";
import type { LeaderboardEntry } from "../src/features/online/types";
const entry = (id: string, rank: number, xp = 0): LeaderboardEntry => ({
  rank,
  games: 1,
  player: { id, username: id, name: id, avatar: 0, xp, level: 1 },
});
test("leaderboard pages retain authoritative ranks and replace duplicate IDs without inventing points", () => {
  const first = [entry("a", 1, 400), entry("b", 2, 350)];
  const next = [entry("b", 3, 350), entry("c", 4, 0)];
  const all = mergeRankedEntries(first, next);
  assert.equal(all.length, 3);
  assert.deepEqual(
    all.map((e) => e.rank),
    [1, 3, 4],
  );
  assert.equal(all[2]?.player.xp, 0);
  assert.equal(first[1]?.rank, 2);
  assert.deepEqual(mergeRankedEntries([], []), []);
});
