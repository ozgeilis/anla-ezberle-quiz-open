import type { Question } from "./model";
/** Additional sourced Quran verse research DRAFTS. NOT included in playable bank.
 * Qur'an verses have been selected for direct-source comparison, but each
 * full explanation and choice still requires independent editor acceptance.
 */
type Row = readonly [string,"dualar"|"akaid","general"|"quran",string,string,readonly [string,string,string],string,string,string,string,"easy"|"medium"|"hard"];
const rows: readonly Row[] = [
  [
    "learn-dua-011",
    "dualar",
    "general",
    "Hz. İbrâhim ve Hz. İsmâil Kâbe'yi inşa ederken Allah'tan ne diler?",
    "Yapılan ibadetin kabulü",
    [
      "Servetin artması",
      "Yeni ülke",
      "Uzun ömür"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=127&mode=tefsir&sure=2",
    "2/127",
    "İbrâhim ve İsmâil yaptıkları işin kabulünü diler.",
    "dua-ibrahim-accept",
    "medium"
  ],
  [
    "learn-dua-012",
    "dualar",
    "general",
    "Bakara 2/128'de Hz. İbrâhim ve İsmâil nesilleri için ne diler?",
    "Allah'a teslim olan bir topluluk",
    [
      "Ticarette üstünlük",
      "Daha fazla mülk",
      "Deniz yolculuğu"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=128&mode=tefsir&sure=2",
    "2/128",
    "Bakara 2/128'de nesillerinden Allah'a teslim olan bir topluluk yetişmesini isterler.",
    "dua-submission",
    "medium"
  ],
  [
    "learn-dua-013",
    "dualar",
    "general",
    "Bakara 2/250'deki duada Allah'tan ne istenir?",
    "Sabır ve sebat",
    [
      "Zenginlik",
      "Ün ve şöhret",
      "Yeni şehirler"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=250&mode=tefsir&sure=2",
    "2/250",
    "Bakara 2/250'de Allah'tan sabır ve ayakların sağlam durması dilenir.",
    "dua-sabr-sebat",
    "easy"
  ],
  [
    "learn-dua-014",
    "dualar",
    "general",
    "Âl-i İmrân 3/16'da müminler günahlarıyla ilgili ne diler?",
    "Bağışlanma",
    [
      "Şöhret",
      "Yolculuk",
      "Mal artışı"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=16&mode=tefsir&sure=3",
    "3/16",
    "Âl-i İmrân 3/16'da iman edenler günahlarının bağışlanmasını ister.",
    "dua-magfiret",
    "easy"
  ],
  [
    "learn-dua-015",
    "dualar",
    "general",
    "Âl-i İmrân 3/26'da mülkün gerçek sahibi kim olarak anılır?",
    "Allah",
    [
      "Bir kabile",
      "Bütün tüccarlar",
      "İnsanların tamamı"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=26&mode=tefsir&sure=3",
    "3/26",
    "Âl-i İmrân 3/26 mülkün Allah'a ait olduğunu vurgular.",
    "dua-mulk",
    "easy"
  ],
  [
    "learn-dua-016",
    "dualar",
    "general",
    "Hz. Zekeriyyâ Âl-i İmrân 3/38'de hangi nimeti ister?",
    "Hayırlı nesil",
    [
      "Büyük gemi",
      "Yeni şehir",
      "Deniz yolculuğu"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=38&mode=tefsir&sure=3",
    "3/38",
    "Hz. Zekeriyyâ duasında temiz ve hayırlı nesil diler.",
    "dua-zakariyya",
    "easy"
  ],
  [
    "learn-dua-017",
    "dualar",
    "general",
    "Âl-i İmrân 3/147'de bağışlanmayla birlikte ne istenir?",
    "Ayakların sabit kalması",
    [
      "Malın katlanması",
      "Denizin açılması",
      "Uzun uyku"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=147&mode=tefsir&sure=3",
    "3/147",
    "Âl-i İmrân 3/147'de bağışlanma ve sebat dilenir.",
    "dua-sebat",
    "medium"
  ],
  [
    "learn-dua-018",
    "dualar",
    "general",
    "Âl-i İmrân 3/191'de yaratılış üzerine düşünenler neden korunmayı diler?",
    "Ateş azabından",
    [
      "Yağmurdan",
      "Uzun yolculuktan",
      "Kitap okumaktan"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=191&mode=tefsir&sure=3",
    "3/191",
    "Âl-i İmrân 3/191'de ateş azabından korunma isteği bulunur.",
    "dua-creation",
    "medium"
  ],
  [
    "learn-dua-019",
    "dualar",
    "general",
    "Âl-i İmrân 3/193'te iman çağrısını duyanların duasında hangisi vardır?",
    "Günahların bağışlanması",
    [
      "Kıymetli eşya",
      "Geniş ordu",
      "Daha çok toprak"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=193&mode=tefsir&sure=3",
    "3/193",
    "Âl-i İmrân 3/193 günahların bağışlanmasını istemeyi öğretir.",
    "dua-call-faith",
    "medium"
  ],
  [
    "learn-dua-020",
    "dualar",
    "general",
    "A‘râf 7/89'da topluluklar arasında Allah'tan nasıl hükmetmesi istenir?",
    "Hak ile",
    [
      "Hızla",
      "Mal karşılığı",
      "Yolculuk sonrası"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=89&mode=tefsir&sure=7",
    "7/89",
    "A‘râf 7/89'da Allah'tan hak ile hüküm vermesi dilenir.",
    "dua-hak",
    "hard"
  ],
  [
    "learn-dua-021",
    "dualar",
    "general",
    "Yûnus 10/85'te iman edenler zalimlere karşı ne ister?",
    "Onlar için sınama aracı olmamayı",
    [
      "Sürekli kazanç",
      "Yeni askerler",
      "Uzun tatil"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=85&mode=tefsir&sure=10",
    "10/85",
    "Yûnus 10/85'te zalimler için imtihan vesilesi olmama duası yer alır.",
    "dua-zalim",
    "medium"
  ],
  [
    "learn-dua-022",
    "dualar",
    "general",
    "İsrâ 17/24 anne baba için hangi duayı öğütler?",
    "Onlara merhamet edilmesi",
    [
      "Her yere gitmeleri",
      "Daha çok ticaret",
      "Herkesçe övülmeleri"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=24&mode=tefsir&sure=17",
    "17/24",
    "İsrâ 17/24'te anne babaya merhamet edilmesi istenir.",
    "dua-parents",
    "easy"
  ],
  [
    "learn-dua-023",
    "dualar",
    "general",
    "İsrâ 17/80'de hangi iki durumun doğrulukla olması dilenir?",
    "Giriş ve çıkış",
    [
      "Uyuma ve uyanma",
      "Alma ve satma",
      "Yeme ve içme"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=80&mode=tefsir&sure=17",
    "17/80",
    "İsrâ 17/80'de doğrulukla giriş ve çıkış dilenir.",
    "dua-giris-cikis",
    "medium"
  ],
  [
    "learn-dua-024",
    "dualar",
    "general",
    "Kehf 18/10'da mağaraya sığınan gençler ne ister?",
    "Rahmet ve doğru yol",
    [
      "Hazine",
      "Ordu",
      "Yeni ev"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=10&mode=tefsir&sure=18",
    "18/10",
    "Kehf 18/10'da gençler Allah'tan rahmet ve doğru yol diler.",
    "dua-ashab-kehf",
    "easy"
  ],
  [
    "learn-dua-025",
    "dualar",
    "general",
    "Tâhâ 20/114'te hangi nimetin artırılması için dua edilir?",
    "İlim",
    [
      "Gümüş",
      "Hayvan sayısı",
      "Servet"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=114&mode=tefsir&sure=20",
    "20/114",
    "Tâhâ 20/114'te Allah'tan ilmi artırması istenir.",
    "dua-ilim",
    "easy"
  ],
  [
    "learn-dua-026",
    "dualar",
    "general",
    "Mü’minûn 23/29'da Allah'tan nasıl bir yere inmeyi nasip etmesi istenir?",
    "Bereketli bir yere",
    [
      "Çöle",
      "Korkulu bir yere",
      "Saray bahçesine"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=29&mode=tefsir&sure=23",
    "23/29",
    "Mü’minûn 23/29'da bereketli bir konaklama yeri dilenir.",
    "dua-konaklama",
    "medium"
  ],
  [
    "learn-dua-027",
    "dualar",
    "general",
    "Mü’minûn 23/97'de hangi şeyden Allah'a sığınılır?",
    "Şeytanların kışkırtmaları",
    [
      "Yağmurun yağması",
      "Sabah vakti",
      "Günlük çalışma"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=97&mode=tefsir&sure=23",
    "23/97",
    "Mü’minûn 23/97'de şeytanların kışkırtmalarından korunma duası vardır.",
    "dua-seytan",
    "easy"
  ],
  [
    "learn-dua-028",
    "dualar",
    "general",
    "Neml 27/19'da Hz. Süleyman hangi davranışı yapabilmeyi diler?",
    "Nimetlere şükretmeyi",
    [
      "Servet biriktirmeyi",
      "Uyumamayı",
      "Yolculuktan kaçmayı"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=19&mode=tefsir&sure=27",
    "27/19",
    "Neml 27/19'da Hz. Süleyman nimetlere şükredebilmeyi diler.",
    "dua-suleyman",
    "easy"
  ],
  [
    "learn-dua-029",
    "dualar",
    "general",
    "Kasas 28/24'te Hz. Mûsâ Allah'tan gelecek neye muhtaç olduğunu söyler?",
    "Her türlü hayra",
    [
      "Bir orduya",
      "Büyük gemiye",
      "Tahta"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=24&mode=tefsir&sure=28",
    "28/24",
    "Kasas 28/24'te Hz. Mûsâ kendisine gelecek hayra muhtaç olduğunu belirtir.",
    "dua-hayir",
    "medium"
  ],
  [
    "learn-dua-030",
    "dualar",
    "general",
    "Tahrîm 66/8'deki duada nur için ne dilenir?",
    "Tamamlanması",
    [
      "Gizlenmesi",
      "Söndürülmesi",
      "Uzaklaştırılması"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=8&mode=tefsir&sure=66",
    "66/8",
    "Tahrîm 66/8'de iman edenler nurlarının tamamlanmasını diler.",
    "dua-nur",
    "hard"
  ],
  [
    "learn-akaid-001",
    "akaid",
    "quran",
    "Bakara 2/163'te ilah hakkında hangi temel ilke belirtilir?",
    "İlah birdir",
    [
      "İlahlar sayısızdır",
      "Her şehirde başka ilah vardır",
      "Tanrı yalnız bir kavme aittir"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=163&mode=tefsir&sure=2",
    "2/163",
    "Bakara 2/163 tek ilah inancını açıklar.",
    "iman-tevhid",
    "easy"
  ],
  [
    "learn-akaid-002",
    "akaid",
    "quran",
    "Bakara 2/285'te müminlerin inandıkları arasında hangisi sayılır?",
    "Allah'ın peygamberleri",
    [
      "Sadece gök cisimleri",
      "Fal ve kehanet",
      "Putlar"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=285&mode=tefsir&sure=2",
    "2/285",
    "Bakara 2/285'te Allah'a, meleklerine, kitaplarına ve peygamberlerine iman anılır.",
    "iman-rusul",
    "easy"
  ],
  [
    "learn-akaid-003",
    "akaid",
    "quran",
    "Nisâ 4/136'da iman edilmesi istenenler arasında hangisi vardır?",
    "Âhiret günü",
    [
      "Yıldız falı",
      "Kabile üstünlüğü",
      "Servet"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=136&mode=tefsir&sure=4",
    "4/136",
    "Nisâ 4/136'da âhiret gününe inanmak da iman konuları arasında sayılır.",
    "iman-ahiret",
    "easy"
  ],
  [
    "learn-akaid-004",
    "akaid",
    "quran",
    "Nahl 16/36'da peygamberlerin davetinin temeli nedir?",
    "Allah'a kulluk etmek",
    [
      "Putlara tapınmak",
      "Servet yığmak",
      "Irkça üstünlük"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=36&mode=tefsir&sure=16",
    "16/36",
    "Nahl 16/36'da Allah'a kulluk edip tâğuttan uzak durma çağrısı vurgulanır.",
    "iman-peygamber-davet",
    "medium"
  ],
  [
    "learn-akaid-005",
    "akaid",
    "quran",
    "Kehf 18/110'a göre Hz. Muhammed hakkında hangi ifade yer alır?",
    "Vahiy alan bir insan olduğu",
    [
      "Meleklerden biri olduğu",
      "İlah olduğu",
      "Hiç mesaj almadığı"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=110&mode=tefsir&sure=18",
    "18/110",
    "Kehf 18/110'da peygamberin kendisine vahyedilen bir insan olduğu bildirilir.",
    "iman-peygamber-insan",
    "medium"
  ],
  [
    "learn-akaid-006",
    "akaid",
    "quran",
    "Tâhâ 20/14'te Hz. Mûsâ'ya Allah hakkında hangi hakikat bildirilir?",
    "Allah'tan başka ilah olmadığı",
    [
      "İbadetin gereksiz olduğu",
      "Kulların sorumsuz olduğu",
      "Meleklerin ilah olduğu"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=14&mode=tefsir&sure=20",
    "20/14",
    "Tâhâ 20/14'te Allah'tan başka ilah olmadığı bildirilmektedir.",
    "iman-musa-tevhid",
    "easy"
  ],
  [
    "learn-akaid-007",
    "akaid",
    "quran",
    "Enbiyâ 21/35'te her canlının karşılaşacağı şey nedir?",
    "Ölüm",
    [
      "Hükümdarlık",
      "Zenginlik",
      "Uzun yolculuk"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=35&mode=tefsir&sure=21",
    "21/35",
    "Enbiyâ 21/35 her canlının ölümü tadacağını bildirir.",
    "iman-olum",
    "easy"
  ],
  [
    "learn-akaid-008",
    "akaid",
    "quran",
    "Hac 22/7'de kaçınılmaz olduğu belirtilen olay hangisidir?",
    "Kıyametin gelmesi",
    [
      "Her yıl aynı hasat",
      "Bütün denizlerin kuruması",
      "Herkesin kral olması"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=7&mode=tefsir&sure=22",
    "22/7",
    "Hac 22/7'de kıyametin geleceği açıkça belirtilir.",
    "iman-kiyamet",
    "medium"
  ],
  [
    "learn-akaid-009",
    "akaid",
    "quran",
    "Mü’minûn 23/115 insanın yaratılmasıyla ilgili hangi yanlış düşünceyi eleştirir?",
    "Amaçsız yaratıldığını sanmak",
    [
      "Sorumlu olmayı",
      "İyilik yapmayı",
      "Öğrenmeyi"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=115&mode=tefsir&sure=23",
    "23/115",
    "Mü’minûn 23/115 insanın boş yere yaratıldığı düşüncesini reddeder.",
    "iman-yaratis-amac",
    "medium"
  ],
  [
    "learn-akaid-010",
    "akaid",
    "quran",
    "Ahzâb 33/40'da Hz. Muhammed hangi sıfatla anılır?",
    "Peygamberlerin sonuncusu",
    [
      "İlk insan",
      "Meleklerin başı",
      "Bir hükümdar"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=40&mode=tefsir&sure=33",
    "33/40",
    "Ahzâb 33/40'da Hz. Muhammed peygamberlerin sonuncusu olarak anılır.",
    "iman-son-peygamber",
    "medium"
  ],
  [
    "learn-akaid-011",
    "akaid",
    "quran",
    "Fâtır 35/1'de Allah'ın elçileri arasında hangi varlıklar anılır?",
    "Melekler",
    [
      "Dağlar",
      "Yıldızlar",
      "Ağaçlar"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=1&mode=tefsir&sure=35",
    "35/1",
    "Fâtır 35/1 melekleri elçiler olarak anlatır.",
    "iman-melek",
    "medium"
  ],
  [
    "learn-akaid-012",
    "akaid",
    "quran",
    "Fussilet 41/30'da 'Rabbimiz Allah'tır' deyip dosdoğru olanlara kimlerin indiği anlatılır?",
    "Meleklerin",
    [
      "Tüccarların",
      "Kavim liderlerinin",
      "Yolcuların"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=30&mode=tefsir&sure=41",
    "41/30",
    "Fussilet 41/30'da dosdoğru olanlara meleklerin indiği anlatılır.",
    "iman-istikamet",
    "hard"
  ],
  [
    "learn-akaid-013",
    "akaid",
    "quran",
    "Şûrâ 42/11 Allah'ın yaratılmışlara benzerliği hakkında ne bildirir?",
    "O'nun benzerinin bulunmadığını",
    [
      "Her şeyin O'nunla aynı olduğunu",
      "Bir sureti olduğunu",
      "Belli bir kavme ait olduğunu"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=11&mode=tefsir&sure=42",
    "42/11",
    "Şûrâ 42/11'de Allah'ın benzeri olmadığı bildirilir.",
    "iman-tenzih",
    "medium"
  ],
  [
    "learn-akaid-014",
    "akaid",
    "quran",
    "Kāf 50/16'da Allah'ın insan hakkında neyi bildiği vurgulanır?",
    "İçinden geçenleri",
    [
      "Yalnız söylediklerini",
      "Yalnız işini",
      "Sadece adını"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=16&mode=tefsir&sure=50",
    "50/16",
    "Kāf 50/16'da Allah'ın insanın içinden geçirdiklerini bildiği belirtilir.",
    "iman-ilim",
    "medium"
  ],
  [
    "learn-akaid-015",
    "akaid",
    "quran",
    "Hadîd 57/3'te Allah için hangi ifade yer alır?",
    "İlk ve son",
    [
      "Yalnız görünür",
      "Yalnız geçmişte",
      "Sadece yeryüzünde"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=3&mode=tefsir&sure=57",
    "57/3",
    "Hadîd 57/3'te Allah ilk ve son olarak anılır.",
    "iman-evvel-ahir",
    "hard"
  ],
  [
    "learn-akaid-016",
    "akaid",
    "quran",
    "Mülk 67/2'de hayat ve ölümün yaratılışı hangi amaçla ilişkilendirilir?",
    "Amellerin sınanması",
    [
      "Mülkün paylaşılması",
      "Gezi düzenlenmesi",
      "Ticaret yapılması"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=2&mode=tefsir&sure=67",
    "67/2",
    "Mülk 67/2 kimin daha güzel davranacağının sınanmasını bildirir.",
    "iman-imtihan",
    "medium"
  ],
  [
    "learn-akaid-017",
    "akaid",
    "quran",
    "Zilzâl 99/7'ye göre zerre kadar iyilik yapan neyle karşılaşır?",
    "Yaptığını görür",
    [
      "Unutulur",
      "Ödüller gizlenir",
      "Kimse bilmez"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=7&mode=tefsir&sure=99",
    "99/7",
    "Zilzâl 99/7'de zerre kadar iyiliğin bile karşılığının görüleceği anlatılır.",
    "iman-hesap-iyilik",
    "easy"
  ],
  [
    "learn-akaid-018",
    "akaid",
    "quran",
    "Zilzâl 99/8'e göre zerre kadar kötülük yapan neyle karşılaşır?",
    "Yaptığını görür",
    [
      "Görmezden gelinir",
      "Kendi hükmünü verir",
      "Sorumsuz kalır"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=8&mode=tefsir&sure=99",
    "99/8",
    "Zilzâl 99/8'de zerre kadar kötülüğün de görüleceği bildirilmektedir.",
    "iman-hesap-kotuluk",
    "easy"
  ],
  [
    "learn-akaid-019",
    "akaid",
    "quran",
    "İhlâs 112/2'de Allah hangi isimle anılır?",
    "Samed",
    [
      "Rahip",
      "Müderris",
      "Hükümdar"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=2&mode=tefsir&sure=112",
    "112/2",
    "İhlâs 112/2'de Allah 'Samed' olarak nitelendirilir.",
    "iman-ihlas-samed",
    "hard"
  ],
  [
    "learn-akaid-020",
    "akaid",
    "quran",
    "İhlâs 112/3 Allah hakkında hangi ifadeyi içerir?",
    "Doğurmamış ve doğurulmamıştır",
    [
      "Çocukları vardır",
      "Soy bağına muhtaçtır",
      "Bir kavmin atasıdır"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=3&mode=tefsir&sure=112",
    "112/3",
    "İhlâs 112/3'te Allah'ın doğurmadığı ve doğurulmadığı belirtilir.",
    "iman-ihlas-nesep",
    "medium"
  ]
];
export const learningVerseDraftQuestionsV2: readonly Question[] = rows.map(row => {
 const [id, , categoryId, question, correct, wrong, url, locator, explanation, conceptGroup, difficulty] = row;
 return {id,version:1,categoryId,difficulty,question,
 options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],correctOptionId:"o2",explanation,
 sources:[{title:"Diyanet Kur'an Yolu",publisher:"Diyanet İşleri Başkanlığı",url,locator,supports:explanation,checkStatus:"unverified"}],
 reviewStatus:"draft",reviewNotes:"Kur'an ayeti referansı olan yeni taslak; kaynak-eşleşme, dil, çeldirici, dinî editör incelemesi ve ürün sahibi kabulü bekleniyor.",updatedAt:"2026-10-20",conceptGroup};
});
