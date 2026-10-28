// Real rendered application with synthetic engine history. No hosted user data.
// Browser viewports/text stress are not physical Android/iPhone acceptance.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setup } from "./fixtures/account-http.mjs";
const require = createRequire(import.meta.url);
const { chromium, webkit } = require(
  join(process.env.RUNNER_TEMP, "visual-node/node_modules/playwright"),
);
const baseline = process.argv.includes("--baseline");
const origin = process.env.SETTINGS_ORIGIN ?? "http://127.0.0.1:8117";
const root = process.env.HOME_SCREENSHOTS ?? "artifacts/home-cards";
const fixture = JSON.parse(
  await readFile(
    process.env.HOME_FIXTURE_PATH ?? "/tmp/anla-home-card-fixture.json",
    "utf8",
  ),
);
await mkdir(root, { recursive: true });
const engine = process.env.HOME_BROWSER === "webkit" ? webkit : chromium;
const browser = await engine.launch({
  headless: true,
  ...(engine === chromium && process.env.SETTINGS_BROWSER_CHANNEL
    ? { channel: process.env.SETTINGS_BROWSER_CHANNEL }
    : {}),
});
const checks = [];
const btn = (p, name) => p.getByRole("button", { name, exact: true });
let current;
async function ready(p) {
  await p.getByTestId("studio-intro").waitFor({ state: "hidden" });
  await p.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((i) =>
        i.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              i.onload = resolve;
              i.onerror = resolve;
            }),
      ),
    );
  });
}
async function shot(p, name) {
  assert(
    await p.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    name + " horizontal overflow",
  );
  await p.screenshot({ path: join(root, name + ".png") });
}
try {
  for (const width of [320, 360, 390])
    for (const theme of ["light", "dark"])
      for (const state of baseline
        ? ["empty", "daily"]
        : ["empty", "history", "daily"]) {
        const ctx = await browser.newContext({
          viewport: { width, height: 844 },
          colorScheme: theme,
          reducedMotion: "reduce",
        });
        await setup().install(ctx);
        const f = fixture.scenarios[state];
        await ctx.addInitScript(
          ({ key, data }) => {
            if (!localStorage.getItem(key))
              localStorage.setItem(key, JSON.stringify(data));
          },
          { key: fixture.storageKey, data: f.data },
        );
        const p = await ctx.newPage();
        current = p;
        const errors = [];
        p.on("pageerror", (e) => errors.push(e.message));
        await p.goto(origin, { waitUntil: "networkidle" });
        await btn(p, "Oyuna Başla").waitFor();
        await ready(p);
        const id = `${baseline ? "before" : "after"}-${width}-${theme}-${state}`;
        await shot(p, id + "-top");
        const dailyLabel =
          state === "daily"
            ? "Günün Yarışması tamamlandı, skor geçmişini gör"
            : "Günün Yarışması, 10 soru ile başla";
        await btn(p, dailyLabel).scrollIntoViewIfNeeded();
        if (f.dailyScore !== null)
          await btn(p, dailyLabel)
            .getByText(`${f.dailyScore} puan · Tamamlandı`, { exact: true })
            .waitFor();
        const score = btn(p, "Son skor ve kişisel geçmiş"),
          badges = btn(p, "Kazanılan rozetler");
        await score
          .getByText(f.lastScore === null ? "—" : String(f.lastScore), {
            exact: true,
          })
          .waitFor();
        await badges
          .getByText(`${f.earned} / ${f.totalBadges}`, { exact: true })
          .waitFor();
        await badges.scrollIntoViewIfNeeded();
        await shot(p, id + "-cards");
        assert(!/\b1[.,]?500\s*soru/.test(await p.locator("body").innerText()));
        if (!baseline) {
          const cards = p.locator('[data-testid^="home-card-"]');
          assert.equal(await cards.count(), 4);
          const boxes = await cards.evaluateAll((items) =>
            items.map((e) => {
              const r = e.getBoundingClientRect();
              return { x: r.x, y: r.y, width: r.width, height: r.height };
            }),
          );
          assert(Math.abs(boxes[0].width - boxes[1].width) < 1);
          assert(Math.abs(boxes[0].height - boxes[1].height) < 1);
          assert(Math.abs(boxes[2].height - boxes[3].height) < 1);
          assert(
            boxes.every(
              (b) =>
                b.width > 120 &&
                b.height >= 48 &&
                b.x >= 0 &&
                b.x + b.width <= width + 1,
            ),
          );
          const paints = await cards.evaluateAll((items) =>
            items.map(
              (e) =>
                Array.from(e.querySelectorAll("*"))
                  .map((n) => getComputedStyle(n).backgroundImage)
                  .find((v) => v.includes("linear-gradient")) ?? "none",
            ),
          );
          assert(paints.every((p) => p.includes("linear-gradient")));
          assert.equal(new Set(paints).size, 4);
          assert((await btn(p, "Oyuna Başla").boundingBox()).height <= 54);
        }
        if (width === 390 && theme === "light" && state === "daily") {
          await p.goto(origin + "/profile", { waitUntil: "networkidle" });
          await ready(p);
          await p.getByText("İstatistiklerim", { exact: true }).waitFor();
          await shot(p, `${baseline ? "before" : "after"}-profile`);
        }
        assert.deepEqual(errors, []);
        checks.push(`${id}: real fixture values, gradients/layout/overflow`);
        await ctx.close();
      }
  if (!baseline) {
    const ctx = await browser.newContext({
      viewport: { width: 320, height: 844 },
      reducedMotion: "reduce",
    });
    await setup().install(ctx);
    const p = await ctx.newPage();
    current = p;
    for (const [name, target] of [
      ["Oyuna Başla", "/categories"],
      ["Arkadaşlarınla Oyna", "/live"],
      ["Son skor ve kişisel geçmiş", "/ranking?section=personal"],
      ["Kazanılan rozetler", "/achievements"],
      ["Günün Yarışması, 10 soru ile başla", "/quiz"],
    ]) {
      await p.goto(origin, { waitUntil: "networkidle" });
      await ready(p);
      await btn(p, name).click();
      await p.waitForURL((u) => u.pathname + u.search === target);
      checks.push(`Existing navigation ${name} → ${target}`);
    }
    for (const scale of [1.5, 2]) {
      await p.goto(origin, { waitUntil: "networkidle" });
      await ready(p);
      await p.getByTestId("home-card-social").evaluate((e, scale) => {
        const home = e.closest('[data-testid="compact-home"]');
        for (const t of home.querySelectorAll(
          '[data-testid^="home-card-"] [dir="auto"]',
        )) {
          const s = getComputedStyle(t);
          if (!s.fontFamily.includes("Manrope")) continue;
          t.style.fontSize = parseFloat(s.fontSize) * scale + "px";
          t.style.lineHeight = parseFloat(s.lineHeight) * scale + "px";
        }
      }, scale);
      await btn(p, "Kazanılan rozetler").scrollIntoViewIfNeeded();
      await shot(p, `text-stress-${scale}`);
      assert(
        await p
          .locator('[data-testid^="home-card-"] [dir="auto"]')
          .evaluateAll((items) =>
            items.every(
              (e) =>
                e.scrollWidth <= e.clientWidth + 1 &&
                e.scrollHeight <= e.clientHeight + 1,
            ),
          ),
        "Large text must not be clipped",
      );
      checks.push(
        `Browser text stress ${scale * 100}% (not native system scale)`,
      );
    }
    await ctx.close();
  }
  await writeFile(
    join(
      root,
      `results-${baseline ? "before" : (process.env.HOME_BROWSER ?? "chromium")}.json`,
    ),
    JSON.stringify(
      {
        checks,
        physicalAndroid: false,
        physicalIphone: false,
        hostedWrites: false,
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS ${checks.length} home card groups${baseline ? " (baseline)" : ""}`,
  );
} catch (e) {
  if (current && !current.isClosed())
    await current.screenshot({ path: join(root, "failure.png") });
  throw e;
} finally {
  await browser.close();
}
