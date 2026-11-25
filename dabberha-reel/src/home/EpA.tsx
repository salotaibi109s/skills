import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import data from "../data/homea-timeline.json";
import mouthData from "../data/homea-mouth.json";
import type { TimelineData } from "../lib/timing";
import { musicLevel } from "../room404/kit";
import { Cam, ease, Flash, FONT, HomeEnd, LivingRoom, makeHome, Shot, Sofa, SofaBack, Svg, Tag } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, Sfx, Jo, Faisal, Baba } = makeHome(T, mouthData as Record<string, number[]>, "homea");

/** Generic family-chat phone screen (no real app branding). */
const Phone: React.FC<{ sending: number; cancelled: boolean; l: number }> = ({ sending, cancelled, l }) => {
  const k = Math.min(1, l / 10);
  return (
    <div dir="rtl" style={{ position: "absolute", left: 230, right: 270, top: 330, height: 980, borderRadius: 60, background: "#111", padding: 18, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", scale: String(0.8 + 0.2 * k), opacity: k }}>
      <div style={{ height: "100%", borderRadius: 44, background: "#F2EDE4", overflow: "hidden", fontFamily: FONT, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#2E7D7A", color: "#fff", padding: "26px 24px", fontWeight: 800, fontSize: 36 }}>
          قروب العائلة 👨‍👩‍👧‍👦
          <div style={{ fontSize: 24, fontWeight: 500, opacity: 0.85 }}>٢٤ عضو</div>
        </div>
        <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ alignSelf: "flex-start", background: "#fff", borderRadius: 18, padding: "10px 16px", fontSize: 26 }}>عمّو: صباح الخير ☀️</div>
          <div style={{ alignSelf: "flex-start", background: "#fff", borderRadius: 18, padding: "10px 16px", fontSize: 26 }}>تيتة: الله يصبحكم بالخير 🌹</div>
          <div style={{ marginTop: "auto", alignSelf: "flex-end", width: 300, borderRadius: 20, background: "#DDF3E6", padding: 10, opacity: cancelled ? 0.35 : 1 }}>
            <div style={{ height: 220, borderRadius: 14, background: "#2E7D7A", display: "grid", placeItems: "center", fontSize: 90 }}>😴</div>
            <div style={{ fontSize: 24, padding: "8px 4px" }}>{cancelled ? "تم إلغاء الإرسال ✓" : sending > 0 ? "جاري الإرسال…" : "📷 صورة"}</div>
            {sending > 0 && !cancelled && (
              <div style={{ height: 10, borderRadius: 5, background: "#C9D8CF", overflow: "hidden" }}>
                <div style={{ width: `${sending * 100}%`, height: "100%", background: "#E8414B" }} />
              </div>
            )}
          </div>
        </div>
        <div style={{ padding: 18, display: "flex", justifyContent: "flex-start" }}>
          <div style={{ width: 86, height: 86, borderRadius: 43, background: cancelled ? "#9AA6B2" : "#2E7D7A", display: "grid", placeItems: "center", color: "#fff", fontSize: 44 }}>➤</div>
        </div>
      </div>
    </div>
  );
};

export const HomeA: React.FC = () => {
  const s2 = line("G02-J").from;
  const s3 = line("G03-F").from;
  const e3 = endOf("G03-F");
  const j4 = at("G04-J");
  const s5 = line("G05-J").from;
  const s6 = line("G06-F").from;
  const s8 = line("G08-D").from;
  const s9 = line("G09-F").from;
  const s10 = line("G10-D").from;
  const s11 = line("G11-D").from;
  const d11 = at("G11-D");
  const e11 = endOf("G11-D");
  const endFrom = e11 + 30;
  const selfie = d11 + 50;
  const sleepDad = (f: number, extra: Partial<React.ComponentProps<typeof Baba>> = {}) => <Baba f={f} x={540} y={1460} expr="shock" blink={1} tilt={-14} talk={0} {...extra} />;
  return (
    <AbsoluteFill style={{ background: "#F6E6D0" }}>
      {/* HOOK: Dad asleep, mouth open; Faisal sneaks up with the phone */}
      <Shot from={0} to={s3}>
        {(f, l) => (
          <Svg>
            <Cam fx={f >= s2 ? 380 : 520} fy={1180} z={f >= s2 ? 1.6 : 1.3}>
              <LivingRoom f={f} />
              <SofaBack x={540} y={1460} s={0.9} />
              {sleepDad(f)}
              <Sofa x={540} y={1460} s={0.9} />
              {[0, 1, 2].map((i) => (
                <text key={i} x={660 + i * 40 + Math.sin(f / 10 + i) * 10} y={560 - ((f * 2 + i * 40) % 140)} fontFamily={FONT} fontWeight={800} fontSize={50 - i * 8} fill="#2E7D7A" opacity={0.8}>
                  z
                </text>
              ))}
              <Faisal f={f} x={260} y={1720} expr="laugh" look={[1, -0.6]} armR={{ target: [200, -700] }} tilt={Math.sin(l / 4) * 4} />
              <rect x={260 + 0.42 * 200 - 30} y={1720 - 0.42 * 700 - 50} width={60} height={100} rx={10} fill="#222" />
              <Jo f={f} x={120} y={1720} expr={f >= s2 ? "worry" : "smile"} look={[1, -0.3]} armR={f >= s2 ? { target: [260, -560] } : {}} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* the phone: family group, sending… cancelled */}
      <Shot from={s3} to={s5}>
        {(f, l) => {
          const sending = f >= e3 ? ease(f, e3, j4 + 4) * 0.92 : 0;
          const cancelled = f >= j4 + 2;
          const run = f >= e3 + 10 && !cancelled;
          return (
            <AbsoluteFill style={{ background: "#2A1E14" }}>
              <Svg>
                <Cam fx={540} fy={1200} z={1.1}>
                  <LivingRoom f={f} />
                </Cam>
                <rect x={0} y={0} width={1080} height={1920} fill="#000" opacity={0.45} />
              </Svg>
              <Phone sending={sending} cancelled={cancelled} l={l} />
              {run && (
                <div dir="rtl" style={{ position: "absolute", top: 1360, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, color: "#FFD23F" }}>
                  {Math.max(1, 3 - Math.floor(((f - e3 - 10) / (j4 - e3 - 10)) * 3))}…
                </div>
              )}
              {cancelled && f < j4 + 10 && <Flash l={f - j4 - 2} color="#8EF7A0" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* perspective: what if it were you? */}
      <Shot from={s5} to={s8}>
        {(f) => {
          const bubble = f < s6;
          return (
            <Svg>
              <Cam fx={300} fy={1180} z={1.8}>
                <LivingRoom f={f} />
                <Jo f={f} x={160} y={1720} expr="sly" look={[1, 0]} armR={{ target: [200, -620] }} />
                <Faisal f={f} x={430} y={1720} expr={bubble ? "worry" : "shock"} look={[-1, 0]} armL={bubble ? {} : { target: [-80, -560] }} armR={bubble ? {} : { target: [80, -560] }} armsFront={!bubble} sweat={bubble ? 0 : 1} />
                {bubble && (
                  <g transform="translate(330 860)">
                    <ellipse rx={170} ry={120} fill="#fff" stroke="#6B4523" strokeWidth={6} />
                    <circle cx={-160} cy={150} r={20} fill="#fff" stroke="#6B4523" strokeWidth={5} />
                    <circle cx={0} cy={0} r={70} fill="#F2C29A" />
                    <path d="M-30 -10 q10 8 20 0 M10 -10 q10 8 20 0" stroke="#2A1A10" strokeWidth={6} fill="none" />
                    <ellipse cx={0} cy={30} rx={18} ry={14} fill="#7A2230" />
                    <path d="M14 36 q6 30 -2 50" stroke="#7FD3FF" strokeWidth={8} fill="none" strokeLinecap="round" />
                    <text x={90} y={-40} fontSize={40} fill="#2E7D7A" fontWeight={800}>z</text>
                  </g>
                )}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* Dad wakes up; Faisal confesses */}
      <Shot from={s8} to={s11}>
        {(f, l) => {
          const awake = ease(l, 0, 20);
          const pat = f >= s10;
          return (
            <Svg>
              <Cam fx={pat ? 480 : 520} fy={1150} z={pat ? 1.55 : 1.35}>
                <LivingRoom f={f} />
                <SofaBack x={540} y={1460} s={0.9} />
                <Baba f={f} x={540} y={1460} expr={pat ? "happy" : f >= s9 ? "smile" : "worry"} tilt={-14 + awake * 14} look={[-0.6, 0.3]} armL={pat ? { target: [-300, -560] } : { a: 120 * (1 - awake) + 20, b: 150 * (1 - awake) + 40 }} armR={{ a: 20, b: 40 }} />
                <Sofa x={540} y={1460} s={0.9} />
                <Faisal f={f} x={330} y={1720} expr={f >= s9 && !pat ? "worry" : pat ? "happy" : "shock"} look={[1, -0.6]} tilt={f >= s9 && !pat ? 8 : 0} />
                <Jo f={f} x={150} y={1720} expr={pat ? "happy" : "smile"} look={[1, -0.4]} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* Dad's revenge selfie */}
      <Shot from={s11} to={endFrom}>
        {(f) => {
          const shot = f >= selfie;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={460} fy={1100} z={1.6}>
                  <LivingRoom f={f} />
                  <SofaBack x={540} y={1460} s={0.9} />
                  <Baba f={f} x={540} y={1460} expr={shot ? "laugh" : "sly"} look={[-0.3, -0.2]} armR={{ target: [240, -1300] }} armL={{ target: [-300, -560] }} tilt={-6} />
                  <Sofa x={540} y={1460} s={0.9} />
                  <rect x={540 + 0.62 * 240 - 40} y={1460 - 0.62 * 1300 - 60} width={80} height={130} rx={12} fill="#222" />
                  <Faisal f={f} x={360} y={1720} expr={shot ? "laugh" : "shock"} look={[0.4, -0.6]} armL={{ target: [-80, -620] }} armsFront />
                  <Jo f={f} x={160} y={1720} expr="laugh" look={[1, -0.4]} tilt={Math.sin(f / 4) * 4} />
                </Cam>
              </Svg>
              {shot && f < selfie + 8 && <Flash l={f - selfie} />}
              {shot && (
                <div style={{ position: "absolute", top: 300, left: 300, right: 340, height: 380, borderRadius: 24, border: "10px solid #fff", background: "#2E7D7A", boxShadow: "0 20px 50px rgba(0,0,0,0.35)", rotate: "-6deg", display: "grid", placeItems: "center", fontSize: 120, opacity: ease(f, selfie + 4, selfie + 14) }}>
                  🤳😂
                </div>
              )}
            </AbsoluteFill>
          );
        }}
      </Shot>
      <Shot from={endFrom} to={1800}>
        {(_f, l) => <HomeEnd l={l} value="خصوصية غيرك… أمانة 🤍" next="عندنا أكبر!" />}
      </Shot>
      <Tag text="حكايات بيتنا · الحلقة ١" />

      <Sfx name="snore" at={0} />
      <Sfx name="giggle" at={20} gain={0.6} />
      <Sfx name="camera" at={s2 - 10} />
      <Sfx name="pop" at={s3 + 2} />
      <Sfx name="send" at={e3} />
      <Sfx name="tick" at={e3 + 10} />
      <Sfx name="whoosh" at={j4 - 10} />
      <Sfx name="scratch" at={j4} gain={0.7} />
      <Sfx name="gasp" at={s6} gain={0.6} />
      <Sfx name="boing" at={s8 + 4} gain={0.6} />
      <Sfx name="aww" at={s10 + 10} gain={0.6} />
      <Sfx name="camera" at={selfie} />
      <Sfx name="laugh" at={selfie + 8} />
      <Sfx name="jingle" at={endFrom} />
      {T.audio.vo && T.scenes.map((s) => <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/homea/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />)}
      {T.audio.music && <Audio src={staticFile("audio/homea/music/theme.mp3")} loop volume={(f) => musicLevel(T, f)} />}
    </AbsoluteFill>
  );
};
