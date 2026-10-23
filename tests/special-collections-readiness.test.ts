import assert from "node:assert/strict";
import { test } from "node:test";
import { questions } from "../src/content/questions";
import { learningThemeSetsV1 } from "../src/content/questions/learning-topics-v1";
import { assessDifficultyRound } from "../src/domain/game/engine";
import { preparationFromParams } from "../src/features/categories/preparation";

test("special sets are editorial manifests, never automatically playable or treated as published", () => {
  const pool = new Map(questions.map((q) => [q.id, q]));
  const ids = new Set<string>();
  for (const manifest of learningThemeSetsV1) {
    assert.equal(manifest.publicationStatus, "draft");
    assert.equal(preparationFromParams({ topic: manifest.id }).topic, undefined);
    assert.equal(new Set(manifest.existingQuestionIds).size, manifest.existingQuestionIds.length);
    for (const id of manifest.existingQuestionIds) {
      assert.ok(pool.has(id), `${manifest.id}: unknown bank ID ${id}`);
      ids.add(id);
    }
    // Feasibility must always be calculated with the real selector, including
    // duplicate concepts and the requested level; never infer from raw counts.
    const eligible = manifest.existingQuestionIds
      .map((id) => pool.get(id)!)
      .filter((q) =>
        q.reviewStatus === "approved" &&
        q.sources.length > 0 &&
        q.sources.every((source) => source.checkStatus === "supported"),
      );
    for (const level of ["easy", "medium", "hard"] as const) {
      const status = assessDifficultyRound(eligible, level);
      if (status.eligibleCount < 10) assert.equal(status.canStart, false);
    }
  }
  assert.ok(ids.size > 0);
  assert.ok(learningThemeSetsV1.find((set) => set.id === "ramazan"));
});

test("Ramazan source metadata is reviewed independently of publishing status", () => {
  const set = learningThemeSetsV1.find((value) => value.id === "ramazan")!;
  assert.equal(set.existingQuestionIds.length, 24);
  const existing = new Map(questions.map((q) => [q.id, q]));
  for (const id of set.existingQuestionIds) {
    const q = existing.get(id)!;
    assert.ok(q.sources.length > 0, `${id}: source references missing`);
    for (const source of q.sources) {
      assert.ok(source.url.startsWith("https://"), `${id}: source URL malformed`);
      assert.ok(source.locator.length > 0, `${id}: source locator missing`);
    }
  }
  // Metadata is a lead for a human reviewer, not proof of theological accuracy.
  assert.equal(set.publicationStatus, "draft");
});
