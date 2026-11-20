import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/prompts-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { tutGains } from "../tutorial/base";

export { cue } from "../lib/timing";
export { MONO, SANS, SERIF, Scene, usePop } from "../tutorial/base";
import { SANS } from "../tutorial/base";

export type PSceneId = "P1-Hook" | "P2-Billboard" | "P3-Social" | "P4-Studio" | "P5-Angles" | "P6-Life" | "P7-Tip" | "P8-CTA";
export const pTimeline = data as TimelineData;
export const getP = (id: PSceneId): SceneTiming => findScene(pTimeline, id);
export const { Sfx, SceneVoice } = createSound(pTimeline, "audio/prompts", tutGains);

/** Neutral, chat-app inspired palette (no logos): white, soft greys, near-black and a green accent. */
export const G = {
  bg: "#FFFFFF",
  soft: "#F4F4F4",
  soft2: "#ECECEC",
  ink: "#0D0D0D",
  gray: "#5D5D5D",
  muted: "#8F8F8F",
  border: "#E3E3E3",
  green: "#10A37F",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });

export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ background: G.bg }}>
    <AbsoluteFill style={{ background: "radial-gradient(90% 60% at 50% 35%, #FFFFFF 40%, #F3F3F3 100%)" }} />
  </AbsoluteFill>
);

/** Spoken words, a phrase at a time; the word being said turns green. */
export const GWords: React.FC<{ scene: SceneTiming; top: number; size?: number; maxWords?: number }> = ({ scene, top, size = 58, maxWords = 5 }) => {
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
  return (
    <>
      <div dir="rtl" style={{ position: "absolute", top, left: 80, right: 140, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", columnGap: "0.26em", rowGap: 4, fontFamily: SANS, fontWeight: 700, fontSize: size, lineHeight: 1.4 }}>
        {chunk.map((w, i) => {
          const s = spring({ frame: frame - w.start + 3, fps, config: { damping: 11, stiffness: 320, mass: 0.45 } });
          const on = frame >= w.start - 3;
          const latin = /[A-Za-z]/.test(w.text);
          const active = on && (i === chunk.length - 1 || frame < chunk[i + 1].start);
          return (
            <span key={`${idx}-${i}`} dir={latin ? "ltr" : "rtl"} style={{ position: "relative", display: "inline-block", opacity: on ? Math.min(1, s * 2) : 0, translate: `0px ${(1 - s) * 34}px`, scale: String((0.6 + 0.4 * s) * (active ? 1.08 : 1)), color: active ? G.green : G.ink, unicodeBidi: "isolate" }}>
              {(w.raw ?? w.text).replace(/[«»]/g, "")}
            </span>
          );
        })}
      </div>
      {chunks.map((c, i) => (i > 0 ? <Sfx key={i} name="swish" at={c[0].start - 3} gain={0.7} /> : null))}
    </>
  );
};

/** The real product photo, cut out (a plain frosted perfume bottle with no brand). */
export const BOTTLE = { w: 265, h: 396, capTop: 0, capBottom: 94, capX0: 88, capX1: 160, bodyX0: 4, bodyX1: 241 };
export const Bottle: React.FC<{ h: number; style?: React.CSSProperties; reflect?: number; shadow?: number; shadowColor?: string; filter?: string }> = ({ h, style, reflect = 0, shadow = 0.5, shadowColor = "0,0,0", filter }) => {
  const w = (h * BOTTLE.w) / BOTTLE.h;
  return (
    <div style={{ position: "absolute", width: w, height: h, ...style }}>
      {shadow > 0 && <div style={{ position: "absolute", left: w * 0.02, right: w * 0.02, bottom: -h * 0.03, height: h * 0.07, borderRadius: "50%", background: `rgba(${shadowColor},${shadow})`, filter: `blur(${h * 0.025}px)` }} />}
      {reflect > 0 && (
        <Img src={staticFile("photos/bottle-cut.png")} style={{ position: "absolute", left: 0, top: h * 0.985, width: w, height: h, transform: "scaleY(-1)", opacity: reflect, maskImage: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 45%)", WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 45%)" }} />
      )}
      <Img src={staticFile("photos/bottle-cut.png")} style={{ position: "absolute", inset: 0, width: w, height: h, filter }} />
    </div>
  );
};

/** Small green-dot header chip for each command, plus the "illustration" note. */
export const CommandChip: React.FC<{ n: string; title: string; at?: number }> = ({ n, title, at = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 220, mass: 0.6 } });
  return (
    <div dir="rtl" style={{ position: "absolute", top: 170, left: 80, right: 140, display: "flex", alignItems: "center", gap: 14, opacity: Math.min(1, p * 1.5), translate: `${(1 - p) * 40}px 0px` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 24px 14px", borderRadius: 999, background: G.ink, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 32 }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, background: G.green }} />
        الأمر {n}
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: G.ink }}>{title}</div>
      <div style={{ marginRight: "auto", fontFamily: SANS, fontSize: 22, color: G.muted, border: `1px solid ${G.border}`, borderRadius: 999, padding: "4px 14px 6px" }}>شكل توضيحي</div>
    </div>
  );
};

/** One chat turn: the prompt is typed in the composer, sent as a bubble, then the image renders top-down. */
export const ChatTurn: React.FC<{ prompt: string; revealAt: number; children: React.ReactNode; typeFrom?: number; typeTo?: number }> = ({ prompt, revealAt, children, typeFrom = 6, typeTo = 34 }) => {
  const frame = useCurrentFrame();
  const sendAt = typeTo + 3;
  const sent = frame >= sendAt;
  const n = Math.floor(interpolate(frame, [typeFrom, typeTo], [0, prompt.length], clamp));
  const lift = ease(frame, sendAt, sendAt + 10);
  const reveal = interpolate(frame, [revealAt, revealAt + 40], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 2) });
  const generating = sent && frame < revealAt + 10;
  const dot = 0.5 + 0.5 * Math.sin(frame / 4);
  return (
    <>
      {/* message: composer while typing, grey bubble once sent */}
      <div dir="rtl" style={{ position: "absolute", top: 270 - 10 * lift, right: 140, left: sent ? 80 + 120 * lift : 80, display: "flex", justifyContent: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, padding: "18px 22px", borderRadius: 30, background: sent ? G.soft : "#fff", border: sent ? "1px solid transparent" : `1.5px solid ${G.border}`, boxShadow: sent ? "none" : "0 10px 30px rgba(0,0,0,0.06)", width: "100%" }}>
          <Img src={staticFile("photos/bottle-frosted.jpg")} style={{ width: 112, height: 112, objectFit: "cover", objectPosition: "28% 55%", borderRadius: 18, flexShrink: 0 }} />
          <div style={{ flex: 1, fontFamily: SANS, fontWeight: 500, fontSize: 31, lineHeight: 1.55, color: G.ink, paddingTop: 4 }}>
            {prompt.slice(0, n)}
            {!sent && <span style={{ display: "inline-block", width: 3, height: 32, background: G.ink, verticalAlign: "middle", marginRight: 2, opacity: Math.floor(frame / 7) % 2 ? 0.2 : 1 }} />}
          </div>
          {!sent && (
            <div style={{ alignSelf: "flex-end", width: 58, height: 58, borderRadius: 29, background: n >= prompt.length ? G.ink : G.soft2, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5" />
                <path d="M6 11l6-6 6 6" />
              </svg>
            </div>
          )}
        </div>
      </div>
      {/* the generated image */}
      {sent && (
        <div style={{ position: "absolute", top: 470, left: 80, width: 860, height: 960, borderRadius: 28, overflow: "hidden", background: G.soft, opacity: ease(frame, sendAt + 2, sendAt + 10) }}>
          {generating && (
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, ${G.soft} 30%, #FAFAFA 50%, ${G.soft} 70%)`, backgroundSize: "300% 100%", backgroundPosition: `${100 - ((frame * 2) % 100)}% 0%` }} />
          )}
          {generating && (
            <div dir="rtl" style={{ position: "absolute", top: 30, right: 30, display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontSize: 28, color: G.gray, opacity: 1 - reveal }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: G.ink, opacity: 0.4 + 0.6 * dot }} />
              جاري إنشاء الصورة…
            </div>
          )}
          {frame >= revealAt && (
            <div style={{ position: "absolute", inset: 0, maskImage: `linear-gradient(to bottom, #000 ${reveal * 100}%, rgba(0,0,0,0.25) ${reveal * 100 + 12}%, transparent ${reveal * 100 + 30}%)`, WebkitMaskImage: `linear-gradient(to bottom, #000 ${reveal * 100}%, rgba(0,0,0,0.25) ${reveal * 100 + 12}%, transparent ${reveal * 100 + 30}%)`, filter: `blur(${(1 - reveal) * 18}px)` }}>
              {children}
            </div>
          )}
        </div>
      )}
      {Array.from({ length: Math.floor((typeTo - typeFrom) / 6) }).map((_, i) => (
        <Sfx key={i} name="type" at={typeFrom + i * 6} gain={0.45} />
      ))}
      <Sfx name="enter" at={sendAt} gain={0.8} />
      <Sfx name="sparkle" at={revealAt + 4} gain={0.8} />
    </>
  );
};
