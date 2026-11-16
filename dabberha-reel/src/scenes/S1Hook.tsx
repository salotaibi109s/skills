import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Glitch, Reveal, WordLine } from "../components/Kinetic";
import { SceneShell } from "../components/SceneShell";
import { SceneVoice, Sfx } from "../components/Sound";
import { cue, getScene } from "../lib/timeline";
import { colors, fonts, safe } from "../theme";

const scene = getScene("S1-Hook");

/** 0–5s Hook: «معاملة معلّقة… ووقتك ما يسمح؟» — huge type, light glitch, a progress bar that never finishes. */
export const S1Hook: React.FC = () => {
  const tA = cue(scene, "معاملة");
  const tB = cue(scene, "معلقة");
  const tC = cue(scene, "ووقتك");
  const tD = cue(scene, "ما");
  const tE = cue(scene, "يسمح");
  const glitchHits = [tB + 3, tB + 20, tC - 4, tE + 10];

  return (
    <SceneShell background={<Backdrop variant="dark" />} enter="cut" exit="whip-left" push={0.07}>
      <AbsoluteFill
        style={{
          paddingTop: safe.contentTop + 230,
          paddingInline: safe.side,
          alignItems: "center",
        }}
      >
        <div
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 200,
            lineHeight: 1.1,
            color: colors.white,
            textAlign: "center",
          }}
        >
          <Reveal at={tA} display="block">
            معاملة
          </Reveal>
          <Reveal at={tB} display="block" mode="blur">
            <Glitch hits={glitchHits} style={{ color: colors.tealBright }}>
              معلّقة…
            </Glitch>
          </Reveal>
        </div>
        <StuckProgress start={tA + 2} stall={tB + 14} />
        <div style={{ height: 70 }} />
        <WordLine
          size={104}
          weight={700}
          words={[
            { text: "ووقتك", at: tC },
            { text: "ما", at: tD },
            { text: "يسمح؟", at: tE, highlight: true },
          ]}
          highlightColor={colors.gold}
        />
      </AbsoluteFill>
      <SceneVoice scene={scene} />
      {glitchHits.slice(0, 2).map((h) => (
        <Sfx key={h} name="glitch" at={h} />
      ))}
      <Sfx name="tick" at={tA} />
      <Sfx name="tick" at={tC} />
      <Sfx name="tick" at={tE} />
    </SceneShell>
  );
};

/** A loading bar that races to 87% and then stalls, jittering — the «pending» feeling. */
const StuckProgress: React.FC<{ start: number; stall: number }> = ({ start, stall }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, stall], [0, 0.87], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.9, 0.3, 1),
  });
  const jitter = frame > stall ? Math.sin(frame * 1.7) * 0.004 : 0;
  const opacity = interpolate(frame, [start, start + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = frame > stall ? 0.55 + 0.45 * Math.abs(Math.sin(frame / 6)) : 1;
  return (
    <div style={{ width: 640, marginTop: 56, opacity }}>
      <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
        <div
          style={{
            width: `${(p + jitter) * 100}%`,
            height: "100%",
            borderRadius: 5,
            background: `linear-gradient(90deg, ${colors.teal}, ${colors.tealBright})`,
            boxShadow: `0 0 24px ${colors.tealBright}`,
            opacity: pulse,
          }}
        />
      </div>
      <div
        dir="rtl"
        style={{
          marginTop: 18,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: fonts.text,
          fontWeight: 500,
          fontSize: 32,
          color: colors.muted,
        }}
      >
        <span>جاري المعالجة…</span>
        <span style={{ direction: "ltr", unicodeBidi: "isolate", fontVariantNumeric: "tabular-nums" }}>
          {Math.round(p * 100)}%
        </span>
      </div>
    </div>
  );
};
