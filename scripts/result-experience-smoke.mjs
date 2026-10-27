// Real browser games in isolated CI state. No result override or test route in the app.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(
  join(process.env.RUNNER_TEMP, "visual-node/node_modules/playwright"),
);
const oracle = spawnSync(
  process.execPath,
  [
    "--import",
    "tsx",
    "-e",
    'import {questions} from "./src/content/questions/index.ts"; process.stdout.write(JSON.stringify(Object.fromEntries(questions.map(q=>[q.question,q.options.find(o=>o.id===q.correctOptionId).text]))))',
  ],
  { encoding: "utf8" },
);
assert.equal(oracle.status, 0);
const answers = JSON.parse(oracle.stdout);
const origin = process.env.RESULT_ORIGIN ?? "http://127.0.0.1:8117";
const root = "artifacts/result-experience";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.SETTINGS_BROWSER_CHANNEL
    ? { channel: process.env.SETTINGS_BROWSER_CHANNEL }
    : {}),
});
try {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  await ctx.route("https://**/*", (r) => r.abort());
  const page = await ctx.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
  await page.getByTestId("studio-intro").waitFor();
  await page.screenshot({ path: join(root, "studio-cold-start.png") });
  await page
    .getByRole("button", { name: "Oyuna Başla", exact: true })
    .waitFor();
  const history = [];
  for (const [right, title, tier] of [
    [10, "Mükemmel!", "perfect"],
    [8, "Harika!", "excellent"],
    [6, "Gayet iyi!", "steady"],
    [4, "İyi bir başlangıç!", "beginning"],
    [2, "Pes etme!", "learning"],
  ]) {
    await page.goto(`${origin}/categories?category=mixed&difficulty=easy`, {
      waitUntil: "networkidle",
    });
    await page
      .getByRole("button", { name: "Oyuna Başla", exact: true })
      .click();
    for (let i = 0; i < 10; i++) {
      await page.getByText(`Soru ${i + 1} / 10`, { exact: true }).waitFor();
      const texts = await page.getByRole("heading").allTextContents(),
        prompt = texts.find((t) => answers[t]);
      assert(prompt, "Question must match real bank");
      const options = page.getByRole("button", { name: /^[ABCD]\. / });
      const labels = await options.allTextContents();
      const correct = labels.findIndex(
        (t) => t.slice(1).trim() === answers[prompt],
      );
      assert(correct >= 0);
      await options.nth(i < right ? correct : (correct + 1) % 4).click();
    }
    await page.getByRole("heading", { name: title, exact: true }).waitFor();
    await page
      .getByText("Sonucun bu cihazda kaydedildi. ✓", { exact: true })
      .waitFor();
    const banner = page.getByRole("button", {
      name: "Rozet ödül bildirimini kapat",
      exact: true,
    });
    if (await banner.count()) await banner.click();
    assert.equal(await page.getByTestId(`result-art-${tier}`).count(), 1);
    assert.equal(
      await page
        .getByTestId("result-success-meter")
        .getAttribute("aria-valuenow"),
      String(right * 10),
    );
    const saved = await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("@anla-ezberle-quiz/progress/v1"))
          .games,
    );
    assert.deepEqual(saved.slice(0, -1), history);
    assert.equal(saved.at(-1).answers.length, 10);
    history.push(saved.at(-1));
    for (const colorScheme of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme });
      for (const width of [320, 360, 390, 768]) {
        await page.setViewportSize({ width, height: 844 });
        await page.evaluate(() => document.fonts.ready);
        const size = await page.evaluate(() => ({
          width: innerWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        assert(size.scroll <= size.width + 1);
        await page.screenshot({
          path: join(root, `result-${tier}-${colorScheme}-${width}.png`),
        });
      }
    }
    await page.emulateMedia({ colorScheme: "light" });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.deepEqual(errors, []);
    console.log(
      `PASS real ${right}/10 ${title}: matching art, percentage, saved game, eight layouts`,
    );
  }
  await page
    .getByRole("button", { name: "Ana Sayfaya Dön", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Oyuna Başla", exact: true })
    .waitFor();
  assert.equal(
    await page.getByTestId("studio-intro").count(),
    0,
    "Tab return must not replay studio intro",
  );
  await page.getByRole("tab", { name: "Kategoriler", exact: true }).click();
  await page
    .getByRole("heading", { name: "Kategoriler", exact: true })
    .waitFor();
  const cards = page.getByRole("radio", {
    name: /^(Kur'an ve Dualar|Peygamberimizin Hayatı ve Sahabe|Peygamber Kıssaları|İbadet ve Fıkıh|İman ve Ahlak|İslam Tarihi ve Medeniyeti)\./,
  });
  assert.equal(await cards.count(), 6);
  assert.equal(
    Object.keys(answers).length,
    1500,
    "Canonical bank remains complete",
  );
  for (const card of await cards.all()) {
    assert(
      !/\d[\d.,]*\s*soru/i.test(await card.innerText()),
      "No visible category pool count",
    );
    assert(
      !/\d[\d.,]*\s*soru/i.test(await card.getAttribute("aria-label")),
      "No pool count in accessible name",
    );
  }
  await page.waitForFunction(() =>
    Array.from(document.images).every((i) => i.complete && i.naturalWidth > 0),
  );
  const approved = [
    ["hac_mevsimi", "Hac Mevsimi", "01_hac_mevsimi"],
    ["muharrem_asura", "Muharrem ve Aşure", "02_muharrem_ve_asure"],
    ["ramazan", "Ramazan", "03_ramazan"],
    ["ramazan_bayrami", "Ramazan Bayramı", "04_ramazan_bayrami"],
    ["kadir_gecesi", "Kadir Gecesi", "05_kadir_gecesi"],
    ["kurban_bayrami", "Kurban Bayramı", "06_kurban_bayrami"],
    [
      "peygamberimizin_hayati",
      "Peygamberimizin Hayatı",
      "07_peygamberimizin_hayati",
    ],
    ["kadin_sahabeler", "Kadın Sahabeler", "08_kadin_sahabeler"],
    ["children", "Çocuklar İçin", "09_cocuklar_icin"],
  ];
  for (const colorScheme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme });
    for (const width of [320, 360, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      const boxes = await cards.evaluateAll((es) =>
        es.map((e) => ({
          x: e.getBoundingClientRect().x,
          y: e.getBoundingClientRect().y,
          w: e.getBoundingClientRect().width,
        })),
      );
      assert(Math.abs(boxes[0].y - boxes[1].y) < 2, "Two-column categories");
      assert(boxes[0].x < boxes[1].x);
      await cards.first().scrollIntoViewIfNeeded();
      await page.screenshot({
        path: join(root, `categories-${colorScheme}-${width}.png`),
      });
      for (const [id, title, filename] of approved) {
        const card = page.getByRole("button", {
          name: new RegExp("^" + title + "\\."),
        });
        assert(
          await card.isEnabled(),
          `${title}: explanation remains accessible`,
        );
        assert.equal(
          await card.getAttribute("role"),
          "button",
          "Preview is not a playable radio selection",
        );
        const art = card.getByTestId(`category-art-${id}`);
        assert.equal(await art.count(), 1, `${title}: exact existing ID`);
        const image = await art.evaluate((el) => {
          const img = el.querySelector("img") ?? el;
          return {
            src: img.currentSrc || img.src,
            w: img.naturalWidth,
            h: img.naturalHeight,
            size:
              Array.from(el.querySelectorAll("div"))
                .map((d) => getComputedStyle(d).backgroundSize)
                .find((s) => s === "contain") ??
              getComputedStyle(el).backgroundSize,
            fit: getComputedStyle(el).objectFit,
            box: el.getBoundingClientRect().toJSON(),
          };
        });
        assert(
          image.src.includes(filename),
          `${title}: matching approved source`,
        );
        assert(image.w > 0 && image.h > 0, `${title}: image loaded`);
        assert(
          image.size === "contain" || image.fit === "contain",
          `${title}: whole composition, no crop`,
        );
        const box = await card.boundingBox();
        assert(
          image.box.width <= box.width && image.box.height <= box.height,
          `${title}: no intrinsic-size overflow`,
        );
        const firstBox = await cards.first().boundingBox();
        assert(
          Math.abs(box.width - firstBox.width) < 2 &&
            Math.abs(box.height - firstBox.height) < 2,
          `${title}: same card dimensions as normal categories`,
        );
        await card.scrollIntoViewIfNeeded();
        if (colorScheme === "light" && width === 390) {
          const before = await page
            .getByRole("radio", { checked: true })
            .allTextContents();
          await card.click();
          const dialog = page.getByRole("dialog", { name: title, exact: true });
          await dialog.waitFor();
          assert.equal(
            await dialog
              .getByRole("button", { name: "Oyuna Başla", exact: true })
              .count(),
            0,
          );
          await dialog
            .getByRole("button", { name: "Anladım", exact: true })
            .click();
          assert.deepEqual(
            await page.getByRole("radio", { checked: true }).allTextContents(),
            before,
            "Preview never changes game selection",
          );
        }
        await card.screenshot({
          path: join(root, `approved-${id}-${colorScheme}-${width}.png`),
        });
      }
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
    }
  }
  assert.equal(
    await page
      .getByText("10 farklı soru hazır. Her doğru cevap 100 puan!", {
        exact: true,
      })
      .count(),
    0,
  );
  const lastCard = page.getByRole("button", { name: /^Kadın Sahabeler\./ });
  await lastCard.evaluate((el) => el.scrollIntoView({ block: "center" }));
  const lastBox = await lastCard.boundingBox();
  assert.equal(
    await page.getByTestId("category-start-panel").count(),
    0,
    "Catalog has no obstructing fixed game panel",
  );
  const nav = await page.getByRole("tablist").boundingBox();
  assert(
    lastBox.y + lastBox.height <= nav.y,
    "Last card scrolls above the navigation",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    join(root, "acceptance.json"),
    JSON.stringify(
      {
        realRounds: 5,
        states: [10, 8, 6, 4, 2],
        layoutWidths: [320, 360, 390, 768],
        themes: ["light", "dark"],
        oldGamesUnchanged: true,
        remoteRequestsBlocked: true,
      },
      null,
      2,
    ),
  );
  await ctx.close();
} finally {
  await browser.close();
}
