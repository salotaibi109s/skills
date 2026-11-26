import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import data from "../data/homed-timeline.json";
import mouthData from "../data/homed-mouth.json";
import type { TimelineData } from "../lib/timing";
import { musicLevel } from "../room404/kit";
import { Cam, ease, Flash, FONT, HomeEnd, Legs, makeHome, Mall, Shot, Svg, Tag } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, Sfx, Jo, Faisal, Baba, Mama, Clerk } = makeHome(T, mouthData as Record<string, number[]>, "homed");
const S = (id: string) => line(id).from;

const Tears: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) => (
  <g transform={`translate(${x} ${y - 770 * s}) scale(${s})`}>
    {[-1, 1].map((d) => (
      <path key={d} d="M0 -14 q-12 18 0 26 q12 -8 0 -26Z" fill="#7FD3FF" transform={`translate(${d * 75} ${40 + ((f * 4) % 90)}) scale(1.6)`} />
    ))}
  </g>
);

const Chip: React.FC<{ n: string; t: string; k: number; color: string }> = ({ n, t, k, color }) => (
  <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 30px", borderRadius: 40, background: "#fff", boxShadow: "0 10px 0 rgba(0,0,0,0.15)", opacity: k, transform: `scale(${0.7 + 0.3 * k})`, fontFamily: FONT, fontWeight: 800, fontSize: 52, color: "#2B2B2B" }}>
    <span style={{ width: 70, height: 70, borderRadius: 35, background: color, color: "#fff", display: "grid", placeItems: "center" }}>{n}</span>
    {t}
  </div>
);

export const HomeD: React.FC = () => {
  const s2 = S("K02-F");
  const s3 = S("K03-M");
  const s4 = S("K04-J");
  const s5 = S("K05-J");
  const s6 = S("K06-F");
  const s7 = S("K07-F");
  const s8 = S("K08-E");
  const s9 = S("K09-F");
  const s10 = S("K10-A");
  const s11 = S("K11-D");
  const s12 = S("K12-F");
  const f12 = at("K12-F");
  const e12 = endOf("K12-F");
  const s13 = S("K13-F");
  const endFrom = endOf("K13-F") + 36;
  const crowd = (f: number, y: number, s: number, n: number, off: number) =>
    Array.from({ length: n }).map((_, i) => {
      const dir = i % 2 ? 1 : -1;
      const x = ((((f * 7 * dir + i * 260 + off) % 1500) + 1500) % 1500) - 210;
      return <Legs key={i} x={x} y={y} s={s} f={f} kind={i + off} />;
    });
  return (
    <AbsoluteFill style={{ background: "#EAF1F7" }}>
      {/* HOOK: alone among the crowd */}
      <Shot from={0} to={s2}>
        {(f, l) => (
          <Svg>
            <g transform={`rotate(${Math.sin(l / 12) * 2.5} 540 960)`}>
              <Cam fx={540} fy={1320} z={1.35 + ease(l, 0, 60) * 0.15}>
                <Mall f={f} desk={false} />
                {crowd(f, 1520, 0.78, 6, 100)}
                <Faisal f={f} x={540} y={1720} expr="worry" look={[Math.sin(l / 10), -0.5]} sweat={1} armsFront />
                <Tears x={540} y={1720} s={0.42} f={f} />
                {crowd(f, 2000, 1.0, 5, 900)}
              </Cam>
            </g>
          </Svg>
        )}
      </Shot>
      {/* flashback: the red car in the toy-shop window */}
      <Shot from={s2} to={s3}>
        {(f, l) => (
          <AbsoluteFill>
            <AbsoluteFill style={{ filter: "sepia(0.65) saturate(0.9)" }}>
              <Svg>
                <Cam fx={200} fy={1150} z={1.35}>
                  <Mall f={f} desk={false} />
                  <Faisal f={f} x={-40} y={1560} s={0.46} expr="happy" look={[-0.3, -1]} />
                  <Mama f={f} x={330 + l * 4} y={1600} walk={f / 3} expr="smile" look={[1, 0]} />
                  <Jo f={f} x={500 + l * 4} y={1600} walk={f / 3} expr="smile" look={[1, 0]} />
                </Cam>
              </Svg>
            </AbsoluteFill>
            <div dir="rtl" style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center" }}>
              <span style={{ padding: "10px 30px", borderRadius: 30, background: "rgba(0,0,0,0.55)", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 46 }}>قبل دقيقة… ⏪</span>
            </div>
            {l < 6 && <Flash l={l} />}
          </AbsoluteFill>
        )}
      </Shot>
      {/* Mama and Joanna searching */}
      <Shot from={s3} to={s5}>
        {(f) => (
          <Svg>
            <Cam fx={720} fy={1260} z={1.4}>
              <Mall f={f} desk={false} />
              {crowd(f, 1520, 0.72, 2, 300)}
              <Mama f={f} x={860} y={1760} expr={f >= s4 ? "worry" : "shock"} look={[-1, -0.1]} armL={f < s4 ? { a: 150, b: 170 } : {}} armR={f < s4 ? { a: 150, b: 170 } : {}} />
              <Jo f={f} x={560} y={1760} expr={f >= s4 ? "smile" : "worry"} look={[1, -0.5]} armR={f >= s4 ? { target: [280, -500] } : {}} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* Faisal remembers Joanna's rule */}
      <Shot from={s5} to={s6}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={540} fy={1320} z={1.9}>
                <Mall f={f} desk={false} />
                <Faisal f={f} x={540} y={1720} expr="worry" look={[0, -1]} armR={{ target: [60, -760] }} />
              </Cam>
              <g opacity={ease(l, 0, 14)}>
                <ellipse cx={540} cy={500} rx={420} ry={300} fill="#fff" opacity={0.92} />
                {[0, 1, 2].map((i) => <circle key={i} cx={560 - i * 30} cy={830 + i * 50} r={30 - i * 8} fill="#fff" opacity={0.92} />)}
                <defs>
                  <clipPath id="dBubble">
                    <ellipse cx={540} cy={500} rx={420} ry={300} />
                  </clipPath>
                </defs>
                <g clipPath="url(#dBubble)" opacity={0.95}>
                  <Jo f={f} x={540} y={1060} s={0.62} expr="smile" look={[0, 0]} armR={{ a: 140, b: 160 }} />
                </g>
                <ellipse cx={540} cy={500} rx={420} ry={300} fill="none" stroke="#FFB7D0" strokeWidth={10} />
              </g>
            </Svg>
            <div style={{ position: "absolute", bottom: 300, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <Chip n="✋" t="لا تمشي" k={ease(l, 30, 44)} color="#E8414B" />
              <Chip n="🚫" t="لا تروح مع غريب" k={ease(l, 70, 84)} color="#2B3A67" />
            </div>
          </AbsoluteFill>
        )}
      </Shot>
      {/* he looks around and spots the info desk */}
      <Shot from={s6} to={s7}>
        {(f, l) => (
          <Svg>
            <Cam fx={540 + ease(l, 20, s7 - s6) * 800} fy={1250} z={1.25}>
              <Mall f={f} />
              <Clerk f={f} x={1300} y={1720} expr="smile" look={[-1, 0.3]} />
              <Faisal f={f} x={600} y={1720} expr={l > 40 ? "happy" : "worry"} look={[1, -0.2]} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* at the desk */}
      <Shot from={s7} to={s10}>
        {(f, l) => {
          const walking = f < at("K07-F") - 10;
          const fx = walking ? 920 + ease(l, 0, at("K07-F") - 10 - s7) * 160 : 1080;
          return (
            <Svg>
              <Cam fx={1180} fy={1300} z={1.55}>
                <Mall f={f} />
                <Clerk f={f} x={1340} y={1740} expr={f >= s8 ? "happy" : "smile"} look={[-1, 0.7]} tilt={f >= s8 ? -8 : 0} />
                <Faisal f={f} x={fx} y={1740} walk={walking ? f / 3 : undefined} expr={f >= s9 ? "proud" : "worry"} look={[1, -0.7]} armR={f >= s9 ? { a: 140, b: 170 } : {}} />
                {f >= s9 && [0, 1, 2].map((i) => <text key={i} x={980 + i * 70} y={1240 - ((f * 2 + i * 30) % 120)} fontSize={60} textAnchor="middle">🎵</text>)}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* the announcement */}
      <Shot from={s10} to={s11}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={400} fy={1100} z={0.95}>
                <Mall f={f} />
                {crowd(f, 1600, 0.6, 3, 500)}
              </Cam>
            </Svg>
            <div dir="rtl" style={{ position: "absolute", top: 520, left: 70, right: 70, padding: 40, borderRadius: 40, background: "#2B3A67", color: "#fff", fontFamily: FONT, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", transform: `scale(${0.8 + 0.2 * ease(l, 0, 10)})`, opacity: ease(l, 0, 10) }}>
              <div style={{ fontSize: 120 }}>📢</div>
              <div style={{ fontWeight: 800, fontSize: 54, lineHeight: 1.4 }}>نرجو من أهل الطفل «فيصل»<br />التوجه لمكتب الاستقبال</div>
            </div>
          </AbsoluteFill>
        )}
      </Shot>
      {/* reunion + the three rules */}
      <Shot from={s11} to={s13}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={1000} fy={1260} z={1.3}>
                <Mall f={f} />
                <Clerk f={f} x={1420} y={1740} expr="happy" look={[-1, 0.3]} />
                <Baba f={f} x={1180} y={1780} expr="happy" look={[-1, 0.4]} armL={{ target: [-300, -760] }} />
                <Mama f={f} x={780} y={1780} expr="happy" look={[1, 0.5]} armR={{ target: [300, -620] }} />
                <Faisal f={f} x={990} y={1780} expr={f >= s12 ? "proud" : "laugh"} look={[0, -1]} armR={f >= s12 ? { a: 150, b: 175 } : {}} />
                <Jo f={f} x={560} y={1780} expr="happy" look={[1, -0.3]} />
                {f < s12 && l > 10 && [0, 1, 2].map((i) => <path key={i} d="M0 30 C-45 0 -25 -45 0 -20 C25 -45 45 0 0 30Z" fill="#FF6FA8" transform={`translate(${900 + i * 90} ${1140 - ((f * 2 + i * 40) % 140)})`} opacity={0.8} />)}
              </Cam>
            </Svg>
            {f >= s12 && (
              <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                <Chip n="١" t="اوقف مكانك" k={ease(f, f12, f12 + 10)} color="#E8414B" />
                <Chip n="٢" t="دوّر موظف" k={ease(f, f12 + (e12 - f12) * 0.33, f12 + (e12 - f12) * 0.33 + 10)} color="#2B3A67" />
                <Chip n="٣" t="أعطه رقم أهلك" k={ease(f, f12 + (e12 - f12) * 0.66, f12 + (e12 - f12) * 0.66 + 10)} color="#2E7D7A" />
              </div>
            )}
          </AbsoluteFill>
        )}
      </Shot>
      {/* the joke */}
      <Shot from={s13} to={endFrom}>
        {(f) => (
          <Svg>
            <Cam fx={900} fy={1250} z={1.75}>
              <Mall f={f} />
              <Baba f={f} x={1180} y={1780} expr={f >= endOf("K13-F") - 10 ? "laugh" : "shock"} look={[-1, 0.4]} />
              <Mama f={f} x={720} y={1780} expr={f >= endOf("K13-F") - 10 ? "laugh" : "shock"} look={[1, 0.5]} />
              <Faisal f={f} x={950} y={1780} expr="sly" look={[0, 0]} armR={{ target: [130, -900] }} />
            </Cam>
          </Svg>
        )}
      </Shot>
      <Shot from={endFrom} to={T.durationInFrames}>
        {(_f, l) => <HomeEnd l={l} value="إذا ضعت: اوقف · دوّر موظف · رقم أهلك 🤍" next="قريباً!" />}
      </Shot>
      <Tag text="حكايات بيتنا · الحلقة ٤" />

      <Sfx name="crowd" at={0} />
      <Sfx name="heartbeat" at={30} />
      <Sfx name="whoosh" at={s2} />
      <Sfx name="gasp" at={s3} gain={0.6} />
      <Sfx name="sparkle" at={s5 + 4} />
      <Sfx name="pop" at={s5 + 30} />
      <Sfx name="pop" at={s5 + 70} />
      <Sfx name="magnify" at={s6 + 20} />
      <Sfx name="steps" at={s7} />
      <Sfx name="chime" at={s10} />
      <Sfx name="steps" at={s11 - 20} />
      <Sfx name="aww" at={s11 + 20} gain={0.6} />
      <Sfx name="pop" at={f12} />
      <Sfx name="pop" at={f12 + (e12 - f12) * 0.33} />
      <Sfx name="pop" at={f12 + (e12 - f12) * 0.66} />
      <Sfx name="boing" at={s13 + 20} />
      <Sfx name="laugh" at={endOf("K13-F")} gain={0.6} />
      <Sfx name="jingle" at={endFrom} />
      {T.audio.vo && T.scenes.map((s) => <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/homed/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />)}
      {T.audio.music && <Audio src={staticFile("audio/homed/music/theme.mp3")} loop volume={(f) => musicLevel(T, f)} />}
    </AbsoluteFill>
  );
};
