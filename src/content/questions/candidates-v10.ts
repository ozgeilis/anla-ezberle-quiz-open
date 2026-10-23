import type { CategoryId, Difficulty, Question } from "./model";

// 54 new educational questions cross-referenced with Diyanet Quran and TDV articles.
// Owner's conditional acceptance is distinct from an independent scholarly review.
type Row = readonly [CategoryId, string, string, readonly [string, string, string], string, string, string, string, Difficulty];
const rows: readonly Row[] = [
  [
    "quran",
    "Neml sûresine adını veren 'neml' sözcüğü hangi canlıyı ifade eder?",
    "Karınca",
    [
      "Arı",
      "Örümcek",
      "Kuş"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/27",
    "Sûre tanıtımı ve Neml 27/18",
    "Neml kelimesi karınca demektir; sûrede Hz. Süleyman'ın karınca vadisine gelişi anlatılır.",
    "neml-name",
    "easy"
  ],
  [
    "quran",
    "Kasas sûresinin adındaki 'kasas' sözcüğü Türkçede ne anlama gelir?",
    "Kıssalar",
    [
      "Dilekler",
      "Geceler",
      "Dağlar"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/28",
    "Sûre tanıtımı, adlandırma",
    "Kasas kıssalar anlamındadır; sûrenin önemli bir bölümünde Hz. Mûsâ'nın hayatından olaylar anlatılır.",
    "qasas-name",
    "easy"
  ],
  [
    "quran",
    "Kehf sûresinin adındaki 'kehf' kelimesi ne demektir?",
    "Mağara",
    [
      "Deniz",
      "Yıldız",
      "Şehir"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/18",
    "Sûre tanıtımı ve 18/9-26",
    "Kehf mağara anlamına gelir; sûrede inançları için bir mağaraya sığınan gençlerin kıssası bulunur.",
    "kahf-name",
    "easy"
  ],
  [
    "quran",
    "Ankebût sûresine adını veren 'ankebût' sözcüğünün karşılığı nedir?",
    "Örümcek",
    [
      "Karınca",
      "Bal arısı",
      "Çekirge"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/29",
    "Sûre tanıtımı ve 29/41",
    "Ankebût, örümcek demektir; sûrenin 41. âyetinde örümceğin evinden söz edilir.",
    "ankabut-name",
    "easy"
  ],
  [
    "quran",
    "Rahmân sûresinde nimetlere dikkat çekmek için tekrarlanan soru kimlere yöneltilir?",
    "İnsanlara ve cinlere",
    [
      "Yalnız hükümdarlara",
      "Yalnız meleklere",
      "Sadece peygamberlere"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/55",
    "Sûre konusu ve tekrarlanan hitap",
    "Rahmân sûresinde Allah'ın nimetleri hatırlatılırken insanlara ve cinlere birlikte seslenilir.",
    "rahman-refrain",
    "medium"
  ],
  [
    "quran",
    "Lokmân sûresinin ana öğütlerinden biri aşağıdakilerden hangisidir?",
    "Allah'a ortak koşmamak",
    [
      "Servetle övünmek",
      "İnsanları küçümsemek",
      "Kibirli yürümek"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/31",
    "31/12-19 ve sûrenin konusu",
    "Lokmân'ın oğluna öğütleri arasında Allah'a ortak koşmamak, anne babaya iyi davranmak ve tevazu vardır.",
    "luqman-advice",
    "easy"
  ],
  [
    "quran",
    "Hucurât sûresi 49/6'da bir haber geldiğinde öne çıkan öğüt hangisidir?",
    "Haberi araştırıp doğrulamak",
    [
      "Haberi hemen yaymak",
      "Haber vereni ödüllendirmek",
      "Her sözü yazmadan kabul etmek"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/49",
    "Hucurât 49/6, haberlerin araştırılması",
    "Hucurât 49/6'da yanlış bilgiyle insanlara zarar vermemek için gelen haberin araştırılması öğütlenir.",
    "hujurat-verify",
    "medium"
  ],
  [
    "quran",
    "Nûr sûresi adını hangi âyetinde geçen 'nûr' kelimesinden alır?",
    "35. âyet",
    [
      "5. âyet",
      "18. âyet",
      "55. âyet"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/24",
    "Sûre tanıtımı, 24/35",
    "Nûr sûresi, adını 35. âyetteki nûr kelimesinden alır; sûre aile ve toplum hayatıyla ilgili ilkeler de içerir.",
    "nur-name-verse",
    "medium"
  ],
  [
    "quran",
    "Furkān sûresinin adındaki 'furkān' hangi kavramla ilişkilidir?",
    "Doğru ile yanlışı ayıran ölçü",
    [
      "Bir ibadet vakti",
      "Bir şehir adı",
      "Bir ticaret tartısı"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/25",
    "Sûre tanıtımı ve Furkān 25/1",
    "Furkān, hak ile bâtılı ayırt eden ölçü anlamıyla Kur'an için kullanılan bir addır.",
    "furqan-meaning",
    "medium"
  ],
  [
    "quran",
    "Mülk sûresinin temel konularından biri hangisidir?",
    "Allah'ın evren üzerindeki hükümranlığı",
    [
      "Hicret yolu durakları",
      "Bedir savaşındaki birlikler",
      "Mirasçıların isimleri"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/67",
    "Sûrenin konusu, 67/1",
    "Mülk sûresi Allah'ın kudretini, evren üzerindeki hükümranlığını ve yeniden dirilişi hatırlatır.",
    "mulk-message",
    "easy"
  ],
  [
    "quran",
    "Yûsuf sûresinin 12/3. âyetinde Hz. Yûsuf kıssası hangi nitelemeyle sunulur?",
    "Kıssaların en güzeli",
    [
      "En uzun dua",
      "En kısa sûre",
      "İlk hicret"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Yûsuf 12/3 ve kıssanın sunumu",
    "Yûsuf 12/3'te anlatılan kıssa 'kıssaların en güzeli' ifadesiyle sunulur.",
    "yusuf-best-story",
    "medium"
  ],
  [
    "quran",
    "Asr sûresinin adındaki 'asr' kelimesi hangi kavramı da ifade eder?",
    "Zaman",
    [
      "Dağ",
      "Gemi",
      "Hurma"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/103",
    "Sûre tanıtımı: asr kelimesi",
    "Asr kelimesi çağ ve zaman anlamlarını taşır; sûrede insanın hüsrandan kurtuluşunun ilkeleri anlatılır.",
    "asr-time",
    "easy"
  ],
  [
    "prophets",
    "Kehf sûresindeki yolculukta Hz. Mûsâ'nın beraberindeki kişi ilk olarak hangi araca zarar verir?",
    "Bir gemiye",
    [
      "Bir deveye",
      "Bir ata",
      "Bir arabaya"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/18",
    "Kehf 18/71 ve yolculuk kıssası",
    "Kehf 18/71'de Hz. Mûsâ'nın birlikte yolculuk ettiği kişi bir gemiyi deler; nedeni daha sonra açıklanır.",
    "musa-khidr-boat",
    "medium"
  ],
  [
    "prophets",
    "Kehf 18/79'a göre yolculuktaki gemiye zarar verilmesinin nedeni neydi?",
    "Gemileri zorla alan bir hükümdardan korumak",
    [
      "Denizi kurutmak",
      "Yeni liman bulmak",
      "Balık avlamak"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/18",
    "Kehf 18/79, geminin sebebi",
    "Kıssada geminin yoksul sahiplerini her gemiye el koyan hükümdardan korumak için hasarlı hale getirildiği açıklanır.",
    "musa-khidr-boat",
    "hard"
  ],
  [
    "prophets",
    "Kehf 18/82'de onarılan duvarın altında kimin hazinesi bulunuyordu?",
    "İki yetim çocuğun",
    [
      "Bir tüccarın",
      "Bir kumandanın",
      "Bir kralın"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/18",
    "Kehf 18/82, iki yetim",
    "Kehf sûresinde onarılan duvarın altında iki yetimin hazinesinin bulunduğu anlatılır.",
    "musa-khidr-wall",
    "medium"
  ],
  [
    "prophets",
    "Kehf 18/77'de Hz. Mûsâ'nın yol arkadaşı hangi işi karşılıksız yapar?",
    "Yıkılmak üzere olan duvarı onarır",
    [
      "Bir ordu kurar",
      "Bir gemi satın alır",
      "Bir saray inşa eder"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/18",
    "Kehf 18/77, duvarı düzeltme",
    "Yolculukta konuk etmeyen bir yerleşimde yıkılmaya yüz tutan duvar ücret alınmadan düzeltilir.",
    "musa-khidr-wall",
    "medium"
  ],
  [
    "prophets",
    "Neml 27/18'de Hz. Süleyman'ın ordusuna karşı yuvalara girilmesini söyleyen canlı hangisidir?",
    "Karınca",
    [
      "Hüdhüd",
      "Arı",
      "Kelebek"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/27",
    "Neml 27/18, karınca vadisi",
    "Neml sûresinde bir karınca diğer karıncalara, Süleyman'ın ordusu fark etmeden kendilerini ezmesin diye yuvalarına girmelerini söyler.",
    "sulayman-ant-valley",
    "easy"
  ],
  [
    "prophets",
    "Neml 27/24'te hüdhüd, Sebe halkının hangi gök cismine secde ettiğini bildirir?",
    "Güneşe",
    [
      "Aya",
      "Yıldıza",
      "Dünyaya"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/27",
    "Neml 27/22-26, Sebe halkı",
    "Hüdhüd, Sebe halkının Allah yerine güneşe secde ettiğini Hz. Süleyman'a haber verir.",
    "sulayman-sheba-belief",
    "medium"
  ],
  [
    "prophets",
    "Hz. Süleyman'ın Sebe hükümdarına gönderdiği mektup hangi ifadeyle başlar?",
    "Besmeleyle",
    [
      "Selâm duasıyla",
      "Bir tarih notuyla",
      "Bir savaş şiiriyle"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/27",
    "Neml 27/29-31, mektubun başlangıcı",
    "Neml 27/30'da Süleyman'ın mektubunun rahmân ve rahîm olan Allah'ın adıyla başladığı aktarılır.",
    "sulayman-letter",
    "medium"
  ],
  [
    "prophets",
    "Neml sûresinde Hz. Süleyman'a haber getiren hüdhüd hangi topluluktan söz eder?",
    "Sebe halkından",
    [
      "Âd kavminden",
      "Semûd kavminden",
      "Medyen halkından"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/27",
    "Neml 27/22, hüdhüdün getirdiği haber",
    "Hüdhüd, Hz. Süleyman'a Sebe halkından kesin bir haber getirdiğini söyler.",
    "sulayman-hudhud-report",
    "easy"
  ],
  [
    "prophets",
    "Kasas 28/23-24'te Hz. Mûsâ Medyen'de kimlere yardım eder?",
    "Sürülerini sulamak isteyen iki kadına",
    [
      "Denizdeki balıkçılara",
      "Çöldeki asker grubuna",
      "Saraydaki görevlilere"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/28",
    "Kasas 28/23-24, Medyen kuyusu",
    "Hz. Mûsâ Medyen'de sürülerini sulamak için bekleyen iki kadına yardım ederek hayvanlarını sular.",
    "musa-madyan-women",
    "medium"
  ],
  [
    "prophets",
    "Kasas 28/13'te bebek Hz. Mûsâ kime geri kavuşturulur?",
    "Annesine",
    [
      "Firavun'a",
      "Kardeşi Hârûn'a",
      "Bir tüccara"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/28",
    "Kasas 28/13, annesine geri verilmesi",
    "Kasas sûresinde bebeğin annesine geri döndürülmesiyle annesinin gönlünün yatıştırıldığı anlatılır.",
    "musa-reunion-mother",
    "medium"
  ],
  [
    "prophets",
    "Kasas 28/27'de Hz. Mûsâ'ya teklif edilen hizmet süresi en az kaç yıldır?",
    "Sekiz yıl",
    [
      "İki yıl",
      "Dört yıl",
      "On iki yıl"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/28",
    "Kasas 28/27, sekiz veya on yıllık hizmet",
    "Kasas 28/27'de sekiz yıllık hizmet önerilir; on yıla tamamlamanın ise Hz. Mûsâ'nın tercihi olduğu belirtilir.",
    "musa-madyan-service",
    "hard"
  ],
  [
    "prophets",
    "Meryem 19/16'da Hz. Meryem ailesinden ayrılıp hangi yöne çekilir?",
    "Doğu tarafına",
    [
      "Batı tarafına",
      "Kuzey tarafına",
      "Güney tarafına"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/19",
    "Meryem 19/16, inzivaya çekilmesi",
    "Meryem sûresine göre Hz. Meryem ailesinden ayrılarak doğu tarafında bir yere çekilir.",
    "mary-east-retreat",
    "medium"
  ],
  [
    "prophets",
    "Meryem 19/25'te Hz. Meryem'den neyi kendisine doğru silkelemesi istenir?",
    "Hurma ağacının gövdesini",
    [
      "Zeytin dalını",
      "Üzüm asmasını",
      "Nar ağacını"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/19",
    "Meryem 19/23-26, hurma ağacı",
    "Hz. Meryem'e hurma ağacının gövdesini silkelemesi söylenir; böylece taze hurmalar dökülür.",
    "mary-date-tree",
    "medium"
  ],
  [
    "prophets",
    "Nûh 71/28'de Hz. Nûh bağışlanma duasında kimleri de anar?",
    "Annesini, babasını ve müminleri",
    [
      "Yalnız hükümdarları",
      "Yalnız gemi ustalarını",
      "Sadece kavminin liderlerini"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/71",
    "Nûh 71/28, dua ve bağışlanma",
    "Nûh sûresinin son âyetinde Hz. Nûh kendisi, anne babası ve iman edenler için bağışlanma diler.",
    "nuh-prayer-family",
    "medium"
  ],
  [
    "history",
    "Hicret hazırlığında kuşağını ikiye böldüğü için 'Zâtünnitâkayn' diye anılan sahâbî kimdir?",
    "Esmâ bint Ebû Bekir",
    [
      "Ümmü Seleme",
      "Nesîbe bint Kâ'b",
      "Hafsa bint Ömer"
    ],
    "https://islamansiklopedisi.org.tr/esma-bint-ebu-bekir",
    "Hicret hazırlığı, iki kuşak lakabı",
    "Esmâ bint Ebû Bekir hicret azığını ve su kabını bağlamak için kuşağını ikiye bölmesiyle bu lakabı almıştır.",
    "asma-two-belts",
    "medium"
  ],
  [
    "history",
    "Hicret esnasında yardım eden Esmâ bint Ebû Bekir'in oğlu olan sahâbî kimdir?",
    "Abdullah b. Zübeyr",
    [
      "Abdullah b. Mes'ûd",
      "Zeyd b. Sâbit",
      "Hâlid b. Velîd"
    ],
    "https://islamansiklopedisi.org.tr/esma-bint-ebu-bekir",
    "Giriş, Esmâ'nın ailesi ve oğlu",
    "Esmâ bint Ebû Bekir, Abdullah b. Zübeyr'in annesidir; oğlu hicret sırasında Medine yakınlarında doğmuştur.",
    "asma-son",
    "medium"
  ],
  [
    "history",
    "Aşere-i mübeşşere arasında yer alan ve kumandanlık yapan sahâbî kimdir?",
    "Ebû Ubeyde b. Cerrâh",
    [
      "Hassân b. Sâbit",
      "Ebû Hüreyre",
      "Mus'ab b. Umeyr"
    ],
    "https://islamansiklopedisi.org.tr/ebu-ubeyde-b-cerrah",
    "Giriş: aşere-i mübeşşereden kumandan sahâbî",
    "Ebû Ubeyde b. Cerrâh, cennetle müjdelendikleri rivayet edilen on sahâbî arasında anılır.",
    "abu-ubayda-ten",
    "medium"
  ],
  [
    "history",
    "Kuzey Afrika'da Kayrevan şehrini kuran Emevî kumandanı kimdir?",
    "Ukbe b. Nâfi‘",
    [
      "Târık b. Ziyâd",
      "Hâlid b. Velîd",
      "Sa'd b. Ebû Vakkās"
    ],
    "https://islamansiklopedisi.org.tr/ukbe-b-nafi",
    "50/670 Kayrevan'ın kuruluşu",
    "Ukbe b. Nâfi‘ Kuzey Afrika'daki Kayrevan'ı askerî üs olarak kurmuştur.",
    "qayrawan-founder",
    "medium"
  ],
  [
    "history",
    "Kayrevan'ın bir ordugâh şehri olarak kurulmaya başlandığı milâdî yıl hangisidir?",
    "670",
    [
      "622",
      "711",
      "750"
    ],
    "https://islamansiklopedisi.org.tr/kayrevan",
    "50/670 Kayrevan tarihi",
    "Kayrevan, 670 yılında Ukbe b. Nâfi‘ tarafından askerî hareket ve ikmal üssü olarak kurulmaya başlandı.",
    "qayrawan-founder",
    "medium"
  ],
  [
    "history",
    "Târık b. Ziyâd'ın Endülüs'e geçtiği milâdî yıl hangisidir?",
    "711",
    [
      "632",
      "670",
      "756"
    ],
    "https://islamansiklopedisi.org.tr/tarik-b-ziyad",
    "92/711 Endülüs seferi",
    "Târık b. Ziyâd'ın birlikleri 711 yılında İber yarımadasına geçerek fetih sürecini başlattı.",
    "tariq-iberia",
    "medium"
  ],
  [
    "history",
    "Endülüs seferinde Târık b. Ziyâd'ı kumandan olarak görevlendiren vali kimdir?",
    "Mûsâ b. Nusayr",
    [
      "Ukbe b. Nâfi‘",
      "Haccâc b. Yûsuf",
      "Ebü'l-Abbas es-Seffâh"
    ],
    "https://islamansiklopedisi.org.tr/tarik-b-ziyad",
    "Kumandanlık görevi ve Mûsâ b. Nusayr",
    "Kuzey Afrika valisi Mûsâ b. Nusayr, Endülüs seferinin kumandanlığını Târık b. Ziyâd'a verdi.",
    "tariq-iberia",
    "hard"
  ],
  [
    "history",
    "İslâm matematik tarihinde cebir ilminin kurucularından sayılan âlim kimdir?",
    "Muhammed b. Mûsâ el-Hârizmî",
    [
      "İbn Battûta",
      "Hassân b. Sâbit",
      "Ebû Eyyûb el-Ensârî"
    ],
    "https://islamansiklopedisi.org.tr/harizmi-muhammed-b-musa",
    "Giriş: cebir ilminin kurucusu kabul edilen matematikçi",
    "Hârizmî, cebir çalışmalarıyla tanınan önemli bir matematikçi ve astronomdur.",
    "khwarizmi-algebra",
    "easy"
  ],
  [
    "history",
    "Su saatleri ve otomatik düzeneklerle tanınan İslâm mühendisi kimdir?",
    "Cezerî",
    [
      "İbn Haldûn",
      "İmam Mâlik",
      "Bîrûnî"
    ],
    "https://islamansiklopedisi.org.tr/cezeri-ismail-b-rezzaz",
    "Mekanik sistemler ve su saatleri",
    "Cezerî su saatleri, otomatik düzenekler ve pompalar tasarlayan ünlü mühendistir.",
    "jazari-machines",
    "medium"
  ],
  [
    "history",
    "Uluğ Bey'in astronomi çalışmalarının merkezindeki rasathane hangi şehirdeydi?",
    "Semerkant",
    [
      "Mekke",
      "Kûfe",
      "Medine"
    ],
    "https://islamansiklopedisi.org.tr/ulug-bey",
    "Semerkant Rasathânesi ve Zîc-i Uluğ Bey",
    "Uluğ Bey, Semerkant'ta büyük bir rasathane kurarak astronomi gözlemleri ve tablolar hazırlattı.",
    "ulughbeg-samarkand",
    "medium"
  ],
  [
    "history",
    "Yermük Savaşı'nda Müslüman ordularının karşısındaki büyük güç hangisiydi?",
    "Bizans İmparatorluğu",
    [
      "Moğol İmparatorluğu",
      "Haçlı kontlukları",
      "Abbâsî Devleti"
    ],
    "https://islamansiklopedisi.org.tr/yermuk-savasi",
    "15/636, Bizans ordusuyla savaş",
    "Yermük Savaşı, Müslüman ordularıyla Bizans ordusu arasında gerçekleşti.",
    "yarmuk-byzantium",
    "easy"
  ],
  [
    "history",
    "Yermük Savaşı milâdî hangi yılda yapılmıştır?",
    "636",
    [
      "624",
      "630",
      "680"
    ],
    "https://islamansiklopedisi.org.tr/yermuk-savasi",
    "15/636 savaş tarihi",
    "TDV İslâm Ansiklopedisi, Yermük Savaşı'nı hicrî 15 / milâdî 636 yılına tarihler.",
    "yarmuk-byzantium",
    "medium"
  ],
  [
    "history",
    "İstanbul'daki Eyüp Sultan Külliyesi ilk olarak hangi hükümdar tarafından yaptırılmıştır?",
    "Fâtih Sultan Mehmed",
    [
      "I. Murad",
      "II. Bayezid",
      "Kanûnî Sultan Süleyman"
    ],
    "https://islamansiklopedisi.org.tr/eyup-sultan-kulliyesi",
    "Fetihten sonra külliyenin inşası",
    "Eyüp Sultan Külliyesi'nin ilk yapıları İstanbul'un fethinden sonra Fâtih Sultan Mehmed tarafından yaptırılmıştır.",
    "eyup-kulliye",
    "medium"
  ],
  [
    "history",
    "Osmanlıların ilk döneminde İznik'te dârülhadis yaptıran devlet adamı kimdi?",
    "Çandarlı Hayreddin Paşa",
    [
      "Sokullu Mehmed Paşa",
      "Nizâmülmülk",
      "Lala Mustafa Paşa"
    ],
    "https://islamansiklopedisi.org.tr/darulhadis",
    "Osmanlı döneminin ilk dârülhadisleri",
    "TDV maddesi, Osmanlıların ilk dârülhadis yapısının I. Murad döneminde Çandarlı Hayreddin Paşa tarafından İznik'te yaptırıldığını belirtir.",
    "ottoman-first-darulhadis",
    "hard"
  ],
  [
    "general",
    "Kur'an eğitimi ve hâfız yetiştirmek için kullanılan eğitim kurumu adı hangisidir?",
    "Dârülkurrâ",
    [
      "Dârülhadis",
      "Rasathane",
      "Kervansaray"
    ],
    "https://islamansiklopedisi.org.tr/darulkurra",
    "Madde tanımı, kıraat eğitimi",
    "Dârülkurrâ, Kur'an öğretimi, hâfız yetiştirme ve kıraat eğitimi için kullanılan kurum adıdır.",
    "darulkurra-term",
    "medium"
  ],
  [
    "general",
    "Hadis öğretimine ayrılmış ihtisas medresesi hangi adla bilinir?",
    "Dârülhadis",
    [
      "Dârüşşifâ",
      "Dârülkurrâ",
      "Ribât"
    ],
    "https://islamansiklopedisi.org.tr/darulhadis",
    "Madde tanımı, hadis öğrenim kurumu",
    "Dârülhadis, hadis öğretimi ve öğrenimi için kurulmuş medrese türüdür.",
    "darulhadis-term",
    "medium"
  ],
  [
    "general",
    "Bir vakfın gelirlerinin nerede ve nasıl kullanılacağını belirten belge hangisidir?",
    "Vakfiye",
    [
      "Fetva",
      "İcâzetnâme",
      "Berat"
    ],
    "https://islamansiklopedisi.org.tr/vakfiye",
    "Madde tanımı: vakfın işleyişine dair resmî belge",
    "Vakfiye, vakfedilen malın hangi amaçlara ayrıldığını ve nasıl yönetileceğini gösteren belgedir.",
    "vakfiye-term",
    "medium"
  ],
  [
    "general",
    "İslâmî ahlâkta 'tevekkül' hangi tutumu anlatır?",
    "Allah'a güvenip dayanmayı",
    [
      "Başkalarını küçümsemeyi",
      "Bilgiyi gizlemeyi",
      "Övgüyle övünmeyi"
    ],
    "https://islamansiklopedisi.org.tr/tevekkul",
    "Madde tanımı, Allah'a güvenme",
    "Tevekkül, gerekli çabayı gösterirken Allah'a güvenip sonucu O'na bırakmayı da içeren bir tutumdur.",
    "tawakkul-term",
    "easy"
  ],
  [
    "general",
    "Dinî ahlâkta 'şükür' kavramı hangi tutumla ilgilidir?",
    "Nimet ve iyilik için minnettarlık göstermek",
    [
      "Başkasını ayıplamak",
      "Haksız yere mal almak",
      "Her haberi doğrulamadan yaymak"
    ],
    "https://islamansiklopedisi.org.tr/sukur",
    "Madde tanımı, minnettarlık",
    "Şükür, Allah'tan veya insanlardan gelen nimet ve iyilikler için minnettarlığı söz ve davranışla ifade etmektir.",
    "shukr-term",
    "easy"
  ],
  [
    "general",
    "İşlediği yanlıştan vazgeçip Allah'a yönelme hangi kavramla anlatılır?",
    "Tövbe",
    [
      "İsnad",
      "Rükû",
      "Tilâvet"
    ],
    "https://islamansiklopedisi.org.tr/tovbe",
    "Madde girişi, hatadan dönme",
    "Tövbe, dinen yanlış görülen davranıştan dönüp doğru ve iyi olana yönelmeyi ifade eder.",
    "tawba-term",
    "easy"
  ],
  [
    "general",
    "Dinî ve ahlâkî konularda bir topluluğa öğüt vermeye ne denir?",
    "Vaaz",
    [
      "Kıyas",
      "Tavaf",
      "Mahya"
    ],
    "https://islamansiklopedisi.org.tr/vaaz",
    "Madde tanımı, nasihat ve öğüt verme",
    "Vaaz, dinî ve ahlâkî konularda insanlara öğüt verme ve onları iyiliğe yönlendirme konuşmasıdır.",
    "vaaz-term",
    "easy"
  ],
  [
    "general",
    "Bir hadis rivayetinde aktarıcıların sırasını belirterek sözü ilk kaynağına götürme işlemine ne denir?",
    "İsnad",
    [
      "Hutbe",
      "İstiftâ",
      "Teyemmüm"
    ],
    "https://islamansiklopedisi.org.tr/isnad--hadis",
    "Hadis terimi olarak isnadın tanımı",
    "İsnad, hadis metnini aktaran râvilerin isimlerini sıralayıp rivayeti ilk söyleyene ulaştırma yöntemidir.",
    "isnad-term",
    "medium"
  ],
  [
    "general",
    "Hadis aktarımında 'râvi' sözü kimi ifade eder?",
    "Hadisi rivayet eden kişiyi",
    [
      "Namazı yöneten imamı",
      "Cami mimarını",
      "Vakıf yöneticisini"
    ],
    "https://islamansiklopedisi.org.tr/isnad--hadis",
    "İsnad tanımında râvilerin sıralanması",
    "Râvi, rivayeti kendinden sonraki kişiye nakleden kişidir; isnad bu aktarıcıların zincirini gösterir.",
    "ravi-chain",
    "easy"
  ],
  [
    "general",
    "Fıkıhta benzer iki meselede ortak gerekçeden hareketle hüküm belirleme yöntemine ne denir?",
    "Kıyas",
    [
      "Hatim",
      "Mahya",
      "İkamet"
    ],
    "https://islamansiklopedisi.org.tr/kiyas",
    "Fıkıh bölümünde kıyas tanımı",
    "Kıyas, hükmü açık bir meseleyle ortak özelliği bulunan yeni mesele için hüküm belirleme yöntemidir.",
    "qiyas-method",
    "medium"
  ],
  [
    "general",
    "İslâm hukukunda dinî delillerden hüküm çıkarma yöntemlerini inceleyen ilim hangisidir?",
    "Usûl-i fıkıh",
    [
      "Siyer",
      "Hat sanatı",
      "Coğrafya"
    ],
    "https://islamansiklopedisi.org.tr/usul-i-fikih",
    "İlim dalının tanımı",
    "Usûl-i fıkıh, fıkhın kaynaklarını ve bu kaynaklardan nasıl hüküm çıkarılacağını inceleyen ilimdir.",
    "usul-fiqh-method",
    "medium"
  ],
  [
    "general",
    "Fıkıh usulünde yetkin âlimlerin bir hükümde görüş birliği yapması hangi kavramdır?",
    "İcmâ",
    [
      "İhram",
      "İtikâf",
      "Mihrap"
    ],
    "https://islamansiklopedisi.org.tr/icma",
    "Terim tanımı, müctehidlerin ittifakı",
    "İcmâ, fıkıh usulünde gerekli şartları taşıyan müctehidlerin bir dinî hükümde ittifak etmesini ifade eder.",
    "ijma-term",
    "hard"
  ],
  [
    "general",
    "Medresede ders veren hoca için kullanılan tarihî unvan hangisidir?",
    "Müderris",
    [
      "Müezzin",
      "Mütevelli",
      "Hatip"
    ],
    "https://islamansiklopedisi.org.tr/muderris",
    "Madde tanımı, medresedeki hoca",
    "Müderris, medreselerde öğrencilere ilim öğreten yüksek dereceli hoca için kullanılan addır.",
    "mudarris-term",
    "easy"
  ],
  [
    "general",
    "Vakıf belgelerinde gelirlerin toplanması ve işletmenin yönetimi için görevlendirilen yönetici hangi adla anılabilir?",
    "Nâzır",
    [
      "Müezzin",
      "Müfessir",
      "Kāri"
    ],
    "https://islamansiklopedisi.org.tr/darulhadis",
    "Dârülhadis vakfiyesi, nâzırın görevleri",
    "Dârülhadis vakfiyelerinde nâzırın vakıf gelirlerini toplama, idare ve harcamaları takip etme görevi anlatılır.",
    "waqf-nazir",
    "hard"
  ],
];
const counters: Record<CategoryId, number> = { quran: 0, prophets: 0, history: 0, general: 0 };
export const newCandidatesV10: readonly Question[] = rows.map((row): Question => {
  const [categoryId, question, correct, wrong, url, locator, explanation, conceptGroup, difficulty] = row;
  const id = `v10-${categoryId}-${String(++counters[categoryId]).padStart(3, "0")}`;
  const isDiyanet = url.startsWith("https://kuran.diyanet.gov.tr/");
  return {
    id, version: 1, categoryId, difficulty, question,
    options: [{ id: "o1", text: wrong[0] }, { id: "o2", text: correct }, { id: "o3", text: wrong[1] }, { id: "o4", text: wrong[2] }],
    correctOptionId: "o2", explanation,
    sources: [{ title: isDiyanet ? "Diyanet Kur'an Yolu" : "TDV İslâm Ansiklopedisi",
      publisher: isDiyanet ? "Diyanet İşleri Başkanlığı" : "TDV İslâm Araştırmaları Merkezi",
      url, locator, supports: explanation, checkStatus: "supported", checkedAt: "2026-10-19" }],
    reviewStatus: "approved",
    reviewNotes: "Ürün sahibinin kaynakla doğrulama koşullu kullanım izni esas alınmıştır. Bağımsız editör veya dinî uzman kontrolü yapılmış sayılmaz.",
    updatedAt: "2026-10-19", conceptGroup,
  };
});
