import { loadFont as loadChanga } from "@remotion/google-fonts/Changa";
import { loadFont as loadAlmarai } from "@remotion/google-fonts/Almarai";
import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/forces-timeline.json";
import { createSound } from "../components/Sound";
import { cue, findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { db } from "../theme";

/**
 * «حماة الوطن» — a national tribute in a cinematic documentary style.
 * Photos: supplied by the store owner (official sources); they are cropped so no source logo or watermark shows,
 * and the flag is always shown whole and unmirrored. Air and air-defence scenes are motion graphics (no real equipment).
 */
// Titles: Changa (strong, condensed, military feel). Spoken text: Almarai (clean Saudi-designed sans).
const KUFI = loadChanga("normal", { weights: ["500", "700", "800"], subsets: ["arabic"] }).fontFamily;
const SANS = loadAlmarai("normal", { weights: ["400", "700", "800"], subsets: ["arabic"] }).fontFamily;
const GOLD = "#E2C17B";

type FId = "F1-Open" | "F2-Land" | "F3-Air" | "F4-Sea" | "F5-Defense" | "F6-Unity" | "F7-Close";
export const fTimeline = data as TimelineData;
const getF = (id: FId) => findScene(fTimeline, id);
const { Sfx, SceneVoice } = createSound(fTimeline, "audio/forces", {
  wind: db(-16),
  flag: db(-15),
  boots: db(-15),
  engine: db(-17),
  jet: db(-13),
  waves: db(-16),
  radar: db(-16),
  hit: db(-8),
  riser: db(-13),
  whoosh: db(-14),
});
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });

// ------------------------------------------------------------ picture helpers
/** A photo filling the vertical frame, panning across it (cx in image pixels) and pushing in. */
const Pan: React.FC<{ src: string; W: number; H: number; cx: [number, number]; zoom?: [number, number]; cy?: number; style?: React.CSSProperties }> = ({ src, W, H, cx, zoom = [1.02, 1.1], cy, style }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(f, [0, durationInFrames], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
  const z = zoom[0] + (zoom[1] - zoom[0]) * t;
  const s = (1920 / H) * z;
  const x = cx[0] + (cx[1] - cx[0]) * t;
  const y = cy ?? H / 2;
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <Img src={staticFile(src)} style={{ position: "absolute", width: W * s, height: H * s, left: 540 - x * s, top: 960 - y * s }} />
    </AbsoluteFill>
  );
};

/** The whole photo across the width (so the flag is never cut), over a blurred, darkened copy of itself. */
const Letterbox: React.FC<{ src: string; W: number; H: number; zoom?: [number, number]; top?: number }> = ({ src, W, H, zoom = [1, 1.06], top = 600 }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], zoom, clamp);
  const h = (1080 / W) * H;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", width: (1920 / H) * W * 1.1, height: 1920 * 1.1, left: 540 - ((1920 / H) * W * 1.1) / 2, top: -96, filter: "blur(40px) brightness(0.35) saturate(1.2)" }} />
      <div style={{ position: "absolute", left: 0, top, width: 1080, height: h, overflow: "hidden", boxShadow: "0 0 80px rgba(0,0,0,0.8)" }}>
        <Img src={staticFile(src)} style={{ width: 1080, height: h, scale: String(z) }} />
      </div>
    </AbsoluteFill>
  );
};

/** Cinematic grade: contrast, teal/orange split, vignette, light grain and a slow light leak. */
const Grade: React.FC<{ leak?: string }> = ({ leak = "rgba(255,170,90,0.18)" }) => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,60,80,0.28), transparent 40%, transparent 60%, rgba(120,60,10,0.25))", mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at ${20 + Math.sin(f / 60) * 20}% 15%, ${leak}, transparent 70%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(85% 70% at 50% 45%, transparent 50%, rgba(0,0,0,0.8) 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: "overlay" }}>
        <svg width="1080" height="1920">
          <filter id="fg">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 10} />
          </filter>
          <rect width="1080" height="1920" filter="url(#fg)" />
        </svg>
      </AbsoluteFill>
    </>
  );
};

/** Section kicker, documentary lower-third style. */
const Kicker: React.FC<{ text: string; at?: number }> = ({ text, at = 8 }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 16);
  return (
    <div dir="rtl" style={{ position: "absolute", top: 260, right: 140, left: 80, display: "flex", alignItems: "center", gap: 18, opacity: p }}>
      <div style={{ width: 8, height: 64, background: GOLD, scale: `1 ${p}` }} />
      <div style={{ fontFamily: KUFI, fontWeight: 800, fontSize: 66, color: "#fff", letterSpacing: 1, textShadow: "0 4px 24px rgba(0,0,0,0.7)", translate: `${(1 - p) * 40}px 0px` }}>{text}</div>
    </div>
  );
};

/** Spoken words, a phrase at a time; the word being said turns gold. */
const Subs: React.FC<{ scene: SceneTiming; top?: number }> = ({ scene, top = 1440 }) => {
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
  const p = spring({ frame: frame - (chunk[0].start - 4), fps, config: { damping: 18, stiffness: 130, mass: 0.8 } });
  return (
    <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.32em", fontFamily: SANS, fontWeight: 800, fontSize: 58, lineHeight: 1.6, opacity: Math.min(1, p * 1.4), translate: `0px ${(1 - p) * 16}px` }}>
      {chunk.map((w, i) => {
        const on = frame >= w.start - 3;
        const active = on && (i === chunk.length - 1 || frame < chunk[i + 1].start - 3);
        return (
          <span key={`${idx}-${i}`} style={{ color: active ? GOLD : "#fff", opacity: on ? 1 : 0.3, textShadow: "0 3px 18px rgba(0,0,0,0.9)" }}>
            {(w.raw ?? w.text).replace(/[«»]/g, "")}
          </span>
        );
      })}
    </div>
  );
};

const Frame: React.FC<{ id: FId; children: React.ReactNode; kicker?: string; leak?: string; subsTop?: number; subsUntil?: number }> = ({ id, children, kicker, leak, subsTop, subsUntil }) => {
  const scene = getF(id);
  const fr = useCurrentFrame();
  const subsO = subsUntil === undefined ? 1 : interpolate(fr, [subsUntil - 6, subsUntil + 2], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {children}
      <Grade leak={leak} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 22%, transparent 66%, rgba(0,0,0,0.75) 100%)" }} />
      {kicker && <Kicker text={kicker} />}
      <AbsoluteFill style={{ opacity: subsO }}>
        <Subs scene={scene} top={subsTop} />
      </AbsoluteFill>
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={0} gain={0.7} />
    </AbsoluteFill>
  );
};

/** Main title: «حماة الوطن» with a gold rule and the subtitle. */
const Title: React.FC<{ at: number; top?: number }> = ({ at, top = 1240 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 18, stiffness: 80, mass: 1.1 } });
  const q = spring({ frame: f - at - 16, fps, config: { damping: 18, stiffness: 100, mass: 1 } });
  const sweep = interpolate(f, [at + 10, at + 50], [-40, 140], clamp);
  if (f < at) return null;
  return (
    <div dir="rtl" style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ position: "relative", overflow: "hidden", padding: "0 20px" }}>
        <div style={{ fontFamily: KUFI, fontWeight: 800, fontSize: 158, color: "#fff", lineHeight: 1.15, opacity: Math.min(1, p * 1.3), letterSpacing: 2, filter: `blur(${(1 - Math.min(1, p)) * 10}px)`, textShadow: "0 6px 40px rgba(0,0,0,0.8)" }}>حماة الوطن</div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep}%`, width: "20%", background: "linear-gradient(90deg, transparent, rgba(255,235,190,0.55), transparent)", mixBlendMode: "overlay" }} />
      </div>
      <div style={{ width: 360 * q, height: 3, background: GOLD }} />
      <div style={{ fontFamily: KUFI, fontWeight: 500, fontSize: 52, color: GOLD, opacity: q, letterSpacing: 2 }}>القوات المسلحة السعودية</div>
    </div>
  );
};

// ------------------------------------------------------------ scenes
const F1: React.FC = () => {
  const s = getF("F1-Open");
  const f = useCurrentFrame();
  const last = s.words[s.words.length - 1];
  const titleAt = last.end + 8;
  const black = interpolate(f, [0, 24], [1, 0], clamp);
  return (
    <Frame id="F1-Open" subsTop={1500} subsUntil={titleAt}>
      <Letterbox src="forces/salute-flag.jpg" W={1313} H={860} zoom={[1.0, 1.08]} top={420} />
      <Title at={titleAt} top={1180} />
      <AbsoluteFill style={{ background: "#000", opacity: black }} />
      {/* hide the subtitles once the title is up */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 75%, #000 100%)", opacity: ease(f, titleAt - 4, titleAt + 6) }} />
      <Sfx name="wind" at={0} />
      <Sfx name="flag" at={10} />
      <Sfx name="hit" at={titleAt} />
    </Frame>
  );
};

const F2: React.FC = () => {
  const s = getF("F2-Land");
  const f = useCurrentFrame();
  const cut = cue(s, "ويتدرّبون") - 6;
  const x = ease(f, cut - 8, cut + 8);
  return (
    <Frame id="F2-Land" kicker="البَرّ">
      <AbsoluteFill style={{ opacity: 1 - x }}>
        <Pan src="forces/land-soldiers.jpg" W={1067} H={860} cx={[420, 600]} zoom={[1.05, 1.16]} style={{ filter: "contrast(1.12) saturate(0.92)" }} />
      </AbsoluteFill>
      {f >= cut - 8 && (
        <AbsoluteFill style={{ opacity: x }}>
          <Pan src="forces/land-armor.jpg" W={1000} H={666} cx={[620, 760]} zoom={[1.02, 1.1]} cy={350} style={{ filter: "contrast(1.12) saturate(0.9)" }} />
        </AbsoluteFill>
      )}
      <Sfx name="boots" at={6} />
      <Sfx name="engine" at={cut} />
    </Frame>
  );
};

/** Generic jet silhouette (no specific aircraft type). */
const Jet: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 200 100">
    <path d="M196 50 L150 44 L110 14 L98 14 L112 44 L60 46 L40 30 L32 30 L38 48 L8 50 L38 52 L32 70 L40 70 L60 54 L112 56 L98 86 L110 86 L150 56 Z" fill="#1a1f26" />
    <path d="M150 46 L170 48 L150 50 Z" fill="#9fb4c8" opacity="0.6" />
  </svg>
);

const F3: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = f / durationInFrames;
  const shake = Math.sin(f * 1.3) * 2;
  const jets = [
    { dx: 0, dy: 0, s: 340 },
    { dx: -230, dy: 130, s: 270 },
    { dx: -190, dy: -150, s: 250 },
  ];
  return (
    <Frame id="F3-Air" kicker="الجو" leak="rgba(255,190,120,0.25)">
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #0b1d3a 0%, #2a4f7a 38%, #e59a5c 72%, #f3c48a 100%)" }} />
      <div style={{ position: "absolute", left: 640, top: 1180, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,226,170,0.95), rgba(255,180,90,0.25) 40%, transparent 70%)" }} />
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: ((random(`c${i}`) * 1400 - f * (2 + i * 0.6)) % 1600) - 300, top: 300 + random(`cy${i}`) * 1100, width: 700, height: 160, borderRadius: "50%", background: "rgba(255,240,225,0.18)", filter: "blur(30px)" }} />
      ))}
      <AbsoluteFill style={{ translate: `${shake}px ${shake * 0.5}px` }}>
        {jets.map((j, i) => {
          const x = interpolate(t, [0, 1], [-400, 1150]) + j.dx;
          const y = interpolate(t, [0, 1], [1250, 520]) + j.dy;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, rotate: "-26deg" }}>
              <div style={{ position: "absolute", right: j.s * 0.9, top: j.s * 0.24, width: 900, height: 6, background: "linear-gradient(270deg, rgba(255,255,255,0.75), transparent)", filter: "blur(2px)" }} />
              <Jet size={j.s} />
            </div>
          );
        })}
      </AbsoluteFill>
      <Sfx name="jet" at={4} />
    </Frame>
  );
};

const F4: React.FC = () => (
  <Frame id="F4-Sea" kicker="البحر" leak="rgba(140,220,255,0.15)">
    <Pan src="forces/navy.jpg" W={1531} H={860} cx={[620, 860]} zoom={[1.04, 1.14]} style={{ filter: "contrast(1.1) saturate(0.95)" }} />
    <Sfx name="waves" at={0} />
  </Frame>
);

const F5: React.FC = () => {
  const f = useCurrentFrame();
  const s = getF("F5-Defense");
  const ang = (f * 4) % 360;
  const blips = [
    { a: 40, r: 280, at: 20 },
    { a: 130, r: 200, at: 45 },
    { a: 300, r: 330, at: 70 },
  ];
  const lockAt = cue(s, "يرصد");
  const lock = ease(f, lockAt, lockAt + 12);
  return (
    <Frame id="F5-Defense" kicker="الدفاع الجوي" leak="rgba(90,255,170,0.10)">
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #020611 0%, #06122a 60%, #0d1a2a 100%)" }} />
      {Array.from({ length: 90 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: random(`x${i}`) * 1080, top: random(`y${i}`) * 1200, width: 2, height: 2, background: "#fff", opacity: 0.3 + 0.5 * Math.abs(Math.sin(f / 15 + i)) }} />
      ))}
      <svg width="1080" height="500" style={{ position: "absolute", left: 0, top: 1420 }}>
        <path d="M0 140 C 180 90, 300 120, 460 80 S 760 110, 1080 70 L1080 500 L0 500 Z" fill="#05080e" />
      </svg>
      {/* radar scope */}
      <div style={{ position: "absolute", left: 540 - 400, top: 520, width: 800, height: 800, borderRadius: "50%", border: "2px solid rgba(90,255,170,0.5)", background: "radial-gradient(circle, rgba(20,80,50,0.35), rgba(5,20,15,0.6))", overflow: "hidden" }}>
        {[1, 2, 3].map((k) => (
          <div key={k} style={{ position: "absolute", left: 400 - k * 130, top: 400 - k * 130, width: k * 260, height: k * 260, borderRadius: "50%", border: "1px solid rgba(90,255,170,0.25)" }} />
        ))}
        <div style={{ position: "absolute", left: 0, top: 399, width: 800, height: 1, background: "rgba(90,255,170,0.25)" }} />
        <div style={{ position: "absolute", left: 399, top: 0, width: 1, height: 800, background: "rgba(90,255,170,0.25)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from ${ang}deg, rgba(90,255,170,0.55), rgba(90,255,170,0) 50deg, transparent 360deg)` }} />
        {blips.map((b, i) => {
          const bx = 400 + Math.cos((b.a * Math.PI) / 180) * b.r;
          const by = 400 + Math.sin((b.a * Math.PI) / 180) * b.r;
          const o = f >= b.at ? 0.5 + 0.5 * Math.abs(Math.sin(f / 6)) : 0;
          return <div key={i} style={{ position: "absolute", left: bx - 9, top: by - 9, width: 18, height: 18, borderRadius: 9, background: i === 0 ? "#ffd76a" : "#7dffb2", opacity: o, boxShadow: `0 0 18px ${i === 0 ? "#ffd76a" : "#7dffb2"}` }} />;
        })}
        {/* lock-on brackets on the first contact */}
        {lock > 0 && (
          <div style={{ position: "absolute", left: 400 + Math.cos((40 * Math.PI) / 180) * 280 - 45, top: 400 + Math.sin((40 * Math.PI) / 180) * 280 - 45, width: 90, height: 90, scale: String(2 - lock), opacity: lock }}>
            {[0, 1, 2, 3].map((c) => (
              <div key={c} style={{ position: "absolute", [c < 2 ? "top" : "bottom"]: 0, [c % 2 ? "right" : "left"]: 0, width: 26, height: 26, borderTop: c < 2 ? `4px solid ${GOLD}` : undefined, borderBottom: c >= 2 ? `4px solid ${GOLD}` : undefined, borderLeft: c % 2 === 0 ? `4px solid ${GOLD}` : undefined, borderRight: c % 2 ? `4px solid ${GOLD}` : undefined } as React.CSSProperties} />
            ))}
          </div>
        )}
      </div>
      <Sfx name="radar" at={6} />
      <Sfx name="radar" at={lockAt} gain={0.8} />
    </Frame>
  );
};

const F6: React.FC = () => {
  const s = getF("F6-Unity");
  return (
    <Frame id="F6-Unity" leak="rgba(255,200,110,0.25)">
      <Pan src="forces/salute-flag.jpg" W={1313} H={860} cx={[470, 470]} zoom={[1.06, 1.14]} cy={520} />
      {/* the flag above is cut by this crop, so it is kept dark here and shown whole in the next scene */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.92) 26%, rgba(0,0,0,0) 44%)" }} />
      <Sfx name="riser" at={cue(s, "شعارها") - 30} />
      <Sfx name="boots" at={4} gain={0.7} />
    </Frame>
  );
};

const F7: React.FC = () => {
  const s = getF("F7-Close");
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const last = s.words[s.words.length - 1];
  const titleAt = last.end + 6;
  const out = interpolate(f, [durationInFrames - 24, durationInFrames], [0, 1], clamp);
  return (
    <Frame id="F7-Close" subsTop={1500} subsUntil={titleAt} leak="rgba(255,210,130,0.22)">
      <Letterbox src="forces/salute-flag.jpg" W={1313} H={860} zoom={[1.08, 1.0]} top={420} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 75%, #000 100%)", opacity: ease(f, titleAt - 4, titleAt + 6) }} />
      <Title at={titleAt} top={1180} />
      <AbsoluteFill style={{ background: "#000", opacity: out }} />
      <Sfx name="flag" at={0} />
      <Sfx name="hit" at={titleAt} />
    </Frame>
  );
};

const SCENES: { id: FId; C: React.FC }[] = [
  { id: "F1-Open", C: F1 },
  { id: "F2-Land", C: F2 },
  { id: "F3-Air", C: F3 },
  { id: "F4-Sea", C: F4 },
  { id: "F5-Defense", C: F5 },
  { id: "F6-Unity", C: F6 },
  { id: "F7-Close", C: F7 },
];

export const Forces: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <TransitionSeries>
      {SCENES.flatMap(({ id, C }) => {
        const s = getF(id);
        const items = [
          <TransitionSeries.Sequence key={id} name={id} durationInFrames={s.durationInFrames}>
            <C />
          </TransitionSeries.Sequence>,
        ];
        if (s.transitionFrames) items.push(<TransitionSeries.Transition key={`${id}-t`} presentation={fade()} timing={linearTiming({ durationInFrames: s.transitionFrames })} />);
        return items;
      })}
    </TransitionSeries>
    {fTimeline.audio?.music && (
      <Audio
        src={staticFile("audio/forces/music/epic.mp3")}
        volume={(f) => {
          const end = fTimeline.durationInFrames;
          const inVoice = fTimeline.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 4);
          const fd = interpolate(f, [0, 12, end - 40, end], [0, 1, 1, 0], clamp);
          return (inVoice ? db(-19) : db(-12)) * fd;
        }}
      />
    )}
  </AbsoluteFill>
);
