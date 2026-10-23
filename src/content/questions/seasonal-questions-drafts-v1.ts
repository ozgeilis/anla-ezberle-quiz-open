import type { CategoryId, Difficulty, Question } from "./model";
import type { SeasonalReviewCategoryId } from "./seasonal-review-catalog-v1";

/**
 * New questions are ONLY editorial drafts: NEVER import into bank-v31,
 * playableQuestions, the registry, online exports or public routes.
 * Source URLs point to specific TDV / Diyanet entries checked for the claim.
 * Scholarly, pedagogical, distractor and physical-device review is still due.
 */
type Row = {
  id: string;
  version?: 2;
  season: SeasonalReviewCategoryId;
  category: CategoryId;
  level: Difficulty;
  prompt: string;
  correct: string;
  wrong: readonly [string, string, string];
  explanation: string;
  concept: string;
  title: string;
  publisher: "Diyanet İşleri Başkanlığı" | "TDV İslâm Araştırmaları Merkezi";
  url: string;
  locator: string;
  supports: string;
};

export const seasonalDraftRowsV1: readonly Row[] = [
  {
    id: "special-kadir-dawn-001",
    version: 2,
    season: "kadir_gecesi",
    category: "quran",
    level: "easy",
    prompt:
      "Kadr sûresinin 5. âyetine göre Kadir Gecesi'nin esenliği ne zamana kadar sürer?",
    correct: "Tan yeri ağarıncaya kadar",
    wrong: [
      "Gece yarısına kadar",
      "Öğle vaktine kadar",
      "Güneş batıncaya kadar",
    ],
    explanation:
      "Kadr sûresinin 5. âyetinde Kadir Gecesi'nin tan yeri ağarıncaya kadar esenlik dolu olduğu bildirilir. Bu cevap, sûrenin açık ifadesine dayanır.",
    concept: "kadir-97-5-esenlik-tanyeri",
    title: "Kadr sûresi 97/5 — Diyanet Kur'an Platformu",
    publisher: "Diyanet İşleri Başkanlığı",
    url: "https://kuran.diyanet.gov.tr/kuran?sure=97&ayet=5&mode=kuran-meal",
    locator: "Kadr 97/5",
    supports:
      "Sûrenin son âyetindeki esenliğin tan yeri ağarıncaya kadar süreceği bildirilir.",
  },
  {
    id: "special-ramadan-eid-first-001",
    season: "ramazan_bayrami",
    category: "general",
    level: "easy",
    prompt: "Ramazan Bayramı hicrî takvimde hangi ayın ilk günü başlar?",
    correct: "Şevval",
    wrong: ["Şâban", "Zilkade", "Muharrem"],
    explanation:
      "Ramazan Bayramı hicrî takvimde Ramazan'dan hemen sonra gelen Şevval ayının birinci günü başlar. Şevval, kamerî yılın onuncu ayıdır.",
    concept: "ramadan-eid-shawwal-day-one",
    title: "BAYRAM — İslâmî dönem",
    publisher: "TDV İslâm Araştırmaları Merkezi",
    url: "https://islamansiklopedisi.org.tr/bayram",
    locator: "C) İslâmî dönem, 1. Dinî Hükümler — Şevval'in ilk üç günü",
    supports: "Ramazan Bayramı, Şevval ayının ilk günü başlar.",
  },
  {
    id: "special-ramadan-eid-length-001",
    season: "ramazan_bayrami",
    category: "general",
    level: "easy",
    prompt: "Ramazan Bayramı kaç gün sürer?",
    correct: "Üç gün",
    wrong: ["İki gün", "Dört gün", "Beş gün"],
    explanation:
      "Ramazan Bayramı hicrî Şevval ayının ilk üç gününde kutlanır. Kurban Bayramı ise dört gün sürer; bu iki süreyi karıştırmamak gerekir.",
    concept: "ramadan-eid-three-days",
    title: "BAYRAM — İslâmî dönem",
    publisher: "TDV İslâm Araştırmaları Merkezi",
    url: "https://islamansiklopedisi.org.tr/bayram",
    locator: "C) İslâmî dönem, 1. Dinî Hükümler",
    supports: "Şevval ayının ilk üç günü bayram olarak kutlanır.",
  },
  {
    id: "special-sacrifice-start-001",
    season: "kurban_bayrami",
    category: "general",
    level: "easy",
    prompt: "Kurban Bayramı hicrî takvimde hangi gün başlar?",
    correct: "10 Zilhicce",
    wrong: ["8 Zilhicce", "9 Zilhicce", "11 Zilhicce"],
    explanation:
      "Kurban Bayramı zilhicce ayının onuncu günü başlar. Dokuzuncu gün arefedir ve hacıların Arafat'ta vakfe yaptığı gündür.",
    concept: "sacrifice-eid-zilhicce-ten",
    title: "ZİLHİCCE",
    publisher: "TDV İslâm Araştırmaları Merkezi",
    url: "https://islamansiklopedisi.org.tr/zilhicce",
    locator: "Zilhicce maddesi — Kurban bayramı 10. gün başlar",
    supports: "Kurban Bayramı zilhiccenin onuncu günü başlar.",
  },
  {
    id: "special-sacrifice-length-001",
    version: 2,
    season: "kurban_bayrami",
    category: "general",
    level: "easy",
    prompt: "Kurban Bayramı toplam kaç gün sürer?",
    correct: "Dört gün",
    wrong: ["İki gün", "Üç gün", "Altı gün"],
    explanation:
      "Kurban Bayramı zilhicce ayının onuncu gününde başlar ve dört gün sürer. Bayramın süresi ile kurban kesim süresi ayrı konulardır: Diyanet, kesimin Hanefîlerde üçüncü günün akşamına, Şâfiîlerde dördüncü günün gün batımına kadar yapılabildiğini açıklar.",
    concept: "sacrifice-eid-four-days",
    title: "ZİLHİCCE",
    publisher: "TDV İslâm Araştırmaları Merkezi",
    url: "https://islamansiklopedisi.org.tr/zilhicce",
    locator: "Kurban bayramının başlangıcı ve dört gün oluşu",
    supports: "Kurban Bayramı dört gün devam eder.",
  },
  {
    id: "special-hajj-arafat-date-001",
    season: "hac_mevsimi",
    category: "general",
    level: "medium",
    prompt:
      "Hacda Arafat vakfesinin yapıldığı arefe günü zilhiccenin kaçıncı günüdür?",
    correct: "Dokuzuncu",
    wrong: ["Sekizinci", "Onuncu", "On birinci"],
    explanation:
      "Arefe günü 9 Zilhicce'dir. Arafat'ta vakfe bu günde yapılır ve hac ibadetinin temel rükünlerinden biridir. Vakfenin ayrıntılı vakti fıkıh mezheplerinde ele alınır.",
    concept: "hajj-arafat-arefe-ninth",
    title: "AREFE",
    publisher: "TDV İslâm Araştırmaları Merkezi",
    url: "https://islamansiklopedisi.org.tr/arefe",
    locator: "Arefe maddesi — Zilhiccenin 9. günü, Arafat vakfesi",
    supports: "Arefe günü zilhicce ayının dokuzuncu günüdür.",
  },
  {
    id: "special-hajj-tarwiya-date-001",
    season: "hac_mevsimi",
    category: "general",
    level: "medium",
    prompt:
      "Hac hazırlıklarıyla ilişkili terviye günü zilhiccenin kaçıncı günüdür?",
    correct: "Sekizinci",
    wrong: ["Yedinci", "Dokuzuncu", "Onuncu"],
    explanation:
      "Terviye günü hicrî zilhicce ayının sekizinci günüdür. Arefe gününden bir gün önce gelir ve hac menâsikinin başlangıcıyla ilişkilidir.",
    concept: "hajj-tarwiya-eighth",
    title: "TERVİYE",
    publisher: "TDV İslâm Araştırmaları Merkezi",
    url: "https://islamansiklopedisi.org.tr/terviye",
    locator: "Tanım: zilhiccenin sekizinci günü",
    supports: "Terviye zilhicce ayının sekizinci günüdür.",
  },
  {
    id: "special-ashura-date-001",
    season: "muharrem_asura",
    category: "history",
    level: "easy",
    prompt: "Âşûrâ (Aşure) günü hicrî takvimde hangi tarihtir?",
    correct: "10 Muharrem",
    wrong: ["1 Muharrem", "9 Muharrem", "10 Şevval"],
    explanation:
      "Âşûrâ, hicrî yılın ilk ayı olan Muharrem'in onuncu gününe verilen addır. Bu tarih dinî ve tarihî bakımdan önemlidir; çeşitli gelenekler ise ayrı değerlendirilir.",
    concept: "ashura-muharram-ten",
    title: "ÂŞÛRÂ",
    publisher: "TDV İslâm Araştırmaları Merkezi",
    url: "https://islamansiklopedisi.org.tr/asura",
    locator: "Tanım: Muharrem'in onuncu günü",
    supports: "Âşûrâ muharremin onuncu günüdür.",
  },
  {
    id: "special-muharram-first-month-001",
    season: "muharrem_asura",
    category: "history",
    level: "easy",
    prompt: "Hicrî takvimin ilk ayı hangisidir?",
    correct: "Muharrem",
    wrong: ["Receb", "Ramazan", "Zilhicce"],
    explanation:
      "Muharrem hicrî yılın ilk ayıdır. Kamerî takvimde yer alan ve İslâm geleneğinde ayrıca önem verilen dört haram aydan biridir.",
    concept: "muharram-first-month",
    title: "MUHARREM",
    publisher: "TDV İslâm Araştırmaları Merkezi",
    url: "https://islamansiklopedisi.org.tr/muharrem--ay",
    locator: "Madde özeti: hicrî yılın ilk ayı ve dört haram aydan biri",
    supports: "Muharrem, hicrî yılın ilk ayıdır.",
  },
];

function makeDraft(row: Row): Question {
  return {
    id: row.id,
    version: row.version ?? 1,
    categoryId: row.category,
    difficulty: row.level,
    question: row.prompt,
    options: [
      { id: "o1", text: row.wrong[0] },
      { id: "o2", text: row.correct },
      { id: "o3", text: row.wrong[1] },
      { id: "o4", text: row.wrong[2] },
    ],
    correctOptionId: "o2",
    explanation: row.explanation,
    sources: [
      {
        title: row.title,
        publisher: row.publisher,
        url: row.url,
        locator: row.locator,
        supports: row.supports,
        checkStatus: "supported",
        checkedAt: "2026-10-21",
      },
      ...(row.id === "special-sacrifice-length-001"
        ? [
            {
              title: "Diyanet — Kurban kesim vakti ne zaman başlar ve biter?",
              publisher: "Diyanet İşleri Başkanlığı",
              url: "https://kurul.diyanet.gov.tr/tr/fetva/kurban-kesim-vakti-ne-zaman-baslar-ve-biter/0193c42d-7df6-7211-ea11-b432baabc6c9",
              locator:
                "Cevap; Hanefîlerde üçüncü gün akşamı, Şâfiîlerde dördüncü gün gün batımı",
              supports:
                "Bayramın dört günlük süresi ile mezheplere göre değişen kurban kesim süresi farklıdır.",
              checkStatus: "supported" as const,
              checkedAt: "2026-10-21",
            },
          ]
        : []),
    ],
    reviewStatus: "draft",
    reviewNotes:
      "21.10.2026: belirtilen TDV/Diyanet kaynağındaki ana iddia kontrol edildi. Bu kayıt editör/ilahiyat uzmanı onayı, seçeneklerin tamamının onayı veya yayın izni değildir.",
    updatedAt: "2026-10-21",
    conceptGroup: row.concept,
  };
}

export const seasonalQuestionsDraftsV1: readonly Question[] =
  seasonalDraftRowsV1.map(makeDraft);
