// Read-only verification of an extracted distribution .app, never a signer or
// uploader. Run only after the separately approved IPA has been produced.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import iosApproval from "../config/ios-approval.js";

export function validateIosDistribution(facts, expected, now = Date.now()) {
  const { plist, entitlements: e, profile: p } = facts;
  assert.equal(plist.DTPlatformName, "iphoneos", "Not a device archive");
  assert.equal(plist.CFBundleIdentifier, expected.bundleId, "Wrong Bundle ID");
  assert.equal(
    plist.CFBundleShortVersionString,
    expected.version,
    "Wrong version",
  );
  assert.match(
    plist.CFBundleVersion,
    /^\d+(?:\.\d+){0,2}$/,
    "Invalid build number",
  );
  assert.equal(
    e["com.apple.developer.team-identifier"],
    expected.teamId,
    "Wrong signing Team",
  );
  assert.equal(
    e["application-identifier"],
    `${expected.teamId}.${expected.bundleId}`,
  );
  assert.equal(
    p.Entitlements["application-identifier"],
    e["application-identifier"],
  );
  assert.deepEqual(p.TeamIdentifier, [expected.teamId]);
  assert.equal(
    p.Entitlements["com.apple.developer.team-identifier"],
    expected.teamId,
  );
  assert(Date.parse(p.ExpirationDate) > now, "Expired provisioning profile");
  assert(
    e["get-task-allow"] === undefined || e["get-task-allow"] === false,
    "Debug entitlement in store archive",
  );
  assert.equal(p.Entitlements["get-task-allow"], false);
  assert(
    !p.ProvisionedDevices && !p.ProvisionsAllDevices,
    "Not App Store distribution",
  );
  assert.equal(e["aps-environment"], "production", "Wrong APNs environment");
  assert.equal(p.Entitlements["aps-environment"], "production");
  assert.deepEqual(e["com.apple.developer.applesignin"], ["Default"]);
  assert.deepEqual(p.Entitlements["com.apple.developer.applesignin"], [
    "Default",
  ]);
  assert.deepEqual(
    [...plist.UIDeviceFamily].sort(),
    [1, 2],
    "iPad support was lost",
  );
  assert(
    plist.CFBundleURLTypes.some((v) =>
      v.CFBundleURLSchemes.includes("anla-ezberle-quiz"),
    ),
  );
  assert.equal(plist.ITSAppUsesNonExemptEncryption, false);
  assert(!plist.NSUserTrackingUsageDescription, "Unexpected tracking prompt");
  assert(
    !plist.NSMicrophoneUsageDescription,
    "Unexpected microphone permission",
  );
  assert(!(plist.UIBackgroundModes ?? []).includes("audio"));
  assert.equal(
    plist.GADApplicationIdentifier,
    "ca-app-pub-3940256099942544~1458002511",
  );
  assert.equal(plist.GADDelayAppMeasurementInit, true);
  return {
    bundleId: expected.bundleId,
    teamId: expected.teamId,
    version: plist.CFBundleShortVersionString,
    buildNumber: plist.CFBundleVersion,
    profileExpiresAt: new Date(p.ExpirationDate).toISOString(),
    appStoreConnectAppId: expected.appStoreConnectAppId,
    // Manifest/privacy and real service/device acceptance are separate gates.
    uploaded: false,
    distributed: false,
  };
}

function plistJson(path) {
  return JSON.parse(
    execFileSync("plutil", ["-convert", "json", "-o", "-", path], {
      encoding: "utf8",
    }),
  );
}
function decodeXml(bytes) {
  return JSON.parse(
    execFileSync("plutil", ["-convert", "json", "-o", "-", "-"], {
      input: bytes,
      encoding: "utf8",
    }),
  );
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const [argument, output] = process.argv.slice(2);
  assert(
    argument,
    "Usage: node scripts/verify-ios-store.mjs /absolute/Payload/App.app [evidence.json]",
  );
  const app = resolve(argument);
  const approval = JSON.parse(
    readFileSync("config/ios-store-approval.json", "utf8"),
  );
  if (process.env.IOS_TESTFLIGHT_UPLOAD_ONLY === "1") {
    iosApproval.validateTestflightUpload(
      approval,
      JSON.parse(readFileSync("config/ios-testflight-export.json", "utf8")),
      execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
      process.env,
    );
  } else {
    assert.equal(
      approval.approved,
      true,
      "Distribution build has not been approved",
    );
  }
  execFileSync("codesign", ["--verify", "--deep", "--strict", app], {
    stdio: "pipe",
  });
  const evidence = validateIosDistribution(
    {
      plist: plistJson(join(app, "Info.plist")),
      entitlements: decodeXml(
        execFileSync(
          "codesign",
          ["--display", "--entitlements", "-", "--xml", app],
          { stdio: ["pipe", "pipe", "pipe"] },
        ),
      ),
      profile: decodeXml(
        execFileSync(
          "security",
          ["cms", "-D", "-i", join(app, "embedded.mobileprovision")],
          { stdio: ["pipe", "pipe", "pipe"] },
        ),
      ),
    },
    {
      bundleId: approval.registeredBundleId,
      teamId: approval.appleTeamId,
      appStoreConnectAppId: approval.appStoreConnectAppId,
      version: JSON.parse(readFileSync("app.json", "utf8")).expo.version,
    },
  );
  if (output) writeFileSync(output, JSON.stringify(evidence, null, 2) + "\n");
  console.log(JSON.stringify(evidence, null, 2));
}
