// Real Chromium rendering against isolated HTTP fixtures, never a hosted account.
// All auth tokens/addresses below are synthetic and have no server authority.
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(
  join(process.env.RUNNER_TEMP, "visual-node/node_modules/playwright"),
);
const origin = "http://127.0.0.1:8117",
  api = "http://127.0.0.1:55431",
  root = "artifacts/settings-account-ui";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({ headless: true });
const checks = [];
let latestPage;
const userA = "11111111-1111-4111-8111-111111111111",
  userB = "22222222-2222-4222-8222-222222222222";
const token = (id) =>
  `${Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64url")}.${Buffer.from(JSON.stringify({ sub: id, exp: Math.floor(Date.now() / 1000) + 3600, role: "authenticated" })).toString("base64url")}.ci-not-a-signature`;
function setup() {
  const state = {
    actor: userA,
    username: null,
    name: "Ayşe",
    failName: false,
    failRead: false,
    failInbox: false,
    failAfterChallenge: false,
    readWrites: 0,
    nameWrites: 0,
    friendState: "pending",
    notifications: null,
    challenges: [],
    unread: 0,
    failSave: false,
    failEmail: false,
    failSignup: false,
    failUser: false,
    unconfirmed: false,
    writes: 0,
    usernameChecks: 0,
    userChecks: 0,
  };
  const user = () => ({
    id: state.actor,
    aud: "authenticated",
    role: "authenticated",
    email:
      state.actor === userA
        ? "player-a@example.invalid"
        : "player-b@example.invalid",
    email_confirmed_at: state.unconfirmed ? undefined : "2026-10-22T10:00:00Z",
    created_at: "2026-10-22T10:00:00Z",
    app_metadata: { provider: "email" },
    user_metadata: {},
    is_anonymous: false,
  });
  const session = () => ({
    access_token: token(state.actor),
    refresh_token: "ci-fixture-only",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: user(),
  });
  const install = async (context) => {
    await context.route("https://**/*", (r) => r.abort());
    await context.routeWebSocket("**", (ws) => ws.close());
    await context.route(`${api}/**`, async (route) => {
      const req = route.request(),
        path = new URL(req.url()).pathname;
      const reply = (body, status = 200) =>
        route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify(body),
          headers: { "access-control-allow-origin": "*" },
        });
      if (req.method() === "OPTIONS") return reply({});
      if (path.includes("online_service_capabilities"))
        return reply({ registrationEnabled: true });
      if (path === "/auth/v1/signup")
        return state.failSignup
          ? reply(
              { code: "unexpected_failure", msg: "private backend detail" },
              500,
            )
          : reply({
              user: { ...user(), email_confirmed_at: undefined },
              session: null,
            });
      if (path === "/auth/v1/resend" || path === "/auth/v1/recover")
        return state.failEmail === "network"
          ? route.abort()
          : state.failEmail
            ? reply(
                { code: "over_email_send_rate_limit", msg: "private detail" },
                429,
              )
            : reply({});
      if (path === "/auth/v1/token") {
        const body = req.postDataJSON();
        state.actor = body.email?.startsWith("player-b") ? userB : state.actor;
        return reply(session());
      }
      if (path === "/auth/v1/user") {
        state.userChecks++;
        return state.failUser ? route.abort() : reply(user());
      }
      if (path === "/auth/v1/logout") return reply({});
      if (path === "/functions/v1/online-duel") {
        const { operation, body } = req.postDataJSON();
        if (operation === "account_bootstrap") return reply({ ready: true });
        if (operation === "inbox" && state.failInbox)
          return reply({ error: "SERVER_ERROR" }, 500);
        if (operation === "inbox")
          return reply({
            notifications:
              state.notifications ??
              (state.unread
                ? [
                    {
                      id: "ci-notification",
                      kind: "friend_request",
                      referenceId: "ci-friend",
                      createdAt: "2026-10-22T10:00:00Z",
                      read: false,
                    },
                  ]
                : []),
            challenges: state.challenges,
            unreadCount: state.unread,
          });
        if (operation === "notification_read") {
          state.readWrites++;
          if (state.failRead) return reply({ error: "SERVER_ERROR" }, 500);
          if (state.notifications)
            state.notifications = state.notifications.map((n) =>
              body.notificationId === "all" || n.id === body.notificationId
                ? { ...n, read: true }
                : n,
            );
          state.unread = state.notifications
            ? state.notifications.filter((n) => !n.read).length
            : 0;
          return reply({ saved: true });
        }
        if (operation === "self")
          return reply({
            profile: { name: state.actor === userB ? "Zeynep" : state.name },
            matches: [],
          });
        if (operation === "social_self")
          return reply({
            profile: {
              name: state.actor === userB ? "Zeynep" : state.name,
              username:
                state.actor === userB ? "ikinci_oyuncu" : state.username,
              avatar: 0,
              discoverable: false,
            },
            player: null,
          });
        if (operation === "username_check") {
          state.usernameChecks++;
          return reply({ available: true });
        }
        if (operation === "social_profile") {
          state.writes++;
          if (state.failSave) return reply({ error: "USERNAME_TAKEN" }, 409);
          state.username = body.username;
          assert.equal(body.name, state.name);
          assert.equal(body.avatar, 0);
          assert.equal(body.discoverable, false);
          return reply({ saved: true });
        }
        if (operation === "profile") {
          state.nameWrites++;
          if (state.failName) return reply({ error: "SERVER_ERROR" }, 500);
          assert.deepEqual(Object.keys(body), ["name"]);
          state.name = body.name;
          return reply({ profile: { name: state.name } });
        }
        if (operation === "friends")
          return reply({
            friendships: state.friendState
              ? [
                  {
                    id: "ci-friend",
                    state: state.friendState,
                    incoming: true,
                    player: {
                      id: userB,
                      name: "Deniz",
                      username: "deniz_bilgi",
                      avatar: 12,
                      xp: 300,
                      level: 2,
                    },
                  },
                ]
              : [],
          });
        if (operation === "friend_accept" || operation === "friend_remove") {
          assert.equal(body.friendshipId, "ci-friend");
          state.friendState = operation === "friend_accept" ? "accepted" : null;
          return reply({ saved: true });
        }
        if (operation === "challenge_reply") {
          const c = state.challenges.find((c) => c.id === body.challengeId);
          assert(
            c && c.state === "pending" && Date.parse(c.expiresAt) > Date.now(),
          );
          c.state =
            body.action === "accept"
              ? "accepted"
              : body.action === "decline"
                ? "declined"
                : "cancelled";
          if (c.state === "accepted") {
            c.matchId = "ci-match";
            c.matchState = "waiting_for_opponent";
          }
          if (state.failAfterChallenge) state.failInbox = true;
          return reply({ challenge: c });
        }
        if (operation === "get")
          return reply({
            id: "ci-match",
            state: "completed",
            createdAt: new Date().toISOString(),
            players: [
              { slot: "a", name: "Ayşe", score: 900 },
              { slot: "b", name: "Deniz", score: 800 },
            ],
            questions: [],
            answers: [],
            review: [],
            result: { winner: "a" },
          });
        if (operation === "achievement_self")
          return reply({
            earned: [],
            metrics: { friends: 0, opponents: 0, wins: 0, perfect: 0 },
            shared: false,
            showcase: [],
          });
        return reply({ error: "UNEXPECTED_FIXTURE_OPERATION" }, 400);
      }
      return reply({ error: "UNEXPECTED_FIXTURE_ROUTE" }, 400);
    });
  };
  return { state, install };
}
async function shot(page, name) {
  latestPage = page;
  await page.evaluate(async () => {
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
  const sizes = await page.evaluate(() => ({
    screen: innerWidth,
    width: document.documentElement.scrollWidth,
  }));
  assert(sizes.width <= sizes.screen + 2, `${name}: horizontal overflow`);
  await page.screenshot({ path: join(root, `${name}.png`) });
}
const button = (page, name) => page.getByRole("button", { name, exact: true });
const closeFeedback = async (page) => {
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Tamam", exact: true })
    .click();
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
};
async function login(page, email = "player-a@example.invalid") {
  await page.goto(`${origin}/online`, { waitUntil: "networkidle" });
  await page.getByLabel("E-posta", { exact: true }).fill(email);
  await page.getByLabel("Şifre", { exact: true }).fill("Synthetic_42_Test!");
  await button(page, "Giriş yap").click();
  await button(page, "Kullanıcı adım ve gizlilik").waitFor();
}
try {
  // Authenticated screenshots/actions use only disposable in-memory HTTP fixtures.
  for (const width of [320, 390, 430, 1024])
    for (const mode of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: width > 600 ? 1000 : 844 },
        colorScheme: mode,
        reducedMotion: "reduce",
      });
      const f = setup();
      await f.install(context);
      const p = await context.newPage();
      const player = {
        id: userB,
        name: "Deniz",
        username: "deniz_bilgi",
        avatar: 12,
        xp: 300,
        level: 2,
      };
      f.state.username = "ayse_34";
      const stamp = (minutes) =>
        new Date(Date.now() - minutes * 60000).toISOString();
      f.state.notifications = [
        {
          id: "ci-friend-notice",
          kind: "friend_request",
          referenceId: "ci-friend",
          createdAt: stamp(5),
          read: false,
        },
        {
          id: "ci-invite-notice",
          kind: "challenge_received",
          referenceId: "ci-invite",
          createdAt: stamp(10),
          read: false,
        },
        {
          id: "ci-expired-notice",
          kind: "challenge_received",
          referenceId: "ci-expired",
          createdAt: stamp(12),
          read: false,
        },
        {
          id: "ci-result-notice",
          kind: "match_completed",
          referenceId: "ci-match",
          createdAt: stamp(120),
          read: true,
        },
        {
          id: "ci-missing-notice",
          kind: "friend_accepted",
          referenceId: "ci-missing",
          createdAt: stamp(130),
          read: true,
        },
      ];
      f.state.unread = 3;
      f.state.challenges = [
        {
          id: "ci-invite",
          incoming: true,
          state: "pending",
          createdAt: stamp(10),
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
          matchId: null,
          matchState: null,
          player,
        },
        {
          id: "ci-expired",
          incoming: true,
          state: "pending",
          createdAt: stamp(12),
          expiresAt: stamp(1),
          matchId: null,
          matchState: null,
          player,
        },
      ];
      await login(p);
      for (const path of ["/", "/categories", "/profile", "/settings"]) {
        await p.goto(origin + path, { waitUntil: "networkidle" });
        if (path !== "/settings") await button(p, "Ayarlar").waitFor();
        if (path === "/profile") {
          await p.getByText("Ayşe", { exact: true }).waitFor();
          await p.getByText("@ayse_34", { exact: true }).waitFor();
        }
        if (path === "/settings")
          await p.getByLabel("Görünen ad", { exact: true }).waitFor();
        if (path === "/") {
          const first = p
            .getByRole("button", { name: /Kur’an ve Dualar|Kur'an ve Dualar/ })
            .first();
          await first.scrollIntoViewIfNeeded();
          await shot(p, `${mode}-${width}-home-category-top`);
          await p
            .getByRole("button", {
              name: /İslam Tarihi ve Medeniyeti.*yarışmanı hazırla/,
            })
            .scrollIntoViewIfNeeded();
          await shot(p, `${mode}-${width}-home-category-bottom`);
        }
        await shot(
          p,
          `${mode}-${width}-identity${path.replaceAll("/", "-") || "home"}`,
        );
      }
      await p.goto(origin + "/online/inbox", { waitUntil: "networkidle" });
      const request = p.getByRole("button", {
        name: /Yeni arkadaşlık isteği.*okunmamış/,
      });
      await request.waitFor();
      const headingBounds = await p
        .getByRole("heading", { name: "Bildirimler", exact: true })
        .boundingBox();
      assert(headingBounds.height < 45, "Inbox title must fit on one line");
      assert.equal(await button(p, "Kabul Et").count(), 0);
      assert.equal(await button(p, "Düelloyu Kabul Et").count(), 0);
      const box = await request.boundingBox();
      assert(box.height >= 64 && box.height <= 95);
      await shot(p, `${mode}-${width}-compact-inbox`);
      f.state.failRead = true;
      await request.click();
      await p.getByRole("dialog", { name: "Yeni arkadaşlık isteği" }).waitFor();
      assert(new URL(p.url()).pathname === "/online/inbox");
      await p.getByText(/Okundu bilgisi güncellenemedi/).waitFor();
      assert.equal(f.state.unread, 3);
      f.state.failRead = false;
      await button(p, "Okundu bilgisini yeniden dene").click();
      await p
        .getByText(/Okundu bilgisi güncellenemedi/)
        .waitFor({ state: "hidden" });
      assert.equal(f.state.unread, 2);
      await button(p, "Profili Gör").click();
      await p
        .getByText("Seviye 2 · 300 çevrimiçi XP", { exact: true })
        .waitFor();
      await shot(p, `${mode}-${width}-notification-detail`);
      await button(p, "Kabul Et").dblclick();
      await p
        .getByText("Arkadaşlık isteği kabul edildi.", { exact: true })
        .waitFor();
      assert.equal(f.state.friendState, "accepted");
      await button(p, "Pencereyi kapat").click();
      const writes = f.state.readWrites;
      await p
        .getByRole("button", { name: /Yeni arkadaşlık isteği.*okundu/ })
        .click();
      await p
        .getByText("Arkadaşlık isteği kabul edilmiş.", { exact: true })
        .waitFor();
      assert.equal(f.state.readWrites, writes);
      await button(p, "Pencereyi kapat").click();
      const invites = p.getByRole("button", {
        name: /Yeni düello daveti.*okunmamış/,
      });
      await invites.last().click();
      await p.getByText("Davetin süresi doldu", { exact: true }).waitFor();
      assert.equal(await button(p, "Düelloyu Kabul Et").count(), 0);
      await shot(p, `${mode}-${width}-expired-invite`);
      await button(p, "Pencereyi kapat").click();
      await p
        .getByRole("button", { name: /Yeni düello daveti.*okunmamış/ })
        .click();
      f.state.failAfterChallenge = true;
      await button(p, "Düelloyu Kabul Et").click();
      await button(p, "Maçı Gör").waitFor();
      assert.equal(f.state.challenges[0].state, "accepted");
      assert.equal(await button(p, "Düelloyu Kabul Et").count(), 0);
      assert.equal(await button(p, "Düelloyu Reddet").count(), 0);
      f.state.failInbox = false;
      f.state.failAfterChallenge = false;
      await button(p, "Durumu yenile").click();
      await button(p, "Pencereyi kapat").click();
      await p.getByRole("button", { name: /Düellonun sonucu hazır/ }).click();
      await p.getByText("Deniz · 800 puan", { exact: true }).waitFor();
      await button(p, "Sonuçları Gör").waitFor();
      await shot(p, `${mode}-${width}-result-notification`);
      await button(p, "Pencereyi kapat").click();
      await p
        .getByRole("button", { name: /Arkadaşlık isteğin kabul edildi/ })
        .click();
      await p.getByText(/Arkadaşlık kaydı artık bulunamıyor/).waitFor();
      assert.equal(await button(p, "Profili Gör").count(), 0);
      await button(p, "Pencereyi kapat").click();
      await p.goto(origin, { waitUntil: "networkidle" });
      await button(p, "Davetler ve Bildirimler").waitFor();
      checks.push(
        `${mode}-${width}: six topic art, separate identity/settings, compact list, read failure/retry/idempotency, friend accept, expired/accepted invite, real DTO scores, missing record`,
      );
      await context.close();
    }
  for (const width of [320, 375, 390, 430, 1024, 1440])
    for (const mode of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: width > 600 ? 900 : 844 },
        colorScheme: mode,
        reducedMotion: "reduce",
      });
      const fixture = setup();
      await fixture.install(context);
      const page = await context.newPage(),
        errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const path of [
        "/",
        "/categories",
        "/ranking",
        "/achievements",
        "/profile",
      ]) {
        await page.goto(origin + path, { waitUntil: "networkidle" });
        const gear = button(page, "Ayarlar");
        await gear.waitFor();
        assert.equal(
          await page
            .getByRole("tablist", { name: "Ana gezinme" })
            .getByRole("tab")
            .count(),
          5,
        );
        const bounds = await gear.boundingBox();
        assert(
          bounds &&
            bounds.width >= 44 &&
            bounds.height >= 44 &&
            bounds.x + bounds.width <= width + 1,
        );
        if (path === "/") {
          const bell = page.getByRole("button", {
            name: "Davetler ve Bildirimler",
            exact: true,
          });
          const b = await bell.boundingBox();
          assert(
            b && b.x + b.width <= bounds.x + 1 && Math.abs(b.y - bounds.y) <= 2,
          );
          await shot(page, `${mode}-${width}-home-header`);
        }
        if (path === "/profile")
          await shot(page, `${mode}-${width}-profile-header`);
        await gear.click();
        await page
          .getByRole("heading", { name: "Ayarlar", exact: true })
          .waitFor();
        if (path === "/") await shot(page, `${mode}-${width}-settings`);
        await button(page, "Ayarlardan geri dön").click();
        await page.waitForURL(origin + (path === "/" ? "/" : path));
      }
      await page.goto(`${origin}/online/inbox`, { waitUntil: "networkidle" });
      await page
        .getByText(/Bildirimlerini ve davetlerini görmek için/)
        .waitFor();
      assert.deepEqual(errors, []);
      checks.push(
        `${mode}-${width}: five settings entry/back routes, header geometry, guest inbox`,
      );
      await context.close();
    }
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const fixture = setup();
  await fixture.install(context);
  const { state } = fixture;
  const page = await context.newPage();
  await page.goto(`${origin}/online`, { waitUntil: "networkidle" });
  await button(page, "Hesap Oluştur").click();
  await page
    .getByLabel("E-posta", { exact: true })
    .fill("signup@example.invalid");
  await page.getByLabel("Şifre", { exact: true }).fill("Synthetic_42_Test!");
  await page
    .getByLabel("Şifreyi tekrarla", { exact: true })
    .fill("Synthetic_42_Test!");
  await button(page, "Hesabımı Oluştur").click();
  await page.getByRole("dialog", { name: "Doğrulama Bekleniyor" }).waitFor();
  assert.equal(
    await page.getByRole("dialog", { name: "E-posta Doğrulandı!" }).count(),
    0,
  );
  await shot(page, "registration-pending");
  await closeFeedback(page);
  state.failSignup = true;
  await page
    .getByLabel("E-posta", { exact: true })
    .fill("signup-error@example.invalid");
  await page.getByLabel("Şifre", { exact: true }).fill("Synthetic_42_Test!");
  await page
    .getByLabel("Şifreyi tekrarla", { exact: true })
    .fill("Synthetic_42_Test!");
  await button(page, "Hesabımı Oluştur").click();
  await page
    .getByRole("dialog", { name: "Hesap İşlemi Tamamlanamadı" })
    .waitFor();
  await shot(page, "registration-failure");
  await closeFeedback(page);
  state.failSignup = false;
  for (const fail of [false, true, "network"]) {
    state.failEmail = fail;
    await page.goto(`${origin}/online/verify-email`, {
      waitUntil: "networkidle",
    });
    await page
      .getByLabel("E-posta", { exact: true })
      .fill(fail ? "email-fail@example.invalid" : "email-ok@example.invalid");
    await button(page, "Doğrulama E-postasını Yeniden Gönder").click();
    await page
      .getByRole("dialog", {
        name: fail ? "E-posta Gönderilemedi" : "Doğrulama Bağlantısı İstendi",
      })
      .waitFor();
    await shot(
      page,
      fail === "network"
        ? "email-network"
        : fail
          ? "email-failure"
          : "email-request",
    );
    await closeFeedback(page);
  }
  state.failEmail = false;
  await login(page);
  state.unread = 3;
  await page.goto(`${origin}/settings`, { waitUntil: "networkidle" });
  await page
    .getByLabel("Benzersiz kullanıcı adı", { exact: true })
    .fill("bilgiyolcusu");
  await page.getByText("Kullanıcı adı uygun ✓", { exact: true }).waitFor();
  assert.equal(state.writes, 0);
  await button(page, "Çevrimiçi profili kaydet").dblclick();
  await page
    .getByRole("dialog", { name: "Kullanıcı Adın Kaydedildi" })
    .waitFor();
  assert.equal(state.writes, 1);
  await shot(page, "username-saved");
  await closeFeedback(page);
  assert.equal(await button(page, "Oyuncu Adını Kaydet").count(), 0);
  await page.goto(`${origin}/profile`, { waitUntil: "networkidle" });
  await page.getByText("Ayşe", { exact: true }).waitFor();
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.getByText("Ayşe", { exact: true }).waitFor();
  await page
    .getByRole("button", {
      name: "Davetler ve Bildirimler, 3 okunmamış",
      exact: true,
    })
    .waitFor();
  await shot(page, "home-username-unread");
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("Ayşe", { exact: true }).waitFor();
  await page
    .getByRole("button", {
      name: "Davetler ve Bildirimler, 3 okunmamış",
      exact: true,
    })
    .click();
  await button(page, "Tümünü Okundu İşaretle").click();
  await page.getByText("Henüz bildirim yok.", { exact: true }).waitFor();
  await page.goto(origin, { waitUntil: "networkidle" });
  await button(page, "Davetler ve Bildirimler").waitFor();
  await page.goto(`${origin}/settings`, { waitUntil: "networkidle" });
  state.failSave = true;
  await page
    .getByLabel("Benzersiz kullanıcı adı", { exact: true })
    .fill("taken_elsewhere");
  await page.getByText("Kullanıcı adı uygun ✓", { exact: true }).waitFor();
  await button(page, "Çevrimiçi profili kaydet").click();
  await page.getByRole("dialog", { name: "Profil Kaydedilemedi" }).waitFor();
  await page
    .getByText("Bu kullanıcı adı alınmış. Başka bir ad dene.", { exact: true })
    .waitFor();
  await shot(page, "username-taken-error");
  await closeFeedback(page);
  await page.goto(`${origin}/profile`, { waitUntil: "networkidle" });
  await page.getByText("Ayşe", { exact: true }).waitFor();
  await page.goto(`${origin}/settings`, { waitUntil: "networkidle" });
  await page.getByLabel("Görünen ad", { exact: true }).fill("Ayşe Nur");
  await button(page, "Görünen Adı Kaydet").click();
  await page.getByRole("dialog", { name: "Görünen Adın Kaydedildi" }).waitFor();
  assert.equal(state.nameWrites, 1);
  assert.equal(state.username, "bilgiyolcusu");
  await closeFeedback(page);
  state.failName = true;
  await page.getByLabel("Görünen ad", { exact: true }).fill("Kaydedilmeyen");
  await button(page, "Görünen Adı Kaydet").click();
  await page.getByRole("dialog", { name: "İsim Kaydedilemedi" }).waitFor();
  await closeFeedback(page);
  await page.goto(`${origin}/profile`, { waitUntil: "networkidle" });
  await page.getByText("Ayşe Nur", { exact: true }).waitFor();
  await page.getByText("@bilgiyolcusu", { exact: true }).waitFor();
  await shot(page, "profile-separate-identity");
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.getByText("Ayşe Nur", { exact: true }).waitFor();
  await page.goto(`${origin}/settings`, { waitUntil: "networkidle" });
  await shot(page, "settings-separate-fields");
  await button(page, "Hesaptan Çık").click();
  await page.getByRole("dialog", { name: "Oturum Kapatıldı" }).waitFor();
  await closeFeedback(page);
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.getByText("Oyuncu", { exact: true }).waitFor();
  assert.equal(
    await page.getByText("@bilgiyolcusu", { exact: true }).count(),
    0,
  );
  await login(page, "player-b@example.invalid");
  await page.goto(`${origin}/profile`, { waitUntil: "networkidle" });
  await page.getByText("@ikinci_oyuncu", { exact: true }).waitFor();
  await page.getByText("Zeynep", { exact: true }).waitFor();
  assert.equal(
    await page.getByText("@bilgiyolcusu", { exact: true }).count(),
    0,
  );
  checks.push(
    "fixture accounts: one explicit username write, immediate shared headers, reload, failed save retains old name, unread read/reset, signout and second-account isolation",
  );
  await context.close();
  for (const variant of [
    "success",
    "expired",
    "invalid",
    "network",
    "unconfirmed",
  ]) {
    const context = await browser.newContext({
        viewport: { width: 320, height: 760 },
        reducedMotion: "reduce",
      }),
      fixture = setup();
    fixture.state.failUser = variant === "network";
    fixture.state.unconfirmed = variant === "unconfirmed";
    await fixture.install(context);
    const page = await context.newPage();
    const suffix =
      variant === "expired"
        ? "#error=access_denied&error_code=otp_expired&error_description=PRIVATE_DETAIL"
        : variant === "invalid"
          ? "?irrelevant=1"
          : `#access_token=${token(userA)}&refresh_token=ci-fixture-only&type=signup`;
    await page.goto(`${origin}/online/auth${suffix}`, {
      waitUntil: "networkidle",
    });
    const dialog = page.getByRole("dialog", {
      name:
        variant === "success" ? "E-posta Doğrulandı!" : "Doğrulama Başarısız",
    });
    await dialog.waitFor();
    assert.equal(new URL(page.url()).search, "");
    assert.equal(new URL(page.url()).hash, "");
    assert(
      !(await page.locator("body").innerText()).includes("PRIVATE_DETAIL"),
    );
    await shot(page, `callback-${variant}`);
    if (variant === "success") {
      assert(fixture.state.userChecks > 0);
      await closeFeedback(page);
      assert.equal(await page.getByRole("dialog").count(), 0);
    }
    checks.push(
      `callback ${variant}: sanitized URL, persistent truthful result`,
    );
    await context.close();
  }
  await writeFile(
    join(root, "results.json"),
    JSON.stringify(
      {
        passed: true,
        checks,
        fixtureOnly: true,
        realEmailDeliveryTested: false,
        hostedDatabaseChanged: false,
      },
      null,
      2,
    ),
  );
  console.log(
    `${checks.length} settings/account browser groups passed (isolated fixtures, no SMTP or hosted writes).`,
  );
} catch (error) {
  if (latestPage && !latestPage.isClosed()) {
    await latestPage
      .screenshot({ path: join(root, "failure.png") })
      .catch(() => {});
    await writeFile(
      join(root, "failure.txt"),
      String(error) + "\n" + (await latestPage.locator("body").innerText()),
    ).catch(() => {});
  }
  throw error;
} finally {
  await browser.close();
}
