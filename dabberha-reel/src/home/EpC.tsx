import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import data from "../data/homec-timeline.json";
import mouthData from "../data/homec-mouth.json";
import type { TimelineData } from "../lib/timing";
import { musicLevel } from "../room404/kit";
import { Cam, ease, Flash, FONT, HomeEnd, makeHome, Shot, Stairwell, Svg, Tag } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, Sfx, Jo, Faisal, Neighbor } = makeHome(T, mouthData as Record<string, number[]>, "homec");

const Note: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-60} width={240} height={120} rx={10} fill="#C9506A" stroke="#8E2E44" strokeWidth={6} />
    <rect x={-100} y={-42} width={200} height={84} rx={6} fill="none" stroke="#F6D3DF" strokeWidth={3} />
    <text x={0} y={20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={58} fill="#fff">
      ١٠٠
    </text>
  </g>
);

const Receipt: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-110 -150 h220 v280 l-20 20 l-20 -20 l-20 20 l-20 -20 l-20 20 l-20 -20 l-20 20 l-20 -20 l-20 20 l-20 -20 l-20 20 Z" fill="#fff" stroke="#BDBDBD" strokeWidth={4} />
    <text x={0} y={-100} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#2E7D7A">
      صيدلية النور
    </text>
    {[0, 1, 2].map((i) => (
      <line key={i} x1={-80} x2={80} y1={-50 + i * 34} y2={-50 + i * 34} stroke="#CCC" strokeWidth={6} />
    ))}
    <rect x={-90} y={60} width={180} height={50} rx={8} fill="#FFF3C4" stroke="#E8B21A" strokeWidth={4} />
    <text x={0} y={96} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#C0574B">
      شقة ٤
    </text>
  </g>
);

export const HomeC: React.FC = () => {
  const s2 = line("I02-F").from;
  const s3 = line("I03-J").from;
  const s5 = line("I05-J").from;
  const s6 = line("I06-J").from;
  const j6 = at("I06-J");
  const s7 = line("I07-N").from;
  const n7 = at("I07-N");
  const s8 = line("I08-F").from;
  const s9 = line("I09-N").from;
  const s10 = line("I10-F").from;
  const s11 = line("I11-J").from;
  const e11 = endOf("I11-J");
  const endFrom = e11 + 24;
  const knock = n7 - 70;
  return (
    <AbsoluteFill style={{ background: "#E6E0D4" }}>
      {/* HOOK: a 100-riyal note on the stairs */}
      <Shot from={0} to={s3}>
        {(f, l) => {
          const dream = f >= s2;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={dream ? 420 : 360} fy={dream ? 1150 : 1350} z={dream ? 1.6 : 2.2 - ease(l, 0, 40) * 0.4}>
                  <Stairwell f={f} />
                  <Faisal f={f} x={360} y={1720} expr={dream ? "laugh" : "shock"} look={[0, -0.4]} armR={{ target: [140, -700] }} armL={{ target: [-140, -700] }} tilt={dream ? Math.sin(f / 4) * 5 : 0} />
                  <Note x={360} y={1720 - 0.42 * 780} s={0.45} rot={Math.sin(f / 6) * 6} />
                  <Jo f={f} x={640} y={1720} expr={dream ? "worry" : "shock"} look={[-1, -0.4]} />
                  {dream &&
                    [
                      { e: "🚗", x: 160, t: 0 },
                      { e: "✈️", x: 400, t: 40 },
                      { e: "🎮", x: 620, t: 80 },
                    ].map((d) => (
                      <text key={d.e} x={d.x} y={700 - ease(f, s2 + d.t, s2 + d.t + 20) * 60} fontSize={110} opacity={ease(f, s2 + d.t, s2 + d.t + 20)} textAnchor="middle">
                        {d.e}
                      </text>
                    ))}
                </Cam>
              </Svg>
              {l < 5 && <Flash l={l} color="#FFF3C4" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* "it's not ours" — what if you lost it? */}
      <Shot from={s3} to={s6}>
        {(f) => (
          <Svg>
            <Cam fx={f >= s5 ? 600 : 460} fy={1170} z={1.8}>
              <Stairwell f={f} />
              <Faisal f={f} x={360} y={1720} expr={f >= s5 ? "worry" : "proud"} look={[1, -0.4]} armR={{ target: [140, -600] }} />
              <Note x={360 + 0.42 * 140} y={1720 - 0.42 * 640} s={0.35} />
              <Jo f={f} x={640} y={1720} expr={f >= s5 ? "smile" : "worry"} look={[-1, -0.3]} armL={f >= s5 ? { target: [-240, -620] } : {}} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* the clue: a pharmacy receipt for flat 4 */}
      <Shot from={s6} to={knock}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <rect x={0} y={0} width={1080} height={1920} fill="#B9B1A2" />
              <g transform={`translate(540 ${900 - ease(l, 0, 20) * 40})`}>
                <Receipt x={0} y={0} s={2.2} />
              </g>
              <Jo f={f} x={700} y={2080} s={0.62} expr={f >= j6 ? "happy" : "sly"} look={[-0.4, -1]} armL={{ target: [-260, -900] }} />
            </Svg>
            {l < 6 && <Flash l={l} />}
          </AbsoluteFill>
        )}
      </Shot>
      {/* knocking on door 4; Umm Saeed */}
      <Shot from={knock} to={s10}>
        {(f) => {
          const open = ease(f, knock + 40, knock + 60);
          const given = f >= s8 + 20;
          return (
            <Svg>
              <Cam fx={820} fy={1150} z={1.45}>
                <Stairwell f={f} />
                {open > 0 && <rect x={810} y={560} width={300 * open} height={700} fill="#5E3A1E" />}
                {open > 0.3 && <Neighbor f={f} x={980} y={1500} expr={f >= s9 ? "happy" : f >= s7 ? "worry" : "smile"} look={[-0.8, 0.5]} tilt={-4} armL={given ? { target: [-300, -720] } : { a: 20, b: 40 }} />}
                <Faisal f={f} x={640} y={1720} expr={f >= s9 ? "happy" : "smile"} look={[1, -0.6]} armR={!given && f >= s8 ? { target: [300, -560] } : f < knock + 40 ? { target: [400, -860 + Math.abs(Math.sin(f / 3)) * 40] } : {}} />
                {f >= s8 && !given && <Note x={640 + 0.42 * 300} y={1720 - 0.42 * 560} s={0.3} />}
                {given && <Note x={980 - 0.64 * 300} y={1500 - 0.64 * 720} s={0.3} />}
                <Jo f={f} x={460} y={1720} expr="smile" look={[1, -0.5]} />
                {f >= s9 + 40 && [0, 1, 2].map((i) => <text key={i} x={560 + i * 90} y={1180 - ((f * 2 + i * 30) % 120)} fontSize={60} textAnchor="middle">🍬</text>)}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* the feeling + the joke */}
      <Shot from={s10} to={endFrom}>
        {(f) => (
          <Svg>
            <Cam fx={f >= s11 ? 500 : 400} fy={1150} z={f >= s11 ? 1.6 : 2.0}>
              <Stairwell f={f} />
              <Faisal f={f} x={380} y={1720} expr={f >= s11 ? "shock" : "happy"} look={f >= s11 ? [1, -0.3] : [0, 0]} armR={{ target: [80, -620] }} armsFront={f < s11} />
              <Jo f={f} x={620} y={1720} expr={f >= s11 ? "laugh" : "happy"} look={[-1, -0.3]} />
              {f < s11 && [0, 1, 2].map((i) => <path key={i} d="M0 30 C-45 0 -25 -45 0 -20 C25 -45 45 0 0 30Z" fill="#FF6FA8" transform={`translate(${300 + i * 90} ${1100 - ((f * 2 + i * 40) % 140)}) scale(1.1)`} opacity={0.8} />)}
            </Cam>
          </Svg>
        )}
      </Shot>
      <Shot from={endFrom} to={1800}>
        {(_f, l) => <HomeEnd l={l} value="الأمانة… تكبّر القلب 🤍" next="قريباً!" />}
      </Shot>
      <Tag text="حكايات بيتنا · الحلقة ٣" />

      <Sfx name="coin" at={4} />
      <Sfx name="sparkle" at={s2 + 10} />
      <Sfx name="scratch" at={s3} gain={0.6} />
      <Sfx name="pop" at={s6 + 4} />
      <Sfx name="tada" at={j6 + 20} gain={0.6} />
      <Sfx name="steps" at={knock - 20} />
      <Sfx name="knock" at={knock} />
      <Sfx name="door" at={knock + 40} />
      <Sfx name="aww" at={s9 + 20} gain={0.6} />
      <Sfx name="laugh" at={endOf("I11-J")} gain={0.6} />
      <Sfx name="jingle" at={endFrom} />
      {T.audio.vo && T.scenes.map((s) => <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/homec/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />)}
      {T.audio.music && <Audio src={staticFile("audio/homec/music/theme.mp3")} loop volume={(f) => musicLevel(T, f)} />}
    </AbsoluteFill>
  );
};
