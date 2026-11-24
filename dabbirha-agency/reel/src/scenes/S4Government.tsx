import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { glassStyle, Pill, ServiceCard } from "../components/Glass";
import type { IconName } from "../components/Icons";
import { Counter, WordLine } from "../components/Kinetic";
import { SceneShell } from "../components/SceneShell";
import { SceneVoice, Sfx } from "../components/Sound";
import { cue, cueEnd, getScene } from "../lib/timeline";
import { colors, fonts, springs } from "../theme";

const scene = getScene("S4-Government");

// Names and prices verified on haxztd.zid.store (category «الخدمات الحكومية»).
// Names only — no official logos.
const SERVICES: { cue: string; title: string; price: number; icon: IconName }[] = [
  { cue: "أبشر", title: "أبشر أفراد", price: 49, icon: "id" },
  { cue: "قوى", title: "قوى أفراد", price: 49, icon: "briefcase" },
  { cue: "التأمينات", title: "التأمينات الاجتماعية", price: 49, icon: "shield" },
  { cue: "العدل", title: "وزارة العدل", price: 99, icon: "scale" },
  { cue: "التجارة", title: "وزارة التجارة", price: 99, icon: "building" },
  { cue: "حساب", title: "حساب المواطن", price: 49, icon: "family" },
  { cue: "الضمان", title: "الضمان الاجتماعي", price: 99, icon: "home" },
];

/** 18–30s Government services: glass cards in sync with each spoken name, then the price counter. */
export const S4Government: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tNk = cue(scene, "نخلصها");
  const tAnk = cue(scene, "عنك");
  const tStart = cue(scene, "وتبدأ");
  const tLand = cueEnd(scene, "وأربعين");
  const tRiyal = cue(scene, "ريال");

  const recede = interpolate(frame, [tNk - 6, tNk + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const panel = spring({ frame: frame - (tStart - 3), fps, config: springs.snappy });
  const land = spring({ frame: frame - tLand, fps, config: springs.bouncy });

  return (
    <SceneShell background={<Backdrop variant="brand" />} enter="zoom" exit="whip-left" push={0.05}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 290 }}>
        <Pill at={2}>الخدمات الحكومية</Pill>
      </AbsoluteFill>

      {/* Card stack — recedes into depth when the price takes over */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 400,
          gap: 18,
          scale: String(1 - recede * 0.12),
          translate: `0px ${-recede * 40}px`,
          filter: recede > 0.01 ? `blur(${recede * 12}px)` : undefined,
          opacity: 1 - recede * 0.7,
        }}
      >
        {SERVICES.map((s, i) => (
          <ServiceCard
            key={s.title}
            at={cue(scene, s.cue)}
            icon={s.icon}
            title={s.title}
            price={s.price}
            width={880}
            from={i % 2 === 0 ? "right" : "left"}
          />
        ))}
      </AbsoluteFill>

      {/* «نخلّصها عنك» + price */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingInline: 80 }}>
        <WordLine
          size={104}
          weight={800}
          words={[
            { text: "نخلّصها", at: tNk, highlight: true },
            { text: "عنك", at: tAnk },
          ]}
          highlightColor={colors.tealBright}
        />
        <div
          dir="rtl"
          style={{
            marginTop: 40,
            padding: "40px 70px 30px",
            borderRadius: 48,
            ...glassStyle("dark"),
            textAlign: "center",
            opacity: frame < tStart - 3 ? 0 : panel,
            scale: String(0.85 + 0.15 * panel),
          }}
        >
          <div style={{ fontFamily: fonts.text, fontWeight: 600, fontSize: 52, color: colors.white }}>تبدأ من</div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 22,
              fontFamily: fonts.display,
              fontWeight: 800,
              color: colors.gold,
              lineHeight: 1,
            }}
          >
            <Counter
              value={49}
              start={tStart}
              end={tLand}
              style={{ fontSize: 300, scale: String(1 + land * 0.06 - 0.06 * Math.min(1, land)) }}
            />
            <span style={{ fontSize: 76, color: colors.white, opacity: frame >= tRiyal - 2 ? 1 : 0.35 }}>ريال</span>
          </div>
        </div>
      </AbsoluteFill>

      <SceneVoice scene={scene} />
      {SERVICES.map((s) => (
        <Sfx key={s.title} name="pop" at={cue(scene, s.cue)} gain={0.7} />
      ))}
      <Sfx name="tick" at={tNk} />
      <Sfx name="pop" at={tLand} gain={1.2} />
    </SceneShell>
  );
};
