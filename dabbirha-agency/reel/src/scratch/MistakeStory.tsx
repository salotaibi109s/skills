import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import data from "../data/mistake1-timeline.json";
import type { TimelineData } from "../lib/timing";
import { Cam, ShotPlayer, type ShotDef, World } from "./art";
import { ar, Captions, clamp, ease, FollowButton, jolt, makeStory, MusicBed, NameChip, pop, RedVignette, SANS, Voices } from "./kit";

/** «غلطة غيّرت العالم» ١ — البنسلين. Voice: Jeddawi. Vintage-lab palette. */
export const mistakeTimeline = data as TimelineData;
const { Sfx, SceneVoice, at, start } = makeStory(mistakeTimeline, "audio/mistake1");
const T = mistakeTimeline.durationInFrames;
const txt = { fontFamily: SANS, fontWeight: 700 } as const;
const K = {
  night: "#101820", lab1: "#1E2E36", lab2: "#34525A", wall: "#3B5A5E", bench: "#7A5232", benchTop: "#946640",
  lamp: "#FFD98A", agar: "#E8CF7A", mold: "#4F8F3C", mold2: "#8CCB5E", germ: "#F6EFD2", germLine: "#C9A646",
  red: "#D7263D", teal: "#1F7A80", gold: "#F2B632", coat: "#F3F3EE", skin: "#F0C8A2", hair: "#5A3B2A", ink: "#1D1A22",
  hosp: "#CFE3D8", hosp2: "#9FC3B3", fog: "#8FA3AE",
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ------------------------------------------------------------ props
const Dish: React.FC<{ x: number; y: number; r: number; f: number; mold?: number; dirt?: number; dead?: number; germs?: number }> = ({ x, y, r, f, mold = 0, dirt = 0, dead = 0, germs = 1 }) => {
  const mx = r * 0.22;
  const my = -r * 0.18;
  const halo = r * 0.46;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 14} fill="rgba(210,235,240,0.18)" stroke="rgba(255,255,255,0.75)" strokeWidth={6} />
      <circle r={r * 0.93} fill={K.agar} />
      <circle r={r * 0.93} fill="url(#agarShade)" />
      {Array.from({ length: 70 }).map((_, i) => {
        const a = random(`ga${i}`) * Math.PI * 2;
        const d = Math.sqrt(random(`gd${i}`)) * r * 0.82;
        const gx = Math.cos(a) * d;
        const gy = Math.sin(a) * d;
        const near = Math.hypot(gx - mx, gy - my) < halo;
        const k = near ? dead : 0;
        const s = (7 + random(`gs${i}`) * 9) * germs * (1 - 0.55 * k);
        if (mold > 0.05 && Math.hypot(gx - mx, gy - my) < r * 0.28 * mold) return null;
        return <circle key={i} cx={gx} cy={gy} r={s} fill={k > 0.5 ? "#9A9488" : K.germ} stroke={k > 0.5 ? "#6E695F" : K.germLine} strokeWidth={2} opacity={1 - 0.5 * k} />;
      })}
      {dead > 0 && <circle cx={mx} cy={my} r={halo} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray="18 14" opacity={dead * 0.9} />}
      {mold > 0 && (
        <g transform={`translate(${mx} ${my}) scale(${mold})`}>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2 + random(`ma${i}`);
            const d = r * 0.12 + random(`md${i}`) * r * 0.1;
            return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={r * (0.08 + random(`mr${i}`) * 0.06)} fill={i % 2 ? K.mold : K.mold2} />;
          })}
          <circle r={r * 0.16} fill={K.mold} />
          <circle r={r * 0.09} fill="#3C7030" />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const d = r * 0.27 + Math.sin(f / 9 + i) * 3;
            return <circle key={`w${i}`} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={5} fill="#EAF6D8" opacity={0.8} />;
          })}
        </g>
      )}
      {dirt > 0 && (
        <g opacity={dirt}>
          {Array.from({ length: 7 }).map((_, i) => (
            <ellipse key={i} cx={(random(`dx${i}`) - 0.5) * r * 1.4} cy={(random(`dy${i}`) - 0.5) * r * 1.4} rx={14 + random(`dr${i}`) * 30} ry={10 + random(`dq${i}`) * 18} fill="#6B4A2A" opacity={0.45} />
          ))}
        </g>
      )}
      <path d={`M ${-r * 0.75} ${-r * 0.45} A ${r * 0.9} ${r * 0.9} 0 0 1 ${-r * 0.2} ${-r * 0.86}`} stroke="rgba(255,255,255,0.7)" strokeWidth={10} fill="none" strokeLinecap="round" />
    </g>
  );
};

const Defs: React.FC = () => (
  <defs>
    <radialGradient id="agarShade" cx="0.4" cy="0.35" r="0.7">
      <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
      <stop offset="1" stopColor="#8A6A1E" stopOpacity="0.25" />
    </radialGradient>
    <radialGradient id="lampGlow" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0" stopColor={K.lamp} stopOpacity="0.55" />
      <stop offset="1" stopColor={K.lamp} stopOpacity="0" />
    </radialGradient>
  </defs>
);

/** Doctor in a lab coat; feet at (x, y). */
const Doctor: React.FC<{ x: number; y: number; s?: number; f: number; walk?: number; arm?: number; flip?: boolean; bag?: boolean; look?: number }> = ({ x, y, s = 1, f, walk = 0, arm = 0, flip, bag, look = 0 }) => {
  const sw = Math.sin(f / 4) * 22 * walk;
  const bob = Math.abs(Math.sin(f / 4)) * 8 * walk;
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${flip ? -s : s} ${s})`}>
      <rect x={-48} y={-150} width={38} height={150} rx={14} fill="#2F3440" transform={`rotate(${sw} -29 -150)`} />
      <rect x={10} y={-150} width={38} height={150} rx={14} fill="#2F3440" transform={`rotate(${-sw} 29 -150)`} />
      <ellipse cx={-30 + sw} cy={0} rx={34} ry={14} fill="#1A1A1A" />
      <ellipse cx={30 - sw} cy={0} rx={34} ry={14} fill="#1A1A1A" />
      <path d="M -82 -300 L 82 -300 L 104 -110 L -104 -110 Z" fill={K.coat} stroke="#C9CCC4" strokeWidth={4} />
      <path d="M -24 -300 L 0 -250 L 24 -300 Z" fill="#7A2E2E" />
      <line x1={0} y1={-250} x2={0} y2={-112} stroke="#C9CCC4" strokeWidth={4} />
      <g transform={`rotate(${-12 - arm * 70 + sw * 0.6} -84 -290)`}>
        <rect x={-104} y={-296} width={36} height={150} rx={16} fill={K.coat} stroke="#C9CCC4" strokeWidth={3} />
        <circle cx={-86} cy={-142} r={18} fill={K.skin} />
      </g>
      <g transform={`rotate(${12 - sw * 0.6} 84 -290)`}>
        <rect x={68} y={-296} width={36} height={150} rx={16} fill={K.coat} stroke="#C9CCC4" strokeWidth={3} />
        <circle cx={86} cy={-142} r={18} fill={K.skin} />
        {bag && (
          <g transform="translate(86 -118)">
            <rect x={-50} y={0} width={100} height={70} rx={10} fill="#6B3F22" stroke="#3E2412" strokeWidth={4} />
            <rect x={-16} y={-12} width={32} height={14} rx={6} fill="none" stroke="#3E2412" strokeWidth={5} />
          </g>
        )}
      </g>
      <rect x={-18} y={-322} width={36} height={30} fill={K.skin} />
      <g transform={`translate(${look * 8} 0)`}>
        <ellipse cx={0} cy={-376} rx={58} ry={64} fill={K.skin} />
        <path d="M -60 -392 Q -58 -452 0 -452 Q 62 -452 60 -392 Q 30 -428 -10 -420 Q -40 -414 -60 -392 Z" fill={K.hair} />
        <circle cx={-22} cy={-378} r={15} fill="#fff" fillOpacity={0.35} stroke={K.ink} strokeWidth={4} />
        <circle cx={22} cy={-378} r={15} fill="#fff" fillOpacity={0.35} stroke={K.ink} strokeWidth={4} />
        <line x1={-7} y1={-378} x2={7} y2={-378} stroke={K.ink} strokeWidth={4} />
        <circle cx={-22 + look * 4} cy={-377} r={4} fill={K.ink} />
        <circle cx={22 + look * 4} cy={-377} r={4} fill={K.ink} />
        <path d="M -24 -346 Q 0 -360 24 -346 Q 12 -340 0 -344 Q -12 -340 -24 -346 Z" fill={K.hair} />
      </g>
    </g>
  );
};

/** Hospital bed with a patient (head on the left). */
const Bed: React.FC<{ x: number; y: number; s?: number; sick?: number; smile?: number; empty?: boolean; f: number }> = ({ x, y, s = 1, sick = 0, smile = 0, empty, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-330} y={-40} width={660} height={60} rx={12} fill="#E6EDF0" stroke="#9AA9AF" strokeWidth={5} />
    <rect x={-330} y={20} width={14} height={110} fill="#7E8C92" />
    <rect x={316} y={20} width={14} height={110} fill="#7E8C92" />
    <rect x={-344} y={-170} width={18} height={300} rx={8} fill="#7E8C92" />
    <rect x={-300} y={-92} width={150} height={60} rx={26} fill="#fff" stroke="#C9D3D6" strokeWidth={4} />
    {!empty && (
      <>
        <path d="M -170 -60 Q 40 -120 320 -60 L 320 -30 L -170 -30 Z" fill="#7FA7C9" />
        <g transform={`translate(-220 -${100 + Math.sin(f / 20) * 2})`}>
          <circle r={56} fill={K.skin} />
          <circle r={56} fill={K.red} opacity={0.55 * sick} />
          {sick > 0.3 && <ellipse cx={14} cy={-6} rx={30} ry={22} fill="#fff" stroke="#D9D9D9" strokeWidth={3} opacity={Math.min(1, sick * 1.4)} />}
          <path d="M -30 -40 Q 0 -70 34 -40" stroke={K.hair} strokeWidth={14} fill="none" strokeLinecap="round" />
          <line x1={-26} y1={-8} x2={-10} y2={-8} stroke={K.ink} strokeWidth={4} strokeLinecap="round" />
          <path d={`M -24 ${22} Q -8 ${22 + 14 * smile} 10 ${22}`} stroke={K.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      </>
    )}
    {empty && <path d="M -170 -36 L 320 -36" stroke="#7FA7C9" strokeWidth={14} strokeLinecap="round" />}
  </g>
);

const Bottle: React.FC<{ x: number; y: number; s?: number; fill?: number; label?: string; color?: string }> = ({ x, y, s = 1, fill = 1, label, color = K.gold }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-26} y={-230} width={52} height={40} rx={6} fill="#3B3B3B" />
    <path d="M -22 -190 L 22 -190 L 22 -160 Q 80 -150 80 -100 L 80 0 Q 80 14 66 14 L -66 14 Q -80 14 -80 0 L -80 -100 Q -80 -150 -22 -160 Z" fill="rgba(230,245,250,0.35)" stroke="#fff" strokeWidth={5} />
    <clipPath id={`bt${x}${y}`}>
      <rect x={-78} y={-150 + 150 * (1 - fill)} width={156} height={164} />
    </clipPath>
    <path d="M -76 -96 Q -76 -146 -20 -156 L 20 -156 Q 76 -146 76 -96 L 76 0 Q 76 10 66 10 L -66 10 Q -76 10 -76 0 Z" fill={color} clipPath={`url(#bt${x}${y})`} opacity={0.9} />
    {label && (
      <>
        <rect x={-64} y={-90} width={128} height={56} rx={6} fill="#FFF8E6" stroke="#B8A27A" strokeWidth={3} />
        <text x={0} y={-52} textAnchor="middle" {...txt} fontSize={30} fill={K.ink}>
          {label}
        </text>
      </>
    )}
  </g>
);

const Syringe: React.FC<{ x: number; y: number; s?: number; rot?: number; push?: number }> = ({ x, y, s = 1, rot = 0, push = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-26} width={200} height={52} rx={10} fill="rgba(230,245,250,0.5)" stroke="#fff" strokeWidth={5} />
    <rect x={-116} y={-22} width={196 * (1 - push)} height={44} fill={K.gold} opacity={0.85} />
    <rect x={-170 + 0 - push * 150} y={-8} width={60 + push * 150} height={16} fill="#C9D3D6" />
    <rect x={-186 - push * 150} y={-30} width={18} height={60} rx={4} fill="#C9D3D6" />
    <rect x={80} y={-10} width={30} height={20} fill="#C9D3D6" />
    <line x1={110} y1={0} x2={200} y2={0} stroke="#E8EEF0" strokeWidth={5} />
  </g>
);

const Stamp: React.FC<{ x: number; y: number; p: number; text: string; color?: string; rot?: number; size?: number }> = ({ x, y, p, text, color = K.red, rot = -8, size = 96 }) =>
  p > 0.01 ? (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${lerp(2.2, 1, Math.min(1, p))})`} opacity={Math.min(1, p * 1.5)}>
      <rect x={-text.length * size * 0.3 - 40} y={-size * 0.95} width={text.length * size * 0.6 + 80} height={size * 1.5} rx={18} fill="none" stroke={color} strokeWidth={12} />
      <text textAnchor="middle" y={size * 0.2} {...txt} fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  ) : null;

const YearChip: React.FC<{ x: number; y: number; p: number; text: string; dark?: boolean }> = ({ x, y, p, text, dark }) =>
  p > 0.01 ? (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <rect x={-Math.max(190, text.length * 34)} y={-86} width={Math.max(380, text.length * 68)} height={140} rx={30} fill={dark ? "rgba(0,0,0,0.6)" : "#fff"} />
      <text textAnchor="middle" y={22} {...txt} fontSize={104} fill={dark ? K.gold : K.ink}>
        {text}
      </text>
    </g>
  ) : null;

const LabRoom: React.FC<{ f: number; dim?: number }> = ({ f, dim = 0 }) => (
  <g>
    <rect x={-600} y={0} width={2400} height={1920} fill={K.wall} />
    <rect x={-600} y={0} width={2400} height={1920} fill={K.night} opacity={dim} />
    <rect x={640} y={330} width={300} height={380} rx={8} fill="#9CC3D0" stroke="#24363C" strokeWidth={14} />
    <line x1={790} y1={330} x2={790} y2={710} stroke="#24363C" strokeWidth={10} />
    <line x1={640} y1={520} x2={940} y2={520} stroke="#24363C" strokeWidth={10} />
    <rect x={-100} y={420} width={560} height={20} fill="#5A3A22" />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i} transform={`translate(${-40 + i * 110} 420)`}>
        <path d="M -24 -110 L 24 -110 L 24 -60 L 50 0 L -50 0 L -24 -60 Z" fill={["#7FC4D6", "#E9A23B", "#9CD67A", "#E06A6A", "#B79BE0"][i]} opacity={0.85} stroke="#fff" strokeWidth={4} />
      </g>
    ))}
    <line x1={300} y1={0} x2={300} y2={170} stroke="#111" strokeWidth={6} />
    <path d="M 230 170 L 370 170 L 330 120 L 270 120 Z" fill="#2C2C2C" />
    <ellipse cx={300} cy={600} rx={600} ry={520} fill="url(#lampGlow)" opacity={0.9 * (1 - dim)} />
    <rect x={-600} y={1180} width={2400} height={40} fill={K.benchTop} />
    <rect x={-600} y={1220} width={2400} height={760} fill={K.bench} />
    {Array.from({ length: 6 }).map((_, i) => (
      <rect key={i} x={-600 + i * 420} y={1250} width={380} height={620} rx={10} fill="#6A4529" />
    ))}
    <circle cx={300 + Math.sin(f / 40) * 4} cy={176} r={20} fill={K.lamp} opacity={1 - dim} />
  </g>
);

// ------------------------------------------------------------ shots
const shots: ShotDef[] = [
  // G01 — hook: the dirty dish
  {
    at: 0,
    C: ({ l, d }) => {
      const f = l;
      const mold = ease(f, 4, at("G01", "صحن"));
      const dirt = ease(f, at("G01", "وسخ") - 2, at("G01", "وسخ") + 8);
      const tag = pop(f, at("G01", "غسله") - 2, 30, 240, 11);
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.0]} b={[600, 1020, 1.3]} rot={[-2, 1]}>
          <World>
            <Defs />
            <rect x={-200} y={-200} width={1480} height={2320} fill={K.night} />
            <ellipse cx={540} cy={1000} rx={700} ry={700} fill="url(#lampGlow)" />
            <Dish x={540} y={1060} r={340} f={f} mold={mold} dirt={dirt} />

            <g transform={`translate(540 1520) scale(${tag}) rotate(-4)`}>
              <rect x={-230} y={-64} width={460} height={110} rx={20} fill={K.red} />
              <text textAnchor="middle" y={14} {...txt} fontSize={62} fill="#fff">
                ما أحد غسله 🤢
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("G01", "وأول") - 3,
    C: ({ l, d }) => {
      const f = at("G01", "وأول") - 3 + l;
      const q = pop(f, at("G01", "قصته") - 2, 30, 200, 9);
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.25]} b={[540, 980, 1.0]}>
          <World>
            <rect x={-200} y={-200} width={1480} height={2320} fill="#0C1418" />
            <ellipse cx={540} cy={1150} rx={520} ry={300} fill={K.teal} opacity={0.25} />
            <g opacity={0.95}>
              <Bed x={540} y={1240} s={1.1} sick={0.8} f={f} />
            </g>
            <g transform={`translate(540 760) scale(${q * (1 + 0.05 * Math.sin(f / 4))})`}>
              <text textAnchor="middle" y={120} {...txt} fontSize={360} fill={K.red} stroke="#000" strokeWidth={10} paintOrder="stroke">
                ؟
              </text>
            </g>
            <text x={540} y={1520} textAnchor="middle" {...txt} fontSize={70} fill="#fff" opacity={q}>
              أول مريض…
            </text>
          </World>
        </Cam>
      );
    },
  },
  // G02 — a small cut could kill
  {
    at: start("G02"),
    C: ({ l, d }) => {
      const f = start("G02") + l;
      const yr = pop(f, at("G02", "قبل") - 2, 30, 220, 12);
      const veins = ease(f, at("G02", "يموّتك") - 6, at("G02", "يموّتك") + 20);
      const st = pop(f, at("G02", "مافي") - 2, 30, 260, 12);
      const j = jolt(f, at("G02", "يموّتك"));
      return (
        <AbsoluteFill style={{ translate: `${j.sx}px ${j.sy}px` }}>
          <Cam l={l} d={d} a={[540, 1080, 1.0]} b={[560, 1150, 1.15]}>
            <World>
              <rect x={-200} y={-200} width={1480} height={2320} fill="#2B1E22" />
              <g transform="translate(540 1150) rotate(-20)">
                <path d="M -120 520 L -140 40 Q -160 -40 -110 -60 L -100 -260 Q -96 -310 -60 -310 Q -24 -310 -24 -260 L -20 -90 L 0 -330 Q 6 -380 44 -378 Q 80 -374 78 -326 L 64 -90 L 100 -290 Q 110 -334 146 -326 Q 180 -316 172 -272 L 140 -60 L 190 -190 Q 206 -226 236 -214 Q 264 -200 254 -166 L 190 80 Q 170 160 120 200 L 120 520 Z" fill={K.skin} stroke="#C99A78" strokeWidth={6} />
                <path d="M 20 -40 L 80 -10" stroke={K.red} strokeWidth={10} strokeLinecap="round" />
                <circle cx={60} cy={20 + Math.min(40, l * 0.8)} r={14} fill={K.red} />
                {[0, 1, 2, 3, 4].map((i) => (
                  <path key={i} d={`M 50 -20 Q ${-40 + i * 40} ${120 + i * 30} ${-90 + i * 50} ${420}`} stroke={K.red} strokeWidth={8} fill="none" strokeDasharray="600" strokeDashoffset={600 * (1 - veins)} opacity={0.75} strokeLinecap="round" />
                ))}
              </g>
              <YearChip x={540} y={820} p={yr} text={`قبل ${ar(100)} سنة`} />
              <Stamp x={540} y={1500} p={st} text="مافي علاج" />
            </World>
          </Cam>
          <RedVignette k={Math.max(j.k, veins * 0.6)} />
        </AbsoluteFill>
      );
    },
  },
  // G03 — London 1928
  {
    at: start("G03"),
    C: ({ l, d }) => {
      const f = start("G03") + l;
      const yr = pop(f, at("G03", "وتمانية") - 2, 30, 220, 12);
      return (
        <Cam l={l} d={d} a={[540, 700, 1.15]} b={[540, 1050, 1.0]}>
          <World>
            <rect x={-200} y={-200} width={1480} height={2320} fill="#55666F" />
            <rect x={-200} y={900} width={1480} height={1200} fill="#3D4A51" />
            <g fill="#2A343A">
              <rect x={460} y={420} width={160} height={900} />
              <path d="M 450 420 L 540 250 L 630 420 Z" />
              <circle cx={540} cy={560} r={58} fill="#E9E2C6" />
              <line x1={540} y1={560} x2={540} y2={518} stroke="#2A343A" strokeWidth={7} />
              <line x1={540} y1={560} x2={570} y2={572} stroke="#2A343A" strokeWidth={7} />
              {[-460, -260, 640, 820, 1000].map((x, i) => (
                <rect key={i} x={x} y={820 - (i % 3) * 90} width={180 + (i % 2) * 60} height={900} />
              ))}
              {[0, 1, 2].map((i) => (
                <rect key={`c${i}`} x={120 + i * 110} y={700 - i * 40} width={170} height={700} />
              ))}
            </g>
            {Array.from({ length: 40 }).map((_, i) => (
              <rect key={`w${i}`} x={-200 + (i % 10) * 160 + 40} y={950 + Math.floor(i / 10) * 120} width={34} height={50} fill={K.lamp} opacity={random(`lw${i}`) > 0.55 ? 0.8 : 0.12} />
            ))}
            {[0, 1, 2].map((i) => (
              <rect key={`f${i}`} x={-400 + ((f * (1.5 + i)) % 600)} y={780 + i * 220} width={2000} height={120} fill={K.fog} opacity={0.28} rx={60} />
            ))}
            {Array.from({ length: 50 }).map((_, i) => {
              const y = ((random(`ry${i}`) * 2000 + f * 26) % 2000) - 100;
              const x = random(`rx${i}`) * 1080;
              return <line key={`r${i}`} x1={x} y1={y} x2={x - 10} y2={y + 46} stroke="#C8D6DD" strokeWidth={3} opacity={0.45} />;
            })}
            <YearChip x={540} y={1450} p={yr} text={ar(1928)} dark />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("G03", "الدكتور") - 3,
    C: ({ l, d }) => {
      const f = at("G03", "الدكتور") - 3 + l;
      const zoom = ease(f, at("G03", "صحون") - 6, at("G03", "صحون") + 20);
      return (
        <Cam l={l} d={d} a={[540, 960, 1.0]} b={[lerp(540, 360, zoom), lerp(960, 1120, zoom), lerp(1.0, 1.5, zoom)]}>
          <World>
            <Defs />
            <LabRoom f={f} />
            <Doctor x={760} y={1300} s={1.25} f={f} arm={0.3} look={-1} />
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${220 + i * 150} 1150) scale(1 0.45)`}>
                <Dish x={0} y={0} r={62} f={f} />
              </g>
            ))}
          </World>
        </Cam>
      );
    },
  },
  // G04 — goes on holiday, leaves the dishes
  {
    at: start("G04"),
    C: ({ l, d }) => {
      const f = start("G04") + l;
      const walkT = ease(f, start("G04") + 4, at("G04", "وساب") + 6);
      const pan = ease(f, at("G04", "وساب") - 4, at("G04", "الطاولة") + 6);
      const x = pop(f, at("G04", "بدون") - 2, 30, 240, 11);
      return (
        <Cam l={l} d={d} a={[700, 960, 1.05]} b={[400, 1080, 1.3]}>
          <World>
            <Defs />
            <LabRoom f={f} dim={0.15 * pan} />
            <rect x={1000} y={560} width={260} height={640} fill="#1E1A16" />
            <rect x={1000} y={560} width={260} height={640} fill="#4A3424" transform={`rotate(0)`} opacity={1 - walkT} />
            <g opacity={1 - ease(f, at("G04", "وساب") + 2, at("G04", "وساب") + 10)}>
              <Doctor x={lerp(700, 1130, walkT)} y={1300} s={1.2} f={f} walk={walkT < 1 ? 1 : 0} bag />
            </g>
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(${180 + (i % 2) * 140 + (i > 1 ? 70 : 0)} ${1150 - (i > 1 ? 26 : 0)}) scale(1 0.45)`}>
                <Dish x={0} y={0} r={62} f={f} dirt={0.6} />
              </g>
            ))}
            <g transform={`translate(330 960) scale(${x}) rotate(-6)`}>
              <rect x={-210} y={-60} width={420} height={104} rx={20} fill={K.red} />
              <text textAnchor="middle" y={12} {...txt} fontSize={58} fill="#fff">
                بدون غسيل!
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  // G05 — comes back: green mould
  {
    at: start("G05"),
    C: ({ l }) => {
      const pages = Math.floor(interpolate(l, [0, 26], [0, 24], clamp));
      return (
        <AbsoluteFill style={{ background: "#2A2018" }}>
          <World>
            <g transform="translate(540 900)">
              <rect x={-230} y={-260} width={460} height={500} rx={30} fill="#FFF8E6" />
              <rect x={-230} y={-260} width={460} height={120} rx={30} fill={K.red} />
              <text textAnchor="middle" y={-180} {...txt} fontSize={56} fill="#fff">
                أغسطس — سبتمبر
              </text>
              <text textAnchor="middle" y={110} {...txt} fontSize={240} fill={K.ink}>
                {ar(((pages + 5) % 30) + 1)}
              </text>
            </g>
            <text x={540} y={1360} textAnchor="middle" {...txt} fontSize={72} fill={K.lamp}>
              رجع…
            </text>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("G05", "عفن") - 4,
    C: ({ l, d }) => {
      const f = at("G05", "عفن") - 4 + l;
      const m = ease(f, at("G05", "عفن") - 2, at("G05", "طالع") + 14);
      return (
        <Cam l={l} d={d} a={[540, 980, 1.0]} b={[620, 900, 1.45]}>
          <World>
            <Defs />
            <rect x={-200} y={-200} width={1480} height={2320} fill={K.night} />
            <ellipse cx={540} cy={980} rx={720} ry={720} fill="url(#lampGlow)" />
            <Dish x={540} y={1000} r={360} f={f} mold={m} dirt={0.4} />
            <text x={540} y={1530} textAnchor="middle" {...txt} fontSize={84} fill={K.mold2} stroke={K.night} strokeWidth={8} paintOrder="stroke" opacity={m}>
              عفن أخضر 🦠
            </text>
          </World>
        </Cam>
      );
    },
  },
  // G06 — anyone would toss it… he looked closer
  {
    at: start("G06"),
    C: ({ l, d }) => {
      const f = start("G06") + l;
      const stop = at("G06", "بس");
      const toss = Math.min(ease(f, start("G06") + 2, stop), 0.8);
      const j = jolt(f, stop);
      return (
        <AbsoluteFill style={{ translate: `${j.sx}px ${j.sy}px` }}>
          <Cam l={l} d={d} a={[540, 1000, 1.0]} b={[540, 1000, 1.15]}>
            <World>
              <rect x={-200} y={-200} width={1480} height={2320} fill={K.lab1} />
              <g transform="translate(700 1320)">
                <path d="M -150 -260 L 150 -260 L 120 120 L -120 120 Z" fill="#5E6B70" stroke="#3B4549" strokeWidth={8} />
                <rect x={-170} y={-290} width={340} height={40} rx={10} fill="#4A5559" />
                {[-80, 0, 80].map((x) => (
                  <line key={x} x1={x} y1={-220} x2={x * 0.8} y2={90} stroke="#3B4549" strokeWidth={8} />
                ))}
              </g>
              <g transform={`translate(${lerp(300, 640, toss)} ${lerp(900, 980, toss) - Math.sin(toss * Math.PI) * 160}) rotate(${toss * 40})`}>
                <Dish x={0} y={0} r={110} f={f} mold={1} dirt={0.4} />
              </g>
              <Stamp x={540} y={560} p={pop(f, stop - 1, 30, 260, 12)} text="استنى!" color={K.gold} rot={6} />
            </World>
          </Cam>
          <RedVignette k={j.k * 0.6} />
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("G06", "دقّق") - 3,
    C: ({ l, d }) => {
      const f = at("G06", "دقّق") - 3 + l;
      const dead = ease(f, at("G06", "حوالين") - 4, at("G06", "ميتة") + 4);
      const lbl = pop(f, at("G06", "ميتة") - 2, 30, 240, 11);
      return (
        <AbsoluteFill style={{ background: "#000" }}>
          <Cam l={l} d={d} a={[540, 960, 1.0]} b={[600, 900, 1.25]}>
            <World>
              <Defs />
              <clipPath id="scope">
                <circle cx={540} cy={960} r={470} />
              </clipPath>
              <g clipPath="url(#scope)">
                <rect x={0} y={400} width={1080} height={1200} fill={K.agar} />
                <g transform="translate(540 960) scale(2.2) translate(-540 -960)">
                  <Dish x={480} y={1010} r={360} f={f} mold={1} dead={dead} />
                </g>
              </g>
              <circle cx={540} cy={960} r={470} fill="none" stroke="#222" strokeWidth={40} />
              <circle cx={540} cy={960} r={490} fill="none" stroke="#555" strokeWidth={8} />
              <g transform={`translate(540 1560) scale(${lbl})`}>
                <rect x={-280} y={-70} width={560} height={120} rx={24} fill={K.red} />
                <text textAnchor="middle" y={16} {...txt} fontSize={66} fill="#fff">
                  البكتيريا ميتة!
                </text>
              </g>
            </World>
          </Cam>
        </AbsoluteFill>
      );
    },
  },
  // G07 — mould kills germs → nobody cared for 10 years
  {
    at: start("G07"),
    C: ({ l, d }) => {
      const f = start("G07") + l;
      const a = pop(f, start("G07") + 2, 30, 220, 11);
      const b = pop(f, at("G07", "يقتل") - 2, 30, 220, 11);
      const c = pop(f, at("G07", "الجراثيم") - 2, 30, 220, 11);
      return (
        <Cam l={l} d={d} a={[540, 960, 1.15]} b={[540, 960, 1.0]}>
          <World>
            <Defs />
            <rect x={-200} y={-200} width={1480} height={2320} fill={K.lab1} />
            <g transform={`translate(270 960) scale(${a})`}>
              <Dish x={0} y={0} r={160} f={f} mold={1} />
            </g>
            <g transform={`translate(540 960) scale(${b})`}>
              <path d="M -60 0 L 50 0 M 20 -36 L 60 0 L 20 36" stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g transform={`translate(810 960) scale(${c})`}>
              <circle r={110} fill={K.germ} stroke={K.germLine} strokeWidth={8} />
              <line x1={-120} y1={-120} x2={120} y2={120} stroke={K.red} strokeWidth={26} strokeLinecap="round" />
            </g>
            <text x={540} y={1340} textAnchor="middle" {...txt} fontSize={84} fill="#fff" opacity={c}>
              العفن = يقتل الجراثيم
            </text>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("G07", "نشر") - 3,
    C: ({ l, d }) => {
      const f = at("G07", "نشر") - 3 + l;
      const paper = ease(f, at("G07", "نشر") - 2, at("G07", "الاكتشاف") + 8);
      const drop = ease(f, at("G07", "عشر") - 6, at("G07", "عشر") + 10);
      const yr = Math.round(interpolate(f, [at("G07", "عشر"), at("G07", "نايمة") + 10], [1929, 1939], clamp));
      const nobody = pop(f, at("G07", "اهتم") - 2, 30, 240, 12);
      return (
        <Cam l={l} d={d} a={[540, 900, 1.05]} b={[540, 1100, 1.15]}>
          <World>
            <rect x={-200} y={-200} width={1480} height={2320} fill="#2C2620" />
            <g transform="translate(540 1400)">
              <rect x={-360} y={-140} width={720} height={420} rx={14} fill="#6B4A2C" stroke="#3E2A18" strokeWidth={8} />
              <rect x={-330} y={-110} width={660} height={160} rx={10} fill="#7E5934" stroke="#3E2A18" strokeWidth={6} transform={`translate(0 ${-130 * (1 - drop)})`} />
              <rect x={-50} y={-50} width={100} height={22} rx={10} fill="#C9A646" transform={`translate(0 ${-130 * (1 - drop)})`} />
            </g>
            <g transform={`translate(540 ${lerp(-300, 760, paper) + drop * 520}) rotate(${lerp(-25, -3, paper)}) scale(${1 - drop * 0.4})`} opacity={1 - drop * 0.95}>
              <rect x={-230} y={-300} width={460} height={600} rx={10} fill="#FBF6E8" />
              <text textAnchor="middle" y={-220} {...txt} fontSize={44} fill={K.ink}>
                بحث علمي
              </text>
              <text textAnchor="middle" y={-160} {...txt} fontSize={40} fill={K.teal}>
                {ar(1929)}
              </text>
              <g transform="translate(0 -40) scale(0.4)">
                <Dish x={0} y={0} r={160} f={f} mold={1} />
              </g>
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x={-170} y={60 + i * 40} width={i === 4 ? 200 : 340} height={14} rx={7} fill="#C9C1A8" />
              ))}
            </g>
            <g transform={`translate(540 560) scale(${nobody * (1 - drop)})`}>
              <text textAnchor="middle" {...txt} fontSize={96} fill="#fff">
                🦗 ولا أحد اهتم
              </text>
            </g>
            <YearChip x={540} y={700} p={drop} text={ar(yr)} dark />
          </World>
        </Cam>
      );
    },
  },
  // G08 — Oxford
  {
    at: start("G08"),
    C: ({ l, d }) => {
      const f = start("G08") + l;
      return (
        <Cam l={l} d={d} a={[540, 820, 1.2]} b={[540, 1000, 1.0]}>
          <World>
            <rect x={-200} y={-200} width={1480} height={2320} fill="#F2B47A" />
            <rect x={-200} y={-200} width={1480} height={700} fill="#E98F5C" />
            <circle cx={760} cy={620} r={120} fill="#FFE2A8" />
            <g fill="#4A3A4E">
              {[60, 230, 430, 640, 850, 1010].map((x, i) => (
                <g key={i}>
                  <rect x={x - 60} y={900 - (i % 3) * 60} width={120} height={900} />
                  <path d={`M ${x - 60} ${900 - (i % 3) * 60} L ${x} ${640 - (i % 3) * 90} L ${x + 60} ${900 - (i % 3) * 60} Z`} />
                </g>
              ))}
              <path d="M 380 1000 Q 540 760 700 1000 Z" />
              <rect x={330} y={1000} width={420} height={800} />
              <rect x={-200} y={1300} width={1480} height={700} />
            </g>
            {Array.from({ length: 6 }).map((_, i) => (
              <path key={i} d={`M ${((f * 2 + i * 220) % 1400) - 200} ${300 + i * 40} q 20 -16 40 0 q 20 -16 40 0`} stroke="#4A3A4E" strokeWidth={5} fill="none" />
            ))}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("G08", "نبغى") - 3,
    C: ({ l, d }) => {
      const f = at("G08", "نبغى") - 3 + l;
      const arrow = ease(f, at("G08", "نحوّل") - 2, at("G08", "العفن") + 6);
      const fill = ease(f, at("G08", "لدوا") - 4, at("G08", "لدوا") + 20);
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.1]} b={[560, 980, 1.0]}>
          <World>
            <Defs />
            <LabRoom f={f} />
            <g transform="translate(260 1080) scale(1 0.5)">
              <Dish x={0} y={0} r={140} f={f} mold={1} />
            </g>
            <path d="M 400 1040 L 620 1040" stroke="#fff" strokeWidth={14} strokeDasharray="240" strokeDashoffset={240 * (1 - arrow)} strokeLinecap="round" />
            <path d="M 590 1010 L 630 1040 L 590 1070" stroke="#fff" strokeWidth={14} fill="none" opacity={arrow} strokeLinecap="round" strokeLinejoin="round" />
            <Bottle x={800} y={1170} s={1.5} fill={fill} label="بنسلين" />
            {fill > 0.2 && Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={800 + Math.sin(f / 5 + i) * 60} cy={1150 - ((f * 3 + i * 40) % 160)} r={8} fill="#fff" opacity={0.6} />)}
          </World>
        </Cam>
      );
    },
  },
  // G09 — first patient
  {
    at: start("G09"),
    C: ({ l, d }) => {
      const f = start("G09") + l;
      const yr = pop(f, at("G09", "وأربعين") - 2, 30, 220, 12);
      const face = ease(f, at("G09", "وصل") - 4, at("G09", "وجهه") + 12);
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.0]} b={[lerp(540, 330, face), lerp(1000, 1020, face), lerp(1.0, 1.7, face)]}>
          <World>
            <rect x={-200} y={-200} width={1480} height={2320} fill={K.hosp} />
            <rect x={-200} y={1300} width={1480} height={800} fill={K.hosp2} />
            <rect x={640} y={420} width={300} height={360} rx={10} fill="#E9F4F8" stroke="#7E9C94" strokeWidth={10} />
            <g transform="translate(900 1000)">
              <line x1={0} y1={-400} x2={0} y2={320} stroke="#7E8C92" strokeWidth={10} />
              <rect x={-50} y={-400} width={100} height={150} rx={20} fill="rgba(240,250,255,0.7)" stroke="#fff" strokeWidth={4} />
            </g>
            <Bed x={520} y={1260} s={1.15} sick={1} f={f} />
            {face < 0.5 && <YearChip x={540} y={700} p={yr} text={ar(1941)} />}
          </World>
        </Cam>
      );
    },
  },
  // G10 — he improves
  {
    at: start("G10"),
    C: ({ l, d }) => {
      const f = start("G10") + l;
      const push = ease(f, at("G10", "الدوا") - 2, at("G10", "الدوا") + 18);
      const better = ease(f, at("G10", "يوم") - 2, at("G10", "يتحسّن") + 14);
      const tick = pop(f, at("G10", "يتحسّن") - 2, 30, 240, 11);
      return (
        <Cam l={l} d={d} a={[460, 1020, 1.25]} b={[540, 1000, 1.0]}>
          <World>
            <rect x={-200} y={-200} width={1480} height={2320} fill={K.hosp} />
            <rect x={-200} y={1300} width={1480} height={800} fill={K.hosp2} />
            <Bed x={520} y={1260} s={1.15} sick={1 - better} smile={better} f={f} />
            <g opacity={1 - better}>
              <Syringe x={480} y={920} s={1.1} rot={25} push={push} />
            </g>
            <g transform="translate(880 880)">
              <rect x={-26} y={-240} width={52} height={360} rx={26} fill="#fff" stroke="#9AA9AF" strokeWidth={5} />
              <circle cx={0} cy={140} r={50} fill={K.red} />
              <rect x={-12} y={lerp(-220, 40, better)} width={24} height={lerp(360, 100, better)} fill={K.red} />
            </g>
            <Stamp x={540} y={560} p={tick} text="يتحسّن ✓" color="#2E9E5B" rot={-5} size={84} />
          </World>
        </Cam>
      );
    },
  },
  // G11 — ran out → recycle from urine
  {
    at: start("G11"),
    C: ({ l, d }) => {
      const f = start("G11") + l;
      const j = jolt(f, at("G11", "خلص"));
      const q = pop(f, at("G11", "إيش") - 2, 30, 220, 10);
      return (
        <AbsoluteFill style={{ translate: `${j.sx}px ${j.sy}px` }}>
          <Cam l={l} d={d} a={[540, 1000, 1.3]} b={[540, 960, 1.0]}>
            <World>
              <rect x={-200} y={-200} width={1480} height={2320} fill="#22313A" />
              <g transform={`rotate(${Math.sin(f / 2) * 8 * j.k} 540 1200)`}>
                <Bottle x={540} y={1250} s={2} fill={0} label="بنسلين" />
              </g>
              <g transform={`translate(800 700) scale(${q})`}>
                <text textAnchor="middle" {...txt} fontSize={260} fill={K.gold}>
                  ؟
                </text>
              </g>
              <Stamp x={480} y={560} p={pop(f, at("G11", "خلص") - 1, 30, 260, 12)} text="خلص!" />
            </World>
          </Cam>
          <RedVignette k={j.k} />
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("G11", "صاروا") - 3,
    C: ({ l, d }) => {
      const f = at("G11", "صاروا") - 3 + l;
      const steps = [at("G11", "يجمعوا"), at("G11", "ويطلّعوا"), at("G11", "ويرجّعوه")];
      const nodes: { x: number; y: number; label: string; icon: React.ReactNode }[] = [
        { x: 540, y: 620, label: "المريض", icon: <text textAnchor="middle" y={40} fontSize={120}>🛏️</text> },
        { x: 880, y: 1000, label: "قارورة", icon: <Bottle x={0} y={70} s={0.7} fill={0.7} color="#F2D45C" /> },
        { x: 540, y: 1380, label: "المعمل", icon: <text textAnchor="middle" y={40} fontSize={120}>⚗️</text> },
        { x: 200, y: 1000, label: "إبرة", icon: <Syringe x={0} y={0} s={0.55} rot={-30} /> },
      ];
      const reveal = (i: number) => (i === 0 ? 1 : pop(f, steps[Math.min(2, i - 1)] - 2, 30, 220, 12));
      const arrowP = (i: number) => ease(f, (i === 0 ? steps[0] : steps[Math.min(2, i)]) - 2, (i === 0 ? steps[0] : steps[Math.min(2, i)]) + 14);
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.1]} b={[540, 1000, 1.0]} rot={[0, -3]}>
          <World>
            <rect x={-200} y={-200} width={1480} height={2320} fill="#1F2B33" />
            <circle cx={540} cy={1000} r={380} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={30} />
            {[0, 1, 2, 3].map((i) => {
              const a0 = -Math.PI / 2 + (i * Math.PI) / 2 + 0.32;
              const a1 = a0 + Math.PI / 2 - 0.64;
              const p = i === 3 ? arrowP(2) : arrowP(i);
              const aa = lerp(a0, a1, p);
              return (
                <g key={i}>
                  <path d={`M ${540 + Math.cos(a0) * 380} ${1000 + Math.sin(a0) * 380} A 380 380 0 0 1 ${540 + Math.cos(aa) * 380} ${1000 + Math.sin(aa) * 380}`} stroke={K.gold} strokeWidth={16} fill="none" strokeLinecap="round" opacity={p > 0.02 ? 1 : 0} />
                </g>
              );
            })}
            {nodes.map((n, i) => {
              const r = reveal(i);
              return (
                <g key={i} transform={`translate(${n.x} ${n.y}) scale(${r})`}>
                  <circle r={130} fill="#FBF6E8" stroke={K.gold} strokeWidth={8} />
                  <g transform="translate(0 -14)">{n.icon}</g>
                  <rect x={-110} y={100} width={220} height={70} rx={20} fill={K.ink} />
                  <text textAnchor="middle" y={150} {...txt} fontSize={44} fill="#fff">
                    {n.label}
                  </text>
                </g>
              );
            })}
            <text x={540} y={1030} textAnchor="middle" {...txt} fontSize={110} fill={K.gold} opacity={arrowP(2)}>
              🔁
            </text>
          </World>
        </Cam>
      );
    },
  },
  // G12 — he died, but the world learned it works
  {
    at: start("G12"),
    C: ({ l, d }) => {
      const f = start("G12") + l;
      const ok = pop(f, at("G12", "يشتغل") - 2, 30, 220, 11);
      const dim = ease(f, start("G12"), at("G12", "ومات") + 10) * (1 - ease(f, at("G12", "العالم") - 4, at("G12", "العالم") + 12) * 0.7);
      return (
        <Cam l={l} d={d} a={[540, 1080, 1.15]} b={[540, 1000, 1.0]}>
          <World>
            <rect x={-200} y={-200} width={1480} height={2320} fill={K.hosp} />
            <rect x={-200} y={1300} width={1480} height={800} fill={K.hosp2} />
            <Bed x={520} y={1260} s={1.15} empty f={f} />
            <g transform="translate(330 1150)">
              <line x1={0} y1={0} x2={0} y2={-120} stroke="#3C7030" strokeWidth={8} />
              <circle cx={0} cy={-140} r={30} fill="#F2F2F2" />
              <circle cx={0} cy={-140} r={12} fill={K.gold} />
            </g>
            <rect x={-200} y={-200} width={1480} height={2320} fill="#000" opacity={0.55 * dim} />
            <Stamp x={540} y={620} p={ok} text="الدوا يشتغل ✓" color="#2E9E5B" rot={-4} size={80} />
          </World>
        </Cam>
      );
    },
  },
  // G13 — wartime mass production
  {
    at: start("G13"),
    C: ({ l, d }) => {
      const f = start("G13") + l;
      const tons = pop(f, at("G13", "بالأطنان") - 2, 30, 220, 11);
      const lives = ease(f, at("G13", "أرواح") - 4, at("G13", "تنعد") + 20);
      return (
        <Cam l={l} d={d} a={[540, 1100, 1.2]} b={[540, 900, 1.0]}>
          <World>
            <rect x={-200} y={-200} width={1480} height={2320} fill="#2D3438" />
            {[0, 1].map((i) => (
              <g key={i} transform={`translate(${250 + i * 580} 760) rotate(${f * (i ? -3 : 3)})`}>
                <circle r={110} fill="none" stroke="#5E6B70" strokeWidth={34} strokeDasharray="30 22" />
                <circle r={40} fill="#5E6B70" />
              </g>
            ))}
            <rect x={-200} y={1240} width={1480} height={40} fill="#1A1E21" />
            {Array.from({ length: 12 }).map((_, i) => {
              const x = ((i * 160 + f * 9) % 1920) - 300;
              return <Bottle key={i} x={x} y={1236} s={0.7} fill={1} />;
            })}
            <g transform={`translate(540 1060) scale(${tons})`}>
              <text textAnchor="middle" {...txt} fontSize={110} fill={K.gold} stroke="#000" strokeWidth={8} paintOrder="stroke">
                بالأطنان 🏭
              </text>
            </g>
            {Array.from({ length: 24 }).map((_, i) => {
              const x = 120 + (i % 8) * 120;
              const y = 1460 + Math.floor(i / 8) * 130;
              const on = lives * 24 > i;
              return (
                <g key={`p${i}`} transform={`translate(${x} ${y})`}>
                  <circle cy={-40} r={24} fill={on ? K.gold : "#5E6B70"} />
                  <path d="M -32 30 Q -32 -14 0 -14 Q 32 -14 32 30 Z" fill={on ? K.gold : "#5E6B70"} />
                </g>
              );
            })}
          </World>
        </Cam>
      );
    },
  },
  // G14 — Nobel → callback to the unwashed dish
  {
    at: start("G14"),
    C: ({ l, d }) => {
      const f = start("G14") + l;
      const yr = pop(f, at("G14", "خمسة") - 2, 30, 220, 12);
      const med = pop(f, at("G14", "نوبل") - 4, 30, 160, 10);
      return (
        <Cam l={l} d={d} a={[540, 960, 1.2]} b={[540, 960, 1.0]}>
          <World>
            <rect x={-200} y={-200} width={1480} height={2320} fill="#1B1426" />
            {Array.from({ length: 14 }).map((_, i) => (
              <rect key={i} x={540 - 8} y={960 - 900} width={16} height={900} fill={K.gold} opacity={0.08} transform={`rotate(${i * (360 / 14) + f * 0.4} 540 960)`} />
            ))}
            <g transform={`translate(540 980) scale(${med}) rotate(${(1 - med) * 30})`}>
              <path d="M -110 -330 L -40 -120 L 40 -120 L 110 -330 Z" fill={K.red} />
              <circle r={230} fill={K.gold} stroke="#B07C14" strokeWidth={14} />
              <circle r={180} fill="none" stroke="#B07C14" strokeWidth={6} />
              <text textAnchor="middle" y={-10} {...txt} fontSize={84} fill="#5A3A08">
                نوبل
              </text>
              <text textAnchor="middle" y={80} {...txt} fontSize={60} fill="#5A3A08">
                {ar(1945)}
              </text>
            </g>
            <YearChip x={540} y={560} p={yr * (1 - med)} text={ar(1945)} dark />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("G14", "والقصة") - 3,
    C: ({ l, d }) => {
      const f = at("G14", "والقصة") - 3 + l;
      const tag = pop(f, at("G14", "انغسل") - 2, 30, 240, 11);
      return (
        <Cam l={l} d={d} a={[560, 980, 1.5]} b={[540, 1000, 1.0]}>
          <World>
            <Defs />
            <rect x={-200} y={-200} width={1480} height={2320} fill={K.night} />
            <ellipse cx={540} cy={1000} rx={700} ry={700} fill="url(#lampGlow)" />
            <Dish x={540} y={1000} r={340} f={f} mold={1} dirt={0.8} />
            <g transform={`translate(540 1520) scale(${tag}) rotate(-4)`}>
              <rect x={-300} y={-70} width={600} height={120} rx={22} fill={K.red} />
              <text textAnchor="middle" y={16} {...txt} fontSize={66} fill="#fff">
                صحن… ما انغسل 🍽️
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  // G15 — question + follow
  {
    at: start("G15"),
    C: ({ l, d }) => {
      const f = start("G15") + l;
      const card = pop(f, start("G15") + 2, 30, 200, 12);
      const cm = pop(f, at("G15", "اكتبها") - 2, 30, 240, 11);
      const next = pop(f, at("G15", "الجاية") - 2, 30, 220, 11);
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.08]} b={[540, 1000, 1.0]}>
          <World>
            <rect x={-200} y={-200} width={1480} height={2320} fill="#1B2A33" />
            <g transform={`translate(540 900) scale(${card})`}>
              <rect x={-420} y={-250} width={840} height={440} rx={40} fill="#FBF6E8" />
              <text textAnchor="middle" y={-120} {...txt} fontSize={64} fill={K.ink}>
                إيش أغرب غلطة
              </text>
              <text textAnchor="middle" y={-30} {...txt} fontSize={64} fill={K.ink}>
                طلع منها شي حلو
              </text>
              <text textAnchor="middle" y={60} {...txt} fontSize={64} fill={K.ink}>
                في حياتك؟ 🤔
              </text>
              <g transform={`translate(300 150) scale(${cm})`}>
                <circle r={70} fill={K.teal} />
                <text textAnchor="middle" y={26} fontSize={72}>
                  💬
                </text>
              </g>
            </g>
            <g transform={`translate(540 1330) scale(${next})`}>
              <rect x={-330} y={-60} width={660} height={100} rx={50} fill="rgba(255,255,255,0.12)" />
              <text textAnchor="middle" y={8} {...txt} fontSize={48} fill={K.gold}>
                الغلطة الجاية: المايكرويف 🍫
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
];

// ------------------------------------------------------------ series badge + cover
const Badge: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <div style={{ position: "absolute", top: 110, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
    <div dir="rtl" style={{ padding: "8px 30px 14px", borderRadius: 40, background: "rgba(0,0,0,0.55)", border: `2px solid ${K.gold}`, ...txt, fontSize: 38, color: K.gold }}>
      غلطة غيّرت العالم ـ الحلقة {ar(1)}
    </div>
  </div>
);

const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: K.night }}>
    <World>
      <Defs />
      <ellipse cx={540} cy={1080} rx={760} ry={760} fill="url(#lampGlow)" />
      <Dish x={540} y={1130} r={380} f={0} mold={1} dirt={0.6} />
    </World>
    <div dir="rtl" style={{ position: "absolute", top: 230, left: 50, right: 50, textAlign: "center", ...txt }}>
      <div style={{ display: "inline-block", padding: "8px 34px 16px", borderRadius: 40, border: `3px solid ${K.gold}`, color: K.gold, fontSize: 46 }}>غلطة غيّرت العالم ـ الحلقة {ar(1)}</div>
      <div style={{ fontSize: 120, color: "#fff", lineHeight: 1.15, marginTop: 30, WebkitTextStroke: "6px #000", paintOrder: "stroke fill" }}>صحن وسخ…</div>
      <div style={{ fontSize: 120, color: K.gold, lineHeight: 1.15, WebkitTextStroke: "6px #000", paintOrder: "stroke fill" }}>أنقذ ملايين!</div>
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ main
export const MistakeStory: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  return (
    <AbsoluteFill style={{ background: K.night }}>
      <ShotPlayer f={f} shots={shots} total={T} />
      {f < start("G02") && <Badge o={interpolate(f, [start("G02") - 10, start("G02")], [1, 0], clamp)} />}
      <NameChip text="ألكسندر فليمنغ" at={at("G03", "فليمنغ")} until={start("G04") - 2} color={K.teal} />
      <NameChip text="جامعة أكسفورد" at={at("G08", "أكسفورد")} until={at("G08", "نبغى") - 4} color="#7A4E8C" />
      <NameChip text="شرطي — أول مريض" at={at("G09", "شرطي")} until={at("G09", "وصل") - 2} color={K.red} />
      <Captions timeline={mistakeTimeline} top={250} />
      <FollowButton at={at("G15", "وتابعنا")} />

      <Voices timeline={mistakeTimeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={mistakeTimeline} src="audio/mistake1/music/calm.mp3" />
      {shots.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} name="whoosh" at={s.at - 2} gain={0.55} />
      ))}
      <Sfx name="impact" at={2} />
      <Sfx name="thud" at={at("G01", "وسخ")} />
      <Sfx name="glitch" at={at("G02", "يموّتك")} />
      <Sfx name="impact" at={at("G02", "مافي")} />
      <Sfx name="tick" at={start("G05")} />
      <Sfx name="sparkle" at={at("G05", "عفن")} />
      <Sfx name="thud" at={at("G06", "بس")} />
      <Sfx name="check" at={at("G06", "ميتة")} />
      <Sfx name="ding" at={at("G07", "الجراثيم")} />
      <Sfx name="tick" at={at("G07", "عشر")} />
      <Sfx name="sparkle" at={at("G08", "لدوا")} />
      <Sfx name="check" at={at("G10", "يتحسّن")} />
      <Sfx name="glitch" at={at("G11", "خلص")} />
      <Sfx name="pop" at={at("G11", "يجمعوا")} />
      <Sfx name="pop" at={at("G11", "ويطلّعوا")} />
      <Sfx name="pop" at={at("G11", "ويرجّعوه")} />
      <Sfx name="ding" at={at("G12", "يشتغل")} />
      <Sfx name="impact" at={at("G13", "بالأطنان")} />
      <Sfx name="riser" at={at("G14", "نوبل") - 14} />
      <Sfx name="sparkle" at={at("G14", "نوبل")} />
      <Sfx name="thud" at={at("G14", "انغسل")} />
      <Sfx name="pop" at={at("G15", "وتابعنا")} />
    </AbsoluteFill>
  );
};

export const MistakeStoryThumb: React.FC = () => <Cover />;
