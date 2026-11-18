// CLAUDE — BEYOND THE CHAT · film engine core
// Deterministic 2D/pseudo-3D renderer. Every frame is a pure function of time t.

const W = 1920, H = 1080;
const P = { // palette
  char: '#0b0d12', char2: '#12151d', blue: '#2f6bff', cyan: '#22d3ee', sky: '#7dd3fc',
  purple: '#5b21b6', violet: '#7c3aed', white: '#f4f7ff', orange: '#f59e0b', ink: '#e8eefc', mut: '#8a96b3',
  red: '#f87171', green: '#34d399'
};
const AR = '"Tajawal","Space Grotesk",sans-serif';
const KUFI = '"Noto Kufi Arabic","Tajawal",sans-serif';
const LAT = '"Space Grotesk","Tajawal",sans-serif';
const MONO = '"JetBrains Mono",monospace';

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = {
  io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
  expo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  back: t => { const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
};
// envelope: fades in over fi after a, out over fo before b
function env(t, a, b, fi = .4, fo = .4) {
  if (t < a || t > b) return 0;
  return Math.min(fi > 0 ? clamp((t - a) / fi) : 1, fo > 0 ? clamp((b - t) / fo) : 1);
}
function mulberry(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hash = (n) => { const r = mulberry(n * 9301 + 49297); return r(); };
const noise1 = (x) => { const i = Math.floor(x), f = x - i; const u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; };

// ---------- canvas helpers ----------
function rrect(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }
function font(c, size, fam = AR, weight = 500) { c.font = `${weight} ${size}px ${fam}`; }

function text(c, s, x, y, o = {}) {
  const { size = 40, fam = AR, weight = 500, color = P.ink, align = 'center', alpha = 1, glow = 0, glowColor = P.cyan, dir = 'rtl', base = 'middle', spacing = 0 } = o;
  if (alpha <= 0) return;
  c.save(); c.globalAlpha *= alpha; font(c, size, fam, weight);
  c.textAlign = align; c.textBaseline = base; c.direction = dir;
  if (spacing) c.letterSpacing = spacing + 'px';
  if (glow) { c.shadowColor = glowColor; c.shadowBlur = glow; }
  c.fillStyle = color; c.fillText(s, x, y);
  c.restore();
}
function wrap(c, s, maxW, size, fam = AR, weight = 500) {
  font(c, size, fam, weight); const words = s.split(' '); const lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}

// image drawing: cover a box with an image region; sy = scroll fraction (0..1) of overflow
function drawImg(c, img, x, y, w, h, o = {}) {
  if (!img || !img.width) return;
  const { sx = 0, sy = 0, zoom = 1, fit = 'width', ox = .5 } = o;
  const s = (fit === 'width' ? w / img.width : Math.max(w / img.width, h / img.height)) * zoom;
  const dw = img.width * s, dh = img.height * s;
  const px = x - (dw - w) * (fit === 'width' && zoom === 1 ? 0 : ox) - sx * Math.max(0, dw - w);
  const py = y - sy * Math.max(0, dh - h);
  c.save(); rrect(c, x, y, w, h, 10); c.clip(); c.drawImage(img, px, py, dw, dh); c.restore();
}

// ---------- environment pieces ----------
function bg(c, top, bottom, glowX = W / 2, glowY = H * .4, glowCol = P.blue, glowA = .25, glowR = 900) {
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bottom);
  c.fillStyle = g; c.fillRect(-W, -H, W * 3, H * 3);
  const r = c.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowR);
  r.addColorStop(0, rgba(glowCol, glowA)); r.addColorStop(1, rgba(glowCol, 0));
  c.fillStyle = r; c.fillRect(-W, -H, W * 3, H * 3);
}
// perspective floor grid; horizon y, camera forward offset z
function grid(c, t, o = {}) {
  const { hy = H * .62, color = P.cyan, alpha = .35, z = 0, spacing = 120, cx = W / 2, lines = 34 } = o;
  c.save(); c.strokeStyle = color; c.lineWidth = 1.2;
  const depth = 18;
  for (let i = 0; i < depth; i++) {
    const zz = ((i - (z / spacing) % 1) + depth) % depth + .3;
    const y = hy + 520 / zz; if (y > H + 40) continue;
    c.globalAlpha = alpha * clamp(1 - zz / depth) * 1.2; c.beginPath(); c.moveTo(-W, y); c.lineTo(W * 2, y); c.stroke();
  }
  for (let i = -lines; i <= lines; i++) {
    c.globalAlpha = alpha * .55 * (1 - Math.abs(i) / lines);
    c.beginPath(); c.moveTo(cx + i * 6, hy); c.lineTo(cx + i * 260, H + 300); c.stroke();
  }
  const g = c.createLinearGradient(0, hy - 2, 0, hy + 200); g.addColorStop(0, rgba(color, .0)); g.addColorStop(.02, rgba(color, alpha * .5)); g.addColorStop(1, rgba(color, 0));
  c.globalAlpha = 1; c.fillStyle = g; c.fillRect(-W, hy - 2, W * 3, 200);
  c.restore();
}
// 3D particle field flowing toward camera
const FIELD = (() => { const r = mulberry(7); return Array.from({ length: 420 }, () => ({ x: (r() - .5) * 4000, y: (r() - .5) * 2400, z: r() * 3000, s: r() * 1.6 + .4, c: r() })); })();
function particles(c, t, o = {}) {
  const { speed = 120, alpha = .8, colors = [P.cyan, P.white, P.sky], cx = W / 2, cy = H / 2, count = 420, drift = 0 } = o;
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < count; i++) {
    const p = FIELD[i];
    const z = ((p.z - t * speed) % 3000 + 3000) % 3000 + 50;
    const k = 700 / z; const x = cx + (p.x + Math.sin(t * .3 + i) * drift) * k, y = cy + p.y * k;
    if (x < -50 || x > W + 50 || y < -50 || y > H + 50) continue;
    const a = alpha * clamp(1 - z / 3000) * clamp(z / 300);
    c.globalAlpha = a; c.fillStyle = colors[Math.floor(p.c * colors.length)];
    c.beginPath(); c.arc(x, y, p.s * k * 2.2, 0, 7); c.fill();
  }
  c.restore();
}
function lightRays(c, x, y, t, o = {}) {
  const { n = 14, len = 1400, color = P.sky, alpha = .18, spread = Math.PI * 2, rot = 0, width = .09 } = o;
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * spread + Math.sin(t * .4 + i * 1.7) * .05;
    const w = width * (0.6 + .4 * Math.sin(t * .9 + i));
    const g = c.createRadialGradient(x, y, 0, x, y, len);
    g.addColorStop(0, rgba(color, alpha)); g.addColorStop(1, rgba(color, 0));
    c.fillStyle = g; c.beginPath(); c.moveTo(x, y);
    c.arc(x, y, len, a - w / 2, a + w / 2); c.closePath(); c.fill();
  }
  c.restore();
}
function glowDot(c, x, y, r, color, a = 1) {
  const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(color, a)); g.addColorStop(1, rgba(color, 0));
  c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.restore();
}

// ---------- holographic panel ----------
function holo(c, x, y, w, h, o = {}) {
  const { alpha = 1, title = '', img = null, sy = 0, sx = 0, zoom = 1, color = P.cyan, live = false, scan = 0, t = 0, ox = .5, badge = null, fill = 'rgba(10,14,22,.86)' } = o;
  if (alpha <= 0) return;
  c.save(); c.globalAlpha *= alpha;
  // glow body
  c.shadowColor = rgba(color, .55); c.shadowBlur = 40; rrect(c, x, y, w, h, 16); c.fillStyle = fill; c.fill(); c.shadowBlur = 0;
  const hb = title ? 38 : 0;
  if (img) drawImg(c, img, x + 8, y + hb + 8, w - 16, h - hb - 16, { sy, sx, zoom, ox });
  // header
  if (title) {
    c.fillStyle = rgba(color, .1); rrect(c, x, y, w, hb, [16, 16, 0, 0]); c.fill();
    for (let i = 0; i < 3; i++) { c.fillStyle = rgba(P.white, .25); c.beginPath(); c.arc(x + 22 + i * 18, y + hb / 2, 5, 0, 7); c.fill(); }
    text(c, title, x + w - 20, y + hb / 2 + 1, { size: 17, align: 'right', color: P.ink, fam: LAT + ',' + AR, weight: 500 });
  }
  // border + corner brackets
  c.strokeStyle = rgba(color, .75); c.lineWidth = 1.5; rrect(c, x, y, w, h, 16); c.stroke();
  c.strokeStyle = color; c.lineWidth = 3; const L = 26;
  for (const [cx, cy, dx, dy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
    c.beginPath(); c.moveTo(cx + dx * L, cy - dy * 6 + dy * 6); c.lineTo(cx, cy); c.lineTo(cx, cy + dy * L); c.stroke();
  }
  // scan sweep
  if (scan > 0) {
    const sy2 = y + ((t * 220) % (h + 200)) - 100;
    const g = c.createLinearGradient(0, sy2 - 60, 0, sy2 + 6); g.addColorStop(0, rgba(color, 0)); g.addColorStop(1, rgba(color, .18 * scan));
    c.save(); rrect(c, x, y, w, h, 16); c.clip(); c.fillStyle = g; c.fillRect(x, sy2 - 60, w, 66); c.restore();
  }
  if (live) liveBadge(c, x + 16, y + h - 16, badge);
  c.restore();
}
function liveBadge(c, x, y, label) {
  const s = label || 'LIVE CAPTURE · لقطة حقيقية';
  font(c, 15, LAT + ',' + AR, 700); const w = c.measureText(s).width + 40;
  c.save(); c.fillStyle = 'rgba(8,10,16,.88)'; rrect(c, x, y - 30, w, 30, 15); c.fill();
  c.strokeStyle = rgba(P.orange, .9); c.lineWidth = 1.2; c.stroke();
  c.fillStyle = P.orange; c.beginPath(); c.arc(x + 16, y - 15, 5, 0, 7); c.fill();
  text(c, s, x + 28, y - 14, { size: 15, align: 'left', dir: 'ltr', fam: LAT + ',' + AR, weight: 700, color: P.white });
  c.restore();
}

// ---------- prompt card (generic chat input; not a product screenshot) ----------
function promptCard(c, x, y, w, lines, p, o = {}) {
  const { alpha = 1, attach = null, t = 0, label = 'Prompt', mono = false } = o;
  if (alpha <= 0) return;
  const full = lines.join(' ');
  const n = Math.floor(full.length * clamp(p));
  const shown = full.slice(0, n);
  const size = mono ? 26 : 31;
  const wl = wrap(c, full, w - 90, size, mono ? MONO + ',' + AR : AR, 500);
  // map shown chars onto the wrapped lines
  let rem = shown.length; const out = [];
  for (const L of wl) { if (rem <= 0) break; out.push(L.slice(0, rem)); rem -= L.length + 1; }
  const lh = size * 1.55, hb = attach ? 58 : 0;
  const h = 64 + hb + Math.max(1, wl.length) * lh + 52;
  c.save(); c.globalAlpha *= alpha;
  c.shadowColor = rgba(P.cyan, .35); c.shadowBlur = 50;
  rrect(c, x, y, w, h, 26); c.fillStyle = 'rgba(14,18,28,.94)'; c.fill(); c.shadowBlur = 0;
  c.strokeStyle = rgba(P.cyan, .5); c.lineWidth = 1.5; c.stroke();
  text(c, label, x + w - 32, y + 34, { size: 17, align: 'right', color: P.cyan, fam: LAT, weight: 700, dir: 'ltr', spacing: 2 });
  if (attach) {
    const aw = 470; rrect(c, x + w - 32 - aw, y + 56, aw, 44, 12); c.fillStyle = 'rgba(52,211,153,.10)'; c.fill(); c.strokeStyle = rgba(P.green, .6); c.stroke();
    c.fillStyle = P.green; rrect(c, x + w - 72, y + 66, 26, 24, 4); c.fill();
    text(c, 'X', x + w - 59, y + 79, { size: 15, fam: LAT, weight: 700, color: '#06130d', dir: 'ltr' });
    text(c, attach, x + w - 86, y + 79, { size: 19, align: 'right', dir: 'ltr', fam: MONO, color: P.ink });
  }
  out.forEach((L, i) => text(c, L, x + w - 40, y + 72 + hb + i * lh + lh / 2, { size, align: 'right', color: P.white, fam: mono ? MONO + ',' + AR : AR }));
  // caret
  if (p < 1 && Math.floor(t * 2.2) % 2 === 0) {
    const li = Math.max(0, out.length - 1); font(c, size, AR); const tw = c.measureText(out[li] || '').width;
    c.fillStyle = P.cyan; c.fillRect(x + w - 44 - tw - 4, y + 72 + hb + li * lh + 8, 3, lh - 16);
  }
  // send button
  const done = p >= 1; c.fillStyle = done ? P.orange : rgba(P.white, .12);
  c.beginPath(); c.arc(x + 46, y + h - 42, 22, 0, 7); c.fill();
  c.strokeStyle = done ? '#1a1205' : rgba(P.white, .5); c.lineWidth = 3; c.beginPath();
  c.moveTo(x + 46, y + h - 32); c.lineTo(x + 46, y + h - 52); c.moveTo(x + 37, y + h - 44); c.lineTo(x + 46, y + h - 53); c.lineTo(x + 55, y + h - 44); c.stroke();
  c.restore();
  return h;
}

// ---------- cursor & click ----------
function cursor(c, x, y, click = 0, color = P.white) {
  c.save();
  if (click > 0 && click < 1) { c.strokeStyle = rgba(P.cyan, 1 - click); c.lineWidth = 3; c.beginPath(); c.arc(x, y, 10 + click * 46, 0, 7); c.stroke(); }
  c.translate(x, y); c.fillStyle = color; c.strokeStyle = '#0b0d12'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 34); c.lineTo(9, 26); c.lineTo(16, 40); c.lineTo(22, 37); c.lineTo(15, 23); c.lineTo(27, 23); c.closePath();
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 10; c.fill(); c.shadowBlur = 0; c.stroke(); c.restore();
}

// ---------- chips / labels ----------
function chip(c, s, x, y, o = {}) {
  const { alpha = 1, color = P.cyan, size = 26, fam = AR, dir = 'rtl', fill = 'rgba(10,14,22,.82)', weight = 600, pad = 22 } = o;
  if (alpha <= 0) return 0;
  font(c, size, fam, weight); const w = c.measureText(s).width + pad * 2, h = size * 1.9;
  c.save(); c.globalAlpha *= alpha; c.shadowColor = rgba(color, .5); c.shadowBlur = 24;
  rrect(c, x - w / 2, y - h / 2, w, h, h / 2); c.fillStyle = fill; c.fill(); c.shadowBlur = 0;
  c.strokeStyle = rgba(color, .85); c.lineWidth = 1.6; c.stroke();
  text(c, s, x, y + 1, { size, fam, weight, color: P.white, dir });
  c.restore(); return w;
}

// on-screen statement (scene key line), english display + optional arrows animated
function statement(c, parts, x, y, p, o = {}) {
  const { size = 54, color = P.white, accent = P.cyan, sep = '→', alpha = 1 } = o;
  if (alpha <= 0) return;
  font(c, size, LAT, 700); c.letterSpacing = '3px';
  const sepW = c.measureText(` ${sep} `).width; const ws = parts.map(s => c.measureText(s).width);
  const total = ws.reduce((a, b) => a + b, 0) + sepW * (parts.length - 1);
  let cx = x - total / 2;
  c.save(); c.globalAlpha *= alpha;
  parts.forEach((s, i) => {
    const a = clamp(p * parts.length - i);
    text(c, s, cx + ws[i] / 2, y + (1 - ease.out(a)) * 24, { size, fam: LAT, weight: 700, color: i === parts.length - 1 ? accent : color, alpha: a, dir: 'ltr', glow: 18, glowColor: accent, spacing: 3 });
    cx += ws[i];
    if (i < parts.length - 1) { text(c, sep, cx + sepW / 2, y, { size: size * .8, fam: LAT, color: accent, alpha: clamp(p * parts.length - i - .5), dir: 'ltr' }); cx += sepW; }
  });
  c.letterSpacing = '0px'; c.restore();
}

// scene lower-third title
function sceneTitle(c, n, en, ar, t, dur = 3.4) {
  const a = env(t, 0, dur, .5, .6); if (a <= 0) return;
  const p = ease.out(prog(t, 0, .9));
  c.save(); c.globalAlpha = a;
  const x = W - 90, y = 120;
  c.fillStyle = P.cyan; c.fillRect(x - 4, y - 46, 4, 92 * p);
  text(c, String(n).padStart(2, '0') + ' / 08', x - 26, y - 26, { size: 18, fam: MONO, align: 'right', dir: 'ltr', color: P.cyan, alpha: p });
  text(c, en, x - 26, y + 6, { size: 30, fam: LAT, weight: 700, align: 'right', dir: 'ltr', color: P.white, spacing: 4, alpha: p });
  text(c, ar, x - 26, y + 44, { size: 26, fam: AR, weight: 500, align: 'right', color: P.sky, alpha: p });
  c.restore();
}

// glitchy big title
function glitchTitle(c, s, x, y, size, p, t, o = {}) {
  const { fam = LAT, color = P.white, spacing = 10, dir = 'ltr', weight = 700 } = o;
  if (p <= 0) return;
  const jit = (1 - p) * 30;
  c.save(); c.globalCompositeOperation = 'lighter';
  const r = mulberry(Math.floor(t * 30));
  text(c, s, x - jit * (r() - .2), y, { size, fam, weight, color: '#ff2bd6', alpha: .5 * p, dir, spacing });
  text(c, s, x + jit * (r() - .2), y, { size, fam, weight, color: P.cyan, alpha: .6 * p, dir, spacing });
  c.restore();
  text(c, s, x, y, { size, fam, weight, color, alpha: p, dir, spacing, glow: 30 * p, glowColor: P.sky });
}

// ---------- post ----------
let GRAIN = null;
function makeGrain() {
  const g = document.createElement('canvas'); g.width = g.height = 256; const x = g.getContext('2d');
  const d = x.createImageData(256, 256); const r = mulberry(3);
  for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  x.putImageData(d, 0, 0); GRAIN = g;
}
function post(c, t, o = {}) {
  const { vignette = .55, grain = .05 } = o;
  const v = c.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.05);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${vignette})`);
  c.fillStyle = v; c.fillRect(0, 0, W, H);
  if (GRAIN && grain > 0) {
    c.save(); c.globalAlpha = grain; c.globalCompositeOperation = 'overlay';
    const r = mulberry(Math.floor(t * 30) + 11); c.translate(-r() * 256, -r() * 256);
    c.fillStyle = c.createPattern(GRAIN, 'repeat'); c.fillRect(0, 0, W + 256, H + 256); c.restore();
  }
}
// horizontal slice glitch of the already-drawn frame
function sliceGlitch(cv, c, amount, seed) {
  if (amount <= 0) return;
  const r = mulberry(seed); const S = cv.width / W;
  for (let i = 0; i < 9; i++) {
    const y = r() * H, h = 6 + r() * 60, dx = (r() - .5) * 140 * amount;
    c.drawImage(cv, 0, y * S, cv.width, h * S, dx, y, W, h);
  }
}
function flash(c, a, color = '#ffffff') { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a); c.fillStyle = color; c.fillRect(0, 0, W, H); c.restore(); }
function fadeBlack(c, a) { flash(c, a, '#000000'); }

export { W, H, P, AR, KUFI, LAT, MONO, clamp, lerp, prog, ease, env, mulberry, hash, noise1, rrect, rgba, font, text, wrap,
  drawImg, bg, grid, particles, lightRays, glowDot, holo, liveBadge, promptCard, cursor, chip, statement, sceneTitle,
  glitchTitle, makeGrain, post, sliceGlitch, flash, fadeBlack };
