import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import data from "../data/homeb-timeline.json";
import mouthData from "../data/homeb-mouth.json";
import type { TimelineData } from "../lib/timing";
import { musicLevel } from "../room404/kit";
import { Cake, Cam, ClockHands, ease, Flash, FONT, HomeEnd, Kitchen, LivingRoom, makeHome, Shot, Sofa, SofaBack, Svg, Tag } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, Sfx, Jo, Faisal, Baba, Mama } = makeHome(T, mouthData as Record<string, number[]>, "homeb");
const S = (id: string) => line(id).from;

/** Chocolate smear around a kid's mouth (kid at x,y with scale s). */
const Smear: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y - 700 * s}) scale(${s})`} fill="#5A2E14" opacity={0.85}>
    <ellipse cx={-70} cy={0} rx={34} ry={22} />
    <ellipse cx={60} cy={14} rx={26} ry={18} />
    <circle cx={-20} cy={40} r={14} />
  </g>
);
const Tears: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) => (
  <g transform={`translate(${x} ${y - 770 * s}) scale(${s})`}>
    {[-1, 1].map((d) => (
      <path key={d} d="M0 -14 q-12 18 0 26 q12 -8 0 -26Z" fill="#7FD3FF" transform={`translate(${d * 75} ${40 + ((f * 4) % 90)}) scale(1.6)`} />
    ))}
  </g>
);
const Magnifier: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="rgba(200,235,255,0.18)" stroke="#6B4523" strokeWidth={r * 0.14} />
    <line x1={x + r * 0.7} y1={y + r * 0.7} x2={x + r * 1.5} y2={y + r * 1.5} stroke="#6B4523" strokeWidth={r * 0.22} strokeLinecap="round" />
  </g>
);
const Timer: React.FC<{ f: number }> = ({ f }) => {
  const left = Math.max(0, 600 - Math.floor(f / 30) * 6);
  const ar = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
  return (
    <div dir="rtl" style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center" }}>
      <span style={{ display: "inline-block", padding: "10px 30px", borderRadius: 40, background: "#C0392B", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 50 }}>
        ⏰ الضيوف بعد {ar(Math.floor(left / 60))}:{ar(left % 60).padStart(2, "٠")}
      </span>
    </div>
  );
};

export const HomeB: React.FC = () => {
  const s2 = S("H02-F");
  const s4 = S("H04-F");
  const s5 = S("H05-J");
  const s6 = S("H06-J");
  const s7 = S("H07-J");
  const s8 = S("H08-F");
  const d9 = at("H09-D");
  const s10 = S("H10-D");
  const s11 = S("H11-M");
  const s12 = S("H12-J");
  const s13 = S("H13-F");
  const bell = at("H12-J") - 36;
  const endFrom = endOf("H13-F") + 36;
  return (
    <AbsoluteFill style={{ background: "#F4EBDD" }}>
      {/* HOOK: the guests' cake is gone */}
      <Shot from={0} to={s2}>
        {(f, l) => (
          <Svg>
            <Cam fx={380 + ease(l, 0, 50) * 120} fy={880 + ease(l, 0, 50) * 260} z={2.6 - ease(l, 0, 50) * 1.3}>
              <Kitchen f={f} />
              <ClockHands f={f} />
              <Cake x={260} y={842} s={0.9} eaten={1} />
              <Mama f={f} x={680} y={1740} expr="shock" look={[-1, 0.2]} armL={{ a: 150, b: 170 }} armR={{ a: 150, b: 170 }} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* everyone looks at Faisal's chocolate face */}
      <Shot from={s2} to={s5}>
        {(f, l) => {
          const cry = f >= s4;
          return (
            <Svg>
              <Cam fx={l < 20 ? 430 : 500} fy={1300} z={l < 20 ? 2.2 : 1.45}>
                <Kitchen f={f} />
                <ClockHands f={f} />
                <Cake x={260} y={842} s={0.9} eaten={1} />
                <Mama f={f} x={820} y={1760} expr={cry ? "worry" : "sly"} look={[-1, 0.4]} armL={cry ? {} : { target: [-380, -800] }} />
                <Faisal f={f} x={460} y={1760} expr={cry ? "worry" : "shock"} look={[0.3, -0.3]} sweat={cry ? 0 : 1} />
                <Smear x={460} y={1760} s={0.42} />
                {cry && <Tears x={460} y={1760} s={0.42} f={f} />}
                <Jo f={f} x={200} y={1760} expr="worry" look={[1, -0.2]} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* detective Joanna */}
      <Shot from={s5} to={s6}>
        {(f) => (
          <Svg>
            <Cam fx={360} fy={1300} z={1.7}>
              <Kitchen f={f} />
              <Faisal f={f} x={560} y={1760} expr="worry" look={[-1, -0.3]} />
              <Smear x={560} y={1760} s={0.42} />
              <Jo f={f} x={300} y={1760} expr="sly" look={[1, -0.2]} armR={{ target: [280, -720] }} />
              <Magnifier x={300 + 0.55 * 300} y={1760 - 0.55 * 760} r={52} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* clue 1: the crumb trail */}
      <Shot from={s6} to={s7}>
        {(f, l) => (
          <Svg>
            <Cam fx={200 + ease(l, 0, s7 - s6) * 600} fy={1450} z={1.6}>
              <LivingRoom f={f} />
              {Array.from({ length: 16 }).map((_, i) => (
                <circle key={i} cx={-120 + i * 75} cy={1430 + Math.sin(i * 1.7) * 22} r={9 + (i % 3) * 3} fill="#6B3A1E" />
              ))}
              <Magnifier x={200 + ease(l, 0, s7 - s6) * 600} y={1430} r={110} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* clue 2: a BIG footprint in the icing sugar */}
      <Shot from={s7} to={s8}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <rect x={0} y={0} width={1080} height={1920} fill="#C99A6B" />
              <g transform={`translate(540 1000) scale(${1.2 + ease(l, 0, 40) * 0.2}) rotate(-12)`}>
                <ellipse cx={0} cy={0} rx={300} ry={440} fill="#FBF7F0" opacity={0.85} />
                <path d="M-70 -260 q70 -60 140 0 q40 120 0 230 q-30 100 10 210 q-30 80 -90 60 q-60 -20 -60 -120 q20 -120 -40 -200 q-20 -110 40 -180Z" fill="#D7C2A3" />
                {[-90, -45, 0, 45, 85].map((d, i) => (
                  <circle key={d} cx={d} cy={-330 + Math.abs(d) * 0.6} r={22 - i * 1.5} fill="#D7C2A3" />
                ))}
              </g>
              <g transform="translate(170 1640) scale(2.2)">
                <path d="M-40 0 q-6 -60 20 -80 q30 10 30 80Z" fill="#D7C2A3" stroke="#6B4523" strokeWidth={4} />
                <text x={0} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#3A2414">
                  فيصل
                </text>
              </g>
              <Magnifier x={540} y={1000} r={260} />
            </Svg>
            {l < 6 && <Flash l={l} />}
          </AbsoluteFill>
        )}
      </Shot>
      {/* the culprit: Dad asleep with the plate */}
      <Shot from={s8} to={s10}>
        {(f) => {
          const awake = f >= d9 - 6;
          return (
            <Svg>
              <Cam fx={awake ? 400 : 520} fy={1240} z={awake ? 1.3 : 1.45}>
                <LivingRoom f={f} />
                <SofaBack x={540} y={1460} s={0.9} />
                <Baba f={f} x={540} y={1660} expr={awake ? "sly" : "shock"} blink={awake ? undefined : 1} talk={awake ? undefined : 0} tilt={awake ? 0 : -8} look={awake ? [-1, 0] : [0, 0]} />
                <ellipse cx={awake ? 540 : 525} cy={975} rx={48} ry={20} fill="#FFF8EE" />
                <Sofa x={540} y={1460} s={0.9} />
                <Cake x={620} y={1250} s={0.55} eaten={1} />
                {!awake && [0, 1, 2].map((i) => <text key={i} x={700 + i * 40} y={560 - ((f * 2 + i * 40) % 140)} fontFamily={FONT} fontWeight={800} fontSize={50 - i * 8} fill="#2E7D7A">z</text>)}
                <Jo f={f} x={130} y={1760} expr={awake ? "laugh" : "shock"} look={[1, -0.4]} />
                <Faisal f={f} x={-40} y={1760} expr={awake ? "proud" : "shock"} look={[1, -0.4]} />
                <Smear x={-40} y={1760} s={0.42} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* apology and hug */}
      <Shot from={s10} to={s12}>
        {(f) => {
          const hug = f >= s11;
          return (
            <Svg>
              <Cam fx={540} fy={1250} z={1.35}>
                <LivingRoom f={f} />
                <Baba f={f} x={830} y={1780} expr="smile" look={[-1, 0.5]} armL={{ target: [-330, -700] }} />
                <Mama f={f} x={300} y={1780} expr={hug ? "happy" : "worry"} look={[1, 0.5]} armR={hug ? { target: [300, -560] } : {}} />
                <Faisal f={f} x={560} y={1780} expr={hug ? "laugh" : "happy"} look={[0, -1]} />
                <Smear x={560} y={1780} s={0.42} />
                {hug && [0, 1, 2].map((i) => <path key={i} d="M0 30 C-45 0 -25 -45 0 -20 C25 -45 45 0 0 30Z" fill="#FF6FA8" transform={`translate(${470 + i * 90} ${1180 - ((f * 2 + i * 40) % 140)})`} opacity={0.8} />)}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* the doorbell — and Faisal's solution */}
      <Shot from={s12} to={endFrom}>
        {(f, l) => {
          const candy = f >= s13;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={candy ? 520 : 600} fy={1250} z={candy ? 1.6 : 1.25}>
                  <LivingRoom f={f} />
                  <rect x={1000} y={560} width={300} height={700} rx={10} fill="#8B5E34" stroke="#6B4523" strokeWidth={10} />
                  <circle cx={1030} cy={930} r={14} fill="#F3C969" />
                  {f < s13 && l < 40 && <text x={1100} y={520} fontSize={80} textAnchor="middle">🔔</text>}
                  <Baba f={f} x={820} y={1780} expr={candy ? "laugh" : "shock"} look={[1, -0.2]} />
                  <Mama f={f} x={240} y={1780} expr={candy ? "laugh" : "shock"} look={candy ? [1, 0.4] : [1, -0.2]} />
                  <Faisal f={f} x={540} y={1780} expr={candy ? "proud" : "shock"} look={[0, -0.6]} armR={candy ? { target: [260, -600] } : {}} />
                  <Smear x={540} y={1780} s={0.42} />
                  {candy && (
                    <g transform={`translate(${540 + 0.42 * 260} ${1780 - 0.42 * 640}) rotate(${Math.sin(f / 5) * 8})`}>
                      <path d="M-60 0 l-30 -24 v48Z M60 0 l30 -24 v48Z" fill="#FF6FA8" />
                      <ellipse cx={0} cy={0} rx={60} ry={34} fill="#FF8C2B" />
                      <path d="M-30 -30 q30 30 0 60 M10 -32 q30 30 0 64" stroke="#FFE27A" strokeWidth={8} fill="none" />
                    </g>
                  )}
                  <Jo f={f} x={380} y={1780} expr={candy ? "laugh" : "worry"} look={[1, -0.2]} />
                </Cam>
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={endFrom} to={T.durationInFrames}>
        {(_f, l) => <HomeEnd l={l} value="لا تظلم أحد… قبل الدليل 🤍" next="صندوق جدتي المقفول" />}
      </Shot>
      <Shot from={0} to={s5}>
        {(f) => <Timer f={f} />}
      </Shot>
      <Tag text="حكايات بيتنا · الحلقة ٢" />

      <Sfx name="sting" at={2} />
      <Sfx name="tick" at={20} />
      <Sfx name="gasp" at={s2} gain={0.6} />
      <Sfx name="sob" at={s4 + 10} />
      <Sfx name="magnify" at={s5 + 6} />
      <Sfx name="steps" at={s6} />
      <Sfx name="sting" at={s7} />
      <Sfx name="snore" at={s8 - 10} />
      <Sfx name="boing" at={d9 - 6} />
      <Sfx name="laugh" at={endOf("H09-D")} gain={0.6} />
      <Sfx name="aww" at={s11} gain={0.6} />
      <Sfx name="doorbell" at={bell} />
      <Sfx name="pop" at={s13 + 4} />
      <Sfx name="laugh" at={endOf("H13-F")} gain={0.6} />
      <Sfx name="jingle" at={endFrom} />
      {T.audio.vo && T.scenes.map((s) => <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/homeb/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />)}
      {T.audio.music && <Audio src={staticFile("audio/homeb/music/theme.mp3")} loop volume={(f) => musicLevel(T, f)} />}
    </AbsoluteFill>
  );
};
