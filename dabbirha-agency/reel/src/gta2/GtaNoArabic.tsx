import { loadFont as loadLalezar } from "@remotion/google-fonts/Lalezar";
import { loadFont as loadCairo } from "@remotion/google-fonts/Cairo";
import { loadFont as loadAudiowide } from "@remotion/google-fonts/Audiowide";
import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/gta2-timeline.json";
import { createSound } from "../components/Sound";
import { cue, findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { db } from "../theme";

/**
 * «GTA 6 ما فيها عربي… وهذا الحل» — same neon world and system as GtaGuide (dabberha-reel/src/gta), three levels.
 * Neon night-city look (sunset gradient, palms, moving grid). The "game" on the TV is a drawn illustration,
 * not a screenshot, and no publisher logo or artwork is used.
 */
const DISPLAY = loadLalezar("normal", { weights: ["400"], subsets: ["arabic"] }).fontFamily;
const SANS = loadCairo("normal", { weights: ["600", "700", "800"], subsets: ["arabic", "latin"] }).fontFamily;
const LAT = loadAudiowide("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

const C = { night: "#12002a", pink: "#ff2e88", orange: "#ff8a3d", yellow: "#ffd23f", cyan: "#2de2e6", purple: "#7a2bff", ink: "#ffffff" };

type GId = "N1-Hook" | "N2-Subs" | "N3-Clear" | "N4-Tool" | "N5-Win" | "N6-Note" | "N7-CTA";
export const nTimeline = data as TimelineData;
const getG = (id: GId) => findScene(nTimeline, id);
const { Sfx, SceneVoice } = createSound(nTimeline, "audio/gta2", {
  whoosh: db(-14),
  level: db(-10),
  pass: db(-8),
  click: db(-10),
  check: db(-11),
  glitch: db(-13),
  type: db(-14),
  impact: db(-9),
  riser: db(-13),
});
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
const usePop = (at: number, stiffness = 200, damping = 13, mass = 0.7) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping, stiffness, mass } });
};
const neon = (c: string, k = 1) => `0 0 ${6 * k}px ${c}, 0 0 ${18 * k}px ${c}, 0 0 ${40 * k}px ${c}`;

// ------------------------------------------------------------ world
const Palm: React.FC<{ x: number; y: number; s: number; flip?: boolean }> = ({ x, y, s, flip }) => (
  <svg width={260 * s} height={520 * s} viewBox="0 0 260 520" style={{ position: "absolute", left: x, top: y, transform: flip ? "scaleX(-1)" : undefined }}>
    <path d="M128 520 C 132 400, 120 300, 140 170" stroke="#0a0014" strokeWidth="14" fill="none" />
    {[[-110, -10], [-80, -60], [-20, -80], [50, -70], [110, -20], [90, 30], [-100, 40]].map(([dx, dy], i) => (
      <path key={i} d={`M140 170 Q ${140 + dx * 0.5} ${170 + dy - 30}, ${140 + dx} ${170 + dy + 40}`} stroke="#0a0014" strokeWidth="16" fill="none" strokeLinecap="round" />
    ))}
  </svg>
);

/** Synthwave night: gradient sky, striped sun, skyline, palms, a moving neon grid floor, stars. */
const World: React.FC<{ dim?: number }> = ({ dim = 0 }) => {
  const f = useCurrentFrame();
  const scroll = (f * 4) % 120;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.night} 0%, #3a0a5e 40%, #a3176b 62%, ${C.orange} 72%, #1a0533 72.2%)`, overflow: "hidden" }}>
      {Array.from({ length: 70 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: random(`s${i}`) * 1080, top: random(`t${i}`) * 700, width: 3, height: 3, borderRadius: 2, background: "#fff", opacity: 0.3 + 0.6 * Math.abs(Math.sin(f / 18 + i)) }} />
      ))}
      {/* sun */}
      <div style={{ position: "absolute", left: 540 - 300, top: 900, width: 600, height: 600, borderRadius: "50%", background: `linear-gradient(180deg, ${C.yellow}, ${C.pink} 70%)`, maskImage: "repeating-linear-gradient(180deg, #000 0 34px, transparent 34px 44px)", WebkitMaskImage: "linear-gradient(180deg, #000 45%, transparent 45%), repeating-linear-gradient(180deg, #000 0 30px, transparent 30px 42px)", boxShadow: `0 0 120px ${C.pink}` }} />
      {/* skyline */}
      <svg width="1080" height="400" style={{ position: "absolute", left: 0, top: 1000 }}>
        {Array.from({ length: 18 }).map((_, i) => {
          const h = 80 + random(`b${i}`) * 260;
          return <rect key={i} x={i * 62 - 10} y={385 - h} width={56} height={h} fill="#1a0533" />;
        })}
        {Array.from({ length: 60 }).map((_, i) => (
          <rect key={`w${i}`} x={random(`wx${i}`) * 1080} y={200 + random(`wy${i}`) * 180} width={5} height={7} fill={i % 3 ? C.cyan : C.yellow} opacity={0.5} />
        ))}
      </svg>
      {/* neon grid floor */}
      <div style={{ position: "absolute", left: -600, right: -600, top: 1383, height: 900, perspective: 500 }}>
        <div style={{ position: "absolute", inset: 0, transform: "rotateX(70deg)", transformOrigin: "50% 0%", backgroundImage: `linear-gradient(${C.pink} 2px, transparent 2px), linear-gradient(90deg, ${C.pink} 2px, transparent 2px)`, backgroundSize: "120px 120px", backgroundPosition: `0px ${scroll}px`, opacity: 0.55 }} />
      </div>
      <Palm x={-60} y={880} s={1.2} />
      <Palm x={830} y={930} s={1.05} flip />
      <AbsoluteFill style={{ background: `rgba(10,0,25,${dim})` }} />
    </AbsoluteFill>
  );
};

/** CRT scanlines, vignette, slight flicker. */
const Retro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 5px)", opacity: 0.5 }} />
      <AbsoluteFill style={{ background: "radial-gradient(90% 70% at 50% 45%, transparent 55%, rgba(5,0,15,0.75) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: random(`fl${Math.floor(f / 3)}`) > 0.97 ? 0.03 : 0 }} />
    </>
  );
};

/** Level HUD: a neon tag at the top, with level dots. */
const Hud: React.FC<{ level: number; title: string }> = ({ level, title }) => {
  const f = useCurrentFrame();
  const big = interpolate(f, [0, 10, 34, 46], [0, 1, 1, 0], clamp);
  const small = ease(f, 38, 50);
  const names = ["المستوى الأول", "المستوى الثاني", "المستوى الأخير"];
  return (
    <>
      {/* level banner */}
      <AbsoluteFill style={{ display: "grid", placeItems: "center", opacity: big, pointerEvents: "none" }}>
        <div dir="rtl" style={{ textAlign: "center", scale: String(0.8 + 0.2 * big), marginTop: -200 }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 130, color: "#fff", textShadow: neon(C.pink, 1.4), lineHeight: 1.1 }}>{names[level - 1]}</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 70, color: C.cyan, textShadow: neon(C.cyan, 0.8) }}>{title}</div>
        </div>
      </AbsoluteFill>
      {/* corner tag */}
      <div dir="rtl" style={{ position: "absolute", top: 150, right: 140, left: 80, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: small }}>
        <div style={{ padding: "8px 26px 14px", borderRadius: 14, border: `3px solid ${C.pink}`, boxShadow: neon(C.pink, 0.6), fontFamily: DISPLAY, fontSize: 48, color: "#fff" }}>
          {names[level - 1]} · <span style={{ color: C.cyan }}>{title}</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[1, 2, 3].map((k) => (
            <div key={k} style={{ width: 20, height: 20, rotate: "45deg", background: k <= level ? C.yellow : "rgba(255,255,255,0.2)", boxShadow: k <= level ? neon(C.yellow, 0.5) : undefined }} />
          ))}
        </div>
      </div>
      <Sfx name="level" at={2} />
    </>
  );
};

/** Spoken words, a phrase at a time; the active word glows pink. */
const Subs: React.FC<{ scene: SceneTiming; top?: number }> = ({ scene, top = 1530 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // keep Latin runs like "GTA 6" together, so right-to-left flow doesn't swap them
  const merged: Word[] = [];
  for (const w of scene.words) {
    const prev = merged[merged.length - 1];
    if (prev && /^[A-Za-z0-9]+$/.test(prev.text) && /^[A-Za-z0-9]+$/.test(w.text)) {
      merged[merged.length - 1] = { ...prev, text: `${prev.text} ${w.text}`, raw: `${prev.raw ?? prev.text} ${w.raw ?? w.text}`, end: w.end };
    } else merged.push(w);
  }
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of merged) {
    cur.push(w);
    if (cur.length >= 5 || /[،,.؟?!…:]$/.test(w.raw ?? w.text)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  let idx = -1;
  chunks.forEach((c, i) => {
    if (frame >= c[0].start - 3) idx = i;
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const p = spring({ frame: frame - (chunk[0].start - 3), fps, config: { damping: 12, stiffness: 300, mass: 0.5 } });
  return (
    <div dir="rtl" style={{ position: "absolute", left: 70, right: 130, top, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.3em", fontFamily: SANS, fontWeight: 800, fontSize: 60, lineHeight: 1.5, scale: String(0.9 + 0.1 * p) }}>
      {chunk.map((w, i) => {
        const on = frame >= w.start - 3;
        const active = on && (i === chunk.length - 1 || frame < chunk[i + 1].start - 3);
        const latin = /[A-Za-z0-9]/.test(w.text);
        return (
          <span key={`${idx}-${i}`} dir={latin ? "ltr" : "rtl"} style={{ color: active ? C.yellow : "#fff", opacity: on ? 1 : 0.3, textShadow: active ? neon(C.pink, 0.7) : "0 3px 14px rgba(0,0,0,0.9)", fontFamily: latin ? LAT : SANS, unicodeBidi: "isolate" }}>
            {(w.raw ?? w.text).replace(/[«»]/g, "")}
          </span>
        );
      })}
    </div>
  );
};

/** A neon-edged glass panel. */
const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; color?: string }> = ({ children, style, color = C.cyan }) => (
  <div style={{ borderRadius: 26, background: "rgba(18,0,42,0.82)", border: `3px solid ${color}`, boxShadow: `${neon(color, 0.5)}, inset 0 0 30px rgba(0,0,0,0.5)`, ...style }}>{children}</div>
);

/** A TV showing a drawn night-city game scene with an English subtitle; the Arabic line can appear above it. */
const Tv: React.FC<{
  arabic: number;
  select?: number;
  scan?: number;
  style?: React.CSSProperties;
  bright?: number; // 0..1 مشهد نهاري مضيء (الترجمة تضيع فيه)
  subBg?: number; // 0..1 خلفية الترجمة
  subBig?: number; // 0..1 تكبير الخط
  ambient?: number; // 0..1 حوارات الشارع الجانبية
}> = ({ arabic, select = 0, scan = -1, style, bright = 0, subBg = 1, subBig = 0, ambient = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", width: 880, height: 560, ...style }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "#050008", border: "10px solid #0c0c12", boxShadow: `0 30px 80px rgba(0,0,0,0.6), ${neon(C.purple, 0.4)}`, overflow: "hidden" }}>
        {/* drawn scene */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, #2a0848 0%, #b21a6d 55%, ${C.orange} 66%, #160428 66.5%)` }} />
        <div style={{ position: "absolute", left: 300, top: 210, width: 260, height: 260, borderRadius: "50%", background: `linear-gradient(180deg, ${C.yellow}, ${C.pink})`, opacity: 0.9 }} />
        <svg width="860" height="540" style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 14 }).map((_, i) => {
            const h = 60 + random(`tb${i}`) * 170;
            return <rect key={i} x={i * 64} y={356 - h} width={58} height={h} fill="#160428" />;
          })}
          <path d="M0 540 L 380 356 L 480 356 L 860 540 Z" fill="#0d0218" />
          <path d={`M430 360 L 430 540`} stroke={C.yellow} strokeWidth="6" strokeDasharray="30 30" strokeDashoffset={-f * 6} />
        </svg>
        <div style={{ position: "absolute", left: 40, top: 300 }}>
          <Palm x={0} y={-180} s={0.45} />
        </div>
        {/* English subtitle */}
        {/* daylight wash */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #fff7e0 0%, #ffd9a8 60%, #f3c58f 100%)", opacity: bright * 0.82 }} />
        {/* ambient street lines */}
        {ambient > 0 && (
          <>
            <div style={{ position: "absolute", left: 40, top: 150, padding: "4px 12px", borderRadius: 8, background: "rgba(0,0,0,0.55)", fontFamily: SANS, fontWeight: 700, fontSize: 22, color: "#fff", opacity: ease(ambient * 20, 0, 8), translate: `0px ${(1 - Math.min(1, ambient * 2)) * 10}px` }}>Hey! Watch the road!</div>
            <div style={{ position: "absolute", right: 40, top: 210, padding: "4px 12px", borderRadius: 8, background: "rgba(0,0,0,0.55)", fontFamily: SANS, fontWeight: 700, fontSize: 22, color: "#fff", opacity: ease(ambient * 20, 8, 16) }}>Nice car, man.</div>
          </>
        )}
        {/* English subtitle */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, display: "flex", justifyContent: "center" }}>
          <div style={{ padding: subBg > 0 ? "4px 16px 8px" : 0, borderRadius: 8, background: `rgba(0,0,0,${0.7 * subBg})`, fontFamily: SANS, fontWeight: 700, fontSize: 30 + 14 * subBig, color: "#fff", textShadow: subBg > 0.5 ? "none" : "0 1px 2px rgba(0,0,0,0.35)" }}>We need to get out of here, now.</div>
        </div>
        {/* Arabic overlay */}
        {arabic > 0 && (
          <div dir="rtl" style={{ position: "absolute", left: 120, right: 120, bottom: 88, padding: "8px 16px 12px", borderRadius: 12, background: "rgba(0,0,0,0.65)", textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 38, color: C.yellow, opacity: arabic, translate: `0px ${(1 - arabic) * 20}px` }}>لازم نطلع من هنا، الحين.</div>
        )}
        {/* region selection */}
        {select > 0 && <div style={{ position: "absolute", left: 60, right: 60, bottom: 22, height: 56, border: `4px dashed ${C.cyan}`, borderRadius: 8, boxShadow: neon(C.cyan, 0.4), clipPath: `inset(0 ${(1 - select) * 100}% 0 0)` }} />}
        {/* OCR scan */}
        {scan >= 0 && scan <= 1 && <div style={{ position: "absolute", left: 0, right: 0, top: `${scan * 100}%`, height: 6, background: C.cyan, boxShadow: neon(C.cyan, 0.8) }} />}
        <div style={{ position: "absolute", left: 14, top: 10, fontFamily: SANS, fontWeight: 600, fontSize: 18, color: "rgba(255,255,255,0.75)" }}>رسم توضيحي</div>
      </div>
      <div style={{ position: "absolute", left: 380, right: 380, bottom: -40, height: 30, background: "#0c0c12", borderRadius: 6 }} />
    </div>
  );
};

const Frame: React.FC<{ id: GId; children: React.ReactNode; dim?: number; subsTop?: number }> = ({ id, children, dim = 0.35, subsTop }) => {
  const scene = getG(id);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <World dim={dim} />
      {children}
      <Retro />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 72%, rgba(10,0,25,0.85) 84%)" }} />
      <Subs scene={scene} top={subsTop} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={0} gain={0.7} />
    </AbsoluteFill>
  );
};

const Icon: React.FC<{ d: string[]; size?: number; color?: string }> = ({ d, size = 56, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {d.map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);
const IC = {
  pad: ["M6 9h12a4 4 0 0 1 3.6 5.7l-1 2a2.5 2.5 0 0 1-4.2.3L15 15H9l-1.4 2a2.5 2.5 0 0 1-4.2-.3l-1-2A4 4 0 0 1 6 9z", "M7 12h3", "M8.5 10.5v3", "M15.5 12h.01", "M17.5 12h.01"],
  tv: ["M3 5h18v12H3z", "M8 21h8", "M12 17v4"],
  pc: ["M4 5h16v10H4z", "M2 19h20"],
  phone: ["M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z", "M11 18h2"],
  wifi: ["M2 9a15 15 0 0 1 20 0", "M5 12.5a10 10 0 0 1 14 0", "M8.5 16a5 5 0 0 1 7 0", "M12 19.5h.01"],
  down: ["M12 4v11", "M7 10l5 5 5-5", "M5 20h14"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  alert: ["M12 3l10 18H2z", "M12 10v5", "M12 18h.01"],
  heart: ["M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"],
};


/** A settings menu (illustration): each row flips from its old value to its new one on a spoken cue. */
const Settings: React.FC<{ rows: { label: string; from: string; to: string; at: number }[]; style?: React.CSSProperties; show: number }> = ({ rows, style, show }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 80, right: 140, ...style, opacity: Math.min(1, show * 1.4), translate: `0px ${(1 - show) * 40}px` }}>
      <Panel color={C.purple} style={{ padding: "18px 26px 22px" }}>
        <div dir="rtl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 40, color: "#fff" }}>الإعدادات · العرض</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 18, color: "rgba(255,255,255,0.55)" }}>رسم توضيحي</div>
        </div>
        {rows.map((r) => {
          const on = f >= r.at;
          const flash = interpolate(f, [r.at, r.at + 4, r.at + 16], [0, 1, 0], clamp);
          return (
            <div key={r.label} dir="rtl" style={{ marginTop: 14, padding: "12px 16px", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", background: on ? "rgba(45,226,230,0.12)" : "rgba(255,255,255,0.05)", border: `2px solid ${on ? C.cyan : "rgba(255,255,255,0.12)"}`, boxShadow: flash > 0 ? neon(C.cyan, flash) : undefined }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#fff" }}>{r.label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: on ? C.yellow : "rgba(255,255,255,0.55)" }}>
                {on && <Icon d={IC.check} size={30} color={C.yellow} />}‹ {on ? r.to : r.from} ›
              </div>
            </div>
          );
        })}
      </Panel>
    </div>
  );
};

// ------------------------------------------------------------ scenes
const LANGS = ["الإنجليزية", "الفرنسية", "الألمانية", "الإسبانية", "الإيطالية", "البرتغالية", "الروسية", "البولندية", "اليابانية", "الكورية", "الصينية"];

const N1: React.FC = () => {
  const s = getG("N1-Hook");
  const f = useCurrentFrame();
  const tList = cue(s, "بثلاث") - 4;
  const tAr = cue(s, "والعربي");
  const tCan = cue(s, "تقدر");
  const tUnd = cue(s, "وتفهم");
  const tv = usePop(2, 160, 16);
  const chipsOut = ease(f, tCan - 6, tCan + 4);
  const strike = ease(f, tAr + 4, tAr + 14);
  const glitch = f >= tAr - 2 && f < tAr + 8;
  const title = usePop(tCan - 2, 180, 12);
  const ar = ease(f, tUnd, tUnd + 12);
  // hooks first, always in the same order
  const chipPops = LANGS.map((_, i) => usePop(tList + i * 2, 260, 14));
  const arPop = usePop(tAr - 2, 300, 10);
  return (
    <Frame id="N1-Hook" dim={0.2}>
      <Tv arabic={ar} style={{ left: 100, top: 300, scale: String(0.85 + 0.15 * tv), opacity: Math.min(1, tv * 1.4), filter: glitch ? `drop-shadow(6px 0 0 ${C.cyan}) drop-shadow(-6px 0 0 ${C.pink})` : undefined }} />
      {f >= tList && chipsOut < 1 && (
        <div dir="rtl" style={{ position: "absolute", left: 70, right: 130, top: 960, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 14, opacity: 1 - chipsOut }}>
          {LANGS.map((l, i) => {
            const p = chipPops[i];
            return (
              <div key={l} style={{ padding: "8px 22px 12px", borderRadius: 999, border: `2px solid rgba(45,226,230,0.6)`, background: "rgba(18,0,42,0.75)", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#fff", scale: String(p), opacity: Math.min(1, p * 1.5) }}>{l}</div>
            );
          })}
          {f >= tAr - 2 && (
            <div style={{ position: "relative", marginTop: 10, padding: "12px 44px 18px", borderRadius: 999, border: `4px solid ${C.pink}`, background: "rgba(255,46,136,0.22)", boxShadow: neon(C.pink, 0.9), fontFamily: DISPLAY, fontSize: 64, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.8)", scale: String(arPop), translate: glitch ? `${(random(`g${f}`) - 0.5) * 16}px 0px` : undefined }}>
              العربية
              <div style={{ position: "absolute", right: "8%", top: "50%", height: 9, width: `${strike * 84}%`, background: "#ff1f4b", boxShadow: neon("#ff1f4b", 0.6), borderRadius: 5, rotate: "-7deg" }} />
            </div>
          )}
        </div>
      )}
      {f >= tCan - 2 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 1000, textAlign: "center", scale: String(title) }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 120, color: "#fff", textShadow: neon(C.pink, 1.3), lineHeight: 1.1 }}>
            <span dir="ltr" style={{ fontFamily: LAT, fontSize: 104, color: C.yellow, textShadow: neon(C.orange, 1) }}>GTA 6</span> بالعربي
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 54, color: C.cyan, textShadow: neon(C.cyan, 0.7), marginTop: 6 }}>٣ مستويات · مجاناً</div>
        </div>
      )}
      {LANGS.map((l, i) => (
        <Sfx key={l} name="click" at={tList + i * 2} gain={0.35} />
      ))}
      <Sfx name="glitch" at={tAr - 2} />
      <Sfx name="impact" at={tCan - 2} />
      <Sfx name="check" at={tUnd} />
    </Frame>
  );
};

const N2: React.FC = () => {
  const s = getG("N2-Subs");
  const f = useCurrentFrame();
  const tTv = cue(s, "الإنجليزية") - 4;
  const tMis = cue(s, "للمهمات");
  const tChange = cue(s, "غيّرها");
  const tAmb = cue(s, "الشخصيات");
  const tv = usePop(tTv, 170, 16);
  const menu = usePop(tMis - 4, 190, 15);
  const amb = interpolate(f, [tAmb, tAmb + 20], [0, 1], clamp);
  return (
    <Frame id="N2-Subs">
      <Hud level={1} title="الترجمة" />
      {f >= tTv && <Tv arabic={0} ambient={amb} style={{ left: 100, top: 300, scale: String(0.85 + 0.15 * tv), opacity: Math.min(1, tv * 1.4) }} />}
      {f >= tMis - 4 && <Settings show={menu} style={{ top: 950 }} rows={[{ label: "الترجمة", from: "المهمات فقط", to: "كل الحوارات", at: tChange + 2 }]} />}
      <Sfx name="click" at={tMis - 4} gain={0.7} />
      <Sfx name="click" at={tChange + 2} />
      <Sfx name="check" at={tChange + 8} />
      <Sfx name="type" at={tAmb} gain={0.5} />
    </Frame>
  );
};

const N3: React.FC = () => {
  const s = getG("N3-Clear");
  const f = useCurrentFrame();
  const tTv = cue(s, "الوضوح") + 6;
  const tBg = cue(s, "خلفية");
  const tBig = cue(s, "وكبّر");
  const tRead = cue(s, "وبتقراها");
  const tv = usePop(Math.max(tTv, 44), 170, 16);
  const menu = usePop(tBg - 6, 190, 15);
  const bg = ease(f, tBg + 2, tBg + 10);
  const big = ease(f, tBig + 2, tBig + 12);
  const ok = usePop(tRead, 220, 12);
  return (
    <Frame id="N3-Clear">
      <Hud level={2} title="الوضوح" />
      <Tv arabic={0} bright={1} subBg={bg} subBig={big} style={{ left: 100, top: 300, scale: String(0.85 + 0.15 * tv), opacity: Math.min(1, tv * 1.4) }} />
      {f >= tBg - 6 && (
        <Settings
          show={menu}
          style={{ top: 950 }}
          rows={[
            { label: "خلفية الترجمة", from: "إيقاف", to: "تشغيل", at: tBg + 2 },
            { label: "حجم الخط", from: "صغير", to: "كبير", at: tBig + 2 },
          ]}
        />
      )}
      {f >= tRead && (
        <div style={{ position: "absolute", left: 0, right: 100, top: 1290, display: "flex", justifyContent: "center", scale: String(ok) }}>
          <Panel color={C.yellow} style={{ padding: "10px 30px 14px", display: "flex", alignItems: "center", gap: 12 }}>
            <Icon d={IC.check} size={40} color={C.yellow} />
            <div dir="rtl" style={{ fontFamily: DISPLAY, fontSize: 44, color: "#fff" }}>تنقرأ حتى في النهار</div>
          </Panel>
        </div>
      )}
      <Sfx name="click" at={tBg + 2} />
      <Sfx name="click" at={tBig + 2} />
      <Sfx name="check" at={tRead} />
    </Frame>
  );
};

const N4: React.FC = () => {
  const s = getG("N4-Tool");
  const f = useCurrentFrame();
  const t = (w: string) => cue(s, w);
  const tName = t("GameTranslator");
  const tRead = t("تقرأ");
  const tTr = t("ترجمته");
  const tOver = t("فوق");
  const tv = usePop(Math.max(t("أداة") - 4, 44), 170, 16);
  const badge = usePop(tName - 4, 220, 12);
  const dev = usePop(tRead - 6, 200, 14);
  const wifi = ease(f, tRead - 2, tRead + 10);
  const scan = f >= tRead && f < tTr ? ((f - tRead) % 40) / 40 : -1;
  const tr = ease(f, tTr - 2, tTr + 10);
  const ar = ease(f, tOver, tOver + 12);
  return (
    <Frame id="N4-Tool">
      <Hud level={3} title="التعريب" />
      <Tv arabic={ar} scan={scan} style={{ left: 100, top: 300, scale: String(0.85 + 0.15 * tv), opacity: Math.min(1, tv * 1.4) }} />
      {f >= tName - 4 && (
        <div style={{ position: "absolute", left: 0, right: 100, top: 920, display: "flex", justifyContent: "center", scale: String(badge) }}>
          <Panel color={C.pink} style={{ padding: "10px 30px 14px", display: "flex", alignItems: "center", gap: 16 }}>
            <div dir="ltr" style={{ fontFamily: LAT, fontSize: 44, color: C.cyan, textShadow: neon(C.cyan, 0.5) }}>GameTranslator</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 40, color: C.yellow }}>· مجانية</div>
          </Panel>
        </div>
      )}
      {f >= tRead - 6 && (
        <>
          <div style={{ position: "absolute", left: 120, top: 1060, scale: String(dev), display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Panel style={{ padding: 18 }} color={C.pink}>
              <Icon d={IC.pad} size={80} />
            </Panel>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#fff" }}>جهازك</div>
          </div>
          <div style={{ position: "absolute", left: 650, top: 1060, scale: String(dev), display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Panel style={{ padding: 18, display: "flex", gap: 10 }}>
              <Icon d={IC.pc} size={64} />
              <Icon d={IC.phone} size={64} />
            </Panel>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#fff" }}>كمبيوتر أو جوال</div>
          </div>
          <div style={{ position: "absolute", left: 470, top: 1080, opacity: wifi, scale: String(0.6 + 0.4 * wifi) }}>
            <Icon d={IC.wifi} size={80} color={C.cyan} />
          </div>
        </>
      )}
      {tr > 0 && (
        <div dir="ltr" style={{ position: "absolute", left: 330, top: 1290, display: "flex", alignItems: "center", gap: 14, opacity: tr, scale: String(0.7 + 0.3 * tr) }}>
          <Panel style={{ padding: "8px 20px", fontFamily: LAT, fontSize: 36, color: "#fff" }}>EN</Panel>
          <div style={{ fontFamily: LAT, fontSize: 40, color: C.yellow }}>→</div>
          <Panel style={{ padding: "6px 20px 10px", fontFamily: DISPLAY, fontSize: 40, color: C.yellow }} color={C.yellow}>
            عربي
          </Panel>
        </div>
      )}
      <Sfx name="impact" at={tName - 4} gain={0.7} />
      <Sfx name="type" at={tRead} gain={0.6} />
      <Sfx name="glitch" at={tTr - 2} gain={0.6} />
      <Sfx name="check" at={tOver} />
    </Frame>
  );
};

const N5: React.FC = () => {
  const s = getG("N5-Win");
  const tPass = cue(s, "تمت");
  const pass = usePop(tPass - 4, 160, 10);
  return (
    <Frame id="N5-Win" dim={0.3}>
      <Tv arabic={1} style={{ left: 100, top: 300 }} />
      <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 980, textAlign: "center", scale: String(0.6 + 0.4 * pass), opacity: Math.min(1, pass * 1.4) }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 150, color: C.yellow, textShadow: neon(C.orange, 1.3), lineHeight: 1.05 }}>تمت المهمة!</div>
        <div style={{ fontFamily: LAT, fontSize: 40, color: "#fff", textShadow: neon(C.pink, 0.6), marginTop: 6 }}>+ ARABIC</div>
      </div>
      <Sfx name="pass" at={tPass - 4} />
    </Frame>
  );
};

const N6: React.FC = () => {
  const s = getG("N6-Note");
  const a = usePop(cue(s, "الترجمة") - 4, 200, 14);
  const b = usePop(cue(s, "والفضل") - 4, 200, 14);
  const f = useCurrentFrame();
  return (
    <Frame id="N6-Note" dim={0.5}>
      <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 360, display: "flex", flexDirection: "column", gap: 30 }}>
        {f >= cue(s, "الترجمة") - 4 && (
          <Panel color={C.yellow} style={{ padding: "26px 28px", scale: String(a), opacity: Math.min(1, a * 1.4) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Icon d={IC.alert} size={54} color={C.yellow} />
              <div style={{ fontFamily: DISPLAY, fontSize: 54, color: "#fff" }}>ترجمة بالذكاء الاصطناعي</div>
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "rgba(255,255,255,0.85)", marginTop: 10 }}>ممكن تطلع فيها أخطاء أحياناً، خصوصاً لو الخط صغير أو الخلفية مزحومة.</div>
          </Panel>
        )}
        {f >= cue(s, "والفضل") - 4 && (
          <Panel color={C.pink} style={{ padding: "26px 28px", scale: String(b), opacity: Math.min(1, b * 1.4) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Icon d={IC.heart} size={54} color={C.pink} />
              <div style={{ fontFamily: DISPLAY, fontSize: 54, color: "#fff" }}>الفضل لمطوّرها</div>
            </div>
            <div dir="ltr" style={{ fontFamily: LAT, fontSize: 40, color: C.cyan, marginTop: 8, textAlign: "right" }}>Sefflex · GameTranslator</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "rgba(255,255,255,0.85)", marginTop: 6 }}>مجانية ومفتوحة المصدر</div>
          </Panel>
        )}
      </div>
      <Sfx name="glitch" at={cue(s, "الترجمة") - 4} gain={0.6} />
      <Sfx name="check" at={cue(s, "والفضل") - 4} />
    </Frame>
  );
};

const N7: React.FC = () => {
  const s = getG("N7-CTA");
  const f = useCurrentFrame();
  const tF = cue(s, "تابعنا");
  const logo = usePop(4, 150, 12);
  const btn = usePop(tF - 4, 220, 11);
  const tapped = f >= tF + 16;
  return (
    <Frame id="N7-CTA" dim={0.45} subsTop={1560}>
      <div style={{ position: "absolute", left: 540 - 50 - 200, top: 380, width: 400, height: 400, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", scale: String(logo), boxShadow: neon(C.pink, 1.2) }}>
        <Img src={staticFile("brand/logo-color.png")} style={{ width: 330 }} />
      </div>
      <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 840, textAlign: "center", fontFamily: DISPLAY, fontSize: 64, color: "#fff", textShadow: neon(C.purple, 1), opacity: ease(f, 10, 24) }}>
        تبغى شروحات <span dir="ltr" style={{ fontFamily: LAT, fontSize: 56 }}>GTA 6</span>؟
      </div>
      {f >= tF - 4 && (
        <div style={{ position: "absolute", left: 0, right: 100, top: 1000, display: "flex", justifyContent: "center", scale: String(btn) }}>
          <div dir="rtl" style={{ padding: "20px 70px 28px", borderRadius: 999, background: tapped ? C.cyan : C.pink, boxShadow: neon(tapped ? C.cyan : C.pink, 1), fontFamily: DISPLAY, fontSize: 72, color: "#12002a" }}>{tapped ? "✓ تابعتنا" : "+ تابعنا"}</div>
        </div>
      )}
      <Sfx name="riser" at={Math.max(0, tF - 40)} gain={0.6} />
      <Sfx name="impact" at={tF - 4} />
      <Sfx name="check" at={tF + 16} />
    </Frame>
  );
};

const SCENES: { id: GId; C: React.FC }[] = [
  { id: "N1-Hook", C: N1 },
  { id: "N2-Subs", C: N2 },
  { id: "N3-Clear", C: N3 },
  { id: "N4-Tool", C: N4 },
  { id: "N5-Win", C: N5 },
  { id: "N6-Note", C: N6 },
  { id: "N7-CTA", C: N7 },
];

export const GtaNoArabic: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <TransitionSeries>
      {SCENES.flatMap(({ id, C: Comp }) => {
        const s = getG(id);
        const items = [
          <TransitionSeries.Sequence key={id} name={id} durationInFrames={s.durationInFrames}>
            <Comp />
          </TransitionSeries.Sequence>,
        ];
        if (s.transitionFrames) items.push(<TransitionSeries.Transition key={`${id}-t`} presentation={fade()} timing={linearTiming({ durationInFrames: s.transitionFrames })} />);
        return items;
      })}
    </TransitionSeries>
    {nTimeline.audio?.music && (
      <Audio
        src={staticFile("audio/gta2/music/neon.mp3")}
        loop
        volume={(f) => {
          const end = nTimeline.durationInFrames;
          const inVoice = nTimeline.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 4);
          const fd = interpolate(f, [0, 8, end - 40, end], [0, 1, 1, 0], clamp);
          return (inVoice ? db(-21) : db(-15)) * fd;
        }}
      />
    )}
  </AbsoluteFill>
);
