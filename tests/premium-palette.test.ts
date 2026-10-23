import assert from "node:assert/strict";
import { test } from "node:test";
import {
  difficultyPalette,
  homePalette,
  themePalette,
} from "../src/theme/palette";

function luminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
}
function contrast(a: string, b: string) {
  const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (light! + 0.05) / (dark! + 0.05);
}

test("premium semantic text and selected states retain AA contrast in light and dark", () => {
  for (const dark of [false, true]) {
    const p = themePalette(dark);
    for (const surface of [
      p.background,
      p.card,
      p.panel,
      p.mintSurface,
      p.roseSurface,
      p.violetSurface,
    ]) {
      assert.ok(
        contrast(p.text, surface) >= 4.5,
        `${dark}: primary ${surface}`,
      );
      assert.ok(
        contrast(p.muted, surface) >= 4.5,
        `${dark}: secondary ${surface}`,
      );
    }
    assert.ok(contrast(p.goldInk, p.goldSurface) >= 4.5);
    assert.ok(contrast(p.success, p.mintSurface) >= 4.5);
    assert.ok(contrast(p.danger, p.roseSurface) >= 4.5);
  }
});

test("home pastel gradients and difficulty tones keep readable AA text in both themes", () => {
  for (const dark of [false, true]) {
    const home = homePalette(dark);
    for (const surface of home.score)
      assert.ok(contrast(home.scoreInk, surface) >= 4.5);
    for (const surface of home.badges)
      assert.ok(contrast(home.badgeInk, surface) >= 4.5);
    for (const surface of [home.plaqueLight, home.plaque, home.plaqueDeep])
      assert.ok(contrast("#FFFFFF", surface) >= 4.5);
    assert.ok(contrast(themePalette(dark).accent, home.nav) >= 4.5);
    for (const tone of ["easy", "medium", "hard"] as const) {
      const paint = difficultyPalette(tone, dark);
      for (const surface of paint.gradient) {
        assert.ok(
          contrast(paint.ink, surface) >= 4.5,
          `${tone}: label contrast`,
        );
        assert.ok(contrast(paint.icon, surface) >= 3, `${tone}: icon contrast`);
      }
    }
  }
});
