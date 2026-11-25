import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import data from "../data/r404f-timeline.json";
import mouthData from "../data/r404f-mouth.json";
import type { TimelineData } from "../lib/timing";
import { Cam, Corridor, Countdown, ease, EndCard, EyeScreen, Flash, FONT, Lab, makeEp, musicLevel, Shot, Svg, Tag, TaglineCard, Virus, Wave, Zero } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, talkOf, Sfx, Jo, Faisal } = makeEp(T, mouthData as Record<string, number[]>, "r404f");

/** Guard robot (grey Zero-like shell with a visor). */
const Guard: React.FC<{ x: number; y: number; s: number; f: number; visor: string; point?: number }> = ({ x, y, s, f, visor, point = 0 }) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 12) * 6}) scale(${s})`}>
    <rect x={-120} y={-560} width={240} height={420} rx={60} fill="#4A5566" stroke="#2A3240" strokeWidth={6} />
    <rect x={-90} y={-500} width={180} height={60} rx={20} fill={visor} opacity={0.85} />
    <rect x={-130} y={-140} width={260} height={140} rx={30} fill="#3A4454" />
    <path d={`M120 -400 q${60 + point * 80} ${-point * 60} ${80 + point * 120} ${40 - point * 140}`} stroke="#6B7686" strokeWidth={30} strokeLinecap="round" fill="none" />
  </g>
);

const Door: React.FC<{ x: number; y: number; open?: number; mark?: "ok" | "bad" | null }> = ({ x, y, open = 0, mark = null }) => (
  <g>
    <rect x={x - 150} y={y - 500} width={300} height={500} rx={12} fill="#0A1620" />
    <g transform={`translate(${-open * 280} 0)`}>
      <rect x={x - 140} y={y - 490} width={280} height={490} rx={10} fill="#2C4A58" stroke={mark === "ok" ? "#8EF7A0" : mark === "bad" ? "#FF4D6D" : "#5CF2FF"} strokeWidth={6} />
    </g>
    {open > 0 && <rect x={x - 140} y={y - 490} width={280 * open} height={490} fill="#BFF8FF" opacity={0.8} />}
  </g>
);

export const Room404F: React.FC = () => {
  const s2 = line("F02-F").from;
  const s3 = line("F03-Z").from;
  const s4 = line("F04-V").from;
  const e4 = endOf("F04-V");
  const s5 = line("F05-F").from;
  const f5 = at("F05-F");
  const s6 = line("F06-J").from;
  const e6 = endOf("F06-J");
  const s7 = line("F07-Z").from;
  const s8 = line("F08-Z").from;
  const s9 = line("F09-F").from;
  const e9 = endOf("F09-F");
  const s10 = line("F10-Z").from;
  const z10 = at("F10-Z");
  const s11 = line("F11-X").from;
  const e11 = endOf("F11-X");
  const press = e9 + 6;
  const tagFrom = e11 + 14;
  const endFrom = tagFrom + 100;
  return (
    <AbsoluteFill style={{ background: "#05080D" }}>
      {/* HOOK: every screen in the school shows the same eye */}
      <Shot from={0} to={s3}>
        {(f, l) => {
          const close = f >= s2;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={close ? 1250 : interpolate(ease(l, 0, 60), [0, 1], [900, 1000])} z={close ? 2.0 : interpolate(ease(l, 0, 60), [0, 1], [0.95, 1.2])}>
                  <Corridor f={f} doorGlow={0} />
                  <rect x={-1400} y={-800} width={3900} height={2300} fill="#000" opacity={0.55} />
                  {[
                    [140, 380],
                    [940, 380],
                    [540, 230],
                    [140, 760],
                    [940, 760],
                  ].map(([x, y], i) => (
                    <EyeScreen key={i} x={x} y={y} w={300} h={190} f={f + i * 7} />
                  ))}
                  <Faisal f={f} x={440} y={1720} expr={close ? "worry" : "shock"} look={[0.2, -1]} armsFront={close} armL={close ? { target: [-60, -560] } : {}} />
                  <Jo f={f} x={640} y={1720} expr="shock" look={[-0.2, -1]} />
                </Cam>
              </Svg>
              {l < 5 && <Flash l={l} color="#fff" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* Zero explains the stakes */}
      <Shot from={s3} to={s4}>
        {(f) => (
          <Svg>
            <Cam fx={640} fy={1100} z={1.5}>
              <Lab f={f} alarm={0.6} />
              <Virus x={540} y={700} s={0.55} f={f} />
              <Zero x={780} y={1460} s={0.62} f={f} mood="neutral" talk={talkOf("Z", f)} look={-0.6} />
              <Faisal f={f} x={330} y={1720} expr="worry" look={[1, -0.4]} />
              <Jo f={f} x={520} y={1720} expr="worry" look={[1, -0.4]} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* the riddle of the two guards */}
      <Shot from={s4} to={s7}>
        {(f, l) => {
          const think = f >= e4 + 4 && f < f5 - 4;
          const jo = f >= s6;
          const point = jo ? ease(f, e6 - 60, e6 - 40) : 0;
          const open = ease(f, e6 - 20, e6);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={1060} z={1.1}>
                  <Lab f={f} dim={0.5} />
                  <Door x={320} y={1300} mark={open > 0 ? "bad" : null} />
                  <Door x={760} y={1300} open={open} mark={open > 0 ? "ok" : null} />
                  <Guard x={170} y={1500} s={0.6} f={f} visor="#3F8CFF" point={point} />
                  <Guard x={910} y={1500} s={0.6} f={f} visor="#FF8C2B" />
                  {f < s5 && <Virus x={540} y={450} s={0.45} f={f} />}
                  {f >= f5 - 4 && <Faisal f={f} x={420} y={1800} s={0.5} expr={jo ? "happy" : "worry"} look={[0.6, -1]} />}
                  {f >= f5 - 4 && <Jo f={f} x={640} y={1800} s={0.6} expr={jo ? "proud" : "smile"} look={[-0.4, -1]} armR={jo ? { target: [200, -760] } : {}} />}
                </Cam>
              </Svg>
              {f < f5 - 4 && (
                <div dir="rtl" style={{ position: "absolute", top: 1440, left: 100, right: 150, padding: "16px 24px", borderRadius: 26, background: "rgba(14,42,51,0.92)", border: "3px solid #5CF2FF", fontFamily: FONT, fontWeight: 700, fontSize: 40, lineHeight: 1.5, color: "#fff", opacity: ease(f, s4 + 40, s4 + 60) }}>
                  بابين · حارس <span style={{ color: "#8EF7A0" }}>يصدق دايم</span> · حارس <span style={{ color: "#FF4D6D" }}>يكذب دايم</span>
                  <br />
                  ما تدري مين مين… ولك <span style={{ color: "#FFD23F" }}>سؤال واحد</span>.
                </div>
              )}
              {think && <Countdown l={f - e4 - 4} total={f5 - 8 - e4} top={300} question="وش السؤال اللي يكشف الباب الصح؟" />}
              {open > 0.9 && f < e6 + 8 && <Flash l={f - e6} color="#8EF7A0" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* compliment, then the core room: the risk */}
      <Shot from={s7} to={s9}>
        {(f) => {
          const core = f >= s8;
          return (
            <Svg>
              <Cam fx={core ? 620 : 680} fy={core ? 1000 : 1200} z={core ? 1.2 : 1.9}>
                <Lab f={f} dim={core ? 0.4 : 0} />
                {core && (
                  <g>
                    <circle cx={540} cy={640} r={170} fill="#5CF2FF" opacity={0.15 + 0.1 * Math.sin(f / 6)} />
                    <circle cx={540} cy={640} r={90} fill="#0E2A33" stroke="#5CF2FF" strokeWidth={8} />
                    <Virus x={540 + 280 - ease(f, s8, s9) * 120} y={640} s={0.45} f={f} />
                  </g>
                )}
                <Zero x={780} y={1460} s={0.62} f={f} mood={core ? "neutral" : "smug"} talk={talkOf("Z", f)} look={-0.6} />
                <Jo f={f} x={500} y={1720} expr={core ? "worry" : "happy"} look={[1, -0.4]} />
                <Faisal f={f} x={300} y={1720} expr={core ? "worry" : "happy"} look={[1, -0.4]} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* Faisal presses the right button this time */}
      <Shot from={s9} to={s10}>
        {(f, l) => {
          const pressed = f >= press;
          const white = ease(f, press, press + 10) * (1 - ease(f, press + 30, press + 60));
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={pressed ? 540 : 400} fy={pressed ? 1000 : 1250} z={pressed ? 1.2 : 2.0 + ease(l, 0, 120) * 0.4}>
                  <Lab f={f} dim={0.3} />
                  <rect x={360} y={1340} width={200} height={120} rx={20} fill="#3A4454" />
                  <circle cx={460} cy={1340} r={56} fill={pressed ? "#8EF7A0" : "#FF4D6D"} stroke="#fff" strokeWidth={6} />
                  <Virus x={540} y={640} s={0.45} f={f} k={pressed ? 1 - ease(f, press + 10, press + 50) : 1} />
                  <Faisal f={f} x={400} y={1720} expr={pressed ? "happy" : "proud"} look={[0.3, -0.2]} armR={{ target: [140, -680 + (pressed ? 0 : -60)] }} />
                </Cam>
              </Svg>
              {white > 0 && <AbsoluteFill style={{ background: "#fff", opacity: white }} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* Zero flickers... and comes back */}
      <Shot from={s10} to={s11}>
        {(f, l) => {
          const back = ease(f, z10 - 10, z10 + 6);
          return (
            <Svg>
              <Cam fx={680} fy={1200} z={1.8}>
                <Lab f={f} />
                <Zero x={760} y={1460} s={0.62} f={f} mood={back > 0.5 ? "smug" : "sleep"} boot={Math.max(0.05, back)} talk={talkOf("Z", f)} look={-0.6} />
                <Faisal f={f} x={330} y={1720} expr={back > 0.5 ? "laugh" : "worry"} look={[1, -0.4]} />
                <Jo f={f} x={520} y={1720} expr={back > 0.5 ? "laugh" : "worry"} look={[1, -0.4]} />
                {l < 40 && <circle cx={760} cy={1250} r={200 + l * 4} fill="none" stroke="#5CF2FF" strokeWidth={6} opacity={1 - l / 40} />}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* ending twist: room 405 */}
      <Shot from={s11} to={tagFrom}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={1400} fy={1000} z={1.25 + ease(l, 0, 150) * 0.4}>
                <Corridor f={f} doorGlow={0} />
                <g transform="translate(860 0)">
                  <rect x={300} y={420} width={480} height={830} rx={16} fill="#121A2A" />
                  <rect x={330} y={450} width={420} height={800} rx={10} fill="#3A2A14" stroke="#FFD23F" strokeWidth={6} opacity={0.9} />
                  <text x={540} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={130} fill="#FFD23F" style={{ filter: "drop-shadow(0 0 18px #FFD23F)" }} opacity={0.6 + 0.4 * Math.abs(Math.sin(f / 10))}>
                    405
                  </text>
                </g>
                <Wave x={1400} y={330} w={420} f={f} amp={talkOf("X", f)} />
              </Cam>
            </Svg>
          </AbsoluteFill>
        )}
      </Shot>
      <Shot from={tagFrom} to={endFrom}>
        {(f, l) => (
          <AbsoluteFill style={{ background: "#071A22" }}>
            <Svg>
              <Zero x={540} y={1200} s={0.9} f={f} mood="happy" />
            </Svg>
            <TaglineCard l={l} />
          </AbsoluteFill>
        )}
      </Shot>
      <Shot from={endFrom} to={2100}>
        {(_f, l) => <EndCard l={l} next="نهاية الجزء الأول · الغرفة 405 قريباً!" />}
      </Shot>
      <Tag text="سرّ الغرفة 404 · الحلقة ٦" />

      <Sfx name="glitch" at={2} />
      <Sfx name="powerdown" at={10} gain={0.7} />
      <Sfx name="hum" at={20} />
      <Sfx name="robot" at={s3 + 4} />
      <Sfx name="whoosh" at={s4} />
      <Sfx name="tick" at={e4 + 4} />
      <Sfx name="wrong" at={endOf("F05-F") - 10} gain={0.6} />
      <Sfx name="door" at={e6 - 20} />
      <Sfx name="correct" at={e6 - 6} />
      <Sfx name="alarm" at={s8 + 6} gain={0.7} />
      <Sfx name="beep" at={press} />
      <Sfx name="powerup" at={press + 2} />
      <Sfx name="reveal" at={press + 20} />
      <Sfx name="boot" at={z10 - 20} />
      <Sfx name="cheer" at={endOf("F10-Z")} gain={0.6} />
      <Sfx name="sting" at={s11 + 4} />
      <Sfx name="tagline" at={tagFrom} />
      {T.audio.vo && T.scenes.map((s) => <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/r404f/vo/${s.id}.mp3`)} from={s.from + s.voFrom} volume={s.id.endsWith("-Z") ? 1.25 : 1} />)}
      {T.audio.vo && <Audio name="VO tagline" src={staticFile("audio/r404f/vo/TAG.mp3")} from={tagFrom + 10} />}
      {T.audio.music && <Audio src={staticFile("audio/r404f/music/theme.mp3")} loop volume={(f) => musicLevel(T, f)} />}
    </AbsoluteFill>
  );
};
