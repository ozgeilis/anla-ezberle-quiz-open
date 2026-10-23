import { useInbox } from "./InboxProvider";
import React, { useEffect, useRef, useState } from "react";
import { Switch, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Icon, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { usePlayerIdentity } from "./SocialIdentityProvider";
import { FeedbackDialog, Feedback } from "../../components/ui/FeedbackDialog";
import { onlineConfigured, onlineMessage, onlineRequest } from "./client";
import { useOnlineAuth } from "./OnlineProvider";
import { usernameError } from "./usernames";

export function SocialProfile() {
  const { session } = useOnlineAuth();
  return <AccountProfile key={session?.user.id ?? "guest"} />;
}
function AccountProfile() {
  const theme = useTheme();
  const inbox = useInbox();
  const { session } = useOnlineAuth();
  const identity = usePlayerIdentity();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const actor = session?.user.is_anonymous ? undefined : session?.user.id;
  const self = identity.self;
  const [usernameInput, setUsername] = useState<string | null>(null);
  const username = usernameInput ?? self?.profile.username ?? "";
  const [discoverableInput, setDiscoverable] = useState<boolean | null>(null);
  const discoverable = discoverableInput ?? self?.profile.discoverable ?? false;
  const [checkedUsername, setCheckedUsername] = useState("");
  const [availabilityState, setAvailability] = useState<
    "idle" | "checking" | "available" | "taken" | "error"
  >("idle");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  useEffect(() => {
    if (!actor || !self || usernameError(username)) {
      return;
    }
    let alive = true;
    const timer = setTimeout(() => {
      setCheckedUsername(username);
      setAvailability("checking");
      onlineRequest<{ available: boolean }>(
        "username_check",
        { username },
        actor,
      )
        .then((value) => {
          if (alive) setAvailability(value.available ? "available" : "taken");
        })
        .catch(() => {
          if (alive) setAvailability("error");
        });
    }, 450);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [actor, username, self]);
  const availability = usernameError(username)
    ? "idle"
    : checkedUsername !== username
      ? "checking"
      : availabilityState;
  const save = async () => {
    if (!actor || lock.current || availability !== "available") return;
    lock.current = true;
    setBusy(true);
    setNotice("");
    try {
      await identity.save(username, discoverable);
      setFeedback({
        tone: "success",
        title: "Kullanıcı Adın Kaydedildi",
        message:
          "Benzersiz kullanıcı adın güncellendi. Görünen adın ve diğer profil bilgilerin korundu.",
      });
    } catch (e) {
      setFeedback({
        tone: "error",
        title: "Profil Kaydedilemedi",
        message:
          e instanceof Error && !("code" in e) ? e.message : onlineMessage(e),
      });
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const validation = usernameError(username);
  return (
    <Card style={{ gap: 14, marginBottom: 18 }}>
      <Txt size={19} weight="heavy">
        Kullanıcı Adı ve Gizlilik
      </Txt>
      {!actor ? (
        <>
          <Txt color={theme.muted}>
            Yerel profilin korunuyor. Benzersiz kullanıcı adı ve arkadaşlar için
            doğrulanmış, kalıcı hesabınla giriş yap.
          </Txt>
          <Button
            title="Çevrimiçi hesaba git"
            icon="log-in"
            onPress={() => router.push("/online")}
          />
          {!onlineConfigured && (
            <Txt size={12}>Çevrimiçi servis bu derlemede yapılandırılmadı.</Txt>
          )}
        </>
      ) : (
        <>
          {self?.profile.username && (
            <Txt weight="heavy" color={theme.accent}>
              @{self.profile.username}
            </Txt>
          )}
          {self?.player && (
            <Txt size={12}>
              Sunucuda doğrulanan çevrimiçi XP: {self.player.xp} · Seviye{" "}
              {self.player.level}
            </Txt>
          )}
          <Txt size={12} color={theme.muted}>
            Benzersiz @kullanıcı_adın arkadaşlarının seni bulmasını sağlar.
            Görünen adın ayrı kaydedilir; burada değişmez.
          </Txt>
          <TextInput
            accessibilityLabel="Benzersiz kullanıcı adı"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
            value={username}
            onChangeText={(value) => {
              setUsername(value);
              setNotice("");
            }}
            placeholder="kullanici_adi"
            placeholderTextColor={theme.muted}
            style={{
              minHeight: 52,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 14,
              padding: 14,
              color: theme.text,
              backgroundColor: theme.background,
              fontSize: 16,
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {availability === "available" && (
              <Icon name="check-circle" color={theme.accent} size={21} />
            )}
            <Txt
              accessibilityLiveRegion="polite"
              size={13}
              color={availability === "available" ? theme.accent : theme.muted}
              style={{ flex: 1 }}
            >
              {validation ??
                {
                  idle: "",
                  checking: "Uygunluk kontrol ediliyor…",
                  available: "Kullanıcı adı uygun ✓",
                  taken: "Bu kullanıcı adı alınmış.",
                  error:
                    "Uygunluk kontrol edilemedi. Bağlantını kontrol et ve yeniden dene.",
                }[availability]}
            </Txt>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Txt weight="bold">Oyuncu aramada bulunabilirim</Txt>
              <Txt size={12} color={theme.muted}>
                Yalnız adın, avatarın, kullanıcı adın ve çevrimiçi XP’n görünür.
              </Txt>
            </View>
            <Switch
              accessibilityLabel="Oyuncu aramada bulunabilirim"
              value={discoverable}
              onValueChange={setDiscoverable}
            />
          </View>
          <Button
            title={busy ? "Kaydediliyor…" : "Çevrimiçi profili kaydet"}
            icon="check"
            disabled={
              !self || busy || availability !== "available" || !!validation
            }
            onPress={() => void save()}
          />
          <Button
            variant="outline"
            title="Yeniden kontrol et"
            onPress={() => {
              void identity.refresh().catch((e) => setNotice(onlineMessage(e)));
            }}
            disabled={busy}
          />
          <Button
            variant="orange"
            title="Oyuncu Ara ve Arkadaşlarım"
            icon="users"
            onPress={() => router.push("/online/players")}
          />
        </>
      )}
      {!!actor && (
        <Button
          title="Davetler ve Bildirimler"
          icon="bell"
          variant="outline"
          onPress={() => router.push("/online/inbox")}
        />
      )}
      {!!actor && !inbox.ready && (
        <Txt accessibilityLiveRegion="polite">
          {inbox.error || "Çevrimiçi hesabın hazırlanıyor…"}
        </Txt>
      )}
      {!!identity.error && (
        <Txt accessibilityRole="alert">{identity.error}</Txt>
      )}
      <FeedbackDialog feedback={feedback} onClose={() => setFeedback(null)} />
      {!!notice && (
        <Txt accessibilityLiveRegion="polite" size={13}>
          {notice}
        </Txt>
      )}
    </Card>
  );
}
