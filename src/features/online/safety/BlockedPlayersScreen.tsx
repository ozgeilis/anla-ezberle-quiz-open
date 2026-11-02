import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, Page, Txt } from "../../../components/ui";
import { Avatar } from "../../../components/game/Artwork";
import { useOnlineAuth } from "../OnlineProvider";
import { onlineRequest, onlineMessage } from "../client";
import { useSafetyReady } from "./useSafetyReady";
type BlockedPlayer = {
  id: string;
  name: string;
  username: string | null;
  avatar: number;
};
export function BlockedPlayersScreen() {
  const { session } = useOnlineAuth();
  return (
    <BlockedPlayers
      key={session?.user.id ?? "guest"}
      actor={session?.user.is_anonymous ? undefined : session?.user.id}
    />
  );
}
function BlockedPlayers({ actor }: { actor?: string }) {
  const router = useRouter(),
    ready = useSafetyReady(actor);
  const [players, setPlayers] = useState<BlockedPlayer[]>([]),
    [message, setMessage] = useState(""),
    [revision, setRevision] = useState(0),
    [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const lock = useRef(false),
    alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (!actor || !ready) return;
    let active = true;
    onlineRequest<{ players: BlockedPlayer[] }>("blocked_players", {}, actor)
      .then((data) => {
        if (active) {
          setPlayers(data.players);
          setLoaded(true);
        }
      })
      .catch((error) => {
        if (active) setMessage(onlineMessage(error));
      });
    return () => {
      active = false;
    };
  }, [actor, ready, revision]);
  const unblock = async (id: string) => {
    if (!actor || lock.current) return;
    lock.current = true;
    setBusy(true);
    setMessage("");
    try {
      await onlineRequest("player_unblock", { playerId: id }, actor);
      if (alive.current) {
        setPlayers((items) => items.filter((p) => p.id !== id));
        setMessage(
          "Engel kaldırıldı. Önceki arkadaşlık ve davetler geri yüklenmez.",
        );
      }
    } catch (error) {
      if (alive.current) setMessage(onlineMessage(error));
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  };
  return (
    <Page title="Engellenen Oyuncular">
      <View style={{ gap: 12 }}>
        <Button
          title="Oyunculara dön"
          variant="outline"
          onPress={() => router.replace("/online/players")}
        />
        {!actor ? (
          <Txt>Kalıcı hesabınla giriş yap.</Txt>
        ) : !ready ? (
          <Txt>Oyuncu güvenliği servisi henüz kullanılamıyor.</Txt>
        ) : (
          <>
            <Button
              title="Listeyi yenile"
              variant="outline"
              disabled={busy}
              onPress={() => setRevision((n) => n + 1)}
            />
            {!loaded && !message && <Txt>Engellenen oyuncular yükleniyor…</Txt>}
            {loaded && !players.length && <Txt>Engellediğin oyuncu yok.</Txt>}
            {players.map((p) => (
              <Card key={p.id} style={{ gap: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Avatar variant={p.avatar} size={40} />
                  <View style={{ flex: 1 }}>
                    <Txt weight="semibold">{p.name}</Txt>
                    {p.username && <Txt size={12}>@{p.username}</Txt>}
                  </View>
                </View>
                <Button
                  compact
                  title="Engeli Kaldır"
                  variant="outline"
                  disabled={busy}
                  onPress={() => void unblock(p.id)}
                />
              </Card>
            ))}
          </>
        )}
        {!!message && <Txt accessibilityLiveRegion="polite">{message}</Txt>}
      </View>
    </Page>
  );
}
