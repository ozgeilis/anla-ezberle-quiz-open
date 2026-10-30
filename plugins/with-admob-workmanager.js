const { withDangerousMod } = require("expo/config-plugins");
const { readFile, writeFile } = require("node:fs/promises");
const { join } = require("node:path");

// Room 2.2.5 (via WorkManager/GMA) reflectively instantiates this constructor.
// Its consumer rules retain the name but R8 full mode removes the unused ctor.
const rule = `# AdMob WorkManager Room reflection (release startup regression)
-keep class androidx.work.impl.WorkDatabase_Impl {
    public <init>();
}`;
function appendRules(contents) {
  return contents.includes(rule)
    ? contents
    : `${contents.trimEnd()}\n\n${rule}\n`;
}
function withAdMobWorkManager(config) {
  return withDangerousMod(config, [
    "android",
    async (mod) => {
      const file = join(
        mod.modRequest.platformProjectRoot,
        "app",
        "proguard-rules.pro",
      );
      await writeFile(file, appendRules(await readFile(file, "utf8")));
      return mod;
    },
  ]);
}
module.exports = withAdMobWorkManager;
module.exports.appendRules = appendRules;
