import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
/** Independently compared with cited Diyanet Quran meal/tefsir 2026-10-20.
 * New verses check distinct Quranic facts; expert/pediatric review is separate.
 */
type Row = readonly [string,Question["categoryId"],LearningTopicId,string,string,readonly [string,string,string],string,string,string,string,Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "learn-dua-021",
    "general",
    "dualar",
    "Yûnus 10/85'te Hz. Mûsâ'ya inananlar zalimlerle ilgili ne diler?",
    "Zalimler için bir imtihan aracı olmamayı",
    [
      "Zalimlerin malına ortak olmayı",
      "Zalimlerin ordusuna katılmayı",
      "Zalimlerin yönetimini devralmayı"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/Y%C3%BBnus-suresi/1448/84-86-ayet-tefsiri",
    "Yûnus 10/85",
    "Bu âyette iman edenler Allah'a güvenip zalimler için bir imtihan aracı kılınmamayı diler; devamındaki âyette kurtuluş ister.",
    "dua-musaya-inananlar",
    "medium"
  ],
  [
    "learn-dua-023",
    "general",
    "dualar",
    "İsrâ 17/80'de öğretilen duada hangi iki işin doğrulukla gerçekleşmesi istenir?",
    "Bir yere giriş ve bir yerden çıkış",
    [
      "Yalnız alışveriş ve ticaret",
      "Uyuma ve uyanma",
      "Yeme ve içme"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/%C4%B0sr%C3%A2-suresi/2109/80-ayet-tefsiri",
    "İsrâ 17/80",
    "İsrâ 17/80'de doğru bir giriş ve doğru bir çıkış istenir. Tefsirde bunun hicretle ve işlere dürüstçe başlayıp bitirmeyle ilişkisi açıklanır.",
    "dua-giris-cikis",
    "medium"
  ],
  [
    "learn-dua-026",
    "general",
    "dualar",
    "Mü’minûn 23/29'da Hz. Nûh'un duasında nasıl bir yere inmeyi istemesi öğretilir?",
    "Bereketli bir yere",
    [
      "Yalnız tenha bir dağa",
      "Çok uzak bir kaleye",
      "Terk edilmiş bir şehre"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-meal-1/muminun-suresi-23/ayet-29/diyanet-isleri-baskanligi-meali-1",
    "Mü’minûn 23/29",
    "Bu âyetin duasında Allah'tan bereketli bir yere indirmesi istenir. Tefsir, duayı Hz. Nûh'un gemi yolculuğuyla ilişkilendirir.",
    "dua-konaklama",
    "medium"
  ],
  [
    "learn-dua-028",
    "general",
    "dualar",
    "Neml 27/19'da Hz. Süleyman kendisine ve anne babasına verilen nimetler için ne diler?",
    "Şükretmeyi ve iyi işler yapmayı",
    [
      "Daha kalabalık bir orduya sahip olmayı",
      "İnsanlardan sürekli övgü almayı",
      "Nimetlerin yalnız kendisine verilmesini"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/Neml-suresi/3178/19-ayet-tefsiri",
    "Neml 27/19",
    "Hz. Süleyman, kendisine ve anne babasına verilen nimetlere şükretmeye, Allah'ın hoşnut olacağı işler yapmaya ve iyi kullar arasına katılmaya yardım diler.",
    "dua-suleyman-sukur",
    "easy"
  ],
  [
    "learn-dua-029",
    "general",
    "dualar",
    "Kasas 28/24'te Hz. Mûsâ gölgeye çekildiğinde Allah'a hangi ihtiyacını bildirir?",
    "Allah'ın vereceği her hayra muhtaç olduğunu",
    [
      "Bir ordu kurmak istediğini",
      "Büyük bir gemi beklediğini",
      "Yeni bir saray istediğini"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/Kasas-suresi/3276/24-ayet-tefsiri",
    "Kasas 28/24",
    "Hz. Mûsâ, Medyen'de iki kadının hayvanlarını suladıktan sonra gölgeye çekilir ve Allah'ın kendisine vereceği her türlü hayra muhtaç olduğunu dile getirir.",
    "dua-musa-hayir",
    "medium"
  ],
  [
    "learn-dua-030",
    "general",
    "dualar",
    "Tahrîm 66/8'de müminler kendi nurları için hangi istekte bulunur?",
    "Nurlarının tamamlanmasını",
    [
      "Nurlarının gizlenmesini",
      "Nurlarının söndürülmesini",
      "Nurlarının ellerinden alınmasını"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-meal-2/tahrim-suresi-66/ayet-8/diyanet-isleri-baskanligi-meali-1",
    "Tahrîm 66/8",
    "Tahrîm 66/8'de müminlerin nurlarının tamamlanmasını ve bağışlanmayı istedikleri anlatılır. Âyet, içtenlikle tövbe çağrısıyla başlar.",
    "dua-nur-tamamlanma",
    "hard"
  ],
  [
    "learn-akaid-005",
    "quran",
    "akaid",
    "Kehf 18/110'da Hz. Muhammed'in insan oluşu ve vahiy hakkında ne bildirilir?",
    "Vahiy alan bir insan olduğu",
    [
      "Bir melek olduğu",
      "Bütün gaybı kendiliğinden bildiği",
      "İnsanlardan farklı bir ilah olduğu"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/Kehf-suresi/2250/110-ayet-tefsiri",
    "Kehf 18/110",
    "Bu âyette Hz. Muhammed'in insanlar gibi bir insan olduğu, kendisine Allah'ın birliği hakkında vahiy geldiği bildirilir.",
    "iman-peygamber-beser",
    "medium"
  ],
  [
    "learn-akaid-011",
    "quran",
    "akaid",
    "Fâtır 35/1'de Allah'ın elçileri olarak hangi varlıklar açıkça anılır?",
    "Melekler",
    [
      "Dağlar",
      "Yıldızlar",
      "Denizler"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/F%C3%A2t%C4%B1r-suresi/3661/1-4-ayet-tefsiri",
    "Fâtır 35/1",
    "Fâtır sûresinin ilk âyetinde Allah'ın melekleri elçiler kıldığı ve onları dilediği niteliklerde yarattığı ifade edilir.",
    "iman-melekler-elci",
    "medium"
  ],
  [
    "learn-akaid-013",
    "quran",
    "akaid",
    "Şûrâ 42/11 Allah'ın yaratılmışlara benzerliği hakkında ne söyler?",
    "O'nun benzerinin bulunmadığını",
    [
      "Yaratılanlarla aynı olduğunu",
      "Sadece bir yerde bulunduğunu",
      "Yalnız bir topluluğa ait olduğunu"
    ],
    "https://kuran.diyanet.gov.tr/mushaf/kuran-tefsir-1/%C5%9E%C3%BBr%C3%A2-S%C3%BBresi-42/ayet-11/diyanet-isleri-baskanligi-meali-1",
    "Şûrâ 42/11",
    "Şûrâ 42/11'de Allah'ın benzeri hiçbir şey olmadığı, O'nun işiten ve gören olduğu anlatılarak yaratılmışlarla özdeş tutulamayacağı vurgulanır.",
    "iman-tenzih-benzersiz",
    "medium"
  ],
  [
    "learn-akaid-014",
    "quran",
    "akaid",
    "Kâf 50/16 Allah'ın insanın hangi durumunu da bildiğini belirtir?",
    "İçinden geçirdiklerini",
    [
      "Yalnız yüksek sesle söylediklerini",
      "Yalnız yaptığı alışverişi",
      "Sadece doğum yerini"
    ],
    "https://kuran.diyanet.gov.tr/kuran?ayet=16&mode=tefsir&sure=50",
    "Kâf 50/16",
    "Kâf 50/16 Allah'ın insanı yarattığını, içinden geçirdiklerini bildiğini ve insana şah damarından daha yakın olduğunu bildirir.",
    "iman-ilim-gizli-dusunceler",
    "medium"
  ]
];
export const publishedNewQuestionTopicsV19: Readonly<Record<string,LearningTopicId>> =
 Object.freeze(Object.fromEntries(rows.map(row=>[row[0],row[2]])));
export const publishedNewQuestionsV19: readonly Question[] = rows.map(row=>{
 const [id,categoryId,,question,correct,wrong,url,locator,explanation,conceptGroup,difficulty]=row;
 return {
  id,version:1,categoryId,difficulty,question,
  options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],
  correctOptionId:"o2",explanation,conceptGroup,
  sources:[{title:"Diyanet Kur'an Yolu meal/tefsiri",publisher:"Diyanet İşleri Başkanlığı",
  url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],
  reviewStatus:"approved",
  reviewNotes:"20.10.2026: Diyanet kaynak metni okundu, açıklama ve farklı şıklar kontrol edildi; v18 bankasında aynı ayet olgusu aranarak tekrar tarandı. Bağımsız dinî uzman ve yaş grubu onayı değildir.",
  updatedAt:"2026-10-20"
 };
});
