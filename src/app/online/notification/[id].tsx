import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Page, Txt } from "../../../components/ui";
import { NotificationDetail } from "../../../features/online/NotificationDetail";
import { useOnlineAuth } from "../../../features/online/OnlineProvider";
import type { PlayerNotification } from "../../../features/online/types";
import { pushRequest } from "../../../features/notifications/api";
export default function PushNotificationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    { session } = useOnlineAuth();
  return (
    <OwnedNotification key={`${session?.user.id ?? "guest"}:${id}`} id={id} />
  );
}
function OwnedNotification({ id }: { id: string }) {
  const { session } = useOnlineAuth();
  const actor = session?.user.id;
  const [notification, setNotification] = useState<PlayerNotification | null>(
      null,
    ),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  const validId =
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id);
  useEffect(() => {
    let alive = true;
    if (!actor || !validId) return;
    void pushRequest<PlayerNotification | null>(actor, "notification", {
      notificationId: id,
    })
      .then((value) => {
        if (!alive) return;
        if (value) setNotification(value);
        else setError("Bildirim bulunamadı veya bu hesaba ait değil.");
      })
      .catch(() => {
        if (alive)
          setError("Bildirim alınamadı. Bağlantını kontrol edip yeniden dene.");
      });
    return () => {
      alive = false;
    };
  }, [actor, id, validId, attempt]);
  const close = () =>
    router.canGoBack() ? router.back() : router.replace("/online/inbox");
  return (
    <Page title="Bildirim Ayrıntısı">
      <Button title="Geri Dön" variant="outline" onPress={close} />
      {!actor ? (
        <>
          <Txt>Bu bildirimi görmek için ilgili hesabınla giriş yap.</Txt>
          <Button title="Giriş Yap" onPress={() => router.push("/online")} />
        </>
      ) : notification ? (
        <NotificationDetail
          selection={{ kind: "notification", notification }}
          onClose={close}
        />
      ) : (
        <>
          <Txt accessibilityRole={error ? "alert" : undefined}>
            {!validId
              ? "Bildirim bağlantısı geçerli değil."
              : error || "Bildirim yükleniyor…"}
          </Txt>
          <Button
            title="Yeniden Dene"
            onPress={() => {
              setError("");
              setAttempt((n) => n + 1);
            }}
          />
        </>
      )}
    </Page>
  );
}
