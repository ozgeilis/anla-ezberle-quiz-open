import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface InternalProfile {
  distribution?: string;
  developmentClient?: boolean;
  environment?: string;
  env?: Record<string, string>;
  android?: { buildType?: string };
  ios?: { simulator?: boolean };
}
export interface InternalEasConfig {
  build?: Record<string, InternalProfile>;
  submit?: unknown;
}

/**
 * Verifies the current closed-test-only intent. This is not an EAS schema
 * validator and does not inspect remote Expo credentials or device signing.
 */
export function internalBuildIssues(config: InternalEasConfig): string[] {
  const issues: string[] = [];
  const build = config.build;
  if (config.submit !== undefined) issues.push("EAS Submit must not be configured for closed testing");
  if (!build || typeof build !== "object") return [...issues, "Missing build profiles"];

  const expected = ["development", "development-simulator", "preview"];
  for (const name of Object.keys(build)) {
    if (!expected.includes(name)) issues.push(`Unexpected build profile: ${name}`);
  }
  for (const name of expected) {
    const profile = build[name];
    if (!profile || typeof profile !== "object") {
      issues.push(`Missing build profile: ${name}`);
      continue;
    }
    const preview = name === "preview";
    const channel = preview ? "production" : "prototype";
    const environment = preview ? "preview" : "development";
    if (profile.distribution !== "internal") issues.push(`${name}: distribution must be internal`);
    if (profile.developmentClient !== !preview) issues.push(`${name}: incorrect developmentClient setting`);
    if (profile.environment !== environment) issues.push(`${name}: incorrect EAS environment`);
    if (profile.env?.EXPO_PUBLIC_CONTENT_CHANNEL !== channel) {
      issues.push(`${name}: incorrect question content channel`);
    }
    if (Object.keys(profile.env ?? {}).some(key => key !== "EXPO_PUBLIC_CONTENT_CHANNEL")) {
      issues.push(`${name}: unexpected inline environment variable`);
    }
  }
  if (build.preview?.android?.buildType !== "apk") {
    issues.push("preview: Android internal build must produce installable APK");
  }
  if (build["development-simulator"]?.ios?.simulator !== true) {
    issues.push("development-simulator: iOS simulator build must be enabled");
  }
  return issues;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
  const config = JSON.parse(readFileSync(resolve(root, "eas.json"), "utf8")) as InternalEasConfig;
  const issues = internalBuildIssues(config);
  process.stdout.write(JSON.stringify({ internalBuildConfigSafe: issues.length === 0, issues }, null, 2) + "\n");
  if (issues.length) process.exitCode = 1;
}
