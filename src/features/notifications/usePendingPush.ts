import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { pushRequest } from "./api";
import * as device from "./device";
import {
  pushEnvelope,
  resolvePushDestination,
  type PushEnvelope,
} from "./model";

// One pending-intent lifecycle; the provider remains the sole preference owner.
export function usePendingPush({
  actor,
  authReady,
  gameReady,
  navigationKey,
  refresh,
}: {
  actor: string | undefined;
  authReady: boolean;
  gameReady: boolean;
  navigationKey: string | undefined;
  refresh: () => Promise<void>;
}) {
  const [pending, setPending] = useState<PushEnvelope | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    void device
      .startPushListeners(
        (value, id) => {
          const v = pushEnvelope(value);
          if (!v) return;
          void (async () => {
            const last = await AsyncStorage.getItem("@anla-quiz/push-last");
            if (last === id) return;
            await AsyncStorage.multiSet([
              ["@anla-quiz/push-pending", JSON.stringify(v)],
              ["@anla-quiz/push-last", id],
            ]);
            if (!cancelled) setPending(v);
          })().catch(() => {
            if (!cancelled) {
              setPending(v);
              setNotice(
                "Bildirim hedefi bu cihazda kaydedilemedi. Yeniden girişte bildirimi tekrar açman gerekebilir.",
              );
            }
          });
        },
        () => void refresh(),
      )
      .then((fn) => {
        if (cancelled) fn();
        else cleanup = fn;
      })
      .catch(() => {
        if (!cancelled)
          setNotice("Bildirim bağlantısı kurulamadı. Ayarlardan yeniden dene.");
      });
    void AsyncStorage.getItem("@anla-quiz/push-pending")
      .then((raw) => {
        try {
          const v = raw ? pushEnvelope(JSON.parse(raw)) : null;
          if (!cancelled) setPending(v);
        } catch {
          if (!cancelled) setPending(null);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [refresh]);
  useEffect(() => {
    if (!pending || !authReady || !gameReady || !navigationKey) return;
    if (!actor) {
      router.push("/online");
      return;
    }
    if (pending.recipientId !== actor) {
      let cancelled = false;
      void AsyncStorage.removeItem("@anla-quiz/push-pending")
        .catch(() => {})
        .then(() => {
          if (!cancelled) {
            setNotice(
              "Bu bildirim farklı bir hesaba ait. İlgili hesabınla giriş yapıp bildirimi yeniden açabilirsin.",
            );
            setPending(null);
          }
        });
      return () => {
        cancelled = true;
      };
    }
    let cancelled = false;
    const complete = (value: unknown) => {
      if (cancelled) return;
      const destination = resolvePushDestination(value, pending);
      if (destination) router.push(destination);
      setPending(null);
      void AsyncStorage.removeItem("@anla-quiz/push-pending");
    };
    void pushRequest<unknown>(actor, "target", {
      notificationId: pending.notificationId,
      source: pending.source,
    })
      .then(complete)
      .catch(() => complete(null));
    return () => {
      cancelled = true;
    };
  }, [pending, actor, authReady, gameReady, navigationKey]);
  return pending && actor && pending.recipientId !== actor
    ? "Bu bildirim başka bir hesabına ait. İlgili hesabınla giriş yap."
    : notice;
}
