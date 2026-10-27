import React, { useState } from "react";
import { Linking, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Avatar, Medal, Pattern } from "../../components/game/Artwork";
import {
  Button,
  Card,
  Chip,
  Dialog,
  Icon,
  IconButton,
  IconName,
  Page,
  s,
  Txt,
} from "../../components/ui";
import { gameQuestion } from "../../content/questions/registry";
import { CONTENT_CHANNEL } from "../../content/questions";
import { demoPlayers, Role, terminal } from "../../domain/duel/machine";
import { stats } from "../../domain/game/engine";
import { useDuel } from "../../storage/DuelProvider";
import { colors as c, gradients, radius, useTheme } from "../../theme/tokens";

export function DuelScreen() {
  const { match, ready, error, create, act, retry } = useDuel();
  const theme = useTheme();
  const [cancel, setCancel] = useState(false);
  const [review, setReview] = useState(false);
  const [sourceError, setSourceError] = useState(false);
  const state = match?.state;
  const title =
    state === "completed"
      ? "Düello tamamlandı!"
      : state === "waiting_for_result"
        ? match?.players.b.result
          ? "Skorlar hazır!"
          : "Rakibin bekleniyor"
        : state === "created"
          ? "Demo maçın hazır"
          : state === "waiting_for_opponent"
            ? "Demo davetin hazır"
            : state === "cancelled"
              ? "Maç iptal edildi"
              : state === "expired"
                ? "Maçın süresi doldu"
                : "Arkadaşına meydan oku";
  const start = (role: Role) => {
    if (
      act({
        type: "start",
        playerId: demoPlayers[role].id,
      })
    )
      router.push("/duel/play");
  };
  const demo = CONTENT_CHANNEL === "prototype";
  return (
    <Page
      title={title}
      subtitle="Aynı cihazda iki oyuncu, ortak bir keşif."
      right={
        <IconButton
          name="home"
          label="Ana sayfa"
          onPress={() => router.replace("/")}
        />
      }
    >
      <View style={{ gap: 18 }}>
        <Card style={{ gap: 10 }}>
          <Txt weight="heavy">Ayrı cihazda bir arkadaşınla oyna</Txt>
          <Txt size={12}>
            Kapalı çevrimiçi test yalnızca sentetik sorular içerir. Aşağıdaki
            yerel demo aynı cihazda çalışır.
          </Txt>
          <Button
            title="Çevrimiçi düello · Kapalı test"
            variant="blue"
            icon="wifi"
            onPress={() => router.push("/online")}
          />
        </Card>
        <Chip icon="tool">Yerel Demo · Çevrimiçi bağlantı yok</Chip>
        <LinearGradient
          colors={state === "completed" ? gradients.reward : gradients.hero}
          style={{
            borderRadius: radius.card,
            padding: 22,
            overflow: "hidden",
            gap: 18,
          }}
        >
          <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
            <Pattern opacity={0.08} />
          </View>
          {state === "completed" ? (
            <View style={{ alignItems: "center", gap: 8 }}>
              <Medal size={122} />
              <Txt
                size={27}
                weight="heavy"
                color={c.gold}
                style={{ textAlign: "center" }}
              >
                {match?.outcome?.winner === "tie"
                  ? "Berabere!"
                  : `${match?.outcome?.winner === "a" ? "Oyuncu A" : "Oyuncu B"} kazandı!`}
              </Txt>
              <Txt color={c.white} style={{ textAlign: "center" }}>
                Bilgi paylaştıkça çoğalır. Yeni bir tura hazır mısınız?
              </Txt>
            </View>
          ) : (
            <>
              <View style={[s.row, { justifyContent: "space-around" }]}>
                <View style={{ alignItems: "center", gap: 8 }}>
                  <Avatar size={62} variant={1} />
                  <Txt color={c.white} weight="bold">
                    Oyuncu A
                  </Txt>
                </View>
                <Txt color={c.gold} size={27} weight="heavy">
                  VS
                </Txt>
                <View style={{ alignItems: "center", gap: 8 }}>
                  <Avatar size={62} variant={2} />
                  <Txt color={c.white} weight="bold">
                    Oyuncu B
                  </Txt>
                </View>
              </View>
              <Txt
                color={c.white}
                weight="heavy"
                size={23}
                style={{ textAlign: "center" }}
              >
                10 soru. İki oyuncu. Tek düello.
              </Txt>
              <Txt
                color={c.tealLight}
                size={13}
                style={{ textAlign: "center" }}
              >
                Gerçek arkadaş daveti gönderilmez. İki demo rolünü de bu cihazda
                sen oynarsın.
              </Txt>
            </>
          )}
        </LinearGradient>
        {error && (
          <Card style={{ gap: 12 }}>
            <Txt accessibilityRole="alert" color={c.danger}>
              {error}
            </Txt>
            <Button
              title="Demo kaydını yeniden dene"
              variant="outline"
              onPress={() => void retry()}
            />
          </Card>
        )}
        {!demo ? (
          <Card>
            <Txt>
              Bu demo yalnızca geliştirme prototipinde açıktır. Gerçek çevrimiçi
              maçlar henüz kullanılamıyor.
            </Txt>
          </Card>
        ) : !ready ? (
          <Txt>Demo kaydı okunuyor…</Txt>
        ) : (
          <>
            {!match && (
              <>
                <Card style={{ gap: 13 }}>
                  <Txt size={20} weight="heavy">
                    Düello nasıl oynanır?
                  </Txt>
                  {[
                    [
                      "book-open",
                      "İki oyuncuya aynı 10 soru ve aynı seçenek sırası.",
                    ],
                    [
                      "star",
                      "Her doğru 100 puan; yanlış 0. En yüksek skor 1.000.",
                    ],
                    [
                      "users",
                      "Önce A oynar, sonra bu cihazda B’nin turuna geçilir.",
                    ],
                    [
                      "flag",
                      "Eşit puan beraberliktir. Süre kazananı değiştirmez.",
                    ],
                  ].map(([icon, text]) => (
                    <View
                      key={text}
                      style={[s.row, { alignItems: "flex-start" }]}
                    >
                      <Icon name={icon as IconName} color={c.teal} />
                      <Txt style={{ flex: 1 }}>{text}</Txt>
                    </View>
                  ))}
                </Card>
                <Button
                  title="Demo Maç Oluştur"
                  icon="zap"
                  variant="orange"
                  onPress={() => {
                    setReview(false);
                    setSourceError(false);
                    create();
                  }}
                />
              </>
            )}
            {match && (
              <>
                {(state === "created" || state === "waiting_for_opponent") && (
                  <Card style={{ gap: 14 }}>
                    <View style={s.row}>
                      <Icon name="mail" color={c.deepBlue} />
                      <Txt size={20} weight="heavy">
                        Yalnızca bu cihazda geçerli
                      </Txt>
                    </View>
                    <Txt>
                      Oyuncu A ve B aynı soru setinde yarışacak. Sonuçlar tek
                      oyunculu puan, XP veya rozetlerine eklenmez.
                    </Txt>
                    {state === "created" ? (
                      <Button
                        title="Demo Daveti Oluştur"
                        icon="mail"
                        variant="blue"
                        onPress={() => act({ type: "invite" })}
                      />
                    ) : (
                      <>
                        <View
                          style={{
                            padding: 16,
                            borderRadius: 16,
                            backgroundColor: c.paleGold,
                            gap: 6,
                          }}
                        >
                          <Txt color={c.darkGold} weight="bold">
                            DEMO DAVET KODU
                          </Txt>
                          <Txt
                            color={c.navy}
                            weight="heavy"
                            size={23}
                            selectable
                          >{`DEMO-${match.id.slice(-8).toUpperCase()}`}</Txt>
                        </View>
                        <Txt color={theme.muted}>
                          Bu bir internet bağlantısı değildir; başka cihazda
                          kullanılamaz ve kimseye gönderilmez. Demo maç 24 saat
                          içinde tamamlanabilir.
                        </Txt>
                        <Button
                          title="Oyuncu A Olarak Başla"
                          icon="play"
                          variant="orange"
                          onPress={() => start("a")}
                        />
                      </>
                    )}
                  </Card>
                )}
                {state === "in_progress" && (
                  <Card style={{ gap: 14 }}>
                    <Txt size={21} weight="heavy">
                      {match.activeRole === "a" ? "Oyuncu A" : "Oyuncu B"}{" "}
                      turuna devam et
                    </Txt>
                    <Txt>
                      {match.players[match.activeRole!].session?.answers.length}
                      /10 yanıt kaydedildi. Seçilen yanıtlar değiştirilemez.
                    </Txt>
                    <Button
                      title="Demo Turuna Devam Et"
                      icon="play"
                      onPress={() => router.push("/duel/play")}
                    />
                  </Card>
                )}
                {(state === "waiting_for_result" || state === "completed") && (
                  <>
                    <View style={{ gap: 12 }}>
                      {(["a", "b"] as Role[]).map((role) => {
                        const p = match.players[role],
                          summary = p.result ? stats(p.result) : undefined;
                        return (
                          <Card
                            key={role}
                            style={{
                              gap: 9,
                              borderColor: role === "a" ? c.teal : c.blue,
                            }}
                          >
                            <View
                              style={[
                                s.row,
                                { justifyContent: "space-between" },
                              ]}
                            >
                              <View style={[s.row, { flexShrink: 1 }]}>
                                <Avatar
                                  variant={role === "a" ? 1 : 2}
                                  size={40}
                                />
                                <Txt
                                  weight="heavy"
                                  size={18}
                                  style={{ flexShrink: 1 }}
                                >
                                  {p.name}
                                </Txt>
                              </View>
                              <Icon
                                name={summary ? "check-circle" : "clock"}
                                color={summary ? c.emerald : c.deepBlue}
                              />
                            </View>
                            <Txt
                              size={32}
                              weight="heavy"
                              color={theme.dark ? c.gold : c.teal}
                            >
                              {summary
                                ? `${summary.score} puan`
                                : "Tur bekleniyor"}
                            </Txt>
                            <Txt color={theme.muted}>
                              {summary
                                ? `${summary.correct} doğru · ${summary.wrong} yanlış`
                                : "Oyuncu B henüz yanıtlamadı."}
                            </Txt>
                          </Card>
                        );
                      })}
                    </View>
                    {state === "waiting_for_result" &&
                      (match.players.b.result ? (
                        <Button
                          title="Maç Sonucunu Gör"
                          icon="award"
                          onPress={() => act({ type: "resolve" })}
                        />
                      ) : (
                        <>
                          <Card style={{ gap: 9, backgroundColor: c.paleGold }}>
                            <Txt color={c.darkGold} weight="heavy">
                              Oyuncu A turunu bitirdi.
                            </Txt>
                            <Txt color={c.ink}>
                              Demo Oyuncu B’nin turu bekleniyor. Şimdi aynı
                              cihazda B rolüne geçebilirsin; gerçek bir rakibe
                              bildirim gitmedi.
                            </Txt>
                          </Card>
                          <Button
                            title="Demo Oyuncu B’ye Geç"
                            icon="users"
                            variant="blue"
                            onPress={() => start("b")}
                          />
                        </>
                      ))}
                  </>
                )}
                {(state === "expired" || state === "cancelled") && (
                  <Card>
                    <Txt>
                      {state === "expired"
                        ? "Bu yerel demo maçın 24 saatlik süresi doldu. Yarım kalan maç için kazanan belirlenmez."
                        : "Demo maç kapatıldı. Yarım kalan maç için kazanan belirlenmez."}{" "}
                      Tek oyunculu kayıtların korunuyor.
                    </Txt>
                  </Card>
                )}
                {state === "completed" && (
                  <>
                    <Button
                      title={
                        review ? "Yanıtları Gizle" : "Yanıtları Birlikte İncele"
                      }
                      icon="book-open"
                      variant="outline"
                      onPress={() => setReview(!review)}
                    />
                    {sourceError && (
                      <Txt accessibilityRole="alert" color={c.danger}>
                        Kaynak açılamadı. İnternet bağlantını kontrol
                        edebilirsin.
                      </Txt>
                    )}
                    {review &&
                      match.manifest.questionIds.map((id, i) => {
                        const q = gameQuestion(match.players.a.result!, id)!;
                        return (
                          <Card key={id} style={{ gap: 10 }}>
                            <Txt weight="heavy" size={18}>
                              {i + 1}. {q.text}
                            </Txt>
                            <Txt>
                              Oyuncu A:{" "}
                              {
                                q.options[
                                  match.players.a.result!.answers[i]!.option
                                ]
                              }
                            </Txt>
                            <Txt>
                              Oyuncu B:{" "}
                              {
                                q.options[
                                  match.players.b.result!.answers[i]!.option
                                ]
                              }
                            </Txt>
                            <Txt
                              weight="bold"
                              color={theme.dark ? c.tealLight : c.successInk}
                            >
                              Doğru yanıt: {q.options[q.correct]}
                            </Txt>
                            <Txt>{q.explanation}</Txt>
                            <Button
                              title={q.source.title}
                              icon="external-link"
                              variant="outline"
                              onPress={() =>
                                void Linking.openURL(q.source.url).catch(() =>
                                  setSourceError(true),
                                )
                              }
                            />
                          </Card>
                        );
                      })}
                  </>
                )}
                {terminal(match.state) && (
                  <Button
                    title={
                      state === "completed"
                        ? "Tekrar Demo Maç Yap"
                        : "Yeni Demo Maç Oluştur"
                    }
                    icon="rotate-cw"
                    variant="orange"
                    onPress={() => {
                      setReview(false);
                      create();
                    }}
                  />
                )}
                {!terminal(match.state) && (
                  <Button
                    title="Demo Maçı İptal Et"
                    icon="x"
                    variant="outline"
                    onPress={() => setCancel(true)}
                  />
                )}
              </>
            )}
          </>
        )}
        <Txt color={theme.muted} size={12}>
          Demo ilerlemesi bu cihazda ayrı tutulur. Yeni demo oluşturunca önceki demo değiştirilir;
          tek oyunculu geçmişin korunur.
        </Txt>
      </View>
      <Dialog
        visible={cancel}
        title="Demo maç iptal edilsin mi?"
        onClose={() => setCancel(false)}
      >
        <Txt>
          Bu maç kapanır ve kalan tur oynanamaz. Tek oyunculu puanların
          etkilenmez.
        </Txt>
        <Button title="Maça devam et" onPress={() => setCancel(false)} />
        <Button
          title="Evet, demo maçı iptal et"
          variant="outline"
          onPress={() => {
            act({ type: "cancel" });
            setCancel(false);
          }}
        />
      </Dialog>
    </Page>
  );
}
