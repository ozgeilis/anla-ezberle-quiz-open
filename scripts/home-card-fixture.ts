// Test-only records produced by the existing engine, never application defaults.
import { writeFileSync } from "node:fs";
import {
  answerQuestion,
  advanceQuestion,
  createSession,
  finishSession,
  stats,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import { achievements } from "../src/domain/achievements/evaluate";
import { emptyData, parseData, STORAGE_KEY } from "../src/storage/schema";

function record(daily: boolean, correct: number, at: number) {
  let session = createSession(daily ? "daily" : "mixed", undefined, at);
  for (let i = 0; i < session.questionIds.length; i++) {
    const q = gameQuestion(session, session.questionIds[i]!)!;
    session = answerQuestion(
      session,
      i < correct ? q.correct : (q.correct + 1) % 4,
      at + i * 1000 + 500,
    );
    if (i < session.questionIds.length - 1) session = advanceQuestion(session);
  }
  return finishSession(session);
}
const now = Date.now() - 60_000;
const history = record(false, 8, now - 86_400_000);
const daily = record(true, 6, now);
const scenarios = Object.fromEntries(
  ["empty", "history", "daily"].map((name) => {
    const data = emptyData();
    data.profile.name = "Deneme Oyuncusu";
    data.profile.reduceMotion = true;
    data.games =
      name === "daily" ? [history, daily] : name === "history" ? [history] : [];
    const parsed = parseData(JSON.stringify(data));
    return [
      name,
      {
        data: parsed,
        lastScore: data.games.length ? stats(data.games.at(-1)!).score : null,
        dailyScore: name === "daily" ? stats(daily).score : null,
        earned: achievements(data.games).filter((b) => b.earned).length,
        totalBadges: achievements(data.games).length,
      },
    ];
  }),
);
writeFileSync(
  process.env.HOME_FIXTURE_PATH ?? "/tmp/anla-home-card-fixture.json",
  JSON.stringify({ storageKey: STORAGE_KEY, scenarios }),
);
