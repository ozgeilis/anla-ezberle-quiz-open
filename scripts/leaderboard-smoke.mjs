import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setup } from "./fixtures/leaderboard-http.mjs";
const require = createRequire(import.meta.url),
  { chromium } = require(
    join(process.env.RUNNER_TEMP, "visual-node/node_modules/playwright"),
  );
const root = "artifacts/leaderboard-ui",
  origin = process.env.SETTINGS_ORIGIN ?? "http://127.0.0.1:8117";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.SETTINGS_BROWSER_CHANNEL
    ? { channel: process.env.SETTINGS_BROWSER_CHANNEL }
    : {}),
});
const checks = [];
let lastPage;
const button = (p, name) => p.getByRole("button", { name, exact: true });
async function shot(p, name) {
  lastPage = p;
  await p.evaluate(() => document.fonts.ready);
  const v = await p.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert(v.scroll <= v.width + 2, name + " overflow");
  const cards = await p
    .getByRole("button", { name: /XP, profilini aç$/ })
    .evaluateAll((es) =>
      es.map((e) => ({
        left: e.getBoundingClientRect().left,
        right: e.getBoundingClientRect().right,
      })),
    );
  assert(
    cards.every((r) => r.left >= 0 && r.right <= v.width),
    name + " clipped rank card",
  );
  await p.screenshot({ path: join(root, name + ".png") });
}
async function login(p, email = "player-a@example.invalid") {
  await p.goto(origin + "/online", { waitUntil: "networkidle" });
  await p.getByLabel("E-posta", { exact: true }).fill(email);
  await p.getByLabel("Şifre", { exact: true }).fill("Synthetic_42_Test!");
  await button(p, "Giriş yap").click();
  await button(p, "Kullanıcı adım ve gizlilik").waitFor();
}
try {
  for (const width of [320, 390, 430, 1024])
    for (const mode of ["light", "dark"]) {
      const context = await browser.newContext({
          viewport: { width, height: width > 600 ? 1000 : 844 },
          colorScheme: mode,
          reducedMotion: "reduce",
        }),
        f = setup();
      await f.install(context);
      const p = await context.newPage(),
        errors = [];
      lastPage = p;
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto(origin + "/ranking", { waitUntil: "networkidle" });
      await p.getByText("Hesabına giriş yap", { exact: true }).waitFor();
      await shot(p, `${mode}-${width}-guest`);
      await p
        .getByRole("tab", { name: "Kişisel Rekorlarım", exact: true })
        .click();
      await p.getByText("Kişisel skor geçmişin", { exact: true }).waitFor();
      await shot(p, `${mode}-${width}-personal`);
      // Re-enter an already mounted ranking tab from Home; route params must win.
      await p.getByRole("tab", { name: "Genel", exact: true }).click();
      await p.getByRole("tab", { name: "Ana Sayfa", exact: true }).click();
      await button(p, "Son skor ve kişisel geçmiş").click();
      await p.getByText("Kişisel skor geçmişin", { exact: true }).waitFor();
      assert.equal(
        await p
          .getByRole("tab", { name: "Kişisel Rekorlarım", exact: true })
          .getAttribute("aria-selected"),
        "true",
      );
      await login(p);
      await p.goto(origin + "/ranking", { waitUntil: "networkidle" });
      await p.getByText("Senin Sıran · 60", { exact: true }).waitFor();
      await shot(p, `${mode}-${width}-global`);
      assert.equal(
        await p.getByRole("button", { name: /XP, profilini aç$/ }).count(),
        50,
      );
      await button(p, "Daha Fazla").click();
      await p.getByRole("button", { name: /^60\. Ayşe/ }).waitFor();
      assert.equal(
        await p.getByRole("button", { name: /XP, profilini aç$/ }).count(),
        60,
      );
      assert.equal(await button(p, "Daha Fazla").count(), 0);
      await p.getByRole("button", { name: /^1\. Test Oyuncu 1,/ }).click();
      await p.getByRole("dialog", { name: "Oyuncu Profili" }).waitFor();
      await p
        .getByRole("dialog", { name: "Oyuncu Profili" })
        .getByText("@test_1", { exact: true })
        .waitFor();
      await button(p, "Pencereyi kapat").click();
      f.state.failPreference = true;
      await p.getByRole("switch", { name: "Sıralamaya katıl" }).click();
      await p.getByRole("alert").waitFor();
      assert.equal(
        await p.getByRole("switch", { name: "Sıralamaya katıl" }).isChecked(),
        true,
      );
      assert.equal(f.state.preferenceWrites, 1);
      f.state.failPreference = false;
      await p.getByRole("switch", { name: "Sıralamaya katıl" }).click();
      await p
        .getByText("Katılım kapalı · Kişisel rekorların korunur", {
          exact: true,
        })
        .waitFor();
      assert.equal(await p.getByText(/Senin Sıran/).count(), 0);
      await shot(p, `${mode}-${width}-opt-out`);
      await p.getByRole("tab", { name: "Arkadaşlarım", exact: true }).click();
      await p
        .getByText("Henüz sıralamada arkadaşın yok.", { exact: true })
        .waitFor();
      await shot(p, `${mode}-${width}-friends-empty`);
      await button(p, "Arkadaş Bul").click();
      await p
        .getByLabel("Kullanıcı adıyla oyuncu ara", { exact: true })
        .waitFor();
      await p.goto(origin + "/ranking?section=friends", {
        waitUntil: "networkidle",
      });
      f.state.friends = true;
      await button(p, "Sıralamayı yenile").click();
      await p.getByRole("button", { name: /^2\. Test Oyuncu 2,/ }).waitFor();
      await shot(p, `${mode}-${width}-friends`);
      await p.getByRole("tab", { name: "Genel", exact: true }).click();
      await button(p, "Sıralamayı yenile").waitFor();
      for (const n of [0, 1, 2, 3]) {
        f.state.count = n;
        await button(p, "Sıralamayı yenile").click();
        if (n === 0)
          await p
            .getByText("İlk sıralama sonuçları bekleniyor.", { exact: true })
            .waitFor();
        else
          await p
            .getByRole("button", {
              name: new RegExp("^" + n + "\\. Test Oyuncu " + n + ","),
            })
            .waitFor();
        assert.equal(
          await p.getByRole("button", { name: /XP, profilini aç$/ }).count(),
          n,
        );
        await shot(p, `${mode}-${width}-players-${n}`);
      }
      f.state.fail = true;
      await button(p, "Sıralamayı yenile").click();
      await p.getByRole("alert").waitFor();
      await shot(p, `${mode}-${width}-server-error`);
      f.state.fail = false;
      await button(p, "Yeniden Dene").click();
      await p.getByRole("alert").waitFor({ state: "hidden" });
      // Routed HTTP fixtures bypass Playwright network emulation; abort them too.
      f.state.offline = true;
      await context.setOffline(true);
      await button(p, "Sıralamayı yenile").click();
      await p.getByRole("alert").waitFor();
      await p
        .getByRole("tab", { name: "Kişisel Rekorlarım", exact: true })
        .click();
      await p.getByText("Kişisel skor geçmişin", { exact: true }).waitFor();
      await shot(p, `${mode}-${width}-offline-personal`);
      f.state.offline = false;
      await context.setOffline(false);
      assert.deepEqual(errors, []);
      checks.push(
        `${mode}-${width}: guest, personal/offline, 60 players/pagination, exact self, public profile, failed/successful opt-out, friends/empty, 0/1/2/3 podium, server error/retry`,
      );
      await context.close();
    }
  await writeFile(
    join(root, "results.json"),
    JSON.stringify({ passed: true, fixtureOnly: true, checks }, null, 2),
  );
  console.log(
    checks.length +
      " leaderboard browser groups passed (isolated fixtures; no hosted scores).",
  );
} catch (e) {
  if (lastPage && !lastPage.isClosed()) {
    await lastPage.screenshot({ path: join(root, "failure.png") });
    await writeFile(
      join(root, "failure.txt"),
      String(e) + "\n" + (await lastPage.locator("body").innerText()),
    );
  }
  throw e;
} finally {
  await browser.close();
}
