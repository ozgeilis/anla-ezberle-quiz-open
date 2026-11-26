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
    reason:
      "Stem asks who, while every answer option names an action. Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "Leyl 92/12; physical PDF page 647",
    question: "Leyl 92/12’de Allah’a ait olduğu bildirilen hangi eylemdir?",
    difficulty: "medium",
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
      "The stated reconnaissance assignment concerned the caravan, not the previously unknown army. Full-option difficulty review: Detailed bibliographic structure, named location, lesser-known rank or participant requires specialist recall.",
    source: "https://islamansiklopedisi.org.tr/bedir-gazvesi",
    locator:
      "Paragraph beginning Öte yandan Bedir yakınında; following paragraph explains they did not yet know of the army.",
    question:
      "Bedir kuyularına kervan hakkında bilgi toplamak üzere gönderilenler arasında hangisi vardır?",
    difficulty: "hard",
  },
  {
    id: "q71-kurban-kalb",
    reason:
      "General wording about worship purpose overlaps with sincerity; source gives a precise legal intention requirement. Full-option difficulty review: Basic widely taught concept or familiar story.",
    source: "https://islamansiklopedisi.org.tr/kurban#2-islamda-kurban",
    locator: "Geçerlilik Şartları, point 6 (niyet)",
    question:
      "Kurbanın geçerliliğinde ibadet kastı taşımasını sağlayan ve kalpte bulunması yeterli olan şart hangisidir?",
    difficulty: "easy",
  },
  {
    id: "q62-arafat-arefe",
    reason:
      "The day-nine answer is sound, but the explanation states a noon start without qualifying the legal school; TDV Vakfe records Hanbeli dawn and majority noon. Full-option difficulty review: Basic widely taught concept or familiar story.",
    source: "https://islamansiklopedisi.org.tr/vakfe",
    locator: "Zamanı: 108–109",
    explanation:
      "Arafat vakfesi arefe günü, yani zilhiccenin dokuzuncu günü başlar. Başlangıç saati çoğunluğa göre zeval, Hanbelîlere göre fecirdir; vakfe süresi bayramın ilk günü fecre kadar devam eder.",
    difficulty: "easy",
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
      "The contents of the first section of a named technical treatise require knowledge beyond the basic figure and field. Full-option difficulty review: Detailed bibliographic structure, named location, lesser-known rank or participant requires specialist recall.",
    difficulty: "hard",
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
      "Identifying a named companion’s brother is detailed biography rather than introductory Islamic knowledge. Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve the original historical ID/key/option IDs. The earlier same-fact record remains. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Köpük akar, faydalı olan da onunla sürüklenir",
      },
      {
        id: "o3",
        text: "Köpük dibe çöker, faydalı olan buharlaşır",
      },
      {
        id: "o4",
        text: "Köpük bereketi, kalan madde ise zararı temsil eder",
      },
    ],
  },
  {
    id: "q71-mushaf-ilk",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve the original historical ID/key/option IDs. The earlier same-fact record remains. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Eller, ayaklar ve dil",
      },
      {
        id: "o3",
        text: "Kemikler, kaslar ve damarlar",
      },
      {
        id: "o4",
        text: "Saçlar, tırnaklar ve dişler",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and the full historical v73 record. Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    source: "https://islamansiklopedisi.org.tr/teheccud",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 71,96-100 (basılı sayfa numarası değildir)",
    question:
      "Yatsı ile fecr-i sâdık arasında bir süre uyuyup kalkınca kılınan nâfile namaz hangi adla anılır?",
    explanation:
      "TDV, teheccüdü bir miktar uyuduktan sonra kılınan gece namazı olarak açıklar; genel anlamdaki gece namazlarıyla ilişkisini de ele alır.",
    difficulty: "easy",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Delilin Kur’an veya hadis metninde yer alması",
      },
      {
        id: "o2",
        text: "Delilin kat‘î veya zannî oluşu",
      },
      {
        id: "o3",
        text: "Hükmün bireysel veya toplumsal faydayla ilgili olması",
      },
      {
        id: "o4",
        text: "Fiilin bir kez veya tekrarlanarak yapılması",
      },
    ],
  },
  {
    id: "v12-general-005",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    source: "https://islamansiklopedisi.org.tr/fidye",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96-98 (basılı sayfa numarası değildir)",
    question:
      "Meşrû mazeretle yerine getirilemeyen bazı ibadetler için ödenen malî bedel hangi terimle anılır?",
    explanation:
      "Fidye, belirli ibadetlerin eda edilememesi veya bazı kusurların telâfisiyle ilgili malî yükümlülüktür; her oruç tutmayana bedel ödeme seçeneği vermez.",
    difficulty: "easy",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Basic widely taught concept or familiar story.",
    source: "https://islamansiklopedisi.org.tr/kefaret#2-fikih",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 220-227 (basılı sayfa numarası değildir)",
    question:
      "Belirli dinî yasakların ihlâli üzerine telâfi ve bağışlanma amacıyla yüklenilen malî veya bedenî ibadetlere ne denir?",
    explanation:
      "Kefâretin sebep ve yerine getirilme yolları dinî delillerle belirlenir; kişi istediği bir ödemeyi her ihlâle karşılık sayamaz.",
    difficulty: "easy",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Basic widely taught concept or familiar story.",
    source: "https://islamansiklopedisi.org.tr/salvele",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 70-71 (basılı sayfa numarası değildir)",
    question:
      "Hz. Peygamber’e salât ve selâm getirmeyi anlatan adlardan biri hangisidir?",
    explanation: "Salvele, Hz. Peygamber’i salât ve selâmla anmakla ilgilidir.",
    difficulty: "easy",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    source: "https://islamansiklopedisi.org.tr/abdest",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 97 (basılı sayfa numarası değildir)",
    question:
      "Farsça kökenli abdest kelimesindeki “âb” ve “dest” sırasıyla ne demektir?",
    explanation:
      "Abdest kelimesi Farsçada su ve el anlamındaki iki unsurun birleşmesidir.",
    difficulty: "medium",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Başını geriye doğru kaldırmak",
      },
      {
        id: "o2",
        text: "Ağzı el veya mendille kapatmak",
      },
      {
        id: "o3",
        text: "Burnunu ve ağzını suyla yıkamak",
      },
      {
        id: "o4",
        text: "Konuşmaya kısa bir ara vermek",
      },
    ],
  },
  {
    id: "q57-nuhalay",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Yolculuğun ertelenmesini",
      },
      {
        id: "o2",
        text: "Rotanın kıyıdan sürdürülmesini",
      },
      {
        id: "o3",
        text: "Her durakta yüklerin sayılmasını",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Well-known scientific-cultural identification or standard story detail; not advanced memorisation.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "20/39; physical PDF 330",
    question:
      "Tâhâ 20/39’da Mûsâ’nın ilâhî gözetimde yetişmesi anlatılırken üzerine ne bırakıldığı söylenir?",
    explanation:
      "Mûsâ’ya kendisinden bir sevgi verildiği, ilâhî gözetim altında yetiştirildiği bildirilir.",
    difficulty: "medium",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Well-known scientific-cultural identification or standard story detail; not advanced memorisation. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "26/63; physical PDF 389",
    question: "Şuarâ 26/63’te deniz yarıldığında her parça neye benzetilir?",
    explanation:
      "Denizin ikiye ayrılan parçaları büyük birer dağ gibi tasvir edilir.",
    difficulty: "medium",
    conceptGroup: "v74-parted-sea-pieces-mountains",
    options: [
      {
        id: "o1",
        text: "Yüksek bir sura",
      },
      {
        id: "o2",
        text: "Koca bir dağa",
      },
      {
        id: "o3",
        text: "Kabarık bir buluta",
      },
      {
        id: "o4",
        text: "Geniş bir vadiye",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Sağlığına bütünüyle kavuşmuş olduğu",
      },
      {
        id: "o3",
        text: "Eskisinden daha güçlü olduğu",
      },
      {
        id: "o4",
        text: "Derin bir uykuda olduğu",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Well-known scientific-cultural identification or standard story detail; not advanced memorisation.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "3/49; physical PDF 63",
    question:
      "Âl-i İmrân 3/49’da Îsâ, insanların evleri hakkında hangi bilgiyi haber vereceğini söyler?",
    explanation:
      "Îsâ’nın işaretleri arasında evlerde yenen ve biriktirilen şeyleri haber vermesi de anılır.",
    difficulty: "medium",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Standard intermediate concept; not specialist detail. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "11/56; physical PDF 239",
    question:
      "Hûd 11/56’da Hûd, Allah’a dayanmasını hangi genel egemenlikle birlikte açıklar?",
    explanation:
      "Hûd, kendisinin de kavminin de rabbi olan Allah’a dayandığını ve her canlının O’nun kontrolünde olduğunu bildirir.",
    difficulty: "medium",
    conceptGroup: "v74-hud-every-creature-divine-control",
    options: [
      {
        id: "o2",
        text: "Her canlının kontrolünün O’nun elinde oluşuyla",
      },
      {
        id: "o1",
        text: "Dilediğine bol rızık vermesiyle",
      },
      {
        id: "o3",
        text: "Gece ile gündüzü düzenlemesiyle",
      },
      {
        id: "o4",
        text: "Yeryüzünü insanlara yerleşim kılmasıyla",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Vergilerinin artırılmasıyla",
      },
      {
        id: "o3",
        text: "Eski dine dönmezlerse şehirden çıkarılmakla",
      },
      {
        id: "o1",
        text: "Pazarda ticaretten menedilmekle",
      },
      {
        id: "o2",
        text: "Sürülerine el konulmasıyla",
      },
    ],
  },
  {
    id: "q71-ilyas-baal",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "İşitme engelli olmasıyla",
      },
      {
        id: "o3",
        text: "Yürüme güçlüğü çekmesiyle",
      },
      {
        id: "o4",
        text: "Konuşma güçlüğü çekmesiyle",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Kendilerine yeni ticaret yolları açabileceği",
      },
      {
        id: "o2",
        text: "Ülkelerine farklı bir dil öğretebileceği",
      },
      {
        id: "o3",
        text: "Eski yurtlarına dönmelerini isteyebileceği",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Gemi yapımının",
      },
      {
        id: "o2",
        text: "Bütün isimlerin",
      },
      {
        id: "o3",
        text: "Zırh örmenin",
      },
      {
        id: "o4",
        text: "Rüya yorumunun",
      },
    ],
  },
  {
    id: "v11-prophets-002",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Onu ailesini bulması için görevlendirmeyi",
      },
      {
        id: "o4",
        text: "Ticaret kervanının başına geçirmeyi",
      },
      {
        id: "o2",
        text: "Faydasını görmeyi veya evlât edinmeyi",
      },
      {
        id: "o1",
        text: "Ona sarayda eğitim verdirmeyi",
      },
    ],
  },
  {
    id: "v11-prophets-001",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "12/18; physical PDF 249",
    question:
      "Yûsuf 12/18’de Ya‘kūb, kardeşlerin açıklamasına inanmadığında kendisine düşen tutumu nasıl belirtir?",
    explanation:
      "Ya‘kūb, nefsin kötü bir işe sürüklediğini söyler ve Allah’a sığınarak güzelce sabretmeyi dile getirir.",
    difficulty: "easy",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Şiddetli dolu fırtınası",
      },
      {
        id: "o2",
        text: "Ateş içeren kasırga",
      },
      {
        id: "o1",
        text: "Uzun süren kuraklık",
      },
      {
        id: "o3",
        text: "Taşkına yol açan sel",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Basic widely taught concept or familiar story. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "4/4; physical PDF 84",
    question:
      "Nisâ 4/4’te kadınlara borç öder gibi verilmesi istenen malî hak hangisidir?",
    explanation:
      "Kadınların mehirlerinin kendilerine verilmesi istenir; kendi gönülleriyle bağışlamaları ayrı tutulur.",
    difficulty: "easy",
    conceptGroup: "v74-women-mehr-right",
    options: [
      {
        id: "o3",
        text: "Miras payları",
      },
      {
        id: "o4",
        text: "Mehirleri",
      },
      {
        id: "o1",
        text: "Çalışma ücretleri",
      },
      {
        id: "o2",
        text: "Alacaklarının faizleri",
      },
    ],
  },
  {
    id: "q66-neml-40",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Düzenli bir meslek edinmeleri",
      },
      {
        id: "o3",
        text: "Yeterli fikrî olgunluğa erişmeleri",
      },
      {
        id: "o1",
        text: "Evlilik hazırlıklarını bitirmeleri",
      },
      {
        id: "o2",
        text: "Bir okuldan mezun olmaları",
      },
    ],
  },
  {
    id: "q66-kehf-45",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Sorumluluğun bütünüyle asıl işi yapana kalması",
      },
      {
        id: "o3",
        text: "Aracının yalnız kendi maddî kazancından sorumlu olması",
      },
      {
        id: "o4",
        text: "Aracılık ettiği işten kendisine de pay düşmesi",
      },
      {
        id: "o1",
        text: "Aracının yalnız niyetinin dikkate alınması",
      },
    ],
  },
  {
    id: "v11-quran-002",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "4/114; physical PDF 104",
    question:
      "Nisâ 4/114’te hayır taşımayan fısıldaşmalardan hangi içerikteki konuşmalar ayrı tutulur?",
    explanation:
      "Gizli konuşmaların çoğu eleştirilirken yardım, iyilik ve barıştırma amacı taşıyanlar istisna edilir.",
    difficulty: "easy",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Yuvarlak ve kesintisiz kavislerle kurulması",
      },
      {
        id: "o3",
        text: "Çok eğik satırlara ve asılı harflere dayanması",
      },
      {
        id: "o4",
        text: "Üst üste sıkışan dalgalı satırlara dayanması",
      },
    ],
  },
  {
    id: "q64-uhud-yil",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Resmî beratların tuğralı başlıkları",
      },
      {
        id: "o2",
        text: "Kitap ve uzun metinlerin yazımı",
      },
      {
        id: "o3",
        text: "Mâlî kayıtların özel hesap yazıları",
      },
      {
        id: "o4",
        text: "Anıtsal yapılardaki iri kitâbeler",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Satırların eğik yazılmasını",
      },
      {
        id: "o4",
        text: "Harflerin harekesiz bırakılmasını",
      },
      {
        id: "o2",
        text: "Bir yazının iri ve kalın yazılmış biçimini",
      },
      {
        id: "o1",
        text: "Yazının çok küçük ölçüde yazılmasını",
      },
    ],
  },
  {
    id: "q58-esma-ogul",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "İs, yumurta akı ve keten yağı",
      },
      {
        id: "o2",
        text: "Mazı, demir sülfatı ve gül suyu",
      },
      {
        id: "o3",
        text: "Kök boya, şap ve sirke",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "İs taneciklerini öğüterek küçültmek",
      },
      {
        id: "o3",
        text: "İsin yağını süzerek ayırmak",
      },
      {
        id: "o4",
        text: "Mürekkebin rengini açmak",
      },
    ],
  },
  {
    id: "q64-bedir-sefer",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Bacalardan çıkan kül",
      },
      {
        id: "o3",
        text: "Duvarlardan dökülen kireç tozu",
      },
      {
        id: "o4",
        text: "Avizelerden damlayan yağ",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Metal",
      },
      {
        id: "o2",
        text: "Kemik",
      },
      {
        id: "o3",
        text: "Kamış",
      },
      {
        id: "o4",
        text: "Ahşap",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Familiar worship, cultural object or standard migration purpose.",
    source: "https://islamansiklopedisi.org.tr/kalem",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 108-109 (basılı sayfa numarası değildir)",
    question:
      "Geleneksel kamış kalemi yontup açmakta kullanılan bıçak hangisidir?",
    explanation:
      "Kalemtıraş kalemin uç kısmını yontup biçimlendirmekte kullanılır.",
    difficulty: "easy",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Mürekkebi kâğıttan kazıyarak silmek",
      },
      {
        id: "o2",
        text: "Yazı satırlarını eşit aralıklarla çizmek",
      },
      {
        id: "o4",
        text: "Kalem ağzını aşınmaya karşı kaplamak",
      },
    ],
  },
  {
    id: "q63-selimiye-bani",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Bitkilerin yaprak ve çiçeklerinden",
      },
      {
        id: "o4",
        text: "Geometrik yıldız örgülerinden",
      },
      {
        id: "o2",
        text: "Hayvansal biçimlerden",
      },
      {
        id: "o1",
        text: "Bulut ve dalga tasvirlerinden",
      },
    ],
  },
  {
    id: "e150-history-002",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope. Specify transparent underglaze scope; TDV Çini lines 94 and 131 reread on 2026-11-26.",
    source: "https://islamansiklopedisi.org.tr/cini",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 94,131 (basılı sayfa numarası değildir)",
    question:
      "Sır altı çinide fırınlanan saydam sırın levha üzerinde oluşturduğu temel katman hangisidir?",
    explanation:
      "Çini sanatında sırın erimesi, levha üzerinde koruyucu bir tabaka oluşturur.",
    difficulty: "medium",
    conceptGroup: "v74-tile-glaze-protective-layer",
    options: [
      {
        id: "o1",
        text: "Boyayı örten kalın ve mat bir astar",
      },
      {
        id: "o2",
        text: "Koruyucu saydam bir tabaka",
      },
      {
        id: "o3",
        text: "Sırlamadan önce sürülen kil tabakası",
      },
      {
        id: "o4",
        text: "Hamura yapıştırılan renkli kâğıt",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Yüzeyi yazıdan sonra altınlamaya hazırlar",
      },
      {
        id: "o3",
        text: "Lifleri renklendirip desen oluşturur",
      },
      {
        id: "o4",
        text: "Kâğıdı cilt sırtına bağlamayı sağlar",
      },
    ],
  },
  {
    id: "q49-taberi-010",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Teknedeki suyu koyulaştırmak",
      },
      {
        id: "o3",
        text: "Kâğıdın emiciliğini artırmak",
      },
      {
        id: "o4",
        text: "Boyaların tekne dibine çökmesini sağlamak",
      },
    ],
  },
  {
    id: "q57-vakifgay",
    reason:
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Narrow historical, technical or biographical information. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
    source: "https://islamansiklopedisi.org.tr/med",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 102 (basılı sayfa numarası değildir)",
    question:
      "Tecvidde ârız sükûnun vakf ve vasıl bakımından ayırt edici özelliği nedir?",
    explanation:
      "Ârız sükûn, kelimede durulduğunda ortaya çıkar; okuyuş birleştirildiğinde düşer.",
    difficulty: "hard",
    conceptGroup: "v74-arid-sukun-stop-versus-connection",
    options: [
      {
        id: "o3",
        text: "Dururken de devam ederken de aynı kalması",
      },
      {
        id: "o4",
        text: "Sadece okuyuşa başlarken ortaya çıkması",
      },
      {
        id: "o2",
        text: "Durunca ortaya çıkıp devam edince kaybolması",
      },
      {
        id: "o1",
        text: "Yalnız iki kelime bağlandığında ortaya çıkması",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Nûnu açıkça kendi mahrecinden çıkarmak",
      },
      {
        id: "o2",
        text: "Gunneyle, izhar ile idgam arasında okumak",
      },
      {
        id: "o3",
        text: "Nûnu sonraki harfe tamamen katmak",
      },
      {
        id: "o4",
        text: "Nûnu mîm sesine çevirmek",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    source: "https://islamansiklopedisi.org.tr/iklab",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96 (basılı sayfa numarası değildir)",
    question:
      "İklâbda bâ harfinden önceki sâkin nûn veya tenvin hangi sese çevrilir?",
    explanation:
      "İklâb, bâdan önceki sâkin nûn veya tenvinin mîm olarak okunmasıdır.",
    difficulty: "medium",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option difficulty review: Specialised recitation technique.",
    source: "https://islamansiklopedisi.org.tr/sekte",
    locator:
      "Elektronik madde, erişim anındaki metin satırları 96-97 (basılı sayfa numarası değildir)",
    question: "Kur’an okuyuşunda sekteyi belirleyen duruş nasıl yapılır?",
    explanation:
      "Sekte, sesi kısa süre kesip nefes almadan okuyuşa devam etmektir.",
    difficulty: "hard",
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
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "33/72; physical PDF 450",
    question:
      "Ahzâb 33/72’de göklerin, yerin ve dağların yüklenmekten çekindiği emaneti kim yüklenir?",
    explanation:
      "Âyet, emanetin teklif edildiği varlıkların çekinmesine karşı onu insanın yüklendiğini söyler.",
    difficulty: "medium",
    conceptGroup: "v74-trust-borne-human",
    options: [
      {
        id: "o2",
        text: "Melekler",
      },
      {
        id: "o4",
        text: "Hayvanlar",
      },
      {
        id: "o3",
        text: "İnsan",
      },
      {
        id: "o1",
        text: "Bitkiler",
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
      "Replace a confirmed redundant fact in the staged candidate only; preserve original ID/category/key/option IDs and full historical v73 record. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Kur’an’ın anlamını açıklayan müfessirden dinlemek",
      },
      {
        id: "o3",
        text: "Arap şiirini iyi söyleyen şairden dinlemek",
      },
      {
        id: "o4",
        text: "Kıraat tarihini yazan müelliften dinlemek",
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
      "Replace newly confirmed reverse-form fact overlap in staged candidate only; original v73 and lookup IDs remain intact. Full-option review: replace irrelevant or giveaway distractors with credible alternatives within the stated source scope.",
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
        text: "Sözünü hatırlayıp hemen yerine getirmesi",
      },
      {
        id: "o3",
        text: "Sözünü başkasına bildirmekle yetinmesi",
      },
      {
        id: "o4",
        text: "Sözün yerine yeni bir söz vermesi",
      },
    ],
  },
  {
    id: "quran-008",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "quran-011",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "quran-013",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "prophets-006",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "prophets-009",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "prophets-010",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "history-009",
    reason:
      "Full-option difficulty review: Well-known siyer term, chronology or straightforward verse comprehension does not require advanced specialist recall.",
    difficulty: "medium",
  },
  {
    id: "history-012",
    reason:
      "Full-option difficulty review: Well-known siyer term, chronology or straightforward verse comprehension does not require advanced specialist recall.",
    difficulty: "medium",
  },
  {
    id: "general-010",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "pilot-quran-001",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "pilot-quran-002",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "pilot-quran-004",
    reason:
      "Full-option difficulty review: Well-known siyer term, chronology or straightforward verse comprehension does not require advanced specialist recall.",
    difficulty: "medium",
  },
  {
    id: "pilot-prophets-002",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "pilot-prophets-004",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "pilot-general-003",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "quran-meaning-v72-011",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "quran-meaning-v72-032",
    reason:
      "Full-option difficulty review: Well-known siyer term, chronology or straightforward verse comprehension does not require advanced specialist recall.",
    difficulty: "medium",
  },
  {
    id: "e150-prophets-002",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "e150-prophets-004",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "e150-prophets-005",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "e150-prophets-006",
    reason:
      "Full-option difficulty review: Well-known siyer term, chronology or straightforward verse comprehension does not require advanced specialist recall.",
    difficulty: "medium",
  },
  {
    id: "e150-prophets-007",
    reason:
      "Full-option difficulty review: Introductory religious/cultural recognition or well-known story detail, rather than advanced knowledge.",
    difficulty: "easy",
  },
  {
    id: "e150-prophets-019",
    reason:
      "Full-option difficulty review: Recognised siyer milestone or story detail rather than advanced recall.",
    difficulty: "medium",
  },
  {
    id: "e150-prophets-027",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "e150-prophets-029",
    reason:
      "Full-option difficulty review: Recognised siyer milestone or story detail rather than advanced recall.",
    difficulty: "medium",
  },
  {
    id: "e150-prophets-031",
    reason:
      "Full-option difficulty review: Recognised siyer milestone or story detail rather than advanced recall.",
    difficulty: "medium",
  },
  {
    id: "e150-prophets-040",
    reason:
      "Full-option difficulty review: Recognised siyer milestone or story detail rather than advanced recall.",
    difficulty: "medium",
  },
  {
    id: "e150-history-004",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "e150-history-006",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "e150-history-011",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "e150-history-012",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "e150-history-022",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "e150-history-023",
    reason:
      "Full-option difficulty review: Recognised siyer milestone or story detail rather than advanced recall.",
    difficulty: "medium",
  },
  {
    id: "e150-history-027",
    reason:
      "Full-option difficulty review: Recognised siyer milestone or story detail rather than advanced recall.",
    difficulty: "medium",
  },
  {
    id: "e150-general-003",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "e150-general-014",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "e150-general-022",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "e150-general-025",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "e150-general-026",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "e150-general-027",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "e150-general-035",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "v7-quran-001",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "v7-quran-003",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "v7-prophets-005",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "v7-history-001",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "v7-history-004",
    reason:
      "Full-option difficulty review: Recognised siyer milestone or story detail rather than advanced recall.",
    difficulty: "medium",
  },
  {
    id: "v7-history-005",
    reason:
      "Full-option difficulty review: Recognised siyer milestone or story detail rather than advanced recall.",
    difficulty: "medium",
  },
  {
    id: "v8-quran-001",
    reason:
      "Full-option difficulty review: Familiar worship, story or cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "v8-quran-005",
    reason:
      "Full-option difficulty review: Recognised siyer milestone or story detail rather than advanced recall.",
    difficulty: "medium",
  },
  {
    id: "v8-general-001",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v8-general-002",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v9-quran-001",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v9-quran-003",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v9-quran-007",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v9-prophets-006",
    reason:
      "Full-option difficulty review: Basic scholarly or siyer identification with plausible alternatives; beyond beginner but not specialist.",
    difficulty: "medium",
  },
  {
    id: "v9-history-010",
    reason:
      "Full-option difficulty review: Basic scholarly or siyer identification with plausible alternatives; beyond beginner but not specialist.",
    difficulty: "medium",
  },
  {
    id: "v9-general-001",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v9-general-006",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v9-general-007",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v10-quran-001",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v10-quran-003",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v10-quran-004",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v10-quran-005",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v10-quran-012",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v10-prophets-013",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v10-history-001",
    reason:
      "Full-option difficulty review: Basic scholarly or siyer identification with plausible alternatives; beyond beginner but not specialist.",
    difficulty: "medium",
  },
  {
    id: "v10-history-002",
    reason:
      "Full-option difficulty review: Basic scholarly or siyer identification with plausible alternatives; beyond beginner but not specialist.",
    difficulty: "medium",
  },
  {
    id: "v10-history-003",
    reason:
      "Full-option difficulty review: Basic scholarly or siyer identification with plausible alternatives; beyond beginner but not specialist.",
    difficulty: "medium",
  },
  {
    id: "v10-general-001",
    reason:
      "Full-option difficulty review: Basic scholarly or siyer identification with plausible alternatives; beyond beginner but not specialist.",
    difficulty: "medium",
  },
  {
    id: "v10-general-002",
    reason:
      "Full-option difficulty review: Basic scholarly or siyer identification with plausible alternatives; beyond beginner but not specialist.",
    difficulty: "medium",
  },
  {
    id: "v10-general-008",
    reason:
      "Full-option difficulty review: Basic scholarly or siyer identification with plausible alternatives; beyond beginner but not specialist.",
    difficulty: "medium",
  },
  {
    id: "v10-general-011",
    reason:
      "Full-option difficulty review: Basic scholarly or siyer identification with plausible alternatives; beyond beginner but not specialist.",
    difficulty: "medium",
  },
  {
    id: "v10-general-012",
    reason:
      "Full-option difficulty review: Basic scholarly or siyer identification with plausible alternatives; beyond beginner but not specialist.",
    difficulty: "medium",
  },
  {
    id: "v11-quran-001",
    reason:
      "Full-option difficulty review: Common worship/recitation vocabulary, brief well-known surah or basic moral recognition.",
    difficulty: "easy",
  },
  {
    id: "v11-quran-003",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v11-quran-007",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v11-quran-008",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v11-quran-009",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v11-quran-012",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v11-quran-013",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v11-prophets-004",
    reason:
      "Full-option difficulty review: Well-known scientific-cultural identification or standard story detail; not advanced memorisation.",
    difficulty: "medium",
  },
  {
    id: "v11-prophets-007",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v11-prophets-009",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v11-history-001",
    reason:
      "Full-option difficulty review: Well-known scientific-cultural identification or standard story detail; not advanced memorisation.",
    difficulty: "medium",
  },
  {
    id: "v11-history-002",
    reason:
      "Full-option difficulty review: Well-known scientific-cultural identification or standard story detail; not advanced memorisation.",
    difficulty: "medium",
  },
  {
    id: "v11-history-004",
    reason:
      "Full-option difficulty review: Well-known scientific-cultural identification or standard story detail; not advanced memorisation.",
    difficulty: "medium",
  },
  {
    id: "v11-general-007",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v12-quran-001",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v12-quran-011",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v12-prophets-004",
    reason:
      "Full-option difficulty review: Well-known scientific-cultural identification or standard story detail; not advanced memorisation.",
    difficulty: "medium",
  },
  {
    id: "v12-prophets-005",
    reason:
      "Full-option difficulty review: Well-known scientific-cultural identification or standard story detail; not advanced memorisation.",
    difficulty: "medium",
  },
  {
    id: "v12-prophets-011",
    reason:
      "Full-option difficulty review: Well-known scientific-cultural identification or standard story detail; not advanced memorisation.",
    difficulty: "medium",
  },
  {
    id: "v12-history-002",
    reason:
      "Full-option difficulty review: Well-known scientific-cultural identification or standard story detail; not advanced memorisation.",
    difficulty: "medium",
  },
  {
    id: "v12-history-007",
    reason:
      "Full-option difficulty review: Well-known scientific-cultural identification or standard story detail; not advanced memorisation.",
    difficulty: "medium",
  },
  {
    id: "v13-quran-001",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v13-quran-004",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v13-quran-013",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v13-prophets-003",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v13-prophets-005",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v13-prophets-007",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v13-prophets-010",
    reason:
      "Full-option difficulty review: Familiar brief surah, basic belief/worship, recognised story or plain moral teaching.",
    difficulty: "easy",
  },
  {
    id: "v13-prophets-011",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "v13-prophets-012",
    reason:
      "Full-option difficulty review: Well-known story or standard scholarly term rather than specialist detail.",
    difficulty: "medium",
  },
  {
    id: "v13-prophets-013",
    reason:
      "Full-option difficulty review: Well-known story or standard scholarly term rather than specialist detail.",
    difficulty: "medium",
  },
  {
    id: "v13-history-002",
    reason:
      "Full-option difficulty review: Well-known story or standard scholarly term rather than specialist detail.",
    difficulty: "medium",
  },
  {
    id: "v13-history-003",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "v13-history-004",
    reason:
      "Full-option difficulty review: Well-known story or standard scholarly term rather than specialist detail.",
    difficulty: "medium",
  },
  {
    id: "v13-history-006",
    reason:
      "Full-option difficulty review: Well-known story or standard scholarly term rather than specialist detail.",
    difficulty: "medium",
  },
  {
    id: "v13-history-008",
    reason:
      "Full-option difficulty review: Well-known story or standard scholarly term rather than specialist detail.",
    difficulty: "medium",
  },
  {
    id: "v13-history-009",
    reason:
      "Full-option difficulty review: Specialised duration or less-known genealogical identity.",
    difficulty: "hard",
  },
  {
    id: "v13-general-001",
    reason:
      "Full-option difficulty review: Well-known story or standard scholarly term rather than specialist detail.",
    difficulty: "medium",
  },
  {
    id: "v13-general-006",
    reason:
      "Full-option difficulty review: Well-known story or standard scholarly term rather than specialist detail.",
    difficulty: "medium",
  },
  {
    id: "v13-general-007",
    reason:
      "Full-option difficulty review: Well-known story or standard scholarly term rather than specialist detail.",
    difficulty: "medium",
  },
  {
    id: "learn-women-010",
    reason:
      "Full-option difficulty review: Specialised duration or less-known genealogical identity.",
    difficulty: "hard",
  },
  {
    id: "learn-women-018",
    reason:
      "Full-option difficulty review: Specialised duration or less-known genealogical identity.",
    difficulty: "hard",
  },
  {
    id: "learn-history-002",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "learn-dua-009",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "learn-akaid-009",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "learn-akaid-012",
    reason:
      "Full-option difficulty review: Well-known story or standard scholarly term rather than specialist detail.",
    difficulty: "medium",
  },
  {
    id: "learn-akaid-019",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "learn-akaid-005",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "learn-akaid-013",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "learn-akaid-014",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "user200-106",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "user200-107",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "user200-119",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "learn-akaid-008",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "learn-akaid-020",
    reason:
      "Full-option difficulty review: Foundational belief, common moral term or familiar cultural recognition.",
    difficulty: "easy",
  },
  {
    id: "learn-akaid-010",
    reason:
      "Full-option difficulty review: Basic belief or everyday moral teaching with direct comprehension.",
    difficulty: "easy",
  },
  {
    id: "learn-akaid-002",
    reason:
      "Full-option difficulty review: Basic belief or everyday moral teaching with direct comprehension.",
    difficulty: "easy",
  },
  {
    id: "learn-women-007",
    reason:
      "Full-option difficulty review: Detailed bibliographic structure, named location, lesser-known rank or participant requires specialist recall.",
    difficulty: "hard",
  },
  {
    id: "learn-akaid-017",
    reason:
      "Full-option difficulty review: Basic belief or everyday moral teaching with direct comprehension.",
    difficulty: "easy",
  },
  {
    id: "q43-mulk-15",
    reason:
      "Full-option difficulty review: Basic belief or everyday moral teaching with direct comprehension.",
    difficulty: "easy",
  },
  {
    id: "q43-insan-9",
    reason:
      "Full-option difficulty review: Basic belief or everyday moral teaching with direct comprehension.",
    difficulty: "easy",
  },
  {
    id: "q43-nebe-9",
    reason:
      "Full-option difficulty review: Basic belief or everyday moral teaching with direct comprehension.",
    difficulty: "easy",
  },
  {
    id: "q43-mutaffifin-2",
    reason:
      "Full-option difficulty review: Basic belief or everyday moral teaching with direct comprehension.",
    difficulty: "easy",
  },
  {
    id: "q44-duha-11",
    reason:
      "Full-option difficulty review: Basic belief or everyday moral teaching with direct comprehension.",
    difficulty: "easy",
  },
  {
    id: "q44-insirah-7",
    reason:
      "Full-option difficulty review: Basic belief or everyday moral teaching with direct comprehension.",
    difficulty: "easy",
  },
  {
    id: "q44-insirah-8",
    reason:
      "Full-option difficulty review: Basic belief or everyday moral teaching with direct comprehension.",
    difficulty: "easy",
  },
  {
    id: "q45-haldun-mukaddime",
    reason:
      "Full-option difficulty review: Detailed bibliographic structure, named location, lesser-known rank or participant requires specialist recall.",
    difficulty: "hard",
  },
  {
    id: "q45-haldun-ilim",
    reason:
      "Full-option difficulty review: Detailed bibliographic structure, named location, lesser-known rank or participant requires specialist recall.",
    difficulty: "hard",
  },
  {
    id: "q45-cezeri-kitap",
    reason:
      "Full-option difficulty review: Detailed bibliographic structure, named location, lesser-known rank or participant requires specialist recall.",
    difficulty: "hard",
  },
  {
    id: "q45-cezeri-amir",
    reason:
      "Full-option difficulty review: Detailed bibliographic structure, named location, lesser-known rank or participant requires specialist recall.",
    difficulty: "hard",
  },
  {
    id: "q45-ibnsina-ilac",
    reason:
      "Full-option difficulty review: Detailed bibliographic structure, named location, lesser-known rank or participant requires specialist recall.",
    difficulty: "hard",
  },
  {
    id: "q45-ibnsina-organ",
    reason:
      "Full-option difficulty review: Detailed bibliographic structure, named location, lesser-known rank or participant requires specialist recall.",
    difficulty: "hard",
  },
  {
    id: "q45-biruni-sehir",
    reason:
      "Full-option difficulty review: Detailed bibliographic structure, named location, lesser-known rank or participant requires specialist recall.",
    difficulty: "hard",
  },
  {
    id: "q47-suleyman-028",
    reason:
      "Full-option difficulty review: Basic belief or everyday moral teaching with direct comprehension.",
    difficulty: "easy",
  },
  {
    id: "q47-oruç-048",
    reason:
      "Full-option difficulty review: Familiar worship, cultural object or standard migration purpose.",
    difficulty: "easy",
  },
  {
    id: "q48-ummu-seleme-008",
    reason:
      "Full-option difficulty review: Narrow biographical, book-section or chronological detail.",
    difficulty: "hard",
  },
  {
    id: "q48-hicret-018",
    reason:
      "Full-option difficulty review: Familiar worship, cultural object or standard migration purpose.",
    difficulty: "easy",
  },
  {
    id: "q49-biruni-006",
    reason:
      "Full-option difficulty review: Narrow biographical, book-section or chronological detail.",
    difficulty: "hard",
  },
  {
    id: "q49-taberi-013",
    reason:
      "Full-option difficulty review: Narrow biographical, book-section or chronological detail.",
    difficulty: "hard",
  },
  {
    id: "q49-kutub-031",
    reason:
      "Full-option difficulty review: Standard scholarly process or recognised siyer epithet.",
    difficulty: "medium",
  },
  {
    id: "q50-suayb-009",
    reason:
      "Full-option difficulty review: Standard scholarly process or recognised siyer epithet.",
    difficulty: "medium",
  },
  {
    id: "q51-muahat-010",
    reason:
      "Full-option difficulty review: Familiar worship, cultural object or standard migration purpose.",
    difficulty: "easy",
  },
  {
    id: "q51-muahat-014",
    reason:
      "Full-option difficulty review: Narrow biographical, book-section or chronological detail.",
    difficulty: "hard",
  },
  {
    id: "q51-suffe-021",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q52-sadaka-010",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q52-zekat-014",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q52-zekat-015",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q53-beled-015",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q53-beled-016",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q54-ala-022",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q54-ala-023",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q55-tekvir-010",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q56-akabe-egitmen",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q56-hicret-mescid",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q56-hicret-donus",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q56-hicret-vesika",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q57-yusufbagis",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q57-musayed",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q57-musadeniz",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q57-hudyer",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q57-hendekahzab",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q57-tebukusre",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q57-gazvetanim",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q58-seleme-asli",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q58-suleym-ogul",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q58-tefsir-sozluk",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q59-beyt-mansur",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q59-evliya-yazim",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q59-battuta-kadi",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q59-kuscu-medrese",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q59-katib-ilgi",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q60-erkam-hizmet",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q60-suffe-adi",
    reason:
      "Lower-similarity manual review confirmed a repeated tested fact; replace with distinct source-compared verse information while preserving frozen history.",
    difficulty: "easy",
    question:
      "Yâsîn 36/55’in Kur’an Yolu mealinde cennetliklerin meşguliyeti nasıl anlatılır?",
    explanation:
      "Mealde o gün cennetliklerin safa sürmekle meşgul olduğu belirtilir.",
    options: [
      {
        id: "o4",
        text: "Hesaplarını beklemek",
      },
      {
        id: "o3",
        text: "Safa sürmek",
      },
      {
        id: "o1",
        text: "Geçmiş amellerini tartmak",
      },
      {
        id: "o2",
        text: "Şahitlerin gelmesini beklemek",
      },
    ],
    conceptGroup: "v74-paradise-people-enjoyment",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "36/55; physical PDF 467",
  },
  {
    id: "q60-suffe-egitim",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q60-nebevi-kible",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q60-haram-uc",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q61-salihpeygamber-birlik",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q62-hac-hanefi",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q62-tavaf-kudum",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q62-fitre-gayesi",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q62-sadaka-genis",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q63-karatay-tarih",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q63-karatay-bani",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q63-konya-sircali",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q63-bursa-bitis",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q63-bursa-vakif",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q63-nizamiye-bagdat",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q63-istanbul-sul",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q64-huneyn-kuman",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q64-huneyn-esir",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q64-taif-dua",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q64-medine-hicret",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q64-senet-fetih",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q64-veda-tek",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q65-hucurat-4",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q65-hadid-25",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q66-kehf-11",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q66-kehf-16",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q66-kehf-46",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q66-kehf-50",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q66-kehf-61",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q66-kehf-96",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q67-kasas-40",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q67-ankebut-3",
    reason:
      "Final semantic pass: replace duplicate fact or focus overlapping prayer on an independently checked additional request; preserve historical identity.",
    difficulty: "medium",
    question:
      "Duhân 44/10–11’de göğün insanları kuşatacak hangi şeye bürüneceği bildirilir?",
    explanation:
      "Âyette bütün insanları kuşatan belirgin bir duman, acı veren azap olarak anlatılır.",
    options: [
      {
        id: "o2",
        text: "Yoğun bir sise",
      },
      {
        id: "o3",
        text: "Kalın bir buz tabakasına",
      },
      {
        id: "o4",
        text: "Belirgin bir dumana",
      },
      {
        id: "o1",
        text: "Geniş bir kum bulutuna",
      },
    ],
    conceptGroup: "v74-future-sky-covering-smoke",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "44/10; physical PDF 526",
  },
  {
    id: "q67-ankebut-8",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q67-rum-21",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q68-hadis-sozluk",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q68-sitte-davud",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q68-sitte-nesai",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q68-sitte-dort",
    reason:
      "Final semantic pass: replace duplicate fact or focus overlapping prayer on an independently checked additional request; preserve historical identity.",
    difficulty: "easy",
    question:
      "Müddessir 74/31’e göre cehennemin işleriyle görevlendirilenler hangi varlık türündendir?",
    explanation:
      "Cehennemin işleriyle yalnız meleklerin görevlendirildiği bildirilir.",
    options: [
      {
        id: "o1",
        text: "İnsanlardan",
      },
      {
        id: "o3",
        text: "Cinlerden",
      },
      {
        id: "o4",
        text: "Şeytanlardan",
      },
      {
        id: "o2",
        text: "Meleklerden",
      },
    ],
    conceptGroup: "v74-hell-keepers-angels",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "74/31; physical PDF 621",
  },
  {
    id: "q68-sunen-konu",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q68-cami-ibadet",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q68-cami-buh",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q68-cami-mus",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q68-buhari-vefat",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-zeydbsabit-annesi",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-zeydbsabit-sure",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-zeydbsabit-danisman",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-abdullahbabbas-anne",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-abdullahbabbas-teyze",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-enesbmalik-kunye",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-enesbmalik-teyze",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-enesbmalik-veda",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q69-bilalihabesi-anne",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-bilalihabesi-sabah",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q69-bilalihabesi-kabe",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q69-ebueyyubelensari-kabile",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-ebueyyubelensari-akabe",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-ebueyyubelensari-kitap",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-selmanifarisi-seyahat",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q69-selmanifarisi-kardes",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q70-ebu-hanife-ticaret",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q70-safii-anne",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q70-safii-ilk",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q70-malik-b-enes-dogum",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q70-malik-b-enes-ilk-hoca",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q70-malik-b-enes-tazi",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q70-gazzali-kunye",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q71-sure-28",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q71-elyesa-elisa",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q71-hatice-anne",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q71-aise-anne",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q71-aise-kunye",
    reason:
      "Full-option difficulty review: Narrow historical, technical or biographical information.",
    difficulty: "hard",
  },
  {
    id: "q71-kurban-koyun",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "q71-kurban-buyuk",
    reason:
      "Full-option difficulty review: Basic widely taught concept or familiar story.",
    difficulty: "easy",
  },
  {
    id: "e150-prophets-014",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "e150-general-008",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "v12-general-006",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "v13-quran-005",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "v13-quran-006",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "v13-general-011",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "learn-women-005",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "learn-women-017",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "learn-women-021",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "learn-dua-008",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "learn-women-015",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "learn-dua-028",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q43-mulk-10",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q43-mulk-13",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q43-insan-8",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q43-nebe-8",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q43-abese-24",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q43-abese-25",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q44-leyl-5",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q44-duha-9",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q47-bedir-003",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q47-hudeybiye-008",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q47-hudeybiye-010",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q47-hudeybiye-013",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q47-beyat-014",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q47-suleyman-025",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q47-harun-031",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q47-musa-033",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q47-musa-034",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q47-hac-037",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q48-hicret-016",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q48-yusuf-034",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q49-kutub-026",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    difficulty: "easy",
    question:
      "Kasas 28/17’de Mûsâ, kendisine verilen nimetler karşısında hangi sözü verir?",
    explanation:
      "Mûsâ, Allah’ın nimeti karşısında suçlulara destek olmayacağını söyler.",
    conceptGroup: "v74-musa-pledge-not-support-criminals",
    options: [
      {
        id: "o3",
        text: "Hiç yolculuk yapmamayı",
      },
      {
        id: "o4",
        text: "Bir daha ticaret yapmamayı",
      },
      {
        id: "o2",
        text: "Suçlulara arka çıkmamayı",
      },
      {
        id: "o1",
        text: "Şehirde görev üstlenmemeyi",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "28/17; physical PDF 408",
  },
  {
    id: "q50-hud-004",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q50-suayb-008",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q50-zekeriyya-017",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q50-zekeriyya-021",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q51-suffe-018",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q51-suffe-022",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q52-vakif-001",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q52-fitre-016",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q52-kurban-025",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q53-fecr-003",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q53-beled-011",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q53-beled-012",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q53-beled-018",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q53-sems-025",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q53-gasiye-028",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q53-gasiye-030",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q53-gasiye-033",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q53-gasiye-034",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q54-buruc-001",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q54-buruc-002",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q54-tarik-008",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q54-tarik-009",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q54-tarik-010",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q54-tarik-012",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q54-ala-016",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q54-ala-017",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q54-ala-018",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q54-ala-019",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-tekvir-001",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-tekvir-002",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-tekvir-003",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-tekvir-004",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-tekvir-005",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-tekvir-007",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-infitar-011",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-infitar-012",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-infitar-013",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-infitar-014",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-infitar-015",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-infitar-016",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-insikak-019",
    reason:
      "Lower-similarity manual review confirmed a repeated tested fact; replace with distinct source-compared verse information while preserving frozen history.",
    difficulty: "medium",
    question: "Kāria 101/5’te dağların kıyametteki hâli neye benzetilir?",
    explanation:
      "Dağların dağınık ve hafif hâli, atılmış renkli yün tasviriyle anlatılır.",
    options: [
      {
        id: "o2",
        text: "Atılmış renkli yüne",
      },
      {
        id: "o1",
        text: "Yükselen beyaz dumana",
      },
      {
        id: "o3",
        text: "Yığılmış altınlara",
      },
      {
        id: "o4",
        text: "Kabarıp taşan suya",
      },
    ],
    conceptGroup: "v74-mountains-carded-colored-wool",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "101/5; physical PDF 655",
  },
  {
    id: "q55-insikak-020",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-insikak-024",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-insikak-025",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-kiyamet-028",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-kiyamet-029",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-kiyamet-030",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q55-kiyamet-031",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q57-nuhcift",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q57-hudumre",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q59-beyt-amac",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q59-beyt-sehir",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q59-evliya-cilt",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q59-battuta-eser",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q59-katib-cihan",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q60-erkam-sahip",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q60-erkam-omer",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q60-nebevi-ilk",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q61-salihpeygamber-zarar",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q61-meryem-dogum",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q61-isa-incil",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q62-arafat-konum",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q62-say-mekan",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q62-zekat-borclu",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q63-karatay-sehir",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q63-bursa-ulucami",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q63-nizamiye-bani",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q64-huneyn-hevazin",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q65-isra-22",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q65-isra-37",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q65-furkan-63",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q65-furkan-72",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q65-hucurat-2",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q65-hucurat-18",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q65-hadid-2",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q66-kehf-10",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q66-kehf-13",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q66-kehf-34",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q66-neml-17",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q66-neml-22",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    difficulty: "medium",
    question:
      "Yûsuf 12/97–98’de oğulları af dileyince Ya‘kūb ne yapacağını bildirir?",
    explanation:
      "Oğullarının isteğine karşı Ya‘kūb, onlar için Allah’tan bağışlanma dileyeceğini bildirir.",
    conceptGroup: "v74-yaqub-asks-forgiveness-sons",
    options: [
      {
        id: "o1",
        text: "Onları kralın huzuruna çıkaracağını",
      },
      {
        id: "o2",
        text: "Onlar için Rabbinden af dileyeceğini",
      },
      {
        id: "o3",
        text: "Bir kefâret miktarı belirleyeceğini",
      },
      {
        id: "o4",
        text: "Onlardan şahit getirmelerini isteyeceğini",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "12/98; physical PDF 257",
  },
  {
    id: "q66-meryem-7",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    difficulty: "medium",
    question:
      "Tâhâ 20/65’te sihirbazların Mûsâ’ya sunduğu seçim hangi konudadır?",
    explanation:
      "Sihirbazlar, önce Mûsâ’nın mı yoksa kendilerinin mi atacağını sorar.",
    conceptGroup: "v74-magicians-choice-first-cast",
    options: [
      {
        id: "o1",
        text: "Kimin konuşmayı yazacağı",
      },
      {
        id: "o2",
        text: "Kimin önce atacağı",
      },
      {
        id: "o3",
        text: "Hangi ödülün dağıtılacağı",
      },
      {
        id: "o4",
        text: "Hangi şehre gidileceği",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "20/65; physical PDF 332",
  },
  {
    id: "q67-kasas-4",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q67-kasas-7",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q67-kasas-24",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q67-ankebut-2",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q67-ankebut-26",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q67-ankebut-45",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q67-rum-17",
    reason:
      "Lower-similarity manual review confirmed a repeated tested fact; replace with distinct source-compared verse information while preserving frozen history.",
    difficulty: "medium",
    question:
      "Furkān 25/45’te gölgeye yol gösterici kılındığı bildirilen nedir?",
    explanation:
      "Gölgenin uzatılması anlatıldıktan sonra güneşin ona yol gösterici kılındığı belirtilir.",
    options: [
      {
        id: "o3",
        text: "Güneş",
      },
      {
        id: "o1",
        text: "Ay",
      },
      {
        id: "o2",
        text: "Yıldızlar",
      },
      {
        id: "o4",
        text: "Rüzgâr",
      },
    ],
    conceptGroup: "v74-sun-guide-shadow",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "25/45; physical PDF 382",
  },
  {
    id: "q67-rum-22",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q67-rum-23",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q68-sitte-buhari",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q68-sitte-muslim",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q68-sunen-tanim",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q68-cami-tanim",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q69-zeydbsabit-dogum",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q69-enesbmalik-yil",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q69-ebueyyubelensari-istanbul",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q69-abdullahbomerbhattab-hafsa",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q70-ebu-hanife-dogum",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q70-malik-b-enes-egitim",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q70-malik-b-enes-eser",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q70-ahmed-b-hanbel-eser",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q70-gazzali-ihya",
    reason:
      "Full-option difficulty review: Standard intermediate concept; not specialist detail.",
    difficulty: "medium",
  },
  {
    id: "q67-ankebut-36",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Bakara 2/30’da Allah’ın yeryüzünde yaratacağını meleklere bildirdiği varlık hangi sıfatla anılır?",
    explanation:
      "Âyette insanın yaratılışı, yeryüzünde bir halife yaratılacağının bildirilmesiyle anlatılır.",
    difficulty: "medium",
    conceptGroup: "v74-halife-earth-announcement",
    options: [
      {
        id: "o1",
        text: "Müjdeci",
      },
      {
        id: "o2",
        text: "Halife",
      },
      {
        id: "o3",
        text: "Kâtip",
      },
      {
        id: "o4",
        text: "Bekçi",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "2/30; physical PDF 10",
  },
  {
    id: "q67-kasas-30",
    reason:
      "Final semantic pass: replace duplicate fact or focus overlapping prayer on an independently checked additional request; preserve historical identity.",
    question:
      "Hümeze 104/6’da sözü edilen ateş kimin tutuşturduğu ateş olarak nitelenir?",
    explanation:
      "Hümeze sûresinde bu ateş, Allah’ın tutuşturulmuş ateşi olarak nitelenir.",
    difficulty: "medium",
    conceptGroup: "v74-humaza-fire-kindled-allah",
    options: [
      {
        id: "o1",
        text: "İnsanların",
      },
      {
        id: "o2",
        text: "Cinlerin",
      },
      {
        id: "o4",
        text: "Şeytanın",
      },
      {
        id: "o3",
        text: "Allah’ın",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "104/6; physical PDF 656",
  },
  {
    id: "q66-neml-name",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Yûsuf 12/83’te Ya‘kūb, oğullarından gelen haber karşısında kendisine düşen tutumu nasıl niteler?",
    explanation:
      "Ya‘kūb, ümidini Allah’a bağlayarak kendisine düşenin güzel bir sabır olduğunu söyler.",
    difficulty: "medium",
    conceptGroup: "v74-yaqub-beautiful-patience-response",
    options: [
      {
        id: "o1",
        text: "Kesin bir sessizlik",
      },
      {
        id: "o2",
        text: "Uzun bir yolculuk",
      },
      {
        id: "o3",
        text: "Yeni bir sözleşme",
      },
      {
        id: "o4",
        text: "Güzel bir sabır",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "12/83; physical PDF 256",
  },
  {
    id: "q66-meryem-25",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Tâhâ 20/58’de Firavun, Mûsâ’dan karşılaşma için ne belirlemesini ister?",
    explanation:
      "Firavun, iki tarafın da caymayacağı bir yerde karşılaşma zamanı belirlenmesini ister.",
    difficulty: "medium",
    conceptGroup: "v74-pharaoh-appoint-meeting-time",
    options: [
      {
        id: "o2",
        text: "Uygun yerde bir buluşma zamanı",
      },
      {
        id: "o1",
        text: "İki tarafın asker sayısını",
      },
      {
        id: "o3",
        text: "Kazanana verilecek hediyeyi",
      },
      {
        id: "o4",
        text: "Tartışmayı yazacak kâtibi",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "20/58; physical PDF 331",
  },
  {
    id: "q66-neml-18",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Enbiyâ 21/51’in Kur’an Yolu mealinde İbrâhim’e verilen yetenek nasıl anlatılır?",
    explanation:
      "Mealde İbrâhim’e daha önce doğru düşünme yeteneği verildiği belirtilir.",
    difficulty: "medium",
    conceptGroup: "v74-ibrahim-given-right-judgment",
    options: [
      {
        id: "o3",
        text: "Zırh yapma yeteneği",
      },
      {
        id: "o4",
        text: "Kuşların dilini anlama",
      },
      {
        id: "o1",
        text: "Doğru düşünme yeteneği",
      },
      {
        id: "o2",
        text: "Rüyaları yorumlama",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "21/51; physical PDF 342",
  },
  {
    id: "q66-neml-24",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Enbiyâ 21/60’ta putlardan söz eden İbrâhim, kavmindekilerin anlatımında nasıl tanıtılır?",
    explanation:
      "Kavmindekiler, putları diline doladığını işittikleri İbrâhim adlı bir gençten söz eder.",
    difficulty: "medium",
    conceptGroup: "v74-ibrahim-described-youth",
    options: [
      {
        id: "o4",
        text: "Bir genç olarak",
      },
      {
        id: "o1",
        text: "Bir hükümdar olarak",
      },
      {
        id: "o2",
        text: "Bir kervancı olarak",
      },
      {
        id: "o3",
        text: "Bir kâhin olarak",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "21/60–61; physical PDF 343",
  },
  {
    id: "q65-isra-35",
    reason:
      "Final semantic pass: replace duplicate fact or focus overlapping prayer on an independently checked additional request; preserve historical identity.",
    question:
      "Furkān 25/53’te iki deniz suyu hangi karşıt niteliklerle anlatılır?",
    explanation:
      "İki denizin biri tatlı ve içimi hoş, diğeri tuzlu ve acı olarak nitelenir.",
    difficulty: "medium",
    conceptGroup: "v74-two-seas-sweet-salty",
    options: [
      {
        id: "o3",
        text: "Sıcak ve bulanık; soğuk ve durgun",
      },
      {
        id: "o4",
        text: "Tatlı ve susuzluğu giderici; tuzlu ve acı",
      },
      {
        id: "o1",
        text: "Sığ ve aydınlık; derin ve karanlık",
      },
      {
        id: "o2",
        text: "Hızlı ve köpüklü; yavaş ve berrak",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "25/53; physical PDF 383",
  },
  {
    id: "q55-insikak-026",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Şuarâ 26/49–50’de Firavun’un tehdidine karşı iman eden sihirbazlar dönüşlerinin kime olduğunu söyler?",
    explanation:
      "Tehdit karşısında sihirbazlar, sonuçta Rablerine döneceklerini söyleyerek sebat eder.",
    difficulty: "medium",
    conceptGroup: "v74-magicians-return-lord-threat",
    options: [
      {
        id: "o3",
        text: "Eski hocalarına",
      },
      {
        id: "o4",
        text: "Kabile reislerine",
      },
      {
        id: "o2",
        text: "Rablerine",
      },
      {
        id: "o1",
        text: "Saray görevlilerine",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "26/50; physical PDF 388",
  },
  {
    id: "q65-furkan-65",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Neml 27/7’de Mûsâ, gördüğü ateşten ailesi için ne getirebileceğini söyler?",
    explanation:
      "Mûsâ, oradan bir haber ya da ailesinin ısınması için kor getirmeyi umduğunu söyler.",
    difficulty: "medium",
    conceptGroup: "v74-musa-embers-warm-family",
    options: [
      {
        id: "o3",
        text: "Isınmaları için bir parça kor",
      },
      {
        id: "o1",
        text: "Yol için pişmiş ekmek",
      },
      {
        id: "o2",
        text: "Çadırı onarmak için demir",
      },
      {
        id: "o4",
        text: "Yolculuk için bir kandil",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "27/7; physical PDF 398",
  },
  {
    id: "q67-rum-40",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Neml 27/10’da Mûsâ, asâsını yılan gibi kıpırdar görünce ilk olarak ne yapar?",
    explanation:
      "İlk tepkisi dönüp kaçmaktır; ardından kendisine korkmaması bildirilir.",
    difficulty: "medium",
    conceptGroup: "v74-musa-turns-runs-moving-staff",
    options: [
      {
        id: "o2",
        text: "Asâyı bezle sarar",
      },
      {
        id: "o3",
        text: "Ailesini yanına çağırır",
      },
      {
        id: "o4",
        text: "Yere bir çember çizer",
      },
      {
        id: "o1",
        text: "Arkasına bakmadan dönüp kaçar",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "27/10; physical PDF 398",
  },
  {
    id: "q54-tarik-013",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Sâffât 37/89’da İbrâhim’in söylediği söz, Kur’an Yolu mealinde nasıl verilir?",
    explanation:
      "Mealde İbrâhim’in sözü rahatsız olduğunu bildiren kısa bir cümleyle aktarılır.",
    difficulty: "medium",
    conceptGroup: "v74-ibrahim-statement-unwell",
    options: [
      {
        id: "o4",
        text: "Ben yolcuyum",
      },
      {
        id: "o2",
        text: "Ben rahatsızım",
      },
      {
        id: "o1",
        text: "Ben açım",
      },
      {
        id: "o3",
        text: "Ben yorgunum",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "37/89; physical PDF 473",
  },
  {
    id: "q61-salihpeygamber-deve",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Bakara 2/35’te Âdem ile eşine cennette özellikle hangi sınır bildirilir?",
    explanation:
      "Diğer nimetlerden yararlanabilecekleri bildirilirken belirli bir ağaca yaklaşmaları yasaklanır; ağacın türü bu âyette adlandırılmaz.",
    difficulty: "easy",
    conceptGroup: "v74-adam-wife-forbidden-approach-tree",
    options: [
      {
        id: "o1",
        text: "Bulundukları yerden ayrılmamaları",
      },
      {
        id: "o2",
        text: "Meleklerle konuşmamaları",
      },
      {
        id: "o3",
        text: "Gösterilen ağaca yaklaşmamaları",
      },
      {
        id: "o4",
        text: "Birbirlerinden uzak durmaları",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "2/35; physical PDF 11",
  },
  {
    id: "q61-hud-ad",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Âl-i İmrân 3/36’da doğan çocuğa Meryem adını verdiğini söyleyen kimdir?",
    explanation:
      "İmrân’ın eşi, doğurduğu çocuğa Meryem adını verdiğini söyler.",
    difficulty: "medium",
    conceptGroup: "v74-maryam-name-given-mother",
    options: [
      {
        id: "o1",
        text: "Annesi",
      },
      {
        id: "o2",
        text: "Zekeriyyâ",
      },
      {
        id: "o3",
        text: "Babası",
      },
      {
        id: "o4",
        text: "Mâbedin görevlisi",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "3/36; physical PDF 61",
  },
  {
    id: "q61-salihpeygamber-semud",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "A‘râf 7/69’da Hûd, kavminin hangi topluluğun ardından onların yerine getirildiğini hatırlatır?",
    explanation:
      "Hûd’un hitabında kavmine Nûh kavminden sonra onların yerine getirildikleri hatırlatılır.",
    difficulty: "medium",
    conceptGroup: "v74-ad-successors-noah-people",
    options: [
      {
        id: "o1",
        text: "Semûd kavminin",
      },
      {
        id: "o2",
        text: "Medyen halkının",
      },
      {
        id: "o3",
        text: "Sebe halkının",
      },
      {
        id: "o4",
        text: "Nûh kavminin",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "7/69; physical PDF 168",
  },
  {
    id: "q50-lut-015",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question: "A‘râf 7/77’de deveyi öldürenler Sâlih’e nasıl meydan okur?",
    explanation:
      "Emre karşı çıktıktan sonra Sâlih’ten kendilerini uyardığı azabı getirmesini isterler.",
    difficulty: "medium",
    conceptGroup: "v74-salih-challenged-bring-punishment",
    options: [
      {
        id: "o1",
        text: "Yeni bir deve bulmasını isteyerek",
      },
      {
        id: "o3",
        text: "Kendilerine hükümdar olmasını önererek",
      },
      {
        id: "o4",
        text: "Şehri birlikte terk etmeyi önererek",
      },
      {
        id: "o2",
        text: "Tehdit ettiği azabı getirmesini isteyerek",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "7/77; physical PDF 170",
  },
  {
    id: "v12-prophets-001",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Yûsuf 12/14’te kardeşleri, Yûsuf’u koruyabilecekleri iddiasını neye dayandırır?",
    explanation:
      "Kardeşleri, sayıca kalabalık olmalarını kurda karşı koruma güvencesi olarak öne sürer.",
    difficulty: "medium",
    conceptGroup: "v74-yusuf-brothers-numbers-assurance",
    options: [
      {
        id: "o1",
        text: "Kraldan yardım almalarına",
      },
      {
        id: "o3",
        text: "Bir kalede kalacak olmalarına",
      },
      {
        id: "o4",
        text: "Yolculuğu gece yapacak olmalarına",
      },
      {
        id: "o2",
        text: "Kalabalık bir grup olmalarına",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "12/14; physical PDF 248",
  },
  {
    id: "q57-musaasa",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question: "Tâhâ 20/67–68’de korku duyan Mûsâ’ya hangi güvence verilir?",
    explanation:
      "Mûsâ’ya korkmaması ve üstün gelecek olanın kesinlikle kendisi olduğu bildirilir.",
    difficulty: "medium",
    conceptGroup: "v74-musa-assured-victory-fear",
    options: [
      {
        id: "o2",
        text: "Üstün gelecek olanın kendisi olduğu",
      },
      {
        id: "o1",
        text: "Karşılaşmanın erteleneceği",
      },
      {
        id: "o3",
        text: "Firavun’un oradan ayrılacağı",
      },
      {
        id: "o4",
        text: "Sihirbazların ona katılmayacağı",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "20/68; physical PDF 332",
  },
  {
    id: "q57-suaybolcu",
    reason:
      "Final semantic pass: replace duplicate fact or focus overlapping prayer on an independently checked additional request; preserve historical identity.",
    question:
      "Tevbe 9/107’de zararlı amaçla mescid yapanlara yüklenen toplumsal amaç hangisidir?",
    explanation:
      "Âyet, mescid kurma görüntüsü altında müminleri bölme ve zarar verme amacını açıkça eleştirir.",
    difficulty: "medium",
    conceptGroup: "v74-harmful-mosque-divide-believers",
    options: [
      {
        id: "o3",
        text: "Yeni bir çarşı kurmak",
      },
      {
        id: "o4",
        text: "Müminler arasına ayrılık sokmak",
      },
      {
        id: "o1",
        text: "Bir kervan yolu açmak",
      },
      {
        id: "o2",
        text: "Bir su kuyusunu paylaşmak",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "9/107; physical PDF 214",
  },
  {
    id: "q62-nisab-anlam",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Âl-i İmrân 3/173’te tehdit haberi alan müminlerin güvenini anlatan söz hangisidir?",
    explanation:
      "Tehdit haberi onların imanını artırır; Allah’ın kendilerine yeterli olduğunu söylerler.",
    difficulty: "easy",
    conceptGroup: "v74-hasbunallah-response-threat",
    options: [
      {
        id: "o4",
        text: "Rabbimiz ilmimizi artır",
      },
      {
        id: "o2",
        text: "Allah bize yeter, O ne güzel vekildir",
      },
      {
        id: "o1",
        text: "Rabbimiz göğsümüzü genişlet",
      },
      {
        id: "o3",
        text: "Rabbimiz günahlarımızı bağışla",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "3/173; physical PDF 79",
  },
  {
    id: "q45-haldun-umran",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Nisâ 4/75’te zalimlerin yaşadığı yerden kurtulmak isteyen çaresizler arasında hangi yaş grubu da açıkça anılır?",
    explanation:
      "Âyet çaresiz erkekler, kadınlar ve çocuklardan birlikte söz eder.",
    difficulty: "medium",
    conceptGroup: "v74-oppressed-children-explicitly-included",
    options: [
      {
        id: "o1",
        text: "Yalnız yetişkinler",
      },
      {
        id: "o3",
        text: "Yalnız yaşlılar",
      },
      {
        id: "o4",
        text: "Yalnız gençler",
      },
      {
        id: "o2",
        text: "Çocuklar",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "4/75; physical PDF 97",
  },
  {
    id: "q62-vakfe-iki",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "A‘râf 7/94’te peygamber gönderilen halklara dert ve sıkıntı verilmesinin hangi amacı belirtilir?",
    explanation:
      "Dert ve sıkıntının, insanların Allah’a yönelip yakarmasına vesile olması belirtilir.",
    difficulty: "medium",
    conceptGroup: "v74-hardship-purpose-turn-supplicate",
    options: [
      {
        id: "o1",
        text: "Başka bir dil öğrenmeleri",
      },
      {
        id: "o2",
        text: "Yeni bir ülkeye göç etmeleri",
      },
      {
        id: "o3",
        text: "Daha çok ticaret yapmaları",
      },
      {
        id: "o4",
        text: "Allah’a yönelip yalvarmaları",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "7/94; physical PDF 172",
  },
  {
    id: "q62-tavaf-ziyaret",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Tevbe 9/38’de seferberlik çağrısından geri duranlara hangi tercihleri sorulur?",
    explanation:
      "Uyarı, âhiretten vazgeçip dünya hayatının sınırlı yararıyla yetinme üzerinedir.",
    difficulty: "medium",
    conceptGroup: "v74-mobilization-worldly-life-preference",
    options: [
      {
        id: "o1",
        text: "Deniz yolunu kara yoluna tercih etmeleri",
      },
      {
        id: "o2",
        text: "Yeni yurda eski yurdu tercih etmeleri",
      },
      {
        id: "o3",
        text: "Tarımı ticarete tercih etmeleri",
      },
      {
        id: "o4",
        text: "Âhiret yerine dünya hayatıyla yetinmeleri",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "9/38; physical PDF 203",
  },
  {
    id: "q62-tavaf-baslangic",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Yûsuf 12/48’in Kur’an Yolu mealinde kıtlık boyunca tüketilmeyip saklanacak az miktar ne için açıklanır?",
    explanation:
      "Mealde kıtlık yıllarında biriktirilmiş ürünün, saklanacak az miktar tohumluk dışında tüketileceği belirtilir.",
    difficulty: "medium",
    conceptGroup: "v74-famine-small-seed-reserve",
    options: [
      {
        id: "o1",
        text: "Ödünç verilen ürün için",
      },
      {
        id: "o3",
        text: "Vergi ödemek için",
      },
      {
        id: "o4",
        text: "Pazarda satış için",
      },
      {
        id: "o2",
        text: "Tohumluk için",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "12/48; physical PDF 252",
  },
  {
    id: "q70-ebu-hanife-lakap",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Kasas 28/57’de doğru yolu izlemeye karşı öne sürülen korku hangisidir?",
    explanation:
      "Muhataplar, doğru yolu izlerlerse yurtlarından uzaklaştırılacakları korkusunu öne sürer.",
    difficulty: "medium",
    conceptGroup: "v74-guidance-objection-uprooting-homeland",
    options: [
      {
        id: "o3",
        text: "Yurtlarından sökülüp atılmak",
      },
      {
        id: "o1",
        text: "Ticaret dilini unutmak",
      },
      {
        id: "o2",
        text: "Aile adlarını değiştirmek",
      },
      {
        id: "o4",
        text: "Hasat zamanını kaçırmak",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "28/57; physical PDF 413",
  },
  {
    id: "q62-tavaf-anlam",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question: "Hucurât 49/17’de gerçek lütuf olarak hatırlatılan nedir?",
    explanation:
      "İman etmeyi elçiye yapılmış bir iyilik sayanlara asıl lütfun Allah’ın onları imana yöneltmesi olduğu hatırlatılır.",
    difficulty: "medium",
    conceptGroup: "v74-faith-guidance-divine-favor",
    options: [
      {
        id: "o1",
        text: "İnsanların elçiye hediye getirmesi",
      },
      {
        id: "o2",
        text: "Bir kabilenin diğerini ağırlaması",
      },
      {
        id: "o3",
        text: "Yolcuların yeni bir yurt edinmesi",
      },
      {
        id: "o4",
        text: "Allah’ın insanları imana yöneltmesi",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "49/17; physical PDF 550",
  },
  {
    id: "q49-ihya-019",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Vâkıa 56/63’te insanın üzerinde düşünmesi için hangi tarım işi anılır?",
    explanation:
      "İnsanın ektiği tohum üzerine düşünmesi istenir; izleyen âyet yetiştirenin kim olduğunu sorar.",
    difficulty: "easy",
    conceptGroup: "v74-reflection-sown-seed",
    options: [
      {
        id: "o1",
        text: "Ürün tartması",
      },
      {
        id: "o2",
        text: "Tohum ekmesi",
      },
      {
        id: "o3",
        text: "Bağ budaması",
      },
      {
        id: "o4",
        text: "Kuyu açması",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "56/63; physical PDF 574",
  },
  {
    id: "q68-sitte-alternatif",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Münâfikūn 63/9’da hangi iki nimet grubunun insanı Allah’ı anmaktan alıkoymaması istenir?",
    explanation:
      "Malların ve çocukların Allah’ı anmaya engel olmaması gerektiği vurgulanır.",
    difficulty: "medium",
    conceptGroup: "v74-wealth-children-not-distract-remembrance",
    options: [
      {
        id: "o4",
        text: "Mallar ve çocuklar",
      },
      {
        id: "o1",
        text: "Evler ve binekler",
      },
      {
        id: "o2",
        text: "Tarlalar ve sürüler",
      },
      {
        id: "o3",
        text: "Arkadaşlar ve komşular",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "63/9; physical PDF 595",
  },
  {
    id: "q62-arafat-hadis",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question: "Cin 72/18’de mescidlerin yalnız kime ait olduğu bildirilir?",
    explanation:
      "Mescidlerin Allah’a ait olduğu söylenir ve Allah ile birlikte başkasına ibadet edilmemesi istenir.",
    difficulty: "easy",
    conceptGroup: "v74-mosques-belong-allah",
    options: [
      {
        id: "o1",
        text: "Allah’a",
      },
      {
        id: "o2",
        text: "Hükümdarlara",
      },
      {
        id: "o3",
        text: "Kurucuların soyuna",
      },
      {
        id: "o4",
        text: "Şehrin tüccarlarına",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "72/18; physical PDF 616",
  },
  {
    id: "v12-general-003",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Mü’min 40/28’de Mûsâ’nın öldürülmesine karşı çıkan, imanını gizleyen kişi hangi çevreden tanıtılır?",
    explanation:
      "Âyet, konuşan kişiyi Firavun ailesinden olup imanını gizleyen bir mümin olarak tanıtır.",
    difficulty: "medium",
    conceptGroup: "v74-believer-pharaoh-family-defends-musa",
    options: [
      {
        id: "o2",
        text: "Firavun ailesinden",
      },
      {
        id: "o1",
        text: "Medyen çobanlarından",
      },
      {
        id: "o3",
        text: "Sebe tüccarlarından",
      },
      {
        id: "o4",
        text: "Mekke ileri gelenlerinden",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "40/28; physical PDF 497",
  },
  {
    id: "e150-history-035",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Enfâl 8/17’deki atış anlatımında, görünürdeki eylemin ötesindeki sonuç kime nisbet edilir?",
    explanation:
      "Âyet, atışın görünen öznesinin ötesinde Allah’ın yardım ve etkisini vurgular.",
    difficulty: "medium",
    conceptGroup: "v74-battle-throw-attributed-allah",
    options: [
      {
        id: "o3",
        text: "Ordu kumandanlarının ortak kararına",
      },
      {
        id: "o4",
        text: "Müttefik kabilelerin yardımına",
      },
      {
        id: "o2",
        text: "Allah’a",
      },
      {
        id: "o1",
        text: "Kervan sahiplerinin desteğine",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "8/17; physical PDF 189",
  },
  {
    id: "q49-taberi-015",
    reason:
      "Replace source-compared same-fact or reverse-form overlap found in the full-option/cross-bank pass. Frozen historical record, ID, key and category remain unchanged.",
    question:
      "Fetih 48/27’de güven içinde mescide giriş anlatılırken saçla ilgili hangi iki uygulama anılır?",
    explanation:
      "Mescid-i Harâm’a güven içinde giriş müjdesinde saçları kazıtma ya da kısmen kestirme birlikte anılır.",
    difficulty: "medium",
    conceptGroup: "v74-safe-entry-shave-shorten-hair",
    options: [
      {
        id: "o4",
        text: "Örmek veya boyamak",
      },
      {
        id: "o2",
        text: "Kazıtmak veya kısmen kestirmek",
      },
      {
        id: "o1",
        text: "Örtmek veya yıkamak",
      },
      {
        id: "o3",
        text: "Taramak veya bağlamak",
      },
    ],
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "48/27; physical PDF 546",
  },
  {
    id: "q62-hac-ihram",
    reason:
      "Final semantic pass: replace duplicate fact or focus overlapping prayer on an independently checked additional request; preserve historical identity.",
    question:
      "Haşr 59/7’de malın dağıtımıyla hangi ekonomik durumun önlenmesi amaçlanır?",
    explanation:
      "Fey‘in dağıtımında, servetin yalnızca zenginler arasında dolaşan bir şey olmaması amaçlanır.",
    difficulty: "medium",
    options: [
      {
        id: "o1",
        text: "Ticarette farklı fiyatların ortaya çıkması",
      },
      {
        id: "o3",
        text: "İnsanların farklı işlerde çalışması",
      },
      {
        id: "o4",
        text: "Ürünlerin farklı mevsimlerde yetişmesi",
      },
      {
        id: "o2",
        text: "Servetin yalnız zenginler arasında dolaşması",
      },
    ],
    conceptGroup: "v74-wealth-not-only-circulate-rich",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "59/7; physical PDF 585",
  },
  {
    id: "v11-general-002",
    reason:
      "Final semantic pass: replace duplicate fact or focus overlapping prayer on an independently checked additional request; preserve historical identity.",
    question:
      "Cum‘a 62/11’de insanlardan bazılarının elçiyi ayakta bırakıp neye yöneldikleri anlatılır?",
    explanation:
      "Ticaret veya eğlence görünce yönelenlerden söz edilir; Allah katındakinin daha üstün olduğu hatırlatılır.",
    difficulty: "medium",
    options: [
      {
        id: "o3",
        text: "Bir sulh toplantısına",
      },
      {
        id: "o4",
        text: "Bir yolcu kafilesini kurtarmaya",
      },
      {
        id: "o2",
        text: "Ticaret veya eğlenceye",
      },
      {
        id: "o1",
        text: "Bir cenaze hazırlığına",
      },
    ],
    conceptGroup: "v74-congregation-left-standing-trade-entertainment",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "62/11; physical PDF 594",
  },
  {
    id: "e150-history-014",
    reason:
      "Final semantic pass: replace duplicate fact or focus overlapping prayer on an independently checked additional request; preserve historical identity.",
    question:
      "Duhâ 93/8’de Hz. Peygamber’e maddî durumuyla ilgili hangi lütuf hatırlatılır?",
    explanation:
      "Duhâ sûresinin bu âyetinde, yoksul bulunup zengin kılınması hatırlatılır.",
    difficulty: "easy",
    options: [
      {
        id: "o1",
        text: "Bir orduya komutan olması",
      },
      {
        id: "o3",
        text: "Bir ülkeye hükümdar olması",
      },
      {
        id: "o4",
        text: "Bir hazineye bekçi olması",
      },
      {
        id: "o2",
        text: "Yoksulken zengin kılınması",
      },
    ],
    conceptGroup: "v74-prophet-poor-enriched-duha",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "93/8; physical PDF 648",
  },
  {
    id: "learn-dua-010",
    reason:
      "Final semantic pass: replace duplicate fact or focus overlapping prayer on an independently checked additional request; preserve historical identity.",
    question:
      "Şuarâ 26/84’te İbrâhim’in sonraki nesillerle ilgili duası hangisidir?",
    explanation:
      "İbrâhim, kendisinden sonra gelecekler içinde iyilikle anılmayı diler.",
    difficulty: "medium",
    options: [
      {
        id: "o1",
        text: "Soyunun hükümdar olması",
      },
      {
        id: "o3",
        text: "Adına şehirler kurulması",
      },
      {
        id: "o4",
        text: "Her yolculuğunun anlatılması",
      },
      {
        id: "o2",
        text: "İyilikle anılmak",
      },
    ],
    conceptGroup: "v74-ibrahim-good-remembrance-posterity",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "26/84; physical PDF 390",
  },
  {
    id: "learn-dua-017",
    reason:
      "Final semantic pass: replace duplicate fact or focus overlapping prayer on an independently checked additional request; preserve historical identity.",
    question:
      "Âl-i İmrân 3/147’de sebat ve yardımdan önce hangi iki şey için bağışlanma istenir?",
    explanation:
      "Duada günahlar ve işlerdeki aşırılıklar için af istenir; ardından sebat ve yardım talebi gelir.",
    difficulty: "medium",
    options: [
      {
        id: "o1",
        text: "Unutma ve dalgınlık",
      },
      {
        id: "o3",
        text: "Yolculuk ve hastalık",
      },
      {
        id: "o4",
        text: "Yoksulluk ve borçluluk",
      },
      {
        id: "o2",
        text: "Günahlar ve işlerdeki aşırılıklar",
      },
    ],
    conceptGroup: "v74-prayer-pardon-sins-excesses",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "3/147; physical PDF 75",
  },
  {
    id: "q65-isra-34",
    reason:
      "Lower-similarity manual review confirmed a repeated tested fact; replace with distinct source-compared verse information while preserving frozen history.",
    question:
      "İsrâ 17/13’te kıyamet günü insana sunulacak kitap hangi durumda tasvir edilir?",
    explanation:
      "Âyet, insana önünde açılmış bir kitap çıkarılacağını bildirir.",
    difficulty: "medium",
    options: [
      {
        id: "o4",
        text: "Mühürlü bir sandıkta",
      },
      {
        id: "o1",
        text: "Açılmış olarak",
      },
      {
        id: "o2",
        text: "Katlanmış olarak",
      },
      {
        id: "o3",
        text: "İçeriği silinmiş olarak",
      },
    ],
    conceptGroup: "v74-personal-book-opened-before-human",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "17/13; physical PDF 296",
  },
  {
    id: "v12-general-010",
    reason:
      "Lower-similarity manual review confirmed a repeated tested fact; replace with distinct source-compared verse information while preserving frozen history.",
    question:
      "Âl-i İmrân 3/145’te ölümün gerçekleşmesi hangi ilâhî sınıra bağlanır?",
    explanation:
      "Hiç kimsenin Allah’ın yazılıp bir süreye bağlanmış izni olmadan ölmeyeceği bildirilir.",
    difficulty: "medium",
    options: [
      {
        id: "o1",
        text: "İnsanların ortak kararına",
      },
      {
        id: "o3",
        text: "Toplumun oyu ile verilen hükme",
      },
      {
        id: "o4",
        text: "Yalnız kişinin kendi arzusuna",
      },
      {
        id: "o2",
        text: "Allah’ın belirli süreye bağlı iznine",
      },
    ],
    conceptGroup: "v74-death-permission-fixed-term",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "3/145; physical PDF 75",
  },
  {
    id: "q68-sitte-bes",
    reason:
      "Lower-similarity manual review confirmed a repeated tested fact; replace with distinct source-compared verse information while preserving frozen history.",
    question:
      "Hâkka 69/17’nin Kur’an Yolu mealinde o gün arşı yüklenenlerin sayısı kaç olarak belirtilir?",
    explanation:
      "Âyette o gün arşı sekiz meleğin yükleneceği belirtilir; bu ifade fiziksel bir büyüklük hesabı olarak sunulmaz.",
    difficulty: "hard",
    options: [
      {
        id: "o1",
        text: "Sekiz",
      },
      {
        id: "o2",
        text: "Dört",
      },
      {
        id: "o3",
        text: "Yedi",
      },
      {
        id: "o4",
        text: "On iki",
      },
    ],
    conceptGroup: "v74-eight-carry-throne",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "69/17; physical PDF 610",
  },
  {
    id: "q66-kehf-109",
    reason:
      "Lower-similarity manual review confirmed a repeated tested fact; replace with distinct source-compared verse information while preserving frozen history.",
    question:
      "Tebbet 111/2’de Ebû Leheb’e fayda vermediği bildirilenler hangileridir?",
    explanation:
      "Sûrede Ebû Leheb’in malının ve kazandıklarının kendisine fayda vermediği bildirilir.",
    difficulty: "easy",
    options: [
      {
        id: "o4",
        text: "Savaş araçları ve askerleri",
      },
      {
        id: "o1",
        text: "Malı ve kazandıkları",
      },
      {
        id: "o2",
        text: "Ülkesinin kaleleri",
      },
      {
        id: "o3",
        text: "Denizlerdeki gemileri",
      },
    ],
    conceptGroup: "v74-abu-lahab-wealth-no-benefit",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "111/2; physical PDF 660",
  },
  {
    id: "q43-insan-7",
    reason:
      "Lower-similarity manual review confirmed a repeated tested fact; replace with distinct source-compared verse information while preserving frozen history.",
    question:
      "Beyyine 98/8’de Allah ile cennetlik kullar arasındaki hoşnutluk nasıl anlatılır?",
    explanation: "Âyet karşılıklı rızâyı açıkça dile getirir.",
    difficulty: "medium",
    options: [
      {
        id: "o3",
        text: "Hoşnutluk yalnız dünyadaki nimetlere bağlanır",
      },
      {
        id: "o4",
        text: "Hoşnutluk henüz belli değildir",
      },
      {
        id: "o2",
        text: "Allah onlardan, onlar da Allah’tan razıdır",
      },
      {
        id: "o1",
        text: "Hoşnutluk insanların birbirini övmesidir",
      },
    ],
    conceptGroup: "v74-mutual-divine-believer-contentment",
    source:
      "https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf",
    locator: "98/8; physical PDF 653",
  },
] as const;
