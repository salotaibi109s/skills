import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansArabic";
import { Audio, Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { db } from "../theme";

/**
 * How It's Built, Arabic edition: the 3D build rendered by Blender (the how-its-built-starter skill) as the picture,
 * with Nasser's voice, Arabic word-by-word captions, a sound on every part's arrival and a light music bed added here.
 * Data comes from public/hib/<name>/meta.json, written by `node scripts/hib.mjs <name> publish`.
 */
const SANS = loadPlex("normal", { weights: ["500", "700"], subsets: ["arabic", "latin"] }).fontFamily;
const FPS = 30;

type Word = { text: string; start: number; end: number; line: number };
type Meta = { name: string; duration: number; words: Word[]; arrivals: { name: string; t: number }[]; lines: string[]; outro: "follow" | "bio" | null };
export type HowBuiltProps = { name: string; meta?: Meta };

export const calculateHowBuilt: CalculateMetadataFunction<HowBuiltProps> = async ({ props }) => {
  const meta: Meta = await fetch(staticFile(`hib/${props.name}/meta.json`)).then((r) => r.json());
  const outro = meta.outro ? 3.2 : 0;
  return { durationInFrames: Math.ceil((meta.duration + outro) * FPS), props: { ...props, meta } };
};

/** A phrase at a time (up to 4 words, or to the end of a line); the spoken word lights up. */
const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    if (cur.length >= 4 || !next || next.line !== w.line || /[،,.؟?!…:]$/.test(w.text)) {
      chunks.push(cur);
      cur = [];
    }
  });
  const chunk = [...chunks].reverse().find((c) => t >= c[0].start - 0.08);
  if (!chunk) return null;
  const last = chunk[chunk.length - 1];
  if (t > last.end + 0.9) return null;
  const pop = spring({ frame: frame - Math.round((chunk[0].start - 0.08) * fps), fps, config: { damping: 13, stiffness: 260, mass: 0.5 } });
  return (
    <div dir="rtl" style={{ position: "absolute", left: 70, right: 130, top: 1240, display: "flex", justifyContent: "center", scale: String(0.9 + 0.1 * pop), opacity: Math.min(1, pop * 1.6) }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.32em", padding: "16px 34px 22px", borderRadius: 26, background: "rgba(12,12,14,0.78)", fontFamily: SANS, fontWeight: 700, fontSize: 66, lineHeight: 1.35 }}>
        {chunk.map((w, i) => {
          const on = t >= w.start - 0.05;
          const active = on && (i === chunk.length - 1 || t < chunk[i + 1].start - 0.05);
          return (
            <span key={i} style={{ color: active ? "#FFD23F" : "#fff", opacity: on ? 1 : 0.35, display: "inline-block", scale: active ? "1.06" : "1", unicodeBidi: "isolate" }} dir={/[A-Za-z]/.test(w.text) ? "ltr" : "rtl"}>
              {w.text.replace(/[«»]/g, "")}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Outro: React.FC<{ from: number; kind: "follow" | "bio" }> = ({ from, kind }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - from, fps, config: { damping: 12, stiffness: 150, mass: 0.9 } });
  const b = spring({ frame: frame - from - 14, fps, config: { damping: 13, stiffness: 220, mass: 0.6 } });
  if (frame < from) return null;
  return (
    <AbsoluteFill style={{ background: `rgba(255,255,255,${0.94 * Math.min(1, p * 1.4)})` }}>
      <div style={{ position: "absolute", left: 540 - 50 - 220, top: 560, width: 440, height: 440, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", scale: String(0.3 + 0.7 * p), boxShadow: "0 24px 60px rgba(0,0,0,0.12)" }}>
        <Img src={staticFile("brand/logo-color.png")} style={{ width: 360 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 100, top: 1080, display: "flex", justifyContent: "center", scale: String(0.8 + 0.2 * b), opacity: b }}>
        <div dir="rtl" style={{ padding: "20px 54px 24px", borderRadius: 999, background: "#0D0D0D", color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 52 }}>{kind === "bio" ? "الرابط في البايو" : "تابع الحساب"}</div>
      </div>
    </AbsoluteFill>
  );
};

export const HowBuilt: React.FC<HowBuiltProps> = ({ name, meta }) => {
  const { durationInFrames } = useVideoConfig();
  if (!meta) return null;
  const end = Math.round(meta.duration * FPS);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Video src={staticFile(`hib/${name}/build.mp4`)} muted />
      <Captions words={meta.words} />
      {meta.outro && <Outro from={end - 6} kind={meta.outro} />}
      <Audio src={staticFile(`hib/${name}/nasser.mp3`)} volume={db(-1)} />
      {meta.arrivals.map((a, i) => (
        <Audio key={i} src={staticFile(`audio/tutorial/sfx/${i % 3 === 2 ? "thud" : "pop"}.mp3`)} from={Math.max(0, Math.round(a.t * FPS) - 2)} volume={db(-15)} />
      ))}
      {meta.outro && <Audio src={staticFile("audio/tutorial/sfx/impact.mp3")} from={end - 4} volume={db(-9)} />}
      <Audio
        src={staticFile("audio/agents/music/calm.mp3")}
        loop
        volume={(f) => {
          const inVoice = meta.words.some((w) => f >= w.start * FPS - 4 && f <= w.end * FPS + 6);
          const fd = interpolate(f, [0, 6, durationInFrames - 40, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (inVoice ? db(-25) : db(-19)) * fd;
        }}
      />
    </AbsoluteFill>
  );
};
