/** Isolated UI fixtures generated from the real bank/engine. */
import { writeFileSync } from "node:fs";
import { availableQuestions } from "../src/content/questions";
import {
  createSession,
  answerQuestion,
  advanceQuestion,
  finishSession,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import { emptyData, parseData, STORAGE_KEY } from "../src/storage/schema";
const data = emptyData();
data.profile = { ...data.profile, name: "Deneme Oyuncusu", reduceMotion: true };
for (let n = 0; n < 6; n++) {
  let s = createSession("mixed", undefined, Date.now() - 100000 - n * 1000, {
    channel: "prototype",
    stage: "beginner",
    learningTopic: "quran",
  });
  for (let i = 0; i < 10; i++) {
    const q = gameQuestion(s, s.questionIds[i]!)!;
    s = answerQuestion(s, q.correct, s.startedAt + i + 1);
    if (i < 9) s = advanceQuestion(s);
  }
  data.games.push(finishSession(s));
}
writeFileSync(
  "/tmp/achievement-fixture.json",
  JSON.stringify({
    storageKey: STORAGE_KEY,
    data: parseData(JSON.stringify(data)),
    answers: availableQuestions.map((q) => ({
      prompt: q.question,
      answer: q.options.find((o) => o.id === q.correctOptionId)!.text,
    })),
  }),
);
