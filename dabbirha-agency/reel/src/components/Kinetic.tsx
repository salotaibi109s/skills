import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";

/**
 * Reveals one whole Arabic word or phrase (never split into letters, so the
 * letters stay joined): mask wipe from below + blur-to-sharp + soft spring scale.
 */
export const Reveal: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  out?: number; // optional frame to start hiding
  mode?: "mask" | "blur" | "scale";
  display?: "inline-block" | "block";
}> = ({ at, children, style, out, mode = "mask", display = "inline-block" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: springs.soft, durationInFrames: 16 });
  const sharp = interpolate(frame, [at, at + 12], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const hide =
    out === undefined
      ? 0
      : interpolate(frame, [out, out + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.cubic),
        });
  if (frame < at - 1) return <span style={{ display, visibility: "hidden", ...style }}>{children}</span>;

  const rise = mode === "mask" ? (1 - s) * 105 : 0;
  const scale = mode === "scale" ? 0.6 + 0.4 * s : 0.94 + 0.06 * s;
  return (
    <span
      style={{
        display,
        overflow: mode === "mask" ? "hidden" : "visible",
        // generous padding so Arabic ascenders, dots and descenders are never clipped
        padding: "0.18em 0.08em 0.32em",
        margin: "-0.18em -0.08em -0.32em",
        verticalAlign: "bottom",
      }}
    >
      <span
        style={{
          display: "inline-block",
          translate: `0px ${rise - hide * 40}%`,
          scale: String(scale),
          filter: sharp + hide * 12 > 0.2 ? `blur(${sharp + hide * 12}px)` : undefined,
          opacity: Math.min(1, s * 1.6) * (1 - hide),
          ...style,
        }}
      >
        {children}
      </span>
    </span>
  );
};

/** One line of words, each word revealed on its own cue frame. RTL. */
export const WordLine: React.FC<{
  words: { text: string; at: number; highlight?: boolean }[];
  size: number;
  color?: string;
  highlightColor?: string;
  font?: "display" | "text";
  weight?: number;
  gap?: number;
  out?: number;
  mode?: "mask" | "blur" | "scale";
  justify?: React.CSSProperties["justifyContent"];
}> = ({
  words,
  size,
  color = colors.white,
  highlightColor = colors.tealBright,
  font = "display",
  weight = 700,
  gap = 0.28,
  out,
  mode = "mask",
  justify = "center",
}) => (
  <div
    dir="rtl"
    lang="ar"
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: justify,
      columnGap: `${gap}em`,
      fontFamily: fonts[font],
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.25,
      color,
    }}
  >
    {words.map((w, i) => (
      <Reveal key={i} at={w.at} out={out} mode={mode} style={w.highlight ? { color: highlightColor } : undefined}>
        {w.text}
      </Reveal>
    ))}
  </div>
);

/** Price counter that climbs to its value and lands exactly on `end`. */
export const Counter: React.FC<{
  from?: number;
  value: number;
  start: number;
  end: number;
  style?: React.CSSProperties;
}> = ({ from = 0, value, start, end, style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, end], [from, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", direction: "ltr", unicodeBidi: "isolate", ...style }}>
      {Math.round(v)}
    </span>
  );
};

/** Short-lived RGB split + slice offset for the glitch look. Renders whole text copies (letters stay joined). */
export const Glitch: React.FC<{
  children: React.ReactNode;
  hits: number[]; // frames where a glitch burst starts
  length?: number;
  style?: React.CSSProperties;
}> = ({ children, hits, length = 5, style }) => {
  const frame = useCurrentFrame();
  const active = hits.find((h) => frame >= h && frame < h + length);
  const k = active === undefined ? 0 : 1 - (frame - active) / length;
  const jitter = active === undefined ? 0 : ((frame * 37) % 11) - 5;
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{ position: "relative", zIndex: 2, display: "inline-block", translate: `${jitter * k * 1.5}px 0px` }}>
        {children}
      </span>
      {k > 0 && (
        <>
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              color: "#2bc4c4",
              mixBlendMode: "screen",
              translate: `${-14 * k}px 0px`,
              clipPath: `inset(${10 + ((frame * 13) % 40)}% 0 ${30 + ((frame * 7) % 30)}% 0)`,
              opacity: 0.9,
            }}
          >
            {children}
          </span>
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              color: "#ff3b6b",
              mixBlendMode: "screen",
              translate: `${14 * k}px 0px`,
              clipPath: `inset(${45 + ((frame * 11) % 30)}% 0 ${5 + ((frame * 5) % 20)}% 0)`,
              opacity: 0.8,
            }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
};
