// Render test stills from the engine: node film/tools/stills.mjs <out_dir> <t1> <t2> ...
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = createRequire(import.meta.url)('playwright');
const FILM = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [out, ...ts] = process.argv.slice(2);
const srv = spawn('python3', ['-m', 'http.server', '8811', '--bind', '127.0.0.1'], { cwd: FILM, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));
const b = await chromium.launch();
const V = !!process.env.VERT || !!process.env.BA;
const p = await b.newPage({ viewport: V ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', e => errs.push(e.message));
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('http://127.0.0.1:8811/engine/preview.html?still=1' + (process.env.BA ? '&ba=1' : V ? '&v=1' : ''));
await p.waitForFunction(() => window.READY, null, { timeout: 30000 }).catch(() => {});
for (const t of ts) {
  const t0 = Date.now();
  try { await p.evaluate(t => window.FILM.frame(+t), t); } catch (e) { errs.push(String(e)); }
  await p.locator('#cv').screenshot({ path: `${out}/t${String(t).padStart(6, '0')}.png` });
  console.log('t', t, Date.now() - t0, 'ms');
}
if (errs.length) console.log('ERRORS', errs.slice(0, 5));
await b.close(); srv.kill();
