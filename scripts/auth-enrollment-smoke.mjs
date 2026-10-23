// Actual hosted Auth + isolated project-owned browser. Admin-generated signup
// links send NO email and must never be reported as mailbox delivery evidence.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { createClient } from "@supabase/supabase-js";
const require = createRequire(import.meta.url),
  { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const ref = "mqyuihiobkomjfipxehj",
  url = `https://${ref}.supabase.co`,
  origin = "http://127.0.0.1:8121";
const dir = join(homedir(), ".local/share/anla-quiz-dev", ref);
const secret = (await readFile(join(dir, "server.env"), "utf8"))
  .match(/^SUPABASE_SERVICE_ROLE_KEY=(.+)$/m)?.[1]
  ?.trim();
const key = (await readFile(process.env.SOCIAL_CLIENT_ENV, "utf8"))
  .match(/^EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)$/m)?.[1]
  ?.trim();
const admin = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const test = JSON.parse(await readFile(join(dir, "testers.json"), "utf8"))
  .users[0];
const pending = JSON.parse(
  await readFile(join(dir, "gmail-smtp-test.json"), "utf8"),
);
const output = process.env.AUTH_ARTIFACT_DIR ?? "/tmp/gmail-auth-ui";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const checks = [];
let syntheticId;
let page;
try {
  page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  if (process.env.AUTH_LOCAL_FIXTURE) {
    const fixture = JSON.parse(
      await readFile(process.env.AUTH_LOCAL_FIXTURE, "utf8"),
    );
    await page.addInitScript(
      ({ fixture }) => {
        if (!localStorage.getItem(fixture.storageKey))
          localStorage.setItem(
            fixture.storageKey,
            JSON.stringify(fixture.data),
          );
      },
      { fixture },
    );
  }
  await page.goto(`${origin}/online`, { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "Şifremi Unuttum", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Şifremi Unuttum", exact: true })
    .waitFor();
  const send = page.getByRole("button", {
    name: "Şifre Sıfırlama Bağlantısı Gönder",
    exact: true,
  });
  assert(await send.isDisabled());
  await page
    .getByRole("textbox", { name: "E-posta", exact: true })
    .fill("limits@example.com");
  let requests = 0;
  await page.route("**/auth/v1/recover**", async (route) => {
    requests++;
    await route.fulfill({
      status: 429,
      headers: { "x-supabase-api-version": "2024-01-01" },
      contentType: "application/json",
      body: JSON.stringify({
        code: "over_email_send_rate_limit",
        error_code: "over_email_send_rate_limit",
        msg: "Email rate limit exceeded",
      }),
    });
  });
  await send.click();
  await page
    .getByText(
      "E-posta gönderim sınırına ulaşıldı. Bir süre sonra yeniden dene.",
      { exact: true },
    )
    .waitFor();
  await page.getByRole("button", { name: "Tamam", exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
  await send.click();
  await page
    .getByText(/Yeni e-posta istemeden önce \d+ saniye bekle/)
    .waitFor();
  assert.equal(requests, 1);
  checks.push(
    "forgot-password route, email validation, Turkish 429 and client resend cooldown (mocked failure, no email)",
  );
  await page.screenshot({
    path: join(output, "forgot-password-390.jpg"),
    type: "jpeg",
    quality: 80,
  });
  await page.goto(`${origin}/online/verify-email`, {
    waitUntil: "networkidle",
  });
  await page.route("**/auth/v1/resend**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
  );
  await page
    .getByRole("textbox", { name: "E-posta", exact: true })
    .fill("pending@example.com");
  await page
    .getByRole("button", {
      name: "Doğrulama E-postasını Yeniden Gönder",
      exact: true,
    })
    .click();
  await page
    .getByText(
      /Bu adresle doğrulama bekleyen bir hesap varsa yeni bağlantı gönderildi/,
    )
    .waitFor();
  checks.push(
    "verification resend has non-enumerating success message (mocked response, no email)",
  );
  await page.goto(`${origin}/online`, { waitUntil: "networkidle" });
  await page
    .getByRole("textbox", { name: "E-posta", exact: true })
    .fill(test.email);
  await page.getByLabel("Şifre", { exact: true }).fill("Incorrect_test_42!");
  await page.getByRole("button", { name: "Giriş yap", exact: true }).click();
  await page
    .getByText("E-posta veya şifre eşleşmedi. Bilgilerini kontrol et.", {
      exact: true,
    })
    .waitFor();
  await page.getByRole("button", { name: "Tamam", exact: true }).click();
  await page
    .getByRole("textbox", { name: "E-posta", exact: true })
    .fill(pending.email);
  await page.getByLabel("Şifre", { exact: true }).fill(pending.password);
  await page.getByRole("button", { name: "Giriş yap", exact: true }).click();
  await page
    .getByText("E-posta adresini doğruladıktan sonra giriş yapabilirsin.", {
      exact: true,
    })
    .waitFor();
  checks.push(
    "real Auth wrong-password and unverified-login errors are explained in Turkish",
  );
  const localBefore = await page.evaluate(() =>
    localStorage.getItem("@anla-ezberle-quiz/progress/v1"),
  );
  const signup = await admin.auth.admin.generateLink({
    type: "signup",
    email: `quiz-auth-${randomUUID()}@example.com`,
    password: `Quiz_42!${randomUUID()}`,
    options: { redirectTo: `${origin}/online/auth` },
  });
  assert(!signup.error && signup.data.properties?.action_link);
  syntheticId = signup.data.user.id;
  assert(!signup.data.user.email_confirmed_at);
  const link = signup.data.properties.action_link;
  await page.goto(link, { waitUntil: "networkidle" });
  await page
    .getByRole("dialog", { name: "E-posta Doğrulandı!", exact: true })
    .waitFor();
  assert.equal(new URL(page.url()).hash, "");
  assert.equal(new URL(page.url()).search, "");
  const confirmed = await admin.auth.admin.getUserById(syntheticId);
  assert(confirmed.data.user.email_confirmed_at);
  await page
    .getByRole("button", { name: "Profilime Git", exact: true })
    .click();
  await page.getByRole("heading", { name: "Profilim", exact: true }).waitFor();
  await page.getByRole("button", { name: "Ayarlar", exact: true }).click();
  await page.getByLabel("Benzersiz kullanıcı adı", { exact: true }).waitFor();
  // Verify the bootstrap through the public API using this new browser session.
  const onlineProfile = await page.evaluate(
    async ({ key, url, id }) => {
      const item = Object.values(sessionStorage)
        .map((x) => {
          try {
            return JSON.parse(x);
          } catch {
            return null;
          }
        })
        .find((x) => x?.user?.id === id && x?.access_token);
      if (!item) return { status: 0 };
      const r = await fetch(`${url}/functions/v1/online-duel`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${item.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ operation: "social_self", body: {} }),
      });
      const data = await r.json();
      return {
        status: r.status,
        ownIdentity: data.id === id || data.profile?.id === id,
        hasEmail: JSON.stringify(data).includes("@"),
      };
    },
    { key, url, id: syntheticId },
  );
  assert.equal(onlineProfile.status, 200);
  assert.equal(onlineProfile.hasEmail, false);
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("@anla-ezberle-quiz/progress/v1"),
    ),
    localBefore,
  );
  checks.push(
    "real signup link confirms fresh identity, clears URL credentials and provisions online profile; no email sent by generateLink",
  );
  await page.screenshot({
    path: join(output, "confirmed-settings-390.jpg"),
    type: "jpeg",
    quality: 80,
  });
  await page.goto(link, { waitUntil: "networkidle" });
  await page
    .getByText(
      "Doğrulama bağlantısı geçersiz veya süresi dolmuş. Yeni bağlantı iste.",
      { exact: true },
    )
    .waitFor();
  assert.equal(await page.getByLabel("Yeni şifre", { exact: true }).count(), 0);
  checks.push(
    "real consumed confirmation link is rejected and offers new verification/recovery routes",
  );
  for (const width of [320, 390, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${origin}/online/forgot-password`, {
      waitUntil: "networkidle",
    });
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.screenshot({
      path: join(output, `forgot-password-${width}.jpg`),
      type: "jpeg",
      quality: 78,
    });
  }
  checks.push("forgot-password layout fits 320px, 390px and tablet web");
  const dark = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "dark",
    reducedMotion: "reduce",
  });
  const darkPage = await dark.newPage();
  await darkPage.goto(`${origin}/online/forgot-password`, {
    waitUntil: "networkidle",
  });
  assert(
    await darkPage.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await darkPage.screenshot({
    path: join(output, "forgot-password-390-dark.jpg"),
    type: "jpeg",
    quality: 80,
  });
  await dark.close();
  checks.push("390px system dark theme has no horizontal overflow");
} catch {
  console.log("Completed enrollment groups:", checks);
  if (page)
    await page
      .screenshot({
        path: join(output, "failure.jpg"),
        type: "jpeg",
        quality: 75,
      })
      .catch(() => {});
  throw new Error(
    "Enrollment acceptance failed; credentials and confirmation URLs suppressed.",
  );
} finally {
  await browser.close();
  if (syntheticId) {
    const removed = await admin.auth.admin.deleteUser(syntheticId);
    assert(!removed.error);
  }
}
await writeFile(
  join(output, "enrollment-results.json"),
  JSON.stringify(
    {
      passed: true,
      checks,
      smtpDeliveryVerified: false,
      actualInboxLinkTested: false,
      physicalDevice: false,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `${checks.length} enrollment UI groups passed. Email delivery is not established by these tests.`,
);
