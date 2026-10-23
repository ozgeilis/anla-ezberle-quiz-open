/** Generated test-only data; never reads an installed app's storage. */
import { readFileSync, writeFileSync } from "node:fs";
import {
  createSession,
  answerQuestion,
  advanceQuestion,
  finishSession,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import { availableQuestions } from "../src/content/questions";
import { parseData } from "../src/storage/schema";
const fixture = JSON.parse(
  readFileSync("/tmp/premium-ui-fixture.json", "utf8"),
);
const data = parseData(JSON.stringify(fixture.data));
let session = createSession("mixed", undefined, Date.now());
for (let i = 0; i < 10; i++) {
  const q = gameQuestion(session, session.questionIds[i]!)!;
  session = answerQuestion(
    session,
    i < 7 ? q.correct : (q.correct + 1) % 4,
    session.startedAt + i + 1,
  );
  if (i < 9) session = advanceQuestion(session);
}
data.games.push(finishSession(session));
writeFileSync(
  "/tmp/player-system-fixture.json",
  JSON.stringify({
    storageKey: fixture.storageKey,
    data: parseData(JSON.stringify(data)),
    answers: availableQuestions.map((q) => ({
      prompt: q.question,
      answer: q.options.find((o) => o.id === q.correctOptionId)!.text,
    })),
  }),
);
