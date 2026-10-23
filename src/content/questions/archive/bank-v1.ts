export type CategoryId = "quran" | "prophets" | "history" | "general";
export type ReviewStatus = "draft" | "reviewed" | "approved";
export interface Question {
  id: string;
  category: CategoryId;
  difficulty: "easy" | "medium";
  text: string;
  options: readonly [string, string, string, string];
  correct: number;
  explanation: string;
  source: { title: string; url: string; locator: string };
  version: number;
  reviewStatus: ReviewStatus;
  updatedAt: string;
}
export const BANK_VERSION = 1;
export const categories = [
  {
    id: "quran",
    title: "Kur’an",
    subtitle: "Yapısı ve temel kavramlar",
    icon: "book-open",
  },
  {
    id: "prophets",
    title: "Peygamberler",
    subtitle: "Hayatlar ve siyer",
    icon: "sunrise",
  },
  {
    id: "history",
    title: "İslam Tarihi",
    subtitle: "Bir yolculuğun izinde",
    icon: "map",
  },
  {
    id: "general",
    title: "Genel Bilgi",
    subtitle: "Kavramlar ve temel bilgiler",
    icon: "sun",
  },
] as const;
const tdv = (slug: string, title: string, locator: string) => ({
  title: `TDV İslâm Ansiklopedisi · ${title}`,
  url: `https://islamansiklopedisi.org.tr/${slug}`,
  locator,
});
const structure = {
  title: "TÜBİTAK Ansiklopedi · Kur’ân-ı Kerîm",
  url: "https://ansiklopedi.tubitak.gov.tr/ansiklopedi/kuran_i_kerim",
  locator: "Mushafın tertibi, sûre ve cüz yapısı",
};
type Entry = Omit<
  Question,
  "version" | "reviewStatus" | "updatedAt" | "difficulty"
>;
const entries: Entry[] = [
  {
    id: "quran-001",
    category: "quran",
    text: "Kur’an’da kaç sure vardır?",
    options: ["30", "114", "99", "7"],
    correct: 1,
    explanation:
      "Kur’an-ı Kerim 114 sureden oluşur. Sureler farklı uzunluklarda bölümlerdir.",
    source: structure,
  },
  {
    id: "quran-002",
    category: "quran",
    text: "Mushaf sıralamasında ilk sure hangisidir?",
    options: ["Nâs", "İhlâs", "Fâtiha", "Kevser"],
    correct: 2,
    explanation:
      "Mushaf, Fâtiha suresiyle başlar. Burada sorulan, vahyin geliş sırası değil, kitaptaki sıralamadır.",
    source: structure,
  },
  {
    id: "quran-003",
    category: "quran",
    text: "Kur’an kaç cüze ayrılmıştır?",
    options: ["20", "40", "114", "30"],
    correct: 3,
    explanation:
      "Kur’an 30 cüze ayrılır. Cüz, okumayı bölümlere ayırmaya yardımcı olan bir birimdir.",
    source: structure,
  },
  {
    id: "quran-004",
    category: "quran",
    text: "Mushaf sıralamasında son sure hangisidir?",
    options: ["Nâs", "Bakara", "Fâtiha", "Yâsîn"],
    correct: 0,
    explanation: "Mushaf sıralamasında 114. ve son sure Nâs suresidir.",
    source: structure,
  },
  {
    id: "quran-005",
    category: "quran",
    text: "Kur’an’da ayetlerden oluşan bölümlere ne denir?",
    options: ["Cilt", "Sure", "Sayfa", "Dizin"],
    correct: 1,
    explanation: "Ayetlerin bir araya geldiği bağımsız bölümlere sure denir.",
    source: structure,
  },
  {
    id: "prophets-001",
    category: "prophets",
    text: "Hz. Muhammed hangi şehirde doğmuştur?",
    options: ["Medine", "Kudüs", "Mekke", "Şam"],
    correct: 2,
    explanation:
      "Hz. Muhammed Mekke’de doğmuştur. Çocukluk ve gençlik yılları da bu şehirde geçmiştir.",
    source: tdv("muhammed", "Muhammed", "Doğumu, çocukluğu ve gençliği"),
  },
  {
    id: "prophets-002",
    category: "prophets",
    text: "Hz. Muhammed’in annesinin adı nedir?",
    options: ["Âmine", "Havvâ", "Meryem", "Hâcer"],
    correct: 0,
    explanation: "Hz. Muhammed’in annesi Âmine bint Vehb’dir.",
    source: tdv("muhammed", "Muhammed", "Ailesi ve doğumu"),
  },
  {
    id: "prophets-003",
    category: "prophets",
    text: "Tufan ve gemi kıssasıyla anılan peygamber kimdir?",
    options: ["Hz. Yûsuf", "Hz. Dâvûd", "Hz. Süleyman", "Hz. Nûh"],
    correct: 3,
    explanation:
      "Hz. Nûh, Kur’an’da tufan ve gemi kıssasıyla anlatılan peygamberdir.",
    source: tdv("nuh", "Nûh", "Kur’an’da Nûh kıssası"),
  },
  {
    id: "prophets-004",
    category: "prophets",
    text: "Hz. Muhammed’in hayatını konu alan alana ne denir?",
    options: ["Coğrafya", "Siyer", "Hat sanatı", "Astronomi"],
    correct: 1,
    explanation: "Siyer, Hz. Muhammed’in hayatını ele alan ilim dalıdır.",
    source: tdv("siyer-ve-megazi", "Siyer ve Megāzî", "Terimin tanımı"),
  },
  {
    id: "prophets-005",
    category: "prophets",
    text: "İlk vahyin geldiği mağaranın adı nedir?",
    options: ["Sevr", "Ashâb-ı Kehf", "Hira", "İnsuyu"],
    correct: 2,
    explanation:
      "İlk vahyin gelişi, Mekke yakınlarındaki Hira mağarasıyla ilişkilidir.",
    source: tdv("hira", "Hira", "İlk vahiy"),
  },
  {
    id: "history-001",
    category: "history",
    text: "Hz. Muhammed’in Mekke’den Medine’ye göçüne ne denir?",
    options: ["Hicret", "Ticaret", "Seyahat", "Ziyaret"],
    correct: 0,
    explanation:
      "622 yılında gerçekleşen Mekke’den Medine’ye göç, hicret adıyla anılır.",
    source: tdv("hicret", "Hicret", "Mekke’den Medine’ye hicret"),
  },
  {
    id: "history-002",
    category: "history",
    text: "Mekke’den Medine’ye hicret miladi hangi yılda gerçekleşmiştir?",
    options: ["571", "610", "632", "622"],
    correct: 3,
    explanation: "Mekke’den Medine’ye hicretin miladi yılı 622’dir.",
    source: tdv("hicret", "Hicret", "Hicretin tarihi"),
  },
  {
    id: "history-003",
    category: "history",
    text: "Mescid-i Nebevî hangi şehirdedir?",
    options: ["Mekke", "Medine", "Kudüs", "Bağdat"],
    correct: 1,
    explanation:
      "Mescid-i Nebevî, Medine’de bulunur. İnşasına hicretten sonra başlanmıştır.",
    source: tdv("mescid-i-nebevi", "Mescid-i Nebevî", "Konumu ve inşası"),
  },
  {
    id: "history-004",
    category: "history",
    text: "Hicret eden Müslümanlara yardım eden Medineliler hangi adla anılır?",
    options: ["Kâtipler", "Seyyahlar", "Ensar", "Tüccarlar"],
    correct: 2,
    explanation:
      "Medineli Müslümanlar, hicret edenlere yardımları sebebiyle ensar adıyla anılır.",
    source: tdv("ensar", "Ensar", "Terimin tanımı"),
  },
  {
    id: "history-005",
    category: "history",
    text: "Hicretten önce Medine’nin adı neydi?",
    options: ["Yesrib", "Tâif", "Hayber", "Basra"],
    correct: 0,
    explanation: "Medine’nin hicretten önceki adı Yesrib’dir.",
    source: tdv("medine", "Medine", "Şehrin adları"),
  },
  {
    id: "general-001",
    category: "general",
    text: "Namaz için yapılan çağrıya ne denir?",
    options: ["Hutbe", "Ezan", "Sohbet", "Vaaz"],
    correct: 1,
    explanation:
      "Ezan, namaz vaktini bildiren ve namaza çağıran özel çağrıdır.",
    source: tdv("ezan", "Ezan", "Tanım"),
  },
  {
    id: "general-002",
    category: "general",
    text: "Oruç ibadetiyle özdeşleşen hicri ay hangisidir?",
    options: ["Muharrem", "Safer", "Recep", "Ramazan"],
    correct: 3,
    explanation: "Ramazan, oruç ibadetiyle özdeşleşen hicri aydır.",
    source: tdv("ramazan", "Ramazan", "Ramazan ayı ve oruç"),
  },
  {
    id: "general-003",
    category: "general",
    text: "Namazda yönelinen Kâbe hangi şehirdedir?",
    options: ["Medine", "Kudüs", "Mekke", "Konya"],
    correct: 2,
    explanation:
      "Kâbe, Mekke’dedir. Namazda Kâbe yönüne dönülmesine kıbleye yönelmek denir.",
    source: tdv("kible", "Kıble", "Kâbe’ye yönelme"),
  },
  {
    id: "general-004",
    category: "general",
    text: "Belirli şartlarla maldan pay ayırıp hak sahiplerine vermeye ne denir?",
    options: ["Zekât", "Seyahat", "Kıraat", "Hitabet"],
    correct: 0,
    explanation:
      "Zekât, belirli şartlarla maldan pay ayırıp hak sahiplerine vermeyi ifade eder. Bu soru, oran veya mezhebe özgü hüküm içermez.",
    source: tdv("zekat", "Zekât", "Tanım"),
  },
  {
    id: "general-005",
    category: "general",
    text: "Namaza hazırlıkta belirli organları yıkayıp mesh ederek yapılan temizliğe ne denir?",
    options: ["Tavaf", "Abdest", "İtikâf", "Kıraat"],
    correct: 1,
    explanation:
      "Abdest, belirli organların yıkanması ve mesh edilmesiyle yapılan temizliğin adıdır.",
    source: tdv("abdest", "Abdest", "Tanım"),
  },
];
// Kaynak kontrolü editoryal onay değildir. Bu banka yalnızca prototipte kullanılır.
export const questions: readonly Question[] = entries.map((entry) => ({
  ...entry,
  difficulty: "easy",
  version: 1,
  reviewStatus: "draft",
  updatedAt: "2026-10-18",
}));
export const questionById = new Map(questions.map((q) => [q.id, q]));
export const categoryName = (id: CategoryId) =>
  categories.find((c) => c.id === id)!.title;
