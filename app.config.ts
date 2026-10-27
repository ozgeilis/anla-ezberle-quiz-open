import type { ConfigContext, ExpoConfig } from "expo/config";
import { existsSync, readFileSync } from "node:fs";
export default function ({ config }: ConfigContext): ExpoConfig {
  const file = process.env.GOOGLE_SERVICES_JSON;
  if (file) {
    if (!existsSync(file))
      throw Error(
        "GOOGLE_SERVICES_JSON must point to the EAS-managed configuration file.",
      );
    const firebase = JSON.parse(readFileSync(file, "utf8"));
    if (
      !firebase.client?.some(
        (c: {
          client_info?: { android_client_info?: { package_name?: string } };
        }) =>
          c.client_info?.android_client_info?.package_name ===
          config.android?.package,
      )
    )
      throw Error(
        "Firebase Android package does not match this build; values withheld.",
      );
  }
  return {
    ...config,
    name: config.name!,
    slug: config.slug!,
    android: {
      ...config.android,
      ...(file ? { googleServicesFile: file } : {}),
    },
  };
}
