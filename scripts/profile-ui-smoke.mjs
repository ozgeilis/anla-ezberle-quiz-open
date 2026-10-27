// Real browser, isolated synthetic HTTP and engine records. Never hosted writes.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setup } from "./fixtures/account-http.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require(
  join(process.env.RUNNER_TEMP, "visual-node/node_modules/playwright"),
);
const fixture = JSON.parse(
  await readFile(
    process.env.PROFILE_FIXTURE_PATH ?? "/tmp/anla-profile-fixture.json",
    "utf8",
  ),
);
const root = process.env.PROFILE_SCREENSHOTS ?? "artifacts/profile-ui",
  origin = process.env.SETTINGS_ORIGIN ?? "http://127.0.0.1:8186";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.SETTINGS_BROWSER_CHANNEL
    ? { channel: process.env.SETTINGS_BROWSER_CHANNEL }
    : {}),
});
const checks = [];
let current;
async function shot(p, name) {
  await p.evaluate(() => document.fonts.ready);
  assert(
    await p.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    name + " overflow",
  );
  await p.screenshot({ path: join(root, name + ".png") });
}
try {
  for (const width of [320, 360, 390])
    for (const theme of ["light", "dark"])
      for (const populated of [false, true]) {
        const ctx = await browser.newContext({
          viewport: { width, height: 844 },
          colorScheme: theme,
          reducedMotion: "reduce",
        });
        const f = setup();
        f.state.username = "bilgi_yolculugu_2026";
        f.state.name = "Ayşe Nur Bilgi Yolculuğu";
        f.state.friendState = populated ? "accepted" : null;
        await f.install(ctx);
        if (populated)
          await ctx.addInitScript(
            ({ key, data }) =>
              !localStorage.getItem(key) &&
              localStorage.setItem(key, JSON.stringify(data)),
            { key: fixture.storageKey, data: fixture.data },
          );
        const p = await ctx.newPage();
        current = p;
        if (populated) {
          await p.goto(origin + "/online");
          await p
            .getByLabel("E-posta", { exact: true })
            .fill("player-a@example.invalid");
          await p
            .getByLabel("Şifre", { exact: true })
            .fill("Synthetic_42_Test!");
          await p
            .getByRole("button", { name: "Giriş yap", exact: true })
            .click();
          await p
            .getByRole("button", {
              name: "Kullanıcı adım ve gizlilik",
              exact: true,
            })
            .waitFor();
        }
        await p.goto(origin + "/profile");
        await p.getByText("İstatistiklerim", { exact: true }).waitFor();
        await p.getByTestId("studio-intro").waitFor({ state: "hidden" });
        assert.equal(
          await p.locator('[data-testid^="profile-stat-"]').count(),
          5,
        );
        if (populated) {
          await p.getByText("@bilgi_yolculugu_2026", { exact: true }).waitFor();
          await p
            .getByText("İslam Tarihi ve Medeniyeti", { exact: true })
            .waitFor();
          assert.equal(
            await p.getByRole("button", { name: /rozet detayını aç$/ }).count(),
            3,
          );
          await p
            .getByRole("button", {
              name: "Deniz, arkadaşlarını aç",
              exact: true,
            })
            .waitFor();
          assert.equal(
            await p.getByText("Çevrimiçi", { exact: true }).count(),
            0,
          );
        } else {
          await p.getByText("Henüz belirlenmedi", { exact: true }).waitFor();
          assert.equal(
            await p.getByRole("button", { name: /rozet detayını aç$/ }).count(),
            0,
          );
          await p
            .getByText("İlk rozetini kazandığında burada sergileyebilirsin.")
            .waitFor();
        }
        const name = `${width}-${theme}-${populated ? "populated-long" : "empty"}`;
        await shot(p, name + "-top");
        await p
          .getByRole("button", { name: "Arkadaş ekle", exact: false })
          .last()
          .scrollIntoViewIfNeeded();
        await shot(p, name + "-showcase-friends");
        if (populated && width === 390 && theme === "light") {
          await p
            .getByRole("button", { name: /rozet detayını aç$/ })
            .first()
            .click();
          await p.getByRole("dialog").last().waitFor();
          await shot(p, "badge-open-from-profile");
          await p
            .getByRole("button", { name: "Pencereyi kapat", exact: true })
            .click();
        }
        checks.push(name);
        await ctx.close();
      }
  const ctx = await browser.newContext({
    viewport: { width: 320, height: 844 },
    reducedMotion: "reduce",
  });
  const f = setup();
  await f.install(ctx);
  const p = await ctx.newPage();
  current = p;
  for (const path of [
    "/online/inbox",
    "/privacy",
    "/categories",
    "/prepare?playCategory=quran_dualar&difficulty=easy",
    "/online/players",
    "/achievements",
    "/ranking",
  ]) {
    await p.goto(origin + path);
    await p
      .getByRole("button", { name: "Geri Dön", exact: true })
      .first()
      .waitFor();
    const body = await p.locator("body").innerText();
    assert(
      !/\b(?:1[.,]?500|500|600|213|313|271|161|260|282)\s*(?:mevcut\s*)?soru/.test(
        body,
      ),
      path + " pool advertisement",
    );
    await shot(p, "back-" + path.split("?")[0].slice(1).replaceAll("/", "-"));
    await p
      .getByRole("button", { name: "Geri Dön", exact: true })
      .first()
      .click();
  }
  await ctx.close();
  await writeFile(
    join(root, "results.json"),
    JSON.stringify(
      { checks, physicalDeviceTest: false, hostedWrites: false },
      null,
      2,
    ),
  );
  console.log(
    `PASS ${checks.length} profile groups, real stats, long identity/category, three earned badges, friends/empty, themes; back routes and pool privacy.`,
  );
} catch (e) {
  if (current && !current.isClosed())
    await current.screenshot({ path: join(root, "failure.png") });
  throw e;
} finally {
  await browser.close();
}
