import { useSound } from "../audio/SoundProvider";
import { useAudioObservation } from "../audio/useAudioObservation";
import { quizAudioCues } from "../audio/events";
import { brand } from "../../branding/identity";
import { QuestionCountdown } from "./QuestionCountdown";
import React, {
  ComponentRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AccessibilityInfo,
  AppState,
  Platform,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, usePreventRemove } from "expo-router";
import { CardCorners, Pattern } from "../../components/game/Artwork";
import {
  Button,
  Card,
  Chip,
  Dialog,
  Icon,
  IconButton,
  s,
  Tap,
  Txt,
  useReducedMotion,
} from "../../components/ui";
import { gameQuestion } from "../../content/questions/registry";
import { useDuel } from "../../storage/DuelProvider";
import { useGame } from "../../storage/GameProvider";
import {
  colors as c,
  gradients,
  radius,
  shadows,
  space,
  useTheme,
} from "../../theme/tokens";

export function QuizScreen({ demo = false }: { demo?: boolean } = {}) {
  const { play } = useSound();
  const solo = useGame();
  const duel = useDuel();
  const role = duel.match?.activeRole;
  const player = role ? duel.match?.players[role] : undefined;
  const session = demo
    ? duel.match?.state === "in_progress"
      ? (player?.session ?? null)
      : null
    : solo.session;
  const command = (type: "answer" | "next" | "finish", option?: number) => {
    if (!player) return false;
    return type === "answer"
      ? duel.act({
          type,
          playerId: player.id,
          option: option!,
        })
      : duel.act({ type, playerId: player.id });
  };
  const answer = (option: number) =>
    demo ? command("answer", option) : solo.answer(option);
  const next = () => (demo ? command("next") : solo.next());
  const abandon = () => (demo ? duel.act({ type: "cancel" }) : solo.abandon());
  const theme = useTheme();
  const reduced = useReducedMotion();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [leave, setLeave] = useState(false);
  const [sourceError, setSourceError] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const disablePrevention = usePreventRemove(!!session, () => setLeave(true));
  const question = useMemo(
    () =>
      session
        ? gameQuestion(session, session.questionIds[session.cursor] ?? "")
        : undefined,
    [session],
  );
  const chosen = session?.answers.find((a) => a.questionId === question?.id);
  const openQuestion = solo.openQuestion;
  useEffect(() => {
    if (
      demo ||
      !session ||
      chosen ||
      session.timingVersion !== 1 ||
      session.questionOpenedAt !== undefined
    )
      return;
    const open = () => {
      if (
        AppState.currentState === "active" &&
        (Platform.OS !== "web" || document.visibilityState !== "hidden")
      )
        openQuestion(session.id, session.cursor);
    };
    open();
    const listener = AppState.addEventListener("change", open);
    if (Platform.OS === "web")
      document.addEventListener("visibilitychange", open);
    return () => {
      listener.remove();
      if (Platform.OS === "web")
        document.removeEventListener("visibilitychange", open);
    };
  }, [demo, session, chosen, openQuestion]);
  useAudioObservation(
    session && question
      ? {
          id: `${session.id}:${demo ? role : "solo"}`,
          cursor: session.cursor,
          answer: chosen ? chosen.option === question.correct : null,
          timedOut: chosen?.timedOut === true,
          hidden: demo,
        }
      : null,
    quizAudioCues,
  );
  useEffect(() => {
    if (chosen && question)
      AccessibilityInfo.announceForAccessibility(
        demo
          ? "Yanıtın kilitlendi. Maç sonunda iki skor karşılaştırılacak."
          : `${chosen.timedOut ? "Süre doldu. Soru cevapsız." : chosen.option === question.correct ? "Doğru cevap!" : "Yanlış cevap."} Doğru yanıt: ${question.options[question.correct]}. ${question.explanation}`,
      );
  }, [chosen, question, demo]);
  if (!session || !question)
    return (
      <View style={{ padding: 24, flex: 1, justifyContent: "center", gap: 20 }}>
        <Txt size={26} weight="heavy">
          Yeni bir tura hazır mısın?
        </Txt>
        <Txt>
          {demo
            ? "Demo turu şu an açık değil. Maç ekranından devam edebilirsin."
            : "Aktif yarışma yok. Yeniden açılan uygulamada yalnızca tamamlanmış yarışmalar korunur."}
        </Txt>
        <Button
          title={demo ? "Demo maça dön" : "Ana sayfaya dön"}
          onPress={() => router.replace(demo ? "/duel" : "/")}
        />
      </View>
    );
  const goNext = async () => {
    if (!chosen || finishing) return;
    if (session.cursor === 9) {
      setFinishing(true);
      if (demo) {
        if (!command("finish")) {
          setFinishing(false);
          return;
        }
        play("completed", `demo:${session.id}:${role}:result`);
      } else await solo.finish();
      disablePrevention();
      router.replace(demo ? "/duel" : "/results");
    } else {
      next();
      setSourceError(false);
      scroll.current?.scrollTo({ y: 0, animated: !reduced });
    }
  };
  const score =
    session.answers.filter(
      (a) => gameQuestion(session, a.questionId)?.correct === a.option,
    ).length * 100;
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <LinearGradient colors={gradients.hero} style={styles.header}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Pattern opacity={0.09} />
        </View>
        <View style={s.row}>
          <IconButton
            name="chevron-left"
            label="Yarışmadan ayrıl"
            light
            onPress={() => setLeave(true)}
          />
          <Txt
            size={17}
            weight="heavy"
            color={c.white}
            style={{ flex: 1, textAlign: "center" }}
          >
            {demo
              ? `Yerel Demo · Oyuncu ${role === "a" ? "A" : "B"}`
              : brand.subtitle}
          </Txt>
          <IconButton
            name="x"
            label="Oyundan çıkış onayını aç"
            light
            onPress={() => setLeave(true)}
          />
        </View>
      </LinearGradient>
      <View
        style={[
          styles.progressDeck,
          { backgroundColor: theme.background, borderColor: theme.border },
        ]}
      >
        <View
          style={[
            s.row,
            {
              justifyContent: "space-between",
              marginBottom: space.md,
              flexWrap: "wrap",
            },
          ]}
        >
          <View>
            <Txt weight="heavy" size={18}>
              Soru {session.cursor + 1} / 10
            </Txt>
            <Txt size={10} color={theme.muted}>
              {demo
                ? "Aynı soru seti · Çevrimiçi değil"
                : "Her cevap yeni bir keşif"}
            </Txt>
          </View>
          {(demo ? duel.questionClock : solo.questionClock) ? (
            <QuestionCountdown
              key={`${session.id}:${session.cursor}`}
              clock={(demo ? duel.questionClock : solo.questionClock)!}
              stopped={!!chosen}
              onExpire={
                demo
                  ? () => {
                      if (player)
                        duel.act({ type: "timeout", playerId: player.id });
                    }
                  : solo.expire
              }
            />
          ) : (
            <Txt size={12} color={theme.muted}>
              Yerel demo
            </Txt>
          )}
        </View>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Yanıtlanan sorular"
          accessibilityValue={{ min: 0, max: 10, now: session.answers.length }}
          style={{ flexDirection: "row", gap: space.xs }}
        >
          {session.questionIds.map((id, i) => {
            const response = session.answers.find((a) => a.questionId === id);
            const fill = response
              ? demo
                ? c.gold
                : response.option === gameQuestion(session, id)?.correct
                  ? c.emerald
                  : c.coral
              : i === session.cursor
                ? c.gold
                : theme.border;
            return (
              <View
                key={id}
                style={{
                  flex: 1,
                  height: 8,
                  borderRadius: radius.pill,
                  backgroundColor: fill,
                }}
              />
            );
          })}
        </View>
      </View>
      <ScrollView
        ref={scroll}
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
      >
        <View style={styles.question}>
          <LinearGradient
            colors={[c.cream, c.white]}
            style={StyleSheet.absoluteFill}
          />
          <CardCorners />
          <Txt
            accessibilityRole="header"
            accessibilityLiveRegion="polite"
            size={19}
            weight="heavy"
            color={c.ink}
            style={{ textAlign: "center", lineHeight: 28 }}
          >
            {question.text}
          </Txt>
        </View>
        <View style={{ gap: space.sm }}>
          {question.options.map((option, i) => {
            const correct = !demo && !!chosen && i === question.correct;
            const wrong = !demo && !!chosen && chosen.option === i && !correct;
            const demoSelected = demo && chosen?.option === i;
            const background = correct
              ? c.mint
              : wrong
                ? c.dangerBg
                : theme.card;
            const border = correct
              ? c.emerald
              : wrong
                ? c.danger
                : demoSelected
                  ? c.deepBlue
                  : theme.border;
            const textColor = correct
              ? c.successInk
              : wrong
                ? c.danger
                : theme.text;
            return (
              <Tap
                key={`${question.id}-${i}`}
                label={`${"ABCD"[i]}. ${option}${chosen && !demo ? (correct ? ", doğru cevap" : wrong ? ", yanlış seçimin" : "") : ""}`}
                disabled={
                  !!chosen ||
                  (session.timingVersion === 1 &&
                    session.questionOpenedAt === undefined)
                }
                selected={chosen?.option === i}
                sound={false}
                onPress={() => answer(i)}
                style={{ opacity: 1, borderRadius: radius.md }}
              >
                <View
                  style={[
                    styles.answer,
                    {
                      backgroundColor: background,
                      borderColor: border,
                      borderWidth: correct || wrong ? 2 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.letter,
                      {
                        backgroundColor: correct
                          ? c.emerald
                          : wrong
                            ? c.danger
                            : theme.background,
                        borderColor: correct || wrong ? border : theme.border,
                      },
                    ]}
                  >
                    <Txt
                      size={14}
                      weight="heavy"
                      color={correct || wrong ? c.white : theme.muted}
                    >
                      {"ABCD"[i]}
                    </Txt>
                  </View>
                  <Txt
                    size={15}
                    weight="bold"
                    color={textColor}
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    {option}
                  </Txt>
                  {(correct || wrong) && (
                    <Icon
                      name={correct ? "check-circle" : "x-circle"}
                      color={textColor}
                      size={25}
                    />
                  )}
                </View>
              </Tap>
            );
          })}
        </View>
        {demo && duel.error && (
          <Txt accessibilityRole="alert" color={c.danger}>
            {duel.error}
          </Txt>
        )}
        {demo && chosen ? (
          <Card style={styles.explanation}>
            <Txt color={c.darkGold} weight="heavy">
              Yanıtın kilitlendi.
            </Txt>
            <Txt color={c.ink}>
              Doğru cevap ve açıklama iki tur tamamlanana kadar gösterilmez. Bu,
              aynı cihazdaki yerel demodur.
            </Txt>
          </Card>
        ) : chosen ? (
          <Card style={styles.explanation}>
            <View style={[s.row, { alignItems: "flex-start" }]}>
              <View style={styles.explanationIcon}>
                <Icon name="sun" size={24} color={c.darkGold} />
              </View>
              <View style={{ flex: 1, gap: space.xs }}>
                <Txt size={18} weight="heavy" color={c.darkGold}>
                  Açıklama
                </Txt>
                <Txt
                  size={12}
                  weight="bold"
                  color={
                    chosen.option === question.correct ? c.successInk : c.danger
                  }
                >
                  {chosen.option === question.correct
                    ? "Harika, doğru cevap!"
                    : chosen.timedOut
                      ? "Süre doldu · Cevapsız"
                      : "Birlikte öğrenelim"}
                </Txt>
              </View>
            </View>
            {chosen.option !== question.correct && (
              <Txt weight="heavy" color={c.ink}>
                Doğru yanıt: {question.options[question.correct]}
              </Txt>
            )}
            <Txt color={c.ink} size={14}>
              {question.explanation}
            </Txt>
            <Tap
              label={`Kaynağı aç: ${question.source.title}`}
              onPress={() => {
                void Linking.openURL(question.source.url).catch(() =>
                  setSourceError(true),
                );
              }}
              style={styles.source}
            >
              <View style={s.row}>
                <Icon name="book-open" size={16} color={c.teal} />
                <Txt color={c.teal} size={11} weight="bold" style={{ flex: 1 }}>
                  {question.source.title} · {question.source.locator}
                </Txt>
                <Icon name="external-link" size={15} color={c.teal} />
              </View>
            </Tap>
            {sourceError && (
              <Txt color={c.danger} size={12}>
                Kaynak açılamadı. İnternet bağlantını kontrol edebilirsin.
              </Txt>
            )}
          </Card>
        ) : (
          <Txt
            size={12}
            color={theme.muted}
            style={{ textAlign: "center", paddingTop: space.xl }}
          >
            {demo
              ? "Bir yanıt seç. Açıklamalar maç tamamlanınca açılır."
              : "Bir yanıt seç, ardından açıklamayı keşfet."}
          </Txt>
        )}
      </ScrollView>
      <View
        style={[
          styles.dock,
          { backgroundColor: theme.background, borderColor: theme.border },
        ]}
      >
        <View
          style={[
            s.row,
            {
              justifyContent: "space-between",
              marginBottom: space.xs,
              flexWrap: "wrap",
            },
          ]}
        >
          <Chip icon="star">
            {demo
              ? `${session.answers.length}/10 yanıt · Demo`
              : `${score} puan`}
          </Chip>
          <Txt size={10} color={theme.muted}>
            {demo
              ? "Yerel demo · Test içeriği"
              : question.reviewStatus === "approved"
                ? "Her soru 10 saniye"
                : "Her soru 10 saniye"}
          </Txt>
        </View>
        <Button
          title={
            finishing
              ? "Sonuç kaydediliyor…"
              : session.cursor === 9
                ? demo
                  ? "Turumu Bitir"
                  : "Sonucumu Gör"
                : "Sonraki Soru"
          }
          trailing="chevron-right"
          onPress={() => void goNext()}
          disabled={!chosen || finishing}
        />
      </View>
      <Dialog
        visible={leave}
        title="Turdan ayrılmak istiyor musun?"
        onClose={() => setLeave(false)}
      >
        <Txt>
          {demo
            ? "Ayrılırsan demo maç iptal edilir. Tek oyunculu kayıtların etkilenmez."
            : "Bu tur henüz tamamlanmadı. Ayrılırsan bu turdaki yanıtlar ve puanlar kaydedilmez."}
        </Txt>
        <Button title="Oyuna devam et" onPress={() => setLeave(false)} />
        <Button
          title="Turdan ayrıl"
          variant="outline"
          onPress={() => {
            abandon();
            disablePrevention();
            setLeave(false);
            router.replace(demo ? "/duel" : "/");
          }}
        />
      </Dialog>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: 25,
  },
  progressDeck: {
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.lg,
    marginTop: -14,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderBottomWidth: 1,
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: c.paleGold,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  content: { padding: space.lg, paddingBottom: space.xl },
  question: {
    minHeight: 100,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: c.creamBorder,
    padding: space.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.lg,
    overflow: "hidden",
    boxShadow: shadows.card,
  },
  category: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: space.md,
    gap: space.sm,
  },
  answer: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    minHeight: 48,
    padding: 10,
    borderRadius: radius.md,
    boxShadow: shadows.answer,
  },
  letter: {
    width: 30,
    minHeight: 30,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    flexShrink: 0,
  },
  explanation: {
    marginTop: space.xl,
    backgroundColor: c.paleGold,
    borderColor: c.creamBorder,
    gap: space.md,
    padding: space.lg,
  },
  explanationIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: c.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  source: {
    minHeight: 44,
    justifyContent: "center",
    backgroundColor: c.cream,
    borderRadius: radius.sm,
    padding: space.md,
    borderWidth: 1,
    borderColor: c.creamBorder,
  },
  dock: {
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    paddingBottom: space.md,
    borderTopWidth: 1,
    boxShadow: shadows.dock,
  },
});
