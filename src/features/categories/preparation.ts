import { GameStage, isGameStage } from "../../domain/game/stages";
import {
  categories,
  CategoryId,
  Difficulty,
  Question,
} from "../../content/questions";
import {
  assessStageRound,
  assessDifficultyRound,
  assessFreshRound,
  type GameRecord,
} from "../../domain/game/engine";
import {
  categoryForTopic,
  categoryPool,
  isPlayCategory,
  childrenCategory,
  type PlayCategoryId,
} from "../../domain/game/play-categories";
import type { LearningTopicId } from "../../content/questions/learning-topics-v1";
import { isLearningTopic, learningTopicPool } from "../../domain/game/learning";

export type PreparationCategory = CategoryId | "mixed";
export interface PreparationSelection {
  playCategory?: PlayCategoryId;
  category?: PreparationCategory;
  topic?: LearningTopicId;
  difficulty?: Difficulty;
  stage?: GameStage;
}
// Old links still resolve, but never expose a nested/legacy topic selector.
export function broadPreparationFromParams(
  params: Parameters<typeof preparationFromParams>[0] & {
    playCategory?: unknown;
  },
): PreparationSelection {
  const legacy = preparationFromParams(params);
  const playCategory = isPlayCategory(params.playCategory)
    ? params.playCategory
    : legacy.topic
      ? categoryForTopic(legacy.topic)
      : undefined;
  return playCategory
    ? {
        playCategory,
        difficulty: legacy.difficulty,
        ...(legacy.stage ? { stage: legacy.stage } : {}),
      }
    : legacy;
}

export function preparationFromParams(params: {
  category?: unknown;
  difficulty?: unknown;
  topic?: unknown;
  stage?: unknown;
}): PreparationSelection {
  // Historical deep links from the four broad category cards resolve to
  // the visible learning topics rather than a hidden second menu.
  const oldCategoryTopics: Partial<Record<CategoryId, LearningTopicId>> = {
    quran: "quran",
    prophets: "peygamberler",
    history: "islam_tarihi",
    general: "fikih",
  };
  const legacy = categories.find((c) => c.id === params.category)?.id;
  const topic = isLearningTopic(params.topic)
    ? params.topic
    : legacy
      ? oldCategoryTopics[legacy]
      : undefined;
  return {
    ...(topic ? { topic } : {}),
    category: topic
      ? undefined
      : params.category === "mixed"
        ? "mixed"
        : undefined,
    ...(isGameStage(params.stage) ? { stage: params.stage } : {}),
    difficulty: isGameStage(params.stage)
      ? undefined
      : params.difficulty === "easy" ||
          params.difficulty === "medium" ||
          params.difficulty === "hard"
        ? params.difficulty
        : undefined,
  };
}

export function preparationStatus(
  pool: readonly Question[],
  selection: PreparationSelection,
  history: readonly GameRecord[] = [],
) {
  if (selection.playCategory !== undefined) {
    if (
      !isPlayCategory(selection.playCategory) ||
      selection.topic ||
      selection.category
    )
      return {
        canStart: false,
        eligibleCount: null,
        message: "Tek bir kategori seç.",
      };
    if (selection.playCategory === "children")
      return {
        canStart: false,
        eligibleCount: null,
        message: childrenCategory.reason,
      };
  }
  if (
    selection.topic !== undefined &&
    (!isLearningTopic(selection.topic) || selection.category !== undefined)
  )
    return {
      canStart: false,
      eligibleCount: null,
      message: "Tek bir kategori seç.",
    };
  if (
    selection.stage &&
    (!isGameStage(selection.stage) || selection.difficulty)
  )
    return {
      canStart: false,
      eligibleCount: null,
      message: "Zorluk veya oyun aşamasından birini seç.",
    };
  const hasSubject = !!(
    selection.category ||
    selection.topic ||
    selection.playCategory
  );
  if (!hasSubject || (!selection.difficulty && !selection.stage)) {
    return {
      canStart: false,
      eligibleCount: null,
      message:
        !hasSubject && !selection.difficulty && !selection.stage
          ? "Bir kategori ve zorluk seç. Sırası sana kalmış."
          : !hasSubject
            ? "Şimdi bir kategori seç."
            : "Şimdi zorluğunu seç. İlk tur için Kolay ile başlayabilirsin.",
    };
  }
  const subjectPool = selection.playCategory
    ? categoryPool(pool, selection.playCategory)
    : selection.topic
      ? learningTopicPool(pool, selection.topic)
      : pool;
  const status =
    selection.playCategory || history.length
      ? assessFreshRound(
          subjectPool.filter(
            (q) =>
              !selection.category ||
              selection.category === "mixed" ||
              q.categoryId === selection.category,
          ),
          selection,
          history,
        )
      : selection.stage
        ? assessStageRound(subjectPool, selection.stage)
        : assessDifficultyRound(
            selection.topic ? learningTopicPool(pool, selection.topic) : pool,
            selection.difficulty!,
            selection.category === "mixed" ? undefined : selection.category,
          );
  return {
    ...status,
    message: status.canStart
      ? "Yarışmaya hazırsın!"
      : "exhausted" in status && status.exhausted
        ? "Bu kategorideki yeni soruları tamamladın. Başka seçim yapabilir veya isteğe bağlı yeniden oynayabilirsin."
        : "Bu seçim şu anda oynanamıyor. Benzer soruları tekrarlamamak için başka kategori veya zorluk seç.",
  };
}
