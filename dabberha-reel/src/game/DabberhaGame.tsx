import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { gameTimeline, getGameScene, Music } from "./base";
import { G1GameOver, G2Menu, G3PowerUp, G4Level1, G5Level2, G6Level3, G7Score, G8Start } from "./scenes";

const ids = ["G1-GameOver", "G2-Menu", "G3-PowerUp", "G4-Level1", "G5-Level2", "G6-Level3", "G7-Score", "G8-Start"] as const;
const comps = [G1GameOver, G2Menu, G3PowerUp, G4Level1, G5Level2, G6Level3, G7Score, G8Start];

/** «العبها صح» (50 s): an original 8-bit game — GAME OVER → retry with Dabbirha → three levels → HD upgrade. */
export const DabberhaGame: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0B0D17" }}>
    <Series>
      {ids.map((id, i) => {
        const C = comps[i];
        return (
          <Series.Sequence key={id} name={id} durationInFrames={getGameScene(id).durationInFrames}>
            <C />
          </Series.Sequence>
        );
      })}
    </Series>
    <Music segments={[{ id: "chip", from: getGameScene("G2-Menu").from, durationInFrames: gameTimeline.durationInFrames - getGameScene("G2-Menu").from, fadeIn: 6 }]} />
  </AbsoluteFill>
);
