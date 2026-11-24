import React from "react";
import { fonts } from "../theme";
import { film } from "./base";

export type StampMark = { text: string; x: number; y: number; rot: number; scale?: number; color?: string };

/**
 * The hero: a classic green hanging file folder, drawn in SVG.
 * `sag` makes it droop (tired), `papers` controls how far the sheets stick out,
 * `photo` shows the ID-photo slot ("missing" = empty dashed slot).
 */
export const Folder: React.FC<{
  width?: number;
  sag?: number;
  papers?: number;
  photo?: "ok" | "missing" | "none";
  stamps?: StampMark[];
  label?: string;
  medal?: number; // 0..1 retirement ribbon
  style?: React.CSSProperties;
}> = ({ width = 600, sag = 0, papers = 1, photo = "none", stamps = [], label = "معاملة", medal = 0, style }) => {
  const h = (width * 460) / 600;
  return (
    <div
      style={{
        width,
        height: h,
        position: "relative",
        transformOrigin: "50% 100%",
        scale: `${1 + sag * 0.04} ${1 - sag * 0.12}`,
        rotate: `${sag * -3}deg`,
        ...style,
      }}
    >
      <svg width={width} height={h} viewBox="-40 -40 680 500" style={{ overflow: "visible", position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="fFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={film.greenLight} />
            <stop offset="1" stopColor={film.green} />
          </linearGradient>
          <linearGradient id="fBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={film.green} />
            <stop offset="1" stopColor={film.greenDark} />
          </linearGradient>
        </defs>
        {/* metal hanger rods */}
        <rect x="-38" y="18" width="716" height="10" rx="5" fill="#9AA1A8" />
        <path d="M-38 23 q-12 0 -12 14" stroke="#9AA1A8" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M678 23 q12 0 12 14" stroke="#9AA1A8" strokeWidth="9" fill="none" strokeLinecap="round" />
        {/* back panel with tab */}
        <rect x="0" y="22" width="640" height="420" rx="12" fill="url(#fBack)" />
        <path d="M430 22 L450 -18 L600 -18 L620 22 Z" fill={film.greenDark} />
        <rect x="462" y="-10" width="126" height="26" rx="4" fill={film.paper} />
        {/* papers sticking out */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${60 + i * 150} ${70 - papers * (36 + i * 10)}) rotate(${-4 + i * 4})`}>
            <rect width="240" height="300" rx="4" fill={film.paper} stroke="#DCD5C6" />
            {Array.from({ length: 6 }).map((_, k) => (
              <rect key={k} x="24" y={30 + k * 22} width={k % 3 === 2 ? 120 : 190} height="8" rx="4" fill="#CFC7B6" />
            ))}
          </g>
        ))}
        {/* front panel */}
        <path d="M0 96 Q320 80 640 96 L640 430 Q640 442 628 442 L12 442 Q0 442 0 430 Z" fill="url(#fFront)" />
        <path d="M0 96 Q320 80 640 96" stroke="rgba(255,255,255,0.35)" strokeWidth="3" fill="none" />
        <path d="M120 120 L120 420 M520 120 L520 420" stroke="rgba(0,0,0,0.08)" strokeWidth="3" />
      </svg>
      {/* tab label */}
      <div
        dir="rtl"
        style={{
          position: "absolute",
          left: ((462 + 40) / 680) * width,
          top: ((-10 + 40) / 500) * h,
          width: (126 / 680) * width,
          height: (26 / 500) * h,
          display: "grid",
          placeItems: "center",
          fontFamily: fonts.text,
          fontWeight: 700,
          fontSize: width * 0.032,
          color: "#3b3b3b",
        }}
      >
        {label}
      </div>
      {/* ID photo slot */}
      {photo !== "none" && (
        <div
          style={{
            position: "absolute",
            right: width * 0.12,
            top: h * 0.3,
            width: width * 0.15,
            height: width * 0.19,
            borderRadius: 6,
            background: photo === "ok" ? "#DDE6EE" : "rgba(255,255,255,0.12)",
            border: photo === "ok" ? "4px solid #fff" : `4px dashed rgba(255,255,255,0.85)`,
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: width * 0.1,
          }}
        >
          {photo === "missing" ? "؟" : null}
        </div>
      )}
      {/* stamps */}
      {stamps.map((s, i) => (
        <div
          key={i}
          dir="rtl"
          style={{
            position: "absolute",
            left: s.x * width,
            top: s.y * h,
            translate: "-50% -50%",
            rotate: `${s.rot}deg`,
            scale: String(s.scale ?? 1),
            padding: `${width * 0.012}px ${width * 0.03}px`,
            border: `${width * 0.008}px solid ${s.color ?? film.ink}`,
            borderRadius: width * 0.015,
            color: s.color ?? film.ink,
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: width * 0.06,
            opacity: 0.88,
            mixBlendMode: "multiply",
            whiteSpace: "nowrap",
          }}
        >
          {s.text}
        </div>
      ))}
      {/* retirement ribbon */}
      {medal > 0 && (
        <div style={{ position: "absolute", left: width * 0.16, top: h * 0.36, scale: String(medal), rotate: `${(1 - medal) * -30}deg` }}>
          <svg width={width * 0.2} height={width * 0.3} viewBox="0 0 100 150">
            <path d="M30 70 L18 148 L40 132 L50 150 L56 78 Z" fill="#C8243A" />
            <path d="M70 70 L82 148 L60 132 L50 150 L44 78 Z" fill="#A81D30" />
            <circle cx="50" cy="50" r="42" fill="#F2C14E" stroke="#D9A42F" strokeWidth="6" />
            <path d="M50 24 l8 17 18 2 -13 12 4 18 -17 -9 -17 9 4 -18 -13 -12 18 -2z" fill="#fff" opacity="0.9" />
          </svg>
        </div>
      )}
    </div>
  );
};
