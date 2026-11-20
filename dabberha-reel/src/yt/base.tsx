import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansArabic";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadNaskh } from "@remotion/google-fonts/NotoNaskhArabic";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/yt-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { tutGains } from "../tutorial/base";

export { cue } from "../lib/timing";

export type YSceneId = "Y1-Hook" | "Y1b-Plan" | "Y2-Niche" | "Y3-Viral" | "Y4-Algo" | "Y5-Prod" | "Y6-Money" | "Y7-Data" | "Y8-Truth" | "Y9-CTA";
export const yTimeline = data as TimelineData;
export const getY = (id: YSceneId): SceneTiming => findScene(yTimeline, id);
export const { Sfx, SceneVoice } = createSound(yTimeline, "audio/yt", tutGains);

export const SANS = loadPlex("normal", { weights: ["400", "500", "600", "700"], subsets: ["arabic", "latin"] }).fontFamily;
export const SERIF = loadNaskh("normal", { weights: ["500", "600", "700"], subsets: ["arabic"] }).fontFamily;
export const MONO = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;

/**
 * Dark video-platform look (no logos): near-black, charcoal cards, white text, a strong red accent.
 * Key names match the tutorial palette so the scenes read the same.
 */
export const P = {
  paper: "#0F0F0F",
  paper2: "#272727",
  card: "#1B1B1B",
  border: "#383838",
  ink: "#F1F1F1",
  ink2: "#AAAAAA",
  muted: "#7E7E7E",
  clay: "#FF0033",
  clayDeep: "#FF5470",
  claySoft: "rgba(255,0,51,0.16)",
  sage: "#2BA640",
  term: "#0F0F0F",
};

export const usePop = (at: number, stiffness = 170, damping = 16, mass = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness, mass } });
};

/** Near-black studio with a slow red glow and faint thumbnails drifting in the dark. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 14;
  return (
    <AbsoluteFill style={{ background: P.paper, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 540 + Math.sin(t / 5) * 260 - 560, top: 380 + Math.cos(t / 6) * 160 - 560, width: 1120, height: 1120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,0,51,0.16) 0%, rgba(255,0,51,0) 65%)" }} />
      <div style={{ position: "absolute", left: 540 + Math.cos(t / 7) * 300 - 600, top: 1500 + Math.sin(t / 5) * 140 - 600, width: 1200, height: 1200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 65%)" }} />
      {Array.from({ length: 12 }).map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const y = ((row * 520 - frame * 0.6) % 2080) - 200;
        return <div key={i} style={{ position: "absolute", left: 40 + col * 350, top: y, width: 300, height: 170, borderRadius: 14, border: "1.5px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }} />;
      })}
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Scene: React.FC<{ children: React.ReactNode; intro?: boolean }> = ({ children, intro = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = intro ? interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const outP = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const push = interpolate(frame, [0, durationInFrames], [1, 1.04]);
  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: P.ink, opacity: inP * (0.3 + 0.7 * outP), scale: String(push * (0.94 + 0.06 * inP)), transformOrigin: "50% 45%" }}>
      {children}
      {intro && <Sfx name="whoosh" at={0} />}
    </AbsoluteFill>
  );
};

/** Spoken words, a phrase at a time; the word being said turns red with an underline. */
export const Words: React.FC<{ scene: SceneTiming; top: number; size?: number; maxWords?: number }> = ({ scene, top, size = 60, maxWords = 5 }) => {
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
      <div dir="rtl" style={{ position: "absolute", top, left: 80, right: 140, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", columnGap: "0.32em", rowGap: 6, fontFamily: SANS, fontWeight: 700, fontSize: size, lineHeight: 1.45, scale: String(1.08 - 0.08 * punch) }}>
        {chunk.map((w, i) => {
          const s = spring({ frame: frame - w.start + 3, fps, config: { damping: 10, stiffness: 340, mass: 0.45 } });
          const on = frame >= w.start - 3;
          const latin = /[A-Za-z]/.test(w.text);
          const active = on && (i === chunk.length - 1 || frame < chunk[i + 1].start);
          return (
            <span key={`${idx}-${i}`} dir={latin ? "ltr" : "rtl"} style={{ position: "relative", display: "inline-block", opacity: on ? Math.min(1, s * 2) : 0, translate: `0px ${(1 - s) * 40}px`, scale: String((0.5 + 0.5 * s) * (active ? 1.1 : 1)), color: active ? "#fff" : P.ink, unicodeBidi: "isolate", textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
              {active && <span style={{ position: "absolute", left: "-6%", right: "-6%", top: "12%", bottom: "4%", borderRadius: 12, background: P.clay, zIndex: -1 }} />}
              {(w.raw ?? w.text).replace(/[«»]/g, "")}
            </span>
          );
        })}
      </div>
      {chunks.map((c, i) => (i > 0 ? <Sfx key={i} name="swish" at={c[0].start - 3} gain={0.8} /> : null))}
    </>
  );
};

/** Step header styled like a chapter marker: a red play badge with the number and the chapter title. */
export const StepNumber: React.FC<{ n: string; at?: number; label: string }> = ({ n, at = 6, label }) => {
  const s = usePop(at, 320, 9, 0.8);
  return (
    <>
      <Sfx name="thud" at={at} />
      <div dir="rtl" style={{ position: "absolute", top: 260, left: 80, right: 140, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ position: "relative", width: 150, height: 104, borderRadius: 30, background: P.clay, display: "grid", placeItems: "center", scale: String(s), boxShadow: "0 16px 40px rgba(255,0,51,0.35)" }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 70, color: "#fff", lineHeight: 1 }}>{n}</div>
        </div>
        <div style={{ opacity: Math.min(1, s), translate: `${(1 - s) * -30}px 0px` }}>
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, color: P.ink2, letterSpacing: 1 }}>الأمر</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, color: P.ink }}>{label}</div>
        </div>
      </div>
    </>
  );
};

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ borderRadius: 24, background: P.card, border: `1.5px solid ${P.border}`, boxShadow: "0 24px 60px rgba(0,0,0,0.45)", ...style }}>{children}</div>
);

/** A video progress bar across the top, split into chapters (one per scene), with a red fill and a scrubber dot. */
export const ChapterBar: React.FC = () => {
  const frame = useCurrentFrame();
  const total = yTimeline.durationInFrames;
  const scenes = yTimeline.scenes;
  const left = 80;
  const width = 860;
  const x = (f: number) => left + (f / total) * width;
  const now = [...scenes].reverse().find((s) => frame >= s.from) ?? scenes[0];
  const titles: Record<string, string> = {
    "Y1-Hook": "المقدمة",
    "Y1b-Plan": "الخطة الكاملة",
    "Y2-Niche": "اختيار المجال",
    "Y3-Viral": "الفيديوهات المنتشرة",
    "Y4-Algo": "الخوارزمية",
    "Y5-Prod": "نظام الإنتاج",
    "Y6-Money": "الدخل",
    "Y7-Data": "التحليلات",
    "Y8-Truth": "الخلاصة",
    "Y9-CTA": "الختام",
  };
  const mm = (f: number) => {
    const s = Math.floor(f / 30);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  return (
    <>
      {scenes.map((s, i) => {
        const a = x(s.from) + (i ? 3 : 0);
        const b = x(i < scenes.length - 1 ? scenes[i + 1].from : total) - 3;
        const fill = Math.max(0, Math.min(1, (frame - s.from) / Math.max(1, (i < scenes.length - 1 ? scenes[i + 1].from : total) - s.from)));
        return (
          <div key={s.id} style={{ position: "absolute", left: a, top: 130, width: b - a, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.22)", overflow: "hidden" }}>
            <div style={{ width: `${fill * 100}%`, height: "100%", background: P.clay }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: x(frame) - 10, top: 123, width: 20, height: 20, borderRadius: 10, background: P.clay, boxShadow: "0 0 12px rgba(255,0,51,0.8)" }} />
      <div style={{ position: "absolute", left, top: 158, width, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: SANS, fontSize: 24, color: P.ink2 }}>
        <div dir="ltr" style={{ fontFamily: MONO }}>
          {mm(frame)} / {mm(total)}
        </div>
        <div dir="rtl" style={{ fontWeight: 600, color: P.ink }}>{titles[now.id]}</div>
      </div>
    </>
  );
};
