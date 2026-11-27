import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import data from "../data/pearl-timeline.json";
import type { TimelineData } from "../lib/timing";
import { Calendar, Cam, Man, Sea, ShotPlayer, type ShotDef, SkyRect, Sun, World } from "./art";
import { Captions, clamp, ease, makeStory, MusicBed, NameChip, pop, SANS, Voices } from "./kit";
import { FollowButton } from "./kit";

/** «لؤلؤ الخليج» — deep-teal underwater palette, voice: Fahad. Part 1 of 2 (ends with oil). */
export const pearlTimeline = data as TimelineData;
const { Sfx, SceneVoice, at, start } = makeStory(pearlTimeline, "audio/pearl");
const T = pearlTimeline.durationInFrames;
const txt = { fontFamily: SANS, fontWeight: 700 } as const;
const W = { deep: "#06324A", mid: "#0B5C7A", light: "#2C9AB7", sand: "#D9C08A", wood: "#8B5A2B", red: "#E0313F", gold: "#F2C14E", pearl: "#F7F3EA" };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ------------------------------------------------------------ props
const Dhow: React.FC<{ x: number; y: number; s?: number; f: number; sail?: boolean }> = ({ x, y, s = 1, f, sail = true }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 12) * 6}) scale(${s}) rotate(${Math.sin(f / 15) * 2})`}>
    <path d="M-330 -40 L330 -40 Q300 60 200 80 L-240 80 Q-320 40 -330 -40 Z" fill={W.wood} stroke="#5A3A1C" strokeWidth={8} />
    <path d="M-330 -40 L330 -40" stroke="#C9A06A" strokeWidth={10} />
    <rect x={-10} y={-460} width={18} height={430} fill="#6B4423" />
    {sail && <path d="M8 -440 L240 -120 L8 -70 Z" fill="#F4EAD2" stroke="#C9B48E" strokeWidth={5} />}
  </g>
);

const Bubbles: React.FC<{ x: number; y: number; f: number; n?: number; o?: number }> = ({ x, y, f, n = 6, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const t = ((f + i * 7) % 40) / 40;
      return <circle key={i} cx={x + Math.sin((f + i * 11) / 6) * 14 + (i % 3 - 1) * 10} cy={y - t * 260} r={6 + (i % 3) * 4} fill="none" stroke="rgba(220,245,255,0.8)" strokeWidth={3} opacity={1 - t} />;
    })}
  </g>
);

const Underwater: React.FC<{ f: number; floor?: number }> = ({ f, floor = 1650 }) => (
  <g>
    <defs>
      <linearGradient id="uw" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={W.light} />
        <stop offset="55%" stopColor={W.mid} />
        <stop offset="100%" stopColor={W.deep} />
      </linearGradient>
    </defs>
    <rect x={-600} y={-600} width={2300} height={3200} fill="url(#uw)" />
    {Array.from({ length: 6 }).map((_, i) => (
      <path key={i} d={`M${100 + i * 180 + Math.sin(f / 30 + i) * 30} -100 L${40 + i * 180} ${floor} L${140 + i * 180} ${floor} Z`} fill="rgba(255,255,255,0.05)" />
    ))}
    <path d={`M-600 ${floor} C0 ${floor - 60} 600 ${floor + 40} 1700 ${floor - 20} L1700 2600 L-600 2600 Z`} fill={W.sand} />
    {Array.from({ length: 10 }).map((_, i) => (
      <path key={i} d={`M${80 + i * 100} ${floor + 10} q-10 -80 10 -160 q10 80 -10 160`} stroke="#3E8E5A" strokeWidth={10} fill="none" transform={`rotate(${Math.sin((f + i * 15) / 20) * 8} ${80 + i * 100} ${floor + 10})`} />
    ))}
  </g>
);

const Oyster: React.FC<{ x: number; y: number; s?: number; open?: number; pearl?: number }> = ({ x, y, s = 1, open = 0, pearl = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-80 0 Q0 50 80 0 Q60 40 0 46 Q-60 40 -80 0 Z" fill="#6B6255" stroke="#3E382F" strokeWidth={5} />
    {pearl > 0 && (
      <g transform={`scale(${pearl})`}>
        <circle cx={0} cy={-6} r={22} fill={W.pearl} />
        <circle cx={-7} cy={-13} r={7} fill="#fff" />
        <circle cx={0} cy={-6} r={40} fill="rgba(255,250,230,0.35)" />
      </g>
    )}
    <g transform={`rotate(${-open * 55} -80 0)`}>
      <path d="M-80 0 Q0 -60 80 0 Q0 -20 -80 0 Z" fill="#8A8072" stroke="#3E382F" strokeWidth={5} />
      {[-40, 0, 40].map((rx) => (
        <path key={rx} d={`M${rx} -6 L${rx * 0.7} -36`} stroke="#5A5246" strokeWidth={4} />
      ))}
    </g>
  </g>
);

const Diver: React.FC<{ x: number; y: number; s?: number; f: number; stone?: boolean; rope?: boolean; clip?: boolean; pose?: { l: number; r: number }; rot?: number }> = ({ x, y, s = 1, f, stone, rope, clip, pose = { l: 150, r: -150 }, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {rope && <line x1={0} y1={-200} x2={0} y2={-2400} stroke="#C9A06A" strokeWidth={8} />}
    {stone && (
      <g>
        <line x1={20} y1={0} x2={20} y2={90} stroke="#C9A06A" strokeWidth={6} />
        <ellipse cx={20} cy={120} rx={50} ry={34} fill="#5C6670" stroke="#3B434B" strokeWidth={5} />
      </g>
    )}
    <Man x={0} y={0} s={1} f={f} pose={pose} hat="none" thobe="#E8EEF2" />
    {clip && <rect x={-16} y={-352} width={32} height={18} rx={8} fill="#2A1C10" />}
  </g>
);

// ------------------------------------------------------------ shots
const shots: ShotDef[] = [
  {
    at: 0,
    C: ({ l, d }) => {
      const tDown = at("L01", "لقاع");
      const dive = ease(l, tDown - 6, tDown + 20);
      return (
        <Cam l={l} d={d} a={[540, 900, 0.85]} b={[540, lerp(1000, 1600, dive), lerp(1.2, 0.9, dive)]} h={2400}>
          <World h={2400}>
            <SkyRect h={1100} top="#F2A65A" bottom="#FBE6B8" />
            <Sun x={820} y={620} r={80} f={l} />
            <Sea y={1050} f={l} />
            <rect x={-300} y={1200} width={1700} height={1400} fill={W.mid} />
            <Dhow x={460} y={1070} s={0.9} f={l} />
            <Man x={760} y={1020} s={0.6} f={l} pose="point" hat="none" thobe="#E8EEF2" />
            {Array.from({ length: 8 }).map((_, i) => (
              <path key={i} d={`M${100 + i * 120} ${1300 + i * 60} l0 140`} stroke="rgba(255,255,255,0.15)" strokeWidth={10} />
            ))}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L02", "بس"),
    C: ({ l, d }) => {
      const f = at("L02", "بس") + l;
      const bob = Math.sin(l / 8) * 60 - ease(f, at("L02", "ترجعك"), at("L02", "فوق") + 10) * 300;
      return (
        <Cam l={l} d={d} a={[540, 1100, 1.25]} b={[540, 900, 1.05]}>
          <World>
            <Underwater f={f} />
            <Diver x={540} y={1250 + bob} s={0.9} f={f} pose={{ l: 160, r: -160 }} />
            <Bubbles x={540} y={1250 + bob - 330} f={f} />
            <path d="M540 900 l0 -120 m-40 40 l40 -40 l40 40" stroke="#fff" strokeWidth={16} fill="none" opacity={ease(f, at("L02", "ترجعك") - 4, at("L02", "ترجعك") + 6)} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L03", "فربطت"),
    C: ({ l, d }) => {
      const f = at("L03", "فربطت") + l;
      const fall = ease(f, at("L03", "تنزل") - 4, at("L03", "الصاروخ") + 8);
      return (
        <Cam l={l} d={d} a={[540, 900, 1.35]} b={[540, lerp(900, 1500, fall), 1.0]} h={2400}>
          <World h={2400}>
            <Underwater f={f} floor={2100} />
            <Diver x={540} y={lerp(800, 1900, fall)} s={0.9} f={f} stone pose={{ l: 20, r: -20 }} />
            {fall > 0.05 &&
              Array.from({ length: 8 }).map((_, i) => (
                <line key={i} x1={440 + i * 28} y1={lerp(800, 1900, fall) - 700 - (i % 3) * 60} x2={440 + i * 28} y2={lerp(800, 1900, fall) - 420} stroke="rgba(255,255,255,0.5)" strokeWidth={6} />
              ))}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L04", "بس"),
    C: ({ l, d }) => {
      const f = at("L04", "بس") + l;
      const water = ease(f, at("L04", "تدخل") - 4, at("L04", "خشمك") + 8);
      return (
        <Cam l={l} d={d} a={[540, 900, 1.9]} b={[540, 820, 2.6]}>
          <World>
            <Underwater f={f} />
            <Diver x={540} y={1200} s={1.1} f={f} pose={{ l: 150, r: -150 }} />
            {Array.from({ length: 6 }).map((_, i) => {
              const t = ((f + i * 6) % 24) / 24;
              return <circle key={i} cx={lerp(640, 545, t)} cy={lerp(760, 808, t)} r={7} fill="#BFE9FF" opacity={water * (1 - t * 0.5)} />;
            })}
            {water > 0.5 && (
              <text x={660} y={700} {...txt} fontSize={70} fill="#fff" opacity={water}>
                💦
              </text>
            )}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L05", "فسكّرته"),
    C: ({ l, d }) => {
      const f = at("L05", "فسكّرته") + l;
      const clip = ease(f, at("L05", "بمشبك") - 4, at("L05", "بمشبك") + 8);
      return (
        <Cam l={l} d={d} a={[540, 820, 2.6]} b={[540, 1000, 1.3]}>
          <World>
            <Underwater f={f} />
            <Diver x={540} y={1200} s={1.1} f={f} clip={clip > 0.5} pose={{ l: 30, r: -150 }} />
            <Bubbles x={540} y={740} f={f} n={3} o={0.6} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L06", "طيب"),
    C: ({ l, d }) => {
      const f = at("L06", "طيب") + l;
      const air = 1 - ease(f, at("L06", "نفسك") - 4, at("L06", "خلص") + 12);
      return (
        <Cam l={l} d={d} a={[540, 1500, 1.2]} b={[540, 1300, 1.0]}>
          <World>
            <Underwater f={f} />
            {Array.from({ length: 9 }).map((_, i) => (
              <Oyster key={i} x={140 + i * 100 + (i % 2) * 20} y={1660 + (i % 3) * 30} s={0.8} />
            ))}
            <Diver x={420} y={1520} s={0.75} f={f} stone pose={{ l: 40, r: -70 }} rot={-10} />
            <g transform="translate(860 700)">
              <rect x={-40} y={-260} width={80} height={520} rx={40} fill="rgba(0,0,0,0.35)" stroke="#fff" strokeWidth={6} />
              <rect x={-30} y={250 - 500 * air} width={60} height={500 * air} rx={30} fill={air > 0.4 ? "#7FD3FF" : W.red} />
              <text y={330} textAnchor="middle" {...txt} fontSize={44} fill="#fff">
                نَفَس
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L07", "فربطت"),
    C: ({ l, d }) => {
      const f = at("L07", "فربطت") + l;
      const tug = f >= at("L07", "تهزّه") - 4;
      const pull = ease(f, at("L07", "يسحبك") - 2, at("L07", "قوته") + 12);
      return (
        <Cam l={l} d={d} a={[540, lerp(1700, 1500, pull), 1.0]} b={[540, lerp(1500, 700, pull), lerp(1.0, 0.75, pull)]} h={2400}>
          <World h={2400}>
            <SkyRect h={900} top="#6CC0EF" bottom="#E9F4F9" />
            <rect x={-300} y={900} width={1700} height={2000} fill={W.mid} />
            <rect x={-300} y={900} width={1700} height={80} fill={W.light} />
            <Dhow x={540} y={920} s={0.8} f={f} />
            <Man x={420} y={890} s={0.55} f={f} pose={{ l: 30, r: pull > 0.05 ? -40 + Math.sin(f) * 30 : -20 }} hat="shmagh" />
            <line x1={470} y1={830} x2={540} y2={lerp(1900, 1050, pull) - 200} stroke="#C9A06A" strokeWidth={8} />
            <Diver x={540} y={lerp(1900, 1050, pull) + (tug ? Math.sin(f * 1.3) * 6 : 0)} s={0.7} f={f} pose={{ l: 20, r: tug ? -170 : -20 }} />
            <Bubbles x={540} y={lerp(1900, 1050, pull) - 250} f={f} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L08", "بس"),
    C: ({ l, d }) => {
      const f = at("L08", "بس") + l;
      const cut = f >= at("L08", "يجرح") - 2;
      const glove = ease(f, at("L08", "فلبست") - 2, at("L08", "جلد") + 10);
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.4]} b={[540, 1000, 1.15]} rot={[-3, 2]}>
          <World>
            <Underwater f={f} />
            <g transform="translate(540 1000) scale(3)">
              <path d="M-60 40 L-60 -10 Q-60 -30 -40 -30 L40 -30 Q60 -30 60 -10 L60 40 Z" fill="#E2AE84" />
              {[-45, -15, 15, 45].map((fx) => (
                <g key={fx}>
                  <rect x={fx - 11} y={-90} width={22} height={66} rx={11} fill="#E2AE84" />
                  <rect x={fx - 13} y={-92} width={26} height={44} rx={12} fill="#8B5A2B" opacity={glove} />
                </g>
              ))}
              {cut && glove < 0.5 && [-15, 15].map((fx) => <line key={fx} x1={fx - 8} y1={-70} x2={fx + 8} y2={-56} stroke={W.red} strokeWidth={4} />)}
            </g>
            <Oyster x={540} y={1280} s={2.2} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L09", "وتغوص"),
    C: ({ l, d }) => {
      const f = at("L09", "وتغوص") + l;
      const cyc = (Math.sin(l / 7) + 1) / 2;
      return (
        <Cam l={l} d={d} a={[540, 1200, 0.8]} b={[540, 1150, 0.9]} h={2400}>
          <World h={2400}>
            <SkyRect h={900} top="#F2A65A" bottom="#FBE6B8" />
            <Sun x={lerp(200, 880, Math.min(1, l / d))} y={500} r={60} f={f} />
            <rect x={-300} y={900} width={1700} height={2000} fill={W.mid} />
            <Dhow x={540} y={920} s={0.8} f={f} />
            <Diver x={540} y={lerp(1100, 2000, cyc)} s={0.6} f={f} stone={cyc > 0.5} pose={{ l: 20, r: -20 }} />
            <Calendar x={860} y={360} s={0.75} n={1 + Math.floor(l / 10)} label="يوم" />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L10", "ومن"),
    C: ({ l, d }) => {
      const f = at("L10", "ومن") + l;
      const tP = at("L10", "لؤلؤة");
      return (
        <Cam l={l} d={d} a={[540, 1150, 1.0]} b={[540, 1120, 1.6]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#C9A06A" />
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x={-300} y={i * 160} width={1700} height={6} fill="#A87E4A" />
            ))}
            {Array.from({ length: 14 }).map((_, i) => (
              <Oyster key={i} x={120 + (i % 7) * 140} y={1450 + Math.floor(i / 7) * 120} s={0.8} open={0.8} />
            ))}
            <Oyster x={540} y={1150} s={2.4} open={ease(f, tP - 20, tP - 4)} pearl={pop(f, tP - 2, 30, 200, 9)} />
            {f >= tP &&
              Array.from({ length: 10 }).map((_, i) => {
                const a = (i / 10) * Math.PI * 2 + f / 20;
                return <circle key={i} cx={540 + Math.cos(a) * 160} cy={1120 + Math.sin(a) * 160} r={6} fill="#FFF7D6" opacity={0.8} />;
              })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L11", "مبروك"),
    C: ({ l, d }) => {
      const f = at("L11", "مبروك") + l;
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.5]} b={[540, 1000, 0.9]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#3A1F2E" />
            <circle cx={540} cy={1000} r={460} fill="rgba(255,240,210,0.08)" />
            {Array.from({ length: 22 }).map((_, i) => {
              const a = (i / 22) * Math.PI + Math.PI * 0.05;
              return <circle key={i} cx={540 + Math.cos(a) * 300} cy={760 + Math.sin(a) * 340} r={26} fill={W.pearl} stroke="#E3D8C3" strokeWidth={3} />;
            })}
            <circle cx={540} cy={1110} r={52} fill={W.pearl} />
            <circle cx={526} cy={1094} r={14} fill="#fff" />
            {Array.from({ length: 12 }).map((_, i) => {
              const t = ((f + i * 8) % 50) / 50;
              return <circle key={`s${i}`} cx={540 + Math.cos(i) * 400 * t} cy={1000 + Math.sin(i * 2) * 400 * t} r={5} fill={W.gold} opacity={1 - t} />;
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L12", "بس"),
    C: ({ l, d }) => {
      const f = at("L12", "بس") + l;
      const jp = ease(f, at("L12", "اليابان") - 4, at("L12", "اليابان") + 8);
      const seed = ease(f, at("L12", "يخلّون") - 2, at("L12", "بنفسه") + 6);
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.0]} b={[600, 1150, 1.3]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#F5EFE4" />
            <circle cx={760} cy={520} r={150} fill={W.red} opacity={jp} />
            <path d="M-300 1000 L150 640 L420 900 L640 700 L1400 1000 Z" fill="#9AA7B3" opacity={jp} />
            <rect x={-300} y={1000} width={1700} height={1200} fill="#3E8EAA" opacity={jp} />
            {Array.from({ length: 4 }).map((_, i) => (
              <g key={i} opacity={jp}>
                <line x1={100 + i * 260} y1={1000} x2={100 + i * 260} y2={1500} stroke="#C9A06A" strokeWidth={6} />
                <rect x={60 + i * 260} y={1500} width={80} height={140} fill="none" stroke="#C9A06A" strokeWidth={6} />
                <Oyster x={100 + i * 260} y={1570} s={0.4} />
              </g>
            ))}
            <g transform="translate(540 1180)" opacity={seed}>
              <Oyster x={0} y={0} s={1.6} open={0.7} />
              <circle cx={0} cy={-40 - (1 - seed) * 120} r={14} fill="#fff" />
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L13", "لؤلؤ"),
    C: ({ l, d }) => {
      const f = at("L13", "لؤلؤ") + l;
      const crash = ease(f, at("L13", "وسوق") - 2, at("L13", "طاح") + 8);
      const beach = f >= at("L13", "والغوّاصين") - 4;
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.1]} b={[540, 1050, 0.95]}>
          <World>
            {!beach ? (
              <>
                <rect x={-300} y={-300} width={1700} height={2500} fill="#F5EFE4" />
                {Array.from({ length: 60 }).map((_, i) => {
                  const t = Math.min(1, Math.max(0, (l - (i % 20)) / 30));
                  return <circle key={i} cx={200 + random(`px${i}`) * 680} cy={lerp(200, 1500 - (i % 6) * 30, t)} r={22} fill={W.pearl} stroke="#E3D8C3" strokeWidth={3} />;
                })}
                <g transform="translate(540 600)" opacity={crash}>
                  <rect x={-360} y={-200} width={720} height={420} rx={20} fill="#fff" stroke="#C9CED4" strokeWidth={6} />
                  <path d={`M-320 -140 L-120 -100 L40 -60 L${lerp(40, 320, crash)} ${lerp(-60, 180, crash)}`} stroke={W.red} strokeWidth={14} fill="none" />
                </g>
              </>
            ) : (
              <>
                <SkyRect h={1100} top="#9CB6C9" bottom="#E9E3D6" />
                <Sea y={1050} f={f} />
                <path d="M-300 1350 C300 1300 700 1360 1400 1320 L1400 2400 L-300 2400 Z" fill={W.sand} />
                <g transform="translate(300 1380) rotate(-8)">
                  <Dhow x={0} y={0} s={0.55} f={0} sail={false} />
                </g>
                {[560, 700, 840].map((x, i) => (
                  <Man key={x} x={x} y={1560} s={0.6} f={f + i * 5} pose={{ l: 20, r: -20, head: 12 }} hat="none" thobe="#E8EEF2" />
                ))}
              </>
            )}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("L14", "لين"),
    C: ({ l, d }) => {
      const f = at("L14", "لين") + l;
      const gush = ease(f, at("L14", "طلع") - 4, at("L14", "النفط") + 10);
      const tease = pop(f, at("L14", "قصة") - 2, 30, 220, 11);
      return (
        <Cam l={l} d={d} a={[540, 1500, 1.2]} b={[540, 1050, 0.95]}>
          <World>
            <SkyRect h={1100} top="#F2A65A" bottom="#FBE6B8" />
            <rect x={-300} y={1100} width={1700} height={1300} fill={W.sand} />
            {[0, 1, 2].map((k) => (
              <rect key={k} x={-300} y={1300 + k * 200} width={1700} height={200} fill={["#C9A06A", "#A8835A", "#6E5640"][k]} />
            ))}
            <rect x={-300} y={1900} width={1700} height={500} fill="#1A1410" />
            <rect x={530} y={1100} width={20} height={800} fill="#3B434B" />
            <path d="M440 1100 L540 650 L640 1100 Z" fill="none" stroke="#3B434B" strokeWidth={12} />
            {[750, 850, 950].map((y) => (
              <line key={y} x1={540 - (1100 - y) * 0.22} y1={y} x2={540 + (1100 - y) * 0.22} y2={y} stroke="#3B434B" strokeWidth={8} />
            ))}
            {gush > 0.05 &&
              Array.from({ length: 16 }).map((_, i) => {
                const t = ((f + i * 4) % 32) / 32;
                return <circle key={i} cx={540 + Math.sin(i * 1.7) * 140 * t} cy={650 - 300 * gush * (1 - t) + t * 200} r={14 + 10 * (1 - t)} fill="#1A1410" opacity={gush} />;
              })}
            <g transform={`translate(540 1650) scale(${tease})`}>
              <rect x={-230} y={-60} width={460} height={120} rx={60} fill={W.red} />
              <text y={22} textAnchor="middle" {...txt} fontSize={60} fill="#fff">
                الجزء الثاني ⬅
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
];

// ------------------------------------------------------------ cover
const Cover: React.FC = () => (
  <AbsoluteFill>
    <World h={1920}>
      <Underwater f={0} />
      <Oyster x={540} y={1250} s={3} open={0.85} pearl={1} />
      <Diver x={250} y={1000} s={0.7} f={0} stone pose={{ l: 40, r: -120 }} rot={-15} />
      <Bubbles x={250} y={650} f={10} />
    </World>
    <div dir="rtl" style={{ position: "absolute", top: 230, left: 40, right: 40, textAlign: "center", ...txt }}>
      <div style={{ fontSize: 140, color: "#fff", WebkitTextStroke: "6px rgba(0,0,0,0.85)", paintOrder: "stroke fill", lineHeight: 1.15 }}>لؤلؤ الخليج</div>
      <div style={{ display: "inline-block", marginTop: 16, padding: "6px 36px 18px", borderRadius: 24, background: W.red, color: "#fff", fontSize: 70 }}>وليش اختفى فجأة؟</div>
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ main
export const PearlStory: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  const probs = [at("L02", "بس"), at("L04", "بس"), at("L06", "بس"), at("L08", "بس"), at("L12", "بس")];
  const shake = probs.reduce((k, p) => Math.max(k, interpolate(f, [p - 1, p + 2, p + 14], [0, 1, 0], clamp)), 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ translate: `${Math.sin(f * 2.7) * 12 * shake}px ${Math.cos(f * 3.1) * 9 * shake}px` }}>
        <ShotPlayer f={f} shots={shots} total={T} />
      </AbsoluteFill>
      {shake > 0.02 && <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% 50%, transparent 50%, rgba(220,20,40,${0.45 * shake}) 100%)` }} />}
      <NameChip text="الفطام" at={at("L05", "الفطام")} until={start("L06")} top={1620} color="#2A1C10" />
      <NameChip text="هذا السيب" at={at("L07", "السيب")} until={start("L08")} top={1620} color="#8B5A2B" />
      <NameChip text="الخبط" at={at("L08", "الخبط")} until={start("L09")} top={1620} color="#8B5A2B" />
      <FollowButton at={at("L15", "تابعنا") - 4} />
      <Captions timeline={pearlTimeline} top={230} />

      <Voices timeline={pearlTimeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={pearlTimeline} src="audio/pearl/music/calm.mp3" />
      {shots.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} name="swish" at={s.at - 2} gain={0.7} />
      ))}
      {probs.map((p, i) => (
        <Sfx key={`g${i}`} name="glitch" at={p - 1} />
      ))}
      <Sfx name="whoosh" at={at("L03", "تنزل")} />
      <Sfx name="check" at={at("L05", "الفطام")} />
      <Sfx name="whoosh" at={at("L07", "يسحبك")} />
      <Sfx name="check" at={at("L08", "الخبط")} />
      <Sfx name="sparkle" at={at("L10", "لؤلؤة")} />
      <Sfx name="ding" at={at("L11", "مبروك")} />
      <Sfx name="thud" at={at("L13", "طاح")} />
      <Sfx name="impact" at={at("L14", "النفط")} />
      <Sfx name="pop" at={at("L15", "تابعنا")} />
    </AbsoluteFill>
  );
};

export const PearlStoryThumb: React.FC = () => <Cover />;
