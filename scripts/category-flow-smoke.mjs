// Runs only in the repository's isolated GitHub CI browser, never against live accounts.
import assert from "node:assert/strict";
import { join } from "node:path";
const storageKey = "@anla-ezberle-quiz/progress/v1";
export async function categoryFlowSmoke(page, root) {
  const seen = new Set();
  const records = async () =>
    page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)).games,
      storageKey,
    );
  const round = async (capture = false, replay = false, failSave = false) => {
    for (let i = 1; i <= 10; i++) {
      await page.getByText(`Soru ${i} / 10`, { exact: true }).waitFor();
      const code = (await page.getByText(/^Soru kodu: /).textContent())
        .replace("Soru kodu: ", "")
        .trim();
      if (!replay) {
        assert(!seen.has(code), `Completed history repeated question ${code}`);
        seen.add(code);
      }
      if (capture && i === 1)
        await page.screenshot({
          path: join(root, "flow-question.jpg"),
          type: "jpeg",
          quality: 65,
        });
      await page.getByRole("button", { name: /^A\. / }).click();
      await page.getByText("Açıklama", { exact: true }).waitFor();
      if (capture && i === 1)
        await page.screenshot({
          path: join(root, "flow-explanation.jpg"),
          type: "jpeg",
          quality: 65,
        });
      if (failSave && i === 10)
        await page.evaluate(() => {
          const original = Storage.prototype.setItem;
          window.__restoreCategoryStorage = () => {
            Storage.prototype.setItem = original;
          };
          Storage.prototype.setItem = function (key, value) {
            if (key === "@anla-ezberle-quiz/progress/v1")
              throw new Error("CI simulated write failure");
            return original.call(this, key, value);
          };
        });
      await page
        .getByRole("button", {
          name: i === 10 ? "Sonucumu Gör" : "Sonraki Soru",
          exact: true,
        })
        .click();
    }
    if (failSave) {
      await page
        .getByText("Sonucun henüz kaydedilmedi.", { exact: true })
        .waitFor();
      assert(
        await page
          .getByRole("button", { name: "Tekrar Oyna", exact: true })
          .isDisabled(),
      );
      await page.screenshot({
        path: join(root, "flow-save-failure.jpg"),
        type: "jpeg",
        quality: 65,
      });
      await page.evaluate(() => window.__restoreCategoryStorage());
      await page
        .getByRole("button", { name: "Sonucu yeniden kaydet", exact: true })
        .click();
    }
    await page
      .getByText("Sonucun bu cihazda kaydedildi. ✓", { exact: true })
      .waitFor();
    if (capture)
      await page.screenshot({
        path: join(root, "flow-results.jpg"),
        type: "jpeg",
        quality: 65,
      });
  };
  await page.goto(
    "http://127.0.0.1:8117/categories?playCategory=peygamberler&difficulty=medium",
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "Oyuna Başla", exact: true }).click();
  for (let i = 0; i < 6; i++) {
    await round(i === 0);
    if (i < 5)
      await page
        .getByRole("button", { name: "Tekrar Oyna", exact: true })
        .click();
  }
  assert.equal(seen.size, 60);
  const before = await records();
  assert.equal(before.length, 6);
  await page.reload({ waitUntil: "networkidle" });
  await page.goto(
    "http://127.0.0.1:8117/categories?playCategory=peygamberler&difficulty=medium",
    { waitUntil: "networkidle" },
  );
  assert.deepEqual(
    await records(),
    before,
    "Reload changed old answers or scores",
  );
  await page.getByRole("button", { name: "Oyuna Başla", exact: true }).click();
  await round();
  assert.equal(seen.size, 70);
  await page.goto(
    "http://127.0.0.1:8117/categories?playCategory=quran_dualar&difficulty=easy",
    { waitUntil: "networkidle" },
  );
  // This smaller real pool exhausts naturally. No fake history/answer keys are injected.
  let exhausted = false;
  for (let i = 0; i < 12; i++) {
    const repeat = page.getByRole("button", {
      name: "Görülen sorularla yeniden oyna",
      exact: true,
    });
    if (await repeat.count()) {
      exhausted = true;
      break;
    }
    await page
      .getByRole("button", { name: "Oyuna Başla", exact: true })
      .click();
    await round();
    await page
      .getByRole("button", { name: "Tekrar Oyna", exact: true })
      .click();
    // Successful replay navigates straight to a new *fresh* round. Return to
    // preparation without answering; only completed rounds count as history.
    await page.goto(
      "http://127.0.0.1:8117/categories?playCategory=quran_dualar&difficulty=easy",
      { waitUntil: "networkidle" },
    );
    await page.getByText("Oyun Kategorileri", { exact: true }).waitFor();
  }
  assert(exhausted, "Expected the small easy Quran/prayer pool to exhaust");
  assert(
    await page
      .getByRole("button", { name: "Oyuna Başla", exact: true })
      .isDisabled(),
  );
  await page.getByText(/Bu kategorideki yeni soruları tamamladın/).waitFor();
  await page.screenshot({
    path: join(root, "flow-exhausted.jpg"),
    type: "jpeg",
    quality: 65,
  });
  await page
    .getByRole("radio", { name: /^Kur'an ve Dualar\./ })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: join(root, "flow-exhausted-category.jpg"),
    type: "jpeg",
    quality: 65,
  });
  const exhaustedHistory = await records();
  await page
    .getByRole("button", {
      name: "Görülen sorularla yeniden oyna",
      exact: true,
    })
    .click();
  await page.getByText("Soru 1 / 10", { exact: true }).waitFor();
  // Consent starts a replay but does not erase/rewrite completed history.
  assert.deepEqual(await records(), exhaustedHistory);
  await round(false, true, true);
  const afterReplay = await records();
  assert.deepEqual(afterReplay.slice(0, -1), exhaustedHistory);
  assert.equal(afterReplay.at(-1).replay, true);
  console.log(
    `PASS real UI: 6 consecutive rounds + restart, ${seen.size} unique fresh IDs, exhaustion and explicit replay`,
  );
}

export async function corruptHistorySmoke(browser, root) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  await context.addInitScript(() =>
    localStorage.setItem("@anla-ezberle-quiz/progress/v1", "{broken-history"),
  );
  const page = await context.newPage();
  await page.goto(
    "http://127.0.0.1:8117/categories?playCategory=quran_dualar&difficulty=easy",
    { waitUntil: "networkidle" },
  );
  await page
    .getByText(/Yerel kayıt okunamadı/)
    .first()
    .waitFor();
  assert(
    await page
      .getByRole("button", { name: "Oyuna Başla", exact: true })
      .isDisabled(),
  );
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("@anla-ezberle-quiz/progress/v1"),
    ),
    "{broken-history",
  );
  await page.screenshot({
    path: join(root, "flow-corrupt-history.jpg"),
    type: "jpeg",
    quality: 65,
  });
  await context.close();
  console.log(
    "PASS corrupt history is preserved; fresh/replay starts fail closed",
  );
}
