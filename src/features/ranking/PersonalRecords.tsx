import { stageDefinition } from "../../domain/game/stages";
import React from "react";
import { View } from "react-native";
import { Card, Icon, s, Txt } from "../../components/ui";
import { IconMedallion, JewelStat } from "../../components/ui/visuals";
import { categoryName } from "../../content/questions";
import { formatTime, stats } from "../../domain/game/engine";
import { learningTopicName } from "../../domain/game/learning";
import { profileSummary } from "../profile/summary";
import { progress } from "../../domain/scoring/progress";
import { useGame } from "../../storage/GameProvider";
import { colors as c, useTheme } from "../../theme/tokens";
export function PersonalRecords() {
  const { data } = useGame();
  const theme = useTheme();
  const p = progress(data.games);
  const summary = profileSummary(data.games);
  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 18,
        }}
      >
        <JewelStat
          twoColumns
          title="En iyi skorun"
          value={p.best}
          icon="award"
        />
        <JewelStat
          twoColumns
          title="Tamamlanan tur"
          value={data.games.length}
          icon="flag"
          blue
        />
        <JewelStat
          twoColumns
          title="Toplam kazanılan XP"
          value={p.xp}
          icon="star"
        />
        <JewelStat
          twoColumns
          title="Doğruluk oranı"
          value={
            summary.accuracy === null ? "Henüz yok" : `%${summary.accuracy}`
          }
          icon="target"
          blue
        />
      </View>
      <Txt
        accessibilityRole="header"
        size={21}
        weight="heavy"
        style={{ marginTop: 26, marginBottom: 16 }}
      >
        Kişisel skor geçmişin
      </Txt>
      {data.games.length === 0 && (
        <Card style={{ gap: 10 }}>
          <Icon name="flag" color={c.emerald} />
          <Txt weight="heavy" size={18}>
            İlk skorun seni bekliyor!
          </Txt>
          <Txt color={theme.muted}>
            Bir yarışmayı tamamladığında gerçek skorun burada görünecek.
          </Txt>
        </Card>
      )}
      <View style={{ gap: 12 }}>
        {data.games
          .slice(-30)
          .reverse()
          .map((game) => {
            const summary = stats(game);
            return (
              <Card
                key={game.id}
                style={[
                  s.row,
                  {
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                  },
                ]}
              >
                <IconMedallion name="book-open" size={42} tone="mint" />
                <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
                  <Txt weight="heavy" size={16}>
                    {game.learningTopic
                      ? learningTopicName(game.learningTopic)
                      : game.mode === "daily"
                        ? "Günün Yarışması"
                        : game.mode === "focus" && game.focus
                          ? categoryName(game.focus)
                          : "Karma yarışma"}
                  </Txt>
                  {game.stage && (
                    <Txt size={12} color={theme.accent}>
                      {stageDefinition(game.stage).title} aşaması
                    </Txt>
                  )}
                  <View style={[s.row, { flexWrap: "wrap", gap: 8 }]}>
                    <View style={[s.row, { gap: 4 }]}>
                      <Icon name="calendar" size={13} color={theme.muted} />
                      <Txt size={12} color={theme.muted}>
                        {new Date(game.completedAt).toLocaleDateString(
                          "tr-TR",
                          {
                            timeZone: "Europe/Istanbul",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </Txt>
                    </View>
                    <View style={[s.row, { gap: 4 }]}>
                      <Icon
                        name="check-circle"
                        size={13}
                        color={theme.accent}
                      />
                      <Txt size={12} color={theme.muted}>
                        {summary.correct}/10 doğru
                      </Txt>
                    </View>
                    <View style={[s.row, { gap: 4 }]}>
                      <Icon name="clock" size={13} color={theme.muted} />
                      <Txt size={12} color={theme.muted}>
                        {formatTime(summary.seconds)}
                      </Txt>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    alignItems: "center",
                    gap: 3,
                    backgroundColor: c.teal,
                    paddingHorizontal: 10,
                    paddingVertical: 9,
                    borderRadius: 16,
                  }}
                >
                  <Icon name="bar-chart-2" size={17} color={c.gold} />
                  <Txt size={23} weight="heavy" color={c.white}>
                    {summary.score}
                  </Txt>
                  <Txt size={10} color={c.tealLight}>
                    puan
                  </Txt>
                </View>
              </Card>
            );
          })}
      </View>
      {data.games.length > 30 && (
        <Txt size={12} color={theme.muted} style={{ marginTop: 16 }}>
          Son 30 tur gösteriliyor. Toplam {data.games.length} kayıt cihazda
          korunuyor.
        </Txt>
      )}
    </View>
  );
}
