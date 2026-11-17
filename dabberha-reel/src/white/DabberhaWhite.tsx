import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { getWhiteScene, Music } from "./base";
import { W1Hook, W2Time, W3Gov, W4Design, W5Tech, W6Cart, W7Cta } from "./scenes";

const ids = ["W1-Hook", "W2-Time", "W3-Gov", "W4-Design", "W5-Tech", "W6-Cart", "W7-CTA"] as const;
const comps = [W1Hook, W2Time, W3Gov, W4Design, W5Tech, W6Cart, W7Cta];

/** «تخفيض على وقتك» (45 s): a White Friday sale-poster ad — the discount is on your time, not prices. */
export const DabberhaWhite: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#F4F1EA" }}>
    <Series>
      {ids.map((id, i) => {
        const C = comps[i];
        return (
          <Series.Sequence key={id} name={id} durationInFrames={getWhiteScene(id).durationInFrames}>
            <C />
          </Series.Sequence>
        );
      })}
    </Series>
    <Music segments={[{ id: "beat", from: 0, durationInFrames: 1350, fadeIn: 2 }]} />
  </AbsoluteFill>
);
