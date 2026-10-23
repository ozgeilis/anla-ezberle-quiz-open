import type { CategoryId, Difficulty, Question } from "./model";

// 20 özgün soru; her kaynak ilgili olgu açısından 2026-10-19 tarihinde karşılaştırıldı.
// "approved" ürün sahibinin koşullu içerik kullanım kararıdır; dinî uzman incelemesi değildir.
type Row = readonly [CategoryId, string, string, readonly [string, string, string], string, string, string, string, Difficulty];
const rows: readonly Row[] = [
  [
    "quran",
    "Mushaflarda başında besmele bulunmayan sûre hangisidir?",
    "Tevbe",
    [
      "Enfâl",
      "Yûnus",
      "Hûd"
    ],
    "https://islamansiklopedisi.org.tr/tevbe-suresi",
    "Maddenin giriş bölümü: besmelesiz başlangıç",
    "Tevbe sûresinin başında diğer sûrelerdeki gibi besmele yazılı değildir.",
    "tevbe-besmele",
    "medium"
  ],
  [
    "quran",
    "Kur'an'da adı 'bal arısı' anlamına gelen sûre hangisidir?",
    "Nahl",
    [
      "Neml",
      "Ankebût",
      "Fil"
    ],
    "https://islamansiklopedisi.org.tr/nahl-suresi",
    "Sûrenin adının 68-69. âyetlerden gelişi",
    "Nahl sûresi adını 68-69. âyetlerde geçen ve bal arısı anlamına gelen nahl kelimesinden alır.",
    "nahl-adi",
    "easy"
  ],
  [
    "quran",
    "Yaygın kabule göre ilk vahyin başlangıcı hangi sûrenin ilk beş âyetidir?",
    "Alak",
    [
      "Müddessir",
      "Fâtiha",
      "Kadr"
    ],
    "https://islamansiklopedisi.org.tr/alak-suresi",
    "İlk beş âyetin nüzûlü ve farklı görüşler",
    "Âlimler arasında başka görüşler de olsa yaygın görüş, Alak sûresinin ilk beş âyetinin ilk vahiy olduğu yönündedir.",
    "alak-ilk-vahiy",
    "medium"
  ],
  [
    "quran",
    "Kadir gecesinin bin aydan daha hayırlı olduğu hangi sûrede bildirilir?",
    "Kadr",
    [
      "Duhân",
      "Mülk",
      "İhlâs"
    ],
    "https://islamansiklopedisi.org.tr/kadir-gecesi",
    "Kadr sûresinin fazilet anlatımı",
    "Kadr sûresinde Kadir gecesinin bin aydan daha hayırlı olduğu belirtilir.",
    "kadr-gecesi",
    "easy"
  ],
  [
    "quran",
    "Kadr sûresinde bu özel gecede yeryüzüne indikleri bildirilenler kimlerdir?",
    "Melekler ve Ruh (Cebrâil)",
    [
      "Sadece insanlar",
      "Peygamberler ve krallar",
      "Yalnız hükümdarlar"
    ],
    "https://islamansiklopedisi.org.tr/kadir-gecesi",
    "Kadr sûresinde melekler ve Cebrâil",
    "Kadr sûresinde meleklerin ve Ruh diye anılan Cebrâil'in Allah'ın izniyle indiği bildirilir.",
    "kadr-gecesi",
    "medium"
  ],
  [
    "prophets",
    "Kur'an'da Hz. Meryem'in himayesini üstlenen peygamber kimdir?",
    "Hz. Zekeriyyâ",
    [
      "Hz. Eyyûb",
      "Hz. Hârûn",
      "Hz. Yûnus"
    ],
    "https://islamansiklopedisi.org.tr/zekeriyya",
    "Âl-i İmrân 3/37: Meryem'in himayesi",
    "Âl-i İmrân 3/37'ye göre Meryem'in bakımını Hz. Zekeriyyâ üstlenmiştir.",
    "zekeriyya-meryem",
    "medium"
  ],
  [
    "prophets",
    "İslâmî kaynaklarda Ninova halkıyla ilişkilendirilen peygamber kimdir?",
    "Hz. Yûnus",
    [
      "Hz. Hûd",
      "Hz. Sâlih",
      "Hz. İdrîs"
    ],
    "https://islamansiklopedisi.org.tr/yunus",
    "Yûnus'un gönderildiği halk",
    "İslâmî kaynaklarda Hz. Yûnus'un Ninova halkına tebliğde bulunduğu anlatılır.",
    "yunus-ninova",
    "medium"
  ],
  [
    "prophets",
    "Enbiyâ sûresi 21/69'da ateşin serin ve esenlikli kılındığı peygamber kimdir?",
    "Hz. İbrâhim",
    [
      "Hz. İsmâil",
      "Hz. Mûsâ",
      "Hz. Şuayb"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/21",
    "Enbiyâ 21/68-70: ateş ve İbrâhim",
    "Enbiyâ sûresinin 69. âyetinde ateşin Hz. İbrâhim için serin ve esenlikli olması emredilir.",
    "ibrahim-ates",
    "medium"
  ],
  [
    "prophets",
    "Sebe' sûresi 34/10'a göre kendisine demiri işleme kolaylığı verilen peygamber kimdir?",
    "Hz. Dâvûd",
    [
      "Hz. Süleyman",
      "Hz. Yûsuf",
      "Hz. Nûh"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/34",
    "Sebe' 34/10 ve Diyanet tefsiri",
    "Sebe' sûresinde Allah'ın Hz. Dâvûd için demiri yumuşattığı bildirilir.",
    "davud-demir",
    "medium"
  ],
  [
    "prophets",
    "İslâmî rivayetlerde Hz. İsmâil'in annesi olarak bilinen kişi kimdir?",
    "Hâcer",
    [
      "Sâre",
      "Âsiye",
      "Belkıs"
    ],
    "https://islamansiklopedisi.org.tr/zemzem",
    "Zemzem kıssasında Hâcer ve İsmâil",
    "Zemzem kıssasını anlatan İslâmî rivayetlerde Hz. İsmâil'in annesi Hâcer'dir.",
    "ismail-hacer",
    "easy"
  ],
  [
    "history",
    "Hendek Gazvesi'nde savunma amacıyla hendek kazılması fikri hangi sahâbîyle ilişkilendirilir?",
    "Selmân-ı Fârisî",
    [
      "Bilâl-i Habeşî",
      "Ebû Hüreyre",
      "Zeyd b. Sâbit"
    ],
    "https://islamansiklopedisi.org.tr/hendek-gazvesi",
    "Medine savunması ve hendek önerisi",
    "Tarih kaynakları, Medine çevresine hendek kazılması önerisini genellikle Selmân-ı Fârisî'ye nispet eder.",
    "hendek-selman",
    "medium"
  ],
  [
    "history",
    "Mûte Savaşı öncesinde tayin edilen ilk kumandan kimdir?",
    "Zeyd b. Hârise",
    [
      "Hâlid b. Velîd",
      "Abdullah b. Revâha",
      "Ca‘fer b. Ebû Tâlib"
    ],
    "https://islamansiklopedisi.org.tr/mute-savasi",
    "Kumandanlık için belirlenen sıra",
    "Mûte seferinde ilk kumandan Zeyd b. Hârise olarak belirlenmiş, ardından Ca‘fer ve Abdullah b. Revâha sıralanmıştır.",
    "mute-komutan",
    "hard"
  ],
  [
    "history",
    "Hayber seferi hicretin kaçıncı yılında gerçekleşmiştir?",
    "7",
    [
      "5",
      "6",
      "9"
    ],
    "https://islamansiklopedisi.org.tr/hayber",
    "Hayber seferi: hicrî 7 / milâdî 628",
    "Hayber seferi hicrî 7. yılda, milâdî 628'de gerçekleşmiştir.",
    "hayber-tarih",
    "medium"
  ],
  [
    "history",
    "Kaynaklarda 'Güçlük Seferi' diye de anılan gazve hangisidir?",
    "Tebük Gazvesi",
    [
      "Bedir Gazvesi",
      "Uhud Gazvesi",
      "Hayber Seferi"
    ],
    "https://islamansiklopedisi.org.tr/tebuk-gazvesi",
    "Gazvetü'l-usre adı",
    "Tebük Gazvesi'nin güç şartlarda gerçekleşmesi sebebiyle ona Gazvetü'l-usre adı da verilmiştir.",
    "tebuk-gazve",
    "hard"
  ],
  [
    "history",
    "Hz. Peygamber'in Vedâ haccı hicrî kaçıncı yılda gerçekleşmiştir?",
    "10",
    [
      "6",
      "8",
      "9"
    ],
    "https://islamansiklopedisi.org.tr/veda-hacci",
    "Giriş: 10/632",
    "Vedâ haccı hicrî 10. yılda, milâdî 632'de yapılmıştır.",
    "veda-hacci-tarih",
    "medium"
  ],
  [
    "general",
    "Ramazan gecelerinde yatsı namazından sonra kılınan namazın adı nedir?",
    "Teravih",
    [
      "İstiskā",
      "Cenaze namazı",
      "Küsûf"
    ],
    "https://islamansiklopedisi.org.tr/teravih",
    "Tanım ve vakit",
    "Teravih, ramazan ayına özgü olarak yatsıdan sonra kılınan namazdır.",
    "teravih-namazi",
    "easy"
  ],
  [
    "general",
    "Ramazan sonunda gücü yeten Müslümanın vermekle yükümlü olduğu sadakaya ne denir?",
    "Fitre",
    [
      "Adak",
      "Kefaret",
      "Nezir"
    ],
    "https://islamansiklopedisi.org.tr/fitre",
    "Sadaka-i fıtr tanımı",
    "Fitre veya sadaka-i fıtr, ramazanın sonunda verilen malî yardımdır.",
    "fitre-tanimi",
    "easy"
  ],
  [
    "general",
    "Özellikle ramazanın son on gününde ibadete yoğunlaşarak yapılan uygulamaya ne denir?",
    "İtikâf",
    [
      "Tavaf",
      "Sa‘y",
      "Kunut"
    ],
    "https://islamansiklopedisi.org.tr/itikaf",
    "Ramazanın son on gününde i‘tikâf",
    "İtikâf, kişinin ibadete odaklanmak üzere belirli bir süre ayırmasıdır; ramazanın son on günü bu açıdan önemlidir.",
    "itikaf",
    "medium"
  ],
  [
    "general",
    "Yeni doğan çocuk için şükür amacıyla kesilen kurbana ne ad verilir?",
    "Akîka",
    [
      "Hedy",
      "Udhiyye",
      "Nezir"
    ],
    "https://islamansiklopedisi.org.tr/akika",
    "Akîka kurbanının tanımı",
    "Akîka, yeni doğan çocuk vesilesiyle şükür amacıyla kesilen kurbana verilen addır.",
    "akika",
    "medium"
  ],
  [
    "general",
    "Cibrîl hadisindeki 'Allah'ı görür gibi ibadet etmek' tanımı hangi kavrama aittir?",
    "İhsan",
    [
      "İkrar",
      "Tevekkül",
      "Hicret"
    ],
    "https://islamansiklopedisi.org.tr/ihsan--iyilik",
    "Cibrîl hadisinde ihsan tarifi",
    "Cibrîl hadisinde ihsan, Allah'ı görür gibi ibadet etmek ifadesiyle açıklanır.",
    "ihsan-kavrami",
    "medium"
  ],
];
const counts: Record<CategoryId, number> = { quran: 0, prophets: 0, history: 0, general: 0 };
export const newCandidatesV7: readonly Question[] = rows.map((row): Question => {
  const [categoryId, question, correct, wrong, url, locator, explanation, conceptGroup, difficulty] = row;
  const id = `v7-${categoryId}-${String(++counts[categoryId]).padStart(3, "0")}`;
  const isDiyanet = url.startsWith("https://kuran.diyanet.gov.tr/");
  return {
    id, version: 1, categoryId, difficulty, question,
    options: [
      { id: "o1", text: wrong[0] },
      { id: "o2", text: correct },
      { id: "o3", text: wrong[1] },
      { id: "o4", text: wrong[2] },
    ],
    correctOptionId: "o2", explanation,
    sources: [{
      title: isDiyanet ? "Diyanet Kur'an Yolu" : "TDV İslâm Ansiklopedisi",
      publisher: isDiyanet ? "Diyanet İşleri Başkanlığı" : "TDV İslâm Araştırmaları Merkezi",
      url, locator, supports: explanation, checkStatus: "supported", checkedAt: "2026-10-19",
    }],
    reviewStatus: "approved",
    reviewNotes: "Ürün sahibinin 2026-10-19 tarihli kaynak doğrulama koşullu onayı kapsamında kullanıma kabul edildi. Bağımsız editör veya dinî uzman incelemesi yapıldığı iddia edilmez.",
    updatedAt: "2026-10-19", conceptGroup,
  };
});
