import type { CategoryId, Difficulty, Question } from "./model";

// 20 new educational questions checked against the cited Diyanet / TDV articles.
// Owner's conditional acceptance does not constitute an independent religious review.
type Row = readonly [CategoryId, string, string, readonly [string, string, string], string, string, string, string, Difficulty];
const rows: readonly Row[] = [
  [
    "quran",
    "Tîn sûresine adını veren 'tîn' sözcüğünün Türkçe karşılığı hangisidir?",
    "İncir",
    [
      "Hurma",
      "Zeytin",
      "Üzüm"
    ],
    "https://islamansiklopedisi.org.tr/tin-suresi",
    "Giriş: sûrenin adının ilk âyetteki tîn kelimesinden gelişi",
    "Tîn sûresi adını ilk âyetindeki incir anlamına gelen tîn kelimesinden alır.",
    "tin-name",
    "easy"
  ],
  [
    "quran",
    "Mâûn sûresi adını hangi âyetinde geçen kelimeden alır?",
    "Son âyet",
    [
      "İlk âyet",
      "Üçüncü âyet",
      "Beşinci âyet"
    ],
    "https://islamansiklopedisi.org.tr/maun-suresi",
    "Giriş: son âyetteki mâûn kelimesi",
    "Yedi âyetlik Mâûn sûresinin adı son âyette geçen mâûn kelimesinden gelir.",
    "maun-name",
    "medium"
  ],
  [
    "quran",
    "Kâfirûn sûresinde özellikle hangi inanç ilkesi vurgulanır?",
    "Allah'a ortak koşmama (tevhid)",
    [
      "Atalara övgü",
      "Dünyevî servet biriktirme",
      "Soy üstünlüğü"
    ],
    "https://islamansiklopedisi.org.tr/kafirun-suresi",
    "Muhteva: tevhid ve ibadette şirkten uzak durma",
    "Kâfirûn sûresinde yalnız Allah'a kulluk etme ve O'na ortak koşmama ilkesi öne çıkar.",
    "kafirun-message",
    "easy"
  ],
  [
    "quran",
    "Âdiyât sûresinin başında genellikle hangi hayvanların soluk soluğa koşması anlatılır?",
    "Savaş atları",
    [
      "Develer",
      "Filler",
      "Koyunlar"
    ],
    "https://islamansiklopedisi.org.tr/adiyat-suresi",
    "Âdiyât kelimesinin yorumu",
    "Müfessirler Âdiyât sûresindeki ilk tasviri genellikle soluk soluğa koşan savaş atları olarak açıklar.",
    "adiyat-imagery",
    "medium"
  ],
  [
    "quran",
    "Kur'an'daki 'es-seb'u'l-mesânî' ifadesi yaygın yoruma göre hangi sûreyi anlatır?",
    "Fâtiha",
    [
      "Yâsîn",
      "Kehf",
      "Mülk"
    ],
    "https://islamansiklopedisi.org.tr/fatiha-suresi",
    "Hicr 15/87 ve Fâtiha yorumu",
    "Hicr sûresinin 87. âyetindeki 'tekrarlanan yedi' ifadesinin yaygın olarak Fâtiha sûresine işaret ettiği kabul edilir.",
    "fatiha-seb-mesani",
    "hard"
  ],
  [
    "prophets",
    "Kur'an'da Ba'l inancıyla mücadele ettiği belirtilen peygamber kimdir?",
    "Hz. İlyâs",
    [
      "Hz. Hûd",
      "Hz. Sâlih",
      "Hz. Lût"
    ],
    "https://islamansiklopedisi.org.tr/ilyas",
    "Sâffât 37/123-130 bağlamı, Ba'l inancı",
    "Sâffât sûresinde Hz. İlyâs'ın kavminin Ba'l inancına karşı çıktığı anlatılır.",
    "ilyas-baal",
    "medium"
  ],
  [
    "prophets",
    "Hz. İbrâhim'in oğlu İshak'ın annesi kimdir?",
    "Sâre",
    [
      "Hâcer",
      "Meryem",
      "Âmine"
    ],
    "https://islamansiklopedisi.org.tr/ishak",
    "Giriş: Hz. İbrâhim'in Sâre'den doğan oğlu",
    "İslâmî kaynaklarda Hz. İshak, Hz. İbrâhim ile Sâre'nin oğlu olarak tanıtılır.",
    "ishak-sare",
    "easy"
  ],
  [
    "prophets",
    "Kur'an'a göre tufandan sonra Hz. Nûh'un gemisinin üzerine oturduğu dağın adı nedir?",
    "Cûdî",
    [
      "Sînâ",
      "Uhud",
      "Arafat"
    ],
    "https://islamansiklopedisi.org.tr/cudi-dagi",
    "Giriş, Hûd 11/44 bağlamı",
    "Hûd sûresinin 44. âyetinde geminin Cûdî üzerine oturduğu bildirilir.",
    "nuh-cudi",
    "medium"
  ],
  [
    "prophets",
    "Meryem sûresi 19/54'te sözünde durmasıyla övülen peygamber kimdir?",
    "Hz. İsmâil",
    [
      "Hz. Yûnus",
      "Hz. İshak",
      "Hz. Eyyûb"
    ],
    "https://islamansiklopedisi.org.tr/ismail--peygamber",
    "Meryem 19/54-55: sözünde durma",
    "Meryem sûresinin 54. âyetinde Hz. İsmâil sözünde duran bir kişi olarak anılır.",
    "ismail-promise",
    "medium"
  ],
  [
    "prophets",
    "Enbiyâ sûresi 21/85'te İsmâil ve İdrîs ile birlikte sabredenlerden sayılan isim kimdir?",
    "Zülkifl",
    [
      "Yahyâ",
      "Hârûn",
      "Şuayb"
    ],
    "https://islamansiklopedisi.org.tr/zulkifl",
    "Enbiyâ 21/85 ve Sâd 38/48",
    "Enbiyâ sûresinde İsmâil, İdrîs ve Zülkifl sabredenler arasında birlikte anılır.",
    "zulkifl-sabr",
    "hard"
  ],
  [
    "history",
    "Hz. Peygamber'in şairi olarak tanınan sahâbî kimdir?",
    "Hassân b. Sâbit",
    [
      "Zeyd b. Sâbit",
      "Selmân-ı Fârisî",
      "Bilâl-i Habeşî"
    ],
    "https://islamansiklopedisi.org.tr/hassan-b-sabit",
    "Giriş: şâirü'n-nebî unvanı",
    "Hassân b. Sâbit, Hz. Peygamber'i ve Müslümanları şiirleriyle savunduğu için Peygamber'in şairi diye tanınır.",
    "hassan-poet",
    "medium"
  ],
  [
    "history",
    "Hz. Peygamber'in 'Seyfullah' unvanıyla andığı meşhur kumandan kimdir?",
    "Hâlid b. Velîd",
    [
      "Sa'd b. Muâz",
      "Ebû Ubeyde b. Cerrâh",
      "Mus'ab b. Umeyr"
    ],
    "https://islamansiklopedisi.org.tr/halid-b-velid",
    "Madde başlığı: Seyfullah unvanı",
    "Hâlid b. Velîd, Hz. Peygamber'in verdiği 'Allah'ın kılıcı' anlamındaki Seyfullah unvanıyla tanınır.",
    "halid-seyfullah",
    "easy"
  ],
  [
    "history",
    "Fârûk lakabıyla tanınan râşid halife kimdir?",
    "Hz. Ömer",
    [
      "Hz. Osman",
      "Hz. Ali",
      "Hz. Ebû Bekir"
    ],
    "https://islamansiklopedisi.org.tr/faruk--omer",
    "Madde tanımı: Hz. Ömer'in lakabı",
    "Fârûk, İslâm tarihinde özellikle Hz. Ömer için kullanılan bir lakaptır.",
    "omer-faruk",
    "easy"
  ],
  [
    "history",
    "İslâm'ın Medine'deki ilk öğretmenlerinden Mus'ab b. Umeyr hangi savaşta şehit olmuştur?",
    "Uhud",
    [
      "Bedir",
      "Hendek",
      "Huneyn"
    ],
    "https://islamansiklopedisi.org.tr/uhud-gazvesi",
    "Mus'ab b. Umeyr'in Uhud'da şehit edilmesi",
    "Siyer kaynakları, Mus'ab b. Umeyr'in Uhud Gazvesi sırasında şehit olduğunu kaydeder.",
    "musab-uhud",
    "medium"
  ],
  [
    "history",
    "Hz. Peygamber'in amcasının oğlu olup tefsir ve fıkıh bilgisiyle tanınan sahâbî kimdir?",
    "Abdullah b. Abbas",
    [
      "Ebû Hüreyre",
      "Hâlid b. Velîd",
      "Selmân-ı Fârisî"
    ],
    "https://islamansiklopedisi.org.tr/abdullah-b-abbas",
    "Giriş: tefsir ve fıkıh otoritesi",
    "Abdullah b. Abbas, Hz. Peygamber'in amcasının oğludur ve tefsir ile fıkıh alanındaki bilgisiyle bilinir.",
    "ibn-abbas-scholar",
    "medium"
  ],
  [
    "general",
    "Zekât için esas alınan asgarî zenginlik ölçüsüne ne denir?",
    "Nisab",
    [
      "İmsak",
      "İcma",
      "İhram"
    ],
    "https://islamansiklopedisi.org.tr/nisab",
    "Tanım: zekât yükümlülüğünde zenginlik ölçüsü",
    "Nisab, zekâta tâbi malın belirli asgarî düzeye ulaşmasını ifade eden fıkıh terimidir.",
    "nisab-meaning",
    "medium"
  ],
  [
    "general",
    "Kur'an'da secde âyetinin okunması veya dinlenmesiyle ilgili secdenin adı nedir?",
    "Tilâvet secdesi",
    [
      "Şükür secdesi",
      "Sehiv secdesi",
      "Namazdaki ikinci secde"
    ],
    "https://islamansiklopedisi.org.tr/tilavet-secdesi",
    "Giriş: tilâvet secdesinin tanımı",
    "Tilâvet secdesi, Kur'an'daki secde âyeti okunması veya işitilmesiyle ilişkilidir; hükmü mezheplere göre farklı değerlendirilir.",
    "tilavet-secdesi",
    "medium"
  ],
  [
    "general",
    "Hadis literatüründe 'Kütüb-i Sitte' ifadesi kaç temel hadis kitabını anlatır?",
    "Altı",
    [
      "Dört",
      "Beş",
      "Yedi"
    ],
    "https://islamansiklopedisi.org.tr/kutub-i-sitte",
    "Madde tanımı: altı hadis kitabı",
    "Kütüb-i Sitte, hadis literatüründe yaygın kabul gören altı hadis kitabının ortak adıdır.",
    "kutub-i-sitte",
    "medium"
  ],
  [
    "general",
    "İslâmî terminolojide Allah'ı anmayı ifade eden temel kavram hangisidir?",
    "Zikir",
    [
      "Kıyas",
      "Kıraat",
      "Hicret"
    ],
    "https://islamansiklopedisi.org.tr/zikir",
    "Giriş ve zikir biçimleri",
    "Zikir, Allah'ı kalple veya dille anmayı ve hatırlamayı ifade eder.",
    "zikir-meaning",
    "easy"
  ],
  [
    "general",
    "İslâmî terim olarak 'tesbih'in temel anlamı hangisidir?",
    "Allah'ı eksikliklerden uzak tutarak yüceltmek",
    [
      "İnsanları saymak",
      "Hicret yollarını anlatmak",
      "Ramazan ayını belirlemek"
    ],
    "https://islamansiklopedisi.org.tr/tesbih--allah",
    "Giriş ve tesbihin terim anlamı",
    "Tesbih, Allah'ı O'na yakışmayan sıfatlardan tenzih edip yüce sıfatlarla anmayı ifade eder.",
    "tesbih-meaning",
    "medium"
  ],
];
const counters: Record<CategoryId, number> = { quran: 0, prophets: 0, history: 0, general: 0 };
export const newCandidatesV8: readonly Question[] = rows.map((row): Question => {
  const [categoryId, question, correct, wrong, url, locator, explanation, conceptGroup, difficulty] = row;
  const id = `v8-${categoryId}-${String(++counters[categoryId]).padStart(3, "0")}`;
  const isDiyanet = url.startsWith("https://kuran.diyanet.gov.tr/");
  return {
    id, version: 1, categoryId, difficulty, question,
    options: [{ id: "o1", text: wrong[0] }, { id: "o2", text: correct }, { id: "o3", text: wrong[1] }, { id: "o4", text: wrong[2] }],
    correctOptionId: "o2", explanation,
    sources: [{ title: isDiyanet ? "Diyanet Kur'an Yolu" : "TDV İslâm Ansiklopedisi",
      publisher: isDiyanet ? "Diyanet İşleri Başkanlığı" : "TDV İslâm Araştırmaları Merkezi",
      url, locator, supports: explanation, checkStatus: "supported", checkedAt: "2026-10-19" }],
    reviewStatus: "approved",
    reviewNotes: "Ürün sahibinin 2026-10-19 tarihli kaynak doğrulama koşullu kullanım onayı uygulanmıştır. Bağımsız editör ve dinî uzman incelemesi yapılmış sayılmaz.",
    updatedAt: "2026-10-19", conceptGroup,
  };
});
