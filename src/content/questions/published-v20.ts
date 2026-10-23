import type { Question } from "./model";
import type { LearningTopicId } from "./learning-topics-v1";
/** Six newly reviewed user-supplied candidate facts, TDV verified 2026-10-20.
 * Source verification does not substitute for independent scholarly/age review.
 * Other user200 candidates remain unpublished.
 */
type Row = readonly [string,string,string,readonly [string,string,string],string,string,string,string,Question["difficulty"]];
const rows: readonly Row[] = [
  [
    "user200-103",
    "Ahlâk terimi olarak 'sıdk' neyi ifade eder?",
    "Niyette, sözde ve davranışta doğruluğu",
    [
      "İnsanlar hakkında asılsız konuşmayı",
      "Yalnız maddî yardımda bulunmayı",
      "Öfkeliyken intikam almayı"
    ],
    "https://islamansiklopedisi.org.tr/sidk",
    "TDV SIDK: terim tanımı",
    "Sıdk, sözün gerçeğe uygun olmasının yanında niyette ve davranışta dürüstlüğü de içerir; yalanın karşıtı bir ahlâk erdemidir.",
    "ahlak-sidk",
    "easy"
  ],
  [
    "user200-106",
    "İftira ile kastedilen ahlâkî yanlış davranış hangisidir?",
    "Birine işlemediği suçu asılsız olarak yüklemek",
    [
      "Birine teşekkür etmek",
      "Doğru bir bilgiyi araştırarak paylaşmak",
      "Bir hatayı sahibine nazikçe söylemek"
    ],
    "https://islamansiklopedisi.org.tr/iftira",
    "TDV İFTİRA: tanım ve başkasına asılsız isnat",
    "İftira, bir kimseye gerçekte işlemediği bir suç, günah veya kusuru isnat etmektir. Gıybetten farklı olarak iddia asılsızdır.",
    "ahlak-iftira",
    "medium"
  ],
  [
    "user200-107",
    "Bir başkasının sahip olduğu nimetin elinden gitmesini istemeye ne ad verilir?",
    "Haset",
    [
      "Tevekkül",
      "Şükür",
      "İstişare"
    ],
    "https://islamansiklopedisi.org.tr/haset",
    "TDV HASET: başkasının nimetinden mahrum olmasını isteme",
    "Haset, bir başkasının sahip olduğu nimeti çekememek ve o nimetten mahrum olmasını istemektir; yalnızca iyiye özenmekten ayrılır.",
    "ahlak-haset",
    "medium"
  ],
  [
    "user200-115",
    "İslam ahlakında 'sıla-i rahim' hangi davranışla ilgilidir?",
    "Akrabalık bağlarını korumak ve yakınları gözetmek",
    [
      "Yalnız bayramlarda hediye almak",
      "Yalnız ticaret ortaklarıyla görüşmek",
      "Yabancılardan daima uzak durmak"
    ],
    "https://islamansiklopedisi.org.tr/sila-i-rahim",
    "TDV SILA-i RAHİM: akrabalık bağlarını sürdürme",
    "Sıla-i rahim, yakınlarla ilişkiyi sürdürmek, haklarını gözetmek, ziyaret etmek ve gerektiğinde yardımlaşmak anlamındadır.",
    "ahlak-akrabalik",
    "easy"
  ],
  [
    "user200-118",
    "Ahlâk literatüründe 'tebzîr' özellikle hangi harcama davranışını anlatır?",
    "Malı yanlış veya meşru olmayan yerlere harcamak",
    [
      "İhtiyaç sahiplerine ölçülü yardım etmek",
      "Gerektiğinde tasarruf etmek",
      "Helâl kazancın hesabını tutmak"
    ],
    "https://islamansiklopedisi.org.tr/israf",
    "TDV İSRAF: tebzîr ve israf farkı (Mâverdî)",
    "TDV İSRAF maddesinde aktarılan ayırıma göre israf ölçüsüz harcamayla, tebzîr ise parayı miktarından bağımsız olarak uygunsuz yerlere harcamayla ilgilidir.",
    "ahlak-tebzir",
    "hard"
  ],
  [
    "user200-119",
    "'Hilim' erdemini gösteren bir kişi öfkelendiğinde nasıl davranır?",
    "Öfkesini denetleyip vakarını ve yumuşaklığını korur",
    [
      "Öfkesini başkalarından çıkarmaya çalışır",
      "Kendisini kızdırana hemen intikamla karşılık verir",
      "Karşısındakini dinlemeyi tamamen bırakır"
    ],
    "https://islamansiklopedisi.org.tr/hilim",
    "TDV HİLİM: öfke anında itidal ve sükûnet",
    "Hilim; sabır, ağırbaşlılık ve öfkeye hâkimiyet gibi tutumları birleştirir. Gücü varken bağışlayabilmek bu erdemin örneklerindendir.",
    "ahlak-hilim",
    "medium"
  ]
];
export const publishedNewQuestionTopicsV20: Readonly<Record<string,LearningTopicId>> =
 Object.freeze(Object.fromEntries(rows.map(q=>[q[0],"ahlak" as const])));
export const publishedNewQuestionsV20: readonly Question[] = rows.map(row=>{
 const [id,question,correct,wrong,url,locator,explanation,conceptGroup,difficulty]=row;
 return {
  id,version:1,categoryId:"general",difficulty,question,
  options:[{id:"o1",text:wrong[0]},{id:"o2",text:correct},{id:"o3",text:wrong[1]},{id:"o4",text:wrong[2]}],
  correctOptionId:"o2",explanation,conceptGroup,
  sources:[{title:"TDV İslâm Ansiklopedisi",publisher:"TDV İslâm Araştırmaları Merkezi",url,locator,supports:explanation,checkStatus:"supported",checkedAt:"2026-10-20"}],
  reviewStatus:"approved",
  reviewNotes:"20.10.2026: 200 kullanıcı adayından seçildi; anlam, dört şık, TDV tanımı ve v19 banka tekrarları ayrıca kontrol edildi. Bağımsız ilahiyat / çocuk eğitimi onayı değildir.",
  updatedAt:"2026-10-20",
 };
});
