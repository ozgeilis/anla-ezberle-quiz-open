/**
 * Eid al-Adha first ten-objective editorial review pilot.
 * Exactly 10 distinct concepts; zero production permissions.
 *
 * The first 2 IDs are 2026-10-21 seasonal drafts (v1); the remaining 8
 * live in kurban-eid-drafts-v2. Do not add either set to bank-v31, registry,
 * ContentChannel prototype, online export, or preparation category routes.
 */
export const kurbanBayramiEasyEditorialV2 = {
  id: "kurban-bayrami-kolay-review-v2",
  seasonId: "kurban_bayrami",
  level: "easy",
  status: "draft",
  published: false,
  intendedQuestionCount: 10,
  pedagogicalIndependence: "not-established",
  // Ten factual targets are not ten independent pedagogical domains.
  relatedObjectivePairs: [
    ["special-sacrifice-start-001", "special-sacrifice-length-001"],
    ["special-sacrifice-smallshare-002", "special-sacrifice-largeshare-002"],
    ["special-sacrifice-taqwa-002", "special-sacrifice-intention-002"],
  ],
  questionIds: [
    "special-sacrifice-start-001",
    "special-sacrifice-length-001",
    "special-sacrifice-animal-types-002",
    "special-sacrifice-smallshare-002",
    "special-sacrifice-largeshare-002",
    "special-sacrifice-taqwa-002",
    "special-sacrifice-sharing-002",
    "special-sacrifice-eid-prayer-002",
    "special-sacrifice-intention-002",
    "special-sacrifice-animal-welfare-002",
  ],
  learningObjectives: [
    "zilhicce-10-baslangic",
    "bayramin-dort-gunu",
    "kurbanlik-hayvan-turleri",
    "kucukbas-tek-kisilik",
    "buyukbas-en-cok-yedi-hisse",
    "hac-22-37-takva",
    "hac-22-36-ihtiyac-sahibi",
    "bayram-namazinin-iki-rekati",
    "kurbanin-ibadet-niyeti",
    "kurbanlik-hayvana-merhamet",
  ],
  openQuestions: [
    "Diyanet uygulamasındaki ortaklık sayısı farklı fıkıh mezhepleriyle özdeşleştirilmeden anlatılmalı.",
    "Kurban günlerinin süre/sıra bilgileri birbiriyle ilişkili, ama aynı olguyu iki kez sormadıkları insan editör tarafından doğrulanmalı.",
    "İbadet niyeti ve Hac 22/37 takvâ vurgusu yakın temalar olsa da biri kurbanın fıkhî şartını, diğeri ayetin mesajını ölçer.",
    "Hayvan refahı sorusunda olumsuz davranış örnekleri pedagojik ve yaşa uygunluk yönünden değerlendirilmeli.",
    "Bu doküman gerçek cihaz testi, uzman incelemesi veya yayın izni değildir.",
  ],
} as const;
