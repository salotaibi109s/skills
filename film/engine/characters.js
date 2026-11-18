// Character bible implemented as code: Rashed and Claude are drawn by the same
// functions in every scene, so proportions, outfit and palette never drift.
import { P, rgba, clamp, lerp, mulberry, glowDot } from './core.js';

// RASHED — Saudi man, ~30, short black hair, trimmed beard, black crew-neck + black jacket.
// Origin = centre of the chest line (between shoulders). s = scale (1 => ~560px tall bust).
// mood: 0 tired … 1 neutral … 2 smile … 3 amazed. look: -1..1 horizontal gaze. rim: rim-light colour.
export function rashed(c, x, y, s = 1, o = {}) {
  const { mood = 1, look = 0, rim = P.cyan, t = 0, armUp = 0, hand = null, back = false, alpha = 1, light = 1 } = o;
  c.save(); c.globalAlpha *= alpha; c.translate(x, y); c.scale(s, s);
  const breathe = Math.sin(t * 1.6) * 2.5;
  const turn = look * 10; // head turn shifts features

  // --- torso / jacket ---
  c.save(); c.translate(0, breathe * .4);
  const jg = c.createLinearGradient(-200, 0, 200, 0);
  jg.addColorStop(0, '#07080b'); jg.addColorStop(.55, '#14161c'); jg.addColorStop(1, '#0a0b0e');
  c.fillStyle = jg;
  c.beginPath();
  c.moveTo(-58, -40); c.bezierCurveTo(-120, -36, -175, -20, -196, 30);
  c.lineTo(-230, 330); c.lineTo(230, 330); c.lineTo(196, 30);
  c.bezierCurveTo(175, -20, 120, -36, 58, -40); c.closePath(); c.fill();
  // t-shirt + lapels
  c.fillStyle = '#0d0e12'; c.beginPath(); c.moveTo(-52, -38); c.lineTo(0, 120); c.lineTo(52, -38); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(255,255,255,.07)'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(-60, -36); c.lineTo(-18, 150); c.lineTo(-40, 330); c.moveTo(60, -36); c.lineTo(18, 150); c.lineTo(40, 330); c.stroke();
  // rim light on right edge of jacket
  c.save(); c.globalCompositeOperation = 'lighter';
  const rg = c.createLinearGradient(150, 0, 236, 0); rg.addColorStop(0, rgba(rim, 0)); rg.addColorStop(1, rgba(rim, .55 * light));
  c.strokeStyle = rg; c.lineWidth = 7;
  c.beginPath(); c.moveTo(70, -38); c.bezierCurveTo(125, -34, 176, -18, 196, 30); c.lineTo(230, 330); c.stroke();
  c.strokeStyle = rgba(rim, .22 * light); c.lineWidth = 4;
  c.beginPath(); c.moveTo(-70, -38); c.bezierCurveTo(-125, -34, -176, -18, -196, 30); c.stroke();
  c.restore();
  c.restore();

  // --- raised arm (drawing in the air) ---
  if (armUp > 0 && hand) {
    const sh = { x: 170, y: 10 };
    const hx = lerp(200, hand.x, armUp), hy = lerp(320, hand.y, armUp);
    const ex = (sh.x + hx) / 2 + 60, ey = (sh.y + hy) / 2 + 70;
    c.strokeStyle = '#111318'; c.lineCap = 'round'; c.lineWidth = 64;
    c.beginPath(); c.moveTo(sh.x, sh.y); c.quadraticCurveTo(ex, ey, hx, hy); c.stroke();
    c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba(rim, .35); c.lineWidth = 6;
    c.beginPath(); c.moveTo(sh.x + 26, sh.y + 6); c.quadraticCurveTo(ex + 30, ey, hx + 18, hy); c.stroke(); c.restore();
    c.fillStyle = '#a8714d'; c.beginPath(); c.ellipse(hx, hy - 8, 24, 30, -.4, 0, 7); c.fill();
    c.fillStyle = '#a8714d'; c.beginPath(); c.ellipse(hx - 6, hy - 44, 8, 20, -.2, 0, 7); c.fill();
    glowDot(c, hx - 8, hy - 62, 46, P.cyan, .9);
  }

  // --- neck ---
  c.fillStyle = '#8f5f40'; c.beginPath(); c.moveTo(-36, -90); c.lineTo(-40, -30); c.quadraticCurveTo(0, -12, 40, -30); c.lineTo(36, -90); c.closePath(); c.fill();
  c.fillStyle = 'rgba(0,0,0,.28)'; c.beginPath(); c.moveTo(-36, -84); c.quadraticCurveTo(0, -56, 36, -84); c.lineTo(36, -70); c.quadraticCurveTo(0, -40, -36, -70); c.fill();

  // --- head ---
  c.save(); c.translate(turn * .4, -190 + breathe * .2);
  // ears
  c.fillStyle = '#9c6845';
  c.beginPath(); c.ellipse(-72 + turn * .3, 6, 13, 22, 0, 0, 7); c.fill();
  c.beginPath(); c.ellipse(72 + turn * .3, 6, 13, 22, 0, 0, 7); c.fill();
  // face shape
  const fg = c.createLinearGradient(-80, -80, 90, 80);
  fg.addColorStop(0, '#7c4f33'); fg.addColorStop(.5, '#b07a55'); fg.addColorStop(1, '#c48a61');
  c.fillStyle = back ? '#0e0f13' : fg;
  c.beginPath(); c.moveTo(-70, -30); c.bezierCurveTo(-74, 40, -52, 92, 0, 104); c.bezierCurveTo(52, 92, 74, 40, 70, -30);
  c.bezierCurveTo(70, -92, 40, -112, 0, -112); c.bezierCurveTo(-40, -112, -70, -92, -70, -30); c.closePath(); c.fill();
  if (!back) {
    // beard (trimmed, follows jaw) + moustache
    c.fillStyle = 'rgba(22,16,12,.92)';
    c.beginPath(); c.moveTo(-70, 0); c.bezierCurveTo(-70, 52, -48, 104, 0, 110); c.bezierCurveTo(48, 104, 70, 52, 70, 0);
    c.bezierCurveTo(62, 30, 52, 54, 36, 62); c.quadraticCurveTo(0, 74, -36, 62); c.bezierCurveTo(-52, 54, -62, 30, -70, 0); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(-28 + turn, 44); c.quadraticCurveTo(0 + turn, 32, 28 + turn, 44); c.quadraticCurveTo(0 + turn, 50, -28 + turn, 44); c.fill();
    // mouth
    const smile = mood >= 2 ? (mood === 3 ? 0 : 1) : (mood === 0 ? -.6 : .15);
    c.strokeStyle = '#3a2016'; c.lineWidth = 4; c.lineCap = 'round';
    if (mood === 3) { c.fillStyle = '#2a140e'; c.beginPath(); c.ellipse(turn, 62, 11, 14, 0, 0, 7); c.fill(); }
    else { c.beginPath(); c.moveTo(-20 + turn, 60); c.quadraticCurveTo(turn, 60 + smile * 12, 20 + turn, 60); c.stroke(); }
    // nose
    c.strokeStyle = 'rgba(90,50,30,.7)'; c.lineWidth = 3.5;
    c.beginPath(); c.moveTo(4 + turn * 1.2, -6); c.quadraticCurveTo(12 + turn * 1.3, 24, 2 + turn * 1.2, 28); c.stroke();
    // eyes
    const lid = mood === 0 ? .45 : mood === 3 ? 1.15 : .85;
    for (const sx of [-1, 1]) {
      const ex = sx * 28 + turn, ey = -14;
      c.fillStyle = '#f1e8df'; c.beginPath(); c.ellipse(ex, ey, 14, 8 * lid, 0, 0, 7); c.fill();
      c.fillStyle = '#2b1a10'; c.beginPath(); c.arc(ex + look * 5, ey + (mood === 0 ? 2 : 0), 6.5 * Math.min(1, lid + .2), 0, 7); c.fill();
      c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(ex + look * 5 + 2, ey - 2, 1.8, 0, 7); c.fill();
      // eyebrows
      const tilt = mood === 0 ? .22 : mood === 3 ? -.18 : 0;
      c.fillStyle = '#16100c';
      c.save(); c.translate(ex, ey - (mood === 3 ? 26 : 20)); c.rotate(sx * tilt);
      c.beginPath(); c.roundRect(-18, -4, 36, 8, 4); c.fill(); c.restore();
      if (mood === 0) { c.strokeStyle = 'rgba(60,30,20,.45)'; c.lineWidth = 2; c.beginPath(); c.arc(ex, ey + 12, 10, .2, Math.PI - .2); c.stroke(); }
    }
  }
  // hair: short, dark, fade at sides
  c.fillStyle = '#0c0a09';
  c.beginPath();
  if (back) { c.moveTo(-72, 10); c.bezierCurveTo(-78, -90, -40, -126, 0, -126); c.bezierCurveTo(40, -126, 78, -90, 72, 10); c.bezierCurveTo(60, 60, -60, 60, -72, 10); }
  else { c.moveTo(-72, -22); c.bezierCurveTo(-80, -96, -36, -128, 4, -126); c.bezierCurveTo(48, -126, 80, -96, 72, -24);
    c.bezierCurveTo(64, -58, 50, -78, 18, -84); c.bezierCurveTo(-10, -70, -44, -78, -60, -60); c.bezierCurveTo(-66, -48, -68, -36, -72, -22); }
  c.closePath(); c.fill();
  // rim light on head
  c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = rgba(rim, .6 * light); c.lineWidth = 5;
  c.beginPath(); c.moveTo(56, -100); c.bezierCurveTo(78, -80, 76, 20, 60, 70); c.stroke(); c.restore();
  c.restore();
  c.restore();
}

// CLAUDE — abstract luminous humanoid, white/sky light, warm core. Never metallic.
// Origin = chest centre. form 0..1 = how assembled (particles converge into body).
const CL_PTS = (() => { const r = mulberry(42); return Array.from({ length: 260 }, () => ({ a: r() * 6.283, d: r(), z: r(), sp: .3 + r() * .9, ph: r() * 6.28 })); })();
export function claude(c, x, y, s = 1, o = {}) {
  const { t = 0, form = 1, alpha = 1, intensity = 1, look = 0, role = null, spin = 0 } = o;
  if (alpha <= 0) return;
  c.save(); c.globalAlpha *= alpha; c.translate(x, y + Math.sin(t * 1.1) * 8 * s); c.scale(s, s);
  const k = intensity * form;
  // halo
  glowDot(c, 0, -120, 360, P.sky, .22 * k);
  glowDot(c, 0, 40, 420, P.blue, .16 * k);
  c.save(); c.globalCompositeOperation = 'lighter';
  // halo ring behind head
  c.strokeStyle = rgba(P.cyan, .35 * k); c.lineWidth = 2.5;
  c.beginPath(); c.ellipse(0, -205, 112, 30, Math.sin(t * .5) * .1, 0, 7); c.stroke();
  c.strokeStyle = rgba(P.white, .18 * k); c.beginPath(); c.ellipse(0, -205, 140, 40, -Math.sin(t * .4) * .1, 0, 7); c.stroke();
  // body silhouette (light volume)
  const body = new Path2D();
  body.moveTo(-50, -60); body.bezierCurveTo(-110, -58, -170, -40, -190, 20); body.lineTo(-210, 300);
  body.lineTo(210, 300); body.lineTo(190, 20); body.bezierCurveTo(170, -40, 110, -58, 50, -60); body.closePath();
  const bg = c.createLinearGradient(0, -70, 0, 300); bg.addColorStop(0, rgba(P.white, .55 * k)); bg.addColorStop(.35, rgba(P.sky, .32 * k)); bg.addColorStop(1, rgba(P.blue, 0));
  c.fillStyle = bg; c.fill(body);
  c.strokeStyle = rgba(P.white, .28 * k); c.lineWidth = 2; c.stroke(body);
  // neural lines inside body
  const r = mulberry(5);
  c.lineWidth = 1.4;
  for (let i = 0; i < 14; i++) {
    const x0 = (r() - .5) * 300, y0 = r() * 260; const ph = t * .8 + i;
    c.strokeStyle = rgba(i % 3 ? P.cyan : P.white, .28 * k * (.5 + .5 * Math.sin(ph)));
    c.beginPath(); c.moveTo(x0, y0); c.bezierCurveTo(x0 + 60 * Math.sin(ph), y0 - 80, -x0 * .3, -20, 0, -40); c.stroke();
  }
  // neck + head
  const hg = c.createRadialGradient(-14, -228, 6, 0, -205, 78);
  hg.addColorStop(0, rgba(P.white, .95 * k)); hg.addColorStop(.6, rgba(P.sky, .55 * k)); hg.addColorStop(1, rgba(P.cyan, .05 * k));
  { const ng = c.createLinearGradient(0, -150, 0, -50); ng.addColorStop(0, rgba(P.sky, .4 * k)); ng.addColorStop(1, rgba(P.sky, .08 * k)); c.fillStyle = ng; c.beginPath(); c.moveTo(-24, -150); c.quadraticCurveTo(-22, -90, -46, -58); c.lineTo(46, -58); c.quadraticCurveTo(22, -90, 24, -150); c.fill(); }
  c.fillStyle = hg; c.beginPath(); c.ellipse(look * 6, -205, 64, 78, 0, 0, 7); c.fill();
  // friendly eyes: two soft light arcs
  c.strokeStyle = rgba('#0b2a4a', .75 * k); c.lineWidth = 5; c.lineCap = 'round';
  for (const sx of [-1, 1]) { c.beginPath(); c.arc(sx * 24 + look * 12, -206, 10, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
  // core (warm orange highlight)
  glowDot(c, 0, 30, 70 * (1 + .1 * Math.sin(t * 2.4)), P.orange, .75 * k);
  glowDot(c, 0, 30, 22, P.white, .95 * k);
  c.restore();
  // orbiting / converging particles
  c.save(); c.globalCompositeOperation = 'lighter';
  for (const p of CL_PTS) {
    const rr = lerp(900 * (.4 + p.d), 160 + p.d * 120, form);
    const a = p.a + t * p.sp * .5 + spin;
    const px = Math.cos(a) * rr, py = -60 + Math.sin(a) * rr * .38 + (p.z - .5) * 120 * form;
    c.globalAlpha = (.25 + .6 * p.z) * (form < 1 ? .9 : .5) * alpha;
    c.fillStyle = p.z > .7 ? P.white : P.cyan; c.beginPath(); c.arc(px, py, 1.2 + p.z * 2.4, 0, 7); c.fill();
  }
  c.restore();
  // role badge (specialist mode)
  if (role) {
    c.save(); c.globalAlpha *= role.a;
    c.font = '600 30px "Tajawal",sans-serif'; c.direction = 'rtl'; c.textAlign = 'center';
    const w = c.measureText(role.text).width + 50;
    c.fillStyle = 'rgba(10,14,22,.85)'; c.beginPath(); c.roundRect(-w / 2, 150, w, 56, 28); c.fill();
    c.strokeStyle = role.color || P.cyan; c.lineWidth = 2; c.stroke();
    c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText(role.text, 0, 179);
    c.restore();
  }
  c.restore();
}
