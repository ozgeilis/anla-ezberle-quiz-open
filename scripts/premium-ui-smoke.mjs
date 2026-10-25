import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const origin = process.env.UI_BASE_URL ?? "http://127.0.0.1:8121";
const output = process.env.UI_ARTIFACT_DIR ?? "artifacts/premium-ui";
const fixture = JSON.parse(
  await readFile(
    process.env.UI_FIXTURE_PATH ?? "/tmp/premium-ui-fixture.json",
    "utf8",
  ),
);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.UI_BROWSER_CHANNEL
    ? { channel: process.env.UI_BROWSER_CHANNEL }
    : {}),
});
const routes = [
  ["home", "/", "Kategorileri Keşfet"],
  ["categories", "/categories", "Öğrenme Konuları"],
  ["ranking", "/ranking?section=personal", "Kişisel skor geçmişin"],
  ["achievements", "/achievements", "Küçük adımlar, büyük keşifler"],
  ["profile", "/profile", "Senin yolculuğun"],
];
await mkdir(output, { recursive: true });
const results = [];
try {
  for (const width of process.env.UI_EXTRA_ONLY ? [] : [320, 390, 1024]) {
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: width > 700 ? 900 : 844 },
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      await context.addInitScript(
        ({ fixture, theme }) => {
          if (!localStorage.getItem(fixture.storageKey)) {
            localStorage.setItem(
              fixture.storageKey,
              JSON.stringify({
                ...fixture.data,
                profile: { ...fixture.data.profile, theme, reduceMotion: true },
              }),
            );
          }
        },
        { fixture, theme },
      );
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      for (const [name, route, heading] of routes) {
        await page.goto(origin + route, { waitUntil: "networkidle" });
        await page.getByText(heading, { exact: true }).waitFor();
        await page.evaluate(() => document.fonts.ready);
        const size = await page.evaluate(() => ({
          width: window.innerWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        assert.ok(
          size.scroll <= size.width + 1,
          `${name}/${width}/${theme}: overflow ${JSON.stringify(size)}`,
        );
        const tabs = page.getByRole("tablist");
        assert.equal(
          await tabs.getByRole("tab", { selected: true }).count(),
          1,
        );
        const tabBounds = await tabs.boundingBox();
        assert.ok(
          tabBounds &&
            tabBounds.y + tabBounds.height <= (width > 700 ? 900 : 844) + 1,
        );
        if (name === "home") {
          await page
            .getByRole("button", { name: "Günün Yarışması, 10 soru ile başla" })
            .waitFor();
          await page.getByRole("button", { name: "Profilini aç" }).waitFor();
        }
        if (name === "categories") {
          const start = page.getByRole("button", {
            name: "Oyuna Başla",
            exact: true,
          });
          assert.equal(await start.isDisabled(), true);
          await page
            .getByRole("radio", { name: "Zorluk: Kolay", exact: true })
            .click();
          const topic = page.getByRole("radio", { name: /^Kur'an\./ });
          await topic.click();
          assert.equal(await topic.getAttribute("aria-checked"), "true");
          assert.equal(await start.isEnabled(), true);
          const startBounds = await start.boundingBox();
          assert.ok(
            startBounds && startBounds.y + startBounds.height <= tabBounds.y,
            "sticky action overlaps tabs",
          );
          await page.screenshot({
            path: join(output, `${name}-${width}-${theme}-selected.jpg`),
            type: "jpeg",
            quality: 76,
          });
          const season = page.getByRole("button", { name: /^Ramazan\./ });
          await season.scrollIntoViewIfNeeded();
          await season.click();
          const preview = page.getByRole("dialog", {
            name: "Ramazan",
            exact: true,
          });
          await preview.waitFor();
          assert.equal(
            await preview
              .getByRole("button", { name: "Oyuna Başla", exact: true })
              .count(),
            0,
          );
          await preview
            .getByRole("button", { name: "Anladım", exact: true })
            .click();
          await page.screenshot({
            path: join(output, `special-${width}-${theme}.jpg`),
            type: "jpeg",
            quality: 76,
          });
          // Use the existing flow to enter a real quiz, without changing its logic.
          await start.click();
          await page.waitForURL("**/quiz");
          await page.getByText("Soru 1 / 10", { exact: true }).waitFor();
          await page.goto(origin + route, { waitUntil: "networkidle" });
          await page.getByText(heading, { exact: true }).waitFor();
        }
        if (name === "achievements") {
          const total = page.getByRole("progressbar", {
            name: "Kazanılan rozetler",
            exact: true,
          });
          assert.equal(await total.getAttribute("aria-valuenow"), "2");
          assert.equal(
            await page
              .getByRole("progressbar", {
                name: "Kusursuz tur ilerlemesi",
                exact: true,
              })
              .getAttribute("aria-valuenow"),
            "7",
          );
          assert.equal(
            await page
              .getByRole("progressbar", {
                name: "Meraklı kâşif ilerlemesi",
                exact: true,
              })
              .getAttribute("aria-valuenow"),
            "2",
          );
        }
        await page.screenshot({
          path: join(output, `${name}-${width}-${theme}.jpg`),
          type: "jpeg",
          quality: 76,
        });
        assert.deepEqual(
          errors,
          [],
          `${name}/${width}/${theme}: runtime error`,
        );
        results.push({
          name,
          width,
          theme,
          overflow: false,
          runtimeErrors: errors.length,
        });
      }
      await page.goto(origin + "/settings", { waitUntil: "networkidle" });
      await page
        .getByRole("button", { name: "Avatarını değiştir", exact: true })
        .click();
      await page
        .getByRole("radio", { name: "Mercan Yolcu", exact: true })
        .click();
      await page.getByRole("button", { name: "Kaydet", exact: true }).click();
      await page
        .getByRole("button", { name: "Görünüm ayarlarını aç", exact: true })
        .click();
      const alternate =
        theme === "light" ? "Koyu Tema ön izlemesi" : "Açık Tema ön izlemesi";
      await page.getByRole("radio", { name: alternate, exact: true }).click();
      const beforeSave = await page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)).profile.theme,
        fixture.storageKey,
      );
      assert.equal(beforeSave, theme, "Preview changed persisted theme");
      await page.getByRole("button", { name: "Vazgeç", exact: true }).click();
      await page
        .getByRole("button", { name: "Görünüm ayarlarını aç", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("radio", { name: alternate, exact: true })
          .getAttribute("aria-checked"),
        "false",
      );
      await page.getByRole("radio", { name: alternate, exact: true }).click();
      await page.getByRole("button", { name: "Kaydet", exact: true }).click();
      const saved = await page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)),
        fixture.storageKey,
      );
      assert.equal(saved.profile.avatar, 2);
      assert.equal(saved.profile.theme, theme === "light" ? "dark" : "light");
      assert.deepEqual(
        saved.games,
        fixture.data.games,
        "UI settings changed saved game history",
      );
      await context.close();
      console.log(
        `PASS ${width}px ${theme}: five screens, selection, locks, quiz entry, persisted appearance and unchanged games`,
      );
    }
  }
  const empty = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const emptyPage = await empty.newPage();
  await emptyPage.goto(origin + "/achievements", { waitUntil: "networkidle" });
  assert.equal(
    await emptyPage
      .getByRole("progressbar", { name: "Kazanılan rozetler", exact: true })
      .getAttribute("aria-valuenow"),
    "0",
  );
  for (const [label, path] of [
    [/^Ana Sayfa$/, "/"],
    [/^Kategoriler$/, "/categories"],
    [/^Sıralama$/, "/ranking"],
    [/^Rozetler$/, "/achievements"],
    [/^Profil$/, "/profile"],
  ]) {
    await emptyPage.getByRole("tab", { name: label }).click();
    await emptyPage.waitForURL((url) => url.pathname === path);
  }
  await emptyPage.getByRole("tab", { name: "Ana Sayfa", exact: true }).click();
  await emptyPage
    .getByRole("button", {
      name: "Günün Yarışması, 10 soru ile başla",
      exact: true,
    })
    .click();
  await emptyPage.waitForURL("**/quiz");
  await emptyPage.getByText("Soru 1 / 10", { exact: true }).waitFor();
  await empty.close();
  console.log(
    "PASS empty profile: zero earned badges, all five tab actions and daily quiz entry",
  );
  await writeFile(
    join(output, "functional-checks.json"),
    JSON.stringify(
      { emptyProfileBadges: 0, tabNavigation: true, dailyQuizEntry: true },
      null,
      2,
    ) + "\n",
  );
  if (results.length) {
    await writeFile(
      join(output, "results.json"),
      JSON.stringify(results, null, 2) + "\n",
    );
  }
} finally {
  await browser.close();
}
