// Private local/CI oracle for UI acceptance. Never import this into the app/export.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { availableQuestions } from "../src/content/questions";
import {
  createSession,
  answerQuestion,
  advanceQuestion,
  finishSession,
  type GameRecord,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import { emptyData, STORAGE_KEY } from "../src/storage/schema";
import { progress } from "../src/domain/scoring/progress";
const out = process.argv[2];
if (!out || !resolve(out).startsWith("/tmp/"))
  throw Error("Fixture must stay in private /tmp outside the Expo project");
const games: GameRecord[] = [];
for (let n = 0; n < 3; n++) {
  const at = Date.now() - 86400000 * (4 - n);
  let s = createSession("mixed", undefined, at, {
    channel: "prototype",
    difficulty: "easy",
    history: games,
  });
  for (let i = 0; i < 10; i++) {
    const q = gameQuestion(s, s.questionIds[i]!)!;
    s = answerQuestion(
      s,
      i < 8 ? q.correct : (q.correct + 1) % 4,
      at + 1000 * (i + 1),
    );
    if (i < 9) s = advanceQuestion(s);
  }
  games.push(finishSession(s));
}
if (progress(games).xp !== 240) throw Error("Invalid isolated fixture XP");
const data = { ...emptyData(), games };
const oracle = Object.fromEntries(
  availableQuestions.map((q) => [
    q.id,
    q.options.find((o) => o.id === q.correctOptionId)!.text,
  ]),
);
mkdirSync(resolve(out, ".."), { recursive: true, mode: 0o700 });
writeFileSync(out, JSON.stringify({ storageKey: STORAGE_KEY, data, oracle }), {
  mode: 0o600,
});
console.log(
  "Isolated audio fixture prepared outside Expo; no accounts or scores sent to a hosted server.",
);
