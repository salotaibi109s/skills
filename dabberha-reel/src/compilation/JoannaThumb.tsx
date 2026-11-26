import React from "react";
import { AbsoluteFill } from "remotion";
import { CharDefs, Kid } from "../joanna/chars";
import { FONT } from "../room404/kit";

const Sticker: React.FC<{ e: string; x: number; y: number; s: number; r: number }> = ({ e, x, y, s, r }) => (
  <div style={{ position: "absolute", left: x, top: y, fontSize: s, transform: `rotate(${r}deg)`, filter: "drop-shadow(0 0 0 #fff) drop-shadow(6px 0 0 #fff) drop-shadow(-6px 0 0 #fff) drop-shadow(0 6px 0 #fff) drop-shadow(0 -6px 0 #fff) drop-shadow(0 12px 18px rgba(0,0,0,0.35))" }}>{e}</div>
);

const outline = (c: string, w: number) => Array.from({ length: 16 }).map((_, i) => `${Math.round(Math.cos((i / 16) * Math.PI * 2) * w)}px ${Math.round(Math.sin((i / 16) * Math.PI * 2) * w)}px 0 ${c}`).join(",");

export const JoannaThumb: React.FC<{ v: "A" | "B" }> = ({ v }) => {
  const shock = v === "A";
  return (
    <AbsoluteFill style={{ background: shock ? "#FF5E9C" : "#FFC83D", overflow: "hidden" }}>
      {/* sunburst */}
      <svg viewBox="0 0 1280 720" width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2;
          const b = ((i + 0.5) / 18) * Math.PI * 2;
          return <polygon key={i} points={`330,380 ${330 + Math.cos(a) * 1600},${380 + Math.sin(a) * 1600} ${330 + Math.cos(b) * 1600},${380 + Math.sin(b) * 1600}`} fill={shock ? "#FF86B6" : "#FFE07A"} />;
        })}
        <circle cx={330} cy={380} r={300} fill={shock ? "#FFC2DA" : "#FFF1B8"} opacity={0.9} />
      </svg>
      <svg viewBox="0 0 1280 720" width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        <CharDefs />
        <Kid x={330} y={1250} s={1.18} who="joanna" glasses="pink" expr={shock ? "shock" : "laugh"} blink={0} look={shock ? [0.7, -0.1] : [0.3, -0.2]} armL={shock ? { target: [-150, -820] } : { a: 150, b: 170 }} armR={shock ? { target: [150, -820] } : { a: 150, b: 170 }} />
      </svg>
      {shock ? (
        <>
          <Sticker e="✉️" x={530} y={40} s={130} r={-14} />
          <Sticker e="❓" x={20} y={20} s={110} r={-12} />
          <Sticker e="🎤" x={560} y={520} s={110} r={12} />
        </>
      ) : (
        <>
          <Sticker e="🏆" x={540} y={40} s={140} r={10} />
          <Sticker e="⭐" x={30} y={30} s={100} r={-12} />
          <Sticker e="🎒" x={560} y={520} s={110} r={-10} />
        </>
      )}
      <div dir="rtl" style={{ position: "absolute", right: 40, top: 70, width: 620, textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontWeight: 800, fontSize: 150, lineHeight: 1.05, color: "#fff", textShadow: `${outline("#7A1E4A", 9)}, 0 14px 0 #7A1E4A` }}>
          يوميات
          <br />
          جوانا
        </div>
        <div style={{ marginTop: 26, display: "inline-block", padding: "10px 38px", borderRadius: 24, background: shock ? "#FFE14D" : "#E8417A", color: shock ? "#3A1A00" : "#fff", fontWeight: 800, fontSize: 66, transform: "rotate(-3deg)", boxShadow: "0 10px 0 rgba(0,0,0,0.25)" }}>
          الموسم الأول كامل!
        </div>
      </div>
      <div dir="rtl" style={{ position: "absolute", right: 40, bottom: 34, padding: "8px 26px", borderRadius: 40, background: "#2E7D7A", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 44, boxShadow: "0 6px 0 rgba(0,0,0,0.25)" }}>
          ٨ حلقات 🎬
      </div>
    </AbsoluteFill>
  );
};
export const JoannaThumbA: React.FC = () => <JoannaThumb v="A" />;
export const JoannaThumbB: React.FC = () => <JoannaThumb v="B" />;
