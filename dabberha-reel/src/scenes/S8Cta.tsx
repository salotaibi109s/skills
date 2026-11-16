import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { glassStyle } from "../components/Glass";
import { Icon } from "../components/Icons";
import { WordLine } from "../components/Kinetic";
import { SceneShell } from "../components/SceneShell";
import { SceneVoice, Sfx } from "../components/Sound";
import { cue, getScene } from "../lib/timeline";
import { colors, fonts, springs } from "../theme";

const scene = getScene("S8-CTA");

/** 53–60s CTA: logo, «دبّرها… واطلب خدمتك الحين.», store link only. */
export const S8Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tName = cue(scene, "دبرها");
  const t1 = cue(scene, "واطلب");
  const t2 = cue(scene, "خدمتك");
  const t3 = cue(scene, "الحين");
  const logo = spring({ frame: frame - (tName - 2), fps, config: springs.bouncy });
  const tUrl = t3 + 8;

  return (
    <SceneShell background={<Backdrop variant="light" />} enter="whip-left" exit="cut" push={0.03}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
        <Img
          src={staticFile("brand/logo-color.png")}
          style={{
            width: 640,
            scale: String(0.75 + 0.25 * logo),
            opacity: frame < tName - 2 ? 0 : Math.min(1, logo * 1.4),
          }}
        />
        <div style={{ marginTop: 50, width: "100%", paddingInline: 80 }}>
          <WordLine
            size={92}
            weight={800}
            color={colors.textOnLight}
            words={[
              { text: "واطلب", at: t1 },
              { text: "خدمتك", at: t2 },
              { text: "الحين.", at: t3, highlight: true },
            ]}
            highlightColor={colors.teal}
          />
        </div>

        <Chip at={tUrl} fps={fps} big>
          <Icon name="link" size={46} color={colors.teal} stroke={2.2} />
          <span dir="ltr" style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 52, color: colors.textOnLight }}>
            haxztd.zid.store
          </span>
        </Chip>
      </AbsoluteFill>

      <SceneVoice scene={scene} />
      <Sfx name="impact" at={tName - 2} gain={0.55} />
      <Sfx name="tick" at={t3} />
      <Sfx name="pop" at={tUrl} />
    </SceneShell>
  );
};

const Chip: React.FC<{ at: number; fps: number; big?: boolean; children: React.ReactNode }> = ({
  at,
  fps,
  big,
  children,
}) => {
  const frame = useCurrentFrame();
  const s = spring({ frame: frame - at, fps, config: springs.snappy });
  return (
    <div
      dir="rtl"
      style={{
        marginTop: big ? 56 : 0,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: big ? "24px 44px" : "18px 30px",
        borderRadius: 999,
        ...glassStyle("light"),
        opacity: frame < at ? 0 : Math.min(1, s * 1.5),
        translate: `0px ${(1 - s) * 40}px`,
      }}
    >
      {children}
    </div>
  );
};
