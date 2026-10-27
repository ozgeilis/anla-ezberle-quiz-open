import { router, useLocalSearchParams } from "expo-router";
import { BackButton } from "../../components/ui/BackButton";
import React, { useState } from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import { Button, Card, Dialog, TextAction, Txt } from "../../components/ui";
import { SettingsButton } from "../../components/ui/SettingsButton";
import { ProgressMeter } from "../../components/ui/visuals";
import { useGame } from "../../storage/GameProvider";
import { Medal } from "../../components/game/Artwork";
import { useTheme } from "../../theme/tokens";
import { useAchievements } from "./AchievementProvider";
import { BadgeCard } from "./BadgeCard";
import { BadgeArt } from "./BadgeArt";
import { badgePresentation, badgeProgressCaption } from "./presentation";

export function AchievementsScreen() {
  const { data, updateShowcase } = useGame(),
    { badges, error, refresh } = useAchievements(),
    t = useTheme();
  const { badge: badgeId } = useLocalSearchParams<{ badge?: string }>();
  const { fontScale, width } = useWindowDimensions();
  const [selected, setSelected] = useState<string | null>(null),
    [notice, setNotice] = useState(""),
    [saving, setSaving] = useState(false);
  const closeDetail = () => {
    setSelected(null);
    router.setParams({ badge: undefined });
  };
  const earned = badges.filter((b) => b.earned),
    badge = badges.find((b) => b.id === (selected ?? badgeId));
  const visible = [...badges].sort(
    (a, b) =>
      Number(b.earned) - Number(a.earned) ||
      Number(b.fraction > 0) - Number(a.fraction > 0),
  );
  const columns = fontScale > 1.5 ? 1 : width >= 760 ? 3 : 2;
  const selectShowcase = async (id: string) => {
    if (saving) return;
    const current = (data.showcase ?? []).filter((x) =>
      earned.some((b) => b.id === x),
    );
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    if (next.length > 3) {
      setNotice("Vitrin için en fazla 3 rozet seç. Önce birini çıkar.");
      return;
    }
    setSaving(true);
    try {
      setNotice(
        (await updateShowcase(next))
          ? "Vitrinin kaydedildi."
          : "Vitrin kaydedilemedi. Yeniden dene.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: t.background }}>
      <FlatList
        key={columns}
        data={visible}
        numColumns={columns}
        keyExtractor={(b) => b.id}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 24,
          width: "100%",
          maxWidth: 900,
          alignSelf: "center",
          gap: 12,
        }}
        columnWrapperStyle={columns > 1 ? { gap: 12 } : undefined}
        ListHeaderComponent={
          <View style={{ gap: 20 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <BackButton />
              <Txt
                size={22}
                weight="bold"
                accessibilityRole="header"
                style={{ flex: 1 }}
              >
                Rozetler
              </Txt>
              <SettingsButton />
            </View>
            <Card style={{ gap: 8, marginBottom: 8 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <Medal size={40} />
                <Txt size={16} weight="semibold" style={{ flex: 1 }}>
                  {earned.length}/{badges.length} Rozet
                </Txt>
                <Txt size={12} color={t.muted}>
                  %
                  {badges.length
                    ? Math.round((earned.length / badges.length) * 100)
                    : 0}
                </Txt>
              </View>
              <ProgressMeter
                label="Rozet koleksiyonu"
                value={earned.length}
                max={badges.length}
              />
            </Card>
            {!!error && (
              <View>
                <Txt accessibilityRole="alert">{error}</Txt>
                <TextAction
                  title="Yeniden Dene"
                  onPress={() => void refresh()}
                />
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              width: (Math.min(width, 900) - 32 - 12 * (columns - 1)) / columns,
              minWidth: 0,
            }}
          >
            <BadgeCard
              badge={item}
              onPress={() => {
                setNotice("");
                setSelected(item.id);
              }}
            />
          </View>
        )}
        ListFooterComponent={
          <Txt size={11} color={t.muted} style={{ marginTop: 8 }}>
            Rozetler bilgi oyunu başarılarıdır; dinî yetkinlik göstergesi
            değildir.
          </Txt>
        }
      />
      {badge && (
        <Dialog visible title={badge.title} onClose={closeDetail}>
          <View style={{ alignItems: "center", gap: 12 }}>
            <BadgeArt badge={badge} earned={badge.earned} size={104} />
            <Txt size={14} style={{ textAlign: "center" }}>
              {badge.description}
            </Txt>
            <Txt size={12} color={t.muted}>
              {badgePresentation(badge).label}
            </Txt>
          </View>
          <ProgressMeter
            label={`${badge.title} ilerlemesi`}
            value={Math.round(badge.fraction * 100)}
            max={100}
          />
          <Txt size={12}>{badgeProgressCaption(badge)}</Txt>
          {badge.group === "social" && !badge.available && (
            <Txt size={12}>İlerleme için hesabına giriş yap.</Txt>
          )}
          {badge.earned && (
            <Button
              title={
                (data.showcase ?? []).includes(badge.id)
                  ? "Vitrinden çıkar"
                  : "Vitrine ekle"
              }
              loading={saving}
              onPress={() => selectShowcase(badge.id)}
            />
          )}
          {!!notice && (
            <Txt size={12} accessibilityLiveRegion="polite">
              {notice}
            </Txt>
          )}
        </Dialog>
      )}
    </View>
  );
}
