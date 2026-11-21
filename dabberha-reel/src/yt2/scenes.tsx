import React from "react";
import { Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Card, cue, getY, MONO, P, SANS, Scene, SceneVoice, Sfx, StepNumber, usePop, Words, type YSceneId } from "./base";

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

// ============================================================ 1 · HOOK: GREAT VIDEO, NO VIEWS
export const Z1Hook: React.FC = () => {
  const scene = getY("Z1-Hook");
  const frame = useCurrentFrame();
  const tWrap = cue(scene, "التغليف");
  const tSeven = cue(scene, "سبع");
  const card = usePop(4, 160, 16);
  const flip = ease(frame, tWrap - 4, tWrap + 16);
  const seven = usePop(tSeven - 2, 240, 11);
  const views = Math.floor(interpolate(frame, [20, 80], [0, 12], clamp));
  return (
    <Scene intro={false}>
      {/* the same video, plain packaging vs. strong packaging */}
      <div dir="rtl" style={{ position: "absolute", left: 140, right: 200, top: 330, opacity: Math.min(1, card * 1.4), scale: String(0.9 + 0.1 * card) }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ position: "relative", height: 420, background: flip > 0.5 ? "linear-gradient(120deg, #2a070d, #5a0d1b)" : "#2a2a2a", display: "grid", placeItems: "center", rotate: `0 1 0 ${Math.sin(flip * Math.PI) * 60}deg` }}>
            {flip > 0.5 ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 92, color: "#fff", lineHeight: 1.05 }}>٧ أيام</div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 92, color: "#FFD23F", lineHeight: 1.05 }}>بدون جوال!</div>
              </div>
            ) : (
              <div style={{ fontFamily: SANS, fontSize: 34, color: P.muted }}>فيديو_نهائي_٣.mp4</div>
            )}
            <div style={{ position: "absolute", left: 16, bottom: 14, padding: "2px 10px 4px", borderRadius: 6, background: "rgba(0,0,0,0.8)", fontFamily: MONO, fontSize: 22, color: "#fff" }}>12:48</div>
          </div>
          <div style={{ padding: "20px 24px 26px" }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, color: P.ink }}>{flip > 0.5 ? "جرّبت أسبوع بدون جوال… وهذا اللي صار" : "تجربتي مع الجوال"}</div>
            <div style={{ fontFamily: SANS, fontSize: 26, color: P.muted, marginTop: 6 }}>{flip > 0.5 ? "قناتك · العنوان والصورة تغيّرت" : `قناتك · ${["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠", "١١", "١٢"][views]} مشاهدة`}</div>
          </div>
        </Card>
      </div>
      {frame >= tSeven - 2 && (
        <div style={{ position: "absolute", left: 0, right: 100, top: 1000, display: "flex", justifyContent: "center", scale: String(seven) }}>
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 40px 20px", borderRadius: 999, background: P.clay, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 48, boxShadow: "0 16px 40px rgba(255,0,51,0.35)" }}>
            <span style={{ fontSize: 64 }}>٧</span> أوامر
          </div>
        </div>
      )}
      <Words scene={scene} top={1200} size={58} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="pop" at={4} />
      <Sfx name="tick" at={30} gain={0.5} />
      <Sfx name="whoosh" at={tWrap - 4} />
      <Sfx name="sparkle" at={tWrap + 8} />
      <Sfx name="thud" at={tSeven - 2} />
    </Scene>
  );
};

// ============================================================ 2 · TITLES
export const Z2Title: React.FC = () => {
  const scene = getY("Z2-Title");
  const frame = useCurrentFrame();
  const tTen = cue(scene, "عشر");
  const tBest = cue(scene, "ويختار");
  const titles: [string, number][] = [
    ["جرّبت أسبوع بدون جوال… وهذا اللي صار", 0.92],
    ["٧ أيام بدون جوال: النتيجة صدمتني", 0.81],
    ["وش يصير لو تركت جوالك أسبوع؟", 0.74],
    ["تجربتي مع الجوال", 0.22],
  ];
  return (
    <Step id="Z2-Title" n="١" label="العنوان" typeTo={cue(scene, "يكتب") - 4} resultAt={tTen - 4} prompt="تصرّف كخبير عناوين يوتيوب. اكتب ١٠ عناوين لفيديو عن [فكرة الفيديو] تثير الفضول بدون تضليل، لا تتجاوز ٦٠ حرفاً، ورتّبها حسب قوتها مع سبب كل ترتيب.">
      <div dir="rtl">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: P.ink }}>العناوين المقترحة</div>
          <div style={{ fontFamily: SANS, fontSize: 22, color: P.muted }}>قوة الجذب · مثال</div>
        </div>
        {titles.map(([t, v], i) => {
          const at = tTen + i * 8;
          const p = ease(frame, at, at + 14);
          const best = i === 0 && frame >= tBest;
          return (
            <div key={t} style={{ padding: "12px 14px", marginBottom: 8, borderRadius: 14, background: best ? P.claySoft : P.paper2, border: `2px solid ${best ? P.clay : "transparent"}`, opacity: Math.min(1, p * 1.3) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 27, color: i === 3 ? P.muted : P.ink, textDecoration: i === 3 ? "line-through" : undefined }}>{t}</div>
                {best && <div style={{ marginRight: "auto", padding: "2px 12px 4px", borderRadius: 999, background: P.clay, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 20 }}>الأقوى</div>}
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", marginTop: 8 }}>
                <div style={{ width: `${v * p * 100}%`, height: "100%", borderRadius: 3, background: i === 3 ? P.muted : P.clay }} />
              </div>
            </div>
          );
        })}
      </div>
      <Sfx name="ding" at={tBest} gain={0.7} />
    </Step>
  );
};

// ============================================================ 3 · THUMBNAILS + A/B TEST
export const Z3Thumb: React.FC = () => {
  const scene = getY("Z3-Thumb");
  const frame = useCurrentFrame();
  const tIdeas = cue(scene, "أفكار");
  const tTest = cue(scene, "وتجربها");
  const thumbs = [
    { t: "٧ أيام", s: "بدون جوال", bg: "linear-gradient(120deg, #2a070d, #5a0d1b)", share: 0.46 },
    { t: "صدمني!", s: "", bg: "linear-gradient(120deg, #1f1f1f, #3a3a3a)", share: 0.31 },
    { t: "وش صار؟", s: "", bg: "linear-gradient(120deg, #0f2a3a, #1d4a66)", share: 0.23 },
  ];
  const test = ease(frame, tTest, tTest + 30);
  return (
    <Step id="Z3-Thumb" n="٢" label="الصورة المصغرة" typeTo={cue(scene, "يقترح") - 4} resultAt={tIdeas - 6} prompt="تصرّف كمصمم صور مصغّرة ليوتيوب. اقترح ٣ أفكار لصورة مصغّرة لهذا الفيديو، فيها تعبير وجه واضح وعنصر واحد بارز ونص لا يزيد عن ٣ كلمات، واشرح لماذا تجذب النقر.">
      <div dir="rtl">
        <div style={{ display: "flex", gap: 12 }}>
          {thumbs.map((th, i) => {
            const p = ease(frame, tIdeas + i * 8, tIdeas + 12 + i * 8);
            return (
              <div key={i} style={{ flex: 1, opacity: p, scale: String(0.8 + 0.2 * p) }}>
                <div style={{ position: "relative", height: 150, borderRadius: 14, overflow: "hidden", background: th.bg, border: `2px solid ${frame >= tTest + 30 && i === 0 ? P.clay : "transparent"}` }}>
                  <div style={{ position: "absolute", left: 10, top: 18, width: 70, height: 70, borderRadius: 35, background: "radial-gradient(circle at 40% 35%, #f0c7a8, #a5583a)" }} />
                  <div style={{ position: "absolute", right: 10, top: 22, textAlign: "right", fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "#fff", lineHeight: 1.1 }}>
                    {th.t}
                    <br />
                    <span style={{ color: "#FFD23F", fontSize: 24 }}>{th.s}</span>
                  </div>
                </div>
                <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 24, color: P.ink2, marginTop: 6 }}>{["أ", "ب", "ج"][i]}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, opacity: ease(frame, tTest - 4, tTest + 6) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 24, color: P.ink2, marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color: P.ink }}>الاختبار والمقارنة</span>
            <span>نسبة مدة المشاهدة · مثال</span>
          </div>
          {thumbs.map((th, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 30, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: P.ink }}>{["أ", "ب", "ج"][i]}</div>
              <div style={{ flex: 1, height: 18, borderRadius: 9, background: P.paper2, overflow: "hidden" }}>
                <div style={{ width: `${th.share * test * 100}%`, height: "100%", background: i === 0 ? P.clay : P.muted }} />
              </div>
              <div style={{ width: 70, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: i === 0 ? P.clayDeep : P.ink2 }}>{["٤٦٪", "٣١٪", "٢٣٪"][i]}</div>
            </div>
          ))}
        </div>
      </div>
      {thumbs.map((_, i) => (
        <Sfx key={i} name="pop" at={tIdeas + i * 8} gain={0.6} />
      ))}
      <Sfx name="ding" at={tTest + 30} gain={0.7} />
    </Step>
  );
};

// ============================================================ 4 · FIRST 30 SECONDS
export const Z4Open: React.FC = () => {
  const scene = getY("Z4-Open");
  const frame = useCurrentFrame();
  const parts: { at: string; t: string; l: string; w: number }[] = [
    { at: "سؤال", t: "٠–٥ ث", l: "سؤال: «تقدر تعيش أسبوع بدون جوال؟»", w: 0.18 },
    { at: "ووعد", t: "٥–١٥ ث", l: "وعد: «بقولك وش تغيّر في نومي وشغلي»", w: 0.32 },
    { at: "ولمحة", t: "١٥–٣٠ ث", l: "لمحة من النتيجة قبل البداية", w: 0.5 },
  ];
  const play = interpolate(frame, [cue(scene, "سؤال"), cue(scene, "النتيجة") + 30], [0, 1], clamp);
  return (
    <Step id="Z4-Open" n="٣" label="أول ٣٠ ثانية" typeTo={cue(scene, "يكتب") - 4} resultAt={cue(scene, "بداية")} prompt="تصرّف ككاتب سيناريو يوتيوب محترف. اكتب أول ٣٠ ثانية لهذا الفيديو: ابدأ مباشرة بسؤال يمس المشاهد، ثم وعد واضح بما سيحصل عليه، ثم لمحة من النتيجة، بدون مقدمات أو ترحيب طويل.">
      <div dir="rtl">
        <div style={{ position: "relative", height: 26, borderRadius: 13, background: P.paper2, overflow: "hidden", display: "flex" }}>
          {parts.map((p, i) => (
            <div key={i} style={{ width: `${p.w * 100}%`, height: "100%", borderLeft: i < 2 ? `3px solid ${P.card}` : undefined, background: frame >= cue(scene, p.at) - 4 ? ["#FF0033", "#FF5470", "#ff8fa3"][i] : "transparent" }} />
          ))}
        </div>
        <div style={{ position: "relative", height: 10 }}>
          <div style={{ position: "absolute", right: `${play * 100}%`, top: -22, width: 18, height: 18, borderRadius: 9, background: "#fff", boxShadow: "0 0 10px rgba(255,255,255,0.8)" }} />
        </div>
        {parts.map((p) => (
          <Row key={p.at} at={cue(scene, p.at) - 4} style={{ marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 16, background: P.paper2 }}>
              <div dir="rtl" style={{ minWidth: 110, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: P.clayDeep }}>{p.t}</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: P.ink }}>{p.l}</div>
            </div>
          </Row>
        ))}
      </div>
      {parts.map((p) => (
        <Sfx key={p.at} name="tick" at={cue(scene, p.at) - 4} gain={0.6} />
      ))}
    </Step>
  );
};

// ============================================================ 5 · KEEP THEM WATCHING
export const Z5Keep: React.FC = () => {
  const scene = getY("Z5-Keep");
  const frame = useCurrentFrame();
  const draw = ease(frame, cue(scene, "يمسك"), cue(scene, "النهاية") + 20);
  const marks: { at: string; x: number; y: number; l: string }[] = [
    { at: "أسئلة", x: 150, y: 70, l: "سؤال مفتوح" },
    { at: "وتغيير", x: 380, y: 88, l: "تغيير إيقاع" },
    { at: "ومفاجأة", x: 620, y: 100, l: "مفاجأة" },
  ];
  return (
    <Step id="Z5-Keep" n="٤" label="الاحتفاظ بالمشاهد" typeTo={cue(scene, "يمسك") - 4} resultAt={cue(scene, "يمسك")} prompt="تصرّف كخبير في الاحتفاظ بالجمهور على يوتيوب. أعد كتابة سيناريو هذا الفيديو بحيث يحافظ على انتباه المشاهد حتى النهاية: أسئلة مفتوحة تُجاب لاحقاً، وتغيير في الإيقاع كل ٣٠ إلى ٦٠ ثانية، ومفاجأة قبل الخاتمة.">
      <div dir="rtl">
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 24, color: P.ink2 }}>
          <span style={{ fontWeight: 700, color: P.ink, fontSize: 30 }}>منحنى الاحتفاظ</span>
          <span>مثال</span>
        </div>
        <svg width="740" height="260" viewBox="0 0 740 260" style={{ marginTop: 10 }}>
          <path d="M10 30 C 60 60, 120 70, 200 74 S 360 80, 420 88 S 560 98, 730 106" stroke="rgba(255,255,255,0.25)" strokeWidth="4" fill="none" strokeDasharray="8 8" />
          <path d="M10 30 C 60 50, 120 62, 200 66 S 360 70, 420 74 S 560 80, 730 84" stroke={P.clay} strokeWidth="6" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} strokeLinecap="round" />
          <line x1="10" y1="240" x2="730" y2="240" stroke={P.border} strokeWidth="2" />
          {marks.map((m) => {
            const p = ease(frame, cue(scene, m.at) - 4, cue(scene, m.at) + 8);
            return (
              <g key={m.at} opacity={p}>
                <circle cx={740 - m.x} cy={m.y - 6} r={11} fill="#fff" />
                <text x={740 - m.x} y={m.y + 50} textAnchor="middle" fontFamily={SANS} fontWeight="700" fontSize="24" fill={P.ink}>{m.l}</text>
              </g>
            );
          })}
        </svg>
        <div style={{ display: "flex", gap: 16, fontFamily: SANS, fontSize: 22, color: P.ink2 }}>
          <span><span style={{ color: P.clay }}>━</span> بعد التعديل</span>
          <span><span style={{ color: P.muted }}>┅</span> قبل</span>
        </div>
      </div>
      {marks.map((m) => (
        <Sfx key={m.at} name="pop" at={cue(scene, m.at) - 4} gain={0.6} />
      ))}
    </Step>
  );
};

// ============================================================ 6 · DESCRIPTION, KEYWORDS, CHAPTERS
export const Z6Seo: React.FC = () => {
  const scene = getY("Z6-Seo");
  const frame = useCurrentFrame();
  const tKw = cue(scene, "والكلمات");
  const tCh = cue(scene, "والفصول");
  const tSearch = cue(scene, "البحث");
  const chapters = [["0:00", "التحدي"], ["1:12", "اليوم الأول"], ["4:30", "الأصعب"], ["9:05", "النتيجة"]];
  return (
    <Step id="Z6-Seo" n="٥" label="البحث والفصول" typeTo={cue(scene, "الوصف") - 4} resultAt={cue(scene, "الوصف")} prompt="تصرّف كخبير تحسين ظهور على يوتيوب. اكتب وصفاً لهذا الفيديو يبدأ بجملتين فيهما الكلمات المفتاحية الأهم، ثم اقترح ١٠ كلمات مفتاحية، وقسّم الفيديو إلى فصول بالتوقيت تبدأ من 0:00.">
      <div dir="rtl">
        <Row at={cue(scene, "الوصف")}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: P.ink, lineHeight: 1.5 }}>جرّبت أسبوع كامل بدون جوال… وهذي النتيجة على نومي وتركيزي وشغلي.</div>
        </Row>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {["بدون جوال", "تحدي ٧ أيام", "إدمان الجوال", "تركيز", "تجربة"].map((k, i) => {
            const p = ease(frame, tKw + i * 4, tKw + 10 + i * 4);
            return <div key={k} style={{ padding: "6px 14px 8px", borderRadius: 999, background: P.claySoft, color: P.clayDeep, fontFamily: SANS, fontWeight: 600, fontSize: 22, opacity: p, scale: String(0.7 + 0.3 * p) }}>#{k}</div>;
          })}
        </div>
        <div style={{ marginTop: 14 }}>
          {chapters.map(([t, l], i) => (
            <Row key={t} at={tCh + i * 6}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "6px 0" }}>
                <div dir="ltr" style={{ fontFamily: MONO, fontSize: 24, color: "#3EA6FF", minWidth: 70 }}>{t}</div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: P.ink }}>{l}</div>
              </div>
            </Row>
          ))}
        </div>
        <Row at={tSearch} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 999, background: P.paper2 }}>
            <Line n="search" size={28} color={P.ink2} />
            <div style={{ fontFamily: SANS, fontSize: 26, color: P.ink }}>تحدي بدون جوال</div>
          </div>
        </Row>
      </div>
      <Sfx name="pop" at={tKw} gain={0.6} />
      <Sfx name="tick" at={tCh} gain={0.6} />
      <Sfx name="ding" at={tSearch} gain={0.6} />
    </Step>
  );
};

// ============================================================ 7 · SHORTS FROM THE LONG VIDEO
export const Z7Shorts: React.FC = () => {
  const scene = getY("Z7-Shorts");
  const frame = useCurrentFrame();
  const tFive = cue(scene, "خمس");
  const tLink = cue(scene, "يودّي");
  const cuts = [0.08, 0.27, 0.46, 0.63, 0.84];
  return (
    <Step id="Z7-Shorts" n="٦" label="الشورتس" typeTo={cue(scene, "يقص") - 2} resultAt={cue(scene, "الفيديو")} prompt="تصرّف كمحرر محتوى قصير. استخرج من نص هذا الفيديو الطويل ٥ مقاطع شورتس، كل مقطع أقل من ٦٠ ثانية ويبدأ بجملة جاذبة، واقترح نصاً لكل مقطع يوجّه المشاهد إلى الفيديو الكامل.">
      <div dir="rtl">
        <div style={{ position: "relative", height: 70, borderRadius: 14, background: P.paper2, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 600, fontSize: 24, color: P.ink2 }}>الفيديو الكامل · ١٢:٤٨</div>
          {cuts.map((c, i) => (
            <div key={i} style={{ position: "absolute", right: `${c * 100}%`, top: 0, bottom: 0, width: 26, background: P.clay, opacity: ease(frame, tFive + i * 5, tFive + 8 + i * 5) }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
          {cuts.map((_, i) => {
            const p = ease(frame, tFive + 6 + i * 5, tFive + 18 + i * 5);
            return (
              <div key={i} style={{ width: 128, height: 228, borderRadius: 16, background: "linear-gradient(180deg, #2a070d, #141414)", border: `2px solid ${P.border}`, position: "relative", opacity: p, translate: `0px ${(1 - p) * 40}px` }}>
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                  <Line n="play" size={44} color="#fff" w={2} />
                </div>
                {frame >= tLink && (
                  <div style={{ position: "absolute", left: 8, right: 8, bottom: 8, padding: "4px 6px 6px", borderRadius: 8, background: "rgba(255,255,255,0.9)", fontFamily: SANS, fontWeight: 700, fontSize: 15, color: "#0F0F0F", textAlign: "center", opacity: ease(frame, tLink + i * 3, tLink + 8 + i * 3) }}>▶ الفيديو الكامل</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {cuts.map((_, i) => (
        <Sfx key={i} name="pop" at={tFive + 6 + i * 5} gain={0.5} />
      ))}
      <Sfx name="ding" at={tLink} gain={0.7} />
    </Step>
  );
};

// ============================================================ 8 · COMMENTS & COMMUNITY
export const Z8Comm: React.FC = () => {
  const scene = getY("Z8-Comm");
  const frame = useCurrentFrame();
  const tReply = cue(scene, "ترد");
  const tPin = cue(scene, "مثبّت");
  const tPoll = cue(scene, "واستبيان");
  const tIdeas = cue(scene, "أفكار");
  const poll = ease(frame, tPoll, tPoll + 30);
  return (
    <Step id="Z8-Comm" n="٧" label="التعليقات والمجتمع" typeTo={cue(scene, "كنز") + 10} resultAt={cue(scene, "يساعدك")} prompt="تصرّف كمدير مجتمع لقناة يوتيوب. حلّل تعليقات هذا الفيديو، واقترح ردوداً تفتح النقاش، واكتب تعليقاً مثبّتاً واستبياناً للمجتمع، واستخرج من الأسئلة المتكررة ٥ أفكار لفيديوهات قادمة.">
      <div dir="rtl">
        <Row at={tReply - 6}>
          <div style={{ padding: "10px 14px", borderRadius: 14, background: P.paper2 }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: P.ink }}>@سارة: طيب كيف تعاملت مع الشغل بدون جوال؟</div>
            {frame >= tReply + 8 && <div style={{ fontFamily: SANS, fontSize: 22, color: P.ink2, marginTop: 6, paddingRight: 16, borderRight: `3px solid ${P.clay}` }}>سؤال حلو! بخصص له فيديو كامل… وش تبغون أجاوب فيه بعد؟</div>}
          </div>
        </Row>
        <Row at={tPin - 4} style={{ marginTop: 10 }}>
          <div style={{ padding: "10px 14px", borderRadius: 14, background: P.claySoft, border: `1.5px solid ${P.clay}` }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 20, color: P.clayDeep }}>📌 مثبّت</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, color: P.ink }}>كم ساعة تقضي على جوالك يومياً؟ اكتبها هنا 👇</div>
          </div>
        </Row>
        <Row at={tPoll - 4} style={{ marginTop: 10 }}>
          {[["أقل من ٣ ساعات", 0.24], ["٣ إلى ٦ ساعات", 0.47], ["أكثر من ٦", 0.29]].map(([l, v]) => (
            <div key={String(l)} style={{ position: "relative", height: 40, borderRadius: 10, background: P.paper2, marginBottom: 6, overflow: "hidden" }}>
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${Number(v) * poll * 100}%`, background: "rgba(255,0,51,0.35)" }} />
              <div style={{ position: "absolute", right: 14, top: 6, fontFamily: SANS, fontWeight: 600, fontSize: 22, color: P.ink }}>{l}</div>
            </div>
          ))}
        </Row>
        <Row at={tIdeas - 4} style={{ marginTop: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: P.ink }}>
            <Line n="check" size={30} color={P.sage} w={2.6} /> ٥ أفكار لفيديوهات جاية
          </div>
        </Row>
      </div>
      <Sfx name="pop" at={tReply - 6} gain={0.6} />
      <Sfx name="pop" at={tPin - 4} gain={0.6} />
      <Sfx name="tick" at={tPoll} gain={0.6} />
      <Sfx name="ding" at={tIdeas - 4} gain={0.7} />
    </Step>
  );
};

// ============================================================ 9 · TRY, MEASURE, ADJUST
export const Z9Truth: React.FC = () => {
  const scene = getY("Z9-Truth");
  const frame = useCurrentFrame();
  const steps: [string, string][] = [["جرّب", "جرّب"], ["وقِس", "قِس"], ["وعدّل", "عدّل"]];
  const tJudge = cue(scene, "الحكم");
  const judge = usePop(tJudge - 4, 200, 13);
  const spin = interpolate(frame, [cue(scene, "جرّب"), cue(scene, "وعدّل") + 40], [0, 360], clamp);
  return (
    <Scene>
      {frame >= tJudge - 4 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 100, top: 300, display: "flex", justifyContent: "center", scale: String(judge) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 34px 20px", borderRadius: 999, background: P.paper2, border: `1.5px solid ${P.border}` }}>
            <Line n="user" size={44} color={P.ink} />
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, color: P.ink }}>المشاهد هو الحكم</div>
          </div>
        </div>
      )}
      {/* the loop */}
      <div style={{ position: "absolute", left: 540 - 50 - 260, top: 520, width: 520, height: 520 }}>
        <svg width="520" height="520" style={{ position: "absolute", inset: 0, rotate: `${spin}deg` }}>
          <circle cx="260" cy="260" r="210" stroke={P.border} strokeWidth="6" fill="none" />
          <circle cx="260" cy="260" r="210" stroke={P.clay} strokeWidth="6" fill="none" strokeDasharray="140 1180" strokeLinecap="round" />
        </svg>
        {steps.map(([at, l], i) => {
          const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
          const p = usePop(cue(scene, at) - 4, 240, 12);
          const on = frame >= cue(scene, at) - 4;
          return (
            <div key={l} style={{ position: "absolute", left: 260 + Math.cos(a) * 210 - 85, top: 260 + Math.sin(a) * 210 - 85, width: 170, height: 170, borderRadius: 85, background: on ? P.clay : P.paper2, display: "grid", placeItems: "center", scale: String(on ? 0.7 + 0.3 * p : 0.7), boxShadow: on ? "0 12px 30px rgba(255,0,51,0.35)" : undefined }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, color: "#fff" }}>{l}</div>
            </div>
          );
        })}
      </div>
      <Words scene={scene} top={1240} size={58} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="thud" at={tJudge - 4} gain={0.7} />
      {steps.map(([at]) => (
        <Sfx key={at} name="pop" at={cue(scene, at) - 4} />
      ))}
    </Scene>
  );
};

// ============================================================ 9 · CTA
export const Z10CTA: React.FC = () => {
  const scene = getY("Z10-CTA");
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
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: P.clay }}>بناء قناتك على يوتيوب</div>
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
