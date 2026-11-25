import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { createSound } from "../components/Sound";
import { Dad, Kid, Teacher, type KidProps } from "../joanna/chars";
import { findScene, type TimelineData } from "../lib/timing";
import { db } from "../theme";
import { blinkAt, FONT } from "../room404/kit";

export { Cam, ease, Flash, FONT, Shot, Svg, blinkAt } from "../room404/kit";

export const HOME_GAINS: Record<string, number> = {
  whoosh: db(-14),
  pop: db(-12),
  boing: db(-11),
  snore: db(-12),
  camera: db(-10),
  send: db(-12),
  tick: db(-13),
  gasp: db(-10),
  laugh: db(-12),
  giggle: db(-10),
  sparkle: db(-12),
  tada: db(-11),
  steps: db(-14),
  knock: db(-9),
  door: db(-11),
  crickets: db(-18),
  build: db(-12),
  ball: db(-11),
  cheer: db(-12),
  coin: db(-11),
  scratch: db(-10),
  aww: db(-12),
  jingle: db(-11),
};

/** Per-episode helpers: timing, lip sync and the cast bound to this episode's voices. */
export const makeHome = (T: TimelineData, MOUTH: Record<string, number[]>, dir: string) => {
  const line = (id: string) => findScene(T, id);
  const at = (id: string) => line(id).from + line(id).voFrom;
  const endOf = (id: string) => line(id).from + line(id).words[line(id).words.length - 1].end;
  const talkOf = (who: string, f: number) => {
    for (const s of T.scenes) {
      if (!s.id.endsWith(`-${who}`)) continue;
      const env = MOUTH[s.id];
      const i = f - (s.from + s.voFrom);
      if (env && i >= 0 && i < env.length) return Math.min(1, env[i] * 1.15) * (0.75 + 0.25 * Math.abs(Math.sin(f * 1.7)));
    }
    return 0;
  };
  const { Sfx } = createSound(T, `audio/${dir}`, HOME_GAINS);
  type P = Omit<KidProps, "who" | "s"> & { s?: number; f: number };
  const Jo: React.FC<P> = ({ f, s = 0.55, ...p }) => <Kid s={s} who="joanna" glasses="pink" talk={talkOf("J", f)} blink={p.blink ?? blinkAt(f, 1)} {...p} />;
  const Faisal: React.FC<P> = ({ f, s = 0.42, ...p }) => <Kid s={s} who="boy" hair="#151010" skinTone="J" talk={talkOf("F", f)} blink={p.blink ?? blinkAt(f, 7)} {...p} />;
  /** Saad, the cousin: a bit taller than Faisal, brown hair. */
  const Saad: React.FC<P> = ({ f, s = 0.5, ...p }) => <Kid s={s} who="boy" hair="#6B3E22" skinTone="T" talk={talkOf("C", f)} blink={p.blink ?? blinkAt(f, 9)} {...p} />;
  const Baba: React.FC<Omit<React.ComponentProps<typeof Dad>, "s"> & { s?: number; f: number }> = ({ f, s = 0.62, ...p }) => <Dad s={s} talk={talkOf("D", f)} blink={p.blink ?? blinkAt(f, 11)} {...p} />;
  /** Umm Saeed, the elderly neighbour: dark dress, white scarf, round glasses. */
  const Neighbor: React.FC<Omit<React.ComponentProps<typeof Teacher>, "s"> & { s?: number; f: number }> = ({ f, s = 0.64, ...p }) => (
    <Teacher s={s} dress="url(#oldDress)" scarf="url(#oldScarf)" scarfEdge="#B8B8C2" glasses talk={talkOf("N", f)} blink={p.blink ?? blinkAt(f, 12)} {...p} />
  );
  return { line, at, endOf, talkOf, Sfx, Jo, Faisal, Saad, Baba, Neighbor };
};

/* ---------------------------------------------------------------- sets */

export const LivingRoom: React.FC<{ f: number; night?: number }> = ({ f, night = 0 }) => (
  <g>
    <defs>
      <linearGradient id="lrWall" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#F6E6D0" />
        <stop offset="100%" stopColor="#EBD2B2" />
      </linearGradient>
    </defs>
    <rect x={-1400} y={-800} width={3900} height={2300} fill="url(#lrWall)" />
    <rect x={-1400} y={1260} width={3900} height={1400} fill="#C99A6B" />
    <rect x={-1400} y={1250} width={3900} height={20} fill="#A9784A" />
    {/* window with curtains */}
    <rect x={640} y={220} width={420} height={520} rx={12} fill={night ? "#1C2A4A" : "#BFE6FF"} stroke="#A9784A" strokeWidth={16} />
    {night ? <path d="M930 330 a40 40 0 1 0 26 66 a32 32 0 1 1 -26 -66Z" fill="#FFF3C4" /> : <circle cx={950} cy={340} r={50} fill="#FFE27A" />}
    <path d="M610 200 q60 300 0 580 h110 q-30 -300 0 -580Z" fill="#C0574B" />
    <path d="M1090 200 q-60 300 0 580 h-110 q30 -300 0 -580Z" fill="#C0574B" />
    {/* family photo frames */}
    <rect x={-80} y={300} width={260} height={200} rx={10} fill="#fff" stroke="#8B5E34" strokeWidth={14} />
    <circle cx={10} cy={410} r={34} fill="#E8B48A" />
    <circle cx={90} cy={420} r={26} fill="#E8B48A" />
    <rect x={240} y={340} width={160} height={200} rx={10} fill="#fff" stroke="#8B5E34" strokeWidth={14} />
    <circle cx={320} cy={430} r={40} fill="#C9E4C5" />
    {/* rug */}
    <ellipse cx={540} cy={1560} rx={620} ry={130} fill="#B5443C" />
    <ellipse cx={540} cy={1560} rx={520} ry={100} fill="none" stroke="#F3C969" strokeWidth={10} strokeDasharray="30 20" />
    {/* lamp */}
    <rect x={1180} y={760} width={14} height={500} fill="#6B4523" />
    <path d="M1110 760 h154 l-30 -120 h-94Z" fill="#F3C969" opacity={0.9} />
    {night > 0 && <rect x={-1400} y={-800} width={3900} height={2300} fill="#0B1430" opacity={0.45 * night} />}
    {night > 0 && <circle cx={1187} cy={760} r={240} fill="#FFE7A8" opacity={0.18 * night * (0.9 + 0.1 * Math.sin(f / 20))} />}
  </g>
);

/** Sofa drawn in front of whoever sits on it. */
export const Sofa: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-420} y={-260} width={840} height={220} rx={50} fill="#2E7D7A" />
    <rect x={-480} y={-360} width={120} height={360} rx={50} fill="#256865" />
    <rect x={360} y={-360} width={120} height={360} rx={50} fill="#256865" />
    <rect x={-400} y={-110} width={800} height={110} rx={30} fill="#348C88" />
    <rect x={-440} y={0} width={40} height={50} fill="#5E3A1E" />
    <rect x={400} y={0} width={40} height={50} fill="#5E3A1E" />
  </g>
);

export const SofaBack: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-440} y={-620} width={880} height={420} rx={70} fill="#256865" />
  </g>
);

export const Bedroom: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-1400} y={-800} width={3900} height={2300} fill="#2A3358" />
    <rect x={-1400} y={1260} width={3900} height={1400} fill="#3B3F66" />
    <rect x={160} y={260} width={320} height={420} rx={12} fill="#141B36" stroke="#6B6FA0" strokeWidth={12} />
    <path d="M360 340 a40 40 0 1 0 26 66 a32 32 0 1 1 -26 -66Z" fill="#FFF3C4" />
    {Array.from({ length: 6 }).map((_, i) => (
      <circle key={i} cx={200 + ((i * 53) % 260)} cy={300 + ((i * 89) % 340)} r={4} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 15 + i))} />
    ))}
    {/* two beds */}
    {[260, 820].map((x) => (
      <g key={x}>
        <rect x={x - 220} y={1060} width={440} height={200} rx={20} fill="#5A6FB0" />
        <rect x={x - 230} y={980} width={40} height={280} rx={10} fill="#3A4A80" />
        <ellipse cx={x - 130} cy={1060} rx={80} ry={34} fill="#E8ECF6" />
      </g>
    ))}
    <circle cx={540} cy={900} r={30} fill="#FFE27A" opacity={0.8} />
    <circle cx={540} cy={900} r={160} fill="#FFE27A" opacity={0.1} />
  </g>
);

export const Stairwell: React.FC<{ f: number }> = () => (
  <g>
    <rect x={-1400} y={-800} width={3900} height={2300} fill="#E6E0D4" />
    <rect x={-1400} y={1260} width={3900} height={1400} fill="#B9B1A2" />
    {/* stairs going up on the left */}
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x={-400 + i * 60} y={1260 - (i + 1) * 70} width={400 - i * 20} height={70} fill={i % 2 ? "#CFC6B6" : "#D9D1C2"} stroke="#A89F8F" strokeWidth={3} />
    ))}
    <path d="M-380 1180 L140 640" stroke="#6B5A44" strokeWidth={14} />
    {/* apartment doors 3 and 4 */}
    {[
      { x: 460, n: "٣" },
      { x: 960, n: "٤" },
    ].map((d) => (
      <g key={d.n}>
        <rect x={d.x - 150} y={560} width={300} height={700} rx={10} fill="#8B5E34" stroke="#6B4523" strokeWidth={10} />
        <rect x={d.x - 40} y={620} width={80} height={60} rx={8} fill="#F3C969" />
        <text x={d.x} y={668} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill="#6B4523">
          {d.n}
        </text>
        <circle cx={d.x + 100} cy={930} r={14} fill="#F3C969" />
      </g>
    ))}
  </g>
);

/* ---------------------------------------------------------------- overlays */

export const Tag: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [4, 12, 80, 92], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div dir="rtl" style={{ position: "absolute", top: 180, right: 140, padding: "8px 26px", borderRadius: 30, background: "rgba(192,87,75,0.92)", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 36, opacity: o }}>
      {text}
    </div>
  );
};

/** End card: series title, the value line and the next episode. */
export const HomeEnd: React.FC<{ l: number; value: string; next: string }> = ({ l, value, next }) => {
  const k = spring({ frame: l, fps: 30, config: { stiffness: 170, damping: 13 } });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(80% 60% at 50% 45%, #F6E6D0 0%, #E0BF93 100%)" }}>
      <div dir="rtl" style={{ position: "absolute", top: 470, left: 80, right: 130, textAlign: "center", fontFamily: FONT, scale: String(k) }}>
        <div style={{ fontWeight: 800, fontSize: 104, color: "#C0574B", lineHeight: 1.1, textShadow: "0 6px 0 #8E3A30" }}>حكايات بيتنا</div>
        <div style={{ marginTop: 26, display: "inline-block", padding: "12px 34px", borderRadius: 40, background: "#2E7D7A", color: "#fff", fontWeight: 800, fontSize: 52 }}>{value}</div>
        <div style={{ marginTop: 40, fontWeight: 700, fontSize: 44, color: "#6B4523" }}>الحلقة الجاية:</div>
        <div style={{ fontWeight: 800, fontSize: 60, color: "#3A2414" }}>{next}</div>
      </div>
    </AbsoluteFill>
  );
};
