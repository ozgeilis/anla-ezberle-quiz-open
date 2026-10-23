import type { Question } from "./model";
/** 20 additional Islamic history draft questions. NOT approved/playable. */
type Row = readonly [string,"history","history",string,string,readonly [string,string,string],string,string,string,string,"easy"|"medium"|"hard"];
const rows: readonly Row[] = [
  [
    "learn-history-001",
    "history",
    "history",
    "Kerbelâ Vak‘ası hangi Emevî halifesinin döneminde gerçekleşti?",
    "I. Yezîd",
    [
      "Muâviye",
      "Abdülmelik",
      "Ömer b. Abdülazîz"
    ],
    "https://islamansiklopedisi.org.tr/yezid-i",
    "Kerbelâ Vak‘ası, 10 Muharrem 61 (680)",
    "Kerbelâ 680'de I. Yezîd'in halifeliği döneminde meydana gelmiştir.",
    "hist-karbala-ruler",
    "medium"
  ],
  [
    "learn-history-002",
    "history",
    "history",
    "Kerbelâ Vak‘ası hicrî takvimin hangi ayında gerçekleşmiştir?",
    "Muharrem",
    [
      "Ramazan",
      "Şevval",
      "Zilhicce"
    ],
    "https://islamansiklopedisi.org.tr/kerbela",
    "10 Muharrem 61 (680)",
    "Hz. Hüseyin ve beraberindekilerin şehit edilmesi 10 Muharrem 61 tarihinde olmuştur.",
    "hist-karbala-month",
    "medium"
  ],
  [
    "learn-history-003",
    "history",
    "history",
    "1071 Malazgirt Savaşı'nda Büyük Selçuklu ordusunun komutanı kimdi?",
    "Sultan Alparslan",
    [
      "Tuğrul Bey",
      "Melikşah",
      "Nizâmülmülk"
    ],
    "https://islamansiklopedisi.org.tr/alparslan",
    "1071 Malazgirt seferi ve savaşı",
    "Büyük Selçuklu Sultanı Alparslan, Malazgirt Savaşı'nda ordusunu yönetmiştir.",
    "hist-manzikert-commander",
    "easy"
  ],
  [
    "learn-history-004",
    "history",
    "history",
    "Malazgirt Savaşı'nda Büyük Selçukluların karşısındaki devlet hangisiydi?",
    "Bizans İmparatorluğu",
    [
      "Sâsânî İmparatorluğu",
      "Emevî Devleti",
      "Abbâsî Devleti"
    ],
    "https://islamansiklopedisi.org.tr/malazgirt-muharebesi",
    "1071 yılında Bizans ile yapılan savaş",
    "Malazgirt Savaşı, Büyük Selçuklular ile Bizans İmparatorluğu arasında yapılmıştır.",
    "hist-manzikert-opponent",
    "easy"
  ],
  [
    "learn-history-005",
    "history",
    "history",
    "Kutadgu Bilig adlı eser hangi müellife aittir?",
    "Yûsuf Has Hâcib",
    [
      "Kâşgarlı Mahmud",
      "İbn Haldûn",
      "Fârâbî"
    ],
    "https://islamansiklopedisi.org.tr/yusuf-has-hacib",
    "Kutadgu Bilig adlı eseri",
    "Yûsuf Has Hâcib, Kutadgu Bilig adlı Türkçe eseri kaleme almıştır.",
    "hist-kutadgu-author",
    "medium"
  ],
  [
    "learn-history-006",
    "history",
    "history",
    "Dîvânü Lugāti't-Türk adlı eserin yazarı kimdir?",
    "Kâşgarlı Mahmud",
    [
      "Yûsuf Has Hâcib",
      "Ali Kuşçu",
      "Kâtip Çelebi"
    ],
    "https://islamansiklopedisi.org.tr/kasgarli-mahmud",
    "Dîvânü Lugāti't-Türk'ün yazılması",
    "Kâşgarlı Mahmud, Türk dili ve kültürü açısından önemli olan Dîvânü Lugāti't-Türk'ü yazmıştır.",
    "hist-divan-lugat",
    "medium"
  ],
  [
    "learn-history-007",
    "history",
    "history",
    "Kudüs'ün 1187'de Haçlılardan geri alınması hangi hükümdarla ilişkilidir?",
    "Selâhaddîn-i Eyyûbî",
    [
      "Nûreddin Zengî",
      "Baybars",
      "Târık b. Ziyâd"
    ],
    "https://islamansiklopedisi.org.tr/selahaddin-i-eyyubi",
    "1187 yılında Kudüs'ün alınması",
    "Selâhaddîn-i Eyyûbî, 1187 yılında Kudüs'ü Haçlılardan geri almıştır.",
    "hist-jerusalem-1187",
    "easy"
  ],
  [
    "learn-history-008",
    "history",
    "history",
    "Hıttîn Savaşı'nın gerçekleştiği yıl hangisidir?",
    "1187",
    [
      "1099",
      "1258",
      "1453"
    ],
    "https://islamansiklopedisi.org.tr/hittin-savasi",
    "1187 Hıttîn Savaşı",
    "1187 Hıttîn Savaşı'nda Selâhaddîn'in ordusu Haçlı kuvvetlerini mağlûp etmiştir.",
    "hist-hittin-year",
    "hard"
  ],
  [
    "learn-history-009",
    "history",
    "history",
    "Eyyûbîler hânedanının kurucusu kimdir?",
    "Selâhaddîn-i Eyyûbî",
    [
      "Muâviye",
      "Abbâs es-Seffâh",
      "Nizâmülmülk"
    ],
    "https://islamansiklopedisi.org.tr/eyyubiler",
    "Kuruluş tarihi ve Selâhaddîn",
    "Eyyûbîler hânedanı Selâhaddîn-i Eyyûbî ile özdeşleşen bir devlettir.",
    "hist-ayyubid-founder",
    "medium"
  ],
  [
    "learn-history-010",
    "history",
    "history",
    "Endülüs'te Nasrîler'in merkezi olan şehir hangisidir?",
    "Gırnata (Granada)",
    [
      "Kurtuba (Córdoba)",
      "İşbîliye (Sevilla)",
      "Toledo"
    ],
    "https://islamansiklopedisi.org.tr/nasriler",
    "Gırnata Emirliği",
    "Nasrîler'in merkezi Endülüs'te Gırnata şehriydi.",
    "hist-nasrid-granada",
    "medium"
  ],
  [
    "learn-history-011",
    "history",
    "history",
    "Hicaz Demiryolu'nun yapımını destekleyen Osmanlı padişahı kimdir?",
    "II. Abdülhamid",
    [
      "I. Mahmud",
      "II. Mehmed",
      "III. Selim"
    ],
    "https://islamansiklopedisi.org.tr/hicaz-demiryolu",
    "II. Abdülhamid devri Hicaz Demiryolu girişimi",
    "Hicaz Demiryolu girişimi II. Abdülhamid döneminde hayata geçirilmiştir.",
    "hist-hejaz-railway",
    "medium"
  ],
  [
    "learn-history-012",
    "history",
    "history",
    "Endülüslü filozof ve kadı İbn Rüşd hangi şehirde doğdu?",
    "Kurtuba (Córdoba)",
    [
      "Bağdat",
      "İsfahan",
      "Kahire"
    ],
    "https://islamansiklopedisi.org.tr/ibn-rusd",
    "Kurtuba'da doğumu",
    "İbn Rüşd, Endülüs'ün ilim merkezlerinden Kurtuba'da doğmuştur.",
    "hist-ibn-rushd-birth",
    "hard"
  ],
  [
    "learn-history-013",
    "history",
    "history",
    "Fâtımîler döneminde Kahire'yi kuran kumandan kimdir?",
    "Cevher es-Sıkıllî",
    [
      "Târık b. Ziyâd",
      "Hâlid b. Velîd",
      "Kuteybe b. Müslim"
    ],
    "https://islamansiklopedisi.org.tr/cevher-es-sikilli",
    "Mısır seferi ve Kahire'nin kuruluşu",
    "Fâtımî kumandanı Cevher es-Sıkıllî, Kahire'nin kuruluşunda belirleyici rol oynamıştır.",
    "hist-cairo-jawhar",
    "hard"
  ],
  [
    "learn-history-014",
    "history",
    "history",
    "Mihne olarak bilinen dinî-siyasî sorgulama uygulamasını başlatan Abbâsî halifesi kimdir?",
    "Me'mûn",
    [
      "Hârûnürreşîd",
      "Mansûr",
      "Mu'tasım"
    ],
    "https://islamansiklopedisi.org.tr/mihne",
    "Me'mûn devrinde mihne",
    "Mihne uygulaması Abbâsî Halifesi Me'mûn döneminde başlatılmıştır.",
    "hist-mihna",
    "hard"
  ],
  [
    "learn-history-015",
    "history",
    "history",
    "Osmanlı Türkçesinde basılı eserler yayımlayan ilk Türk matbaasının kurucularından olan kişi kimdir?",
    "İbrâhim Müteferrika",
    [
      "Kâtip Çelebi",
      "Evliya Çelebi",
      "Pîrî Reis"
    ],
    "https://islamansiklopedisi.org.tr/ibrahim-muteferrika",
    "Matbaacılık faaliyetleri",
    "İbrâhim Müteferrika, Osmanlı'da Türkçe kitap basımıyla tanınır.",
    "hist-muteferika",
    "medium"
  ],
  [
    "learn-history-016",
    "history",
    "history",
    "Vesîletü'n-Necât adıyla bilinen Mevlid adlı eseri yazan şair kimdir?",
    "Süleyman Çelebi",
    [
      "Yûnus Emre",
      "Âşık Paşa",
      "Fuzûlî"
    ],
    "https://islamansiklopedisi.org.tr/suleyman-celebi",
    "Vesîletü'n-Necât (Mevlid) adlı eser",
    "Süleyman Çelebi'nin Vesîletü'n-Necât'ı Türkçe mevlid geleneğinin temel eserlerindendir.",
    "hist-mevlid-author",
    "medium"
  ],
  [
    "learn-history-017",
    "history",
    "history",
    "Karahanlı hükümdarları içinde İslâmiyet'i kabulüyle anılan kişi kimdir?",
    "Satuk Buğra Han",
    [
      "Alparslan",
      "Tuğrul Bey",
      "Gazneli Mahmud"
    ],
    "https://islamansiklopedisi.org.tr/satuk-bugra-han",
    "İslâmiyet'i kabul etmesi ve Karahanlılar",
    "Satuk Buğra Han, Karahanlı hükümdarları içinde Müslüman oluşuyla tanınmaktadır.",
    "hist-karakhanid-islam",
    "medium"
  ],
  [
    "learn-history-018",
    "history",
    "history",
    "Tolunoğulları Devleti hangi bölgede kurulmuştur?",
    "Mısır",
    [
      "Endülüs",
      "Hindistan",
      "Horasan"
    ],
    "https://islamansiklopedisi.org.tr/tolunogullari",
    "Mısır'daki Tolunoğulları hânedanı",
    "Tolunoğulları Devleti dokuzuncu yüzyılda Mısır merkezli olarak kurulmuştur.",
    "hist-tulunids-egypt",
    "medium"
  ],
  [
    "learn-history-019",
    "history",
    "history",
    "Osmanlı mimarisinde Edirne Selimiye Camii'nin mimarı kimdir?",
    "Mimar Sinan",
    [
      "Sedefkâr Mehmed Ağa",
      "Mimar Hayreddin",
      "Balyan Ailesi"
    ],
    "https://islamansiklopedisi.org.tr/selimiye-camii",
    "Mimar Sinan'ın Selimiye Camii",
    "Edirne'deki Selimiye Camii, Mimar Sinan'ın başlıca eserlerinden biridir.",
    "hist-selimiye-architect",
    "easy"
  ],
  [
    "learn-history-020",
    "history",
    "history",
    "Osmanlı tarihindeki Çaldıran Savaşı hangi yıl yapılmıştır?",
    "1514",
    [
      "1453",
      "1526",
      "1571"
    ],
    "https://islamansiklopedisi.org.tr/caldiran-savasi",
    "1514 Çaldıran Savaşı",
    "Çaldıran Savaşı Osmanlılarla Safevîler arasında 1514 yılında yapılmıştır.",
    "hist-caldiran-year",
    "hard"
  ]
];
export const learningHistoryDraftQuestionsV2: readonly Question[] = rows.map(row => {
 const [id, , categoryId, question, correct, wrong, url, locator, explanation, conceptGroup, difficulty] = row;
 return {id,version:1,categoryId,difficulty,question,
 options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],correctOptionId:"o2",explanation,
 sources:[{title:"TDV İslâm Ansiklopedisi",publisher:"TDV İslâm Araştırmaları Merkezi",url,locator,supports:explanation,checkStatus:"unverified"}],
 reviewStatus:"draft",reviewNotes:"Kaynaklı tarih taslağı; hedef TDV madde künyesinin URL ve metin doğruluğu, çeldiriciler, mükerrer kavramlar ve bağımsız editör onayı bekleniyor.",updatedAt:"2026-10-20",conceptGroup};
});
