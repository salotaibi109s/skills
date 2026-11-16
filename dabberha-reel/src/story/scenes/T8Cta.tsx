import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../../components/Backdrop";
import { glassStyle } from "../../components/Glass";
import { Icon } from "../../components/Icons";
import { WordLine } from "../../components/Kinetic";
import { colors, fonts } from "../../theme";
import { cue, getStoryScene, SceneVoice, Sfx } from "../base";

const scene = getStoryScene("T8-CTA");

/** «دبّرها… وخلّ يومك لك.» — logo, the line, the store link. */
export const T8Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tName = cue(scene, "دبرها");
  const t1 = cue(scene, "وخل");
  const t2 = cue(scene, "يومك");
  const t3 = cue(scene, "لك");
  const tUrl = t3 + 10;
  const logo = spring({ frame: frame - (tName - 2), fps, config: { damping: 11, stiffness: 160, mass: 0.7 } });
  const url = spring({ frame: frame - tUrl, fps, config: { damping: 18, stiffness: 180 } });

  return (
    <AbsoluteFill>
      <Backdrop variant="light" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 400 }}>
        <Img
          src={staticFile("brand/logo-color.png")}
          style={{ width: 620, scale: String(0.75 + 0.25 * logo), opacity: frame < tName - 2 ? 0 : Math.min(1, logo * 1.4) }}
        />
        <div style={{ marginTop: 56, width: "100%", paddingInline: 80 }}>
          <WordLine
            size={112}
            weight={800}
            color={colors.textOnLight}
            words={[
              { text: "وخلّ", at: t1 },
              { text: "يومك", at: t2, highlight: true },
              { text: "لك.", at: t3 },
            ]}
            highlightColor={colors.teal}
          />
        </div>
        <div
          dir="rtl"
          style={{
            marginTop: 60,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "24px 44px",
            borderRadius: 999,
            ...glassStyle("light"),
            opacity: frame < tUrl ? 0 : Math.min(1, url * 1.5),
            translate: `0px ${(1 - url) * 40}px`,
          }}
        >
          <Icon name="link" size={46} color={colors.teal} stroke={2.2} />
          <span dir="ltr" style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 52, color: colors.textOnLight }}>
            haxztd.zid.store
          </span>
        </div>
      </AbsoluteFill>
      <SceneVoice scene={scene} />
      <Sfx name="pop" at={tName - 2} gain={1.3} />
      <Sfx name="success" at={t3} gain={0.6} />
      <Sfx name="pop" at={tUrl} />
    </AbsoluteFill>
  );
};
