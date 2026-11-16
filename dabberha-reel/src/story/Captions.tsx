import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { SceneTiming, Word } from "../lib/timing";
import { fonts } from "../theme";
import { story } from "./base";

type Group = { words: Word[]; start: number; end: number };

// Break the spoken transcript into short caption lines at punctuation (max 6 words).
const groupWords = (words: Word[]): Group[] => {
  const groups: Group[] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const raw = w.raw ?? w.text;
    const breakHere = /[…،,.؟?!:»]$/.test(raw) || cur.length >= 6 || i === words.length - 1;
    if (breakHere) {
      groups.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
      cur = [];
    }
  });
  return groups;
};

// Captions show what the narrator says, so tidy the TTS spelling for reading.
const display = (raw: string) => raw.replace(/[«»]/g, "").replace(/…$/, "…");

/**
 * Karaoke subtitles in the lower third (inside the Reels safe zone, above the bottom 400px).
 * Each word lights up in gold exactly when Nasser says it; words never split into letters.
 */
export const Captions: React.FC<{ scene: SceneTiming; until?: number }> = ({ scene, until }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const groups = groupWords(scene.words);
  const idx = groups.findIndex((g, i) => {
    const next = groups[i + 1];
    return frame >= g.start - 3 && (next ? frame < next.start - 3 : frame < g.end + 24);
  });
  if (idx < 0) return null;
  if (until !== undefined && frame >= until) return null;
  const g = groups[idx];
  const enter = spring({ frame: frame - (g.start - 3), fps, config: { damping: 200 }, durationInFrames: 8 });
  const lastOut = idx === groups.length - 1 ? interpolate(frame, [g.end + 14, g.end + 24], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1330,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: enter * lastOut,
        translate: `0px ${(1 - enter) * 18}px`,
      }}
    >
      <div
        dir="rtl"
        lang="ar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: "0.26em",
          rowGap: 4,
          maxWidth: 940,
          padding: "18px 34px 22px",
          borderRadius: 30,
          background: "rgba(14,16,24,0.74)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
          fontFamily: fonts.text,
          fontWeight: 700,
          fontSize: 54,
          lineHeight: 1.35,
        }}
      >
        {g.words.map((w, i) => {
          const spoken = frame >= w.start;
          const active = frame >= w.start && frame < w.end + 2;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: active ? story.gold : "#ffffff",
                opacity: spoken ? 1 : 0.42,
                scale: active ? "1.06" : "1",
              }}
            >
              {display(w.raw ?? w.text)}
            </span>
          );
        })}
      </div>
    </div>
  );
};
