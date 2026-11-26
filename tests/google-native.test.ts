import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { resolveIosBuild, googleIosClientId } = require("../config/ios.js");

test("native Google client and reversed URL scheme only for the registered Bundle ID", () => {
  const registered = resolveIosBuild(
    {
      IOS_BUILD_TARGET: "store",
      IOS_REGISTERED_BUNDLE_ID: "com.kovynelstudio.anlaezberle",
    },
    "old",
  );
  assert.equal(registered.googleIosClientId, googleIosClientId);
  assert.match(
    googleIosClientId,
    /^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/,
  );
  assert.equal(
    registered.googleIosUrlScheme,
    `com.googleusercontent.apps.${googleIosClientId.replace(".apps.googleusercontent.com", "")}`,
  );
  const prototype = resolveIosBuild({}, "com.anlaezberle.quiz.prototype");
  assert.equal("googleIosClientId" in prototype, false);
  assert.equal("googleIosUrlScheme" in prototype, false);
});

test("native Google keeps Supabase nonce verification and the verified session transfer", () => {
  const flow = readFileSync("src/features/online/googleAuth.ts", "utf8");
  const native = flow.slice(
    flow.indexOf("async function startNativeGoogleAuth"),
  );
  // Google receives only SHA-256(raw nonce); Supabase receives the raw nonce.
  assert.match(
    native,
    /digestStringAsync\(\s*CryptoDigestAlgorithm\.SHA256,\s*nonce/,
  );
  assert.match(native, /signIn\(native\.clientId, hashedNonce\)/);
  assert.match(
    native,
    /signInWithIdToken\(\{\s*provider: "google",\s*token: proof\.idToken,\s*access_token: proof\.accessToken,\s*nonce,/,
  );
  assert.match(
    native,
    /identities\?\.some\(\(i\) => i\.provider === "google"\)/,
  );
  assert.match(native, /latest\.data\.session/);
  assert.match(native, /stopAutoRefresh\(\)/);
  const swift = readFileSync(
    "modules/google-native-signin/ios/GoogleNativeSignInModule.swift",
    "utf8",
  );
  assert.match(swift, /nonce: hashedNonce/);
  assert.match(swift, /ERR_CANCELED/);
  assert.match(swift, /"accessToken": user\.accessToken\.tokenString/);
  assert.equal(swift.includes("refreshToken"), false);
});

test("local Expo native sources survive Git and EAS packaging while generated projects stay excluded", () => {
  const files = [
    "modules/google-native-signin/ios/GoogleNativeSignInModule.swift",
    "modules/google-native-signin/ios/GoogleNativeSignIn.podspec",
  ];
  for (const file of files) {
    const tracked = execFileSync("git", ["show", `:./${file}`]);
    assert.deepEqual(
      tracked,
      readFileSync(file),
      `${file} must be a tracked source, not local-only`,
    );
  }
  for (const ignore of [".gitignore", ".easignore"]) {
    const dir = mkdtempSync(join(tmpdir(), "anla-native-ignore-"));
    try {
      execFileSync("git", ["init", "--quiet", dir]);
      writeFileSync(join(dir, ".gitignore"), readFileSync(ignore));
      const paths = [
        ...files,
        "ios/Podfile",
        "android/app/build.gradle",
        ".env.production",
        "signing.p12",
      ];
      const ignored = execFileSync(
        "git",
        ["-C", dir, "check-ignore", "--no-index", "--stdin"],
        {
          input: paths.join("\n") + "\n",
          encoding: "utf8",
        },
      )
        .trim()
        .split("\n");
      assert.deepEqual(
        ignored,
        paths.slice(2),
        `${ignore}: keep source, omit generated projects and secrets`,
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});
