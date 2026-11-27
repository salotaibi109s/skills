import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import data from "../data/oil-timeline.json";
import type { TimelineData } from "../lib/timing";
import { Calendar, Cam, Dunes, Man, ShotPlayer, type ShotDef, SkyRect, Sun, World } from "./art";
import { ar, Captions, clamp, ease, makeStory, MusicBed, pop, SANS, Voices } from "./kit";
import { FollowCard } from "./SeaStory";

/** «بير الخير» — Dammam No. 7, 1930s amber/sepia desert palette, voice: Fahad. Part 2 of 2. */
export const oilTimeline = data as TimelineData;
const { Sfx, SceneVoice, at, start } = makeStory(oilTimeline, "audio/oil");
const T = oilTimeline.durationInFrames;
const txt = { fontFamily: SANS, fontWeight: 700 } as const;
const O = { sky1: "#E9A25A", sky2: "#FBE3B8", oil: "#141010", red: "#E0313F", green: "#2BB673", gold: "#F2C14E", steel: "#4A4038" };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Derrick: React.FC<{ x: number; y: number; s?: number; grow?: number; num?: number; fail?: number; gush?: number; f?: number }> = ({ x, y, s = 1, grow = 1, num, fail = 0, gush = 0, f = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <clipPath id={`dg${Math.round(x)}${Math.round(y)}`}>
      <rect x={-200} y={-700 * grow} width={400} height={700 * grow + 20} />
    </clipPath>
    <g clipPath={`url(#dg${Math.round(x)}${Math.round(y)})`}>
      <path d="M-120 0 L0 -620 L120 0" fill="none" stroke={O.steel} strokeWidth={14} />
      {[0.2, 0.4, 0.6, 0.8].map((k) => (
        <g key={k}>
          <line x1={-120 * (1 - k)} y1={-620 * k} x2={120 * (1 - k)} y2={-620 * k} stroke={O.steel} strokeWidth={8} />
          <line x1={-120 * (1 - k)} y1={-620 * k} x2={120 * (1 - k + 0.2)} y2={-620 * (k - 0.2)} stroke={O.steel} strokeWidth={5} />
        </g>
      ))}
      <rect x={-150} y={-10} width={300} height={24} fill="#6B4423" />
    </g>
    {num !== undefined && (
      <g transform="translate(0 -700)">
        <circle r={56} fill="#fff" stroke={O.steel} strokeWidth={6} />
        <text y={22} textAnchor="middle" {...txt} fontSize={66} fill="#2A1C10">
          {ar(num)}
        </text>
      </g>
    )}
    {fail > 0 && (
      <g opacity={fail} transform="translate(0 -320)">
        <path d="M-90 -90 L90 90 M90 -90 L-90 90" stroke={O.red} strokeWidth={28} strokeLinecap="round" />
      </g>
    )}
    {gush > 0.02 &&
      Array.from({ length: 22 }).map((_, i) => {
        const t = ((f + i * 3) % 34) / 34;
        const h = 900 * gush;
        return <circle key={i} cx={Math.sin(i * 1.9) * 220 * t} cy={-620 - h * (1 - t) + t * 300} r={16 + 14 * (1 - t)} fill={O.oil} />;
      })}
  </g>
);

/** Earth in section with a drill string going down to `depth` (0..1 of the drawn ground). */
const Section: React.FC<{ f: number; depth: number; top?: number; oilPocket?: number; gas?: number }> = ({ f, depth, top = 900, oilPocket = 0, gas = 0 }) => {
  const layers = ["#D9B27A", "#C99A5A", "#A87E4A", "#8C6A44", "#6E5640", "#4E3E30"];
  return (
    <g>
      {layers.map((c, i) => (
        <path key={i} d={`M-300 ${top + i * 180} C200 ${top + i * 180 - 30} 700 ${top + i * 180 + 30} 1400 ${top + i * 180} L1400 ${top + i * 180 + 200} L-300 ${top + i * 180 + 200} Z`} fill={c} />
      ))}
      {oilPocket > 0 && <ellipse cx={540} cy={top + 1000} rx={380 * oilPocket} ry={110 * oilPocket} fill={O.oil} />}
      <rect x={532} y={top - 20} width={16} height={1080 * depth} fill="#2A2F36" />
      <path d={`M520 ${top - 20 + 1080 * depth} l20 30 l20 -30 Z`} fill="#9AA3AD" transform={`rotate(${f * 20} 540 ${top - 5 + 1080 * depth})`} />
      {gas > 0 &&
        Array.from({ length: 5 }).map((_, i) => {
          const t = ((f + i * 8) % 30) / 30;
          return <circle key={i} cx={540 + Math.sin(i) * 20} cy={top - 20 - t * 200} r={20 + t * 20} fill="#E6E9EC" opacity={gas * (1 - t)} />;
        })}
    </g>
  );
};

const Desert: React.FC<{ l: number; f: number; w?: number }> = ({ l, f, w = 1080 }) => (
  <>
    <SkyRect w={w} h={1200} top={O.sky1} bottom={O.sky2} />
    <Sun x={w - 220} y={520} r={80} f={f} />
    <Dunes y={1150} w={w} />
    {Array.from({ length: 4 }).map((_, i) => {
      const t = ((l + i * 15) % 60) / 60;
      return <path key={i} d={`M${100 + i * 240} ${1150 - t * 80} q20 -10 40 0 q20 10 40 0`} stroke="rgba(255,255,255,0.35)" strokeWidth={5} fill="none" />;
    })}
  </>
);

const NameTag: React.FC<{ x: number; y: number; s: number; text: string; color?: string }> = ({ x, y, s, text, color = "#2A1C10" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-250} y={-56} width={500} height={112} rx={56} fill={color} />
    <text y={22} textAnchor="middle" {...txt} fontSize={56} fill="#fff">
      {text}
    </text>
  </g>
);

// ------------------------------------------------------------ shots
const shots: ShotDef[] = [
  {
    at: 0,
    C: ({ l, d }) => (
      <Cam l={l} d={d} a={[700, 1000, 0.75]} b={[620, 1250, 1.2]} w={1400}>
        <World w={1400}>
          <Desert l={l} f={l} w={1400} />
          <Man x={620} y={1500} s={1.05} f={l} pose="point" hand={<rect x={-60} y={0} width={120} height={80} fill="#F4EAD2" stroke="#C9B48E" strokeWidth={4} />} />
        </World>
      </Cam>
    ),
  },
  {
    at: at("O02", "فجبت"),
    C: ({ l, d }) => {
      const f = at("O02", "فجبت") + l;
      const grow = ease(f, at("O02", "حفّارة") - 4, at("O02", "وحفرت"));
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.0]} b={[540, 1450, 0.85]} h={2300}>
          <World h={2300}>
            <Desert l={l} f={f} />
            <Section f={f} top={1250} depth={ease(f, at("O02", "وحفرت"), at("O02", "طلع")) * 0.5} gas={ease(f, at("O02", "غاز") - 2, at("O02", "غاز") + 6)} />
            <Derrick x={540} y={1250} s={0.9} grow={grow} fail={ease(f, at("O02", "يكفي") - 2, at("O02", "يكفي") + 8)} />
            {f >= at("O02", "نفط") - 2 &&
              [0, 1, 2].map((i) => {
                const t = ((f + i * 10) % 30) / 30;
                return <path key={i} d="M0 -14 C9 0 9 8 0 12 C-9 8 -9 0 0 -14 Z" fill={O.oil} transform={`translate(${520 + i * 20} ${1100 - t * 40})`} opacity={1 - t} />;
              })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("O03", "فحفرت"),
    C: ({ l, d }) => {
      const f = at("O03", "فحفرت") + l;
      const ws = ["الثاني", "والثالث", "والرابع", "والخامس", "والسادس"].map((w) => at("O03", w));
      return (
        <Cam l={l} d={d} a={[300, 1200, 1.15]} b={[1100, 1150, 0.8]} w={1800}>
          <World w={1800}>
            <Desert l={l} f={f} w={1800} />
            {ws.map((t, i) => (
              <Derrick key={i} x={200 + i * 340} y={1380} s={0.55} grow={ease(f, t - 4, t + 8)} num={f >= t ? i + 2 : undefined} fail={ease(f, t + 8, t + 16)} />
            ))}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("O04", "سنين"),
    C: ({ l, d }) => {
      const f = at("O04", "سنين") + l;
      const money = 1 - ease(f, at("O04", "والفلوس"), at("O04", "تخلص") + 10);
      const crowd = f >= at("O04", "والكل") - 4;
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.3]} b={[540, 1100, 1.0]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#6E5640" />
            <Calendar x={260} y={800} s={1.1} n={1935 + Math.min(3, Math.floor(l / 12))} label="سنة" />
            <g transform="translate(800 860)">
              <path d="M-120 120 Q-150 -40 -60 -90 L60 -90 Q150 -40 120 120 Z" fill="#C9A06A" stroke="#8B6B45" strokeWidth={6} transform={`scale(${0.5 + 0.5 * money})`} />
              <text y={60} textAnchor="middle" {...txt} fontSize={100} fill="#2A1C10" transform={`scale(${0.5 + 0.5 * money})`}>
                $
              </text>
              {Array.from({ length: 6 }).map((_, i) => {
                const t = ((f + i * 6) % 30) / 30;
                return <circle key={i} cx={(i - 2.5) * 30} cy={140 + t * 400} r={20} fill={O.gold} opacity={money * (1 - t)} />;
              })}
            </g>
            {crowd &&
              [200, 400, 600, 800].map((x, i) => (
                <Man key={x} x={x} y={1560} s={0.75} f={f + i * 4} pose={{ l: 8, r: -100 + Math.sin((f + i * 5) / 3) * 25 }} thobe={i % 2 ? "#E9DCC0" : "#4A4038"} hat={i % 2 ? "shmagh" : "none"} />
              ))}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("O05", "بس"),
    C: ({ l, d }) => {
      const f = at("O05", "بس") + l;
      const tM = at("O05", "ماكس");
      const tK = at("O05", "خميس");
      const showK = f >= at("O05", "ومعه") - 4;
      return (
        <Cam l={l} d={d} a={[600, 1180, 1.0]} b={[600, 1120, 0.92]} w={1200}>
          <World w={1200}>
            <Desert l={l} f={f} w={1200} />
            <Man x={360} y={1500} s={1.05} f={f} pose={f >= at("O05", "نحفر") ? { l: 8, r: 60 } : "point"} hat="none" thobe="#7A6A58" hand={<rect x={-8} y={0} width={16} height={70} rx={4} fill="#555" />} />
            <NameTag x={360} y={960} s={pop(f, tM, 30, 220, 12)} text="ماكس ستاينكي" />
            {f >= at("O05", "نحفر") && (
              <path d="M360 1600 l0 160 m-40 -40 l40 40 l40 -40" stroke={O.red} strokeWidth={16} fill="none" opacity={ease(f, at("O05", "نحفر"), at("O05", "أعمق") + 4)} />
            )}
            {showK && (
              <>
                <Man x={820} y={1500} s={1.05} f={f} pose="point" flip />
                <NameTag x={840} y={960} s={pop(f, tK, 30, 220, 12)} text="خميس بن رمثان" color="#7A4A22" />
              </>
            )}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("O06", "فرجعوا"),
    C: ({ l, d }) => {
      const f = at("O06", "فرجعوا") + l;
      const deep = ease(f, at("O06", "ونزلوا") - 4, at("O06", "متر") + 6);
      const meters = Math.round(1440 * deep);
      return (
        <Cam l={l} d={d} a={[540, 900, 1.05]} b={[540, lerp(1300, 1700, deep), 0.8]} h={2600}>
          <World h={2600}>
            <Desert l={l} f={f} />
            <Section f={f} top={1250} depth={deep} />
            <Derrick x={540} y={1250} s={0.9} num={7} />
            <g transform={`translate(860 ${1300 + 1050 * deep})`}>
              <rect x={-150} y={-56} width={300} height={100} rx={20} fill="rgba(0,0,0,0.7)" />
              <text y={14} textAnchor="middle" {...txt} fontSize={54} fill="#fff">
                {`${ar(meters)} م`}
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("O07", "وفي"),
    C: ({ l, d }) => {
      const f = at("O07", "وفي") + l;
      const yr = pop(f, at("O07", "ألف"), 30, 200, 11);
      const gush = ease(f, at("O07", "طلع") - 4, at("O07", "النفط") + 10);
      return (
        <Cam l={l} d={d} a={[540, 900, 0.9]} b={[540, 1150, 1.15]}>
          <World>
            <Desert l={l} f={f} />
            <Derrick x={540} y={1450} s={0.9} num={7} gush={gush} f={f} />
            {gush > 0.5 &&
              [180, 880].map((x, i) => <Man key={x} x={x} y={1600} s={0.8} f={f + i * 6} pose="hot" flip={i === 1} />)}
            <g transform={`translate(540 820) scale(${yr * (1 - gush * 0.4)})`}>
              <text textAnchor="middle" {...txt} fontSize={210} fill="#fff" stroke="#2A1C10" strokeWidth={10} paintOrder="stroke">
                {ar(1938)}
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("O08", "مبروك"),
    C: ({ l, d }) => {
      const f = at("O08", "مبروك") + l;
      return (
        <Cam l={l} d={d} a={[700, 1150, 1.3]} b={[700, 1050, 0.85]} w={1400}>
          <World w={1400}>
            <SkyRect w={1400} h={1200} top="#C8643C" bottom="#FBD38A" />
            <Sun x={1100} y={1050} r={110} f={f} />
            <Dunes y={1150} w={1400} tone={1} />
            <Derrick x={700} y={1400} s={0.95} num={7} gush={0.6} f={f} />
            <g transform="translate(700 1560)">
              <rect x={-200} y={-50} width={400} height={100} rx={14} fill="#F4EAD2" stroke="#6B4423" strokeWidth={6} />
              <text y={18} textAnchor="middle" {...txt} fontSize={52} fill="#2A1C10">
                {`الدمام ${ar(7)}`}
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("O09", "والمفاجأة"),
    C: ({ l }) => {
      const f = at("O09", "والمفاجأة") + l;
      const yrs = ease(f, at("O09", "ظل") - 4, at("O09", "سنة", 1) + 6);
      const bbl = ease(f, at("O09", "أكثر") - 2, at("O09", "برميل") + 10);
      return (
        <AbsoluteFill style={{ background: "#1F1812" }}>
          <World>
            <text x={980} y={620} textAnchor="end" {...txt} fontSize={60} fill="#F4E6C8">
              {ar(1938)}
            </text>
            <text x={100} y={620} {...txt} fontSize={60} fill="#F4E6C8" opacity={yrs}>
              {ar(1982)}
            </text>
            <rect x={100} y={660} width={880} height={60} rx={30} fill="#3A3028" />
            <rect x={980 - 880 * yrs} y={660} width={880 * yrs} height={60} rx={30} fill={O.gold} />
            <text x={540} y={830} textAnchor="middle" {...txt} fontSize={84} fill="#fff" opacity={yrs}>
              {`${ar(Math.round(44 * yrs))} سنة`}
            </text>
            {Array.from({ length: Math.round(18 * bbl) }).map((_, i) => (
              <g key={i} transform={`translate(${230 + (i % 6) * 120} ${1420 - Math.floor(i / 6) * 150})`}>
                <rect x={-46} y={-62} width={92} height={124} rx={16} fill="#2F4A7A" stroke="#1B2B48" strokeWidth={5} />
                <line x1={-46} x2={46} y1={-20} y2={-20} stroke="#1B2B48" strokeWidth={5} />
                <line x1={-46} x2={46} y1={20} y2={20} stroke="#1B2B48" strokeWidth={5} />
              </g>
            ))}
            <text x={540} y={1620} textAnchor="middle" {...txt} fontSize={72} fill={O.gold} opacity={bbl}>
              {`+${ar(32)} مليون برميل`}
            </text>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("O10", "واليوم"),
    C: ({ l, d }) => {
      const f = at("O10", "واليوم") + l;
      const name = pop(f, at("O10", "بير") - 2, 30, 200, 11);
      return (
        <Cam l={l} d={d} a={[540, 1100, 1.3]} b={[540, 1000, 1.0]}>
          <World>
            <SkyRect h={1300} top="#2B3E6B" bottom="#E9A25A" />
            <Dunes y={1250} w={1080} />
            <Derrick x={540} y={1450} s={0.8} num={7} />
            <g transform={`translate(540 700) scale(${name})`}>
              <rect x={-300} y={-90} width={600} height={180} rx={30} fill="#1F7F5A" stroke={O.gold} strokeWidth={8} />
              <text y={30} textAnchor="middle" {...txt} fontSize={110} fill="#fff">
                بير الخير
              </text>
            </g>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2 + f / 30;
              return <circle key={i} cx={540 + Math.cos(a) * 380} cy={700 + Math.sin(a) * 160} r={6} fill={O.gold} opacity={name} />;
            })}
          </World>
        </Cam>
      );
    },
  },
  { at: start("O11"), C: ({ l }) => <FollowCard l={l} tFollow={at("O11", "مثل") - start("O11")} /> },
];

// ------------------------------------------------------------ cover
const Cover: React.FC = () => (
  <AbsoluteFill>
    <World>
      <SkyRect h={1300} top="#C8643C" bottom="#FBD38A" />
      <Sun x={860} y={1000} r={110} f={0} />
      <Dunes y={1150} w={1080} tone={1} />
      {[180, 360, 720, 900].map((x, i) => (
        <Derrick key={x} x={x} y={1380} s={0.4} num={i < 2 ? i + 2 : i + 3} fail={1} />
      ))}
      <Derrick x={540} y={1500} s={0.75} num={7} gush={0.7} f={8} />
    </World>
    <div dir="rtl" style={{ position: "absolute", top: 230, left: 40, right: 40, textAlign: "center", ...txt }}>
      <div style={{ fontSize: 120, color: "#fff", WebkitTextStroke: "6px rgba(0,0,0,0.85)", paintOrder: "stroke fill", lineHeight: 1.2 }}>٦ آبار فاشلة…</div>
      <div style={{ display: "inline-block", marginTop: 16, padding: "6px 36px 18px", borderRadius: 24, background: "#1F7F5A", color: "#fff", fontSize: 72 }}>والسابع غيّر كل شي</div>
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ main
export const OilStory: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  const probs = [at("O02", "يكفي"), at("O04", "وقّف")];
  const shake = probs.reduce((k, p) => Math.max(k, interpolate(f, [p - 1, p + 2, p + 14], [0, 1, 0], clamp)), 0);
  const end = start("O11");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ translate: `${Math.sin(f * 2.7) * 12 * shake}px ${Math.cos(f * 3.1) * 9 * shake}px` }}>
        <ShotPlayer f={f} shots={shots} total={T} />
      </AbsoluteFill>
      {shake > 0.02 && <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% 50%, transparent 50%, rgba(220,20,40,${0.45 * shake}) 100%)` }} />}
      {f < end && <Captions timeline={oilTimeline} top={230} />}

      <Voices timeline={oilTimeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={oilTimeline} src="audio/oil/music/calm.mp3" />
      {shots.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} name="swish" at={s.at - 2} gain={0.7} />
      ))}
      {probs.map((p, i) => (
        <Sfx key={`g${i}`} name="glitch" at={p - 1} />
      ))}
      {["الثاني", "والثالث", "والرابع", "والخامس", "والسادس"].map((w, i) => (
        <Sfx key={`x${i}`} name="thud" at={at("O03", w) + 8} gain={0.6} />
      ))}
      <Sfx name="pop" at={at("O05", "ماكس")} />
      <Sfx name="pop" at={at("O05", "خميس")} />
      <Sfx name="riser" at={at("O06", "ونزلوا")} />
      <Sfx name="impact" at={at("O07", "النفط")} />
      <Sfx name="ding" at={at("O08", "مبروك")} />
      <Sfx name="tick" at={at("O09", "أكثر")} />
      <Sfx name="sparkle" at={at("O10", "الخير")} />
      <Sfx name="pop" at={at("O11", "تابعنا")} />
    </AbsoluteFill>
  );
};

export const OilStoryThumb: React.FC = () => <Cover />;
