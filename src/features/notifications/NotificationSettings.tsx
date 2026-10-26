import React, { useState } from "react";
import { Linking, Switch, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Dialog, Icon, IconName, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useOnlineAuth } from "../online/OnlineProvider";
import { usePush } from "./PushProvider";
import { effectivePush, PushKind } from "./model";
import { nativePushSupported } from "./device";
const kinds: {
  key: PushKind;
  title: string;
  description: string;
  icon: IconName;
}[] = [
  {
    key: "friends",
    title: "Arkadaşlık İstekleri",
    description: "Yeni arkadaşlık isteği geldiğinde haber al.",
    icon: "user-plus",
  },
  {
    key: "invites",
    title: "Oyun Davetleri",
    description: "Arkadaşların seni yarışmaya davet ettiğinde haber al.",
    icon: "send",
  },
  {
    key: "results",
    title: "Maç Sonuçları",
    description: "Çevrimiçi yarışmanın sonucu hazır olduğunda haber al.",
    icon: "award",
  },
  {
    key: "rooms",
    title: "Oda Bildirimleri",
    description: "Katıldığın odada oyun başladığında haber al.",
    icon: "users",
  },
];
export function NotificationSettings() {
  const { session } = useOnlineAuth(),
    push = usePush(),
    t = useTheme(),
    [explain, setExplain] = useState(false),
    [systemError, setSystemError] = useState("");
  const effective =
    effectivePush(push.preferences, push.permission, push.available) &&
    push.registered;
  const row = (
    title: string,
    description: string,
    icon: IconName,
    value: boolean,
    disabled: boolean,
    change: (v: boolean) => void,
  ) => (
    <View
      key={title}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: t.border,
      }}
    >
      <Icon name={icon} size={19} color={t.accent} />
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <Txt weight="bold" size={14}>
          {title}
        </Txt>
        <Txt size={12} color={t.muted}>
          {description}
        </Txt>
      </View>
      <Switch
        accessibilityLabel={title}
        accessibilityHint={description}
        disabled={disabled}
        value={value}
        onValueChange={change}
        trackColor={{ false: t.border, true: disabled ? t.border : t.accent }}
      />
    </View>
  );
  return (
    <>
      <Card style={{ gap: 4 }}>
        {row(
          "Push Bildirimleri",
          "Telefonuna gelen sosyal oyun bildirimlerini yönet.",
          "bell",
          effective,
          !session ||
            !push.ready ||
            push.busy ||
            !nativePushSupported ||
            !push.available,
          (v) => {
            if (v) setExplain(true);
            else void push.save({ enabled: false });
          },
        )}
        {kinds.map((k) =>
          row(
            k.title,
            k.description,
            k.icon,
            push.preferences[k.key],
            !session || !push.ready || push.busy || !effective,
            (v) => void push.save({ [k.key]: v }),
          ),
        )}
      </Card>
      <Txt size={12} color={t.muted}>
        Ana anahtar kapandığında alt tercihlerin korunur. Uygulama içi gelen
        bildirimler bu ayardan bağımsızdır.
      </Txt>
      {!session && (
        <>
          <Txt>
            Sosyal bildirimler için doğrulanmış hesabınla giriş yap. Misafir
            oyun kayıtların korunur.
          </Txt>
          <Button
            title="Hesabını Bağla"
            onPress={() => router.push("/online")}
          />
        </>
      )}
      {!nativePushSupported && (
        <Txt size={13} color={t.muted}>
          Telefon push bildirimi bu ortamda kullanılamaz. Desteklenen fiziksel
          Android veya iPhone uygulama derlemesi gerekir; web ve Expo Go bu
          akışa dahil değildir.
        </Txt>
      )}
      {session && push.ready && !push.available && (
        <Txt size={13} color={t.muted}>
          Push gönderimi henüz bu sunucuda etkinleştirilmedi. Sistem izni
          istenmedi.
        </Txt>
      )}
      {push.permission === "denied" && (
        <>
          <Txt>
            Telefonun bildirim izni kapalı. İzin verdiğinde tekrar buradan
            açabilirsin.
          </Txt>
          <Button
            title="Telefon Bildirim Ayarlarını Aç"
            variant="outline"
            onPress={() =>
              void Linking.openSettings().catch(() =>
                setSystemError(
                  "Telefon Ayarları → Uygulamalar → Anla & Ezberle → Bildirimler yolundan izin verebilirsin.",
                ),
              )
            }
          />
        </>
      )}
      {!!push.error && (
        <Txt accessibilityRole="alert" color={t.danger}>
          {push.error}
        </Txt>
      )}
      {!!push.notice && <Txt accessibilityRole="alert">{push.notice}</Txt>}
      {!!systemError && <Txt accessibilityRole="alert">{systemError}</Txt>}
      {!!session && (
        <Button
          title="Durumu Yenile"
          variant="outline"
          disabled={push.busy}
          onPress={() => void push.refresh()}
        />
      )}
      <Dialog
        visible={explain}
        title="Bildirimlere izin ver"
        onClose={() => setExplain(false)}
      >
        <Txt>
          Arkadaşlık istekleri ve oyun gelişmeleri için telefon bildirimi
          alabilirsin. Bir sonraki adımda sistem izni sorulur. İstediğin zaman
          buradan kapatabilirsin.
        </Txt>
        <Button
          title="Devam Et"
          onPress={() => {
            setExplain(false);
            void push.save({ enabled: true }, true);
          }}
        />
        <Button
          title="Vazgeç"
          variant="outline"
          onPress={() => setExplain(false)}
        />
      </Dialog>
    </>
  );
}
