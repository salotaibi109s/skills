#!/usr/bin/env node
// الاستخدام: npm run check -- <id>    (بدون id يفحص كل الحلقات)
import {readFileSync, readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {validateEpisode, totalSeconds} from '../src/episode-schema.mjs';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'episodes');
const ids = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));

let failed = 0;
for (const id of ids) {
  const file = path.join(dir, `${id}.json`);
  let ep;
  try {
    ep = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    console.log(`✗ ${id}: ما قدرت أقرأ ${file} — ${e.message}`);
    failed++;
    continue;
  }
  const errors = validateEpisode(ep, id);
  if (errors.length) {
    failed++;
    console.log(`✗ ${id}\n  - ${errors.join('\n  - ')}`);
  } else {
    console.log(`✓ ${id} — ${ep.scenes.length} مشاهد، ${totalSeconds(ep)} ثانية`);
  }
}
process.exit(failed ? 1 : 0);
