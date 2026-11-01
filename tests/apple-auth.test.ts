import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AppleAttemptGuard,
  appleIdentityToken,
  appleDisplayName,
  appleServerIdentity,
  appleCapability,
} from "../src/features/online/appleFlow";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const require = createRequire(import.meta.url);
const { resolveIosBuild } = require("../config/ios.js");
test("Apple native proof requires matching random state and a token", () => {
  assert.equal(
    appleIdentityToken(
      { state: "attempt", identityToken: "synthetic-proof" },
      "attempt",
    ),
    "synthetic-proof",
  );
  for (const proof of [
    { state: "foreign", identityToken: "SECRET" },
    { state: null, identityToken: "SECRET" },
    { state: "attempt", identityToken: null },
  ])
    assert.throws(
      () => appleIdentityToken(proof, "attempt"),
      (e) => e instanceof Error && !e.message.includes("SECRET"),
    );
});
test("Apple relay email never becomes an account matching key; identity comes from verified server actor", () => {
  const user = {
    id: "actor-a",
    email_confirmed_at: "confirmed",
    identities: [{ provider: "apple" }],
  };
  assert.equal(appleServerIdentity(user, "actor-a"), true);
  assert.equal(appleServerIdentity(user, "actor-b"), false);
  assert.equal(
    appleServerIdentity(
      { ...user, identities: [{ provider: "google" }] },
      "actor-a",
    ),
    false,
  );
  assert.equal(
    appleServerIdentity({ ...user, is_anonymous: true }, "actor-a"),
    false,
  );
  assert.equal(
    appleServerIdentity({ ...user, email_confirmed_at: undefined }, "actor-a"),
    false,
  );
});
test("first-authorization Apple display name is optional, bounded and not overwritten with null", () => {
  assert.equal(
    appleDisplayName({
      state: null,
      identityToken: null,
      fullName: { givenName: "  Ada ", familyName: " Test " },
    }),
    "Ada Test",
  );
  assert.equal(appleDisplayName({ state: null, identityToken: null }), "");
  assert.equal(
    appleDisplayName({
      state: null,
      identityToken: null,
      fullName: { givenName: "a".repeat(500) },
    }).length,
    100,
  );
});
test("Apple availability fails closed until login, deletion and grant revocation are accepted server-side", () => {
  for (const flags of [
    null,
    {},
    { appleOAuthEnabled: true },
    { appleOAuthEnabled: true, appleDeletionEnabled: true },
    {
      appleOAuthEnabled: "true",
      appleDeletionEnabled: true,
      appleRevocationEnabled: true,
    },
  ])
    assert.equal(appleCapability(flags), false);
  assert.equal(
    appleCapability({
      appleOAuthEnabled: true,
      appleDeletionEnabled: true,
      appleRevocationEnabled: true,
    }),
    true,
  );
});
test("iOS preparation preserves prototype identity; TestFlight cannot silently adopt proposed identifier", () => {
  assert.deepEqual(resolveIosBuild({}, "com.anlaezberle.quiz.prototype"), {
    bundleIdentifier: "com.anlaezberle.quiz.prototype",
    appleAuthentication: false,
  });
  assert.equal(
    resolveIosBuild({ IOS_APPLE_AUTH: "1" }, "old").appleAuthentication,
    true,
  );
  assert.throws(() =>
    resolveIosBuild({ EAS_BUILD_PROFILE: "ios-testflight" }, "old"),
  );
  assert.equal(
    resolveIosBuild(
      {
        EAS_BUILD_PROFILE: "ios-testflight",
        IOS_REGISTERED_BUNDLE_ID: "com.kovynelstudio.anlaezberle",
      },
      "old",
    ).bundleIdentifier,
    "com.kovynelstudio.anlaezberle",
  );
  assert.equal(
    resolveIosBuild(
      {
        EAS_BUILD_PROFILE: "ios-testflight",
        IOS_REGISTERED_BUNDLE_ID: "com.kovynelstudio.anlaezberle",
      },
      "com.anlaezberle.quiz.prototype",
    ).appleTeamId,
    "W7CRC43SHP",
  );
  // EAS CLI resolves app config before the worker's EAS_BUILD_PROFILE exists.
  const localStore = resolveIosBuild(
    {
      IOS_BUILD_TARGET: "store",
      IOS_REGISTERED_BUNDLE_ID: "com.kovynelstudio.anlaezberle",
    },
    "com.anlaezberle.quiz.prototype",
  );
  assert.equal(localStore.bundleIdentifier, "com.kovynelstudio.anlaezberle");
  assert.equal(localStore.appleTeamId, "W7CRC43SHP");
  assert.equal(localStore.storeDistribution, true);
});
test("iOS distribution approval remains closed and Android identity/profiles are retained", () => {
  const approval = JSON.parse(
    readFileSync("config/ios-store-approval.json", "utf8"),
  );
  assert.equal(approval.approved, false);
  const app = JSON.parse(readFileSync("app.json", "utf8")).expo;
  assert.equal(app.android.package, "com.kovynelstudio.anlaezberle");
  assert.equal(app.ios.bundleIdentifier, "com.anlaezberle.quiz.prototype");
  assert.equal(app.ios.supportsTablet, true);
  const profiles = JSON.parse(readFileSync("eas.json", "utf8")).build;
  assert.equal(profiles["ios-simulator-acceptance"].env.ADS_MODE, "off");
  assert.equal(profiles["ads-closed-test"].env.ADS_MODE, "test");
});

test("unapproved TestFlight, generic iOS store and accidental Android iOS-profile builds fail before credential access", () => {
  for (const [platform, profile] of [
    ["ios", "ios-testflight"],
    ["ios", "ios-development"],
    ["ios", "production"],
    ["android", "ios-development"],
  ]) {
    const result = spawnSync(
      process.execPath,
      ["scripts/eas-pre-install.mjs"],
      {
        encoding: "utf8",
        env: {
          NODE_ENV: "test",
          EXPO_PUBLIC_CONTENT_CHANNEL: "production",
          EXPO_PUBLIC_SUPABASE_URL: "https://mqyuihiobkomjfipxehj.supabase.co",
          EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
            "sb_publishable_synthetic_ci_no_service_access",
          PATH: process.env.PATH,
          EAS_BUILD_PLATFORM: platform,
          EAS_BUILD_PROFILE: profile,
        },
      },
    );
    assert.notEqual(result.status, 0);
    assert(!result.stdout.includes("prerequisites passed"));
  }
});

test("Apple proof cannot replace a different login or survive sign-out, unmount, or an older attempt", () => {
  const guard = new AppleAttemptGuard();
  const first = guard.start();
  guard.observeSignIn("email-actor");
  assert.throws(() => guard.assertCurrent(first));
  const next = guard.start();
  guard.prepareTransfer(next, "apple-actor");
  guard.observeSignIn("apple-actor");
  assert.doesNotThrow(() => guard.assertCurrent(next));
  guard.observeSignIn("foreign-actor");
  assert.throws(() => guard.assertCurrent(next));
  const third = guard.start();
  guard.cancel();
  assert.throws(() => guard.prepareTransfer(third, "apple-actor"));
  const fourth = guard.start();
  guard.finish(third);
  assert.doesNotThrow(() => guard.assertCurrent(fourth));
});
