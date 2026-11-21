import React from "react";
import { AbsoluteFill } from "remotion";
import { Product, TUBE } from "./base";

/** A clean reference image of the NAQĀ tube (fictional brand) to upload to image tools as the product. */
export const ProductRef: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #f6f6f4, #e9e9e6)" }}>
    <Product h={1500} style={{ left: 540 - (1500 * TUBE.w) / TUBE.h / 2, top: 200 }} shadow={0.25} />
  </AbsoluteFill>
);
