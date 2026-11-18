import React from "react";
import { Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Card, cue, getTutScene, MONO, P, SANS, Scene, SceneVoice, SERIF, Sfx, StepNumber, usePop, Words } from "./base";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Thin line icons drawn in code (24×24 grid). */
const Line: React.FC<{ d: string[]; size?: number; color?: string; w?: number }> = ({ d, size = 64, color = P.ink, w = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    {d.map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);
const ICON = {
  card: ["M3 6.5h18v11H3z", "M3 10h18", "M6.5 14.5h4"],
  tool: ["M4 7h16v10H4z", "M8 11l2 1.5L8 14", "M12 14h4"],
  mic: ["M12 3.5a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0v-5a3 3 0 0 1 3-3z", "M6 11a6 6 0 0 0 12 0", "M12 17v3.5", "M9 20.5h6"],
  spark: ["M12 3v4", "M12 17v4", "M3 12h4", "M17 12h4", "M5.6 5.6l2.8 2.8", "M15.6 15.6l2.8 2.8", "M5.6 18.4l2.8-2.8", "M15.6 8.4l2.8-2.8"],
  play: ["M8 5.5l10 6.5-10 6.5z"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  send: ["M4 12l16-8-6 16-2.5-6.5z"],
};

// ============================================================ 1 · HOOK
export const T1Hook: React.FC = () => {
  const scene = getTutScene("T1-Hook");
  const frame = useCurrentFrame();
  const tOpen = cue(scene, "انفتح");
  const tEdit = cue(scene, "مونتاج");
  const tAI = cue(scene, "بالذكاء");
  const cross = interpolate(frame, [tOpen, tOpen + 16], [0, 1], clamp);
  const stamp = usePop(tEdit, 220, 12);
  const ai = usePop(tAI, 140, 18);
  const tracks = [P.clay, P.sage, "#C9A979", P.ink2];
  return (
    <Scene intro={false}>
      {/* an editing app that never gets opened */}
      <div style={{ position: "absolute", left: 150, top: 320, width: 720, opacity: 1 - ai, scale: String(1 - ai * 0.12), filter: `grayscale(${cross * 0.8})` }}>
        <Card style={{ padding: 24, position: "relative" }}>
          <div style={{ display: "flex", gap: 9, marginBottom: 18 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: P.border }} />
            ))}
          </div>
          <div style={{ height: 250, borderRadius: 16, background: P.paper2, display: "grid", placeItems: "center" }}>
            <Line d={ICON.play} size={90} color={P.muted} />
          </div>
          {tracks.map((c, i) => (
            <div key={i} style={{ marginTop: 12, height: 26, borderRadius: 7, background: P.paper2, position: "relative" }}>
              <div style={{ position: "absolute", top: 4, bottom: 4, right: `${8 + i * 12}%`, width: `${30 + (i % 2) * 18}%`, borderRadius: 5, background: c, opacity: 0.75 }} />
            </div>
          ))}
          <svg width="720" height="540" viewBox="0 0 720 540" style={{ position: "absolute", left: 0, top: 0 }}>
            <path d="M60 60 L660 480" stroke={P.clay} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cross} />
            <path d="M660 60 L60 480" stroke={P.clay} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, cross * 2 - 1)} />
          </svg>
        </Card>
        {frame >= tEdit && (
          <div dir="rtl" style={{ position: "absolute", left: 200, top: 560, padding: "10px 34px 14px", borderRadius: 999, background: P.ink, color: P.paper, fontFamily: SANS, fontWeight: 600, fontSize: 44, scale: String(0.6 + 0.4 * stamp), opacity: stamp }}>بدون برنامج مونتاج</div>
        )}
      </div>
      {/* AI: a calm terracotta sparkle */}
      {frame >= tAI - 2 && (
        <div style={{ position: "absolute", left: 540 - 40 - 180, top: 400, width: 360, height: 360, display: "grid", placeItems: "center", scale: String(0.6 + 0.4 * ai), opacity: ai }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, ${P.claySoft} 0%, rgba(242,220,209,0) 70%)` }} />
          <div style={{ position: "absolute", inset: 60, borderRadius: "50%", border: `1.5px solid ${P.clay}`, opacity: 0.5 }} />
          <div style={{ rotate: `${frame * 0.8}deg` }}>
            <Line d={ICON.spark} size={170} color={P.clay} w={1.8} />
          </div>
        </div>
      )}
      <Words scene={scene} top={1110} size={70} maxWords={5} serif />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={tOpen} />
      <Sfx name="pop" at={tEdit} />
      <Sfx name="sparkle" at={tAI - 2} />
    </Scene>
  );
};

// ============================================================ 2 · THREE STEPS
export const T2Three: React.FC = () => {
  const scene = getTutScene("T2-Three");
  const frame = useCurrentFrame();
  const tThree = cue(scene, "ثلاث");
  const tSteps = cue(scene, "خطوات");
  const big = usePop(tThree - 2, 240, 8, 0.9);
  const steps = [
    { n: "١", icon: ICON.card, label: "اشتراك" },
    { n: "٢", icon: ICON.tool, label: "أداة" },
    { n: "٣", icon: ICON.mic, label: "صوت" },
  ];
  const p0 = usePop(tSteps, 200, 13);
  const p1 = usePop(tSteps + 5, 200, 13);
  const p2 = usePop(tSteps + 10, 200, 13);
  const ps = [p0, p1, p2];
  return (
    <Scene>
      <div style={{ position: "absolute", top: 290, left: 0, right: 60, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 340, lineHeight: 1, color: P.clay, scale: String(big) }}>٣</div>
      <div style={{ position: "absolute", top: 650, left: 0, right: 60, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 70, color: P.ink, opacity: big }}>خطوات</div>
      <div dir="rtl" style={{ position: "absolute", top: 820, left: 100, right: 160, display: "flex", justifyContent: "space-between" }}>
        {steps.map((k, i) => (
          <Card key={k.n} style={{ width: 230, height: 230, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, scale: String(frame < tSteps + i * 5 ? 0 : ps[i]), translate: `0px ${(1 - ps[i]) * 50}px` }}>
            <Line d={k.icon} size={76} />
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, color: P.ink }}>{k.label}</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: P.clay }}>{k.n}</div>
          </Card>
        ))}
      </div>
      <Words scene={scene} top={1150} size={66} />
      <SceneVoice scene={scene} />
      <Sfx name="boing" at={tThree - 2} />
      <Sfx name="pop" at={tSteps} />
      <Sfx name="pop" at={tSteps + 5} />
      <Sfx name="pop" at={tSteps + 10} />
    </Scene>
  );
};

// ============================================================ 3 · STEP 1: a Claude subscription → Claude Code writes the code
const CODE = [
  { t: "import", rest: " { Composition } from \"remotion\";", c: P.clay },
  { t: "export", rest: " const Ad = () => {", c: P.clay },
  { t: "  const", rest: " frame = useCurrentFrame();", c: "#9FBF9F" },
  { t: "  return", rest: " <Scene title=\"…\" />;", c: "#9FBF9F" },
  { t: "}", rest: "", c: "#EDE9DF" },
];

export const T3Claude: React.FC = () => {
  const scene = getTutScene("T3-Claude");
  const frame = useCurrentFrame();
  const tSub = cue(scene, "اشتراك");
  const tCode = cue(scene, "Code");
  const tWrite = cue(scene, "بيكتب");
  const card = usePop(tSub, 180, 15);
  const win = usePop(tCode - 6, 160, 18);
  const chars = Math.floor(interpolate(frame, [tWrite, tWrite + 45], [0, 140], clamp));
  let left = chars;
  return (
    <Scene>
      <StepNumber n="١" label="الخطوة الأولى" />
      {/* subscription */}
      <Card style={{ position: "absolute", left: 90, top: 520, width: 420, padding: "26px 28px", opacity: card, translate: `0px ${(1 - card) * 40}px` }}>
        <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: P.claySoft, display: "grid", placeItems: "center" }}>
            <Line d={ICON.card} size={40} color={P.clayDeep} />
          </div>
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, color: P.muted }}>اشتراك</div>
            <div dir="ltr" style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: P.ink, textAlign: "right" }}>Claude</div>
          </div>
          <div style={{ marginRight: "auto", width: 46, height: 46, borderRadius: 23, background: P.sage, display: "grid", placeItems: "center" }}>
            <Line d={ICON.check} size={28} color="#fff" w={2.4} />
          </div>
        </div>
      </Card>
      {/* Claude Code writing the video code */}
      <div style={{ position: "absolute", left: 140, right: 140, top: 720, opacity: win, translate: `0px ${(1 - win) * 50}px` }}>
        <Card dark style={{ padding: "22px 26px 28px" }}>
          <div dir="ltr" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, fontFamily: MONO, fontSize: 22, color: "#A8A49A" }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: P.clay }} />
            Claude Code
          </div>
          <div dir="ltr" style={{ fontFamily: MONO, fontSize: 22, lineHeight: 1.75, color: "#EDE9DF", whiteSpace: "pre" }}>
            {CODE.map((l, i) => {
              const full = l.t + l.rest;
              const show = Math.max(0, Math.min(full.length, left));
              left -= full.length;
              const kw = full.slice(0, Math.min(show, l.t.length));
              const rest = show > l.t.length ? full.slice(l.t.length, show) : "";
              return (
                <div key={i} style={{ minHeight: 38 }}>
                  <span style={{ color: l.c }}>{kw}</span>
                  {rest}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <Words scene={scene} top={1200} size={58} maxWords={6} />
      <SceneVoice scene={scene} />
      <Sfx name="boing" at={6} />
      <Sfx name="pop" at={tSub} />
      <Sfx name="whoosh" at={tCode - 6} />
      <Sfx name="type" at={tWrite} />
    </Scene>
  );
};

// ============================================================ 4 · STEP 2: Remotion — the command types itself
const CMD = "npx create-video@latest";

export const T4Remotion: React.FC = () => {
  const scene = getTutScene("T4-Remotion");
  const frame = useCurrentFrame();
  const tInstall = cue(scene, "تثبت");
  const tTurn = cue(scene, "تحول");
  const tMotion = cue(scene, "موشن");
  const typed = Math.max(0, Math.min(CMD.length, Math.floor((frame - tInstall) / 1.6)));
  const enterAt = tInstall + Math.ceil(CMD.length * 1.6) + 6;
  const done = frame >= enterAt + 8;
  const term = usePop(tInstall - 12, 160, 18);
  const turn = usePop(tTurn, 160, 16);
  const film = usePop(tMotion, 220, 10);
  const caret = Math.floor(frame / 9) % 2 === 0;
  return (
    <Scene>
      <StepNumber n="٢" label="الخطوة الثانية" />
      <div style={{ position: "absolute", left: 80, right: 140, top: 520, opacity: term, translate: `0px ${(1 - term) * 50}px` }}>
        <Card dark style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "16px 22px", borderBottom: "1px solid #2E2D2B" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 13, height: 13, borderRadius: 7, background: "#3A3936" }} />
            ))}
            <div style={{ flex: 1, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 22, color: "#A8A49A" }}>الطرفية</div>
          </div>
          <div dir="ltr" style={{ padding: "30px 30px 36px", fontFamily: MONO, fontSize: 40, color: "#F5F3EC", minHeight: 210 }}>
            <span style={{ color: P.clay }}>❯ </span>
            {CMD.slice(0, typed)}
            {!done && <span style={{ display: "inline-block", width: 20, height: 40, marginLeft: 4, background: caret ? P.clay : "transparent", verticalAlign: "middle" }} />}
            {done && (
              <div style={{ marginTop: 20, fontSize: 28, color: "#9FBF9F" }}>
                ✓ <span style={{ fontFamily: SANS, unicodeBidi: "isolate", direction: "rtl" }}>تم إنشاء مشروع الفيديو</span>
              </div>
            )}
          </div>
        </Card>
      </div>
      {/* code → motion video */}
      <div dir="ltr" style={{ position: "absolute", left: 0, right: 60, top: 930, display: "flex", justifyContent: "center", alignItems: "center", gap: 34, opacity: turn }}>
        <Card style={{ width: 170, height: 120, display: "grid", placeItems: "center", fontFamily: MONO, fontWeight: 600, fontSize: 44, color: P.ink2 }}>{"</>"}</Card>
        <svg width="110" height="30" viewBox="0 0 110 30">
          <path d="M4 15 H100 M86 4 L102 15 L86 26" stroke={P.clay} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - turn} />
        </svg>
        <Card style={{ width: 170, height: 120, display: "grid", placeItems: "center", background: P.clay, border: "none", scale: String(frame >= tMotion ? 0.85 + 0.15 * film : 0.85) }}>
          <Line d={ICON.play} size={56} color={P.paper} w={2} />
        </Card>
      </div>
      <Words scene={scene} top={1200} size={58} maxWords={6} />
      <SceneVoice scene={scene} />
      <Sfx name="boing" at={6} />
      <Sfx name="type" at={tInstall} />
      <Sfx name="enter" at={enterAt} />
      <Sfx name="ding" at={enterAt + 8} />
      <Sfx name="pop" at={tMotion} />
    </Scene>
  );
};

// ============================================================ 5 · STEP 3: ElevenLabs voice
export const T5Eleven: React.FC = () => {
  const scene = getTutScene("T5-Eleven");
  const frame = useCurrentFrame();
  const tSite = cue(scene, "ElevenLabs");
  const tFree = cue(scene, "مجاني");
  const tPick = cue(scene, "وتختار");
  const mic = usePop(10, 170, 15);
  const site = usePop(tSite, 170, 16);
  const badge = usePop(tFree, 220, 12);
  const list = usePop(tPick, 160, 18);
  const voices = ["ناصر", "نورة", "فهد"];
  const selected = frame >= tPick + 24 ? 0 : -1;
  return (
    <Scene>
      <StepNumber n="٣" label="الخطوة الثالثة" />
      {/* mic + waveform */}
      <Card style={{ position: "absolute", left: 560, top: 520, width: 380, height: 420, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, opacity: mic, translate: `0px ${(1 - mic) * 40}px` }}>
        <div style={{ width: 150, height: 150, borderRadius: 75, background: P.claySoft, display: "grid", placeItems: "center" }}>
          <Line d={ICON.mic} size={86} color={P.clayDeep} w={1.6} />
        </div>
        <div style={{ display: "flex", gap: 7, alignItems: "center", height: 80 }}>
          {Array.from({ length: 13 }).map((_, i) => {
            const h = 10 + Math.abs(Math.sin(frame / 4 + i * 0.8) * Math.cos(frame / 9 + i)) * 64;
            return <div key={i} style={{ width: 8, height: h, borderRadius: 4, background: i % 3 === 0 ? P.clay : P.ink2, opacity: i % 3 === 0 ? 1 : 0.55 }} />;
          })}
        </div>
      </Card>
      {/* site + free tier + voice picker */}
      <div dir="rtl" style={{ position: "absolute", left: 100, top: 520, width: 420 }}>
        <div dir="ltr" style={{ fontFamily: SANS, fontWeight: 700, fontSize: 50, color: P.ink, textAlign: "right", opacity: site }}>ElevenLabs</div>
        {frame >= tFree && (
          <div style={{ display: "inline-block", marginTop: 12, padding: "6px 22px 10px", borderRadius: 999, border: `1.5px solid ${P.sage}`, color: P.sage, fontFamily: SANS, fontWeight: 600, fontSize: 30, scale: String(0.7 + 0.3 * badge), opacity: badge }}>فيه باقة مجانية</div>
        )}
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 12, opacity: list, translate: `0px ${(1 - list) * 40}px` }}>
          {voices.map((v, i) => {
            const on = selected === i;
            return (
              <Card key={v} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", border: `1.5px solid ${on ? P.clay : P.border}`, background: on ? "#FCF1EC" : P.card, boxShadow: "none" }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: on ? P.clay : P.paper2, display: "grid", placeItems: "center" }}>
                  <Line d={on ? ICON.check : ICON.play} size={24} color={on ? "#fff" : P.ink2} w={2} />
                </div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, color: P.ink }}>{v}</div>
              </Card>
            );
          })}
        </div>
      </div>
      <Words scene={scene} top={1200} size={58} maxWords={6} />
      <SceneVoice scene={scene} />
      <Sfx name="boing" at={6} />
      <Sfx name="pop" at={tFree} />
      <Sfx name="ding" at={tPick + 24} />
    </Scene>
  );
};

// ============================================================ 6 · TELL CLAUDE WHAT YOU WANT
const PROMPT = "سوّ لي فيديو موشن إعلاني لمتجري…";

export const T6Prompt: React.FC = () => {
  const scene = getTutScene("T6-Prompt");
  const frame = useCurrentFrame();
  const tWrite = cue(scene, "تكتب");
  const tDo = cue(scene, "يسوي");
  const typed = Math.max(0, Math.min(PROMPT.length, Math.floor((frame - tWrite) / 1.1)));
  const sendAt = tWrite + Math.ceil(PROMPT.length * 1.1) + 4;
  const sent = frame >= sendAt;
  const prog = interpolate(frame, [tDo - 6, scene.durationInFrames - 14], [0, 1], clamp);
  const chat = usePop(2, 160, 18);
  return (
    <Scene>
      <div style={{ position: "absolute", left: 80, right: 140, top: 300, opacity: chat, translate: `0px ${(1 - chat) * 40}px` }}>
        <Card style={{ padding: 28 }}>
          <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: 20, minHeight: 470 }}>
            {sent && (
              <div style={{ alignSelf: "flex-start", maxWidth: "88%", padding: "16px 22px", borderRadius: 22, background: P.paper2, color: P.ink, fontFamily: SANS, fontWeight: 500, fontSize: 34 }}>{PROMPT}</div>
            )}
            {sent && (
              <div style={{ alignSelf: "flex-end", width: "82%", padding: "4px 4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: P.clay }} />
                  <span dir="ltr" style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, color: P.ink }}>Claude</span>
                </div>
                <div style={{ marginTop: 14, fontFamily: SANS, fontWeight: 500, fontSize: 30, color: P.ink2 }}>{prog >= 1 ? "خلصت، الفيديو جاهز." : "أكتب الكود وأركّب المشاهد…"}</div>
                <div style={{ marginTop: 16, height: 10, borderRadius: 5, background: P.paper2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${prog * 100}%`, borderRadius: 5, background: P.clay }} />
                </div>
                {prog >= 1 && (
                  <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px 10px", borderRadius: 999, background: P.sage, color: "#fff", fontFamily: SANS, fontWeight: 600, fontSize: 28 }}>
                    <Line d={ICON.check} size={26} color="#fff" w={2.4} /> جاهز
                  </div>
                )}
              </div>
            )}
          </div>
          {/* input */}
          <div dir="rtl" style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 20, border: `1.5px solid ${P.border}`, background: P.paper }}>
            <div style={{ flex: 1, fontFamily: SANS, fontWeight: 500, fontSize: 32, color: sent ? P.muted : P.ink, minHeight: 44 }}>
              {sent ? "اكتب طلبك…" : PROMPT.slice(0, typed)}
              {!sent && Math.floor(frame / 9) % 2 === 0 && <span style={{ color: P.clay }}>|</span>}
            </div>
            <div style={{ width: 58, height: 58, borderRadius: 16, background: P.clay, display: "grid", placeItems: "center" }}>
              <Line d={ICON.send} size={28} color="#fff" w={2} />
            </div>
          </div>
        </Card>
      </div>
      <Words scene={scene} top={1130} size={66} maxWords={5} serif />
      <SceneVoice scene={scene} />
      <Sfx name="type" at={tWrite} />
      <Sfx name="enter" at={sendAt} />
      <Sfx name="ding" at={scene.durationInFrames - 14} />
    </Scene>
  );
};

// ============================================================ 7 · CTA — دبّرها
export const T7CTA: React.FC = () => {
  const scene = getTutScene("T7-CTA");
  const frame = useCurrentFrame();
  const tName = cue(scene, "دبرها");
  const tCreative = cue(scene, "بإبداع");
  const tContact = cue(scene, "تواصل");
  const reveal = frame >= tName - 4;
  const lead = usePop(2, 160, 18);
  const name = usePop(tName - 4, 150, 11, 0.9);
  const logo = usePop(tName + 6, 170, 15);
  const sub = usePop(tCreative, 170, 18);
  const btn = usePop(tContact, 200, 14);
  const glow = 0.7 + 0.3 * Math.sin(frame / 8);
  const kinds = ["متجر", "مقهى", "مشروع"];
  return (
    <Scene>
      {!reveal && (
        <>
          {/* phone playing ads for different businesses */}
          <div style={{ position: "absolute", left: 540 - 50 - 170, top: 300, width: 340, height: 600, borderRadius: 50, border: `10px solid ${P.ink}`, background: P.card, overflow: "hidden", opacity: lead, translate: `0px ${(1 - lead) * 50}px`, boxShadow: "0 30px 70px rgba(60,45,30,0.18)" }}>
            {kinds.map((k, i) => {
              const on = Math.floor(frame / 32) % 3 === i;
              return (
                <div key={k} dir="rtl" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, opacity: on ? 1 : 0, background: [P.claySoft, "#E4ECE3", P.paper2][i] }}>
                  <Line d={ICON.play} size={70} color={P.ink} />
                  <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: P.ink }}>إعلان {k}</div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 26, right: 26, bottom: 30, height: 6, borderRadius: 3, background: "rgba(31,30,29,0.12)" }}>
              <div style={{ width: `${((frame % 96) / 96) * 100}%`, height: "100%", borderRadius: 3, background: P.clay }} />
            </div>
          </div>
          <Words scene={scene} top={1000} size={62} maxWords={5} />
        </>
      )}
      {reveal && (
        <>
          {/* particle burst */}
          {Array.from({ length: 44 }).map((_, i) => {
            const t = frame - (tName - 4);
            const a = random(`a${i}`) * Math.PI * 2;
            const v = 7 + random(`v${i}`) * 14;
            const d = v * t * Math.exp(-t / 40);
            const c = [P.clay, "#E8B79F", P.sage, "#C9A979"][i % 4];
            const sz = 6 + random(`s${i}`) * 8;
            return <div key={i} style={{ position: "absolute", left: 500 + Math.cos(a) * d, top: 720 + Math.sin(a) * d * 0.75 + t * 0.5, width: sz, height: sz, borderRadius: sz / 2, background: c, opacity: Math.max(0, 1 - t / 75) }} />;
          })}
          <div style={{ position: "absolute", left: 540 - 50 - 75, top: 330, width: 150, height: 150, borderRadius: 75, background: "#fff", border: `1.5px solid ${P.border}`, display: "grid", placeItems: "center", scale: String(logo), boxShadow: "0 16px 40px rgba(60,45,30,0.15)" }}>
            <Img src={staticFile("brand/logo-color.png")} style={{ width: 120 }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 100, top: 520, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 250, lineHeight: 1.15, color: P.ink, scale: String(interpolate(name, [0, 1], [1.6, 1])), opacity: Math.min(1, name * 1.6), textShadow: `0 0 ${50 * glow}px rgba(217,119,87,0.45)` }}>دبّرها</div>
          <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 860, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: sub, translate: `0px ${(1 - sub) * 24}px` }}>
            <div style={{ width: 50, height: 2, background: P.clay }} />
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 56, color: P.clay }}>فيديوهات إعلانية بإبداع</div>
            <div style={{ width: 50, height: 2, background: P.clay }} />
          </div>
          {frame >= tContact && (
            <div style={{ position: "absolute", left: 0, right: 100, top: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: btn, scale: String(0.85 + 0.15 * btn) }}>
              <div dir="rtl" style={{ padding: "18px 54px 22px", borderRadius: 999, background: P.ink, color: P.paper, fontFamily: SANS, fontWeight: 600, fontSize: 52 }}>تواصل معنا الحين</div>
              <div dir="ltr" style={{ fontFamily: MONO, fontWeight: 500, fontSize: 32, color: P.ink2 }}>haxztd.zid.store</div>
            </div>
          )}
          <Words scene={scene} top={1250} size={50} maxWords={5} />
        </>
      )}
      <SceneVoice scene={scene} />
      <Sfx name="impact" at={tName - 4} gain={0.8} />
      <Sfx name="sparkle" at={tName} />
      <Sfx name="pop" at={tCreative} />
      <Sfx name="ding" at={tContact} />
    </Scene>
  );
};
