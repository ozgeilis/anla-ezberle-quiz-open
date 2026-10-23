import type { CategoryId, Difficulty, Question } from "./model";

// New explanatory questions, with Diyanet Quran or TDV reference locators.
// Source-linked owner approval is not an independent specialist review.
type Row = readonly [CategoryId, string, string, readonly [string, string, string], string, string, string, string, Difficulty];
const rows: readonly Row[] = [
  [
    "quran",
    "Fâtiha sûresi kaç âyetten oluşur?",
    "Yedi",
    [
      "Beş",
      "Dokuz",
      "On bir"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/1",
    "Fâtiha sûresi tanıtımı",
    "Fâtiha sûresi yedi âyetten oluşur ve Kur'an'ın ilk sûresidir.",
    "fatiha-structure",
    "easy"
  ],
  [
    "quran",
    "Fîl sûresinde hangi tarihî olay hatırlatılır?",
    "Fil ordusunun Kâbe'ye saldırı girişimi",
    [
      "Hicret yolculuğu",
      "Hendek Savaşı",
      "Bedir Savaşı"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/105",
    "Fîl 105/1-5",
    "Fîl sûresi, Kâbe'ye yönelen fil ordusunun uğradığı akıbeti hatırlatır.",
    "surah-fil-story",
    "easy"
  ],
  [
    "quran",
    "Tebbet veya Mesed sûresinde adı anılan kişi kimdir?",
    "Ebû Leheb",
    [
      "Ebû Eyyûb",
      "Ebû Hüreyre",
      "Ebû Tâlib"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/111",
    "Mesed 111/1",
    "Mesed sûresinin ilk âyetinde Ebû Leheb anılır; sûre onun tutumunu eleştirir.",
    "surah-masad-person",
    "easy"
  ],
  [
    "quran",
    "Zilzâl sûresinin ilk âyetinde neyin sarsılmasından söz edilir?",
    "Yerin",
    [
      "Denizin",
      "Ayın",
      "Rüzgârın"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/99",
    "Zilzâl 99/1",
    "Zilzâl sûresi, kıyametle ilgili olarak yerin şiddetle sarsılmasından söz ederek başlar.",
    "surah-zilzal-earth",
    "easy"
  ],
  [
    "quran",
    "Kadr sûresi 97/1'e göre Kur'an hangi gecede indirilmeye başlanmıştır?",
    "Kadir gecesinde",
    [
      "Berat gecesinde",
      "Miraç gecesinde",
      "Hicret gecesinde"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/97",
    "Kadr 97/1",
    "Kadr sûresinin ilk âyetinde Kur'an'ın Kadir gecesinde indirildiği bildirilir.",
    "qadr-revelation",
    "easy"
  ],
  [
    "quran",
    "İhlâs sûresinde özellikle hangi inanç vurgulanır?",
    "Allah'ın birliği",
    [
      "Kabile üstünlüğü",
      "Mal biriktirme",
      "Savaş hazırlığı"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/112",
    "İhlâs 112/1-4",
    "İhlâs sûresi Allah'ın birliğini ve eşsizliğini özlü biçimde anlatır.",
    "ikhlas-oneness",
    "easy"
  ],
  [
    "quran",
    "Nâs sûresinde insan hangi kötülükten korunmak için Allah'a sığınır?",
    "Sinsi vesvesecinin kötülüğünden",
    [
      "Sıcak havadan",
      "Uzun yolculuktan",
      "Ticarî rekabetten"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/114",
    "Nâs 114/4-6",
    "Nâs sûresi, insanın gönlüne vesvese veren sinsi kötülükten Allah'a sığınmayı öğretir.",
    "nas-whisper",
    "medium"
  ],
  [
    "quran",
    "Felak sûresinin başlangıcında hangi varlığın Rabbine sığınılır?",
    "Sabah aydınlığının",
    [
      "Denizlerin",
      "Dağların",
      "Rüzgârların"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/113",
    "Felak 113/1",
    "Felak kelimesi sabah aydınlığıyla ilişkilendirilir; sûrede onun Rabbine sığınma ifadesi geçer.",
    "falaq-daybreak",
    "easy"
  ],
  [
    "quran",
    "Saf sûresinin adındaki 'saf' sözcüğü hangi kavrama işaret eder?",
    "Sıra hâlinde dizilmeye",
    [
      "Hac yolculuğuna",
      "Bir kuş türüne",
      "Bir şehir kapısına"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/61",
    "Saff 61/4 ve sûre tanıtımı",
    "Saf sûresi adını Allah yolunda kenetlenmiş bir yapı gibi saf tutanlardan söz eden âyetten alır.",
    "saff-name",
    "medium"
  ],
  [
    "quran",
    "Cum'a sûresi adını haftanın hangi gününden alır?",
    "Cuma",
    [
      "Pazar",
      "Salı",
      "Perşembe"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/62",
    "Cum'a 62/9 ve sûre tanıtımı",
    "Cum'a sûresinde cuma namazı için çağrı yapıldığında alışverişin bırakılması öğütlenir.",
    "jumuah-name",
    "easy"
  ],
  [
    "quran",
    "Münâfikūn sûresinin ana konularından biri nedir?",
    "İkiyüzlü davranışların eleştirisi",
    [
      "Gemicilik kuralları",
      "Ticaret yolları",
      "Ziraat teknikleri"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/63",
    "Münâfikūn sûresi tanıtımı",
    "Münâfikūn sûresi münafıklık ve onun toplumsal sonuçları konusunda uyarılar içerir.",
    "munafiqun-message",
    "medium"
  ],
  [
    "quran",
    "Tîn sûresi 95/4'te insanın yaratılışı hangi ifadeyle nitelenir?",
    "En güzel biçimde",
    [
      "En zayıf şekilde",
      "En sessiz varlık olarak",
      "Denizin içinde"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/95",
    "Tîn 95/4",
    "Tîn sûresi 4. âyette insanın en güzel biçimde yaratıldığını bildirir.",
    "tin-human-creation",
    "medium"
  ],
  [
    "quran",
    "Nebe' sûresinin adındaki 'nebe' sözcüğü ne anlama gelir?",
    "Haber",
    [
      "Işık",
      "Deniz",
      "Kapı"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/78",
    "Nebe' 78/1-2",
    "Nebe' kelimesi haber anlamına gelir; sûrede 'büyük haber' ifadesi yer alır.",
    "naba-name",
    "easy"
  ],
  [
    "prophets",
    "Yûsuf 12/18'e göre kardeşleri babalarına Hz. Yûsuf'un gömleğini nasıl getirir?",
    "Üzerinde sahte kanla",
    [
      "Kuru ve temiz olarak",
      "İkiye kesilmiş hâlde",
      "Altınla süslenmiş olarak"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Yûsuf 12/18: gömleğin yalan kanla getirilmesi",
    "Yûsuf sûresine göre kardeşler Hz. Yûsuf'un gömleğini üzerinde uydurma bir kan iziyle babalarına getirir.",
    "yusuf-shirt-blood",
    "medium"
  ],
  [
    "prophets",
    "Yûsuf 12/21'e göre Hz. Yûsuf satın alındıktan sonra hangi ülkeye götürülür?",
    "Mısır'a",
    [
      "Yemen'e",
      "Habeşistan'a",
      "Şam'a"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Yûsuf 12/21",
    "Yûsuf sûresinde onu Mısır'da satın alan kişinin eşine kendisine iyi bakmasını söylediği anlatılır.",
    "yusuf-egypt",
    "medium"
  ],
  [
    "prophets",
    "Hz. Yûsuf hükümdarın rüyasını yorumlamadan önce hangi yerde bulunuyordu?",
    "Hapishanede",
    [
      "Bir gemide",
      "Bir medresede",
      "Bir çadırda"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Yûsuf 12/36-49",
    "Hz. Yûsuf, zindanda bulunduğu sırada rüya yorumlarıyla tanınmış ve hükümdarın rüyası hakkında da görüş bildirmiştir.",
    "yusuf-prison",
    "medium"
  ],
  [
    "prophets",
    "Yûsuf 12/47'de ürünlerin büyük kısmının nasıl saklanması öğütlenir?",
    "Başaklarında bırakılarak",
    [
      "Tuzlu suya yatırılarak",
      "Taze tüketilerek",
      "Nehirde bekletilerek"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Yûsuf 12/47: başağında saklama önerisi",
    "Hz. Yûsuf bolluk yıllarında biçilen ürünlerin yalnızca az bir kısmının yenmesini, kalanının başağında korunmasını öğütler.",
    "yusuf-storing-harvest",
    "medium"
  ],
  [
    "prophets",
    "Tâhâ 20/20'de Hz. Mûsâ'nın yere attığı asa neye dönüşür?",
    "Bir yılana",
    [
      "Bir kuşa",
      "Bir balığa",
      "Bir ağaca"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/20",
    "Tâhâ 20/17-20",
    "Tâhâ sûresinde Hz. Mûsâ'nın asası yere atıldığında hareket eden bir yılana dönüşür.",
    "musa-staff",
    "easy"
  ],
  [
    "prophets",
    "Şuarâ 26/63'e göre Hz. Mûsâ'nın asasıyla vurması üzerine ne yarılır?",
    "Deniz",
    [
      "Dağ",
      "Ağaç",
      "Kale"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/26",
    "Şuarâ 26/63",
    "Şuarâ sûresinde Hz. Mûsâ'ya asasıyla denize vurması emredilir ve deniz ikiye ayrılır.",
    "musa-sea",
    "easy"
  ],
  [
    "prophets",
    "Kasas 28/7'de Hz. Mûsâ'nın annesine bebeği tehlike karşısında nereye bırakması bildirilir?",
    "Nehre",
    [
      "Bir kuyuya",
      "Bir mağaraya",
      "Bir dağa"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/28",
    "Kasas 28/7",
    "Kasas sûresinde Hz. Mûsâ'nın annesine onu emzirmesi, korktuğunda ise suya bırakması bildirilir.",
    "musa-baby-river",
    "medium"
  ],
  [
    "prophets",
    "Bakara 2/127'de Hz. İbrâhim ve Hz. İsmâil Kâbe'nin temellerini yükseltirken ne için dua eder?",
    "Yaptıklarının Allah tarafından kabulü için",
    [
      "Yağmur yağmaması için",
      "Yolculuğun bitmesi için",
      "Altın bulunması için"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/2",
    "Bakara 2/127: Rabbimiz, bizden kabul buyur",
    "Bakara 2/127'de Hz. İbrâhim ve Hz. İsmâil Kâbe'nin temellerini yükseltirken yaptıkları işi Allah'ın kabul etmesini dilerler.",
    "ibrahim-ismail-dua",
    "medium"
  ],
  [
    "prophets",
    "Bakara 2/258'de Hz. İbrâhim güneşin hangi yönden doğduğunu hatırlatır?",
    "Doğudan",
    [
      "Batıdan",
      "Kuzeyden",
      "Güneyden"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/2",
    "Bakara 2/258: güneşin doğuş yönü",
    "Hz. İbrâhim karşısındaki kişiye Allah'ın güneşi doğudan getirdiğini söyleyerek onu batıdan getirmesini ister.",
    "ibrahim-sun-direction",
    "medium"
  ],
  [
    "prophets",
    "Sâffât 37/142'ye göre Hz. Yûnus'u hangi canlı yutar?",
    "Büyük bir balık",
    [
      "Bir aslan",
      "Bir deve",
      "Bir yılan"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/37",
    "Sâffât 37/139-145",
    "Sâffât sûresinde Hz. Yûnus'un bir balık tarafından yutulduğu anlatılır.",
    "yunus-fish",
    "easy"
  ],
  [
    "prophets",
    "Meryem sûresinde Hz. Zekeriyyâ'ya müjdelenen oğlunun adı nedir?",
    "Yahyâ",
    [
      "İlyâs",
      "İdrîs",
      "Hârûn"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/19",
    "Meryem 19/7",
    "Meryem sûresinin 7. âyetinde Hz. Zekeriyyâ'ya Yahyâ adında bir oğul müjdelenir.",
    "zakariya-yahya",
    "easy"
  ],
  [
    "prophets",
    "Meryem 19/30'da beşikte konuşarak Allah'ın kulu olduğunu söyleyen kişi kimdir?",
    "Hz. Îsâ",
    [
      "Hz. Yûsuf",
      "Hz. Mûsâ",
      "Hz. Süleyman"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/19",
    "Meryem 19/29-33",
    "Meryem sûresinde beşikteki Hz. Îsâ'nın konuşarak Allah'ın kulu olduğunu söylediği anlatılır.",
    "isa-cradle",
    "medium"
  ],
  [
    "prophets",
    "Hûd 11/64'te Hz. Sâlih'in kavmine Allah'ın işareti olarak gösterdiği hayvan hangisidir?",
    "Dişi deve",
    [
      "At",
      "Koç",
      "Geyik"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/11",
    "Hûd 11/64",
    "Hz. Sâlih kavmine Allah'ın devesini bir işaret olarak gösterir ve ona zarar vermemelerini ister.",
    "salih-shecamel",
    "medium"
  ],
  [
    "history",
    "İslâm felsefesinde 'Muallim-i Sânî' unvanıyla tanınan düşünür kimdir?",
    "Fârâbî",
    [
      "İbn Battûta",
      "Pîrî Reis",
      "İbn Haldûn"
    ],
    "https://islamansiklopedisi.org.tr/farabi",
    "Felsefe ve mûsiki bölümünde Muallim-i Sânî",
    "Fârâbî, Aristoteles'ten sonra 'İkinci Öğretmen' anlamına gelen Muallim-i Sânî diye anılmıştır.",
    "farabi-title",
    "medium"
  ],
  [
    "history",
    "Fârâbî'nin erdemli toplum anlayışıyla ilişkilendirilen ünlü eseri hangisidir?",
    "el-Medînetü'l-fâzıla",
    [
      "Kitâb-ı Bahriyye",
      "Mukaddime",
      "Keşfü'z-zunûn"
    ],
    "https://islamansiklopedisi.org.tr/farabi",
    "Fârâbî'nin siyaset felsefesi ve eserleri",
    "Fârâbî'nin el-Medînetü'l-fâzıla adlı eseri erdemli şehir ve toplum düşüncesiyle ilişkilidir.",
    "farabi-ideal-city",
    "hard"
  ],
  [
    "history",
    "İbn Haldûn'un dünya tarihine giriş olarak yazdığı ünlü eserin adı nedir?",
    "Mukaddime",
    [
      "el-Kānûn fi't-tıbb",
      "Cihannümâ",
      "Kitâb-ı Bahriyye"
    ],
    "https://islamansiklopedisi.org.tr/mukaddime--ibn-haldun",
    "Eserin tanımı ve yazılış amacı",
    "İbn Haldûn Mukaddime'yi tarih eserinin girişi olarak yazmış; eser daha sonra bağımsız olarak da ün kazanmıştır.",
    "ibn-khaldun-muqaddima",
    "medium"
  ],
  [
    "history",
    "İbn Haldûn'un toplum hayatını incelemek üzere geliştirdiği ilim anlayışı hangi adla bilinir?",
    "Umran ilmi",
    [
      "Kıraat ilmi",
      "Hat sanatı",
      "Arûz ilmi"
    ],
    "https://islamansiklopedisi.org.tr/ibn-haldun",
    "Görüşleri: umran ilmi",
    "İbn Haldûn toplumların yapılarını ve değişimlerini açıklamaya yönelik yaklaşımını umran ilmiyle temellendirir.",
    "ibn-khaldun-umran",
    "hard"
  ],
  [
    "history",
    "Pîrî Reis'in denizcilik ve kıyı bilgileri içeren eserinin adı nedir?",
    "Kitâb-ı Bahriyye",
    [
      "el-Medînetü'l-fâzıla",
      "Seyahatnâme",
      "Mukaddime"
    ],
    "https://islamansiklopedisi.org.tr/kitab-i-bahriyye",
    "Eser tanımı, Akdeniz ve Ege kıyıları",
    "Kitâb-ı Bahriyye, Pîrî Reis'in Ege ve Akdeniz kıyılarıyla denizciliği ele aldığı eseridir.",
    "piri-bahriyye",
    "medium"
  ],
  [
    "history",
    "Pîrî Reis'in ilk dünya haritası hangi yılda hazırlanmıştır?",
    "1513",
    [
      "1453",
      "1571",
      "1600"
    ],
    "https://islamansiklopedisi.org.tr/piri-reis",
    "Pîrî Reis'in 1513 tarihli haritası",
    "Pîrî Reis'in 1513 tarihli dünya haritasının günümüze ulaşan bölümü ünlü haritacılık eserlerindendir.",
    "piri-1513-map",
    "medium"
  ],
  [
    "history",
    "Ali Kuşçu, İstanbul'a geldikten sonra hangi Osmanlı padişahı tarafından himaye edildi?",
    "Fâtih Sultan Mehmed",
    [
      "Yavuz Sultan Selim",
      "I. Ahmed",
      "III. Selim"
    ],
    "https://islamansiklopedisi.org.tr/ali-kuscu",
    "İstanbul dönemi, Fâtih himayesi",
    "Astronomi ve matematik âlimi Ali Kuşçu, İstanbul'a geldikten sonra Fâtih Sultan Mehmed'in himayesini görmüştür.",
    "ali-kuscu-fatih",
    "medium"
  ],
  [
    "history",
    "İbn Sînâ'nın tıp alanındaki meşhur eserinin adı hangisidir?",
    "el-Kānûn fi't-tıbb",
    [
      "Keşfü'z-zunûn",
      "Kitâb-ı Bahriyye",
      "Mukaddime"
    ],
    "https://islamansiklopedisi.org.tr/ibn-sina",
    "Tıp eserleri: el-Kānûn fi't-tıbb",
    "İbn Sînâ'nın el-Kānûn fi't-tıbb adlı eseri yüzyıllar boyunca tıp eğitiminde etkili olmuştur.",
    "ibn-sina-canon",
    "medium"
  ],
  [
    "history",
    "Ünlü seyyah İbn Battûta hangi şehirde doğmuştur?",
    "Tanca",
    [
      "Semerkant",
      "Bağdat",
      "Kûfe"
    ],
    "https://islamansiklopedisi.org.tr/ibn-battuta",
    "Hayatı: 1304 yılında Tanca'da doğması",
    "İbn Battûta, günümüzde Fas'ta bulunan Tanca şehrinde dünyaya gelmiştir.",
    "ibn-battuta-tangier",
    "medium"
  ],
  [
    "history",
    "Keşfü'z-zunûn adlı kapsamlı bibliyografya eserini kim yazmıştır?",
    "Kâtib Çelebi",
    [
      "İbn Haldûn",
      "Fârâbî",
      "Pîrî Reis"
    ],
    "https://islamansiklopedisi.org.tr/kesfuz-zunun",
    "Giriş: müellif ve bibliyografya niteliği",
    "Keşfü'z-zunûn, Osmanlı âlimi Kâtib Çelebi'nin kitaplar ve ilim dallarını tanıtan bibliyografik eseridir.",
    "katip-kelebi-biblio",
    "medium"
  ],
  [
    "history",
    "Mimar Sinan'ın 'kalfalık eserim' diye andığı cami hangisidir?",
    "Süleymaniye Camii",
    [
      "Şehzade Camii",
      "Selimiye Camii",
      "Sultan Ahmed Camii"
    ],
    "https://islamansiklopedisi.org.tr/sinan",
    "Süleymaniye'nin kalfalık eseri olarak nitelenmesi",
    "Mimar Sinan, İstanbul'daki Süleymaniye Camii'ni kendi meslek hayatının kalfalık eseri saymıştır.",
    "sinan-suleymaniye",
    "medium"
  ],
  [
    "history",
    "Mimar Sinan'ın Edirne'de inşa ettiği ünlü cami hangisidir?",
    "Selimiye Camii",
    [
      "Süleymaniye Camii",
      "Mihrimah Sultan Camii",
      "Fatih Camii"
    ],
    "https://islamansiklopedisi.org.tr/sinan",
    "Edirne Selimiye Camii, II. Selim dönemi",
    "Sinan'ın Edirne'de II. Selim adına inşa ettiği Selimiye Camii Osmanlı mimarisinin seçkin eserlerindendir.",
    "sinan-selimiye",
    "easy"
  ],
  [
    "general",
    "Müslümanların namazda yöneldikleri kıble neresidir?",
    "Kâbe",
    [
      "Kudüs'teki Kubbetü's-sahre",
      "Medine'deki Mescid-i Nebevî",
      "Arafat Dağı"
    ],
    "https://islamansiklopedisi.org.tr/kible",
    "Kıblenin terim anlamı",
    "Kıble, namazda yönelinen istikamet olup Müslümanlar için Mekke'deki Kâbe'dir.",
    "qibla-kaaba",
    "easy"
  ],
  [
    "general",
    "Kur'an harflerinin doğru telaffuzunu ve okunuş kurallarını inceleyen ilim hangisidir?",
    "Tecvid",
    [
      "Fıkıh",
      "Siyer",
      "Coğrafya"
    ],
    "https://islamansiklopedisi.org.tr/tecvid--kuran",
    "Tecvid ilminin tanımı: mahreç, sıfat ve tilâvet kuralları",
    "Tecvid ilmi Kur'an harflerinin doğru telaffuzunu, durakları ve diğer okuyuş kurallarını ele alır.",
    "tajwid-rules",
    "medium"
  ],
  [
    "general",
    "Cuma ve bayram namazlarıyla ilişkili dinî konuşmanın adı nedir?",
    "Hutbe",
    [
      "Mukabele",
      "Tilâvet secdesi",
      "İtikâf"
    ],
    "https://islamansiklopedisi.org.tr/hutbe",
    "Madde tanımı, cuma ve bayram konuşmaları",
    "Hutbe, özellikle cuma ve bayram namazları sırasında topluluğa yöneltilen dinî konuşmadır.",
    "hutbe-definition",
    "easy"
  ],
  [
    "general",
    "Camide hutbe okuyan kişinin çıktığı basamaklı bölüme ne denir?",
    "Minber",
    [
      "Mihrap",
      "Şadırvan",
      "Mahfil"
    ],
    "https://islamansiklopedisi.org.tr/minber",
    "Minberin mimari tanımı",
    "Minber, camilerde hatibin hutbe okurken üzerine çıktığı basamaklı mimari bölümdür.",
    "minber-architecture",
    "easy"
  ],
  [
    "general",
    "Tecvidde bir harfin ağız veya boğazdaki çıkış yerine ne denir?",
    "Mahreç",
    [
      "Kıble",
      "Minber",
      "Mushaf"
    ],
    "https://islamansiklopedisi.org.tr/tecvid--kuran",
    "Tecvidin harflerin mahreç ve sıfatlarını ele alması",
    "Tecvid ilminde mahreç, harfin ses olarak çıktığı yeri ifade eder; doğru telaffuzda önemlidir.",
    "tajwid-rules",
    "medium"
  ],
  [
    "general",
    "Ezan okumakla görevli kişiye ne denir?",
    "Müezzin",
    [
      "Müfessir",
      "Müderris",
      "Müstensih"
    ],
    "https://islamansiklopedisi.org.tr/muezzin",
    "Müezzinin ezan ve kamet görevi",
    "Müezzin, ezan okuyan ve namaz için çağrıda bulunan kişiye verilen addır.",
    "muezzin-role",
    "easy"
  ],
  [
    "general",
    "Mukabele geleneğine dayanak olan rivayetlerde Hz. Peygamber'le Kur'an'ı karşılıklı okuyan melek kimdir?",
    "Cebrâil",
    [
      "Mîkâil",
      "İsrâfil",
      "Azrâil"
    ],
    "https://islamansiklopedisi.org.tr/mukabele--kuran",
    "Mukabele gelenek tarihi: Cebrâil ile karşılıklı okuma",
    "Mukabele geleneği, Cebrâil'in ramazanlarda Hz. Peygamber'le o zamana kadar inmiş vahyi karşılıklı okumasına dayandırılır.",
    "muqabala-origins",
    "medium"
  ],
  [
    "general",
    "Türkçede Kur'an âyetlerinin anlamlarını aktarmaya yönelik çeviriye ne denir?",
    "Meâl",
    [
      "İsnad",
      "Kıyas",
      "Vakfiye"
    ],
    "https://islamansiklopedisi.org.tr/meal",
    "Meâl: Türkçede Kur'an çevirileri terimi",
    "Meâl, Türkiye'de Kur'an âyetlerinin anlamını aktarmayı amaçlayan çeviriler için kullanılan addır.",
    "meal-term",
    "easy"
  ],
  [
    "general",
    "Kur'an âyetlerini açıklama ve yorumlama faaliyetine ne ad verilir?",
    "Tefsir",
    [
      "İstiftâ",
      "Mukabele",
      "Nisab"
    ],
    "https://islamansiklopedisi.org.tr/tefsir",
    "Tefsir ilminin konusu ve tanımı",
    "Tefsir, Kur'an âyetlerinin anlamlarını, bağlamlarını ve yorumlarını inceleyen ilim alanıdır.",
    "tafsir-definition",
    "easy"
  ],
  [
    "general",
    "Cami avlularında abdest almak amacıyla yapılan su tesisine ne denir?",
    "Şadırvan",
    [
      "Minber",
      "Mihrap",
      "Mahfil"
    ],
    "https://islamansiklopedisi.org.tr/sadirvan",
    "Şadırvan tanımı: cami avlusundaki abdest tesisi",
    "Şadırvan, cami avlularında su muslukları ve havuzuyla abdest alınabilen mimari su tesisidir.",
    "sadirvan-ablution",
    "easy"
  ],
  [
    "general",
    "Özellikle ramazanda bir kişinin Kur'an okuyup diğerlerinin takip ettiği gelenek hangisidir?",
    "Mukabele",
    [
      "İstiftâ",
      "Tavaf",
      "Akîka"
    ],
    "https://islamansiklopedisi.org.tr/mukabele--kuran",
    "Kur'an'ı okuyanın takip edilmesi geleneği",
    "Mukabele, okunan Kur'an'ı dinleyip takip etmeye dayalı; ramazanda yaygın olan kıraat geleneğidir.",
    "muqabala-tradition",
    "medium"
  ],
  [
    "general",
    "Bir eseri baştan sona okuma veya Kur'an'ın tamamını bitirme anlamında kullanılan kavram hangisidir?",
    "Hatim",
    [
      "Mahya",
      "Tevbe",
      "Mihrap"
    ],
    "https://islamansiklopedisi.org.tr/mukabele--kuran",
    "Mukabele yoluyla hatim indirme açıklaması",
    "Kur'an'ın başından sonuna okunup tamamlanmasına hatim denir; mukabele geleneğinde de hatim yapılır.",
    "hatim-complete",
    "medium"
  ],
];
const counters: Record<CategoryId, number> = { quran: 0, prophets: 0, history: 0, general: 0 };
export const newCandidatesV11: readonly Question[] = rows.map((row): Question => {
  const [categoryId, question, correct, wrong, url, locator, explanation, conceptGroup, difficulty] = row;
  const id = `v11-${categoryId}-${String(++counters[categoryId]).padStart(3, "0")}`;
  const isDiyanet = url.startsWith("https://kuran.diyanet.gov.tr/");
  return {
    id, version: 1, categoryId, difficulty, question,
    options: [{ id: "o1", text: wrong[0] }, { id: "o2", text: correct }, { id: "o3", text: wrong[1] }, { id: "o4", text: wrong[2] }],
    correctOptionId: "o2", explanation,
    sources: [{ title: isDiyanet ? "Diyanet Kur'an Yolu" : "TDV İslâm Ansiklopedisi",
      publisher: isDiyanet ? "Diyanet İşleri Başkanlığı" : "TDV İslâm Araştırmaları Merkezi",
      url, locator, supports: explanation, checkStatus: "supported", checkedAt: "2026-10-19" }],
    reviewStatus: "approved",
    reviewNotes: "Ürün sahibinin kaynak doğruluğu koşullu kabulüne dayanır. Bağımsız editör ve dinî uzman incelemesi henüz tamamlanmamıştır.",
    updatedAt: "2026-10-19", conceptGroup,
  };
});
