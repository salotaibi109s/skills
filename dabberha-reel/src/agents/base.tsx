import data from "../data/agents-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData } from "../lib/timing";
import { tutGains } from "../tutorial/base";

export { cue } from "../lib/timing";
export { Backdrop, Card, MONO, P, SANS, Scene, SERIF, StepNumber, usePop, Words } from "../tutorial/base";

export type ASceneId = "A1-Need" | "A2-Idea" | "A3-Step1" | "A4-Step2" | "A5-Step3" | "A6-Rule" | "A7-CTA";
export const aTimeline = data as TimelineData;
export const getA = (id: ASceneId): SceneTiming => findScene(aTimeline, id);
export const { Sfx, SceneVoice } = createSound(aTimeline, "audio/agents", tutGains);
