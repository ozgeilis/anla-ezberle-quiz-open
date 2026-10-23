import { GameStage } from "../../domain/game/stages";
import type { Difficulty, Question } from "../../content/questions";
import {
  learningTopicsV1,
  learningThemeSetsV1,
} from "../../content/questions/learning-topics-v1";
import {
  assessStageRound,
  assessDifficultyRound,
  assessFreshRound,
  type GameRecord,
} from "../../domain/game/engine";
import {
  playCategories,
  categoryPool,
} from "../../domain/game/play-categories";
import {
  learningTopicPool,
  type LearningTopicVersion,
  LEARNING_TOPIC_VERSION,
} from "../../domain/game/learning";

export function learningOptions(
  pool: readonly Question[],
  difficulty?: Difficulty,
  stage?: GameStage,
  version: LearningTopicVersion = LEARNING_TOPIC_VERSION,
) {
  return learningTopicsV1.map((topic) => {
    const questions = learningTopicPool(pool, topic.id, version);
    const status = stage
      ? assessStageRound(questions, stage)
      : difficulty
        ? assessDifficultyRound(questions, difficulty)
        : null;
    return {
      ...topic,
      count: status?.eligibleCount ?? questions.length,
      available:
        status?.canStart ??
        (["easy", "medium", "hard"] as const).some(
          (level) => assessDifficultyRound(questions, level).canStart,
        ),
    };
  });
}
export function categoryOptions(
  pool: readonly Question[],
  difficulty?: Difficulty,
  stage?: GameStage,
  history: readonly GameRecord[] = [],
) {
  return playCategories.map((category) => {
    const questions = categoryPool(pool, category.id);
    const full =
      difficulty || stage
        ? assessFreshRound(questions, { difficulty, stage })
        : null;
    const fresh =
      difficulty || stage
        ? assessFreshRound(questions, { difficulty, stage }, history)
        : null;
    return {
      ...category,
      count: full?.eligibleCount ?? questions.length,
      available:
        full?.canStart ??
        (["easy", "medium", "hard"] as const).some(
          (d) => assessDifficultyRound(questions, d).canStart,
        ),
      freshCount: fresh?.freshCount,
      exhausted: fresh?.exhausted ?? false,
    };
  });
}

// Manifests are design/review material, never a play route. Unlocking these
// requires a separate publication change and physical-device acceptance.
export const upcomingCollections = [
  ...learningThemeSetsV1.map((set) => ({
    id: set.id,
    title: set.title,
    status: "Hazırlanıyor" as const,
    reason: "Bu set için içerik incelemesi henüz tamamlanmadı.",
  })),
] as const;
