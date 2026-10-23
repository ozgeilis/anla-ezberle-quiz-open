import type { CategoryId, Difficulty, Question } from "./model";

// 40 original questions authored with linked TDV or Diyanet reference passages.
// Source review and conditional owner acceptance do not imply independent scholarly sign-off.
type Row = readonly [CategoryId, string, string, readonly [string, string, string], string, string, string, string, Difficulty];
const rows: readonly Row[] = [
  [
    "quran",
    "Duhâ sûresinin adındaki 'duhâ' kelimesi hangi vakti ifade eder?",
    "Kuşluk vakti",
    [
      "Gece yarısı",
      "İkindi sonrası",
      "Gün batımı"
    ],
    "https://islamansiklopedisi.org.tr/duha-suresi",
    "Sûrenin adının kuşluk vaktinden gelişi",
    "Duhâ, güneş yükseldikten sonraki kuşluk vaktidir; sûrenin adı ilk âyetindeki bu kelimeden gelir.",
    "surah-duha-time",
    "easy"
  ],
  [
    "quran",
    "Kureyş sûresinde Kureyşlilerin hangi iki mevsimde yaptıkları yolculuklar anılır?",
    "Kış ve yaz",
    [
      "İlkbahar ve sonbahar",
      "Yaz ve sonbahar",
      "Kış ve ilkbahar"
    ],
    "https://islamansiklopedisi.org.tr/kureys-suresi",
    "İlk iki âyet, yaz ve kış ticarî seferleri",
    "Kureyş sûresinin ilk iki âyetinde kış ve yaz yolculukları anılır; tefsirlerde bunlar ticarî seferlerle ilişkilendirilir.",
    "surah-kureys-journeys",
    "medium"
  ],
  [
    "quran",
    "Nasr sûresinin adındaki 'nasr' kelimesi hangi anlamı taşır?",
    "Yardım",
    [
      "Yolculuk",
      "Sabah",
      "Kuşluk"
    ],
    "https://islamansiklopedisi.org.tr/nasr-suresi",
    "Sûrenin ilk âyetindeki nasr sözcüğü",
    "Nasr kelimesi yardım anlamındadır; sûrede ilâhî yardımın ve fethin gelişi anlatılır.",
    "surah-nasr-meaning",
    "easy"
  ],
  [
    "quran",
    "Tekâsür sûresinin başında eleştirilen davranış hangisidir?",
    "Çokluk ve servetle övünmek",
    [
      "Misafire ikram etmek",
      "İlim öğrenmek",
      "Yardımlaşmak"
    ],
    "https://islamansiklopedisi.org.tr/tekasur-suresi",
    "İlk iki âyet: tekâsürün ve övünmenin açıklaması",
    "Tekâsür sûresi, nüfus ve servet gibi şeylerin çokluğuyla övünüp âhireti ihmal etmeyi eleştirir.",
    "surah-takathur-boasting",
    "medium"
  ],
  [
    "quran",
    "Hümeze sûresinin ilk âyetinde eleştirilen davranış hangisidir?",
    "İnsanları çekiştirip küçük düşürmek",
    [
      "Komşuya yardım etmek",
      "Sözünde durmak",
      "İyiliği tavsiye etmek"
    ],
    "https://islamansiklopedisi.org.tr/humeze-suresi",
    "Hümeze ve lümeze kelimelerinin anlamları",
    "Hümeze sûresinde başkalarını çekiştiren ve küçümseyen tutumlar eleştirilir.",
    "surah-humaza-gossip",
    "medium"
  ],
  [
    "quran",
    "Kāria sûresindeki 'kāria' kelimesi dinî kullanımda özellikle neyi ifade eder?",
    "Kıyamet gününü",
    [
      "Hicret yolculuğunu",
      "Hac mevsimini",
      "Sahur vaktini"
    ],
    "https://islamansiklopedisi.org.tr/karia-suresi",
    "Kāria sözcüğünün kıyamet gününe işareti",
    "Kāria kelimesi bu sûrede kıyamet gününün sarsıcı dehşetini anlatmak için kullanılır.",
    "surah-qaria-doomsday",
    "medium"
  ],
  [
    "quran",
    "Fecr sûresinin başında üzerine yemin edilen 'fecr' ne anlama gelir?",
    "Tan yerinin ağarması",
    [
      "Gecenin ortası",
      "Öğle vakti",
      "Güneş batışı"
    ],
    "https://islamansiklopedisi.org.tr/fecr-suresi",
    "İlk âyet ve fecr kelimesinin sözlük anlamı",
    "Fecr, şafak sökmesi ve tan yerinin ağarması anlamına gelir; sûre bu ifadeyle başlar.",
    "surah-fajr-dawn",
    "easy"
  ],
  [
    "quran",
    "İnşirâh sûresinde iki defa vurgulanan mesaj hangisidir?",
    "Güçlükle beraber kolaylığın bulunması",
    [
      "Servet biriktirmenin önemi",
      "Yolculukların zorunluluğu",
      "Günlerin eşit uzunlukta olması"
    ],
    "https://islamansiklopedisi.org.tr/insirah-suresi",
    "5-6. âyetlerde güçlükle beraber kolaylık vurgusu",
    "İnşirâh sûresinin 5 ve 6. âyetlerinde güçlükle birlikte kolaylığın bulunduğu tekrarlanır.",
    "surah-inshirah-ease",
    "easy"
  ],
  [
    "quran",
    "Beyyine sûresine adını veren 'beyyine' sözcüğü ne anlama gelir?",
    "Apaçık delil",
    [
      "Gizli yolculuk",
      "Yüksek dağ",
      "Sabah serinliği"
    ],
    "https://islamansiklopedisi.org.tr/beyyine",
    "Beyyinenin sözlük ve terim anlamı",
    "Beyyine kelimesi apaçık ve kesin delil anlamı taşır; Beyyine sûresi bu adla anılır.",
    "surah-bayyina-meaning",
    "medium"
  ],
  [
    "quran",
    "Mâûn sûresinde hangi toplumsal davranış eleştirilir?",
    "Yetimi itip yoksulu gözetmemek",
    [
      "Komşuya iyilik etmek",
      "Yardıma koşmak",
      "Misafiri ağırlamak"
    ],
    "https://islamansiklopedisi.org.tr/maun-suresi",
    "İlk üç âyet, yetime ve yoksula tutum",
    "Mâûn sûresinde yetime kötü davranmak ve yoksulu doyurmaya teşvik etmemek kınanır.",
    "surah-maun-social",
    "easy"
  ],
  [
    "prophets",
    "İslâmî kaynaklarda 'İsrâil' adıyla da anılan peygamber kimdir?",
    "Hz. Ya‘kūb",
    [
      "Hz. Hârûn",
      "Hz. Süleyman",
      "Hz. Eyyûb"
    ],
    "https://islamansiklopedisi.org.tr/yakub",
    "Giriş: Ya‘kūb'un İsrâil adı",
    "İsrâil adı Hz. Ya‘kūb için de kullanılır; İsrâiloğulları onun soyunu ifade eder.",
    "yaqub-israel",
    "medium"
  ],
  [
    "prophets",
    "Hz. Yûsuf'un öz kardeşi olarak bilinen en küçük kardeşinin adı nedir?",
    "Bünyâmin",
    [
      "Hârûn",
      "Yahyâ",
      "İshak"
    ],
    "https://islamansiklopedisi.org.tr/bunyamin",
    "Madde tanımı; Hz. Yûsuf'un öz kardeşi",
    "Bünyâmin, Hz. Ya‘kūb'un en küçük oğlu ve Hz. Yûsuf'un öz kardeşidir.",
    "yusuf-bunyamin",
    "easy"
  ],
  [
    "prophets",
    "Meryem sûresine göre ailesine namazı ve zekâtı emreden peygamber kimdir?",
    "Hz. İsmâil",
    [
      "Hz. Hûd",
      "Hz. Yûnus",
      "Hz. İlyâs"
    ],
    "https://islamansiklopedisi.org.tr/ismail--peygamber",
    "Meryem 19/54-55: namaz ve zekât",
    "Meryem 19/55'te Hz. İsmâil'in ailesine namaz kılmayı ve zekât vermeyi emrettiği belirtilir.",
    "ismail-prayer-charity",
    "medium"
  ],
  [
    "prophets",
    "Hz. Şuayb, kavmine özellikle hangi ticaret davranışında adaletli olmalarını öğütler?",
    "Ölçü ve tartıda",
    [
      "Yalnız deniz yolculuğunda",
      "Sadece tarla sulamada",
      "Yalnız ev yapımında"
    ],
    "https://islamansiklopedisi.org.tr/suayb",
    "A‘râf 7/85-86; ölçü ve tartı uyarısı",
    "Hz. Şuayb, Medyen halkını ölçü ve tartıyı doğru yapmaya, insanların hakkını eksiltmemeye çağırmıştır.",
    "shuayb-trade-fairness",
    "medium"
  ],
  [
    "prophets",
    "Kur'an'da dağların ve kuşların tesbihine katıldığı bildirilen peygamber kimdir?",
    "Hz. Dâvûd",
    [
      "Hz. Lût",
      "Hz. Şuayb",
      "Hz. Zekeriyyâ"
    ],
    "https://islamansiklopedisi.org.tr/davud",
    "Enbiyâ 21/79; Sebe' 34/10",
    "Kur'an'da dağların ve kuşların Hz. Dâvûd ile birlikte Allah'ı tesbih ettiği belirtilir.",
    "davud-mountains-birds",
    "medium"
  ],
  [
    "prophets",
    "Sâd sûresi 38/42'ye göre Hz. Eyyûb'un şifasına vesile olan şey nedir?",
    "Yerden çıkan su",
    [
      "Denizden getirilen inci",
      "Gökten inen taş",
      "Ateşte pişen ekmek"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/38",
    "Sâd 38/42: yıkanılacak ve içilecek serin su",
    "Sâd sûresine göre Hz. Eyyûb'un ayağını yere vurmasıyla çıkan sudan yıkanıp içmesi şifasına vesile olur.",
    "eyyub-water",
    "medium"
  ],
  [
    "prophets",
    "Nûh sûresi 71/5'e göre Hz. Nûh kavmini ne zaman hak dine çağırmıştır?",
    "Gece gündüz",
    [
      "Yalnız cuma günleri",
      "Sadece sabahları",
      "Yalnız bayramlarda"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/71",
    "Nûh 71/5: gece gündüz davet",
    "Nûh sûresi 5. âyette Hz. Nûh'un kavmini gece gündüz iman etmeye çağırdığını anlatır.",
    "nuh-day-night",
    "easy"
  ],
  [
    "prophets",
    "Neml sûresi 27/16'da kendisine kuş dilinin öğretildiği bildirilen peygamber kimdir?",
    "Hz. Süleyman",
    [
      "Hz. Dâvûd",
      "Hz. Yûsuf",
      "Hz. Şuayb"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/27",
    "Neml 27/16: kuş dilinin öğretilmesi",
    "Neml 27/16'da Hz. Süleyman, kendilerine kuş dilinin öğretildiğini söyler.",
    "sulayman-bird-language",
    "easy"
  ],
  [
    "prophets",
    "En‘âm sûresi 6/76-79'da yıldız, ay ve güneşi örnek gösteren peygamber kimdir?",
    "Hz. İbrâhim",
    [
      "Hz. Mûsâ",
      "Hz. İdrîs",
      "Hz. Yahyâ"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/6",
    "En‘âm 6/76-79: gök cisimleri üzerine tevhid anlatımı",
    "En‘âm sûresinde Hz. İbrâhim yıldız, ay ve güneşin batışını anlatarak yalnız yaratıcıya yöneldiğini belirtir.",
    "ibrahim-stars-moon-sun",
    "medium"
  ],
  [
    "prophets",
    "A‘râf sûresi 7/83'e göre Hz. Lût'un ailesinden kim kurtarılanlar arasında yer almaz?",
    "Eşi",
    [
      "Kardeşi",
      "Babası",
      "Oğlu"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/7",
    "A‘râf 7/83: Lût'un eşinin geride kalanlardan oluşu",
    "A‘râf 7/83'e göre Hz. Lût'un karısı kurtarılanlar arasında değil, geride kalanlar arasındadır.",
    "lut-wife",
    "medium"
  ],
  [
    "history",
    "Hicret sırasında Hz. Peygamber'i Medine'deki evinde ağırlayan sahâbî kimdir?",
    "Ebû Eyyûb el-Ensârî",
    [
      "Ebû Zer el-Gıfârî",
      "Abdurrahman b. Avf",
      "Zeyd b. Hârise"
    ],
    "https://islamansiklopedisi.org.tr/ebu-eyyub-el-ensari",
    "Medine'ye hicret, evinde misafir kalması",
    "Hz. Peygamber Medine'ye ulaştığında Ebû Eyyûb el-Ensârî'nin evinde bir süre misafir kaldı.",
    "abu-ayyub-host",
    "easy"
  ],
  [
    "history",
    "Türkiye'de 'Eyüp Sultan' adıyla tanınan sahâbî kimdir?",
    "Ebû Eyyûb el-Ensârî",
    [
      "Hassân b. Sâbit",
      "Bilâl-i Habeşî",
      "Abdullah b. Mes‘ûd"
    ],
    "https://islamansiklopedisi.org.tr/ebu-eyyub-el-ensari",
    "Giriş: Eyüp Sultan unvanı",
    "Eyüp Sultan olarak anılan sahâbî, asıl adı Hâlid b. Zeyd olan Ebû Eyyûb el-Ensârî'dir.",
    "abu-ayyub-host",
    "medium"
  ],
  [
    "history",
    "Medine'deki öğretim faaliyetinden önce Habeşistan'a hicret eden sahâbî kimdir?",
    "Mus‘ab b. Umeyr",
    [
      "Sa‘d b. Muâz",
      "Ebû Zer el-Gıfârî",
      "Zeyd b. Sâbit"
    ],
    "https://islamansiklopedisi.org.tr/musab-b-umeyr",
    "Peygamberliğin beşinci yılında Habeşistan hicreti",
    "Mus‘ab b. Umeyr ilk müminlerdendi; Habeşistan'a hicret etmiş, daha sonra Medine'de öğretim yapmıştır.",
    "musab-abyssinia",
    "hard"
  ],
  [
    "history",
    "Servetin bir elde birikmesine karşı tavrıyla tanınan sahâbî kimdir?",
    "Ebû Zer el-Gıfârî",
    [
      "Hâlid b. Velîd",
      "Abdullah b. Abbas",
      "Hassân b. Sâbit"
    ],
    "https://islamansiklopedisi.org.tr/ebu-zer-el-gifari",
    "Madde tanımı: servet terakümüne yönelik görüşleri",
    "Ebû Zer el-Gıfârî, servet birikimi konusundaki görüşleriyle tanınan bir sahâbîdir.",
    "abu-dharr-wealth",
    "medium"
  ],
  [
    "history",
    "Hz. Ebû Bekir'in aracılığıyla Müslüman olduğu belirtilen tüccar sahâbî kimdir?",
    "Abdurrahman b. Avf",
    [
      "Bilâl-i Habeşî",
      "Mus‘ab b. Umeyr",
      "Ebû Eyyûb el-Ensârî"
    ],
    "https://islamansiklopedisi.org.tr/abdurrahman-b-avf",
    "Giriş: Ebû Bekir vasıtasıyla Müslüman oluşu",
    "Abdurrahman b. Avf, ticaretle uğraşan ilk Müslümanlardan biridir; Hz. Ebû Bekir'in aracılığıyla iman etmiştir.",
    "abd-rahman-awf-conversion",
    "medium"
  ],
  [
    "history",
    "750 yılında başlayan Abbâsî hilâfetinin ilk halifesi kimdir?",
    "Ebü'l-Abbas es-Seffâh",
    [
      "Hârûnürreşîd",
      "Me'mûn",
      "Mu‘tasım-Billâh"
    ],
    "https://islamansiklopedisi.org.tr/ebul-abbas-es-seffah",
    "Giriş: ilk Abbâsî halifesi (750-754)",
    "Ebü'l-Abbas es-Seffâh 750-754 yılları arasında hüküm süren ilk Abbâsî halifesidir.",
    "abbasid-first-caliph",
    "medium"
  ],
  [
    "history",
    "836 yılında Abbâsîler için Sâmerrâ şehrini başşehir olarak kuran halife kimdir?",
    "Mu‘tasım-Billâh",
    [
      "Ebü'l-Abbas es-Seffâh",
      "Mansûr",
      "Ömer b. Abdülazîz"
    ],
    "https://islamansiklopedisi.org.tr/samerra",
    "221/836: Sâmerrâ'nın kuruluşu",
    "Sâmerrâ, Abbâsî Halifesi Mu‘tasım-Billâh tarafından 836 yılında yeni başşehir olarak kurulmuştur.",
    "samarra-founded",
    "hard"
  ],
  [
    "history",
    "Abbâsîler döneminde tercüme ve araştırmalarıyla tanınan Beytülhikme hangi şehirdeydi?",
    "Bağdat",
    [
      "Kûfe",
      "Basra",
      "Kahire"
    ],
    "https://islamansiklopedisi.org.tr/beytulhikme",
    "Bağdat Beytülhikme'sinin kuruluşu ve ilmî faaliyetleri",
    "Beytülhikme, Abbâsî döneminde Bağdat'ta tercüme ve ilmî çalışmaların yürütüldüğü merkez olarak tanınır.",
    "bayt-alhikma-baghdad",
    "medium"
  ],
  [
    "history",
    "Büyük Selçuklu dönemindeki Nizâmiye medreseleri hangi devlet adamının adıyla anılır?",
    "Nizâmülmülk",
    [
      "İbn Sînâ",
      "Hârûnürreşîd",
      "Selmân-ı Fârisî"
    ],
    "https://islamansiklopedisi.org.tr/nizamiye-medresesi",
    "Medreselerin Nizâmülmülk tarafından kurulması",
    "Nizâmiye medreseleri adını bu kurumları açtıran Büyük Selçuklu veziri Nizâmülmülk'ten alır.",
    "nizamiyya-schools",
    "medium"
  ],
  [
    "history",
    "Mescid-i Nebevî'nin yeşil kubbesi hangi adla bilinir?",
    "Kubbetü'l-hadrâ",
    [
      "Kubbetü's-sahra",
      "Kubbetü'l-hazîne",
      "Kubbetü'l-mahmûd"
    ],
    "https://islamansiklopedisi.org.tr/mescid-i-nebevi",
    "Osmanlı imarında yeşile boyanan kubbenin adı",
    "Mescid-i Nebevî'nin yeşile boyanmış ve simgeleşmiş kubbesine Kubbetü'l-hadrâ adı verilir.",
    "nebevi-green-dome",
    "hard"
  ],
  [
    "general",
    "Bir dinî-hukukî sorunun hükmünü açıklayan cevaba ne denir?",
    "Fetva",
    [
      "Kıraat",
      "Hatim",
      "Mahya"
    ],
    "https://islamansiklopedisi.org.tr/fetva",
    "Giriş: fetva teriminin tanımı",
    "Fetva, dinî-hukukî bir konuda yetkin kişinin açıkladığı cevap veya hükümdür.",
    "fatwa-concept",
    "easy"
  ],
  [
    "general",
    "Fıkhî sorulara fetva veren yetkili kişiye ne denir?",
    "Müftü",
    [
      "Müfessir",
      "Müezzin",
      "Müstensih"
    ],
    "https://islamansiklopedisi.org.tr/fetva",
    "Giriş: müftî teriminin açıklaması",
    "Müftü, kendisine yöneltilen dinî-hukukî sorulara fetva veren kişidir.",
    "fatwa-concept",
    "easy"
  ],
  [
    "general",
    "İslâmî terim olarak 'vahiy' neyi ifade eder?",
    "Allah'ın peygamberine emir ve bilgi bildirmesini",
    [
      "Bir şehrin inşa edilmesini",
      "Bir ticaret sözleşmesini",
      "Bir savaşın sona ermesini"
    ],
    "https://islamansiklopedisi.org.tr/vahiy",
    "Giriş: vahyin terim anlamı",
    "Vahiy, Allah'ın dilediği emir, hüküm ve bilgileri peygamberine bildirmesidir.",
    "wahy-definition",
    "easy"
  ],
  [
    "general",
    "Bir kulun Allah'a yönelip istekte bulunmasını ifade eden ibadet hangisidir?",
    "Dua",
    [
      "Kıyas",
      "İcma",
      "Tefsir"
    ],
    "https://islamansiklopedisi.org.tr/dua",
    "Giriş: dua teriminin tanımı",
    "Dua, Allah'a saygı ve yönelişle O'ndan yardım ve iyilik istemeyi ifade eder.",
    "dua-definition",
    "easy"
  ],
  [
    "general",
    "İslâm'ın amelî hükümlerini ele alan ilim dalına ne ad verilir?",
    "Fıkıh",
    [
      "Astronomi",
      "Coğrafya",
      "Hat sanatı"
    ],
    "https://islamansiklopedisi.org.tr/fikih",
    "Giriş: amelî hükümlerle ilgili ilim",
    "Fıkıh, İslâmî kaynaklara dayanarak ibadet ve toplumsal ilişkiler gibi amelî hükümleri inceleyen ilimdir.",
    "fiqh-discipline",
    "medium"
  ],
  [
    "general",
    "Allah'ın emirlerine uymaya ve günahlardan sakınmaya özen göstermeye ne denir?",
    "Takvâ",
    [
      "İhram",
      "Mahya",
      "Siyer"
    ],
    "https://islamansiklopedisi.org.tr/takva",
    "Giriş: takvâ teriminin tanımı",
    "Takvâ, Allah'ın emirlerine uymak ve yasaklarından uzak durmak konusunda gösterilen bilinçli titizliktir.",
    "taqwa-definition",
    "medium"
  ],
  [
    "general",
    "Fıkıh usulünde Hz. Peygamber'in söz, fiil ve onaylarını kapsayan terim hangisidir?",
    "Sünnet",
    [
      "Meâl",
      "İcma",
      "Mushaf"
    ],
    "https://islamansiklopedisi.org.tr/sunnet--peygamber",
    "Giriş: kavlî, fiilî ve takrirî sünnet",
    "Sünnet, fıkıh usulü bakımından Hz. Peygamber'in sözlerini, fiillerini ve onaylarını kapsar.",
    "sunna-term",
    "medium"
  ],
  [
    "general",
    "Hz. Peygamber'e nispet edilen söz ve haberlerin nakline dayanan bilgi türü hangisidir?",
    "Hadis",
    [
      "Mahya",
      "Mihrap",
      "Mukabele"
    ],
    "https://islamansiklopedisi.org.tr/hadis",
    "Giriş: hadis tanımı",
    "Hadis, Hz. Peygamber'e nispet edilen söz, fiil ve onaylara dair rivayetleri ifade eder.",
    "hadith-term",
    "easy"
  ],
  [
    "general",
    "Fıkıh terminolojisinde bir konunun hükmünü fetva yoluyla sormaya ne denir?",
    "İstiftâ",
    [
      "İtikâf",
      "Tesbih",
      "Tilâvet"
    ],
    "https://islamansiklopedisi.org.tr/fetva",
    "Fetva maddesi: istiftâ teriminin anlamı",
    "İstiftâ, dinî-hukukî bir konuda yetkili kişiden fetva isteme işlemidir.",
    "fatwa-concept",
    "hard"
  ],
  [
    "general",
    "İslâm'da genel anlamıyla Allah'ın rızasını gözeterek yapılan davranışlara ne denir?",
    "İbadet",
    [
      "Seyahat",
      "Müzakere",
      "Ticaret"
    ],
    "https://islamansiklopedisi.org.tr/ibadet",
    "İbadetin genel anlamı: Allah rızasına uygun davranma",
    "İbadet yalnız belli ritüellerle sınırlı değildir; Allah'ın rızasını gözeterek yapılan iyi davranışları da kapsayabilir.",
    "ibadah-general",
    "medium"
  ],
];
const counters: Record<CategoryId, number> = { quran: 0, prophets: 0, history: 0, general: 0 };
export const newCandidatesV9: readonly Question[] = rows.map((row): Question => {
  const [categoryId, question, correct, wrong, url, locator, explanation, conceptGroup, difficulty] = row;
  const id = `v9-${categoryId}-${String(++counters[categoryId]).padStart(3, "0")}`;
  const isDiyanet = url.startsWith("https://kuran.diyanet.gov.tr/");
  return {
    id, version: 1, categoryId, difficulty, question,
    options: [{ id: "o1", text: wrong[0] }, { id: "o2", text: correct }, { id: "o3", text: wrong[1] }, { id: "o4", text: wrong[2] }],
    correctOptionId: "o2", explanation,
    sources: [{ title: isDiyanet ? "Diyanet Kur'an Yolu" : "TDV İslâm Ansiklopedisi",
      publisher: isDiyanet ? "Diyanet İşleri Başkanlığı" : "TDV İslâm Araştırmaları Merkezi",
      url, locator, supports: explanation, checkStatus: "supported", checkedAt: "2026-10-19" }],
    reviewStatus: "approved",
    reviewNotes: "Ürün sahibinin kaynak doğrulama koşullu kullanım iznine dayanır. Bağımsız editör ve dinî uzman incelemesi yapılmış sayılmaz.",
    updatedAt: "2026-10-19", conceptGroup,
  };
});
