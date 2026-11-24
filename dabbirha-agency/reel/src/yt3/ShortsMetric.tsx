import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansArabic";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/yt3-timeline.json";
import { createSound } from "../components/Sound";
import { cue, findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { tutGains } from "../tutorial/base";
import { db } from "../theme";

/**
 * «الرقم اللي يقرر مصير الشورت» — a variation on the YouTube-film look (src/yt): same dark platform feel,
 * red accent, chapter bar and word-synced captions, but with a vertical Shorts backdrop, a blue data accent,
 * underline-sweep captions and one visual idea per scene. No platform logos; screens are illustrations.
 */
const SANS = loadPlex("normal", { weights: ["400", "500", "600", "700"], subsets: ["arabic", "latin"] }).fontFamily;
const MONO = loadMono("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily;

const Q = {
  bg: "#0B0B0F",
  card: "#16161C",
  card2: "#1E1E26",
  border: "#2C2C36",
  ink: "#F4F4F6",
  ink2: "#A3A3AD",
  muted: "#6E6E78",
  red: "#FF0033",
  redSoft: "rgba(255,0,51,0.16)",
  blue: "#3DA9FC",
  blueSoft: "rgba(61,169,252,0.16)",
  green: "#2BD47D",
};

type SId = "S1-Hook" | "S2-Where" | "S3-Meaning" | "S4-Good" | "S5-Fix" | "S6-Loop" | "S7-CTA";
export const sTimeline = data as TimelineData;
const getS = (id: SId) => findScene(sTimeline, id);
const { Sfx, SceneVoice } = createSound(sTimeline, "audio/yt3", tutGains);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
const usePop = (at: number, stiffness = 190, damping = 14, mass = 0.7) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping, stiffness, mass } });
};
const AR = "٠١٢٣٤٥٦٧٨٩";
const ar = (n: number | string) => String(n).replace(/\d/g, (d) => AR[Number(d)]);

const ICON: Record<string, string[]> = {
  play: ["M9 7.5l8 4.5-8 4.5z"],
  search: ["M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14z", "M16 16l4.5 4.5"],
  image: ["M4 5h16v14H4z", "M4 16l5-5 4 4 3-3 4 4", "M15.5 8.5h.01"],
  mic: ["M12 3.5a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0v-5a3 3 0 0 1 3-3z", "M6 11a6 6 0 0 0 12 0", "M12 17v3.5"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  x: ["M6 6l12 12", "M18 6L6 18"],
  up: ["M12 19V5", "M6 11l6-6 6 6"],
  down: ["M12 5v14", "M6 13l6 6 6-6"],
  lock: ["M7 11V8a5 5 0 0 1 10 0v3", "M5 11h14v9H5z"],
  rewind: ["M11 7l-6 5 6 5z", "M19 7l-6 5 6 5z"],
  refresh: ["M4 9a8 8 0 0 1 14-3l2 2", "M20 4v4h-4", "M20 15a8 8 0 0 1-14 3l-2-2", "M4 20v-4h4"],
  hand: ["M8 13V6.5a1.5 1.5 0 0 1 3 0V12", "M11 11.5V5a1.5 1.5 0 0 1 3 0v6.5", "M14 11.5V6.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6 7-2.5 0-4-1.2-5.2-3.2L4 14.5a1.5 1.5 0 0 1 2.4-1.8L8 14.5"],
};
const Line: React.FC<{ n: string; size?: number; color?: string; w?: number }> = ({ n, size = 48, color = Q.ink, w = 1.9 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    {ICON[n].map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
);

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; glow?: string }> = ({ children, style, glow }) => (
  <div style={{ borderRadius: 28, background: Q.card, border: `1.5px solid ${glow ?? Q.border}`, boxShadow: `0 24px 60px rgba(0,0,0,0.5)${glow ? `, 0 0 30px ${glow}55` : ""}`, ...style }}>{children}</div>
);

// ------------------------------------------------------------ world
/** Dark studio with vertical Shorts tiles drifting up in three columns, a red and a blue glow. */
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 16;
  return (
    <AbsoluteFill style={{ background: Q.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 200 + Math.sin(t / 5) * 180 - 560, top: 300 + Math.cos(t / 6) * 140 - 560, width: 1120, height: 1120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,0,51,0.14) 0%, rgba(255,0,51,0) 65%)" }} />
      <div style={{ position: "absolute", left: 900 + Math.cos(t / 7) * 160 - 600, top: 1500 + Math.sin(t / 5) * 140 - 600, width: 1200, height: 1200, borderRadius: "50%", background: "radial-gradient(circle, rgba(61,169,252,0.12) 0%, rgba(61,169,252,0) 65%)" }} />
      {[0, 1, 2, 3].map((col) =>
        Array.from({ length: 4 }).map((_, row) => {
          const speed = 0.5 + col * 0.18;
          const y = ((row * 560 - f * speed + col * 170) % 2240 + 2240) % 2240 - 320;
          return <div key={`${col}-${row}`} style={{ position: "absolute", left: 30 + col * 270, top: y, width: 230, height: 410, borderRadius: 22, border: "1.5px solid rgba(255,255,255,0.045)", background: "rgba(255,255,255,0.012)" }} />;
        }),
      )}
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.65) 100%)" }} />
    </AbsoluteFill>
  );
};

const CHAPTERS: Record<SId, string> = {
  "S1-Hook": "المقدمة",
  "S2-Where": "المكان",
  "S3-Meaning": "المعنى",
  "S4-Good": "المقارنة",
  "S5-Fix": "الحل",
  "S6-Loop": "لاحظت؟",
  "S7-CTA": "الختام",
};

/** Story-style segments across the top (one per scene), the current chapter and the time. */
const Segments: React.FC = () => {
  const f = useCurrentFrame();
  const total = sTimeline.durationInFrames;
  const sc = sTimeline.scenes;
  const now = [...sc].reverse().find((s) => f >= s.from) ?? sc[0];
  if (f === 0) return null; // the cover frame stays clean
  const mm = (x: number) => {
    const s = Math.floor(x / 30);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  return (
    <>
      <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 128, display: "flex", gap: 8 }}>
        {sc.map((s, i) => {
          const end = i < sc.length - 1 ? sc[i + 1].from : total;
          const fill = Math.max(0, Math.min(1, (f - s.from) / Math.max(1, end - s.from)));
          return (
            <div key={s.id} style={{ flex: end - s.from, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.2)", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: s.id === now.id ? Q.red : Q.ink }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 80, right: 140, top: 150, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: SANS, fontSize: 26, color: Q.ink2 }}>
        <div dir="ltr" style={{ fontFamily: MONO }}>
          {mm(f)} / {mm(total)}
        </div>
        <div dir="rtl" style={{ fontWeight: 700, color: Q.ink }}>{CHAPTERS[now.id as SId]}</div>
      </div>
    </>
  );
};

/** Spoken words a phrase at a time; the word being said turns white and a red underline sweeps under it. */
const Words: React.FC<{ scene: SceneTiming; top: number; size?: number }> = ({ scene, top, size = 58 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const merged: Word[] = [];
  for (const w of scene.words) {
    const prev = merged[merged.length - 1];
    if (prev && /^[A-Za-z0-9. ]+$/.test(prev.text) && /^[A-Za-z0-9.]+$/.test(w.text)) {
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
  const p = spring({ frame: frame - (chunk[0].start - 3), fps, config: { damping: 13, stiffness: 300, mass: 0.5 } });
  return (
    <div dir="rtl" style={{ position: "absolute", top, left: 80, right: 140, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", columnGap: "0.3em", rowGap: 4, fontFamily: SANS, fontWeight: 700, fontSize: size, lineHeight: 1.5, opacity: p, translate: `0px ${(1 - p) * 26}px` }}>
      {chunk.map((w, i) => {
        const on = frame >= w.start - 3;
        const active = on && (i === chunk.length - 1 || frame < chunk[i + 1].start - 3);
        const under = active ? ease(frame, w.start - 3, w.start + 5) : on ? 1 : 0;
        const latin = /[A-Za-z]/.test(w.text);
        return (
          <span key={`${idx}-${i}`} dir={latin ? "ltr" : "rtl"} style={{ position: "relative", color: active ? "#fff" : on ? Q.ink2 : "rgba(255,255,255,0.25)", unicodeBidi: "isolate", textShadow: "0 4px 18px rgba(0,0,0,0.7)" }}>
            {(w.raw ?? w.text).replace(/[«»]/g, "")}
            <span style={{ position: "absolute", right: 0, bottom: 4, height: 6, borderRadius: 3, width: `${under * 100}%`, background: active ? Q.red : "rgba(255,0,51,0.35)" }} />
          </span>
        );
      })}
    </div>
  );
};

const Frame: React.FC<{ id: SId; children: React.ReactNode; wordsTop?: number }> = ({ id, children, wordsTop = 1260 }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scene = getS(id);
  const inP = interpolate(f, [0, 8], [0, 1], clamp);
  const outP = interpolate(f, [durationInFrames - 8, durationInFrames], [1, 0], clamp);
  const push = interpolate(f, [0, durationInFrames], [1, 1.03]);
  return (
    <AbsoluteFill style={{ fontFamily: SANS, color: Q.ink }}>
      <AbsoluteFill style={{ opacity: inP * (0.35 + 0.65 * outP), scale: String(push * (0.95 + 0.05 * inP)), transformOrigin: "50% 40%" }}>{children}</AbsoluteFill>
      <Words scene={scene} top={wordsTop} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={0} gain={0.8} />
    </AbsoluteFill>
  );
};

/** A Shorts-style phone (illustration). */
const Phone: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; swipe?: number }> = ({ style, children, swipe = 0 }) => (
  <div style={{ position: "absolute", width: 440, height: 800, borderRadius: 54, background: "#000", border: "10px solid #23232b", boxShadow: "0 40px 90px rgba(0,0,0,0.6)", overflow: "hidden", ...style }}>
    <div style={{ position: "absolute", inset: 0, translate: `0px ${-swipe * 100}%` }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #2a0710 0%, #121218 55%, #0b1a2a 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "100%", height: "100%", background: "linear-gradient(160deg, #102030 0%, #121218 60%, #2a0710 100%)" }} />
    </div>
    {children}
    <div style={{ position: "absolute", right: 18, bottom: 140, display: "flex", flexDirection: "column", gap: 26 }}>
      {[0, 1, 2].map((k) => (
        <div key={k} style={{ width: 52, height: 52, borderRadius: 26, background: "rgba(255,255,255,0.12)" }} />
      ))}
    </div>
    <div style={{ position: "absolute", left: 24, right: 90, bottom: 40, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.18)" }} />
    <div style={{ position: "absolute", left: 24, width: 170, bottom: 66, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.28)" }} />
  </div>
);

// ------------------------------------------------------------ cover (frame 0 only — TikTok picks the first frame)
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: Q.bg }}>
    <Backdrop />
    <div dir="rtl" style={{ position: "absolute", left: 60, right: 60, top: 420, textAlign: "center", fontFamily: SANS }}>
      <div style={{ fontWeight: 700, fontSize: 300, lineHeight: 1, color: Q.blue, textShadow: `0 0 60px ${Q.blue}88` }}>؟٪</div>
      <div style={{ fontWeight: 700, fontSize: 130, color: "#fff", marginTop: 40, lineHeight: 1.15 }}>رقم واحد</div>
      <div style={{ display: "inline-block", marginTop: 26, padding: "8px 40px 22px", borderRadius: 26, background: Q.red, fontWeight: 700, fontSize: 92, color: "#fff", boxShadow: "0 20px 60px rgba(255,0,51,0.45)" }}>يقرر مصير الشورت</div>
      <div style={{ fontWeight: 600, fontSize: 46, color: Q.ink2, marginTop: 40 }}>وأغلب الناس ما يعرفون مكانه</div>
    </div>
    <div style={{ position: "absolute", left: 60, top: 140, width: 140, height: 140, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center" }}>
      <Img src={staticFile("brand/logo-color.png")} style={{ width: 116 }} />
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ scenes
const S1: React.FC = () => {
  const s = getS("S1-Hook");
  const f = useCurrentFrame();
  const tNum = cue(s, "رقم");
  const tDec = cue(s, "يقرر");
  const tWhere = cue(s, "مكانه");
  const phone = usePop(2, 170, 16);
  const num = usePop(tNum - 2, 230, 10);
  const fate = usePop(tDec, 210, 13);
  const pulse = 1 + Math.sin(f / 5) * 0.03;
  const dim = ease(f, tWhere - 4, tWhere + 10);
  const lensX = interpolate(f, [tWhere - 4, tWhere + 30], [-120, 120], clamp);
  if (f === 0) return <Cover />;
  return (
    <Frame id="S1-Hook" wordsTop={1240}>
      <Phone swipe={ease(f, 8, 22) * 0} style={{ left: 300, top: 260, scale: String(0.85 + 0.15 * phone), opacity: Math.min(1, phone * 1.4) * (1 - dim * 0.5) }}>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 170, color: Q.blue, scale: String(num * pulse), opacity: Math.min(1, num * 1.5), textShadow: `0 0 50px ${Q.blue}99` }}>؟٪</div>
        </div>
      </Phone>
      {f >= tDec && (
        <>
          <div style={{ position: "absolute", left: 790, top: 520, scale: String(fate), display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ width: 96, height: 96, borderRadius: 48, background: "rgba(43,212,125,0.16)", border: `2px solid ${Q.green}`, display: "grid", placeItems: "center" }}>
              <Line n="up" size={54} color={Q.green} w={2.6} />
            </div>
            <div dir="rtl" style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: Q.green }}>ينتشر</div>
          </div>
          <div style={{ position: "absolute", left: 120, top: 720, scale: String(fate), display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ width: 96, height: 96, borderRadius: 48, background: Q.redSoft, border: `2px solid ${Q.red}`, display: "grid", placeItems: "center" }}>
              <Line n="down" size={54} color={Q.red} w={2.6} />
            </div>
            <div dir="rtl" style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: Q.red }}>يموت</div>
          </div>
        </>
      )}
      {dim > 0 && (
        <div style={{ position: "absolute", left: 470 + lensX, top: 560, opacity: dim }}>
          <Line n="search" size={150} color="#fff" w={1.6} />
        </div>
      )}
      <Sfx name="pop" at={2} />
      <Sfx name="impact" at={tNum - 2} gain={0.8} />
      <Sfx name="ding" at={tDec} gain={0.7} />
      <Sfx name="swish" at={tWhere - 4} />
    </Frame>
  );
};

const S2: React.FC = () => {
  const s = getS("S2-Where");
  const f = useCurrentFrame();
  const tOpen = cue(s, "تحليلات");
  const tScan = cue(s, "ودوّر");
  const tName = cue(s, "Viewed");
  const tAr = cue(s, "شاهدوا");
  const card = usePop(tOpen - 4, 180, 16);
  const scanY = interpolate(f, [tScan, tName - 2], [0, 2], clamp);
  const hit = ease(f, tName - 2, tName + 8);
  const chip = usePop(tAr - 2, 230, 12);
  const rows = [
    { l: "المشاهدات", v: "١٢٫٤ ألف" },
    { l: "متوسط مدة المشاهدة", v: "٠:٢١" },
    { l: "Viewed vs. swiped away", v: "٦٨٪", key: true },
  ];
  return (
    <Frame id="S2-Where">
      {f >= tOpen - 4 && (
        <div style={{ position: "absolute", left: 80, right: 140, top: 290, scale: String(0.9 + 0.1 * card), opacity: Math.min(1, card * 1.4) }}>
          <Card style={{ padding: "26px 30px 30px" }}>
            <div dir="rtl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 42 }}>تحليلات الشورت</div>
              <div style={{ fontSize: 22, color: Q.muted }}>رسم توضيحي · مثال</div>
            </div>
            <div dir="rtl" style={{ display: "flex", gap: 12, marginTop: 18 }}>
              {["نظرة عامة", "الوصول", "التفاعل", "الجمهور"].map((t, i) => (
                <div key={t} style={{ padding: "8px 18px 12px", borderRadius: 999, background: i === 0 ? Q.ink : Q.card2, color: i === 0 ? Q.bg : Q.ink2, fontWeight: 600, fontSize: 24 }}>{t}</div>
              ))}
            </div>
            <div style={{ position: "relative", marginTop: 22 }}>
              {rows.map((r, i) => {
                const isKey = !!r.key;
                return (
                  <div key={r.l} dir="rtl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px", marginTop: i ? 12 : 0, borderRadius: 18, background: isKey && hit > 0 ? Q.redSoft : Q.card2, border: `2px solid ${isKey && hit > 0 ? Q.red : "transparent"}`, scale: isKey ? String(1 + 0.04 * hit) : "1" }}>
                    <div dir={isKey ? "ltr" : "rtl"} style={{ fontWeight: 700, fontSize: isKey ? 32 : 30, color: isKey && hit > 0 ? "#fff" : Q.ink2 }}>{r.l}</div>
                    <div style={{ fontFamily: isKey ? SANS : SANS, fontWeight: 700, fontSize: isKey ? 44 : 32, color: isKey && hit > 0 ? Q.blue : Q.ink }}>{r.v}</div>
                  </div>
                );
              })}
              {f >= tScan && f < tName + 4 && <div style={{ position: "absolute", left: -10, right: -10, top: `${(scanY / 3) * 100}%`, height: 96, borderRadius: 18, border: `2px dashed ${Q.blue}`, boxShadow: `0 0 24px ${Q.blue}66` }} />}
            </div>
          </Card>
        </div>
      )}
      {f >= tAr - 2 && (
        <div style={{ position: "absolute", left: 0, right: 60, top: 940, display: "flex", justifyContent: "center", scale: String(chip) }}>
          <div dir="rtl" style={{ padding: "14px 40px 22px", borderRadius: 999, background: Q.red, fontWeight: 700, fontSize: 52, color: "#fff", boxShadow: "0 18px 50px rgba(255,0,51,0.4)" }}>شاهدوا مقابل مرّروا</div>
        </div>
      )}
      <Sfx name="pop" at={tOpen - 4} />
      <Sfx name="tick" at={tScan} />
      <Sfx name="thud" at={tName - 2} />
      <Sfx name="ding" at={tAr - 2} gain={0.8} />
    </Frame>
  );
};

const S3: React.FC = () => {
  const s = getS("S3-Meaning");
  const f = useCurrentFrame();
  const tHundred = cue(s, "مية");
  const tStay = cue(s, "وقف");
  const tSwipe = cue(s, "سحب");
  const WATCH = 68;
  const stayCount = Math.round(interpolate(f, [tStay, tStay + 24], [0, WATCH], clamp));
  const swiped = ease(f, tSwipe - 2, tSwipe + 16);
  const labels = usePop(tStay + 4, 200, 14);
  const order = Array.from({ length: 100 }, (_, i) => i).sort((a, b) => random(`o${a}`) - random(`o${b}`));
  const watchSet = new Set(order.slice(0, WATCH));
  return (
    <Frame id="S3-Meaning">
      <div style={{ position: "absolute", left: 120, top: 280, width: 780, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 14 }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const at = tHundred - 6 + (i % 10) + Math.floor(i / 10) * 1.2;
          const p = ease(f, at, at + 8);
          const rank = order.indexOf(i);
          const watching = watchSet.has(i) && rank < stayCount;
          const gone = !watchSet.has(i) ? swiped : 0;
          return (
            <div key={i} style={{ width: 60, height: 60, borderRadius: 30, background: watching ? Q.blue : gone > 0 ? Q.red : "rgba(255,255,255,0.18)", opacity: p * (1 - gone * 0.6), scale: String((0.4 + 0.6 * p) * (1 - gone * 0.45)), boxShadow: watching ? `0 0 16px ${Q.blue}88` : undefined }} />
          );
        })}
      </div>
      {f >= tStay + 4 && (
        <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 1060, display: "flex", justifyContent: "center", gap: 30, opacity: Math.min(1, labels * 1.4), scale: String(0.9 + 0.1 * labels) }}>
          <div style={{ padding: "10px 28px 16px", borderRadius: 18, background: Q.blueSoft, border: `2px solid ${Q.blue}`, fontWeight: 700, fontSize: 40, color: "#fff" }}>
            <span style={{ color: Q.blue }}>{ar(stayCount)}</span> وقفوا
          </div>
          {swiped > 0 && (
            <div style={{ padding: "10px 28px 16px", borderRadius: 18, background: Q.redSoft, border: `2px solid ${Q.red}`, fontWeight: 700, fontSize: 40, color: "#fff", opacity: swiped }}>
              <span style={{ color: Q.red }}>{ar(100 - WATCH)}</span> سحبوا
            </div>
          )}
        </div>
      )}
      <div dir="rtl" style={{ position: "absolute", left: 0, right: 60, top: 1170, textAlign: "center", fontSize: 24, color: Q.muted, opacity: labels }}>مثال توضيحي</div>
      <Sfx name="type" at={tHundred - 6} gain={0.5} />
      <Sfx name="sparkle" at={tStay} gain={0.8} />
      <Sfx name="swish" at={tSwipe - 2} gain={1.4} />
    </Frame>
  );
};

const S4: React.FC = () => {
  const s = getS("S4-Good");
  const f = useCurrentFrame();
  const tQ = cue(s, "الزين");
  const tMagic = cue(s, "سحري");
  const tCmp = cue(s, "قارنه");
  const tOther = cue(s, "بغيرك");
  const q = usePop(tQ - 6, 220, 11);
  const magicOut = ease(f, tCmp - 4, tCmp + 6);
  const strike = ease(f, tMagic + 4, tMagic + 14);
  const chart = usePop(tCmp - 2, 180, 16);
  const other = usePop(tOther - 2, 220, 13);
  const bars = [58, 64, 61, 70, 55, 52];
  const avg = bars.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
  return (
    <Frame id="S4-Good">
      {magicOut < 1 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 60, top: 380, textAlign: "center", opacity: 1 - magicOut }}>
          <div style={{ fontWeight: 700, fontSize: 220, color: Q.blue, scale: String(q), textShadow: `0 0 50px ${Q.blue}88`, lineHeight: 1 }}>؟</div>
          {f >= tMagic - 2 && (
            <div style={{ position: "relative", display: "inline-block", marginTop: 40, padding: "10px 40px 18px", borderRadius: 20, background: Q.card2, border: `2px solid ${Q.border}`, fontWeight: 700, fontSize: 60 }}>
              رقم سحري
              <div style={{ position: "absolute", right: "6%", top: "52%", height: 8, borderRadius: 4, width: `${strike * 88}%`, background: Q.red, rotate: "-6deg" }} />
            </div>
          )}
        </div>
      )}
      {f >= tCmp - 2 && (
        <div style={{ position: "absolute", left: 80, right: 140, top: 300, opacity: Math.min(1, chart * 1.4), scale: String(0.92 + 0.08 * chart) }}>
          <Card style={{ padding: "26px 30px" }}>
            <div dir="rtl" style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700, fontSize: 38 }}>شورتاتك · شاهدوا ٪</div>
              <div style={{ fontSize: 22, color: Q.muted }}>مثال</div>
            </div>
            <div style={{ position: "relative", height: 380, marginTop: 20, display: "flex", alignItems: "flex-end", justifyContent: "space-between", direction: "rtl" }}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: (avg / 80) * 360, borderTop: `3px dashed ${Q.ink2}` }}>
                <div dir="rtl" style={{ position: "absolute", right: 0, top: -40, fontSize: 24, fontWeight: 600, color: Q.ink2 }}>معدّلك {ar(Math.round(avg))}٪</div>
              </div>
              {bars.map((b, i) => {
                const g = ease(f, tCmp + i * 3, tCmp + i * 3 + 14);
                const last = i === bars.length - 1;
                return (
                  <div key={i} style={{ width: 92, height: (b / 80) * 360 * g, borderRadius: 14, background: last ? Q.red : Q.blue, opacity: last ? 1 : 0.75, position: "relative" }}>
                    {last && g > 0.9 && <div dir="rtl" style={{ position: "absolute", top: -48, left: -40, right: -40, textAlign: "center", fontSize: 24, fontWeight: 700, color: Q.red }}>الجديد</div>}
                  </div>
                );
              })}
            </div>
          </Card>
          {f >= tOther - 2 && (
            <div dir="rtl" style={{ marginTop: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, scale: String(other) }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: Q.redSoft, display: "grid", placeItems: "center" }}>
                <Line n="x" size={40} color={Q.red} w={3} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 44 }}>لا تقارن بقنوات غيرك</div>
            </div>
          )}
        </div>
      )}
      <Sfx name="boing" at={tQ - 6} />
      <Sfx name="thud" at={tMagic + 4} />
      <Sfx name="pop" at={tCmp - 2} />
      <Sfx name="tick" at={tOther - 2} />
    </Frame>
  );
};

const S5: React.FC = () => {
  const s = getS("S5-Fix");
  const f = useCurrentFrame();
  const tLow = cue(s, "أقل");
  const tTwo = cue(s, "ثانيتين");
  const tImg = cue(s, "صورة");
  const tLine = cue(s, "جملة");
  const tChange = cue(s, "غيّرها");
  const tKeep = cue(s, "تلمس");
  const bar = usePop(tLow - 4, 180, 16);
  const seg = ease(f, tTwo - 2, tTwo + 12);
  const c1 = usePop(tImg - 4, 220, 12);
  const c2 = usePop(tLine - 4, 220, 12);
  const flip = ease(f, tChange, tChange + 10);
  const keep = ease(f, tKeep - 2, tKeep + 12);
  return (
    <Frame id="S5-Fix">
      <div style={{ position: "absolute", left: 80, right: 140, top: 300, opacity: Math.min(1, bar * 1.4) }}>
        <div dir="rtl" style={{ display: "flex", justifyContent: "space-between", fontSize: 26, fontWeight: 600, color: Q.ink2, marginBottom: 10 }}>
          <div dir="ltr">0:00</div>
          <div dir="ltr">0:45</div>
        </div>
        <div style={{ position: "relative", height: 70, borderRadius: 16, background: Q.card2, overflow: "hidden", direction: "rtl" }}>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${seg * 9}%`, background: Q.red, boxShadow: `0 0 30px ${Q.red}` }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "91%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, opacity: keep, background: "rgba(43,212,125,0.1)" }}>
            <Line n="lock" size={34} color={Q.green} w={2.2} />
            <div dir="rtl" style={{ fontWeight: 700, fontSize: 30, color: Q.green }}>الباقي مثل ما هو</div>
          </div>
        </div>
        <div dir="rtl" style={{ marginTop: 12, fontWeight: 700, fontSize: 38, color: Q.red, opacity: seg }}>أول ثانيتين</div>
      </div>
      <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 560, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {[
          { p: c1, at: tImg, icon: "image", l: "أول صورة" },
          { p: c2, at: tLine, icon: "mic", l: "أول جملة" },
        ].map((c) =>
          f >= c.at - 4 ? (
            <Card key={c.l} glow={flip > 0.5 ? Q.green : Q.red} style={{ height: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, scale: String(c.p), rotate: `${Math.sin(flip * Math.PI) * 8}deg` }}>
              <Line n={flip > 0.5 ? "refresh" : c.icon} size={110} color={flip > 0.5 ? Q.green : Q.red} />
              <div style={{ fontWeight: 700, fontSize: 46 }}>{c.l}</div>
              {flip > 0.5 && <div style={{ padding: "4px 18px 8px", borderRadius: 999, background: Q.green, color: Q.bg, fontWeight: 700, fontSize: 26 }}>✓ غيّرها</div>}
            </Card>
          ) : (
            <div key={c.l} />
          ),
        )}
      </div>
      <Sfx name="pop" at={tLow - 4} />
      <Sfx name="riser" at={tTwo - 20} gain={0.6} />
      <Sfx name="thud" at={tTwo - 2} />
      <Sfx name="pop" at={tImg - 4} />
      <Sfx name="pop" at={tLine - 4} />
      <Sfx name="sparkle" at={tChange} />
      <Sfx name="ding" at={tKeep - 2} gain={0.7} />
    </Frame>
  );
};

const S6: React.FC = () => {
  const s = getS("S6-Loop");
  const f = useCurrentFrame();
  const tNote = cue(s, "ولاحظت");
  const tQ = cue(s, "بسؤال");
  const tSwipe = cue(s, "تسحب");
  const rw = ease(f, tNote, tNote + 30);
  const spin = interpolate(f, [tNote, tNote + 30], [0, -720], clamp);
  const secs = Math.round(interpolate(rw, [0, 1], [41, 0]));
  const q = usePop(tQ - 2, 230, 10);
  const hand = usePop(tSwipe - 2, 220, 12);
  return (
    <Frame id="S6-Loop">
      <Phone style={{ left: 300, top: 260, scale: "0.82", filter: rw < 1 ? `blur(${(1 - rw) * 3}px)` : undefined }}>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 170, color: Q.blue, scale: String(f >= tQ - 2 ? 1 + 0.15 * q : 1), textShadow: `0 0 50px ${Q.blue}99` }}>؟٪</div>
        </div>
      </Phone>
      <div style={{ position: "absolute", left: 120, top: 420, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: rw > 0 ? 1 : 0 }}>
        <div style={{ rotate: `${spin}deg` }}>
          <Line n="refresh" size={100} color={Q.red} w={2.2} />
        </div>
        <div dir="ltr" style={{ fontFamily: MONO, fontSize: 40, color: "#fff" }}>0:{String(secs).padStart(2, "0")}</div>
      </div>
      {f >= tSwipe - 2 && (
        <div style={{ position: "absolute", left: 740, top: 620, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, scale: String(hand) }}>
          <Line n="hand" size={120} color="#fff" w={1.8} />
          <div dir="rtl" style={{ padding: "6px 22px 12px", borderRadius: 999, background: Q.green, color: Q.bg, fontWeight: 700, fontSize: 32 }}>وما سحبت!</div>
        </div>
      )}
      <Sfx name="riser" at={tNote} gain={0.5} />
      <Sfx name="boing" at={tQ - 2} />
      <Sfx name="ding" at={tSwipe - 2} />
    </Frame>
  );
};

const S7: React.FC = () => {
  const s = getS("S7-CTA");
  const f = useCurrentFrame();
  const tBuild = cue(s, "يبني");
  const tNums = cue(s, "أرقامها");
  const tF = cue(s, "تابع");
  const tName = cue(s, "دبرها");
  const lead = usePop(tBuild - 4, 180, 16);
  const nums = usePop(tNums - 2, 200, 14);
  const name = usePop(tF - 6, 150, 11, 0.9);
  const btn = usePop(tName, 220, 12);
  const tapped = f >= tName + 18;
  const glow = 0.7 + 0.3 * Math.sin(f / 8);
  const reveal = f >= tF - 6;
  return (
    <Frame id="S7-CTA" wordsTop={1300}>
      {!reveal && (
        <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 360, display: "flex", flexDirection: "column", gap: 24 }}>
          <Card style={{ padding: "26px 30px", display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, lead * 1.4), scale: String(0.9 + 0.1 * lead) }}>
            <Line n="play" size={70} color={Q.red} w={2.2} />
            <div style={{ fontWeight: 700, fontSize: 46 }}>نبني قناتك</div>
          </Card>
          {f >= tNums - 2 && (
            <Card style={{ padding: "26px 30px", display: "flex", alignItems: "center", gap: 18, scale: String(nums) }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 70 }}>
                {[30, 44, 38, 60, 70].map((h, i) => (
                  <div key={i} style={{ width: 14, height: h * ease(f, tNums + i * 2, tNums + i * 2 + 10), borderRadius: 4, background: Q.blue }} />
                ))}
              </div>
              <div style={{ fontWeight: 700, fontSize: 46 }}>ونتابع أرقامها معك</div>
            </Card>
          )}
        </div>
      )}
      {reveal && (
        <>
          {Array.from({ length: 44 }).map((_, i) => {
            const t = f - (tF - 6);
            const a = random(`a${i}`) * Math.PI * 2;
            const v = 7 + random(`v${i}`) * 14;
            const d = v * t * Math.exp(-t / 40);
            const c = [Q.red, "#ffffff", Q.blue, Q.ink2][i % 4];
            const sz = 6 + random(`s${i}`) * 8;
            return <div key={i} style={{ position: "absolute", left: 500 + Math.cos(a) * d, top: 560 + Math.sin(a) * d * 0.75 + t * 0.5, width: sz, height: sz, borderRadius: sz / 2, background: c, opacity: Math.max(0, 1 - t / 75) }} />;
          })}
          {[0, 1, 2].map((k) => {
            const t = ((f - tF + k * 18) % 54) / 54;
            return <div key={k} style={{ position: "absolute", left: 540 - 50 - 230 - t * 120, top: 300 - t * 120, width: 460 + t * 240, height: 460 + t * 240, borderRadius: "50%", border: `2px solid ${k % 2 ? Q.blue : Q.red}`, opacity: (1 - t) * 0.5 * Math.min(1, name) }} />;
          })}
          <div style={{ position: "absolute", left: 540 - 50 - 230, top: 300, width: 460, height: 460, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", scale: String(interpolate(name, [0, 1], [0.3, 1])), rotate: `${(1 - name) * -25}deg`, opacity: Math.min(1, name * 1.6), boxShadow: `0 0 ${60 + 50 * glow}px rgba(255,0,51,${0.3 + 0.2 * glow}), 0 24px 60px rgba(0,0,0,0.4)` }}>
            <Img src={staticFile("brand/logo-color.png")} style={{ width: 380 }} />
          </div>
          <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 830, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: name }}>
            <div style={{ width: 44, height: 2, background: Q.red }} />
            <div style={{ fontWeight: 600, fontSize: 46, color: Q.ink2 }}>بناء قناتك · ومتابعة أرقامها</div>
            <div style={{ width: 44, height: 2, background: Q.red }} />
          </div>
          {f >= tName && (
            <div style={{ position: "absolute", left: 0, right: 100, top: 980, display: "flex", justifyContent: "center", scale: String(btn) }}>
              <div dir="rtl" style={{ padding: "18px 60px 24px", borderRadius: 999, background: tapped ? Q.ink : Q.red, color: tapped ? Q.bg : "#fff", fontWeight: 700, fontSize: 58, boxShadow: tapped ? "0 16px 40px rgba(255,255,255,0.15)" : "0 16px 40px rgba(255,0,51,0.4)" }}>{tapped ? "✓ تتابع دبّرها" : "+ تابع دبّرها"}</div>
            </div>
          )}
        </>
      )}
      <Sfx name="pop" at={tBuild - 4} />
      <Sfx name="pop" at={tNums - 2} />
      <Sfx name="riser" at={Math.max(0, tF - 36)} />
      <Sfx name="impact" at={tF - 6} gain={0.8} />
      <Sfx name="sparkle" at={tF} />
      <Sfx name="enter" at={tName} />
      <Sfx name="ding" at={tName + 18} />
    </Frame>
  );
};

const SCENES: { id: SId; C: React.FC }[] = [
  { id: "S1-Hook", C: S1 },
  { id: "S2-Where", C: S2 },
  { id: "S3-Meaning", C: S3 },
  { id: "S4-Good", C: S4 },
  { id: "S5-Fix", C: S5 },
  { id: "S6-Loop", C: S6 },
  { id: "S7-CTA", C: S7 },
];

export const ShortsMetric: React.FC = () => (
  <AbsoluteFill style={{ background: Q.bg }}>
    <Backdrop />
    <TransitionSeries>
      {SCENES.flatMap(({ id, C }) => {
        const s = getS(id);
        const items = [
          <TransitionSeries.Sequence key={id} name={id} durationInFrames={s.durationInFrames}>
            <C />
          </TransitionSeries.Sequence>,
        ];
        if (s.transitionFrames) items.push(<TransitionSeries.Transition key={`${id}-t`} presentation={fade()} timing={linearTiming({ durationInFrames: s.transitionFrames })} />);
        return items;
      })}
    </TransitionSeries>
    <Segments />
    {sTimeline.audio?.music && (
      <Audio
        src={staticFile("audio/yt3/music/calm.mp3")}
        loop
        volume={(f) => {
          const end = sTimeline.durationInFrames;
          const inVoice = sTimeline.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 4);
          const fd = interpolate(f, [0, 4, end - 45, end], [0, 1, 1, 0], clamp);
          return (inVoice ? db(-23) : db(-17)) * fd;
        }}
      />
    )}
  </AbsoluteFill>
);

/** The same cover as a still, for platforms that accept a separate thumbnail. */
export const ShortsMetricThumb: React.FC = () => <Cover />;
