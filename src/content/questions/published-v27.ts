import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
type Row = readonly [string,string,string,readonly [string,string,string],string,string,string,string,LearningTopicId,Question["categoryId"],Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "learn-akaid-001",
    "Bakara 2/163'te Allah'ın birliğiyle birlikte hangi iki ismi anılır?",
    "Rahmân ve Rahîm",
    [
      "Azîz ve Hakîm",
      "Gafûr ve Vedûd",
      "Evvel ve Âhir"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-tefsir-1/bakara-suresi-2/ayet-156/diyanet-isleri-baskanligi-meali-1",
    "Bakara 2/163",
    "Bakara 2/163 Allah'ın tek ilah olduğunu, O'ndan başka ilah bulunmadığını ve Rahmân ile Rahîm isimlerini bildirir. Tefsirde bu iki ismin Allah'ın geniş merhametine işaret ettiği açıklanır.",
    "iman-rahman-rahim",
    "akaid",
    "quran",
    "medium"
  ],
  [
    "learn-dua-015",
    "Âl-i İmrân 3/26'da Allah'ın mülk üzerindeki tasarrufu nasıl anlatılır?",
    "Mülkü dilediğine verir ve dilediğinden alır",
    [
      "Mülkü yalnız hükümdarlar paylaştırır",
      "Mülkü hiç kimseye vermez",
      "Yönetimi sadece soy bağı belirler"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/tefsir-2/al-i-imran-suresi-3/ayet-18/diyanet-isleri-baskanligi-meali-1",
    "Âl-i İmrân 3/26",
    "Âl-i İmrân 3/26'da mülkün gerçek sahibinin Allah olduğu, O'nun mülkü dilediğine verdiği ve dilediğinden geri aldığı; yüceltme ve alçaltmanın da O'nun iradesinde olduğu açıklanır.",
    "dua-mulk-tasarruf",
    "dualar",
    "general",
    "medium"
  ]
];
export const publishedNewQuestionTopicsV27: Readonly<Record<string,LearningTopicId>> = Object.freeze(Object.fromEntries(rows.map(x=>[x[0],x[8]])));
export const publishedNewQuestionsV27: readonly Question[] = rows.map(([id,question,correct,wrong,url,locator,explanation,conceptGroup,,categoryId,difficulty])=>({
 id,version:1,categoryId,difficulty,question,options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],correctOptionId:"o2",explanation,conceptGroup,
 sources:[{title:"Diyanet Kur'an Yolu meal ve tefsiri",publisher:"Diyanet İşleri Başkanlığı",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],reviewStatus:"approved",reviewNotes:"20.10.2026: Diyanet tefsir/meali doğrulandı; dört şık ve tam metin soru tekrarı gözden geçirildi. Bağımsız ilahiyat uzmanı değerlendirmesi değildir.",updatedAt:"2026-10-20"
}));
