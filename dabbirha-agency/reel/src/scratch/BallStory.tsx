import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import data from "../data/ball-timeline.json";
import type { TimelineData } from "../lib/timing";
import { Cam, Man, ShotPlayer, type ShotDef, SkyRect, Sun, World } from "./art";
import { ar, Captions, clamp, ease, makeStory, MusicBed, NameChip, pop, SANS, Voices } from "./kit";
import { FollowCard } from "./SeaStory";

/** «الكورة من الصفر» — night-stadium palette, voice: Fahad. */
export const ballTimeline = data as TimelineData;
const { Sfx, SceneVoice, at, start } = makeStory(ballTimeline, "audio/ball");
const T = ballTimeline.durationInFrames;
const txt = { fontFamily: SANS, fontWeight: 700 } as const;
const G = { grass: "#2F8F46", grass2: "#277A3B", line: "#E9F5EC", night: "#0B1A2E", gold: "#F2C14E", red: "#E0313F", leather: "#8B5A2B", leather2: "#A8703A" };

// ------------------------------------------------------------ the ball in its eras
type Kind = "cloth" | "leather" | "wet" | "coated" | "panels" | "modern";
const Ball: React.FC<{ x: number; y: number; r?: number; kind: Kind; rot?: number; squash?: number; deflate?: number }> = ({ x, y, r = 90, kind, rot = 0, squash = 0, deflate = 0 }) => {
  const sy = 1 - squash * 0.25 - deflate * 0.35;
  const sx = 1 + squash * 0.2 + deflate * 0.15;
  const id = `bc${Math.round(x)}${Math.round(y)}${kind}`;
  return (
    <g transform={`translate(${x} ${y + r * (1 - sy)}) scale(${sx} ${sy}) rotate(${rot})`}>
      <ellipse cx={0} cy={r * 1.05 / sy} rx={r * 0.9} ry={r * 0.14} fill="rgba(0,0,0,0.25)" transform={`rotate(${-rot})`} />
      <clipPath id={id}>
        <circle r={r} />
      </clipPath>
      {kind === "cloth" && (
        <g>
          <circle r={r} fill="#C9B79C" />
          <g clipPath={`url(#${id})`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <path key={i} d={`M${-r} ${-r + i * (r / 3.5)} Q0 ${-r + i * (r / 3.5) + 30} ${r} ${-r + i * (r / 3.5) - 10}`} stroke={i % 2 ? "#A8936F" : "#E0D2B8"} strokeWidth={r / 6} fill="none" />
            ))}
          </g>
        </g>
      )}
      {(kind === "leather" || kind === "wet" || kind === "coated") && (
        <g>
          <circle r={r} fill={kind === "wet" ? "#5A3517" : G.leather2} />
          <g clipPath={`url(#${id})`}>
            {[-1, 0, 1].map((k) => (
              <path key={k} d={`M${-r} ${k * r * 0.55} Q0 ${k * r * 0.55 + (k === 0 ? 0 : k * 20)} ${r} ${k * r * 0.55}`} stroke={kind === "wet" ? "#3E230E" : G.leather} strokeWidth={5} fill="none" />
            ))}
            {[-1, 1].map((k) => (
              <path key={`v${k}`} d={`M${k * r * 0.4} ${-r} Q${k * r * 0.5} 0 ${k * r * 0.4} ${r}`} stroke={kind === "wet" ? "#3E230E" : G.leather} strokeWidth={5} fill="none" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`l${i}`} x1={-14} x2={14} y1={-r * 0.35 + i * 14} y2={-r * 0.35 + i * 14} stroke="#F4E6C8" strokeWidth={4} />
            ))}
          </g>
          {kind === "coated" && <ellipse cx={-r * 0.35} cy={-r * 0.4} rx={r * 0.3} ry={r * 0.18} fill="rgba(255,255,255,0.55)" />}
        </g>
      )}
      {kind === "panels" && (
        <g>
          <circle r={r} fill="#F7F7F7" />
          <g clipPath={`url(#${id})`}>
            {[
              [0, 0],
              [0.95, -0.25],
              [-0.95, -0.25],
              [0.55, 0.9],
              [-0.55, 0.9],
              [0, -1.05],
            ].map(([px, py], i) => (
              <path key={i} d={pent(px * r * 0.62, py * r * 0.62, r * 0.27)} fill="#141414" />
            ))}
          </g>
        </g>
      )}
      {kind === "modern" && (
        <g>
          <circle r={r} fill="#FAFAFA" />
          <g clipPath={`url(#${id})`}>
            <path d={`M${-r} ${-r * 0.2} C${-r * 0.3} ${-r * 0.9} ${r * 0.3} ${r * 0.6} ${r} ${-r * 0.1}`} stroke={G.red} strokeWidth={r * 0.22} fill="none" />
            <path d={`M${-r} ${r * 0.4} C${-r * 0.2} ${-r * 0.1} ${r * 0.4} ${r * 1.0} ${r} ${r * 0.5}`} stroke="#1F7F5A" strokeWidth={r * 0.18} fill="none" />
            <path d={`M${-r * 0.3} ${-r} C${0} ${-r * 0.4} ${-r * 0.2} ${r * 0.3} ${r * 0.2} ${r}`} stroke={G.gold} strokeWidth={r * 0.1} fill="none" />
          </g>
        </g>
      )}
      <circle r={r} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={4} />
      <circle r={r} fill="url(#ballShade)" />
    </g>
  );
};
const pent = (cx: number, cy: number, s: number) =>
  Array.from({ length: 5 })
    .map((_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return `${i ? "L" : "M"}${cx + Math.cos(a) * s} ${cy + Math.sin(a) * s}`;
    })
    .join(" ") + " Z";

const Defs: React.FC = () => (
  <defs>
    <radialGradient id="ballShade" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
      <stop offset="70%" stopColor="rgba(0,0,0,0)" />
      <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
    </radialGradient>
  </defs>
);

const Pitch: React.FC<{ y: number; w?: number; night?: boolean; mud?: number }> = ({ y, w = 1080, night, mud = 0 }) => (
  <g>
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x={-600} y={y + i * 120} width={w + 1200} height={120} fill={i % 2 ? G.grass : G.grass2} opacity={night ? 0.9 : 1} />
    ))}
    {mud > 0 &&
      Array.from({ length: 14 }).map((_, i) => <ellipse key={i} cx={random(`m${i}`) * w} cy={y + 60 + random(`my${i}`) * 900} rx={90 + random(`mr${i}`) * 80} ry={30} fill="#5A3B1E" opacity={0.7 * mud} />)}
    <rect x={-600} y={y} width={w + 1200} height={8} fill={G.line} />
    <ellipse cx={w / 2} cy={y + 520} rx={360} ry={140} fill="none" stroke={G.line} strokeWidth={8} />
  </g>
);

const Stadium: React.FC<{ f: number; w?: number; y?: number; crowd?: boolean }> = ({ f, w = 1080, y = 1000, crowd = true }) => (
  <g>
    <rect x={-600} y={-600} width={w + 1200} height={y + 600} fill={G.night} />
    {Array.from({ length: 30 }).map((_, i) => (
      <circle key={i} cx={random(`s${i}`) * w} cy={random(`sy${i}`) * (y - 500)} r={2 + random(`sr${i}`) * 2} fill="#fff" opacity={0.6} />
    ))}
    <path d={`M-600 ${y - 300} L${w + 600} ${y - 300} L${w + 600} ${y} L-600 ${y} Z`} fill="#16263D" />
    {crowd &&
      Array.from({ length: 70 }).map((_, i) => {
        const x = (i * 37) % (w + 400) - 200;
        const yy = y - 280 + (i % 4) * 60 + Math.sin((f + i * 7) / 6) * (i % 5 === 0 ? 8 : 2);
        return <circle key={i} cx={x} cy={yy} r={16} fill={["#E0313F", "#F4F4F4", "#1F7F5A", "#F2C14E"][i % 4]} opacity={0.85} />;
      })}
    {[120, w - 120].map((lx) => (
      <g key={lx}>
        <rect x={lx - 8} y={y - 700} width={16} height={420} fill="#5C6670" />
        <rect x={lx - 70} y={y - 760} width={140} height={70} rx={10} fill="#FFF7D6" />
        <path d={`M${lx - 70} ${y - 690} L${lx - 300} ${y + 400} L${lx + 300} ${y + 400} L${lx + 70} ${y - 690} Z`} fill="rgba(255,247,214,0.08)" />
      </g>
    ))}
  </g>
);

const TV: React.FC<{ x: number; y: number; s?: number; children: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-360} y={-280} width={720} height={540} rx={50} fill="#6B4423" stroke="#4A2E17" strokeWidth={12} />
    <rect x={-300} y={-230} width={500} height={420} rx={40} fill="#222" />
    <clipPath id="tvScreen">
      <rect x={-290} y={-220} width={480} height={400} rx={36} />
    </clipPath>
    <g clipPath="url(#tvScreen)">{children}</g>
    {[0, 1].map((i) => (
      <circle key={i} cx={270} cy={-140 + i * 110} r={30} fill="#C9A25E" />
    ))}
    <path d="M-120 -280 L-200 -400 M120 -280 L200 -400" stroke="#333" strokeWidth={8} />
  </g>
);

// ------------------------------------------------------------ shots
const shots: ShotDef[] = [
  {
    at: 0,
    C: ({ l, d }) => (
      <Cam l={l} d={d} a={[540, 900, 0.8]} b={[560, 1250, 1.3]}>
        <World>
          <SkyRect h={1150} top="#F2A65A" bottom="#FBE6B8" />
          <Sun x={820} y={720} r={90} f={l} />
          <rect x={-300} y={1150} width={1700} height={1200} fill="#D9B27A" />
          {[180, 880].map((gx) => (
            <g key={gx}>
              <rect x={gx - 8} y={1050} width={16} height={260} fill="#ECECEC" />
            </g>
          ))}
          <Man x={540} y={1500} s={1.15} f={l} pose={l > at("B01", "وما") ? { l: 40, r: -40, head: 6 } : "stand"} />
          {l > at("B01", "عندك") && (
            <text x={720} y={1080} {...txt} fontSize={150} fill="#fff" stroke="#2A1C10" strokeWidth={8} paintOrder="stroke" opacity={ease(l, at("B01", "عندك"), at("B01", "عندك") + 8)}>
              ؟
            </text>
          )}
        </World>
      </Cam>
    ),
  },
  {
    at: at("B02", "فلفّيت"),
    C: ({ l, d }) => {
      const f = at("B02", "فلفّيت") + l;
      const wrap = ease(f, at("B02", "فلفّيت"), at("B02", "بعضه") + 10);
      const roll = ease(f, at("B02", "وصارت") - 2, at("B02", "صحيح"));
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.6]} b={[620, 1100, 1.15]}>
          <World>
            <Defs />
            <rect x={-300} y={-300} width={1700} height={2500} fill="#D9B27A" />
            {Array.from({ length: 20 }).map((_, i) => (
              <circle key={i} cx={random(`p${i}`) * 1080} cy={1100 + random(`py${i}`) * 800} r={6} fill="#B9925A" />
            ))}
            {wrap < 1 &&
              Array.from({ length: 5 }).map((_, i) => (
                <path key={i} d={`M${200 + i * 30} ${900 + i * 40} Q540 ${1000 - i * 20} ${880 - i * 30} ${1100 - i * 30}`} stroke={i % 2 ? "#A8936F" : "#E0D2B8"} strokeWidth={34} fill="none" strokeLinecap="round" opacity={1 - wrap} />
              ))}
            <Ball x={540 + roll * 260} y={1050} r={40 + 70 * wrap} kind="cloth" rot={roll * 400} squash={f > at("B02", "مخدة") ? 0.35 : 0} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("B03", "بس"),
    C: ({ l, d }) => {
      const f = at("B03", "بس") + l;
      const tK = at("B03", "شوتة");
      const tB = at("B03", "تفرّطت");
      const fly = ease(f, tK, tB);
      return (
        <Cam l={l} d={d} a={[400, 1250, 1.3]} b={[700, 1100, 1.0]}>
          <World>
            <Defs />
            <SkyRect h={1150} top="#F2A65A" bottom="#FBE6B8" />
            <rect x={-300} y={1150} width={1700} height={1200} fill="#D9B27A" />
            <Man x={260} y={1500} s={1.0} f={f} pose={f >= tK ? { l: 60, r: -110 } : "stand"} />
            {f < tB && <Ball x={lerpN(400, 820, fly)} y={1440 - Math.sin(fly * Math.PI) * 500} r={80} kind="cloth" rot={f * 12} />}
            {f >= tB &&
              Array.from({ length: 8 }).map((_, i) => {
                const t = f - tB;
                const a = (i / 8) * Math.PI * 2;
                return <path key={i} d="M0 0 q30 -20 60 0 q30 20 60 0" stroke={i % 2 ? "#A8936F" : "#E0D2B8"} strokeWidth={22} fill="none" strokeLinecap="round" transform={`translate(${820 + Math.cos(a) * t * 9} ${940 + Math.sin(a) * t * 9 + t * t * 0.4}) rotate(${t * 10 + i * 45})`} />;
              })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("B04", "فجابوا"),
    C: ({ l, d }) => {
      const f = at("B04", "فجابوا") + l;
      const inflate = ease(f, at("B04", "ونفخوها") - 2, at("B04", "ولفّوها"));
      const wrap = ease(f, at("B04", "ولفّوها"), at("B04", "بجلد") + 14);
      const tB = at("B04", "تنط");
      const b = f >= tB ? Math.abs(Math.sin((f - tB) / 5)) * Math.exp(-(f - tB) / 30) : 0;
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.5]} b={[540, 1050, 1.05]}>
          <World>
            <Defs />
            <rect x={-300} y={-300} width={1700} height={2500} fill="#3A2A1C" />
            <rect x={-300} y={1300} width={1700} height={900} fill="#5A4030" />
            {wrap < 0.99 && <ellipse cx={540} cy={1000} rx={40 + 130 * inflate} ry={30 + 120 * inflate} fill="#E9A3A0" stroke="#B5605C" strokeWidth={6} opacity={1 - wrap} />}
            {wrap > 0.01 && (
              <g opacity={wrap}>
                <Ball x={540} y={1000 - b * 420} r={170} kind="leather" squash={f >= tB && b < 0.08 ? 0.5 : 0} />
              </g>
            )}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("B05", "بس"),
    C: ({ l, d }) => {
      const f = at("B05", "بس") + l;
      const def = ease(f, at("B05", "المثانة"), at("B05", "تنفّس") + 16) * (1 - ease(f, at("B05", "تنفخها"), at("B05", "جديد") + 10));
      return (
        <Cam l={l} d={d} a={[540, 1100, 1.4]} b={[480, 1150, 1.1]}>
          <World>
            <Defs />
            <SkyRect h={1150} top="#8FC7E8" bottom="#E9F4F9" />
            <Pitch y={1150} />
            <Ball x={680} y={1380} r={130} kind="leather" deflate={def} />
            {f >= at("B05", "تنفخها") - 6 && <Man x={360} y={1560} s={1.0} f={f} pose={{ l: 30, r: -60 }} />}
            {f >= at("B05", "تنفخها") &&
              [0, 1, 2].map((i) => {
                const t = ((f + i * 8) % 24) / 24;
                return <circle key={i} cx={460 + t * 120} cy={1170 + t * 40} r={14 + t * 10} fill="#fff" opacity={1 - t} />;
              })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("B06", "فجا"),
    C: ({ l, d }) => {
      const f = at("B06", "فجا") + l;
      const one = ease(f, at("B06", "ونفخة") - 4, at("B06", "تكفي") + 4);
      return (
        <Cam l={l} d={d} a={[540, 900, 1.7]} b={[540, 1050, 1.1]}>
          <World>
            <Defs />
            <rect x={-300} y={-300} width={1700} height={2500} fill="#1E2A38" />
            <circle cx={540} cy={1000} r={60 + 140 * one} fill="#2A2A2A" stroke="#111" strokeWidth={10} />
            <rect x={530} y={1000 + 60 + 140 * one} width={20} height={200 - 140 * one} fill="#2A2A2A" />
            {one > 0.95 && (
              <g transform={`translate(800 760) scale(${pop(f, at("B06", "تكفي") + 2, 30, 260, 10)})`}>
                <circle r={70} fill="#2BB673" />
                <path d="M-30 2 L-8 26 L34 -22" stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
            <text x={540} y={1460} textAnchor="middle" {...txt} fontSize={80} fill="#fff" opacity={ease(f, at("B06", "المطاط") - 2, at("B06", "المطاط") + 8)}>
              مطاط
            </text>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("B07", "بس"),
    C: ({ l, d }) => {
      const f = at("B07", "بس") + l;
      const wet = ease(f, at("B07", "يشرب") - 2, at("B07", "المطر") + 10);
      const head = f >= at("B07", "وتوجع") - 4;
      return (
        <Cam l={l} d={d} a={[540, 1150, 1.0]} b={[460, 1050, 1.35]} rot={[-2, 2]}>
          <World>
            <Defs />
            <rect x={-300} y={-300} width={1700} height={1600} fill="#4A5868" />
            <Pitch y={1250} mud={wet} />
            {Array.from({ length: 50 }).map((_, i) => {
              const t = ((f * 1.6 + i * 9) % 60) / 60;
              return <line key={i} x1={random(`r${i}`) * 1200 - 60} y1={t * 1900 - 200} x2={random(`r${i}`) * 1200 - 80} y2={t * 1900 - 150} stroke="#BFD9EF" strokeWidth={4} opacity={0.6 * wet} />;
            })}
            <Man x={460} y={1560} s={1.05} f={f} pose={head ? { l: 20, r: -20, head: -10 } : "stand"} />
            <Ball x={head ? 470 : 700} y={head ? 1050 : 1420} r={95} kind={wet > 0.5 ? "wet" : "leather"} />
            {head &&
              Array.from({ length: 5 }).map((_, i) => {
                const a = (f / 6 + (i * 2 * Math.PI) / 5) % (Math.PI * 2);
                return (
                  <text key={i} x={460 + Math.cos(a) * 110} y={1110 + Math.sin(a) * 30} fontSize={44} fill={G.gold}>
                    ★
                  </text>
                );
              })}
            {wet > 0.6 && !head && (
              <g transform="translate(820 1150)">
                <rect x={-90} y={-60} width={180} height={90} rx={16} fill="#2A1C10" />
                <text x={0} y={2} textAnchor="middle" {...txt} fontSize={46} fill="#fff">
                  ثقيلة!
                </text>
              </g>
            )}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("B08", "فغلّفوها"),
    C: ({ l, d }) => {
      const f = at("B08", "فغلّفوها") + l;
      const coat = ease(f, at("B08", "فغلّفوها"), at("B08", "بطبقة") + 10);
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.6]} b={[540, 1000, 1.25]}>
          <World>
            <Defs />
            <rect x={-300} y={-300} width={1700} height={2500} fill="#4A5868" />
            <Ball x={540} y={1000} r={230} kind={coat > 0.5 ? "coated" : "wet"} rot={f * 0.5} />
            <circle cx={540} cy={1000} r={240} fill="none" stroke="rgba(190,230,255,0.8)" strokeWidth={12 * coat} strokeDasharray="1200" strokeDashoffset={1200 * (1 - coat)} />
            {Array.from({ length: 12 }).map((_, i) => {
              const t = ((f + i * 7) % 30) / 30;
              const x = 330 + i * 38;
              const yHit = 1000 - Math.sqrt(Math.max(0, 240 * 240 - (x - 540) * (x - 540)));
              const y = t < 0.6 ? lerpN(300, yHit, t / 0.6) : yHit - (t - 0.6) * 200;
              const dx = t < 0.6 ? 0 : (x - 540) * (t - 0.6) * 2;
              return <circle key={i} cx={x + dx} cy={y} r={9} fill="#BFE3F7" opacity={coat} />;
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("B09", "وجا"),
    C: ({ l, d }) => {
      const f = at("B09", "وجا") + l;
      return (
        <Cam l={l} d={d} a={[540, 1100, 0.85]} b={[500, 1000, 1.35]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#C9A87A" />
            <rect x={-300} y={1400} width={1700} height={900} fill="#8B6B45" />
            <TV x={540} y={1050} s={1.1}>
              <g style={{ filter: "grayscale(1)" }}>
                <rect x={-300} y={-240} width={520} height={440} fill="#7A7A7A" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <rect key={i} x={-300} y={-240 + i * 74} width={520} height={37} fill="#727272" />
                ))}
                <Man x={-120} y={120} s={0.5} f={f} walk pose="stand" thobe="#9A9A9A" />
                <circle cx={60 + Math.sin(f / 8) * 80} cy={90} r={22} fill="#7E7E7E" />
                {Array.from({ length: 200 }).map((_, i) => (
                  <rect key={`n${i}`} x={-300 + random(`nx${i}${Math.floor(f / 2)}`) * 520} y={-240 + random(`ny${i}${Math.floor(f / 2)}`) * 440} width={4} height={4} fill={i % 2 ? "#fff" : "#000"} opacity={0.35} />
                ))}
              </g>
            </TV>
            {f >= at("B09", "تبان") - 4 && (
              <text x={620} y={760} {...txt} fontSize={140} fill={G.red} stroke="#fff" strokeWidth={6} paintOrder="stroke" opacity={ease(f, at("B09", "تبان") - 4, at("B09", "تبان") + 6)}>
                ؟
              </text>
            )}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("B10", "فخلّوها"),
    C: ({ l, d }) => {
      const f = at("B10", "فخلّوها") + l;
      const show = ease(f, at("B10", "فخلّوها"), at("B10", "وسودا") + 8);
      return (
        <Cam l={l} d={d} a={[500, 1000, 1.35]} b={[420, 1040, 2.4]}>
          <World>
            <Defs />
            <rect x={-300} y={-300} width={1700} height={2500} fill="#C9A87A" />
            <TV x={540} y={1050} s={1.1}>
              <g style={{ filter: "grayscale(1)" }}>
                <rect x={-300} y={-240} width={520} height={440} fill="#7A7A7A" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <rect key={i} x={-300} y={-240 + i * 74} width={520} height={37} fill="#727272" />
                ))}
                <g opacity={show}>
                  <Ball x={-60 + Math.sin(f / 8) * 60} y={60} r={60} kind="panels" rot={f * 6} />
                </g>
              </g>
            </TV>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("B11", "وبعدها"),
    C: ({ l, d }) => {
      const f = at("B11", "وبعدها") + l;
      const tF = at("B11", "تطير");
      const flight = ease(f, tF - 4, at("B11", "والحارس") + 10);
      const bx = lerpN(140, 820, flight) + Math.sin(flight * 14) * 90 * flight;
      const by = 1500 - Math.sin(flight * Math.PI) * 600;
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.5]} b={[620, 1100, 0.95]}>
          <World>
            <Defs />
            <Stadium f={f} y={1000} />
            <Pitch y={1000} night />
            <rect x={640} y={1080} width={360} height={240} fill="none" stroke="#fff" strokeWidth={12} />
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1={640 + i * 45} y1={1080} x2={640 + i * 45} y2={1320} stroke="rgba(255,255,255,0.4)" strokeWidth={3} />
            ))}
            {f < tF - 4 ? <Ball x={540} y={1000} r={200} kind="modern" rot={f * 8} /> : <Ball x={bx} y={by} r={60} kind="modern" rot={f * 14} />}
            {f >= tF - 4 && (
              <>
                <path d={`M140 1500 ${Array.from({ length: 20 }).map((_, i) => { const t = (i / 19) * flight; return `L${lerpN(140, 820, t) + Math.sin(t * 14) * 90 * t} ${1500 - Math.sin(t * Math.PI) * 600}`; }).join(" ")}`} stroke="rgba(255,255,255,0.5)" strokeWidth={6} strokeDasharray="14 14" fill="none" />
                <Man x={820 + Math.sin(f / 4) * 50 * (f > at("B11", "والحارس") ? 1 : 0)} y={1330} s={0.75} f={f} thobe="#F2C14E" hat="none" pose={f > at("B11", "يتلخبط") ? { l: 150, r: -150, head: Math.sin(f / 3) * 10 } : "reach"} flip />
              </>
            )}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("B12", "ومبروك"),
    C: ({ l, d }) => {
      const f = at("B12", "ومبروك") + l;
      return (
        <Cam l={l} d={d} a={[540, 1300, 1.6]} b={[540, 1050, 0.95]}>
          <World>
            <Defs />
            <Stadium f={f} y={1050} />
            <Pitch y={1050} night />
            <Ball x={540} y={1450} r={90} kind="modern" rot={f * 3} />
            {Array.from({ length: 5 }).map((_, k) => {
              const t = (f - at("B12", "ومبروك") - k * 12) % 70;
              const cx = 200 + k * 170;
              const cy = 400 + (k % 2) * 120;
              return t > 0
                ? Array.from({ length: 14 }).map((_, i) => {
                    const a = (i / 14) * Math.PI * 2;
                    return <circle key={`${k}${i}`} cx={cx + Math.cos(a) * t * 4} cy={cy + Math.sin(a) * t * 4 + t * t * 0.03} r={6} fill={[G.gold, "#fff", G.red, "#7FD3FF", "#2BB673"][k]} opacity={Math.max(0, 1 - t / 60)} />;
                  })
                : null;
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("B13", "والمفاجأة"),
    C: ({ l, d }) => {
      const f = at("B13", "والمفاجأة") + l;
      const yr = pop(f, at("B13", "ألفين"), 30, 200, 11);
      const green = ease(f, at("B13", "السعودية") - 4, at("B13", "السعودية") + 12);
      return (
        <Cam l={l} d={d} a={[540, 1000, 1.3]} b={[540, 960, 1.0]}>
          <World>
            <Defs />
            <Stadium f={f} y={1150} />
            <Pitch y={1150} night />
            <rect x={-300} y={-300} width={1700} height={2500} fill="#0E6B3E" opacity={0.55 * green} />
            <g transform={`translate(540 820) scale(${yr})`}>
              <text x={0} y={0} textAnchor="middle" {...txt} fontSize={260} fill="#fff" stroke="#0B1A2E" strokeWidth={12} paintOrder="stroke">
                {ar(2034)}
              </text>
            </g>
            <g transform={`translate(540 1300) scale(${pop(f, at("B13", "السعودية"), 30, 220, 11)})`}>
              <rect x={-260} y={-70} width={520} height={130} rx={65} fill="#fff" />
              <text x={0} y={22} textAnchor="middle" {...txt} fontSize={80} fill="#0E6B3E">
                السعودية
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  { at: start("B14"), C: ({ l }) => <FollowCard l={l} tFollow={at("B14", "مثل") - start("B14")} /> },
];
const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;

// ------------------------------------------------------------ cover
const Cover: React.FC = () => (
  <AbsoluteFill>
    <World>
      <Defs />
      <Stadium f={0} y={1050} />
      <Pitch y={1050} night />
      <Ball x={300} y={1450} r={110} kind="cloth" />
      <Ball x={540} y={1380} r={130} kind="panels" />
      <Ball x={790} y={1450} r={110} kind="modern" />
      <path d="M380 1450 l60 0 m-20 -20 l20 20 l-20 20 M620 1450 l60 0 m-20 -20 l20 20 l-20 20" stroke={G.gold} strokeWidth={10} fill="none" transform="scale(-1 1) translate(-1080 0)" />
    </World>
    <div dir="rtl" style={{ position: "absolute", top: 230, left: 40, right: 40, textAlign: "center", ...txt }}>
      <div style={{ fontSize: 140, color: "#fff", WebkitTextStroke: "6px rgba(0,0,0,0.85)", paintOrder: "stroke fill", lineHeight: 1.15 }}>الكورة من الصفر</div>
      <div style={{ display: "inline-block", marginTop: 16, padding: "6px 36px 18px", borderRadius: 24, background: "#0E6B3E", color: "#fff", fontSize: 72 }}>والمفاجأة ٢٠٣٤ ⚽</div>
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ main
export const BallStory: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  const probs = [at("B03", "تفرّطت"), at("B05", "بس"), at("B07", "بس"), at("B09", "تبان")];
  const shake = probs.reduce((k, p) => Math.max(k, interpolate(f, [p - 1, p + 2, p + 14], [0, 1, 0], clamp)), 0);
  const end = start("B14");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ translate: `${Math.sin(f * 2.7) * 12 * shake}px ${Math.cos(f * 3.1) * 9 * shake}px` }}>
        <ShotPlayer f={f} shots={shots} total={T} />
      </AbsoluteFill>
      {shake > 0.02 && <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% 50%, transparent 50%, rgba(220,20,40,${0.45 * shake}) 100%)` }} />}
      <NameChip text="قطع بيضا وسودا" at={at("B10", "وصارت")} until={start("B11")} top={1640} color="#141414" />
      {f < end && <Captions timeline={ballTimeline} top={230} />}

      <Voices timeline={ballTimeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={ballTimeline} src="audio/ball/music/calm.mp3" />
      {shots.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} name="swish" at={s.at - 2} gain={0.7} />
      ))}
      {probs.map((p, i) => (
        <Sfx key={`g${i}`} name="glitch" at={p - 1} />
      ))}
      <Sfx name="thud" at={at("B03", "شوتة") + 2} />
      <Sfx name="boing" at={at("B04", "تنط")} />
      <Sfx name="check" at={at("B06", "تكفي")} />
      <Sfx name="thud" at={at("B07", "وتوجع")} />
      <Sfx name="sparkle" at={at("B08", "بطبقة")} />
      <Sfx name="ding" at={at("B10", "وصارت")} />
      <Sfx name="whoosh" at={at("B11", "تطير")} />
      <Sfx name="riser" at={at("B13", "والمفاجأة") - 6} />
      <Sfx name="impact" at={at("B13", "ألفين")} />
      <Sfx name="pop" at={at("B14", "تابعنا")} />
    </AbsoluteFill>
  );
};

export const BallStoryThumb: React.FC = () => <Cover />;
