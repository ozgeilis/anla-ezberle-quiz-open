// Actual app/provider in Chromium; isolated synthetic Auth/API only. No real push send.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setup, userA, userB } from "./fixtures/account-http.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require(
  join(process.env.RUNNER_TEMP, "visual-node/node_modules/playwright"),
);
const origin = process.env.SETTINGS_ORIGIN ?? "http://127.0.0.1:8117";
const pendingKey = "@anla-quiz/push-pending";
const id = "33333333-3333-4333-8333-333333333333";
const output = "artifacts/push-navigation";
const checks = [];
const browser = await chromium.launch({
  headless: true,
  ...(process.env.SETTINGS_BROWSER_CHANNEL
    ? { channel: process.env.SETTINGS_BROWSER_CHANNEL }
    : {}),
});
await mkdir(output, { recursive: true });
try {
  for (const source of ["inbox", "room", "foreign"]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    const fixture = setup();
    fixture.state.username = "ayse_34";
    await fixture.install(context);
    let targetCalls = 0;
    await context.route(
      "http://127.0.0.1:55431/rest/v1/rpc/push_settings",
      async (route) => {
        if (route.request().postDataJSON()?.operation !== "target")
          return route.fallback();
        targetCalls++;
        // Failed and malformed responses must both use an internal, source-specific fallback.
        return route.fulfill({
          status: source === "room" ? 500 : 200,
          contentType: "application/json",
          body: JSON.stringify({
            url: "https://evil.invalid",
            code: "SYNTHETIC_LOOKUP_FAILURE",
          }),
        });
      },
    );
    const page = await context.newPage();
    await page.goto(origin + "/online", { waitUntil: "networkidle" });
    await page
      .getByLabel("E-posta", { exact: true })
      .fill("player-a@example.invalid");
    await page.getByLabel("Şifre", { exact: true }).fill("Synthetic_42_Test!");
    await page.getByRole("button", { name: "Giriş yap", exact: true }).click();
    await page
      .getByRole("button", { name: "Kullanıcı adım ve gizlilik", exact: true })
      .waitFor();
    await page.goto(origin + "/settings", { waitUntil: "networkidle" });
    await page.evaluate(
      ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
      {
        key: pendingKey,
        value: {
          version: 1,
          source: source === "room" ? "room" : "inbox",
          notificationId: id,
          recipientId: source === "foreign" ? userB : userA,
        },
      },
    );
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(
      (key) => localStorage.getItem(key) === null,
      pendingKey,
    );
    if (source === "foreign") {
      assert.equal(
        targetCalls,
        0,
        "Foreign account notification never queries a target",
      );
      assert.equal(new URL(page.url()).pathname, "/settings");
    } else {
      const expected =
        source === "room" ? "/live" : "/online/notification/" + id;
      await page.waitForURL((url) => url.pathname === expected);
      if (source === "room")
        assert.equal(new URL(page.url()).searchParams.get("room"), id);
      assert.equal(targetCalls, 1);
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(targetCalls, 1, "Consumed intent is not replayed on reload");
    }
    await page.screenshot({ path: join(output, source + ".png") });
    checks.push(
      source +
        ": account guard, allowlisted fallback, consumed storage and no replay",
    );
    await context.close();
  }
  await writeFile(
    join(output, "results.json"),
    JSON.stringify({ passed: true, physicalDevice: false, checks }, null, 2),
  );
  console.log(
    checks.length +
      " push navigation groups passed; no hosted requests or physical push claims.",
  );
} finally {
  await browser.close();
}
