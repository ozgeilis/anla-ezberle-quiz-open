// Current catalog/preparation acceptance. Real bank + local games, no hosted writes.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(
  join(process.env.RUNNER_TEMP, "visual-node/node_modules/playwright"),
);
const origin = process.env.SETTINGS_ORIGIN ?? "http://127.0.0.1:8117";
const root = "artifacts/unified-categories-ui";
await mkdir(root, { recursive: true });
const bank = spawnSync(
  process.execPath,
  [
    "--import",
    "tsx",
    "-e",
    `import {availableQuestions} from './src/content/questions/index.ts'; import {playCategories,categoryPool} from './src/domain/game/play-categories.ts'; import {assessFreshRound} from './src/domain/game/engine.ts'; console.log(JSON.stringify(playCategories.map(c=>({id:c.id,title:c.title,available:Object.fromEntries(['easy','medium','hard'].map(d=>[d,assessFreshRound(categoryPool(availableQuestions,c.id),{difficulty:d}).canStart])),questions:categoryPool(availableQuestions,c.id).map(q=>({question:q.question,difficulty:q.difficulty}))}))));`,
  ],
  { encoding: "utf8" },
);
assert.equal(bank.status, 0);
const categories = JSON.parse(bank.stdout);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.SETTINGS_BROWSER_CHANNEL
    ? { channel: process.env.SETTINGS_BROWSER_CHANNEL }
    : {}),
});
const btn = (p, name) => p.getByRole("button", { name, exact: true });
let realStarts = 0;
try {
  for (const width of [320, 360, 390, 1024])
    for (const mode of ["light", "dark"]) {
      const ctx = await browser.newContext({
        viewport: { width, height: 844 },
        colorScheme: mode,
        reducedMotion: "reduce",
      });
      await ctx.route("https://**/*", (r) => r.abort());
      const p = await ctx.newPage();
      await p.goto(origin + "/categories", { waitUntil: "networkidle" });
      await p
        .getByRole("heading", { name: "Kategoriler", exact: true })
        .waitFor();
      const cards = categories.map((c) =>
        p
          .getByRole("radio", { name: new RegExp("^" + c.title + "\\.") })
          .or(
            p.getByRole("button", { name: new RegExp("^" + c.title + "\\.") }),
          ),
      );
      assert.equal(
        categories.reduce((sum, c) => sum + c.questions.length, 0),
        1500,
      );
      async function verifyCards(level) {
        for (let i = 0; i < cards.length; i++) {
          const label = await cards[i].getAttribute("aria-label");
          assert(
            !/\d[\d.,]*\s*soru/i.test(label),
            "No pool count in accessible name",
          );
          assert(
            !/\d[\d.,]*\s*soru/i.test(await cards[i].innerText()),
            "No visible pool count",
          );
          const playable = level
            ? categories[i].available[level]
            : Object.values(categories[i].available).some(Boolean);
          assert.equal(
            await cards[i].getAttribute("role"),
            playable ? "radio" : "button",
          );
          if (!playable)
            assert(
              label.includes("Seviye kapalı"),
              "Unavailable levels stay explicit",
            );
        }
      }
      await verifyCards();
      const boxes = await Promise.all(cards.map((c) => c.boundingBox()));
      assert(Math.abs(boxes[0].y - boxes[1].y) < 1);
      assert(boxes[0].x < boxes[1].x);
      await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: join(root, `${mode}-${width}-catalog.png`) });
      await btn(p, "Zorluğa göre filtrele").click();
      for (const [level, label] of [
        ["easy", "Kolay"],
        ["medium", "Orta"],
        ["hard", "Zor"],
      ]) {
        await p
          .getByRole("radio", { name: "Zorluk: " + label, exact: true })
          .click();
        await verifyCards(level);
      }
      await btn(p, "Tüm zorlukları göster").click();
      for (const title of [
        "Çocuklar İçin",
        "Hac Mevsimi",
        "Muharrem ve Aşure",
        "Ramazan",
        "Ramazan Bayramı",
        "Kadir Gecesi",
        "Kurban Bayramı",
        "Peygamberimizin Hayatı",
        "Kadın Sahabeler",
      ]) {
        const card = p.getByRole("button", {
          name: new RegExp("^" + title + "\\."),
        });
        await card.scrollIntoViewIfNeeded();
        const b = await card.boundingBox();
        assert(
          Math.abs(b.width - boxes[0].width) < 2 &&
            Math.abs(b.height - boxes[0].height) < 2,
          title + " consistent card size",
        );
        await card.click();
        const dialog = p.getByRole("dialog", { name: title, exact: true });
        await dialog.waitFor();
        assert.equal(
          await dialog
            .getByRole("button", { name: "Oyuna Başla", exact: true })
            .count(),
          0,
        );
        await btn(p, "Anladım").click();
        await card.screenshot({
          path: join(
            root,
            `${mode}-${width}-${title.replaceAll(" ", "-")}.png`,
          ),
        });
      }
      assert.equal(await p.getByTestId("category-start-panel").count(), 0);
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      await ctx.close();
    }
  // Every supported category and difficulty must start with an eligible real question.
  for (const c of categories)
    for (const level of ["easy", "medium", "hard"]) {
      const ctx = await browser.newContext({
        viewport: { width: 360, height: 844 },
        reducedMotion: "reduce",
      });
      await ctx.route("https://**/*", (r) => r.abort());
      const p = await ctx.newPage();
      await p.goto(
        origin + "/prepare?playCategory=" + c.id + "&difficulty=" + level,
        { waitUntil: "networkidle" },
      );
      if (!c.available[level]) {
        assert(
          await btn(p, "Oyuna Başla").isDisabled(),
          "Insufficient distinct-question pools remain closed",
        );
        await ctx.close();
        continue;
      }
      await btn(p, "Oyuna Başla").click();
      realStarts++;
      await p.getByText("Soru 1 / 10", { exact: true }).waitFor();
      const headings = await p.getByRole("heading").allTextContents();
      assert(
        c.questions.some(
          (q) => q.difficulty === level && headings.includes(q.question),
        ),
        c.title + " " + level + " eligible question",
      );
      await ctx.close();
    }
  const ctx = await browser.newContext({
    viewport: { width: 320, height: 844 },
  });
  await ctx.route("https://**/*", (r) => r.abort());
  await ctx.addInitScript(() =>
    localStorage.setItem("@anla-ezberle-quiz/progress/v1", "{broken-history"),
  );
  const p = await ctx.newPage();
  await p.goto(
    origin + "/categories?playCategory=quran_dualar&difficulty=easy",
    { waitUntil: "networkidle" },
  );
  await p
    .getByText(/Yerel kayıt okunamadı/)
    .first()
    .waitFor();
  assert(await btn(p, "Oyuna Başla").isDisabled());
  assert.equal(
    await p.evaluate(() =>
      localStorage.getItem("@anla-ezberle-quiz/progress/v1"),
    ),
    "{broken-history",
  );
  await ctx.close();
  await writeFile(
    join(root, "acceptance.json"),
    JSON.stringify(
      {
        passed: true,
        layoutGroups: 8,
        categoryDifficultyChecks: 18,
        realCategoryDifficultyStarts: realStarts,
        bankTotal: 1500,
        lockedCollections: 9,
        corruptHistoryPreserved: true,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS catalog: eight layouts, hidden pool counts and accurate availability for all difficulty filters, nine locked collections, 18 category/difficulty eligibility checks, corrupted history preserved.",
  );
} finally {
  await browser.close();
}
