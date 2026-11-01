// Real web UI, fresh guest storage only. No hosted account or API mutation.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ??
    join(process.env.RUNNER_TEMP, "visual-node/node_modules/playwright"),
);
const origin = process.env.SETTINGS_ORIGIN ?? "http://127.0.0.1:8184";
const root = process.env.BANK_SCREENSHOTS ?? "artifacts/canonical-bank";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROME_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROME_PATH }
    : {}),
  ...(process.env.SETTINGS_BROWSER_CHANNEL
    ? { channel: process.env.SETTINGS_BROWSER_CHANNEL }
    : {}),
});
const checks = [];
try {
  for (const width of [320, 360, 390])
    for (const theme of ["light", "dark"]) {
      const ctx = await browser.newContext({
        viewport: { width, height: 844 },
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      // Prove offline solo play: fail closed on any remote service call.
      await ctx.route("**/*", (route) =>
        new URL(route.request().url()).origin === origin
          ? route.continue()
          : route.abort(),
      );
      const p = await ctx.newPage();
      await p.goto(
        origin + "/prepare?playCategory=quran_dualar&difficulty=easy",
      );
      await p.getByRole("button", { name: "Oyuna Başla", exact: true }).click();
      // Observe every DOM commit, including transient states between final answer,
      // local save and route replacement, rather than only the eventual result.
      await p.evaluate(() => {
        window.__emptyGameFlashes = [];
        const observer = new MutationObserver(() => {
          for (const prompt of [
            "Yeni bir tura hazır mısın?",
            "Yeni bir sonuç için yeni bir tur!",
          ])
            if (document.body.innerText.includes(prompt))
              window.__emptyGameFlashes.push(prompt);
        });
        observer.observe(document.body, { childList: true, subtree: true });
      });
      for (let i = 1; i <= 10; i++) {
        await p.getByText(`Soru ${i} / 10`, { exact: true }).waitFor();
        await p.getByLabel("Kalan süre 20 saniye", { exact: true }).waitFor();
        if (i === 1) {
          await p.evaluate(() => document.fonts.ready);
          assert(
            await p.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
          );
          await p.screenshot({
            path: join(root, `v73-quiz-${width}-${theme}.png`),
          });
        }
        await p.getByRole("button", { name: /^A\. / }).click();
      }
      await p
        .getByText("Sonucun bu cihazda kaydedildi. ✓", { exact: true })
        .waitFor();
      assert.deepEqual(
        await p.evaluate(() => window.__emptyGameFlashes),
        [],
        "The final answer must lead to results without an empty-game prompt",
      );
      const data = await p.evaluate(() =>
        JSON.parse(localStorage.getItem("@anla-ezberle-quiz/progress/v1")),
      );
      const game = data.games[0];
      assert.equal(game.bankVersion, 73);
      assert.equal(game.questionIds.length, 10);
      assert.equal(new Set(game.questionIds).size, 10);
      assert(
        game.questionIds.every(
          (id) => !/^e150-quran-0[0-2][0-9]$|^e150-quran-030$/.test(id),
        ),
      );
      await p.screenshot({
        path: join(root, `v73-result-${width}-${theme}.png`),
      });
      await p.reload();
      assert.deepEqual(
        await p.evaluate(
          () =>
            JSON.parse(localStorage.getItem("@anla-ezberle-quiz/progress/v1"))
              .games,
        ),
        data.games,
      );
      checks.push({
        width,
        theme,
        bankVersion: 73,
        questions: 10,
        savedAndReloaded: true,
        timerStartsAt20: true,
        emptyGameFlashes: 0,
      });
      await ctx.close();
    }
  await writeFile(
    join(root, "results.json"),
    JSON.stringify(
      { checks, hostedWrites: false, physicalDeviceTest: false },
      null,
      2,
    ),
  );
  console.log(
    `PASS ${checks.length} real Chromium offline v73 rounds, saved history/reload and light/dark screenshots.`,
  );
} finally {
  await browser.close();
}
