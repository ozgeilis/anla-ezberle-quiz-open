import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
type Row = readonly [string,string,string,readonly [string,string,string],string,string,string,string,LearningTopicId,Question["categoryId"],Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "learn-women-028",
    "Hz. Peygamber'in hanımlarından Meymûne bint Hâris'in önceki adı neydi?",
    "Berre",
    [
      "Remle",
      "Rümeysâ",
      "Leylâ"
    ],
    "https://islamansiklopedisi.org.tr/meymune",
    "Meymûne maddesi, giriş",
    "TDV İslâm Ansiklopedisi'ne göre Meymûne bint Hâris'in Hz. Peygamber ile evlenmeden önceki adı Berre idi. Hz. Peygamber bu adı Meymûne olarak değiştirdi.",
    "women-meymune-name",
    "sahabe",
    "history",
    "hard"
  ],
  [
    "learn-history-019",
    "Edirne'deki Selimiye Camii hangi Osmanlı padişahı tarafından yaptırılmıştır?",
    "II. Selim",
    [
      "Kanûnî Sultan Süleyman",
      "III. Murad",
      "II. Bayezid"
    ],
    "https://islamansiklopedisi.org.tr/selimiye-camii-ve-kulliyesi--edirne",
    "Selimiye Camii ve Külliyesi maddesi, giriş",
    "TDV İslâm Ansiklopedisi'ne göre Edirne Selimiye Camii ve külliyesini Sultan II. Selim yaptırmış, ana yapıları Mimar Sinan inşa etmiştir. Banisi II. Selim'dir; mimarıyla karıştırılmamalıdır.",
    "history-selimiye-patron",
    "islam_tarihi",
    "history",
    "medium"
  ]
];
export const publishedNewQuestionTopicsV28: Readonly<Record<string,LearningTopicId>> = Object.freeze(Object.fromEntries(rows.map(x=>[x[0],x[8]])));
export const publishedNewQuestionsV28: readonly Question[] = rows.map(([id,question,correct,wrong,url,locator,explanation,conceptGroup,,categoryId,difficulty])=>({
 id,version:1,categoryId,difficulty,question,options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],correctOptionId:"o2",explanation,conceptGroup,
 sources:[{title:"TDV İslâm Ansiklopedisi",publisher:"TDV İslâm Araştırmaları Merkezi",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],reviewStatus:"approved",reviewNotes:"20.10.2026: TDV maddeleri ile doğrulandı; önceki banka ve seçeneklerin ayırt ediciliği incelendi. Bağımsız tarih editörü onayı değildir.",updatedAt:"2026-10-20"
}));
