import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Icon, IconName } from "../components/Icons";
import { WordLine } from "../components/Kinetic";
import { SceneShell } from "../components/SceneShell";
import { SceneVoice, Sfx } from "../components/Sound";
import { cue, getScene } from "../lib/timeline";
import { colors, fonts, springs } from "../theme";

const scene = getScene("S2-Problem");

/** 5–12s Problem: platforms, requests and appointments crowd and pile up, then «يضيع يومك.» */
export const S2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t1 = cue(scene, "المنصات");
  const t2 = cue(scene, "والطلبات");
  const t3 = cue(scene, "والمواعيد");
  const tLose = cue(scene, "يضيع");
  const tDay = cue(scene, "يومك");
  // Last 10 frames: everything collapses into a single point (match cut into the reveal).
  const collapseStart = durationInFrames - 10;
  const collapse = interpolate(frame, [collapseStart, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const calm = interpolate(frame, [tLose - 4, tLose + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell background={<Backdrop variant="dark" />} enter="whip-left" exit="cut" push={0.04}>
      <AbsoluteFill style={{ scale: String(1 - collapse * 0.97), opacity: 1 - collapse * 0.4 }}>
        {/* Clutter layer */}
        <AbsoluteFill
          style={{
            filter: calm > 0.01 ? `blur(${calm * 14}px)` : undefined,
            opacity: 1 - calm * 0.65,
          }}
        >
          <Clutter starts={[t1, t2, t3]} until={tLose} />
          <Stack t1={t1} t2={t2} t3={t3} />
        </AbsoluteFill>

        {/* Dim plate behind the payoff line */}
        <AbsoluteFill style={{ backgroundColor: colors.ink, opacity: calm * 0.55 }} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingInline: 80 }}>
          <WordLine
            size={170}
            weight={800}
            words={[
              { text: "يضيع", at: tLose },
              { text: "يومك.", at: tDay, highlight: true },
            ]}
            highlightColor={colors.gold}
            mode="scale"
          />
        </AbsoluteFill>
      </AbsoluteFill>
      <SceneVoice scene={scene} />
      <Sfx name="tick" at={t1} />
      <Sfx name="tick" at={t2} />
      <Sfx name="tick" at={t3} />
      <Sfx name="tick" at={tLose} gain={1.4} />
    </SceneShell>
  );
};

/** The three spoken words land big, then get shoved up and shrink as the next one arrives. */
const Stack: React.FC<{ t1: number; t2: number; t3: number }> = ({ t1, t2, t3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = [
    { text: "المنصات", at: t1 },
    { text: "والطلبات", at: t2 },
    { text: "والمواعيد", at: t3 },
  ];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {items.map((it, i) => {
        const s = spring({ frame: frame - it.at, fps, config: springs.bouncy });
        // how many words arrived after this one
        const pushed = items
          .slice(i + 1)
          .reduce((acc, n) => acc + spring({ frame: frame - n.at, fps, config: springs.snappy }), 0);
        const y = -40 + (1 - s) * -500 - pushed * 190 + i * 0;
        const rot = (i % 2 === 0 ? -1 : 1) * (2 + pushed * 2.5);
        return (
          <div
            key={it.text}
            dir="rtl"
            style={{
              position: "absolute",
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 150,
              color: i === items.length - 1 ? colors.white : "rgba(255,255,255,0.88)",
              translate: `0px ${y + 200}px`,
              rotate: `${rot}deg`,
              scale: String((0.85 + 0.15 * s) * (1 - pushed * 0.18)),
              opacity: frame < it.at ? 0 : Math.min(1, s * 2) * (1 - pushed * 0.25),
              textShadow: "0 20px 50px rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            {it.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const CLUTTER_ICONS: IconName[] = ["bell", "clock", "document", "id", "bell", "clock", "document"];
const CLUTTER_WORDS = ["المنصات", "الطلبات", "المواعيد"];

/** Generic notification chips multiplying in the background — no real platform names or logos. */
const Clutter: React.FC<{ starts: number[]; until: number }> = ({ starts, until }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const N = 26;
  const span = until - starts[0];
  return (
    <AbsoluteFill>
      {Array.from({ length: N }).map((_, i) => {
        const at = starts[0] + Math.floor((i / N) * span * 1.05) + Math.floor(random(`d${i}`) * 4);
        const s = spring({ frame: frame - at, fps, config: springs.snappy });
        const x = 40 + random(`x${i}`) * 880;
        const y = 180 + random(`y${i}`) * 1450;
        const rot = (random(`r${i}`) - 0.5) * 24;
        const isWord = i % 3 === 0;
        const icon = CLUTTER_ICONS[i % CLUTTER_ICONS.length];
        if (frame < at) return null;
        return (
          <div
            key={i}
            dir="rtl"
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: `0px ${(1 - s) * -80}px`,
              rotate: `${rot}deg`,
              scale: String(0.6 + 0.4 * s),
              opacity: 0.5 * s,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: isWord ? "10px 22px" : "14px",
              borderRadius: 22,
              background: "rgba(255,255,255,0.08)",
              border: "1.5px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.85)",
              fontFamily: fonts.text,
              fontWeight: 600,
              fontSize: 38,
            }}
          >
            <Icon name={icon} size={40} color={colors.tealBright} />
            {isWord && CLUTTER_WORDS[i % 3]}
            {/* red badge = unread / pending */}
            <span
              style={{
                position: "absolute",
                top: -10,
                left: -10,
                width: 26,
                height: 26,
                borderRadius: 13,
                background: "#EC5550",
                boxShadow: "0 0 0 4px rgba(6,13,29,0.9)",
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
