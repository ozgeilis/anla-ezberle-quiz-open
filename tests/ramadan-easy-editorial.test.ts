import assert from "node:assert/strict";
import { test } from "node:test";
import { questions } from "../src/content/questions";
import { learningThemeSetsV1 } from "../src/content/questions/learning-topics-v1";
import {
  assessDifficultyRound,
  selectDifficultyQuestions,
  selectionConceptKeys,
} from "../src/domain/game/engine";
import {
  ramadanCitationSuggestionsV1,
  ramadanEasyShortlistV1,
} from "../src/content/questions/ramadan-easy-editorial-v1";

test("Ramadan editorial shortlist finds 10 technical independent options without unlocking a category", () => {
  const bank = new Map(questions.map((question) => [question.id, question]));
  const historical = learningThemeSetsV1.find((item) => item.id === "ramazan")!;
  assert.equal(historical.publicationStatus, "draft");
  assert.equal(ramadanEasyShortlistV1.publicationStatus, "draft");
  assert.equal(ramadanEasyShortlistV1.level, "easy");
  assert.equal(new Set(ramadanEasyShortlistV1.questionIds).size, ramadanEasyShortlistV1.questionIds.length);
  const extraIds = ramadanEasyShortlistV1.questionIds
    .filter((id) => !historical.existingQuestionIds.includes(id));
  assert.deepEqual(extraIds, ["v7-quran-004", "v11-quran-005"]);
  const eligible = ramadanEasyShortlistV1.questionIds.map((id) => {
    const question = bank.get(id);
    assert.ok(question, `Missing source question: ${id}`);
    assert.equal(question.reviewStatus, "approved");
    assert.equal(question.difficulty, "easy");
    assert.ok(question.sources.length > 0);
    return question;
  });
  const status = assessDifficultyRound(eligible, "easy");
  assert.equal(status.eligibleCount, 11);
  assert.equal(status.canStart, true);
  const selected = selectDifficultyQuestions(eligible, "easy", [], () => 0.5);
  assert.equal(selected.length, 10);
  assert.equal(new Set(selected.map((q) => q.id)).size, 10);
  const keys = selected.flatMap(selectionConceptKeys);
  assert.equal(new Set(keys).size, keys.length, "Selection must respect legacy concept conflict keys");
  // This is a selection feasibility test, not a themed gameplay route or signoff.
});

test("Suggested deep links remain separate from frozen question records", () => {
  const ids = new Set(questions.map((q) => q.id));
  for (const [id, url] of Object.entries(ramadanCitationSuggestionsV1)) {
    assert.ok(ids.has(id));
    assert.ok(/^https:\/\/(kuran\.diyanet\.gov\.tr|islamansiklopedisi\.org\.tr)\//.test(url));
  }
  assert.equal(questions.length, 1500);
});
