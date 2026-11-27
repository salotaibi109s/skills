import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import data from "../data/food-timeline.json";
import type { TimelineData } from "../lib/timing";
import { ar, BrandPill, Captions, clamp, ease, EndCard, HistoryRow, jolt, makeStory, MusicBed, NameChip, pop, RedVignette, SANS, Voices } from "./kit";

/** «أكلك ما يخرب» — food preservation from scratch, one kitchen counter that keeps changing. */
export const fTimeline = data as TimelineData;
const { Sfx, SceneVoice, at, start, end } = makeStory(fTimeline, "audio/food");

const C = {
  wall1: "#F7E9CC",
  wall2: "#EBD2A2",
  wood: "#A66E3A",
  woodDark: "#7A4E26",
  ink: "#2A1C10",
  fish: "#7FA6C8",
  fishDark: "#4F7699",
  salt: "#FFFFFF",
  meat: "#B5473A",
  meatDry: "#6E2A20",
  glass: "rgba(190,230,255,0.45)",
  tin: "#B8BEC6",
  tinDark: "#8A9099",
  blue: "#3DA9FC",
  red: "#E0313F",
  green: "#2BB673",
};

/** Opacity window with short fades. */
const win = (f: number, a: number, b: number, fade = 6) => interpolate(f, [a - fade, a, b - fade, b], [0, 1, 1, 0], clamp);

// ------------------------------------------------------------ backdrop
const Kitchen: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.wall1} 0%, ${C.wall2} 70%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 6 }).map((__, c) => <rect key={`${r}-${c}`} x={c * 190 - 20 + (r % 2) * 95} y={r * 150 + 20} width={176} height={136} rx={10} fill="none" stroke="#D9BC86" strokeWidth={3} />),
        )}
      </svg>
      <div style={{ position: "absolute", left: -40 + Math.sin(f / 60) * 20, top: 980, width: 1160, height: 940, background: `linear-gradient(180deg, ${C.wood} 0%, ${C.woodDark} 100%)`, borderTop: "14px solid #C38A52" }} />
      <AbsoluteFill style={{ background: "radial-gradient(110% 70% at 50% 40%, transparent 55%, rgba(60,30,0,0.28) 100%)" }} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ props
const Fish: React.FC<{ x: number; y: number; s?: number; tint?: number }> = ({ x, y, s = 1, tint = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={40} rx={300} ry={60} fill="#fff" stroke="#E4D6BF" strokeWidth={8} />
    <path d="M-210 0 C-120 -90 120 -90 200 0 C120 90 -120 90 -210 0 Z" fill={tint ? "#8FA58A" : C.fish} stroke={C.fishDark} strokeWidth={8} />
    <path d="M195 0 L290 -70 L270 0 L290 70 Z" fill={tint ? "#7E957A" : C.fishDark} />
    <circle cx={-140} cy={-14} r={16} fill="#fff" />
    <circle cx={-140} cy={-14} r={8} fill={C.ink} />
    <path d="M-60 -50 C-40 0 -40 0 -60 50 M0 -56 C20 0 20 0 0 56 M60 -50 C80 0 80 0 60 50" stroke={C.fishDark} strokeWidth={6} fill="none" opacity={0.5} />
  </g>
);

const Microbe: React.FC<{ x: number; y: number; s: number; dead: number }> = ({ x, y, s, dead }) => (
  <g transform={`translate(${x} ${y}) scale(${s * (1 - 0.6 * dead)})`} opacity={1 - dead}>
    <path d="M-30 -6 C-34 -30 -6 -40 10 -30 C34 -36 40 -6 30 10 C38 30 10 40 -6 32 C-30 38 -40 12 -30 -6 Z" fill="#5FC25A" stroke="#2F7F2D" strokeWidth={5} />
    <circle cx={-8} cy={-4} r={5} fill={C.ink} />
    <circle cx={10} cy={-4} r={5} fill={C.ink} />
    <path d="M-8 12 Q2 4 12 12" stroke={C.ink} strokeWidth={4} fill="none" />
  </g>
);

const Jar: React.FC<{ x: number; y: number; cork: number; s?: number }> = ({ x, y, cork, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-150} width={220} height={300} rx={40} fill={C.glass} stroke="#7FB8D9" strokeWidth={8} />
    <ellipse cx={-30} cy={40} rx={46} ry={34} fill="#E07A3A" />
    <ellipse cx={34} cy={80} rx={40} ry={30} fill="#7DB24A" />
    <ellipse cx={10} cy={0} rx={38} ry={28} fill="#D9473A" />
    <rect x={-60} y={-150} width={20} height={240} rx={10} fill="rgba(255,255,255,0.45)" />
    <rect x={-70} y={-196 - (1 - cork) * 120} width={140} height={56} rx={14} fill="#B88552" stroke="#7A5530" strokeWidth={6} opacity={cork} />
  </g>
);

const Can: React.FC<{ x: number; y: number; s?: number; dent?: number }> = ({ x, y, s = 1, dent = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-160} width={240} height={320} rx={18} fill={C.tin} stroke={C.tinDark} strokeWidth={8} />
    <ellipse cx={0} cy={-160} rx={120} ry={30} fill="#D5DAE0" stroke={C.tinDark} strokeWidth={8} />
    {[-110, -90, 120, 140].map((yy) => (
      <line key={yy} x1={-120} x2={120} y1={yy} y2={yy} stroke={C.tinDark} strokeWidth={5} opacity={0.6} />
    ))}
    <rect x={-120} y={-60} width={240} height={140} fill="#D8473A" />
    <text x={0} y={30} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={62} fill="#fff">
      علبة
    </text>
    {dent > 0 && <path d={`M-40 ${-160} L-10 ${-160 + 34 * dent} L20 ${-160}`} fill="none" stroke={C.ink} strokeWidth={6} />}
  </g>
);

const Fridge: React.FC<{ open: number }> = ({ open }) => (
  <g transform="translate(540 1170)">
    <rect x={-230} y={-520} width={460} height={760} rx={40} fill="#EEF3F7" stroke="#9FB0BF" strokeWidth={10} />
    <rect x={-210} y={-500} width={420} height={720} rx={24} fill="#CFE8FA" />
    <rect x={-190} y={-200} width={380} height={12} rx={6} fill="#9FC7E6" />
    <rect x={-190} y={40} width={380} height={12} rx={6} fill="#9FC7E6" />
    <g transform="translate(-90 -280) scale(0.42)">
      <Jar x={0} y={0} cork={1} />
    </g>
    <g transform="translate(90 -280) scale(0.42)">
      <Can x={0} y={0} />
    </g>
    <g transform="translate(0 -40) scale(0.5)">
      <Fish x={0} y={0} />
    </g>
    <ellipse cx={-80} cy={170} rx={70} ry={44} fill="#D9473A" />
    <ellipse cx={80} cy={170} rx={60} ry={40} fill="#7DB24A" />
    {/* door swings open (scaleX towards the left hinge) */}
    <g transform={`translate(-230 0) scale(${1 - open * 0.92} 1) translate(230 0)`}>
      <rect x={-230} y={-520} width={460} height={760} rx={40} fill="#F6F9FB" stroke="#9FB0BF" strokeWidth={10} />
      <rect x={150} y={-320} width={26} height={200} rx={13} fill="#9FB0BF" />
    </g>
  </g>
);

// ------------------------------------------------------------ stage
const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const F04 = start("F04");
  const F05 = start("F05");
  const F06 = start("F06");
  const F07 = start("F07");
  const F08 = start("F08");
  const F10 = start("F10");
  const F12 = start("F12");
  const F13 = start("F13");
  const F14 = start("F14");

  // A: fish (0 → F04) and again in the loop scene (F14 →)
  const fishVis = Math.max(win(f, 0, F04), win(f, F14 + 4, fTimeline.durationInFrames + 20));
  const fishIn = f < F14 ? pop(f, 4, 30, 170, 13) : pop(f, F14 + 4, 30, 170, 13);
  const tStink = at("F02", "ريحتها");
  const stink = f < F03() ? ease(f, tStink - 6, tStink + 10) : 0;
  const tSalt = at("F03", "فغطّيتها");
  const salt = ease(f, tSalt, tSalt + 40) * (f < F14 ? 1 : 0);
  const tDraw = at("F03", "يسحب");
  const tGerm = at("F03", "والجراثيم");
  const tDie = at("F03", "تعيش");
  // B: other food crossed (F04)
  const bVis = win(f, F04 + 2, F05 + 2);
  // C: drying rack (F05)
  const cVis = win(f, F05 + 2, F06 + 2);
  const tDry = at("F05", "نشف");
  const dry = ease(f, tDry - 4, tDry + 20);
  // D: army (F06)
  const dVis = win(f, F06 + 2, F07 + 2);
  const tMonths = at("F06", "شهور");
  // E: prize (F07)
  const eVis = win(f, F07 + 2, F08 + 2);
  const tYear = at("F07", "سنة");
  const tFr = at("F07", "فرنسا");
  const tPrize = at("F07", "جايزة");
  const tAmt = at("F07", "اثنعش");
  // F: Appert (F08 → F09) and the break (F09)
  const gVis = win(f, F08 + 2, F10 + 2);
  const tHat = at("F08", "صانع");
  const tName = at("F08", "نيكولا");
  const tJar = at("F08", "قزاز");
  const tCork = at("F08", "وسكّره");
  const tBoil = at("F08", "وغلاه");
  const tLive = at("F08", "عاش");
  const tBreak = at("F09", "ينكسر");
  const broken = f >= tBreak;
  // H: can (F10 → F12)
  const hVis = win(f, F10 + 2, F12 + 2);
  const tCan = at("F10", "علبة");
  const tGap = at("F11", "سبقت");
  const tFifty = at("F11", "خمسين");
  const tKnife = at("F11", "بالسكين");
  const tHammer = at("F11", "بالمطرقة");
  // J: fridge (F12 → F13)
  const jVis = win(f, F12 + 2, F13 + 4);
  const tFridge = at("F12", "الثلاجة");

  function F03() {
    return start("F03");
  }

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE27A" />
          <stop offset="100%" stopColor="#FFB13B" />
        </radialGradient>
        <radialGradient id="cold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(120,200,255,0.55)" />
          <stop offset="100%" stopColor="rgba(120,200,255,0)" />
        </radialGradient>
      </defs>

      {/* A — fish, stink, salt, microbes */}
      {fishVis > 0.01 && (
        <g opacity={fishVis}>
          <g transform={`translate(540 1180) scale(${0.7 + 0.3 * fishIn}) translate(-540 -1180)`}>
            <Fish x={540} y={1180} s={1.25} tint={stink > 0.5 && f < tSalt ? 1 : 0} />
          </g>
          {stink > 0 &&
            [-200, -60, 80, 220].map((dx, i) => {
              const yy = 1020 - ((f * 2 + i * 30) % 120);
              return <path key={i} d={`M${540 + dx} ${yy + 60} q20 -25 0 -50 q-20 -25 0 -50`} stroke="#6BA34A" strokeWidth={10} fill="none" strokeLinecap="round" opacity={stink * (1 - salt)} />;
            })}
          {stink > 0 &&
            [0, 1, 2].map((i) => {
              const a = f / 6 + i * 2.1;
              return <circle key={i} cx={540 + Math.cos(a) * (180 + i * 40)} cy={980 + Math.sin(a * 1.3) * 60} r={10} fill={C.ink} opacity={stink * (1 - salt)} />;
            })}
          {salt > 0 && (
            <>
              <g transform={`translate(${700} ${780 - (1 - ease(f, tSalt - 6, tSalt + 6)) * 200}) rotate(-140)`} opacity={1 - ease(f, tSalt + 50, tSalt + 60)}>
                <rect x={-50} y={-90} width={100} height={150} rx={22} fill="#fff" stroke="#9BA7B3" strokeWidth={8} />
                <rect x={-50} y={-120} width={100} height={40} rx={14} fill="#C9D2DB" />
              </g>
              {Array.from({ length: 70 }).map((_, i) => {
                const t0 = tSalt + random(`t${i}`) * 34;
                const p = interpolate(f, [t0, t0 + 14], [0, 1], clamp);
                const x = 540 + (random(`x${i}`) - 0.5) * 460;
                return p > 0 ? <circle key={i} cx={x + (700 - x) * (1 - p) * 0.3} cy={860 + p * (1150 - 860 - random(`y${i}`) * 40)} r={7} fill="#fff" stroke="#E2E6EA" strokeWidth={2} /> : null;
              })}
              <path d={`M260 1210 C ${360} ${1210 - 120 * salt} ${720} ${1210 - 120 * salt} 820 1210 Z`} fill="#fff" stroke="#E2E6EA" strokeWidth={4} opacity={salt} />
            </>
          )}
          {f >= tDraw &&
            f < F04 &&
            [-1, 1].map((side) =>
              [0, 1, 2].map((k) => {
                const t = (f - tDraw - k * 10) / 30;
                if (t < 0) return null;
                const tt = t % 1;
                return <path key={`${side}${k}`} d="M0 -16 C10 0 12 10 0 16 C-12 10 -10 0 0 -16 Z" transform={`translate(${540 + side * (300 + tt * 120)} ${1150 + tt * 80})`} fill={C.blue} opacity={1 - tt} />;
              }),
            )}
          {f >= tGerm - 4 &&
            f < F04 &&
            [
              [330, 960],
              [760, 990],
              [420, 1300],
              [700, 1310],
              [880, 1150],
            ].map(([x, y], i) => {
              const p = pop(f, tGerm + i * 3, 30, 220, 10);
              const d = ease(f, tDie + i * 2, tDie + 14 + i * 2);
              return <Microbe key={i} x={x + Math.sin((f + i * 20) / 8) * 8} y={y} s={1.3 * p} dead={d} />;
            })}
        </g>
      )}

      {/* B — not everything takes salt */}
      {bVis > 0.01 && (
        <g opacity={bVis}>
          {[
            [300, "#E8B04A", "bread"],
            [540, "#D9473A", "apple"],
            [780, "#F4F4F4", "milk"],
          ].map(([x, col, k], i) => {
            const p = pop(f, F04 + 4 + i * 5, 30, 220, 12);
            const xx = Number(x);
            return (
              <g key={String(k)} transform={`translate(${xx} 1160) scale(${p})`}>
                {k === "bread" && <path d="M-110 40 C-120 -60 -40 -90 0 -70 C40 -90 120 -60 110 40 Z" fill={String(col)} stroke="#A9752A" strokeWidth={8} />}
                {k === "apple" && (
                  <>
                    <circle cx={0} cy={0} r={95} fill={String(col)} stroke="#962A22" strokeWidth={8} />
                    <rect x={-6} y={-130} width={12} height={40} rx={6} fill="#6B4423" />
                  </>
                )}
                {k === "milk" && (
                  <>
                    <path d="M-70 -110 L70 -110 L80 -60 L80 110 L-80 110 L-80 -60 Z" fill={String(col)} stroke="#9AA7B3" strokeWidth={8} />
                    <rect x={-80} y={-20} width={160} height={60} fill={C.blue} />
                  </>
                )}
                <g opacity={ease(f, F04 + 18 + i * 5, F04 + 26 + i * 5)}>
                  <path d="M-80 -80 L80 80 M80 -80 L-80 80" stroke={C.red} strokeWidth={22} strokeLinecap="round" />
                </g>
              </g>
            );
          })}
        </g>
      )}

      {/* C — drying under the sun */}
      {cVis > 0.01 && (
        <g opacity={cVis}>
          <g transform={`translate(840 820) rotate(${f * 0.6})`}>
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x={-8} y={-150} width={16} height={46} rx={8} fill="#FFB13B" transform={`rotate(${i * 30})`} />
            ))}
            <circle r={90} fill="url(#sun)" />
          </g>
          <rect x={180} y={930} width={20} height={380} rx={10} fill={C.woodDark} />
          <rect x={880} y={930} width={20} height={380} rx={10} fill={C.woodDark} />
          <rect x={160} y={940} width={760} height={18} rx={9} fill="#8A5A2E" />
          {Array.from({ length: 6 }).map((_, i) => {
            const p = pop(f, F05 + 8 + i * 4, 30, 200, 11);
            const h = 230 - dry * 60;
            const col = interpolate(dry, [0, 1], [0, 1]) > 0.5 ? C.meatDry : C.meat;
            return (
              <g key={i} transform={`translate(${250 + i * 115} 958) rotate(${Math.sin((f + i * 12) / 14) * 4})`}>
                <path d={`M-34 0 L34 0 L28 ${h * p} Q0 ${h * p + 26} -28 ${h * p} Z`} fill={col} stroke="#5A1E16" strokeWidth={5} />
              </g>
            );
          })}
        </g>
      )}

      {/* D — the army needs months */}
      {dVis > 0.01 && (
        <g opacity={dVis}>
          {Array.from({ length: 5 }).map((_, i) => {
            const p = pop(f, F06 + 4 + i * 4, 30, 220, 12);
            const bob = Math.abs(Math.sin((f + i * 8) / 5)) * 14;
            const x = 180 + i * 180 + ((f - F06) * 1.2) % 30;
            return (
              <g key={i} transform={`translate(${x} ${1160 - bob}) scale(${p})`}>
                <rect x={-36} y={-40} width={72} height={130} rx={22} fill="#2F4A7A" />
                <circle cx={0} cy={-80} r={38} fill="#E8B98E" />
                <path d="M-48 -92 Q0 -150 48 -92 Z" fill="#1F2F4F" />
                <rect x={30} y={-150} width={10} height={180} rx={5} fill="#6B4423" />
              </g>
            );
          })}
          {f >= tMonths - 4 &&
            [0, 1, 2].map((i) => {
              const p = pop(f, tMonths + i * 6, 30, 240, 12);
              return (
                <g key={i} transform={`translate(${380 + i * 160} ${880}) rotate(${(i - 1) * 8}) scale(${p})`}>
                  <rect x={-66} y={-70} width={132} height={140} rx={16} fill="#fff" stroke="#C9B48E" strokeWidth={6} />
                  <rect x={-66} y={-70} width={132} height={40} rx={16} fill={C.red} />
                  <text x={0} y={42} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={56} fill={C.ink}>
                    {ar(i + 1)}
                  </text>
                </g>
              );
            })}
          {f >= tMonths && (
            <text x={540} y={1400} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={70} fill="#fff" opacity={ease(f, tMonths, tMonths + 8)}>
              شهور
            </text>
          )}
        </g>
      )}

      {/* E — the prize */}
      {eVis > 0.01 && (
        <g opacity={eVis}>
          <g transform={`translate(540 1150) scale(${pop(f, F07 + 4, 30, 160, 13)})`}>
            <rect x={-340} y={-330} width={680} height={600} rx={30} fill="#FFF6E2" stroke="#C9A25E" strokeWidth={10} />
            <rect x={-300} y={-290} width={600} height={520} rx={18} fill="none" stroke="#E6CF9E" strokeWidth={4} />
            <g opacity={ease(f, tFr - 3, tFr + 6)}>
              <rect x={-90} y={-260} width={60} height={90} fill="#2D4FA0" />
              <rect x={-30} y={-260} width={60} height={90} fill="#fff" stroke="#ddd" />
              <rect x={30} y={-260} width={60} height={90} fill="#D9343F" />
            </g>
            <text x={0} y={-90} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={84} fill={C.ink} opacity={ease(f, tPrize - 3, tPrize + 6)}>
              جايزة
            </text>
            <text x={0} y={40} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={110} fill="#B07A1E" opacity={ease(f, tAmt - 3, tAmt + 6)} transform={`scale(${0.8 + 0.2 * pop(f, tAmt, 30, 260, 9)})`}>
              {`${ar("12,000")} فرنك`}
            </text>
            <text x={0} y={170} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={64} fill={C.ink} opacity={ease(f, tYear, tYear + 8)}>
              {`سنة ${ar(1795)}`}
            </text>
          </g>
        </g>
      )}

      {/* F/G — Appert's jar, and the break */}
      {gVis > 0.01 && (
        <g opacity={gVis}>
          <g opacity={ease(f, tHat - 4, tHat + 6) * (1 - ease(f, tJar, tJar + 10))}>
            <g transform="translate(540 1000)">
              <path d="M-120 60 L-120 -40 C-170 -60 -160 -170 -80 -150 C-60 -230 60 -230 80 -150 C160 -170 170 -60 120 -40 L120 60 Z" fill="#fff" stroke="#C7CCD2" strokeWidth={8} />
              <rect x={-120} y={40} width={240} height={50} rx={10} fill="#F1F3F5" stroke="#C7CCD2" strokeWidth={6} />
            </g>
          </g>
          {f >= tName - 4 && f < tJar + 30 && (
            <g opacity={ease(f, tName - 4, tName + 6) * (1 - ease(f, tJar + 14, tJar + 30))}>
              <rect x={290} y={1180} width={500} height={110} rx={55} fill={C.ink} />
              <text x={540} y={1255} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={58} fill="#fff">
                نيكولا آبير
              </text>
            </g>
          )}
          {f >= tBoil - 4 && (
            <g opacity={ease(f, tBoil - 4, tBoil + 6) * (broken ? 1 - ease(f, tBreak + 20, tBreak + 30) : 1)}>
              <path d="M240 1080 L840 1080 L800 1380 L280 1380 Z" fill="#5C6670" stroke="#3B434B" strokeWidth={10} />
              <rect x={250} y={1110} width={580} height={40} fill="#7FC1EA" opacity={0.6} />
              {Array.from({ length: 10 }).map((_, i) => {
                const t = ((f + i * 9) % 40) / 40;
                return <circle key={i} cx={300 + i * 52} cy={1140 - t * 60} r={6 + t * 8} fill="#CDEBFF" opacity={1 - t} />;
              })}
              {[0, 1, 2, 3].map((i) => (
                <path key={i} d={`M${330 + i * 140} 1440 q20 -60 0 -90 q50 40 30 90 Z`} fill="#FF8A2A" transform={`translate(0 ${Math.sin((f + i * 7) / 3) * 6})`} />
              ))}
            </g>
          )}
          {f >= tJar - 4 && !broken && (
            <g transform={`translate(0 ${f >= tBoil ? -60 : 0})`}>
              <g transform={`translate(540 1050) scale(${pop(f, tJar, 30, 220, 12)}) translate(-540 -1050)`}>
                <Jar x={540} y={1050} cork={ease(f, tCork - 2, tCork + 10)} />
              </g>
            </g>
          )}
          {f >= tLive && !broken && (
            <g transform={`translate(820 860) scale(${pop(f, tLive, 30, 260, 10)})`}>
              <circle r={70} fill={C.green} />
              <path d="M-30 2 L-8 26 L34 -22" stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
          {broken &&
            Array.from({ length: 14 }).map((_, i) => {
              const t = f - tBreak;
              const a = -Math.PI / 2 + (random(`b${i}`) - 0.5) * 2.6;
              const v = 10 + random(`bv${i}`) * 16;
              const x = 540 + Math.cos(a) * v * t;
              const y = 990 + Math.sin(a) * v * t + 0.9 * t * t;
              return <path key={i} d="M0 -26 L22 10 L-18 18 Z" fill={C.glass} stroke="#7FB8D9" strokeWidth={4} transform={`translate(${x} ${Math.min(y, 1500)}) rotate(${t * 14 + i * 30})`} />;
            })}
        </g>
      )}

      {/* H/I — the can, and the opener 50 years later */}
      {hVis > 0.01 && (
        <g opacity={hVis}>
          <g transform={`translate(540 1110) scale(${pop(f, tCan - 2, 30, 200, 11)}) rotate(${f >= tHammer ? Math.sin((f - tHammer) * 1.4) * 6 * Math.exp(-(f - tHammer) / 14) : 0}) translate(-540 -1110)`}>
            <Can x={540} y={1110} s={1.15} dent={ease(f, tHammer + 4, tHammer + 8)} />
          </g>
          {f >= tGap - 4 && f < tKnife - 4 && (
            <g opacity={ease(f, tGap - 4, tGap + 6) * (1 - ease(f, tKnife - 14, tKnife - 4))}>
              <rect x={150} y={1400} width={780} height={150} rx={30} fill="rgba(255,255,255,0.9)" />
              <text x={830} y={1495} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={48} fill={C.ink}>
                العلبة
              </text>
              <text x={250} y={1495} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={48} fill={C.ink} opacity={ease(f, tFifty, tFifty + 8)}>
                الفتّاحة
              </text>
              <line x1={730} y1={1478} x2={730 - 380 * ease(f, tGap, tFifty + 6)} y2={1478} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
              <text x={540} y={1450} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={44} fill={C.red} opacity={ease(f, tFifty, tFifty + 8)}>
                {`≈ ${ar(50)} سنة`}
              </text>
            </g>
          )}
          {f >= tKnife - 4 && (
            <g transform={`translate(${790 - Math.max(0, Math.sin((f - tKnife) / 3)) * 40} ${900 + Math.max(0, Math.sin((f - tKnife) / 3)) * 40}) rotate(-40)`} opacity={ease(f, tKnife - 4, tKnife + 4) * (1 - ease(f, tHammer - 6, tHammer))}>
              <rect x={-14} y={-160} width={28} height={180} rx={6} fill="#DDE3E8" stroke="#8A9099" strokeWidth={5} />
              <rect x={-20} y={20} width={40} height={110} rx={12} fill="#6B4423" />
            </g>
          )}
          {f >= tHammer - 6 && (
            <g transform={`translate(800 ${860}) rotate(${interpolate(f, [tHammer - 6, tHammer, tHammer + 4, tHammer + 12], [-60, -60, 10, -30], clamp)} 80 160)`}>
              <rect x={60} y={20} width={30} height={220} rx={10} fill="#8B5A2B" />
              <rect x={-10} y={-20} width={170} height={70} rx={12} fill="#555E68" />
            </g>
          )}
          {f >= tHammer + 4 && f < tHammer + 30 && (
            <text x={330} y={900} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={90} fill={C.red} opacity={1 - ease(f, tHammer + 16, tHammer + 30)}>
              طَق!
            </text>
          )}
        </g>
      )}

      {/* J — the fridge */}
      {jVis > 0.01 && (
        <g opacity={jVis}>
          <circle cx={540} cy={1060} r={520 * ease(f, tFridge + 6, tFridge + 30)} fill="url(#cold)" />
          <g transform={`translate(540 1170) scale(${pop(f, F12 + 4, 30, 170, 13)}) translate(-540 -1170)`}>
            <Fridge open={ease(f, tFridge, tFridge + 18)} />
          </g>
          {f >= tFridge + 10 &&
            Array.from({ length: 12 }).map((_, i) => {
              const t = ((f + i * 11) % 60) / 60;
              return <text key={i} x={300 + random(`s${i}`) * 480} y={1300 - t * 600} fontSize={34} fill="#fff" opacity={(1 - t) * 0.9}>❄</text>;
            })}
        </g>
      )}
    </svg>
  );
};

// ------------------------------------------------------------ freshness bar
const Freshness: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0 || f >= start("F13")) return null;
  const steps: [number, number][] = [
    [0, 0.12],
    [at("F03", "تمليح"), 0.34],
    [at("F05", "قديد"), 0.46],
    [at("F08", "عاش"), 0.68],
    [at("F10", "المعلّبات"), 0.84],
    [at("F12", "طازج"), 0.97],
  ];
  let v = steps[0][1];
  for (let i = 1; i < steps.length; i++) v += (steps[i][1] - steps[i - 1][1]) * ease(f, steps[i][0] - 2, steps[i][0] + 14);
  const bad = [at("F02", "ريحتها"), start("F04"), start("F06"), at("F09", "ينكسر")].some((t) => f >= t && f < t + 24);
  const col = bad ? C.red : v > 0.6 ? C.green : "#F2A93B";
  return (
    <div dir="rtl" style={{ position: "absolute", left: 90, right: 90, top: 1700, display: "flex", alignItems: "center", gap: 24, fontFamily: SANS }}>
      <div style={{ fontWeight: 700, fontSize: 40, color: "#FFF4E0", whiteSpace: "nowrap" }}>عمر الأكل</div>
      <div style={{ flex: 1, height: 34, borderRadius: 17, background: "rgba(0,0,0,0.3)", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${v * 100}%`, borderRadius: 17, background: col }} />
      </div>
    </div>
  );
};

// ------------------------------------------------------------ cover (frame 0)
const Cover: React.FC = () => (
  <AbsoluteFill>
    <Kitchen />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g transform="translate(0 260)">
        <Fridge open={1} />
      </g>
      <g transform="translate(250 1560) scale(0.55)">
        <Can x={0} y={0} />
      </g>
      <g transform="translate(830 1560) scale(0.55)">
        <Jar x={0} y={0} cork={1} />
      </g>
    </svg>
    <BrandPill />
    <div dir="rtl" style={{ position: "absolute", top: 250, left: 40, right: 40, textAlign: "center", fontFamily: SANS, fontWeight: 700 }}>
      <div style={{ fontSize: 150, color: "#fff", WebkitTextStroke: "5px rgba(0,0,0,0.85)", paintOrder: "stroke fill", lineHeight: 1.15 }}>أكلك ما يخرب</div>
      <div style={{ display: "inline-block", marginTop: 20, padding: "6px 36px 18px", borderRadius: 24, background: C.red, color: "#fff", fontSize: 70 }}>من الملح… للثلاجة</div>
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ main
export const FoodStory: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  const problems = [at("F02", "بس"), at("F04", "بس"), at("F06", "بس"), at("F09", "بس")];
  const j = problems.map((p) => jolt(f, p)).reduce((a, b) => (b.k > a.k ? b : a), { k: 0, sx: 0, sy: 0 });
  const F13 = start("F13");
  return (
    <AbsoluteFill style={{ background: C.wall1 }}>
      <AbsoluteFill style={{ translate: `${j.sx}px ${j.sy}px` }}>
        <Kitchen />
        <AbsoluteFill style={{ scale: "1.12", transformOrigin: "50% 62%" }}>
          <Stage />
        </AbsoluteFill>
        <HistoryRow
          items={[
            { at: at("F03", "تمليح") + 30, label: "تمليح", node: <span style={{ fontSize: 60 }}>🧂</span> },
            { at: at("F05", "قديد") + 24, label: "قديد", node: <span style={{ fontSize: 60 }}>🥩</span> },
            { at: at("F08", "عاش") + 24, label: "قزاز", node: <span style={{ fontSize: 60 }}>🫙</span> },
            { at: at("F10", "المعلّبات") + 30, label: "علبة", node: <span style={{ fontSize: 60 }}>🥫</span> },
          ].filter(() => f < start("F12"))}
        />
        <Freshness />
      </AbsoluteFill>
      <RedVignette k={j.k} />
      <NameChip text="هذا تمليح" at={at("F03", "تمليح")} until={start("F04")} />
      <NameChip text="هذا قديد" at={at("F05", "قديد")} until={start("F06")} />
      <NameChip text="المعلّبات" at={at("F10", "المعلّبات")} until={start("F11")} />
      <NameChip text="الثلاجة" at={at("F12", "الثلاجة")} until={start("F13")} color="#1F7FC4" />
      <EndCard from={F13} tFollow={at("F13", "تابع")} until={end("F13")} line="أكلك ما يخرب" />
      <BrandPill />
      <Captions timeline={fTimeline} top={250} />

      <Voices timeline={fTimeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={fTimeline} src="audio/food/music/calm.mp3" />
      {problems.map((p, i) => (
        <Sfx key={`g${i}`} name="glitch" at={p - 1} />
      ))}
      <Sfx name="whoosh" at={4} />
      <Sfx name="swish" at={at("F03", "فغطّيتها")} />
      <Sfx name="check" at={at("F03", "تمليح")} />
      <Sfx name="whoosh" at={start("F05")} />
      <Sfx name="check" at={at("F05", "قديد")} />
      <Sfx name="riser" at={start("F07") - 6} />
      <Sfx name="impact" at={at("F07", "اثنعش")} />
      <Sfx name="pop" at={at("F08", "قزاز")} />
      <Sfx name="pop" at={at("F08", "وسكّره")} />
      <Sfx name="ding" at={at("F08", "عاش")} />
      <Sfx name="impact" at={at("F09", "ينكسر")} />
      <Sfx name="whoosh" at={at("F10", "علبة") - 4} />
      <Sfx name="check" at={at("F10", "المعلّبات")} />
      <Sfx name="tick" at={at("F11", "بالسكين")} />
      <Sfx name="thud" at={at("F11", "بالمطرقة") + 4} />
      <Sfx name="sparkle" at={at("F12", "الثلاجة")} />
      <Sfx name="riser" at={F13 - 10} />
      <Sfx name="pop" at={at("F13", "تابع")} />
      <Sfx name="whoosh" at={start("F14")} />
    </AbsoluteFill>
  );
};

export const FoodStoryThumb: React.FC = () => <Cover />;
