import React, { useState } from "react";
import { View, Switch, useWindowDimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Scene, Pattern, Medal } from "../../components/game/Artwork";
import {
  Button,
  Card,
  Dialog,
  Icon,
  Page,
  Tap,
  Txt,
} from "../../components/ui";
import { SettingsButton } from "../../components/ui/SettingsButton";
import { colors as c, gradients, shadows, useTheme } from "../../theme/tokens";
import { PublicAchievements } from "../achievements/PublicAchievements";
import { onlineConfigured } from "../online/client";
import { useOnlineAuth } from "../online/OnlineProvider";
import type { LeaderboardEntry, SocialPlayer } from "../online/types";
import { PersonalRecords } from "./PersonalRecords";
import { useLeaderboard } from "./useLeaderboard";
const sections = [
  ["global", "Genel"],
  ["friends", "Arkadaşlarım"],
  ["personal", "Kişisel Rekorlarım"],
] as const;
export function RankingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ section?: string }>(),
    theme = useTheme();
  const section =
    params.section === "personal"
      ? "personal"
      : params.section === "friends"
        ? "friends"
        : "global";
  const auth = useOnlineAuth();
  return (
    <Page
      title="Sıralama"
      right={<SettingsButton />}
      subtitle="Bilginle yüksel, arkadaşlarınla yarış!"
    >
      <LinearGradient
        colors={gradients.hero}
        style={{
          borderRadius: 18,
          padding: 12,
          overflow: "hidden",
          minHeight: 96,
          borderWidth: 1,
          borderColor: c.gold,
          marginBottom: 18,
        }}
      >
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ position: "absolute", inset: 0, opacity: 0.35 }}
        >
          <Scene />
          <Pattern opacity={0.15} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ flex: 1, gap: 8 }}>
            <Txt color={c.gold} size={12} weight="heavy">
              BİLGİNİN YILDIZLARI
            </Txt>
            <Txt color={c.white} size={18} weight="heavy">
              Her turda biraz daha ileri.
            </Txt>
            <Txt color={c.white} size={12}>
              Gerçek sonuçlar · İsteğe bağlı katılım
            </Txt>
          </View>
          <Medal size={48} />
        </View>
      </LinearGradient>
      <View
        accessibilityRole="tablist"
        style={{ flexDirection: "row", gap: 6, marginBottom: 18 }}
      >
        {sections.map(([key, title]) => (
          <Tap
            key={key}
            role="tab"
            label={title}
            selected={section === key}
            onPress={() => router.setParams({ section: key })}
            style={{
              flex: 1,
              minHeight: 48,
              paddingHorizontal: 5,
              paddingVertical: 9,
              borderRadius: 17,
              borderWidth: section === key ? 2 : 1,
              borderColor: section === key ? c.gold : theme.border,
              backgroundColor: section === key ? theme.mintSurface : theme.card,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Txt
              size={12}
              weight="heavy"
              color={section === key ? theme.accent : theme.text}
              style={{ textAlign: "center" }}
            >
              {title}
            </Txt>
          </Tap>
        ))}
      </View>
      {section === "personal" ? (
        <>
          <Txt size={13} color={theme.muted}>
            Bu cihazdaki ilerlemen. İnternet olmadan da burada; çevrimiçi
            sıralamaya aktarılmaz.
          </Txt>
          <PersonalRecords />
        </>
      ) : !onlineConfigured ? (
        <Gate
          title="Çevrimiçi servis yapılandırılmamış"
          text="Kişisel rekorların internet olmadan da kullanılabilir."
        />
      ) : !auth.ready ? (
        <Gate
          title="Hesabın kontrol ediliyor"
          text="Güvenli oturumun okunuyor…"
        />
      ) : !auth.session ? (
        <Gate
          title={
            auth.needsVerification ? "E-postanı doğrula" : "Hesabına giriş yap"
          }
          text={
            auth.needsVerification
              ? "Sıralamayı görmek için e-posta doğrulamanı tamamla."
              : "Çevrimiçi sıralamayı görmek için hesabına giriş yap."
          }
          action
        />
      ) : (
        <OnlineRanking
          key={`${auth.session.user.id}:${section}`}
          actor={auth.session.user.id}
          scope={section}
        />
      )}
    </Page>
  );
}
function Gate({
  title,
  text,
  action = false,
}: {
  title: string;
  text: string;
  action?: boolean;
}) {
  const router = useRouter();
  const t = useTheme();
  return (
    <Card style={{ gap: 14, alignItems: "center", padding: 24 }}>
      <Icon name="shield" size={32} color={t.accent} />
      <Txt size={21} weight="heavy" style={{ textAlign: "center" }}>
        {title}
      </Txt>
      <Txt color={t.muted} style={{ textAlign: "center" }}>
        {text}
      </Txt>
      {action && (
        <>
          <Button
            title="Giriş Yap"
            icon="log-in"
            onPress={() => router.push("/online")}
          />
          <Button
            title="E-postamı Doğrula"
            variant="outline"
            onPress={() => router.push("/online/verify-email")}
          />
        </>
      )}
    </Card>
  );
}
function OnlineRanking({
  actor,
  scope,
}: {
  actor: string;
  scope: "global" | "friends";
}) {
  const router = useRouter();
  const { value, status, error, load, preference, busy } = useLeaderboard(
      actor,
      scope,
    ),
    t = useTheme();
  const [player, setPlayer] = useState<SocialPlayer | null>(null);
  return (
    <View style={{ gap: 14 }}>
      <Txt size={12} color={t.muted}>
        Doğrulanmış düello XP’si ve canlı oda XP’si sayılır. Yerel antrenmanlar
        dahil değildir. Eşitlikte tamamlanan maç sayısı, sonra sabit oyuncu
        kimliği kullanılır.
      </Txt>
      {value && (
        <Podium
          entries={value.entries.filter((e) => e.rank <= 3)}
          onPlayer={setPlayer}
        />
      )}
      {value && (
        <Card style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Txt weight="heavy">Sıralamaya katılımım</Txt>
              <Txt size={12} color={t.muted}>
                {value.self.optIn
                  ? "Katılım açık"
                  : "Katılım kapalı · Kişisel rekorların korunur"}
              </Txt>
            </View>
            <Switch
              accessibilityLabel="Sıralamaya katıl"
              disabled={busy}
              value={value.self.optIn}
              onValueChange={(v) => void preference(v)}
            />
          </View>
          <Txt size={12} color={t.muted}>
            İzin verdiğinde kabul edilmiş arkadaşların seni sıralamada
            görebilir. Genel listede görünmek için oyuncu aramasında bulunma da
            açık olmalı.
          </Txt>
          {(!value.self.username || !value.self.discoverable) && (
            <Button
              title="Kullanıcı Adı ve Gizlilik"
              variant="outline"
              onPress={() => router.push("/settings")}
            />
          )}
        </Card>
      )}
      {busy && (
        <Txt accessibilityLiveRegion="polite" color={t.muted}>
          {status === "saving"
            ? "Katılım tercihin kaydediliyor…"
            : status === "more"
              ? "Sonraki oyuncular yükleniyor…"
              : value
                ? "Sıralama yenileniyor…"
                : "Sıralama yükleniyor…"}
        </Txt>
      )}
      {!!error && (
        <Card style={{ gap: 12, borderColor: t.danger }}>
          <Txt accessibilityRole="alert" color={t.danger}>
            {error}
          </Txt>
          {value && (
            <Txt size={12} color={t.muted}>
              Aşağıdaki sonuçlar son doğrulanmış listedir. Güncel sıralama için
              yeniden dene.
            </Txt>
          )}
          <Button
            title="Yeniden Dene"
            icon="refresh-cw"
            disabled={busy}
            onPress={() => void load()}
          />
        </Card>
      )}
      {value && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <Txt size={12} color={t.muted} style={{ flex: 1 }}>
              Güncelleme:{" "}
              {new Date(value.asOf).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Txt>
            <Tap
              label="Sıralamayı yenile"
              disabled={busy}
              onPress={() => void load()}
              style={{
                minHeight: 44,
                padding: 10,
                flexDirection: "row",
                gap: 6,
                alignItems: "center",
              }}
            >
              <Icon name="refresh-cw" size={16} color={t.accent} />
              <Txt color={t.accent} size={12} weight="bold">
                Yenile
              </Txt>
            </Tap>
          </View>
          {scope === "global" &&
            value.self.entry &&
            !value.entries.some((e) => e.player.id === actor) && (
              <Card style={{ backgroundColor: t.mintSurface, gap: 5 }}>
                <Txt weight="heavy" color={t.accent}>
                  Senin Sıran · {value.self.entry.rank}
                </Txt>
                <Txt>
                  {value.self.xp} doğrulanmış XP · {value.self.games} maç
                </Txt>
              </Card>
            )}
          {!value.self.optIn && (
            <Txt size={12} color={t.muted}>
              Katılımın kapalı. Listeleri inceleyebilir, kişisel rekorlarını
              görmeye devam edebilirsin.
            </Txt>
          )}
          {value.entries.length === 0 && !busy && !error && (
            <Card style={{ gap: 14, alignItems: "center", padding: 24 }}>
              <Icon
                name={scope === "friends" ? "users" : "award"}
                size={36}
                color={t.goldInk}
              />
              <Txt weight="heavy" size={16} style={{ textAlign: "center" }}>
                {scope === "friends"
                  ? "Henüz sıralamada arkadaşın yok."
                  : "İlk sıralama sonuçları bekleniyor."}
              </Txt>
              <Txt color={t.muted} style={{ textAlign: "center" }}>
                {scope === "friends"
                  ? "Arkadaş ekleyerek birlikte yarışabilirsin. Yalnız katılım izni veren ve doğrulanmış sonuçları olan kabul edilmiş arkadaşların listelenir."
                  : "Katılım izni veren oyuncular çevrimiçi yarışma tamamladığında gerçek sonuçları burada görünür."}
              </Txt>
              {scope === "friends" && (
                <Button
                  title="Arkadaş Bul"
                  icon="user-plus"
                  onPress={() => router.push("/online/players")}
                />
              )}
            </Card>
          )}
          {value.entries
            .filter((e) => e.rank > 3)
            .map((e) => (
              <RankRow
                key={e.player.id}
                entry={e}
                own={e.player.id === actor}
                onPress={() => setPlayer(e.player)}
              />
            ))}
          {!!value.nextCursor && (
            <Button
              title={status === "more" ? "Yükleniyor…" : "Daha Fazla"}
              icon="chevron-down"
              variant="outline"
              disabled={busy}
              onPress={() => void load(value.nextCursor)}
            />
          )}
        </>
      )}
      {!!player && (
        <Dialog visible title="Oyuncu Profili" onClose={() => setPlayer(null)}>
          <View style={{ alignItems: "center", gap: 12 }}>
            <Avatar variant={player.avatar} size={64} />
            <Txt size={23} weight="heavy">
              {player.name}
            </Txt>
            <Txt color={t.accent}>@{player.username}</Txt>
            <Txt>
              Seviye {player.level} · {player.xp} doğrulanmış XP
            </Txt>
            <PublicAchievements player={player} />
          </View>
        </Dialog>
      )}
    </View>
  );
}
function Podium({
  entries,
  onPlayer,
}: {
  entries: LeaderboardEntry[];
  onPlayer: (p: SocialPlayer) => void;
}) {
  const t = useTheme(),
    { width } = useWindowDimensions();
  if (!entries.length) return null;
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        alignItems: "flex-end",
        marginVertical: 8,
      }}
    >
      {[...entries]
        .sort((a, b) =>
          entries.length === 3
            ? [2, 1, 3].indexOf(a.rank) - [2, 1, 3].indexOf(b.rank)
            : a.rank - b.rank,
        )
        .map((e) => {
          const paint =
            e.rank === 1
              ? (["#FFE79C", "#F7B72E"] as const)
              : e.rank === 2
                ? (["#F0FAFF", "#A9CDE5"] as const)
                : (["#FFD6AA", "#DF8D4D"] as const);
          return (
            <Tap
              fill
              key={e.player.id}
              label={`${e.rank}. ${e.player.name}, @${e.player.username}, ${e.player.xp} XP, profilini aç`}
              onPress={() => onPlayer(e.player)}
              style={{
                flex: 1,
                minWidth: 0,
                borderRadius: 18,
                borderWidth: 2,
                borderColor: paint[1],
                overflow: "hidden",
                backgroundColor: t.card,
                boxShadow: shadows.card,
              }}
            >
              <LinearGradient
                colors={paint}
                style={{
                  alignItems: "center",
                  paddingVertical: e.rank === 1 ? 12 : 8,
                  paddingHorizontal: 6,
                  gap: 10,
                }}
              >
                <Icon name="award" color="#613500" size={20} />
                <Txt weight="heavy" size={16} color="#173B46">
                  {e.rank}.
                </Txt>
                <Avatar variant={e.player.avatar} size={36} />
              </LinearGradient>
              <View style={{ padding: 9, gap: 4, alignItems: "center" }}>
                <Txt
                  size={width < 360 ? 12 : 14}
                  weight="heavy"
                  numberOfLines={2}
                  style={{ textAlign: "center" }}
                >
                  {e.player.name}
                </Txt>
                <Txt size={10} color={t.muted} numberOfLines={1}>
                  @{e.player.username}
                </Txt>
                <Txt size={14} weight="semibold" color={t.accent}>
                  {e.player.xp} XP
                </Txt>
                <Txt size={10} color={t.muted}>
                  Seviye {e.player.level} · {e.games} maç
                </Txt>
              </View>
            </Tap>
          );
        })}
    </View>
  );
}
function RankRow({
  entry: e,
  own,
  onPress,
}: {
  entry: LeaderboardEntry;
  own: boolean;
  onPress: () => void;
}) {
  const t = useTheme();
  return (
    <Tap
      label={`${e.rank}. ${e.player.name}, @${e.player.username}, ${e.player.xp} XP, profilini aç`}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 12,
        minHeight: 64,
        borderRadius: 16,
        borderWidth: own ? 2 : 1,
        borderColor: own ? c.gold : t.border,
        backgroundColor: own ? t.mintSurface : t.card,
      }}
    >
      <Txt weight="heavy" size={16} style={{ minWidth: 26 }}>
        {e.rank}
      </Txt>
      <Avatar variant={e.player.avatar} size={36} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt weight="heavy" numberOfLines={1}>
          {e.player.name}
        </Txt>
        <Txt size={11} color={t.muted} numberOfLines={1}>
          @{e.player.username} · Seviye {e.player.level}
        </Txt>
      </View>
      <Txt size={14} weight="heavy" color={t.accent}>
        {e.player.xp} XP
      </Txt>
    </Tap>
  );
}
