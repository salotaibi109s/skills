import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { fonts } from "../theme";
import { cue, DawnSky, Dunes, Dust, Frame, getDreamScene, gold, LightLeak, Man, PIC_BOTTOM, PIC_TOP, SceneVoice, Sfx, speakerOf, Subs, type DreamSceneId } from "./base";

const SHOP_NAME = "محمصة أبو فهد";

const useScene = (id: DreamSceneId) => ({ scene: getDreamScene(id), speaker: speakerOf(id) });

/** Father's arm resting on the son's shoulder (silhouette, rim-lit). */
const Arm: React.FC<{ x1: number; y1: number; x2: number; y2: number; reach?: number; rim?: string }> = ({ x1, y1, x2, y2, reach = 1, rim = gold.rim }) => {
  const ex = x1 + (x2 - x1) * reach;
  const ey = y1 + (y2 - y1) * reach;
  const cx = (x1 + ex) / 2;
  const cy = Math.max(y1, ey) + 40;
  return (
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <path d={`M${x1} ${y1} Q${cx} ${cy} ${ex} ${ey}`} stroke="#0D0806" strokeWidth={46} strokeLinecap="round" fill="none" />
      <path d={`M${x1} ${y1 - 20} Q${cx} ${cy - 22} ${ex} ${ey - 20}`} stroke={rim} strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" fill="none" />
      <circle cx={ex} cy={ey + 4} r={26} fill="#0D0806" />
    </svg>
  );
};

// ============================================================ C1 · DAWN (hook)
export const C1Dawn: React.FC = () => {
  const { scene, speaker } = useScene("C1-Dawn");
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const rise = interpolate(frame, [0, durationInFrames], [0.1, 0.75], { easing: Easing.out(Easing.quad) });
  const push = interpolate(frame, [0, durationInFrames], [1.0, 1.1]);
  const H = 760;
  const W = (H * 320) / 900;
  const fx = 250;
  const sx = 500;
  const top = 1240 - H;
  return (
    <Frame fadeIn={10}>
      <AbsoluteFill style={{ scale: String(push), transformOrigin: "540px 900px" }}>
        <DawnSky rise={rise} />
        <Dunes shift={frame * 0.4} top={1010} />
        <Dust count={36} />
        <div style={{ position: "absolute", left: fx, top: top + 10 }}>
          <Man kind="father" height={H + 10} />
        </div>
        <div style={{ position: "absolute", left: sx, top }}>
          <Man kind="son" height={H} />
        </div>
        <Arm x1={fx + W * 0.66} y1={top + H * 0.37} x2={sx + W * 0.36} y2={top + H * 0.34} />
      </AbsoluteFill>
      <Subs scene={scene} speaker={speaker} />
      <SceneVoice scene={scene} />
      <Sfx name="wind" at={0} />
    </Frame>
  );
};

// ============================================================ C2 · THE DREAM (coffee)
const Dallah: React.FC<{ tilt: number }> = ({ tilt }) => (
  <svg width="420" height="520" viewBox="0 0 420 520" style={{ overflow: "visible", rotate: `${tilt}deg`, transformOrigin: "60% 60%" }}>
    <defs>
      <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#5A3A12" />
        <stop offset="0.45" stopColor="#E3B25A" />
        <stop offset="0.6" stopColor="#FFE3A0" />
        <stop offset="1" stopColor="#6B4416" />
      </linearGradient>
    </defs>
    {/* finial + lid */}
    <path d="M200 20 Q214 40 200 62 Q186 40 200 20 Z" fill="url(#brass)" />
    <path d="M150 70 Q200 40 250 70 L262 110 L138 110 Z" fill="url(#brass)" />
    {/* neck + body */}
    <path d="M150 110 L250 110 L240 170 Q330 240 320 360 Q310 450 200 460 Q90 450 80 360 Q70 240 160 170 Z" fill="url(#brass)" />
    <path d="M90 300 Q200 330 310 300" stroke="#6B4416" strokeWidth="6" fill="none" />
    {/* beak spout */}
    <path d="M100 210 Q40 180 20 120 Q10 90 -20 70 L-6 62 Q30 80 44 112 Q66 168 118 186 Z" fill="url(#brass)" />
    {/* handle */}
    <path d="M300 180 Q380 200 370 300 Q360 380 300 400" stroke="url(#brass)" strokeWidth="20" fill="none" strokeLinecap="round" />
  </svg>
);

export const C2Dream: React.FC = () => {
  const { scene, speaker } = useScene("C2-Dream");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tCoffee = cue(scene, "قهوة");
  const tName = cue(scene, "تحمل");
  const pour = interpolate(frame, [12, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vision = spring({ frame: frame - tName, fps, config: { damping: 200 }, durationInFrames: 30 });
  const push = interpolate(frame, [0, 210], [1.05, 1.15]);
  return (
    <Frame>
      <AbsoluteFill style={{ scale: String(push), transformOrigin: "420px 1000px" }}>
        <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 35% 60%, #5A2E14 0%, ${gold.deep} 70%)` }} />
        {/* window light shafts */}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: 500 + i * 140, top: 120, width: 90, height: 1500, background: "linear-gradient(180deg, rgba(255,200,130,0.22), rgba(255,200,130,0))", rotate: "24deg", transformOrigin: "top", filter: "blur(10px)" }} />
        ))}
        <Dust count={50} color="255,190,120" />
        {/* falling beans in slow motion through the light */}
        {frame >= tCoffee - 10 &&
          Array.from({ length: 16 }).map((_, i) => {
            const t = frame - (tCoffee - 10) - i * 4;
            if (t < 0) return null;
            return (
              <div key={i} style={{ position: "absolute", left: 520 + random(`bn${i}`) * 380, top: 260 + t * 4.2, width: 30, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #8A4B22, #3A1A0A)", rotate: `${t * 3 + i * 40}deg`, boxShadow: "inset -6px 0 0 rgba(0,0,0,0.35)" }}>
                <div style={{ position: "absolute", left: 14, top: 4, width: 3, height: 32, borderRadius: 2, background: "#1E0C04", rotate: "8deg" }} />
              </div>
            );
          })}
        {/* dallah pouring */}
        <div style={{ position: "absolute", left: 560, top: 540 }}>
          <Dallah tilt={-26 * pour} />
        </div>
        <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <path d="M540 680 Q470 800 400 1000" stroke="#C88A3A" strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - pour} opacity={0.9} />
        </svg>
        {/* finjan */}
        <div style={{ position: "absolute", left: 320, top: 990, width: 170, height: 110, borderRadius: "10px 10px 80px 80px", background: "linear-gradient(90deg, #E8E1D2, #FFFFFF 45%, #CFC6B4)", boxShadow: "0 30px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", left: 10, right: 10, top: 6, height: 18, borderRadius: "50%", background: "#7A4A22" }} />
        </div>
        {/* steam carries the vision of the shop's name */}
        {[0, 1, 2].map((i) => {
          const t = (frame + i * 24) % 72;
          return <div key={i} style={{ position: "absolute", left: 380 + i * 22 + Math.sin((frame + i * 10) / 12) * 14, top: 960 - t * 4, width: 18, height: 70, borderRadius: 9, background: "rgba(255,240,220,0.35)", filter: "blur(6px)", opacity: 1 - t / 72 }} />;
        })}
        {frame >= tName && (
          <div dir="rtl" style={{ position: "absolute", left: 0, right: 0, top: 410 - vision * 30, textAlign: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 92, color: "#FFE3AE", opacity: vision * 0.85, filter: `blur(${(1 - vision) * 10}px)`, textShadow: "0 0 40px rgba(255,190,110,0.8)" }}>
            {SHOP_NAME}
          </div>
        )}
      </AbsoluteFill>
      <Subs scene={scene} speaker={speaker} />
      <SceneVoice scene={scene} />
      <Sfx name="pour" at={12} />
      <Sfx name="beans" at={tCoffee - 6} />
      <Sfx name="swell" at={tName - 30} gain={0.6} />
    </Frame>
  );
};

// ============================================================ C3 · THE PAPERS (obstacle)
export const C3Papers: React.FC = () => {
  const { scene, speaker } = useScene("C3-Papers");
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const tPapers = cue(scene, "الأوراق");
  const tDocs = cue(scene, "وثايق");
  const tLogo = cue(scene, "وشعار");
  const tStore = cue(scene, "ومتجر");
  const tLost = cue(scene, "أدري");
  const storm = interpolate(frame, [tPapers - 10, tPapers + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tilt = interpolate(frame, [tLost - 6, tLost + 14], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flicker = frame > durationInFrames - 50 ? (Math.floor(frame / 3) % 4 === 0 ? 0.55 : 1) : 1;
  const labels: { at: number; text: string; icon: IconName; x: number; y: number; r: number }[] = [
    { at: tDocs, text: "وثايق", icon: "document", x: 90, y: 520, r: -10 },
    { at: tLogo, text: "شعار", icon: "palette", x: 700, y: 440, r: 9 },
    { at: tStore, text: "متجر", icon: "store", x: 640, y: 860, r: -6 },
  ];
  return (
    <Frame warm={0.4}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${gold.night} 0%, ${gold.nightBlue} 100%)` }} />
      {/* window with city lights */}
      <div style={{ position: "absolute", left: 600, top: 300, width: 400, height: 460, border: "14px solid #1C2A44", background: "linear-gradient(180deg, #0B1630, #1B2D50)", overflow: "hidden" }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: random(`cl${i}`) * 380, top: 200 + random(`ct${i}`) * 240, width: 14, height: 14, borderRadius: 7, background: i % 3 ? "#FFC873" : "#9FD3FF", filter: "blur(3px)", opacity: 0.8 }} />
        ))}
      </div>
      {/* desk lamp cone */}
      <div style={{ position: "absolute", left: -120, top: 560, width: 0, height: 0, borderLeft: "260px solid transparent", borderRight: "260px solid transparent", borderBottom: "700px solid rgba(255,200,120,0.16)", filter: "blur(12px)", opacity: flicker }} />
      <div style={{ position: "absolute", left: 60, top: 520, width: 160, height: 60, borderRadius: "80px 80px 10px 10px", background: "#1A1A1A" }} />
      {/* son at the desk */}
      <div style={{ position: "absolute", left: 230, top: 560 }}>
        <Man kind="son" height={900} rim="#FFC27A" headTilt={tilt} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1180, height: 360, background: "linear-gradient(180deg, #2A1A10, #120A06)", borderTop: "8px solid #3A2414" }} />
      {/* paper storm */}
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (frame / (24 + (i % 5) * 6)) * (i % 2 ? 1 : -1) + i;
        const r = 260 + (i % 6) * 70;
        const x = 520 + Math.cos(a) * r * storm;
        const y = 860 + Math.sin(a) * r * 0.6 * storm;
        return <div key={i} style={{ position: "absolute", left: x - 60, top: y - 80, width: 120, height: 160, background: "#EDE6D6", opacity: 0.25 + 0.5 * storm, rotate: `${a * 57}deg`, transform: `rotateX(${(frame * 6 + i * 30) % 360}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }} />;
      })}
      {labels.map((l) => {
        const s = spring({ frame: frame - l.at, fps, config: { damping: 12 } });
        if (frame < l.at) return null;
        return (
          <div key={l.text} dir="rtl" style={{ position: "absolute", left: l.x, top: l.y + Math.sin(frame / 14) * 10, rotate: `${l.r}deg`, scale: String(s), padding: "26px 34px", background: "#F3ECDC", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", gap: 16, fontFamily: fonts.display, fontWeight: 800, fontSize: 58, color: "#3A1C10" }}>
            <Icon name={l.icon} size={56} color="#8A3B1A" stroke={2} />
            {l.text}
          </div>
        );
      })}
      <Subs scene={scene} speaker={speaker} />
      <SceneVoice scene={scene} />
      <Sfx name="storm" at={tPapers - 8} />
    </Frame>
  );
};

// ============================================================ C4 · THE FRIEND
export const C4Friend: React.FC = () => {
  const { scene, speaker } = useScene("C4-Friend");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tName = cue(scene, "دبرها");
  const glow = spring({ frame: frame - tName, fps, config: { damping: 200 }, durationInFrames: 14 });
  const lean = interpolate(frame, [tName, tName + 20], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rim = glow > 0.5 ? "#8FE6E6" : "#FFB45A";
  return (
    <Frame>
      <AbsoluteFill style={{ background: `radial-gradient(60% 45% at 50% 55%, rgba(43,196,196,${0.08 + glow * 0.25}) 0%, transparent 70%), linear-gradient(180deg, #1A0F09 0%, #0D0705 100%)` }} />
      {/* majlis wall pattern (sadu-inspired band) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, height: 60, backgroundImage: "repeating-linear-gradient(90deg, #6B2A14 0 40px, #C88A3A 40px 50px, #2A1208 50px 90px, #C88A3A 90px 100px)", opacity: 0.55 }} />
      {/* friend (left, facing right) and son (right, facing left) */}
      <div style={{ position: "absolute", left: 60, top: 560 }}>
        <Man kind="friend" height={860} rim={rim} />
      </div>
      <div style={{ position: "absolute", left: 700, top: 560, rotate: `${-lean}deg`, transformOrigin: "50% 100%" }}>
        <Man kind="son" height={860} flip rim={rim} headTilt={lean} />
      </div>
      {/* cushions */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, height: 380, background: "linear-gradient(180deg, #4A1E10, #200C06)", borderTop: "10px solid #7A3218" }} />
      {/* dallah and finjan on the floor */}
      <div style={{ position: "absolute", left: 470, top: 1060, scale: "0.35", transformOrigin: "top left" }}>
        <Dallah tilt={0} />
      </div>
      {/* the phone in the friend's hand */}
      <div style={{ position: "absolute", left: 360, top: 830, width: 150, height: 290, borderRadius: 26, background: "#0A0F1C", border: "5px solid #2A3550", rotate: "-12deg", boxShadow: `0 0 ${40 + glow * 140}px rgba(43,196,196,${0.4 + glow * 0.5})`, overflow: "hidden", display: "grid", placeItems: "center" }}>
        <div style={{ position: "absolute", inset: 8, borderRadius: 18, background: glow > 0.05 ? "#FFFFFF" : "#16324A" }} />
        {frame >= tName && <Img src={staticFile("brand/logo-color.png")} style={{ width: 120, position: "relative", opacity: glow }} />}
      </div>
      <Subs scene={scene} speaker={speaker} />
      <SceneVoice scene={scene} />
      <Sfx name="notify" at={tName} />
    </Frame>
  );
};

// ============================================================ C5 · MONTAGE
export const C5Montage: React.FC = () => {
  const { scene, speaker } = useScene("C5-Montage");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tDoc = cue(scene, "وثيقة");
  const tFree = cue(scene, "الحر");
  const tLogo = cue(scene, "صمموا");
  const tStore = cue(scene, "وبنوا");
  const tShop = cue(scene, "متجري");
  const tMe = cue(scene, "وأنا");
  const B = frame < tLogo - 4 ? "doc" : frame < tStore - 4 ? "logo" : frame < tMe - 4 ? "store" : "roast";
  const s = (at: number) => spring({ frame: frame - at, fps, config: { damping: 14 } });
  const draw = interpolate(frame, [tLogo, tStore - 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Frame>
      {B === "doc" && (
        <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 50% 50%, #7A4A22 0%, #2A1508 75%)` }}>
          <div dir="rtl" style={{ position: "absolute", left: 200, top: 420 + (1 - s(tDoc - 4)) * 300, width: 680, height: 860, background: "#F7F1E3", rotate: `${-4 + s(tDoc - 4) * 2}deg`, boxShadow: "0 40px 80px rgba(0,0,0,0.5)", padding: 50, fontFamily: fonts.text }}>
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 66, color: "#2A1508", textAlign: "center" }}>وثيقة العمل الحر</div>
            <div style={{ width: 140, height: 170, border: "4px solid #C9BFA8", margin: "40px auto 30px", background: "#EDE4CF" }} />
            {[0.9, 0.7, 0.85, 0.6, 0.8].map((w, i) => (
              <div key={i} style={{ height: 14, width: `${w * 100}%`, borderRadius: 7, background: "#D6CBB3", marginBottom: 20 }} />
            ))}
            {frame >= tFree && (
              <div style={{ position: "absolute", left: 60, bottom: 70, width: 190, height: 190, borderRadius: "50%", border: "10px solid #1E7A3C", display: "grid", placeItems: "center", rotate: "-14deg", scale: String(1.8 - 0.8 * s(tFree)), opacity: Math.min(1, s(tFree) * 1.5) }}>
                <Icon name="check" size={110} color="#1E7A3C" stroke={3} />
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}
      {B === "logo" && (
        <AbsoluteFill style={{ background: `radial-gradient(60% 45% at 50% 45%, #4A2A18 0%, #160A05 80%)`, display: "grid", placeItems: "center" }}>
          <svg width="640" height="640" viewBox="0 0 640 640" style={{ marginTop: -80 }}>
            <circle cx="320" cy="320" r="280" fill="none" stroke="#E3B25A" strokeWidth="10" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, draw * 1.6)} />
            <circle cx="320" cy="320" r="250" fill="none" stroke="#E3B25A" strokeWidth="3" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, draw * 1.8)} opacity={0.6} />
            {/* coffee bean */}
            <ellipse cx="320" cy="270" rx="90" ry="120" fill="none" stroke="#FFE3A0" strokeWidth="10" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, draw * 2 - 0.4))} />
            <path d="M320 155 Q280 270 320 385" fill="none" stroke="#FFE3A0" strokeWidth="10" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, draw * 2 - 0.8))} />
          </svg>
          <div dir="rtl" style={{ position: "absolute", top: 1220, left: 0, right: 0, textAlign: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 92, color: "#FFE3A0", opacity: interpolate(draw, [0.6, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            {SHOP_NAME}
          </div>
        </AbsoluteFill>
      )}
      {B === "store" && (
        <AbsoluteFill style={{ background: `radial-gradient(60% 45% at 50% 50%, #6A3A1A 0%, #1A0D06 80%)`, display: "grid", placeItems: "center" }}>
          <div dir="rtl" style={{ width: 460, height: 940, borderRadius: 64, padding: 14, background: "#121212", boxShadow: "0 60px 120px rgba(0,0,0,0.6)", scale: String(0.68 + 0.12 * s(tStore - 4)), marginTop: -170 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 52, background: "#FBF6EC", padding: "70px 22px 22px", display: "flex", flexDirection: "column", gap: 16, fontFamily: fonts.text }}>
              <div style={{ textAlign: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 40, color: "#3A1C10" }}>{SHOP_NAME}</div>
              <div style={{ height: 170, borderRadius: 22, background: "linear-gradient(135deg, #8A3B1A, #E3B25A)" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {["#5A2E14", "#8A4B22", "#3A1C10", "#B8742E"].map((c, i) => {
                  const p = s(tShop + i * 5);
                  return (
                    <div key={c} style={{ height: 230, borderRadius: 18, background: "#fff", boxShadow: "0 8px 18px rgba(0,0,0,0.08)", padding: 12, display: "flex", flexDirection: "column", gap: 8, scale: String(frame < tShop + i * 5 ? 0 : 0.6 + 0.4 * p), opacity: Math.min(1, p * 1.5) }}>
                      <div style={{ flex: 1, borderRadius: 12, background: c, display: "grid", placeItems: "center" }}>
                        <div style={{ width: 44, height: 60, borderRadius: "50%", border: "4px solid #FFE3A0" }} />
                      </div>
                      <div style={{ height: 10, width: "70%", borderRadius: 5, background: "#E3D8C4" }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: "auto", height: 64, borderRadius: 18, background: "#3A1C10", color: "#FFE3A0", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 30 }}>أضف للسلة</div>
            </div>
          </div>
        </AbsoluteFill>
      )}
      {B === "roast" && <Roasting start={tMe - 4} />}
      <LightLeak at={tLogo - 4} />
      <LightLeak at={tStore - 4} />
      <LightLeak at={tMe - 4} />
      <Subs scene={scene} speaker={speaker} />
      <SceneVoice scene={scene} />
      <Sfx name="page" at={tDoc - 4} />
      <Sfx name="page" at={tFree} gain={1.2} />
      <Sfx name="whoosh" at={tLogo - 6} />
      <Sfx name="whoosh" at={tStore - 6} />
      <Sfx name="whoosh" at={tMe - 6} />
      <Sfx name="beans" at={tMe + 10} />
    </Frame>
  );
};

/** The son at his drum roaster, lit by the fire. */
const Roasting: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  const flick = 0.8 + 0.2 * Math.sin(frame / 2.3) * Math.sin(frame / 3.7);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(55% 40% at 62% 62%, rgba(255,120,40,${0.45 * flick}) 0%, #120804 70%)`, scale: String(1 + t * 0.0006) }}>
      <div style={{ position: "absolute", left: 60, top: 470 }}>
        <Man kind="son" height={960} rim="#FFB070" />
      </div>
      {/* chimney */}
      <div style={{ position: "absolute", left: 830, top: 280, width: 54, height: 360, background: "linear-gradient(90deg, #2A2A2A, #6A6A6A 45%, #2A2A2A)" }} />
      {/* hopper */}
      <div style={{ position: "absolute", left: 600, top: 520, width: 0, height: 0, borderLeft: "70px solid transparent", borderRight: "70px solid transparent", borderTop: "110px solid #4A4A4A" }} />
      {/* drum body */}
      <div style={{ position: "absolute", left: 520, top: 630, width: 420, height: 300, borderRadius: 40, background: "linear-gradient(180deg, #7A7A7A, #3A3A3A 40%, #1A1A1A)", boxShadow: `0 0 60px rgba(255,140,50,${0.35 * flick})` }}>
        {/* turning ribs show rotation */}
        {[0, 1, 2, 3, 4].map((i) => {
          const x = ((t * 3 + i * 84) % 420);
          return <div key={i} style={{ position: "absolute", left: x, top: 10, width: 6, height: 280, background: "rgba(255,255,255,0.12)" }} />;
        })}
        {/* front window with roasting beans */}
        <div style={{ position: "absolute", left: 30, top: 70, width: 160, height: 160, borderRadius: "50%", border: "12px solid #8A8A8A", background: `radial-gradient(circle, rgba(255,150,60,${0.8 * flick}), #5A2A0A)`, overflow: "hidden" }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const a = t / 6 + i * 0.63;
            return <div key={i} style={{ position: "absolute", left: 64 + Math.cos(a) * 40, top: 64 + Math.sin(a) * 40, width: 18, height: 24, borderRadius: "50%", background: "#3A1A0A" }} />;
          })}
        </div>
      </div>
      {/* flame */}
      <div style={{ position: "absolute", left: 560, top: 940, width: 340, height: 60, borderRadius: 30, background: `radial-gradient(ellipse, rgba(255,190,80,${flick}), rgba(255,80,20,0.5) 60%, transparent 75%)`, filter: "blur(6px)" }} />
      {/* legs + cooling tray with stirring arm */}
      <div style={{ position: "absolute", left: 540, top: 930, width: 20, height: 260, background: "#2A2A2A" }} />
      <div style={{ position: "absolute", left: 900, top: 930, width: 20, height: 260, background: "#2A2A2A" }} />
      <div style={{ position: "absolute", left: 480, top: 1160, width: 500, height: 110, borderRadius: "50%", background: "radial-gradient(ellipse, #5A2E14 0%, #3A1A0A 60%, #6A6A6A 62%, #2A2A2A 70%)" }}>
        <div style={{ position: "absolute", left: 245, top: 52, width: 210, height: 8, background: "#9A9A9A", transformOrigin: "0 4px", rotate: `${t * 5}deg`, scale: "1 0.3" }} />
      </div>
      <Dust count={30} color="255,170,90" />
    </AbsoluteFill>
  );
};

// ============================================================ C6 / C7 · OPENING DAY
const Shopfront: React.FC<{ lit: number }> = ({ lit }) => (
  <>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #FFD9A0 0%, #F2B26A 40%, #C9783A 100%)` }} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 330, height: 1000, background: "linear-gradient(180deg, #E8CFA4, #CDA978)", boxShadow: "inset 0 -40px 80px rgba(0,0,0,0.25)" }} />
    <div dir="rtl" style={{ position: "absolute", left: 140, right: 140, top: 380, height: 150, background: "#2A1508", display: "grid", placeItems: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 84, color: "#FFE3A0", textShadow: `0 0 ${20 + 30 * lit}px rgba(255,190,110,${0.5 + 0.5 * lit})` }}>
      {SHOP_NAME}
    </div>
    {/* glowing window and door */}
    <div style={{ position: "absolute", left: 140, top: 600, width: 460, height: 620, background: `linear-gradient(180deg, rgba(255,200,120,${0.6 + 0.3 * lit}), rgba(200,110,50,0.8))`, border: "14px solid #3A2414" }} />
    <div style={{ position: "absolute", left: 650, top: 600, width: 290, height: 720, background: "#3A2414", border: "14px solid #2A1508" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1320, height: 220, background: "#8A5A30" }} />
  </>
);

export const C6FirstOrder: React.FC = () => {
  const { scene, speaker } = useScene("C6-FirstOrder");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tGot = cue(scene, "وصلني");
  const n = spring({ frame: frame - tGot, fps, config: { damping: 13 } });
  const look = interpolate(frame, [tGot - 4, tGot + 10], [10, -2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Frame fadeOut={0}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 150], [1.04, 1])) }}>
        <Shopfront lit={n} />
        <div style={{ position: "absolute", left: 600, top: 560 }}>
          <Man kind="son" height={820} flip rim="#FFF0D0" headTilt={look} />
        </div>
        <Dust count={30} />
      </AbsoluteFill>
      {frame >= tGot && (
        <div dir="rtl" style={{ position: "absolute", left: 70, width: 520, top: 760 + (1 - n) * -60, display: "flex", alignItems: "center", gap: 20, padding: "24px 30px", borderRadius: 34, background: "rgba(255,255,255,0.92)", boxShadow: "0 20px 50px rgba(0,0,0,0.35)", fontFamily: fonts.text, opacity: Math.min(1, n * 1.5) }}>
          <div style={{ width: 80, height: 80, borderRadius: 22, background: "#3A1C10", display: "grid", placeItems: "center" }}>
            <Icon name="cart" size={46} color="#FFE3A0" stroke={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 40, color: "#2A1508" }}>طلب جديد <span dir="ltr" style={{ unicodeBidi: "isolate" }}>#1</span></div>
            <div style={{ fontWeight: 500, fontSize: 30, color: "#7A5A40" }}>{SHOP_NAME}</div>
          </div>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: "#1E7A3C", display: "grid", placeItems: "center" }}>
            <Icon name="check" size={34} color="#fff" stroke={3} />
          </div>
        </div>
      )}
      <Subs scene={scene} speaker={speaker} />
      <SceneVoice scene={scene} />
      <Sfx name="bell" at={6} />
      <Sfx name="notify" at={tGot} />
    </Frame>
  );
};

export const C7Blessing: React.FC = () => {
  const { scene, speaker } = useScene("C7-Blessing");
  const frame = useCurrentFrame();
  const tSon = cue(scene, "ولدي");
  const walk = interpolate(frame, [0, 26], [-380, 170], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const reach = interpolate(frame, [24, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const H = 840;
  const W = (H * 320) / 900;
  const sonX = 600;
  const sonTop = 560;
  return (
    <Frame fadeIn={0}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 150], [1, 1.08])), transformOrigin: "540px 800px" }}>
        <Shopfront lit={1} />
        <div style={{ position: "absolute", left: walk, top: sonTop - 20 }}>
          <Man kind="father" height={H + 20} rim="#FFF0D0" />
        </div>
        <div style={{ position: "absolute", left: sonX, top: sonTop }}>
          <Man kind="son" height={820} flip rim="#FFF0D0" headTilt={-4} />
        </div>
        {reach > 0 && <Arm x1={walk + W * 0.72} y1={sonTop + H * 0.34} x2={sonX + (820 * 320) / 900 * 0.7} y2={sonTop + 820 * 0.34} reach={reach} rim="#FFF0D0" />}
        <Dust count={30} />
      </AbsoluteFill>
      {/* sun flare growing with the blessing */}
      <AbsoluteFill style={{ background: `radial-gradient(40% 30% at 15% 20%, rgba(255,240,200,${interpolate(frame, [tSon - 20, tSon + 10], [0.1, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}) 0%, transparent 70%)`, pointerEvents: "none" }} />
      <Subs scene={scene} speaker={speaker} />
      <SceneVoice scene={scene} />
      <Sfx name="swell" at={tSon - 45} />
    </Frame>
  );
};

// ============================================================ C8 · BRAND
export const C8Brand: React.FC = () => {
  const { scene } = useScene("C8-Brand");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tStep = cue(scene, "بخطوة");
  const tBrand = cue(scene, "ودبرها");
  const logo = spring({ frame: frame - tBrand, fps, config: { damping: 13, stiffness: 120 } });
  const urlAt = tBrand + 70;
  const url = spring({ frame: frame - urlAt, fps, config: { damping: 200 } });
  const walk = frame * 0.6;
  const words1 = scene.words.slice(0, 4);
  const words2 = scene.words.slice(4);
  const Word: React.FC<{ w: (typeof words1)[number]; color?: string }> = ({ w, color }) => {
    const s = spring({ frame: frame - w.start, fps, config: { damping: 200 }, durationInFrames: 14 });
    return <span style={{ display: "inline-block", opacity: frame < w.start ? 0 : s, filter: `blur(${(1 - s) * 8}px)`, translate: `0px ${(1 - s) * 20}px`, color }}>{(w.raw ?? w.text).replace(/[«»]/g, "")}</span>;
  };
  return (
    <Frame fadeOut={0}>
      <DawnSky rise={0.9} horizon={1180} />
      <Dunes top={1120} shift={-frame * 0.2} />
      {/* father and son walking toward the sun — small, far */}
      <div style={{ position: "absolute", left: 420 + walk * 0.2, top: 1050 }}>
        <Man kind="father" height={170} />
      </div>
      <div style={{ position: "absolute", left: 500 + walk * 0.2, top: 1058 }}>
        <Man kind="son" height={162} />
      </div>
      <Dust count={30} />
      {frame >= tBrand - 2 && (
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Img src={staticFile("brand/logo-badge.png")} style={{ width: 380, height: 380, borderRadius: 190, scale: String(0.6 + 0.4 * logo), opacity: Math.min(1, logo * 1.5), boxShadow: "0 0 80px rgba(255,214,140,0.7)" }} />
        </div>
      )}
      <div dir="rtl" style={{ position: "absolute", top: frame >= tBrand ? 720 : 560, left: 70, right: 70, textAlign: "center", fontFamily: fonts.display, fontWeight: 800, color: "#FFF1D6", textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
        <div style={{ fontSize: 86, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: "0.25em" }}>
          {words1.map((w, i) => (
            <Word key={i} w={w} />
          ))}
        </div>
        <div style={{ fontSize: 96, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: "0.25em", marginTop: 14 }}>
          {words2.map((w, i) => (
            <Word key={i} w={w} color={i === 0 ? "#FFD27A" : undefined} />
          ))}
        </div>
      </div>
      {frame >= urlAt && (
        <div style={{ position: "absolute", top: 1300, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: url }}>
          <div dir="rtl" style={{ fontFamily: fonts.text, fontWeight: 600, fontSize: 40, color: "#FFE3AE" }}>المصداقية وسرعة الإنجاز</div>
          <div dir="ltr" style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 52, color: "#FFFFFF", textShadow: "0 3px 12px rgba(0,0,0,0.5)" }}>haxztd.zid.store</div>
        </div>
      )}
      <SceneVoice scene={scene} />
      <Sfx name="wind" at={0} gain={0.6} />
      <Sfx name="impact" at={tBrand} />
      <Sfx name="swell" at={tStep - 20} gain={0.6} />
    </Frame>
  );
};

export const _unused = { PIC_TOP, PIC_BOTTOM };
