import data from "../data/doors-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData } from "../lib/timing";
import { colors, db } from "../theme";

export { cue, cueEnd } from "../lib/timing";
export type { SceneTiming } from "../lib/timing";

export type DoorsSceneId = "D0-Welcome" | "D1-Government" | "D2-Business" | "D3-Creative" | "D4-Support" | "D5-Outro";

export const doorsTimeline = data as TimelineData;
export const getDoorsScene = (id: DoorsSceneId): SceneTiming => findScene(doorsTimeline, id);

// One accent per door (the store's four categories), all within the brand family.
export const doorColors = {
  gov: colors.teal,
  business: "#D9962B",
  creative: "#E0705A",
  support: colors.primary,
} as const;

export const hall = {
  wall: "#F3EEE6",
  wallShade: "#E6DED2",
  floor: "#D9CDBB",
  frame: "#C9BBA6",
  ink: colors.textOnLight,
} as const;

export const doorsGains: Record<string, number> = {
  whoosh: db(-12),
  tick: db(-22),
  pop: db(-14),
  door: db(-9),
  shimmer: db(-13),
  flip: db(-12),
  lights: db(-12),
};

export const { Sfx, SceneVoice, Music } = createSound(doorsTimeline, "audio/doors", doorsGains);
