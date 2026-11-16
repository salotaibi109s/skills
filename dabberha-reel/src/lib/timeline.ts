import data from "../data/timeline.json";
import { findScene, type SceneTiming, type TimelineData } from "./timing";

// Timeline of the first video (the reel). The story video has its own in src/story/timeline.ts.
export { cue, cueEnd, lastWordEnd, normalizeAr } from "./timing";
export type { SceneTiming, Word } from "./timing";

export type SceneId =
  | "S1-Hook"
  | "S2-Problem"
  | "S3-Reveal"
  | "S4-Government"
  | "S5-Business"
  | "S6-RealEstate"
  | "S7-Trust"
  | "S8-CTA";

export const timeline = data as TimelineData;
export const getScene = (id: SceneId): SceneTiming => findScene(timeline, id);
