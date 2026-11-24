import { Audio } from "@remotion/media";
import React from "react";
import { interpolate, staticFile } from "remotion";
import { timeline as reelTimeline } from "../lib/timeline";
import type { SceneTiming, TimelineData } from "../lib/timing";
import { mix } from "../theme";

export type MusicSegment = {
  id: string; // file public/audio/<dir>/music/<id>.mp3
  from: number; // absolute frame
  durationInFrames: number;
  fadeIn?: number; // frames
  fadeOut?: number; // frames
};

/**
 * Audio building blocks bound to one video's timeline and audio folder.
 * Every sound effect is placed on the exact frame of the motion it belongs to,
 * and renders nothing until its files have been generated.
 */
export const createSound = (timeline: TimelineData, dir: string, gains: Record<string, number>) => {
  const Sfx: React.FC<{ name: string; at: number; gain?: number; durationInFrames?: number }> = ({
    name,
    at,
    gain = 1,
    durationInFrames,
  }) => {
    if (!timeline.audio.sfx) return null;
    return (
      <Audio
        name={`SFX ${name}`}
        src={staticFile(`${dir}/sfx/${name}.mp3`)}
        from={Math.max(0, Math.round(at))}
        durationInFrames={durationInFrames}
        volume={(gains[name] ?? 0.4) * gain}
      />
    );
  };

  const SceneVoice: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
    if (!timeline.audio.vo) return null;
    return <Audio name={`VO ${scene.id}`} src={staticFile(`${dir}/vo/${scene.id}.mp3`)} from={scene.voFrom} volume={mix.voice} />;
  };

  /** Ducking envelope shared by all music segments: bed level, dipped while the voice speaks. */
  const duckedLevel = (f: number) => {
    let duck = 0;
    for (const [s, e] of timeline.voiceWindows) {
      duck = Math.max(
        duck,
        interpolate(f, [s - 5, s, e, e + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      );
    }
    return mix.musicBed + (mix.musicDucked - mix.musicBed) * duck;
  };

  /** Music in one or more segments; the last 2 s of the video always fade out. */
  const Music: React.FC<{ segments: MusicSegment[] }> = ({ segments }) => {
    if (!timeline.audio.music) return null;
    const total = timeline.durationInFrames;
    const fps = timeline.fps;
    return (
      <>
        {segments.map((seg) => (
          <Audio
            key={seg.id}
            name={`Music ${seg.id}`}
            src={staticFile(`${dir}/music/${seg.id}.mp3`)}
            from={seg.from}
            durationInFrames={seg.durationInFrames}
            volume={(local) => {
              const f = seg.from + local;
              const fadeIn = seg.fadeIn ? interpolate(local, [0, seg.fadeIn], [0, 1], { extrapolateRight: "clamp" }) : 1;
              const fadeOut = seg.fadeOut
                ? interpolate(local, [seg.durationInFrames - seg.fadeOut, seg.durationInFrames], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 1;
              const end = interpolate(f, [total - 2 * fps, total], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return duckedLevel(f) * fadeIn * fadeOut * end;
            }}
          />
        ))}
      </>
    );
  };

  return { Sfx, SceneVoice, Music };
};

// ---- Reel (first video) bindings, unchanged behaviour
export type SfxName = "whoosh" | "tick" | "pop" | "riser" | "impact" | "glitch";
const reel = createSound(reelTimeline, "audio", mix);

export const Sfx: React.FC<{ name: SfxName; at: number; gain?: number }> = (p) => <reel.Sfx {...p} />;
export const SceneVoice = reel.SceneVoice;
export const MusicBed: React.FC = () => (
  <reel.Music segments={[{ id: "bed", from: 0, durationInFrames: reelTimeline.durationInFrames, fadeIn: 15 }]} />
);
