import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Bottle, BOTTLE, clamp, SANS, SERIF } from "./base";

/** Cinematic product shots built around the real bottle photo. Each fills an 860×960 frame. */
const W = 860;
const H = 960;

// ------------------------------------------------------------ night city billboard
export const ShotBillboard: React.FC = () => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, 260], [1.06, 1.16]);
  const flicker = 0.92 + 0.08 * Math.sin(f / 3.3) * (random(`fl${Math.floor(f / 5)}`) > 0.85 ? 1 : 0.15);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #070a14 0%, #121a33 45%, #1d2135 62%, #0b0d14 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(push), transformOrigin: "62% 40%" }}>
        {/* skyline */}
        {Array.from({ length: 14 }).map((_, i) => {
          const x = i * 66 - 20 + random(`bx${i}`) * 20;
          const h = 180 + random(`bh${i}`) * 300;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: 600 - h, width: 60 + random(`bw${i}`) * 30, height: h, background: `rgba(${14 + i},${18 + i},${34 + i},0.95)`, filter: "blur(1.5px)" }}>
              {Array.from({ length: 18 }).map((__, k) =>
                random(`w${i}-${k}`) > 0.55 ? <div key={k} style={{ position: "absolute", left: 8 + (k % 3) * 18, top: 12 + Math.floor(k / 3) * 26, width: 8, height: 10, background: random(`c${i}-${k}`) > 0.5 ? "#ffd38a" : "#9fd0ff", opacity: 0.55 }} /> : null,
              )}
            </div>
          );
        })}
        {/* haze over the city */}
        <div style={{ position: "absolute", left: -100, right: -100, top: 380, height: 300, background: "radial-gradient(60% 50% at 50% 60%, rgba(255,150,90,0.18), transparent 70%)", filter: "blur(20px)" }} />
        {/* wet road */}
        <div style={{ position: "absolute", left: -200, right: -200, top: 600, bottom: 0, background: "linear-gradient(180deg, #14161f 0%, #07080c 100%)" }} />
        {[["#ff5a3c", 120], ["#ffd38a", 300], ["#7fc4ff", 560], ["#ff8a5c", 720]].map(([c, x], i) => (
          <div key={i} style={{ position: "absolute", left: Number(x), top: 610, width: 26, height: 360, background: `linear-gradient(180deg, ${c}, transparent)`, opacity: 0.35, filter: "blur(10px)" }} />
        ))}
        {/* billboard */}
        <div style={{ position: "absolute", left: 300, top: 150, width: 500, height: 380 }}>
          <div style={{ position: "absolute", left: 120, top: 370, width: 18, height: 360, background: "linear-gradient(90deg,#1b1d24,#3a3d47,#1b1d24)" }} />
          <div style={{ position: "absolute", left: 360, top: 370, width: 18, height: 360, background: "linear-gradient(90deg,#1b1d24,#3a3d47,#1b1d24)" }} />
          <div style={{ position: "absolute", inset: -14, borderRadius: 6, background: "#1a1c22", boxShadow: `0 0 ${120 * flicker}px rgba(255,236,214,${0.35 * flicker})` }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 3, overflow: "hidden", background: "linear-gradient(135deg, #f4ede5 0%, #e7d6c6 100%)", filter: `brightness(${flicker})` }}>
            <div style={{ position: "absolute", right: 20, top: 40, width: 300, textAlign: "center" }} dir="rtl">
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 96, color: "#3b2a20", lineHeight: 1 }}>لُجين</div>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, color: "#6b5244", marginTop: 14 }}>عطر يبقى في الذاكرة</div>
              <div style={{ width: 60, height: 2, background: "#b08a6e", margin: "22px auto 0" }} />
            </div>
            <Bottle h={300} style={{ left: 40, top: 50 }} shadow={0.35} />
          </div>
        </div>
        {/* glow spill on the road */}
        <div style={{ position: "absolute", left: 300, top: 700, width: 520, height: 160, borderRadius: "50%", background: "rgba(255,230,205,0.16)", filter: "blur(30px)" }} />
        {/* bokeh */}
        {Array.from({ length: 16 }).map((_, i) => {
          const s = 30 + random(`k${i}`) * 70;
          return <div key={i} style={{ position: "absolute", left: random(`kx${i}`) * W - s / 2, top: 760 + random(`ky${i}`) * 220 + Math.sin(f / 30 + i) * 6, width: s, height: s, borderRadius: "50%", background: ["#ff7a4a", "#ffd38a", "#7fc4ff"][i % 3], opacity: 0.22, filter: "blur(6px)" }} />;
        })}
      </AbsoluteFill>
      {/* light rain */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (random(`r${i}`) * W + f * 4) % W;
        const y = (random(`ry${i}`) * H + f * 38) % H;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 1.5, height: 40, background: "rgba(220,230,255,0.25)", rotate: "12deg" }} />;
      })}
      <AbsoluteFill style={{ background: "radial-gradient(90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ social media ad
export const ShotSocial: React.FC = () => {
  const f = useCurrentFrame();
  const float = Math.sin(f / 22) * 8;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #f8ece6 0%, #eed5c9 55%, #e3bfae 100%)", overflow: "hidden" }}>
      {/* silk */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: -300 + i * 120, top: 520 + i * 90 + Math.sin(f / 40 + i) * 14, width: 1500, height: 380, borderRadius: "50%", background: `linear-gradient(180deg, rgba(255,255,255,${0.55 - i * 0.12}), rgba(214,160,140,${0.18 + i * 0.08}))`, rotate: `${-12 + i * 6}deg`, filter: "blur(8px)" }} />
      ))}
      {/* petals */}
      {Array.from({ length: 10 }).map((_, i) => {
        const y = ((random(`py${i}`) * H + f * (1.2 + random(`pv${i}`))) % (H + 80)) - 40;
        return <div key={i} style={{ position: "absolute", left: 40 + random(`px${i}`) * 780 + Math.sin(f / 18 + i) * 20, top: y, width: 26, height: 16, borderRadius: "60% 40% 60% 40%", background: "#e9a99a", opacity: 0.75, rotate: `${f * 2 + i * 40}deg`, filter: i % 3 ? "blur(1px)" : "none" }} />;
      })}
      {/* headline */}
      <div dir="rtl" style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 110, color: "#3b2a20", lineHeight: 1.05 }}>لُجين</div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: "#6b4a3c", marginTop: 6 }}>فخامة تدوم معك</div>
      </div>
      {/* podium + bottle */}
      <div style={{ position: "absolute", left: W / 2 - 200, top: 760, width: 400, height: 70, borderRadius: "50%", background: "linear-gradient(180deg,#fff6f1,#e8cbbd)", boxShadow: "0 30px 60px rgba(120,70,50,0.25)" }} />
      <Bottle h={440} style={{ left: W / 2 - (440 * BOTTLE.w) / BOTTLE.h / 2, top: 345 + float }} shadow={0.25} shadowColor="120,70,50" />
      {/* features */}
      <div dir="rtl" style={{ position: "absolute", left: 40, right: 40, bottom: 40, display: "flex", justifyContent: "space-between" }}>
        {["ثبات طويل", "رائحة ناعمة", "٥٠ مل"].map((t) => (
          <div key={t} style={{ padding: "12px 26px 16px", borderRadius: 999, background: "rgba(255,255,255,0.75)", fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "#4a3328" }}>{t}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ studio shot
export const ShotStudio: React.FC = () => {
  const f = useCurrentFrame();
  const sweep = interpolate(f % 120, [0, 120], [-60, 160]);
  const bh = 470;
  const bw = (bh * BOTTLE.w) / BOTTLE.h;
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      {/* spotlight cone */}
      <div style={{ position: "absolute", left: W / 2 - 360, top: -60, width: 720, height: 1000, background: "linear-gradient(180deg, rgba(255,244,228,0.30), rgba(255,244,228,0.03) 80%)", clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)", filter: "blur(14px)" }} />
      {/* haze */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", left: -200 + i * 260 + Math.sin(f / 50 + i) * 40, top: 300 + i * 70, width: 600, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.05)", filter: "blur(40px)" }} />
      ))}
      {/* marble pedestal */}
      <div style={{ position: "absolute", left: W / 2 - 230, top: 690, width: 460, height: 400, background: "linear-gradient(90deg, #121212 0%, #2b2b2b 45%, #1a1a1a 60%, #080808 100%)" }}>
        <svg width="460" height="400" style={{ position: "absolute", inset: 0, opacity: 0.25 }}>
          <path d="M40 0 C 90 80, 60 160, 140 260 S 180 360, 160 400" stroke="#fff" strokeWidth="1.2" fill="none" />
          <path d="M300 0 C 280 90, 360 150, 330 260" stroke="#fff" strokeWidth="0.8" fill="none" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: W / 2 - 230, top: 650, width: 460, height: 84, borderRadius: "50%", background: "radial-gradient(60% 70% at 50% 40%, #4a4a4a, #161616)", border: "1px solid rgba(255,255,255,0.08)" }} />
      <Bottle h={bh} style={{ left: W / 2 - bw / 2, top: 240 }} reflect={0.28} shadow={0.7} filter="drop-shadow(0 0 30px rgba(255,240,220,0.15)) contrast(1.05)" />
      {/* light sweep across the glass */}
      <div style={{ position: "absolute", left: W / 2 - bw / 2, top: 240 + bh * 0.24, width: bw, height: bh * 0.74, overflow: "hidden", mixBlendMode: "screen" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep}%`, width: "26%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)", rotate: "12deg" }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 50% 45%, transparent 50%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 360° views
const Turn: React.FC<{ deg: number; h: number }> = ({ deg, h }) => {
  const a = (deg * Math.PI) / 180;
  const sc = h / BOTTLE.h;
  const bodyW = (BOTTLE.bodyX1 - BOTTLE.bodyX0) * sc;
  const bodyH = (BOTTLE.h - BOTTLE.capBottom) * sc;
  const capW = (BOTTLE.capX1 - BOTTLE.capX0) * sc;
  const capH = BOTTLE.capBottom * sc;
  const face = Math.abs(Math.cos(a)) * bodyW;
  const depth = Math.abs(Math.sin(a)) * bodyW * 0.32;
  const total = face + depth;
  const sideFirst = Math.sin(a) < 0;
  const back = Math.cos(a) < 0;
  const faceEl = (
    <div key="f" style={{ width: face, height: bodyH, overflow: "hidden", position: "relative" }}>
      <Img src={staticFile("photos/bottle-cut.png")} style={{ position: "absolute", top: -BOTTLE.capBottom * sc, left: (-BOTTLE.bodyX0 * sc) * (face / bodyW), height: h, width: BOTTLE.w * sc * (face / bodyW || 0.001), transform: back ? "scaleX(-1)" : undefined, filter: back ? "brightness(0.95)" : undefined }} />
    </div>
  );
  const sideEl = <div key="s" style={{ width: depth, height: bodyH * 0.985, borderRadius: 6, background: `linear-gradient(90deg, #d9d9d9, #f1f1f1 50%, #cfcfcf)`, opacity: 0.95 }} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: capW, height: capH, overflow: "hidden", position: "relative" }}>
        <Img src={staticFile("photos/bottle-cut.png")} style={{ position: "absolute", top: 0, left: -BOTTLE.capX0 * sc, height: h, width: BOTTLE.w * sc }} />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", width: total }}>{sideFirst ? [sideEl, faceEl] : [faceEl, sideEl]}</div>
      <div style={{ width: total * 1.1, height: 14, marginTop: -6, borderRadius: "50%", background: "rgba(0,0,0,0.12)", filter: "blur(5px)" }} />
    </div>
  );
};

export const ShotAngles: React.FC = () => {
  const f = useCurrentFrame();
  const spin = f * 0.6;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffffff 0%, #f1f1f1 100%)" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 40, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", rowGap: 34 }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((d, i) => {
          const p = interpolate(f, [i * 3, i * 3 + 14], [0, 1], clamp);
          return (
            <div key={d} style={{ height: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 12, opacity: p, translate: `0px ${(1 - p) * 30}px` }}>
              <Turn deg={d + spin} h={300} />
              <div dir="ltr" style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, color: "#6b6b6b" }}>{d}°</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center" }}>
        <svg width="160" height="60" viewBox="0 0 160 60">
          <ellipse cx="80" cy="30" rx="70" ry="18" stroke="#9a9a9a" strokeWidth="3" fill="none" strokeDasharray="300 40" strokeDashoffset={-f * 3} />
          <text x="80" y="38" textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="24" fill="#5d5d5d">360°</text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ lifestyle: golden-hour vanity
export const ShotLife: React.FC = () => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 220], [0, -30]);
  const bh = 430;
  const bw = (bh * BOTTLE.w) / BOTTLE.h;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #d9b48a 0%, #c99a6b 55%, #a87650 100%)", overflow: "hidden" }}>
      {/* window light on the wall */}
      <div style={{ position: "absolute", left: 180 + drift, top: 60, width: 640, height: 560, rotate: "-14deg", filter: "blur(16px)", opacity: 0.75 }}>
        {[0, 1].map((r) =>
          [0, 1].map((c) => <div key={`${r}${c}`} style={{ position: "absolute", left: c * 330, top: r * 290, width: 300, height: 260, background: "rgba(255,226,170,0.55)" }} />),
        )}
      </div>
      {/* sheer curtain */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: -40 + i * 26 + Math.sin(f / 30 + i) * 8, top: -20, width: 30, height: 720, background: "linear-gradient(180deg, rgba(255,245,230,0.55), rgba(255,245,230,0.15))", filter: "blur(6px)" }} />
      ))}
      {/* blurred vase with dried branches (background, depth of field) */}
      <div style={{ position: "absolute", left: 110, top: 300, filter: "blur(5px)", opacity: 0.85 }}>
        <svg width="220" height="380" viewBox="0 0 220 380">
          {[[-30, 0], [10, -10], [40, 5], [-10, 15]].map(([dx, dy], i) => (
            <path key={i} d={`M110 260 C ${110 + dx} 180, ${110 + dx * 2} ${100 + dy}, ${110 + dx * 2.6} 20`} stroke="#7a5a3a" strokeWidth="3" fill="none" />
          ))}
          <path d="M80 250 h60 l10 120 h-80 z" fill="#efe4d6" />
        </svg>
      </div>
      {/* table */}
      <div style={{ position: "absolute", left: -20, right: -20, top: 640, bottom: 0, background: "linear-gradient(180deg, #e9d9c6 0%, #cdb79f 30%, #a88a6c 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 636, height: 8, background: "rgba(255,240,220,0.7)", filter: "blur(2px)" }} />
      {/* long shadow of the bottle */}
      <div style={{ position: "absolute", left: 470, top: 860, width: 340, height: 70, background: "rgba(80,50,25,0.35)", filter: "blur(12px)", transformOrigin: "left center", rotate: "-6deg", borderRadius: "40%" }} />
      <Bottle h={bh} style={{ left: 470 - bw / 2 + 60, top: 470 }} shadow={0.45} shadowColor="80,50,25" filter="sepia(0.18) saturate(1.1) brightness(1.03)" />
      {/* warm rim light */}
      <div style={{ position: "absolute", left: 470 - bw / 2 + 60, top: 560, width: bw, height: 330, background: "linear-gradient(100deg, rgba(255,200,130,0.0) 60%, rgba(255,200,130,0.35))", mixBlendMode: "screen", borderRadius: 10 }} />
      {/* dust in the light */}
      {Array.from({ length: 26 }).map((_, i) => {
        const x = random(`dx${i}`) * W;
        const y = (random(`dy${i}`) * 600 - f * (0.3 + random(`dv${i}`) * 0.4) + 600) % 600;
        return <div key={i} style={{ position: "absolute", left: x + Math.sin(f / 20 + i) * 10, top: 60 + y, width: 4, height: 4, borderRadius: 2, background: "rgba(255,240,210,0.8)", filter: "blur(0.5px)" }} />;
      })}
      {/* flare */}
      <div style={{ position: "absolute", right: -120, top: -120, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,180,0.6), transparent 65%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(90% 80% at 50% 50%, transparent 60%, rgba(60,35,15,0.35) 100%)" }} />
    </AbsoluteFill>
  );
};
