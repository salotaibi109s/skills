import React from "react";
import { fonts } from "../theme";
import { story } from "./base";

// Original flat illustrations, drawn in SVG for this video. Faceless, stylised figures.

export type PersonKind = "man" | "manRed" | "woman" | "boy";

export const Person: React.FC<{
  kind: PersonKind;
  skin?: string;
  height?: number;
  style?: React.CSSProperties;
  holdingPhone?: boolean;
}> = ({ kind, skin = story.skin[0], height = 240, style, holdingPhone }) => {
  const w = (height * 100) / 240;
  const thobe = kind === "woman" ? "#1d1d22" : "#F7F6F1";
  const thobeStroke = kind === "woman" ? "#0e0e12" : "#DCD9CF";
  return (
    <svg width={w} height={height} viewBox="0 0 100 240" style={{ overflow: "visible", ...style }}>
      <defs>
        <pattern id="shemagh" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="#F4F1EA" />
          <rect width="3" height="3" fill="#C8243A" />
        </pattern>
      </defs>
      {/* body */}
      <path
        d={
          kind === "boy"
            ? "M30 118 C30 104 40 98 50 98 C60 98 70 104 70 118 L74 240 L26 240 Z"
            : "M18 112 C18 96 32 88 50 88 C68 88 82 96 82 112 L86 240 L14 240 Z"
        }
        fill={thobe}
        stroke={thobeStroke}
        strokeWidth={1.2}
      />
      {kind !== "woman" && kind !== "boy" && <path d="M50 94 L50 150" stroke={thobeStroke} strokeWidth={1.5} />}
      {kind === "woman" ? (
        <>
          <path d="M24 70 C24 34 76 34 76 70 L82 112 C70 100 30 100 18 112 Z" fill="#26262c" />
          <ellipse cx="50" cy="62" rx="13" ry="16" fill={skin} />
          <path d="M33 56 C33 36 67 36 67 56 C60 48 40 48 33 56 Z" fill="#26262c" />
        </>
      ) : kind === "boy" ? (
        <>
          <ellipse cx="50" cy="78" rx="15" ry="17" fill={skin} />
          <path d="M35 74 C35 56 65 56 65 74 C58 68 42 68 35 74 Z" fill="#2b2118" />
        </>
      ) : (
        <>
          {/* ghutra / shemagh falling to the shoulders */}
          <path d="M27 64 C27 32 73 32 73 64 L80 104 C66 96 34 96 20 104 Z" fill={kind === "manRed" ? "url(#shemagh)" : "#FBFAF6"} stroke="#E4E0D6" strokeWidth={0.8} />
          <ellipse cx="50" cy="64" rx="14" ry="17" fill={skin} />
          <path d="M37 72 C40 80 60 80 63 72 C60 84 40 84 37 72 Z" fill="#2b2118" opacity={0.75} />
          <path d="M31 56 C31 34 69 34 69 56 C60 49 40 49 31 56 Z" fill={kind === "manRed" ? "url(#shemagh)" : "#FBFAF6"} />
          <rect x="31" y="40" width="38" height="6" rx="3" fill="#1b1b1b" />
        </>
      )}
      {holdingPhone && (
        <>
          <rect x="40" y="118" width="20" height="32" rx="4" fill="#111" />
          <rect x="42" y="121" width="16" height="25" rx="2" fill={story.brand.tealBright} />
          <circle cx="40" cy="140" r="5" fill={skin} />
          <circle cx="60" cy="140" r="5" fill={skin} />
        </>
      )}
    </svg>
  );
};

export const Car: React.FC<{ color: string; width?: number; style?: React.CSSProperties; flip?: boolean }> = ({
  color,
  width = 240,
  style,
  flip,
}) => (
  <svg
    width={width}
    height={(width * 90) / 220}
    viewBox="0 0 220 90"
    style={{ scale: flip ? "-1 1" : undefined, overflow: "visible", ...style }}
  >
    <ellipse cx="110" cy="84" rx="100" ry="6" fill="rgba(0,0,0,0.18)" />
    <path d="M12 62 C12 48 22 44 36 42 L62 40 L84 18 C88 14 94 12 100 12 L150 12 C158 12 164 16 168 22 L184 42 L196 46 C204 48 208 54 208 62 L208 70 L12 70 Z" fill={color} />
    <path d="M90 22 L104 18 L120 18 L120 40 L72 40 Z" fill="#CFE6F2" />
    <path d="M128 18 L150 18 C154 18 158 20 160 24 L172 40 L128 40 Z" fill="#CFE6F2" />
    <rect x="196" y="52" width="10" height="6" rx="2" fill="#FFE08A" />
    <rect x="12" y="52" width="8" height="6" rx="2" fill="#E2523F" />
    <circle cx="56" cy="70" r="14" fill="#1E2230" />
    <circle cx="56" cy="70" r="6" fill="#9AA0AC" />
    <circle cx="166" cy="70" r="14" fill="#1E2230" />
    <circle cx="166" cy="70" r="6" fill="#9AA0AC" />
  </svg>
);

/** Analog clock. `hours` is a decimal time of day, e.g. 7.5 = 7:30. */
export const Clock: React.FC<{ hours: number; size?: number; face?: string; ink?: string; style?: React.CSSProperties }> = ({
  hours,
  size = 260,
  face = story.paper,
  ink = story.ink,
  style,
}) => {
  const h = ((hours % 12) + 12) % 12;
  const m = (hours - Math.floor(hours)) * 60;
  const hourDeg = h * 30;
  const minDeg = m * 6;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={style}>
      <circle cx="100" cy="100" r="96" fill={ink} />
      <circle cx="100" cy="100" r="86" fill={face} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x="97" y="20" width="6" height={i % 3 === 0 ? 18 : 10} rx="3" fill={ink} transform={`rotate(${i * 30} 100 100)`} />
      ))}
      <rect x="95" y="52" width="10" height="54" rx="5" fill={ink} transform={`rotate(${hourDeg} 100 100)`} />
      <rect x="97" y="30" width="6" height="76" rx="3" fill={story.warm} transform={`rotate(${minDeg} 100 100)`} />
      <circle cx="100" cy="100" r="8" fill={ink} />
    </svg>
  );
};

export const fmtTime = (hours: number) => {
  const h24 = Math.floor(hours) % 24;
  const m = Math.floor((hours - Math.floor(hours)) * 60);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h24 < 12 ? "ص" : "م"}`;
};

/** LED "now serving" board. */
export const LedBoard: React.FC<{ value: number; label?: string; width?: number; dim?: boolean; style?: React.CSSProperties }> = ({
  value,
  label = "الرقم الحالي",
  width = 620,
  dim,
  style,
}) => (
  <div
    dir="rtl"
    style={{
      width,
      padding: "22px 34px 26px",
      borderRadius: 26,
      background: "#0B0C10",
      border: "6px solid #2A2D36",
      boxShadow: "0 30px 60px rgba(0,0,0,0.35), inset 0 0 40px rgba(255,59,48,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      ...style,
    }}
  >
    <div style={{ fontFamily: fonts.text, fontWeight: 700, fontSize: width * 0.065, color: "#9CA0AA" }}>{label}</div>
    <div
      style={{
        direction: "ltr",
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: width * 0.22,
        lineHeight: 1,
        color: dim ? "#7a2a26" : story.led,
        textShadow: dim ? "none" : `0 0 18px ${story.led}, 0 0 40px rgba(255,59,48,0.5)`,
        fontVariantNumeric: "tabular-nums",
        // dot-matrix feel
        WebkitMaskImage: "radial-gradient(circle, #000 62%, transparent 66%)",
        WebkitMaskSize: "7px 7px",
      }}
    >
      {String(value).padStart(3, "0")}
    </div>
  </div>
);

/** Paper queue ticket. */
export const Ticket: React.FC<{
  number: number | string;
  title?: string;
  footer?: string;
  time?: string;
  width?: number;
  brand?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ number, title = "رقم الانتظار", footer = "الرجاء الانتظار حتى يُنادى رقمك", time, width = 520, brand, children, style }) => (
  <div
    dir="rtl"
    style={{
      width,
      background: story.paper,
      borderRadius: "22px 22px 0 0",
      boxShadow: "0 40px 70px rgba(0,0,0,0.35)",
      position: "relative",
      paddingBottom: 30,
      fontFamily: fonts.text,
      color: story.ink,
      textAlign: "center",
      ...style,
    }}
  >
    <div
      style={{
        borderRadius: "22px 22px 0 0",
        padding: "22px 0 18px",
        background: brand ? `linear-gradient(135deg, ${story.brand.navy}, ${story.brand.teal})` : story.sand,
        color: brand ? "#fff" : story.inkSoft,
        fontWeight: 700,
        fontSize: width * 0.065,
      }}
    >
      {title}
    </div>
    <div
      style={{
        direction: "ltr",
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: width * 0.42,
        lineHeight: 1.05,
        marginTop: 16,
        color: brand ? story.brand.navy : story.ink,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {number}
    </div>
    {children}
    <div style={{ fontSize: width * 0.045, fontWeight: 500, color: story.inkSoft, marginTop: 10, paddingInline: 30 }}>{footer}</div>
    {time && <div style={{ fontSize: width * 0.04, color: story.inkSoft, marginTop: 8, direction: "rtl" }}>{time}</div>}
    <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 18, height: 50 }}>
      {Array.from({ length: 34 }).map((_, i) => (
        <div key={i} style={{ width: [2, 4, 3, 6, 2, 5][i % 6], background: story.ink, opacity: 0.85 }} />
      ))}
    </div>
    {/* torn zig-zag edge */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -18,
        height: 18,
        background: `linear-gradient(-45deg, transparent 12px, ${story.paper} 0) 0 0 / 24px 18px repeat-x, linear-gradient(45deg, transparent 12px, ${story.paper} 0) 0 0 / 24px 18px repeat-x`,
      }}
    />
  </div>
);

export const Chair: React.FC<{ width?: number; color?: string; style?: React.CSSProperties }> = ({
  width = 170,
  color = "#3E6C8F",
  style,
}) => (
  <svg width={width} height={width * 0.9} viewBox="0 0 170 153" style={style}>
    <rect x="10" y="0" width="150" height="96" rx="22" fill={color} />
    <rect x="10" y="0" width="150" height="96" rx="22" fill="url(#chairShade)" />
    <defs>
      <linearGradient id="chairShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
        <stop offset="1" stopColor="#000" stopOpacity="0.12" />
      </linearGradient>
    </defs>
    <rect x="0" y="92" width="170" height="26" rx="12" fill={color} />
    <rect x="22" y="118" width="10" height="35" fill="#2A2D36" />
    <rect x="138" y="118" width="10" height="35" fill="#2A2D36" />
  </svg>
);

export const Plant: React.FC<{ height?: number; style?: React.CSSProperties }> = ({ height = 300, style }) => (
  <svg width={height * 0.6} height={height} viewBox="0 0 120 200" style={style}>
    <path d="M60 130 C20 120 10 70 30 40 C45 70 55 90 60 130 Z" fill="#4E8A5C" />
    <path d="M60 130 C100 120 112 66 92 30 C76 66 66 90 60 130 Z" fill="#3F7A4F" />
    <path d="M60 130 C54 90 56 40 62 10 C70 40 68 90 60 130 Z" fill="#5FA06C" />
    <path d="M32 128 L88 128 L80 196 L40 196 Z" fill="#C97B4A" />
  </svg>
);
