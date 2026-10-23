import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
type Row = readonly [string,string,string,readonly [string,string,string],string,string,string,string,LearningTopicId,Question["categoryId"],Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "learn-dua-020",
    "A‘râf 7/89'da Hz. Şuayb, kavmiyle arasında Allah'tan ne ister?",
    "Adaletli hüküm verilmesini",
    [
      "Kavminin bütün mallarının kendisine verilmesini",
      "Bütün tartışmaların unutulmasını",
      "Şehrin hükümdarı yapılmasını"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/A%27r%C3%A2f-suresi/1042/88-89-ayet-tefsiri",
    "A‘râf 7/89",
    "Hz. Şuayb, inançlarından vazgeçmeye zorlanmaları karşısında Allah'a tevekkül eder ve kavmiyle aralarında adaletli hüküm vermesini ister.",
    "dua-suayb-adalet",
    "dualar",
    "general",
    "medium"
  ],
  [
    "learn-akaid-010",
    "Ahzâb 33/40'da Hz. Muhammed hangi iki özellikle tanıtılır?",
    "Allah'ın elçisi ve peygamberlerin sonuncusu",
    [
      "Meleklerin ilki ve hükümdarların sonuncusu",
      "İlk insan ve ilk peygamber",
      "Bir kavmin hükümdarı ve şairi"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/Ahz%C3%A2b-suresi/3573/40-ayet-tefsiri",
    "Ahzâb 33/40",
    "Ahzâb sûresinin kırkıncı âyetinde Hz. Muhammed'in Allah'ın elçisi ve peygamberlerin sonuncusu olduğu ifade edilir. Tefsir bu ifadeyi evlât edinmeyle ilgili âyetin bağlamında da açıklar.",
    "iman-son-peygamber-ahzab",
    "akaid",
    "quran",
    "medium"
  ]
];
export const publishedNewQuestionTopicsV25: Readonly<Record<string,LearningTopicId>> = Object.freeze(Object.fromEntries(rows.map(x=>[x[0],x[8]])));
export const publishedNewQuestionsV25: readonly Question[] = rows.map(([id,question,correct,wrong,url,locator,explanation,conceptGroup,,categoryId,difficulty])=>({
 id,version:1,categoryId,difficulty,question,options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],correctOptionId:"o2",explanation,conceptGroup,
 sources:[{title:"Diyanet Kur'an Yolu tefsiri",publisher:"Diyanet İşleri Başkanlığı",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],reviewStatus:"approved",reviewNotes:"20.10.2026: Diyanet ayet meali ve tefsiri doğrulandı, seçenekler ve soru tekrarı tarandı. Bağımsız ilahiyat uzmanı onayı değildir.",updatedAt:"2026-10-20"
}));
