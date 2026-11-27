import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import data from "../data/prompts7-timeline.json";
import type { TimelineData } from "../lib/timing";
import { Cam, ShotPlayer, type ShotDef, World } from "./art";
import { ar, Captions, clamp, ease, makeStory, MusicBed, pop, SANS, Voices } from "./kit";

/** «٧ أوامر تطلع لك دخل إضافي» — prompt cards on a deep-indigo studio, voice: Nasser, Dabbirha end card. */
export const p7Timeline = data as TimelineData;
const { Sfx, SceneVoice, at, start, S } = makeStory(p7Timeline, "audio/prompts7");
const T = p7Timeline.durationInFrames;
const txt = { fontFamily: SANS, fontWeight: 700 } as const;
const K = { bg1: "#0D0B24", bg2: "#2A1B5C", card: "#16142E", line: "#3A3570", accent: "#8B7CFF", gold: "#FFD23F", green: "#2BB673", red: "#FF5A6E", ink: "#F4F2FF", ink2: "#A9A3D9" };

const PROMPTS: { id: string; title: string; text: string; icon: string }[] = [
  { id: "N03", title: "اكتشف المهارات اللي ما تعرف قيمتها", icon: "💎", text: "هذه نبذة عن خبراتي: [...]. استخرج أهم ١٠ مهارات عندي ما أعطيها حقها، ووضّح ليش هي قيّمة، ومين يدفع مقابلها، وكيف أستفيد منها بالذكاء الاصطناعي." },
  { id: "N04", title: "حوّل خبرتك إلى دخل إضافي", icon: "💰", text: "اعتمد على خبراتي واقترح لي ١٠ طرق واقعية أحقق فيها دخل إضافي بين [المبلغ] و[المبلغ] شهرياً." },
  { id: "N05", title: "اكتشف الفرص التجارية المناسبة لك", icon: "🧭", text: "تصرّف كمستشار أعمال واستراتيجية. هذه خلفيتي: [...]. حدّد لي الخدمات والاستشارات والمنتجات الرقمية اللي أقدر أقدمها." },
  { id: "N06", title: "من وين أبدأ؟", icon: "🚀", text: "لو بتساعدني أزيد دخلي بالمهارات اللي عندي حالياً، من وين تبدأ؟ وليش اخترت هالطريقة تحديداً؟" },
  { id: "N07", title: "وظائف برواتب أعلى", icon: "📈", text: "اقترح لي وظائف أو قطاعات رواتبها أعلى من وظيفتي الحالية، ووضّح المتطلبات اللي أملكها فعلاً." },
  { id: "N08", title: "خدمات بالذكاء الاصطناعي", icon: "🤖", text: "اقترح لي ٥ خدمات أقدمها باستخدام الذكاء الاصطناعي، بشرط ما تحتاج أكثر من ٥ ساعات أسبوعياً." },
  { id: "N09", title: "خطة ٩٠ يوم", icon: "🗓️", text: "هدفي الاستقرار وزيادة دخلي خلال ٩٠ يوم. جهّز لي خطة عملية خطوة بخطوة مبنية على خبراتي ووقتي." },
];

// ------------------------------------------------------------ studio
const Studio: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: `linear-gradient(160deg, ${K.bg1} 0%, ${K.bg2} 100%)`, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 540 + Math.sin(f / 50) * 200 - 500, top: 500 + Math.cos(f / 60) * 160 - 500, width: 1000, height: 1000, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,124,255,0.28) 0%, rgba(139,124,255,0) 65%)" }} />
    <div style={{ position: "absolute", left: 300 + Math.cos(f / 45) * 180 - 450, top: 1500 + Math.sin(f / 55) * 140 - 450, width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,210,63,0.12) 0%, rgba(255,210,63,0) 65%)" }} />
    {Array.from({ length: 40 }).map((_, i) => {
      const y = ((random(`y${i}`) * 2100 - f * (0.4 + random(`s${i}`) * 0.8)) % 2100 + 2100) % 2100 - 90;
      return <div key={i} style={{ position: "absolute", left: random(`x${i}`) * 1080, top: y, width: 4, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.35)" }} />;
    })}
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.08 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={i * 100} y1={0} x2={i * 100} y2={1920} stroke="#fff" strokeWidth={1} />
      ))}
    </svg>
  </AbsoluteFill>
);

/** Seven progress dots at the top. */
const Progress: React.FC<{ f: number }> = ({ f }) => {
  let cur = -1;
  PROMPTS.forEach((p, i) => {
    if (f >= start(p.id)) cur = i;
  });
  if (f < start("N03") - 10 || f >= start("N11")) return null;
  return (
    <div dir="rtl" style={{ position: "absolute", top: 140, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
      {PROMPTS.map((p, i) => (
        <div key={p.id} style={{ width: i === cur ? 64 : 22, height: 22, borderRadius: 11, background: i < cur ? K.accent : i === cur ? K.gold : "rgba(255,255,255,0.2)" }} />
      ))}
    </div>
  );
};

// ------------------------------------------------------------ prompt card
const PromptCard: React.FC<{ idx: number; l: number; d: number }> = ({ idx, l, d }) => {
  const p = PROMPTS[idx];
  const sc = S(p.id);
  const f = sc.from + l;
  const num = pop(f, sc.from + 2, 30, 220, 11);
  const card = pop(f, sc.from + 14, 30, 180, 14);
  const typing = interpolate(l, [24, Math.max(40, d * 0.72)], [0, 1], { ...clamp, easing: (x) => x });
  const shown = p.text.slice(0, Math.ceil(p.text.length * typing));
  const done = typing >= 1;
  const copy = done ? pop(l, Math.max(40, d * 0.72) + 4, 30, 260, 10) : 0;
  return (
    <Cam l={l} d={d} a={[540, 1010, 1.06]} b={[540, 990, 1.0]}>
      <World>
        <g />
      </World>
      <div dir="rtl" style={{ position: "absolute", top: 420, left: 70, right: 70, display: "flex", alignItems: "center", gap: 28, scale: String(num), transformOrigin: "100% 50%" }}>
        <div style={{ width: 170, height: 170, borderRadius: 48, background: `linear-gradient(135deg, ${K.accent}, #5B4BDB)`, display: "grid", placeItems: "center", boxShadow: "0 20px 60px rgba(139,124,255,0.45)", ...txt, fontSize: 110, color: "#fff" }}>{ar(idx + 1)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ ...txt, fontSize: 38, color: K.ink2 }}>{`الأمر ${ar(idx + 1)} من ${ar(7)}`}</div>
          <div style={{ ...txt, fontSize: 62, color: K.ink, lineHeight: 1.25 }}>{p.title}</div>
        </div>
        <div style={{ fontSize: 90 }}>{p.icon}</div>
      </div>
      <div dir="rtl" style={{ position: "absolute", top: 760, left: 60, right: 60, padding: "40px 44px 50px", borderRadius: 40, background: K.card, border: `2px solid ${K.line}`, boxShadow: "0 30px 80px rgba(0,0,0,0.45)", scale: String(0.9 + 0.1 * card), opacity: Math.min(1, card * 1.4), translate: `0px ${(1 - card) * 60}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: K.accent, display: "grid", placeItems: "center", ...txt, fontSize: 28, color: "#fff" }}>أنت</div>
          <div style={{ ...txt, fontSize: 32, color: K.ink2 }}>انسخ هالأمر 👇</div>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 56, lineHeight: 1.6, color: K.ink, minHeight: 440 }}>
          {shown}
          {!done && <span style={{ display: "inline-block", width: 6, height: 52, marginRight: 6, background: K.gold, verticalAlign: "middle", opacity: Math.floor(l / 8) % 2 ? 0 : 1 }} />}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 16 }}>
          <div style={{ padding: "8px 34px 16px", borderRadius: 30, background: K.green, ...txt, fontSize: 38, color: "#fff", scale: String(copy), opacity: Math.min(1, copy * 1.4) }}>📋 تم النسخ</div>
        </div>
      </div>
    </Cam>
  );
};

// ------------------------------------------------------------ shots
const shots: ShotDef[] = [
  {
    at: 0,
    C: ({ l, d }) => {
      const f = l;
      const doc = ease(f, at("N01", "سيرتك") - 4, at("N01", "الذاتية") + 10);
      const seven = pop(f, at("N01", "سبعة") - 2, 30, 200, 9);
      const save = pop(f, at("N01", "احفظها") - 2, 30, 240, 10);
      return (
        <Cam l={l} d={d} a={[540, 960, 1.15]} b={[540, 960, 1.0]}>
          <World>
            <g transform={`translate(${540 - 260 * (1 - doc)} ${760 + 120 * (1 - doc)}) rotate(${-12 * (1 - doc)})`} opacity={doc * (1 - seven)}>
              <rect x={-220} y={-290} width={440} height={580} rx={24} fill="#F4F2FF" />
              <circle cx={-120} cy={-190} r={50} fill="#C9C3F2" />
              {Array.from({ length: 9 }).map((_, i) => (
                <rect key={i} x={-170} y={-90 + i * 40} width={i % 3 === 0 ? 220 : 340} height={16} rx={8} fill="#C9C3F2" />
              ))}
              <text x={60} y={-170} textAnchor="middle" {...txt} fontSize={44} fill="#2A1B5C">
                سيرة ذاتية
              </text>
            </g>
            <g transform={`translate(540 900) scale(${seven})`}>
              <text textAnchor="middle" y={120} {...txt} fontSize={420} fill={K.gold} stroke="#0D0B24" strokeWidth={12} paintOrder="stroke">
                {ar(7)}
              </text>
              <text textAnchor="middle" y={300} {...txt} fontSize={110} fill="#fff">
                أوامر
              </text>
            </g>
            <g transform={`translate(540 1460) scale(${save})`}>
              <rect x={-230} y={-64} width={460} height={128} rx={64} fill={K.accent} />
              <text textAnchor="middle" y={26} {...txt} fontSize={70} fill="#fff">
                🔖 احفظها
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: start("N02"),
    C: ({ l, d }) => {
      const f = start("N02") + l;
      const redact = ease(f, at("N02", "وشيل") - 2, at("N02", "وهويتك") + 10);
      const paste = pop(f, at("N02", "الصق") - 2, 30, 240, 10);
      return (
        <Cam l={l} d={d} a={[540, 900, 1.15]} b={[540, 980, 1.0]}>
          <World>
            <g transform="translate(540 860)">
              <rect x={-300} y={-380} width={600} height={760} rx={30} fill="#F4F2FF" />
              <text x={0} y={-300} textAnchor="middle" {...txt} fontSize={52} fill="#2A1B5C">
                سيرتك الذاتية
              </text>
              {[
                ["الجوال: 05xxxxxxxx", true],
                ["الهوية: 1xxxxxxxxx", true],
                ["الخبرات: ...", false],
                ["المهارات: ...", false],
                ["الشهادات: ...", false],
              ].map(([label, hide], i) => (
                <g key={i} transform={`translate(0 ${-200 + i * 110})`}>
                  <text x={250} y={14} textAnchor="end" {...txt} fontSize={42} fill="#2A1B5C">
                    {String(label)}
                  </text>
                  {hide && <rect x={-260} y={-30} width={520 * redact} height={60} rx={10} fill="#0D0B24" />}
                </g>
              ))}
            </g>
            <g transform={`translate(540 1450) scale(${paste})`}>
              <rect x={-300} y={-70} width={600} height={140} rx={70} fill={K.green} />
              <text textAnchor="middle" y={26} {...txt} fontSize={64} fill="#fff">
                📋 الصق الأوامر
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  ...PROMPTS.map((p, idx) => ({ at: start(p.id), C: ({ l, d }: { l: number; d: number }) => <PromptCard idx={idx} l={l} d={d} /> })),
  {
    at: start("N10"),
    C: ({ l, d }) => {
      const f = start("N10") + l;
      const a = pop(f, at("N10", "الأفكار") - 4, 30, 220, 11);
      const b = pop(f, at("N10", "والتنفيذ") - 2, 30, 220, 11);
      return (
        <Cam l={l} d={d} a={[540, 960, 1.1]} b={[540, 960, 1.0]}>
          <World>
            <g transform={`translate(300 960) scale(${a})`}>
              <rect x={-210} y={-260} width={420} height={520} rx={40} fill={K.card} stroke={K.line} strokeWidth={4} />
              <text textAnchor="middle" y={-40} fontSize={160}>
                💡
              </text>
              <text textAnchor="middle" y={150} {...txt} fontSize={64} fill={K.ink}>
                الأفكار
              </text>
              <text textAnchor="middle" y={220} {...txt} fontSize={40} fill={K.ink2}>
                من الأوامر
              </text>
            </g>
            <g transform={`translate(780 960) scale(${b})`}>
              <rect x={-210} y={-260} width={420} height={520} rx={40} fill={K.accent} />
              <text textAnchor="middle" y={-40} fontSize={160}>
                🛠️
              </text>
              <text textAnchor="middle" y={150} {...txt} fontSize={64} fill="#fff">
                التنفيذ
              </text>
              <text textAnchor="middle" y={220} {...txt} fontSize={40} fill="#E9E5FF">
                عليك
              </text>
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: start("N11"),
    C: ({ l }) => {
      const f = start("N11") + l;
      const logoAt = at("N11", "ولو") - 6;
      const logo = pop(f, logoAt, 30, 160, 12);
      const btn = pop(f, at("N11", "تابع") - 2, 30, 240, 11);
      const save = pop(f, at("N11", "احفظ") - 2, 30, 240, 11) * (1 - ease(f, logoAt - 6, logoAt + 4));
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center", opacity: save, scale: String(save) }}>
            <div dir="rtl" style={{ padding: "20px 60px 32px", borderRadius: 40, background: K.card, border: `2px solid ${K.line}`, ...txt, fontSize: 72, color: K.ink }}>🔖 ابدأ بالأمر الأول الليلة</div>
          </div>
          {f >= logoAt - 2 &&
            Array.from({ length: 26 }).map((_, i) => {
              const t = f - logoAt;
              const a = random(`c${i}`) * Math.PI * 2;
              const v = 6 + random(`v${i}`) * 12;
              const dd = v * t * Math.exp(-t / 36);
              const c = [K.gold, "#fff", K.accent, K.green][i % 4];
              return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * dd - 6, top: 820 + Math.sin(a) * dd - 6 + t * 1.2, width: 12, height: 12, borderRadius: 3, background: c, rotate: `${t * 9 + i * 40}deg`, opacity: interpolate(t, [0, 40, 70], [1, 1, 0], clamp) }} />;
            })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
            <div style={{ width: 420, height: 420, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", scale: String(logo), opacity: Math.min(1, logo * 1.3), boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
              <Img src={staticFile("brand/logo-color.png")} style={{ width: 350 }} />
            </div>
            <div dir="rtl" style={{ ...txt, fontSize: 64, color: "#fff", opacity: logo, textAlign: "center", lineHeight: 1.35 }}>
              الفكرة عندك…
              <br />
              <span style={{ color: K.gold }}>ودبّرها معك خطوة بخطوة</span>
            </div>
            <div dir="rtl" style={{ marginTop: 10, padding: "14px 64px 26px", borderRadius: 60, background: "#FE2C55", color: "#fff", ...txt, fontSize: 66, scale: String(btn * (1 + 0.04 * Math.sin(f / 5))), opacity: Math.min(1, btn * 1.4), boxShadow: "0 18px 50px rgba(254,44,85,0.5)" }}>
              + تابع دبّرها
            </div>
          </div>
        </AbsoluteFill>
      );
    },
  },
];

// ------------------------------------------------------------ cover
const Cover: React.FC = () => (
  <AbsoluteFill>
    <Studio f={0} />
    <div dir="rtl" style={{ position: "absolute", top: 300, left: 50, right: 50, textAlign: "center", ...txt }}>
      <div style={{ fontSize: 400, lineHeight: 1, color: K.gold, WebkitTextStroke: "10px #0D0B24", paintOrder: "stroke fill" }}>{ar(7)}</div>
      <div style={{ fontSize: 120, color: "#fff", lineHeight: 1.2, marginTop: 20 }}>أوامر ذكاء اصطناعي</div>
      <div style={{ display: "inline-block", marginTop: 30, padding: "8px 40px 22px", borderRadius: 26, background: K.accent, color: "#fff", fontSize: 76 }}>تطلع لك دخل إضافي 💰</div>
      <div style={{ fontSize: 50, color: K.ink2, marginTop: 40 }}>احفظها قبل تضيع 🔖</div>
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ main
export const SevenPrompts: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  return (
    <AbsoluteFill style={{ background: K.bg1 }}>
      <Studio f={f} />
      <ShotPlayer f={f} shots={shots} total={T} />
      <Progress f={f} />
      <Captions timeline={p7Timeline} top={1640} />

      <Voices timeline={p7Timeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={p7Timeline} src="audio/prompts7/music/calm.mp3" />
      {shots.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} name="whoosh" at={s.at - 2} gain={0.6} />
      ))}
      {PROMPTS.map((p) => (
        <Sfx key={p.id} name="type" at={start(p.id) + 24} gain={0.5} durationInFrames={60} />
      ))}
      <Sfx name="impact" at={at("N01", "سبعة")} />
      <Sfx name="pop" at={at("N01", "احفظها")} />
      <Sfx name="swish" at={at("N02", "وشيل")} />
      <Sfx name="ding" at={at("N02", "الصق")} />
      <Sfx name="riser" at={at("N11", "ولو") - 10} />
      <Sfx name="pop" at={at("N11", "تابع")} />
    </AbsoluteFill>
  );
};

export const SevenPromptsThumb: React.FC = () => <Cover />;
