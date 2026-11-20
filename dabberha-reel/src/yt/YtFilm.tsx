import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { db } from "../theme";
import { Backdrop, ChapterBar, getY, yTimeline, type YSceneId } from "./base";
import { Y1bPlan, Y1Hook, Y2Niche, Y3Viral, Y4Algo, Y5Prod, Y6Money, Y7Data, Y8Truth, Y9CTA } from "./scenes";

const SCENES: { id: YSceneId; C: React.FC }[] = [
  { id: "Y1-Hook", C: Y1Hook },
  { id: "Y1b-Plan", C: Y1bPlan },
  { id: "Y2-Niche", C: Y2Niche },
  { id: "Y3-Viral", C: Y3Viral },
  { id: "Y4-Algo", C: Y4Algo },
  { id: "Y5-Prod", C: Y5Prod },
  { id: "Y6-Money", C: Y6Money },
  { id: "Y7-Data", C: Y7Data },
  { id: "Y8-Truth", C: Y8Truth },
  { id: "Y9-CTA", C: Y9CTA },
];

/** Tutorial (~103 s): seven prompts to plan and grow a YouTube channel with Claude — ends with Dabbirha. */
export const YtFilm: React.FC = () => (
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
      src={staticFile("audio/yt/music/calm.mp3")}
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
