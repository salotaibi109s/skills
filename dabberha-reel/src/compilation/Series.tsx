import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { CharDefs } from "../joanna/chars";
import { FONT } from "../room404/kit";

export type Ep = { file: string; frames: number; title: string; emoji: string };
export type SeriesConfig = {
  name: string;
  subtitle: string;
  blurb: string;
  episodes: Ep[];
  bg: string;
  icons: string[];
  iconOpacity: number;
  titleColor: string;
  titleShadow: string;
  ink: string;
  soft: string;
  badge: string;
  badgeText: string;
  sideIcon: string;
  introArt: (f: number, k: number) => React.ReactNode;
  next: { label: string; bg: string; color: string }[];
  introMusic: string;
  outroMusic: string;
};

export const INTRO = 150;
export const OUTRO = 180;
export const startsOf = (c: SeriesConfig) => c.episodes.reduce<number[]>((a, _e, i) => [...a, i === 0 ? INTRO : a[i - 1] + c.episodes[i - 1].frames], []);
export const framesOf = (c: SeriesConfig) => INTRO + c.episodes.reduce((s, e) => s + e.frames, 0) + OUTRO;
const AR = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

const Backdrop: React.FC<{ c: SeriesConfig }> = ({ c }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: c.bg }}>
      {Array.from({ length: 26 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: (i * 151) % 1920, top: ((i * 263) % 1080) + Math.sin(f / 40 + i) * 12, fontSize: 40 + (i % 3) * 14, opacity: c.iconOpacity, transform: `rotate(${((i * 37) % 60) - 30}deg)` }}>
          {c.icons[i % c.icons.length]}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const SidePanels: React.FC<{ c: SeriesConfig; n: number; ep: Ep }> = ({ c, n, ep }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f, fps: 30, config: { damping: 14 } });
  const col: React.CSSProperties = { position: "absolute", top: 0, bottom: 0, width: 520, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: FONT, textAlign: "center" };
  return (
    <>
      <div dir="rtl" style={{ ...col, right: 60 }}>
        <div style={{ fontWeight: 800, fontSize: 92, color: c.titleColor, lineHeight: 1.05, textShadow: c.titleShadow }}>{c.name}</div>
        <div style={{ marginTop: 14, fontWeight: 700, fontSize: 44, color: c.soft }}>{c.subtitle}</div>
        <div style={{ marginTop: 40, fontSize: 120 }}>{c.sideIcon}</div>
      </div>
      <div dir="rtl" style={{ ...col, left: 60, transform: `scale(${0.85 + 0.15 * k})`, opacity: k }}>
        <div style={{ padding: "12px 40px", borderRadius: 50, background: c.badge, color: c.badgeText, fontWeight: 800, fontSize: 56 }}>الحلقة {AR(n)}</div>
        <div style={{ marginTop: 30, fontWeight: 800, fontSize: 60, color: c.ink, lineHeight: 1.25 }}>{ep.title}</div>
        <div style={{ marginTop: 24, fontSize: 130 }}>{ep.emoji}</div>
      </div>
    </>
  );
};

const Intro: React.FC<{ c: SeriesConfig }> = ({ c }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f, fps: 30, config: { stiffness: 160, damping: 12 } });
  const o = interpolate(f, [INTRO - 15, INTRO], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Backdrop c={c} />
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <CharDefs />
        {c.introArt(f, k)}
      </svg>
      <div dir="rtl" style={{ position: "absolute", left: 760, right: 80, top: 250, textAlign: "center", fontFamily: FONT, transform: `scale(${k})` }}>
        <div style={{ fontWeight: 800, fontSize: 160, color: c.titleColor, textShadow: c.titleShadow }}>{c.name}</div>
        <div style={{ marginTop: 10, display: "inline-block", padding: "16px 56px", borderRadius: 60, background: c.badge, color: c.badgeText, fontWeight: 800, fontSize: 70 }}>{c.subtitle}</div>
        <div style={{ marginTop: 34, fontWeight: 700, fontSize: 50, color: c.soft }}>{c.blurb}</div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{ c: SeriesConfig }> = ({ c }) => {
  const f = useCurrentFrame();
  const k = spring({ frame: f, fps: 30, config: { damping: 13 } });
  return (
    <AbsoluteFill>
      <Backdrop c={c} />
      <div dir="rtl" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: FONT, transform: `scale(${k})` }}>
        <div style={{ fontWeight: 800, fontSize: 116, color: c.titleColor, textShadow: c.titleShadow }}>{`انتهى ${c.subtitle.replace(" كامل", "")} 🏆`}</div>
        <div style={{ marginTop: 30, fontWeight: 700, fontSize: 56, color: c.ink }}>شاهد بعدها على القناة:</div>
        <div style={{ marginTop: 20, display: "flex", gap: 30 }}>
          {c.next.map((n) => (
            <div key={n.label} style={{ padding: "14px 40px", borderRadius: 50, background: n.bg, color: n.color, fontWeight: 800, fontSize: 56 }}>
              {n.label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 50, fontWeight: 800, fontSize: 64, color: c.soft }}>ابنِ ذكاءك 💡</div>
      </div>
    </AbsoluteFill>
  );
};

export const SeriesCompilation: React.FC<{ c: SeriesConfig }> = ({ c }) => {
  const starts = startsOf(c);
  const total = framesOf(c);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={INTRO}>
        <Intro c={c} />
        <Audio src={staticFile(c.introMusic)} volume={(f) => interpolate(f, [0, 10, INTRO - 30, INTRO], [0, 0.5, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </Sequence>
      {c.episodes.map((e, i) => (
        <Sequence key={e.file} from={starts[i]} durationInFrames={e.frames}>
          <Backdrop c={c} />
          <SidePanels c={c} n={i + 1} ep={e} />
          <div style={{ position: "absolute", left: (1920 - 607.5) / 2, top: 0, width: 607.5, height: 1080, boxShadow: "0 0 60px rgba(0,0,0,0.35)", overflow: "hidden" }}>
            <OffthreadVideo src={staticFile(`compilation/${e.file}`)} style={{ width: "100%", height: "100%" }} />
          </div>
        </Sequence>
      ))}
      <Sequence from={total - OUTRO} durationInFrames={OUTRO}>
        <Outro c={c} />
        <Audio src={staticFile(c.outroMusic)} volume={(f) => interpolate(f, [0, 15, OUTRO - 40, OUTRO], [0, 0.5, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </Sequence>
    </AbsoluteFill>
  );
};
