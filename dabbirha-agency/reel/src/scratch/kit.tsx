import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansArabic";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { createSound } from "../components/Sound";
import { cue, findScene, type TimelineData, type Word } from "../lib/timing";
import { db } from "../theme";

/**
 * Shared kit for the «من الصفر» story format: one persistent stage that keeps building,
 * a red jolt on every «بس…» problem, a name chip on every «هذا…» fix, big word-by-word
 * captions on top, the دبّرها pill, and an end card with the logo.
 */
export const SANS = loadPlex("normal", { weights: ["500", "600", "700"], subsets: ["arabic", "latin"] }).fontFamily;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
const AR = "٠١٢٣٤٥٦٧٨٩";
export const ar = (n: number | string) => String(n).replace(/\d/g, (d) => AR[Number(d)]);

export const gains: Record<string, number> = {
  whoosh: db(-14),
  pop: db(-12),
  boing: db(-12),
  ding: db(-12),
  sparkle: db(-12),
  impact: db(-9),
  tick: db(-14),
  swish: db(-16),
  riser: db(-13),
  thud: db(-10),
  glitch: db(-14),
  check: db(-12),
  level: db(-12),
  type: db(-14),
  enter: db(-12),
};

export const makeStory = (timeline: TimelineData, dir: string) => {
  const { Sfx, SceneVoice } = createSound(timeline, dir, gains);
  const S = (id: string) => findScene(timeline, id);
  /** Absolute frame of a spoken word. */
  const at = (id: string, word: string, nth = 0) => {
    const s = S(id);
    return s.from + cue(s, word, nth);
  };
  const start = (id: string) => S(id).from;
  const end = (id: string) => {
    const s = S(id);
    return s.from + s.durationInFrames;
  };
  return { Sfx, SceneVoice, S, at, start, end };
};

export const usePop = (at: number, stiffness = 190, damping = 14, mass = 0.7) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping, stiffness, mass } });
};
export const pop = (f: number, at: number, fps = 30, stiffness = 190, damping = 13) =>
  spring({ frame: f - at, fps, config: { damping, stiffness, mass: 0.7 } });

/** All the voice clips, each placed at its scene. */
export const Voices: React.FC<{ timeline: TimelineData; SceneVoice: React.FC<{ scene: TimelineData["scenes"][number] }> }> = ({ timeline, SceneVoice }) => (
  <>
    {timeline.scenes.map((s) => (
      <Sequence key={s.id} name={`VO ${s.id}`} from={s.from} durationInFrames={s.durationInFrames}>
        <SceneVoice scene={s} />
      </Sequence>
    ))}
  </>
);

export const MusicBed: React.FC<{ timeline: TimelineData; src: string }> = ({ timeline, src }) =>
  timeline.audio.music ? (
    <Audio
      src={staticFile(src)}
      loop
      volume={(f) => {
        const end = timeline.durationInFrames;
        const inVoice = timeline.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 4);
        const fd = interpolate(f, [0, 6, end - 40, end], [0, 1, 1, 0], clamp);
        return (inVoice ? db(-25) : db(-19)) * fd;
      }}
    />
  ) : null;

/** Big word-by-word captions near the top (3–4 words at a time, the spoken word in yellow). */
export const Captions: React.FC<{ timeline: TimelineData; top?: number; hideFrom?: number; hideTo?: number }> = ({ timeline, top = 250, hideFrom, hideTo }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f === 0) return null;
  if (hideFrom !== undefined && hideTo !== undefined && f >= hideFrom && f < hideTo) return null;
  const all: Word[] = timeline.scenes.flatMap((s) => s.words.map((w) => ({ ...w, start: w.start + s.from, end: w.end + s.from })));
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of all) {
    cur.push(w);
    if (cur.length >= 3 || /[،,.؟?!…:]$/.test(w.raw ?? w.text)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  let idx = -1;
  chunks.forEach((c, i) => {
    if (f >= c[0].start - 2) idx = i;
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const last = chunk[chunk.length - 1];
  if (f > last.end + 24) return null;
  const p = spring({ frame: f - (chunk[0].start - 2), fps, config: { damping: 12, stiffness: 320, mass: 0.5 } });
  return (
    <div dir="rtl" style={{ position: "absolute", top, left: 70, right: 70, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.28em", fontFamily: SANS, fontWeight: 700, fontSize: 92, lineHeight: 1.25, scale: String(0.85 + 0.15 * p), opacity: Math.min(1, p * 1.5) }}>
      {chunk.map((w, i) => {
        const on = f >= w.start - 2;
        const active = on && (i === chunk.length - 1 || f < chunk[i + 1].start - 2);
        return (
          <span key={`${idx}-${i}`} style={{ color: active ? "#FFD23F" : "#fff", WebkitTextStroke: "3px rgba(0,0,0,0.85)", paintOrder: "stroke fill", textShadow: "0 6px 0 rgba(0,0,0,0.35)", opacity: on ? 1 : 0.55 }}>
            {(w.raw ?? w.text).replace(/[«»…]/g, "").replace(/[.،,]$/, "")}
          </span>
        );
      })}
    </div>
  );
};

/** The دبّرها pill at the very top. */
export const BrandPill: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 26px 12px", borderRadius: 40, background: dark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.82)", fontFamily: SANS, fontWeight: 700, fontSize: 36, color: dark ? "#fff" : "#2A1C10", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
      <Img src={staticFile(dark ? "brand/logo-white.png" : "brand/logo-color.png")} style={{ height: 40 }} />
      دبّرها
    </div>
  </div>
);

/** Red jolt at the start of a «بس…» beat: vignette + shake offset. */
export const jolt = (f: number, at: number) => {
  const k = interpolate(f, [at - 2, at + 2, at + 18], [0, 1, 0], clamp);
  const sx = Math.sin(f * 2.7) * 14 * k;
  const sy = Math.cos(f * 3.3) * 10 * k;
  return { k, sx, sy };
};
export const RedVignette: React.FC<{ k: number }> = ({ k }) =>
  k > 0.01 ? <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(90% 70% at 50% 50%, transparent 45%, rgba(220,20,40,${0.55 * k}) 100%)` }} /> : null;

/** The name chip under the stage: «هذا تمليح». */
export const NameChip: React.FC<{ text: string; at: number; until: number; top?: number; color?: string }> = ({ text, at, until, top = 1530, color = "#1E8E5A" }) => {
  const f = useCurrentFrame();
  if (f < at - 1 || f > until) return null;
  const p = pop(f, at, 30, 260, 12);
  const out = interpolate(f, [until - 8, until], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: out }}>
      <div dir="rtl" style={{ padding: "10px 44px 20px", borderRadius: 26, background: color, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 70, boxShadow: "0 14px 40px rgba(0,0,0,0.3)", scale: String(0.6 + 0.4 * p), rotate: `${(1 - p) * -6}deg` }}>
        {text}
      </div>
    </div>
  );
};

/** A row of small icons of the steps already solved (fills from the right). */
export const HistoryRow: React.FC<{ items: { at: number; node: React.ReactNode; label: string }[]; top?: number; dark?: boolean }> = ({ items, top = 560, dark }) => {
  const f = useCurrentFrame();
  const shown = items.filter((i) => f >= i.at);
  if (!shown.length) return null;
  return (
    <div dir="rtl" style={{ position: "absolute", top, left: 60, right: 60, display: "flex", justifyContent: "center", gap: 18 }}>
      {shown.map((i, k) => {
        const p = pop(f, i.at, 30, 220, 14);
        return (
          <div key={k} style={{ width: 132, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, scale: String(p), opacity: Math.min(1, p * 1.4) }}>
            <div style={{ width: 104, height: 104, borderRadius: 26, background: dark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.75)", border: `2px solid ${dark ? "rgba(255,255,255,0.25)" : "rgba(60,40,20,0.18)"}`, display: "grid", placeItems: "center" }}>
              {i.node}
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: dark ? "#fff" : "#3A2A1A" }}>{i.label}</div>
          </div>
        );
      })}
    </div>
  );
};

/** End card: logo, «ودبّرتها», follow button. */
export const EndCard: React.FC<{ from: number; tFollow: number; until: number; line: string }> = ({ from, tFollow, until, line }) => {
  const f = useCurrentFrame();
  if (f < from || f >= until) return null;
  const bg = ease(f, from, from + 10);
  const logo = pop(f, from + 2, 30, 160, 12);
  const btn = pop(f, tFollow - 2, 30, 240, 11);
  const out = interpolate(f, [until - 10, until], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ background: `rgba(20,14,8,${0.82 * bg})` }} />
      {Array.from({ length: 26 }).map((_, i) => {
        const t = f - from;
        const a = random(`c${i}`) * Math.PI * 2;
        const v = 6 + random(`v${i}`) * 12;
        const d = v * t * Math.exp(-t / 36);
        const c = ["#FFD23F", "#fff", "#2BB673", "#F26B3A"][i % 4];
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * d - 6, top: 760 + Math.sin(a) * d - 6 + t * 1.2, width: 12, height: 12, borderRadius: 3, background: c, rotate: `${t * 9 + i * 40}deg`, opacity: interpolate(t, [0, 40, 70], [1, 1, 0], clamp) }} />;
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ width: 400, height: 400, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", scale: String(logo), boxShadow: "0 30px 80px rgba(0,0,0,0.45)" }}>
          <Img src={staticFile("brand/logo-color.png")} style={{ width: 330 }} />
        </div>
        <div dir="rtl" style={{ fontFamily: SANS, fontWeight: 700, fontSize: 110, color: "#FFD23F", opacity: logo, WebkitTextStroke: "3px rgba(0,0,0,0.6)", paintOrder: "stroke fill" }}>
          ودبّرتها
        </div>
        <div dir="rtl" style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "#fff", opacity: logo }}>
          {line}
        </div>
        <div dir="rtl" style={{ marginTop: 30, padding: "14px 60px 26px", borderRadius: 60, background: "#FE2C55", color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 64, scale: String(btn * (1 + 0.04 * Math.sin(f / 5))), opacity: Math.min(1, btn * 1.4), boxShadow: "0 18px 50px rgba(254,44,85,0.5)" }}>
          + تابع دبّرها
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** A follow button only (no logo) that pops in at the end. */
export const FollowButton: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at - 2) return null;
  const p = pop(f, at, 30, 240, 11);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1560, display: "flex", justifyContent: "center" }}>
      <div dir="rtl" style={{ padding: "14px 70px 26px", borderRadius: 60, background: "#FE2C55", color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 70, scale: String(p * (1 + 0.04 * Math.sin(f / 5))), opacity: Math.min(1, p * 1.4), boxShadow: "0 18px 50px rgba(254,44,85,0.5)" }}>
        + تابعنا
      </div>
    </div>
  );
};
