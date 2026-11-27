import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import data from "../data/food-timeline.json";
import type { TimelineData } from "../lib/timing";
import { Cam, Can, Calendar, Clouds, Dunes, Fish, Jar, Man, MudHouse, Sea, ShotPlayer, type ShotDef, SkyRect, Soldier, Sun, World } from "./art";
import { ar, BrandPill, Captions, clamp, ease, EndCard, makeStory, MusicBed, NameChip, pop, SANS, Voices } from "./kit";

/** «أكلك ما يخرب» — food preservation from scratch, told in ~27 camera shots. */
export const fTimeline = data as TimelineData;
const { Sfx, SceneVoice, at, start } = makeStory(fTimeline, "audio/food");
const T = fTimeline.durationInFrames;
const txt = { fontFamily: SANS, fontWeight: 700 } as const;

// ------------------------------------------------------------ shared scenes
const Shore: React.FC<{ l: number; f: number; catchAt: number }> = ({ l, f, catchAt }) => {
  const jump = interpolate(f, [catchAt - 4, catchAt + 10, catchAt + 22], [0, 1, 0.75], clamp);
  return (
    <World>
      <SkyRect h={1100} top="#5DB7EE" bottom="#BFE6F7" />
      <Clouds f={l} y={300} />
      <Sun x={880} y={470} r={70} f={l} />
      <Sea y={1040} f={l} />
      <path d="M-200 1500 C200 1400 500 1460 1280 1380 L1280 2400 L-200 2400 Z" fill="#F0D49A" />
      <path d="M-200 1560 C300 1500 600 1560 1280 1500 L1280 2400 L-200 2400 Z" fill="#E9C27E" />
      {/* line from the rod tip to the fish */}
      <path d={`M1055 722 Q${1000} ${1000 - jump * 150} ${900} ${1250 - jump * 260}`} stroke="#333" strokeWidth={3} fill="none" />
      <g transform={`translate(${900} ${1250 - jump * 260}) rotate(${-60 + Math.sin(f / 2) * 20 * jump})`} opacity={jump > 0.02 ? 1 : 0}>
        <Fish x={0} y={0} s={0.7} />
      </g>
      {jump > 0.4 &&
        Array.from({ length: 8 }).map((_, i) => {
          const t = f - catchAt;
          const a = -Math.PI / 2 + (random(`sp${i}`) - 0.5) * 2;
          return <circle key={i} cx={900 + Math.cos(a) * t * 6} cy={1250 + Math.sin(a) * t * 6 + t * t * 0.3} r={8} fill="#BFE6F7" opacity={Math.max(0, 1 - t / 24)} />;
        })}
      <Man x={520} y={1560} s={1.25} f={f} pose={{ l: 20, r: -118 }} hand={<rect x={-5} y={-40} width={10} height={420} rx={5} fill="#7A4A22" transform="rotate(-25)" />} />
    </World>
  );
};

const Street: React.FC<{ f: number; stinkAt: number; noseAt: number }> = ({ f, stinkAt, noseAt }) => {
  const p = ease(f, stinkAt, stinkAt + 40);
  return (
    <World w={1800}>
      <SkyRect w={1800} h={1200} top="#6CC0EF" bottom="#F6E2B5" />
      <Clouds f={f} y={260} w={1800} n={6} />
      <Dunes y={1150} w={1800} />
      <MudHouse x={360} y={1460} w={420} h={340} />
      <MudHouse x={900} y={1460} w={380} h={300} tone={1} />
      <MudHouse x={1420} y={1460} w={420} h={340} tone={2} />
      {/* stink cloud travelling */}
      {Array.from({ length: 7 }).map((_, i) => {
        const x = lerpN(420, 1300, p) + Math.sin((f + i * 9) / 7) * 30 + i * 30 - 90;
        const y = 1160 - Math.sin(p * Math.PI) * 140 + Math.cos((f + i * 13) / 9) * 20 + (i % 3) * 30;
        return <circle key={i} cx={x} cy={y} r={46 + (i % 3) * 12} fill="#8BC34A" opacity={0.55 * Math.min(1, p * 4)} />;
      })}
      <Man x={1420} y={1460} s={0.95} f={f} pose={f >= noseAt ? "nose" : "stand"} sweat={f >= noseAt} />
      {f >= noseAt && (
        <text x={1560} y={940} fontSize={110} opacity={ease(f, noseAt, noseAt + 8)}>
          🤢
        </text>
      )}
    </World>
  );
};
const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;

const EARTH = 6000;
/** keeps the planet centred as the camera pulls out */
const lerpZ = (z: number) => 1000 - ((1 - z) / 0.94) * 406;

// ------------------------------------------------------------ shots
const shots: ShotDef[] = [
  {
    at: 0,
    name: "shore",
    C: ({ l, d }) => (
      <Cam l={l} d={d} a={[540, 900, 0.78]} b={[620, 1250, 1.45]}>
        <Shore l={l} f={l} catchAt={at("F01", "سمكة")} />
      </Cam>
    ),
  },
  {
    at: at("F01", "صار"),
    name: "sufra",
    C: ({ l, d }) => {
      const f = at("F01", "صار") + l;
      return (
        <Cam l={l} d={d} a={[540, 1130, 1.5]} b={[540, 1150, 1.0]} rot={[-4, 2]}>
          <World>
            <rect x={-200} y={-200} width={1500} height={2400} fill="#7A4A22" />
            <ellipse cx={540} cy={1150} rx={520} ry={360} fill="#C9573A" />
            {Array.from({ length: 6 }).map((_, i) => (
              <ellipse key={i} cx={540} cy={1150} rx={480 - i * 70} ry={330 - i * 48} fill="none" stroke="#F2C14E" strokeWidth={10} strokeDasharray="30 20" />
            ))}
            <ellipse cx={540} cy={1160} rx={330} ry={150} fill="#fff" stroke="#DDD" strokeWidth={8} />
            <ellipse cx={540} cy={1180} rx={250} ry={90} fill="#F4E3B5" />
            <Fish x={540} y={1130} s={1.4} tint="#D89A4A" />
            {[0, 1, 2].map((i) => {
              const t = ((f + i * 14) % 42) / 42;
              return <path key={i} d={`M${440 + i * 100} ${1040 - t * 160} q18 -22 0 -44 q-18 -22 0 -44`} stroke="rgba(255,255,255,0.8)" strokeWidth={10} fill="none" strokeLinecap="round" opacity={1 - t} />;
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F02", "بس"),
    name: "tomorrow",
    C: ({ l, d }) => {
      const t = Math.min(1, l / d);
      const a = Math.PI * (1 - t * 2);
      const night = interpolate(t, [0.15, 0.35, 0.6, 0.8], [0, 1, 1, 0], clamp);
      return (
        <Cam l={l} d={d} a={[540, 800, 0.9]} b={[540, 1300, 1.25]}>
          <World>
            <SkyRect h={1500} top="#5DB7EE" bottom="#F6E2B5" />
            <rect x={-300} y={-300} width={1700} height={1800} fill="#0E1D3D" opacity={night} />
            <g transform={`translate(${540 + Math.cos(a) * 420} ${900 - Math.sin(a) * 420})`} opacity={1 - night}>
              <circle r={80} fill="#FFE07A" />
            </g>
            <g transform={`translate(${540 + Math.cos(a + Math.PI) * 420} ${900 - Math.sin(a + Math.PI) * 420})`} opacity={night}>
              <circle r={60} fill="#F4F1DE" />
            </g>
            <rect x={-300} y={1320} width={1700} height={900} fill="#7A4A22" />
            <ellipse cx={540} cy={1420} rx={300} ry={90} fill="#fff" />
            <Fish x={540} y={1390} s={1.3} tint={t > 0.5 ? "#8FA58A" : "#D89A4A"} />
            <Calendar x={840} y={700} s={0.9} n={t > 0.5 ? 2 : 1} label="يوم" />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F02", "ريحتها"),
    name: "street",
    C: ({ l, d }) => {
      const f = at("F02", "ريحتها") + l;
      return (
        <Cam l={l} d={d} a={[480, 1150, 1.25]} b={[1330, 1200, 0.9]} w={1800}>
          <Street f={f} stinkAt={at("F02", "ريحتها")} noseAt={at("F02", "للجيران")} />
        </Cam>
      );
    },
  },
  {
    at: at("F03", "فغطّيتها"),
    name: "salt",
    C: ({ l, d }) => {
      const t0 = at("F03", "فغطّيتها");
      const f = t0 + l;
      const pile = ease(f, t0 + 6, t0 + 50);
      return (
        <Cam l={l} d={d} a={[720, 820, 1.5]} b={[540, 1180, 1.05]}>
          <World>
            <rect x={-200} y={-200} width={1500} height={2400} fill="#8B5A2B" />
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x={-200} y={i * 180 - 100} width={1500} height={6} fill="#7A4A22" />
            ))}
            <rect x={120} y={980} width={840} height={420} rx={30} fill="#C7955E" stroke="#8A5A2E" strokeWidth={10} />
            <Fish x={540} y={1190} s={2.2} />
            <g transform={`translate(760 ${640 + Math.sin(f / 3) * 8}) rotate(-130)`}>
              <rect x={-70} y={-120} width={140} height={200} rx={30} fill="#fff" stroke="#9BA7B3" strokeWidth={8} />
              <rect x={-70} y={-160} width={140} height={50} rx={16} fill="#C9D2DB" />
              {[-30, 0, 30].map((x) => (
                <circle key={x} cx={x} cy={-150} r={7} fill="#7A8794" />
              ))}
            </g>
            {Array.from({ length: 90 }).map((_, i) => {
              const s0 = t0 + random(`t${i}`) * 50;
              const p = interpolate(f, [s0, s0 + 16], [0, 1], clamp);
              const x = 540 + (random(`x${i}`) - 0.5) * 520;
              return p > 0 && p < 1 ? <rect key={i} x={lerpN(700, x, p)} y={lerpN(760, 1180, p)} width={12} height={12} fill="#fff" stroke="#DDE3E8" strokeWidth={2} /> : null;
            })}
            <path d={`M260 1250 C ${340} ${1250 - 220 * pile} ${740} ${1250 - 220 * pile} 820 1250 Z`} fill="#fff" stroke="#E2E6EA" strokeWidth={5} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F03", "يسحب"),
    name: "lens",
    C: ({ l, d }) => {
      const f = at("F03", "يسحب") + l;
      const z = ease(l, 0, 14);
      return (
        <AbsoluteFill style={{ background: "#F2EEE6" }}>
          <World>
            <defs>
              <clipPath id="lensClip">
                <circle cx={540} cy={1000} r={400 * z} />
              </clipPath>
            </defs>
            <Fish x={540} y={1000} s={3} />
            <g clipPath="url(#lensClip)">
              <rect x={0} y={500} width={1080} height={1000} fill="#F3B9A4" />
              {Array.from({ length: 7 }).map((_, r) =>
                Array.from({ length: 6 }).map((__, c) => {
                  const cx = 220 + c * 130 + (r % 2) * 65;
                  const cy = 640 + r * 110;
                  return <path key={`${r}${c}`} d="M-60 0 L-30 -52 L30 -52 L60 0 L30 52 L-30 52 Z" transform={`translate(${cx} ${cy})`} fill="#F8CBB8" stroke="#E39A84" strokeWidth={6} />;
                }),
              )}
              {Array.from({ length: 14 }).map((_, i) => {
                const t = ((f + i * 7) % 50) / 50;
                const a = random(`a${i}`) * Math.PI * 2;
                return <path key={i} d="M0 -22 C14 0 16 12 0 22 C-16 12 -14 0 0 -22 Z" fill="#3DA9FC" transform={`translate(${540 + Math.cos(a) * (40 + t * 380)} ${1000 + Math.sin(a) * (40 + t * 380)})`} opacity={1 - t} />;
              })}
            </g>
            <circle cx={540} cy={1000} r={400 * z} fill="none" stroke="#3B434B" strokeWidth={30} />
            <rect x={790} y={1260} width={60} height={380} rx={30} fill="#3B434B" transform="rotate(-40 820 1300)" opacity={z} />
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("F03", "والجراثيم"),
    name: "microbes",
    C: ({ l }) => {
      const f = at("F03", "والجراثيم") + l;
      const die = ease(f, at("F03", "تعيش"), at("F03", "تعيش") + 18);
      return (
        <AbsoluteFill style={{ background: "#111" }}>
          <World>
            <circle cx={540} cy={1000} r={470} fill="#DDEFD8" />
            {Array.from({ length: 30 }).map((_, i) => (
              <rect key={i} x={140 + random(`sx${i}`) * 800} y={600 + random(`sy${i}`) * 800} width={26} height={26} fill="#fff" stroke="#BFC8CF" strokeWidth={3} transform={`rotate(${random(`r${i}`) * 90} ${150 + random(`sx${i}`) * 800} ${610 + random(`sy${i}`) * 800})`} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => {
              const x = 300 + (i % 4) * 160 + Math.sin((f + i * 20) / 9) * 20;
              const y = 820 + Math.floor(i / 4) * 300 + Math.cos((f + i * 15) / 8) * 20;
              const s = (1.6 - die * 0.9) * pop(f, at("F03", "والجراثيم") + i * 2, 30, 220, 10);
              return (
                <g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity={1 - die * 0.55}>
                  <path d="M-40 -8 C-46 -40 -8 -54 14 -40 C46 -48 54 -8 40 14 C52 40 14 54 -8 44 C-40 52 -54 16 -40 -8 Z" fill={die > 0.5 ? "#9AA39A" : "#5FC25A"} stroke="#2F7F2D" strokeWidth={6} />
                  <circle cx={-12} cy={-6} r={7} fill="#1C120C" />
                  <circle cx={14} cy={-6} r={7} fill="#1C120C" />
                  <path d={die > 0.5 ? "M-12 20 Q2 8 16 20" : "M-12 14 Q2 24 16 14"} stroke="#1C120C" strokeWidth={5} fill="none" />
                </g>
              );
            })}
            <circle cx={540} cy={1000} r={470} fill="none" stroke="#111" strokeWidth={40} />
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("F03", "هذا"),
    name: "barrel",
    C: ({ l, d }) => {
      const f = at("F03", "هذا") + l;
      return (
        <Cam l={l} d={d} a={[400, 1120, 1.55]} b={[560, 1150, 0.95]}>
          <World>
            <SkyRect h={1400} top="#6CC0EF" bottom="#F6E2B5" />
            <Dunes y={1250} />
            <g transform="translate(400 1460)">
              <path d="M-180 -420 Q-220 -210 -180 0 L180 0 Q220 -210 180 -420 Z" fill="#9C6634" stroke="#6B4423" strokeWidth={10} />
              {[-330, -210, -90].map((y) => (
                <rect key={y} x={-205} y={y} width={410} height={26} fill="#5A5F66" />
              ))}
              <ellipse cx={0} cy={-420} rx={180} ry={44} fill="#fff" />
              {[-90, 0, 90].map((x, i) => (
                <path key={x} d={`M${x} -440 l-26 -70 l26 22 l26 -22 Z`} fill="#4F7699" transform={`rotate(${(i - 1) * 14} ${x} -440)`} />
              ))}
            </g>
            <Man x={760} y={1500} s={1.1} f={f} pose="point" flip />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F04", "بس"),
    name: "market",
    C: ({ l, d }) => {
      const t0 = at("F04", "بس");
      const f = t0 + l;
      const tX = at("F04", "ملح");
      return (
        <Cam l={l} d={d} a={[260, 1160, 1.3]} b={[1000, 1140, 1.0]} w={1300}>
          <World w={1300}>
            <rect x={-300} y={-300} width={1900} height={2400} fill="#F4DFB5" />
            {Array.from({ length: 10 }).map((_, i) => (
              <path key={i} d={`M${-100 + i * 150} 640 L${-25 + i * 150} 640 L${-25 + i * 150} 820 Q${-62 + i * 150} 860 ${-100 + i * 150} 820 Z`} fill={i % 2 ? "#fff" : "#E0313F"} />
            ))}
            <rect x={-100} y={1300} width={1500} height={80} fill="#7A4A22" />
            <rect x={-100} y={1380} width={1500} height={700} fill="#9C6634" />
            {[
              [220, "bread"],
              [640, "apple"],
              [1060, "milk"],
            ].map(([x, k], i) => {
              const xx = Number(x);
              const X = ease(f, tX - 10 + i * 6, tX - 2 + i * 6);
              return (
                <g key={String(k)} transform={`translate(${xx} 1200)`}>
                  {k === "bread" && (
                    <>
                      <path d="M-150 90 C-170 -40 -60 -90 0 -60 C60 -90 170 -40 150 90 Z" fill="#E8B04A" stroke="#A9752A" strokeWidth={8} />
                      <path d="M-70 -30 l30 50 M0 -40 l30 60 M70 -30 l30 50" stroke="#C88A2E" strokeWidth={8} />
                    </>
                  )}
                  {k === "apple" &&
                    [-70, 70, 0].map((ax, j) => (
                      <g key={j} transform={`translate(${ax} ${j === 2 ? -80 : 20})`}>
                        <circle r={78} fill="#D9473A" stroke="#962A22" strokeWidth={7} />
                        <rect x={-5} y={-104} width={10} height={32} rx={5} fill="#6B4423" />
                      </g>
                    ))}
                  {k === "milk" && (
                    <>
                      <path d="M-80 -150 L80 -150 L100 -80 L100 110 L-100 110 L-100 -80 Z" fill="#FBFBFB" stroke="#9AA7B3" strokeWidth={8} />
                      <rect x={-100} y={-30} width={200} height={70} fill="#3DA9FC" />
                    </>
                  )}
                  <g opacity={X} transform={`scale(${0.6 + 0.4 * X})`}>
                    <path d="M-110 -110 L110 110 M110 -110 L-110 110" stroke="#E0313F" strokeWidth={30} strokeLinecap="round" />
                  </g>
                </g>
              );
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F05", "فنشرت"),
    name: "roof",
    C: ({ l, d }) => {
      const t0 = at("F05", "فنشرت");
      const f = t0 + l;
      const sunT = ease(f, at("F05", "لين") - 6, at("F05", "نشف") + 20);
      const dry = sunT;
      const a = Math.PI * (0.9 - sunT * 0.8);
      return (
        <Cam l={l} d={d} a={[540, 1150, 1.35]} b={[540, 950, 0.95]} rot={[2, -1]}>
          <World>
            <SkyRect h={1300} top={sunT > 0.5 ? "#F2A65A" : "#5DB7EE"} bottom="#FBE6B8" />
            <Clouds f={l * 3} y={240} />
            <Sun x={540 + Math.cos(a) * 460} y={980 - Math.sin(a) * 560} r={70} f={f} />
            <rect x={-200} y={1180} width={1500} height={1000} fill="#C98D52" />
            <rect x={-200} y={1180} width={1500} height={34} fill="#9C6634" />
            <rect x={120} y={760} width={16} height={430} fill="#6B4423" />
            <rect x={940} y={760} width={16} height={430} fill="#6B4423" />
            <path d="M128 780 Q540 840 948 780" stroke="#3B2412" strokeWidth={6} fill="none" />
            {Array.from({ length: 7 }).map((_, i) => {
              const x = 200 + i * 108;
              const y = 780 + Math.sin(((x - 128) / 820) * Math.PI) * 58;
              const p = pop(f, t0 + 6 + i * 4, 30, 200, 11);
              const h = (200 - dry * 50) * p;
              return <path key={i} d={`M${x - 28} ${y} L${x + 28} ${y} L${x + 22} ${y + h} Q${x} ${y + h + 20} ${x - 22} ${y + h} Z`} fill={dry > 0.5 ? "#6E2A20" : "#B5473A"} stroke="#5A1E16" strokeWidth={4} transform={`rotate(${Math.sin((f + i * 10) / 12) * 4} ${x} ${y})`} />;
            })}
            <Man x={820} y={1200} s={0.95} f={f} pose="reach" flip />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F05", "هذا"),
    name: "jerky",
    C: ({ l, d }) => (
      <Cam l={l} d={d} a={[540, 1000, 1.45]} b={[540, 1020, 1.05]} rot={[-5, 2]}>
        <World>
          <rect x={-300} y={-300} width={1700} height={2500} fill="#7A4A22" />
          <ellipse cx={540} cy={1060} rx={420} ry={180} fill="#C9A06A" />
          {Array.from({ length: 6 }).map((_, i) => (
            <path key={i} d="M-150 0 Q-60 -26 0 0 Q70 26 150 0 L150 34 Q70 60 0 34 Q-60 8 -150 34 Z" fill="#6E2A20" stroke="#4A1A12" strokeWidth={4} transform={`translate(${540 + ((i % 2) - 0.5) * 120} ${960 + i * 36}) rotate(${(i - 3) * 6})`} />
          ))}
        </World>
      </Cam>
    ),
  },
  {
    at: at("F06", "بس"),
    name: "army",
    C: ({ l, d }) => {
      const f = at("F06", "بس") + l;
      return (
        <Cam l={l} d={d} a={[300, 1320, 1.35]} b={[900, 1100, 0.95]} w={1400}>
          <World w={1400}>
            <SkyRect w={1400} h={1300} top="#8FC7E8" bottom="#E9E3C8" />
            <Clouds f={l} y={300} w={1400} n={5} />
            <path d="M-300 1080 C100 920 400 1060 700 980 C1000 900 1300 1040 1700 960 L1700 2400 L-300 2400 Z" fill="#9DBF6A" />
            <path d="M-300 1260 C200 1180 700 1300 1700 1200 L1700 2400 L-300 2400 Z" fill="#86AE55" />
            <rect x={-300} y={1420} width={2000} height={90} fill="#C9A66B" />
            {Array.from({ length: 9 }).map((_, i) => (
              <Soldier key={i} x={((i * 170 + l * 3) % 1700) - 200} y={1480} s={0.62} f={f + i * 5} />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <Soldier key={`b${i}`} x={((i * 130 + l * 2) % 1700) - 200} y={1230} s={0.38} f={f + i * 7} />
            ))}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F06", "شهور"),
    name: "months",
    C: ({ l }) => {
      const n = 1 + Math.min(6, Math.floor(l / 4));
      return (
        <AbsoluteFill style={{ background: "#2F4A7A" }}>
          <World>
            {Array.from({ length: 6 }).map((_, i) => (
              <Calendar key={i} x={540 + (i - 2.5) * 40} y={1000 + i * 6} s={1.8 - i * 0.05} n={Math.max(1, n - 5 + i)} label="شهر" />
            ))}
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("F07", "وفي"),
    name: "europe",
    C: ({ l, d }) => {
      const f = at("F07", "وفي") + l;
      const year = pop(f, at("F07", "سنة"), 30, 200, 11);
      const flag = ease(f, at("F07", "فرنسا") - 4, at("F07", "فرنسا") + 8);
      return (
        <Cam l={l} d={d} a={[540, 1320, 1.3]} b={[540, 820, 0.95]}>
          <World>
            <SkyRect h={1500} top="#D9B98A" bottom="#F4E6C8" />
            <Clouds f={l} y={300} o={0.6} />
            {Array.from({ length: 9 }).map((_, i) => {
              const x = i * 130 - 40;
              const h = 300 + (i % 3) * 90;
              return (
                <g key={i}>
                  <rect x={x} y={1500 - h} width={120} height={h} fill={["#B98C64", "#A67652", "#C79C72"][i % 3]} stroke="#6B4423" strokeWidth={5} />
                  <path d={`M${x - 8} ${1500 - h} L${x + 60} ${1500 - h - 90} L${x + 128} ${1500 - h} Z`} fill="#6E4A3A" />
                  {[0, 1].map((r) => (
                    <rect key={r} x={x + 22} y={1500 - h + 40 + r * 100} width={30} height={50} fill="#F4D27A" />
                  ))}
                  {[0, 1].map((r) => (
                    <rect key={`b${r}`} x={x + 68} y={1500 - h + 40 + r * 100} width={30} height={50} fill="#F4D27A" />
                  ))}
                </g>
              );
            })}
            <rect x={-200} y={1500} width={1500} height={700} fill="#8C8072" />
            <g opacity={flag} transform="translate(540 760)">
              <rect x={-6} y={-40} width={12} height={360} fill="#555" />
              <g transform={`skewY(${Math.sin(f / 6) * 4})`}>
                <rect x={6} y={-40} width={70} height={120} fill="#2D4FA0" />
                <rect x={76} y={-40} width={70} height={120} fill="#fff" />
                <rect x={146} y={-40} width={70} height={120} fill="#D9343F" />
              </g>
            </g>
            <g transform={`translate(540 700) scale(${year})`}>
              <text x={0} y={0} textAnchor="middle" {...txt} fontSize={200} fill="#fff" stroke="#2A1C10" strokeWidth={10} paintOrder="stroke">
                {ar(1795)}
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F07", "جايزة"),
    name: "crier",
    C: ({ l, d }) => {
      const t0 = at("F07", "جايزة");
      const f = t0 + l;
      const unroll = ease(f, t0, t0 + 14);
      const tA = at("F07", "اثنعش");
      return (
        <Cam l={l} d={d} a={[300, 1250, 1.45]} b={[600, 1020, 1.05]}>
          <World>
            <rect x={-200} y={-200} width={1500} height={2400} fill="#E9D7B3" />
            <rect x={-200} y={1400} width={1500} height={900} fill="#A89A84" />
            {Array.from({ length: 6 }).map((_, i) => (
              <rect key={i} x={-200} y={1420 + i * 70} width={1500} height={4} fill="#8C8072" />
            ))}
            <Man x={300} y={1520} s={1.1} f={f} hat="tricorn" thobe="#3F5A8A" pose="wave" />
            <g transform="translate(640 760)">
              <rect x={-20} y={-20} width={40} height={40 + 600 * unroll} rx={20} fill="#C9A25E" />
              <rect x={0} y={0} width={380} height={600 * unroll} fill="#FFF6E2" stroke="#C9A25E" strokeWidth={6} />
              <rect x={-20} y={600 * unroll - 20} width={420} height={40} rx={20} fill="#C9A25E" />
              {unroll > 0.6 && (
                <>
                  <text x={190} y={120} textAnchor="middle" {...txt} fontSize={84} fill="#2A1C10">
                    جايزة
                  </text>
                  <text x={190} y={300} textAnchor="middle" {...txt} fontSize={90} fill="#B07A1E" opacity={ease(f, tA - 2, tA + 8)}>
                    {ar("12,000")}
                  </text>
                  <text x={190} y={400} textAnchor="middle" {...txt} fontSize={70} fill="#B07A1E" opacity={ease(f, tA - 2, tA + 8)}>
                    فرنك
                  </text>
                </>
              )}
            </g>
            {f >= tA &&
              Array.from({ length: 26 }).map((_, i) => {
                const t = f - tA - random(`d${i}`) * 20;
                if (t < 0) return null;
                const x = 80 + random(`cx${i}`) * 920;
                return (
                  <g key={i} transform={`translate(${x} ${Math.min(1480, -60 + t * t * 0.9)})`}>
                    <ellipse rx={30} ry={30} fill="#F4C542" stroke="#B07A1E" strokeWidth={5} />
                  </g>
                );
              })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F08", "فجا"),
    name: "shop",
    C: ({ l, d }) => {
      const t0 = at("F08", "فجا");
      const f = t0 + l;
      const tag = pop(f, at("F08", "نيكولا"), 30, 220, 12);
      return (
        <Cam l={l} d={d} a={[540, 760, 1.35]} b={[540, 1200, 1.05]}>
          <World>
            <rect x={-200} y={-200} width={1500} height={2400} fill="#F3D9D2" />
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x={i * 160 - 80} y={-200} width={80} height={2400} fill="#EFCDC4" />
            ))}
            {[640, 900].map((y) => (
              <g key={y}>
                <rect x={60} y={y} width={960} height={20} fill="#8B5A2B" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <Jar key={i} x={140 + i * 160} y={y - 74} s={0.5} />
                ))}
              </g>
            ))}
            <rect x={-200} y={1380} width={1500} height={900} fill="#C68E5A" />
            <rect x={120} y={1200} width={840} height={180} fill="#8B5A2B" />
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={300 + i * 160} cy={1180} r={44} fill={["#F48FB1", "#FFD54F", "#A5D6A7", "#CE93D8"][i]} stroke="#fff" strokeWidth={6} />
            ))}
            <Man x={540} y={1220} s={1.05} f={f} hat="chef" thobe="#F7F7F7" pose="wave" />
            <g transform={`translate(540 1500) scale(${tag})`}>
              <rect x={-250} y={-60} width={500} height={120} rx={60} fill="#2A1C10" />
              <text x={0} y={22} textAnchor="middle" {...txt} fontSize={62} fill="#fff">
                نيكولا آبير
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F08", "حط"),
    name: "jarfill",
    C: ({ l, d }) => {
      const t0 = at("F08", "حط");
      const f = t0 + l;
      const tC = at("F08", "وسكّره");
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.25]} b={[540, 960, 1.4]}>
          <World>
            <rect x={-200} y={-200} width={1500} height={2400} fill="#F3D9D2" />
            <rect x={-200} y={1150} width={1500} height={900} fill="#8B5A2B" />
            <Jar x={540} y={1040} s={1.1} cork={ease(f, tC - 2, tC + 8)} fill={ease(f, t0, t0 + 20)} />
            {[0, 1, 2].map((i) => {
              const p = interpolate(f, [t0 + i * 6, t0 + 14 + i * 6], [0, 1], clamp);
              return p > 0 && p < 1 ? <circle key={i} cx={520 + i * 20} cy={lerpN(600, 1000, p)} r={30} fill={["#E07A3A", "#7DB24A", "#D9473A"][i]} /> : null;
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F08", "وغلاه"),
    name: "boil",
    C: ({ l, d }) => {
      const f = at("F08", "وغلاه") + l;
      return (
        <Cam l={l} d={d} a={[540, 1420, 1.45]} b={[540, 1020, 1.0]}>
          <World>
            <rect x={-200} y={-200} width={1500} height={2400} fill="#3B2A22" />
            <path d="M150 820 L930 820 L880 1400 L200 1400 Z" fill="#5C6670" stroke="#3B434B" strokeWidth={12} />
            <path d="M170 900 L910 900 L880 1380 L200 1380 Z" fill="#7FC1EA" opacity={0.75} />
            {[-1, 0, 1].map((i) => (
              <Jar key={i} x={540 + i * 220} y={1180} s={0.8} />
            ))}
            {Array.from({ length: 22 }).map((_, i) => {
              const t = ((f + i * 7) % 40) / 40;
              return <circle key={i} cx={220 + random(`bx${i}`) * 640} cy={1360 - t * 460} r={8 + t * 12} fill="#E6F6FF" opacity={0.9 - t * 0.6} />;
            })}
            {Array.from({ length: 6 }).map((_, i) => (
              <path key={i} d={`M${230 + i * 125} 1500 q30 -110 0 -170 q80 70 50 170 Z`} fill={i % 2 ? "#FFC23B" : "#FF8A2A"} transform={`translate(0 ${Math.sin((f + i * 5) / 3) * 10})`} />
            ))}
            {[0, 1, 2].map((i) => {
              const t = ((f + i * 15) % 45) / 45;
              return <path key={`s${i}`} d={`M${380 + i * 160} ${800 - t * 220} q20 -26 0 -52 q-20 -26 0 -52`} stroke="rgba(255,255,255,0.7)" strokeWidth={14} fill="none" strokeLinecap="round" opacity={1 - t} />;
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F08", "والأكل"),
    name: "lasts",
    C: ({ l }) => {
      const f = at("F08", "والأكل") + l;
      const n = 1 + Math.min(8, Math.floor(l / 3));
      const ok = pop(f, at("F08", "عاش"), 30, 240, 10);
      return (
        <AbsoluteFill style={{ background: "#F3D9D2" }}>
          <World>
            <Calendar x={700} y={820} s={1.4} n={n} label="شهر" />
            <Jar x={380} y={1160} s={1.2} />
            <g transform={`translate(720 1250) scale(${ok})`}>
              <circle r={110} fill="#2BB673" />
              <path d="M-48 4 L-12 42 L56 -36" stroke="#fff" strokeWidth={24} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("F09", "بس"),
    name: "wagon",
    C: ({ l, d }) => {
      const t0 = at("F09", "بس");
      const f = t0 + l;
      const tB = at("F09", "ينكسر");
      const broken = f >= tB;
      const bump = Math.abs(Math.sin(f / 3)) * 18;
      const x = 160 + Math.min(l, tB - t0) * 7;
      return (
        <Cam l={l} d={d} a={[260, 1180, 1.35]} b={[760, 1150, 1.05]}>
          <World>
            <SkyRect h={1300} top="#9CC9E6" bottom="#EADFC4" />
            <Clouds f={l * 2} y={300} />
            <path d="M-300 1150 C100 1080 600 1180 1400 1100 L1400 2400 L-300 2400 Z" fill="#A8C27A" />
            <rect x={-300} y={1300} width={1900} height={160} fill="#B99467" />
            {Array.from({ length: 8 }).map((_, i) => (
              <ellipse key={i} cx={i * 180 - ((l * 7) % 180)} cy={1380} rx={30} ry={14} fill="#8C6E4A" />
            ))}
            <g transform={`translate(${x} ${1290 - (broken ? 0 : bump)})`}>
              <rect x={-170} y={-150} width={340} height={110} fill="#8B5A2B" stroke="#5A3A1C" strokeWidth={8} />
              {!broken && [-100, 0, 100].map((jx) => <Jar key={jx} x={jx} y={-210} s={0.45} />)}
              {[-110, 110].map((wx) => (
                <g key={wx} transform={`translate(${wx} -30) rotate(${f * 12})`}>
                  <circle r={56} fill="none" stroke="#3B2412" strokeWidth={12} />
                  <path d="M-56 0 L56 0 M0 -56 L0 56" stroke="#3B2412" strokeWidth={8} />
                </g>
              ))}
            </g>
            {broken &&
              Array.from({ length: 22 }).map((_, i) => {
                const t = f - tB;
                const a = -Math.PI / 2 + (random(`b${i}`) - 0.5) * 2.8;
                const v = 10 + random(`bv${i}`) * 16;
                const bx = x + Math.cos(a) * v * t;
                const by = 1080 + Math.sin(a) * v * t + 0.9 * t * t;
                return <path key={i} d="M0 -26 L22 10 L-18 18 Z" fill="rgba(190,230,255,0.8)" stroke="#7FB8D9" strokeWidth={4} transform={`translate(${bx} ${Math.min(by, 1380)}) rotate(${t * 14 + i * 30})`} />;
              })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F10", "فجا"),
    name: "workshop",
    C: ({ l, d }) => {
      const t0 = at("F10", "فجا");
      const f = t0 + l;
      const roll = ease(f, at("F10", "علبة") - 10, at("F10", "علبة") + 10);
      return (
        <Cam l={l} d={d} a={[260, 1000, 1.45]} b={[700, 1080, 1.1]}>
          <World>
            <rect x={-200} y={-200} width={1500} height={2400} fill="#3E4A55" />
            {Array.from({ length: 6 }).map((_, i) => (
              <rect key={i} x={i * 200 - 60} y={300} width={120} height={60} rx={8} fill="#56636F" />
            ))}
            <rect x={-200} y={1300} width={1500} height={900} fill="#5A3A1C" />
            <rect x={80} y={1250} width={920} height={60} fill="#7A4A22" />
            <Man x={260} y={1300} s={1} f={f} hat="none" thobe="#7A6A58" pose="hammer" armSwing={30} hand={<rect x={-14} y={-10} width={28} height={110} rx={8} fill="#555E68" />} />
            <g transform="translate(700 1080)">
              {roll < 0.5 ? (
                <rect x={-220 + roll * 200} y={-140} width={440 - roll * 400} height={280} fill="#B8BEC6" stroke="#8A9099" strokeWidth={6} />
              ) : (
                <Can x={0} y={20} s={1.2 * ease(roll, 0.5, 1) + 0.0001} />
              )}
            </g>
            {Array.from({ length: 10 }).map((_, i) => {
              const t = ((f + i * 4) % 18) / 18;
              const a = -Math.PI / 2 + (random(`sk${i}`) - 0.5) * 2.4;
              return <circle key={i} cx={560 + Math.cos(a) * t * 140} cy={960 + Math.sin(a) * t * 140 + t * t * 80} r={6} fill="#FFD54F" opacity={1 - t} />;
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F10", "هذي"),
    name: "cans",
    C: ({ l, d }) => (
      <Cam l={l} d={d} a={[540, 1500, 1.1]} b={[540, 900, 1]} h={2600}>
        <World h={2600}>
          <rect x={-300} y={-300} width={1700} height={3200} fill="#E7DCCB" />
          {Array.from({ length: 6 }).map((_, r) => (
            <g key={r}>
              <rect x={40} y={500 + r * 340} width={1000} height={24} fill="#8B5A2B" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Can key={i} x={150 + i * 195} y={500 + r * 340 - 90} s={0.7} />
              ))}
            </g>
          ))}
        </World>
      </Cam>
    ),
  },
  {
    at: at("F11", "والمضحك"),
    name: "gap",
    C: ({ l }) => {
      const f = at("F11", "والمضحك") + l;
      const tG = at("F11", "سبقت");
      const tO = at("F11", "الفتّاحة");
      const tF = at("F11", "خمسين");
      const bar = ease(f, tO, tF + 10);
      return (
        <AbsoluteFill style={{ background: "#FFF7E6" }}>
          <World>
            <text x={540} y={700} textAnchor="middle" fontSize={180} opacity={1 - ease(f, tG - 6, tG)}>
              😂
            </text>
            <g opacity={ease(f, tG - 4, tG + 6)}>
              <Can x={820} y={1000} s={1} />
              <text x={820} y={1220} textAnchor="middle" {...txt} fontSize={56} fill="#2A1C10">
                العلبة
              </text>
            </g>
            <g opacity={ease(f, tO - 4, tO + 6)} transform="translate(260 1000)">
              <path d="M-60 -100 L20 -100 L40 -60 L-40 60 L-80 40 Z" fill="#9AA3AD" stroke="#5A6370" strokeWidth={6} />
              <rect x={-110} y={30} width={60} height={160} rx={24} fill="#C0392B" transform="rotate(30 -80 110)" />
              <text x={0} y={220} textAnchor="middle" {...txt} fontSize={56} fill="#2A1C10">
                الفتّاحة
              </text>
            </g>
            <line x1={700} y1={1320} x2={700 - 360 * bar} y2={1320} stroke="#E0313F" strokeWidth={14} strokeLinecap="round" />
            <text x={540} y={1440} textAnchor="middle" {...txt} fontSize={86} fill="#E0313F" opacity={ease(f, tF, tF + 8)}>
              {`≈ ${ar(50)} سنة`}
            </text>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("F11", "كانوا"),
    name: "open",
    C: ({ l, d }) => {
      const f = at("F11", "كانوا") + l;
      const tK = at("F11", "بالسكين");
      const tH = at("F11", "بالمطرقة");
      const hammer = f >= tH - 8;
      const hit = f >= tH + 4;
      return (
        <Cam l={l} d={d} a={[280, 1080, 1.35]} b={[600, 1150, 1.15]} rot={[3, -2]}>
          <World>
            <rect x={-200} y={-200} width={1500} height={2400} fill="#6E7F5A" />
            <rect x={-200} y={1300} width={1500} height={900} fill="#8B6B45" />
            <g transform={`translate(560 1180) rotate(${hit ? Math.sin((f - tH) * 1.5) * 8 * Math.exp(-(f - tH) / 12) : 0})`}>
              <Can x={0} y={0} s={1} dent={hit ? 1 : 0} />
            </g>
            {hit &&
              Array.from({ length: 14 }).map((_, i) => {
                const t = f - tH - 4;
                const a = -Math.PI / 2 + (random(`j${i}`) - 0.5) * 2.4;
                return <circle key={i} cx={560 + Math.cos(a) * t * 10} cy={1060 + Math.sin(a) * t * 10 + t * t * 0.6} r={14} fill="#D9473A" opacity={Math.max(0, 1 - t / 26)} />;
              })}
            <Man
              x={240}
              y={1320}
              s={1.05}
              f={f}
              hat="helmet"
              thobe="#2F4A7A"
              pose={hammer ? { l: 10, r: interpolate(f, [tH - 8, tH, tH + 4], [-170, -170, -70], clamp) } : { l: 10, r: -70 + Math.max(0, Math.sin((f - tK) / 3)) * 20 }}
              hand={hammer ? <g><rect x={-12} y={-10} width={24} height={150} rx={8} fill="#8B5A2B" /><rect x={-60} y={120} width={120} height={60} rx={10} fill="#555E68" /></g> : <g><rect x={-10} y={0} width={20} height={60} rx={6} fill="#6B4423" /><path d="M-10 60 L10 60 L4 200 L-4 200 Z" fill="#DDE3E8" stroke="#8A9099" strokeWidth={4} /></g>}
            />
            {hit && (
              <text x={760} y={880} textAnchor="middle" {...txt} fontSize={130} fill="#fff" stroke="#E0313F" strokeWidth={10} paintOrder="stroke" opacity={1 - ease(f, tH + 20, tH + 34)}>
                طَق!
              </text>
            )}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F12", "وبعدها"),
    name: "kitchen",
    C: ({ l, d }) => {
      const t0 = at("F12", "وبعدها");
      const f = t0 + l;
      const tF = at("F12", "الثلاجة");
      const open = ease(f, tF, tF + 16);
      const dolly = ease(f, tF + 16, at("F12", "طازج"));
      return (
        <Cam l={l} d={d} a={[540, 1040, 1]} b={[540, 1000, 1 + 0.7 * dolly]}>
          <World>
            <rect x={-200} y={-200} width={1500} height={2400} fill="#EAF1F4" />
            {Array.from({ length: 10 }).map((_, i) => (
              <rect key={i} x={-200} y={i * 120} width={1500} height={4} fill="#D5E0E6" />
            ))}
            <rect x={-200} y={1400} width={1500} height={800} fill="#C9D3D9" />
            <rect x={-200} y={1100} width={330} height={300} fill="#9FB0BF" />
            <rect x={950} y={1100} width={400} height={300} fill="#9FB0BF" />
            <g transform="translate(540 1400)">
              <rect x={-260} y={-1000} width={520} height={1000} rx={40} fill="#F7FAFC" stroke="#9FB0BF" strokeWidth={10} />
              <rect x={-240} y={-980} width={480} height={960} rx={24} fill="#CFE8FA" />
              <circle cx={0} cy={-500} r={420 * open} fill="rgba(150,210,255,0.35)" />
              {[-700, -420, -160].map((y) => (
                <rect key={y} x={-220} y={y} width={440} height={12} rx={6} fill="#9FC7E6" />
              ))}
              <Jar x={-110} y={-800} s={0.55} />
              <Can x={110} y={-800} s={0.55} />
              <Fish x={0} y={-520} s={0.9} />
              <circle cx={-90} cy={-240} r={60} fill="#D9473A" />
              <circle cx={90} cy={-240} r={56} fill="#7DB24A" />
              <g transform={`translate(-260 0) scale(${1 - open * 0.95} 1) translate(260 0)`}>
                <rect x={-260} y={-1000} width={520} height={1000} rx={40} fill="#F7FAFC" stroke="#9FB0BF" strokeWidth={10} />
                <rect x={170} y={-700} width={30} height={240} rx={15} fill="#9FB0BF" />
              </g>
            </g>
            {open > 0.5 &&
              Array.from({ length: 14 }).map((_, i) => {
                const t = ((f + i * 9) % 60) / 60;
                return (
                  <text key={i} x={320 + random(`sn${i}`) * 440} y={1300 - t * 700} fontSize={40} fill="#fff" opacity={(1 - t) * 0.9}>
                    ❄
                  </text>
                );
              })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("F13", "ودبّرتها"),
    name: "pullout",
    C: ({ l, d }) => {
      const t = ease(l, 0, Math.min(d, 70));
      const z = interpolate(t, [0, 1], [1, 0.06]);
      return (
        <AbsoluteFill style={{ background: "#071026" }}>
          <World>
            {Array.from({ length: 40 }).map((_, i) => (
              <circle key={i} cx={random(`st${i}`) * 1080} cy={random(`sy${i}`) * 1920} r={2 + random(`sr${i}`) * 3} fill="#fff" opacity={0.8} />
            ))}
            <g transform={`translate(540 ${lerpZ(z)}) scale(${z}) translate(-540 -1000)`}>
              <circle cx={540} cy={1100 + EARTH} r={EARTH * 1.04} fill="rgba(120,200,255,0.25)" />
              <clipPath id="earthClip">
                <circle cx={540} cy={1100 + EARTH} r={EARTH} />
              </clipPath>
              <circle cx={540} cy={1100 + EARTH} r={EARTH} fill="#2E7FC4" />
              <g clipPath="url(#earthClip)">
                <ellipse cx={540} cy={1100 + EARTH * 0.3} rx={EARTH * 0.55} ry={EARTH * 0.42} fill="#E9C27E" />
                <ellipse cx={540 + EARTH * 0.55} cy={1100 + EARTH * 0.95} rx={EARTH * 0.3} ry={EARTH * 0.2} fill="#6DBE5A" />
                <ellipse cx={540 - EARTH * 0.6} cy={1100 + EARTH * 1.2} rx={EARTH * 0.25} ry={EARTH * 0.3} fill="#E3B877" />
              </g>
              <MudHouse x={540} y={1100} w={420} h={320} />
              <MudHouse x={100} y={1100} w={320} h={260} tone={1} />
              <MudHouse x={980} y={1100} w={320} h={260} tone={2} />
            </g>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: start("F14"),
    name: "loop",
    C: ({ l, d }) => (
      <Cam l={l} d={d} a={[540, 900, 0.78]} b={[620, 1250, 1.45]}>
        <Shore l={l} f={start("F14") + l} catchAt={at("F14", "سمكة")} />
      </Cam>
    ),
  },
];

// ------------------------------------------------------------ cover (frame 0)
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#7A4A22" }}>
    <World>
      <rect x={0} y={0} width={1080} height={1920} fill="#E7DCCB" />
      <g transform="translate(540 1500)">
        <rect x={-300} y={-900} width={600} height={900} rx={40} fill="#F7FAFC" stroke="#9FB0BF" strokeWidth={10} />
        <rect x={-280} y={-880} width={560} height={860} rx={24} fill="#CFE8FA" />
        <circle cx={0} cy={-450} r={420} fill="rgba(150,210,255,0.35)" />
        {[-620, -360].map((y) => (
          <rect key={y} x={-260} y={y} width={520} height={12} rx={6} fill="#9FC7E6" />
        ))}
        <Jar x={-120} y={-740} s={0.6} />
        <Can x={120} y={-740} s={0.6} />
        <Fish x={0} y={-480} s={1} />
        <ellipse cx={-120} cy={-200} rx={80} ry={60} fill="#6E2A20" />
        <ellipse cx={120} cy={-200} rx={80} ry={60} fill="#fff" stroke="#DDE3E8" strokeWidth={4} />
      </g>
      <rect x={0} y={1500} width={1080} height={420} fill="#9C6634" />
    </World>
    <BrandPill />
    <div dir="rtl" style={{ position: "absolute", top: 250, left: 40, right: 40, textAlign: "center", ...txt }}>
      <div style={{ fontSize: 150, color: "#fff", WebkitTextStroke: "6px rgba(0,0,0,0.85)", paintOrder: "stroke fill", lineHeight: 1.15 }}>أكلك ما يخرب</div>
      <div style={{ display: "inline-block", marginTop: 20, padding: "6px 36px 18px", borderRadius: 24, background: "#E0313F", color: "#fff", fontSize: 70 }}>من الملح… للثلاجة</div>
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ main
export const FoodStory: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  const shake = [at("F02", "بس"), at("F04", "بس"), at("F06", "بس"), at("F09", "ينكسر")].reduce((k, p) => Math.max(k, interpolate(f, [p - 1, p + 2, p + 14], [0, 1, 0], clamp)), 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ translate: `${Math.sin(f * 2.7) * 12 * shake}px ${Math.cos(f * 3.1) * 9 * shake}px` }}>
        <ShotPlayer f={f} shots={shots} total={T} />
      </AbsoluteFill>
      {shake > 0.02 && <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% 50%, transparent 50%, rgba(220,20,40,${0.5 * shake}) 100%)` }} />}
      <NameChip text="هذا تمليح" at={at("F03", "تمليح")} until={start("F04")} top={1580} />
      <NameChip text="هذا قديد" at={at("F05", "قديد")} until={start("F06")} top={1580} />
      <NameChip text="المعلّبات" at={at("F10", "المعلّبات")} until={start("F11")} top={1580} />
      <NameChip text="الثلاجة" at={at("F12", "الثلاجة")} until={start("F13")} top={1580} color="#1F7FC4" />
      <EndCard from={at("F13", "وإذا") - 6} tFollow={at("F13", "تابع")} until={start("F14")} line="أكلك ما يخرب" />
      <BrandPill />
      <Captions timeline={fTimeline} top={250} />

      <Voices timeline={fTimeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={fTimeline} src="audio/food/music/calm.mp3" />
      {shots.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} name="swish" at={s.at - 2} gain={0.7} />
      ))}
      {[at("F02", "بس"), at("F04", "بس"), at("F06", "بس")].map((p, i) => (
        <Sfx key={`g${i}`} name="glitch" at={p - 1} />
      ))}
      <Sfx name="pop" at={at("F01", "سمكة")} />
      <Sfx name="check" at={at("F03", "تمليح")} />
      <Sfx name="check" at={at("F05", "قديد")} />
      <Sfx name="riser" at={start("F07") - 6} />
      <Sfx name="impact" at={at("F07", "اثنعش")} />
      <Sfx name="pop" at={at("F08", "وسكّره")} />
      <Sfx name="ding" at={at("F08", "عاش")} />
      <Sfx name="impact" at={at("F09", "ينكسر")} />
      <Sfx name="check" at={at("F10", "المعلّبات")} />
      <Sfx name="tick" at={at("F11", "بالسكين")} />
      <Sfx name="thud" at={at("F11", "بالمطرقة") + 4} />
      <Sfx name="sparkle" at={at("F12", "الثلاجة")} />
      <Sfx name="riser" at={at("F13", "ودبّرتها") - 6} />
      <Sfx name="pop" at={at("F13", "تابع")} />
    </AbsoluteFill>
  );
};

export const FoodStoryThumb: React.FC = () => <Cover />;
