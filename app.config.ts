import type { ConfigContext, ExpoConfig } from "expo/config";
import { existsSync, readFileSync } from "node:fs";
import { resolveAdBuild } from "./config/admob.js";
import { resolveIosBuild } from "./config/ios.js";
import brandAssets from "./config/brand-assets.json";
import iosSkAdNetworkItems from "./config/ios-skadnetwork.json";
export default function ({ config }: ConfigContext): ExpoConfig {
  const ads = resolveAdBuild(process.env);
  const ios = resolveIosBuild(process.env, config.ios?.bundleIdentifier);
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
    icon: `./${brandAssets.outputs.icon}`,
    web: {
      ...config.web,
      name: config.name!,
      favicon: `./${brandAssets.outputs.favicon}`,
    },
    extra: {
      ...config.extra,
      ads,
      appleAuthentication: ios.appleAuthentication,
      ...(ios.googleIosClientId
        ? { googleIosClientId: ios.googleIosClientId }
        : {}),
    },
    ios: {
      ...config.ios,
      icon: `./${brandAssets.outputs.icon}`,
      bundleIdentifier: ios.bundleIdentifier,
      ...(ios.appleTeamId ? { appleTeamId: ios.appleTeamId } : {}),
      ...(ios.appleAuthentication ? { usesAppleSignIn: true } : {}),
      // GoogleSignIn requires its reversed client ID as a registered URL scheme.
      ...(ios.googleIosUrlScheme ? { scheme: [ios.googleIosUrlScheme] } : {}),
      infoPlist: {
        ...config.ios?.infoPlist,
        CFBundleDisplayName: config.name!,
        ITSAppUsesNonExemptEncryption: false,
        CFBundleDevelopmentRegion: "tr",
      },
    },
    plugins: [
      ...(config.plugins ?? []).map((plugin) => {
        if (!Array.isArray(plugin)) return plugin;
        if (plugin[0] === "expo-splash-screen")
          return [
            plugin[0],
            {
              ...plugin[1],
              image: `./${brandAssets.outputs.splash}`,
              dark: {
                ...plugin[1]?.dark,
                image: `./${brandAssets.outputs.splash}`,
              },
            },
          ] as [string, Record<string, unknown>];
        if (ios.storeDistribution && plugin[0] === "expo-notifications")
          return [plugin[0], { ...plugin[1], mode: "production" }] as [
            string,
            Record<string, unknown>,
          ];
        return plugin;
      }),
      ...(ios.appleAuthentication ? ["expo-apple-authentication"] : []),
      "./plugins/with-admob-workmanager.js",
      ...(ios.googleIosClientId
        ? ["./plugins/with-google-signin-modular-headers.js"]
        : []),
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: ads.androidAppId,
          iosAppId: ads.iosAppId,
          androidSdk: "classic",
          delayAppMeasurementInit: true,
          optimizeInitialization: true,
          optimizeAdLoading: true,
          ...(ads.platform === "ios" && ads.mode !== "off"
            ? {
                userTrackingUsageDescription:
                  "İzninizle cihaz tanımlayıcıları reklamların sunulması ve ölçülmesi için Google ile paylaşılır. İzin vermeden oyuna devam edebilirsiniz.",
                skAdNetworkItems: iosSkAdNetworkItems,
              }
            : {}),
        },
      ],
    ],
    android: {
      ...config.android,
      adaptiveIcon: {
        ...config.android?.adaptiveIcon,
        foregroundImage: `./${brandAssets.outputs.adaptiveForeground}`,
        backgroundColor: brandAssets.backgroundColor,
      },
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
