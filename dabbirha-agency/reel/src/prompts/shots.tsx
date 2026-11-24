import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { BRAND_SERIF, clamp, Product, SANS, TUBE, TubeLabel } from "./base";

/** Cinematic product shots built around the real product photo. Each fills an 860×960 frame. */
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
          <div style={{ position: "absolute", inset: 0, borderRadius: 3, overflow: "hidden", background: "linear-gradient(135deg, #f3f5ef 0%, #d9e4d6 100%)", filter: `brightness(${flicker})` }}>
            <div style={{ position: "absolute", right: 14, top: 80, width: 300, textAlign: "center" }}>
              <div style={{ fontFamily: BRAND_SERIF, fontWeight: 600, fontSize: 68, letterSpacing: 5, color: "#26332b", lineHeight: 1 }}>NAQĀ</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 18, letterSpacing: 6, color: "#6f8f72", marginTop: 10 }}>HYDRA GLOW</div>
              <div dir="rtl" style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "#3c4a41", marginTop: 26 }}>بشرتك تستاهل النقاء</div>
              <div style={{ width: 60, height: 2, background: "#9fb3a2", margin: "20px auto 0" }} />
            </div>
            <Product h={330} style={{ left: 60, top: 26 }} shadow={0.25} />
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
export const ShotSocial: React.FC<{ headline?: string }> = ({ headline = "ترطيب يدوم طول اليوم" }) => {
  const f = useCurrentFrame();
  const float = Math.sin(f / 22) * 8;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(165deg, #f4f6f0 0%, #e2eadc 55%, #c9d8c4 100%)", overflow: "hidden" }}>
      {/* soft fabric waves */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: -300 + i * 120, top: 560 + i * 90 + Math.sin(f / 40 + i) * 14, width: 1500, height: 380, borderRadius: "50%", background: `linear-gradient(180deg, rgba(255,255,255,${0.6 - i * 0.12}), rgba(130,165,130,${0.14 + i * 0.07}))`, rotate: `${-12 + i * 6}deg`, filter: "blur(8px)" }} />
      ))}
      {/* falling leaves */}
      {Array.from({ length: 9 }).map((_, i) => {
        const y = ((random(`py${i}`) * H + f * (1.2 + random(`pv${i}`))) % (H + 80)) - 40;
        return (
          <svg key={i} width="40" height="40" viewBox="0 0 24 24" style={{ position: "absolute", left: 40 + random(`px${i}`) * 780 + Math.sin(f / 18 + i) * 20, top: y, rotate: `${f * 2 + i * 40}deg`, opacity: 0.8, filter: i % 3 ? "blur(1px)" : "none" }}>
            <path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z" fill="#7fa37f" />
          </svg>
        );
      })}
      <div style={{ position: "absolute", top: 50, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: BRAND_SERIF, fontWeight: 600, fontSize: 96, letterSpacing: 10, color: "#26332b", lineHeight: 1 }}>NAQĀ</div>
        <div dir="rtl" style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, color: "#34463a", marginTop: 14 }}>{headline}</div>
      </div>
      <div style={{ position: "absolute", left: W / 2 - 170, top: 815, width: 340, height: 60, borderRadius: "50%", background: "linear-gradient(180deg,#ffffff,#cfdcca)", boxShadow: "0 30px 60px rgba(60,90,60,0.22)" }} />
      <Product h={540} style={{ left: W / 2 - (540 * TUBE.w) / TUBE.h / 2, top: 290 + float }} shadow={0.22} shadowColor="50,80,50" />
      <div dir="rtl" style={{ position: "absolute", left: 30, right: 30, bottom: 36, display: "flex", justifyContent: "space-between" }}>
        {["ترطيب ٢٤ ساعة", "حماية SPF 30", "خفيف على البشرة"].map((t) => (
          <div key={t} style={{ padding: "12px 22px 16px", borderRadius: 999, background: "rgba(255,255,255,0.8)", fontFamily: SANS, fontWeight: 600, fontSize: 27, color: "#34463a" }}>{t}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ studio shot
export const ShotStudio: React.FC = () => {
  const f = useCurrentFrame();
  const sweep = interpolate(f % 120, [0, 120], [-60, 160]);
  const bh = 540;
  const bw = (bh * TUBE.w) / TUBE.h;
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
      <Product h={bh} style={{ left: W / 2 - bw / 2, top: 150 }} reflect={0.22} shadow={0.7} filter="drop-shadow(0 0 30px rgba(255,240,220,0.15)) brightness(0.92) contrast(1.06)" />
      {/* light sweep across the glass */}
      <div style={{ position: "absolute", left: W / 2 - bw / 2 + bw * 0.08, top: 150 + bh * 0.05, width: bw * 0.84, height: bh * 0.8, overflow: "hidden", mixBlendMode: "screen", borderRadius: 20 }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep}%`, width: "26%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)", rotate: "12deg" }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 50% 45%, transparent 50%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ 360° views
const Turn: React.FC<{ deg: number; h: number }> = ({ deg, h }) => {
  const a = (deg * Math.PI) / 180;
  const sc = h / TUBE.h;
  const fullW = TUBE.w * sc;
  const bodyH = TUBE.capTop * sc;
  const capH = (TUBE.h - TUBE.capTop) * sc;
  const capW = (TUBE.capX1 - TUBE.capX0) * sc;
  const cos = Math.cos(a);
  const face = Math.max(0.02, Math.abs(cos)) * fullW;
  const depth = Math.abs(Math.sin(a)) * fullW * 0.26;
  const back = cos < 0;
  const faceEl = (
    <div key="f" style={{ width: face, height: bodyH, overflow: "hidden", position: "relative", transform: back ? "scaleX(-1)" : undefined }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: TUBE.w, height: TUBE.h, transform: `scale(${face / TUBE.w}, ${sc})`, transformOrigin: "0 0", isolation: "isolate" }}>
        <Img src={staticFile("photos/tube-cut.png")} style={{ position: "absolute", inset: 0, width: TUBE.w, height: TUBE.h }} />
        <div style={{ position: "absolute", inset: 0, transform: back ? "scaleX(-1)" : undefined }}>
          <TubeLabel back={back} />
        </div>
      </div>
    </div>
  );
  const sideEl = <div key="s" style={{ width: depth, height: bodyH, borderRadius: `${depth / 2}px ${depth / 2}px 4px 4px`, background: "linear-gradient(90deg, #dcdcdc, #fbfbfb 45%, #d4d4d4)", clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>{Math.sin(a) < 0 ? [sideEl, faceEl] : [faceEl, sideEl]}</div>
      <div style={{ width: capW, height: capH, overflow: "hidden", position: "relative", marginTop: -1 }}>
        <Img src={staticFile("photos/tube-cut.png")} style={{ position: "absolute", top: -TUBE.capTop * sc, left: -TUBE.capX0 * sc, width: TUBE.w * sc, height: TUBE.h * sc }} />
      </div>
      <div style={{ width: capW * 1.3, height: 14, marginTop: -6, borderRadius: "50%", background: "rgba(0,0,0,0.12)", filter: "blur(5px)" }} />
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
  const bh = 500;
  const bw = (bh * TUBE.w) / TUBE.h;
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
      {/* long shadow of the tube */}
      <div style={{ position: "absolute", left: 540, top: 865, width: 340, height: 60, background: "rgba(80,50,25,0.35)", filter: "blur(12px)", transformOrigin: "left center", rotate: "-6deg", borderRadius: "40%" }} />
      <Product h={bh} style={{ left: 530 - bw / 2, top: 410 }} shadow={0.45} shadowColor="80,50,25" filter="sepia(0.22) saturate(1.1) brightness(1.02)" />
      {/* warm rim light */}
      <div style={{ position: "absolute", left: 530 - bw / 2, top: 420, width: bw, height: 460, background: "linear-gradient(100deg, rgba(255,200,130,0.0) 60%, rgba(255,200,130,0.35))", mixBlendMode: "screen", borderRadius: 10 }} />
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
