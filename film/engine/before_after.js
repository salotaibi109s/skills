// «قبل وبعد» — vertical TikTok (1080×1920). Split screen: top = the old way, bottom = with Claude.
// "After" panels show REAL captures from the demos; "before" panels are illustrative.
import { P, AR, LAT, MONO, clamp, lerp, prog, ease, env, mulberry, rrect, rgba, font, text, wrap,
  drawImg, holo, liveBadge, promptCard, chip, glitchTitle, glowDot, lightRays, makeGrain } from './core.js';
import { rashed, claude } from './characters.js';

const VW = 1080, VH = 1920;
const TOP = { y: 170, h: 600 }, BOT = { y: 810, h: 600 };   // subtitles live at ~1440–1560

export function createBeforeAfter(data, IMG) {
  const TL = data.before_after; const SC = TL.scenes;
  makeGrain();
  const GRAIN_BA = (() => { const g = document.createElement('canvas'); g.width = g.height = 256; const x = g.getContext('2d'); const d = x.createImageData(256, 256); const r = mulberry(8);
    for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); return g; })();
  const mk = sc => ({ C: i => sc.cues[i].start - sc.start, E: i => sc.cues[i].end - sc.start, L: sc.end - sc.start });

  function base(c, t) {
    const g = c.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, '#0d0a0c'); g.addColorStop(.42, '#140b0b'); g.addColorStop(.43, '#06101c'); g.addColorStop(1, '#03060b');
    c.fillStyle = g; c.fillRect(0, 0, VW, VH);
    const r1 = c.createRadialGradient(VW / 2, 470, 0, VW / 2, 470, 700); r1.addColorStop(0, rgba(P.red, .12)); r1.addColorStop(1, rgba(P.red, 0)); c.fillStyle = r1; c.fillRect(0, 0, VW, 900);
    const r2 = c.createRadialGradient(VW / 2, 1110, 0, VW / 2, 1110, 700); r2.addColorStop(0, rgba(P.cyan, .14)); r2.addColorStop(1, rgba(P.cyan, 0)); c.fillStyle = r2; c.fillRect(0, 780, VW, 900);
  }
  function divider(c, t, a = 1) {
    c.save(); c.globalAlpha = a; const y = 790;
    const g = c.createLinearGradient(0, y, VW, y); g.addColorStop(0, rgba(P.red, 0)); g.addColorStop(.5, P.white); g.addColorStop(1, rgba(P.cyan, 0));
    c.fillStyle = g; c.fillRect(0, y - 1.5, VW, 3);
    c.beginPath(); c.arc(VW / 2, y, 38, 0, 7); c.fillStyle = '#0a0c12'; c.fill(); c.strokeStyle = P.white; c.lineWidth = 2; c.stroke();
    text(c, '⇅', VW / 2, y + 2, { size: 36, weight: 700 });
    c.restore();
  }
  function label(c, s, y, col, a) { chip(c, s, VW - 120, y, { color: col, size: 34, alpha: a, weight: 800 }); }
  // analogue clock spinning fast (the old way)
  function clock(c, x, y, r, t, a) {
    c.save(); c.globalAlpha = a; c.strokeStyle = rgba(P.red, .9); c.lineWidth = 4; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
    for (let i = 0; i < 12; i++) { const an = i * Math.PI / 6; c.beginPath(); c.moveTo(x + Math.cos(an) * r * .82, y + Math.sin(an) * r * .82); c.lineTo(x + Math.cos(an) * r * .95, y + Math.sin(an) * r * .95); c.stroke(); }
    const m = t * 9, h = t * .75; c.lineCap = 'round';
    c.lineWidth = 5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(m - Math.PI / 2) * r * .78, y + Math.sin(m - Math.PI / 2) * r * .78); c.stroke();
    c.lineWidth = 7; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(h - Math.PI / 2) * r * .5, y + Math.sin(h - Math.PI / 2) * r * .5); c.stroke();
    c.restore();
  }
  function stopwatch(c, x, y, secs, a) {
    const s = Math.min(59, Math.floor(secs));
    chip(c, `⏱ 00:${String(s).padStart(2, '0')}`, x, y, { fam: MONO, dir: 'ltr', size: 38, color: P.green, alpha: a, weight: 700 });
  }
  // ---- motion vocabulary adapted from promptmotion.org prompts ----
  const FR = t => Math.floor(t * 30);
  // Glitch Title (@aimikoda): letters flash one at a time (2 frames each) → full word jitters → glitches apart
  function glitchWord(c, word, x, y, size, t0, lt, col) {
    const f = FR(lt - t0), n = word.length; if (f < 0 || f > n * 3 + 26) return;
    const r = mulberry(f * 7 + 3);
    const put = (str, dx, dy, color, a) => text(c, str, x + dx, y + dy, { size, weight: 800, color, alpha: a, glow: 22, glowColor: col });
    c.save();
    if (f < n * 3) { put(word.slice(0, Math.floor(f / 3) + 1), 0, 0, '#ffffff', 1); }
    else if (f < n * 3 + 18) {
      const jx = (r() - .5) * 8, jy = (r() - .5) * 5;
      if (f % 5 === 0) { c.globalCompositeOperation = 'lighter'; put(word, jx - 12, jy, P.red, .8); put(word, jx + 12, jy, P.cyan, .8); c.globalCompositeOperation = 'source-over'; }
      put(word, jx, jy, '#ffffff', 1);
    } else {
      const q = (f - n * 3 - 18) / 8, h = size * 1.4, bands = 6;
      for (let i = 0; i < bands; i++) { const y0 = y - h / 2 + i * h / bands;
        c.save(); c.beginPath(); c.rect(0, y0, VW, h / bands); c.clip(); put(word, (r() - .5) * 260 * q, 0, i % 2 ? P.cyan : col, 1 - q); c.restore(); }
    }
    c.restore();
  }
  // broken vertical scan lines dripping down (red + cyan)
  function scanStreaks(c, lt, amt) {
    if (amt <= 0) return; const r = mulberry(FR(lt) + 11);
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 16; i++) { const x = r() * VW, w = 2 + r() * 12, y0 = r() * VH * .5, len = 300 + r() * 1100, col = r() > .5 ? P.red : P.cyan;
      const g = c.createLinearGradient(0, y0, 0, y0 + len); g.addColorStop(0, rgba(col, .9)); g.addColorStop(1, rgba(col, 0));
      c.globalAlpha = amt * (.35 + .5 * r()); c.fillStyle = g; c.fillRect(x, y0, w, len); }
    c.restore();
  }
  // horizontal slice shifts + RGB split on the finished frame
  function rgbSplit(c, cv, amt, seed) {
    if (amt <= 0) return; const S = cv.width / VW, r = mulberry(seed);
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .22 * amt;
    c.drawImage(cv, -12 * amt, 0, VW, VH); c.drawImage(cv, 12 * amt, 0, VW, VH); c.restore();
    for (let i = 0; i < 9; i++) { const y = r() * VH, h = 8 + r() * 80; c.drawImage(cv, 0, y * S, cv.width, h * S, (r() - .5) * 150 * amt, y, VW, h); }
  }
  // Object Strobe (@AmirMushich): machine-vision boxes jump over the result, part by part, then settle
  function visionStrobe(c, lt, t0, labels, box) {
    const d = lt - t0; if (d < 0 || d > 1.9) return;
    const f = FR(d), r = mulberry(Math.floor(f / 3) * 13 + 5);
    c.save(); c.strokeStyle = P.cyan; c.lineWidth = 3; c.shadowColor = P.cyan; c.shadowBlur = 16;
    const bracket = (x, y, w, h) => { const L = 26; for (const [cx, cy, dx, dy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { c.beginPath(); c.moveTo(cx + dx * L, cy); c.lineTo(cx, cy); c.lineTo(cx, cy + dy * L); c.stroke(); } };
    if (d < 1.3) {
      const w = 180 + r() * 360, h = 90 + r() * 200, x = box.x + r() * (box.w - w), y = box.y + r() * (box.h - h);
      bracket(x, y, w, h); c.fillStyle = rgba(P.cyan, .08); c.fillRect(x, y, w, h);
      const lab = labels[Math.floor(f / 3) % labels.length];
      font(c, 26, AR, 800); const lw = c.measureText(lab).width + 24;
      c.shadowBlur = 0; c.fillStyle = P.cyan; c.fillRect(x + w - lw, y - 38, lw, 34);
      text(c, lab, x + w - 12, y - 20, { size: 26, weight: 800, align: 'right', color: '#03141a' });
      if (f % 6 === 0) { c.globalAlpha = .12; c.fillStyle = '#fff'; c.fillRect(box.x, box.y, box.w, box.h); }
    } else {
      const a = 1 - (d - 1.3) / .6; c.globalAlpha = a; bracket(box.x - 6, box.y - 6, box.w + 12, box.h + 12);
      chip(c, labels[labels.length - 1], box.x + box.w / 2, box.y + box.h / 2, { size: 38, color: P.green, alpha: a, weight: 800 });
    }
    c.restore();
  }
  // Gacha reveal (@tamaandchoco): rays + particle burst + flash at the reveal
  const BURST = (() => { const r = mulberry(99); return Array.from({ length: 70 }, () => ({ a: r() * 6.283, v: 500 + r() * 900, s: 2 + r() * 5, c: r() })); })();
  function gachaBurst(c, lt, t0, x, y) {
    const d = lt - t0; if (d < 0 || d > 1.2) return;
    lightRays(c, x, y, lt, { n: 16, alpha: .22 * (1 - d / 1.2), len: 900, color: P.sky });
    c.save(); c.globalCompositeOperation = 'lighter';
    for (const p of BURST) { const k = d * (1 - d * .35); c.globalAlpha = 1 - d / 1.2; c.fillStyle = p.c > .66 ? P.orange : p.c > .33 ? P.cyan : P.white;
      c.beginPath(); c.arc(x + Math.cos(p.a) * p.v * k, y + Math.sin(p.a) * p.v * k + 300 * d * d, p.s, 0, 7); c.fill(); }
    c.restore();
    if (FR(d) < 2) { c.save(); c.globalAlpha = .55; c.fillStyle = '#fff'; c.fillRect(0, BOT.y - 20, VW, BOT.h + 40); c.restore(); }
  }
  const popScale = (lt, t0) => { const d = clamp((lt - t0) / .45); return d >= 1 ? 1 : .82 + .18 * ease.back(d); };

  const dim = (c, y, h, a) => { if (a <= 0) return; c.save(); c.fillStyle = `rgba(0,0,0,${.62 * a})`; c.fillRect(0, y - 20, VW, h + 40); c.restore(); };

  // one before/after round
  function round(c, lt, sc, o) {
    const { C, E, L } = mk(sc);
    const before = env(lt, 0, E(0) + .3, .25, 0), after = prog(lt, C(1) - .2, C(1) + .3);
    // ---- top: before ----
    c.save(); c.globalAlpha = 1; c.beginPath(); c.rect(0, 0, VW, 790); c.clip();
    o.before(c, lt, before);
    clock(c, 150, TOP.y + 90, 62, lt, 1);
    label(c, 'قبل', TOP.y + 60, P.red, 1);
    if (lt < C(1)) text(c, o.beforeTag, VW / 2, TOP.y + TOP.h - 30, { size: 40, weight: 800, color: '#ffb4b4', alpha: prog(lt, .6, 1.2), glow: 18, glowColor: P.red });
    c.restore();
    dim(c, TOP.y, TOP.h, after);
    // ---- bottom: after ----
    dim(c, BOT.y, BOT.h, 1 - after);
    const rv = C(1) + o.reveal, pc = { x: VW / 2, y: BOT.y + 345 };
    c.save(); c.beginPath(); c.rect(0, 790, VW, 650); c.clip();
    const ps = popScale(lt, rv); c.translate(pc.x, pc.y); c.scale(ps, ps); c.translate(-pc.x, -pc.y);
    o.after(c, lt, after, C(1), E(1)); c.restore();
    visionStrobe(c, lt, rv + .15, o.vision, { x: 70, y: BOT.y + 160, w: 940, h: 410 });
    gachaBurst(c, lt, rv, pc.x, pc.y);
    label(c, 'بعد', BOT.y + 60, P.cyan, 1);
    if (after > 0) {
      const fin = prog(lt, E(1) - .3, E(1) + .15), sc2 = fin > 0 && fin < 1 ? 1 + .35 * Math.sin(fin * Math.PI) : 1;
      c.save(); c.translate(190, BOT.y + 60); c.scale(sc2, sc2); c.translate(-190, -(BOT.y + 60));
      stopwatch(c, 190, BOT.y + 60, (lt - C(1)) / Math.max(.5, E(1) - C(1)) * o.secs, after); c.restore();
    }
    // hard-cut strobe into the "after" (cuts every 2–3 frames)
    const sw = env(lt, C(1) - .4, C(1) + .05, 0, 0);
    if (sw > 0) { const f = FR(lt); if (f % 3 === 0) { c.fillStyle = 'rgba(0,0,0,.85)'; c.fillRect(0, 0, VW, VH); } scanStreaks(c, lt, 1); }
    divider(c, lt);
    glitchWord(c, 'قبل', VW / 2, TOP.y + 330, 170, .05, lt, P.red);
    glitchWord(c, 'بعد', VW / 2, BOT.y + 330, 180, C(1) - .05, lt, P.cyan);
  }

  const ROUNDS = {
    ba_excel: {
      beforeTag: 'فرز… تصفية… حسابات… ساعات', secs: 58, reveal: 1.1,
      vision: ['5,000 صف', 'تأخير 20.5%', 'أعلى 5 أسباب', 'شذوذ: جدة — يوليو', 'رسوم بيانية', 'التقرير جاهز ✓'],
      before(c, lt, a) {
        holo(c, 60, TOP.y + 150, 960, 380, { img: IMG.sheet, sy: (lt * .04) % 1, title: '5,000 صف — يدوياً', color: P.red, t: lt, zoom: 1.7, ox: 1, alpha: .95 });
        const hy = TOP.y + 230 + ((lt * 60) % 280); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgba(P.orange, .22); c.fillRect(70, hy, 940, 22); c.restore();
        rashed(c, 930, TOP.y + 640, .5, { mood: 0, t: lt, rim: P.red, look: -.6 });
      },
      after(c, lt, a, c1, e1) {
        if (a <= 0) return;
        const p = prog(lt, c1, c1 + 1.2);
        if (p < 1) promptCard(c, 60, BOT.y + 140, 960, ['حلل الملف، وطلّع أكثر أسباب التأخير، مع رسوم وتوصيات.'], p * 1.1, { attach: 'operations_2026_synthetic.xlsx', t: lt, alpha: a, label: 'الطلب' });
        const r = prog(lt, c1 + 1.1, c1 + 1.6);
        if (r > 0) holo(c, 60, BOT.y + 110, 960, 470, { img: IMG.analysis_report, alpha: r, sy: prog(lt, c1 + 1.4, e1 + .5) * .5, zoom: 1.35, ox: 1, title: 'تقرير تنفيذي — حقيقي', live: true, badge: 'لقطة حقيقية', t: lt, scan: .5 });
      },
    },
    ba_app: {
      beforeTag: 'تدوّر مبرمج… وتنتظر', secs: 45, reveal: .15,
      vision: ['واجهة عربية', 'إحصائيات', 'أولويات', 'نسبة الإنجاز', 'وضع ليلي', 'التطبيق جاهز ✓'],
      before(c, lt, a) {
        c.save(); c.strokeStyle = rgba('#ffffff', .55); c.lineWidth = 3; c.setLineDash([10, 10]);
        rrect(c, 120, TOP.y + 150, 520, 380, 18); c.stroke(); c.setLineDash([]);
        for (let i = 0; i < 4; i++) { c.strokeStyle = rgba('#ffffff', .35); c.strokeRect(150, TOP.y + 200 + i * 70, 460, 44); }
        text(c, '؟', 380, TOP.y + 330, { size: 160, weight: 800, color: rgba('#ffffff', .25) });
        c.restore();
        const day = 1 + Math.floor(lt * 2.2) % 30;
        c.save(); c.translate(820, TOP.y + 330); rrect(c, -120, -130, 240, 260, 20); c.fillStyle = '#1b1416'; c.fill(); c.strokeStyle = P.red; c.lineWidth = 3; c.stroke();
        c.fillStyle = P.red; rrect(c, -120, -130, 240, 64, [20, 20, 0, 0]); c.fill();
        text(c, 'يوم', 0, -98, { size: 30, weight: 700 }); text(c, String(day), 0, 30, { size: 120, fam: LAT, weight: 700, dir: 'ltr', color: '#ffd5d5' }); c.restore();
      },
      after(c, lt, a, c1, e1) {
        if (a <= 0) return;
        const shots = ['task_01_initial', 'task_03_added', 'task_04_checked'];
        const k = Math.min(2, Math.floor(prog(lt, c1 + .4, e1) * 3));
        const build = prog(lt, c1, c1 + .6);
        holo(c, 60, BOT.y + 110, 960, 470, { img: IMG[shots[k]], alpha: a * build, zoom: 1.3, ox: .55, title: 'تطبيق مهامي اليومية', live: true, badge: 'لقطة حقيقية', color: P.violet, t: lt });
      },
    },
    ba_policy: {
      beforeTag: 'بند… بند… بند', secs: 40, reveal: .15,
      vision: ['10 معايير', 'الأدلة', 'المخاطر', 'السياسة 1: 60%', 'السياسة 2: 20%', 'التقرير جاهز ✓'],
      before(c, lt, a) {
        holo(c, 60, TOP.y + 150, 960, 380, { img: IMG.policy_raw, color: P.red, t: lt, zoom: 1.45, ox: .55, title: 'سياسة إعطاء الأدوية — مراجعة يدوية', alpha: .95 });
        const ly = TOP.y + 260 + ((lt * 70) % 240); c.save(); c.strokeStyle = P.red; c.lineWidth = 4; c.beginPath(); c.moveTo(620, ly); c.lineTo(980, ly); c.stroke(); c.restore();
      },
      after(c, lt, a, c1, e1) {
        if (a <= 0) return;
        const two = prog(lt, c1 + 1.2, c1 + 1.7);
        holo(c, 60, BOT.y + 110, 960, 470, { img: IMG.skill_md, alpha: a * (1 - two), zoom: 1.4, ox: .55, title: 'مهارة: مراجعة السياسات', live: true, badge: 'لقطة حقيقية', color: P.green, t: lt });
        if (two > 0) {
          holo(c, 60, BOT.y + 110, 470, 470, { img: IMG.skill_report1, alpha: two, zoom: 1.7, ox: .55, title: 'السياسة 1 · 60%', color: P.green, t: lt });
          holo(c, 550, BOT.y + 110, 470, 470, { img: IMG.skill_report2, alpha: prog(lt, c1 + 1.6, c1 + 2.1), zoom: 1.7, ox: .55, title: 'السياسة 2 · 20%', live: true, badge: 'لقطة حقيقية', color: P.orange, t: lt });
        }
      },
    },
  };

  function sHook(c, lt, sc) {
    const { C, E, L } = mk(sc);
    base(c, lt);
    c.save(); c.beginPath(); c.rect(0, 0, VW, 790); c.clip(); rashed(c, VW / 2, TOP.y + 560, .75, { mood: 0, t: lt, rim: P.red }); c.restore();
    c.save(); c.beginPath(); c.rect(0, 790, VW, 640); c.clip();
    rashed(c, 400, BOT.y + 560, .75, { mood: 2, t: lt, rim: P.cyan, alpha: prog(lt, C(1), C(1) + .4) });
    claude(c, 780, BOT.y + 330, .5, { t: lt, alpha: prog(lt, C(1) + .2, C(1) + .7) }); c.restore();
    label(c, 'قبل', TOP.y + 60, P.red, 1); label(c, 'بعد', BOT.y + 60, P.cyan, prog(lt, C(1), C(1) + .3));
    dim(c, BOT.y, BOT.h, 1 - prog(lt, C(1), C(1) + .3));
    divider(c, lt);
    text(c, 'نفس الشغل… مرتين', VW / 2, 110, { size: 70, weight: 800, glow: 30, alpha: prog(lt, 0, .3) });
    glitchWord(c, 'قبل', VW / 2, TOP.y + 300, 160, .1, lt, P.red);
    glitchWord(c, 'بعد', VW / 2, BOT.y + 300, 170, C(1), lt, P.cyan);
    scanStreaks(c, lt, env(lt, 0, .5, 0, .3));
  }
  function sEnd(c, lt, sc) {
    const { C, E, L } = mk(sc);
    c.fillStyle = '#020305'; c.fillRect(0, 0, VW, VH);
    lightRays(c, VW / 2, 760, lt, { n: 14, alpha: .1, len: 1400 });
    const a1 = env(lt, 0, E(1) + .5, .3, .3);
    text(c, 'الفرق مو بالسرعة بس…', VW / 2, 420, { size: 62, weight: 700, color: P.mut, alpha: a1 * prog(lt, 0, .4) });
    text(c, 'الفرق إنك تفوّض', VW / 2, 560, { size: 104, weight: 800, glow: 40, alpha: a1 * prog(lt, C(0) + 1.2, C(0) + 1.6) });
    claude(c, VW / 2, 1010, .65, { t: lt, alpha: a1 });
    chip(c, 'وش الشغل اللي ياخذ وقتك؟ 👇', VW / 2, 1330, { size: 42, color: P.orange, alpha: a1 * prog(lt, C(1), C(1) + .4), weight: 800 });
    const tf = E(1) + .5, pF = prog(lt, tf, tf + .6);
    const col = prog(lt, tf - .5, tf);
    if (col > 0 && pF <= 0) { // shrink what was on screen into a dot
      const S = c.canvas.width / VW, k = 1 - ease.in(col);
      const snap = document.createElement('canvas'); snap.width = c.canvas.width; snap.height = c.canvas.height; snap.getContext('2d').drawImage(c.canvas, 0, 0);
      c.fillStyle = '#000'; c.fillRect(0, 0, VW, VH);
      c.save(); c.translate(VW / 2, 760); c.scale(Math.max(k, .002), Math.max(k, .002)); c.drawImage(snap, -VW / 2, -760, VW, VH); c.restore();
      glowDot(c, VW / 2, 760, 40 + 60 * col, P.white, col);
    }
    if (pF > 0) {
      c.fillStyle = `rgba(0,0,0,${pF})`; c.fillRect(0, 0, VW, VH);
      glowDot(c, VW / 2, 760, 120 * (1 - pF) + 10, P.white, 1 - pF);
      glitchTitle(c, 'CLAUDE.', VW / 2, 760, 170, ease.out(pF), lt, { spacing: 20 });
      text(c, 'فكّر أبعد من المحادثة', VW / 2, 905, { size: 60, weight: 700, color: P.sky, alpha: prog(lt, tf + .4, tf + 1) });
    }
  }

  function subtitles(c, t) {
    let cue = null; for (const s of SC) for (const q of s.cues) if (t >= q.start && t < q.end + .1) cue = q;
    if (!cue) return;
    const a = Math.min(clamp((t - cue.start) / .1), clamp((cue.end + .1 - t) / .1));
    const lines = wrap(c, cue.text, 920, 50, AR, 700); const lh = 68, h = lines.length * lh + 28, y0 = 1440;
    c.save(); c.globalAlpha = a; font(c, 50, AR, 700);
    const w = Math.max(...lines.map(l => c.measureText(l).width)) + 64;
    rrect(c, VW / 2 - w / 2, y0, w, h, 20); c.fillStyle = 'rgba(4,6,10,.78)'; c.fill();
    const col = cue.text.startsWith('قبل') ? '#ffb4b4' : cue.text.startsWith('بعد') ? '#a5f3fc' : P.white;
    lines.forEach((l, i) => text(c, l, VW / 2, y0 + 14 + lh / 2 + i * lh, { size: 50, weight: 700, color: col }));
    c.restore();
  }

  function draw(c, cv, t, opts = {}) {
    const S = cv.width / VW; c.setTransform(S, 0, 0, S, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    let i = SC.findIndex(s => t >= s.start && t < s.end); if (i < 0) i = SC.length - 1;
    const sc = SC[i], lt = t - sc.start;
    c.save();
    if (sc.id === 'ba_hook') sHook(c, lt, sc);
    else if (sc.id === 'ba_end') sEnd(c, lt, sc);
    else { base(c, lt); round(c, lt, sc, ROUNDS[sc.id]); }
    c.restore();
    { let g = 0; for (const s2 of SC) { if (ROUNDS[s2.id]) { const sw = s2.cues[1].start; g = Math.max(g, env(t, sw - .4, sw + .25, .05, .2)); } g = Math.max(g, env(t, s2.start - .12, s2.start + .2, .05, .1)); }
      rgbSplit(c, cv, g, FR(t)); }
    for (let k = 1; k < SC.length; k++) { const d = t - SC[k].start; if (Math.abs(d) < .25) { c.save(); c.globalAlpha = (1 - Math.abs(d) / .25) * .85; c.fillStyle = k % 2 ? '#ffffff' : P.cyan; c.fillRect(0, 0, VW, VH); c.restore(); } }
    const v = c.createRadialGradient(VW / 2, VH * .45, VW * .45, VW / 2, VH * .45, VH * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); c.fillStyle = v; c.fillRect(0, 0, VW, VH);
    if (GRAIN_BA) { c.save(); c.globalAlpha = .05; c.globalCompositeOperation = 'overlay'; const r = mulberry(FR(t)); c.translate(-r() * 256, -r() * 256); c.fillStyle = c.createPattern(GRAIN_BA, 'repeat'); c.fillRect(0, 0, VW + 256, VH + 256); c.restore(); }
    if (opts.subtitles !== false) subtitles(c, t);
  }
  return { duration: TL.duration, fps: TL.fps, draw };
}
