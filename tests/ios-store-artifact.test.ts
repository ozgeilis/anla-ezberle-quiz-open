import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const {
  validateIosDistribution,
  decodeProvisioningXml,
} = require("../scripts/verify-ios-store.mjs");
const expected = {
  bundleId: "com.example.synthetic",
  teamId: "SYNTHETIC1",
  version: "0.1.0",
  appStoreConnectAppId: "synthetic-not-uploaded",
};
function fixture() {
  const entitlements = {
    "application-identifier": "SYNTHETIC1.com.example.synthetic",
    "com.apple.developer.team-identifier": "SYNTHETIC1",
    "get-task-allow": false,
    "aps-environment": "production",
    "com.apple.developer.applesignin": ["Default"],
  };
  return {
    plist: {
      DTPlatformName: "iphoneos",
      CFBundleIdentifier: expected.bundleId,
      CFBundleShortVersionString: expected.version,
      CFBundleVersion: "1",
      UIDeviceFamily: [1, 2],
      CFBundleURLTypes: [{ CFBundleURLSchemes: ["anla-ezberle-quiz"] }],
      ITSAppUsesNonExemptEncryption: false,
    },
    entitlements,
    profile: {
      Entitlements: { ...entitlements },
      TeamIdentifier: [expected.teamId],
      ExpirationDate: "2031-01-01T00:00:00Z",
    },
  };
}
const now = Date.parse("2030-01-01T00:00:00Z");
test("synthetic store metadata checks never claim an IPA was uploaded or distributed", () => {
  const evidence = validateIosDistribution(fixture(), expected, now);
  assert.equal(evidence.uploaded, false);
  assert.equal(evidence.distributed, false);
  assert.equal(evidence.bundleId, expected.bundleId);
});
test("store verifier rejects foreign Team, prototype Bundle ID, simulator and expired profiles", () => {
  const wrongBundle = fixture();
  wrongBundle.plist.CFBundleIdentifier = "com.anlaezberle.quiz.prototype";
  const wrongTeam = fixture();
  wrongTeam.profile.TeamIdentifier = ["FOREIGN123"];
  const simulator = fixture();
  simulator.plist.DTPlatformName = "iphonesimulator";
  const expired = fixture();
  expired.profile.ExpirationDate = "2029-01-01T00:00:00Z";
  for (const facts of [wrongBundle, wrongTeam, simulator, expired])
    assert.throws(() => validateIosDistribution(facts, expected, now));
});
test("store verifier rejects development push, debug access and mismatched Apple capability", () => {
  const push = fixture();
  push.entitlements["aps-environment"] = "development";
  const debug = fixture();
  debug.entitlements["get-task-allow"] = true;
  const apple = fixture();
  apple.profile.Entitlements["com.apple.developer.applesignin"] = [];
  for (const facts of [push, debug, apple])
    assert.throws(() => validateIosDistribution(facts, expected, now));
});

test("real plist date/data types are normalized without serializing certificate payloads", () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0"><dict>
<key>ExpirationDate</key><date>2031-01-01T00:00:00Z</date>
<key>DeveloperCertificates</key><array><data>c3ludGhldGlj</data></array>
<key>TeamIdentifier</key><array><string>SYNTHETIC1</string></array>
<key>Entitlements</key><dict><key>get-task-allow</key><false/></dict>
<key>ProvisionedDevices</key><array><string>synthetic-device</string></array>
</dict></plist>`;
  const profile = decodeProvisioningXml(Buffer.from(xml));
  assert.equal(profile.ExpirationDate, "2031-01-01T00:00:00Z");
  assert.deepEqual(profile.TeamIdentifier, ["SYNTHETIC1"]);
  assert.deepEqual(profile.ProvisionedDevices, ["synthetic-device"]);
  assert.equal(profile.Entitlements["get-task-allow"], false);
  assert.equal(profile.DeveloperCertificates, undefined);
  assert.throws(() => decodeProvisioningXml(Buffer.from("invalid plist")));
});
