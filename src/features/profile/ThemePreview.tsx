import React from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Scene } from "../../components/game/Artwork";
import { Icon } from "../../components/ui";
import { useGame } from "../../storage/GameProvider";
import { usePlayerIdentity } from "../online/SocialIdentityProvider";
import {
  colors as c,
  fonts,
  gradients,
  themePalette,
} from "../../theme/tokens";
import { progress } from "../../domain/scoring/progress";

export function ThemePreview({
  dark,
  compact = false,
}: {
  dark: boolean;
  compact?: boolean;
}) {
  const palette = themePalette(dark);
  const { data } = useGame();
  const { displayName } = usePlayerIdentity();
  const p = progress(data.games);
  const caption = { fontFamily: fonts.bold, fontSize: 10, color: palette.text };
  if (compact)
    return (
      <View
        accessible={false}
        aria-hidden
        importantForAccessibility="no-hide-descendants"
        style={{
          width: 92,
          height: 96,
          borderRadius: 12,
          padding: 7,
          gap: 5,
          backgroundColor: palette.background,
          borderWidth: 1,
          borderColor: palette.border,
          overflow: "hidden",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Avatar variant={data.profile.avatar} size={17} />
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={{ ...caption, fontSize: 7 }}>
              {displayName}
            </Text>
            <Text style={{ ...caption, fontSize: 6, color: palette.accent }}>
              Seviye {p.level}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 44,
            borderRadius: 7,
            overflow: "hidden",
            backgroundColor: palette.accent,
            justifyContent: "flex-end",
            padding: 4,
          }}
        >
          <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
            <Scene />
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.heavy,
              fontSize: 8,
              color: c.white,
              textShadowColor: c.deepTeal,
              textShadowRadius: 2,
            }}
          >
            Anla & Ezberle
          </Text>
        </View>
        <View
          style={{
            height: 10,
            borderRadius: 4,
            backgroundColor: c.gold,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontFamily: fonts.bold, fontSize: 5, color: c.navy }}>
            Oyuna Başla
          </Text>
        </View>
      </View>
    );
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      aria-hidden
      style={{
        width: "100%",
        borderRadius: 18,
        padding: 12,
        gap: 9,
        backgroundColor: palette.background,
        borderWidth: 1,
        borderColor: palette.border,
        overflow: "hidden",
      }}
    >
      <View style={{ flexDirection: "row", gap: 7, alignItems: "center" }}>
        <Avatar variant={data.profile.avatar} size={29} />
        <View style={{ flex: 1 }}>
          <Text style={caption}>Merhaba!</Text>
          <Text numberOfLines={1} style={{ ...caption, color: palette.accent }}>
            {displayName}
          </Text>
        </View>
        <Icon name="star" size={16} color={palette.goldInk} />
      </View>
      <LinearGradient
        colors={gradients.hero}
        style={{
          minHeight: 124,
          borderRadius: 14,
          padding: 12,
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
          <Scene />
        </View>
        <Text style={{ fontFamily: fonts.heavy, fontSize: 15, color: c.white }}>
          Anla &
        </Text>
        <Text style={{ fontFamily: fonts.heavy, fontSize: 24, color: c.gold }}>
          Ezberle
        </Text>
        <Text
          style={{ ...caption, color: c.white, fontSize: 9, marginBottom: 9 }}
        >
          Bilgini sına, öğren, ilerle!
        </Text>
        <LinearGradient
          colors={gradients.mustard}
          style={{
            borderRadius: 10,
            minHeight: 29,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Icon name="play-circle" size={14} color={c.navy} />
          <Text style={{ ...caption, color: c.navy }}>Oyuna Başla</Text>
        </LinearGradient>
      </LinearGradient>
      <View style={{ flexDirection: "row", gap: 7 }}>
        <View
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: palette.goldBorder,
            backgroundColor: palette.goldSurface,
          }}
        >
          <Text style={{ ...caption, color: palette.goldInk }}>
            Seviye {p.level}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: palette.border,
            backgroundColor: palette.card,
          }}
        >
          <Text style={caption}>{p.xp} XP</Text>
        </View>
      </View>
      <View
        style={{
          height: 3,
          width: "36%",
          alignSelf: "center",
          borderRadius: 3,
          backgroundColor: palette.accent,
          opacity: 0.8,
        }}
      />
    </View>
  );
}
