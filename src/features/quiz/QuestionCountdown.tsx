import React, { useEffect, useRef, useState } from "react";
import { AppState, Platform, View } from "react-native";
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import {
  QuestionClock,
  QUESTION_LIMIT_MS,
} from "../../domain/game/question-clock";
import { Txt, useReducedMotion } from "../../components/ui";
import { colors as c, useTheme } from "../../theme/tokens";
import { useSound } from "../audio/SoundProvider";
// This leaf alone ticks; no second-by-second state travels into GameProvider.
export function QuestionCountdown({
  clock,
  stopped,
  onExpire,
}: {
  clock: QuestionClock;
  stopped: boolean;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(() => clock.remaining());
  const last = useRef(10),
    { play } = useSound();
  const theme = useTheme(),
    reduced = useReducedMotion();
  useEffect(() => {
    if (stopped) return;
    const update = () => {
      const ms = clock.remaining();
      const active =
        AppState.currentState === "active" &&
        (Platform.OS !== "web" || document.visibilityState !== "hidden");
      if (!ms) {
        setRemaining(0);
        onExpire();
        return;
      }
      if (!active) return;
      setRemaining(ms);
      const second = Math.ceil(ms / 1000);
      // One quiet tick, never replay missed background seconds or compete with feedback.
      if (second !== last.current) {
        last.current = second;
        play("tick");
      }
    };
    update();
    const timer = setInterval(update, reduced ? 250 : 100);
    const listener = AppState.addEventListener("change", update);
    return () => {
      clearInterval(timer);
      listener.remove();
    };
  }, [clock, stopped, play, reduced, onExpire]);
  const seconds = Math.ceil(remaining / 1000),
    fraction = remaining / QUESTION_LIMIT_MS;
  return (
    <View
      accessible
      accessibilityLabel={
        stopped ? "Sayaç durdu" : `Kalan süre ${seconds} saniye`
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: theme.goldSurface,
        borderWidth: 1,
        borderColor: !stopped && seconds <= 3 ? c.coral : theme.goldBorder,
      }}
    >
      <Svg width={23} height={34} viewBox="0 0 32 44" accessible={false}>
        <Defs>
          <LinearGradient id="sand" x1="0" y1="0" x2="1" y2="1">
            <Stop stopColor="#FFE39B" />
            <Stop offset="1" stopColor="#CB8414" />
          </LinearGradient>
        </Defs>
        <Path
          d="M8 5 C8 14 10 17 16 22 C22 17 24 14 24 5 Z M16 22 C10 27 8 30 8 39 L24 39 C24 30 22 27 16 22Z"
          fill={theme.dark ? "#005F65" : "#FFF8EE"}
          stroke={c.darkGold}
          strokeWidth="1.6"
        />
        <Path
          d={`M10 ${7 + (1 - fraction) * 11} L22 ${7 + (1 - fraction) * 11} Q21 17 16 20 Q11 17 10 ${7 + (1 - fraction) * 11}`}
          fill="url(#sand)"
        />
        <Path
          d={`M10 37 L22 37 L16 ${37 - (1 - fraction) * 11}Z`}
          fill="url(#sand)"
        />
        {!stopped && seconds > 0 && (
          <Path d="M16 22V33" stroke={c.gold} strokeWidth="1" />
        )}
        <Rect x="4" y="1" width="24" height="4" rx="2" fill="url(#sand)" />
        <Rect x="4" y="39" width="24" height="4" rx="2" fill="url(#sand)" />
      </Svg>
      <View>
        <Txt size={10} color={theme.muted}>
          {stopped ? "KİLİTLENDİ" : "KALAN SÜRE"}
        </Txt>
        <Txt size={17} weight="heavy" color={theme.text}>
          {seconds} sn
        </Txt>
      </View>
    </View>
  );
}
