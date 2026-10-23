import { makeCandidates, type Candidate } from "./candidate-builder";

// Âyet konumları yazılmıştır; otomatik doğrulama bunları ilmî onaya dönüştürmez.
// Doğrudan âyetin içerikle eşleşmesi bağımsız editör denetiminde teyit edilecek.
const rows: readonly Candidate[] = [
  [
    "Hz. Yûsuf rüyasında kaç yıldız gördüğünü söyler?",
    "11",
    [
      "7",
      "10",
      "12"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/4",
    "Yûsuf sûresi 12/4'te rüyada on bir yıldız, güneş ve ay zikredilir.",
    "yusuf-dream",
    "medium",
    "supported"
  ],
  [
    "Hz. Yûsuf rüyasını öncelikle kime anlatır?",
    "Babasına",
    [
      "Kral'a",
      "Kardeşlerine",
      "Arkadaşına"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/4",
    "Yûsuf rüyasını babasına anlatır.",
    "yusuf-dream",
    "medium",
    "supported"
  ],
  [
    "Hz. Yûsuf'un kardeşleri onu nereye bırakmayı planlar?",
    "Bir kuyunun dibine",
    [
      "Çöle",
      "Bir mağaraya",
      "Deniz kıyısına"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/10",
    "Kardeşlerden biri Yûsuf'un kuyuya bırakılmasını önerir.",
    "yusuf-well",
    "medium",
    "supported"
  ],
  [
    "Hz. Yûsuf'un kardeşleri babalarına hangi giysiyi kanlı getirir?",
    "Gömleğini",
    [
      "Sarığını",
      "Cübbesini",
      "Hırkasını"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/18",
    "Yûsuf'un gömleğine sahte kan sürülerek babasına getirilir.",
    "yusuf-well",
    "medium",
    "supported"
  ],
  [
    "Hz. Yûsuf kuyudan hangi yolcular tarafından çıkarılır?",
    "Bir kervan",
    [
      "Bir ordu",
      "Bir avcı grubu",
      "Balıkçılar"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/19",
    "Yolcu kervanı su çekmek için gönderdiği kişi vasıtasıyla Yûsuf'u bulur.",
    "yusuf-well",
    "medium",
    "supported"
  ],
  [
    "Hz. Yûsuf az bir bedelle hangi şey karşılığında satılır?",
    "Gümüş para",
    [
      "Altın külçe",
      "Buğday",
      "Deve"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/20",
    "Kur'an'da Yûsuf'un birkaç dirheme satıldığı anlatılır.",
    "yusuf-sale",
    "medium",
    "supported"
  ],
  [
    "Hz. Yûsuf'u satın alan kişi onu hangi ülkede evine götürür?",
    "Mısır",
    [
      "Yemen",
      "Şam",
      "Habeşistan"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/21",
    "Yûsuf'u Mısır'da satın alan kişinin evine götürdüğü belirtilir.",
    "yusuf-egypt",
    "medium",
    "supported"
  ],
  [
    "Hz. Yûsuf suçsuzluğuna rağmen bir süre nerede kalır?",
    "Zindanda",
    [
      "Dağda",
      "Gemide",
      "Çadırda"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/35",
    "Yûsuf'un bir süre zindana gönderilmesine karar verilir.",
    "yusuf-prison",
    "medium",
    "supported"
  ],
  [
    "Hükümdarın rüyasında görülen semiz inek sayısı kaçtır?",
    "7",
    [
      "3",
      "5",
      "12"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/43",
    "Hükümdarın rüyasında yedi semiz inek bulunur.",
    "yusuf-king-dream",
    "medium",
    "supported"
  ],
  [
    "Hükümdarın rüyasında semiz inekleri yiyen inekler nasıldır?",
    "Zayıf",
    [
      "Benekli",
      "Beyaz",
      "Çok küçük"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/43",
    "Rüyada yedi zayıf ineğin yedi semiz ineği yediği anlatılır.",
    "yusuf-king-dream",
    "medium",
    "supported"
  ],
  [
    "Hz. Yûsuf'un tarımla ilgili yorumunda kaç yıl ekin ekilmesi önerilir?",
    "7",
    [
      "3",
      "10",
      "40"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/47",
    "Yûsuf yedi yıl boyunca ekin ekilmesini öğütler.",
    "yusuf-famine",
    "medium",
    "supported"
  ],
  [
    "Hz. Ya'kūb'un gözlerinin ağarması hangi oğlunun ayrılığıyla ilgilidir?",
    "Yûsuf",
    [
      "Mûsâ",
      "İsmâil",
      "Hârûn"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/84",
    "Hz. Ya'kūb'un Yûsuf için duyduğu üzüntüyle gözlerinin ağardığı bildirilir.",
    "yusuf-reunion",
    "medium",
    "supported"
  ],
  [
    "Hz. Yûsuf babasının yüzüne sürülmesini istediği şeyi ne olarak belirtir?",
    "Gömleği",
    [
      "Mührü",
      "Asası",
      "Yüzüğü"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Kur'an 12/93",
    "Yûsuf gömleğinin babasının yüzüne sürülmesini ister.",
    "yusuf-reunion",
    "medium",
    "supported"
  ],
  [
    "Hz. Mûsâ bebekken hangi şeyin içine konularak suya bırakılır?",
    "Sandık",
    [
      "Beşik",
      "Küfe",
      "Testi"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/20",
    "Kur'an 20/39",
    "Tâhâ 20/39'da Mûsâ'nın sandığa konulup suya bırakılması anlatılır.",
    "musa-infancy",
    "medium",
    "supported"
  ],
  [
    "Hz. Mûsâ, Tâhâ 20/31'de kardeşi Hârûn'un yardımıyla neyin pekişmesini diler?",
    "Gücünün",
    [
      "Servetinin",
      "Sarayının",
      "Yolculuğunun"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-meal-1/taha-suresi-20/ayet-29/kuran-yolu-meali-5",
    "Kur'an Tâhâ 20/31",
    "Hz. Mûsâ, Tâhâ 20/31'de kardeşi Hârûn aracılığıyla gücünün pekişmesini diler.",
    "musa-guc",
    "medium",
    "supported"
  ],
  [
    "Hz. Mûsâ Tâhâ sûresindeki duasında ilk olarak ne ister?",
    "Göğsünün ferahlatılmasını",
    [
      "Gemi yapılmasını",
      "Rüzgârın emrine verilmesini",
      "Bir şehir kurulmasını"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/20",
    "Kur'an 20/25",
    "Tâhâ 20/25'te Mûsâ Rabbinden göğsünü genişletmesini ister.",
    "musa-dua",
    "medium",
    "supported"
  ],
  [
    "Hz. Mûsâ hangi hükümdara gidip tebliğde bulunmakla görevlendirilir?",
    "Firavun",
    [
      "Nemrud",
      "Kisrâ",
      "Kayser"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/20",
    "Kur'an 20/43",
    "Tâhâ sûresinde Mûsâ ve Hârûn'un Firavun'a gönderildiği belirtilir.",
    "musa-pharaoh",
    "medium",
    "supported"
  ],
  [
    "Hz. Mûsâ asasıyla denize vurduğunda ne olur?",
    "Deniz yarılır",
    [
      "Deniz kurur",
      "Deniz donar",
      "Deniz yükselir"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/26",
    "Kur'an 26/63",
    "Şuarâ 26/63'te denizin yarılması anlatılır.",
    "musa-exodus",
    "medium",
    "supported"
  ],
  [
    "Hz. Mûsâ'nın taşa vurmasıyla kaç pınar fışkırır?",
    "12",
    [
      "7",
      "10",
      "40"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/2",
    "Kur'an 2/60",
    "Bakara 2/60'ta taştan on iki pınar fışkırdığı bildirilir.",
    "musa-springs",
    "medium",
    "supported"
  ],
  [
    "Hz. Mûsâ'ya öğüt ve açıklamaların yazıldığı ne verilir?",
    "Levhalar",
    [
      "Bir taç",
      "Bir gemi",
      "Bir mühür"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/7",
    "Kur'an 7/145",
    "A'râf 7/145'te Mûsâ için levhalara öğütler yazıldığı bildirilir.",
    "musa-tablets",
    "medium",
    "supported"
  ],
  [
    "Hz. Süleyman'ın ordusunun geçtiği vadide hangi canlılardan söz edilir?",
    "Karıncalar",
    [
      "Arılar",
      "Develer",
      "Balıklar"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/27",
    "Kur'an 27/18",
    "Neml 27/18, karıncalar vadisindeki uyarıyı anlatır.",
    "suleyman-ant",
    "medium",
    "supported"
  ],
  [
    "Hz. Süleyman hangi kuşu yokladığında göremediğini söyler?",
    "Hüdhüd",
    [
      "Karga",
      "Güvercin",
      "Turna"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/27",
    "Kur'an 27/20",
    "Neml 27/20'de hüdhüd kuşunun yokluğu fark edilir.",
    "suleyman-hoopoe",
    "medium",
    "supported"
  ],
  [
    "Hüdhüd kuşu Hz. Süleyman'a hangi ülkeden haber getirir?",
    "Sebe'",
    [
      "Mısır",
      "Habeşistan",
      "Bizans"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/27",
    "Kur'an 27/22",
    "Neml 27/22'de hüdhüd Sebe'den haber getirdiğini söyler.",
    "suleyman-sheba",
    "medium",
    "supported"
  ],
  [
    "Hz. Süleyman'ın huzuruna getirilen nesne hangisidir?",
    "Bir taht",
    [
      "Bir gemi",
      "Bir çadır",
      "Bir sancak"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/27",
    "Kur'an 27/40",
    "Neml 27/40'ta bir tahtın getirilmesi anlatılır.",
    "suleyman-throne",
    "medium",
    "supported"
  ],
  [
    "Kur'an'a göre rüzgâr hangi peygamberin emrine verilmiştir?",
    "Süleyman",
    [
      "Yûsuf",
      "İdrîs",
      "Eyyûb"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/34",
    "Kur'an 34/12",
    "Sebe' 34/12'de rüzgârın Süleyman'ın emrine verildiği belirtilir.",
    "suleyman-wind",
    "medium",
    "supported"
  ],
  [
    "Hz. Nûh'a yapması emredilen büyük taşıt hangisidir?",
    "Gemi",
    [
      "Araba",
      "Atlı araba",
      "Sal"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/11",
    "Kur'an 11/37",
    "Hûd 11/37'de Nûh'a gemi yapması emredilir.",
    "nuh-ship",
    "medium",
    "supported"
  ],
  [
    "Hz. Nûh'un gemiye binmeyi reddeden yakını kimdir?",
    "Oğlu",
    [
      "Kardeşi",
      "Babası",
      "Dayısı"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/11",
    "Kur'an 11/42",
    "Hûd 11/42'de Nûh oğlunu gemiye çağırır.",
    "nuh-son",
    "medium",
    "supported"
  ],
  [
    "Ankebût sûresinde Hz. Nûh'un kavmi arasında kaldığı süre kaç yıl olarak verilir?",
    "950",
    [
      "100",
      "500",
      "1000"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/29",
    "Kur'an 29/14",
    "Ankebût 29/14'te bin yıldan elli yıl eksik süre belirtilir.",
    "nuh-years",
    "medium",
    "supported"
  ],
  [
    "Hz. İbrâhim'e diriltme örneğinde kaç kuş alması söylenir?",
    "4",
    [
      "2",
      "3",
      "7"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/2",
    "Kur'an 2/260",
    "Bakara 2/260'ta İbrâhim'e dört kuş alması söylenir.",
    "ibrahim-birds",
    "medium",
    "supported"
  ],
  [
    "Kâbe'nin temellerini yükseltirken Hz. İbrâhim ve İsmâil hangi dilekte bulunur?",
    "Yaptıklarının kabul edilmesi",
    [
      "Savaş kazanmak",
      "Uzun bir yolculuk",
      "Bir hükümdarlık"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/2",
    "Kur'an 2/127",
    "Bakara 2/127'de İbrâhim ile İsmâil Rablerinden yaptıklarını kabul etmesini diler.",
    "ibrahim-kaaba-prayer",
    "medium",
    "supported"
  ],
  [
    "Hz. İbrâhim'in misafirlerine ikram ettiği hayvanın türü nedir?",
    "Buzağı",
    [
      "Kuzu",
      "Keçi",
      "Deve"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/11",
    "Kur'an 11/69",
    "Hûd 11/69'da İbrâhim'in misafirlerine kızartılmış buzağı getirdiği anlatılır.",
    "ibrahim-guests",
    "medium",
    "supported"
  ],
  [
    "Güneşin doğuş yönünü tartışmada delil olarak kullanan peygamber kimdir?",
    "İbrâhim",
    [
      "Mûsâ",
      "Yûnus",
      "Hârûn"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/2",
    "Kur'an 2/258",
    "Bakara 2/258'de İbrâhim güneşin doğudan getirilmesini delil olarak söyler.",
    "ibrahim-debate",
    "medium",
    "supported"
  ],
  [
    "Putları parçalayarak büyük putu bırakan peygamber kimdir?",
    "İbrâhim",
    [
      "Şuayb",
      "Sâlih",
      "İdrîs"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/21",
    "Kur'an 21/58",
    "Enbiyâ 21/58'de putların parçalanması anlatılır.",
    "ibrahim-idols",
    "medium",
    "supported"
  ],
  [
    "Hz. Yûnus sıkıntı içinde Rabbine seslenirken kendi durumunu nasıl ifade eder?",
    "Haksızlık edenlerden oldum",
    [
      "Bir hükümdar oldum",
      "Her şeyi bildim",
      "Hiç yolculuk etmedim"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/21",
    "Kur'an 21/87",
    "Enbiyâ 21/87'de Yûnus duasında kendini yanlış davrananlardan sayar.",
    "yunus-prayer",
    "medium",
    "supported"
  ],
  [
    "Meryem 19/7'de Yahyâ adıyla ilgili hangi özellik belirtilir?",
    "Daha önce kimseye verilmediği",
    [
      "Bir şehir adı olduğu",
      "Bir kitabın adı olduğu",
      "Bir dağın adı olduğu"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/19",
    "Kur'an 19/7",
    "Meryem 19/7'de Yahyâ adıyla ilgili önceki kullanımın olmadığı vurgulanır.",
    "yahya-name",
    "medium",
    "supported"
  ],
  [
    "Kur'an'a göre beşikteyken konuşan peygamber kimdir?",
    "Îsâ",
    [
      "Mûsâ",
      "Nûh",
      "İsmâil"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/19",
    "Kur'an 19/29",
    "Meryem 19/29-30'da beşikteki Îsâ'nın konuşması anlatılır.",
    "isa-cradle",
    "medium",
    "supported"
  ],
  [
    "Semûd kavmine gönderilen ve dişi deveyi işaret olarak gösteren peygamber kimdir?",
    "Sâlih",
    [
      "Hûd",
      "Yûnus",
      "Lût"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/7",
    "Kur'an 7/73",
    "A'râf 7/73'te Sâlih ve dişi deve anlatılır.",
    "salih-camel",
    "medium",
    "supported"
  ],
  [
    "Âd kavmine gönderilen peygamber kimdir?",
    "Hûd",
    [
      "Sâlih",
      "Şuayb",
      "Zekeriyyâ"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/7",
    "Kur'an 7/65",
    "A'râf 7/65'te Âd kavmine Hûd'un gönderildiği belirtilir.",
    "hud-ad",
    "medium",
    "supported"
  ],
  [
    "Hz. Eyyûb'ün sıkıntısını Allah'a arz ettiği kıssa hangi surede yer alır?",
    "Enbiyâ",
    [
      "Yûsuf",
      "Fil",
      "Kadr"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/21",
    "Kur'an 21/83",
    "Enbiyâ 21/83'te Eyyûb'ün duasına yer verilir.",
    "eyyub-prayer",
    "medium",
    "supported"
  ],
  [
    "Meryem sûresinde Allah'ın kendisini yüksek bir makama yükselttiği peygamber kimdir?",
    "İdrîs",
    [
      "Hârûn",
      "Yûnus",
      "Lût"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/19",
    "Kur'an 19/57",
    "Meryem 19/57'de İdrîs'in yüksek bir makama yükseltildiği bildirilir.",
    "idris-status",
    "medium",
    "supported"
  ]
];
export const prophetsV4 = makeCandidates("prophets", rows);
