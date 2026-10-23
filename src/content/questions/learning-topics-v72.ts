import type { LearningTopicId } from "./learning-topics-v1";
import { reviewedTopicByQuestionIdV71 } from "./learning-topics-v71-reviewed";

// Version 3: explicit verse-reading questions belong to Quran comprehension.
// Older taxonomy versions resolve their own frozen map, never this overlay.
const mapping: Record<string, LearningTopicId> = {
  ...reviewedTopicByQuestionIdV71,
};
for (let number = 1; number <= 30; number++) {
  const suffix = String(number).padStart(3, "0");
  delete mapping[`e150-quran-${suffix}`];
}
for (const id of [
  "quran-meaning-v72-001",
  "quran-meaning-v72-002",
  "quran-meaning-v72-004",
  "quran-meaning-v72-006",
  "quran-meaning-v72-007",
  "quran-meaning-v72-008",
  "quran-meaning-v72-009",
  "quran-meaning-v72-011",
  "quran-meaning-v72-012",
  "quran-meaning-v72-014",
  "quran-meaning-v72-015",
  "quran-meaning-v72-017",
  "quran-meaning-v72-019",
  "quran-meaning-v72-020",
  "quran-meaning-v72-021",
  "quran-meaning-v72-022",
  "quran-meaning-v72-023",
  "quran-meaning-v72-024",
  "quran-meaning-v72-025",
  "quran-meaning-v72-026",
  "quran-meaning-v72-027",
  "quran-meaning-v72-028",
  "quran-meaning-v72-029",
  "quran-meaning-v72-030",
  "quran-meaning-v72-032",
  "quran-meaning-v72-033",
  "quran-meaning-v72-035",
  "quran-meaning-v72-036",
  "quran-meaning-v72-037",
  "quran-meaning-v72-038",
])
  mapping[id] = "quran";
export const reviewedTopicByQuestionIdV72: Readonly<
  Record<string, LearningTopicId>
> = Object.freeze(mapping);
