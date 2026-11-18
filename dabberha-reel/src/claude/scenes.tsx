import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, Camera, Chapter, cue, demoFile, DemoVideo, ease, Finish, getC, Holo, HoloAppear, Illustrative, K, LAT, MONO, Panel, Rashed, SceneVoice, Sfx, Subs, usePop, Workspace, type CSceneId } from "./base";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Thin line icons (24-unit grid). */
const I: Record<string, string[]> = {
  doc: ["M6 3h8l4 4v14H6z", "M14 3v4h4", "M9 12h6", "M9 16h6"],
  sheet: ["M4 5h16v14H4z", "M4 10h16", "M4 15h16", "M10 5v14"],
  mail: ["M3 6h18v12H3z", "M3 7l9 6 9-6"],
  code: ["M8 7l-5 5 5 5", "M16 7l5 5-5 5", "M14 4l-4 16"],
  task: ["M5 6h14", "M5 12h14", "M5 18h9", "M3 6h0", "M3 12h0"],
  chart: ["M4 20V10", "M10 20V4", "M16 20v-7", "M22 20H2"],
  cube: ["M12 3l8 4.5v9L12 21l-8-4.5v-9z", "M12 12l8-4.5", "M12 12v9", "M12 12L4 7.5"],
  cursor: ["M5 3l14 8-6 2-2 6z"],
  globe: ["M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z", "M3 12h18", "M12 3c3 3 3 15 0 18", "M12 3c-3 3-3 15 0 18"],
  cal: ["M4 6h16v14H4z", "M4 10h16", "M8 3v5", "M16 3v5"],
  folder: ["M3 7h7l2 2h9v10H3z"],
  chat: ["M4 5h16v11H9l-5 4z"],
  spark: ["M12 3v6", "M12 15v6", "M3 12h6", "M15 12h6"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
};
const Icon: React.FC<{ n: keyof typeof I; size?: number; color?: string; w?: number }> = ({ n, size = 48, color = K.cyan, w = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    {I[n].map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
);

/** Shared scene frame: environment + finish + chapter + subtitles + voice. */
const Frame: React.FC<{ id: CSceneId; children: React.ReactNode; mood?: "chaos" | "calm" | "build"; warmth?: number; chapter?: [string, string, string]; demo?: boolean; subsEnd?: number }> = ({ id, children, mood = "calm", warmth = 0, chapter, demo, subsEnd }) => {
  const scene = getC(id);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ fontFamily: AR }}>
      <Workspace mood={mood} warmth={warmth} />
      <AbsoluteFill style={{ opacity: fadeIn }}>{children}</AbsoluteFill>
      {chapter && <Chapter n={chapter[0]} en={chapter[1]} ar={chapter[2]} />}
      {demo !== undefined && <Illustrative real={demo} />}
      <AbsoluteFill style={{ opacity: subsEnd ? interpolate(frame, [subsEnd, subsEnd + 10], [1, 0], clamp) : 1 }}>
        <Subs scene={scene} />
      </AbsoluteFill>
      <Finish />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={Math.max(0, durationInFrames - 16)} gain={0.8} />
    </AbsoluteFill>
  );
};

// ============================================================ 1 · OVERLOAD (hook)
const ALERTS: { at: string; icon: keyof typeof I; txt: string; c: string }[] = [
  { at: "ملفات", icon: "doc", txt: "١٤ ملف بانتظار المراجعة", c: K.amber },
  { at: "وإيميلات", icon: "mail", txt: "٣٢ إيميل غير مقروء", c: K.red },
  { at: "وكود", icon: "code", txt: "Build failed", c: K.red },
  { at: "ومهام", icon: "task", txt: "٩ مهام متأخرة", c: K.amber },
];

export const C1Overload: React.FC = () => {
  const scene = getC("C1-Overload");
  const frame = useCurrentFrame();
  const freezeAt = scene.durationInFrames - 34;
  const f = Math.min(frame, freezeAt);
  const frozen = frame >= freezeAt;
  const sat = frozen ? interpolate(frame, [freezeAt, freezeAt + 8], [1, 0.15], clamp) : 1;
  const shake = frozen ? 0 : interpolate(f, [100, freezeAt], [0, 6], clamp);
  const sx = (random(`s${f}`) - 0.5) * shake;
  const sy = (random(`t${f}`) - 0.5) * shake;
  const cards = ALERTS.map((a) => ({ ...a, t: cue(scene, a.at) }));
  // extra pings that multiply after the four named ones
  const extra = Math.floor(interpolate(f, [cards[3].t, freezeAt], [0, 10], clamp));
  return (
    <Frame id="C1-Overload" mood="chaos">
      <AbsoluteFill style={{ filter: `saturate(${sat})`, translate: `${sx}px ${sy}px` }}>
        <Camera from={1} to={1.12} origin="50% 60%">
          {/* clock */}
          <div style={{ position: "absolute", top: 300, left: 0, right: 60, textAlign: "center", opacity: ease(f, 10, 30) }}>
            <div dir="ltr" style={{ fontFamily: LAT, fontWeight: 300, fontSize: 150, letterSpacing: 6, color: K.ink, textShadow: `0 0 40px ${K.red}88` }}>
              02<span style={{ opacity: Math.floor(f / 15) % 2 ? 0.2 : 1 }}>:</span>00
            </div>
            <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 6, color: K.red, marginTop: 4 }}>AM</div>
          </div>
          {/* Rashed */}
          <div style={{ position: "absolute", left: 540 - 60 - 290, top: 820 }}>
            <Rashed expr="stressed" look={[-0.6, 0.6]} rim={K.red} size={580} breath={!frozen} />
          </div>
          {/* alerts piling up */}
          {cards.map((c, i) => {
            const p = interpolate(f, [c.t - 4, c.t + 8], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
            if (f < c.t - 4) return null;
            const left = i % 2 ? 560 : 70;
            const top = 620 + i * 120;
            return (
              <div key={c.at} dir="rtl" style={{ position: "absolute", left, top, width: 430, padding: "16px 20px", borderRadius: 16, background: "rgba(20,10,14,0.82)", border: `1px solid ${c.c}88`, display: "flex", alignItems: "center", gap: 14, opacity: p, translate: `${(1 - p) * (i % 2 ? 200 : -200)}px 0px`, rotate: `${(i % 2 ? 1 : -1) * (2 + i)}deg`, boxShadow: `0 0 30px ${c.c}44` }}>
                <Icon n={c.icon} size={40} color={c.c} />
                <div style={{ fontFamily: c.txt.match(/[A-Za-z]/) ? MONO : AR, fontWeight: 600, fontSize: 28, color: K.ink }} dir={c.txt.match(/[A-Za-z]/) ? "ltr" : "rtl"}>{c.txt}</div>
              </div>
            );
          })}
          {Array.from({ length: extra }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 60 + random(`ex${i}`) * 860, top: 560 + random(`ey${i}`) * 700, width: 160, height: 56, borderRadius: 12, background: "rgba(255,77,94,0.16)", border: `1px solid ${K.red}66`, rotate: `${(random(`er${i}`) - 0.5) * 20}deg` }} />
          ))}
        </Camera>
      </AbsoluteFill>
      {/* the freeze: a single point of light appears */}
      {frozen && <div style={{ position: "absolute", left: 540 - 60 - 6, top: 700, width: 12, height: 12, borderRadius: 6, background: "#fff", boxShadow: `0 0 ${20 + (frame - freezeAt) * 3}px ${K.cyan}`, opacity: ease(frame, freezeAt + 6, freezeAt + 20) }} />}
      <Sfx name="drone" at={0} />
      {cards.map((c) => (
        <Sfx key={c.at} name="link" at={c.t - 2} gain={1.4} />
      ))}
      <Sfx name="pings" at={cards[3].t + 6} />
      <Sfx name="freeze" at={freezeAt} />
    </Frame>
  );
};

// ============================================================ 2 · MEET CLAUDE
const CAPS: { icon: keyof typeof I; en: string }[] = [
  { icon: "doc", en: "Files" },
  { icon: "chart", en: "Artifacts" },
  { icon: "code", en: "Code" },
  { icon: "cube", en: "Skills" },
  { icon: "cursor", en: "Computer" },
  { icon: "globe", en: "Web" },
];

export const C2Meet: React.FC = () => {
  const scene = getC("C2-Meet");
  const frame = useCurrentFrame();
  const tIn = cue(scene, "هنا");
  const tChat = cue(scene, "شات");
  const tNot = cue(scene, "مجرد");
  const calm = ease(frame, tIn + 10, tIn + 50);
  const bubble = usePop(tNot - 6, 200, 14);
  const crack = interpolate(frame, [tChat + 4, tChat + 22], [0, 1], clamp);
  return (
    <Frame id="C2-Meet" mood="calm" warmth={calm}>
      <AbsoluteFill style={{ opacity: 1 - calm }}>
        <Workspace mood="chaos" beams={0.6} />
      </AbsoluteFill>
      <Camera from={1.06} to={1.0} origin="60% 50%">
        <div style={{ position: "absolute", left: 30, top: 860 }}>
          <Rashed expr={frame < tIn + 20 ? "stressed" : "amazed"} look={[0.9, -0.5]} rim={calm > 0.5 ? K.cyan : K.red} size={520} />
        </div>
        <div style={{ position: "absolute", left: 600, top: 470 }}>
          <HoloAppear at={tIn} size={340} talk={0} />
        </div>
        {/* "just a chat"? — the bubble cracks open into capabilities */}
        {frame >= tNot - 6 && (
          <div style={{ position: "absolute", left: 770 - 60, top: 700, width: 0, height: 0 }}>
            {crack < 1 && (
              <div style={{ position: "absolute", left: -95, top: -70, width: 190, height: 140, opacity: (1 - crack) * bubble, scale: String((0.6 + 0.4 * bubble) * (1 + crack * 0.4)) }}>
                <Icon n="chat" size={190} color="#fff" w={1.2} />
                <div dir="ltr" style={{ position: "absolute", left: 0, right: 0, top: 44, textAlign: "center", fontFamily: LAT, fontWeight: 600, fontSize: 30, color: "#fff" }}>Chat</div>
              </div>
            )}
            {crack > 0 &&
              CAPS.map((c, i) => {
                const a = (i / CAPS.length) * Math.PI * 2 - Math.PI / 2 + frame / 90;
                const r = 230 * crack;
                return (
                  <div key={c.en} style={{ position: "absolute", left: Math.cos(a) * r - 56, top: Math.sin(a) * r * 0.85 - 56, width: 112, height: 112, borderRadius: 26, background: "rgba(16,20,32,0.85)", border: `1px solid ${K.edge}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, opacity: crack, boxShadow: `0 0 24px rgba(103,228,255,0.25)` }}>
                    <Icon n={c.icon} size={44} />
                    <div dir="ltr" style={{ fontFamily: LAT, fontSize: 15, color: K.dim }}>{c.en}</div>
                  </div>
                );
              })}
          </div>
        )}
      </Camera>
      <Sfx name="materialize" at={tIn} />
      <Sfx name="riser" at={tIn + 6} gain={0.7} />
      <Sfx name="pings" at={tNot - 6} gain={0.3} />
      <Sfx name="morph" at={tChat + 4} />
    </Frame>
  );
};

// ============================================================ 3 · FILES & REASONING
const DocPanel: React.FC<{ kind: "pdf" | "xls" | "rep"; hl: number; style?: React.CSSProperties; tilt?: number }> = ({ kind, hl, style, tilt }) => (
  <Panel w={300} h={360} tilt={tilt} title={kind === "pdf" ? "REPORT.PDF" : kind === "xls" ? "SALES.XLSX" : "NOTES.DOCX"} style={style}>
    <div style={{ position: "absolute", left: 24, right: 24, top: 56 }}>
      {kind === "xls"
        ? Array.from({ length: 7 }).map((_, r) => (
            <div key={r} style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {[0, 1, 2].map((c) => (
                <div key={c} style={{ flex: 1, height: 22, borderRadius: 4, background: r === 3 && hl > 0 ? `rgba(103,228,255,${0.25 + 0.5 * hl})` : "rgba(233,237,246,0.10)" }} />
              ))}
            </div>
          ))
        : Array.from({ length: 9 }).map((_, r) => (
            <div key={r} style={{ height: 12, width: `${[90, 70, 85, 60, 95, 75, 80, 55, 88][r]}%`, borderRadius: 6, marginBottom: 14, background: r === (kind === "pdf" ? 4 : 2) && hl > 0 ? `rgba(103,228,255,${0.3 + 0.6 * hl})` : "rgba(233,237,246,0.13)" }} />
          ))}
    </div>
  </Panel>
);

export const C3Files: React.FC = () => {
  const scene = getC("C3-Files");
  const frame = useCurrentFrame();
  const demo = demoFile("C3");
  const t1 = cue(scene, "ملفات");
  const t2 = cue(scene, "وتقارير");
  const t3 = cue(scene, "وجداول");
  const tRead = cue(scene, "يقراها");
  const tLink = cue(scene, "يربط");
  const tOut = cue(scene, "ويطلع");
  const tDecide = cue(scene, "قرارك");
  const docs: { k: "pdf" | "xls" | "rep"; at: number; x: number; y: number; r: number }[] = [
    { k: "pdf", at: t1, x: 80, y: 560, r: 14 },
    { k: "rep", at: t2, x: 390, y: 520, r: 0 },
    { k: "xls", at: t3, x: 700, y: 560, r: -14 },
  ];
  const scan = interpolate(frame, [tRead, tRead + 26], [0, 1], clamp);
  const hl = ease(frame, tRead + 10, tRead + 30);
  const link = ease(frame, tLink, tLink + 22);
  const collapse = ease(frame, tOut - 4, tOut + 22);
  const insight = usePop(tOut + 10, 150, 18);
  const decide = usePop(tDecide, 220, 12);
  return (
    <Frame id="C3-Files" chapter={["01", "FILES & REASONING", "تحليل الملفات والتفكير"]} demo={!!demo}>
      {demo ? (
        <DemoVideo src={demo} w={900} h={900} style={{ left: 60, top: 420 }} />
      ) : (
        <Camera from={1} to={1.06}>
          <div style={{ position: "absolute", left: 540 - 60 - 110, top: 980, opacity: 0.9 }}>
            <Holo size={220} talk={frame > tRead && frame < tOut ? 1 : 0} />
          </div>
          {docs.map((d) => {
            const p = interpolate(frame, [d.at - 4, d.at + 14], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
            if (frame < d.at - 4) return null;
            const cx = d.x + (390 - d.x) * collapse;
            const cy = d.y + (700 - d.y) * collapse;
            return <DocPanel key={d.k} kind={d.k} hl={hl} style={{ left: cx, top: cy + (1 - p) * 300, opacity: p * (1 - collapse), scale: String((0.8 + 0.2 * p) * (1 - collapse * 0.6)) }} tilt={d.r * (1 - collapse)} />;
          })}
          {/* scan beam from the hologram */}
          {scan > 0 && scan < 1 && <div style={{ position: "absolute", left: 60, right: 120, top: 540 + scan * 380, height: 4, background: `linear-gradient(90deg, transparent, ${K.cyan}, transparent)`, boxShadow: `0 0 30px ${K.cyan}` }} />}
          {/* links between highlighted rows */}
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: link * (1 - collapse) }}>
            <path d="M330 790 C 400 760, 460 760, 520 720" stroke={K.cyan} strokeWidth="3" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - link} />
            <path d="M640 720 C 690 740, 720 760, 760 760" stroke={K.cyan} strokeWidth="3" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - link} />
            {[330, 520, 640, 760].map((x, i) => (
              <circle key={i} cx={x} cy={[790, 720, 720, 760][i]} r={7} fill={K.cyan} />
            ))}
          </svg>
          {/* the insight */}
          {frame >= tOut + 10 && (
            <Panel w={640} h={360} title="INSIGHT" style={{ left: 160, top: 580, opacity: insight, scale: String(0.85 + 0.15 * insight) }}>
              <div dir="rtl" style={{ position: "absolute", left: 30, right: 30, top: 60 }}>
                <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 44, color: K.ink }}>الخلاصة</div>
                {["المبيعات نزلت في منطقة وحدة", "السبب: تأخر الشحن", "الحل: تغيير المورّد"].map((b, i) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, opacity: ease(frame, tOut + 18 + i * 8, tOut + 30 + i * 8) }}>
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: K.cyan }} />
                    <div style={{ fontFamily: AR, fontSize: 30, color: K.dim }}>{b}</div>
                  </div>
                ))}
              </div>
              {frame >= tDecide && (
                <div dir="rtl" style={{ position: "absolute", left: 30, bottom: 26, display: "flex", alignItems: "center", gap: 10, padding: "8px 20px 10px", borderRadius: 999, background: "rgba(75,227,160,0.15)", border: `1px solid ${K.green}`, fontFamily: AR, fontWeight: 600, fontSize: 28, color: K.green, scale: String(decide) }}>
                  <Icon n="check" size={28} color={K.green} w={2.2} />
                  جاهز للقرار
                </div>
              )}
            </Panel>
          )}
        </Camera>
      )}
      <Sfx name="whoosh" at={t1 - 4} gain={0.7} />
      <Sfx name="whoosh" at={t2 - 4} gain={0.7} />
      <Sfx name="whoosh" at={t3 - 4} gain={0.7} />
      <Sfx name="scan" at={tRead} />
      <Sfx name="link" at={tLink + 6} />
      <Sfx name="morph" at={tOut - 4} />
      <Sfx name="fix" at={tDecide} />
    </Frame>
  );
};

// ============================================================ 4 · ARTIFACTS
export const C4Artifacts: React.FC = () => {
  const scene = getC("C4-Artifacts");
  const frame = useCurrentFrame();
  const demo = demoFile("C4");
  const tWords = cue(scene, "بكلام");
  const tBuild = cue(scene, "يبني");
  const tLive = cue(scene, "تشتغل");
  const tDash = cue(scene, "لوحة");
  const tCalc = cue(scene, "حاسبة");
  const tApp = cue(scene, "تطبيق");
  const panel = usePop(tWords - 10, 150, 18);
  const m = ease(frame, tBuild, tBuild + 26); // text → chart morph
  const slider = frame > tLive ? 0.25 + 0.6 * (0.5 + 0.5 * Math.sin((frame - tLive) / 14)) : 0.4;
  const state = frame >= tApp ? 2 : frame >= tCalc ? 1 : 0;
  const sw = (at: number) => ease(frame, at - 6, at + 10);
  const label = state === 2 ? "MINI APP" : state === 1 ? "CALCULATOR" : m > 0.5 ? "DASHBOARD" : "RESPONSE";
  const bars = [0.55, 0.8, 0.4, 0.95, 0.65, 0.75];
  return (
    <Frame id="C4-Artifacts" chapter={["02", "ARTIFACTS", "من كلام… إلى أداة تشتغل"]} demo={!!demo}>
      {demo ? (
        <DemoVideo src={demo} w={900} h={900} style={{ left: 60, top: 420 }} />
      ) : (
        <Camera from={1} to={1.07}>
          <Panel w={860} h={700} title={label} style={{ left: 70, top: 470, opacity: panel, scale: String(0.9 + 0.1 * panel) }} tilt={-6 + 6 * m}>
            {/* state 0: text → chart morph */}
            <div style={{ position: "absolute", inset: 0, opacity: 1 - sw(tCalc) }}>
              {bars.map((h, i) => {
                const tx = { x: 60, y: 90 + i * 46, w: 740 * [0.9, 0.7, 0.85, 0.6, 0.8, 0.5][i], h: 18 };
                const ch = { x: 90 + i * 118, y: 560 - 360 * h * (0.6 + 0.8 * slider * (i % 2 ? 1 : 0.7)), w: 80, h: 360 * h * (0.6 + 0.8 * slider * (i % 2 ? 1 : 0.7)) };
                const x = tx.x + (ch.x - tx.x) * m;
                const y = tx.y + (ch.y - tx.y) * m;
                const w = tx.w + (ch.w - tx.w) * m;
                const hh = tx.h + (Math.min(400, ch.h) - tx.h) * m;
                return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: hh, borderRadius: 8, background: m > 0.2 ? `linear-gradient(180deg, ${i % 2 ? K.cyan : K.violet}, rgba(76,141,255,0.25))` : "rgba(233,237,246,0.16)" }} />;
              })}
              {m > 0.6 && (
                <div style={{ position: "absolute", left: 90, right: 90, top: 620, opacity: ease(frame, tBuild + 20, tBuild + 34) }}>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(233,237,246,0.2)" }} />
                  <div style={{ position: "absolute", left: `${slider * 100}%`, top: -13, width: 32, height: 32, borderRadius: 16, background: "#fff", boxShadow: `0 0 18px ${K.cyan}` }} />
                </div>
              )}
            </div>
            {/* state 1: calculator */}
            <div style={{ position: "absolute", inset: 0, opacity: sw(tCalc) * (1 - sw(tApp)), display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 70 }}>
              <div dir="ltr" style={{ width: 620, height: 110, borderRadius: 14, background: "rgba(8,9,13,0.6)", border: `1px solid ${K.edge}`, fontFamily: LAT, fontWeight: 300, fontSize: 70, color: K.ink, textAlign: "right", padding: "10px 24px" }}>{Math.floor(interpolate(frame, [tCalc, tCalc + 30], [0, 12480], clamp)).toLocaleString("en-US")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 140px)", gap: 14, marginTop: 24 }}>
                {"789÷456×123−0.=+".split("").map((k, i) => (
                  <div key={i} style={{ height: 82, borderRadius: 14, background: "rgba(233,237,246,0.08)", border: `1px solid rgba(233,237,246,0.15)`, display: "grid", placeItems: "center", fontFamily: LAT, fontSize: 36, color: "+−×÷=".includes(k) ? K.cyan : K.ink, scale: String(0.6 + 0.4 * ease(frame, tCalc + i, tCalc + i + 8)) }}>{k}</div>
                ))}
              </div>
            </div>
            {/* state 2: mini app */}
            <div dir="rtl" style={{ position: "absolute", inset: 0, opacity: sw(tApp), padding: "80px 50px" }}>
              {["حجز موعد", "تذكير بالدفع", "تقرير أسبوعي"].map((t, i) => {
                const on = frame > tApp + 12 + i * 8;
                return (
                  <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 28px", marginBottom: 20, borderRadius: 18, background: "rgba(233,237,246,0.06)", border: "1px solid rgba(233,237,246,0.12)" }}>
                    <div style={{ fontFamily: AR, fontWeight: 600, fontSize: 38, color: K.ink }}>{t}</div>
                    <div style={{ width: 86, height: 46, borderRadius: 23, background: on ? K.cyan : "rgba(233,237,246,0.2)", position: "relative" }}>
                      <div style={{ position: "absolute", top: 5, left: on ? 45 : 5, width: 36, height: 36, borderRadius: 18, background: "#fff" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </Camera>
      )}
      <Sfx name="morph" at={tBuild} />
      <Sfx name="click" at={tLive} />
      <Sfx name="snap" at={tDash} />
      <Sfx name="morph" at={tCalc - 6} gain={0.7} />
      <Sfx name="morph" at={tApp - 6} gain={0.7} />
      <Sfx name="click" at={tApp + 14} />
    </Frame>
  );
};

// ============================================================ 5 · CODING
const CODE_LINES = [
  "async function sync(orders) {",
  "  const paid = orders.filter(o => o.paid);",
  "  const total = paid.reduce((s, o) => s + o.sum);",
  "  await notify(total);",
  "  return report(paid);",
  "}",
];

export const C5Code: React.FC = () => {
  const scene = getC("C5-Code");
  const frame = useCurrentFrame();
  const demo = demoFile("C5");
  const tWrite = cue(scene, "يكتب");
  const tFix = cue(scene, "ويصلح");
  const tProj = cue(scene, "مشروع");
  const chars = Math.floor(interpolate(frame, [tWrite, tWrite + 40], [0, 220], clamp));
  const errOn = frame > tWrite + 26 && frame < tFix + 4;
  const fixed = frame >= tFix + 4;
  const tree = ease(frame, tProj - 20, tProj + 10);
  const app = usePop(tProj + 8, 150, 18);
  let left = chars;
  const files = ["src/", "  app.tsx", "  orders.ts", "  report.ts", "tests/", "  orders.test.ts", "package.json"];
  return (
    <Frame id="C5-Code" chapter={["03", "CODING", "يكتب الكود ويصلّحه"]} demo={!!demo}>
      {demo ? (
        <DemoVideo src={demo} w={900} h={900} style={{ left: 60, top: 420 }} />
      ) : (
        <Camera from={1.04} to={1.0} x={[0, 0]}>
          <Panel w={880 - 280 * tree} h={560} title="EDITOR" style={{ left: 60 + 280 * tree, top: 480 }}>
            <div dir="ltr" style={{ position: "absolute", left: 24, top: 60, right: 20, fontFamily: MONO, fontSize: 25 - 4 * tree, lineHeight: 1.9, color: K.ink, whiteSpace: "pre" }}>
              {CODE_LINES.map((l, i) => {
                const show = Math.max(0, Math.min(l.length, left));
                left -= l.length;
                const isErr = i === 2;
                return (
                  <div key={i} style={{ position: "relative", color: isErr && errOn ? "#FF9AA4" : isErr && fixed ? K.green : K.ink }}>
                    <span style={{ color: K.faint, marginRight: 14 }}>{i + 1}</span>
                    {l.slice(0, show).replace(".sum)", fixed ? ".sum, 0)" : ".sum)")}
                    {isErr && errOn && <div style={{ position: "absolute", left: 40, right: 60, bottom: 6, height: 3, background: `repeating-linear-gradient(90deg, ${K.red} 0 6px, transparent 6px 10px)` }} />}
                  </div>
                );
              })}
            </div>
            {errOn && (
              <div dir="ltr" style={{ position: "absolute", left: 24, bottom: 20, fontFamily: MONO, fontSize: 20, color: K.red }}>✕ TypeError: reduce of empty array with no initial value</div>
            )}
            {fixed && (
              <div dir="ltr" style={{ position: "absolute", left: 24, bottom: 20, display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 20, color: K.green, opacity: ease(frame, tFix + 4, tFix + 14) }}>
                <Icon n="check" size={24} color={K.green} w={2.4} /> fixed · tests passing
              </div>
            )}
          </Panel>
          {/* project tree */}
          <Panel w={250} h={560} title="PROJECT" style={{ left: 60, top: 480, opacity: tree, translate: `${(1 - tree) * -60}px 0px` }}>
            <div dir="ltr" style={{ position: "absolute", left: 20, top: 60, fontFamily: MONO, fontSize: 20, lineHeight: 2, color: K.dim, whiteSpace: "pre" }}>
              {files.map((f, i) => (
                <div key={f} style={{ opacity: ease(frame, tProj - 16 + i * 3, tProj - 6 + i * 3), color: f.endsWith("/") ? K.cyan : K.dim }}>{f}</div>
              ))}
            </div>
          </Panel>
          {/* running app preview */}
          {frame >= tProj + 8 && (
            <Panel w={520} h={200} title="RUNNING · localhost" tint={K.green} style={{ left: 280, top: 1080, opacity: app, scale: String(0.85 + 0.15 * app) }}>
              <div style={{ position: "absolute", left: 24, right: 24, top: 70, display: "flex", gap: 12 }}>
                {[0.7, 0.5, 0.9].map((w, i) => (
                  <div key={i} style={{ flex: 1, height: 90, borderRadius: 10, background: "rgba(75,227,160,0.12)", border: "1px solid rgba(75,227,160,0.3)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 10, bottom: 10, width: `${w * 80}%`, height: 10, borderRadius: 5, background: K.green, opacity: 0.8 }} />
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </Camera>
      )}
      <Sfx name="keys" at={tWrite} />
      <Sfx name="link" at={tWrite + 26} gain={0.8} />
      <Sfx name="fix" at={tFix + 4} />
      <Sfx name="snap" at={tProj - 10} />
      <Sfx name="morph" at={tProj + 8} gain={0.6} />
    </Frame>
  );
};

// ============================================================ 6 · PROJECTS & SKILLS
export const C6Projects: React.FC = () => {
  const scene = getC("C6-Projects");
  const frame = useCurrentFrame();
  const tOne = cue(scene, "مكان");
  const tSkills = cue(scene, "Skills");
  const tSame = cue(scene, "بنفس");
  const gather = ease(frame, tOne - 30, tOne + 6);
  const cube = usePop(tOne - 4, 140, 16);
  const skills = ["تحليل بيانات", "كتابة تقارير", "تصميم عروض"];
  const out = usePop(tSame - 6, 160, 16);
  const shift = ease(frame, tSkills - 30, tSkills - 4);
  return (
    <Frame id="C6-Projects" chapter={["04", "PROJECTS & SKILLS", "مشروع واحد… وخبرات جاهزة"]}>
      <Camera from={1} to={1.06}>
        {/* scattered files and instructions get pulled into one project */}
        {Array.from({ length: 8 }).map((_, i) => {
          const sx = 80 + random(`fx${i}`) * 800;
          const sy = 480 + random(`fy${i}`) * 600;
          const x = sx + (440 - sx) * gather;
          const y = sy + (700 - sy) * gather;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, opacity: 1 - gather * 0.95, scale: String(1 - gather * 0.7), rotate: `${(random(`fr${i}`) - 0.5) * 40 * (1 - gather)}deg` }}>
              <Panel w={170} h={120} style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 16, top: 34, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon n={i % 3 === 0 ? "doc" : i % 3 === 1 ? "sheet" : "task"} size={34} />
                  <div style={{ width: 70, height: 8, borderRadius: 4, background: "rgba(233,237,246,0.2)" }} />
                </div>
              </Panel>
            </div>
          );
        })}
        {/* the project vault: a rotating glass cube */}
        {frame >= tOne - 4 && (
          <div style={{ position: "absolute", left: 540 - 60 - 120 - 260 * shift, top: 620, width: 240, height: 240, perspective: 900, scale: String(cube * (1 - shift * 0.25)) }}>
            <div style={{ position: "relative", width: 240, height: 240, transformStyle: "preserve-3d", transform: `rotateX(-22deg) rotateY(${frame * 1.4}deg)` }}>
              {[
                "rotateY(0deg)",
                "rotateY(90deg)",
                "rotateY(180deg)",
                "rotateY(270deg)",
                "rotateX(90deg)",
                "rotateX(-90deg)",
              ].map((r, i) => (
                <div key={i} style={{ position: "absolute", inset: 0, transform: `${r} translateZ(120px)`, background: "rgba(103,228,255,0.08)", border: `1.5px solid ${K.cyan}`, boxShadow: "inset 0 0 40px rgba(103,228,255,0.25)" }} />
              ))}
            </div>
            <div dir="ltr" style={{ position: "absolute", left: -40, right: -40, top: 270, textAlign: "center", fontFamily: LAT, fontWeight: 600, fontSize: 30, color: K.ink }}>Project</div>
          </div>
        )}
        {/* skills snap into a ring around Claude */}
        {frame >= tSkills - 30 && (
          <div style={{ position: "absolute", left: 610, top: 560, opacity: shift }}>
            <Holo size={240} />
          </div>
        )}
        {skills.map((s, i) => {
          const at = tSkills + i * 7;
          const p = usePop(at, 260, 14);
          if (frame < at) return null;
          return (
            <div key={s} dir="rtl" style={{ position: "absolute", left: 540, top: 560 + i * 120, width: 380, padding: "16px 22px", borderRadius: 18, background: "rgba(16,20,32,0.9)", border: `1px solid ${i === 0 ? K.cyan : K.violet}`, display: "flex", alignItems: "center", gap: 14, translate: `${(1 - p) * 300}px 0px`, opacity: p, boxShadow: `0 0 24px rgba(142,108,255,0.25)` }}>
              <Icon n="cube" size={38} color={i === 0 ? K.cyan : K.violet} />
              <div style={{ fontFamily: AR, fontWeight: 600, fontSize: 32, color: K.ink }}>{s}</div>
              <div dir="ltr" style={{ marginRight: "auto", fontFamily: MONO, fontSize: 16, color: K.dim }}>SKILL</div>
            </div>
          );
        })}
        {/* same quality, every time */}
        {frame >= tSame - 6 && (
          <div style={{ position: "absolute", left: 80, right: 140, top: 1000, display: "flex", justifyContent: "space-between", opacity: out }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 250, height: 150, borderRadius: 16, background: "rgba(16,20,32,0.9)", border: `1px solid ${K.green}`, position: "relative", translate: `0px ${(1 - out) * (40 + i * 30)}px` }}>
                <div style={{ position: "absolute", left: 18, top: 22, right: 18 }}>
                  {[0.9, 0.7, 0.8].map((w, k) => (
                    <div key={k} style={{ height: 10, width: `${w * 100}%`, borderRadius: 5, background: "rgba(233,237,246,0.2)", marginBottom: 12 }} />
                  ))}
                </div>
                <div style={{ position: "absolute", right: 14, bottom: 12 }}>
                  <Icon n="check" size={30} color={K.green} w={2.4} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Camera>
      <Sfx name="morph" at={tOne - 28} gain={0.7} />
      <Sfx name="impact" at={tOne - 4} gain={0.45} />
      <Sfx name="snap" at={tSkills} />
      <Sfx name="snap" at={tSkills + 7} />
      <Sfx name="snap" at={tSkills + 14} />
      <Sfx name="fix" at={tSame} />
    </Frame>
  );
};

// ============================================================ 7 · COMPUTER USE
export const C7Computer: React.FC = () => {
  const scene = getC("C7-Computer");
  const frame = useCurrentFrame();
  const demo = demoFile("C7");
  const tOpen = cue(scene, "يفتح");
  const tClick = cue(scene, "ويضغط");
  const tFill = cue(scene, "ويعبي");
  const tDone = cue(scene, "ويكمل");
  const win = usePop(tOpen, 170, 16);
  // cursor path: idle → window icon → button → fields → submit
  const pts: [number, number, number][] = [
    [0, 820, 600],
    [tOpen - 6, 300, 520],
    [tClick - 4, 660, 760],
    [tFill, 420, 860],
    [tFill + 26, 420, 960],
    [tDone - 4, 700, 1060],
  ];
  let cx = pts[0][1];
  let cy = pts[0][2];
  for (let i = 1; i < pts.length; i++) {
    const [a, x0, y0] = pts[i - 1];
    const [b, x1, y1] = pts[i];
    if (frame >= a) {
      const e = ease(frame, a, b);
      cx = x0 + (x1 - x0) * e;
      cy = y0 + (y1 - y0) * e;
    }
  }
  const ripple = (at: number) => (frame >= at && frame < at + 14 ? (frame - at) / 14 : -1);
  const fields = ["الاسم", "البريد", "التاريخ"];
  const fieldVals = ["راشد", "rashed@mail.com", "2026-11-20"];
  const done = frame >= tDone + 6;
  return (
    <Frame id="C7-Computer" chapter={["05", "COMPUTER USE", "يستخدم الكمبيوتر بنفسه"]} demo={!!demo}>
      {demo ? (
        <DemoVideo src={demo} w={900} h={800} style={{ left: 60, top: 420 }} />
      ) : (
        <Camera from={1} to={1.05}>
          {/* a generic desktop (not any real operating system) */}
          <Panel w={900} h={680} title="DESKTOP" style={{ left: 60, top: 440 }}>
            <div style={{ position: "absolute", left: 30, top: 60, display: "flex", flexDirection: "column", gap: 26 }}>
              {(["folder", "doc", "mail"] as const).map((n) => (
                <div key={n} style={{ width: 80, height: 80, borderRadius: 18, background: "rgba(233,237,246,0.06)", display: "grid", placeItems: "center" }}>
                  <Icon n={n} size={42} color={K.dim} />
                </div>
              ))}
            </div>
            {frame >= tOpen && (
              <div dir="rtl" style={{ position: "absolute", left: 170, top: 70, width: 680, height: 560, borderRadius: 16, background: "rgba(10,12,18,0.95)", border: `1px solid ${K.edge}`, scale: String(0.8 + 0.2 * win), opacity: win, padding: 30 }}>
                <div style={{ fontFamily: AR, fontWeight: 700, fontSize: 36, color: K.ink, marginBottom: 20 }}>نموذج حجز</div>
                {fields.map((f, i) => {
                  const st = tFill + i * 10;
                  const n = Math.max(0, Math.min(fieldVals[i].length, Math.floor((frame - st) / 1.2)));
                  return (
                    <div key={f} style={{ marginBottom: 18 }}>
                      <div style={{ fontFamily: AR, fontSize: 24, color: K.dim, marginBottom: 6 }}>{f}</div>
                      <div dir={i ? "ltr" : "rtl"} style={{ height: 58, borderRadius: 12, border: `1px solid ${frame >= st && frame < st + 24 ? K.cyan : "rgba(233,237,246,0.2)"}`, padding: "12px 16px", fontFamily: i ? MONO : AR, fontSize: 26, color: K.ink }}>{fieldVals[i].slice(0, n)}</div>
                    </div>
                  );
                })}
                <div style={{ marginTop: 10, height: 64, borderRadius: 14, background: done ? K.green : K.blue, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: AR, fontWeight: 700, fontSize: 30, color: "#fff" }}>
                  {done ? <Icon n="check" size={32} color="#fff" w={2.4} /> : null}
                  {done ? "تم الإرسال" : "إرسال"}
                </div>
              </div>
            )}
            {/* AI cursor */}
            <div style={{ position: "absolute", left: cx - 60, top: cy - 440 - 10, filter: `drop-shadow(0 0 14px ${K.cyan})` }}>
              <svg width="54" height="54" viewBox="0 0 24 24">
                <path d="M5 3l14 8-6 2-2 6z" fill="#fff" stroke={K.cyan} strokeWidth="1.2" />
              </svg>
              {[tOpen, tClick, tDone].map((t) => {
                const r = ripple(t);
                return r >= 0 ? <div key={t} style={{ position: "absolute", left: -20 * r, top: -20 * r, width: 40 * r + 10, height: 40 * r + 10, borderRadius: "50%", border: `2px solid ${K.cyan}`, opacity: 1 - r }} /> : null;
              })}
            </div>
          </Panel>
          {/* Rashed watching, relaxed */}
          <div style={{ position: "absolute", left: -40, top: 1060, scale: "0.72", transformOrigin: "top left" }}>
            <Rashed expr={done ? "confident" : "relaxed"} look={[0.7, -0.6]} rim={K.cyan} size={460} />
          </div>
        </Camera>
      )}
      <Sfx name="click" at={tOpen} />
      <Sfx name="morph" at={tOpen + 2} gain={0.5} />
      <Sfx name="click" at={tClick} />
      <Sfx name="keys" at={tFill} />
      <Sfx name="click" at={tDone} />
      <Sfx name="fix" at={tDone + 6} />
    </Frame>
  );
};

// ============================================================ 8 · WEB RESEARCH & CONNECTORS
export const C8Connect: React.FC = () => {
  const scene = getC("C8-Connect");
  const frame = useCurrentFrame();
  const tWeb = cue(scene, "الويب");
  const tLink = cue(scene, "ويتصل");
  const tools: { at: string; icon: keyof typeof I; label: string; x: number; y: number }[] = [
    { at: "إيميلك", icon: "mail", label: "Email", x: 150, y: 1000 },
    { at: "وتقويمك", icon: "cal", label: "Calendar", x: 440, y: 1080 },
    { at: "وملفاتك", icon: "folder", label: "Files", x: 730, y: 1000 },
  ];
  const all = ease(frame, cue(scene, "مربوط") - 6, cue(scene, "مربوط") + 14);
  const globe = usePop(4, 120, 18);
  const shrink = ease(frame, tLink - 10, tLink + 14);
  const results = ["مصدر ١", "مصدر ٢", "مصدر ٣"];
  return (
    <Frame id="C8-Connect" chapter={["06", "WEB SEARCH · CONNECTORS", "يبحث… ويتصل بأدواتك"]}>
      <Camera from={1} to={1.05}>
        {/* wireframe globe with a search beam */}
        <div style={{ position: "absolute", left: 540 - 60 - 220 + shrink * 0, top: 470 - shrink * 30, width: 440, height: 440, scale: String(globe * (1 - shrink * 0.45)), opacity: 1 - shrink * 0.2 }}>
          <svg width="440" height="440" viewBox="0 0 440 440" style={{ overflow: "visible" }}>
            <circle cx="220" cy="220" r="200" stroke={K.blue} strokeWidth="1.5" fill="rgba(76,141,255,0.05)" />
            {[0, 1, 2, 3, 4].map((i) => {
              const rx = Math.abs(Math.cos((frame / 40 + i * 0.63) % Math.PI)) * 200;
              return <ellipse key={i} cx="220" cy="220" rx={rx} ry="200" stroke={K.cyan} strokeOpacity="0.45" strokeWidth="1.2" fill="none" />;
            })}
            {[-120, -60, 0, 60, 120].map((y) => (
              <ellipse key={y} cx="220" cy={220 + y} rx={Math.sqrt(200 * 200 - y * y)} ry={14} stroke={K.blue} strokeOpacity="0.4" strokeWidth="1" fill="none" />
            ))}
          </svg>
        </div>
        {/* search results */}
        {results.map((r, i) => {
          const p = usePop(tWeb + 6 + i * 6, 200, 15);
          if (frame < tWeb + 6 + i * 6) return null;
          return (
            <div key={r} dir="rtl" style={{ position: "absolute", left: i === 1 ? 700 : 70, top: 520 + i * 140, width: 290, padding: "14px 18px", borderRadius: 14, background: "rgba(16,20,32,0.88)", border: `1px solid ${K.edge}`, display: "flex", alignItems: "center", gap: 12, opacity: p * (1 - shrink), translate: `${(1 - p) * (i === 1 ? 120 : -120)}px 0px` }}>
              <Icon n="globe" size={32} />
              <div style={{ fontFamily: AR, fontWeight: 600, fontSize: 28, color: K.ink }}>{r}</div>
              <div style={{ marginRight: "auto", width: 60, height: 8, borderRadius: 4, background: "rgba(233,237,246,0.2)" }} />
            </div>
          );
        })}
        {/* Claude at the centre of the network */}
        {frame >= tLink - 10 && (
          <div style={{ position: "absolute", left: 540 - 60 - 110, top: 640, opacity: shrink }}>
            <Holo size={220} />
          </div>
        )}
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
          {tools.map((t) => {
            const at = cue(scene, t.at);
            const p = ease(frame, at - 6, at + 10);
            const pulse = all > 0 ? 0.5 + 0.5 * Math.sin(frame / 4 + t.x) : 1;
            return <path key={t.at} d={`M480 ${800} Q ${(480 + t.x + 60) / 2} ${900} ${t.x + 60} ${t.y + 10}`} stroke={K.cyan} strokeOpacity={0.4 + 0.6 * pulse} strokeWidth={2.5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
          })}
        </svg>
        {tools.map((t) => {
          const at = cue(scene, t.at);
          const p = usePop(at - 4, 220, 13);
          if (frame < at - 4) return null;
          return (
            <div key={t.at} style={{ position: "absolute", left: t.x, top: t.y, width: 130, height: 130, borderRadius: 30, background: "rgba(16,20,32,0.92)", border: `1px solid ${K.cyan}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, scale: String(p), boxShadow: `0 0 ${20 + 30 * all}px rgba(103,228,255,${0.25 + 0.3 * all})` }}>
              <Icon n={t.icon} size={50} />
              <div dir="ltr" style={{ fontFamily: LAT, fontSize: 16, color: K.dim }}>{t.label}</div>
            </div>
          );
        })}
      </Camera>
      <Sfx name="scan" at={6} />
      <Sfx name="link" at={tWeb + 6} />
      <Sfx name="link" at={tWeb + 12} />
      <Sfx name="link" at={tWeb + 18} />
      <Sfx name="morph" at={tLink - 10} gain={0.6} />
      {tools.map((t) => (
        <Sfx key={t.at} name="snap" at={cue(scene, t.at) - 4} />
      ))}
      <Sfx name="riser" at={cue(scene, "مربوط") - 40} gain={0.6} />
    </Frame>
  );
};

// ============================================================ 9 · BUILD SYSTEMS (conclusion)
export const C9Build: React.FC = () => {
  const scene = getC("C9-Build");
  const frame = useCurrentFrame();
  const tIdea = cue(scene, "الفكرة", 1);
  const tBuild = cue(scene, "تبني");
  const tReal = cue(scene, "حقيقية");
  const lock = ease(frame, tIdea, tIdea + 30);
  const sys = ease(frame, tBuild - 10, tBuild + 30);
  const titleAt = tReal + 40;
  const t1 = usePop(titleAt, 120, 20);
  const t2 = usePop(titleAt + 18, 120, 20);
  const sub = usePop(titleAt + 40, 120, 20);
  const sweep = interpolate(frame, [titleAt + 10, titleAt + 50], [-30, 130], clamp);
  const pull = ease(frame, titleAt - 30, titleAt + 10);
  const mods: { icon: keyof typeof I; label: string }[] = [
    { icon: "doc", label: "Files" },
    { icon: "chart", label: "Artifacts" },
    { icon: "code", label: "Code" },
    { icon: "cube", label: "Skills" },
    { icon: "cursor", label: "Computer" },
    { icon: "globe", label: "Web" },
  ];
  return (
    <Frame id="C9-Build" mood="build" warmth={0.6} subsEnd={cue(scene, "حقيقية") + 30}>
      <AbsoluteFill style={{ opacity: 1 - pull * 0.85, scale: String(1 - pull * 0.12) }}>
        <Camera from={1.08} to={1.0}>
          {/* the modules lock into one system */}
          <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: sys }}>
            {mods.map((_, i) => {
              const x = 170 + (i % 3) * 330;
              const y = 520 + Math.floor(i / 3) * 230;
              return <line key={i} x1={x + 60} y1={y + 60} x2={480} y2={1000} stroke={K.cyan} strokeOpacity={0.35} strokeWidth={2} />;
            })}
            <line x1={230} y1={580} x2={890} y2={580} stroke={K.cyan} strokeOpacity={0.3} strokeWidth={2} />
            <line x1={230} y1={810} x2={890} y2={810} stroke={K.cyan} strokeOpacity={0.3} strokeWidth={2} />
          </svg>
          {mods.map((m, i) => {
            const fx = 80 + random(`mx${i}`) * 820;
            const fy = 420 + random(`my${i}`) * 700;
            const x = 170 + (i % 3) * 330 - 60;
            const y = 520 + Math.floor(i / 3) * 230;
            return (
              <div key={m.label} style={{ position: "absolute", left: fx + (x - fx) * lock, top: fy + (y - fy) * lock, width: 120, height: 120, borderRadius: 26, background: "rgba(16,20,32,0.9)", border: `1px solid ${K.cyan}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: `0 0 ${20 + 30 * sys}px rgba(103,228,255,${0.2 + 0.3 * sys})`, rotate: `${(1 - lock) * (random(`mr${i}`) - 0.5) * 50}deg` }}>
                <Icon n={m.icon} size={48} />
                <div dir="ltr" style={{ fontFamily: LAT, fontSize: 15, color: K.dim }}>{m.label}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: -20, top: 960 }}>
            <Rashed expr={frame > tBuild ? "confident" : "relaxed"} look={[0.4, -0.7]} rim={K.cyan} size={520} />
          </div>
          <div style={{ position: "absolute", left: 640, top: 900 }}>
            <Holo size={260} talk={0} />
          </div>
        </Camera>
      </AbsoluteFill>
      {/* final message */}
      {frame >= titleAt && (
        <div style={{ position: "absolute", left: 0, right: 60, top: 640, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {[
            { t: "THINK BEYOND CHAT.", p: t1 },
            { t: "BUILD BEYOND LIMITS.", p: t2 },
          ].map((l, i) => (
            <div key={l.t} dir="ltr" style={{ position: "relative", fontFamily: LAT, fontWeight: 800, fontSize: 68, letterSpacing: 1, whiteSpace: "nowrap", color: i ? K.cyan : K.ink, opacity: l.p, translate: `0px ${(1 - l.p) * 30}px`, filter: `blur(${(1 - l.p) * 8}px)`, overflow: "hidden", padding: "0 6px" }}>
              {l.t}
              <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep}%`, width: "18%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", mixBlendMode: "overlay" }} />
            </div>
          ))}
          <div dir="rtl" style={{ marginTop: 18, fontFamily: AR, fontWeight: 500, fontSize: 42, color: K.dim, opacity: sub }}>فكّر أبعد من المحادثة… وابنِ بلا حدود.</div>
        </div>
      )}
      <Sfx name="snap" at={tIdea + 4} />
      <Sfx name="impact" at={tBuild} gain={0.6} />
      <Sfx name="riser" at={titleAt - 50} />
      <Sfx name="impact" at={titleAt} />
    </Frame>
  );
};
