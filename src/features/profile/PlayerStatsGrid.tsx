import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { profileSummary } from "./summary";
import { StatCard } from "./StatCard";
const number = (n: number) =>
  n >= 10000
    ? new Intl.NumberFormat("tr-TR", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(n)
    : n.toLocaleString("tr-TR");
export function PlayerStatsGrid({
  summary: s,
}: {
  summary: ReturnType<typeof profileSummary>;
}) {
  const t = useTheme(),
    { fontScale, width } = useWindowDimensions();
  return (
    <View style={{ gap: 10 }}>
      <Txt size={18} weight="bold" accessibilityRole="header">
        İstatistiklerim
      </Txt>
      <Txt size={12} color={t.muted}>
        Bu cihazdaki tamamlanan turlar
      </Txt>
      <View
        style={{
          flexDirection: fontScale > 1.3 || width < 300 ? "column" : "row",
          gap: 8,
        }}
      >
        <StatCard
          title="Oynanan Oyun"
          value={number(s.games)}
          tone="green"
          icon="gamepad"
          description={`Oynanan Oyun: ${s.games}`}
        />
        <StatCard
          title="Doğruluk Oranı"
          value={s.accuracy === null ? "—" : `%${s.accuracy}`}
          tone="blue"
          icon="target"
          description={`Doğruluk Oranı: ${s.accuracy === null ? "Henüz yok" : `yüzde ${s.accuracy}`}. Cevapsızlar dahildir.`}
        />
        <StatCard
          title="Toplam Skor"
          value={number(s.totalScore)}
          tone="gold"
          icon="award"
          description={`Toplam Skor: ${s.totalScore.toLocaleString("tr-TR")}`}
        />
      </View>
      <View
        style={{
          flexDirection: fontScale > 1.3 || width < 300 ? "column" : "row",
          gap: 8,
        }}
      >
        <StatCard
          title="Favori Kategori"
          value={s.favorite ?? "Henüz belirlenmedi"}
          tone="purple"
          icon="book-open"
        />
        <StatCard
          title="Günlük Seri"
          value={`${s.streak} gün`}
          tone="coral"
          icon="flame"
        />
      </View>
    </View>
  );
}
