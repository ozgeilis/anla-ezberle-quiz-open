import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
/**
 * Twelve newly source-checked Quranic questions for the versioned bank v16.
 * Primary Diyanet ayat or tefsir was checked on 2026-10-20. This is editorial
 * source verification, NOT independent academic/theological certification.
 * Bank v15 and older catalogs remain byte-for-byte unchanged.
 */
type Row = readonly [string, Question["categoryId"], string, string, readonly [string,string,string], string, string, string, string, Question["difficulty"], LearningTopicId];
const rows: readonly Row[] = [
  [
    "learn-dua-001",
    "general",
    "Bakara 2/201'deki duada hangi iki hayat için iyilik istenir?",
    "Dünya ve âhiret",
    [
      "Yalnız dünya",
      "Yalnız âhiret",
      "Sadece geçmiş"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/Bakara-suresi/207/200-202-ayet-tefsiri",
    "Bakara 2/201",
    "Bakara 2/201'de hem dünya hem âhiret iyiliği ve cehennem azabından korunma dilenir.",
    "dua-world-afterlife",
    "easy",
    "dualar"
  ],
  [
    "learn-dua-002",
    "general",
    "Âl-i İmrân 3/8'deki duada Allah'tan kalpler için ne istenir?",
    "Doğru yoldan sapmamak",
    [
      "Zenginlikte yarışmak",
      "Herkesten üstün olmak",
      "Dünyevî makam kazanmak"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-meal-1/al-i-imran-suresi-3/ayet-7/diyanet-isleri-baskanligi-meali-1",
    "Âl-i İmrân 3/8",
    "Âl-i İmrân 3/8'de iman edenler doğru yola eriştirildikten sonra kalplerinin saptırılmamasını ve rahmet verilmesini ister.",
    "dua-steadfast-heart",
    "medium",
    "dualar"
  ],
  [
    "learn-dua-003",
    "general",
    "A‘râf 7/23'te Hz. Âdem ile Havvâ'nın duasında öne çıkan istek hangisidir?",
    "Bağışlanma ve merhamet",
    [
      "Mülk ve servet",
      "Uzun yolculuk",
      "İnsanlardan övgü"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/A%27r%C3%A2f-suresi/977/22-25-ayet-tefsiri",
    "A‘râf 7/23",
    "Hz. Âdem ve Havvâ hatalarını kabul ederek Allah'tan bağışlanma ve merhamet dilerler.",
    "dua-adam-repentance",
    "easy",
    "dualar"
  ],
  [
    "learn-dua-007",
    "general",
    "Furkân 25/74'teki duada eşler ve çocuklar için ne istenir?",
    "Göz aydınlığı olmaları",
    [
      "Sürekli seyahat etmeleri",
      "Herkesten zengin olmaları",
      "Hiç büyümemeleri"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-meal-1/furkan-suresi-25/ayet-72/diyanet-isleri-baskanligi-meali-1",
    "Furkân 25/74",
    "Furkân 25/74'te eş ve çocukların göz aydınlığı olması ve takvâ sahiplerine öncülük edecek güzel bir aile hayatı dilenir.",
    "dua-family",
    "easy",
    "dualar"
  ],
  [
    "learn-dua-008",
    "general",
    "Haşr 59/10'daki duada önceki müminlere karşı kalpte ne bulunmaması istenir?",
    "Kin ve kötü duygu",
    [
      "Sevgi",
      "Merhamet",
      "Kardeşlik"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-meal-1/Ha%C5%9Fr-S%C3%BBresi-59/ayet-10/diyanet-isleri-baskanligi-meali-1",
    "Haşr 59/10",
    "Haşr 59/10'da hem önceki müminlerin bağışlanması hem de iman edenlere karşı kalpte kin bulunmaması dilenir.",
    "dua-no-rancor",
    "easy",
    "dualar"
  ],
  [
    "learn-dua-009",
    "general",
    "Bakara 2/286'daki duada insanın gücüyle ilgili hangi istek yer alır?",
    "Gücünün yetmediği yükle yükümlü tutulmamak",
    [
      "Daha ağır yükler istemek",
      "Tüm sınavlardan kaçmak",
      "Dünyevî başarıyı garanti etmek"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-tefsir-1/Bakara-S%C3%BBresi-2/ayet-283/diyanet-isleri-baskanligi-meali-1",
    "Bakara 2/286",
    "Bakara 2/286'da insanın gücünü aşan yükten korunma, affedilme ve merhamet istenir.",
    "dua-beyond-capacity",
    "medium",
    "dualar"
  ],
  [
    "learn-dua-010",
    "general",
    "Mü’minûn sûresi 23/118 hangi istekle son bulur?",
    "Bağışlanma ve merhamet",
    [
      "Maddi üstünlük",
      "Dünyevî övgü",
      "Uzun yolculuk"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/M%C3%BC%27min%C3%BBn-suresi/2791/118-ayet-tefsiri",
    "Mü’minûn 23/118",
    "Mü’minûn sûresinin son âyetinde Rabbinden bağışlama ve merhamet istenmesi öğretilir.",
    "dua-mercy-muminun",
    "medium",
    "dualar"
  ],
  [
    "learn-dua-013",
    "general",
    "Bakara 2/250'deki duada Allah'tan ne istenir?",
    "Sabır ve sebat",
    [
      "Zenginlik",
      "Ün ve şöhret",
      "Yeni şehirler"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=249&mode=tefsir&sure=2",
    "Bakara 2/250",
    "Bakara 2/250'de Allah'tan sabır ve ayakların sağlam durması dilenir.",
    "dua-sabr-sebat",
    "easy",
    "dualar"
  ],
  [
    "learn-dua-024",
    "general",
    "Kehf 18/10'da mağaraya sığınan gençler ne ister?",
    "Rahmet ve doğru yol",
    [
      "Hazine",
      "Ordu",
      "Yeni ev"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-tefsir-1/kehf-suresi-18/ayet-9/diyanet-isleri-baskanligi-meali-1",
    "Kehf 18/10",
    "Kehf 18/10'da gençler Allah'tan rahmet ve doğru yol diler.",
    "dua-ashab-kehf",
    "easy",
    "dualar"
  ],
  [
    "learn-akaid-009",
    "quran",
    "Mü’minûn 23/115 insanın yaratılmasıyla ilgili hangi yanlış düşünceyi eleştirir?",
    "Amaçsız yaratıldığını sanmak",
    [
      "Sorumlu olmayı",
      "İyilik yapmayı",
      "Öğrenmeyi"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-meal-1/muminun-suresi-23/ayet-105/diyanet-isleri-baskanligi-meali-1",
    "Mü’minûn 23/115",
    "Mü’minûn 23/115 insanın boş yere yaratıldığı düşüncesini reddeder.",
    "iman-yaratis-amac",
    "medium",
    "akaid"
  ],
  [
    "learn-akaid-012",
    "quran",
    "Fussilet 41/30'da 'Rabbimiz Allah'tır' deyip dosdoğru olanlara kimlerin indiği anlatılır?",
    "Meleklerin",
    [
      "Tüccarların",
      "Kavim liderlerinin",
      "Yolcuların"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=30&mode=tefsir&sure=41",
    "Fussilet 41/30",
    "Fussilet 41/30'da dosdoğru olanlara meleklerin indiği anlatılır.",
    "iman-istikamet",
    "hard",
    "akaid"
  ],
  [
    "learn-akaid-019",
    "quran",
    "İhlâs 112/2'de Allah hangi isimle anılır?",
    "Samed",
    [
      "Rahip",
      "Müderris",
      "Hükümdar"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/%C4%B0hl%C3%A2s-suresi/6223/2-ayet-tefsiri",
    "İhlâs 112/2",
    "İhlâs 112/2'de Allah 'Samed' olarak nitelendirilir.",
    "iman-ihlas-samed",
    "hard",
    "akaid"
  ]
];
export const publishedNewQuestionTopicsV16: Readonly<Record<string,LearningTopicId>> =
  Object.freeze(Object.fromEntries(rows.map(r => [r[0],r[10]])));
export const publishedNewQuestionsV16: readonly Question[] = rows.map(row=>{
  const [id,categoryId,question,correct,wrong,url,locator,explanation,conceptGroup,difficulty]=row;
  return {
    id,version:1,categoryId,difficulty,question,
    options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],
    correctOptionId:"o2",explanation,conceptGroup,
    sources:[{title:"Diyanet Kur’an Yolu",publisher:"Diyanet İşleri Başkanlığı",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],
    reviewStatus:"approved",
    reviewNotes:"20.10.2026: Ayet metni Diyanet meali/tefsiri üzerinden doğrudan kontrol edildi; kullanıcı doğrulanmış yeni soruların yayına alınmasını istedi. Bağımsız dinî uzman veya çocuk eğitimi değerlendirmesi değildir.",
    updatedAt:"2026-10-20",
  };
});
