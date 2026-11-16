import { Composition, Folder } from "remotion";
import { DabberhaReel } from "./DabberhaReel";
import { getScene } from "./lib/timeline";
import { S1Hook } from "./scenes/S1Hook";
import { S2Problem } from "./scenes/S2Problem";
import { S3Reveal } from "./scenes/S3Reveal";
import { S4Government } from "./scenes/S4Government";
import { S5Business } from "./scenes/S5Business";
import { S6RealEstate } from "./scenes/S6RealEstate";
import { S7Trust } from "./scenes/S7Trust";
import { S8Cta } from "./scenes/S8Cta";

// Scene lengths come from src/data/timeline.json, generated from the real voiceover timing.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DabberhaReel"
        component={DabberhaReel}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Scenes">
        <Composition
          id="S1-Hook"
          component={S1Hook}
          durationInFrames={getScene("S1-Hook").durationInFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="S2-Problem"
          component={S2Problem}
          durationInFrames={getScene("S2-Problem").durationInFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="S3-Reveal"
          component={S3Reveal}
          durationInFrames={getScene("S3-Reveal").durationInFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="S4-Government"
          component={S4Government}
          durationInFrames={getScene("S4-Government").durationInFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="S5-Business"
          component={S5Business}
          durationInFrames={getScene("S5-Business").durationInFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="S6-RealEstate"
          component={S6RealEstate}
          durationInFrames={getScene("S6-RealEstate").durationInFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="S7-Trust"
          component={S7Trust}
          durationInFrames={getScene("S7-Trust").durationInFrames}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="S8-CTA"
          component={S8Cta}
          durationInFrames={getScene("S8-CTA").durationInFrames}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>
    </>
  );
};
