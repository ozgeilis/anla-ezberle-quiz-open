import type { ConfigContext, ExpoConfig } from "expo/config";
import { existsSync, readFileSync } from "node:fs";
import { resolveAdBuild } from "./config/admob.js";
export default function ({ config }: ConfigContext): ExpoConfig {
  const ads = resolveAdBuild(process.env);
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
    extra: { ...config.extra, ads },
    plugins: [
      ...(config.plugins ?? []),
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: ads.androidAppId,
          iosAppId: ads.iosAppId,
          androidSdk: "classic",
          delayAppMeasurementInit: true,
          optimizeInitialization: true,
          optimizeAdLoading: true,
        },
      ],
    ],
    android: {
      ...config.android,
      // This test-only integration never requests the advertising ID.
      blockedPermissions: [
        ...(config.android?.blockedPermissions ?? []),
        "com.google.android.gms.permission.AD_ID",
        "android.permission.ACCESS_ADSERVICES_AD_ID",
        "android.permission.ACCESS_ADSERVICES_ATTRIBUTION",
        "android.permission.ACCESS_ADSERVICES_TOPICS",
      ],
      ...(file ? { googleServicesFile: file } : {}),
    },
  };
}
