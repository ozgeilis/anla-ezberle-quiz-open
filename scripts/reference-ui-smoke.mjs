// Isolated CI sessions only. No real users, credentials or remote service calls.
import assert from "node:assert/strict";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

export async function referenceUiSmoke(browser, root) {
  const output = spawnSync(
    process.execPath,
    [
      "--import",
      "tsx",
      "-e",
      'import { questions } from "./src/content/questions/index.ts"; process.stdout.write(JSON.stringify(Object.fromEntries(questions.map(q=>[q.id,q.options.find(o=>o.id===q.correctOptionId).text]))));',
    ],
    { encoding: "utf8" },
  );
  assert.equal(output.status, 0, "Solo fixture question lookup must load");
  // Only in process memory; never write answer keys to screenshots/logs/artifacts.
  const correctText = JSON.parse(output.stdout);
  const key = "@anla-ezberle-quiz/progress/v1";
  const states = [
    { name: "light-320", width: 320, height: 760, colorScheme: "light" },
    { name: "dark-320", width: 320, height: 760, colorScheme: "dark" },
    { name: "light-390", width: 390, height: 844, colorScheme: "light" },
    { name: "dark-390", width: 390, height: 844, colorScheme: "dark" },
    { name: "light-tablet", width: 1024, height: 900, colorScheme: "light" },
    { name: "dark-tablet", width: 1024, height: 900, colorScheme: "dark" },
  ];
  for (const state of states) {
    const context = await browser.newContext({
      viewport: { width: state.width, height: state.height },
      colorScheme: state.colorScheme,
      reducedMotion: "reduce",
    });
    await context.route("https://**/*", (route) => route.abort());
    const page = await context.newPage(),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const shot = async (name) => {
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() =>
        Array.from(document.images).every((i) => i.complete),
      );
      const broken = await page.evaluate(() =>
        Array.from(document.images)
          .filter((i) => !i.naturalWidth)
          .map((i) => i.getAttribute("src")),
      );
      assert.deepEqual(broken, [], `${state.name} ${name}: broken artwork`);
      const overflow = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      assert(
        overflow.scroll <= overflow.width + 2,
        `${state.name} ${name}: overflow`,
      );
      assert.deepEqual(errors, [], `${state.name} ${name}: browser errors`);
      await page.screenshot({
        path: join(root, `reference-${state.name}-${name}.png`),
      });
    };
    await page.goto("http://127.0.0.1:8117/", { waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: "Oyuna Başla", exact: true })
      .waitFor();
    await shot("home");
    // Category-first route and true 10-question round, with known right/wrong choices.
    await page.goto(
      "http://127.0.0.1:8117/categories?playCategory=quran_dualar&difficulty=easy",
      { waitUntil: "networkidle" },
    );
    await page
      .getByRole("button", { name: "Oyuna Başla", exact: true })
      .click();
    for (let i = 1; i <= 10; i++) {
      await page.getByText(`Soru ${i} / 10`, { exact: true }).waitFor();
      const code = (await page.getByText(/^Soru kodu: /).textContent())
        .replace("Soru kodu: ", "")
        .trim();
      const options = page.getByRole("button", { name: /^[ABCD]\. / });
      const labels = await options.allTextContents();
      const correct = labels.findIndex(
        (label) => label.slice(1).trim() === correctText[code],
      );
      assert(correct >= 0, "Current shuffled correct text must exist");
      if (i === 1) await shot("quiz");
      await options.nth(i === 2 ? (correct + 1) % 4 : correct).click();
      await page.getByText("Açıklama", { exact: true }).waitFor();
      if (i <= 2) {
        await page
          .getByText("Açıklama", { exact: true })
          .scrollIntoViewIfNeeded();
        await shot(i === 1 ? "correct-explanation" : "wrong-explanation");
        assert.equal(
          await page.getByRole("button", { name: /Kaynağı aç:/ }).count(),
          1,
        );
      }
      await page
        .getByRole("button", {
          name: i === 10 ? "Sonucumu Gör" : "Sonraki Soru",
          exact: true,
        })
        .click();
    }
    await page
      .getByText("Sonucun bu cihazda kaydedildi. ✓", { exact: true })
      .waitFor();
    const reward = page.getByRole("button", {
      name: "Rozet ödül bildirimini kapat",
    });
    if (await reward.count()) await reward.click();
    await page
      .getByRole("heading", { name: "Tebrikler!", exact: true })
      .scrollIntoViewIfNeeded();
    await shot("results");
    const saved = await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)),
      key,
    );
    assert.equal(saved.games.length, 1);
    assert.equal(saved.games[0].answers.length, 10);
    await page.goto("http://127.0.0.1:8117/profile", {
      waitUntil: "networkidle",
    });
    await page
      .getByRole("heading", { name: "Profilim", exact: true })
      .waitFor();
    await shot("profile");
    await page
      .getByText("Doğruluk Oranı", { exact: true })
      .scrollIntoViewIfNeeded();
    assert.equal(await page.getByText("%90", { exact: true }).count(), 1);
    await shot("profile-stats");
    await page.getByRole("button", { name: "Ayarlar", exact: true }).click();
    await page.getByRole("heading", { name: "Ayarlar", exact: true }).waitFor();
    // Draft appearance must not change stored theme; back discards it.
    await page.getByRole("button", { name: "Tema", exact: true }).click();
    const dialog = page;
    const themeHeading = page.getByRole("heading", {
      name: "Tema",
      exact: true,
    });
    await themeHeading.waitFor();
    const before = await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)).profile,
      key,
    );
    const choice = dialog.getByRole("radio", {
      name:
        state.colorScheme === "light"
          ? "Koyu Tema ön izlemesi"
          : "Açık Tema ön izlemesi",
      exact: true,
    });
    await choice.click();
    assert.equal(
      (
        await page.evaluate(
          (k) => JSON.parse(localStorage.getItem(k)).profile,
          key,
        )
      ).theme,
      before.theme,
    );
    await shot("theme-preview");
    await dialog.getByRole("button", { name: "Geri dön", exact: true }).click();
    assert.equal(
      (
        await page.evaluate(
          (k) => JSON.parse(localStorage.getItem(k)).profile,
          key,
        )
      ).theme,
      before.theme,
    );
    await page.getByRole("button", { name: "Tema", exact: true }).click();
    await themeHeading.waitFor();
    await dialog
      .getByRole("radio", {
        name:
          state.colorScheme === "light"
            ? "Koyu Tema ön izlemesi"
            : "Açık Tema ön izlemesi",
        exact: true,
      })
      .click();
    if (state.name === "light-390") {
      await page.evaluate(() => {
        const original = Storage.prototype.setItem;
        window.__restoreReferenceStorage = () => {
          Storage.prototype.setItem = original;
        };
        Storage.prototype.setItem = function (key, value) {
          if (key === "@anla-ezberle-quiz/progress/v1")
            throw Error("CI write failure");
          return original.call(this, key, value);
        };
      });
      await dialog.getByRole("button", { name: "Kaydet", exact: true }).click();
      await dialog.getByRole("alert").waitFor();
      assert.equal(
        (
          await page.evaluate(
            (k) => JSON.parse(localStorage.getItem(k)).profile,
            key,
          )
        ).theme,
        before.theme,
      );
      await shot("theme-save-failure");
      await page.evaluate(() => window.__restoreReferenceStorage());
    }
    await dialog.getByRole("button", { name: "Kaydet", exact: true }).click();
    await themeHeading.waitFor({ state: "hidden" });
    const expected = state.colorScheme === "light" ? "dark" : "light";
    assert.equal(
      (
        await page.evaluate(
          (k) => JSON.parse(localStorage.getItem(k)).profile,
          key,
        )
      ).theme,
      expected,
    );
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Tema", exact: true }).click();
    await dialog
      .getByRole("radio", { name: "Sistem temasını izle", exact: true })
      .click();
    await dialog.getByRole("button", { name: "Kaydet", exact: true }).click();
    await themeHeading.waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "Profil", exact: true }).click();
    await page
      .getByRole("button", { name: "Avatarını değiştir", exact: true })
      .click();
    const avatar = page.getByRole("dialog", { name: "Avatar seçimi" });
    await avatar
      .getByRole("radio", { name: "Bakır Esinti", exact: true })
      .click();
    await shot("avatar-preview");
    await avatar.getByRole("button", { name: "Vazgeç", exact: true }).click();
    assert.equal(
      (
        await page.evaluate(
          (k) => JSON.parse(localStorage.getItem(k)).profile,
          key,
        )
      ).avatar,
      before.avatar,
    );
    await page
      .getByRole("button", { name: "Avatarını değiştir", exact: true })
      .click();
    await avatar
      .getByRole("radio", { name: "Bakır Esinti", exact: true })
      .click();
    await avatar.getByRole("button", { name: "Kaydet", exact: true }).click();
    await avatar.waitFor({ state: "hidden" });
    const avatarId = await page.evaluate(
      (k) => JSON.parse(localStorage.getItem(k)).profile.avatar,
      key,
    );
    assert.notEqual(avatarId, before.avatar);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(
      await page.evaluate(
        (k) => JSON.parse(localStorage.getItem(k)).profile.avatar,
        key,
      ),
      avatarId,
    );
    await page.goto("http://127.0.0.1:8117/achievements", {
      waitUntil: "networkidle",
    });
    await page
      .getByRole("heading", { name: "Rozetler", exact: true })
      .waitFor();
    await shot("achievements");
    await page
      .getByRole("radio", { name: "Koleksiyon: Tamamlanan", exact: true })
      .click();
    const earned = page.locator('[data-testid^="badge-"]');
    assert((await earned.count()) >= 2);
    await earned.first().scrollIntoViewIfNeeded();
    await shot("earned-badges");
    await page
      .getByRole("radio", { name: "Koleksiyon: Nadir", exact: true })
      .click();
    assert.equal(await page.getByText("Kazanıldı", { exact: true }).count(), 0);
    await page
      .locator('[data-testid^="badge-"]')
      .first()
      .scrollIntoViewIfNeeded();
    await shot("locked-badges");
    assert.deepEqual(
      (await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), key))
        .games,
      saved.games,
      "Presentation/settings must preserve full game records",
    );
    await context.close();
    console.log(
      `PASS reference ${state.name}: five screens, real round, right/wrong sources, save, filters, theme draft, history`,
    );
  }
}
