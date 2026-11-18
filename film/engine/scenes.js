// CLAUDE — BEYOND THE CHAT · the eight scenes, transitions and subtitles.
// Visual beats are keyed to narration cue times, so the picture follows the voice.
import {
  W, H, P, AR, KUFI, LAT, MONO, clamp, lerp, prog, ease, env, mulberry, noise1, rrect, rgba, font, text, wrap,
  drawImg, bg, grid, particles, lightRays, glowDot, holo, liveBadge, promptCard, cursor, chip, statement,
  sceneTitle, glitchTitle, makeGrain, post, sliceGlitch, flash, fadeBlack
} from './core.js';
import { rashed, claude } from './characters.js';

export function createFilm(data, IMG) {
  const TL = data.timeline; const SC = TL.scenes; const A = data.analysis;
  makeGrain();

  // ---------- shared helpers ----------
  const mk = (sc) => ({
    C: i => sc.cues[i].start - sc.start, E: i => sc.cues[i].end - sc.start, L: sc.end - sc.start,
    // typed fraction of all prompt cues in this scene
    PP: lt => {
      const ps = sc.cues.filter(c => c.prompt); if (!ps.length) return 0;
      const tot = ps.reduce((a, c) => a + c.text.length, 0); let done = 0;
      for (const c of ps) { const a = c.start - sc.start, b = c.end - sc.start - .15; done += c.text.length * clamp((lt - a) / (b - a)); }
      return done / tot;
    },
    PL: () => sc.cues.filter(c => c.prompt).map(c => c.text),
  });
  const cam = (c, x, y, z = 1, r = 0) => { c.translate(W / 2, H / 2); c.scale(z, z); c.rotate(r); c.translate(-W / 2 + x, -H / 2 + y); };
  const shake = (t, amt, seed = 1) => [noise1(t * 18 + seed) * amt, noise1(t * 18 + seed + 50) * amt];

  function fileIcon(c, x, y, s, kind, a = 1) {
    const M = { PDF: '#ef4444', DOCX: '#3b82f6', XLSX: '#22c55e', PNG: '#a855f7', '</>': '#f59e0b' };
    c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s);
    c.shadowColor = rgba(M[kind], .6); c.shadowBlur = 30;
    c.fillStyle = 'rgba(16,20,30,.92)'; c.beginPath(); c.moveTo(-60, -80); c.lineTo(30, -80); c.lineTo(60, -50); c.lineTo(60, 80); c.lineTo(-60, 80); c.closePath(); c.fill();
    c.shadowBlur = 0; c.strokeStyle = M[kind]; c.lineWidth = 3; c.stroke();
    c.fillStyle = M[kind]; rrect(c, -48, 22, 96, 38, 8); c.fill();
    text(c, kind, 0, 42, { size: 24, fam: LAT, weight: 700, color: '#fff', dir: 'ltr' });
    c.fillStyle = rgba('#ffffff', .25); for (let i = 0; i < 4; i++) c.fillRect(-44, -56 + i * 16, 70 - (i % 2) * 24, 6);
    c.restore();
  }
  function monitor(c, x, y, w, h, o = {}) {
    const { img = null, sy = 0, seed = 1, t = 0, glowc = P.cyan, a = 1, messy = true } = o;
    c.save(); c.globalAlpha *= a;
    c.fillStyle = '#05070b'; rrect(c, x - 8, y - 8, w + 16, h + 16, 10); c.fill();
    c.shadowColor = rgba(glowc, .5); c.shadowBlur = 30; c.fillStyle = '#0c1220'; rrect(c, x, y, w, h, 6); c.fill(); c.shadowBlur = 0;
    if (img) drawImg(c, img, x, y, w, h, { sy, fit: 'cover' });
    else if (messy) {
      const r = mulberry(seed);
      for (let i = 0; i < 9; i++) { c.fillStyle = rgba(r() > .7 ? P.red : r() > .5 ? P.orange : P.sky, .5 + .3 * Math.sin(t * 6 + i)); c.fillRect(x + 10 + r() * (w - 80), y + 10 + i * (h - 20) / 9, 20 + r() * (w - 60) * .6, 6); }
    }
    c.fillStyle = '#05070b'; c.fillRect(x + w / 2 - 14, y + h + 8, 28, 40); c.fillRect(x + w / 2 - 60, y + h + 44, 120, 8);
    c.restore();
  }
  function terminal(c, x, y, w, h, lines, o = {}) {
    const { a = 1, title = 'terminal — orders-system', size = 21 } = o;
    c.save(); c.globalAlpha *= a;
    c.shadowColor = rgba(P.cyan, .35); c.shadowBlur = 40; c.fillStyle = 'rgba(6,8,12,.95)'; rrect(c, x, y, w, h, 14); c.fill(); c.shadowBlur = 0;
    c.strokeStyle = rgba(P.cyan, .45); c.lineWidth = 1.4; c.stroke();
    for (let i = 0; i < 3; i++) { c.fillStyle = ['#ef4444', '#f59e0b', '#22c55e'][i]; c.beginPath(); c.arc(x + 24 + i * 20, y + 20, 6, 0, 7); c.fill(); }
    text(c, title, x + w / 2, y + 21, { size: 15, fam: MONO, color: P.mut, dir: 'ltr' });
    c.save(); rrect(c, x, y + 40, w, h - 40, 0); c.clip();
    const lh = size * 1.45; const maxL = Math.floor((h - 60) / lh); const vis = lines.slice(-maxL);
    vis.forEach((L, i) => {
      const s = typeof L === 'string' ? { t: L } : L;
      text(c, s.t, x + 22, y + 62 + i * lh, { size, fam: MONO + ',' + AR, align: 'left', dir: 'ltr', color: s.c || '#cfe3ff', alpha: s.a ?? 1 });
    });
    c.restore(); c.restore();
  }
  function card(c, x, y, w, h, title, sub, o = {}) {
    const { a = 1, color = P.cyan, icon = null } = o; if (a <= 0) return;
    c.save(); c.globalAlpha *= a; c.shadowColor = rgba(color, .45); c.shadowBlur = 30;
    rrect(c, x, y, w, h, 18); c.fillStyle = 'rgba(12,16,26,.92)'; c.fill(); c.shadowBlur = 0; c.strokeStyle = rgba(color, .8); c.lineWidth = 1.6; c.stroke();
    if (icon) icon(c, x + w - 54, y + h / 2);
    text(c, title, x + w - (icon ? 100 : 28), y + h / 2 - (sub ? 18 : 0), { size: 32, align: 'right', weight: 700, color: P.white });
    if (sub) text(c, sub, x + w - (icon ? 100 : 28), y + h / 2 + 24, { size: 22, align: 'right', color: P.mut });
    c.restore();
  }
  const ico = {
    shield: col => (c, x, y) => { c.save(); c.strokeStyle = col; c.lineWidth = 4; c.beginPath(); c.moveTo(x, y - 30); c.lineTo(x + 24, y - 20); c.lineTo(x + 22, y + 8); c.quadraticCurveTo(x, y + 30, x, y + 32); c.quadraticCurveTo(x, y + 30, x - 22, y + 8); c.lineTo(x - 24, y - 20); c.closePath(); c.stroke(); c.restore(); },
    lock: col => (c, x, y) => { c.save(); c.strokeStyle = col; c.lineWidth = 4; rrect(c, x - 22, y - 6, 44, 34, 6); c.stroke(); c.beginPath(); c.arc(x, y - 8, 14, Math.PI, 0); c.stroke(); c.restore(); },
    check: col => (c, x, y) => { c.save(); c.strokeStyle = col; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.arc(x, y, 26, 0, 7); c.stroke(); c.beginPath(); c.moveTo(x - 12, y); c.lineTo(x - 3, y + 10); c.lineTo(x + 13, y - 9); c.stroke(); c.restore(); },
    gear: col => (c, x, y) => { c.save(); c.strokeStyle = col; c.lineWidth = 4; c.beginPath(); c.arc(x, y, 14, 0, 7); c.stroke(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.moveTo(x + Math.cos(a) * 18, y + Math.sin(a) * 18); c.lineTo(x + Math.cos(a) * 28, y + Math.sin(a) * 28); c.stroke(); } c.restore(); },
  };
  function papers(c, t, n, seed, a = 1) {
    const r = mulberry(seed);
    for (let i = 0; i < n; i++) {
      const sp = .4 + r(), x0 = r() * W, y0 = r() * H, ph = r() * 6;
      const x = (x0 + t * 260 * sp * (r() > .5 ? 1 : -1) + W * 4) % (W + 200) - 100, y = (y0 - t * 120 * sp + H * 4) % (H + 200) - 100;
      c.save(); c.globalAlpha = a * (.5 + r() * .5); c.translate(x, y); c.rotate(t * sp * 2 + ph); c.scale(1, Math.sin(t * 3 * sp + ph));
      c.fillStyle = '#d9dee8'; c.fillRect(-40, -52, 80, 104); c.fillStyle = '#9aa3b5';
      for (let k = 0; k < 6; k++) c.fillRect(-30, -40 + k * 14, 56 - (k % 3) * 10, 4); c.restore();
    }
  }
  function desk(c, clean, t, imgs = []) {
    c.fillStyle = '#0a0c11'; c.beginPath(); c.moveTo(-200, 820); c.lineTo(W + 200, 820); c.lineTo(W + 200, H + 50); c.lineTo(-200, H + 50); c.fill();
    c.fillStyle = clean ? rgba(P.cyan, .35) : rgba(P.orange, .25); c.fillRect(-200, 818, W + 400, 3);
    const mons = [[150, 300, 380, 230], [560, 230, 420, 260], [1000, 230, 420, 260], [1440, 300, 380, 230], [330, 560, 300, 180], [1300, 560, 300, 180]];
    mons.forEach(([x, y, w, h], i) => monitor(c, x, y, w, h, { seed: i + 3, t, img: clean ? imgs[i] : null, glowc: clean ? P.cyan : (i % 2 ? P.red : P.orange), sy: clean ? .1 : 0 }));
  }
  function toasts(c, lt, a0, a1, seed = 9) {
    const msgs = ['اجتماع بعد 5 دقائق', '34 رسالة غير مقروءة', 'عاجل: تحديث العرض', 'تذكير: التقرير الشهري', 'ملف Excel جديد', 'مكالمة فائتة (3)', 'موعد التسليم اليوم', 'طلب مراجعة الكود', 'فاتورة بانتظار الاعتماد', 'رد مطلوب من العميل'];
    const r = mulberry(seed); const n = 22;
    for (let k = 0; k < n; k++) {
      const st = a0 + (a1 - a0) * (1 - Math.pow(1 - k / n, 1.8)); const x = 140 + r() * (W - 560), y = 90 + r() * (H - 300);
      const a = env(lt, st, st + 1.5, .08, .4); if (a <= 0) continue;
      const s = ease.back(clamp((lt - st) / .2));
      c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s);
      rrect(c, 0, 0, 420, 76, 16); c.fillStyle = 'rgba(22,26,36,.94)'; c.fill(); c.strokeStyle = rgba(k % 3 ? P.sky : P.red, .7); c.lineWidth = 1.5; c.stroke();
      c.fillStyle = k % 3 ? P.blue : P.red; c.beginPath(); c.arc(380, 38, 18, 0, 7); c.fill();
      text(c, msgs[k % msgs.length], 346, 38, { size: 25, align: 'right', color: P.white });
      c.restore();
    }
  }
  function doorway(c, x, y, w, h, label, open, glowc = P.cyan) {
    c.save();
    c.shadowColor = rgba(glowc, .6); c.shadowBlur = 40; c.strokeStyle = glowc; c.lineWidth = 3; rrect(c, x, y, w, h, [w / 2, w / 2, 4, 4]); c.stroke(); c.shadowBlur = 0;
    if (open > 0) { const g = c.createLinearGradient(x, y, x, y + h); g.addColorStop(0, rgba(P.white, .9 * open)); g.addColorStop(1, rgba(glowc, .5 * open)); c.fillStyle = g; rrect(c, x + 4, y + 4, w - 8, h - 8, [w / 2, w / 2, 2, 2]); c.fill(); }
    c.fillStyle = 'rgba(8,10,16,.96)';
    const lw = (w - 8) / 2 * (1 - open);
    c.fillRect(x + 4, y + w / 2, lw, h - w / 2 - 4); c.fillRect(x + w - 4 - lw, y + w / 2, lw, h - w / 2 - 4);
    text(c, label, x + w / 2, y + h + 34, { size: 22, fam: LAT, weight: 700, dir: 'ltr', color: P.white, spacing: 3 });
    c.restore();
  }
  // focus on a captured screenshot inside a holo panel
  const panelImg = (name) => IMG[name];

  // ===================== SCENE 1 — HOOK =====================
  function s1(c, lt, sc) {
    const { C, E, L } = mk(sc);
    const tChaosEnd = C(3), tStop = C(6), tReveal = C(6) + .7, tTitle = C(10) + .2;
    if (lt < tChaosEnd) {
      // fast montage of the overwhelmed worker
      if (lt < .5) { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); toasts(c, lt, .25, tChaosEnd); return; }
      const shot = Math.floor((lt - .5) / .72) % 4; const [sx, sy] = shake(lt, 9);
      c.save(); cam(c, sx, sy, 1 + (lt - .5) * .01);
      bg(c, '#0a0b10', '#07080b', W / 2, H * .45, P.orange, .12);
      if (shot === 0) { desk(c, false, lt); rashed(c, W / 2, 760, .95, { mood: 0, t: lt, rim: P.orange, look: Math.sin(lt * 7) }); papers(c, lt, 14, 3, .8); }
      if (shot === 1) {
        const mins = Math.floor(8 * 60 + Math.pow(lt, 1.9) * 40) % (24 * 60);
        const hh = String(Math.floor(mins / 60)).padStart(2, '0'), mm = String(mins % 60).padStart(2, '0');
        text(c, `${hh}:${mm}`, W / 2, H / 2, { size: 300, fam: MONO, weight: 700, color: P.red, glow: 60, glowColor: P.red, dir: 'ltr' });
        text(c, 'الوقت يركض… والمهام ما تخلص', W / 2, H / 2 + 210, { size: 40, color: P.mut });
      }
      if (shot === 2) { rashed(c, W / 2 + 40, 1180, 2.1, { mood: 0, t: lt, rim: P.red, look: -.6 }); glowDot(c, 300, 300, 500, P.blue, .25); }
      if (shot === 3) { papers(c, lt * 1.6, 40, 8, 1); for (let i = 0; i < 5; i++) fileIcon(c, 300 + i * 330, 540 + Math.sin(lt * 4 + i) * 60, 1.2, ['PDF', 'XLSX', 'DOCX', 'PNG', '</>'][i], .9); }
      c.restore();
      toasts(c, lt, .25, tChaosEnd);
      // flash frames on cuts
      const cutPhase = ((lt - .5) % .72) / .72; flash(c, cutPhase < .06 ? .35 : 0);
      return;
    }
    if (lt < tStop) {
      // imagine: calm, the promise of an assistant — capabilities light up
      const p = prog(lt, tChaosEnd, tChaosEnd + 1);
      bg(c, '#0b0f18', '#06070a', W / 2, H * .4, P.blue, .25 * p);
      c.save(); cam(c, 0, 0, 1.05 - .05 * ease.out(p));
      desk(c, false, lt * .2); rashed(c, W / 2, 760, .95, { mood: 1, t: lt, rim: P.cyan, look: 0 });
      c.restore();
      const caps = ['ملفاتك', 'بياناتك', 'أدوات', 'أكواد', 'الإنترنت', 'الكمبيوتر'];
      const ts = [C(3) + .5, C(3) + 1.2, C(3) + 2.0, C(4) + .1, C(4) + .9, C(5) + .4];
      caps.forEach((s, i) => {
        const a = env(lt, ts[i], tStop, .3, .2); const ang = -Math.PI * .9 + i * Math.PI * .36;
        chip(c, s, W / 2 + Math.cos(ang) * 560, 430 + Math.sin(ang) * 260, { alpha: a, size: 32 });
      });
      return;
    }
    // silence → reveal
    c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
    if (lt < tReveal) return;
    const f = ease.io(prog(lt, tReveal, C(9)));
    lightRays(c, W / 2, 380, lt, { n: 18, alpha: .16 * f, color: P.sky, len: 1500 });
    particles(c, lt, { alpha: .5 * f, speed: 60 });
    const tt = prog(lt, tTitle, tTitle + 1.2);
    claude(c, W / 2, 560 - 40 * tt, 1.05 - .25 * tt, { t: lt, form: f, intensity: 1.1, alpha: 1 - .55 * tt });
    rashed(c, 330, 1180, 1.7, { back: true, rim: P.sky, t: lt, light: f, alpha: 1 - tt });
    if (lt > tTitle) {
      const p = ease.out(tt);
      c.fillStyle = `rgba(0,0,0,${.45 * p})`; c.fillRect(0, 0, W, H);
      glitchTitle(c, 'CLAUDE', W / 2, H / 2 - 60, 190, p, lt, { spacing: 30 });
      text(c, 'BEYOND THE CHAT.', W / 2, H / 2 + 80, { size: 56, fam: LAT, weight: 500, dir: 'ltr', spacing: 18, color: P.sky, alpha: prog(lt, tTitle + .5, tTitle + 1.4) });
      text(c, 'ما بعد المحادثة', W / 2, H / 2 + 160, { size: 40, color: P.mut, alpha: prog(lt, tTitle + .9, tTitle + 1.8) });
    }
  }

  // ===================== SCENE 2 — ANALYZE =====================
  function s2(c, lt, sc) {
    const { C, E, L, PP, PL } = mk(sc);
    const orbit = Math.sin(lt * .15) * 60;
    bg(c, '#0a1020', '#05070c', W / 2 + orbit, 420, P.blue, .32);
    c.save(); cam(c, orbit * .4, 0, 1);
    grid(c, lt, { z: lt * 40, alpha: .28 });
    particles(c, lt, { alpha: .35, speed: 30 });
    c.restore();
    // phase A: files orbit Claude, get absorbed
    const pA = env(lt, 0, C(4) + .6, .6, .6);
    if (pA > 0) {
      const cx = W / 2, cy = 520;
      claude(c, cx, cy, .82, { t: lt, alpha: pA });
      const kinds = ['PDF', 'DOCX', 'XLSX', 'PNG', '</>'];
      const absorb = ease.in(prog(lt, C(3) + .3, C(3) + 1.6));
      const items = kinds.map((k, i) => {
        const appear = ease.back(prog(lt, C(2) + i * .35, C(2) + i * .35 + .5));
        const a = lt * .6 + i * Math.PI * 2 / 5; const z = Math.sin(a);
        return { k, x: cx + Math.cos(a) * 520 * (1 - absorb), y: cy - 40 + z * 120 * (1 - absorb) + 30 * absorb, s: (.8 + .25 * z) * appear * (1 - .7 * absorb), z, a: appear * (1 - absorb) };
      }).sort((p, q) => p.z - q.z);
      items.forEach(o => fileIcon(c, o.x, o.y, o.s, o.k, o.a));
      // absorption burst rings
      const rb = prog(lt, C(3) + 1.4, C(3) + 3.2);
      if (rb > 0 && rb < 1) { c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const rr = ease.out(clamp(rb * 1.3 - i * .12)) * 900; c.strokeStyle = rgba(i % 2 ? P.cyan : P.white, .5 * (1 - rb)); c.lineWidth = 3; c.beginPath(); c.ellipse(cx, cy + 30, rr, rr * .3, 0, 0, 7); c.stroke(); } c.restore(); }
      const cl = prog(lt, C(1), C(1) + .8);
      text(c, 'مو مجرد محرك إجابات', W / 2, 150, { size: 54, weight: 700, alpha: cl * env(lt, C(1), C(2) + .2, .3, .4), glow: 20 });
    }
    // phase B: the spreadsheet
    const pB = env(lt, C(4) + .2, C(8) + .8, .6, .6);
    if (pB > 0) {
      rashed(c, 360, 900, .85, { mood: lt < C(6) ? 0 : 1, t: lt, rim: P.cyan, look: .8, alpha: pB });
      const sy = prog(lt, C(5), C(8)) * .6;
      holo(c, 700, 130, 1120, 580, { alpha: pB, img: IMG.sheet, sy, title: 'operations_2026_synthetic.xlsx', live: true, badge: 'بيانات تجريبية مصطنعة · SYNTHETIC', scan: 1, t: lt });
      const n = Math.round(5000 * ease.out(prog(lt, C(5), C(5) + 1.6)));
      if (lt > C(5)) { text(c, n.toLocaleString('en-US'), 1160, 790, { size: 110, fam: LAT, weight: 700, color: P.cyan, glow: 30, dir: 'ltr', alpha: pB }); text(c, 'عملية', 1440, 800, { size: 44, color: P.mut, alpha: pB }); }
      const qs = ['أكثر أسباب التأخير؟', 'أعلى الأقسام أداءً؟', 'أين المشاكل؟'];
      qs.forEach((q, i) => chip(c, q, 360, 300 + i * 90, { alpha: pB * prog(lt, C(6) + i * .7, C(6) + i * .7 + .4), color: P.orange, size: 28 }));
    }
    // phase C: prompt
    const pC = env(lt, C(8), C(12) + .3, .5, .5);
    if (pC > 0) {
      c.save(); c.globalAlpha = pC * .35; drawImg(c, IMG.sheet, 0, 0, W, H, { fit: 'cover' }); c.restore();
      c.fillStyle = `rgba(5,7,12,${.7 * pC})`; c.fillRect(0, 0, W, H);
      promptCard(c, 260, 300, 1400, PL(), PP(lt), { alpha: pC, attach: 'operations_2026_synthetic.xlsx', t: lt });
    }
    // phase D: the real result
    const pD = env(lt, C(12) - .1, L + .5, .5, 0);
    if (pD > 0) {
      const z = 1 + .03 * prog(lt, C(12), L);
      c.save(); cam(c, 0, 0, z);
      const k = prog(lt, C(12), C(14));
      const sy = lt < C(14) ? lerp(0, .45, ease.io(k)) : lerp(.45, 1, ease.io(prog(lt, C(14), C(15) + .5)));
      holo(c, 240, 110, 1440, 830, { alpha: pD, img: IMG.analysis_report, sy, title: 'الملخص التنفيذي — تحليل حقيقي للملف', live: true, scan: .6, t: lt });
      if (lt > C(15) - .2) { c.save(); c.globalAlpha = pD * env(lt, C(15) - .2, L, .4, .3); c.strokeStyle = P.orange; c.lineWidth = 4; c.shadowColor = P.orange; c.shadowBlur = 30; rrect(c, 250, 600, 700, 320, 14); c.stroke(); c.restore(); }
      c.restore();
      const an = A.anomalies[0];
      const calls = [[`نسبة التأخير ${A.late_rate}%`, 1500, 260], [`${an.city} — ${an.month}: ${an.late_rate}%`, 1460, 360], [`خدمة العملاء يوم ${A.cs_worst_day.day}: ${A.cs_worst_day.late_rate}%`, 1420, 460]];
      calls.forEach(([s, x, y], i) => chip(c, s, x, y, { alpha: env(lt, C(13) + i * .5, C(14) + .2, .3, .3), color: i ? P.orange : P.cyan, size: 28 }));
      statement(c, ['UNDERSTAND', 'ANALYZE', 'RECOMMEND'], W / 2, 70, prog(lt, C(13), C(13) + 1.4), { size: 40, alpha: env(lt, C(13), C(14) + .3, .3, .4) });
      chip(c, '⚠ راجع الحسابات والمصادر قبل القرارات المهمة', W / 2, 62, { alpha: env(lt, C(14), L, .3, .2), color: P.orange, size: 30 });
    }
    sceneTitle(c, 2, 'UNDERSTAND AND ANALYZE', sc.title_ar, lt);
  }

  // ===================== SCENE 3 — ARTIFACTS =====================
  function s3(c, lt, sc) {
    const { C, E, L, PP, PL } = mk(sc);
    bg(c, '#120b24', '#06050b', 700, 500, P.violet, .3, 1000);
    c.save(); cam(c, 0, 0, 1 + .02 * Math.sin(lt * .3)); grid(c, lt, { color: P.violet, alpha: .3, z: lt * 25 }); c.restore();
    // phase A: draw a square in the air → it becomes an interface
    const pA = env(lt, 0, C(6) + .2, 0, .6);
    if (pA > 0) {
      c.save(); c.globalAlpha = pA;
      const arm = ease.io(prog(lt, .2, 1.2));
      const R = { x: 470, y: 260, w: 640, h: 440 };
      const dp = prog(lt, .9, C(1) + .2);
      const per = 2 * (R.w + R.h); let d = dp * per;
      const pts = [[R.x + R.w, R.y], [R.x, R.y], [R.x, R.y + R.h], [R.x + R.w, R.y + R.h], [R.x + R.w, R.y]];
      let hx = pts[0][0], hy = pts[0][1];
      c.save(); c.strokeStyle = P.cyan; c.lineWidth = 6; c.shadowColor = P.cyan; c.shadowBlur = 30; c.beginPath(); c.moveTo(...pts[0]);
      for (let i = 1; i < pts.length && d > 0; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i]; const sl = Math.hypot(bx - ax, by - ay); const f = Math.min(1, d / sl); hx = lerp(ax, bx, f); hy = lerp(ay, by, f); c.lineTo(hx, hy); d -= sl; }
      c.stroke(); c.restore();
      // morph into a dashboard (illustrative motion graphic)
      const m = ease.out(prog(lt, C(1), C(1) + 1.4));
      if (m > 0) {
        c.save(); c.globalAlpha = m; rrect(c, R.x, R.y, R.w, R.h, 18); c.fillStyle = 'rgba(14,16,30,.92)'; c.fill();
        for (let i = 0; i < 6; i++) { const bh = (60 + 120 * Math.abs(Math.sin(i * 1.7 + lt))) * m; c.fillStyle = i % 2 ? P.cyan : P.violet; rrect(c, R.x + 40 + i * 52, R.y + R.h - 50 - bh, 34, bh, 6); c.fill(); }
        c.strokeStyle = P.orange; c.lineWidth = 14; c.beginPath(); c.arc(R.x + R.w - 130, R.y + 150, 80, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * .72 * m); c.stroke();
        for (let i = 0; i < 3; i++) { c.fillStyle = rgba(P.white, .15); rrect(c, R.x + 40, R.y + 40 + i * 44, 240, 28, 8); c.fill(); }
        c.restore();
        glitchTitle(c, 'Artifacts', R.x + R.w / 2, R.y - 70, 72, prog(lt, C(1), C(1) + .8), lt, { spacing: 4 });
      }
      { // hand stays within reach; a beam of light carries the gesture to the drawing point
        const armA = arm * env(lt, 0, C(2), 0, .8);
        let lx = (hx - 1440) / .95 - 170, ly = (hy - 900) / .95 - 10; const dl = Math.hypot(lx, ly) || 1; const reach = Math.min(dl, 290);
        const hand = { x: 170 + lx / dl * reach, y: 10 + ly / dl * reach };
        rashed(c, 1440, 900, .95, { mood: lt > C(1) ? 2 : 1, t: lt, rim: P.violet, armUp: armA, hand, look: -.7 });
        if (armA > .95 && dp > 0 && dp < 1) {
          const fx = 1440 + .95 * (hand.x - 8), fy = 900 + .95 * (hand.y - 62);
          c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba(P.cyan, .55); c.lineWidth = 3; c.shadowColor = P.cyan; c.shadowBlur = 20;
          c.setLineDash([2, 14]); c.lineDashOffset = -lt * 80; c.beginPath(); c.moveTo(fx, fy); c.lineTo(hx, hy); c.stroke(); c.restore();
          glowDot(c, hx, hy, 40, P.white, .9);
        }
      }
      // what you can ask for
      const kinds = ['لوحة تحكم', 'آلة حاسبة', 'إدارة المهام', 'رسوم بيانية', 'نموذج أولي لتطبيق'];
      kinds.forEach((k, i) => { const a = env(lt, C(4) + i * .45, C(6) + .2, .3, .4); const ang = lt * .3 + i * 1.26; chip(c, k, 790 + Math.cos(ang) * 470, 480 + Math.sin(ang) * 300, { alpha: a, color: P.violet, size: 30 }); });
      c.restore();
    }
    // phase B: prompt
    const pB = env(lt, C(6), C(10) + .4, .4, .5);
    if (pB > 0) { c.fillStyle = `rgba(5,5,10,${.55 * pB})`; c.fillRect(0, 0, W, H); promptCard(c, 260, 300, 1400, PL(), PP(lt), { alpha: pB, t: lt }); }
    // phase C: "we asked it to BUILD" + real captures with interactions
    const pC = env(lt, C(10), C(14) + .2, .4, .5);
    if (pC > 0) {
      const ex = env(lt, C(10), C(11) + 1.3, .3, .4);
      if (ex > 0) {
        text(c, 'يشرح لنا كيف نبنيه', W / 2, 380, { size: 62, color: P.mut, alpha: ex, weight: 700 });
        const sk = prog(lt, C(10) + .9, C(10) + 1.5); c.save(); c.globalAlpha = ex; c.strokeStyle = P.red; c.lineWidth = 6; c.beginPath(); c.moveTo(W / 2 + 330, 384); c.lineTo(W / 2 + 330 - 660 * sk, 384); c.stroke(); c.restore();
        text(c, 'يبنيه!', W / 2, 560, { size: 150, weight: 800, color: P.white, glow: 40, alpha: ex * prog(lt, C(11), C(11) + .3) });
      }
      const pk = prog(lt, C(11) + 1.0, C(11) + 1.6);
      if (pk > 0) {
        const steps = [['task_01_initial', C(11) + .9], ['task_02_typing', C(12) + .2], ['task_03_added', C(12) + 1.6], ['task_04_checked', C(12) + 2.8], ['task_05_filter_high', C(13) - .4], ['task_06_light', C(13) + .6]];
        let cur = 0; for (let i = 0; i < steps.length; i++) if (lt >= steps[i][1]) cur = i;
        const mob = prog(lt, C(13) + 2.0, C(13) + 2.8);
        const PX = 360, PY = 120, PW = 1200, PH = 820;
        const z = 1 + .04 * ease.out(pk);
        c.save(); cam(c, 0, 0, z); c.globalAlpha = pC * (1 - mob);
        holo(c, PX, PY, PW, PH, { img: IMG[steps[cur][0]], title: 'مهامي اليومية — Artifact منشور فعلياً', live: true, color: P.violet, t: lt });
        const prev = cur > 0 ? steps[cur - 1][0] : null; const xf = prog(lt, steps[cur][1], steps[cur][1] + .35);
        if (prev && xf < 1) { c.save(); c.globalAlpha = (1 - xf) * pC * (1 - mob); drawImg(c, IMG[prev], PX + 8, PY + 46, PW - 16, PH - 54); c.restore(); }
        // cursor targets in the 1280x860 capture viewport
        const map = (vx, vy) => [PX + 8 + vx / 1280 * (PW - 16), PY + 46 + vy / 1280 * (PW - 16)];
        const tg = [[832, 310], [832, 310], [236, 310], [1051, 438], [990, 368], [253, 57]];
        const [tx, ty] = map(...tg[cur]); const [px, py] = cur ? map(...tg[cur - 1]) : [tx + 200, ty + 200];
        const mv = ease.io(prog(lt, steps[cur][1] - .55, steps[cur][1] - .05));
        cursor(c, lerp(px, tx, mv) + 6, lerp(py, ty, mv) + 4, prog(lt, steps[cur][1] - .05, steps[cur][1] + .45));
        c.restore();
        if (mob > 0) {
          c.save(); c.globalAlpha = mob * pC;
          for (const [i, name] of [[0, 'task_07_mobile_light'], [1, 'task_08_mobile_dark']]) {
            const x = 620 + i * 420, y = 110; c.fillStyle = '#05060a'; rrect(c, x - 14, y - 14, 348, 712, 44); c.fill(); c.strokeStyle = rgba(P.violet, .8); c.lineWidth = 2; c.stroke();
            drawImg(c, IMG[name], x, y, 320, 684, { fit: 'width' });
          }
          liveBadge(c, 620, 860, 'متجاوب + وضع ليلي · لقطة حقيقية'); c.restore();
        }
      }
    }
    // phase D: users vs makers
    const pD = env(lt, C(14), L + .5, .5, 0);
    if (pD > 0) {
      c.fillStyle = `rgba(6,5,12,${.75 * pD})`; c.fillRect(0, 0, W, H);
      rashed(c, W / 2, 1000, .8, { mood: 2, t: lt, rim: P.violet, alpha: pD });
      text(c, 'يستخدم الذكاء الاصطناعي', 1420, 430, { size: 50, color: P.mut, alpha: pD * prog(lt, C(14), C(14) + .5) });
      text(c, 'يصنع به أدوات', 500, 430, { size: 64, weight: 800, color: P.white, glow: 30, glowColor: P.violet, alpha: pD * prog(lt, C(15), C(15) + .5) });
      statement(c, ['IDEA', 'PROTOTYPE', 'INTERACTIVE PRODUCT'], W / 2, 150, prog(lt, C(15) + .3, C(15) + 1.6), { size: 44, accent: P.violet });
    }
    sceneTitle(c, 3, 'ARTIFACTS', sc.title_ar, lt);
  }

  // ===================== SCENE 4 — CLAUDE CODE =====================
  function codeWall(c, lt, a, speed = 40) {
    const code = data.code;
    for (let layer = 0; layer < 3; layer++) {
      const s = [13, 17, 22][layer], al = [.18, .3, .5][layer] * a, cols = [5, 4, 3][layer];
      for (let col = 0; col < cols; col++) {
        const x = 60 + col * (W / cols) + layer * 40; const off = (lt * speed * (layer + 1) + col * 300) % (code.length * s * 1.5);
        for (let i = 0; i < 46; i++) {
          const y = i * s * 1.5 - off % (s * 1.5); const L = code[(Math.floor(off / (s * 1.5)) + i + col * 17) % code.length];
          text(c, L.slice(0, 48), x, y, { size: s, fam: MONO + ',' + AR, align: 'left', dir: 'ltr', color: layer === 2 ? P.cyan : P.sky, alpha: al });
        }
      }
    }
  }
  function s4(c, lt, sc) {
    const { C, E, L, PP, PL } = mk(sc);
    c.fillStyle = '#030406'; c.fillRect(0, 0, W, H);
    const imp = prog(lt, C(1), C(1) + .5);
    c.save(); cam(c, 0, -lt * 6, 1.04); codeWall(c, lt, env(lt, 0, C(6) + .5, .6, .6) * (.55 + (imp > 0 && imp < 1 ? (1 - imp) * 1.5 : 0)), 34); c.restore();
    { const g = c.createRadialGradient(W / 2, 640, 100, W / 2, 640, 900); g.addColorStop(0, 'rgba(3,4,6,.75)'); g.addColorStop(1, 'rgba(3,4,6,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
    // phase A: who builds software?
    const pA = env(lt, 0, C(6) + .3, .3, .5);
    if (pA > 0) {
      c.save(); c.globalAlpha = pA;
      const [sx, sy] = imp > 0 && imp < 1 ? shake(lt, 14 * (1 - imp)) : [0, 0];
      c.translate(sx, sy);
      rashed(c, 520, 980, .9, { mood: lt > C(1) ? 2 : 1, t: lt, rim: P.cyan, look: .6 });
      claude(c, 1380, 560, .78, { t: lt, form: ease.out(prog(lt, C(1), C(2) + .5)), alpha: 1 });
      text(c, 'مو بالضرورة!', W / 2, 160, { size: 80, weight: 800, glow: 30, alpha: env(lt, C(1), C(3), .2, .4) });
      const ab = ['يكتب الأكواد', 'يكتشف الأخطاء', 'يراجع المشاريع', 'يقترح تحسينات', 'يبني من الصفر'];
      ab.forEach((s, i) => chip(c, s, 1380 + Math.cos(i * 1.256 + lt * .4) * 420, 520 + Math.sin(i * 1.256 + lt * .4) * 260, { alpha: env(lt, C(3) + i * .5, C(5), .3, .4), size: 28 }));
      // the store: orders moving through statuses
      const pS = env(lt, C(5), C(6) + .3, .4, .3);
      if (pS > 0) {
        c.fillStyle = `rgba(3,4,6,${.8 * pS})`; c.fillRect(0, 0, W, H);
        const st = ['جديد', 'قيد التجهيز', 'تم الشحن', 'تم التسليم'], cols = [P.cyan, P.orange, P.blue, P.green];
        st.forEach((s, i) => { chip(c, s, 1560 - i * 400, 380, { alpha: pS, color: cols[i], size: 32 }); if (i < 3) text(c, '←', 1360 - i * 400, 380, { size: 50, color: P.mut, alpha: pS }); });
        for (let b = 0; b < 6; b++) { const x = 1700 - ((lt * 160 + b * 260) % 1500); c.save(); c.globalAlpha = pS; c.fillStyle = '#a77b4f'; c.fillRect(x - 40, 560, 80, 64); c.fillStyle = '#7a5835'; c.fillRect(x - 6, 560, 12, 64); c.restore(); }
        c.save(); c.globalAlpha = pS; c.fillStyle = rgba(P.white, .2); c.fillRect(160, 626, 1600, 6); c.restore();
        text(c, 'متجرك الإلكتروني', W / 2, 760, { size: 44, weight: 700, alpha: pS });
      }
      c.restore();
    }
    // phase B: prompt in a terminal-like card, then requirements doc
    const pB = env(lt, C(6), C(12) + .3, .4, .4);
    if (pB > 0) {
      promptCard(c, 120, 200, 980, PL(), PP(lt), { alpha: pB, t: lt, label: 'claude ›' });
      holo(c, 1150, 150, 660, 780, { alpha: pB * prog(lt, C(10), C(11)), img: IMG.req_md, zoom: 1.32, sy: prog(lt, C(11), C(12)) * .5, title: 'REQUIREMENTS.md — تحليل المتطلبات', live: true, t: lt, scan: 1 });
    }
    // phase C: real terminal log — failing tests, the change, all green
    const pC = env(lt, C(12) - .1, C(14) + .4, .4, .4);
    if (pC > 0) {
      const lines = [{ t: '# phase 4 — change an existing project: write the failing test first', c: P.mut }];
      const nf = Math.floor(prog(lt, C(12), C(12) + 2.2) * data.logs.fail.length);
      data.logs.fail.slice(0, nf).forEach(s => lines.push({ t: s, c: /FAIL|ERROR|Assertion/.test(s) ? '#ff6b6b' : '#cfe3ff' }));
      if (lt > C(13)) {
        lines.push({ t: '$ git diff app/store.py    # state machine + status history', c: P.mut });
        const nd = Math.floor(prog(lt, C(13), C(13) + 2.5) * 12);
        data.logs.diff.slice(0, nd).forEach(s => lines.push({ t: s.slice(0, 92), c: s[0] === '+' ? '#5ef0a8' : '#ff8a8a' }));
      }
      if (lt > C(13) + 2.8) { lines.push({ t: '$ python3 -m unittest -v', c: '#cfe3ff' }); data.logs.ok.filter(s => s.trim()).slice(-3).forEach(s => lines.push({ t: s, c: '#5ef0a8' })); }
      terminal(c, 160, 110, 1600, 800, lines, { a: pC, size: 22 });
      liveBadge(c, 180, 890, 'سجل حقيقي من هذه الجلسة · REAL SESSION LOG');
      if (lt > C(13) + 2.8) chip(c, '13 / 13 اختبار ناجح', 1500, 830, { color: P.green, size: 32, alpha: pC * prog(lt, C(13) + 2.8, C(13) + 3.2) });
    }
    // phase D: Claude Code → working product
    const pD = env(lt, C(14), L + .5, .4, 0);
    if (pD > 0) {
      c.fillStyle = `rgba(3,4,6,${pD})`; c.fillRect(0, 0, W, H);
      glitchTitle(c, 'Claude Code', W / 2, 140, 90, prog(lt, C(14), C(14) + .8) * pD, lt, { spacing: 6 });
      const shots = ['orders_01_login', 'orders_03_dashboard', 'orders_05_status_changed', 'orders_07_forbidden_transition'];
      const k = prog(lt, C(14) + .4, L - .5) * (shots.length - 1);
      shots.forEach((s, i) => {
        const d = i - k; const x = W / 2 + d * 1250, sc2 = .82 - Math.min(.3, Math.abs(d) * .25), a = clamp(1 - Math.abs(d) * .7) * pD;
        if (a <= 0) return;
        c.save(); c.translate(x, 600); c.scale(sc2, sc2);
        holo(c, -560, -330, 1120, 680, { img: IMG[s], alpha: a, title: ['تسجيل الدخول', 'لوحة التحكم', 'تتبع حالة الطلب', 'الخادم يرفض انتقالاً غير مسموح'][i], live: true, t: lt });
        c.restore();
      });
      statement(c, ['YOUR IDEA.', 'YOUR CODE.', 'YOUR PRODUCT.'], W / 2, 250, prog(lt, C(15), C(15) + 1.5), { size: 40, sep: ' ' });
    }
    sceneTitle(c, 4, 'CLAUDE CODE', sc.title_ar, lt);
  }

  // ===================== SCENE 5 — PROJECTS & SKILLS =====================
  function library(c, lt, z, a) {
    const vx = W / 2, vy = 470;
    bg(c, '#0b0a18', '#040409', vx, vy, P.violet, .35, 700);
    const r = mulberry(21);
    for (let side of [-1, 1]) {
      for (let i = 0; i < 26; i++) {
        const d = ((i * 140 - z) % 3640 + 3640) % 3640 + 60; const k = 600 / d;
        const x = vx + side * 900 * k, h = 1900 * k, w = 200 * k;
        c.save(); c.globalAlpha = a * clamp(1.2 - d / 3640);
        c.fillStyle = '#0d0c1c'; c.fillRect(side > 0 ? x : x - w, vy - h * .55, w, h);
        for (let b = 0; b < 9; b++) { c.fillStyle = [P.cyan, P.violet, P.blue, P.orange, P.sky][(i + b) % 5]; c.globalAlpha = a * clamp(1.2 - d / 3640) * (.35 + .35 * r()); c.fillRect((side > 0 ? x : x - w) + w * .1, vy - h * .5 + b * h * .1, w * .8, h * .07); }
        c.restore();
      }
    }
  }
  function s5(c, lt, sc) {
    const { C, E, L } = mk(sc);
    const z = lt * 120;
    const inside = env(lt, C(8) + .6, C(12) - .1, .6, .6), mkt = env(lt, C(12), C(15) + .2, .5, .5);
    library(c, lt, z, 1);
    particles(c, lt, { alpha: .35, colors: [P.violet, P.cyan, P.white], speed: 50 });
    // A: Projects + Skills definitions
    const pA = env(lt, C(1) - .2, C(7) + .2, .4, .5);
    if (pA > 0) {
      c.fillStyle = `rgba(4,4,10,${.55 * pA})`; c.fillRect(0, 0, W, H);
      text(c, 'Projects', 1380, 180, { size: 86, fam: LAT, weight: 700, dir: 'ltr', color: P.cyan, glow: 30, alpha: pA * prog(lt, C(1), C(1) + .4) });
      text(c, '+', W / 2, 180, { size: 70, fam: LAT, color: P.white, alpha: pA * prog(lt, C(1) + .3, C(1) + .6), dir: 'ltr' });
      text(c, 'Skills', 540, 180, { size: 86, fam: LAT, weight: 700, dir: 'ltr', color: P.orange, glow: 30, glowColor: P.orange, alpha: pA * prog(lt, C(1) + .5, C(1) + .9) });
      const pp = env(lt, C(3), C(7) + .2, .4, .4);
      if (pp > 0) {
        c.save(); c.globalAlpha = pA * pp;
        // project folder
        c.fillStyle = 'rgba(34,211,238,.12)'; c.strokeStyle = P.cyan; c.lineWidth = 3; rrect(c, 1180, 330, 420, 280, 18); c.fill(); c.stroke(); rrect(c, 1180, 300, 170, 50, 12); c.fill(); c.stroke();
        ['التعليمات', 'الملفات', 'السياق'].forEach((s, i) => chip(c, s, 1390, 400 + i * 80, { size: 28, alpha: prog(lt, C(3) + .4 + i * .4, C(3) + .8 + i * .4) }));
        text(c, 'PROJECTS = CONTEXT', 1390, 700, { size: 40, fam: LAT, weight: 700, dir: 'ltr', color: P.cyan, spacing: 3 });
        // skill loop
        const sk = env(lt, C(5), C(7) + .2, .4, .4);
        if (sk > 0) {
          c.globalAlpha = pA * sk; const cx = 540, cy = 480; c.strokeStyle = P.orange; c.lineWidth = 4;
          c.beginPath(); c.arc(cx, cy, 150, lt * .8, lt * .8 + Math.PI * 1.7); c.stroke();
          ['منهجية', 'معايير', 'نموذج تقرير', 'تكرار'].forEach((s, i) => { const a = i * Math.PI / 2 - Math.PI / 2; chip(c, s, cx + Math.cos(a) * 190, cy + Math.sin(a) * 160, { size: 26, color: P.orange }); });
          ico.gear(P.orange)(c, cx, cy);
          text(c, 'SKILLS = REUSABLE WORKFLOWS', 540, 700, { size: 40, fam: LAT, weight: 700, dir: 'ltr', color: P.orange, spacing: 3 });
        }
        c.restore();
      }
    }
    // B: doors — open HEALTHCARE
    const pB = env(lt, C(7) - .2, C(9) + .2, .4, .5);
    if (pB > 0) {
      c.save(); c.globalAlpha = pB;
      const labels = ['BUSINESS', 'MARKETING', 'CODING', 'HEALTHCARE', 'DATA ANALYSIS'];
      const open = ease.io(prog(lt, C(8), C(8) + 1.4));
      c.save(); cam(c, 0, 0, 1 + .25 * open);
      labels.forEach((s, i) => doorway(c, 250 + i * 300, 260, 200, 400, s, i === 3 ? open : 0, i === 3 ? P.green : P.cyan));
      c.restore();
      rashed(c, 1210, 1240, 1.25, { back: true, t: lt, rim: P.green, light: 1 + open });
      c.restore();
    }
    // C: inside the healthcare skill
    if (inside > 0) {
      c.save(); c.globalAlpha = inside;
      bg(c, '#06151a', '#030809', 1400, 400, P.green, .25, 900);
      claude(c, 1560, 560, .6, { t: lt, role: { text: 'مراجع السياسات', a: prog(lt, C(8) + 1, C(8) + 1.6), color: P.green } });
      const two = prog(lt, C(10), C(10) + .8);
      holo(c, 120, 120, 1000, 800, { img: IMG.skill_md, zoom: 1.32, sy: prog(lt, C(9), C(10)) * .5, title: 'hospital-policy-review/SKILL.md', live: true, t: lt, color: P.green, alpha: 1 - two });
      if (two > 0) {
        holo(c, 80, 170, 640, 760, { img: IMG.skill_report1, zoom: 1.32, alpha: two, title: 'المهمة 1 · IPC-014 · النتيجة 60%', live: true, t: lt, color: P.green, sy: prog(lt, C(10), C(12)) * .3 });
        holo(c, 760, 170, 640, 760, { img: IMG.skill_report2, zoom: 1.32, alpha: prog(lt, C(10) + .7, C(10) + 1.4), title: 'المهمة 2 · NUR-031 · النتيجة 20%', live: true, t: lt, color: P.orange, sy: prog(lt, C(10), C(12)) * .3 });
        text(c, 'نفس المهارة — نفس المنهجية — مهمتان مختلفتان', 740, 110, { size: 34, weight: 700, color: P.white, alpha: prog(lt, C(11), C(11) + .5) });
      }
      c.restore();
    }
    // D: marketing project
    if (mkt > 0) {
      c.save(); c.globalAlpha = mkt;
      bg(c, '#140d06', '#070403', 600, 400, P.orange, .22, 900);
      holo(c, 820, 130, 980, 800, { img: IMG.project_md, zoom: 1.32, title: 'Project · تسويق «محمصة نَدى» (نشاط افتراضي)', live: true, badge: 'ملف تعليمات حقيقي · مثال', t: lt, color: P.orange, sy: prog(lt, C(12), C(14)) * .4 });
      ['هوية المتجر', 'الخدمات', 'الجمهور المستهدف', 'أسلوب الكتابة'].forEach((s, i) => chip(c, s, 420, 300 + i * 110, { alpha: prog(lt, C(12) + .6 + i * .5, C(12) + 1 + i * .5), color: P.orange, size: 32 }));
      c.restore();
    }
    // E: you are building a workspace
    const pE = env(lt, C(15), L + .5, .5, 0);
    if (pE > 0) {
      c.save(); c.globalAlpha = pE;
      c.fillStyle = 'rgba(4,4,10,.5)'; c.fillRect(0, 0, W, H);
      ['BUSINESS', 'MARKETING', 'CODING', 'HEALTHCARE', 'DATA ANALYSIS'].forEach((s, i) => doorway(c, 250 + i * 300, 300, 200, 360, s, .55 + .3 * Math.sin(lt * 2 + i), [P.cyan, P.orange, P.blue, P.green, P.violet][i]));
      text(c, 'أنت تبني بيئة عمل متخصصة', W / 2, 800, { size: 62, weight: 800, glow: 30, alpha: prog(lt, C(16), C(16) + .5) });
      c.restore();
    }
    sceneTitle(c, 5, 'PROJECTS AND SKILLS', sc.title_ar, lt);
  }

  // ===================== SCENE 6 — COMPUTER USE & COWORK =====================
  function osWindow(c, x, y, w, h, kind, o = {}) {
    const { a = 1, title = '' } = o; if (a <= 0) return;
    c.save(); c.globalAlpha *= a; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 40;
    rrect(c, x, y, w, h, 14); c.fillStyle = '#141a27'; c.fill(); c.shadowBlur = 0; c.strokeStyle = rgba(P.sky, .35); c.lineWidth = 1.5; c.stroke();
    c.fillStyle = '#1b2333'; rrect(c, x, y, w, 40, [14, 14, 0, 0]); c.fill();
    text(c, title, x + w / 2, y + 21, { size: 18, color: P.mut });
    if (kind === 'folder') for (let i = 0; i < 8; i++) { const fx = x + 40 + (i % 4) * (w - 60) / 4, fy = y + 70 + Math.floor(i / 4) * 120; c.fillStyle = i % 3 ? '#3b82f6' : '#f59e0b'; rrect(c, fx, fy, 70, 56, 8); c.fill(); c.fillStyle = rgba(P.white, .5); c.fillRect(fx - 4, fy + 68, 78, 6); }
    if (kind === 'browser') { c.fillStyle = '#0f1420'; rrect(c, x + 20, y + 56, w - 40, 30, 15); c.fill(); for (let i = 0; i < 6; i++) { c.fillStyle = rgba(P.white, .18); c.fillRect(x + 30, y + 110 + i * 34, (w - 80) * (.5 + .4 * ((i * 37) % 10) / 10), 12); } }
    if (kind === 'sheet') for (let r = 0; r < 7; r++) for (let k = 0; k < 5; k++) { c.strokeStyle = rgba(P.white, .12); c.strokeRect(x + 16 + k * (w - 32) / 5, y + 56 + r * 34, (w - 32) / 5, 34); }
    c.restore();
  }
  function s6(c, lt, sc) {
    const { C, E, L, PP, PL } = mk(sc);
    bg(c, '#06101e', '#020409', W / 2, 300, P.blue, .3, 1100);
    const pA = env(lt, 0, C(7) + .3, 0, .5);
    if (pA > 0) {
      c.save(); c.globalAlpha = pA;
      // POV over a desktop plane in perspective
      const fly = lt * 30;
      c.save(); c.translate(W / 2, 640); c.transform(1, 0, -.35, .55, 0, 0); c.translate(-W / 2 - fly, -500);
      c.fillStyle = '#0b1424'; rrect(c, 0, 0, W + 400, 1000, 30); c.fill(); c.strokeStyle = rgba(P.cyan, .3); c.lineWidth = 2; c.stroke();
      for (let i = 0; i < 12; i++) { c.fillStyle = rgba(i % 2 ? P.blue : P.cyan, .6); rrect(c, 60 + (i % 2) * 120, 60 + Math.floor(i / 2) * 140, 80, 80, 14); c.fill(); }
      c.restore();
      const w1 = ease.back(prog(lt, C(1), C(1) + .6)), w2 = ease.back(prog(lt, C(2) + .8, C(2) + 1.4)), w3 = ease.back(prog(lt, C(5), C(5) + .6));
      const sw = ease.io(prog(lt, C(6), C(6) + 1));
      osWindow(c, lerp(360, 120, sw), 200, 620 * w1, 420 * w1 || 1, 'folder', { a: w1, title: 'مجلد المشروع' });
      osWindow(c, 980, lerp(240, 160, sw), 640 * w2, 420 * w2 || 1, 'browser', { a: w2, title: 'المتصفح' });
      osWindow(c, lerp(700, 1200, sw), 560, 560 * w3, 340 * w3 || 1, 'sheet', { a: w3, title: 'جدول البيانات' });
      // the digital hand + cursor path
      const path = [[1500, 900], [620, 330], [1250, 380], [960, 700], [1400, 640]];
      const k = clamp(lt / C(7)) * (path.length - 1); const i0 = Math.min(path.length - 2, Math.floor(k)), f = ease.io(k - i0);
      const hx = lerp(path[i0][0], path[i0 + 1][0], f), hy = lerp(path[i0][1], path[i0 + 1][1], f);
      c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba(P.cyan, .7); c.lineWidth = 3;
      for (let fgr = 0; fgr < 4; fgr++) { c.beginPath(); c.moveTo(hx + 30 + fgr * 14, hy + 160); c.quadraticCurveTo(hx + 20 + fgr * 12, hy + 80, hx + 8 + fgr * 10, hy + 30 + (fgr === 0 ? -20 : fgr * 6)); c.stroke(); }
      c.beginPath(); c.ellipse(hx + 60, hy + 200, 70, 60, -.3, 0, 7); c.stroke(); c.restore();
      cursor(c, hx, hy, (k % 1) > .92 ? ((k % 1) - .92) / .08 : 0);
      const steps = ['فتح الملفات', 'التنقل بين التطبيقات', 'تنفيذ خطوات متعددة'];
      steps.forEach((s, i) => chip(c, `${i + 1}. ${s}`, 330, 760 + i * 80, { alpha: prog(lt, C(6) + i * .6, C(6) + i * .6 + .3), size: 28 }));
      chip(c, 'Computer Use', 1300, 110, { alpha: env(lt, C(4), C(7), .3, .3), fam: LAT, dir: 'ltr', size: 34 });
      chip(c, 'Claude Cowork', 1640, 110, { alpha: env(lt, C(4) + .5, C(7), .3, .3), fam: LAT, dir: 'ltr', size: 34, color: P.orange });
      text(c, 'مشهد توضيحي · ILLUSTRATION', 120, 60, { size: 18, fam: LAT + ',' + AR, align: 'left', dir: 'ltr', color: P.mut, alpha: .8 });
      c.restore();
    }
    // B: the delegation prompt + an approval step
    const pB = env(lt, C(7), C(11) + .2, .4, .4);
    if (pB > 0) {
      c.fillStyle = `rgba(2,4,9,${.6 * pB})`; c.fillRect(0, 0, W, H);
      const h = promptCard(c, 200, 180, 1520, PL(), PP(lt), { alpha: pB, t: lt });
      const ap = env(lt, E(10) - .2, C(11) + .2, .3, .3);
      if (ap > 0) {
        c.save(); c.globalAlpha = ap; const x = 610, y = 200 + h + 30;
        rrect(c, x, y, 700, 190, 22); c.fillStyle = 'rgba(18,22,32,.97)'; c.fill(); c.strokeStyle = P.orange; c.lineWidth = 2; c.stroke();
        text(c, 'طلب صلاحية: قراءة مجلد المشروع فقط', x + 660, y + 50, { size: 30, align: 'right', weight: 700 });
        text(c, 'لن يُحذف أو يُعدّل أي ملف', x + 660, y + 92, { size: 24, align: 'right', color: P.mut });
        rrect(c, x + 470, y + 120, 190, 50, 25); c.fillStyle = P.green; c.fill(); text(c, 'سماح', x + 565, y + 146, { size: 26, weight: 700, color: '#04140c' });
        rrect(c, x + 260, y + 120, 190, 50, 25); c.strokeStyle = P.mut; c.stroke(); text(c, 'رفض', x + 355, y + 146, { size: 26, color: P.mut });
        text(c, 'توضيح · ILLUSTRATION', x + 20, y + 30, { size: 15, fam: LAT + ',' + AR, align: 'left', dir: 'ltr', color: P.mut });
        c.restore();
      }
    }
    // C: the real result of a delegated, read-only task
    const pC = env(lt, C(11), C(12) + .3, .4, .4);
    if (pC > 0) {
      holo(c, 300, 110, 1320, 840, { img: IMG.review_md, zoom: 1.32, alpha: pC, sy: prog(lt, C(11), C(12)) * .65, title: 'folder_review_report.md', live: true, badge: 'مهمة حقيقية · Claude Code · قراءة فقط', t: lt, scan: 1 });
    }
    // D: safety
    const pD = env(lt, C(12), L + .5, .4, 0);
    if (pD > 0) {
      c.fillStyle = `rgba(2,4,9,${.7 * pD})`; c.fillRect(0, 0, W, H);
      const cards = [['تعتمد على الخطة والبيئة', 'بعض القدرات غير متاحة في كل مكان', ico.gear(P.sky), P.sky, C(12)], ['موافقتك أولاً', 'صلاحيات محددة لكل إجراء', ico.check(P.green), P.green, C(13)], ['لا وصول مفتوح', 'للملفات والحسابات الحساسة', ico.lock(P.orange), P.orange, C(14)]];
      cards.forEach(([t1, t2, ic, col, at], i) => card(c, 1320 - i * 580, 360, 520, 170, t1, t2, { a: pD * prog(lt, at, at + .5), color: col, icon: ic }));
      statement(c, ["DON'T JUST ASK.", 'DELEGATE.'], W / 2, 720, prog(lt, C(14) + .5, C(14) + 2), { size: 64, sep: ' ', accent: P.orange });
    }
    sceneTitle(c, 6, 'COMPUTER USE AND COWORK', sc.title_ar, lt);
  }

  // ===================== SCENE 7 — SEARCH, CONNECTORS & MCP =====================
  const GLOBE = (() => { const n = 700, pts = []; for (let i = 0; i < n; i++) { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); } return pts; })();
  function globe(c, cx, cy, R, rot, a) {
    c.save(); c.globalAlpha = a;
    const g = c.createRadialGradient(cx - R * .3, cy - R * .3, 0, cx, cy, R * 1.2); g.addColorStop(0, rgba(P.blue, .25)); g.addColorStop(1, rgba(P.blue, 0)); c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R * 1.2, 0, 7); c.fill();
    for (const [x, y, z] of GLOBE) { const xr = x * Math.cos(rot) - z * Math.sin(rot), zr = x * Math.sin(rot) + z * Math.cos(rot); const d = (zr + 1) / 2; c.globalAlpha = a * (.15 + .85 * d); c.fillStyle = d > .6 ? P.cyan : P.blue; c.beginPath(); c.arc(cx + xr * R, cy + y * R, 1.4 + 2 * d, 0, 7); c.fill(); }
    c.restore();
  }
  function s7(c, lt, sc) {
    const { C, E, L, PP, PL } = mk(sc);
    bg(c, '#04101c', '#020408', W / 2, H / 2, P.cyan, .18, 900);
    const zoomOut = 1.25 - .25 * ease.out(prog(lt, 0, 3));
    const pA = env(lt, 0, C(7) + .3, 0, .5);
    if (pA > 0) {
      c.save(); c.globalAlpha = pA; cam(c, 0, 0, zoomOut);
      const cx = W / 2, cy = 520; globe(c, cx, cy, 300, lt * .25, 1);
      const nodes = [['المواقع', -1, -.6], ['قواعد البيانات', 1, -.6], ['التطبيقات', -1.25, .3], ['الملفات', 1.25, .3], ['الخدمات', 0, -1.2], ['MCP', 0, .98]];
      nodes.forEach(([s, nx, ny], i) => {
        const x = cx + nx * 620, y = cy + ny * 330; const ap = prog(lt, .4 + i * .35, .9 + i * .35); const link = prog(lt, C(2) + i * .25, C(2) + i * .25 + .8);
        if (link > 0) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba(i === 5 ? P.orange : P.cyan, .7 * link); c.lineWidth = 3; c.setLineDash([12, 10]); c.lineDashOffset = -lt * 60; c.beginPath(); c.moveTo(x, y); c.lineTo(lerp(x, cx, link), lerp(y, cy, link)); c.stroke(); c.restore(); glowDot(c, lerp(x, cx, (lt * .8 + i * .2) % 1), lerp(y, cy, (lt * .8 + i * .2) % 1), 14, P.white, link); }
        chip(c, s, x, y, { alpha: ap, size: 30, color: i === 5 ? P.orange : P.cyan, fam: i === 5 ? LAT : AR, dir: i === 5 ? 'ltr' : 'rtl' });
      });
      glowDot(c, cx, cy, 120, P.white, .5 + .2 * Math.sin(lt * 3));
      text(c, 'Connectors + MCP', 330, 980 - 880, { size: 54, fam: LAT, weight: 700, dir: 'ltr', glow: 20, alpha: env(lt, C(2), C(4), .3, .4) });
      c.restore();
      // many tools → one pipeline
      const pT = env(lt, C(4), C(7) + .3, .3, .4);
      if (pT > 0) {
        c.save(); c.globalAlpha = pT; c.fillStyle = 'rgba(2,4,8,.8)'; c.fillRect(0, 0, W, H);
        const m = ease.io(prog(lt, C(5), C(5) + 1.4)); const r = mulberry(4);
        for (let i = 0; i < 36; i++) { const x0 = 100 + r() * (W - 200), y0 = 100 + r() * (H - 300); const tx = 300 + (i % 4) * 440, ty = 540; c.fillStyle = [P.cyan, P.blue, P.violet, P.orange][i % 4]; c.globalAlpha = pT * (1 - m * .9); rrect(c, lerp(x0, tx, m) - 22, lerp(y0, ty, m) - 22, 44, 44, 10); c.fill(); }
        c.globalAlpha = pT;
        statement(c, ['SEARCH', 'CONNECT', 'ANALYZE', 'DELIVER'], W / 2, 540, prog(lt, C(5) + .8, C(6) + 1), { size: 60 });
        c.restore();
      }
    }
    const pB = env(lt, C(7), C(9) + .7, .4, .4);
    if (pB > 0) { c.fillStyle = `rgba(2,4,8,${.6 * pB})`; c.fillRect(0, 0, W, H); promptCard(c, 260, 320, 1400, PL(), PP(lt), { alpha: pB, t: lt }); }
    const pC = env(lt, C(9) + .5, C(11) + .3, .4, .4);
    if (pC > 0) {
      const sy = prog(lt, C(9) + .5, C(11)) * .55;
      holo(c, 200, 110, 1180, 840, { img: IMG.research_md, zoom: 1.32, alpha: pC, sy, title: 'market_research_report.md', live: true, badge: 'بحث ويب حقيقي · 18 نوفمبر 2026', t: lt, scan: 1 });
      chip(c, '● معلومات من مصادر — مع الرابط', 1650, 380, { alpha: pC * prog(lt, C(10) - .5, C(10)), color: P.green, size: 28 });
      chip(c, '● تحليل مولَّد — استنتاجات Claude', 1650, 470, { alpha: pC * prog(lt, C(10) + .4, C(10) + .9), color: P.violet, size: 28 });
    }
    const pD = env(lt, C(11), L + .5, .4, 0);
    if (pD > 0) {
      c.fillStyle = `rgba(2,4,8,${.85 * pD})`; c.fillRect(0, 0, W, H);
      c.save(); c.globalAlpha = pD; const cx = W / 2, cy = 480, R = 230;
      c.strokeStyle = P.orange; c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, R, lt * .9, lt * .9 + Math.PI * 1.75); c.stroke();
      ['بحث', 'ربط', 'تحليل', 'تسليم'].forEach((s, i) => { const a = lt * .9 + i * Math.PI / 2; chip(c, s, cx + Math.cos(a) * R, cy + Math.sin(a) * R, { size: 30, color: P.orange }); });
      text(c, 'Workflow', cx, cy, { size: 64, fam: LAT, weight: 700, dir: 'ltr', glow: 20, glowColor: P.orange });
      text(c, 'من مهمة عشوائية… إلى مهارة متكررة', cx, 800, { size: 48, weight: 700, alpha: prog(lt, C(12), C(12) + .5) });
      c.restore();
    }
    sceneTitle(c, 7, 'WEB SEARCH, CONNECTORS AND MCP', sc.title_ar, lt);
  }

  // ===================== SCENE 8 — FINALE =====================
  function s8(c, lt, sc) {
    const { C, E, L } = mk(sc);
    const shots = [IMG.analysis_report, IMG.task_03_added, IMG.orders_03_dashboard, IMG.research_md, IMG.skill_report1, IMG.review_md];
    const pA = env(lt, 0, C(7) + .2, .6, .5);
    if (pA > 0) {
      c.save(); c.globalAlpha = pA;
      bg(c, '#0a1220', '#05070b', W / 2, 360, P.cyan, .25);
      c.save(); cam(c, 0, 0, 1.06 - .06 * ease.out(prog(lt, 0, C(7))));
      desk(c, true, lt, shots);
      rashed(c, 760, 770, .95, { mood: 2, t: lt, rim: P.cyan, look: .4 });
      claude(c, 1220, 520, .62, { t: lt });
      // recap highlights: each line lights up one monitor
      const mons = [[150, 300, 380, 230], [560, 230, 420, 260], [1000, 230, 420, 260], [1440, 300, 380, 230], [330, 560, 300, 180], [1300, 560, 300, 180]];
      const order = [0, 1, 2, 4, 5, 3];
      for (let i = 0; i < 6; i++) { const a = env(lt, C(i + 1), C(i + 1) + 2.2, .2, .8); if (a <= 0) continue; const [x, y, w, h] = mons[order[i]]; c.save(); c.globalAlpha = a; c.strokeStyle = P.orange; c.lineWidth = 5; c.shadowColor = P.orange; c.shadowBlur = 40; rrect(c, x - 10, y - 10, w + 20, h + 20, 12); c.stroke(); c.restore(); }
      c.restore();
      const rec = ['حللنا البيانات', 'صممنا تطبيقاً تفاعلياً', 'كتبنا الأكواد', 'أنشأنا مهارات متخصصة', 'تعلمنا تفويض المهام', 'ربطنا الأدوات والمصادر'];
      rec.forEach((s, i) => chip(c, '✓ ' + s, 1640, 140 + i * 74, { alpha: prog(lt, C(i + 1), C(i + 1) + .3), color: P.green, size: 26 }));
      c.restore();
    }
    // the mindset
    const pB = env(lt, C(7), C(13) + .3, .4, .5);
    if (pB > 0) {
      c.save(); c.globalAlpha = pB; c.fillStyle = '#020305'; c.fillRect(0, 0, W, H);
      const sp = c.createRadialGradient(W / 2, 200, 0, W / 2, 600, 700); sp.addColorStop(0, rgba(P.white, .18)); sp.addColorStop(1, rgba(P.white, 0)); c.fillStyle = sp; c.fillRect(0, 0, W, H);
      rashed(c, W / 2, 1000, .9, { mood: 1, t: lt, rim: P.white, alpha: env(lt, C(7), C(9) + .3, .5, .4) });
      text(c, 'طريقة تفكيرك أنت', W / 2, 260, { size: 96, weight: 800, glow: 40, alpha: env(lt, C(8), C(9) + .2, .3, .4) });
      if (lt > C(9) - .1) {
        const q0 = 'وش السؤال اللي أقدر أسأله لكلود؟';
        text(c, q0, W / 2, 230, { size: 48, color: P.mut, alpha: prog(lt, C(9), C(9) + .4) });
        const sk = prog(lt, C(9) + 1.4, C(9) + 2); font(c, 48); const w = c.measureText(q0).width;
        c.strokeStyle = P.red; c.lineWidth = 5; c.beginPath(); c.moveTo(W / 2 + w / 2, 234); c.lineTo(W / 2 + w / 2 - w * sk, 234); c.stroke();
        ['وش المهمة اللي أقدر أفوضها له؟', 'وش العملية اللي أقدر أحولها إلى نظام؟', 'وش المشروع اللي أقدر أبنيه؟'].forEach((q, i) => text(c, q, W / 2, 420 + i * 150, { size: 64, weight: 800, color: i === 0 ? P.cyan : i === 1 ? P.sky : P.orange, glow: 24, glowColor: [P.cyan, P.sky, P.orange][i], alpha: prog(lt, C(10 + i), C(10 + i) + .4) }));
      }
      c.restore();
    }
    // command center reveal
    const pC = env(lt, C(13), C(15) + .4, .5, .5);
    if (pC > 0) {
      c.save(); c.globalAlpha = pC;
      bg(c, '#06101e', '#020409', W / 2, 420, P.blue, .3, 1200);
      const back = ease.io(prog(lt, C(13), C(15)));
      c.save(); cam(c, 0, 0, 1.6 - .75 * back);
      grid(c, lt, { hy: 700, alpha: .3 });
      const all = [IMG.analysis_report, IMG.task_03_added, IMG.orders_03_dashboard, IMG.research_md, IMG.skill_report1, IMG.review_md, IMG.orders_05_status_changed, IMG.task_06_light, IMG.skill_md, IMG.sheet, IMG.project_md, IMG.req_md];
      for (let row = 0; row < 3; row++) for (let k = 0; k < 6; k++) {
        const x = -260 + k * 420 + (row % 2) * 80, y = 120 + row * 210; const s = 1 - row * .1;
        holo(c, x, y, 360 * s, 190 * s, { img: all[(row * 6 + k) % all.length], t: lt, color: [P.cyan, P.violet, P.orange][row] });
      }
      rashed(c, 860, 860, .5, { mood: 2, t: lt, rim: P.cyan }); claude(c, 1080, 720, .38, { t: lt });
      c.restore(); c.restore();
      text(c, 'المستقبل لمن يحوّل الأدوات إلى نتائج حقيقية', W / 2, 110, { size: 50, weight: 700, glow: 20, alpha: pC * prog(lt, C(14), C(14) + .5) });
    }
    // Rashed speaks to camera
    const pD = env(lt, C(15), E(16) + 1.2, .4, .6);
    if (pD > 0) {
      c.save(); c.globalAlpha = pD;
      bg(c, '#0a1220', '#04060a', 700, 400, P.cyan, .3);
      particles(c, lt, { alpha: .3, speed: 25 });
      rashed(c, 760, 1080, 1.35, { mood: 2, t: lt, rim: P.cyan, look: 0, light: 1.3 });
      claude(c, 1450, 520, .55, { t: lt, alpha: .9 });
      text(c, 'وش أول شيء راح تخليه ينجزه عنك؟', 1300, 760, { size: 46, weight: 800, glow: 20, alpha: prog(lt, C(16) + .5, C(16) + 1) });
      c.restore();
    }
    // final screen
    const tf = E(16) + .9; const pF = prog(lt, tf, tf + 1);
    if (pF > 0) {
      c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
      lightRays(c, W / 2, H / 2 - 80, lt, { n: 12, alpha: .08 * pF, len: 1200 });
      glitchTitle(c, 'CLAUDE.', W / 2, H / 2 - 110, 200, ease.out(pF), lt, { spacing: 30 });
      text(c, 'THINK BEYOND CHAT.', W / 2, H / 2 + 60, { size: 54, fam: LAT, weight: 500, dir: 'ltr', spacing: 14, color: P.sky, alpha: prog(lt, tf + 1, tf + 1.8) });
      text(c, 'BUILD BEYOND LIMITS.', W / 2, H / 2 + 140, { size: 54, fam: LAT, weight: 700, dir: 'ltr', spacing: 14, color: P.orange, alpha: prog(lt, tf + 1.8, tf + 2.6) });
      fadeBlack(c, prog(lt, L - 1.8, L - .2));
    }
  }

  // ===================== transitions =====================
  function transition(c, cv, t) {
    const b = SC.map(s => s.start);
    for (let k = 1; k < SC.length; k++) {
      const d = t - b[k]; if (Math.abs(d) > .7) continue;
      const p = 1 - Math.abs(d) / .7; // 0 → 1 at the cut → 0
      switch (k) {
        case 1: { // light explosion into an interface
          const g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 1300 * ease.out(p) + 1); g.addColorStop(0, `rgba(255,255,255,${p})`); g.addColorStop(.5, rgba(P.sky, .8 * p)); g.addColorStop(1, rgba(P.blue, 0));
          c.fillStyle = g; c.fillRect(0, 0, W, H); break; }
        case 2: { // data shards
          const r = mulberry(77); c.save();
          for (let i = 0; i < 70; i++) { const x = r() * W, y = r() * H, s = 80 + r() * 260; c.globalAlpha = p; c.fillStyle = [P.cyan, P.blue, '#0b1020', P.white][i % 4]; c.beginPath(); const dx = (d > 0 ? 1 : -1) * (1 - p) * 600 * (r() - .5); c.moveTo(x + dx, y - s); c.lineTo(x + s + dx, y + s * .6); c.lineTo(x - s * .8 + dx, y + s * .4); c.closePath(); c.fill(); }
          c.restore(); break; }
        case 3: { // pixel dissolve
          const r = mulberry(5); const n = 32, m = 18; c.save();
          for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { if (r() < p * 1.15) { c.fillStyle = r() < .08 ? rgba(P.cyan, .8) : '#030406'; c.fillRect(i * W / n, j * H / m, W / n + 1, H / m + 1); } }
          c.restore(); break; }
        case 4: { // portal door iris
          c.save(); c.fillStyle = '#000'; const w = W * (1 - p) * 1.2, h = H * (1 - p) * 1.3;
          c.beginPath(); c.rect(0, 0, W, H); c.roundRect(W / 2 - w / 2, H / 2 - h / 2, w, h, [w / 2, w / 2, 0, 0]); c.fill('evenodd');
          c.strokeStyle = rgba(P.violet, p); c.lineWidth = 6; c.shadowColor = P.violet; c.shadowBlur = 40; c.beginPath(); c.roundRect(W / 2 - w / 2, H / 2 - h / 2, w, h, [w / 2, w / 2, 0, 0]); c.stroke(); c.restore(); break; }
        case 5: { // zoom through the screen
          c.save(); c.globalCompositeOperation = 'lighter'; const r = mulberry(9);
          for (let i = 0; i < 120; i++) { const a = r() * 7, r0 = 100 + r() * 500, len = 200 + 900 * p; c.strokeStyle = rgba(i % 2 ? P.sky : P.white, .5 * p); c.lineWidth = 2; c.beginPath(); c.moveTo(W / 2 + Math.cos(a) * r0, H / 2 + Math.sin(a) * r0); c.lineTo(W / 2 + Math.cos(a) * (r0 + len), H / 2 + Math.sin(a) * (r0 + len)); c.stroke(); }
          c.restore(); flash(c, p * p * .8, '#cfe8ff'); break; }
        case 6: { // digital glitch cut
          sliceGlitch(cv, c, p * 1.4, Math.floor(t * 30)); if (p > .7) flash(c, (p - .7) * 2, '#000'); break; }
        case 7: { // particles converge then burst
          c.save(); c.fillStyle = `rgba(0,0,0,${p * .9})`; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'lighter'; const r = mulberry(13);
          for (let i = 0; i < 200; i++) { const a = r() * 7, rr = (d < 0 ? (1 - p) : (1 - p) * 1.6) * 1100 + 4; c.fillStyle = rgba(i % 3 ? P.cyan : P.white, p); c.beginPath(); c.arc(W / 2 + Math.cos(a) * rr * (.4 + r()), H / 2 + Math.sin(a) * rr * (.4 + r()), 2.5, 0, 7); c.fill(); }
          glowDot(c, W / 2, H / 2, 200 * p, P.white, p); c.restore(); break; }
      }
    }
  }

  // ===================== subtitles =====================
  function subtitles(c, t) {
    let cue = null; for (const s of SC) for (const q of s.cues) if (t >= q.start && t < q.end + .12) cue = q;
    if (!cue) return;
    const a = Math.min(clamp((t - cue.start) / .12), clamp((cue.end + .12 - t) / .12));
    const lines = wrap(c, cue.text, 1380, 42, AR, 500);
    const lh = 58, h = lines.length * lh + 26; const y0 = H - 70 - h;
    c.save(); c.globalAlpha = a;
    font(c, 42, AR, 500); const w = Math.max(...lines.map(l => c.measureText(l).width)) + 70;
    rrect(c, W / 2 - w / 2, y0, w, h, 14); c.fillStyle = 'rgba(4,6,10,.62)'; c.fill();
    if (cue.prompt) { c.strokeStyle = rgba(P.cyan, .6); c.lineWidth = 1.5; c.stroke(); }
    lines.forEach((l, i) => text(c, l, W / 2, y0 + 13 + lh / 2 + i * lh, { size: 42, color: cue.prompt ? '#a5f3fc' : P.white }));
    c.restore();
  }

  const FNS = [s1, s2, s3, s4, s5, s6, s7, s8];
  function draw(c, cv, t, opts = {}) {
    const S = cv.width / W;
    c.setTransform(S, 0, 0, S, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
    let i = SC.findIndex(s => t >= s.start && t < s.end); if (i < 0) i = SC.length - 1;
    const sc = SC[i];
    c.save(); FNS[i](c, t - sc.start, sc); c.restore();
    c.setTransform(S, 0, 0, S, 0, 0);
    transition(c, cv, t);
    c.setTransform(S, 0, 0, S, 0, 0);
    post(c, t, { vignette: .5, grain: .045 });
    if (opts.subtitles !== false) subtitles(c, t);
  }
  return { duration: TL.duration, fps: TL.fps, draw };
}
