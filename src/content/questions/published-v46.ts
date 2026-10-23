import type { Question } from "./model";
import { bankV45 } from "./archive/bank-v45";
// Editorial correction only: no new question IDs; prior v44/v45 remains immutable.
const older=bankV45.find(q=>q.id==="q44-duha-10");
if(!older)throw new Error("Expected q44-duha-10 for v46 correction");
export const publishedCorrectionsV46: readonly Question[] = [{
  ...older,
  version:older.version+1,
  question:"Duhâ 93/10'da yardım isteyene karşı hangi davranıştan sakınılması öğütlenir?",
  options:[
    {id:"o1",text:"Yardım yollarını araştırmak"},
    {id:"o2",text:"Azarlamak"},
    {id:"o3",text:"Nazikçe dinlemek"},
    {id:"o4",text:"İlgilenmek"},
  ],
  correctOptionId:"o2",
  explanation:"Duhâ 93/10'da isteyeni azarlamamak ve incitmemek öğütlenir. Diyanet'in Kur'an Yolu tefsiri, ihtiyaç sahibini imkânlar ölçüsünde destekleme ve kötü karşılamama mesajını vurgular.",
  sources:[{
    title:"Diyanet İşleri Başkanlığı — Duhâ 93/9-11 Kur'an Yolu Tefsiri",
    publisher:"Diyanet İşleri Başkanlığı",
    url:"https://kuran.diyanet.gov.tr/tefsir/Duh%C3%A2-suresi/6088/9-11-ayet-tefsiri",
    locator:"Duhâ 93/10, Kur'an Yolu tefsiri",
    supports:"El açıp isteyeni azarlamama, incitmeme ve imkân ölçüsünde yardımcı olma öğütlenir.",
    checkStatus:"supported",
    checkedAt:"2026-10-21",
  }],
  reviewNotes:older.reviewNotes+" | 21.10.2026: Soru kökündeki çift olumsuz anlam riski giderildi, doğru şık 'Azarlamak' olarak düzenlendi; Duhâ 93/10 tefsir karşılaştırması.",
  updatedAt:"2026-10-21",
}];
