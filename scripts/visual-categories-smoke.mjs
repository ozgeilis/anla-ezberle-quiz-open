import assert from "node:assert/strict";
import { homePolishSmoke } from "./home-polish-smoke.mjs";
import { referenceUiSmoke } from "./reference-ui-smoke.mjs";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import {
  categoryFlowSmoke,
  corruptHistorySmoke,
} from "./category-flow-smoke.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require(
  join(process.env.RUNNER_TEMP, "visual-node", "node_modules", "playwright"),
);

const root = "artifacts/unified-categories-ui";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({ headless: true });
const states = [
  { name: "light-320", width: 320, height: 760, colorScheme: "light" },
  { name: "light-390", width: 390, height: 844, colorScheme: "light" },
  { name: "dark-320", width: 320, height: 760, colorScheme: "dark" },
  { name: "dark-390", width: 390, height: 844, colorScheme: "dark" },
  { name: "tablet-1024", width: 1024, height: 768, colorScheme: "light" },
  { name: "dark-tablet-1024", width: 1024, height: 768, colorScheme: "dark" },
];

try {
  for (const state of states) {
    const page = await browser.newPage({
      viewport: { width: state.width, height: state.height },
      deviceScaleFactor: 1,
      colorScheme: state.colorScheme,
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:8117/categories", {
      waitUntil: "networkidle",
    });
    await page.getByText("Oyun Kategorileri", { exact: true }).waitFor();
    assert.equal(
      await page.getByText("Özel Zamanlar", { exact: true }).count(),
      1,
    );
    assert.equal(
      await page.getByText("Kadir Gecesi", { exact: true }).count(),
      1,
    );
    assert.equal(await page.getByText("Ramazan", { exact: true }).count(), 1);
    const categoryTitles = [
      "Kur'an ve Dualar",
      "Peygamberimizin Hayatı ve Sahabe",
      "Peygamber Kıssaları",
      "İbadet ve Fıkıh",
      "İman ve Ahlak",
      "İslam Tarihi ve Medeniyeti",
    ];
    const counts = [];
    for (const title of categoryTitles) {
      const card = page.getByRole("radio", {
        name: new RegExp("^" + title + "\\."),
      });
      assert.equal(await card.count(), 1);
      const label = await card.getAttribute("aria-label");
      counts.push(Number(label.match(/\.\s(\d+) soru/)[1]));
    }
    assert.deepEqual(counts, [213, 313, 271, 161, 260, 282]);
    assert.equal(
      counts.reduce((n, c) => n + c, 0),
      1500,
    );
    const children = page.getByRole("button", { name: /^Çocuklar İçin\./ });
    assert.equal(await children.count(), 1);
    assert.equal(await children.getAttribute("role"), "button");
    await children.click();
    const preview = page.getByRole("dialog", {
      name: "Çocuklar İçin",
      exact: true,
    });
    await preview.waitFor();
    assert.equal(
      await preview
        .getByRole("button", { name: "Oyuna Başla", exact: true })
        .count(),
      0,
    );
    await preview.getByRole("button", { name: "Anladım", exact: true }).click();
    assert.equal(
      await page
        .getByText(
          "Kaynak ve yaş uygunluğu incelemesi tamamlanınca açılacak.",
          { exact: true },
        )
        .count(),
      1,
    );
    assert.equal(
      await page.getByRole("radio", { name: /^Kur'an ve Dualar\./ }).count(),
      1,
    );
    assert.equal(
      await page
        .getByRole("radio", { name: /^Peygamberimizin Hayatı ve Sahabe\./ })
        .count(),
      1,
    );
    assert.equal(
      await page.getByText("Öğrenme Konuları", { exact: true }).count(),
      0,
    );
    assert.equal(await page.getByText("Dualar", { exact: true }).count(), 0);
    const sizes = await page.evaluate(() => ({
      screen: window.innerWidth,
      width: document.documentElement.scrollWidth,
    }));
    assert.ok(
      sizes.width <= sizes.screen + 2,
      `${state.name}: horizontal overflow: ${JSON.stringify(sizes)}`,
    );
    assert.deepEqual(errors, [], `${state.name}: runtime errors`);
    await page.screenshot({
      path: join(root, `${state.name}-top.jpg`),
      type: "jpeg",
      quality: 48,
    });
    await page
      .getByRole("radio", { name: /^Kur'an ve Dualar\./ })
      .scrollIntoViewIfNeeded();
    await page.screenshot({
      path: join(root, `${state.name}-categories.jpg`),
      type: "jpeg",
      quality: 65,
    });
    await children.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: join(root, `${state.name}-children.jpg`),
      type: "jpeg",
      quality: 65,
    });
    const special = page.getByText("Özel Zamanlar", { exact: true });
    await special.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: join(root, `${state.name}-special.jpg`),
      type: "jpeg",
      quality: 48,
    });
    if (state.name === "light-390") {
      const start = page.getByRole("button", { name: /Oyuna Başla/ });
      assert.equal(
        await start.isDisabled(),
        true,
        "Start must require a category and difficulty",
      );
      await page.getByRole("radio", { name: /Zorluk: Kolay/ }).click();
      await page.getByRole("radio", { name: /^Kur'an ve Dualar\./ }).click();
      assert.equal(
        await start.isEnabled(),
        true,
        "A supported topic/level should start",
      );
      await page.screenshot({
        path: join(root, "light-390-selected.jpg"),
        type: "jpeg",
        quality: 48,
      });
      await page.goto("http://127.0.0.1:8117/", { waitUntil: "networkidle" });
      await page.getByText("Kategorileri Keşfet", { exact: true }).waitFor();
      await page.screenshot({
        path: join(root, "light-390-home.jpg"),
        type: "jpeg",
        quality: 48,
      });
      await categoryFlowSmoke(page, root);
    }
    await page.close();
    console.log(`PASS ${state.name}: no overflow, expected categories present`);
  }
  await corruptHistorySmoke(browser, root);
  await referenceUiSmoke(browser, root);
  await homePolishSmoke(browser, root);
} catch (error) {
  for (const context of browser.contexts())
    for (const page of context.pages())
      await page
        .screenshot({
          path: join(root, "failure.jpg"),
          type: "jpeg",
          quality: 75,
        })
        .catch(() => {});
  throw error;
} finally {
  await browser.close();
}
