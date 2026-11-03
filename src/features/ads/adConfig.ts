import Constants from "expo-constants";
import { Platform } from "react-native";
import { resolveRuntimeAds } from "./runtimeConfig";

const build = Constants.expoConfig?.extra?.ads;
export const adConfig = resolveRuntimeAds(Platform.OS, build, __DEV__);
