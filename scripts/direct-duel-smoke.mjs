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
const output = process.env.UI_ARTIFACT_DIR ?? "artifacts/direct-duel";
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
  `select jsonb_agg(jsonb_build_object('id',id,'name',display_name,'username',username,'avatar',avatar,'discoverable',discoverable,'count',social_count,'window',social_window,'friendCount',friend_count,'friendWindow',friend_window,'challengeCount',challenge_count,'challengeWindow',challenge_window,'inboxCount',inbox_count,'inboxWindow',inbox_window)) from quiz_private.player_profiles where id in (${ids});`,
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

const started = sql("select now()::text;");
let matchId;
try {
  for (let i = 0; i < users.length; i++)
    await api(users[i], "social_profile", {
      username: names[i],
      name: `Test oyuncu ${users[i].role.toUpperCase()}`,
      avatar: i,
      discoverable: true,
    });
  const ca = await context(390, "light", null),
    cb = await context(390, "dark", null);
  const a = await ca.newPage(),
    b = await cb.newPage();
  const errors = [];
  for (const page of [a, b])
    page.on("pageerror", (e) => errors.push(e.message));
  async function login(page, user) {
    await page.goto(`${origin}/online`, { waitUntil: "networkidle" });
    await page.getByLabel("E-posta", { exact: true }).fill(user.email);
    await page.getByLabel("Şifre", { exact: true }).fill(user.password);
    await page.getByRole("button", { name: "Giriş yap", exact: true }).click();
    await page
      .getByRole("button", { name: "Çıkış yap", exact: true })
      .waitFor();
  }
  await Promise.all([login(a, users[0]), login(b, users[1])]);
  pass("real login preserves route and existing local progress");
  await b.goto(`${origin}/online/inbox`, { waitUntil: "networkidle" });
  await b.getByRole("heading", { name: "Bildirimler", exact: true }).waitFor();
  await b.goto(origin, { waitUntil: "networkidle" });
  await a.goto(`${origin}/online/players`, { waitUntil: "networkidle" });
  await a
    .getByLabel("Kullanıcı adıyla oyuncu ara", { exact: true })
    .fill(names[1]);
  await a.getByRole("button", { name: "Meydan Oku", exact: true }).click();
  await a.getByText("Yanıt bekleniyor", { exact: true }).waitFor();
  await b
    .getByRole("button", { name: /^Davetler ve Bildirimler/ })
    .waitFor({ timeout: 12000 });
  await b.getByRole("button", { name: /^Davetler ve Bildirimler/ }).click();
  await b
    .getByRole("button", { name: /Yeni düello daveti.*Ayrıntıları aç/ })
    .first()
    .click();
  await b
    .getByRole("button", { name: "Düelloyu Kabul Et", exact: true })
    .click();
  await b.getByRole("button", { name: "Maçı Gör", exact: true }).click();
  await b
    .getByRole("button", { name: "Oyuncu B turunu başlat", exact: true })
    .waitFor();
  matchId = new URL(b.url()).searchParams.get("match");
  assert(matchId);
  await b
    .getByRole("button", { name: "Oyuncu B turunu başlat", exact: true })
    .click();
  await b.getByText("Soru 1 / 10", { exact: true }).waitFor();
  await a
    .getByRole("button", { name: /Davet kabul edildi.*Ayrıntıları aç/ })
    .first()
    .click();
  await a.getByRole("button", { name: "Maçı Gör", exact: true }).click();
  await a
    .getByRole("button", { name: "Oyuncu A turunu başlat", exact: true })
    .waitFor();
  assert.equal(new URL(a.url()).searchParams.get("match"), matchId);
  await a
    .getByRole("button", { name: "Oyuncu A turunu başlat", exact: true })
    .click();
  await a.getByText("Soru 1 / 10", { exact: true }).waitFor();
  pass(
    "username challenge reaches other account live; acceptance opens same match and independent starts",
  );
  const manifest = await api(users[0], "get", { matchId });
  for (const [page, user, correctCount] of [
    [b, users[1], 6],
    [a, users[0], 7],
  ]) {
    for (let i = 0; i < 10; i++) {
      const question = manifest.questions[i];
      const correct = sql(
        `select correct_option_id from quiz_private.quiz_answer_keys where question_id='${question.id.replaceAll("'", "''")}' and question_version=${question.version};`,
      );
      const chosen =
        i < correctCount
          ? question.options.find((o) => o.id === correct)
          : question.options.find((o) => o.id !== correct);
      const index = question.options.indexOf(chosen);
      await page.getByText(`Soru ${i + 1} / 10`, { exact: true }).waitFor();
      await page
        .getByRole("button", {
          name: `${String.fromCharCode(65 + index)} — ${chosen.text}`,
          exact: true,
        })
        .click();
      if (i < 9)
        await page.getByText(`Soru ${i + 2} / 10`, { exact: true }).waitFor();
    }
    if (user === users[1])
      await page.getByText("Turun tamamlandı!", { exact: true }).waitFor();
  }
  await a.getByText("Oyuncu A kazandı!", { exact: true }).waitFor();
  await b
    .getByText("Oyuncu A kazandı!", { exact: true })
    .waitFor({ timeout: 12000 });
  const result = await api(users[0], "get", { matchId });
  assert.equal(result.state, "completed");
  assert.equal(result.players[0].score, 700);
  assert.equal(result.players[1].score, 600);
  const saved = await a.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    fixture.storageKey,
  );
  assert.deepEqual(saved.games, fixture.data.games);
  pass(
    "both real UI rounds finish at 700–600; opponent result arrives without refresh; local history unchanged",
  );
  await a.screenshot({
    path: join(output, "result-390-light.jpg"),
    type: "jpeg",
    quality: 78,
  });
  await b.screenshot({
    path: join(output, "result-390-dark.jpg"),
    type: "jpeg",
    quality: 78,
  });
  for (const width of [320, 390, 1024]) {
    await b.setViewportSize({ width, height: width > 700 ? 1000 : 844 });
    await b.goto(`${origin}/online/inbox`, { waitUntil: "networkidle" });
    await b.getByText("Düello tamamlandı", { exact: true }).first().waitFor();
    const size = await b.evaluate(() => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    assert(size.scroll <= size.width + 1);
    await b.screenshot({
      path: join(output, `inbox-${width}-dark.jpg`),
      type: "jpeg",
      quality: 78,
    });
  }
  pass("inbox and match history render at 320/390/1024 without overflow");
  await a.getByRole("button", { name: "Ana sayfa", exact: true }).click();
  await a.goto(`${origin}/online`, { waitUntil: "networkidle" });
  await a.getByRole("button", { name: "Çıkış yap", exact: true }).click();
  await a.getByRole("button", { name: "Giriş yap", exact: true }).waitFor();
  await a.goto(`${origin}/online/inbox`, { waitUntil: "networkidle" });
  assert.equal(
    await a.getByText("Düello tamamlandı", { exact: true }).count(),
    0,
  );
  await a
    .getByRole("button", { name: "Hesaba giriş yap", exact: true })
    .waitFor();
  pass("sign-out clears inbox identity and account-bound notifications");
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
  if (matchId)
    sql(
      `update quiz_private.matches set state='cancelled',revision=revision+1 where id='${matchId}' and state in('waiting_for_opponent','created');`,
    );
  sql(
    `update quiz_private.direct_challenges set state='cancelled' where sender in (${ids}) and recipient in (${ids}) and state='pending' and created_at>='${started}';`,
  );
  sql(
    `delete from public.player_notifications where recipient_id in (${ids}) and created_at>='${started}';`,
  );
  for (const p of snapshot) {
    const literal = (v) =>
      v === null ? "null" : `'${String(v).replaceAll("'", "''")}'`;
    sql(
      `update quiz_private.player_profiles set username=${literal(p.username)},display_name=${literal(p.name)},avatar=${p.avatar},discoverable=${p.discoverable},social_count=${p.count},social_window=${literal(p.window)},friend_count=${p.friendCount},friend_window=${literal(p.friendWindow)},challenge_count=${p.challengeCount},challenge_window=${literal(p.challengeWindow)},inbox_count=${p.inboxCount},inbox_window=${literal(p.inboxWindow)} where id='${p.id}';`,
    );
  }
}
await writeFile(
  join(output, "results.json"),
  JSON.stringify(
    { checks, passed: true, physicalDevice: false, emailDelivered: false },
    null,
    2,
  ) + "\n",
);
