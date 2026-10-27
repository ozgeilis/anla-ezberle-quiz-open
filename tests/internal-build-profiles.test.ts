import assert from "node:assert/strict";
import { test } from "node:test";
import eas from "../eas.json";
import pkg from "../package.json";
import { spawnSync } from "node:child_process";
import {
  internalBuildIssues,
  type InternalEasConfig,
} from "../scripts/check-internal-build-profiles";

const copy = (): InternalEasConfig => structuredClone(eas);

test("current EAS profiles preserve internal tests and prepare a guarded store AAB", () => {
  assert.deepEqual(internalBuildIssues(eas), []);
  assert.equal(eas.build.preview.android.buildType, "apk");
  assert.equal(eas.build["development-simulator"].ios.simulator, true);
  assert.equal(eas.build.preview.env.EXPO_PUBLIC_CONTENT_CHANNEL, "production");
  assert.equal(
    eas.build.development.env.EXPO_PUBLIC_CONTENT_CHANNEL,
    "prototype",
  );
});

test("store build and submit configuration cannot appear without an explicit review", () => {
  const altered = copy();
  altered.build!.production = {
    distribution: "store",
    environment: "production",
  };
  altered.submit = { production: {} };
  const issues = internalBuildIssues(altered);
  assert.ok(
    issues.some((issue) => issue.includes("reviewed, guarded Android AAB")),
  );
  assert.ok(issues.some((issue) => issue.includes("Submit")));
});

test("the actual EAS hook blocks unapproved store builds and unsafe native public configuration", () => {
  assert.equal(
    pkg.scripts["eas-build-pre-install"],
    "node scripts/eas-pre-install.mjs",
  );
  const env = {
    ...process.env,
    EAS_BUILD_PLATFORM: "android",
    EAS_BUILD_PROFILE: "preview",
    EXPO_PUBLIC_CONTENT_CHANNEL: "production",
    EXPO_PUBLIC_SUPABASE_URL: "https://mqyuihiobkomjfipxehj.supabase.co",
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_synthetic_build_test",
  };
  const run = (change: Record<string, string>) =>
    spawnSync(process.execPath, ["scripts/eas-pre-install.mjs"], {
      env: { ...env, ...change },
      encoding: "utf8",
    });
  assert.equal(run({}).status, 0);
  const store = run({ EAS_BUILD_PROFILE: "production" });
  assert.notEqual(store.status, 0);
  assert.match(store.stderr, /owner must approve permanent package ID/);
  assert.notEqual(
    run({ EXPO_PUBLIC_SERVICE_ROLE_KEY: "synthetic-must-not-ship" }).status,
    0,
  );
  assert.notEqual(
    run({
      EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        "sb_secret_synthetic_not_a_real_key",
    }).status,
    0,
  );
});

test("closed preview cannot silently become a development or store build", () => {
  const altered = copy();
  altered.build!.preview = {
    ...altered.build!.preview,
    distribution: "store",
    developmentClient: true,
    env: {
      EXPO_PUBLIC_CONTENT_CHANNEL: "prototype",
      EXPO_PUBLIC_SECRET: "should-not-ship",
    },
    android: { buildType: "app-bundle" },
  };
  const issues = internalBuildIssues(altered);
  assert.ok(
    issues.some((issue) => issue.includes("distribution must be internal")),
  );
  assert.ok(issues.some((issue) => issue.includes("developmentClient")));
  assert.ok(
    issues.some((issue) =>
      issue.includes("incorrect question content channel"),
    ),
  );
  assert.ok(
    issues.some((issue) =>
      issue.includes("unexpected inline environment variable"),
    ),
  );
  assert.ok(issues.some((issue) => issue.includes("installable APK")));
});

test("missing simulator settings and profiles fail closed", () => {
  const altered = copy();
  delete altered.build!["development-simulator"];
  assert.ok(
    internalBuildIssues(altered).some((issue) =>
      issue.includes("Missing build profile: development-simulator"),
    ),
  );
  assert.ok(internalBuildIssues({}).includes("Missing build profiles"));
});
