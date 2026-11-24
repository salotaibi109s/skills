import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain } from "../../components/Backdrop";
import { Icon, type IconName } from "../../components/Icons";
import { fonts } from "../../theme";
import { Chair, LedBoard, Person, type PersonKind } from "../art";
import { cue, getStoryScene, SceneVoice, Sfx, story } from "../base";
import { Captions } from "../Captions";

const scene = getStoryScene("T3-Office");

// The four people the narrator points at, right to left in speaking order.
const FEATURED: { kind: PersonKind; skin: number; x: number; cue: string; nth?: number; icon: IconName; label: string; bubbleY: number }[] = [
  { kind: "man", skin: 0, x: 810, cue: "يجدد", icon: "id", label: "تجديد إقامة", bubbleY: 790 },
  { kind: "manRed", skin: 1, x: 570, cue: "جواز", icon: "passport", label: "جواز لولده", bubbleY: 700 },
  { kind: "woman", skin: 2, x: 330, cue: "وظيفة", icon: "briefcase", label: "التقديم على وظيفة", bubbleY: 790 },
  { kind: "man", skin: 3, x: 90, cue: "دراسية", icon: "cap", label: "خدمة دراسية", bubbleY: 700 },
];

// Extra visitors who fill the room on «مليان»
const BACK_ROW: { kind: PersonKind; skin: number; x: number }[] = [
  { kind: "woman", skin: 1, x: 20 },
  { kind: "man", skin: 2, x: 230 },
  { kind: "manRed", skin: 0, x: 440 },
  { kind: "man", skin: 3, x: 650 },
  { kind: "woman", skin: 0, x: 860 },
];

/** The office: packed waiting room; each request pops up as the narrator names it. */
export const T3Office: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const tFull = cue(scene, "مليان");
  const board = Math.min(47, 42 + Math.floor(frame / 75));
  const pan = interpolate(frame, [0, durationInFrames], [30, -30]);
  const push = interpolate(frame, [0, durationInFrames], [1.02, 1.08]);

  return (
    <AbsoluteFill style={{ background: story.wall, overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `${pan}px 0px`, scale: String(push) }}>
        {/* wall + wainscot */}
        <div style={{ position: "absolute", left: -60, right: -60, top: 760, height: 600, background: story.wallDark }} />
        <div style={{ position: "absolute", left: -60, right: -60, top: 1240, bottom: 0, background: "#B9A68D" }} />
        {/* counters */}
        <div style={{ position: "absolute", left: 40, right: 40, top: 470, display: "flex", justifyContent: "space-between" }}>
          {[1, 2, 3].map((n) => (
            <Counter key={n} n={n} closed={n === 2} />
          ))}
        </div>
        <div style={{ position: "absolute", top: 280, left: (width - 460) / 2 }}>
          <LedBoard value={board} width={460} />
        </div>

        {/* back row fills up on «مليان» */}
        {BACK_ROW.map((p, i) => {
          const s = spring({ frame: frame - (tFull - 10 + i * 3), fps, config: { damping: 14, stiffness: 140 } });
          return (
            <div key={i} style={{ position: "absolute", left: p.x, top: 760 + (1 - s) * 80, opacity: frame < tFull - 10 + i * 3 ? 0 : s }}>
              <Person kind={p.kind} skin={story.skin[p.skin]} height={380} />
            </div>
          );
        })}
        <ChairRow y={900} color="#5C7F9C" />

        {/* front row: the four featured visitors */}
        {FEATURED.map((p) => (
          <div key={p.label} style={{ position: "absolute", left: p.x - 20, top: 820 }}>
            <Person kind={p.kind} skin={story.skin[p.skin]} height={470} />
          </div>
        ))}
        <ChairRow y={1080} color="#3E6C8F" />
      </AbsoluteFill>

      {/* request bubbles (outside the camera so they stay crisp and inside the safe area) */}
      {FEATURED.map((p) => (
        <Bubble key={p.label} at={cue(scene, p.cue)} x={p.x + 78} y={p.bubbleY} icon={p.icon} label={p.label} />
      ))}

      <Grain width={width} height={height} opacity={0.06} />
      <Captions scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="crowd" at={0} gain={0.7} />
      <Sfx name="crowd" at={tFull - 6} gain={1.1} />
      {FEATURED.map((p) => (
        <Sfx key={p.label} name="pop" at={cue(scene, p.cue)} />
      ))}
      <Sfx name="ding" at={75} gain={0.5} />
      <Sfx name="ding" at={225} gain={0.5} />
    </AbsoluteFill>
  );
};

const Counter: React.FC<{ n: number; closed?: boolean }> = ({ n, closed }) => (
  <div style={{ width: 300, height: 260, borderRadius: 20, background: "#CDBA9E", padding: 14, position: "relative" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 12, background: closed ? "#9C8B74" : "#BFD6E2", overflow: "hidden", position: "relative" }}>
      {!closed && <Person kind={n === 1 ? "man" : "woman"} skin={story.skin[n]} height={300} style={{ position: "absolute", left: 80, top: 40 }} />}
      {closed && (
        <div
          dir="rtl"
          style={{
            position: "absolute",
            inset: "70px 40px",
            borderRadius: 10,
            background: story.red,
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontFamily: fonts.text,
            fontWeight: 800,
            fontSize: 40,
          }}
        >
          مغلق
        </div>
      )}
    </div>
    <div
      dir="rtl"
      style={{
        position: "absolute",
        top: -46,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: fonts.text,
        fontWeight: 700,
        fontSize: 32,
        color: story.inkSoft,
      }}
    >
      شباك {n}
    </div>
  </div>
);

const ChairRow: React.FC<{ y: number; color: string }> = ({ y, color }) => (
  <div style={{ position: "absolute", left: -40, right: -40, top: y, display: "flex", justifyContent: "space-around" }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Chair key={i} width={230} color={color} />
    ))}
  </div>
);

const Bubble: React.FC<{ at: number; x: number; y: number; icon: IconName; label: string }> = ({ at, x, y, icon, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 170 } });
  if (frame < at) return null;
  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% 0px",
        scale: String(0.4 + 0.6 * s),
        transformOrigin: "50% 100%",
        opacity: Math.min(1, s * 2),
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "16px 22px",
        borderRadius: 26,
        background: "#fff",
        boxShadow: "0 18px 36px rgba(30,34,48,0.22)",
        whiteSpace: "nowrap",
        fontFamily: fonts.text,
        fontWeight: 700,
        fontSize: 34,
        color: story.ink,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          display: "grid",
          placeItems: "center",
          background: "rgba(232,145,91,0.16)",
        }}
      >
        <Icon name={icon} size={36} color={story.warm} stroke={2} />
      </div>
      {label}
      <div
        style={{
          position: "absolute",
          bottom: -14,
          left: "50%",
          translate: "-50% 0px",
          width: 0,
          height: 0,
          borderLeft: "14px solid transparent",
          borderRight: "14px solid transparent",
          borderTop: "16px solid #fff",
        }}
      />
    </div>
  );
};
