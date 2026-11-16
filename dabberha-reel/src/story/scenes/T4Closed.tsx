import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain } from "../../components/Backdrop";
import { fonts } from "../../theme";
import { Clock, fmtTime, LedBoard, Person, Ticket } from "../art";
import { cue, getStoryScene, SceneVoice, Sfx, story } from "../base";
import { Captions } from "../Captions";

const scene = getStoryScene("T4-Closed");
const SHUTTER_FRAMES = 12;
const THUD_AT = 20; // the generated shutter sound hits ~0.65 s after it starts

/** Time runs out: the clock races, the board freezes, the shutter comes down on «انتهى الدوام». */
export const T4Closed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const tClosed = cue(scene, "انتهى");
  const tBack = cue(scene, "راجعنا");
  const hit = tClosed + SHUTTER_FRAMES;

  const hours = interpolate(frame, [0, tClosed], [11.5, 14.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const shutter = interpolate(frame, [tClosed, hit], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const bounce = frame >= hit ? Math.sin((frame - hit) / 2.2) * Math.exp(-(frame - hit) / 6) * 10 : 0;
  const sign = spring({ frame: frame - (hit + 2), fps, config: { damping: 6, stiffness: 90 } });
  const fall = interpolate(frame, [tBack - 6, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gray = interpolate(frame, [hit, durationInFrames], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dim = interpolate(frame, [hit, hit + 20], [0, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: story.wall, overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: gray > 0.01 ? `grayscale(${gray})` : undefined, translate: `0px ${bounce}px` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1240, bottom: 0, background: "#B9A68D" }} />
        {/* racing clock */}
        <div style={{ position: "absolute", top: 270, left: 90, display: "flex", alignItems: "center", gap: 34 }}>
          <Clock hours={hours} size={300} />
          <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 104, color: story.ink, direction: "rtl", fontVariantNumeric: "tabular-nums" }}>
            {fmtTime(hours)}
          </div>
        </div>
        {/* counter window */}
        <div style={{ position: "absolute", left: 150, width: 780, top: 690, height: 560, borderRadius: 26, background: "#CDBA9E", padding: 22 }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 16, overflow: "hidden", background: "#BFD6E2" }}>
            <Person kind="man" skin={story.skin[2]} height={520} style={{ position: "absolute", left: 260, top: 60 }} />
            <div style={{ position: "absolute", top: 20, right: 20 }}>
              <LedBoard value={96} width={300} label="الحالي" dim={frame >= hit} />
            </div>
            {/* roller shutter */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: `${shutter * 100}%`,
                background: "repeating-linear-gradient(180deg, #A9AEB8 0 26px, #8D939E 26px 30px, #B7BCC5 30px 34px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>
        {/* «انتهى الدوام» sign */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center" }}>
          <div
            dir="rtl"
            style={{
              padding: "26px 54px",
              borderRadius: 22,
              background: story.red,
              color: "#fff",
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 92,
              boxShadow: "0 24px 50px rgba(0,0,0,0.35)",
              transformOrigin: "50% -120px",
              rotate: `${(1 - sign) * 14}deg`,
              opacity: frame < hit + 2 ? 0 : 1,
            }}
          >
            انتهى الدوام
          </div>
        </div>
        {/* the ticket from the opening, falling away */}
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 900 + fall * 520,
            rotate: `${12 + fall * 40}deg`,
            opacity: fall > 0 ? 1 - fall * 0.2 : 0,
            scale: "0.55",
          }}
        >
          <Ticket number={187} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: dim, pointerEvents: "none" }} />
      <Grain width={width} height={height} opacity={0.07} />
      <Captions scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="clock" at={0} gain={1.2} />
      <Sfx name="shutter" at={hit - THUD_AT} />
    </AbsoluteFill>
  );
};
