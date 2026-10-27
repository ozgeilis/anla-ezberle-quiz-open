// Local compatibility fixtures ONLY. Never imported by a new-game exporter.
import { bankV13 } from "../../../src/content/questions/archive/bank-v13";
import { bankV41 } from "../../../src/content/questions/archive/bank-v41";
import { learningTopicsV1 } from "../../../src/content/questions/learning-topics-v1";
import { assignedLearningTopic } from "../../../src/domain/game/learning";
import {
  independentQuestions,
  selectionConceptKeys,
} from "../../../src/domain/game/engine";
import {
  liveCounts,
  liveLevels,
  liveQuotas,
} from "../../../src/domain/live/rules";
const str = (v: string) => "'" + v.replaceAll("'", "''") + "'";
const json = (v: unknown) => str(JSON.stringify(v)) + "::jsonb";
export function legacyServerSeed() {
  const async = bankV13
    .map(
      (q) =>
        `(${str(q.id)},${q.version},${str(q.question)},${json(q.options.map((o, i) => ({ id: String.fromCharCode(97 + i), text: o.text })))},'owner_approved_v13')`,
    )
    .join(",");
  const keys = bankV13
    .map(
      (q) =>
        `(${str(q.id)},${q.version},${str(String.fromCharCode(97 + q.options.findIndex((o) => o.id === q.correctOptionId)))},${str(q.explanation)})`,
    )
    .join(",");
  const live = bankV41
    .map(
      (q) =>
        `('bank-v41',${str(q.id)},${q.version},${json({ id: q.id, version: q.version, prompt: q.question, options: q.options })},${str(q.difficulty)},${str(assignedLearningTopic(q.id, 1)!)},ARRAY[${[`id:${q.id}`, ...selectionConceptKeys(q)].map(str).join(",")}])`,
    )
    .join(",");
  const liveKeys = bankV41
    .map(
      (q) =>
        `('bank-v41',${str(q.id)},${str(q.correctOptionId)},${str(q.explanation)},${json(q.sources)})`,
    )
    .join(",");
  const pools = [];
  for (const topic of ["mixed", ...learningTopicsV1.map((t) => t.id)])
    for (const level of liveLevels)
      for (const n of liveCounts) {
        const quotas = liveQuotas(level, n);
        const pool = bankV41.filter(
          (q) =>
            (topic === "mixed" || assignedLearningTopic(q.id, 1) === topic) &&
            quotas[q.difficulty] > 0,
        );
        const sample =
          independentQuestions(pool, quotas, n)?.map((q) => q.id) ?? [];
        pools.push(
          `('bank-v41',${str(topic)},${str(level)},${n},${json(quotas)},${json(pool.map((q) => q.id))},${json(sample)})`,
        );
      }
  return `INSERT INTO quiz_private.quiz_questions VALUES ${async};
INSERT INTO quiz_private.quiz_answer_keys VALUES ${keys};
INSERT INTO quiz_private.live_questions VALUES ${live};
INSERT INTO quiz_private.live_keys VALUES ${liveKeys};
INSERT INTO quiz_private.live_pools VALUES ${pools.join(",")};
UPDATE quiz_private.online_content_config SET active_scope='owner_approved_v13';
UPDATE quiz_private.live_config SET dataset='bank-v41',enabled=true;
SELECT quiz_private.live_validate_dataset('bank-v41');`;
}
