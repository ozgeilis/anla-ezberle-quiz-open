// Real browser AudioContext/buffer/gain playback, isolated local game records only.
import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import { audioProbe } from "./fixtures/audio-probe.mjs";
const require = createRequire(import.meta.url),
  pw = require(
    join(process.env.RUNNER_TEMP, "audio-node/node_modules/playwright"),
  );
const kind = process.env.AUDIO_BROWSER ?? "chromium",
  fixture = JSON.parse(await readFile("/tmp/anla-audio-fixture.json", "utf8"));
const origin = "http://127.0.0.1:8117",
  root = "artifacts/audio-" + kind,
  key = "@anla-ezberle-quiz/preferences/audio/v1";
await mkdir(root, { recursive: true });
const browser = await pw[kind].launch({ headless: true }),
  checks = [];
let last;
const btn = (p, name) => p.getByRole("button", { name, exact: true });
const pref = (p) =>
  p.evaluate((key) => JSON.parse(localStorage.getItem(key)), key);
async function untilPreference(p, field, value) {
  await p.waitForFunction(
    ({ key, field, value }) =>
      JSON.parse(localStorage.getItem(key))?.[field] === value,
    { key, field, value },
  );
}
async function state(p) {
  return p.evaluate(() => {
    const x = window.__soundProbe;
    return {
      starts: x.starts,
      stops: x.stops,
      decoded: x.decoded,
      peak: x.peak,
      maxEffects: x.maxEffects,
      contexts: x.contexts.map((c) => c.state),
      gains: x.gains.map((g) => g.node.gain.value),
    };
  });
}
async function shot(p, name) {
  last = p;
  await p.evaluate(() => document.fonts.ready);
  const w = await p.evaluate(() => ({
    w: innerWidth,
    s: document.documentElement.scrollWidth,
  }));
  assert(w.s <= w.w + 1, "overflow " + name);
  await p.screenshot({ path: join(root, name + ".png") });
}
async function open(p, path) {
  await p.goto(origin + path, { waitUntil: "networkidle" });
  await p.waitForFunction(() => window.__soundProbe.decoded === 11);
}
async function choose(p, correct = true) {
  await p.getByRole("button", { name: /^A\. / }).waitFor({ state: "visible" });
  const texts = await p.getByRole("heading").allTextContents();
  const question = texts.find((text) => fixture.questionOracle[text]);
  const answer = fixture.questionOracle[question];
  assert(answer, "Private local question oracle");
  const options = p.getByRole("button", { name: /^[ABCD]\. / });
  const names = await options.evaluateAll((es) =>
    es.map((e) => e.getAttribute("aria-label")),
  );
  const i = names.findIndex((n) => n.slice(3) === answer);
  assert(i >= 0);
  await options.nth(correct ? i : (i + 1) % 4).click();
  await p.getByTestId("answer-feedback").waitFor({ state: "visible" });
}
try {
  for (const width of [320, 390, 1024])
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: width > 700 ? 1000 : 844 },
        colorScheme: theme,
        reducedMotion: "reduce",
        ...(kind === "webkit" ? { hasTouch: true } : {}),
      });
      await context.route("https://**/*", (r) => r.abort());
      await context.addInitScript(audioProbe, { fixture, theme });
      const p = await context.newPage();
      last = p;
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await open(p, "/settings");
      await p
        .getByRole("switch", { name: "Ses Efektleri", exact: true })
        .waitFor();
      let s = await state(p);
      assert.equal(s.starts.length, 0, "No autoplay before gesture");
      assert.equal(
        await p
          .getByRole("switch", { name: "Ses Efektleri", exact: true })
          .isChecked(),
        true,
      );
      assert.equal(
        await p
          .getByRole("switch", { name: "Arka Plan Müziği", exact: true })
          .count(),
        0,
      );
      await shot(p, `${theme}-${width}-settings`);
      await btn(p, "Efekti dene").click();
      await p.waitForFunction(() =>
        window.__soundProbe.starts.some(
          (x) => Math.abs(x.duration - 0.68) < 0.01,
        ),
      );
      await p.waitForFunction(() => window.__soundProbe.peak > 0.001);
      s = await state(p);
      assert(
        s.starts.every((x) => x.state === "running"),
        "Only running, unlocked audio context plays",
      );
      await shot(p, `${theme}-${width}-audio-controls`);
      const before = (await pref(p))?.effectsVolume ?? 0.5;
      await btn(p, "Efekt Ses Seviyesi artır").click();
      await untilPreference(p, "effectsVolume", before + 0.1);
      assert.equal(
        await p
          .getByRole("slider", { name: "Efekt Ses Seviyesi", exact: true })
          .getAttribute("aria-valuenow"),
        "60",
      );
      await p.evaluate(() => {
        window.__soundProbe.failWrite = true;
      });
      await p
        .getByRole("switch", { name: "Ses Efektleri", exact: true })
        .click();
      await p
        .getByText(
          "Ses ayarları kaydedilemedi. Önceki ayarların korundu; yeniden deneyebilirsin.",
          { exact: true },
        )
        .waitFor();
      assert.equal(
        await p
          .getByRole("switch", { name: "Ses Efektleri", exact: true })
          .isChecked(),
        true,
      );
      assert.equal((await pref(p)).effectsEnabled, true);
      await p.evaluate(() => {
        window.__soundProbe.failWrite = false;
      });
      await p.reload({ waitUntil: "networkidle" });
      await p.waitForFunction(() => window.__soundProbe.decoded === 11);
      assert.equal(
        (await state(p)).starts.length,
        0,
        "No audio replay on reload",
      );
      assert.equal((await pref(p)).effectsVolume, 0.6);
      // Only one context per browser exercises complete games; layout/preferences cover every size/theme.
      if (width === 390 && theme === "light") {
        await p
          .getByRole("switch", { name: "Ses Efektleri", exact: true })
          .click();
        await untilPreference(p, "effectsEnabled", false);
        await p.goto(origin + "/", { waitUntil: "networkidle" });
        await p.waitForFunction(() => window.__soundProbe.decoded === 11);
        await p
          .getByRole("button", {
            name: "Günün Yarışması, 10 soru ile başla",
            exact: true,
          })
          .click();
        const beforeMuted = (await state(p)).starts.length;
        await choose(p, true);
        await p.waitForTimeout(800);
        assert.equal(
          (await state(p)).starts.length,
          beforeMuted,
          "Disabled effects do not play accepted answers",
        );
        await btn(p, "Yarışmadan ayrıl").click();
        await btn(p, "Turdan ayrıl").click();
        await p.goto(origin + "/settings", { waitUntil: "networkidle" });
        await p.waitForFunction(() => window.__soundProbe.decoded === 11);
        await p
          .getByRole("switch", { name: "Ses Efektleri", exact: true })
          .click();
        await untilPreference(p, "effectsEnabled", true);
        // Preloaded buffers remain playable with the actual browser network offline.
        await context.setOffline(true);
        await btn(p, "Efekti dene").click();
        await p.waitForFunction(() =>
          window.__soundProbe.starts.some(
            (x) => Math.abs(x.duration - 0.68) < 0.01,
          ),
        );
        await context.setOffline(false);
        await btn(p, "Ayarlardan geri dön").click();
        // A directly opened Settings screen returns to Profile, not Home.
        await p.getByRole("tab", { name: /Ana Sayfa/ }).click();
        await p
          .getByRole("button", {
            name: "Günün Yarışması, 10 soru ile başla",
            exact: true,
          })
          .click();
        await p.waitForURL(/\/quiz$/);
        await p.getByRole("button", { name: /^A\. / }).waitFor();
        const beforeGame = await state(p);
        assert(
          beforeGame.starts.every((x) => !x.loop),
          "No background music voice",
        );
        const marker = beforeGame.starts.length;
        for (let i = 0; i < 10; i++) {
          await choose(p, true);
          await p.waitForFunction(
            ({ marker, count }) =>
              window.__soundProbe.starts
                .slice(marker)
                .filter((x) => Math.abs(x.duration - 0.68) < 0.01).length ===
              count,
            { marker, count: i + 1 },
          );
          const after = await state(p),
            answerCount = after.starts.filter(
              (x, index) =>
                index >= marker && Math.abs(x.duration - 0.68) < 0.01,
            ).length;
          assert.equal(answerCount, i + 1, "Accepted answer once");
          if (i === 0) await shot(p, "accepted-correct-answer");
          await p.waitForTimeout(740);
          if (i < 9)
            await p.getByText(`Soru ${i + 2} / 10`, { exact: true }).waitFor();
        }
        await p.getByText("Tebrikler!", { exact: true }).waitFor();
        await p.waitForTimeout(5500);
        const events = (await state(p)).starts.slice(marker),
          count = (d) =>
            events.filter((x) => Math.abs(x.duration - d) < 0.01).length;
        assert.equal(count(1.88), 1, "Perfect result once");
        assert.equal(count(1.45), 1, "Actual saved 240→340 XP level-up once");
        assert(count(0.93) >= 1, "New badge chime");
        await shot(p, "perfect-result");
        const saved = await p.evaluate(
          (k) => JSON.parse(localStorage.getItem(k)),
          fixture.storageKey,
        );
        assert.equal(saved.games.length, 4);
        assert.deepEqual(
          saved.games.slice(0, 3),
          fixture.data.games,
          "Historical records unchanged",
        );
        const oldCount = count(1.88);
        await p.setViewportSize({ width: 430, height: 844 });
        await p.waitForTimeout(100);
        await p.setViewportSize({ width: 390, height: 844 });
        await p.waitForTimeout(300);
        assert.equal(
          (await state(p)).starts
            .slice(marker)
            .filter((x) => Math.abs(x.duration - 1.88) < 0.01).length,
          oldCount,
          "Rerender does not repeat result",
        );
        // A second real round with one wrong answer must use the ordinary completion cue.
        await p.goto(origin + "/", { waitUntil: "networkidle" });
        await p.waitForFunction(() => window.__soundProbe.decoded === 11);
        await p.getByRole("button", { name: /^Kur['’]an ve Dualar,/ }).click();
        await p.getByRole("radio", { name: /^Zorluk: Kolay$/ }).click();
        await btn(p, "Oyuna Başla").click();
        for (let i = 0; i < 10; i++) {
          await choose(p, i !== 0);
          await p.waitForTimeout(740);
          if (i < 9)
            await p.getByText(`Soru ${i + 2} / 10`, { exact: true }).waitFor();
        }
        await p.getByText("Tebrikler!", { exact: true }).waitFor();
        await p.waitForTimeout(5500);
        s = await state(p);
        assert(
          s.starts.some((x) => Math.abs(x.duration - 0.42) < 0.01),
          "Wrong answer feedback",
        );
        assert.equal(
          s.starts.filter((x) => Math.abs(x.duration - 1.38) < 0.01).length,
          1,
          "Ordinary completion once",
        );
        assert(s.maxEffects <= 1, "No overlapping effect voices");
        await shot(p, "ordinary-result");
        checks.push(
          `${kind}: actual perfect/ordinary games, accepted correct/wrong, new badge, true level-up, source waveform, offline buffers, no music, timed question gating, immutable old records`,
        );
      }
      s = await state(p);
      assert(
        s.contexts.filter((x) => x !== "closed").length <= 1,
        "One central AudioContext",
      );
      assert(s.maxEffects <= 1);
      assert.deepEqual(errors, []);
      checks.push(
        `${kind}-${theme}-${width}: real decoded assets, no autoplay, nonzero signal, gain control, saved preferences/reload, failed write rollback, responsive UI`,
      );
      await context.close();
    }
  await writeFile(
    join(root, "results.json"),
    JSON.stringify(
      { passed: true, browserEngine: kind, physicalDevice: false, checks },
      null,
      2,
    ),
  );
  console.log(checks.length + " " + kind + " audio/browser groups passed.");
} catch (e) {
  if (last && !last.isClosed()) {
    await last.screenshot({ path: join(root, "failure.png") });
    await writeFile(
      join(root, "failure-probe.json"),
      JSON.stringify(await state(last), null, 2),
    );
    await writeFile(
      join(root, "failure.txt"),
      String(e) + "\n" + (await last.locator("body").innerText()),
    );
  }
  throw e;
} finally {
  await browser.close();
}
