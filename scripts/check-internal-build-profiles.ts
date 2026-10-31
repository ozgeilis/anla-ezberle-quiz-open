import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface InternalProfile {
  extends?: string;
  distribution?: string;
  developmentClient?: boolean;
  environment?: string;
  env?: Record<string, string>;
  android?: { buildType?: string };
  ios?: { simulator?: boolean };
  autoIncrement?: boolean;
}
export interface InternalEasConfig {
  build?: Record<string, InternalProfile>;
  submit?: unknown;
}

/**
 * Keeps internal builds isolated and permits the explicitly prepared store profile.
 * The separate pre-install gate requires owner/package/physical APK approval.
 * This is not an EAS schema
 * validator and does not inspect remote Expo credentials or device signing.
 */
export function internalBuildIssues(config: InternalEasConfig): string[] {
  const issues: string[] = [];
  const build = config.build;
  if (config.submit !== undefined)
    issues.push("EAS Submit must not be configured for this preparation");
  if (!build || typeof build !== "object")
    return [...issues, "Missing build profiles"];

  const expected = ["development", "development-simulator", "preview"];
  const adsProfiles = {
    "ads-preview": "preview",
    "ads-development": "development",
    "ads-closed-test": "production",
  };
  for (const name of Object.keys(build)) {
    if (
      !expected.includes(name) &&
      name !== "production" &&
      !(name in adsProfiles)
    )
      issues.push(`Unexpected build profile: ${name}`);
  }
  for (const [name, parent] of Object.entries(adsProfiles)) {
    const profile = build[name];
    if (
      profile &&
      (profile.extends !== parent ||
        Object.keys(profile).some(
          (key) =>
            key !== "extends" &&
            key !== "env" &&
            !(name === "ads-closed-test" && key === "environment"),
        ) ||
        (name === "ads-closed-test" && profile.environment !== "preview") ||
        profile.env?.ADS_MODE !== "test" ||
        profile.env?.ADS_TEST_BUILD !== "1" ||
        Object.keys(profile.env ?? {}).some(
          (key) =>
            !["ADS_MODE", "ADS_TEST_BUILD", "ADMOB_ANDROID_APP_ID"].includes(
              key,
            ),
        ) ||
        (profile.env?.ADMOB_ANDROID_APP_ID !== undefined &&
          !/^ca-app-pub-\d{16}~\d{10}$/.test(profile.env.ADMOB_ANDROID_APP_ID)))
    )
      issues.push(
        `${name}: only an isolated test-ad extension of the reviewed parent profile is permitted`,
      );
  }
  if (build["ads-closed-test"] && !build.production)
    issues.push("ads-closed-test: guarded production parent is required");
  for (const name of expected) {
    const profile = build[name];
    if (!profile || typeof profile !== "object") {
      issues.push(`Missing build profile: ${name}`);
      continue;
    }
    const preview = name === "preview";
    const channel = preview ? "production" : "prototype";
    const environment = preview ? "preview" : "development";
    if (profile.distribution !== "internal")
      issues.push(`${name}: distribution must be internal`);
    if (profile.developmentClient !== !preview)
      issues.push(`${name}: incorrect developmentClient setting`);
    if (profile.environment !== environment)
      issues.push(`${name}: incorrect EAS environment`);
    if (profile.env?.EXPO_PUBLIC_CONTENT_CHANNEL !== channel) {
      issues.push(`${name}: incorrect question content channel`);
    }
    if (
      Object.keys(profile.env ?? {}).some(
        (key) => key !== "EXPO_PUBLIC_CONTENT_CHANNEL",
      )
    ) {
      issues.push(`${name}: unexpected inline environment variable`);
    }
  }
  if (build.preview?.android?.buildType !== "apk") {
    issues.push("preview: Android internal build must produce installable APK");
  }
  if (build["development-simulator"]?.ios?.simulator !== true) {
    issues.push("development-simulator: iOS simulator build must be enabled");
  }
  const production = build.production;
  if (production) {
    if (
      production.distribution !== "store" ||
      production.developmentClient !== false ||
      production.environment !== "production" ||
      production.env?.EXPO_PUBLIC_CONTENT_CHANNEL !== "production" ||
      Object.keys(production.env).length !== 1 ||
      production.android?.buildType !== "app-bundle" ||
      production.autoIncrement !== true
    )
      issues.push(
        "production: only the reviewed, guarded Android AAB profile is permitted",
      );
  }
  return issues;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
  const config = JSON.parse(
    readFileSync(resolve(root, "eas.json"), "utf8"),
  ) as InternalEasConfig;
  const issues = internalBuildIssues(config);
  process.stdout.write(
    JSON.stringify(
      { internalBuildConfigSafe: issues.length === 0, issues },
      null,
      2,
    ) + "\n",
  );
  if (issues.length) process.exitCode = 1;
}
