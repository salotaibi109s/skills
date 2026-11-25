import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { CharDefs, Kid } from "../joanna/chars";
import { FONT } from "../room404/kit";

export const EPISODES = [
  { file: "joanna-ep01.mp4", frames: 1800, title: "وين راح الواجب؟!", emoji: "📚" },
  { file: "joanna-ep02.mp4", frames: 1800, title: "اختبار مفاجئ!", emoji: "🍎" },
  { file: "joanna-ep03.mp4", frames: 1800, title: "وين السندويتش؟!", emoji: "🥦" },
  { file: "joanna-ep04.mp4", frames: 2160, title: "رسالة غامضة في الدرج!", emoji: "✉️" },
  { file: "joanna-ep05.mp4", frames: 2250, title: "مين جلس هنا؟!", emoji: "🕵️‍♀️" },
  { file: "joanna-ep06.mp4", frames: 1950, title: "مين أخذ الميكروفون؟!", emoji: "🎤" },
  { file: "joanna-ep07.mp4", frames: 1800, title: "أسوأ بروفة بالتاريخ!", emoji: "🎭" },
  { file: "joanna-ep08.mp4", frames: 2100, title: "يوم المسابقة!", emoji: "🏆" },
];
export const INTRO = 150;
export const OUTRO = 180;
export const starts = EPISODES.reduce<number[]>((a, e, i) => [...a, i === 0 ? INTRO : a[i - 1] + EPISODES[i - 1].frames], []);
export const JOANNA_S1_FRAMES = INTRO + EPISODES.reduce((s, e) => s + e.frames, 0) + OUTRO;
const AR = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #FFE3EE 0%, #FFF4D6 50%, #DDF1FF 100%)" }}>
      {Array.from({ length: 26 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: (i * 151) % 1920,
            top: ((i * 263) % 1080) + Math.sin(f / 40 + i) * 12,
            fontSize: 40 + (i % 3) * 14,
            opacity: 0.22,
            transform: `rotate(${(i * 37) % 60 - 30}deg)`,
          }}
        >
          {["✏️", "⭐", "📚", "🎒", "💡", "🍎"][i % 6]}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const SidePanels: React.FC<{ n: number; title: string; emoji: string }> = ({ n, title, emoji }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f, fps: 30, config: { damping: 14 } });
  return (
    <>
      <div dir="rtl" style={{ position: "absolute", right: 60, top: 0, bottom: 0, width: 520, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: FONT, textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 96, color: "#D9508A", lineHeight: 1.05, textShadow: "0 6px 0 #fff" }}>يوميات جوانا</div>
        <div style={{ marginTop: 14, fontWeight: 700, fontSize: 44, color: "#6B4523" }}>الموسم الأول كامل</div>
        <div style={{ marginTop: 40, fontSize: 120 }}>🎒</div>
      </div>
      <div dir="rtl" style={{ position: "absolute", left: 60, top: 0, bottom: 0, width: 520, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: FONT, textAlign: "center", transform: `scale(${0.85 + 0.15 * k})`, opacity: k }}>
        <div style={{ padding: "12px 40px", borderRadius: 50, background: "#2E7D7A", color: "#fff", fontWeight: 800, fontSize: 56 }}>الحلقة {AR(n)}</div>
        <div style={{ marginTop: 30, fontWeight: 800, fontSize: 64, color: "#3A2414", lineHeight: 1.25 }}>{title}</div>
        <div style={{ marginTop: 24, fontSize: 130 }}>{emoji}</div>
      </div>
    </>
  );
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const k = spring({ frame: f, fps: 30, config: { stiffness: 160, damping: 12 } });
  const o = interpolate(f, [INTRO - 15, INTRO], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop />
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <CharDefs />
        <Kid x={430} y={1040 + (1 - k) * 300} s={0.95} who="joanna" glasses="pink" expr="happy" blink={0} look={[0.6, -0.2]} armR={{ a: 150, b: 170 }} />
      </svg>
      <div dir="rtl" style={{ position: "absolute", left: 760, right: 80, top: 250, textAlign: "center", fontFamily: FONT, transform: `scale(${k})` }}>
        <div style={{ fontWeight: 800, fontSize: 170, color: "#D9508A", textShadow: "0 10px 0 #fff" }}>يوميات جوانا</div>
        <div style={{ marginTop: 10, display: "inline-block", padding: "16px 56px", borderRadius: 60, background: "#2E7D7A", color: "#fff", fontWeight: 800, fontSize: 70 }}>الموسم الأول كامل</div>
        <div style={{ marginTop: 34, fontWeight: 700, fontSize: 50, color: "#6B4523" }}>٨ حلقات · قصص ومواقف من المدرسة 🎒</div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const k = spring({ frame: f, fps: 30, config: { damping: 13 } });
  return (
    <AbsoluteFill>
      <Backdrop />
      <div dir="rtl" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: FONT, transform: `scale(${k})` }}>
        <div style={{ fontWeight: 800, fontSize: 120, color: "#D9508A" }}>انتهى الموسم الأول 🏆</div>
        <div style={{ marginTop: 30, fontWeight: 700, fontSize: 56, color: "#3A2414" }}>شاهد بعدها على القناة:</div>
        <div style={{ marginTop: 20, display: "flex", gap: 30 }}>
          <div style={{ padding: "14px 40px", borderRadius: 50, background: "#1E2A44", color: "#5CF2FF", fontWeight: 800, fontSize: 56 }}>سرّ الغرفة 404</div>
          <div style={{ padding: "14px 40px", borderRadius: 50, background: "#C0574B", color: "#fff", fontWeight: 800, fontSize: 56 }}>حكايات بيتنا</div>
        </div>
        <div style={{ marginTop: 50, fontWeight: 800, fontSize: 64, color: "#2E7D7A" }}>ابنِ ذكاءك 💡</div>
      </div>
    </AbsoluteFill>
  );
};

export const JoannaS1: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFF4D6" }}>
    <Sequence durationInFrames={INTRO}>
      <Intro />
    </Sequence>
    <Audio src={staticFile("audio/joanna/music/theme.mp3")} volume={(f) => interpolate(f, [0, 10, INTRO - 30, INTRO], [0, 0.5, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} trimAfter={INTRO} />
    {EPISODES.map((e, i) => (
      <Sequence key={e.file} from={starts[i]} durationInFrames={e.frames}>
        <Backdrop />
        <SidePanels n={i + 1} title={e.title} emoji={e.emoji} />
        <div style={{ position: "absolute", left: (1920 - 607.5) / 2, top: 0, width: 607.5, height: 1080, borderRadius: 0, boxShadow: "0 0 60px rgba(0,0,0,0.25)", overflow: "hidden" }}>
          <OffthreadVideo src={staticFile(`compilation/${e.file}`)} style={{ width: "100%", height: "100%" }} />
        </div>
      </Sequence>
    ))}
    <Sequence from={JOANNA_S1_FRAMES - OUTRO} durationInFrames={OUTRO}>
      <Outro />
      <Audio src={staticFile("audio/joanna8/music/theme.mp3")} volume={(f) => interpolate(f, [0, 15, OUTRO - 40, OUTRO], [0, 0.5, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </Sequence>
  </AbsoluteFill>
);
