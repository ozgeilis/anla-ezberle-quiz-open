import { makeCandidates, type Candidate } from "./candidate-builder";

// TDV kaynak bağlantılı dinî terim ve ibadet bilgisi adayları, tümü draft.
const rows: readonly Candidate[] = [
  [
    "İslâm'da orucun günlük başlangıcını bildiren terim hangisidir?",
    "İmsak",
    [
      "İftar",
      "Sahur",
      "Bayram"
    ],
    "https://islamansiklopedisi.org.tr/oruc",
    "Oruçta imsak",
    "İmsak orucun başladığı vakitle ilişkili terimdir.",
    "fasting-timing",
    "medium",
    "supported"
  ],
  [
    "Oruç ibadetinin günlük bitiş vakti aşağıdakilerden hangisidir?",
    "Güneşin batması",
    [
      "Güneşin doğması",
      "Öğle vakti",
      "Gece yarısı"
    ],
    "https://islamansiklopedisi.org.tr/oruc",
    "Oruç tanımı",
    "Oruçta yeme içme yasağı güneş batınca sona erer.",
    "fasting-timing",
    "medium",
    "supported"
  ],
  [
    "Ramazan hicrî takvimin kaçıncı ayıdır?",
    "9",
    [
      "7",
      "10",
      "12"
    ],
    "https://islamansiklopedisi.org.tr/ramazan",
    "Ay takvimindeki yeri",
    "Ramazan hicrî ay takviminin dokuzuncu ayıdır.",
    "ramadan-order",
    "medium",
    "supported"
  ],
  [
    "Ramazan ayındaki farz ibadetlerden biri hangisidir?",
    "Oruç",
    [
      "Hac",
      "Kurban kesme",
      "Zekâtı yalnız bu ay ödeme"
    ],
    "https://islamansiklopedisi.org.tr/ramazan",
    "Ramazan orucu",
    "Ramazan Müslümanların farz oruç tuttuğu aydır.",
    "ramadan-fasting",
    "medium",
    "supported"
  ],
  [
    "Sahur hangi vakitte yenilen öğündür?",
    "İmsaktan önceki gece",
    [
      "İkindi sonrasında",
      "Öğleden hemen sonra",
      "Güneş batarken"
    ],
    "https://islamansiklopedisi.org.tr/sahur",
    "Sahur tanımı",
    "Sahur, oruca hazırlanırken imsak öncesinde yenilen öğündür.",
    "sahur-meal",
    "medium",
    "supported"
  ],
  [
    "Ramazan orucunun farz kılındığı âyetler hangi sûrededir?",
    "Bakara",
    [
      "Yûsuf",
      "Nahl",
      "Neml"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/2",
    "Kur'an 2/183-185",
    "Bakara sûresinin 183-185. âyetlerinde oruç ibadeti anlatılır.",
    "ramadan-bakara",
    "medium",
    "supported"
  ],
  [
    "Zekât esas olarak hangi alanla ilgili bir ibadettir?",
    "Maldan belirli pay ayırmak",
    [
      "Yalnız dua okumak",
      "Namazı kısaltmak",
      "Mescit inşa etmek"
    ],
    "https://islamansiklopedisi.org.tr/zekat",
    "Zekâtın mali niteliği",
    "Zekât malî bir ibadettir.",
    "zakat-meaning",
    "medium",
    "supported"
  ],
  [
    "Zekâtın toplumsal yönünde özellikle hangi kişilerin desteklenmesi öne çıkar?",
    "İhtiyaç sahipleri",
    [
      "Yalnız hükümdarlar",
      "Sadece tüccarlar",
      "Yalnız yolcular"
    ],
    "https://islamansiklopedisi.org.tr/zekat",
    "Zekâtın sosyal boyutu",
    "Zekâtın amaçlarından biri ihtiyaç sahiplerini desteklemektir.",
    "zakat-beneficiaries",
    "medium",
    "supported"
  ],
  [
    "İslâm'da günlük farz namaz vakitleri kaç tanedir?",
    "5",
    [
      "3",
      "4",
      "7"
    ],
    "https://islamansiklopedisi.org.tr/namaz",
    "Farz namaz vakitleri",
    "Günlük farz namaz beş vakitte kılınır.",
    "prayer-five",
    "medium",
    "supported"
  ],
  [
    "Namazda ayakta durmaya ne ad verilir?",
    "Kıyam",
    [
      "Rükû",
      "Secde",
      "Ka'de"
    ],
    "https://islamansiklopedisi.org.tr/namaz",
    "Namazın rükünleri: kıyam",
    "Kıyam namazdaki ayakta duruşun adıdır.",
    "prayer-positions",
    "medium",
    "supported"
  ],
  [
    "Namazda eğilme hareketi hangi adla bilinir?",
    "Rükû",
    [
      "Kıyam",
      "Selâm",
      "Sahur"
    ],
    "https://islamansiklopedisi.org.tr/namaz",
    "Namazın rükünleri: rükû",
    "Rükû namazın eğilme bölümüdür.",
    "prayer-positions",
    "medium",
    "supported"
  ],
  [
    "Namazda alın ve burnun yere konduğu bölüme ne denir?",
    "Secde",
    [
      "İhram",
      "Tavaf",
      "İmsak"
    ],
    "https://islamansiklopedisi.org.tr/namaz",
    "Namazın rükünleri: secde",
    "Secde namazın yere kapanma bölümüdür.",
    "prayer-positions",
    "medium",
    "supported"
  ],
  [
    "İslâm'ın ilk döneminde ezan uygulaması hangi şehirde başlamıştır?",
    "Medine",
    [
      "Mekke",
      "Bağdat",
      "Şam"
    ],
    "https://islamansiklopedisi.org.tr/ezan",
    "Ezanın tarihçesi",
    "Ezan namaza çağrı olarak Medine'de uygulanmaya başlanmıştır.",
    "adhan-history",
    "medium",
    "supported"
  ],
  [
    "İlk müezzinlerden biri olan sahâbî kimdir?",
    "Bilâl-i Habeşî",
    [
      "Hâlid b. Velîd",
      "Zeyd b. Sâbit",
      "Selmân-ı Fârisî"
    ],
    "https://islamansiklopedisi.org.tr/ezan",
    "İlk müezzinler",
    "Bilâl-i Habeşî İslâm'ın ilk müezzinlerinden biri olarak bilinir.",
    "adhan-bilal",
    "medium",
    "supported"
  ],
  [
    "Namaz için yönelinen istikamete ne denir?",
    "Kıble",
    [
      "İhram",
      "Suffe",
      "Miqat"
    ],
    "https://islamansiklopedisi.org.tr/kible",
    "Kıble tanımı",
    "Kıble Müslümanların namazda yöneldiği istikamettir.",
    "qibla-definition",
    "medium",
    "supported"
  ],
  [
    "Günümüzde Müslümanların namazda yöneldiği yapı hangisidir?",
    "Kâbe",
    [
      "Mescid-i Nebevî",
      "Kubbetü's-Sahre",
      "Hira Mağarası"
    ],
    "https://islamansiklopedisi.org.tr/kible",
    "Kıblenin Kâbe oluşu",
    "İslâm'da namazın kıblesi Kâbe'dir.",
    "qibla-direction",
    "medium",
    "supported"
  ],
  [
    "Mihrap caminin hangi yönündeki duvarda yer alır?",
    "Kıble yönündeki duvar",
    [
      "Giriş kapısının üstü",
      "Avlu duvarı",
      "Minarenin içi"
    ],
    "https://islamansiklopedisi.org.tr/mihrap",
    "Mihrap ve kıble duvarı",
    "Mihrap caminin kıble duvarında yer alır.",
    "mosque-mihrab",
    "medium",
    "supported"
  ],
  [
    "Camide minbere çıkarak hutbe okuyan kimseye ne denir?",
    "Hatip",
    [
      "Müezzin",
      "Hâfız",
      "Müfessir"
    ],
    "https://islamansiklopedisi.org.tr/minber",
    "Minberin işlevi",
    "Minberde hutbe okuyan kişi hatiptir.",
    "mosque-hatip",
    "medium",
    "supported"
  ],
  [
    "Abdestte yıkanması gereken uzuvlardan biri hangisidir?",
    "Yüz",
    [
      "Saçın tamamı",
      "Omuzlar",
      "Sırt"
    ],
    "https://islamansiklopedisi.org.tr/abdest",
    "Abdestin farzları",
    "Abdestte yüzün yıkanması gerekir.",
    "wudu-face",
    "medium",
    "supported"
  ],
  [
    "Su bulunmadığında belirli şartlarda yapılan toprakla temizlik hangisidir?",
    "Teyemmüm",
    [
      "Tavaf",
      "İtikâf",
      "Teravih"
    ],
    "https://islamansiklopedisi.org.tr/teyemmum",
    "Teyemmüm tanımı",
    "Teyemmüm uygun şartlarda su yerine temiz toprak cinsinden maddeyle yapılır.",
    "tayammum-meaning",
    "medium",
    "supported"
  ],
  [
    "Haccın yerine getirildiği kutsal şehir hangisidir?",
    "Mekke",
    [
      "Medine",
      "Kudüs",
      "Şam"
    ],
    "https://islamansiklopedisi.org.tr/hac",
    "Hac mekânları",
    "Hac ibadeti Mekke'de ve çevresindeki belirli mekânlarda yerine getirilir.",
    "hajj-mecca",
    "medium",
    "supported"
  ],
  [
    "Hac ve umrede belli yasakların başladığı özel hâle ne ad verilir?",
    "İhram",
    [
      "İftar",
      "Teravih",
      "Zekât"
    ],
    "https://islamansiklopedisi.org.tr/ihram",
    "İhram tanımı",
    "İhram, hac ve umreyle ilişkili özel ibadet hâlidir.",
    "ihram-meaning",
    "medium",
    "supported"
  ],
  [
    "Tavafta şavtların başlangıç ve bitiş hizasında hangi taş bulunur?",
    "Hacerülesved",
    [
      "Makam-ı İbrâhim taşı",
      "Safa taşı",
      "Merve taşı"
    ],
    "https://islamansiklopedisi.org.tr/tavaf",
    "Tavafta Hacerülesved köşesi",
    "Tavafta her şavt Hacerülesved hizasından başlar ve orada tamamlanır.",
    "tavaf-hacerulesved",
    "medium",
    "supported"
  ],
  [
    "Bir tavafta Kâbe etrafında kaç tur tamamlanır?",
    "7",
    [
      "3",
      "5",
      "10"
    ],
    "https://islamansiklopedisi.org.tr/tavaf",
    "Tavafın şavt sayısı",
    "Bir tavaf yedi şavttan oluşur.",
    "hac-rituals",
    "medium",
    "supported"
  ],
  [
    "Sa'y ibadetinde ilk yürüyüş hangi tepeden başlar?",
    "Safâ",
    [
      "Merve",
      "Arafat",
      "Uhud"
    ],
    "https://islamansiklopedisi.org.tr/say",
    "Sa'yın başlangıcı",
    "Sa'y Safâ tepesinden başlar ve Merve yönünde devam eder.",
    "say-safa",
    "medium",
    "supported"
  ],
  [
    "Sa'y toplam kaç şavttan oluşur?",
    "7",
    [
      "2",
      "4",
      "10"
    ],
    "https://islamansiklopedisi.org.tr/say",
    "Sa'yın şavt sayısı",
    "Sa'y Safâ ve Merve arasında yedi şavttır.",
    "hac-rituals",
    "medium",
    "supported"
  ],
  [
    "Hacda Arafat'ta belirli vakitte bulunma ibadeti hangi adla anılır?",
    "Vakfe",
    [
      "Tavaf",
      "Sa'y",
      "Tilâvet"
    ],
    "https://islamansiklopedisi.org.tr/arafat",
    "Arafat vakfesi",
    "Arafat vakfesi hac ibadetinin temel unsurlarındandır.",
    "arafat-waqfa",
    "medium",
    "supported"
  ],
  [
    "Hac sırasında cemrelere taş atma uygulamasının yapıldığı yer hangisidir?",
    "Mina",
    [
      "Safa",
      "Hira",
      "Sevr"
    ],
    "https://islamansiklopedisi.org.tr/mina",
    "Mina ve cemreler",
    "Hacda cemrelere taş atma Mina'da yerine getirilir.",
    "mina-stoning",
    "medium",
    "supported"
  ],
  [
    "Mekke'deki meşhur kutsal su kaynağının adı hangisidir?",
    "Zemzem",
    [
      "Kevser",
      "Selsebîl",
      "Fırat"
    ],
    "https://islamansiklopedisi.org.tr/zemzem",
    "Zemzem kuyusu",
    "Zemzem Mekke'de Kâbe civarındaki meşhur kuyunun suyudur.",
    "zamzam-well",
    "medium",
    "supported"
  ],
  [
    "Kâbe'nin yer aldığı büyük mescidin adı hangisidir?",
    "Mescid-i Harâm",
    [
      "Mescid-i Nebevî",
      "Mescid-i Aksâ",
      "Kuba Mescidi"
    ],
    "https://islamansiklopedisi.org.tr/mescid-i-haram",
    "Mescidin konumu",
    "Mescid-i Harâm Kâbe'yi çevreleyen kutsal mesciddir.",
    "masjid-haram",
    "medium",
    "supported"
  ],
  [
    "Mushaf sözcüğü hangi tür nesneyle ilişkilidir?",
    "Bir araya getirilmiş sayfalar",
    [
      "Çadır direkleri",
      "Su kuyuları",
      "Ticaret kervanları"
    ],
    "https://islamansiklopedisi.org.tr/mushaf",
    "Mushaf terimi ve kökeni",
    "Mushaf, yazılı sayfaların bir araya getirildiği kitap biçimiyle ilişkilidir.",
    "mushaf-etymology",
    "medium",
    "supported"
  ],
  [
    "Meâl neden Kur'an'ın harfiyen aynısı olarak görülmez?",
    "Anlamı aktaran bir çeviri olduğu için",
    [
      "Arap harfi içermediği için",
      "Sadece şiir olduğu için",
      "Sure sayısını değiştirdiği için"
    ],
    "https://islamansiklopedisi.org.tr/meal",
    "Meâl çevirisinin niteliği",
    "Meâl Kur'an metninin kendisi değil, anlamın başka dile aktarımıdır.",
    "meal-distinction",
    "medium",
    "supported"
  ],
  [
    "Kur'an âyetlerini tefsir eden âlime ne denir?",
    "Müfessir",
    [
      "Hattat",
      "Müezzin",
      "Mütevelli"
    ],
    "https://islamansiklopedisi.org.tr/tefsir",
    "Tefsir ilmi ve müfessir",
    "Kur'an âyetlerini açıklayan yorumcuya müfessir denir.",
    "tafsir-scholar",
    "medium",
    "supported"
  ],
  [
    "Hat sanatıyla uğraşan sanatçıya ne denir?",
    "Hattat",
    [
      "Müfessir",
      "Müezzin",
      "Mütevelli"
    ],
    "https://islamansiklopedisi.org.tr/hat",
    "Hat sanatı ve hattat",
    "Güzel yazı sanatını icra eden sanatçıya hattat denir.",
    "hat-artist",
    "medium",
    "supported"
  ],
  [
    "Mahya geleneği özellikle hangi kültürde gelişmiştir?",
    "Osmanlı cami kültürü",
    [
      "Endülüs saray mutfağı",
      "Pers denizciliği",
      "Roma tiyatrosu"
    ],
    "https://islamansiklopedisi.org.tr/mahya--ramazan",
    "Mahyanın tarihî gelişimi",
    "Mahya Osmanlı cami ve ramazan kültürünün belirgin uygulamalarındandır.",
    "mahya-ottoman",
    "medium",
    "supported"
  ]
];
export const generalV4 = makeCandidates("general", rows);
