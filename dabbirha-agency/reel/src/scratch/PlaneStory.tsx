import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import data from "../data/plane-timeline.json";
import type { TimelineData } from "../lib/timing";
import { Cam, Clouds, Dunes, Man, ShotPlayer, type ShotDef, SkyRect, Sun, Wind, World } from "./art";
import { ar, Captions, clamp, ease, makeStory, MusicBed, pop, SANS, Voices } from "./kit";
import { FollowCard } from "./SeaStory";

/** «الطيارة من الصفر» — open-sky palette with an Andalusian chapter, voice: Fahad. */
export const planeTimeline = data as TimelineData;
const { Sfx, SceneVoice, at, start } = makeStory(planeTimeline, "audio/plane");
const T = planeTimeline.durationInFrames;
const txt = { fontFamily: SANS, fontWeight: 700 } as const;
const P = { sky1: "#4FA9E8", sky2: "#CDEBF8", gold: "#F2C14E", terracotta: "#C8643C", red: "#E0313F", canvas: "#F1E4C6", wood: "#8B5A2B" };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const FeatherWings: React.FC<{ flap: number }> = ({ flap }) => (
  <g>
    {[-1, 1].map((side) => (
      <g key={side} transform={`scale(${side} 1) rotate(${-20 + flap * 25})`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <path key={i} d={`M0 ${i * 26} q120 -30 ${240 - i * 20} ${10 + i * 12} q-110 30 -${240 - i * 20} ${-6}`} fill={i % 2 ? "#F4F4F4" : "#E2DED3"} stroke="#B8B2A4" strokeWidth={3} />
        ))}
      </g>
    ))}
  </g>
);

const Balloon: React.FC<{ x: number; y: number; s?: number; f: number; flame?: number }> = ({ x, y, s = 1, f, flame = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -420 C230 -420 260 -150 120 0 L-120 0 C-260 -150 -230 -420 0 -420 Z" fill={P.red} />
    {[-1, 0, 1].map((k) => (
      <path key={k} d={`M0 -420 C${k * 120 + 40} -380 ${k * 120 + 40} -120 ${k * 60} 0`} stroke={P.gold} strokeWidth={34} fill="none" opacity={0.9} />
    ))}
    <path d="M-120 0 L-60 90 M120 0 L60 90" stroke="#5A3A1C" strokeWidth={6} />
    {flame > 0 && <path d={`M-22 70 q22 -${70 * flame} 44 0 Z`} fill="#FFC23B" transform={`translate(0 ${Math.sin(f / 2) * 3})`} />}
    <rect x={-70} y={90} width={140} height={90} rx={10} fill="#A8703A" stroke="#6B4423" strokeWidth={6} />
    <Man x={0} y={170} s={0.32} f={f} pose="wave" />
  </g>
);

const Glider: React.FC<{ x: number; y: number; s?: number; f: number; rot?: number }> = ({ x, y, s = 1, f, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <path d="M-330 0 Q0 -90 330 0 Q0 -40 -330 0 Z" fill={P.canvas} stroke="#B8A27A" strokeWidth={6} />
    {Array.from({ length: 9 }).map((_, i) => (
      <line key={i} x1={-300 + i * 75} y1={-18 + Math.abs(i - 4) * 4} x2={-300 + i * 75} y2={-2} stroke="#B8A27A" strokeWidth={3} />
    ))}
    <Man x={0} y={330} s={0.55} f={f} pose="reach" />
  </g>
);

const Biplane: React.FC<{ x: number; y: number; s?: number; f: number; prop?: boolean; rot?: number }> = ({ x, y, s = 1, f, prop = true, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <rect x={-360} y={-130} width={720} height={26} rx={10} fill={P.canvas} stroke="#B8A27A" strokeWidth={5} />
    <rect x={-360} y={20} width={720} height={26} rx={10} fill={P.canvas} stroke="#B8A27A" strokeWidth={5} />
    {[-280, -140, 140, 280].map((sx) => (
      <line key={sx} x1={sx} y1={-104} x2={sx} y2={20} stroke="#6B4423" strokeWidth={6} />
    ))}
    <path d="M-60 -40 L-460 -10 L-460 20 L-60 0 Z" fill="#A8703A" />
    <rect x={-520} y={-60} width={70} height={90} fill={P.canvas} stroke="#B8A27A" strokeWidth={5} />
    <rect x={-60} y={-60} width={140} height={60} rx={10} fill="#5C6670" />
    <Man x={-10} y={20} s={0.22} f={f} pose="stand" hat="none" thobe="#2F3640" />
    <g transform={`translate(110 -30) scale(1 ${prop ? Math.abs(Math.cos(f * 1.6)) : 1})`}>
      <rect x={-8} y={-100} width={16} height={200} rx={8} fill="#6B4423" />
    </g>
    {[-150, 150].map((wx) => (
      <circle key={wx} cx={wx} cy={80} r={20} fill="#2A2A2A" />
    ))}
  </g>
);

const Cordoba: React.FC<{ w?: number; y: number }> = ({ w = 1080, y }) => (
  <g>
    {Array.from({ length: Math.ceil(w / 160) + 2 }).map((_, i) => {
      const x = i * 160 - 80;
      const h = 220 + (i % 3) * 70;
      return (
        <g key={i}>
          <rect x={x} y={y - h} width={150} height={h} fill={["#F1E4C6", "#E9D7B3", "#F4EAD2"][i % 3]} stroke="#C9A87A" strokeWidth={4} />
          <rect x={x - 6} y={y - h - 20} width={162} height={24} fill={P.terracotta} />
          {[0, 1].map((k) => (
            <path key={k} d={`M${x + 22 + k * 62} ${y - 40} L${x + 22 + k * 62} ${y - 110} Q${x + 44 + k * 62} ${y - 150} ${x + 66 + k * 62} ${y - 110} L${x + 66 + k * 62} ${y - 40} Z`} fill="#8B5A2B" />
          ))}
          {[0, 1].map((k) => (
            <rect key={`w${k}`} x={x + 34 + k * 56} y={y - h + 40} width={26} height={44} rx={13} fill="#6B4423" />
          ))}
        </g>
      );
    })}
  </g>
);

const Stopwatch: React.FC<{ x: number; y: number; s?: number; sec: number }> = ({ x, y, s = 1, sec }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-330} width={80} height={60} rx={14} fill="#5C6670" />
    <circle r={280} fill="#F7F7F7" stroke="#2A2F36" strokeWidth={24} />
    {Array.from({ length: 60 }).map((_, i) => (
      <line key={i} x1={0} y1={-250} x2={0} y2={i % 5 ? -235 : -215} stroke="#2A2F36" strokeWidth={i % 5 ? 4 : 8} transform={`rotate(${i * 6})`} />
    ))}
    <line x1={0} y1={30} x2={0} y2={-220} stroke={P.red} strokeWidth={12} strokeLinecap="round" transform={`rotate(${sec * 6})`} />
    <circle r={18} fill={P.red} />
    <text y={120} textAnchor="middle" {...txt} fontSize={110} fill="#2A2F36">
      {ar(Math.floor(sec))}
    </text>
  </g>
);

// ------------------------------------------------------------ shots
const shots: ShotDef[] = [
  {
    at: 0,
    C: ({ l, d }) => {
      const tJ = at("P01", "ونطّيت");
      const jump = l >= tJ ? Math.min(1, (l - tJ) / 20) : 0;
      return (
        <Cam l={l} d={d} a={[540, 1100, 1.35]} b={[620, 1000, 0.95]}>
          <World>
            <SkyRect h={1600} top={P.sky1} bottom={P.sky2} />
            <Clouds f={l} y={250} />
            <path d="M-300 1350 L420 1350 L560 1500 L-300 1600 Z" fill="#8C6E4A" />
            <rect x={-300} y={1500} width={1700} height={900} fill="#A8C27A" />
            <g transform={`translate(${380 + jump * 260} ${1350 - Math.sin(jump * Math.PI * 0.6) * 160 + jump * 60})`}>
              <g transform="translate(0 -290)">
                <FeatherWings flap={Math.sin(l / 3) * (l > at("P01", "فلبست") ? 1 : 0)} />
              </g>
              <Man x={0} y={0} s={1} f={l} pose={{ l: 100, r: -100 }} />
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("P02", "قبل"),
    C: ({ l, d }) => {
      const f = at("P02", "قبل") + l;
      return (
        <Cam l={l} d={d} a={[400, 1100, 1.25]} b={[1000, 1000, 0.95]} w={1500}>
          <World w={1500}>
            <SkyRect w={1500} h={1300} top="#F2A65A" bottom="#FBE6B8" />
            <Sun x={1200} y={700} r={90} f={f} />
            <Cordoba w={1500} y={1400} />
            <rect x={-300} y={1400} width={2100} height={900} fill="#C9A87A" />
            <rect x={680} y={720} width={120} height={680} fill="#E9D7B3" stroke="#C9A87A" strokeWidth={5} />
            <rect x={670} y={700} width={140} height={40} fill={P.terracotta} />
            <g transform={`translate(740 520) scale(${pop(f, at("P02", "عباس"), 30, 220, 12)})`}>
              <rect x={-260} y={-60} width={520} height={120} rx={60} fill="#2A1C10" />
              <text y={22} textAnchor="middle" {...txt} fontSize={60} fill="#fff">
                عباس بن فرناس
              </text>
            </g>
            <g transform={`translate(740 1650) scale(${pop(f, at("P02", "قرطبة"), 30, 220, 12)})`}>
              <rect x={-150} y={-50} width={300} height={100} rx={50} fill={P.terracotta} />
              <text y={20} textAnchor="middle" {...txt} fontSize={56} fill="#fff">
                قرطبة
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("P03", "طار"),
    C: ({ l, d }) => {
      const f = at("P03", "طار") + l;
      const tC = at("P03", "وطاح");
      const glide = ease(f, at("P03", "طار"), tC);
      const crash = f >= tC;
      return (
        <Cam l={l} d={d} a={[300, 900, 1.0]} b={[900, 1300, 1.3]} w={1500}>
          <World w={1500}>
            <SkyRect w={1500} h={1300} top="#F2A65A" bottom="#FBE6B8" />
            <Cordoba w={1500} y={1400} />
            <rect x={-300} y={1400} width={2100} height={900} fill="#C9A87A" />
            {!crash && (
              <g transform={`translate(${lerp(200, 900, glide)} ${lerp(700, 1300, glide * glide)}) rotate(${glide * 20})`}>
                <g transform="translate(0 -290)">
                  <FeatherWings flap={Math.sin(f / 3)} />
                </g>
                <Man x={0} y={0} s={0.9} f={f} pose={{ l: 100, r: -100 }} />
              </g>
            )}
            {crash && (
              <g>
                {Array.from({ length: 10 }).map((_, i) => {
                  const t = f - tC;
                  return <circle key={i} cx={950 + (random(`d${i}`) - 0.5) * t * 12} cy={1390 - t * 2 - random(`dy${i}`) * 30} r={20 + t} fill="#D9C39A" opacity={Math.max(0, 1 - t / 30)} />;
                })}
                <g transform="translate(950 1420) rotate(-80)">
                  <Man x={0} y={0} s={0.9} f={f} pose={{ l: 140, r: -40 }} />
                </g>
                {Array.from({ length: 8 }).map((_, i) => (
                  <path key={i} d="M0 0 q20 -10 40 0" stroke="#E2DED3" strokeWidth={10} transform={`translate(${880 + i * 30} ${1200 + ((f - tC) * (1 + i * 0.3)) % 200}) rotate(${f * 4 + i * 40})`} />
                ))}
              </g>
            )}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("P03", "ويقولون"),
    C: ({ l }) => {
      const f = at("P03", "ويقولون") + l;
      const tail = ease(f, at("P03", "ذيل") - 4, at("P03", "ذيل") + 8);
      return (
        <AbsoluteFill style={{ background: P.canvas }}>
          <World>
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={i} x1={0} x2={1080} y1={i * 100} y2={i * 100} stroke="#E2D2AE" strokeWidth={3} />
            ))}
            <g transform="translate(560 760)">
              <path d={`M-150 0 L-300 -70 L-280 0 L-300 70 Z`} fill={P.red} opacity={0.35 + 0.65 * tail} stroke={P.red} strokeWidth={tail * 8} />
              <ellipse cx={0} cy={0} rx={170} ry={70} fill="#7A8794" />
              <circle cx={170} cy={-40} r={60} fill="#7A8794" />
              <circle cx={190} cy={-52} r={10} fill="#2A2F36" />
              <path d="M226 -40 L290 -28 L226 -14 Z" fill={P.gold} />
              <path d={`M-60 -30 Q20 -${200 + Math.sin(f / 4) * 40} 120 -40 Z`} fill="#5C6670" />
              <text x={-230} y={140} textAnchor="middle" {...txt} fontSize={48} fill={P.red} opacity={tail}>
                ذيل
              </text>
            </g>
            <g transform="translate(540 1250)">
              <g transform="translate(0 -200) scale(0.7)">
                <FeatherWings flap={0} />
              </g>
              <Man x={0} y={0} s={0.7} f={f} pose={{ l: 100, r: -100 }} />
              <g opacity={tail} transform="translate(-160 -120)">
                <path d="M-70 -70 L70 70 M70 -70 L-70 70" stroke={P.red} strokeWidth={22} strokeLinecap="round" />
              </g>
            </g>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("P04", "طيب"),
    C: ({ l, d }) => {
      const f = at("P04", "طيب") + l;
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.4]} b={[540, 1100, 1.1]}>
          <World>
            <SkyRect h={1500} top="#8FA9C0" bottom="#E3E8EC" />
            <rect x={-300} y={1450} width={1700} height={900} fill="#A8C27A" />
            {Array.from({ length: 16 }).map((_, i) => {
              const t = ((f + i * 11) % 80) / 80;
              return <path key={i} d="M0 0 q30 -14 60 0 q-30 14 -60 0" fill="#F4F4F4" stroke="#B8B2A4" strokeWidth={2} transform={`translate(${random(`fx${i}`) * 1080 + Math.sin(t * 8 + i) * 40} ${300 + t * 1200}) rotate(${t * 360 + i * 20})`} />;
            })}
            <Man x={540} y={1550} s={1.1} f={f} pose={{ l: 30, r: -30, head: 10 }} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("P05", "فسوّوا"),
    C: ({ l, d }) => {
      const f = at("P05", "فسوّوا") + l;
      const rise = ease(f, at("P05", "والهوا") - 4, at("P05", "معه") + 10);
      return (
        <Cam l={l} d={d} a={[540, 1350, 1.2]} b={[540, 800, 0.9]} h={2200}>
          <World h={2200}>
            <SkyRect h={2000} top={P.sky1} bottom={P.sky2} />
            <Clouds f={l} y={300} />
            <rect x={-300} y={1750} width={1700} height={700} fill="#A8C27A" />
            <Balloon x={540} y={1560 - 700 * rise} s={1.2} f={f} />
            {Array.from({ length: 8 }).map((_, i) => {
              const t = ((f + i * 6) % 36) / 36;
              return <path key={i} d="M0 0 l-14 24 m14 -24 l14 24" stroke="#FF8A2A" strokeWidth={8} fill="none" transform={`translate(${470 + (i % 4) * 46} ${1560 - 700 * rise - 60 - t * 260})`} opacity={(1 - t) * ease(f, at("P05", "وعبّوه"), at("P05", "حار") + 6)} />;
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("P06", "بس"),
    C: ({ l, d }) => {
      const f = at("P06", "بس") + l;
      return (
        <Cam l={l} d={d} a={[400, 1000, 1.1]} b={[1000, 1000, 0.95]} w={1600}>
          <World w={1600}>
            <SkyRect w={1600} h={1800} top={P.sky1} bottom={P.sky2} />
            <Clouds f={l * 3} y={300} w={1600} n={6} />
            <Wind f={f} n={8} w={12} pts={[[-200, 900], [800, 880], [1800, 920]]} />
            <Balloon x={300 + l * 7} y={1050 + Math.sin(f / 10) * 20} s={0.9} f={f} />
            <g transform="translate(200 1600)">
              <rect x={-6} y={-200} width={12} height={200} fill="#555" />
              <path d="M6 -200 L120 -170 L6 -140 Z" fill={P.red} />
              <text x={60} y={-220} textAnchor="middle" {...txt} fontSize={44} fill="#2A1C10">
                هنا!
              </text>
            </g>
            <rect x={-300} y={1700} width={2200} height={700} fill="#A8C27A" />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("P07", "فسوّوا"),
    C: ({ l, d }) => {
      const f = at("P07", "فسوّوا") + l;
      const fly = ease(f, at("P07", "وطاروا") - 4, at("P07", "الطيور") + 10);
      return (
        <Cam l={l} d={d} a={[400, 1250, 1.3]} b={[900, 900, 0.95]} w={1500}>
          <World w={1500}>
            <SkyRect w={1500} h={1700} top={P.sky1} bottom={P.sky2} />
            <Clouds f={l} y={300} w={1500} n={5} />
            <path d="M-300 1500 C100 1250 300 1250 600 1500 L-300 1500 Z" fill="#7FA34A" />
            <rect x={-300} y={1500} width={2100} height={900} fill="#A8C27A" />
            <Glider x={lerp(250, 1100, fly)} y={lerp(1060, 760, fly) + Math.sin(f / 9) * 14} s={0.75} f={f} rot={-4} />
            {fly > 0.3 &&
              [0, 1, 2].map((i) => (
                <path key={i} d="M0 0 q20 -18 40 0 q20 -18 40 0" stroke="#2A2F36" strokeWidth={6} fill="none" transform={`translate(${lerp(400, 1250, fly) + i * 70} ${700 + i * 40 + Math.sin((f + i * 9) / 5) * 10})`} />
              ))}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("P08", "بس"),
    C: ({ l, d }) => {
      const f = at("P08", "بس") + l;
      const down = ease(f, at("P08", "بس"), at("P08", "ينزلون") + 20);
      return (
        <Cam l={l} d={d} a={[540, 1100, 1.0]} b={[600, 1300, 1.25]}>
          <World>
            <SkyRect h={1500} top={P.sky1} bottom={P.sky2} />
            <rect x={-300} y={1500} width={1700} height={900} fill="#A8C27A" />
            <Glider x={lerp(300, 700, down)} y={lerp(900, 1180, down)} s={0.75} f={f} rot={lerp(-4, 6, down)} />
            {f >= at("P08", "يقدرون") - 4 && (
              <g transform={`translate(820 1000) scale(${pop(f, at("P08", "يقدرون") - 4, 30, 240, 11)})`}>
                <path d="M0 140 L0 -80 M-60 -20 L0 -80 L60 -20" stroke={P.red} strokeWidth={26} fill="none" strokeLinecap="round" />
                <path d="M-80 -110 L80 50 M80 -110 L-80 50" stroke="#2A2F36" strokeWidth={18} strokeLinecap="round" />
              </g>
            )}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("P09", "فركّب"),
    C: ({ l, d }) => {
      const f = at("P09", "فركّب") + l;
      const engine = ease(f, at("P09", "محرّك") - 4, at("P09", "الجناح") + 8);
      const spin = f >= at("P09", "ومروحة");
      return (
        <Cam l={l} d={d} a={[300, 1100, 1.4]} b={[560, 1050, 0.85]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#D8CDB8" />
            {Array.from({ length: 6 }).map((_, i) => (
              <rect key={i} x={i * 200 - 60} y={-300} width={14} height={2500} fill="#C7BBA3" />
            ))}
            <rect x={-300} y={1400} width={1700} height={900} fill="#8C8072" />
            <Biplane x={600} y={1150} s={0.8} f={f} prop={spin} />
            <g opacity={engine} transform={`translate(600 ${1130 - (1 - engine) * 200})`}>
              <rect x={-40} y={-50} width={80} height={60} rx={8} fill="#2A2F36" />
            </g>
            <Man x={160} y={1420} s={0.85} f={f} hat="none" thobe="#2F3640" pose="hammer" armSwing={24} hand={<rect x={-10} y={-8} width={20} height={80} rx={6} fill="#555E68" />} />
            <Man x={960} y={1420} s={0.85} f={f + 7} hat="none" thobe="#4A5560" pose="point" flip />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("P10", "وسنة"),
    C: ({ l, d }) => {
      const f = at("P10", "وسنة") + l;
      const tO = at("P10", "طارت");
      const up = ease(f, tO - 10, tO + 40);
      return (
        <Cam l={l} d={d} a={[400, 1150, 1.2]} b={[800, 950, 0.95]} w={1600}>
          <World w={1600}>
            <SkyRect w={1600} h={1400} top="#9CC9E6" bottom="#F1E6CC" />
            <Clouds f={l} y={300} w={1600} n={5} />
            <Dunes y={1300} w={1600} tone={1} />
            <rect x={-300} y={1450} width={2200} height={30} fill="#8B5A2B" />
            <Biplane x={lerp(300, 1000, ease(f, at("P10", "وسنة"), tO + 40))} y={1360 - 420 * up} s={0.6} f={f} rot={-8 * up} />
            <g transform={`translate(800 620) scale(${pop(f, at("P10", "ألف"), 30, 200, 11)})`}>
              <text textAnchor="middle" {...txt} fontSize={210} fill="#fff" stroke="#2A1C10" strokeWidth={10} paintOrder="stroke">
                {ar(1903)}
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("P11", "مبروك"),
    C: ({ l, d }) => {
      const f = at("P11", "مبروك") + l;
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.5]} b={[540, 960, 1.1]} rot={[-6, 4]}>
          <World>
            <SkyRect h={2200} top="#3D9BE0" bottom="#BFE6F7" />
            {Array.from({ length: 8 }).map((_, i) => {
              const t = ((f * 3 + i * 40) % 320) / 320;
              return <ellipse key={i} cx={1300 - t * 1600} cy={300 + i * 200} rx={160} ry={50} fill="#fff" opacity={0.85} />;
            })}
            <Biplane x={540} y={1000} s={1.2} f={f} />
            <Wind f={f} n={6} w={10} pts={[[1100, 900], [100, 900]]} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("P12", "والمفاجأة"),
    C: ({ l }) => {
      const f = at("P12", "والمفاجأة") + l;
      const tS = at("P12", "أول");
      const sec = interpolate(f, [tS, at("P12", "اثنعش") + 6], [0, 12], clamp);
      const cmp = ease(f, at("P12", "أقصر") - 4, at("P12", "أقصر") + 10);
      const nowSec = at("P12", "أقصر") / 30;
      return (
        <AbsoluteFill style={{ background: "#1C2333" }}>
          <World>
            <g opacity={1 - cmp * 0.6} transform={`translate(0 ${-cmp * 260})`}>
              <Stopwatch x={540} y={1000} s={1} sec={sec} />
            </g>
            <g opacity={cmp}>
              <text x={980} y={1400} textAnchor="end" {...txt} fontSize={46} fill="#F4E6C8">
                أول طيران
              </text>
              <rect x={100} y={1430} width={880} height={50} rx={25} fill="#3A3F47" />
              <rect x={980 - (880 * 12) / 70} y={1430} width={(880 * 12) / 70} height={50} rx={25} fill={P.red} />
              <text x={980} y={1580} textAnchor="end" {...txt} fontSize={46} fill="#F4E6C8">
                هالفيديو
              </text>
              <rect x={100} y={1610} width={880} height={50} rx={25} fill="#3A3F47" />
              <rect x={980 - (880 * Math.min(70, nowSec + (f - at("P12", "أقصر")) / 30)) / 70} y={1610} width={(880 * Math.min(70, nowSec + (f - at("P12", "أقصر")) / 30)) / 70} height={50} rx={25} fill="#2BB673" />
            </g>
          </World>
        </AbsoluteFill>
      );
    },
  },
  { at: start("P13"), C: ({ l }) => <FollowCard l={l} tFollow={at("P13", "مثل") - start("P13")} /> },
];

// ------------------------------------------------------------ cover
const Cover: React.FC = () => (
  <AbsoluteFill>
    <World>
      <SkyRect h={1920} top="#3D9BE0" bottom="#BFE6F7" />
      <Clouds f={0} y={500} n={5} />
      <Sun x={880} y={620} r={80} f={0} />
      <Biplane x={540} y={1250} s={1.05} f={3} />
      <g transform="translate(540 1650)">
        <Stopwatch x={0} y={0} s={0.45} sec={12} />
      </g>
    </World>
    <div dir="rtl" style={{ position: "absolute", top: 230, left: 40, right: 40, textAlign: "center", ...txt }}>
      <div style={{ fontSize: 130, color: "#fff", WebkitTextStroke: "6px rgba(0,0,0,0.85)", paintOrder: "stroke fill", lineHeight: 1.15 }}>أول طيران بالتاريخ</div>
      <div style={{ display: "inline-block", marginTop: 16, padding: "6px 36px 18px", borderRadius: 24, background: P.red, color: "#fff", fontSize: 76 }}>كم ثانية؟ ✈️</div>
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ main
export const PlaneStory: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  const probs = [at("P03", "وطاح"), at("P04", "طيب"), at("P06", "بس"), at("P08", "بس")];
  const shake = probs.reduce((k, p) => Math.max(k, interpolate(f, [p - 1, p + 2, p + 14], [0, 1, 0], clamp)), 0);
  const end = start("P13");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ translate: `${Math.sin(f * 2.7) * 12 * shake}px ${Math.cos(f * 3.1) * 9 * shake}px` }}>
        <ShotPlayer f={f} shots={shots} total={T} />
      </AbsoluteFill>
      {shake > 0.02 && <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% 50%, transparent 50%, rgba(220,20,40,${0.45 * shake}) 100%)` }} />}
      {f < end && <Captions timeline={planeTimeline} top={230} />}

      <Voices timeline={planeTimeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={planeTimeline} src="audio/plane/music/calm.mp3" />
      {shots.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} name="swish" at={s.at - 2} gain={0.7} />
      ))}
      {probs.map((p, i) => (
        <Sfx key={`g${i}`} name="glitch" at={p - 1} />
      ))}
      <Sfx name="whoosh" at={at("P01", "ونطّيت")} />
      <Sfx name="thud" at={at("P03", "وطاح")} />
      <Sfx name="ding" at={at("P03", "ذيل")} />
      <Sfx name="riser" at={at("P05", "والهوا")} />
      <Sfx name="whoosh" at={at("P07", "وطاروا")} />
      <Sfx name="pop" at={at("P09", "محرّك")} />
      <Sfx name="impact" at={at("P10", "ألف")} />
      <Sfx name="sparkle" at={at("P11", "مبروك")} />
      <Sfx name="tick" at={at("P12", "أول")} />
      <Sfx name="impact" at={at("P12", "اثنعش")} />
      <Sfx name="pop" at={at("P13", "تابعنا")} />
    </AbsoluteFill>
  );
};

export const PlaneStoryThumb: React.FC = () => <Cover />;
