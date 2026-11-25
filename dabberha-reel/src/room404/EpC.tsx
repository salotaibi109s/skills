import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import data from "../data/r404c-timeline.json";
import mouthData from "../data/r404c-mouth.json";
import type { TimelineData } from "../lib/timing";
import { db } from "../theme";
import { Cam, Countdown, ease, EndCard, Flash, FONT, Lab, makeEp, Shot, Svg, Tag, TaglineCard, Zero } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, talkOf, Sfx, Jo, Faisal } = makeEp(T, mouthData as Record<string, number[]>, "r404c");

/** Wall safe with a three-digit display; open 0..1 swings the door. */
const Safe: React.FC<{ x: number; y: number; s: number; digits?: string; open?: number; glow?: number }> = ({ x, y, s, digits = "___", open = 0, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-260} width={520} height={520} rx={30} fill="#1B2E38" stroke="#5CF2FF" strokeWidth={6} />
    <rect x={-220} y={-220} width={440} height={440} rx={20} fill="#0A1620" />
    {glow > 0 && <circle cx={0} cy={0} r={180 * glow} fill="#FFF3C4" opacity={0.5 * glow} />}
    <g transform={`translate(-220 0) scale(${1 - open * 0.92} 1) translate(220 0)`}>
      <rect x={-220} y={-220} width={440} height={440} rx={20} fill="#2C4A58" stroke="#5CF2FF" strokeWidth={4} />
      <rect x={-150} y={-150} width={300} height={110} rx={14} fill="#06121A" stroke="#5CF2FF" strokeWidth={4} />
      <text x={0} y={-68} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={80} fill="#8EF7A0" letterSpacing={18}>
        {digits}
      </text>
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={-120 + (i % 3) * 90} y={20 + Math.floor(i / 3) * 62} width={70} height={48} rx={10} fill="#14303A" stroke="#5CF2FF" strokeWidth={3} />
      ))}
    </g>
  </g>
);

/** The device found in the safe: glowing cube with the channel emblem. */
const Device: React.FC<{ x: number; y: number; s: number; f: number; k: number }> = ({ x, y, s, f, k }) => (
  <g transform={`translate(${x} ${y - Math.sin(f / 10) * 10}) scale(${s * k})`} opacity={k}>
    <circle r={170} fill="#5CF2FF" opacity={0.15 + 0.1 * Math.sin(f / 6)} />
    <rect x={-110} y={-110} width={220} height={220} rx={36} fill="#0E2A33" stroke="#5CF2FF" strokeWidth={8} />
    {/* emblem: light bulb with a brain curve */}
    <circle cx={0} cy={-20} r={56} fill="#FFD23F" />
    <rect x={-26} y={30} width={52} height={30} rx={8} fill="#9AA6B2" />
    <path d="M-26 -30 q12 -26 26 -4 q14 -22 26 4 q10 20 -10 30 q-16 8 -16 -10 q0 18 -16 10 q-20 -10 -10 -30Z" fill="none" stroke="#E0558F" strokeWidth={6} />
    <text x={0} y={100} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#5CF2FF">
      ابنِ ذكاءك
    </text>
  </g>
);

export const Room404C: React.FC = () => {
  const s2 = line("C02-J").from;
  const s3 = line("C03-Z").from;
  const s4 = line("C04-Z").from;
  const s5 = line("C05-F").from;
  const f5 = at("C05-F");
  const e5 = endOf("C05-F");
  const s6 = line("C06-J").from;
  const j6 = at("C06-J");
  const e6 = endOf("C06-J");
  const s7 = line("C07-F").from;
  const f7 = at("C07-F");
  const s8 = line("C08-Z").from;
  const s9 = line("C09-J").from;
  const s10 = line("C10-Z").from;
  const e10 = endOf("C10-Z");
  const qFrom = e10 + 12;
  const tagFrom = qFrom + 60;
  const endFrom = tagFrom + 120;
  const span5 = e5 - f5;
  const d1 = f5 + span5 * 0.35;
  const d2 = f5 + span5 * 0.1;
  const d3 = f5 + span5 * 0.85;
  const openAt = e6 + 4;
  const holoAt = f7 - 30;
  return (
    <AbsoluteFill style={{ background: "#0E2A33" }}>
      {/* hook: whispering behind the bench, Zero listening */}
      <Shot from={0} to={s4}>
        {(f) => {
          const zeroTurn = f >= s3;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={zeroTurn ? 700 : 420} fy={zeroTurn ? 1120 : 1260} z={zeroTurn ? 1.7 : 2.0}>
                  <Lab f={f} dim={0.45} />
                  <Zero x={820} y={1460} s={0.62} f={f} mood={zeroTurn ? "smug" : "dim"} talk={talkOf("Z", f)} look={zeroTurn ? -0.8 : 0.6} />
                  <Faisal f={f} x={300} y={1720} expr="worry" look={[0.8, 0]} armsFront armL={{ target: [-130, -560] }} />
                  <Jo f={f} x={500} y={1720} expr={f >= s2 ? "sly" : "worry"} look={[-0.6, 0]} armsFront armR={{ target: [-60, -690] }} />
                  <rect x={180} y={1560} width={420} height={40} rx={10} fill="#3A5360" />
                </Cam>
              </Svg>
              {zeroTurn && f < s3 + 6 && <Flash l={f - s3} color="#5CF2FF" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* open the safe */}
      <Shot from={s4} to={s5}>
        {(f, l) => (
          <Svg>
            <Cam fx={interpolate(ease(l, 0, 40), [0, 1], [700, 540])} fy={interpolate(ease(l, 0, 40), [0, 1], [1100, 860])} z={interpolate(ease(l, 0, 40), [0, 1], [1.5, 1.3])}>
              <Lab f={f} dim={0.2} />
              <Safe x={540} y={720} s={0.8} />
              <Zero x={860} y={1460} s={0.62} f={f} mood="neutral" talk={talkOf("Z", f)} look={-0.8} arm={0.7} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* puzzle + think time + Faisal works it out */}
      <Shot from={s5} to={s6}>
        {(f, l) => {
          const think = f < f5 - 4;
          const digits = `${f >= d1 ? "٢" : "_"}${f >= d2 ? "٤" : "_"}${f >= d3 ? "٦" : "_"}`;
          return (
            <AbsoluteFill style={{ background: "#0E2A33" }}>
              <Svg>
                <Safe x={540} y={720} s={0.75} digits={digits} />
                {!think && <Faisal f={f} x={540} y={2080} s={0.6} expr={f >= d3 ? "happy" : "smile"} look={[0, -1]} armR={{ target: [140, -800 + Math.sin(f / 5) * 20] }} />}
              </Svg>
              <div dir="rtl" style={{ position: "absolute", top: 1060, left: 100, right: 150, padding: "18px 26px", borderRadius: 28, background: "rgba(14,42,51,0.92)", border: "3px solid #5CF2FF", fontFamily: FONT, fontWeight: 700, fontSize: 44, lineHeight: 1.6, color: "#fff" }}>
                <div style={{ color: "#5CF2FF", fontWeight: 800 }}>الرقم السري ٣ خانات:</div>
                <div>• الخانة الثانية = ٤</div>
                <div>• الأولى = نصّ الثانية</div>
                <div>• الثالثة = مجموع الأولى والثانية</div>
              </div>
              {think && <Countdown l={l} total={f5 - 4 - s5} top={330} question="تقدر تحلّها قبل فيصل؟" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* Joanna enters the code, the safe opens */}
      <Shot from={s6} to={s8}>
        {(f) => {
          const open = ease(f, openAt, openAt + 24);
          const dev = ease(f, openAt + 10, openAt + 40);
          const holo = ease(f, holoAt, holoAt + 20);
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={interpolate(open, [0, 1], [1000, 900])} z={1.25}>
                  <Lab f={f} />
                  <Safe x={540} y={720} s={0.8} digits={f >= j6 ? "٢٤٦" : "___"} open={open} glow={open} />
                  <Device x={540} y={720} s={0.8} f={f} k={dev} />
                  <Jo f={f} x={300} y={1700} expr={open > 0 ? "shock" : "proud"} look={[0.6, -1]} armR={f < openAt ? { target: [330, -860 + Math.sin(f / 3) * 20] } : { a: 150, b: 175 }} />
                  <Faisal f={f} x={770} y={1720} expr={f >= s7 ? "shock" : open > 0 ? "happy" : "smile"} look={[-0.4, -1]} armL={open > 0 ? { a: 150, b: 175 } : {}} armR={open > 0 ? { a: 150, b: 175 } : {}} />
                </Cam>
              </Svg>
              {holo > 0 && (
                <div dir="rtl" style={{ position: "absolute", top: 300, left: 150, right: 190, textAlign: "center", padding: "14px 10px", borderRadius: 26, background: "rgba(92,242,255,0.15)", border: "4px solid #8EF7A0", fontFamily: FONT, fontWeight: 800, fontSize: 60, color: "#8EF7A0", opacity: holo, scale: String(0.6 + 0.4 * holo), boxShadow: "0 0 40px rgba(142,247,160,0.4)" }}>
                  الاختبار ١ من ١٠٠ ✓
                </div>
              )}
              {f >= openAt && f < openAt + 8 && <Flash l={f - openAt} color="#FFF3C4" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* Zero's confession and the next mystery */}
      <Shot from={s8} to={qFrom}>
        {(f, l) => {
          const jo = f >= s9 && f < s10;
          const last = f >= s10;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={jo ? 380 : 720} fy={last ? 1220 : 1150} z={last ? 2.4 : jo ? 1.9 : 1.6}>
                  <Lab f={f} dim={last ? 0.4 : 0} />
                  <Device x={560} y={1040} s={0.5} f={f} k={1} />
                  <Zero x={820} y={1460} s={0.62} f={f} mood={last ? "smug" : "happy"} talk={talkOf("Z", f)} look={-0.7} arm={last ? 0 : 0.5 + 0.3 * Math.sin(l / 6)} />
                  <Faisal f={f} x={230} y={1720} expr={last ? "worry" : "happy"} look={[1, -0.3]} />
                  <Jo f={f} x={420} y={1720} expr={jo ? "sly" : last ? "shock" : "happy"} look={[1, -0.4]} armR={jo ? { target: [200, -700] } : {}} />
                </Cam>
              </Svg>
              {last && <AbsoluteFill style={{ background: "radial-gradient(55% 40% at 55% 42%, transparent 35%, rgba(5,10,20,0.5) 100%)" }} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* question + tagline */}
      <Shot from={qFrom} to={endFrom}>
        {(f) => (
          <AbsoluteFill style={{ background: "#071A22" }}>
            <Svg>
              <Zero x={540} y={1250} s={0.9} f={f} mood="smug" look={0} />
            </Svg>
            <div dir="rtl" style={{ position: "absolute", top: 260, left: 90, right: 140, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 80, color: "#FFD23F", lineHeight: 1.3 }}>
              هل تثق في زيرو؟ 🤖
              <div style={{ fontSize: 50, color: "#BFF8FF", fontWeight: 700 }}>باقي ٩٩ اختبار…</div>
            </div>
            {f >= tagFrom && <TaglineCard l={f - tagFrom} />}
          </AbsoluteFill>
        )}
      </Shot>
      <Shot from={endFrom} to={1800}>
        {(_f, l) => <EndCard l={l} next="المغامرة الأكبر… قريباً!" />}
      </Shot>
      <Tag text="سرّ الغرفة 404 · الحلقة ٣" />

      <Sfx name="lab" at={0} />
      <Sfx name="robot" at={s3 + 2} />
      <Sfx name="whoosh" at={s4} />
      <Sfx name="tick" at={s5 + 2} />
      <Sfx name="beep" at={d1} />
      <Sfx name="beep" at={d2} />
      <Sfx name="beep" at={d3} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} name="beep" at={j6 + 10 + i * 12} gain={0.8} />
      ))}
      <Sfx name="correct" at={e6 - 4} />
      <Sfx name="safe" at={openAt} />
      <Sfx name="reveal" at={openAt + 12} />
      <Sfx name="holo" at={holoAt} />
      <Sfx name="cheer" at={s8 - 10} gain={0.5} />
      <Sfx name="glitch" at={s10 + 4} gain={0.6} />
      <Sfx name="sting" at={e10} />
      <Sfx name="tagline" at={tagFrom} />
      {T.scenes.map((s) => (
        <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/r404c/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />
      ))}
      <Audio name="VO tagline" src={staticFile("audio/r404c/vo/TAG.mp3")} from={tagFrom + 10} />
      <Audio
        src={staticFile("audio/r404c/music/theme.mp3")}
        volume={(f) => {
          const inVoice = T.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 6);
          const fd = interpolate(f, [0, 6, 1770, 1800], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (inVoice ? db(-22) : db(-15)) * fd;
        }}
      />
    </AbsoluteFill>
  );
};
