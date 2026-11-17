import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/viral-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { colors, db, fonts } from "../theme";

export { cue, cueEnd } from "../lib/timing";
export type ViralSceneId = "V1-Hook" | "V2-Promise" | "V3-One" | "V4-Two" | "V5-Three" | "V6-Save";
export const viralTimeline = data as TimelineData;
export const getViralScene = (id: ViralSceneId): SceneTiming => findScene(viralTimeline, id);

// Same editorial palette as carousel v2 so the account looks consistent.
export const C = {
  cream: "#F6F1E7",
  paper: "#FFFDF8",
  ink: "#0D2447",
  gold: "#E3A63A",
  goldDeep: "#B87A14",
  teal: colors.teal,
  blue: colors.primary,
  muted: "#6B7A90",
  red: "#D9534F",
  green: "#17A34A",
};
export const display: React.CSSProperties = { fontFamily: fonts.display, fontWeight: 800 };
export const text: React.CSSProperties = { fontFamily: fonts.text };

// TikTok safe zone: top 150, bottom 1440, left 60, right 960.
export const SAFE = { top: 150, bottom: 1440, left: 60, right: 960 };

export const viralGains: Record<string, number> = {
  print: db(-10),
  stamp: db(-8),
  whoosh: db(-15),
  pop: db(-12),
  check: db(-11),
  type: db(-13),
  ding: db(-10),
  riser: db(-13),
  pen: db(-12),
};
export const { Sfx, SceneVoice, Music } = createSound(viralTimeline, "audio/viral", viralGains);

export const Paper: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <AbsoluteFill style={{ background: dark ? C.ink : C.cream }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${dark ? "rgba(255,255,255,0.06)" : "rgba(13,36,71,0.06)"} 1.6px, transparent 2px)`, backgroundSize: "18px 18px" }} />
  </AbsoluteFill>
);

export const useShake = (hits: number[], amp = 12, len = 7) => {
  const frame = useCurrentFrame();
  let x = 0;
  let y = 0;
  for (const h of hits) {
    const t = frame - h;
    if (t < 0 || t > len) continue;
    const k = amp * (1 - t / len);
    x += (random(`x${h}${t}`) - 0.5) * 2 * k;
    y += (random(`y${h}${t}`) - 0.5) * 2 * k;
  }
  return `${x}px ${y}px`;
};

export const usePop = (at: number, stiff = 220) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping: 11, stiffness: stiff, mass: 0.6 } });
};

/** Static headline at the top: the line a muted viewer reads first. */
export const Headline: React.FC<{ children: React.ReactNode; dark?: boolean; at?: number; size?: number }> = ({ children, dark, at = 0, size = 76 }) => {
  const frame = useCurrentFrame();
  const pop = usePop(at);
  const p = at === 0 ? 1 : pop; // a headline at frame 0 must be fully visible on the paused first frame
  if (frame < at) return null;
  return (
    <div dir="rtl" style={{ position: "absolute", top: 210, left: SAFE.left + 20, right: 1080 - SAFE.right + 20, display: "flex", justifyContent: "center" }}>
      <div style={{ ...display, fontSize: size, lineHeight: 1.15, textAlign: "center", color: dark ? "#fff" : C.ink, scale: String(0.85 + 0.15 * p), opacity: Math.min(1, p * 2) }}>{children}</div>
    </div>
  );
};

/** Karaoke captions: phrase chunks, current word highlighted in gold. */
const chunkWords = (words: Word[]) => {
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    const raw = w.raw ?? w.text;
    if (cur.length >= 4 || /[…:،؟.!]$/.test(raw)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  return chunks;
};

export const Karaoke: React.FC<{ scene: SceneTiming; dark?: boolean; top?: number }> = ({ scene, dark, top = 1230 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = chunkWords(scene.words);
  let idx = -1;
  chunks.forEach((c, i) => {
    if (frame >= c[0].start - 2) idx = i;
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const enter = spring({ frame: frame - (chunk[0].start - 2), fps, config: { damping: 14, stiffness: 240 } });
  return (
    <div dir="rtl" style={{ position: "absolute", top, left: SAFE.left + 10, right: 1080 - SAFE.right + 10, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.25em", rowGap: 6, ...display, fontSize: 70, lineHeight: 1.25, translate: `0px ${(1 - enter) * 24}px`, opacity: Math.min(1, enter * 2) }}>
      {chunk.map((w, i) => {
        const on = frame >= w.start;
        const active = on && (i === chunk.length - 1 ? true : frame < chunk[i + 1].start);
        return (
          <span key={i} style={{ display: "inline-block", padding: "0 14px 8px", borderRadius: 18, background: active ? C.gold : "transparent", color: active ? C.ink : dark ? "#fff" : C.ink, opacity: on ? 1 : 0.35, scale: active ? "1.06" : "1" }}>
            {(w.raw ?? w.text).replace(/[«»]/g, "")}
          </span>
        );
      })}
    </div>
  );
};

/** Quick slide-in on every cut so each shot starts with motion (pattern reset). */
export const CutIn: React.FC<{ children: React.ReactNode; from?: "left" | "right" | "zoom" }> = ({ children, from = "zoom" }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 7], [0, 1], { extrapolateRight: "clamp" });
  const e = 1 - Math.pow(1 - t, 3);
  const style: React.CSSProperties = from === "zoom" ? { scale: String(1.12 - 0.12 * e) } : { translate: `${(from === "left" ? -1 : 1) * (1 - e) * 160}px 0px` };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
