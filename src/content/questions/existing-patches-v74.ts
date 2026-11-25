// Staged editorial corrections only; the active v73 bank remains unchanged.
export const existingQuestionPatches = [
  {
    id: "e150-prophets-024",
    reason:
      "Stem lacks the narrative/verse context needed to single out the throne.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "Neml 27/38–42; physical PDF page 401 and surrounding context",
    question:
      "Neml 27/40’ta Hz. Süleyman, yanı başına yerleşmiş olarak neyi görür?",
  },
  {
    id: "v12-prophets-006",
    reason:
      "The keyed option adds 'deep' to water, beyond the source's statement.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "Neml 27/44; physical PDF page 401",
    correctOptionText: "Bir su birikintisi",
  },
  {
    id: "q44-leyl-12",
    reason: "Stem asks who, while every answer option names an action.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "Leyl 92/12; physical PDF page 647",
    question: "Leyl 92/12’de Allah’a ait olduğu bildirilen hangi eylemdir?",
  },
  {
    id: "q65-isra-30",
    reason: "Stem asks who, while all options are paired actions.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "17/30; PDF page 298",
    question:
      "İsrâ 17/30’da Allah’ın rızık üzerindeki tasarrufu hangi iki fiille anlatılır?",
  },
  {
    id: "q55-tekvir-008",
    reason:
      "Stem omits cennet, although all options describe a change in its state.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "81/13; PDF page 634",
    question: "Tekvîr 81/13’te cennetin hangi durumu anlatılır?",
  },
  {
    id: "q47-bedir-006",
    reason:
      "The stated reconnaissance assignment concerned the caravan, not the previously unknown army.",
    source: "https://islamansiklopedisi.org.tr/bedir-gazvesi",
    locator:
      "Paragraph beginning Öte yandan Bedir yakınında; following paragraph explains they did not yet know of the army.",
    question:
      "Bedir kuyularına kervan hakkında bilgi toplamak üzere gönderilenler arasında hangisi vardır?",
  },
  {
    id: "q71-kurban-kalb",
    reason:
      "General wording about worship purpose overlaps with sincerity; source gives a precise legal intention requirement.",
    source: "https://islamansiklopedisi.org.tr/kurban#2-islamda-kurban",
    locator: "Geçerlilik Şartları, point 6 (niyet)",
    question:
      "Kurbanın geçerliliğinde ibadet kastı taşımasını sağlayan ve kalpte bulunması yeterli olan şart hangisidir?",
  },
  {
    id: "q62-arafat-arefe",
    reason:
      "The day-nine answer is sound, but the explanation states a noon start without qualifying the legal school; TDV Vakfe records Hanbeli dawn and majority noon.",
    source: "https://islamansiklopedisi.org.tr/vakfe",
    locator: "Zamanı: 108–109",
    explanation:
      "Arafat vakfesi arefe günü, yani zilhiccenin dokuzuncu günü başlar. Başlangıç saati çoğunluğa göre zeval, Hanbelîlere göre fecirdir; vakfe süresi bayramın ilk günü fecre kadar devam eder.",
  },
  {
    id: "q68-nesai-vefat",
    reason:
      "TDV prefers 915 but also records an alternative 916 chronology; absolute wording hides the source preference.",
    source: "https://islamansiklopedisi.org.tr/nesai",
    locator: "102–104",
    question:
      "TDV’nin daha güvenilir kabul ettiği İbn Yûnus rivayetine göre Nesâî hangi milâdî yılda vefat etmiştir?",
    explanation:
      "TDV maddesi, İbn Yûnus’un 303/915 tarihini verdiği rivayetin Zehebî tarafından daha güvenilir görüldüğünü belirtir. Aynı maddede 916 tarihini veren başka bir rivayet de yer alır.",
  },
  {
    id: "q47-nuh-022",
    reason:
      "The verse is verified but the additional claim that the linked TDV biography explains this specific attribute was not found in its Quran section. Remove the unnecessary attribution.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "17/3; PDF295",
    explanation:
      "İsrâ 17/3, Nûh’u çok şükreden bir kul olarak anar. Sorudaki nitelik doğrudan bu âyetin ifadesine dayanır.",
  },
  {
    id: "v11-quran-005",
    reason:
      "The chronology gloss goes beyond the directly checked verse; retain the directly supported teaching without asserting one interpretation as exhaustive.",
    source: "https://islamansiklopedisi.org.tr/kadir-gecesi",
    locator: "111,115; Kadr97/1 and Bakara2/185",
    explanation:
      "Kadr 97/1, Kur’an’ın Kadir gecesinde indirildiğini bildirir. Bakara 2/185 de Kur’an’ın indirilişini ramazan ayıyla ilişkilendirir.",
  },
  {
    id: "q45-ibnsina-kitap",
    reason:
      "Number of constituent books in a specific medical work is specialist bibliographic recall, not introductory Islamic knowledge.",
    difficulty: "hard",
  },
  {
    id: "q48-hatice-040",
    reason:
      "Identifying a previous spouse by tribal nisba is a narrow biographical detail.",
    difficulty: "hard",
  },
  {
    id: "q48-ebu-hureyre-027",
    reason:
      "Asks the exact name form used by an encyclopedia heading, rather than a widely known religious concept.",
    difficulty: "hard",
  },
  {
    id: "q51-muahat-009",
    reason:
      "Exact house associated with one narrated event requires detailed siyer knowledge.",
    difficulty: "hard",
  },
  {
    id: "q47-teyemmum-046",
    reason:
      "A named jurist's ruling about a particular uncoated surface is a school-specific legal detail; it should not be in the beginner pool.",
    difficulty: "medium",
  },
  {
    id: "q45-cezeri-saat",
    reason:
      "The contents of the first section of a named technical treatise require knowledge beyond the basic figure and field.",
    difficulty: "medium",
  },
  {
    id: "q48-esma-001",
    reason:
      "Precise equipment in an account of migration preparations is an event detail, not basic migration knowledge.",
    difficulty: "medium",
  },
  {
    id: "q70-safii-dogum",
    reason:
      "Preferred birth location in a scholarly biography exceeds an introductory recognition question.",
    difficulty: "medium",
  },
  {
    id: "q70-gazzali-dogum",
    reason:
      "Exact Horasan birthplace is a biographical detail rather than a basic religious concept.",
    difficulty: "medium",
  },
  {
    id: "q60-haram-konum",
    reason:
      "The origin city of a minbar installed under Muawiya is a narrow architectural-history detail.",
    difficulty: "hard",
  },
  {
    id: "q52-vakif-002",
    reason:
      "A named jurist's formulation of waqf requires jurisprudential distinctions beyond the basic definition.",
    difficulty: "medium",
  },
  {
    id: "q58-suleym-anne",
    reason:
      "A particular child's narrated tahnik event combines uncommon biography and technical vocabulary.",
    difficulty: "medium",
  },
  {
    id: "q64-bedir-muhacir",
    reason: "Exact contingent count is specialist historical recall.",
    difficulty: "hard",
  },
  {
    id: "q64-bedir-at",
    reason:
      "An exact equipment count in one expedition is not basic religious knowledge.",
    difficulty: "hard",
  },
  {
    id: "q48-esma-004",
    reason:
      "Exact number of sons in a companion biography is obscure numerical recall.",
    difficulty: "hard",
  },
  {
    id: "q58-esma-kunye",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/ciltcilik",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 126,129 (basılı sayfa numarası değildir)",
    question:
      "Klasik ciltte arka kapağa bağlı olup kitapla ön kapak arasına giren üçgen uçlu bölüm hangisidir?",
    explanation:
      "Mikleb, cildin uzantısıdır ve okunacak yeri bulmaya da yardımcı olabilir.",
    difficulty: "hard",
    conceptGroup: "v74-binding-mikleb-flap",
    options: [
      {
        id: "o1",
        text: "Mikleb",
      },
      {
        id: "o2",
        text: "Şîrâze",
      },
      {
        id: "o3",
        text: "Şemse",
      },
      {
        id: "o4",
        text: "Köşebent",
      },
    ],
  },
  {
    id: "q47-bedir-001",
    reason:
      "The specific caravan commander is an event detail beyond introductory Islamic concepts.",
    difficulty: "medium",
  },
  {
    id: "history-008",
    reason:
      "The basic muahat definition is a standard Medinan social-history concept, not advanced specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q69-enesbmalik-anne",
    reason:
      "Identifying a named companion’s brother is detailed biography rather than introductory Islamic knowledge.",
    difficulty: "medium",
  },
  {
    id: "q49-taberi-009",
    reason:
      "Identifying the author of a specifically named classical chronicle requires historical reading beyond beginner facts.",
    difficulty: "medium",
  },
  {
    id: "q71-sure-114",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve the original historical ID/key/option IDs. The earlier same-fact record remains.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "13/17; physical PDF 262",
    question:
      "Ra‘d 13/17’de hak ile bâtıl anlatılırken köpük ve faydalı olan için hangi karşılaştırma yapılır?",
    explanation:
      "Âyette su ve maden üzerindeki köpük örneklenir; geçip giden köpüğe karşı insanlara faydalı olanın kalıcılığı vurgulanır.",
    difficulty: "medium",
    conceptGroup: "v74-foam-goes-benefit-remains",
    options: [
      {
        id: "o1",
        text: "Köpük gider, insanlara faydalı olan kalır",
      },
      {
        id: "o2",
        text: "Köpük kalır, faydalı olan hemen yok olur",
      },
      {
        id: "o3",
        text: "Köpük ile faydalı olan aynı değerde gösterilir",
      },
      {
        id: "o4",
        text: "Yalnız köpüğün kalıcı olduğu anlatılır",
      },
    ],
  },
  {
    id: "q71-mushaf-ilk",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve the original historical ID/key/option IDs. The earlier same-fact record remains.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "16/78; physical PDF 288",
    question:
      "Nahl 16/78’de insanın doğumuyla ilgili anlatımda, şükretmesi için kendisine verilenler hangi gruptur?",
    explanation:
      "Âyet, insanın doğumda bir şey bilmediğini belirtir; verilen kulak, göz ve kalpleri anarak şükre çağırır.",
    difficulty: "medium",
    conceptGroup: "v74-newborn-hearing-sight-hearts",
    options: [
      {
        id: "o1",
        text: "Kulaklar, gözler ve kalpler",
      },
      {
        id: "o2",
        text: "Yalnız mal, mülk ve saltanat",
      },
      {
        id: "o3",
        text: "Yalnız soy, unvan ve makam",
      },
      {
        id: "o4",
        text: "Yalnız yol, ev ve binek",
      },
    ],
  },
  {
    id: "e150-general-005",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and the full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/vacip--fikih",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 120 (basılı sayfa numarası değildir)",
    question:
      "Vaktinde eksik biçimde yapılan bir ibadeti yine aynı vakit içinde tam olarak tekrar yerine getirmeye ne denir?",
    explanation:
      "TDV, vaktinde yapılan ibadetin yine vakti içinde tam olarak tekrarlanmasını iade diye adlandırır; vaktinden sonraki kazâdan ayırır.",
    difficulty: "medium",
    conceptGroup: "v74-repeat-within-time-iadah",
    options: [
      {
        id: "o1",
        text: "Edâ",
      },
      {
        id: "o2",
        text: "İade",
      },
      {
        id: "o3",
        text: "Kazâ",
      },
      {
        id: "o4",
        text: "Kefâret",
      },
    ],
  },
  {
    id: "v12-general-009",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and the full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/istibra-ve-istinca",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96-105 (basılı sayfa numarası değildir)",
    question:
      "Tuvaletten sonra akıntının sona erdiğinden emin olmak için uygun biçimde beklemeye ne denir?",
    explanation:
      "İstibrâ, akıntının tamamen kesildiğini anlamayla ilgilidir; kalıntıları temizleme anlamındaki istincâdan ayrılır. TDV aşırı şüphe ve vesveseden kaçınılmasını da vurgular.",
    difficulty: "medium",
    conceptGroup: "v74-istibra-flow-finished",
    options: [
      {
        id: "o2",
        text: "İstibrâ",
      },
      {
        id: "o1",
        text: "İstincâ",
      },
      {
        id: "o3",
        text: "İstihâre",
      },
      {
        id: "o4",
        text: "İstiskā",
      },
    ],
  },
  {
    id: "q62-tavaf-sayisi",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and the full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/hac",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 465 (basılı sayfa numarası değildir)",
    question: "Hac takviminde “terviye günü” olarak anılan gün hangisidir?",
    explanation:
      "TDV Hac maddesi, hac için yeniden ihrama girilen günün anlatımında zilhiccenin sekizinci gününü terviye olarak adlandırır.",
    difficulty: "hard",
    conceptGroup: "v74-tarwiyah-eighth-dhul-hijjah",
    options: [
      {
        id: "o1",
        text: "Zilhiccenin dokuzuncu günü",
      },
      {
        id: "o2",
        text: "Zilhiccenin onuncu günü",
      },
      {
        id: "o3",
        text: "Zilhiccenin sekizinci günü",
      },
      {
        id: "o4",
        text: "Zilhiccenin on üçüncü günü",
      },
    ],
  },
  {
    id: "e150-general-007",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and the full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/kamet",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 70-71 (basılı sayfa numarası değildir)",
    question:
      "Farz namazın başlamak üzere olduğunu belirli sözlerle duyurmaya ne denir?",
    explanation:
      "Kāmet, farz namazın başlayacağını duyuran çağrıdır. Ezanın vaktin geldiğini bildiren çağrısıyla aynı terim değildir.",
    difficulty: "easy",
    conceptGroup: "v74-iqamah-prayer-about-to-start",
    options: [
      {
        id: "o1",
        text: "Hutbe",
      },
      {
        id: "o3",
        text: "Telbiye",
      },
      {
        id: "o4",
        text: "Salâ",
      },
      {
        id: "o2",
        text: "Kāmet",
      },
    ],
  },
  {
    id: "v11-general-004",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and the full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/teheccud",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 71,96-100 (basılı sayfa numarası değildir)",
    question:
      "Yatsı ile fecr-i sâdık arasında bir süre uyuyup kalkınca kılınan nâfile namaz hangi adla anılır?",
    explanation:
      "TDV, teheccüdü bir miktar uyuduktan sonra kılınan gece namazı olarak açıklar; genel anlamdaki gece namazlarıyla ilişkisini de ele alır.",
    difficulty: "medium",
    conceptGroup: "v74-tahajjud-after-sleep",
    options: [
      {
        id: "o1",
        text: "Kuşluk",
      },
      {
        id: "o2",
        text: "Teheccüd",
      },
      {
        id: "o3",
        text: "İstiskā",
      },
      {
        id: "o4",
        text: "Tahiyyetü’l-mescid",
      },
    ],
  },
  {
    id: "v11-general-006",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and the full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/kunut",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 71,96-98 (basılı sayfa numarası değildir)",
    question:
      "Fıkıh terimi olarak namaz içinde Allah’a dua ve sığınmayı anlatan kavram hangisidir?",
    explanation:
      "Kunut, namaz içindeki dua ve Allah’a yönelişi ifade eder. Hangi namazda ve nerede yapılacağı mezheplere göre değiştiğinden tek bir uygulama bütün mezheplere mal edilmez.",
    difficulty: "medium",
    conceptGroup: "v74-qunut-prayer-supplication",
    options: [
      {
        id: "o1",
        text: "Kāmet",
      },
      {
        id: "o2",
        text: "Kunut",
      },
      {
        id: "o3",
        text: "Telbiye",
      },
      {
        id: "o4",
        text: "Hutbe",
      },
    ],
  },
  {
    id: "v11-general-008",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and the full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/hac",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 460-461 (basılı sayfa numarası değildir)",
    question: "Safâ ile Merve arasındaki sa‘yin yapıldığı alana ne denir?",
    explanation:
      "TDV, sa‘y mekânını mes‘â olarak adlandırır; Kâbe çevresindeki tavaf alanı için kullanılan metâfla karıştırılmaz.",
    difficulty: "medium",
    conceptGroup: "v74-masaa-say-location",
    options: [
      {
        id: "o2",
        text: "Mes‘â",
      },
      {
        id: "o1",
        text: "Metâf",
      },
      {
        id: "o3",
        text: "Mültezem",
      },
      {
        id: "o4",
        text: "Makām-ı İbrâhim",
      },
    ],
  },
  {
    id: "e150-general-032",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and the full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/hac",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 460-461 (basılı sayfa numarası değildir)",
    question:
      "Sa‘y sırasında işaretli bölümde koşar gibi daha hızlı gitme uygulamasına ne ad verilir?",
    explanation:
      "TDV Hac maddesi, Safâ’dan Merve’ye ilerleyişte işaretli bölümdeki hızlı gidişi hervele diye adlandırır. Diğer seçenekler farklı hac uygulamalarını anlatır.",
    difficulty: "hard",
    conceptGroup: "v74-harwalah-say-brisk-section",
    options: [
      {
        id: "o4",
        text: "Remel",
      },
      {
        id: "o2",
        text: "Hervele",
      },
      {
        id: "o1",
        text: "Iztıbâ‘",
      },
      {
        id: "o3",
        text: "İstilâm",
      },
    ],
  },
  {
    id: "v11-general-009",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/mubah",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96,102 (basılı sayfa numarası değildir)",
    question:
      "Dinen yapıp yapmamakta serbest bırakılan davranışın hükmü hangisidir?",
    explanation:
      "Mubah, yapılması veya yapılmaması yönünde bağlayıcı bir talep bulunmayan fiildir.",
    difficulty: "easy",
    conceptGroup: "v74-mubah-permitted-choice",
    options: [
      {
        id: "o3",
        text: "Haram",
      },
      {
        id: "o4",
        text: "Farz",
      },
      {
        id: "o2",
        text: "Mubah",
      },
      {
        id: "o1",
        text: "Mekruh",
      },
    ],
  },
  {
    id: "q58-tefsir-tanim",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/mendup",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96,98-102 (basılı sayfa numarası değildir)",
    question:
      "Fıkıh usulünde yapılması istenen, fakat bu istek kesin ve bağlayıcı olmayan fiile ne denir?",
    explanation:
      "Mendup tavsiye edilen davranıştır; sırf terk edilmesine farzın terki gibi ceza bağlanmaz.",
    difficulty: "medium",
    conceptGroup: "v74-mandub-recommended-not-binding",
    options: [
      {
        id: "o1",
        text: "Mendup",
      },
      {
        id: "o2",
        text: "Farz",
      },
      {
        id: "o3",
        text: "Haram",
      },
      {
        id: "o4",
        text: "Mubah",
      },
    ],
  },
  {
    id: "v11-general-001",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/mekruh",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 98,102 (basılı sayfa numarası değildir)",
    question:
      "Fıkıh usulünün genel beşli tasnifinde yapılmaması kesin ve bağlayıcı olmadan istenen fiil hangisidir?",
    explanation:
      "Genel usul tanımı mekruhu bağlayıcı olmayan sakındırmayla açıklar; Hanefîlerin tahrîmen mekruh ayrımı ayrıca değerlendirilir.",
    difficulty: "medium",
    conceptGroup: "v74-makruh-nonbinding-avoidance",
    options: [
      {
        id: "o3",
        text: "Farz",
      },
      {
        id: "o4",
        text: "Mendup",
      },
      {
        id: "o2",
        text: "Mekruh",
      },
      {
        id: "o1",
        text: "Mubah",
      },
    ],
  },
  {
    id: "v13-general-003",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/azimet",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 97-100 (basılı sayfa numarası değildir)",
    question:
      "Geçici mazeretlere bağlı olmadan başlangıçta konan aslî şer‘î hükme ne denir?",
    explanation:
      "Azîmet normal şartlardaki aslî hükümdür; mazerete bağlı kolaylaştırılmış ruhsattan ayrılır.",
    difficulty: "medium",
    conceptGroup: "v74-azimah-original-ruling",
    options: [
      {
        id: "o1",
        text: "Ruhsat",
      },
      {
        id: "o2",
        text: "Azîmet",
      },
      {
        id: "o3",
        text: "İstihsan",
      },
      {
        id: "o4",
        text: "İstishâb",
      },
    ],
  },
  {
    id: "v12-general-008",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/mubah",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 102 (basılı sayfa numarası değildir)",
    question:
      "Dinen yapılmaması kesin ve bağlayıcı biçimde istenen fiilin hükmü nedir?",
    explanation:
      "Bağlayıcı yasak haram terimiyle anlatılır; tavsiye veya serbestlik hükmü değildir.",
    difficulty: "easy",
    conceptGroup: "v74-haram-binding-prohibition",
    options: [
      {
        id: "o4",
        text: "Mubah",
      },
      {
        id: "o2",
        text: "Haram",
      },
      {
        id: "o1",
        text: "Mendup",
      },
      {
        id: "o3",
        text: "Farz",
      },
    ],
  },
  {
    id: "q57-oruclft",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/farz",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 98-100 (basılı sayfa numarası değildir)",
    question:
      "Hanefî usulünde yapılması bağlayıcı istenen fiile farz veya vâcip denilmesindeki temel ayrım nedir?",
    explanation:
      "Hanefîler kat‘î delile dayanan bağlayıcı talebi farz, zannî delile dayananı vâcip diye ayırır; çoğunluk iki terimi eş anlamlı kullanır.",
    difficulty: "hard",
    conceptGroup: "v74-hanafi-fard-wajib-evidence-distinction",
    options: [
      {
        id: "o1",
        text: "Fiilin yalnız gece veya gündüz yapılması",
      },
      {
        id: "o2",
        text: "Delilin kat‘î veya zannî oluşu",
      },
      {
        id: "o3",
        text: "Yalnız erkek veya kadın tarafından yapılması",
      },
      {
        id: "o4",
        text: "Yalnız ferden veya cemaatle yapılması",
      },
    ],
  },
  {
    id: "v12-general-005",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/fidye",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96-98 (basılı sayfa numarası değildir)",
    question:
      "Meşrû mazeretle yerine getirilemeyen bazı ibadetler için ödenen malî bedel hangi terimle anılır?",
    explanation:
      "Fidye, belirli ibadetlerin eda edilememesi veya bazı kusurların telâfisiyle ilgili malî yükümlülüktür; her oruç tutmayana bedel ödeme seçeneği vermez.",
    difficulty: "medium",
    conceptGroup: "v74-fidya-compensatory-financial-duty",
    options: [
      {
        id: "o4",
        text: "Zekât",
      },
      {
        id: "o2",
        text: "Fidye",
      },
      {
        id: "o1",
        text: "Mehir",
      },
      {
        id: "o3",
        text: "Hibe",
      },
    ],
  },
  {
    id: "q68-sitte-anlam",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/kefaret#2-fikih",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 220-227 (basılı sayfa numarası değildir)",
    question:
      "Belirli dinî yasakların ihlâli üzerine telâfi ve bağışlanma amacıyla yüklenilen malî veya bedenî ibadetlere ne denir?",
    explanation:
      "Kefâretin sebep ve yerine getirilme yolları dinî delillerle belirlenir; kişi istediği bir ödemeyi her ihlâle karşılık sayamaz.",
    difficulty: "medium",
    conceptGroup: "v74-kaffarah-specified-expiatory-worship",
    options: [
      {
        id: "o1",
        text: "Mehir",
      },
      {
        id: "o2",
        text: "Kefâret",
      },
      {
        id: "o3",
        text: "Nafaka",
      },
      {
        id: "o4",
        text: "Miras",
      },
    ],
  },
  {
    id: "v8-general-003",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/istiaze",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96-100 (basılı sayfa numarası değildir)",
    question:
      "Kötülüklerden korunmak için Allah’ın yardım ve himayesine sığınmaya ne denir?",
    explanation: "İstiâze, sözle Allah’a sığınıp O’nun korumasını istemektir.",
    difficulty: "easy",
    conceptGroup: "v74-istiadha-seeking-divine-protection",
    options: [
      {
        id: "o1",
        text: "İstişare",
      },
      {
        id: "o2",
        text: "İstiâze",
      },
      {
        id: "o3",
        text: "İstihâre",
      },
      {
        id: "o4",
        text: "İstiskā",
      },
    ],
  },
  {
    id: "q52-sadaka-008",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/tehlil",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 72 (basılı sayfa numarası değildir)",
    question: "Kelime-i tevhidi söyleyerek zikretmeye verilen ad hangisidir?",
    explanation: "Tehlîl, kelime-i tevhid ile Allah’ı anmayı ifade eder.",
    difficulty: "medium",
    conceptGroup: "v74-tahlil-word-unity-remembrance",
    options: [
      {
        id: "o1",
        text: "Tekbir",
      },
      {
        id: "o3",
        text: "Tahmîd",
      },
      {
        id: "o4",
        text: "Salvele",
      },
      {
        id: "o2",
        text: "Tehlîl",
      },
    ],
  },
  {
    id: "q62-vakfe-anlam",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/hamd",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 112-113 (basılı sayfa numarası değildir)",
    question: "Allah’a tekrar tekrar hamdetmeyi anlatan kavram hangisidir?",
    explanation: "Tahmîd, Allah’a hamd ve övgünün tekrarını ifade eder.",
    difficulty: "medium",
    conceptGroup: "v74-tahmid-repeated-praise",
    options: [
      {
        id: "o2",
        text: "Tehlîl",
      },
      {
        id: "o3",
        text: "Tekbir",
      },
      {
        id: "o4",
        text: "Salvele",
      },
      {
        id: "o1",
        text: "Tahmîd",
      },
    ],
  },
  {
    id: "q58-tecvid-ana",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/salvele",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 70-71 (basılı sayfa numarası değildir)",
    question:
      "Hz. Peygamber’e salât ve selâm getirmeyi anlatan adlardan biri hangisidir?",
    explanation: "Salvele, Hz. Peygamber’i salât ve selâmla anmakla ilgilidir.",
    difficulty: "medium",
    conceptGroup: "v74-salwala-greeting-prophet",
    options: [
      {
        id: "o3",
        text: "Tehlîl",
      },
      {
        id: "o4",
        text: "Salvele",
      },
      {
        id: "o1",
        text: "Tahmîd",
      },
      {
        id: "o2",
        text: "İstiâze",
      },
    ],
  },
  {
    id: "q68-sitte-sahihayn",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/mesh--abdest",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96-99 (basılı sayfa numarası değildir)",
    question:
      "Abdestte baş gibi belirli yerleri yıkamak yerine ıslak elle sıvazlama işlemine ne denir?",
    explanation:
      "Mesh, elin ıslaklığıyla sıvazlamadır; hangi yerde ve ne miktarda yapılacağına ilişkin ayrıntılar mezheplere göre değişebilir.",
    difficulty: "easy",
    conceptGroup: "v74-mash-wet-hand-stroking",
    options: [
      {
        id: "o1",
        text: "İstincâ",
      },
      {
        id: "o2",
        text: "İstibrâ",
      },
      {
        id: "o3",
        text: "Kāmet",
      },
      {
        id: "o4",
        text: "Mesh",
      },
    ],
  },
  {
    id: "q68-sitte-ibnmace",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/abdest",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96 (basılı sayfa numarası değildir)",
    question:
      "Türkçede abdest denen ibadet temizliğinin Arapça adı hangisidir?",
    explanation:
      "TDV, abdestin Arapçada vudû‘ kelimesiyle ifade edildiğini belirtir.",
    difficulty: "medium",
    conceptGroup: "v74-wudu-arabic-term-ablution",
    options: [
      {
        id: "o3",
        text: "Vukūf",
      },
      {
        id: "o4",
        text: "Vücûd",
      },
      {
        id: "o2",
        text: "Vudû‘",
      },
      {
        id: "o1",
        text: "Vuslat",
      },
    ],
  },
  {
    id: "q60-suffe-misafir",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/abdest",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 97 (basılı sayfa numarası değildir)",
    question:
      "Farsça kökenli abdest kelimesindeki “âb” ve “dest” sırasıyla ne demektir?",
    explanation:
      "Abdest kelimesi Farsçada su ve el anlamındaki iki unsurun birleşmesidir.",
    difficulty: "hard",
    conceptGroup: "v74-abdest-persian-water-hand-components",
    options: [
      {
        id: "o1",
        text: "Yüz ve ayak",
      },
      {
        id: "o2",
        text: "Su ve el",
      },
      {
        id: "o3",
        text: "Baş ve su",
      },
      {
        id: "o4",
        text: "El ve yüz",
      },
    ],
  },
  {
    id: "v13-general-002",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/musafaha",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 70 (basılı sayfa numarası değildir)",
    question: "İslâm kültüründe tokalaşma için kullanılan terim hangisidir?",
    explanation:
      "TDV Musâfaha başlığını Tokalaşma maddesine yönlendirir. Bu adlandırma bütün kişiler arasındaki hukukî hükümleri tek başına belirlemez.",
    difficulty: "easy",
    conceptGroup: "v74-musafaha-handshake",
    options: [
      {
        id: "o1",
        text: "Müzakere",
      },
      {
        id: "o3",
        text: "Mukabele",
      },
      {
        id: "o4",
        text: "Müşahede",
      },
      {
        id: "o2",
        text: "Musâfaha",
      },
    ],
  },
  {
    id: "q62-fitre-ad",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/aksirma",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 100 (basılı sayfa numarası değildir)",
    question:
      "Aksırıp hamdeden müslümana “Yerhamükellah” diye dua etme âdâbına ne denir?",
    explanation:
      "Teşmît, aksırıp Allah’a hamdeden kişiye rahmet duasıyla karşılık vermektir.",
    difficulty: "hard",
    conceptGroup: "v74-tashmit-sneezer-blessing",
    options: [
      {
        id: "o4",
        text: "Tehlîl",
      },
      {
        id: "o3",
        text: "Teşmîtü’l-âtıs",
      },
      {
        id: "o1",
        text: "Tesmiye",
      },
      {
        id: "o2",
        text: "Telbiye",
      },
    ],
  },
  {
    id: "q71-kurban-niyet",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/fetva",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 97 (basılı sayfa numarası değildir)",
    question: "Fıkhî bir meselede fetva isteyen kişiye ne denir?",
    explanation:
      "Müsteftî soruyu soran ve fetvayı isteyen kişidir; cevabı veren müftîdir.",
    difficulty: "medium",
    conceptGroup: "v74-mustafti-fatwa-requester",
    options: [
      {
        id: "o4",
        text: "Müftî",
      },
      {
        id: "o1",
        text: "Müsteftî",
      },
      {
        id: "o2",
        text: "Müderris",
      },
      {
        id: "o3",
        text: "Mücellit",
      },
    ],
  },
  {
    id: "q68-hadis-tanim",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/sufa",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96-100 (basılı sayfa numarası değildir)",
    question:
      "Satılmış taşınmazı belirli şartlarla müşteriye mal olduğu bedelle alma hakkı hangi kavramla anlatılır?",
    explanation:
      "Şüf‘a bir ön alım hakkıdır; kimlerin hangi şartlarla kullanabileceği ayrıca düzenlenir.",
    difficulty: "hard",
    conceptGroup: "v74-shufa-preemption-right",
    options: [
      {
        id: "o1",
        text: "Şüf‘a",
      },
      {
        id: "o2",
        text: "Hibe",
      },
      {
        id: "o3",
        text: "İcâre",
      },
      {
        id: "o4",
        text: "Rehin",
      },
    ],
  },
  {
    id: "q49-ihya-017",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/aksirma",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 99 (basılı sayfa numarası değildir)",
    question:
      "TDV’nin aktardığı aksırma âdâbına göre aksırırken ne yapmak tavsiye edilir?",
    explanation:
      "Aksırırken ağzı örtmek âdâb arasında sayılır; hem saygılı davranışı hem çevredekileri gözetmeyi destekler.",
    difficulty: "easy",
    conceptGroup: "v74-sneezing-cover-mouth-etiquette",
    options: [
      {
        id: "o1",
        text: "Yüzü yanındaki kişiye çevirmek",
      },
      {
        id: "o2",
        text: "Ağzı el veya mendille kapatmak",
      },
      {
        id: "o3",
        text: "Mümkün olduğunca etrafa üflemek",
      },
      {
        id: "o4",
        text: "Aksıranı susturmak için bağırmak",
      },
    ],
  },
  {
    id: "q57-nuhalay",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "11/41; physical PDF 237",
    question:
      "Hûd 11/41’de Nûh, gemi yüzerken de dururken de ne yapılmasını ister?",
    explanation:
      "Nûh, gemiye çağırdığı yolculara hareket ve duruş sırasında Allah’ın adını anmalarını söyler.",
    difficulty: "medium",
    conceptGroup: "v74-noah-embark-divine-name",
    options: [
      {
        id: "o4",
        text: "Allah’ın adının anılmasını",
      },
      {
        id: "o1",
        text: "Yüklerin denize atılmasını",
      },
      {
        id: "o2",
        text: "Geminin terk edilmesini",
      },
      {
        id: "o3",
        text: "Yolcuların birbirinden saklanmasını",
      },
    ],
  },
  {
    id: "v12-prophets-013",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "34/12; physical PDF 452",
    question:
      "Sebe’ 34/12’de Süleyman için eritilip akıtıldığı bildirilen maden hangisidir?",
    explanation:
      "Rüzgârla ilgili nimetin ardından Süleyman için bakırın eritilip akıtıldığı belirtilir.",
    difficulty: "hard",
    conceptGroup: "v74-solomon-molten-copper",
    options: [
      {
        id: "o1",
        text: "Altın",
      },
      {
        id: "o3",
        text: "Gümüş",
      },
      {
        id: "o4",
        text: "Kurşun",
      },
      {
        id: "o2",
        text: "Bakır",
      },
    ],
  },
  {
    id: "v13-prophets-004",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "20/39; physical PDF 330",
    question:
      "Tâhâ 20/39’da Mûsâ’nın ilâhî gözetimde yetişmesi anlatılırken üzerine ne bırakıldığı söylenir?",
    explanation:
      "Mûsâ’ya kendisinden bir sevgi verildiği, ilâhî gözetim altında yetiştirildiği bildirilir.",
    difficulty: "hard",
    conceptGroup: "v74-musa-divinely-bestowed-love",
    options: [
      {
        id: "o1",
        text: "Bir hükümdarlık tacı",
      },
      {
        id: "o3",
        text: "Bir zırh",
      },
      {
        id: "o4",
        text: "Bir levha demeti",
      },
      {
        id: "o2",
        text: "Allah’tan bir sevgi",
      },
    ],
  },
  {
    id: "q57-musaharun",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "20/22; physical PDF 329",
    question:
      "Tâhâ 20/22’de Mûsâ’nın elinin beyaz çıkması hakkında hangi açıklama yapılır?",
    explanation:
      "Elin beyaz çıkışı bir mûcize olarak anlatılır ve bir hastalıktan kaynaklanmadığı özellikle belirtilir.",
    difficulty: "medium",
    conceptGroup: "v74-musa-white-hand-without-disease",
    options: [
      {
        id: "o1",
        text: "Bir yanık sonucu oluştuğu",
      },
      {
        id: "o2",
        text: "Yaşlılık belirtisi olduğu",
      },
      {
        id: "o3",
        text: "Bir boya sonucu oluştuğu",
      },
      {
        id: "o4",
        text: "Bir hastalık yüzünden olmadığı",
      },
    ],
  },
  {
    id: "v11-prophets-006",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "26/63; physical PDF 389",
    question: "Şuarâ 26/63’te deniz yarıldığında her parça neye benzetilir?",
    explanation:
      "Denizin ikiye ayrılan parçaları büyük birer dağ gibi tasvir edilir.",
    difficulty: "hard",
    conceptGroup: "v74-parted-sea-pieces-mountains",
    options: [
      {
        id: "o1",
        text: "İnce bir ipe",
      },
      {
        id: "o2",
        text: "Koca bir dağa",
      },
      {
        id: "o3",
        text: "Küçük bir yaprağa",
      },
      {
        id: "o4",
        text: "Boş bir kaba",
      },
    ],
  },
  {
    id: "q47-suleyman-026",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "27/28; physical PDF 399",
    question:
      "Neml 27/28’de Süleyman, mektubu bıraktıktan sonra hüdhüdden ne yapmasını ister?",
    explanation:
      "Süleyman, mektubun ulaştırılmasının ardından muhatapların ne sonuca varacağını gözlemesini ister.",
    difficulty: "medium",
    conceptGroup: "v74-solomon-letter-observe-response",
    options: [
      {
        id: "o4",
        text: "Mektubu hemen geri almasını",
      },
      {
        id: "o2",
        text: "Çekilip onların tepkisini gözlemesini",
      },
      {
        id: "o1",
        text: "Bütün hediyeleri dağıtmasını",
      },
      {
        id: "o3",
        text: "Sarayın kapısını kapatmasını",
      },
    ],
  },
  {
    id: "v11-prophets-010",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "37/145; physical PDF 475",
    question:
      "Sâffât 37/145’te Yûnus kıyıya bırakıldığında sağlık durumu nasıl anlatılır?",
    explanation:
      "Yûnus’un ıssız kıyıya bırakılışı, sağlığının bozuk olduğu bir durumla birlikte anlatılır.",
    difficulty: "medium",
    conceptGroup: "v74-jonah-ill-on-bare-shore",
    options: [
      {
        id: "o1",
        text: "Hiç yorulmamış olduğu",
      },
      {
        id: "o3",
        text: "Yeni doğmuş olduğu",
      },
      {
        id: "o4",
        text: "Bedeni taşlaşmış olduğu",
      },
      {
        id: "o2",
        text: "Sağlığının bozulmuş olduğu",
      },
    ],
  },
  {
    id: "v11-prophets-012",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "3/49; physical PDF 63",
    question:
      "Âl-i İmrân 3/49’da Îsâ, insanların evleri hakkında hangi bilgiyi haber vereceğini söyler?",
    explanation:
      "Îsâ’nın işaretleri arasında evlerde yenen ve biriktirilen şeyleri haber vermesi de anılır.",
    difficulty: "hard",
    conceptGroup: "v74-jesus-informs-food-stores",
    options: [
      {
        id: "o1",
        text: "Evlerinin satış fiyatını",
      },
      {
        id: "o2",
        text: "Ne yiyip ne biriktirdiklerini",
      },
      {
        id: "o3",
        text: "Yapıların yaşını",
      },
      {
        id: "o4",
        text: "Duvarların kalınlığını",
      },
    ],
  },
  {
    id: "q61-hud-sure",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "11/56; physical PDF 239",
    question:
      "Hûd 11/56’da Hûd, Allah’a dayanmasını hangi genel egemenlikle birlikte açıklar?",
    explanation:
      "Hûd, kendisinin de kavminin de rabbi olan Allah’a dayandığını ve her canlının O’nun kontrolünde olduğunu bildirir.",
    difficulty: "hard",
    conceptGroup: "v74-hud-every-creature-divine-control",
    options: [
      {
        id: "o2",
        text: "Her canlının kontrolünün O’nun elinde oluşuyla",
      },
      {
        id: "o1",
        text: "Yalnız belli bir kabilenin O’na bağlı oluşuyla",
      },
      {
        id: "o3",
        text: "İnsanların tüm sonuçları tek başına yönetmesiyle",
      },
      {
        id: "o4",
        text: "Tabiatın Allah’tan bağımsız işlemesiyle",
      },
    ],
  },
  {
    id: "q61-hud-bina",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "26/132-134; physical PDF 392",
    question:
      "Şuarâ 26/132-134’te Hûd’un kavmine hatırlattığı nimetler hangi gruptur?",
    explanation:
      "Hûd, kavmine verilen sürüleri, çocukları, bağları ve pınarları hatırlatarak Allah’a karşı gelmekten sakındırır.",
    difficulty: "medium",
    conceptGroup: "v74-ad-blessings-herds-children-gardens-springs",
    options: [
      {
        id: "o4",
        text: "Gemiler, inciler, kalemler ve mürekkep",
      },
      {
        id: "o1",
        text: "Sürüler, oğullar, bağlar ve pınarlar",
      },
      {
        id: "o2",
        text: "Tahtlar, levhalar, asâlar ve zırhlar",
      },
      {
        id: "o3",
        text: "Mektuplar, mühürler, kumaşlar ve sikkeler",
      },
    ],
  },
  {
    id: "q57-suaybmed",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "26/189; physical PDF 395",
    question:
      "Şuarâ 26/189’da Şuayb’ı yalanlayanlar üzerine çöken felâket nasıl adlandırılır?",
    explanation:
      "Âyet bunu gölge gününün azabı olarak adlandırır; olayın fiziksel ayrıntılarını bu ifadeden hareketle uydurmak gerekmez.",
    difficulty: "hard",
    conceptGroup: "v74-shuayb-shadow-day-punishment",
    options: [
      {
        id: "o1",
        text: "Gölge gününün azabı",
      },
      {
        id: "o2",
        text: "Fil ordusunun saldırısı",
      },
      {
        id: "o3",
        text: "Bahçenin kuruması",
      },
      {
        id: "o4",
        text: "Kuyunun çökmesi",
      },
    ],
  },
  {
    id: "q57-suaybeyke",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "7/88; physical PDF 171",
    question: "A‘râf 7/88’de Şuayb ve ona inananlar hangi tehditle karşılaşır?",
    explanation:
      "Kavmin kibirli ileri gelenleri, Şuayb ve inananları kendi dinlerine dönmeye veya sürgüne zorlar.",
    difficulty: "medium",
    conceptGroup: "v74-shuayb-threatened-exile-conversion",
    options: [
      {
        id: "o4",
        text: "Derhal hükümdar seçilmekle",
      },
      {
        id: "o3",
        text: "Eski dine dönmezlerse şehirden çıkarılmakla",
      },
      {
        id: "o1",
        text: "Yeni bir tapınağa görevli yapılmakla",
      },
      {
        id: "o2",
        text: "Bütün mallarının iki katına çıkarılmasıyla",
      },
    ],
  },
  {
    id: "q71-ilyas-baal",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "80/1-2; physical PDF 632",
    question:
      "Abese 80/1-2’de yüz ekşitip baş çevirme olayı, gelen kişinin hangi durumuyla birlikte anlatılır?",
    explanation:
      "Sûrenin başlangıcı, görme engelli birinin gelmesi üzerine gösterilen tutumu ele alır.",
    difficulty: "medium",
    conceptGroup: "v74-prophet-rebuke-blind-visitor",
    options: [
      {
        id: "o1",
        text: "Görme engelli olmasıyla",
      },
      {
        id: "o2",
        text: "Saray görevlisi olmasıyla",
      },
      {
        id: "o3",
        text: "Ordu kumandanı olmasıyla",
      },
      {
        id: "o4",
        text: "Kervan sahibi olmasıyla",
      },
    ],
  },
  {
    id: "q61-isa-meryem",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "3/50; physical PDF 63",
    question:
      "Âl-i İmrân 3/50’de Îsâ, Tevrat’ı doğrulamasının yanında önceki yasaklar için ne bildireceğini söyler?",
    explanation:
      "Îsâ, önceki Tevrat’ı tasdik ettiğini ve yasaklanmış bazı şeylerin helâl olduğunu bildirmekle gönderildiğini söyler.",
    difficulty: "hard",
    conceptGroup: "v74-jesus-confirms-torah-some-prohibitions-lifted",
    options: [
      {
        id: "o1",
        text: "Hepsinin insanların isteğine bırakıldığını",
      },
      {
        id: "o2",
        text: "Bir kısmının helâl kılındığını",
      },
      {
        id: "o3",
        text: "Bütün ibadetlerin kaldırıldığını",
      },
      {
        id: "o4",
        text: "Hiçbir hükmün değişemeyeceğini",
      },
    ],
  },
  {
    id: "q61-hud-ahkaf",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "11/57; physical PDF 239",
    question:
      "Hûd 11/57’de kavmin yüz çevirmesi halinde rabbin ne yapabileceği hatırlatılır?",
    explanation:
      "Hûd tebliğini ulaştırdığını söyler; kavmin yerine başkalarının getirilebileceğini ve Allah’a engel olunamayacağını hatırlatır.",
    difficulty: "hard",
    conceptGroup: "v74-hud-warning-replaced-people",
    options: [
      {
        id: "o4",
        text: "Yerlerine başka bir kavim getirebileceği",
      },
      {
        id: "o1",
        text: "Elçiliği bütünüyle sona erdireceği",
      },
      {
        id: "o2",
        text: "Kendilerine sınırsız ömür vereceği",
      },
      {
        id: "o3",
        text: "Allah’ın hükmünü onların engelleyebileceği",
      },
    ],
  },
  {
    id: "q57-davudzebur",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "38/21-22; physical PDF 479",
    question:
      "Sâd 38/21’deki iki davacı Dâvûd’un bulunduğu mâbede nasıl girer?",
    explanation:
      "Davacılar mâbedin duvarına tırmanarak Dâvûd’un yanına girer; onları görünce telâşlanır.",
    difficulty: "medium",
    conceptGroup: "v74-david-litigants-climb-wall",
    options: [
      {
        id: "o1",
        text: "Kapıda sıraya girerek",
      },
      {
        id: "o2",
        text: "Duvara tırmanarak",
      },
      {
        id: "o3",
        text: "Bir elçiyle randevu alarak",
      },
      {
        id: "o4",
        text: "Dâvûd’un çağrısını bekleyerek",
      },
    ],
  },
  {
    id: "q71-idris-sabir",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "2/31; physical PDF 11",
    question: "Bakara 2/31’de Âdem’e neyin öğretildiği bildirilir?",
    explanation:
      "Âyet, Âdem’e bütün isimlerin öğretildiğini ve ardından bunların meleklere gösterildiğini anlatır.",
    difficulty: "easy",
    conceptGroup: "v74-adam-taught-names",
    options: [
      {
        id: "o1",
        text: "Yalnız gemi yapımının",
      },
      {
        id: "o2",
        text: "Bütün isimlerin",
      },
      {
        id: "o3",
        text: "Yalnız zırh örmenin",
      },
      {
        id: "o4",
        text: "Yalnız rüya yorumunun",
      },
    ],
  },
  {
    id: "v11-prophets-002",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "12/21; physical PDF 249",
    question:
      "Yûsuf 12/21’de onu satın alan adam, eşine iyi bakmasını söylerken hangi umudu dile getirir?",
    explanation:
      "Yûsuf’u alan kişi, ona değer verilmesini ve iyi bakılmasını ister; fayda görme veya evlât edinme ihtimalini anar.",
    difficulty: "medium",
    conceptGroup: "v74-yusuf-buyer-hopes-adoption-benefit",
    options: [
      {
        id: "o3",
        text: "Yûsuf’u hemen sürgün etmeyi",
      },
      {
        id: "o4",
        text: "Bir deniz seferine çıkarmayı",
      },
      {
        id: "o2",
        text: "Faydasını görmeyi veya evlât edinmeyi",
      },
      {
        id: "o1",
        text: "Ailesini cezalandırmayı",
      },
    ],
  },
  {
    id: "v11-prophets-001",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "12/18; physical PDF 249",
    question:
      "Yûsuf 12/18’de Ya‘kūb, kardeşlerin açıklamasına inanmadığında kendisine düşen tutumu nasıl belirtir?",
    explanation:
      "Ya‘kūb, nefsin kötü bir işe sürüklediğini söyler ve Allah’a sığınarak güzelce sabretmeyi dile getirir.",
    difficulty: "medium",
    conceptGroup: "v74-yaqub-beautiful-patience-false-blood",
    options: [
      {
        id: "o1",
        text: "Yûsuf’u aramayı sonsuza dek yasaklamak",
      },
      {
        id: "o3",
        text: "Bütün çocuklarını evden çıkarmak",
      },
      {
        id: "o4",
        text: "Onların anlattığını kesin doğru saymak",
      },
      {
        id: "o2",
        text: "Güzelce sabretmek",
      },
    ],
  },
  {
    id: "q67-kasas-34",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "2/264; physical PDF 51",
    question:
      "Bakara 2/264’te gösteriş için yardım eden kişinin durumu hangi benzetmeyle anlatılır?",
    explanation:
      "Başa kakma ve incitmeyle değersizleştirilen yardım, üstündeki toprağı şiddetli yağmurla sıyrılan kayaya benzetilir.",
    difficulty: "hard",
    conceptGroup: "v74-ostentatious-charity-bare-rock",
    options: [
      {
        id: "o1",
        text: "Her mevsim ürün veren verimli bahçe",
      },
      {
        id: "o2",
        text: "Yağmurla üstündeki toprağı giden yalçın kaya",
      },
      {
        id: "o3",
        text: "Kökleri yerin derininde sağlam ağaç",
      },
      {
        id: "o4",
        text: "Durgun suda ilerleyen yelkenli gemi",
      },
    ],
  },
  {
    id: "q65-isra-23",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "2/265; physical PDF 52",
    question:
      "Bakara 2/265’te Allah rızası için içtenlikle harcayanların örneği nasıl bir yerdir?",
    explanation:
      "İçten yapılan harcama, bol yağmurla ürününü iki kat veren, az yağmurdan da yararlanan bahçeye benzetilir.",
    difficulty: "hard",
    conceptGroup: "v74-sincere-charity-hillside-garden",
    options: [
      {
        id: "o3",
        text: "Fırtınada kaybolan gemi",
      },
      {
        id: "o4",
        text: "Yağmurla iki kat ürün veren yamaçtaki bahçe",
      },
      {
        id: "o1",
        text: "Kül olup rüzgârda dağılan ekin",
      },
      {
        id: "o2",
        text: "Suyu bütünüyle çekilmiş kuyu",
      },
    ],
  },
  {
    id: "q44-insirah-5",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "2/266; physical PDF 52",
    question:
      "Bakara 2/266’daki yaşlı kişinin verimli bahçesini yok eden olay nedir?",
    explanation:
      "Bakıma muhtaç çocukları olan yaşlı kişinin bahçesi ateşli bir kasırgayla yanar; örnek insanı düşünmeye çağırır.",
    difficulty: "hard",
    conceptGroup: "v74-orchard-destroyed-fiery-whirlwind",
    options: [
      {
        id: "o4",
        text: "Yalnız hafif bir çiseleme",
      },
      {
        id: "o2",
        text: "Ateş içeren kasırga",
      },
      {
        id: "o1",
        text: "Düzenli bir sulama",
      },
      {
        id: "o3",
        text: "Mevsiminde yapılan budama",
      },
    ],
  },
  {
    id: "q71-mushaf-cuz",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "2/275; physical PDF 54",
    question:
      "Bakara 2/275’te alım satım ile faiz hakkında hangi ayrım yapılır?",
    explanation:
      "Âyet, alım satımla faizi eşitleyen iddiayı reddederek farklı hükümleri olduğunu belirtir.",
    difficulty: "easy",
    conceptGroup: "v74-trade-permitted-interest-forbidden",
    options: [
      {
        id: "o2",
        text: "İkisi de her durumda haramdır",
      },
      {
        id: "o3",
        text: "İkisi bütünüyle aynı hükümdedir",
      },
      {
        id: "o4",
        text: "Alım satım helâl, faiz haramdır",
      },
      {
        id: "o1",
        text: "Faiz helâl, alım satım haramdır",
      },
    ],
  },
  {
    id: "learn-akaid-016",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "2/279; physical PDF 54",
    question:
      "Bakara 2/279’da faizden tövbe edenler için hangi malın kendilerine ait olduğu belirtilir?",
    explanation:
      "Tövbe halinde anaparanın kendilerine ait olduğu, haksızlık etmemeleri ve haksızlığa uğramamaları bildirilir.",
    difficulty: "medium",
    conceptGroup: "v74-interest-repentance-principal-only",
    options: [
      {
        id: "o4",
        text: "İstedikleri bütün faiz artışları",
      },
      {
        id: "o2",
        text: "Anaparaları",
      },
      {
        id: "o1",
        text: "Borçlunun bütün kazancı",
      },
      {
        id: "o3",
        text: "Borçlunun bütün mirası",
      },
    ],
  },
  {
    id: "q65-hadid-3",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "3/7; physical PDF 57",
    question:
      "Âl-i İmrân 3/7’de kitabın esası olarak nitelenen âyetler hangileridir?",
    explanation:
      "Âyet, Kur’an’ın bir kısmını muhkem, bir kısmını müteşâbih olarak anar ve muhkemleri kitabın esası sayar.",
    difficulty: "medium",
    conceptGroup: "v74-muhkam-verses-book-foundation",
    options: [
      {
        id: "o2",
        text: "Yalnız secde âyetleri",
      },
      {
        id: "o4",
        text: "Yalnız en kısa âyetler",
      },
      {
        id: "o3",
        text: "Muhkem âyetler",
      },
      {
        id: "o1",
        text: "Yalnız ilk inen âyetler",
      },
    ],
  },
  {
    id: "q66-neml-39",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "4/4; physical PDF 84",
    question:
      "Nisâ 4/4’te kadınlara borç öder gibi verilmesi istenen malî hak hangisidir?",
    explanation:
      "Kadınların mehirlerinin kendilerine verilmesi istenir; kendi gönülleriyle bağışlamaları ayrı tutulur.",
    difficulty: "medium",
    conceptGroup: "v74-women-mehr-right",
    options: [
      {
        id: "o3",
        text: "Kardeşlerinin bütün mirası",
      },
      {
        id: "o4",
        text: "Mehirleri",
      },
      {
        id: "o1",
        text: "Her ticaretin bütün kârı",
      },
      {
        id: "o2",
        text: "Bütün zekât gelirleri",
      },
    ],
  },
  {
    id: "q66-neml-40",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "4/6; physical PDF 84,85",
    question:
      "Nisâ 4/6’da malların yetimlere teslimi öncesinde hangi yeterliliğin araştırılması istenir?",
    explanation:
      "Evlilik çağına ulaşan yetimlerin olgunlukları denenir; yeterli bulunurlarsa malları kendilerine teslim edilir.",
    difficulty: "medium",
    conceptGroup: "v74-orphan-property-maturity-check",
    options: [
      {
        id: "o4",
        text: "Mutlaka yönetici olmaları",
      },
      {
        id: "o3",
        text: "Yeterli fikrî olgunluğa erişmeleri",
      },
      {
        id: "o1",
        text: "Mutlaka zengin bir eş bulmaları",
      },
      {
        id: "o2",
        text: "Bir savaşa katılmaları",
      },
    ],
  },
  {
    id: "q66-kehf-45",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "4/85; physical PDF 98",
    question:
      "Nisâ 4/85’te iyi veya kötü bir işe aracılık eden kişi hakkında hangi ilke belirtilir?",
    explanation:
      "İyi işe aracının iyilikten, kötü işe aracının da kötülükten payı bulunduğu hatırlatılır.",
    difficulty: "medium",
    conceptGroup: "v74-intercession-good-bad-share",
    options: [
      {
        id: "o2",
        text: "Yalnız kötü işte sorumluluğun kalkması",
      },
      {
        id: "o3",
        text: "Aracı olmanın hiçbir sonuç doğurmaması",
      },
      {
        id: "o4",
        text: "Aracılık ettiği işten kendisine de pay düşmesi",
      },
      {
        id: "o1",
        text: "Yalnız zenginlerin sorumlu sayılması",
      },
    ],
  },
  {
    id: "v11-quran-002",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "4/114; physical PDF 104",
    question:
      "Nisâ 4/114’te hayır taşımayan fısıldaşmalardan hangi içerikteki konuşmalar ayrı tutulur?",
    explanation:
      "Gizli konuşmaların çoğu eleştirilirken yardım, iyilik ve barıştırma amacı taşıyanlar istisna edilir.",
    difficulty: "medium",
    conceptGroup: "v74-private-talk-charity-good-reconciliation",
    options: [
      {
        id: "o2",
        text: "Sadaka, iyilik veya insanların arasını düzeltme çağrısı",
      },
      {
        id: "o1",
        text: "Başkasının kusurunu yayma",
      },
      {
        id: "o3",
        text: "İftira hazırlama",
      },
      {
        id: "o4",
        text: "Haksız kazancı gizleme",
      },
    ],
  },
  {
    id: "q64-uhud-mekan",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/kufi",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 99,104 (basılı sayfa numarası değildir)",
    question:
      "Kûfî yazının tarih boyunca koruduğu temel biçim özelliği hangisidir?",
    explanation:
      "Kûfînin belirgin özelliği geometrik düzen ve dik-yatay çizgilerdir.",
    difficulty: "medium",
    conceptGroup: "v74-kufic-angular-geometric-character",
    options: [
      {
        id: "o1",
        text: "Geometrik, dik ve yatay çizgilere dayanması",
      },
      {
        id: "o2",
        text: "Yalnız yuvarlak Latin harfleri kullanması",
      },
      {
        id: "o3",
        text: "Sadece resimlerden oluşması",
      },
      {
        id: "o4",
        text: "Her zaman harfsiz işaretlerle yazılması",
      },
    ],
  },
  {
    id: "q64-uhud-yil",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/nesih--hat",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96,105 (basılı sayfa numarası değildir)",
    question: "Nesih hattının başlıca kullanım alanı hangisidir?",
    explanation:
      "Nesih, kitap istinsahında ve basma eserlerde yaygın kullanılan bir yazı çeşididir.",
    difficulty: "medium",
    conceptGroup: "v74-naskh-book-copying-use",
    options: [
      {
        id: "o1",
        text: "Yalnız sikke kalıplarının oyulması",
      },
      {
        id: "o2",
        text: "Kitap ve uzun metinlerin yazımı",
      },
      {
        id: "o3",
        text: "Yalnız muhasebe rakamlarının şifrelenmesi",
      },
      {
        id: "o4",
        text: "Yalnız bina planlarının çizimi",
      },
    ],
  },
  {
    id: "q64-medine-eski",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/nesih--hat",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 107 (basılı sayfa numarası değildir)",
    question:
      "Nesih gibi uzun metinlerin satıra düzgün oturmasını sağlayan çizgi aletine ne denir?",
    explanation:
      "Mıstar satırların sınırlarını ve düzenini kâğıda geçirmeye yarar.",
    difficulty: "hard",
    conceptGroup: "v74-mistar-lines-writing-guide",
    options: [
      {
        id: "o1",
        text: "Hokka",
      },
      {
        id: "o2",
        text: "Mıstar",
      },
      {
        id: "o3",
        text: "Makta‘",
      },
      {
        id: "o4",
        text: "Divit",
      },
    ],
  },
  {
    id: "q64-medine-ensar",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/talik--hat",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96-97 (basılı sayfa numarası değildir)",
    question: "Kadîm ta‘lik hattı İran’da hangi iki yazıdan geliştirilmiştir?",
    explanation:
      "Ta‘lik, tevkī‘ ve rikā‘ yazılarının geçirdiği değişimle oluşmuştur.",
    difficulty: "hard",
    conceptGroup: "v74-old-taliq-tawqi-riqa-origin",
    options: [
      {
        id: "o3",
        text: "Kûfî ve siyâkat",
      },
      {
        id: "o4",
        text: "Tevkī‘ ve rikā‘",
      },
      {
        id: "o1",
        text: "Nesih ve divanî",
      },
      {
        id: "o2",
        text: "Sülüs ve celî divanî",
      },
    ],
  },
  {
    id: "q60-suffe-kim",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/aklam-i-sitte",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 97 (basılı sayfa numarası değildir)",
    question: "Aklâm-ı sitte içinde birlikte yer alan yazı çifti hangisidir?",
    explanation:
      "Altı yazı tevkī‘, rikā‘, muhakkak, reyhânî, sülüs ve nesihtir.",
    difficulty: "hard",
    conceptGroup: "v74-six-scripts-members",
    options: [
      {
        id: "o1",
        text: "Divanî ve rik‘a",
      },
      {
        id: "o2",
        text: "Ta‘lik ve siyâkat",
      },
      {
        id: "o3",
        text: "Nesta‘lik ve celî divanî",
      },
      {
        id: "o4",
        text: "Sülüs ve nesih",
      },
    ],
  },
  {
    id: "q58-esma-azik",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/ciltcilik",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 125,133 (basılı sayfa numarası değildir)",
    question:
      "Klasik kitap cildinde sırtın üst ve alt köşelerine, yaprakları tutmak için örülen bağa ne denir?",
    explanation: "Şîrâze kitabı sağlamlaştıran, sırtın uçlarına örülen bağdır.",
    difficulty: "hard",
    conceptGroup: "v74-binding-shiraze-endbands",
    options: [
      {
        id: "o2",
        text: "Mikleb",
      },
      {
        id: "o4",
        text: "Şemse",
      },
      {
        id: "o3",
        text: "Şîrâze",
      },
      {
        id: "o1",
        text: "Zencirek",
      },
    ],
  },
  {
    id: "q48-esma-006",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/ciltcilik",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 149-150 (basılı sayfa numarası değildir)",
    question:
      "Cilt kapaklarında ışınlı güneşi andıran bezeme öğesi hangi adla anılır?",
    explanation:
      "Şemse, cilt kapağındaki güneş biçimli veya ondan gelişen bezeme öğesidir.",
    difficulty: "hard",
    conceptGroup: "v74-binding-shemse-sun-medallion",
    options: [
      {
        id: "o4",
        text: "Mikleb",
      },
      {
        id: "o2",
        text: "Şemse",
      },
      {
        id: "o1",
        text: "Sertâb",
      },
      {
        id: "o3",
        text: "Şîrâze",
      },
    ],
  },
  {
    id: "q58-esma-kardes",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/celi",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96,99 (basılı sayfa numarası değildir)",
    question: "Hat sanatında “celî” sözü öncelikle neyi belirtir?",
    explanation:
      "Celî ayrı bir alfabe değil, yazının iri ölçüdeki karakterini anlatır.",
    difficulty: "medium",
    conceptGroup: "v74-jali-large-script-character",
    options: [
      {
        id: "o3",
        text: "Ayrı bir alfabenin tamamını",
      },
      {
        id: "o4",
        text: "Yalnız kırmızı mürekkeple yazmayı",
      },
      {
        id: "o2",
        text: "Bir yazının iri ve kalın yazılmış biçimini",
      },
      {
        id: "o1",
        text: "Bütün harfleri ters çevirmeyi",
      },
    ],
  },
  {
    id: "q58-esma-ogul",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/murekkep",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 100,102 (basılı sayfa numarası değildir)",
    question:
      "Sadeleştirilmiş geleneksel is mürekkebinin üç temel bileşeni hangisidir?",
    explanation:
      "TDV’nin verdiği sade tarif, isin zamk eriyiği ve suyla hazırlanmasıdır.",
    difficulty: "hard",
    conceptGroup: "v74-soot-ink-three-ingredients",
    options: [
      {
        id: "o1",
        text: "Kil, kireç ve zeytinyağı",
      },
      {
        id: "o2",
        text: "Balmumu, kum ve sirke",
      },
      {
        id: "o3",
        text: "Tuz, şap ve gül yaprağı",
      },
      {
        id: "o4",
        text: "İs, zamk eriyiği ve saf su",
      },
    ],
  },
  {
    id: "q48-hicret-021",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/murekkep",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 100 (basılı sayfa numarası değildir)",
    question: "Geleneksel is mürekkebinde Arap zamkının temel işlevi nedir?",
    explanation: "Zamk, is parçacıklarının kâğıda bağlanmasına yardım eder.",
    difficulty: "hard",
    conceptGroup: "v74-gum-binds-ink-paper",
    options: [
      {
        id: "o2",
        text: "İsi kâğıt üzerinde tutturmak",
      },
      {
        id: "o1",
        text: "Kalemin ağzını kesmek",
      },
      {
        id: "o3",
        text: "Kâğıdı katlamak",
      },
      {
        id: "o4",
        text: "Mürekkebi mutlaka kırmızı yapmak",
      },
    ],
  },
  {
    id: "q64-bedir-sefer",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/murekkep",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 98 (basılı sayfa numarası değildir)",
    question: "Süleymaniye Camii’ndeki tarihî is odasında ne toplanırdı?",
    explanation:
      "Hava akımı kandil isini bu odaya yönlendirirdi; is mürekkep yapımında değerlendirilebilirdi.",
    difficulty: "medium",
    conceptGroup: "v74-suleymaniye-soot-room-function",
    options: [
      {
        id: "o1",
        text: "Yağmur suyu",
      },
      {
        id: "o3",
        text: "Mermer tozu",
      },
      {
        id: "o4",
        text: "Kütüphane kitapları",
      },
      {
        id: "o2",
        text: "Yağ kandillerinden yükselen is",
      },
    ],
  },
  {
    id: "e150-history-025",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/murekkep",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 110 (basılı sayfa numarası değildir)",
    question:
      "Eski resmî yazılarda mürekkebi çabuk kurutmak için rıhdandan ne serpilirdi?",
    explanation: "Rıh, yazının kurumasına yardımcı olan ince kumdur.",
    difficulty: "hard",
    conceptGroup: "v74-rih-writing-drying-sand",
    options: [
      {
        id: "o2",
        text: "İnce kum türü rıh",
      },
      {
        id: "o1",
        text: "Arap zamkı",
      },
      {
        id: "o3",
        text: "Kitreli su",
      },
      {
        id: "o4",
        text: "Erimiş balmumu",
      },
    ],
  },
  {
    id: "q58-seleme-hud",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/kalem",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 99-100 (basılı sayfa numarası değildir)",
    question:
      "Geleneksel hat sanatında yazının hareketine uygunluğu nedeniyle yaygın kullanılan kalem hangi malzemedendir?",
    explanation:
      "Hattatlar yazı biçimlerine uygun olduğu için kamış kalem kullanmıştır.",
    difficulty: "easy",
    conceptGroup: "v74-calligraphy-reed-pen",
    options: [
      {
        id: "o1",
        text: "Cam",
      },
      {
        id: "o2",
        text: "Lastik",
      },
      {
        id: "o3",
        text: "Kamış",
      },
      {
        id: "o4",
        text: "Alçı",
      },
    ],
  },
  {
    id: "q51-ensar-001",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/kalem",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 110-111 (basılı sayfa numarası değildir)",
    question:
      "Kamış kalemin ağzı kesilip düzeltilirken yerleştirildiği destek aleti hangisidir?",
    explanation: "Kalem ağzı makta‘ üzerindeki yive oturtularak kesilir.",
    difficulty: "hard",
    conceptGroup: "v74-makta-pen-cut-support",
    options: [
      {
        id: "o3",
        text: "Hokka",
      },
      {
        id: "o4",
        text: "Mıstar",
      },
      {
        id: "o2",
        text: "Makta‘",
      },
      {
        id: "o1",
        text: "Rıhdan",
      },
    ],
  },
  {
    id: "q51-ensar-002",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/kalem",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 108-109 (basılı sayfa numarası değildir)",
    question:
      "Geleneksel kamış kalemi yontup açmakta kullanılan bıçak hangisidir?",
    explanation:
      "Kalemtıraş kalemin uç kısmını yontup biçimlendirmekte kullanılır.",
    difficulty: "medium",
    conceptGroup: "v74-penknife-shaping-reed",
    options: [
      {
        id: "o4",
        text: "Makta‘",
      },
      {
        id: "o2",
        text: "Kalemtıraş",
      },
      {
        id: "o1",
        text: "Mıstar",
      },
      {
        id: "o3",
        text: "Hokka",
      },
    ],
  },
  {
    id: "q69-zeydbsabit-cem",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/kalem",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 110 (basılı sayfa numarası değildir)",
    question: "Kamış kalemin ucundaki ince yarığın yazıya katkısı nedir?",
    explanation:
      "Şakk-ı kalem denilen yarık mürekkebin tutulup aşağıya akmasına yardım eder.",
    difficulty: "hard",
    conceptGroup: "v74-split-nib-ink-flow",
    options: [
      {
        id: "o3",
        text: "Mürekkebi küçük bir depo gibi tutup akışını sağlamak",
      },
      {
        id: "o1",
        text: "Kâğıdı ortadan kesmek",
      },
      {
        id: "o2",
        text: "Yazının rengini altına çevirmek",
      },
      {
        id: "o4",
        text: "Kalemi kâğıda yapıştırmak",
      },
    ],
  },
  {
    id: "q63-selimiye-bani",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/rumi",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 72 (basılı sayfa numarası değildir)",
    question:
      "TDV’nin kısa tanımında rûmî motifinin hangi kökenden geldiği ileri sürülür?",
    explanation:
      "Rûmînin hayvansal kökeni bir açıklama olarak sunulur; motifler üslûplaşmış soyut biçimlerdir.",
    difficulty: "hard",
    conceptGroup: "v74-rumi-animal-origin-qualified",
    options: [
      {
        id: "o3",
        text: "Yalnız modern harflerden",
      },
      {
        id: "o4",
        text: "Yalnız rakamlardan",
      },
      {
        id: "o2",
        text: "Hayvansal biçimlerden",
      },
      {
        id: "o1",
        text: "Yalnız insan portrelerinden",
      },
    ],
  },
  {
    id: "e150-history-002",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/cini",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 94 (basılı sayfa numarası değildir)",
    question:
      "Çini levhanın üstündeki sır, fırınlama sonunda hangi temel özelliği sağlar?",
    explanation:
      "Çini sanatında sırın erimesi, levha üzerinde koruyucu bir tabaka oluşturur.",
    difficulty: "medium",
    conceptGroup: "v74-tile-glaze-protective-layer",
    options: [
      {
        id: "o1",
        text: "Ahşap bir taşıyıcı çerçeve",
      },
      {
        id: "o2",
        text: "Koruyucu saydam bir tabaka",
      },
      {
        id: "o3",
        text: "Kalın bir kumaş yüzey",
      },
      {
        id: "o4",
        text: "Yalnız geçici kâğıt kaplama",
      },
    ],
  },
  {
    id: "q58-suleym-kardes",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/cini",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 137 (basılı sayfa numarası değildir)",
    question:
      "1572 tarihli fermanlara göre Selimiye Camii’nin çinileri nereye özel olarak sipariş edilmiştir?",
    explanation: "Selimiye’nin çini siparişleri İznik’e verilmiştir.",
    difficulty: "hard",
    conceptGroup: "v74-selimiye-tiles-iznik-order",
    options: [
      {
        id: "o1",
        text: "Kahire’ye",
      },
      {
        id: "o2",
        text: "Semerkant’a",
      },
      {
        id: "o3",
        text: "Kurtuba’ya",
      },
      {
        id: "o4",
        text: "İznik’e",
      },
    ],
  },
  {
    id: "q63-selimiye-sehir",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/ahar",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 97-99 (basılı sayfa numarası değildir)",
    question:
      "Kitap sanatlarında kâğıdın âharlanması yazıyı nasıl kolaylaştırır?",
    explanation:
      "Âhar, kâğıt yüzeyini düzgünleştirir; mürekkebin emilmesini azaltıp düzeltmeyi kolaylaştırır.",
    difficulty: "hard",
    conceptGroup: "v74-ahar-paper-ink-absorption-correction",
    options: [
      {
        id: "o1",
        text: "Mürekkebin emilmesini sınırlayıp düzeltmeye uygun yüzey sağlar",
      },
      {
        id: "o2",
        text: "Mürekkebi tamamen görünmez yapar",
      },
      {
        id: "o3",
        text: "Kâğıdı kumaşa dönüştürür",
      },
      {
        id: "o4",
        text: "Her yazıyı kendiliğinden altınlar",
      },
    ],
  },
  {
    id: "q49-taberi-010",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/ebru",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 103 (basılı sayfa numarası değildir)",
    question: "Ebru boyasına katılan sığır ödünün temel görevi nedir?",
    explanation:
      "Öd içindeki safra asitleri boyaların yüzeyde yayılmasını sağlar.",
    difficulty: "hard",
    conceptGroup: "v74-ebru-ox-gall-spreading",
    options: [
      {
        id: "o2",
        text: "Boyaların su yüzeyinde yayılmasına yardım etmek",
      },
      {
        id: "o1",
        text: "Kâğıdı kalıcı olarak katlamak",
      },
      {
        id: "o3",
        text: "Boyayı mutlaka siyaha çevirmek",
      },
      {
        id: "o4",
        text: "Teknenin metalini sertleştirmek",
      },
    ],
  },
  {
    id: "q57-vakifgay",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/med",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 102 (basılı sayfa numarası değildir)",
    question:
      "Tecvidde ârız sükûnun vakf ve vasıl bakımından ayırt edici özelliği nedir?",
    explanation:
      "Ârız sükûn, kelimede durulduğunda ortaya çıkar; okuyuş birleştirildiğinde düşer.",
    difficulty: "medium",
    conceptGroup: "v74-arid-sukun-stop-versus-connection",
    options: [
      {
        id: "o3",
        text: "Dururken de devam ederken de aynı kalması",
      },
      {
        id: "o4",
        text: "Yalnız harfin noktasını değiştirmesi",
      },
      {
        id: "o2",
        text: "Durunca ortaya çıkıp devam edince kaybolması",
      },
      {
        id: "o1",
        text: "Her kelimeyi ayrı bir âyet yapması",
      },
    ],
  },
  {
    id: "q62-say-sayi",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/med",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 98 (basılı sayfa numarası değildir)",
    question:
      "Tecvidde uygun hareke ve sükûn şartlarıyla med harfi olan üç harf hangisidir?",
    explanation:
      "Eliften önce üstün; sâkin vavdan önce ötre, sâkin yâdan önce esre bulunması medin temel şartlarındandır.",
    difficulty: "medium",
    conceptGroup: "v74-med-letters-and-vowel-conditions",
    options: [
      {
        id: "o1",
        text: "Bâ, tâ ve sâ",
      },
      {
        id: "o2",
        text: "Cîm, hâ ve hı",
      },
      {
        id: "o3",
        text: "Elif, vav ve yâ",
      },
      {
        id: "o4",
        text: "Dâl, zâl ve râ",
      },
    ],
  },
  {
    id: "q47-hac-038",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/med",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 100 (basılı sayfa numarası değildir)",
    question:
      "Med harfinden sonraki hemzenin aynı veya ayrı kelimede olması hangi medleri ayırır?",
    explanation:
      "Hemze aynı kelimedeyse muttasıl, ayrı kelimedeyse munfasıl med söz konusudur.",
    difficulty: "hard",
    conceptGroup: "v74-muttasil-munfasil-same-different-word",
    options: [
      {
        id: "o4",
        text: "Lâzım ve ârız",
      },
      {
        id: "o2",
        text: "Muttasıl ve munfasıl",
      },
      {
        id: "o1",
        text: "Tabiî ve lîn",
      },
      {
        id: "o3",
        text: "Lîn ve lâzım",
      },
    ],
  },
  {
    id: "q62-hac-sayi",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/gunne",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96 (basılı sayfa numarası değildir)",
    question: "Tecvidde gunne sesinin belirgin özelliği nedir?",
    explanation: "Gunne, genizden gelen ve genizde yankılanan sestir.",
    difficulty: "medium",
    conceptGroup: "v74-ghunna-nasal-resonance",
    options: [
      {
        id: "o1",
        text: "Yalnız dudakların sürtünmesi",
      },
      {
        id: "o2",
        text: "Dilin dişlere sertçe vurulması",
      },
      {
        id: "o3",
        text: "Genizde yankılanması",
      },
      {
        id: "o4",
        text: "Sesin tamamen kesilmesi",
      },
    ],
  },
  {
    id: "q57-ezanbilal",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/ihfa",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96 (basılı sayfa numarası değildir)",
    question: "Sâkin nûn veya tenvinin ihfâ ile okunuşu nasıl tanımlanır?",
    explanation: "İhfâda gunne korunur; okuyuş izhar ile idgam arasındadır.",
    difficulty: "hard",
    conceptGroup: "v74-ikhfa-between-izhar-idgham",
    options: [
      {
        id: "o1",
        text: "Nûnu her zaman elif yapmak",
      },
      {
        id: "o2",
        text: "Gunneyle, izhar ile idgam arasında okumak",
      },
      {
        id: "o3",
        text: "Gunneyi kaldırıp tam birleştirmek",
      },
      {
        id: "o4",
        text: "Her seferinde nefes alarak durmak",
      },
    ],
  },
  {
    id: "q70-safii-risale",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/izhar--tecvid",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96 (basılı sayfa numarası değildir)",
    question: "Tecvidde izhar yapılırken harf nasıl okunur?",
    explanation:
      "İzhar, harfin sonraki harfe katılmadan açıkça çıkarılmasıdır.",
    difficulty: "medium",
    conceptGroup: "v74-izhar-separate-clear-articulation",
    options: [
      {
        id: "o3",
        text: "Kendi mahrecinden açık ve ayrı olarak",
      },
      {
        id: "o1",
        text: "Sonraki harfle tamamen birleştirilerek",
      },
      {
        id: "o2",
        text: "Her durumda mîme dönüştürülerek",
      },
      {
        id: "o4",
        text: "Ses verilmeden atlanarak",
      },
    ],
  },
  {
    id: "q68-zayif-hasen",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/iklab",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96 (basılı sayfa numarası değildir)",
    question:
      "İklâbda bâ harfinden önceki sâkin nûn veya tenvin hangi sese çevrilir?",
    explanation:
      "İklâb, bâdan önceki sâkin nûn veya tenvinin mîm olarak okunmasıdır.",
    difficulty: "hard",
    conceptGroup: "v74-iqlab-nun-before-ba-to-mim",
    options: [
      {
        id: "o1",
        text: "Lâm",
      },
      {
        id: "o2",
        text: "Râ",
      },
      {
        id: "o3",
        text: "Mîm",
      },
      {
        id: "o4",
        text: "Elif",
      },
    ],
  },
  {
    id: "e150-general-004",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/sekte",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96-97 (basılı sayfa numarası değildir)",
    question: "Kur’an okuyuşunda sekteyi belirleyen duruş nasıl yapılır?",
    explanation:
      "Sekte, sesi kısa süre kesip nefes almadan okuyuşa devam etmektir.",
    difficulty: "medium",
    conceptGroup: "v74-sakt-short-pause-no-breath",
    options: [
      {
        id: "o4",
        text: "Mutlaka uzun süre nefes alarak",
      },
      {
        id: "o2",
        text: "Nefes almadan kısa süre durarak",
      },
      {
        id: "o1",
        text: "Önceki kelimeyi silerek",
      },
      {
        id: "o3",
        text: "Sonraki kelimeyi iki kez okuyarak",
      },
    ],
  },
  {
    id: "q58-tecvid-mahrec",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/vakf-ve-ibtida",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96 (basılı sayfa numarası değildir)",
    question:
      "Kıraatte vakfın, okuyuşa yeniden başlama niyetiyle yapılan temel işlemi nedir?",
    explanation:
      "Vakf, okuyuşa devam etme niyetiyle kelime üzerinde nefes alacak kadar durmaktır.",
    difficulty: "medium",
    conceptGroup: "v74-waqf-stop-breathe-resume-intent",
    options: [
      {
        id: "o2",
        text: "Harflerin yerini değiştirmek",
      },
      {
        id: "o4",
        text: "Bütün kelimeleri birleştirmek",
      },
      {
        id: "o3",
        text: "Nefes alacak kadar sesi kesmek",
      },
      {
        id: "o1",
        text: "Yazılı olmayan bir kelime eklemek",
      },
    ],
  },
  {
    id: "v11-general-011",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/vakf-ve-ibtida",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 97 (basılı sayfa numarası değildir)",
    question: "Vakf ve ibtidâ ilminde ibtidâ neyi ifade eder?",
    explanation:
      "İbtidâ, ilk başlangıcı veya duruş sonrasındaki yeniden başlamayı anlatır.",
    difficulty: "medium",
    conceptGroup: "v74-ibtida-begin-or-resume-recitation",
    options: [
      {
        id: "o2",
        text: "Okuyuşa başlamak veya durduktan sonra yeniden başlamak",
      },
      {
        id: "o1",
        text: "Medleri her yerde kaldırmak",
      },
      {
        id: "o3",
        text: "Nûn sesini mîme çevirmek",
      },
      {
        id: "o4",
        text: "Yazıda harflere nokta koymak",
      },
    ],
  },
  {
    id: "q57-vakfiyeterim",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/harf--alfabe",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 340,348-349 (basılı sayfa numarası değildir)",
    question:
      "Tecvidde tefhîm ve terkīk sırasıyla hangi ses özelliklerini belirtir?",
    explanation:
      "Tefhîm kalın, terkīk ince telaffuzu anlatır; uygulama harfe ve bulunduğu konuma bağlıdır.",
    difficulty: "hard",
    conceptGroup: "v74-tafkhim-tarqiq-thick-thin-pair",
    options: [
      {
        id: "o1",
        text: "Kalın ve ince okuyuş",
      },
      {
        id: "o2",
        text: "Hızlı ve yavaş okuyuş",
      },
      {
        id: "o3",
        text: "Uzun ve kısa duruş",
      },
      {
        id: "o4",
        text: "Yüksek ve alçak sesle okuma",
      },
    ],
  },
  {
    id: "q68-hadis-riayet",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/med",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 99 (basılı sayfa numarası değildir)",
    question: "Kıraat öğretiminde “fem-i muhsin”den dinlemek ne demektir?",
    explanation:
      "Ses ve sürelerin doğru öğrenilmesinde ehil bir okuyucuyu dinlemek esastır.",
    difficulty: "medium",
    conceptGroup: "v74-fam-muhsin-model-oral-recitation",
    options: [
      {
        id: "o2",
        text: "Kur’an’ı doğru ve güzel okuyan ehil hocadan dinlemek",
      },
      {
        id: "o1",
        text: "Sadece sessiz bir yazı kopyasını incelemek",
      },
      {
        id: "o3",
        text: "Kelimelerin yalnız sayılarını ezberlemek",
      },
      {
        id: "o4",
        text: "Her okumayı başka dile çevirmek",
      },
    ],
  },
  {
    id: "q59-katib-kesf",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/mushaf",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 129-131 (basılı sayfa numarası değildir)",
    question: "“Resmü’l-mushaf” ifadesi hangi konuyu belirtir?",
    explanation:
      "Resmü’l-mushaf, mushaf metninin yazım özellikleriyle ilgilidir; kapak bezemesi anlamına gelmez.",
    difficulty: "hard",
    conceptGroup: "v74-rasm-mushaf-uthmanic-orthography",
    options: [
      {
        id: "o4",
        text: "Mushaf kapağındaki tezhip desenini",
      },
      {
        id: "o1",
        text: "Osman mushaflarındaki özel yazım düzenini",
      },
      {
        id: "o2",
        text: "Her sûrenin makamını",
      },
      {
        id: "o3",
        text: "Ciltteki deri türünü",
      },
    ],
  },
  {
    id: "v13-general-005",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/tilavet",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 110-112 (basılı sayfa numarası değildir)",
    question: "Tecvide uygun okuyuşlar yavaştan hızlıya hangi sırayla anılır?",
    explanation:
      "Tahkik yavaş, tedvîr orta, hadr hızlı okuyuş biçimidir; hadrda da tecvid kuralları korunur.",
    difficulty: "hard",
    conceptGroup: "v74-tahqiq-tadwir-hadr-speed-order",
    options: [
      {
        id: "o2",
        text: "Tahkik, tedvîr, hadr",
      },
      {
        id: "o1",
        text: "Hadr, tahkik, tedvîr",
      },
      {
        id: "o3",
        text: "Tedvîr, hadr, tahkik",
      },
      {
        id: "o4",
        text: "Tahkik, hadr, tedvîr",
      },
    ],
  },
  {
    id: "q45-harizmi-eser",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record.",
    source: "https://islamansiklopedisi.org.tr/imale--kiraat",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96,99 (basılı sayfa numarası değildir)",
    question:
      "Kıraatte imâle, fetha ve elif seslerinin hangi yöne yaklaştırılmasıdır?",
    explanation:
      "İmâlede fetha kesreye, elif yâya meylettirilir; tam bir ses dönüşümü kastedilmez.",
    difficulty: "hard",
    conceptGroup: "v74-imala-inclining-not-full-conversion",
    options: [
      {
        id: "o4",
        text: "Damme ve vav seslerine",
      },
      {
        id: "o2",
        text: "Kesre ve yâ seslerine",
      },
      {
        id: "o1",
        text: "Sâkin nûn ve mîm seslerine",
      },
      {
        id: "o3",
        text: "Kaf ve gâf seslerine",
      },
    ],
  },
  {
    id: "v12-prophets-003",
    reason:
      "Replace newly confirmed reverse-form fact overlap in staged candidate only; original v73 and lookup IDs remain intact.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "19/43; physical PDF 323",
    question:
      "Meryem 19/43’te İbrâhim, babasından kendisine uymasını hangi gerekçeyle ister?",
    explanation:
      "İbrâhim, kendisine ulaşan bilgiye dayanarak babasını doğru yola çağırır.",
    difficulty: "medium",
    conceptGroup: "v74-abraham-invites-father-follow-knowledge",
    options: [
      {
        id: "o1",
        text: "Kavminin en zengin kişisi olması",
      },
      {
        id: "o3",
        text: "Bir hükümdarın kendisini görevlendirmesi",
      },
      {
        id: "o4",
        text: "Babasının ticaretini yönetmesi",
      },
      {
        id: "o2",
        text: "Babasına gelmeyen bir bilginin kendisine gelmiş olması",
      },
    ],
  },
  {
    id: "q66-neml-44",
    reason:
      "Replace newly confirmed reverse-form fact overlap in staged candidate only; original v73 and lookup IDs remain intact.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "20/115; physical PDF 336",
    question:
      "Tâhâ 20/115’te Âdem’in önceden alınan söz karşısındaki durumu nasıl anlatılır?",
    explanation:
      "Âdem’den daha önce söz alındığı, fakat onun unuttuğu ve yeterli kararlılık göstermediği belirtilir.",
    difficulty: "medium",
    conceptGroup: "v74-adam-forgets-pledge-lacks-resolve",
    options: [
      {
        id: "o1",
        text: "Unutması ve yeterli kararlılık göstermemesi",
      },
      {
        id: "o2",
        text: "Hiçbir sorumluluk üstlenmemesi",
      },
      {
        id: "o3",
        text: "Yanlış yapmasının imkânsız olması",
      },
      {
        id: "o4",
        text: "Bilgiyi başka insanlardan saklaması",
      },
    ],
  },
] as const;
