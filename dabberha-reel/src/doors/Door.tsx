import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { fonts } from "../theme";
import { hall } from "./base";

/**
 * Arched door in real CSS 3D: the leaf swings open on its right-hand hinge
 * (the reading side in Arabic) and light spills out of the room behind it.
 */
export const Door: React.FC<{
  width: number;
  color: string;
  open: number; // 0 closed → 1 fully open
  lit?: number; // 0..1 lamp above the door
  number?: string;
  label?: string;
  labelSize?: number;
  style?: React.CSSProperties;
}> = ({ width, color, open, lit = 1, number, label, labelSize, style }) => {
  const height = width * 1.9;
  const r = width / 2;
  const arch = `${r}px ${r}px 14px 14px`;
  return (
    <div style={{ position: "relative", width, height, ...style }}>
      {/* lamp */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -width * 0.22,
          translate: "-50% 0px",
          width: width * 0.18,
          height: width * 0.08,
          borderRadius: 999,
          background: lit > 0.05 ? "#FFF4D6" : "#B9AE9C",
          boxShadow: lit > 0.05 ? `0 0 ${30 * lit}px ${12 * lit}px rgba(255,236,190,${0.8 * lit})` : "none",
        }}
      />
      {/* frame */}
      <div style={{ position: "absolute", inset: -width * 0.06, borderRadius: `${r * 1.12}px ${r * 1.12}px 18px 18px`, background: hall.frame }} />
      {/* the room behind: bright light in the door colour */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: arch,
          overflow: "hidden",
          background: `radial-gradient(80% 60% at 50% 60%, #FFFFFF 0%, ${color} 140%)`,
        }}
      />
      {/* leaf */}
      <div style={{ position: "absolute", inset: 0, perspective: width * 4 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: arch,
            background: `linear-gradient(160deg, ${color} 0%, ${shade(color, -0.22)} 100%)`,
            boxShadow: "inset 0 0 0 6px rgba(255,255,255,0.12), inset 0 -30px 60px rgba(0,0,0,0.18)",
            transformOrigin: "100% 50%",
            rotate: `y ${-open * 108}deg`,
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: width * 0.04,
            color: "#fff",
            opacity: open > 0.97 ? 0 : 1,
          }}
        >
          {/* panels */}
          <div style={{ position: "absolute", inset: `${width * 0.16}px ${width * 0.13}px ${width * 0.1}px`, borderRadius: `${r * 0.8}px ${r * 0.8}px 10px 10px`, border: "3px solid rgba(255,255,255,0.22)" }} />
          {number && (
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: width * 0.34, lineHeight: 1, textShadow: "0 6px 18px rgba(0,0,0,0.2)" }}>{number}</div>
          )}
          {label && (
            <div dir="rtl" style={{ fontFamily: fonts.text, fontWeight: 700, fontSize: labelSize ?? width * 0.085, textAlign: "center", paddingInline: width * 0.16, lineHeight: 1.3 }}>
              {label}
            </div>
          )}
          {/* handle */}
          <div style={{ position: "absolute", left: width * 0.12, top: "56%", width: width * 0.05, height: width * 0.2, borderRadius: 999, background: "#F3D9A0" }} />
        </div>
      </div>
      {/* light spill on the floor */}
      <div
        style={{
          position: "absolute",
          left: -width * 0.3,
          right: -width * 0.3,
          bottom: -width * 0.55,
          height: width * 0.6,
          background: `radial-gradient(50% 60% at 50% 0%, rgba(255,250,235,${0.75 * open}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

/** Mix a colour with white (t = 0 → colour, 1 → white). */
export const tint = (hex: string, t: number) => {
  const n = parseInt(hex.slice(1), 16);
  const m = (c: number) => Math.round(c + (255 - c) * t);
  return `rgb(${m(n >> 16)}, ${m((n >> 8) & 255)}, ${m(n & 255)})`;
};

export const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + c * amt)));
  return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
};

/** Service card that flips up in 3D, on the frame its name is spoken. Prices from the store. */
export const FlipCard: React.FC<{ at: number; icon: IconName; title: string; price?: number; color: string; width?: number }> = ({
  at,
  icon,
  title,
  price,
  color,
  width = 440,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 140 } });
  if (frame < at - 1) return <div style={{ width, height: 128 }} />;
  return (
    <div style={{ perspective: 1400, width }}>
      <div
        dir="rtl"
        style={{
          width,
          height: 128,
          borderRadius: 28,
          background: "#fff",
          boxShadow: "0 24px 48px rgba(13,36,71,0.14)",
          borderInlineStart: `10px solid ${color}`,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "0 26px",
          transformOrigin: "50% 100%",
          rotate: `x ${(1 - s) * 90}deg`,
          opacity: Math.min(1, s * 2),
        }}
      >
        <div style={{ width: 72, height: 72, flex: "0 0 72px", borderRadius: 20, display: "grid", placeItems: "center", background: `${color}1f` }}>
          <Icon name={icon} size={42} color={color} stroke={2} />
        </div>
        <div style={{ flex: 1, fontFamily: fonts.text, fontWeight: 700, fontSize: 38, color: hall.ink, lineHeight: 1.25 }}>{title}</div>
        {price !== undefined && (
          <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 40, color, whiteSpace: "nowrap" }}>
            <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>{price}</span>
            <span style={{ fontFamily: fonts.text, fontWeight: 600, fontSize: 24, marginRight: 6 }}>ر.س</span>
          </div>
        )}
      </div>
    </div>
  );
};
