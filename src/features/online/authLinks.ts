import * as Linking from "expo-linking";
import { Platform } from "react-native";

// Installed Android/iOS builds use the app.json scheme; web stays on its own
// origin. Expo Go's exp:// URL is deliberately not an authentication target.
export function authRedirectUrl() {
  return Platform.OS === "web"
    ? new URL("/online/auth", window.location.origin).toString()
    : Linking.createURL("online/auth", { scheme: "anla-ezberle-quiz" });
}
