import { RoundResultBadge } from "../results/RoundResultBadge";
import { useAudioObservation } from "../audio/useAudioObservation";
import { duelAudioCues } from "../audio/events";
import { Feedback, FeedbackDialog } from "../../components/ui/FeedbackDialog";
import { passwordError, validEmail } from "./account";
import { useInbox } from "./InboxProvider";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Share, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { randomUUID } from "expo-crypto";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar, Pattern } from "../../components/game/Artwork";
import {
  Button,
  Card,
  Chip,
  Dialog,
  IconButton,
  Page,
  Tap,
  Txt,
  s,
} from "../../components/ui";
import { colors as c, gradients, radius, useTheme } from "../../theme/tokens";
import {
  OnlineError,
  onlineConfigured,
  onlineMessage,
  onlineRequest,
} from "./client";
import { useOnlineAuth } from "./OnlineProvider";
import { OnlineMatch, OnlineSelf, PendingAnswer } from "./types";

const contentScopeLabel: Record<OnlineMatch["scope"], string> = {
  synthetic_test: "Geliştirme soru havuzu",
  owner_approved_v13: "Sunucuda doğrulanan yarışma",
  "bank-v72": "Sunucuda doğrulanan yarışma",
  "bank-v73": "Sunucuda doğrulanan yarışma",
};

const pendingKey = (actor: string, match: string) =>
  `@anla-quiz-online/pending/v1/${actor}/${match}`;
function parseInvite(value: string) {
  const raw = value.trim();
  if (/^[0-9a-f]{64}$/.test(raw)) return raw;
  try {
    const token = new URL(raw).searchParams.get("invite");
    return token && /^[0-9a-f]{64}$/.test(token) ? token : null;
  } catch {
    return null;
  }
}
const stateLabel: Record<OnlineMatch["state"], string> = {
  created: "Hazır",
  waiting_for_opponent: "Davet hazır",
  in_progress: "Tur oynanıyor",
  waiting_for_result: "Rakip bekleniyor",
  completed: "Tamamlandı",
  expired: "Süresi doldu",
  cancelled: "İptal edildi",
};

export function OnlineScreen() {
  const { session } = useOnlineAuth();
  const { returnTo, invite, match } = useLocalSearchParams<{
    returnTo?: string;
    invite?: string;
    match?: string;
  }>();
  // Fixed internal return targets only; never redirect to an arbitrary URL.
  if (session && returnTo === "account-delete" && !invite && !match)
    return <Redirect href="/account-delete" />;
  // Legacy asynchronous invitations keep priority.
  if (session && returnTo === "live" && !invite && !match)
    return <Redirect href="/live" />;
  return <OnlineAccountScreen key={session?.user.id ?? "guest"} />;
}
function OnlineAccountScreen() {
  const theme = useTheme();
  const auth = useOnlineAuth();
  const inbox = useInbox();
  const { invite: incoming, match: incomingMatch } = useLocalSearchParams<{
    invite?: string;
    match?: string;
  }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [register, setRegister] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invitationInput, setInvitation] = useState<string | null>(null);
  const invitation = invitationInput ?? incoming ?? "";
  const [shareLink, setShareLink] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [self, setSelf] = useState<OnlineSelf | null>(null);
  const [match, setMatch] = useState<OnlineMatch | null>(null);
  const matchRef = useRef<OnlineMatch | null>(null);
  const [pending, setPending] = useState<PendingAnswer | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cancel, setCancel] = useState(false);
  const [review, setReview] = useState(false);
  const lock = useRef(false);
  const actor = auth.session?.user.id;
  useAudioObservation(
    match
      ? {
          id: `${actor}:${match.id}`,
          answers: match.answers.length,
          completed: match.state === "completed",
          perfect:
            match.players.find((p) => p.slot === match.slot)?.correct === 10,
        }
      : null,
    duelAudioCues,
  );
  const actorRef = useRef(actor);

  const run = async (action: () => Promise<void>, accountAction = false) => {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await action();
    } catch (e) {
      const text =
        e instanceof OnlineError
          ? onlineMessage(e)
          : e instanceof Error
            ? e.message
            : "İşlem tamamlanamadı.";
      setError(text);
      if (accountAction)
        setFeedback({
          tone: "error",
          title: "Hesap İşlemi Tamamlanamadı",
          message: text,
        });
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const accept = useCallback(async (next: OnlineMatch, expected: string) => {
    if (actorRef.current !== expected) return;
    if (
      matchRef.current?.id === next.id &&
      matchRef.current.revision > next.revision
    )
      return;
    matchRef.current = next;
    setMatch(next);
    setReview(false);
    setShowInvite(false);
    if (next.inviteToken)
      setShareLink(
        Linking.createURL("/online", {
          queryParams: { invite: next.inviteToken },
        }),
      );
    const stored = await AsyncStorage.getItem(pendingKey(expected, next.id));
    if (actorRef.current !== expected) return;
    if (!stored) {
      setPending(null);
      return;
    }
    const value: unknown = JSON.parse(stored);
    if (
      !value ||
      typeof value !== "object" ||
      !("matchId" in value) ||
      value.matchId !== next.id ||
      !("requestId" in value) ||
      typeof value.requestId !== "string" ||
      !/^[a-f0-9-]{36}$/.test(value.requestId) ||
      !("position" in value) ||
      !Number.isInteger(value.position) ||
      Number(value.position) < 1 ||
      Number(value.position) > 10 ||
      !("optionId" in value) ||
      !["a", "b", "c", "d"].includes(String(value.optionId))
    )
      throw new Error(
        "Bekleyen çevrimiçi yanıt kaydı bozuk. Sunucu kayıtları değiştirilmedi.",
      );
    const answer = value as PendingAnswer;
    if (next.answers.some((a) => a.requestId === answer.requestId)) {
      await AsyncStorage.removeItem(pendingKey(expected, next.id));
      setPending(null);
    } else setPending(answer);
  }, []);
  const refresh = async () => {
    if (!actor || !match) return;
    await accept(
      await onlineRequest<OnlineMatch>("get", { matchId: match.id }, actor),
      actor,
    );
  };
  useEffect(() => {
    actorRef.current = actor;
    if (!actor || !inbox.ready) return;
    let current = true;
    void onlineRequest<OnlineSelf>("self", {}, actor)
      .then((data) => {
        if (current && actorRef.current === actor) {
          setSelf(data);
        }
      })
      .catch((e) => {
        if (current) setError(onlineMessage(e));
      });
    if (incomingMatch) {
      void onlineRequest<OnlineMatch>("get", { matchId: incomingMatch }, actor)
        .then(async (next) => {
          if (current) await accept(next, actor);
        })
        .catch((e) => {
          if (current) setError(onlineMessage(e));
        });
    }
    return () => {
      current = false;
      actorRef.current = undefined;
    };
  }, [actor, incomingMatch, inbox.ready, accept]);

  useEffect(() => {
    const matchId = match?.id;
    if (!actor || !matchId) return;
    let alive = true;
    const timer = setTimeout(() => {
      onlineRequest<OnlineMatch>("get", { matchId }, actor)
        .then(async (next) => {
          if (alive) await accept(next, actor);
        })
        .catch((e) => {
          if (alive) setError(onlineMessage(e));
        });
    }, 300);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [actor, match?.id, inbox.notifications, accept]);

  const act = async (
    operation: "get" | "start" | "invite" | "cancel",
    id = match?.id,
  ) => {
    if (!actor || !id) return;
    await accept(
      await onlineRequest<OnlineMatch>(operation, { matchId: id }, actor),
      actor,
    );
  };
  const createMatch = async () => {
    if (!actor) return;
    const storageKey = `@anla-quiz-online/create/v1/${actor}`;
    const previous = await AsyncStorage.getItem(storageKey);
    const requestId =
      previous && /^[a-f0-9-]{36}$/.test(previous) ? previous : randomUUID();
    await AsyncStorage.setItem(storageKey, requestId);
    const next = await onlineRequest<OnlineMatch>(
      "create",
      { requestId },
      actor,
    );
    if (actorRef.current !== actor) return;
    await AsyncStorage.removeItem(storageKey);
    setShareLink("");
    await accept(next, actor);
  };
  const send = async (answer: PendingAnswer) => {
    if (!actor) return;
    // This account-bound request survives an ambiguous network failure. No new
    // request id or new choice is generated when the same answer is retried.
    await AsyncStorage.setItem(
      pendingKey(actor, answer.matchId),
      JSON.stringify(answer),
    );
    if (actorRef.current !== actor) return;
    setPending(answer);
    const next = await onlineRequest<OnlineMatch>("answer", answer, actor);
    if (actorRef.current !== actor) return;
    await AsyncStorage.removeItem(pendingKey(actor, answer.matchId));
    setPending(null);
    await accept(next, actor);
    setInfo("Yanıt sunucuya kaydedildi ve kilitlendi.");
  };
  const field = (
    label: string,
    value: string,
    update: (value: string) => void,
    secret = false,
  ) => (
    <View style={{ gap: 6 }}>
      <Txt weight="bold">{label}</Txt>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={update}
        secureTextEntry={secret}
        editable={!busy}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={label === "E-posta" ? "email-address" : "default"}
        autoComplete={
          secret
            ? register
              ? "new-password"
              : "current-password"
            : label === "E-posta"
              ? "email"
              : "off"
        }
        style={{
          minHeight: 52,
          padding: 14,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: radius.sm,
          color: theme.text,
          backgroundColor: theme.background,
          fontSize: 16,
        }}
      />
    </View>
  );
  const terminal =
    !!match && ["completed", "expired", "cancelled"].includes(match.state);
  const question = match?.questions[match.answers.length];
  const playing = !!match?.started && !match.finished && !terminal;
  return (
    <Page
      title="Çevrimiçi düello"
      scrollResetKey={
        match
          ? `${match.id}:${match.started}:${match.answers.length}:${match.state}`
          : "lobby"
      }
      subtitle="Arkadaşını bul, meydan oku, birlikte keşfet."
      right={
        <IconButton
          name="home"
          label="Ana sayfa"
          onPress={() => router.replace("/")}
        />
      }
    >
      <View style={{ gap: 18 }}>
        <Chip icon="shield">
          {match
            ? contentScopeLabel[match.scope]
            : "Sunucuda doğrulanan çevrimiçi düello"}
        </Chip>
        {!match && (
          <LinearGradient
            colors={gradients.hero}
            style={{
              borderRadius: radius.card,
              padding: 24,
              gap: 14,
              overflow: "hidden",
            }}
          >
            <View
              pointerEvents="none"
              style={{ position: "absolute", inset: 0 }}
            >
              <Pattern opacity={0.08} />
            </View>
            <View style={[s.row, { justifyContent: "center", gap: 24 }]}>
              <Avatar size={40} variant={1} />
              <Txt size={22} weight="heavy" color={c.gold}>
                VS
              </Txt>
              <Avatar size={40} variant={2} />
            </View>
            <Txt
              size={22}
              weight="heavy"
              color={c.white}
              style={{ textAlign: "center" }}
            >
              İki hesap. Ortak bir meydan okuma.
            </Txt>
            <Txt color={c.tealLight} style={{ textAlign: "center" }}>
              10 soru · Doğru yanıt 100 puan · En fazla 1.000 puan. Eşit skor
              beraberliktir. Oyuncu adıyla arayıp meydan okuyabilirsin.
            </Txt>
          </LinearGradient>
        )}
        {!match && (
          <Card>
            <Txt>
              Soru havuzunu sunucu belirler; maçta kullanılan kapsam maç
              ekranında gösterilir. Çevrimiçi skorlar yerel XP, rozet veya
              antrenman geçmişine eklenmez.
            </Txt>
          </Card>
        )}
        {!!inbox.error && <Txt accessibilityRole="alert">{inbox.error}</Txt>}
        {!!auth.notice && <Txt accessibilityRole="alert">{auth.notice}</Txt>}
        {!!error && !feedback && (
          <Card>
            <Txt color={c.danger} accessibilityRole="alert">
              {error}
            </Txt>
          </Card>
        )}
        {!!info && (
          <Txt
            color={theme.dark ? c.tealLight : c.successInk}
            accessibilityLiveRegion="polite"
          >
            {info}
          </Txt>
        )}
        {!onlineConfigured ? (
          <Card style={{ gap: 12 }}>
            <Txt weight="heavy" size={18}>
              Çevrimiçi servis hazır değil
            </Txt>
            <Txt>
              Bu cihazda geliştirme bağlantısı yapılandırılmadı. Antrenman ve
              yerel iki oyunculu demo çalışmaya devam eder.
            </Txt>
          </Card>
        ) : !auth.ready ? (
          <Txt>Güvenli oturum kontrol ediliyor…</Txt>
        ) : !auth.session ? (
          <Card style={{ gap: 16 }}>
            <Txt size={22} weight="heavy">
              {register ? "Hesap oluştur" : "Giriş yap"}
            </Txt>
            {register ? (
              <>
                {!auth.registrationEnabled && (
                  <Txt>
                    E-posta servisi yapılandırılınca yeni hesap kaydı açılacak.
                    Mevcut hesabınla giriş yapıp düello oynayabilirsin.
                  </Txt>
                )}
                {field("E-posta", email, setEmail)}
                {field("Şifre", password, setPassword, true)}
                {field(
                  "Şifreyi tekrarla",
                  confirmPassword,
                  setConfirmPassword,
                  true,
                )}
                <Txt size={12}>{passwordError(password) ?? "Şifre uygun."}</Txt>
                <Button
                  title="Hesabımı Oluştur"
                  disabled={
                    busy ||
                    !auth.registrationEnabled ||
                    !validEmail(email) ||
                    !!passwordError(password) ||
                    password !== confirmPassword
                  }
                  onPress={() =>
                    void run(async () => {
                      await auth.signUp(email, password);
                      setPassword("");
                      setConfirmPassword("");
                      setFeedback({
                        tone: "information",
                        title: "Doğrulama Bekleniyor",
                        message:
                          "Kayıt isteğin alındı. Uygun bir hesap için gelen doğrulama e-postasındaki bağlantıyı aç. E-posta doğrulanmadan çevrimiçi hesabın etkinleşmez.",
                      });
                    }, true)
                  }
                />
                <Button
                  title="Doğrulama E-postasını Yeniden Gönder"
                  variant="outline"
                  disabled={busy}
                  onPress={() =>
                    router.push({
                      pathname: "/online/verify-email",
                      params: { email },
                    })
                  }
                />
                <Button
                  title="Giriş ekranına dön"
                  variant="outline"
                  onPress={() => setRegister(false)}
                />
              </>
            ) : (
              <>
                {field("E-posta", email, setEmail)}
                {field("Şifre", password, setPassword, true)}
                <Button
                  title={busy ? "Giriş yapılıyor…" : "Giriş yap"}
                  disabled={busy || !email.trim() || !password}
                  onPress={() =>
                    void run(async () => {
                      await auth.signIn(email, password);
                      setPassword("");
                    }, true)
                  }
                />
                <Button
                  title="Hesap Oluştur"
                  variant="outline"
                  disabled={busy}
                  onPress={() => setRegister(true)}
                />
                <Button
                  title="Şifremi Unuttum"
                  variant="outline"
                  disabled={busy}
                  onPress={() =>
                    router.push({
                      pathname: "/online/forgot-password",
                      params: { email },
                    })
                  }
                />
                <Button
                  title="E-postamı Doğrula"
                  variant="outline"
                  disabled={busy}
                  onPress={() =>
                    router.push({
                      pathname: "/online/verify-email",
                      params: { email },
                    })
                  }
                />
              </>
            )}
          </Card>
        ) : (
          <>
            {!match && (
              <Card style={{ gap: 12 }}>
                <Button
                  title="Davetler ve Bildirimler"
                  icon="bell"
                  variant="orange"
                  onPress={() => router.push("/online/inbox")}
                />
                <Txt weight="heavy" size={18}>
                  Çevrimiçi profil
                </Txt>
                <Txt size={12}>
                  E-posta:{" "}
                  {auth.session.user.email_confirmed_at
                    ? "doğrulandı"
                    : "doğrulama bekliyor"}{" "}
                  · Çevrimiçi hesap
                </Txt>
                <Button
                  title="Kullanıcı adım ve gizlilik"
                  icon="user"
                  onPress={() => router.push("/settings")}
                />
                <Button
                  title="Oyuncu Ara ve Arkadaşlarım"
                  icon="users"
                  variant="orange"
                  onPress={() => router.push("/online/players")}
                />
                <Button
                  title="Çıkış yap"
                  variant="outline"
                  disabled={busy}
                  onPress={() => void run(auth.signOut)}
                />
              </Card>
            )}
            {!self && (
              <Button
                title="Hesap erişimini yeniden kontrol et"
                variant="outline"
                disabled={busy}
                onPress={() =>
                  void run(async () => {
                    const data = await onlineRequest<OnlineSelf>(
                      "self",
                      {},
                      actor,
                    );
                    setSelf(data);
                  })
                }
              />
            )}
            {!!self && (
              <>
                {!match && (
                  <>
                    <Button
                      title="Yeni çevrimiçi maç oluştur"
                      icon="zap"
                      variant="orange"
                      disabled={busy}
                      onPress={() => void run(createMatch)}
                    />
                    <Card style={{ gap: 12 }}>
                      <Txt size={18} weight="heavy">
                        Arkadaşının davetine katıl
                      </Txt>
                      {field(
                        "Davet bağlantısı veya kodu",
                        invitation,
                        setInvitation,
                      )}
                      <Button
                        title="Daveti doğrula ve katıl"
                        variant="blue"
                        disabled={busy || !parseInvite(invitation)}
                        onPress={() =>
                          void run(async () => {
                            if (!actor) return;
                            await accept(
                              await onlineRequest<OnlineMatch>(
                                "join",
                                { token: parseInvite(invitation) },
                                actor,
                              ),
                              actor,
                            );
                            setInvitation("");
                            router.setParams({ invite: undefined });
                          })
                        }
                      />
                    </Card>
                    {self.matches.length > 0 && (
                      <Card style={{ gap: 12 }}>
                        <Txt size={18} weight="heavy">
                          Çevrimiçi maçların
                        </Txt>
                        {self.matches.map((item, index) => (
                          <Button
                            key={item.id}
                            title={`${index === 0 ? "Son maç" : `${index + 1}. maç`} · ${stateLabel[item.state]} · ${new Date(item.createdAt).toLocaleDateString("tr-TR")}`}
                            variant="outline"
                            disabled={busy}
                            onPress={() => void run(() => act("get", item.id))}
                          />
                        ))}
                      </Card>
                    )}
                  </>
                )}
                {!!match && (
                  <>
                    {playing || match.state === "completed" ? (
                      <View
                        style={[s.row, { justifyContent: "space-between" }]}
                      >
                        <Txt weight="bold">
                          Oyuncu {match.slot.toUpperCase()} ·{" "}
                          {match.state === "completed"
                            ? "Doğrulanmış sonuç"
                            : "Sunucu turu"}
                        </Txt>
                        <IconButton
                          name="refresh-cw"
                          label="Sunucudan yenile"
                          onPress={() => void run(refresh)}
                        />
                      </View>
                    ) : (
                      <Card style={{ gap: 10 }}>
                        <Txt size={18} weight="heavy">
                          {stateLabel[match.state]}
                        </Txt>
                        <Txt>
                          Sen Oyuncu {match.slot.toUpperCase()} olarak
                          oynuyorsun.
                        </Txt>
                        <Txt size={12}>
                          Son tarih:{" "}
                          {new Date(match.expiresAt).toLocaleString("tr-TR")} ·
                          Sunucu saati geçerlidir.
                        </Txt>
                        <Button
                          title="Sunucudan yenile"
                          variant="outline"
                          disabled={busy}
                          onPress={() => void run(refresh)}
                        />
                      </Card>
                    )}
                    {match.slot === "a" &&
                      match.players.length < 2 &&
                      !playing &&
                      !terminal && (
                        <Card style={{ gap: 12 }}>
                          <Txt weight="heavy" size={18}>
                            Güvenli arkadaş daveti
                          </Txt>
                          <Txt>
                            Davet 24 saat geçerli. Yalnızca bir farklı hesap
                            katılabilir.
                          </Txt>
                          {!!shareLink && (
                            <>
                              {showInvite && (
                                <Txt selectable size={12}>
                                  {shareLink}
                                </Txt>
                              )}
                              <Button
                                title={
                                  showInvite
                                    ? "Bağlantıyı gizle"
                                    : "Davet bağlantısını göster"
                                }
                                variant="outline"
                                onPress={() => setShowInvite(!showInvite)}
                              />
                              <Button
                                title="Davet bağlantısını paylaş"
                                variant="blue"
                                disabled={busy}
                                onPress={() =>
                                  void run(async () => {
                                    await Share.share({ message: shareLink });
                                  })
                                }
                              />
                            </>
                          )}
                          <Button
                            title={
                              shareLink
                                ? "Eski daveti kapat, yeni bağlantı oluştur"
                                : "Yeni davet bağlantısı oluştur"
                            }
                            variant="outline"
                            disabled={busy}
                            onPress={() => void run(() => act("invite"))}
                          />
                        </Card>
                      )}
                    {!terminal && !match.started && (
                      <Button
                        title={`Oyuncu ${match.slot.toUpperCase()} turunu başlat`}
                        variant="orange"
                        disabled={
                          busy ||
                          (match.slot === "b" &&
                            !match.direct &&
                            !match.players.find((p) => p.slot === "a")
                              ?.finished)
                        }
                        onPress={() => void run(() => act("start"))}
                      />
                    )}
                    {!terminal &&
                      match.started &&
                      !match.finished &&
                      !!question && (
                        <>
                          <Txt weight="heavy">
                            Soru {match.answers.length + 1} / 10
                          </Txt>
                          <View style={[s.row, { gap: 4 }]}>
                            {Array.from({ length: 10 }, (_, i) => (
                              <View
                                key={i}
                                style={{
                                  flex: 1,
                                  height: 7,
                                  borderRadius: 4,
                                  backgroundColor:
                                    i < match.answers.length
                                      ? c.emerald
                                      : c.creamBorder,
                                }}
                              />
                            ))}
                          </View>
                          <Card
                            style={{
                              paddingVertical: 30,
                              borderWidth: 1,
                              borderColor: c.creamBorder,
                            }}
                          >
                            <Txt
                              size={19}
                              weight="heavy"
                              style={{ textAlign: "center" }}
                            >
                              {question.prompt}
                            </Txt>
                          </Card>
                          {question.options.map((option, i) => (
                            <Tap
                              key={option.id}
                              label={`${String.fromCharCode(65 + i)} — ${option.text}`}
                              disabled={busy || !!pending}
                              onPress={() =>
                                void run(() =>
                                  send({
                                    matchId: match.id,
                                    position: match.answers.length + 1,
                                    optionId: option.id,
                                    requestId: randomUUID(),
                                  }),
                                )
                              }
                              style={{
                                minHeight: 48,
                                borderWidth: 1,
                                borderRadius: radius.md,
                                borderColor:
                                  pending?.optionId === option.id
                                    ? c.blue
                                    : theme.border,
                                backgroundColor: theme.card,
                                padding: 10,
                              }}
                            >
                              <View style={s.row}>
                                <Txt
                                  weight="heavy"
                                  color={theme.dark ? c.tealLight : c.teal}
                                >
                                  {String.fromCharCode(65 + i)}
                                </Txt>
                                <Txt
                                  size={15}
                                  weight="bold"
                                  style={{ flex: 1, minWidth: 0 }}
                                >
                                  {option.text}
                                </Txt>
                              </View>
                            </Tap>
                          ))}
                        </>
                      )}
                    {!!pending && !terminal && (
                      <Card style={{ gap: 12 }}>
                        <Txt>
                          Gönderimi kesinleşmemiş yanıt var. Seçim kilitli; aynı
                          istek kimliğiyle güvenle tekrar gönderilebilir.
                        </Txt>
                        <Button
                          title="Aynı yanıtı tekrar gönder"
                          disabled={busy}
                          onPress={() => void run(() => send(pending))}
                        />
                      </Card>
                    )}
                    {!terminal && match.finished && (
                      <Card>
                        <Txt size={18} weight="heavy">
                          Turun tamamlandı!
                        </Txt>
                        <Txt>
                          Rakibin turu bekleniyor. Skor, doğruluk ve açıklamalar
                          iki oyuncu da tamamlayınca sunucudan açılacak.
                        </Txt>
                      </Card>
                    )}
                    {match.state === "completed" && (
                      <>
                        <LinearGradient
                          colors={gradients.reward}
                          style={{
                            padding: 24,
                            borderRadius: radius.card,
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          {match.players
                            .filter(
                              (p) =>
                                p.slot === match.slot &&
                                typeof p.correct === "number",
                            )
                            .map((p) => (
                              <RoundResultBadge
                                key={match.id}
                                correct={p.correct!}
                                total={match.questions.length}
                              />
                            ))}
                          <Txt weight="heavy" size={22} color={c.gold}>
                            {match.result?.winner === "tie"
                              ? "Berabere!"
                              : `Oyuncu ${match.result?.winner.toUpperCase()} kazandı!`}
                          </Txt>
                          <Txt color={c.white}>
                            Sonuç sunucuda kesinleştirildi.
                          </Txt>
                        </LinearGradient>
                        {match.players.map((p) => (
                          <Card key={p.slot} style={{ gap: 6 }}>
                            <Txt weight="heavy" size={19}>
                              {p.name} · Oyuncu {p.slot.toUpperCase()}
                            </Txt>
                            <Txt size={24} weight="heavy">
                              {p.score} puan
                            </Txt>
                            <Txt>
                              {p.correct} doğru · {p.wrong} yanlış
                            </Txt>
                          </Card>
                        ))}
                        <Button
                          title="Tekrar maç yap"
                          variant="orange"
                          disabled={busy}
                          onPress={() => void run(createMatch)}
                        />
                        <Button
                          title="Yanıtlarını ve açıklamaları incele"
                          variant="outline"
                          onPress={() => setReview(!review)}
                        />
                        {review &&
                          match.questions.map((q, index) => (
                            <Card key={q.id} style={{ gap: 8 }}>
                              <Txt weight="heavy">
                                {index + 1}. {q.prompt}
                              </Txt>
                              <Txt>
                                Yanıtın:{" "}
                                {
                                  q.options.find(
                                    (o) =>
                                      o.id === match.answers[index]?.optionId,
                                  )?.text
                                }
                              </Txt>
                              <Txt>
                                Doğru yanıt:{" "}
                                {
                                  q.options.find(
                                    (o) =>
                                      o.id ===
                                      match.review[index]?.correctOptionId,
                                  )?.text
                                }
                              </Txt>
                              <Txt>{match.review[index]?.explanation}</Txt>
                            </Card>
                          ))}
                      </>
                    )}
                    {(terminal || match.finished) && (
                      <Button
                        title="Maç listesine dön"
                        variant="outline"
                        disabled={busy}
                        onPress={() =>
                          void run(async () => {
                            const data = await onlineRequest<OnlineSelf>(
                              "self",
                              {},
                              actor,
                            );
                            setSelf(data);
                            setMatch(null);
                            setShareLink("");
                            setReview(false);
                          })
                        }
                      />
                    )}
                    {match.slot === "a" && !terminal && (
                      <Button
                        title="Maçı iptal et"
                        variant="outline"
                        disabled={busy}
                        onPress={() => setCancel(true)}
                      />
                    )}
                    {!terminal && (
                      <Txt size={12}>
                        Buradan ayrılıp daha sonra aynı hesapla devam
                        edebilirsin. Doğru cevaplar tur sırasında açıklanmaz.
                      </Txt>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
        <Button
          title="Yerel iki oyunculu demo"
          variant="outline"
          disabled={busy}
          onPress={() => router.replace("/duel")}
        />
        <Button
          title="Hesapsız antrenmana dön"
          variant="outline"
          disabled={busy}
          onPress={() => router.replace("/")}
        />
      </View>
      <Dialog
        visible={cancel}
        title="Maç iptal edilsin mi?"
        onClose={() => setCancel(false)}
      >
        <View style={{ gap: 14 }}>
          <Txt>
            Rakip başlamadıysa maç kapanır. Tek oyunculu kayıtların etkilenmez.
          </Txt>
          <Button
            title="Maçı kapat"
            onPress={() => {
              setCancel(false);
              void run(() => act("cancel"));
            }}
          />
          <Button
            title="Vazgeç"
            variant="outline"
            onPress={() => setCancel(false)}
          />
        </View>
      </Dialog>
      <FeedbackDialog feedback={feedback} onClose={() => setFeedback(null)} />
    </Page>
  );
}
