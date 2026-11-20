import data from "../data/yt-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData } from "../lib/timing";
import { tutGains } from "../tutorial/base";

export { cue } from "../lib/timing";
export { Backdrop, Card, MONO, P, SANS, Scene, SERIF, StepNumber, usePop, Words } from "../tutorial/base";

export type YSceneId = "Y1-Hook" | "Y1b-Plan" | "Y2-Niche" | "Y3-Viral" | "Y4-Algo" | "Y5-Prod" | "Y6-Money" | "Y7-Data" | "Y8-Truth" | "Y9-CTA";
export const yTimeline = data as TimelineData;
export const getY = (id: YSceneId): SceneTiming => findScene(yTimeline, id);
export const { Sfx, SceneVoice } = createSound(yTimeline, "audio/yt", tutGains);
