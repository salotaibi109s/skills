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
import { getDoorsScene } from "./doors/base";
import { DabberhaDoors } from "./doors/DabberhaDoors";
import { D0Welcome, D1Government, D2Business, D3Creative, D4Support, D5Outro } from "./doors/scenes";
import { getFolderScene } from "./folder/base";
import { DabberhaFolder } from "./folder/DabberhaFolder";
import { F1Hook, F2Career } from "./folder/scenes1";
import { F3Tired, F4Retire, F5Phone, F6Trust, F7Cta } from "./folder/scenes2";
import { getStudioScene } from "./studio/base";
import { DabberhaStudio } from "./studio/DabberhaStudio";
import { P1Hook, P2Making, P3Yours, P4Motion, P5AI, P6Web, P7Personal, P8Process, P9Cta } from "./studio/scenes";

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

      {/* Third video: «أربعة أبواب» store tour (50 s) */}
      <Composition id="DabberhaDoors" component={DabberhaDoors} durationInFrames={1500} fps={30} width={1080} height={1920} />
      <Folder name="Doors-Scenes">
        <Composition id="D0-Welcome" component={D0Welcome} durationInFrames={getDoorsScene("D0-Welcome").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="D1-Government" component={D1Government} durationInFrames={getDoorsScene("D1-Government").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="D2-Business" component={D2Business} durationInFrames={getDoorsScene("D2-Business").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="D3-Creative" component={D3Creative} durationInFrames={getDoorsScene("D3-Creative").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="D4-Support" component={D4Support} durationInFrames={getDoorsScene("D4-Support").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="D5-Outro" component={D5Outro} durationInFrames={getDoorsScene("D5-Outro").durationInFrames} fps={30} width={1080} height={1920} />
      </Folder>

      {/* Fourth video: «تقاعد الملف الأخضر» cinematic mini-film (60 s) */}
      <Composition id="DabberhaFolder" component={DabberhaFolder} durationInFrames={1800} fps={30} width={1080} height={1920} />
      <Folder name="Folder-Scenes">
        <Composition id="F1-Hook" component={F1Hook} durationInFrames={getFolderScene("F1-Hook").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="F2-Career" component={F2Career} durationInFrames={getFolderScene("F2-Career").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="F3-Tired" component={F3Tired} durationInFrames={getFolderScene("F3-Tired").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="F4-Retire" component={F4Retire} durationInFrames={getFolderScene("F4-Retire").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="F5-Phone" component={F5Phone} durationInFrames={getFolderScene("F5-Phone").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="F6-Trust" component={F6Trust} durationInFrames={getFolderScene("F6-Trust").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="F7-CTA" component={F7Cta} durationInFrames={getFolderScene("F7-CTA").durationInFrames} fps={30} width={1080} height={1920} />
      </Folder>

      {/* Fifth video: «هذا الإعلان… ما فيه كاميرا» creative & tech services (60 s) */}
      <Composition id="DabberhaStudio" component={DabberhaStudio} durationInFrames={1800} fps={30} width={1080} height={1920} />
      <Folder name="Studio-Scenes">
        <Composition id="P1-Hook" component={P1Hook} durationInFrames={getStudioScene("P1-Hook").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="P2-Making" component={P2Making} durationInFrames={getStudioScene("P2-Making").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="P3-Yours" component={P3Yours} durationInFrames={getStudioScene("P3-Yours").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="P4-Motion" component={P4Motion} durationInFrames={getStudioScene("P4-Motion").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="P5-AI" component={P5AI} durationInFrames={getStudioScene("P5-AI").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="P6-Web" component={P6Web} durationInFrames={getStudioScene("P6-Web").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="P7-Personal" component={P7Personal} durationInFrames={getStudioScene("P7-Personal").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="P8-Process" component={P8Process} durationInFrames={getStudioScene("P8-Process").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="P9-CTA" component={P9Cta} durationInFrames={getStudioScene("P9-CTA").durationInFrames} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};
