import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";
import { router } from "expo-router";
import { Button, Card, Dialog, Page, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useOnlineAuth } from "./OnlineProvider";
import { onlineClient } from "./client";
export function AccountDeletionScreen() {
  const auth = useOnlineAuth();
  const [deleted, setDeleted] = useState(false);
  if (deleted)
    return (
      <Page title="Hesabın Silindi">
        <Card style={{ gap: 14 }}>
          <Txt>
            Sunucu hesabın ve ilişkili kişisel verilerin silindi. Bu cihazdaki
            tek oyunculu kayıtların ve ayarların korundu.
          </Txt>
          <Button title="Ana sayfaya dön" onPress={() => router.replace("/")} />
        </Card>
      </Page>
    );
  return (
    <AccountDeletionForm
      key={auth.session?.user.id ?? "guest"}
      onDeleted={() => setDeleted(true)}
    />
  );
}
function AccountDeletionForm({ onDeleted }: { onDeleted: () => void }) {
  const auth = useOnlineAuth(),
    theme = useTheme();
  const [stage, setStage] = useState<0 | 1 | 2>(0),
    [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const actor = auth.session?.user.id,
    currentActor = useRef(actor),
    lock = useRef(false);
  useEffect(() => {
    let alive = true;
    currentActor.current = actor;
    const client = onlineClient();
    if (client)
      void client.rpc("online_service_capabilities").then(({ data }) => {
        if (alive) setAvailable(data?.accountDeletionEnabled === true);
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
    setBusy(true);
    setMessage("");
    try {
      const { data: sessionData } = await client.auth.getSession();
      if (sessionData.session?.user.id !== deletingActor)
        throw Error("Oturum değişti. Yeniden giriş yap.");
      const { data, error } = await client.functions.invoke("account-delete", {
        body: { confirmation: "DELETE", password },
      });
      if (error || data?.deleted !== true)
        throw Error(
          "Silme tamamlandığı doğrulanamadı. Şifreni ve bağlantını kontrol et. Sunucu onayı olmadan hesabın silindi sayılmaz.",
        );
      if (currentActor.current !== deletingActor) return;
      setPassword("");
      setConfirmation("");
      setStage(0);
      // Auth account/related rows are already atomically removed. Local solo
      // history/preferences intentionally remain; never clear all AsyncStorage.
      onDeleted();
      await client.auth.signOut({ scope: "local" });
      setMessage(
        "Sunucu hesabın ve ilişkili kişisel oyun verilerin silindi. Bu cihazdaki tek oyunculu geçmişin, XP, rozetler ve görünüm tercihlerin korundu.",
      );
    } catch (e) {
      if (currentActor.current === deletingActor)
        setMessage(e instanceof Error ? e.message : "Silme doğrulanamadı.");
    } finally {
      setPassword("");
      lock.current = false;
      setBusy(false);
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
          Bu cihazdaki tek oyunculu geçmiş, XP, rozetler, avatar ve ayarlar ayrı
          yerel kayıtlardır; bu işlem onları silmez. Başka cihazlardaki yerel
          kayıtları da silemez.
        </Txt>
        {available === null ? (
          <Txt>Servis durumu kontrol ediliyor…</Txt>
        ) : !available ? (
          <Txt accessibilityRole="alert">
            Hesap silme servisi henüz etkin değil. Sunucu güncellemesi
            bekleniyor; hesabında işlem yapılmadı.
          </Txt>
        ) : null}
        {!actor ? (
          <Button
            title="Hesabımla giriş yap"
            onPress={() => router.push("/online")}
          />
        ) : (
          <Button
            title="Hesabımı silme adımlarını aç"
            icon="trash-2"
            disabled={!available || busy}
            onPress={() => setStage(1)}
          />
        )}
        <Button
          title="Gizlilik bilgisini oku"
          variant="outline"
          onPress={() => router.push("/privacy")}
        />
        {!!message && <Txt accessibilityRole="alert">{message}</Txt>}
      </Card>
      <Dialog
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
        visible={stage === 2}
        title="Son onay ve kimlik doğrulama"
        onClose={() => {
          if (!busy) {
            setStage(0);
            setPassword("");
          }
        }}
      >
        <Txt>
          Yalnız giriş yaptığın hesap silinebilir. Devam etmek için güncel
          parolanı gir ve SİL yaz.
        </Txt>
        <TextInput
          accessibilityLabel="Hesap silme için güncel parola"
          secureTextEntry
          autoComplete="current-password"
          value={password}
          onChangeText={setPassword}
          editable={!busy}
          maxLength={256}
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
            setStage(0);
          }}
        />
        <Button
          title={
            busy
              ? "Sunucudan silme onayı bekleniyor…"
              : "Hesabımı kalıcı olarak sil"
          }
          disabled={busy || confirmation !== "SİL" || !password}
          onPress={() => void erase()}
        />
        {!!message && <Txt accessibilityRole="alert">{message}</Txt>}
      </Dialog>
    </Page>
  );
}
