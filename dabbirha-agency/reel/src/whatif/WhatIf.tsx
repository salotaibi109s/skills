import { loadFont as loadNaskh } from "@remotion/google-fonts/NotoNaskhArabic";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansArabic";
import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/whatif-timeline.json";
import { createSound } from "../components/Sound";
import { cue, findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { db } from "../theme";

/**
 * «ماذا لو؟» — the 3D shots are rendered by Blender (blender/whatif_shots.py, transparent WebM in public/whatif/);
 * here they get their sky, fog, glow and grain, Nasser's voice, the Arabic words, sound effects and music.
 */
const SERIF = loadNaskh("normal", { weights: ["500", "700"], subsets: ["arabic"] }).fontFamily;
const SANS = loadPlex("normal", { weights: ["400", "600"], subsets: ["arabic"] }).fontFamily;

type WId = "W1-Open" | "W2-AI" | "W3-Money" | "W4-Mind" | "W5-Net" | "W6-Alien" | "W7-Age" | "W8-History" | "W9-End";
export const wTimeline = data as TimelineData;
const getW = (id: WId) => findScene(wTimeline, id);
const { Sfx, SceneVoice } = createSound(wTimeline, "audio/whatif", {
  boom: db(-6),
  whoosh: db(-14),
  riser: db(-12),
  pulse: db(-8),
  glitch: db(-12),
  powerdown: db(-10),
  shimmer: db(-13),
  signal: db(-13),
  coins: db(-12),
  tick: db(-11),
});
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ------------------------------------------------------------ atmosphere
const Sky: React.FC<{ top: string; bottom: string; nebula: string[] }> = ({ top, bottom, nebula }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`, overflow: "hidden" }}>
      {nebula.map((c, i) => (
        <div key={i} style={{ position: "absolute", left: [-200, 380, 60][i % 3] + Math.sin(f / 90 + i) * 40, top: [200, 900, 1400][i % 3] + Math.cos(f / 110 + i) * 40, width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${c} 0%, transparent 65%)`, opacity: 0.55 }} />
      ))}
      {Array.from({ length: 140 }).map((_, i) => {
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (14 + (i % 9)) + i));
        const s = random(`s${i}`) < 0.9 ? 2 : 4;
        return <div key={i} style={{ position: "absolute", left: random(`x${i}`) * 1080, top: random(`y${i}`) * 1920, width: s, height: s, borderRadius: s, background: "#fff", opacity: tw * (0.35 + random(`o${i}`) * 0.6) }} />;
      })}
    </AbsoluteFill>
  );
};

const Fog: React.FC<{ color?: string }> = ({ color = "rgba(160,190,255,0.08)" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: -400 + ((f * (0.6 + i * 0.3) + i * 500) % 1900) - 300, top: 1150 + i * 180, width: 1300, height: 420, borderRadius: "50%", background: color, filter: "blur(50px)" }} />
      ))}
    </AbsoluteFill>
  );
};

const Grade: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(85% 70% at 50% 45%, transparent 45%, rgba(0,0,0,0.82) 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay" }}>
        <svg width="1080" height="1920">
          <filter id="g">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12} />
          </filter>
          <rect width="1080" height="1920" filter="url(#g)" />
        </svg>
      </AbsoluteFill>
    </>
  );
};

/** The Blender render, plus a blurred copy screened on top for glow. */
const Shot3D: React.FC<{ name: string; glow?: number; style?: React.CSSProperties }> = ({ name, glow = 0.75, style }) => (
  <AbsoluteFill style={style}>
    <OffthreadVideo src={staticFile(`whatif/${name}.webm`)} transparent muted />
    {glow > 0 && (
      <AbsoluteFill style={{ filter: "blur(22px) brightness(1.5) saturate(1.3)", mixBlendMode: "screen", opacity: glow }}>
        <OffthreadVideo src={staticFile(`whatif/${name}.webm`)} transparent muted />
      </AbsoluteFill>
    )}
  </AbsoluteFill>
);

/** Spoken words, a phrase at a time, in a documentary style; the word being said turns gold. */
const Subs: React.FC<{ scene: SceneTiming; top?: number; size?: number }> = ({ scene, top = 1450, size = 64 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of scene.words) {
    cur.push(w);
    if (cur.length >= 5 || /[،,.؟?!…:]$/.test(w.raw ?? w.text)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  let idx = -1;
  chunks.forEach((c, i) => {
    if (frame >= c[0].start - 4) idx = i;
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const p = spring({ frame: frame - (chunk[0].start - 4), fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  return (
    <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.3em", fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 1.5, opacity: Math.min(1, p * 1.4), translate: `0px ${(1 - p) * 20}px`, filter: `blur(${(1 - Math.min(1, p)) * 6}px)` }}>
      {chunk.map((w, i) => {
        const on = frame >= w.start - 3;
        const active = on && (i === chunk.length - 1 || frame < chunk[i + 1].start - 3);
        return (
          <span key={`${idx}-${i}`} style={{ color: active ? "#FFD27A" : "#fff", opacity: on ? 1 : 0.25, textShadow: active ? "0 0 26px rgba(255,200,110,0.65)" : "0 2px 18px rgba(0,0,0,0.8)" }}>
            {(w.raw ?? w.text).replace(/[«»]/g, "")}
          </span>
        );
      })}
    </div>
  );
};

/** Small chapter tag, like a documentary lower-third. */
const Tag: React.FC<{ n: string; text: string }> = ({ n, text }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [6, 20, 70, 90], [0, 1, 1, 0], clamp);
  return (
    <div dir="rtl" style={{ position: "absolute", top: 220, left: 80, right: 140, display: "flex", alignItems: "center", gap: 18, opacity: o, fontFamily: SANS, color: "rgba(255,255,255,0.85)" }}>
      <div style={{ fontWeight: 600, fontSize: 30, color: "#FFD27A", letterSpacing: 2 }}>{n}</div>
      <div style={{ width: 60 * o, height: 2, background: "#FFD27A" }} />
      <div style={{ fontWeight: 400, fontSize: 30 }}>{text}</div>
    </div>
  );
};

const Frame: React.FC<{ id: WId; sky: [string, string, string[]]; shot: string; glow?: number; tag?: [string, string]; children?: React.ReactNode; shotStyle?: React.CSSProperties; fog?: string; subsUntil?: number }> = ({ id, sky, shot, glow, tag, children, shotStyle, fog, subsUntil }) => {
  const scene = getW(id);
  const f = useCurrentFrame();
  const subsOn = subsUntil === undefined ? 1 : interpolate(f, [subsUntil - 8, subsUntil], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <Sky top={sky[0]} bottom={sky[1]} nebula={sky[2]} />
      <Shot3D name={shot} glow={glow} style={shotStyle} />
      <Fog color={fog} />
      {children}
      {tag && <Tag n={tag[0]} text={tag[1]} />}
      <Grade />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.55) 74%, rgba(0,0,0,0.55) 86%, transparent 100%)", opacity: subsOn }} />
      <AbsoluteFill style={{ opacity: subsOn }}>
        <Subs scene={scene} />
      </AbsoluteFill>
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={0} gain={0.8} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ scenes
const W1: React.FC = () => {
  const s = getW("W1-Open");
  const f = useCurrentFrame();
  const g0 = cue(s, "لم");
  const glitch = f >= g0 && f < g0 + 30 && Math.floor(f / 3) % 2 === 0;
  const tFlash = cue(s, "حقيقة");
  const flash = interpolate(f, [tFlash - 2, tFlash + 2, tFlash + 16], [0, 0.55, 0], clamp);
  return (
    <Frame id="W1-Open" sky={["#02040a", "#081226", ["rgba(40,90,200,0.25)", "rgba(120,60,200,0.18)"]]} shot="earth" glow={0.45} shotStyle={{ filter: glitch ? "drop-shadow(8px 0 0 rgba(255,0,80,0.7)) drop-shadow(-8px 0 0 rgba(0,220,255,0.7))" : undefined, translate: glitch ? `${(random(`gx${f}`) - 0.5) * 30}px 0px` : undefined }}>
      {/* atmosphere halo */}
      <div style={{ position: "absolute", left: 540 - 520, top: 960 - 520 - 60, width: 1040, height: 1040, borderRadius: "50%", background: "radial-gradient(circle, transparent 54%, rgba(90,170,255,0.35) 60%, transparent 70%)", opacity: interpolate(f, [0, 60], [0, 1], clamp) }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      <Sfx name="pulse" at={4} />
      <Sfx name="glitch" at={g0} />
      <Sfx name="boom" at={tFlash - 2} gain={0.8} />
    </Frame>
  );
};

const W2: React.FC = () => {
  const s = getW("W2-AI");
  return (
    <Frame id="W2-AI" sky={["#02060c", "#06162a", ["rgba(60,200,255,0.2)", "rgba(140,100,255,0.2)"]]} shot="ai" glow={0.9} tag={["٠١", "الذكاء"]}>
      <Sfx name="glitch" at={cue(s, "أذكى")} gain={0.9} />
      <Sfx name="shimmer" at={cue(s, "الآلات") - 6} gain={0.6} />
    </Frame>
  );
};

const W3: React.FC = () => {
  const s = getW("W3-Money");
  return (
    <Frame id="W3-Money" sky={["#0a0703", "#1c1206", ["rgba(255,180,60,0.18)", "rgba(120,70,20,0.2)"]]} shot="money" glow={0.35} fog="rgba(255,200,120,0.07)" tag={["٠٢", "المال"]}>
      <Sfx name="coins" at={6} />
      <Sfx name="whoosh" at={cue(s, "اختفى")} />
    </Frame>
  );
};

const W4: React.FC = () => {
  const s = getW("W4-Mind");
  return (
    <Frame id="W4-Mind" sky={["#090311", "#1a0a26", ["rgba(255,90,200,0.2)", "rgba(80,180,255,0.18)"]]} shot="mind" glow={0.9} tag={["٠٣", "الأفكار"]}>
      <Sfx name="pulse" at={cue(s, "أفكارك") - 4} />
      <Sfx name="shimmer" at={cue(s, "أسرارك") - 6} />
    </Frame>
  );
};

const W5: React.FC = () => {
  const s = getW("W5-Net");
  const f = useCurrentFrame();
  const off = cue(s, "انقطع");
  const dark = interpolate(f, [off + 30, off + 80], [0, 0.45], clamp);
  return (
    <Frame id="W5-Net" sky={["#01030a", "#040b1c", ["rgba(60,140,255,0.2)"]]} shot="net" glow={0.9} tag={["٠٤", "الإنترنت"]}>
      <AbsoluteFill style={{ background: "#000", opacity: dark }} />
      <Sfx name="powerdown" at={off + 4} />
      <Sfx name="glitch" at={off + 20} gain={0.6} />
    </Frame>
  );
};

const W6: React.FC = () => {
  const s = getW("W6-Alien");
  return (
    <Frame id="W6-Alien" sky={["#03020a", "#120a24", ["rgba(140,90,255,0.25)", "rgba(80,255,180,0.12)", "rgba(255,120,200,0.12)"]]} shot="alien" glow={0.6} tag={["٠٥", "الفضاء"]}>
      <Sfx name="signal" at={cue(s, "حياة") - 10} />
    </Frame>
  );
};

const W7: React.FC = () => {
  const s = getW("W7-Age");
  return (
    <Frame id="W7-Age" sky={["#02070a", "#071a1e", ["rgba(80,230,255,0.18)", "rgba(255,120,220,0.16)"]]} shot="age" glow={0.9} tag={["٠٦", "العمر"]}>
      <Sfx name="tick" at={cue(s, "مئات") - 8} />
    </Frame>
  );
};

const W8: React.FC = () => {
  const s = getW("W8-History");
  const f = useCurrentFrame();
  const tQ = cue(s, "فمن");
  const tEnd = cue(s, "الغد");
  const shake = f > tQ && f < tEnd + 10 ? (random(`k${f}`) - 0.5) * interpolate(f, [tQ, tEnd], [0, 10], clamp) : 0;
  return (
    <Frame id="W8-History" sky={["#020208", "#0c0618", ["rgba(140,90,255,0.2)", "rgba(255,200,90,0.12)"]]} shot="tunnel" glow={0.8} shotStyle={{ translate: `${shake}px ${shake * 0.6}px` }}>
      <Sfx name="riser" at={tQ - 30} />
      <Sfx name="boom" at={tEnd + 6} />
      <Sfx name="whoosh" at={cue(s, "التاريخ")} gain={0.7} />
    </Frame>
  );
};

const W9: React.FC = () => {
  const s = getW("W9-End");
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const last = s.words[s.words.length - 1];
  const card = (last?.end ?? 330) + 12;
  const c1 = spring({ frame: f - card, fps, config: { damping: 16, stiffness: 90, mass: 1 } });
  const c2 = spring({ frame: f - card - 22, fps, config: { damping: 18, stiffness: 110, mass: 0.9 } });
  const dim = interpolate(f, [card - 10, card + 20], [0, 0.25], clamp);
  const lift = interpolate(f, [card - 14, card + 16], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  return (
    <Frame id="W9-End" sky={["#000000", "#0a0a14", ["rgba(255,210,122,0.12)", "rgba(120,140,255,0.12)"]]} shot="question" glow={0.5} subsUntil={card} shotStyle={{ translate: `0px ${-330 * lift}px`, scale: String(1 - 0.3 * lift) }}>
      {/* light from above onto the question mark */}
      <div style={{ position: "absolute", left: 540 - 380, top: -100, width: 760, height: 1500, background: "linear-gradient(180deg, rgba(255,240,210,0.22), transparent 85%)", clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)", filter: "blur(20px)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: dim }} />
      {f >= card && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 170, color: "#fff", opacity: c1, scale: String(0.9 + 0.1 * c1), filter: `blur(${(1 - Math.min(1, c1)) * 10}px)`, textShadow: "0 0 50px rgba(255,210,122,0.45)" }}>ماذا لو؟</div>
          <div style={{ fontFamily: SANS, fontWeight: 400, fontSize: 46, color: "rgba(255,255,255,0.85)", opacity: c2, translate: `0px ${(1 - c2) * 20}px` }}>سؤال واحد… وعالم من الاحتمالات.</div>
        </div>
      )}
      <Sfx name="boom" at={cue(s, "ماذا", 2) - 4} gain={0.7} />
      <Sfx name="shimmer" at={card} />
    </Frame>
  );
};

const SCENES: { id: WId; C: React.FC }[] = [
  { id: "W1-Open", C: W1 },
  { id: "W2-AI", C: W2 },
  { id: "W3-Money", C: W3 },
  { id: "W4-Mind", C: W4 },
  { id: "W5-Net", C: W5 },
  { id: "W6-Alien", C: W6 },
  { id: "W7-Age", C: W7 },
  { id: "W8-History", C: W8 },
  { id: "W9-End", C: W9 },
];

export const WhatIf: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <TransitionSeries>
      {SCENES.flatMap(({ id, C }) => {
        const s = getW(id);
        const items = [
          <TransitionSeries.Sequence key={id} name={id} durationInFrames={s.durationInFrames}>
            <C />
          </TransitionSeries.Sequence>,
        ];
        if (s.transitionFrames) items.push(<TransitionSeries.Transition key={`${id}-t`} presentation={fade()} timing={linearTiming({ durationInFrames: s.transitionFrames })} />);
        return items;
      })}
    </TransitionSeries>
    <Audio
      src={staticFile("audio/whatif/music/mystery.mp3")}
      volume={(f) => {
        const end = wTimeline.durationInFrames;
        const inVoice = wTimeline.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 4);
        const fd = interpolate(f, [0, 10, end - 50, end], [0, 1, 1, 0], clamp);
        return (inVoice ? db(-19) : db(-13)) * fd;
      }}
    />
  </AbsoluteFill>
);
