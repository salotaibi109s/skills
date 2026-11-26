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
  meow: db(-10),
  purr: db(-14),
  heartbeat: db(-11),
  switch: db(-10),
  slurp: db(-13),
  doorbell: db(-9),
  sob: db(-12),
  magnify: db(-12),
  click: db(-8),
  creak: db(-11),
  dust: db(-14),
  write: db(-13),
  sting: db(-10),
  crowd: db(-16),
  chime: db(-9),
  whoosh2: db(-12),
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
  const Baba: React.FC<Omit<React.ComponentProps<typeof Dad>, "s"> & { s?: number; f: number }> = ({ f, s = 0.62, ...p }) => <Dad s={s} talk={talkOf("D", f)} blink={p.blink ?? blinkAt(f, 11)} {...p} />;
  type AdultP = Omit<React.ComponentProps<typeof Teacher>, "s"> & { s?: number; f: number };
  /** Mama: plum dress, pink scarf. */
  const Mama: React.FC<AdultP> = ({ f, s = 0.6, ...p }) => <Teacher s={s} dress="url(#momDress)" scarf="url(#momScarf)" scarfEdge="#C98AA2" talk={talkOf("M", f)} blink={p.blink ?? blinkAt(f, 5)} {...p} />;
  /** Grandma: dark dress, white scarf, round glasses. */
  const Granny: React.FC<AdultP> = ({ f, s = 0.6, ...p }) => (
    <Teacher s={s} dress="url(#oldDress)" scarf="url(#oldScarf)" scarfEdge="#B8B8C2" glasses talk={talkOf("G", f)} blink={p.blink ?? blinkAt(f, 12)} {...p} />
  );
  /** Mall information-desk employee: navy uniform, dark scarf, gold trim. */
  const Clerk: React.FC<AdultP> = ({ f, s = 0.6, ...p }) => (
    <Teacher s={s} dress="#2B3A67" scarf="#1E2A44" scarfEdge="#C9A24A" talk={talkOf("E", f)} blink={p.blink ?? blinkAt(f, 8)} {...p} />
  );
  return { line, at, endOf, talkOf, Sfx, Jo, Faisal, Baba, Mama, Granny, Clerk };
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

export const Bedroom: React.FC<{ f: number; lit?: boolean }> = ({ f, lit }) => (
  <g>
    <rect x={-1400} y={-800} width={3900} height={2300} fill={lit ? "#8FA3D8" : "#2A3358"} />
    <rect x={-1400} y={1260} width={3900} height={1400} fill={lit ? "#A9A3C9" : "#3B3F66"} />
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

/** Little orange kitten. eyesOnly = just two glowing eyes in the dark. */
export const Kitten: React.FC<{ x: number; y: number; s: number; f: number; wet?: number; sleep?: boolean; eyesOnly?: boolean; look?: number }> = ({ x, y, s, f, wet = 0, sleep, eyesOnly, look = 0 }) => {
  const shiver = wet ? Math.sin(f * 2.3) * 4 * wet : 0;
  const bl = Math.abs(Math.sin(f / 23)) > 0.97;
  const eye = (cx: number) =>
    sleep || bl ? (
      <path d={`M${cx - 16} -150 q16 12 32 0`} stroke="#3A2414" strokeWidth={6} fill="none" strokeLinecap="round" />
    ) : (
      <g>
        <ellipse cx={cx} cy={-150} rx={18} ry={22} fill={eyesOnly ? "#D8FF6A" : "#9BD84A"} />
        <ellipse cx={cx + look * 5} cy={-150} rx={6} ry={16} fill="#111" />
        <circle cx={cx - 6} cy={-158} r={5} fill="#fff" />
      </g>
    );
  if (eyesOnly)
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <circle cx={-34} cy={-150} r={46} fill="#D8FF6A" opacity={0.18} />
        <circle cx={34} cy={-150} r={46} fill="#D8FF6A" opacity={0.18} />
        {eye(-34)}
        {eye(34)}
      </g>
    );
  const tail = Math.sin(f / 9) * 14;
  return (
    <g transform={`translate(${x + shiver} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={110} ry={16} fill="rgba(0,0,0,0.2)" />
      <path d={`M70 -40 Q170 ${-60 + tail} 150 ${-150 + tail}`} stroke="#E8913A" strokeWidth={22} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={-55} rx={95} ry={60} fill="#F2A24A" />
      <path d="M-40 -100 q20 30 0 70 M10 -110 q20 30 0 75" stroke="#D9822C" strokeWidth={10} fill="none" />
      <circle cx={0} cy={-150} r={72} fill="#F2A24A" />
      <path d="M-62 -190 L-58 -250 L-20 -212Z M62 -190 L58 -250 L20 -212Z" fill="#F2A24A" />
      <path d="M-55 -200 L-54 -235 L-32 -212Z M55 -200 L54 -235 L32 -212Z" fill="#FFB7C5" />
      {eye(-28)}
      {eye(28)}
      <path d="M-8 -128 h16 l-8 9Z" fill="#E8687E" />
      <path d="M0 -119 q-10 12 -20 4 M0 -119 q10 12 20 4" stroke="#6B3A1E" strokeWidth={4} fill="none" />
      {[-1, 1].map((d) => (
        <g key={d} stroke="#fff" strokeWidth={3}>
          <line x1={d * 30} y1={-125} x2={d * 90} y2={-135} />
          <line x1={d * 30} y1={-118} x2={d * 90} y2={-112} />
        </g>
      ))}
      {wet > 0 && [0, 1, 2].map((i) => <path key={i} d="M0 -12 q-9 14 0 20 q9 -6 0 -20Z" fill="#7FD3FF" opacity={wet} transform={`translate(${-60 + i * 55} ${-80 + ((f * 3 + i * 25) % 70)})`} />)}
      {sleep && [0, 1].map((i) => <text key={i} x={70 + i * 30} y={-230 - ((f * 1.5 + i * 30) % 60)} fontFamily={FONT} fontWeight={800} fontSize={44 - i * 10} fill="#2E7D7A">z</text>)}
    </g>
  );
};

/** Darkness with a flashlight hole (world coords, inside Cam). */
export const Dark: React.FC<{ id: string; spots: { x: number; y: number; r: number }[]; o?: number }> = ({ id, spots, o = 0.86 }) => (
  <g>
    <defs>
      <mask id={id}>
        <rect x={-1400} y={-800} width={3900} height={3300} fill="#fff" />
        {spots.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#000" />
        ))}
      </mask>
      <radialGradient id={`${id}g`}>
        <stop offset="0%" stopColor="#FFF3C4" stopOpacity={0.35} />
        <stop offset="100%" stopColor="#FFF3C4" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={-1400} y={-800} width={3900} height={3300} fill="#050816" opacity={o} mask={`url(#${id})`} />
    {spots.map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r={p.r * 1.1} fill={`url(#${id}g)`} />
    ))}
  </g>
);

export const Kitchen: React.FC<{ f: number }> = () => (
  <g>
    <rect x={-1400} y={-800} width={3900} height={2300} fill="#F4EBDD" />
    {Array.from({ length: 14 }).map((_, i) => (
      <rect key={i} x={-200 + i * 110} y={760} width={104} height={104} fill={i % 2 ? "#DCEFEA" : "#F2FAF8"} stroke="#C5DDD7" strokeWidth={3} />
    ))}
    <rect x={-1400} y={1260} width={3900} height={1400} fill="#D7C2A3" />
    {/* upper cabinets */}
    {[-100, 160, 420].map((x) => (
      <rect key={x} x={x} y={260} width={240} height={360} rx={10} fill="#5FA8A0" stroke="#3F7F78" strokeWidth={8} />
    ))}
    {/* counter */}
    <rect x={-300} y={870} width={1060} height={390} fill="#4E8E87" />
    <rect x={-320} y={840} width={1100} height={40} rx={10} fill="#EDE6DA" />
    {[-180, 120, 420].map((x) => (
      <circle key={x} cx={x + 120} cy={1000} r={10} fill="#E0D2B8" />
    ))}
    {/* fridge */}
    <rect x={840} y={360} width={300} height={900} rx={24} fill="#E8EEF3" stroke="#B9C6D1" strokeWidth={8} />
    <line x1={840} x2={1140} y1={700} y2={700} stroke="#B9C6D1" strokeWidth={6} />
    <rect x={870} y={560} width={16} height={100} rx={6} fill="#9AA6B2" />
    <rect x={870} y={740} width={16} height={140} rx={6} fill="#9AA6B2" />
    {/* wall clock */}
    <circle cx={700} cy={380} r={90} fill="#fff" stroke="#C0574B" strokeWidth={12} />
  </g>
);

/** Wall clock hands (draw over Kitchen). */
export const ClockHands: React.FC<{ f: number }> = ({ f }) => (
  <g transform="translate(700 380)">
    <line x1={0} y1={0} x2={0} y2={-50} stroke="#333" strokeWidth={8} strokeLinecap="round" transform={`rotate(${120 + f * 0.2})`} />
    <line x1={0} y1={0} x2={0} y2={-70} stroke="#C0574B" strokeWidth={4} strokeLinecap="round" transform={`rotate(${f * 6})`} />
    <circle r={8} fill="#333" />
  </g>
);

/** Cake on a stand; eaten = 0 (whole) .. 1 (crumbs only). */
export const Cake: React.FC<{ x: number; y: number; s: number; eaten?: number }> = ({ x, y, s, eaten = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={170} ry={28} fill="#E8EEF3" stroke="#B9C6D1" strokeWidth={5} />
    <rect x={-14} y={0} width={28} height={70} fill="#B9C6D1" />
    {eaten < 1 ? (
      <g>
        <rect x={-130} y={-150} width={260} height={150} rx={20} fill="#6B3A1E" />
        <path d="M-130 -150 h260 v40 q-30 30 -60 0 q-30 30 -70 0 q-30 30 -70 0 q-30 30 -60 0Z" fill="#FFF3E6" />
        {[-70, 0, 70].map((cx) => (
          <circle key={cx} cx={cx} cy={-160} r={18} fill="#E8414B" />
        ))}
      </g>
    ) : (
      [-90, -40, 10, 60, 100, -20, 40].map((cx, i) => <circle key={i} cx={cx} cy={-12 - (i % 3) * 6} r={8 + (i % 2) * 4} fill="#6B3A1E" />)
    )}
  </g>
);

/** Grandma's storeroom: shelves, old boxes, a dusty light beam. */
export const Storeroom: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-1400} y={-800} width={3900} height={2300} fill="#5B4636" />
    <rect x={-1400} y={1260} width={3900} height={1400} fill="#3F2F24" />
    <rect x={720} y={180} width={200} height={240} fill="#F6D58E" opacity={0.9} />
    <path d="M720 420 L920 420 L620 1300 L120 1300Z" fill="#FFE7A8" opacity={0.16} />
    {Array.from({ length: 14 }).map((_, i) => (
      <circle key={i} cx={300 + ((i * 97 + f * (0.6 + (i % 3) * 0.3)) % 500)} cy={500 + ((i * 131 + f * 0.8) % 700)} r={3 + (i % 3)} fill="#FFF3C4" opacity={0.5} />
    ))}
    {[380, 640].map((y) => (
      <g key={y}>
        <rect x={-200} y={y} width={620} height={18} fill="#8B6A3E" />
        <rect x={-160} y={y - 120} width={140} height={120} fill="#A07A4A" />
        <rect x={20} y={y - 90} width={110} height={90} fill="#C9A26B" />
        <rect x={180} y={y - 150} width={70} height={150} fill="#6E8B5A" />
        <rect x={290} y={y - 100} width={100} height={100} fill="#B5443C" opacity={0.7} />
      </g>
    ))}
    <rect x={-200} y={1060} width={300} height={200} fill="#8B6A3E" />
    <rect x={120} y={1120} width={200} height={140} fill="#A07A4A" />
  </g>
);

/** The old locked box; open = lid angle factor 0..1. */
export const OldBox: React.FC<{ x: number; y: number; s: number; open?: number; sign?: boolean; digits?: string }> = ({ x, y, s, open = 0, sign = true, digits = "٠٠٠" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-260} width={520} height={260} rx={18} fill="#7A4E2A" stroke="#4E2F16" strokeWidth={10} />
    {[-160, 160].map((bx) => (
      <rect key={bx} x={bx - 18} y={-260} width={36} height={260} fill="#C9A24A" />
    ))}
    {open > 0 && (
      <g>
        <rect x={-240} y={-250} width={480} height={30} fill="#2A1A0C" />
        <circle cx={0} cy={-300} r={180 * open} fill="#FFE7A8" opacity={0.25 * open} />
      </g>
    )}
    <g transform={`translate(0 -260) scale(1 ${1 - open * 1.8})`}>
      <path d="M-270 0 v-80 q270 -90 540 0 v80Z" fill="#8B5A32" stroke="#4E2F16" strokeWidth={10} />
    </g>
    {open === 0 && (
      <g transform="translate(0 -250)">
        <path d="M-40 -20 v-30 a40 40 0 0 1 80 0 v30" stroke="#9AA6B2" strokeWidth={14} fill="none" />
        <rect x={-75} y={-20} width={150} height={110} rx={14} fill="#C9A24A" stroke="#8B6A1E" strokeWidth={6} />
        <rect x={-60} y={15} width={120} height={50} rx={8} fill="#2A1A0C" />
        <text x={0} y={54} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill="#FFE27A" letterSpacing={6}>
          {digits}
        </text>
      </g>
    )}
    {sign && open === 0 && (
      <g transform="translate(-130 -130) rotate(-6)">
        <rect x={-110} y={-45} width={220} height={90} fill="#FFF8E6" stroke="#C9B48A" strokeWidth={4} />
        <text x={0} y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#C0392B">
          لا تفتحوه!
        </text>
      </g>
    )}
  </g>
);

/** Shopping mall: glossy floor, shop fronts (toy shop with a red car), info desk on the right. */
export const Mall: React.FC<{ f: number; desk?: boolean }> = ({ f, desk = true }) => (
  <g>
    <rect x={-1400} y={-800} width={3900} height={2300} fill="#EAF1F7" />
    {/* upper level rail and skylight */}
    <rect x={-1400} y={-800} width={3900} height={420} fill="#CFE3F2" />
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x={-1300 + i * 320} y={-380} width={10} height={420} fill="#B8C9D6" />
    ))}
    <rect x={-1400} y={20} width={3900} height={30} fill="#9FB3C2" />
    {/* shop fronts */}
    {[
      { x: -700, c: "#7FB3D5", t: "أزياء" },
      { x: -250, c: "#F5B041", t: "ألعاب" },
      { x: 680, c: "#82C99B", t: "مكتبة" },
    ].map((sh) => (
      <g key={sh.x}>
        <rect x={sh.x} y={200} width={420} height={1060} fill="#F7FBFF" stroke="#B8C9D6" strokeWidth={10} />
        <rect x={sh.x} y={120} width={420} height={110} fill={sh.c} />
        <text x={sh.x + 210} y={198} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={64} fill="#fff">
          {sh.t}
        </text>
        <rect x={sh.x + 30} y={300} width={360} height={560} fill="#DDEFF9" opacity={0.85} />
      </g>
    ))}
    {/* toy shop window: red car + teddy */}
    <g transform="translate(-40 760)">
      <rect x={-110} y={-60} width={220} height={70} rx={24} fill="#E8414B" />
      <path d="M-60 -60 q20 -50 70 -50 q40 0 60 50Z" fill="#E8414B" />
      <rect x={-30} y={-100} width={60} height={34} rx={8} fill="#BFE6FF" />
      <circle cx={-60} cy={14} r={24} fill="#222" />
      <circle cx={60} cy={14} r={24} fill="#222" />
    </g>
    <g transform="translate(-160 560)">
      <circle r={50} fill="#B57E3A" />
      <circle cx={-38} cy={-40} r={20} fill="#B57E3A" />
      <circle cx={38} cy={-40} r={20} fill="#B57E3A" />
      <circle cx={-16} cy={-6} r={6} fill="#222" />
      <circle cx={16} cy={-6} r={6} fill="#222" />
    </g>
    {/* plants */}
    {[300, 1250].map((x) => (
      <g key={x}>
        <rect x={x - 50} y={1120} width={100} height={140} rx={14} fill="#C98A4A" />
        <ellipse cx={x} cy={1060} rx={90} ry={110} fill="#4CAF7A" />
      </g>
    ))}
    {/* floor */}
    <rect x={-1400} y={1260} width={3900} height={1400} fill="#D9DEE5" />
    {Array.from({ length: 22 }).map((_, i) => (
      <line key={i} x1={-1400 + i * 180} y1={1260} x2={-1400 + i * 180 - 300} y2={2600} stroke="#C5CCD6" strokeWidth={4} />
    ))}
    <rect x={-1400} y={1260} width={3900} height={60} fill="#fff" opacity={0.35} />
    {desk && (
      <g>
        <rect x={1180} y={860} width={520} height={400} rx={20} fill="#2B3A67" />
        <rect x={1160} y={840} width={560} height={40} rx={12} fill="#C9A24A" />
        <circle cx={1440} cy={1060} r={70} fill="#5CC8FF" />
        <text x={1440} y={1090} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={800} fontSize={90} fill="#fff">
          i
        </text>
        <rect x={1220} y={640} width={440} height={110} rx={20} fill="#fff" stroke="#2B3A67" strokeWidth={8} />
        <text x={1440} y={718} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={64} fill="#2B3A67">
          الاستقبال
        </text>
      </g>
    )}
    <circle cx={540 + Math.sin(f / 60) * 4} cy={-200} r={6} fill="#fff" opacity={0} />
  </g>
);

/** Passing adult legs (crowd) — draw in front of a small kid to make him feel lost. */
export const Legs: React.FC<{ x: number; y: number; s: number; f: number; kind?: number }> = ({ x, y, s, f, kind = 0 }) => {
  const step = Math.sin(f / 4 + kind) * 26;
  const robe = kind % 3 === 0;
  const col = ["#F3F0E8", "#2A2A35", "#3E5C8A", "#1E1E24"][kind % 4];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {robe ? (
        <>
          <path d="M-110 -700 L110 -700 L140 -30 L-140 -30Z" fill={col} />
          <ellipse cx={-50 + step} cy={-10} rx={56} ry={22} fill="#3A2A20" />
          <ellipse cx={50 - step} cy={-10} rx={56} ry={22} fill="#3A2A20" />
        </>
      ) : (
        <>
          <rect x={-90 + step} y={-700} width={80} height={690} rx={20} fill={col} />
          <rect x={10 - step} y={-700} width={80} height={690} rx={20} fill={col} />
          <ellipse cx={-50 + step} cy={-10} rx={56} ry={22} fill="#222" />
          <ellipse cx={50 - step} cy={-10} rx={56} ry={22} fill="#222" />
        </>
      )}
    </g>
  );
};

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
