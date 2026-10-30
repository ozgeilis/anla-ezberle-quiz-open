import { PublicAchievements } from "../achievements/PublicAchievements";
import { useInbox } from "./InboxProvider";
import React, { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Avatar } from "../../components/game/Artwork";
import { Button, Card, Page, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useOnlineAuth } from "./OnlineProvider";
import { onlineMessage, onlineRequest } from "./client";
import { Friendship, SocialPlayer } from "./types";
import { searchUsername } from "./usernames";

export function PlayersScreen() {
  const { session } = useOnlineAuth();
  return <Players key={session?.user.id ?? "guest"} />;
}
function Players() {
  const router = useRouter();
  const theme = useTheme();
  const inbox = useInbox();
  const { session } = useOnlineAuth();
  const actor = session?.user.is_anonymous ? undefined : session?.user.id;
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<SocialPlayer[]>([]);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [error, setError] = useState("");
  const [searchNotice, setSearchNotice] = useState(
    "Aramak için en az 3 küçük harf, rakam veya alt çizgi yaz.",
  );
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [revision, setRevision] = useState(0);
  const lock = useRef(false);
  useEffect(() => {
    if (!actor || !inbox.ready) return;
    let alive = true;
    onlineRequest<{ friendships: Friendship[] }>("friends", {}, actor)
      .then((value) => {
        if (alive) {
          setFriends(value.friendships);
          setLoaded(true);
          setError("");
        }
      })
      .catch((e) => {
        if (alive) setError(onlineMessage(e));
      });
    return () => {
      alive = false;
    };
  }, [actor, revision, inbox.notifications, inbox.ready]);
  useEffect(() => {
    const normalized = searchUsername(query);
    if (!actor || !inbox.ready || !/^[a-z0-9_]{3,20}$/.test(normalized)) {
      return;
    }
    let alive = true;
    const timer = setTimeout(() => {
      setSearchNotice("Aranıyor…");
      onlineRequest<{ players: SocialPlayer[] }>(
        "player_search",
        { query: normalized },
        actor,
      )
        .then((value) => {
          if (alive) {
            setPlayers(value.players);
            setSearchNotice(
              value.players.length
                ? `${value.players.length} oyuncu bulundu.`
                : "Bulunabilir oyuncu bulunamadı.",
            );
          }
        })
        .catch((e) => {
          if (alive) setSearchNotice(onlineMessage(e));
        });
    }, 500);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [actor, query, revision, inbox.ready]);
  const action = async (
    operation: "friend_send" | "friend_accept" | "friend_remove",
    body: object,
  ) => {
    if (!actor || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await onlineRequest(operation, body, actor);
      setNotice(
        operation === "friend_send"
          ? "Arkadaşlık isteği gönderildi."
          : operation === "friend_accept"
            ? "Arkadaşlık isteği kabul edildi."
            : "Arkadaşlık kaydı kaldırıldı.",
      );
      setRevision((n) => n + 1);
    } catch (e) {
      setError(onlineMessage(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const playerInfo = (player: SocialPlayer) => (
    <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
      <Avatar variant={player.avatar} size={48} />
      <View style={{ flex: 1, gap: 4 }}>
        <Txt weight="heavy">{player.name}</Txt>
        <Txt color={theme.accent}>@{player.username}</Txt>
        <Txt size={12} color={theme.muted}>
          Seviye {player.level} · {player.xp} çevrimiçi XP
        </Txt>
        <PublicAchievements player={player} />
      </View>
    </View>
  );
  return (
    <Page title="Oyuncu Ara" subtitle="Birlikte keşfet, yeni arkadaşlar edin.">
      <Button
        title="Profilime dön"
        variant="outline"
        icon="arrow-left"
        onPress={() => router.replace("/profile")}
      />
      {!actor ? (
        <Card style={{ marginTop: 18, gap: 12 }}>
          <Txt>
            Oyuncu arama ve arkadaşlar için kalıcı, doğrulanmış hesabınla giriş
            yap. Çevrimdışı oyunların devam eder.
          </Txt>
          <Button
            title="Hesaba giriş yap"
            onPress={() => router.push("/online")}
          />
        </Card>
      ) : (
        <View style={{ gap: 18, marginTop: 18 }}>
          <TextInput
            accessibilityLabel="Kullanıcı adıyla oyuncu ara"
            value={query}
            onChangeText={(value) => {
              setQuery(value);
              setPlayers([]);
              setSearchNotice(
                /^[a-z0-9_]{3,20}$/.test(searchUsername(value))
                  ? "Aranıyor…"
                  : "Aramak için en az 3 küçük harf, rakam veya alt çizgi yaz.",
              );
            }}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={21}
            placeholder="@kullaniciadi"
            placeholderTextColor={theme.muted}
            style={{
              fontSize: 16,
              minHeight: 54,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: theme.goldBorder,
              padding: 14,
              color: theme.text,
              backgroundColor: theme.panel,
            }}
          />
          <Txt accessibilityLiveRegion="polite" size={13} color={theme.muted}>
            {searchNotice}
          </Txt>
          {players.map((player) => {
            const existing = friends.find((f) => f.player?.id === player.id);
            return (
              <Card
                key={player.id}
                style={{ gap: 12, backgroundColor: theme.mintSurface }}
              >
                {playerInfo(player)}
                <Button
                  title="Meydan Oku"
                  icon="zap"
                  variant="orange"
                  disabled={inbox.busy}
                  onPress={() =>
                    void inbox.sendChallenge(player.id).then((c) => {
                      if (c) router.push("/online/invitations");
                    })
                  }
                />
                {existing ? (
                  <Txt size={13}>
                    {existing.state === "accepted"
                      ? "Arkadaşın ✓"
                      : existing.incoming
                        ? "Gelen isteğin var; aşağıdan yanıtlayabilirsin."
                        : "İstek gönderildi"}
                  </Txt>
                ) : (
                  <Button
                    title="Arkadaş Ekle"
                    icon="user-plus"
                    disabled={busy || !loaded}
                    onPress={() =>
                      void action("friend_send", { playerId: player.id })
                    }
                  />
                )}
              </Card>
            );
          })}
          <Txt accessibilityRole="header" size={22} weight="heavy">
            Arkadaşlarım
          </Txt>
          <Button
            title="Listeyi yenile"
            icon="refresh-cw"
            variant="outline"
            disabled={busy}
            onPress={() => setRevision((n) => n + 1)}
          />
          {!!error && <Txt accessibilityRole="alert">{error}</Txt>}
          {!!notice && <Txt accessibilityLiveRegion="polite">{notice}</Txt>}
          {!loaded && !error && <Txt>Arkadaş listesi yükleniyor…</Txt>}
          {loaded && !friends.length && (
            <Txt color={theme.muted}>
              Henüz arkadaşlık kaydın yok. Kullanıcı adıyla arayarak
              başlayabilirsin.
            </Txt>
          )}
          {friends.map((f) => (
            <Card
              key={f.id}
              style={{
                gap: 12,
                backgroundColor:
                  f.state === "accepted"
                    ? theme.mintSurface
                    : theme.goldSurface,
              }}
            >
              {f.player ? (
                playerInfo(f.player)
              ) : (
                <Txt>Kullanılamayan oyuncu</Txt>
              )}
              <Txt size={13}>
                {f.state === "accepted"
                  ? "Arkadaşın"
                  : f.incoming
                    ? "Gelen arkadaşlık isteği"
                    : "Gönderdiğin istek bekliyor"}
              </Txt>
              {f.state === "accepted" && f.player && (
                <Button
                  title="Meydan Oku"
                  icon="zap"
                  variant="orange"
                  disabled={inbox.busy}
                  onPress={() =>
                    void inbox.sendChallenge(f.player!.id).then((c) => {
                      if (c) router.push("/online/invitations");
                    })
                  }
                />
              )}
              {f.state === "pending" && f.incoming && (
                <Button
                  title="Kabul Et"
                  disabled={busy}
                  onPress={() =>
                    void action("friend_accept", { friendshipId: f.id })
                  }
                />
              )}
              <Button
                title={
                  f.state === "accepted"
                    ? "Arkadaşlıktan Çıkar"
                    : f.incoming
                      ? "Reddet"
                      : "İsteği İptal Et"
                }
                variant="outline"
                disabled={busy}
                onPress={() =>
                  void action("friend_remove", { friendshipId: f.id })
                }
              />
            </Card>
          ))}
          <Card style={{ gap: 12 }}>
            <Txt size={13} color={theme.muted}>
              Oyuncuyu bul, meydan oku ve daveti kabul ettiğinde aynı sorularla
              düelloya başla.
            </Txt>
            <Button
              title={`Davetler ve Bildirimler · ${inbox.unreadCount}`}
              icon="bell"
              onPress={() => router.push("/online/inbox")}
            />
            {!!inbox.error && (
              <Txt accessibilityRole="alert">{inbox.error}</Txt>
            )}
            <Button
              title="Çevrimiçi Düelloya Git"
              icon="users"
              onPress={() => router.push("/online")}
            />
          </Card>
          <Txt size={12} color={theme.muted}>
            XP yalnız sunucuda tamamlanan çevrimiçi maçlardan gelir. Bu
            cihazdaki XP ve rozetlerin profilinde kalır. Sonuçlar en çok 20
            oyuncu içerir; daha fazla harfle aramanı daralt.
          </Txt>
        </View>
      )}
    </Page>
  );
}
