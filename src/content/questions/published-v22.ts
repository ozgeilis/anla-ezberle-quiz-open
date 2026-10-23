import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
type Row = readonly [string,string,string,readonly [string,string,string],string,string,string,string,LearningTopicId,Question["categoryId"],Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "learn-dua-017",
    "Âl-i İmrân 3/147'de zorluklar karşısında edilen duada hangi istek özellikle geçer?",
    "Ayakların sağlam tutulması ve yardım",
    [
      "Savaşmadan zafer kazanma vaadi",
      "Dünya malının iki katına çıkması",
      "Her sıkıntıdan sonsuza dek uzak kalma"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/tefsir-2/al-i-imran-suresi-3/ayet-147/diyanet-isleri-baskanligi-meali-1",
    "Âl-i İmrân 3/147",
    "Âyette önce günah ve aşırılıklardan dolayı bağışlanma, ardından ayakların sabit tutulması ve yardım istenir. Tefsir bu duayı güçlük karşısında sabır ve sebatla açıklar.",
    "dua-sebat-147",
    "dualar",
    "general",
    "medium"
  ],
  [
    "learn-akaid-003",
    "Nisâ 4/136'da iman esasları sayılırken hangi gün özellikle anılır?",
    "Âhiret günü",
    [
      "Yalnız bayram günü",
      "Yılın ilk günü",
      "Hasat günü"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/Nis%C3%A2-suresi/629/136-ayet-tefsiri",
    "Nisâ 4/136",
    "Nisâ 4/136; Allah'a, meleklere, kitaplara, peygamberlere ve âhiret gününe imanı sayar. Sorudaki 'gün' ifadesi âhiret gününe işaret eder.",
    "iman-ahiret-nisa",
    "akaid",
    "quran",
    "easy"
  ],
  [
    "learn-akaid-015",
    "Hadîd 57/3'te Allah hangi sıfatlarla tanıtılır?",
    "Evvel, âhir, zâhir ve bâtın",
    [
      "Yalnız güçlü ve zengin",
      "Yalnız görünen ve sonradan olan",
      "Yaratılmış ve sınırlı"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/Had%C3%AEd-suresi/5078/3-ayet-tefsiri",
    "Hadîd 57/3",
    "Hadîd 57/3'te Allah evvel, âhir, zâhir ve bâtın olarak nitelenir; tefsir O'nun zamandan ve mekândan münezzeh olduğunu ve ilminin her şeyi kuşattığını açıklar.",
    "iman-evvel-ahir",
    "akaid",
    "quran",
    "hard"
  ]
];
export const publishedNewQuestionTopicsV22: Readonly<Record<string,LearningTopicId>> = Object.freeze(Object.fromEntries(rows.map(x=>[x[0],x[8]])));
export const publishedNewQuestionsV22: readonly Question[] = rows.map(([id,question,correct,wrong,url,locator,explanation,conceptGroup,,categoryId,difficulty])=>({
 id,version:1,categoryId,difficulty,question,options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],correctOptionId:"o2",explanation,conceptGroup,
 sources:[{title:"Diyanet Kur'an Yolu meal ve tefsiri",publisher:"Diyanet İşleri Başkanlığı",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],reviewStatus:"approved",reviewNotes:"20.10.2026: Diyanet meal/tefsir sayfasında bilgi doğrulandı; dört şık ve önceki bankada soru tekrarları gözden geçirildi. Bağımsız ilahiyat editörü onayı değildir.",updatedAt:"2026-10-20"
}));
