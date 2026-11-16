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
import { COLUMN, PHONE, StoreBuild } from "./S5Business";

const scene = getScene("S6-RealEstate");

/** 40–46s Real estate: match cut on the phone; its screen swipes to a lease being signed. */
export const S6RealEstate: React.FC = () => {
  const frame = useCurrentFrame();
  const tLease = cue(scene, "عقد");
  const tReg = cue(scene, "وتسجيل");
  const t1 = cue(scene, "كلها");
  const t2 = cue(scene, "من");
  const t3 = cue(scene, "جوالك");

  const swipe = interpolate(frame, [2, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  return (
    <SceneShell background={<Backdrop variant="dark" />} enter="cut" exit="whip-left" push={0.04}>
      <div style={{ position: "absolute", left: PHONE.left, top: PHONE.top }}>
        <Phone width={PHONE.width}>
          <AbsoluteFill style={{ translate: `${swipe * -100}% 0px` }}>
            <StoreBuild start={-200} store={-150} ready={-100} />
          </AbsoluteFill>
          <AbsoluteFill style={{ translate: `${(1 - swipe) * 100}% 0px`, background: colors.white }}>
            <LeaseScreen start={tLease} stamp={tReg + 4} />
          </AbsoluteFill>
        </Phone>
      </div>

      <div
        style={{
          position: "absolute",
          left: COLUMN.left,
          top: 760,
          width: COLUMN.width,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        {/* verified on the store: إصدار عقد تأجير 299 / التسجيل العيني للعقار 99 */}
        <ServiceCard at={tLease} icon="contract" title="عقد تأجير" price={299} width={COLUMN.width} stacked from="right" />
        <ServiceCard
          at={tReg}
          icon="building"
          title="التسجيل العيني للعقار"
          price={99}
          width={COLUMN.width}
          stacked
          from="right"
        />
      </div>

      <AbsoluteFill style={{ paddingTop: 300, paddingInline: 80 }}>
        <WordLine
          size={116}
          weight={800}
          words={[
            { text: "كلها", at: t1 },
            { text: "من", at: t2 },
            { text: "جوالك.", at: t3, highlight: true },
          ]}
        />
      </AbsoluteFill>

      <SceneVoice scene={scene} />
      <Sfx name="pop" at={tLease} />
      <Sfx name="pop" at={tReg} />
      <Sfx name="tick" at={t3} />
    </SceneShell>
  );
};

/** Generic contract document: lines write in, a signature draws, a check stamp lands. */
const LeaseScreen: React.FC<{ start: number; stamp: number }> = ({ start, stamp }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sig = interpolate(frame, [stamp - 14, stamp], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const st = spring({ frame: frame - stamp, fps, config: springs.bouncy });
  return (
    <AbsoluteFill dir="rtl" style={{ padding: "74px 30px 30px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            display: "grid",
            placeItems: "center",
            background: "rgba(14,147,154,0.12)",
          }}
        >
          <Icon name="contract" size={40} color={colors.teal} />
        </div>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 40, color: colors.textOnLight }}>عقد تأجير</div>
      </div>
      {Array.from({ length: 8 }).map((_, i) => {
        const w = interpolate(frame, [start + i * 3, start + i * 3 + 10], [0, i % 3 === 2 ? 60 : 92], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return <div key={i} style={{ width: `${w}%`, height: 14, borderRadius: 7, background: colors.mist }} />;
      })}
      <div style={{ marginTop: "auto", position: "relative", height: 220 }}>
        <div style={{ position: "absolute", bottom: 40, right: 10, left: 140, height: 2, background: colors.mist }} />
        <svg width="260" height="120" viewBox="0 0 260 120" style={{ position: "absolute", right: 20, bottom: 44 }}>
          <path
            d="M10 80 C 40 20, 60 110, 90 60 S 140 20, 150 70 S 200 100, 250 40"
            fill="none"
            stroke={colors.navy}
            strokeWidth={5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={sig}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            width: 130,
            height: 130,
            borderRadius: 65,
            border: `5px solid ${colors.teal}`,
            display: "grid",
            placeItems: "center",
            rotate: "-12deg",
            scale: String(frame < stamp ? 0 : 1.6 - 0.6 * st),
            opacity: frame < stamp ? 0 : Math.min(1, st * 1.5),
          }}
        >
          <Icon name="check" size={70} color={colors.teal} stroke={2.6} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
