import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import data from "../data/joanna2-timeline.json";
import mouthData from "../data/joanna2-mouth.json";
import { createSound } from "../components/Sound";
import { findScene, type TimelineData } from "../lib/timing";
import { db } from "../theme";
import { Kid, Teacher } from "./chars";
import { blinkAt, Cam, Classmates, Classroom, Desk, ease, Flash, FONT, Shot, Svg } from "./Joanna";

const T = data as TimelineData;
const MOUTH = mouthData as Record<string, number[]>;
const { Sfx } = createSound(T, "audio/joanna2", {
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
  freeze: db(-10),
  eraser: db(-10),
  papers: db(-11),
  clock: db(-13),
  idea: db(-10),
  count: db(-13),
  snort: db(-9),
  stamp: db(-10),
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

const Apple: React.FC<{ x: number; y: number; s: number; o?: number }> = ({ x, y, s, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M0 -40 C-50 -70 -90 -20 -80 20 C-70 70 -30 80 0 64 C30 80 70 70 80 20 C90 -20 50 -70 0 -40Z" fill="#E8414B" />
    <path d="M-50 -10 q10 -30 30 -32" stroke="#fff" strokeOpacity={0.5} strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d="M0 -40 q4 -24 14 -34" stroke="#6B3E1E" strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d="M10 -64 q30 -20 46 4 q-26 14 -46 -4Z" fill="#4CAF50" />
  </g>
);

const Paper: React.FC<{ x: number; y: number; s: number; rot?: number; detail?: boolean }> = ({ x, y, s, rot = 0, detail }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-300} y={-400} width={600} height={800} rx={14} fill="#FFFFFF" stroke="#C9D2DC" strokeWidth={6} />
    {detail ? (
      <g fontFamily={FONT} direction="rtl" textAnchor="middle">
        <text x={0} y={-300} fontSize={58} fontWeight={800} fill="#2F6FD1">
          اختبار رياضيات
        </text>
        <text x={140} y={-215} fontSize={36} fontWeight={600} fill="#555">
          الاسم: جوانا
        </text>
        <line x1={-250} x2={250} y1={-185} y2={-185} stroke="#DDE3EA" strokeWidth={4} />
        <text x={0} y={-110} fontSize={40} fontWeight={700} fill="#222">
          ١) إذا معك ٥ تفاحات وأعطيت
        </text>
        <text x={0} y={-55} fontSize={40} fontWeight={700} fill="#222">
          صديقتك تفاحتين، كم يتبقى؟
        </text>
      </g>
    ) : (
      <g stroke="#D5DCE4" strokeWidth={10} strokeLinecap="round">
        <line x1={-200} x2={200} y1={-300} y2={-300} />
        <line x1={-230} x2={230} y1={-200} y2={-200} />
        <line x1={-230} x2={150} y1={-140} y2={-140} />
      </g>
    )}
  </g>
);

const TwoDesks: React.FC<{ f: number; jTalk?: number; fTalk?: number; jExpr?: React.ComponentProps<typeof Kid>["expr"]; fExpr?: React.ComponentProps<typeof Kid>["expr"]; jTilt?: number; fTilt?: number; jArmR?: React.ComponentProps<typeof Kid>["armR"]; jFront?: boolean; fArmL?: React.ComponentProps<typeof Kid>["armL"]; jLook?: [number, number]; fLook?: [number, number]; paper?: boolean }> = (p) => (
  <>
    <Kid x={330} y={1500} s={0.55} who="joanna" seated expr={p.jExpr ?? "smile"} talk={p.jTalk ?? 0} blink={blinkAt(p.f, 1)} look={p.jLook ?? [0.6, 0]} tilt={p.jTilt ?? 0} armR={p.jArmR} armsFront={p.jFront} />
    <Kid x={780} y={1500} s={0.55} who="friend" seated expr={p.fExpr ?? "smile"} talk={p.fTalk ?? 0} blink={blinkAt(p.f, 2)} look={p.fLook ?? [-0.6, 0]} tilt={p.fTilt ?? 0} armL={p.fArmL} />
    <Desk x={330} y={1420} s={0.75} />
    <Desk x={780} y={1420} s={0.75} />
    {p.paper && (
      <>
        <Paper x={330} y={1392} s={0.22} rot={-84} />
        <Paper x={780} y={1392} s={0.22} rot={-84} />
      </>
    )}
  </>
);

/* ---------------------------------------------------------------- scene 1 */

const Scene1: React.FC = () => {
  const t2 = at("M02-T");
  const s3 = line("M03-J").from;
  const j3 = at("M03-J");
  const surpriseWord = t2 + Math.round(line("M02-T").words[line("M02-T").words.length - 1].start - line("M02-T").voFrom);
  return (
    <>
      <Shot from={0} to={line("M02-T").from}>
        {(f, l) => {
          const k = ease(l, 0, 110);
          return (
            <Svg>
              <Cam fx={540} fy={1000} z={1.05}>
                <Classroom f={f} />
                <Classmates f={f} y={1300} />
                <Kid x={interpolate(k, [0, 1], [-160, 330])} y={1640} s={0.5} who="friend" walk={l < 110 ? l / 4.2 + 1 : undefined} expr="smile" blink={blinkAt(f, 2)} look={[0.7, 0]} />
                <Kid x={interpolate(k, [0, 1], [-420, 650])} y={1680} s={0.54} who="joanna" bag walk={l < 110 ? l / 4.2 : undefined} expr="proud" talk={talkOf("J", f)} blink={blinkAt(f, 1)} look={[-0.6, 0]} armR={l > 40 ? { a: 140 + Math.sin(l / 5) * 15, b: 160 } : { a: 12, b: 8 }} armL={{ a: 14, b: 8 }} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Shot from={line("M02-T").from} to={s3}>
        {(f, l) => {
          const punch = f >= surpriseWord ? spring({ frame: f - surpriseWord, fps: 30, config: { stiffness: 260, damping: 12 } }) : 0;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={560 + punch * 160} fy={820 - punch * 60} z={1.35 + punch * 0.55}>
                  <Classroom f={f} board="اختبار مفاجئ!" />
                  <Teacher x={780} y={1400} s={0.72} expr={punch > 0.2 ? "happy" : "smile"} talk={talkOf("T", f)} blink={blinkAt(f, 5)} look={[-0.4, 0.3]} armL={{ a: 60, b: 120 }} armR={{ target: [80, -700] }} book />
                </Cam>
              </Svg>
              {l < 8 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* freeze + slow eraser fall, then the line */}
      <Shot from={s3} to={line("M04-J").from}>
        {(f, l) => {
          const fall = ease(f, s3 + 6, j3 - 4);
          const ex = 330 + 120;
          const ey = interpolate(fall, [0, 1], [1290, 1740]);
          const frozen = f < j3;
          const zoom = frozen ? 1.9 + l * 0.004 : 2.4;
          return (
            <AbsoluteFill style={{ filter: frozen ? `saturate(${0.35 + 0.65 * ease(l, 30, 48)})` : undefined }}>
              <Svg>
                <Cam fx={frozen ? 400 : 330} fy={frozen ? 1300 : 1170} z={zoom}>
                  <Classroom f={f} />
                  <Kid x={330} y={1500} s={0.55} who="joanna" seated expr="shock" talk={talkOf("J", f)} blink={0} look={[0, 0]} sweat={frozen ? 0 : 1} armR={frozen ? { a: 60, b: 70 } : { a: 150, b: 200 }} armL={frozen ? { a: 20, b: 30 } : { a: 150, b: 200 }} />
                  <Desk x={330} y={1420} s={0.75} />
                  {f < j3 + 10 && <rect x={ex - 30} y={ey - 16} width={60} height={32} rx={8} fill="#FF8FB1" stroke="#D9508A" strokeWidth={4} transform={`rotate(${fall * 220} ${ex} ${ey})`} />}
                </Cam>
              </Svg>
              {l < 6 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Sfx name="steps" at={6} />
      <Sfx name="steps" at={60} gain={0.8} />
      <Sfx name="whoosh" at={line("M02-T").from} />
      <Sfx name="scratch" at={surpriseWord - 2} />
      <Sfx name="freeze" at={s3} />
      <Sfx name="eraser" at={s3 + 10} />
      <Sfx name="boing" at={j3} gain={0.7} />
    </>
  );
};

/* ---------------------------------------------------------------- scene 2 */

const Scene2: React.FC = () => {
  const s4 = line("M04-J").from;
  const j4 = at("M04-J");
  const s5 = line("M05-J").from;
  const j5 = at("M05-J");
  const s6 = line("M06-F").from;
  const s7 = line("M07-J").from;
  return (
    <>
      {/* papers handed out */}
      <Shot from={s4} to={j4}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={560} fy={1100} z={1.2}>
                <Classroom f={f} />
                <Teacher x={interpolate(ease(l, 0, l + 1), [0, 1], [900, 880])} y={1440} s={0.7} expr="smile" blink={blinkAt(f, 5)} look={[-0.6, 0.4]} paper armL={{ a: 50, b: 80 }} armR={{ a: 40, b: 70 }} walk={l / 4} />
                <TwoDesks f={f} jExpr="worry" fExpr="smile" jLook={[0.8, 0]} />
                {[0, 1].map((i) => {
                  const k = ease(l, 6 + i * 10, 22 + i * 10);
                  return <Paper key={i} x={interpolate(k, [0, 1], [820, i ? 780 : 330])} y={interpolate(k, [0, 1], [1080, 1392]) - Math.sin(k * Math.PI) * 120} s={0.22} rot={-84 * k + (1 - k) * 20} />;
                })}
              </Cam>
            </Svg>
            {l < 6 && <Flash l={l} />}
          </AbsoluteFill>
        )}
      </Shot>
      {/* insert: the question */}
      <Shot from={j4} to={s5}>
        {(f, l) => {
          const k = spring({ frame: l, fps: 30, config: { stiffness: 120, damping: 16 } });
          return (
            <AbsoluteFill style={{ background: "#C48A4C" }}>
              <Svg>
                <rect x={0} y={0} width={1080} height={1920} fill="#C9915A" />
                <g transform={`translate(0 ${(1 - k) * 200}) rotate(${(1 - k) * -4} 540 960)`}>
                  <Paper x={540} y={960} s={1.45} detail />
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Apple key={i} x={540 + (i - 2) * 150} y={1180} s={0.95} o={ease(l, 20 + i * 8, 28 + i * 8)} />
                  ))}
                  <rect x={330} y={1330} width={420} height={150} rx={20} fill="none" stroke="#2F6FD1" strokeWidth={8} strokeDasharray="22 14" />
                  <text x={540} y={1440} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={110} fill="#2F6FD1" opacity={0.5 + 0.5 * Math.abs(Math.sin(l / 8))}>
                    ؟
                  </text>
                </g>
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* counting on fingers, then the whisper */}
      <Shot from={s5} to={s6}>
        {(f, l) => {
          const counting = f < j5 - 4;
          const n = Math.min(5, Math.floor(l / 11) + 1);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={counting ? 360 : 520} fy={counting ? 1150 : 1180} z={counting ? 2.0 : 1.55}>
                  <Classroom f={f} />
                  <TwoDesks
                    f={f}
                    paper
                    jExpr={counting ? "worry" : "sly"}
                    jTalk={talkOf("J", f)}
                    jLook={counting ? [0.9, -0.8] : [1, 0]}
                    jTilt={counting ? -4 : 10}
                    jFront={!counting}
                    jArmR={counting ? { target: [230, -800 + Math.sin(l / 3) * 10] } : { target: [210, -700] }}
                    fExpr="smile"
                    fLook={[-0.9, 0]}
                  />
                  {counting &&
                    Array.from({ length: n }).map((_, i) => {
                      const k = spring({ frame: l - i * 11, fps: 30, config: { stiffness: 300, damping: 10 } });
                      return (
                        <text key={i} x={330 + 0.55 * 230 + (i - 2) * 38} y={1500 - 0.55 * 900 - k * 40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={56} fill="#2F6FD1" opacity={Math.min(1, k)}>
                          {"١٢٣٤٥"[i]}
                        </text>
                      );
                    })}
                </Cam>
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* friend laughs: "answer the question" */}
      <Shot from={s6} to={s7}>
        {(f, l) => (
          <Svg>
            <Cam fx={640} fy={1170} z={1.7}>
              <Classroom f={f} />
              <TwoDesks f={f} paper jExpr="worry" fExpr={talkOf("F", f) > 0.05 ? "happy" : "laugh"} fTalk={talkOf("F", f)} fTilt={Math.sin(l / 3) * 4} jLook={[1, 0]} fLook={[-1, 0]} fArmL={{ a: 40, b: 130 }} />
            </Cam>
          </Svg>
        )}
      </Shot>
      <Sfx name="papers" at={s4 + 2} />
      <Sfx name="pop" at={j4 + 2} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} name="count" at={s5 + i * 11} />
      ))}
      <Sfx name="tiptoe" at={j5 - 6} gain={0.6} />
      <Sfx name="giggle" at={s6 + 2} gain={0.5} />
    </>
  );
};

/* ---------------------------------------------------------------- scene 3 */

const Scene3: React.FC = () => {
  const s7 = line("M07-J").from;
  const j7 = at("M07-J");
  const s8 = line("M08-T").from;
  const s9 = line("M09-J").from;
  const e9 = endOf("M09-J");
  const s10 = line("M10-T").from;
  const idea = j7 - 14;
  return (
    <>
      {/* deep thinking, then the hand goes up */}
      <Shot from={s7} to={s8}>
        {(f, l) => {
          const thinking = f < idea;
          const up = f > idea ? spring({ frame: f - idea, fps: 30, config: { stiffness: 220, damping: 11 } }) : 0;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={330} fy={1120 + up * 20} z={2.1 - up * 0.3}>
                  <Classroom f={f} />
                  <Kid x={330} y={1500} s={0.55} who="joanna" seated expr={thinking ? "smile" : "happy"} talk={talkOf("J", f)} blink={thinking && l > 20 ? 1 : blinkAt(f, 1)} look={thinking ? [0.3, -1] : [0.4, -0.3]} tilt={thinking ? Math.sin(l / 10) * 6 : 0} armR={thinking ? { target: [80, -640] } : { a: 40 + up * 105, b: 40 + up * 130 }} armsFront={thinking} />
                  <Desk x={330} y={1420} s={0.75} />
                  {thinking &&
                    ["+", "−", "٥", "٢", "؟", "×"].map((c, i) => {
                      const a = l / 14 + (i / 6) * Math.PI * 2;
                      return (
                        <text key={c} x={330 + Math.cos(a) * 170} y={1500 - 0.55 * 770 - 40 + Math.sin(a) * 60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill="#2F6FD1" opacity={ease(l, 6, 20)}>
                          {c}
                        </text>
                      );
                    })}
                  {up > 0 && (
                    <g transform={`translate(${330 + 0.55 * 250} ${1500 - 0.55 * 1180}) scale(${up})`}>
                      <circle cx={0} cy={0} r={46} fill="#FFE066" stroke="#E8B21A" strokeWidth={6} />
                      <rect x={-20} y={40} width={40} height={30} rx={6} fill="#9AA6B2" />
                      {Array.from({ length: 8 }).map((_, i) => (
                        <line key={i} x1={Math.cos((i / 8) * Math.PI * 2) * 62} y1={Math.sin((i / 8) * Math.PI * 2) * 62} x2={Math.cos((i / 8) * Math.PI * 2) * 86} y2={Math.sin((i / 8) * Math.PI * 2) * 86} stroke="#FFC93C" strokeWidth={8} strokeLinecap="round" />
                      ))}
                    </g>
                  )}
                </Cam>
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* teacher: go ahead */}
      <Shot from={s8} to={s9}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={760} fy={860} z={1.55}>
                <Classroom f={f} />
                <Teacher x={780} y={1440} s={0.72} expr="smile" talk={talkOf("T", f)} blink={blinkAt(f, 5)} look={[-0.6, 0.4]} tilt={-4} armL={{ a: 50, b: 90 }} armR={{ a: 16, b: 20 }} />
              </Cam>
            </Svg>
            {l < 6 && <Flash l={l} />}
          </AbsoluteFill>
        )}
      </Shot>
      {/* the genius question */}
      <Shot from={s9} to={e9 + 4}>
        {(f, l) => (
          <Svg>
            <Cam fx={330} fy={1130} z={2.05 + l * 0.0015}>
              <Classroom f={f} />
              <Kid x={330} y={1500} s={0.55} who="joanna" seated expr="proud" talk={talkOf("J", f)} blink={blinkAt(f, 1)} look={[0.6, -0.4]} tilt={Math.sin(l / 9) * 4} armR={{ a: 50, b: 150 }} />
              <Desk x={330} y={1420} s={0.75} />
              {[0, 1, 2].map((i) => (
                <Apple key={i} x={170 + i * 70} y={830 - Math.abs(Math.sin(l / 8 + i)) * 20} s={0.45} o={ease(l, 20 + i * 8, 30 + i * 8)} />
              ))}
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* teacher trying not to laugh */}
      <Shot from={e9 + 4} to={s10}>
        {(f, l) => (
          <Svg>
            <Cam fx={780} fy={820} z={2.1}>
              <Classroom f={f} />
              <Teacher x={780} y={1440} s={0.72} expr="laugh" blink={1} look={[0, 0]} tilt={Math.sin(l / 2) * 3} armsFront armR={{ target: [-10, -1060] }} armL={{ a: 20, b: 60 }} />
            </Cam>
          </Svg>
        )}
      </Shot>
      <Sfx name="clock" at={s7 + 2} />
      <Sfx name="idea" at={idea} />
      <Sfx name="whoosh" at={s8} gain={0.6} />
      <Sfx name="snort" at={e9 + 6} />
    </>
  );
};

/* ---------------------------------------------------------------- scene 4 */

const Scene4: React.FC = () => {
  const s10 = line("M10-T").from;
  const s11 = line("M11-J").from;
  const s12 = line("M12-J").from;
  const titleAt = endOf("M12-J") + 4;
  return (
    <>
      {/* hands in the paper */}
      <Shot from={s10} to={s11}>
        {(f, l) => {
          const k = ease(l, 0, 26);
          const give = ease(l, 18, 30);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={560} fy={960} z={1.35}>
                  <Classroom f={f} />
                  <Teacher x={780} y={1500} s={0.72} expr="smile" talk={talkOf("T", f)} blink={blinkAt(f, 5)} look={[-0.7, 0.4]} tilt={-4} paper={give >= 1} armL={{ a: 40 + give * 20, b: 80 }} armR={{ a: 14, b: 10 }} />
                  <Kid x={interpolate(k, [0, 1], [80, 360])} y={1560} s={0.56} who="joanna" walk={l < 26 ? l / 4 : undefined} expr="proud" blink={blinkAt(f, 1)} look={[0.8, -0.4]} armR={give < 1 ? { target: [330 * give + 150, -600] } : { a: 14, b: 8 }} armL={{ a: 14, b: 8 }} />
                  {give < 1 && <Paper x={interpolate(k, [0, 1], [80, 360]) + 0.56 * (330 * give + 150)} y={1560 - 0.56 * 640} s={0.18} rot={10} />}
                </Cam>
              </Svg>
              {l < 6 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* "math is easy… it just asks too much" */}
      <Shot from={s11} to={s12}>
        {(f, l) => (
          <Svg>
            <Cam fx={400} fy={1000} z={1.9}>
              <Classroom f={f} />
              <Kid x={360} y={1560} s={0.56} who="joanna" expr={l > 70 ? "smile" : "proud"} talk={talkOf("J", f)} blink={blinkAt(f, 1)} look={[0.7, -0.3]} tilt={Math.sin(l / 8) * 4} armR={{ a: 60 + Math.sin(l / 6) * 20, b: 140 }} armL={{ a: 20, b: 60 }} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* to camera + title */}
      <Shot from={s12} to={1800}>
        {(f, l) => {
          const lean = ease(l, 0, 24);
          const giggle = f > titleAt - 24;
          const title = spring({ frame: f - titleAt, fps: 30, config: { stiffness: 200, damping: 11 } });
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={360} fy={interpolate(lean, [0, 1], [1000, 1060])} z={interpolate(lean, [0, 1], [1.9, 2.7])}>
                  <Classroom f={f} />
                  <Kid x={360} y={1560} s={0.56} who="joanna" expr={giggle ? "laugh" : "sly"} talk={talkOf("J", f)} blink={giggle ? 0 : blinkAt(f, 1)} look={[0, 0]} tilt={giggle ? Math.sin(f / 3) * 5 : -5} armR={{ a: 150 + Math.sin(l / 5) * 10, b: 175 }} armL={{ a: 20, b: 60 }} />
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Apple key={i} x={180 + i * 90} y={870 - Math.abs(Math.sin(l / 7 + i)) * 24} s={0.42} o={ease(l, 40 + i * 6, 50 + i * 6)} />
                  ))}
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
      <Sfx name="steps" at={s10} gain={0.7} />
      <Sfx name="stamp" at={s10 + 28} />
      <Sfx name="sparkle" at={s11 + 4} gain={0.7} />
      <Sfx name="whoosh" at={s12 + 2} gain={0.6} />
      <Sfx name="pop" at={s12 + 40} />
      <Sfx name="giggle" at={titleAt - 24} />
      <Sfx name="swoosh" at={titleAt} />
      <Sfx name="laugh" at={titleAt - 10} gain={0.5} />
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
      <div style={{ marginTop: 10, display: "inline-block", padding: "4px 30px", borderRadius: 40, background: "#fff", color: "#D9508A", fontWeight: 700, fontSize: 44 }}>الحلقة ٢: جوانا واختبار الرياضيات</div>
    </div>
  );
};

/** «يوميات جوانا» — Episode 2: the surprise maths test (same characters and voices as episode 1). */
export const JoannaEp2: React.FC = () => (
  <AbsoluteFill style={{ background: "#FFF4E0" }}>
    <Scene1 />
    <Scene2 />
    <Scene3 />
    <Scene4 />
    <OpeningTitle />
    {T.scenes.map((s) => (
      <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/joanna2/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />
    ))}
    <Audio
      src={staticFile("audio/joanna2/music/theme.mp3")}
      volume={(f) => {
        const inVoice = T.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 6);
        const fd = interpolate(f, [0, 6, 1770, 1800], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (inVoice ? db(-22) : db(-15)) * fd;
      }}
    />
  </AbsoluteFill>
);
