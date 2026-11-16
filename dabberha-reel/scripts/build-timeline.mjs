// Builds src/data/timeline.json: scene lengths fitted to the real voiceover,
// word timings in frames, and voice windows for music ducking.
// Uses public/audio/vo/<scene>.json (ElevenLabs alignment) when present,
// otherwise a reading-speed estimate so the visuals can be developed first.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = JSON.parse(readFileSync(path.join(root, "src/data/script.json"), "utf8"));
const FPS = 30;
const TOTAL = 1800;
const TAIL = 0.45; // seconds of breathing room after the last word of each scene

const audio = (...p) => path.join(root, "public/audio", ...p);

function estimate(text) {
  // ~ Saudi ad read: letters drive duration, punctuation adds pauses.
  const words = [];
  let t = 0;
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    const clean = raw.replace(/[،,.؟?!…:؛]/g, "");
    const d = 0.12 + clean.length * 0.062;
    words.push({ text: clean, raw, start: +t.toFixed(3), end: +(t + d).toFixed(3) });
    t += d + 0.06;
    if (/…/.test(raw)) t += 0.42;
    else if (/[.؟?!]/.test(raw)) t += 0.32;
    else if (/[،,]/.test(raw)) t += 0.16;
  }
  return { duration: t, words };
}

let allReal = true;
const raw = script.scenes.map((s) => {
  const f = audio("vo", `${s.id}.json`);
  if (existsSync(f)) return { ...s, vo: JSON.parse(readFileSync(f, "utf8")), real: true };
  allReal = false;
  return { ...s, vo: estimate(s.tts), real: false };
});

// The audible part of each clip ends at the last word; trailing silence is not counted.
const voEnd = (vo) => Math.max(...vo.words.map((w) => w.end));
const base = raw.map((s) => Math.ceil((s.leadSeconds + voEnd(s.vo) + TAIL) * FPS));
const baseSum = base.reduce((a, b) => a + b, 0);
if (baseSum > TOTAL) {
  console.error(
    `Voiceover needs ${(baseSum / FPS).toFixed(2)}s but the reel is ${TOTAL / FPS}s. Raise voice speed in script.json or shorten lines.`,
  );
  process.exit(1);
}

// Distribute the spare frames towards each scene's nominal (directed) length.
const nominal = raw.map((s) => s.nominalSeconds * FPS);
const want = nominal.map((n, i) => Math.max(n - base[i], 0));
const wantSum = want.reduce((a, b) => a + b, 0);
const slack = TOTAL - baseSum;
const dur = base.map((b, i) => b + (wantSum > 0 ? (slack * want[i]) / wantSum : slack / base.length));
// Integer frames, total exactly TOTAL
const rounded = dur.map(Math.floor);
let rest = TOTAL - rounded.reduce((a, b) => a + b, 0);
const order = dur.map((d, i) => [d - Math.floor(d), i]).sort((a, b) => b[0] - a[0]);
for (let k = 0; rest > 0; k++, rest--) rounded[order[k % order.length][1]]++;

let from = 0;
const voiceWindows = [];
const scenes = raw.map((s, i) => {
  const voFrom = Math.round(s.leadSeconds * FPS);
  const words = s.vo.words.map((w) => ({
    text: w.text,
    start: voFrom + Math.round(w.start * FPS),
    end: voFrom + Math.round(w.end * FPS),
  }));
  voiceWindows.push([from + words[0].start, from + words[words.length - 1].end]);
  const scene = {
    id: s.id,
    from,
    durationInFrames: rounded[i],
    voFrom,
    voDurationInFrames: Math.ceil(s.vo.duration * FPS),
    words,
  };
  from += rounded[i];
  return scene;
});

const has = (p) => existsSync(audio(p));
const timeline = {
  fps: FPS,
  durationInFrames: TOTAL,
  estimated: !allReal,
  audio: {
    vo: allReal,
    sfx: ["whoosh", "tick", "pop", "riser", "impact", "glitch"].every((x) => has(`sfx/${x}.mp3`)),
    music: has("music/bed.mp3"),
  },
  scenes,
  voiceWindows,
};
writeFileSync(path.join(root, "src/data/timeline.json"), JSON.stringify(timeline, null, 2) + "\n");
console.log(`timeline.json (${allReal ? "real VO timing" : "ESTIMATED timing"})`);
for (const s of scenes)
  console.log(
    `${s.id.padEnd(14)} from ${String(s.from).padStart(4)}  dur ${String(s.durationInFrames).padStart(4)} (${(s.durationInFrames / FPS).toFixed(2)}s)  words ${s.words.length}`,
  );
console.log("audio:", timeline.audio);
