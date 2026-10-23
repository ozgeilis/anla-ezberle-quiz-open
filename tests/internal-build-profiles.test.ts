import assert from "node:assert/strict";
import { test } from "node:test";
import eas from "../eas.json";
import { internalBuildIssues, type InternalEasConfig } from "../scripts/check-internal-build-profiles";

const copy = (): InternalEasConfig => structuredClone(eas);

test("current EAS profiles permit internal device and simulator tests only", () => {
  assert.deepEqual(internalBuildIssues(eas), []);
  assert.equal(eas.build.preview.android.buildType, "apk");
  assert.equal(eas.build["development-simulator"].ios.simulator, true);
  assert.equal(eas.build.preview.env.EXPO_PUBLIC_CONTENT_CHANNEL, "production");
  assert.equal(eas.build.development.env.EXPO_PUBLIC_CONTENT_CHANNEL, "prototype");
});

test("store build and submit configuration cannot appear without an explicit review", () => {
  const altered = copy();
  altered.build!.production = { distribution: "store", environment: "production" };
  altered.submit = { production: {} };
  const issues = internalBuildIssues(altered);
  assert.ok(issues.some(issue => issue.includes("Unexpected build profile: production")));
  assert.ok(issues.some(issue => issue.includes("Submit")));
});

test("closed preview cannot silently become a development or store build", () => {
  const altered = copy();
  altered.build!.preview = {
    ...altered.build!.preview,
    distribution: "store",
    developmentClient: true,
    env: { EXPO_PUBLIC_CONTENT_CHANNEL: "prototype", EXPO_PUBLIC_SECRET: "should-not-ship" },
    android: { buildType: "app-bundle" },
  };
  const issues = internalBuildIssues(altered);
  assert.ok(issues.some(issue => issue.includes("distribution must be internal")));
  assert.ok(issues.some(issue => issue.includes("developmentClient")));
  assert.ok(issues.some(issue => issue.includes("incorrect question content channel")));
  assert.ok(issues.some(issue => issue.includes("unexpected inline environment variable")));
  assert.ok(issues.some(issue => issue.includes("installable APK")));
});

test("missing simulator settings and profiles fail closed", () => {
  const altered = copy();
  delete altered.build!["development-simulator"];
  assert.ok(internalBuildIssues(altered).some(issue => issue.includes("Missing build profile: development-simulator")));
  assert.ok(internalBuildIssues({}).includes("Missing build profiles"));
});
