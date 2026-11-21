import { loadFont as loadAlexandria } from "@remotion/google-fonts/Alexandria";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSansArabic";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import v1 from "../../public/audio/shadwi/vo/V1.json";
import v2 from "../../public/audio/shadwi/vo/V2.json";
import v3 from "../../public/audio/shadwi/vo/V3.json";
import v4 from "../../public/audio/shadwi/vo/V4.json";
import v5 from "../../public/audio/shadwi/vo/V5.json";
import v6 from "../../public/audio/shadwi/vo/V6.json";
import { db } from "../theme";

/**
 * «شدوي» — 60 s vertical ad for a Saudi specialty coffee house. Real licensed footage (Pexels), cropped to 9:16,
 * graded to the brand's green and gold; Arabic text, captions, voice (Nasser), score and sound effects composed here.
 * Safe areas: nothing in the top 150 px, the bottom 350 px or the right 120 px.
 */
const TITLE = loadAlexandria("normal", { weights: ["300", "500", "700"], subsets: ["arabic"] }).fontFamily;
const SANS = loadPlex("normal", { weights: ["500", "700"], subsets: ["arabic"] }).fontFamily;
const B = { green: "#224444", cream: "#F5EFE4", gold: "#C9A268" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (s: number) => Math.round(s * 30);

type Shot = { id: string; from: number; to: number; fadeIn?: number; zoom?: [number, number] };
const SHOTS: Shot[] = [
  { id: "S02", from: 48, to: 90 },
  { id: "S03", from: 90, to: 198, fadeIn: 10 },
  { id: "S04", from: 198, to: 288, fadeIn: 14 },
  { id: "S05", from: 288, to: 378, fadeIn: 10 },
  { id: "S06", from: 378, to: 438 },
  { id: "S07", from: 438, to: 510, fadeIn: 12 },
  { id: "S08", from: 510, to: 576 },
  { id: "S09", from: 576, to: 648 },
  { id: "S10", from: 648, to: 732 },
  { id: "S12", from: 732, to: 798 },
  { id: "S14", from: 798, to: 894 },
  { id: "S15", from: 894, to: 990 },
  { id: "S13", from: 990, to: 1050 },
  { id: "P1", from: 1050, to: 1158, fadeIn: 8 },
  { id: "P2", from: 1158, to: 1248, fadeIn: 8 },
  { id: "P3", from: 1248, to: 1350, fadeIn: 10 },
  { id: "S19", from: 1350, to: 1434, fadeIn: 14 },
  { id: "S20", from: 1434, to: 1560, fadeIn: 8 },
];

const Clip: React.FC<{ shot: Shot }> = ({ shot }) => {
  const f = useCurrentFrame();
  const len = shot.to - shot.from;
  const z = interpolate(f, [0, len], shot.zoom ?? [1.0, 1.07], clamp);
  const o = shot.fadeIn ? interpolate(f, [0, shot.fadeIn], [0, 1], clamp) : 1;
  return (
    <AbsoluteFill style={{ opacity: o, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(`shadwi/${shot.id}.mp4`)} muted style={{ width: 1080, height: 1920, scale: String(z) }} />
    </AbsoluteFill>
  );
};

/** Hook: the cheetah's eye at dawn, pushing in, then an iris opens onto a single roasted bean. */
const Eye: React.FC = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 52], [1.15, 2.6], { ...clamp, easing: (x) => x * x });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img src={staticFile("shadwi/eye.jpg")} style={{ position: "absolute", width: 1080, height: 1921, scale: String(z), transformOrigin: "35% 33%", filter: "brightness(0.92)" }} />
    </AbsoluteFill>
  );
};

const Grade: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ background: B.green, opacity: 0.22, mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(34,68,68,0.35), transparent 35%, transparent 65%, rgba(20,40,40,0.55))", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 70% 20%, rgba(201,162,104,0.28), transparent 70%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(90% 75% at 50% 45%, transparent 55%, rgba(8,16,16,0.7) 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
        <svg width="1080" height="1920">
          <filter id="sg">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12} />
          </filter>
          <rect width="1080" height="1920" filter="url(#sg)" />
        </svg>
      </AbsoluteFill>
    </>
  );
};

/** A short headline, centred in the safe area, drifting up softly. */
const Line: React.FC<{ text: string; from: number; to: number; top: number; size?: number; color?: string; weight?: number }> = ({ text, from, to, top, size = 92, color = B.cream, weight = 500 }) => {
  const f = useCurrentFrame();
  if (f < from - 2 || f > to + 2) return null;
  const o = interpolate(f, [from, from + 12, to - 12, to], [0, 1, 1, 0], clamp);
  const y = interpolate(f, [from, to], [14, -14], clamp);
  return (
    <div dir="rtl" style={{ position: "absolute", top, left: 80, right: 120, textAlign: "center", fontFamily: TITLE, fontWeight: weight, fontSize: size, color, opacity: o, translate: `0px ${y}px`, letterSpacing: 0.5, textShadow: "0 4px 30px rgba(0,0,0,0.55)", filter: `blur(${(1 - o) * 6}px)` }}>
      {text}
    </div>
  );
};

type Vo = { words: { text: string; raw?: string; start: number; end: number }[]; duration: number };
const VOS: { at: number; d: Vo; id: string }[] = [
  { id: "V1", at: S(3.4), d: v1 as Vo },
  { id: "V2", at: S(7.2), d: v2 as Vo },
  { id: "V3", at: S(15.2), d: v3 as Vo },
  { id: "V4", at: S(29.6), d: v4 as Vo },
  { id: "V5", at: S(37.4), d: v5 as Vo },
  { id: "V6", at: S(51.0), d: v6 as Vo },
];

/** Burned-in captions for the voice, a line at a time; the spoken word turns gold. */
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  // the last line is shown as the on-screen tagline in the finale, so it is not captioned twice
  const cur = VOS.filter((v) => v.id !== "V6").find((v) => f >= v.at - 4 && f <= v.at + S(v.d.duration) + 10);
  if (!cur) return null;
  const t = (f - cur.at) / 30;
  const o = interpolate(f, [cur.at - 4, cur.at + 4, cur.at + S(cur.d.duration) + 2, cur.at + S(cur.d.duration) + 10], [0, 1, 1, 0], clamp);
  return (
    <div dir="rtl" style={{ position: "absolute", left: 80, right: 120, top: 1420, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.3em", fontFamily: SANS, fontWeight: 700, fontSize: 50, lineHeight: 1.45, opacity: o }}>
      {cur.d.words.map((w, i) => {
        const on = t >= w.start - 0.05;
        const next = cur.d.words[i + 1];
        const active = on && (!next || t < next.start - 0.05);
        return (
          <span key={i} style={{ color: active ? B.gold : B.cream, opacity: on ? 1 : 0.35, textShadow: "0 2px 16px rgba(0,0,0,0.85)" }}>
            {(w.raw ?? w.text).replace(/[«»]/g, "")}
          </span>
        );
      })}
    </div>
  );
};

/** Closing: the walking cheetah flares into the logo cheetah; tagline and invitation on the brand green. */
const Finale: React.FC = () => {
  const f = useCurrentFrame(); // starts at 1490
  const flash = interpolate(f, [0, 8, 26], [0, 0.85, 0], clamp);
  const bg = interpolate(f, [6, 24], [0, 1], clamp);
  const logo = interpolate(f, [8, 40], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const tag = interpolate(f, [70, 92], [0, 1], clamp);
  const sub = interpolate(f, [120, 140], [0, 1], clamp);
  const visit = interpolate(f, [175, 195], [0, 1], clamp);
  const sweep = interpolate(f, [44, 84], [-30, 130], clamp);
  const out = interpolate(f, [292, 310], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <AbsoluteFill style={{ background: `radial-gradient(90% 60% at 50% 40%, #2d5757 0%, ${B.green} 55%, #142a2a 100%)`, opacity: bg }} />
      <div style={{ position: "absolute", left: 540 - 60 - 250, top: 330, width: 500, height: 636, opacity: logo, scale: String(1.25 - 0.25 * logo), filter: `blur(${(1 - logo) * 12}px)` }}>
        <Img src={staticFile("shadwi/logo-cream.png")} style={{ width: 500, height: 636 }} />
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", maskImage: `url(${staticFile("shadwi/logo-cream.png")})`, WebkitMaskImage: `url(${staticFile("shadwi/logo-cream.png")})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep}%`, width: "22%", background: `linear-gradient(90deg, transparent, ${B.gold}, transparent)` }} />
        </div>
      </div>
      <div dir="rtl" style={{ position: "absolute", top: 1030, left: 80, right: 120, textAlign: "center", fontFamily: TITLE, fontWeight: 500, fontSize: 64, color: B.gold, opacity: tag, translate: `0px ${(1 - tag) * 16}px` }}>
        سرعة الفهد. هدوء الفنجان.
      </div>
      <div dir="rtl" style={{ position: "absolute", top: 1130, left: 80, right: 120, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: sub }}>
        <div style={{ width: 50, height: 1.5, background: B.gold }} />
        <div style={{ fontFamily: TITLE, fontWeight: 300, fontSize: 40, color: B.cream, letterSpacing: 1 }}>قهوة مختصة سعودية</div>
        <div style={{ width: 50, height: 1.5, background: B.gold }} />
      </div>
      <div style={{ position: "absolute", top: 1230, left: 80, right: 120, display: "flex", justifyContent: "center", opacity: visit, scale: String(0.9 + 0.1 * visit) }}>
        <div dir="rtl" style={{ padding: "14px 54px 18px", borderRadius: 999, border: `1.5px solid ${B.gold}`, fontFamily: TITLE, fontWeight: 500, fontSize: 46, color: B.cream }}>زورونا</div>
      </div>
      <AbsoluteFill style={{ background: B.cream, opacity: flash }} />
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ name: string; at: number; gain?: number }> = ({ name, at, gain = 1 }) => (
  <Sequence from={at} layout="none">
    <Audio src={staticFile(`audio/shadwi/sfx/${name}.mp3`)} volume={db(-14) * gain} />
  </Sequence>
);

export const Shadwi: React.FC = () => {
  const f = useCurrentFrame();
  const iris = interpolate(f, [38, 58], [0, 1500], { ...clamp, easing: (x) => x * x });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "contrast(1.12) saturate(0.82) brightness(0.96) sepia(0.12)" }}>
        <Sequence from={0} durationInFrames={60}>
          <Eye />
        </Sequence>
        {SHOTS.map((s) => (
          <Sequence key={s.id} from={s.from} durationInFrames={s.to - s.from + (s.id === "S20" ? 40 : 2)}>
            {s.id === "S02" ? (
              <AbsoluteFill style={{ clipPath: `circle(${iris}px at 38% 34%)` }}>
                <Clip shot={s} />
              </AbsoluteFill>
            ) : (
              <Clip shot={s} />
            )}
          </Sequence>
        ))}
      </AbsoluteFill>
      <Grade />

      {/* headlines */}
      <Line text="قبل الفجر…" from={6} to={86} top={720} size={104} weight={300} />
      <Line text="جبل شدا · الباحة" from={S(7)} to={S(9.5)} top={300} size={44} color={B.gold} weight={500} />
      <Line text="من الحبّة…" from={S(17.2)} to={S(19.1)} top={760} size={96} weight={300} />
      <Line text="…إلى الفنجان" from={S(33.2)} to={S(34.9)} top={760} size={96} weight={300} />
      <Line text="لحظة لك وحدك" from={S(41.3)} to={S(44.8)} top={700} size={88} weight={300} />

      <Sequence from={1490}>
        <Finale />
      </Sequence>
      <Captions />

      {/* voice */}
      {VOS.map((v) => (
        <Sequence key={v.id} from={v.at} layout="none">
          <Audio src={staticFile(`audio/shadwi/vo/${v.id}.mp3`)} volume={db(-1)} />
        </Sequence>
      ))}
      {/* score, ducked under the voice */}
      <Audio
        src={staticFile("audio/shadwi/music/score.mp3")}
        volume={(fr) => {
          const inVo = VOS.some((v) => fr >= v.at - 6 && fr <= v.at + S(v.d.duration) + 6);
          const fd = interpolate(fr, [0, 6, 1770, 1800], [0, 1, 1, 0], clamp);
          return (inVo ? db(-19) : db(-12)) * fd;
        }}
      />
      {/* sound design */}
      <Sfx name="wind" at={0} gain={1.1} />
      <Sfx name="whoosh" at={40} />
      <Sfx name="wind" at={S(8)} gain={0.8} />
      <Sfx name="steps" at={292} gain={0.9} />
      <Sfx name="whoosh" at={508} gain={0.8} />
      <Sfx name="beans" at={512} />
      <Sfx name="roaster" at={578} gain={0.9} />
      <Sfx name="grind" at={736} />
      <Sfx name="beans" at={800} gain={0.8} />
      <Sfx name="pour" at={896} />
      <Sfx name="pour" at={992} gain={0.7} />
      <Sfx name="pour" at={1160} gain={0.5} />
      <Sfx name="wind" at={1250} gain={0.6} />
      <Sfx name="steps" at={1440} gain={0.8} />
      <Sfx name="impact" at={1494} gain={1.3} />
      <Sfx name="shimmer" at={1532} />
    </AbsoluteFill>
  );
};
