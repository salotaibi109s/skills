import { clockWipe } from "@remotion/transitions/clock-wipe";
import { fade } from "@remotion/transitions/fade";
import { iris } from "@remotion/transitions/iris";
import { slide } from "@remotion/transitions/slide";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { getStoryScene, Music, Sfx } from "./base";
import { T1Ticket } from "./scenes/T1Ticket";
import { T2Road } from "./scenes/T2Road";
import { T3Office } from "./scenes/T3Office";
import { T4Closed } from "./scenes/T4Closed";
import { T5Rewind } from "./scenes/T5Rewind";
import { T6Home } from "./scenes/T6Home";
import { T7NumberOne } from "./scenes/T7NumberOne";
import { T8Cta } from "./scenes/T8Cta";

const t1 = getStoryScene("T1-Ticket");
const t2 = getStoryScene("T2-Road");
const t3 = getStoryScene("T3-Office");
const t4 = getStoryScene("T4-Closed");
const t5 = getStoryScene("T5-Rewind");
const t6 = getStoryScene("T6-Home");
const t7 = getStoryScene("T7-NumberOne");
const t8 = getStoryScene("T8-CTA");

const W = 1080;
const H = 1920;

/**
 * Story ad (60 s): a day lost in the office queue → rewind → the same day with Dabberha.
 * Scenes overlap through TransitionSeries; overlaps come from story-timeline.json.
 */
export const DabberhaStory: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#14161F" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="1 · Ticket" durationInFrames={t1.durationInFrames}>
          <T1Ticket />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={clockWipe({ width: W, height: H })} timing={linearTiming({ durationInFrames: t1.transitionFrames ?? 0 })} />
        <TransitionSeries.Sequence name="2 · Road" durationInFrames={t2.durationInFrames}>
          <T2Road />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={iris({ width: W, height: H })} timing={linearTiming({ durationInFrames: t2.transitionFrames ?? 0 })} />
        <TransitionSeries.Sequence name="3 · Office" durationInFrames={t3.durationInFrames}>
          <T3Office />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="4 · Closed" durationInFrames={t4.durationInFrames}>
          <T4Closed />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence name="5 · Rewind" durationInFrames={t5.durationInFrames}>
          <T5Rewind />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: t5.transitionFrames ?? 0 })} />
        <TransitionSeries.Sequence name="6 · Home" durationInFrames={t6.durationInFrames}>
          <T6Home />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: t6.transitionFrames ?? 0 })} />
        <TransitionSeries.Sequence name="7 · Number one" durationInFrames={t7.durationInFrames}>
          <T7NumberOne />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={clockWipe({ width: W, height: H })} timing={linearTiming({ durationInFrames: t7.transitionFrames ?? 0 })} />
        <TransitionSeries.Sequence name="8 · CTA" durationInFrames={t8.durationInFrames}>
          <T8Cta />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Music: tense until the rewind, then the uplifting track for the solution */}
      <Music
        segments={[
          { id: "tense", from: 0, durationInFrames: t5.from + 8, fadeIn: 12, fadeOut: 10 },
          { id: "uplift", from: t6.from - 4, durationInFrames: 1800 - (t6.from - 4), fadeIn: 10 },
        ]}
      />
      {/* transition whooshes, peaking mid-transition */}
      <Sfx name="whoosh" at={t2.from + 4} />
      <Sfx name="whoosh" at={t3.from + 3} />
      <Sfx name="whoosh" at={t7.from + 2} />
      <Sfx name="whoosh" at={t8.from + 4} />
    </AbsoluteFill>
  );
};
