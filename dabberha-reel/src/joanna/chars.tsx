import React from "react";

/**
 * Cartoon characters for «يوميات جوانا», drawn in SVG with soft gradient shading for a 2.5D look.
 * Local coordinates: (0,0) is between the feet; the figure stands up into negative y.
 * A kid is ~1000 units tall, so scale 0.5 gives ~500 px.
 */

export type Pt = [number, number];
export type Expr = "happy" | "smile" | "shock" | "worry" | "laugh" | "sly" | "proud";
export type Arm = { target?: Pt; a?: number; b?: number };

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Arm geometry: side -1 = screen-left arm, +1 = screen-right arm. Angles: 0 down, + outward, 180 up. */
const armPts = (sh: Pt, side: number, arm: Arm, l1: number, l2: number): Pt[] => {
  let a = arm.a ?? 8;
  let b = arm.b ?? 4;
  if (arm.target) {
    const T = arm.target;
    const dx = T[0] - sh[0];
    const dy = T[1] - sh[1];
    let d = Math.hypot(dx, dy);
    d = Math.max(Math.abs(l1 - l2) + 1, Math.min(d, l1 + l2 - 1));
    const base = deg(Math.atan2(side * dx, dy));
    const alpha = deg(Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
    a = base + alpha;
    const E: Pt = [sh[0] + side * Math.sin(rad(a)) * l1, sh[1] + Math.cos(rad(a)) * l1];
    b = deg(Math.atan2(side * (T[0] - E[0]), T[1] - E[1]));
  }
  const E: Pt = [sh[0] + side * Math.sin(rad(a)) * l1, sh[1] + Math.cos(rad(a)) * l1];
  const H: Pt = [E[0] + side * Math.sin(rad(b)) * l2, E[1] + Math.cos(rad(b)) * l2];
  return [sh, E, H];
};

const poly = (p: Pt[]) => p.map((q) => q.join(",")).join(" ");

/** Shared defs: gradients used by every character. Render once per SVG. */
export const CharDefs: React.FC = () => (
  <defs>
    <radialGradient id="skinJ" cx="42%" cy="35%" r="72%">
      <stop offset="0%" stopColor="#FFE2C6" />
      <stop offset="70%" stopColor="#F2C29A" />
      <stop offset="100%" stopColor="#D99B72" />
    </radialGradient>
    <radialGradient id="skinF" cx="42%" cy="35%" r="72%">
      <stop offset="0%" stopColor="#F6D2AE" />
      <stop offset="70%" stopColor="#DFAA7D" />
      <stop offset="100%" stopColor="#BD8457" />
    </radialGradient>
    <radialGradient id="skinT" cx="42%" cy="35%" r="72%">
      <stop offset="0%" stopColor="#FCE0C4" />
      <stop offset="70%" stopColor="#EBBC93" />
      <stop offset="100%" stopColor="#CF946B" />
    </radialGradient>
    <linearGradient id="pinafore" x1="0" x2="1">
      <stop offset="0%" stopColor="#5E93C9" />
      <stop offset="45%" stopColor="#86B8E8" />
      <stop offset="100%" stopColor="#4D7DB0" />
    </linearGradient>
    <linearGradient id="shirt" x1="0" x2="1">
      <stop offset="0%" stopColor="#E6EAF0" />
      <stop offset="50%" stopColor="#FFFFFF" />
      <stop offset="100%" stopColor="#D5DAE2" />
    </linearGradient>
    <linearGradient id="hairJ" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stopColor="#9A5E3A" />
      <stop offset="60%" stopColor="#6E3E22" />
      <stop offset="100%" stopColor="#4E2A15" />
    </linearGradient>
    <linearGradient id="hairF" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stopColor="#3B2E2A" />
      <stop offset="100%" stopColor="#141010" />
    </linearGradient>
    <linearGradient id="abaya" x1="0" x2="1">
      <stop offset="0%" stopColor="#4A4E7A" />
      <stop offset="45%" stopColor="#6D72A6" />
      <stop offset="100%" stopColor="#3C406A" />
    </linearGradient>
    <linearGradient id="hijab" x1="0" x2="1">
      <stop offset="0%" stopColor="#D9C3A5" />
      <stop offset="45%" stopColor="#F2E1C9" />
      <stop offset="100%" stopColor="#C8AE8C" />
    </linearGradient>
    <linearGradient id="bagPink" x1="0" x2="1">
      <stop offset="0%" stopColor="#F06FA4" />
      <stop offset="50%" stopColor="#FF9CC6" />
      <stop offset="100%" stopColor="#D9508A" />
    </linearGradient>
    <radialGradient id="iris" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stopColor="#9A6436" />
      <stop offset="100%" stopColor="#3A220F" />
    </radialGradient>
    <radialGradient id="aoShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#000" stopOpacity={0.35} />
      <stop offset="100%" stopColor="#000" stopOpacity={0} />
    </radialGradient>
  </defs>
);

/** Face: eyes, brows, mouth, blush. Coordinates relative to the head centre; r is the head radius. */
const Face: React.FC<{ r: number; expr: Expr; talk: number; blink: number; look?: Pt; glasses?: boolean; adult?: boolean }> = ({ r, expr, talk, blink, look = [0, 0], glasses, adult }) => {
  const ex = r * 0.37;
  const ey = -r * 0.02;
  const erx = r * (adult ? 0.16 : 0.21) * (expr === "shock" ? 1.12 : 1);
  const ery = r * (adult ? 0.19 : 0.26) * (expr === "shock" ? 1.15 : 1);
  const closedHappy = expr === "laugh";
  const lid = expr === "sly" ? 0.45 : expr === "proud" ? 0.3 : 0;
  const openK = Math.max(0, 1 - blink);
  const pupilR = erx * (expr === "shock" ? 0.5 : 0.66);
  const lx = look[0] * erx * 0.35;
  const ly = look[1] * ery * 0.3;
  const brow = (side: number) => {
    const x = side * ex;
    let y = ey - ery - r * 0.12;
    let tilt = 0;
    if (expr === "shock") y -= r * 0.12;
    if (expr === "worry") tilt = 14;
    if (expr === "sly") {
      y += r * 0.05;
      tilt = -10;
    }
    if (expr === "happy" || expr === "laugh") y -= r * 0.04;
    const w = erx * 1.1;
    const inner = x - side * w * 0.6;
    const outer = x + side * w * 0.6;
    return <path d={`M${inner} ${y - tilt * 0.8} Q${x} ${y - r * 0.07} ${outer} ${y + tilt * 0.5}`} stroke={adult ? "#3A2A20" : "#5A3420"} strokeWidth={r * 0.055} fill="none" strokeLinecap="round" />;
  };
  const eye = (side: number) => {
    const x = side * ex;
    if (closedHappy) return <path d={`M${x - erx} ${ey + 4} Q${x} ${ey - ery * 0.9} ${x + erx} ${ey + 4}`} stroke="#2A1A10" strokeWidth={r * 0.05} fill="none" strokeLinecap="round" />;
    const h = ery * openK;
    if (h < 2) return <path d={`M${x - erx} ${ey} Q${x} ${ey + ery * 0.25} ${x + erx} ${ey}`} stroke="#2A1A10" strokeWidth={r * 0.04} fill="none" strokeLinecap="round" />;
    return (
      <g>
        <ellipse cx={x} cy={ey} rx={erx} ry={h} fill="#FFFFFF" stroke="#3A2414" strokeWidth={r * 0.018} />
        <clipPath id={`ec${side}${Math.round(r)}${adult ? "a" : ""}`}>
          <ellipse cx={x} cy={ey} rx={erx} ry={h} />
        </clipPath>
        <g clipPath={`url(#ec${side}${Math.round(r)}${adult ? "a" : ""})`}>
          <circle cx={x + lx} cy={ey + ly + ery * 0.05} r={pupilR} fill="url(#iris)" />
          <circle cx={x + lx} cy={ey + ly + ery * 0.05} r={pupilR * 0.5} fill="#120A05" />
          <circle cx={x + lx - pupilR * 0.35} cy={ey + ly - pupilR * 0.35} r={pupilR * 0.28} fill="#fff" />
          <circle cx={x + lx + pupilR * 0.3} cy={ey + ly + pupilR * 0.3} r={pupilR * 0.12} fill="#fff" />
          {lid > 0 && <rect x={x - erx - 2} y={ey - ery - 2} width={erx * 2 + 4} height={ery * 2 * lid + 2} fill={adult ? "#EBBC93" : "#F2C29A"} />}
          {lid > 0 && <line x1={x - erx} x2={x + erx} y1={ey - ery + ery * 2 * lid} y2={ey - ery + ery * 2 * lid} stroke="#3A2414" strokeWidth={r * 0.03} />}
        </g>
        {!adult && <path d={`M${x + side * erx * 0.6} ${ey - h * 0.85} l${side * r * 0.06} ${-r * 0.05}`} stroke="#2A1A10" strokeWidth={r * 0.025} strokeLinecap="round" />}
      </g>
    );
  };
  // Mouth
  const my = r * 0.42;
  const t = Math.max(0, Math.min(1, talk));
  let mouth: React.ReactNode;
  if (expr === "laugh" || t > 0.06 || expr === "shock") {
    const base = expr === "laugh" ? 0.75 : expr === "shock" ? 0.45 : 0;
    const k = Math.max(base, t);
    const w = r * (expr === "shock" && t < 0.1 ? 0.16 : 0.24 + 0.06 * k);
    const h = r * (0.05 + 0.3 * k);
    const d = expr === "shock" && t < 0.1 ? `M${-w} ${my} a${w} ${h} 0 1 0 ${w * 2} 0 a${w} ${h} 0 1 0 ${-w * 2} 0` : `M${-w} ${my - h * 0.25} Q0 ${my - h * 0.45} ${w} ${my - h * 0.25} Q${w * 0.9} ${my + h} 0 ${my + h} Q${-w * 0.9} ${my + h} ${-w} ${my - h * 0.25}Z`;
    mouth = (
      <g>
        <path d={d} fill="#7A2230" stroke="#4A1018" strokeWidth={r * 0.02} />
        <clipPath id={`mc${Math.round(r)}${adult ? "a" : ""}`}>
          <path d={d} />
        </clipPath>
        <g clipPath={`url(#mc${Math.round(r)}${adult ? "a" : ""})`}>
          <ellipse cx={0} cy={my + h * 0.95} rx={w * 0.6} ry={h * 0.45} fill="#E0646E" />
          <rect x={-w} y={my - h * 0.5} width={w * 2} height={h * 0.28} fill="#fff" />
        </g>
      </g>
    );
  } else if (expr === "worry") {
    mouth = <path d={`M${-r * 0.16} ${my + 6} q${r * 0.08} ${-r * 0.06} ${r * 0.16} 0 t${r * 0.16} 0`} stroke="#6A2A2A" strokeWidth={r * 0.035} fill="none" strokeLinecap="round" />;
  } else if (expr === "sly") {
    mouth = <path d={`M${-r * 0.15} ${my} Q${r * 0.02} ${my + r * 0.1} ${r * 0.18} ${my - r * 0.06}`} stroke="#6A2A2A" strokeWidth={r * 0.04} fill="none" strokeLinecap="round" />;
  } else {
    mouth = <path d={`M${-r * 0.2} ${my - 2} Q0 ${my + r * (expr === "happy" || expr === "proud" ? 0.17 : 0.11)} ${r * 0.2} ${my - 2}`} stroke="#6A2A2A" strokeWidth={r * 0.04} fill={expr === "happy" ? "#fff" : "none"} strokeLinecap="round" />;
  }
  return (
    <g>
      <ellipse cx={-ex - r * 0.1} cy={r * 0.25} rx={r * 0.14} ry={r * 0.08} fill="#FF7A8A" opacity={0.35} />
      <ellipse cx={ex + r * 0.1} cy={r * 0.25} rx={r * 0.14} ry={r * 0.08} fill="#FF7A8A" opacity={0.35} />
      {eye(-1)}
      {eye(1)}
      {brow(-1)}
      {brow(1)}
      <path d={`M${-r * 0.03} ${r * 0.18} q${r * 0.04} ${r * 0.05} ${r * 0.08} 0`} stroke="#B9785A" strokeWidth={r * 0.03} fill="none" strokeLinecap="round" />
      {mouth}
      {glasses && (
        <g fill="none" stroke="#2D2D3A" strokeWidth={r * 0.035}>
          <circle cx={-ex} cy={ey} r={erx * 1.35} />
          <circle cx={ex} cy={ey} r={erx * 1.35} />
          <path d={`M${-ex + erx * 1.35} ${ey - 4} Q0 ${ey - r * 0.08} ${ex - erx * 1.35} ${ey - 4}`} />
        </g>
      )}
    </g>
  );
};

export type KidProps = {
  x: number;
  y: number;
  s: number;
  who?: "joanna" | "friend" | "extra";
  hair?: string;
  expr?: Expr;
  talk?: number;
  blink?: number;
  look?: Pt;
  tilt?: number;
  armL?: Arm;
  armR?: Arm;
  walk?: number; // phase; undefined = standing
  seated?: boolean; // legs hidden (behind a desk)
  bag?: boolean;
  sweat?: number;
  flip?: boolean;
  armsFront?: boolean;
};

/** A school girl (Joanna, her friend, or a background classmate). */
export const Kid: React.FC<KidProps> = ({ x, y, s, who = "joanna", hair, expr = "smile", talk = 0, blink = 0, look, tilt = 0, armL = {}, armR = {}, walk, seated, bag, sweat = 0, flip, armsFront }) => {
  const skin = who === "friend" ? "url(#skinF)" : who === "joanna" ? "url(#skinJ)" : "url(#skinJ)";
  const hairFill = hair ?? (who === "friend" ? "url(#hairF)" : "url(#hairJ)");
  const bob = walk !== undefined ? -Math.abs(Math.sin(walk)) * 18 : 0;
  const legL = walk !== undefined ? Math.max(0, Math.sin(walk)) * 40 : 0;
  const legR = walk !== undefined ? Math.max(0, -Math.sin(walk)) * 40 : 0;
  const hr = 190;
  const head: Pt = [0, -770 + bob];
  const shL: Pt = [-108, -548 + bob];
  const shR: Pt = [108, -548 + bob];
  const aL = armPts(shL, -1, armL, 150, 140);
  const aR = armPts(shR, 1, armR, 150, 140);
  const armDraw = (p: Pt[], key: string) => (
    <g key={key}>
      <polyline points={poly(p.slice(0, 2))} stroke="url(#shirt)" strokeWidth={58} strokeLinecap="round" fill="none" />
      <polyline points={poly(p.slice(1, 3))} stroke="url(#shirt)" strokeWidth={50} strokeLinecap="round" fill="none" />
      <circle cx={p[2][0]} cy={p[2][1]} r={34} fill={skin} />
    </g>
  );
  const pony = who === "joanna";
  const sway = walk !== undefined ? Math.sin(walk) * 8 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={0} rx={190} ry={30} fill="url(#aoShadow)" />
      {!seated && (
        <g>
          <rect x={-88} y={-262 - legL} width={64} height={250} rx={30} fill="#F4F4F6" />
          <rect x={24} y={-262 - legR} width={64} height={250} rx={30} fill="#E9E9EE" />
          <ellipse cx={-58} cy={-10 - legL} rx={56} ry={26} fill="#22222A" />
          <ellipse cx={58} cy={-10 - legR} rx={56} ry={26} fill="#22222A" />
        </g>
      )}
      {/* back hair / braids */}
      <g transform={`rotate(${tilt} ${head[0]} ${head[1] + hr})`}>
        {pony ? (
          <path d={`M${120} ${head[1] - 60} q${90 + sway} ${40} ${70 + sway} ${210} q${-10} ${50} ${-60} ${40} q${30} ${-120} ${-60} ${-200}Z`} fill={hairFill} />
        ) : who === "friend" ? (
          <>
            <path d={`M${-170} ${head[1] + 20} q${-40} ${150} ${-10} ${300}`} stroke={hairFill} strokeWidth={56} strokeLinecap="round" fill="none" />
            <path d={`M${170} ${head[1] + 20} q${40} ${150} ${10} ${300}`} stroke={hairFill} strokeWidth={56} strokeLinecap="round" fill="none" />
            <circle cx={-180} cy={head[1] + 300} r={26} fill="#F5C542" />
            <circle cx={180} cy={head[1] + 300} r={26} fill="#F5C542" />
          </>
        ) : (
          <ellipse cx={0} cy={head[1] + 40} rx={hr * 1.08} ry={hr * 1.05} fill={hairFill} />
        )}
      </g>
      {/* body */}
      {bag && (
        <g>
          <rect x={-150} y={-600 + bob} width={300} height={330} rx={60} fill="url(#bagPink)" />
        </g>
      )}
      <path d={`M${-112} ${-575 + bob} Q0 ${-600 + bob} ${112} ${-575 + bob} L${150} ${-232 + bob} Q0 ${-210 + bob} ${-150} ${-232 + bob}Z`} fill="url(#pinafore)" />
      <path d={`M${-40} ${-588 + bob} L0 ${-530 + bob} L40 ${-588 + bob}`} fill="#fff" stroke="#DADDE4" strokeWidth={4} />
      <rect x={-112} y={-420 + bob} width={224} height={26} fill="#3F6C9E" opacity={0.7} />
      {bag && (
        <>
          <path d={`M${-96} ${-570 + bob} L${-120} ${-330 + bob}`} stroke="#E0558F" strokeWidth={22} strokeLinecap="round" />
          <path d={`M${96} ${-570 + bob} L${120} ${-330 + bob}`} stroke="#E0558F" strokeWidth={22} strokeLinecap="round" />
        </>
      )}
      <rect x={-34} y={-612 + bob} width={68} height={50} rx={20} fill={skin} />
      {!armsFront && armDraw(aL, "l")}
      {!armsFront && armDraw(aR, "r")}
      {/* head */}
      <g transform={`rotate(${tilt} ${head[0]} ${head[1] + hr})`}>
        <ellipse cx={0} cy={head[1] + hr * 0.82} rx={hr * 0.55} ry={hr * 0.14} fill="#000" opacity={0.12} />
        <circle cx={head[0]} cy={head[1]} r={hr} fill={skin} />
        <ellipse cx={-hr * 0.98} cy={head[1] + 20} rx={26} ry={40} fill={skin} />
        <ellipse cx={hr * 0.98} cy={head[1] + 20} rx={26} ry={40} fill={skin} />
        <g transform={`translate(${head[0]} ${head[1]})`}>
          <Face r={hr} expr={expr} talk={talk} blink={blink} look={look} glasses={who === "friend"} />
        </g>
        {/* fringe */}
        <path d={`M${-hr * 1.02} ${head[1] + 10} Q${-hr * 1.05} ${head[1] - hr * 1.12} 0 ${head[1] - hr * 1.08} Q${hr * 1.05} ${head[1] - hr * 1.12} ${hr * 1.02} ${head[1] + 10} Q${hr * 0.85} ${head[1] - hr * 0.55} ${hr * 0.3} ${head[1] - hr * 0.62} Q${hr * 0.05} ${head[1] - hr * 0.35} ${-hr * 0.2} ${head[1] - hr * 0.6} Q${-hr * 0.7} ${head[1] - hr * 0.55} ${-hr * 1.02} ${head[1] + 10}Z`} fill={hairFill} />
        <path d={`M${-hr * 0.55} ${head[1] - hr * 0.88} Q${-hr * 0.1} ${head[1] - hr * 1.02} ${hr * 0.35} ${head[1] - hr * 0.9}`} stroke="#fff" strokeOpacity={0.25} strokeWidth={14} fill="none" strokeLinecap="round" />
        {pony && <ellipse cx={hr * 0.72} cy={head[1] - hr * 0.62} rx={34} ry={26} fill="#FF6FA8" transform={`rotate(30 ${hr * 0.72} ${head[1] - hr * 0.62})`} />}
        {sweat > 0 && (
          <path d={`M${hr * 0.85} ${head[1] - hr * 0.45} q${-22} ${40} 0 ${58} q${22} ${-18} 0 ${-58}Z`} fill="#7FD3FF" stroke="#3BA3DD" strokeWidth={4} opacity={sweat} transform={`translate(0 ${(1 - sweat) * -20})`} />
        )}
      </g>
      {armsFront && armDraw(aL, "l")}
      {armsFront && armDraw(aR, "r")}
    </g>
  );
};

export type TeacherProps = { x: number; y: number; s: number; expr?: Expr; talk?: number; blink?: number; look?: Pt; tilt?: number; armL?: Arm; armR?: Arm; walk?: number; book?: boolean };

/** The teacher: modest long dress and hijab, warm smile. ~1350 units tall. */
export const Teacher: React.FC<TeacherProps> = ({ x, y, s, expr = "smile", talk = 0, blink = 0, look, tilt = 0, armL = {}, armR = {}, walk, book }) => {
  const bob = walk !== undefined ? -Math.abs(Math.sin(walk)) * 14 : 0;
  const hr = 150;
  const head: Pt = [0, -1150 + bob];
  const shL: Pt = [-140, -950 + bob];
  const shR: Pt = [140, -950 + bob];
  const aL = armPts(shL, -1, armL, 210, 190);
  const aR = armPts(shR, 1, armR, 210, 190);
  const armDraw = (p: Pt[], key: string) => (
    <g key={key}>
      <polyline points={poly(p)} stroke="url(#abaya)" strokeWidth={70} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={p[2][0]} cy={p[2][1]} r={34} fill="url(#skinT)" />
    </g>
  );
  const step = walk !== undefined ? Math.sin(walk) * 20 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={240} ry={34} fill="url(#aoShadow)" />
      <ellipse cx={-60 + step} cy={-12} rx={60} ry={24} fill="#2A2630" />
      <ellipse cx={60 - step} cy={-12} rx={60} ry={24} fill="#2A2630" />
      <path d={`M${-150} ${-985 + bob} Q0 ${-1010 + bob} ${150} ${-985 + bob} L${230} ${-20} Q0 ${10} ${-230} ${-20}Z`} fill="url(#abaya)" />
      <path d={`M0 ${-960 + bob} L0 ${-40}`} stroke="#3A3E66" strokeWidth={5} opacity={0.6} />
      {book && <rect x={-10} y={-760 + bob} width={170} height={210} rx={14} fill="#F7B733" stroke="#D18F10" strokeWidth={6} transform={`rotate(-8 70 ${-650 + bob})`} />}
      {armDraw(aL, "l")}
      {armDraw(aR, "r")}
      <g transform={`rotate(${tilt} ${head[0]} ${head[1] + hr})`}>
        {/* hijab back + drape */}
        <path d={`M${-hr * 1.32} ${head[1] + 10} Q${-hr * 1.35} ${head[1] - hr * 1.45} 0 ${head[1] - hr * 1.42} Q${hr * 1.35} ${head[1] - hr * 1.45} ${hr * 1.32} ${head[1] + 10} L${hr * 1.55} ${head[1] + hr * 1.75} Q0 ${head[1] + hr * 2.05} ${-hr * 1.55} ${head[1] + hr * 1.75}Z`} fill="url(#hijab)" />
        <circle cx={head[0]} cy={head[1]} r={hr} fill="url(#skinT)" />
        <g transform={`translate(${head[0]} ${head[1]})`}>
          <Face r={hr} expr={expr} talk={talk} blink={blink} look={look} adult />
        </g>
        {/* hijab front frame */}
        <path d={`M${-hr * 1.22} ${head[1] + hr * 0.6} Q${-hr * 1.3} ${head[1] - hr * 1.32} 0 ${head[1] - hr * 1.3} Q${hr * 1.3} ${head[1] - hr * 1.32} ${hr * 1.22} ${head[1] + hr * 0.6} Q${hr * 1.05} ${head[1] - hr * 0.9} 0 ${head[1] - hr * 0.95} Q${-hr * 1.05} ${head[1] - hr * 0.9} ${-hr * 1.22} ${head[1] + hr * 0.6}Z`} fill="url(#hijab)" />
        <path d={`M${-hr * 0.98} ${head[1] + hr * 0.85} Q0 ${head[1] + hr * 1.45} ${hr * 0.98} ${head[1] + hr * 0.85}`} stroke="#C8AE8C" strokeWidth={46} fill="none" />
        <path d={`M${-hr * 0.7} ${head[1] - hr * 1.15} Q0 ${head[1] - hr * 1.32} ${hr * 0.7} ${head[1] - hr * 1.15}`} stroke="#fff" strokeOpacity={0.35} strokeWidth={14} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

/* ---------------------------------------------------------------- props */

export const Backpack: React.FC<{ x: number; y: number; s: number; open?: number }> = ({ x, y, s, open = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={170} ry={26} fill="url(#aoShadow)" />
    <rect x={-150} y={-330} width={300} height={330} rx={70} fill="url(#bagPink)" />
    <rect x={-100} y={-170} width={200} height={130} rx={36} fill="#FF86B8" stroke="#D9508A" strokeWidth={6} />
    <path d={`M${-150} ${-250} Q0 ${-290 - open * 80} ${150} ${-250}`} stroke="#B83B72" strokeWidth={10} fill="none" />
    <path d={`M-70 -330 Q0 -420 70 -330`} stroke="#D9508A" strokeWidth={22} fill="none" strokeLinecap="round" />
    <circle cx={60} cy={-110} r={16} fill="#FFD84D" />
    <path d={`M${-110} -300 Q-60 -320 -20 -305`} stroke="#fff" strokeOpacity={0.4} strokeWidth={12} fill="none" strokeLinecap="round" />
  </g>
);

export const Lunchbox: React.FC<{ x: number; y: number; s: number; lid?: number; notebook?: boolean; stain?: number }> = ({ x, y, s, lid = 0, notebook, stain = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={8} rx={170} ry={22} fill="url(#aoShadow)" />
    <rect x={-150} y={-120} width={300} height={120} rx={26} fill="#7ED6A5" stroke="#3FA06D" strokeWidth={6} />
    {notebook && (
      <g>
        <rect x={-120} y={-150} width={240} height={60} rx={8} fill="#3F7FD9" stroke="#1F4F99" strokeWidth={5} />
        <ellipse cx={-20} cy={-130} rx={46 * stain} ry={18 * stain} fill="#FFD23F" opacity={0.9} />
      </g>
    )}
    <g>
      <rect x={-112} y={-168} width={224} height={52} rx={22} fill="#F0C27B" />
      <rect x={-112} y={-150} width={224} height={14} fill="#FFE066" />
      <path d="M-100 -136 q20 26 40 0" fill="#FFE066" />
    </g>
    <g transform={`rotate(${-lid * 75} -150 -120) translate(0 ${-lid * 10})`}>
      <rect x={-158} y={-150} width={316} height={40} rx={18} fill="#5CC08A" stroke="#3FA06D" strokeWidth={6} />
      <rect x={-40} y={-168} width={80} height={22} rx={10} fill="#3FA06D" />
    </g>
  </g>
);

export const Notebook: React.FC<{ x: number; y: number; s: number; rot?: number; stain?: number; drip?: number }> = ({ x, y, s, rot = 0, stain = 1, drip = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-130} y={-170} width={260} height={340} rx={16} fill="#3F7FD9" stroke="#1F4F99" strokeWidth={7} />
    <rect x={-130} y={-170} width={30} height={340} fill="#2D63B5" />
    <rect x={-60} y={-90} width={150} height={60} rx={10} fill="#fff" />
    <path d={`M${-40 * stain} 40 q${-30} ${30 * stain} 0 ${60 * stain} q${40} ${20} ${80 * stain} -10 q${30} ${-40} ${-20 * stain} -60 q${-30} ${-20} ${-60 * stain} 10Z`} fill="#FFD23F" stroke="#E8B21A" strokeWidth={5} />
    {drip > 0 && <path d={`M20 ${95} q-8 ${30 * drip} 0 ${50 * drip} q8 ${-20 * drip} 0 ${-50 * drip}Z`} fill="#FFD23F" />}
  </g>
);

export const Crayons: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {["#FF5A5F", "#FFB400", "#36C5F0", "#2EB67D", "#9B5DE5"].map((c, i) => (
      <g key={c}>
        <rect x={-90 + i * 36} y={-150} width={28} height={110} rx={6} fill={c} />
        <path d={`M${-90 + i * 36} -150 l14 -32 l14 32Z`} fill={c} />
      </g>
    ))}
    <rect x={-100} y={-90} width={190} height={110} rx={12} fill="#FFDD57" stroke="#E0B400" strokeWidth={6} />
  </g>
);

export const Teddy: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle cx={-50} cy={-120} r={28} fill="#B8814F" />
    <circle cx={50} cy={-120} r={28} fill="#B8814F" />
    <circle cx={0} cy={-80} r={70} fill="#C9935F" />
    <ellipse cx={0} cy={20} rx={70} ry={80} fill="#C9935F" />
    <ellipse cx={0} cy={-62} rx={30} ry={22} fill="#EED2B0" />
    <circle cx={-24} cy={-92} r={8} fill="#2A1A10" />
    <circle cx={24} cy={-92} r={8} fill="#2A1A10" />
    <circle cx={0} cy={-68} r={8} fill="#2A1A10" />
  </g>
);

export const Sandwich: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-110 0 L0 -110 L110 0Z" fill="#F0C27B" stroke="#C98F3E" strokeWidth={6} strokeLinejoin="round" />
    <path d="M-100 0 L0 -96 L100 0" fill="none" stroke="#FFE066" strokeWidth={14} />
    <path d="M-60 2 q10 24 24 0 M10 2 q12 30 28 0" fill="#FFE066" />
  </g>
);
