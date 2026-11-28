import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import data from "../data/homef-timeline.json";
import mouthData from "../data/homef-mouth.json";
import type { TimelineData } from "../lib/timing";
import { musicLevel } from "../room404/kit";
import { Cam, ease, Flash, FONT, HomeEnd, Kitten, LivingRoom, makeHome, Shot, Sofa, Svg, Tag } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, Sfx, Jo, Faisal, Mama } = makeHome(T, mouthData as Record<string, number[]>, "homef");
const S = (id: string) => line(id).from;

/** Vase outline split into 8 shards; each shard is a polygon in vase-local coords (0,0 = base centre). */
const SHARDS: string[] = [
  "-60,-300 0,-300 -10,-240 -70,-250",
  "0,-300 60,-300 70,-250 -10,-240",
  "-70,-250 -10,-240 -30,-160 -110,-170",
  "-10,-240 70,-250 110,-170 -30,-160",
  "-110,-170 -30,-160 -50,-80 -120,-90",
  "-30,-160 110,-170 120,-90 -50,-80",
  "-120,-90 -50,-80 -40,0 -90,0",
  "-50,-80 120,-90 90,0 -40,0",
];
const centre = (pts: string) => {
  const p = pts.split(" ").map((q) => q.split(",").map(Number));
  return [p.reduce((s, v) => s + v[0], 0) / p.length, p.reduce((s, v) => s + v[1], 0) / p.length];
};

/** k: 0 = whole, 1 = shattered (pieces spread), gold = repaired with golden seams. missing hides shard 7. */
const Vase: React.FC<{ x: number; y: number; s: number; k?: number; gold?: number; missing?: boolean; spread?: number }> = ({ x, y, s, k = 0, gold = 0, missing, spread = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {SHARDS.map((pts, i) => {
      if (missing && i === 7) return null;
      const [cx, cy] = centre(pts);
      const dx = (cx * 2.2 + (i % 2 ? 60 : -60)) * k * spread;
      const dy = (-cy - 0) * k * spread + Math.sin(i) * 20 * k;
      const rot = (i % 2 ? 1 : -1) * 40 * k;
      return (
        <g key={i} transform={`translate(${dx} ${dy}) rotate(${rot} ${cx} ${cy})`}>
          <polygon points={pts} fill="#3E7CB1" stroke={gold > 0 ? "#FFC83D" : "#2C5A82"} strokeWidth={gold > 0 ? 6 + gold * 4 : 3} strokeLinejoin="round" />
          {i < 2 && <polygon points={pts} fill="#fff" opacity={0.15} />}
          {i === 3 && <circle cx={40} cy={-200} r={16} fill="#F6D58E" opacity={0.9} />}
          {i === 5 && <circle cx={40} cy={-120} r={14} fill="#F6D58E" opacity={0.9} />}
        </g>
      );
    })}
    {gold > 0.5 && [0, 1, 2].map((i) => <circle key={i} cx={-80 + i * 80} cy={-320 - i * 20} r={8} fill="#FFE27A" opacity={gold} />)}
  </g>
);

const Ball: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#fff" stroke="#222" strokeWidth={r * 0.08} />
    <polygon points={`0,${-r * 0.35} ${r * 0.33},${-r * 0.1} ${r * 0.2},${r * 0.3} ${-r * 0.2},${r * 0.3} ${-r * 0.33},${-r * 0.1}`} fill="#222" />
  </g>
);

const Cup: React.FC<{ x: number; y: number; r: number; broken?: boolean }> = ({ x, y, r, broken }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    {broken ? (
      [-40, -10, 25, 50].map((d, i) => <polygon key={i} points={`${d},0 ${d + 24},-6 ${d + 18},14`} fill="#E8414B" />)
    ) : (
      <g>
        <path d="M-40 -70 h80 l-8 70 h-64Z" fill="#E8414B" />
        <path d="M40 -55 q30 0 30 25 q0 25 -30 22" stroke="#E8414B" strokeWidth={10} fill="none" />
      </g>
    )}
  </g>
);

export const HomeF: React.FC = () => {
  const s2 = S("Q02-F");
  const s3 = S("Q03-J");
  const s4 = S("Q04-F");
  const s5 = S("Q05-J");
  const s6 = S("Q06-F");
  const s7 = S("Q07-J");
  const s8 = S("Q08-F");
  const s9 = S("Q09-F");
  const s10 = S("Q10-M");
  const s11 = S("Q11-J");
  const crash2 = at("Q12-F") - 44;
  const endFrom = endOf("Q12-F") + 40;
  return (
    <AbsoluteFill style={{ background: "#F6E6D0" }}>
      {/* HOOK: crash! */}
      <Shot from={0} to={s2}>
        {(f, l) => {
          const k = ease(l, 4, 14);
          const shake = l < 16 ? Math.sin(l * 2.6) * 14 * (1 - l / 16) : 0;
          return (
            <AbsoluteFill>
              <Svg>
                <g transform={`translate(${shake} 0)`}>
                  <Cam fx={520} fy={1350} z={1.5}>
                    <LivingRoom f={f} />
                    <Vase x={520} y={1640 - (1 - k) * 260} s={0.75} k={k} />
                    <Faisal f={f} x={250} y={1760} expr="shock" look={[1, 0.4]} sweat={l > 20 ? 1 : 0} armL={{ target: [-40, -470] }} armR={{ target: [40, -470] }} armsFront />
                    <Ball x={250} y={1760 - 0.42 * 440} r={36} />
                  </Cam>
                </g>
              </Svg>
              {l < 6 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* blame the kitten? */}
      <Shot from={s2} to={s4}>
        {(f) => (
          <Svg>
            <Cam fx={f >= s3 ? 560 : 640} fy={1350} z={f >= s3 ? 1.35 : 1.7}>
              <LivingRoom f={f} />
              <Sofa x={820} y={1560} s={0.6} />
              <Kitten x={820} y={1380} s={0.42} f={f} look={-1} />
              {f < s3 && <text x={880} y={1160} fontFamily={FONT} fontWeight={800} fontSize={54} fill="#6B4523" textAnchor="middle">مياو؟</text>}
              <Vase x={520} y={1640} s={0.75} k={1} />
              <Faisal f={f} x={420} y={1760} expr={f >= s3 ? "shock" : "sly"} look={[1, -0.2]} armR={f < s3 ? { target: [260, -620] } : {}} />
              {f >= s3 && <Jo f={f} x={160} y={1760} expr="shock" look={[1, -0.2]} armR={{ target: [200, -640] }} />}
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* hiding the pieces — and Joanna's hand */}
      <Shot from={s4} to={s7}>
        {(f, l) => {
          const hide = f < s5;
          return (
            <Svg>
              <Cam fx={600} fy={1380} z={1.5}>
                <LivingRoom f={f} />
                <Sofa x={820} y={1560} s={0.6} />
                <Vase x={520 + (hide ? ease(l, 0, 50) * 200 : 200)} y={1640} s={0.75} k={1} spread={hide ? 1 - ease(l, 0, 50) * 0.5 : 0.5} />
                <Faisal f={f} x={560} y={1760} tilt={hide ? 14 : 0} expr={f >= s6 ? "worry" : hide ? "sly" : "shock"} look={[1, 0.6]} armR={hide ? { target: [260, -300] } : {}} armL={!hide ? { target: [-260, -520] } : {}} />
                <Jo f={f} x={300} y={1760} expr={hide ? "shock" : "smile"} look={[1, -0.2]} armR={!hide ? { target: [220, -500] } : {}} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* puzzle: 7 pieces, the vase needs 8 */}
      <Shot from={s7} to={s8}>
        {(f, l) => {
          const k = 1 - ease(l, 0, 40);
          return (
            <AbsoluteFill>
              <Svg>
                <rect width={1080} height={1920} fill="#C99A6B" />
                <rect x={60} y={300} width={960} height={1300} rx={40} fill="#B5443C" opacity={0.25} />
                <polygon points={SHARDS[7]} transform="translate(540 1300) scale(2.6)" fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="14 10" />
                <Vase x={540} y={1300} s={2.6} k={k * 0.6} missing />
                {l > 40 &&
                  SHARDS.slice(0, 7).map((p, i) => {
                    const [cx, cy] = centre(p);
                    return (
                      <text key={i} x={540 + cx * 2.6} y={1300 + cy * 2.6 + 14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill="#fff" opacity={ease(l, 40 + i * 6, 46 + i * 6)}>
                        {"١٢٣٤٥٦٧"[i]}
                      </text>
                    );
                  })}
                {l > 90 && (
                  <text x={540 + centre(SHARDS[7])[0] * 2.6} y={1300 + centre(SHARDS[7])[1] * 2.6 + 30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={110} fill="#FFE14D">
                    ؟
                  </text>
                )}
              </Svg>
              {l < 6 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* the 8th piece under the sofa */}
      <Shot from={s8} to={s9}>
        {(f, l) => (
          <Svg>
            <rect width={1080} height={1920} fill="#2A1A10" />
            <rect x={0} y={700} width={1080} height={520} fill="#4A3020" />
            <Kitten x={680} y={1160} s={0.6} f={f} sleep />
            <g transform={`translate(${380 + ease(l, 10, 30) * 120} 1120) scale(1.6)`}>
              <polygon points={SHARDS[7]} transform="translate(-40 40)" fill="#3E7CB1" stroke="#FFE27A" strokeWidth={4} />
            </g>
            <circle cx={460} cy={1060} r={140} fill="#FFF3C4" opacity={0.12} />
            <path d={`M-40 ${1000} q200 0 ${300 + ease(l, 0, 20) * 120} 60`} stroke="#E8B48A" strokeWidth={70} strokeLinecap="round" fill="none" />
          </Svg>
        )}
      </Shot>
      {/* confession and hug */}
      <Shot from={s9} to={s11}>
        {(f) => {
          const hug = f >= s10;
          return (
            <Svg>
              <Cam fx={540} fy={1300} z={1.4}>
                <LivingRoom f={f} />
                <Vase x={760} y={1700} s={0.55} k={0.35} spread={0.6} />
                <Mama f={f} x={700} y={1780} expr={hug ? "happy" : "worry"} tilt={hug ? -8 : 0} look={[-1, 0.6]} armL={hug ? { target: [-260, -560] } : {}} />
                <Faisal f={f} x={460} y={1780} expr={hug ? "happy" : "worry"} look={[1, -0.6]} armsFront={!hug} armL={!hug ? { target: [-40, -580] } : {}} armR={!hug ? { target: [40, -580] } : {}} />
                <Jo f={f} x={200} y={1780} expr={hug ? "happy" : "smile"} look={[1, -0.3]} />
                {hug && [0, 1, 2].map((i) => <path key={i} d="M0 30 C-45 0 -25 -45 0 -20 C25 -45 45 0 0 30Z" fill="#FF6FA8" transform={`translate(${340 + i * 80} ${1330 - ((f * 2 + i * 40) % 140)})`} opacity={0.8} />)}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* golden repair */}
      <Shot from={s11} to={crash2}>
        {(f, l) => {
          const k = 1 - ease(l, 0, 50);
          const gold = ease(l, 40, 80);
          return (
            <Svg>
              <Cam fx={540} fy={1250} z={1.35}>
                <LivingRoom f={f} />
                <rect x={240} y={1500} width={600} height={40} rx={12} fill="#8B5E34" />
                <rect x={280} y={1540} width={30} height={240} fill="#6B4523" />
                <rect x={770} y={1540} width={30} height={240} fill="#6B4523" />
                <Vase x={540} y={1500} s={0.85} k={k * 0.4} gold={gold} />
                {gold > 0.5 && [0, 1, 2, 3].map((i) => <text key={i} x={400 + i * 90} y={1100 - ((f * 1.5 + i * 30) % 120)} fontSize={50} textAnchor="middle">✨</text>)}
                <Faisal f={f} x={260} y={1780} expr="happy" look={[1, -0.6]} armR={{ target: [300, -620] }} />
                <Jo f={f} x={820} y={1780} expr="happy" look={[-1, -0.6]} armL={{ target: [-300, -620] }} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* the joke: another crash */}
      <Shot from={crash2} to={endFrom}>
        {(f, l) => {
          const fall = ease(l, 6, 16);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={600} fy={1300} z={1.25}>
                  <LivingRoom f={f} />
                  <rect x={700} y={1300} width={340} height={30} rx={10} fill="#8B5E34" />
                  <rect x={730} y={1330} width={24} height={440} fill="#6B4523" />
                  <Kitten x={900} y={1300} s={0.36} f={f} look={-1} />
                  {fall < 1 ? <Cup x={800 - fall * 40} y={1300 + fall * 460} r={fall * 160} /> : <Cup x={760} y={1770} r={0} broken />}
                  <Mama f={f} x={180} y={1780} expr={l > 20 ? "sly" : "shock"} look={[1, 0.2]} />
                  <Jo f={f} x={380} y={1780} expr={l > 20 ? "sly" : "shock"} look={[1, 0.2]} />
                  <Faisal f={f} x={580} y={1780} expr={f >= at("Q12-F") ? "shock" : "worry"} look={[-1, -0.3]} armL={f >= at("Q12-F") ? { a: 150, b: 170 } : {}} armR={f >= at("Q12-F") ? { a: 150, b: 170 } : {}} sweat={1} />
                </Cam>
              </Svg>
              {Math.abs(l - 16) < 6 && <Flash l={l - 16} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={endFrom} to={T.durationInFrames}>
        {(_f, l) => <HomeEnd l={l} value="الاعتراف بالغلط… شجاعة 🤍" next="قريباً!" />}
      </Shot>
      <Tag text="حكايات بيتنا · الحلقة ٦" />

      <Sfx name="shatter" at={6} />
      <Sfx name="gasp" at={20} gain={0.6} />
      <Sfx name="meow" at={s2 + 20} />
      <Sfx name="sting" at={s3} />
      <Sfx name="scratch" at={s4 + 6} />
      <Sfx name="aww" at={s6} gain={0.5} />
      <Sfx name="magnify" at={s7} />
      <Sfx name="pop" at={s7 + 40} />
      <Sfx name="tick" at={s7 + 90} />
      <Sfx name="purr" at={s8} />
      <Sfx name="sparkle" at={s8 + 20} />
      <Sfx name="aww" at={s10 + 10} gain={0.6} />
      <Sfx name="sparkle" at={s11 + 40} />
      <Sfx name="shatter" at={crash2 + 16} gain={0.7} />
      <Sfx name="laugh" at={endOf("Q12-F")} gain={0.6} />
      <Sfx name="jingle" at={endFrom} />
      {T.audio.vo && T.scenes.map((s) => <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/homef/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />)}
      {T.audio.music && <Audio src={staticFile("audio/homef/music/theme.mp3")} loop volume={(f) => musicLevel(T, f)} />}
    </AbsoluteFill>
  );
};
