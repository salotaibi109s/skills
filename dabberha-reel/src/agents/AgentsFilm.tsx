import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { db } from "../theme";
import { aTimeline, Backdrop, getA, type ASceneId } from "./base";
import { A1Need, A2Idea, A3Step1, A4Step2, A5Step3, A6Rule, A7CTA } from "./scenes";

const SCENES: { id: ASceneId; C: React.FC }[] = [
  { id: "A1-Need", C: A1Need },
  { id: "A2-Idea", C: A2Idea },
  { id: "A3-Step1", C: A3Step1 },
  { id: "A4-Step2", C: A4Step2 },
  { id: "A5-Step3", C: A5Step3 },
  { id: "A6-Rule", C: A6Rule },
  { id: "A7-CTA", C: A7CTA },
];

/** Tutorial (~82 s): build your first AI agent team with one prompt — ends with Dabbirha. */
export const AgentsFilm: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <TransitionSeries>
      {SCENES.flatMap(({ id, C }) => {
        const s = getA(id);
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
      src={staticFile("audio/agents/music/calm.mp3")}
      volume={(f) => {
        const end = aTimeline.durationInFrames;
        const inVoice = aTimeline.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 4);
        const fd = interpolate(f, [0, 4, end - 45, end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (inVoice ? db(-23) : db(-17)) * fd;
      }}
    />
  </AbsoluteFill>
);
