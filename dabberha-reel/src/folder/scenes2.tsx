import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { glassStyle } from "../components/Glass";
import { Icon, type IconName } from "../components/Icons";
import { Counter, WordLine } from "../components/Kinetic";
import { colors, fonts } from "../theme";
import { cue, cueEnd, film, FilmLook, FilmSubs, getFolderScene, SceneVoice, Sfx, shake, Spotlight } from "./base";
import { Folder } from "./Folder";

// ============================================================ F3 · TIRED
const s3 = getFolderScene("F3-Tired");

/** Slow-motion: the folder droops, papers slide out, the colour drains. */
export const F3Tired: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tTired = cue(s3, "تعب");
  const tUs = cue(s3, "وتعبنا");
  const sag = interpolate(frame, [tTired, tUs + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const drain = interpolate(frame, [tTired, durationInFrames], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const push = interpolate(frame, [0, durationInFrames], [1, 1.12]);
  const flicker = frame > tUs && frame < tUs + 14 ? [1, 0.4, 0.9, 0.3, 1, 0.6, 1][Math.floor((frame - tUs) / 2)] ?? 1 : 1;

  return (
    <AbsoluteFill style={{ background: film.dark, overflow: "hidden", filter: `saturate(${1 - drain})` }}>
      <AbsoluteFill style={{ scale: String(push), transformOrigin: "50% 60%" }}>
        <AbsoluteFill style={{ background: "radial-gradient(80% 50% at 50% 35%, #3C2E22 0%, #0D0B09 80%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1180, bottom: 0, background: `linear-gradient(180deg, ${film.deskLight}, #2B1C12)` }} />
        <div style={{ opacity: flicker * (1 - drain * 0.5) }}>
          <Spotlight />
        </div>
        <div style={{ position: "absolute", left: 240, top: 760 }}>
          <Folder width={600} sag={sag} papers={1 - sag * 0.6} />
        </div>
        {/* papers sliding out and drifting down in slow motion */}
        {[0, 1, 2, 3].map((i) => {
          const t = frame - (tTired + 8 + i * 12);
          if (t < 0) return null;
          const x = 380 + i * 90 + Math.sin(t / 14 + i) * 60;
          const y = 900 + t * 3.2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 150,
                height: 190,
                background: film.paper,
                borderRadius: 4,
                rotate: `${Math.sin(t / 10 + i) * 30 + i * 20}deg`,
                opacity: Math.max(0, 1 - t / 90),
                boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
              }}
            />
          );
        })}
      </AbsoluteFill>
      <FilmLook vignette={0.9} />
      <FilmSubs scene={s3} />
      <SceneVoice scene={s3} />
      <Sfx name="papers" at={tTired + 10} />
      <Sfx name="lamp" at={tUs} gain={0.6} />
    </AbsoluteFill>
  );
};

// ============================================================ F4 · RETIRE
const s4 = getFolderScene("F4-Retire");

/** Lights up, confetti, a medal — then the camera pulls back: the folder now hangs framed on the wall. */
export const F4Retire: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tBut = cue(s4, "بس");
  const tRetire = cue(s4, "يتقاعد");
  const warm = interpolate(frame, [tBut, tBut + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const medal = spring({ frame: frame - (tRetire + 4), fps, config: { damping: 10, stiffness: 140 } });
  const pull = interpolate(frame, [tRetire + 22, tRetire + 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const sh = shake(frame, tRetire, 10, 6);
  const { durationInFrames } = useVideoConfig();
  // crash zoom into the folder's green → match cut to the phone screen
  const crash = interpolate(frame, [durationInFrames - 9, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });

  return (
    <AbsoluteFill style={{ background: "#1A140F", overflow: "hidden" }}>
      {/* warm wall (full frame, outside the camera move so its edges never show) */}
      <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 50% 40%, rgba(255,214,150,${0.35 * warm}) 0%, #2A1F17 70%)` }} />
      <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px`, scale: String((1.25 - pull * 0.45) * (1 + crash * 6)), transformOrigin: "50% 62%", filter: crash > 0.05 ? `blur(${crash * 10}px)` : undefined }}>
        {/* picture frame (appears as the camera pulls back) */}
        <div
          style={{
            position: "absolute",
            left: 160,
            top: 560,
            width: 760,
            height: 640,
            borderRadius: 14,
            border: "34px solid #B8893F",
            boxShadow: "inset 0 0 0 10px #E3BE6E, 0 40px 80px rgba(0,0,0,0.6)",
            background: "#F2EBDD",
            opacity: pull,
          }}
        />
        <div style={{ position: "absolute", left: 240, top: 680 }}>
          <Folder width={600} medal={frame >= tRetire + 4 ? medal : 0} label="متقاعد" />
        </div>
        {/* brass plaque */}
        <div
          dir="rtl"
          style={{
            position: "absolute",
            left: 340,
            top: 1225,
            width: 400,
            padding: "14px 0",
            borderRadius: 10,
            textAlign: "center",
            background: "linear-gradient(180deg, #E8C877, #B8893F)",
            color: "#3B2A12",
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 46,
            opacity: pull,
          }}
        >
          متقاعد بكل فخر
        </div>
      </AbsoluteFill>
      <Spotlight on={warm * 0.7} />
      {frame >= tRetire && <Confetti t={frame - tRetire} />}
      <FilmLook vignette={0.7} />
      <FilmSubs scene={s4} />
      <SceneVoice scene={s4} />
      <Sfx name="lamp" at={tBut} />
      <Sfx name="confetti" at={tRetire} />
      <Sfx name="pop" at={tRetire + 4} gain={1.2} />
    </AbsoluteFill>
  );
};

const Confetti: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: 70 }).map((_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const vx = side * (4 + random(`cx${i}`) * 14);
      const vy = -(16 + random(`cy${i}`) * 18);
      const x = 540 + side * 420 + vx * t * -1;
      const y = 1300 + vy * t + 0.55 * t * t;
      const c = [film.greenLight, colors.gold, colors.tealBright, "#E8735A", "#fff"][i % 5];
      if (y > 2000) return null;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 14,
            height: 24,
            background: c,
            rotate: `${t * (8 + (i % 7) * 3)}deg`,
            borderRadius: 3,
            opacity: Math.max(0, 1 - t / 80),
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ============================================================ F5 · PHONE
const s5 = getFolderScene("F5-Phone");

const CATS: { label: string; icon: IconName; cueWord: string; x: number; y: number }[] = [
  { label: "خدمات حكومية", icon: "shield", cueWord: "خدمات", x: 640, y: 420 },
  { label: "أعمال وعمل حر", icon: "briefcase", cueWord: "وأعمال", x: 40, y: 700 },
  { label: "عقود وعقار", icon: "contract", cueWord: "وعقود", x: 640, y: 980 },
];

/**
 * Match cut: crash-zoom into the folder's green, which becomes the phone screen;
 * the phone orbits into place, categories fly out, then the starting price.
 */
export const F5Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tPhone = cue(s5, "جوالك");
  const tBrand = cue(s5, "دبرها");
  const tPrices = cue(s5, "وأسعار");
  const tFrom = cue(s5, "تبدأ");
  const tLand = cueEnd(s5, "عشر");
  const tRiyal = cue(s5, "ريال");

  // 0 → 20: green fills frame, then reveals the phone
  const reveal = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const orbit = interpolate(frame, [10, 70], [-38, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const brand = spring({ frame: frame - tBrand, fps, config: { damping: 12 } });
  const recede = interpolate(frame, [tPrices - 6, tPrices + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const price = spring({ frame: frame - (tPrices - 2), fps, config: { damping: 14 } });
  const done = frame >= tPhone;

  return (
    <AbsoluteFill style={{ background: "#08121F", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 50% 45%, rgba(14,147,154,${0.35 * reveal}) 0%, transparent 70%)` }} />
      {/* phone */}
      <AbsoluteFill style={{ perspective: 2000, opacity: 1 - recede * 0.75, filter: recede > 0.02 ? `blur(${recede * 8}px)` : undefined }}>
        <div
          style={{
            position: "absolute",
            left: 330,
            top: 380,
            width: 420,
            height: 860,
            borderRadius: 60,
            padding: 14,
            background: "linear-gradient(145deg, #2a3550, #0c1222)",
            boxShadow: `0 60px 120px rgba(0,0,0,0.6), 0 0 80px rgba(43,196,196,${0.25 * reveal})`,
            rotate: `y ${orbit}deg`,
            scale: String(interpolate(reveal, [0, 1], [4.2, 1])),
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 48,
              overflow: "hidden",
              background: `linear-gradient(180deg, ${interpolate(reveal, [0, 1], [0, 1]) < 0.5 ? film.green : colors.teal} 0%, ${colors.navy} 100%)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 30,
            }}
          >
            <div style={{ background: "#fff", borderRadius: 36, padding: "18px 22px", scale: String(0.6 + 0.4 * brand), opacity: frame >= tBrand ? 1 : 0 }}>
              <Img src={staticFile("brand/logo-color.png")} style={{ width: 260 }} />
            </div>
            <div
              dir="rtl"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 26px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.16)",
                color: "#fff",
                fontFamily: fonts.text,
                fontWeight: 700,
                fontSize: 34,
                opacity: done ? 1 : 0,
              }}
            >
              <Icon name="check" size={34} color="#fff" stroke={3} />
              تخلص من جوالك
            </div>
          </div>
        </div>
      </AbsoluteFill>
      {/* green flood from the match cut */}
      <AbsoluteFill style={{ background: film.green, opacity: interpolate(frame, [0, 6, 22], [1, 1, 0], { extrapolateRight: "clamp" }) }} />

      {/* categories */}
      {CATS.map((c, i) => {
        const at = cue(s5, c.cueWord);
        const s = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 150 } });
        if (frame < at) return null;
        return (
          <div
            key={c.label}
            dir="rtl"
            style={{
              position: "absolute",
              left: c.x,
              top: c.y + Math.sin((frame + i * 30) / 22) * 8,
              translate: `${(540 - c.x - 200) * (1 - s)}px ${(800 - c.y) * (1 - s)}px`,
              scale: String(0.3 + 0.7 * s),
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "20px 26px",
              borderRadius: 28,
              ...glassStyle("dark"),
              color: "#fff",
              fontFamily: fonts.text,
              fontWeight: 700,
              fontSize: 38,
              whiteSpace: "nowrap",
              opacity: 1 - recede * 0.8,
              filter: recede > 0.02 ? `blur(${recede * 6}px)` : undefined,
            }}
          >
            <Icon name={c.icon} size={44} color={colors.tealBright} stroke={2} />
            {c.label}
          </div>
        );
      })}

      {/* starting price */}
      {frame >= tPrices - 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: price, scale: String(0.85 + 0.15 * price) }}>
          <div dir="rtl" style={{ textAlign: "center", fontFamily: fonts.display, fontWeight: 800, color: "#fff" }}>
            <div style={{ fontSize: 70, opacity: 0.9 }}>تبدأ من</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 24, lineHeight: 1 }}>
              <Counter value={19} start={tFrom} end={tLand} style={{ fontSize: 340, color: colors.gold, textShadow: "0 0 60px rgba(227,166,58,0.45)" }} />
              <span style={{ fontSize: 86, opacity: frame >= tRiyal - 2 ? 1 : 0.3 }}>ريال</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      <FilmLook vignette={0.75} grade={false} />
      <FilmSubs scene={s5} />
      <SceneVoice scene={s5} />
      <Sfx name="zoom" at={0} />
      <Sfx name="flare" at={tBrand} />
      {CATS.map((c) => (
        <Sfx key={c.label} name="pop" at={cue(s5, c.cueWord)} />
      ))}
      <Sfx name="whoosh" at={tPrices - 6} />
      <Sfx name="stamp" at={tLand} gain={0.8} />
    </AbsoluteFill>
  );
};

// ============================================================ F6 · TRUST
const s6 = getFolderScene("F6-Trust");

/** Title cards with an anamorphic light sweep across each word. */
export const F6Trust: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tA = cue(s6, "المصداقية");
  const tB = cue(s6, "وسرعة");
  const tC = cue(s6, "الإنجاز");
  const card = (at: number) => spring({ frame: frame - at, fps, config: { damping: 200 }, durationInFrames: 16 });
  const sweep = (at: number) => interpolate(frame, [at, at + 22], [-0.4, 1.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const Word: React.FC<{ text: string; at: number; size: number; color: string }> = ({ text, at, size, color }) => {
    const c = card(at);
    const sw = sweep(at);
    return (
      <div style={{ position: "relative", display: "inline-block", opacity: c, filter: `blur(${(1 - c) * 14}px)`, scale: String(0.92 + 0.08 * c) }}>
        <span style={{ fontSize: size, color, textShadow: "0 0 40px rgba(43,196,196,0.25)" }}>{text}</span>
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: `${sw * 100}%`,
            width: 900,
            height: 10,
            translate: "-50% 0px",
            background: "linear-gradient(90deg, transparent, rgba(160,240,255,0.95), transparent)",
            filter: "blur(3px)",
            boxShadow: "0 0 40px 10px rgba(120,220,255,0.5)",
            opacity: sw > -0.3 && sw < 1.3 ? 1 : 0,
          }}
        />
      </div>
    );
  };
  // drifting bokeh
  return (
    <AbsoluteFill style={{ background: "#071019", overflow: "hidden" }}>
      {Array.from({ length: 18 }).map((_, i) => {
        const s = 40 + random(`b${i}`) * 120;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`bx${i}`) * 1080,
              top: 250 + random(`by${i}`) * 1300 - frame * (0.2 + random(`bs${i}`) * 0.4),
              width: s,
              height: s,
              borderRadius: s,
              background: i % 3 === 0 ? "rgba(227,166,58,0.12)" : "rgba(43,196,196,0.12)",
              filter: "blur(6px)",
            }}
          />
        );
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div dir="rtl" lang="ar" style={{ textAlign: "center", fontFamily: fonts.display, fontWeight: 800, lineHeight: 1.15 }}>
          <Word text="المصداقية" at={tA} size={190} color="#ffffff" />
          <div style={{ height: 30 }} />
          <div style={{ display: "flex", gap: 34, justifyContent: "center" }}>
            <Word text="وسرعة" at={tB} size={140} color="#ffffff" />
            <Word text="الإنجاز" at={tC} size={140} color={colors.tealBright} />
          </div>
        </div>
      </AbsoluteFill>
      <FilmLook vignette={0.8} grade={false} />
      <SceneVoice scene={s6} />
      <Sfx name="flare" at={tA} />
      <Sfx name="flare" at={tC} gain={0.8} />
    </AbsoluteFill>
  );
};

// ============================================================ F7 · CTA
const s7 = getFolderScene("F7-CTA");

/** Logo, and the retired folder swinging in a hammock. «وخلّ الملف الأخضر يرتاح.» */
export const F7Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tName = cue(s7, "دبرها");
  const t1 = cue(s7, "وخل");
  const t2 = cue(s7, "الملف");
  const t3 = cue(s7, "الأخضر");
  const t4 = cue(s7, "يرتاح");
  const tUrl = t4 + 22;
  const logo = spring({ frame: frame - (tName - 2), fps, config: { damping: 11, stiffness: 160 } });
  const ham = spring({ frame: frame - (t1 - 6), fps, config: { damping: 16 } });
  const url = spring({ frame: frame - tUrl, fps, config: { damping: 18 } });
  const swing = Math.sin(frame / 18) * 5;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 60% at 50% 20%, #FFFFFF 0%, ${colors.ice} 55%, #DCE8F0 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 290, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("brand/logo-color.png")} style={{ width: 470, scale: String(0.75 + 0.25 * logo), opacity: frame < tName - 2 ? 0 : 1 }} />
      </div>
      {/* hammock */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, height: 330, opacity: ham, translate: `0px ${(1 - ham) * 60}px` }}>
        <svg width="1080" height="330" viewBox="0 0 1080 330" style={{ position: "absolute", inset: 0 }}>
          <rect x="120" y="20" width="18" height="300" rx="9" fill="#8B6A45" />
          <rect x="942" y="20" width="18" height="300" rx="9" fill="#8B6A45" />
          <path d={`M138 60 Q540 ${250 + swing} 942 60`} stroke="#C8B08A" strokeWidth="6" fill="none" />
          <path d={`M138 60 Q540 ${300 + swing} 942 60`} stroke="#E6D3B0" strokeWidth="26" fill="none" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: 380, top: 70 + swing * 0.8, rotate: `${-8 + swing * 0.4}deg` }}>
          <Folder width={320} medal={1} label="متقاعد" />
        </div>
        {/* zzz */}
        {[0, 1, 2].map((i) => {
          const t = (frame + i * 20) % 60;
          return (
            <div key={i} style={{ position: "absolute", left: 700 + t * 1.2, top: 40 - t * 1.4, fontFamily: fonts.display, fontWeight: 800, fontSize: 30 + i * 8, color: colors.primary, opacity: (1 - t / 60) * ham }}>
              z
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1060, left: 70, right: 70 }}>
        <WordLine
          size={84}
          weight={800}
          color={colors.textOnLight}
          words={[
            { text: "وخلّ", at: t1 },
            { text: "الملف", at: t2 },
            { text: "الأخضر", at: t3, highlight: true },
            { text: "يرتاح.", at: t4 },
          ]}
          highlightColor={film.green}
        />
      </div>
      <div style={{ position: "absolute", top: 1250, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          dir="rtl"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "22px 42px",
            borderRadius: 999,
            ...glassStyle("light"),
            opacity: frame < tUrl ? 0 : Math.min(1, url * 1.5),
            translate: `0px ${(1 - url) * 30}px`,
          }}
        >
          <Icon name="link" size={44} color={colors.teal} stroke={2.2} />
          <span dir="ltr" style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 50, color: colors.textOnLight }}>
            haxztd.zid.store
          </span>
        </div>
      </div>
      <FilmLook vignette={0.25} grade={false} />
      <SceneVoice scene={s7} />
      <Sfx name="pop" at={tName - 2} gain={1.2} />
      <Sfx name="whoosh" at={t1 - 6} />
      <Sfx name="pop" at={tUrl} />
    </AbsoluteFill>
  );
};
