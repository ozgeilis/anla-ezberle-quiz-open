import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
/** Source checked 2026-10-20. Not independent scholar/child suitability sign-off. */
type Row = readonly [string,string,Question["categoryId"],string,string,readonly [string,string,string],string,string,string,string,Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "learn-women-015",
    "women",
    "history",
    "Ümmü Habîbe'nin babası olarak bilinen Kureyşli kişi kimdir?",
    "Ebû Süfyân",
    [
      "Ebû Tâlib",
      "Ebû Bekir",
      "Abbas"
    ],
    "https://islamansiklopedisi.org.tr/ummu-habibe",
    "Aile kökeni, Ebû Süfyân'ın kızı",
    "Ümmü Habîbe, Ebû Süfyân'ın kızıdır; asıl adı Remle'dir.",
    "umm-habiba-father",
    "easy"
  ],
  [
    "learn-women-016",
    "women",
    "history",
    "Ümmü Habîbe Müslümanların erken dönem hicretlerinde nereye gitmiştir?",
    "Habeşistan'a",
    [
      "Horasan'a",
      "Endülüs'e",
      "Bağdat'a"
    ],
    "https://islamansiklopedisi.org.tr/ummu-habibe",
    "Habeşistan'a göçü",
    "Ümmü Habîbe, ilk Müslümanlardan olup eşiyle Habeşistan'a hicret etmiştir.",
    "umm-habiba-hijra",
    "medium"
  ],
  [
    "learn-women-019",
    "women",
    "history",
    "Hz. Peygamber'in hanımlarından el emeğiyle kazandıklarını fakirlere dağıtmasıyla tanınan kişi kimdir?",
    "Zeyneb bint Cahş",
    [
      "Sevde bint Zem'a",
      "Ümmü Külsûm",
      "Rukıyye"
    ],
    "https://islamansiklopedisi.org.tr/zeyneb-bint-cahs",
    "El işçiliği ve cömertliği",
    "Zeyneb bint Cahş el işçiliğine önem verir ve kazancını ihtiyaç sahipleriyle paylaşırdı.",
    "zaynab-charity",
    "medium"
  ],
  [
    "learn-women-024",
    "women",
    "history",
    "Hz. Peygamber'in eşi Cüveyriye'nin mensup olduğu kabile grubu hangisidir?",
    "Benî Mustalik",
    [
      "Evs",
      "Benî Nadîr",
      "Sakīf"
    ],
    "https://islamansiklopedisi.org.tr/cuveyriye-bint-haris",
    "Mustalikoğulları'na mensup olması",
    "Cüveyriye bint Hâris, Benî Mustalik reisi Hâris b. Ebû Dırâr'ın kızıdır.",
    "juwayriya-tribe",
    "medium"
  ],
  [
    "learn-women-025",
    "women",
    "history",
    "Cüveyriye bint Hâris'in Müslüman olmadan önceki adı hangisidir?",
    "Berre",
    [
      "Rümeysâ",
      "Leylâ",
      "Habîbe"
    ],
    "https://islamansiklopedisi.org.tr/cuveyriye-bint-haris",
    "Eski adı Berre, adının değiştirilmesi",
    "Cüveyriye'nin daha önceki adı Berre idi; Hz. Peygamber kendisine Cüveyriye adını vermiştir.",
    "juwayriya-name",
    "hard"
  ],
  [
    "learn-women-026",
    "women",
    "history",
    "Safiyye bint Huyey'in babası hangi kabile topluluğunun ileri gelenlerindendi?",
    "Benî Nadîr",
    [
      "Benî Temîm",
      "Evs",
      "Benî Sakīf"
    ],
    "https://islamansiklopedisi.org.tr/safiyye",
    "Babası Huyey b. Ahtab'ın Benî Nadîr reisi olması",
    "Safiyye'nin babası Huyey b. Ahtab, Benî Nadîr'in reisiydi.",
    "safiyya-family",
    "hard"
  ],
  [
    "learn-women-027",
    "women",
    "history",
    "Hz. Peygamber'in son evlendiği hanım olarak bilinen kişi kimdir?",
    "Meymûne bint Hâris",
    [
      "Hafsa bint Ömer",
      "Rukıyye",
      "Şifâ bint Abdullah"
    ],
    "https://islamansiklopedisi.org.tr/meymune",
    "Son evliliği",
    "Meymûne bint Hâris, Hz. Peygamber'in son olarak evlendiği hanımıdır.",
    "maymuna-last",
    "medium"
  ],
  [
    "learn-dua-012",
    "dualar",
    "general",
    "Bakara 2/128'de Hz. İbrâhim ve İsmâil nesilleri için ne diler?",
    "Allah'a teslim olan bir topluluk",
    [
      "Ticarette üstünlük",
      "Daha fazla mülk",
      "Deniz yolculuğu"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=128&mode=tefsir&sure=2",
    "2/128",
    "Bakara 2/128'de nesillerinden Allah'a teslim olan bir topluluk yetişmesini isterler.",
    "dua-submission",
    "medium"
  ],
  [
    "learn-dua-016",
    "dualar",
    "general",
    "Hz. Zekeriyyâ Âl-i İmrân 3/38'de hangi nimeti ister?",
    "Hayırlı nesil",
    [
      "Büyük gemi",
      "Yeni şehir",
      "Deniz yolculuğu"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/%C3%82l-i%20%C4%B0mr%C3%A2n-suresi/331/38-41-ayet-tefsiri",
    "3/38",
    "Hz. Zekeriyyâ duasında temiz ve hayırlı nesil diler.",
    "dua-zakariyya",
    "easy"
  ]
];
export const publishedNewQuestionTopicsV18: Readonly<Record<string,LearningTopicId>> = Object.freeze({
"learn-women-015":"sahabe", "learn-women-016":"sahabe",
"learn-women-019":"sahabe", "learn-women-024":"sahabe",
"learn-women-025":"sahabe", "learn-women-026":"sahabe",
"learn-women-027":"sahabe", "learn-dua-012":"dualar",
"learn-dua-016":"dualar",
});
export const publishedNewQuestionsV18: readonly Question[] = rows.map(row => {
 const [id,,categoryId,question,correct,wrong,url,locator,explanation,conceptGroup,difficulty]=row;
 const isDua=id.startsWith("learn-dua-");
 return {
  id,version:1,categoryId,difficulty,question,
  options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],
  correctOptionId:"o2",explanation,conceptGroup,
  sources:[{
    title:isDua?"Diyanet Kur’an Yolu":"TDV İslâm Ansiklopedisi",
    publisher:isDua?"Diyanet İşleri Başkanlığı":"TDV İslâm Araştırmaları Merkezi",
    url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20",
  }],
  reviewStatus:"approved",
  reviewNotes:"20.10.2026: TDV/Diyanet birincil kaynağı ve v17 içerik tekrarı kontrol edildi. Bağımsız dinî uzman veya çocuk editörü onayı değildir.",
  updatedAt:"2026-10-20",
 };
});
