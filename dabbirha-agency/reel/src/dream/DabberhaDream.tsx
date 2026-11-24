import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { getDreamScene, Music } from "./base";
import { C1Dawn, C2Dream, C3Papers, C4Friend, C5Montage, C6FirstOrder, C7Blessing, C8Brand } from "./scenes";

const ids = ["C1-Dawn", "C2-Dream", "C3-Papers", "C4-Friend", "C5-Montage", "C6-FirstOrder", "C7-Blessing", "C8-Brand"] as const;
const comps = [C1Dawn, C2Dream, C3Papers, C4Friend, C5Montage, C6FirstOrder, C7Blessing, C8Brand];

/** «محمصة أبو فهد» (60 s): a cinematic Saudi father-and-son story — a dream, the paperwork, Dabbirha, the first order. */
export const DabberhaDream: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Series>
      {ids.map((id, i) => {
        const C = comps[i];
        return (
          <Series.Sequence key={id} name={id} durationInFrames={getDreamScene(id).durationInFrames}>
            <C />
          </Series.Sequence>
        );
      })}
    </Series>
    <Music segments={[{ id: "score", from: 0, durationInFrames: 1800, fadeIn: 10 }]} />
  </AbsoluteFill>
);
