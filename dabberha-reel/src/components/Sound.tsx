import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, staticFile } from "remotion";
import { timeline } from "../lib/timeline";
import type { SceneTiming } from "../lib/timeline";
import { mix } from "../theme";

export type SfxName = "whoosh" | "tick" | "pop" | "riser" | "impact" | "glitch";

/**
 * Sound effect placed on the exact frame of the motion it belongs to.
 * Renders nothing until the ElevenLabs SFX have been generated.
 */
export const Sfx: React.FC<{ name: SfxName; at: number; gain?: number }> = ({ name, at, gain = 1 }) => {
  if (!timeline.audio.sfx) return null;
  return (
    <Audio
      name={`SFX ${name}`}
      src={staticFile(`audio/sfx/${name}.mp3`)}
      from={Math.max(0, Math.round(at))}
      volume={mix[name] * gain}
    />
  );
};

/** The scene's voiceover clip, aligned to its word timestamps. */
export const SceneVoice: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  if (!timeline.audio.vo) return null;
  return (
    <Audio
      name={`VO ${scene.id}`}
      src={staticFile(`audio/vo/${scene.id}.mp3`)}
      from={scene.voFrom}
      volume={mix.voice}
    />
  );
};

/**
 * Music bed at -18 dB, ducked automatically while the voice speaks
 * (windows come from the VO timestamps), fade-in 0.5 s, fade-out over the last 2 s.
 */
export const MusicBed: React.FC = () => {
  if (!timeline.audio.music) return null;
  const total = timeline.durationInFrames;
  const fps = timeline.fps;
  const attack = 5;
  const release = 12;
  const windows = timeline.voiceWindows;
  const volume = (f: number) => {
    let duck = 0;
    for (const [s, e] of windows) {
      const d = interpolate(f, [s - attack, s, e, e + release], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      duck = Math.max(duck, d);
    }
    const level = mix.musicBed + (mix.musicDucked - mix.musicBed) * duck;
    const fadeIn = interpolate(f, [0, fps * 0.5], [0, 1], { extrapolateRight: "clamp" });
    const fadeOut = interpolate(f, [total - 2 * fps, total], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return level * fadeIn * fadeOut;
  };
  return <Audio name="Music bed" src={staticFile("audio/music/bed.mp3")} volume={volume} durationInFrames={total} />;
};
