import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface ReadinessItem { id: string; pass: boolean; detail: string }
export interface EASBuildConfig {
  build?: Record<string, {
    distribution?: string;
    developmentClient?: boolean;
    environment?: string;
    env?: Record<string, string>;
  }>;
}
export function checkReleaseConfig(config: {
  expo?: { version?: string; ios?: { bundleIdentifier?: string }; android?: { package?: string }; icon?: string; web?: { favicon?: string } }
}, eas: EASBuildConfig | null): ReadinessItem[] {
  const expo = config.expo ?? {};
  const ios = expo.ios?.bundleIdentifier ?? "";
  const android = expo.android?.package ?? "";
  const production = eas?.build?.production;
  const hasProductionProfile = Boolean(production && production.distribution !== "internal" &&
    production.developmentClient !== true && production.environment === "production" &&
    production.env?.EXPO_PUBLIC_CONTENT_CHANNEL !== "prototype");
  return [
    { id: "ios-identifier", pass: /^([a-zA-Z][a-zA-Z0-9-]*\.)+[a-zA-Z][a-zA-Z0-9-]*$/.test(ios) && !/prototype|example|test/i.test(ios), detail: ios || "Missing" },
    { id: "android-identifier", pass: /^([a-zA-Z][a-zA-Z0-9_]*\.)+[a-zA-Z][a-zA-Z0-9_]*$/.test(android) && !/prototype|example|test/i.test(android), detail: android || "Missing" },
    { id: "eas-build-config", pass: eas !== null, detail: eas ? "eas.json present" : "eas.json missing" },
    { id: "production-build-profile", pass: hasProductionProfile, detail: hasProductionProfile ? "Production store build profile declared; signing still needs verification" : "No safe production build profile (internal-only profiles are not store releases)" },
    { id: "app-icon", pass: Boolean(expo.icon), detail: expo.icon || "Missing" },
    { id: "app-version", pass: /^\d+\.\d+\.\d+$/.test(expo.version ?? ""), detail: expo.version || "Missing" },
  ];
}
export function releaseReport(items: readonly ReadinessItem[]) {
  return { readyForStoreSubmission: items.every(item => item.pass), checks: items };
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
  const config = JSON.parse(readFileSync(resolve(root, "app.json"), "utf8"));
  const easPath = resolve(root, "eas.json");
  const eas: EASBuildConfig | null = existsSync(easPath)
    ? JSON.parse(readFileSync(easPath, "utf8")) as EASBuildConfig : null;
  const report = releaseReport(checkReleaseConfig(config, eas));
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  if (!report.readyForStoreSubmission) process.exitCode = 1;
}
