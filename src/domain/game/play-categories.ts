import type { GameRecord } from "./engine";
import type { Question } from "../../content/questions/model";
import type { LearningTopicId } from "../../content/questions/learning-topics-v1";
import { reviewedTopicByQuestionIdV71 } from "../../content/questions/learning-topics-v71-reviewed";
import { reviewedTopicByQuestionIdV72 } from "../../content/questions/learning-topics-v72";

// New navigation only: v1/v2 learning topics and saved records stay frozen.
export const PLAY_CATEGORY_VERSION = 2 as const;
export const playCategories = [
  {
    id: "quran_dualar",
    title: "Kur'an ve Dualar",
    subtitle: "Âyetlerden dualara bir keşif",
    topics: ["quran", "dualar"],
    artwork: "quran",
  },
  {
    id: "siyer_sahabe",
    title: "Peygamberimizin Hayatı ve Sahabe",
    subtitle: "Bir hayat, unutulmaz yol arkadaşları",
    topics: ["siyer", "sahabe"],
    artwork: "siyer",
  },
  {
    id: "peygamberler",
    title: "Peygamber Kıssaları",
    subtitle: "Kıssaları tanı, yeni bilgiler keşfet",
    topics: ["peygamberler"],
    artwork: "peygamberler",
  },
  {
    id: "fikih",
    title: "İbadet ve Fıkıh",
    subtitle: "Temel kavramlar ve ibadet bilgisi",
    topics: ["fikih"],
    artwork: "fikih",
  },
  {
    id: "iman_ahlak",
    title: "İman ve Ahlak",
    subtitle: "İnanç, güzel davranış ve sorumluluk",
    topics: ["akaid", "ahlak"],
    artwork: "ahlak",
  },
  {
    id: "tarih_medeniyet",
    title: "İslam Tarihi ve Medeniyeti",
    subtitle: "Tarihten bilime, sanattan şehirlere",
    topics: ["islam_tarihi", "medeniyet"],
    artwork: "medeniyet",
  },
] as const satisfies readonly {
  id: string;
  title: string;
  subtitle: string;
  topics: readonly LearningTopicId[];
  artwork: LearningTopicId;
}[];
export type BroadCategoryId = (typeof playCategories)[number]["id"];
export type PlayCategoryId = BroadCategoryId | "children";
export const childrenCategory = {
  id: "children",
  title: "Çocuklar İçin",
  subtitle: "8–12 yaş için planlanan kolay sorular",
  artwork: "children",
  available: false,
  status: "Hazırlanıyor",
  reason:
    "Kaynak ve yaş uygunluğu incelenmiş en az 100 bağımsız kolay soru henüz hazır değil. İnceleme tamamlanınca açılacak.",
} as const;
export function isPlayCategory(value: unknown): value is PlayCategoryId {
  return value === "children" || playCategories.some((c) => c.id === value);
}
export function categoryForTopic(topic: LearningTopicId): BroadCategoryId {
  return playCategories.find((c) =>
    (c.topics as readonly string[]).includes(topic),
  )!.id;
}
export function playCategoryName(id: PlayCategoryId) {
  return id === "children"
    ? childrenCategory.title
    : playCategories.find((c) => c.id === id)!.title;
}
export type PlayCategoryVersion = 1 | typeof PLAY_CATEGORY_VERSION;
export function belongsToPlayCategory(
  id: string,
  category: PlayCategoryId,
  version: PlayCategoryVersion = PLAY_CATEGORY_VERSION,
) {
  if (category === "children") return false; // No unreviewed candidate can become playable.
  const topic = (
    version === 1 ? reviewedTopicByQuestionIdV71 : reviewedTopicByQuestionIdV72
  )[id];
  return (
    !!topic &&
    (
      playCategories.find((c) => c.id === category)!.topics as readonly string[]
    ).includes(topic)
  );
}
export function categoryPool(
  pool: readonly Question[],
  category: PlayCategoryId,
) {
  return pool.filter(
    (q) =>
      q.reviewStatus === "approved" && belongsToPlayCategory(q.id, category),
  );
}

// Preserve legacy awards without counting an old topic and its parent twice.
export function visitedSubjectCount(games: readonly GameRecord[]) {
  const legacy = new Set(games.map((g) => g.learningTopic).filter(Boolean));
  const broad = new Set(
    games
      .map(
        (g) =>
          g.playCategory ??
          (g.learningTopic ? categoryForTopic(g.learningTopic) : undefined),
      )
      .filter(Boolean),
  );
  return Math.max(legacy.size, broad.size);
}
