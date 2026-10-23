// Private SQL export only. Never imported by the client application.
import { bankV41 as questions } from "../src/content/questions/archive/bank-v41";
import { learningTopicsV1 } from "../src/content/questions/learning-topics-v1";
import { learningTopicPool } from "../src/domain/game/learning";
import {
  independentQuestions,
  selectionConceptKeys,
} from "../src/domain/game/engine";
import { liveLevels, liveCounts, liveQuotas } from "../src/domain/live/rules";
const LIVE_BANK_VERSION = 41; // Keep the staged server export pinned to the validated 600-question snapshot.
const quote = (s: string) => "'" + s.replaceAll("'", "''") + "'";
const json = (v: unknown) => quote(JSON.stringify(v)) + "::jsonb";
export function liveContent() {
  if (
    questions.length !== 600 ||
    questions.some(
      (q) =>
        q.reviewStatus !== "approved" ||
        q.sources.some((s) => s.checkStatus !== "supported"),
    )
  )
    throw new Error("Published 600-question bank required");
  const topics = new Map(
    learningTopicsV1.map((t) => [
      t.id,
      new Set(learningTopicPool(questions, t.id, 1).map((q) => q.id)),
    ]),
  );
  const rows = questions.map((q) => ({
    id: q.id,
    version: q.version,
    public: {
      id: q.id,
      version: q.version,
      prompt: q.question,
      options: q.options,
    },
    difficulty: q.difficulty,
    topic: [...topics].find(([, ids]) => ids.has(q.id))?.[0],
    keys: [`id:${q.id}`, ...selectionConceptKeys(q)],
    correct: q.correctOptionId,
    explanation: q.explanation,
    sources: q.sources,
  }));
  if (rows.some((q) => !q.topic)) throw new Error("Missing live topic mapping");
  const pools = [];
  for (const topic of ["mixed", ...learningTopicsV1.map((t) => t.id)])
    for (const level of liveLevels)
      for (const count of liveCounts) {
        const quotas = liveQuotas(level, count);
        const pool = questions.filter(
          (q) =>
            (topic === "mixed" ||
              topics
                .get(topic as (typeof learningTopicsV1)[number]["id"])!
                .has(q.id)) &&
            quotas[q.difficulty] > 0,
        );
        const sample = independentQuestions(pool, quotas, count);
        pools.push({
          topic,
          level,
          count,
          quotas,
          candidates: pool.map((q) => q.id),
          sample: sample?.map((q) => q.id) ?? [],
        });
      }
  return { rows, pools, version: LIVE_BANK_VERSION };
}
export function liveContentSql() {
  const data = liveContent(),
    dataset = `bank-v${data.version}`;
  return `BEGIN;
INSERT INTO quiz_private.live_questions(dataset,id,version,question,difficulty,topic,concept_keys) VALUES
${data.rows.map((q) => `(${quote(dataset)},${quote(q.id)},${q.version},${json(q.public)},${quote(q.difficulty)},${quote(q.topic!)},ARRAY[${q.keys.map(quote).join(",")}])`).join(",\n")};
INSERT INTO quiz_private.live_keys(dataset,id,correct_option,explanation,sources) VALUES
${data.rows.map((q) => `(${quote(dataset)},${quote(q.id)},${quote(q.correct)},${quote(q.explanation)},${json(q.sources)})`).join(",\n")};
INSERT INTO quiz_private.live_pools(dataset,topic,level,question_count,quotas,candidates,sample) VALUES
${data.pools.map((p) => `(${quote(dataset)},${quote(p.topic)},${quote(p.level)},${p.count},${json(p.quotas)},${json(p.candidates)},${json(p.sample)})`).join(",\n")};
SELECT quiz_private.live_validate_dataset(${quote(dataset)});
UPDATE quiz_private.live_config SET dataset=${quote(dataset)},enabled=true WHERE singleton;
COMMIT;`;
}
