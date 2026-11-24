#!/usr/bin/env node
// الاستخدام: npm run render -- <id> [--skip-video]
// يسلّم في ../episodes/<id>/:
//   video-vertical.mp4  الفيديو النهائي 1080x1920 30fps
//   cover.jpg           الغلاف (آخر لحظة من الهوك بعد ما يكتمل النص)
//   checks/NN-<type>.jpg لقطة لكل مشهد مع هامش الأمان بالأحمر — للفحص فقط
import {mkdirSync, readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {validateEpisode, sceneStarts, sceneFrames, totalSeconds} from '../src/episode-schema.mjs';

const studio = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith('--'));
const skipVideo = args.includes('--skip-video');
if (!id) {
  console.error('الاستخدام: npm run render -- <id> [--skip-video]');
  process.exit(1);
}

const ep = JSON.parse(readFileSync(path.join(studio, 'src', 'episodes', `${id}.json`), 'utf8'));
const errors = validateEpisode(ep, id);
if (errors.length) {
  console.error(`✗ الحلقة فيها أخطاء:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

const outDir = path.join(studio, '..', 'episodes', id);
const checksDir = path.join(outDir, 'checks');
if (!existsSync(outDir)) console.warn(`تنبيه: ${outDir} غير موجود (ما فيه brief.md) — بأنشئه`);
mkdirSync(checksDir, {recursive: true});

const browserExecutable = process.env.BROWSER_EXECUTABLE || null;
const log = (m) => console.log(`[render] ${m}`);

log('تجميع المشروع…');
const serveUrl = await bundle({entryPoint: path.join(studio, 'src', 'index.ts')});

const pick = (inputProps) =>
  selectComposition({serveUrl, id, inputProps, browserExecutable});

const starts = sceneStarts(ep);

// لقطات الفحص: لكل مشهد عند اكتمال حركة النص (أو قبل خروجه)
const checkComp = await pick({showSafeZone: true});
for (const [i, scene] of ep.scenes.entries()) {
  const frames = sceneFrames(scene);
  const at = starts[i] + Math.min(frames - 10, 40);
  const file = path.join(checksDir, `${String(i + 1).padStart(2, '0')}-${scene.type}.jpg`);
  await renderStill({
    composition: checkComp,
    serveUrl,
    output: file,
    frame: at,
    imageFormat: 'jpeg',
    jpegQuality: 80,
    scale: 0.5,
    inputProps: {showSafeZone: true},
    browserExecutable,
  });
  log(`لقطة فحص ${path.relative(studio, file)} (إطار ${at})`);
}

const comp = await pick({});
const coverFrame = Math.max(0, sceneFrames(ep.scenes[0]) - 10);
await renderStill({
  composition: comp,
  serveUrl,
  output: path.join(outDir, 'cover.jpg'),
  frame: coverFrame,
  imageFormat: 'jpeg',
  jpegQuality: 90,
  browserExecutable,
});
log(`الغلاف cover.jpg (إطار ${coverFrame})`);

if (!skipVideo) {
  let last = -1;
  await renderMedia({
    composition: comp,
    serveUrl,
    codec: 'h264',
    crf: 20,
    outputLocation: path.join(outDir, 'video-vertical.mp4'),
    browserExecutable,
    onProgress: ({progress}) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== last) {
        last = pct;
        log(`الفيديو ${pct}%`);
      }
    },
  });
  log(`الفيديو video-vertical.mp4 (${totalSeconds(ep)} ثانية)`);
}

console.log(`✓ تم: ${path.relative(path.join(studio, '..'), outDir)}`);
