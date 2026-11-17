import { Audio, Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Cine, display, Leak, text, usePop } from "../motion/base";
import { colors, db } from "../theme";

// «العميل: نحتاج فيديو واقعي…» — a realistic café ad built from real licensed footage
// (Pexels), cut like the reference: journey → origin → craft → enjoyment → product → Dabbirha.
export const REAL_FRAMES = 1230;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type ShotDef = { file: string; from: number; dur: number; zoom?: [number, number]; origin?: string };
const SHOTS: ShotDef[] = [
  { file: "01-desert-drone", from: 150, dur: 75 },
  { file: "02-desert-road", from: 225, dur: 60 },
  { file: "03-desert-low", from: 285, dur: 60 },
  { file: "04-roaster", from: 345, dur: 75, zoom: [1.35, 1.45], origin: "50% 85%" }, // hides the machine maker's name
  { file: "05-beans", from: 420, dur: 55 },
  { file: "06-beans-steam", from: 475, dur: 60 },
  { file: "07-beans-pour", from: 535, dur: 65 },
  { file: "09-espresso", from: 600, dur: 68 },
  { file: "10-pour", from: 668, dur: 77 },
  { file: "11-pourover-man", from: 745, dur: 70 },
  { file: "13-sip", from: 815, dur: 75 },
  { file: "14-iced", from: 890, dur: 65 },
];
const PRODUCT_AT = 955;
const BRAND_AT = 1060;

const Shot: React.FC<{ s: ShotDef }> = ({ s }) => {
  const frame = useCurrentFrame();
  const [z0, z1] = s.zoom ?? [1.03, 1.1];
  const z = interpolate(frame, [0, s.dur], [z0, z1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ scale: String(z), transformOrigin: s.origin ?? "50% 50%", filter: "contrast(1.1) saturate(1.06) brightness(0.97)" }}>
        <Video src={staticFile(`footage/shots/${s.file}.mp4`)} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <Cine amount={0.85} warm={0.9} />
    </AbsoluteFill>
  );
};

/** The client's brief, fixed at the top — the format of the reference. */
const Brief: React.FC = () => (
  <div dir="rtl" style={{ position: "absolute", top: 250, left: 70, right: 130, textAlign: "center", ...display, fontWeight: 700, lineHeight: 1.25, color: "#F6C453", textShadow: "0 3px 0 rgba(0,0,0,0.85), 0 0 18px rgba(0,0,0,0.75)" }}>
    <div style={{ fontSize: 50 }}>العميل:</div>
    <div style={{ fontSize: 54 }}>نحتاج فيديو واقعي لإعلان مقهانا</div>
  </div>
);

/** Opening: the brief's reference images on a monitor in a dark room, then we dive in. */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 110], [1, 1.15], clamp);
  const dive = interpolate(frame, [112, 150], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const refs = [
    { src: "photos/cup-warm.jpg", label: "المنتج" },
    { src: "photos/beans.jpg", label: "الهوية" },
    { src: "footage/desert-still.jpg", label: "المكان" },
  ];
  const cursorX = interpolate(frame, [20, 90], [200, 560], clamp);
  return (
    <AbsoluteFill style={{ background: "#050507", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(60% 40% at 50% 55%, rgba(120,170,255,0.18), transparent 70%)" }} />
      <AbsoluteFill style={{ scale: String(push * (1 + dive * 5)), transformOrigin: "760px 960px", perspective: 1400 }}>
        <div style={{ position: "absolute", left: 60, top: 680, width: 960, height: 560, transform: "rotateY(-16deg) rotateX(4deg)", borderRadius: 18, background: "#0E1117", border: "10px solid #1A1D24", boxShadow: "0 0 120px rgba(120,170,255,0.25)", padding: 22, display: "flex", gap: 14 }}>
          {refs.map((r, i) => (
            <div key={r.src} style={{ flex: 1, borderRadius: 10, overflow: "hidden", position: "relative", opacity: interpolate(frame, [i * 10, 12 + i * 10], [0.35, 1], clamp) }}>
              <Img src={staticFile(r.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div dir="rtl" style={{ position: "absolute", bottom: 10, right: 10, padding: "4px 12px 8px", borderRadius: 8, background: "rgba(0,0,0,0.6)", color: "#fff", ...text, fontWeight: 700, fontSize: 22 }}>{r.label}</div>
            </div>
          ))}
          <div style={{ position: "absolute", left: cursorX, top: 470, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderBottom: "26px solid #fff", rotate: "-30deg" }} />
        </div>
        {/* keyboard glow */}
        <div style={{ position: "absolute", left: 80, top: 1330, width: 900, height: 120, borderRadius: 16, background: "linear-gradient(180deg, #14161C, #0A0B0E)", boxShadow: "0 -10px 40px rgba(120,170,255,0.12)" }} />
      </AbsoluteFill>
      
      <Cine amount={0.7} warm={0} />
    </AbsoluteFill>
  );
};

/** Product end card — the café's own sign-off (fictional demo café). */
const Product: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = interpolate(frame, [0, BRAND_AT - PRODUCT_AT], [1.12, 1.02], clamp);
  const p = usePop(10, 140, 16);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(z) }}>
        <Img src={staticFile("photos/cup-warm.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.15) saturate(1.1)" }} />
      </AbsoluteFill>
      <Cine amount={1} warm={1} />
      <div dir="rtl" style={{ position: "absolute", top: 520, left: 0, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: p, translate: `0px ${(1 - p) * 30}px` }}>
        <div style={{ width: 140, height: 2, background: "rgba(247,235,221,0.75)" }} />
        <div style={{ ...display, fontWeight: 600, fontSize: 96, letterSpacing: 6, color: "#F7EBDD" }}>مقهى بُنّ</div>
        <div style={{ ...text, fontWeight: 600, fontSize: 34, color: "rgba(247,235,221,0.85)" }}>من الحبّة… للفنجال</div>
        <div style={{ width: 140, height: 2, background: "rgba(247,235,221,0.75)" }} />
      </div>
      <div dir="rtl" style={{ position: "absolute", bottom: 470, left: 0, right: 40, textAlign: "center", ...text, fontSize: 24, color: "rgba(255,255,255,0.55)", opacity: frame > fps ? 1 : 0 }}>مقهى بُنّ · اسم خيالي لمثال توضيحي</div>
    </AbsoluteFill>
  );
};

/** Dabbirha sign-off. */
const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const l1 = usePop(4, 160, 16);
  const logo = usePop(34, 170, 13);
  const pill = usePop(62, 200, 14);
  const link = usePop(96, 200, 14);
  const bob = frame > 96 ? Math.abs(Math.sin((frame - 96) / 6)) * -14 : 0;
  return (
    <AbsoluteFill style={{ background: "#0A0807" }}>
      <AbsoluteFill style={{ background: `radial-gradient(55% 35% at 50% 40%, rgba(242,180,109,${0.18 + 0.12 * logo}) 0%, transparent 70%)` }} />
      <div dir="rtl" style={{ position: "absolute", top: 300, left: 70, right: 130, textAlign: "center", ...display, fontWeight: 700, fontSize: 66, lineHeight: 1.25, color: "#fff", opacity: l1, translate: `0px ${(1 - l1) * 30}px` }}>
        من طلب العميل…
        <br />
        <span style={{ color: "#F2B46D" }}>لإعلان واقعي</span>
      </div>
      {frame >= 34 && (
        <div style={{ position: "absolute", left: 540 - 40 - 160, top: 560, width: 320, height: 320, borderRadius: 160, background: "#fff", display: "grid", placeItems: "center", scale: String(interpolate(logo, [0, 1], [0.5, 1])), opacity: Math.min(1, logo * 2), boxShadow: "0 0 80px rgba(242,180,109,0.35)" }}>
          <Img src={staticFile("brand/logo-color.png")} style={{ width: 260 }} />
        </div>
      )}
      {frame >= 62 && (
        <div style={{ position: "absolute", left: 0, right: 80, top: 930, display: "flex", justifyContent: "center" }}>
          <div dir="rtl" style={{ padding: "12px 40px 20px", borderRadius: 999, background: `linear-gradient(135deg, ${colors.primary}, ${colors.teal})`, color: "#fff", ...display, fontSize: 58, opacity: Math.min(1, pill * 2), scale: String(interpolate(pill, [0, 1], [1.3, 1])) }}>الخدمات الإبداعية من دبّرها</div>
        </div>
      )}
      {frame >= 62 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 80, top: 1050, textAlign: "center", ...text, fontWeight: 700, fontSize: 34, color: "rgba(255,255,255,0.8)", opacity: pill }}>إعلانات واقعية · موشن جرافيك · مونتاج</div>
      )}
      {frame >= 96 && (
        <div style={{ position: "absolute", left: 0, right: 80, top: 1140, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: Math.min(1, link * 2) }}>
          <svg width="56" height="62" viewBox="0 0 120 130" style={{ translate: `0px ${bob}px` }}>
            <path d="M60 6 L112 62 L80 62 L80 124 L40 124 L40 62 L8 62 Z" fill="#F2B46D" />
          </svg>
          <div dir="rtl" style={{ padding: "10px 40px 18px", borderRadius: 22, background: "#F2B46D", color: "#16110C", ...display, fontSize: 54 }}>الرابط في البايو</div>
        </div>
      )}
      <Cine amount={0.5} warm={0.4} />
    </AbsoluteFill>
  );
};

const sfx = (name: string, at: number, gain = 1) => ({ name, at, gain });
const SFX = [
  sfx("typing", 8, db(-14)),
  sfx("whoosh", 136, db(-10)),
  sfx("wind", 110, db(-14)),
  sfx("car", 220, db(-12)),
  sfx("whoosh", 343, db(-16)),
  sfx("roaster", 345, db(-12)),
  sfx("beans", 413, db(-11)),
  sfx("beans", 528, db(-12)),
  sfx("espresso", 590, db(-12)),
  sfx("pour", 652, db(-11)),
  sfx("sip", 826, db(-9)),
  sfx("ice", 890, db(-12)),
  sfx("hit", PRODUCT_AT, db(-6)),
  sfx("whoosh", BRAND_AT - 4, db(-12)),
  sfx("shimmer", BRAND_AT + 34, db(-10)),
];

export const RealAd: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={150} name="Hook">
        <Hook />
      </Sequence>
      {SHOTS.map((s) => (
        <Sequence key={s.file} from={s.from} durationInFrames={s.dur} name={s.file}>
          <Shot s={s} />
        </Sequence>
      ))}
      <Sequence from={PRODUCT_AT} durationInFrames={BRAND_AT - PRODUCT_AT} name="Product">
        <Product />
      </Sequence>
      <Sequence from={BRAND_AT} name="Brand">
        <Brand />
      </Sequence>
      {SHOTS.map((s) => (
        <Leak key={`l${s.file}`} at={s.from} len={10} />
      ))}
      {frame < BRAND_AT && <Brief />}
      <Audio
        src={staticFile("audio/real/music/score.mp3")}
        volume={(f) => db(-8) * interpolate(f, [0, 10, REAL_FRAMES - 50, REAL_FRAMES], [0, 1, 1, 0], clamp)}
      />
      {SFX.map((s, i) => (
        <Audio key={i} src={staticFile(`audio/real/sfx/${s.name}.mp3`)} from={s.at} volume={s.gain} />
      ))}
    </AbsoluteFill>
  );
};
