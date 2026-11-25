import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import data from "../data/homeb-timeline.json";
import mouthData from "../data/homeb-mouth.json";
import type { TimelineData } from "../lib/timing";
import { musicLevel } from "../room404/kit";
import { Bedroom, Cam, ease, Flash, FONT, HomeEnd, LivingRoom, makeHome, Shot, Svg, Tag } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, Sfx, Jo, Faisal, Saad, Baba } = makeHome(T, mouthData as Record<string, number[]>, "homeb");

const ConsoleBox: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-110} width={300} height={220} rx={16} fill="#1E2A44" stroke="#5CF2FF" strokeWidth={6} />
    <path d="M-70 -20 h140 a40 40 0 0 1 40 40 v10 a30 30 0 0 1 -55 15 l-15 -15 h-80 l-15 15 a30 30 0 0 1 -55 -15 v-10 a40 40 0 0 1 40 -40Z" fill="#E8414B" />
    <circle cx={50} cy={10} r={10} fill="#fff" />
    <rect x={-70} y={4} width={34} height={10} fill="#fff" />
    <rect x={-58} y={-8} width={10} height={34} fill="#fff" />
    <text x={0} y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#5CF2FF">
      NEW!
    </text>
  </g>
);

/** Cardboard arcade: hoop box, maze box and a score board; k = how much is built (0..1). */
const Arcade: React.FC<{ x: number; y: number; s: number; k: number; f: number; score?: number }> = ({ x, y, s, k, f, score = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {k > 0.05 && (
      <g opacity={Math.min(1, k * 3)}>
        <rect x={-460} y={-420} width={300} height={420} rx={10} fill="#C9A26B" stroke="#8B6A3E" strokeWidth={8} />
        <circle cx={-310} cy={-300} r={70} fill="#5E4A38" stroke="#E8414B" strokeWidth={14} />
        <text x={-310} y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#6B4523">
          سلّة!
        </text>
      </g>
    )}
    {k > 0.4 && (
      <g opacity={Math.min(1, (k - 0.4) * 3)}>
        <rect x={-130} y={-300} width={300} height={300} rx={10} fill="#D8B77F" stroke="#8B6A3E" strokeWidth={8} />
        <path d="M-100 -260 h220 v60 h-180 v60 h180 v60 h-220" stroke="#2E7D7A" strokeWidth={14} fill="none" />
        <circle cx={-100 + ((f * 4) % 220)} cy={-260} r={14} fill="#E8414B" />
      </g>
    )}
    {k > 0.75 && (
      <g opacity={Math.min(1, (k - 0.75) * 4)}>
        <rect x={200} y={-460} width={260} height={180} rx={14} fill="#1E2A44" stroke="#FFD23F" strokeWidth={8} />
        <text x={330} y={-400} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill="#FFD23F">
          النقاط
        </text>
        <text x={330} y={-320} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={70} fill="#fff">
          {String(score).padStart(3, "0").replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d])}
        </text>
        <rect x={300} y={-280} width={60} height={280} fill="#8B6A3E" />
      </g>
    )}
    {k > 0.9 && [0, 1, 2].map((i) => <polygon key={i} points="0,-18 5,-6 18,-6 8,2 11,15 0,8 -11,15 -8,2 -18,-6 -5,-6" fill="#FFD23F" transform={`translate(${-400 + i * 400} ${-480 - Math.abs(Math.sin(f / 8 + i)) * 20})`} />)}
  </g>
);

export const HomeB: React.FC = () => {
  const s2 = line("H02-F").from;
  const s3 = line("H03-J").from;
  const s5 = line("H05-F").from;
  const s6 = line("H06-F").from;
  const e7 = endOf("H07-J");
  const s8 = line("H08-D").from;
  const s9 = line("H09-C").from;
  const f10 = at("H10-F");
  const e10 = endOf("H10-F");
  const s11 = line("H11-C").from;
  const e11 = endOf("H11-C");
  const reveal = f10 + (e10 - f10) * 0.6;
  const endFrom = e11 + 24;
  return (
    <AbsoluteFill style={{ background: "#F6E6D0" }}>
      {/* HOOK: the cousin's new console and Faisal's lie */}
      <Shot from={0} to={s6}>
        {(f) => {
          const lie = f >= s2;
          const panic = f >= s5;
          return (
            <Svg>
              <Cam fx={lie ? (panic ? 360 : 400) : 680} fy={1180} z={lie ? 1.7 : 1.6}>
                <LivingRoom f={f} />
                <Saad f={f} x={740} y={1720} expr={f >= s3 ? "happy" : "proud"} look={[-1, 0]} armL={{ target: [-140, -560] }} armR={{ target: [140, -560] }} />
                <ConsoleBox x={740} y={1720 - 0.5 * 620} s={0.55} />
                <Faisal f={f} x={440} y={1720} expr={panic ? "worry" : lie ? "proud" : "shock"} look={[1, -0.3]} sweat={panic ? 1 : 0} armR={lie && !panic ? { a: 140, b: 170 } : {}} />
                <Jo f={f} x={220} y={1720} expr={f >= s3 ? "shock" : "smile"} look={[1, -0.2]} armR={f >= s3 ? { target: [80, -620] } : {}} armsFront={f >= s3} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* night: guilt, and Joanna's plan */}
      <Shot from={s6} to={s8}>
        {(f) => {
          const idea = f >= e7 - 30;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={1100} z={1.45}>
                  <Bedroom f={f} />
                  <Faisal f={f} x={820} y={1120} s={0.42} seated expr="worry" look={[-1, -0.2]} />
                  <Jo f={f} x={260} y={1120} s={0.5} seated expr={idea ? "happy" : "smile"} look={[1, -0.2]} armR={idea ? { a: 140, b: 170 } : {}} />
                  {idea && (
                    <g transform={`translate(${260 + 0.5 * 260} ${1120 - 0.5 * 1180})`}>
                      <circle r={40} fill="#FFE066" stroke="#E8B21A" strokeWidth={6} />
                      <rect x={-16} y={36} width={32} height={24} rx={5} fill="#9AA6B2" />
                    </g>
                  )}
                  <rect x={40} y={1150} width={440} height={110} rx={20} fill="#7A8FD0" />
                  <rect x={600} y={1150} width={440} height={110} rx={20} fill="#7A8FD0" />
                </Cam>
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* building the cardboard arcade with Dad */}
      <Shot from={s8} to={s9}>
        {(f, l) => (
          <Svg>
            <Cam fx={560} fy={1150} z={1.2}>
              <LivingRoom f={f} night={1} />
              <Arcade x={560} y={1500} s={0.75} k={ease(l, 0, s9 - s8 - 20)} f={f} />
              <Baba f={f} x={900} y={1760} expr="happy" look={[-1, 0.4]} armL={{ target: [-260, -700 + Math.sin(f / 4) * 30] }} />
              <Jo f={f} x={320} y={1760} expr="happy" look={[1, 0.4]} armR={{ target: [220, -500 + Math.sin(f / 5) * 30] }} />
              <Faisal f={f} x={160} y={1760} expr="laugh" look={[1, 0]} armR={{ a: 120 + Math.sin(f / 3) * 20, b: 160 }} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* the next day: confession and reveal */}
      <Shot from={s9} to={s11}>
        {(f) => {
          const shown = ease(f, reveal, reveal + 14);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={560} fy={1150} z={1.25}>
                  <LivingRoom f={f} />
                  <Arcade x={560} y={1500} s={0.75} k={1} f={f} />
                  <rect x={160 + shown * 700} y={1080} width={800} height={460} rx={20} fill="#EDEDED" stroke="#BDBDBD" strokeWidth={6} opacity={1 - shown} />
                  <Saad f={f} x={880} y={1760} expr={shown > 0.5 ? "shock" : "smile"} look={[-1, -0.3]} />
                  <Faisal f={f} x={300} y={1760} expr={shown > 0.5 ? "happy" : "worry"} look={[1, -0.3]} armR={{ target: [260, -560] }} />
                  <Jo f={f} x={120} y={1760} expr="smile" look={[1, -0.3]} />
                </Cam>
              </Svg>
              {shown > 0 && shown < 0.5 && <Flash l={(f - reveal) * 1.5} color="#FFF3C4" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* Saad loves it */}
      <Shot from={s11} to={endFrom}>
        {(f, l) => {
          const throwK = ((l % 40) / 40);
          const score = Math.min(9, Math.floor(l / 40)) * 10;
          return (
            <Svg>
              <Cam fx={500} fy={1150} z={1.3}>
                <LivingRoom f={f} />
                <Arcade x={560} y={1500} s={0.75} k={1} f={f} score={score} />
                <circle cx={700 - throwK * 360} cy={1100 - Math.sin(throwK * Math.PI) * 260} r={22} fill="#FF8C2B" />
                <Saad f={f} x={760} y={1760} expr="laugh" look={[-1, -0.6]} armL={{ a: 140 - throwK * 60, b: 170 - throwK * 40 }} tilt={Math.sin(f / 5) * 4} />
                <Faisal f={f} x={300} y={1760} expr="laugh" look={[1, -0.4]} armR={{ a: 150, b: 175 }} armL={{ a: 150, b: 175 }} />
                <Jo f={f} x={120} y={1760} expr="happy" look={[1, -0.4]} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Shot from={endFrom} to={1800}>
        {(_f, l) => <HomeEnd l={l} value="القناعة كنز… والصدق أحلى 🤍" next="المية ريال" />}
      </Shot>
      <Tag text="حكايات بيتنا · الحلقة ٢" />

      <Sfx name="tada" at={4} gain={0.6} />
      <Sfx name="boing" at={s2 + 2} />
      <Sfx name="gasp" at={s3} gain={0.6} />
      <Sfx name="scratch" at={s5} gain={0.6} />
      <Sfx name="crickets" at={s6} />
      <Sfx name="pop" at={e7 - 30} />
      <Sfx name="build" at={s8 + 4} />
      <Sfx name="knock" at={s9} />
      <Sfx name="sparkle" at={reveal} />
      <Sfx name="ball" at={s11 + 30} />
      <Sfx name="cheer" at={s11 + 40} />
      <Sfx name="jingle" at={endFrom} />
      {T.audio.vo && T.scenes.map((s) => <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/homeb/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />)}
      {T.audio.music && <Audio src={staticFile("audio/homeb/music/theme.mp3")} loop volume={(f) => musicLevel(T, f)} />}
    </AbsoluteFill>
  );
};

