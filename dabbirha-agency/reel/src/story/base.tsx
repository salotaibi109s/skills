import data from "../data/story-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData } from "../lib/timing";
import { colors, db } from "../theme";

export { cue, cueEnd, lastWordEnd } from "../lib/timing";
export type { SceneTiming } from "../lib/timing";

export type StorySceneId =
  | "T1-Ticket"
  | "T2-Road"
  | "T3-Office"
  | "T4-Closed"
  | "T5-Rewind"
  | "T6-Home"
  | "T7-NumberOne"
  | "T8-CTA";

export const storyTimeline = data as TimelineData;
export const getStoryScene = (id: StorySceneId): SceneTiming => findScene(storyTimeline, id);

// Story palette: warm, daylight, slightly dusty for the "office day";
// the solution switches to the brand navy / teal / ice of the store.
export const story = {
  paper: "#FFFDF8",
  cream: "#F6EFE4",
  sand: "#EADBC4",
  wall: "#EFE3D2",
  wallDark: "#D9C8B0",
  ink: "#1E2230",
  inkSoft: "#4A4F5C",
  warm: "#E8915B",
  red: "#D64545",
  led: "#FF3B30",
  skyTop: "#FFC98B",
  skyBottom: "#FFF1DC",
  asphalt: "#4A4F5C",
  night: "#14161F",
  gold: "#FFC857",
  skin: ["#C98E63", "#B57A4F", "#D9A577", "#A86F45"],
  brand: colors,
} as const;

export const storyGains: Record<string, number> = {
  whoosh: db(-12),
  tick: db(-22),
  pop: db(-14),
  clock: db(-16),
  horn: db(-12),
  crowd: db(-11),
  ding: db(-8),
  shutter: db(-6),
  rewind: db(-8),
  notify: db(-9),
  success: db(-8),
  printer: db(-8),
};

export const { Sfx, SceneVoice, Music } = createSound(storyTimeline, "audio/story", storyGains);
