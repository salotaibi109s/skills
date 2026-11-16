import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

type Variant = "dark" | "brand" | "light";

const palettes: Record<Variant, { base: string; a: string; b: string; c: string; glow: string }> = {
  dark: {
    base: colors.ink,
    a: "rgba(24,58,103,0.55)",
    b: "rgba(14,147,154,0.20)",
    c: "rgba(33,100,155,0.30)",
    glow: "rgba(255,255,255,0.05)",
  },
  brand: {
    base: "#0c2550",
    a: "rgba(33,100,155,0.85)",
    b: "rgba(14,147,154,0.55)",
    c: "rgba(24,58,103,0.9)",
    glow: "rgba(255,255,255,0.10)",
  },
  light: {
    base: colors.ice,
    a: "rgba(215,225,238,0.95)",
    b: "rgba(14,147,154,0.14)",
    c: "rgba(33,100,155,0.12)",
    glow: "rgba(255,255,255,0.9)",
  },
};

/**
 * Calm moving gradient + soft key light + film grain.
 * `drift` moves slower than the foreground to create parallax.
 */
export const Backdrop: React.FC<{ variant: Variant; drift?: number }> = ({ variant, drift = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const p = palettes[variant];
  const t = frame / 30;
  const ax = 30 + Math.sin(t * 0.35) * 12 * drift;
  const ay = 22 + Math.cos(t * 0.28) * 8 * drift;
  const bx = 72 + Math.cos(t * 0.31) * 14 * drift;
  const by = 70 + Math.sin(t * 0.26) * 10 * drift;
  const cx = 50 + Math.sin(t * 0.22 + 1) * 18 * drift;
  const cy = 45 + Math.cos(t * 0.2 + 2) * 14 * drift;

  return (
    <AbsoluteFill style={{ backgroundColor: p.base, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(60% 40% at ${ax}% ${ay}%, ${p.a} 0%, transparent 70%)`,
            `radial-gradient(55% 38% at ${bx}% ${by}%, ${p.b} 0%, transparent 70%)`,
            `radial-gradient(70% 50% at ${cx}% ${cy}%, ${p.c} 0%, transparent 75%)`,
          ].join(","),
        }}
      />
      {/* soft key light from top */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(80% 35% at 50% ${-5 + Math.sin(t * 0.4) * 3}%, ${p.glow} 0%, transparent 70%)`,
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            variant === "light"
              ? "radial-gradient(120% 80% at 50% 50%, transparent 60%, rgba(13,36,71,0.10) 100%)"
              : "radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <Grain width={width} height={height} opacity={variant === "light" ? 0.05 : 0.08} />
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ width: number; height: number; opacity: number }> = ({ width, height, opacity }) => {
  const frame = useCurrentFrame();
  // New noise every 2 frames feels like film, not static.
  const seed = Math.floor(frame / 2) % 97;
  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "overlay", pointerEvents: "none" }}
    >
      <filter id={`grain-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
    </svg>
  );
};

/** Flash frame used on impacts and match cuts. */
export const Flash: React.FC<{ at: number; color?: string; length?: number }> = ({
  at,
  color = "#ffffff",
  length = 10,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [at - 1, at, at + length], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (opacity <= 0) return null;
  return <AbsoluteFill style={{ backgroundColor: color, opacity, pointerEvents: "none" }} />;
};
