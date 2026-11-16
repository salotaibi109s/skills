import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { MusicBed, Sfx } from "./components/Sound";
import { getScene } from "./lib/timeline";
import { S1Hook } from "./scenes/S1Hook";
import { S2Problem } from "./scenes/S2Problem";
import { S3Reveal } from "./scenes/S3Reveal";
import { S4Government } from "./scenes/S4Government";
import { S5Business } from "./scenes/S5Business";
import { S6RealEstate } from "./scenes/S6RealEstate";
import { S7Trust } from "./scenes/S7Trust";
import { S8Cta } from "./scenes/S8Cta";

const s1 = getScene("S1-Hook");
const s2 = getScene("S2-Problem");
const s3 = getScene("S3-Reveal");
const s4 = getScene("S4-Government");
const s5 = getScene("S5-Business");
const s6 = getScene("S6-RealEstate");
const s7 = getScene("S7-Trust");
const s8 = getScene("S8-CTA");

// The generated whoosh peaks in its first 50 ms: start it 3 frames before the cut,
// i.e. in the middle of the 7-frame whip-pan / zoom.
const WHOOSH_LEAD = 3;

export const DabberhaReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#060d1d" }}>
      <Series>
        <Series.Sequence name="1 · Hook" durationInFrames={s1.durationInFrames}>
          <S1Hook />
        </Series.Sequence>
        <Series.Sequence name="2 · Problem" durationInFrames={s2.durationInFrames}>
          <S2Problem />
        </Series.Sequence>
        <Series.Sequence name="3 · Reveal" durationInFrames={s3.durationInFrames}>
          <S3Reveal />
        </Series.Sequence>
        <Series.Sequence name="4 · Government" durationInFrames={s4.durationInFrames}>
          <S4Government />
        </Series.Sequence>
        <Series.Sequence name="5 · Business" durationInFrames={s5.durationInFrames}>
          <S5Business />
        </Series.Sequence>
        <Series.Sequence name="6 · Real estate" durationInFrames={s6.durationInFrames}>
          <S6RealEstate />
        </Series.Sequence>
        <Series.Sequence name="7 · Trust" durationInFrames={s7.durationInFrames}>
          <S7Trust />
        </Series.Sequence>
        <Series.Sequence name="8 · CTA" durationInFrames={s8.durationInFrames}>
          <S8Cta />
        </Series.Sequence>
      </Series>

      <MusicBed />
      <Sfx name="whoosh" at={s2.from - WHOOSH_LEAD} />
      <Sfx name="whoosh" at={s4.from - WHOOSH_LEAD} />
      <Sfx name="whoosh" at={s5.from - WHOOSH_LEAD} />
      <Sfx name="whoosh" at={s7.from - WHOOSH_LEAD} />
      <Sfx name="whoosh" at={s8.from - WHOOSH_LEAD} />
    </AbsoluteFill>
  );
};
