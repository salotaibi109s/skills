import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { getViralScene, Music } from "./base";
import { V1Hook, V2Promise, V3One, V4Two, V5Three, V6Save } from "./scenes";

const ids = ["V1-Hook", "V2-Promise", "V3-One", "V4-Two", "V5-Three", "V6-Save"] as const;
const comps = [V1Hook, V2Promise, V3One, V4Two, V5Three, V6Save];

/** «٣ أشياء من جوالك» (33 s): a TikTok-native list ad built with the Vyral short-form skills. */
export const DabberhaViral: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#F6F1E7" }}>
    <Series>
      {ids.map((id, i) => {
        const C = comps[i];
        return (
          <Series.Sequence key={id} name={id} durationInFrames={getViralScene(id).durationInFrames}>
            <C />
          </Series.Sequence>
        );
      })}
    </Series>
    <Music segments={[{ id: "bed", from: 0, durationInFrames: 1000, fadeIn: 1 }]} />
  </AbsoluteFill>
);
