import assert from "node:assert/strict";
import { test } from "node:test";
import { bankV32 } from "../src/content/questions/archive/bank-v32";
import { bankV33 } from "../src/content/questions/archive/bank-v33";
import { publishedCorrectionsV33 } from "../src/content/questions/published-v33";
import { gameQuestion } from "../src/content/questions/registry";

test("v33 publishes 51 targeted source corrections on the same 600 IDs without changing old sessions", () => {
  assert.equal(bankV33.length, 600);
  assert.equal(publishedCorrectionsV33.length, 51);
  for (const [i, q] of bankV33.entries()) {
    const old = bankV32[i]!;
    assert.equal(q.id, old.id);
    assert.deepEqual(q.options, old.options);
    assert.equal(q.correctOptionId, old.correctOptionId);
    if (!publishedCorrectionsV33.includes(q)) {
      assert.equal(q, old);
      continue;
    }
    assert.equal(q.version, old.version + 1);
    assert.equal(q.reviewedAt, undefined);
    assert(q.sources.every((s) => !s.url.includes("/tefsir/sure/")));
    const optionOrders = { [q.id]: q.options.map((o) => o.id) };
    const historic = gameQuestion({ bankVersion: 32, optionOrders }, q.id)!;
    const current = gameQuestion({ bankVersion: 33, optionOrders }, q.id)!;
    assert.equal(historic.source.url, old.sources[0]!.url);
    assert.equal(current.source.url, q.sources[0]!.url);
    assert.equal(historic.correct, current.correct);
  }
});

test("verse-count nuances and Yusuf source targets preserve the meaning of each answer", () => {
  const find = (id: string) => bankV33.find((q) => q.id === id)!;
  assert.match(find("e150-quran-009").question, /Diyanet.*sayım/);
  assert.match(find("e150-quran-009").explanation, /205 veya 206/);
  assert.match(find("e150-quran-039").explanation, /Kûfî/);
  for (const q of publishedCorrectionsV33.filter((q) =>
    q.id.startsWith("e150-prophets-"),
  )) {
    const url = new URL(q.sources[0]!.url);
    assert.equal(url.searchParams.get("sure"), "12");
    assert(
      q.sources[0]!.locator.includes(`12/${url.searchParams.get("ayet")}`),
    );
    assert.match(q.sources[0]!.locator, /KURAN YOLU/);
  }
});
