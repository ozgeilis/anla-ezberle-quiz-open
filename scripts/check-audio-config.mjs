// Inspect generated native config, not only plugin flags. No native binary/device claim.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const config = JSON.parse(
  execFileSync(
    process.execPath,
    [
      require.resolve("expo/bin/cli"),
      "config",
      "--type",
      "introspect",
      "--json",
    ],
    {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    },
  ),
);
const mods = config._internal.modResults,
  info = mods.ios.infoPlist,
  manifest = mods.android.manifest.manifest;
assert(!("NSMicrophoneUsageDescription" in info));
assert(!(info.UIBackgroundModes ?? []).includes("audio"));
const permissions = (manifest["uses-permission"] ?? []).map(
  (p) => p.$["android:name"],
);
for (const p of [
  "android.permission.RECORD_AUDIO",
  "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
  "android.permission.FOREGROUND_SERVICE_MICROPHONE",
])
  assert(!permissions.includes(p), p + " must not be requested");
const services = manifest.application
  .flatMap((a) => a.service ?? [])
  .map((s) => s.$["android:name"]);
assert(!services.some((s) => s.startsWith("expo.modules.audio.service.")));
assert.equal(config.ios.bundleIdentifier, "com.anlaezberle.quiz.prototype");
assert.equal(config.android.package, "com.kovynelstudio.anlaezberle");
assert.equal(config.scheme, "anla-ezberle-quiz");
console.log(
  JSON.stringify({
    passed: true,
    iosMicrophonePermission: false,
    iosBackgroundAudio: false,
    androidRecordAudio: false,
    androidAudioForegroundServices: false,
    applicationAndAuthSchemeUnchanged: true,
  }),
);
