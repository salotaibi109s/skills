import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import data from "../data/joanna5-timeline.json";
import mouthData from "../data/joanna5-mouth.json";
import { createSound } from "../components/Sound";
import { findScene, type TimelineData } from "../lib/timing";
import { db } from "../theme";
import { Kid, Teacher, type KidProps } from "./chars";
import { Envelope, NoteInsert } from "./Ep4";
import { blinkAt, Cam, Classmates, Classroom, Desk, ease, Flash, FONT, Shot, Svg } from "./Joanna";

const T = data as TimelineData;
const MOUTH = mouthData as Record<string, number[]>;
const { Sfx } = createSound(T, "audio/joanna5", {
  whoosh: db(-14),
  pop: db(-12),
  boing: db(-11),
  steps: db(-14),
  sparkle: db(-12),
  tada: db(-11),
  bell: db(-12),
  swoosh: db(-11),
  paper: db(-9),
  mystery: db(-11),
  gasp: db(-10),
  creepy: db(-14),
  envelope: db(-9),
  suspense: db(-9),
  laugh: db(-12),
  giggle: db(-10),
  scratch: db(-10),
  tiptoe: db(-12),
  yay: db(-11),
  hug: db(-11),
  drawer: db(-9),
  tick: db(-13),
});

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

type P = Omit<KidProps, "who" | "s"> & { s?: number; f: number };
const Jo: React.FC<P> = ({ f, s = 0.55, ...p }) => <Kid s={s} who="joanna" glasses="pink" talk={talkOf("J", f)} blink={p.blink ?? blinkAt(f, 1)} {...p} />;
const Sara: React.FC<P> = ({ f, s = 0.55, ...p }) => <Kid s={s} who="friend" talk={talkOf("F", f)} blink={p.blink ?? blinkAt(f, 2)} {...p} />;
const Layan: React.FC<P> = ({ f, s = 0.55, ...p }) => <Kid s={s} who="layan" hair="#2E1C12" talk={talkOf("L", f)} blink={p.blink ?? blinkAt(f, 3)} {...p} />;
const Mazen: React.FC<P> = ({ f, s = 0.55, ...p }) => <Kid s={s} who="boy" hair="#151010" skinTone="F" phones talk={talkOf("M", f)} blink={p.blink ?? blinkAt(f, 4)} {...p} />;
const Khaled: React.FC<P> = ({ f, s = 0.58, ...p }) => <Kid s={s} who="boy" hair="#5A341C" skinTone="T" talk={talkOf("K", f)} blink={p.blink ?? blinkAt(f, 6)} {...p} />;

/* ---------------------------------------------------------------- sets */

export const Hall: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <defs>
      <linearGradient id="hallwall" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#5B4A8B" />
        <stop offset="100%" stopColor="#3E3266" />
      </linearGradient>
      <linearGradient id="curtain" x1="0" x2="1">
        <stop offset="0%" stopColor="#A3203A" />
        <stop offset="50%" stopColor="#D8394F" />
        <stop offset="100%" stopColor="#A3203A" />
      </linearGradient>
    </defs>
    <rect x={-1400} y={-800} width={3900} height={2200} fill="url(#hallwall)" />
    <rect x={-1400} y={1240} width={3900} height={1400} fill="#B07A48" />
    {Array.from({ length: 30 }).map((_, i) => (
      <rect key={i} x={-1400 + i * 130} y={1240} width={4} height={1400} fill="#8E5E34" opacity={0.5} />
    ))}
    {/* stage */}
    <rect x={-200} y={140} width={1480} height={760} fill="#1F1830" />
    {Array.from({ length: 6 }).map((_, i) => (
      <path key={i} d={`M${-200 + i * 120} 140 q60 380 0 760 h120 q-60 -380 0 -760Z`} fill="url(#curtain)" />
    ))}
    {Array.from({ length: 6 }).map((_, i) => (
      <path key={`r${i}`} d={`M${560 + i * 120} 140 q60 380 0 760 h120 q-60 -380 0 -760Z`} fill="url(#curtain)" />
    ))}
    <rect x={-220} y={110} width={1520} height={60} fill="#7E1528" />
    <rect x={-240} y={900} width={1560} height={70} fill="#6B4523" />
    <path d="M440 240 L640 240 L700 900 L380 900Z" fill="#FFF3C4" opacity={0.12 + 0.04 * Math.sin(f / 20)} />
    {/* string lights */}
    {Array.from({ length: 16 }).map((_, i) => (
      <circle key={i} cx={-160 + i * 92} cy={70 + Math.sin(i * 0.8) * 18} r={12} fill={["#FFD23F", "#FF6FA8", "#7FD3FF", "#8EE07A"][i % 4]} opacity={0.6 + 0.4 * Math.abs(Math.sin(f / 10 + i))} />
    ))}
  </g>
);

export const Storage: React.FC<{ f: number; light?: number }> = ({ f, light = 0.6 }) => (
  <g>
    <rect x={-1400} y={-800} width={3900} height={2200} fill="#3A3530" />
    <rect x={-1400} y={1260} width={3900} height={1400} fill="#5E4A38" />
    {[-260, 560].map((x, k) => (
      <g key={x}>
        <rect x={x} y={220} width={480} height={1040} fill="#6B4523" />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x={x + 10} y={220 + r * 260 + 230} width={460} height={20} fill="#8B5E34" />
            {[0, 1, 2].map((b) => (
              <rect key={b} x={x + 30 + b * 145} y={220 + r * 260 + 120 - ((b + r + k) % 2) * 30} width={120} height={110 + ((b + r + k) % 2) * 30} rx={6} fill={["#C9A26B", "#B88B54", "#D8B77F"][(b + r) % 3]} />
            ))}
          </g>
        ))}
      </g>
    ))}
    {/* costume rack */}
    <rect x={220} y={520} width={8} height={560} fill="#777" />
    <rect x={540} y={520} width={8} height={560} fill="#777" />
    <rect x={220} y={520} width={328} height={8} fill="#777" />
    {["#E8414B", "#8E5BD6", "#FFD23F", "#2BB3B1"].map((c, i) => (
      <path key={c} d={`M${250 + i * 75} 530 l-34 60 l20 240 h60 l20 -240 l-34 -60Z`} fill={c} opacity={0.9} />
    ))}
    {/* star decoration */}
    <polygon points="760,700 790,780 875,780 806,830 832,910 760,862 688,910 714,830 645,780 730,780" fill="#FFD23F" opacity={0.85} transform="rotate(-12 760 800)" />
    <rect x={-1400} y={-800} width={3900} height={3500} fill="#000" opacity={0.45 * (1 - light)} />
    <path d="M540 -200 L180 1700 L900 1700Z" fill="#FFF3C4" opacity={0.1 * light + 0.04 * Math.sin(f / 15)} />
  </g>
);

export const Box: React.FC<{ x: number; y: number; s: number; open?: number; shake?: number; items?: boolean }> = ({ x, y, s, open = 0, shake = 0, items }) => (
  <g transform={`translate(${x + shake} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={240} ry={26} fill="url(#aoShadow)" />
    <rect x={-210} y={-300} width={420} height={300} rx={10} fill="#C9A26B" stroke="#8B6A3E" strokeWidth={8} />
    <rect x={-210} y={-180} width={420} height={30} fill="#B88B54" />
    {items && open > 0 && (
      <g>
        <polygon points="-120,-330 -100,-280 -45,-280 -90,-250 -72,-196 -120,-228 -168,-196 -150,-250 -195,-280 -140,-280" fill="#FFD23F" />
        <circle cx={60} cy={-320} r={40} fill="#FF6FA8" />
        <rect x={120} y={-380} width={30} height={90} rx={6} fill="#7FD3FF" />
      </g>
    )}
    <g transform={`rotate(${-open * 110} -210 -300)`}>
      <rect x={-216} y={-320} width={432} height={34} rx={6} fill="#D8B77F" stroke="#8B6A3E" strokeWidth={6} />
    </g>
  </g>
);

export const Chair: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-520} width={220} height={260} rx={30} fill="#E8414B" />
    <rect x={-120} y={-270} width={240} height={40} rx={14} fill="#C92F3F" />
    <rect x={-100} y={-230} width={20} height={230} fill="#555" />
    <rect x={80} y={-230} width={20} height={230} fill="#555" />
  </g>
);

export const MeetingTable: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-60} y={1380} width={1200} height={44} rx={14} fill="#C48A4C" />
    <rect x={-60} y={1380} width={1200} height={12} rx={6} fill="#F3C993" />
    <rect x={-20} y={1424} width={1120} height={240} fill="#9C6B3A" />
    {/* papers, colours, a drum and a keyboard */}
    <rect x={40} y={1352} width={150} height={34} rx={4} fill="#fff" transform="rotate(-6 115 1369)" />
    {["#E8414B", "#2F6FD1", "#4CAF50", "#FFD23F"].map((c, i) => (
      <rect key={c} x={210 + i * 16} y={1340} width={10} height={44} rx={4} fill={c} transform={`rotate(${-20 + i * 12} ${215 + i * 16} 1362)`} />
    ))}
    <ellipse cx={860} cy={1360} rx={70} ry={20} fill="#E8E2D4" stroke="#8B5E34" strokeWidth={6} />
    <rect x={790} y={1360} width={140} height={30} fill="#D8394F" />
    <g transform={`translate(${880 + Math.sin(f / 3) * 2} 1330) rotate(-30)`}>
      <rect x={-4} y={-50} width={8} height={60} rx={3} fill="#8B5E34" />
    </g>
    <rect x={560} y={1350} width={180} height={36} rx={6} fill="#222" />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={566 + i * 19} y={1354} width={15} height={26} rx={2} fill="#fff" />
    ))}
  </g>
);

/* ---------------------------------------------------------------- scenes */

const Scene1: React.FC = () => {
  const t1 = at("Q01-T");
  const s2 = line("Q02-J").from;
  const s3 = line("Q03-F").from;
  const s4 = line("Q04-J").from;
  const s5 = line("Q05-J").from;
  return (
    <>
      <Shot from={0} to={s2}>
        {(f, l) => {
          const k = ease(l, 0, 30);
          return (
            <Svg>
              <Cam fx={560} fy={900} z={1.2}>
                <Classroom f={f} board="مسابقة المواهب الكبرى" />
                <Teacher x={interpolate(k, [0, 1], [1300, 760])} y={1420} s={0.72} walk={k < 1 ? l / 4 : undefined} expr="happy" talk={talkOf("T", f)} blink={blinkAt(f, 5)} look={[-0.5, 0.3]} armL={{ target: [-200, -820] }} armR={{ target: [200, -820] }} />
                <g transform={`translate(${interpolate(k, [0, 1], [1300, 760])} ${1420 - 0.72 * 900})`}>
                  <rect x={-200} y={-150} width={400} height={240} rx={20} fill="#FFF" stroke="#FF6FA8" strokeWidth={10} />
                  <text x={0} y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={58} fill="#D9508A">مسابقة</text>
                  <text x={0} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={58} fill="#2F6FD1">المواهب ⭐</text>
                </g>
                <Classmates f={f} y={1300} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Shot from={s2} to={s3}>
        {(f, l) => {
          const up = spring({ frame: l - 2, fps: 30, config: { stiffness: 220, damping: 11 } });
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={400} fy={1080} z={1.8}>
                  <Classroom f={f} />
                  <Jo f={f} x={400} y={1760 - up * 40} expr="happy" look={[0.6, -0.3]} armR={{ a: 40 + up * 100, b: 40 + up * 130 }} armL={{ a: 20, b: 40 }} />
                </Cam>
              </Svg>
              {l < 6 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={s3} to={s5}>
        {(f) => {
          const jt = f >= s4;
          return (
            <Svg>
              <Cam fx={jt ? 420 : 620} fy={1160} z={1.75}>
                <Classroom f={f} />
                <Jo f={f} x={330} y={1760} expr={jt ? "proud" : "happy"} look={jt ? [0, 0] : [0.8, 0]} tilt={jt ? -5 : 0} armR={jt ? { target: [200, -700] } : {}} armL={jt ? { a: 20, b: 60 } : {}} />
                <Sara f={f} x={780} y={1500} seated expr="smile" look={[-0.8, -0.3]} />
                <Desk x={780} y={1420} s={0.75} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Sfx name="steps" at={2} gain={0.7} />
      <Sfx name="tada" at={t1 + 20} gain={0.6} />
      <Sfx name="yay" at={s2 + 2} />
      <Sfx name="pop" at={s4} />
      <Sfx name="swoosh" at={endOf("Q04-J") + 4} />
    </>
  );
};

const Scene2: React.FC = () => {
  const s5 = line("Q05-J").from;
  const s6 = line("Q06-L").from;
  const s7 = line("Q07-M").from;
  const s8 = line("Q08-J").from;
  const s9 = line("Q09-F").from;
  const s10 = line("Q10-F").from;
  const team = (f: number, opts: { jLook?: [number, number] } = {}) => (
    <>
      <Layan f={f} x={140} y={1520} seated expr="smile" look={[0.6, 0.3]} armR={{ target: [120, -260 + Math.sin(f / 5) * 10] }} />
      <Jo f={f} x={340} y={1520} seated expr="happy" look={opts.jLook ?? [0, 0]} armR={{ a: 40 + Math.sin(f / 9) * 15, b: 120 }} />
      <Chair x={560} y={1575} s={0.55} />
      <Sara f={f} x={760} y={1520} seated expr="smile" look={[-0.6, 0]} />
      <Mazen f={f} x={960} y={1520} seated expr="happy" look={[-0.7, 0]} armR={{ target: [-120, -240 + Math.abs(Math.sin(f / 4)) * -30] }} />
    </>
  );
  return (
    <>
      <Shot from={s5} to={s6}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={540} fy={interpolate(ease(l, 0, 60), [0, 1], [900, 1150])} z={interpolate(ease(l, 0, 60), [0, 1], [0.9, 1.15])}>
                <Hall f={f} />
                {team(f)}
                <MeetingTable f={f} />
              </Cam>
            </Svg>
            {l < 8 && <Flash l={l} />}
          </AbsoluteFill>
        )}
      </Shot>
      <Shot from={s6} to={s7}>
        {(f) => (
          <Svg>
            <Cam fx={200} fy={1180} z={2.1}>
              <Hall f={f} />
              {team(f)}
              <MeetingTable f={f} />
              <path d="M70 1290 q20 -30 40 0 q20 30 40 0" stroke="#8E5BD6" strokeWidth={8} fill="none" />
            </Cam>
          </Svg>
        )}
      </Shot>
      <Shot from={s7} to={s8}>
        {(f) => (
          <Svg>
            <Cam fx={900} fy={1180} z={2.1}>
              <Hall f={f} />
              {team(f)}
              <MeetingTable f={f} />
              {[0, 1, 2].map((i) => (
                <text key={i} x={1000 + i * 40} y={1100 - ((f * 3 + i * 40) % 120)} fontSize={50} fill="#FFD23F" opacity={0.8}>
                  ♪
                </text>
              ))}
            </Cam>
          </Svg>
        )}
      </Shot>
      <Shot from={s8} to={s10}>
        {(f, l) => {
          const push = ease(l, 20, 60);
          const saraT = f >= s9;
          return (
            <Svg>
              <Cam fx={saraT ? 660 : interpolate(push, [0, 1], [440, 560])} fy={saraT ? 1180 : interpolate(push, [0, 1], [1150, 1260])} z={saraT ? 1.8 : interpolate(push, [0, 1], [1.5, 2.3])}>
                <Hall f={f} />
                {team(f, { jLook: [1, 0] })}
                <MeetingTable f={f} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Sfx name="whoosh" at={s5} />
      <Sfx name="pop" at={s6 + 4} gain={0.6} />
      <Sfx name="pop" at={s7 + 4} gain={0.6} />
      <Sfx name="tiptoe" at={s8 + 6} gain={0.6} />
    </>
  );
};

const Scene3: React.FC = () => {
  const s10 = line("Q10-F").from;
  const f10 = at("Q10-F");
  const s11 = line("Q11-J").from;
  const e11 = endOf("Q11-J");
  const s12 = line("Q12-K").from;
  const noteAt = s10 + 80;
  const mapAt = e11 + 4;
  return (
    <>
      <Shot from={s10} to={noteAt}>
        {(f, l) => {
          const walk = ease(l, 0, 28);
          const bend = ease(l, 28, 40);
          const open = ease(l, 52, 70);
          return (
            <Svg>
              <Cam fx={560} fy={1300} z={1.9}>
                <Hall f={f} />
                <Chair x={560} y={1575} s={0.55} />
                <Jo f={f} x={interpolate(walk, [0, 1], [300, 430])} y={1740 + bend * 20} walk={walk < 1 ? l / 4 : undefined} expr={bend > 0.5 ? "shock" : "smile"} look={[1, 1]} tilt={bend * 10} armR={bend > 0 ? { target: [interpolate(open, [0, 1], [260, 180]), interpolate(open, [0, 1], [-200, -520])] } : {}} />
                <Envelope x={interpolate(bend, [0, 1], [580, 430 + 0.55 * 240])} y={interpolate(open, [0, 1], [1560, 1740 - 0.55 * 520])} s={0.28} open={open} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Shot from={noteAt} to={f10 - 4}>
        {(_f, l) => <NoteInsert l={l} size={64} lines={["لا تبدأوا العرض بدوني…", "هناك شيء مهم", "لازم تعرفونه!"]} deco={<div style={{ textAlign: "left", fontSize: 40, color: "#8B6A3E", fontFamily: FONT }}>— خالد</div>} />}
      </Shot>
      <Shot from={f10 - 4} to={mapAt}>
        {(f) => {
          const jo = f >= s11;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={jo ? 430 : 600} fy={1180} z={2.0}>
                  <Hall f={f} />
                  <Jo f={f} x={430} y={1760} expr={jo ? "proud" : "worry"} look={[1, -0.3]} armR={{ target: [180, -520] }} />
                  <Envelope x={430 + 0.55 * 180} y={1760 - 0.55 * 520} s={0.28} open={1} />
                  <Sara f={f} x={780} y={1740} expr="worry" look={[-1, -0.2]} sweat={1} tilt={-5} armL={{ a: 40, b: 120 }} />
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: "radial-gradient(70% 50% at 50% 45%, transparent 50%, rgba(20,10,40,0.4) 100%)" }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* the map falls out */}
      <Shot from={mapAt} to={s12 + 40}>
        {(_f, l) => {
          const k = spring({ frame: l, fps: 30, config: { stiffness: 140, damping: 14 } });
          const ring = ease(l, 26, 50);
          return (
            <AbsoluteFill style={{ background: "radial-gradient(80% 60% at 50% 50%, #3B2A22 0%, #120C0A 100%)" }}>
              <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
                <g transform={`translate(540 ${960 - (1 - k) * 600}) rotate(${(1 - k) * 25 - 3})`}>
                  <rect x={-380} y={-520} width={760} height={1040} rx={16} fill="#FFF8E7" />
                  <text x={0} y={-430} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={58} fill="#3A2414">
                    خريطة المسرح
                  </text>
                  <rect x={-300} y={-360} width={600} height={260} rx={10} fill="#F6D7DD" stroke="#A3203A" strokeWidth={6} />
                  <text x={0} y={-215} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill="#A3203A">
                    المسرح
                  </text>
                  <rect x={-300} y={-60} width={280} height={240} rx={10} fill="#E6E2F4" stroke="#5B4A8B" strokeWidth={6} />
                  <text x={-160} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill="#5B4A8B">
                    القاعة
                  </text>
                  <rect x={40} y={-60} width={260} height={240} rx={10} fill="#EFE3D2" stroke="#8B6A3E" strokeWidth={6} />
                  <text x={170} y={50} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#8B6A3E">
                    غرفة
                  </text>
                  <text x={170} y={100} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#8B6A3E">
                    التخزين
                  </text>
                  <path d="M-160 260 L-160 220 L170 220 L170 190" stroke="#3A2414" strokeWidth={6} strokeDasharray="16 12" fill="none" />
                  <ellipse cx={170} cy={60} rx={170} ry={150} fill="none" stroke="#E8414B" strokeWidth={14} strokeDasharray={`${ring * 1000} 1000`} transform="rotate(-10 170 60)" />
                </g>
              </svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="mystery" at={s10 + 30} />
      <Sfx name="envelope" at={s10 + 52} />
      <Sfx name="paper" at={noteAt} />
      <Sfx name="whoosh" at={mapAt} />
      <Sfx name="gasp" at={mapAt + 26} />
    </>
  );
};

const Scene4: React.FC = () => {
  const s12 = line("Q12-K").from;
  const k12 = at("Q12-K");
  const s13 = line("Q13-M").from;
  const s14 = line("Q14-K").from;
  const k14 = at("Q14-K");
  const s15 = line("Q15-J").from;
  const doorFrom = s12 + 40;
  return (
    <>
      {/* the storage room door opens */}
      <Shot from={doorFrom} to={s13}>
        {(f, l) => {
          const open = ease(l, 4, 30);
          const heard = f >= k12 - 6;
          const shake = f > k12 - 30 && f < k12 + 20 ? Math.sin(f * 2.4) * 8 : 0;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={560} fy={1100} z={1.3}>
                  <Storage f={f} light={open} />
                  <Box x={760} y={1500} s={0.6} shake={shake} />
                  <Box x={330} y={1520} s={0.5} />
                  <Teacher x={980} y={1720} s={0.72} expr={heard ? "shock" : "smile"} blink={blinkAt(f, 5)} look={[-0.6, 0]} />
                  <Jo f={f} x={560} y={1760} expr={heard ? "shock" : "smile"} look={[0.6, -0.4]} armL={heard ? { a: 120, b: 160 } : {}} armR={heard ? { a: 120, b: 160 } : {}} />
                  <Sara f={f} x={300} y={1760} expr={heard ? "shock" : "worry"} look={[0.8, -0.3]} />
                  <Mazen f={f} x={760} y={1780} expr={heard ? "shock" : "smile"} look={[0, -0.4]} />
                  <Layan f={f} x={120} y={1760} expr={heard ? "shock" : "smile"} look={[0.8, -0.3]} />
                </Cam>
              </Svg>
              {/* door panels sliding away */}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 540 * (1 - open), background: "linear-gradient(90deg,#6B4523,#8B5E34)", borderRight: "8px solid #3E2716" }} />
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 540 * (1 - open), background: "linear-gradient(270deg,#6B4523,#8B5E34)", borderLeft: "8px solid #3E2716" }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={s13} to={s14}>
        {(f, l) => (
          <Svg>
            <Cam fx={760 - ease(l, 0, 20) * 60} fy={1200} z={2.0}>
              <Storage f={f} light={1} />
              <Box x={760} y={1500} s={0.6} />
              <Mazen f={f} x={760 - ease(l, 0, 20) * 120} y={1780} expr="shock" look={[0.6, -0.2]} sweat={1} armL={{ a: 150, b: 200 }} armR={{ a: 150, b: 200 }} tilt={Math.sin(l / 2) * 3} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* a small hand, then Khaled pops out with a box of decorations */}
      <Shot from={s14} to={s15}>
        {(f, l) => {
          const hand = ease(l, 4, 16);
          const pop = f > k14 - 24 ? spring({ frame: f - (k14 - 24), fps: 30, config: { stiffness: 200, damping: 12 } }) : 0;
          return (
            <Svg>
              <Cam fx={760} fy={1250} z={1.75}>
                <Storage f={f} light={1} />
                {pop > 0 && <Khaled f={f} x={800} y={1520 - pop * 40} s={0.58} expr="happy" look={[-0.6, 0]} armL={{ target: [-150, -470] }} armR={{ target: [150, -470] }} />}
                {pop > 0 && <Box x={800} y={1520 - pop * 40 - 0.58 * 340} s={0.3} open={1} items />}
                <Box x={760} y={1500} s={0.6} />
                {pop === 0 && hand > 0 && <circle cx={700} cy={1500 - 0.6 * 300 - 20 * hand} r={20} fill="url(#skinT)" />}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Sfx name="creepy" at={doorFrom} />
      <Sfx name="drawer" at={doorFrom + 4} />
      <Sfx name="scratch" at={k12 - 4} gain={0.6} />
      <Sfx name="boing" at={s13 + 2} />
      <Sfx name="tiptoe" at={s14 + 2} gain={0.6} />
      <Sfx name="tada" at={k14 - 22} />
    </>
  );
};

const Scene5: React.FC = () => {
  const s15 = line("Q15-J").from;
  const s16 = line("Q16-K").from;
  const k16 = at("Q16-K");
  const s17 = line("Q17-J").from;
  const e17 = endOf("Q17-J");
  const endCard = e17 + 8;
  return (
    <>
      <Shot from={s15} to={s16}>
        {(f, l) => (
          <Svg>
            <Cam fx={600} fy={1150} z={1.45}>
              <Storage f={f} light={1} />
              <Khaled f={f} x={820} y={1760} expr="happy" look={[-0.8, 0]} armL={{ target: [-150, -470] }} armR={{ target: [150, -470] }} />
              <Box x={820} y={1760 - 0.58 * 340} s={0.3} />
              <Jo f={f} x={420} y={1760} expr="laugh" look={[0.8, -0.2]} tilt={Math.sin(l / 3) * 4} armR={{ a: 40, b: 120 }} />
              <Sara f={f} x={180} y={1760} expr="laugh" look={[0.8, 0]} />
              <Mazen f={f} x={620} y={1780} expr="smile" look={[0.6, 0]} sweat={0.6} />
            </Cam>
          </Svg>
        )}
      </Shot>
      <Shot from={s16} to={s17}>
        {(f, l) => {
          const open = ease(l, 4, 20);
          const serious = f > k16 - 4;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={820} fy={1180} z={2.2}>
                  <Storage f={f} light={serious ? 0.6 : 1} />
                  <Khaled f={f} x={820} y={1760} expr={serious ? "worry" : "smile"} look={[0, 0.3]} armL={{ target: [-150, -470] }} armR={{ target: [150, -470] }} />
                  <g transform={`translate(820 ${1760 - 0.58 * 340})`}>
                    <Box x={0} y={0} s={0.3} open={open} />
                    {open > 0.5 && <path d="M-20 -110 q20 -40 40 0 v40 q-20 20 -40 0Z" fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="10 8" opacity={0.9} />}
                    {open > 0.5 && <text x={0} y={-150} textAnchor="middle" fontSize={60} fill="#FFD23F">?</text>}
                  </g>
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: `radial-gradient(60% 45% at 50% 45%, transparent 45%, rgba(10,5,30,${serious ? 0.45 : 0}) 100%)` }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={s17} to={endCard}>
        {(f, l) => {
          const push = ease(l, 0, 90);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={420} fy={interpolate(push, [0, 1], [1200, 1330])} z={interpolate(push, [0, 1], [2.4, 4.4])}>
                  <Storage f={f} light={0.4} />
                  <Jo f={f} x={420} y={1760} expr="shock" look={[0, 0]} sweat={1} armL={{ a: 120, b: 170 }} armR={{ a: 120, b: 170 }} />
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 45%, transparent 35%, rgba(10,5,30,${0.35 + 0.35 * push}) 100%)` }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={endCard} to={2250}>
        {(_f, l) => {
          const k = spring({ frame: l, fps: 30, config: { stiffness: 180, damping: 12 } });
          return (
            <AbsoluteFill style={{ background: "radial-gradient(80% 60% at 50% 45%, #3B2A6B 0%, #120A24 100%)" }}>
              <div dir="rtl" style={{ position: "absolute", top: 560, left: 80, right: 130, textAlign: "center", fontFamily: FONT, color: "#fff", scale: String(k) }}>
                <div dir="ltr" style={{ fontWeight: 700, fontSize: 46, letterSpacing: 6, color: "#BFB4E8" }}>TO BE CONTINUED</div>
                <div style={{ marginTop: 10, fontWeight: 800, fontSize: 130, lineHeight: 1.1, color: "#FF86B8", textShadow: "0 8px 0 #8E2E5E" }}>يتبع…</div>
                <div style={{ marginTop: 26, fontWeight: 700, fontSize: 58, lineHeight: 1.35 }}>الحلقة السادسة:</div>
                <div style={{ fontWeight: 800, fontSize: 72, lineHeight: 1.3, color: "#FFD23F" }}>اختفاء الميكروفون! 🎤</div>
              </div>
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="giggle" at={s15 + 4} gain={0.7} />
      <Sfx name="drawer" at={s16 + 4} gain={0.7} />
      <Sfx name="gasp" at={k16 + 30} />
      <Sfx name="suspense" at={s17 + 40} />
      <Sfx name="swoosh" at={endCard} />
    </>
  );
};

/** Small episode tag in the corner (no full title card: the episode opens on the action). */
const Tag: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [4, 12, 80, 92], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div dir="rtl" style={{ position: "absolute", top: 180, right: 140, padding: "8px 26px", borderRadius: 30, background: "rgba(255,111,168,0.92)", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 38, opacity: o }}>
      يوميات جوانا ٥: المهمة السرية
    </div>
  );
};

/** «يوميات جوانا» — Episode 5: the secret mission (new team: Layan, Mazen, Khaled). */
export const JoannaEp5: React.FC = () => (
  <AbsoluteFill style={{ background: "#2E2440" }}>
    <Scene1 />
    <Scene2 />
    <Scene3 />
    <Scene4 />
    <Scene5 />
    <Tag />
    {T.scenes.map((s) => (
      <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/joanna5/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />
    ))}
    <Audio
      src={staticFile("audio/joanna5/music/theme.mp3")}
      volume={(f) => {
        const inVoice = T.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 6);
        const fd = interpolate(f, [0, 6, 2220, 2250], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (inVoice ? db(-22) : db(-15)) * fd;
      }}
    />
  </AbsoluteFill>
);
