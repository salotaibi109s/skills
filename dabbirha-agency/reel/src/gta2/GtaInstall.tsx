import { loadFont as loadLalezar } from "@remotion/google-fonts/Lalezar";
import { loadFont as loadCairo } from "@remotion/google-fonts/Cairo";
import { loadFont as loadAudiowide } from "@remotion/google-fonts/Audiowide";
import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/gta3-timeline.json";
import { createSound } from "../components/Sound";
import { cue, findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { db } from "../theme";

/**
 * «تعريب GTA 6» install guide (GameTranslator 1.8.51, Arabic packs) — same neon world and system as GtaGuide, four levels.
 * Neon night-city look (sunset gradient, palms, moving grid). The "game" on the TV is a drawn illustration,
 * not a screenshot, and no publisher logo or artwork is used.
 */
const DISPLAY = loadLalezar("normal", { weights: ["400"], subsets: ["arabic"] }).fontFamily;
const SANS = loadCairo("normal", { weights: ["600", "700", "800"], subsets: ["arabic", "latin"] }).fontFamily;
const LAT = loadAudiowide("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

const C = { night: "#12002a", pink: "#ff2e88", orange: "#ff8a3d", yellow: "#ffd23f", cyan: "#2de2e6", purple: "#7a2bff", ink: "#ffffff" };

type GId = "I1-Hook" | "I2-Gear" | "I3-Get" | "I4-Link" | "I5-Arabic" | "I6-Win" | "I7-Note" | "I8-CTA";
export const iTimeline = data as TimelineData;
const getG = (id: GId) => findScene(iTimeline, id);
const { Sfx, SceneVoice } = createSound(iTimeline, "audio/gta3", {
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
  const names = ["المستوى الأول", "المستوى الثاني", "المستوى الثالث", "المستوى الأخير"];
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
          {[1, 2, 3, 4].map((k) => (
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
export const Settings: React.FC<{ rows: { label: string; from: string; to: string; at: number }[]; style?: React.CSSProperties; show: number }> = ({ rows, style, show }) => {
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

const I1: React.FC = () => {
  const s = getG("I1-Hook");
  const f = useCurrentFrame();
  const tList = 8;
  const tAr = cue(s, "عربي");
  const tTool = cue(s, "أداة");
  const tShow = cue(s, "وتطلّع");
  const tv = usePop(2, 160, 16);
  const chipPops = LANGS.map((_, i) => usePop(tList + i * 2, 260, 14));
  const arPop = usePop(tAr - 2, 300, 10);
  const strike = ease(f, tAr + 4, tAr + 14);
  const glitch = f >= tAr - 2 && f < tAr + 8;
  const chipsOut = ease(f, tTool - 6, tTool + 4);
  const title = usePop(tTool - 2, 180, 12);
  const ar = ease(f, tShow, tShow + 12);
  return (
    <Frame id="I1-Hook" dim={0.2}>
      <Tv arabic={ar} style={{ left: 100, top: 300, scale: String(0.85 + 0.15 * tv), opacity: Math.min(1, tv * 1.4), filter: glitch ? `drop-shadow(6px 0 0 ${C.cyan}) drop-shadow(-6px 0 0 ${C.pink})` : undefined }} />
      {chipsOut < 1 && (
        <div dir="rtl" style={{ position: "absolute", left: 70, right: 130, top: 960, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 14, opacity: 1 - chipsOut }}>
          {LANGS.map((l, i) => (
            <div key={l} style={{ padding: "8px 22px 12px", borderRadius: 999, border: "2px solid rgba(45,226,230,0.6)", background: "rgba(18,0,42,0.75)", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#fff", scale: String(chipPops[i]), opacity: Math.min(1, chipPops[i] * 1.5) }}>{l}</div>
          ))}
          {f >= tAr - 2 && (
            <div style={{ position: "relative", marginTop: 10, padding: "12px 44px 18px", borderRadius: 999, border: `4px solid ${C.pink}`, background: "rgba(255,46,136,0.22)", boxShadow: neon(C.pink, 0.9), fontFamily: DISPLAY, fontSize: 64, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.8)", scale: String(arPop), translate: glitch ? `${(random(`g${f}`) - 0.5) * 16}px 0px` : undefined }}>
              العربية
              <div style={{ position: "absolute", right: "8%", top: "50%", height: 9, width: `${strike * 84}%`, background: "#ff1f4b", boxShadow: neon("#ff1f4b", 0.6), borderRadius: 5, rotate: "-7deg" }} />
            </div>
          )}
        </div>
      )}
      {f >= tTool - 2 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 1010, textAlign: "center", scale: String(title) }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 120, color: "#fff", textShadow: neon(C.pink, 1.3), lineHeight: 1.1 }}>
            تعريب <span dir="ltr" style={{ fontFamily: LAT, fontSize: 104, color: C.yellow, textShadow: neon(C.orange, 1) }}>GTA 6</span>
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 54, color: C.cyan, textShadow: neon(C.cyan, 0.7), marginTop: 6 }}>مجاني · خطوة بخطوة</div>
        </div>
      )}
      {LANGS.map((l, i) => (
        <Sfx key={l} name="click" at={tList + i * 2} gain={0.3} />
      ))}
      <Sfx name="glitch" at={tAr - 2} />
      <Sfx name="impact" at={tTool - 2} />
      <Sfx name="check" at={tShow} />
    </Frame>
  );
};

const I2: React.FC = () => {
  const s = getG("I2-Gear");
  const f = useCurrentFrame();
  const slots: { at: string; icons: string[][]; l: string }[] = [
    { at: "بلايستيشن", icons: [IC.pad], l: "بلايستيشن ٥ أو إكس بوكس" },
    { at: "وكمبيوتر", icons: [IC.pc, IC.phone], l: "كمبيوتر ويندوز أو جوال أندرويد" },
    { at: "وشاشة", icons: [IC.tv, IC.phone], l: "تلفزيون ذكي أو جوال ثاني للترجمة" },
    { at: "وكلها", icons: [IC.wifi], l: "نفس الواي فاي" },
  ];
  const pops = slots.map((sl) => usePop(cue(s, sl.at) - 4, 240, 12));
  return (
    <Frame id="I2-Gear">
      <Hud level={1} title="التجهيز" />
      <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 330, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {slots.map((sl, i) => {
          const on = f >= cue(s, sl.at) - 4;
          const p = pops[i];
          return (
            <Panel key={sl.l} color={on ? C.cyan : "rgba(255,255,255,0.25)"} style={{ position: "relative", height: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 18, boxShadow: on ? undefined : "none" }}>
              <div style={{ display: "flex", gap: 12, scale: String(on ? p : 0.001) }}>
                {sl.icons.map((d, k) => (
                  <Icon key={k} d={d} size={100} />
                ))}
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 31, color: "#fff", textAlign: "center", opacity: on ? 1 : 0.3, lineHeight: 1.3 }}>{sl.l}</div>
              {on && (
                <div style={{ position: "absolute", top: 14, left: 14, width: 46, height: 46, borderRadius: 23, background: C.yellow, display: "grid", placeItems: "center", scale: String(p) }}>
                  <Icon d={IC.check} size={30} color="#12002a" />
                </div>
              )}
              <div style={{ position: "absolute", bottom: 14, fontFamily: LAT, fontSize: 20, color: C.cyan, opacity: on ? 0 : 0.6 }}>{i + 1}</div>
            </Panel>
          );
        })}
      </div>
      {slots.map((sl) => (
        <Sfx key={sl.at} name="check" at={cue(s, sl.at) - 4} />
      ))}
    </Frame>
  );
};

const I3: React.FC = () => {
  const s = getG("I3-Get");
  const f = useCurrentFrame();
  const tPage = cue(s, "موقعها");
  const tPc = cue(s, "حمّل");
  const tPh = cue(s, "الجوال");
  const tTv = cue(s, "تركّب");
  const tWarn = cue(s, "ولا");
  const page = usePop(tPage - 4, 170, 16);
  const warn = usePop(tWarn - 2, 220, 12);
  const rows = [
    { at: tPc, name: "GameTranslator-win-Setup.exe", l: "نسخة الكمبيوتر", icon: IC.pc, len: 46 },
    { at: tPh, name: "GameTranslator-mobil-arm64.apk", l: "نسخة الجوال", icon: IC.phone, len: 40 },
    { at: tTv, name: "Android TV · LG · Samsung", l: "تطبيق التلفزيون", icon: IC.tv, len: 34 },
  ];
  return (
    <Frame id="I3-Get">
      <Hud level={2} title="التحميل" />
      {f >= tPage - 4 && (
        <div style={{ position: "absolute", left: 80, right: 140, top: 340, opacity: Math.min(1, page * 1.4), translate: `0px ${(1 - page) * 40}px` }}>
          <Panel style={{ padding: 0, overflow: "hidden" }}>
            <div dir="ltr" style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "rgba(255,255,255,0.06)" }}>
              {[C.pink, C.yellow, C.cyan].map((c) => (
                <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
              ))}
              <div style={{ marginLeft: 10, flex: 1, padding: "6px 14px", borderRadius: 999, background: "rgba(0,0,0,0.4)", fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#fff" }}>🔒 gametranslator.com.tr</div>
            </div>
            <div dir="rtl" style={{ padding: "24px 26px 30px" }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 46, color: "#fff" }}>الموقع الرسمي · التحميل</div>
              {rows.map((r) => {
                const p = interpolate(f, [r.at, r.at + r.len], [0, 1], clamp);
                return (
                  <div key={r.name} style={{ marginTop: 22, opacity: ease(f, r.at - 4, r.at + 6) }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Icon d={p >= 1 ? IC.check : r.icon} size={40} color={p >= 1 ? C.yellow : C.cyan} />
                      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff" }}>{r.l}</div>
                      <div dir="ltr" style={{ marginRight: "auto", fontFamily: SANS, fontWeight: 600, fontSize: 19, color: "rgba(255,255,255,0.6)" }}>{r.name}</div>
                    </div>
                    <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.12)", marginTop: 10, overflow: "hidden" }}>
                      <div style={{ width: `${p * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.pink}, ${C.yellow})` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      )}
      {f >= tWarn - 2 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 1140, display: "flex", justifyContent: "center", scale: String(warn) }}>
          <Panel color={C.yellow} style={{ padding: "16px 30px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <Icon d={IC.alert} size={48} color={C.yellow} />
            <div style={{ fontFamily: DISPLAY, fontSize: 46, color: "#fff" }}>من الموقع الرسمي بس</div>
          </Panel>
        </div>
      )}
      {rows.map((r) => (
        <React.Fragment key={r.name}>
          <Sfx name="click" at={r.at} />
          <Sfx name="check" at={r.at + r.len} />
        </React.Fragment>
      ))}
      <Sfx name="glitch" at={tWarn - 2} gain={0.7} />
    </Frame>
  );
};

/** On/off switch, flips on at `at`. */
const Toggle: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const k = ease(f, at, at + 8);
  return (
    <div style={{ width: 96, height: 52, borderRadius: 26, background: k > 0.5 ? C.cyan : "rgba(255,255,255,0.2)", boxShadow: k > 0.5 ? neon(C.cyan, 0.5) : undefined, position: "relative" }}>
      <div style={{ position: "absolute", top: 6, right: 6 + (1 - k) * 44, width: 40, height: 40, borderRadius: 20, background: "#fff" }} />
    </div>
  );
};

const I4: React.FC = () => {
  const s = getG("I4-Link");
  const f = useCurrentFrame();
  const tSet = cue(s, "البلايستيشن");
  const tOn = cue(s, "شغّل");
  const tAdd = cue(s, "وأضف");
  const tCon = cue(s, "تتصل");
  const tPlay = cue(s, "تكمل");
  const menu = usePop(tSet - 4, 190, 15);
  const acc = usePop(tAdd - 4, 220, 13);
  const link = ease(f, tCon - 2, tCon + 16);
  const play = usePop(tPlay - 2, 240, 12);
  const xb = usePop(tPlay + 12, 200, 14);
  return (
    <Frame id="I4-Link">
      <Hud level={3} title="الربط" />
      {f >= tSet - 4 && (
        <div style={{ position: "absolute", left: 80, right: 140, top: 330, opacity: Math.min(1, menu * 1.4), translate: `0px ${(1 - menu) * 40}px` }}>
          <Panel color={C.purple} style={{ padding: "20px 26px 24px" }}>
            <div dir="rtl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 40, color: "#fff" }}>إعدادات البلايستيشن ٥</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 18, color: "rgba(255,255,255,0.55)" }}>رسم توضيحي</div>
            </div>
            <div dir="rtl" style={{ marginTop: 12, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "rgba(255,255,255,0.7)" }}>الإعدادات › النظام › التشغيل عن بعد</div>
            <div dir="rtl" style={{ marginTop: 16, padding: "14px 18px", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", background: f >= tOn ? "rgba(45,226,230,0.12)" : "rgba(255,255,255,0.05)", border: `2px solid ${f >= tOn ? C.cyan : "rgba(255,255,255,0.12)"}` }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#fff" }}>تفعيل التشغيل عن بعد</div>
              <Toggle at={tOn + 2} />
            </div>
          </Panel>
        </div>
      )}
      {f >= tAdd - 4 && (
        <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 720, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, scale: String(acc), opacity: Math.min(1, acc * 1.4) }}>
          <Panel color={f >= tPlay - 2 ? C.yellow : C.pink} style={{ padding: "22px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Icon d={IC.pad} size={84} />
            <div style={{ fontFamily: DISPLAY, fontSize: 40, color: "#fff" }}>حسابك</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "rgba(255,255,255,0.8)" }}>تلعب فيه على التلفزيون</div>
            {f >= tPlay - 2 && (
              <div style={{ marginTop: 4, padding: "4px 16px 8px", borderRadius: 999, background: C.yellow, fontFamily: SANS, fontWeight: 800, fontSize: 24, color: "#12002a", scale: String(play) }}>✓ الكنترولر بيدك</div>
            )}
          </Panel>
          <Panel color={C.cyan} style={{ padding: "22px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <Icon d={IC.pc} size={74} />
              <Icon d={IC.phone} size={74} />
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 40, color: "#fff" }}>حساب ثاني</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "rgba(255,255,255,0.8)" }}>مجاني · للأداة بس</div>
          </Panel>
        </div>
      )}
      {link > 0 && (
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          <path d="M300 1110 C 300 1200, 540 1200, 540 1240 S 780 1280, 780 1110" stroke={C.cyan} strokeWidth="6" fill="none" strokeDasharray="18 14" strokeDashoffset={-f * 3} opacity={link} />
          <text x="540" y="1300" textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize="30" fill={C.cyan} opacity={link}>الأداة تتصل بالبلايستيشن</text>
        </svg>
      )}
      {f >= tPlay + 12 && (
        <div style={{ position: "absolute", left: 0, right: 100, top: 1340, display: "flex", justifyContent: "center", scale: String(xb) }}>
          <Panel color="rgba(255,255,255,0.4)" style={{ padding: "10px 24px 14px", boxShadow: "none" }}>
            <div dir="rtl" style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#fff" }}>إكس بوكس؟ سجّل دخول بحساب مايكروسوفت من الأداة</div>
          </Panel>
        </div>
      )}
      <Sfx name="click" at={tSet - 4} gain={0.7} />
      <Sfx name="click" at={tOn + 2} />
      <Sfx name="check" at={tOn + 10} />
      <Sfx name="click" at={tAdd - 4} />
      <Sfx name="type" at={tCon} gain={0.5} />
      <Sfx name="check" at={tPlay - 2} />
    </Frame>
  );
};

const I5: React.FC = () => {
  const s = getG("I5-Arabic");
  const f = useCurrentFrame();
  const tLang = cue(s, "اختر");
  const tPack = cue(s, "وتنزل");
  const tSel = cue(s, "حدد");
  const tPress = cue(s, "واضغط");
  const tv = usePop(Math.max(cue(s, "الإعدادات") - 4, 44), 170, 16);
  const lang = usePop(tLang - 4, 220, 13);
  const pack = interpolate(f, [tPack, tPack + 50], [0, 1], clamp);
  const packIn = usePop(tPack - 4, 220, 14);
  const stage1Out = ease(f, tSel - 6, tSel + 4);
  const sel = ease(f, tSel, tSel + 24);
  const btn = usePop(tPress - 4, 220, 12);
  const pressed = f >= tPress + 10;
  const ar = ease(f, tPress + 16, tPress + 28);
  return (
    <Frame id="I5-Arabic">
      <Hud level={4} title="التعريب" />
      <Tv arabic={ar} select={f < tPress + 16 ? sel : 0} style={{ left: 100, top: 300, scale: String(0.85 + 0.15 * tv), opacity: Math.min(1, tv * 1.4) }} />
      {stage1Out < 1 && f >= tLang - 4 && (
        <div dir="rtl" style={{ position: "absolute", left: 200, right: 260, top: 950, scale: String(lang), opacity: 1 - stage1Out }}>
          <Panel color={C.pink} style={{ padding: "12px 18px" }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,0.7)" }}>لغة الترجمة</div>
            {["English", "العربية", "Türkçe"].map((l, i) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", marginTop: 4, borderRadius: 10, background: i === 1 ? "rgba(255,46,136,0.3)" : "transparent", fontFamily: SANS, fontWeight: 800, fontSize: 30, color: i === 1 ? "#fff" : "rgba(255,255,255,0.45)" }}>
                {i === 1 && <Icon d={IC.check} size={28} color={C.yellow} />}
                {l}
              </div>
            ))}
          </Panel>
        </div>
      )}
      {stage1Out < 1 && f >= tPack - 4 && (
        <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 1210, scale: String(packIn), opacity: 1 - stage1Out }}>
          <Panel color={C.yellow} style={{ padding: "14px 22px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Icon d={pack >= 1 ? IC.check : IC.down} size={38} color={C.yellow} />
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff" }}>
                حزمة <span dir="ltr" style={{ fontFamily: LAT, fontSize: 26 }}>GTA 6</span> العربية
              </div>
              <div style={{ marginRight: "auto", fontFamily: LAT, fontSize: 24, color: C.yellow }}>{Math.round(pack * 100)}%</div>
            </div>
            <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.12)", marginTop: 10, overflow: "hidden" }}>
              <div style={{ width: `${pack * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.pink}, ${C.yellow})` }} />
            </div>
          </Panel>
        </div>
      )}
      {f >= tSel && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 940, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.cyan, opacity: ease(f, tSel + 10, tSel + 20) }}>منطقة قراءة النص</div>
      )}
      {f >= tPress - 4 && (
        <div style={{ position: "absolute", left: 0, right: 100, top: 1060, display: "flex", justifyContent: "center", scale: String(btn) }}>
          <div dir="ltr" style={{ padding: "18px 50px 22px", borderRadius: 18, background: pressed ? C.cyan : C.pink, boxShadow: neon(pressed ? C.cyan : C.pink, 0.8), fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#12002a", scale: f >= tPress + 4 && f < tPress + 10 ? "0.92" : "1" }}>
            ▶ Start Translation
          </div>
        </div>
      )}
      <Sfx name="click" at={tLang - 4} />
      <Sfx name="check" at={tPack + 50} />
      <Sfx name="riser" at={tSel - 6} gain={0.5} />
      <Sfx name="check" at={tSel + 24} />
      <Sfx name="click" at={tPress + 4} />
      <Sfx name="check" at={tPress + 16} />
    </Frame>
  );
};

const I6: React.FC = () => {
  const s = getG("I6-Win");
  const tPass = cue(s, "تمت");
  const pass = usePop(tPass - 4, 160, 10);
  return (
    <Frame id="I6-Win" dim={0.3}>
      <Tv arabic={1} style={{ left: 100, top: 300 }} />
      <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 980, textAlign: "center", scale: String(0.6 + 0.4 * pass), opacity: Math.min(1, pass * 1.4) }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 150, color: C.yellow, textShadow: neon(C.orange, 1.3), lineHeight: 1.05 }}>تمت المهمة!</div>
        <div style={{ fontFamily: LAT, fontSize: 40, color: "#fff", textShadow: neon(C.pink, 0.6), marginTop: 6 }}>+ ARABIC</div>
      </div>
      <Sfx name="pass" at={tPass - 4} />
    </Frame>
  );
};

const I7: React.FC = () => {
  const s = getG("I7-Note");
  const f = useCurrentFrame();
  const tA = cue(s, "جديدة");
  const tB = cue(s, "والفضل");
  const a = usePop(tA - 4, 200, 14);
  const b = usePop(tB - 4, 200, 14);
  return (
    <Frame id="I7-Note" dim={0.5}>
      <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 360, display: "flex", flexDirection: "column", gap: 30 }}>
        {f >= tA - 4 && (
          <Panel color={C.yellow} style={{ padding: "26px 28px", scale: String(a), opacity: Math.min(1, a * 1.4) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Icon d={IC.alert} size={54} color={C.yellow} />
              <div style={{ fontFamily: DISPLAY, fontSize: 54, color: "#fff" }}>الحزمة العربية جديدة</div>
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "rgba(255,255,255,0.85)", marginTop: 10 }}>ممكن تلقى فيها نقص أو أخطاء… والأداة تتحدّث تلقائياً.</div>
          </Panel>
        )}
        {f >= tB - 4 && (
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
      <Sfx name="glitch" at={tA - 4} gain={0.6} />
      <Sfx name="check" at={tB - 4} />
    </Frame>
  );
};

const I8: React.FC = () => {
  const s = getG("I8-CTA");
  const f = useCurrentFrame();
  const tF = cue(s, "تابعنا");
  const logo = usePop(4, 150, 12);
  const btn = usePop(tF - 4, 220, 11);
  const tapped = f >= tF + 16;
  return (
    <Frame id="I8-CTA" dim={0.45} subsTop={1560}>
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
  { id: "I1-Hook", C: I1 },
  { id: "I2-Gear", C: I2 },
  { id: "I3-Get", C: I3 },
  { id: "I4-Link", C: I4 },
  { id: "I5-Arabic", C: I5 },
  { id: "I6-Win", C: I6 },
  { id: "I7-Note", C: I7 },
  { id: "I8-CTA", C: I8 },
];

export const GtaInstall: React.FC = () => (
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
    {iTimeline.audio?.music && (
      <Audio
        src={staticFile("audio/gta3/music/neon.mp3")}
        loop
        volume={(f) => {
          const end = iTimeline.durationInFrames;
          const inVoice = iTimeline.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 4);
          const fd = interpolate(f, [0, 8, end - 40, end], [0, 1, 1, 0], clamp);
          return (inVoice ? db(-21) : db(-15)) * fd;
        }}
      />
    )}
  </AbsoluteFill>
);

/** Thumbnail / cover (1080×1920): readable at small size, key text in the centre safe area. */
export const GtaInstallThumb: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <World dim={0.15} />
    <Tv arabic={1} subBig={0.3} style={{ left: 100, top: 360 }} />
    <div dir="rtl" style={{ position: "absolute", left: 40, right: 40, top: 960, textAlign: "center" }}>
      <div dir="ltr" style={{ fontFamily: LAT, fontSize: 190, color: C.yellow, textShadow: neon(C.orange, 1.4), lineHeight: 1 }}>GTA 6</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 150, color: "#fff", textShadow: neon(C.pink, 1.5), lineHeight: 1.15, marginTop: 10 }}>صارت بالعربي!</div>
      <div style={{ display: "inline-block", marginTop: 26, padding: "10px 40px 18px", borderRadius: 999, background: C.cyan, boxShadow: neon(C.cyan, 1), fontFamily: DISPLAY, fontSize: 64, color: "#12002a" }}>مجاناً · خطوة بخطوة</div>
    </div>
    <div style={{ position: "absolute", left: 60, top: 140, width: 150, height: 150, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", boxShadow: neon(C.pink, 0.8) }}>
      <Img src={staticFile("brand/logo-color.png")} style={{ width: 124 }} />
    </div>
    <Retro />
  </AbsoluteFill>
);
