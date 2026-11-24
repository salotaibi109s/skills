import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/studio-timeline.json";
import { Icon, type IconName } from "../components/Icons";
import { createSound } from "../components/Sound";
import { findScene, normalizeAr, type SceneTiming, type TimelineData } from "../lib/timing";
import { colors, db, fonts } from "../theme";

export { cue, cueEnd } from "../lib/timing";
export type { SceneTiming } from "../lib/timing";

export type StudioSceneId = "P1-Hook" | "P2-Making" | "P3-Yours" | "P4-Motion" | "P5-AI" | "P6-Web" | "P7-Personal" | "P8-Process" | "P9-CTA";
export const studioTimeline = data as TimelineData;
export const getStudioScene = (id: StudioSceneId): SceneTiming => findScene(studioTimeline, id);

export const tech = {
  bg: "#060A13",
  panel: "#0E1524",
  panel2: "#141D31",
  line: "rgba(255,255,255,0.08)",
  teal: colors.tealBright,
  gold: colors.gold,
  coral: "#FF7A66",
  violet: "#8E7CFF",
  text: "#EAF2FF",
  muted: "rgba(234,242,255,0.55)",
} as const;

export const studioGains: Record<string, number> = {
  whoosh: db(-12),
  tick: db(-20),
  pop: db(-15),
  typing: db(-10),
  denied: db(-10),
  render: db(-14),
  success: db(-9),
  glitch: db(-13),
  impact: db(-6),
};
export const { Sfx, SceneVoice, Music } = createSound(studioTimeline, "audio/studio", studioGains);

/** Dark grid with a slow-moving glow — the "studio" backdrop. */
export const TechBG: React.FC<{ glow?: string; glow2?: string }> = ({ glow = tech.teal, glow2 = tech.violet }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ background: tech.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(55% 35% at ${30 + Math.sin(t * 0.4) * 12}% ${25 + Math.cos(t * 0.3) * 8}%, ${glow}33 0%, transparent 70%)`,
            `radial-gradient(55% 35% at ${70 + Math.cos(t * 0.35) * 12}% ${75 + Math.sin(t * 0.3) * 8}%, ${glow2}2e 0%, transparent 70%)`,
          ].join(","),
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${tech.line} 1px, transparent 1px), linear-gradient(90deg, ${tech.line} 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${(frame * 0.6) % 90}px`,
          maskImage: "radial-gradient(80% 60% at 50% 50%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(80% 60% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

/**
 * The whole spoken sentence as kinetic type: every word lands exactly when it is spoken
 * (mask wipe + scale + blur-to-sharp), highlighted words pop in colour. Words are never split.
 */
export const KLine: React.FC<{
  scene: SceneTiming;
  size: number;
  highlights?: Record<string, string>; // word match → colour
  from?: number; // only words from this index
  to?: number;
  color?: string;
  out?: number; // frame to fly out
  style?: React.CSSProperties;
}> = ({ scene, size, highlights = {}, from = 0, to, color = tech.text, out, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = scene.words.slice(from, to);
  const exit =
    out === undefined
      ? 0
      : interpolate(frame, [out, out + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: "0.24em",
        rowGap: size * 0.08,
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.18,
        color,
        opacity: 1 - exit,
        translate: `0px ${-exit * 60}px`,
        filter: exit > 0.02 ? `blur(${exit * 10}px)` : undefined,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const key = Object.keys(highlights).find((k) => normalizeAr(w.text).includes(normalizeAr(k)));
        const hl = key ? highlights[key] : undefined;
        const s = spring({ frame: frame - w.start, fps, config: hl ? { damping: 10, stiffness: 170 } : { damping: 200 }, durationInFrames: hl ? undefined : 12 });
        const sharp = interpolate(frame, [w.start, w.start + 8], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (frame < w.start - 1) return <span key={i} style={{ visibility: "hidden" }}>{w.raw ?? w.text}</span>;
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", padding: "0.16em 0.06em 0.3em", margin: "-0.16em -0.06em -0.3em", verticalAlign: "bottom" }}>
            <span
              style={{
                display: "inline-block",
                color: hl ?? color,
                translate: `0px ${(1 - Math.min(1, s)) * 100}%`,
                scale: String(hl ? 0.7 + 0.3 * s : 1),
                filter: sharp > 0.2 ? `blur(${sharp}px)` : undefined,
                textShadow: hl ? `0 0 34px ${hl}66` : undefined,
              }}
            >
              {(w.raw ?? w.text).replace(/[«»]/g, "")}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/**
 * A cloud of icons bursting out from a point on `at`, then drifting/orbiting.
 * Each icon sits on a small glass tile with its own colour.
 */
export const IconBurst: React.FC<{
  at: number;
  icons: IconName[];
  cx?: number;
  cy?: number;
  radius?: number; // spread
  size?: number;
  palette?: string[];
  seed?: string;
  exclude?: { x: number; y: number; w: number; h: number }; // keep icons out of this box
  sides?: { yStart: number; yEnd: number }; // place icons in two side columns instead of a ring
}> = ({ at, icons, cx = 540, cy = 900, radius = 430, size = 110, palette = [tech.teal, tech.gold, tech.coral, tech.violet], seed = "b", exclude, sides }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {icons.map((name, i) => {
        const a = (i / icons.length) * Math.PI * 2 + random(`${seed}a${i}`) * 0.5;
        const r = radius * (0.65 + random(`${seed}r${i}`) * 0.45);
        let tx = cx + Math.cos(a) * r;
        let ty = cy + Math.sin(a) * r * 1.15;
        if (sides) {
          const perSide = Math.ceil(icons.length / 2);
          const k = Math.floor(i / 2);
          tx = i % 2 === 0 ? 1080 - 40 - size / 2 - (k % 2) * 18 : 40 + size / 2 + (k % 2) * 18;
          ty = sides.yStart + (perSide > 1 ? (k / (perSide - 1)) * (sides.yEnd - sides.yStart) : 0) + (i % 2) * 40;
        }
        if (exclude && tx > exclude.x && tx < exclude.x + exclude.w && ty > exclude.y && ty < exclude.y + exclude.h) {
          ty = ty < exclude.y + exclude.h / 2 ? exclude.y - size * 0.7 : exclude.y + exclude.h + size * 0.7;
        }
        const delay = at + i * 2;
        const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 120 } });
        if (frame < delay) return null;
        const drift = Math.sin((frame + i * 17) / 26) * 10;
        const c = palette[i % palette.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx + (tx - cx) * s - size / 2,
              top: cy + (ty - cy) * s - size / 2 + drift,
              width: size,
              height: size,
              borderRadius: size * 0.3,
              display: "grid",
              placeItems: "center",
              background: `linear-gradient(160deg, ${c}26, rgba(255,255,255,0.04))`,
              border: `2px solid ${c}55`,
              boxShadow: `0 0 30px ${c}33`,
              backdropFilter: "blur(10px)",
              scale: String(0.3 + 0.7 * s),
              rotate: `${(1 - s) * (i % 2 ? 40 : -40) + Math.sin((frame + i * 9) / 30) * 4}deg`,
              opacity: Math.min(1, s * 1.5),
            }}
          >
            <Icon name={name} size={size * 0.54} color={c} stroke={1.8} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Numbered service label used on the service screens. */
export const ServiceTag: React.FC<{ n: string; text: string; color: string; at: number }> = ({ n, text, color, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 200 }, durationInFrames: 12 });
  return (
    <div dir="rtl" style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "12px 26px 12px 18px", borderRadius: 999, background: `${color}1f`, border: `2px solid ${color}66`, opacity: s, translate: `0px ${(1 - s) * 20}px` }}>
      <div style={{ width: 44, height: 44, borderRadius: 22, background: color, color: tech.bg, display: "grid", placeItems: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 28 }}>{n}</div>
      <div style={{ fontFamily: fonts.text, fontWeight: 700, fontSize: 32, color: tech.text }}>{text}</div>
    </div>
  );
};

export const glitchStyle = (frame: number, at: number, len = 6): React.CSSProperties => {
  const t = frame - at;
  if (t < 0 || t > len) return {};
  const k = 1 - t / len;
  return {
    translate: `${(((frame * 37) % 9) - 4) * 6 * k}px 0px`,
    filter: `drop-shadow(${8 * k}px 0 0 rgba(255,60,100,0.8)) drop-shadow(${-8 * k}px 0 0 rgba(43,196,196,0.8))`,
  };
};
