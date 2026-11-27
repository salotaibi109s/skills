import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import data from "../data/hejaz-timeline.json";
import type { TimelineData } from "../lib/timing";
import { Calendar, Cam, Clouds, Dunes, Man, ShotPlayer, type ShotDef, SkyRect, Sun, World } from "./art";
import { ar, Captions, clamp, ease, makeStory, MusicBed, NameChip, pop, SANS, Voices } from "./kit";
import { FollowCard } from "./SeaStory";

/** «سكة حديد الحجاز» — true story with a twist, voice: Fahad. */
export const hejazTimeline = data as TimelineData;
const { Sfx, SceneVoice, at, start } = makeStory(hejazTimeline, "audio/hejaz");
const T = hejazTimeline.durationInFrames;
const txt = { fontFamily: SANS, fontWeight: 700 } as const;
const K = { stone: "#D8C3A0", stoneDark: "#A88B62", iron: "#2B2F36", rust: "#8B4A2B", rustDark: "#5E2F1A", red: "#E0313F", rail: "#5A5F66", sleeper: "#6B4423" };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ------------------------------------------------------------ props
const Camel: React.FC<{ x: number; y: number; s?: number; f: number; walk?: boolean; flip?: boolean; rider?: boolean }> = ({ x, y, s = 1, f, walk = true, flip, rider }) => {
  const k = walk ? f / 5 : 0;
  const leg = (ph: number) => Math.sin(k + ph) * 16;
  const bob = walk ? Math.abs(Math.sin(k)) * 6 : 0;
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={bob + 6} rx={150} ry={16} fill="rgba(0,0,0,0.15)" />
      {[
        [-90, 0],
        [-60, Math.PI],
        [70, Math.PI],
        [100, 0],
      ].map(([lx, ph], i) => (
        <g key={i} transform={`translate(${lx} -160) rotate(${leg(ph)})`}>
          <rect x={-11} y={0} width={22} height={160} rx={10} fill={i % 2 ? "#B98A55" : "#C99A62"} />
          <ellipse cx={0} cy={160} rx={18} ry={8} fill="#8A6438" />
        </g>
      ))}
      <ellipse cx={0} cy={-200} rx={140} ry={70} fill="#D4A56A" />
      <path d="M-70 -250 Q-20 -360 40 -250 Z" fill="#D4A56A" />
      <path d="M110 -220 Q170 -260 170 -360 L200 -370 Q190 -250 140 -190 Z" fill="#D4A56A" />
      <ellipse cx={205} cy={-370} rx={42} ry={24} fill="#D4A56A" />
      <circle cx={214} cy={-378} r={5} fill="#2B1B12" />
      <path d="M-140 -210 q-30 30 -20 70" stroke="#B98A55" strokeWidth={10} fill="none" />
      {rider && (
        <>
          <rect x={-90} y={-290} width={140} height={50} rx={14} fill="#B5473A" />
          {Array.from({ length: 5 }).map((_, i) => (
            <rect key={i} x={-86 + i * 28} y={-262} width={12} height={22} fill="#F2C14E" />
          ))}
        </>
      )}
    </g>
  );
};

const Rails: React.FC<{ x0: number; x1: number; y: number; laid?: number; broken?: number; f?: number }> = ({ x0, x1, y, laid = 1, broken = 0, f = 0 }) => {
  const xe = lerp(x0, x1, laid);
  const n = Math.floor((xe - x0) / 46);
  return (
    <g>
      {Array.from({ length: Math.max(0, n) }).map((_, i) => (
        <rect key={i} x={x0 + i * 46} y={y - 6} width={26} height={40} fill={K.sleeper} />
      ))}
      {[0, 22].map((dy) => {
        if (broken <= 0) return <rect key={dy} x={x0} y={y + dy} width={xe - x0} height={8} fill={K.rail} />;
        const mid = (x0 + x1) / 2;
        return (
          <g key={dy}>
            <rect x={x0} y={y + dy} width={mid - 80 - x0} height={8} fill={K.rail} />
            <rect x={mid + 80} y={y + dy} width={x1 - mid - 80} height={8} fill={K.rail} />
            <rect x={mid - 80} y={y + dy} width={160} height={8} fill={K.rail} transform={`rotate(${-50 * broken + Math.sin(f / 3) * 0} ${mid - 80} ${y + dy}) translate(0 ${-180 * broken})`} />
          </g>
        );
      })}
    </g>
  );
};

const Train: React.FC<{ x: number; y: number; s?: number; f: number; moving?: boolean; rust?: number; cars?: number; steam?: number }> = ({ x, y, s = 1, f, moving = true, rust = 0, cars = 2, steam = 1 }) => {
  const body = rust > 0.5 ? K.rust : K.iron;
  const trim = rust > 0.5 ? K.rustDark : "#B8862B";
  const rot = moving ? f * 9 : 0;
  const wheel = (cx: number, r: number) => (
    <g transform={`translate(${cx} 0) rotate(${rot})`}>
      <circle r={r} fill={rust > 0.5 ? "#6E3A22" : "#7A1F1F"} stroke={body} strokeWidth={8} />
      {[0, 45, 90, 135].map((a) => (
        <rect key={a} x={-3} y={-r} width={6} height={2 * r} fill={body} transform={`rotate(${a})`} />
      ))}
      <circle r={10} fill={body} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* cars behind */}
      {Array.from({ length: cars }).map((_, i) => (
        <g key={i} transform={`translate(${-560 - i * 380} 0)`}>
          <rect x={-170} y={-200} width={340} height={150} rx={10} fill={rust > 0.5 ? "#7A5A3A" : "#2F6B4A"} stroke={trim} strokeWidth={6} />
          {[0, 1, 2].map((w) => (
            <rect key={w} x={-140 + w * 100} y={-175} width={70} height={60} rx={6} fill={rust > 0.5 ? "#3B2A1C" : "#F4E3B5"} />
          ))}
          <g transform="translate(0 -30)">
            {wheel(-110, 32)}
            {wheel(110, 32)}
          </g>
        </g>
      ))}
      {/* tender */}
      <g transform="translate(-300 0)">
        <rect x={-120} y={-190} width={240} height={140} rx={10} fill={body} stroke={trim} strokeWidth={6} />
        <g transform="translate(0 -30)">
          {wheel(-70, 30)}
          {wheel(70, 30)}
        </g>
      </g>
      {/* engine */}
      <rect x={-160} y={-330} width={150} height={240} rx={12} fill={body} stroke={trim} strokeWidth={6} />
      <rect x={-140} y={-300} width={100} height={80} rx={8} fill={rust > 0.5 ? "#3B2A1C" : "#F4E3B5"} />
      <rect x={-190} y={-350} width={210} height={30} rx={10} fill={trim} />
      <rect x={-20} y={-250} width={300} height={150} rx={70} fill={body} stroke={trim} strokeWidth={6} />
      <rect x={180} y={-350} width={50} height={110} fill={body} />
      <rect x={170} y={-370} width={70} height={24} rx={6} fill={trim} />
      <circle cx={90} cy={-262} r={24} fill={trim} />
      <path d="M280 -100 L340 -40 L280 -40 Z" fill={trim} />
      <g transform="translate(0 -40)">
        {wheel(10, 48)}
        {wheel(130, 48)}
        {wheel(250, 40)}
      </g>
      {steam > 0 &&
        Array.from({ length: 7 }).map((_, i) => {
          const t = ((f + i * 6) % 42) / 42;
          return <circle key={i} cx={205 - t * (moving ? 380 : 40)} cy={-380 - t * 260} r={30 + t * 60} fill="#F2F2F2" opacity={(1 - t) * 0.85 * steam} />;
        })}
      {rust > 0.5 &&
        Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={-140 + random(`h${i}`) * 400} cy={-300 + random(`hy${i}`) * 200} r={8 + random(`hr${i}`) * 10} fill={K.rustDark} />)}
    </g>
  );
};

/** Fortified stone station. */
const Station: React.FC<{ x: number; y: number; s?: number; museum?: boolean; guard?: boolean; f?: number }> = ({ x, y, s = 1, museum, guard, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-320} y={-360} width={640} height={360} fill={K.stone} stroke={K.stoneDark} strokeWidth={10} />
    {Array.from({ length: 6 }).map((_, r) => (
      <line key={r} x1={-320} x2={320} y1={-60 * r} y2={-60 * r} stroke={K.stoneDark} strokeWidth={3} opacity={0.5} />
    ))}
    {[-220, -80, 80, 220].map((ax) => (
      <path key={ax} d={`M${ax - 45} 0 L${ax - 45} -150 Q${ax} -210 ${ax + 45} -150 L${ax + 45} 0 Z`} fill="#4A3524" />
    ))}
    {[-220, -80, 80, 220].map((wx) => (
      <rect key={`w${wx}`} x={wx - 16} y={-300} width={32} height={60} rx={16} fill="#3B2A1C" />
    ))}
    <rect x={-340} y={-390} width={680} height={36} fill={K.stoneDark} />
    {Array.from({ length: 14 }).map((_, i) => (
      <rect key={i} x={-330 + i * 48} y={-420} width={26} height={30} fill={K.stoneDark} />
    ))}
    {guard && <Man x={200} y={-390} s={0.45} f={f} pose="stand" thobe="#E9DCC0" />}
    {museum && (
      <g transform="translate(0 -470)">
        <rect x={-150} y={-46} width={300} height={92} rx={18} fill="#1F7F5A" />
        <text x={0} y={22} textAnchor="middle" {...txt} fontSize={62} fill="#fff">
          متحف
        </text>
      </g>
    )}
  </g>
);

const Palm: React.FC<{ x: number; y: number; s?: number; f?: number }> = ({ x, y, s = 1, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 0 Q-20 -200 10 -380 L30 -380 Q0 -200 14 0 Z" fill="#8A6438" />
    {Array.from({ length: 7 }).map((_, i) => (
      <path key={i} d="M20 -380 q90 -40 170 30 q-90 -10 -170 -10 Z" fill="#4E9A3A" transform={`rotate(${i * 52 + Math.sin(f / 20 + i) * 4} 20 -380)`} />
    ))}
  </g>
);

const Boom: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) =>
  t <= 0 || t > 40 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={40 + t * 9} fill="#FFC23B" opacity={Math.max(0, 1 - t / 14)} />
      <circle r={20 + t * 6} fill="#FF7A2A" opacity={Math.max(0, 1 - t / 18)} />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = random(`bm${i}`) * Math.PI * 2;
        const v = 8 + random(`bv${i}`) * 10;
        return <rect key={i} x={Math.cos(a) * v * t} y={Math.sin(a) * v * t + 0.5 * t * t} width={20} height={14} fill={K.stoneDark} transform={`rotate(${t * 20 + i * 30})`} />;
      })}
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={`s${i}`} cx={(i - 2.5) * 40} cy={-t * 6 - i * 10} r={40 + t * 3} fill="#6B6B6B" opacity={Math.max(0, 0.7 - t / 60)} />
      ))}
    </g>
  );

const Desert: React.FC<{ l: number; f: number; sunX?: number; sunY?: number; top?: string; bottom?: string; w?: number }> = ({ l, f, sunX = 860, sunY = 480, top = "#5DB7EE", bottom = "#F6E2B5", w = 1080 }) => (
  <>
    <SkyRect w={w} h={1200} top={top} bottom={bottom} />
    <Clouds f={l} y={260} w={w} />
    <Sun x={sunX} y={sunY} r={70} f={f} />
    <Dunes y={1150} w={w} />
  </>
);

// ------------------------------------------------------------ shots
const shots: ShotDef[] = [
  {
    at: 0,
    C: ({ l, d }) => (
      <Cam l={l} d={d} a={[600, 1000, 0.7]} b={[1300, 1250, 1.05]} w={2200}>
        <World w={2200}>
          <Desert l={l} f={l} w={2200} sunX={1800} />
          {[0, 1, 2, 3, 4].map((i) => (
            <Camel key={i} x={400 + i * 330 + l * 2} y={1500} s={0.75} f={l + i * 7} rider={i % 2 === 0} />
          ))}
          <g transform="translate(260 380)" opacity={ease(l, 6, 16)}>
            <rect x={-150} y={-60} width={300} height={110} rx={55} fill="rgba(0,0,0,0.55)" />
            <text x={0} y={20} textAnchor="middle" {...txt} fontSize={60} fill="#fff">
              الشام
            </text>
          </g>
        </World>
      </Cam>
    ),
  },
  {
    at: at("R01", "على"),
    C: ({ l, d }) => {
      const f = at("R01", "على") + l;
      const tW = at("R01", "أسابيع");
      const time = ease(f, tW - 4, tW + 40);
      const night = Math.sin(time * Math.PI * 3) > 0.6 ? 1 : 0;
      return (
        <Cam l={l} d={d} a={[560, 1080, 1.5]} b={[600, 1150, 1.1]}>
          <World>
            <Desert l={l} f={f} top={night ? "#0E1D3D" : "#5DB7EE"} bottom={night ? "#2B3E6B" : "#F6E2B5"} sunX={night ? -500 : 860} />
            <Man x={560} y={1330} s={0.75} f={f} pose={{ l: 30, r: -30 }} sweat={f >= tW} />
            <Camel x={560} y={1560} s={1.3} f={f} rider />
            {f >= tW &&
              [0, 1, 2].map((i) => (
                <Calendar key={i} x={260 + i * 40} y={760 + i * 10} s={0.8} n={1 + Math.floor((f - tW) / 3) + i * 7} label="يوم" />
              ))}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R02", "فقرروا"),
    C: ({ l, d }) => {
      const f = at("R02", "فقرروا") + l;
      const p = ease(f, at("R02", "سكة") - 4, at("R02", "كيلو") + 6);
      return (
        <Cam l={l} d={d} a={[540, 780, 1.15]} b={[540, 860, 0.95]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#4A3524" />
            <rect x={140} y={300} width={800} height={1300} rx={20} fill="#F2E3C2" stroke="#C9A25E" strokeWidth={10} />
            {Array.from({ length: 20 }).map((_, i) => (
              <path key={i} d={`M${200 + random(`mx${i}`) * 680} ${360 + random(`my${i}`) * 1180} q30 -10 60 0`} stroke="#D9C39A" strokeWidth={5} fill="none" />
            ))}
            <circle cx={620} cy={430} r={22} fill={K.red} />
            <text x={620} y={400} textAnchor="middle" {...txt} fontSize={54} fill="#2A1C10">
              الشام
            </text>
            <path d={`M620 430 C 560 700 680 1000 520 ${430 + 1080 * p}`} stroke="#2A1C10" strokeWidth={14} fill="none" strokeDasharray="30 18" />
            <g opacity={ease(f, at("R02", "كيلو") - 4, at("R02", "كيلو") + 8)}>
              <circle cx={520} cy={1510} r={22} fill={K.red} />
              <text x={520} y={1580} textAnchor="middle" {...txt} fontSize={54} fill="#2A1C10">
                المدينة
              </text>
            </g>
            <g transform={`translate(780 960) scale(${pop(f, at("R02", "ألف"), 30, 240, 11)})`}>
              <rect x={-170} y={-60} width={340} height={110} rx={55} fill="#2A1C10" />
              <text x={0} y={22} textAnchor="middle" {...txt} fontSize={60} fill="#fff">
                {`+${ar(1000)} كم`}
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R02", "في"),
    C: ({ l, d }) => {
      const f = at("R02", "في") + l;
      const laid = ease(l, 0, d);
      return (
        <Cam l={l} d={d} a={[300, 1300, 1.35]} b={[900, 1250, 1.0]} w={1500}>
          <World w={1500}>
            <Desert l={l} f={f} w={1500} sunX={1300} />
            <Rails x0={-200} x1={1500} y={1480} laid={0.2 + 0.8 * laid} />
            {[0, 1, 2].map((i) => (
              <Man key={i} x={lerp(100, 1200, 0.2 + 0.8 * laid) - i * 140} y={1460} s={0.6} f={f + i * 9} pose="hammer" armSwing={30} thobe="#E9DCC0" hand={<rect x={-10} y={-8} width={20} height={80} rx={6} fill="#555E68" />} />
            ))}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R03", "بس"),
    C: ({ l, d }) => {
      const f = at("R03", "بس") + l;
      return (
        <Cam l={l} d={d} a={[760, 1050, 1.7]} b={[560, 1200, 1.0]} w={1500}>
          <World w={1500}>
            <Desert l={l} f={f} w={1500} sunX={1300} />
            <Rails x0={-500} x1={1700} y={1480} />
            <Train x={600 + l * 3} y={1480} s={0.9} f={f} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R03", "والبخار"),
    C: ({ l, d }) => {
      const f = at("R03", "والبخار") + l;
      const level = 1 - ease(f, at("R03", "يبغى"), at("R03", "موية") + 16);
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.25]} b={[540, 1050, 1.05]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#1E2228" />
            <rect x={140} y={720} width={800} height={460} rx={220} fill="#3A3F47" stroke="#B8862B" strokeWidth={14} />
            <clipPath id="boiler">
              <rect x={150} y={730} width={780} height={440} rx={210} />
            </clipPath>
            <g clipPath="url(#boiler)">
              <rect x={150} y={1170 - 400 * level} width={780} height={400 * level} fill="#4FA8E0" />
              {Array.from({ length: 10 }).map((_, i) => {
                const t = ((f + i * 6) % 30) / 30;
                return <circle key={i} cx={200 + i * 70} cy={1170 - t * 400 * level} r={10} fill="#DDF2FF" opacity={level > 0.1 ? 1 - t : 0} />;
              })}
            </g>
            {Array.from({ length: 5 }).map((_, i) => (
              <path key={i} d={`M${260 + i * 130} 1420 q30 -110 0 -170 q80 60 50 170 Z`} fill={i % 2 ? "#FFC23B" : "#FF8A2A"} transform={`translate(0 ${Math.sin((f + i * 5) / 3) * 10})`} />
            ))}
            <g transform="translate(880 600)">
              <circle r={80} fill="#F4F6F8" stroke="#5C6670" strokeWidth={8} />
              <line x1={0} y1={0} x2={Math.cos(Math.PI * (0.2 + 0.6 * (1 - level))) * -60} y2={-Math.sin(Math.PI * (0.2 + 0.6 * (1 - level))) * 60} stroke={K.red} strokeWidth={8} strokeLinecap="round" />
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R03", "والصحرا"),
    C: ({ l, d }) => {
      const f = at("R03", "والصحرا") + l;
      return (
        <Cam l={l} d={d} a={[560, 1350, 1.3]} b={[700, 1100, 0.75]} w={1500}>
          <World w={1500}>
            <Desert l={l} f={f} w={1500} sunX={1200} />
            {Array.from({ length: 16 }).map((_, i) => (
              <path key={i} d={`M${random(`cr${i}`) * 1500} ${1600 + random(`cy${i}`) * 300} l40 20 l-10 30 l50 10`} stroke="#C99A5A" strokeWidth={5} fill="none" />
            ))}
            <Rails x0={-500} x1={1900} y={1480} />
            <Train x={700} y={1480} s={0.9} f={f} moving={false} steam={0.25} />
            <Man x={1180} y={1500} s={0.8} f={f} pose="hot" sweat />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R04", "فحفروا"),
    C: ({ l, d }) => {
      const f = at("R04", "فحفروا") + l;
      const dig = ease(l, 0, d * 0.8);
      return (
        <Cam l={l} d={d} a={[540, 1500, 1.2]} b={[540, 1250, 0.95]}>
          <World>
            <Desert l={l} f={f} />
            <rect x={-300} y={1300} width={1700} height={1000} fill="#E3B877" />
            <rect x={460} y={1300} width={160} height={600} fill="#7A5A3A" />
            <rect x={470} y={1300 + 600 * (1 - dig * 0.25)} width={140} height={600} fill="#4FA8E0" opacity={dig} />
            <rect x={420} y={1270} width={240} height={40} fill={K.stoneDark} />
            <rect x={430} y={1100} width={16} height={180} fill={K.sleeper} />
            <rect x={634} y={1100} width={16} height={180} fill={K.sleeper} />
            <rect x={420} y={1090} width={240} height={20} fill={K.sleeper} />
            <line x1={540} y1={1110} x2={540} y2={1300 + 500 * Math.abs(Math.sin(f / 16))} stroke="#3B2412" strokeWidth={4} />
            <Man x={300} y={1300} s={0.85} f={f} pose="carry" thobe="#E9DCC0" />
            <Man x={800} y={1300} s={0.85} f={f + 9} pose="reach" thobe="#E9DCC0" flip />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R04", "وبنوا"),
    C: ({ l, d }) => {
      const f = at("R04", "وبنوا") + l;
      const tank = ease(f, at("R04", "خزانات") - 4, at("R04", "خزانات") + 14);
      return (
        <Cam l={l} d={d} a={[760, 900, 1.3]} b={[640, 1200, 0.95]}>
          <World>
            <Desert l={l} f={f} />
            <Rails x0={-500} x1={1700} y={1480} />
            <g transform={`translate(820 1480)`}>
              <rect x={-20} y={-460 * tank} width={40} height={460 * tank} fill={K.stoneDark} />
              <rect x={-140} y={-620 * tank} width={280} height={180} rx={14} fill="#7A8794" stroke="#4A5560" strokeWidth={8} opacity={tank} />
              <path d={`M-110 ${-470 * tank} L-220 -380`} stroke="#4A5560" strokeWidth={22} opacity={tank} />
              {tank > 0.9 &&
                [0, 1, 2].map((i) => {
                  const t = ((f + i * 8) % 24) / 24;
                  return <circle key={i} cx={-220} cy={-370 + t * 80} r={10} fill="#4FA8E0" opacity={1 - t} />;
                })}
            </g>
            <Train x={420} y={1480} s={0.8} f={f} moving={false} steam={0.6} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R04", "كل"),
    C: ({ l, d }) => {
      const f = at("R04", "كل") + l;
      return (
        <Cam l={l} d={d} a={[540, 1350, 1.4]} b={[540, 1150, 0.9]} rot={[2, -1]}>
          <World>
            <Desert l={l} f={f} />
            <Station x={540} y={1450} s={1} guard f={f} />
            <Rails x0={-500} x1={1700} y={1520} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R05", "وسنة"),
    C: ({ l, d }) => {
      const f = at("R05", "وسنة") + l;
      const year = pop(f, at("R05", "ألف"), 30, 200, 11);
      const arrive = ease(f, at("R05", "وصل") - 10, at("R05", "المدينة") + 10);
      return (
        <Cam l={l} d={d} a={[540, 900, 0.95]} b={[700, 1250, 1.2]} w={1500}>
          <World w={1500}>
            <Desert l={l} f={f} w={1500} sunX={1300} />
            {[100, 260, 1250, 1400].map((x, i) => (
              <Palm key={x} x={x} y={1460} s={0.9 + (i % 2) * 0.2} f={f} />
            ))}
            <Station x={1050} y={1440} s={0.8} />
            <Rails x0={-500} x1={1900} y={1500} />
            <Train x={lerp(-400, 900, arrive)} y={1500} s={0.75} f={f} moving={arrive < 0.99} />
            {Array.from({ length: 6 }).map((_, i) => (
              <Man key={i} x={1180 + (i % 3) * 90} y={1650 + Math.floor(i / 3) * 60} s={0.45} f={f + i * 5} pose={arrive > 0.8 ? "wave" : "stand"} flip />
            ))}
            <g transform={`translate(750 600) scale(${year})`}>
              <text x={0} y={0} textAnchor="middle" {...txt} fontSize={200} fill="#fff" stroke="#2A1C10" strokeWidth={10} paintOrder="stroke">
                {ar(1908)}
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R05", "والرحلة"),
    C: ({ l }) => {
      const f = at("R05", "والرحلة") + l;
      const right = ease(f, at("R05", "صارت") - 4, at("R05", "أيام") + 6);
      const weeks = Math.min(40, 1 + Math.floor(l * 1.4));
      return (
        <AbsoluteFill style={{ background: "#F4E6C8" }}>
          <World>
            <line x1={540} y1={500} x2={540} y2={1650} stroke="#C9A25E" strokeWidth={6} />
            <Camel x={290} y={1050} s={0.7} f={f} />
            <Calendar x={290} y={1350} s={0.9} n={weeks} label="يوم" />
            <g opacity={right}>
              <Train x={850} y={1050} s={0.35} f={f} cars={0} />
              <Calendar x={790} y={1350} s={0.9} n={Math.min(4, 1 + Math.floor((f - at("R05", "صارت")) / 6))} label="يوم" />
            </g>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("R05", "مبروك"),
    C: ({ l, d }) => {
      const f = at("R05", "مبروك") + l;
      return (
        <Cam l={l} d={d} a={[1000, 1150, 1.2]} b={[1000, 1050, 0.6]} w={2000}>
          <World w={2000}>
            <Desert l={l} f={f} w={2000} top="#F2A65A" bottom="#FBE6B8" sunX={1700} sunY={900} />
            <Rails x0={-600} x1={2600} y={1450} />
            <Train x={600 + l * 6} y={1450} s={0.6} f={f} cars={3} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R06", "بس"),
    C: ({ l, d }) => {
      const f = at("R06", "بس") + l;
      const war = ease(f, at("R06", "جات") - 4, at("R06", "الحرب") + 10);
      return (
        <Cam l={l} d={d} a={[540, 1100, 1.0]} b={[540, 1150, 1.25]}>
          <World>
            <Desert l={l} f={f} top={war > 0.5 ? "#5A1F1A" : "#5DB7EE"} bottom={war > 0.5 ? "#C2603A" : "#F6E2B5"} />
            <rect x={-300} y={-300} width={1700} height={2500} fill="#3A0F0A" opacity={0.35 * war} />
            <Rails x0={-500} x1={1700} y={1480} />
            {war > 0.3 &&
              [0, 1, 2].map((i) => {
                const t = (f - at("R06", "الحرب") - i * 10 + 60) % 60;
                return <Boom key={i} x={200 + i * 340} y={1180 - i * 40} t={t} s={0.6} />;
              })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R07", "والسكة"),
    C: ({ l, d }) => {
      const f = at("R07", "والسكة") + l;
      const tB = at("R07", "تنفجر");
      const tR = at("R07", "تنقلع");
      const bridgeBroken = f >= tB;
      return (
        <Cam l={l} d={d} a={[540, 1200, 1.2]} b={[540, 1250, 1.0]} rot={[-2, 2]}>
          <World>
            <Desert l={l} f={f} top="#7A2E22" bottom="#E39A5A" />
            <rect x={-300} y={1500} width={1700} height={800} fill="#B98A55" />
            {/* stone bridge */}
            <g>
              {[0, 1, 2, 3].map((i) => {
                const fall = bridgeBroken && (i === 1 || i === 2) ? Math.min(400, (f - tB) * (f - tB) * 0.8) : 0;
                return (
                  <g key={i} transform={`translate(${180 + i * 240} ${1200 + fall}) rotate(${fall * (i === 1 ? -0.05 : 0.05)})`}>
                    <path d="M-120 0 L120 0 L120 300 L80 300 Q0 160 -80 300 L-120 300 Z" fill={K.stone} stroke={K.stoneDark} strokeWidth={6} />
                  </g>
                );
              })}
              <Rails x0={60} x1={1020} y={1170} broken={bridgeBroken ? ease(f, tR - 4, tR + 10) : 0} f={f} />
            </g>
            <Boom x={540} y={1250} t={f - tB} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R08", "والقطار"),
    C: ({ l, d }) => {
      const f = at("R08", "والقطار") + l;
      const stop = ease(f, at("R08", "والقطار"), at("R08", "وقف") + 10);
      return (
        <Cam l={l} d={d} a={[640, 1200, 1.3]} b={[740, 1100, 0.95]} w={1500}>
          <World w={1500}>
            <Desert l={l} f={f} w={1500} top="#5A3A3A" bottom="#D9A27A" sunX={1300} />
            <Rails x0={-500} x1={1900} y={1480} broken={1} f={f} />
            <Train x={lerp(300, 500, stop)} y={1480} s={0.85} f={f} moving={stop < 0.99} steam={1 - stop} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R08", "وما"),
    C: ({ l, d }) => {
      const f = at("R08", "وما") + l;
      const x = ease(f, at("R08", "يمشي") - 4, at("R08", "للمدينة") + 6);
      return (
        <Cam l={l} d={d} a={[540, 820, 1.05]} b={[540, 860, 0.95]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#4A3524" />
            <rect x={140} y={300} width={800} height={1300} rx={20} fill="#F2E3C2" stroke="#C9A25E" strokeWidth={10} />
            <circle cx={620} cy={430} r={22} fill={K.red} />
            <text x={620} y={400} textAnchor="middle" {...txt} fontSize={54} fill="#2A1C10">
              الشام
            </text>
            <path d="M620 430 C 560 700 680 1000 520 1510" stroke="#2A1C10" strokeWidth={14} fill="none" strokeDasharray="30 18" />
            <circle cx={520} cy={1510} r={22} fill={K.red} />
            <text x={520} y={1580} textAnchor="middle" {...txt} fontSize={54} fill="#2A1C10">
              المدينة
            </text>
            <g opacity={x} transform="translate(600 1180)">
              <path d="M-90 -90 L90 90 M90 -90 L-90 90" stroke={K.red} strokeWidth={30} strokeLinecap="round" />
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R09", "سكة"),
    C: ({ l }) => {
      const f = at("R09", "سكة") + l;
      const tL = at("R09", "عاشت");
      const build = ease(f, at("R09", "أخذت"), at("R09", "تنبني") + 10);
      const life = ease(f, tL, at("R09", "سنين", 1) + 6);
      return (
        <AbsoluteFill style={{ background: "#1F2329" }}>
          <World>
            <text x={540} y={760} textAnchor="middle" {...txt} fontSize={60} fill="#F4E6C8">
              بناء
            </text>
            <rect x={140} y={800} width={800} height={70} rx={35} fill="#3A3F47" />
            <rect x={140} y={800} width={800 * build * 0.8} height={70} rx={35} fill="#E0A33A" />
            <g opacity={ease(f, tL - 4, tL + 6)}>
              <text x={540} y={1060} textAnchor="middle" {...txt} fontSize={60} fill="#F4E6C8">
                شغّال
              </text>
              <rect x={140} y={1100} width={800} height={70} rx={35} fill="#3A3F47" />
              <rect x={140} y={1100} width={800 * life} height={70} rx={35} fill="#2BB673" />
              <text x={540} y={1320} textAnchor="middle" {...txt} fontSize={90} fill="#fff" opacity={ease(f, at("R09", "عشر") - 2, at("R09", "عشر") + 8)}>
                {`≈ ${ar(10)} سنين`}
              </text>
            </g>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("R10", "والمضحك"),
    C: ({ l, d }) => {
      const f = at("R10", "والمضحك") + l;
      return (
        <Cam l={l} d={d} a={[300, 1300, 1.45]} b={[760, 1150, 0.95]} w={1500} rot={[-3, 1]}>
          <World w={1500}>
            <Desert l={l} f={f} w={1500} top="#F2A65A" bottom="#FBE6B8" sunX={1250} sunY={1000} />
            <rect x={-500} y={1470} width={2500} height={30} fill="#B98A55" />
            <g transform="rotate(-3 750 1480)">
              <Train x={750} y={1490} s={0.85} f={f} moving={false} rust={1} steam={0} cars={1} />
            </g>
            <path d="M200 1560 C500 1440 900 1520 1300 1480 L1600 1600 L100 1620 Z" fill="#E9C27E" />
            <g transform={`translate(${900 + Math.sin(f / 30) * 20} 1300)`}>
              <ellipse rx={30} ry={10} fill="#8A6438" />
              <path d="M28 0 l40 -8" stroke="#8A6438" strokeWidth={6} />
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("R10", "ومحطة"),
    C: ({ l, d }) => {
      const f = at("R10", "ومحطة") + l;
      return (
        <Cam l={l} d={d} a={[540, 900, 1.25]} b={[540, 1200, 0.9]}>
          <World>
            <Desert l={l} f={f} />
            {[90, 990].map((x) => (
              <Palm key={x} x={x} y={1460} s={1.1} f={f} />
            ))}
            <Station x={540} y={1460} s={0.95} museum={f >= at("R10", "متحف") - 4} />
            {Array.from({ length: 6 }).map((_, i) => (
              <Man key={i} x={200 + i * 140} y={1640 + (i % 2) * 40} s={0.45} f={f + i * 8} walk pose="stand" flip={i % 2 === 0} />
            ))}
          </World>
        </Cam>
      );
    },
  },
  { at: start("R11"), C: ({ l }) => <FollowCard l={l} tFollow={at("R11", "تابعنا") - start("R11")} /> },
];

// ------------------------------------------------------------ cover
const Cover: React.FC = () => (
  <AbsoluteFill>
    <Cam l={0} d={1} a={[760, 1200, 0.95]} b={[760, 1200, 0.95]} w={1500}>
      <World w={1500}>
        <Desert l={0} f={0} w={1500} top="#F2A65A" bottom="#FBE6B8" sunX={1250} sunY={1000} />
        <rect x={-500} y={1470} width={2500} height={30} fill="#B98A55" />
        <g transform="rotate(-3 750 1480)">
          <Train x={750} y={1490} s={0.85} f={0} moving={false} rust={1} steam={0} cars={1} />
        </g>
        <path d="M200 1560 C500 1440 900 1520 1300 1480 L1600 1600 L100 1620 Z" fill="#E9C27E" />
      </World>
    </Cam>
    <div dir="rtl" style={{ position: "absolute", top: 220, left: 40, right: 40, textAlign: "center", ...txt }}>
      <div style={{ fontSize: 120, color: "#fff", WebkitTextStroke: "6px rgba(0,0,0,0.85)", paintOrder: "stroke fill", lineHeight: 1.2 }}>قطار من ١٩٠٨</div>
      <div style={{ display: "inline-block", marginTop: 16, padding: "6px 36px 18px", borderRadius: 24, background: K.red, color: "#fff", fontSize: 70 }}>للحين واقف بالصحرا!</div>
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ main
export const HejazStory: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  const probs = [at("R03", "بس"), at("R06", "بس"), at("R07", "تنفجر"), at("R08", "وقف")];
  const shake = probs.reduce((k, p) => Math.max(k, interpolate(f, [p - 1, p + 2, p + 16], [0, 1, 0], clamp)), 0);
  const end = start("R11");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ translate: `${Math.sin(f * 2.7) * 14 * shake}px ${Math.cos(f * 3.1) * 10 * shake}px` }}>
        <ShotPlayer f={f} shots={shots} total={T} />
      </AbsoluteFill>
      {shake > 0.02 && <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% 50%, transparent 50%, rgba(220,20,40,${0.45 * shake}) 100%)` }} />}
      <NameChip text="كل محطة = قلعة" at={at("R04", "قلعة")} until={start("R05")} top={1600} color="#7A4A22" />
      {f < end && <Captions timeline={hejazTimeline} top={230} />}

      <Voices timeline={hejazTimeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={hejazTimeline} src="audio/hejaz/music/calm.mp3" />
      {shots.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} name="swish" at={s.at - 2} gain={0.7} />
      ))}
      <Sfx name="glitch" at={at("R03", "بس") - 1} />
      <Sfx name="riser" at={at("R05", "وسنة") - 4} />
      <Sfx name="impact" at={at("R05", "ألف")} />
      <Sfx name="ding" at={at("R05", "مبروك")} />
      <Sfx name="riser" at={at("R06", "بس") - 6} />
      <Sfx name="thud" at={at("R06", "الحرب")} />
      <Sfx name="impact" at={at("R07", "تنفجر")} />
      <Sfx name="thud" at={at("R07", "تنقلع")} />
      <Sfx name="glitch" at={at("R08", "وقف")} />
      <Sfx name="impact" at={at("R09", "عشر")} />
      <Sfx name="sparkle" at={at("R10", "متحف")} />
      <Sfx name="pop" at={at("R11", "تابعنا")} />
    </AbsoluteFill>
  );
};

export const HejazStoryThumb: React.FC = () => <Cover />;
