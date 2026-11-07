import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { validateTestflightUpload } = require("../config/ios-approval.js");
function fixture() {
  return {
    approval: {
      approved: false,
      physicalAcceptance: false,
      appleAuthAndDeletionAccepted: false,
      reviewReadinessAccepted: false,
      registeredBundleId: "com.kovynelstudio.anlaezberle",
      appleTeamId: "W7CRC43SHP",
      appleTeamVerified: true,
      appStoreConnectAppId: "6829516832",
      testflightUpload: {
        approved: true,
        internalOnly: true,
        sourceCommit: "a".repeat(40),
        acceptedDevelopmentJsSha256: "b".repeat(64),
      },
    },
    options: {
      method: "app-store-connect",
      destination: "export",
      teamID: "W7CRC43SHP",
      manageAppVersionAndBuildNumber: false,
      testFlightInternalTestingOnly: true,
    },
    env: {
      IOS_TESTFLIGHT_UPLOAD_ONLY: "1",
      IOS_REGISTERED_BUNDLE_ID: "com.kovynelstudio.anlaezberle",
      ADS_MODE: "off",
    },
  };
}
test("an approved internal-only upload never marks unfinished release acceptance passed", () => {
  const f = fixture();
  assert.deepEqual(
    validateTestflightUpload(f.approval, f.options, "a".repeat(40), f.env),
    {
      scope: "testflight-internal-upload-only",
      distributed: false,
    },
  );
  assert.equal(f.approval.approved, false);
  assert.equal(f.approval.appleAuthAndDeletionAccepted, false);
  assert.equal(f.approval.physicalAcceptance, false);
});
test("upload approval rejects changed source, public export or upload destination", () => {
  const f = fixture();
  assert.throws(() =>
    validateTestflightUpload(f.approval, f.options, "c".repeat(40), f.env),
  );
  for (const options of [
    { ...f.options, destination: "upload" },
    { ...f.options, testFlightInternalTestingOnly: false },
    { ...f.options, teamID: "FOREIGN123" },
    { ...f.options, method: "ad-hoc" },
  ])
    assert.throws(() =>
      validateTestflightUpload(f.approval, options, "a".repeat(40), f.env),
    );
});
test("closed, unverified and advertising-enabled upload attempts are rejected", () => {
  const f = fixture();
  for (const approval of [
    {
      ...f.approval,
      testflightUpload: { ...f.approval.testflightUpload, approved: false },
    },
    { ...f.approval, appleTeamVerified: false },
    { ...f.approval, registeredBundleId: "com.anlaezberle.quiz.prototype" },
  ])
    assert.throws(() =>
      validateTestflightUpload(approval, f.options, "a".repeat(40), f.env),
    );
  assert.throws(() =>
    validateTestflightUpload(f.approval, f.options, "a".repeat(40), {
      ...f.env,
      ADS_MODE: "test",
    }),
  );
});
