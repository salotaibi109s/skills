import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { Icon, IconName } from "./Icons";

export const glassStyle = (tone: "dark" | "light" = "dark"): React.CSSProperties =>
  tone === "dark"
    ? {
        background: "linear-gradient(160deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 100%)",
        border: "1.5px solid rgba(255,255,255,0.22)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), 0 30px 60px rgba(0,0,0,0.35)",
        backdropFilter: "blur(26px) saturate(140%)",
      }
    : {
        background: "linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 100%)",
        border: "1.5px solid rgba(255,255,255,0.9)",
        boxShadow: "0 24px 50px rgba(13,36,71,0.16), inset 0 1px 0 #fff",
        backdropFilter: "blur(20px)",
      };

/** Service card: generic line icon (never an official logo) + name + price, staggered in with a spring. */
export const ServiceCard: React.FC<{
  at: number;
  icon: IconName;
  title: string;
  price?: number;
  width?: number;
  tone?: "dark" | "light";
  emphasis?: number; // 0..1 dims the card when another one takes focus
  from?: "below" | "right" | "left";
  stacked?: boolean; // icon + price on top, title below (for narrow columns)
}> = ({ at, icon, title, price, width = 440, tone = "dark", emphasis = 1, from = "below", stacked = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: springs.snappy });
  const blur = interpolate(frame, [at, at + 10], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const off = (1 - s) * 140;
  const translate = from === "below" ? `0px ${off}px` : from === "right" ? `${off}px 0px` : `${-off}px 0px`;
  const fg = tone === "dark" ? colors.white : colors.textOnLight;
  return (
    <div
      dir="rtl"
      style={{
        width,
        borderRadius: 34,
        padding: "26px 30px",
        display: "flex",
        flexWrap: stacked ? "wrap" : "nowrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: stacked ? "18px 22px" : 22,
        ...glassStyle(tone),
        translate,
        scale: String(0.9 + 0.1 * s),
        opacity: frame < at ? 0 : Math.min(1, s * 1.5) * (0.35 + 0.65 * emphasis),
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          flex: "0 0 76px",
          borderRadius: 22,
          display: "grid",
          placeItems: "center",
          background: tone === "dark" ? "rgba(43,196,196,0.16)" : "rgba(14,147,154,0.12)",
          border: `1.5px solid ${tone === "dark" ? "rgba(43,196,196,0.45)" : "rgba(14,147,154,0.35)"}`,
        }}
      >
        <Icon name={icon} size={42} color={tone === "dark" ? colors.tealBright : colors.teal} />
      </div>
      <div
        style={{
          flex: stacked ? "0 0 100%" : 1,
          order: stacked ? 3 : 0,
          fontFamily: fonts.text,
          fontWeight: 700,
          fontSize: 40,
          color: fg,
          lineHeight: 1.25,
        }}
      >
        {title}
      </div>
      {price !== undefined && (
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 38,
            color: tone === "dark" ? colors.gold : colors.primary,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>{price}</span>
          <span style={{ fontSize: 24, fontFamily: fonts.text, fontWeight: 600, marginRight: 6, opacity: 0.85 }}>
            ر.س
          </span>
        </div>
      )}
    </div>
  );
};

/** Small pill label used for section titles. */
export const Pill: React.FC<{ at: number; children: React.ReactNode; tone?: "dark" | "light" }> = ({
  at,
  children,
  tone = "dark",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: springs.soft });
  return (
    <div
      dir="rtl"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 30px",
        borderRadius: 999,
        fontFamily: fonts.text,
        fontWeight: 600,
        fontSize: 34,
        color: tone === "dark" ? colors.white : colors.textOnLight,
        ...glassStyle(tone),
        opacity: frame < at ? 0 : s,
        translate: `0px ${(1 - s) * 30}px`,
      }}
    >
      <span style={{ width: 14, height: 14, borderRadius: 7, background: colors.gold }} />
      {children}
    </div>
  );
};
