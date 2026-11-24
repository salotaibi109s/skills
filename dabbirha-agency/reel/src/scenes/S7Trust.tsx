import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Icon } from "../components/Icons";
import { Reveal, WordLine } from "../components/Kinetic";
import { SceneShell } from "../components/SceneShell";
import { SceneVoice, Sfx } from "../components/Sound";
import { cue, getScene } from "../lib/timeline";
import { colors, fonts, springs } from "../theme";

const scene = getScene("S7-Trust");

// Payment options listed on haxztd.zid.store/shipping-and-payment (acceptance marks served by the store).
const PAYMENTS: { key: string; src?: string; label?: string; w: number }[] = [
  { key: "mada", src: "pay/mada-circle.png", w: 150 },
  { key: "applepay", src: "pay/apple_pay.svg", w: 130 },
  { key: "visa", src: "pay/visa-circle.png", w: 96 },
  { key: "mastercard", src: "pay/mastercard-circle.png", w: 96 },
  { key: "bank", label: "تحويل بنكي", w: 0 },
];

/** 46–53s Trust: two big words, then «وادفع بالطريقة اللي تناسبك» with the payment marks popping in. */
export const S7Trust: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tA = cue(scene, "مصداقية");
  const tB = cue(scene, "وسرعة");
  const tC = cue(scene, "إنجاز");
  const tPay = cue(scene, "وادفع");
  const tWay = cue(scene, "بالطريقة");
  const tAll = cue(scene, "اللي");
  const tFit = cue(scene, "تناسبك");

  const up = interpolate(frame, [tPay - 6, tPay + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const chipAt = (i: number) => tWay + i * 5;

  return (
    <SceneShell background={<Backdrop variant="dark" />} enter="whip-left" exit="whip-left" push={0.05}>
      {/* Phase A: the two values */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          translate: `0px ${-up * 420}px`,
          scale: String(1 - up * 0.42),
        }}
      >
        <div dir="rtl" lang="ar" style={{ textAlign: "center", fontFamily: fonts.display, fontWeight: 800 }}>
          <Reveal at={tA} display="block" mode="scale" style={{ fontSize: 210, color: colors.white, lineHeight: 1.15 }}>
            مصداقية
          </Reveal>
          <div style={{ display: "flex", justifyContent: "center", gap: 36, fontSize: 150, lineHeight: 1.2 }}>
            <Reveal at={tB} style={{ color: colors.white }}>
              وسرعة
            </Reveal>
            <Reveal at={tC} style={{ color: colors.tealBright }}>
              إنجاز
            </Reveal>
          </div>
        </div>
      </AbsoluteFill>

      {/* Phase B: payment */}
      <AbsoluteFill style={{ paddingTop: 800, paddingInline: 80, alignItems: "center" }}>
        {/* deliberate two-line break so no word is left alone */}
        <WordLine
          size={88}
          weight={700}
          font="display"
          words={[
            { text: "وادفع", at: tPay, highlight: true },
            { text: "بالطريقة", at: tWay },
          ]}
          highlightColor={colors.gold}
        />
        <WordLine
          size={88}
          weight={700}
          font="display"
          words={[
            { text: "اللي", at: tAll },
            { text: "تناسبك", at: tFit },
          ]}
        />
        <div
          dir="rtl"
          style={{
            marginTop: 56,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 22,
            width: 920,
          }}
        >
          {PAYMENTS.map((p, i) => (
            <PayChip key={p.key} at={chipAt(i)} fps={fps}>
              {p.src ? (
                <Img src={staticFile(p.src)} style={{ width: p.w, height: 96, objectFit: "contain" }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingInline: 10 }}>
                  <Icon name="bank" size={56} color={colors.navy} />
                  <span style={{ fontFamily: fonts.text, fontWeight: 700, fontSize: 42, color: colors.textOnLight }}>
                    {p.label}
                  </span>
                </div>
              )}
            </PayChip>
          ))}
        </div>
      </AbsoluteFill>

      <SceneVoice scene={scene} />
      <Sfx name="tick" at={tA} gain={1.3} />
      <Sfx name="tick" at={tC} gain={1.3} />
      {PAYMENTS.map((p, i) => (
        <Sfx key={p.key} name="pop" at={chipAt(i)} gain={0.75} />
      ))}
    </SceneShell>
  );
};

const PayChip: React.FC<{ at: number; fps: number; children: React.ReactNode }> = ({ at, fps, children }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame: frame - at, fps, config: springs.bouncy });
  return (
    <div
      style={{
        height: 132,
        minWidth: 240,
        padding: "0 34px",
        borderRadius: 36,
        background: colors.white,
        boxShadow: "0 24px 50px rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scale: String(frame < at ? 0 : 0.4 + 0.6 * s),
        opacity: frame < at ? 0 : Math.min(1, s * 2),
      }}
    >
      {children}
    </div>
  );
};
