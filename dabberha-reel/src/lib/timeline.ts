import timeline from "../data/timeline.json";

export type Word = { text: string; start: number; end: number };
export type SceneTiming = (typeof timeline.scenes)[number];
export type SceneId =
  | "S1-Hook"
  | "S2-Problem"
  | "S3-Reveal"
  | "S4-Government"
  | "S5-Business"
  | "S6-RealEstate"
  | "S7-Trust"
  | "S8-CTA";

export { timeline };

export const getScene = (id: SceneId): SceneTiming => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s;
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

/**
 * Frame (relative to the scene) at which the spoken word containing `match` starts.
 * `nth` selects a later occurrence. Throws if the word is missing so a script
 * change can never silently desync the picture.
 */
export const cue = (scene: SceneTiming, match: string, nth = 0): number => {
  const m = normalizeAr(match);
  const hits = scene.words.filter((w) => normalizeAr(w.text).includes(m));
  const hit = hits[nth];
  if (!hit) throw new Error(`Cue "${match}" not found in ${scene.id}: ${scene.words.map((w) => w.text).join(" ")}`);
  return hit.start;
};

export const cueEnd = (scene: SceneTiming, match: string, nth = 0): number => {
  const m = normalizeAr(match);
  const hits = scene.words.filter((w) => normalizeAr(w.text).includes(m));
  const hit = hits[nth];
  if (!hit) throw new Error(`Cue "${match}" not found in ${scene.id}`);
  return hit.end;
};

export const lastWordEnd = (scene: SceneTiming) => scene.words[scene.words.length - 1].end;
