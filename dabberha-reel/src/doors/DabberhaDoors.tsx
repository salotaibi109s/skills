import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { doorsTimeline, getDoorsScene, Music, Sfx } from "./base";
import { D0Welcome, D1Government, D2Business, D3Creative, D4Support, D5Outro } from "./scenes";

const d0 = getDoorsScene("D0-Welcome");
const d1 = getDoorsScene("D1-Government");
const d2 = getDoorsScene("D2-Business");
const d3 = getDoorsScene("D3-Creative");
const d4 = getDoorsScene("D4-Support");
const d5 = getDoorsScene("D5-Outro");

/**
 * «أربعة أبواب» (50 s): a tour of the store's four categories.
 * Moving from door to door slides leftwards, the direction Arabic reads in.
 */
export const DabberhaDoors: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#F3EEE6" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="0 · Welcome" durationInFrames={d0.durationInFrames}>
        <D0Welcome />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="1 · Government" durationInFrames={d1.durationInFrames}>
        <D1Government />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={linearTiming({ durationInFrames: d1.transitionFrames ?? 0 })} />
      <TransitionSeries.Sequence name="2 · Business" durationInFrames={d2.durationInFrames}>
        <D2Business />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={linearTiming({ durationInFrames: d2.transitionFrames ?? 0 })} />
      <TransitionSeries.Sequence name="3 · Creative" durationInFrames={d3.durationInFrames}>
        <D3Creative />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={linearTiming({ durationInFrames: d3.transitionFrames ?? 0 })} />
      <TransitionSeries.Sequence name="4 · Support" durationInFrames={d4.durationInFrames}>
        <D4Support />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: d4.transitionFrames ?? 0 })} />
      <TransitionSeries.Sequence name="5 · Outro" durationInFrames={d5.durationInFrames}>
        <D5Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <Music segments={[{ id: "tour", from: 0, durationInFrames: doorsTimeline.durationInFrames, fadeIn: 15 }]} />
    <Sfx name="whoosh" at={d2.from + 3} />
    <Sfx name="whoosh" at={d3.from + 3} />
    <Sfx name="whoosh" at={d4.from + 3} />
  </AbsoluteFill>
);
