// Real Chromium rendering against isolated HTTP fixtures, never a hosted account.
// All auth tokens/addresses below are synthetic and have no server authority.
import assert from "node:assert/strict";
import { setup, userA, userB, token } from "./fixtures/account-http.mjs";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(
  join(process.env.RUNNER_TEMP, "visual-node/node_modules/playwright"),
);
const origin = process.env.SETTINGS_ORIGIN ?? "http://127.0.0.1:8117",
  root = "artifacts/settings-account-ui";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.SETTINGS_BROWSER_CHANNEL
    ? { channel: process.env.SETTINGS_BROWSER_CHANNEL }
    : {}),
});
const checks = [];
let latestPage;
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
  for (const width of [320, 360, 390, 430, 1024])
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
        if (path === "/settings") {
          await button(p, "Profil").waitFor();
          assert.equal(
            await p.getByLabel("Görünen ad", { exact: true }).count(),
            0,
          );
          await button(p, "Bildirimler").waitFor();
        }
        if (path === "/") {
          assert.equal(
            await p.getByRole("button", { name: /yarışmanı hazırla/ }).count(),
            0,
          );
          const cta = await button(p, "Oyuna Başla").boundingBox();
          assert(
            cta.y + cta.height <= 844,
            "Primary play action must fit first screen",
          );
          await button(p, "Arkadaşlarınla Oyna").waitFor();
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
      await shot(p, `${mode}-${width}-notification-detail`);
      const modal = await p
        .getByRole("dialog", { name: "Yeni arkadaşlık isteği", exact: true })
        .boundingBox();
      assert(
        modal.width <= 380 && modal.height < 650,
        "Friend dialog must remain compact",
      );
      await button(p, "Profili Gör").click();
      await p
        .getByText("Seviye 2 · 300 çevrimiçi XP", { exact: true })
        .waitFor();
      await shot(p, `${mode}-${width}-notification-profile`);
      await button(p, "Bildirime Dön").click();
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
      await button(p, "Pencereyi kapat").click();
      await p.goto(origin + "/online/inbox", { waitUntil: "networkidle" });
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
        `${mode}-${width}: short home, separate identity/settings, compact list, read failure/retry/idempotency, friend accept, expired/accepted invite, real DTO scores, missing record`,
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
  await page.goto(`${origin}/settings/profile`, { waitUntil: "networkidle" });
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
  await page.goto(`${origin}/settings/profile`, { waitUntil: "networkidle" });
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
  await page.goto(`${origin}/settings/profile`, { waitUntil: "networkidle" });
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
  await page.goto(`${origin}/settings/profile`, { waitUntil: "networkidle" });
  await shot(page, "settings-separate-fields");
  await page.goto(`${origin}/settings/account`, { waitUntil: "networkidle" });
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
  // New menu hierarchy and transactional theme persistence on real rendering.
  {
    const context = await browser.newContext({
      viewport: { width: 320, height: 844 },
      colorScheme: "light",
    });
    const fixture = setup();
    await fixture.install(context);
    const page = await context.newPage();
    latestPage = page;
    await page.goto(`${origin}/settings`, { waitUntil: "networkidle" });
    for (const name of [
      "Profil",
      "Ses",
      "Tema",
      "Hesap",
      "Bildirimler",
      "Gizlilik",
      "Yardım",
    ])
      await button(page, name).waitFor();
    assert.equal(await page.getByRole("textbox").count(), 0);
    assert.equal(await page.getByRole("switch").count(), 0);
    await button(page, "Bildirimler").click();
    await page
      .getByRole("heading", { name: "Bildirim Ayarları", exact: true })
      .waitFor();
    assert.equal(await page.getByRole("switch").count(), 5);
    assert.equal(
      await page
        .getByRole("button", { name: "Bildirimleri görüntüle", exact: true })
        .count(),
      0,
    );
    await shot(page, "notification-preferences-web-unsupported");
    await button(page, "Ayarlardan geri dön").click();
    await button(page, "Tema").click();
    await page.getByRole("heading", { name: "Tema", exact: true }).waitFor();
    assert.equal(await page.getByRole("radio").count(), 3);
    const color = await page
      .getByRole("heading", { name: "Tema", exact: true })
      .evaluate((el) => getComputedStyle(el).color);
    await page
      .getByRole("radio", { name: "Koyu Tema ön izlemesi", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("heading", { name: "Tema", exact: true })
        .evaluate((el) => getComputedStyle(el).color),
      color,
    );
    await button(page, "Vazgeç").click();
    await button(page, "Tema").click();
    assert.equal(
      await page
        .getByRole("radio", { name: "Sistem temasını izle", exact: true })
        .getAttribute("aria-checked"),
      "true",
    );
    await page
      .getByRole("radio", { name: "Koyu Tema ön izlemesi", exact: true })
      .click();
    await button(page, "Kaydet").click();
    await page.getByRole("heading", { name: "Ayarlar", exact: true }).waitFor();
    await page.reload({ waitUntil: "networkidle" });
    await button(page, "Tema").click();
    assert.equal(
      await page
        .getByRole("radio", { name: "Koyu Tema ön izlemesi", exact: true })
        .getAttribute("aria-checked"),
      "true",
    );
    await page
      .getByRole("radio", { name: "Açık Tema ön izlemesi", exact: true })
      .click();
    await page.evaluate(() => {
      window.__settingsOriginalWrite = Storage.prototype.setItem;
      Storage.prototype.setItem = function () {
        throw new DOMException("Synthetic test quota", "QuotaExceededError");
      };
    });
    await button(page, "Kaydet").click();
    await page.getByText(/Kaydedilemedi. Önceki tercihin korundu/).waitFor();
    await shot(page, "theme-save-failure-keeps-old-theme");
    await page.evaluate(() => {
      Storage.prototype.setItem = window.__settingsOriginalWrite;
      delete window.__settingsOriginalWrite;
    });
    await button(page, "Vazgeç").click();
    await button(page, "Tema").click();
    assert.equal(
      await page
        .getByRole("radio", { name: "Koyu Tema ön izlemesi", exact: true })
        .getAttribute("aria-checked"),
      "true",
    );
    await page
      .getByRole("radio", { name: "Sistem temasını izle", exact: true })
      .click();
    await button(page, "Kaydet").click();
    checks.push(
      "settings menu: seven real detail routes, preference-only notifications, three theme previews, cancel/reopen, persistence, storage failure rollback",
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
