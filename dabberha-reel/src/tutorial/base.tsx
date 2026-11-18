import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansArabic";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadNaskh } from "@remotion/google-fonts/NotoNaskhArabic";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/tutorial-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { db } from "../theme";

export { cue } from "../lib/timing";
export type TutSceneId = "T1-Hook" | "T2-Three" | "T3-Claude" | "T4-Remotion" | "T5-Eleven" | "T6-Prompt" | "T7-CTA";
export const tutTimeline = data as TimelineData;
export const getTutScene = (id: TutSceneId): SceneTiming => findScene(tutTimeline, id);

// Type: clean sans for text, an elegant Naskh for display headlines, mono for code.
export const SANS = loadPlex("normal", { weights: ["400", "500", "600", "700"], subsets: ["arabic", "latin"] }).fontFamily;
export const SERIF = loadNaskh("normal", { weights: ["500", "600", "700"], subsets: ["arabic"] }).fontFamily;
export const MONO = loadMono("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;

// Palette inspired by Claude's warm, quiet look: ivory paper, terracotta, near-black ink.
export const P = {
  paper: "#F5F3EC",
  paper2: "#EDE9DF",
  card: "#FBFAF6",
  border: "#DDD8CB",
  ink: "#1F1E1D",
  ink2: "#5E5D58",
  muted: "#9A978D",
  clay: "#D97757",
  clayDeep: "#B8583A",
  claySoft: "#F2DCD1",
  sage: "#6F8F72",
  term: "#1F1E1D",
};

export const tutGains: Record<string, number> = {
  whoosh: db(-13),
  pop: db(-11),
  boing: db(-11),
  type: db(-12),
  enter: db(-10),
  ding: db(-11),
  sparkle: db(-11),
  impact: db(-7),
  tick: db(-11),
  swish: db(-17),
  riser: db(-13),
  thud: db(-8),
};
export const { Sfx, SceneVoice, Music } = createSound(tutTimeline, "audio/tutorial", tutGains);

export const usePop = (at: number, stiffness = 170, damping = 16, mass = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness, mass } });
};

/** Ivory paper with a very slow warm light drift and a faint dotted grid. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 14;
  return (
    <AbsoluteFill style={{ background: P.paper, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 540 + Math.sin(t / 5) * 260 - 520, top: 300 + Math.cos(t / 6) * 160 - 520, width: 1040, height: 1040, borderRadius: "50%", background: "radial-gradient(circle, rgba(217,119,87,0.16) 0%, rgba(217,119,87,0) 65%)" }} />
      <div style={{ position: "absolute", left: 540 + Math.cos(t / 7) * 300 - 560, top: 1500 + Math.sin(t / 5) * 140 - 560, width: 1120, height: 1120, borderRadius: "50%", background: "radial-gradient(circle, rgba(111,143,114,0.10) 0%, rgba(111,143,114,0) 65%)" }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(31,30,29,0.10) 1.4px, transparent 1.6px)", backgroundSize: "34px 34px", maskImage: "radial-gradient(75% 60% at 50% 45%, #000 30%, transparent 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 50%, transparent 60%, rgba(150,130,100,0.12) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Scene wrapper: quiet fade/rise in, fade out. */
export const Scene: React.FC<{ children: React.ReactNode; intro?: boolean }> = ({ children, intro = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = intro ? interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const outP = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const push = interpolate(frame, [0, durationInFrames], [1, 1.045]);
  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: P.ink, opacity: inP * (0.3 + 0.7 * outP), scale: String(push * (0.94 + 0.06 * inP)), transformOrigin: "50% 45%" }}>
      {children}
      {intro && <Sfx name="whoosh" at={0} />}
    </AbsoluteFill>
  );
};

/** Main text, word by word with the voice; the word being spoken turns terracotta. */
export const Words: React.FC<{ scene: SceneTiming; top: number; size?: number; maxWords?: number; serif?: boolean }> = ({ scene, top, size = 62, maxWords = 6, serif = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of scene.words) {
    cur.push(w);
    if (cur.length >= maxWords || /[،,.؟?!…:]$/.test(w.raw ?? w.text)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  let idx = 0;
  chunks.forEach((c, i) => {
    if (frame >= c[0].start - 3) idx = i;
  });
  const chunk = chunks[idx];
  const punch = spring({ frame: frame - (chunk[0].start - 3), fps, config: { damping: 12, stiffness: 320, mass: 0.5 } });
  return (
    <>
      <div dir="rtl" style={{ position: "absolute", top, left: 80, right: 140, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", columnGap: "0.26em", rowGap: 6, fontFamily: serif ? SERIF : SANS, fontWeight: serif ? 700 : 700, fontSize: size, lineHeight: 1.45, scale: String(1.1 - 0.1 * punch) }}>
        {chunk.map((w, i) => {
          const s = spring({ frame: frame - w.start + 3, fps, config: { damping: 10, stiffness: 340, mass: 0.45 } });
          const on = frame >= w.start - 3;
          const latin = /[A-Za-z]/.test(w.text);
          const active = on && (i === chunk.length - 1 || frame < chunk[i + 1].start);
          return (
            <span key={`${idx}-${i}`} dir={latin ? "ltr" : "rtl"} style={{ position: "relative", display: "inline-block", opacity: on ? Math.min(1, s * 2) : 0, translate: `0px ${(1 - s) * 46}px`, scale: String((0.45 + 0.55 * s) * (active ? 1.12 : 1)), rotate: `${(1 - s) * -9}deg`, color: active ? P.clay : P.ink, fontFamily: latin ? SANS : undefined, unicodeBidi: "isolate" }}>
              {(w.raw ?? w.text).replace(/[«»]/g, "")}
              {active && <span style={{ position: "absolute", left: "8%", right: "8%", bottom: -2, height: 5, borderRadius: 3, background: P.clay, opacity: 0.85 }} />}
            </span>
          );
        })}
      </div>
      {chunks.map((c, i) => (i > 0 ? <Sfx key={i} name="swish" at={c[0].start - 3} gain={0.8} /> : null))}
    </>
  );
};

/** Step number: a large terracotta numeral that bounces in, with a thin ring and a label. */
export const StepNumber: React.FC<{ n: string; at?: number; label: string }> = ({ n, at = 6, label }) => {
  const s = usePop(at, 320, 6, 0.8);
  const ring = usePop(at + 6, 120, 20);
  return (
    <>
    <Sfx name="thud" at={at} />
    <div dir="rtl" style={{ position: "absolute", top: 270, left: 80, right: 140, display: "flex", alignItems: "center", gap: 28 }}>
      <div style={{ position: "relative", width: 170, height: 170, display: "grid", placeItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${P.clay}`, scale: String(0.7 + 0.3 * ring), opacity: ring * 0.6 }} />
        <div style={{ width: 140, height: 140, borderRadius: "50%", background: P.clay, display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 700, fontSize: 92, color: P.paper, scale: String(s), boxShadow: "0 18px 40px rgba(217,119,87,0.35)" }}>{n}</div>
      </div>
      <div style={{ opacity: Math.min(1, s), translate: `${(1 - s) * -30}px 0px` }}>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: P.muted, letterSpacing: 1 }}>{label}</div>
        <div style={{ width: 70, height: 3, borderRadius: 2, background: P.clay, marginTop: 10 }} />
      </div>
    </div>
    </>
  );
};

/** Paper card used for the illustrations. */
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; dark?: boolean }> = ({ children, style, dark }) => (
  <div style={{ borderRadius: 26, background: dark ? P.term : P.card, border: `1.5px solid ${dark ? "#2E2D2B" : P.border}`, boxShadow: "0 24px 60px rgba(60,45,30,0.12), 0 2px 6px rgba(60,45,30,0.06)", ...style }}>{children}</div>
);
