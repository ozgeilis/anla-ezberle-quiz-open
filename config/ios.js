// Identity stays unchanged until the owner approves a registered Apple App ID.
const proposedBundleId = "com.kovynelstudio.anlaezberle";
// Read-only membership verification and owner-approved App ID registration,
// 2026-11-01. This public Team identifier is not a signing credential.
const registeredAppleTeamId = "W7CRC43SHP";
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
  };
}
module.exports = { proposedBundleId, resolveIosBuild };
