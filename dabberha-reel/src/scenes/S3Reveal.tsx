import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop, Flash } from "../components/Backdrop";
import { WordLine } from "../components/Kinetic";
import { SceneShell } from "../components/SceneShell";
import { SceneVoice, Sfx } from "../components/Sound";
import { cue, getScene } from "../lib/timeline";
import { colors, springs } from "../theme";

const scene = getScene("S3-Reveal");
const RISER_FRAMES = 36; // matches the generated 1.2 s riser

/** 12–18s Reveal: riser → impact → the screen turns into the brand, logo lands, promise line. */
export const S3Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const impact = cue(scene, "دبرها");
  const t1 = cue(scene, "خدماتك");
  const t2 = cue(scene, "الإلكترونية");
  const t3 = cue(scene, "تخلص");
  const t4 = cue(scene, "وأنت");
  const t5 = cue(scene, "مرتاح");

  // Brand light floods out from the centre on impact
  const flood = interpolate(frame, [impact, impact + 12], [0, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const logo = spring({ frame: frame - impact, fps, config: springs.bouncy });
  const logoBlur = interpolate(frame, [impact, impact + 10], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Logo settles upward once the promise line starts
  const lift = spring({ frame: frame - (t1 - 4), fps, config: springs.soft });

  return (
    <SceneShell background={<Backdrop variant="dark" />} enter="cut" exit="zoom" push={0.05}>
      {/* Pre-impact: the collapsed point from the previous shot grows with the riser */}
      <Charge impact={impact} />

      <AbsoluteFill style={{ clipPath: `circle(${flood}% at 50% 45%)` }}>
        <Backdrop variant="light" drift={0.6} />
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 380 }}>
          <div
            style={{
              translate: `0px ${-lift * 60}px`,
              scale: String((0.72 + 0.28 * logo) * (1 - lift * 0.12)),
              filter: logoBlur > 0.3 ? `blur(${logoBlur}px)` : undefined,
              opacity: frame < impact ? 0 : 1,
            }}
          >
            <Img src={staticFile("brand/logo-color.png")} style={{ width: 760 }} />
          </div>
          <div style={{ marginTop: 40, width: "100%", paddingInline: 80 }}>
            <WordLine
              size={74}
              weight={600}
              font="text"
              color={colors.textOnLight}
              words={[
                { text: "خدماتك", at: t1 },
                { text: "الإلكترونية", at: t2, highlight: true },
              ]}
              highlightColor={colors.primary}
            />
            <div style={{ height: 18 }} />
            <WordLine
              size={104}
              weight={800}
              color={colors.textOnLight}
              words={[
                { text: "تخلص", at: t3 },
                { text: "وأنت", at: t4 },
                { text: "مرتاح.", at: t5, highlight: true },
              ]}
              highlightColor={colors.teal}
            />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <Flash at={impact} />

      <SceneVoice scene={scene} />
      <Sfx name="riser" at={impact - RISER_FRAMES} />
      <Sfx name="impact" at={impact} />
      <Sfx name="tick" at={t3} />
      <Sfx name="tick" at={t5} />
    </SceneShell>
  );
};

const Charge: React.FC<{ impact: number }> = ({ impact }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, impact], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  if (frame > impact + 2) return null;
  const size = 14 + p * 220;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* converging light streaks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        const len = 900 * (1 - p) + 60;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 4,
              height: len,
              rotate: `${angle}deg`,
              transformOrigin: "50% 0%",
              translate: `0px ${len / 2}px`,
              background: `linear-gradient(180deg, ${colors.tealBright} 0%, transparent 100%)`,
              opacity: 0.15 + p * 0.6,
              top: "45%",
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          top: `calc(45% - ${size / 2}px)`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, #ffffff 0%, ${colors.tealBright} 35%, rgba(43,196,196,0) 70%)`,
          boxShadow: `0 0 ${80 + p * 200}px ${colors.tealBright}`,
          opacity: 0.6 + p * 0.4,
        }}
      />
    </AbsoluteFill>
  );
};
