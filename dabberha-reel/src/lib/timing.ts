// Shared timeline helpers for every video in this project.

export type Word = { text: string; raw?: string; start: number; end: number };
export type SceneTiming = {
  id: string;
  from: number;
  durationInFrames: number;
  transitionFrames?: number;
  voFrom: number;
  voDurationInFrames: number;
  words: Word[];
};
export type TimelineData = {
  fps: number;
  durationInFrames: number;
  estimated: boolean;
  audio: { vo: boolean; sfx: boolean; music: boolean };
  scenes: SceneTiming[];
  voiceWindows: number[][];
};

// Arabic normalisation so on-screen cues match the spoken words regardless of
// harakat, shadda, alef forms or punctuation in the TTS transcript.
export const normalizeAr = (s: string) =>
  s
    .replace(/[ً-ْٰـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^ء-ي0-9A-Za-z]/g, "");

export const findScene = (t: TimelineData, id: string): SceneTiming => {
  const s = t.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s;
};

const hits = (scene: SceneTiming, match: string) => {
  const m = normalizeAr(match);
  return scene.words.filter((w) => normalizeAr(w.text).includes(m));
};

/**
 * Frame (relative to the scene) at which the spoken word containing `match` starts.
 * Throws if the word is missing so a script change can never silently desync the picture.
 */
export const cue = (scene: SceneTiming, match: string, nth = 0): number => {
  const hit = hits(scene, match)[nth];
  if (!hit) throw new Error(`Cue "${match}" not found in ${scene.id}: ${scene.words.map((w) => w.text).join(" ")}`);
  return hit.start;
};

export const cueEnd = (scene: SceneTiming, match: string, nth = 0): number => {
  const hit = hits(scene, match)[nth];
  if (!hit) throw new Error(`Cue "${match}" not found in ${scene.id}`);
  return hit.end;
};

export const lastWordEnd = (scene: SceneTiming) => scene.words[scene.words.length - 1].end;
