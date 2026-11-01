// Real local GoTrue + Mailpit only. Never contacts the hosted Auth service.
import { createRequire } from "node:module";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const root = resolve(process.env.PRIVATE_OUTPUT ?? "");
if (
  !isAbsolute(process.env.PRIVATE_OUTPUT ?? "") ||
  !relative(process.cwd(), root).startsWith(".." + sep)
)
  throw Error("Private output outside repository required");
const origin = process.env.LOCAL_AUTH_ORIGIN ?? "http://127.0.0.1:8171";
const mailbox = process.env.LOCAL_MAILPIT_ORIGIN ?? "http://127.0.0.1:55634";
for (const value of [origin, mailbox])
  if (!/^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/.test(value))
    throw Error("Only loopback local test services are allowed");
await mkdir(root, { recursive: true, mode: 0o700 });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROME_PATH,
  args: ["--no-first-run"],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const email = "web-" + randomUUID() + "@example.invalid",
  password = "Qa8!" + randomUUID();
let serverUser;
page.on("response", async (r) => {
  if (new URL(r.url()).pathname === "/auth/v1/user" && r.ok()) {
    const u = await r.json().catch(() => null);
    if (u?.id) serverUser = { id: u.id, confirmed: !!u.email_confirmed_at };
  }
});
try {
  await page.goto(origin + "/online");
  await page
    .getByRole("button", { name: "Hesap Oluştur", exact: true })
    .click();
  await page.getByLabel("E-posta", { exact: true }).fill(email);
  await page.getByLabel("Şifre", { exact: true }).fill(password);
  await page.getByLabel("Şifreyi tekrarla", { exact: true }).fill(password);
  await page
    .getByRole("button", { name: "Hesabımı Oluştur", exact: true })
    .click();
  await page.getByText("Doğrulama Bekleniyor", { exact: true }).waitFor();
  let message;
  for (let i = 0; i < 30; i++) {
    const msgs = await (await fetch(mailbox + "/api/v1/messages")).json();
    message = msgs.messages.find((m) => m.To?.some((t) => t.Address === email));
    if (message) break;
    await page.waitForTimeout(500);
  }
  assert(message, "SMTP message missing");
  const mail = await (
    await fetch(mailbox + "/api/v1/message/" + message.ID)
  ).json();
  const link = mail.HTML.match(
    /href="([^"]*\/auth\/v1\/verify[^\"]*)"/,
  )?.[1]?.replaceAll("&amp;", "&");
  assert(link, "ConfirmationURL missing");
  await page.goto(link);
  await page.waitForURL("**/profile", { timeout: 25000 });
  assert(serverUser?.confirmed, "No server-confirmed identity");
  await page.screenshot({ path: root + "/web-confirmed-profile.png" });
  await page.reload();
  await page.waitForTimeout(3000);
  await page.goto(origin + "/settings/account");
  await page.waitForTimeout(2000);
  const text = await page.locator("body").innerText();
  await writeFile(root + "/web-after-reload.private.txt", text, {
    mode: 0o600,
  });
  await writeFile(
    root + "/web-auth-result.json",
    JSON.stringify({
      environment: "isolated-local-GoTrue-and-Mailpit",
      signupViaRealUI: true,
      smtpDelivered: true,
      pkceConfirmationRedirect: true,
      serverVerifiedUser: true,
      profileAutomatic: true,
      reloadKeepsIdentity: text.includes(email),
    }),
  );
  await page.goto(origin + "/online/auth");
  await page.waitForURL("**/profile", { timeout: 10000 });
  const other = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await other.goto(link);
  await other
    .getByText(/Doğrulama bağlantısı geçersiz veya süresi dolmuş/)
    .waitFor({ timeout: 20000 });
  await other.screenshot({ path: root + "/web-reused-link.png" });
  await other.goto(origin + "/online/auth");
  await other
    .getByText(/Bu bağlantıda oturum bilgisi yok/)
    .waitFor({ timeout: 10000 });
  await other.screenshot({ path: root + "/web-missing-link.png" });
  console.log(
    "PASS reused-link rejection, finite missing-link screen, authenticated bare callback → profile",
  );
  console.log(
    "PASS real local SMTP signup → PKCE exchange → server verified identity → automatic profile",
  );
} catch (e) {
  await page.screenshot({ path: root + "/web-auth-failure.png" });
  console.log(
    "Local web auth failed: " +
      String(e.message).replace(/https?:\/\/\S+/g, "[URL omitted]"),
  );
  process.exitCode = 1;
} finally {
  await browser.close();
}
