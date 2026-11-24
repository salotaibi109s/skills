import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { getMotionScene, Music } from "./base";
import { M1Hook, M2Twist, M3Cafe, M4Explain, M5Brand, M6Store, M7Reveal, M8CTA } from "./scenes";

const ids = ["M1-Hook", "M2-Twist", "M3-Cafe", "M4-Explain", "M5-Brand", "M6-Store", "M7-Reveal", "M8-CTA"] as const;
const comps = [M1Hook, M2Twist, M3Cafe, M4Explain, M5Brand, M6Store, M7Reveal, M8CTA];

/** «نفس الكوب» (51 s): a dull 3-like café post comes alive — motion graphics for cafés, brands and stores. */
export const DabberhaMotion: React.FC = () => {
  const twist = getMotionScene("M2-Twist");
  const dropAt = twist.from + twist.words[twist.words.length - 1].start;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0E0F14" }}>
      <Series>
        {ids.map((id, i) => {
          const C = comps[i];
          return (
            <Series.Sequence key={id} name={id} durationInFrames={getMotionScene(id).durationInFrames}>
              <C />
            </Series.Sequence>
          );
        })}
      </Series>
      {/* the music drops exactly when the cup breaks out of the post */}
      <Music segments={[{ id: "groove", from: dropAt, durationInFrames: 1530 - dropAt, fadeIn: 1 }]} />
    </AbsoluteFill>
  );
};
