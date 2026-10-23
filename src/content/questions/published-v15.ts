import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
/**
 * Source-checked additions for v15; 31 IDs, without carrying the 69
 * unpublished candidates into the app bundle.
 * Facts were compared with TDV/Diyanet on 2026-10-20; the product owner
 * explicitly authorised publishing verified material to main.
 * Expert theological/child suitability certification is not claimed.
 */
type Row = readonly [
  string, Question["categoryId"], string, string,
  readonly [string,string,string], string, string,string,string,
  Question["difficulty"], LearningTopicId
];
const rows: readonly Row[] = [
  [
    "learn-women-002",
    "history",
    "Hz. Ebû Bekir'in kızı ve Hz. Âişe'nin baba bir ablası olan kadın sahâbî kimdir?",
    "Esmâ bint Ebû Bekir",
    [
      "Esmâ bint Umeys",
      "Ümmü Seleme",
      "Ümmü Umâre"
    ],
    "https://islamansiklopedisi.org.tr/esma-bint-ebu-bekir",
    "Giriş: aile bağları ve Hz. Âişe ile kardeşliği",
    "Esmâ bint Ebû Bekir, Hz. Ebû Bekir'in kızıdır. Hz. Âişe ile baba bir kardeştir; hicret hazırlıklarındaki yardımıyla da tanınır.",
    "women-esma-abu-bakr",
    "medium",
    "sahabe"
  ],
  [
    "learn-women-003",
    "history",
    "Hadis ve fıkıh öğretimiyle tanınan, çok sayıda öğrencinin kendisinden ders aldığı müminlerin annesi kimdir?",
    "Hz. Âişe",
    [
      "Ümmü Harâm",
      "Esmâ bint Umeys",
      "Sümeyye bint Hubbât"
    ],
    "https://islamansiklopedisi.org.tr/aise",
    "Medine'deki hadis ve fıkıh öğretimi ve kadın öğrencileri",
    "Hz. Âişe Medine'de hadis ve fıkıh alanlarında öğretim yapmış; hem sözlü hem mektupla gelen soruları cevaplamıştır.",
    "women-aisha",
    "medium",
    "sahabe"
  ],
  [
    "learn-women-004",
    "history",
    "Uhud Gazvesi'nde Hz. Peygamber'i korumasıyla tanınan kadın sahâbî kimdir?",
    "Ümmü Umâre (Nesîbe bint Kâ‘b)",
    [
      "Ümmü Süleym",
      "Fâtıma bint Kays",
      "Zeyneb bint Ebû Seleme"
    ],
    "https://islamansiklopedisi.org.tr/ummu-umare",
    "Uhud Savaşı ve Hz. Peygamber'i koruması",
    "Nesîbe bint Kâ‘b, Ümmü Umâre künyesiyle tanınır. Uhud'da Hz. Peygamber'i koruyan az sayıdaki sahâbîden biridir.",
    "women-ummu-umara",
    "medium",
    "sahabe"
  ],
  [
    "learn-women-005",
    "history",
    "Sahâbî Enes b. Mâlik'in annesi olan kadın sahâbî kimdir?",
    "Ümmü Süleym",
    [
      "Ümmü Seleme",
      "Hz. Hafsa",
      "Ümmü Umâre"
    ],
    "https://islamansiklopedisi.org.tr/ummu-suleym",
    "Hayatı: Enes b. Mâlik'in annesi olması ve hicret sonrası yaşamı",
    "Ümmü Süleym, Enes b. Mâlik'in annesidir. Medine'de oğlu Enes'i Hz. Peygamber'in hizmetine sunmuştur.",
    "women-ummu-sulaym",
    "easy",
    "sahabe"
  ],
  [
    "learn-women-006",
    "history",
    "İslâm'ın ilk kadın şehidi olarak anılan sahâbî kimdir?",
    "Sümeyye bint Hubbât",
    [
      "Esmâ bint Yezîd",
      "Ümmü Seleme",
      "Fâtıma bint Kays"
    ],
    "https://islamansiklopedisi.org.tr/sumeyye-bint-hubbat",
    "İlk Müslümanlar dönemi, şehid edilmesi",
    "Sümeyye bint Hubbât, Mekke'deki ilk Müslümanlardan olup İslâm tarihinde ilk kadın şehit olarak anılır.",
    "women-sumayya",
    "easy",
    "sahabe"
  ],
  [
    "learn-women-008",
    "history",
    "İlk eşi Ca‘fer b. Ebû Tâlib ile Habeşistan'a hicret eden kadın sahâbî kimdir?",
    "Esmâ bint Umeys",
    [
      "Esmâ bint Yezîd",
      "Sümeyye bint Hubbât",
      "Fâtıma bint Kays"
    ],
    "https://islamansiklopedisi.org.tr/esma-bint-umeys",
    "İlk eşi Ca‘fer ile Habeşistan hicreti",
    "Esmâ bint Umeys, Ca‘fer b. Ebû Tâlib'le evlenmiş ve onunla Habeşistan'a hicret etmiştir. Sonrasında Medine'ye dönmüştür.",
    "women-esma-umays",
    "medium",
    "sahabe"
  ],
  [
    "learn-women-010",
    "history",
    "Ümmü Seleme'nin kızı olup hadis rivayet eden kadın sahâbî kimdir?",
    "Zeyneb bint Ebû Seleme",
    [
      "Sümeyye bint Hubbât",
      "Ümmü Süleym",
      "Esmâ bint Yezîd"
    ],
    "https://islamansiklopedisi.org.tr/zeyneb-bint-ebu-seleme",
    "Aile bağı, hadis öğretimi ve rivayetleri",
    "Zeyneb bint Ebû Seleme, Ümmü Seleme'nin kızıdır. Rivayetleri hadis kaynaklarında yer alır ve ilmiyle tanınır.",
    "women-zaynab-abu-salama",
    "medium",
    "sahabe"
  ],
  [
    "learn-women-011",
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
    "kadın-sahabe-hafsa",
    "easy",
    "sahabe"
  ],
  [
    "learn-women-012",
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
    "kadın-sahabe-hafsa",
    "medium",
    "sahabe"
  ],
  [
    "learn-women-013",
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
    "kadın-sahabe-sevde",
    "medium",
    "sahabe"
  ],
  [
    "learn-women-014",
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
    "kadın-sahabe-sevde",
    "medium",
    "sahabe"
  ],
  [
    "learn-women-017",
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
    "kadın-sahabe-ummu-haram",
    "easy",
    "sahabe"
  ],
  [
    "learn-women-018",
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
    "kadın-sahabe-ummu-haram",
    "medium",
    "sahabe"
  ],
  [
    "learn-women-020",
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
    "hard",
    "sahabe"
  ],
  [
    "learn-women-021",
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
    "kadın-sahabe-rukiyye",
    "easy",
    "sahabe"
  ],
  [
    "learn-women-022",
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
    "kadın-sahabe-rukiyye",
    "medium",
    "sahabe"
  ],
  [
    "learn-women-023",
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
    "kadın-sahabe-ummu-kulsum",
    "medium",
    "sahabe"
  ],
  [
    "learn-women-029",
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
    "hard",
    "sahabe"
  ],
  [
    "learn-women-030",
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
    "medium",
    "sahabe"
  ],
  [
    "learn-dua-022",
    "general",
    "İsrâ 17/24 anne baba için hangi duayı öğütler?",
    "Onlara merhamet edilmesi",
    [
      "Her yere gitmeleri",
      "Daha çok ticaret",
      "Herkesçe övülmeleri"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/%C4%B0sr%C3%A2-suresi/2052/23-24-ayet-tefsiri",
    "İsrâ sûresi 17/24: ana baba için rahmet dileği",
    "İsrâ 17/24'te anne babaya merhamet edilmesi istenir.",
    "dua-parents",
    "easy",
    "dualar"
  ],
  [
    "learn-dua-025",
    "general",
    "Tâhâ 20/114'te hangi nimetin artırılması için dua edilir?",
    "İlim",
    [
      "Gümüş",
      "Hayvan sayısı",
      "Servet"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=114&mode=tefsir&sure=20",
    "20/114",
    "Tâhâ 20/114'te Allah'tan ilmi artırması istenir.",
    "dua-ilim",
    "easy",
    "dualar"
  ],
  [
    "learn-history-001",
    "history",
    "Kerbelâ Vak‘ası hangi Emevî halifesinin döneminde gerçekleşti?",
    "I. Yezîd",
    [
      "Muâviye",
      "Abdülmelik",
      "Ömer b. Abdülazîz"
    ],
    "https://islamansiklopedisi.org.tr/yezid-i",
    "Kerbelâ Vak‘ası, 10 Muharrem 61 (680)",
    "Kerbelâ 680'de I. Yezîd'in halifeliği döneminde meydana gelmiştir.",
    "hist-kerbela",
    "medium",
    "islam_tarihi"
  ],
  [
    "learn-history-002",
    "history",
    "Kerbelâ Vak‘ası hicrî takvimin hangi ayında gerçekleşmiştir?",
    "Muharrem",
    [
      "Ramazan",
      "Şevval",
      "Zilhicce"
    ],
    "https://islamansiklopedisi.org.tr/kerbela",
    "10 Muharrem 61 (680)",
    "Hz. Hüseyin ve beraberindekilerin şehit edilmesi 10 Muharrem 61 tarihinde olmuştur.",
    "hist-kerbela",
    "medium",
    "islam_tarihi"
  ],
  [
    "learn-history-003",
    "history",
    "1071 Malazgirt Savaşı'nda Büyük Selçuklu ordusunun komutanı kimdi?",
    "Sultan Alparslan",
    [
      "Tuğrul Bey",
      "Melikşah",
      "Nizâmülmülk"
    ],
    "https://islamansiklopedisi.org.tr/alparslan",
    "1071 Malazgirt seferi ve savaşı",
    "Büyük Selçuklu Sultanı Alparslan, Malazgirt Savaşı'nda ordusunu yönetmiştir.",
    "hist-malazgirt",
    "easy",
    "islam_tarihi"
  ],
  [
    "learn-history-004",
    "history",
    "Malazgirt Savaşı'nda Büyük Selçukluların karşısındaki devlet hangisiydi?",
    "Bizans İmparatorluğu",
    [
      "Sâsânî İmparatorluğu",
      "Emevî Devleti",
      "Abbâsî Devleti"
    ],
    "https://islamansiklopedisi.org.tr/malazgirt-muharebesi",
    "1071 yılında Bizans ile yapılan savaş",
    "Malazgirt Savaşı, Büyük Selçuklular ile Bizans İmparatorluğu arasında yapılmıştır.",
    "hist-malazgirt",
    "easy",
    "islam_tarihi"
  ],
  [
    "learn-history-005",
    "history",
    "Kutadgu Bilig adlı eser hangi müellife aittir?",
    "Yûsuf Has Hâcib",
    [
      "Kâşgarlı Mahmud",
      "İbn Haldûn",
      "Fârâbî"
    ],
    "https://islamansiklopedisi.org.tr/yusuf-has-hacib",
    "Kutadgu Bilig adlı eseri",
    "Yûsuf Has Hâcib, Kutadgu Bilig adlı Türkçe eseri kaleme almıştır.",
    "hist-kutadgu-author",
    "medium",
    "islam_tarihi"
  ],
  [
    "learn-history-006",
    "history",
    "Dîvânü Lugāti't-Türk adlı eserin yazarı kimdir?",
    "Kâşgarlı Mahmud",
    [
      "Yûsuf Has Hâcib",
      "Ali Kuşçu",
      "Kâtip Çelebi"
    ],
    "https://islamansiklopedisi.org.tr/kasgarli-mahmud",
    "Dîvânü Lugāti't-Türk'ün yazılması",
    "Kâşgarlı Mahmud, Türk dili ve kültürü açısından önemli olan Dîvânü Lugāti't-Türk'ü yazmıştır.",
    "hist-divan-lugat",
    "medium",
    "islam_tarihi"
  ],
  [
    "learn-history-007",
    "history",
    "Kudüs'ün 1187'de Haçlılardan geri alınması hangi hükümdarla ilişkilidir?",
    "Selâhaddîn-i Eyyûbî",
    [
      "Nûreddin Zengî",
      "Baybars",
      "Târık b. Ziyâd"
    ],
    "https://islamansiklopedisi.org.tr/selahaddin-i-eyyubi",
    "1187 yılında Kudüs'ün alınması",
    "Selâhaddîn-i Eyyûbî, 1187 yılında Kudüs'ü Haçlılardan geri almıştır.",
    "hist-selahaddin-1187",
    "easy",
    "islam_tarihi"
  ],
  [
    "learn-history-008",
    "history",
    "Hıttîn Savaşı'nın gerçekleştiği yıl hangisidir?",
    "1187",
    [
      "1099",
      "1258",
      "1453"
    ],
    "https://islamansiklopedisi.org.tr/hittin-savasi",
    "1187 Hıttîn Savaşı",
    "1187 Hıttîn Savaşı'nda Selâhaddîn'in ordusu Haçlı kuvvetlerini mağlûp etmiştir.",
    "hist-selahaddin-1187",
    "hard",
    "islam_tarihi"
  ],
  [
    "learn-history-009",
    "history",
    "Eyyûbîler hânedanının kurucusu kimdir?",
    "Selâhaddîn-i Eyyûbî",
    [
      "Muâviye",
      "Abbâs es-Seffâh",
      "Nizâmülmülk"
    ],
    "https://islamansiklopedisi.org.tr/eyyubiler",
    "Kuruluş tarihi ve Selâhaddîn",
    "Eyyûbîler hânedanı Selâhaddîn-i Eyyûbî ile özdeşleşen bir devlettir.",
    "hist-selahaddin-1187",
    "medium",
    "islam_tarihi"
  ],
  [
    "learn-history-010",
    "history",
    "Endülüs'te Nasrîler'in merkezi olan şehir hangisidir?",
    "Gırnata (Granada)",
    [
      "Kurtuba (Córdoba)",
      "İşbîliye (Sevilla)",
      "Toledo"
    ],
    "https://islamansiklopedisi.org.tr/nasriler",
    "Gırnata Emirliği",
    "Nasrîler'in merkezi Endülüs'te Gırnata şehriydi.",
    "hist-nasrid-granada",
    "medium",
    "islam_tarihi"
  ]
];
export const publishedNewQuestionTopicsV15: Readonly<Record<string,LearningTopicId>> =
  Object.freeze(Object.fromEntries(rows.map(r=>[r[0],r[10]])));
export const publishedNewQuestionsV15: readonly Question[] = rows.map(row => {
  const [id,categoryId,question,correct,wrong,url,locator,explanation,conceptGroup,difficulty]=row;
  const d=url.includes("diyanet.gov.tr");
  const sourceTitle=d ? "Diyanet Kur’an Yolu" : "TDV İslâm Ansiklopedisi";
  return {
    id, version:1, categoryId, difficulty, question,
    options:[
      {id:"o1",text:wrong[0]}, {id:"o2",text:correct},
      {id:"o3",text:wrong[1]}, {id:"o4",text:wrong[2]},
    ],
    correctOptionId:"o2", explanation, conceptGroup,
    sources:[{
      title:sourceTitle,
      publisher:d?"Diyanet İşleri Başkanlığı":"TDV İslâm Araştırmaları Merkezi",
      url, locator, supports:explanation,
      checkStatus:"supported", checkedAt:"2026-10-20",
    }],
    reviewStatus:"approved",
    reviewNotes:"20.10.2026: TDV/Diyanet kaynak karşılaştırması yapıldı; ürün sahibi kaynak denetiminden geçen soruları main'e almayı açıkça onayladı. Bağımsız dinî uzman veya çocuk eğitimi sertifikası iddiası yok.",
    updatedAt:"2026-10-20",
  };
});
