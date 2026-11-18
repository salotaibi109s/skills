import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { db } from "../theme";
import { cTimeline, getC, K, type CSceneId } from "./base";
import { C1Overload, C2Meet, C3Files, C4Artifacts, C5Code, C6Projects, C7Computer, C8Connect, C9Build } from "./scenes";

const SCENES: { id: CSceneId; C: React.FC }[] = [
  { id: "C1-Overload", C: C1Overload },
  { id: "C2-Meet", C: C2Meet },
  { id: "C3-Files", C: C3Files },
  { id: "C4-Artifacts", C: C4Artifacts },
  { id: "C5-Code", C: C5Code },
  { id: "C6-Projects", C: C6Projects },
  { id: "C7-Computer", C: C7Computer },
  { id: "C8-Connect", C: C8Connect },
  { id: "C9-Build", C: C9Build },
];

/** Cinematic explainer (~78 s): what Claude can do beyond chat, told through Rashed's night at work. */
export const ClaudeFilm: React.FC = () => (
  <AbsoluteFill style={{ background: K.bg }}>
    <TransitionSeries>
      {SCENES.flatMap(({ id, C }) => {
        const s = getC(id);
        const items = [
          <TransitionSeries.Sequence key={id} name={id} durationInFrames={s.durationInFrames}>
            <C />
          </TransitionSeries.Sequence>,
        ];
        if (s.transitionFrames)
          items.push(<TransitionSeries.Transition key={`${id}-t`} presentation={fade()} timing={linearTiming({ durationInFrames: s.transitionFrames })} />);
        return items;
      })}
    </TransitionSeries>
    {cTimeline.audio?.music && (
      <Audio
        src={staticFile("audio/claude/music/score.mp3")}
        volume={(f) => {
          const end = cTimeline.durationInFrames;
          const inVoice = cTimeline.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 4);
          const fd = interpolate(f, [0, 20, end - 50, end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (inVoice ? db(-21) : db(-15)) * fd;
        }}
      />
    )}
  </AbsoluteFill>
);
