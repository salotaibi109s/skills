import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/white-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData } from "../lib/timing";
import { db, fonts } from "../theme";

export { cue, cueEnd } from "../lib/timing";
export type { SceneTiming } from "../lib/timing";

export type WhiteSceneId = "W1-Hook" | "W2-Time" | "W3-Gov" | "W4-Design" | "W5-Tech" | "W6-Cart" | "W7-CTA";
export const whiteTimeline = data as TimelineData;
export const getWhiteScene = (id: WhiteSceneId): SceneTiming => findScene(whiteTimeline, id);

// Sale-poster palette: paper, ink, sale red — brand blue only for the finale.
export const sale = {
  paper: "#F4F1EA",
  ink: "#121212",
  red: "#E3262F",
  redDeep: "#B3141C",
  yellow: "#FFD23F",
  green: "#17A34A",
  blue: "#21649B",
  white: "#FFFFFF",
} as const;

export const whiteGains: Record<string, number> = {
  pings: db(-13),
  scratch: db(-9),
  marker: db(-8),
  sticker: db(-8),
  scanner: db(-15),
  tag: db(-11),
  whoosh: db(-14),
  pop: db(-12),
  ching: db(-10),
  impact: db(-7),
};
export const { Sfx, SceneVoice, Music } = createSound(whiteTimeline, "audio/white", whiteGains);

/** Paper background with halftone dots. */
export const Paper: React.FC<{ color?: string; dot?: string }> = ({ color = sale.paper, dot = "rgba(0,0,0,0.07)" }) => (
  <AbsoluteFill style={{ background: color }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${dot} 2.4px, transparent 3px)`, backgroundSize: "24px 24px" }} />
  </AbsoluteFill>
);

/** Camera shake after a hit (returns a CSS translate). */
export const useShake = (hits: number[], amp = 14, len = 8) => {
  const frame = useCurrentFrame();
  let x = 0;
  let y = 0;
  for (const h of hits) {
    const t = frame - h;
    if (t < 0 || t > len) continue;
    const k = amp * (1 - t / len);
    x += (random(`sx${h}-${t}`) - 0.5) * 2 * k;
    y += (random(`sy${h}-${t}`) - 0.5) * 2 * k;
  }
  return `${x}px ${y}px`;
};

/** Hand-drawn red marker strike, drawn in `len` frames from `at`. */
export const Strike: React.FC<{ at: number; width: number; height?: number; len?: number; color?: string; tilt?: number }> = ({ at, width, height = 60, len = 6, color = sale.red, tilt = -4 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const m = height / 2;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", left: 0, top: "50%", marginTop: -m, overflow: "visible", rotate: `${tilt}deg`, pointerEvents: "none" }}>
      <path d={`M${width + 10} ${m + 6} C ${width * 0.7} ${m - 8}, ${width * 0.35} ${m + 10}, -10 ${m - 4}`} stroke={color} strokeWidth={height * 0.32} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const burstPoints = (r1: number, r2: number, n: number) =>
  Array.from({ length: n * 2 })
    .map((_, i) => {
      const a = (i / (n * 2)) * Math.PI * 2;
      const r = i % 2 ? r2 : r1;
      return `${Math.cos(a) * r},${Math.sin(a) * r}`;
    })
    .join(" ");

/** Sticker slapped onto the page: starburst or pill, overshoot scale + rotation. */
export const Sticker: React.FC<{
  at: number;
  children: React.ReactNode;
  shape?: "burst" | "pill";
  color?: string;
  textColor?: string;
  size?: number;
  rotate?: number;
  style?: React.CSSProperties;
  fontSize?: number;
}> = ({ at, children, shape = "pill", color = sale.red, textColor = sale.white, size = 300, rotate = -8, style, fontSize = 64 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 220, mass: 0.6 } });
  const scale = interpolate(s, [0, 1], [2.2, 1]);
  const common: React.CSSProperties = { position: "absolute", scale: String(scale), rotate: `${rotate + (1 - s) * 18}deg`, opacity: Math.min(1, s * 3), ...style };
  if (shape === "burst")
    return (
      <div style={{ ...common, width: size, height: size, display: "grid", placeItems: "center" }}>
        <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} style={{ position: "absolute", inset: 0, overflow: "visible", rotate: `${frame * 0.6}deg`, filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.3))" }}>
          <polygon points={burstPoints(size / 2, size / 2.5, 18)} fill={sale.white} />
          <polygon points={burstPoints(size / 2 - 12, size / 2.5 - 12, 18)} fill={color} />
        </svg>
        <div dir="rtl" style={{ position: "relative", fontFamily: fonts.display, fontWeight: 800, fontSize, color: textColor, textAlign: "center", lineHeight: 1.05, padding: "0 30px" }}>{children}</div>
      </div>
    );
  return (
    <div dir="rtl" style={{ ...common, padding: "18px 44px 24px", borderRadius: 999, background: color, border: `8px solid ${sale.white}`, boxShadow: "0 16px 30px rgba(0,0,0,0.28)", fontFamily: fonts.display, fontWeight: 800, fontSize, color: textColor, whiteSpace: "nowrap" }}>
      {children}
    </div>
  );
};

/** Spoken words appear as they are said (bold, bottom of the safe area). */
export const Caption: React.FC<{ scene: SceneTiming; color?: string; accent?: string; top?: number; size?: number }> = ({ scene, color = sale.ink, accent = sale.red, top = 1340, size = 66 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div dir="rtl" style={{ position: "absolute", left: 60, right: 60, top, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.28em", fontFamily: fonts.display, fontWeight: 800, fontSize: size, lineHeight: 1.2 }}>
      {scene.words.map((w, i) => {
        const s = spring({ frame: frame - w.start, fps, config: { damping: 12, stiffness: 200 } });
        const on = frame >= w.start;
        const isLast = i === scene.words.length - 1;
        return (
          <span key={i} style={{ display: "inline-block", opacity: on ? 1 : 0, translate: `0px ${(1 - s) * 30}px`, scale: String(0.7 + 0.3 * s), color: isLast ? accent : color }}>
            {w.raw ?? w.text}
          </span>
        );
      })}
    </div>
  );
};

/** Swinging cardboard price tag hanging from a string at the top of the safe area. */
export const useSwing = (start: number, amp = 26) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - start);
  return amp * Math.exp(-t / 22) * Math.cos(t / 4.2);
};

export const Barcode: React.FC<{ width: number; height: number; color?: string; seed?: string }> = ({ width, height, color = sale.ink, seed = "b" }) => {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  let i = 0;
  while (x < width) {
    const w = 3 + Math.floor(random(`${seed}${i}`) * 4) * 3;
    bars.push({ x, w });
    x += w + 4 + Math.floor(random(`${seed}g${i}`) * 3) * 3;
    i++;
  }
  return (
    <svg width={width} height={height}>
      {bars.map((b, k) => (
        <rect key={k} x={b.x} y={0} width={b.w} height={height} fill={color} />
      ))}
    </svg>
  );
};
