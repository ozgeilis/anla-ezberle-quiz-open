import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
type Row = readonly [string,string,string,readonly [string,string,string],string,string,string,string,LearningTopicId,Question["categoryId"],Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "learn-women-007",
    "TDV İslâm Ansiklopedisi'ne göre Hz. Peygamber'in eşleri arasında Hz. Âişe'den sonra en çok hadis rivayet eden kimdir?",
    "Ümmü Seleme",
    [
      "Ümmü Habîbe",
      "Hafsa bint Ömer",
      "Zeyneb bint Cahş"
    ],
    "https://islamansiklopedisi.org.tr/ummu-seleme",
    "Ümmü Seleme, hadis rivayetleri",
    "TDV'ye göre Ümmü Seleme, Hz. Peygamber'in eşleri arasında Hz. Âişe'den sonra en çok hadis rivayet eden kişidir. Kendisine nispet edilen 378 rivayet bulunur.",
    "women-ummu-seleme-rivayet",
    "sahabe",
    "history",
    "medium"
  ],
  [
    "learn-women-009",
    "Boşanma sonrası iddet ve nafakayla ilgili rivayeti fıkıh tartışmalarında ele alınan kadın sahâbî kimdir?",
    "Fâtıma bint Kays",
    [
      "Esmâ bint Ebû Bekir",
      "Ümmü Umâre",
      "Fâtıma bint Esed"
    ],
    "https://islamansiklopedisi.org.tr/fatima-bint-kays",
    "Fâtıma bint Kays, boşanma ve iddet rivayeti",
    "Fâtıma bint Kays'ın boşanması ve iddet sırasında ikamet ile nafaka konusundaki rivayeti fıkıh literatüründe tartışılmıştır. Bu rivayetten çıkarılan hükümlerde mezhepler ve âlimler arasında farklı görüşler vardır.",
    "women-fatima-kays-iddet",
    "sahabe",
    "history",
    "hard"
  ]
];
export const publishedNewQuestionTopicsV30: Readonly<Record<string,LearningTopicId>> = Object.freeze(Object.fromEntries(rows.map(x=>[x[0],x[8]])));
export const publishedNewQuestionsV30: readonly Question[] = rows.map(([id,question,correct,wrong,url,locator,explanation,conceptGroup,,categoryId,difficulty])=>({
 id,version:1,categoryId,difficulty,question,options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],correctOptionId:"o2",explanation,conceptGroup,
 sources:[{title:"TDV İslâm Ansiklopedisi",publisher:"TDV İslâm Araştırmaları Merkezi",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],reviewStatus:"approved",reviewNotes:"20.10.2026: TDV maddeleri, seçenekler ve anlam tekrarları kontrol edildi. Fâtıma bint Kays rivayeti üzerinde fıkhî ihtilaf bulunduğundan soru yalnız tarihî rivayeti kime ait olduğunu sorar. Bağımsız uzman onayı değildir.",updatedAt:"2026-10-20"
}));
