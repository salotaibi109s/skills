import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansArabic";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, getStaticFiles, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/claude-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { db } from "../theme";

export { cue } from "../lib/timing";
export type CSceneId = "C1-Overload" | "C2-Meet" | "C3-Files" | "C4-Artifacts" | "C5-Code" | "C6-Projects" | "C7-Computer" | "C8-Connect" | "C9-Build";
export const cTimeline = data as TimelineData;
export const getC = (id: CSceneId): SceneTiming => findScene(cTimeline, id);

export const AR = loadPlex("normal", { weights: ["300", "400", "500", "600", "700"], subsets: ["arabic", "latin"] }).fontFamily;
export const LAT = loadSora("normal", { weights: ["300", "400", "600", "700", "800"], subsets: ["latin"] }).fontFamily;
export const MONO = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;

export const K = {
  bg: "#08090D",
  bg2: "#10121A",
  ink: "#E9EDF6",
  dim: "rgba(233,237,246,0.62)",
  faint: "rgba(233,237,246,0.28)",
  blue: "#4C8DFF",
  cyan: "#67E4FF",
  violet: "#8E6CFF",
  red: "#FF4D5E",
  amber: "#FFB547",
  green: "#4BE3A0",
  glass: "rgba(120,170,255,0.07)",
  edge: "rgba(140,200,255,0.38)",
};

export const cGains: Record<string, number> = {
  drone: db(-12),
  pings: db(-15),
  freeze: db(-9),
  materialize: db(-9),
  scan: db(-13),
  link: db(-15),
  morph: db(-12),
  keys: db(-16),
  fix: db(-12),
  snap: db(-13),
  click: db(-12),
  whoosh: db(-15),
  impact: db(-7),
  riser: db(-14),
};
export const { Sfx, SceneVoice, Music } = createSound(cTimeline, "audio/claude", cGains);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = (f: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (f - a) / Math.max(1, b - a)));
  return t * t * (3 - 2 * t);
};
export const usePop = (at: number, stiffness = 160, damping = 18, mass = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness, mass } });
};

// ------------------------------------------------------------------ environment
export type Mood = "chaos" | "calm" | "build";
/** The evolving workspace: charcoal room, volumetric beams, floor reflection, monitor glow. */
export const Workspace: React.FC<{ mood: Mood; warmth?: number; beams?: number }> = ({ mood, warmth = 0, beams = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const accent = mood === "chaos" ? K.red : mood === "build" ? K.cyan : K.blue;
  const accent2 = mood === "chaos" ? "#FF8A4D" : K.violet;
  const flicker = mood === "chaos" ? 0.75 + 0.25 * Math.sin(frame * 1.7) * Math.sin(frame * 0.6) : 1;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${K.bg} 0%, ${K.bg2} 58%, #06070A 100%)`, overflow: "hidden" }}>
      {/* volumetric beams from above */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 180 + i * 300 + Math.sin(t / 3 + i) * 40, top: -200, width: 220, height: 1500, background: `linear-gradient(180deg, ${i === 1 ? accent2 : accent}33 0%, transparent 75%)`, filter: "blur(40px)", rotate: `${(i - 1) * 12}deg`, opacity: 0.6 * beams * flicker, transformOrigin: "top" }} />
      ))}
      {/* back wall glow */}
      <div style={{ position: "absolute", left: 540 - 600, top: 300, width: 1200, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${accent}2A 0%, transparent 65%)`, opacity: flicker }} />
      <div style={{ position: "absolute", left: 540 - 500 + Math.sin(t / 4) * 120, top: 700, width: 1000, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${accent2}22 0%, transparent 65%)` }} />
      {/* floor plane with perspective grid */}
      <div style={{ position: "absolute", left: -400, right: -400, top: 1180, height: 900, transform: "perspective(900px) rotateX(72deg)", transformOrigin: "top", backgroundImage: `linear-gradient(${accent}30 1.5px, transparent 1.5px), linear-gradient(90deg, ${accent}30 1.5px, transparent 1.5px)`, backgroundSize: "120px 120px", backgroundPosition: `0px ${(frame * (mood === "build" ? 3 : 1)) % 120}px`, maskImage: "linear-gradient(180deg, #000 0%, transparent 85%)", opacity: 0.55 }} />
      {/* fog */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1050, height: 400, background: `linear-gradient(180deg, transparent, ${accent}14 50%, transparent)`, filter: "blur(30px)" }} />
      {warmth > 0 && <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 45%, rgba(103,228,255,${0.12 * warmth}), transparent 70%)` }} />}
      {/* dust */}
      {Array.from({ length: 30 }).map((_, i) => {
        const y = (random(`dy${i}`) * 1920 - frame * (0.4 + random(`ds${i}`))) % 1920;
        return <div key={i} style={{ position: "absolute", left: random(`dx${i}`) * 1080, top: y < 0 ? y + 1920 : y, width: 3, height: 3, borderRadius: 2, background: "#fff", opacity: 0.12 + random(`do${i}`) * 0.25 }} />;
      })}
    </AbsoluteFill>
  );
};

/** Film grain + vignette + letterbox-free cinematic finish. */
export const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 31;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(110% 80% at 50% 48%, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id={`cg${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#cg${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ Rashed (consistent character)
export type Expr = "stressed" | "curious" | "amazed" | "relaxed" | "confident";
/**
 * Rashed — young Saudi man: short dark fade, trimmed beard, dark hoodie.
 * Same drawing in every scene; only expression, gaze and rim-light colour change.
 */
export const Rashed: React.FC<{ expr: Expr; look?: [number, number]; rim?: string; size?: number; tilt?: number; breath?: boolean }> = ({ expr, look = [0, 0], rim = K.blue, size = 620, tilt = 0, breath = true }) => {
  const frame = useCurrentFrame();
  const blinkPhase = (frame + 17) % 96;
  const blink = blinkPhase < 4 ? 1 - Math.abs(blinkPhase - 2) / 2 : 0;
  const br = breath ? Math.sin(frame / 22) * 4 : 0;
  const brow = { stressed: [-10, 8], curious: [-4, -6], amazed: [-14, -14], relaxed: [0, 0], confident: [2, -2] }[expr];
  const mouth = {
    stressed: "M222 404 Q260 396 298 404",
    curious: "M226 402 Q260 410 294 402",
    amazed: "M240 398 Q260 386 280 398 Q282 424 260 428 Q238 424 240 398 Z",
    relaxed: "M222 398 Q260 420 298 398",
    confident: "M218 396 Q262 426 304 394",
  }[expr];
  const eyeOpen = (expr === "amazed" ? 1.15 : expr === "stressed" ? 0.85 : 1) * (1 - blink);
  const gx = look[0] * 7;
  const gy = look[1] * 5;
  const id = `r${rim.replace("#", "")}`;
  return (
    <svg width={size} height={(size * 640) / 520} viewBox="0 0 520 640" style={{ overflow: "visible", rotate: `${tilt}deg`, translate: `0px ${br}px` }}>
      <defs>
        <linearGradient id={`${id}skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8A5A3E" />
          <stop offset="0.45" stopColor="#B8805C" />
          <stop offset="1" stopColor="#7A4E35" />
        </linearGradient>
        <linearGradient id={`${id}rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.75" stopColor={rim} stopOpacity="0" />
          <stop offset="1" stopColor={rim} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${id}hood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#23262F" />
          <stop offset="1" stopColor="#0F1116" />
        </linearGradient>
      </defs>
      {/* torso / hoodie */}
      <path d="M40 640 Q48 520 150 488 L210 470 Q260 500 310 470 L370 488 Q472 520 480 640 Z" fill={`url(#${id}hood)`} />
      <path d="M190 476 Q260 540 330 476" stroke="#2E323D" strokeWidth="14" fill="none" />
      <line x1="260" y1="520" x2="260" y2="640" stroke="#2E323D" strokeWidth="4" />
      <path d="M470 640 Q462 520 370 488" stroke={rim} strokeOpacity="0.55" strokeWidth="4" fill="none" />
      {/* neck */}
      <path d="M222 420 L222 482 Q260 500 298 482 L298 420 Z" fill="#7E5238" />
      {/* ears */}
      <ellipse cx="152" cy="300" rx="20" ry="34" fill="#9C6847" />
      <ellipse cx="368" cy="300" rx="20" ry="34" fill="#8C5B3F" />
      {/* head */}
      <path d="M160 250 Q160 150 260 146 Q360 150 360 250 L356 330 Q348 420 260 444 Q172 420 164 330 Z" fill={`url(#${id}skin)`} />
      {/* beard + mustache */}
      <path d="M166 318 Q170 410 260 446 Q350 410 354 318 Q342 376 300 392 Q260 372 220 392 Q178 376 166 318 Z" fill="#1E1712" opacity="0.92" />
      <path d="M222 382 Q260 366 298 382 Q282 392 260 388 Q238 392 222 382 Z" fill="#1E1712" />
      {/* mouth */}
      <path d={mouth} stroke="#3A1F14" strokeWidth="5" fill={expr === "amazed" ? "#2A1209" : "none"} strokeLinecap="round" />
      {/* hair: short fade with textured top */}
      <path d="M156 262 Q150 150 260 128 Q372 140 366 262 Q356 206 330 196 Q300 172 262 180 Q214 168 188 200 Q164 214 156 262 Z" fill="#15110E" />
      <path d="M180 196 Q230 150 300 160 Q340 168 352 210" stroke="#2A221C" strokeWidth="6" fill="none" opacity="0.8" />
      {/* brows */}
      <path d={`M196 ${262 + brow[0] * 0.4} Q218 ${250 + brow[1]} 242 ${258 + brow[0] * 0.2}`} stroke="#15110E" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d={`M278 ${258 + brow[0] * 0.2} Q302 ${250 + brow[1]} 324 ${262 + brow[0] * 0.4}`} stroke="#15110E" strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* eyes */}
      {[220, 300].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy="292" rx="20" ry={13 * eyeOpen} fill="#F3EEE8" />
          <circle cx={cx + gx} cy={292 + gy} r={8 * Math.min(1, eyeOpen + 0.2)} fill="#2B1A10" />
          <circle cx={cx + gx + 3} cy={289 + gy} r={2.4} fill="#fff" opacity={eyeOpen} />
          <path d={`M${cx - 21} 290 Q${cx} ${276 - (expr === "stressed" ? -3 : 0)} ${cx + 21} 290`} stroke="#3A2418" strokeWidth="4" fill="none" />
        </g>
      ))}
      {/* nose */}
      <path d="M262 300 Q258 336 248 350 Q260 358 274 350" stroke="#6E4630" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* screen light on the face (rim) */}
      <path d="M160 250 Q160 150 260 146 Q360 150 360 250 L356 330 Q348 420 260 444 Q172 420 164 330 Z" fill={`url(#${id}rim)`} style={{ mixBlendMode: "screen" }} />
      {expr === "stressed" && <path d="M342 238 q8 14 0 22 q-8 -8 0 -22z" fill="#9FD8FF" opacity="0.75" />}
    </svg>
  );
};

// ------------------------------------------------------------------ Claude (holographic character)
/** An elegant translucent white/cyan hologram: a soft core, orbiting rings, a projector cone and rising motes. */
export const Holo: React.FC<{ size?: number; intensity?: number; talk?: number }> = ({ size = 360, intensity = 1, talk = 0 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const pulse = 1 + 0.04 * Math.sin(frame / 6) + talk * 0.05 * Math.abs(Math.sin(frame / 2.5));
  const s = size;
  return (
    <div style={{ position: "relative", width: s, height: s * 1.5, opacity: intensity }}>
      {/* projector cone */}
      <div style={{ position: "absolute", left: s * 0.1, right: s * 0.1, top: s * 0.55, height: s * 0.95, background: "linear-gradient(0deg, rgba(103,228,255,0.35), rgba(103,228,255,0))", clipPath: "polygon(42% 100%, 58% 100%, 100% 0, 0 0)", filter: "blur(6px)" }} />
      <div style={{ position: "absolute", left: s * 0.36, right: s * 0.36, top: s * 1.46, height: 10, borderRadius: "50%", background: K.cyan, filter: "blur(4px)", opacity: 0.8 }} />
      {/* outer glow */}
      <div style={{ position: "absolute", left: 0, top: 0, width: s, height: s, borderRadius: "50%", background: "radial-gradient(circle, rgba(103,228,255,0.35) 0%, rgba(142,108,255,0.12) 45%, transparent 70%)", scale: String(pulse * 1.15) }} />
      {/* rings in 3D */}
      <div style={{ position: "absolute", left: 0, top: 0, width: s, height: s, perspective: 900 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", inset: s * (0.12 + i * 0.05), borderRadius: "50%", border: `${2 - i * 0.4}px solid rgba(${i === 1 ? "142,108,255" : "103,228,255"},${0.75 - i * 0.15})`, transform: `rotateX(${68 + i * 6}deg) rotateZ(${t * (40 + i * 25) * (i % 2 ? -1 : 1)}deg)`, boxShadow: `0 0 18px rgba(103,228,255,0.35)` }} />
        ))}
      </div>
      {/* core */}
      <div style={{ position: "absolute", left: s * 0.3, top: s * 0.3, width: s * 0.4, height: s * 0.4, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #FFFFFF 0%, #CFF6FF 30%, rgba(103,228,255,0.55) 62%, rgba(142,108,255,0.15) 100%)", boxShadow: "0 0 60px rgba(103,228,255,0.8), inset 0 0 30px rgba(255,255,255,0.6)", scale: String(pulse) }} />
      {/* inner facets (friendly, not robotic): two soft light arcs like a gentle expression */}
      <svg width={s * 0.4} height={s * 0.4} viewBox="0 0 100 100" style={{ position: "absolute", left: s * 0.3, top: s * 0.3, scale: String(pulse), opacity: 0.55 }}>
        <path d="M30 46 Q36 40 42 46" stroke="#0B3B66" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M58 46 Q64 40 70 46" stroke="#0B3B66" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d={`M38 64 Q50 ${70 + talk * 6} 62 64`} stroke="#0B3B66" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
      {/* rising motes */}
      {Array.from({ length: 14 }).map((_, i) => {
        const p = ((frame * (0.6 + random(`hm${i}`) * 0.6) + random(`ho${i}`) * 200) % 200) / 200;
        return <div key={i} style={{ position: "absolute", left: s * (0.3 + random(`hx${i}`) * 0.4), top: s * (1.4 - p * 1.3), width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: (1 - p) * 0.8, boxShadow: "0 0 8px #67E4FF" }} />;
      })}
    </div>
  );
};

/** Materialising version: particles converge into the hologram. */
export const HoloAppear: React.FC<{ at: number; size?: number; talk?: number }> = ({ at, size = 360, talk = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 40], [0, 1], clamp);
  return (
    <div style={{ position: "relative", width: size, height: size * 1.5 }}>
      <div style={{ opacity: ease(frame, at + 18, at + 46), filter: `blur(${(1 - p) * 10}px)`, scale: String(0.7 + 0.3 * p) }}>
        <Holo size={size} talk={talk} />
      </div>
      {p < 1 &&
        Array.from({ length: 40 }).map((_, i) => {
          const a = random(`pa${i}`) * Math.PI * 2;
          const r = (1 - p) * (300 + random(`pr${i}`) * 400);
          return <div key={i} style={{ position: "absolute", left: size / 2 + Math.cos(a) * r, top: size / 2 + Math.sin(a) * r, width: 5, height: 5, borderRadius: 3, background: i % 3 ? K.cyan : "#fff", opacity: frame >= at ? 0.9 * (1 - p * 0.6) : 0, boxShadow: `0 0 10px ${K.cyan}` }} />;
        })}
    </div>
  );
};

// ------------------------------------------------------------------ UI pieces
/** Holographic glass panel with corner brackets, scanlines and a faint reflection. */
export const Panel: React.FC<{ children?: React.ReactNode; w: number; h: number; title?: string; style?: React.CSSProperties; tilt?: number; tint?: string }> = ({ children, w, h, title, style, tilt = 0, tint = K.cyan }) => {
  const frame = useCurrentFrame();
  const corner = (x: number, y: number, r: number) => <div style={{ position: "absolute", left: x, top: y, width: 26, height: 26, borderTop: `2px solid ${tint}`, borderLeft: `2px solid ${tint}`, rotate: `${r}deg` }} />;
  return (
    <div style={{ position: "absolute", width: w, height: h, transform: `perspective(1600px) rotateY(${tilt}deg)`, ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: `linear-gradient(160deg, rgba(120,170,255,0.12), rgba(120,170,255,0.03))`, border: `1px solid ${K.edge}`, boxShadow: `0 0 40px rgba(76,141,255,0.18), inset 0 0 40px rgba(103,228,255,0.06)`, backdropFilter: "blur(4px)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 5px)", translate: `0px ${(frame * 0.6) % 5}px` }} />
        {title && (
          <div style={{ position: "absolute", left: 18, top: 12, fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: tint, opacity: 0.85 }}>{title}</div>
        )}
        {children}
      </div>
      {corner(-6, -6, 0)}
      {corner(w - 20, -6, 90)}
      {corner(w - 20, h - 20, 180)}
      {corner(-6, h - 20, 270)}
    </div>
  );
};

/** Chapter header: small English tag + Arabic title. */
export const Chapter: React.FC<{ n: string; en: string; ar: string; at?: number }> = ({ n, en, ar, at = 4 }) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 120, 20);
  const line = ease(frame, at, at + 24);
  return (
    <div style={{ position: "absolute", top: 230, left: 80, right: 140, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, opacity: p }}>
      <div dir="ltr" style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: K.cyan }}>
        {n} — {en}
      </div>
      <div style={{ width: 260 * line, height: 1.5, background: `linear-gradient(90deg, transparent, ${K.cyan})` }} />
      <div dir="rtl" style={{ fontFamily: AR, fontWeight: 600, fontSize: 52, color: K.ink, translate: `${(1 - p) * 30}px 0px` }}>{ar}</div>
    </div>
  );
};

/** «تمثيل توضيحي» — demonstrations are illustrative unless a real screen recording is supplied. */
export const Illustrative: React.FC<{ real?: boolean }> = ({ real }) => (
  <div dir="rtl" style={{ position: "absolute", top: 236, left: 80, padding: "6px 16px 9px", borderRadius: 999, border: `1px solid ${real ? K.green : "rgba(233,237,246,0.3)"}`, fontFamily: AR, fontWeight: 500, fontSize: 22, color: real ? K.green : K.dim, background: "rgba(8,9,13,0.5)" }}>
    {real ? "تسجيل شاشة حقيقي" : "تمثيل توضيحي"}
  </div>
);

/** If public/claude-demos/<id>.mp4 exists, that real recording is shown instead of the illustration. */
export const demoFile = (id: string) => {
  const f = getStaticFiles().find((x) => x.name === `claude-demos/${id}.mp4`);
  return f ? staticFile(`claude-demos/${id}.mp4`) : null;
};
export const DemoVideo: React.FC<{ src: string; w: number; h: number; style?: React.CSSProperties }> = ({ src, w, h, style }) => (
  <Panel w={w} h={h} style={style} title="SCREEN RECORDING">
    <div style={{ position: "absolute", inset: 46 }}>
      <Video src={src} muted objectFit="contain" style={{ width: "100%", height: "100%" }} />
    </div>
  </Panel>
);

/** Arabic subtitles: a phrase at a time, word by word, restrained. */
export const Subs: React.FC<{ scene: SceneTiming; top?: number }> = ({ scene, top = 1330 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of scene.words) {
    cur.push(w);
    if (cur.length >= 6 || /[،,.؟?!…:]$/.test(w.raw ?? w.text)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  let idx = -1;
  chunks.forEach((c, i) => {
    if (frame >= c[0].start - 3) idx = i;
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  return (
    <div dir="rtl" style={{ position: "absolute", top, left: 80, right: 140, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.26em", fontFamily: AR, fontWeight: 600, fontSize: 50, lineHeight: 1.45, textShadow: "0 3px 18px rgba(0,0,0,0.85)" }}>
      {chunk.map((w, i) => {
        const s = spring({ frame: frame - w.start + 3, fps, config: { damping: 18, stiffness: 260, mass: 0.5 } });
        const on = frame >= w.start - 3;
        const latin = /[A-Za-z]/.test(w.text);
        const active = on && (i === chunk.length - 1 || frame < chunk[i + 1].start);
        return (
          <span key={`${idx}-${i}`} dir={latin ? "ltr" : "rtl"} style={{ display: "inline-block", opacity: on ? Math.min(1, s * 1.5) : 0, translate: `0px ${(1 - s) * 16}px`, color: active ? K.cyan : K.ink, fontFamily: latin ? LAT : undefined, fontWeight: latin ? 600 : undefined, unicodeBidi: "isolate" }}>
            {(w.raw ?? w.text).replace(/[«»]/g, "")}
          </span>
        );
      })}
    </div>
  );
};

/** Camera: slow dolly with gentle parallax for everything inside. */
export const Camera: React.FC<{ children: React.ReactNode; from?: number; to?: number; x?: [number, number]; y?: [number, number]; origin?: string }> = ({ children, from = 1, to = 1.08, x = [0, 0], y = [0, 0], origin = "50% 45%" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const e = ease(frame, 0, durationInFrames);
  return <AbsoluteFill style={{ scale: String(from + (to - from) * e), translate: `${x[0] + (x[1] - x[0]) * e}px ${y[0] + (y[1] - y[0]) * e}px`, transformOrigin: origin }}>{children}</AbsoluteFill>;
};
