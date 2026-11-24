import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import data from "../data/joanna7-timeline.json";
import mouthData from "../data/joanna7-mouth.json";
import { createSound } from "../components/Sound";
import { findScene, type TimelineData } from "../lib/timing";
import { db } from "../theme";
import { Kid, Teacher, type KidProps } from "./chars";
import { Box } from "./Ep5";
import { Mic } from "./Ep6";
import { blinkAt, Cam, ease, Flash, FONT, Shot, Svg } from "./Joanna";

const T = data as TimelineData;
const MOUTH = mouthData as Record<string, number[]>;
const { Sfx } = createSound(T, "audio/joanna7", {
  whoosh: db(-14),
  pop: db(-12),
  boing: db(-11),
  steps: db(-14),
  sparkle: db(-12),
  tada: db(-11),
  swoosh: db(-11),
  gasp: db(-10),
  suspense: db(-9),
  laugh: db(-12),
  giggle: db(-10),
  scratch: db(-10),
  tiptoe: db(-12),
  yay: db(-11),
  hug: db(-11),
  feedback: db(-14),
  idea: db(-10),
  crash: db(-9),
  applause: db(-11),
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

/* ---------------------------------------------------------------- stage */

export const StageSet: React.FC<{ f: number; spot?: number; backdrop?: number; painted?: number }> = ({ f, spot = 1, backdrop = 0, painted = 0 }) => (
  <g>
    <defs>
      <linearGradient id="stCurtain" x1="0" x2="1">
        <stop offset="0%" stopColor="#8E1A30" />
        <stop offset="50%" stopColor="#C92F45" />
        <stop offset="100%" stopColor="#8E1A30" />
      </linearGradient>
      <radialGradient id="stSpot" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF3C4" stopOpacity={0.45} />
        <stop offset="100%" stopColor="#FFF3C4" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={-1400} y={-800} width={3900} height={2300} fill="#241A33" />
    {/* backdrop board (Layan's painting); can topple over */}
    {backdrop >= 0.999 && <rect x={110} y={1225} width={860} height={40} rx={6} fill="#8B5E34" />}
    <g transform={`rotate(${backdrop * 82} 540 1260)`} opacity={backdrop >= 0.999 ? 0 : 1}>
      <rect x={110} y={330} width={860} height={930} fill="#BFE6FF" stroke="#8B5E34" strokeWidth={18} />
      <rect x={110} y={900} width={860} height={360} fill="#9BD47A" opacity={painted} />
      <circle cx={760} cy={560} r={120 * painted + 0.01} fill="#FFD23F" />
      <path d="M240 900 l120 -180 l120 180 M440 900 l160 -240 l160 240" fill="#7E8FA8" opacity={painted} />
    </g>
    {/* side curtains */}
    {Array.from({ length: 5 }).map((_, i) => (
      <path key={i} d={`M${-420 + i * 110} -200 q55 800 0 1460 h110 q-55 -660 0 -1460Z`} fill="url(#stCurtain)" />
    ))}
    {Array.from({ length: 5 }).map((_, i) => (
      <path key={`r${i}`} d={`M${1060 + i * 110} -200 q55 800 0 1460 h110 q-55 -660 0 -1460Z`} fill="url(#stCurtain)" />
    ))}
    <path d="M-500 -220 Q540 120 1600 -220 L1600 -60 Q540 260 -500 -60Z" fill="#A3203A" />
    <rect x={-1400} y={1260} width={3900} height={1400} fill="#B07A48" />
    {Array.from({ length: 30 }).map((_, i) => (
      <rect key={i} x={-1400 + i * 130} y={1260} width={4} height={1400} fill="#8E5E34" opacity={0.5} />
    ))}
    <ellipse cx={540} cy={1700} rx={700 * spot} ry={260 * spot} fill="url(#stSpot)" opacity={0.9 + 0.1 * Math.sin(f / 9)} />
  </g>
);

export const Drum: React.FC<{ x: number; y: number; s: number; hit?: number }> = ({ x, y, s, hit = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s * (1 + hit * 0.06)})`}>
    <ellipse cx={0} cy={-150} rx={150} ry={150} fill="#E8414B" stroke="#8E1A30" strokeWidth={12} />
    <ellipse cx={0} cy={-150} rx={110} ry={110} fill="#F6EFE4" />
    <rect x={-10} y={-10} width={20} height={10} fill="#555" />
  </g>
);

/* ---------------------------------------------------------------- scenes */

const Scene1: React.FC = () => {
  const s1 = line("S01-J").from;
  const j1 = at("S01-J");
  const s2 = line("S02-M").from;
  return (
    <>
      {/* chaos montage */}
      <Shot from={s1} to={j1}>
        {(f, l) => {
          const beat = Math.floor(l / 30);
          const k = (l % 30) / 30;
          const shake = Math.sin(l * 2.4) * 10 * (1 - k);
          return (
            <AbsoluteFill>
              <Svg>
                {beat === 0 && (
                  <Cam fx={760 + shake} fy={1300} z={2.0}>
                    <StageSet f={f} />
                    <Mazen f={f} x={760} y={1780} expr="laugh" look={[0, 0.5]} armL={{ target: [-170, -360 + Math.abs(Math.sin(l / 2)) * -60] }} armR={{ target: [170, -360 + Math.abs(Math.cos(l / 2)) * -60] }} />
                    <Drum x={760} y={1760} s={0.7} hit={Math.abs(Math.sin(l / 2))} />
                  </Cam>
                )}
                {beat === 1 && (
                  <Cam fx={540 + shake} fy={1000} z={1.05}>
                    <StageSet f={f} backdrop={ease(k, 0.1, 0.6)} painted={0.5} />
                    <Layan f={f} x={300} y={1780} expr="shock" look={[1, -0.5]} armL={{ a: 130, b: 170 }} armR={{ a: 130, b: 170 }} />
                  </Cam>
                )}
                {beat === 2 && (
                  <Cam fx={420} fy={1160} z={2.0}>
                    <StageSet f={f} backdrop={1} />
                    <Sara f={f} x={420} y={1780} expr="worry" look={[0, -1]} sweat={1} armR={{ target: [140, -680] }} />
                    <text x={560} y={1220} fontSize={120} fontFamily={FONT} fontWeight={800} fill="#FFD23F" textAnchor="middle">
                      ؟
                    </text>
                  </Cam>
                )}
                {beat >= 3 && (
                  <Cam fx={600} fy={1350} z={1.6}>
                    <StageSet f={f} backdrop={1} />
                    <g transform={`rotate(${ease(k, 0, 0.5) * 70} 600 1780)`}>
                      <Khaled f={f} x={600} y={1780} expr="shock" look={[0, 0]} armL={{ a: 150, b: 180 }} armR={{ a: 150, b: 180 }} />
                    </g>
                    <Box x={760 + k * 120} y={1760} s={0.35} open={k} items />
                  </Cam>
                )}
              </Svg>
              {k < 0.2 && <Flash l={k * 30} len={5} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={j1} to={s2}>
        {(f, l) => {
          const up = spring({ frame: l, fps: 30, config: { stiffness: 220, damping: 11 } });
          return (
            <Svg>
              <Cam fx={540} fy={1150} z={1.9}>
                <StageSet f={f} backdrop={1} />
                <Jo f={f} x={540} y={1780} expr="shock" look={[0, 0]} armL={{ a: 60 + up * 90, b: 80 + up * 100 }} armR={{ a: 60 + up * 90, b: 80 + up * 100 }} sweat={1} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Sfx name="crash" at={4} />
      <Sfx name="crash" at={36} gain={0.9} />
      <Sfx name="boing" at={64} />
      <Sfx name="crash" at={94} gain={0.7} />
      <Sfx name="scratch" at={j1 - 4} />
    </>
  );
};

const Scene2: React.FC = () => {
  const s2 = line("S02-M").from;
  const s3 = line("S03-L").from;
  const s4 = line("S04-F").from;
  const s5 = line("S05-K").from;
  const s6 = line("S06-J").from;
  const close = (C: React.ReactNode, f: number, x: number) => (
    <Svg>
      <Cam fx={x} fy={1160} z={2.3}>
        <StageSet f={f} backdrop={1} />
        {C}
      </Cam>
    </Svg>
  );
  return (
    <>
      <Shot from={s2} to={s3}>
        {(f) => close(<Mazen f={f} x={540} y={1780} expr="happy" look={[0, 0]} armR={{ a: 140, b: 170 }} />, f, 540)}
      </Shot>
      <Shot from={s3} to={s4}>
        {(f) => close(<Layan f={f} x={540} y={1780} expr="worry" look={[0, 0]} armL={{ a: 60, b: 130 }} />, f, 540)}
      </Shot>
      <Shot from={s4} to={s5}>
        {(f) => close(<Sara f={f} x={540} y={1780} expr="happy" look={[0, 0]} armR={{ a: 120, b: 150 }} armL={{ a: 120, b: 150 }} />, f, 540)}
      </Shot>
      <Shot from={s5} to={s6}>
        {(f) => close(<Khaled f={f} x={540} y={1780} expr="worry" look={[0, 0]} armR={{ a: 50, b: 130 }} />, f, 540)}
      </Shot>
      {[s2, s3, s4, s5].map((t, i) => (
        <Sfx key={i} name="whoosh" at={t} gain={0.7} />
      ))}
    </>
  );
};

const Scene3: React.FC = () => {
  const s6 = line("S06-J").from;
  const s7 = line("S07-T").from;
  const s8 = line("S08-J").from;
  const j8 = at("S08-J");
  const s9 = line("S09-F").from;
  const idea = j8 - 16;
  return (
    <>
      {/* sad leader, then the teacher's advice */}
      <Shot from={s6} to={s8}>
        {(f, l) => {
          const teacher = f >= s7;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={teacher ? 620 : 440} fy={teacher ? 1050 : 1250} z={teacher ? 1.45 : 2.0}>
                  <StageSet f={f} backdrop={1} spot={0.6} />
                  <Jo f={f} x={440} y={1640} seated expr="worry" look={[teacher ? 1 : 0, 0.6]} tilt={teacher ? 0 : 8} armR={{ target: [80, -330] }} armL={{ target: [-80, -330] }} />
                  <rect x={300} y={1640} width={280} height={150} rx={10} fill="#8B5E34" />
                  {teacher && <Teacher x={interpolate(ease(l - (s7 - s6), 0, 24), [0, 1], [1100, 860])} y={1780} s={0.72} walk={l - (s7 - s6) < 24 ? f / 4 : undefined} expr="happy" talk={talkOf("T", f)} blink={blinkAt(f, 5)} look={[-0.8, 0.5]} tilt={-6} armL={{ target: [-330, -900] }} />}
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 50% 50%, transparent 40%, rgba(20,10,40,${teacher ? 0.2 : 0.45}) 100%)` }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* the idea */}
      <Shot from={s8} to={s9}>
        {(f) => {
          const up = f > idea ? spring({ frame: f - idea, fps: 30, config: { stiffness: 220, damping: 11 } }) : 0;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={460} fy={1180 - up * 40} z={2.0}>
                  <StageSet f={f} backdrop={1} spot={0.6 + up * 0.5} />
                  {up > 0.2 ? (
                    <Jo f={f} x={460} y={1780} expr="happy" look={[0, -0.4]} armR={{ a: 40 + up * 105, b: 40 + up * 130 }} armL={{ a: 20, b: 50 }} />
                  ) : (
                    <>
                      <Jo f={f} x={460} y={1640} seated expr="smile" look={[0.3, -1]} armR={{ target: [80, -640] }} armsFront />
                      <rect x={320} y={1640} width={280} height={150} rx={10} fill="#8B5E34" />
                    </>
                  )}
                  {up > 0 && (
                    <g transform={`translate(${460 + 0.55 * 260} ${1780 - 0.55 * 1180}) scale(${up})`}>
                      <circle cx={0} cy={0} r={46} fill="#FFE066" stroke="#E8B21A" strokeWidth={6} />
                      <rect x={-20} y={40} width={40} height={30} rx={6} fill="#9AA6B2" />
                    </g>
                  )}
                </Cam>
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="tiptoe" at={s6 + 4} gain={0.5} />
      <Sfx name="steps" at={s7} gain={0.6} />
      <Sfx name="idea" at={idea} />
      <Sfx name="sparkle" at={idea + 4} />
    </>
  );
};

const Scene4: React.FC = () => {
  const s9 = line("S09-F").from;
  const s10 = line("S10-K").from;
  const e10 = endOf("S10-K");
  const s11 = line("S11-J").from;
  const j11 = at("S11-J");
  const e11 = endOf("S11-J");
  const endCard = e11 + 10;
  const showStart = e10 + 4;
  return (
    <>
      {/* everyone's role */}
      <Shot from={s9} to={showStart}>
        {(f) => (
          <Svg>
            <Cam fx={560} fy={1160} z={1.3}>
              <StageSet f={f} backdrop={1} />
              <Sara f={f} x={160} y={1780} expr="happy" look={[1, 0]} armR={{ target: [300, -560] }} />
              <Mazen f={f} x={380} y={1780} expr="happy" look={[-0.6, 0]} />
              <Layan f={f} x={580} y={1780} expr="happy" look={[-0.8, 0]} />
              <Khaled f={f} x={800} y={1780} expr={f >= s10 ? "happy" : "smile"} talk={talkOf("K", f)} look={[-0.8, 0]} armR={f >= s10 ? { a: 140, b: 170 } : {}} />
              <Jo f={f} x={980} y={1780} expr="happy" look={[-1, 0]} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* the rehearsal that works */}
      <Shot from={showStart} to={s11 + 30}>
        {(f, l) => {
          const paint = ease(l, 10, 120);
          const clap = l > 150;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={interpolate(ease(l, 0, 200), [0, 1], [1100, 1000])} z={interpolate(ease(l, 0, 200), [0, 1], [1.05, 0.95])}>
                  <StageSet f={f} backdrop={0} painted={paint} spot={1.2} />
                  <Layan f={f} x={180} y={1780} expr="happy" look={[0.6, -1]} armR={{ target: [200, -800 + Math.sin(l / 4) * 40] }} />
                  <Mazen f={f} x={380} y={1790} expr="happy" look={[0, 0.5]} armL={{ target: [-130, -360 + Math.abs(Math.sin(l / 4)) * -30] }} armR={{ target: [130, -360 + Math.abs(Math.cos(l / 4)) * -30] }} />
                  <Drum x={380} y={1770} s={0.5} hit={Math.abs(Math.sin(l / 4)) * 0.5} />
                  <Jo f={f} x={560} y={1780} expr="happy" look={[0, 0]} armR={{ target: [90, -640] }} />
                  <Mic x={560 + 0.55 * 90} y={1780 - 0.55 * 700} s={0.5} gold={1} />
                  <Sara f={f} x={760} y={1780} expr={clap ? "laugh" : "happy"} look={[-0.4, 0]} tilt={Math.sin(l / 6) * 6} armL={{ a: 120 + Math.sin(l / 5) * 20, b: 160 }} armR={{ a: 100, b: 140 }} />
                  <Khaled f={f} x={950} y={1790} expr="happy" look={[-0.6, 0]} armR={{ a: 150, b: 175 }} armL={{ a: 150, b: 175 }} />
                  {clap && [0, 1, 2, 3].map((i) => <path key={i} d="M0 30 C-45 0 -25 -45 0 -20 C25 -45 45 0 0 30Z" fill="#FF6FA8" transform={`translate(${200 + i * 220} ${1000 - ((l * 3 + i * 50) % 200)}) scale(1.3)`} opacity={0.8} />)}
                </Cam>
              </Svg>
              {l < 8 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* the voice is gone */}
      <Shot from={s11 + 30} to={endCard}>
        {(f, l) => {
          const push = ease(l, 0, 90);
          const croak = f < j11;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={560} fy={interpolate(push, [0, 1], [1200, 1330])} z={interpolate(push, [0, 1], [2.2, 4.0])}>
                  <StageSet f={f} backdrop={0} painted={1} spot={0.6} />
                  <Jo f={f} x={560} y={1780} expr={croak ? "shock" : "worry"} look={[0, 0]} sweat={1} armR={croak ? { target: [60, -620] } : { target: [30, -600] }} armsFront={!croak} />
                  {croak && <text x={720} y={1260} fontSize={70} fill="#FFD23F" textAnchor="middle">…؟</text>}
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 45%, transparent 35%, rgba(10,5,30,${0.3 + 0.35 * push}) 100%)` }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={endCard} to={1800}>
        {(_f, l) => {
          const k = spring({ frame: l, fps: 30, config: { stiffness: 180, damping: 12 } });
          return (
            <AbsoluteFill style={{ background: "radial-gradient(80% 60% at 50% 45%, #3B2A6B 0%, #120A24 100%)" }}>
              <div dir="rtl" style={{ position: "absolute", top: 560, left: 80, right: 130, textAlign: "center", fontFamily: FONT, color: "#fff", scale: String(k) }}>
                <div style={{ fontWeight: 800, fontSize: 130, lineHeight: 1.1, color: "#FF86B8", textShadow: "0 8px 0 #8E2E5E" }}>يتبع…</div>
                <div style={{ marginTop: 26, fontWeight: 700, fontSize: 58, lineHeight: 1.35 }}>الحلقة الثامنة:</div>
                <div style={{ fontWeight: 800, fontSize: 72, lineHeight: 1.3, color: "#FFD23F" }}>يوم المسابقة! 🏆</div>
              </div>
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="pop" at={s9 + 30} gain={0.6} />
      <Sfx name="pop" at={s9 + 60} gain={0.6} />
      <Sfx name="tada" at={showStart} />
      <Sfx name="sparkle" at={showStart + 60} />
      <Sfx name="applause" at={showStart + 150} />
      <Sfx name="feedback" at={s11 + 40} gain={0.5} />
      <Sfx name="gasp" at={j11 - 10} />
      <Sfx name="suspense" at={e11 - 20} />
      <Sfx name="swoosh" at={endCard} />
    </>
  );
};

const Tag: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [4, 12, 80, 92], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div dir="rtl" style={{ position: "absolute", top: 180, right: 140, padding: "8px 26px", borderRadius: 30, background: "rgba(255,111,168,0.92)", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 38, opacity: o }}>
      يوميات جوانا ٧: البروفة الكارثية
    </div>
  );
};

/** «يوميات جوانا» — Episode 7: the disastrous rehearsal (lesson: a leader brings every talent together). */
export const JoannaEp7: React.FC = () => (
  <AbsoluteFill style={{ background: "#241A33" }}>
    <Scene1 />
    <Scene2 />
    <Scene3 />
    <Scene4 />
    <Tag />
    {T.scenes.map((s) => (
      <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/joanna7/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />
    ))}
    <Audio
      src={staticFile("audio/joanna7/music/theme.mp3")}
      volume={(f) => {
        const inVoice = T.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 6);
        const fd = interpolate(f, [0, 6, 1770, 1800], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (inVoice ? db(-22) : db(-15)) * fd;
      }}
    />
  </AbsoluteFill>
);
