import {
  PLAY_CATEGORY_VERSION,
  childrenCategory,
} from "../src/domain/game/play-categories";
// Counts only: lets the deployed artifact be checked without publishing keys or questions.
import { writeFileSync } from "node:fs";
import { BANK_VERSION, playableQuestions } from "../src/content/questions";
import { LEARNING_TOPIC_VERSION } from "../src/domain/game/learning";
import { categoryOptions } from "../src/features/categories/learning-options";

const pool = playableQuestions("production");
const topics = categoryOptions(pool).map(({ id, title, count }) => ({
  id,
  title,
  count,
  difficulties: Object.fromEntries(
    (["easy", "medium", "hard"] as const).map((difficulty) => [
      difficulty,
      categoryOptions(pool, difficulty).find((topic) => topic.id === id)!.count,
    ]),
  ),
}));
if (topics.reduce((total, topic) => total + topic.count, 0) !== pool.length)
  throw new Error("Deployed topic counts must cover the complete bank");
writeFileSync(
  "dist/topic-manifest.json",
  JSON.stringify({
    bankVersion: BANK_VERSION,
    topicVersion: LEARNING_TOPIC_VERSION,
    categoryVersion: PLAY_CATEGORY_VERSION,
    children: {
      status: childrenCategory.status,
      playable: childrenCategory.available,
      includedInTotal: false,
    },
    total: pool.length,
    topics,
  }),
);
console.log(
  `Prepared ${topics.length} topic counts covering ${pool.length} questions`,
);
