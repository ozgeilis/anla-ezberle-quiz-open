import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
/** Nine TDV source-checked historical facts; v16 immutable.
 * Excluded learn-history-019 because v11 tests the same Selimiye/Sinan fact.
 * Scholarly and physical iPhone acceptance are separate from source checking.
 */
type Row = readonly [string,"history","history",string,string,readonly [string,string,string],string,string,string,string,Question["difficulty"]];
const rows: readonly Row[] = [
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
    "https://islamansiklopedisi.org.tr/ibn-rusd--torun",
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
    "https://islamansiklopedisi.org.tr/mevlid--suleyman-celebi",
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
export const publishedNewQuestionTopicsV17: Readonly<Record<string,LearningTopicId>> = Object.freeze({
"learn-history-011":"medeniyet", "learn-history-012":"medeniyet",
"learn-history-013":"islam_tarihi", "learn-history-014":"islam_tarihi",
"learn-history-015":"medeniyet", "learn-history-016":"medeniyet",
"learn-history-017":"islam_tarihi", "learn-history-018":"islam_tarihi",
"learn-history-020":"islam_tarihi",
});
export const publishedNewQuestionsV17: readonly Question[] = rows.map(row => {
 const [id,,categoryId,question,correct,wrong,url,locator,explanation,conceptGroup,difficulty] = row;
 return {
  id,version:1,categoryId,difficulty,question,
  options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],
  correctOptionId:"o2",explanation,conceptGroup,
  sources:[{title:"TDV İslâm Ansiklopedisi",publisher:"TDV İslâm Araştırmaları Merkezi",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],
  reviewStatus:"approved",
  reviewNotes:"20.10.2026: TDV maddesinde cevap kontrol edildi. v16 soru bankasıyla anlam tekrarı tarandı. Bağımsız dinî uzman veya yaş uygunluk sertifikası değildir.",
  updatedAt:"2026-10-20",
 };
});
