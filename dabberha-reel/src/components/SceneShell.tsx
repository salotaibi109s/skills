import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type Move = "cut" | "whip-left" | "whip-right" | "zoom" | "fade";

const WHIP = 7; // frames

/**
 * Virtual camera: slow push-in over the whole shot, plus whip-pan / zoom
 * entries and exits so consecutive scenes in the <Series> read as one move.
 */
export const SceneShell: React.FC<{
  children: React.ReactNode;
  background?: React.ReactNode;
  enter?: Move;
  exit?: Move;
  push?: number; // total push-in scale gain over the shot
}> = ({ children, background, enter = "cut", exit = "cut", push = 0.05 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();

  const pushScale = interpolate(frame, [0, durationInFrames], [1, 1 + push], {
    easing: Easing.bezier(0.33, 0, 0.67, 1),
  });

  const inP = interpolate(frame, [0, WHIP], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const outP = interpolate(frame, [durationInFrames - WHIP, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  let x = 0;
  let blur = 0;
  let scale = pushScale;
  let opacity = 1;

  const apply = (move: Move, p: number, sign: 1 | -1) => {
    if (p <= 0) return;
    if (move === "whip-left" || move === "whip-right") {
      const dir = move === "whip-left" ? -1 : 1;
      x += dir * sign * p * width * 0.9;
      blur += p * 38;
    } else if (move === "zoom") {
      scale *= sign === 1 ? 1 + p * 0.6 : 1 - p * 0.25;
      blur += p * 24;
      opacity *= 1 - p * 0.6;
    } else if (move === "fade") {
      opacity *= 1 - p;
    }
  };
  // entering content travels from the opposite side of the exit direction
  apply(enter, inP, -1);
  apply(exit, outP, 1);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Background moves less than foreground: parallax */}
      <AbsoluteFill style={{ translate: `${x * 0.35}px 0px`, scale: String(1 + (scale - 1) * 0.4 + 0.04) }}>
        {background}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          translate: `${x}px 0px`,
          scale: String(scale),
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
          opacity,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
