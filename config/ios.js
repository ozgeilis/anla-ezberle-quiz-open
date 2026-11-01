// Identity stays unchanged until the owner approves a registered Apple App ID.
const proposedBundleId = "com.kovynelstudio.anlaezberle";
function resolveIosBuild(env, currentId) {
  const profile = env.EAS_BUILD_PROFILE;
  const store = profile === "ios-testflight";
  const registered =
    (store || profile === "ios-development") && env.IOS_REGISTERED_BUNDLE_ID;
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
    appleAuthentication: env.IOS_APPLE_AUTH === "1",
  };
}
module.exports = { proposedBundleId, resolveIosBuild };
