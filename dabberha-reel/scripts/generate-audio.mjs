// Generates every audio asset for the reel with the ElevenLabs API.
//
//   node scripts/generate-audio.mjs voices          # search the voice library for "Nasser / ناصر"
//   VOICE_ID=xxx node scripts/generate-audio.mjs vo # voiceover per scene, with word timestamps
//   node scripts/generate-audio.mjs sfx             # sound effects
//   node scripts/generate-audio.mjs music           # music bed
//   VOICE_ID=xxx node scripts/generate-audio.mjs all
//
// The key is read from ELEVENLABS_API_KEY (environment or .env). It is never written to disk.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envFile = path.join(root, ".env");
if (existsSync(envFile)) process.loadEnvFile(envFile);

const API = "https://api.elevenlabs.io";
// ELEVENLABS_VIA_PROXY=1: the key is stored as a network secret and injected by the
// sandbox proxy, so only a placeholder header is sent from here.
const KEY = process.env.ELEVENLABS_API_KEY || (process.env.ELEVENLABS_VIA_PROXY === "1" ? "proxy-injected" : "");
const script = JSON.parse(readFileSync(path.join(root, "src/data/script.json"), "utf8"));
const out = (...p) => path.join(root, "public/audio", ...p);
const sourcesFile = out("sources.json");
const sources = existsSync(sourcesFile) ? JSON.parse(readFileSync(sourcesFile, "utf8")) : {};
const saveSources = () => writeFileSync(sourcesFile, JSON.stringify(sources, null, 2));

if (!KEY) {
  console.error(
    "ELEVENLABS_API_KEY is missing. Add it to dabberha-reel/.env (ELEVENLABS_API_KEY=...) or export it, then re-run.",
  );
  process.exit(1);
}

const headers = (extra = {}) => ({ "xi-api-key": KEY, ...extra });

async function api(method, url, body, accept = "application/json") {
  const res = await fetch(API + url, {
    method,
    headers: headers({
      Accept: accept,
      ...(body ? { "Content-Type": "application/json" } : {}),
    }),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`${method} ${url} -> ${res.status}: ${text.slice(0, 500)}`);
    err.status = res.status;
    throw err;
  }
  return accept === "application/json" ? res.json() : Buffer.from(await res.arrayBuffer());
}

const probeSeconds = (file) =>
  Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file])
      .toString()
      .trim(),
  );

// ---------------------------------------------------------------- voices
async function searchVoices() {
  const found = [];
  for (const term of [script.voice.searchName, script.voice.searchNameAr]) {
    const mine = await api("GET", `/v2/voices?search=${encodeURIComponent(term)}&page_size=100`);
    for (const v of mine.voices ?? [])
      found.push({
        source: "my-voices",
        voice_id: v.voice_id,
        name: v.name,
        category: v.category,
        labels: v.labels,
        description: v.description,
        preview_url: v.preview_url,
      });
    const shared = await api("GET", `/v1/shared-voices?search=${encodeURIComponent(term)}&page_size=100`);
    for (const v of shared.voices ?? [])
      found.push({
        source: "voice-library",
        voice_id: v.voice_id,
        public_owner_id: v.public_owner_id,
        name: v.name,
        language: v.language,
        accent: v.accent,
        gender: v.gender,
        age: v.age,
        use_case: v.use_case,
        description: v.description,
        preview_url: v.preview_url,
      });
  }
  const unique = [...new Map(found.map((v) => [v.voice_id, v])).values()].filter((v) =>
    /nasser|nasir|naser|ناصر/i.test(v.name ?? ""),
  );
  mkdirSync(out(), { recursive: true });
  writeFileSync(out("voice-candidates.json"), JSON.stringify(unique, null, 2));
  console.log(`Found ${unique.length} voice(s) named Nasser / ناصر:`);
  for (const v of unique)
    console.log(
      `- ${v.voice_id} | ${v.name} | ${v.source} | ${v.language ?? ""} ${v.accent ?? ""} ${v.gender ?? ""} | ${(v.description ?? "").slice(0, 90)}`,
    );
  return unique;
}

async function resolveVoice() {
  const candidates = existsSync(out("voice-candidates.json"))
    ? JSON.parse(readFileSync(out("voice-candidates.json"), "utf8"))
    : await searchVoices();
  let voice;
  if (process.env.VOICE_ID) {
    voice = candidates.find((v) => v.voice_id === process.env.VOICE_ID) ?? {
      voice_id: process.env.VOICE_ID,
      source: "explicit",
    };
  } else if (candidates.length === 1) {
    voice = candidates[0];
  } else {
    console.error(
      `${candidates.length} candidate voices — choose one and re-run with VOICE_ID=<id>. See public/audio/voice-candidates.json`,
    );
    process.exit(2);
  }
  // Library voices have to be added to the account before they can be used through the API.
  if (voice.source === "voice-library" && voice.public_owner_id) {
    try {
      const added = await api("POST", `/v1/voices/add/${voice.public_owner_id}/${voice.voice_id}`, {
        new_name: voice.name,
      });
      if (added?.voice_id) voice = { ...voice, account_voice_id: added.voice_id };
    } catch (e) {
      if (!/already|exists|duplicate/i.test(String(e.message))) console.warn("Could not add library voice:", e.message);
    }
  }
  return voice;
}

async function pickModel() {
  const models = await api("GET", "/v1/models");
  for (const id of script.voice.preferredModels) {
    const m = models.find((x) => x.model_id === id);
    if (m && m.can_do_text_to_speech && (m.languages ?? []).some((l) => l.language_id === "ar")) return m.model_id;
  }
  const anyArabic = models.find(
    (m) => m.can_do_text_to_speech && (m.languages ?? []).some((l) => l.language_id === "ar"),
  );
  if (!anyArabic) throw new Error("No Arabic-capable TTS model available on this account");
  return anyArabic.model_id;
}

// ---------------------------------------------------------------- voiceover
const PUNCT = /[\s،,.؟?!…:؛"«»()\-]/;

function alignmentToWords(al) {
  const words = [];
  let cur = null;
  for (let i = 0; i < al.characters.length; i++) {
    const ch = al.characters[i];
    if (/\s/.test(ch)) {
      if (cur) words.push(cur);
      cur = null;
      continue;
    }
    if (!cur) cur = { raw: "", start: al.character_start_times_seconds[i], end: al.character_end_times_seconds[i] };
    cur.raw += ch;
    if (!PUNCT.test(ch)) cur.end = al.character_end_times_seconds[i];
  }
  if (cur) words.push(cur);
  return words
    .map((w) => ({ text: w.raw.replace(/[،,.؟?!…:؛"«»()]/g, ""), raw: w.raw, start: w.start, end: w.end }))
    .filter((w) => w.text.length > 0);
}

async function tts(voiceId, modelId, text) {
  const body = {
    text,
    model_id: modelId,
    language_code: "ar",
    voice_settings: script.voice.settings,
  };
  return api("POST", `/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, body);
}

async function generateVoiceover() {
  const voice = await resolveVoice();
  const voiceId = voice.account_voice_id ?? voice.voice_id;
  let modelId = await pickModel();
  mkdirSync(out("vo"), { recursive: true });
  for (const scene of script.scenes) {
    let res;
    try {
      res = await tts(voiceId, modelId, scene.tts);
    } catch (e) {
      const fallback = script.voice.preferredModels.find((m) => m !== modelId);
      if (!fallback) throw e;
      console.warn(`${modelId} failed (${e.message.slice(0, 120)}). Falling back to ${fallback}.`);
      modelId = fallback;
      res = await tts(voiceId, modelId, scene.tts);
    }
    const mp3 = out("vo", `${scene.id}.mp3`);
    writeFileSync(mp3, Buffer.from(res.audio_base64, "base64"));
    const alignment = res.alignment ?? res.normalized_alignment;
    const words = alignmentToWords(alignment);
    writeFileSync(
      out("vo", `${scene.id}.json`),
      JSON.stringify({ text: scene.tts, duration: probeSeconds(mp3), words }, null, 2),
    );
    console.log(`VO ${scene.id}: ${words.length} words, ${probeSeconds(mp3).toFixed(2)}s`);
  }
  sources.voiceover = {
    provider: "ElevenLabs Text to Speech (with-timestamps)",
    voice_id: voiceId,
    voice_name: voice.name,
    voice_source: voice.source,
    model_id: modelId,
    settings: script.voice.settings,
    generated_at: new Date().toISOString(),
  };
  saveSources();
}

// ---------------------------------------------------------------- sfx
async function generateSfx() {
  mkdirSync(out("sfx"), { recursive: true });
  sources.sfx = [];
  for (const s of script.sfx) {
    const buf = await api(
      "POST",
      "/v1/sound-generation?output_format=mp3_44100_128",
      { text: s.prompt, duration_seconds: s.seconds, prompt_influence: 0.6 },
      "audio/mpeg",
    );
    writeFileSync(out("sfx", `${s.id}.mp3`), buf);
    sources.sfx.push({ id: s.id, provider: "ElevenLabs Sound Effects", prompt: s.prompt, seconds: s.seconds });
    console.log(`SFX ${s.id} ✓`);
  }
  saveSources();
}

// ---------------------------------------------------------------- music
async function generateMusic() {
  mkdirSync(out("music"), { recursive: true });
  const buf = await api(
    "POST",
    "/v1/music?output_format=mp3_44100_128",
    { prompt: script.music.prompt, music_length_ms: script.music.lengthMs, force_instrumental: true },
    "audio/mpeg",
  );
  writeFileSync(out("music", "bed.mp3"), buf);
  sources.music = {
    provider: "ElevenLabs Music",
    prompt: script.music.prompt,
    length_ms: script.music.lengthMs,
    instrumental: true,
    generated_at: new Date().toISOString(),
  };
  saveSources();
  console.log("Music ✓");
}

const step = process.argv[2] ?? "all";
if (step === "voices") await searchVoices();
if (step === "vo" || step === "all") await generateVoiceover();
if (step === "sfx" || step === "all") await generateSfx();
if (step === "music" || step === "all") await generateMusic();
