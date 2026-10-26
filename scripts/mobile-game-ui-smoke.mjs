// Render the real application; all online DTOs are isolated, synthetic fixtures.
// Browser viewport/text-stress evidence is not a physical Android/iOS acceptance.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setup, userA, userB } from "./fixtures/account-http.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require(
  join(process.env.RUNNER_TEMP, "visual-node/node_modules/playwright"),
);
const origin = process.env.SETTINGS_ORIGIN ?? "http://127.0.0.1:8173";
const root = "artifacts/mobile-game-ui";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.SETTINGS_BROWSER_CHANNEL
    ? { channel: process.env.SETTINGS_BROWSER_CHANNEL }
    : {}),
});
const checks = [];
const button = (p, name) => p.getByRole("button", { name, exact: true });
const roomId = "33333333-3333-4333-8333-333333333333";
let current;
async function shot(p, name) {
  await p.getByRole("button").first().waitFor();
  await p.getByTestId("studio-intro").waitFor({ state: "hidden" });
  await p.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((i) =>
        i.complete
          ? Promise.resolve()
          : new Promise((r) => {
              i.onload = r;
              i.onerror = r;
            }),
      ),
    );
  });
  assert(
    await p.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    name + " horizontal overflow",
  );
  await p.screenshot({ path: join(root, name + ".png") });
}
try {
  for (const width of [320, 360, 390, 768])
    for (const mode of ["light", "dark"]) {
      const ctx = await browser.newContext({
        viewport: { width, height: 844 },
        colorScheme: mode,
        reducedMotion: "reduce",
      });
      const f = setup();
      f.state.username = "ayse_34";
      await f.install(ctx);
      const room = () => ({
        id: roomId,
        code: "ABC234",
        hostId: userA,
        state: "lobby",
        phase: "lobby",
        position: 0,
        revision: 1,
        serverNow: new Date().toISOString(),
        startAt: null,
        deadline: null,
        nextAt: null,
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        settings: { topic: "mixed", level: "easy", count: 10, seconds: 10 },
        question: null,
        answer: null,
        review: null,
        players: [
          {
            id: userA,
            name: "Ayşe",
            username: "ayse_34",
            avatar: 0,
            ready: true,
            left: false,
            seenAt: new Date().toISOString(),
            answered: false,
            score: null,
            correct: null,
            wrong: null,
            unanswered: null,
            rank: null,
            won: null,
          },
          {
            id: userB,
            name: "Deniz",
            username: "deniz_bilgi",
            avatar: 12,
            ready: true,
            left: false,
            seenAt: new Date().toISOString(),
            answered: false,
            score: null,
            correct: null,
            wrong: null,
            unanswered: null,
            rank: null,
            won: null,
          },
        ],
        reward: null,
        history: [],
      });
      await ctx.route(
        "http://127.0.0.1:55431/functions/v1/online-duel",
        async (route) => {
          const { operation } = route.request().postDataJSON();
          let result;
          if (operation === "room_options")
            result = {
              combinations: [
                { topic: "mixed", level: "easy", count: 10, available: true },
              ],
            };
          if (operation === "room_list") result = { rooms: [] };
          if (operation === "room_get") result = room();
          if (result)
            return route.fulfill({
              status: 200,
              contentType: "application/json",
              body: JSON.stringify(result),
              headers: { "access-control-allow-origin": "*" },
            });
          return route.fallback();
        },
      );
      const p = await ctx.newPage();
      current = p;
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.goto(origin + "/online", { waitUntil: "networkidle" });
      await shot(p, `${mode}-${width}-login`);
      await p
        .getByLabel("E-posta", { exact: true })
        .fill("player-a@example.invalid");
      await p.getByLabel("Şifre", { exact: true }).fill("Synthetic_42_Test!");
      await button(p, "Giriş yap").click();
      await button(p, "Kullanıcı adım ve gizlilik").waitFor();
      for (const path of [
        "/",
        "/categories",
        "/achievements",
        "/profile",
        "/settings",
        "/settings/profile",
        "/settings/sound",
        "/settings/theme",
        "/settings/account",
        "/settings/notifications",
        "/settings/privacy",
        "/settings/help",
        "/online/players",
        "/live",
      ]) {
        await p.goto(origin + path, { waitUntil: "networkidle" });
        await shot(
          p,
          `${mode}-${width}-${path === "/" ? "home" : path.slice(1).replaceAll("/", "-")}`,
        );
        if (path === "/achievements") {
          assert.equal(
            await p.getByRole("radio").count(),
            0,
            "No obsolete badge filters",
          );
          const badge = p
            .getByRole("button", { name: /Kilitli|Kazanıldı|ilerleme/ })
            .first();
          await badge.click();
          const detail = p.getByRole("dialog", { name: /./ }).last();
          await detail.waitFor();
          await shot(p, `${mode}-${width}-badge-detail`);
          await button(p, "Pencereyi kapat").click();
        }
        if (path === "/settings/notifications")
          assert.equal(await p.getByRole("switch").count(), 5);
      }
      await p.goto(origin + "/live?room=" + roomId, {
        waitUntil: "networkidle",
      });
      await p.getByText("ABC234", { exact: true }).waitFor();
      await p.getByText("Deniz", { exact: true }).waitFor();
      await shot(p, `${mode}-${width}-room-lobby`);
      await p.goto(origin + "/categories", { waitUntil: "networkidle" });
      await p.getByRole("radio", { name: /^Kur'an ve Dualar\./ }).click();
      await p
        .getByRole("heading", { name: "Oyun Hazırlığı", exact: true })
        .waitFor();
      assert.equal(
        await p.getByRole("radio").count(),
        3,
        "Only supported difficulty controls",
      );
      await p
        .getByRole("radio", { name: "Zorluk: Kolay", exact: true })
        .click();
      await shot(p, `${mode}-${width}-preparation`);
      await button(p, "Oyuna Başla").click();
      await p.getByText("Soru 1 / 10", { exact: true }).waitFor();
      assert.equal(
        await p.getByRole("button", { name: /^[ABCD]\. / }).count(),
        4,
      );
      await shot(p, `${mode}-${width}-quiz`);
      const nav = await p.getByRole("tab").count();
      assert.equal(nav, 0, "Quiz has no tab overlay");
      assert.deepEqual(errors, [], "No client exceptions");
      checks.push({ width, mode, onlineFixtures: true, physicalDevice: false });
      await ctx.close();
    }
  // Slow font loading must retain one Studio screen, rather than flash a second
  // branded loading page or show a blank/unreadable shell.
  {
    const ctx = await browser.newContext({
      viewport: { width: 320, height: 844 },
      reducedMotion: "reduce",
    });
    await ctx.route("https://**/*", (r) => r.abort());
    let releaseFonts;
    const fontGate = new Promise((resolve) => {
      releaseFonts = resolve;
    });
    await ctx.route("**/*.ttf", async (r) => {
      await fontGate;
      await r.continue();
    });
    const p = await ctx.newPage();
    current = p;
    await p.goto(origin, { waitUntil: "domcontentloaded" });
    await p.getByTestId("studio-intro").waitFor();
    await p.waitForTimeout(1800);
    assert(await p.getByTestId("studio-intro").isVisible());
    assert.equal(await button(p, "Oyuna Başla").count(), 0);
    await p.screenshot({
      path: join(root, "slow-fonts-one-studio-screen.png"),
    });
    releaseFonts();
    await button(p, "Oyuna Başla").waitFor();
    assert.equal(await p.getByTestId("studio-intro").count(), 0);
    await ctx.close();
  }
  await writeFile(
    join(root, "acceptance.json"),
    JSON.stringify(
      {
        checks,
        passed: true,
        hostedWrites: false,
        nativeFontScaleTested: false,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS eight responsive/theme groups: home, catalog/preparation, quiz, badge detail, profile, all seven settings, auth, social and two-player lobby (HTTP fixtures).",
  );
} catch (error) {
  if (current && !current.isClosed()) {
    await current.screenshot({ path: join(root, "failure.png") });
    await writeFile(
      join(root, "failure.txt"),
      String(error) + "\n" + (await current.locator("body").innerText()),
    );
  }
  throw error;
} finally {
  await browser.close();
}
