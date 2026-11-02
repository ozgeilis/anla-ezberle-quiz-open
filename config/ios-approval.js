const assert = require("node:assert/strict");

// Upload permission is narrower than release/device/Auth acceptance. Keeping it
// separate prevents a TestFlight upload request from marking unfinished QA done.
function validateTestflightUpload(approval, options, sourceCommit, env) {
  const upload = approval.testflightUpload;
  assert.equal(upload?.approved, true, "TestFlight upload approval is closed");
  assert.equal(env.IOS_TESTFLIGHT_UPLOAD_ONLY, "1");
  assert.equal(env.IOS_REGISTERED_BUNDLE_ID, approval.registeredBundleId);
  assert.equal(approval.registeredBundleId, "com.kovynelstudio.anlaezberle");
  assert.equal(approval.appleTeamId, "W7CRC43SHP");
  assert.equal(approval.appleTeamVerified, true);
  assert.equal(approval.appStoreConnectAppId, "6829516832");
  assert.equal(upload.internalOnly, true);
  assert.match(sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(
    upload.sourceCommit,
    sourceCommit,
    "Source changed after approval",
  );
  assert.match(upload.acceptedDevelopmentJsSha256, /^[a-f0-9]{64}$/);
  assert.equal(options.method, "app-store-connect");
  assert.equal(
    options.destination,
    "export",
    "Preflight only permits local export",
  );
  assert.equal(options.teamID, approval.appleTeamId);
  assert.equal(options.manageAppVersionAndBuildNumber, false);
  assert.equal(options.testFlightInternalTestingOnly, true);
  assert.equal(env.ADS_MODE, "off");
  return { scope: "testflight-internal-upload-only", distributed: false };
}
// Public beta permission remains distinct from App Store release acceptance.
// This validates one local candidate export/upload preparation, never a review
// submission, live Auth change, or automatic tester distribution.
function validatePublicBetaCandidate(approval, options, sourceCommit, env) {
  const beta = approval.publicBeta;
  assert.equal(
    beta?.approved,
    true,
    "Public beta candidate approval is closed",
  );
  assert.equal(env.IOS_PUBLIC_BETA_CANDIDATE, "1");
  assert.equal(approval.appleTeamVerified, true);
  assert.equal(approval.appleTeamId, "W7CRC43SHP");
  assert.equal(approval.registeredBundleId, "com.kovynelstudio.anlaezberle");
  assert.equal(env.IOS_REGISTERED_BUNDLE_ID, approval.registeredBundleId);
  assert.equal(approval.appStoreConnectAppId, "6829516832");
  assert.match(sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(
    beta.sourceCommit,
    sourceCommit,
    "Beta source changed after approval",
  );
  assert.match(beta.acceptedDevelopmentJsSha256, /^[a-f0-9]{64}$/);
  assert.equal(beta.groupName, "Anla & Ezberle Public Beta");
  assert.equal(beta.testerLimit, 1000);
  assert.equal(beta.productionSubmissionApproved, false);
  assert.equal(options.method, "app-store-connect");
  assert.equal(options.destination, "export");
  assert.equal(options.teamID, approval.appleTeamId);
  assert.equal(options.manageAppVersionAndBuildNumber, false);
  assert.equal(options.testFlightInternalTestingOnly, false);
  assert.equal(env.ADS_MODE, "off");
  return {
    scope: "public-testflight-candidate",
    distributed: false,
    production: false,
  };
}
module.exports = { validateTestflightUpload, validatePublicBetaCandidate };
