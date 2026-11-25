import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import data from "../data/r404a-timeline.json";
import mouthData from "../data/r404a-mouth.json";
import type { TimelineData } from "../lib/timing";
import { db } from "../theme";
import { Cam, Corridor, Countdown, ease, EndCard, Flash, FONT, Holo, Lab, makeEp, Shot, Svg, Tag, TaglineCard, Zero } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, talkOf, Sfx, Jo, Faisal } = makeEp(T, mouthData as Record<string, number[]>, "r404a");

const poly = (n: number, r: number) => (n === 0 ? null : Array.from({ length: n }).map((_, i) => `${Math.cos((i / n) * Math.PI * 2 - Math.PI / 2 + (n % 2 ? 0 : Math.PI / n)) * r},${Math.sin((i / n) * Math.PI * 2 - Math.PI / 2 + (n % 2 ? 0 : Math.PI / n)) * r}`).join(" "));

/** The shape lock: triangle, square, pentagon, ? — options circle / hexagon / star. */
const ShapeLock: React.FC<{ f: number; pick?: "circle" | "hex" | null; flash?: number; solved?: number; count?: number }> = ({ pick, flash = 0, solved = 0, count = 0 }) => {
  const seq = [3, 4, 5];
  return (
    <g>
      <rect x={90} y={520} width={900} height={880} rx={40} fill="#0A1620" stroke="#5CF2FF" strokeWidth={8} />
      {seq.map((n, i) => (
        <g key={n} transform={`translate(${830 - i * 230} 760)`}>
          <polygon points={poly(n, 80) ?? ""} fill="none" stroke="#5CF2FF" strokeWidth={10} />
          {count > i && (
            <text x={0} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={56} fill="#FFD23F">
              {"٣٤٥"[i]}
            </text>
          )}
        </g>
      ))}
      <g transform="translate(140 760)">
        {solved > 0 ? (
          <g opacity={solved}>
            <polygon points={poly(6, 80) ?? ""} fill="#5CF2FF" fillOpacity={0.3} stroke="#8EF7A0" strokeWidth={10} />
            {count > 3 && (
              <text x={0} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={56} fill="#8EF7A0">
                ٦
              </text>
            )}
          </g>
        ) : (
          <text x={0} y={36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={120} fill="#FFD23F">
            ؟
          </text>
        )}
      </g>
      <line x1={140} x2={940} y1={1010} y2={1010} stroke="#1A4A55" strokeWidth={4} />
      {/* options */}
      {[
        { k: "circle", x: 780, el: <circle r={70} fill="none" stroke="#fff" strokeWidth={10} /> },
        { k: "hex", x: 540, el: <polygon points={poly(6, 75) ?? ""} fill="none" stroke="#fff" strokeWidth={10} /> },
        { k: "star", x: 300, el: <polygon points="0,-75 18,-24 72,-24 28,8 44,62 0,30 -44,62 -28,8 -72,-24 -18,-24" fill="none" stroke="#fff" strokeWidth={10} /> },
      ].map((o) => {
        const sel = pick === o.k;
        const bad = sel && o.k === "circle";
        return (
          <g key={o.k} transform={`translate(${o.x} 1200)`}>
            <rect x={-110} y={-110} width={220} height={220} rx={30} fill={sel ? (bad ? "#FF4D6D" : "#2EBD6B") : "#14303A"} fillOpacity={sel ? 0.4 + 0.4 * flash : 1} stroke="#5CF2FF" strokeWidth={4} />
            {o.el}
          </g>
        );
      })}
    </g>
  );
};

export const Room404A: React.FC = () => {
  const s2 = line("A02-J").from;
  const s3 = line("A03-F").from;
  const f4 = at("A04-F");
  const s5 = line("A05-J").from;
  const j5 = at("A05-J");
  const e5 = endOf("A05-J");
  const s6 = line("A06-F").from;
  const z7 = at("A07-Z");
  const s8 = line("A08-J").from;
  const s9 = line("A09-Z").from;
  const s10 = line("A10-J").from;
  const e10 = endOf("A10-J");
  const wrongAt = f4 + 18;
  const solveAt = e5 - 6;
  const bootAt = z7 - 50;
  return (
    <AbsoluteFill style={{ background: "#0E1A2E" }}>
      {/* hook: the door that wasn't there */}
      <Shot from={0} to={s3}>
        {(f, l) => {
          const push = ease(l, 0, s3);
          const jo = f >= s2;
          return (
            <Svg>
              <Cam fx={540} fy={interpolate(push, [0, 1], [980, 1080])} z={interpolate(push, [0, 1], [1.0, 1.25])}>
                <Corridor f={f} />
                <Faisal f={f} x={260} y={1700} expr={jo ? "smile" : "shock"} look={[1, -0.6]} armR={jo ? {} : { target: [260, -760] }} />
                <Jo f={f} x={860} y={1700} expr={jo ? "worry" : "shock"} look={[-0.8, -0.4]} armR={jo ? { target: [100, -700] } : {}} armsFront={jo} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* the shape lock */}
      <Shot from={s3} to={s5}>
        {(f, l) => {
          const zoom = ease(l, 0, 24);
          const wrong = f >= wrongAt;
          return (
            <AbsoluteFill>
              <Svg>
                <rect x={0} y={0} width={1080} height={1920} fill="#0E1A2E" />
                <g transform={`translate(${wrong && f < wrongAt + 12 ? Math.sin(f * 3) * 10 : 0} ${(1 - zoom) * 200})`} opacity={zoom}>
                  <ShapeLock f={f} pick={f >= f4 ? "circle" : null} flash={wrong ? Math.abs(Math.sin(f / 3)) : 0} />
                </g>
                <Faisal f={f} x={540} y={2080} s={0.62} expr={wrong ? "worry" : "happy"} look={[0, -1]} armR={f >= f4 && !wrong ? { target: [150, -900] } : {}} sweat={wrong ? 1 : 0} />
              </Svg>
              {wrong && f < wrongAt + 8 && <Flash l={f - wrongAt} color="#FF4D6D" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* think time */}
      <Shot from={s5} to={j5}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <rect x={0} y={0} width={1080} height={1920} fill="#0E1A2E" />
              <ShapeLock f={f} />
            </Svg>
            <Countdown l={l} total={j5 - s5} />
          </AbsoluteFill>
        )}
      </Shot>
      {/* Joanna explains: the sides grow by one */}
      <Shot from={j5} to={s6 + 20}>
        {(f, l) => {
          const count = Math.min(4, Math.floor(ease(l, 10, e5 - j5 - 20) * 4.99));
          const solved = ease(f, solveAt, solveAt + 10);
          const inLock = f < solveAt + 30;
          return (
            <AbsoluteFill>
              <Svg>
                <rect x={0} y={0} width={1080} height={1920} fill="#0E1A2E" />
                {inLock ? (
                  <g>
                    <g transform="translate(0 -160)">
                      <ShapeLock f={f} pick={solved > 0 ? "hex" : null} solved={solved} count={count} flash={solved} />
                    </g>
                    <Jo f={f} x={540} y={2150} s={0.66} expr={solved > 0 ? "happy" : "proud"} look={[0, -0.6]} armR={solved > 0 ? { a: 140, b: 170 } : { target: [140, -760] }} />
                  </g>
                ) : (
                  <Cam fx={540} fy={1000} z={1.2}>
                    <Corridor f={f} open={ease(f, solveAt + 30, solveAt + 60)} />
                  </Cam>
                )}
              </Svg>
              {f >= solveAt && f < solveAt + 8 && <Flash l={f - solveAt} color="#8EF7A0" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* the secret lab */}
      <Shot from={s6 + 20} to={s9}>
        {(f, l) => {
          const boot = ease(f, bootAt, bootAt + 40);
          const zeroTalk = f >= z7 - 4;
          const fx = f >= s8 ? 500 : zeroTalk ? 700 : interpolate(ease(l, 0, 90), [0, 1], [540, 640]);
          const z = f >= s8 ? 1.5 : zeroTalk ? 1.6 : interpolate(ease(l, 0, 90), [0, 1], [0.95, 1.2]);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={fx} fy={1150} z={z}>
                  <Lab f={f} />
                  <Zero x={760} y={1480} s={0.7} f={f} mood={boot > 0.1 ? (zeroTalk ? "happy" : "neutral") : "sleep"} boot={boot} talk={talkOf("Z", f)} look={-0.6} arm={zeroTalk ? 0.6 + 0.3 * Math.sin(f / 6) : 0} />
                  <Faisal f={f} x={280} y={1720} expr={boot > 0.1 ? "shock" : "happy"} look={[1, -0.4]} armL={{ a: 150, b: 175 }} armR={{ a: 150, b: 175 }} />
                  <Jo f={f} x={470} y={1720} expr={f >= s8 ? "shock" : boot > 0.1 ? "shock" : "happy"} look={[1, -0.3]} />
                </Cam>
              </Svg>
              {l < 8 && <Flash l={l} color="#BFF8FF" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* the mission */}
      <Shot from={s9} to={s10}>
        {(f, l) => (
          <Svg>
            <Cam fx={640} fy={1050} z={1.35}>
              <Lab f={f} dim={0.3} />
              <Holo x={540} y={800} w={560} h={420} f={f} k={ease(l, 10, 30)}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <rect key={i} x={-220 + i * 95} y={140 - (60 + ((i * 47) % 120))} width={60} height={60 + ((i * 47) % 120)} fill="#5CF2FF" opacity={0.6} />
                ))}
                <circle cx={150} cy={-100} r={40} fill="#FFD23F" opacity={0.7} />
                <text x={0} y={-140} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={50} fill="#BFF8FF">
                  المستقبل
                </text>
              </Holo>
              <Zero x={820} y={1480} s={0.7} f={f} mood="neutral" talk={talkOf("Z", f)} look={-0.4} arm={0.8} />
              <Faisal f={f} x={260} y={1720} expr="shock" look={[1, -1]} />
              <Jo f={f} x={450} y={1720} expr="worry" look={[0.6, -1]} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* tagline */}
      <Shot from={s10} to={e10 + 12}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={520} fy={1150} z={1.7}>
                <Lab f={f} />
                <Faisal f={f} x={330} y={1720} expr="happy" look={[0, 0]} armR={{ a: 140, b: 170 }} />
                <Jo f={f} x={560} y={1720} expr="happy" look={[0, 0]} armR={{ target: [200, -700] }} />
                <Zero x={790} y={1480} s={0.6} f={f} mood="happy" look={0} />
              </Cam>
            </Svg>
            {l > 20 && <TaglineCard l={l - 20} />}
          </AbsoluteFill>
        )}
      </Shot>
      <Shot from={e10 + 12} to={1800}>
        {(_f, l) => <EndCard l={l} next="الحلقة ٢: رسالة من المستقبل" question="وش المهمة؟ 🤖" />}
      </Shot>
      <Tag text="سرّ الغرفة 404 · الحلقة ١" />

      <Sfx name="hum" at={0} />
      <Sfx name="flicker" at={20} />
      <Sfx name="whoosh" at={s3} />
      <Sfx name="beep" at={f4} />
      <Sfx name="wrong" at={wrongAt} />
      <Sfx name="tick" at={s5 + 2} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} name="beep" at={j5 + 20 + i * 45} gain={0.7} />
      ))}
      <Sfx name="correct" at={solveAt} />
      <Sfx name="door" at={solveAt + 30} />
      <Sfx name="lab" at={s6 + 20} />
      <Sfx name="boot" at={bootAt} />
      <Sfx name="robot" at={z7 + 30} />
      <Sfx name="holo" at={s9 + 8} />
      <Sfx name="tagline" at={s10 + 20} />
      <Sfx name="sting" at={e10 + 10} />
      {T.scenes.map((s) => (
        <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/r404a/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />
      ))}
      <Audio
        src={staticFile("audio/r404a/music/theme.mp3")}
        volume={(f) => {
          const inVoice = T.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 6);
          const fd = interpolate(f, [0, 6, 1770, 1800], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (inVoice ? db(-22) : db(-15)) * fd;
        }}
      />
    </AbsoluteFill>
  );
};

