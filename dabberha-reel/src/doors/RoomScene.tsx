import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain } from "../components/Backdrop";
import type { IconName } from "../components/Icons";
import { Captions } from "../story/Captions";
import { fonts } from "../theme";
import { cue, hall, SceneVoice, Sfx, type SceneTiming } from "./base";
import { Door, FlipCard, tint } from "./Door";

export type RoomItem = { cue: string; title: string; price?: number; icon: IconName };

const DOOR_W = 520;
const OPEN_FRAMES = 16;
const PUSH_FRAMES = 18;
const DOOR_SFX_LEAD = 4; // the door sound's swoosh peaks ~0.13 s after it starts

/**
 * One category of the store: a big arched door opens on the category's name,
 * the camera pushes through it, and the services flip in as they are spoken.
 */
export const RoomScene: React.FC<{
  scene: SceneTiming;
  number: string;
  doorLabel: string;
  title: string;
  color: string;
  openOn: string;
  items?: RoomItem[];
  children?: React.ReactNode; // custom room content instead of items
}> = ({ scene, number, doorLabel, title, color, openOn, items = [], children }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const tOpen = cue(scene, openOn);
  const open = interpolate(frame, [tOpen, tOpen + OPEN_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.2, 1),
  });
  const pushStart = tOpen + OPEN_FRAMES - 4;
  const push = interpolate(frame, [pushStart, pushStart + PUSH_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.3, 1),
  });
  const roomIn = interpolate(frame, [pushStart + PUSH_FRAMES * 0.55, pushStart + PUSH_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const header = spring({ frame: frame - (pushStart + PUSH_FRAMES - 4), fps, config: { damping: 200 } });
  const intro = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });

  return (
    <AbsoluteFill style={{ background: hall.wall, overflow: "hidden" }}>
      {/* Hall with the door */}
      <AbsoluteFill style={{ scale: String(1 + push * 3.2 + (1 - intro) * 0.05), transformOrigin: "540px 860px", opacity: 1 - roomIn }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1240, bottom: 0, background: `linear-gradient(180deg, ${hall.floor} 0%, ${hall.wallShade} 100%)` }} />
        <div style={{ position: "absolute", left: (width - DOOR_W) / 2, top: 330 }}>
          <Door width={DOOR_W} color={color} open={open} number={number} label={doorLabel} labelSize={44} />
        </div>
      </AbsoluteFill>

      {/* The room */}
      <AbsoluteFill style={{ opacity: roomIn, background: `radial-gradient(90% 60% at 50% 0%, #FFFFFF 0%, ${tint(color, 0.86)} 62%, ${tint(color, 0.72)} 100%)` }}>
        <div
          dir="rtl"
          style={{
            position: "absolute",
            top: 290,
            left: 80,
            right: 80,
            textAlign: "center",
            opacity: header,
            translate: `0px ${(1 - header) * 30}px`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 26px",
              borderRadius: 999,
              background: color,
              color: "#fff",
              fontFamily: fonts.text,
              fontWeight: 700,
              fontSize: 34,
            }}
          >
            {doorLabel}
          </div>
          <div style={{ marginTop: 18, fontFamily: fonts.display, fontWeight: 800, fontSize: 88, lineHeight: 1.15, color: hall.ink }}>{title}</div>
        </div>
        {children ?? (
          <div
            style={{
              position: "absolute",
              top: 545,
              left: 80,
              right: 80,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            {items.map((it) => (
              <FlipCard key={it.title} at={cue(scene, it.cue)} icon={it.icon} title={it.title} price={it.price} color={color} width={860} />
            ))}
          </div>
        )}
      </AbsoluteFill>

      <Grain width={width} height={height} opacity={0.045} />
      <Captions scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="door" at={tOpen - DOOR_SFX_LEAD} />
      <Sfx name="shimmer" at={pushStart + 2} />
      {items.map((it) => (
        <Sfx key={it.title} name="flip" at={cue(scene, it.cue)} />
      ))}
    </AbsoluteFill>
  );
};
