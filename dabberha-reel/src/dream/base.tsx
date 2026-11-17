import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/dream-timeline.json";
import script from "../data/dream-script.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData } from "../lib/timing";
import { db, fonts } from "../theme";

export { cue, cueEnd } from "../lib/timing";
export type { SceneTiming } from "../lib/timing";

export type DreamSceneId = "C1-Dawn" | "C2-Dream" | "C3-Papers" | "C4-Friend" | "C5-Montage" | "C6-FirstOrder" | "C7-Blessing" | "C8-Brand";
export const dreamTimeline = data as TimelineData;
export const getDreamScene = (id: DreamSceneId): SceneTiming => findScene(dreamTimeline, id);
export const speakerOf = (id: DreamSceneId) => (script.scenes.find((s) => s.id === id) as { speaker?: string } | undefined)?.speaker ?? "son";

// Golden-hour Saudi palette
export const gold = {
  ink: "#0B0705",
  deep: "#140B07",
  ember: "#3A1C10",
  rust: "#8A3B1A",
  amber: "#E07A2E",
  sun: "#FFC873",
  cream: "#FFF1D6",
  rim: "#FFB45A",
  night: "#060B16",
  nightBlue: "#10213D",
  teal: "#2BC4C4",
  coffee: "#4A2A18",
} as const;

export const dreamGains: Record<string, number> = {
  whoosh: db(-14),
  notify: db(-12),
  impact: db(-7),
  wind: db(-14),
  pour: db(-9),
  beans: db(-11),
  storm: db(-12),
  bell: db(-10),
  swell: db(-10),
  page: db(-10),
};
export const { Sfx, SceneVoice, Music } = createSound(dreamTimeline, "audio/dream", dreamGains);

export const PIC_TOP = 250;
export const PIC_BOTTOM = 1520;

/** Cinematic frame: black letterbox bars outside the Reels safe zone, grade, grain, vignette. */
export const Frame: React.FC<{ children: React.ReactNode; fadeIn?: number; fadeOut?: number; warm?: number }> = ({ children, fadeIn = 8, fadeOut = 8, warm = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const black = Math.max(
    fadeIn > 0 ? interpolate(frame, [0, fadeIn], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0,
    fadeOut > 0 ? interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0,
  );
  const seed = Math.floor(frame / 2) % 47;
  return (
    <AbsoluteFill style={{ background: gold.ink, overflow: "hidden" }}>
      <AbsoluteFill>{children}</AbsoluteFill>
      {/* warm teal-orange grade */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,60,80,${0.12 * warm}) 0%, transparent 45%, rgba(255,140,40,${0.12 * warm}) 100%)`, mixBlendMode: "soft-light", pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "radial-gradient(100% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay", pointerEvents: "none" }}>
        <filter id={`dgrain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#dgrain-${seed})`} />
      </svg>
      <AbsoluteFill style={{ background: "#000", opacity: black, pointerEvents: "none" }} />
      {/* letterbox */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: PIC_TOP, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: PIC_BOTTOM, bottom: 0, background: "#000" }} />
    </AbsoluteFill>
  );
};

/** Saudi man in profile (facing right): ghutra draping down the back, agal, thobe. Rim-lit silhouette. */
export const Man: React.FC<{
  kind?: "son" | "father" | "friend";
  height: number;
  flip?: boolean;
  rim?: string;
  fill?: string;
  style?: React.CSSProperties;
  headTilt?: number;
}> = ({ kind = "son", height, flip, rim = gold.rim, fill = "#0D0806", style, headTilt = 0 }) => {
  const w = (height * 320) / 900;
  const id = `rim-${kind}-${flip ? 1 : 0}-${rim.replace("#", "")}`;
  const father = kind === "father";
  // beard and cloak are fuller for the father
  const beard = father ? "L242 200 Q238 226 222 236 L208 240" : "L240 192 Q236 208 222 214 L210 222";
  const front = father ? "L246 360 L262 880" : "L232 360 L236 880";
  const back = father ? "L64 880 L70 400" : "L96 880 L88 400";
  // closed outline (single path, clockwise)
  const outline = `M170 38 Q226 44 236 98 L232 108 L238 124 L242 132 L254 151 L242 158 L245 166 L240 172 L244 180 ${beard} L214 252 Q224 280 232 300 ${front} ${father ? "L60 880" : "L92 880"} ${back} L92 338 Q82 300 84 250 Q88 150 104 92 Q118 42 170 38 Z`;
  return (
    <svg width={w} height={height} viewBox="0 0 320 900" style={{ overflow: "visible", scale: flip ? "-1 1" : undefined, ...style }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor={rim} stopOpacity="0.95" />
          <stop offset="0.45" stopColor={rim} stopOpacity="0.15" />
          <stop offset="1" stopColor={rim} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <g transform={`rotate(${headTilt} 170 140)`}>
        <path d={outline} fill={fill} stroke={`url(#${id})`} strokeWidth={5} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${rim}88)` }} />
        {/* agal: two bands catching the light */}
        <path d="M112 78 Q170 58 230 76" fill="none" stroke={rim} strokeOpacity={0.55} strokeWidth={5} strokeLinecap="round" />
        <path d="M110 92 Q170 72 232 90" fill="none" stroke={rim} strokeOpacity={0.4} strokeWidth={4} strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** Dawn sky with a rising sun and lens flare. `rise` 0..1 */
export const DawnSky: React.FC<{ rise: number; horizon?: number }> = ({ rise, horizon = 1080 }) => {
  const sunY = horizon - 40 - rise * 260;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${gold.deep} 0%, ${gold.ember} 30%, ${gold.rust} 55%, ${gold.amber} 75%, ${gold.sun} 92%)` }} />
      <div style={{ position: "absolute", left: 540 - 170, top: sunY - 170, width: 340, height: 340, borderRadius: "50%", background: `radial-gradient(circle, #FFF6E0 0%, ${gold.sun} 40%, rgba(255,200,115,0) 70%)` }} />
      <div style={{ position: "absolute", left: 540 - 700, top: sunY - 700, width: 1400, height: 1400, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,214,140,${0.35 + rise * 0.25}) 0%, transparent 60%)` }} />
      {/* anamorphic streak */}
      <div style={{ position: "absolute", left: -200, right: -200, top: sunY - 4, height: 8, background: "linear-gradient(90deg, transparent, rgba(255,230,180,0.75), transparent)", filter: "blur(2px)", opacity: 0.6 + rise * 0.4 }} />
    </AbsoluteFill>
  );
};

/** Layered dunes (parallax by `shift`). */
export const Dunes: React.FC<{ shift?: number; top?: number; tint?: number }> = ({ shift = 0, top = 1000, tint = 1 }) => (
  <svg width="1080" height="920" viewBox="0 0 1080 920" style={{ position: "absolute", left: 0, top }}>
    <path d={`M${-200 + shift * 0.3} 140 Q 200 40 520 120 T 1300 90 L1300 920 L-200 920 Z`} fill={`rgba(90,38,18,${0.9 * tint})`} />
    <path d={`M${-200 + shift * 0.6} 240 Q 300 120 640 220 T 1400 200 L1400 920 L-200 920 Z`} fill={`rgba(48,20,10,${tint})`} />
    <path d={`M${-200 + shift} 360 Q 360 250 760 340 T 1500 330 L1500 920 L-200 920 Z`} fill="#160A05" />
  </svg>
);

/** Drifting dust in the light. */
export const Dust: React.FC<{ color?: string; count?: number; area?: [number, number] }> = ({ color = "255,210,150", count = 40, area = [PIC_TOP, PIC_BOTTOM] }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = 2 + random(`ds${i}`) * 5;
        const x = (random(`dx${i}`) * 1080 + frame * (0.3 + random(`dv${i}`) * 0.9)) % 1080;
        const y = area[0] + ((random(`dy${i}`) * (area[1] - area[0]) + Math.sin((frame + i * 30) / 40) * 20) % (area[1] - area[0]));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s, background: `rgba(${color},${0.25 + random(`do${i}`) * 0.5})`, filter: s > 5 ? "blur(1px)" : undefined }} />;
      })}
    </AbsoluteFill>
  );
};

/** Warm light leak sweeping across (for montage cuts). */
export const LightLeak: React.FC<{ at: number; len?: number }> = ({ at, len = 16 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at - len / 2, at, at + len / 2], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (p <= 0) return null;
  return <AbsoluteFill style={{ background: `radial-gradient(70% 50% at ${30 + (frame - at) * 3}% 40%, rgba(255,190,110,${0.85 * p}) 0%, rgba(255,120,40,${0.4 * p}) 40%, transparent 75%)`, mixBlendMode: "screen", pointerEvents: "none" }} />;
};

/** Film subtitles; the father's lines in warm gold, the son's in white. */
export const Subs: React.FC<{ scene: SceneTiming; speaker: string; top?: number }> = ({ scene, speaker, top = 1390 }) => {
  const frame = useCurrentFrame();
  const groups: { start: number; end: number; words: typeof scene.words }[] = [];
  let cur: typeof scene.words = [];
  scene.words.forEach((w, i) => {
    cur.push(w);
    if (/[…،,.؟?!:]$/.test(w.raw ?? w.text) || cur.length >= 6 || i === scene.words.length - 1) {
      groups.push({ start: cur[0].start, end: cur[cur.length - 1].end, words: cur });
      cur = [];
    }
  });
  const gi = groups.findIndex((g, i) => frame >= g.start - 2 && (groups[i + 1] ? frame < groups[i + 1].start - 2 : frame < g.end + 24));
  if (gi < 0) return null;
  const g = groups[gi];
  const op = interpolate(frame, [g.start - 2, g.start + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const color = speaker === "father" ? "#FFD79A" : "#FFFFFF";
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top, display: "flex", justifyContent: "center", opacity: op }}>
      <div dir="rtl" lang="ar" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.26em", fontFamily: fonts.text, fontWeight: 600, fontSize: 48, lineHeight: 1.4, color, textShadow: "0 2px 6px rgba(0,0,0,0.95), 0 0 22px rgba(0,0,0,0.8)" }}>
        {speaker === "father" && <span style={{ opacity: 0.7, fontSize: 38, marginLeft: 8 }}>الأب:</span>}
        {g.words.map((w, i) => (
          <span key={i} style={{ opacity: frame >= w.start ? 1 : 0.35 }}>
            {(w.raw ?? w.text).replace(/[«»]/g, "")}
          </span>
        ))}
      </div>
    </div>
  );
};
