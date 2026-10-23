import type { Question } from "./model";

/**
 * Research-backed QUESTION DRAFTS for missing topic coverage (2026-10-20).
 * Independent religious/content editorial acceptance is not complete.
 * Not imported by bankV14 or any playableQuestions/online export path.
 * Do NOT expose as production content or upload to Frankfurt without a new,
 * explicitly authorised, append-only content version and tests.
 */
export type LearningDraftTopic = "sahaba" | "dualar";
type Row = readonly [
  id: string, topic: LearningDraftTopic, categoryId: "history" | "general",
  prompt: string, correct: string, wrong: readonly [string,string,string],
  sourceUrl: string, locator: string, explanation: string,
  conceptGroup: string, difficulty: "easy" | "medium" | "hard"
];
const rows: readonly Row[] = [
  [
    "learn-women-001",
    "sahaba",
    "history",
    "Hz. Peygamber'e ilk vahyin ardından destek ve teselli veren eşi kimdir?",
    "Hatice bint Huveylid",
    [
      "Ümmü Süleym",
      "Esmâ bint Yezîd",
      "Fâtıma bint Kays"
    ],
    "https://islamansiklopedisi.org.tr/hatice",
    "Peygamberliğin başlangıcında Hz. Hatice'nin desteği",
    "Hz. Hatice ilk vahiyden sonra Hz. Peygamber'i teselli etmiş, ona inanıp destek olmuş ve Varaka b. Nevfel'le görüşmesine yardımcı olmuştur.",
    "women-khadija",
    "easy"
  ],
  [
    "learn-women-002",
    "sahaba",
    "history",
    "Hz. Ebû Bekir'in kızı ve Hz. Âişe'nin baba bir ablası olan kadın sahâbî kimdir?",
    "Esmâ bint Ebû Bekir",
    [
      "Esmâ bint Umeys",
      "Ümmü Seleme",
      "Ümmü Umâre"
    ],
    "https://islamansiklopedisi.org.tr/esma-bint-ebu-bekir",
    "Giriş: aile bağları ve Hz. Âişe ile kardeşliği",
    "Esmâ bint Ebû Bekir, Hz. Ebû Bekir'in kızıdır. Hz. Âişe ile baba bir kardeştir; hicret hazırlıklarındaki yardımıyla da tanınır.",
    "women-esma-abu-bakr",
    "medium"
  ],
  [
    "learn-women-003",
    "sahaba",
    "history",
    "Hadis ve fıkıh öğretimiyle tanınan, çok sayıda öğrencinin kendisinden ders aldığı müminlerin annesi kimdir?",
    "Hz. Âişe",
    [
      "Ümmü Harâm",
      "Esmâ bint Umeys",
      "Sümeyye bint Hubbât"
    ],
    "https://islamansiklopedisi.org.tr/aise",
    "Medine'deki hadis ve fıkıh öğretimi ve kadın öğrencileri",
    "Hz. Âişe Medine'de hadis ve fıkıh alanlarında öğretim yapmış; hem sözlü hem mektupla gelen soruları cevaplamıştır.",
    "women-aisha",
    "medium"
  ],
  [
    "learn-women-004",
    "sahaba",
    "history",
    "Uhud Gazvesi'nde Hz. Peygamber'i korumasıyla tanınan kadın sahâbî kimdir?",
    "Ümmü Umâre (Nesîbe bint Kâ‘b)",
    [
      "Ümmü Süleym",
      "Fâtıma bint Kays",
      "Zeyneb bint Ebû Seleme"
    ],
    "https://islamansiklopedisi.org.tr/ummu-umare",
    "Uhud Savaşı ve Hz. Peygamber'i koruması",
    "Nesîbe bint Kâ‘b, Ümmü Umâre künyesiyle tanınır. Uhud'da Hz. Peygamber'i koruyan az sayıdaki sahâbîden biridir.",
    "women-ummu-umara",
    "medium"
  ],
  [
    "learn-women-005",
    "sahaba",
    "history",
    "Sahâbî Enes b. Mâlik'in annesi olan kadın sahâbî kimdir?",
    "Ümmü Süleym",
    [
      "Ümmü Seleme",
      "Hz. Hafsa",
      "Ümmü Umâre"
    ],
    "https://islamansiklopedisi.org.tr/ummu-suleym",
    "Hayatı: Enes b. Mâlik'in annesi olması ve hicret sonrası yaşamı",
    "Ümmü Süleym, Enes b. Mâlik'in annesidir. Medine'de oğlu Enes'i Hz. Peygamber'in hizmetine sunmuştur.",
    "women-ummu-sulaym",
    "easy"
  ],
  [
    "learn-women-006",
    "sahaba",
    "history",
    "İslâm'ın ilk kadın şehidi olarak anılan sahâbî kimdir?",
    "Sümeyye bint Hubbât",
    [
      "Esmâ bint Yezîd",
      "Ümmü Seleme",
      "Fâtıma bint Kays"
    ],
    "https://islamansiklopedisi.org.tr/sumeyye-bint-hubbat",
    "İlk Müslümanlar dönemi, şehid edilmesi",
    "Sümeyye bint Hubbât, Mekke'deki ilk Müslümanlardan olup İslâm tarihinde ilk kadın şehit olarak anılır.",
    "women-sumayya",
    "easy"
  ],
  [
    "learn-women-007",
    "sahaba",
    "history",
    "Hz. Peygamber'in hanımları arasında Hz. Âişe'den sonra en çok hadis rivayet eden kişi kimdir?",
    "Ümmü Seleme",
    [
      "Esmâ bint Ebû Bekir",
      "Ümmü Süleym",
      "Sümeyye bint Hubbât"
    ],
    "https://islamansiklopedisi.org.tr/ummu-seleme",
    "İlmî kişiliği: hadis rivayetleri ve fıkhî sorulara cevap vermesi",
    "Ümmü Seleme, Hz. Âişe'den sonra Hz. Peygamber'in eşleri içinde en çok hadis rivayet eden kadın sahâbî olarak tanınır.",
    "women-ummu-salama",
    "hard"
  ],
  [
    "learn-women-008",
    "sahaba",
    "history",
    "İlk eşi Ca‘fer b. Ebû Tâlib ile Habeşistan'a hicret eden kadın sahâbî kimdir?",
    "Esmâ bint Umeys",
    [
      "Esmâ bint Yezîd",
      "Sümeyye bint Hubbât",
      "Fâtıma bint Kays"
    ],
    "https://islamansiklopedisi.org.tr/esma-bint-umeys",
    "İlk eşi Ca‘fer ile Habeşistan hicreti",
    "Esmâ bint Umeys, Ca‘fer b. Ebû Tâlib'le evlenmiş ve onunla Habeşistan'a hicret etmiştir. Sonrasında Medine'ye dönmüştür.",
    "women-esma-umays",
    "medium"
  ],
  [
    "learn-women-009",
    "sahaba",
    "history",
    "Boşanma sonrası bekleme süresi ve nafaka konusundaki hadisleriyle tanınan kadın sahâbî kimdir?",
    "Fâtıma bint Kays",
    [
      "Zeyneb bint Ebû Seleme",
      "Esmâ bint Ebû Bekir",
      "Ümmü Umâre"
    ],
    "https://islamansiklopedisi.org.tr/fatima-bint-kays",
    "Boşanma, iddet, nafaka ve hadis rivayetleri",
    "Fâtıma bint Kays'ın boşanma ve iddetle ilgili yaşadıkları hadis kaynaklarında rivayet edilmiştir. Bu konuların fıkhî yorumları ayrı değerlendirilir.",
    "women-fatima-qays",
    "hard"
  ],
  [
    "learn-women-010",
    "sahaba",
    "history",
    "Ümmü Seleme'nin kızı olup hadis rivayet eden kadın sahâbî kimdir?",
    "Zeyneb bint Ebû Seleme",
    [
      "Sümeyye bint Hubbât",
      "Ümmü Süleym",
      "Esmâ bint Yezîd"
    ],
    "https://islamansiklopedisi.org.tr/zeyneb-bint-ebu-seleme",
    "Aile bağı, hadis öğretimi ve rivayetleri",
    "Zeyneb bint Ebû Seleme, Ümmü Seleme'nin kızıdır. Rivayetleri hadis kaynaklarında yer alır ve ilmiyle tanınır.",
    "women-zaynab-abu-salama",
    "medium"
  ],
  [
    "learn-dua-001",
    "dualar",
    "general",
    "Bakara 2/201'deki duada hangi iki hayat için iyilik istenir?",
    "Dünya ve âhiret",
    [
      "Yalnız dünya",
      "Yalnız âhiret",
      "Sadece geçmiş"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=201&mode=tefsir&sure=2",
    "Bakara 2/201: dünyada ve âhirette iyilik isteme",
    "Bakara 2/201'de hem dünya hem âhiret iyiliği ve cehennem azabından korunma dilenir.",
    "dua-world-afterlife",
    "easy"
  ],
  [
    "learn-dua-002",
    "dualar",
    "general",
    "Âl-i İmrân 3/8'deki duada Allah'tan kalpler için ne istenir?",
    "Doğru yoldan sapmamak",
    [
      "Zenginlikte yarışmak",
      "Herkesten üstün olmak",
      "Dünyevî makam kazanmak"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=8&mode=tefsir&sure=3",
    "Âl-i İmrân 3/8: hidayetten sonra kalbin sapmaması",
    "Âl-i İmrân 3/8'de iman edenler doğru yola eriştirildikten sonra kalplerinin saptırılmamasını ve rahmet verilmesini ister.",
    "dua-steadfast-heart",
    "medium"
  ],
  [
    "learn-dua-003",
    "dualar",
    "general",
    "A‘râf 7/23'te Hz. Âdem ile Havvâ'nın duasında öne çıkan istek hangisidir?",
    "Bağışlanma ve merhamet",
    [
      "Mülk ve servet",
      "Uzun yolculuk",
      "İnsanlardan övgü"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=23&mode=tefsir&sure=7",
    "A‘râf 7/23: kendilerine zulmettiklerini söyleyerek bağışlanma istemeleri",
    "Hz. Âdem ve Havvâ hatalarını kabul ederek Allah'tan bağışlanma ve merhamet dilerler.",
    "dua-adam-repentance",
    "easy"
  ],
  [
    "learn-dua-004",
    "dualar",
    "general",
    "İbrâhim 14/40'ta Hz. İbrâhim kendisi ve soyundan gelenler için ne diler?",
    "Namazı devamlı kılmaları",
    [
      "Hükümdar olmaları",
      "Denizlere hükmetmeleri",
      "Uzun ömürlü olmaları"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=40&mode=tefsir&sure=14",
    "İbrâhim 14/40: namazı dosdoğru kılmaya dair dua",
    "Hz. İbrâhim kendisinin ve soyundan gelenlerin namazı devamlı kılan kimseler olmasını ister.",
    "dua-prayer-descendants",
    "easy"
  ],
  [
    "learn-dua-005",
    "dualar",
    "general",
    "İbrâhim 14/41'deki duada Hz. İbrâhim kimler için bağışlanma diler?",
    "Kendisi, anne babası ve müminler",
    [
      "Yalnız hükümdarlar",
      "Sadece yolcular",
      "Yalnız zenginler"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=41&mode=tefsir&sure=14",
    "İbrâhim 14/41: bağışlanma duası",
    "Hz. İbrâhim hesap gününde kendisinin, anne babasının ve müminlerin bağışlanmasını diler.",
    "dua-for-believers-ibrahim",
    "medium"
  ],
  [
    "learn-dua-006",
    "dualar",
    "general",
    "Tâhâ 20/25-26'da Hz. Mûsâ'nın duasında hangi istek bulunur?",
    "Gönül ferahlığı ve işinin kolaylaşması",
    [
      "Servetinin artması",
      "Uzun süre uyuması",
      "Herkesi yönetmesi"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=25&mode=tefsir&sure=20",
    "Tâhâ 20/25-26: ferahlık ve kolaylık dileği",
    "Hz. Mûsâ görevine hazırlanırken gönlünün ferahlatılmasını ve işinin kolaylaştırılmasını ister.",
    "dua-musa-ease",
    "easy"
  ],
  [
    "learn-dua-007",
    "dualar",
    "general",
    "Furkân 25/74'teki duada eşler ve çocuklar için ne istenir?",
    "Göz aydınlığı olmaları",
    [
      "Sürekli seyahat etmeleri",
      "Herkesten zengin olmaları",
      "Hiç büyümemeleri"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=74&mode=tefsir&sure=25",
    "Furkân 25/74: aile ve salih nesil için dua",
    "Furkân 25/74'te eş ve çocukların göz aydınlığı olması ve takvâ sahiplerine öncülük edecek güzel bir aile hayatı dilenir.",
    "dua-family",
    "easy"
  ],
  [
    "learn-dua-008",
    "dualar",
    "general",
    "Haşr 59/10'daki duada önceki müminlere karşı kalpte ne bulunmaması istenir?",
    "Kin ve kötü duygu",
    [
      "Sevgi",
      "Merhamet",
      "Kardeşlik"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=10&mode=tefsir&sure=59",
    "Haşr 59/10: müminlere kin beslememeyi dilemek",
    "Haşr 59/10'da hem önceki müminlerin bağışlanması hem de iman edenlere karşı kalpte kin bulunmaması dilenir.",
    "dua-no-rancor",
    "easy"
  ],
  [
    "learn-dua-009",
    "dualar",
    "general",
    "Bakara 2/286'daki duada insanın gücüyle ilgili hangi istek yer alır?",
    "Gücünün yetmediği yükle yükümlü tutulmamak",
    [
      "Daha ağır yükler istemek",
      "Tüm sınavlardan kaçmak",
      "Dünyevî başarıyı garanti etmek"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=286&mode=tefsir&sure=2",
    "Bakara 2/286: güç yetirilemeyen yükten korunma",
    "Bakara 2/286'da insanın gücünü aşan yükten korunma, affedilme ve merhamet istenir.",
    "dua-beyond-capacity",
    "medium"
  ],
  [
    "learn-dua-010",
    "dualar",
    "general",
    "Mü’minûn sûresi 23/118 hangi istekle son bulur?",
    "Bağışlanma ve merhamet",
    [
      "Maddi üstünlük",
      "Dünyevî övgü",
      "Uzun yolculuk"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=118&mode=tefsir&sure=23",
    "Mü’minûn 23/118: bağışlanma ve rahmet duası",
    "Mü’minûn sûresinin son âyetinde Rabbinden bağışlama ve merhamet istenmesi öğretilir.",
    "dua-mercy-muminun",
    "medium"
  ]
];

export const learningDraftTopics: Readonly<Record<string, LearningDraftTopic>> = Object.freeze(
  Object.fromEntries(rows.map(row => [row[0],row[1]])),
);
export const learningDraftQuestions: readonly Question[] = rows.map((row): Question => {
  const [id, , categoryId, question, answer, wrong, url, locator, explanation, conceptGroup, difficulty] = row;
  const isQuran = url.startsWith("https://kuran.diyanet.gov.tr/");
  return {
    id, version: 1, categoryId, difficulty, question,
    options: [
      { id: "o1", text: wrong[0] }, { id: "o2", text: answer },
      { id: "o3", text: wrong[1] }, { id: "o4", text: wrong[2] },
    ],
    correctOptionId: "o2", explanation,
    sources: [{
      title: isQuran ? "Diyanet Kur'an Yolu" : "TDV İslâm Ansiklopedisi",
      publisher: isQuran ? "Diyanet İşleri Başkanlığı" : "TDV İslâm Araştırmaları Merkezi",
      url, locator, supports: explanation, checkStatus: "supported",
      checkedAt: "2026-10-20",
    }],
    reviewStatus: "draft",
    reviewNotes: "Birincil ayet/TDV maddesi karşılaştırılarak hazırlanan TASLAK; bağımsız dinî uzman, editör, çeldirici ve yayın kabulü bekleniyor.",
    updatedAt: "2026-10-20", conceptGroup,
  };
});
