import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, getTutScene, Music, tutTimeline, type TutSceneId } from "./base";
import { T1Hook, T2Three, T3Claude, T4Remotion, T5Eleven, T6Prompt, T7CTA } from "./scenes";

const SCENES: { id: TutSceneId; C: React.FC; next?: "fade" | "slide" }[] = [
  { id: "T1-Hook", C: T1Hook, next: "fade" },
  { id: "T2-Three", C: T2Three, next: "slide" },
  { id: "T3-Claude", C: T3Claude, next: "slide" },
  { id: "T4-Remotion", C: T4Remotion, next: "slide" },
  { id: "T5-Eleven", C: T5Eleven, next: "fade" },
  { id: "T6-Prompt", C: T6Prompt, next: "fade" },
  { id: "T7-CTA", C: T7CTA },
];

/** Educational motion video (≈49 s): how to make motion videos with Claude Code + Remotion + ElevenLabs, ending with Dabbirha. */
export const DabberhaTutorial: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <TransitionSeries>
      {SCENES.flatMap(({ id, C, next }) => {
        const s = getTutScene(id);
        const items = [
          <TransitionSeries.Sequence key={id} name={id} durationInFrames={s.durationInFrames}>
            <C />
          </TransitionSeries.Sequence>,
        ];
        if (next && s.transitionFrames)
          items.push(
            <TransitionSeries.Transition
              key={`${id}-t`}
              presentation={next === "slide" ? slide({ direction: "from-left" }) : fade()}
              timing={linearTiming({ durationInFrames: s.transitionFrames })}
            />,
          );
        return items;
      })}
    </TransitionSeries>
    <Music segments={[{ id: "bed", from: 0, durationInFrames: tutTimeline.durationInFrames, fadeIn: 12 }]} />
  </AbsoluteFill>
);
