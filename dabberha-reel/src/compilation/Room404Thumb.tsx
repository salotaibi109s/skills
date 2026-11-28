import React from "react";
import { AbsoluteFill } from "remotion";
import { CharDefs, Kid } from "../joanna/chars";
import { FONT, Zero } from "../room404/kit";

const outline = (c: string, w: number) => Array.from({ length: 16 }).map((_, i) => `${Math.round(Math.cos((i / 16) * Math.PI * 2) * w)}px ${Math.round(Math.sin((i / 16) * Math.PI * 2) * w)}px 0 ${c}`).join(",");

/** Half-open glowing door with the number 404. */
const Door: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <radialGradient id="tGlow">
        <stop offset="0%" stopColor="#E9FFFF" stopOpacity={1} />
        <stop offset="40%" stopColor="#5CF2FF" stopOpacity={0.7} />
        <stop offset="100%" stopColor="#5CF2FF" stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={0} cy={-260} r={520} fill="url(#tGlow)" opacity={0.55} />
    <rect x={-190} y={-560} width={380} height={560} fill="#0A1530" stroke="#5CF2FF" strokeWidth={10} />
    <polygon points="-170,-540 170,-540 170,-20 -170,-20" fill="#E9FFFF" />
    <polygon points="-170,-540 40,-500 40,-60 -170,-20" fill="#24345E" stroke="#5CF2FF" strokeWidth={6} />
    <text x={-70} y={-380} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={74} fill="#5CF2FF">404</text>
    <circle cx={10} cy={-270} r={12} fill="#FFD23F" />
    <polygon points="40,-20 170,-20 420,140 -60,140" fill="#E9FFFF" opacity={0.35} />
  </g>
);

export const Room404Thumb: React.FC<{ v: "A" | "B" }> = ({ v }) => {
  const a = v === "A";
  return (
    <AbsoluteFill style={{ background: "radial-gradient(90% 90% at 30% 50%, #22336A 0%, #070B1C 100%)", overflow: "hidden" }}>
      <svg viewBox="0 0 1280 720" width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        <CharDefs />
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx={(i * 211) % 1280} cy={(i * 137) % 720} r={2 + (i % 3)} fill="#5CF2FF" opacity={0.35} />
        ))}
        {a ? (
          <>
            <Door x={330} y={640} s={1.05} />
            <Kid x={110} y={1180} s={0.78} who="joanna" glasses="pink" expr="shock" blink={0} look={[1, -0.3]} armL={{ target: [-120, -820] }} armR={{ target: [120, -820] }} />
            <Kid x={560} y={1110} s={0.62} who="boy" hair="#151010" skinTone="J" expr="shock" blink={0} look={[-1, -0.3]} sweat={1} />
            <Zero x={610} y={250} s={0.5} f={12} mood="glitch" />
          </>
        ) : (
          <>
            <circle cx={340} cy={330} r={300} fill="#FF4D6D" opacity={0.18} />
            <Zero x={340} y={560} s={1.1} f={12} mood="glitch" />
            <Kid x={90} y={1150} s={0.62} who="joanna" glasses="pink" expr="worry" blink={0} look={[1, -0.6]} />
            <Kid x={600} y={1110} s={0.5} who="boy" hair="#151010" skinTone="J" expr="shock" blink={0} look={[-1, -0.6]} sweat={1} />
          </>
        )}
      </svg>
      <div dir="rtl" style={{ position: "absolute", right: 36, top: 60, width: 620, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontWeight: 800, fontSize: 112, lineHeight: 1.05, color: "#fff", textShadow: `${outline("#0A1530", 8)}, 0 0 40px rgba(92,242,255,0.9)` }}>
          سرّ الغرفة
        </div>
        <div style={{ fontWeight: 800, fontSize: 190, lineHeight: 1, color: "#5CF2FF", textShadow: `${outline("#0A1530", 9)}, 0 0 50px rgba(92,242,255,0.9)` }}>404</div>
        <div style={{ marginTop: 18, display: "inline-block", padding: "10px 36px", borderRadius: 24, background: a ? "#FFD23F" : "#FF4D6D", color: a ? "#1E2A44" : "#fff", fontWeight: 800, fontSize: 58, transform: "rotate(-3deg)", boxShadow: "0 10px 0 rgba(0,0,0,0.35)" }}>
          {a ? "الجزء الأول كامل!" : "صديق ولا عدو؟!"}
        </div>
      </div>
      <div dir="rtl" style={{ position: "absolute", right: 40, bottom: 30, padding: "8px 26px", borderRadius: 40, background: "#5CF2FF", color: "#0A1530", fontFamily: FONT, fontWeight: 800, fontSize: 42, boxShadow: "0 6px 0 rgba(0,0,0,0.35)" }}>
        {a ? "٦ حلقات 🎬" : "الجزء الأول كامل 🎬"}
      </div>
    </AbsoluteFill>
  );
};
export const Room404ThumbA: React.FC = () => <Room404Thumb v="A" />;
export const Room404ThumbB: React.FC = () => <Room404Thumb v="B" />;
