import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import data from "../data/joanna6-timeline.json";
import mouthData from "../data/joanna6-mouth.json";
import { createSound } from "../components/Sound";
import { findScene, type TimelineData } from "../lib/timing";
import { db } from "../theme";
import { Kid, Teacher, type KidProps } from "./chars";
import { Hall } from "./Ep5";
import { blinkAt, Cam, ease, Flash, FONT, Shot, Svg } from "./Joanna";

const T = data as TimelineData;
const MOUTH = mouthData as Record<string, number[]>;
const { Sfx } = createSound(T, "audio/joanna6", {
  whoosh: db(-14),
  pop: db(-12),
  boing: db(-11),
  steps: db(-14),
  sparkle: db(-12),
  tada: db(-11),
  swoosh: db(-11),
  mystery: db(-11),
  gasp: db(-10),
  suspense: db(-9),
  laugh: db(-12),
  giggle: db(-10),
  scratch: db(-10),
  tiptoe: db(-12),
  yay: db(-11),
  hug: db(-11),
  tick: db(-13),
  feedback: db(-14),
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

/* ---------------------------------------------------------------- props & art room */

const Magnifier: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = -30 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-10} y={40} width={20} height={90} rx={8} fill="#6B4523" />
    <circle cx={0} cy={0} r={50} fill="#BFE6FF" fillOpacity={0.45} stroke="#3E2716" strokeWidth={12} />
    <path d="M-24 -20 q10 -16 28 -18" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

export const Mic: React.FC<{ x: number; y: number; s: number; gold?: number; rot?: number }> = ({ x, y, s, gold = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-14} y={30} width={28} height={130} rx={10} fill={gold > 0.5 ? "#D4A21E" : "#333"} />
    <circle cx={0} cy={0} r={46} fill={gold > 0.5 ? "#FFD23F" : "#9AA6B2"} stroke={gold > 0.5 ? "#C48A10" : "#555"} strokeWidth={8} />
    {[-20, 0, 20].map((d) => (
      <line key={d} x1={-36} x2={36} y1={d} y2={d} stroke={gold > 0.5 ? "#C48A10" : "#666"} strokeWidth={4} opacity={0.6} />
    ))}
    {gold > 0.5 && <path d="M-22 -26 q10 -12 26 -12" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />}
  </g>
);

const StarTrail: React.FC<{ f: number; from: number; to: number; y: number; k?: number }> = ({ f, from, to, y, k = 1 }) => (
  <g>
    {Array.from({ length: 14 }).map((_, i) => {
      const x = from + ((to - from) * i) / 13;
      if ((i + 1) / 14 > k) return null;
      return <polygon key={i} points="0,-14 4,-4 14,-4 6,2 9,12 0,6 -9,12 -6,2 -14,-4 -4,-4" fill="#FFD23F" transform={`translate(${x} ${y + Math.sin(i) * 14}) rotate(${i * 25}) scale(${0.8 + 0.3 * Math.abs(Math.sin(f / 6 + i))})`} />;
    })}
  </g>
);

export const ArtRoom: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-1400} y={-800} width={3900} height={2200} fill="#FFE7C9" />
    <rect x={-1400} y={1260} width={3900} height={1400} fill="#D9A46A" />
    {/* drawings on the wall */}
    {[
      { x: -120, c: "#7FD3FF", d: "sun" },
      { x: 260, c: "#C8F2B5", d: "tree" },
      { x: 640, c: "#FFD1E3", d: "heart" },
      { x: 1000, c: "#E6E2F4", d: "star" },
    ].map((p, i) => (
      <g key={i} transform={`translate(${p.x} 420) rotate(${(i % 2 ? 3 : -3) + Math.sin(f / 40 + i)})`}>
        <rect x={-130} y={-150} width={260} height={300} rx={8} fill="#fff" stroke={p.c} strokeWidth={14} />
        {p.d === "sun" && <circle r={60} fill="#FFD23F" />}
        {p.d === "tree" && (
          <>
            <rect x={-12} y={10} width={24} height={90} fill="#8B5E34" />
            <circle cy={-20} r={70} fill="#4CAF50" />
          </>
        )}
        {p.d === "heart" && <path d="M0 50 C-90 -10 -50 -90 0 -40 C50 -90 90 -10 0 50Z" fill="#E8414B" />}
        {p.d === "star" && <polygon points="0,-70 20,-22 72,-22 30,10 46,62 0,30 -46,62 -30,10 -72,-22 -20,-22" fill="#8E5BD6" />}
      </g>
    ))}
    {/* easel */}
    <g transform="translate(900 1260)">
      <path d="M-120 0 L0 -560 L120 0" stroke="#8B5E34" strokeWidth={18} fill="none" />
      <rect x={-150} y={-520} width={300} height={260} fill="#fff" stroke="#C48A4C" strokeWidth={10} />
      <path d="M-120 -330 q60 -90 120 -20 t120 -30" stroke="#FF6FA8" strokeWidth={14} fill="none" />
    </g>
    {/* table with paint pots */}
    <rect x={-60} y={1380} width={700} height={40} rx={12} fill="#C48A4C" />
    {["#E8414B", "#FFD23F", "#2F6FD1", "#4CAF50"].map((c, i) => (
      <g key={c}>
        <rect x={20 + i * 90} y={1320} width={60} height={60} rx={10} fill="#fff" stroke="#ccc" strokeWidth={4} />
        <ellipse cx={50 + i * 90} cy={1326} rx={26} ry={10} fill={c} />
      </g>
    ))}
  </g>
);

/* ---------------------------------------------------------------- scenes */

const Scene1: React.FC = () => {
  const s2 = line("R02-F").from;
  const s3 = line("R03-M").from;
  const sing = at("R03-M") + Math.round((line("R03-M").words.find((w) => w.text.includes("لا"))?.start ?? 120) - line("R03-M").voFrom);
  const s4 = line("R04-K").from;
  return (
    <>
      <Shot from={0} to={s2}>
        {(f, l) => {
          const k = spring({ frame: l, fps: 30, config: { stiffness: 160, damping: 13 } });
          return (
            <Svg>
              <Cam fx={460} fy={interpolate(k, [0, 1], [1250, 1150])} z={interpolate(k, [0, 1], [2.6, 2.0])}>
                <Hall f={f} />
                <Jo f={f} x={460} y={1760} expr="sly" look={[0.4, 0]} tilt={-6} armR={{ target: [230, -700] }} />
                <Magnifier x={460 + 0.55 * 260} y={1760 - 0.55 * 760} s={0.7} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Shot from={s2} to={s4}>
        {(f, l) => {
          const singing = f >= sing - 2;
          const cover = singing ? ease(f, sing, sing + 6) : 0;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={f < s3 ? 420 : 640} fy={1160} z={1.45}>
                  <Hall f={f} />
                  <Sara f={f} x={200} y={1760} expr={cover > 0 ? "laugh" : "sly"} look={[1, 0]} armR={cover > 0 ? { target: [-150, -720] } : { target: [300, -620] }} armL={cover > 0 ? { target: [150, -720] } : {}} armsFront={cover > 0} />
                  <Jo f={f} x={440} y={1760} expr={cover > 0 ? "laugh" : "smile"} look={[1, 0]} armR={cover > 0 ? { target: [150, -720] } : {}} armL={cover > 0 ? { target: [-150, -720] } : {}} armsFront={cover > 0} />
                  <Mazen f={f} x={760} y={1780} expr={singing ? "laugh" : f >= s3 ? "worry" : "shock"} look={[-0.8, -0.2]} tilt={singing ? Math.sin(f / 3) * 8 : 0} armL={singing ? { a: 150, b: 175 } : f >= s3 ? { a: 60, b: 130 } : {}} armR={singing ? { a: 150, b: 175 } : f >= s3 ? { a: 60, b: 130 } : {}} />
                  {singing &&
                    [0, 1, 2, 3].map((i) => (
                      <text key={i} x={760 + Math.cos(i * 1.6 + f / 8) * 220} y={1180 + Math.sin(i * 1.6 + f / 8) * 120} fontSize={70} fill={["#FFD23F", "#FF6FA8", "#7FD3FF", "#8EE07A"][i]} textAnchor="middle">
                        ♪
                      </text>
                    ))}
                </Cam>
              </Svg>
              {l < 6 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="mystery" at={4} />
      <Sfx name="sparkle" at={8} gain={0.6} />
      <Sfx name="scratch" at={s2 + 10} gain={0.6} />
      <Sfx name="boing" at={s3 + 2} gain={0.7} />
      <Sfx name="laugh" at={sing + 14} gain={0.6} />
    </>
  );
};

const Scene2: React.FC = () => {
  const s4 = line("R04-K").from;
  const k4 = at("R04-K");
  const s5 = line("R05-J").from;
  const s6 = line("R06-L").from;
  return (
    <>
      <Shot from={s4} to={s5}>
        {(f, l) => {
          const look = ease(f, k4 - 10, k4 + 6);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={interpolate(look, [0, 1], [640, 560])} fy={interpolate(look, [0, 1], [1200, 1500])} z={interpolate(look, [0, 1], [1.6, 2.2])}>
                  <Hall f={f} />
                  <Khaled f={f} x={720} y={1780} expr="shock" look={[-0.4, 1]} armL={{ target: [-300, -420] }} />
                  <StarTrail f={f} from={200} to={900} y={1700} k={ease(l, 10, 40)} />
                </Cam>
              </Svg>
              {l < 6 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* tiptoeing along the trail */}
      <Shot from={s5} to={s6}>
        {(f, l) => {
          const cx = interpolate(l, [0, s6 - s5], [300, 1300]);
          return (
            <Svg>
              <Cam fx={cx} fy={1180} z={1.35}>
                <Hall f={f} />
                <StarTrail f={f} from={0} to={2200} y={1810} />
                <Jo f={f} x={cx + 240} y={1780} walk={l / 6} expr="sly" look={[0.8, 0.6]} armR={{ target: [230, -700] }} />
                <Magnifier x={cx + 240 + 0.55 * 260} y={1780 - 0.55 * 760} s={0.7} />
                <Sara f={f} x={cx + 20} y={1780} walk={l / 6 + 1} expr="worry" look={[0.8, 0]} />
                <Khaled f={f} x={cx - 200} y={1790} walk={l / 6 + 2} expr="smile" look={[0.8, 0.4]} />
                <Mazen f={f} x={cx - 400} y={1790} walk={l / 6 + 3} expr="worry" look={[0.8, 0]} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Sfx name="sparkle" at={k4 - 6} />
      <Sfx name="tiptoe" at={s5 + 4} />
      <Sfx name="steps" at={s5 + 30} gain={0.4} />
    </>
  );
};

const Scene3: React.FC = () => {
  const s6 = line("R06-L").from;
  const l6 = at("R06-L");
  const s7 = line("R07-L").from;
  const s8 = line("R08-J").from;
  const s9 = line("R09-M").from;
  const e9 = endOf("R09-M");
  const s10 = line("R10-J").from;
  const turn = l6 - 40;
  return (
    <>
      <Shot from={s6} to={s8}>
        {(f, l) => {
          const turned = f > turn;
          const pop = turned ? spring({ frame: f - turn, fps: 30, config: { stiffness: 200, damping: 12 } }) : 0;
          const close = f >= s7;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={close ? 520 : 600} fy={close ? 1150 : 1200} z={close ? 2.1 : 1.5}>
                  <ArtRoom f={f} />
                  <Layan f={f} x={540} y={1760} expr={turned ? (close ? "smile" : "worry") : "smile"} look={turned ? [0, 0.3] : [0.9, -0.6]} tilt={turned ? -5 : 0} armR={{ target: [150, -560] }} armL={{ target: [-60, -520] }} />
                  <Mic x={540 + 0.55 * 110} y={1760 - 0.55 * 610} s={0.5} gold={1} rot={-15} />
                  {pop > 0.3 &&
                    [0, 1, 2, 3, 4].map((i) => (
                      <polygon key={i} points="0,-14 4,-4 14,-4 6,2 9,12 0,6 -9,12 -6,2 -14,-4 -4,-4" fill="#FFF3C4" transform={`translate(${600 + Math.cos(i * 1.26 + f / 10) * 120} ${1420 + Math.sin(i * 1.26 + f / 10) * 90}) scale(${pop * 1.4})`} />
                    ))}
                  {!close && <Jo f={f} x={140} y={1780} expr={turned ? "shock" : "sly"} look={[1, -0.2]} />}
                </Cam>
              </Svg>
              {l < 8 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={s8} to={s10}>
        {(f) => {
          const testing = f >= s9;
          const squeal = f > e9 - 6 && f < e9 + 22;
          const shake = squeal ? Math.sin(f * 3) * 8 : 0;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540 + shake} fy={1160} z={1.45}>
                  <ArtRoom f={f} />
                  <Layan f={f} x={160} y={1760} expr={squeal ? "shock" : "happy"} look={[1, 0]} armL={squeal ? { target: [-150, -720] } : {}} armR={squeal ? { target: [150, -720] } : {}} armsFront={squeal} />
                  <Jo f={f} x={420} y={1760} expr={squeal ? "shock" : "happy"} look={testing ? [1, 0] : [-1, 0]} armL={squeal ? { target: [-150, -720] } : {}} armR={squeal ? { target: [150, -720] } : {}} armsFront={squeal} />
                  <Mazen f={f} x={720} y={1780} expr={squeal ? "shock" : testing ? "happy" : "smile"} look={[-0.4, 0]} armR={{ target: [90, -640] }} />
                  <Mic x={720 + 0.55 * 90} y={1780 - 0.55 * 700} s={0.5} gold={1} />
                  <Khaled f={f} x={960} y={1790} expr={squeal ? "laugh" : "smile"} look={[-0.8, 0]} />
                  {squeal && [0, 1, 2].map((i) => <circle key={i} cx={720 + 0.55 * 90} cy={1780 - 0.55 * 760} r={60 + ((f * 9 + i * 40) % 160)} fill="none" stroke="#FFD23F" strokeWidth={6} opacity={0.7} />)}
                </Cam>
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="gasp" at={turn} />
      <Sfx name="sparkle" at={turn + 4} />
      <Sfx name="pop" at={s8 + 2} gain={0.6} />
      <Sfx name="feedback" at={e9 - 6} />
      <Sfx name="laugh" at={e9 + 20} gain={0.5} />
    </>
  );
};

const Scene4: React.FC = () => {
  const s10 = line("R10-J").from;
  const s11 = line("R11-T").from;
  const s12 = line("R12-J").from;
  const e12 = endOf("R12-J");
  const endCard = e12 + 8;
  return (
    <>
      <Shot from={s10} to={s11}>
        {(f, l) => (
          <Svg>
            <Cam fx={540} fy={1130} z={1.3}>
              <ArtRoom f={f} />
              <Layan f={f} x={140} y={1760} expr="happy" look={[1, 0]} tilt={6} armR={{ target: [330, -580] }} />
              <Jo f={f} x={400} y={1760} expr="proud" look={[0, 0]} armL={{ target: [-330, -580] }} armR={{ target: [330, -580] }} />
              <Sara f={f} x={660} y={1760} expr="happy" look={[-0.8, 0]} armL={{ target: [-330, -580] }} />
              <Mazen f={f} x={880} y={1780} expr="happy" look={[-0.8, 0]} armR={{ target: [90, -640] }} />
              <Mic x={880 + 0.55 * 90} y={1780 - 0.55 * 700} s={0.5} gold={1} />
              <Khaled f={f} x={1060} y={1790} expr="happy" look={[-0.8, 0]} />
              {l > 60 && [0, 1, 2].map((i) => <path key={i} d="M0 30 C-45 0 -25 -45 0 -20 C25 -45 45 0 0 30Z" fill="#FF6FA8" transform={`translate(${300 + i * 200} ${1100 - ((l * 2 + i * 50) % 160)}) scale(1.2)`} opacity={0.7} />)}
            </Cam>
          </Svg>
        )}
      </Shot>
      <Shot from={s11} to={s12}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={760} fy={880} z={1.5}>
                <ArtRoom f={f} />
                <Teacher x={800} y={1500} s={0.72} expr="happy" talk={talkOf("T", f)} blink={blinkAt(f, 5)} look={[-0.6, 0.3]} tilt={-4} book armL={{ a: 50, b: 110 }} />
              </Cam>
            </Svg>
            {l < 6 && <Flash l={l} />}
          </AbsoluteFill>
        )}
      </Shot>
      <Shot from={s12} to={endCard}>
        {(f, l) => {
          const push = ease(l, 0, 60);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={400} fy={interpolate(push, [0, 1], [1200, 1330])} z={interpolate(push, [0, 1], [2.3, 4.2])}>
                  <ArtRoom f={f} />
                  <Jo f={f} x={400} y={1760} expr="shock" look={[0, 0]} sweat={1} armL={{ a: 150, b: 200 }} armR={{ a: 150, b: 200 }} />
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 45%, transparent 35%, rgba(10,5,30,${0.3 * push}) 100%)` }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={endCard} to={1950}>
        {(_f, l) => {
          const k = spring({ frame: l, fps: 30, config: { stiffness: 180, damping: 12 } });
          return (
            <AbsoluteFill style={{ background: "radial-gradient(80% 60% at 50% 45%, #3B2A6B 0%, #120A24 100%)" }}>
              <div dir="rtl" style={{ position: "absolute", top: 560, left: 80, right: 130, textAlign: "center", fontFamily: FONT, color: "#fff", scale: String(k) }}>
                <div style={{ fontWeight: 800, fontSize: 130, lineHeight: 1.1, color: "#FF86B8", textShadow: "0 8px 0 #8E2E5E" }}>يتبع…</div>
                <div style={{ marginTop: 26, fontWeight: 700, fontSize: 58, lineHeight: 1.35 }}>الحلقة السابعة:</div>
                <div style={{ fontWeight: 800, fontSize: 72, lineHeight: 1.3, color: "#FFD23F" }}>البروفة الكارثية! 🎭</div>
              </div>
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="hug" at={s10 + 40} />
      <Sfx name="whoosh" at={s11} gain={0.6} />
      <Sfx name="scratch" at={s12} gain={0.7} />
      <Sfx name="suspense" at={s12 + 30} />
      <Sfx name="swoosh" at={endCard} />
    </>
  );
};

const Tag: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [4, 12, 80, 92], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div dir="rtl" style={{ position: "absolute", top: 180, right: 140, padding: "8px 26px", borderRadius: 30, background: "rgba(255,111,168,0.92)", color: "#fff", fontFamily: FONT, fontWeight: 700, fontSize: 38, opacity: o }}>
      يوميات جوانا ٦: اختفاء الميكروفون
    </div>
  );
};

/** «يوميات جوانا» — Episode 6: the missing microphone (lesson: tell your team before you act). */
export const JoannaEp6: React.FC = () => (
  <AbsoluteFill style={{ background: "#2E2440" }}>
    <Scene1 />
    <Scene2 />
    <Scene3 />
    <Scene4 />
    <Tag />
    {T.scenes.map((s) => (
      <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/joanna6/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />
    ))}
    <Audio
      src={staticFile("audio/joanna6/music/theme.mp3")}
      volume={(f) => {
        const inVoice = T.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 6);
        const fd = interpolate(f, [0, 6, 1920, 1950], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (inVoice ? db(-22) : db(-15)) * fd;
      }}
    />
  </AbsoluteFill>
);
