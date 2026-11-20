import React from "react";
import { Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Card, cue, getA, MONO, P, SANS, Scene, SceneVoice, SERIF, Sfx, StepNumber, usePop, Words } from "./base";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });

/** Thin line icons drawn in code (24×24 grid). */
const ICON = {
  chat: ["M4 5h16v11H9l-5 4z"],
  pen: ["M4 20l4-1 11-11-3-3L5 16z", "M14 6l3 3"],
  magnet: ["M6 4v8a6 6 0 0 0 12 0V4", "M6 8h4", "M14 8h4"],
  list: ["M9 6h11", "M9 12h11", "M9 18h11", "M4.5 6h.5", "M4.5 12h.5", "M4.5 18h.5"],
  box: ["M3 8h18v12H3z", "M3 8l3-4h12l3 4", "M9 12h6"],
  clock: ["M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z", "M12 7v5l3 2"],
  user: ["M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8z", "M4 21a8 8 0 0 1 16 0"],
  copy: ["M8 8h11v12H8z", "M5 16V4h11"],
  send: ["M4 12l16-8-6 16-2.5-6.5z"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  lock: ["M6 11h12v9H6z", "M8.5 11V8a3.5 3.5 0 0 1 7 0v3"],
  mega: ["M3 10v4h4l6 4V6L7 10z", "M16.5 9a4 4 0 0 1 0 6"],
  trash: ["M4 7h16", "M9 7V4h6v3", "M6 7l1 13h10l1-13"],
  card: ["M3 6.5h18v11H3z", "M3 10h18", "M6.5 14.5h4"],
  tool: ["M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-2.5z"],
  flag: ["M5 21V4", "M5 4h12l-2 4 2 4H5"],
  key: ["M15 4a5 5 0 1 0 0 .01", "M11.5 11.5L4 19v2h3v-2h2v-2h2l1.5-1.5"],
  spark: ["M12 3v5", "M12 16v5", "M3 12h5", "M16 12h5"],
};
type IconName = keyof typeof ICON;
const Line: React.FC<{ n: IconName; size?: number; color?: string; w?: number }> = ({ n, size = 56, color = P.ink, w = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    {ICON[n].map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

/** A round badge for one AI agent, by role. */
const Agent: React.FC<{ icon: IconName; label?: string; size?: number; tint?: string; style?: React.CSSProperties }> = ({ icon, label, size = 150, tint = P.clay, style }) => (
  <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: size + 80, marginLeft: -40, ...style }}>
    <div style={{ width: size, height: size, borderRadius: "50%", background: P.card, border: `2px solid ${tint}`, display: "grid", placeItems: "center", boxShadow: "0 16px 40px rgba(60,45,30,0.12)" }}>
      <Line n={icon} size={size * 0.46} color={tint} w={1.7} />
    </div>
    {label && <div dir="rtl" style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: P.ink, whiteSpace: "nowrap" }}>{label}</div>}
  </div>
);

/** Small "illustration" note, so the chat shown is never mistaken for a real screen recording. */
const Illustrative: React.FC<{ top: number }> = ({ top }) => (
  <div dir="rtl" style={{ position: "absolute", top, left: 80, padding: "6px 16px 8px", borderRadius: 999, border: `1px solid ${P.border}`, background: "rgba(251,250,246,0.8)", fontFamily: SANS, fontSize: 22, color: P.muted }}>شكل توضيحي</div>
);

// ============================================================ 1 · THE NEED
export const A1Need: React.FC = () => {
  const scene = getA("A1-Need");
  const frame = useCurrentFrame();
  const tasks: { at: string; icon: IconName; txt: string; n: string }[] = [
    { at: "العملاء", icon: "chat", txt: "رسائل العملاء", n: "٢٤" },
    { at: "محتوى", icon: "pen", txt: "محتوى ما نزل", n: "٦" },
    { at: "الطلبات", icon: "box", txt: "طلبات تنتظر", n: "٩" },
  ];
  const tDay = cue(scene, "واليوم");
  const tEnd = cue(scene, "يكفي");
  const clockIn = usePop(4, 170, 16);
  let angle = 0;
  for (let f = 0; f < frame; f++) angle += interpolate(f, [0, tDay, tEnd + 20], [2, 6, 22], clamp);
  const shake = frame > tDay ? Math.sin(frame * 1.7) * Math.min(6, (frame - tDay) / 4) : 0;
  const day = ease(frame, tDay - 4, tEnd + 10);
  return (
    <Scene intro={false}>
      {/* the clock that never stops */}
      <div style={{ position: "absolute", left: 540 - 50 - 110, top: 260, width: 220, height: 220, scale: String(clockIn), rotate: `${shake * 0.4}deg` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: P.card, border: `3px solid ${P.ink}`, boxShadow: "0 20px 50px rgba(60,45,30,0.14)" }} />
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 108, top: 14, width: 4, height: i % 3 ? 10 : 18, background: P.ink2, transformOrigin: "2px 96px", rotate: `${i * 30}deg` }} />
        ))}
        <div style={{ position: "absolute", left: 106, top: 50, width: 8, height: 62, borderRadius: 4, background: P.ink, transformOrigin: "4px 60px", rotate: `${angle / 12}deg` }} />
        <div style={{ position: "absolute", left: 107, top: 30, width: 6, height: 82, borderRadius: 3, background: P.clay, transformOrigin: "3px 80px", rotate: `${angle}deg` }} />
        <div style={{ position: "absolute", left: 100, top: 100, width: 20, height: 20, borderRadius: 10, background: P.ink }} />
      </div>
      {/* tasks piling up */}
      {tasks.map((t, i) => {
        const at = cue(scene, t.at) - 4;
        const p = usePop(at, 260, 13);
        if (frame < at) return null;
        return (
          <div key={t.at} dir="rtl" style={{ position: "absolute", left: 150 + (i % 2) * 60, top: 560 + i * 150, width: 680, translate: `${(1 - p) * (i % 2 ? -400 : 400) + (frame > tDay ? Math.sin(frame * 1.3 + i) * 4 : 0)}px 0px`, rotate: `${(i - 1) * 2.5}deg`, opacity: Math.min(1, p * 1.5) }}>
            <Card style={{ padding: "24px 30px", display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ width: 76, height: 76, borderRadius: 20, background: P.claySoft, display: "grid", placeItems: "center" }}>
                <Line n={t.icon} size={44} color={P.clayDeep} />
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: P.ink }}>{t.txt}</div>
              <div style={{ marginRight: "auto", minWidth: 70, height: 70, borderRadius: 35, background: P.clay, color: "#fff", display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 700, fontSize: 36 }}>{t.n}</div>
            </Card>
          </div>
        );
      })}
      {/* the day runs out */}
      <div dir="rtl" style={{ position: "absolute", left: 150, right: 210, top: 1060, opacity: ease(frame, tDay - 6, tDay + 6) }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 500, fontSize: 28, color: P.ink2, marginBottom: 10 }}>
          <span>يومك</span>
          <span style={{ color: day > 0.95 ? P.clayDeep : P.ink2 }}>{day > 0.95 ? "خلص!" : ""}</span>
        </div>
        <div style={{ height: 16, borderRadius: 8, background: P.paper2, overflow: "hidden" }}>
          <div style={{ width: `${day * 100}%`, height: "100%", borderRadius: 8, background: P.clay }} />
        </div>
      </div>
      <Words scene={scene} top={1200} size={62} maxWords={5} />
      <SceneVoice scene={scene} />
      {tasks.map((t) => (
        <Sfx key={t.at} name="pop" at={cue(scene, t.at) - 4} />
      ))}
      <Sfx name="tick" at={tDay} />
      <Sfx name="tick" at={tDay + 8} />
      <Sfx name="tick" at={tDay + 16} />
      <Sfx name="thud" at={tEnd + 6} />
    </Scene>
  );
};

// ============================================================ 2 · THE IDEA: AN AI TEAM
const TEAM: { icon: IconName; label: string }[] = [
  { icon: "pen", label: "المحتوى" },
  { icon: "magnet", label: "جلب العملاء" },
  { icon: "chat", label: "خدمة العملاء" },
  { icon: "list", label: "التنظيم" },
];

export const A2Idea: React.FC = () => {
  const scene = getA("A2-Idea");
  const frame = useCurrentFrame();
  const tTeam = cue(scene, "فريق");
  const tCarry = cue(scene, "يشيل");
  const tOne = cue(scene, "أمر");
  const you = usePop(4, 160, 15);
  const pill = usePop(tOne - 2, 240, 12);
  const lift = ease(frame, tOne - 10, tOne + 8);
  const cx = 490;
  const cy = 720 - 120 * lift;
  return (
    <Scene>
      {/* links */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {TEAM.map((t, i) => {
          const a = (i / TEAM.length) * Math.PI * 2 - Math.PI / 4;
          const p = ease(frame, tTeam + i * 5, tTeam + i * 5 + 14);
          return <line key={t.label} x1={cx} y1={cy} x2={cx + Math.cos(a) * 280 * p} y2={cy + Math.sin(a) * 250 * p} stroke={P.clay} strokeWidth={3} strokeDasharray="8 10" strokeDashoffset={-frame * 1.5} opacity={0.6} />;
        })}
      </svg>
      {TEAM.map((t, i) => {
        const at = tTeam + i * 5;
        const p = usePop(at, 220, 13);
        if (frame < at) return null;
        const a = (i / TEAM.length) * Math.PI * 2 - Math.PI / 4;
        const bob = frame > tCarry ? Math.sin(frame / 8 + i) * 6 : 0;
        return <Agent key={t.label} icon={t.icon} label={t.label} size={140} style={{ left: cx + Math.cos(a) * 280 - 70, top: cy + Math.sin(a) * 250 - 70 + bob, scale: String(p) }} />;
      })}
      {/* you, in the middle */}
      <div style={{ position: "absolute", left: cx - 90, top: cy - 90, width: 180, height: 180, borderRadius: "50%", background: P.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, scale: String(you), boxShadow: "0 22px 50px rgba(31,30,29,0.25)" }}>
        <Line n="user" size={64} color={P.paper} />
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: P.paper }}>أنت</div>
      </div>
      {/* one prompt is all it takes */}
      {frame >= tOne - 2 && (
        <div dir="rtl" style={{ position: "absolute", left: 540 - 50 - 200, top: 1000, width: 400, display: "flex", justifyContent: "center", scale: String(pill) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 40px 24px", borderRadius: 999, background: P.clay, boxShadow: "0 18px 40px rgba(217,119,87,0.35)" }}>
            <Line n="copy" size={46} color="#fff" w={2} />
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, color: "#fff" }}>أمر واحد</div>
          </div>
        </div>
      )}
      <Words scene={scene} top={1220} size={60} maxWords={5} />
      <SceneVoice scene={scene} />
      {TEAM.map((t, i) => (
        <Sfx key={t.label} name="pop" at={tTeam + i * 5} gain={0.8} />
      ))}
      <Sfx name="sparkle" at={tTeam} />
      <Sfx name="thud" at={tOne - 2} />
    </Scene>
  );
};

// ============================================================ 3 · STEP 1: OPEN CLAUDE, PASTE THE PROMPT
const PROMPT: { t: string; hl?: boolean }[] = [
  { t: "أنت مهندس فريق الذكاء الاصطناعي الخاص بي. ساعدني في بناء أول فريق لي مكوّن من " },
  { t: "٣ إلى ٥ عملاء ذكاء اصطناعي", hl: true },
  { t: ". قبل أن تبدأ، " },
  { t: "اطرح عليّ أسئلة تفصيلية", hl: true },
  { t: " حول أهدافي، ومهاراتي الحالية، والوقت المتاح لدي. بعد إجابتي، قدّم لي: أفضل مهمة للبدء بها، ومدخلات ومخرجات كل عميل، و" },
  { t: "خطة العمل الكاملة", hl: true },
  { t: "." },
];
const PROMPT_LEN = PROMPT.reduce((s, p) => s + p.t.length, 0);

export const A3Step1: React.FC = () => {
  const scene = getA("A3-Step1");
  const frame = useCurrentFrame();
  const tOpen = cue(scene, "افتح");
  const tCopy = cue(scene, "وانسخ");
  const tType = cue(scene, "أنت");
  const tEnd = cue(scene, "ووقتي") + 14;
  const tSend = tEnd + 6;
  const win = usePop(tOpen, 170, 17);
  const chip = usePop(tCopy, 260, 13);
  const typed = Math.floor(interpolate(frame, [tType, tEnd], [0, PROMPT_LEN], clamp));
  const sent = frame >= tSend;
  const send = usePop(tSend, 260, 12);
  let left = typed;
  const caret = Math.floor(frame / 8) % 2 === 0 && !sent;
  return (
    <Scene>
      <StepNumber n="١" at={8} label="افتح كلود وانسخ الأمر" />
      <Illustrative top={500} />
      {frame >= tOpen && (
        <div style={{ position: "absolute", left: 80, top: 560, width: 860, opacity: Math.min(1, win * 1.4), translate: `0px ${(1 - win) * 60}px`, scale: String(0.94 + 0.06 * win) }}>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            {/* generic chat header (no product logo) */}
            <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 30px", borderBottom: `1.5px solid ${P.border}` }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: P.claySoft, display: "grid", placeItems: "center" }}>
                <Line n="spark" size={26} color={P.clayDeep} w={2.2} />
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: P.ink }}>محادثة جديدة</div>
              <div style={{ marginRight: "auto", display: "flex", gap: 8 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: P.border }} />
                ))}
              </div>
            </div>
            {/* message being written */}
            <div dir="rtl" style={{ minHeight: 470, padding: "28px 34px", fontFamily: SANS, fontWeight: 500, fontSize: 33, lineHeight: 1.7, color: P.ink, background: sent ? P.paper2 : P.card, borderRadius: sent ? 22 : 0, margin: sent ? 20 : 0, transition: "none" }}>
              {typed === 0 && <span style={{ color: P.muted }}>اكتب رسالتك…</span>}
              {PROMPT.map((seg, i) => {
                const n = Math.max(0, Math.min(seg.t.length, left));
                left -= seg.t.length;
                if (n === 0) return null;
                const full = n === seg.t.length;
                return (
                  <span key={i} style={seg.hl ? { color: full ? P.clayDeep : P.ink, background: full ? `rgba(217,119,87,${0.18})` : "transparent", borderRadius: 8, padding: "0 4px", fontWeight: full ? 700 : 500 } : undefined}>
                    {seg.t.slice(0, n)}
                  </span>
                );
              })}
              {caret && typed > 0 && <span style={{ display: "inline-block", width: 3, height: 36, background: P.clay, verticalAlign: "middle", marginRight: 2 }} />}
            </div>
            <div dir="rtl" style={{ display: "flex", alignItems: "center", padding: "0 30px 24px" }}>
              <div style={{ marginRight: "auto", width: 72, height: 72, borderRadius: 36, background: typed >= PROMPT_LEN ? P.clay : P.border, display: "grid", placeItems: "center", scale: String(sent ? 1 + 0.15 * (1 - send) : 1) }}>
                <Line n={sent ? "check" : "send"} size={36} color="#fff" w={2.2} />
              </div>
            </div>
          </Card>
        </div>
      )}
      {/* "copied" chip */}
      {frame >= tCopy && frame < tType + 20 && (
        <div dir="rtl" style={{ position: "absolute", left: 540 - 50 - 130, top: 470, width: 260, display: "flex", justifyContent: "center", scale: String(chip), opacity: 1 - ease(frame, tType + 6, tType + 20) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 26px 14px", borderRadius: 999, background: P.ink, color: P.paper, fontFamily: SANS, fontWeight: 600, fontSize: 30 }}>
            <Line n="copy" size={30} color={P.paper} w={2} /> تم النسخ
          </div>
        </div>
      )}
      <Words scene={scene} top={1330} size={52} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={tOpen} />
      <Sfx name="ding" at={tCopy} gain={0.7} />
      {Array.from({ length: Math.floor((tEnd - tType) / 10) }).map((_, i) => (
        <Sfx key={i} name="type" at={tType + i * 10} gain={0.55} />
      ))}
      <Sfx name="enter" at={tSend} />
    </Scene>
  );
};

// ============================================================ 4 · STEP 2: ANSWER PRECISELY
const QUESTIONS = ["وش هدفك الأساسي من الفريق؟", "وش المهارات اللي عندك الحين؟", "كم ساعة متاحة لك بالأسبوع؟"];
const AREAS: { at: string; icon: IconName; label: string }[] = [
  { at: "صناعة", icon: "pen", label: "صناعة المحتوى" },
  { at: "وجلب", icon: "magnet", label: "جلب العملاء" },
  { at: "وخدمة", icon: "chat", label: "خدمة العملاء" },
  { at: "والتنظيم", icon: "list", label: "التنظيم" },
];

export const A4Step2: React.FC = () => {
  const scene = getA("A4-Step2");
  const frame = useCurrentFrame();
  const tQ = cue(scene, "أسئلته");
  const tSuggest = cue(scene, "بيقترح");
  const tTip = cue(scene, "ونصيحتي");
  const tMost = cue(scene, "تاكل");
  const bubble = usePop(tQ - 6, 170, 17);
  const up = ease(frame, tSuggest - 8, tSuggest + 10);
  const focus = ease(frame, tTip, tTip + 14);
  const tag = usePop(tMost, 260, 12);
  return (
    <Scene>
      <StepNumber n="٢" at={8} label="جاوب على أسئلته بدقة" />
      {/* the model asks first */}
      {frame >= tQ - 6 && (
        <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 500, opacity: Math.min(1, bubble * 1.4) * (1 - up * 0.65), scale: String((0.94 + 0.06 * bubble) * (1 - up * 0.12)), transformOrigin: "50% 0%" }}>
          <Card style={{ padding: "26px 32px" }}>
            {QUESTIONS.map((q, i) => (
              <div key={q} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: i ? 16 : 0, opacity: ease(frame, tQ + i * 8, tQ + i * 8 + 10), translate: `${(1 - ease(frame, tQ + i * 8, tQ + i * 8 + 10)) * -30}px 0px` }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: P.claySoft, display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 700, fontSize: 26, color: P.clayDeep }}>؟</div>
                <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 34, color: P.ink }}>{q}</div>
              </div>
            ))}
          </Card>
        </div>
      )}
      {/* suggested areas */}
      <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 800, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {AREAS.map((a, i) => {
          const at = cue(scene, a.at) - 4;
          const p = usePop(at, 240, 14);
          const chosen = i === 2;
          const dim = chosen ? 1 : 1 - focus * 0.6;
          return (
            <div key={a.label} style={{ position: "relative", opacity: frame < at ? 0 : Math.min(1, p * 1.5) * dim, scale: String(frame < at ? 0.6 : (0.7 + 0.3 * p) * (chosen ? 1 + 0.06 * focus : 1)) }}>
              <Card style={{ padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, border: `2px solid ${chosen && focus > 0 ? P.clay : P.border}` }}>
                <Line n={a.icon} size={60} color={chosen && focus > 0 ? P.clay : P.ink} />
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, color: P.ink }}>{a.label}</div>
              </Card>
              {chosen && frame >= tMost && (
                <div style={{ position: "absolute", top: -22, left: "50%", translate: "-50% 0px", scale: String(tag), whiteSpace: "nowrap", padding: "6px 20px 10px", borderRadius: 999, background: P.clay, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 26 }}>ابدأ هنا</div>
              )}
            </div>
          );
        })}
      </div>
      <Words scene={scene} top={1330} size={54} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="pop" at={tQ - 6} />
      {AREAS.map((a) => (
        <Sfx key={a.label} name="pop" at={cue(scene, a.at) - 4} gain={0.8} />
      ))}
      <Sfx name="sparkle" at={tTip} />
      <Sfx name="ding" at={tMost} />
    </Scene>
  );
};

// ============================================================ 5 · STEP 3: THE FULL SYSTEM
const CHECKS: { at: string; label: string; icon: IconName }[] = [
  { at: "مهام", label: "مهام كل عميل", icon: "list" },
  { at: "ونقاط", label: "نقاط مراجعتك", icon: "user" },
  { at: "والأوامر", label: "الأوامر الجاهزة", icon: "copy" },
  { at: "والأدوات", label: "الأدوات المطلوبة", icon: "tool" },
  { at: "وخطة", label: "خطة تجربة قبل الإطلاق", icon: "flag" },
];

export const A5Step3: React.FC = () => {
  const scene = getA("A5-Step3");
  const frame = useCurrentFrame();
  const tSys = cue(scene, "النظام");
  const tReview = cue(scene, "ونقاط");
  const flow = ease(frame, tSys - 4, tSys + 20);
  const review = usePop(tReview, 220, 13);
  const nodes: { icon: IconName; label: string; x: number }[] = [
    { icon: "pen", label: "المحتوى", x: 760 },
    { icon: "chat", label: "الردود", x: 470 },
    { icon: "list", label: "التقارير", x: 180 },
  ];
  // a work item travelling from one agent to the next, stopping at your review
  const travel = frame > tSys + 20 ? ((frame - tSys - 20) % 90) / 90 : -1;
  const dotX = travel < 0 ? -100 : interpolate(travel, [0, 0.45, 0.55, 1], [760, 470, 470, 180]);
  return (
    <Scene>
      <StepNumber n="٣" at={8} label="يجهز لك النظام كامل" />
      {/* pipeline */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: flow }}>
        <line x1={760} y1={600} x2={180} y2={600} stroke={P.border} strokeWidth={4} />
        <line x1={760} y1={600} x2={760 - 580 * flow} y2={600} stroke={P.clay} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-frame * 1.5} />
        {travel >= 0 && <circle cx={dotX} cy={600} r={12} fill={P.clayDeep} />}
      </svg>
      {nodes.map((n, i) => {
        const p = usePop(tSys - 4 + i * 6, 220, 14);
        return <Agent key={n.label} icon={n.icon} label={n.label} size={120} style={{ left: n.x - 60, top: 540, scale: String(frame < tSys - 4 + i * 6 ? 0 : p) }} />;
      })}
      {frame >= tReview && (
        <div dir="rtl" style={{ position: "absolute", left: 325 - 50, top: 480, width: 150, display: "flex", justifyContent: "center", scale: String(review) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 14px 8px", borderRadius: 999, background: P.ink, color: P.paper, fontFamily: SANS, fontWeight: 600, fontSize: 22, whiteSpace: "nowrap" }}>
            <Line n="user" size={22} color={P.paper} w={2} /> مراجعتك
          </div>
        </div>
      )}
      {/* checklist */}
      <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 790 }}>
        <Card style={{ padding: "18px 30px" }}>
          {CHECKS.map((c, i) => {
            const at = cue(scene, c.at) - 2;
            const on = frame >= at;
            const p = usePop(at, 260, 13);
            return (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 0", borderTop: i ? `1.5px solid ${P.border}` : "none", opacity: on ? 1 : 0.32 }}>
                <div style={{ width: 50, height: 50, borderRadius: 25, background: on ? P.sage : P.paper2, display: "grid", placeItems: "center", scale: String(on ? 0.7 + 0.3 * p : 1) }}>
                  {on && <Line n="check" size={30} color="#fff" w={2.6} />}
                </div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 36, color: P.ink }}>{c.label}</div>
                <div style={{ marginRight: "auto" }}>
                  <Line n={c.icon} size={36} color={on ? P.clay : P.muted} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>
      <Words scene={scene} top={1330} size={54} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={tSys - 4} />
      <Sfx name="pop" at={tReview} />
      {CHECKS.map((c) => (
        <Sfx key={c.label} name="ding" at={cue(scene, c.at) - 2} gain={0.6} />
      ))}
    </Scene>
  );
};

// ============================================================ 6 · THE GOLDEN RULE
const ACTIONS: { at: string; icon: IconName; label: string }[] = [
  { at: "ينشر", icon: "mega", label: "ينشر" },
  { at: "يرسل", icon: "send", label: "يرسل" },
  { at: "يحذف", icon: "trash", label: "يحذف" },
  { at: "يدفع", icon: "card", label: "يدفع" },
];

export const A6Rule: React.FC = () => {
  const scene = getA("A6-Rule");
  const frame = useCurrentFrame();
  const tRule = cue(scene, "للقاعدة");
  const tOk = cue(scene, "موافقتك");
  const tPass = cue(scene, "كلمات");
  const title = usePop(tRule - 4, 200, 12);
  const ok = usePop(tOk - 2, 220, 11);
  const pass = usePop(tPass - 4, 220, 13);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <Scene>
      {/* title */}
      <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 280, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: Math.min(1, title * 1.4), scale: String(0.7 + 0.3 * title) }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: "#E9C46A", display: "grid", placeItems: "center", boxShadow: "0 16px 40px rgba(233,196,106,0.5)" }}>
          <svg width="66" height="66" viewBox="0 0 24 24">
            <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z" fill="#fff" />
          </svg>
        </div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 76, color: P.ink }}>القاعدة الذهبية</div>
      </div>
      {/* the four actions, each locked */}
      <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 600, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {ACTIONS.map((a) => {
          const at = cue(scene, a.at) - 3;
          const p = usePop(at, 240, 13);
          const lock = usePop(at + 8, 300, 10);
          const on = frame >= at;
          return (
            <div key={a.label} style={{ position: "relative", opacity: on ? Math.min(1, p * 1.5) : 0, scale: String(on ? 0.7 + 0.3 * p : 0.7) }}>
              <Card style={{ padding: "26px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
                <Line n={a.icon} size={54} color={P.ink2} />
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, color: P.ink }}>{a.label}</div>
              </Card>
              {frame >= at + 8 && (
                <div style={{ position: "absolute", top: -18, left: -14, width: 64, height: 64, borderRadius: 32, background: P.clayDeep, display: "grid", placeItems: "center", scale: String(lock), boxShadow: "0 8px 20px rgba(184,88,58,0.4)" }}>
                  <Line n="lock" size={34} color="#fff" w={2.2} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* only with your approval */}
      {frame >= tOk - 2 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 1000, display: "flex", justifyContent: "center", scale: String(ok) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 50px 26px", borderRadius: 999, background: P.sage, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 48, boxShadow: `0 0 0 ${10 + 12 * pulse}px rgba(111,143,114,0.18), 0 18px 40px rgba(111,143,114,0.35)` }}>
            <Line n="check" size={46} color="#fff" w={2.6} /> بموافقتك فقط
          </div>
        </div>
      )}
      {/* never share passwords */}
      {frame >= tPass - 4 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 1160, display: "flex", justifyContent: "center", opacity: Math.min(1, pass * 1.4), translate: `0px ${(1 - pass) * 30}px` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 30px", borderRadius: 20, border: `2px dashed ${P.clayDeep}`, background: P.card }}>
            <Line n="key" size={40} color={P.clayDeep} />
            <div dir="ltr" style={{ position: "relative", fontFamily: MONO, fontSize: 40, letterSpacing: 6, color: P.ink2 }}>
              ••••••••
              <div style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 4, background: P.clayDeep, scale: `${ease(frame, tPass + 6, tPass + 16)} 1`, transformOrigin: "left" }} />
            </div>
          </div>
        </div>
      )}
      <Words scene={scene} top={1330} size={54} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="impact" at={tRule - 4} gain={0.7} />
      {ACTIONS.map((a) => (
        <Sfx key={a.label} name="thud" at={cue(scene, a.at) + 5} gain={0.7} />
      ))}
      <Sfx name="ding" at={tOk - 2} />
      <Sfx name="pop" at={tPass - 4} />
    </Scene>
  );
};

// ============================================================ 7 · CTA: DABBIRHA
export const A7CTA: React.FC = () => {
  const scene = getA("A7-CTA");
  const frame = useCurrentFrame();
  const tName = cue(scene, "دبرها");
  const tService = cue(scene, "هالخدمة");
  const tLink = cue(scene, "والرابط");
  const reveal = frame >= tName - 4;
  const name = usePop(tName - 4, 150, 11, 0.9);
  const sub = usePop(tService - 2, 170, 18);
  const btn = usePop(tLink, 200, 14);
  const glow = 0.7 + 0.3 * Math.sin(frame / 8);
  const build = ease(frame, 10, cue(scene, "للنهاية") + 10);
  return (
    <Scene>
      {!reveal && (
        <>
          {/* the team being assembled end to end */}
          {TEAM.map((t, i) => {
            const a = (i / TEAM.length) * Math.PI * 2 - Math.PI / 4;
            const p = ease(frame, 6 + i * 8, 20 + i * 8);
            return <Agent key={t.label} icon={t.icon} label={t.label} size={130} style={{ left: 490 + Math.cos(a) * 270 - 65, top: 640 + Math.sin(a) * 240 - 65, opacity: p, scale: String(0.6 + 0.4 * p) }} />;
          })}
          <div style={{ position: "absolute", left: 490 - 85, top: 640 - 85, width: 170, height: 170, borderRadius: "50%", background: P.ink, display: "grid", placeItems: "center" }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 32, color: P.paper }}>مشروعك</div>
          </div>
          <div dir="rtl" style={{ position: "absolute", left: 150, right: 210, top: 1010 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 28, color: P.ink2, marginBottom: 10 }}>
              <span>من البداية</span>
              <span>للنهاية</span>
            </div>
            <div style={{ height: 16, borderRadius: 8, background: P.paper2, overflow: "hidden" }}>
              <div style={{ width: `${build * 100}%`, height: "100%", background: P.sage, borderRadius: 8 }} />
            </div>
          </div>
        </>
      )}
      {reveal && (
        <>
          {Array.from({ length: 44 }).map((_, i) => {
            const t = frame - (tName - 4);
            const a = random(`a${i}`) * Math.PI * 2;
            const v = 7 + random(`v${i}`) * 14;
            const d = v * t * Math.exp(-t / 40);
            const c = [P.clay, "#E8B79F", P.sage, "#C9A979"][i % 4];
            const sz = 6 + random(`s${i}`) * 8;
            return <div key={i} style={{ position: "absolute", left: 500 + Math.cos(a) * d, top: 560 + Math.sin(a) * d * 0.75 + t * 0.5, width: sz, height: sz, borderRadius: sz / 2, background: c, opacity: Math.max(0, 1 - t / 75) }} />;
          })}
          {[0, 1, 2].map((k) => {
            const t = ((frame - tName + k * 18) % 54) / 54;
            return <div key={k} style={{ position: "absolute", left: 540 - 50 - 230 - t * 120, top: 300 - t * 120, width: 460 + t * 240, height: 460 + t * 240, borderRadius: "50%", border: `2px solid ${P.clay}`, opacity: (1 - t) * 0.5 * Math.min(1, name) }} />;
          })}
          <div style={{ position: "absolute", left: 540 - 50 - 230, top: 300, width: 460, height: 460, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", scale: String(interpolate(name, [0, 1], [0.3, 1])), rotate: `${(1 - name) * -25}deg`, opacity: Math.min(1, name * 1.6), boxShadow: `0 0 ${60 + 50 * glow}px rgba(217,119,87,${0.35 + 0.2 * glow}), 0 24px 60px rgba(60,45,30,0.18)` }}>
            <Img src={staticFile("brand/logo-color.png")} style={{ width: 380 }} />
          </div>
          {frame >= tService - 2 && (
            <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 830, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: sub, translate: `0px ${(1 - sub) * 24}px` }}>
              <div style={{ width: 44, height: 2, background: P.clay }} />
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: P.clay }}>فريق ذكاء اصطناعي لمشروعك</div>
              <div style={{ width: 44, height: 2, background: P.clay }} />
            </div>
          )}
          {frame >= tLink && (
            <div style={{ position: "absolute", left: 0, right: 100, top: 980, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: btn, scale: String(0.85 + 0.15 * btn) }}>
              <svg width="54" height="60" viewBox="0 0 120 130" style={{ translate: `0px ${Math.abs(Math.sin((frame - tLink) / 6)) * -14}px` }}>
                <path d="M60 6 L112 62 L80 62 L80 124 L40 124 L40 62 L8 62 Z" fill={P.clay} />
              </svg>
              <div dir="rtl" style={{ padding: "18px 54px 22px", borderRadius: 999, background: P.ink, color: P.paper, fontFamily: SANS, fontWeight: 600, fontSize: 52 }}>الرابط في البايو</div>
              <div dir="ltr" style={{ fontFamily: MONO, fontWeight: 500, fontSize: 32, color: P.ink2 }}>haxztd.zid.store</div>
            </div>
          )}
        </>
      )}
      <Words scene={scene} top={1300} size={50} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="riser" at={tName - 34} />
      <Sfx name="impact" at={tName - 4} gain={0.8} />
      <Sfx name="sparkle" at={tName} />
      <Sfx name="pop" at={tService - 2} />
      <Sfx name="whoosh" at={tLink - 3} />
      <Sfx name="ding" at={tLink} />
    </Scene>
  );
};
