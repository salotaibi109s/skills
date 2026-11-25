import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import data from "../data/homec-timeline.json";
import mouthData from "../data/homec-mouth.json";
import type { TimelineData } from "../lib/timing";
import { musicLevel } from "../room404/kit";
import { Cam, ease, Flash, FONT, HomeEnd, LivingRoom, makeHome, OldBox, Shot, Storeroom, Svg, Tag } from "./kit";

const T = data as TimelineData;
const { line, at, endOf, Sfx, Jo, Faisal, Baba, Granny } = makeHome(T, mouthData as Record<string, number[]>, "homec");
const S = (id: string) => line(id).from;

/** Grandpa-era photo: little Dad, 6 candles, 3 fish, one missing tooth. hl: 0 none, 1 candles, 2 fish, 3 tooth. */
const OldPhoto: React.FC<{ f: number; hl: number; count: number }> = ({ f, hl, count }) => {
  const ring = (cx: number, cy: number, r: number, on: boolean) => on && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8414B" strokeWidth={10} strokeDasharray="26 14" transform={`rotate(${f * 2} ${cx} ${cy})`} />;
  return (
    <g transform="translate(540 900)">
      <rect x={-470} y={-560} width={940} height={1120} rx={18} fill="#F6EBD2" stroke="#8B5E34" strokeWidth={30} />
      <rect x={-420} y={-510} width={840} height={1020} fill="#E3CFA6" />
      {/* fish tank */}
      <rect x={120} y={-430} width={260} height={200} rx={14} fill="#A9D3D8" stroke="#6B5A44" strokeWidth={8} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${170 + i * 80 + Math.sin(f / 10 + i) * 10} ${-370 + i * 40})`}>
          <ellipse rx={26} ry={16} fill="#E8913A" />
          <path d="M22 0 l22 -14 v28Z" fill="#E8913A" />
        </g>
      ))}
      {ring(250, -330, 170, hl === 2)}
      {/* little dad */}
      <g transform="translate(-140 210)">
        <path d="M-150 300 q0 -220 150 -240 q150 20 150 240Z" fill="#F3F0E8" />
        <circle cx={0} cy={-170} r={150} fill="#D9A97A" />
        <path d="M-150 -200 q20 -130 150 -130 q130 0 150 130 q-60 -60 -150 -60 q-90 0 -150 60Z" fill="#2A1C14" />
        <circle cx={-55} cy={-185} r={16} fill="#2A1C14" />
        <circle cx={55} cy={-185} r={16} fill="#2A1C14" />
        <path d="M-70 -110 q70 70 140 0Z" fill="#7A2A2A" />
        <rect x={-34} y={-110} width={24} height={20} fill="#fff" />
        <rect x={12} y={-110} width={24} height={20} fill="#fff" />
        {ring(0, -100, 80, hl === 3)}
      </g>
      {/* cake with candles */}
      <g transform="translate(200 250)">
        <rect x={-170} y={-60} width={340} height={150} rx={18} fill="#F6C2D2" />
        <rect x={-170} y={-60} width={340} height={40} rx={18} fill="#FFF3E6" />
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`translate(${-125 + i * 50} -60)`} opacity={hl === 1 && i >= count ? 0.45 : 1}>
            <rect x={-8} y={-80} width={16} height={80} fill={["#5CF2FF", "#FFD23F", "#E8414B"][i % 3]} />
            <path d={`M0 -110 q14 18 0 28 q-14 -10 0 -28Z`} fill="#FF9F1C" transform={`scale(1 ${1 + Math.sin(f / 3 + i) * 0.1})`} />
            {hl === 1 && i < count && (
              <text x={0} y={-130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={64} fill="#C0392B">
                {"١٢٣٤٥٦"[i]}
              </text>
            )}
          </g>
        ))}
      </g>
      <text x={0} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#6B4523" opacity={0.7}>
        صورة قديمة
      </text>
    </g>
  );
};

const Letter: React.FC<{ k: number }> = ({ k }) => (
  <div dir="rtl" style={{ position: "absolute", left: 120, right: 120, top: 300, height: 1000, background: "#FFFDF3", borderRadius: 16, boxShadow: "0 30px 80px rgba(0,0,0,0.35)", transform: `rotate(-3deg) scale(${0.8 + 0.2 * k})`, opacity: k, backgroundImage: "repeating-linear-gradient(#FFFDF3 0 78px, #BFD7EA 78px 82px)", padding: 60, boxSizing: "border-box" }}>
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 66, color: "#2B4C9B", lineHeight: "80px" }}>
      يمّه…
      <br />
      لما أكبر بشتري لك
      <br />
      بيت فيه حديقة 🌳🏠
    </div>
    <svg width={500} height={300} viewBox="0 0 500 300" style={{ marginTop: 40 }}>
      <rect x={160} y={120} width={180} height={140} fill="none" stroke="#E8414B" strokeWidth={8} />
      <path d="M140 130 L250 40 L360 130" fill="none" stroke="#E8414B" strokeWidth={8} />
      <rect x={225} y={190} width={50} height={70} fill="none" stroke="#2B4C9B" strokeWidth={6} />
      {[60, 420].map((x) => (
        <g key={x}>
          <line x1={x} y1={260} x2={x} y2={180} stroke="#6B4523" strokeWidth={10} />
          <circle cx={x} cy={160} r={44} fill="none" stroke="#2E9E5B" strokeWidth={8} />
        </g>
      ))}
      <circle cx={450} cy={40} r={26} fill="none" stroke="#FFB400" strokeWidth={8} />
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: "#2B4C9B", textAlign: "left" }}>— ولدك، ٦ سنوات</div>
  </div>
);

export const HomeC: React.FC = () => {
  const s2 = S("I02-F");
  const s3 = S("I03-J");
  const s4 = S("I04-G");
  const s5 = S("I05-F");
  const s6 = S("I06-J");
  const j6 = at("I06-J");
  const click = at("I07-J") - 50;
  const s8 = S("I08-F");
  const s10 = S("I10-D");
  const s11 = S("I11-G");
  const s12 = S("I12-F");
  const s13 = S("I13-J");
  const s14 = S("I14-F");
  const endFrom = endOf("I14-F") + 36;
  const digits = (f: number) => {
    const done = ease(f, endOf("I06-J") - 30, endOf("I06-J"));
    if (done >= 1) return "٦٣١";
    return Array.from({ length: 3 }).map((_, i) => "٠١٢٣٤٥٦٧٨٩"[Math.floor(f / 2 + i * 3) % 10]).join("");
  };
  return (
    <AbsoluteFill style={{ background: "#3F2F24" }}>
      {/* HOOK: "don't open it!" */}
      <Shot from={0} to={s4}>
        {(f, l) => {
          const dream = f >= s2 && f < s3;
          return (
            <AbsoluteFill>
              <Svg>
                <Cam fx={540} fy={1200 + ease(l, 0, 40) * 100} z={2.4 - ease(l, 0, 40) * 1.0}>
                  <Storeroom f={f} />
                  <OldBox x={560} y={1560} s={0.7} />
                  <Faisal f={f} x={250} y={1760} expr={dream ? "laugh" : "shock"} look={[1, 0.3]} armR={{ target: [300, -560] }} tilt={dream ? Math.sin(f / 4) * 5 : 0} />
                  <Jo f={f} x={880} y={1760} expr={f >= s3 ? "smile" : "shock"} look={[-1, 0.3]} />
                  {dream &&
                    ["👑", "💰", "💎"].map((e, i) => (
                      <text key={e} x={360 + i * 180} y={1100 - ease(f, s2 + i * 12, s2 + i * 12 + 16) * 80} fontSize={110} textAnchor="middle" opacity={ease(f, s2 + i * 12, s2 + i * 12 + 16)}>
                        {e}
                      </text>
                    ))}
                </Cam>
              </Svg>
              {l < 5 && <Flash l={l} color="#FFE7A8" />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* asking Grandma */}
      <Shot from={s4} to={s5}>
        {(f) => (
          <Svg>
            <Cam fx={520} fy={1150} z={1.3}>
              <LivingRoom f={f} />
              <Granny f={f} x={800} y={1760} expr="smile" look={[-1, 0.4]} armL={{ target: [-300, -1100] }} />
              <OldBox x={420} y={1800} s={0.45} />
              <Faisal f={f} x={250} y={1760} expr="happy" look={[1, -0.4]} />
              <Jo f={f} x={520} y={1760} expr="smile" look={[1, -0.4]} />
            </Cam>
          </Svg>
        )}
      </Shot>
      {/* counting in the old photo */}
      <Shot from={s5} to={click}>
        {(f, l) => {
          const hl = f < s6 ? 1 : f < j6 + 50 ? 2 : f < endOf("I06-J") - 40 ? 3 : 0;
          const count = Math.min(6, Math.floor(l / 8) + 1);
          const lockK = ease(f, endOf("I06-J") - 50, endOf("I06-J") - 30);
          return (
            <AbsoluteFill>
              <Svg>
                <rect width={1080} height={1920} fill="#3A2414" />
                <g transform={`translate(540 900) scale(${1 - lockK * 0.15}) translate(-540 -900)`} opacity={1 - lockK * 0.6}>
                  <OldPhoto f={f} hl={hl} count={count} />
                </g>
                {lockK > 0 && <OldBox x={540} y={1300 + (1 - lockK) * 300} s={1.4} sign={false} digits={digits(f)} />}
              </Svg>
              {l < 5 && <Flash l={l} />}
            </AbsoluteFill>
          );
        }}
      </Shot>
      {/* click! the letter */}
      <Shot from={click} to={s8}>
        {(f, l) => (
          <AbsoluteFill>
            <Svg>
              <rect width={1080} height={1920} fill="#3A2414" />
              <OldBox x={540} y={1600} s={1.4} sign={false} open={ease(l, 0, 14)} />
            </Svg>
            <Letter k={ease(l, 22, 40)} />
            {l < 6 && <Flash l={l} color="#FFE7A8" />}
          </AbsoluteFill>
        )}
      </Shot>
      {/* "no gold?" — "worth more than gold"; Dad arrives */}
      <Shot from={s8} to={s12}>
        {(f) => {
          const dad = f >= s10 - 20;
          const garden = ease(f, at("I11-G") + 40, at("I11-G") + 70);
          return (
            <Svg>
              <Cam fx={dad ? 580 : 520} fy={1200} z={dad ? 1.18 : 1.4}>
                <LivingRoom f={f} />
                <g opacity={garden}>
                  <rect x={652} y={232} width={396} height={496} fill="#9BE07A" />
                  <rect x={652} y={232} width={396} height={260} fill="#BFE6FF" />
                  {[740, 960].map((x) => (
                    <g key={x}>
                      <rect x={x - 10} y={480} width={20} height={120} fill="#8B5E34" />
                      <circle cx={x} cy={450} r={70} fill="#2E9E5B" />
                    </g>
                  ))}
                  {[0, 1, 2, 3].map((i) => <circle key={i} cx={700 + i * 90} cy={660} r={14} fill={["#FF6FA8", "#FFD23F", "#E8414B", "#fff"][i]} />)}
                </g>
                <Granny f={f} x={760} y={1760} expr={f >= s11 ? "happy" : "smile"} look={dad && f < s11 ? [1, -0.2] : [-1, 0.4]} armL={{ target: [-40, -760] }} armsFront={f < s10} />
                <rect x={760 - 0.6 * 80} y={1760 - 0.6 * 820} width={60} height={70} fill="#FFFDF3" opacity={f < s10 ? 1 : 0} />
                {dad && <Baba f={f} x={980} y={1780} s={0.64} expr={f >= s11 ? "happy" : "worry"} look={[-1, 0.2]} armL={{ target: [-300, -1000] }} />}
                <Faisal f={f} x={250} y={1760} expr={f < s10 - 50 && f < S("I09-G") ? "worry" : "happy"} look={[1, -0.3]} armR={{ target: [160, -520] }} />
                <g transform={`translate(${250 + 0.42 * 170} ${1760 - 0.42 * 520})`}>
                  <rect x={-34} y={-16} width={68} height={28} rx={8} fill="#E8414B" />
                  <circle cx={-20} cy={14} r={9} fill="#222" />
                  <circle cx={20} cy={14} r={9} fill="#222" />
                </g>
                <Jo f={f} x={480} y={1760} expr="happy" look={[1, -0.4]} />
                {f >= s11 && [0, 1, 2].map((i) => <path key={i} d="M0 30 C-45 0 -25 -45 0 -20 C25 -45 45 0 0 30Z" fill="#FF6FA8" transform={`translate(${800 + i * 80} ${1000 - ((f * 2 + i * 40) % 140)})`} opacity={0.8} />)}
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      {/* Faisal's own promise */}
      <Shot from={s12} to={endFrom}>
        {(f) => {
          const ice = f >= s14 + 20;
          return (
            <Svg>
              <Cam fx={f >= s14 ? 380 : 480} fy={1250} z={f >= s14 ? 1.7 : 1.4}>
                <LivingRoom f={f} />
                <Granny f={f} x={820} y={1760} expr={ice ? "laugh" : "smile"} look={[-1, 0.4]} />
                <Faisal f={f} x={360} y={1760} expr={ice ? "proud" : "happy"} look={[1, -0.3]} armR={{ target: [260, -540] }} />
                <g transform={`translate(${360 + 0.42 * 300} ${1760 - 0.42 * 480}) rotate(6)`}>
                  <rect x={-70} y={-90} width={140} height={180} fill="#FFFDF3" stroke="#BFD7EA" strokeWidth={4} />
                  {ice ? <text x={0} y={30} fontSize={90} textAnchor="middle">🍦</text> : f >= s13 ? <text x={0} y={30} fontSize={80} textAnchor="middle">🏠</text> : <path d="M-40 -40 h80 M-40 0 h60 M-40 40 h70" stroke="#2B4C9B" strokeWidth={6} />}
                </g>
                <Jo f={f} x={660} y={1760} expr={ice ? "laugh" : f >= s13 ? "sly" : "smile"} look={[-1, -0.3]} />
              </Cam>
            </Svg>
          );
        }}
      </Shot>
      <Shot from={endFrom} to={1950}>
        {(_f, l) => <HomeEnd l={l} value="برّ الوالدين… وعد يكبر معك 🤍" next="قريباً!" />}
      </Shot>
      <Tag text="حكايات بيتنا · الحلقة ٣" />

      <Sfx name="creak" at={2} />
      <Sfx name="dust" at={10} />
      <Sfx name="sparkle" at={s2 + 6} />
      <Sfx name="steps" at={s4 - 10} />
      <Sfx name="magnify" at={s5} />
      <Sfx name="pop" at={s6 + 10} />
      <Sfx name="tick" at={endOf("I06-J") - 50} />
      <Sfx name="click" at={click} />
      <Sfx name="sparkle" at={click + 4} />
      <Sfx name="aww" at={S("I09-G") + 20} gain={0.6} />
      <Sfx name="door" at={s10 - 30} />
      <Sfx name="aww" at={s11 + 60} gain={0.5} />
      <Sfx name="write" at={s12} />
      <Sfx name="laugh" at={endOf("I14-F")} gain={0.6} />
      <Sfx name="jingle" at={endFrom} />
      {T.audio.vo && T.scenes.map((s) => <Audio key={s.id} name={`VO ${s.id}`} src={staticFile(`audio/homec/vo/${s.id}.mp3`)} from={s.from + s.voFrom} />)}
      {T.audio.music && <Audio src={staticFile("audio/homec/music/theme.mp3")} loop volume={(f) => musicLevel(T, f)} />}
    </AbsoluteFill>
  );
};
