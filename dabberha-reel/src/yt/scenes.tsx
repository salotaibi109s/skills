import React from "react";
import { Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Card, cue, getY, MONO, P, SANS, Scene, SceneVoice, SERIF, Sfx, StepNumber, usePop, Words, type YSceneId } from "./base";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });

const ICON: Record<string, string[]> = {
  play: ["M9 7.5l8 4.5-8 4.5z"],
  search: ["M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14z", "M16 16l4.5 4.5"],
  pen: ["M4 20l4-1 11-11-3-3L5 16z", "M14 6l3 3"],
  chart: ["M4 20V10", "M10 20V4", "M16 20v-7", "M22 20H2"],
  film: ["M4 5h16v14H4z", "M8 5v14", "M16 5v14", "M4 9h4", "M16 9h4", "M4 15h4", "M16 15h4"],
  coin: ["M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16z", "M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.2 0-2.2-.6-2.6-1.6", "M12 6.5v1.5", "M12 16v1.5"],
  mic: ["M12 3.5a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0v-5a3 3 0 0 1 3-3z", "M6 11a6 6 0 0 0 12 0", "M12 17v3.5"],
  image: ["M4 5h16v14H4z", "M4 16l5-5 4 4 3-3 4 4", "M15.5 8.5h.01"],
  send: ["M4 12l16-8-6 16-2.5-6.5z"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  repeat: ["M4 9a6 6 0 0 1 10-3l2 2", "M16 4v4h-4", "M20 15a6 6 0 0 1-10 3l-2-2", "M8 20v-4h4"],
  user: ["M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8z", "M4 21a8 8 0 0 1 16 0"],
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
};
const Line: React.FC<{ n: string; size?: number; color?: string; w?: number }> = ({ n, size = 48, color = P.ink, w = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    {ICON[n].map((d, i) => (
      <path key={i} d={d} />
    ))}
  </svg>
);

/** The prompt being typed into a chat card, then sent; it slides up to make room for the result. */
const PromptCard: React.FC<{ text: string; from?: number; to: number; lift: number }> = ({ text, from = 14, to, lift }) => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(frame, [from, to], [0, text.length], clamp));
  const sent = frame >= to + 4;
  const pop = usePop(6, 170, 17);
  return (
    <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 470 - 30 * lift, opacity: Math.min(1, pop * 1.4), translate: `0px ${(1 - pop) * 50}px`, scale: String(1 - 0.08 * lift), transformOrigin: "50% 0%" }}>
      <Card style={{ padding: "22px 26px", background: sent ? P.paper2 : P.card }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: P.claySoft, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 18, color: P.clayDeep }}>⌘</div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: P.muted }}>{sent ? "تم الإرسال" : "الأمر"}</div>
          <div style={{ marginRight: "auto", fontFamily: SANS, fontSize: 20, color: P.muted, border: `1px solid ${P.border}`, borderRadius: 999, padding: "2px 12px 4px" }}>شكل توضيحي</div>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 29, lineHeight: 1.6, color: P.ink, maxHeight: 290 - 150 * lift, overflow: "hidden" }}>
          {text.slice(0, n)}
          {!sent && <span style={{ display: "inline-block", width: 3, height: 30, background: P.clay, verticalAlign: "middle", marginRight: 2, opacity: Math.floor(frame / 7) % 2 ? 0.2 : 1 }} />}
        </div>
      </Card>
      {Array.from({ length: Math.floor((to - from) / 8) }).map((_, i) => (
        <Sfx key={i} name="type" at={from + i * 8} gain={0.45} />
      ))}
      <Sfx name="enter" at={to + 4} gain={0.8} />
    </div>
  );
};

/** Shared layout for the six steps: number, typed prompt, then the result panel. */
const Step: React.FC<{ id: YSceneId; n: string; label: string; prompt: string; typeTo: number; resultAt: number; children: React.ReactNode }> = ({ id, n, label, prompt, typeTo, resultAt, children }) => {
  const scene = getY(id);
  const frame = useCurrentFrame();
  const lift = ease(frame, resultAt - 8, resultAt + 10);
  const res = usePop(resultAt, 160, 17);
  return (
    <Scene>
      <StepNumber n={n} at={6} label={label} />
      <PromptCard text={prompt} to={typeTo} lift={lift} />
      {frame >= resultAt && (
        <div style={{ position: "absolute", left: 80, right: 140, top: 760, opacity: Math.min(1, res * 1.4), translate: `0px ${(1 - res) * 50}px` }}>
          <Card style={{ padding: "26px 28px", minHeight: 480 }}>{children}</Card>
        </div>
      )}
      <Words scene={scene} top={1330} size={50} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="sparkle" at={resultAt} gain={0.7} />
    </Scene>
  );
};

const Row: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, at + 10);
  return <div style={{ opacity: p, translate: `${(1 - p) * -30}px 0px`, ...style }}>{children}</div>;
};

// ============================================================ 1 · HOOK
const ROLES = [
  { icon: "arrow", t: "مخطط استراتيجي" },
  { icon: "search", t: "باحث سوق" },
  { icon: "pen", t: "كاتب محتوى" },
  { icon: "chart", t: "خبير خوارزمية" },
  { icon: "film", t: "مدير إنتاج" },
  { icon: "coin", t: "مستشار دخل" },
  { icon: "user", t: "محلل بيانات" },
];
export const Y1Hook: React.FC = () => {
  const scene = getY("Y1-Hook");
  const frame = useCurrentFrame();
  const tClaude = cue(scene, "كلود");
  const tSix = cue(scene, "بسبع");
  const ch = usePop(4, 160, 16);
  const team = ease(frame, tClaude - 4, tClaude + 20);
  const six = usePop(tSix - 2, 240, 11);
  return (
    <Scene intro={false}>
      {/* an empty channel */}
      <div dir="rtl" style={{ position: "absolute", left: 140, right: 200, top: 300, opacity: Math.min(1, ch * 1.4) * (1 - team * 0.85), scale: String((0.9 + 0.1 * ch) * (1 - team * 0.2)) }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ height: 150, background: `linear-gradient(135deg, ${P.paper2}, ${P.claySoft})` }} />
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 28px 28px" }}>
            <div style={{ width: 110, height: 110, borderRadius: 55, marginTop: -60, background: P.card, border: `4px solid ${P.card}`, boxShadow: "0 8px 20px rgba(0,0,0,0.1)", display: "grid", placeItems: "center" }}>
              <Line n="user" size={60} color={P.muted} />
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: P.ink }}>قناتك الجديدة</div>
              <div style={{ fontFamily: SANS, fontSize: 28, color: P.muted }}>٠ مشترك · ٠ فيديو</div>
            </div>
            <div style={{ marginRight: "auto", padding: "10px 26px 14px", borderRadius: 999, background: P.ink, color: P.paper, fontFamily: SANS, fontWeight: 700, fontSize: 28 }}>اشتراك</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "0 28px 28px" }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ height: 120, borderRadius: 16, border: `2px dashed ${P.border}`, display: "grid", placeItems: "center" }}>
                <Line n="play" size={44} color={P.border} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      {/* the team */}
      {team > 0 &&
        ROLES.map((r, i) => {
          const a = (i / ROLES.length) * Math.PI * 2 - Math.PI / 2;
          const p = ease(frame, tClaude - 4 + i * 4, tClaude + 10 + i * 4);
          return (
            <div key={r.t} style={{ position: "absolute", left: 490 + Math.cos(a) * 310 * p - 90, top: 640 + Math.sin(a) * 320 * p - 70, width: 180, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: p }}>
              <div style={{ width: 100, height: 100, borderRadius: 50, background: P.card, border: `2px solid ${P.clay}`, display: "grid", placeItems: "center", boxShadow: "0 12px 30px rgba(60,45,30,0.12)" }}>
                <Line n={r.icon} size={46} color={P.clay} />
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: P.ink, whiteSpace: "nowrap" }}>{r.t}</div>
            </div>
          );
        })}
      {team > 0 && (
        <div style={{ position: "absolute", left: 490 - 80, top: 640 - 80, width: 160, height: 160, borderRadius: 80, background: P.ink, display: "grid", placeItems: "center", scale: String(team), fontFamily: SANS, fontWeight: 700, fontSize: frame >= tSix ? 72 : 34, color: P.paper }}>
          <span style={{ scale: String(frame >= tSix ? 0.6 + 0.4 * six : 1) }}>{frame >= tSix ? "٧" : "فريقك"}</span>
        </div>
      )}
      <Words scene={scene} top={1180} size={60} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="pop" at={4} />
      <Sfx name="sparkle" at={tClaude} />
      {ROLES.map((r, i) => (
        <Sfx key={r.t} name="pop" at={tClaude - 4 + i * 4} gain={0.6} />
      ))}
      <Sfx name="thud" at={tSix - 2} />
    </Scene>
  );
};


// ============================================================ 1b · MASTER PLAN
export const Y1bPlan: React.FC = () => {
  const scene = getY("Y1b-Plan");
  const frame = useCurrentFrame();
  const inputs: [string, string][] = [["مجالك", "المجال"], ["وجمهورك", "الجمهور"], ["ومنافسينك", "المنافسين"]];
  const parts: [string, string][] = [["هوية", "هوية القناة وتموضعها"], ["ومحاور", "محاور المحتوى"], ["وجدول", "جدول تنفيذ أسبوعي"]];
  const tWeek = cue(scene, "وجدول");
  const days = ["سبت", "أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"];
  const plan: Record<number, string> = { 0: "فيديو", 2: "شورتس", 4: "فيديو", 5: "تحليل" };
  return (
    <Step id="Y1b-Plan" n="١" label="نظام متكامل من الصفر للربح" typeTo={cue(scene, "يحلل") - 6} resultAt={cue(scene, "يحلل")} prompt="تصرّف كخبير عالمي في استراتيجيات يوتيوب وتحقيق الأرباح. صمّم نظام عمل متكاملاً لنقل قناتي من الصفر إلى استيفاء شروط تحقيق الربح: حلّل مجالي وجمهوري ومنافسيّ ومواردي وأهدافي، ثم أنشئ خطة تشمل هوية القناة ومحاور المحتوى واستراتيجية النشر وخطة الدخل وجدولاً أسبوعياً للتنفيذ.">
      <div dir="rtl">
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {inputs.map(([at, l]) => {
            const p = ease(frame, cue(scene, at) - 4, cue(scene, at) + 6);
            return (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px 10px", borderRadius: 999, background: P.paper2, opacity: p, scale: String(0.7 + 0.3 * p) }}>
                <Line n="search" size={24} color={P.ink2} />
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 25, color: P.ink }}>{l}</div>
              </div>
            );
          })}
        </div>
        {parts.map(([at, l]) => (
          <Row key={l} at={cue(scene, at) - 4}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderTop: `1px solid ${P.border}` }}>
              <Line n="check" size={32} color={P.sage} w={2.4} />
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: P.ink }}>{l}</div>
            </div>
          </Row>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 10, opacity: ease(frame, tWeek, tWeek + 10) }}>
          {days.map((d, i) => {
            const on = plan[i] && frame >= tWeek + 6 + i * 4;
            return (
              <div key={d} style={{ borderRadius: 12, padding: "8px 2px 10px", textAlign: "center", background: on ? P.claySoft : P.paper2, border: `1.5px solid ${on ? P.clay : "transparent"}` }}>
                <div style={{ fontFamily: SANS, fontSize: 18, color: P.ink2 }}>{d}</div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 17, color: on ? P.clayDeep : P.muted, minHeight: 24 }}>{on ? plan[i] : "—"}</div>
              </div>
            );
          })}
        </div>
      </div>
      {inputs.map(([at]) => (
        <Sfx key={at} name="pop" at={cue(scene, at) - 4} gain={0.6} />
      ))}
      {parts.map(([at]) => (
        <Sfx key={at} name="tick" at={cue(scene, at) - 4} gain={0.6} />
      ))}
      <Sfx name="ding" at={tWeek + 10} gain={0.7} />
    </Step>
  );
};

// ============================================================ 2 · NICHE
export const Y2Niche: React.FC = () => {
  const scene = getY("Y2-Niche");
  const frame = useCurrentFrame();
  const tA = cue(scene, "يحلل");
  const ideas = ["كيف تبدأ مشروعك بـ ٥٠٠ ريال", "٥ أدوات ذكاء اصطناعي مجانية", "أخطاء تخسّرك عملاءك", "يوم كامل بدون جوال", "سر الفيديوهات اللي تنتشر"];
  const meters: [string, number, string][] = [
    ["الطلب", 0.86, cue(scene, "الطلب") as unknown as string],
    ["المنافسة", 0.45, cue(scene, "والمنافسة") as unknown as string],
    ["فرص الربح", 0.78, cue(scene, "وفرص") as unknown as string],
  ];
  const tIdeas = cue(scene, "أول");
  return (
    <Step id="Y2-Niche" n="٢" label="اختيار المجال المناسب" typeTo={tA - 6} resultAt={tA} prompt="تصرّف كباحث متخصص في تحليل الأسواق وقنوات يوتيوب. حلّل طلب الجمهور وحجم المنافسة وفرص الظهور وإمكانيات تحقيق الدخل، وأنشئ هوية فريدة لقناتي، وأول ١٠٠ فكرة فيديو مرتبة حسب إمكانات نموها.">
      <div dir="rtl">
        {meters.map(([l, v, at]) => {
          const p = ease(frame, Number(at), Number(at) + 18);
          return (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
              <div style={{ width: 150, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: P.ink }}>{l}</div>
              <div style={{ flex: 1, height: 16, borderRadius: 8, background: P.paper2, overflow: "hidden" }}>
                <div style={{ width: `${v * p * 100}%`, height: "100%", background: l === "المنافسة" ? P.sage : P.clay, borderRadius: 8 }} />
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18, marginBottom: 8, opacity: ease(frame, tIdeas - 6, tIdeas + 6) }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: P.ink }}>أفكار الفيديو</div>
          <div style={{ padding: "4px 16px 6px", borderRadius: 999, background: P.clay, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 24 }}>١٠٠ فكرة</div>
        </div>
        {ideas.map((t, i) => (
          <Row key={t} at={tIdeas + i * 6}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 0", borderTop: `1px solid ${P.border}` }}>
              <div style={{ width: 36, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: P.clay }}>#{["١", "٢", "٣", "٤", "٥"][i]}</div>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, color: P.ink }}>{t}</div>
            </div>
          </Row>
        ))}
      </div>
      {meters.map(([l, , at]) => (
        <Sfx key={l} name="tick" at={Number(at)} gain={0.6} />
      ))}
      <Sfx name="ding" at={tIdeas} gain={0.7} />
    </Step>
  );
};

// ============================================================ 3 · VIRAL CONTENT
export const Y3Viral: React.FC = () => {
  const scene = getY("Y3-Viral");
  const frame = useCurrentFrame();
  const tT = cue(scene, "والعناوين");
  const tH = cue(scene, "وبدايات");
  const tTh = cue(scene, "الصور");
  const tS = cue(scene, "والسيناريو");
  const thumb = usePop(tTh - 4, 220, 13);
  return (
    <Step id="Y3-Viral" n="٣" label="محرك الفيديوهات المنتشرة" typeTo={cue(scene, "يكتب") - 4} resultAt={cue(scene, "يكتب")} prompt="تصرّف كخبير استراتيجيات محتوى يوتيوب. أنشئ أفكار الفيديوهات، والمقدمات الجذابة، والعناوين، وأفكار الصور المصغّرة، والسيناريوهات الكاملة، وحلّل سبب قدرة كل فكرة على جذب المشاهدين.">
      <div dir="rtl">
        {/* thumbnail idea */}
        <div style={{ position: "relative", height: 250, borderRadius: 18, overflow: "hidden", background: "linear-gradient(120deg, #2a070d, #5a0d1b)", scale: String(frame >= tTh - 4 ? thumb : 0.001), opacity: frame >= tTh - 4 ? 1 : 0 }}>
          <div style={{ position: "absolute", left: 40, top: 40, width: 170, height: 170, borderRadius: 85, background: `radial-gradient(circle at 40% 35%, #f0c7a8, ${P.clayDeep})` }} />
          <div style={{ position: "absolute", right: 30, top: 40, fontFamily: SANS, fontWeight: 700, fontSize: 58, color: "#fff", lineHeight: 1.15, textAlign: "right" }}>
            ٥٠٠ ريال
            <br />
            <span style={{ color: "#FFD23F" }}>وبدأت!</span>
          </div>
          <div style={{ position: "absolute", left: 220, top: 110 }}>
            <Line n="arrow" size={70} color="#FFD23F" w={2.6} />
          </div>
        </div>
        <Row at={tT} style={{ marginTop: 16 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: P.ink }}>كيف بدأت مشروعي بـ ٥٠٠ ريال… وش صار بعد شهر؟</div>
        </Row>
        <Row at={tH} style={{ marginTop: 12 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 30, color: P.clayDeep }}>«لو قلت لك إن أول ٥٠٠ ريال غيّرت كل شي…»</div>
        </Row>
        <Row at={tS} style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {["البداية", "المشكلة", "التحول", "الخاتمة"].map((t) => (
              <div key={t} style={{ padding: "6px 16px 8px", borderRadius: 999, background: P.claySoft, fontFamily: SANS, fontWeight: 600, fontSize: 22, color: P.clayDeep }}>{t}</div>
            ))}
          </div>
        </Row>
      </div>
      <Sfx name="pop" at={tT} gain={0.7} />
      <Sfx name="pop" at={tH} gain={0.7} />
      <Sfx name="boing" at={tTh - 4} gain={0.7} />
      <Sfx name="ding" at={tS} gain={0.7} />
    </Step>
  );
};

// ============================================================ 4 · ALGORITHM
export const Y4Algo: React.FC = () => {
  const scene = getY("Y4-Algo");
  const frame = useCurrentFrame();
  const tiles: { at: string; l: string; v: string }[] = [
    { at: "النقر", l: "نسبة النقر", v: "٦٫٨٪" },
    { at: "المشاهدة", l: "مدة المشاهدة", v: "٤:١٢" },
    { at: "بالجمهور", l: "الاحتفاظ", v: "٥٢٪" },
  ];
  const tPlan = cue(scene, "خطة");
  const curve = ease(frame, cue(scene, "والاحتفاظ"), cue(scene, "والاحتفاظ") + 30);
  return (
    <Step id="Y4-Algo" n="٤" label="فهم الخوارزمية والنمو" typeTo={cue(scene, "الخوارزمية") + 20} resultAt={cue(scene, "نسبة") - 4} prompt="تصرّف كخبير في خوارزمية يوتيوب. علّمني كيف أنمّي قناتي من خلال فهم معدل النقر ووقت المشاهدة والاحتفاظ بالجمهور، وصمّم استراتيجية نمو تتضمن معدل النشر وأساليب الاختبار.">
      <div dir="rtl">
        <div style={{ display: "flex", gap: 14 }}>
          {tiles.map((t) => {
            const at = cue(scene, t.at) - 4;
            const p = ease(frame, at, at + 10);
            return (
              <div key={t.l} style={{ flex: 1, padding: "16px 14px", borderRadius: 18, background: P.paper2, opacity: p, scale: String(0.8 + 0.2 * p) }}>
                <div style={{ fontFamily: SANS, fontSize: 22, color: P.ink2 }}>{t.l}</div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, color: P.ink }}>{t.v}</div>
              </div>
            );
          })}
        </div>
        <svg width="740" height="170" viewBox="0 0 740 170" style={{ marginTop: 16 }}>
          <path d="M10 20 C 120 40, 200 70, 300 82 S 520 100, 730 120" stroke={P.clay} strokeWidth="5" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - curve} strokeLinecap="round" />
          <line x1="10" y1="160" x2="730" y2="160" stroke={P.border} strokeWidth="2" />
          <text x="730" y="150" textAnchor="end" fontFamily={SANS} fontSize="20" fill={P.muted} opacity={curve}>منحنى الاحتفاظ</text>
        </svg>
        <Row at={tPlan}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
            <Line n="check" size={34} color={P.sage} w={2.4} />
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: P.ink }}>خطة النمو: ٣ فيديوهات بالأسبوع + اختبار العناوين</div>
          </div>
        </Row>
      </div>
      {tiles.map((t) => (
        <Sfx key={t.l} name="pop" at={cue(scene, t.at) - 4} gain={0.7} />
      ))}
      <Sfx name="ding" at={tPlan} gain={0.7} />
    </Step>
  );
};

// ============================================================ 5 · PRODUCTION SYSTEM
export const Y5Prod: React.FC = () => {
  const scene = getY("Y5-Prod");
  const frame = useCurrentFrame();
  const steps: { at: string; icon: string; t: string }[] = [
    { at: "البحث", icon: "search", t: "البحث" },
    { at: "والسيناريو", icon: "pen", t: "السيناريو" },
    { at: "والتعليق", icon: "mic", t: "التعليق الصوتي" },
    { at: "المونتاج", icon: "film", t: "المونتاج" },
    { at: "وإعادة", icon: "image", t: "الصورة المصغّرة والنشر" },
    { at: "الشورتس", icon: "repeat", t: "شورتس" },
    { at: "وتيك", icon: "repeat", t: "تيك توك وريلز" },
  ];
  return (
    <Step id="Y5-Prod" n="٥" label="نظام إنتاج بالذكاء الاصطناعي" typeTo={cue(scene, "الاصطناعي") + 14} resultAt={cue(scene, "البحث") - 6} prompt="تصرّف كمدير إنتاج محترف لقنوات يوتيوب. صمّم سير عمل يعتمد على الذكاء الاصطناعي لكل مرحلة: البحث، والسيناريو، والتعليق الصوتي، والمونتاج، والصور المصغّرة، والنشر، وإعادة توظيف المحتوى.">
      <div dir="rtl" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {steps.map((s, i) => {
          const at = cue(scene, s.at) - 4;
          const on = frame >= at;
          const p = ease(frame, at, at + 10);
          return (
            <div key={s.t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 18, background: on ? P.claySoft : P.paper2, border: `2px solid ${on ? P.clay : "transparent"}`, opacity: 0.35 + 0.65 * p, gridColumn: i === steps.length - 1 ? "1 / span 2" : undefined }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: on ? P.clay : P.border, display: "grid", placeItems: "center" }}>
                <Line n={s.icon} size={30} color="#fff" w={2} />
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: P.ink }}>{s.t}</div>
              <div style={{ marginRight: "auto", fontFamily: SANS, fontWeight: 700, fontSize: 22, color: P.clay }}>{["١", "٢", "٣", "٤", "٥", "٦", "٧"][i]}</div>
            </div>
          );
        })}
      </div>
      {steps.map((s) => (
        <Sfx key={s.t} name="tick" at={cue(scene, s.at) - 4} gain={0.6} />
      ))}
    </Step>
  );
};

// ============================================================ 6 · MONETIZATION
export const Y6Money: React.FC = () => {
  const scene = getY("Y6-Money");
  const frame = useCurrentFrame();
  const phases: { t: string; items: { at: string; l: string }[] }[] = [
    { t: "البداية", items: [{ at: "والتسويق", l: "التسويق بالعمولة" }] },
    { t: "النمو", items: [{ at: "برنامج", l: "برنامج شركاء يوتيوب" }, { at: "والرعايات", l: "الرعايات" }] },
    { t: "التوسع", items: [{ at: "والمنتجات", l: "المنتجات الرقمية" }] },
  ];
  const tWhen = cue(scene, "ومتى");
  const line = ease(frame, tWhen - 4, tWhen + 30);
  return (
    <Step id="Y6-Money" n="٦" label="نظام متكامل للدخل" typeTo={cue(scene, "الدخل") + 14} resultAt={cue(scene, "برنامج") - 6} prompt="تصرّف كخبير استراتيجيات أعمال لصنّاع المحتوى. صمّم نظاماً متكاملاً لتحقيق الدخل من قناتي، ووضّح متى أبدأ بكل وسيلة بناءً على مراحل نمو القناة.">
      <div dir="rtl" style={{ position: "relative", paddingRight: 34 }}>
        <div style={{ position: "absolute", right: 10, top: 10, width: 4, height: `${88 * line}%`, background: P.clay, borderRadius: 2 }} />
        {phases.map((ph, k) => (
          <div key={ph.t} style={{ position: "relative", marginBottom: 22 }}>
            <div style={{ position: "absolute", right: -33, top: 8, width: 18, height: 18, borderRadius: 9, background: frame >= tWhen + k * 8 ? P.clay : P.border }} />
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: P.ink, marginBottom: 8 }}>مرحلة {ph.t}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {ph.items.map((it) => {
                const at = cue(scene, it.at) - 4;
                const p = ease(frame, at, at + 10);
                return (
                  <div key={it.l} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px 12px", borderRadius: 999, background: P.claySoft, opacity: p, scale: String(0.7 + 0.3 * p) }}>
                    <Line n="coin" size={28} color={P.clayDeep} />
                    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: P.clayDeep }}>{it.l}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {phases.flatMap((ph) => ph.items).map((it) => (
        <Sfx key={it.l} name="pop" at={cue(scene, it.at) - 4} gain={0.7} />
      ))}
      <Sfx name="ding" at={tWhen} gain={0.7} />
    </Step>
  );
};

// ============================================================ 7 · ANALYTICS
export const Y7Data: React.FC = () => {
  const scene = getY("Y7-Data");
  const frame = useCurrentFrame();
  const tRead = cue(scene, "يقرا");
  const tWin = cue(scene, "نجح");
  const tFix = cue(scene, "الضعيف");
  const draw = ease(frame, tRead, tRead + 40);
  const pts = [120, 110, 125, 95, 80, 88, 60, 50, 35];
  const d = pts.map((y, i) => `${i ? "L" : "M"}${10 + i * 90} ${y}`).join(" ");
  return (
    <Step id="Y7-Data" n="٧" label="تحسين الأداء بالتحليلات" typeTo={cue(scene, "لقناتك") + 16} resultAt={tRead - 6} prompt="تصرّف كمحلل بيانات متخصص في يوتيوب. حلّل أهم المؤشرات، وأنشئ آليات للمراجعة الأسبوعية والشهرية تساعد على اكتشاف أنماط المحتوى الناجح وتحسين الفيديوهات الضعيفة.">
      <div dir="rtl">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: P.ink }}>المشاهدات الأسبوعية</div>
          <div style={{ fontFamily: SANS, fontSize: 22, color: P.muted }}>مثال</div>
        </div>
        <svg width="740" height="150" viewBox="0 0 740 150" style={{ marginTop: 8 }}>
          <path d={d} stroke={P.clay} strokeWidth="5" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} strokeLinejoin="round" strokeLinecap="round" />
          <line x1="0" y1="140" x2="740" y2="140" stroke={P.border} strokeWidth="2" />
        </svg>
        <Row at={tWin} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderRadius: 16, background: "rgba(43,166,64,0.16)" }}>
            <Line n="check" size={32} color={P.sage} w={2.6} />
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: P.ink }}>نجح: فيديوهات الشروحات القصيرة</div>
          </div>
        </Row>
        <Row at={tFix} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderRadius: 16, background: P.claySoft }}>
            <Line n="repeat" size={32} color={P.clayDeep} w={2.2} />
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: P.ink }}>حسّن: العناوين الطويلة وبداية الفيديو</div>
          </div>
        </Row>
      </div>
      <Sfx name="ding" at={tWin} gain={0.7} />
      <Sfx name="pop" at={tFix} gain={0.7} />
    </Step>
  );
};

// ============================================================ 8 · THE HONEST PART
export const Y8Truth: React.FC = () => {
  const scene = getY("Y8-Truth");
  const frame = useCurrentFrame();
  const tC = cue(scene, "كلود");
  const tYou = cue(scene, "والنتيجة");
  const tKeep = cue(scene, "استمرارك");
  const a = usePop(tC - 4, 180, 15);
  const b = usePop(tYou - 4, 180, 15);
  const days = Math.floor(interpolate(frame, [tKeep - 2, tKeep + 50], [0, 21], clamp));
  return (
    <Scene>
      <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 330, display: "flex", gap: 22 }}>
        {[
          { p: a, t: "كلود", lines: ["يخطط معك", "يختصر عليك الطريق"], c: P.clay },
          { p: b, t: "أنت", lines: ["الاستمرار", "جودة المحتوى"], c: P.ink },
        ].map((c) => (
          <div key={c.t} style={{ flex: 1, opacity: Math.min(1, c.p * 1.4), translate: `0px ${(1 - c.p) * 40}px` }}>
            <Card style={{ padding: "26px 24px", height: 300 }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, color: c.c, marginBottom: 14 }}>{c.t}</div>
              {c.lines.map((l) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Line n="check" size={30} color={c.c} w={2.4} />
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: P.ink }}>{l}</div>
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>
      {/* a streak of publishing days */}
      {frame >= tKeep - 2 && (
        <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 700 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: P.ink2, marginBottom: 12 }}>استمرارك يوم بعد يوم</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} style={{ height: 70, borderRadius: 14, background: i < days ? P.clay : P.paper2, display: "grid", placeItems: "center", scale: i === days - 1 ? "1.08" : "1" }}>
                {i < days && <Line n="check" size={30} color="#fff" w={2.6} />}
              </div>
            ))}
          </div>
        </div>
      )}
      <Words scene={scene} top={1200} size={56} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="pop" at={tC - 4} />
      <Sfx name="pop" at={tYou - 4} />
      <Sfx name="riser" at={tKeep - 2} gain={0.6} />
    </Scene>
  );
};

// ============================================================ 9 · CTA
export const Y9CTA: React.FC = () => {
  const scene = getY("Y9-CTA");
  const frame = useCurrentFrame();
  const tName = cue(scene, "دبرها");
  const tLink = cue(scene, "والرابط");
  const reveal = frame >= tName - 4;
  const name = usePop(tName - 4, 150, 11, 0.9);
  const sub = usePop(tName + 14, 170, 18);
  const btn = usePop(tLink, 200, 14);
  const glow = 0.7 + 0.3 * Math.sin(frame / 8);
  const lead = usePop(4, 160, 16);
  return (
    <Scene>
      {!reveal && (
        <div style={{ position: "absolute", left: 140, right: 200, top: 360, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, opacity: Math.min(1, lead * 1.4), scale: String(0.9 + 0.1 * lead) }}>
          {["حلقة ١", "حلقة ٢", "شورتس", "إعلان"].map((t, i) => (
            <div key={t} style={{ height: 230, borderRadius: 22, overflow: "hidden", position: "relative", background: ["linear-gradient(135deg, #2a070d, #5a0d1b)", "linear-gradient(135deg, #3a3a3a, #161616)", "linear-gradient(135deg, #FF0033, #8a0019)", "linear-gradient(135deg, #2b2b2b, #4a0f1a)"][i], boxShadow: "0 18px 40px rgba(60,45,30,0.18)", translate: `0px ${Math.sin(frame / 14 + i) * 6}px` }}>
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: 40, background: "rgba(255,255,255,0.9)", display: "grid", placeItems: "center" }}>
                  <Line n="play" size={44} color={P.ink} w={2} />
                </div>
              </div>
              <div dir="rtl" style={{ position: "absolute", right: 16, bottom: 12, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#fff" }}>{t}</div>
            </div>
          ))}
        </div>
      )}
      {reveal && (
        <>
          {Array.from({ length: 44 }).map((_, i) => {
            const t = frame - (tName - 4);
            const a = random(`a${i}`) * Math.PI * 2;
            const v = 7 + random(`v${i}`) * 14;
            const d = v * t * Math.exp(-t / 40);
            const c = [P.clay, "#ffffff", "#FF5470", "#AAAAAA"][i % 4];
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
          <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 830, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: sub, translate: `0px ${(1 - sub) * 24}px` }}>
            <div style={{ width: 44, height: 2, background: P.clay }} />
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: P.clay }}>فيديوهات احترافية لقناتك</div>
            <div style={{ width: 44, height: 2, background: P.clay }} />
          </div>
          {frame >= tLink && (
            <div style={{ position: "absolute", left: 0, right: 100, top: 980, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: btn, scale: String(0.85 + 0.15 * btn) }}>
              <svg width="54" height="60" viewBox="0 0 120 130" style={{ translate: `0px ${Math.abs(Math.sin((frame - tLink) / 6)) * -14}px` }}>
                <path d="M60 6 L112 62 L80 62 L80 124 L40 124 L40 62 L8 62 Z" fill={P.ink} />
              </svg>
              <div dir="rtl" style={{ padding: "18px 54px 22px", borderRadius: 999, background: P.clay, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 52, boxShadow: "0 16px 40px rgba(255,0,51,0.35)" }}>الرابط في البايو</div>
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
      <Sfx name="whoosh" at={tLink - 3} />
      <Sfx name="ding" at={tLink} />
    </Scene>
  );
};
