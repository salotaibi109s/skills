import React from "react";
import { AbsoluteFill, interpolate, random } from "remotion";
import { clamp } from "./kit";

/**
 * Illustration kit for the «من الصفر» videos: a camera that moves over a drawn world, skies,
 * desert, sea, mud houses and a Saudi character with poses. Everything is flat SVG.
 */

export const io = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ------------------------------------------------------------ shots & camera
export type ShotDef = { at: number; C: React.FC<{ l: number; d: number }>; name?: string };

/** Plays one shot at a time: hard cut + a short punch-in on every cut. */
export const ShotPlayer: React.FC<{ f: number; shots: ShotDef[]; total: number }> = ({ f, shots, total }) => {
  const sorted = [...shots].sort((a, b) => a.at - b.at);
  let i = 0;
  for (let k = 0; k < sorted.length; k++) if (f >= sorted[k].at) i = k;
  const s = sorted[i];
  const next = i + 1 < sorted.length ? sorted[i + 1].at : total;
  const l = f - s.at;
  const d = Math.max(1, next - s.at);
  const punch = interpolate(l, [0, 9], [1.07, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const flash = interpolate(l, [0, 3], [0.35, 0], clamp);
  const C = s.C;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(punch) }}>
        <C l={l} d={d} />
      </AbsoluteFill>
      {flash > 0 && <AbsoluteFill style={{ background: `rgba(255,255,255,${flash})` }} />}
    </AbsoluteFill>
  );
};

/** Camera over a world: [x, y, zoom] at the start and end of the shot (x/y = world point at screen centre). */
export const Cam: React.FC<{ l: number; d: number; a: [number, number, number]; b: [number, number, number]; children: React.ReactNode; w?: number; h?: number; rot?: [number, number] }> = ({ l, d, a, b, children, w = 1080, h = 1920, rot }) => {
  const t = io(Math.min(1, Math.max(0, l / d)));
  // handheld drift so the camera never sits still
  const x = lerp(a[0], b[0], t) + Math.sin(l / 23) * 7;
  const y = lerp(a[1], b[1], t) + Math.cos(l / 29) * 6;
  const z = lerp(a[2], b[2], t);
  const r = lerp(rot?.[0] ?? 0, rot?.[1] ?? 0, t) + Math.sin(l / 41) * 0.4;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transformOrigin: "0 0", transform: `translate(540px, 960px) rotate(${r}deg) scale(${z}) translate(${-x}px, ${-y}px)` }}>{children}</div>
    </AbsoluteFill>
  );
};

/** World canvas (svg) */
export const World: React.FC<{ w?: number; h?: number; children: React.ReactNode }> = ({ w = 1080, h = 1920, children }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    {children}
  </svg>
);

// ------------------------------------------------------------ nature
export const SkyRect: React.FC<{ w?: number; h: number; top?: string; bottom?: string }> = ({ w = 1080, h, top = "#74C3F0", bottom = "#F6E2B5" }) => {
  const id = `sky${top.slice(1)}${bottom.slice(1)}`;
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect x={-2000} y={-2000} width={w + 4000} height={h + 2000} fill={`url(#${id})`} />
    </>
  );
};

export const Clouds: React.FC<{ f: number; y: number; w?: number; n?: number; seed?: string; o?: number }> = ({ f, y, w = 1080, n = 4, seed = "c", o = 0.9 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const s = 0.6 + random(`${seed}s${i}`) * 0.8;
      const x = ((random(`${seed}x${i}`) * (w + 600) + f * (0.4 + s * 0.3)) % (w + 600)) - 300;
      const yy = y + random(`${seed}y${i}`) * 260;
      return (
        <g key={i} transform={`translate(${x} ${yy}) scale(${s})`}>
          <ellipse cx={0} cy={0} rx={110} ry={38} fill="#fff" />
          <ellipse cx={-50} cy={-20} rx={60} ry={40} fill="#fff" />
          <ellipse cx={40} cy={-28} rx={70} ry={46} fill="#fff" />
        </g>
      );
    })}
  </g>
);

export const Sun: React.FC<{ x: number; y: number; r?: number; f: number }> = ({ x, y, r = 90, f }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 2.4} fill="rgba(255,214,90,0.18)" />
    <circle r={r * 1.6} fill="rgba(255,214,90,0.28)" />
    <g transform={`rotate(${f * 0.5})`}>
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={-6} y={-r * 1.55} width={12} height={r * 0.35} rx={6} fill="#FFC23B" transform={`rotate(${(i * 360) / 14})`} />
      ))}
    </g>
    <circle r={r} fill="#FFE07A" />
    <circle r={r * 0.78} fill="#FFEFA8" />
  </g>
);

/** Layered dunes from y downwards. */
export const Dunes: React.FC<{ y: number; w?: number; tone?: number }> = ({ y, w = 1080, tone = 0 }) => {
  const c = tone ? ["#D6A866", "#E3B877", "#EECB8E"] : ["#DDB06C", "#E9C27E", "#F2D39A"];
  return (
    <g>
      <path d={`M-400 ${y + 40} C${w * 0.2} ${y - 60} ${w * 0.45} ${y + 60} ${w * 0.7} ${y} C${w * 0.85} ${y - 40} ${w} ${y + 20} ${w + 400} ${y - 10} L${w + 400} ${y + 3000} L-400 ${y + 3000} Z`} fill={c[0]} />
      <path d={`M-400 ${y + 120} C${w * 0.3} ${y + 40} ${w * 0.6} ${y + 160} ${w + 400} ${y + 80} L${w + 400} ${y + 3000} L-400 ${y + 3000} Z`} fill={c[1]} />
      <path d={`M-400 ${y + 240} C${w * 0.25} ${y + 180} ${w * 0.7} ${y + 300} ${w + 400} ${y + 220} L${w + 400} ${y + 3000} L-400 ${y + 3000} Z`} fill={c[2]} />
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={i} d={`M${(i * 233) % w} ${y + 320 + ((i * 97) % 500)} q40 -14 80 0`} stroke={c[0]} strokeWidth={6} fill="none" opacity={0.6} />
      ))}
    </g>
  );
};

export const Sea: React.FC<{ y: number; f: number; w?: number }> = ({ y, f, w = 1080 }) => (
  <g>
    <rect x={-400} y={y} width={w + 800} height={900} fill="#2E8FC9" />
    <rect x={-400} y={y} width={w + 800} height={60} fill="#5FB6E6" />
    {Array.from({ length: 5 }).map((_, r) =>
      Array.from({ length: 8 }).map((__, i) => {
        const x = ((i * 190 + f * (1 + r * 0.4) + r * 70) % (w + 380)) - 190;
        return <path key={`${r}${i}`} d={`M${x} ${y + 90 + r * 90} q30 -16 60 0 q30 16 60 0`} stroke="rgba(255,255,255,0.45)" strokeWidth={6} fill="none" />;
      }),
    )}
  </g>
);

// ------------------------------------------------------------ buildings
export const MudHouse: React.FC<{ x: number; y: number; s?: number; w?: number; h?: number; door?: boolean; win?: boolean; tone?: number; children?: React.ReactNode }> = ({ x, y, s = 1, w = 360, h = 280, door = true, win = true, tone = 0, children }) => {
  const body = ["#C98D52", "#D9A46A", "#B87C45"][tone % 3];
  const dark = ["#9C6634", "#A9743E", "#8A5A2B"][tone % 3];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill={body} stroke={dark} strokeWidth={8} />
      <rect x={-w / 2 - 14} y={-h - 18} width={w + 28} height={24} fill={dark} />
      {Array.from({ length: Math.floor(w / 40) }).map((_, i) => (
        <rect key={i} x={-w / 2 + 8 + i * 40} y={-h - 34} width={22} height={18} fill={dark} />
      ))}
      {door && <path d={`M${-40} 0 L${-40} -120 Q0 -170 40 -120 L40 0 Z`} fill="#4A2E17" />}
      {win && <rect x={-w / 2 + 40} y={-h + 60} width={70} height={80} rx={6} fill="#3B2412" />}
      {children}
    </g>
  );
};

/** Wind-catcher tower on a roof point (x = centre, y = roof). */
export const WindTower: React.FC<{ x: number; y: number; h?: number; grow?: number }> = ({ x, y, h = 260, grow = 1 }) => (
  <g>
    <rect x={x - 70} y={y - h * grow} width={140} height={h * grow + 4} fill="#C98D52" stroke="#9C6634" strokeWidth={8} />
    {grow > 0.9 && (
      <>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={x - 52 + i * 38} y={y - h + 26} width={24} height={86} rx={4} fill="#3B2412" />
        ))}
        <rect x={x - 84} y={y - h - 16} width={168} height={22} fill="#9C6634" />
      </>
    )}
  </g>
);

// ------------------------------------------------------------ the character
export type Pose = { l?: number; r?: number; lift?: number; lean?: number; head?: number };
export const POSES: Record<string, Pose> = {
  stand: { l: 8, r: -8 },
  wave: { l: 8, r: -150 },
  pour: { l: 10, r: -70 },
  reach: { l: 150, r: -150 },
  carry: { l: 40, r: -40 },
  nose: { l: 8, r: -165 },
  fan: { l: 10, r: -125 },
  hot: { l: 150, r: -150, head: -6 },
  hammer: { l: 8, r: -160 },
  point: { l: 8, r: -95 },
  think: { l: 8, r: -140, head: 8 },
};

export const Man: React.FC<{
  x: number;
  y: number;
  s?: number;
  pose?: keyof typeof POSES | Pose;
  f?: number;
  flip?: boolean;
  walk?: boolean;
  hat?: "shmagh" | "chef" | "tricorn" | "helmet" | "none";
  thobe?: string;
  sweat?: boolean;
  hand?: React.ReactNode; // drawn at the right hand
  armSwing?: number;
}> = ({ x, y, s = 1, pose = "stand", f = 0, flip, walk, hat = "shmagh", thobe = "#FFFFFF", sweat, hand, armSwing = 0 }) => {
  const p = typeof pose === "string" ? POSES[pose] : pose;
  const bob = walk ? Math.abs(Math.sin(f / 4)) * 10 : Math.sin(f / 18) * 2;
  const sw = walk ? Math.sin(f / 4) * 18 : 0;
  const lA = (p.l ?? 8) + sw;
  const rA = (p.r ?? -8) - sw + Math.sin(f / 3) * armSwing;
  const skin = "#E2AE84";
  const shade = thobe === "#FFFFFF" ? "#E4E7EA" : "rgba(0,0,0,0.15)";
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={bob + 4} rx={80} ry={14} fill="rgba(0,0,0,0.18)" />
      {/* feet */}
      <ellipse cx={-26 + (walk ? Math.sin(f / 4) * 14 : 0)} cy={-4} rx={26} ry={10} fill="#6B4423" />
      <ellipse cx={26 - (walk ? Math.sin(f / 4) * 14 : 0)} cy={-4} rx={26} ry={10} fill="#6B4423" />
      {/* left arm (behind) */}
      <g transform={`translate(-58 -292) rotate(${lA})`}>
        <rect x={-17} y={0} width={34} height={150} rx={17} fill={thobe} stroke={shade} strokeWidth={4} />
        <circle cx={0} cy={156} r={18} fill={skin} />
      </g>
      {/* thobe */}
      <path d="M-66 -300 C-80 -200 -84 -90 -78 -8 L78 -8 C84 -90 80 -200 66 -300 Q0 -320 -66 -300 Z" fill={thobe} stroke={shade} strokeWidth={5} />
      <path d="M0 -296 L0 -200" stroke={shade} strokeWidth={5} />
      <circle cx={0} cy={-270} r={5} fill={shade} />
      {/* head */}
      <g transform={`translate(0 -350) rotate(${p.head ?? 0})`}>
        <rect x={-14} y={30} width={28} height={30} fill={skin} />
        <ellipse cx={0} cy={0} rx={46} ry={54} fill={skin} />
        <path d="M-40 14 Q-40 62 0 66 Q40 62 40 14 Q20 34 0 30 Q-20 34 -40 14 Z" fill="#2B1B12" />
        <ellipse cx={-16} cy={-6} rx={6} ry={8} fill="#1C120C" />
        <ellipse cx={16} cy={-6} rx={6} ry={8} fill="#1C120C" />
        <path d="M-26 -22 L-8 -20 M8 -20 L26 -22" stroke="#2B1B12" strokeWidth={6} strokeLinecap="round" />
        <path d="M-10 24 Q0 30 10 24" stroke="#7A3B2E" strokeWidth={5} fill="none" strokeLinecap="round" />
        {hat === "shmagh" && (
          <>
            <path d="M-58 -10 C-62 -70 62 -70 58 -10 L70 90 L40 70 L44 -6 C30 -40 -30 -40 -44 -6 L-40 70 L-70 90 Z" fill="#F4F4F4" stroke="#D6DADF" strokeWidth={3} />
            {Array.from({ length: 6 }).map((_, i) => (
              <path key={i} d={`M${-50 + i * 20} -46 l8 8 l-8 8 l-8 -8 Z`} fill="#C8202E" />
            ))}
            <ellipse cx={0} cy={-44} rx={54} ry={14} fill="none" stroke="#1C1C1C" strokeWidth={10} />
            <ellipse cx={0} cy={-56} rx={50} ry={12} fill="none" stroke="#1C1C1C" strokeWidth={9} />
          </>
        )}
        {hat === "chef" && <path d="M-44 -30 L-44 -60 C-80 -70 -70 -130 -30 -118 C-20 -150 20 -150 30 -118 C70 -130 80 -70 44 -60 L44 -30 Z" fill="#fff" stroke="#C7CCD2" strokeWidth={5} />}
        {hat === "tricorn" && <path d="M-70 -34 Q0 -110 70 -34 Q0 -56 -70 -34 Z" fill="#1F2430" />}
        {hat === "helmet" && <path d="M-52 -18 Q0 -100 52 -18 Z" fill="#3A4656" />}
        {hat === "none" && <path d="M-46 -10 Q-40 -66 0 -60 Q40 -66 46 -10 Q20 -40 -46 -10 Z" fill="#2B1B12" />}
      </g>
      {/* right arm (front) */}
      <g transform={`translate(58 -292) rotate(${rA})`}>
        <rect x={-17} y={0} width={34} height={150} rx={17} fill={thobe} stroke={shade} strokeWidth={4} />
        <circle cx={0} cy={156} r={18} fill={skin} />
        {hand && <g transform="translate(0 160)">{hand}</g>}
      </g>
      {sweat &&
        [0, 1, 2].map((i) => {
          const t = ((f + i * 12) % 36) / 36;
          return <path key={i} d="M0 -14 C9 0 9 8 0 12 C-9 8 -9 0 0 -14 Z" fill="#5BB8F0" transform={`translate(${-70 + i * 70} ${-430 + t * 70})`} opacity={1 - t} />;
        })}
    </g>
  );
};

/** Simple marching soldier (small). */
export const Soldier: React.FC<{ x: number; y: number; s?: number; f: number }> = ({ x, y, s = 1, f }) => (
  <Man x={x} y={y} s={s} f={f} walk hat="helmet" thobe="#2F4A7A" pose={{ l: 10, r: -10 }} hand={<rect x={-6} y={-200} width={12} height={240} rx={6} fill="#6B4423" />} />
);

// ------------------------------------------------------------ small props
export const Fish: React.FC<{ x: number; y: number; s?: number; rot?: number; tint?: string }> = ({ x, y, s = 1, rot = 0, tint = "#7FA6C8" }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-110 0 C-60 -50 70 -50 110 0 C70 50 -60 50 -110 0 Z" fill={tint} stroke="#4F7699" strokeWidth={6} />
    <path d="M106 0 L160 -40 L150 0 L160 40 Z" fill="#4F7699" />
    <circle cx={-70} cy={-8} r={9} fill="#fff" />
    <circle cx={-70} cy={-8} r={4.5} fill="#1C120C" />
  </g>
);

export const Jar: React.FC<{ x: number; y: number; s?: number; cork?: number; fill?: number }> = ({ x, y, s = 1, cork = 1, fill = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-80} y={-110} width={160} height={220} rx={30} fill="rgba(190,230,255,0.5)" stroke="#7FB8D9" strokeWidth={7} />
    <g opacity={fill}>
      <ellipse cx={-22} cy={50} rx={34} ry={26} fill="#E07A3A" />
      <ellipse cx={26} cy={74} rx={30} ry={22} fill="#7DB24A" />
      <ellipse cx={8} cy={18} rx={28} ry={20} fill="#D9473A" />
    </g>
    <rect x={-50} y={-100} width={14} height={170} rx={7} fill="rgba(255,255,255,0.5)" />
    <rect x={-52} y={-144 - (1 - cork) * 110} width={104} height={44} rx={12} fill="#B88552" stroke="#7A5530" strokeWidth={5} opacity={Math.min(1, cork * 3)} />
  </g>
);

export const Can: React.FC<{ x: number; y: number; s?: number; dent?: number }> = ({ x, y, s = 1, dent = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-90} y={-120} width={180} height={240} rx={14} fill="#B8BEC6" stroke="#8A9099" strokeWidth={6} />
    <ellipse cx={0} cy={-120} rx={90} ry={22} fill="#D5DAE0" stroke="#8A9099" strokeWidth={6} />
    {[-80, -64, 90, 106].map((yy) => (
      <line key={yy} x1={-90} x2={90} y1={yy} y2={yy} stroke="#8A9099" strokeWidth={4} opacity={0.6} />
    ))}
    <rect x={-90} y={-44} width={180} height={104} fill="#D8473A" />
    <circle cx={0} cy={8} r={30} fill="#F4C542" />
    {dent > 0 && <path d={`M-30 -120 L-8 ${-120 + 30 * dent} L16 -120`} fill="none" stroke="#1C120C" strokeWidth={5} />}
  </g>
);

export const Calendar: React.FC<{ x: number; y: number; s?: number; n: number; f?: number; label?: string }> = ({ x, y, s = 1, n, label }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-110} width={220} height={230} rx={22} fill="#fff" stroke="#C9B48E" strokeWidth={6} />
    <rect x={-110} y={-110} width={220} height={64} rx={22} fill="#E0313F" />
    <circle cx={-56} cy={-112} r={10} fill="#555" />
    <circle cx={56} cy={-112} r={10} fill="#555" />
    <text x={0} y={-62} textAnchor="middle" fontFamily="sans-serif" fontWeight={700} fontSize={30} fill="#fff">
      {label ?? ""}
    </text>
    <text x={0} y={70} textAnchor="middle" fontFamily="sans-serif" fontWeight={700} fontSize={110} fill="#2A1C10">
      {String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)])}
    </text>
  </g>
);

/** Little heat squiggles rising from a point. */
export const Heat: React.FC<{ x: number; y: number; f: number; n?: number; w?: number; color?: string; o?: number }> = ({ x, y, f, n = 4, w = 300, color = "#F2793A", o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const t = ((f + i * 11) % 44) / 44;
      return <path key={i} d={`M${x - w / 2 + (i * w) / Math.max(1, n - 1)} ${y - t * 140} q16 -20 0 -40 q-16 -20 0 -40`} stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" opacity={1 - t} />;
    })}
  </g>
);

/** Flowing wind lines along a polyline. */
export const Wind: React.FC<{ pts: [number, number][]; f: number; color?: string; n?: number; o?: number; w?: number }> = ({ pts, f, color = "#fff", n = 5, o = 1, w = 10 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const t = ((f + (i * 48) / n) % 48) / 48;
      const segs = pts.length - 1;
      const seg = Math.min(segs - 1, Math.floor(t * segs));
      const u = t * segs - seg;
      const x = lerp(pts[seg][0], pts[seg + 1][0], u);
      const y = lerp(pts[seg][1], pts[seg + 1][1], u);
      return <path key={i} d={`M${x - 40} ${y} q20 -14 40 0 q20 14 40 0`} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" opacity={1 - Math.abs(t - 0.5) * 0.9} />;
    })}
  </g>
);

/** Earth seen from space (for the pull-out ending). */
export const Globe: React.FC<{ x: number; y: number; r: number; f: number }> = ({ x, y, r, f }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 1.08} fill="rgba(120,200,255,0.25)" />
    <circle r={r} fill="#2E7FC4" />
    <g transform={`rotate(${f * 0.2})`}>
      <path d={`M${-r * 0.5} ${-r * 0.3} C${-r * 0.2} ${-r * 0.6} ${r * 0.3} ${-r * 0.5} ${r * 0.4} ${-r * 0.1} C${r * 0.5} ${r * 0.2} ${r * 0.1} ${r * 0.3} ${-r * 0.1} ${r * 0.1} C${-r * 0.3} ${r * 0.4} ${-r * 0.7} ${r * 0.1} ${-r * 0.5} ${-r * 0.3} Z`} fill="#E3B877" />
      <path d={`M${r * 0.2} ${r * 0.45} C${r * 0.4} ${r * 0.4} ${r * 0.6} ${r * 0.6} ${r * 0.4} ${r * 0.75} C${r * 0.2} ${r * 0.8} ${r * 0.1} ${r * 0.6} ${r * 0.2} ${r * 0.45} Z`} fill="#6DBE5A" />
    </g>
    <circle r={r} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={6} />
  </g>
);
