import { loadFont as loadBaloo } from "@remotion/google-fonts/BalooBhaijaan2";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import data from "../data/joanna-timeline.json";
import mouthData from "../data/joanna-mouth.json";
import { createSound } from "../components/Sound";
import { findScene, type TimelineData } from "../lib/timing";
import { db } from "../theme";
import { Backpack, CharDefs, Crayons, Kid, Lunchbox, Notebook, Sandwich, Teacher, Teddy } from "./chars";

export const FONT = loadBaloo("normal", { weights: ["500", "700", "800"], subsets: ["arabic"] }).fontFamily;
const T = data as TimelineData;
const MOUTH = mouthData as Record<string, number[]>;
const { Sfx } = createSound(T, "audio/joanna", {
  birds: db(-16),
  bell: db(-14),
  steps: db(-14),
  scratch: db(-10),
  boing: db(-11),
  whoosh: db(-14),
  pop: db(-12),
  rummage: db(-11),
  squeak: db(-12),
  tiptoe: db(-12),
  creak: db(-11),
  tada: db(-10),
  squish: db(-10),
  laugh: db(-11),
  sparkle: db(-12),
  swoosh: db(-11),
  giggle: db(-9),
});

const line = (id: string) => findScene(T, id);
/** Absolute frame at which a line's voice starts. */
const at = (id: string) => line(id).from + line(id).voFrom;
/** Mouth openness for a speaker at an absolute frame (0..1). */
const talkOf = (who: string, f: number) => {
  for (const s of T.scenes) {
    const sp = s.id.split("-")[1];
    if ((who === "joanna" && sp !== "J") || (who === "friend" && sp !== "F") || (who === "teacher" && sp !== "T")) continue;
    const st = s.from + s.voFrom;
    const env = MOUTH[s.id];
    const i = f - st;
    if (env && i >= 0 && i < env.length) {
      const v = env[i];
      return Math.min(1, v * 1.15) * (0.75 + 0.25 * Math.abs(Math.sin(f * 1.7)));
    }
  }
  return 0;
};
export const blinkAt = (f: number, seed: number) => {
  const p = (f + seed * 37) % 104;
  return p < 3 ? [0.5, 1, 0.5][p] : 0;
};
export const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) });

/** Camera: zoom around a focus point (world coords), with optional handheld drift. */
export const Cam: React.FC<{ fx: number; fy: number; z: number; children: React.ReactNode; blur?: number }> = ({ fx, fy, z, children }) => {
  const tx = 540 - fx * z;
  const ty = 960 - fy * z;
  return <g transform={`translate(${tx} ${ty}) scale(${z})`}>{children}</g>;
};

export const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <CharDefs />
    {children}
  </svg>
);

/* ---------------------------------------------------------------- sets */

export const SchoolYard: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6EC3F5" />
        <stop offset="60%" stopColor="#BFE6FF" />
        <stop offset="100%" stopColor="#FFF1D6" />
      </linearGradient>
      <linearGradient id="wall" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#F7E3C3" />
        <stop offset="100%" stopColor="#E8C99A" />
      </linearGradient>
      <linearGradient id="ground" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#E9D8BB" />
        <stop offset="100%" stopColor="#CDB590" />
      </linearGradient>
      <radialGradient id="sunG" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF7C2" />
        <stop offset="40%" stopColor="#FFE27A" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#FFE27A" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={-1200} y={-1400} width={3480} height={3000} fill="url(#sky)" />
    <circle cx={820} cy={-120} r={260} fill="url(#sunG)" />
    {[0, 1, 2].map((i) => {
      const cx = ((i * 520 + f * (0.6 + i * 0.2)) % 2200) - 600;
      return (
        <g key={i} opacity={0.95}>
          <ellipse cx={cx} cy={-300 + i * 140} rx={150} ry={56} fill="#fff" />
          <ellipse cx={cx + 90} cy={-330 + i * 140} rx={100} ry={60} fill="#fff" />
          <ellipse cx={cx - 90} cy={-320 + i * 140} rx={90} ry={48} fill="#fff" />
        </g>
      );
    })}
    {/* school building */}
    <g>
      <rect x={-500} y={180} width={2080} height={760} fill="url(#wall)" />
      <rect x={-500} y={160} width={2080} height={40} fill="#D9B784" />
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i}>
          <path d={`M${-430 + i * 175} 560 L${-430 + i * 175} 380 Q${-370 + i * 175} 300 ${-310 + i * 175} 380 L${-310 + i * 175} 560Z`} fill="#7FC4E8" stroke="#C99A5E" strokeWidth={10} />
          <path d={`M${-410 + i * 175} 420 L${-360 + i * 175} 370`} stroke="#fff" strokeOpacity={0.6} strokeWidth={10} />
        </g>
      ))}
      {/* entrance arch */}
      <path d="M380 940 L380 640 Q540 470 700 640 L700 940Z" fill="#A9783F" />
      <path d="M410 940 L410 655 Q540 515 670 655 L670 940Z" fill="#6B4523" />
    </g>
    {/* palms */}
    {[-200, 1260].map((px, i) => (
      <g key={px} transform={`translate(${px} 960)`}>
        <path d="M0 0 Q-20 -260 10 -520" stroke="#8B5E34" strokeWidth={46} fill="none" strokeLinecap="round" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path key={a} d={`M10 -520 q${Math.cos(((a + Math.sin(f / 20 + i) * 6) * Math.PI) / 180) * 220} ${Math.sin(((a + 200) * Math.PI) / 180) * 80 - 60} ${Math.cos(((a + Math.sin(f / 20 + i) * 6) * Math.PI) / 180) * 300} ${Math.abs(Math.sin(((a + 90) * Math.PI) / 180)) * 120}`} stroke="#3FA65A" strokeWidth={40} fill="none" strokeLinecap="round" />
        ))}
      </g>
    ))}
    {/* low wall with gate */}
    <rect x={-600} y={900} width={980} height={120} fill="#EAD2A8" />
    <rect x={700} y={900} width={1100} height={120} fill="#EAD2A8" />
    <rect x={-600} y={890} width={980} height={20} fill="#C9A26B" />
    <rect x={700} y={890} width={1100} height={20} fill="#C9A26B" />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={392 + i * 36} y={700} width={10} height={320} fill="#4C5B6B" />
    ))}
    <rect x={380} y={690} width={320} height={16} fill="#4C5B6B" />
    <rect x={-1200} y={1010} width={3480} height={1600} fill="url(#ground)" />
    <path d="M540 1010 L240 2600 L840 2600Z" fill="#F3E5CB" opacity={0.6} />
  </g>
);

export const Classroom: React.FC<{ f: number; board?: string }> = ({ f, board = "١ + ٢ = ٣" }) => (
  <g>
    <defs>
      <linearGradient id="cwall" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#FFF4E0" />
        <stop offset="100%" stopColor="#F6DFC0" />
      </linearGradient>
      <linearGradient id="cfloor" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#D9B48A" />
        <stop offset="100%" stopColor="#B88C5E" />
      </linearGradient>
      <linearGradient id="beam" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#FFF3C4" stopOpacity={0.55} />
        <stop offset="100%" stopColor="#FFF3C4" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#E7B57A" />
        <stop offset="100%" stopColor="#C48A4C" />
      </linearGradient>
    </defs>
    <rect x={-1000} y={-800} width={3080} height={2200} fill="url(#cwall)" />
    <rect x={-1000} y={1100} width={3080} height={1400} fill="url(#cfloor)" />
    <rect x={-1000} y={1080} width={3080} height={30} fill="#C99A68" />
    {/* whiteboard */}
    <rect x={-80} y={80} width={1240} height={640} rx={20} fill="#FDFDFD" stroke="#9AA6B2" strokeWidth={18} />
    <text x={540} y={340} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={board.length > 12 ? 110 : 150} fill="#2F6FD1" direction="rtl">
      {board}
    </text>
    <g transform="translate(160 560)">
      <circle cx={0} cy={0} r={60} fill="#FF6B6B" />
      <path d="M0 -60 q10 -30 30 -36" stroke="#4CAF50" strokeWidth={10} fill="none" />
    </g>
    <g transform="translate(900 560)">
      <polygon points="0,-70 20,-20 72,-20 30,12 46,64 0,32 -46,64 -30,12 -72,-20 -20,-20" fill="#FFC93C" />
    </g>
    <rect x={-60} y={720} width={1200} height={26} fill="#9AA6B2" />
    {/* window with light beams */}
    <g>
      <rect x={1290} y={60} width={420} height={640} rx={14} fill="#9FD8F7" stroke="#C99A68" strokeWidth={16} />
      <line x1={1500} y1={60} x2={1500} y2={700} stroke="#C99A68" strokeWidth={12} />
      <path d={`M1290 120 L700 1600 L1500 1600 L1710 700Z`} fill="url(#beam)" opacity={0.6 + 0.1 * Math.sin(f / 30)} />
    </g>
    <g>
      <rect x={-560} y={150} width={330} height={420} rx={12} fill="#BFE3C4" stroke="#7DB487" strokeWidth={10} />
      <circle cx={-395} cy={300} r={70} fill="#FFD166" />
      <path d="M-500 520 q100 -120 210 0" fill="#64B6AC" />
    </g>
  </g>
);

export const Desk: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-300} y={-40} width={600} height={60} rx={14} fill="url(#wood)" />
    <rect x={-300} y={-40} width={600} height={14} rx={7} fill="#F3C993" />
    <rect x={-280} y={20} width={560} height={320} fill="#B9804A" />
    <rect x={-280} y={20} width={560} height={40} fill="#000" opacity={0.15} />
  </g>
);

/* ---------------------------------------------------------------- helpers */

export const Shot: React.FC<{ from: number; to: number; children: (f: number, l: number) => React.ReactNode }> = ({ from, to, children }) => {
  return (
    <Sequence from={from} durationInFrames={to - from} layout="none">
      <ShotInner from={from} render={children} />
    </Sequence>
  );
};
export const ShotInner: React.FC<{ from: number; render: (f: number, l: number) => React.ReactNode }> = ({ from, render }) => {
  const l = useCurrentFrame();
  return <AbsoluteFill>{render(from + l, l)}</AbsoluteFill>;
};

/** Background classmates seated behind desks. */
export const Classmates: React.FC<{ f: number; laugh?: number; y?: number }> = ({ f, laugh = 0, y = 1240 }) => {
  const kids = [
    { x: -260, hair: "#2A1A12", seed: 1 },
    { x: 140, hair: "#5A3A22", seed: 2 },
    { x: 980, hair: "#1E1410", seed: 3 },
    { x: 1360, hair: "#7A4A2A", seed: 4 },
  ];
  return (
    <g>
      {kids.map((k) => {
        const bounce = laugh > 0 ? Math.abs(Math.sin(f / 3 + k.seed)) * 16 * laugh : 0;
        return (
          <g key={k.x}>
            <Kid x={k.x} y={y + 120 - bounce} s={0.42} who="extra" hair={k.hair} seated expr={laugh > 0.3 ? "laugh" : "smile"} blink={blinkAt(f, k.seed)} look={[0.4, 0]} tilt={laugh * Math.sin(f / 4 + k.seed) * 6} armL={laugh > 0.3 ? { a: 30, b: 150 } : {}} armR={{}} />
            <Desk x={k.x} y={y + 40} s={0.5} />
          </g>
        );
      })}
    </g>
  );
};

export const Flash: React.FC<{ l: number; len?: number }> = ({ l, len = 6 }) => <AbsoluteFill style={{ background: "#fff", opacity: interpolate(l, [0, len], [0.7, 0], { extrapolateRight: "clamp" }), pointerEvents: "none" }} />;

/* ---------------------------------------------------------------- scenes */

const S1_END = line("L04-T").from; // exterior ends when the teacher's line block begins

const Exterior: React.FC = () => {
  const j1 = at("L01-J");
  const f2 = at("L02-F");
  const j3 = at("L03-J");
  return (
    <>
      {/* 1a: establishing, camera tilts down from the sky, Joanna walks in */}
      <Shot from={0} to={f2 - 8}>
        {(f, l) => {
          const k = ease(l, 0, 75);
          const walkK = ease(l, 20, j1 + 40);
          const jx = 1250 - 700 * walkK;
          const walking = l < j1 + 40;
          const waving = l > j1 - 6;
          const fy = interpolate(k, [0, 1], [420, 1120]);
          const z = interpolate(ease(l, 75, f2), [0, 1], [0.78, 1.05]);
          return (
            <Svg>
              <Cam fx={interpolate(ease(l, 75, f2), [0, 1], [540, 600])} fy={fy} z={z}>
                <SchoolYard f={f} />
                {[0, 1, 2].map((i) => {
                  const p = ((l * 3 + i * 260) % 900) / 900;
                  return <Kid key={i} x={300 + i * 120 - p * 40} y={1060 - p * 30} s={0.2 - p * 0.04} who="extra" hair={["#2A1A12", "#5A3A22", "#1E1410"][i]} walk={l / 4 + i} bag blink={0} expr="smile" />;
                })}
                <Kid x={220} y={1290} s={0.48} who="friend" expr="happy" blink={blinkAt(f, 2)} look={[0.6, 0]} talk={talkOf("friend", f)} armR={{ a: 20, b: 10 }} />
                <Kid
                  x={jx}
                  y={1330}
                  s={0.52}
                  who="joanna"
                  expr="happy"
                  walk={walking ? l / 4.2 : undefined}
                  blink={blinkAt(f, 1)}
                  look={[-0.5, 0]}
                  talk={talkOf("joanna", f)}
                  bag
                  armR={waving ? { a: 150 + Math.sin(l / 3) * 18, b: 175 + Math.sin(l / 3) * 25 } : { a: 14, b: 10 }}
                  armL={{ a: walking ? 10 + Math.sin(l / 4.2) * 14 : 12, b: 6 }}
                />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* 1b: two-shot, the friend asks */}
      <Shot from={f2 - 8} to={j3 - 6}>
        {(f, l) => (
          <Svg>
            <Cam fx={460} fy={940} z={1.45 + l * 0.0015}>
              <SchoolYard f={f} />
              <Kid x={220} y={1290} s={0.48} who="friend" expr="smile" blink={blinkAt(f, 2)} look={[0.7, -0.1]} talk={talkOf("friend", f)} tilt={-4} armR={{ a: 30, b: 120 }} />
              <Kid x={550} y={1330} s={0.52} who="joanna" expr="proud" blink={blinkAt(f, 1)} look={[-0.6, 0]} bag armR={{ a: 12, b: 8 }} armL={{ a: 12, b: 6 }} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* 1c: close-up, shock */}
      <Shot from={j3 - 6} to={S1_END}>
        {(f, l) => {
          const zoom = 2.4 + spring({ frame: l - 4, fps: 30, config: { stiffness: 260, damping: 12 } }) * 0.5;
          const shake = l < 16 ? Math.sin(l * 2.5) * 10 * (1 - l / 16) : 0;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={550 + shake} fy={890} z={zoom}>
                  <SchoolYard f={f} />
                  <Kid x={550} y={1330} s={0.52} who="joanna" expr="shock" blink={0} look={[0, -0.2]} talk={talkOf("joanna", f)} bag sweat={ease(l, 20, 34)} armL={{ a: 120, b: 160 }} armR={{ a: 120, b: 160 }} />
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: `repeating-conic-gradient(from 0deg at 50% 46%, rgba(255,255,255,0.0) 0deg 6deg, rgba(255,230,120,${0.35 * (1 - ease(l, 6, 30))}) 6deg 10deg)` }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="birds" at={0} />
      <Sfx name="bell" at={30} gain={0.6} />
      <Sfx name="steps" at={24} />
      <Sfx name="steps" at={84} gain={0.8} />
      <Sfx name="pop" at={j1 - 6} gain={0.7} />
      <Sfx name="scratch" at={j3 - 6} />
      <Sfx name="boing" at={j3 + 2} />
    </>
  );
};

const Class1: React.FC = () => {
  const t4 = at("L04-T");
  const j5 = at("L05-J");
  const start = S1_END;
  const rummage = line("L05-J").from;
  const endS2 = line("L06-T").from;
  return (
    <>
      {/* 2a: teacher at the board */}
      <Shot from={start} to={rummage}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={540 + l * 0.4} fy={860} z={0.98 + l * 0.0008}>
                <Classroom f={f} />
                <Teacher x={760} y={1300} s={0.7} expr="happy" blink={blinkAt(f, 5)} look={[-0.3, 0.1]} talk={talkOf("teacher", f)} book armL={{ a: 70 + Math.sin(l / 9) * 10 * (f > t4 ? 1 : 0), b: 130 }} armR={{ target: [100, -690] }} />
                <Classmates f={f} y={1380} />
              </Cam>
            </Svg>
            {l < 8 && <Flash l={l} />}
          </AbsoluteFill>
        )}
      </Shot>
      {/* 2b: Joanna rummages, items fly out */}
      <Shot from={rummage} to={j5 - 4}>
        {(f, l) => {
          const items = [
            { C: Crayons, t: 14, x: 820, rot: 18 },
            { C: Teddy, t: 34, x: 200, rot: -24 },
            { C: Sandwich, t: 54, x: 900, rot: 10 },
            { C: Crayons, t: 74, x: 150, rot: -8 },
          ];
          const hx = Math.sin(l / 2.2) * 50;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={1060} z={1.55}>
                  <Classroom f={f} />
                  <Kid x={600} y={1420} s={0.55} who="joanna" seated expr="worry" blink={blinkAt(f, 1)} look={[-0.8, 0.8]} sweat={ease(l, 40, 60)} armL={{ target: [-330 + hx * 0.6, -470] }} armR={{ target: [-250 - hx * 0.6, -450 + Math.cos(l / 2) * 30] }} tilt={-6 + Math.sin(l / 3) * 4} />
                  <Desk x={540} y={1340} s={1.05} />
                  <Backpack x={370} y={1320} s={0.55} open={1} />
                  {items.map((it, i) => {
                    const p = (l - it.t) / 20;
                    if (p < 0) return null;
                    const k = Math.min(1, p);
                    const x = 370 + (it.x - 370) * k;
                    const y = 1140 - Math.sin(k * Math.PI) * 260 + (k >= 1 ? 160 : 160 * k);
                    return <it.C key={i} x={x} y={y} s={0.32} rot={it.rot * k * 3} />;
                  })}
                  <Lunchbox x={760} y={1325} s={0.42} lid={0} />
                </Cam>
              </Svg>
              {l < 8 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* 2c: panic close-up */}
      <Shot from={j5 - 4} to={endS2}>
        {(f, l) => (
          <Svg>
            <Cam fx={540 + Math.sin(l / 5) * 6} fy={1060} z={2.25 + l * 0.0016}>
              <Classroom f={f} />
              <Kid x={540} y={1420} s={0.55} who="joanna" seated expr={l > 70 ? "worry" : "shock"} blink={blinkAt(f, 1)} look={[Math.sin(l / 10), 0]} talk={talkOf("joanna", f)} sweat={1} armL={{ a: 150, b: 200 }} armR={{ a: 150, b: 200 }} tilt={Math.sin(l / 6) * 5} />
              <Desk x={540} y={1340} s={1.05} />
              <Backpack x={250} y={1320} s={0.55} open={1} />
            </Cam>
          </Svg>
        )}
      </Shot>
      <Sfx name="whoosh" at={start} />
      <Sfx name="rummage" at={rummage + 4} />
      <Sfx name="pop" at={rummage + 14} />
      <Sfx name="squeak" at={rummage + 36} />
      <Sfx name="pop" at={rummage + 56} />
      <Sfx name="pop" at={rummage + 76} />
      <Sfx name="boing" at={j5 - 4} gain={0.7} />
    </>
  );
};

const Class2: React.FC = () => {
  const start = line("L06-T").from;
  const look = line("L07-J").from;
  const j7 = at("L07-J");
  const end = line("L08-T").from;
  const reveal = j7 - 22;
  return (
    <>
      {/* 3a: teacher walks over */}
      <Shot from={start} to={look}>
        {(f, l) => (
          <Svg>
            <Cam fx={600} fy={1000} z={1.25}>
              <Classroom f={f} />
              <Teacher x={interpolate(ease(l, 0, 30), [0, 1], [980, 820])} y={1460} s={0.72} expr="smile" walk={l < 30 ? l / 4 : undefined} blink={blinkAt(f, 5)} look={[-0.6, 0.3]} talk={talkOf("teacher", f)} tilt={-4} armL={{ a: 20, b: 60 }} armR={{ a: 14, b: 8 }} />
              <Kid x={420} y={1500} s={0.55} who="joanna" seated expr="worry" blink={blinkAt(f, 1)} look={[0.8, -0.4]} sweat={1} />
              <Desk x={420} y={1420} s={1.05} />
              <Lunchbox x={560} y={1405} s={0.42} />
              <Backpack x={300} y={1400} s={0.5} open={1} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* 3b: Joanna eyes the lunchbox, opens it slowly; reveal */}
      <Shot from={look} to={j7 + 28}>
        {(f, l) => {
          const lid = ease(f, reveal - 50, reveal);
          const pop = f > reveal ? spring({ frame: f - reveal, fps: 30, config: { stiffness: 200, damping: 10 } }) : 0;
          const zoomIn = 1.55 + ease(l, 0, reveal - look) * 0.45;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={490} fy={1190} z={zoomIn}>
                  <Classroom f={f} />
                  <Kid x={420} y={1500} s={0.55} who="joanna" seated expr={f > j7 - 4 ? "shock" : f > reveal ? "shock" : "worry"} blink={f > reveal ? 0 : blinkAt(f, 1)} look={[0.9, 0.9]} talk={talkOf("joanna", f)} armR={{ target: [270 + lid * -40, -170 - lid * 80] }} armL={{ a: 20, b: 40 }} />
                  <Desk x={420} y={1420} s={1.05} />
                  <Lunchbox x={560} y={1405} s={0.42} lid={lid} notebook stain={1} />
                  {pop > 0 && (
                    <g transform={`translate(560 1330) scale(${pop})`} opacity={1 - ease(f, reveal + 20, reveal + 40)}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <path key={i} d={`M0 0 L${Math.cos((i / 8) * Math.PI * 2) * 140} ${Math.sin((i / 8) * Math.PI * 2) * 140}`} stroke="#FFD23F" strokeWidth={10} strokeLinecap="round" />
                      ))}
                    </g>
                  )}
                </Cam>
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* 3c: holds the notebook up, class laughs */}
      <Shot from={j7 + 28} to={end}>
        {(f, l) => {
          const k = spring({ frame: l, fps: 30, config: { stiffness: 140, damping: 14 } });
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={560} fy={1060} z={1.15}>
                  <Classroom f={f} />
                  <Classmates f={f} laugh={ease(l, 4, 14)} y={1260} />
                  <Kid x={540} y={1560} s={0.6} who="joanna" seated expr={l < 40 ? "happy" : "laugh"} blink={blinkAt(f, 1)} look={[0.6, -0.3]} armL={{ a: 150 + Math.sin(l / 4) * 10, b: 170 }} armR={{ target: [240, -760 - k * 60] }} />
                  <Notebook x={540 + 0.6 * 250} y={1560 - 0.6 * (800 + k * 60)} s={0.5} rot={8 + Math.sin(l / 6) * 4} drip={ease(l, 10, 50)} />
                  <Desk x={540} y={1480} s={1.1} />
                </Cam>
              </Svg>
              {l < 8 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="whoosh" at={start} gain={0.7} />
      <Sfx name="steps" at={start + 2} gain={0.6} />
      <Sfx name="tiptoe" at={look + 4} />
      <Sfx name="creak" at={reveal - 45} />
      <Sfx name="tada" at={reveal} />
      <Sfx name="squish" at={reveal + 8} />
      <Sfx name="laugh" at={j7 + 30} />
      <Sfx name="sparkle" at={j7 + 28} gain={0.7} />
    </>
  );
};

const Ending: React.FC = () => {
  const start = line("L08-T").from;
  const j9 = line("L09-J").from;
  const j10 = line("L10-J").from;
  const j10v = at("L10-J");
  const titleAt = j10v + MOUTH["L10-J"].length + 6;
  return (
    <>
      {/* 4a: teacher smiles */}
      <Shot from={start} to={j9}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={700} fy={830} z={1.6 + l * 0.001}>
                <Classroom f={f} />
                <Teacher x={760} y={1480} s={0.72} expr="happy" blink={blinkAt(f, 5)} look={[-0.6, 0.4]} talk={talkOf("teacher", f)} tilt={-5} armL={{ a: 40, b: 100 }} armR={{ a: 20, b: 30 }} />
              </Cam>
            </Svg>
            {l < 8 && <Flash l={l} />}
          </AbsoluteFill>
        )}
      </Shot>
      {/* 4b: promise with a raised hand */}
      <Shot from={j9} to={j10}>
        {(f, l) => {
          const up = spring({ frame: l - 4, fps: 30, config: { stiffness: 220, damping: 11 } });
          return (
            <Svg>
              <Cam fx={540} fy={1080} z={1.55}>
                <Classroom f={f} />
                <Kid x={540} y={1520} s={0.58} who="joanna" seated expr="happy" blink={blinkAt(f, 1)} look={[0.4, -0.3]} talk={talkOf("joanna", f)} armR={{ a: 40 + up * 105, b: 40 + up * 130 }} armL={{ a: 16, b: 30 }} tilt={Math.sin(l / 8) * 3} />
                <Desk x={540} y={1440} s={1.05} />
                <Notebook x={360} y={1400} s={0.3} rot={-80} />
                <Lunchbox x={740} y={1415} s={0.36} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* 4c: turns to camera, whispers; then the title */}
      <Shot from={j10} to={1800}>
        {(f, l) => {
          const lean = ease(l, 0, 30);
          const giggle = f > titleAt - 30;
          const title = spring({ frame: f - titleAt, fps: 30, config: { stiffness: 160, damping: 10 } });
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={interpolate(lean, [0, 1], [1080, 960])} z={interpolate(lean, [0, 1], [1.7, 2.7])}>
                  <Classroom f={f} />
                  <Kid x={540} y={1520} s={0.58} who="joanna" seated expr={giggle ? "laugh" : "sly"} blink={giggle ? 0 : blinkAt(f, 1)} look={[0, 0]} talk={talkOf("joanna", f)} armsFront={!giggle} armL={giggle ? { a: 20, b: 120 } : { target: [-215, -700] }} armR={{ a: 16, b: 30 }} tilt={giggle ? Math.sin(f / 3) * 5 : -6} />
                  <Desk x={540} y={1440} s={1.05} />
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 50% 45%, transparent 50%, rgba(40,20,60,${0.45 * lean}) 100%)` }} />
              {f >= titleAt && (
                <AbsoluteFill style={{ background: `rgba(255,111,168,${0.92 * Math.min(1, title)})` }}>
                  <div dir="rtl" style={{ position: "absolute", top: 640, left: 80, right: 130, textAlign: "center", fontFamily: FONT, fontWeight: 800, color: "#fff", scale: String(title), textShadow: "0 8px 0 #C2407A, 0 18px 40px rgba(0,0,0,0.25)" }}>
                    <div style={{ fontSize: 80, lineHeight: 1.2 }}>يتبع في</div>
                    <div style={{ fontSize: 150, lineHeight: 1.15 }}>يوميات جوانا!</div>
                  </div>
                </AbsoluteFill>
              )}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="whoosh" at={start} gain={0.7} />
      <Sfx name="sparkle" at={j9 + 6} />
      <Sfx name="whoosh" at={j10 + 2} gain={0.6} />
      <Sfx name="giggle" at={titleAt - 30} />
      <Sfx name="swoosh" at={titleAt} />
    </>
  );
};

/** Episode title over the opening shot. */
const OpeningTitle: React.FC = () => {
  const f = useCurrentFrame();
  const k = spring({ frame: f - 8, fps: 30, config: { stiffness: 160, damping: 12 } });
  const out = interpolate(f, [62, 74], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (f > 76) return null;
  return (
    <div dir="rtl" style={{ position: "absolute", top: 260, left: 80, right: 130, textAlign: "center", fontFamily: FONT, color: "#fff", opacity: out, scale: String(0.6 + 0.4 * k) }}>
      <div style={{ fontWeight: 800, fontSize: 120, lineHeight: 1.1, textShadow: "0 8px 0 #E0558F, 0 16px 40px rgba(0,0,0,0.25)" }}>يوميات جوانا</div>
      <div style={{ marginTop: 14, display: "inline-block", padding: "6px 34px", borderRadius: 40, background: "#FF6FA8", fontWeight: 700, fontSize: 50 }}>الحلقة ١: جوانا والواجب المفقود</div>
    </div>
  );
};

/** «يوميات جوانا» — Episode 1: the missing homework (60 s cartoon, three voices, lip-synced mouths). */
export const Joanna: React.FC = () => (
  <AbsoluteFill style={{ background: "#BFE6FF" }}>
    <Exterior />
    <Class1 />
    <Class2 />
    <Ending />
    <OpeningTitle />
    {T.scenes.map((s) => (
      <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/joanna/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />
    ))}
    <Audio
      src={staticFile("audio/joanna/music/theme.mp3")}
      volume={(f) => {
        const inVoice = T.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 6);
        const fd = interpolate(f, [0, 6, 1770, 1800], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (inVoice ? db(-22) : db(-15)) * fd;
      }}
    />
  </AbsoluteFill>
);

