// CLAUDE — BEYOND THE CHAT · vertical 9:16 TikTok cut (1080×1920).
// Same characters, palette and real captures as the 16:9 film, recomposed for a phone screen.
// Safe zones: content y 180–1230, subtitles ~1260–1450, TikTok UI below 1500 and on the right edge.
import { P, AR, LAT, MONO, clamp, lerp, prog, ease, env, mulberry, noise1, rrect, rgba, font, text, wrap,
  drawImg, holo, liveBadge, promptCard, cursor, chip, glitchTitle, glowDot, lightRays, makeGrain } from './core.js';
import { rashed, claude } from './characters.js';

const VW = 1080, VH = 1920;

export function createShort(data, IMG) {
  const TL = data.short; const SC = TL.scenes; const A = data.analysis;
  makeGrain();
  const mk = sc => ({ C: i => sc.cues[i].start - sc.start, E: i => sc.cues[i].end - sc.start, L: sc.end - sc.start });

  function vbg(c, top, bottom, gx, gy, col, a = .3, r = 1100) {
    const g = c.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, top); g.addColorStop(1, bottom); c.fillStyle = g; c.fillRect(0, 0, VW, VH);
    const rg = c.createRadialGradient(gx, gy, 0, gx, gy, r); rg.addColorStop(0, rgba(col, a)); rg.addColorStop(1, rgba(col, 0)); c.fillStyle = rg; c.fillRect(0, 0, VW, VH);
  }
  const FIELD = (() => { const r = mulberry(17); return Array.from({ length: 260 }, () => ({ x: (r() - .5) * 2400, y: (r() - .5) * 4000, z: r() * 3000, s: r() * 1.5 + .4 })); })();
  function vparticles(c, t, a = .5, speed = 60, cy = VH * .4) {
    c.save(); c.globalCompositeOperation = 'lighter';
    for (const p of FIELD) {
      const z = ((p.z - t * speed) % 3000 + 3000) % 3000 + 50, k = 700 / z, x = VW / 2 + p.x * k, y = cy + p.y * k;
      if (x < -20 || x > VW + 20 || y < -20 || y > VH + 20) continue;
      c.globalAlpha = a * clamp(1 - z / 3000) * clamp(z / 300); c.fillStyle = p.s > 1.4 ? P.white : P.cyan;
      c.beginPath(); c.arc(x, y, p.s * k * 2, 0, 7); c.fill();
    }
    c.restore();
  }
  function vgrid(c, t, hy, col, a) {
    c.save(); c.strokeStyle = col; c.lineWidth = 1.2;
    for (let i = 0; i < 16; i++) { const zz = ((i - (t * .4) % 1) + 16) % 16 + .3; const y = hy + 600 / zz; if (y > VH) continue; c.globalAlpha = a * clamp(1 - zz / 16); c.beginPath(); c.moveTo(0, y); c.lineTo(VW, y); c.stroke(); }
    for (let i = -14; i <= 14; i++) { c.globalAlpha = a * .5 * (1 - Math.abs(i) / 14); c.beginPath(); c.moveTo(VW / 2 + i * 4, hy); c.lineTo(VW / 2 + i * 160, VH); c.stroke(); }
    c.restore();
  }
  const vflash = (c, a, col = '#fff') => { if (a <= 0) return; c.save(); c.globalAlpha = clamp(a); c.fillStyle = col; c.fillRect(0, 0, VW, VH); c.restore(); };
  function vpost(c, t) {
    const v = c.createRadialGradient(VW / 2, VH * .45, VW * .45, VW / 2, VH * .45, VH * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)');
    c.fillStyle = v; c.fillRect(0, 0, VW, VH);
  }
  function hook(c, s, y, a, o = {}) { // big kinetic headline
    const lines = wrap(c, s, 940, o.size || 76, AR, 800);
    lines.forEach((l, i) => text(c, l, VW / 2, y + i * (o.size || 76) * 1.25, { size: o.size || 76, weight: 800, color: o.color || P.white, glow: 30, glowColor: o.glow || P.cyan, alpha: a }));
  }
  function phone(c, img, x, y, w, a = 1) {
    const h = w * 2.05; c.save(); c.globalAlpha *= a;
    c.fillStyle = '#05060a'; rrect(c, x - 14, y - 14, w + 28, h + 28, 46); c.fill(); c.strokeStyle = rgba(P.violet, .9); c.lineWidth = 2.5; c.stroke();
    drawImg(c, img, x, y, w, h, { fit: 'width' }); c.restore();
  }
  function term(c, x, y, w, h, lines, a) {
    c.save(); c.globalAlpha *= a; c.shadowColor = rgba(P.cyan, .4); c.shadowBlur = 40; c.fillStyle = 'rgba(6,8,12,.96)'; rrect(c, x, y, w, h, 18); c.fill(); c.shadowBlur = 0;
    c.strokeStyle = rgba(P.cyan, .5); c.stroke();
    ['#ef4444', '#f59e0b', '#22c55e'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(x + 28 + i * 22, y + 26, 7, 0, 7); c.fill(); });
    lines.forEach((L, i) => text(c, L.t, x + 26, y + 80 + i * 40, { size: 24, fam: MONO, align: 'left', dir: 'ltr', color: L.c }));
    c.restore();
  }

  // ---------------- scenes ----------------
  function sHook(c, lt, sc) {
    const { C, E, L } = mk(sc);
    const stop = C(2) - .05;
    if (lt < stop) {
      const [sx, sy] = [noise1(lt * 18) * 8, noise1(lt * 18 + 40) * 8];
      vbg(c, '#0b0c12', '#060709', VW / 2, 700, P.orange, .14);
      c.save(); c.translate(sx, sy);
      // papers + toasts
      const r = mulberry(4);
      for (let i = 0; i < 26; i++) { const sp = .5 + r(); const x = (r() * VW + lt * 200 * sp * (r() > .5 ? 1 : -1) + VW * 6) % (VW + 200) - 100, y = (r() * VH - lt * 150 * sp + VH * 6) % (VH + 200) - 100;
        c.save(); c.globalAlpha = .7; c.translate(x, y); c.rotate(lt * sp * 2 + i); c.scale(1, Math.sin(lt * 3 * sp + i)); c.fillStyle = '#d9dee8'; c.fillRect(-40, -52, 80, 104); c.restore(); }
      const mins = Math.floor(8 * 60 + Math.pow(lt, 2.1) * 60) % 1440;
      text(c, `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`, VW / 2, 330, { size: 190, fam: MONO, weight: 700, color: P.red, glow: 50, glowColor: P.red, dir: 'ltr' });
      rashed(c, VW / 2, 1080, 1.15, { mood: 0, t: lt, rim: P.orange, look: Math.sin(lt * 6) });
      const msgs = ['اجتماع بعد 5 دقائق', '34 رسالة غير مقروءة', 'عاجل: تحديث العرض', 'موعد التسليم اليوم', 'ملف Excel جديد', 'مكالمة فائتة (3)'];
      for (let k = 0; k < 14; k++) { const st = .2 + (stop - .5) * (1 - Math.pow(1 - k / 14, 1.7)); const a = env(lt, st, st + 1.3, .08, .3); if (a <= 0) continue;
        const x = 60 + r() * 520, y = 470 + r() * 560; c.save(); c.globalAlpha = a; rrect(c, x, y, 440, 80, 18); c.fillStyle = 'rgba(22,26,36,.95)'; c.fill(); c.strokeStyle = rgba(k % 3 ? P.sky : P.red, .7); c.stroke();
        c.fillStyle = k % 3 ? P.blue : P.red; c.beginPath(); c.arc(x + 400, y + 40, 18, 0, 7); c.fill(); text(c, msgs[k % msgs.length], x + 366, y + 40, { size: 27, align: 'right' }); c.restore(); }
      c.restore();
      return;
    }
    c.fillStyle = '#000'; c.fillRect(0, 0, VW, VH);
    const f = ease.io(prog(lt, stop + .3, C(3)));
    lightRays(c, VW / 2, 620, lt, { n: 16, alpha: .16 * f, len: 1500 });
    vparticles(c, lt, .5 * f, 50, 700);
    const tt = prog(lt, C(3) + .9, C(3) + 2);
    claude(c, VW / 2, 820 - 120 * tt, 1.15 - .3 * tt, { t: lt, form: f, alpha: 1 - .5 * tt });
    rashed(c, 230, 1660, 1.6, { back: true, rim: P.sky, t: lt, light: f, alpha: 1 - tt });
    if (tt > 0) {
      c.fillStyle = `rgba(0,0,0,${.5 * tt})`; c.fillRect(0, 0, VW, VH);
      glitchTitle(c, 'CLAUDE', VW / 2, 640, 170, ease.out(tt), lt, { spacing: 22 });
      text(c, 'BEYOND THE CHAT.', VW / 2, 780, { size: 50, fam: LAT, dir: 'ltr', spacing: 12, color: P.sky, alpha: tt });
    }
  }

  function sAnalyze(c, lt, sc) {
    const { C, E, L } = mk(sc);
    vbg(c, '#0a1020', '#04060b', VW / 2, 600, P.blue, .32); vgrid(c, lt, 1180, P.cyan, .25); vparticles(c, lt, .3, 30);
    const pA = env(lt, 0, C(1) + .4, .3, .4);
    if (pA > 0) {
      hook(c, 'ملف Excel فيه 5,000 عملية', 260, pA * prog(lt, 0, .4), { size: 64 });
      holo(c, 70, 400, 940, 640, { img: IMG.sheet, alpha: pA, sy: prog(lt, 0, C(1)) * .5, title: 'operations_2026_synthetic.xlsx', live: true, badge: 'بيانات مصطنعة · SYNTHETIC', t: lt, scan: 1, zoom: 1.6, ox: 1 });
      const n = Math.round(5000 * ease.out(prog(lt, .3, 1.8)));
      text(c, n.toLocaleString('en-US'), VW / 2, 1130, { size: 120, fam: LAT, weight: 700, color: P.cyan, glow: 30, dir: 'ltr', alpha: pA });
    }
    const pB = env(lt, C(1), C(2) + .3, .3, .3);
    if (pB > 0) {
      c.fillStyle = `rgba(4,6,11,${.6 * pB})`; c.fillRect(0, 0, VW, VH);
      const cue = sc.cues[1]; const p = clamp((lt - C(1)) / (E(1) - C(1) - .1));
      promptCard(c, 50, 420, 980, [cue.text.replace('وقل له: ', '')], p, { alpha: pB, attach: 'operations_2026_synthetic.xlsx', t: lt });
    }
    const pC = env(lt, C(2), L + .3, .3, 0);
    if (pC > 0) {
      hook(c, 'والنتيجة؟', 250, pC * prog(lt, C(2), C(2) + .3), { size: 80 });
      const sy = prog(lt, C(2), L) * .9;
      holo(c, 50, 360, 980, 800, { img: IMG.analysis_report, alpha: pC, sy, zoom: 1.45, ox: 1, title: 'تحليل حقيقي للملف', live: true, t: lt, scan: .5 });
      const an = A.anomalies[0];
      [[`نسبة التأخير ${A.late_rate}%`, P.cyan], [`${an.city} — ${an.month}: ${an.late_rate}%`, P.orange]].forEach(([s, col], i) =>
        chip(c, s, VW / 2, 1210 + i * 0, { alpha: env(lt, C(2) + .6 + i * 1.2, C(2) + 1.6 + i * 1.2, .2, .2), color: col, size: 34 }));
      chip(c, '⚠ راجع الأرقام قبل القرارات المهمة', VW / 2, 1210, { alpha: env(lt, C(3), L + .3, .25, 0), color: P.orange, size: 34 });
    }
  }

  function sArtifacts(c, lt, sc) {
    const { C, E, L } = mk(sc);
    vbg(c, '#130b26', '#06050b', VW / 2, 700, P.violet, .33); vgrid(c, lt, 1200, P.violet, .3);
    const pA = env(lt, 0, C(2) + .2, 0, .3);
    if (pA > 0) {
      c.save(); c.globalAlpha = pA;
      const R = { x: 140, y: 360, w: 800, h: 560 }; const dp = prog(lt, .2, C(1));
      c.save(); c.strokeStyle = P.cyan; c.lineWidth = 7; c.shadowColor = P.cyan; c.shadowBlur = 30; c.setLineDash([2 * (R.w + R.h) * dp, 99999]);
      rrect(c, R.x, R.y, R.w, R.h, 20); c.stroke(); c.restore();
      const m = ease.out(prog(lt, C(1), C(1) + .8));
      if (m > 0) { c.save(); c.globalAlpha = m; rrect(c, R.x, R.y, R.w, R.h, 20); c.fillStyle = 'rgba(14,16,30,.92)'; c.fill();
        for (let i = 0; i < 7; i++) { const bh = (80 + 200 * Math.abs(Math.sin(i * 1.7 + lt))) * m; c.fillStyle = i % 2 ? P.cyan : P.violet; rrect(c, R.x + 50 + i * 70, R.y + R.h - 60 - bh, 48, bh, 8); c.fill(); }
        c.strokeStyle = P.orange; c.lineWidth = 16; c.beginPath(); c.arc(R.x + R.w - 140, R.y + 150, 90, -Math.PI / 2, -Math.PI / 2 + Math.PI * 1.5 * m); c.stroke(); c.restore(); }
      hook(c, lt < C(1) ? 'بدل ما يشرح لك…' : 'يبنيها!', 240, 1, { size: lt < C(1) ? 70 : 120, glow: P.violet });
      rashed(c, 780, 1380, .9, { mood: lt > C(1) ? 2 : 1, t: lt, rim: P.violet, look: -.8 });
      c.restore();
    }
    const pB = env(lt, C(2), L + .3, .3, 0);
    if (pB > 0) {
      const steps = [['task_01_initial', C(2)], ['task_03_added', C(2) + 1.2], ['task_04_checked', C(2) + 2.2], ['task_06_light', C(3)]];
      let cur = 0; steps.forEach((s, i) => { if (lt >= s[1]) cur = i; });
      const mob = prog(lt, C(3) + 1.0, C(3) + 1.6);
      hook(c, 'تطبيق مهام عربي — بناه قدامنا', 230, pB, { size: 58, glow: P.violet });
      holo(c, 40, 330, 1000, 700, { img: IMG[steps[cur][0]], alpha: pB * (1 - mob), title: 'Artifact منشور فعلياً', live: true, color: P.violet, t: lt, zoom: 1.25, ox: .55 });
      if (mob > 0) { phone(c, IMG.task_08_mobile_dark, 90, 330, 420, mob * pB); phone(c, IMG.task_07_mobile_light, 570, 330, 420, mob * pB); }
      if (mob < 1) cursor(c, lerp(700, 300, prog(lt, C(2) + .4, C(2) + 1.1)), lerp(800, 560, prog(lt, C(2) + .4, C(2) + 1.1)), prog(lt, C(2) + 1.1, C(2) + 1.5));
    }
  }

  function sCode(c, lt, sc) {
    const { C, E, L } = mk(sc);
    c.fillStyle = '#030406'; c.fillRect(0, 0, VW, VH);
    const code = data.code;
    for (let i = 0; i < 70; i++) { const y = (i * 30 - lt * 40) % 2100 + (i * 30 - lt * 40 < 0 ? 2100 : 0) - 60; text(c, code[(i * 7) % code.length].slice(0, 44), 40, y, { size: 20, fam: MONO, align: 'left', dir: 'ltr', color: P.cyan, alpha: .16 }); }
    glitchTitle(c, 'Claude Code', VW / 2, 240, 96, prog(lt, 0, .6), lt, { spacing: 4 });
    const pA = env(lt, 0, C(2) + .2, .3, .3);
    if (pA > 0) {
      const shot = lt < C(1) + .6 ? 'orders_01_login' : 'orders_03_dashboard';
      holo(c, 40, 380, 1000, 640, { img: IMG[shot], alpha: pA, title: 'نظام إدارة الطلبات — يعمل فعلياً', live: true, t: lt, zoom: 1.35, ox: .6 });
      ['تسجيل دخول', 'لوحة تحكم', 'اختبارات'].forEach((s, i) => chip(c, s, 220 + i * 320, 1120, { alpha: pA * prog(lt, C(1) + i * .5, C(1) + i * .5 + .3), size: 32 }));
    }
    const pB = env(lt, C(2), L + .3, .3, 0);
    if (pB > 0) {
      const fail = data.logs.fail.filter(s => /FAIL|ERROR|FAILED|Ran/.test(s)).map(s => s.replace(/ \(tests\..*\)/, ''));
      const lines = [{ t: '$ python3 -m unittest', c: '#cfe3ff' }];
      fail.slice(0, Math.floor(prog(lt, C(2), C(2) + 1.2) * fail.length)).forEach(s => lines.push({ t: s.slice(0, 50), c: '#ff6b6b' }));
      if (lt > C(3) - .2) { lines.push({ t: '# fix: state machine + history', c: P.mut }); lines.push({ t: '$ python3 -m unittest', c: '#cfe3ff' }); lines.push({ t: 'Ran 13 tests in 0.686s', c: '#5ef0a8' }); lines.push({ t: 'OK', c: '#5ef0a8' }); }
      term(c, 40, 380, 1000, 560, lines, pB);
      liveBadge(c, 60, 920, 'سجل حقيقي · REAL SESSION LOG');
      if (lt > C(3)) chip(c, '13 / 13 ✓', VW / 2, 1090, { color: P.green, size: 54, alpha: prog(lt, C(3), C(3) + .3) });
    }
  }

  function sSkills(c, lt, sc) {
    const { C, E, L } = mk(sc);
    vbg(c, '#06151a', '#030708', VW / 2, 600, P.green, .25);
    vparticles(c, lt, .25, 40);
    const pA = env(lt, 0, C(1) + .2, .3, .3);
    if (pA > 0) {
      hook(c, 'Skills = طريقتك، كل مرة', 240, pA, { size: 66, glow: P.green });
      const two = prog(lt, 1.6, 2.3);
      holo(c, 60, 360, 960, 720, { img: IMG.skill_md, alpha: pA * (1 - two), title: 'hospital-policy-review/SKILL.md', live: true, t: lt, color: P.green, zoom: 1.5, ox: .5 });
      if (two > 0) {
        holo(c, 40, 360, 490, 720, { img: IMG.skill_report1, alpha: pA * two, title: 'المهمة 1 · 60%', live: true, t: lt, color: P.green, zoom: 1.6, ox: .55 });
        holo(c, 550, 360, 490, 720, { img: IMG.skill_report2, alpha: pA * prog(lt, 2.3, 2.9), title: 'المهمة 2 · 20%', t: lt, color: P.orange, zoom: 1.6, ox: .55 });
        text(c, 'نفس المهارة · مهمتان مختلفتان', VW / 2, 1140, { size: 40, weight: 700, alpha: pA * two });
      }
    }
    const pB = env(lt, C(1), L + .3, .3, 0);
    if (pB > 0) {
      hook(c, 'فوّض… بصلاحيات أنت تحددها', 240, pB, { size: 62, glow: P.orange });
      holo(c, 60, 360, 960, 700, { img: IMG.review_md, alpha: pB, sy: prog(lt, C(1), L) * .5, title: 'مهمة مفوّضة · قراءة فقط', live: true, badge: 'مهمة حقيقية · Claude Code', t: lt, zoom: 1.5, ox: .5 });
      ['قراءة فقط', 'موافقتك أولاً', 'لا وصول مفتوح'].forEach((s, i) => chip(c, s, 200 + i * 340, 1130, { alpha: pB * prog(lt, C(2) + i * .4, C(2) + i * .4 + .3), color: [P.sky, P.green, P.orange][i], size: 30 }));
    }
  }

  function sFinale(c, lt, sc) {
    const { C, E, L } = mk(sc);
    c.fillStyle = '#020305'; c.fillRect(0, 0, VW, VH);
    const sp = c.createRadialGradient(VW / 2, 300, 0, VW / 2, 800, 900); sp.addColorStop(0, rgba(P.white, .16)); sp.addColorStop(1, rgba(P.white, 0)); c.fillStyle = sp; c.fillRect(0, 0, VW, VH);
    const pA = env(lt, 0, E(2) + .8, .3, .5);
    if (pA > 0) {
      const q0 = 'وش السؤال اللي أسأله لكلود؟';
      hook(c, q0, 320, pA * prog(lt, 0, .3), { size: 58, color: P.mut, glow: '#000000' });
      const sk = prog(lt, C(0) + 1.2, C(0) + 1.7); font(c, 58, AR, 800); const w = Math.min(940, c.measureText(q0).width);
      c.save(); c.globalAlpha = pA; c.strokeStyle = P.red; c.lineWidth = 6; c.beginPath(); c.moveTo(VW / 2 + w / 2, 324); c.lineTo(VW / 2 + w / 2 - w * sk, 324); c.stroke(); c.restore();
      hook(c, 'وش المهمة اللي أفوضها له؟', 520, pA * prog(lt, C(1), C(1) + .4), { size: 80, color: P.cyan });
      rashed(c, 400, 1400, 1.15, { mood: 2, t: lt, rim: P.cyan, alpha: pA * prog(lt, C(2) - .3, C(2) + .3) });
      claude(c, 820, 1010, .55, { t: lt, alpha: pA * prog(lt, C(2), C(2) + .5) });
    }
    const tf = E(2) + .6, pF = prog(lt, tf, tf + .8);
    if (pF > 0) {
      c.fillStyle = '#000'; c.fillRect(0, 0, VW, VH);
      lightRays(c, VW / 2, 760, lt, { n: 12, alpha: .1 * pF, len: 1300 });
      glitchTitle(c, 'CLAUDE.', VW / 2, 720, 180, ease.out(pF), lt, { spacing: 20 });
      text(c, 'THINK BEYOND CHAT.', VW / 2, 880, { size: 52, fam: LAT, dir: 'ltr', spacing: 10, color: P.sky, alpha: prog(lt, tf + .6, tf + 1.2) });
      text(c, 'BUILD BEYOND LIMITS.', VW / 2, 960, { size: 52, fam: LAT, weight: 700, dir: 'ltr', spacing: 10, color: P.orange, alpha: prog(lt, tf + 1.1, tf + 1.7) });
      vflash(c, prog(lt, L - .9, L - .1), '#000');
    }
  }

  function subtitles(c, t) {
    let cue = null; for (const s of SC) for (const q of s.cues) if (t >= q.start && t < q.end + .1) cue = q;
    if (!cue) return;
    const a = Math.min(clamp((t - cue.start) / .1), clamp((cue.end + .1 - t) / .1));
    const lines = wrap(c, cue.text, 900, 54, AR, 700); const lh = 74, h = lines.length * lh + 30, y0 = 1300;
    c.save(); c.globalAlpha = a; font(c, 54, AR, 700);
    const w = Math.max(...lines.map(l => c.measureText(l).width)) + 70;
    rrect(c, VW / 2 - w / 2, y0, w, h, 20); c.fillStyle = 'rgba(4,6,10,.72)'; c.fill();
    lines.forEach((l, i) => text(c, l, VW / 2, y0 + 15 + lh / 2 + i * lh, { size: 54, weight: 700, color: cue.prompt ? '#a5f3fc' : P.white }));
    c.restore();
  }

  const FNS = [sHook, sAnalyze, sArtifacts, sCode, sSkills, sFinale];
  const TRANS = ['flash', 'glitch', 'flash', 'glitch', 'zoom'];
  function draw(c, cv, t, opts = {}) {
    const S = cv.width / VW; c.setTransform(S, 0, 0, S, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    let i = SC.findIndex(s => t >= s.start && t < s.end); if (i < 0) i = SC.length - 1;
    c.save(); FNS[i](c, t - SC[i].start, SC[i]); c.restore();
    for (let k = 1; k < SC.length; k++) {
      const d = t - SC[k].start; if (Math.abs(d) > .35) continue; const p = 1 - Math.abs(d) / .35;
      if (TRANS[k - 1] === 'flash') vflash(c, p * .9, '#dff4ff');
      if (TRANS[k - 1] === 'glitch') { const r = mulberry(Math.floor(t * 30)); for (let j = 0; j < 10; j++) { const y = r() * VH, h = 10 + r() * 90; c.drawImage(cv, 0, y * S, cv.width, h * S, (r() - .5) * 160 * p, y, VW, h); } vflash(c, p * .3, P.cyan); }
      if (TRANS[k - 1] === 'zoom') { c.save(); c.globalCompositeOperation = 'lighter'; const r = mulberry(3); for (let j = 0; j < 80; j++) { const a = r() * 7, r0 = 80 + r() * 400; c.strokeStyle = rgba(P.sky, .5 * p); c.lineWidth = 2; c.beginPath(); c.moveTo(VW / 2 + Math.cos(a) * r0, 800 + Math.sin(a) * r0); c.lineTo(VW / 2 + Math.cos(a) * (r0 + 900 * p), 800 + Math.sin(a) * (r0 + 900 * p)); c.stroke(); } c.restore(); vflash(c, p * p * .7); }
    }
    vpost(c, t);
    if (opts.subtitles !== false) subtitles(c, t);
  }
  return { duration: TL.duration, fps: TL.fps, draw };
}
