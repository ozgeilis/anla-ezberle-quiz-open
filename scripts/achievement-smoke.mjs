// Project-owned isolated browser; never reads the operator's browser/storage.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { join } from "node:path";
const require = createRequire(import.meta.url),
  { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const origin = "http://127.0.0.1:8121",
  output = process.env.UI_ARTIFACT_DIR ?? "/tmp/achievement-ui";
const fixture = JSON.parse(
  await readFile("/tmp/achievement-fixture.json", "utf8"),
);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true }),
  checks = [];
const errors = [];
let page;
let restore;
try {
  for (const width of process.env.UI_EXTRA_ONLY ? [] : [320, 390, 1024])
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        colorScheme: theme,
        reducedMotion: "reduce",
      });
      await context.addInitScript(
        ({ fixture, theme }) => {
          if (!localStorage.getItem(fixture.storageKey))
            localStorage.setItem(
              fixture.storageKey,
              JSON.stringify({
                ...fixture.data,
                profile: { ...fixture.data.profile, theme },
              }),
            );
        },
        { fixture, theme },
      );
      page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(origin + "/achievements", { waitUntil: "networkidle" });
      await page
        .getByRole("heading", { name: "Rozet koleksiyonun", exact: true })
        .waitFor();
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page
        .getByRole("button", { name: "Konular · 40", exact: true })
        .click();
      await page.getByRole("button", { name: "Kur'an", exact: true }).click();
      await page
        .getByText("4 rozet · Bronz → Gümüş → Altın → Elmas", { exact: true })
        .waitFor();
      await page.screenshot({
        path: join(output, `album-${width}-${theme}.jpg`),
        type: "jpeg",
        quality: 78,
      });
      await page
        .getByRole("button", { name: "Vitrine ekle", exact: true })
        .first()
        .click();
      await page.getByText("Vitrinin kaydedildi.", { exact: true }).waitFor();
      await page.goto(origin + "/profile", { waitUntil: "networkidle" });
      await page.getByText(/Rozet vitrinin · \d+ \/ 76/).waitFor();
      const stored = await page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)),
        fixture.storageKey,
      );
      assert.equal(stored.showcase.length, 1);
      assert.deepEqual(stored.games, fixture.data.games);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page.screenshot({
        path: join(output, `profile-${width}-${theme}.jpg`),
        type: "jpeg",
        quality: 76,
      });
      await page.goto(origin + "/achievements", { waitUntil: "networkidle" });
      await page
        .getByRole("button", { name: "Özel Zamanlar · 18", exact: true })
        .click();
      await page
        .getByText(/Özel zaman kategorileri henüz oynanabilir değil/)
        .waitFor();
      assert.equal(
        await page
          .getByRole("button", { name: "Vitrine ekle", exact: true })
          .count(),
        0,
      );
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page
        .getByRole("button", { name: "Genel · 12", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Kazanılan", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("button", { name: "Vitrine ekle", exact: true })
          .count(),
        3,
      );
      checks.push(
        `${width}px ${theme}: topic filters, locked seasonal collection, earned filter, persisted showcase, unchanged saved games`,
      );
      await context.close();
    }
  // Complete a real fresh daily round: no seeded achievements, no repeat-popup on reload.
  const fresh = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  page = await fresh.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(origin, { waitUntil: "networkidle" });
  await page
    .getByRole("button", {
      name: "Günün Yarışması, 10 soru ile başla",
      exact: true,
    })
    .click();
  for (let i = 0; i < 10; i++) {
    await page.getByText(`Soru ${i + 1} / 10`, { exact: true }).waitFor();
    const body = await page.locator("body").innerText();
    const q = fixture.answers.find((q) => body.includes(q.prompt));
    assert(q, "Known real question");
    await page
      .getByRole("button", { name: /^[ABCD]\. / })
      .filter({ has: page.getByText(q.answer, { exact: true }) })
      .click();
    await page
      .getByRole("button", {
        name: i === 9 ? "Sonucumu Gör" : "Sonraki Soru",
        exact: true,
      })
      .click();
  }
  await page
    .getByRole("button", { name: "Rozet ödül bildirimini kapat", exact: true })
    .waitFor();
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    fixture.storageKey,
  );
  assert.equal(saved.games.length, 1);
  assert.equal(saved.games[0].rewardVersion, 1);
  await page.getByText("10/10 doğru · 100 XP", { exact: true }).waitFor();
  await page.screenshot({
    path: join(output, "new-award-390.jpg"),
    type: "jpeg",
    quality: 80,
  });
  await page
    .getByRole("button", { name: "Rozet ödül bildirimini kapat", exact: true })
    .click();
  await page.goto(origin + "/achievements", { waitUntil: "networkidle" });
  assert.equal(
    await page
      .getByRole("button", {
        name: "Rozet ödül bildirimini kapat",
        exact: true,
      })
      .count(),
    0,
  );
  checks.push(
    "real 10-answer daily completion creates awards and a short reduced-motion notification; reload does not celebrate old awards",
  );
  await fresh.close();
  // Real hosted API: verified own achievements, privacy opt-in, no client XP/award claims.
  const ref = "mqyuihiobkomjfipxehj",
    url = `https://${ref}.supabase.co`;
  const env = await readFile(process.env.SOCIAL_CLIENT_ENV, "utf8"),
    key = env.match(/^EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)$/m)[1].trim();
  const user = JSON.parse(
    await readFile(
      join(homedir(), ".local/share/anla-quiz-dev", ref, "testers.json"),
      "utf8",
    ),
  ).users[0];
  const login = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, password: user.password }),
  });
  assert.equal(login.status, 200);
  const session = await login.json();
  const api = async (operation, body = {}) =>
    fetch(`${url}/functions/v1/online-duel`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation, body }),
    });
  const state = await api("achievement_self");
  assert.equal(state.status, 200);
  const initial = await state.json();
  restore = async () => {
    const r = await api("achievement_settings", {
      shared: initial.shared,
      showcase: initial.showcase,
    });
    assert.equal(r.status, 200);
  };
  assert.equal(
    (
      await api("achievement_settings", {
        shared: true,
        showcase: ["topic_quran_diamond"],
      })
    ).status,
    400,
  );
  assert.equal((await api("achievement_self", { xp: 100000 })).status, 400);
  const account = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await account.addInitScript(
    ({ session, ref }) => {
      const base = `anla-quiz-online-auth-v1.${ref}.supabase.co`;
      sessionStorage.setItem(base + ".tab-id", "achievement-ui");
      sessionStorage.setItem(base + ".achievement-ui", JSON.stringify(session));
    },
    { session, ref },
  );
  page = await account.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(origin + "/profile", { waitUntil: "networkidle" });
  const toggle = page.getByRole("switch", {
    name: "Çevrimiçi rozetlerimi paylaş",
    exact: true,
  });
  await toggle.waitFor();
  await toggle.click();
  await page
    .getByText("Çevrimiçi rozet gizliliğin kaydedildi.", { exact: true })
    .waitFor();
  const updated = await (await api("achievement_self")).json();
  assert.equal(updated.shared, !initial.shared);
  await page.screenshot({
    path: join(output, "online-privacy-390.jpg"),
    type: "jpeg",
    quality: 78,
  });
  checks.push(
    "real verified account reads server awards, toggles sharing; forged local badge and XP payloads rejected by Edge",
  );
  await account.close();
  assert.deepEqual(errors, []);
} catch {
  console.log("Completed achievement checks:", checks);
  if (page)
    await page
      .screenshot({
        path: join(output, "failure.jpg"),
        type: "jpeg",
        quality: 75,
      })
      .catch(() => {});
  throw new Error(
    "Achievement acceptance failed; private sessions and account credentials suppressed.",
  );
} finally {
  if (restore) await restore();
  await browser.close();
}
await writeFile(
  join(output, "results.json"),
  JSON.stringify(
    { passed: true, checks, physicalAndroid: false, physicalIos: false },
    null,
    2,
  ) + "\n",
);
console.log(`${checks.length} achievement UI groups passed.`);
