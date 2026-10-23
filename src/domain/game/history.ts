import { questionById, type Question } from "../../content/questions";
import { historicalQuestion } from "../../content/questions/registry";
import type { GameRecord } from "./engine";
import { selectionConceptKeys } from "./concepts";

// Style/template keys are round-local. Global history excludes facts, wording
// aliases and IDs, not every different fact using the same question template.
const factKeys = (q: Parameters<typeof selectionConceptKeys>[0]) =>
  selectionConceptKeys(q).filter((k) => !k.startsWith("template:"));
const indexes = new WeakMap<
  readonly GameRecord[],
  { ids: Set<string>; keys: Set<string> }
>();
function historyIndex(games: readonly GameRecord[]) {
  const cached = indexes.get(games);
  if (cached) return cached;
  const ids = new Set<string>(),
    keys = new Set<string>();
  for (const game of games)
    for (const id of game.questionIds) {
      ids.add(id);
      // Both snapshots matter: subsequent source corrections cannot erase exposure.
      for (const q of [
        historicalQuestion(game.bankVersion, id),
        questionById.get(id),
      ])
        if (q) for (const key of factKeys(q)) keys.add(key);
    }
  const result = { ids, keys };
  indexes.set(games, result);
  return result;
}
export function unseenQuestionPool(
  pool: readonly Question[],
  games: readonly GameRecord[],
) {
  if (!games.length) return [...pool];
  const { ids, keys } = historyIndex(games);
  return pool.filter(
    (q) => !ids.has(q.id) && factKeys(q).every((k) => !keys.has(k)),
  );
}
