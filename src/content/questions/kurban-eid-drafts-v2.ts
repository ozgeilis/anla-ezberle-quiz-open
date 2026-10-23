import type { Question } from "./model";

/**
 * Eight NEW, unpublished Eid al-Adha editorial candidates.
 * Two separate earlier date/duration drafts plus these eight make a
 * ten-objective review pilot. These are NEVER imported into bank-v31 or any
 * game registry; source-checking does not amount to specialist approval.
 */
type Row = {
  id: string;
  question: string;
  answer: string;
  wrong: readonly [string, string, string];
  explanation: string;
  conceptGroup: string;
  sourceName: string;
  sourcePublisher: string;
  sourceURL: string;
  sourceLocator: string;
  sourceSupports: string;
};

const tdvKurban = "https://islamansiklopedisi.org.tr/kurban";
const diyanetKurban =
  "https://kurul.diyanet.gov.tr/tr/duyuru/kurban-ibadetiyle-ilgili/019daaad-c113-739f-93ef-221ef6f09341";
const diyanetHac37 =
  "https://kuran.diyanet.gov.tr/kuran?sure=22&ayet=37&mode=kuran-meal";
const diyanetHac36 =
  "https://kuran.diyanet.gov.tr/kuran?sure=22&ayet=36&mode=kuran-meal";

const rows: readonly Row[] = [
  {
    id: "special-sacrifice-animal-types-002",
    question:
      "Diyanet Din İşleri Yüksek Kurulu'nun açıklamasına göre aşağıdakilerden hangisi kurbanlık kabul edilen türlerdendir?",
    answer: "Koyun",
    wrong: ["Tavuk", "Tavşan", "Ceylan"],
    explanation:
      "Koyun; keçi, sığır, manda ve deve gibi kurbanlık kabul edilen evcil hayvanlar arasındadır. Tavuk, tavşan ve ceylan ise bu ibadet için uygun hayvan türleri değildir.",
    conceptGroup: "eid-adhā-eligible-animals",
    sourceName: "Diyanet — Kurbanlık Hayvanın Nitelikleri",
    sourcePublisher: "Diyanet İşleri Başkanlığı",
    sourceURL: diyanetKurban,
    sourceLocator: "Kurbanlık Hayvanın Nitelikleri, madde 1",
    sourceSupports:
      "Kurban olarak ancak koyun, keçi, sığır, manda ve deve kesilebilir.",
  },
  {
    id: "special-sacrifice-smallshare-002",
    question:
      "Diyanet'in açıkladığı kurban uygulamasına göre bir koyun veya keçi kaç kişi adına kurban edilebilir?",
    answer: "Bir kişi",
    wrong: ["İki kişi", "Beş kişi", "Yedi kişi"],
    explanation:
      "Diyanet'in kurbanla ilgili açıklamasına göre koyun ve keçi bir kişi adına kurban edilir. Bu, kurbanda kişi adına hisseyle ilgilidir; aile fertlerini sevaba katma niyetiyle aynı şey değildir. TDV, aile fertlerini sevaba katmaya ilişkin mezhep görüşlerini ayrıca açıklar.",
    conceptGroup: "eid-adhā-small-animal-participation",
    sourceName: "Diyanet — Kurbanlık Hayvanın Nitelikleri",
    sourcePublisher: "Diyanet İşleri Başkanlığı",
    sourceURL: diyanetKurban,
    sourceLocator: "Kurbanlık Hayvanın Nitelikleri, madde 3",
    sourceSupports: "Koyun veya keçi sadece bir kişi adına kurban edilir.",
  },
  {
    id: "special-sacrifice-largeshare-002",
    question:
      "Diyanet'in kurban uygulamasına göre bir sığıra en fazla kaç kişi ortak olabilir?",
    answer: "Yedi kişi",
    wrong: ["Üç kişi", "Beş kişi", "Dokuz kişi"],
    explanation:
      "Diyanet'in açıkladığı kurala göre sığır, manda ve devede en fazla yedi kişi ortaklaşabilir; her ortağın hissesi en az yedide bir olmalıdır. Bu kural bütün mezheplerin ortak görüşü değildir: TDV, Mâlikî mezhebinde ortak kurban kesiminin câiz görülmediğini belirtir.",
    conceptGroup: "eid-adhā-large-animal-seven",
    sourceName: "Diyanet — Kurbanlık Hayvanın Nitelikleri",
    sourcePublisher: "Diyanet İşleri Başkanlığı",
    sourceURL: diyanetKurban,
    sourceLocator: "Kurbanlık Hayvanın Nitelikleri, madde 3; ortak hisseleri",
    sourceSupports:
      "Deve, sığır ve manda birden yedi kişiye kadar ortaklaşa kurban edilebilir.",
  },
  {
    id: "special-sacrifice-taqwa-002",
    question:
      "Hac sûresi 22/37'ye göre Allah'a ulaşan, kurbanların eti ve kanı değil, nedir?",
    answer: "Takvâ (Allah'a karşı sorumluluk bilinci)",
    wrong: [
      "Etin dağıtılan miktarı",
      "Kurbanlığın maddî değeri",
      "Kesilen hayvanların sayısı",
    ],
    explanation:
      "Hac sûresinin 37. âyetinde Allah'a ulaşanın kurbanın eti veya kanı değil, insanların takvâsı olduğu belirtilir. Takvâyı Allah'a karşı sorumluluk bilinciyle açıklamak, kelimenin anlamını açan yorumdur; âyetteki kavram takvâdır.",
    conceptGroup: "eid-adhā-hajj-22-37-taqwa",
    sourceName: "Diyanet Kur'an Platformu — Hac 22/37",
    sourcePublisher: "Diyanet İşleri Başkanlığı",
    sourceURL: diyanetHac37,
    sourceLocator: "Hac 22/37; ayet seçicisi: 37. Ayet; Diyanet Vakfı meali",
    sourceSupports:
      "Onların ne etleri ne de kanları Allah'a ulaşır; O'na ulaşan sizin takvânızdır.",
  },
  {
    id: "special-sacrifice-sharing-002",
    question:
      "Hac sûresi 22/36'da kurban etinden yararlandırılması özellikle anılan kişiler kimlerdir?",
    answer: "İhtiyaç sahipleri",
    wrong: [
      "Yalnızca tüccarlar",
      "Sadece hayvan sahipleri",
      "Yalnızca yöneticiler",
    ],
    explanation:
      "Hac sûresi 36. âyette kurban etinden yemekten ve ihtiyaç sahiplerine yedirmekten söz edilir. Paylaşma, kurbanla ilişkilendirilen sosyal sorumluluklardan biridir; etin tamamının belirli sayıda kişiye verilmesi şart değildir.",
    conceptGroup: "eid-adhā-hajj-22-36-sharing",
    sourceName: "Diyanet Kur'an Platformu — Hac 22/36",
    sourcePublisher: "Diyanet İşleri Başkanlığı",
    sourceURL: diyanetHac36,
    sourceLocator: "Hac 22/36; ayet seçicisi: 36. Ayet; Diyanet Vakfı meali",
    sourceSupports:
      "Kurban etinden hem kendiniz yiyin hem de yoksulları doyurun ifadesi yer alır.",
  },
  {
    id: "special-sacrifice-eid-prayer-002",
    question: "Ramazan ve Kurban Bayramı namazları kaç rekâttır?",
    answer: "İki rekât",
    wrong: ["Bir rekât", "Üç rekât", "Dört rekât"],
    explanation:
      "İki dinî bayramda kılınan bayram namazı iki rekâttır. İlâve tekbirlerin sayısında ve namazın dinî hükmünde mezhepler arasında farklı görüşler bulunabilir; rekât sayısı ikidir.",
    conceptGroup: "eid-adhā-eid-prayer-two-rakah",
    sourceName: "TDV İslâm Ansiklopedisi — BAYRAM",
    sourcePublisher: "TDV İslâm Araştırmaları Merkezi",
    sourceURL: "https://islamansiklopedisi.org.tr/bayram",
    sourceLocator: "İslâmî dönem, dinî hükümler, bayram namazı",
    sourceSupports: "Ezan ve kametsiz kılınan bayram namazı iki rekâttır.",
  },
  {
    id: "special-sacrifice-intention-002",
    question:
      "TDV İslâm Ansiklopedisi'ne göre kurbanı sıradan et kesiminden ayıran esas unsur hangisidir?",
    answer: "İbadet niyeti",
    wrong: [
      "Yalnızca et elde etme isteği",
      "Yöresel geleneği sürdürme düşüncesi",
      "Ticari kazanç sağlama amacı",
    ],
    explanation:
      "Kurban, belli şartlarla Allah'a yakınlık amacı taşıyan bir ibadettir. Kesimde ibadet niyeti belirleyicidir; yalnızca et elde etmeyi amaçlamak ile ibadet kastı aynı değildir.",
    conceptGroup: "eid-adhā-intention-ibadet",
    sourceName: "TDV İslâm Ansiklopedisi — KURBAN",
    sourcePublisher: "TDV İslâm Araştırmaları Merkezi",
    sourceURL: tdvKurban + "#2",
    sourceLocator: "İslâm'da Kurban, Geçerlilik Şartları, madde 6",
    sourceSupports:
      "Kurbanın ibadet niyetiyle kesilmesi şarttır; kurbanı diğer hayvan kesimlerinden ayıran budur.",
  },
  {
    id: "special-sacrifice-animal-welfare-002",
    question:
      "TDV'nin kurbanla ilgili açıklamasına göre hayvana yaklaşımda hangi ilke gözetilmelidir?",
    answer: "Hayvanın incitilmemesini gözetmek",
    wrong: [
      "Yalnızca hayvanın fiyatını esas almak",
      "Sadece hayvanın rengine önem vermek",
      "Hayvanın rahatından önce taşıma hızını düşünmek",
    ],
    explanation:
      "Kurban ibadetinde hayvanlara eziyet edilmemesi esastır. TDV, hayvanın incitilmeden götürülmesini, bıçağın hayvana gösterilmemesini ve keskin bıçak kullanılmasını belirtir. Uygulama ehil kişilerce yapılmalıdır.",
    conceptGroup: "eid-adhā-animal-welfare",
    sourceName: "TDV İslâm Ansiklopedisi — KURBAN",
    sourcePublisher: "TDV İslâm Araştırmaları Merkezi",
    sourceURL: tdvKurban + "#2",
    sourceLocator:
      "İslâm'da Kurban, Kurbanlık Hayvanın Kesimi ve Diğer İşlemler",
    sourceSupports:
      "Hayvana eziyetten kaçınılmalı, bıçak gösterilmemeli ve keskin bıçak kullanılmalıdır.",
  },
];

export const kurbanBayramiNewDraftsV2: readonly Question[] = rows.map((row) => {
  const options: Question["options"] = [
    { id: "o1", text: row.wrong[0] },
    { id: "o2", text: row.answer },
    { id: "o3", text: row.wrong[1] },
    { id: "o4", text: row.wrong[2] },
  ];
  return {
    id: row.id,
    version: 2,
    categoryId: row.sourceURL.startsWith("https://kuran.diyanet.gov.tr/")
      ? "quran"
      : "general",
    difficulty: "easy",
    question: row.question,
    options,
    correctOptionId: "o2",
    explanation: row.explanation,
    sources: [
      {
        title: row.sourceName,
        publisher: row.sourcePublisher,
        url: row.sourceURL,
        locator: row.sourceLocator,
        supports: row.sourceSupports,
        checkStatus: "supported",
        checkedAt: "2026-10-21",
      },
      ...([
        "special-sacrifice-animal-types-002",
        "special-sacrifice-smallshare-002",
        "special-sacrifice-largeshare-002",
      ].includes(row.id)
        ? [
            {
              title: "TDV İslâm Ansiklopedisi — KURBAN",
              publisher: "TDV İslâm Araştırmaları Merkezi",
              url: tdvKurban + "#2",
              locator:
                "İslâm’da Kurban > Geçerlilik Şartları, 1. madde; ortaklık ve aile fertlerini sevaba katma ayrımı",
              supports:
                "Hayvan türleri ve ortaklık hükümleri açıklanır; Mâlikî görüşü ve yakınları sevaba katma, hisse ortaklığından ayrılır.",
              checkStatus: "supported" as const,
              checkedAt: "2026-10-21",
            },
          ]
        : []),
    ],
    reviewStatus: "draft",
    reviewNotes:
      "21.10.2026: Ana iddia Diyanet veya TDV kaynağıyla karşılaştırıldı. 21.10.2026 kaynak denetiminde bağlantı, bağlam ve seçenekler yeniden değerlendirildi; ayrıntılı kanıt ve açık kalan noktalar docs/RELIGIOUS-SOURCE-AUDIT-20261021.md içindedir. Bu, bağımsız uzman/çocuk uygunluğu onayı, kişisel fetva veya yayın izni değildir.",
    conceptGroup: row.conceptGroup,
    updatedAt: "2026-10-21",
  };
});
