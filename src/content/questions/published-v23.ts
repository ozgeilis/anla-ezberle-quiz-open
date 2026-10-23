import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
type Row = readonly [string,string,string,readonly [string,string,string],string,string,string,string,LearningTopicId,Question["categoryId"],Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "learn-dua-027",
    "Mü’minûn 23/97-98'de hangi tehlikeden Allah'a sığınmak öğretilir?",
    "Şeytanların kışkırtmaları ve yanımızda bulunmaları",
    [
      "Hayırlı işler için çaba göstermekten",
      "Anne babaya iyilik etmekten",
      "Doğru söz söylemekten"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/M%C3%BC%27min%C3%BBn-suresi/2770/97-98-ayet-tefsiri",
    "Mü'minûn 23/97-98",
    "Mü'minûn 23/97-98'de şeytanların gizli kışkırtmalarından ve insanın yanında bulunmalarından Allah'a sığınma duası yer alır; tefsir bu kışkırtmaları kötülüğe yönelten etkiler olarak açıklar.",
    "dua-seytan-hamazat",
    "dualar",
    "general",
    "medium"
  ],
  [
    "learn-akaid-004",
    "Nahl 16/36'da tüm ümmetlere gönderilen peygamberlerin ortak çağrısı nedir?",
    "Allah'a kulluk etmek ve tâğûttan kaçınmak",
    [
      "Kendi kavimlerini üstün ilan etmek",
      "Mülk biriktirmeyi emretmek",
      "Birden çok ilâha kulluğu öğütlemek"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-meal-1/nahl-suresi-16/ayet-35/diyanet-isleri-baskanligi-meali-1",
    "Nahl 16/36",
    "Nahl 16/36, her ümmete Allah'a kulluk etmeyi ve tâğûttan kaçınmayı duyurmak üzere peygamber gönderildiğini belirtir; doğru yolu izleme ve uyarıya kulak verme vurgulanır.",
    "iman-peygamber-davet-tevhid",
    "akaid",
    "quran",
    "medium"
  ]
];
export const publishedNewQuestionTopicsV23: Readonly<Record<string,LearningTopicId>> = Object.freeze(Object.fromEntries(rows.map(x=>[x[0],x[8]])));
export const publishedNewQuestionsV23: readonly Question[] = rows.map(([id,question,correct,wrong,url,locator,explanation,conceptGroup,,categoryId,difficulty])=>({
 id,version:1,categoryId,difficulty,question,options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],correctOptionId:"o2",explanation,conceptGroup,
 sources:[{title:"Diyanet Kur'an Yolu meal ve tefsiri",publisher:"Diyanet İşleri Başkanlığı",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],reviewStatus:"approved",reviewNotes:"20.10.2026: Diyanet ayet metni ve açıklaması karşılaştırıldı; önceki banka ve şıklar kontrol edildi. Bağımsız ilahiyat uzmanı onayı değildir.",updatedAt:"2026-10-20"
}));
