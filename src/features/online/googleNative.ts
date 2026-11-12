import { Platform } from "react-native";
import Constants from "expo-constants";
import { requireOptionalNativeModule } from "expo";

interface GoogleNativeSignInModule {
  signIn(
    clientId: string,
    hashedNonce: string,
  ): Promise<{ idToken: string; accessToken: string }>;
  signOut(): Promise<void>;
}

// iOS builds for the registered Bundle ID carry a native GoogleSignIn module
// and its public iOS client ID. Other platforms/builds keep the web flow.
export function googleNativeSignIn() {
  if (Platform.OS !== "ios") return null;
  const clientId = Constants.expoConfig?.extra?.googleIosClientId;
  const module =
    requireOptionalNativeModule<GoogleNativeSignInModule>("GoogleNativeSignIn");
  return typeof clientId === "string" && module ? { clientId, module } : null;
}

export function isGoogleNativeCancel(error: unknown) {
  return (
    !!error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "ERR_CANCELED"
  );
}
