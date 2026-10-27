import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar } from "../../components/game/Artwork";
import { Icon, Tap, Txt } from "../../components/ui";
import { avatarCatalog, avatarName } from "../../domain/profile/avatars";
import { colors as c, gradients, shadows, useTheme } from "../../theme/tokens";

export function AvatarChoices({
  selectedAvatar,
  wide,
  busy,
  onSelect,
}: {
  selectedAvatar: number;
  wide: boolean;
  busy: boolean;
  onSelect: (avatar: number) => void;
}) {
  const theme = useTheme();
  return (
    <>
      <LinearGradient
        colors={gradients.hero}
        style={{
          padding: 16,
          borderRadius: 21,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <View
          style={{
            padding: 4,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: c.gold,
            backgroundColor: "rgba(255,255,255,.12)",
          }}
        >
          <Avatar variant={selectedAvatar} size={76} />
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <Txt size={10} color={c.tealLight} weight="bold">
            SEÇTİĞİN KARAKTER
          </Txt>
          <Txt size={18} color={c.white} weight="heavy">
            {avatarName(selectedAvatar)}
          </Txt>
          <Txt size={12} color={c.gold}>
            Seçim tamamen senin.
          </Txt>
        </View>
      </LinearGradient>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Avatar seçimi"
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
        }}
      >
        {avatarCatalog.map((avatar) => {
          const selected = selectedAvatar === avatar.id;
          return (
            <Tap
              key={avatar.id}
              role="radio"
              label={avatar.name}
              selected={selected}
              disabled={busy}
              onPress={() => onSelect(avatar.id)}
              style={{
                width: wide ? 102 : 78,
                height: wide ? 102 : 78,
                borderRadius: 20,
                padding: 6,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: selected ? theme.goldSurface : theme.card,
                borderColor: selected ? theme.goldBorder : theme.border,
                borderWidth: 2,
                boxShadow: selected ? shadows.selected : shadows.card,
              }}
            >
              <Avatar variant={avatar.id} size={wide ? 74 : 62} />
              {selected && (
                <View
                  style={{
                    position: "absolute",
                    top: 3,
                    right: 3,
                    backgroundColor: c.gold,
                    borderRadius: 12,
                    padding: 3,
                  }}
                >
                  <Icon name="check" size={13} color={c.navy} />
                </View>
              )}
            </Tap>
          );
        })}
      </View>
      <Txt size={12} color={theme.muted}>
        Çevrimiçi arkadaşların da görsün istersen, kaydettikten sonra
        Ayarlar’daki “Avatarını çevrimiçi eşitle” ile uygula.
      </Txt>
    </>
  );
}
