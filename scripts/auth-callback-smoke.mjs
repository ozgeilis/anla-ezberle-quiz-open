// Uses an admin-generated recovery link for one dedicated synthetic account.
// generateLink sends NO email. This is not an SMTP delivery test.
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
const privateDir = join(homedir(), ".local/share/anla-quiz-dev", ref);
const secretEnv = await readFile(join(privateDir, "server.env"), "utf8");
const secret = secretEnv
  .match(/^SUPABASE_SERVICE_ROLE_KEY=(.+)$/m)?.[1]
  ?.trim();
assert(secret?.startsWith("sb_secret_"));
const publicEnv = await readFile(process.env.SOCIAL_CLIENT_ENV, "utf8");
const key = publicEnv
  .match(/^EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)$/m)?.[1]
  ?.trim();
const user = JSON.parse(
  await readFile(join(privateDir, "testers.json"), "utf8"),
).users[0];
const admin = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const output = process.env.AUTH_ARTIFACT_DIR ?? "/tmp/direct-auth-ui";
await mkdir(output, { recursive: true });
const checks = [];
let page;
try {
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email: user.email,
    options: { redirectTo: `${origin}/online/auth` },
  });
  assert(!error && data.properties?.action_link, "Recovery link generation");
  page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await page.goto(data.properties.action_link, { waitUntil: "networkidle" });
  await page
    .getByText("Yeni şifreni belirleyebilirsin.", { exact: true })
    .waitFor();
  assert.equal(new URL(page.url()).hash, "");
  assert.equal(new URL(page.url()).pathname, "/online/auth");
  checks.push(
    "real Auth recovery callback exchanges session and scrubs credentials from URL",
  );
  await page.getByRole("button", { name: "Tamam", exact: true }).click();
  const password = `Duel_42_New!${randomUUID().slice(0, 8)}`;
  await page.getByLabel("Yeni şifre", { exact: true }).fill(password);
  await page
    .getByLabel("Yeni şifreyi tekrarla", { exact: true })
    .fill(password);
  await page
    .getByRole("button", { name: "Yeni Şifreyi Kaydet", exact: true })
    .click();
  await page
    .getByRole("dialog", { name: "Şifren Kaydedildi", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Tamam", exact: true }).click();
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const signed = await client.auth.signInWithPassword({
    email: user.email,
    password,
  });
  assert(!signed.error, "New password login");
  await client.auth.signOut({ scope: "local" });
  checks.push("new password is persisted by Auth and can sign in");
  await page.goto(
    `${origin}/online/auth#error=access_denied&error_code=otp_expired`,
    { waitUntil: "networkidle" },
  );
  await page
    .getByText(
      "Doğrulama bağlantısı geçersiz veya süresi dolmuş. Yeni bağlantı iste.",
      { exact: true },
    )
    .waitFor();
  assert.equal(await page.getByLabel("Yeni şifre", { exact: true }).count(), 0);
  checks.push("expired recovery link shows safe error and no reset form");
  await page.goto(`${origin}/online`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Çıkış yap", exact: true }).click();
  await page
    .getByRole("button", { name: "Hesap Oluştur", exact: true })
    .click();
  const capabilities = await (
    await fetch(`${url}/rest/v1/rpc/online_service_capabilities`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: "{}",
    })
  ).json();
  if (capabilities.registrationEnabled) {
    await page.getByLabel("E-posta", { exact: true }).fill("test@example.com");
    await page.getByLabel("Şifre", { exact: true }).fill("Sample_42_Strong!");
    await page
      .getByLabel("Şifreyi tekrarla", { exact: true })
      .fill("Sample_42_Strong!");
    assert(
      await page
        .getByRole("button", { name: "Hesabımı Oluştur", exact: true })
        .isEnabled(),
    );
  } else
    assert(
      await page
        .getByRole("button", { name: "Hesabımı Oluştur", exact: true })
        .isDisabled(),
    );
  checks.push("registration reflects server enrollment capability");
  await page.screenshot({
    path: join(output, "registration.jpg"),
    type: "jpeg",
    quality: 78,
  });
} catch {
  console.log("Completed Auth stages:", checks);
  if (page) {
    await page
      .screenshot({
        path: join(output, "failure.jpg"),
        type: "jpeg",
        quality: 78,
      })
      .catch(() => {});
    const body = await page
      .locator("body")
      .innerText()
      .catch(() => "");
    console.log(
      "Auth page:",
      body.replaceAll(user.email, "[test email]").slice(0, 1600),
    );
  }
  throw new Error(
    "Auth callback acceptance failed (sensitive URL and credentials suppressed)",
  );
} finally {
  await browser.close();
  const restored = await admin.auth.admin.updateUserById(user.id, {
    password: user.password,
  });
  assert(!restored.error, "Synthetic account password restoration");
}
await writeFile(
  join(output, "results.json"),
  JSON.stringify(
    { checks, passed: true, emailDelivered: false, physicalDevice: false },
    null,
    2,
  ) + "\n",
);
console.log(
  `${checks.length} Auth callback groups passed. No email was sent; SMTP delivery remains unverified.`,
);
