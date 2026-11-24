import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { db } from "../theme";
import { Backdrop, ChapterBar, getY, yTimeline, type YSceneId } from "./base";
import { Z10CTA, Z1Hook, Z2Title, Z3Thumb, Z4Open, Z5Keep, Z6Seo, Z7Shorts, Z8Comm, Z9Truth } from "./scenes";

const SCENES: { id: YSceneId; C: React.FC }[] = [
  { id: "Z1-Hook", C: Z1Hook },
  { id: "Z2-Title", C: Z2Title },
  { id: "Z3-Thumb", C: Z3Thumb },
  { id: "Z4-Open", C: Z4Open },
  { id: "Z5-Keep", C: Z5Keep },
  { id: "Z6-Seo", C: Z6Seo },
  { id: "Z7-Shorts", C: Z7Shorts },
  { id: "Z8-Comm", C: Z8Comm },
  { id: "Z9-Truth", C: Z9Truth },
  { id: "Z10-CTA", C: Z10CTA },
];

/** Tutorial (~98 s): seven prompts that get each YouTube video seen (packaging, retention, search, Shorts, community) — ends with Dabbirha. */
export const Yt2Film: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <TransitionSeries>
      {SCENES.flatMap(({ id, C }) => {
        const s = getY(id);
        const items = [
          <TransitionSeries.Sequence key={id} name={id} durationInFrames={s.durationInFrames}>
            <C />
          </TransitionSeries.Sequence>,
        ];
        if (s.transitionFrames) items.push(<TransitionSeries.Transition key={`${id}-t`} presentation={fade()} timing={linearTiming({ durationInFrames: s.transitionFrames })} />);
        return items;
      })}
    </TransitionSeries>
    <ChapterBar />
    <Audio
      src={staticFile("audio/yt2/music/calm.mp3")}
      loop
      volume={(f) => {
        const end = yTimeline.durationInFrames;
        const inVoice = yTimeline.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 4);
        const fd = interpolate(f, [0, 4, end - 45, end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (inVoice ? db(-23) : db(-17)) * fd;
      }}
    />
  </AbsoluteFill>
);
