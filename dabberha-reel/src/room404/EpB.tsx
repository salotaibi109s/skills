import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import data from "../data/r404b-timeline.json";
import mouthData from "../data/r404b-mouth.json";
import type { TimelineData } from "../lib/timing";
import { db } from "../theme";
import { Cam, Countdown, ease, EndCard, Flash, FONT, Holo, Lab, makeEp, Shot, Svg, Tag, TaglineCard, Zero } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, talkOf, Sfx, Jo, Faisal } = makeEp(T, mouthData as Record<string, number[]>, "r404b");

/** Future city skyline; light 0 = blackout, 1 = fully lit. */
const City: React.FC<{ f: number; light: number }> = ({ f, light }) => (
  <g>
    {[
      [-240, 220],
      [-170, 320],
      [-90, 260],
      [-10, 380],
      [70, 290],
      [150, 340],
      [220, 240],
    ].map(([x, h], i) => (
      <g key={i}>
        <rect x={x - 34} y={180 - h} width={68} height={h} fill="#5CF2FF" fillOpacity={0.15 + 0.25 * light} stroke="#5CF2FF" strokeWidth={3} />
        {Array.from({ length: Math.floor(h / 40) }).map((_, w) => (
          <rect key={w} x={x - 18 + (w % 2) * 20} y={160 - w * 40} width={14} height={18} fill="#FFF3C4" opacity={light * (0.5 + 0.5 * Math.abs(Math.sin(f / 9 + w + i)))} />
        ))}
      </g>
    ))}
    <rect x={-300} y={180} width={600} height={6} fill="#5CF2FF" />
  </g>
);

const COLORS = { red: "#FF4D6D", blue: "#3F8CFF", yellow: "#FFD23F" };
/** Wire puzzle: plugs on the right, sockets 1-3 on the left; links[colour] = socket index (0..2) and progress. */
const WirePanel: React.FC<{ links?: { c: keyof typeof COLORS; to: number; k: number }[]; glow?: number }> = ({ links = [], glow = 0 }) => {
  const plugY = { red: 760, blue: 960, yellow: 1160 };
  const sockY = [760, 960, 1160];
  return (
    <g>
      <rect x={90} y={560} width={900} height={780} rx={40} fill="#0A1620" stroke={glow > 0 ? "#8EF7A0" : "#5CF2FF"} strokeWidth={8} />
      {(Object.keys(COLORS) as (keyof typeof COLORS)[]).map((c) => (
        <g key={c}>
          <rect x={860} y={plugY[c] - 34} width={90} height={68} rx={14} fill={COLORS[c]} />
          <rect x={830} y={plugY[c] - 12} width={40} height={24} rx={6} fill="#C9D2DC" />
        </g>
      ))}
      {sockY.map((y, i) => (
        <g key={i}>
          <circle cx={200} cy={y} r={46} fill="#14303A" stroke="#5CF2FF" strokeWidth={6} />
          <text x={200} y={y + 20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={56} fill="#fff">
            {"١٢٣"[i]}
          </text>
        </g>
      ))}
      {links.map((L) => {
        const y1 = plugY[L.c];
        const y2 = sockY[L.to];
        const x2 = 830 - (830 - 250) * L.k;
        const y2k = y1 + (y2 - y1) * L.k;
        return <path key={L.c} d={`M830 ${y1} C${700 - 200 * L.k} ${y1} ${450} ${y2k} ${x2} ${y2k}`} stroke={COLORS[L.c]} strokeWidth={18} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
};

const Clues: React.FC<{ hl?: number }> = ({ hl = -1 }) => (
  <div dir="rtl" style={{ position: "absolute", top: 1400, left: 110, right: 150, display: "flex", flexDirection: "column", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: 48, color: "#fff" }}>
    {["🔵 الأزرق في النص", "🔴 الأحمر مو في رقم ١"].map((t, i) => (
      <div key={t} style={{ padding: "10px 24px", borderRadius: 22, background: hl === i ? "rgba(255,210,63,0.3)" : "rgba(14,42,51,0.88)", border: `3px solid ${hl === i ? "#FFD23F" : "#5CF2FF"}` }}>
        {t}
      </div>
    ))}
  </div>
);

export const Room404B: React.FC = () => {
  const s2 = line("B02-J").from;
  const s3 = line("B03-F").from;
  const s4 = line("B04-Z").from;
  const e4 = endOf("B04-Z");
  const s5 = line("B05-F").from;
  const f5 = at("B05-F");
  const s6 = line("B06-J").from;
  const j6 = at("B06-J");
  const e6 = endOf("B06-J");
  const s7 = line("B07-F").from;
  const s8 = line("B08-Z").from;
  const s9 = line("B09-J").from;
  const s10 = line("B10-F").from;
  const s11 = line("B11-J").from;
  const e11 = endOf("B11-J");
  const qFrom = e11 + 10;
  const tagFrom = qFrom + 50;
  const endFrom = tagFrom + 120;
  const span6 = e6 - j6;
  const blueAt = j6 + span6 * 0.45;
  const redAt = j6 + span6 * 0.7;
  const yelAt = j6 + span6 * 0.88;
  const warnAt = s10 + 10;
  return (
    <AbsoluteFill style={{ background: "#0E2A33" }}>
      {/* hook: a message from the future */}
      <Shot from={0} to={s3}>
        {(f, l) => {
          const k = ease(l, 4, 24);
          const light = f < s2 ? 1 : 1 - ease(f, s2 + 20, s3 - 10);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={560} fy={1000} z={1.25}>
                  <Lab f={f} dim={0.2} />
                  <Holo x={540} y={720} w={640} h={460} f={f} k={k}>
                    <text x={0} y={-170} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill="#BFF8FF">
                      ٢٠٦٠
                    </text>
                    <City f={f} light={light} />
                  </Holo>
                  <Zero x={860} y={1480} s={0.62} f={f} mood="neutral" talk={talkOf("Z", f)} look={-0.6} arm={0.8} />
                  <Faisal f={f} x={260} y={1720} expr="shock" look={[0.8, -1]} />
                  <Jo f={f} x={450} y={1720} expr={f >= s2 ? "worry" : "shock"} look={[0.6, -1]} />
                </Cam>
              </Svg>
              {l < 8 && <Flash l={l} color="#BFF8FF" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* we're only in fifth grade + the wire panel */}
      <Shot from={s3} to={s5}>
        {(f) => {
          const panel = f >= s4;
          return (
            <AbsoluteFill>
              <Svg>
                {panel ? (
                  <g>
                    <rect x={0} y={0} width={1080} height={1920} fill="#0E2A33" />
                    <g opacity={ease(f, s4, s4 + 16)}>
                      <WirePanel />
                    </g>
                    <Zero x={850} y={1880} s={0.5} f={f} mood="neutral" talk={talkOf("Z", f)} look={-0.8} />
                  </g>
                ) : (
                  <Cam fx={300} fy={1150} z={1.9}>
                    <Lab f={f} dim={0.4} />
                    <Faisal f={f} x={300} y={1720} expr="worry" look={[0.6, -0.4]} armL={{ a: 60, b: 130 }} armR={{ a: 60, b: 130 }} />
                  </Cam>
                )}
              </Svg>
              {panel && f > e4 && <Clues />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* think time, then Faisal grabs the red wire */}
      <Shot from={s5} to={s6}>
        {(f, l) => {
          const think = f < f5 - 4;
          const grab = ease(f, f5, f5 + 20);
          return (
            <AbsoluteFill>
              <Svg>
                <rect x={0} y={0} width={1080} height={1920} fill="#0E2A33" />
                <WirePanel links={grab > 0 ? [{ c: "red", to: 0, k: grab * 0.6 }] : []} />
                {!think && <Faisal f={f} x={760} y={2070} s={0.6} expr="happy" look={[-0.8, -1]} armR={{ target: [100, -1000] }} />}
              </Svg>
              <Clues />
              {think && <Countdown l={l} total={f5 - 4 - s5} question="وين يروح كل سلك؟" top={330} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* Joanna stops him and reasons it out */}
      <Shot from={s6} to={s7}>
        {(f) => {
          const back = 1 - ease(f, j6, j6 + 12);
          const links = [
            ...(back > 0 ? [{ c: "red" as const, to: 0, k: back * 0.6 }] : []),
            { c: "blue" as const, to: 1, k: ease(f, blueAt, blueAt + 18) },
            ...(f >= redAt ? [{ c: "red" as const, to: 2, k: ease(f, redAt, redAt + 18) }] : []),
            { c: "yellow" as const, to: 0, k: ease(f, yelAt, yelAt + 18) },
          ];
          const done = f >= yelAt + 18;
          const hl = f < blueAt ? -1 : f < redAt ? 0 : 1;
          return (
            <AbsoluteFill>
              <Svg>
                <rect x={0} y={0} width={1080} height={1920} fill="#0E2A33" />
                <WirePanel links={links} glow={done ? 1 : 0} />
                <Jo f={f} x={320} y={2100} s={0.62} expr={done ? "happy" : "proud"} look={[0.6, -1]} armL={{ target: [-200, -960] }} />
              </Svg>
              <Clues hl={hl} />
              {done && f < yelAt + 26 && <Flash l={f - yelAt - 18} color="#8EF7A0" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* the city lights up */}
      <Shot from={s7} to={s9}>
        {(f, l) => {
          const light = ease(l, 6, 40);
          const zeroT = f >= s8;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={zeroT ? 720 : 560} fy={1000} z={zeroT ? 1.35 : 1.2}>
                  <Lab f={f} />
                  <Holo x={540} y={720} w={640} h={460} f={f}>
                    <text x={0} y={-170} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={54} fill="#BFF8FF">
                      ٢٠٦٠
                    </text>
                    <City f={f} light={light} />
                  </Holo>
                  <Zero x={860} y={1480} s={0.62} f={f} mood={zeroT ? "neutral" : "happy"} talk={talkOf("Z", f)} look={-0.6} />
                  <Faisal f={f} x={260} y={1720 - (zeroT ? 0 : Math.abs(Math.sin(l / 5)) * 40)} expr="laugh" look={[0.6, -1]} armL={{ a: 150, b: 175 }} armR={{ a: 150, b: 175 }} />
                  <Jo f={f} x={450} y={1720} expr="happy" look={[0.6, -1]} armR={{ a: 150, b: 175 }} />
                </Cam>
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* the photo from the future, then the warning */}
      <Shot from={s9} to={s11}>
        {(f, l) => {
          const warn = f >= warnAt;
          const g = warn ? (Math.floor(f / 3) % 4 === 0 ? 12 : 0) : 0;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={900} z={1.25}>
                  <Lab f={f} alarm={warn ? 1 : 0} />
                  <Holo x={540 + g} y={760} w={700} h={620} f={f} k={ease(l, 0, 16)} red={warn}>
                    <g style={{ filter: "sepia(1) hue-rotate(140deg) saturate(2.5) brightness(1.1)" }} opacity={warn ? 0.5 : 0.9}>
                      <Jo f={f} x={-110} y={300} s={0.5} expr="smile" look={[0, 0]} blink={0} talk={0} />
                      <Faisal f={f} x={130} y={300} s={0.5} expr="smile" look={[0, 0]} blink={0} talk={0} />
                    </g>
                    {warn && (
                      <text x={0} y={-230} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={66} fill="#FF4D6D" style={{ filter: "drop-shadow(0 0 12px #FF4D6D)" }}>
                        لا تثقوا بزيرو!
                      </text>
                    )}
                  </Holo>
                </Cam>
              </Svg>
              {warn && f < warnAt + 8 && <Flash l={f - warnAt} color="#FF4D6D" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* Joanna's realisation; Zero's eyes flicker red behind */}
      <Shot from={s11} to={qFrom}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={interpolate(ease(l, 0, 40), [0, 1], [420, 520])} fy={1170} z={interpolate(ease(l, 0, 60), [0, 1], [2.0, 2.6])}>
                <Lab f={f} alarm={0.6} />
                <Zero x={820} y={1480} s={0.62} f={f} mood="glitch" look={-0.6} />
                <Jo f={f} x={420} y={1720} expr="shock" look={[0, 0]} sweat={1} />
              </Cam>
            </Svg>
            <AbsoluteFill style={{ background: "radial-gradient(60% 45% at 50% 45%, transparent 40%, rgba(40,0,10,0.45) 100%)" }} />
          </AbsoluteFill>
        )}
      </Shot>
      {/* question to the viewer + tagline */}
      <Shot from={qFrom} to={endFrom}>
        {(f, l) => (
          <AbsoluteFill style={{ background: "#071A22" }}>
            <Svg>
              <Zero x={540} y={1250} s={0.9} f={f} mood={l < 60 ? "glitch" : "smug"} look={0} />
            </Svg>
            <div dir="rtl" style={{ position: "absolute", top: 260, left: 90, right: 140, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 84, color: "#FFD23F", textShadow: "0 0 30px rgba(255,210,63,0.5)" }}>
              هل تثق في زيرو؟ 🤖
            </div>
            {f >= tagFrom && <TaglineCard l={f - tagFrom} />}
          </AbsoluteFill>
        )}
      </Shot>
      <Shot from={endFrom} to={1800}>
        {(_f, l) => <EndCard l={l} next="الحلقة ٣: هل زيرو صديق أم عدو؟" />}
      </Shot>
      <Tag text="سرّ الغرفة 404 · الحلقة ٢" />

      <Sfx name="lab" at={0} />
      <Sfx name="holo" at={4} />
      <Sfx name="powerdown" at={s2 + 20} />
      <Sfx name="whoosh" at={s4} />
      <Sfx name="tick" at={s5 + 2} />
      <Sfx name="zap" at={f5 + 6} gain={0.6} />
      <Sfx name="wrong" at={j6} gain={0.6} />
      <Sfx name="zap" at={blueAt} />
      <Sfx name="zap" at={redAt} />
      <Sfx name="zap" at={yelAt} />
      <Sfx name="correct" at={yelAt + 18} />
      <Sfx name="powerup" at={s7 + 6} />
      <Sfx name="cheer" at={s7 + 30} gain={0.7} />
      <Sfx name="beep" at={s8 + 4} />
      <Sfx name="holo" at={s9} />
      <Sfx name="glitch" at={warnAt} />
      <Sfx name="alarm" at={warnAt + 20} />
      <Sfx name="sting" at={e11} />
      <Sfx name="tagline" at={tagFrom} />
      {T.scenes.map((s) => (
        <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/r404b/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />
      ))}
      <Audio name="VO tagline" src={staticFile("audio/r404b/vo/TAG.mp3")} from={tagFrom + 10} />
      <Audio
        src={staticFile("audio/r404b/music/theme.mp3")}
        volume={(f) => {
          const inVoice = T.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 6);
          const fd = interpolate(f, [0, 6, 1770, 1800], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (inVoice ? db(-22) : db(-15)) * fd;
        }}
      />
    </AbsoluteFill>
  );
};
