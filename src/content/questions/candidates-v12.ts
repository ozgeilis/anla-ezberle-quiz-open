import type { CategoryId, Difficulty, Question } from "./model";

// Explanatory source-linked v12 learning questions; specialist review is not implied.
type Row = readonly [CategoryId, string, string, readonly [string, string, string], string, string, string, string, Difficulty];
const rows: readonly Row[] = [
  [
    "quran",
    "Bakara 2/183'te orucun farz kılınması hangi amaçla ilişkilendirilir?",
    "Takvâ bilincine ulaşmak",
    [
      "Ticaret yollarını genişletmek",
      "Sadece beden gücünü artırmak",
      "Yalnızca seyahat etmek"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=183&mode=tefsir&sure=2",
    "Bakara 2/183",
    "Bakara 2/183'te orucun farz oluşu, Allah'a karşı sorumluluk bilinci geliştirmeyle ilişkilendirilir.",
    "fasting-purpose",
    "easy"
  ],
  [
    "quran",
    "Bakara 2/185'te Kur'an'ın indirildiği ay olarak hangisi anılır?",
    "Ramazan",
    [
      "Muharrem",
      "Şâban",
      "Safer"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=185&mode=tefsir&sure=2",
    "Bakara 2/185",
    "Bakara 2/185 Ramazan ayını Kur'an'ın indirildiği ay olarak tanımlar.",
    "ramadan-revelation",
    "easy"
  ],
  [
    "quran",
    "Bakara 2/261'de Allah yolunda harcamanın bereketi hangi ürünle örneklendirilir?",
    "Yedi başak veren bir tane",
    [
      "Dört yapraklı bir ağaç",
      "Bir küp su",
      "Üç taşlı bir dağ"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=261&mode=tefsir&sure=2",
    "Bakara 2/261",
    "Bakara 2/261'de tek taneden yedi başak çıkması örneği, Allah yolunda harcamanın karşılığını anlatır.",
    "infak-seven-ears",
    "medium"
  ],
  [
    "quran",
    "Bakara 2/256'da din konusunda hangi temel ilke belirtilir?",
    "Dinde zorlama olmadığı",
    [
      "Herkesin aynı mesleği seçmesi",
      "Yalnız seyahatin zorunlu olması",
      "Ticaretin yasak olması"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=256&mode=tefsir&sure=2",
    "Bakara 2/256",
    "Bakara sûresinde din konusunda zorlama bulunmadığı açıkça ifade edilir.",
    "religious-coercion",
    "medium"
  ],
  [
    "quran",
    "Bakara 2/282'de vadeli borç ilişkilerinde ne yapılması öğütlenir?",
    "Borcun yazıyla kayıt altına alınması",
    [
      "Her kaydın yakılması",
      "Şahitlerin dışlanması",
      "Vadenin tamamen gizlenmesi"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=282&mode=tefsir&sure=2",
    "Bakara 2/282",
    "Kur'an'ın borçlanmayla ilgili bu âyetinde vadeli borçların yazıyla belgelenmesi vurgulanır.",
    "debts-writing",
    "medium"
  ],
  [
    "quran",
    "Hucurât 49/12'de insanların arkalarından çekiştirilmesi hangi davranış kapsamında kınanır?",
    "Gıybet",
    [
      "Şükür",
      "İstişare",
      "Sadaka"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=12&mode=tefsir&sure=49",
    "Hucurât 49/12",
    "Hucurât 49/12, başkalarının arkasından konuşup çekiştirmeyi yasaklanan tutumlar arasında sayar.",
    "backbiting",
    "easy"
  ],
  [
    "quran",
    "Hucurât 49/13'te insanların farklı halk ve kabilelerden yaratılmasının gerekçesi nedir?",
    "Birbirlerini tanımaları",
    [
      "Birbirleriyle övünmeleri",
      "Birbirinden saklanmaları",
      "Herkesin yalnız yaşaması"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=13&mode=tefsir&sure=49",
    "Hucurât 49/13",
    "Hucurât 49/13'te halklara ve kabilelere ayrılmanın amacı birbirini tanımak olarak açıklanır.",
    "nations-recognize",
    "medium"
  ],
  [
    "quran",
    "Nahl 16/68'de bal arısına hangi yerlerden yuva edinmesi ilham edilir?",
    "Dağlar, ağaçlar ve insanların yaptığı kovanlar",
    [
      "Yalnız deniz tabanı",
      "Yalnız çöl kumları",
      "Sadece gökyüzü"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=68&mode=tefsir&sure=16",
    "Nahl 16/68",
    "Nahl 16/68, arıların dağlarda, ağaçlarda ve insanların hazırladığı yerlerde yuva edinmesini anlatır.",
    "bee-homes",
    "medium"
  ],
  [
    "quran",
    "Lokmân 31/18'de hangi kibirli davranıştan sakınılması istenir?",
    "İnsanlara yüz çevirerek böbürlenmek",
    [
      "Anne babaya iyilik etmek",
      "Sesi alçaltmak",
      "İnsanlara selâm vermek"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=18&mode=tefsir&sure=31",
    "Lokmân 31/18",
    "Lokmân'ın öğütleri arasında insanları küçümseyerek yüz çevirmemek ve kibirli yürümemek bulunur.",
    "luqman-arrogance",
    "medium"
  ],
  [
    "quran",
    "Lokmân 31/19'da konuşma adabıyla ilgili hangi öğüt yer alır?",
    "Sesi ölçülü ve alçak tutmak",
    [
      "Daima bağırmak",
      "Sadece fısıldamak",
      "Konuşmayı tamamen bırakmak"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=19&mode=tefsir&sure=31",
    "Lokmân 31/19",
    "Lokmân 31/19, yürüyüşte ölçülülüğün yanında sesin alçaltılmasını da öğütler.",
    "luqman-voice",
    "medium"
  ],
  [
    "quran",
    "Mülk 67/2'de hayat ve ölümün yaratılması hangi amaçla açıklanır?",
    "Kimin daha güzel davranacağını sınamak",
    [
      "Yıldızların adlarını öğretmek",
      "Bir şehir kurmak",
      "Ticaret kazancı sağlamak"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=2&mode=tefsir&sure=67",
    "Mülk 67/2",
    "Mülk 67/2'de hayat ve ölüm, insanların davranışları bakımından sınanmasıyla ilişkilendirilir.",
    "life-test",
    "medium"
  ],
  [
    "quran",
    "Kāria 101/6-9'da kurtuluşla ilişkilendirilen tartı özelliği hangisidir?",
    "İyilik tartısının ağır gelmesi",
    [
      "Tartının kırılması",
      "Tartının saklanması",
      "Tartının hiç kurulmaması"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=6&mode=tefsir&sure=101",
    "Kāria 101/6-9",
    "Kāria sûresinde tartıları ağır gelenlerin hoşnutluk veren bir hayata erişecekleri belirtilir.",
    "qaria-heavy-scales",
    "medium"
  ],
  [
    "quran",
    "Zümer 39/53'te hata işleyenlere hangi konuda ümitsizliğe düşmemeleri öğütlenir?",
    "Allah'ın rahmeti",
    [
      "Dünya malı",
      "Yolculuk süresi",
      "Kervan ticareti"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=53&mode=tefsir&sure=39",
    "Zümer 39/53",
    "Zümer 39/53, günah işleyen kullara Allah'ın rahmetinden ümit kesmemeleri çağrısını içerir.",
    "mercy-no-despair",
    "easy"
  ],
  [
    "prophets",
    "Enbiyâ 21/87'de Hz. Yûnus sıkıntı içindeyken hangi tutumunu dile getirir?",
    "Yanlış yaptığını kabul etmesini",
    [
      "Daha büyük bir şehir kurduğunu",
      "Bir ordu hazırladığını",
      "Bir saray yaptırdığını"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=87&mode=tefsir&sure=21",
    "Enbiyâ 21/87: karanlıklar içindeki niyaz",
    "Hz. Yûnus'un duasında Allah'ın birliğini anması ve kendisini haksızlık edenlerden sayması yer alır.",
    "yunus-repentance",
    "medium"
  ],
  [
    "prophets",
    "Enbiyâ 21/83'te Hz. Eyyûb Allah'a hangi durumunu arz eder?",
    "Bir sıkıntıya uğradığını",
    [
      "Yeni bir ülke fethettiğini",
      "Denizde kaybolduğunu",
      "Zenginleştiğini"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=83&mode=tefsir&sure=21",
    "Enbiyâ 21/83: Eyyûb'un yakarışı",
    "Hz. Eyyûb, sıkıntıya uğradığını belirterek Allah'ın merhametine sığınır.",
    "eyyub-dua",
    "easy"
  ],
  [
    "prophets",
    "Enbiyâ 21/69'a göre Hz. İbrâhim için ateşe ne olması emredilir?",
    "Serin ve esenlik olması",
    [
      "Daha çok alevlenmesi",
      "Denize dönüşmesi",
      "Gökten yağması"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=69&mode=tefsir&sure=21",
    "Enbiyâ 21/69",
    "Enbiyâ 21/69'da ateşe Hz. İbrâhim için serinlik ve esenlik olması emredilir.",
    "ibrahim-fire",
    "medium"
  ],
  [
    "prophets",
    "Neml 27/39'da Sebe hükümdarının tahtını getirmeyi teklif eden varlık kimdir?",
    "Cinlerden bir ifrit",
    [
      "Bir balıkçı",
      "Bir kervancı",
      "Bir çoban"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=39&mode=tefsir&sure=27",
    "Neml 27/39",
    "Neml 27/39'da cinlerden bir ifrit, tahtı Hz. Süleyman yerinden kalkmadan önce getirebileceğini söyler.",
    "sulayman-throne-offer",
    "hard"
  ],
  [
    "prophets",
    "Neml 27/40'ta tahtın çok kısa sürede getirilişini üstlenen kişi nasıl tanımlanır?",
    "Kitaptan bilgi sahibi biri",
    [
      "Genç bir asker",
      "Denizci bir tüccar",
      "Bir bahçıvan"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=40&mode=tefsir&sure=27",
    "Neml 27/40",
    "Neml 27/40'da kitaptan bilgi sahibi bir kişinin tahtı göz açıp kapamadan getirebileceği anlatılır.",
    "sulayman-throne-knowledge",
    "hard"
  ],
  [
    "prophets",
    "Neml 27/44'te Sebe hükümdarı sarayın zeminini ilk bakışta ne sanır?",
    "Derin bir su",
    [
      "Bir kum tepesi",
      "Bir altın tarlası",
      "Bir taş duvar"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=44&mode=tefsir&sure=27",
    "Neml 27/44",
    "Sebe hükümdarı camdan yapılmış saray zeminini su zannedince Hz. Süleyman bunun cam olduğunu açıklar.",
    "sulayman-glass-palace",
    "medium"
  ],
  [
    "prophets",
    "Yûsuf 12/100'e göre Hz. Yûsuf annesiyle babasını nereye çıkarır?",
    "Tahtın üzerine",
    [
      "Bir geminin güvertesine",
      "Bir dağın tepesine",
      "Bir kuyu kenarına"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=100&mode=tefsir&sure=12",
    "Yûsuf 12/100: anne babasını tahtın üzerine çıkarır",
    "Yûsuf 12/100'de Hz. Yûsuf'un anne ve babasını tahtın üzerine çıkardığı anlatılır.",
    "yusuf-parents-throne",
    "medium"
  ],
  [
    "prophets",
    "Yûsuf 12/84'te Hz. Ya‘kūb'un hangi organının hüzünden ağardığı anlatılır?",
    "Gözleri",
    [
      "Saçları",
      "Elleri",
      "Sakalı"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=84&mode=tefsir&sure=12",
    "Yûsuf 12/84",
    "Yûsuf 12/84'te Hz. Ya‘kūb'un Yûsuf'a duyduğu üzüntü sebebiyle gözlerinin ağardığı belirtilir.",
    "yaqub-grief",
    "medium"
  ],
  [
    "prophets",
    "Meryem 19/4'te Hz. Zekeriyyâ yaşlılığını hangi beden değişimiyle anlatır?",
    "Saçlarının beyazlaması",
    [
      "Boyunun uzaması",
      "Gözlerinin yeşermesi",
      "Sesinin tamamen susması"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=4&mode=tefsir&sure=19",
    "Meryem 19/4",
    "Hz. Zekeriyyâ duasında yaşlılığını kemiklerinin zayıflaması ve başının ağarmasıyla anlatır.",
    "zakariya-old-age",
    "medium"
  ],
  [
    "prophets",
    "Meryem 19/10'da Hz. Zekeriyyâ'ya verilen işaret kaç gece konuşamamasıdır?",
    "Üç gece",
    [
      "Bir gece",
      "Yedi gece",
      "Kırk gece"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=10&mode=tefsir&sure=19",
    "Meryem 19/10",
    "Meryem 19/10'da Hz. Zekeriyyâ'ya sağlıklı olduğu halde üç gece insanlarla konuşamaması işaret olarak verilir.",
    "zakariya-sign",
    "hard"
  ],
  [
    "prophets",
    "A‘râf 7/143'te Hz. Mûsâ'nın yanında dağa tecelli edildiğinde ne olur?",
    "Dağ parçalanır",
    [
      "Dağ denize dönüşür",
      "Dağ yükselir",
      "Dağ üzerinde saray belirir"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=143&mode=tefsir&sure=7",
    "A‘râf 7/143",
    "A‘râf 7/143'te ilâhî tecelli karşısında dağın parçalandığı ve Hz. Mûsâ'nın bayıldığı aktarılır.",
    "musa-mountain",
    "hard"
  ],
  [
    "prophets",
    "Enbiyâ 21/80'de Hz. Dâvûd'a hangi el sanatının öğretildiği belirtilir?",
    "Zırh yapımı",
    [
      "Cam üfleme",
      "Halı dokuma",
      "Gemi boyama"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=80&mode=tefsir&sure=21",
    "Enbiyâ 21/80",
    "Enbiyâ 21/80'de Hz. Dâvûd'a insanların korunması için zırh yapmanın öğretildiği belirtilir.",
    "davud-armor",
    "medium"
  ],
  [
    "prophets",
    "Sebe' 34/12'ye göre Hz. Süleyman'ın emrine hangi tabiat olayı verilmiştir?",
    "Rüzgâr",
    [
      "Yağmur damlaları",
      "Deprem",
      "Kar yağışı"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=12&mode=tefsir&sure=34",
    "Sebe' 34/12",
    "Sebe' sûresinde rüzgârın Hz. Süleyman'ın emrine verildiği anlatılır.",
    "sulayman-wind",
    "easy"
  ],
  [
    "history",
    "Ortaçağ optik çalışmalarına büyük katkıda bulunan İbnü'l-Heysem'in meşhur eseri hangisidir?",
    "Kitâbü'l-Menâzır",
    [
      "Mukaddime",
      "Kitâb-ı Bahriyye",
      "Keşfü'z-zunûn"
    ],
    "https://islamansiklopedisi.org.tr/ibnul-heysem",
    "İbnü'l-Heysem, Kitâbü'l-Menâzır ve optik",
    "Kitâbü'l-Menâzır, İbnü'l-Heysem'in ışık, görme ve yansıma üzerine araştırmalarını içeren önemli optik eseridir.",
    "ibn-haytham-book",
    "hard"
  ],
  [
    "history",
    "Bîrûnî'nin Hindistan kültürü ve inançları üzerine çalışması hangi araştırma alanıyla yakından ilgilidir?",
    "Hindoloji",
    [
      "Denizcilik",
      "Hat sanatı",
      "Haritacılık dışı gemi yapımı"
    ],
    "https://islamansiklopedisi.org.tr/biruni",
    "Bîrûnî'nin Tahkîku mâ li'l-Hind eseri",
    "Bîrûnî, Hindistan'ın inanç ve kültürünü konu alan eseriyle Hindoloji araştırmalarında öncü olmuştur.",
    "biruni-indology",
    "medium"
  ],
  [
    "history",
    "Bîrûnî'nin eserlerinde yer verdiği bilim alanlarından biri hangisidir?",
    "Astronomi",
    [
      "Çağdaş bilgisayar bilimi",
      "Uçak mühendisliği",
      "Elektronik devre tasarımı"
    ],
    "https://islamansiklopedisi.org.tr/biruni",
    "TDV Bîrûnî maddesi: astronomi ve matematik",
    "Bîrûnî astronomi, matematik, coğrafya ve başka birçok alanda eserler vermiştir.",
    "biruni-astronomy",
    "easy"
  ],
  [
    "history",
    "Evliya Çelebi'nin Seyahatnâme'si kaç ciltten oluşur?",
    "On",
    [
      "Üç",
      "Beş",
      "On altı"
    ],
    "https://islamansiklopedisi.org.tr/seyahatname--evliya-celebi",
    "Eser tanımı: on cilt",
    "Evliya Çelebi'nin geniş Osmanlı coğrafyasını anlatan Seyahatnâme'si on ciltten oluşur.",
    "evliya-volumes",
    "medium"
  ],
  [
    "history",
    "Seyahatnâme'de gezilerini anlatan ünlü Osmanlı seyyahı kimdir?",
    "Evliya Çelebi",
    [
      "İbnü'l-Heysem",
      "Bîrûnî",
      "Ebû Hanîfe"
    ],
    "https://islamansiklopedisi.org.tr/seyahatname--evliya-celebi",
    "TDV madde tanımı: Evliya Çelebi'nin eseri",
    "Evliya Çelebi, Osmanlı coğrafyası ve çevresine yaptığı yolculukları Seyahatnâme'de anlatmıştır.",
    "evliya-author",
    "easy"
  ],
  [
    "history",
    "Sahn-ı Semân medreselerini İstanbul'da kurduran padişah kimdir?",
    "Fâtih Sultan Mehmed",
    [
      "II. Mahmud",
      "I. Ahmed",
      "III. Selim"
    ],
    "https://islamansiklopedisi.org.tr/sahn-i-seman",
    "TDV Sahn-ı Semân: kurucusu",
    "Sahn-ı Semân, İstanbul'da Fâtih Sultan Mehmed tarafından kurulan yüksek dereceli medreselerdir.",
    "sahn-founder",
    "medium"
  ],
  [
    "history",
    "Sahn-ı Semân adıyla anılan yüksek dereceli medreselerin sayısı kaçtır?",
    "Sekiz",
    [
      "Dört",
      "Altı",
      "On iki"
    ],
    "https://islamansiklopedisi.org.tr/sahn-i-seman",
    "Sekiz yüksek dereceli medrese",
    "Sahn-ı Semân adı, Fâtih Külliyesi içindeki sekiz yüksek dereceli medreseye işaret eder.",
    "sahn-eight",
    "medium"
  ],
  [
    "history",
    "Sahn-ı Semân'a öğrenci hazırlamak amacıyla kurulan medreselere ne ad verilir?",
    "Tetimme medreseleri",
    [
      "Dârüşşifâlar",
      "Zâviyeler",
      "Rasathaneler"
    ],
    "https://islamansiklopedisi.org.tr/fatih-tetimmeleri",
    "TDV Fâtih Tetimmeleri tanımı",
    "Fâtih Tetimmeleri, Sahn-ı Semân'a öğrenci yetiştirmek üzere kurulmuş hazırlık medreseleridir.",
    "fatih-tetimme",
    "hard"
  ],
  [
    "history",
    "Ahîlik teşkilâtı Anadolu'da özellikle hangi yüzyıldan itibaren görülmeye başlanmıştır?",
    "XIII. yüzyıldan",
    [
      "VI. yüzyıldan",
      "XVIII. yüzyıldan",
      "XX. yüzyıldan"
    ],
    "https://islamansiklopedisi.org.tr/ahilik",
    "TDV Ahîlik tanımı: XIII. yüzyıl",
    "Ahîlik, XIII. yüzyıldan itibaren Anadolu'da yaygınlaşan dinî ve sosyal teşkilâttır.",
    "ahi-century",
    "medium"
  ],
  [
    "history",
    "Ahîlik teşkilâtının ahlâkî ve ticarî kurallarını içeren metinler nasıl adlandırılır?",
    "Fütüvvetnâme",
    [
      "Kânunnâme-i Tıbb",
      "Seyahatnâme",
      "Zîc"
    ],
    "https://islamansiklopedisi.org.tr/ahilik",
    "Ahîlik maddesi: nizamnâmeler fütüvvetnâme",
    "Ahîlikte meslek ahlâkı ve davranış ilkeleri fütüvvetnâme adı verilen metinlerde yer almıştır.",
    "ahi-futuvvet",
    "hard"
  ],
  [
    "history",
    "Hanefî mezhebinin kurucu imamı olarak tanınan âlim kimdir?",
    "Ebû Hanîfe",
    [
      "İbnü'l-Heysem",
      "Evliya Çelebi",
      "Pîrî Reis"
    ],
    "https://islamansiklopedisi.org.tr/ebu-hanife",
    "TDV Ebû Hanîfe madde tanımı",
    "Ebû Hanîfe, Hanefî fıkıh geleneğinin kurucu imamı ve büyük müctehid olarak tanınır.",
    "abu-hanifa-founder",
    "easy"
  ],
  [
    "history",
    "756'da Endülüs'te bağımsız Emevî emirliğini kuran kişi kimdir?",
    "I. Abdurrahman",
    [
      "Ukbe b. Nâfi‘",
      "Abbâsî Seffâh",
      "Târık b. Ziyâd"
    ],
    "https://islamansiklopedisi.org.tr/abdurrahman-i",
    "Endülüs Emevîleri 756 kuruluşu",
    "I. Abdurrahman, Endülüs'e geçerek 756 yılında bağımsız Endülüs Emevî Emirliği'ni kurmuştur.",
    "andalus-founder",
    "medium"
  ],
  [
    "general",
    "İsrâ 17/23'te anne babaya karşı hangi sözün bile söylenmemesi öğütlenir?",
    "Öf",
    [
      "Merhaba",
      "Teşekkürler",
      "Hoş geldin"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=23&mode=tefsir&sure=17",
    "İsrâ 17/23: anne babaya öf bile deme",
    "İsrâ sûresinde anne babaya iyi davranılması, yaşlandıklarında onlara 'öf' bile denmemesi öğütlenir.",
    "respect-parents",
    "easy"
  ],
  [
    "general",
    "Nisâ 4/58'de sahiplerine teslim edilmesi özellikle emredilen şey nedir?",
    "Emanetler",
    [
      "Savaş ganimetleri",
      "Süs eşyaları",
      "Ticaret gemileri"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=58&mode=tefsir&sure=4",
    "Nisâ 4/58: emanetleri ehline verme",
    "Nisâ 4/58, emanetlerin sahiplerine verilmesini ve insanlar arasında adaletle hükmedilmesini emreder.",
    "trusts-to-owners",
    "easy"
  ],
  [
    "general",
    "İsrâ 17/26-27'de savurganlığa ilişkin eleştirilen davranış hangisidir?",
    "İsraf ve saçıp savurmak",
    [
      "İhtiyaç sahibini gözetmek",
      "Sözünde durmak",
      "Ölçülü harcamak"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=26&mode=tefsir&sure=17",
    "İsrâ 17/26-27",
    "İsrâ sûresinde gereksiz yere mal saçıp savurmak kınanır; israf ve ölçüsüzlükten sakındırılır.",
    "israf-waste",
    "easy"
  ],
  [
    "general",
    "Şûrâ 42/38'de müminlerin ortak işlerini yürütme ilkelerinden biri hangisidir?",
    "Danışarak karar vermek",
    [
      "Herkesten habersiz hareket etmek",
      "Sürekli yarışmak",
      "Hiç fikir alışverişi yapmamak"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=38&mode=tefsir&sure=42",
    "Şûrâ 42/38: işlerini danışma ile yürütürler",
    "Şûrâ 42/38'de topluluğun işlerini karşılıklı danışma ile yürütmesi övülen bir özellik olarak geçer.",
    "consultation-shura",
    "medium"
  ],
  [
    "general",
    "Bakara 2/153'te yardım için başvurulması öğütlenen iki davranış hangisidir?",
    "Sabır ve namaz",
    [
      "Servet ve şöhret",
      "Yolculuk ve alışveriş",
      "Uyku ve oyun"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=153&mode=tefsir&sure=2",
    "Bakara 2/153",
    "Bakara 2/153'te sabır ve namazla Allah'tan yardım istenmesi öğütlenir.",
    "patience-prayer",
    "easy"
  ],
  [
    "general",
    "Sadaka ve yardımda kişiye en yakın ihtiyaç sahiplerini gözetmek hangi tutumla uyumludur?",
    "İnfak ve paylaşma",
    [
      "İsraf",
      "Kibir",
      "Gıybet"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=215&mode=tefsir&sure=2",
    "Bakara 2/215: anne baba, yakınlar, yetimler, yoksullar",
    "Bakara 2/215'te yardımda anne baba, yakınlar, yetimler, yoksullar ve yolda kalanlar hatırlatılır.",
    "infak-relatives",
    "medium"
  ],
  [
    "general",
    "Bakara 2/43'te namazla birlikte yerine getirilmesi emredilen malî ibadet hangisidir?",
    "Zekât",
    [
      "İtikâf",
      "Tilâvet secdesi",
      "Umre"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=43&mode=tefsir&sure=2",
    "Bakara 2/43",
    "Bakara 2/43'te namaz kılma ve zekât verme birlikte emredilir.",
    "namaz-zakat",
    "easy"
  ],
  [
    "general",
    "Oruç ibadetinde gün batımında orucu açma eylemine ne denir?",
    "İftar",
    [
      "Sahur",
      "İhram",
      "Hutbe"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=187&mode=tefsir&sure=2",
    "Bakara 2/187: orucun geceye kadar tamamlanması",
    "Oruç süresinin sona ermesiyle gün batımında orucun açılmasına iftar denir.",
    "iftar-meaning",
    "easy"
  ],
  [
    "general",
    "Ramazan orucuna hazırlanmak için imsak öncesinde yenilen öğün hangisidir?",
    "Sahur",
    [
      "İftar",
      "Akîka",
      "Kefaret"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=187&mode=tefsir&sure=2",
    "Bakara 2/187: tan yeri ağarıncaya kadar yeme içme",
    "Oruç tutacak kişinin imsak başlamadan önce yediği öğüne sahur denir.",
    "sahur-meaning",
    "easy"
  ],
  [
    "general",
    "Mâide 5/8'de adaletli davranmayı engellememesi istenen duygu hangisidir?",
    "Bir topluluğa duyulan kin",
    [
      "Merhamet",
      "Cömertlik",
      "Minnettarlık"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=8&mode=tefsir&sure=5",
    "Mâide 5/8: kin sizi adaletsizliğe itmesin",
    "Mâide 5/8'de bir topluluğa duyulan öfkenin insanı adaletten uzaklaştırmaması emredilir.",
    "justice-even-to-opponents",
    "medium"
  ],
  [
    "general",
    "İslâm ahlâkında Allah'ın verdiği nimetleri gereksiz yere harcamamak hangi ilkeyle ilgilidir?",
    "Ölçülülük",
    [
      "Gösteriş",
      "Savurganlık",
      "Kibir"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=31&mode=tefsir&sure=7",
    "A‘râf 7/31: yiyin, için fakat israf etmeyin",
    "A‘râf 7/31'de yeme içmede israftan kaçınılması emredilerek ölçülülük öğretilir.",
    "moderation-spending",
    "easy"
  ],
  [
    "general",
    "Hucurât 49/11'de başkalarıyla ilgili yasaklanan davranış hangisidir?",
    "Alay etmek ve kötü lakap takmak",
    [
      "Selâm vermek",
      "Adaletli olmak",
      "Güzel söz söylemek"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=11&mode=tefsir&sure=49",
    "Hucurât 49/11: alay ve kötü lakap yasağı",
    "Hucurât 49/11, insanların birbiriyle alay etmesini ve kötü lakaplarla anılmasını yasaklar.",
    "no-mockery",
    "medium"
  ],
];
const counters: Record<CategoryId, number> = { quran: 0, prophets: 0, history: 0, general: 0 };
export const newCandidatesV12: readonly Question[] = rows.map((row): Question => {
  const [categoryId, question, correct, wrong, url, locator, explanation, conceptGroup, difficulty] = row;
  const id = `v12-${categoryId}-${String(++counters[categoryId]).padStart(3, "0")}`;
  const isDiyanet = url.startsWith("https://kuran.diyanet.gov.tr/");
  return {
    id, version: 1, categoryId, difficulty, question,
    options: [{ id: "o1", text: wrong[0] }, { id: "o2", text: correct }, { id: "o3", text: wrong[1] }, { id: "o4", text: wrong[2] }],
    correctOptionId: "o2", explanation,
    sources: [{ title: isDiyanet ? "Diyanet Kur'an Yolu" : "TDV İslâm Ansiklopedisi",
      publisher: isDiyanet ? "Diyanet İşleri Başkanlığı" : "TDV İslâm Araştırmaları Merkezi",
      url, locator, supports: explanation, checkStatus: "supported", checkedAt: "2026-10-19" }],
    reviewStatus: "approved",
    reviewNotes: "Ürün sahibinin kaynak kontrolü koşullu kullanım kabulüne dayanır. Bağımsız editör ve dinî uzman incelemesi henüz tamamlanmamıştır.",
    updatedAt: "2026-10-19", conceptGroup,
  };
});
