import type { Question } from "./model";
import { bankV14 } from "./archive/bank-v14";
import { learningDraftQuestions } from "./learning-drafts-v1";
import { learningMoreDraftQuestionsV2 } from "./learning-more-drafts-v2";
import { learningVerseDraftQuestionsV2 } from "./learning-verse-drafts-v2";
import { learningHistoryDraftQuestionsV2 } from "./learning-history-drafts-v2";

/**
 * Editorial source-reading queue; NOT an app/bank/online export.
 * Directly compared 31 questions against the cited TDV entry or Diyanet
 * verse on 2026-10-20. This is evidence-level review, not a claim of
 * independent religious-scholar approval or publication authorisation.
 *
 * IMPORTANT: Reviewed questions remain OUTSIDE bankV14, BANK_VERSION
 * and the online answer key. A future append-only v15 still needs explicit
 * owner acceptance, peer editorial review, semantic similarity QA and CI.
 */
export const reviewSourceCheckedV3: readonly (readonly [string, string])[] = [
  [
    "learn-women-002",
    "Hz. Âişe ile baba bir kardeşlik"
  ],
  [
    "learn-women-003",
    "Hadis ve fıkıh öğretimi"
  ],
  [
    "learn-women-004",
    "Uhud'da Resûlullah'ı koruması"
  ],
  [
    "learn-women-005",
    "Enes b. Mâlik'in annesi"
  ],
  [
    "learn-women-006",
    "İlk kadın şehit olarak anılması"
  ],
  [
    "learn-women-008",
    "Ca‘fer'le Habeşistan'a hicret"
  ],
  [
    "learn-women-010",
    "Ümmü Seleme'nin kızı ve hadis rivayeti"
  ],
  [
    "learn-women-011",
    "Hz. Ömer'in kızı olması"
  ],
  [
    "learn-women-012",
    "Mushaf nüshasının Hafsa'da korunması"
  ],
  [
    "learn-women-013",
    "Hz. Hatice'nin ardından evliliği"
  ],
  [
    "learn-women-014",
    "Habeşistan hicreti"
  ],
  [
    "learn-women-017",
    "Hala Sultan lakabıyla tanınması"
  ],
  [
    "learn-women-018",
    "Ümmü Süleym'le kardeşliği"
  ],
  [
    "learn-women-020",
    "Annesi Ümeyme bint Abdülmuttalib"
  ],
  [
    "learn-women-021",
    "Hz. Osman'la evlenmesi"
  ],
  [
    "learn-women-022",
    "Hz. Osman'la Habeşistan'a hicret"
  ],
  [
    "learn-women-023",
    "Rukıyye sonrasında Hz. Osman'la evlilik"
  ],
  [
    "learn-women-029",
    "Hudeybiye'den sonra tek başına hicret"
  ],
  [
    "learn-women-030",
    "Hafsa'ya okuma yazma öğretmesi"
  ],
  [
    "learn-dua-022",
    "İsrâ sûresi 17/24: ana baba için rahmet dileği"
  ],
  [
    "learn-dua-025",
    "Tâhâ sûresi 20/114: ilmin artması dileği"
  ],
  [
    "learn-history-001",
    "Kerbelâ olayının I. Yezîd'in hilâfeti sırasında olması"
  ],
  [
    "learn-history-002",
    "10 Muharrem 61 tarihinde Kerbelâ olayı"
  ],
  [
    "learn-history-003",
    "Alparslan'ın 1071 Malazgirt kumandanlığı"
  ],
  [
    "learn-history-004",
    "Malazgirt muharebesinin Bizans ile yapılması"
  ],
  [
    "learn-history-005",
    "Kutadgu Bilig'in Yûsuf Has Hâcib'e ait olması"
  ],
  [
    "learn-history-006",
    "Dîvânü Lugāti't-Türk'ün Kâşgarlı Mahmud'a ait olması"
  ],
  [
    "learn-history-007",
    "Selâhaddin'in 1187'de Kudüs'ü fethetmesi"
  ],
  [
    "learn-history-008",
    "Hıttîn Savaşı'nın 1187'de yapılması"
  ],
  [
    "learn-history-009",
    "Eyyûbî hânedanının kurucusunun Selâhaddin olması"
  ],
  [
    "learn-history-010",
    "Nasrîler'in Gırnata merkezli hânedan olması"
  ]
];
export const reviewExcludedV3: readonly (readonly [string, string])[] = [
  [
    "learn-women-001",
    "Mevcut 500 sorudaki e150-history-016 ile aynı ilk vahiy / Hz. Hatice bilgisini ölçüyor; bu sürümde yeni soru sayılmaz."
  ],
  [
    "learn-women-009",
    "Fâtıma bint Kays'ın nafaka/iddet rivayetinde mezhepler arası değerlendirme var; seçeneğin ve açıklamanın uzman kontrolü gerekiyor."
  ],
  [
    "learn-women-015",
    "Gösterilen TDV bağlantısı bu taramada kaynak metni olarak doğrulanamadı."
  ],
  [
    "learn-women-016",
    "Gösterilen TDV bağlantısı bu taramada kaynak metni olarak doğrulanamadı."
  ],
  [
    "learn-women-027",
    "Meymûne kaynak bağlantısı ve isim rivayetleri yeniden karşılaştırılmalı."
  ],
  [
    "learn-women-028",
    "Meymûne kaynak bağlantısı ve isim rivayetleri yeniden karşılaştırılmalı."
  ]
];
export const reviewConceptGroupV3: Readonly<Record<string,string>> = {
  "learn-women-011": "kadın-sahabe-hafsa",
  "learn-women-012": "kadın-sahabe-hafsa",
  "learn-women-013": "kadın-sahabe-sevde",
  "learn-women-014": "kadın-sahabe-sevde",
  "learn-women-017": "kadın-sahabe-ummu-haram",
  "learn-women-018": "kadın-sahabe-ummu-haram",
  "learn-women-021": "kadın-sahabe-rukiyye",
  "learn-women-022": "kadın-sahabe-rukiyye",
  "learn-women-023": "kadın-sahabe-ummu-kulsum",
  "learn-history-001": "hist-kerbela",
  "learn-history-002": "hist-kerbela",
  "learn-history-003": "hist-malazgirt",
  "learn-history-004": "hist-malazgirt",
  "learn-history-007": "hist-selahaddin-1187",
  "learn-history-008": "hist-selahaddin-1187",
  "learn-history-009": "hist-selahaddin-1187"
};
export const allResearchDraftsV3: readonly Question[] = [
  ...learningDraftQuestions,
  ...learningMoreDraftQuestionsV2,
  ...learningVerseDraftQuestionsV2,
  ...learningHistoryDraftQuestionsV2,
];
const sourceById = new Map(allResearchDraftsV3.map(q => [q.id,q]));
const sourceCheckedIds = new Set(reviewSourceCheckedV3.map(([id]) => id));
const excludedIds = new Set(reviewExcludedV3.map(([id]) => id));
if (allResearchDraftsV3.length !== 100 || sourceById.size !== 100)
  throw new Error("Beklenen 100 benzersiz soru taslağı yok.");
if ([...sourceCheckedIds].some(id => excludedIds.has(id)))
  throw new Error("İncelenen soru aynı anda kabul ve ret listesinde.");
if ([...sourceCheckedIds,...excludedIds].some(id => !sourceById.has(id)))
  throw new Error("Bilinmeyen soru ID'si.");
if (allResearchDraftsV3.some(q => bankV14.some(old => old.id === q.id)))
  throw new Error("Yeni taslak ile v14 soru kimliği çakışıyor.");

/** Staged review only — deliberately not imported by playableQuestions. */
export const sourceCheckedCandidateQuestionsV3: readonly Question[] =
  reviewSourceCheckedV3.map(([id, evidence]) => {
    const original = sourceById.get(id)!;
    return {
      ...original,
      // Means this content has had a source-level internal editorial pass.
      // It MUST NOT be construed as expert religious or owner approval.
      reviewStatus: "reviewed",
      reviewNotes: original.reviewNotes +
        " | 20.10.2026: " + evidence +
        " doğrudan gösterilen TDV/Diyanet kaynak metniyle karşılaştırıldı." +
        " Benzer bilgi, yaş uygunluğu, bağımsız dinî içerik editörü ve ürün sahibinin nihai yayım onayı henüz yoktur.",
      sources: original.sources.map(s => ({
        ...s,
        checkStatus: "supported",
        checkedAt: "2026-10-20",
        // Diyanet verse-only codes become legible when shown under a question.
        locator: s.locator.length > 5 ? s.locator : evidence,
      })),
      // Prevent a single 10-question match asking two facts about
      // the same woman repeatedly; does not alter any historical bank.
      conceptGroup: reviewConceptGroupV3[id] ?? original.conceptGroup,
    };
  });

export function reviewStageForIdV3(id: string):
  "source_checked_pending_approval" | "excluded_for_rework" | "source_check_pending" {
  if (sourceCheckedIds.has(id)) return "source_checked_pending_approval";
  if (excludedIds.has(id)) return "excluded_for_rework";
  return "source_check_pending";
}
