import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import data from "../data/r404d-timeline.json";
import mouthData from "../data/r404d-mouth.json";
import type { TimelineData } from "../lib/timing";
import { Cam, Countdown, ease, EndCard, Flash, FONT, Holo, Lab, makeEp, musicLevel, Shot, Svg, Tag, TaglineCard, Wave, Zero } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, talkOf, Sfx, Jo, Faisal } = makeEp(T, mouthData as Record<string, number[]>, "r404d");

/** Three wall switches; on[i] = lever up. */
const Switches: React.FC<{ x: number; y: number; s: number; on: boolean[]; glow?: number }> = ({ x, y, s, on, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-330} y={-200} width={660} height={400} rx={30} fill="#1B2E38" stroke="#5CF2FF" strokeWidth={6} />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${200 - i * 200} 0)`}>
        <rect x={-50} y={-110} width={100} height={220} rx={20} fill="#0A1620" stroke={on[i] ? "#8EF7A0" : "#3A5360"} strokeWidth={6} />
        <rect x={-30} y={on[i] ? -96 : 6} width={60} height={90} rx={14} fill={on[i] ? "#8EF7A0" : "#9AA6B2"} />
        <text x={0} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={60} fill="#fff">
          {"١٢٣"[i]}
        </text>
      </g>
    ))}
    {glow > 0 && <rect x={-330} y={-200} width={660} height={400} rx={30} fill="#8EF7A0" opacity={0.15 * glow} />}
  </g>
);

/** Light bulb: lit / warm (off but hot) / cold. */
const Bulb: React.FC<{ x: number; y: number; s: number; f: number; state: "lit" | "warm" | "cold" }> = ({ x, y, s, f, state }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {state === "lit" && <circle r={150} fill="#FFE066" opacity={0.35} />}
    <path d="M-60 40 Q-100 -20 -70 -80 Q0 -150 70 -80 Q100 -20 60 40Z" fill={state === "lit" ? "#FFE066" : state === "warm" ? "#FFB36B" : "#CFE8F7"} stroke="#6B7C8C" strokeWidth={6} />
    <rect x={-40} y={40} width={80} height={50} rx={8} fill="#9AA6B2" />
    {state === "warm" &&
      [0, 1, 2].map((i) => <path key={i} d={`M${-50 + i * 50} -170 q12 -20 0 -40 q-12 -20 0 -40`} stroke="#FF8C2B" strokeWidth={6} fill="none" opacity={0.4 + 0.4 * Math.sin(f / 5 + i)} />)}
    {state === "cold" && <text x={0} y={-170} textAnchor="middle" fontSize={70}>❄️</text>}
  </g>
);

export const Room404D: React.FC = () => {
  const s2 = line("D02-J").from;
  const s3 = line("D03-X").from;
  const s4 = line("D04-F").from;
  const s5 = line("D05-J").from;
  const s6 = line("D06-X").from;
  const e6 = endOf("D06-X");
  const f7 = at("D07-F");
  const s8 = line("D08-J").from;
  const j8 = at("D08-J");
  const e8 = endOf("D08-J");
  const s9 = line("D09-J").from;
  const s10 = line("D10-F").from;
  const f10 = at("D10-F");
  const s11 = line("D11-Z").from;
  const z11 = at("D11-Z");
  const e11 = endOf("D11-Z");
  const tagFrom = e11 + 20;
  const endFrom = tagFrom + 110;
  const sw1on = j8 + (e8 - j8) * 0.35;
  const sw1off = j8 + (e8 - j8) * 0.65;
  const sw2on = j8 + (e8 - j8) * 0.85;
  const powerOn = f10 + 30;
  return (
    <AbsoluteFill style={{ background: "#05080D" }}>
      {/* HOOK: blackout, Zero shuts down mid-sentence, a recorded voice from the future */}
      <Shot from={0} to={s2}>
        {(f, l) => {
          const boot = 1 - ease(l, 6, 22);
          const wave = ease(l, 14, 26);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={560} fy={1050} z={1.55}>
                  <Lab f={f} dim={0.9} alarm={0.5} />
                  <Zero x={760} y={1460} s={0.62} f={f} mood={boot > 0.2 ? "glitch" : "sleep"} boot={Math.max(0.01, boot)} />
                  <Holo x={500} y={900} w={500} h={260} f={f} k={wave}>
                    <Wave x={0} y={10} w={440} f={f} amp={talkOf("X", f)} />
                    <text x={0} y={-90} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#FFD23F">
                      رسالة مسجّلة · ٢٠٦٠
                    </text>
                  </Holo>
                </Cam>
              </Svg>
              {l < 4 && <Flash l={l} color="#FF4D6D" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* Joanna tries to wake Zero */}
      <Shot from={s2} to={s3}>
        {(f) => (
          <Svg>
            <Cam fx={620} fy={1200} z={2.0}>
              <Lab f={f} dim={0.85} alarm={0.4} />
              <Zero x={760} y={1460} s={0.62} f={f} mood="sleep" boot={0.01} />
              <Jo f={f} x={520} y={1720} expr="worry" look={[1, -0.3]} armR={{ target: [330, -560] }} sweat={1} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* the message: who is speaking? */}
      <Shot from={s3} to={s5}>
        {(f) => {
          const faisal = f >= s4;
          return (
            <Svg>
              <Cam fx={faisal ? 360 : 540} fy={faisal ? 1150 : 950} z={faisal ? 2.0 : 1.35}>
                <Lab f={f} dim={0.8} alarm={0.3} />
                <Holo x={540} y={880} w={600} h={520} f={f} k={1}>
                  <g style={{ filter: "brightness(0)" }} opacity={0.85}>
                    <Faisal f={f} x={0} y={250} s={0.55} expr="smile" talk={0} blink={0} />
                  </g>
                  <Wave x={0} y={-200} w={480} f={f} amp={talkOf("X", f)} />
                </Holo>
                <Faisal f={f} x={330} y={1720} expr="shock" look={[0.8, -1]} armL={faisal ? { target: [-60, -560] } : {}} armsFront={faisal} />
                <Jo f={f} x={720} y={1720} expr="shock" look={[-0.4, -1]} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* the door is locked */}
      <Shot from={s5} to={s6}>
        {(f) => (
          <Svg>
            <Cam fx={540} fy={1100} z={1.5}>
              <Lab f={f} dim={0.8} alarm={0.3} />
              <rect x={760} y={560} width={300} height={700} rx={14} fill="#1B2E38" stroke="#FF4D6D" strokeWidth={6} />
              <text x={910} y={900} textAnchor="middle" fontSize={110}>🔒</text>
              <Jo f={f} x={560} y={1720} expr="worry" look={[1, -0.4]} armR={{ target: [300, -700] }} />
              <Faisal f={f} x={330} y={1720} expr="worry" look={[1, -0.3]} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* the puzzle */}
      <Shot from={s6} to={s8}>
        {(f, l) => {
          const think = f >= e6 + 4 && f < f7 - 4;
          const grab = f >= f7;
          return (
            <AbsoluteFill>
              <Svg>
                <rect x={0} y={0} width={1080} height={1920} fill="#0A141C" />
                <Switches x={540} y={820} s={1.15} on={grab ? [Math.sin(f / 3) > 0, Math.sin(f / 3 + 1) > 0, Math.sin(f / 3 + 2) > 0] : [false, false, false]} />
                <g opacity={ease(l, 6, 20)}>
                  <rect x={720} y={1110} width={240} height={300} rx={14} fill="#1B2E38" stroke="#5CF2FF" strokeWidth={4} />
                  <Bulb x={840} y={1270} s={0.7} f={f} state="cold" />
                  <text x={840} y={1460} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#BFF8FF">
                    الغرفة الثانية
                  </text>
                </g>
                {grab && <Faisal f={f} x={330} y={2080} s={0.62} expr="laugh" look={[0.4, -1]} armR={{ target: [200, -1000 + Math.sin(f / 3) * 40] }} />}
              </Svg>
              {f < f7 && (
                <div dir="rtl" style={{ position: "absolute", top: 1500, left: 100, right: 150, padding: "16px 24px", borderRadius: 26, background: "rgba(14,42,51,0.92)", border: "3px solid #5CF2FF", fontFamily: FONT, fontWeight: 700, fontSize: 42, lineHeight: 1.5, color: "#fff", opacity: ease(f, e6 - 30, e6) }}>
                  ٣ مفاتيح · لمبة وحدة في غرفة ثانية · تدخل <span style={{ color: "#FFD23F" }}>مرة وحدة بس</span>.
                  <br />
                  كيف تعرف أي مفتاح يشغّلها؟
                </div>
              )}
              {think && <Countdown l={f - e6 - 4} total={f7 - 8 - e6} top={300} question="تقدر تحلّها قبل جوانا؟" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* Joanna's method */}
      <Shot from={s8} to={s9}>
        {(f) => {
          const on = [f >= sw1on && f < sw1off, f >= sw2on, false];
          const clock = f >= sw1on && f < sw1off;
          return (
            <AbsoluteFill>
              <Svg>
                <rect x={0} y={0} width={1080} height={1920} fill="#0A141C" />
                <Switches x={540} y={820} s={1.15} on={on} />
                <Jo f={f} x={540} y={2100} s={0.62} expr="proud" look={[0, -1]} armR={{ target: [200, -1000] }} />
                {clock && (
                  <g transform="translate(540 330)">
                    <circle r={90} fill="#0A1620" stroke="#FFD23F" strokeWidth={8} />
                    <line x1={0} y1={0} x2={Math.sin(f / 2) * 70} y2={-Math.cos(f / 2) * 70} stroke="#FFD23F" strokeWidth={8} strokeLinecap="round" />
                    <text x={0} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill="#FFD23F">
                      دقيقتين…
                    </text>
                  </g>
                )}
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* the logic, visualised */}
      <Shot from={s9} to={s10}>
        {(f, l) => (
          <AbsoluteFill style={{ background: "#0A141C" }}>
            <Svg>
              {(["lit", "warm", "cold"] as const).map((st, i) => (
                <g key={st} opacity={ease(l, 10 + i * 40, 24 + i * 40)}>
                  <Bulb x={840 - i * 300} y={820} s={0.9} f={f} state={st} />
                  <text x={840 - i * 300} y={1060} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill="#fff">
                    {["شغّالة", "طافية + حارة", "باردة"][i]}
                  </text>
                  <text x={840 - i * 300} y={1160} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={90} fill="#8EF7A0">
                    {["٢", "١", "٣"][i]}
                  </text>
                </g>
              ))}
            </Svg>
          </AbsoluteFill>
        )}
      </Shot>
      {/* the second room: warm bulb, power returns */}
      <Shot from={s10} to={s11}>
        {(f) => {
          const power = ease(f, powerOn, powerOn + 20);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={1100} z={1.6}>
                  <Lab f={f} dim={0.85 - power * 0.85} />
                  <Bulb x={540} y={760} s={1} f={f} state={power > 0.5 ? "lit" : "warm"} />
                  <Faisal f={f} x={450} y={1720} expr={f >= f10 ? "laugh" : "smile"} look={[0.4, -1]} armR={{ target: [140, -900] }} />
                  <Jo f={f} x={700} y={1720} expr="happy" look={[-0.4, -1]} />
                </Cam>
              </Svg>
              {f >= powerOn && f < powerOn + 8 && <Flash l={f - powerOn} color="#FFF3C4" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* Zero reboots… with red eyes */}
      <Shot from={s11} to={tagFrom}>
        {(f, l) => {
          const boot = ease(l, 10, 40);
          const close = f >= z11 - 10;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={close ? 760 : 620} fy={close ? 1220 : 1200} z={close ? 2.6 : 1.6}>
                  <Lab f={f} />
                  <Zero x={760} y={1460} s={0.62} f={f} mood={boot > 0.3 ? "glitch" : "sleep"} boot={Math.max(0.01, boot)} talk={talkOf("Z", f)} look={-0.4} />
                  <Faisal f={f} x={330} y={1720} expr="shock" look={[1, -0.5]} />
                  <Jo f={f} x={520} y={1720} expr="shock" look={[1, -0.4]} />
                </Cam>
              </Svg>
              <AbsoluteFill style={{ background: "radial-gradient(55% 40% at 50% 45%, transparent 35%, rgba(40,0,10,0.5) 100%)" }} />
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={tagFrom} to={endFrom}>
        {(f, l) => (
          <AbsoluteFill style={{ background: "#071A22" }}>
            <Svg>
              <Zero x={540} y={1200} s={0.9} f={f} mood="glitch" />
            </Svg>
            <TaglineCard l={l} />
          </AbsoluteFill>
        )}
      </Shot>
      <Shot from={endFrom} to={2100}>
        {(_f, l) => <EndCard l={l} next="الحلقة ٥: ذاكرة زيرو" question="زيرو نسيهم؟! 😨" />}
      </Shot>
      <Tag text="سرّ الغرفة 404 · الحلقة ٤" />

      <Sfx name="powerdown" at={4} />
      <Sfx name="alarm" at={10} gain={0.6} />
      <Sfx name="holo" at={14} />
      <Sfx name="robot" at={s2 + 6} gain={0.6} />
      <Sfx name="beep" at={s5 + 10} />
      <Sfx name="whoosh" at={s6} />
      <Sfx name="tick" at={e6 + 4} />
      <Sfx name="beep" at={sw1on} />
      <Sfx name="beep" at={sw1off} />
      <Sfx name="beep" at={sw2on} />
      <Sfx name="correct" at={endOf("D09-J") - 10} />
      <Sfx name="powerup" at={powerOn} />
      <Sfx name="boot" at={s11 + 10} />
      <Sfx name="glitch" at={z11 - 6} />
      <Sfx name="sting" at={e11} />
      <Sfx name="tagline" at={tagFrom} />
      {T.audio.vo && T.scenes.map((s) => <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/r404d/vo/${s.id}.mp3`)} from={s.from + s.voFrom} volume={s.id.endsWith("-Z") ? 1.25 : 1} />)}
      {T.audio.vo && <Audio name="VO tagline" src={staticFile("audio/r404d/vo/TAG.mp3")} from={tagFrom + 10} />}
      {T.audio.music && <Audio src={staticFile("audio/r404d/music/theme.mp3")} loop volume={(f) => musicLevel(T, f)} />}
    </AbsoluteFill>
  );
};
