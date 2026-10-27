import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Avatar, Pattern } from "../../components/game/Artwork";
import { Icon, Tap, Txt } from "../../components/ui";
import { ProgressMeter } from "../../components/ui/visuals";
import type { progress } from "../../domain/scoring/progress";

export function PlayerIdentityCard({
  name,
  username,
  avatar,
  progress: p,
}: {
  name: string;
  username?: string | null;
  avatar: number;
  progress: ReturnType<typeof progress>;
}) {
  return (
    <LinearGradient
      colors={["#0B6863", "#074B4D", "#073C40"]}
      style={{
        padding: 16,
        borderRadius: 20,
        gap: 12,
        borderWidth: 1,
        borderColor: "#B79B52",
        overflow: "hidden",
      }}
    >
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ position: "absolute", inset: 0 }}
      >
        <Pattern color="#F5C451" opacity={0.08} />
      </View>
      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
        <Tap
          label="Profil avatarını düzenle"
          onPress={() => router.push("/settings/profile")}
          style={{ padding: 3, borderRadius: 44, backgroundColor: "#F5C451" }}
        >
          <Avatar variant={avatar} size={72} />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 25,
              height: 25,
              borderRadius: 14,
              backgroundColor: "#F5C451",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="edit-2" size={13} color="#17343A" />
          </View>
        </Tap>
        <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
          <Txt size={21} weight="bold" color="#FFFDF8">
            {name}
          </Txt>
          <Txt size={12} color="#BBE4DE">
            {username ? `@${username}` : "Misafir Oyuncu"}
          </Txt>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Icon name="star" size={16} color="#F5C451" />
            <Txt size={13} weight="semibold" color="#FFE39B">
              Seviye {p.level}
            </Txt>
          </View>
        </View>
      </View>
      <ProgressMeter
        label="Seviye ilerlemesi"
        value={p.levelXp}
        max={250}
        onJewel
        tone="gold"
      />
      <Txt size={12} color="#D6EDE8" style={{ textAlign: "right" }}>
        {p.level === 100 ? "En üst seviye" : `${p.levelXp} / 250 XP`}
      </Txt>
    </LinearGradient>
  );
}
