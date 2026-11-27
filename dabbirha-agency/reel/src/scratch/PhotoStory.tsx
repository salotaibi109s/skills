import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import data from "../data/photo-timeline.json";
import type { TimelineData } from "../lib/timing";
import { Calendar, Cam, Clouds, Man, MudHouse, ShotPlayer, type ShotDef, SkyRect, Sun, World } from "./art";
import { ar, Captions, clamp, ease, makeStory, MusicBed, pop, SANS, Voices } from "./kit";
import { FollowCard } from "./SeaStory";

/** «الصورة من الصفر» — darkroom reds and sepia film grain, then a modern phone; voice: Fahad. */
export const photoTimeline = data as TimelineData;
const { Sfx, SceneVoice, at, start } = makeStory(photoTimeline, "audio/photo");
const T = photoTimeline.durationInFrames;
const txt = { fontFamily: SANS, fontWeight: 700 } as const;
const Q = { dark: "#120D0B", sepia: "#C9A77A", paper: "#EFE2C8", red: "#E0313F", wood: "#6B4423", gold: "#F2C14E" };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Film grain + vignette used for the old-photo chapter. */
const Vintage: React.FC<{ f: number; children: React.ReactNode; amount?: number }> = ({ f, children, amount = 1 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ filter: `sepia(${0.85 * amount}) contrast(${1 + 0.08 * amount}) brightness(${1 - 0.05 * amount})` }}>{children}</AbsoluteFill>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.22 * amount }}>
      {Array.from({ length: 260 }).map((_, i) => (
        <rect key={i} x={random(`g${i}${Math.floor(f / 2)}`) * 1080} y={random(`h${i}${Math.floor(f / 2)}`) * 1920} width={3} height={3} fill={i % 2 ? "#fff" : "#000"} />
      ))}
      {[0, 1].map((k) => (
        <line key={k} x1={random(`sc${k}${Math.floor(f / 5)}`) * 1080} y1={0} x2={random(`sc${k}${Math.floor(f / 5)}`) * 1080 + 10} y2={1920} stroke="#000" strokeWidth={2} />
      ))}
    </svg>
    <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% 50%, transparent 55%, rgba(30,15,5,${0.6 * amount}) 100%)` }} />
  </AbsoluteFill>
);

/** The landscape the camera sees (palm + house + sun) — drawn upright; flip it for the camera obscura. */
const Outside: React.FC<{ f?: number }> = ({ f = 0 }) => (
  <g clipPath="url(#outsideClip)">
    <defs>
      <clipPath id="outsideClip">
        <rect x={0} y={0} width={1080} height={960} />
      </clipPath>
    </defs>
    <SkyRect h={700} top="#6CC0EF" bottom="#F6E2B5" />
    <Sun x={820} y={220} r={70} f={f} />
    <rect x={0} y={560} width={1080} height={400} fill="#E3B877" />
    <MudHouse x={360} y={620} s={0.8} />
    <g transform="translate(760 640)">
      <path d="M-10 0 Q-20 -200 10 -380 L30 -380 Q0 -200 14 0 Z" fill="#8A6438" />
      {Array.from({ length: 7 }).map((_, i) => (
        <path key={i} d="M20 -380 q90 -40 170 30 q-90 -10 -170 -10 Z" fill="#4E9A3A" transform={`rotate(${i * 52} 20 -380)`} />
      ))}
    </g>
  </g>
);

const BoxCamera: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-150} width={400} height={300} rx={14} fill={Q.wood} stroke="#3E2512" strokeWidth={8} />
    <circle cx={220} cy={0} r={70} fill="#2A2A2A" stroke="#B8862B" strokeWidth={10} />
    <circle cx={220} cy={0} r={34} fill="#4A6E8A" />
    {[-130, 130].map((lx) => (
      <line key={lx} x1={lx} y1={150} x2={lx * 1.2} y2={520} stroke="#3E2512" strokeWidth={16} />
    ))}
    <line x1={0} y1={150} x2={0} y2={520} stroke="#3E2512" strokeWidth={16} />
  </g>
);

const Phone: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-230} y={-460} width={460} height={920} rx={70} fill="#111" />
    <rect x={-210} y={-440} width={420} height={880} rx={56} fill="#2A2F36" />
    <clipPath id="phoneScreen">
      <rect x={-210} y={-440} width={420} height={880} rx={56} />
    </clipPath>
    <g clipPath="url(#phoneScreen)">{children}</g>
    <rect x={-60} y={-430} width={120} height={30} rx={15} fill="#111" />
  </g>
);

// ------------------------------------------------------------ shots
const shots: ShotDef[] = [
  {
    at: 0,
    C: ({ l, d }) => {
      const p = ease(l, 10, d);
      return (
        <Cam l={l} d={d} a={[540, 1000, 0.9]} b={[600, 980, 1.3]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#E9D7B3" />
            <rect x={-300} y={1450} width={1700} height={900} fill="#A8703A" />
            <g transform="translate(640 1000)">
              <rect x={-260} y={-330} width={520} height={420} fill="#FBF7EC" stroke={Q.wood} strokeWidth={16} />
              <clipPath id="paintClip">
                <rect x={-250} y={-320} width={500 * p} height={400} />
              </clipPath>
              <g clipPath="url(#paintClip)" transform="translate(-250 -320) scale(0.46 0.57)">
                <Outside f={l} />
              </g>
              <line x1={-180} y1={90} x2={-260} y2={460} stroke={Q.wood} strokeWidth={16} />
              <line x1={180} y1={90} x2={260} y2={460} stroke={Q.wood} strokeWidth={16} />
            </g>
            <Man x={260} y={1500} s={1} f={l} pose={{ l: 8, r: -110 + Math.sin(l / 3) * 10 }} hand={<rect x={-6} y={0} width={12} height={90} rx={4} fill={Q.wood} />} />
            {l >= at("C01", "أيام") - 4 && <Calendar x={860} y={560} s={0.9} n={1 + Math.floor((l - at("C01", "أيام") + 4) / 4)} label="يوم" />}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("C02", "فدخلت"),
    C: ({ l, d }) => {
      const f = at("C02", "فدخلت") + l;
      const hole = f >= at("C02", "خرم") - 2;
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.0]} b={[700, 900, 1.5]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill={Q.dark} />
            <rect x={-300} y={1450} width={1700} height={900} fill="#1E1612" />
            {hole && <circle cx={860} cy={800} r={10} fill="#FFF7D6" />}
            {hole && <path d="M860 800 L200 640 L200 1180 Z" fill="rgba(255,247,214,0.08)" />}
            <Man x={lerp(200, 700, ease(l, 0, 30))} y={1500} s={1} f={f} walk={l < 30} pose={hole ? "point" : "stand"} thobe="#5A4A40" />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("C03", "والنور"),
    C: ({ l, d }) => {
      const f = at("C03", "والنور") + l;
      const img = ease(f, at("C03", "رسم") - 4, at("C03", "الجدار") + 6);
      const flip = ease(f, at("C03", "بالمقلوب") - 2, at("C03", "بالمقلوب") + 10);
      return (
        <Cam l={l} d={d} a={[860, 900, 1.3]} b={[420, 960, 1.0]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill={Q.dark} />
            <circle cx={880} cy={950} r={12} fill="#FFF7D6" />
            {[0, 1].map((k) => (
              <path key={k} d={`M880 950 L120 ${k ? 1340 : 560}`} stroke="rgba(255,247,214,0.35)" strokeWidth={6} />
            ))}
            <g opacity={img * 0.85} transform="translate(120 560)">
              <g transform={`translate(0 780) scale(0.62 -1.1)`}>
                <Outside f={f} />
              </g>
            </g>
            {flip > 0 && (
              <g transform={`translate(560 1520) scale(${pop(f, at("C03", "بالمقلوب"), 30, 240, 10)})`}>
                <path d="M-90 0 A90 90 0 1 1 90 0" stroke={Q.gold} strokeWidth={18} fill="none" />
                <path d="M70 -20 L90 0 L110 -20" stroke={Q.gold} strokeWidth={18} fill="none" />
              </g>
            )}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("C04", "وقبل"),
    C: ({ l, d }) => {
      const f = at("C04", "وقبل") + l;
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.3]} b={[540, 1050, 1.0]} rot={[-2, 1]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#3A2A1C" />
            <rect x={110} y={420} width={860} height={1180} rx={20} fill={Q.paper} stroke="#C9A25E" strokeWidth={10} />
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={i} x1={170} x2={910} y1={1250 + (i % 7) * 40} y2={1250 + (i % 7) * 40} stroke="#BFA77A" strokeWidth={6} strokeDasharray={`${60 + (i * 37) % 80} 20`} opacity={i < 7 ? 1 : 0} />
            ))}
            <g transform="translate(540 820)">
              <path d="M-280 -150 L280 -150 M-280 150 L280 150" stroke="#8B6B45" strokeWidth={4} />
              <rect x={-12} y={-180} width={24} height={360} fill="#3A2A1C" />
              <circle cx={0} cy={0} r={8} fill={Q.paper} />
              <path d="M-280 -120 L280 120 M-280 120 L280 -120" stroke={Q.red} strokeWidth={6} strokeDasharray={`${700 * ease(f, at("C04", "شرح") - 4, at("C04", "كذا") + 10)} 1000`} />
              <path d="M-300 -120 l20 -30 l20 30 Z" fill="#4E9A3A" />
              <path d="M280 120 l20 30 l20 -30 Z" fill="#4E9A3A" />
            </g>
            <g transform={`translate(540 1120) scale(${pop(f, at("C04", "ابن"), 30, 220, 12)})`}>
              <rect x={-220} y={-56} width={440} height={112} rx={56} fill="#2A1C10" />
              <text y={22} textAnchor="middle" {...txt} fontSize={60} fill="#fff">
                ابن الهيثم
              </text>
            </g>
            <g transform={`translate(840 520) scale(${pop(f, at("C04", "ألف"), 30, 220, 12)})`}>
              <rect x={-130} y={-46} width={260} height={92} rx={46} fill={Q.red} />
              <text y={18} textAnchor="middle" {...txt} fontSize={48} fill="#fff">
                {`+${ar(1000)} سنة`}
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("C05", "بس"),
    C: ({ l, d }) => {
      const f = at("C05", "بس") + l;
      const off = ease(f, at("C05", "يطفى") - 4, at("C05", "تختفي") + 10);
      return (
        <Cam l={l} d={d} a={[420, 960, 1.1]} b={[420, 960, 1.35]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill={Q.dark} />
            <g opacity={0.85 * (1 - off)} transform="translate(120 560)">
              <g transform={`translate(0 780) scale(0.62 -1.1)`}>
                <Outside f={f} />
              </g>
            </g>
            <circle cx={880} cy={950} r={12} fill="#FFF7D6" opacity={1 - off} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("C06", "فدهنوا"),
    C: ({ l, d }) => {
      const f = at("C06", "فدهنوا") + l;
      const coat = ease(f, at("C06", "فدهنوا"), at("C06", "الضوء") + 6);
      const ins = ease(f, at("C06", "وحطّوه") - 4, at("C06", "الجدار") + 10);
      return (
        <Vintage f={f}>
          <Cam l={l} d={d} a={[540, 1000, 1.35]} b={[620, 1050, 1.0]}>
            <World>
              <rect x={-300} y={-300} width={1700} height={2500} fill="#5A4636" />
              <rect x={-300} y={1450} width={1700} height={900} fill="#3E2E22" />
              <BoxCamera x={720} y={1050} s={0.9} />
              <g transform={`translate(${lerp(320, 620, ins)} ${lerp(1100, 1050, ins)}) scale(${1 - ins * 0.4})`}>
                <rect x={-120} y={-160} width={240} height={320} fill="#9AA3AD" stroke="#5C6670" strokeWidth={6} />
                <rect x={-120} y={-160} width={240} height={320 * coat} fill="#2E2A26" opacity={0.85} />
              </g>
              <Man x={180} y={1500} s={0.95} f={f} pose={{ l: 8, r: -80 + Math.sin(f / 3) * 14 }} hat="none" thobe="#4A4038" hand={<rect x={-8} y={0} width={16} height={80} rx={6} fill={Q.wood} />} />
            </World>
          </Cam>
        </Vintage>
      );
    },
  },
  {
    at: at("C07", "وطلعت"),
    C: ({ l, d }) => {
      const f = at("C07", "وطلعت") + l;
      const dev = ease(f, at("C07", "وطلعت"), at("C07", "تبقى") + 10);
      const hours = interpolate(f, [at("C07", "ساعات") - 4, at("C07", "الضوء") + 10], [0, 8], clamp);
      return (
        <Vintage f={f}>
          <Cam l={l} d={d} a={[540, 900, 1.2]} b={[540, 1000, 0.95]}>
            <World>
              <rect x={-300} y={-300} width={1700} height={2500} fill="#2A201A" />
              <g transform="translate(140 520)">
                <rect x={-20} y={-20} width={840} height={640} fill="#C9A77A" />
                <g opacity={dev} style={{ filter: "blur(3px)" }}>
                  <g transform="scale(0.78 0.66)">
                    <Outside />
                  </g>
                </g>
              </g>
              <g transform="translate(540 1460)">
                <circle r={170} fill={Q.paper} stroke="#3E2512" strokeWidth={14} />
                <line x1={0} y1={0} x2={0} y2={-120} stroke="#2A1C10" strokeWidth={12} strokeLinecap="round" transform={`rotate(${hours * 30})`} />
                <line x1={0} y1={0} x2={0} y2={-150} stroke={Q.red} strokeWidth={6} strokeLinecap="round" transform={`rotate(${hours * 360})`} />
                <circle r={12} fill="#2A1C10" />
              </g>
            </World>
          </Cam>
        </Vintage>
      );
    },
  },
  {
    at: at("C08", "والمصيبة"),
    C: ({ l, d }) => {
      const f = at("C08", "والمصيبة") + l;
      const move = f >= at("C08", "يتحرك") - 4;
      const ghost = ease(f, at("C08", "يطلع") - 4, at("C08", "شبح") + 6);
      return (
        <Vintage f={f}>
          <Cam l={l} d={d} a={[540, 1100, 1.0]} b={[700, 1150, 1.4]}>
            <World>
              <rect x={-300} y={-300} width={1700} height={2500} fill="#6E5A46" />
              <rect x={-300} y={1500} width={1700} height={900} fill="#4A3A2C" />
              <Man x={300} y={1520} s={0.95} f={0} pose="stand" thobe="#3A3430" />
              <Man x={540} y={1520} s={0.95} f={0} pose="stand" thobe="#5A4A40" />
              {move ? (
                <g opacity={1 - ghost * 0.5}>
                  {[0, 1, 2, 3].map((k) => (
                    <g key={k} opacity={0.3}>
                      <Man x={780 + k * 30 + Math.sin(f / 2) * 10} y={1520} s={0.8} f={f + k * 4} pose="wave" thobe="#E9DCC0" hat="none" />
                    </g>
                  ))}
                </g>
              ) : (
                <Man x={780} y={1520} s={0.8} f={0} pose="stand" thobe="#E9DCC0" hat="none" />
              )}
              {ghost > 0.3 && (
                <text x={880} y={980} {...txt} fontSize={120} fill="#fff" opacity={ghost * 0.8}>
                  👻
                </text>
              )}
            </World>
          </Cam>
        </Vintage>
      );
    },
  },
  {
    at: at("C09", "فصار"),
    C: ({ l, d }) => {
      const f = at("C09", "فصار") + l;
      const stand = ease(f, at("C09", "مساند") - 4, at("C09", "مساند") + 10);
      return (
        <Vintage f={f}>
          <Cam l={l} d={d} a={[540, 1100, 1.45]} b={[540, 1150, 0.95]}>
            <World>
              <rect x={-300} y={-300} width={1700} height={2500} fill="#6E5A46" />
              <rect x={-300} y={1500} width={1700} height={900} fill="#4A3A2C" />
              {[300, 540, 780].map((x, i) => (
                <g key={x}>
                  <g opacity={stand}>
                    <rect x={x - 8} y={1080} width={16} height={430} fill="#2A2A2A" />
                    <path d={`M${x - 50} 1090 Q${x} 1050 ${x + 50} 1090`} stroke="#2A2A2A" strokeWidth={12} fill="none" />
                  </g>
                  <Man x={x} y={1520} s={0.85} f={0} pose={{ l: 8, r: -8 }} thobe={["#3A3430", "#5A4A40", "#E9DCC0"][i]} hat={i === 2 ? "none" : "shmagh"} />
                </g>
              ))}
              <BoxCamera x={540} y={700} s={0.5} />
            </World>
          </Cam>
        </Vintage>
      );
    },
  },
  {
    at: at("C10", "وبعدها"),
    C: ({ l }) => {
      const f = at("C10", "وبعدها") + l;
      const tF = at("C10", "فلم");
      const tD = at("C10", "حساس");
      const stage = f >= tD - 4 ? 2 : f >= tF - 4 ? 1 : 0;
      const p = pop(f, stage === 0 ? at("C10", "ثواني") - 4 : stage === 1 ? tF - 4 : tD - 4, 30, 220, 11);
      return (
        <Vintage f={f} amount={stage === 0 ? 0.8 : stage === 1 ? 0.4 : 0}>
          <AbsoluteFill style={{ background: stage === 2 ? "#0E1420" : "#3A2A1C" }}>
            <World>
              <g transform={`translate(540 1000) scale(${p})`}>
                {stage === 0 && (
                  <g>
                    <circle r={260} fill={Q.paper} stroke="#3E2512" strokeWidth={18} />
                    <line x1={0} y1={0} x2={0} y2={-220} stroke={Q.red} strokeWidth={10} transform={`rotate(${f * 18})`} />
                    <text y={110} textAnchor="middle" {...txt} fontSize={90} fill="#2A1C10">
                      ثواني
                    </text>
                  </g>
                )}
                {stage === 1 && (
                  <g transform={`translate(${(f * 8) % 160 - 80} 0)`}>
                    <rect x={-700} y={-180} width={1400} height={360} fill="#1A1A1A" />
                    {Array.from({ length: 24 }).map((_, i) => (
                      <rect key={i} x={-690 + i * 58} y={-165} width={30} height={26} rx={4} fill="#E8E0CC" />
                    ))}
                    {Array.from({ length: 24 }).map((_, i) => (
                      <rect key={`b${i}`} x={-690 + i * 58} y={140} width={30} height={26} rx={4} fill="#E8E0CC" />
                    ))}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <rect key={`fr${i}`} x={-640 + i * 260} y={-110} width={220} height={220} fill="#8B6B45" opacity={0.8} />
                    ))}
                  </g>
                )}
                {stage === 2 && (
                  <g>
                    <rect x={-240} y={-240} width={480} height={480} rx={20} fill="#2E7D5B" />
                    {Array.from({ length: 12 }).map((_, r) =>
                      Array.from({ length: 12 }).map((__, c) => <rect key={`${r}${c}`} x={-200 + c * 34} y={-200 + r * 34} width={26} height={26} fill={["#E0313F", "#2BB673", "#3DA9FC"][(r + c) % 3]} opacity={0.85} />),
                    )}
                    {Array.from({ length: 16 }).map((_, i) => (
                      <rect key={`p${i}`} x={-280 + (i % 8) * 70} y={i < 8 ? -300 : 260} width={20} height={40} fill="#B8862B" />
                    ))}
                  </g>
                )}
              </g>
            </World>
          </AbsoluteFill>
        </Vintage>
      );
    },
  },
  {
    at: at("C11", "ومبروك"),
    C: ({ l, d }) => {
      const f = at("C11", "ومبروك") + l;
      const out = ease(f, at("C11", "الكاميرا") - 6, at("C11", "جيبك") + 6);
      return (
        <Cam l={l} d={d} a={[540, 1200, 1.0]} b={[540, 1000, 1.25]}>
          <World>
            <SkyRect h={1500} top="#6CC0EF" bottom="#F6E2B5" />
            <Clouds f={l} y={300} />
            <rect x={-300} y={1500} width={1700} height={900} fill="#E3B877" />
            <Man x={300} y={1600} s={1.15} f={f} pose={{ l: 8, r: -150 }} />
            <g transform={`translate(${lerp(420, 640, out)} ${lerp(1450, 1000, out)}) rotate(${lerp(30, 0, out)})`}>
              <Phone x={0} y={0} s={0.55}>
                <g transform="translate(-210 -440) scale(0.39 0.92)">
                  <Outside f={f} />
                </g>
                <circle cx={0} cy={360} r={46} fill="#fff" stroke="#ccc" strokeWidth={8} />
              </Phone>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("C12", "والمفاجأة"),
    C: ({ l, d }) => {
      const f = at("C12", "والمفاجأة") + l;
      const burst = f >= at("C12", "يصوّر") - 4;
      const n = burst ? Math.floor((f - at("C12", "يصوّر") + 4) * 1.5) : 0;
      return (
        <Cam l={l} d={d} a={[540, 960, 1.15]} b={[540, 960, 0.9]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#0E1420" />
            {burst &&
              Array.from({ length: Math.min(40, n) }).map((_, i) => {
                const t = Math.min(1, (n - i) / 14);
                const a = random(`b${i}`) * Math.PI * 2;
                return (
                  <g key={i} transform={`translate(${540 + Math.cos(a) * 520 * t} ${960 + Math.sin(a) * 760 * t}) rotate(${random(`r${i}`) * 40 - 20}) scale(${0.4 + 0.3 * t})`} opacity={1 - t * 0.3}>
                    <rect x={-110} y={-80} width={220} height={160} fill="#fff" />
                    <g transform="translate(-100 -70) scale(0.185 0.2)">
                      <Outside />
                    </g>
                  </g>
                );
              })}
            <Phone x={540} y={960} s={1}>
              <g transform="translate(-210 -440) scale(0.39 0.92)">
                <Outside f={f} />
              </g>
              {burst && <rect x={-210} y={-440} width={420} height={880} fill="#fff" opacity={(f % 4) < 1 ? 0.6 : 0} />}
              <circle cx={0} cy={360} r={46} fill={burst ? Q.red : "#fff"} stroke="#ccc" strokeWidth={8} />
            </Phone>
            {burst && (
              <g transform="translate(540 1560)">
                <rect x={-230} y={-60} width={460} height={110} rx={55} fill={Q.red} />
                <text y={22} textAnchor="middle" {...txt} fontSize={62} fill="#fff">
                  {`${ar(Math.min(99, n))} صورة`}
                </text>
              </g>
            )}
          </World>
        </Cam>
      );
    },
  },
  { at: start("C13"), C: ({ l }) => <FollowCard l={l} tFollow={at("C13", "مثل") - start("C13")} /> },
];

// ------------------------------------------------------------ cover
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#0E1420" }}>
    <World>
      <g transform="translate(300 1180) rotate(-6)" style={{ filter: "sepia(0.9)" }}>
        <rect x={-230} y={-180} width={460} height={360} fill="#fff" />
        <g transform="translate(-210 -160) scale(0.39 0.46)">
          <Outside />
        </g>
      </g>
      <Phone x={780} y={1200} s={0.7}>
        <g transform="translate(-210 -440) scale(0.39 0.92)">
          <Outside />
        </g>
      </Phone>
      <path d="M480 1180 l120 0 m-30 -30 l30 30 l-30 30" stroke={Q.gold} strokeWidth={14} fill="none" />
    </World>
    <div dir="rtl" style={{ position: "absolute", top: 230, left: 40, right: 40, textAlign: "center", ...txt }}>
      <div style={{ fontSize: 120, color: "#fff", WebkitTextStroke: "6px rgba(0,0,0,0.85)", paintOrder: "stroke fill", lineHeight: 1.2 }}>صورة أخذت ساعات!</div>
      <div style={{ display: "inline-block", marginTop: 16, padding: "6px 36px 18px", borderRadius: 24, background: Q.red, color: "#fff", fontSize: 72 }}>والحين بثانية 📸</div>
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ main
export const PhotoStory: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  const probs = [at("C01", "بس"), at("C05", "بس"), at("C08", "والمصيبة")];
  const shake = probs.reduce((k, p) => Math.max(k, interpolate(f, [p - 1, p + 2, p + 14], [0, 1, 0], clamp)), 0);
  const end = start("C13");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ translate: `${Math.sin(f * 2.7) * 12 * shake}px ${Math.cos(f * 3.1) * 9 * shake}px` }}>
        <ShotPlayer f={f} shots={shots} total={T} />
      </AbsoluteFill>
      {shake > 0.02 && <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% 50%, transparent 50%, rgba(220,20,40,${0.45 * shake}) 100%)` }} />}
      {f < end && <Captions timeline={photoTimeline} top={230} />}

      <Voices timeline={photoTimeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={photoTimeline} src="audio/photo/music/calm.mp3" />
      {shots.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} name="swish" at={s.at - 2} gain={0.7} />
      ))}
      {probs.map((p, i) => (
        <Sfx key={`g${i}`} name="glitch" at={p - 1} />
      ))}
      <Sfx name="tick" at={at("C02", "خرم")} />
      <Sfx name="ding" at={at("C03", "بالمقلوب")} />
      <Sfx name="pop" at={at("C04", "ابن")} />
      <Sfx name="sparkle" at={at("C07", "تبقى")} />
      <Sfx name="whoosh" at={at("C08", "شبح")} />
      <Sfx name="pop" at={at("C10", "فلم")} />
      <Sfx name="pop" at={at("C10", "حساس")} />
      <Sfx name="sparkle" at={at("C11", "جيبك")} />
      <Sfx name="riser" at={at("C12", "والمفاجأة") - 6} />
      {Array.from({ length: 8 }).map((_, i) => (
        <Sfx key={`c${i}`} name="tick" at={at("C12", "يصوّر") + i * 4} gain={0.6} />
      ))}
      <Sfx name="pop" at={at("C13", "تابعنا")} />
    </AbsoluteFill>
  );
};

export const PhotoStoryThumb: React.FC = () => <Cover />;
