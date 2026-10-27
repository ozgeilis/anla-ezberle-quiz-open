// Real Chromium + synthetic HTTP only. This is NOT a real Google OAuth test.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setup, userA, token } from "./fixtures/account-http.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require(
  join(process.env.RUNNER_TEMP, "visual-node/node_modules/playwright"),
);
const origin = process.env.SETTINGS_ORIGIN ?? "http://127.0.0.1:8189";
const root = "artifacts/google-auth";
await mkdir(root, { recursive: true });
const browser = await chromium.launch({
  ...(process.env.SETTINGS_BROWSER_CHANNEL
    ? { channel: process.env.SETTINGS_BROWSER_CHANNEL }
    : {}),
  headless: true,
});
const checks = [];
const button = (p, name) => p.getByRole("button", { name, exact: true });
try {
  for (const width of [320, 360, 390])
    for (const mode of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: 844 },
        colorScheme: mode,
        reducedMotion: "reduce",
      });
      await setup().install(context);
      const p = await context.newPage();
      await p.goto(origin + "/online", { waitUntil: "networkidle" });
      assert(await button(p, "Google ile Devam Et").isDisabled());
      await button(p, "Hesap Oluştur").click();
      await p
        .getByLabel("E-posta", { exact: true })
        .fill("synthetic@example.invalid");
      for (const value of ["Aa1!aaa", "Aa1!aaaa", "Existing_12!"]) {
        await p.getByLabel("Şifre", { exact: true }).fill(value);
        await p.getByLabel("Şifreyi tekrarla", { exact: true }).fill(value);
        assert.equal(
          await button(p, "Hesabımı Oluştur").isEnabled(),
          value.length >= 8,
        );
      }
      await p.getByLabel("Şifre", { exact: true }).fill("");
      await p.getByLabel("Şifreyi tekrarla", { exact: true }).fill("");
      await button(p, "Giriş ekranına dön").click();
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      await p.screenshot({
        path: `${root}/login-${width}-${mode}.png`,
        fullPage: true,
      });
      checks.push(
        `${width}/${mode}: closed Google, 7/8/12 boundaries, no horizontal overflow`,
      );
      await context.close();
    }
  {
    const context = await browser.newContext({
      viewport: { width: 320, height: 844 },
      reducedMotion: "reduce",
    });
    await setup().install(context);
    const p = await context.newPage();
    await p.goto(
      origin +
        "/online/auth#access_token=" +
        token(userA) +
        "&refresh_token=synthetic-refresh&type=recovery",
      { waitUntil: "networkidle" },
    );
    await p
      .getByRole("dialog")
      .getByRole("button", { name: "Tamam", exact: true })
      .click();
    for (const value of ["Aa1!aaa", "Aa1!aaaa"]) {
      await p.getByLabel("Yeni şifre", { exact: true }).fill(value);
      await p.getByLabel("Yeni şifreyi tekrarla", { exact: true }).fill(value);
      assert.equal(
        await button(p, "Yeni Şifreyi Kaydet").isEnabled(),
        value.length === 8,
      );
    }
    assert.equal(new URL(p.url()).hash, "");
    checks.push(
      "Existing email recovery callback + 7/8 password boundary; mock Auth only",
    );
    await context.close();
  }
  // Mock the provider redirect, exercise real Supabase SDK PKCE challenge/exchange,
  // verified-identity transfer, callback scrubbing and existing session persistence.
  for (const scenario of [
    "success",
    "foreign-identity",
    "bad-nonce",
    "cancel",
  ]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    await setup().install(context);
    let challenge,
      exchange = 0,
      verified = 0;
    const googleUser = {
      id: userA,
      email: "synthetic@example.invalid",
      email_confirmed_at: new Date().toISOString(),
      is_anonymous: false,
      identities: [
        { provider: "google", id: "synthetic-google" },
        { provider: "email", id: "synthetic-passwordless-email" },
      ],
      app_metadata: { provider: "google" },
      user_metadata: {},
    };
    const reply = (route, data) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(data),
      });
    await context.route("**/rest/v1/rpc/google_auth_capabilities", (r) =>
      reply(r, { googleOAuthEnabled: true, googleDeletionEnabled: true }),
    );
    await context.route("**/rest/v1/rpc/online_service_capabilities", (r) =>
      reply(r, { registrationEnabled: true, accountDeletionEnabled: true }),
    );
    await context.route("**/functions/v1/account-delete", async (r) => {
      const body = r.request().postDataJSON();
      if (body.operation === "google-code")
        return reply(r, { challenge: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" });
      assert.deepEqual(Object.keys(body).sort(), [
        "challenge",
        "confirmation",
        "googleCode",
      ]);
      assert.equal(body.googleCode, "12345678");
      assert.equal(body.confirmation, "DELETE");
      return r.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({ error: "REAUTHENTICATION_REQUIRED" }),
      });
    });
    await context.route("**/auth/v1/authorize**", async (r) => {
      const u = new URL(r.request().url());
      challenge = u.searchParams.get("code_challenge");
      assert(challenge);
      assert.equal(u.searchParams.get("code_challenge_method"), "s256");
      const target = new URL(u.searchParams.get("redirect_to"));
      if (scenario === "bad-nonce")
        target.searchParams.set("attempt", "foreign");
      if (scenario === "cancel") {
        target.searchParams.set("error", "access_denied");
        target.searchParams.set("error_description", "PRIVATE_DO_NOT_RENDER");
      } else target.searchParams.set("code", "synthetic-code");
      await r.fulfill({
        status: 302,
        headers: { location: target.toString() },
        body: "",
      });
    });
    await context.route("**/auth/v1/token**", async (r) => {
      exchange++;
      const b = r.request().postDataJSON();
      assert.equal(b.auth_code, "synthetic-code");
      assert.equal(
        createHash("sha256").update(b.code_verifier).digest("base64url"),
        challenge,
      );
      return reply(r, {
        access_token: token(userA),
        refresh_token: "synthetic-refresh",
        expires_in: 3600,
        token_type: "bearer",
        user: googleUser,
      });
    });
    await context.route("**/auth/v1/user", (r) => {
      verified++;
      return reply(
        r,
        scenario === "foreign-identity"
          ? { ...googleUser, id: "33333333-3333-4333-8333-333333333333" }
          : googleUser,
      );
    });
    const p = await context.newPage();
    await p.goto(origin + "/online", { waitUntil: "networkidle" });
    if (scenario === "success")
      await p
        .getByText("Kovynel Studio", { exact: true })
        .waitFor({ state: "hidden" });
    if (scenario === "success") await button(p,"Google ile Devam Et").click({trial:true});
    if (scenario === "success")
      await p.screenshot({
        path: `${root}/google-enabled-390.png`,
        fullPage: true,
      });
    await button(p, "Google ile Devam Et").click();
    if (scenario === "success") {
      await p.waitForURL("**/profile");
      assert(verified >= 2);
      assert.equal(exchange, 1);
      await p.reload({ waitUntil: "networkidle" });
      // Only the existing main session is persisted; OAuth transport has no disk session.
      const keys = await p.evaluate(() => Object.keys(sessionStorage));
      assert(!keys.includes("anla-google-pkce-transaction-v1"));
      assert(!keys.some((k) => k.endsWith("code-verifier")));
      assert(!keys.includes("anla-google-pkce-attempt-v1"));
      await p.goto(origin + "/account-delete", { waitUntil: "networkidle" });
      await button(p, "Hesabımı silme adımlarını aç").click();
      await button(p, "Anladım, ikinci onaya geç").click();
      assert.equal(
        await p
          .getByLabel("Hesap silme için güncel parola", { exact: true })
          .count(),
        0,
      );
      await button(p, "Doğrulama kodu gönder").click();
      await p
        .getByRole("dialog")
        .getByText("Kod e-postana gönderildi. Beş dakika içinde kullan.", {
          exact: true,
        })
        .waitFor();
      await p
        .getByLabel("Hesap silme doğrulama kodu", { exact: true })
        .fill("12345678");
      await p.getByLabel("Silme onayı, SİL yaz", { exact: true }).fill("SİL");
      await button(p, "Hesabımı kalıcı olarak sil").click();
      await p
        .getByRole("dialog")
        .getByText(
          "Silme tamamlandığı doğrulanamadı. Yeni bir kod isteyip tekrar dene. Giriş yapamıyorsan destek adresine ulaş.",
          { exact: true },
        )
        .waitFor();
      assert(await button(p, "Hesabımı kalıcı olarak sil").isDisabled());
      await p.screenshot({
        path: `${root}/google-deletion-proof-390.png`,
        fullPage: true,
      });
      checks.push(
        "Google-linked deletion UI (email identity is not proof of a password): two confirmations, OTP instead of password, rejected proof cannot claim success (mock)",
      );
    } else {
      await p
        .getByRole("dialog", { name: "Doğrulama Başarısız", exact: true })
        .waitFor();
      assert.equal(new URL(p.url()).search, "");
      assert.equal(new URL(p.url()).hash, "");
      assert(
        !(await p.locator("body").innerText()).includes(
          "PRIVATE_DO_NOT_RENDER",
        ),
      );
      assert.equal(exchange, scenario === "foreign-identity" ? 1 : 0);
    }
    checks.push(
      `Mock provider: ${scenario}; PKCE/nonce/server identity boundary`,
    );
    await context.close();
  }
  await writeFile(
    root + "/results.json",
    JSON.stringify(
      {
        scope:
          "Chromium rendering + mock HTTP; no real Google login, device or hosted mutation",
        checks,
      },
      null,
      2,
    ),
  );
  console.log(
    `${checks.length} Google/password browser groups passed (mock provider only).`,
  );
} finally {
  await browser.close();
}
