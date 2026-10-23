import React from "react";
import { View } from "react-native";
import { Txt } from "../../components/ui";
import { badgeCatalog } from "../../domain/achievements/catalog";
import { SocialPlayer } from "../online/types";
import { BadgeArt } from "./BadgeArt";
export function PublicAchievements({ player }: { player: SocialPlayer }) {
  const earned = badgeCatalog.filter(
    (b) => b.group === "social" && player.badgeIds?.includes(b.id),
  );
  const showcase = (player.showcase ?? [])
    .map((id) => earned.find((b) => b.id === id))
    .filter((b) => !!b);
  return (
    <View style={{ gap: 8 }}>
      {player.achievementsShared ? (
        <>
          <Txt size={12}>Herkese açık başarılar · {earned.length} / 6</Txt>
          {(showcase.length ? showcase : earned).map((b) => (
            <View
              key={b.id}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <BadgeArt badge={b} earned size={37} />
              <View style={{ flex: 1 }}>
                <Txt size={12} weight="bold">
                  {b.title}
                </Txt>
                <Txt size={11}>{b.description}</Txt>
              </View>
            </View>
          ))}
          {showcase.length > 0 && earned.length > showcase.length && (
            <Txt size={11}>
              Diğer rozetler:{" "}
              {earned
                .filter((b) => !showcase.some((s) => s.id === b.id))
                .map((b) => b.title)
                .join(", ")}
            </Txt>
          )}
          {!earned.length && (
            <Txt size={12}>Henüz çevrimiçi rozet kazanılmadı.</Txt>
          )}
        </>
      ) : (
        <Txt size={12}>Rozet koleksiyonu gizli</Txt>
      )}
    </View>
  );
}
