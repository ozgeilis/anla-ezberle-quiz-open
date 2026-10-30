import type { Question } from "../src/content/questions/model";
import { questions, BANK_VERSION } from "../src/content/questions";
import { questionsV72 } from "../src/content/questions/questions-v72";
import { questionsV73 } from "../src/content/questions/questions-v73";
import { selectionConceptKeys } from "../src/domain/game/engine";

export const ONLINE_OWNER_SCOPE = `bank-v${BANK_VERSION}`;
const releasedBanks = { 72: questionsV72, 73: questionsV73 } as const;
export type ExportBankVersion = keyof typeof releasedBanks;
// Explicit old-release export supports immutable replay tests and rollback staging.
// New games always use BANK_VERSION; arbitrary candidate collections are rejected.
export const canonicalBankForExport = (
  version: ExportBankVersion = BANK_VERSION,
) => releasedBanks[version];
const optionIds = ["a", "b", "c", "d"] as const;

const quoteSql = (value: string): string =>
  "'" + value.replaceAll("'", "''") + "'";
const quoteJson = (value: unknown) =>
  quoteSql(JSON.stringify(value)) + "::jsonb";
const normalized = (value: string) =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase("tr-TR")
    .replace(/[\s\p{P}\p{S}]+/gu, " ")
    .trim();

export interface OnlineContentRow {
  id: string;
  version: number;
  prompt: string;
  options: { id: "a" | "b" | "c" | "d"; text: string }[];
  contentScope: `bank-v${ExportBankVersion}`;
  correctOptionId: "a" | "b" | "c" | "d";
  explanation: string;
  categoryId: Question["categoryId"];
  metadata: Question;
  keys: string[];
}

export function buildOnlineContentRows(
  bank: readonly Question[] = questions,
  bankVersion: ExportBankVersion = BANK_VERSION,
): OnlineContentRow[] {
  const expected = canonicalBankForExport(bankVersion);
  if (!expected) throw new Error("Unknown canonical server release");
  if (bank.length !== 1500)
    throw new Error(
      `Expected exactly 1500 source-linked questions; got ${bank.length}`,
    );
  const ids = new Set<string>(),
    prompts = new Set<string>();
  const rows = bank.map((q): OnlineContentRow => {
    if (!q.id || ids.has(q.id))
      throw new Error(`Duplicate question ID: ${q.id}`);
    ids.add(q.id);
    const prompt = normalized(q.question);
    if (prompt.length < 8 || prompts.has(prompt))
      throw new Error(`Duplicate or empty question: ${q.id}`);
    prompts.add(prompt);
    if (
      q.reviewStatus !== "approved" ||
      q.sources.length < 1 ||
      q.sources.some(
        (s) =>
          s.checkStatus !== "supported" ||
          !s.url.startsWith("https://") ||
          !s.locator,
      )
    ) {
      throw new Error(`Source/conditional-approval gate failed for ${q.id}`);
    }
    if (
      q.options.length !== 4 ||
      !Number.isSafeInteger(q.version) ||
      q.version < 1 ||
      q.explanation.trim().length < 20
    )
      throw new Error(`Invalid question shape: ${q.id}`);
    const order = q.options.map((option) => option.id);
    if (
      new Set(order).size !== 4 ||
      new Set(q.options.map((o) => normalized(o.text))).size !== 4
    )
      throw new Error(`Invalid options for ${q.id}`);
    const answerIndex = order.indexOf(q.correctOptionId);
    if (answerIndex < 0) throw new Error(`Missing answer key for ${q.id}`);
    return {
      id: q.id,
      version: q.version,
      prompt: q.question,
      options: q.options.map((option, i) => ({
        id: optionIds[i]!,
        text: option.text,
      })),
      contentScope: `bank-v${bankVersion}`,
      correctOptionId: optionIds[answerIndex]!,
      explanation: q.explanation,
      categoryId: q.categoryId,
      metadata: q,
      keys: [`id:${q.id}`, ...selectionConceptKeys(q)],
    };
  });
  const counts = new Map<string, number>();
  for (const row of rows)
    counts.set(row.categoryId, (counts.get(row.categoryId) ?? 0) + 1);
  for (const cat of ["quran", "prophets", "history", "general"]) {
    if ((counts.get(cat) ?? 0) < 100)
      throw new Error(`Category ${cat} insufficient for balanced online play`);
  }
  if (JSON.stringify(bank) !== JSON.stringify(expected))
    throw new Error("Only the exact approved canonical release may be staged");
  return rows;
}

// Generates a transaction only; it is NEVER automatically deployed or seeded.
// A private operator must apply this SQL to the explicitly authorized closed-dev DB.
export function buildOnlineSeedSql(
  rows: readonly OnlineContentRow[],
  bankVersion: ExportBankVersion = BANK_VERSION,
): string {
  if (rows.length !== 1500 || new Set(rows.map((r) => r.id)).size !== 1500)
    throw new Error("Incomplete 1500-question batch");
  if (
    JSON.stringify(rows) !==
    JSON.stringify(
      buildOnlineContentRows(canonicalBankForExport(bankVersion), bankVersion),
    )
  )
    throw new Error("Only canonical rows may be staged");
  const scope = `bank-v${bankVersion}`;
  const entries = rows
    .map(
      (row) =>
        "  (" +
        [
          quoteSql(row.id),
          String(row.version),
          quoteSql(row.prompt),
          quoteJson(row.options),
          quoteSql(row.contentScope),
          quoteSql(row.correctOptionId),
          quoteSql(row.explanation),
        ].join(", ") +
        ")",
    )
    .join(",\n");
  return `-- v${bankVersion} 1500-source-question staging only; this DOES NOT enable online use.
-- Requires canonical bank migrations through ${bankVersion === 73 ? "20261030000100_canonical_bank_v73.sql" : "20261027000100_canonical_bank_v72.sql"}.
-- Store this generated file OUTSIDE the repository and never expose its answer key.
BEGIN;
CREATE TEMP TABLE _canonical_import (
  id text NOT NULL, version integer NOT NULL, prompt text NOT NULL, options jsonb NOT NULL,
  content_scope text NOT NULL, correct_option_id text NOT NULL, explanation text NOT NULL,
  PRIMARY KEY (id, version)
) ON COMMIT DROP;
INSERT INTO _canonical_import VALUES
${entries};
DO $guard$
BEGIN
  IF (SELECT count(*) FROM _canonical_import) <> 1500 OR
     (SELECT count(*) FROM _canonical_import WHERE content_scope = ${quoteSql(scope)}) <> 1500 THEN
    RAISE EXCEPTION 'Incomplete canonical content input';
  END IF;
  IF EXISTS (
    SELECT 1 FROM _canonical_import i
    JOIN quiz_private.quiz_questions q USING (id,version)
    WHERE q.prompt IS DISTINCT FROM i.prompt OR q.options IS DISTINCT FROM i.options

  ) OR EXISTS (
    SELECT 1 FROM _canonical_import i
    JOIN quiz_private.quiz_answer_keys k ON k.question_id=i.id AND k.question_version=i.version
    WHERE k.correct_option_id IS DISTINCT FROM i.correct_option_id
       OR k.explanation IS DISTINCT FROM i.explanation
  ) THEN RAISE EXCEPTION 'Immutable question/version conflict; do not overwrite existing rows';
  END IF;
END $guard$;
INSERT INTO quiz_private.quiz_questions(id,version,prompt,options,content_scope)
SELECT id,version,prompt,options,content_scope FROM _canonical_import ON CONFLICT DO NOTHING;
INSERT INTO quiz_private.quiz_answer_keys(question_id,question_version,correct_option_id,explanation)
SELECT id,version,correct_option_id,explanation FROM _canonical_import ON CONFLICT DO NOTHING;
INSERT INTO quiz_private.online_bank_members(dataset,id,version,metadata,concept_keys) VALUES
${rows.map((r) => `(${quoteSql(scope)},${quoteSql(r.id)},${r.version},${quoteJson(r.metadata)},ARRAY[${r.keys.map(quoteSql).join(",")}])`).join(",\n")}
ON CONFLICT DO NOTHING;
SELECT quiz_private.validate_online_bank(${quoteSql(scope)});
COMMIT;
`;
}
