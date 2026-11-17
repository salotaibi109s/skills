import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/game-timeline.json";
import { createSound } from "../components/Sound";
import { findScene, type SceneTiming, type TimelineData } from "../lib/timing";
import { db, fonts } from "../theme";

export { cue, cueEnd } from "../lib/timing";
export type { SceneTiming } from "../lib/timing";

export type GameSceneId = "G1-GameOver" | "G2-Menu" | "G3-PowerUp" | "G4-Level1" | "G5-Level2" | "G6-Level3" | "G7-Score" | "G8-Start";
export const gameTimeline = data as TimelineData;
export const getGameScene = (id: GameSceneId): SceneTiming => findScene(gameTimeline, id);

// A limited, original 8-bit palette built around the brand teal/navy.
export const pal = {
  black: "#0B0D17",
  night: "#14183A",
  navy: "#1E2A5E",
  blue: "#2F5FD0",
  sky: "#5FA8FF",
  skyLight: "#9FD3FF",
  teal: "#16B3B0",
  mint: "#7FF0D8",
  white: "#F8F8F2",
  grey: "#8A90A6",
  sand: "#E8C27A",
  sandDark: "#B8893F",
  red: "#E0453B",
  gold: "#FFC845",
  green: "#3BC46B",
  pink: "#FF6FA8",
} as const;

export const gameGains: Record<string, number> = {
  whoosh: db(-14),
  tick: db(-22),
  pop: db(-15),
  gameover: db(-8),
  crash: db(-6),
  blip: db(-12),
  select: db(-10),
  powerup: db(-9),
  coin: db(-11),
  hit: db(-10),
  clear: db(-9),
  fill: db(-12),
  jump: db(-13),
  dash: db(-11),
  upgrade: db(-7),
};
export const { Sfx, SceneVoice, Music } = createSound(gameTimeline, "audio/game", gameGains);

// ---------------------------------------------------------------- pixel text
type PixelTextProps = {
  text: string;
  px: number; // font size in low-res pixels
  scale: number; // how big each pixel is on screen
  color: string;
  shadow?: string;
  outline?: string;
  maxWidth?: number; // on-screen px; wraps on word boundaries
  font?: "display" | "text";
  weight?: number;
  style?: React.CSSProperties;
};

const threshold = (ctx: CanvasRenderingContext2D, w: number, h: number, color: string) => {
  const img = ctx.getImageData(0, 0, w, h);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
  for (let i = 0; i < img.data.length; i += 4) {
    const a = img.data[i + 3];
    if (a >= 120) {
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    } else img.data[i + 3] = 0;
  }
  ctx.putImageData(img, 0, 0);
};

/**
 * Real Arabic text rendered as pixel art: drawn by the browser's text engine at a tiny size
 * (so shaping and joining are correct), thresholded to hard 1-bit edges, then scaled up with
 * nearest-neighbour. Optional 1px outline and drop shadow, like classic game typography.
 */
export const PixelText: React.FC<PixelTextProps> = ({ text, px, scale, color, shadow, outline, maxWidth, font = "display", weight = 800, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const family = fonts[font];
  useLayoutEffect(() => {
    const fontStr = `${weight} ${px}px ${family}`;
    const draw = () => {
      const canvas = ref.current;
      if (!canvas) return;
      const probe = canvas.getContext("2d")!;
      probe.font = fontStr;
      // word wrap (RTL lines)
      const words = text.split(" ");
      const lines: string[] = [];
      const limit = maxWidth ? maxWidth / scale - 6 : Infinity;
      let cur = "";
      for (const w of words) {
        const t = cur ? cur + " " + w : w;
        if (probe.measureText(t).width > limit && cur) {
          lines.push(cur);
          cur = w;
        } else cur = t;
      }
      if (cur) lines.push(cur);
      const lineH = Math.ceil(px * 1.55);
      const pad = 3;
      const W = Math.ceil(Math.max(1, ...lines.map((l) => probe.measureText(l).width))) + pad * 2 + 2;
      const H = lineH * lines.length + pad * 2;
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = `${W * scale}px`;
      canvas.style.height = `${H * scale}px`;
      const ctx = canvas.getContext("2d")!;
      const layer = (c: string, dx: number, dy: number) => {
        const tmp = document.createElement("canvas");
        tmp.width = W;
        tmp.height = H;
        const t = tmp.getContext("2d")!;
        t.font = fontStr;
        t.direction = "rtl";
        t.textAlign = "center";
        t.textBaseline = "middle";
        t.fillStyle = "#ffffff";
        lines.forEach((l, i) => t.fillText(l, W / 2 + dx, pad + lineH * i + lineH / 2 + dy));
        threshold(t, W, H, c);
        ctx.drawImage(tmp, 0, 0);
      };
      ctx.clearRect(0, 0, W, H);
      if (shadow) layer(shadow, 1, 1);
      if (outline) for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) layer(outline, dx, dy);
      layer(color, 0, 0);
    };
    if (document.fonts.check(fontStr)) {
      draw();
      return;
    }
    const h = delayRender(`pixel text: ${text}`);
    document.fonts.load(fontStr).then(() => {
      draw();
      continueRender(h);
    });
  }, [text, px, scale, color, shadow, outline, maxWidth, family, weight]);
  return <canvas ref={ref} style={{ imageRendering: "pixelated", display: "block", ...style }} />;
};

// ---------------------------------------------------------------- sprites
export type SpriteMap = { rows: string[]; colors: Record<string, string> };

/** Pixel sprite from a character map ('.' = transparent). */
export const Sprite: React.FC<{ map: SpriteMap; ps: number; flip?: boolean; style?: React.CSSProperties; tint?: string }> = ({ map, ps, flip, style, tint }) => {
  const w = map.rows[0].length;
  const h = map.rows.length;
  return (
    <svg width={w * ps} height={h * ps} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" style={{ display: "block", scale: flip ? "-1 1" : undefined, overflow: "visible", ...style }}>
      {map.rows.flatMap((row, y) =>
        [...row].map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={tint && ch !== "O" ? tint : map.colors[ch]} />)),
      )}
    </svg>
  );
};

const heroColors = {
  O: "#1B1F2A",
  G: "#F5F5F5",
  g: "#C9CCD8",
  K: "#141414",
  S: "#C98E63",
  E: "#1B1F2A",
  B: "#3B2A1E",
  W: "#FAFAF6",
  w: "#D3D5DE",
  F: "#4A3423",
};
const heroTop = [
  "...OOOOOO...",
  "..OGGGGGGO..",
  ".OKKKKKKKKO.",
  ".OGGGGGGGGO.",
  "OGGSSSSSSGGO",
  "OGgSESSESgGO",
  "OGgSSSSSSgGO",
  "OGgSBBBBSgGO",
  "OGgOBBBBOgGO",
  ".OWWWWWWWWO.",
  "OWWWWWWWWWWO",
  "OWwWWWWWWwWO",
  "OSwWWWWWWwSO",
  ".OwWWWWWWwO.",
  ".OwWWWWWWwO.",
];
export const HERO_A: SpriteMap = { rows: [...heroTop, ".OwWWWOWWwO.", ".OWWWO.OWWO.", ".OFFO...OFFO"], colors: heroColors };
export const HERO_B: SpriteMap = { rows: [...heroTop, ".OwWWWWWWwO.", "..OWWWOWWO..", "..OFFOOFFO.."], colors: heroColors };

export const PAPER_MONSTER: SpriteMap = {
  rows: ["..OOOOOOOO..", ".OPPPPPPPPO.", ".OPLLLLLLPO.", "OPPPPPPPPPPO", "OPLLLLLLLLPO", "OPPEPPPPEPPO", "OPPEEPPEEPPO", "OPPPPPPPPPPO", "OPPMPMPMPPPO", "OPPPMPMPMPPO", ".OPPPPPPPPO.", "..OO.OO.OO.."],
  colors: { O: "#1B1F2A", P: "#F2EEE3", L: "#B8B2A3", E: "#E0453B", M: "#1B1F2A" },
};
export const CANVAS_MONSTER: SpriteMap = {
  rows: ["OOOOOOOOOOOO", "OFFFFFFFFFFO", "OFWWWWWWWWFO", "OFWWWQQQWWFO", "OFWWQWWWQWFO", "OFWWWWWQWWFO", "OFWWWWQWWWFO", "OFWWWWQWWWFO", "OFWWWWWWWWFO", "OFWWWWQWWWFO", "OFFFFFFFFFFO", "..OO....OO.."],
  colors: { O: "#1B1F2A", F: "#8B5E34", W: "#F7F3EA", Q: "#2F5FD0" },
};
export const BUG: SpriteMap = {
  rows: ["..O......O..", "...O....O...", "..OOOOOOOO..", ".ORRRRRRRRO.", "ORWWRRRRWWRO", "ORWORRRRWORO", "ORRRRRRRRRRO", "ORRDRRRRDRRO", ".ORRRRRRRRO.", "O.O.O..O.O.O"],
  colors: { O: "#1B1F2A", R: "#E0453B", W: "#FFFFFF", D: "#7A1F1A" },
};
export const CHECK_COIN: SpriteMap = {
  rows: ["...OOOO...", ".OOYYYYOO.", ".OYYYYYYO.", "OYYYYYYGYO", "OYYYYYGGYO", "OYGYYGGYYO", "OYGGGGYYYO", ".OYGGYYYO.", ".OOYYYYOO.", "...OOOO..."],
  colors: { O: "#1B1F2A", Y: "#FFC845", G: "#1E7A3C" },
};
export const PALM: SpriteMap = {
  rows: ["..GG..GG..", ".GGGGGGGG.", "GG.GGGG.GG", "G...TT...G", "....TT....", "....TT....", "....TT....", "...TTTT..."],
  colors: { G: "#2E9E5B", T: "#8B5E34" },
};

// ---------------------------------------------------------------- screen layers
/** CRT finish: scanlines, slight phosphor glow, vignette, rolling bar. */
export const CRT: React.FC<{ strength?: number }> = ({ strength = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: strength }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(180deg, rgba(0,0,0,0.22) 0 2px, transparent 2px 5px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: ((frame * 9) % 2200) - 200, height: 140, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.05), transparent)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 85% at 50% 50%, transparent 60%, rgba(0,0,0,0.65) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Pixel-dissolve: random 90px blocks cover the screen (p 0→1). */
export const PixelWipe: React.FC<{ p: number; color?: string }> = ({ p, color = pal.black }) => {
  if (p <= 0) return null;
  const cols = 12;
  const rows = 22;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: cols * rows }).map((_, i) => {
        if (random(`pw${i}`) > p) return null;
        return <div key={i} style={{ position: "absolute", left: (i % cols) * 90, top: Math.floor(i / cols) * 90, width: 90, height: 90, background: color }} />;
      })}
    </AbsoluteFill>
  );
};

/** Scene shell: pixel dissolve in/out around every scene + CRT. */
export const Screen: React.FC<{ children: React.ReactNode; bg?: string; crt?: number; wipeIn?: boolean; wipeOut?: boolean }> = ({ children, bg = pal.night, crt = 1, wipeIn = true, wipeOut = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pin = wipeIn ? interpolate(frame, [0, 7], [1, 0], { extrapolateRight: "clamp" }) : 0;
  const pout = wipeOut ? interpolate(frame, [durationInFrames - 7, durationInFrames], [0, 1], { extrapolateLeft: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      {children}
      <PixelWipe p={Math.max(pin, pout)} />
      <CRT strength={crt} />
    </AbsoluteFill>
  );
};

/** Chunky pixel window (double border), used for menus, stats and the dialog. */
export const PixelBox: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties; bg?: string }> = ({ children, style, bg = pal.night }) => (
  <div
    style={{
      background: bg,
      border: `8px solid ${pal.white}`,
      boxShadow: `0 0 0 8px ${pal.black}, inset 0 0 0 6px ${pal.navy}, 12px 12px 0 8px rgba(0,0,0,0.45)`,
      imageRendering: "pixelated",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * RPG dialog box subtitles: the narrator's current phrase appears word by word (synced to the voice),
 * rendered as pixel Arabic; a blinking ▼ when the phrase is complete.
 */
export const Dialog: React.FC<{ scene: SceneTiming; until?: number }> = ({ scene, until }) => {
  const frame = useCurrentFrame();
  const words = scene.words;
  const groups: { start: number; end: number; words: typeof words }[] = [];
  let cur: typeof words = [];
  words.forEach((w, i) => {
    cur.push(w);
    if (/[…،,.؟?!:]$/.test(w.raw ?? w.text) || cur.length >= 5 || i === words.length - 1) {
      groups.push({ start: cur[0].start, end: cur[cur.length - 1].end, words: cur });
      cur = [];
    }
  });
  const gi = groups.findIndex((g, i) => frame >= g.start - 2 && (groups[i + 1] ? frame < groups[i + 1].start - 2 : frame < g.end + 26));
  if (gi < 0 || (until !== undefined && frame >= until)) return null;
  const g = groups[gi];
  const shown = g.words.filter((w) => frame >= w.start).map((w) => (w.raw ?? w.text).replace(/[«»]/g, ""));
  const done = frame > g.end + 3;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1290, height: 200 }}>
      <PixelBox style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {shown.length > 0 && <PixelText text={shown.join(" ")} px={22} scale={2.6} color={pal.white} shadow={pal.black} maxWidth={860} />}
        {done && Math.floor(frame / 8) % 2 === 0 && <div style={{ position: "absolute", left: 26, bottom: 16, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: `16px solid ${pal.gold}` }} />}
      </PixelBox>
    </div>
  );
};

/** Banded (posterised) sky + pixel clouds + parallax desert skyline + tiled ground. */
export const LevelBG: React.FC<{ scroll?: number; top?: string; bottom?: string }> = ({ scroll = 0, top = pal.navy, bottom = pal.sky }) => {
  const frame = useCurrentFrame();
  const bands = 8;
  return (
    <AbsoluteFill>
      {Array.from({ length: bands }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (i * 1140) / bands, height: 1140 / bands + 1, background: mix(top, bottom, i / (bands - 1)) }} />
      ))}
      {/* pixel clouds */}
      {[0, 1, 2].map((i) => {
        const x = ((i * 430 - frame * (0.6 + i * 0.2) - scroll * 0.2) % 1500 + 1500) % 1500 - 260;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 380 + i * 150, display: "grid", gridTemplateColumns: "repeat(6, 36px)", gap: 0, opacity: 0.9 }}>
            {".XXX..XXXXXXXXXXXX".split("").map((c, k) => (
              <div key={k} style={{ width: 36, height: 36, background: c === "X" ? "#EAF6FF" : "transparent" }} />
            ))}
          </div>
        );
      })}
      {/* skyline */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 280, translate: `${-(scroll * 0.35) % 270}px 0px`, display: "flex", alignItems: "flex-end", gap: 0, width: 2400 }}>
        {Array.from({ length: 20 }).map((_, i) => {
          const h = 90 + Math.round(random(`sky${i}`) * 5) * 36;
          return <div key={i} style={{ width: 108 + (i % 3) * 18, height: h, background: i % 2 ? "#2B3A7A" : "#24316A", borderTop: "12px solid #3A4C96" }} />;
        })}
      </div>
      {/* palms */}
      {[0, 1, 2, 3].map((i) => {
        const x = ((i * 340 - scroll * 0.7) % 1360 + 1360) % 1360 - 160;
        return <Sprite key={i} map={PALM} ps={14} style={{ position: "absolute", left: x, top: 1028 }} />;
      })}
      {/* ground */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1140, height: 780, background: pal.sand }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1140, height: 24, background: pal.sandDark }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1164, height: 120, backgroundImage: `linear-gradient(90deg, ${pal.sandDark} 12px, transparent 12px)`, backgroundSize: "96px 100%", backgroundPosition: `${-scroll}px 0px`, opacity: 0.35 }} />
    </AbsoluteFill>
  );
};

export const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
};

/** Pixel burst particles (square bits) from a point. */
export const Bits: React.FC<{ at: number; x: number; y: number; colors?: string[]; count?: number; seed?: string }> = ({ at, x, y, colors = [pal.gold, pal.white, pal.mint], count = 22, seed = "bt" }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 30) return null;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const a = random(`${seed}a${i}`) * Math.PI * 2;
        const v = 8 + random(`${seed}v${i}`) * 16;
        const s = 12 + Math.round(random(`${seed}s${i}`) * 2) * 6;
        return <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * v * t, top: y + Math.sin(a) * v * t + 0.4 * t * t, width: s, height: s, background: colors[i % colors.length], opacity: 1 - t / 30 }} />;
      })}
    </>
  );
};

export const shakeAt = (frame: number, at: number, amp = 22) => {
  const t = frame - at;
  if (t < 0 || t > 12) return "0px 0px";
  const k = (1 - t / 12) * amp;
  return `${Math.round(Math.sin(t * 3.1) * k / 6) * 6}px ${Math.round(Math.cos(t * 2.3) * k / 6) * 6}px`;
};
