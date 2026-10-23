import React, { useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Button, Card, Tap, Txt } from "../../components/ui";
import { ProgressMeter } from "../../components/ui/visuals";
import { useGame } from "../../storage/GameProvider";
import { Medal } from "../../components/game/Artwork";
import {
  GoldHeading,
  PlayerHeader,
  ReferenceHero,
} from "../../components/game/ReferenceHero";
import { BadgeGroup } from "../../domain/achievements/catalog";
import { learningTopicsV1 } from "../../content/questions/learning-topics-v1";
import { colors as c, useTheme, shadows } from "../../theme/tokens";
import { useAchievements } from "./AchievementProvider";
import { BadgeCard } from "./BadgeCard";
import { matchesCollection, type CollectionFilter } from "./presentation";
export function AchievementsScreen() {
  const { data, updateShowcase } = useGame(),
    { badges, social, error, refresh } = useAchievements(),
    theme = useTheme(),
    { width, fontScale } = useWindowDimensions();
  const [group, setGroup] = useState<BadgeGroup | "all">("all"),
    [status, setStatus] = useState<CollectionFilter>("all"),
    [subject, setSubject] = useState("all"),
    [notice, setNotice] = useState("");
  const earned = badges.filter((b) => b.earned);
  const visible = badges.filter(
    (b) =>
      (group === "all" || b.group === group) &&
      (subject === "all" || b.subject === subject) &&
      matchesCollection(b, status),
  );
  const selectShowcase = async (id: string) => {
    const selected = (data.showcase ?? []).filter((x) =>
      earned.some((b) => b.id === x),
    );
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    if (next.length > 3) {
      setNotice("Vitrin için en fazla 3 rozet seç. Önce birini çıkar.");
      return;
    }
    setNotice(
      (await updateShowcase(next))
        ? "Vitrinin kaydedildi."
        : "Vitrin kaydedilemedi. Yeniden dene.",
    );
  };
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        width: "100%",
        maxWidth: 760,
        alignSelf: "center",
        paddingBottom: 32,
      }}
    >
      <ReferenceHero>
        <PlayerHeader />
        <GoldHeading size={width < 360 ? 40 : 48}>Rozetler</GoldHeading>
        <Txt
          color={c.white}
          size={14}
          weight="bold"
          style={{
            textAlign: "center",
            textShadowColor: c.deepTeal,
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 3,
          }}
        >
          Başarılarını topla, keşif yolculuğunda ilerle!
        </Txt>
        <View style={{ alignItems: "center", marginTop: 4 }}>
          <Medal size={width < 360 ? 144 : 160} />
        </View>
      </ReferenceHero>
      <View style={{ paddingHorizontal: width < 360 ? 14 : 20 }}>
        <Card
          style={{
            marginTop: -8,
            borderColor: theme.goldBorder,
            padding: 16,
            gap: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Medal size={50} />
            <View style={{ flex: 1 }}>
              <Txt size={22} weight="heavy">
                {earned.length}/{badges.length} Rozet
              </Txt>
              <Txt size={12} color={theme.muted}>
                Daha fazla rozet kazan ve başarılarını sergile!
              </Txt>
            </View>
            <Txt weight="heavy" size={17}>
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
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Koleksiyon filtresi"
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 6,
            marginTop: 16,
          }}
        >
          {[
            ["all", "Tümü"],
            ["new", "Yeni"],
            ["rare", "Nadir"],
            ["earned", "Tamamlanan"],
          ].map(([id, title]) => (
            <View key={id} style={{ flexGrow: 1 }}>
              <Tap
                role="radio"
                label={`Koleksiyon: ${title}`}
                selected={status === id}
                onPress={() => setStatus(id as CollectionFilter)}
                style={{
                  minHeight: 46,
                  padding: 10,
                  borderRadius: 24,
                  borderWidth: 2,
                  borderColor: status === id ? c.turquoise : theme.border,
                  backgroundColor: status === id ? c.teal : theme.card,
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: shadows.card,
                }}
              >
                <Txt
                  weight="heavy"
                  size={12}
                  color={status === id ? c.white : theme.text}
                >
                  {title}
                </Txt>
              </Tap>
            </View>
          ))}
        </View>
        {status === "new" && (
          <Txt size={12} color={theme.muted} style={{ marginTop: 10 }}>
            Henüz kazanmadığın, ilerleme kaydettiğin rozetler.
          </Txt>
        )}
        {status === "rare" && (
          <Txt size={12} color={theme.muted} style={{ marginTop: 10 }}>
            Altın ve elmas ustalık rozetleri.
          </Txt>
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 18 }}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
        >
          {(
            [
              ["all", `Tümü · ${badges.length}`],
              [
                "category",
                `Konular · ${badges.filter((b) => b.group === "category").length}`,
              ],
              [
                "seasonal",
                `Özel Zamanlar · ${badges.filter((b) => b.group === "seasonal").length}`,
              ],
              [
                "general",
                `Genel · ${badges.filter((b) => b.group === "general").length}`,
              ],
              [
                "social",
                `Arkadaşlık · ${badges.filter((b) => b.group === "social").length}`,
              ],
            ] as const
          ).map(([id, label]) => (
            <Tap
              key={id}
              label={label}
              selected={group === id}
              onPress={() => {
                setGroup(id);
                setSubject("all");
              }}
              style={{
                minHeight: 46,
                padding: 12,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: group === id ? c.turquoise : theme.border,
                backgroundColor: group === id ? c.teal : theme.card,
                boxShadow: group === id ? shadows.button : shadows.card,
              }}
            >
              <Txt weight="bold" color={group === id ? c.white : theme.text}>
                {label}
              </Txt>
            </Tap>
          ))}
        </ScrollView>
        {group === "category" && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 14 }}
          >
            {[{ id: "all", title: "Bütün konular" }, ...learningTopicsV1].map(
              (t) => (
                <Tap
                  key={t.id}
                  label={t.title}
                  selected={subject === t.id}
                  onPress={() => setSubject(t.id)}
                  style={{
                    padding: 12,
                    minHeight: 44,
                    borderRadius: 16,
                    backgroundColor: subject === t.id ? c.teal : theme.card,
                    borderWidth: 1,
                    borderColor: subject === t.id ? c.turquoise : theme.border,
                  }}
                >
                  <Txt
                    size={13}
                    weight="bold"
                    color={subject === t.id ? c.white : theme.text}
                  >
                    {t.title}
                  </Txt>
                </Tap>
              ),
            )}
          </ScrollView>
        )}
        {!!notice && <Txt accessibilityLiveRegion="polite">{notice}</Txt>}
        {group === "seasonal" && (
          <Card
            style={{
              marginBottom: 16,
              backgroundColor: theme.goldSurface,
              borderColor: theme.goldBorder,
            }}
          >
            <Txt>
              Yakında · Özel zaman kategorileri henüz oynanabilir değil. Tarih,
              genel sorular veya eski turlar bu 18 rozeti açmaz.
            </Txt>
          </Card>
        )}
        {group === "social" && (
          <Card style={{ marginBottom: 16, gap: 10 }}>
            <Txt>
              Yalnız gerçek, iki tarafı tamamlanmış çevrimiçi düellolar ve kabul
              edilmiş arkadaşlıklar sayılır. Yerel demo sayılmaz.
            </Txt>
            {!social && (
              <Button
                title="Hesabıma giriş yap"
                onPress={() => router.push("/online")}
              />
            )}
            {!!error && <Txt accessibilityRole="alert">{error}</Txt>}
            <Button
              title="Sunucudan yenile"
              variant="outline"
              onPress={() => void refresh()}
            />
          </Card>
        )}
        <Txt size={13} color={theme.muted} style={{ marginBottom: 12 }}>
          {visible.length} rozet
          {group === "category" ? " · Bronz → Gümüş → Altın → Elmas" : ""}
        </Txt>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {visible.map((b) => (
            <View
              key={b.id}
              style={{
                flexBasis:
                  fontScale > 1.2 ? "100%" : width >= 600 ? "30%" : "46%",
                minWidth: 0,
                maxWidth:
                  fontScale > 1.2 ? "100%" : width >= 600 ? "32%" : "49%",
                flexGrow: 1,
              }}
            >
              <BadgeCard
                badge={b}
                showcased={(data.showcase ?? []).includes(b.id)}
                onShowcase={() => void selectShowcase(b.id)}
              />
            </View>
          ))}
        </View>
        {!visible.length && (
          <Card>
            <Txt>
              Bu filtrede henüz rozet yok. Yeni bir keşifle albümüne
              başlayabilirsin.
            </Txt>
          </Card>
        )}
        <Txt size={12} color={theme.muted} style={{ marginTop: 20 }}>
          Rozetler bilgi oyunu başarılarıdır; kişisel dindarlık veya dinî
          yetkinlik göstergesi değildir. Yeni başarı sayaçlarında aynı 10
          soruluk set bir kez sayılır.
        </Txt>
      </View>
    </ScrollView>
  );
}
