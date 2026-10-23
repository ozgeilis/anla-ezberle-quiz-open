import { makeCandidates, type Candidate } from "./candidate-builder";

// TDV maddeleriyle ilişkilendirilmiş tarih soruları; insan incelemesi beklenir.
const rows: readonly Candidate[] = [
  [
    "Hz. Muhammed'in ilk vahyi aldığı yer hangisidir?",
    "Hira Mağarası",
    [
      "Sevr Mağarası",
      "Kuba Mescidi",
      "Mescid-i Nebevî"
    ],
    "https://islamansiklopedisi.org.tr/hira",
    "Hira maddesi",
    "İlk vahiy Hira Mağarası'nda gelmiştir.",
    "hira-revelation",
    "medium",
    "supported"
  ],
  [
    "Hira Mağarası Mekke yakınında hangi dağdadır?",
    "Nur Dağı",
    [
      "Uhud Dağı",
      "Arafat Dağı",
      "Safa Tepesi"
    ],
    "https://islamansiklopedisi.org.tr/hira",
    "Mağaranın konumu",
    "Hira, Mekke yakınındaki Nur Dağı'nda yer alır.",
    "hira-place",
    "medium",
    "supported"
  ],
  [
    "Mekke, Arap yarımadasının hangi tarihî bölgesinde yer alır?",
    "Hicaz",
    [
      "Yemen",
      "Umman",
      "Hadramevt"
    ],
    "https://islamansiklopedisi.org.tr/hicaz",
    "Hicaz'ın coğrafyası; Mekke",
    "TDV Hicaz maddesi Mekke'yi Hicaz bölgesindeki başlıca şehirler arasında sayar.",
    "mecca-hicaz",
    "medium",
    "supported"
  ],
  [
    "Hicret sırasında Hz. Peygamber ve Ebû Bekir'in bir süre saklandığı mağara hangisidir?",
    "Sevr Mağarası",
    [
      "Hira Mağarası",
      "Ashâb-ı Kehf Mağarası",
      "Damlataş Mağarası"
    ],
    "https://islamansiklopedisi.org.tr/hicret",
    "Hicret yolculuğunda Sevr mağarası",
    "Hicret sırasında Hz. Peygamber ve Ebû Bekir Sevr mağarasına sığınmışlardır.",
    "hicret-sevr",
    "medium",
    "supported"
  ],
  [
    "İslâm tarihinde muhacirlerin hicret ettiği şehir hangisidir?",
    "Medine",
    [
      "Bağdat",
      "Kûfe",
      "Şam"
    ],
    "https://islamansiklopedisi.org.tr/hicret",
    "Hicret ve muhacirler",
    "Muhacirler Mekke'den Medine'ye göç eden Müslümanlardır.",
    "hijra-route",
    "medium",
    "supported"
  ],
  [
    "Ensar kelimesinin dayandığı Arapça kök hangi anlamla ilişkilidir?",
    "Yardım etmek",
    [
      "Yolculuk etmek",
      "Yazmak",
      "Saymak"
    ],
    "https://islamansiklopedisi.org.tr/ensar",
    "Ensar kelimesinin kökeni",
    "Ensar, yardım etmek anlamındaki nasr köküne dayanır.",
    "ansar-etymology",
    "medium",
    "supported"
  ],
  [
    "Ensarın mensup olduğu iki temel Medine kabilesi hangileridir?",
    "Evs ve Hazrec",
    [
      "Kureyş ve Sakîf",
      "Ad ve Semûd",
      "Temîm ve Tay"
    ],
    "https://islamansiklopedisi.org.tr/ensar",
    "Evs ve Hazrec",
    "Ensarın temel iki kabilesi Evs ve Hazrec'dir.",
    "ansar-tribes",
    "medium",
    "supported"
  ],
  [
    "Medine şehri Arap yarımadasının hangi bölgesinde yer alır?",
    "Hicaz",
    [
      "Yemen",
      "Hadramevt",
      "Umman"
    ],
    "https://islamansiklopedisi.org.tr/medine",
    "Şehrin coğrafi konumu",
    "Medine Hicaz bölgesinde yer alır.",
    "medina-location",
    "medium",
    "supported"
  ],
  [
    "Hz. Muhammed'e hicrette arkadaşlık eden sahâbî kimdir?",
    "Ebû Bekir",
    [
      "Osman",
      "Bilâl",
      "Hâlid b. Velîd"
    ],
    "https://islamansiklopedisi.org.tr/hicret",
    "Hz. Peygamber'in hicret yolculuğu",
    "Hz. Ebû Bekir, hicret yolculuğunda Hz. Peygamber'e eşlik etti.",
    "hijra-companion",
    "medium",
    "supported"
  ],
  [
    "Medine'de Hz. Peygamber'in inşa ettirdiği mescid hangisidir?",
    "Mescid-i Nebevî",
    [
      "Mescid-i Aksâ",
      "Kuba Mescidi",
      "Mescid-i Harâm"
    ],
    "https://islamansiklopedisi.org.tr/mescid-i-nebevi",
    "Mescidin kuruluşu",
    "Mescid-i Nebevî Medine'de Hz. Peygamber tarafından inşa ettirilmiştir.",
    "masjid-nabawi",
    "medium",
    "supported"
  ],
  [
    "Hicretten sonra Kuba'da inşa edilen mescidin adı nedir?",
    "Kuba Mescidi",
    [
      "Mescid-i Nebevî",
      "Mescid-i Aksâ",
      "Mescid-i Harâm"
    ],
    "https://islamansiklopedisi.org.tr/kuba-mescidi",
    "Kuba Mescidi tanımı",
    "Kuba Mescidi, hicret sırasında Kuba'da inşa edilen mesciddir.",
    "kuba-mosque",
    "medium",
    "supported"
  ],
  [
    "Ashâb-ı Suffe'nin Mescid-i Nebevî'deki başlıca faaliyetlerinden biri hangisiydi?",
    "Kur'an ve dinî bilgiler öğrenmek",
    [
      "Denizcilik eğitimi",
      "Gemi yapımı",
      "Maden işletmeciliği"
    ],
    "https://islamansiklopedisi.org.tr/suffe",
    "Ashâb-ı Suffe'nin eğitim hayatı",
    "Ashâb-ı Suffe, Mescid-i Nebevî'nin Suffe bölümünde Kur'an ve dinî bilgiler öğrenirdi.",
    "suffe-ogrenim",
    "medium",
    "supported"
  ],
  [
    "Suffe'de kalan ve ilim öğrenen sahâbîlere ne ad verilir?",
    "Ashâb-ı Suffe",
    [
      "Ensâr-ı Bedir",
      "Müellefe-i kulûb",
      "Ehl-i Beyt"
    ],
    "https://islamansiklopedisi.org.tr/suffe",
    "Ashâb-ı Suffe",
    "Suffe'de kalanlar Ashâb-ı Suffe diye anılır.",
    "suffa-people",
    "medium",
    "supported"
  ],
  [
    "Muâhât kardeşlik uygulaması hangi iki topluluğu birleştirmiştir?",
    "Muhacir ve ensarı",
    [
      "Kureyş ve Sakîf'i",
      "Rumlar ve Persleri",
      "Evs ve Kureyş'i"
    ],
    "https://islamansiklopedisi.org.tr/muahat",
    "Muâhât tanımı",
    "Muâhât, hicret sonrasında muhacir ve ensar arasında kurulan kardeşlik ilişkisidir.",
    "muahat-people",
    "medium",
    "supported"
  ],
  [
    "Hz. Hatice'nin İslâm öncesindeki faaliyetlerinden biri hangisiydi?",
    "Ticaret",
    [
      "Gemi yapımı",
      "Madencilik",
      "Hattatlık"
    ],
    "https://islamansiklopedisi.org.tr/hatice",
    "Hz. Hatice'nin ticaret hayatı",
    "Hz. Hatice ticaretle uğraşan bir kişiydi.",
    "hatice-trade",
    "medium",
    "supported"
  ],
  [
    "Hz. Muhammed'e gelen ilk vahiy sonrasında ona destek olan eşi kimdir?",
    "Hz. Hatice",
    [
      "Hz. Hafsa",
      "Hz. Safiyye",
      "Hz. Ümmü Seleme"
    ],
    "https://islamansiklopedisi.org.tr/hatice",
    "İlk vahiy sonrası",
    "Hz. Hatice ilk vahiy sonrasında Hz. Peygamber'e destek olmuştur.",
    "hatice-support",
    "medium",
    "supported"
  ],
  [
    "Bedir Gazvesi hicrî takvimin hangi ayında gerçekleşmiştir?",
    "Ramazan",
    [
      "Muharrem",
      "Receb",
      "Şevval"
    ],
    "https://islamansiklopedisi.org.tr/bedir-gazvesi",
    "Bedir 17 Ramazan, 2/624",
    "Bedir Gazvesi hicretin ikinci yılı Ramazan ayında gerçekleşmiştir.",
    "badr-month",
    "medium",
    "supported"
  ],
  [
    "Bedir Gazvesi milâdî hangi yılda gerçekleşmiştir?",
    "624",
    [
      "622",
      "625",
      "630"
    ],
    "https://islamansiklopedisi.org.tr/bedir-gazvesi",
    "Milâdî tarih",
    "Bedir Gazvesi 624 yılında gerçekleşmiştir.",
    "badr-date",
    "medium",
    "supported"
  ],
  [
    "Bedir Gazvesi'nde Müslümanların karşısındaki başlıca güç nereden gelmiştir?",
    "Mekke",
    [
      "Bizans",
      "İran",
      "Habeşistan"
    ],
    "https://islamansiklopedisi.org.tr/bedir-gazvesi",
    "Savaşın tarafları",
    "Bedir, Müslümanlarla Mekkeli müşrikler arasında gerçekleşmiştir.",
    "badr-parties",
    "medium",
    "supported"
  ],
  [
    "Uhud Gazvesi hicretin kaçıncı yılında gerçekleşmiştir?",
    "3",
    [
      "2",
      "5",
      "8"
    ],
    "https://islamansiklopedisi.org.tr/uhud-gazvesi",
    "Hicrî tarih",
    "Uhud Gazvesi hicretin üçüncü yılında gerçekleşmiştir.",
    "uhud-date",
    "medium",
    "supported"
  ],
  [
    "Uhud Gazvesi adını hangi coğrafî unsurdan alır?",
    "Uhud Dağı",
    [
      "Nur Dağı",
      "Safa Tepesi",
      "Sevr Dağı"
    ],
    "https://islamansiklopedisi.org.tr/uhud-gazvesi",
    "Savaşın yeri",
    "Uhud Gazvesi, Medine yakınındaki Uhud Dağı çevresinde gerçekleşmiştir.",
    "uhud-location",
    "medium",
    "supported"
  ],
  [
    "Hz. Hamza hangi savaşta şehit olmuştur?",
    "Uhud",
    [
      "Bedir",
      "Hendek",
      "Hayber"
    ],
    "https://islamansiklopedisi.org.tr/uhud-gazvesi",
    "Şehitler",
    "Hz. Hamza Uhud Gazvesi'nde şehit olmuştur.",
    "hamza-uhud",
    "medium",
    "supported"
  ],
  [
    "Hudeybiye Antlaşması hicretin kaçıncı yılında yapılmıştır?",
    "6",
    [
      "2",
      "3",
      "8"
    ],
    "https://islamansiklopedisi.org.tr/hudeybiye-antlasmasi",
    "Antlaşmanın tarihi",
    "Hudeybiye Antlaşması hicretin altıncı yılında yapılmıştır.",
    "hudaybiyya-date",
    "medium",
    "supported"
  ],
  [
    "Hudeybiye Antlaşması hangi şehir yakınında yapılmıştır?",
    "Mekke",
    [
      "Medine",
      "Kûfe",
      "Basra"
    ],
    "https://islamansiklopedisi.org.tr/hudeybiye-antlasmasi",
    "Coğrafî konum",
    "Hudeybiye, Mekke yakınlarında bulunan bir bölgedir.",
    "hudaybiyya-place",
    "medium",
    "supported"
  ],
  [
    "Hudeybiye Antlaşması'nın başlıca tarafları kimlerdir?",
    "Medineli Müslümanlar ve Mekke Kureyşlileri",
    [
      "Müslümanlar ve Bizanslılar",
      "Müslümanlar ve Persler",
      "Evs ve Hazrec"
    ],
    "https://islamansiklopedisi.org.tr/hudeybiye-antlasmasi",
    "Antlaşmanın tarafları",
    "Hudeybiye Antlaşması Müslümanlarla Mekkeli Kureyşliler arasında yapıldı.",
    "hudaybiyya-parties",
    "medium",
    "supported"
  ],
  [
    "Birinci Akabe Biatı hangi milâdî yılda yapılmıştır?",
    "621",
    [
      "610",
      "622",
      "630"
    ],
    "https://islamansiklopedisi.org.tr/akabe-biatlari",
    "Birinci Akabe Biatı",
    "Birinci Akabe Biatı 621 yılında yapılmıştır.",
    "akaba-one",
    "medium",
    "supported"
  ],
  [
    "İkinci Akabe Biatı hangi milâdî yılda yapılmıştır?",
    "622",
    [
      "621",
      "624",
      "628"
    ],
    "https://islamansiklopedisi.org.tr/akabe-biatlari",
    "İkinci Akabe Biatı",
    "İkinci Akabe Biatı 622 yılında yapılmıştır.",
    "akaba-two",
    "medium",
    "supported"
  ],
  [
    "Birinci Akabe Biatı'nın ardından Medine'de Kur'an öğretmekle görevlendirilen sahâbî kimdir?",
    "Mus'ab b. Umeyr",
    [
      "Ebû Hüreyre",
      "Hâlid b. Velîd",
      "Bilâl"
    ],
    "https://islamansiklopedisi.org.tr/akabe-biatlari",
    "Medine'ye gönderilen öğretici",
    "Mus'ab b. Umeyr Birinci Akabe Biatı'nın ardından Medine'ye öğretici olarak gönderilmiştir.",
    "akaba-musab",
    "medium",
    "supported"
  ],
  [
    "İkinci Akabe Biatı'nda Medineliler Hz. Peygamber'i hangi şehre davet etmiştir?",
    "Medine",
    [
      "Taif",
      "Kûfe",
      "Basra"
    ],
    "https://islamansiklopedisi.org.tr/akabe-biatlari",
    "İkinci biatin amacı",
    "Medineliler Hz. Peygamber'i Medine'ye davet etmişlerdir.",
    "akaba-invitation",
    "medium",
    "supported"
  ],
  [
    "Hz. Peygamber'den sonra ilk halife kim olmuştur?",
    "Ebû Bekir",
    [
      "Ömer",
      "Osman",
      "Ali"
    ],
    "https://islamansiklopedisi.org.tr/ebu-bekir",
    "Hilâfetin başlangıcı",
    "Hz. Ebû Bekir, Hz. Peygamber'den sonra ilk halife olmuştur.",
    "first-caliph",
    "medium",
    "supported"
  ],
  [
    "İkinci halife kimdir?",
    "Ömer",
    [
      "Ebû Bekir",
      "Osman",
      "Ali"
    ],
    "https://islamansiklopedisi.org.tr/omer",
    "Hilâfet sırası",
    "Hz. Ömer ikinci halifedir.",
    "second-caliph",
    "medium",
    "supported"
  ],
  [
    "Hz. Ebû Bekir döneminde Kur'an nüshalarının toplanması işinde öne çıkan sahâbî kimdir?",
    "Zeyd b. Sâbit",
    [
      "Bilâl",
      "Selmân-ı Fârisî",
      "Hâlid b. Velîd"
    ],
    "https://islamansiklopedisi.org.tr/zeyd-b-sabit",
    "Kur'an'ın cemi; Hz. Ebû Bekir devrinde Zeyd b. Sâbit",
    "Hz. Ebû Bekir dönemindeki Kur'an toplama çalışmalarında Zeyd b. Sâbit görev almıştır.",
    "quran-collection",
    "medium",
    "supported"
  ],
  [
    "Hz. Osman döneminde çoğaltılan Mushaf nüshaları hangi amaçla merkezlere gönderilmiştir?",
    "Okuma birliğini korumak",
    [
      "Yeni sûre eklemek",
      "Âyetleri azaltmak",
      "Sıralamayı rastgele değiştirmek"
    ],
    "https://islamansiklopedisi.org.tr/osman",
    "Mushafların çoğaltılması",
    "Hz. Osman döneminde Mushaf nüshaları okuma birliğine katkı için çoğaltılıp merkezlere gönderilmiştir.",
    "quran-standardization",
    "medium",
    "supported"
  ],
  [
    "Kıblenin Kudüs'ten Kâbe'ye çevrilmesi hangi şehirde yaşayan Müslümanlar döneminde olmuştur?",
    "Medine",
    [
      "Mekke",
      "Bağdat",
      "Kûfe"
    ],
    "https://islamansiklopedisi.org.tr/kible",
    "Kıble değişimi",
    "Kıblenin Kâbe'ye çevrilmesi hicretten sonra Medine döneminde gerçekleşmiştir.",
    "qibla-change",
    "medium",
    "supported"
  ],
  [
    "İslâm'ın ilk döneminde Medine'nin toplum hayatını örgütleyen ibadet ve buluşma merkezi hangisidir?",
    "Mescid-i Nebevî",
    [
      "Hira Mağarası",
      "Arafat",
      "Sevr Mağarası"
    ],
    "https://islamansiklopedisi.org.tr/mescid-i-nebevi",
    "Mescidin işlevleri",
    "Mescid-i Nebevî erken Medine toplumunda ibadet ve buluşma merkeziydi.",
    "masjid-nabawi",
    "medium",
    "supported"
  ]
];
export const historyV4 = makeCandidates("history", rows);
