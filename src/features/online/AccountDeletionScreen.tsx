import React, { useEffect, useRef, useState } from "react";
import { Linking, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deletionCacheKeys } from "./deletionLocal";
import { useGame } from "../../storage/GameProvider";
import { useRouter } from "expo-router";
import { Button, Card, Dialog, Page, Tap, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useOnlineAuth } from "./OnlineProvider";
import { onlineClient } from "./client";
export function AccountDeletionScreen() {
  const auth = useOnlineAuth();
  const [confirmedActor, setConfirmedActor] = useState<string | null>(null);
  return (
    <AccountDeletionForm
      key={confirmedActor ?? auth.session?.user.id ?? "guest"}
      onServerDeleted={setConfirmedActor}
    />
  );
}
function AccountDeletionForm({
  onServerDeleted,
}: {
  onServerDeleted: (actor: string) => void;
}) {
  const router = useRouter();
  const auth = useOnlineAuth(),
    theme = useTheme();
  const { updateProfile } = useGame();
  const [serverDeleted, setServerDeleted] = useState<string | null>(null);
  const finishLocal = async (actorId: string) => {
    const client = onlineClient();
    const current = await client?.auth.getSession();
    if (!client || current?.error)
      throw Error("Cihaz oturumu okunamadı. Yerel temizliği yeniden dene.");
    if (current?.data.session && current.data.session.user.id !== actorId)
      throw Error("Aktif hesap değişti; yeni hesabının verileri temizlenmedi.");
    const keys = deletionCacheKeys(await AsyncStorage.getAllKeys(), actorId);
    if (keys.length) await AsyncStorage.multiRemove(keys);
    if (!(await updateProfile({ name: "Oyuncu" })))
      throw Error(
        "Sunucu hesabın silindi; cihazındaki profil adı temizlenemedi. Yeniden dene.",
      );
    await auth.completeAccountDeletion(actorId);
    router.replace("/online");
  };
  const [stage, setStage] = useState<0 | 1 | 2>(0),
    [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null),
    [pendingAction, setPendingAction] = useState<
      "code" | "delete" | "cleanup" | null
    >(null),
    [message, setMessage] = useState("");
  const busy = pendingAction !== null;
  // A passwordless email identity does NOT prove that an app password exists.
  const hasGoogleIdentity =
    auth.session?.user.identities?.some((i) => i.provider === "google") ===
    true;
  const [usePassword, setUsePassword] = useState(false);
  const useGoogleCode = hasGoogleIdentity && !usePassword;
  const [challenge, setChallenge] = useState("");
  const actor = auth.session?.user.id,
    currentActor = useRef(actor),
    lock = useRef(false);
  useEffect(() => {
    let alive = true;
    currentActor.current = actor;
    const client = onlineClient();
    if (client)
      void Promise.resolve(client.rpc("online_service_capabilities"))
        .then(({ data, error }) => {
          if (!alive) return;
          setAvailable(!error && data?.accountDeletionEnabled === true);
          if (error)
            setMessage(
              "Servis durumuna ulaşılamadı. Yeniden açıp tekrar dene.",
            );
        })
        .catch(() => {
          if (alive) {
            setAvailable(false);
            setMessage("Servis durumuna ulaşılamadı.");
          }
        });
    else
      void Promise.resolve().then(() => {
        if (alive) setAvailable(false);
      });
    return () => {
      alive = false;
      currentActor.current = undefined;
    };
  }, [actor]);
  const erase = async () => {
    if (
      lock.current ||
      !actor ||
      !available ||
      confirmation !== "SİL" ||
      !password
    )
      return;
    const client = onlineClient();
    if (!client) return;
    const deletingActor = actor;
    lock.current = true;
    setPendingAction("delete");
    setMessage("");
    try {
      const { data: sessionData } = await client.auth.getSession();
      if (sessionData.session?.user.id !== deletingActor)
        throw Error("Oturum değişti. Yeniden giriş yap.");
      const { data, error } = await client.functions.invoke("account-delete", {
        body: useGoogleCode
          ? { confirmation: "DELETE", googleCode: password, challenge }
          : { confirmation: "DELETE", password },
      });
      if (error || data?.deleted !== true)
        throw Error(
          useGoogleCode
            ? "Silme tamamlandığı doğrulanamadı. Yeni bir kod isteyip tekrar dene. Giriş yapamıyorsan destek adresine ulaş."
            : "Silme tamamlandığı doğrulanamadı. Şifreni ve bağlantını kontrol et. Dosya temizliği başlamış olabilir; giriş yapamıyorsan destek adresine ulaş. Sunucu onayı olmadan tamamlandı denmez.",
        );
      if (currentActor.current !== deletingActor) return;
      setPassword("");
      setConfirmation("");
      setStage(0);
      onServerDeleted(deletingActor);
      setServerDeleted(deletingActor);
      await finishLocal(deletingActor);
    } catch (e) {
      if (currentActor.current === deletingActor)
        setMessage(e instanceof Error ? e.message : "Silme doğrulanamadı.");
    } finally {
      setPassword("");
      if (useGoogleCode) setChallenge("");
      lock.current = false;
      setPendingAction(null);
    }
  };
  return (
    <Page title="Hesabımı Sil" subtitle="Anla & Ezberle · Kovynel Studio">
      <Card style={{ gap: 14 }}>
        <Txt size={20} weight="heavy">
          Hesabın üzerindeki kontrol sende
        </Txt>
        <Txt>
          Bu işlem hesaptan çıkıştan farklıdır ve geri alınamaz. E-posta/giriş
          hesabın, çevrimiçi profilin, arkadaşlıkların, bildirimlerin, kendi
          yanıtların ve çevrimiçi puanların silinir.
        </Txt>
        <Txt>
          Diğer oyuncuların kazanılmış puanları korunur; ortak geçmişte sana ait
          kimlik bağlantıları kaldırılır. Devam eden ilişkili maçlar iptal
          edilir.
        </Txt>
        <Txt>
          Bu cihazdaki tek oyunculu geçmiş, XP, rozetler, avatar ve ayarlar
          korunur. Profil adı Oyuncu olarak sıfırlanır; hesabına ait çevrimiçi
          bekleyen yanıt/davet kayıtları ve oturum temizlenir. Başka
          cihazlardaki yerel kayıtları bu işlem silemez.
        </Txt>
        {available === null ? (
          <Txt>Servis durumu kontrol ediliyor…</Txt>
        ) : !available ? (
          <Txt accessibilityRole="alert">
            Hesap silme servisi henüz etkin değil. Sunucu güncellemesi
            bekleniyor; hesabında işlem yapılmadı.
          </Txt>
        ) : null}
        {serverDeleted ? (
          <>
            <Txt accessibilityRole="alert">
              Sunucu hesabın silindi. Bu cihazdaki oturum temizliği
              tamamlanmadan çıkış başarılı sayılmayacak.
            </Txt>
            <Button
              title="Cihaz oturumunu temizlemeyi yeniden dene"
              disabled={busy}
              onPress={() => {
                setPendingAction("cleanup");
                void finishLocal(serverDeleted)
                  .catch((e) =>
                    setMessage(
                      e instanceof Error
                        ? e.message
                        : "Yerel temizlik tamamlanamadı.",
                    ),
                  )
                  .finally(() => setPendingAction(null));
              }}
            />
          </>
        ) : !actor ? (
          <Button
            title="Hesabımla giriş yap"
            onPress={() =>
              router.push({
                pathname: "/online",
                params: { returnTo: "account-delete" },
              })
            }
          />
        ) : (
          <Button
            title="Hesabımı silme adımlarını aç"
            icon="trash-2"
            disabled={!available || busy}
            onPress={() => {
              setPassword("");
              setConfirmation("");
              setMessage("");
              setStage(1);
            }}
          />
        )}
        <Txt size={12}>
          Anla & Ezberle hesabını bu web sayfasından, uygulamayı kurmadan
          silebilirsin. Silme talebinin durumu işlem sırasında ve sunucu
          yanıtından sonra gösterilir.
        </Txt>
        <Button
          title="Destek üzerinden silme talebi"
          variant="outline"
          onPress={() =>
            void Linking.openURL(
              "mailto:kovynelstudio@gmail.com?subject=Anla%20%26%20Ezberle%20hesap%20silme%20talebi",
            ).catch(() =>
              setMessage(
                "E-posta uygulaması açılamadı. kovynelstudio@gmail.com adresine yazabilirsin; parola veya kod gönderme.",
              ),
            )
          }
        />
        <Button
          title="Gizlilik bilgisini oku"
          variant="outline"
          onPress={() => router.push("/privacy")}
        />
        {!!message && <Txt accessibilityRole="alert">{message}</Txt>}
      </Card>
      <Dialog
        scrollable
        visible={stage === 1}
        title="Kalıcı hesap silme"
        onClose={() => !busy && setStage(0)}
      >
        <Txt>
          Çevrimiçi hesabın ve sana ait sunucu verileri kalıcı silinir. Yerel
          tek oyunculu kayıtların korunur. Bu işlemi geri alamazsın.
        </Txt>
        <Button title="Vazgeç" variant="outline" onPress={() => setStage(0)} />
        <Button title="Anladım, ikinci onaya geç" onPress={() => setStage(2)} />
      </Dialog>
      <Dialog
        scrollable
        visible={stage === 2}
        title="Son onay ve kimlik doğrulama"
        onClose={() => {
          if (!busy) {
            setStage(0);
            setPassword("");
            setConfirmation("");
          }
        }}
      >
        <Txt>
          {useGoogleCode
            ? "E-postana gönderilen tek kullanımlık kodu gir ve SİL yaz. Kod bu hesaba bağlıdır; beş dakika geçerlidir."
            : "Yalnız giriş yaptığın hesap silinebilir. Devam etmek için güncel parolanı gir ve SİL yaz. Dosyalar önce temizlenir; bir hata oluşursa hesabın açık kalırken bazı dosyalar silinmiş olabilir."}
        </Txt>
        {hasGoogleIdentity && (
          <Tap
            label={
              useGoogleCode
                ? "Şifrem varsa şifreyle doğrula"
                : "E-posta koduyla doğrula"
            }
            disabled={busy}
            onPress={() => {
              setUsePassword(!usePassword);
              setPassword("");
              setChallenge("");
              setMessage("");
            }}
            style={{ justifyContent: "center" }}
          >
            <Txt size={14} color={theme.accent}>
              {useGoogleCode
                ? "Şifrem varsa şifreyle doğrula"
                : "E-posta koduyla doğrula"}
            </Txt>
          </Tap>
        )}
        {useGoogleCode && (
          <Button
            title={
              pendingAction === "code"
                ? "Doğrulama kodu gönderiliyor…"
                : "Doğrulama kodu gönder"
            }
            disabled={busy}
            onPress={() => {
              if (lock.current || !actor) return;
              lock.current = true;
              setPendingAction("code");
              setMessage("");
              const requestedActor = actor;
              void onlineClient()!
                .functions.invoke("account-delete", {
                  body: { operation: "google-code" },
                })
                .then(({ data, error }) => {
                  if (currentActor.current !== requestedActor) return;
                  if (error || typeof data?.challenge !== "string")
                    throw Error(
                      "Kod gönderilemedi. Google hesap silme henüz açılmamış olabilir; biraz sonra yeniden dene.",
                    );
                  setChallenge(data.challenge);
                  setPassword("");
                  setMessage(
                    "Kod e-postana gönderildi. Beş dakika içinde kullan.",
                  );
                })
                .catch((e) => {
                  if (currentActor.current === requestedActor)
                    setMessage(
                      e instanceof Error ? e.message : "Kod gönderilemedi.",
                    );
                })
                .finally(() => {
                  lock.current = false;
                  setPendingAction(null);
                });
            }}
          />
        )}
        <TextInput
          accessibilityLabel={
            useGoogleCode
              ? "Hesap silme doğrulama kodu"
              : "Hesap silme için güncel parola"
          }
          secureTextEntry={!useGoogleCode}
          keyboardType={useGoogleCode ? "number-pad" : "default"}
          autoComplete={useGoogleCode ? "one-time-code" : "current-password"}
          value={password}
          onChangeText={setPassword}
          editable={!busy}
          maxLength={useGoogleCode ? 8 : 256}
          style={{
            minHeight: 48,
            borderWidth: 1,
            borderColor: theme.border,
            color: theme.text,
            padding: 12,
            borderRadius: 12,
          }}
        />
        <TextInput
          accessibilityLabel="Silme onayı, SİL yaz"
          autoCapitalize="characters"
          value={confirmation}
          onChangeText={setConfirmation}
          editable={!busy}
          maxLength={3}
          style={{
            minHeight: 48,
            borderWidth: 1,
            borderColor: theme.border,
            color: theme.text,
            padding: 12,
            borderRadius: 12,
          }}
        />
        <Button
          title="Vazgeç"
          variant="outline"
          disabled={busy}
          onPress={() => {
            setPassword("");
            setConfirmation("");
            setStage(0);
          }}
        />
        <Button
          title={
            pendingAction === "delete"
              ? "Sunucudan silme onayı bekleniyor…"
              : "Hesabımı kalıcı olarak sil"
          }
          disabled={
            busy ||
            confirmation !== "SİL" ||
            !password ||
            (useGoogleCode && (!challenge || !/^\d{8}$/.test(password)))
          }
          onPress={() => void erase()}
        />
        {!!message && <Txt accessibilityRole="alert">{message}</Txt>}
      </Dialog>
    </Page>
  );
}
