import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain } from "../../components/Backdrop";
import { fonts } from "../../theme";
import { Car, Clock, fmtTime } from "../art";
import { cue, getStoryScene, SceneVoice, Sfx, story } from "../base";
import { Captions } from "../Captions";

const scene = getStoryScene("T2-Road");

const LANE_A = ["#E2523F", "#F7F6F1", "#3E6C8F", "#E8B04B", "#7A8291", "#F7F6F1", "#4E8A5C", "#C8243A"];
const LANE_B = ["#7A8291", "#F7F6F1", "#E8915B", "#2E4A6B", "#F7F6F1", "#B57A4F", "#3E6C8F", "#E2523F"];

/** Morning rush: bumper-to-bumper traffic, a red light, time flying, and no parking. */
export const T2Road: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const tJam = cue(scene, "زحمة");
  const tLights = cue(scene, "وإشارات");
  const tPark = cue(scene, "موقف");

  // Time-lapse 7:05 → 8:20 across the scene
  const hours = interpolate(frame, [0, durationInFrames], [7 + 5 / 60, 8 + 20 / 60]);
  // Stop-and-go creep
  const creep = (speed: number) => frame * speed + Math.sin(frame / 9) * 6;
  const parking = spring({ frame: frame - tPark, fps, config: { damping: 12, stiffness: 160 } });
  const lightOn = frame >= tLights - 4;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${story.skyTop} 0%, ${story.skyBottom} 55%)` }} />
      {/* sun */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 260 - frame * 0.15,
          width: 190,
          height: 190,
          borderRadius: "50%",
          background: "radial-gradient(circle, #FFF6DA 0%, #FFD58A 60%, rgba(255,213,138,0) 72%)",
        }}
      />
      {/* skyline, two depths for parallax */}
      <Skyline y={560} color="#EBC9A0" shift={-frame * 0.2} seed={1} />
      <Skyline y={640} color="#DDB386" shift={-frame * 0.45} seed={2} />
      {/* road */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 470, background: story.asphalt }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 14, background: "#C9C2B6" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1090,
          height: 10,
          background: `repeating-linear-gradient(90deg, #F2E8D5 0 70px, transparent 70px 140px)`,
          backgroundPosition: `${-creep(1.2)}px 0`,
        }}
      />
      {/* traffic light */}
      <div style={{ position: "absolute", left: 70, top: 600, width: 18, height: 300, background: "#2A2D36" }} />
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 520,
          width: 90,
          height: 230,
          borderRadius: 24,
          background: "#1E2230",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {["#FF3B30", "#FFB800", "#22C55E"].map((c, i) => (
          <div
            key={c}
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              background: i === 0 && lightOn ? c : "#3A3F4C",
              boxShadow: i === 0 && lightOn ? `0 0 30px ${c}` : "none",
            }}
          />
        ))}
      </div>
      {/* lanes of cars */}
      <Lane colors={LANE_A} y={905} offset={creep(0.9)} gap={250} />
      <Lane colors={LANE_B} y={1120} offset={creep(0.6) + 120} gap={262} />

      {/* clock and time */}
      <div style={{ position: "absolute", top: 280, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
        <Clock hours={hours} size={210} />
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 96,
            color: story.ink,
            direction: "rtl",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {fmtTime(hours)}
        </div>
      </div>

      {/* parking full */}
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 80,
          top: 560,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 26px",
          borderRadius: 24,
          background: "#fff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          scale: String(frame < tPark ? 0 : parking),
          rotate: `${(1 - parking) * 10}deg`,
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 16,
            background: "#2E5AAC",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 56,
          }}
        >
          P
        </div>
        <div style={{ fontFamily: fonts.text, fontWeight: 800, fontSize: 52, color: story.red }}>مكتمل</div>
      </div>

      <Grain width={width} height={height} opacity={0.06} />
      <Captions scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="clock" at={0} gain={0.8} />
      <Sfx name="horn" at={tJam} />
      <Sfx name="tick" at={tLights} gain={1.5} />
      <Sfx name="pop" at={tPark} />
    </AbsoluteFill>
  );
};

const Lane: React.FC<{ colors: string[]; y: number; offset: number; gap: number }> = ({ colors, y, offset, gap }) => (
  <>
    {colors.map((c, i) => {
      const x = ((i * gap - offset) % (gap * colors.length) + gap * colors.length) % (gap * colors.length) - gap;
      return <Car key={i} color={c} width={230} style={{ position: "absolute", left: x, top: y }} flip />;
    })}
  </>
);

const Skyline: React.FC<{ y: number; color: string; shift: number; seed: number }> = ({ y, color, shift, seed }) => {
  const blocks = Array.from({ length: 14 }).map((_, i) => {
    const r = Math.abs(Math.sin(i * 12.9898 + seed * 78.233)) % 1;
    return { w: 90 + r * 80, h: 120 + r * 220 };
  });
  let x = shift % 1200;
  return (
    <>
      {blocks.map((b, i) => {
        const left = x;
        x += b.w + 6;
        return (
          <div
            key={i}
            style={{ position: "absolute", left, top: y + 300 - b.h, width: b.w, height: b.h, background: color, borderRadius: "8px 8px 0 0" }}
          />
        );
      })}
    </>
  );
};

export const easeIO = Easing.bezier(0.65, 0, 0.35, 1);
