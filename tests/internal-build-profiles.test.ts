import assert from "node:assert/strict";
import { test } from "node:test";
import eas from "../eas.json";
import pkg from "../package.json";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  internalBuildIssues,
  type InternalEasConfig,
  type InternalProfile,
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

test("the actual EAS hook blocks unsafe native public configuration", () => {
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
  assert.equal(run({ EAS_BUILD_PROFILE: "ads-preview" }).status, 0);
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

test("closed-test ads inherit the store gate without permitting overrides or a missing parent", () => {
  assert.equal(eas.build["ads-closed-test"].extends, "production");
  assert.equal(eas.build["ads-closed-test"].environment, "preview");
  assert.deepEqual(
    eas.build["ads-closed-test"].env,
    eas.build["ads-preview"].env,
  );
  const changes: Partial<InternalProfile>[] = [
    { distribution: "internal" },
    { extends: "preview" },
    { environment: "production" },
    { autoIncrement: false },
    { android: { buildType: "apk" } },
    { env: { ADS_MODE: "live", ADS_TEST_BUILD: "1" } },
    { env: { ADS_MODE: "test", ADS_TEST_BUILD: "1", ADS_TEST_UMP_EEA: "1" } },
  ];
  for (const change of changes) {
    const altered = copy();
    altered.build!["ads-closed-test"] = {
      ...altered.build!["ads-closed-test"],
      ...change,
    };
    assert.ok(internalBuildIssues(altered).length > 0);
  }
  const missing = copy();
  delete missing.build!.production;
  assert.ok(
    internalBuildIssues(missing).some((issue) =>
      issue.includes("parent is required"),
    ),
  );
});

test("unapproved store builds are blocked and closed-test approval cannot authorize another profile or package", () => {
  const root = mkdtempSync(join(tmpdir(), "anla-store-gate-"));
  const hook = resolve("scripts/eas-pre-install.mjs");
  const approval = {
    approved: true,
    approvedProfile: "ads-closed-test",
    packageApproved: true,
    packageId: "com.kovynelstudio.anlaezberle",
    acceptedApkSha256: "a".repeat(64),
  };
  const env = {
    ...process.env,
    EAS_BUILD_PLATFORM: "android",
    EXPO_PUBLIC_CONTENT_CHANNEL: "production",
    EXPO_PUBLIC_SUPABASE_URL: "https://mqyuihiobkomjfipxehj.supabase.co",
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_synthetic_build_test",
  };
  const run = (profile: string, change = {}) => {
    writeFileSync(
      join(root, "config/android-store-approval.json"),
      JSON.stringify({ ...approval, ...change }),
    );
    return spawnSync(process.execPath, [hook], {
      cwd: root,
      env: { ...env, EAS_BUILD_PROFILE: profile },
      encoding: "utf8",
    });
  };
  try {
    mkdirSync(join(root, "config"));
    writeFileSync(
      join(root, "app.json"),
      JSON.stringify({ expo: { android: { package: approval.packageId } } }),
    );
    assert.equal(run("ads-closed-test").status, 0);
    assert.notEqual(run("production").status, 0);
    assert.notEqual(
      run("ads-closed-test", { approvedProfile: null }).status,
      0,
    );
    assert.notEqual(
      run("ads-closed-test", { packageId: "another.app" }).status,
      0,
    );
    assert.notEqual(
      run("ads-closed-test", { acceptedApkSha256: null }).status,
      0,
    );
    for (const profile of ["production", "ads-closed-test"]) {
      const store = run(profile, { approved: false });
      assert.notEqual(store.status, 0);
      assert.match(store.stderr, /owner must approve permanent package ID/);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("ad test profiles cannot override distribution, secret checks or use live ads", () => {
  for (const change of [
    { distribution: "store" },
    { extends: "production" },
    { env: { ADS_MODE: "production", ADS_TEST_BUILD: "1" } },
  ]) {
    const altered = copy();
    altered.build!["ads-preview"] = {
      ...altered.build!["ads-preview"],
      ...change,
    };
    assert.ok(
      internalBuildIssues(altered).some((issue) =>
        issue.includes("isolated test-ad extension"),
      ),
    );
  }
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
