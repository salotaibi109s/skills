import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import data from "../data/homee-timeline.json";
import mouthData from "../data/homee-mouth.json";
import type { TimelineData } from "../lib/timing";
import { musicLevel } from "../room404/kit";
import { Cam, Dark, ease, Flash, FONT, HomeEnd, LivingRoom, makeHome, Shot, Svg, Tag } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, talkOf, Sfx, Jo, Faisal, Baba, Mama } = makeHome(T, mouthData as Record<string, number[]>, "homee");
const S = (id: string) => line(id).from;

/** A giant "monster" shadow on the wall: really Faisal holding a broom up. */
const MonsterShadow: React.FC<{ x: number; y: number; s: number; f: number; o?: number }> = ({ x, y, s, f, o = 0.85 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) skewX(-8)`} opacity={o} fill="#0A0D1A">
    <ellipse cx={0} cy={-560} rx={120} ry={130} />
    <path d="M-110 -450 Q0 -480 110 -450 L150 0 L-150 0Z" />
    <path d={`M-100 -420 Q-260 ${-620 + Math.sin(f / 6) * 20} -300 -760 L-270 -770 Q-220 -620 -80 -440Z`} />
    <path d={`M100 -420 Q260 ${-620 + Math.cos(f / 6) * 20} 300 -760 L330 -750 Q240 -600 80 -440Z`} />
    <rect x={-310} y={-980} width={22} height={300} transform="rotate(-8 -300 -780)" />
    <path d="M-380 -1000 h160 l-30 -110 h-100Z" transform="rotate(-8 -300 -780)" />
  </g>
);

const Broom: React.FC<{ x: number; y: number; s: number; r?: number }> = ({ x, y, s, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-8} y={-300} width={16} height={300} rx={6} fill="#B57E3A" />
    <path d="M-60 0 h120 l20 90 h-160Z" fill="#E3B26B" stroke="#B57E3A" strokeWidth={4} />
  </g>
);

const BreakerPanel: React.FC<{ x: number; y: number; s: number; on: boolean }> = ({ x, y, s, on }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-150} width={220} height={300} rx={14} fill="#D5DAE0" stroke="#8A96A3" strokeWidth={8} />
    <path d="M-30 -130 l-20 50 h30 l-20 50" stroke="#FFC400" strokeWidth={10} fill="none" />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${-60 + i * 60} 40)`}>
        <rect x={-18} y={-50} width={36} height={100} rx={8} fill="#5A6573" />
        <rect x={-14} y={i === 1 && !on ? 4 : -46} width={28} height={42} rx={6} fill={i === 1 && !on ? "#E8414B" : "#9BE07A"} />
      </g>
    ))}
  </g>
);

/** City view outside the window: neighbours' lights on. */
const NeighboursLit: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={652} y={232} width={396} height={496} fill="#141B36" />
    {[
      { x: 670, w: 110, h: 300 },
      { x: 800, w: 120, h: 380 },
      { x: 940, w: 100, h: 260 },
    ].map((b, i) => (
      <g key={i}>
        <rect x={b.x} y={728 - b.h} width={b.w} height={b.h} fill="#2A3358" />
        {Array.from({ length: Math.floor(b.h / 60) * 2 }).map((_, j) => (
          <rect key={j} x={b.x + 14 + (j % 2) * 50} y={728 - b.h + 20 + Math.floor(j / 2) * 60} width={34} height={34} fill="#FFE27A" opacity={0.6 + 0.4 * Math.abs(Math.sin(f / 30 + j + i))} />
        ))}
      </g>
    ))}
  </g>
);

const Chip: React.FC<{ e: string; t: string; k: number }> = ({ e, t, k }) => (
  <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 28px", borderRadius: 40, background: "#fff", boxShadow: "0 8px 0 rgba(0,0,0,0.2)", opacity: k, transform: `scale(${0.6 + 0.4 * k})`, fontFamily: FONT, fontWeight: 800, fontSize: 50, color: "#2B2B2B" }}>
    <span style={{ fontSize: 60 }}>{e}</span>
    {t}
  </div>
);

/** Hand-shadow animals on the wall. */
const HandShadows: React.FC<{ f: number; l: number }> = ({ f, l }) => {
  const which = Math.floor(l / 70) % 3;
  const bob = Math.sin(f / 8) * 14;
  return (
    <g fill="#1A1424" opacity={0.85} transform={`translate(540 ${560 + bob})`}>
      {which === 0 && (
        <g>
          <ellipse cx={0} cy={40} rx={130} ry={90} />
          <ellipse cx={-40} cy={-110} rx={26} ry={90} transform="rotate(-12 -40 -110)" />
          <ellipse cx={30} cy={-110} rx={26} ry={90} transform="rotate(12 30 -110)" />
          <circle cx={-50} cy={10} r={12} fill="#FFF3C4" />
        </g>
      )}
      {which === 1 && <path d={`M-220 0 Q-110 ${-120 + bob * 3} 0 0 Q110 ${-120 + bob * 3} 220 0 Q110 -40 0 30 Q-110 -40 -220 0Z`} />}
      {which === 2 && (
        <g>
          <path d="M-200 0 h300 q60 0 80 -40 v80 q-20 -30 -80 -30 h-300Z" />
          <path d={`M100 -10 l120 ${-30 - Math.abs(bob) * 2} v20Z`} />
          <circle cx={60} cy={-20} r={10} fill="#FFF3C4" />
        </g>
      )}
    </g>
  );
};

export const HomeE: React.FC = () => {
  const s2 = S("P02-J");
  const s3 = S("P03-J");
  const s4 = S("P04-J");
  const s5 = S("P05-J");
  const s6 = S("P06-F");
  const f6 = at("P06-F");
  const e6 = endOf("P06-F");
  const s7 = S("P07-J");
  const s8 = S("P08-D");
  const flip = at("P08-D") - 20;
  const s9 = S("P09-D");
  const offAgain = endOf("P09-D") - 30;
  const s10 = S("P10-M");
  const s11 = S("P11-X");
  const lightsOn = at("P11-X") - 14;
  const endFrom = endOf("P11-X") + 40;
  return (
    <AbsoluteFill style={{ background: "#050816" }}>
      {/* HOOK: blackout + a monster shadow */}
      <Shot from={0} to={s2}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <g transform={`translate(${l < 12 ? Math.sin(l * 3) * 10 : 0} 0)`}>
                <Cam fx={520} fy={1050} z={1.25}>
                  <LivingRoom f={f} night={1} />
                  <MonsterShadow x={560} y={1260} s={0.95} f={f} />
                  <Dark id="dE1" spots={[{ x: 560, y: 700, r: 520 }]} o={0.82} />
                  <Faisal f={f} x={200} y={1760} expr="shock" look={[1, -1]} sweat={1} armL={{ a: 150, b: 170 }} armR={{ a: 150, b: 170 }} />
                </Cam>
              </g>
            </Svg>
            {l < 8 && <Flash l={l} color="#000" />}
          </AbsoluteFill>
        )}
      </Shot>
      {/* Joanna's phone light: the monster is Faisal */}
      <Shot from={s2} to={s4}>
        {(f) => {
          const reveal = f >= s3;
          return (
            <Svg>
              <Cam fx={reveal ? 520 : 560} fy={1150} z={reveal ? 1.45 : 1.2}>
                <LivingRoom f={f} night={1} />
                <MonsterShadow x={520} y={1260} s={0.95} f={f} o={0.7} />
                <Dark id="dE2" spots={[{ x: 520, y: 900, r: 560 }]} o={0.82} />
                <polygon points="900,1300 230,700 230,1500" fill="#FFF3C4" opacity={0.1} />
                <Faisal f={f} x={520} y={1760} expr={reveal ? "shock" : "worry"} look={reveal ? [0, -1] : [1, -0.3]} armL={{ target: [-170, -1000] }} />
                <Broom x={520 - 0.42 * 170} y={1760 - 0.42 * 1000} s={0.5} r={170} />
                <Jo f={f} x={880} y={1760} expr={reveal ? "laugh" : "smile"} look={[-1, -0.2]} armL={{ target: [-200, -620] }} />
                <rect x={880 - 0.55 * 200 - 16} y={1760 - 0.55 * 620 - 24} width={32} height={48} rx={6} fill="#222" />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* the neighbours have power */}
      <Shot from={s4} to={s5}>
        {(f, l) => (
          <Svg>
            <Cam fx={850} fy={520 + ease(l, 0, 40) * 120} z={2.0}>
              <LivingRoom f={f} night={1} />
              <NeighboursLit f={f} />
              <Dark id="dE3" spots={[{ x: 850, y: 480, r: 300 }, { x: 760, y: 900, r: 220 }]} o={0.6} />
              <Jo f={f} x={760} y={1400} s={0.5} expr="sly" look={[0.8, -1]} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* what was switched on? */}
      <Shot from={s5} to={s7}>
        {(f) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={540} fy={1250} z={1.45}>
                <LivingRoom f={f} night={1} />
                <Dark id="dE4" spots={[{ x: 540, y: 1300, r: 500 }]} o={0.7} />
                <Jo f={f} x={720} y={1760} expr={f >= s6 ? "shock" : "sly"} look={[-1, -0.2]} armR={f < s6 ? { target: [60, -760] } : {}} />
                <Faisal f={f} x={400} y={1760} expr="worry" look={[1, -0.3]} armR={f >= s6 ? { a: 120, b: 160 } : {}} sweat={f >= s6 ? 1 : 0} />
              </Cam>
            </Svg>
            <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              {f < s6 && <div style={{ fontSize: 120, opacity: ease(f, s5, s5 + 12) }}>⚙️❓</div>}
              {f >= s6 &&
                [
                  ["🔥", "الدفاية"],
                  ["☕", "الغلاية"],
                  ["🎮", "شاحن اللعبة"],
                  ["💨", "السيشوار"],
                ].map(([e, t], i) => <Chip key={t} e={e} t={t} k={ease(f, f6 + ((e6 - f6) * i) / 4, f6 + ((e6 - f6) * i) / 4 + 10)} />)}
              {f >= e6 && <div style={{ marginTop: 10, fontFamily: FONT, fontWeight: 800, fontSize: 60, color: "#FFE14D", textShadow: "0 4px 0 #000" }}>⚡ حمل زايد!</div>}
            </div>
          </AbsoluteFill>
        )}
      </Shot>
      {/* don't touch it! */}
      <Shot from={s7} to={s8}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={260} fy={1100} z={1.6}>
                <LivingRoom f={f} night={1} />
                <BreakerPanel x={190} y={860} s={0.9} on={false} />
                <Dark id="dE5" spots={[{ x: 220, y: 1000, r: 380 }]} o={0.75} />
                <Faisal f={f} x={330} y={1760} expr={l > 10 ? "shock" : "sly"} look={[-1, -1]} armR={l > 10 ? {} : { target: [-260, -880] }} armL={l > 10 ? {} : { target: [-300, -840] }} />
                <Jo f={f} x={560} y={1760} expr="shock" look={[-1, -0.3]} armL={{ target: [-260, -620] }} />
              </Cam>
            </Svg>
            {l > 6 && l < 40 && <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontSize: 220, opacity: 1 - Math.max(0, (l - 30) / 10) }}>✋</div>}
          </AbsoluteFill>
        )}
      </Shot>
      {/* Dad fixes it — then switches the lights off again */}
      <Shot from={s8} to={s10}>
        {(f, l) => {
          const on = f >= flip && f < offAgain;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={on ? 460 : 320} fy={1150} z={on ? 1.25 : 1.45}>
                  <LivingRoom f={f} night={on ? 0 : 1} nightSky />
                  <BreakerPanel x={190} y={860} s={0.9} on={f >= flip} />
                  {!on && <Dark id="dE6" spots={[{ x: 300, y: 1000, r: 420 }]} o={0.72} />}
                  <Baba f={f} x={360} y={1780} expr={f >= s9 ? "sly" : "smile"} look={f >= s9 ? [1, 0.2] : [-1, -0.5]} armR={f < flip + 10 ? { target: [-280, -1170] } : f >= s9 ? { a: 120, b: 160 } : {}} />
                  <Jo f={f} x={680} y={1780} expr="happy" look={[-1, -0.4]} />
                  <Faisal f={f} x={860} y={1780} expr={on ? "happy" : "smile"} look={[-1, -0.4]} />
                </Cam>
              </Svg>
              {(Math.abs(f - flip) < 6 || Math.abs(f - offAgain) < 6) && <Flash l={Math.abs(f - (Math.abs(f - flip) < 6 ? flip : offAgain))} color={f >= offAgain ? "#000" : "#fff"} />}
              {l < 2 && null}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* family time by flashlight: hand shadows */}
      <Shot from={s10} to={s11}>
        {(f, l) => (
          <Svg>
            <Cam fx={540} fy={1050} z={1.15}>
              <LivingRoom f={f} night={1} />
              <Dark id="dE7" spots={[{ x: 540, y: 560, r: 330 }, { x: 540, y: 1500, r: 520 }]} o={0.8} />
              <HandShadows f={f} l={l} />
              <Baba f={f} x={830} y={1900} expr="laugh" look={[-0.6, -0.6]} armL={{ target: [-260, -1200] }} />
              <Mama f={f} x={250} y={1880} expr="happy" look={[0.6, -0.5]} />
              <rect x={-200} y={1560} width={1500} height={500} rx={60} fill="#7A3B5E" />
              <ellipse cx={540} cy={1560} rx={700} ry={40} fill="#8E4A6E" />
              <Jo f={f} x={420} y={1700} s={0.5} seated expr="laugh" look={[0.3, -1]} />
              <Faisal f={f} x={650} y={1700} s={0.4} seated expr="laugh" look={[-0.3, -1]} />
              <rect x={515} y={1600} width={50} height={80} rx={10} fill="#E8414B" />
              <circle cx={540} cy={1600} r={30} fill="#FFF3C4" />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* lights on: "turn them off!" */}
      <Shot from={s11} to={endFrom}>
        {(f, l) => {
          const on = f >= lightsOn;
          const tk = talkOf("X", f);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={1150} z={1.15}>
                  <LivingRoom f={f} night={on ? 0 : 1} nightSky />
                  {!on && <Dark id="dE8" spots={[{ x: 540, y: 1500, r: 520 }]} o={0.8} />}
                  <Baba f={f} x={830} y={1900} expr={on ? "laugh" : "happy"} talk={tk} look={[-0.6, -0.2]} armL={on ? { a: 150, b: 170 } : {}} armR={on ? { a: 150, b: 170 } : {}} />
                  <Mama f={f} x={250} y={1880} expr={on ? "laugh" : "happy"} talk={tk} look={[0.6, -0.2]} />
                  <rect x={-200} y={1560} width={1500} height={500} rx={60} fill="#7A3B5E" />
                  <ellipse cx={540} cy={1560} rx={700} ry={40} fill="#8E4A6E" />
                  <Jo f={f} x={420} y={1700} s={0.5} seated expr={on ? "laugh" : "happy"} talk={tk} look={[0.3, -0.4]} armL={on ? { a: 150, b: 170 } : {}} armR={on ? { a: 150, b: 170 } : {}} />
                  <Faisal f={f} x={650} y={1700} s={0.4} seated expr={on ? "laugh" : "happy"} talk={tk} look={[-0.3, -0.4]} armL={on ? { a: 150, b: 170 } : {}} armR={on ? { a: 150, b: 170 } : {}} />
                </Cam>
              </Svg>
              {on && Math.abs(f - lightsOn) < 6 && <Flash l={f - lightsOn} />}
              {l < 0 && null}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={endFrom} to={T.durationInFrames}>
        {(_f, l) => <HomeEnd l={l} value="السلامة أولاً… وأحلى نور اجتماع العائلة 🤍" next="طاخ! مين كسرها؟" />}
      </Shot>
      <Tag text="حكايات بيتنا · الحلقة ٥" />

      <Sfx name="powerdown" at={0} />
      <Sfx name="heartbeat" at={14} />
      <Sfx name="click" at={s2 + 6} />
      <Sfx name="boing" at={s3 + 10} />
      <Sfx name="laugh" at={endOf("P03-J")} gain={0.5} />
      <Sfx name="magnify" at={s4} />
      <Sfx name="tick" at={s5} />
      <Sfx name="pop" at={f6} />
      <Sfx name="pop" at={f6 + (e6 - f6) / 4} />
      <Sfx name="pop" at={f6 + (e6 - f6) / 2} />
      <Sfx name="pop" at={f6 + ((e6 - f6) * 3) / 4} />
      <Sfx name="zap" at={e6} />
      <Sfx name="sting" at={s7 + 8} />
      <Sfx name="steps" at={s8 - 10} />
      <Sfx name="switch" at={flip} />
      <Sfx name="powerup" at={flip + 2} />
      <Sfx name="switch" at={offAgain} />
      <Sfx name="giggle" at={s10 + 20} />
      <Sfx name="switch" at={lightsOn} />
      <Sfx name="laugh" at={endOf("P11-X")} gain={0.6} />
      <Sfx name="jingle" at={endFrom} />
      {T.audio.vo && T.scenes.map((s) => <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/homee/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />)}
      {T.audio.music && <Audio src={staticFile("audio/homee/music/theme.mp3")} loop volume={(f) => musicLevel(T, f)} />}
    </AbsoluteFill>
  );
};
