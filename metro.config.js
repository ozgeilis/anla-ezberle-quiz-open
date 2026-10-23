const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const root = __dirname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const existing = config.resolver.blockList;
// Git ignores do not restrict Metro's file map or HTTP transformation paths.
// Server credentials and private tester fixtures must also live OUTSIDE this
// project; these rules are defense in depth for accidentally copied files.
config.resolver.blockList = [
  ...(Array.isArray(existing) ? existing : existing ? [existing] : []),
  new RegExp(`^${root}[/\\\\]\\.env(?:\\.[^/\\\\]*)?$`),
  new RegExp(
    `^${root}[/\\\\](?:\\.local|supabase|scripts|tests|docs|artifacts|design)[/\\\\]`,
  ),
];

module.exports = config;
