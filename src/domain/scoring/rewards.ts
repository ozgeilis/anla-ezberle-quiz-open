import { GameRecord, stats } from "../game/engine";
// Question order, answer order, difficulty, topic and bank renumbering cannot
// turn an identical ten-question set into a fresh reward opportunity.
export const roundKey = (game: Pick<GameRecord, "questionIds">) =>
  [...game.questionIds].sort().join("|");
export function creditedRounds(games: readonly GameRecord[]) {
  const ids = new Set<string>(),
    sets = new Set<string>(
      games.filter((g) => g.rewardVersion !== 1).map(roundKey),
    );
  // Persisted append order is authoritative: a backdated replay cannot replace
  // the first credited result or retroactively improve its XP.
  return games.filter((game) => {
    if (ids.has(game.id)) return false;
    ids.add(game.id);
    const key = roundKey(game),
      eligible = game.rewardVersion !== 1 || !sets.has(key);
    sets.add(key);
    return eligible;
  });
}
export function rewardSummary(games: readonly GameRecord[]) {
  return creditedRounds(games).reduce(
    (sum, g) => sum + stats(g).correct * 10,
    0,
  );
}
export function uniqueRounds(games: readonly GameRecord[]) {
  const ids = new Set<string>(),
    sets = new Set<string>(),
    days = new Set<string>();
  // Persisted append order is authoritative: a backdated replay cannot replace
  // the first credited result or retroactively improve its XP.
  return games.filter((g) => {
    const key = roundKey(g);
    if (ids.has(g.id) || sets.has(key) || (g.dailyKey && days.has(g.dailyKey)))
      return false;
    ids.add(g.id);
    sets.add(key);
    if (g.dailyKey) days.add(g.dailyKey);
    return true;
  });
}
