import React from "react";
import { AbsoluteFill } from "remotion";
import { CharDefs, Kid } from "../joanna/chars";
import { Kitten } from "../home/kit";
import { FONT } from "../room404/kit";

const Sticker: React.FC<{ e: string; x: number; y: number; s: number; r: number }> = ({ e, x, y, s, r }) => (
  <div style={{ position: "absolute", left: x, top: y, fontSize: s, transform: `rotate(${r}deg)`, filter: "drop-shadow(6px 0 0 #fff) drop-shadow(-6px 0 0 #fff) drop-shadow(0 6px 0 #fff) drop-shadow(0 -6px 0 #fff) drop-shadow(0 12px 18px rgba(0,0,0,0.35))" }}>{e}</div>
);
const outline = (c: string, w: number) => Array.from({ length: 16 }).map((_, i) => `${Math.round(Math.cos((i / 16) * Math.PI * 2) * w)}px ${Math.round(Math.sin((i / 16) * Math.PI * 2) * w)}px 0 ${c}`).join(",");

export const HomeThumb: React.FC<{ v: "A" | "B" }> = ({ v }) => {
  const a = v === "A";
  const bg = a ? "#E8743B" : "#2E7D7A";
  const ray = a ? "#F39561" : "#3E9A95";
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <svg viewBox="0 0 1280 720" width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 18 }).map((_, i) => {
          const p = (i / 18) * Math.PI * 2;
          const q = ((i + 0.5) / 18) * Math.PI * 2;
          return <polygon key={i} points={`330,380 ${330 + Math.cos(p) * 1600},${380 + Math.sin(p) * 1600} ${330 + Math.cos(q) * 1600},${380 + Math.sin(q) * 1600}`} fill={ray} />;
        })}
        <circle cx={330} cy={380} r={300} fill="#fff" opacity={0.25} />
        <CharDefs />
        {a ? (
          <>
            <Kid x={330} y={1250} s={1.15} who="boy" hair="#151010" skinTone="J" expr="shock" blink={0} look={[0, -1]} sweat={1} />
            <Kitten x={330} y={150} s={0.95} f={0} sleep />
          </>
        ) : (
          <>
            <Kid x={190} y={1090} s={0.8} who="joanna" glasses="pink" expr="laugh" blink={0} look={[0.6, -0.2]} />
            <Kid x={470} y={1060} s={0.66} who="boy" hair="#151010" skinTone="J" expr="laugh" blink={0} look={[-0.5, -0.3]} armR={{ a: 150, b: 170 }} />
            <Kitten x={470} y={1060 - 0.66 * 960} s={0.5} f={0} />
          </>
        )}
      </svg>
      {a ? (
        <>
          <Sticker e="🔦" x={560} y={40} s={110} r={-14} />
          <Sticker e="🏺" x={30} y={420} s={110} r={-10} />
          <Sticker e="🐱" x={560} y={520} s={100} r={12} />
        </>
      ) : (
        <>
          <Sticker e="📦" x={570} y={40} s={110} r={10} />
          <Sticker e="🛍️" x={20} y={30} s={100} r={-12} />
          <Sticker e="🔦" x={580} y={540} s={100} r={-10} />
        </>
      )}
      <div dir="rtl" style={{ position: "absolute", right: 40, top: 70, width: 620, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontWeight: 800, fontSize: 140, lineHeight: 1.05, color: "#fff", textShadow: `${outline("#5A2410", 9)}, 0 14px 0 #5A2410` }}>
          حكايات
          <br />
          بيتنا
        </div>
        <div style={{ marginTop: 26, display: "inline-block", padding: "10px 38px", borderRadius: 24, background: a ? "#FFE14D" : "#FF6FA8", color: a ? "#3A1A00" : "#fff", fontWeight: 800, fontSize: 64, transform: "rotate(-3deg)", boxShadow: "0 10px 0 rgba(0,0,0,0.25)" }}>
          الموسم الأول كامل!
        </div>
      </div>
      <div dir="rtl" style={{ position: "absolute", right: 40, bottom: 34, padding: "8px 26px", borderRadius: 40, background: a ? "#2E7D7A" : "#C0574B", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 44, boxShadow: "0 6px 0 rgba(0,0,0,0.25)" }}>
        ٦ حكايات 🎬
      </div>
    </AbsoluteFill>
  );
};
export const HomeThumbA: React.FC = () => <HomeThumb v="A" />;
export const HomeThumbB: React.FC = () => <HomeThumb v="B" />;
