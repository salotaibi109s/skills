import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { ServiceCard } from "../components/Glass";
import { Icon } from "../components/Icons";
import { WordLine } from "../components/Kinetic";
import { Phone } from "../components/Phone";
import { SceneShell } from "../components/SceneShell";
import { SceneVoice, Sfx } from "../components/Sound";
import { cue, getScene } from "../lib/timeline";
import { colors, fonts, springs } from "../theme";

const scene = getScene("S5-Business");

// Shared with S6 so the phone holds its exact position across the match cut.
export const PHONE = { left: 70, top: 560, width: 430 } as const;
export const COLUMN = { left: 540, width: 470 } as const;

/** 30–40s Business: «وعندك مشروع؟» — a store builds itself inside the phone while the three offers land. */
export const S5Business: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tQ1 = cue(scene, "وعندك");
  const tQ2 = cue(scene, "مشروع");
  const tDoc = cue(scene, "وثيقة");
  const tLoan = cue(scene, "قرض");
  const tStore = cue(scene, "ومتجرك");
  const tReady = cue(scene, "جاهز");

  const phoneIn = spring({ frame: frame - (tQ2 + 4), fps, config: springs.soft });

  return (
    <SceneShell background={<Backdrop variant="dark" />} enter="whip-left" exit="cut" push={0.03}>
      <AbsoluteFill style={{ paddingTop: 300, paddingInline: 80 }}>
        <WordLine
          size={120}
          weight={800}
          words={[
            { text: "وعندك", at: tQ1 },
            { text: "مشروع؟", at: tQ2, highlight: true },
          ]}
          highlightColor={colors.gold}
        />
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          left: PHONE.left,
          top: PHONE.top,
          translate: `0px ${(1 - phoneIn) * 500}px`,
          rotate: `${(1 - phoneIn) * -8}deg`,
          opacity: frame < tQ2 + 4 ? 0 : 1,
        }}
      >
        <Phone width={PHONE.width}>
          <StoreBuild start={tDoc} store={tStore} ready={tReady} />
        </Phone>
      </div>

      <div
        style={{
          position: "absolute",
          left: COLUMN.left,
          top: 640,
          width: COLUMN.width,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        {/* verified on the store: 149 / 199 / 999 */}
        <ServiceCard at={tDoc} icon="document" title="وثيقة العمل الحر" price={149} width={COLUMN.width} stacked from="right" />
        <ServiceCard at={tLoan} icon="loan" title="قرض العمل الحر" price={199} width={COLUMN.width} stacked from="right" />
        <ServiceCard at={tStore} icon="store" title="متجر إلكتروني متكامل" price={999} width={COLUMN.width} stacked from="right" />
      </div>

      <SceneVoice scene={scene} />
      <Sfx name="tick" at={tQ2} />
      <Sfx name="pop" at={tDoc} />
      <Sfx name="pop" at={tLoan} />
      <Sfx name="pop" at={tStore} />
      <Sfx name="pop" at={tReady} gain={1.2} />
    </SceneShell>
  );
};

/** Generic storefront assembling itself: header, banner, product tiles, then a «جاهز» badge. */
export const StoreBuild: React.FC<{ start: number; store: number; ready: number }> = ({ start, store, ready }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const header = spring({ frame: frame - start, fps, config: springs.soft });
  const banner = interpolate(frame, [start + 6, start + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const done = spring({ frame: frame - ready, fps, config: springs.bouncy });
  return (
    <AbsoluteFill dir="rtl" style={{ padding: "64px 22px 22px", gap: 16, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: header,
          translate: `0px ${(1 - header) * -20}px`,
        }}
      >
        <div style={{ width: 120, height: 22, borderRadius: 11, background: colors.navy }} />
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: colors.mist }} />
          <div style={{ width: 34, height: 34, borderRadius: 10, background: colors.mist }} />
        </div>
      </div>
      <div
        style={{
          height: 170,
          borderRadius: 22,
          background: `linear-gradient(135deg, ${colors.navy}, ${colors.teal})`,
          scale: `${banner} 1`,
          transformOrigin: "right center",
          display: "flex",
          alignItems: "flex-end",
          padding: 18,
        }}
      >
        <div style={{ width: "55%", height: 18, borderRadius: 9, background: "rgba(255,255,255,0.7)", opacity: banner }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {Array.from({ length: 4 }).map((_, i) => {
          const s = spring({ frame: frame - (store + i * 4), fps, config: springs.bouncy });
          return (
            <div
              key={i}
              style={{
                height: 190,
                borderRadius: 20,
                background: colors.white,
                boxShadow: "0 8px 20px rgba(13,36,71,0.10)",
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                scale: String(0.6 + 0.4 * s),
                opacity: frame < store + i * 4 ? 0 : Math.min(1, s * 1.5),
              }}
            >
              <div
                style={{
                  flex: 1,
                  borderRadius: 14,
                  background: i % 2 === 0 ? colors.mist : "rgba(14,147,154,0.18)",
                }}
              />
              <div style={{ width: "70%", height: 12, borderRadius: 6, background: colors.mist }} />
              <div style={{ width: "40%", height: 12, borderRadius: 6, background: colors.gold }} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: "auto",
          height: 64,
          borderRadius: 18,
          background: colors.primary,
          opacity: interpolate(frame, [store + 16, store + 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      {/* «جاهز» */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "18px 34px",
            borderRadius: 999,
            background: colors.teal,
            color: colors.white,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 48,
            boxShadow: "0 20px 40px rgba(14,147,154,0.45)",
            scale: String(done),
            opacity: frame < ready ? 0 : 1,
          }}
        >
          <Icon name="check" size={44} color={colors.white} stroke={2.6} />
          جاهز
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
