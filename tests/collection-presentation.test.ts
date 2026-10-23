import assert from "node:assert/strict";
import { test } from "node:test";
import { achievements } from "../src/domain/achievements/evaluate";
import {
  badgePresentation,
  badgeProgressCaption,
} from "../src/features/achievements/presentation";
import { collection } from "../src/theme/collection";

function luminance(hex: string) {
  const c = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return c[0]! * 0.2126 + c[1]! * 0.7152 + c[2]! * 0.0722;
}
function contrast(a: string, b: string) {
  const l = [luminance(a), luminance(b)].sort((a, b) => a - b);
  return (l[1]! + 0.05) / (l[0]! + 0.05);
}
test("unpublished seasonal, account-gated and playable locked badges have distinct honest visual labels", () => {
  const badges = achievements([]),
    before = JSON.stringify(badges);
  for (const b of badges) {
    const state = badgePresentation(b);
    assert.equal(state.label, b.group === "seasonal" ? "Yakında" : "Kilitli");
    assert.equal(badgePresentation({ ...b, earned: true }).label, "Kazanıldı");
    if (b.group === "seasonal")
      assert.equal(
        badgeProgressCaption({
          ...b,
          goals: b.goals.map((g) => ({ ...g, value: g.target })),
        }),
        "Bu set açıldığında başlayacak.",
      );
    else
      assert.equal(
        badgeProgressCaption(b),
        b.goals.map((g) => `${g.value}/${g.target}`).join(" · "),
      );
  }
  assert.equal(JSON.stringify(badges), before);
  assert.equal(
    badges.filter((b) => badgePresentation(b).label === "Yakında").length,
    18,
  );
});
test("jewel card text and all state chips meet AA across every gradient endpoint", () => {
  for (const surface of [...collection.card, ...collection.earnedCard])
    for (const text of [collection.text, collection.secondary])
      assert(contrast(text, surface) >= 4.5);
  assert(contrast(collection.ice, collection.locked) >= 4.5);
  assert(contrast(collection.gold, collection.earned) >= 4.5);
  assert(contrast(collection.darkInk, collection.gold) >= 4.5);
});
