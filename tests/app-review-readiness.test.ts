import test from "node:test";
import assert from "node:assert/strict";
import { appReviewBlockers } from "../scripts/check-app-review-readiness.mjs";

function acceptedFacts() {
  return {
    binary: {
      validated: true,
      internalOnly: false,
      embeddedClientConfigVerified: true,
      bundleId: "com.kovynelstudio.anlaezberle",
      teamId: "W7CRC43SHP",
    },
    source: { runtimeMatchesBinary: true, mainIntegrationApproved: true },
    tests: { automated: "passed", physicalCandidate: "passed" },
    auth: {
      reviewerLogin: "passed",
      reviewerSocialAccess: "passed",
      googleVisible: true,
      equivalentPrivateLogin: "passed",
      appleAccountsSupported: true,
      appleDeletionAndRevocation: "passed",
    },
    safety: { moderation: "passed" },
    metadata: {
      complete: true,
      versionMatchesBinary: true,
      screenshotsVerified: true,
      privacyLabelsReviewed: true,
      exportComplianceVerified: true,
      freeAgreementActive: true,
      territoriesConfirmed: true,
      manualReleaseVerified: true,
      dsaApplicable: true,
      dsaVerified: true,
    },
  };
}

test("valid upload and Ready to Test cannot substitute for missing release Auth, reviewer or device acceptance", () => {
  const facts = acceptedFacts();
  facts.auth.equivalentPrivateLogin = "not-run";
  facts.auth.reviewerLogin = "not-run";
  facts.tests.physicalCandidate = "not-run";
  const blockers = appReviewBlockers(facts);
  assert(blockers.some((x: string) => x.includes("4.8")));
  assert(blockers.some((x: string) => x.includes("reviewer login")));
  assert(blockers.some((x: string) => x.includes("physical iPhone")));
});

test("valid Apple signature and source equality do not accept an offline native bundle", () => {
  const facts = acceptedFacts();
  facts.binary.embeddedClientConfigVerified = false;
  assert.deepEqual(appReviewBlockers(facts), [
    "Final embedded online client configuration is not verified",
  ]);
});

test("source/binary and version mismatches require new verification, never a relabelled old build", () => {
  const facts = acceptedFacts();
  facts.source.runtimeMatchesBinary = false;
  facts.metadata.versionMatchesBinary = false;
  assert.equal(appReviewBlockers(facts).length, 2);
});

test("a successful Apple trial does not accept disabled release revocation or incomplete DSA", () => {
  const facts = acceptedFacts();
  facts.auth.appleDeletionAndRevocation = "disabled";
  facts.metadata.dsaVerified = false;
  assert.equal(appReviewBlockers(facts).length, 2);
});

test("complete evidence only returns no blockers; it never changes the owner's approval document", () => {
  const facts = acceptedFacts();
  const before = JSON.stringify(facts);
  assert.deepEqual(appReviewBlockers(facts), []);
  assert.equal(JSON.stringify(facts), before);
});

test("omitting conditional Auth or DSA facts cannot silently bypass a release check", () => {
  const facts = acceptedFacts();
  const incomplete = {
    ...facts,
    auth: { reviewerLogin: "passed", reviewerSocialAccess: "passed" },
    metadata: { ...facts.metadata, dsaApplicable: undefined },
  };
  const blockers = appReviewBlockers(incomplete);
  assert.equal(blockers.length, 3);
  assert(blockers.some((x: string) => x.includes("Google login visibility")));
  assert(blockers.some((x: string) => x.includes("Apple account support")));
  assert(blockers.some((x: string) => x.includes("DSA applicability")));
});
