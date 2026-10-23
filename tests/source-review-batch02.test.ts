import assert from "node:assert/strict";
import test from "node:test";
import { questions1500 as questions } from "../src/content/questions/questions-1500";
import evidence from "../docs/source-verification/evidence/v71-batch-02-0051-0100.json";

test("Diyanet 34 surah index records and 16 TDV readings verify v71 positions 51–100", () => {
  assert.equal(questions.length, 1500);
  assert.equal(evidence.count, 50);
  assert.equal(evidence.entries.length, 50);
  assert.equal(evidence.firstPosition, 51);
  assert.equal(evidence.lastPosition, 100);
  assert.equal(new Set(evidence.entries.map(e => e.id)).size, 50);
  const byMethod: Record<string, number> = {};
  for (const [i, row] of evidence.entries.entries()) {
    const question = questions[i + 50]!;
    assert.equal(row.position, i + 51);
    assert.equal(row.id, question.id);
    assert.equal(row.question, question.question);
    assert.equal(row.correctOptionId, question.correctOptionId);
    assert.equal(row.recordedCorrectAnswer, question.options.find(o => o.id === question.correctOptionId)?.text);
    assert.deepStrictEqual(row.options, question.options);
    assert.deepStrictEqual(row.originalSourceUrls, question.sources.map(s => s.url));
    assert.ok(row.sourceFinding.length > 30);
    assert.ok(row.directlyResearchedOfficialUrl.startsWith("https://"));
    assert.equal(row.conclusion, "supported-by-official-source");
    if (row.officialFihristEntry) {
      const e = row.officialFihristEntry;
      if (i % 2 === 0) assert.equal(row.recordedCorrectAnswer, String(e.verses));
      else assert.equal(
        row.recordedCorrectAnswer.toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]/gu, ""),
        e.name.toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]/gu, ""),
      );
    }
    byMethod[row.evidenceMode] = (byMethod[row.evidenceMode] ?? 0) + 1;
  }
  assert.deepStrictEqual(byMethod, evidence.methods);
  assert.deepStrictEqual(byMethod, {"tdv-article-content":16,"diyanet-published-quran-pdf-surah-index":34});
});
