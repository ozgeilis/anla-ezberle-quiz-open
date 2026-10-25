import { useAudioObservation } from "../audio/useAudioObservation";
import { liveAudioCues } from "../audio/events";
import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Linking,
  Platform,
  Share,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  Button,
  Card,
  Dialog,
  Icon,
  Page,
  Tap,
  Txt,
  s,
} from "../../components/ui";
import { Avatar, Cup, Medal, Pattern } from "../../components/game/Artwork";
import { RoundResultBadge } from "../results/RoundResultBadge";
import { Celebration } from "../../components/game/Celebration";
import {
  colors as c,
  gradients,
  radius,
  shadows,
  useTheme,
} from "../../theme/tokens";
import { learningTopicsV1 } from "../../content/questions/learning-topics-v1";
import { difficultyName } from "../../content/questions/model";
import { gameStages } from "../../domain/game/stages";
import { badgeCatalog } from "../../domain/achievements/catalog";
import { liveClock, liveLevels, liveCounts } from "../../domain/live/rules";
import { useOnlineAuth } from "../online/OnlineProvider";
import { useInbox } from "../online/InboxProvider";
import { useAchievements } from "../achievements/AchievementProvider";
import { useLiveRoom } from "./useLiveRoom";
import { liveAnswerGradients, livePodiumGradients } from "../../theme/live";
import type { LivePlayer, LiveReview, LiveSettings } from "./types";
const levelTitle = (id: string) =>
  difficultyName[id as keyof typeof difficultyName] ??
  gameStages.find((s) => s.id === id)?.title ??
  id;
const topicTitle = (id: string) =>
  id === "mixed"
    ? "Karma"
    : (learningTopicsV1.find((t) => t.id === id)?.title ?? id);

function Jewel({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={gradients.hero}
      style={{
        padding: 22,
        borderRadius: radius.card,
        gap: 15,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: c.turquoise,
        boxShadow: shadows.card,
      }}
    >
      <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
        <Pattern color={c.gold} opacity={0.08} />
      </View>
      {children}
    </LinearGradient>
  );
}
function Review({ review }: { review: LiveReview }) {
  return (
    <Card style={{ gap: 10, backgroundColor: c.cream, borderColor: c.gold }}>
      <Txt color={c.teal} size={17} weight="heavy">
        Birlikte öğrenelim
      </Txt>
      <Txt color={c.ink} size={16}>
        {review.explanation}
      </Txt>
      {review.sources.map((source, i) => (
        <Tap
          key={i}
          label={`Kaynağı aç: ${source.title}`}
          onPress={() => {
            if (source.url.startsWith("https://"))
              void Linking.openURL(source.url);
          }}
        >
          <Txt size={12} color={c.teal}>
            {source.publisher} · {source.title} — {source.locator} ↗
          </Txt>
        </Tap>
      ))}
    </Card>
  );
}
function ReadyStatus({ ready }: { ready: boolean }) {
  const theme = useTheme();
  return (
    <View style={[s.row, { gap: 6 }]}>
      <Icon
        name={ready ? "check-circle" : "clock"}
        size={18}
        color={ready ? theme.accent : theme.goldInk}
      />
      <Txt size={12} weight="bold" color={ready ? theme.accent : theme.goldInk}>
        {ready ? "Hazır" : "Bekliyor"}
      </Txt>
    </View>
  );
}
function Podium({ players }: { players: LivePlayer[] }) {
  const sorted = [...players].sort(
    (a, b) =>
      (a.rank ?? 99) - (b.rank ?? 99) ||
      a.username.localeCompare(b.username, "tr"),
  );
  const winners = sorted.filter((p) => (p.rank ?? 99) <= 3);
  const metals = livePodiumGradients;
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 7,
        alignItems: "flex-end",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {winners.map((p) => {
        const rank = p.rank ?? 3,
          tone = metals[Math.min(rank, 3) - 1]!;
        return (
          <LinearGradient
            key={p.id}
            colors={tone}
            style={{
              flexBasis: "29%",
              flexGrow: 1,
              minWidth: 78,
              maxWidth: 220,
              minHeight: rank === 1 ? 206 : rank === 2 ? 184 : 168,
              borderRadius: 20,
              padding: 10,
              gap: 6,
              alignItems: "center",
              justifyContent: "flex-end",
              borderWidth: 1,
              borderColor: c.cream,
            }}
          >
            <Icon
              name={rank === 1 ? "award" : "star"}
              color={c.navy}
              size={rank === 1 ? 32 : 24}
            />
            <Avatar variant={p.avatar} size={50} />
            <Txt
              size={13}
              color={c.navy}
              weight="heavy"
              style={{ textAlign: "center" }}
            >
              {p.name}
            </Txt>
            <Txt size={11} color={c.navy}>
              @{p.username}
            </Txt>
            <Txt size={22} weight="heavy" color={c.navy}>
              {p.score}
            </Txt>
            <Txt weight="heavy" color={c.navy}>
              {rank}. sıra
            </Txt>
          </LinearGradient>
        );
      })}
    </View>
  );
}
export function LiveScreen() {
  const params = useLocalSearchParams<{ code?: string; room?: string }>(),
    { session } = useOnlineAuth();
  const code =
      typeof params.code === "string" ? params.code.toUpperCase() : undefined,
    room = typeof params.room === "string" ? params.room : undefined;
  return (
    <LiveController
      key={`${session?.user.id ?? "guest"}:${code ?? ""}:${room ?? ""}`}
      code={code}
      initialRoom={room}
    />
  );
}
function LiveController({
  code,
  initialRoom,
}: {
  code?: string;
  initialRoom?: string;
}) {
  const { session, ready: authReady } = useOnlineAuth(),
    inbox = useInbox(),
    { refresh: refreshAchievements } = useAchievements(),
    theme = useTheme(),
    { width } = useWindowDimensions();
  const actor = session?.user.id;
  const live = useLiveRoom(actor, inbox.ready, code, initialRoom),
    { room } = live;
  const [join, setJoin] = useState(code ?? ""),
    [notice, setNotice] = useState(""),
    [confirm, setConfirm] = useState(false),
    [showReview, setShowReview] = useState(false),
    [showSettings, setShowSettings] = useState(false),
    [goHome, setGoHome] = useState(false);
  const completed = room?.state === "completed";
  useAudioObservation(
    room
      ? {
          id: `${actor}:${room.id}`,
          position: room.position,
          phase: room.phase,
          state: room.state,
          reviewed: !!room.review,
          correct:
            room.answer && room.review
              ? room.answer.optionId === room.review.correctOptionId
              : null,
          perfect:
            room.players.find((p) => p.id === actor)?.correct ===
            room.settings.count,
        }
      : null,
    liveAudioCues,
  );
  useEffect(() => {
    if (completed) void refreshAchievements();
  }, [completed, refreshAchievements]);
  useEffect(() => {
    if (room?.question)
      AccessibilityInfo.announceForAccessibility(
        `Soru ${room.position}. ${room.question.prompt}`,
      );
  }, [room?.position, room?.question]);
  const localWeb =
    Platform.OS === "web" &&
    /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
  const invite = room
    ? Platform.OS === "web" && !localWeb
      ? `${window.location.origin}/live?code=${room.code}`
      : `anla-ezberle-quiz://live?code=${room.code}`
    : "";
  const inviteText = room
    ? `Anla & Ezberle'de birlikte yarışalım! Oda kodu: ${room.code}\n${invite}`
    : "";
  const share = async () => {
    try {
      await Share.share({ message: inviteText });
    } catch {
      setNotice("Paylaşım açılamadı. Oda kodunu kopyalayabilirsin.");
    }
  };
  const whatsapp = async () => {
    try {
      await Linking.openURL(
        `https://wa.me/?text=${encodeURIComponent(inviteText)}`,
      );
    } catch {
      setNotice("WhatsApp açılamadı. Telefonun paylaşım menüsünü kullan.");
    }
  };
  const copy = async () => {
    if (room)
      try {
        await Clipboard.setStringAsync(room.code);
        setNotice("Oda kodu kopyalandı.");
      } catch {
        setNotice("Kopyalanamadı. Oda kodunu elle paylaşabilirsin.");
      }
  };
  const host = room?.hostId === actor,
    me = room?.players.find((p) => p.id === actor),
    active =
      room && !["completed", "cancelled", "expired"].includes(room.state);
  const remaining = room?.startAt
    ? liveClock(
        Date.parse(room.startAt),
        live.now,
        room.settings.count,
        room.settings.seconds,
      )
    : null;
  const change = (next: LiveSettings) =>
    void live.run("room_settings", {
      roomId: room!.id,
      topic: next.topic,
      level: next.level,
      count: next.count,
    });
  const available = (settings: LiveSettings) =>
    live.combinations.some(
      (c) =>
        c.topic === settings.topic &&
        c.level === settings.level &&
        c.count === settings.count &&
        c.available,
    );
  return (
    <Page
      title={
        room?.state === "playing"
          ? "Canlı Yarışma"
          : room?.state === "completed"
            ? "Yarışma Sonucu"
            : "Arkadaşlarınla Oyna"
      }
      subtitle="Aynı anda, aynı sorular. Birlikte keşfet!"
      scrollResetKey={`${room?.id ?? "entry"}:${room?.state}:${room?.position}`}
    >
      <View style={{ gap: 18, paddingBottom: 24 }}>
        {!!live.error && (
          <Card
            style={{ backgroundColor: theme.goldSurface, borderColor: c.gold }}
          >
            <Txt accessibilityRole="alert" color={theme.goldInk}>
              {live.error}
            </Txt>
            {live.needsProfile && (
              <Button
                title="Profilimi Tamamla"
                icon="user"
                variant="green"
                onPress={() => router.push("/profile")}
              />
            )}
            <Button
              title="Sunucudan Yenile"
              compact
              variant="outline"
              onPress={() => void live.refresh()}
            />
          </Card>
        )}
        {!!notice && (
          <Txt accessibilityLiveRegion="polite" color={theme.accent}>
            {notice}
          </Txt>
        )}
        {!actor ? (
          <Jewel>
            <View style={s.row}>
              <Cup size={54} />
              <Txt size={27} weight="heavy" color={c.gold} style={{ flex: 1 }}>
                Bilgiyi paylaş, heyecanı yaşa!
              </Txt>
            </View>
            <Txt color={c.white}>
              2–8 arkadaşınla özel bir odada yarış. Soru süresi sunucudan
              belirlenir; her doğru cevap için 100 puan.
            </Txt>
            {code && (
              <Txt color={c.gold}>
                Davet kodun {code}. Girişten sonra korunacak.
              </Txt>
            )}
            <Button
              title={authReady ? "Hesabımla Giriş Yap" : "Oturum hazırlanıyor"}
              disabled={!authReady}
              icon="log-in"
              variant="mustard"
              onPress={() =>
                router.push({
                  pathname: "/online",
                  params: { returnTo: "live" },
                })
              }
            />
          </Jewel>
        ) : !inbox.ready ? (
          <Card>
            <Txt>
              Çevrimiçi profilin hazırlanıyor. Kullanıcı adını oluşturduktan
              sonra odalara katılabilirsin.
            </Txt>
            <Button
              title="Profilimi Aç"
              variant="outline"
              onPress={() => router.push("/profile")}
            />
          </Card>
        ) : !room ? (
          <>
            <Jewel>
              <View style={[s.row, { gap: 12 }]}>
                <Cup size={62} />
                <View style={{ flex: 1 }}>
                  <Txt size={26} color={c.white} weight="heavy">
                    Bilgi buluşması
                  </Txt>
                  <Txt color={c.gold}>Özel oda · 2–8 oyuncu</Txt>
                </View>
              </View>
              <Txt color={c.white}>
                Kategorini ve seviyeni seç. Herkes hazır olduğunda 3’ten geriye
                sayıp birlikte başlayın.
              </Txt>
              <Button
                title="Özel Oda Oluştur"
                icon="plus-circle"
                variant="mustard"
                disabled={live.busy || !live.combinations.length}
                onPress={() => void live.create()}
              />
              <Txt color={c.white} size={12}>
                Doğru 100 puan · Yanlış veya boş 0 puan. Eşit puanlar aynı
                dereceyi paylaşır.
              </Txt>
            </Jewel>
            <Card style={{ gap: 13, borderColor: theme.accent }}>
              <Txt size={22} weight="heavy">
                Davet kodun var mı?
              </Txt>
              <Txt color={theme.muted}>
                Arkadaşının paylaştığı 6 karakterli kodu yaz.
              </Txt>
              <TextInput
                accessibilityLabel="Oda kodu"
                placeholder="ABC234"
                placeholderTextColor={theme.muted}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={6}
                value={join}
                onChangeText={(v) =>
                  setJoin(v.toUpperCase().replace(/[^A-Z2-9]/g, ""))
                }
                style={{
                  fontSize: 27,
                  fontWeight: "800",
                  letterSpacing: 6,
                  textAlign: "center",
                  padding: 16,
                  color: theme.goldInk,
                  backgroundColor: theme.goldSurface,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: c.mustard,
                }}
              />
              <Button
                title="Kodla Odaya Katıl"
                icon="arrow-right"
                variant="green"
                disabled={live.busy || !/^[A-Z2-9]{6}$/.test(join)}
                onPress={() => void live.run("room_join", { code: join })}
              />
            </Card>
            {!!live.rooms.length && (
              <Card style={{ gap: 10 }}>
                <Txt size={20} weight="heavy">
                  Son odaların
                </Txt>
                {live.rooms.slice(0, 6).map((item) => (
                  <Button
                    key={item.id}
                    title={`${item.code} · ${item.state === "completed" ? "Sonuç" : item.state === "lobby" ? "Bekleme odası" : item.state === "cancelled" ? "Kapatıldı" : item.state === "expired" ? "Süresi doldu" : "Devam et"}`}
                    compact
                    variant="outline"
                    disabled={live.busy}
                    onPress={() =>
                      void live.run("room_get", { roomId: item.id })
                    }
                  />
                ))}
              </Card>
            )}
          </>
        ) : (
          <>
            {room.state === "lobby" ? (
              <>
                <Jewel>
                  <View
                    style={[
                      s.row,
                      {
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 10,
                      },
                    ]}
                  >
                    <Txt color={c.white} weight="heavy" size={21}>
                      Senin bilgi odan
                    </Txt>
                    <Txt color={c.tealLight} size={12}>
                      {live.connection}
                    </Txt>
                  </View>
                  <Txt
                    accessibilityLabel={`Oda kodu ${room.code.split("").join(" ")}`}
                    size={width < 360 ? 34 : 44}
                    weight="heavy"
                    color={c.gold}
                    style={{ textAlign: "center", letterSpacing: 5 }}
                  >
                    {room.code}
                  </Txt>
                  <Txt color={c.white} style={{ textAlign: "center" }}>
                    Kodu paylaş, arkadaşların katılsın.
                  </Txt>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}
                  >
                    <Button
                      compact
                      fill
                      style={{ flex: 1 }}
                      title="Kopyala"
                      icon="copy"
                      variant="mustard"
                      onPress={() => void copy()}
                    />
                    <Button
                      compact
                      fill
                      style={{ flex: 1 }}
                      title="Paylaş"
                      icon="share-2"
                      variant="blue"
                      onPress={() => void share()}
                    />
                  </View>
                  <Button
                    compact
                    title="WhatsApp ile Davet Et"
                    icon="message-circle"
                    variant="green"
                    onPress={() => void whatsapp()}
                  />
                  <Txt color={c.white} size={11}>
                    {localWeb
                      ? "Bu yerel önizleme adresi diğer telefonlarda açılmaz. Oda kodunu paylaş veya kurulu uygulama bağlantısını kullan."
                      : "Kullanılmayan oda 30 dakika içinde kapanır. Bağlantı, uygulama yüklüyse veya yayınlanan web adresinde açılır."}
                  </Txt>
                </Jewel>
                <Card style={{ gap: 12 }}>
                  <Txt size={22} weight="heavy">
                    Bekleme odası
                  </Txt>
                  {room.players.map((p) => (
                    <View
                      key={p.id}
                      style={[
                        s.row,
                        {
                          gap: 12,
                          padding: 12,
                          borderRadius: 18,
                          backgroundColor: p.ready
                            ? theme.mintSurface
                            : theme.goldSurface,
                          borderWidth: 1,
                          borderColor: p.ready ? c.turquoise : c.mustard,
                        },
                      ]}
                    >
                      <Avatar variant={p.avatar} size={48} />
                      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                        <Txt weight="heavy" size={16}>
                          {p.name}
                        </Txt>
                        <Txt size={12} color={theme.muted}>
                          @{p.username}
                        </Txt>
                        {p.id === room.hostId && (
                          <Txt size={11} weight="bold" color={theme.goldInk}>
                            Oda sahibi
                          </Txt>
                        )}
                        {width < 360 && <ReadyStatus ready={p.ready} />}
                      </View>
                      {width >= 360 && <ReadyStatus ready={p.ready} />}
                    </View>
                  ))}
                  <Button
                    title={me?.ready ? "Hazır Değilim" : "Hazırım"}
                    icon="check-circle"
                    variant={me?.ready ? "outline" : "green"}
                    disabled={live.busy}
                    onPress={() =>
                      void live.run("room_ready", {
                        roomId: room.id,
                        ready: !me?.ready,
                      })
                    }
                  />
                  {host && (
                    <Button
                      title="Yarışmayı Başlat"
                      icon="play"
                      variant="mustard"
                      disabled={
                        live.busy ||
                        room.players.length < 2 ||
                        !room.players.every((p) => p.ready)
                      }
                      onPress={() =>
                        void live.run("room_start", { roomId: room.id })
                      }
                    />
                  )}
                  <Txt color={theme.muted} size={12}>
                    {room.players.length < 2
                      ? "Başlamak için en az iki oyuncu gerekli."
                      : !room.players.every((p) => p.ready)
                        ? "Herkes hazır olduğunda oda sahibi başlatabilir."
                        : "Herkes hazır! Oda sahibi yarışmayı başlatabilir."}
                  </Txt>
                </Card>
                <Card style={{ gap: 15 }}>
                  <Txt size={21} weight="heavy">
                    {host ? "Yarışmayı hazırla" : "Oda ayarları"}
                  </Txt>
                  <Txt color={theme.muted}>
                    {room.settings.seconds} saniye / soru ·{" "}
                    {room.players.length} / 8 oyuncu
                  </Txt>
                  {host && (
                    <Button
                      title={
                        showSettings ? "Ayarları Gizle" : "Ayarları Düzenle"
                      }
                      compact
                      variant="outline"
                      onPress={() => setShowSettings(!showSettings)}
                    />
                  )}
                  {host && showSettings ? (
                    <>
                      <Txt weight="bold">Kategori</Txt>
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        {[
                          { id: "mixed", title: "Karma" },
                          ...learningTopicsV1,
                        ].map((t) => {
                          const selected = room.settings.topic === t.id,
                            enabled = available({
                              ...room.settings,
                              topic: t.id,
                            });
                          return (
                            <Tap
                              key={t.id}
                              role="radio"
                              selected={selected}
                              label={`Canlı kategori: ${t.title}${!enabled ? " · Bu ayarlarda yeterli bağımsız soru yok" : ""}`}
                              disabled={live.busy || !enabled}
                              onPress={() =>
                                change({ ...room.settings, topic: t.id })
                              }
                              style={{
                                padding: 12,
                                borderRadius: 16,
                                borderWidth: selected ? 2 : 1,
                                borderColor: selected
                                  ? c.mustard
                                  : theme.border,
                                backgroundColor: selected
                                  ? theme.goldSurface
                                  : theme.mintSurface,
                              }}
                            >
                              <Txt
                                weight={selected ? "heavy" : "bold"}
                                color={selected ? theme.goldInk : theme.text}
                              >
                                {t.title}
                              </Txt>
                            </Tap>
                          );
                        })}
                      </View>
                      <Txt weight="bold">Seviye</Txt>
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        {liveLevels.map((level) => {
                          const selected = room.settings.level === level,
                            enabled = available({ ...room.settings, level });
                          return (
                            <Tap
                              key={level}
                              role="radio"
                              selected={selected}
                              label={`Canlı seviye: ${levelTitle(level)}${!enabled ? " · Yeterli bağımsız soru yok" : ""}`}
                              disabled={live.busy || !enabled}
                              onPress={() =>
                                change({ ...room.settings, level })
                              }
                              style={{
                                padding: 12,
                                borderRadius: 16,
                                borderWidth: 2,
                                borderColor: selected
                                  ? c.mustard
                                  : theme.border,
                                backgroundColor: selected
                                  ? theme.goldSurface
                                  : theme.panel,
                              }}
                            >
                              <Txt
                                color={selected ? theme.goldInk : theme.text}
                                weight="bold"
                              >
                                {levelTitle(level)}
                              </Txt>
                            </Tap>
                          );
                        })}
                      </View>
                      <Txt weight="bold">Kaç soru?</Txt>
                      <View style={[s.row, { gap: 10 }]}>
                        {liveCounts.map((count) => (
                          <Button
                            key={count}
                            title={`${count} soru`}
                            compact
                            variant={
                              room.settings.count === count
                                ? "mustard"
                                : "outline"
                            }
                            style={{ flex: 1 }}
                            disabled={
                              live.busy ||
                              !available({ ...room.settings, count })
                            }
                            onPress={() => change({ ...room.settings, count })}
                          />
                        ))}
                      </View>
                      <Txt size={12} color={theme.muted}>
                        Yalnız yeterli bağımsız sorusu olan birleşimler
                        seçilebilir. Ayarlar değişince herkes yeniden hazır
                        olur.
                      </Txt>
                    </>
                  ) : (
                    <Txt size={20} weight="heavy" color={theme.accent}>
                      {topicTitle(room.settings.topic)} ·{" "}
                      {levelTitle(room.settings.level)} · {room.settings.count}{" "}
                      soru
                    </Txt>
                  )}
                </Card>
              </>
            ) : room.state === "countdown" ? (
              <Jewel>
                <Txt color={c.white} size={26} weight="heavy">
                  Herkes hazır!
                </Txt>
                <View style={{ alignItems: "center" }}>
                  <Medal size={150} />
                  <Txt
                    color={c.gold}
                    size={76}
                    weight="heavy"
                    accessibilityLiveRegion="polite"
                  >
                    {remaining?.phase === "countdown"
                      ? remaining.seconds
                      : "Başlıyoruz"}
                  </Txt>
                </View>
                <Txt color={c.white} style={{ textAlign: "center" }}>
                  Aynı sorular, aynı sıra, aynı heyecan.
                </Txt>
              </Jewel>
            ) : room.state === "playing" && room.question ? (
              <>
                <Jewel>
                  <View
                    style={[
                      s.row,
                      { justifyContent: "space-between", gap: 12 },
                    ]}
                  >
                    <Txt color={c.white} weight="heavy" size={19}>
                      Soru {room.position} / {room.settings.count}
                    </Txt>
                    <View
                      style={[
                        s.row,
                        {
                          gap: 6,
                          backgroundColor: "rgba(0,20,40,.3)",
                          padding: 10,
                          borderRadius: 20,
                        },
                      ]}
                    >
                      <Icon name="clock" color={c.gold} />
                      <Txt size={26} weight="heavy" color={c.gold}>
                        {room.phase === "answer"
                          ? Math.max(
                              0,
                              Math.ceil(
                                (Date.parse(room.deadline!) - live.now) / 1000,
                              ),
                            )
                          : Math.max(
                              0,
                              Math.ceil(
                                (Date.parse(room.nextAt!) - live.now) / 1000,
                              ),
                            )}
                      </Txt>
                    </View>
                  </View>
                  <Txt color={c.tealLight} size={12}>
                    {live.connection} ·{" "}
                    {room.players.filter((p) => p.answered).length} /{" "}
                    {room.players.length} yanıtladı
                  </Txt>
                </Jewel>
                <Card
                  style={{
                    backgroundColor: c.cream,
                    borderColor: c.gold,
                    gap: 14,
                    padding: 22,
                  }}
                >
                  <Txt
                    accessibilityRole="header"
                    color={c.ink}
                    size={19}
                    weight="heavy"
                    style={{ textAlign: "center" }}
                  >
                    {room.question.prompt}
                  </Txt>
                </Card>
                <View style={{ gap: 12 }}>
                  {room.question.options.map((option, i) => {
                    const chosen =
                        (room.answer?.optionId ?? live.pending?.optionId) ===
                        option.id,
                      correct = room.review?.correctOptionId === option.id,
                      wrong = !!room.review && chosen && !correct;
                    return (
                      <Tap
                        key={`${room.position}:${option.id}`}
                        label={`${String.fromCharCode(65 + i)}: ${option.text}${chosen ? " · Seçimin" : ""}${correct ? " · Doğru cevap" : ""}`}
                        disabled={
                          live.busy ||
                          !!room.answer ||
                          !!live.pending ||
                          room.phase !== "answer" ||
                          live.stale ||
                          live.now >= Date.parse(room.deadline!)
                        }
                        selected={chosen}
                        onPress={() => void live.send(option.id)}
                        style={{
                          borderRadius: 20,
                          overflow: "hidden",
                          borderWidth: chosen || correct ? 3 : 1,
                          borderColor: correct
                            ? c.tealLight
                            : wrong
                              ? c.coral
                              : chosen
                                ? c.gold
                                : "rgba(255,255,255,.5)",
                          opacity: 1,
                          boxShadow: shadows.card,
                        }}
                      >
                        <LinearGradient
                          colors={
                            correct ? gradients.green : liveAnswerGradients[i]!
                          }
                          style={{
                            padding: 10,
                            minHeight: 48,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 13,
                          }}
                        >
                          <View
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 17,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(0,15,35,.24)",
                            }}
                          >
                            <Txt color={c.white} size={14} weight="heavy">
                              {String.fromCharCode(65 + i)}
                            </Txt>
                          </View>
                          <Txt
                            color={c.white}
                            weight="bold"
                            size={15}
                            style={{ flex: 1 }}
                          >
                            {option.text}
                          </Txt>
                          {(correct || chosen) && (
                            <Icon
                              name={
                                correct
                                  ? "check-circle"
                                  : wrong
                                    ? "x-circle"
                                    : "lock"
                              }
                              color={c.white}
                            />
                          )}
                        </LinearGradient>
                      </Tap>
                    );
                  })}
                </View>
                <Txt
                  accessibilityLiveRegion="polite"
                  weight="bold"
                  color={theme.accent}
                >
                  {room.review
                    ? room.answer
                      ? room.answer.optionId === room.review.correctOptionId
                        ? "Doğru cevap! +100 puan."
                        : "Bu kez olmadı. Açıklamayla pekiştirelim."
                      : "Bu soru cevapsız kaldı. Birlikte öğrenelim."
                    : room.answer
                      ? "Yanıtın kilitli. Doğru cevap süre bitince açılacak."
                      : live.pending
                        ? "Yanıtın doğrulanıyor. Bağlantı gelince aynı isteği yeniden gönderebilirsin."
                        : live.stale
                          ? "Bağlantı yenileniyor; süre sunucuda devam ediyor."
                          : live.now >= Date.parse(room.deadline!)
                            ? "Süre doldu. Sunucu sonucu bekleniyor."
                            : "Bir cevap seç. Sonradan değiştirilemez."}
                </Txt>
                {!!live.pending && !room.answer && (
                  <Button
                    title="Aynı Yanıtı Yeniden Gönder"
                    disabled={
                      live.busy || live.now >= Date.parse(room.deadline!)
                    }
                    variant="outline"
                    onPress={() => void live.send()}
                  />
                )}
                {room.review && <Review review={room.review} />}
              </>
            ) : completed ? (
              <>
                <Celebration
                  enabled={
                    typeof me?.correct === "number" &&
                    me.correct / room.settings.count >= 0.8
                  }
                />
                <Jewel>
                  <View style={{ alignItems: "center" }}>
                    {typeof me?.correct === "number" && (
                      <RoundResultBadge
                        key={room.id}
                        correct={me.correct}
                        total={room.settings.count}
                      />
                    )}
                    <Txt color={c.gold} size={17} weight="heavy">
                      {me?.won
                        ? "Harika bir zafer!"
                        : me?.rank === 1
                          ? "Birinciliği paylaştınız!"
                          : "Birlikte öğrendiniz!"}
                    </Txt>
                    <Txt color={c.white} style={{ textAlign: "center" }}>
                      Her soru yeni bir şey öğrenmek için fırsat.
                    </Txt>
                  </View>
                  <Podium players={room.players} />
                </Jewel>
                <Card
                  style={{
                    gap: 13,
                    borderColor: c.gold,
                    backgroundColor: theme.goldSurface,
                  }}
                >
                  <Txt size={23} weight="heavy">
                    Senin turun
                  </Txt>
                  <Txt size={32} weight="heavy" color={theme.goldInk}>
                    {me?.score ?? 0} / {room.settings.count * 100} puan
                  </Txt>
                  <Txt>
                    {me?.correct ?? 0} doğru · {me?.wrong ?? 0} yanlış ·{" "}
                    {me?.unanswered ?? 0} boş
                  </Txt>
                  <Txt color={theme.accent} weight="heavy">
                    +{room.reward?.xp ?? 0} XP
                    {room.reward?.bonus
                      ? ` · ${room.reward.bonus} XP zafer bonusu`
                      : ""}
                  </Txt>
                  {room.reward && !room.reward.credited && (
                    <Txt size={12}>
                      Bu soru seti için daha önce ödül aldın veya günlük ödül
                      sınırına ulaştın. Skorun korunur, ek XP verilmez.
                    </Txt>
                  )}
                  <Txt size={12} color={theme.muted}>
                    Ödülün çevrimiçi profiline kaydedildi.
                  </Txt>
                  {room.reward?.newBadges.map((id) => (
                    <Txt key={id} weight="bold" color={theme.goldInk}>
                      ★ {badgeCatalog.find((b) => b.id === id)?.title ?? id}
                    </Txt>
                  ))}
                </Card>
                <Card style={{ gap: 13 }}>
                  <Txt size={22} weight="heavy">
                    Sonuç tablosu
                  </Txt>
                  {[...room.players]
                    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
                    .map((p) => (
                      <View
                        key={p.id}
                        style={[
                          s.row,
                          {
                            gap: 12,
                            padding: 10,
                            backgroundColor:
                              p.id === actor ? theme.mintSurface : theme.panel,
                            borderRadius: 16,
                          },
                        ]}
                      >
                        <Txt size={22} color={theme.goldInk} weight="heavy">
                          {p.rank}.
                        </Txt>
                        <Avatar variant={p.avatar} size={42} />
                        <View style={{ flex: 1 }}>
                          <Txt weight="bold">{p.name}</Txt>
                          <Txt size={12} color={theme.muted}>
                            @{p.username} · {p.correct} doğru / {p.wrong} yanlış
                            / {p.unanswered} boş
                          </Txt>
                        </View>
                        <Txt weight="heavy" size={20}>
                          {p.score}
                        </Txt>
                      </View>
                    ))}
                </Card>
                <Button
                  title="Tekrar Oyna · Yeni Oda"
                  icon="refresh-cw"
                  variant="green"
                  disabled={live.busy}
                  onPress={() => {
                    setShowReview(false);
                    void live.create();
                  }}
                />
                <Button
                  title={showReview ? "İncelemeyi Kapat" : "Cevaplarımı İncele"}
                  icon="book-open"
                  variant="outline"
                  onPress={() => setShowReview(!showReview)}
                />
                {showReview &&
                  room.history.map((h) => (
                    <Card key={h.position} style={{ gap: 12 }}>
                      <Txt weight="heavy" size={18}>
                        {h.position}. {h.question.prompt}
                      </Txt>
                      <Txt color={theme.muted}>
                        Seçimin:{" "}
                        {h.question.options.find((o) => o.id === h.optionId)
                          ?.text ?? "Cevapsız"}{" "}
                        · Doğru cevap:{" "}
                        {
                          h.question.options.find(
                            (o) => o.id === h.correctOptionId,
                          )?.text
                        }
                      </Txt>
                      <Review review={h} />
                    </Card>
                  ))}
              </>
            ) : (
              <Jewel>
                <Icon name="lock" color={c.gold} size={44} />
                <Txt color={c.white} size={26} weight="heavy">
                  {room.state === "expired"
                    ? "Odanın süresi doldu"
                    : "Oda kapatıldı"}
                </Txt>
                <Txt color={c.white}>
                  Bu oda için yarışma ödülü verilmedi. Yeni bir odada tekrar
                  buluşabilirsiniz.
                </Txt>
                <Button
                  title="Yeni Oda Oluştur"
                  icon="plus"
                  variant="mustard"
                  disabled={live.busy}
                  onPress={() => void live.create()}
                />
              </Jewel>
            )}
            {active && (
              <Button
                title="Odadan Ayrıl"
                icon="log-out"
                variant="outline"
                disabled={live.busy}
                onPress={() => {
                  setGoHome(false);
                  setConfirm(true);
                }}
              />
            )}
          </>
        )}
        <Button
          title="Ana Sayfaya Dön"
          icon="home"
          variant="outline"
          onPress={() => {
            if (active) {
              setGoHome(true);
              setConfirm(true);
            } else router.push("/");
          }}
        />
      </View>
      <Dialog
        visible={confirm}
        title="Odadan ayrılmak istiyor musun?"
        onClose={() => setConfirm(false)}
      >
        <View style={{ gap: 14 }}>
          <Txt>
            {host
              ? "Oda sahibi olarak ayrılırsan oda herkes için kapanır. Bu oda için ödül verilmez."
              : "Turun süresi devam eder. Cevaplamadığın sorular 0 puandır. Kodla yeniden bağlanabilirsin."}
          </Txt>
          <Button
            title="Odadan Ayrıl"
            variant="green"
            onPress={() => {
              setConfirm(false);
              void live.leave().then((left) => {
                if (left && goHome) router.push("/");
              });
            }}
          />
          <Button
            title="Vazgeç"
            variant="outline"
            onPress={() => setConfirm(false)}
          />
        </View>
      </Dialog>
    </Page>
  );
}
