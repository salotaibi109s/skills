import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { brandTimeline, getBrandScene, Music } from "./kit";
import { B1Problem, B2Discover, B3Creative } from "./scenesA";
import { B4Tech, B5EServices, B6Unified, B7Finale } from "./scenesB";

const ids = ["B1-Problem", "B2-Discover", "B3-Creative", "B4-Tech", "B5-EServices", "B6-Unified", "B7-Finale"] as const;
const comps = [B1Problem, B2Discover, B3Creative, B4Tech, B5EServices, B6Unified, B7Finale];

/** «كل ما تحتاجه رقمياً… دبّرها!» — 60 s premium brand film, one continuous art direction. */
export const DabberhaBrand: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#040916" }}>
    <Series>
      {ids.map((id, i) => {
        const C = comps[i];
        return (
          <Series.Sequence key={id} name={id} durationInFrames={getBrandScene(id).durationInFrames}>
            <C />
          </Series.Sequence>
        );
      })}
    </Series>
    <Music segments={[{ id: "score", from: 0, durationInFrames: brandTimeline.durationInFrames, fadeIn: 6 }]} />
  </AbsoluteFill>
);
