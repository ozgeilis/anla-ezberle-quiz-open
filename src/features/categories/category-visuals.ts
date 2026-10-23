import type { LearningTopicId } from "../../content/questions/learning-topics-v1";
import type { TopicArtworkId } from "../../components/game/TopicArtwork";

/** One visual catalogue for the existing editorial learning-topic IDs. */
export const topicVisuals: Record<
  LearningTopicId,
  { readonly colors: readonly [string, string, string] }
> = {
  quran: { colors: ["#089C84", "#087A7B", "#034D60"] },
  siyer: { colors: ["#249CB0", "#166F9A", "#25426F"] },
  peygamberler: { colors: ["#3284DD", "#325CAE", "#263F89"] },
  fikih: { colors: ["#C96F22", "#B04D22", "#873B33"] },
  akaid: { colors: ["#485CAC", "#403D86", "#272B66"] },
  ahlak: { colors: ["#D34E70", "#B63F72", "#863D79"] },
  islam_tarihi: { colors: ["#BF7A25", "#945421", "#6F3B31"] },
  sahabe: { colors: ["#8970CC", "#6757AF", "#42477F"] },
  dualar: { colors: ["#8B78C6", "#6966AC", "#464A88"] },
  medeniyet: { colors: ["#099E9E", "#137E92", "#155A79"] },
};

export type SeasonalCategory = {
  readonly id: Exclude<TopicArtworkId, LearningTopicId | "children">;
  readonly title: string;
  readonly subtitle: string;
  readonly colors: readonly [string, string, string];
};

/** Editorial previews only, not new playable banks or release approvals. */
export const specialTimes: readonly SeasonalCategory[] = [
  {
    id: "ramazan",
    title: "Ramazan",
    subtitle: "Oruç, ibadet ve paylaşma",
    colors: ["#214D99", "#283C7B", "#142C60"],
  },
  {
    id: "kadir_gecesi",
    title: "Kadir Gecesi",
    subtitle: "Kıymetli bir gece",
    colors: ["#4A5DA6", "#3A438B", "#292F65"],
  },
  {
    id: "ramazan_bayrami",
    title: "Ramazan Bayramı",
    subtitle: "Bayramın güzellikleri",
    colors: ["#D26962", "#B14A65", "#873F68"],
  },
  {
    id: "kurban_bayrami",
    title: "Kurban Bayramı",
    subtitle: "Dayanışma ve paylaşma",
    colors: ["#4E947D", "#347665", "#20574D"],
  },
  {
    id: "hac_mevsimi",
    title: "Hac Mevsimi",
    subtitle: "Kutsal yolculuk",
    colors: ["#B68142", "#925B3F", "#75443A"],
  },
  {
    id: "muharrem_asura",
    title: "Muharrem ve Aşure",
    subtitle: "Tarih ve gelenekler",
    colors: ["#A86C81", "#885978", "#614B78"],
  },
];
