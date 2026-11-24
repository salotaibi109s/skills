import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { db } from "../theme";
import { Backdrop, getP, pTimeline, type PSceneId } from "./base";
import { P1Hook, P2Billboard, P3Social, P4Studio, P5Angles, P6Life, P7Tip, P8CTA } from "./scenes";

const SCENES: { id: PSceneId; C: React.FC }[] = [
  { id: "P1-Hook", C: P1Hook },
  { id: "P2-Billboard", C: P2Billboard },
  { id: "P3-Social", C: P3Social },
  { id: "P4-Studio", C: P4Studio },
  { id: "P5-Angles", C: P5Angles },
  { id: "P6-Life", C: P6Life },
  { id: "P7-Tip", C: P7Tip },
  { id: "P8-CTA", C: P8CTA },
];

/** Tutorial (~57 s): five ready prompts that turn one product photo into ad visuals — ends with "follow". */
export const PromptsFilm: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <TransitionSeries>
      {SCENES.flatMap(({ id, C }) => {
        const s = getP(id);
        const items = [
          <TransitionSeries.Sequence key={id} name={id} durationInFrames={s.durationInFrames}>
            <C />
          </TransitionSeries.Sequence>,
        ];
        if (s.transitionFrames) items.push(<TransitionSeries.Transition key={`${id}-t`} presentation={fade()} timing={linearTiming({ durationInFrames: s.transitionFrames })} />);
        return items;
      })}
    </TransitionSeries>
    <Audio
      src={staticFile("audio/prompts/music/calm.mp3")}
      volume={(f) => {
        const end = pTimeline.durationInFrames;
        const inVoice = pTimeline.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 4);
        const fd = interpolate(f, [0, 4, end - 45, end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (inVoice ? db(-23) : db(-17)) * fd;
      }}
    />
  </AbsoluteFill>
);
