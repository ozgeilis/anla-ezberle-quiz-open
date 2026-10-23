import type { Question } from "../../content/questions/model";
import { v72MeaningFactKey } from "./meaning-facts-v72";
import { sourceAuditConceptKey } from "../../content/questions/source-audit-concepts-v1";
// Farklı ID'lerin aynı bilgiyi tekrar sormasını ve çok benzer şablonları
// bir turda peş peşe getirmesini engelleyen ek seçim anahtarları.
// Bu yalnız yeni tur seçiminde kullanılır; eski kayıtların soru/cevapları değişmez.
export function selectionConceptKeys(
  q: Pick<Question, "id" | "question" | "conceptGroup" | "categoryId">,
): string[] {
  const prompt = q.question.normalize("NFKC").toLocaleLowerCase("tr-TR");
  const normalizedText = prompt.replace(/[\s\p{P}\p{S}]+/gu, " ").trim();
  const keys = [`concept:${q.conceptGroup}`, `text:${normalizedText}`];
  if (
    [
      "v12-general-003",
      "quran-meaning-v72-021",
      "quran-meaning-v72-022",
    ].includes(q.id)
  )
    keys.push("template:passage-isra-26-27");
  const meaningKey = v72MeaningFactKey(q.id);
  if (meaningKey) keys.push(meaningKey);
  const sourceAuditKey = sourceAuditConceptKey(q.id);
  if (sourceAuditKey) keys.push(sourceAuditKey);
  if (q.categoryId === "quran") {
    if (/suresi kaç [âa]yetten oluşur/u.test(prompt)) {
      keys.push("template:surah-verse-count");
    }
    if (/^mushaf sıralamasında .+ s[ûu]re hangisidir/u.test(prompt)) {
      keys.push("template:surah-mushaf-order");
    }
  }
  if (
    prompt.includes("muhammed") &&
    prompt.includes("ilk vahy") &&
    prompt.includes("yer")
  ) {
    keys.push("fact:first-revelation-place");
  }
  if (
    (prompt.startsWith("mekke,") || prompt.startsWith("medine şehri")) &&
    prompt.includes("hangi") &&
    prompt.includes("bölge")
  ) {
    keys.push("template:city-region");
  }
  return keys;
}
