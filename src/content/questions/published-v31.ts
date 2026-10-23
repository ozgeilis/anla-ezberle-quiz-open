import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
export const publishedNewQuestionTopicsV31: Readonly<Record<string, LearningTopicId>> = {"learn-akaid-017":"akaid"};
export const publishedNewQuestionsV31: readonly Question[] = [{
id:"learn-akaid-017",version:1,categoryId:"quran",difficulty:"medium",
question:"Zilzâl 99/7'ye göre zerre kadar hayır işleyen kimse hakkında ne bildirilir?",
options:[{id:"o1",text:"İyiliğinin unutulacağı"},{id:"o2",text:"Yaptığı iyiliğin karşılığını göreceği"},{id:"o3",text:"Yalnız büyük iyiliklerin sayılacağı"},{id:"o4",text:"İyiliğin sadece insanlarca değerlendirileceği"}],
correctOptionId:"o2",
explanation:"Zilzâl sûresinin 7. âyetinde küçücük bir hayrın dahi karşılıksız kalmayacağı belirtilir. 8. âyette ise en küçük kötülüğün de görüleceği hatırlatılır. Böylece her davranışın sorumluluk taşıdığı öğretilir.",
conceptGroup:"iman-zilzal-iyilik-karsilik",
sources:[{title:"Kur'an Yolu Tefsiri — Zilzâl 99/7-8",publisher:"Diyanet İşleri Başkanlığı",url:"https://kuran.diyanet.gov.tr/tefsir/Zilz%C3%A2l-suresi/6145/7-8-ayet-tefsiri",locator:"Zilzâl 99/7-8",supports:"En küçük hayrın ve şerrin karşılığının görüleceği ifade edilir.",checkStatus:"supported",checkedAt:"2026-10-20"}],
reviewStatus:"approved",reviewNotes:"20.10.2026: Diyanet tefsiri doğrulandı, yayımlanmış soru ID'leri ve şıklar kontrol edildi; bağımsız uzman onayı değildir.",updatedAt:"2026-10-20"
}];
