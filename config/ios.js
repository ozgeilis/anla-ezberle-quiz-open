// Identity stays unchanged until the owner approves a registered Apple App ID.
const proposedBundleId = "com.kovynelstudio.anlaezberle";
// Read-only membership verification and owner-approved App ID registration,
// 2026-11-01. This public Team identifier is not a signing credential.
const registeredAppleTeamId = "W7CRC43SHP";
// Public iOS OAuth client (Google Cloud project anla-ezberle-push), created
// 2026-11-12 with owner approval for native Google Sign-In. Not a secret.
const googleIosClientId =
  "1058550044067-q0qlu6a3ujnp2eoi3h0vr8o54i5h1n3v.apps.googleusercontent.com";
const googleIosUrlScheme = `com.googleusercontent.apps.${googleIosClientId.split(".apps.")[0]}`;
function resolveIosBuild(env, currentId) {
  const profile = env.EAS_BUILD_PROFILE;
  // EAS config/credential resolution does not always set EAS_BUILD_PROFILE.
  // The profile env marker is available during both local and worker resolution.
  const store =
    profile === "ios-testflight" || env.IOS_BUILD_TARGET === "store";
  const registered =
    (store ||
      profile === "ios-development" ||
      env.IOS_BUILD_TARGET === "device") &&
    env.IOS_REGISTERED_BUNDLE_ID;
  if (registered && registered !== proposedBundleId)
    throw Error(
      "Unexpected registered iOS identity; owner verification required.",
    );
  if (store && env.IOS_REGISTERED_BUNDLE_ID !== proposedBundleId)
    throw Error(
      "iOS store build blocked: registered Bundle ID approval required.",
    );
  return {
    bundleIdentifier: registered ? proposedBundleId : currentId,
    ...(registered ? { appleTeamId: registeredAppleTeamId } : {}),
    ...(store ? { storeDistribution: true } : {}),
    appleAuthentication: env.IOS_APPLE_AUTH === "1",
    // Native Google Sign-In is tied to the registered Bundle ID's iOS client.
    ...(registered ? { googleIosClientId, googleIosUrlScheme } : {}),
  };
}
module.exports = { proposedBundleId, googleIosClientId, resolveIosBuild };
