import { learningTopicsV1 } from "../../content/questions/learning-topics-v1";
export type BadgeIcon =
  | "flag"
  | "book-open"
  | "sun"
  | "moon"
  | "star"
  | "award"
  | "compass"
  | "users"
  | "zap"
  | "check-circle"
  | "target"
  | "heart"
  | "map"
  | "feather"
  | "shield";
export type BadgeGroup = "category" | "seasonal" | "general" | "social";
export type Metric =
  | "rounds"
  | "correct"
  | "perfect"
  | "daily"
  | "topics"
  | "friends"
  | "opponents"
  | "wins"
  | "liveRounds"
  | "liveWins"
  | "livePerfect"
  | "liveFriends";
export type Requirement = { metric: Metric; target: number };
export interface BadgeDefinition {
  id: string;
  title: string;
  group: BadgeGroup;
  subject?: string;
  tier?: "bronze" | "silver" | "gold" | "diamond";
  icon: BadgeIcon;
  color: string;
  requirements: readonly Requirement[];
  description: string;
}
const icons: BadgeIcon[] = [
  "book-open",
  "sun",
  "map",
  "compass",
  "shield",
  "heart",
  "flag",
  "users",
  "feather",
  "award",
];
const colors = [
  "#087C71",
  "#187D97",
  "#396FB0",
  "#A86324",
  "#5C59A5",
  "#BE526B",
  "#A16B29",
  "#7962B1",
  "#7564AD",
  "#128C91",
];
export const masteryTiers = [
  {
    id: "bronze",
    name: "Bronz",
    suffix: "İlk Keşif",
    requirements: [{ metric: "rounds", target: 1 }],
  },
  {
    id: "silver",
    name: "Gümüş",
    suffix: "İz Sürücü",
    requirements: [
      { metric: "rounds", target: 5 },
      { metric: "correct", target: 25 },
    ],
  },
  {
    id: "gold",
    name: "Altın",
    suffix: "Derin Keşif",
    requirements: [
      { metric: "rounds", target: 10 },
      { metric: "correct", target: 70 },
      { metric: "perfect", target: 1 },
    ],
  },
  {
    id: "diamond",
    name: "Elmas",
    suffix: "Koleksiyon Ustası",
    requirements: [
      { metric: "rounds", target: 20 },
      { metric: "correct", target: 150 },
      { metric: "perfect", target: 3 },
    ],
  },
] as const;
export const seasonalSubjects = [
  { id: "ramazan", title: "Ramazan", icon: "moon", color: "#315590" },
  { id: "kadir_gecesi", title: "Kadir Gecesi", icon: "star", color: "#6650A2" },
  {
    id: "ramazan_bayrami",
    title: "Ramazan Bayramı",
    icon: "heart",
    color: "#BF5A68",
  },
  {
    id: "kurban_bayrami",
    title: "Kurban Bayramı",
    icon: "users",
    color: "#25836C",
  },
  {
    id: "hac_mevsimi",
    title: "Hac Mevsimi",
    icon: "compass",
    color: "#A3742C",
  },
  {
    id: "muharrem_asura",
    title: "Muharrem ve Aşure",
    icon: "sun",
    color: "#946783",
  },
] as const;
const metricNames: Record<Metric, string> = {
  rounds: "farklı soru setli tur",
  correct: "doğru cevap",
  perfect: "kusursuz tur",
  daily: "farklı günlük yarışma",
  topics: "farklı öğrenme konusu",
  friends: "kabul edilmiş arkadaş",
  opponents: "farklı rakiple tamamlanmış düello",
  wins: "farklı rakibe karşı galibiyet",
  liveRounds: "tamamlanmış canlı yarışma",
  liveWins: "canlı yarışma zaferi",
  livePerfect: "kusursuz canlı tur",
  liveFriends: "farklı arkadaşla canlı yarışma",
};
export const describeRequirements = (rules: readonly Requirement[]) =>
  rules.map((r) => `${r.target} ${metricNames[r.metric]}`).join(" · ");
const make = (
  id: string,
  title: string,
  icon: BadgeIcon,
  color: string,
  requirements: readonly Requirement[],
  group: BadgeGroup,
): BadgeDefinition => ({
  id,
  title,
  icon,
  color,
  requirements,
  group,
  description: describeRequirements(requirements),
});
export const badgeCatalog: readonly BadgeDefinition[] = [
  ...learningTopicsV1.flatMap((topic, i) =>
    masteryTiers.map((tier) => ({
      ...make(
        `topic_${topic.id}_${tier.id}`,
        `${topic.title} · ${tier.suffix}`,
        icons[i]!,
        colors[i]!,
        tier.requirements,
        "category",
      ),
      subject: topic.id,
      tier: tier.id,
      description: `${topic.title}: ${describeRequirements(tier.requirements)}.`,
    })),
  ),
  ...seasonalSubjects.flatMap((topic) =>
    [
      { name: "İlk Sayfa", requirements: [{ metric: "rounds", target: 1 }] },
      {
        name: "Keşif Hatırası",
        requirements: [
          { metric: "rounds", target: 3 },
          { metric: "correct", target: 15 },
        ],
      },
      {
        name: "Tam İsabet",
        requirements: [
          { metric: "rounds", target: 5 },
          { metric: "correct", target: 35 },
          { metric: "perfect", target: 1 },
        ],
      },
    ].map((tier, i) => ({
      ...make(
        `season_${topic.id}_${i + 1}`,
        `${topic.title} · ${tier.name}`,
        topic.icon,
        topic.color,
        tier.requirements as Requirement[],
        "seasonal",
      ),
      subject: topic.id,
      tier: (["bronze", "silver", "gold"] as const)[i],
    })),
  ),
  {
    ...make(
      "first",
      "İlk adım",
      "flag",
      "#087D70",
      [{ metric: "rounds", target: 1 }],
      "general",
    ),
    description: "İlk yarışmanı tamamla.",
  },
  {
    ...make(
      "five",
      "Bilgi ışığı",
      "check-circle",
      "#AE7716",
      [{ metric: "correct", target: 5 }],
      "general",
    ),
    description: "Toplam 5 doğru cevaba ulaş.",
  },
  {
    ...make(
      "perfect",
      "Kusursuz tur",
      "star",
      "#B57916",
      [{ metric: "perfect", target: 1 }],
      "general",
    ),
    description: "Bir yarışmada 10 soruyu da doğru yanıtla.",
  },
  {
    ...make(
      "explorer",
      "Meraklı kâşif",
      "compass",
      "#B5576E",
      [{ metric: "topics", target: 4 }],
      "general",
    ),
    description: "4 farklı öğrenme konusunda tur tamamla.",
  },
  make(
    "rounds_10",
    "On Durak",
    "flag",
    "#0A8D7D",
    [{ metric: "rounds", target: 10 }],
    "general",
  ),
  make(
    "rounds_50",
    "Uzun Yolculuk",
    "map",
    "#427E9B",
    [{ metric: "rounds", target: 50 }],
    "general",
  ),
  make(
    "correct_100",
    "Yüz Doğru",
    "check-circle",
    "#8A6B32",
    [{ metric: "correct", target: 100 }],
    "general",
  ),
  make(
    "correct_500",
    "Beş Yüz Keşif",
    "award",
    "#5E699A",
    [{ metric: "correct", target: 500 }],
    "general",
  ),
  make(
    "daily_1",
    "Bugünün Keşfi",
    "sun",
    "#AA7D18",
    [{ metric: "daily", target: 1 }],
    "general",
  ),
  make(
    "daily_7",
    "Yedi Günlük Albüm",
    "sun",
    "#B3702D",
    [{ metric: "daily", target: 7 }],
    "general",
  ),
  make(
    "topics_5",
    "Beş Kapı",
    "book-open",
    "#287F83",
    [{ metric: "topics", target: 5 }],
    "general",
  ),
  make(
    "topics_10",
    "Bütün Konular",
    "compass",
    "#7062A2",
    [{ metric: "topics", target: 10 }],
    "general",
  ),
  make(
    "friend_first",
    "İlk Arkadaş",
    "users",
    "#168978",
    [{ metric: "friends", target: 1 }],
    "social",
  ),
  make(
    "friend_five",
    "Keşif Çemberi",
    "users",
    "#4486A0",
    [{ metric: "friends", target: 5 }],
    "social",
  ),
  make(
    "duel_first",
    "Düelloya Merhaba",
    "zap",
    "#B57822",
    [{ metric: "opponents", target: 1 }],
    "social",
  ),
  make(
    "duel_five",
    "Beş Rakip",
    "target",
    "#466CB0",
    [{ metric: "opponents", target: 5 }],
    "social",
  ),
  make(
    "duel_win",
    "İlk Galibiyet",
    "flag",
    "#AF586F",
    [{ metric: "wins", target: 1 }],
    "social",
  ),
  {
    ...make(
      "duel_perfect",
      "Düelloda Tam İsabet",
      "star",
      "#7860AF",
      [{ metric: "perfect", target: 1 }],
      "social",
    ),
    description: "İki tarafı tamamlanmış gerçek düelloda 10/10 doğru yap.",
  },
  make(
    "live_first",
    "İlk Canlı Yarışma",
    "zap",
    "#0AA8A7",
    [{ metric: "liveRounds", target: 1 }],
    "social",
  ),
  make(
    "live_win",
    "İlk Canlı Zafer",
    "flag",
    "#E5A51D",
    [{ metric: "liveWins", target: 1 }],
    "social",
  ),
  make(
    "live_wins5",
    "Bilgi Şampiyonu",
    "award",
    "#E5A51D",
    [{ metric: "liveWins", target: 5 }],
    "social",
  ),
  make(
    "live_wins20",
    "Ustalar Arenası",
    "shield",
    "#1683E8",
    [{ metric: "liveWins", target: 20 }],
    "social",
  ),
  make(
    "live_perfect",
    "Canlı Yarışmada Tam İsabet",
    "star",
    "#078C68",
    [{ metric: "livePerfect", target: 1 }],
    "social",
  ),
  {
    ...make(
      "live_friends",
      "Dostlarla Bilgi",
      "users",
      "#FF6471",
      [{ metric: "liveFriends", target: 3 }],
      "social",
    ),
    description: "Üç farklı arkadaşınla ödüle uygun canlı yarışmalar tamamla.",
  },
];
