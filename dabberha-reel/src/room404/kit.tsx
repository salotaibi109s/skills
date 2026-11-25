import { loadFont as loadBaloo } from "@remotion/google-fonts/BalooBhaijaan2";
import { createSound } from "../components/Sound";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame } from "remotion";
import { findScene, type TimelineData } from "../lib/timing";
import { db } from "../theme";
import { CharDefs, Kid, type KidProps } from "../joanna/chars";

export const FONT = loadBaloo("normal", { weights: ["500", "700", "800"], subsets: ["arabic"] }).fontFamily;

export const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) });
export const blinkAt = (f: number, seed: number) => {
  const p = (f + seed * 37) % 104;
  return p < 3 ? [0.5, 1, 0.5][p] : 0;
};

export const Cam: React.FC<{ fx: number; fy: number; z: number; children: React.ReactNode }> = ({ fx, fy, z, children }) => <g transform={`translate(${540 - fx * z} ${960 - fy * z}) scale(${z})`}>{children}</g>;
export const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <CharDefs />
    {children}
  </svg>
);
export const Shot: React.FC<{ from: number; to: number; children: (f: number, l: number) => React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout="none">
    <ShotInner from={from} render={children} />
  </Sequence>
);
const ShotInner: React.FC<{ from: number; render: (f: number, l: number) => React.ReactNode }> = ({ from, render }) => {
  const l = useCurrentFrame();
  return <AbsoluteFill>{render(from + l, l)}</AbsoluteFill>;
};
export const Flash: React.FC<{ l: number; color?: string }> = ({ l, color = "#fff" }) => <AbsoluteFill style={{ background: color, opacity: interpolate(l, [0, 6], [0.7, 0], { extrapolateRight: "clamp" }) }} />;

export const GAINS: Record<string, number> = {
  hum: db(-20),
  flicker: db(-16),
  whoosh: db(-14),
  beep: db(-14),
  wrong: db(-12),
  correct: db(-11),
  door: db(-10),
  lab: db(-20),
  boot: db(-11),
  robot: db(-13),
  holo: db(-12),
  powerdown: db(-11),
  powerup: db(-11),
  zap: db(-12),
  glitch: db(-11),
  alarm: db(-13),
  tick: db(-14),
  safe: db(-10),
  reveal: db(-10),
  sting: db(-9),
  cheer: db(-12),
  tagline: db(-11),
};

/** Per-episode helpers bound to that episode's timeline and mouth data. */
export const makeEp = (T: TimelineData, MOUTH: Record<string, number[]>, dir: string) => {
  const line = (id: string) => findScene(T, id);
  const at = (id: string) => line(id).from + line(id).voFrom;
  const endOf = (id: string) => line(id).from + line(id).words[line(id).words.length - 1].end;
  const talkOf = (who: string, f: number) => {
    for (const s of T.scenes) {
      if (!s.id.endsWith(`-${who}`)) continue;
      const env = MOUTH[s.id];
      const i = f - (s.from + s.voFrom);
      if (env && i >= 0 && i < env.length) return Math.min(1, env[i] * 1.15) * (0.75 + 0.25 * Math.abs(Math.sin(f * 1.7)));
    }
    return 0;
  };
  const { Sfx } = createSound(T, `audio/${dir}`, GAINS);
  type P = Omit<KidProps, "who" | "s"> & { s?: number; f: number };
  /** Joanna — the same design and voice as «يوميات جوانا» (pink glasses). */
  const Jo: React.FC<P> = ({ f, s = 0.55, ...p }) => <Kid s={s} who="joanna" glasses="pink" talk={talkOf("J", f)} blink={p.blink ?? blinkAt(f, 1)} {...p} />;
  /** Faisal — 6 years old: smaller, white thobe, black hair, no glasses. */
  const Faisal: React.FC<P> = ({ f, s = 0.42, ...p }) => <Kid s={s} who="boy" hair="#151010" skinTone="J" talk={talkOf("F", f)} blink={p.blink ?? blinkAt(f, 7)} {...p} />;
  return { line, at, endOf, talkOf, Sfx, Jo, Faisal };
};

/* ---------------------------------------------------------------- Zero */

export type ZeroMood = "sleep" | "happy" | "neutral" | "smug" | "glitch" | "dim";
/** Zero: a small hovering robot with a screen face. (0,0) = point under the hover glow. ~520 units tall. */
export const Zero: React.FC<{ x: number; y: number; s: number; f: number; mood?: ZeroMood; talk?: number; look?: number; boot?: number; arm?: number }> = ({ x, y, s, f, mood = "neutral", talk = 0, look = 0, boot = 1, arm = 0 }) => {
  const hover = Math.sin(f / 10) * 14 * boot;
  const eye = mood === "glitch" ? "#FF4D6D" : "#5CF2FF";
  const on = mood !== "sleep" ? boot : 0;
  const flick = mood === "glitch" ? (Math.floor(f / 3) % 3 === 0 ? 0.3 : 1) : 1;
  const ey = -330 + hover;
  const ex = look * 18;
  const eyes = () => {
    if (on < 0.05) return <path d={`M-70 ${ey} h40 M30 ${ey} h40`} stroke="#3A4A5A" strokeWidth={10} strokeLinecap="round" />;
    if (mood === "happy") return <path d={`M${-80 + ex} ${ey + 10} q30 -40 60 0 M${20 + ex} ${ey + 10} q30 -40 60 0`} stroke={eye} strokeWidth={14} fill="none" strokeLinecap="round" opacity={on} />;
    if (mood === "smug")
      return (
        <g opacity={on}>
          <rect x={-82 + ex} y={ey - 8} width={56} height={20} rx={10} fill={eye} />
          <rect x={26 + ex} y={ey - 8} width={56} height={20} rx={10} fill={eye} />
        </g>
      );
    const h = mood === "dim" ? 14 : 44;
    return (
      <g opacity={on * flick * (mood === "dim" ? 0.6 : 1)}>
        <rect x={-78 + ex} y={ey - h / 2} width={48} height={h} rx={20} fill={eye} />
        <rect x={30 + ex} y={ey - h / 2} width={48} height={h} rx={20} fill={eye} />
        <circle cx={-66 + ex} cy={ey - h / 4} r={6} fill="#fff" opacity={0.8} />
        <circle cx={42 + ex} cy={ey - h / 4} r={6} fill="#fff" opacity={0.8} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <radialGradient id="zeroBody" cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#D7E1EA" />
          <stop offset="100%" stopColor="#8E9DAD" />
        </radialGradient>
        <radialGradient id="zeroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={eye} stopOpacity={0.6} />
          <stop offset="100%" stopColor={eye} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={0} rx={150} ry={30} fill="url(#zeroGlow)" opacity={on} />
      <ellipse cx={0} cy={0} rx={90} ry={16} fill="#000" opacity={0.25} />
      {/* body */}
      <g transform={`translate(0 ${hover})`}>
        <path d="M-120 -170 Q-130 -40 0 -40 Q130 -40 120 -170Z" fill="url(#zeroBody)" stroke="#7A8A9A" strokeWidth={4} />
        <circle cx={0} cy={-110} r={26} fill={eye} opacity={0.35 + 0.5 * on * (0.6 + 0.4 * Math.sin(f / 6))} />
        {/* arms */}
        <path d={`M-118 -140 q-50 ${20 - arm * 60} -60 ${60 - arm * 120}`} stroke="#B8C4D0" strokeWidth={26} strokeLinecap="round" fill="none" />
        <path d={`M118 -140 q50 20 60 60`} stroke="#B8C4D0" strokeWidth={26} strokeLinecap="round" fill="none" />
        <circle cx={-178} cy={-80 - arm * 120} r={20} fill="#9AA6B2" />
        <circle cx={178} cy={-80} r={20} fill="#9AA6B2" />
        {/* head */}
        <rect x={-150} y={-460} width={300} height={260} rx={110} fill="url(#zeroBody)" stroke="#7A8A9A" strokeWidth={4} />
        <rect x={-120} y={-420} width={240} height={180} rx={80} fill="#0F1B2A" />
        {eyes()}
        {on > 0.05 && talk > 0.05 && <rect x={-30} y={-285} width={60} height={6 + talk * 26} rx={8} fill={eye} opacity={on} />}
        {on > 0.05 && talk <= 0.05 && mood !== "dim" && <path d="M-24 -280 q24 14 48 0" stroke={eye} strokeWidth={8} fill="none" strokeLinecap="round" opacity={on} />}
        {/* antenna */}
        <line x1={0} y1={-460} x2={0} y2={-530} stroke="#8E9DAD" strokeWidth={10} />
        <circle cx={0} cy={-540} r={18} fill={mood === "glitch" ? "#FF4D6D" : "#FFD23F"} opacity={0.4 + 0.6 * on * Math.abs(Math.sin(f / 8))} />
        <ellipse cx={-80} cy={-430} rx={40} ry={16} fill="#fff" opacity={0.5} />
      </g>
    </g>
  );
};

/* ---------------------------------------------------------------- sets */

export const Corridor: React.FC<{ f: number; doorGlow?: number; open?: number }> = ({ f, doorGlow = 1, open = 0 }) => {
  const flick = Math.sin(f * 1.7) > 0.92 ? 0.4 : 1;
  return (
    <g>
      <rect x={-1400} y={-800} width={3900} height={2300} fill="#1C2A44" />
      <rect x={-1400} y={1250} width={3900} height={1400} fill="#243552" />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={-1400 + i * 260} y={1250} width={6} height={1400} fill="#2E4266" />
      ))}
      {/* lockers */}
      {[-900, -500, 1180, 1580].map((x) => (
        <g key={x}>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={x + i * 130} y={500} width={120} height={750} rx={8} fill="#2E5C8A" stroke="#1C3A5A" strokeWidth={6} />
              {[0, 1, 2].map((v) => (
                <rect key={v} x={x + i * 130 + 30} y={560 + v * 22} width={60} height={8} rx={4} fill="#1C3A5A" />
              ))}
            </g>
          ))}
        </g>
      ))}
      {/* ceiling lights */}
      {[-200, 540, 1280].map((x, i) => (
        <g key={x} opacity={i === 1 ? flick : 1}>
          <rect x={x - 160} y={60} width={320} height={24} rx={12} fill="#E8F6FF" />
          <path d={`M${x - 160} 84 L${x - 360} 1250 L${x + 360} 1250 L${x + 160} 84Z`} fill="#E8F6FF" opacity={0.05} />
        </g>
      ))}
      {/* door 404 */}
      <g>
        <rect x={300} y={420} width={480} height={830} rx={16} fill="#121A2A" />
        <rect x={330} y={450} width={420} height={800} rx={10} fill="#3A4660" />
        <g transform={`translate(${-open * 420} 0)`}>
          <rect x={330} y={450} width={420} height={800} rx={10} fill="#465472" stroke="#5CF2FF" strokeOpacity={0.4 * doorGlow} strokeWidth={6} />
          <text x={540} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={130} fill="#5CF2FF" opacity={0.6 + 0.4 * doorGlow * Math.abs(Math.sin(f / 12))} style={{ filter: "drop-shadow(0 0 18px #5CF2FF)" }}>
            404
          </text>
          <rect x={640} y={820} width={70} height={120} rx={10} fill="#0F1B2A" stroke="#5CF2FF" strokeWidth={3} />
          <circle cx={675} cy={850} r={8} fill="#5CF2FF" opacity={Math.abs(Math.sin(f / 7))} />
        </g>
        {open > 0 && <rect x={330} y={450} width={420 * open} height={800} fill="#BFF8FF" opacity={0.85} />}
      </g>
    </g>
  );
};

export const Lab: React.FC<{ f: number; dim?: number; alarm?: number }> = ({ f, dim = 0, alarm = 0 }) => (
  <g>
    <rect x={-1400} y={-800} width={3900} height={2300} fill="#0E2A33" />
    {Array.from({ length: 14 }).map((_, i) => (
      <line key={i} x1={-1400} x2={2500} y1={100 + i * 90} y2={100 + i * 90} stroke="#1A4A55" strokeWidth={2} />
    ))}
    <rect x={-1400} y={1250} width={3900} height={1400} fill="#12333D" />
    {/* glass tubes */}
    {[-60, 160, 900, 1120].map((x, i) => (
      <g key={x}>
        <rect x={x} y={420} width={150} height={830} rx={75} fill="#5CF2FF" opacity={0.12} stroke="#5CF2FF" strokeOpacity={0.5} strokeWidth={6} />
        {Array.from({ length: 6 }).map((_, b) => {
          const yy = 1200 - ((f * (1.5 + b * 0.3) + b * 140 + i * 60) % 760);
          return <circle key={b} cx={x + 40 + ((b * 37) % 70)} cy={yy} r={8 + (b % 3) * 4} fill="#BFF8FF" opacity={0.5} />;
        })}
      </g>
    ))}
    {/* screens */}
    <g>
      <rect x={340} y={240} width={400} height={260} rx={16} fill="#0A1620" stroke="#5CF2FF" strokeWidth={6} />
      <polyline points={Array.from({ length: 12 }).map((_, i) => `${360 + i * 33},${420 - Math.abs(Math.sin(i * 0.9 + f / 15)) * 120}`).join(" ")} stroke="#5CF2FF" strokeWidth={6} fill="none" />
      <circle cx={680} cy={290} r={10} fill={alarm > 0 ? "#FF4D6D" : "#8EE07A"} opacity={Math.abs(Math.sin(f / 6))} />
    </g>
    {/* workbench */}
    <rect x={-200} y={1150} width={1480} height={40} rx={12} fill="#3A5360" />
    <rect x={-160} y={1190} width={40} height={300} fill="#2A3E48" />
    <rect x={1200} y={1190} width={40} height={300} fill="#2A3E48" />
    <rect x={-1400} y={-800} width={3900} height={3500} fill="#000" opacity={dim * 0.5} />
    {alarm > 0 && <rect x={-1400} y={-800} width={3900} height={3500} fill="#FF4D6D" opacity={alarm * 0.18 * Math.abs(Math.sin(f / 4))} />}
  </g>
);

/** Translucent cyan hologram panel. */
export const Holo: React.FC<{ x: number; y: number; w: number; h: number; f: number; k?: number; red?: boolean; children?: React.ReactNode }> = ({ x, y, w, h, f, k = 1, red, children }) => {
  const c = red ? "#FF4D6D" : "#5CF2FF";
  return (
    <g opacity={k} transform={`translate(${x} ${y}) scale(1 ${0.2 + 0.8 * k})`}>
      <path d={`M${-w * 0.15} ${h / 2 + 260} L${-w / 2} ${h / 2} L${w / 2} ${h / 2} L${w * 0.15} ${h / 2 + 260}Z`} fill={c} opacity={0.08} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={20} fill={c} fillOpacity={0.12} stroke={c} strokeWidth={4} />
      {Array.from({ length: Math.floor(h / 24) }).map((_, i) => (
        <rect key={i} x={-w / 2} y={-h / 2 + i * 24 + ((f * 2) % 24)} width={w} height={2} fill={c} opacity={0.12} />
      ))}
      {children}
    </g>
  );
};

/** Big on-screen puzzle prompt with a 5-second countdown (HTML overlay). */
export const Countdown: React.FC<{ l: number; total: number; question?: string; top?: number }> = ({ l, total, question = "تقدر تحلّها قبل جوانا؟", top = 1430 }) => {
  const left = Math.max(0, Math.ceil(((total - l) / total) * 5));
  const pop = spring({ frame: l % Math.max(1, Math.round(total / 5)), fps: 30, config: { stiffness: 300, damping: 12 } });
  return (
    <>
      <div dir="rtl" style={{ position: "absolute", top: 210, left: 90, right: 140, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, color: "#FFD23F", textShadow: "0 4px 0 #6B4A00, 0 0 30px rgba(0,0,0,0.6)" }}>
        {question} 🧠
      </div>
      <div style={{ position: "absolute", top, left: 0, right: 0, display: "grid", placeItems: "center" }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, border: "10px solid #5CF2FF", background: "rgba(10,22,32,0.85)", display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 800, fontSize: 110, color: "#fff", scale: String(0.85 + 0.15 * pop), boxShadow: "0 0 40px rgba(92,242,255,0.6)" }}>
          {"٠١٢٣٤٥"[left]}
        </div>
      </div>
    </>
  );
};

/** Channel tagline card used at the end of every episode. */
export const TaglineCard: React.FC<{ l: number }> = ({ l }) => {
  const k = spring({ frame: l, fps: 30, config: { stiffness: 160, damping: 13 } });
  return (
    <div dir="rtl" style={{ position: "absolute", top: 1280, left: 80, right: 130, textAlign: "center", fontFamily: FONT, fontWeight: 800, color: "#fff", scale: String(k), background: "rgba(14,42,51,0.88)", border: "4px solid #5CF2FF", borderRadius: 36, padding: "20px 16px", boxShadow: "0 0 40px rgba(92,242,255,0.4)" }}>
      <div style={{ fontSize: 34, color: "#5CF2FF", fontWeight: 700 }}>ابنِ ذكاءك</div>
      <div style={{ fontSize: 56, lineHeight: 1.35 }}>فكّر، اكتشف، وخلّ ذكاءك يقودك!</div>
    </div>
  );
};

export const EndCard: React.FC<{ l: number; next: string; question?: string }> = ({ l, next, question }) => {
  const k = spring({ frame: l, fps: 30, config: { stiffness: 180, damping: 12 } });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(80% 60% at 50% 45%, #134E5E 0%, #071A22 100%)" }}>
      <div dir="rtl" style={{ position: "absolute", top: 480, left: 80, right: 130, textAlign: "center", fontFamily: FONT, color: "#fff", scale: String(k) }}>
        <div style={{ fontWeight: 700, fontSize: 46, color: "#5CF2FF", letterSpacing: 2 }}>سرّ الغرفة 404</div>
        {question && <div style={{ marginTop: 20, fontWeight: 800, fontSize: 70, color: "#FFD23F" }}>{question}</div>}
        <div style={{ marginTop: 30, fontWeight: 800, fontSize: 110, lineHeight: 1.1 }}>يتبع…</div>
        <div style={{ marginTop: 18, fontWeight: 700, fontSize: 56, lineHeight: 1.35, color: "#BFF8FF" }}>{next}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Small series tag in the corner for the first 3 seconds. */
export const Tag: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [4, 12, 80, 92], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div dir="rtl" style={{ position: "absolute", top: 180, right: 140, padding: "8px 26px", borderRadius: 30, background: "rgba(14,42,51,0.9)", border: "3px solid #5CF2FF", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 36, opacity: o }}>
      {text}
    </div>
  );
};
