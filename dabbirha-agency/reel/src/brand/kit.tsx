import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/brand-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, normalizeAr, type SceneTiming, type TimelineData } from "../lib/timing";
import { colors, db, fonts } from "../theme";

export { cue, cueEnd } from "../lib/timing";
export type { SceneTiming } from "../lib/timing";

export type BrandSceneId = "B1-Problem" | "B2-Discover" | "B3-Creative" | "B4-Tech" | "B5-EServices" | "B6-Unified" | "B7-Finale";
export const brandTimeline = data as TimelineData;
export const getBrandScene = (id: BrandSceneId): SceneTiming => findScene(brandTimeline, id);

// One art direction for the whole film: Dabbirha navy + teal, with an electric-blue light accent.
export const bp = {
  deep: "#040916",
  navy: "#0A1A38",
  brandNavy: colors.navy,
  primary: colors.primary,
  teal: colors.teal,
  tealBright: colors.tealBright,
  electric: "#3D8BFF",
  ice: "#EAF6FF",
  gold: colors.gold,
  coral: "#FF8A6B",
  glass: "rgba(160,215,255,0.08)",
  glassEdge: "rgba(140,220,255,0.35)",
} as const;

export const brandGains: Record<string, number> = {
  whoosh: db(-12),
  tick: db(-20),
  pop: db(-15),
  impact: db(-5),
  riser: db(-10),
  pulse: db(-9),
  notify: db(-13),
  particles: db(-12),
  portal: db(-8),
  ui: db(-15),
  mech: db(-12),
};
export const { Sfx, SceneVoice, Music } = createSound(brandTimeline, "audio/brand", brandGains);

/** The shared stage: deep navy, soft top light, drifting bokeh/dust, vignette and grain. */
export const Stage: React.FC<{ focus?: string; light?: number; children?: React.ReactNode }> = ({ focus = bp.teal, light = 1, children }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / 30;
  const seed = Math.floor(frame / 2) % 53;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 30%, ${bp.navy} 0%, ${bp.deep} 70%)`, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(45% 30% at ${50 + Math.sin(t * 0.3) * 8}% ${18 + Math.cos(t * 0.25) * 4}%, rgba(61,139,255,${0.22 * light}) 0%, transparent 70%)`,
            `radial-gradient(50% 35% at ${50 + Math.cos(t * 0.27) * 10}% ${62 + Math.sin(t * 0.2) * 6}%, ${focus}2a 0%, transparent 72%)`,
          ].join(","),
        }}
      />
      {/* volumetric light from above */}
      <div
        style={{
          position: "absolute",
          left: -100,
          right: -100,
          top: -200,
          height: 1300,
          background: `conic-gradient(from 180deg at 50% 0%, transparent 160deg, rgba(120,190,255,${0.08 * light}) 176deg, rgba(120,190,255,${0.12 * light}) 180deg, rgba(120,190,255,${0.08 * light}) 184deg, transparent 200deg)`,
          filter: "blur(14px)",
        }}
      />
      {Array.from({ length: 34 }).map((_, i) => {
        const s = 3 + random(`bk${i}`) * 9;
        const big = random(`bb${i}`) > 0.82;
        const size = big ? 30 + random(`bs${i}`) * 50 : s;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`bx${i}`) * width,
              top: ((random(`by${i}`) * height - frame * (0.3 + random(`bv${i}`) * 0.7)) % height + height) % height,
              width: size,
              height: size,
              borderRadius: size,
              background: big ? "rgba(90,170,255,0.08)" : `rgba(160,220,255,${0.25 + random(`bo${i}`) * 0.4})`,
              filter: big ? "blur(6px)" : undefined,
            }}
          />
        );
      })}
      {children}
      <AbsoluteFill style={{ background: "radial-gradient(110% 75% at 50% 45%, transparent 55%, rgba(0,0,0,0.65) 100%)", pointerEvents: "none" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none" }}>
        <filter id={`bgrain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#bgrain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Frosted glass panel with an edge light and a reflection sweep. */
export const Glass: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties; tint?: string; sweepAt?: number; radius?: number }> = ({
  children,
  style,
  tint = bp.electric,
  sweepAt,
  radius = 34,
}) => {
  const frame = useCurrentFrame();
  const sweep = sweepAt === undefined ? -1 : interpolate(frame, [sweepAt, sweepAt + 26], [-0.6, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "relative",
        borderRadius: radius,
        background: `linear-gradient(150deg, rgba(255,255,255,0.14) 0%, ${tint}14 45%, rgba(255,255,255,0.04) 100%)`,
        border: `1.5px solid ${bp.glassEdge}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 30px 70px rgba(0,0,0,0.45), 0 0 50px ${tint}22`,
        backdropFilter: "blur(22px) saturate(140%)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
      {sweep > -0.6 && sweep < 1.6 && (
        <div
          style={{
            position: "absolute",
            top: -100,
            bottom: -100,
            width: 140,
            left: `${sweep * 100}%`,
            rotate: "18deg",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

/**
 * 3D extruded Arabic headline. Each word flips up (rotateX) and sharpens on its own frame;
 * the words are never split into letters, so the Arabic stays joined.
 */
export const Headline: React.FC<{
  words: { text: string; at: number; color?: string }[];
  size: number;
  out?: number;
  style?: React.CSSProperties;
}> = ({ words, size, out, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = out === undefined ? 0 : interpolate(frame, [out, out + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const depth = Math.max(4, Math.round(size / 18));
  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: "0.24em",
        perspective: 900,
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.2,
        opacity: 1 - exit,
        translate: `0px ${-exit * 80}px`,
        filter: exit > 0.02 ? `blur(${exit * 12}px)` : undefined,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = spring({ frame: frame - w.at, fps, config: { damping: 14, stiffness: 120 } });
        if (frame < w.at - 1) return <span key={i} style={{ visibility: "hidden" }}>{w.text}</span>;
        const c = w.color ?? "#FFFFFF";
        // stacked shadows = extrusion toward the back-right, plus a soft glow
        const ext = Array.from({ length: depth }, (_, k) => `${(k + 1) * 0.6}px ${(k + 1) * 1}px 0 ${k < depth - 1 ? "#0B2A55" : "#061631"}`).join(", ");
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: c,
              textShadow: `${ext}, 0 0 40px ${c === "#FFFFFF" ? "rgba(120,200,255,0.35)" : c + "66"}`,
              transform: `rotateX(${(1 - s) * 75}deg) translateY(${(1 - s) * 40}px)`,
              transformOrigin: "50% 100%",
              opacity: Math.min(1, s * 1.6),
              filter: s < 0.9 ? `blur(${(1 - s) * 8}px)` : undefined,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/** Pick headline words straight from the spoken transcript so they always match the voice. */
export const spoken = (scene: SceneTiming, match: string) => {
  const m = normalizeAr(match);
  const w = scene.words.find((x) => normalizeAr(x.text).includes(m));
  if (!w) throw new Error(`"${match}" not spoken in ${scene.id}`);
  return w.start;
};

/** Premium phone: dark titanium frame with rim light; children = screen. */
export const PhoneX: React.FC<{ width?: number; children?: React.ReactNode; glow?: number; style?: React.CSSProperties }> = ({ width = 440, children, glow = 1, style }) => {
  const h = width * 2.06;
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: width * 0.15,
        padding: width * 0.028,
        background: "linear-gradient(145deg, #3A4766 0%, #0B1222 40%, #1A2440 100%)",
        boxShadow: `0 60px 120px rgba(0,0,0,0.6), 0 0 ${90 * glow}px rgba(61,139,255,${0.35 * glow}), inset 0 0 0 2px rgba(255,255,255,0.12), inset 0 2px 0 rgba(255,255,255,0.25)`,
        position: "relative",
        ...style,
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: width * 0.125, overflow: "hidden", background: "#0B1530", position: "relative" }}>
        {children}
        <div style={{ position: "absolute", top: width * 0.03, left: "50%", translate: "-50% 0px", width: width * 0.26, height: width * 0.068, borderRadius: 999, background: "#02050c" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.12) 0%, transparent 30%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
};

/** Particles streaming from scattered points into a target — used for dissolves and convergences. */
export const Converge: React.FC<{ start: number; end: number; tx: number; ty: number; count?: number; spread?: number; color?: string; seed?: string }> = ({
  start,
  end,
  tx,
  ty,
  count = 90,
  spread = 900,
  color = "160,225,255",
  seed = "cv",
}) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end + 6) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const delay = random(`${seed}d${i}`) * (end - start) * 0.4;
        const p = interpolate(frame, [start + delay, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const r = spread * (0.3 + random(`${seed}r${i}`) * 0.7);
        const sx = tx + Math.cos(a) * r;
        const sy = ty + Math.sin(a) * r * 1.2;
        const swirl = (1 - p) * 0.8;
        const x = tx + (sx - tx) * (1 - p) * Math.cos(swirl) - (sy - ty) * (1 - p) * Math.sin(swirl) * 0.3;
        const y = ty + (sy - ty) * (1 - p);
        const size = 3 + random(`${seed}s${i}`) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: size,
              background: `rgba(${color},${0.5 + 0.5 * p})`,
              boxShadow: `0 0 ${10 + p * 14}px rgba(${color},0.8)`,
              opacity: p < 0.98 ? 1 : 0,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
