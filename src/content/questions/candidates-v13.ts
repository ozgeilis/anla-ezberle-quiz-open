import type { CategoryId, Difficulty, Question } from "./model";

// 50 source-linked v13 questions; external specialist review is not implied.
type Row = readonly [CategoryId, string, string, readonly [string, string, string], string, string, string, string, Difficulty];
const rows: readonly Row[] = [
  [
    "quran",
    "Bakara 2/255'te Allah hakkında hangi ifade yer alır?",
    "O'nu uyuklama ve uyku tutmaz",
    [
      "Gece uyuduğu belirtilir",
      "Yalnız sabahları bildiği söylenir",
      "Sadece denizleri yönettiği bildirilir"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=255&mode=tefsir&sure=2",
    "Bakara 2/255: Âyetü'l-kürsî",
    "Âyetü'l-kürsî'de Allah'ın ne uyukladığı ne de uyuduğu, göklerin ve yerin O'na ait olduğu belirtilir.",
    "ayatul-kursi-sleep",
    "medium"
  ],
  [
    "quran",
    "Bakara 2/152'de insanlardan hangi davranış istenir?",
    "Allah'ı anmaları ve şükretmeleri",
    [
      "Birbirlerini küçümsemeleri",
      "Komşularına zarar vermeleri",
      "Her haberi yaymaları"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=152&mode=tefsir&sure=2",
    "Bakara 2/152: zikir ve şükür",
    "Bakara 2/152'de Allah'ı anmak, O'na şükretmek ve nankörlükten kaçınmak öğütlenir.",
    "zikr-gratitude-152",
    "easy"
  ],
  [
    "quran",
    "Bakara 2/148'de hangi konuda yarışılması istenir?",
    "İyi işlerde",
    [
      "Mal biriktirmede",
      "Kibirlenmede",
      "İnsanlarla alay etmede"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=148&mode=tefsir&sure=2",
    "Bakara 2/148: hayırlarda yarışın",
    "Bakara 2/148'de iyi ve hayırlı işlerde öne geçmeye çalışılması öğütlenir.",
    "race-goodness",
    "easy"
  ],
  [
    "quran",
    "Âl-i İmrân 3/103'te birlik için neye sımsıkı sarılmak öğütlenir?",
    "Allah'ın ipine",
    [
      "Servet yarışına",
      "Şöhret hevesine",
      "Kabile üstünlüğüne"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=103&mode=tefsir&sure=3",
    "Âl-i İmrân 3/103: Allah'ın ipine sarılın",
    "Âl-i İmrân 3/103'te Allah'ın ipine hep birlikte sarılma ve ayrılığa düşmeme öğütlenir.",
    "unity-rope",
    "medium"
  ],
  [
    "quran",
    "Nisâ 4/36'da iyilik yapılması öğütlenen gruplar arasında kimler bulunur?",
    "Yakın ve uzak komşular",
    [
      "Yalnız hükümdarlar",
      "Yalnız tüccarlar",
      "Sadece savaşçılar"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=36&mode=tefsir&sure=4",
    "Nisâ 4/36: komşulara iyilik",
    "Nisâ 4/36'da anne baba, akraba ve ihtiyaç sahiplerinin yanında yakın ve uzak komşulara da iyilik emredilir.",
    "neighbor-kindness",
    "easy"
  ],
  [
    "quran",
    "Nahl 16/90'da emredilen davranışlardan biri hangisidir?",
    "Adaletli davranmak",
    [
      "Haksızlık yapmak",
      "İnsanları aşağılamak",
      "Hileli ölçüm yapmak"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=90&mode=tefsir&sure=16",
    "Nahl 16/90: adalet ve ihsan",
    "Nahl 16/90'da adalet, iyilik ve yakınlara yardım emredilirken kötülükten sakındırılır.",
    "justice-ihsan",
    "easy"
  ],
  [
    "quran",
    "İsrâ 17/34'te insanlardan özellikle neyi yerine getirmeleri istenir?",
    "Verdikleri sözü",
    [
      "Her isteği sorgusuz kabul etmeyi",
      "Bütün seyahatleri iptal etmeyi",
      "Serveti sürekli saklamayı"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=34&mode=tefsir&sure=17",
    "İsrâ 17/34: verilen sözü tutma",
    "İsrâ 17/34'te verilen sözün sorumluluk doğurduğu ve ahde vefa gerektiği hatırlatılır.",
    "fulfill-pledge",
    "medium"
  ],
  [
    "quran",
    "İsrâ 17/35'te ticarette hangi davranış öğütlenir?",
    "Ölçü ve tartıyı tam yapmak",
    [
      "Tartıyı gizlice eksiltmek",
      "Ölçeği değiştirmek",
      "Borcu inkâr etmek"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=35&mode=tefsir&sure=17",
    "İsrâ 17/35: ölçüyü tam tutun",
    "İsrâ 17/35'te ölçünün eksiksiz yapılması ve doğru teraziyle tartılması istenir.",
    "honest-scales",
    "medium"
  ],
  [
    "quran",
    "Enbiyâ 21/30'da canlıların yaratılışı hangi unsurla ilişkilendirilir?",
    "Su",
    [
      "Altın",
      "Cam",
      "Demir"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=30&mode=tefsir&sure=21",
    "Enbiyâ 21/30: her canlı şey sudan",
    "Enbiyâ 21/30'da her canlı şeyin sudan yaratıldığına dikkat çekilir.",
    "life-from-water",
    "easy"
  ],
  [
    "quran",
    "Furkān 25/63'te Rahmân'ın kulları yeryüzünde nasıl yürüyen kişiler olarak anlatılır?",
    "Alçak gönüllülükle",
    [
      "Böbürlenerek",
      "Koşarak herkesi iterek",
      "Herkesi korkutarak"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=63&mode=tefsir&sure=25",
    "Furkān 25/63: tevazu ile yürümek",
    "Furkān 25/63'te Rahmân'ın kullarının yeryüzünde tevazuyla yürüdükleri belirtilir.",
    "servants-humility",
    "medium"
  ],
  [
    "quran",
    "Şûrâ 42/40'da bağışlayıp uzlaşan kişi için neyin Allah'a ait olduğu belirtilir?",
    "Ödülünün",
    [
      "Ticaret malının",
      "Yolculuk biletinin",
      "Evinin"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=40&mode=tefsir&sure=42",
    "Şûrâ 42/40: affetmek ve uzlaşmak",
    "Şûrâ 42/40, haksızlığı affedip barış sağlayanların ödülünün Allah'a ait olduğunu belirtir.",
    "pardon-reconcile",
    "medium"
  ],
  [
    "quran",
    "Cum'a 62/10'da namaz tamamlandıktan sonra hangi davranışa izin verilir?",
    "Yeryüzüne dağılıp Allah'ın lütfunu aramak",
    [
      "Bütün çalışmaları sonsuza dek bırakmak",
      "Komşuları rahatsız etmek",
      "Kimseyle görüşmemek"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=10&mode=tefsir&sure=62",
    "Cum'a 62/10: namazdan sonra dağılıp rızık aramak",
    "Cum'a 62/10'da namazdan sonra yeryüzüne dağılıp Allah'ın lütfundan rızık aranabileceği belirtilir.",
    "jumuah-after-prayer",
    "medium"
  ],
  [
    "quran",
    "İnfitâr 82/10-12'de insanların davranışlarını kayıt altına aldığı anlatılan varlıklar kimlerdir?",
    "Değerli yazıcı melekler",
    [
      "Denizciler",
      "Tarihçiler",
      "Tüccarlar"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=10&mode=tefsir&sure=82",
    "İnfitâr 82/10-12: değerli yazıcılar",
    "İnfitâr sûresinde insanların yaptıklarını bilen ve kaydeden değerli yazıcıların bulunduğu bildirilir.",
    "angels-record",
    "medium"
  ],
  [
    "prophets",
    "Bakara 2/67'de Hz. Mûsâ, kavmine hangi hayvanı kesmelerinin emredildiğini bildirir?",
    "Bir sığır",
    [
      "Bir at",
      "Bir güvercin",
      "Bir balık"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=67&mode=tefsir&sure=2",
    "Bakara 2/67: sığır kesme emri",
    "Bakara 2/67'de Hz. Mûsâ kavmine Allah'ın bir sığır kesmelerini emrettiğini haber verir.",
    "musa-cow",
    "easy"
  ],
  [
    "prophets",
    "A‘râf 7/160'a göre İsrâiloğullarının üzerini gölgeleyen şey nedir?",
    "Bulut",
    [
      "Gemi yelkenleri",
      "Demir çatı",
      "Taş duvar"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=160&mode=tefsir&sure=7",
    "A‘râf 7/160: bulutun gölgelik yapılması",
    "A‘râf 7/160'da İsrâiloğullarının bulutlarla gölgelendiği anlatılır.",
    "israelites-cloud-shade",
    "medium"
  ],
  [
    "prophets",
    "Tâhâ 20/27'de Hz. Mûsâ konuşması için Allah'tan ne ister?",
    "Dilindeki düğümün çözülmesini",
    [
      "Bir gemi verilmesini",
      "Bir taç verilmesini",
      "Bir bahçe kurulmasını"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=27&mode=tefsir&sure=20",
    "Tâhâ 20/25-28: dilindeki düğümü çöz",
    "Hz. Mûsâ duasında işinin kolaylaşmasını ve sözünün anlaşılması için dilindeki düğümün çözülmesini ister.",
    "musa-tongue",
    "medium"
  ],
  [
    "prophets",
    "Tâhâ 20/29-30'da Hz. Mûsâ kendisine yardımcı olarak kimi ister?",
    "Kardeşi Hârûn'u",
    [
      "Hz. Yûnus'u",
      "Hz. Eyyûb'u",
      "Hz. İsmâil'i"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=29&mode=tefsir&sure=20",
    "Tâhâ 20/29-30: Hârûn'u yardımcı kıl",
    "Hz. Mûsâ Allah'tan ailesinden kardeşi Hârûn'u kendisine yardımcı yapmasını diler.",
    "musa-harun-helper",
    "easy"
  ],
  [
    "prophets",
    "Âl-i İmrân 3/37'ye göre Hz. Zekeriyyâ, Hz. Meryem'in yanında ne bulur?",
    "Rızık",
    [
      "Bir taç",
      "Bir kılıç",
      "Bir gemi"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=37&mode=tefsir&sure=3",
    "Âl-i İmrân 3/37: yanında yiyecek rızık bulması",
    "Âl-i İmrân 3/37'de Hz. Zekeriyyâ'nın Hz. Meryem'in yanına girdiğinde onun yanında rızık bulduğu bildirilir.",
    "maryam-provision",
    "medium"
  ],
  [
    "prophets",
    "Âl-i İmrân 3/49'da Hz. Îsâ'nın Allah'ın izniyle canlanan bir örneği hangi malzemeden yaptığı anlatılır?",
    "Çamur",
    [
      "Altın",
      "Cam",
      "Demir"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=49&mode=tefsir&sure=3",
    "Âl-i İmrân 3/49: çamurdan kuş şekli",
    "Âl-i İmrân 3/49'da Hz. Îsâ'nın çamurdan kuş şekli yapıp Allah'ın izniyle canlanmasına vesile olduğu bildirilir.",
    "isa-clay-bird",
    "medium"
  ],
  [
    "prophets",
    "Mâide 5/112'ye göre havâriler Hz. Îsâ'dan gökten ne indirilmesini ister?",
    "Bir sofra",
    [
      "Bir asa",
      "Bir gemi",
      "Bir merdiven"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=112&mode=tefsir&sure=5",
    "Mâide 5/112-115: gökten sofra isteği",
    "Mâide sûresinde havâriler, Hz. Îsâ'dan Allah'a dua ederek gökten bir sofra indirilmesini istemesini talep ederler.",
    "isa-disciples-table",
    "easy"
  ],
  [
    "prophets",
    "Enbiyâ 21/58'e göre Hz. İbrâhim putları kırarken hangisini bırakır?",
    "Büyük putu",
    [
      "En küçük putu",
      "Hepsini kırmadan bırakır",
      "Yalnız tahtadan olanı"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=58&mode=tefsir&sure=21",
    "Enbiyâ 21/58: büyük put hariç hepsini kırma",
    "Enbiyâ sûresinde Hz. İbrâhim, kavminin putlarını kırarken içlerinden en büyüğünü bırakır.",
    "ibrahim-idols-big",
    "medium"
  ],
  [
    "prophets",
    "Sâffât 37/107'de kurban kıssasında çocuğun yerine verilen şey nasıl nitelenir?",
    "Büyük bir kurbanlık",
    [
      "Bir kitap",
      "Bir dağ",
      "Bir gemi"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=107&mode=tefsir&sure=37",
    "Sâffât 37/107: büyük kurbanlıkla fidye",
    "Sâffât 37/107'de Hz. İbrâhim'in oğlunun büyük bir kurbanlıkla fidyelendiği bildirilir.",
    "ibrahim-sacrifice-ransom",
    "medium"
  ],
  [
    "prophets",
    "Hûd 11/40'ta Hz. Nûh'a gemiye hayvanlardan nasıl alması emredilir?",
    "Her türden birer çift",
    [
      "Yalnız kuşlardan üç tane",
      "Yalnız balıklardan dört tane",
      "Her türden yalnız bir dişi"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=40&mode=tefsir&sure=11",
    "Hûd 11/40: her türden birer çift",
    "Hûd 11/40'ta Hz. Nûh'a gemiye hayvanlardan birer çift ve iman edenleri alması emredilir.",
    "nuh-ark-pairs",
    "medium"
  ],
  [
    "prophets",
    "Âl-i İmrân 3/42'de meleklerin seçilmiş ve temiz kılınmış olduğunu bildirdiği kişi kimdir?",
    "Hz. Meryem",
    [
      "Hz. Sâre",
      "Hz. Hacer",
      "Hz. Âsiye"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=42&mode=tefsir&sure=3",
    "Âl-i İmrân 3/42: Meryem'in seçilmesi",
    "Âl-i İmrân 3/42'de melekler Hz. Meryem'in Allah tarafından seçilip temiz kılındığını bildirir.",
    "maryam-chosen",
    "medium"
  ],
  [
    "prophets",
    "Tâhâ 20/12'de Hz. Mûsâ'ya kutsal vadide hangi eşyasını çıkarması emredilir?",
    "Ayakkabılarını",
    [
      "Pelerinini",
      "Yüzüğünü",
      "Kemerini"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=12&mode=tefsir&sure=20",
    "Tâhâ 20/12: ayakkabılarını çıkar",
    "Tâhâ 20/12'de Hz. Mûsâ'ya kutsal Tuvâ vadisinde ayakkabılarını çıkarması emredilir.",
    "musa-tuwa-shoes",
    "medium"
  ],
  [
    "prophets",
    "Sâd 38/35'te Hz. Süleyman Allah'tan nasıl bir hükümranlık ister?",
    "Kendisinden sonra kimseye nasip olmayacak bir mülk",
    [
      "Yalnız deniz kıyısı olan bir ülke",
      "Sadece bir günlük yönetim",
      "Tek gemilik bir filo"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=35&mode=tefsir&sure=38",
    "Sâd 38/35: eşsiz hükümranlık duası",
    "Hz. Süleyman Sâd 38/35'te kendisinden sonra kimseye nasip olmayacak bir hükümranlık için dua eder.",
    "sulayman-kingdom-prayer",
    "hard"
  ],
  [
    "history",
    "Mâlikî fıkıh mezhebinin imamı olarak tanınan âlim kimdir?",
    "Mâlik b. Enes",
    [
      "İbnü'l-Heysem",
      "Evliya Çelebi",
      "Pîrî Reis"
    ],
    "https://islamansiklopedisi.org.tr/malik-b-enes",
    "TDV Mâlik b. Enes: Mâlikî mezhebinin imamı",
    "Mâlik b. Enes, Medine merkezli fıkıh geleneğinde yetişmiş Mâlikî mezhebinin imamıdır.",
    "malik-founder",
    "easy"
  ],
  [
    "history",
    "Fıkıh usulüne dair er-Risâle adlı eseri yazan âlim kimdir?",
    "İmam Şâfiî",
    [
      "Ebû Hanîfe",
      "Bîrûnî",
      "İbn Battûta"
    ],
    "https://islamansiklopedisi.org.tr/er-risale--safii",
    "TDV er-Risâle: İmam Şâfiî'nin eseri",
    "er-Risâle, İmam Şâfiî'nin fıkıh usulü alanındaki önemli eseridir.",
    "shafii-risala",
    "medium"
  ],
  [
    "history",
    "Hanbelî fıkıh mezhebinin kendisine nispet edildiği âlim kimdir?",
    "Ahmed b. Hanbel",
    [
      "Ebû Yûsuf",
      "Mâlik b. Enes",
      "İbn Sînâ"
    ],
    "https://islamansiklopedisi.org.tr/hanbeli-mezhebi",
    "Hanbelî mezhebinin Ahmed b. Hanbel çevresinde oluşması",
    "Hanbelî mezhebi, Ahmed b. Hanbel'in ilmî görüşleri ve takipçileri etrafında şekillenmiştir.",
    "hanbali-founder",
    "medium"
  ],
  [
    "history",
    "Kurtuba Ulucamii'nin yapımını 786 yılında başlatan Endülüs hükümdarı kimdir?",
    "I. Abdurrahman",
    [
      "II. Bayezid",
      "I. Selim",
      "Ebü'l-Abbas es-Seffâh"
    ],
    "https://islamansiklopedisi.org.tr/kurtuba-ulucamii",
    "Kurtuba Ulucamii, 786'da I. Abdurrahman tarafından başlatıldı",
    "Kurtuba Ulucamii'nin yapımı 786 yılında I. Abdurrahman tarafından başlatılmıştır.",
    "cordoba-mosque-start",
    "hard"
  ],
  [
    "history",
    "Endülüs mimarisinin ünlü Elhamra Sarayı günümüzde hangi şehirde bulunur?",
    "Granada (Gırnata)",
    [
      "Kurtuba (Córdoba)",
      "Sevilla (İşbîliye)",
      "Toledo"
    ],
    "https://islamansiklopedisi.org.tr/elhamra-sarayi",
    "Elhamra Sarayı Gırnata'da bulunur",
    "Elhamra Sarayı, İspanya'nın Granada (Gırnata) kentinde yer alan ünlü Endülüs yapısıdır.",
    "alhambra-location",
    "medium"
  ],
  [
    "history",
    "Endülüs'te 1492'ye kadar hüküm süren son İslâm hânedanı hangisidir?",
    "Nasrîler",
    [
      "Abbâsîler",
      "Eyyûbîler",
      "Büveyhîler"
    ],
    "https://islamansiklopedisi.org.tr/nasriler",
    "TDV Nasrîler 1238-1492",
    "Nasrîler, Gırnata merkezli olup Endülüs'te 1492'ye kadar hüküm süren son İslâm hânedanıdır.",
    "nasrids-last",
    "medium"
  ],
  [
    "history",
    "İhyâü ulûmi'd-dîn adlı dinî-ahlâkî eser kime aittir?",
    "Gazzâlî",
    [
      "Mevlânâ",
      "Pîrî Reis",
      "İbn Battûta"
    ],
    "https://islamansiklopedisi.org.tr/ihyau-ulumid-din",
    "TDV İhyâü ulûmi'd-dîn: Gazzâlî eseri",
    "Gazzâlî'nin İhyâü ulûmi'd-dîn eseri ibadet, ahlâk ve tasavvuf konularını ele alır.",
    "ghazali-ihya",
    "medium"
  ],
  [
    "history",
    "Mevlânâ'nın Mesnevî adlı eseri kaç defterden oluşur?",
    "Altı",
    [
      "İki",
      "Dört",
      "Sekiz"
    ],
    "https://islamansiklopedisi.org.tr/mesnevi--mevlana",
    "TDV Mesnevî: altı defter",
    "Mevlânâ'nın Mesnevî'si altı defterden oluşan Farsça bir eserdir.",
    "masnavi-six",
    "medium"
  ],
  [
    "history",
    "el-Câmiu's-sahîh adlı hadis derlemesiyle tanınan muhaddis kimdir?",
    "Buhârî",
    [
      "İbnü'l-Heysem",
      "Nizâmülmülk",
      "Fârâbî"
    ],
    "https://islamansiklopedisi.org.tr/el-camius-sahih--buhari",
    "TDV el-Câmiu's-sahîh: Buhârî'nin eseri",
    "Buhârî'nin el-Câmiu's-sahîh adlı kitabı hadis derlemelerinin en tanınmışlarındandır.",
    "bukhari-sahih",
    "easy"
  ],
  [
    "history",
    "Büyük Selçuklu veziri Nizâmülmülk'ün devlet idaresi hakkında yazdığı eser hangisidir?",
    "Siyâsetnâme",
    [
      "Kitâb-ı Bahriyye",
      "Mesnevî",
      "el-Kānûn fi't-tıbb"
    ],
    "https://islamansiklopedisi.org.tr/siyasetname",
    "Nizâmülmülk'ün Siyâsetnâme eseri",
    "Nizâmülmülk devlet kurumlarının işleyişi ve yönetim ilkelerini Siyâsetnâme'de ele alır.",
    "nizam-siyasetname",
    "medium"
  ],
  [
    "history",
    "Edirne'deki II. Bayezid Külliyesi'nde sağlık hizmeti için kullanılan bölüm hangisidir?",
    "Dârüşşifâ",
    [
      "Rasathane",
      "Cephanelik",
      "Tersane"
    ],
    "https://islamansiklopedisi.org.tr/beyazit-ii-camii-ve-kulliyesi--edirne",
    "Edirne II. Bayezid Külliyesi dârüşşifâsı",
    "II. Bayezid Külliyesi'ndeki dârüşşifâ sağlık hizmeti verilen bir yapı olarak tasarlanmıştır.",
    "bayezid-hospital",
    "medium"
  ],
  [
    "history",
    "İbn Sînâ'nın eş-Şifâ adlı kapsamlı eserinin temel alanı hangisidir?",
    "Mantık ve felsefe",
    [
      "Deniz haritacılığı",
      "Saray mimarisi",
      "Tıp dışı ziraat aletleri"
    ],
    "https://islamansiklopedisi.org.tr/es-sifa--ibn-sina",
    "TDV eş-Şifâ: mantık ve nazarî felsefe",
    "İbn Sînâ'nın eş-Şifâ adlı eseri, adına rağmen bir tıp kitabı değil mantık ve nazarî felsefe çalışmasıdır.",
    "ibnsina-shifa-philosophy",
    "hard"
  ],
  [
    "general",
    "Teravih adının kökenindeki 'tervîha' kelimesi hangi uygulamayla ilişkilidir?",
    "Dinlenme arası",
    [
      "Yolculuk hazırlığı",
      "Hac ihramı",
      "Sadaka dağıtımı"
    ],
    "https://islamansiklopedisi.org.tr/teravih",
    "Teravih maddesi: dört rekâtta bir oturarak dinlenme",
    "Teravih adı, rekâtlar arasında verilen kısa dinlenme arası anlamındaki tervîha sözcüğüyle ilişkilidir.",
    "taraweeh-rest",
    "medium"
  ],
  [
    "general",
    "Ramazan sonunda ihtiyaç sahiplerine verilen ve 'sadaka-i fıtr' denilen yardım hangisidir?",
    "Fitre",
    [
      "Zekât dışı ganimet",
      "Mehir",
      "Kefaret-i yemin"
    ],
    "https://islamansiklopedisi.org.tr/fitre",
    "TDV Fitre: Ramazan sonunda fıtır sadakası",
    "Fitre, Ramazan ayının sonunda gücü yetenlerin vermekle yükümlü oldukları fıtır sadakasıdır.",
    "fitr-charity",
    "medium"
  ],
  [
    "general",
    "Ramazanda camilerin minareleri arasına kurulan ışıklı yazılara ne denir?",
    "Mahya",
    [
      "Mihrab",
      "Minber",
      "Şadırvan"
    ],
    "https://islamansiklopedisi.org.tr/mahya--ramazan",
    "TDV Mahya: minareler arası ışıklı yazı",
    "Mahya, özellikle Ramazan'da camilerin minareleri arasına asılan ışıklı yazı ve süslemelerdir.",
    "mahya-lights",
    "easy"
  ],
  [
    "general",
    "Allah rızası için ihtiyaç sahiplerine yapılan maddî yardım hangi terimle anılır?",
    "Sadaka",
    [
      "Riya",
      "Gıybet",
      "İsraf"
    ],
    "https://islamansiklopedisi.org.tr/sadaka",
    "TDV Sadaka: gönüllü veya dinî yardım",
    "Sadaka, Allah'ın hoşnutluğunu gözeterek ihtiyaç sahiplerine gönüllü veya dinen gerekli maddî yardım sunmaktır.",
    "sadaqa-help",
    "easy"
  ],
  [
    "general",
    "Belirli bir süre ibadet niyetiyle camide kalmaya ne ad verilir?",
    "İtikâf",
    [
      "İstiftâ",
      "İsnad",
      "Tavaf"
    ],
    "https://islamansiklopedisi.org.tr/itikaf",
    "TDV İtikâf: ibadet niyetiyle camide kalma",
    "İtikâf, belirli kurallar çerçevesinde ibadet amacıyla camide kalmayı ifade eder.",
    "itikaf-mosque",
    "medium"
  ],
  [
    "general",
    "Hadis ilminde isnad zincirinden sonra gelen rivayet bölümüne ne denir?",
    "Metin",
    [
      "Mihrap",
      "Vakfiye",
      "İhram"
    ],
    "https://islamansiklopedisi.org.tr/metin--hadis",
    "TDV Metin: senedin ardından gelen rivayet",
    "Hadis ilminde metin, aktarıcılar zinciri olan senedin ardından gelen rivayet içeriğidir.",
    "hadith-matn",
    "medium"
  ],
  [
    "general",
    "Hadis literatüründe 'Sahîhayn' adı hangi iki âlimin sahih hadis kitapları için kullanılır?",
    "Buhârî ve Müslim",
    [
      "Fârâbî ve Bîrûnî",
      "Mâlik ve Pîrî Reis",
      "İbn Sînâ ve Cezerî"
    ],
    "https://islamansiklopedisi.org.tr/sahihayn",
    "TDV Sahîhayn: Buhârî ve Müslim",
    "Sahîhayn, Buhârî ile Müslim'in el-Câmiu's-sahîh adlı iki meşhur hadis derlemesine verilen addır.",
    "sahihayn-collections",
    "hard"
  ],
  [
    "general",
    "Hucurât 49/10'da müminler arasındaki ilişki hangi kavramla anlatılır?",
    "Kardeşlik",
    [
      "Rekabet",
      "Ayrımcılık",
      "Haset"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=10&mode=tefsir&sure=49",
    "Hucurât 49/10: müminler kardeştir",
    "Hucurât 49/10'da müminler kardeş olarak nitelenir ve aralarını düzeltmeleri öğütlenir.",
    "believer-brotherhood",
    "easy"
  ],
  [
    "general",
    "Nûr 24/27'de başkasının evine girmeden önce ne yapılması istenir?",
    "İzin istemek ve selâm vermek",
    [
      "Kapıyı kırmak",
      "Habersizce içeri girmek",
      "Ev sahibini dinlememek"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=27&mode=tefsir&sure=24",
    "Nûr 24/27: izin ve selâm",
    "Nûr 24/27, başka evlere girerken izin istenmesini ve ev halkına selâm verilmesini öğütler.",
    "home-permission",
    "easy"
  ],
  [
    "general",
    "Mâide 5/2'ye göre hangi konuda yardımlaşmak öğütlenir?",
    "İyilik ve takvâ",
    [
      "Günah ve düşmanlık",
      "Aldatma ve hile",
      "Gıybet ve alay"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=2&mode=tefsir&sure=5",
    "Mâide 5/2: iyilik ve takvada yardımlaşma",
    "Mâide 5/2'de iyilik ve takvâda yardımlaşmak, günah ve saldırganlıkta yardımlaşmamak emredilir.",
    "cooperation-goodness",
    "medium"
  ],
  [
    "general",
    "Nisâ 4/135'te adaletli şahitlik konusunda hangi ilke vurgulanır?",
    "Kendi aleyhine olsa bile adaleti gözetmek",
    [
      "Zengine ayrıcalık tanımak",
      "Yakını kayırmak",
      "Gerçeği gizlemek"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=135&mode=tefsir&sure=4",
    "Nisâ 4/135: adalet kendi aleyhinize de olsa",
    "Nisâ 4/135'te kişinin kendisi veya yakınlarının aleyhine bile olsa adaletle şahitlik etmesi emredilir.",
    "justice-self",
    "medium"
  ],
  [
    "general",
    "Ankebût 29/45'te namazın insanı uzaklaştıracağı belirtilen davranışlar hangileridir?",
    "Hayâsızlık ve kötülükler",
    [
      "Çalışma ve öğrenme",
      "Doğruluk ve merhamet",
      "Paylaşma ve iyilik"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=45&mode=tefsir&sure=29",
    "Ankebût 29/45: namaz kötülükten alıkoyar",
    "Ankebût 29/45'te namazın hayâsızlıktan ve kötülüklerden alıkoyduğu bildirilir.",
    "prayer-prevents-wrong",
    "easy"
  ],
];
const counters: Record<CategoryId, number> = { quran: 0, prophets: 0, history: 0, general: 0 };
export const newCandidatesV13: readonly Question[] = rows.map((row): Question => {
  const [categoryId, question, correct, wrong, url, locator, explanation, conceptGroup, difficulty] = row;
  const id = `v13-${categoryId}-${String(++counters[categoryId]).padStart(3, "0")}`;
  const isDiyanet = url.startsWith("https://kuran.diyanet.gov.tr/");
  return {
    id, version: 1, categoryId, difficulty, question,
    options: [{ id: "o1", text: wrong[0] }, { id: "o2", text: correct }, { id: "o3", text: wrong[1] }, { id: "o4", text: wrong[2] }],
    correctOptionId: "o2", explanation,
    sources: [{ title: isDiyanet ? "Diyanet Kur'an Yolu" : "TDV İslâm Ansiklopedisi",
      publisher: isDiyanet ? "Diyanet İşleri Başkanlığı" : "TDV İslâm Araştırmaları Merkezi",
      url, locator, supports: explanation, checkStatus: "supported", checkedAt: "2026-10-19" }],
    reviewStatus: "approved",
    reviewNotes: "Ürün sahibinin kaynakla doğrulama koşullu kullanım kararına dayanır. Bağımsız editör ve dinî uzman incelemesi henüz tamamlanmamıştır.",
    updatedAt: "2026-10-19", conceptGroup,
  };
});
