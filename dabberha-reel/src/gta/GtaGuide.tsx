import { loadFont as loadLalezar } from "@remotion/google-fonts/Lalezar";
import { loadFont as loadCairo } from "@remotion/google-fonts/Cairo";
import { loadFont as loadAudiowide } from "@remotion/google-fonts/Audiowide";
import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/gta-timeline.json";
import { createSound } from "../components/Sound";
import { cue, findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { db } from "../theme";

/**
 * Arabic-subtitles-for-GTA-6 guide (the free GameTranslator tool by Sefflex), told as game levels.
 * Neon night-city look (sunset gradient, palms, moving grid). The "game" on the TV is a drawn illustration,
 * not a screenshot, and no publisher logo or artwork is used.
 */
const DISPLAY = loadLalezar("normal", { weights: ["400"], subsets: ["arabic"] }).fontFamily;
const SANS = loadCairo("normal", { weights: ["600", "700", "800"], subsets: ["arabic", "latin"] }).fontFamily;
const LAT = loadAudiowide("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;

const C = { night: "#12002a", pink: "#ff2e88", orange: "#ff8a3d", yellow: "#ffd23f", cyan: "#2de2e6", purple: "#7a2bff", ink: "#ffffff" };

type GId = "G1-Hook" | "G2-Idea" | "G3-Gear" | "G4-Get" | "G5-Setup" | "G6-Go" | "G7-Note" | "G8-CTA";
export const gTimeline = data as TimelineData;
const getG = (id: GId) => findScene(gTimeline, id);
const { Sfx, SceneVoice } = createSound(gTimeline, "audio/gta", {
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
const Tv: React.FC<{ arabic: number; select?: number; scan?: number; style?: React.CSSProperties }> = ({ arabic, select = 0, scan = -1, style }) => {
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
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#fff", textShadow: "0 2px 6px #000" }}>We need to get out of here, now.</div>
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

// ------------------------------------------------------------ scenes
const G1: React.FC = () => {
  const s = getG("G1-Hook");
  const f = useCurrentFrame();
  const tAr = cue(s, "بترجمة");
  const tTool = cue(s, "أداة");
  const ar = ease(f, tAr, tAr + 12);
  const glitch = f >= tAr - 2 && f < tAr + 6;
  const title = usePop(tTool - 4, 180, 12);
  const tv = usePop(2, 160, 16);
  return (
    <Frame id="G1-Hook" dim={0.2}>
      <Tv arabic={ar} style={{ left: 100, top: 360, scale: String(0.85 + 0.15 * tv), opacity: Math.min(1, tv * 1.4), filter: glitch ? `drop-shadow(6px 0 0 ${C.cyan}) drop-shadow(-6px 0 0 ${C.pink})` : undefined }} />
      {f >= tTool - 4 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 1010, textAlign: "center", scale: String(title) }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 120, color: "#fff", textShadow: neon(C.pink, 1.3), lineHeight: 1.1 }}>
            تعريب <span dir="ltr" style={{ fontFamily: LAT, fontSize: 104, color: C.yellow, textShadow: neon(C.orange, 1) }}>GTA 6</span>
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 54, color: C.cyan, textShadow: neon(C.cyan, 0.7), marginTop: 6 }}>مجاني · خطوة بخطوة</div>
        </div>
      )}
      <Sfx name="glitch" at={tAr - 2} />
      <Sfx name="impact" at={tTool - 4} />
    </Frame>
  );
};

const G2: React.FC = () => {
  const s = getG("G2-Idea");
  const f = useCurrentFrame();
  const t = (w: string) => cue(s, w);
  const con = usePop(t("جهازك") - 4);
  const tvp = usePop(t("بالتلفزيون") - 4);
  const pc = usePop(t("وكمبيوترك") - 4);
  const wifi = ease(f, t("الواي") - 4, t("الواي") + 10);
  const scan = f >= t("يقرأ") ? ((f - t("يقرأ")) % 40) / 40 : -1;
  const tr = ease(f, t("ويترجمه") - 2, t("ويترجمه") + 10);
  const ar = ease(f, t("ويطلّعه"), t("ويطلّعه") + 12);
  return (
    <Frame id="G2-Idea">
      <Tv arabic={ar} scan={f < t("ويترجمه") ? scan : -1} style={{ left: 100, top: 260, scale: String(0.8 + 0.2 * tvp), opacity: Math.min(1, tvp * 1.4) }} />
      {/* console + HDMI */}
      <div style={{ position: "absolute", left: 120, top: 940, scale: String(con), display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <Panel style={{ padding: 20 }} color={C.pink}>
          <Icon d={IC.pad} size={90} />
        </Panel>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, color: "#fff" }}>جهازك</div>
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d="M200 935 C 200 880, 240 860, 300 830" stroke={C.pink} strokeWidth="6" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, t("موصول"), t("موصول") + 14)} />
        <text x="185" y="880" fontFamily={LAT} fontSize="24" fill={C.pink} opacity={ease(f, t("موصول"), t("موصول") + 10)}>HDMI</text>
      </svg>
      {/* pc / phone + wifi */}
      <div style={{ position: "absolute", left: 690, top: 940, scale: String(pc), display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <Panel style={{ padding: 20, display: "flex", gap: 10 }}>
          <Icon d={IC.pc} size={70} />
          <Icon d={IC.phone} size={70} />
        </Panel>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, color: "#fff" }}>كمبيوتر أو جوال</div>
      </div>
      <div style={{ position: "absolute", left: 590, top: 860, opacity: wifi, scale: String(0.6 + 0.4 * wifi) }}>
        <Icon d={IC.wifi} size={90} color={C.cyan} />
      </div>
      {tr > 0 && (
        <div dir="ltr" style={{ position: "absolute", left: 330, top: 1180, display: "flex", alignItems: "center", gap: 14, opacity: tr, scale: String(0.7 + 0.3 * tr) }}>
          <Panel style={{ padding: "8px 20px", fontFamily: LAT, fontSize: 36, color: "#fff" }}>EN</Panel>
          <div style={{ fontFamily: LAT, fontSize: 40, color: C.yellow }}>→</div>
          <Panel style={{ padding: "6px 20px 10px", fontFamily: DISPLAY, fontSize: 40, color: C.yellow }} color={C.yellow}>
            عربي
          </Panel>
        </div>
      )}
      <Sfx name="click" at={t("جهازك") - 4} />
      <Sfx name="click" at={t("وكمبيوترك") - 4} />
      <Sfx name="type" at={t("يقرأ")} gain={0.6} />
      <Sfx name="glitch" at={t("ويترجمه")} gain={0.6} />
      <Sfx name="check" at={t("ويطلّعه")} />
    </Frame>
  );
};

const G3: React.FC = () => {
  const s = getG("G3-Gear");
  const f = useCurrentFrame();
  const slots: { at: string; icons: string[][]; l: string }[] = [
    { at: "بلايستيشن", icons: [IC.pad], l: "بلايستيشن ٥ أو إكس بوكس" },
    { at: "وتلفزيون", icons: [IC.tv], l: "تلفزيون ذكي أو جوال كشاشة ثانية" },
    { at: "وكمبيوتر", icons: [IC.pc, IC.phone], l: "كمبيوتر أو جوال أندرويد" },
    { at: "وكلها", icons: [IC.wifi], l: "نفس الواي فاي" },
  ];
  return (
    <Frame id="G3-Gear">
      <Hud level={1} title="التجهيز" />
      <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 330, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {slots.map((sl, i) => {
          const at = cue(s, sl.at) - 4;
          const p = usePop(at, 240, 12);
          const on = f >= at;
          return (
            <Panel key={sl.l} color={on ? C.cyan : "rgba(255,255,255,0.25)"} style={{ height: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 18, boxShadow: on ? undefined : "none" }}>
              <div style={{ display: "flex", gap: 12, scale: String(on ? p : 0.001) }}>
                {sl.icons.map((d, k) => (
                  <Icon key={k} d={d} size={110} />
                ))}
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#fff", textAlign: "center", opacity: on ? 1 : 0.3, lineHeight: 1.3 }}>{sl.l}</div>
              {on && <div style={{ position: "absolute", marginTop: -330, marginRight: -330, width: 46, height: 46, borderRadius: 23, background: C.yellow, display: "grid", placeItems: "center", scale: String(p) }}><Icon d={IC.check} size={30} color="#12002a" /></div>}
              <div style={{ position: "absolute", marginTop: 300, fontFamily: LAT, fontSize: 20, color: C.cyan, opacity: on ? 0 : 0.6 }}>{i + 1}</div>
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

const G4: React.FC = () => {
  const s = getG("G4-Get");
  const f = useCurrentFrame();
  const tPage = cue(s, "صفحة");
  const tDl = cue(s, "حمّل");
  const tTv = cue(s, "وتطبيق");
  const tWarn = cue(s, "ولا");
  const page = usePop(tPage - 4, 170, 16);
  const dl = interpolate(f, [tDl, tDl + 50], [0, 1], clamp);
  const warn = usePop(tWarn - 2, 220, 12);
  return (
    <Frame id="G4-Get">
      <Hud level={2} title="التحميل" />
      {f >= tPage - 4 && (
        <div style={{ position: "absolute", left: 80, right: 140, top: 340, opacity: Math.min(1, page * 1.4), translate: `0px ${(1 - page) * 40}px` }}>
          <Panel style={{ padding: 0, overflow: "hidden" }}>
            <div dir="ltr" style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "rgba(255,255,255,0.06)" }}>
              {[C.pink, C.yellow, C.cyan].map((c) => (
                <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
              ))}
              <div style={{ marginLeft: 10, flex: 1, padding: "6px 14px", borderRadius: 999, background: "rgba(0,0,0,0.4)", fontFamily: SANS, fontWeight: 600, fontSize: 22, color: "#fff" }}>gitlab.com/sefflex/GameTranslator/-/releases</div>
            </div>
            <div dir="rtl" style={{ padding: "24px 26px 30px" }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 46, color: "#fff" }}>صفحة الإصدارات الرسمية</div>
              {[
                { at: tDl, name: "GameTranslator-win-Setup.exe", l: "نسخة الكمبيوتر", p: dl },
                { at: tTv, name: "TV App (.apk)", l: "تطبيق التلفزيون", p: interpolate(f, [tTv, tTv + 40], [0, 1], clamp) },
              ].map((r) => (
                <div key={r.name} style={{ marginTop: 22, opacity: ease(f, r.at - 4, r.at + 6) }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Icon d={r.p >= 1 ? IC.check : IC.down} size={40} color={r.p >= 1 ? C.yellow : C.cyan} />
                    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff" }}>{r.l}</div>
                    <div dir="ltr" style={{ marginRight: "auto", fontFamily: SANS, fontWeight: 600, fontSize: 20, color: "rgba(255,255,255,0.6)" }}>{r.name}</div>
                  </div>
                  <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.12)", marginTop: 10, overflow: "hidden" }}>
                    <div style={{ width: `${r.p * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.pink}, ${C.yellow})` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
      {f >= tWarn - 2 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 1100, display: "flex", justifyContent: "center", scale: String(warn) }}>
          <Panel color={C.yellow} style={{ padding: "16px 30px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <Icon d={IC.alert} size={48} color={C.yellow} />
            <div style={{ fontFamily: DISPLAY, fontSize: 46, color: "#fff" }}>من الصفحة الرسمية بس</div>
          </Panel>
        </div>
      )}
      <Sfx name="click" at={tDl} />
      <Sfx name="check" at={tDl + 50} />
      <Sfx name="check" at={tTv + 40} />
      <Sfx name="glitch" at={tWarn - 2} gain={0.7} />
    </Frame>
  );
};

const G5: React.FC = () => {
  const s = getG("G5-Setup");
  const f = useCurrentFrame();
  const tSel = cue(s, "وحدد");
  const tLang = cue(s, "واختر");
  const sel = ease(f, tSel, tSel + 24);
  const lang = usePop(tLang - 4, 220, 13);
  const tv = usePop(cue(s, "شغّل") - 4, 170, 16);
  return (
    <Frame id="G5-Setup">
      <Hud level={3} title="الإعدادات" />
      <Tv arabic={0} select={sel} style={{ left: 100, top: 330, scale: String(0.85 + 0.15 * tv), opacity: Math.min(1, tv * 1.4) }} />
      {f >= tSel && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 960, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.cyan, opacity: ease(f, tSel + 10, tSel + 20) }}>
          منطقة قراءة النص
        </div>
      )}
      {f >= tLang - 4 && (
        <div dir="rtl" style={{ position: "absolute", left: 220, right: 280, top: 1060, scale: String(lang) }}>
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
      <Sfx name="click" at={cue(s, "وافتح")} />
      <Sfx name="riser" at={tSel - 6} gain={0.5} />
      <Sfx name="check" at={tSel + 24} />
      <Sfx name="click" at={tLang - 4} />
    </Frame>
  );
};

const G6: React.FC = () => {
  const s = getG("G6-Go");
  const f = useCurrentFrame();
  const tPress = cue(s, "اضغط");
  const tShow = cue(s, "وتطلع");
  const tPass = cue(s, "تمت");
  const pressed = f >= tPress + 10;
  const ar = ease(f, tShow, tShow + 12);
  const pass = usePop(tPass - 4, 160, 10);
  return (
    <Frame id="G6-Go">
      <Hud level={4} title="التشغيل" />
      <Tv arabic={ar} style={{ left: 100, top: 330 }} />
      {f < tPass - 4 && (
        <div style={{ position: "absolute", left: 0, right: 100, top: 1000, display: "flex", justifyContent: "center" }}>
          <div dir="ltr" style={{ padding: "18px 50px 22px", borderRadius: 18, background: pressed ? C.cyan : C.pink, boxShadow: neon(pressed ? C.cyan : C.pink, 0.8), fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#12002a", scale: f >= tPress && f < tPress + 10 ? "0.92" : "1" }}>
            ▶ Start Translation
          </div>
        </div>
      )}
      {f >= tPass - 4 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 960, textAlign: "center", scale: String(0.6 + 0.4 * pass), opacity: Math.min(1, pass * 1.4) }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 150, color: C.yellow, textShadow: neon(C.orange, 1.3), lineHeight: 1.05 }}>تمت المهمة!</div>
          <div style={{ fontFamily: LAT, fontSize: 40, color: "#fff", textShadow: neon(C.pink, 0.6), marginTop: 6 }}>+ ARABIC</div>
        </div>
      )}
      <Sfx name="click" at={tPress + 4} />
      <Sfx name="check" at={tShow} />
      <Sfx name="pass" at={tPass - 4} />
    </Frame>
  );
};

const G7: React.FC = () => {
  const s = getG("G7-Note");
  const a = usePop(cue(s, "الترجمة") - 4, 200, 14);
  const b = usePop(cue(s, "والفضل") - 4, 200, 14);
  const f = useCurrentFrame();
  return (
    <Frame id="G7-Note" dim={0.5}>
      <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 360, display: "flex", flexDirection: "column", gap: 30 }}>
        {f >= cue(s, "الترجمة") - 4 && (
          <Panel color={C.yellow} style={{ padding: "26px 28px", scale: String(a), opacity: Math.min(1, a * 1.4) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Icon d={IC.alert} size={54} color={C.yellow} />
              <div style={{ fontFamily: DISPLAY, fontSize: 54, color: "#fff" }}>ترجمة فورية بالذكاء الاصطناعي</div>
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

const G8: React.FC = () => {
  const s = getG("G8-CTA");
  const f = useCurrentFrame();
  const tF = cue(s, "تابعنا");
  const logo = usePop(4, 150, 12);
  const btn = usePop(tF - 4, 220, 11);
  const tapped = f >= tF + 16;
  return (
    <Frame id="G8-CTA" dim={0.45} subsTop={1560}>
      <div style={{ position: "absolute", left: 540 - 50 - 200, top: 380, width: 400, height: 400, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", scale: String(logo), boxShadow: neon(C.pink, 1.2) }}>
        <Img src={staticFile("brand/logo-color.png")} style={{ width: 330 }} />
      </div>
      <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 840, textAlign: "center", fontFamily: DISPLAY, fontSize: 64, color: "#fff", textShadow: neon(C.purple, 1), opacity: ease(f, 10, 24) }}>
        مهتم بهالنوع من المحتوى؟
      </div>
      {f >= tF - 4 && (
        <div style={{ position: "absolute", left: 0, right: 100, top: 1000, display: "flex", justifyContent: "center", scale: String(btn) }}>
          <div dir="rtl" style={{ padding: "20px 70px 28px", borderRadius: 999, background: tapped ? C.cyan : C.pink, boxShadow: neon(tapped ? C.cyan : C.pink, 1), fontFamily: DISPLAY, fontSize: 72, color: "#12002a" }}>{tapped ? "✓ تابعتنا" : "+ تابعنا"}</div>
        </div>
      )}
      <Sfx name="riser" at={tF - 40} gain={0.6} />
      <Sfx name="impact" at={tF - 4} />
      <Sfx name="check" at={tF + 16} />
    </Frame>
  );
};

const SCENES: { id: GId; C: React.FC }[] = [
  { id: "G1-Hook", C: G1 },
  { id: "G2-Idea", C: G2 },
  { id: "G3-Gear", C: G3 },
  { id: "G4-Get", C: G4 },
  { id: "G5-Setup", C: G5 },
  { id: "G6-Go", C: G6 },
  { id: "G7-Note", C: G7 },
  { id: "G8-CTA", C: G8 },
];

export const GtaGuide: React.FC = () => (
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
    {gTimeline.audio?.music && (
      <Audio
        src={staticFile("audio/gta/music/neon.mp3")}
        loop
        volume={(f) => {
          const end = gTimeline.durationInFrames;
          const inVoice = gTimeline.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 4);
          const fd = interpolate(f, [0, 8, end - 40, end], [0, 1, 1, 0], clamp);
          return (inVoice ? db(-21) : db(-15)) * fd;
        }}
      />
    )}
  </AbsoluteFill>
);
