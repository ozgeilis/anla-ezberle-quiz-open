import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
/** Three distinct Quran verse concepts corroborated with Diyanet 2026-10-20. */
type Row = readonly [string,string,string,readonly [string,string,string],string,string,string,string,Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "learn-akaid-008",
    "Hac 22/7'de kıyametle ilgili hangisi açıkça bildirilir?",
    "Kıyametin geleceği ve ölülerin diriltileceği",
    [
      "Kıyametin hiç yaşanmayacağı",
      "Yalnız dağların diriltileceği",
      "İnsanların hesapla hiç karşılaşmayacağı"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/Hac-suresi/2600/5-7-ayet-tefsiri",
    "Hac 22/7",
    "Hac 22/7 kıyametin geleceğini ve Allah'ın kabirlerdekileri dirilteceğini bildirir. Böylece ölümden sonraki diriliş konusuna dikkat çeker.",
    "iman-kiyamet-dirilis",
    "medium"
  ],
  [
    "learn-akaid-016",
    "Mülk 67/2'de hayat ve ölümün yaratılışının hangi amacı anlatılır?",
    "İnsanların güzel işler bakımından sınanması",
    [
      "Yalnız mal biriktirilmesi",
      "İnsanların birbirinden üstün soy sayılması",
      "Sadece seyahat etmeleri"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/meal-2/mulk-suresi-67/ayet-1/diyanet-isleri-baskanligi-meali-1",
    "Mülk 67/2",
    "Mülk 67/2, ölüm ve hayatın insanların hangisinin daha güzel amel işleyeceğinin sınanması için yaratıldığını belirtir.",
    "iman-hayat-imtihan",
    "medium"
  ],
  [
    "learn-akaid-020",
    "İhlâs 112/3 Allah hakkında hangi temel ifadeyi içerir?",
    "Doğurmamış ve doğurulmamıştır",
    [
      "Yaratılmışlardan yardım almaya muhtaçtır",
      "Bir soyun üyesidir",
      "Doğumla var olmuştur"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/%C4%B0hl%C3%A2s-suresi/6224/3-ayet-tefsiri",
    "İhlâs 112/3",
    "İhlâs sûresinin üçüncü âyeti Allah'ın doğurmadığını ve doğurulmadığını bildirir; tefsirde yaratılmışlara özgü soy bağlarından münezzeh olduğu açıklanır.",
    "iman-ihlas-ucuncu-ayet",
    "medium"
  ]
];
export const publishedNewQuestionTopicsV21: Readonly<Record<string,LearningTopicId>> =
 Object.freeze(Object.fromEntries(rows.map(x=>[x[0],"akaid" as const])));
export const publishedNewQuestionsV21: readonly Question[] = rows.map(row=>{
 const [id,question,correct,wrong,url,locator,explanation,conceptGroup,difficulty]=row;
 return {id,version:1,categoryId:"quran",difficulty,question,
 options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],
 correctOptionId:"o2",explanation,conceptGroup,
 sources:[{title:"Diyanet Kur'an Yolu tefsiri",publisher:"Diyanet İşleri Başkanlığı",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],
 reviewStatus:"approved",
 reviewNotes:"20.10.2026: Diyanet ayet/tefsir kaynak metni ve v20 konu/cevap taraması; bağımsız uzman editörü onayı değildir.",
 updatedAt:"2026-10-20"};
});
