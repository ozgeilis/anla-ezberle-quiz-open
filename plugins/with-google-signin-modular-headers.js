const { withDangerousMod } = require("expo/config-plugins");
const { readFile, writeFile } = require("node:fs/promises");
const { join } = require("node:path");

// GoogleSignIn 10 (local native Google module) pulls Swift AppCheckCore, which
// imports these Objective-C pods; static linking needs their module maps.
const pods = `  # Native Google Sign-In: module maps for AppCheckCore's Objective-C deps
  pod 'GoogleUtilities', :modular_headers => true
  pod 'RecaptchaInterop', :modular_headers => true`;
function addPods(contents) {
  if (contents.includes(pods)) return contents;
  const anchor = "  use_expo_modules!";
  if (!contents.includes(anchor))
    throw Error("Podfile anchor for native Google Sign-In not found");
  return contents.replace(anchor, `${anchor}\n${pods}`);
}
module.exports = function withGoogleSignInModularHeaders(config) {
  return withDangerousMod(config, [
    "ios",
    async (mod) => {
      const file = join(mod.modRequest.platformProjectRoot, "Podfile");
      await writeFile(file, addPods(await readFile(file, "utf8")));
      return mod;
    },
  ]);
};
