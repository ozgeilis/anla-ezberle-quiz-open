import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
type Row = readonly [string,string,string,readonly [string,string,string],string,string,string,string,LearningTopicId,Question["categoryId"],Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "learn-dua-011",
    "Bakara 2/127'ye göre Kâbe'nin temellerini yükselten Hz. İbrâhim ve Hz. İsmâil'in duasındaki istek nedir?",
    "Yaptıkları ibadetin Allah tarafından kabul edilmesi",
    [
      "Dünya servetlerinin artması",
      "Kendilerine ayrı bir ülke verilmesi",
      "İnsanların onları hükümdar seçmesi"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=127&mode=tefsir&sure=2",
    "Bakara 2/127",
    "Bakara 2/127, Hz. İbrâhim ile Hz. İsmâil'in Kâbe'nin temellerini yükseltirken yaptıkları işin Allah tarafından kabul edilmesi için dua ettiklerini bildirir.",
    "dua-kabe-kabul",
    "dualar",
    "general",
    "medium"
  ],
  [
    "learn-akaid-002",
    "Bakara 2/285'te müminlerin Allah'ın elçilerine karşı hangi tutumu dile getirdikleri anlatılır?",
    "Peygamberler arasında iman bakımından ayrım yapmamak",
    [
      "Yalnız bir peygambere inanmak",
      "Peygamberleri ilâh saymak",
      "Peygamberlerin hiçbirine inanmamak"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/Bakara-suresi/292/285-286-ayet-tefsiri",
    "Bakara 2/285",
    "Bakara 2/285'te müminlerin Allah'a, meleklerine, kitaplarına ve peygamberlerine iman ettikleri, peygamberleri arasında ayrım yapmadıkları ve bağışlanma diledikleri bildirilir.",
    "iman-resuller-ayrim-yapmamak",
    "akaid",
    "quran",
    "medium"
  ]
];
export const publishedNewQuestionTopicsV26: Readonly<Record<string,LearningTopicId>> = Object.freeze(Object.fromEntries(rows.map(x=>[x[0],x[8]])));
export const publishedNewQuestionsV26: readonly Question[] = rows.map(([id,question,correct,wrong,url,locator,explanation,conceptGroup,,categoryId,difficulty])=>({
 id,version:1,categoryId,difficulty,question,options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],correctOptionId:"o2",explanation,conceptGroup,
 sources:[{title:"Diyanet Kur'an Yolu meal ve tefsiri",publisher:"Diyanet İşleri Başkanlığı",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],reviewStatus:"approved",reviewNotes:"20.10.2026: Diyanet doğrudan âyet meal/tefsiri doğrulandı, şıklar ve tekrarlama tarandı. Bağımsız uzman onayı değildir.",updatedAt:"2026-10-20"
}));
