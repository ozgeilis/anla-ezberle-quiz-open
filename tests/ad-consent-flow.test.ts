import assert from "node:assert/strict";
import test from "node:test";
import {
  consentBlockMessage,
  presentPrivacyOptions,
} from "../src/features/ads/consentFlow";

const context = {
  enabled: true,
  loaded: true,
  eligible: true,
  busy: false,
  playing: false,
  foreground: true,
  path: "/settings/privacy",
};

test("manual privacy controls are allowed on the real privacy route, never over gameplay", () => {
  assert.equal(consentBlockMessage(context, true), null);
  assert.equal(consentBlockMessage({ ...context, path: "/" }, true), null);
  for (const path of [
    "/quiz",
    "/results",
    "/online",
    "/live",
    "/account-delete",
    "/settings/account",
  ])
    assert.match(consentBlockMessage({ ...context, path }, true)!, /Ana Sayfa/);
  assert.match(
    consentBlockMessage({ ...context, playing: true }, true)!,
    /Devam eden turu/,
  );
  assert.match(
    consentBlockMessage({ ...context, foreground: false }, true)!,
    /ön plana/,
  );
  assert.ok(consentBlockMessage(context, false));
  assert.equal(consentBlockMessage({ ...context, path: "/" }, false), null);
});

test("ineligible, loading and concurrent requests are explained without weakening guards", () => {
  for (const change of [
    { enabled: false },
    { loaded: false },
    { eligible: false },
    { busy: true },
  ])
    assert.ok(consentBlockMessage({ ...context, ...change }, true));
});

test("privacy options are presented only for a fresh REQUIRED SDK decision", async () => {
  let calls = 0;
  let close!: () => void;
  const pending = presentPrivacyOptions("REQUIRED", () => {
    calls++;
    return new Promise<void>((resolve) => {
      close = resolve;
    });
  });
  let completed = false;
  void pending.then(() => {
    completed = true;
  });
  await Promise.resolve();
  assert.equal(calls, 1);
  assert.equal(
    completed,
    false,
    "User reading time must not be treated as consent completion",
  );
  close();
  assert.equal(await pending, true);
});

test("NOT_REQUIRED is distinguished from a shown form; UNKNOWN fails closed", async () => {
  let calls = 0;
  const show = async () => {
    calls++;
  };
  assert.equal(await presentPrivacyOptions("NOT_REQUIRED", show), false);
  for (const status of ["UNKNOWN", "", "unexpected"])
    await assert.rejects(presentPrivacyOptions(status, show), /unknown/);
  assert.equal(calls, 0);
});

test("native form failure is propagated and a subsequent manual retry is possible", async () => {
  await assert.rejects(
    presentPrivacyOptions("REQUIRED", async () => {
      throw Error("native unavailable");
    }),
    /native unavailable/,
  );
  assert.equal(await presentPrivacyOptions("REQUIRED", async () => {}), true);
});
