import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import data from "../data/r404e-timeline.json";
import mouthData from "../data/r404e-mouth.json";
import type { TimelineData } from "../lib/timing";
import { Cam, Countdown, ease, EndCard, EyeScreen, Flash, FONT, Holo, Lab, makeEp, musicLevel, Shot, Svg, Tag, TaglineCard, Virus, Zero } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, talkOf, Sfx, Jo, Faisal } = makeEp(T, mouthData as Record<string, number[]>, "r404e");

const SEQ = ["٢", "٦", "١٢", "٢٠", "٣٠"];
const DIFFS = ["+٤", "+٦", "+٨", "+١٠"];

const SequenceCard: React.FC<{ diffs: number; answer: number }> = ({ diffs, answer }) => (
  <g>
    <rect x={70} y={560} width={940} height={520} rx={36} fill="#0A1620" stroke="#5CF2FF" strokeWidth={8} />
    {[...SEQ, answer > 0 ? "٤٢" : "؟"].map((n, i) => (
      <g key={i} transform={`translate(${930 - i * 165} 860)`}>
        <rect x={-68} y={-70} width={136} height={140} rx={20} fill={i === 5 ? (answer > 0 ? "#14402A" : "#2A1E05") : "#14303A"} stroke={i === 5 ? (answer > 0 ? "#8EF7A0" : "#FFD23F") : "#5CF2FF"} strokeWidth={5} />
        <text x={0} y={26} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={n.length > 1 ? 62 : 76} fill={i === 5 ? (answer > 0 ? "#8EF7A0" : "#FFD23F") : "#fff"}>
          {n}
        </text>
      </g>
    ))}
    {DIFFS.map((d, i) =>
      i < diffs ? (
        <text key={d} x={930 - i * 165 - 82} y={740} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill="#FFD23F">
          {d}
        </text>
      ) : null,
    )}
    {answer > 0 && (
      <text x={930 - 4 * 165 - 82} y={740} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill="#8EF7A0" opacity={answer}>
        +١٢
      </text>
    )}
  </g>
);

export const Room404E: React.FC = () => {
  const s2 = line("E02-F").from;
  const s3 = line("E03-J").from;
  const s4 = line("E04-Z").from;
  const s5 = line("E05-F").from;
  const f5 = at("E05-F");
  const e5 = endOf("E05-F");
  const s6 = line("E06-J").from;
  const e6 = endOf("E06-J");
  const s7 = line("E07-X").from;
  const s8 = line("E08-Z").from;
  const z8 = at("E08-Z");
  const s9 = line("E09-F").from;
  const s10 = line("E10-Z").from;
  const z10 = at("E10-Z");
  const e10 = endOf("E10-Z");
  const s11 = line("E11-J").from;
  const e11 = endOf("E11-J");
  const tagFrom = e11 + 16;
  const endFrom = tagFrom + 110;
  const virusAt = z10 + (e10 - z10) * 0.3;
  return (
    <AbsoluteFill style={{ background: "#05080D" }}>
      {/* HOOK: Zero doesn't know them — red eyes, a red protection field */}
      <Shot from={0} to={s3}>
        {(f, l) => {
          const field = ease(l, 30, 50);
          const faisal = f >= s2;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={faisal ? 520 : 760} fy={faisal ? 1250 : 1150} z={faisal ? 1.6 : 2.7 - ease(l, 0, 60) * 0.4}>
                  <Lab f={f} alarm={0.7} />
                  {field > 0 && [0, 1, 2].map((i) => <circle key={i} cx={760} cy={1250} r={(260 + i * 60) * field} fill="none" stroke="#FF4D6D" strokeWidth={6} opacity={0.5 - i * 0.12} />)}
                  <Zero x={760} y={1460} s={0.62} f={f} mood="glitch" talk={talkOf("Z", f)} look={-0.6} arm={field} />
                  <Faisal f={f} x={330} y={1720} expr={faisal ? "worry" : "shock"} look={[1, -0.5]} armL={{ a: 120, b: 160 }} armR={{ a: 120, b: 160 }} />
                  <Jo f={f} x={520} y={1720} expr="shock" look={[1, -0.4]} />
                </Cam>
              </Svg>
              {l < 5 && <Flash l={l} color="#FF4D6D" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* locked memory files */}
      <Shot from={s3} to={s5}>
        {(f, l) => {
          const card = f >= s4;
          return (
            <AbsoluteFill>
              <Svg>
                {card ? (
                  <g>
                    <rect x={0} y={0} width={1080} height={1920} fill="#0A141C" />
                    <g opacity={ease(f, s4, s4 + 14)}>
                      <SequenceCard diffs={0} answer={0} />
                    </g>
                    <Zero x={540} y={1760} s={0.55} f={f} mood="glitch" talk={talkOf("Z", f)} />
                  </g>
                ) : (
                  <Cam fx={540} fy={1000} z={1.35}>
                    <Lab f={f} alarm={0.4} />
                    <Holo x={540} y={800} w={640} h={380} f={f} k={ease(l, 0, 16)}>
                      {[0, 1, 2, 3].map((i) => (
                        <g key={i} transform={`translate(${225 - i * 150} 10)`}>
                          <path d="M-55 -40 h40 l12 14 h58 v86 h-110Z" fill="#14303A" stroke="#5CF2FF" strokeWidth={4} />
                          <text x={0} y={30} textAnchor="middle" fontSize={44}>🔒</text>
                        </g>
                      ))}
                      <text x={0} y={-130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#BFF8FF">
                        ذاكرة زيرو · ٤ ملفات مقفلة
                      </text>
                    </Holo>
                    <Jo f={f} x={420} y={1720} expr="sly" look={[0.4, -1]} armR={{ target: [200, -800] }} />
                    <Zero x={820} y={1460} s={0.6} f={f} mood="glitch" look={-0.4} />
                  </Cam>
                )}
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* think time + the differences */}
      <Shot from={s5} to={s7}>
        {(f, l) => {
          const think = f < f5 - 4;
          const diffs = think ? 0 : Math.min(4, Math.floor(ease(f, f5, e5) * 4.99));
          const ans = ease(f, e6 - 20, e6);
          const unlocked = f >= e6;
          return (
            <AbsoluteFill style={{ background: "#0A141C" }}>
              <Svg>
                <SequenceCard diffs={diffs} answer={ans} />
                {!think && f < s6 && <Faisal f={f} x={330} y={2080} s={0.62} expr="happy" look={[0.4, -1]} armR={{ target: [180, -1000] }} />}
                {f >= s6 && <Jo f={f} x={760} y={2100} s={0.62} expr={unlocked ? "happy" : "proud"} look={[-0.4, -1]} armL={{ target: [-200, -1000] }} />}
              </Svg>
              {think && <Countdown l={l} total={f5 - 4 - s5} top={300} question="وش الرقم الجاي؟" />}
              {unlocked && f < e6 + 8 && <Flash l={f - e6} color="#8EF7A0" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* the memory: who built Zero */}
      <Shot from={s7} to={s9}>
        {(f, l) => {
          const zeroBack = f >= z8 + 10;
          return (
            <AbsoluteFill>
              <Svg>
                {f < s8 ? (
                  <g>
                    <rect x={0} y={0} width={1080} height={1920} fill="#1A1206" />
                    <g style={{ filter: "sepia(0.9) saturate(1.4) brightness(0.9)" }}>
                      <Cam fx={540} fy={1100} z={1.2}>
                        <Lab f={f} />
                        <g style={{ filter: "brightness(0.25)" }}>
                          <Jo f={f} x={300} y={1720} s={0.85} expr="smile" talk={0} blink={0} armR={{ target: [260, -700] }} />
                          <Faisal f={f} x={820} y={1720} s={0.85} expr="smile" talk={0} blink={0} armL={{ target: [-260, -700] }} />
                        </g>
                        <Zero x={560} y={1420} s={0.55} f={f} mood="sleep" boot={0.01} />
                      </Cam>
                    </g>
                  </g>
                ) : (
                  <Cam fx={700} fy={1200} z={1.8}>
                    <Lab f={f} />
                    <Zero x={760} y={1460} s={0.62} f={f} mood={zeroBack ? "happy" : "neutral"} talk={talkOf("Z", f)} look={-0.6} />
                    <Faisal f={f} x={480} y={1720} expr="happy" look={[1, -0.5]} />
                    <Jo f={f} x={300} y={1720} expr="happy" look={[1, -0.4]} />
                  </Cam>
                )}
              </Svg>
              {f < s8 && (
                <div dir="rtl" style={{ position: "absolute", top: 300, left: 140, right: 180, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 40, color: "#FFE3A8", opacity: ease(l, 6, 20) }}>
                  ملف ذاكرة #١ · المختبر · ٢٠٦٠
                </div>
              )}
              {f >= s8 && f < s8 + 8 && <Flash l={f - s8} color="#BFF8FF" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* hug, then the truth about «فراغ» */}
      <Shot from={s9} to={s11}>
        {(f, l) => {
          const virus = ease(f, virusAt, virusAt + 20);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={600} fy={1100} z={1.35}>
                  <Lab f={f} alarm={virus} />
                  <EyeScreen x={540} y={600} w={400} h={260} f={f} on={virus > 0.5} />
                  <Zero x={760} y={1460} s={0.62} f={f} mood={virus > 0.5 ? "neutral" : "happy"} talk={talkOf("Z", f)} look={-0.6} />
                  <Faisal f={f} x={560} y={1720 - (f < s10 ? Math.abs(Math.sin(l / 5)) * 40 : 0)} expr={virus > 0.5 ? "shock" : "laugh"} look={[1, -0.4]} armR={f < s10 ? { a: 150, b: 175 } : {}} armL={f < s10 ? { a: 150, b: 175 } : {}} />
                  <Jo f={f} x={330} y={1720} expr={virus > 0.5 ? "shock" : "happy"} look={[1, -0.4]} />
                  {virus > 0 && (
                    <text x={540} y={830} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={64} fill="#FF4D6D" opacity={virus}>
                      ٧٢:٠٠:٠٠
                    </text>
                  )}
                </Cam>
              </Svg>
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* Joanna understands the trap */}
      <Shot from={s11} to={tagFrom}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <Cam fx={420} fy={1180} z={2.1 + ease(l, 0, 120) * 0.5}>
                <Lab f={f} alarm={0.5} />
                <Virus x={760} y={600} s={0.6} f={f} k={0.8} />
                <Jo f={f} x={420} y={1720} expr="worry" look={[0, 0]} armR={{ target: [60, -620] }} armsFront />
              </Cam>
            </Svg>
            <AbsoluteFill style={{ background: "radial-gradient(55% 40% at 50% 45%, transparent 40%, rgba(20,0,10,0.45) 100%)" }} />
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
        {(_f, l) => <EndCard l={l} next="الحلقة ٦: فراغ" question="مين «فراغ»؟ 👁️" />}
      </Shot>
      <Tag text="سرّ الغرفة 404 · الحلقة ٥" />

      <Sfx name="alarm" at={2} />
      <Sfx name="glitch" at={6} />
      <Sfx name="robot" at={30} />
      <Sfx name="holo" at={s3 + 4} />
      <Sfx name="whoosh" at={s4} />
      <Sfx name="tick" at={s5 + 2} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} name="beep" at={f5 + ((e5 - f5) * (i + 1)) / 4.99} gain={0.7} />
      ))}
      <Sfx name="correct" at={e6} />
      <Sfx name="reveal" at={s7} />
      <Sfx name="boot" at={z8 - 6} />
      <Sfx name="cheer" at={s9 + 4} gain={0.6} />
      <Sfx name="glitch" at={virusAt} />
      <Sfx name="alarm" at={virusAt + 16} />
      <Sfx name="sting" at={e11 - 10} />
      <Sfx name="tagline" at={tagFrom} />
      {T.audio.vo && T.scenes.map((s) => <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/r404e/vo/${s.id}.mp3`)} from={s.from + s.voFrom} volume={s.id.endsWith("-Z") ? 1.25 : 1} />)}
      {T.audio.vo && <Audio name="VO tagline" src={staticFile("audio/r404e/vo/TAG.mp3")} from={tagFrom + 10} />}
      {T.audio.music && <Audio src={staticFile("audio/r404e/music/theme.mp3")} loop volume={(f) => musicLevel(T, f)} />}
    </AbsoluteFill>
  );
};
