import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import data from "../data/homea-timeline.json";
import mouthData from "../data/homea-mouth.json";
import type { TimelineData } from "../lib/timing";
import { musicLevel } from "../room404/kit";
import { Bedroom, Cam, Dark, ease, Flash, FONT, HomeEnd, Kitten, makeHome, Shot, Svg, Tag } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, Sfx, Jo, Faisal, Baba } = makeHome(T, mouthData as Record<string, number[]>, "homea");
const S = (id: string) => line(id).from;

/** Dark gap under Faisal's bed where the "monster" hides. */
const BedGap: React.FC = () => <rect x={620} y={1196} width={400} height={64} rx={8} fill="#070A18" />;
const Blanket: React.FC<{ x: number }> = ({ x }) => <rect x={x - 220} y={1010} width={440} height={170} rx={24} fill="#7A8FD0" stroke="#5A6FB0" strokeWidth={6} />;

const Bread: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-70 0 q-10 -60 40 -70 q30 -20 60 0 q50 10 40 70Z" fill="#E3B26B" stroke="#B57E3A" strokeWidth={6} />
    <path d="M10 -70 q12 18 0 30 q14 10 0 24 q12 10 4 16" fill="#2A3358" />
  </g>
);

const Paw: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`} opacity={o} fill="#B07A48">
    <ellipse cx={0} cy={6} rx={22} ry={16} />
    {[-14, -5, 5, 14].map((d) => (
      <circle key={d} cx={d} cy={-10 - (Math.abs(d) < 10 ? 4 : 0)} r={5} />
    ))}
  </g>
);
const PAWS = Array.from({ length: 9 }).map((_, i) => ({ x: -60 + i * 85, y: 1330 + (i % 2) * 30 - i * 4 }));

export const HomeA: React.FC = () => {
  const s2 = S("G02-J");
  const s3 = S("G03-J");
  const s4 = S("G04-F");
  const s5 = S("G05-F");
  const s6 = S("G06-J");
  const s7 = S("G07-F");
  const s8 = S("G08-D");
  const s9 = S("G09-F");
  const s10 = S("G10-D");
  const s11 = S("G11-F");
  const s12 = S("G12-J");
  const meow = at("G05-F") - 40;
  const lightsOn = at("G08-D") - 26;
  const endFrom = endOf("G12-J") + 30;
  return (
    <AbsoluteFill style={{ background: "#050816" }}>
      {/* HOOK: glowing eyes under Faisal's bed */}
      <Shot from={0} to={s2}>
        {(f, l) => {
          const eyeK = ease(l, 6, 22);
          return (
            <Svg>
              <Cam fx={760 + ease(l, 30, 90) * 60} fy={1080 + ease(l, 30, 90) * 80} z={2.3 - ease(l, 0, 30) * 0.5}>
                <Bedroom f={f} />
                <BedGap />
                <Faisal f={f} x={820} y={1150} seated expr="shock" look={[-0.6, 1]} sweat={ease(l, 40, 60)} armsFront armL={{ target: [-40, -600] }} armR={{ target: [40, -600] }} />
                <Blanket x={820} />
                <Jo f={f} x={260} y={1150} s={0.5} seated expr="worry" blink={l < 70 ? 1 : undefined} look={[1, 0.3]} />
                <Blanket x={260} />
                <Dark id="dA1" spots={[{ x: 540, y: 900, r: 220 }]} o={0.72} />
                <g opacity={eyeK}>
                  <Kitten x={860} y={1300} s={0.42} f={f} eyesOnly look={-1} />
                </g>
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* the investigation by flashlight */}
      <Shot from={s2} to={s6}>
        {(f) => {
          const spot = f < s3 ? { x: 470, y: 1250 } : f < s4 ? { x: 250, y: 1440 } : f < meow ? { x: 380, y: 1350 } : { x: 820, y: 1230 };
          const tx = spot.x - (470 + 108 * 0.45);
          const ty = spot.y - (1600 - 548 * 0.45);
          const d = Math.hypot(tx, ty);
          const hand: [number, number] = [108 + (tx / d) * 260, -548 + (ty / d) * 260];
          const hx = 470 + hand[0] * 0.45;
          const hy = 1600 + hand[1] * 0.45;
          return (
            <Svg>
              <Cam fx={(spot.x + 480) / 2} fy={(spot.y + 1300) / 2} z={1.75}>
                <Bedroom f={f} />
                <BedGap />
                <Blanket x={820} />
                <Blanket x={260} />
                <Bread x={250} y={1450} s={0.8} />
                {f >= s4 && PAWS.map((p, i) => <Paw key={i} x={p.x + 260} y={p.y} r={80} o={ease(f, s4 + i * 4, s4 + i * 4 + 8)} />)}
                <Faisal f={f} x={300} y={1640} s={0.38} expr={f >= s5 ? "shock" : "worry"} look={[1, -0.2]} sweat={1} armR={{ target: [260, -560] }} />
                <Jo f={f} x={470} y={1600} s={0.45} expr={f >= s3 && f < s4 ? "sly" : "smile"} look={[(spot.x - 470) / 400, 0.6]} armR={{ target: hand }} />
                <Dark id="dA2" spots={[{ x: spot.x, y: spot.y, r: 170 }, { x: 540, y: 1460, r: 230 }]} o={0.8} />
                <polygon points={`${hx},${hy} ${spot.x - 150},${spot.y} ${spot.x + 150},${spot.y}`} fill="#FFF3C4" opacity={0.12} />
                <rect x={hx - 18} y={hy - 18} width={36} height={36} rx={6} fill="#E8414B" />
                {f >= meow && f < meow + 50 && (
                  <text x={900} y={1120 - (f - meow)} fontFamily={FONT} fontWeight={800} fontSize={60} fill="#FFE27A" textAnchor="middle" opacity={1 - (f - meow) / 50}>
                    مياااو…
                  </text>
                )}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* reveal: a soaked, shivering kitten */}
      <Shot from={s6} to={lightsOn}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={600} fy={1250} z={2.2 - ease(l, 0, 40) * 0.3}>
                <Bedroom f={f} />
                <rect x={-200} y={1196} width={1600} height={260} fill="#070A18" />
                <Kitten x={640} y={1400} s={0.55} f={f} wet={f < s8 ? 1 : 0.6} look={-1} />
                <Faisal f={f} x={330} y={1820} s={0.42} tilt={14} expr={f >= s7 ? "worry" : "shock"} look={[1, 0.2]} />
                <Dark id="dA3" spots={[{ x: 640, y: 1330, r: 200 }, { x: 330, y: 1480, r: 140 }]} o={0.75} />
              </Cam>
            </Svg>
            {l < 6 && <Flash l={l} color="#FFF3C4" />}
          </AbsoluteFill>
        )}
      </Shot>
      {/* lights on: Dad, milk, the decision */}
      <Shot from={lightsOn} to={s12}>
        {(f, l) => {
          const cheer = f >= s11;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={f >= s10 && f < s11 ? 320 : 520} fy={1240} z={f >= s10 && f < s11 ? 1.55 : 1.25}>
                  <Bedroom f={f} lit />
                  <Blanket x={820} />
                  <Blanket x={260} />
                  <Baba f={f} x={170} y={1820} expr={f >= s10 ? "smile" : "worry"} look={[1, 0.2]} armR={f >= s10 ? { target: [250, -620] } : {}} />
                  <ellipse cx={600} cy={1700} rx={90} ry={22} fill="#fff" stroke="#C9D3E0" strokeWidth={6} />
                  <ellipse cx={600} cy={1696} rx={64} ry={12} fill="#F6F1E6" />
                  <Kitten x={600} y={1690} s={0.42} f={f} wet={0} look={0} />
                  <Faisal f={f} x={820} y={1800} s={0.42} expr={cheer ? "laugh" : f >= s9 ? "happy" : "smile"} look={[-1, -0.3]} armL={cheer ? { a: 150, b: 175 } : { target: [-230, -440] }} armR={cheer ? { a: 150, b: 175 } : {}} />
                  <Jo f={f} x={420} y={1800} s={0.5} expr="happy" look={f >= s8 && f < s9 ? [-1, -0.3] : [1, 0]} />
                </Cam>
              </Svg>
              {l < 6 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* the joke: the "monster" sleeps on Faisal's head */}
      <Shot from={s12} to={endFrom}>
        {(f, l) => (
          <Svg>
            <Cam fx={600} fy={1000} z={1.7 - ease(l, 0, 60) * 0.25}>
              <Bedroom f={f} />
              <Faisal f={f} x={820} y={1150} seated expr="shock" blink={0} look={[0, -1]} />
              <Kitten x={820} y={765} s={0.34} f={f} sleep />
              <Blanket x={820} />
              <Jo f={f} x={260} y={1150} s={0.5} seated expr="laugh" look={[1, 0]} />
              <Blanket x={260} />
              <Dark id="dA5" spots={[{ x: 540, y: 900, r: 700 }]} o={0.35} />
            </Cam>
          </Svg>
        )}
      </Shot>
      <Shot from={endFrom} to={T.durationInFrames}>
        {(_f, l) => <HomeEnd l={l} value="الرحمة… تبدأ لما نهدأ ونفكّر 🤍" next="مين أكل كعكة الضيوف؟" />}
      </Shot>
      <Tag text="حكايات بيتنا · الحلقة ١" />

      <Sfx name="scratch" at={2} />
      <Sfx name="heartbeat" at={20} />
      <Sfx name="click" at={s2 + 10} />
      <Sfx name="magnify" at={s3} />
      <Sfx name="steps" at={s4} />
      <Sfx name="meow" at={meow} />
      <Sfx name="sting" at={s6} />
      <Sfx name="aww" at={s7} gain={0.6} />
      <Sfx name="switch" at={lightsOn} />
      <Sfx name="slurp" at={s9 + 10} />
      <Sfx name="cheer" at={s11 + 20} gain={0.6} />
      <Sfx name="purr" at={s12} />
      <Sfx name="laugh" at={endOf("G12-J")} gain={0.6} />
      <Sfx name="jingle" at={endFrom} />
      {T.audio.vo && T.scenes.map((s) => <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/homea/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />)}
      {T.audio.music && <Audio src={staticFile("audio/homea/music/theme.mp3")} loop volume={(f) => musicLevel(T, f)} />}
    </AbsoluteFill>
  );
};
