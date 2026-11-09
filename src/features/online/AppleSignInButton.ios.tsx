import { useEffect, useState } from "react";
import { View } from "react-native";
import * as Apple from "expo-apple-authentication";
import { useTheme } from "../../theme/tokens";
import { appleNativeAvailable } from "./appleAuth";
export function AppleSignInButton({
  busy,
  enabled,
  onPress,
}: {
  busy: boolean;
  enabled: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let alive = true;
    void appleNativeAvailable().then((v) => {
      if (alive) setAvailable(v);
    });
    return () => {
      alive = false;
    };
  }, []);
  if (!enabled || !available) return null;
  return (
    <View
      pointerEvents={busy ? "none" : "auto"}
      accessibilityState={{ disabled: busy }}
      style={{ opacity: busy ? 0.6 : 1 }}
    >
      <Apple.AppleAuthenticationButton
        buttonType={Apple.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={
          theme.dark
            ? Apple.AppleAuthenticationButtonStyle.WHITE
            : Apple.AppleAuthenticationButtonStyle.BLACK
        }
        cornerRadius={16}
        style={{ width: "100%", height: 48 }}
        onPress={onPress}
      />
    </View>
  );
}
