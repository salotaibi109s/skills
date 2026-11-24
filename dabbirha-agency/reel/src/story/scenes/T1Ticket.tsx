import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain } from "../../components/Backdrop";
import { LedBoard, Person, Ticket } from "../art";
import { cue, getStoryScene, SceneVoice, Sfx, story } from "../base";
import { Captions } from "../Captions";

const scene = getStoryScene("T1-Ticket");

/** Hook: a queue ticket «187» while the board still shows «042». */
export const T1Ticket: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const tScreen = cue(scene, "والشاشة");
  const tNum = cue(scene, "اثنين");

  // Camera: starts tight on the ticket, tilts up to the board when the screen is mentioned.
  const tilt = interpolate(frame, [tScreen - 6, tScreen + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const intro = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const flash = interpolate(frame, [tNum, tNum + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const boardValue = frame >= tNum ? 42 : 41;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #24201C 0%, #15130F 100%)`, overflow: "hidden" }}>
      {/* soft ceiling lights */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(40% 18% at 25% 4%, rgba(255,226,180,0.22), transparent 70%), radial-gradient(40% 18% at 78% 6%, rgba(255,226,180,0.18), transparent 70%)",
        }}
      />
      {/* waiting crowd, out of focus */}
      <AbsoluteFill style={{ filter: "blur(10px)", opacity: 0.55, translate: `0px ${-tilt * 60}px` }}>
        {[
          { x: -20, k: "man", s: 0 },
          { x: 170, k: "woman", s: 1 },
          { x: 350, k: "manRed", s: 2 },
          { x: 560, k: "man", s: 3 },
          { x: 760, k: "woman", s: 0 },
          { x: 920, k: "manRed", s: 1 },
        ].map((p, i) => (
          <Person
            key={i}
            kind={p.k as "man"}
            skin={story.skin[p.s]}
            height={560}
            style={{ position: "absolute", left: p.x, top: 980 + (i % 2) * 60 }}
          />
        ))}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          translate: `0px ${tilt * 90}px`,
          scale: String(1.08 - tilt * 0.06 + (1 - intro) * 0.04),
        }}
      >
        <div style={{ position: "absolute", top: 330, left: (width - 680) / 2 }}>
          <LedBoard value={boardValue} width={680} />
          <div
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: 30,
              boxShadow: `0 0 80px rgba(255,59,48,${0.6 * flash})`,
              pointerEvents: "none",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 640,
            left: (width - 520) / 2,
            rotate: `${-3 + Math.sin(frame / 22) * 1.6}deg`,
            translate: `0px ${Math.sin(frame / 30) * 6}px`,
            opacity: 1 - tilt * 0.25,
            filter: tilt > 0.05 ? `blur(${tilt * 3}px)` : undefined,
          }}
        >
          <Ticket number={187} time="8:45 ص" />
        </div>
      </AbsoluteFill>

      <Grain width={width} height={height} opacity={0.09} />
      <Captions scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="crowd" at={0} gain={0.8} />
      <Sfx name="ding" at={tNum} />
    </AbsoluteFill>
  );
};
