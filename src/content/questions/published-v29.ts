import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
type Row = readonly [string,string,string,readonly [string,string,string],string,string,string,string,LearningTopicId,Question["categoryId"],Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "learn-dua-014",
    "Âl-i İmrân 3/16'da iman edenler hangi iki isteği birlikte dile getirir?",
    "Günahların bağışlanması ve ateş azabından korunma",
    [
      "Zenginlik ve hükümdarlık",
      "Yolculuk ve şöhret",
      "Sadece dünyevî başarı"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/%C3%82l-i%20%C4%B0mr%C3%A2n-suresi/309/16-17-ayet-tefsiri",
    "Âl-i İmrân 3/38",
    "Âl-i İmrân 3/16'da iman edenlerin duası günahlarının bağışlanmasını ve ateş azabından korunmayı birlikte içerir. Devamında sabır, doğruluk ve iyilik özellikleri anılır.",
    "dua-iman-magfiret-korunma",
    "dualar",
    "general",
    "medium"
  ],
  [
    "learn-akaid-007",
    "Enbiyâ 21/35'te insanların hangi iki durumla sınandığı bildirilir?",
    "Hayır ve şer ile",
    [
      "Sadece servet ve makamla",
      "Yalnız açlık ve susuzlukla",
      "Sadece başarı ve şöhretle"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/tefsir-2/enbiya-suresi-21/ayet-35/diyanet-isleri-baskanligi-meali-1",
    "Enbiyâ 21/35",
    "Enbiyâ 21/35 herkesin ölümü tadacağını, insanların hayır ve şer ile imtihan edildiğini ve sonunda Allah'a döndürüleceğini bildirir.",
    "iman-hayir-ser-imtihan",
    "akaid",
    "quran",
    "medium"
  ]
];
export const publishedNewQuestionTopicsV29: Readonly<Record<string,LearningTopicId>> = Object.freeze(Object.fromEntries(rows.map(x=>[x[0],x[8]])));
export const publishedNewQuestionsV29: readonly Question[] = rows.map(([id,question,correct,wrong,url,locator,explanation,conceptGroup,,categoryId,difficulty])=>({
 id,version:1,categoryId,difficulty,question,options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],correctOptionId:"o2",explanation,conceptGroup,
 sources:[{title:"Diyanet Kur'an Yolu meal ve tefsiri",publisher:"Diyanet İşleri Başkanlığı",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],reviewStatus:"approved",reviewNotes:"20.10.2026: Diyanet meal/tefsir kaynağı doğrudan kontrol edildi; seçenekler ve eski sorularla benzerlik incelendi. Bağımsız ilahiyat uzmanı onayı değildir.",updatedAt:"2026-10-20"
}));
