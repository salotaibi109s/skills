import React from "react";
import { AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/motion-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { db, fonts } from "../theme";

export { cue, cueEnd } from "../lib/timing";
export type MotionSceneId = "M1-Hook" | "M2-Twist" | "M3-Cafe" | "M4-Explain" | "M5-Brand" | "M6-Store" | "M7-Reveal" | "M8-CTA";
export const motionTimeline = data as TimelineData;
export const getMotionScene = (id: MotionSceneId): SceneTiming => findScene(motionTimeline, id);

export const display: React.CSSProperties = { fontFamily: fonts.display, fontWeight: 800 };
export const text: React.CSSProperties = { fontFamily: fonts.text };

export const motionGains: Record<string, number> = {
  sadtap: db(-8),
  shatter: db(-8),
  steam: db(-12),
  beans: db(-11),
  sweep: db(-11),
  box: db(-9),
  pop: db(-12),
  whoosh: db(-14),
  impact: db(-7),
  rewind: db(-10),
  clicks: db(-11),
};
export const { Sfx, SceneVoice, Music } = createSound(motionTimeline, "audio/motion", motionGains);

export const usePop = (at: number, stiffness = 220, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness, mass: 0.6 } });
};

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

/** Dark studio backdrop with a faint grid. */
export const Studio: React.FC<{ color?: string; grid?: string }> = ({ color = "#0E0F14", grid = "rgba(255,255,255,0.04)" }) => (
  <AbsoluteFill style={{ background: color }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${grid} 2px, transparent 2px), linear-gradient(90deg, ${grid} 2px, transparent 2px)`, backgroundSize: "80px 80px" }} />
  </AbsoluteFill>
);

/** «مثال توضيحي» tag: the café / brand / store in the demos are fictional. */
export const DemoTag: React.FC<{ name: string; dark?: boolean }> = ({ name, dark = true }) => (
  <div dir="rtl" style={{ position: "absolute", top: 230, left: 80, display: "flex", alignItems: "center", gap: 12, padding: "8px 22px 12px", borderRadius: 999, background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)", ...text, fontWeight: 700, fontSize: 28, color: dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.6)" }}>
    <span style={{ width: 12, height: 12, borderRadius: 6, background: "#FF4D4D" }} />
    {name} · مثال توضيحي
  </div>
);

const chunkWords = (words: Word[]) => {
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= 5 || /[…:،؟.!]$/.test(w.raw ?? w.text)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  return chunks;
};

/** Burned-in subtitles: one phrase at a time, the spoken word lit up. */
export const Subtitle: React.FC<{ scene: SceneTiming; accent?: string; top?: number }> = ({ scene, accent = "#FFC94D", top = 1310 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = chunkWords(scene.words);
  let idx = -1;
  chunks.forEach((c, i) => {
    if (frame >= c[0].start - 2) idx = i;
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const enter = spring({ frame: frame - (chunk[0].start - 2), fps, config: { damping: 16, stiffness: 240 } });
  return (
    <div style={{ position: "absolute", top, left: 70, right: 130, display: "flex", justifyContent: "center" }}>
      <div dir="rtl" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.28em", padding: "12px 30px 20px", borderRadius: 28, background: "rgba(8,9,14,0.62)", backdropFilter: "blur(6px)", ...display, fontSize: 56, lineHeight: 1.3, color: "#fff", translate: `0px ${(1 - enter) * 20}px`, opacity: Math.min(1, enter * 2) }}>
        {chunk.map((w, i) => {
          const on = frame >= w.start;
          const active = on && (i === chunk.length - 1 || frame < chunk[i + 1].start);
          return (
            <span key={i} style={{ color: active ? accent : "#fff", opacity: on ? 1 : 0.4 }}>
              {(w.raw ?? w.text).replace(/[«»]/g, "")}
            </span>
          );
        })}
      </div>
    </div>
  );
};
