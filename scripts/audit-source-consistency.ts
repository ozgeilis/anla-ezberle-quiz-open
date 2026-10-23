import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { questions } from "../src/content/questions";
import type { Question } from "../src/content/questions/model";

// Static metadata screening is NOT external source-passage verification.
interface VerseSpan {
  surah: number;
  start: number;
  end: number;
}
const verseSpans = (text: string): VerseSpan[] =>
  [...text.matchAll(/(?<!\d)(\d{1,3})\s*\/\s*(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?(?!\d)/gu)]
    .map((m) => ({
      surah: Number(m[1]),
      start: Number(m[2]),
      end: Number(m[3] ?? m[2]),
    }))
    .filter((span) => span.start <= span.end && span.surah > 0);

const overlaps = (a: VerseSpan, b: VerseSpan): boolean =>
  a.surah === b.surah && a.start <= b.end && b.start <= a.end;

const diyanetUrlSpan = (url: string): VerseSpan | null => {
  if (!url.startsWith("https://kuran.diyanet.gov.tr/kuran?")) return null;
  const surah = /[?&]sure=(\d+)/.exec(url)?.[1];
  const verse = /[?&]ayet=(\d+)/.exec(url)?.[1];
  if (!surah || !verse) return null;
  return { surah: Number(surah), start: Number(verse), end: Number(verse) };
};

export interface SourceReviewRow {
  id: string;
  category: string;
  question: string;
  recordedCorrectAnswer: string;
  explanation: string;
  sourceUrls: string[];
  sourceLocators: string[];
  flags: string[];
  independentPassageVerification: "not-performed";
}

export interface SourceReviewLedger {
  bankVersion: 71;
  totalQuestions: number;
  totalSourceRecords: number;
  uniqueSourceUrls: number;
  copiedSupportMetadataRecords: number;
  questionsWithoutIndependentReviewTimestamp: number;
  citationUrlReferencesScreened: number;
  citationLocationMismatches: string[];
  citationUrlMismatches: string[];
  rows: SourceReviewRow[];
  limitations: string[];
}

export function sourceReviewLedger(items: readonly Question[]): SourceReviewLedger {
  const rows: SourceReviewRow[] = [];
  const uniqueUrls = new Set<string>();
  const citationLocationMismatches: string[] = [];
  const citationUrlMismatches: string[] = [];
  let totalSourceRecords = 0;
  let copiedSupportMetadataRecords = 0;
  let questionsWithoutIndependentReviewTimestamp = 0;
  let citationUrlReferencesScreened = 0;

  for (const q of items) {
    const answer = q.options.find((option) => option.id === q.correctOptionId)?.text ?? "";
    const flags: string[] = [];
    const questionRefs = verseSpans(q.question);
    if (!q.reviewedAt) questionsWithoutIndependentReviewTimestamp++;

    for (const source of q.sources) {
      totalSourceRecords++;
      uniqueUrls.add(source.url);
      if (source.supports === q.explanation) {
        copiedSupportMetadataRecords++;
        flags.push("support-metadata-copies-explanation");
      }

      const locatorRefs = verseSpans(source.locator);
      if (
        questionRefs.length &&
        locatorRefs.length &&
        !questionRefs.some((qRef) => locatorRefs.some((locRef) => overlaps(qRef, locRef)))
      ) {
        citationLocationMismatches.push(q.id);
        flags.push("question-vs-source-locator-reference-mismatch");
      }

      const urlRef = diyanetUrlSpan(source.url);
      if (urlRef && questionRefs.length) {
        citationUrlReferencesScreened++;
        if (!questionRefs.some((qRef) => overlaps(qRef, urlRef))) {
          citationUrlMismatches.push(q.id);
          flags.push("question-vs-diyanet-url-reference-mismatch");
        }
      }
    }
    rows.push({
      id: q.id,
      category: q.categoryId,
      question: q.question,
      recordedCorrectAnswer: answer,
      explanation: q.explanation,
      sourceUrls: q.sources.map((source) => source.url),
      sourceLocators: q.sources.map((source) => source.locator),
      flags: [...new Set(flags)],
      independentPassageVerification: "not-performed",
    });
  }

  return {
    bankVersion: 71,
    totalQuestions: items.length,
    totalSourceRecords,
    uniqueSourceUrls: uniqueUrls.size,
    copiedSupportMetadataRecords,
    questionsWithoutIndependentReviewTimestamp,
    citationUrlReferencesScreened,
    citationLocationMismatches: [...new Set(citationLocationMismatches)],
    citationUrlMismatches: [...new Set(citationUrlMismatches)],
    rows,
    limitations: [
      "All 1,500 records were inspected for metadata consistency only; not one record is independently certified by this script.",
      "A supported flag, source locator, or copied supports text does not prove the remote passage supports the answer.",
      "Verse range comparisons are syntactic and cannot establish whether the stated answer is religiously or historically correct.",
      "A missing reviewedAt timestamp does not prove a human never reviewed a question.",
      "Never edit archived banks or the generated canonical file to silence an audit; publish corrections through a new bank version.",
    ],
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = sourceReviewLedger(questions);
  const summary = process.argv.includes("--summary")
    ? { ...report, rows: undefined }
    : report;
  process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
}
