import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import data from "../data/joanna8-timeline.json";
import mouthData from "../data/joanna8-mouth.json";
import { createSound } from "../components/Sound";
import { findScene, type TimelineData } from "../lib/timing";
import { db } from "../theme";
import { Kid, Teacher, type KidProps } from "./chars";
import { Hall } from "./Ep5";
import { Mic } from "./Ep6";
import { Drum, StageSet } from "./Ep7";
import { blinkAt, Cam, ease, Flash, FONT, Shot, Svg } from "./Joanna";

const T = data as TimelineData;
const MOUTH = mouthData as Record<string, number[]>;
const { Sfx } = createSound(T, "audio/joanna8", {
  whoosh: db(-14),
  pop: db(-12),
  boing: db(-11),
  steps: db(-14),
  sparkle: db(-12),
  tada: db(-11),
  swoosh: db(-11),
  gasp: db(-10),
  laugh: db(-12),
  giggle: db(-10),
  scratch: db(-10),
  tiptoe: db(-12),
  yay: db(-11),
  hug: db(-11),
  idea: db(-10),
  crash: db(-10),
  applause: db(-11),
  crowd: db(-17),
  drumroll: db(-11),
  cheer: db(-11),
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

const SignCard: React.FC<{ x: number; y: number; s: number; text: string; color?: string }> = ({ x, y, s, text, color = "#E0558F" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-130} y={-90} width={260} height={180} rx={18} fill="#fff" stroke={color} strokeWidth={10} />
    <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={64} fill={color}>
      {text}
    </text>
  </g>
);

const Trophy: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-50} y={60} width={100} height={30} rx={6} fill="#8B5E34" />
    <rect x={-14} y={10} width={28} height={50} fill="#D4A21E" />
    <path d="M-70 -90 h140 q0 100 -70 110 q-70 -10 -70 -110Z" fill="#FFD23F" stroke="#C48A10" strokeWidth={6} />
    <path d="M-70 -70 q-50 10 -30 50 q10 16 30 10" stroke="#C48A10" strokeWidth={10} fill="none" />
    <path d="M70 -70 q50 10 30 50 q-10 16 -30 10" stroke="#C48A10" strokeWidth={10} fill="none" />
    <polygon points="0,-70 8,-50 30,-50 12,-38 18,-16 0,-28 -18,-16 -12,-38 -30,-50 -8,-50" fill="#fff" opacity={0.9} />
  </g>
);

const Audience: React.FC<{ f: number; cheer?: number }> = ({ f, cheer = 0 }) => (
  <g>
    {[0, 1, 2].map((r) =>
      Array.from({ length: 12 }).map((_, i) => {
        const x = -120 + i * 120 + (r % 2) * 60;
        const y = 2000 + r * 110 - Math.abs(Math.sin(f / 4 + i + r)) * 14 * cheer;
        return (
          <g key={`${r}-${i}`}>
            <circle cx={x} cy={y} r={58} fill={["#2A2238", "#332944", "#3D3350"][r]} />
            <rect x={x - 70} y={y + 40} width={140} height={120} rx={40} fill={["#2A2238", "#332944", "#3D3350"][r]} />
            {cheer > 0.5 && i % 3 === r % 3 && <rect x={x + 40} y={y - 110} width={24} height={90} rx={12} fill={["#2A2238", "#332944", "#3D3350"][r]} transform={`rotate(${Math.sin(f / 3 + i) * 20} ${x + 52} ${y - 20})`} />}
          </g>
        );
      }),
    )}
  </g>
);

/* ---------------------------------------------------------------- scenes */

const Scene1: React.FC = () => {
  const j1 = at("U01-J");
  const s2 = line("U02-F").from;
  const s3 = line("U03-L").from;
  const s4 = line("U04-T").from;
  const s5 = line("U05-F").from;
  return (
    <>
      <Shot from={0} to={j1 - 6}>
        {(f, l) => (
          <Svg>
            <Cam fx={540} fy={interpolate(ease(l, 0, 60), [0, 1], [900, 1300])} z={0.85}>
              <Hall f={f} />
              <g transform="translate(540 460)">
                <rect x={-300} y={-70} width={600} height={140} rx={24} fill="#FFD23F" stroke="#C48A10" strokeWidth={8} />
                <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={66} fill="#8E1A30">
                  مسابقة المواهب ⭐
                </text>
              </g>
              <Audience f={f} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* backstage huddle */}
      <Shot from={j1 - 6} to={s4}>
        {(f) => {
          const who = f >= s3 ? "L" : f >= s2 ? "F" : "J";
          const fx = who === "J" ? 540 : who === "F" ? 320 : 760;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={fx} fy={1330} z={1.75}>
                  <rect x={-1400} y={-800} width={3900} height={2300} fill="#2E2440" />
                  <rect x={-1400} y={1260} width={3900} height={1400} fill="#5E4A38" />
                  <path d="M-400 -200 q80 900 0 1460 h220 q-80 -560 0 -1460Z" fill="#8E1A30" />
                  <Sara f={f} x={320} y={1780} expr={who === "F" ? "happy" : "smile"} look={[0.8, 0]} armR={who === "F" ? { a: 130, b: 160 } : {}} />
                  <Jo f={f} x={540} y={1780} expr={who === "J" ? "worry" : "smile"} look={who === "J" ? [0, 0.2] : [who === "F" ? -1 : 1, 0]} armR={who === "J" ? { target: [30, -600] } : { a: 150, b: 175 }} armsFront={who === "J"} />
                  <Layan f={f} x={760} y={1780} expr={who === "L" ? "happy" : "smile"} look={[-0.8, 0]} armR={{ target: [140, -460] }} />
                  {who === "L" && <SignCard x={760 + 0.55 * 150} y={1780 - 0.55 * 470} s={0.45} text="ابدأوا!" />}
                </Cam>
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={s4} to={s5}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={540} fy={900} z={1.25}>
                <StageSet f={f} backdrop={0} painted={0} spot={1} />
                <Teacher x={540} y={1500} s={0.72} expr="happy" talk={talkOf("T", f)} blink={blinkAt(f, 5)} look={[0, 0.3]} armR={{ target: [110, -900] }} />
                <Mic x={540 + 0.72 * 110} y={1500 - 0.72 * 980} s={0.6} />
              </Cam>
            </Svg>
            {l < 6 && <Flash l={l} />}
          </AbsoluteFill>
        )}
      </Shot>
      <Sfx name="crowd" at={0} />
      <Sfx name="whoosh" at={j1 - 6} gain={0.6} />
      <Sfx name="pop" at={s3 + 4} gain={0.6} />
      <Sfx name="applause" at={endOf("U04-T")} />
    </>
  );
};

const Scene2: React.FC = () => {
  const s5 = line("U05-F").from;
  const f6 = at("U06-F");
  const s7 = line("U07-M").from;
  const m7 = at("U07-M");
  const s8 = line("U08-T").from;
  const cardMusic = s5 + 70;
  const cardPaint = f6 - 90;
  const wobbleStart = m7 - 30;
  const save = endOf("U07-M") + 14;
  return (
    <>
      <Shot from={s5} to={s8}>
        {(f, l) => {
          const paint = ease(f, cardPaint, cardPaint + 140);
          const wob = f > wobbleStart && f < save ? Math.sin((f - wobbleStart) / 2.5) * 0.12 * Math.min(1, (f - wobbleStart) / 20) : 0;
          const saved = f >= save;
          const bow = f > save + 30 ? ease(f, save + 30, save + 45) : 0;
          const card = f >= save - 18 ? "الآن!" : f >= cardPaint ? "ارسمي!" : f >= cardMusic ? "موسيقى!" : "";
          const wide = f >= s7 - 10;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={wide ? 540 : 540} fy={wide ? 1080 : 1140} z={wide ? 1.0 : 1.15}>
                  <StageSet f={f} backdrop={wob} painted={paint} spot={1.1} />
                  <Layan f={f} x={160} y={1780} expr={wob ? "shock" : "happy"} look={[0.6, -1]} armR={{ target: [200, -800 + Math.sin(l / 4) * 40 * paint] }} tilt={-bow * 12} />
                  <Mazen f={f} x={360} y={1790} expr={wob ? "shock" : "happy"} look={[0, 0.5]} talk={talkOf("M", f)} armL={wob ? { a: 140, b: 170 } : { target: [-130, -360 + Math.abs(Math.sin(l / 4)) * -30] }} armR={wob ? { a: 140, b: 170 } : { target: [130, -360 + Math.abs(Math.cos(l / 4)) * -30] }} tilt={-bow * 12} />
                  <Drum x={360} y={1770} s={0.5} hit={f > cardMusic ? Math.abs(Math.sin(l / 4)) * 0.5 : 0} />
                  <Sara f={f} x={560} y={1780} expr="happy" look={[0, 0]} armR={{ target: [90, -640] }} tilt={-bow * 12} />
                  <Mic x={560 + 0.55 * 90} y={1780 - 0.55 * 700} s={0.5} gold={1} />
                  <Khaled f={f} x={saved ? 760 : interpolate(ease(f, save - 20, save), [0, 1], [880, 760])} y={1790} expr={saved ? "happy" : wob ? "shock" : "smile"} look={[-0.6, -0.6]} armR={saved && !bow ? { a: 150, b: 175 } : { a: 20, b: 40 }} armL={saved && !bow ? { a: 150, b: 175 } : {}} tilt={-bow * 12} />
                  <Jo f={f} x={980} y={1790} expr={card === "الآن!" ? "proud" : "happy"} look={[-1, 0]} armL={card ? { target: [-230, -780] } : {}} tilt={-bow * 12} />
                  {card && <SignCard x={980 - 0.55 * 250} y={1790 - 0.55 * 900} s={0.5} text={card} />}
                </Cam>
              </Svg>
              {l < 6 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="tada" at={s5 + 4} gain={0.6} />
      <Sfx name="pop" at={cardMusic} />
      <Sfx name="pop" at={cardPaint} />
      <Sfx name="sparkle" at={cardPaint + 100} />
      <Sfx name="crash" at={wobbleStart} gain={0.6} />
      <Sfx name="pop" at={save - 18} />
      <Sfx name="boing" at={save} />
      <Sfx name="applause" at={save + 20} />
      <Sfx name="cheer" at={save + 40} gain={0.6} />
    </>
  );
};

const Scene3: React.FC = () => {
  const s8 = line("U08-T").from;
  const t8 = at("U08-T");
  const e8 = endOf("U08-T");
  const s9 = line("U09-K").from;
  const s10 = line("U10-J").from;
  const s11 = line("U11-J").from;
  const e11 = endOf("U11-J");
  const endCard = e11 + 8;
  const firstDone = t8 + 70;
  const ours = e8 - 34;
  return (
    <>
      <Shot from={s8} to={s9}>
        {(f, l) => {
          const roll = f < t8;
          const happy = f >= ours;
          const meh = f >= firstDone && !happy;
          const conf = happy ? ease(f, ours, ours + 20) : 0;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={happy ? 540 : 700} fy={happy ? 1080 : 960} z={happy ? 1.0 : 1.3}>
                  <StageSet f={f} backdrop={0} painted={1} spot={roll ? 0.6 + Math.abs(Math.sin(l / 3)) * 0.4 : 1.1} />
                  <Teacher x={860} y={1560} s={0.72} expr="happy" talk={talkOf("T", f)} blink={blinkAt(f, 5)} look={[-0.6, 0.3]} armR={{ target: [-120, -900] }} armL={{ target: [150, -700] }} />
                  <Trophy x={860 + 0.72 * 150} y={1560 - 0.72 * 760} s={0.55} />
                  {[
                    (p: { expr: KidProps["expr"] }) => <Layan f={f} x={140} y={1790} look={[1, 0]} {...p} armL={happy ? { a: 150, b: 175 } : {}} armR={happy ? { a: 150, b: 175 } : {}} />,
                    (p: { expr: KidProps["expr"] }) => <Sara f={f} x={300} y={1790} look={[1, 0]} {...p} armL={happy ? { a: 150, b: 175 } : {}} armR={happy ? { a: 150, b: 175 } : {}} />,
                    (p: { expr: KidProps["expr"] }) => <Jo f={f} x={460} y={1790} look={[1, 0]} {...p} armL={happy ? { a: 150, b: 175 } : {}} armR={happy ? { a: 150, b: 175 } : {}} />,
                    (p: { expr: KidProps["expr"] }) => <Mazen f={f} x={620} y={1800} look={[1, 0]} {...p} armL={happy ? { a: 150, b: 175 } : {}} armR={happy ? { a: 150, b: 175 } : {}} />,
                  ].map((C, i) => (
                    <C key={i} expr={happy ? "laugh" : meh ? "worry" : "smile"} />
                  ))}
                  {conf > 0 &&
                    Array.from({ length: 30 }).map((_, i) => {
                      const p = (l * (3 + (i % 4)) + i * 47) % 1000;
                      return <rect key={i} x={100 + ((i * 113) % 900)} y={500 + p} width={18} height={10} fill={["#FF6FA8", "#FFD23F", "#2F6FD1", "#4CAF50", "#8E5BD6"][i % 5]} transform={`rotate(${p * 2 + i * 20} ${100 + ((i * 113) % 900)} ${500 + p})`} />;
                    })}
                </Cam>
              </Svg>
              {f >= ours && f < ours + 6 && <Flash l={f - ours} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={s9} to={s11}>
        {(f, l) => {
          const hug = f >= s10;
          return (
            <Svg>
              <Cam fx={hug ? 540 : 760} fy={hug ? 1150 : 1150} z={hug ? 1.35 : 1.9}>
                <StageSet f={f} backdrop={0} painted={1} spot={1.1} />
                <Layan f={f} x={180} y={1790} expr="happy" look={[1, 0]} tilt={hug ? 6 : 0} armR={hug ? { target: [330, -560] } : {}} />
                <Sara f={f} x={360} y={1790} expr="happy" look={[0.8, 0]} tilt={hug ? 6 : 0} armR={hug ? { target: [330, -560] } : {}} />
                <Jo f={f} x={540} y={1790} expr="happy" look={hug ? [0, 0] : [1, 0]} armL={hug ? { target: [-330, -560] } : {}} armR={hug ? { target: [330, -560] } : {}} />
                <Mazen f={f} x={720} y={1800} expr="happy" look={[-0.8, 0]} tilt={hug ? -6 : 0} armL={hug ? { target: [-330, -560] } : {}} />
                <Khaled f={f} x={900} y={1800} expr="happy" look={hug ? [-0.8, 0] : [0, 0]} armL={hug ? { target: [-330, -560] } : { target: [-120, -760] }} armR={{ target: [120, -760] }} />
                {!hug && <Trophy x={900} y={1800 - 0.58 * 860} s={0.5} />}
                {hug && [0, 1, 2].map((i) => <path key={i} d="M0 30 C-45 0 -25 -45 0 -20 C25 -45 45 0 0 30Z" fill="#FF6FA8" transform={`translate(${300 + i * 240} ${1050 - ((l * 2 + i * 50) % 180)}) scale(1.3)`} opacity={0.8} />)}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Shot from={s11} to={endCard}>
        {(f, l) => {
          const lean = ease(l, 0, 24);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={interpolate(lean, [0, 1], [1150, 1290])} z={interpolate(lean, [0, 1], [2.0, 3.2])}>
                  <StageSet f={f} backdrop={0} painted={1} spot={0.8} />
                  <Jo f={f} x={540} y={1790} expr="sly" look={[0, 0]} tilt={-6} armsFront armL={{ target: [-215, -700] }} />
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 50% 45%, transparent 50%, rgba(40,20,60,${0.4 * lean}) 100%)` }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={endCard} to={2100}>
        {(_f, l) => {
          const k = spring({ frame: l, fps: 30, config: { stiffness: 160, damping: 12 } });
          return (
            <AbsoluteFill style={{ background: "radial-gradient(80% 60% at 50% 45%, #FF86B8 0%, #D9508A 100%)" }}>
              <div dir="rtl" style={{ position: "absolute", top: 520, left: 80, right: 130, textAlign: "center", fontFamily: FONT, color: "#fff", scale: String(k) }}>
                <div style={{ fontWeight: 800, fontSize: 110, lineHeight: 1.15, textShadow: "0 8px 0 #8E2E5E" }}>نهاية الموسم الأول</div>
                <div style={{ marginTop: 30, fontWeight: 700, fontSize: 60, lineHeight: 1.35 }}>يوميات جوانا 🎀</div>
                <div style={{ marginTop: 10, fontWeight: 700, fontSize: 54, lineHeight: 1.35, color: "#FFF3C4" }}>نشوفكم في الموسم الثاني!</div>
              </div>
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="drumroll" at={s8 + 6} />
      <Sfx name="gasp" at={firstDone} gain={0.6} />
      <Sfx name="tada" at={ours} />
      <Sfx name="cheer" at={ours + 6} />
      <Sfx name="yay" at={s9 + 2} gain={0.7} />
      <Sfx name="hug" at={s10 + 4} />
      <Sfx name="giggle" at={e11 + 2} />
      <Sfx name="swoosh" at={endCard} />
      <Sfx name="applause" at={endCard + 6} gain={0.6} />
    </>
  );
};

const Tag: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [4, 12, 80, 92], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div dir="rtl" style={{ position: "absolute", top: 180, right: 140, padding: "8px 26px", borderRadius: 30, background: "rgba(255,111,168,0.92)", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 38, opacity: o }}>
      يوميات جوانا ٨: يوم المسابقة
    </div>
  );
};

/** «يوميات جوانا» — Episode 8 (season 1 finale): competition day (lesson: the real win is becoming a team). */
export const JoannaEp8: React.FC = () => (
  <AbsoluteFill style={{ background: "#241A33" }}>
    <Scene1 />
    <Scene2 />
    <Scene3 />
    <Tag />
    {T.scenes.map((s) => (
      <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/joanna8/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />
    ))}
    <Audio
      src={staticFile("audio/joanna8/music/theme.mp3")}
      volume={(f) => {
        const inVoice = T.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 6);
        const fd = interpolate(f, [0, 6, 2070, 2100], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (inVoice ? db(-22) : db(-15)) * fd;
      }}
    />
  </AbsoluteFill>
);
