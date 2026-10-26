// Isolated headless browser acceptance against localhost + the closed-dev API.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const origin = process.env.UI_BASE_URL ?? "http://127.0.0.1:8121";
assert(new URL(origin).hostname === "127.0.0.1");
const output = process.env.UI_ARTIFACT_DIR ?? "artifacts/player-system";
await mkdir(output, { recursive: true });
const fixture = JSON.parse(
  await readFile("/tmp/player-system-fixture.json", "utf8"),
);
const ref = "mqyuihiobkomjfipxehj",
  url = `https://${ref}.supabase.co`;
const env = await readFile(process.env.SOCIAL_CLIENT_ENV, "utf8");
const key = env
  .match(/^EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)$/m)?.[1]
  ?.trim();
const users = JSON.parse(
  await readFile(
    join(homedir(), ".local/share/anla-quiz-dev", ref, "testers.json"),
    "utf8",
  ),
).users.slice(0, 2);
const cli = process.env.QUIZ_SUPABASE_BIN ?? "supabase";
function sql(query) {
  try {
    return (
      Object.values(
        JSON.parse(
          execFileSync(
            cli,
            [
              "db",
              "query",
              "--linked",
              "--project-ref",
              ref,
              "--output-format",
              "json",
              query,
            ],
            { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
          ),
        ).rows?.[0] ?? {},
      )[0] ?? null
    );
  } catch {
    throw new Error("Private database command failed");
  }
}
for (const u of users) {
  const r = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: u.email, password: u.password }),
  });
  assert.equal(r.status, 200);
  u.session = await r.json();
}
async function api(user, operation, body = {}) {
  const r = await fetch(`${url}/functions/v1/online-duel`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${user.session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ operation, body }),
  });
  assert.equal(r.status, 200, operation);
  return r.json();
}
const ids = users.map((u) => `'${u.id}'`).join(",");
const snapshot = sql(
  `select jsonb_agg(jsonb_build_object('id',id,'name',display_name,'username',username,'avatar',avatar,'discoverable',discoverable,'count',social_count,'window',social_window,'friendCount',friend_count,'friendWindow',friend_window)) from quiz_private.player_profiles where id in (${ids});`,
);
assert.equal(
  Number(
    sql(
      `select count(*) from quiz_private.friendships where sender in (${ids}) and recipient in (${ids});`,
    ),
  ),
  0,
);
const suffix = Date.now().toString().slice(-6),
  names = [`ui_a_${suffix}`, `ui_b_${suffix}`];
const browser = await chromium.launch({
  channel: process.env.UI_BROWSER_CHANNEL ?? "chrome",
  headless: true,
});
const checks = [];
const pass = (name) => {
  checks.push(name);
  console.log(`PASS ${name}`);
};
const contexts = [];
async function context(width, theme, user) {
  const c = await browser.newContext({
    viewport: { width, height: width > 700 ? 1000 : 844 },
    colorScheme: theme,
    reducedMotion: "reduce",
  });
  contexts.push(c);
  await c.addInitScript(
    ({ fixture, theme, user, ref }) => {
      if (!localStorage.getItem(fixture.storageKey))
        localStorage.setItem(
          fixture.storageKey,
          JSON.stringify({
            ...fixture.data,
            profile: { ...fixture.data.profile, theme, reduceMotion: true },
          }),
        );
      if (user) {
        const base = `anla-quiz-online-auth-v1.${ref}.supabase.co`;
        const tabId = "social-ui-test";
        sessionStorage.setItem(`${base}.tab-id`, tabId);
        sessionStorage.setItem(
          `${base}.${tabId}`,
          JSON.stringify(user.session),
        );
      }
    },
    { fixture, theme, user, ref },
  );
  return c;
}
try {
  for (let i = 0; i < users.length; i++)
    await api(users[i], "social_profile", {
      username: names[i],
      name: "Sosyal Test",
      avatar: i,
      discoverable: true,
    });
  for (const width of [320, 390, 1024])
    for (const theme of ["light", "dark"]) {
      const c = await context(width, theme, users[0]);
      const p = await c.newPage();
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      for (const [route, heading] of [
        ["profile", "Senin yolculuğun"],
        ["online/players", "Oyuncu Ara"],
        ["categories", "Beş aşamada keşfet"],
      ]) {
        await p.goto(`${origin}/${route}`, { waitUntil: "networkidle" });
        await p.getByText(heading, { exact: true }).waitFor();
        if (route === "profile")
          await p.getByText(`@${names[0]}`, { exact: true }).waitFor();
        if (route === "online/players") {
          await p
            .getByLabel("Kullanıcı adıyla oyuncu ara", { exact: true })
            .fill(names[1]);
          await p.getByText(`@${names[1]}`, { exact: true }).waitFor();
        }
        if (route === "categories")
          await p
            .getByText("Beş aşamada keşfet", { exact: true })
            .evaluate((el) => el.scrollIntoView({ block: "start" }));
        const size = await p.evaluate(() => ({
          width: innerWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        assert(
          size.scroll <= size.width + 1,
          `overflow ${route}/${width}/${theme}`,
        );
        if (width === 390 || width === 1024)
          await p.screenshot({
            path: join(
              output,
              `${route.replaceAll("/", "-")}-${width}-${theme}.jpg`,
            ),
            type: "jpeg",
            quality: 78,
          });
      }
      assert.deepEqual(errors, []);
      await c.close();
      pass(`responsive authenticated screens ${width}/${theme}`);
    }
  const ca = await context(390, "light", users[0]),
    cb = await context(390, "dark", users[1]);
  const a = await ca.newPage(),
    b = await cb.newPage();
  await a.goto(`${origin}/settings/profile`, { waitUntil: "networkidle" });
  const username = a.getByLabel("Benzersiz kullanıcı adı", { exact: true });
  await username.fill("admin");
  await a
    .getByText("Bu kullanıcı adına izin verilmiyor. Başka bir ad seç.", {
      exact: true,
    })
    .waitFor();
  await username.fill(names[1]);
  await a.getByText("Bu kullanıcı adı alınmış.", { exact: true }).waitFor();
  assert(
    await a
      .getByRole("button", { name: "Çevrimiçi profili kaydet", exact: true })
      .isDisabled(),
  );
  await username.fill(names[0]);
  await a.getByText("Kullanıcı adı uygun ✓", { exact: true }).waitFor();
  pass("live invalid/taken/available username validation");
  const privacy = a.getByRole("switch", {
    name: "Oyuncu aramada bulunabilirim",
    exact: true,
  });
  await privacy.click();
  await a
    .getByRole("button", { name: "Çevrimiçi profili kaydet", exact: true })
    .click();
  await a
    .getByRole("dialog", { name: "Kullanıcı Adın Kaydedildi", exact: true })
    .waitFor();
  await a.getByRole("button", { name: "Tamam", exact: true }).click();
  assert.equal(
    (await api(users[1], "player_search", { query: names[0] })).players.length,
    0,
  );
  await privacy.click();
  await a
    .getByRole("button", { name: "Çevrimiçi profili kaydet", exact: true })
    .click();
  await a
    .getByRole("dialog", { name: "Kullanıcı Adın Kaydedildi", exact: true })
    .waitFor();
  await a.getByRole("button", { name: "Tamam", exact: true }).click();
  pass("privacy choice persists and hides search results");
  await a.goto(`${origin}/online/players`, { waitUntil: "networkidle" });
  await a
    .getByLabel("Kullanıcı adıyla oyuncu ara", { exact: true })
    .fill(names[1]);
  await a.getByRole("button", { name: "Arkadaş Ekle", exact: true }).click();
  await a.getByText("Arkadaşlık isteği gönderildi.", { exact: true }).waitFor();
  await b.goto(`${origin}/online/players`, { waitUntil: "networkidle" });
  await b.getByRole("button", { name: "Kabul Et", exact: true }).click();
  await b
    .getByText("Arkadaşlık isteği kabul edildi.", { exact: true })
    .waitFor();
  await a.getByRole("button", { name: "Listeyi yenile", exact: true }).click();
  await a
    .getByRole("button", { name: "Arkadaşlıktan Çıkar", exact: true })
    .waitFor();
  await a
    .getByRole("button", { name: "Arkadaşlıktan Çıkar", exact: true })
    .click();
  await a.getByText("Arkadaşlık kaydı kaldırıldı.", { exact: true }).waitFor();
  pass("real cross-account friendship send/accept/remove in UI");
  await a.route("**/functions/v1/online-duel", (route) => route.abort());
  await a.goto(`${origin}/online/players`, { waitUntil: "networkidle" });
  await a.getByRole("alert").waitFor();
  assert((await a.getByRole("alert").innerText()).includes("Bağlantı"));
  for (const title of ["Başlangıç", "Gelişen", "Bilgili", "İleri", "Usta"]) {
    await a.goto(`${origin}/categories`, { waitUntil: "networkidle" });
    const stage = a.getByRole("radio", {
      name: new RegExp(`^${title} aşaması`),
    });
    await stage.click();
    await a
      .getByRole("radio", {
        name: "Karma: Tüm öğrenme konularından sorular",
        exact: true,
      })
      .click();
    assert.equal(await stage.getAttribute("aria-checked"), "true");
    await a.getByRole("button", { name: "Oyuna Başla", exact: true }).click();
    await a.getByText("Soru 1 / 10", { exact: true }).waitFor();
  }
  pass("offline service error is clear; all five stages start without backend");
  for (let i = 0; i < 10; i++) {
    await a.getByText(`Soru ${i + 1} / 10`, { exact: true }).waitFor();
    let answer;
    for (const item of fixture.answers)
      if (await a.getByText(item.prompt, { exact: true }).count()) {
        answer = item.answer;
        break;
      }
    assert(answer, "Real current question resolves to answer fixture");
    const options = a.getByRole("button", { name: /^[ABCD]\. / });
    let picked = false;
    for (const option of await options.all())
      if ((await option.getAttribute("aria-label")).slice(3) === answer) {
        await option.click();
        picked = true;
        break;
      }
    assert(picked, "Correct shuffled option found");
    await a
      .getByText(
        i === 9 ? "Sonucun bu cihazda kaydedildi. ✓" : `Soru ${i + 2} / 10`,
        { exact: true },
      )
      .waitFor();
  }
  await a
    .getByText("Seviye atladın! Seviye 2 · Yeni yolcu", { exact: true })
    .waitFor();
  assert.equal(
    await a.getByTestId("result-confetti").count(),
    0,
    "Reduced motion suppresses celebration",
  );
  const saved = await a.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    fixture.storageKey,
  );
  assert.equal(saved.games.length, fixture.data.games.length + 1);
  assert.equal(saved.games.at(-1).stage, "master");
  await a.screenshot({
    path: join(output, "level-up-390-reduced-motion.jpg"),
    type: "jpeg",
    quality: 78,
  });
  pass(
    "stage completion persists, XP crosses level boundary, reduced motion suppresses confetti",
  );

  const cg = await context(320, "light", null);
  const guest = await cg.newPage();
  await guest.goto(`${origin}/online/players`, { waitUntil: "networkidle" });
  await guest
    .getByRole("button", { name: "Hesaba giriş yap", exact: true })
    .waitFor();
  assert.equal(
    await guest
      .getByLabel("Kullanıcı adıyla oyuncu ara", { exact: true })
      .count(),
    0,
  );
  pass("guest receives sign-in gate, no fabricated online identity");
} finally {
  await browser.close();
  sql(
    `delete from quiz_private.friendships where sender in (${ids}) and recipient in (${ids});`,
  );
  for (const p of snapshot) {
    const literal = (v) =>
      v === null ? "null" : `'${String(v).replaceAll("'", "''")}'`;
    sql(
      `update quiz_private.player_profiles set username=${literal(p.username)},display_name=${literal(p.name)},avatar=${p.avatar},discoverable=${p.discoverable},social_count=${p.count},social_window=${literal(p.window)},friend_count=${p.friendCount},friend_window=${literal(p.friendWindow)} where id='${p.id}';`,
    );
  }
}
await writeFile(
  join(output, "results.json"),
  JSON.stringify({ checks, passed: true, physicalDevice: false }, null, 2) +
    "\n",
);
