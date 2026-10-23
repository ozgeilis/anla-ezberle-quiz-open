import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
type Row = readonly [string,string,string,readonly [string,string,string],string,string,string,string,LearningTopicId,Question["categoryId"],Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "learn-dua-018",
    "Âl-i İmrân 3/191'de göklerin ve yerin yaratılışını düşünenler Allah'tan ne ister?",
    "Cehennem azabından korunmayı",
    [
      "Kendilerine yeni bir kitap indirilmesini",
      "Gece ile gündüzün durmasını",
      "Yaratılışın bütün sırlarını bilmeyi"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/%C3%82l-i%20%C4%B0mr%C3%A2n-suresi/483/190-191-ayet-tefsiri",
    "Âl-i İmrân 3/191",
    "Âyette insanlar ayakta, otururken ve yatarken Allah'ı anar; göklerin ve yerin yaratılışını düşünürken yaratılışın boşuna olmadığını dile getirip ateş azabından korunmayı ister.",
    "dua-tefekkur-ahiret",
    "dualar",
    "general",
    "medium"
  ],
  [
    "learn-dua-019",
    "Âl-i İmrân 3/193'te iman çağrısına cevap verenlerin duasında hangi istek yer alır?",
    "Günahların bağışlanması ve iyilerle birlikte vefat etmek",
    [
      "Dünyadaki bütün servetin kendilerine verilmesi",
      "Bütün toplumlara yönetici tayin edilmeleri",
      "Hesap gününün kaldırılması"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-meal-1/al-i-imran-suresi-3/ayet-189/diyanet-isleri-baskanligi-meali-1",
    "Âl-i İmrân 3/193",
    "İmana çağıran davetçiyi dinleyip inandıklarını belirten müminler; günahlarının bağışlanmasını, kötülüklerinin örtülmesini ve iyilerle beraber can vermeyi diler.",
    "dua-iman-cagri",
    "dualar",
    "general",
    "medium"
  ]
];
export const publishedNewQuestionTopicsV24: Readonly<Record<string,LearningTopicId>> = Object.freeze(Object.fromEntries(rows.map(x=>[x[0],x[8]])));
export const publishedNewQuestionsV24: readonly Question[] = rows.map(([id,question,correct,wrong,url,locator,explanation,conceptGroup,,categoryId,difficulty])=>({
 id,version:1,categoryId,difficulty,question,options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],correctOptionId:"o2",explanation,conceptGroup,
 sources:[{title:"Diyanet Kur'an Yolu meal ve tefsiri",publisher:"Diyanet İşleri Başkanlığı",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],reviewStatus:"approved",reviewNotes:"20.10.2026: İlgili Diyanet âyet meali ve tefsiri doğrulandı, önceki soru bankası ile tekrar taraması yapıldı. Bağımsız ilahiyat uzmanı değerlendirmesi değildir.",updatedAt:"2026-10-20"
}));
