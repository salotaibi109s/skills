import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { getStudioScene, Music, Sfx, studioTimeline } from "./base";
import { P1Hook, P2Making, P3Yours, P4Motion, P5AI, P6Web, P7Personal, P8Process, P9Cta } from "./scenes";

const ids = ["P1-Hook", "P2-Making", "P3-Yours", "P4-Motion", "P5-AI", "P6-Web", "P7-Personal", "P8-Process", "P9-CTA"] as const;
const comps = [P1Hook, P2Making, P3Yours, P4Motion, P5AI, P6Web, P7Personal, P8Process, P9Cta];

/**
 * «هذا الإعلان… ما فيه كاميرا» (60 s): the ad proves the service — it was made
 * with AI voice/music and motion — then four service screens. No prices.
 */
export const DabberhaStudio: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#060A13" }}>
    <Series>
      {ids.map((id, i) => {
        const C = comps[i];
        return (
          <Series.Sequence key={id} name={id} durationInFrames={getStudioScene(id).durationInFrames}>
            <C />
          </Series.Sequence>
        );
      })}
    </Series>
    <Music segments={[{ id: "tech", from: 0, durationInFrames: studioTimeline.durationInFrames, fadeIn: 10 }]} />
    {/* hard cuts land on a whoosh */}
    {ids.slice(3, 8).map((id) => (
      <Sfx key={id} name="whoosh" at={getStudioScene(id).from - 3} />
    ))}
  </AbsoluteFill>
);
