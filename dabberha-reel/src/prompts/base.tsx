import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/prompts-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { tutGains } from "../tutorial/base";

export { cue } from "../lib/timing";
export { MONO, SANS, SERIF, Scene, usePop } from "../tutorial/base";
import { MONO, SANS } from "../tutorial/base";

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
      <div dir="rtl" style={{ position: "absolute", top, left: 80, right: 140, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", columnGap: "0.36em", rowGap: 4, fontFamily: SANS, fontWeight: 700, fontSize: size, lineHeight: 1.4 }}>
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

import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
export const BRAND_SERIF = loadCormorant("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily;

/**
 * The product: a real photo of a blank white cream tube (Pexels), cut out, with the label of
 * NAQĀ, a brand made up for this video, printed on it (multiply blend keeps the plastic's shading).
 */
export const TUBE = { w: 420, h: 1076, capTop: 905, capX0: 84, capX1: 334 };
export const TubeLabel: React.FC<{ back?: boolean }> = ({ back }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: TUBE.w, height: TUBE.h, mixBlendMode: "multiply" }}>
    {back ? (
      <div style={{ position: "absolute", left: 90, right: 90, top: 210 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ height: 7, width: `${[100, 92, 96, 80, 98, 88, 70, 94, 60][i]}%`, background: "#9aa79c", borderRadius: 3, marginBottom: 14 }} />
        ))}
        <div style={{ marginTop: 40, width: 120, height: 60, background: "repeating-linear-gradient(90deg,#55615a 0 3px,transparent 3px 6px,#55615a 6px 7px,transparent 7px 11px)" }} />
      </div>
    ) : (
      <div style={{ position: "absolute", left: 40, right: 40, top: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#6f8f72" strokeWidth="1.3" strokeLinecap="round">
          <path d="M12 21C12 13 6 9 4 4c6 0 12 3 12 10" />
          <path d="M12 21c0-6 3-9 8-11-1 5-3 8-8 11z" />
        </svg>
        <div style={{ fontFamily: BRAND_SERIF, fontWeight: 600, fontSize: 104, letterSpacing: 10, color: "#26332b", marginTop: 6, lineHeight: 1 }}>NAQĀ</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 7, color: "#6f8f72", marginTop: 14 }}>HYDRA GLOW</div>
        <div style={{ width: 120, height: 1.5, background: "#9fb3a2", marginTop: 26 }} />
        <div style={{ fontFamily: BRAND_SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 34, color: "#3c4a41", marginTop: 22, textAlign: "center", lineHeight: 1.15 }}>Daily Moisturizing<br />Cream</div>
        <div dir="rtl" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, color: "#55615a", marginTop: 16 }}>كريم ترطيب يومي</div>
        <div style={{ marginTop: 180, padding: "8px 22px", border: "1.5px solid #6f8f72", borderRadius: 999, fontFamily: SANS, fontWeight: 600, fontSize: 20, letterSpacing: 2, color: "#4d6b52" }}>SPF 30 · 50 ml</div>
      </div>
    )}
  </div>
);

export const Product: React.FC<{ h: number; style?: React.CSSProperties; reflect?: number; shadow?: number; shadowColor?: string; filter?: string }> = ({ h, style, reflect = 0, shadow = 0.5, shadowColor = "0,0,0", filter }) => {
  const sc = h / TUBE.h;
  const w = TUBE.w * sc;
  const art = (
    <div style={{ position: "absolute", left: 0, top: 0, width: TUBE.w, height: TUBE.h, transform: `scale(${sc})`, transformOrigin: "0 0" }}>
      <Img src={staticFile("photos/tube-cut.png")} style={{ position: "absolute", inset: 0, width: TUBE.w, height: TUBE.h }} />
      <TubeLabel />
    </div>
  );
  return (
    <div style={{ position: "absolute", width: w, height: h, ...style }}>
      {shadow > 0 && <div style={{ position: "absolute", left: w * 0.12, right: w * 0.12, bottom: -h * 0.02, height: h * 0.05, borderRadius: "50%", background: `rgba(${shadowColor},${shadow})`, filter: `blur(${h * 0.02}px)` }} />}
      {reflect > 0 && (
        <div style={{ position: "absolute", left: 0, top: h * 0.995, width: w, height: h, transform: "scaleY(-1)", opacity: reflect, maskImage: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 40%)", WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.7), transparent 40%)" }}>{art}</div>
      )}
      <div style={{ position: "absolute", inset: 0, filter, isolation: "isolate" }}>{art}</div>
    </div>
  );
};

/** The "phone photo": the original photo of the tube on leaves, with the same label. */
export const PhonePhoto: React.FC<{ w: number; h: number; s: number; cx?: number; cy?: number; style?: React.CSSProperties }> = ({ w, h, s, cx = 984, cy = 1150, style }) => (
  <div style={{ position: "relative", width: w, height: h, overflow: "hidden", ...style }}>
    <div style={{ position: "absolute", left: w / 2 - cx * s, top: h / 2 - cy * s, width: 1600, height: 2400, transform: `scale(${s})`, transformOrigin: "0 0", isolation: "isolate" }}>
      <Img src={staticFile("photos/tube-leaves.jpg")} style={{ position: "absolute", inset: 0, width: 1600, height: 2400 }} />
      <div style={{ position: "absolute", left: 774, top: 615 }}>
        <TubeLabel />
      </div>
    </div>
  </div>
);

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
export const ChatTurn: React.FC<{ command: string; prompt: string; revealAt: number; children: React.ReactNode; typeFrom?: number; typeTo?: number }> = ({ command, prompt, revealAt, children, typeFrom = 6, typeTo = 22 }) => {
  const frame = useCurrentFrame();
  const sendAt = typeTo + 3;
  const sent = frame >= sendAt;
  const n = Math.floor(interpolate(frame, [typeFrom, typeTo], [0, command.length], clamp));
  const expand = ease(frame, sendAt + 2, sendAt + 14);
  const lift = ease(frame, sendAt, sendAt + 10);
  const reveal = interpolate(frame, [revealAt, revealAt + 40], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 2) });
  const generating = sent && frame < revealAt + 10;
  const dot = 0.5 + 0.5 * Math.sin(frame / 4);
  return (
    <>
      {/* message: composer while typing, grey bubble once sent */}
      <div dir="rtl" style={{ position: "absolute", top: 270 - 10 * lift, right: 140, left: sent ? 80 + 120 * lift : 80, display: "flex", justifyContent: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, padding: "18px 22px", borderRadius: 30, background: sent ? G.soft : "#fff", border: sent ? "1px solid transparent" : `1.5px solid ${G.border}`, boxShadow: sent ? "none" : "0 10px 30px rgba(0,0,0,0.06)", width: "100%" }}>
          <PhonePhoto w={112} h={112} s={0.1} cy={1000} style={{ borderRadius: 18, flexShrink: 0 }} />
          <div dir="ltr" style={{ flex: 1, paddingTop: 2, textAlign: "left" }}>
            <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 40, color: G.ink }}>
              <span style={{ color: G.green }}>{command.slice(0, Math.min(1, n))}</span>
              {command.slice(1, n)}
              {!sent && <span style={{ display: "inline-block", width: 3, height: 40, background: G.ink, verticalAlign: "middle", marginLeft: 2, opacity: Math.floor(frame / 7) % 2 ? 0.2 : 1 }} />}
            </div>
            {sent && (
              <div style={{ marginTop: 8, fontFamily: SANS, fontWeight: 400, fontSize: 25, lineHeight: 1.45, color: G.gray, opacity: expand, maxHeight: 120 * expand, overflow: "hidden" }}>
                {prompt}
              </div>
            )}
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
        <div style={{ position: "absolute", top: 500, left: 80, width: 860, height: 940, borderRadius: 28, overflow: "hidden", background: G.soft, opacity: ease(frame, sendAt + 2, sendAt + 10) }}>
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
      {Array.from({ length: Math.floor((typeTo - typeFrom) / 4) }).map((_, i) => (
        <Sfx key={i} name="type" at={typeFrom + i * 4} gain={0.45} />
      ))}
      <Sfx name="enter" at={sendAt} gain={0.8} />
      <Sfx name="sparkle" at={revealAt + 4} gain={0.8} />
    </>
  );
};
