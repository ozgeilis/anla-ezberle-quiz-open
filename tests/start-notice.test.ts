import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createStartNotice, START_NOTICE_MS } from "../src/storage/startNotice";

test("finished-questions notice clears itself after about three seconds", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const shown: (string | null)[] = [];
  const notice = createStartNotice((m) => shown.push(m));
  notice.show("Bu kategorideki yeni soruları tamamladın.");
  assert.equal(START_NOTICE_MS, 3_000);
  t.mock.timers.tick(START_NOTICE_MS - 1);
  assert.deepEqual(shown, ["Bu kategorideki yeni soruları tamamladın."]);
  t.mock.timers.tick(1);
  assert.deepEqual(shown.at(-1), null);
});

test("a new notice replaces the old one without a stale timer clearing it early", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let current: string | null = null;
  const notice = createStartNotice((m) => (current = m));
  notice.show("eski");
  t.mock.timers.tick(2_000);
  notice.show("yeni");
  t.mock.timers.tick(1_500);
  assert.equal(current, "yeni", "old timer must not clear the new notice");
  t.mock.timers.tick(1_500);
  assert.equal(current, null);
});

test("selection change, navigation or a new game clear it immediately; unmount cancels", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const shown: (string | null)[] = [];
  const notice = createStartNotice((m) => shown.push(m));
  notice.show("uyarı");
  notice.clear();
  assert.equal(shown.at(-1), null);
  t.mock.timers.tick(START_NOTICE_MS * 2);
  assert.equal(shown.length, 2, "no late callback after clear");
  notice.show("uyarı");
  notice.dispose();
  t.mock.timers.tick(START_NOTICE_MS * 2);
  assert.equal(
    shown.at(-1),
    "uyarı",
    "disposed timer never fires after unmount",
  );
});

test("the global banner is wired to clear on route and difficulty change and never blocks taps", () => {
  const banner = readFileSync("src/components/ui/index.tsx", "utf8");
  assert.match(
    banner,
    /useEffect\(\(\) => clearStartError\(\), \[path, clearStartError\]\)/,
  );
  assert.match(banner, /pointerEvents=\{storageError \? "auto" : "none"\}/);
  const prep = readFileSync(
    "src/features/categories/PreparationScreen.tsx",
    "utf8",
  );
  assert.match(prep, /setAttempted\(false\);\s*clearStartError\(\);/);
  const provider = readFileSync("src/storage/GameProvider.tsx", "utf8");
  assert.equal(provider.includes("setStartError(\n"), false);
  assert.match(
    provider,
    /startNotice\.clear\(\);\s*delete created\.questionOpenedAt/,
  );
});
