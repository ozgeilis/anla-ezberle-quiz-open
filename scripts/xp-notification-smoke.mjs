// Actual app UI with synthetic HTTP fixtures only; never hosted data or push.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setup, userB } from "./fixtures/account-http.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const origin = process.env.SETTINGS_ORIGIN ?? "http://127.0.0.1:8175";
assert.equal(new URL(origin).hostname, "127.0.0.1");
const output = process.env.UI_ARTIFACT_DIR ?? "artifacts/xp-notifications";
await mkdir(output, { recursive: true });
const historical = JSON.parse(
  await readFile("tests/fixtures/content/topic-v1-pre-review.json", "utf8"),
);
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROME_PATH,
});
const checks = [],
  errors = [];
const notification = (id, kind, ref) => ({
  id,
  kind,
  referenceId: ref,
  createdAt: new Date(Date.now() - 120000).toISOString(),
  read: false,
});
const player = {
  id: userB,
  name: "Deniz Bilgi Yolcusu",
  username: "deniz_bilgi",
  avatar: 12,
  xp: 300,
  level: 2,
};
const invite = (id, expired = false) => ({
  id,
  incoming: true,
  state: expired ? "expired" : "pending",
  createdAt: new Date(Date.now() - 300000).toISOString(),
  expiresAt: new Date(Date.now() + (expired ? -1 : 3600000)).toISOString(),
  matchId: null,
  matchState: null,
  player,
});
const button = (p, name) => p.getByRole("button", { name, exact: true });
async function login(p) {
  await p.goto(origin + "/online", { waitUntil: "networkidle" });
  await p
    .getByLabel("E-posta", { exact: true })
    .fill("player-a@example.invalid");
  await p.getByLabel("Şifre", { exact: true }).fill("Synthetic_42_Test!");
  await button(p, "Giriş yap").click();
  await button(p, "Kullanıcı adım ve gizlilik").waitFor();
  await p.goto(origin + "/online/inbox", { waitUntil: "networkidle" });
  await p.getByText("Arkadaşlık isteği", { exact: true }).waitFor();
}
async function layout(p) {
  assert(
    await p.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    "No horizontal overflow",
  );
  for (const el of await p.getByRole("button").all()) {
    if (!(await el.isVisible())) continue;
    const box = await el.boundingBox();
    assert(box.height >= 43, "Touch height >=44 dp");
  }
}
try {
  for (const width of [320, 360, 390])
    for (const theme of ["light", "dark"]) {
      const ctx = await browser.newContext({
        viewport: { width, height: 844 },
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      const f = setup();
      f.state.username = "ayse_34";
      f.state.challenges = [
        invite("active-invite"),
        invite("expired-invite", true),
      ];
      f.state.notifications = [
        notification("request", "friend_request", "ci-friend"),
        notification("invite", "challenge_received", "active-invite"),
        notification("expired", "challenge_received", "expired-invite"),
        notification("accepted", "challenge_accepted", "accepted-invite"),
      ];
      f.state.unread = 4;
      await f.install(ctx);
      let friendWrites = 0,
        challengeWrites = 0;
      await ctx.route(
        "http://127.0.0.1:55431/functions/v1/online-duel",
        async (route) => {
          const { operation: op, body } = route.request().postDataJSON() ?? {};
          if (op === "leaderboard")
            return route.fulfill({
              status: 200,
              contentType: "application/json",
              body: JSON.stringify({
                entries: [{ rank: 4, games: 4, player }],
                nextCursor: null,
                asOf: new Date().toISOString(),
                scope: body.scope,
                self: {
                  optIn: true,
                  discoverable: true,
                  username: "ayse_34",
                  xp: 0,
                  games: 0,
                  entry: null,
                },
              }),
            });
          if (op === "friend_accept" || op === "friend_remove") friendWrites++;
          if (op === "challenge_reply") challengeWrites++;
          return route.fallback();
        },
      );
      const p = await ctx.newPage();
      p.on("pageerror", (e) => errors.push(e.message));
      await login(p);
      await layout(p);
      await button(p, "Deniz: arkadaşlık isteğini kabul et").waitFor();
      await p.screenshot({
        path: join(output, `inbox-${width}-${theme}.png`),
        fullPage: true,
      });
      if (width === 390) {
        for (const [title, file] of [
          ["Arkadaşlık isteği", "friend-card"],
          ["Oyun daveti", "invite-card"],
          ["Oyun daveti · Süresi doldu", "expired-card"],
        ])
          await p
            .getByTestId("notification-card")
            .filter({ has: p.getByText(title, { exact: true }) })
            .screenshot({ path: join(output, `${file}-${theme}.png`) });
      }
      await p.getByRole("tab", { name: "İstekler", exact: true }).click();
      assert.equal(
        await p.getByText("Oyun daveti", { exact: true }).count(),
        0,
      );
      await p
        .getByRole("button", { name: /^Arkadaşlık isteği\..*Ayrıntıları aç$/ })
        .click();
      await button(p, "Profili Gör").click();
      await p
        .getByText("Seviye 3 · 300 çevrimiçi XP", { exact: true })
        .waitFor();
      await button(p, "Pencereyi kapat").click();
      const accept = button(p, "Deniz: arkadaşlık isteğini kabul et");
      await accept.dblclick();
      await p.getByText("Arkadaşlık kabul edildi", { exact: true }).waitFor();
      assert.equal(f.state.friendState, "accepted");
      assert.equal(
        friendWrites,
        1,
        "Double tap is a single acknowledged request",
      );
      await p.screenshot({
        path: join(output, `friend-accepted-${width}-${theme}.png`),
      });
      await p.getByRole("tab", { name: "Davetler", exact: true }).click();
      const before = challengeWrites;
      await button(p, "Deniz Bilgi Yolcusu: daveti daha sonra yanıtla").click();
      await p.getByText(/Davet bekliyor/).waitFor();
      assert.equal(challengeWrites, before, "Later does not decline or accept");
      assert.equal(f.state.challenges[0].state, "pending");
      assert.equal(
        await button(p, "Deniz Bilgi Yolcusu: düello davetine katıl").count(),
        1,
        "Expired invite has no join action",
      );
      await p.screenshot({
        path: join(output, `invites-${width}-${theme}.png`),
        fullPage: true,
      });
      await button(p, "Deniz Bilgi Yolcusu: düello davetine katıl").click();
      await p.waitForURL(
        (url) =>
          url.pathname === "/online" &&
          url.searchParams.get("match") === "ci-match",
      );
      assert.equal(f.state.challenges[0].state, "accepted");
      assert.equal(challengeWrites, before + 1);
      await p.goto(origin + "/profile", { waitUntil: "networkidle" });
      await p.evaluate(
        (data) =>
          localStorage.setItem(
            "@anla-ezberle-quiz/progress/v1",
            JSON.stringify(data),
          ),
        historical.stored,
      );
      await p.reload({ waitUntil: "networkidle" });
      await p.getByText("60 / 100 XP", { exact: true }).waitFor();
      assert.equal(
        await p
          .getByRole("progressbar", { name: "Seviye ilerlemesi", exact: true })
          .getAttribute("aria-valuenow"),
        "60",
      );
      const stored = await p.evaluate(() =>
        JSON.parse(localStorage.getItem("@anla-ezberle-quiz/progress/v1")),
      );
      assert.deepEqual(
        stored.games,
        historical.stored.games,
        "XP curve never rewrites history",
      );
      await layout(p);
      await p.screenshot({
        path: join(output, `profile-xp-${width}-${theme}.png`),
        fullPage: true,
      });
      await p.goto(origin + "/ranking", { waitUntil: "networkidle" });
      await p.getByText("@deniz_bilgi · Seviye 3", { exact: true }).waitFor();
      await p
        .getByRole("button", { name: /4\. Deniz Bilgi Yolcusu.*profilini aç/ })
        .click();
      await p
        .getByText("Seviye 3 · 300 doğrulanmış XP", { exact: true })
        .waitFor();
      await p.screenshot({
        path: join(output, `leaderboard-xp-${width}-${theme}.png`),
      });
      await button(p, "Pencereyi kapat").click();
      await p.goto(origin + "/online/inbox", { waitUntil: "networkidle" });
      f.state.failInbox = true;
      await p.reload({ waitUntil: "networkidle" });
      await button(p, "Yeniden Dene").waitFor();
      f.state.failInbox = false;
      await button(p, "Yeniden Dene").click();
      await p.getByText("Arkadaşlık kabul edildi", { exact: true }).waitFor();
      f.state.notifications = [];
      f.state.challenges = [];
      f.state.unread = 0;
      await p.reload({ waitUntil: "networkidle" });
      await p.getByText("Henüz bildirim yok.", { exact: true }).waitFor();
      await p.screenshot({ path: join(output, `empty-${width}-${theme}.png`) });
      checks.push({
        width,
        theme,
        friendSingleRequest: true,
        laterPreservesInvite: true,
        expiredCannotJoin: true,
        historyUnchanged: true,
        profileXp: "60/100",
        leaderboardUsesXpInsteadOfStaleLevel: true,
        errorRetry: true,
        empty: true,
      });
      await ctx.close();
    }
  assert.deepEqual(errors, []);
  await writeFile(
    join(output, "results.json"),
    JSON.stringify(
      {
        checks,
        syntheticHttp: true,
        physicalDevice: false,
        hostedWrites: false,
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS ${checks.length} UI matrices: XP/history, request ACK/double-tap, tabs, later, expiry, error/retry, empty`,
  );
} finally {
  await browser.close();
}
