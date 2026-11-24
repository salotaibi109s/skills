import { loadFont as loadRuqaa } from "@remotion/google-fonts/ArefRuqaa";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import data from "../data/joanna4-timeline.json";
import mouthData from "../data/joanna4-mouth.json";
import { createSound } from "../components/Sound";
import { findScene, type TimelineData } from "../lib/timing";
import { db } from "../theme";
import { Backpack, Kid, Teacher, type KidProps } from "./chars";
import { blinkAt, Cam, Classmates, Classroom, Desk, ease, Flash, FONT, SchoolYard, Shot, Svg } from "./Joanna";

const HAND = loadRuqaa("normal", { weights: ["400", "700"], subsets: ["arabic"] }).fontFamily;
const T = data as TimelineData;
const MOUTH = mouthData as Record<string, number[]>;
const { Sfx } = createSound(T, "audio/joanna4", {
  whoosh: db(-14),
  pop: db(-12),
  boing: db(-11),
  steps: db(-14),
  sparkle: db(-12),
  tada: db(-11),
  birds: db(-18),
  bell: db(-12),
  swoosh: db(-11),
  drawer: db(-10),
  paper: db(-9),
  mystery: db(-11),
  gasp: db(-10),
  book: db(-7),
  creepy: db(-14),
  tick: db(-12),
  envelope: db(-9),
  win: db(-10),
  yay: db(-11),
  hug: db(-11),
  suspense: db(-9),
});

const line = (id: string) => findScene(T, id);
const at = (id: string) => line(id).from + line(id).voFrom;
const endOf = (id: string) => line(id).from + line(id).words[line(id).words.length - 1].end;
const talkOf = (who: "J" | "F" | "T", f: number) => {
  for (const s of T.scenes) {
    if (!s.id.endsWith(`-${who}`)) continue;
    const env = MOUTH[s.id];
    const i = f - (s.from + s.voFrom);
    if (env && i >= 0 && i < env.length) return Math.min(1, env[i] * 1.15) * (0.75 + 0.25 * Math.abs(Math.sin(f * 1.7)));
  }
  return 0;
};

/** Joanna from episode 4 on: same design, now with pink prescription glasses. */
const Jo: React.FC<Omit<KidProps, "who" | "s"> & { s?: number; f: number }> = ({ f, s = 0.55, ...p }) => <Kid s={s} who="joanna" glasses="pink" talk={talkOf("J", f)} blink={p.blink ?? blinkAt(f, 1)} {...p} />;
const Sara: React.FC<Omit<KidProps, "who" | "s"> & { s?: number; f: number }> = ({ f, s = 0.55, ...p }) => <Kid s={s} who="friend" talk={talkOf("F", f)} blink={p.blink ?? blinkAt(f, 2)} {...p} />;

/* ---------------------------------------------------------------- library set */

const spineColors = ["#E8414B", "#2F6FD1", "#F5C542", "#4CAF50", "#8E5BD6", "#FF8C2B", "#2BB3B1", "#D9508A"];
const Shelf: React.FC<{ x: number; y: number; w: number; h: number; seed: number; dark?: number }> = ({ x, y, w, h, seed, dark = 0 }) => {
  const rows = 5;
  const rh = h / rows;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#6B4523" />
      <rect x={x + 14} y={y + 14} width={w - 28} height={h - 28} fill="#3E2716" />
      {Array.from({ length: rows }).map((_, r) => {
        let cx = x + 22;
        const books: React.ReactNode[] = [];
        let i = 0;
        while (cx < x + w - 50) {
          const bw = 22 + (((seed * 7 + r * 13 + i * 29) % 5) * 7);
          const bh = rh - 30 - (((seed + r * 3 + i * 5) % 4) * 10);
          books.push(<rect key={i} x={cx} y={y + r * rh + rh - 10 - bh} width={bw} height={bh} rx={3} fill={spineColors[(seed + r * 5 + i * 3) % spineColors.length]} />);
          books.push(<rect key={`h${i}`} x={cx + 4} y={y + r * rh + rh - bh + 6} width={bw - 8} height={6} fill="#fff" opacity={0.35} />);
          cx += bw + 4;
          i++;
        }
        return (
          <g key={r}>
            {books}
            <rect x={x + 10} y={y + r * rh + rh - 12} width={w - 20} height={16} fill="#8B5E34" />
          </g>
        );
      })}
      {dark > 0 && <rect x={x} y={y} width={w} height={h} fill="#000" opacity={dark} />}
    </g>
  );
};

const Clock: React.FC<{ x: number; y: number; r: number; f: number }> = ({ x, y, r, f }) => {
  const sec = (f / 30) * 6;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 16} fill="#8B5E34" />
      <circle r={r} fill="#FFF8E7" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-4} y={-r + 10} width={8} height={i % 3 ? 14 : 26} fill="#3E2716" transform={`rotate(${i * 30})`} />
      ))}
      <rect x={-6} y={-r * 0.5} width={12} height={r * 0.55} rx={6} fill="#3E2716" transform="rotate(300)" />
      <rect x={-4} y={-r * 0.75} width={8} height={r * 0.8} rx={4} fill="#3E2716" transform="rotate(60)" />
      <rect x={-2} y={-r * 0.85} width={4} height={r * 0.95} fill="#E8414B" transform={`rotate(${sec})`} />
      <circle r={12} fill="#E8414B" />
    </g>
  );
};

const Library: React.FC<{ f: number; dim?: number }> = ({ f, dim = 1 }) => (
  <g>
    <defs>
      <linearGradient id="libwall" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#2E5560" />
        <stop offset="100%" stopColor="#1E3A42" />
      </linearGradient>
      <linearGradient id="libfloor" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#8A5A34" />
        <stop offset="100%" stopColor="#5E3A1E" />
      </linearGradient>
      <linearGradient id="libbeam" x1="0" x2="0.4" y1="0" y2="1">
        <stop offset="0%" stopColor="#FFE9B0" stopOpacity={0.5} />
        <stop offset="100%" stopColor="#FFE9B0" stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect x={-1600} y={-800} width={4400} height={2200} fill="url(#libwall)" />
    <rect x={-1600} y={1300} width={4400} height={1400} fill="url(#libfloor)" />
    <rect x={-1600} y={1290} width={4400} height={20} fill="#3E2716" />
    <Shelf x={-1400} y={160} w={520} h={1140} seed={1} />
    <Shelf x={-820} y={160} w={520} h={1140} seed={4} />
    <Shelf x={-240} y={160} w={520} h={1140} seed={7} />
    <g>
      <rect x={360} y={220} width={300} height={520} rx={150} fill="#9FD8F7" stroke="#6B4523" strokeWidth={16} />
      <line x1={510} y1={220} x2={510} y2={740} stroke="#6B4523" strokeWidth={10} />
    </g>
    <Clock x={900} y={700} r={140} f={f} />
    <Shelf x={1140} y={160} w={520} h={1140} seed={9} />
    <Shelf x={1720} y={160} w={520} h={1140} seed={12} />
    {/* reading table */}
    <rect x={240} y={1180} width={560} height={36} rx={10} fill="#C48A4C" />
    <rect x={270} y={1216} width={30} height={200} fill="#8B5E34" />
    <rect x={740} y={1216} width={30} height={200} fill="#8B5E34" />
    <path d="M360 230 L-200 1700 L700 1700 L660 740Z" fill="url(#libbeam)" opacity={0.55 + 0.1 * Math.sin(f / 25)} />
    {Array.from({ length: 18 }).map((_, i) => (
      <circle key={i} cx={420 + ((i * 97 + f * (0.3 + (i % 3) * 0.1)) % 380) - i * 12} cy={500 + ((i * 131 + f * 0.6) % 900)} r={3 + (i % 3)} fill="#FFF3C4" opacity={0.5} />
    ))}
    <rect x={-1600} y={-800} width={4400} height={3500} fill="#0B1A26" opacity={0.25 * dim} />
  </g>
);

const OpenBook: React.FC<{ x: number; y: number; s: number; note?: number }> = ({ x, y, s, note = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-220 0 Q-110 -40 0 -10 Q110 -40 220 0 L220 40 Q110 10 0 40 Q-110 10 -220 40Z" fill="#B23A48" />
    <path d="M-210 -6 Q-110 -44 -4 -14 L-4 30 Q-110 0 -210 30Z" fill="#FFF8E7" />
    <path d="M4 -14 Q110 -44 210 -6 L210 30 Q110 0 4 30Z" fill="#FFF3DC" />
    {[0, 1, 2].map((i) => (
      <line key={i} x1={-180} x2={-40} y1={-6 + i * 12} y2={-14 + i * 12} stroke="#C9B89A" strokeWidth={3} />
    ))}
    {note > 0 && <rect x={40} y={-40} width={130} height={60} rx={6} fill="#FFFFFF" stroke="#E0558F" strokeWidth={5} transform="rotate(-8 100 -10)" opacity={note} />}
  </g>
);

const Envelope: React.FC<{ x: number; y: number; s: number; open?: number }> = ({ x, y, s, open = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-80} width={240} height={160} rx={12} fill="#FF86B8" stroke="#D9508A" strokeWidth={6} />
    <path d={`M-120 -80 L0 ${10 - open * 160} L120 -80`} fill="#FF6FA8" stroke="#D9508A" strokeWidth={6} strokeLinejoin="round" />
    <path d="M-120 80 L-20 0 M120 80 L20 0" stroke="#D9508A" strokeWidth={5} />
    <circle cx={0} cy={0} r={18} fill="#FFD23F" />
  </g>
);

/** A note shown full screen (inserted in the edit), revealed line by line. */
const NoteInsert: React.FC<{ l: number; lines: string[]; paper?: string; ink?: string; deco?: React.ReactNode; size?: number }> = ({ l, lines, paper = "#FFFBF0", ink = "#3A2414", deco, size = 76 }) => {
  const k = spring({ frame: l, fps: 30, config: { stiffness: 120, damping: 15 } });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(80% 60% at 50% 50%, #3B2A22 0%, #120C0A 100%)" }}>
      <div style={{ position: "absolute", left: 110, right: 150, top: 470, minHeight: 820, background: paper, borderRadius: 18, boxShadow: "0 40px 90px rgba(0,0,0,0.55)", rotate: `${(1 - k) * -8 - 1.5}deg`, scale: String(0.7 + 0.3 * k), padding: "70px 56px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
        {deco}
        {lines.map((t, i) => {
          const o = ease(l, 6 + i * 9, 16 + i * 9);
          return (
            <div key={i} dir="rtl" style={{ fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1.35, color: ink, textAlign: "center", opacity: o, translate: `0px ${(1 - o) * 14}px` }}>
              {t}
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(60% 45% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- scenes */

const Scene1: React.FC = () => {
  const j1 = at("P01-J");
  const s2 = line("P02-F").from;
  return (
    <>
      <Shot from={0} to={80}>
        {(f, l) => (
          <Svg>
            <Cam fx={540} fy={interpolate(ease(l, 0, 80), [0, 1], [560, 820])} z={interpolate(ease(l, 0, 80), [0, 1], [0.8, 1.5])}>
              <SchoolYard f={f} />
            </Cam>
          </Svg>
        )}
      </Shot>
      <Shot from={80} to={170}>
        {(f, l) => {
          const k = ease(l, 0, 50);
          const seated = l > 62;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={1060} z={1.45}>
                  <Classroom f={f} />
                  <Classmates f={f} y={1300} />
                  {seated ? (
                    <>
                      <Jo f={f} x={540} y={1560} seated expr="smile" look={[0, 0.6]} />
                      <Desk x={540} y={1480} s={1.0} />
                      <Backpack x={260} y={1700} s={0.42} />
                    </>
                  ) : (
                    <>
                      <Desk x={540} y={1480} s={1.0} />
                      <Jo f={f} x={interpolate(k, [0, 1], [-200, 380])} y={1740} bag={l < 50} walk={l < 50 ? l / 4 : undefined} expr="happy" look={[0.4, 0]} armR={l >= 50 ? { target: [-140, -300] } : {}} />
                      {l >= 50 && <Backpack x={260} y={1700} s={0.42} />}
                    </>
                  )}
                </Cam>
              </Svg>
              {l < 8 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={170} to={222}>
        {(f, l) => {
          const glow = ease(l, 10, 30);
          return (
            <Svg>
              <Cam fx={540} fy={1380} z={2.4}>
                <Classroom f={f} />
                <Jo f={f} x={540} y={1560} seated expr={l > 20 ? "shock" : "smile"} look={[0, 1]} armR={{ target: [80, -250] }} armL={{ target: [-60, -250] }} />
                <Desk x={540} y={1480} s={1.0} />
                <rect x={430} y={1500 + ease(l, 0, 10) * 30} width={220} height={60} rx={6} fill="#9C6B3A" />
                <rect x={470} y={1490 + ease(l, 0, 10) * 30} width={90} height={40} rx={4} fill="#fff" stroke="#E0558F" strokeWidth={3} transform={`rotate(-6 515 ${1510 + ease(l, 0, 10) * 30})`} />
                <circle cx={515} cy={1510 + ease(l, 0, 10) * 30} r={90 * glow} fill="#FFF3C4" opacity={0.35 * glow} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Shot from={222} to={j1 - 6}>
        {(_f, l) => <NoteInsert l={l} lines={["جوانا…", "إذا تبغين تعرفين سرّ الفصل،", "تعالي عند المكتبة وقت الفسحة…", "ولا تخبرين أحد!"]} size={62} />}
      </Shot>
      <Shot from={j1 - 6} to={s2}>
        {(f, l) => {
          const z = 2.3 + spring({ frame: l, fps: 30, config: { stiffness: 200, damping: 14 } }) * 0.5;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={1150} z={z}>
                  <Classroom f={f} />
                  <Jo f={f} x={540} y={1560} seated expr="shock" look={[Math.sin(l / 12) * 0.8, 0]} armR={{ target: [140, -380] }} armL={{ target: [-120, -380] }} />
                  <Desk x={540} y={1480} s={1.0} />
                  <rect x={480} y={1310} width={120} height={80} rx={6} fill="#FFFBF0" stroke="#E0558F" strokeWidth={3} />
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: "radial-gradient(70% 50% at 50% 45%, transparent 45%, rgba(20,10,40,0.45) 100%)" }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="birds" at={0} />
      <Sfx name="whoosh" at={78} />
      <Sfx name="steps" at={84} />
      <Sfx name="drawer" at={172} />
      <Sfx name="mystery" at={190} />
      <Sfx name="paper" at={224} />
      <Sfx name="gasp" at={j1 - 6} />
    </>
  );
};

const Scene2: React.FC = () => {
  const s2 = line("P02-F").from;
  const s3 = line("P03-J").from;
  const s4 = line("P04-F").from;
  const s5 = line("P05-J").from;
  const e5 = endOf("P05-J");
  const s6 = line("P06-F").from;
  const pocket = e5 - 2;
  return (
    <>
      <Shot from={s2} to={s5}>
        {(f, l) => {
          const k = ease(l, 0, 24);
          const who = f < s3 ? "F" : f < s4 ? "J" : "F";
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={who === "J" ? 520 : 660} fy={1120} z={1.75}>
                  <Classroom f={f} />
                  <Jo f={f} x={470} y={1560} seated expr={who === "J" ? "worry" : "shock"} look={[0.8, -0.5]} armR={{ target: [140, -380] }} sweat={1} />
                  <Desk x={470} y={1480} s={1.0} />
                  <Sara f={f} x={interpolate(k, [0, 1], [1200, 830])} y={1690} walk={l < 24 ? l / 4 : undefined} expr={f >= s4 ? "worry" : "smile"} look={[-0.8, 0.3]} tilt={-5} armL={f >= s4 ? { a: 40, b: 120 } : { a: 14, b: 8 }} />
                </Cam>
              </Svg>
              {l < 6 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={s5} to={s6}>
        {(f, l) => {
          const up = spring({ frame: l - 2, fps: 30, config: { stiffness: 200, damping: 12 } });
          const hide = ease(f, pocket, pocket + 12);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={520} fy={1080 - up * 30} z={1.9}>
                  <Classroom f={f} />
                  <Jo f={f} x={520} y={1740} expr="proud" look={[0, 0]} tilt={-5} armL={{ a: 20, b: 60 }} armR={hide > 0 ? { target: [interpolate(hide, [0, 1], [250, 70]), interpolate(hide, [0, 1], [-640, -340])] } : { target: [250, -640] }} />
                  {hide < 1 && <rect x={520 + 0.55 * interpolate(hide, [0, 1], [250, 70]) - 30} y={1740 - 0.55 * interpolate(hide, [0, 1], [640, 340]) - 20} width={60} height={40} rx={5} fill="#FFFBF0" stroke="#E0558F" strokeWidth={3} />}
                  {up > 0.5 &&
                    [0, 1, 2, 3].map((i) => (
                      <path key={i} d="M0 -20 L5 -5 L20 0 L5 5 L0 20 L-5 5 L-20 0 L-5 -5Z" fill="#FFD23F" transform={`translate(${520 + Math.cos(i * 1.6 + l / 10) * 190} ${1260 + Math.sin(i * 1.6 + l / 10) * 140}) scale(${0.8 + 0.3 * Math.sin(l / 4 + i)})`} />
                    ))}
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(255,214,90,${0.18 * up}) 0%, transparent 40%)` }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="steps" at={s2} gain={0.7} />
      <Sfx name="pop" at={s5 + 2} />
      <Sfx name="sparkle" at={s5 + 6} />
      <Sfx name="whoosh" at={pocket} gain={0.6} />
    </>
  );
};

const Scene3: React.FC = () => {
  const s6 = line("P06-F").from;
  const f6 = at("P06-F");
  const s7 = line("P07-J").from;
  const s8 = line("P08-J").from;
  const drop = f6 - 50;
  return (
    <>
      <Shot from={s6} to={s6 + 20}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={540} fy={900} z={1.1}>
                <SchoolYard f={f} />
              </Cam>
            </Svg>
            <AbsoluteFill style={{ background: `repeating-radial-gradient(circle at 50% 40%, rgba(255,214,90,0) 0 50px, rgba(255,214,90,${0.3 * (1 - l / 20)}) 50px 70px)` }} />
          </AbsoluteFill>
        )}
      </Shot>
      {/* tracking between the shelves */}
      <Shot from={s6 + 20} to={drop + 6}>
        {(f, l) => {
          const camx = interpolate(l, [0, drop - s6 - 14], [-700, 200], { extrapolateRight: "clamp" });
          return (
            <Svg>
              <Cam fx={camx} fy={1050} z={1.3}>
                <Library f={f} />
                <Sara f={f} x={camx - 260} y={1660} walk={l / 4.5} expr="worry" look={[0.8, 0]} armL={{ a: 20, b: 60 }} />
                <Jo f={f} x={camx + 40} y={1680} walk={l / 4.5 + 1} expr="sly" look={[0.8, -0.2]} />
                <g transform={`translate(${camx * 0.4} 0)`}>
                  <rect x={-200 + ((l * 6) % 1400)} y={-300} width={160} height={2400} fill="#1A0F08" opacity={0.85} />
                </g>
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* the book falls */}
      <Shot from={drop + 6} to={s7}>
        {(f, l) => {
          const fall = ease(l, 0, 10);
          const scared = l > 14;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={scared ? 260 : -220} fy={scared ? 1220 : 1250} z={scared ? 1.7 : 2.0}>
                  <Library f={f} />
                  <g transform={`translate(-240 ${interpolate(fall, [0, 1], [700, 1270])}) rotate(${fall * 200})`}>
                    <rect x={-60} y={-20} width={120} height={40} rx={4} fill="#2F6FD1" />
                  </g>
                  <Sara f={f} x={140} y={1660} expr="shock" look={[-1, 0]} armL={{ a: 120, b: 170 }} armR={{ a: 120, b: 170 }} sweat={scared ? 1 : 0} tilt={Math.sin(l / 2) * 2} />
                  <Jo f={f} x={420} y={1680} expr={scared ? "worry" : "shock"} look={[-1, 0]} />
                </Cam>
              </Svg>
              {l < 5 && <AbsoluteFill style={{ background: "#fff", opacity: 0.3 * (1 - l / 5) }} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={s7} to={s8}>
        {(f, l) => (
          <Svg>
            <Cam fx={interpolate(ease(l, 40, 96), [0, 1], [300, 460])} fy={1180} z={1.75}>
              <Library f={f} />
              <Sara f={f} x={interpolate(ease(l, 40, 96), [0, 1], [140, 300])} y={1660} walk={l > 40 ? l / 5 : undefined} expr="worry" look={[1, 0]} armL={{ a: 30, b: 80 }} />
              <Jo f={f} x={interpolate(ease(l, 40, 96), [0, 1], [420, 620])} y={1680} walk={l > 40 ? l / 5 + 1 : undefined} expr="smile" look={[-0.8, 0]} armL={l < 40 ? { target: [-260, -480] } : {}} />
            </Cam>
          </Svg>
        )}
      </Shot>
      <Sfx name="bell" at={s6} />
      <Sfx name="whoosh" at={s6 + 18} />
      <Sfx name="creepy" at={s6 + 24} />
      <Sfx name="steps" at={s6 + 30} gain={0.5} />
      <Sfx name="book" at={drop + 14} />
      <Sfx name="boing" at={drop + 20} gain={0.6} />
    </>
  );
};

const Scene4: React.FC = () => {
  const s8 = line("P08-J").from;
  const j8 = at("P08-J");
  const s9 = line("P09-T").from;
  const t9 = at("P09-T");
  const s10 = line("P10-J").from;
  const s11 = line("P11-J").from;
  const noteAt = s8 + 50;
  const cardAt = t9 - 80;
  const teacherOut = t9 - 24;
  return (
    <>
      <Shot from={s8} to={noteAt}>
        {(f, l) => (
          <Svg>
            <Cam fx={520} fy={interpolate(ease(l, 0, 50), [0, 1], [1100, 1180])} z={interpolate(ease(l, 0, 50), [0, 1], [1.7, 2.6])}>
              <Library f={f} />
              <Jo f={f} x={600} y={1680} expr="smile" look={[-0.4, 0.8]} armR={{ target: [-150, -420] }} />
              <OpenBook x={470} y={1170} s={0.7} />
            </Cam>
          </Svg>
        )}
      </Shot>
      <Shot from={noteAt} to={j8 - 6}>
        {(_f, l) => <NoteInsert l={l} lines={["انظري خلف الساعة!"]} size={96} deco={<div style={{ textAlign: "center", fontSize: 120, lineHeight: 1 }}>🕰️</div>} />}
      </Shot>
      <Shot from={j8 - 6} to={s9 + 30}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={600} fy={1170} z={2.5 + l * 0.002}>
                <Library f={f} />
                <Jo f={f} x={600} y={1680} expr="happy" look={[0.6, -0.6]} armL={{ a: 130, b: 170 }} armR={{ a: 130, b: 170 }} />
              </Cam>
            </Svg>
            <AbsoluteFill style={{ background: "radial-gradient(60% 40% at 50% 40%, rgba(255,240,190,0.25) 0%, transparent 70%)" }} />
          </AbsoluteFill>
        )}
      </Shot>
      {/* behind the clock: climbs the library step stool */}
      <Shot from={s9 + 30} to={cardAt}>
        {(f, l) => {
          const walk = ease(l, 0, 26);
          const climb = ease(l, 26, 34);
          const reach = ease(l, 36, 50);
          const pull = ease(l, 54, 68);
          const openE = ease(l, 72, 86);
          const jx = interpolate(walk, [0, 1], [600, 880]);
          const jy = 1680 - climb * 300 - reach * 20;
          const hand: [number, number] = pull > 0 ? [interpolate(pull, [0, 1], [60, 100]), interpolate(pull, [0, 1], [-840, -470])] : [60, interpolate(reach, [0, 1], [-500, -840])];
          return (
            <Svg>
              <Cam fx={860} fy={interpolate(walk, [0, 1], [1150, 1000])} z={1.5}>
                <Library f={f} />
                <g>
                  <rect x={790} y={1380} width={190} height={26} rx={8} fill="#C48A4C" />
                  <rect x={800} y={1406} width={24} height={274} fill="#8B5E34" />
                  <rect x={946} y={1406} width={24} height={274} fill="#8B5E34" />
                  <rect x={810} y={1540} width={150} height={18} fill="#A8743E" />
                </g>
                <Jo f={f} x={jx} y={jy} walk={walk < 1 ? l / 4 : undefined} expr={pull > 0 ? "happy" : "smile"} look={[0.2, -1]} armR={reach > 0 || pull > 0 ? { target: hand } : {}} armL={pull >= 1 ? { target: [-60, -470] } : {}} />
                {pull > 0 && <Envelope x={jx + 0.55 * hand[0]} y={jy + 0.55 * hand[1]} s={0.32} open={openE} />}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Shot from={cardAt} to={teacherOut}>
        {(_f, l) => (
          <NoteInsert
            l={l}
            paper="#FFF1F7"
            ink="#B8336A"
            size={64}
            lines={["مبروك يا جوانا!", "تم اختيارك لتكوني قائدة فريق المدرسة", "في مسابقة المواهب!"]}
            deco={<div style={{ textAlign: "center", fontSize: 130, lineHeight: 1 }}>🏆</div>}
          />
        )}
      </Shot>
      {/* the teacher steps out */}
      <Shot from={teacherOut} to={s10}>
        {(f, l) => {
          const out = ease(l, 0, 20);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={1060} fy={900} z={1.35}>
                  <Library f={f} dim={0.3} />
                  <Teacher x={interpolate(out, [0, 1], [1400, 1200])} y={1700} s={0.72} walk={out < 1 ? l / 4 : undefined} expr="happy" talk={talkOf("T", f)} blink={blinkAt(f, 5)} look={[-0.8, 0.4]} tilt={-5} armL={{ a: 50, b: 90 }} />
                  <Shelf x={1440} y={160} w={520} h={1140} seed={12} />
                  <Jo f={f} x={860} y={1680} expr="shock" look={[1, -0.4]} armR={{ target: [100, -470] }} armL={{ target: [-60, -470] }} />
                  <Envelope x={860 + 0.55 * 20} y={1680 - 0.55 * 470} s={0.32} open={1} />
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: "radial-gradient(50% 35% at 60% 40%, rgba(255,236,180,0.3) 0%, transparent 70%)" }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* jump for joy */}
      <Shot from={s10} to={s11}>
        {(f, l) => {
          const jump = Math.abs(Math.sin((l / 16) * Math.PI)) * (l < 48 ? 1 : 0);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={760} fy={1050} z={1.5}>
                  <Library f={f} dim={0.2} />
                  <Teacher x={1080} y={1700} s={0.72} expr="happy" blink={blinkAt(f, 5)} look={[-0.8, 0.4]} tilt={-5} armL={{ a: 50, b: 140 }} />
                  <Jo f={f} x={760} y={1680 - jump * 120} expr="laugh" armL={{ a: 150 + Math.sin(l / 3) * 12, b: 170 }} armR={{ a: 150 + Math.sin(l / 3 + 1) * 12, b: 170 }} />
                  <Sara f={f} x={430} y={1660} expr="happy" look={[1, -0.3]} armL={{ a: 140, b: 170 }} armR={{ a: 140, b: 170 }} />
                  {Array.from({ length: 28 }).map((_, i) => {
                    const p = (l * (3 + (i % 4)) + i * 47) % 900;
                    return <rect key={i} x={300 + ((i * 113) % 900)} y={500 + p} width={18} height={10} fill={["#FF6FA8", "#FFD23F", "#2F6FD1", "#4CAF50", "#8E5BD6"][i % 5]} transform={`rotate(${p * 2 + i * 20} ${300 + ((i * 113) % 900)} ${500 + p})`} />;
                  })}
                </Cam>
              </Svg>
              {l < 6 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="tada" at={s8 + 2} gain={0.5} />
      <Sfx name="paper" at={noteAt} />
      <Sfx name="gasp" at={noteAt + 30} gain={0.8} />
      <Sfx name="tick" at={s9 + 30} />
      <Sfx name="steps" at={s9 + 30} gain={0.6} />
      <Sfx name="envelope" at={s9 + 30 + 52} />
      <Sfx name="win" at={cardAt + 4} />
      <Sfx name="steps" at={teacherOut} gain={0.6} />
      <Sfx name="sparkle" at={teacherOut + 4} />
      <Sfx name="yay" at={s10 + 4} />
    </>
  );
};

const Scene5: React.FC = () => {
  const s11 = line("P11-J").from;
  const j11 = at("P11-J");
  const e11 = endOf("P11-J");
  const notice = s11 + 60;
  const noteAt = s11 + 92;
  const endCard = e11 + 8;
  return (
    <>
      <Shot from={s11} to={noteAt}>
        {(f, l) => {
          const fallK = ease(f, notice, notice + 22);
          return (
            <Svg>
              <Cam fx={620} fy={1080} z={1.6}>
                <Library f={f} dim={0.2} />
                <Teacher x={1060} y={1700} s={0.72} expr="happy" blink={blinkAt(f, 5)} look={[-0.8, 0.4]} tilt={-5} armL={{ a: 30, b: 60 }} />
                <Sara f={f} x={430} y={1660} expr="happy" look={[1, 0]} tilt={6} armR={{ target: [380, -560] }} />
                <Jo f={f} x={640} y={1680} expr={f > notice + 10 ? "shock" : "laugh"} look={f > notice ? [0, 1] : [-0.6, 0]} tilt={f > notice ? 0 : -6} armL={{ target: [-380, -560] }} armR={{ target: [140, -560] }} />
                {fallK > 0 && <rect x={640 + 60} y={interpolate(fallK, [0, 1], [1360, 1650])} width={50} height={34} rx={4} fill="#FFFBF0" stroke="#E0558F" strokeWidth={3} transform={`rotate(${fallK * 80} 725 ${interpolate(fallK, [0, 1], [1377, 1667])})`} />}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Shot from={noteAt} to={j11 - 4}>
        {(_f, l) => <NoteInsert l={l} paper="#F4F0FF" ink="#3B2A6B" size={70} lines={["المهمة القادمة أصعب…", "هل أنتِ مستعدة؟"]} />}
      </Shot>
      <Shot from={j11 - 4} to={endCard}>
        {(f, l) => {
          const push = ease(l, 50, l + 1 > 90 ? 90 : 90);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={640} fy={interpolate(push, [0, 1], [1150, 1240])} z={interpolate(push, [0, 1], [2.6, 5.2])}>
                  <Library f={f} dim={0.6} />
                  <Jo f={f} x={640} y={1680} expr="shock" look={[0, 0]} armR={{ target: [140, -560] }} sweat={1} />
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 45%, transparent 35%, rgba(10,5,30,${0.35 + 0.35 * push}) 100%)` }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={endCard} to={2160}>
        {(_f, l) => {
          const k = spring({ frame: l, fps: 30, config: { stiffness: 180, damping: 12 } });
          return (
            <AbsoluteFill style={{ background: "radial-gradient(80% 60% at 50% 45%, #3B2A6B 0%, #120A24 100%)" }}>
              <div dir="rtl" style={{ position: "absolute", top: 620, left: 80, right: 130, textAlign: "center", fontFamily: FONT, color: "#fff", scale: String(k) }}>
                <div style={{ fontWeight: 800, fontSize: 130, lineHeight: 1.1, color: "#FF86B8", textShadow: "0 8px 0 #8E2E5E" }}>يتبع…</div>
                <div style={{ marginTop: 26, fontWeight: 700, fontSize: 64, lineHeight: 1.35 }}>مغامرة جديدة في الحلقة القادمة!</div>
              </div>
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="hug" at={s11 + 4} />
      <Sfx name="paper" at={notice} gain={0.7} />
      <Sfx name="mystery" at={noteAt} />
      <Sfx name="suspense" at={j11 + 40} />
      <Sfx name="swoosh" at={endCard} />
    </>
  );
};

const OpeningTitle: React.FC = () => {
  const f = useCurrentFrame();
  const k = spring({ frame: f - 6, fps: 30, config: { stiffness: 160, damping: 12 } });
  const out = interpolate(f, [64, 76], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (f > 78) return null;
  return (
    <div dir="rtl" style={{ position: "absolute", top: 230, left: 90, right: 140, textAlign: "center", fontFamily: FONT, color: "#fff", opacity: out, scale: String(0.6 + 0.4 * k), background: "rgba(255,111,168,0.95)", borderRadius: 48, padding: "18px 10px 26px", boxShadow: "0 16px 40px rgba(194,64,122,0.35)" }}>
      <div style={{ fontWeight: 800, fontSize: 112, lineHeight: 1.1, textShadow: "0 6px 0 #C2407A" }}>يوميات جوانا</div>
      <div style={{ marginTop: 10, display: "inline-block", padding: "4px 30px", borderRadius: 40, background: "#fff", color: "#D9508A", fontWeight: 700, fontSize: 46 }}>الحلقة ٤: سرّ الرسالة المجهولة</div>
    </div>
  );
};

/** «يوميات جوانا» — Episode 4: the anonymous letter (mystery; Joanna now wears pink glasses). */
export const JoannaEp4: React.FC = () => (
  <AbsoluteFill style={{ background: "#1E3A42" }}>
    <Scene1 />
    <Scene2 />
    <Scene3 />
    <Scene4 />
    <Scene5 />
    <OpeningTitle />
    {T.scenes.map((s) => (
      <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/joanna4/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />
    ))}
    <Audio
      src={staticFile("audio/joanna4/music/theme.mp3")}
      volume={(f) => {
        const inVoice = T.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 6);
        const fd = interpolate(f, [0, 6, 2130, 2160], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (inVoice ? db(-22) : db(-15)) * fd;
      }}
    />
  </AbsoluteFill>
);
