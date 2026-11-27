import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../data/sea-timeline.json";
import type { TimelineData } from "../lib/timing";
import { Cam, Clouds, Dunes, Man, MudHouse, Sea, ShotPlayer, type ShotDef, SkyRect, Sun, Wind, World } from "./art";
import { ar, Captions, clamp, ease, makeStory, MusicBed, NameChip, pop, SANS, Voices } from "./kit";

/** «من موية البحر… لحنفيتك» — desalination from scratch, voice: Fahad. */
export const seaTimeline = data as TimelineData;
const { Sfx, SceneVoice, at, start } = makeStory(seaTimeline, "audio/sea");
const T = seaTimeline.durationInFrames;
const txt = { fontFamily: SANS, fontWeight: 700 } as const;
const C = { sea: "#2E8FC9", water: "#5FB6E6", fresh: "#7FD3FF", salt: "#FFFFFF", red: "#E0313F", orange: "#F2793A", steel: "#8A96A3", steelDark: "#5C6670" };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ------------------------------------------------------------ props
const Glass: React.FC<{ fill?: number; color?: string }> = ({ fill = 0.7, color = C.water }) => (
  <g>
    <path d="M-34 -50 L34 -50 L26 50 L-26 50 Z" fill="rgba(220,240,255,0.55)" stroke="#9CC7E0" strokeWidth={5} />
    <path d={`M${-34 + 8 * (1 - fill)} ${50 - 100 * fill} L${34 - 8 * (1 - fill)} ${50 - 100 * fill} L26 50 L-26 50 Z`} fill={color} opacity={0.85} />
  </g>
);

const Pot: React.FC<{ x: number; y: number; s?: number; f: number; lid?: number; boil?: number; fire?: number }> = ({ x, y, s = 1, f, lid = 0, boil = 1, fire = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {fire > 0 &&
      [-80, -30, 20, 70].map((fx, i) => (
        <path key={i} d={`M${fx} 150 q24 -${110 * fire} 0 -${150 * fire} q70 ${60 * fire} 40 ${150 * fire} Z`} fill={i % 2 ? "#FFC23B" : "#FF8A2A"} transform={`translate(0 ${Math.sin((f + i * 5) / 3) * 8 * fire})`} />
      ))}
    {[-120, -40, 40, 120].map((lx, i) => (
      <rect key={i} x={lx - 60} y={150 + (i % 2) * 14} width={140} height={26} rx={12} fill={fire > 0.05 ? "#6B4423" : "#3A2A1C"} transform={`rotate(${(i - 1.5) * 10} ${lx} 160)`} />
    ))}
    <path d="M-160 -60 L160 -60 L140 120 L-140 120 Z" fill="#4A5560" stroke="#2E363E" strokeWidth={8} />
    <rect x={-150} y={-40} width={300} height={30} fill={C.sea} opacity={0.8} />
    {boil > 0 &&
      Array.from({ length: 8 }).map((_, i) => {
        const t = ((f + i * 7) % 30) / 30;
        return <circle key={i} cx={-120 + i * 34} cy={-40 - t * 30} r={6 + t * 6} fill="#DDF2FF" opacity={(1 - t) * boil} />;
      })}
    {lid > 0 && (
      <g transform={`translate(0 ${-200 + 120 * lid}) rotate(-8)`} opacity={Math.min(1, lid * 2)}>
        <ellipse cx={0} cy={0} rx={190} ry={22} fill="#F4F4F4" stroke="#C9CED4" strokeWidth={6} />
      </g>
    )}
  </g>
);

const Factory: React.FC<{ x: number; y: number; s?: number; f: number; grow?: number; smoke?: boolean; label?: string; tone?: number }> = ({ x, y, s = 1, f, grow = 1, smoke, label, tone = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <clipPath id={`grow${x}`}>
      <rect x={-400} y={-700 * grow} width={800} height={700 * grow + 10} />
    </clipPath>
    <g clipPath={`url(#grow${x})`}>
      <rect x={-260} y={-260} width={520} height={260} fill={tone ? "#D9E2EA" : "#BFC9D3"} stroke={C.steelDark} strokeWidth={8} />
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={-230 + i * 98} y={-210} width={60} height={50} fill="#7FA6C8" />
      ))}
      {tone ? (
        [-150, 0, 150].map((tx) => <rect key={tx} x={tx - 50} y={-420} width={100} height={160} rx={50} fill="#E7EEF4" stroke={C.steelDark} strokeWidth={6} />)
      ) : (
        <>
          <rect x={-200} y={-560} width={70} height={300} fill="#9AA5B0" stroke={C.steelDark} strokeWidth={6} />
          <rect x={-80} y={-620} width={70} height={360} fill="#9AA5B0" stroke={C.steelDark} strokeWidth={6} />
          {[0, 1, 2, 3].map((r) => (
            <rect key={r} x={-200} y={-540 + r * 60} width={70} height={14} fill={C.red} opacity={0.6} />
          ))}
        </>
      )}
    </g>
    {smoke &&
      grow > 0.95 &&
      Array.from({ length: 6 }).map((_, i) => {
        const t = ((f + i * 10) % 60) / 60;
        return <circle key={i} cx={-45 + Math.sin((f + i * 20) / 12) * 30 + t * 80} cy={-640 - t * 260} r={30 + t * 40} fill="#E6E9EC" opacity={(1 - t) * 0.8} />;
      })}
    {label && (
      <g transform="translate(0 70)">
        <rect x={-180} y={-36} width={360} height={72} rx={36} fill="rgba(0,0,0,0.6)" />
        <text x={0} y={14} textAnchor="middle" {...txt} fontSize={40} fill="#fff">
          {label}
        </text>
      </g>
    )}
  </g>
);

const City: React.FC<{ x: number; y: number; s?: number; night?: number }> = ({ x, y, s = 1, night = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[
      [-300, 320, 120],
      [-170, 520, 110],
      [-40, 380, 130],
      [90, 640, 90],
      [200, 300, 120],
      [320, 440, 100],
    ].map(([bx, h, w], i) => (
      <g key={i}>
        <rect x={bx} y={-h} width={w} height={h} fill={["#9FB3C8", "#B7C6D6", "#8EA3B9"][i % 3]} stroke="#6B7F95" strokeWidth={5} />
        {Array.from({ length: Math.floor(h / 70) }).map((_, r) =>
          [0, 1].map((c) => <rect key={`${r}${c}`} x={bx + 18 + c * (w / 2 - 6)} y={-h + 24 + r * 70} width={w / 2 - 36} height={30} fill={night ? "#FFE27A" : "#DDEAF5"} />),
        )}
      </g>
    ))}
  </g>
);

/** Solar still in section. */
const Still: React.FC<{ f: number; cover: number; vapor: number; drip: number }> = ({ f, cover, vapor, drip }) => (
  <g>
    <rect x={160} y={1160} width={760} height={220} fill="#1F2428" stroke="#3B434B" strokeWidth={10} />
    <rect x={180} y={1250} width={720} height={120} fill={C.sea} opacity={0.9} />
    {/* tilted glass */}
    <g opacity={cover}>
      <path d={`M160 1160 L920 ${1160 - 300 * cover} L920 1160 Z`} fill="rgba(200,235,255,0.25)" />
      <line x1={160} y1={1160} x2={920} y2={1160 - 300 * cover} stroke="#BFE3F7" strokeWidth={12} />
    </g>
    {/* collecting gutter on the low side */}
    <rect x={130} y={1140} width={60} height={40} fill="#5C6670" opacity={cover} />
    {vapor > 0 &&
      Array.from({ length: 14 }).map((_, i) => {
        const t = ((f + i * 6) % 40) / 40;
        const x = 220 + random(`v${i}`) * 640;
        return <circle key={i} cx={x} cy={1240 - t * (80 + (x - 160) * 0.3)} r={8 + t * 6} fill="#fff" opacity={vapor * (1 - t) * 0.8} />;
      })}
    {drip > 0 &&
      Array.from({ length: 6 }).map((_, i) => {
        const t = ((f + i * 9) % 54) / 54;
        const x = lerp(860 - i * 60, 170, t);
        const y = 1160 - (300 * (x - 160)) / 760 + 14;
        return <path key={i} d="M0 -12 C8 0 9 6 0 10 C-9 6 -8 0 0 -12 Z" fill={C.fresh} transform={`translate(${x} ${y})`} opacity={drip} />;
      })}
  </g>
);

const Gauge: React.FC<{ x: number; y: number; v: number; label?: string }> = ({ x, y, v, label }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={110} fill="#F4F6F8" stroke={C.steelDark} strokeWidth={10} />
    <path d="M-80 40 A90 90 0 1 1 80 40" fill="none" stroke="#D7DCE1" strokeWidth={14} />
    <path d="M40 -78 A90 90 0 0 1 80 40" fill="none" stroke={C.red} strokeWidth={14} />
    <line x1={0} y1={0} x2={Math.cos(Math.PI * (1.25 - 1.5 * v)) * 80} y2={-Math.sin(Math.PI * (1.25 - 1.5 * v)) * 80} stroke="#2A1C10" strokeWidth={10} strokeLinecap="round" />
    <circle r={14} fill="#2A1C10" />
    {label && (
      <text y={80} textAnchor="middle" {...txt} fontSize={30} fill="#2A1C10">
        {label}
      </text>
    )}
  </g>
);

const Beach: React.FC<{ l: number; f: number }> = ({ l, f }) => (
  <>
    <SkyRect h={1100} top="#5DB7EE" bottom="#CDEBF8" />
    <Clouds f={l} y={300} />
    <Sun x={860} y={480} r={70} f={f} />
    <Sea y={1000} f={l} />
    <path d="M-300 1420 C200 1330 600 1400 1400 1320 L1400 2400 L-300 2400 Z" fill="#F0D49A" />
    <path d="M-300 1520 C300 1460 700 1520 1400 1460 L1400 2400 L-300 2400 Z" fill="#E9C27E" />
  </>
);

// ------------------------------------------------------------ shots
const shots: ShotDef[] = [
  {
    at: 0,
    C: ({ l, d }) => (
      <Cam l={l} d={d} a={[540, 820, 0.75]} b={[560, 1250, 1.3]}>
        <World>
          <Beach l={l} f={l} />
          <Man x={lerp(900, 560, Math.min(1, l / 70))} y={1500} s={1.15} f={l} walk={l < 70} pose={l >= at("S01", "عطشان") ? "hot" : "stand"} sweat={l >= at("S01", "عطشان")} flip />
        </World>
      </Cam>
    ),
  },
  {
    at: at("S01", "الموية"),
    C: ({ l, d }) => {
      const f = at("S01", "الموية") + l;
      const spit = f >= at("S01", "تنشرب");
      return (
        <Cam l={l} d={d} a={[560, 1180, 1.6]} b={[520, 1100, 1.9]}>
          <World>
            <Beach l={l} f={f} />
            <Man x={540} y={1500} s={1.15} f={f} pose={{ l: 8, r: spit ? -60 : -135 }} hand={<g transform="rotate(180)"><Glass fill={0.6} /></g>} />
            {spit &&
              Array.from({ length: 14 }).map((_, i) => {
                const t = f - at("S01", "تنشرب");
                const a = -0.3 + (random(`sp${i}`) - 0.5) * 0.9;
                return <circle key={i} cx={560 + Math.cos(a) * t * 9} cy={1150 + Math.sin(a) * t * 9 + t * t * 0.4} r={9} fill={C.water} opacity={Math.max(0, 1 - t / 22)} />;
              })}
            {spit && (
              <text x={600} y={1000} {...txt} fontSize={110} fill="#fff" stroke="#2A1C10" strokeWidth={8} paintOrder="stroke" opacity={1 - ease(f, at("S01", "تنشرب") + 20, at("S01", "تنشرب") + 30)}>
                بفف!
              </text>
            )}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S01", "فيها"),
    C: ({ l }) => {
      const f = at("S01", "فيها") + l;
      const z = ease(l, 0, 12);
      return (
        <AbsoluteFill style={{ background: "#0F3550" }}>
          <World>
            <circle cx={540} cy={1000} r={430 * z} fill={C.water} />
            {Array.from({ length: 18 }).map((_, i) => {
              const a = random(`a${i}`) * Math.PI * 2;
              const r = random(`r${i}`) * 330 * z;
              const x = 540 + Math.cos(a) * r + Math.sin((f + i * 9) / 10) * 10;
              const y = 1000 + Math.sin(a) * r + Math.cos((f + i * 7) / 11) * 10;
              return <rect key={i} x={x - 22} y={y - 22} width={44} height={44} fill="#fff" stroke="#C9D2DB" strokeWidth={4} transform={`rotate(${f * 2 + i * 20} ${x} ${y})`} opacity={z} />;
            })}
            <circle cx={540} cy={1000} r={430 * z} fill="none" stroke="#fff" strokeWidth={10} opacity={0.6} />
            <text x={540} y={1560} textAnchor="middle" {...txt} fontSize={110} fill="#fff" opacity={ease(f, at("S01", "ملح") - 2, at("S01", "ملح") + 8)}>
              ملح
            </text>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("S02", "فغليتها"),
    C: ({ l, d }) => {
      const f = at("S02", "فغليتها") + l;
      return (
        <Cam l={l} d={d} a={[540, 1000, 0.95]} b={[540, 1250, 1.35]}>
          <World>
            <Beach l={l} f={f} />
            <Pot x={560} y={1380} s={1} f={f} boil={ease(l, 6, 24)} />
            <Man x={240} y={1560} s={1} f={f} pose="carry" hand={<rect x={-60} y={-14} width={120} height={28} rx={12} fill="#6B4423" />} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S02", "وغطّيت"),
    C: ({ l, d }) => {
      const f = at("S02", "وغطّيت") + l;
      const lid = ease(f, at("S02", "بصحن") - 8, at("S02", "بصحن") + 6);
      const drip = ease(f, at("S02", "برد") - 4, at("S02", "رجع"));
      const cup = ease(f, at("S02", "رجع"), at("S02", "تقطير"));
      return (
        <Cam l={l} d={d} a={[560, 1150, 1.7]} b={[700, 1250, 1.35]} rot={[-2, 2]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#F0D49A" />
            <Pot x={540} y={1300} s={1} f={f} lid={lid} />
            {Array.from({ length: 6 }).map((_, i) => {
              const t = ((f + i * 8) % 36) / 36;
              return <circle key={i} cx={440 + i * 40} cy={1240 - t * (40 + 60 * (1 - lid))} r={14 + t * 10} fill="#fff" opacity={(1 - t) * 0.7} />;
            })}
            {drip > 0 &&
              Array.from({ length: 4 }).map((_, i) => {
                const t = ((f + i * 10) % 40) / 40;
                return <path key={i} d="M0 -12 C8 0 9 6 0 10 C-9 6 -8 0 0 -12 Z" fill={C.fresh} transform={`translate(${720 + t * 30} ${1110 + t * 220})`} opacity={drip} />;
              })}
            <g transform="translate(780 1400)">
              <Glass fill={0.1 + 0.6 * cup} color={C.fresh} />
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S03", "بس"),
    C: ({ l, d }) => {
      const f = at("S03", "بس") + l;
      return (
        <Cam l={l} d={d} a={[540, 1100, 0.9]} b={[800, 1430, 2.4]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#F0D49A" />
            <Pot x={440} y={1300} s={1.6} f={f} lid={1} />
            <g transform="translate(800 1460) scale(0.6)">
              <Glass fill={0.5} color={C.fresh} />
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S03", "والحطب"),
    C: ({ l, d }) => {
      const f = at("S03", "والحطب") + l;
      const out = ease(f, at("S03", "خلص") - 6, at("S03", "خلص") + 10);
      return (
        <Cam l={l} d={d} a={[540, 1200, 1.4]} b={[520, 1150, 1.1]}>
          <World>
            <Beach l={l} f={f} />
            <Pot x={560} y={1380} s={1} f={f} lid={1} boil={1 - out} fire={1 - out} />
            {out > 0.5 &&
              [0, 1, 2].map((i) => {
                const t = ((f + i * 12) % 40) / 40;
                return <circle key={i} cx={560 + Math.sin(t * 6 + i) * 30} cy={1500 - t * 260} r={26 + t * 30} fill="#9AA3AD" opacity={(1 - t) * 0.7} />;
              })}
            <Man x={240} y={1560} s={1} f={f} pose={{ l: 60, r: -60, head: 8 }} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S04", "فخلّيت"),
    C: ({ l, d }) => {
      const f = at("S04", "فخلّيت") + l;
      return (
        <Cam l={l} d={d} a={[540, 900, 2.2]} b={[540, 1000, 1.0]}>
          <World>
            <SkyRect h={1600} top="#3D9BE0" bottom="#BFE6F7" />
            <Sun x={540} y={900} r={130} f={f * 2} />
            <Dunes y={1500} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S04", "حوض"),
    C: ({ l, d }) => {
      const f = at("S04", "حوض") + l;
      const cover = ease(f, at("S04", "غطا") - 4, at("S04", "مايل") + 8);
      return (
        <Cam l={l} d={d} a={[540, 1300, 1.4]} b={[540, 1150, 1.0]} rot={[2, -1]}>
          <World>
            <SkyRect h={1150} top="#5DB7EE" bottom="#F6E2B5" />
            <Sun x={860} y={420} r={80} f={f} />
            <Dunes y={1080} />
            <Still f={f} cover={cover} vapor={0} drip={0} />
            <Man x={980} y={1500} s={0.9} f={f} pose="point" flip />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S04", "الشمس", 1),
    C: ({ l, d }) => {
      const f = at("S04", "الشمس", 1) + l;
      const drip = ease(f, at("S04", "والقطرات") - 4, at("S04", "تنزل"));
      const jug = ease(f, at("S04", "مجرى"), at("S04", "شمسي"));
      return (
        <Cam l={l} d={d} a={[700, 1100, 1.6]} b={[300, 1180, 1.5]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#F6E2B5" />
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1={900 - i * 60} y1={300} x2={760 - i * 120} y2={1000} stroke="#FFD54F" strokeWidth={10} opacity={0.5} />
            ))}
            <Still f={f} cover={1} vapor={1} drip={drip} />
            <rect x={120} y={1180} width={80} height={180} rx={10} fill="rgba(200,235,255,0.6)" stroke="#9CC7E0" strokeWidth={5} />
            <rect x={126} y={1360 - 160 * jug} width={68} height={160 * jug} fill={C.fresh} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S05", "بس"),
    C: ({ l, d }) => {
      const f = at("S05", "بس") + l;
      const reveal = ease(f, at("S05", "ما") - 6, at("S05", "قرية") + 10);
      return (
        <Cam l={l} d={d} a={[460, 1250, 1.7]} b={[700, 1150, 0.75]} w={1400}>
          <World w={1400}>
            <SkyRect w={1400} h={1150} top="#5DB7EE" bottom="#F6E2B5" />
            <Dunes y={1080} w={1400} />
            <g transform="translate(-60 0) scale(0.6) translate(0 760)">
              <Still f={f} cover={1} vapor={1} drip={1} />
            </g>
            <Man x={460} y={1500} s={0.9} f={f} pose="pour" hand={<g transform="rotate(180)"><Glass fill={0.4} color={C.fresh} /></g>} />
            <g opacity={reveal}>
              {[0, 1, 2].map((i) => (
                <MudHouse key={i} x={900 + i * 220} y={1250} s={0.45} tone={i} />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <Man key={`p${i}`} x={760 + i * 90} y={1480 + (i % 2) * 40} s={0.5} f={f + i * 6} pose={{ l: 30, r: -30 }} flip hand={<rect x={-16} y={0} width={32} height={46} rx={10} fill="#C98D52" />} />
              ))}
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S06", "فبنيت"),
    C: ({ l, d }) => {
      const f = at("S06", "فبنيت") + l;
      return (
        <Cam l={l} d={d} a={[700, 1000, 0.8]} b={[640, 1200, 1.1]} w={1400}>
          <World w={1400}>
            <SkyRect w={1400} h={1200} top="#6CC0EF" bottom="#E9F4F9" />
            <Clouds f={l} y={260} w={1400} n={5} />
            <Sea y={1040} f={l} w={1400} />
            <path d="M-300 1200 C300 1160 900 1220 1700 1180 L1700 2600 L-300 2600 Z" fill="#E9C27E" />
            <Factory x={420} y={1290} s={0.9} f={f} grow={ease(f, at("S06", "محطة") - 4, at("S06", "كهربا") + 10)} smoke label="محطة كهربا" />
            <Factory x={1000} y={1290} s={0.9} f={f} grow={ease(f, at("S06", "مصنع") - 4, at("S06", "جنب") + 10)} tone={1} label="مصنع تحلية" />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S06", "وحرارتها"),
    C: ({ l, d }) => {
      const f = at("S06", "وحرارتها") + l;
      const pipe = ease(f, at("S06", "صارت") - 6, at("S06", "تغلي"));
      return (
        <Cam l={l} d={d} a={[380, 900, 1.3]} b={[760, 1050, 1.0]} w={1400}>
          <World w={1400}>
            <rect x={-300} y={-300} width={2000} height={2500} fill="#E3EAF0" />
            <Factory x={420} y={1290} s={0.9} f={f} smoke />
            {/* waste heat to the sky, then into the pipe */}
            {pipe < 1 &&
              Array.from({ length: 5 }).map((_, i) => {
                const t = ((f + i * 9) % 45) / 45;
                return <path key={i} d={`M${340 + i * 30} ${700 - t * 400} q16 -20 0 -40 q-16 -20 0 -40`} stroke={C.red} strokeWidth={10} fill="none" strokeLinecap="round" opacity={(1 - t) * (1 - pipe)} />;
              })}
            <path d={`M560 1100 L${560 + 360 * pipe} 1100`} stroke={C.red} strokeWidth={40} strokeLinecap="round" />
            <g transform="translate(1000 1290)">
              {[-180, 0, 180].map((x, i) => (
                <g key={x}>
                  <rect x={x - 80} y={-420} width={160} height={400} rx={30} fill="#D9E2EA" stroke={C.steelDark} strokeWidth={8} />
                  <rect x={x - 66} y={-200} width={132} height={160} fill={C.sea} opacity={0.85} />
                  {pipe > 0.9 &&
                    Array.from({ length: 5 }).map((__, k) => {
                      const t = ((f + k * 7 + i * 5) % 28) / 28;
                      return <circle key={k} cx={x - 50 + k * 25} cy={-200 - t * 120} r={8 + t * 6} fill="#fff" opacity={1 - t} />;
                    })}
                </g>
              ))}
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S07", "بس"),
    C: ({ l, d }) => {
      const f = at("S07", "بس") + l;
      const v = interpolate(f, [at("S07", "بس"), at("S07", "كثير")], [0.2, 1], clamp) + Math.sin(f / 2) * 0.03;
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.5]} b={[540, 1050, 1.1]} rot={[3, -2]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#2E363E" />
            <Gauge x={540} y={900} v={Math.min(1, v)} label="طاقة" />
            {Array.from({ length: 6 }).map((_, i) => (
              <path key={i} d={`M${260 + i * 110} 1500 q30 -140 0 -210 q90 80 50 210 Z`} fill={i % 2 ? "#FFC23B" : C.orange} transform={`translate(0 ${Math.sin((f + i * 5) / 3) * 12})`} />
            ))}
            <text x={540} y={1260} textAnchor="middle" {...txt} fontSize={120} fill={C.red}>
              ↑↑↑
            </text>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S08", "فجت"),
    C: ({ l }) => {
      const f = at("S08", "فجت") + l;
      const b = pop(f, at("S08", "فكرة") - 2, 30, 220, 9);
      return (
        <AbsoluteFill style={{ background: "#1C2333" }}>
          <World>
            <g transform={`translate(540 960) scale(${b})`}>
              <circle r={320} fill="rgba(255,214,90,0.25)" />
              <circle r={190} fill="#FFE07A" />
              <rect x={-80} y={170} width={160} height={110} rx={20} fill="#9AA7B3" />
              {Array.from({ length: 12 }).map((_, i) => (
                <rect key={i} x={-8} y={-360} width={16} height={70} rx={8} fill="#FFE07A" transform={`rotate(${i * 30 + f})`} />
              ))}
            </g>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("S08", "بدل"),
    C: ({ l, d }) => {
      const f = at("S08", "بدل") + l;
      const push = ease(f, at("S08", "تدفّها") - 4, at("S08", "قوي") + 6);
      return (
        <Cam l={l} d={d} a={[300, 1100, 1.3]} b={[640, 1050, 1.0]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#DDE6EE" />
            <rect x={60} y={900} width={960} height={360} rx={30} fill="#BFC9D3" stroke={C.steelDark} strokeWidth={10} />
            <rect x={80} y={920} width={500} height={320} fill={C.sea} />
            <rect x={640} y={920} width={360} height={320} fill={C.fresh} opacity={0.3 + 0.6 * push} />
            {/* membrane */}
            <rect x={590} y={900} width={40} height={360} fill="#F4F4F4" />
            {Array.from({ length: 12 }).map((_, i) => (
              <circle key={i} cx={610} cy={920 + i * 28} r={5} fill="#9AA7B3" />
            ))}
            {/* piston */}
            <rect x={80 + 160 * push - 40} y={920} width={40} height={320} fill={C.steelDark} />
            <rect x={-260} y={1060} width={300 + 160 * push} height={40} fill={C.steel} />
            <Gauge x={330} y={720} v={0.15 + 0.8 * push} label="ضغط" />
            {push > 0.5 && <Wind f={f} n={5} w={12} color={C.fresh} pts={[[640, 1080], [1000, 1080]]} />}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S08", "غشا"),
    C: ({ l }) => {
      const f = at("S08", "غشا") + l;
      const back = ease(f, at("S08", "والملح") - 4, at("S08", "للبحر") + 6);
      return (
        <AbsoluteFill style={{ background: "#0F3550" }}>
          <World>
            <rect x={0} y={0} width={1080} height={1920} fill="#123D5C" />
            <rect x={520} y={300} width={60} height={1400} fill="#E9EEF2" />
            {Array.from({ length: 20 }).map((_, i) => (
              <rect key={i} x={520} y={330 + i * 68} width={60} height={14} fill="#123D5C" />
            ))}
            {/* water molecules pass */}
            {Array.from({ length: 26 }).map((_, i) => {
              const t = ((f + i * 5) % 60) / 60;
              const row = i % 20;
              const y = 337 + row * 68;
              const x = lerp(120, 980, t);
              return <circle key={i} cx={x} cy={y + Math.sin((f + i * 9) / 8) * (x < 520 || x > 580 ? 30 : 0)} r={14} fill={C.fresh} />;
            })}
            {/* salt bounces back */}
            {Array.from({ length: 12 }).map((_, i) => {
              const t = ((f + i * 9) % 50) / 50;
              const ph = t < 0.5 ? t * 2 : 2 - t * 2;
              const x = lerp(100, 490, ph) - back * ((f * 6 + i * 40) % 500);
              const y = 400 + (i % 12) * 105;
              return <rect key={i} x={x - 22} y={y - 22} width={44} height={44} fill="#fff" stroke="#C9D2DB" strokeWidth={4} transform={`rotate(${f * 3 + i * 20} ${x} ${y})`} />;
            })}
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("S09", "بس"),
    C: ({ l, d }) => {
      const f = at("S09", "بس") + l;
      return (
        <Cam l={l} d={d} a={[300, 1100, 1.2]} b={[2300, 1100, 1.2]} w={2700}>
          <World w={2700}>
            <SkyRect w={2700} h={1100} top="#6CC0EF" bottom="#F6E2B5" />
            <Clouds f={l} y={300} w={2700} n={8} />
            <Sea y={1180} f={l} w={600} />
            <Dunes y={1040} w={2700} />
            <rect x={-300} y={1180} width={600} height={1000} fill={C.sea} />
            <Factory x={380} y={1280} s={0.55} f={f} tone={1} />
            <City x={2350} y={1300} s={0.8} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S10", "فمدّيت"),
    C: ({ l, d }) => {
      const f = at("S10", "فمدّيت") + l;
      const p = ease(f, at("S10", "فمدّيت"), at("S10", "كيلو") + 10);
      return (
        <Cam l={l} d={d} a={[540, 900, 0.95]} b={[540, 960, 1.08]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#E9C27E" />
            {Array.from({ length: 30 }).map((_, i) => (
              <path key={i} d={`M${random(`dx${i}`) * 1080} ${random(`dy${i}`) * 1920} q40 -14 80 0`} stroke="#D6A866" strokeWidth={8} fill="none" />
            ))}
            <rect x={-300} y={1500} width={1700} height={900} fill={C.sea} />
            <Factory x={540} y={1560} s={0.35} f={f} tone={1} />
            <path d={`M540 1500 C 500 ${1500 - 400} 640 ${1500 - 700} 560 ${1500 - 1100 * p}`} stroke="#5C6670" strokeWidth={28} fill="none" strokeLinecap="round" />
            <path d={`M540 1500 C 500 ${1500 - 400} 640 ${1500 - 700} 560 ${1500 - 1100 * p}`} stroke={C.water} strokeWidth={10} fill="none" strokeDasharray="20 30" strokeDashoffset={-f * 4} />
            <g opacity={ease(f, at("S10", "كيلو") - 6, at("S10", "كيلو") + 10)}>
              <City x={560} y={420} s={0.35} />
            </g>
            <g transform={`translate(780 900) scale(${pop(f, at("S10", "أربعمية"), 30, 240, 11)})`}>
              <rect x={-170} y={-60} width={340} height={110} rx={55} fill="#2A1C10" />
              <text x={0} y={22} textAnchor="middle" {...txt} fontSize={60} fill="#fff">
                {`+${ar(400)} كم`}
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S10", "ومضخات"),
    C: ({ l, d }) => {
      const f = at("S10", "ومضخات") + l;
      return (
        <Cam l={l} d={d} a={[300, 1080, 1.5]} b={[700, 1080, 1.1]}>
          <World>
            <SkyRect h={1200} top="#6CC0EF" bottom="#F6E2B5" />
            <Dunes y={1120} />
            <rect x={-300} y={1250} width={1700} height={90} rx={45} fill="#7F8B97" stroke={C.steelDark} strokeWidth={8} />
            <rect x={-300} y={1270} width={1700} height={50} fill={C.fresh} opacity={0.7} />
            <Wind f={f} n={8} w={10} color="#fff" pts={[[-200, 1295], [1300, 1295]]} />
            <g transform="translate(560 1200)">
              <rect x={-150} y={-220} width={300} height={260} rx={20} fill="#D9E2EA" stroke={C.steelDark} strokeWidth={8} />
              <g transform={`translate(0 -90) rotate(${f * 16})`}>
                <circle r={70} fill="#3B434B" />
                {[0, 1, 2, 3].map((i) => (
                  <ellipse key={i} rx={14} ry={60} fill="#9AA7B3" transform={`rotate(${i * 45})`} />
                ))}
              </g>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S11", "ومبروك"),
    C: ({ l, d }) => {
      const f = at("S11", "ومبروك") + l;
      const tap = ease(f, at("S11", "ومبروك"), at("S11", "شربت"));
      return (
        <Cam l={l} d={d} a={[540, 900, 0.85]} b={[560, 1150, 1.4]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#EEF3F7" />
            <rect x={-300} y={-300} width={1700} height={700} fill="#B9DDF3" />
            <City x={540} y={400} s={0.9} />
            <rect x={-300} y={1300} width={1700} height={900} fill="#C9D3D9" />
            <rect x={600} y={1100} width={300} height={40} rx={10} fill="#9AA7B3" />
            <path d="M760 1100 L760 980 Q760 940 720 940 L660 940" stroke="#9AA7B3" strokeWidth={30} fill="none" strokeLinecap="round" />
            <rect x={640} y={940} width={40} height={60} rx={8} fill="#9AA7B3" />
            {tap > 0.1 && <rect x={652} y={1000} width={16} height={180 * tap} rx={8} fill={C.fresh} />}
            <Man x={380} y={1320} s={1.1} f={f} pose={f >= at("S11", "شربت") ? { l: 8, r: -150 } : "point"} hand={f >= at("S11", "شربت") ? <g transform="rotate(180)"><Glass fill={0.7} color={C.fresh} /></g> : undefined} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("S12", "والمفاجأة"),
    C: ({ l, d }) => {
      const t = ease(l, 0, Math.min(d, 75));
      const z = interpolate(t, [0, 1], [1, 0.06]);
      const E = 6000;
      return (
        <AbsoluteFill style={{ background: "#071026" }}>
          <World>
            {Array.from({ length: 40 }).map((_, i) => (
              <circle key={i} cx={random(`st${i}`) * 1080} cy={random(`sy${i}`) * 1920} r={2 + random(`sr${i}`) * 3} fill="#fff" opacity={0.8} />
            ))}
            <g transform={`translate(540 ${1000 - ((1 - z) / 0.94) * 406}) scale(${z}) translate(-540 -1000)`}>
              <circle cx={540} cy={1100 + E} r={E * 1.04} fill="rgba(120,200,255,0.25)" />
              <clipPath id="earthClipSea">
                <circle cx={540} cy={1100 + E} r={E} />
              </clipPath>
              <circle cx={540} cy={1100 + E} r={E} fill="#2E7FC4" />
              <g clipPath="url(#earthClipSea)">
                <ellipse cx={540} cy={1100 + E * 0.3} rx={E * 0.55} ry={E * 0.42} fill="#E9C27E" />
                <ellipse cx={540 + E * 0.55} cy={1100 + E * 0.95} rx={E * 0.3} ry={E * 0.2} fill="#6DBE5A" />
              </g>
              <City x={540} y={1100} s={0.9} />
            </g>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("S12", "ويمكن"),
    C: ({ l, d }) => {
      const f = at("S12", "ويمكن") + l;
      const sea = ease(f, at("S12", "كانت") - 4, at("S12", "بحر") + 10);
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.0]} b={[540, 1000, 1.0 + 2.6 * sea]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#EEF3F7" />
            <g transform="translate(540 1000) scale(6)">
              <Glass fill={0.75} color={C.water} />
            </g>
            <g opacity={sea}>
              {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 5 }).map((__, i) => {
                  const x = 300 + ((i * 120 + f * (1 + r * 0.3)) % 500);
                  return <path key={`${r}${i}`} d={`M${x} ${900 + r * 60} q20 -12 40 0 q20 12 40 0`} stroke="rgba(255,255,255,0.8)" strokeWidth={6} fill="none" />;
                }),
              )}
              <g transform={`translate(${520 + Math.sin(f / 10) * 60} 1060) scale(0.35)`}>
                <path d="M-110 0 C-60 -50 70 -50 110 0 C70 50 -60 50 -110 0 Z" fill="#F2A65A" />
                <path d="M106 0 L160 -40 L150 0 L160 40 Z" fill="#E07A3A" />
              </g>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: start("S13"),
    C: ({ l }) => <FollowCard l={l} tFollow={at("S13", "تابعنا") - start("S13")} />,
  },
];

export const FollowCard: React.FC<{ l: number; tFollow: number }> = ({ l, tFollow }) => {
  const logo = pop(l, 2, 30, 160, 12);
  const btn = pop(l, tFollow - 2, 30, 240, 11);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(80% 60% at 50% 45%, #163E5C 0%, #071026 100%)" }}>
      {Array.from({ length: 26 }).map((_, i) => {
        const a = random(`c${i}`) * Math.PI * 2;
        const v = 6 + random(`v${i}`) * 12;
        const d = v * l * Math.exp(-l / 36);
        const c = ["#FFD23F", "#fff", "#5FB6E6", "#2BB673"][i % 4];
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * d - 6, top: 900 + Math.sin(a) * d - 6 + l * 1.2, width: 12, height: 12, borderRadius: 3, background: c, rotate: `${l * 9 + i * 40}deg`, opacity: interpolate(l, [0, 40, 70], [1, 1, 0], clamp) }} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        <div style={{ width: 440, height: 440, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", scale: String(logo), boxShadow: "0 30px 80px rgba(0,0,0,0.45)" }}>
          <Img src={staticFile("brand/logo-color.png")} style={{ width: 370 }} />
        </div>
        <div dir="rtl" style={{ padding: "14px 70px 26px", borderRadius: 60, background: "#FE2C55", color: "#fff", ...txt, fontSize: 70, scale: String(btn * (1 + 0.04 * Math.sin(l / 5))), opacity: Math.min(1, btn * 1.4), boxShadow: "0 18px 50px rgba(254,44,85,0.5)" }}>
          + تابعنا
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ cover (frame 0)
const Cover: React.FC = () => (
  <AbsoluteFill>
    <Cam l={0} d={1} a={[700, 1100, 0.95]} b={[700, 1100, 0.95]} w={1400}>
      <World w={1400}>
        <SkyRect w={1400} h={1200} top="#6CC0EF" bottom="#E9F4F9" />
        <Clouds f={0} y={260} w={1400} n={5} />
        <Sea y={1040} f={0} w={1400} />
        <path d="M-300 1200 C300 1160 900 1220 1700 1180 L1700 2600 L-300 2600 Z" fill="#E9C27E" />
        <Factory x={420} y={1290} s={0.9} f={0} smoke />
        <Factory x={1000} y={1290} s={0.9} f={0} tone={1} />
        <Man x={700} y={1700} s={1.3} f={0} pose={{ l: 8, r: -150 }} hand={<g transform="rotate(180)"><Glass fill={0.7} color={C.fresh} /></g>} />
      </World>
    </Cam>
    <div dir="rtl" style={{ position: "absolute", top: 220, left: 40, right: 40, textAlign: "center", ...txt }}>
      <div style={{ fontSize: 130, color: "#fff", WebkitTextStroke: "6px rgba(0,0,0,0.85)", paintOrder: "stroke fill", lineHeight: 1.15 }}>من موية البحر</div>
      <div style={{ display: "inline-block", marginTop: 16, padding: "6px 36px 18px", borderRadius: 24, background: "#1F7FC4", color: "#fff", fontSize: 80 }}>لحنفيتك!</div>
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ main
export const SeaStory: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  const probs = [at("S03", "بس"), at("S05", "بس"), at("S07", "بس"), at("S09", "بس")];
  const shake = probs.reduce((k, p) => Math.max(k, interpolate(f, [p - 1, p + 2, p + 14], [0, 1, 0], clamp)), 0);
  const end = start("S13");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ translate: `${Math.sin(f * 2.7) * 12 * shake}px ${Math.cos(f * 3.1) * 9 * shake}px` }}>
        <ShotPlayer f={f} shots={shots} total={T} />
      </AbsoluteFill>
      {shake > 0.02 && <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% 50%, transparent 50%, rgba(220,20,40,${0.45 * shake}) 100%)` }} />}
      <NameChip text="هذا تقطير" at={at("S02", "تقطير")} until={start("S03")} top={1600} color="#1F7FC4" />
      <NameChip text="مقطّر شمسي" at={at("S04", "مقطّر")} until={start("S05")} top={1600} color="#E08A1E" />
      <NameChip text="التناضح العكسي" at={at("S08", "التناضح")} until={start("S09")} top={1600} color="#1F7FC4" />
      {f < end && <Captions timeline={seaTimeline} top={230} />}

      <Voices timeline={seaTimeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={seaTimeline} src="audio/sea/music/calm.mp3" />
      {shots.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} name="swish" at={s.at - 2} gain={0.7} />
      ))}
      {probs.map((p, i) => (
        <Sfx key={`g${i}`} name="glitch" at={p - 1} />
      ))}
      <Sfx name="pop" at={at("S01", "تنشرب")} />
      <Sfx name="check" at={at("S02", "تقطير")} />
      <Sfx name="check" at={at("S04", "مقطّر")} />
      <Sfx name="ding" at={at("S08", "فكرة")} />
      <Sfx name="check" at={at("S08", "التناضح")} />
      <Sfx name="impact" at={at("S10", "أربعمية")} />
      <Sfx name="sparkle" at={at("S11", "شربت")} />
      <Sfx name="riser" at={at("S12", "والمفاجأة") - 6} />
      <Sfx name="pop" at={at("S13", "تابعنا")} />
    </AbsoluteFill>
  );
};

export const SeaStoryThumb: React.FC = () => <Cover />;
