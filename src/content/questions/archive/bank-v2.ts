import type { Question } from "../model";

// Bu sürüm değişmez. Sonraki düzeltmeler yeni banka sürümü olarak arşivlenmelidir.
export const bankV2 = [
  {
    id: "quran-001",
    version: 2,
    categoryId: "quran",
    difficulty: "easy",
    question: "Kur’an’da kaç sure vardır?",
    options: [
      {
        id: "o1",
        text: "30",
      },
      {
        id: "o2",
        text: "114",
      },
      {
        id: "o3",
        text: "99",
      },
      {
        id: "o4",
        text: "113",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Kur’an-ı Kerim 114 sureden oluşur. Sureler farklı uzunluklarda bölümlerdir.",
    sources: [
      {
        title: "TÜBİTAK Ansiklopedi · Kur’ân-ı Kerîm",
        url: "https://ansiklopedi.tubitak.gov.tr/ansiklopedi/kuran_i_kerim",
        locator: "Mushafın yapısı, 114 sure bilgisi",
        publisher: "TÜBİTAK",
        supports:
          "Kur’an-ı Kerim 114 sureden oluşur. Sureler farklı uzunluklarda bölümlerdir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Sayılar aynı türde; 114 ile 30 cüz ayrımı açıklanıyor. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "quran-001",
  },
  {
    id: "quran-002",
    version: 2,
    categoryId: "quran",
    difficulty: "easy",
    question: "Mushaf sıralamasında ilk sure hangisidir?",
    options: [
      {
        id: "o1",
        text: "Nâs",
      },
      {
        id: "o2",
        text: "İhlâs",
      },
      {
        id: "o3",
        text: "Fâtiha",
      },
      {
        id: "o4",
        text: "Kevser",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Mushaf, Fâtiha suresiyle başlar. Burada sorulan, vahyin geliş sırası değil, kitaptaki sıralamadır.",
    sources: [
      {
        title: "TÜBİTAK Ansiklopedi · Kur’ân-ı Kerîm",
        url: "https://ansiklopedi.tubitak.gov.tr/ansiklopedi/kuran_i_kerim",
        locator: "Mushafın Fâtiha ile başlaması",
        publisher: "TÜBİTAK",
        supports:
          "Mushaf, Fâtiha suresiyle başlar. Burada sorulan, vahyin geliş sırası değil, kitaptaki sıralamadır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Mushaf sırası açıkça belirtiliyor; vahyin iniş sırası sorulmuyor. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "quran-002",
  },
  {
    id: "quran-003",
    version: 2,
    categoryId: "quran",
    difficulty: "easy",
    question: "Kur’an kaç cüze ayrılmıştır?",
    options: [
      {
        id: "o1",
        text: "20",
      },
      {
        id: "o2",
        text: "60",
      },
      {
        id: "o3",
        text: "114",
      },
      {
        id: "o4",
        text: "30",
      },
    ],
    correctOptionId: "o4",
    explanation:
      "Kur’an 30 cüze ayrılır. Cüz, okumayı bölümlere ayırmaya yardımcı olan bir birimdir.",
    sources: [
      {
        title: "TÜBİTAK Ansiklopedi · Kur’ân-ı Kerîm",
        url: "https://ansiklopedi.tubitak.gov.tr/ansiklopedi/kuran_i_kerim",
        locator: "Mushafın otuz cüze ayrılması",
        publisher: "TÜBİTAK",
        supports:
          "Kur’an 30 cüze ayrılır. Cüz, okumayı bölümlere ayırmaya yardımcı olan bir birimdir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Cüz sayısı ile sure sayısı ayrıştırıldı; seçenekler sayısal. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "quran-003",
  },
  {
    id: "quran-004",
    version: 2,
    categoryId: "quran",
    difficulty: "easy",
    question: "Mushaf sıralamasında son sure hangisidir?",
    options: [
      {
        id: "o1",
        text: "Nâs",
      },
      {
        id: "o2",
        text: "Bakara",
      },
      {
        id: "o3",
        text: "Fâtiha",
      },
      {
        id: "o4",
        text: "Yâsîn",
      },
    ],
    correctOptionId: "o1",
    explanation: "Mushaf sıralamasında 114. ve son sure Nâs suresidir.",
    sources: [
      {
        title: "TÜBİTAK Ansiklopedi · Kur’ân-ı Kerîm",
        url: "https://ansiklopedi.tubitak.gov.tr/ansiklopedi/kuran_i_kerim",
        locator: "Mushafın Nâs ile sona ermesi",
        publisher: "TÜBİTAK",
        supports: "Mushaf sıralamasında 114. ve son sure Nâs suresidir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Mushaf sırası belirtildi; ilk sure sorusundan farklı konum bilgisi. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "quran-004",
  },
  {
    id: "quran-005",
    version: 2,
    categoryId: "quran",
    difficulty: "easy",
    question:
      "Kur’an’da ayetlerin oluşturduğu bağımsız ve adlandırılmış her bölüme ne denir?",
    options: [
      {
        id: "o1",
        text: "Cüz",
      },
      {
        id: "o2",
        text: "Sure",
      },
      {
        id: "o3",
        text: "Ayet",
      },
      {
        id: "o4",
        text: "Hizip",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Sure, ayetlerin oluşturduğu bağımsız bölümdür. Cüz ise okuma düzenini kolaylaştıran ayrı bir bölümlemedir.",
    sources: [
      {
        title: "TÜBİTAK Ansiklopedi · Kur’ân-ı Kerîm",
        url: "https://ansiklopedi.tubitak.gov.tr/ansiklopedi/kuran_i_kerim",
        locator: "Ayet ve sure tanımları",
        publisher: "TÜBİTAK",
        supports:
          "Sure, ayetlerin oluşturduğu bağımsız bölümdür. Cüz ise okuma düzenini kolaylaştıran ayrı bir bölümlemedir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Alakasız çeldiriciler yapısal birimlerle değiştirildi. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "quran-005",
  },
  {
    id: "prophets-001",
    version: 2,
    categoryId: "prophets",
    difficulty: "easy",
    question: "Hz. Muhammed hangi şehirde doğmuştur?",
    options: [
      {
        id: "o1",
        text: "Medine",
      },
      {
        id: "o2",
        text: "Kudüs",
      },
      {
        id: "o3",
        text: "Mekke",
      },
      {
        id: "o4",
        text: "Şam",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Hz. Muhammed Mekke’de doğmuştur. Çocukluk ve gençlik yılları da bu şehirde geçmiştir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Muhammed",
        url: "https://islamansiklopedisi.org.tr/muhammed",
        locator: "A) Nübüvvet Öncesi, Mekke’de doğumu",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Hz. Muhammed Mekke’de doğmuştur. Çocukluk ve gençlik yılları da bu şehirde geçmiştir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Doğum yeri destekleniyor; tartışmalı doğum günü/yılı sorulmuyor. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "prophets-001",
  },
  {
    id: "prophets-002",
    version: 2,
    categoryId: "prophets",
    difficulty: "easy",
    question: "Hz. Muhammed’in annesinin adı nedir?",
    options: [
      {
        id: "o1",
        text: "Âmine",
      },
      {
        id: "o2",
        text: "Hatice",
      },
      {
        id: "o3",
        text: "Halîme",
      },
      {
        id: "o4",
        text: "Fâtıma",
      },
    ],
    correctOptionId: "o1",
    explanation: "Hz. Muhammed’in annesi Âmine bint Vehb’dir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Muhammed",
        url: "https://islamansiklopedisi.org.tr/muhammed",
        locator: "A) Nübüvvet Öncesi, Âmine bint Vehb",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports: "Hz. Muhammed’in annesi Âmine bint Vehb’dir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Annenin adı doğrudan destekleniyor; çeldiriciler siyer kişileriyle yenilendi. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "prophets-002",
  },
  {
    id: "prophets-003",
    version: 2,
    categoryId: "prophets",
    difficulty: "easy",
    question:
      "Kur’an’da tufan sırasında gemi yapması anlatılan peygamber kimdir?",
    options: [
      {
        id: "o1",
        text: "Hz. Yûsuf",
      },
      {
        id: "o2",
        text: "Hz. Dâvûd",
      },
      {
        id: "o3",
        text: "Hz. Süleyman",
      },
      {
        id: "o4",
        text: "Hz. Nûh",
      },
    ],
    correctOptionId: "o4",
    explanation:
      "Hz. Nûh, Kur’an’da tufan ve gemi kıssasıyla anlatılan peygamberdir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Nûh",
        url: "https://islamansiklopedisi.org.tr/nuh",
        locator: "Kur’an’daki Nûh anlatısı; Hûd 11/36–39 referansı",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Hz. Nûh, Kur’an’da tufan ve gemi kıssasıyla anlatılan peygamberdir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Kur’an kıssası bağlamı belirtildi; tufanın zamanı/kapsamı yorumlanmıyor. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "prophets-003",
  },
  {
    id: "prophets-004",
    version: 2,
    categoryId: "prophets",
    difficulty: "easy",
    question: "Hz. Muhammed’in hayatını konu alan alana ne denir?",
    options: [
      {
        id: "o1",
        text: "Tefsir",
      },
      {
        id: "o2",
        text: "Siyer",
      },
      {
        id: "o3",
        text: "Fıkıh",
      },
      {
        id: "o4",
        text: "Kelâm",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Siyer, Hz. Muhammed’in hayatını ve tebliğ faaliyetlerini inceler. Kur’an ayetlerini açıklayan alan ise tefsirdir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Siyer ve Megāzî",
        url: "https://islamansiklopedisi.org.tr/siyer-ve-megazi",
        locator: "Madde tanımı ve siyer teriminin kapsamı",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Siyer, Hz. Muhammed’in hayatını ve tebliğ faaliyetlerini inceler. Kur’an ayetlerini açıklayan alan ise tefsirdir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
      {
        title: "TDV İslâm Ansiklopedisi · Tefsir",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/tefsir",
        locator: "Madde tanımı",
        supports:
          "Tefsir, ayetlerin anlamlarını açıklama ve yorumlama alanıdır. Bu alanda yazılan eserlere de tefsir denir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Alakasız alanlar yerine İslami ilim dalları kullanıldı. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "siyer-tefsir",
  },
  {
    id: "prophets-005",
    version: 2,
    categoryId: "prophets",
    difficulty: "easy",
    question: "Hz. Muhammed’e ilk vahyin geldiği yer hangisidir?",
    options: [
      {
        id: "o1",
        text: "Sevr mağarası",
      },
      {
        id: "o2",
        text: "Kubâ",
      },
      {
        id: "o3",
        text: "Hira mağarası",
      },
      {
        id: "o4",
        text: "Akabe",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Hz. Muhammed’e ilk vahiy Hira mağarasında gelmiştir. Kaynak, Alak suresinin ilk beş ayetinin gelişini bu mekânla birlikte anlatır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Hira",
        url: "https://islamansiklopedisi.org.tr/hira",
        locator: "Hira’da ilk vahiy; Alak 96/1–5 referansı",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Hz. Muhammed’e ilk vahiy Hira mağarasında gelmiştir. Kaynak, Alak suresinin ilk beş ayetinin gelişini bu mekânla birlikte anlatır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Alakasız mağara seçenekleri yerine dört yer adı; Hira-Sevr ayrımı açıklandı. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "prophets-005",
  },
  {
    id: "history-001",
    version: 2,
    categoryId: "history",
    difficulty: "easy",
    question: "Hz. Muhammed’in Mekke’den Medine’ye göçüne ne denir?",
    options: [
      {
        id: "o1",
        text: "Hicret",
      },
      {
        id: "o2",
        text: "Biat",
      },
      {
        id: "o3",
        text: "Muâhât",
      },
      {
        id: "o4",
        text: "Fetih",
      },
    ],
    correctOptionId: "o1",
    explanation:
      "Hicret, bu bağlamda Mekke’den Medine’ye göçün adıdır. Göç eden Müslümanlar muhacir olarak anılır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Hicret",
        url: "https://islamansiklopedisi.org.tr/hicret",
        locator: "Hicret ve muhacir terimlerinin tanımı",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Hicret, bu bağlamda Mekke’den Medine’ye göçün adıdır. Göç eden Müslümanlar muhacir olarak anılır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Terim sorusu; çeldiriciler ilgili tarih kavramları. Açıklamadaki 622 çıkarıldı; history-002 cevabını önceden vermiyor. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "hicret-event",
  },
  {
    id: "history-002",
    version: 2,
    categoryId: "history",
    difficulty: "medium",
    question: "Mekke’den Medine’ye hicret miladi hangi yılda gerçekleşmiştir?",
    options: [
      {
        id: "o1",
        text: "571",
      },
      {
        id: "o2",
        text: "610",
      },
      {
        id: "o3",
        text: "632",
      },
      {
        id: "o4",
        text: "622",
      },
    ],
    correctOptionId: "o4",
    explanation:
      "Bu hicret miladi 622 yılında gerçekleşti. Olayın yılı ile daha sonra kabul edilen hicri takvimin düzenlenme tarihi farklıdır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Hicret",
        url: "https://islamansiklopedisi.org.tr/hicret",
        locator: "Mekke’den Medine’ye hicretin miladi yılı",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Bu hicret miladi 622 yılında gerçekleşti. Olayın yılı ile daha sonra kabul edilen hicri takvimin düzenlenme tarihi farklıdır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Yakın konu: history-001 ile aynı olayın tarihi. İkisi aynı tura alınmaz; kesin gün/ay sorulmuyor. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "hicret-event",
  },
  {
    id: "history-003",
    version: 2,
    categoryId: "history",
    difficulty: "easy",
    question: "Mescid-i Nebevî hangi şehirdedir?",
    options: [
      {
        id: "o1",
        text: "Mekke",
      },
      {
        id: "o2",
        text: "Medine",
      },
      {
        id: "o3",
        text: "Kudüs",
      },
      {
        id: "o4",
        text: "Bağdat",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Mescid-i Nebevî, Medine’de bulunur. İnşasına hicretten sonra başlanmıştır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Mescid-i Nebevî",
        url: "https://islamansiklopedisi.org.tr/mescid-i-nebevi",
        locator: "Giriş, Medine’de hicret sonrası inşa",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Mescid-i Nebevî, Medine’de bulunur. İnşasına hicretten sonra başlanmıştır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Yer ve hicret sonrası inşa destekleniyor; dört şehir seçeneği. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "history-003",
  },
  {
    id: "history-004",
    version: 2,
    categoryId: "history",
    difficulty: "easy",
    question:
      "Hicret edenlere yardım eden Medineli Müslümanlar hangi adla anılır?",
    options: [
      {
        id: "o1",
        text: "Muhacir",
      },
      {
        id: "o2",
        text: "Havari",
      },
      {
        id: "o3",
        text: "Ensar",
      },
      {
        id: "o4",
        text: "Kureyş",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Medineli Müslümanlar, hicret edenlere yardımları sebebiyle ensar adıyla anılır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Ensar",
        url: "https://islamansiklopedisi.org.tr/ensar",
        locator: "Madde tanımı, Medineli Müslümanlar",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Medineli Müslümanlar, hicret edenlere yardımları sebebiyle ensar adıyla anılır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Medineli Müslümanlar kapsamı netleştirildi; Ensar-Muhacir ayrımı. history-007 ile aynı tura alınmaz. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "ensar-muhacir",
  },
  {
    id: "history-005",
    version: 2,
    categoryId: "history",
    difficulty: "easy",
    question: "Hicretten önce Medine’nin adı neydi?",
    options: [
      {
        id: "o1",
        text: "Yesrib",
      },
      {
        id: "o2",
        text: "Tâif",
      },
      {
        id: "o3",
        text: "Hayber",
      },
      {
        id: "o4",
        text: "Basra",
      },
    ],
    correctOptionId: "o1",
    explanation: "Medine’nin hicretten önceki adı Yesrib’dir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Medine",
        url: "https://islamansiklopedisi.org.tr/medine",
        locator: "Şehrin adları, Yesrib",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports: "Medine’nin hicretten önceki adı Yesrib’dir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Yesrib adı destekleniyor; şehir adları korunuyor. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "history-005",
  },
  {
    id: "general-001",
    version: 2,
    categoryId: "general",
    difficulty: "easy",
    question: "Namaz vaktinin geldiğini duyuran özel çağrıya ne denir?",
    options: [
      {
        id: "o1",
        text: "Hutbe",
      },
      {
        id: "o2",
        text: "Ezan",
      },
      {
        id: "o3",
        text: "Kamet",
      },
      {
        id: "o4",
        text: "Vaaz",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Ezan, namaz vaktinin geldiğini bildiren özel çağrıdır. Bu yönüyle vaaz veya hutbe gibi konuşmalardan ayrılır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Ezan",
        url: "https://islamansiklopedisi.org.tr/ezan",
        locator: "Terim tanımı, namaz vaktini duyurma",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Ezan, namaz vaktinin geldiğini bildiren özel çağrıdır. Bu yönüyle vaaz veya hutbe gibi konuşmalardan ayrılır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Vakti bildirme vurgusuyla kametten ayrıldı; ilgili çeldiriciler. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "general-001",
  },
  {
    id: "general-002",
    version: 2,
    categoryId: "general",
    difficulty: "easy",
    question:
      "İslam’da bir ay boyunca tutulan farz oruç hangi hicri ayla ilişkilidir?",
    options: [
      {
        id: "o1",
        text: "Muharrem",
      },
      {
        id: "o2",
        text: "Safer",
      },
      {
        id: "o3",
        text: "Recep",
      },
      {
        id: "o4",
        text: "Ramazan",
      },
    ],
    correctOptionId: "o4",
    explanation:
      "Ramazan ayı farz oruçla ilişkilidir. Bu, yılın diğer zamanlarında hiç oruç tutulmadığı anlamına gelmez.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Ramazan",
        url: "https://islamansiklopedisi.org.tr/ramazan",
        locator: "Ramazan orucu; Bakara 2/185 referansı",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Ramazan ayı farz oruçla ilişkilidir. Bu, yılın diğer zamanlarında hiç oruç tutulmadığı anlamına gelmez.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Oruç yalnız Ramazan’da tutulur anlamı çıkarılmasın diye kapsam netleştirildi. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "general-002",
  },
  {
    id: "general-003",
    version: 2,
    categoryId: "general",
    difficulty: "easy",
    question: "Namazda yönelinen Kâbe hangi şehirdedir?",
    options: [
      {
        id: "o1",
        text: "Medine",
      },
      {
        id: "o2",
        text: "Kudüs",
      },
      {
        id: "o3",
        text: "Mekke",
      },
      {
        id: "o4",
        text: "Şam",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Kâbe, Mekke’dedir. Namazda Kâbe yönüne dönülmesine kıbleye yönelmek denir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Kâbe",
        url: "https://islamansiklopedisi.org.tr/kabe",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        locator: "Kur’an’da Kâbe; Âl-i İmrân 3/96 referansı",
        supports:
          "Kâbe, Mekke’dedir. Namazda Kâbe yönüne dönülmesine kıbleye yönelmek denir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Konum için Kıble yerine doğrudan Kâbe maddesi; dört şehir. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "general-003",
  },
  {
    id: "general-004",
    version: 2,
    categoryId: "general",
    difficulty: "easy",
    question:
      "Belirli şartlarda mal varlığından hak sahiplerine pay ayırmayı gerektiren mali ibadet hangisidir?",
    options: [
      {
        id: "o1",
        text: "Zekât",
      },
      {
        id: "o2",
        text: "Fidye",
      },
      {
        id: "o3",
        text: "Kefaret",
      },
      {
        id: "o4",
        text: "Karz",
      },
    ],
    correctOptionId: "o1",
    explanation:
      "Zekât, şartları oluştuğunda maldan belirli hak sahiplerine ayrılan paydır. Bu soru oranları veya kişisel yükümlülük hesabını konu almaz.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Zekât",
        url: "https://islamansiklopedisi.org.tr/zekat",
        locator: "İlk paragraf, maldan belirli pay tanımı",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Zekât, şartları oluştuğunda maldan belirli hak sahiplerine ayrılan paydır. Bu soru oranları veya kişisel yükümlülük hesabını konu almaz.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Tanıma zorunlu mali ibadet bağlamı eklendi; sadaka sözcüğünün zekâtı da kapsayabildiği dikkate alınarak seçeneklere alınmadı. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "general-004",
  },
  {
    id: "general-005",
    version: 2,
    categoryId: "general",
    difficulty: "easy",
    question:
      "Namaza hazırlıkta belirli organları yıkayıp mesh ederek yapılan temizliğe ne denir?",
    options: [
      {
        id: "o1",
        text: "Tavaf",
      },
      {
        id: "o2",
        text: "Abdest",
      },
      {
        id: "o3",
        text: "İtikâf",
      },
      {
        id: "o4",
        text: "Kıraat",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Abdest, belirli organların yıkanması ve mesh edilmesiyle yapılan temizliğin adıdır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Abdest",
        url: "https://islamansiklopedisi.org.tr/abdest",
        locator: "Tanım ve abdestle ilgili Mâide 5/6 referansı",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Abdest, belirli organların yıkanması ve mesh edilmesiyle yapılan temizliğin adıdır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "Yalnızca abdestin terim tanımı; farz sayısı, sıra ve mezhep ayrıntısı yok. Kaynak kontrolü yapıldı; bağımsız insan editör ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "general-005",
  },
  {
    id: "quran-006",
    version: 1,
    categoryId: "quran",
    difficulty: "medium",
    question:
      "Kur’an ayetlerini açıklayıp yorumlamayı konu alan ilim hangisidir?",
    options: [
      {
        id: "o1",
        text: "Tefsir",
      },
      {
        id: "o2",
        text: "Siyer",
      },
      {
        id: "o3",
        text: "Fıkıh",
      },
      {
        id: "o4",
        text: "Kelâm",
      },
    ],
    correctOptionId: "o1",
    explanation:
      "Tefsir, ayetlerin anlamlarını açıklama ve yorumlama alanıdır. Bu alanda yazılan eserlere de tefsir denir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Tefsir",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/tefsir",
        locator: "Madde tanımı",
        supports:
          "Tefsir, ayetlerin anlamlarını açıklama ve yorumlama alanıdır. Bu alanda yazılan eserlere de tefsir denir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
      {
        title: "TDV İslâm Ansiklopedisi · Siyer ve Megāzî",
        url: "https://islamansiklopedisi.org.tr/siyer-ve-megazi",
        locator: "Madde tanımı ve siyer teriminin kapsamı",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        supports:
          "Siyer, Hz. Muhammed’in hayatını ve tebliğ faaliyetlerini inceler. Kur’an ayetlerini açıklayan alan ise tefsirdir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "siyer-tefsir",
  },
  {
    id: "quran-007",
    version: 1,
    categoryId: "quran",
    difficulty: "easy",
    question:
      "Kur’an’ın Türkçe anlam çevirisi için yaygın olarak hangi terim kullanılır?",
    options: [
      {
        id: "o1",
        text: "Meâl",
      },
      {
        id: "o2",
        text: "Mushaf",
      },
      {
        id: "o3",
        text: "Cüz",
      },
      {
        id: "o4",
        text: "Tecvid",
      },
    ],
    correctOptionId: "o1",
    explanation:
      "Türkçede Kur’an anlam çevirilerine meâl denir. Meâl, Kur’an’ın Arapça metninin kendisiyle aynı şey değildir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Meâl",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/meal",
        locator: "Madde tanımı",
        supports:
          "Türkçede Kur’an anlam çevirilerine meâl denir. Meâl, Kur’an’ın Arapça metninin kendisiyle aynı şey değildir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
      {
        title: "TDV İslâm Ansiklopedisi · Mushaf",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/mushaf",
        locator: "Madde tanımı",
        supports:
          "Mushaf, Kur’an metninin kitap hâlinde bir araya getirilmiş biçimidir. Meâl ise anlam çevirisi için kullanılan terimdir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "meal-mushaf",
  },
  {
    id: "quran-008",
    version: 1,
    categoryId: "quran",
    difficulty: "medium",
    question:
      "Kur’an okurken harflerin çıkış yerlerini ve okuma kurallarını öğreten alan hangisidir?",
    options: [
      {
        id: "o1",
        text: "Hat",
      },
      {
        id: "o2",
        text: "Tefsir",
      },
      {
        id: "o3",
        text: "Tecvid",
      },
      {
        id: "o4",
        text: "Siyer",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Tecvid, harflerin doğru çıkarılması ve okuma kurallarıyla ilgilenir. Yalnız kuralları bilmek kadar uygulama da önemlidir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Tecvid",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/tecvid--kuran",
        locator: "Tanım ve konular, harflerin mahreç ve sıfatları",
        supports:
          "Tecvid, harflerin doğru çıkarılması ve okuma kurallarıyla ilgilenir. Yalnız kuralları bilmek kadar uygulama da önemlidir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "quran-008",
  },
  {
    id: "quran-009",
    version: 1,
    categoryId: "quran",
    difficulty: "easy",
    question:
      "Kur’an metninin iki kapak arasında toplanmış kitap biçimine ne denir?",
    options: [
      {
        id: "o1",
        text: "Meâl",
      },
      {
        id: "o2",
        text: "Mushaf",
      },
      {
        id: "o3",
        text: "Tefsir",
      },
      {
        id: "o4",
        text: "Fihrist",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Mushaf, Kur’an metninin kitap hâlinde bir araya getirilmiş biçimidir. Meâl ise anlam çevirisi için kullanılan terimdir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Mushaf",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/mushaf",
        locator: "Madde tanımı",
        supports:
          "Mushaf, Kur’an metninin kitap hâlinde bir araya getirilmiş biçimidir. Meâl ise anlam çevirisi için kullanılan terimdir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
      {
        title: "TDV İslâm Ansiklopedisi · Meâl",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/meal",
        locator: "Madde tanımı",
        supports:
          "Türkçede Kur’an anlam çevirilerine meâl denir. Meâl, Kur’an’ın Arapça metninin kendisiyle aynı şey değildir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "meal-mushaf",
  },
  {
    id: "quran-010",
    version: 1,
    categoryId: "quran",
    difficulty: "easy",
    question: "Kur’an’ın en uzun suresi hangisidir?",
    options: [
      {
        id: "o1",
        text: "Yâsîn",
      },
      {
        id: "o2",
        text: "Fâtiha",
      },
      {
        id: "o3",
        text: "Kevser",
      },
      {
        id: "o4",
        text: "Bakara",
      },
    ],
    correctOptionId: "o4",
    explanation:
      "En uzun sure Bakara’dır. Mushaf sıralamasında Fâtiha’dan sonra gelir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Bakara Sûresi",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/bakara-suresi",
        locator: "Madde tanımı",
        supports:
          "En uzun sure Bakara’dır. Mushaf sıralamasında Fâtiha’dan sonra gelir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "quran-010",
  },
  {
    id: "quran-011",
    version: 1,
    categoryId: "quran",
    difficulty: "medium",
    question: "Kevser suresi kaç ayetten oluşur?",
    options: [
      {
        id: "o1",
        text: "3",
      },
      {
        id: "o2",
        text: "5",
      },
      {
        id: "o3",
        text: "7",
      },
      {
        id: "o4",
        text: "10",
      },
    ],
    correctOptionId: "o1",
    explanation:
      "Kevser suresi üç ayetten oluşur. Kısalığıyla bilinen bu surenin adı ilk ayetinde geçen kelimeden gelir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Kevser Sûresi",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/kevser-suresi",
        locator: "Giriş, üç ayet bilgisi ve adlandırma",
        supports:
          "Kevser suresi üç ayetten oluşur. Kısalığıyla bilinen bu surenin adı ilk ayetinde geçen kelimeden gelir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "quran-011",
  },
  {
    id: "quran-012",
    version: 1,
    categoryId: "quran",
    difficulty: "easy",
    question: "Kur’an’ın tamamını ezberleyen kişiye ne denir?",
    options: [
      {
        id: "o1",
        text: "Müezzin",
      },
      {
        id: "o2",
        text: "Hattat",
      },
      {
        id: "o3",
        text: "Hâfız",
      },
      {
        id: "o4",
        text: "Müfessir",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Kur’an’ın tamamını ezberleyene hâfız denir. Bu terim, kişinin mesleğinden bağımsız olarak ezber durumunu anlatır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Hâfız",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/hafiz--kuran",
        locator: "Madde tanımı ve ilk paragraf",
        supports:
          "Kur’an’ın tamamını ezberleyene hâfız denir. Bu terim, kişinin mesleğinden bağımsız olarak ezber durumunu anlatır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "quran-012",
  },
  {
    id: "quran-013",
    version: 1,
    categoryId: "quran",
    difficulty: "medium",
    question:
      "Birinin okuduğu Kur’an’ı takip ederek hatim tamamlama geleneğine ne denir?",
    options: [
      {
        id: "o1",
        text: "Mevlid",
      },
      {
        id: "o2",
        text: "Mukabele",
      },
      {
        id: "o3",
        text: "Hutbe",
      },
      {
        id: "o4",
        text: "Vaaz",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Mukabelede okuyanın tilâveti takip edilir. Gelenek özellikle Ramazan ayında camilerde ve evlerde sürdürülür.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Mukabele",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/mukabele--kuran",
        locator: "Tanım ve ilk paragraf",
        supports:
          "Mukabelede okuyanın tilâveti takip edilir. Gelenek özellikle Ramazan ayında camilerde ve evlerde sürdürülür.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "quran-013",
  },
  {
    id: "prophets-006",
    version: 1,
    categoryId: "prophets",
    difficulty: "medium",
    question: "Hz. Yûsuf’un babası olan peygamber kimdir?",
    options: [
      {
        id: "o1",
        text: "Hz. İbrâhim",
      },
      {
        id: "o2",
        text: "Hz. İshak",
      },
      {
        id: "o3",
        text: "Hz. Ya‘kūb",
      },
      {
        id: "o4",
        text: "Hz. Hârûn",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Hz. Yûsuf’un babası Hz. Ya‘kūb’dur. Yûsuf kıssasında oğul ile babanın ilişkisi önemli bir yer tutar.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Yûsuf",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/yusuf",
        locator: "Kur’an’daki kıssa; Yûsuf 12/5–6 referansı",
        supports:
          "Hz. Yûsuf’un babası Hz. Ya‘kūb’dur. Yûsuf kıssasında oğul ile babanın ilişkisi önemli bir yer tutar.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "prophets-006",
  },
  {
    id: "prophets-007",
    version: 1,
    categoryId: "prophets",
    difficulty: "easy",
    question:
      "Hz. Mûsâ’nın kendisine yardımcı olmasını istediği kardeşi kimdir?",
    options: [
      {
        id: "o1",
        text: "Hz. Hârûn",
      },
      {
        id: "o2",
        text: "Hz. İlyâs",
      },
      {
        id: "o3",
        text: "Hz. Yûnus",
      },
      {
        id: "o4",
        text: "Hz. Dâvûd",
      },
    ],
    correctOptionId: "o1",
    explanation:
      "Hz. Mûsâ, kardeşi Hârûn’un görevinde kendisine yardımcı olmasını istemiştir. Bu ilişki Tâhâ suresinde anlatılır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Hârûn",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/harun",
        locator: "Kur’an’da Hârûn; Tâhâ 20/29–36 referansı",
        supports:
          "Hz. Mûsâ, kardeşi Hârûn’un görevinde kendisine yardımcı olmasını istemiştir. Bu ilişki Tâhâ suresinde anlatılır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "prophets-007",
  },
  {
    id: "prophets-008",
    version: 1,
    categoryId: "prophets",
    difficulty: "easy",
    question: "Kur’an’da Hz. Îsâ’nın annesi olarak anılan kişi kimdir?",
    options: [
      {
        id: "o1",
        text: "Âmine",
      },
      {
        id: "o2",
        text: "Hâcer",
      },
      {
        id: "o3",
        text: "Meryem",
      },
      {
        id: "o4",
        text: "Havvâ",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Hz. Îsâ’nın annesi Meryem’dir. Meryem suresinde anne ve oğluyla ilgili anlatı yer alır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Îsâ",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/isa",
        locator: "Kur’an’da Îsâ; Meryem 19/16–33 referansı",
        supports:
          "Hz. Îsâ’nın annesi Meryem’dir. Meryem suresinde anne ve oğluyla ilgili anlatı yer alır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "prophets-008",
  },
  {
    id: "prophets-009",
    version: 1,
    categoryId: "prophets",
    difficulty: "medium",
    question: "Hz. Süleyman’ın babası olan peygamber hangisidir?",
    options: [
      {
        id: "o1",
        text: "Hz. Yûsuf",
      },
      {
        id: "o2",
        text: "Hz. Dâvûd",
      },
      {
        id: "o3",
        text: "Hz. Mûsâ",
      },
      {
        id: "o4",
        text: "Hz. İshak",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Hz. Süleyman, Hz. Dâvûd’un oğludur. Kur’an’da her ikisinin bilgi ve hikmet sahibi oluşundan söz edilir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Süleyman",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/suleyman",
        locator: "İslâm’da bölümü; Neml 27/15–16, Sâd 38/30 referansları",
        supports:
          "Hz. Süleyman, Hz. Dâvûd’un oğludur. Kur’an’da her ikisinin bilgi ve hikmet sahibi oluşundan söz edilir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "prophets-009",
  },
  {
    id: "prophets-010",
    version: 1,
    categoryId: "prophets",
    difficulty: "medium",
    question:
      "Bakara suresindeki anlatımda Hz. İbrâhim, Kâbe’nin temellerini kiminle birlikte yükseltir?",
    options: [
      {
        id: "o1",
        text: "Hz. İshak",
      },
      {
        id: "o2",
        text: "Hz. Ya‘kūb",
      },
      {
        id: "o3",
        text: "Hz. Yûsuf",
      },
      {
        id: "o4",
        text: "Hz. İsmâil",
      },
    ],
    correctOptionId: "o4",
    explanation:
      "Bakara 2/127’de İbrâhim ile İsmâil’in temelleri yükseltmesi anlatılır. Bu soru Kâbe’yi ilk kimin inşa ettiği hakkındaki farklı rivayetleri konu almaz.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Kâbe",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/kabe",
        locator: "Kur’an’da Kâbe; Bakara 2/127 referansı",
        supports:
          "Bakara 2/127’de İbrâhim ile İsmâil’in temelleri yükseltmesi anlatılır. Bu soru Kâbe’yi ilk kimin inşa ettiği hakkındaki farklı rivayetleri konu almaz.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "prophets-010",
  },
  {
    id: "prophets-011",
    version: 1,
    categoryId: "prophets",
    difficulty: "easy",
    question:
      "Kur’an’da bir balık tarafından yutulması anlatılan peygamber kimdir?",
    options: [
      {
        id: "o1",
        text: "Hz. Nûh",
      },
      {
        id: "o2",
        text: "Hz. Yûnus",
      },
      {
        id: "o3",
        text: "Hz. Hûd",
      },
      {
        id: "o4",
        text: "Hz. Sâlih",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Balıkla ilgili kıssa Hz. Yûnus’a aittir. Sâffât suresinde bu olay anlatılır; burada balığın türü veya içeride kalma süresi sorulmaz.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Yûnus",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/yunus",
        locator: "Kur’an’daki anlatı; Sâffât 37/139–142 referansı",
        supports:
          "Balıkla ilgili kıssa Hz. Yûnus’a aittir. Sâffât suresinde bu olay anlatılır; burada balığın türü veya içeride kalma süresi sorulmaz.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "prophets-011",
  },
  {
    id: "prophets-012",
    version: 1,
    categoryId: "prophets",
    difficulty: "medium",
    question: "Hz. Zekeriyyâ’nın oğlu olan peygamber kimdir?",
    options: [
      {
        id: "o1",
        text: "Hz. Yahyâ",
      },
      {
        id: "o2",
        text: "Hz. Îsâ",
      },
      {
        id: "o3",
        text: "Hz. Yûsuf",
      },
      {
        id: "o4",
        text: "Hz. Süleyman",
      },
    ],
    correctOptionId: "o1",
    explanation:
      "Hz. Yahyâ, Hz. Zekeriyyâ’nın oğludur. İkisi de Kur’an’daki peygamber anlatılarında yer alır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Yahyâ",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/yahya",
        locator: "İlk paragraf, Zekeriyyâ’nın oğlu oluşu",
        supports:
          "Hz. Yahyâ, Hz. Zekeriyyâ’nın oğludur. İkisi de Kur’an’daki peygamber anlatılarında yer alır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "prophets-012",
  },
  {
    id: "prophets-013",
    version: 1,
    categoryId: "prophets",
    difficulty: "easy",
    question: "Hz. Muhammed’in ilk eşinin adı nedir?",
    options: [
      {
        id: "o1",
        text: "Hz. Âişe",
      },
      {
        id: "o2",
        text: "Hz. Hafsa",
      },
      {
        id: "o3",
        text: "Hz. Sevde",
      },
      {
        id: "o4",
        text: "Hz. Hatice",
      },
    ],
    correctOptionId: "o4",
    explanation:
      "Hz. Muhammed’in ilk eşi Hz. Hatice’dir. Kaynakta onun ilk vahiy sonrasında verdiği destek de anlatılır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Hatice",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/hatice",
        locator: "Madde tanımı ve ilk vahiy sonrası destek",
        supports:
          "Hz. Muhammed’in ilk eşi Hz. Hatice’dir. Kaynakta onun ilk vahiy sonrasında verdiği destek de anlatılır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "prophets-013",
  },
  {
    id: "history-006",
    version: 1,
    categoryId: "history",
    difficulty: "medium",
    question:
      "Mescid-i Nebevî’de barınma ve eğitimle anılan bölümün adı nedir?",
    options: [
      {
        id: "o1",
        text: "Dârünnedve",
      },
      {
        id: "o2",
        text: "Suffe",
      },
      {
        id: "o3",
        text: "Dârülerkam",
      },
      {
        id: "o4",
        text: "Beytülmâl",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Suffe, kalacak yeri olmayan sahâbîlerin barındığı bölümdü. Zamanla öğrenme ve eğitim faaliyetleriyle de öne çıktı.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Suffe",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/suffe",
        locator: "Giriş ve eğitim kurumu hâline gelişi",
        supports:
          "Suffe, kalacak yeri olmayan sahâbîlerin barındığı bölümdü. Zamanla öğrenme ve eğitim faaliyetleriyle de öne çıktı.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "history-006",
  },
  {
    id: "history-007",
    version: 1,
    categoryId: "history",
    difficulty: "easy",
    question: "Mekke’den Medine’ye göç eden Müslümanlar hangi adla anılır?",
    options: [
      {
        id: "o1",
        text: "Ensar",
      },
      {
        id: "o2",
        text: "Havari",
      },
      {
        id: "o3",
        text: "Muhacir",
      },
      {
        id: "o4",
        text: "Evs",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Bu göçü yapan Müslümanlar muhacir olarak anılır. Onlara yardım eden Medineli Müslümanlar ise ensardır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Hicret",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/hicret",
        locator: "Terim tanımı, muhâcir ve ensâr",
        supports:
          "Bu göçü yapan Müslümanlar muhacir olarak anılır. Onlara yardım eden Medineli Müslümanlar ise ensardır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "ensar-muhacir",
  },
  {
    id: "history-008",
    version: 1,
    categoryId: "history",
    difficulty: "hard",
    question:
      "Medine’de ensar ile muhacirlerden bazıları arasında kurulan kardeşlik bağı hangi terimle anılır?",
    options: [
      {
        id: "o1",
        text: "Biat",
      },
      {
        id: "o2",
        text: "Hicret",
      },
      {
        id: "o3",
        text: "Şûra",
      },
      {
        id: "o4",
        text: "Muâhât",
      },
    ],
    correctOptionId: "o4",
    explanation:
      "Muâhât, kardeş ilân etme anlamına gelir. Medine’de göç edenlerle ev sahipleri arasındaki dayanışmayı güçlendirmiştir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Muâhât",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/muahat",
        locator: "Madde tanımı ve sosyal işlev",
        supports:
          "Muâhât, kardeş ilân etme anlamına gelir. Medine’de göç edenlerle ev sahipleri arasındaki dayanışmayı güçlendirmiştir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "history-008",
  },
  {
    id: "history-009",
    version: 1,
    categoryId: "history",
    difficulty: "hard",
    question:
      "Mekke’de ilk Müslümanların eğitim ve tebliğ için toplandığı ev hangi adla bilinir?",
    options: [
      {
        id: "o1",
        text: "Dârülerkam",
      },
      {
        id: "o2",
        text: "Dârünnedve",
      },
      {
        id: "o3",
        text: "Beytülmâl",
      },
      {
        id: "o4",
        text: "Suffe",
      },
    ],
    correctOptionId: "o1",
    explanation:
      "Erkam b. Ebü’l-Erkam’a ait ev Dârülerkam olarak bilinir. Mekke döneminde öğretim ve tebliğ için kullanılmıştır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Dârülerkam",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/darulerkam",
        locator: "Madde tanımı ve ilk paragraf",
        supports:
          "Erkam b. Ebü’l-Erkam’a ait ev Dârülerkam olarak bilinir. Mekke döneminde öğretim ve tebliğ için kullanılmıştır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "history-009",
  },
  {
    id: "history-010",
    version: 1,
    categoryId: "history",
    difficulty: "medium",
    question:
      "Halife Mansûr’un Abbâsî başşehri olarak kurduğu şehir hangisidir?",
    options: [
      {
        id: "o1",
        text: "Şam",
      },
      {
        id: "o2",
        text: "Kûfe",
      },
      {
        id: "o3",
        text: "Bağdat",
      },
      {
        id: "o4",
        text: "Kahire",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Mansûr, Bağdat’ı başşehir olarak kurdu. Şehrin daire biçimli planı tarihî şehircilik örnekleri arasında yer alır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Bağdat",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/bagdat",
        locator: "Mansûr’un yer seçimi ve daire planlı şehrin kuruluşu",
        supports:
          "Mansûr, Bağdat’ı başşehir olarak kurdu. Şehrin daire biçimli planı tarihî şehircilik örnekleri arasında yer alır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "history-010",
  },
  {
    id: "history-011",
    version: 1,
    categoryId: "history",
    difficulty: "medium",
    question:
      "Muâviye’nin Emevî Devleti için başşehir seçtiği Dımaşk, Türkçede hangi adla bilinir?",
    options: [
      {
        id: "o1",
        text: "Kudüs",
      },
      {
        id: "o2",
        text: "Şam",
      },
      {
        id: "o3",
        text: "Basra",
      },
      {
        id: "o4",
        text: "Kûfe",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Dımaşk, Türkçede Şam olarak bilinir. Muâviye’nin başşehir seçimi şehrin siyasî önemini artırdı.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Şam",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/sam--suriye",
        locator: "İslâmî dönem, Muâviye’nin başşehir seçimi",
        supports:
          "Dımaşk, Türkçede Şam olarak bilinir. Muâviye’nin başşehir seçimi şehrin siyasî önemini artırdı.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "history-011",
  },
  {
    id: "history-012",
    version: 1,
    categoryId: "history",
    difficulty: "hard",
    question:
      "Hicretin resmî takvim başlangıcı kabul edilmesi hangi halife dönemindedir?",
    options: [
      {
        id: "o1",
        text: "Hz. Ebû Bekir",
      },
      {
        id: "o2",
        text: "Hz. Osman",
      },
      {
        id: "o3",
        text: "Hz. Ali",
      },
      {
        id: "o4",
        text: "Hz. Ömer",
      },
    ],
    correctOptionId: "o4",
    explanation:
      "Hicretin takvim başlangıcı kabul edilmesi Hz. Ömer dönemindedir. Kararın ayrıntılı tarihi hakkında kaynaklarda farklı tarihlendirmeler bulunduğundan burada yıl sorulmuyor.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Hicret",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/hicret",
        locator: "Son paragraf, takvim başlangıcının resmî kabulü",
        supports:
          "Hicretin takvim başlangıcı kabul edilmesi Hz. Ömer dönemindedir. Kararın ayrıntılı tarihi hakkında kaynaklarda farklı tarihlendirmeler bulunduğundan burada yıl sorulmuyor.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
      {
        title: "TDV İslâm Ansiklopedisi · Ömer",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/omer",
        locator: "İdari uygulamalar, hicri takvimin kullanılmaya başlanması",
        supports:
          "Takvim kararı Hz. Ömer döneminde; Hicret maddesindeki 638 tarihlemesinden farklı olarak burada 637 verilir. Soruda yıl sorulmaz.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "history-012",
  },
  {
    id: "general-006",
    version: 1,
    categoryId: "general",
    difficulty: "easy",
    question: "Oruca hazırlık için imsak vaktinden önce yenen öğüne ne denir?",
    options: [
      {
        id: "o1",
        text: "İftar",
      },
      {
        id: "o2",
        text: "Sahur",
      },
      {
        id: "o3",
        text: "İkram",
      },
      {
        id: "o4",
        text: "Ziyafet",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Sahur, oruca hazırlık için imsak öncesi yenen yemektir. İftar ise günün sonunda orucu açmayla ilgilidir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Sahur",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/sahur",
        locator: "Madde tanımı",
        supports:
          "Sahur, oruca hazırlık için imsak öncesi yenen yemektir. İftar ise günün sonunda orucu açmayla ilgilidir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
      {
        title: "TDV İslâm Ansiklopedisi · İftar",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/iftar",
        locator: "Tanım, Türkçede orucu açma anlamı",
        supports:
          "Türkçede iftar, vakti gelince orucu açmayı ifade eder. Oruca hazırlık öğünü olan sahurdan farklıdır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "fasting-meals",
  },
  {
    id: "general-007",
    version: 1,
    categoryId: "general",
    difficulty: "easy",
    question:
      "Oruçlunun vakti geldiğinde orucunu açması hangi terimle ifade edilir?",
    options: [
      {
        id: "o1",
        text: "İmsak",
      },
      {
        id: "o2",
        text: "İtikâf",
      },
      {
        id: "o3",
        text: "İftar",
      },
      {
        id: "o4",
        text: "Sahur",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Türkçede iftar, vakti gelince orucu açmayı ifade eder. Oruca hazırlık öğünü olan sahurdan farklıdır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · İftar",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/iftar",
        locator: "Tanım, Türkçede orucu açma anlamı",
        supports:
          "Türkçede iftar, vakti gelince orucu açmayı ifade eder. Oruca hazırlık öğünü olan sahurdan farklıdır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
      {
        title: "TDV İslâm Ansiklopedisi · Sahur",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/sahur",
        locator: "Madde tanımı",
        supports:
          "Sahur, oruca hazırlık için imsak öncesi yenen yemektir. İftar ise günün sonunda orucu açmayla ilgilidir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "fasting-meals",
  },
  {
    id: "general-008",
    version: 1,
    categoryId: "general",
    difficulty: "medium",
    question:
      "Camide kıble yönünü ve imamın duracağı yeri belirten mimari öğe hangisidir?",
    options: [
      {
        id: "o1",
        text: "Mihrap",
      },
      {
        id: "o2",
        text: "Minber",
      },
      {
        id: "o3",
        text: "Minare",
      },
      {
        id: "o4",
        text: "Şadırvan",
      },
    ],
    correctOptionId: "o1",
    explanation:
      "Mihrap, kıble yönünü gösteren mimari öğedir. Hutbe için çıkılan basamaklı bölüm olan minberle karıştırılmamalıdır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Mihrap",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/mihrap",
        locator: "Madde tanımı",
        supports:
          "Mihrap, kıble yönünü gösteren mimari öğedir. Hutbe için çıkılan basamaklı bölüm olan minberle karıştırılmamalıdır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
      {
        title: "TDV İslâm Ansiklopedisi · Minber",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/minber",
        locator: "Madde tanımı ve ilk paragraf",
        supports:
          "Minber, hutbe okumak için çıkılan basamaklı bölümdür. Konuşanın cemaat tarafından görülüp duyulmasına yardımcı olur.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "mosque-furniture",
  },
  {
    id: "general-009",
    version: 1,
    categoryId: "general",
    difficulty: "medium",
    question:
      "Hatibin cuma ve bayram hutbesini okumak için çıktığı basamaklı bölüm hangisidir?",
    options: [
      {
        id: "o1",
        text: "Mihrap",
      },
      {
        id: "o2",
        text: "Mahfil",
      },
      {
        id: "o3",
        text: "Şerefe",
      },
      {
        id: "o4",
        text: "Minber",
      },
    ],
    correctOptionId: "o4",
    explanation:
      "Minber, hutbe okumak için çıkılan basamaklı bölümdür. Konuşanın cemaat tarafından görülüp duyulmasına yardımcı olur.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Minber",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/minber",
        locator: "Madde tanımı ve ilk paragraf",
        supports:
          "Minber, hutbe okumak için çıkılan basamaklı bölümdür. Konuşanın cemaat tarafından görülüp duyulmasına yardımcı olur.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "mosque-furniture",
  },
  {
    id: "general-010",
    version: 1,
    categoryId: "general",
    difficulty: "medium",
    question:
      "Bir malın gelirini sürekli bir hayır amacına ayıran kuruma ne denir?",
    options: [
      {
        id: "o1",
        text: "Kervansaray",
      },
      {
        id: "o2",
        text: "Lonca",
      },
      {
        id: "o3",
        text: "Vakıf",
      },
      {
        id: "o4",
        text: "Divan",
      },
    ],
    correctOptionId: "o3",
    explanation:
      "Vakıf, ayrılan malın yararını belirlenen amaca sürekli sunmayı esas alır. Eğitim ve sağlık gibi hizmetler tarih boyunca vakıflarla desteklenmiştir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Vakıf",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/vakif",
        locator: "Vakıf sistemi, hayra tahsis ve süreklilik",
        supports:
          "Vakıf, ayrılan malın yararını belirlenen amaca sürekli sunmayı esas alır. Eğitim ve sağlık gibi hizmetler tarih boyunca vakıflarla desteklenmiştir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "general-010",
  },
  {
    id: "general-011",
    version: 1,
    categoryId: "general",
    difficulty: "medium",
    question:
      "Arap harflerini estetik ölçülerle güzel yazma sanatına ne denir?",
    options: [
      {
        id: "o1",
        text: "Tezhip",
      },
      {
        id: "o2",
        text: "Hat",
      },
      {
        id: "o3",
        text: "Minyatür",
      },
      {
        id: "o4",
        text: "Ebru",
      },
    ],
    correctOptionId: "o2",
    explanation:
      "Hat, Arap yazısını estetik ölçülerle güzel yazma sanatıdır. Bu sanatı icra eden kişiye hattat denir.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Hat",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/hat",
        locator: "Tarihçe, terim tanımı",
        supports:
          "Hat, Arap yazısını estetik ölçülerle güzel yazma sanatıdır. Bu sanatı icra eden kişiye hattat denir.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "general-011",
  },
  {
    id: "general-012",
    version: 1,
    categoryId: "general",
    difficulty: "medium",
    question:
      "Ramazan’da iki minare arasına kurulan ışıklı yazı düzenine ne denir?",
    options: [
      {
        id: "o1",
        text: "Mahya",
      },
      {
        id: "o2",
        text: "Alem",
      },
      {
        id: "o3",
        text: "Şerefe",
      },
      {
        id: "o4",
        text: "Kavsara",
      },
    ],
    correctOptionId: "o1",
    explanation:
      "Mahya, minareler arasında ışıklarla oluşturulan yazı veya resim düzenidir. Özellikle Ramazan geleneğiyle tanınır.",
    sources: [
      {
        title: "TDV İslâm Ansiklopedisi · Mahya",
        publisher: "TDV İslâm Araştırmaları Merkezi",
        url: "https://islamansiklopedisi.org.tr/mahya--ramazan",
        locator: "Madde tanımı",
        supports:
          "Mahya, minareler arasında ışıklarla oluşturulan yazı veya resim düzenidir. Özellikle Ramazan geleneğiyle tanınır.",
        checkedAt: "2026-10-18",
        checkStatus: "supported",
      },
    ],
    reviewStatus: "draft",
    reviewNotes:
      "İlgili kaynak bölümü okunarak olgu eşleştirildi; bağımsız insan editör, çeldirici ve yayın onayı bekleniyor.",
    updatedAt: "2026-10-18",
    conceptGroup: "general-012",
  },
] as const satisfies readonly Question[];
