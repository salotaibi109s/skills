import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain } from "../../components/Backdrop";
import { fonts } from "../../theme";
import { Clock, fmtTime } from "../art";
import { getStoryScene, SceneVoice, Sfx, story } from "../base";
import { Captions } from "../Captions";

const scene = getStoryScene("T5-Rewind");

/** «طيب… لو نرجّع اليوم من أوله؟» — tape-rewind look, the clock spins back to the morning. */
export const T5Rewind: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const end = durationInFrames - 14;
  const hours = interpolate(frame, [0, end], [14.5, 7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const split = 6 + Math.sin(frame * 1.3) * 3;
  const jitterY = ((frame * 37) % 7) - 3;
  const flash = interpolate(frame, [durationInFrames - 14, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blink = Math.floor(frame / 8) % 2 === 0;

  // RGB split via coloured shadows (VHS chroma bleed)
  const chroma = `drop-shadow(${-split}px 0 0 rgba(255,45,85,0.75)) drop-shadow(${split}px 0 0 rgba(43,212,255,0.75))`;

  return (
    <AbsoluteFill style={{ background: "#101218", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", translate: `0px ${jitterY}px`, filter: chroma }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, marginTop: -160 }}>
          <Clock hours={hours} size={520} face="#F4EEE4" ink={story.ink} />
          <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 110, color: "#F4EEE4", direction: "rtl", fontVariantNumeric: "tabular-nums" }}>
            {fmtTime(hours)}
          </div>
        </div>
      </div>
      {/* scanlines + tracking band */}
      <AbsoluteFill style={{ background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 5px)" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: ((frame * 23) % 1500) + 200,
          height: 60,
          background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.12), transparent)",
          filter: "blur(2px)",
        }}
      />
      {/* ◀◀ */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 90,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: blink ? 1 : 0.35,
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 64,
          color: "#F4EEE4",
        }}
      >
        <svg width="110" height="64" viewBox="0 0 110 64">
          <path d="M54 4 L6 32 L54 60 Z M104 4 L56 32 L104 60 Z" fill="#F4EEE4" />
        </svg>
      </div>
      <Grain width={width} height={height} opacity={0.16} />
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash, pointerEvents: "none" }} />
      <Captions scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="rewind" at={0} />
    </AbsoluteFill>
  );
};
