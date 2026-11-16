import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/folder-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData } from "../lib/timing";
import { db, fonts } from "../theme";

export { cue, cueEnd } from "../lib/timing";
export type { SceneTiming } from "../lib/timing";

export type FolderSceneId = "F1-Hook" | "F2-Career" | "F3-Tired" | "F4-Retire" | "F5-Phone" | "F6-Trust" | "F7-CTA";
export const folderTimeline = data as TimelineData;
export const getFolderScene = (id: FolderSceneId): SceneTiming => findScene(folderTimeline, id);

export const film = {
  green: "#2F8F4E", // the classic hanging-folder green
  greenDark: "#1F6B38",
  greenLight: "#49AE66",
  desk: "#5A3B26",
  deskLight: "#7A5236",
  dark: "#0D0B09",
  warm: "#FFC978",
  ink: "#B3261E", // stamp ink
  paper: "#F7F3EA",
};

export const folderGains: Record<string, number> = {
  whoosh: db(-12),
  tick: db(-22),
  pop: db(-14),
  riser: db(-9),
  boom: db(-5),
  slam: db(-4),
  stamp: db(-7),
  lamp: db(-10),
  papers: db(-12),
  confetti: db(-8),
  zoom: db(-9),
  flare: db(-11),
};

export const { Sfx, SceneVoice, Music } = createSound(folderTimeline, "audio/folder", folderGains);

/** Camera shake that decays after `at` (frames). */
export const shake = (frame: number, at: number, strength = 18, decay = 7) => {
  if (frame < at) return { x: 0, y: 0, r: 0 };
  const t = frame - at;
  const k = Math.exp(-t / decay) * strength;
  return { x: Math.sin(t * 2.7) * k, y: Math.cos(t * 3.3) * k * 0.8, r: Math.sin(t * 1.9) * k * 0.04 };
};

/** Film finishing layer: warm/teal grade, vignette, gate weave, grain. */
export const FilmLook: React.FC<{ vignette?: number; grade?: boolean }> = ({ vignette = 0.75, grade = true }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const seed = Math.floor(frame / 2) % 61;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {grade && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, rgba(0,70,90,0.18) 0%, rgba(0,0,0,0) 45%, rgba(255,150,60,0.14) 100%)",
            mixBlendMode: "soft-light",
          }}
        />
      )}
      <AbsoluteFill style={{ background: `radial-gradient(110% 75% at 50% 45%, transparent 50%, rgba(0,0,0,${vignette}) 100%)` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.1, mixBlendMode: "overlay" }}>
        <filter id={`fgrain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#fgrain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Desk-lamp cone with drifting dust motes. */
export const Spotlight: React.FC<{ x?: number; on?: number; color?: string }> = ({ x = 540, on = 1, color = "255,214,150" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: on }}>
      <div
        style={{
          position: "absolute",
          left: x - 700,
          top: -200,
          width: 1400,
          height: 1900,
          background: `conic-gradient(from 180deg at 50% 0%, transparent 150deg, rgba(${color},0.30) 168deg, rgba(${color},0.42) 180deg, rgba(${color},0.30) 192deg, transparent 210deg)`,
          filter: "blur(10px)",
          mixBlendMode: "screen",
        }}
      />
      {/* desk lamp shade + bulb */}
      <div style={{ position: "absolute", left: x - 120, top: 150, width: 240, height: 110, borderRadius: "120px 120px 18px 18px", background: "linear-gradient(180deg, #2B2B2B, #111)", boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: x - 6, top: 0, width: 12, height: 152, background: "#1A1A1A" }} />
      <div style={{ position: "absolute", left: x - 70, top: 246, width: 140, height: 34, borderRadius: "0 0 70px 70px", background: `rgba(${color},1)`, boxShadow: `0 0 60px 20px rgba(${color},0.55)` }} />
      {Array.from({ length: 46 }).map((_, i) => {
        const px = x + (random(`dx${i}`) - 0.5) * 520 * (0.4 + random(`dy${i}`));
        const py = ((random(`dy${i}`) * 1500 + frame * (0.4 + random(`ds${i}`) * 0.8)) % 1500) + 150;
        const s = 2 + random(`dz${i}`) * 5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px + Math.sin((frame + i * 20) / 30) * 14,
              top: py,
              width: s,
              height: s,
              borderRadius: s,
              background: `rgba(${color},${0.35 + random(`do${i}`) * 0.5})`,
              filter: s > 5 ? "blur(1.5px)" : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Cinematic subtitles: white, soft shadow, word-synced (no box — film style). */
export const FilmSubs: React.FC<{ scene: SceneTiming; top?: number; hideAfter?: number }> = ({ scene, top = 1350, hideAfter }) => {
  const frame = useCurrentFrame();
  const words = scene.words;
  const groups: { start: number; end: number; words: typeof words }[] = [];
  let cur: typeof words = [];
  words.forEach((w, i) => {
    cur.push(w);
    if (/[…،,.؟?!:]$/.test(w.raw ?? w.text) || cur.length >= 6 || i === words.length - 1) {
      groups.push({ start: cur[0].start, end: cur[cur.length - 1].end, words: cur });
      cur = [];
    }
  });
  const gi = groups.findIndex((g, i) => frame >= g.start - 2 && (groups[i + 1] ? frame < groups[i + 1].start - 2 : frame < g.end + 20));
  if (gi < 0 || (hideAfter !== undefined && frame >= hideAfter)) return null;
  const g = groups[gi];
  const op = interpolate(frame, [g.start - 2, g.start + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top, display: "flex", justifyContent: "center", opacity: op }}>
      <div
        dir="rtl"
        lang="ar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: "0.26em",
          fontFamily: fonts.text,
          fontWeight: 600,
          fontSize: 52,
          lineHeight: 1.35,
          color: "#fff",
          textShadow: "0 2px 4px rgba(0,0,0,0.9), 0 0 24px rgba(0,0,0,0.7)",
        }}
      >
        {g.words.map((w, i) => (
          <span key={i} style={{ opacity: frame >= w.start ? 1 : 0.35, color: frame >= w.start && frame < w.end + 2 ? "#FFE3A3" : "#fff" }}>
            {(w.raw ?? w.text).replace(/[«»]/g, "")}
          </span>
        ))}
      </div>
    </div>
  );
};
