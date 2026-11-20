// How It's Built, in Arabic with Nasser's voice.
//
//   node scripts/hib.mjs <name> voice    // Nasser reads each script line (ElevenLabs, eleven_v4); word times go into spec.json
//   node scripts/hib.mjs <name> render   // Blender renders the 3D build (no captions, no sound) through the skill's make_short.py
//   node scripts/hib.mjs <name> publish  // copies the render, voice and timings to public/hib/<name>/ for the Remotion "HowBuilt" composition
//
// <name> is a folder in hib/ holding spec.json (the skill's format; script lines may be Arabic, and a part's "at"
// may be an Arabic word: a word that contains it also matches, for prefixes like و / ال).
// The key is read from ELEVENLABS_API_KEY or .env, and is never written anywhere.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SKILL = path.resolve(ROOT, "..", ".claude/skills/how-its-built-starter");
const [name, step] = process.argv.slice(2);
if (!name || !["voice", "render", "publish"].includes(step)) {
  console.error("usage: node scripts/hib.mjs <name> voice|render|publish");
  process.exit(1);
}
const DIR = path.join(ROOT, "hib", name);
const SPEC = path.join(DIR, "spec.json");
const spec = JSON.parse(readFileSync(SPEC, "utf8"));

const LEAD = 0.4; // seconds before the first word
const GAP = 0.28; // pause between lines
const TAIL = 1.6; // seconds after the last word
const VOICE_ID = "cFUFIbKkO2iZFwS8cRnY"; // Nasser
const MODEL = "eleven_v4";
const SETTINGS = { stability: 0.45, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true, speed: 1.0 };

const probe = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString().trim());

async function voice() {
  const envFile = path.join(ROOT, ".env");
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  const KEY = process.env.ELEVENLABS_API_KEY;
  if (!KEY) throw new Error("ELEVENLABS_API_KEY is missing (dabberha-reel/.env)");
  mkdirSync(path.join(DIR, "vo"), { recursive: true });
  const words = [];
  const parts = [];
  let t = LEAD;
  for (const [i, line] of spec.script.entries()) {
    let res;
    for (let attempt = 1; ; attempt++) {
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`, {
        method: "POST",
        headers: { "xi-api-key": KEY, "content-type": "application/json" },
        body: JSON.stringify({ text: line, model_id: MODEL, voice_settings: SETTINGS }),
      });
      if (r.ok) {
        res = await r.json();
        break;
      }
      const msg = (await r.text()).slice(0, 200);
      if (attempt >= 4 || [400, 401, 422].includes(r.status)) throw new Error(`line ${i + 1}: HTTP ${r.status} ${msg}`);
      await new Promise((ok) => setTimeout(ok, 3000 * attempt));
    }
    const mp3 = path.join(DIR, "vo", `${String(i + 1).padStart(2, "0")}.mp3`);
    writeFileSync(mp3, Buffer.from(res.audio_base64, "base64"));
    const al = res.alignment ?? res.normalized_alignment;
    const chars = al.characters.join("");
    // each script word (split on spaces, exactly as the skill does) gets the time of its first character
    let from = 0;
    for (const m of line.matchAll(/\S+/g)) {
      let idx = chars.indexOf(m[0], from);
      if (idx < 0) idx = Math.min(m.index, al.character_start_times_seconds.length - 1);
      const end = Math.min(idx + m[0].length - 1, al.character_end_times_seconds.length - 1);
      words.push({ text: m[0], start: +(t + al.character_start_times_seconds[idx]).toFixed(3), end: +(t + al.character_end_times_seconds[end]).toFixed(3), line: i });
      from = idx + m[0].length;
    }
    parts.push({ file: mp3, at: t });
    const dur = probe(mp3);
    console.log(`line ${i + 1}: ${dur.toFixed(2)}s`);
    t += dur + GAP;
  }
  // one voice track: each line placed at its start time
  const total = t - GAP + TAIL;
  const inputs = parts.flatMap((p) => ["-i", p.file]);
  const filters = parts.map((p, k) => `[${k}:a]adelay=${Math.round(p.at * 1000)}|${Math.round(p.at * 1000)}[a${k}]`).join(";");
  const mix = parts.map((_, k) => `[a${k}]`).join("") + `amix=inputs=${parts.length}:normalize=0,apad=whole_dur=${total.toFixed(2)}[out]`;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", `${filters};${mix}`, "-map", "[out]", "-ac", "1", "-ar", "44100", "-b:a", "160k", path.join(DIR, "nasser.mp3")]);
  spec.word_times = words.map(({ start, end }) => ({ start, end }));
  spec.duration = +total.toFixed(2);
  spec.captions = false;
  writeFileSync(SPEC, JSON.stringify(spec, null, 1));
  writeFileSync(path.join(DIR, "words.json"), JSON.stringify(words, null, 1));
  console.log(`voice: ${total.toFixed(1)} s, ${words.length} words -> ${path.relative(ROOT, DIR)}/nasser.mp3, word_times added to spec.json`);
}

function render() {
  if (!spec.word_times) throw new Error("run the voice step first (spec.json has no word_times)");
  const fast = process.argv.includes("--fast") ? ["--fast"] : [];
  execFileSync("python3", [path.join(SKILL, "make_short.py"), DIR, ...fast], { stdio: "inherit" });
}

function publish() {
  const out = path.join(ROOT, "public", "hib", name);
  mkdirSync(out, { recursive: true });
  copyFileSync(path.join(DIR, "short.mp4"), path.join(out, "build.mp4"));
  copyFileSync(path.join(DIR, "nasser.mp3"), path.join(out, "nasser.mp3"));
  const render = JSON.parse(readFileSync(path.join(DIR, "render.json"), "utf8"));
  const words = JSON.parse(readFileSync(path.join(DIR, "words.json"), "utf8"));
  const meta = { name, duration: spec.duration, words, arrivals: render.arrivals ?? [], lines: spec.script, outro: spec.outro ?? null };
  writeFileSync(path.join(out, "meta.json"), JSON.stringify(meta, null, 1));
  console.log(`published -> public/hib/${name}/ (render: npx remotion render HowBuilt out/hib-${name}.mp4 --props='{"name":"${name}"}')`);
}

if (step === "voice") await voice();
else if (step === "render") render();
else publish();
