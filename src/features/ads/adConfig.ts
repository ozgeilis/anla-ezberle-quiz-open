import Constants from "expo-constants";
import { Platform } from "react-native";

const build = Constants.expoConfig?.extra?.ads;
export const adConfig = {
  // iOS remains off until its native/privacy acceptance. Web never imports GMA.
  enabled:
    Platform.OS === "android" &&
    build?.mode === "test" &&
    build?.realAdsEnabled === false &&
    typeof build?.androidAppId === "string" &&
    /^ca-app-pub-\d{16}~\d{10}$/.test(build.androidAppId),
  mode: "test" as const,
  consentDebugEea: __DEV__ && build?.consentDebugGeography === "EEA",
};
