import type { Question } from "../src/content/questions/model";
import { bankV13 } from "../src/content/questions/archive/bank-v13";

export const ONLINE_OWNER_SCOPE = "owner_approved_v13";
const optionIds = ["a", "b", "c", "d"] as const;

const quoteSql = (value: string): string => "'" + value.replaceAll("'", "''") + "'";
const quoteJson = (value: unknown) => quoteSql(JSON.stringify(value)) + "::jsonb";
const normalized = (value: string) =>
  value.normalize("NFKC").toLocaleLowerCase("tr-TR")
    .replace(/[\s\p{P}\p{S}]+/gu, " ").trim();

export interface OnlineContentRow {
  id: string;
  version: number;
  prompt: string;
  options: { id: "a" | "b" | "c" | "d"; text: string }[];
  contentScope: typeof ONLINE_OWNER_SCOPE;
  correctOptionId: "a" | "b" | "c" | "d";
  explanation: string;
  categoryId: Question["categoryId"];
}

export function buildOnlineContentRows(bank: readonly Question[] = bankV13): OnlineContentRow[] {
  if (bank.length !== 500) throw new Error(`Expected exactly 500 source-linked questions; got ${bank.length}`);
  const ids = new Set<string>(), prompts = new Set<string>();
  const rows = bank.map((q): OnlineContentRow => {
    if (!q.id || ids.has(q.id)) throw new Error(`Duplicate question ID: ${q.id}`);
    ids.add(q.id);
    const prompt = normalized(q.question);
    if (prompt.length < 8 || prompts.has(prompt)) throw new Error(`Duplicate or empty question: ${q.id}`);
    prompts.add(prompt);
    if (q.reviewStatus !== "approved" || q.reviewedAt || q.sources.length < 1 ||
        q.sources.some(s => s.checkStatus !== "supported" || !s.url.startsWith("https://") || !s.locator)) {
      throw new Error(`Source/conditional-approval gate failed for ${q.id}`);
    }
    if (q.options.length !== 4 || !Number.isSafeInteger(q.version) || q.version < 1 ||
        q.explanation.trim().length < 20) throw new Error(`Invalid question shape: ${q.id}`);
    const order = q.options.map(option => option.id);
    if (new Set(order).size !== 4 || new Set(q.options.map(o => normalized(o.text))).size !== 4)
      throw new Error(`Invalid options for ${q.id}`);
    const answerIndex = order.indexOf(q.correctOptionId);
    if (answerIndex < 0) throw new Error(`Missing answer key for ${q.id}`);
    return {
      id: q.id,
      version: q.version,
      prompt: q.question,
      options: q.options.map((option, i) => ({ id: optionIds[i]!, text: option.text })),
      contentScope: ONLINE_OWNER_SCOPE,
      correctOptionId: optionIds[answerIndex]!,
      explanation: q.explanation,
      categoryId: q.categoryId,
    };
  });
  const counts = new Map<string, number>();
  for (const row of rows) counts.set(row.categoryId, (counts.get(row.categoryId) ?? 0) + 1);
  for (const cat of ["quran", "prophets", "history", "general"]) {
    if ((counts.get(cat) ?? 0) < 100) throw new Error(`Category ${cat} insufficient for balanced online play`);
  }
  return rows;
}

// Generates a transaction only; it is NEVER automatically deployed or seeded.
// A private operator must apply this SQL to the explicitly authorized closed-dev DB.
export function buildOnlineSeedSql(rows: readonly OnlineContentRow[]): string {
  if (rows.length !== 500 || new Set(rows.map(r => r.id)).size !== 500)
    throw new Error("Incomplete 500-question batch");
  const entries = rows.map(row => "  (" + [
    quoteSql(row.id), String(row.version), quoteSql(row.prompt), quoteJson(row.options),
    quoteSql(row.contentScope), quoteSql(row.correctOptionId), quoteSql(row.explanation),
  ].join(", ") + ")").join(",\n");
  return `-- v13 500-source-question staging only; this DOES NOT enable online use.
-- Requires migration 20261019000200_online_content_v13.sql.
-- Store this generated file OUTSIDE the repository and never expose its answer key.
BEGIN;
CREATE TEMP TABLE _online_v13_import (
  id text NOT NULL, version integer NOT NULL, prompt text NOT NULL, options jsonb NOT NULL,
  content_scope text NOT NULL, correct_option_id text NOT NULL, explanation text NOT NULL,
  PRIMARY KEY (id, version)
) ON COMMIT DROP;
INSERT INTO _online_v13_import VALUES
${entries};
DO $guard$
BEGIN
  IF (SELECT count(*) FROM _online_v13_import) <> 500 OR
     (SELECT count(*) FROM _online_v13_import WHERE content_scope = 'owner_approved_v13') <> 500 THEN
    RAISE EXCEPTION 'Incomplete v13 content input';
  END IF;
  IF EXISTS (
    SELECT 1 FROM _online_v13_import i
    JOIN quiz_private.quiz_questions q USING (id,version)
    WHERE q.prompt IS DISTINCT FROM i.prompt OR q.options IS DISTINCT FROM i.options
       OR q.content_scope IS DISTINCT FROM i.content_scope
  ) OR EXISTS (
    SELECT 1 FROM _online_v13_import i
    JOIN quiz_private.quiz_answer_keys k ON k.question_id=i.id AND k.question_version=i.version
    WHERE k.correct_option_id IS DISTINCT FROM i.correct_option_id
       OR k.explanation IS DISTINCT FROM i.explanation
  ) THEN RAISE EXCEPTION 'Immutable question/version conflict; do not overwrite existing rows';
  END IF;
END $guard$;
INSERT INTO quiz_private.quiz_questions(id,version,prompt,options,content_scope)
SELECT id,version,prompt,options,content_scope FROM _online_v13_import ON CONFLICT DO NOTHING;
INSERT INTO quiz_private.quiz_answer_keys(question_id,question_version,correct_option_id,explanation)
SELECT id,version,correct_option_id,explanation FROM _online_v13_import ON CONFLICT DO NOTHING;
DO $verify$
BEGIN
  IF (SELECT count(*) FROM quiz_private.quiz_questions WHERE content_scope='owner_approved_v13') <> 500
     OR (SELECT count(*) FROM quiz_private.quiz_questions q
         JOIN quiz_private.quiz_answer_keys k ON k.question_id=q.id AND k.question_version=q.version
         WHERE q.content_scope='owner_approved_v13') <> 500 THEN
    RAISE EXCEPTION 'v13 seed count or answer keys inconsistent';
  END IF;
END $verify$;
COMMIT;
`;
}
