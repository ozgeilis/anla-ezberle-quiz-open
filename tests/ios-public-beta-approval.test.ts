import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { validatePublicBetaCandidate } = require("../config/ios-approval.js");
function fixture() {
  return {
    approval: {
      approved: false,
      reviewReadinessAccepted: false,
      appleTeamVerified: true,
      appleTeamId: "W7CRC43SHP",
      registeredBundleId: "com.kovynelstudio.anlaezberle",
      appStoreConnectAppId: "6829516832",
      publicBeta: {
        approved: true,
        sourceCommit: "a".repeat(40),
        acceptedDevelopmentJsSha256: "b".repeat(64),
        groupName: "Anla & Ezberle Public Beta",
        testerLimit: 1000,
        productionSubmissionApproved: false,
      },
    },
    options: {
      method: "app-store-connect",
      destination: "export",
      teamID: "W7CRC43SHP",
      manageAppVersionAndBuildNumber: false,
      testFlightInternalTestingOnly: false,
    },
    env: {
      IOS_PUBLIC_BETA_CANDIDATE: "1",
      IOS_REGISTERED_BUNDLE_ID: "com.kovynelstudio.anlaezberle",
      ADS_MODE: "off",
    },
  };
}
test("public TestFlight candidate does not approve production or unfinished review", () => {
  const f = fixture();
  assert.deepEqual(
    validatePublicBetaCandidate(f.approval, f.options, "a".repeat(40), f.env),
    {
      scope: "public-testflight-candidate",
      distributed: false,
      production: false,
    },
  );
  assert.equal(f.approval.approved, false);
  assert.equal(f.approval.reviewReadinessAccepted, false);
});
test("public beta candidate rejects source, audience, destination and identity drift", () => {
  const f = fixture();
  for (const beta of [
    { ...f.approval.publicBeta, approved: false },
    { ...f.approval.publicBeta, sourceCommit: "c".repeat(40) },
    { ...f.approval.publicBeta, testerLimit: 10000 },
    { ...f.approval.publicBeta, productionSubmissionApproved: true },
  ])
    assert.throws(() =>
      validatePublicBetaCandidate(
        { ...f.approval, publicBeta: beta },
        f.options,
        "a".repeat(40),
        f.env,
      ),
    );
  for (const options of [
    { ...f.options, destination: "upload" },
    { ...f.options, testFlightInternalTestingOnly: true },
    { ...f.options, teamID: "FOREIGN123" },
  ])
    assert.throws(() =>
      validatePublicBetaCandidate(f.approval, options, "a".repeat(40), f.env),
    );
  assert.throws(() =>
    validatePublicBetaCandidate(f.approval, f.options, "a".repeat(40), {
      ...f.env,
      ADS_MODE: "test",
    }),
  );
});
