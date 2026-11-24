import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { folderTimeline, getFolderScene, Music } from "./base";
import { F1Hook, F2Career } from "./scenes1";
import { F3Tired, F4Retire, F5Phone, F6Trust, F7Cta } from "./scenes2";

const f = (id: Parameters<typeof getFolderScene>[0]) => getFolderScene(id);

/**
 * «تقاعد الملف الأخضر» (60 s): a cinematic mini-film. Hard cuts on action,
 * a match cut from the folder's green into the phone, speed ramps, a dolly zoom.
 */
export const DabberhaFolder: React.FC = () => {
  const f4 = f("F4-Retire");
  const tRetire = f4.words.find((w) => w.text.includes("يتقاعد"))!.start;
  const switchAt = f4.from + tRetire;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0B09" }}>
      <Series>
        <Series.Sequence name="1 · Hook" durationInFrames={f("F1-Hook").durationInFrames}>
          <F1Hook />
        </Series.Sequence>
        <Series.Sequence name="2 · Career" durationInFrames={f("F2-Career").durationInFrames}>
          <F2Career />
        </Series.Sequence>
        <Series.Sequence name="3 · Tired" durationInFrames={f("F3-Tired").durationInFrames}>
          <F3Tired />
        </Series.Sequence>
        <Series.Sequence name="4 · Retire" durationInFrames={f4.durationInFrames}>
          <F4Retire />
        </Series.Sequence>
        <Series.Sequence name="5 · Phone" durationInFrames={f("F5-Phone").durationInFrames}>
          <F5Phone />
        </Series.Sequence>
        <Series.Sequence name="6 · Trust" durationInFrames={f("F6-Trust").durationInFrames}>
          <F6Trust />
        </Series.Sequence>
        <Series.Sequence name="7 · CTA" durationInFrames={f("F7-CTA").durationInFrames}>
          <F7Cta />
        </Series.Sequence>
      </Series>
      {/* nostalgic score until the retirement confetti, then the modern track */}
      <Music
        segments={[
          { id: "nostalgia", from: 0, durationInFrames: switchAt + 6, fadeIn: 8, fadeOut: 8 },
          { id: "modern", from: switchAt, durationInFrames: folderTimeline.durationInFrames - switchAt },
        ]}
      />
    </AbsoluteFill>
  );
};
