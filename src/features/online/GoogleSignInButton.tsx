import React from "react";
import { Image, View } from "react-native";
import { Tap, Txt } from "../../components/ui";
export function GoogleSignInButton({
  busy,
  enabled,
  onPress,
}: {
  busy: boolean;
  enabled: boolean;
  onPress: () => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Txt size={12} style={{ textAlign: "center" }}>
        — veya —
      </Txt>
      <Tap
        label="Google ile Devam Et"
        disabled={busy || !enabled}
        onPress={onPress}
        style={{
          minHeight: 48,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#747775",
          backgroundColor: "#FFF",
          padding: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <Image
          source={require("../../../assets/images/auth/google-g.png")}
          style={{ width: 20, height: 20 }}
          accessible={false}
        />
        <Txt color="#1F1F1F" size={14} weight="semibold">
          {busy ? "Bağlanıyor…" : "Google ile Devam Et"}
        </Txt>
      </Tap>
      {!enabled && (
        <Txt size={12}>Google ile giriş kapalı test hazırlığında.</Txt>
      )}
    </View>
  );
}
