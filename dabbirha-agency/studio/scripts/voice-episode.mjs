#!/usr/bin/env node
// صوت ناصر من ElevenLabs لكل مشهد فيه "say".
// الاستخدام: npm run voice -- <id> [--force]
// المفتاح: ELEVENLABS_API_KEY أو ELEVENLABS_KEY_FILE (ملف فيه المفتاح) أو ELEVENLABS_VIA_PROXY=1 (سر شبكة في البيئة).
// يحفظ: public/voiceovers/<id>/NN.mp3 + NN.json (توقيت كل حرف)، ويحدّث audio ومدة المشهد في ملف الحلقة.
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {validateEpisode} from '../src/episode-schema.mjs';

const studio = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith('--'));
const force = args.includes('--force');
if (!id) {
  console.error('الاستخدام: npm run voice -- <id> [--force]');
  process.exit(1);
}

const KEY =
  process.env.ELEVENLABS_API_KEY ||
  (process.env.ELEVENLABS_KEY_FILE ? readFileSync(process.env.ELEVENLABS_KEY_FILE, 'utf8').trim() : '') ||
  (process.env.ELEVENLABS_VIA_PROXY === '1' ? 'proxy-injected' : '');
if (!KEY) {
  console.error('✗ مفتاح ElevenLabs غير موجود (ELEVENLABS_API_KEY أو ELEVENLABS_KEY_FILE أو ELEVENLABS_VIA_PROXY=1)');
  process.exit(1);
}

// صوت دبّرها الافتراضي: ناصر الجبيلي — نفس إعدادات فيديوهات dabberha-reel
const DEFAULT_VOICE = {
  id: 'cFUFIbKkO2iZFwS8cRnY',
  model: 'eleven_v4',
  settings: {stability: 0.45, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true, speed: 1.0},
};
const BREATH = 0.6; // ثواني بعد نهاية الجملة قبل المشهد التالي

const file = path.join(studio, 'src', 'episodes', `${id}.json`);
const ep = JSON.parse(readFileSync(file, 'utf8'));
const voice = {...DEFAULT_VOICE, ...(ep.voice ?? {}), settings: {...DEFAULT_VOICE.settings, ...(ep.voice?.settings ?? {})}};
const outDir = path.join(studio, 'public', 'voiceovers', id);
mkdirSync(outDir, {recursive: true});

let chars = 0;
for (const [i, scene] of ep.scenes.entries()) {
  if (!scene.say) continue;
  const n = String(i + 1).padStart(2, '0');
  const mp3 = path.join(outDir, `${n}.mp3`);
  const meta = path.join(outDir, `${n}.json`);
  let alignment;
  if (!force && existsSync(mp3) && existsSync(meta) && JSON.parse(readFileSync(meta, 'utf8')).text === scene.say) {
    alignment = JSON.parse(readFileSync(meta, 'utf8')).alignment;
    console.log(`[voice] ${n} موجود — تخطّي`);
  } else {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.id}/with-timestamps?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {'xi-api-key': KEY, 'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({text: scene.say, model_id: voice.model, voice_settings: voice.settings}),
    });
    if (!res.ok) {
      console.error(`✗ المشهد ${i + 1}: ${res.status} ${(await res.text()).slice(0, 300)}`);
      process.exit(1);
    }
    const data = await res.json();
    writeFileSync(mp3, Buffer.from(data.audio_base64, 'base64'));
    alignment = data.alignment;
    writeFileSync(meta, JSON.stringify({text: scene.say, voice: voice.id, model: voice.model, alignment}));
    chars += scene.say.length;
    console.log(`[voice] ${n} ✓`);
  }
  const ends = alignment?.character_end_times_seconds ?? [];
  const spoken = ends.length ? ends[ends.length - 1] : 0;
  const need = Math.ceil((spoken + BREATH) * 2) / 2; // لأقرب نص ثانية
  scene.audio = `voiceovers/${id}/${n}.mp3`;
  if (!scene.durationSec || scene.durationSec < need) scene.durationSec = need;
  console.log(`         ${spoken.toFixed(2)} ث كلام → المشهد ${scene.durationSec} ث`);
}

// اكتب الملف: مشهد بسطر عشان يسهل قراءته
const {scenes, ...rest} = ep;
const head = JSON.stringify(rest, null, 2).replace(/\n}$/, '');
const body = scenes.map((s) => '    ' + JSON.stringify(s)).join(',\n');
writeFileSync(file, `${head},\n  "scenes": [\n${body}\n  ]\n}\n`);

const errors = validateEpisode(ep, id);
console.log(errors.length ? `⚠ أخطاء:\n- ${errors.join('\n- ')}` : `✓ ${id} جاهز للرندر`);
if (chars) console.log(`[voice] استهلاك تقريبي: ${chars} حرف`);
