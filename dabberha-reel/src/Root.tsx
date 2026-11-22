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
import { getBrandScene } from "./brand/kit";
import { DabberhaBrand } from "./brand/DabberhaBrand";
import { B1Problem, B2Discover, B3Creative } from "./brand/scenesA";
import { B4Tech, B5EServices, B6Unified, B7Finale } from "./brand/scenesB";
import { getGameScene } from "./game/base";
import { DabberhaGame } from "./game/DabberhaGame";
import { G1GameOver, G2Menu, G3PowerUp, G4Level1, G5Level2, G6Level3, G7Score, G8Start } from "./game/scenes";
import { getDreamScene } from "./dream/base";
import { DabberhaDream } from "./dream/DabberhaDream";
import { C1Dawn, C2Dream, C3Papers, C4Friend, C5Montage, C6FirstOrder, C7Blessing, C8Brand } from "./dream/scenes";
import { getWhiteScene } from "./white/base";
import { DabberhaWhite } from "./white/DabberhaWhite";
import { W1Hook, W2Time, W3Gov, W4Design, W5Tech, W6Cart, W7Cta } from "./white/scenes";
import { WhiteCover, WhitePost, WhiteStory } from "./white/posters";
import { Slide1, Slide2, Slide3, Slide4, Slide5 } from "./carousel/slides";
import { V2Slide1, V2Slide2, V2Slide3, V2Slide4, V2Slide5 } from "./carousel/v2";
import { getViralScene } from "./viral/base";
import { DabberhaViral } from "./viral/DabberhaViral";
import { V1Hook, V2Promise, V3One, V4Two, V5Three, V6Save } from "./viral/scenes";
import { getMotionScene } from "./motion/base";
import { DabberhaMotion } from "./motion/DabberhaMotion";
import { M1Hook, M2Twist, M3Cafe, M4Explain, M5Brand, M6Store, M7Reveal, M8CTA } from "./motion/scenes";
import { RealAd, REAL_FRAMES } from "./real/RealAd";
import { DabberhaTutorial } from "./tutorial/DabberhaTutorial";
import { tutTimeline } from "./tutorial/base";
import { ClaudeFilm } from "./claude/ClaudeFilm";
import { AgentsFilm } from "./agents/AgentsFilm";
import { PromptsFilm } from "./prompts/PromptsFilm";
import { calculateHowBuilt, HowBuilt } from "./hib/HowBuilt";
import { WhatIf, wTimeline } from "./whatif/WhatIf";
import { YtFilm } from "./yt/YtFilm";
import { ProductRef } from "./prompts/ProductRef";
import { Forces, fTimeline } from "./forces/Forces";
import { Yt2Film } from "./yt2/Yt2Film";
import { GtaGuide, gTimeline } from "./gta/GtaGuide";
import { Shadwi } from "./shadwi/Shadwi";
import { Kids } from "./kids/Kids";
import { Joanna } from "./joanna/Joanna";
import { JoannaEp2 } from "./joanna/Ep2";
import { yTimeline as y2Timeline } from "./yt2/base";
import { yTimeline } from "./yt/base";
import { pTimeline } from "./prompts/base";
import { aTimeline } from "./agents/base";
import { cTimeline } from "./claude/base";

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

      {/* Sixth video: premium brand film «كل ما تحتاجه رقمياً… دبّرها!» (60 s) */}
      <Composition id="DabberhaBrand" component={DabberhaBrand} durationInFrames={1800} fps={30} width={1080} height={1920} />
      <Folder name="Brand-Scenes">
        <Composition id="B1-Problem" component={B1Problem} durationInFrames={getBrandScene("B1-Problem").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="B2-Discover" component={B2Discover} durationInFrames={getBrandScene("B2-Discover").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="B3-Creative" component={B3Creative} durationInFrames={getBrandScene("B3-Creative").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="B4-Tech" component={B4Tech} durationInFrames={getBrandScene("B4-Tech").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="B5-EServices" component={B5EServices} durationInFrames={getBrandScene("B5-EServices").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="B6-Unified" component={B6Unified} durationInFrames={getBrandScene("B6-Unified").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="B7-Finale" component={B7Finale} durationInFrames={getBrandScene("B7-Finale").durationInFrames} fps={30} width={1080} height={1920} />
      </Folder>

      {/* Seventh video: «العبها صح» original 8-bit game ad (50 s) */}
      <Composition id="DabberhaGame" component={DabberhaGame} durationInFrames={1500} fps={30} width={1080} height={1920} />
      <Folder name="Game-Scenes">
        <Composition id="G1-GameOver" component={G1GameOver} durationInFrames={getGameScene("G1-GameOver").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="G2-Menu" component={G2Menu} durationInFrames={getGameScene("G2-Menu").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="G3-PowerUp" component={G3PowerUp} durationInFrames={getGameScene("G3-PowerUp").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="G4-Level1" component={G4Level1} durationInFrames={getGameScene("G4-Level1").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="G5-Level2" component={G5Level2} durationInFrames={getGameScene("G5-Level2").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="G6-Level3" component={G6Level3} durationInFrames={getGameScene("G6-Level3").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="G7-Score" component={G7Score} durationInFrames={getGameScene("G7-Score").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="G8-Start" component={G8Start} durationInFrames={getGameScene("G8-Start").durationInFrames} fps={30} width={1080} height={1920} />
      </Folder>

      {/* Eighth video: «محمصة أبو فهد» cinematic father-and-son story (60 s) */}
      <Composition id="DabberhaDream" component={DabberhaDream} durationInFrames={1800} fps={30} width={1080} height={1920} />
      <Folder name="Dream-Scenes">
        <Composition id="C1-Dawn" component={C1Dawn} durationInFrames={getDreamScene("C1-Dawn").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="C2-Dream" component={C2Dream} durationInFrames={getDreamScene("C2-Dream").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="C3-Papers" component={C3Papers} durationInFrames={getDreamScene("C3-Papers").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="C4-Friend" component={C4Friend} durationInFrames={getDreamScene("C4-Friend").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="C5-Montage" component={C5Montage} durationInFrames={getDreamScene("C5-Montage").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="C6-FirstOrder" component={C6FirstOrder} durationInFrames={getDreamScene("C6-FirstOrder").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="C7-Blessing" component={C7Blessing} durationInFrames={getDreamScene("C7-Blessing").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="C8-Brand" component={C8Brand} durationInFrames={getDreamScene("C8-Brand").durationInFrames} fps={30} width={1080} height={1920} />
      </Folder>

      {/* Ninth video: «تخفيض على وقتك» White Friday sale-poster ad (45 s) */}
      <Composition id="DabberhaWhite" component={DabberhaWhite} durationInFrames={1350} fps={30} width={1080} height={1920} />
      <Folder name="White-Scenes">
        <Composition id="W1-Hook" component={W1Hook} durationInFrames={getWhiteScene("W1-Hook").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="W2-Time" component={W2Time} durationInFrames={getWhiteScene("W2-Time").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="W3-Gov" component={W3Gov} durationInFrames={getWhiteScene("W3-Gov").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="W4-Design" component={W4Design} durationInFrames={getWhiteScene("W4-Design").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="W5-Tech" component={W5Tech} durationInFrames={getWhiteScene("W5-Tech").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="W6-Cart" component={W6Cart} durationInFrames={getWhiteScene("W6-Cart").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="W7-CTA" component={W7Cta} durationInFrames={getWhiteScene("W7-CTA").durationInFrames} fps={30} width={1080} height={1920} />
      </Folder>
      <Folder name="White-Posters">
        <Composition id="WhitePost" component={WhitePost} durationInFrames={90} fps={30} width={1080} height={1350} />
        <Composition id="WhiteStory" component={WhiteStory} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="WhiteCover" component={WhiteCover} durationInFrames={90} fps={30} width={1080} height={1920} />
      </Folder>
      <Folder name="TikTok-Carousel">
        <Composition id="Slide1" component={Slide1} durationInFrames={1} fps={30} width={1080} height={1920} />
        <Composition id="Slide2" component={Slide2} durationInFrames={1} fps={30} width={1080} height={1920} />
        <Composition id="Slide3" component={Slide3} durationInFrames={1} fps={30} width={1080} height={1920} />
        <Composition id="Slide4" component={Slide4} durationInFrames={1} fps={30} width={1080} height={1920} />
        <Composition id="Slide5" component={Slide5} durationInFrames={1} fps={30} width={1080} height={1920} />
      </Folder>
      <Folder name="TikTok-Carousel-V2">
        <Composition id="V2Slide1" component={V2Slide1} durationInFrames={1} fps={30} width={1080} height={1920} />
        <Composition id="V2Slide2" component={V2Slide2} durationInFrames={1} fps={30} width={1080} height={1920} />
        <Composition id="V2Slide3" component={V2Slide3} durationInFrames={1} fps={30} width={1080} height={1920} />
        <Composition id="V2Slide4" component={V2Slide4} durationInFrames={1} fps={30} width={1080} height={1920} />
        <Composition id="V2Slide5" component={V2Slide5} durationInFrames={1} fps={30} width={1080} height={1920} />
      </Folder>

      {/* Tenth video: «٣ أشياء من جوالك» built with the Vyral short-form skills (33 s) */}
      <Composition id="DabberhaViral" component={DabberhaViral} durationInFrames={1000} fps={30} width={1080} height={1920} />
      <Folder name="Viral-Scenes">
        <Composition id="V1-Hook" component={V1Hook} durationInFrames={getViralScene("V1-Hook").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="V2-Promise" component={V2Promise} durationInFrames={getViralScene("V2-Promise").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="V3-One" component={V3One} durationInFrames={getViralScene("V3-One").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="V4-Two" component={V4Two} durationInFrames={getViralScene("V4-Two").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="V5-Three" component={V5Three} durationInFrames={getViralScene("V5-Three").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="V6-Save" component={V6Save} durationInFrames={getViralScene("V6-Save").durationInFrames} fps={30} width={1080} height={1920} />
      </Folder>

      {/* Eleventh video: «نفس الكوب» motion graphics for cafés, brands and stores (47 s) */}
      <Composition id="DabberhaMotion" component={DabberhaMotion} durationInFrames={1530} fps={30} width={1080} height={1920} />
      <Folder name="Motion-Scenes">
        <Composition id="M1-Hook" component={M1Hook} durationInFrames={getMotionScene("M1-Hook").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="M2-Twist" component={M2Twist} durationInFrames={getMotionScene("M2-Twist").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="M3-Cafe" component={M3Cafe} durationInFrames={getMotionScene("M3-Cafe").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="M4-Explain" component={M4Explain} durationInFrames={getMotionScene("M4-Explain").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="M5-Brand" component={M5Brand} durationInFrames={getMotionScene("M5-Brand").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="M6-Store" component={M6Store} durationInFrames={getMotionScene("M6-Store").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="M7-Reveal" component={M7Reveal} durationInFrames={getMotionScene("M7-Reveal").durationInFrames} fps={30} width={1080} height={1920} />
        <Composition id="M8-CTA" component={M8CTA} durationInFrames={getMotionScene("M8-CTA").durationInFrames} fps={30} width={1080} height={1920} />
      </Folder>

      {/* Twelfth video: «العميل: نحتاج فيديو واقعي» realistic café ad from real footage */}
      <Composition id="DabberhaReal" component={RealAd} durationInFrames={REAL_FRAMES} fps={30} width={1080} height={1920} />

      {/* Thirteenth video: educational motion video — Claude Code + Remotion + ElevenLabs */}
      <Composition id="DabberhaTutorial" component={DabberhaTutorial} durationInFrames={tutTimeline.durationInFrames} fps={30} width={1080} height={1920} />
      <Composition id="ClaudeFilm" component={ClaudeFilm} durationInFrames={cTimeline.durationInFrames} fps={30} width={1080} height={1920} />
      <Composition id="AgentsFilm" component={AgentsFilm} durationInFrames={aTimeline.durationInFrames} fps={30} width={1080} height={1920} />
      <Composition id="PromptsFilm" component={PromptsFilm} durationInFrames={pTimeline.durationInFrames} fps={30} width={1080} height={1920} />
      <Composition id="HowBuilt" component={HowBuilt} calculateMetadata={calculateHowBuilt} defaultProps={{ name: "test-ar" }} durationInFrames={300} fps={30} width={1080} height={1920} />
      <Composition id="WhatIf" component={WhatIf} durationInFrames={wTimeline.durationInFrames} fps={30} width={1080} height={1920} />
      <Composition id="YtFilm" component={YtFilm} durationInFrames={yTimeline.durationInFrames} fps={30} width={1080} height={1920} />
      <Composition id="ProductRef" component={ProductRef} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="Forces" component={Forces} durationInFrames={fTimeline.durationInFrames} fps={30} width={1080} height={1920} />
      <Composition id="Yt2Film" component={Yt2Film} durationInFrames={y2Timeline.durationInFrames} fps={30} width={1080} height={1920} />
      <Composition id="GtaGuide" component={GtaGuide} durationInFrames={gTimeline.durationInFrames} fps={30} width={1080} height={1920} />
      <Composition id="Shadwi" component={Shadwi} durationInFrames={1800} fps={30} width={1080} height={1920} />
      <Composition id="Kids" component={Kids} durationInFrames={1800} fps={30} width={1080} height={1920} />
      <Composition id="Joanna" component={Joanna} durationInFrames={1800} fps={30} width={1080} height={1920} />
      <Composition id="JoannaEp2" component={JoannaEp2} durationInFrames={1800} fps={30} width={1080} height={1920} />
    </>
  );
};
