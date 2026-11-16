import React from "react";
import { colors } from "../theme";

/** Original, brand-neutral phone frame (no real device branding). */
export const Phone: React.FC<{ width?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  width = 470,
  children,
  style,
}) => {
  const height = width * 2.05;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.14,
        padding: width * 0.03,
        background: "linear-gradient(145deg, #2a3550 0%, #0c1222 55%, #1c2640 100%)",
        boxShadow:
          "0 60px 120px rgba(0,0,0,0.45), inset 0 0 0 2px rgba(255,255,255,0.10), inset 0 2px 0 rgba(255,255,255,0.18)",
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: width * 0.115,
          overflow: "hidden",
          background: colors.ice,
          position: "relative",
        }}
      >
        {children}
        {/* camera pill */}
        <div
          style={{
            position: "absolute",
            top: width * 0.03,
            left: "50%",
            translate: "-50% 0px",
            width: width * 0.26,
            height: width * 0.065,
            borderRadius: 999,
            background: "#05080f",
          }}
        />
      </div>
    </div>
  );
};
