import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../../components/Backdrop";
import { Icon } from "../../components/Icons";
import { Counter } from "../../components/Kinetic";
import { fonts } from "../../theme";
import { cue, cueEnd, getStoryScene, SceneVoice, Sfx, story } from "../base";
import { Captions } from "../Captions";

const scene = getStoryScene("T7-NumberOne");
const TICKET_W = 540;
const SLOT_Y = 330;
const NUMBER_H = 520;
const STUB_H = 290;
const STRIP = NUMBER_H + STUB_H + 6;

/** Callback to the opening ticket: with Dabberha the ticket reads «1 — دورك الحين», then the starting price. */
export const T7NumberOne: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const tWith = cue(scene, "مع");
  const tOne = cue(scene, "واحد");
  const tPrices = cue(scene, "وأسعارنا");
  const tFrom = cue(scene, "تبدأ");
  const tLand = cueEnd(scene, "عشر");
  const tRiyal = cue(scene, "ريال");

  // Printing: first the number part, then (on «وأسعارنا») the price stub.
  const printA = interpolate(frame, [tWith, tOne - 4], [0, NUMBER_H], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const printB = interpolate(frame, [tPrices - 4, tFrom + 6], [0, STUB_H + 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const printed = printA + printB;
  const stutter = frame > tWith && frame < tFrom + 6 ? Math.round(Math.sin(frame * 2.1) * 2) : 0;
  const one = spring({ frame: frame - tOne, fps, config: { damping: 9, stiffness: 160 } });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop variant="brand" />
      {/* printer */}
      <div
        style={{
          position: "absolute",
          top: SLOT_Y - 90,
          left: (width - 700) / 2,
          width: 700,
          height: 110,
          borderRadius: 28,
          background: "linear-gradient(180deg, #1C2740 0%, #0E1526 100%)",
          boxShadow: "0 24px 50px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.12)",
          zIndex: 2,
        }}
      >
        <div style={{ position: "absolute", left: 60, right: 60, bottom: 18, height: 12, borderRadius: 6, background: "#05080F" }} />
        <div
          style={{
            position: "absolute",
            right: 34,
            top: 26,
            width: 16,
            height: 16,
            borderRadius: 8,
            background: frame > tWith && frame < tFrom + 6 ? "#22C55E" : "#2E3A55",
            boxShadow: frame > tWith && frame < tFrom + 6 ? "0 0 14px #22C55E" : "none",
          }}
        />
      </div>
      {/* ticket coming out of the slot */}
      <div style={{ position: "absolute", top: SLOT_Y, left: (width - TICKET_W) / 2, width: TICKET_W, height: 900, overflow: "hidden" }}>
        <div style={{ translate: `0px ${printed - STRIP + stutter}px` }}>
          <BrandTicket one={one} oneOn={frame >= tOne} from={tFrom} land={tLand} riyalOn={frame >= tRiyal - 2} />
        </div>
      </div>

      <Captions scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="printer" at={tWith} />
      <Sfx name="ding" at={tOne} />
      <Sfx name="printer" at={tPrices - 4} gain={0.8} />
      <Sfx name="pop" at={tLand} gain={1.3} />
    </AbsoluteFill>
  );
};

const BrandTicket: React.FC<{ one: number; oneOn: boolean; from: number; land: number; riyalOn: boolean }> = ({
  one,
  oneOn,
  from,
  land,
  riyalOn,
}) => (
  <div dir="rtl" style={{ width: TICKET_W, height: STRIP, display: "flex", flexDirection: "column", fontFamily: fonts.text, textAlign: "center" }}>
    {/* price stub (prints last, so it sits at the top of the strip) */}
    <div style={{ height: STUB_H, background: story.paper, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontWeight: 700, fontSize: 44, color: story.inkSoft }}>الأسعار تبدأ من</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, fontFamily: fonts.display, fontWeight: 800, color: story.brand.navy, lineHeight: 1 }}>
        <Counter value={19} start={from} end={land} style={{ fontSize: 170, opacity: useCurrentFrame() >= from ? 1 : 0 }} />
        <span style={{ fontSize: 56, color: story.brand.teal, opacity: riyalOn ? 1 : 0.3 }}>ريال</span>
      </div>
    </div>
    {/* perforation */}
    <div style={{ height: 0, borderTop: "6px dashed #C9CFD8", background: story.paper }} />
    {/* number part */}
    <div style={{ height: NUMBER_H, background: story.paper, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ fontWeight: 700, fontSize: 44, color: story.inkSoft, paddingTop: 18 }}>رقمك</div>
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 230,
          lineHeight: 1.05,
          color: story.brand.navy,
          scale: String(oneOn ? 0.6 + 0.4 * one : 0.6),
          opacity: oneOn ? 1 : 0.15,
          direction: "ltr",
        }}
      >
        1
      </div>
      <div style={{ padding: "8px 0 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontWeight: 700, fontSize: 40, color: story.inkSoft }}>
        <Icon name="check" size={40} color={story.brand.teal} stroke={3} />
        دورك الحين
      </div>
      <div
        style={{
          marginTop: "auto",
          padding: "16px 0",
          background: `linear-gradient(135deg, ${story.brand.navy}, ${story.brand.teal})`,
          color: "#fff",
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 54,
        }}
      >
        دبّرها
      </div>
    </div>
  </div>
);
