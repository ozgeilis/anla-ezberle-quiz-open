// Isolated browser acceptance against a local exported bundle, no live accounts.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, extname, join, sep } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(
  join(process.env.RUNNER_TEMP, "visual-node/node_modules/playwright"),
);
const { questions } = require("../src/content/questions/index.ts");
const byText = new Map(questions.map((q) => [q.question, q]));
const byId = new Map(questions.map((q) => [q.id, q]));
const output = resolve("artifacts/quick-play");
await mkdir(output, { recursive: true });
const dist = resolve("dist");
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".ttf": "font/ttf",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
};
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const target = resolve(dist, "." + pathname);
    if (target !== dist && !target.startsWith(dist + sep)) {
      res.writeHead(403).end();
      return;
    }
    const file = extname(pathname) ? target : join(dist, "index.html");
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] ?? "application/octet-stream",
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const checks = [];
try {
  for (const width of [320, 390])
    for (const theme of ["light", "dark"]) {
      const ctx = await browser.newContext({
        viewport: { width, height: 844 },
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      // Offline guest acceptance. Only this local exported application can load.
      await ctx.route("**/*", (r) =>
        new URL(r.request().url()).origin === origin ? r.continue() : r.abort(),
      );
      const p = await ctx.newPage(),
        errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto(origin);
      const quick = p.getByRole("button", {
        name: "Hemen Oyna, kategorilerden karışık 10 soru",
        exact: true,
      });
      await quick.waitFor();
      await p.evaluate(() => document.fonts.ready);
      assert.ok(
        await p
          .getByRole("button", { name: "Kategori ve zorluk seç", exact: true })
          .isVisible(),
      );
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      const box = await quick.boundingBox();
      assert.ok(
        box.y + box.height <= 844,
        "Quick play must fit on the first screen",
      );
      await p.screenshot({ path: join(output, `home-${width}-${theme}.png`) });
      await quick.click();
      await p.waitForURL((url) => url.pathname === "/quiz");
      const seen = [];
      const completeRound = async (easyCount, capture = false) => {
        for (let i = 1; i <= 10; i++) {
          await p.getByText(`Soru ${i} / 10`, { exact: true }).waitFor();
          await p.getByLabel("Kalan süre 20 saniye", { exact: true }).waitFor();
          const stem = (await p.getByRole("heading").allTextContents()).find(
            (s) => byText.has(s),
          );
          const q = byText.get(stem);
          assert.ok(q, "Rendered question must come from the current bank");
          assert.equal(q.difficulty, i <= easyCount ? "easy" : "medium");
          assert.ok(!seen.includes(q.id));
          seen.push(q.id);
          if (capture && i === 1)
            await p.screenshot({
              path: join(output, `quiz-${width}-${theme}.png`),
            });
          const answer = q.options.find((o) => o.id === q.correctOptionId).text;
          const choices = await p
            .getByRole("button", { name: /^[ABCD]\. / })
            .all();
          let clicked = false;
          for (const choice of choices) {
            if ((await choice.getAttribute("aria-label")).slice(3) === answer) {
              await choice.click();
              clicked = true;
              break;
            }
          }
          assert.ok(clicked, "The actual keyed answer must be selectable");
        }
        await p
          .getByText("Sonucun bu cihazda kaydedildi. ✓", { exact: true })
          .waitFor();
      };
      await completeRound(10, true);
      await p.screenshot({
        path: join(output, `result-${width}-${theme}.png`),
      });
      let before = await p.evaluate(() =>
        JSON.parse(localStorage.getItem("@anla-ezberle-quiz/progress/v1")),
      );
      assert.equal(before.games.length, 1);
      const game = before.games[0];
      assert.equal(game.bankVersion, 74);
      assert.equal(game.quickPlay, true);
      assert.equal(
        new Set(game.questionIds.map((id) => byId.get(id).categoryId)).size,
        4,
      );
      assert.deepEqual(game.questionIds, seen);
      assert.equal(game.answers.length, 10);
      if (width === 390 && theme === "light") {
        await p
          .getByRole("button", { name: "Tekrar Oyna", exact: true })
          .click();
        await p.waitForURL((url) => url.pathname === "/quiz");
        await completeRound(9);
        before = await p.evaluate(() =>
          JSON.parse(localStorage.getItem("@anla-ezberle-quiz/progress/v1")),
        );
        assert.equal(before.games.length, 2);
        assert.equal(before.games[1].quickPlay, true);
        assert.equal(new Set(seen).size, 20);
      }
      // Reload is a real provider/storage restoration, never a mocked navigation.
      await p.goto(origin);
      await quick.waitFor();
      const restored = await p.evaluate(() =>
        JSON.parse(localStorage.getItem("@anla-ezberle-quiz/progress/v1")),
      );
      assert.deepEqual(restored, before);
      await p
        .getByRole("button", { name: "Kategori ve zorluk seç", exact: true })
        .click();
      await p.waitForURL((url) => url.pathname === "/categories");
      await p
        .getByRole("heading", { name: "Kategoriler", exact: true })
        .waitFor();
      assert.deepEqual(errors, []);
      checks.push({
        width,
        theme,
        questionCount: 10,
        categories: 4,
        beginnerEasyCount: 10,
        saveAndReload: true,
        categoryChoiceRetained: true,
      });
      await ctx.close();
    }
  await writeFile(
    join(output, "acceptance.json"),
    JSON.stringify(
      {
        passed: true,
        liveAccounts: false,
        remoteRequestsBlocked: true,
        checks,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS actual browser: one-tap mixed v74, 20s, four categories, easy first round, results, save/reload and category navigation at 320/390 light/dark",
  );
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
