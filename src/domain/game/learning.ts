import { reviewedTopicByQuestionIdV71 } from "../../content/questions/learning-topics-v71-reviewed";
import { reviewedTopicByQuestionIdV72 } from "../../content/questions/learning-topics-v72";
import type { Question } from "../../content/questions/model";
import { expandedTopicByQuestionIdV71 } from "../../content/questions/learning-topics-v71-expanded";
import { publishedNewQuestionTopicsV15 } from "../../content/questions/published-v15";
import { publishedNewQuestionTopicsV16 } from "../../content/questions/published-v16";
import { publishedNewQuestionTopicsV17 } from "../../content/questions/published-v17";
import { publishedNewQuestionTopicsV18 } from "../../content/questions/published-v18";
import { publishedNewQuestionTopicsV19 } from "../../content/questions/published-v19";
import { publishedNewQuestionTopicsV20 } from "../../content/questions/published-v20";
import { publishedNewQuestionTopicsV21 } from "../../content/questions/published-v21";
import { publishedNewQuestionTopicsV22 } from "../../content/questions/published-v22";
import { publishedNewQuestionTopicsV23 } from "../../content/questions/published-v23";
import { publishedNewQuestionTopicsV24 } from "../../content/questions/published-v24";
import { publishedNewQuestionTopicsV25 } from "../../content/questions/published-v25";
import { publishedNewQuestionTopicsV26 } from "../../content/questions/published-v26";
import { publishedNewQuestionTopicsV27 } from "../../content/questions/published-v27";
import { publishedNewQuestionTopicsV28 } from "../../content/questions/published-v28";
import { publishedNewQuestionTopicsV29 } from "../../content/questions/published-v29";
import { publishedNewQuestionTopicsV30 } from "../../content/questions/published-v30";
import { publishedNewQuestionTopicsV31 } from "../../content/questions/published-v31";
import {
  LearningTopicId,
  learningTopicsV1,
  primaryTopicByQuestionIdV1,
} from "../../content/questions/learning-topics-v1";

// Versioned taxonomy only. Draft question modules are deliberately not imported.
export const LEARNING_TOPIC_VERSION = 3 as const;
export type LearningTopicVersion = 1 | 2 | typeof LEARNING_TOPIC_VERSION;
export function isLearningTopicVersion(
  value: unknown,
): value is LearningTopicVersion {
  return value === 1 || value === 2 || value === LEARNING_TOPIC_VERSION;
}
export function isLearningTopic(value: unknown): value is LearningTopicId {
  return learningTopicsV1.some((topic) => topic.id === value);
}
export function learningTopicName(topic: LearningTopicId): string {
  return learningTopicsV1.find((item) => item.id === topic)!.title;
}
// Current games use the v72/v3 partition. Saved v1 and v2 games retain the
// frozen mappings from their original releases, including PR77 previews.
export function assignedLearningTopic(
  id: string,
  version: LearningTopicVersion = LEARNING_TOPIC_VERSION,
): LearningTopicId | undefined {
  if (version === 3) return reviewedTopicByQuestionIdV72[id];
  if (version === 2) return reviewedTopicByQuestionIdV71[id];
  return (
    primaryTopicByQuestionIdV1[id] ??
    publishedNewQuestionTopicsV15[id] ??
    publishedNewQuestionTopicsV16[id] ??
    publishedNewQuestionTopicsV17[id] ??
    publishedNewQuestionTopicsV18[id] ??
    publishedNewQuestionTopicsV19[id] ??
    publishedNewQuestionTopicsV20[id] ??
    publishedNewQuestionTopicsV21[id] ??
    publishedNewQuestionTopicsV22[id] ??
    publishedNewQuestionTopicsV23[id] ??
    publishedNewQuestionTopicsV24[id] ??
    publishedNewQuestionTopicsV25[id] ??
    publishedNewQuestionTopicsV26[id] ??
    publishedNewQuestionTopicsV27[id] ??
    publishedNewQuestionTopicsV28[id] ??
    publishedNewQuestionTopicsV29[id] ??
    publishedNewQuestionTopicsV30[id] ??
    publishedNewQuestionTopicsV31[id] ??
    expandedTopicByQuestionIdV71[id]
  );
}

export function learningTopicPool(
  pool: readonly Question[],
  topic: LearningTopicId,
  version: LearningTopicVersion = LEARNING_TOPIC_VERSION,
): Question[] {
  // A permissive prototype channel must not silently publish learning drafts.
  return pool.filter(
    (q) =>
      q.reviewStatus === "approved" &&
      assignedLearningTopic(q.id, version) === topic,
  );
}
export function belongsToLearningTopic(
  id: string,
  topic: LearningTopicId,
  version: LearningTopicVersion = LEARNING_TOPIC_VERSION,
) {
  return assignedLearningTopic(id, version) === topic;
}
