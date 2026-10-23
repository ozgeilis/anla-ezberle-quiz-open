// Isolated CI browser: anonymous local state only, with all remote requests blocked.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";

export async function homePolishSmoke(browser, root, baseline = false) {
  await mkdir(root, { recursive: true });
  const widths = [320, 375, 390, 430, 1024, 1440];
  for (const colorScheme of ["light", "dark"]) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: width >= 1024 ? 900 : 844 },
        colorScheme,
        reducedMotion: "reduce",
      });
      await context.route("https://**/*", (route) => route.abort());
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("http://127.0.0.1:8117/", { waitUntil: "networkidle" });
      const play = page.getByRole("button", {
        name: "Oyuna Başla",
        exact: true,
      });
      await play.waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() =>
        Array.from(document.images).every(
          (i) => i.complete && i.naturalWidth > 0,
        ),
      );
      const capture = async (suffix) => {
        assert.deepEqual(errors, []);
        const size = await page.evaluate(() => ({
          w: innerWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        assert(
          size.scroll <= size.w + 2,
          `${width} ${colorScheme} ${suffix}: horizontal overflow`,
        );
        await page.screenshot({
          path: join(
            root,
            `home-${baseline ? "before" : "after"}-${colorScheme}-${width}-${suffix}.png`,
          ),
        });
      };
      if (!baseline) {
        const plaque = page.getByTestId("home-title-plaque");
        assert.equal(await plaque.count(), 1);
        const rect = await plaque.boundingBox(),
          button = await play.boundingBox();
        assert(
          rect.x >= 0 && rect.x + rect.width <= width + 1,
          "Plaque must leave wallpaper visible and fit the screen",
        );
        assert(
          rect.y + rect.height <= button.y + 1,
          "Plaque must not overlap start button",
        );
        assert.equal(
          await plaque
            .getByRole("heading", { name: "Anla &", exact: true })
            .count(),
          1,
        );
        assert.equal(
          await plaque
            .getByRole("heading", { name: "Ezberle", exact: true })
            .count(),
          1,
        );
        // Decorative skyline is deliberately absent from the accessibility tree.
        assert.equal(await plaque.getByRole("img").count(), 0);
      }
      await capture("top");
      await page
        .getByRole("heading", { name: "Zorluk Seç", exact: true })
        .scrollIntoViewIfNeeded();
      const paints = [];
      for (const name of ["Kolay", "Orta", "Zor"]) {
        const tile = page.getByRole("button", { name, exact: true });
        const rect = await tile.boundingBox();
        assert(
          rect && rect.x >= 0 && rect.x + rect.width <= width + 1,
          "Difficulty buttons must fit side by side",
        );
        assert(rect.height >= 44, "Touch area must be accessible");
        paints.push(
          await tile.evaluate(
            (e) =>
              Array.from(e.querySelectorAll("*"))
                .map((n) => getComputedStyle(n).backgroundImage)
                .find((s) => s.includes("linear-gradient")) ?? "none",
          ),
        );
      }
      if (!baseline) {
        assert.equal(
          new Set(paints).size,
          3,
          "Three different difficulty gradients required",
        );
        assert(paints.every((p) => p !== "none"));
      }
      await capture("difficulty");
      await page
        .getByRole("button", {
          name: "Son skor ve kişisel geçmiş",
          exact: true,
        })
        .scrollIntoViewIfNeeded();
      assert.equal(
        await page.getByText("—", { exact: true }).count(),
        1,
        "Empty score must remain truthful",
      );
      assert.equal(
        await page.getByText("0 / 82", { exact: true }).count(),
        1,
        "No sample rewards may appear",
      );
      if (!baseline) {
        const scoreCard = await page
          .getByRole("button", {
            name: "Son skor ve kişisel geçmiş",
            exact: true,
          })
          .boundingBox();
        const badgeCard = await page
          .getByRole("button", { name: "Kazanılan rozetler", exact: true })
          .boundingBox();
        assert(
          Math.abs(scoreCard.height - badgeCard.height) <= 2,
          "Summary cards must retain equal heights",
        );
        const badgeValue = await page
          .getByText("0 / 82", { exact: true })
          .boundingBox();
        assert(
          badgeValue.height <= 30,
          "Badge count must fit on one readable line",
        );
      }
      await capture("summary");
      if (!baseline && width === 390) {
        for (const [name, label] of [
          ["Kolay", "Zorluk: Kolay"],
          ["Orta", "Zorluk: Orta"],
          ["Zor", "Zorluk: Zor"],
        ]) {
          await page.getByRole("button", { name, exact: true }).click();
          const selected = page.getByRole("radio", {
            name: label,
            exact: true,
          });
          await selected.waitFor();
          assert.equal(await selected.getAttribute("aria-checked"), "true");
          assert.equal(
            await page
              .getByRole("button", { name: "Oyuna Başla", exact: true })
              .isDisabled(),
            true,
            "Difficulty alone must not start a game",
          );
          await page.screenshot({
            path: join(root, `home-selected-${colorScheme}-${name}.png`),
          });
          await page
            .getByRole("tab", { name: "Ana Sayfa", exact: true })
            .click();
          await play.waitFor();
        }
        await page
          .getByRole("button", {
            name: "Son skor ve kişisel geçmiş",
            exact: true,
          })
          .click();
        await page.waitForURL("**/ranking?section=personal");
        await page.getByRole("tab", { name: "Ana Sayfa", exact: true }).click();
        await page
          .getByRole("button", { name: "Kazanılan rozetler", exact: true })
          .click();
        await page
          .getByRole("heading", { name: "Rozetler", exact: true })
          .waitFor();
      }
      await context.close();
      console.log(
        `PASS home ${baseline ? "before" : "after"} ${colorScheme}-${width}: artwork, layout, difficulty, real empty state, tabs`,
      );
    }
  }
}

if (process.argv.includes("--baseline")) {
  const require = createRequire(import.meta.url);
  const { chromium } = require(
    join(process.env.RUNNER_TEMP, "visual-node", "node_modules", "playwright"),
  );
  const browser = await chromium.launch({ headless: true });
  try {
    await homePolishSmoke(browser, "artifacts/unified-categories-ui", true);
  } finally {
    await browser.close();
  }
}
