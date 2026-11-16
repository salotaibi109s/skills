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
import { getStoryScene } from "./story/base";
import { DabberhaStory } from "./story/DabberhaStory";
import { T1Ticket } from "./story/scenes/T1Ticket";
import { T2Road } from "./story/scenes/T2Road";
import { T3Office } from "./story/scenes/T3Office";
import { T4Closed } from "./story/scenes/T4Closed";
import { T5Rewind } from "./story/scenes/T5Rewind";
import { T6Home } from "./story/scenes/T6Home";
import { T7NumberOne } from "./story/scenes/T7NumberOne";
import { T8Cta } from "./story/scenes/T8Cta";

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

      {/* Second video: story ad */}
      <Composition
        id="DabberhaStory"
        component={DabberhaStory}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Story-Scenes">
        <Composition id="T1-Ticket" component={T1Ticket} durationInFrames={getStoryScene("T1-Ticket").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="T2-Road" component={T2Road} durationInFrames={getStoryScene("T2-Road").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="T3-Office" component={T3Office} durationInFrames={getStoryScene("T3-Office").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="T4-Closed" component={T4Closed} durationInFrames={getStoryScene("T4-Closed").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="T5-Rewind" component={T5Rewind} durationInFrames={getStoryScene("T5-Rewind").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="T6-Home" component={T6Home} durationInFrames={getStoryScene("T6-Home").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="T7-NumberOne" component={T7NumberOne} durationInFrames={getStoryScene("T7-NumberOne").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="T8-CTA" component={T8Cta} durationInFrames={getStoryScene("T8-CTA").durationInFrames} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};
