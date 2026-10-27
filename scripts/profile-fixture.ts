// Test-only real engine records. Never imported by application routes.
import { writeFileSync } from "node:fs";
import {
  createSession,
  answerQuestion,
  advanceQuestion,
  finishSession,
  dateKey,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import { emptyData, parseData, STORAGE_KEY } from "../src/storage/schema";
import { achievements } from "../src/domain/achievements/evaluate";
const data = emptyData();
for (let i = 0; i < 8; i++) {
  const day = new Date();
  day.setUTCDate(day.getUTCDate() - Math.floor(i / 2));
  const at = Date.parse(
    `${dateKey(day)}T12:${String(i * 2).padStart(2, "0")}:00+03:00`,
  );
  let s = createSession("mixed", undefined, at, {
    playCategory: "tarih_medeniyet",
    difficulty: "easy",
  });
  for (let n = 0; n < 10; n++) {
    const q = gameQuestion(s, s.questionIds[n]!)!;
    s = answerQuestion(
      s,
      i === 0 || n < 8 ? q.correct : (q.correct + 1) % 4,
      at + n * 1000 + 500,
    );
    if (n < 9) s = advanceQuestion(s);
  }
  data.games.push(finishSession(s));
}
data.profile.name = "Deneme Oyuncusu";
data.profile.avatar = 4;
data.showcase = achievements(data.games)
  .filter((b) => b.earned)
  .slice(0, 3)
  .map((b) => b.id);
if (data.showcase.length !== 3)
  throw Error("Three earned fixture badges required");
writeFileSync(
  process.env.PROFILE_FIXTURE_PATH ?? "/tmp/anla-profile-fixture.json",
  JSON.stringify({
    storageKey: STORAGE_KEY,
    data: parseData(JSON.stringify(data)),
  }),
);
