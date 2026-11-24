// Builds a timeline JSON: scene lengths fitted to the real voiceover,
// word timings in frames, and voice windows for music ducking.
// Uses public/audio/<audioDir>/vo/<scene>.json (ElevenLabs alignment) when present,
// otherwise a reading-speed estimate so the visuals can be developed first.
//
//   node scripts/build-timeline.mjs                                   # reel (default)
//   SCRIPT=src/data/story-script.json OUT=src/data/story-timeline.json node scripts/build-timeline.mjs
//
// A scene may declare "transitionFrames": N — it then overlaps the next scene by N frames
// (TransitionSeries). Scene lengths are fitted so the finished video is still exactly TOTAL.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptPath = process.env.SCRIPT ?? "src/data/script.json";
const outPath = process.env.OUT ?? "src/data/timeline.json";
const script = JSON.parse(readFileSync(path.join(root, scriptPath), "utf8"));
const FPS = 30;
const TOTAL = script.totalFrames ?? 1800;
const TAIL = script.tailSeconds ?? 0.45; // breathing room after the last word of each scene

const audio = (...p) => path.join(root, "public/audio", script.audioDir ?? "", ...p);

function estimate(text) {
  const words = [];
  let t = 0;
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    const clean = raw.replace(/[،,.؟?!…:؛«»]/g, "");
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
  if (existsSync(f)) return { ...s, vo: JSON.parse(readFileSync(f, "utf8")) };
  allReal = false;
  return { ...s, vo: estimate(s.tts) };
});

const overlaps = raw.map((s, i) => (i < raw.length - 1 ? (s.transitionFrames ?? 0) : 0));
const overlapSum = overlaps.reduce((a, b) => a + b, 0);
const TARGET = TOTAL + overlapSum; // sum of sequence lengths before overlaps

// The audible part of each clip ends at the last word; trailing silence is not counted.
const voEnd = (vo) => Math.max(...vo.words.map((w) => w.end));
// A scene must also outlast the transition that leaves it.
const base = raw.map((s, i) => Math.max(Math.ceil((s.leadSeconds + voEnd(s.vo) + TAIL) * FPS) + overlaps[i], (s.minSeconds ?? 0) * FPS));
const baseSum = base.reduce((a, b) => a + b, 0);
if (baseSum > TARGET) {
  console.error(
    `Voiceover needs ${((baseSum - overlapSum) / FPS).toFixed(2)}s but the video is ${TOTAL / FPS}s. Raise voice speed or shorten lines.`,
  );
  process.exit(1);
}

// Distribute the spare frames towards each scene's nominal (directed) length.
const nominal = raw.map((s, i) => s.nominalSeconds * FPS + overlaps[i]);
const want = nominal.map((n, i) => Math.max(n - base[i], 0));
const wantSum = want.reduce((a, b) => a + b, 0);
const slack = TARGET - baseSum;
const dur = base.map((b, i) => b + (wantSum > 0 ? (slack * want[i]) / wantSum : slack / base.length));
const rounded = dur.map(Math.floor);
let rest = TARGET - rounded.reduce((a, b) => a + b, 0);
const order = dur.map((d, i) => [d - Math.floor(d), i]).sort((a, b) => b[0] - a[0]);
for (let k = 0; rest > 0; k++, rest--) rounded[order[k % order.length][1]]++;

let from = 0;
const voiceWindows = [];
const scenes = raw.map((s, i) => {
  const voFrom = Math.round(s.leadSeconds * FPS);
  const words = s.vo.words.map((w) => ({
    text: w.text,
    raw: w.raw ?? w.text,
    start: voFrom + Math.round(w.start * FPS),
    end: voFrom + Math.round(w.end * FPS),
  }));
  voiceWindows.push([from + words[0].start, from + words[words.length - 1].end]);
  const scene = {
    id: s.id,
    from,
    durationInFrames: rounded[i],
    transitionFrames: overlaps[i],
    voFrom,
    voDurationInFrames: Math.ceil(s.vo.duration * FPS),
    words,
  };
  from += rounded[i] - overlaps[i];
  return scene;
});

const has = (p) => existsSync(audio(p));
const musicIds = Array.isArray(script.music) ? script.music.map((m) => m.id) : ["bed"];
const timeline = {
  fps: FPS,
  durationInFrames: TOTAL,
  estimated: !allReal,
  audio: {
    vo: allReal,
    sfx: script.sfx.every((x) => has(`sfx/${x.id}.mp3`)),
    music: musicIds.every((id) => has(`music/${id}.mp3`)),
  },
  scenes,
  voiceWindows,
};
writeFileSync(path.join(root, outPath), JSON.stringify(timeline, null, 2) + "\n");
console.log(`${outPath} (${allReal ? "real VO timing" : "ESTIMATED timing"})`);
for (const s of scenes)
  console.log(
    `${s.id.padEnd(16)} from ${String(s.from).padStart(4)}  dur ${String(s.durationInFrames).padStart(4)} (${(s.durationInFrames / FPS).toFixed(2)}s)  overlap ${s.transitionFrames}  words ${s.words.length}`,
  );
console.log(`ends at frame ${from + overlaps[overlaps.length - 1]} (target ${TOTAL})`, "audio:", timeline.audio);
