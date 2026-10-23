import type { Question } from "./model";

/** Additional original content DRAFTS. Sources are reference links, not
 * independent theological review. Not imported by any playable bank.
 */
type DraftTopicV2 = "women" | "dualar" | "akaid" | "history";
type DraftRowV2 = readonly [string,DraftTopicV2,"history"|"general"|"quran",string,string,readonly [string,string,string],string,string,string,string,"easy"|"medium"|"hard"];
const rows: readonly DraftRowV2[] = [
  [
    "learn-women-011",
    "women",
    "history",
    "Hz. Ömer'in kızı olan ve Hz. Peygamber'le evlenen sahâbî kimdir?",
    "Hafsa bint Ömer",
    [
      "Sevde bint Zem'a",
      "Cüveyriye bint Hâris",
      "Şifâ bint Abdullah"
    ],
    "https://islamansiklopedisi.org.tr/hafsa",
    "Ailesi ve Hz. Peygamber'le evliliği",
    "Hafsa, Hz. Ömer'in kızı ve Hz. Peygamber'in eşidir.",
    "hafsa-family",
    "easy"
  ],
  [
    "learn-women-012",
    "women",
    "history",
    "Hz. Ebû Bekir döneminde bir araya getirilen mushaf nüshası daha sonra hangi kadın sahâbînin yanında korunmuştur?",
    "Hafsa bint Ömer",
    [
      "Ümmü Süleym",
      "Rukıyye",
      "Sümeyye"
    ],
    "https://islamansiklopedisi.org.tr/hafsa",
    "Mushaf nüshalarının Hafsa'ya intikali",
    "Hz. Ömer'in vefatından sonra mushaf nüshası kızı Hafsa'nın yanında korunmuş, Hz. Osman'ın çoğaltma çalışmasında kullanılmıştır.",
    "hafsa-mushaf",
    "medium"
  ],
  [
    "learn-women-013",
    "women",
    "history",
    "Hz. Hatice'nin vefatından sonra Hz. Peygamber'in evlendiği hanım kimdir?",
    "Sevde bint Zem'a",
    [
      "Ümmü Habîbe",
      "Safiyye bint Huyey",
      "Meymûne"
    ],
    "https://islamansiklopedisi.org.tr/sevde",
    "Hz. Hatice'nin vefatı ardından evliliği",
    "Hz. Peygamber, Hz. Hatice'nin vefatından sonra Sevde bint Zem'a ile evlenmiştir.",
    "sawda-marriage",
    "medium"
  ],
  [
    "learn-women-014",
    "women",
    "history",
    "Sevde bint Zem'a ilk Müslümanlar arasında hangi ülkeye hicret etmiştir?",
    "Habeşistan",
    [
      "Endülüs",
      "Mısır",
      "İran"
    ],
    "https://islamansiklopedisi.org.tr/sevde",
    "Habeşistan hicreti",
    "Sevde bint Zem'a, ilk eşi Sekrân b. Amr ile birlikte Habeşistan'a hicret etmiştir.",
    "sawda-hijra",
    "medium"
  ],
  [
    "learn-women-015",
    "women",
    "history",
    "Ümmü Habîbe'nin babası olarak bilinen Kureyşli kişi kimdir?",
    "Ebû Süfyân",
    [
      "Ebû Tâlib",
      "Ebû Bekir",
      "Abbas"
    ],
    "https://islamansiklopedisi.org.tr/ummu-habibe",
    "Aile kökeni, Ebû Süfyân'ın kızı",
    "Ümmü Habîbe, Ebû Süfyân'ın kızıdır; asıl adı Remle'dir.",
    "umm-habiba-father",
    "easy"
  ],
  [
    "learn-women-016",
    "women",
    "history",
    "Ümmü Habîbe Müslümanların erken dönem hicretlerinde nereye gitmiştir?",
    "Habeşistan'a",
    [
      "Horasan'a",
      "Endülüs'e",
      "Bağdat'a"
    ],
    "https://islamansiklopedisi.org.tr/ummu-habibe",
    "Habeşistan'a göçü",
    "Ümmü Habîbe, ilk Müslümanlardan olup eşiyle Habeşistan'a hicret etmiştir.",
    "umm-habiba-hijra",
    "medium"
  ],
  [
    "learn-women-017",
    "women",
    "history",
    "Türkler arasında 'Hala Sultan' adıyla tanınan kadın sahâbî kimdir?",
    "Ümmü Harâm",
    [
      "Ümmü Süleym",
      "Şifâ bint Abdullah",
      "Rukıyye"
    ],
    "https://islamansiklopedisi.org.tr/ummu-haram",
    "Hala Sultan olarak tanınması",
    "Ümmü Harâm bint Milhân, halk arasında Hala Sultan olarak anılan kadın sahâbîdir.",
    "umm-haram-title",
    "easy"
  ],
  [
    "learn-women-018",
    "women",
    "history",
    "Ümmü Harâm'ın kız kardeşi olan kadın sahâbî kimdir?",
    "Ümmü Süleym",
    [
      "Ümmü Habîbe",
      "Meymûne",
      "Safiyye"
    ],
    "https://islamansiklopedisi.org.tr/ummu-haram",
    "Aile üyeleri ve Ümmü Süleym ile kardeşliği",
    "Ümmü Harâm, Enes b. Mâlik'in annesi Ümmü Süleym'in kardeşidir.",
    "umm-haram-sister",
    "medium"
  ],
  [
    "learn-women-019",
    "women",
    "history",
    "Hz. Peygamber'in hanımlarından el emeğiyle kazandıklarını fakirlere dağıtmasıyla tanınan kişi kimdir?",
    "Zeyneb bint Cahş",
    [
      "Sevde bint Zem'a",
      "Ümmü Külsûm",
      "Rukıyye"
    ],
    "https://islamansiklopedisi.org.tr/zeyneb-bint-cahs",
    "El işçiliği ve cömertliği",
    "Zeyneb bint Cahş el işçiliğine önem verir ve kazancını ihtiyaç sahipleriyle paylaşırdı.",
    "zaynab-charity",
    "medium"
  ],
  [
    "learn-women-020",
    "women",
    "history",
    "Zeyneb bint Cahş'ın annesi olup Hz. Peygamber'in halası olan kişi kimdir?",
    "Ümeyme bint Abdülmuttalib",
    [
      "Fâtıma bint Esed",
      "Hâcer",
      "Zeyneb bint Maz'ûn"
    ],
    "https://islamansiklopedisi.org.tr/zeyneb-bint-cahs",
    "Ailesi ve annesi Ümeyme",
    "Zeyneb bint Cahş'ın annesi Ümeyme bint Abdülmuttalib, Hz. Peygamber'in halasıdır.",
    "zaynab-mother",
    "hard"
  ],
  [
    "learn-women-021",
    "women",
    "history",
    "Hz. Peygamber'in kızı Rukıyye'nin evlendiği sahâbî kimdir?",
    "Hz. Osman",
    [
      "Hz. Ömer",
      "Hz. Ali",
      "Zübeyr b. Avvâm"
    ],
    "https://islamansiklopedisi.org.tr/rukiyye",
    "Osman b. Affân'la evlenmesi",
    "Hz. Rukıyye, Hz. Osman ile evlenmiş ve onunla birlikte hicret etmiştir.",
    "ruqayya-spouse",
    "easy"
  ],
  [
    "learn-women-022",
    "women",
    "history",
    "Rukıyye ile Hz. Osman'ın birlikte hicret ettiği ülke hangisidir?",
    "Habeşistan",
    [
      "Hindistan",
      "Horasan",
      "Endülüs"
    ],
    "https://islamansiklopedisi.org.tr/rukiyye",
    "Hz. Osman ile Habeşistan hicreti",
    "Rukıyye ve Hz. Osman, Mekke döneminde Habeşistan'a hicret eden Müslümanlar arasındadır.",
    "ruqayya-hijra",
    "medium"
  ],
  [
    "learn-women-023",
    "women",
    "history",
    "Hz. Peygamber'in kızlarından Rukıyye'nin vefatından sonra Hz. Osman ile evlenen kişi kimdir?",
    "Ümmü Külsûm",
    [
      "Sümeyye",
      "Ümmü Süleym",
      "Şifâ"
    ],
    "https://islamansiklopedisi.org.tr/ummu-kulsum",
    "Hz. Osman ile evliliği",
    "Hz. Peygamber'in kızı Ümmü Külsûm, ablası Rukıyye'nin ardından Hz. Osman'la evlenmiştir.",
    "umm-kulsum-marriage",
    "medium"
  ],
  [
    "learn-women-024",
    "women",
    "history",
    "Hz. Peygamber'in eşi Cüveyriye'nin mensup olduğu kabile grubu hangisidir?",
    "Benî Mustalik",
    [
      "Evs",
      "Benî Nadîr",
      "Sakīf"
    ],
    "https://islamansiklopedisi.org.tr/cuveyriye-bint-haris",
    "Mustalikoğulları'na mensup olması",
    "Cüveyriye bint Hâris, Benî Mustalik reisi Hâris b. Ebû Dırâr'ın kızıdır.",
    "juwayriya-tribe",
    "medium"
  ],
  [
    "learn-women-025",
    "women",
    "history",
    "Cüveyriye bint Hâris'in Müslüman olmadan önceki adı hangisidir?",
    "Berre",
    [
      "Rümeysâ",
      "Leylâ",
      "Habîbe"
    ],
    "https://islamansiklopedisi.org.tr/cuveyriye-bint-haris",
    "Eski adı Berre, adının değiştirilmesi",
    "Cüveyriye'nin daha önceki adı Berre idi; Hz. Peygamber kendisine Cüveyriye adını vermiştir.",
    "juwayriya-name",
    "hard"
  ],
  [
    "learn-women-026",
    "women",
    "history",
    "Safiyye bint Huyey'in babası hangi kabile topluluğunun ileri gelenlerindendi?",
    "Benî Nadîr",
    [
      "Benî Temîm",
      "Evs",
      "Benî Sakīf"
    ],
    "https://islamansiklopedisi.org.tr/safiyye",
    "Babası Huyey b. Ahtab'ın Benî Nadîr reisi olması",
    "Safiyye'nin babası Huyey b. Ahtab, Benî Nadîr'in reisiydi.",
    "safiyya-family",
    "hard"
  ],
  [
    "learn-women-027",
    "women",
    "history",
    "Hz. Peygamber'in son evlendiği hanım olarak bilinen kişi kimdir?",
    "Meymûne bint Hâris",
    [
      "Hafsa bint Ömer",
      "Rukıyye",
      "Şifâ bint Abdullah"
    ],
    "https://islamansiklopedisi.org.tr/meymune",
    "Son evliliği",
    "Meymûne bint Hâris, Hz. Peygamber'in son olarak evlendiği hanımıdır.",
    "maymuna-last",
    "medium"
  ],
  [
    "learn-women-028",
    "women",
    "history",
    "Meymûne bint Hâris'in önceki ismi hangisidir?",
    "Berre",
    [
      "Leylâ",
      "Rümeysâ",
      "Remle"
    ],
    "https://islamansiklopedisi.org.tr/meymune",
    "Eski ismi Berre",
    "Meymûne'nin eski adı Berre idi; Hz. Peygamber bu ismi Meymûne olarak değiştirdi.",
    "maymuna-name",
    "hard"
  ],
  [
    "learn-women-029",
    "women",
    "history",
    "Hudeybiye'den sonra ailesi olmadan Mekke'den Medine'ye hicret eden kadın sahâbî kimdir?",
    "Ümmü Külsûm bint Ukbe",
    [
      "Şifâ bint Abdullah",
      "Sevde bint Zem'a",
      "Cüveyriye bint Hâris"
    ],
    "https://islamansiklopedisi.org.tr/ummu-kulsum-bint-ukbe",
    "Hudeybiye sonrası tek başına Medine'ye hicret",
    "Ümmü Külsûm bint Ukbe, Hudeybiye Antlaşması'ndan sonra ailesinden ayrı olarak Medine'ye hicret etmiştir.",
    "umm-ukba-hijra",
    "hard"
  ],
  [
    "learn-women-030",
    "women",
    "history",
    "Hafsa bint Ömer'e okuma yazma öğreten kadın sahâbî kimdir?",
    "Şifâ bint Abdullah",
    [
      "Sümeyye bint Hubbât",
      "Sevde bint Zem'a",
      "Cüveyriye bint Hâris"
    ],
    "https://islamansiklopedisi.org.tr/sifa-bint-abdullah",
    "Hafsa'ya okuma yazma öğretmesi",
    "Şifâ bint Abdullah, okuma yazma bilen kadın sahâbîlerdendi ve Hafsa'ya okuma yazma öğretti.",
    "shifa-literacy",
    "medium"
  ]
];
export const learningMoreDraftQuestionsV2: readonly Question[] = rows.map((r): Question => {
 const [id, , categoryId, question, correct, wrong, url, locator, explanation, conceptGroup, difficulty] = r;
 return {id,version:1,categoryId,difficulty,question,
 options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],
 correctOptionId:"o2",explanation,
 sources:[{title:url.startsWith("https://kuran.diyanet.gov.tr/")?"Diyanet Kur'an Yolu":"TDV İslâm Ansiklopedisi",
 publisher:url.startsWith("https://kuran.diyanet.gov.tr/")?"Diyanet İşleri Başkanlığı":"TDV İslâm Araştırmaları Merkezi",
 url,locator,supports:explanation,checkStatus:"unverified"}],
 reviewStatus:"draft",reviewNotes:"Yeni soru taslağı; kaynak ayrıntısı, benzerlik, bağımsız dinî editör ve yayın onayı bekleniyor.",updatedAt:"2026-10-20",conceptGroup};
});
