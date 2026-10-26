import assert from "node:assert/strict";
import { test } from "node:test";
import {
  checkReleaseConfig,
  releaseReport,
} from "../scripts/check-release-readiness";
import config from "../app.json";
import eas from "../eas.json";

test("iOS prototype remains blocked while the approved Android identifier passes metadata checks", () => {
  const items = checkReleaseConfig(config, eas);
  assert.equal(releaseReport(items).readyForStoreSubmission, false);
  assert.deepEqual(
    items.filter((i) => !i.pass).map((i) => i.id),
    ["ios-identifier"],
  );
  assert.equal(items.find((i) => i.id === "android-identifier")?.pass, true);
  const prototype = checkReleaseConfig({ expo: { ...config.expo, android: { ...config.expo.android, package: "com.anlaezberle.quiz.prototype" } } }, eas);
  assert.equal(prototype.find((i) => i.id === "android-identifier")?.pass, false);
  assert.equal(releaseReport(prototype).readyForStoreSubmission, false);
});
test("complete production metadata passes the static gate", () => {
  const items = checkReleaseConfig(
    {
      expo: {
        version: "1.0.0",
        icon: "./assets/images/icon.png",
        ios: { bundleIdentifier: "com.anlaezberle.quiz" },
        android: { package: "com.anlaezberle.quiz" },
      },
    },
    { build: { production: { environment: "production" } } },
  );
  assert.equal(releaseReport(items).readyForStoreSubmission, true);
});
test("missing metadata cannot accidentally count as ready", () => {
  assert.equal(
    releaseReport(checkReleaseConfig({}, null)).readyForStoreSubmission,
    false,
  );
});

test("preview is internal and uses only approved production-channel questions", () => {
  assert.equal(eas.build.preview.distribution, "internal");
  assert.equal(eas.build.preview.env.EXPO_PUBLIC_CONTENT_CHANNEL, "production");
  assert.equal(eas.build.development.distribution, "internal");
  assert.equal(eas.build.production.distribution, "store");
  assert.equal(eas.build.production.android.buildType, "app-bundle");
});
