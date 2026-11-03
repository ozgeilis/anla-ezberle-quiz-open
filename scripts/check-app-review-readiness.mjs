// Reports review blockers; never signs, uploads, submits, or changes approvals.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function appReviewBlockers(facts) {
  const blockers = [];
  const require = (ok, reason) => {
    if (!ok) blockers.push(reason);
  };
  require(facts.binary?.validated ===
    true, "Apple binary validation is not verified");
  require(facts.binary?.internalOnly ===
    false, "Build is not verified for App Store distribution");
  require(facts.binary?.embeddedClientConfigVerified ===
    true, "Final embedded online client configuration is not verified");
  require(facts.binary?.bundleId ===
    "com.kovynelstudio.anlaezberle", "Bundle ID mismatch");
  require(facts.binary?.teamId === "W7CRC43SHP", "Apple Team mismatch");
  require(facts.source?.runtimeMatchesBinary ===
    true, "Runtime changed after binary validation");
  require(facts.source?.mainIntegrationApproved ===
    true, "iOS integration is not approved on main");
  require(facts.tests?.automated ===
    "passed", "Automated regression checks are incomplete");
  require(facts.tests?.physicalCandidate ===
    "passed", "Current candidate physical iPhone acceptance is incomplete");
  require(facts.auth?.reviewerLogin ===
    "passed", "Fresh reviewer login is not verified");
  require(facts.auth?.reviewerSocialAccess ===
    "passed", "Reviewer social access is not verified");
  require(typeof facts.auth?.googleVisible ===
    "boolean", "Google login visibility is unknown");
  require(typeof facts.auth?.appleAccountsSupported ===
    "boolean", "Apple account support is unknown");
  if (facts.auth?.googleVisible === true) {
    require(facts.auth?.equivalentPrivateLogin ===
      "passed", "Google login lacks a verified equivalent private login (4.8)");
  }
  if (facts.auth?.appleAccountsSupported === true) {
    require(facts.auth?.appleDeletionAndRevocation ===
      "passed", "Apple account deletion/revocation is not ready in the release environment");
  }
  require(facts.safety?.moderation ===
    "passed", "Moderation/report/block acceptance is incomplete");
  require(facts.metadata?.complete ===
    true, "App Store metadata is incomplete");
  require(facts.metadata?.versionMatchesBinary ===
    true, "App Store version is not matched to the binary");
  require(facts.metadata?.screenshotsVerified ===
    true, "Required real iPhone/iPad screenshots are incomplete");
  require(facts.metadata?.privacyLabelsReviewed ===
    true, "App Privacy labels require review");
  require(facts.metadata?.exportComplianceVerified ===
    true, "Export compliance is not verified");
  require(facts.metadata?.freeAgreementActive ===
    true, "Free Apps Agreement is not verified active");
  require(facts.metadata?.territoriesConfirmed ===
    true, "Distribution territories are not confirmed");
  require(facts.metadata?.manualReleaseVerified ===
    true, "Manual release is not verified");
  require(typeof facts.metadata?.dsaApplicable ===
    "boolean", "DSA applicability is not established");
  require(facts.metadata?.dsaApplicable !== true ||
    facts.metadata?.dsaVerified ===
      true, "DSA verification for the intended distribution is incomplete");
  // No return value from this read-only audit grants submission/publication.
  return blockers;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const file = process.argv[2] ?? "docs/app-review-20261103/readiness.json";
  const blockers = appReviewBlockers(JSON.parse(readFileSync(file, "utf8")));
  console.log(
    JSON.stringify(
      {
        readyForFinalOwnerReview: blockers.length === 0,
        blockers,
        submissionAuthorized: false,
        published: false,
      },
      null,
      2,
    ),
  );
  process.exitCode = blockers.length ? 1 : 0;
}
