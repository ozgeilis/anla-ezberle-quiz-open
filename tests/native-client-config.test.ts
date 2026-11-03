import test from "node:test";
import assert from "node:assert/strict";
import { verifyNativeClientConfig } from "../scripts/verify-native-client-config.mjs";

const expected = {
  url: "https://mqyuihiobkomjfipxehj.supabase.co",
  key: "sb_publishable_SYNTHETIC_NOT_A_REAL_KEY",
};
const fixture = () =>
  Buffer.from(`\0Hermes fixture\0${expected.url}\0${expected.key}\0`, "utf8");

test("final bundle inspection rejects an offline export even when source/JS hashes match an approval", () => {
  assert.throws(
    () => verifyNativeClientConfig(Buffer.from("offline bundle"), expected),
    /endpoint/,
  );
  assert.throws(
    () => verifyNativeClientConfig(Buffer.from(expected.url), expected),
    /key/,
  );
});

test("a different or stale publishable key in the final bundle fails verification", () => {
  assert.throws(
    () =>
      verifyNativeClientConfig(fixture(), {
        ...expected,
        key: "sb_publishable_OTHER_SYNTHETIC_KEY",
      }),
    /key/,
  );
});

test("administrator keys and foreign endpoints are never accepted as client configuration", () => {
  for (const key of [
    "sb_secret_SYNTHETIC",
    "eyJ_SYNTHETIC_ADMIN",
    "",
    undefined,
  ]) {
    assert.throws(() =>
      verifyNativeClientConfig(fixture(), { ...expected, key }),
    );
  }
  assert.throws(() =>
    verifyNativeClientConfig(fixture(), {
      ...expected,
      url: "https://foreign.supabase.co",
    }),
  );
});

test("native config evidence contains hashes, never a key or an invented login acceptance", () => {
  const evidence = verifyNativeClientConfig(fixture(), expected);
  assert.equal(evidence.embeddedClientConfigVerified, true);
  assert.equal(evidence.runtimeLoginVerified, false);
  assert.match(evidence.bundleSha256, /^[a-f0-9]{64}$/);
  assert(!JSON.stringify(evidence).includes(expected.key));
});
