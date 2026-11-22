import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import data from "../data/joanna3-timeline.json";
import mouthData from "../data/joanna3-mouth.json";
import { createSound } from "../components/Sound";
import { findScene, type TimelineData } from "../lib/timing";
import { db } from "../theme";
import { Backpack, Kid, Teacher, type Arm, type Expr } from "./chars";
import { blinkAt, Cam, Classmates, Classroom, Desk, ease, Flash, FONT, SchoolYard, Shot, Svg } from "./Joanna";

const T = data as TimelineData;
const MOUTH = mouthData as Record<string, number[]>;
const { Sfx } = createSound(T, "audio/joanna3", {
  whoosh: db(-14),
  pop: db(-12),
  boing: db(-11),
  scratch: db(-10),
  steps: db(-14),
  tiptoe: db(-12),
  laugh: db(-11),
  giggle: db(-9),
  swoosh: db(-11),
  sparkle: db(-12),
  tada: db(-11),
  birds: db(-18),
  bell: db(-12),
  jump: db(-11),
  lid: db(-10),
  sad: db(-11),
  sneak: db(-12),
  crunch: db(-8),
  yum: db(-11),
  munch: db(-11),
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

/* ---------------------------------------------------------------- food */

const Broccoli: React.FC<{ x: number; y: number; s: number; rot?: number; bitten?: boolean }> = ({ x, y, s, rot = 0, bitten }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-14 0 L-20 70 Q0 82 20 70 L14 0Z" fill="#9CCB6B" />
    {[[-40, -20, 38], [0, -40, 44], [40, -20, 38], [-22, 10, 30], [22, 10, 30]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? "#3E9B47" : "#4CAF50"} />
    ))}
    <circle cx={-10} cy={-52} r={10} fill="#8FD694" opacity={0.7} />
    {bitten && <circle cx={44} cy={-36} r={34} fill="#F6E7C8" />}
  </g>
);
const Carrot: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-16 -70 Q0 -80 16 -70 L4 60 Q0 70 -4 60Z" fill="#FF8C2B" />
    <path d="M-8 -40 h10 M-6 -10 h12 M-4 20 h8" stroke="#E06A10" strokeWidth={4} />
    <path d="M0 -72 l-14 -26 M0 -72 l0 -30 M0 -72 l14 -26" stroke="#4CAF50" strokeWidth={8} strokeLinecap="round" />
  </g>
);
const Cucumber: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={30} fill="#3E8E41" />
    <circle r={24} fill="#C8E6A0" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <circle key={i} cx={Math.cos(i) * 12} cy={Math.sin(i) * 12} r={3} fill="#9CC26E" />
    ))}
  </g>
);
const Strawberry: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 -14 Q0 -30 30 -14 Q26 30 0 44 Q-26 30 -30 -14Z" fill="#E8414B" />
    <path d="M-18 -20 l8 -14 l10 10 l10 -10 l8 14Z" fill="#4CAF50" />
    {[[-12, 0], [10, 2], [0, 18], [-8, 28], [12, 22]].map(([a, b], i) => (
      <ellipse key={i} cx={a} cy={b} rx={2.5} ry={4} fill="#FFE066" />
    ))}
  </g>
);
const Grapes: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[[-20, -20], [0, -24], [20, -20], [-10, 0], [10, 0], [0, 20]].map(([a, b], i) => (
      <circle key={i} cx={a} cy={b} r={16} fill="#8E5BD6" stroke="#6A3FB0" strokeWidth={3} />
    ))}
  </g>
);

/** Pink lunchbox; open > 0 shows the healthy lunch in compartments. */
const PinkBox: React.FC<{ x: number; y: number; s: number; open?: number; hidden?: { broccoli?: number; carrot?: number } }> = ({ x, y, s, open = 0, hidden = {} }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={210} ry={26} fill="url(#aoShadow)" />
    <rect x={-190} y={-150} width={380} height={150} rx={30} fill="#FF86B8" stroke="#D9508A" strokeWidth={7} />
    {open > 0 && (
      <g>
        <rect x={-170} y={-135} width={110} height={120} rx={14} fill="#FFE3EF" />
        <rect x={-50} y={-135} width={100} height={120} rx={14} fill="#FFE3EF" />
        <rect x={60} y={-135} width={110} height={120} rx={14} fill="#FFE3EF" />
        <g opacity={1 - (hidden.broccoli ?? 0)}>
          <Broccoli x={-115} y={-90} s={0.6} />
        </g>
        <g opacity={1 - (hidden.carrot ?? 0)}>
          <Carrot x={-20} y={-75} s={0.55} rot={20} />
          <Carrot x={18} y={-75} s={0.55} rot={-15} />
        </g>
        <Cucumber x={90} y={-100} s={0.7} />
        <Cucumber x={140} y={-60} s={0.7} />
        <Grapes x={-130} y={-45} s={0.5} />
        <Strawberry x={95} y={-45} s={0.6} />
      </g>
    )}
    {open < 1 ? (
      <g transform={`rotate(${-open * 80} -190 -150) translate(0 ${-open * 12})`}>
        <rect x={-198} y={-186} width={396} height={46} rx={20} fill="#FF6FA8" stroke="#D9508A" strokeWidth={7} />
        <circle cx={0} cy={-163} r={14} fill="#FFD84D" />
      </g>
    ) : (
      <g transform="translate(330 -10) scale(0.55)">
        <rect x={-198} y={-40} width={396} height={46} rx={20} fill="#FF6FA8" stroke="#D9508A" strokeWidth={7} />
      </g>
    )}
  </g>
);

const PicnicTable: React.FC = () => (
  <g>
    <rect x={60} y={1385} width={960} height={44} rx={14} fill="url(#wood)" />
    <rect x={60} y={1385} width={960} height={12} rx={6} fill="#F3C993" />
    <rect x={120} y={1429} width={36} height={340} fill="#A8743E" />
    <rect x={924} y={1429} width={36} height={340} fill="#A8743E" />
    <rect x={60} y={1429} width={960} height={30} fill="#000" opacity={0.12} />
  </g>
);

type KidP = { expr?: Expr; talk?: number; look?: [number, number]; tilt?: number; armL?: Arm; armR?: Arm; front?: boolean; sweat?: number };
const Bench: React.FC<{ f: number; j?: KidP; fr?: KidP; children?: React.ReactNode; over?: React.ReactNode }> = ({ f, j = {}, fr = {}, children, over }) => (
  <>
    <SchoolYard f={f} />
    <Kid x={330} y={1520} s={0.55} who="joanna" seated expr={j.expr ?? "smile"} talk={j.talk ?? 0} blink={blinkAt(f, 1)} look={j.look ?? [0.6, 0]} tilt={j.tilt ?? 0} armL={j.armL} armR={j.armR} armsFront={j.front} sweat={j.sweat} />
    <Kid x={770} y={1520} s={0.55} who="friend" seated expr={fr.expr ?? "smile"} talk={fr.talk ?? 0} blink={blinkAt(f, 2)} look={fr.look ?? [-0.6, 0]} tilt={fr.tilt ?? 0} armL={fr.armL} armR={fr.armR} />
    <PicnicTable />
    {children}
    {over}
  </>
);

/* ---------------------------------------------------------------- scenes */

const Scene1: React.FC = () => {
  const b = line("N02-J").from;
  return (
    <>
      {/* bell rings, Joanna jumps up */}
      <Shot from={0} to={b}>
        {(f, l) => {
          const jump = l > 26 ? Math.abs(Math.sin(((l - 26) / 18) * Math.PI)) * (l < 62 ? 1 : 0) : 0;
          const standing = l > 22;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={1060} z={1.45}>
                  <Classroom f={f} board="الفسحة!" />
                  <Classmates f={f} y={1300} laugh={standing ? 0.4 : 0} />
                  {standing ? (
                    <Kid x={540} y={1700 - jump * 120} s={0.55} who="joanna" expr="happy" talk={talkOf("J", f)} blink={blinkAt(f, 1)} look={[0, -0.3]} armL={{ a: 150 + Math.sin(l / 3) * 12, b: 170 }} armR={{ a: 150 + Math.sin(l / 3 + 1) * 12, b: 170 }} />
                  ) : (
                    <>
                      <Kid x={540} y={1560} s={0.55} who="joanna" seated expr="smile" blink={blinkAt(f, 1)} look={[0, -0.6]} />
                      <Desk x={540} y={1480} s={1.0} />
                    </>
                  )}
                </Cam>
              </Svg>
              {l < 12 && <AbsoluteFill style={{ background: `repeating-radial-gradient(circle at 50% 30%, rgba(255,214,90,0.0) 0 40px, rgba(255,214,90,${0.25 * (1 - l / 12)}) 40px 60px)` }} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* outside at the table: the lunchbox comes out */}
      <Shot from={b} to={line("N03-J").from}>
        {(f, l) => {
          const out = ease(l, 4, 26);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={1180} z={1.3}>
                  <Bench f={f} j={{ expr: "happy", talk: talkOf("J", f), look: [0.7, 0], armR: { target: [200 - out * 40, -420 - out * 60] } }} fr={{ expr: "smile", look: [-0.8, 0] }}>
                    <Backpack x={120} y={1520} s={0.42} open={1} />
                    <PinkBox x={interpolate(out, [0, 1], [140, 470])} y={interpolate(out, [0, 1], [1380, 1390]) - Math.sin(out * Math.PI) * 140} s={0.5} />
                  </Bench>
                </Cam>
              </Svg>
              {l < 8 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="bell" at={4} />
      <Sfx name="jump" at={26} />
      <Sfx name="whoosh" at={b} />
      <Sfx name="birds" at={b} />
      <Sfx name="pop" at={b + 24} />
    </>
  );
};

const Scene2: React.FC = () => {
  const s3 = line("N03-J").from;
  const j3 = at("N03-J");
  const s4 = line("N04-F").from;
  const s5 = line("N05-J").from;
  const s6 = line("N06-T").from;
  const lidAt = s3 + 14;
  return (
    <>
      {/* top-down insert: the box opens */}
      <Shot from={s3} to={s3 + 50}>
        {(f, l) => {
          const open = ease(f, lidAt, lidAt + 14);
          return (
            <AbsoluteFill style={{ background: "#C9915A" }}>
              <Svg>
                <rect x={0} y={0} width={1080} height={1920} fill="#D9A46A" />
                {Array.from({ length: 9 }).map((_, i) => (
                  <rect key={i} x={0} y={i * 230} width={1080} height={6} fill="#C48A4C" />
                ))}
                <g transform={`translate(540 1100) scale(${2.2 + l * 0.004})`}>
                  <PinkBox x={0} y={80} s={1} open={open} />
                </g>
                {open > 0.9 && (
                  <g opacity={1 - ease(l, 30, 46)}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <circle key={i} cx={540 + Math.cos(i * 0.63) * (260 + l * 4)} cy={900 + Math.sin(i * 0.63) * (200 + l * 3)} r={10} fill="#FFE066" />
                    ))}
                  </g>
                )}
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* happy -> shock close-up */}
      <Shot from={s3 + 50} to={s4}>
        {(f, l) => {
          const shock = f > j3 - 10;
          const z = shock ? 2.5 + spring({ frame: f - (j3 - 10), fps: 30, config: { stiffness: 260, damping: 12 } }) * 0.3 : 2.2;
          return (
            <Svg>
              <Cam fx={330 + (shock ? Math.sin(l * 2) * 3 * Math.max(0, 1 - (f - j3 + 10) / 14) : 0)} fy={1110} z={z}>
                <Bench f={f} j={{ expr: shock ? "shock" : "happy", talk: talkOf("J", f), look: shock ? [0.3, 0.6] : [0.5, 0.8], sweat: shock ? 1 : 0, armL: shock ? { a: 120, b: 170 } : {}, armR: shock ? { a: 120, b: 170 } : { a: 30, b: 60 } }} fr={{ look: [-0.8, 0.4] }}>
                  <PinkBox x={470} y={1390} s={0.5} open={1} />
                </Bench>
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* friend: looks like a healthy lunch */}
      <Shot from={s4} to={s5}>
        {(f) => (
          <Svg>
            <Cam fx={640} fy={1170} z={1.7}>
              <Bench f={f} j={{ expr: "worry", look: [0.8, 0.2], sweat: 1 }} fr={{ expr: "happy", talk: talkOf("F", f), look: [-0.7, 0.5], armL: { a: 40, b: 120 } }}>
                <PinkBox x={470} y={1390} s={0.5} open={1} />
              </Bench>
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* whisper to camera */}
      <Shot from={s5} to={s6}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={330} fy={interpolate(ease(l, 0, 16), [0, 1], [1110, 1080])} z={interpolate(ease(l, 0, 16), [0, 1], [2.2, 2.7])}>
                <Bench f={f} j={{ expr: "sly", talk: talkOf("J", f), look: [0, 0], tilt: -6, front: true, armL: { target: [-215, -700] } }}>
                  <PinkBox x={470} y={1390} s={0.5} open={1} />
                </Bench>
              </Cam>
            </Svg>
            <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 50% 45%, transparent 50%, rgba(40,20,60,${0.4 * ease(l, 0, 16)}) 100%)` }} />
          </AbsoluteFill>
        )}
      </Shot>
      <Sfx name="whoosh" at={s3} gain={0.6} />
      <Sfx name="lid" at={lidAt} />
      <Sfx name="tada" at={lidAt + 6} gain={0.7} />
      <Sfx name="sad" at={j3 - 10} />
      <Sfx name="boing" at={j3 - 8} gain={0.6} />
      <Sfx name="pop" at={s5} gain={0.6} />
    </>
  );
};

const Scene3: React.FC = () => {
  const s6 = line("N06-T").from;
  const t6 = at("N06-T");
  const s7 = line("N07-J").from;
  const e7 = endOf("N07-J");
  const s8 = line("N08-T").from;
  const napkinAt = s6 + 6;
  const pocketAt = s6 + 40;
  return (
    <>
      {/* the plan: napkin over the broccoli, carrots in the pocket; teacher arrives */}
      <Shot from={s6} to={s7}>
        {(f, l) => {
          const nap = ease(f, napkinAt, napkinAt + 14);
          const car = ease(f, pocketAt, pocketAt + 16);
          const tIn = ease(f, t6 - 40, t6 - 4);
          const caught = f > t6 - 6;
          const handR: [number, number] = car > 0 && car < 1 ? [interpolate(car, [0, 1], [260, 70]), interpolate(car, [0, 1], [-230, -330])] : nap > 0 && nap < 1 ? [interpolate(nap, [0, 1], [150, 260]), -240] : [90, -300];
          return (
            <Svg>
              <Cam fx={interpolate(tIn, [0, 1], [400, 560])} fy={interpolate(tIn, [0, 1], [1200, 1060])} z={interpolate(tIn, [0, 1], [1.9, 1.25])}>
                <Bench f={f} j={{ expr: caught ? "shock" : "sly", look: caught ? [1, -0.5] : [0.7, 0.6], armR: { target: handR }, sweat: caught ? 1 : 0, tilt: caught ? 0 : Math.sin(l / 4) * 3 }} fr={{ expr: "smile", look: [-0.8, 0.4] }}>
                  <PinkBox x={470} y={1390} s={0.5} open={1} hidden={{ broccoli: nap, carrot: car }} />
                  {nap > 0 && <path d={`M${415 - 40 * nap} 1348 q40 ${-30 * nap} 80 0 q-20 ${20 * nap} -80 0Z`} fill="#fff" stroke="#DDE3EA" strokeWidth={3} opacity={nap} />}
                  {car > 0 && car < 1 && <Carrot x={330 + 0.55 * handR[0]} y={1520 + 0.55 * handR[1]} s={0.3} rot={-30} />}
                  {car >= 1 && <Carrot x={330 + 0.55 * 70} y={1520 - 0.55 * 360} s={0.26} rot={10} />}
                  {tIn > 0 && <Teacher x={interpolate(tIn, [0, 1], [1300, 990])} y={1660} s={0.72} walk={tIn < 1 ? f / 4 : undefined} expr="smile" talk={talkOf("T", f)} blink={blinkAt(f, 5)} look={[-0.8, 0.5]} tilt={-6} armL={{ a: 30, b: 80 }} armR={{ a: 14, b: 10 }} />}
                </Bench>
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* "the vegetables miss me" */}
      <Shot from={s7} to={s8}>
        {(f, l) => {
          const laugh = f > e7;
          return (
            <Svg>
              <Cam fx={laugh ? 560 : 360} fy={laugh ? 1150 : 1120} z={laugh ? 1.45 : 2.0}>
                <Bench f={f} j={{ expr: laugh ? "smile" : "happy", talk: talkOf("J", f), look: [1, -0.6], sweat: 1, armR: { a: 40 + Math.sin(l / 5) * 15, b: 130 } }} fr={{ expr: laugh ? "laugh" : "smile", look: [-0.8, -0.2], tilt: laugh ? Math.sin(f / 3) * 5 : 0 }}>
                  <PinkBox x={470} y={1390} s={0.5} open={1} hidden={{ broccoli: 1, carrot: 1 }} />
                  <path d="M375 1348 q40 -30 80 0 q-20 20 -80 0Z" fill="#fff" stroke="#DDE3EA" strokeWidth={3} />
                  <Carrot x={330 + 0.55 * 70} y={1520 - 0.55 * 360} s={0.26} rot={10} />
                </Bench>
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Sfx name="sneak" at={s6 + 2} />
      <Sfx name="pop" at={napkinAt + 12} gain={0.6} />
      <Sfx name="pop" at={pocketAt + 14} gain={0.6} />
      <Sfx name="steps" at={t6 - 40} gain={0.7} />
      <Sfx name="scratch" at={t6 - 6} gain={0.7} />
      <Sfx name="giggle" at={e7 + 2} gain={0.7} />
    </>
  );
};

const Scene4: React.FC = () => {
  const s8 = line("N08-T").from;
  const s9 = line("N09-J").from;
  const j9 = at("N09-J");
  const s10 = line("N10-J").from;
  const e10 = endOf("N10-J");
  const titleAt = 1740;
  const bite = j9 - 40;
  return (
    <>
      {/* teacher offers a broccoli floret */}
      <Shot from={s8} to={s9}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={720} fy={1000} z={1.6}>
                <SchoolYard f={f} />
                <Teacher x={790} y={1660} s={0.72} expr="happy" talk={talkOf("T", f)} blink={blinkAt(f, 5)} look={[-0.8, 0.4]} tilt={-6} armL={{ target: [-330, -800] }} armR={{ a: 14, b: 10 }} />
                <Broccoli x={790 - 0.72 * 330} y={1660 - 0.72 * 830} s={0.55} rot={-10} />
              </Cam>
            </Svg>
            {l < 6 && <Flash l={l} />}
          </AbsoluteFill>
        )}
      </Shot>
      {/* the bite and the surprise */}
      <Shot from={s9} to={s10}>
        {(f, l) => {
          const toMouth = ease(f, bite - 20, bite);
          const after = f > bite;
          const sparkle = after ? spring({ frame: f - bite - 10, fps: 30, config: { stiffness: 220, damping: 10 } }) : 0;
          const hand: [number, number] = [interpolate(toMouth, [0, 1], [230, 150]), interpolate(toMouth, [0, 1], [-420, -690])];
          return (
            <Svg>
              <Cam fx={340} fy={1100} z={2.3}>
                <Bench f={f} j={{ expr: after ? (f > j9 ? "happy" : "shock") : "worry", talk: talkOf("J", f), look: after ? [0, -0.2] : [0.4, 0.4], front: true, armR: { target: hand } }}>
                  <PinkBox x={470} y={1390} s={0.5} open={1} hidden={{ broccoli: 1, carrot: 1 }} />
                </Bench>
                <Broccoli x={330 + 0.55 * hand[0]} y={1520 + 0.55 * hand[1] - 20} s={0.32} rot={-20} bitten={after} />
                {sparkle > 0 &&
                  [0, 1, 2, 3, 4].map((i) => (
                    <path key={i} d="M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6Z" fill="#FFD23F" transform={`translate(${330 + Math.cos(i * 1.26) * 150} ${1100 + Math.sin(i * 1.26) * 120}) scale(${sparkle * (1 + 0.3 * Math.sin(f / 3 + i))})`} />
                  ))}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* the punchline, then everyone laughs and she eats happily */}
      <Shot from={s10} to={1800}>
        {(f, l) => {
          const wide = f > e10 + 4;
          const title = spring({ frame: f - titleAt, fps: 30, config: { stiffness: 200, damping: 11 } });
          const eat = wide ? Math.sin((f - e10) / 6) : 0;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={wide ? 550 : 350} fy={wide ? 1170 : 1090} z={wide ? 1.35 : 2.4}>
                  <Bench
                    f={f}
                    j={{ expr: wide ? (eat > 0 ? "happy" : "laugh") : "sly", talk: talkOf("J", f), look: wide ? [0.4, 0] : [0, 0], tilt: wide ? Math.sin(f / 4) * 4 : -5, front: wide, armR: wide ? { target: [interpolate(eat, [-1, 1], [230, 150]), interpolate(eat, [-1, 1], [-420, -680])] } : { a: 30, b: 60 }, armL: wide ? { a: 20, b: 50 } : { a: 150, b: 175 } }}
                    fr={{ expr: wide ? "laugh" : "smile", look: [-0.8, 0], tilt: wide ? Math.sin(f / 3 + 1) * 5 : 0 }}
                  >
                    <PinkBox x={470} y={1390} s={0.5} open={1} hidden={{ broccoli: wide ? 0 : 1, carrot: wide ? 0 : 1 }} />
                  </Bench>
                  {wide && (f - e10) % 24 < 12 && <Strawberry x={330 + 0.55 * 160} y={1520 - 0.55 * 640} s={0.4} />}
                  {wide && (f - e10) % 24 >= 12 && <Carrot x={330 + 0.55 * 160} y={1520 - 0.55 * 640} s={0.3} rot={-40} />}
                </Cam>
              </Svg>
              {f >= titleAt && (
                <AbsoluteFill style={{ background: `rgba(255,111,168,${0.92 * Math.min(1, title)})` }}>
                  <div dir="rtl" style={{ position: "absolute", top: 640, left: 80, right: 130, textAlign: "center", fontFamily: FONT, fontWeight: 800, color: "#fff", scale: String(title), textShadow: "0 8px 0 #C2407A, 0 18px 40px rgba(0,0,0,0.25)" }}>
                    <div style={{ fontSize: 80, lineHeight: 1.2 }}>يتبع في</div>
                    <div style={{ fontSize: 150, lineHeight: 1.15 }}>يوميات جوانا!</div>
                  </div>
                </AbsoluteFill>
              )}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="whoosh" at={s8} gain={0.6} />
      <Sfx name="tiptoe" at={s9 + 2} gain={0.6} />
      <Sfx name="crunch" at={bite} />
      <Sfx name="yum" at={bite + 10} />
      <Sfx name="whoosh" at={s10 + 2} gain={0.5} />
      <Sfx name="laugh" at={e10 + 4} />
      <Sfx name="munch" at={e10 + 30} />
      <Sfx name="swoosh" at={titleAt} />
    </>
  );
};

const OpeningTitle: React.FC = () => {
  const f = useCurrentFrame();
  const k = spring({ frame: f - 6, fps: 30, config: { stiffness: 160, damping: 12 } });
  const out = interpolate(f, [70, 82], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (f > 84) return null;
  return (
    <div dir="rtl" style={{ position: "absolute", top: 230, left: 90, right: 140, textAlign: "center", fontFamily: FONT, color: "#fff", opacity: out, scale: String(0.6 + 0.4 * k), background: "rgba(255,111,168,0.95)", borderRadius: 48, padding: "18px 10px 26px", boxShadow: "0 16px 40px rgba(194,64,122,0.35)" }}>
      <div style={{ fontWeight: 800, fontSize: 112, lineHeight: 1.1, textShadow: "0 6px 0 #C2407A" }}>يوميات جوانا</div>
      <div style={{ marginTop: 10, display: "inline-block", padding: "4px 30px", borderRadius: 40, background: "#fff", color: "#D9508A", fontWeight: 700, fontSize: 42 }}>الحلقة ٣: جوانا وصندوق الغدا الغريب</div>
    </div>
  );
};

/** «يوميات جوانا» — Episode 3: the strange lunchbox (same Joanna, same voices). */
export const JoannaEp3: React.FC = () => (
  <AbsoluteFill style={{ background: "#BFE6FF" }}>
    <Scene1 />
    <Scene2 />
    <Scene3 />
    <Scene4 />
    <OpeningTitle />
    {T.scenes.map((s) => (
      <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/joanna3/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />
    ))}
    <Audio
      src={staticFile("audio/joanna3/music/theme.mp3")}
      volume={(f) => {
        const inVoice = T.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 6);
        const fd = interpolate(f, [0, 6, 1770, 1800], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (inVoice ? db(-22) : db(-15)) * fd;
      }}
    />
  </AbsoluteFill>
);
