import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { fonts } from "../theme";
import { cue, getStudioScene, glitchStyle, IconBurst, KLine, SceneVoice, ServiceTag, Sfx, tech, TechBG } from "./base";

const S = getStudioScene;

// =============================================================== P1 · HOOK
const p1 = S("P1-Hook");

/** «هذا الإعلان… ما فيه كاميرا، ولا استوديو.» — typed in, then camera and studio get crossed out. */
export const P1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tCam = cue(p1, "كاميرا");
  const tStudio = cue(p1, "استوديو");
  const caret = frame < p1.words[0].start && Math.floor(frame / 6) % 2 === 0;
  const gl = glitchStyle(frame, durationInFrames - 7, 7);
  return (
    <AbsoluteFill style={gl}>
      <TechBG glow={tech.coral} />
      {caret && <div style={{ position: "absolute", left: 535, top: 440, width: 10, height: 130, background: tech.teal, boxShadow: `0 0 20px ${tech.teal}` }} />}
      <div style={{ position: "absolute", top: 380, left: 60, right: 60 }}>
        <KLine scene={p1} size={130} to={2} />
      </div>
      <Crossed at={tCam} icon="camera" x={180} />
      <Crossed at={tStudio} icon="mic" x={600} />
      <div style={{ position: "absolute", top: 1100, left: 60, right: 60 }}>
        <KLine scene={p1} size={96} from={2} highlights={{ كاميرا: tech.coral, استوديو: tech.coral }} />
      </div>
      <SceneVoice scene={p1} />
      <Sfx name="typing" at={2} />
      <Sfx name="denied" at={tCam + 6} />
      <Sfx name="denied" at={tStudio + 6} />
      <Sfx name="glitch" at={durationInFrames - 7} />
    </AbsoluteFill>
  );
};

const Crossed: React.FC<{ at: number; icon: IconName; x: number }> = ({ at, icon, x }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 160 } });
  const strike = interpolate(frame, [at + 6, at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 720, width: 300, height: 300, scale: String(0.4 + 0.6 * s), opacity: Math.min(1, s * 2) }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 80, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.12)" }}>
        <Icon name={icon} size={170} color={tech.text} stroke={1.5} />
      </div>
      <div
        style={{
          position: "absolute",
          left: -20,
          top: 140,
          width: 340 * strike,
          height: 18,
          borderRadius: 9,
          background: tech.coral,
          rotate: "-35deg",
          transformOrigin: "0% 50%",
          translate: "20px 120px",
          boxShadow: `0 0 24px ${tech.coral}`,
        }}
      />
    </div>
  );
};

// =============================================================== P2 · MAKING
const p2 = S("P2-Making");

/** An editor timeline assembles the ad: voice, music, motion — then «صنعناها بالذكاء الاصطناعي والموشن». */
export const P2Making: React.FC = () => {
  const frame = useCurrentFrame();
  const tVoice = cue(p2, "صوت");
  const tMusic = cue(p2, "والموسيقى");
  const tMotion = cue(p2, "حركة");
  const tMade = cue(p2, "صنعناها");
  const recede = interpolate(frame, [tMade - 6, tMade + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <TechBG />
      <div style={{ position: "absolute", top: 290, left: 60, right: 60 }}>
        <KLine scene={p2} size={78} to={6} highlights={{ صوت: tech.teal, الموسيقى: tech.gold, حركة: tech.coral }} out={tMade - 8} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 560, scale: String(1 - recede * 0.25), translate: `0px ${recede * 260}px`, opacity: 1 - recede * 0.75, filter: recede > 0.02 ? `blur(${recede * 6}px)` : undefined }}>
        <Editor voice={tVoice} music={tMusic} motion={tMotion} />
      </div>
      {frame >= tMade - 4 && (
        <>
          <IconBurst at={tMade} icons={["sparkle", "wand", "layers", "mic", "music", "play", "cursor", "image", "code", "star"]} cy={900} size={96} seed="mk" sides={{ yStart: 330, yEnd: 1280 }} />
          <div style={{ position: "absolute", top: 600, left: 60, right: 60 }}>
            <KLine scene={p2} size={112} from={6} highlights={{ بالذكاء: tech.teal, الاصطناعي: tech.teal, والموشن: tech.gold }} />
          </div>
        </>
      )}
      <SceneVoice scene={p2} />
      <Sfx name="pop" at={tVoice} />
      <Sfx name="pop" at={tMusic} />
      <Sfx name="pop" at={tMotion} />
      <Sfx name="render" at={tMade} />
    </AbsoluteFill>
  );
};

const Editor: React.FC<{ voice: number; music: number; motion: number }> = ({ voice, music, motion }) => {
  const frame = useCurrentFrame();
  const tracks: { label: string; icon: IconName; color: string; at: number; kind: "wave" | "bars" | "keys" }[] = [
    { label: "صوت المعلّق", icon: "mic", color: tech.teal, at: voice, kind: "wave" },
    { label: "الموسيقى", icon: "music", color: tech.gold, at: music, kind: "bars" },
    { label: "الحركة", icon: "layers", color: tech.coral, at: motion, kind: "keys" },
  ];
  const playhead = interpolate(frame, [0, 200], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ width: 960, borderRadius: 30, background: tech.panel, border: `2px solid ${tech.line}`, boxShadow: "0 40px 80px rgba(0,0,0,0.5)", overflow: "hidden" }}>
      <div dir="rtl" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 26px", background: tech.panel2 }}>
        <div style={{ display: "flex", gap: 10 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
          ))}
        </div>
        <div style={{ fontFamily: fonts.text, fontWeight: 600, fontSize: 28, color: tech.muted }}>إعلان دبّرها</div>
      </div>
      <div style={{ position: "relative", padding: "20px 26px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
        {tracks.map((t, ti) => {
          const p = interpolate(frame, [t.at, t.at + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          return (
            <div key={t.label} dir="rtl" style={{ display: "flex", alignItems: "center", gap: 18, height: 96 }}>
              <div style={{ width: 230, display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.text, fontWeight: 700, fontSize: 28, color: frame >= t.at ? tech.text : tech.muted }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, display: "grid", placeItems: "center", background: `${t.color}22` }}>
                  <Icon name={t.icon} size={32} color={t.color} stroke={2} />
                </div>
                {t.label}
              </div>
              <div style={{ flex: 1, height: 80, borderRadius: 16, background: "rgba(255,255,255,0.04)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, width: `${p * 100}%`, right: 0, left: "auto", display: "flex", alignItems: "center", gap: t.kind === "keys" ? 0 : 3, padding: "0 10px", background: `${t.color}1a`, borderRadius: 16 }}>
                  {t.kind === "keys"
                    ? Array.from({ length: 7 }).map((_, k) => (
                        <div key={k} style={{ flex: 1, display: "grid", placeItems: "center" }}>
                          <div style={{ width: 22, height: 22, rotate: "45deg", background: t.color, borderRadius: 4, boxShadow: `0 0 12px ${t.color}` }} />
                        </div>
                      ))
                    : Array.from({ length: 60 }).map((_, k) => {
                        const h = t.kind === "wave" ? 12 + random(`w${ti}${k}`) * 56 * (0.4 + 0.6 * Math.abs(Math.sin(k / 4))) : 20 + ((k * 7) % 5) * 9;
                        return <div key={k} style={{ flex: 1, height: h, borderRadius: 3, background: t.color, opacity: 0.85 }} />;
                      })}
                </div>
              </div>
            </div>
          );
        })}
        {/* playhead */}
        <div style={{ position: "absolute", top: 10, bottom: 10, right: 26 + 248 + playhead * 640, width: 4, background: "#fff", boxShadow: "0 0 14px #fff" }} />
      </div>
    </div>
  );
};

// =============================================================== P3 · YOURS
const p3 = S("P3-Yours");

export const P3Yours: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tYours = cue(p3, "لمشروعك");
  const zoom = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 2.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ scale: String(zoom), opacity: interpolate(zoom, [1, 2.2], [1, 0]) }}>
      <TechBG glow={tech.gold} />
      <IconBurst at={tYours} icons={["rocket", "bulb", "star", "store", "chart", "heart", "sparkle", "user", "globe", "cart", "megaphone", "play"]} cy={900} radius={470} size={104} seed="yr" exclude={{ x: 60, y: 640, w: 960, h: 520 }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingInline: 70 }}>
        <KLine scene={p3} size={128} highlights={{ لمشروعك: tech.gold }} />
      </AbsoluteFill>
      <SceneVoice scene={p3} />
      <Sfx name="pop" at={tYours} gain={1.3} />
      <Sfx name="whoosh" at={durationInFrames - 6} />
    </AbsoluteFill>
  );
};

// =============================================================== service screens
const ServiceScreen: React.FC<{
  scene: ReturnType<typeof S>;
  n: string;
  tag: string;
  color: string;
  highlights: Record<string, string>;
  icons: IconName[];
  children: React.ReactNode;
}> = ({ scene, n, tag, color, highlights, icons, children }) => {
  return (
    <AbsoluteFill>
      <TechBG glow={color} />
      <IconBurst at={6} icons={icons} cy={980} size={92} seed={n} sides={{ yStart: 720, yEnd: 1250 }} palette={[color, tech.teal, tech.gold, tech.violet]} />
      <div style={{ position: "absolute", top: 280, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <ServiceTag n={n} text={tag} color={color} at={2} />
      </div>
      <div style={{ position: "absolute", top: 370, left: 60, right: 60 }}>
        <KLine scene={scene} size={74} highlights={highlights} />
      </div>
      {children}
      <SceneVoice scene={scene} />
    </AbsoluteFill>
  );
};

// ---------- P4 motion
const p4 = S("P4-Motion");
export const P4Motion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tFirst = cue(p4, "أول");
  const card = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const watch = spring({ frame: frame - tFirst, fps, config: { damping: 9, stiffness: 180 } });
  const t = frame / 30;
  return (
    <ServiceScreen scene={p4} n="1" tag="فيديو إعلاني موشن" color={tech.coral} highlights={{ بالموشن: tech.coral, ثانية: tech.gold }} icons={["play", "layers", "cursor", "sparkle", "music", "wand", "image", "star"]}>
      <div style={{ position: "absolute", left: 330, top: 680, width: 420, height: 560, borderRadius: 40, overflow: "hidden", background: "linear-gradient(160deg, #1B2340, #0B1020)", border: "2px solid rgba(255,255,255,0.12)", scale: String(0.6 + 0.4 * card), opacity: card, boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 60px ${tech.coral}33` }}>
        {/* a tiny motion piece playing inside */}
        <div style={{ position: "absolute", left: 210 - 70 + Math.sin(t * 3) * 90, top: 150 + Math.abs(Math.sin(t * 4)) * -70 + 70, width: 140, height: 140, borderRadius: 70, background: `linear-gradient(135deg, ${tech.coral}, ${tech.gold})` }} />
        <div style={{ position: "absolute", left: 60, right: 60, top: 360, display: "flex", gap: 10, alignItems: "flex-end", height: 90 }}>
          {Array.from({ length: 8 }).map((_, k) => (
            <div key={k} style={{ flex: 1, height: 20 + Math.abs(Math.sin(t * 5 + k)) * 70, borderRadius: 6, background: k % 2 ? tech.teal : tech.violet }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 34, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.15)" }}>
          <div style={{ width: `${((frame % 120) / 120) * 100}%`, height: "100%", borderRadius: 4, background: tech.coral }} />
        </div>
      </div>
      {frame >= tFirst && (
        <div dir="ltr" style={{ position: "absolute", left: 690, top: 640, padding: "14px 24px", borderRadius: 999, background: tech.gold, color: tech.bg, fontFamily: fonts.display, fontWeight: 800, fontSize: 44, scale: String(watch), rotate: "8deg", display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="clock" size={40} color={tech.bg} stroke={2.4} />
          0:01
        </div>
      )}
      <Sfx name="pop" at={10} />
      <Sfx name="pop" at={tFirst} gain={1.3} />
    </ServiceScreen>
  );
};

// ---------- P5 AI
const p5 = S("P5-AI");
export const P5AI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tVoices = cue(p5, "أصوات");
  const tImages = cue(p5, "وصور");
  const tContent = cue(p5, "ومحتوى");
  const prompt = "اكتب فكرتك… ونخليها حقيقة";
  const typed = prompt.split(" ").slice(0, Math.max(0, Math.floor((frame - 14) / 5))).join(" ");
  const tile = (at: number) => spring({ frame: frame - at, fps, config: { damping: 12 } });
  const t = frame / 30;
  const tiles: { at: number; label: string; icon: IconName; body: React.ReactNode }[] = [
    {
      at: tVoices,
      label: "أصوات",
      icon: "mic",
      body: (
        <div style={{ display: "flex", gap: 5, alignItems: "center", height: 120 }}>
          {Array.from({ length: 14 }).map((_, k) => (
            <div key={k} style={{ width: 9, height: 16 + Math.abs(Math.sin(t * 6 + k * 0.8)) * 90, borderRadius: 5, background: tech.teal }} />
          ))}
        </div>
      ),
    },
    {
      at: tImages,
      label: "صور",
      icon: "image",
      body: (
        <div style={{ width: 180, height: 130, borderRadius: 16, overflow: "hidden", position: "relative", background: `linear-gradient(180deg, ${tech.violet}, ${tech.coral})` }}>
          <div style={{ position: "absolute", right: 30, top: 20, width: 40, height: 40, borderRadius: 20, background: tech.gold }} />
          <div style={{ position: "absolute", left: -20, right: -20, bottom: -40, height: 100, borderRadius: "50%", background: "#1B2340" }} />
        </div>
      ),
    },
    {
      at: tContent,
      label: "محتوى",
      icon: "document",
      body: (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 180 }}>
          {[1, 0.8, 0.95, 0.6].map((w, k) => (
            <div key={k} style={{ width: `${w * 100}%`, height: 14, borderRadius: 7, background: k === 0 ? tech.gold : "rgba(255,255,255,0.35)", alignSelf: "flex-end" }} />
          ))}
        </div>
      ),
    },
  ];
  return (
    <ServiceScreen scene={p5} n="2" tag="خدمات الذكاء الاصطناعي" color={tech.teal} highlights={{ الاصطناعي: tech.teal, أصوات: tech.gold, وصور: tech.gold, ومحتوى: tech.gold }} icons={["sparkle", "wand", "bulb", "mic", "image", "code", "star", "layers"]}>
      <div dir="rtl" style={{ position: "absolute", left: 165, right: 165, top: 720, height: 96, borderRadius: 30, background: tech.panel, border: `2px solid ${tech.teal}55`, display: "flex", alignItems: "center", gap: 16, padding: "0 26px", boxShadow: `0 0 40px ${tech.teal}22` }}>
        <Icon name="sparkle" size={44} color={tech.teal} stroke={2} />
        <div style={{ flex: 1, fontFamily: fonts.text, fontWeight: 600, fontSize: 36, color: tech.text }}>
          {typed}
          <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0, color: tech.teal }}>|</span>
        </div>
      </div>
      <div dir="rtl" style={{ position: "absolute", left: 165, right: 165, top: 860, display: "flex", justifyContent: "space-between" }}>
        {tiles.map((x) => {
          const s = tile(x.at);
          return (
            <div key={x.label} style={{ width: 240, height: 360, borderRadius: 32, background: tech.panel, border: `2px solid rgba(255,255,255,0.1)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, opacity: frame < x.at ? 0.15 : s, scale: String(frame < x.at ? 0.9 : 0.7 + 0.3 * s) }}>
              {x.body}
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.text, fontWeight: 700, fontSize: 34, color: tech.text }}>
                <Icon name={x.icon} size={34} color={tech.teal} stroke={2} />
                {x.label}
              </div>
            </div>
          );
        })}
      </div>
      <Sfx name="typing" at={14} gain={0.8} />
      {tiles.map((x) => (
        <Sfx key={x.label} name="pop" at={x.at} />
      ))}
    </ServiceScreen>
  );
};

// ---------- P6 web
const p6 = S("P6-Web");
export const P6Web: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tSites = cue(p6, "مواقع");
  const tStores = cue(p6, "ومتاجر");
  const tPro = cue(p6, "احترافي");
  const step = (at: number) => spring({ frame: frame - at, fps, config: { damping: 14 } });
  return (
    <ServiceScreen scene={p6} n="3" tag="مواقع ومتاجر" color={tech.violet} highlights={{ مواقع: tech.violet, ومتاجر: tech.violet, احترافي: tech.gold }} icons={["globe", "code", "cart", "cursor", "layers", "rocket", "store", "star"]}>
      <div dir="rtl" style={{ position: "absolute", left: 180, top: 700, width: 720, height: 560, borderRadius: 30, background: "#F4F7FB", overflow: "hidden", boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 60px ${tech.violet}33`, scale: String(0.8 + 0.2 * step(4)), opacity: step(4) }}>
        <div style={{ height: 60, background: "#E3E8F0", display: "flex", alignItems: "center", gap: 14, padding: "0 20px" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          ))}
          <div style={{ flex: 1, height: 34, borderRadius: 17, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontFamily: fonts.text, fontSize: 24, color: "#6B7280" }}>متجرك</div>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ height: 160, borderRadius: 20, background: `linear-gradient(135deg, ${tech.violet}, ${tech.teal})`, scale: `${step(tSites)} 1`, transformOrigin: "right center" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[0, 1, 2].map((k) => {
              const s = step(tStores + k * 4);
              return (
                <div key={k} style={{ height: 250, borderRadius: 18, background: "#fff", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", padding: 14, display: "flex", flexDirection: "column", gap: 10, scale: String(frame < tStores + k * 4 ? 0 : 0.6 + 0.4 * s), opacity: Math.min(1, s * 1.5) }}>
                  <div style={{ flex: 1, borderRadius: 12, background: k === 1 ? "#FFE3D9" : "#E5E0FF" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ width: 90, height: 12, borderRadius: 6, background: "#D7DCE5" }} />
                    <Icon name="cart" size={30} color={tech.violet} stroke={2} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {frame >= tPro && (
        <div style={{ position: "absolute", left: 130, top: 640, width: 140, height: 140, borderRadius: 70, background: tech.gold, display: "grid", placeItems: "center", scale: String(step(tPro)), boxShadow: `0 0 50px ${tech.gold}88` }}>
          <Icon name="check" size={90} color={tech.bg} stroke={3} />
        </div>
      )}
      <Sfx name="pop" at={tSites} />
      <Sfx name="pop" at={tStores} />
      <Sfx name="success" at={tPro} gain={0.8} />
    </ServiceScreen>
  );
};

// ---------- P7 personal
const p7 = S("P7-Personal");
export const P7Personal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tSize = cue(p7, "مقاسك");
  const card = spring({ frame: frame - 8, fps, config: { damping: 14 } });
  const tape = interpolate(frame, [tSize - 4, tSize + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const items = ["حسب طلبك", "بأسلوبك", "لك أنت"];
  return (
    <ServiceScreen scene={p7} n="4" tag="خدمات شخصية" color={tech.gold} highlights={{ شخصية: tech.gold, مقاسك: tech.gold }} icons={["user", "heart", "star", "ruler", "wand", "sparkle", "bulb", "check"]}>
      <div dir="rtl" style={{ position: "absolute", left: 240, top: 690, width: 600, height: 500, borderRadius: 40, background: tech.panel, border: "2px solid rgba(255,255,255,0.1)", scale: String(0.7 + 0.3 * card), opacity: card, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, paddingTop: 50 }}>
        <div style={{ width: 150, height: 150, borderRadius: 75, background: `linear-gradient(135deg, ${tech.gold}, ${tech.coral})`, display: "grid", placeItems: "center" }}>
          <Icon name="user" size={90} color={tech.bg} stroke={2.2} />
        </div>
        {items.map((it, k) => {
          const s = spring({ frame: frame - (30 + k * 10), fps, config: { damping: 14 } });
          return (
            <div key={it} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.text, fontWeight: 700, fontSize: 38, color: tech.text, opacity: s, translate: `${(1 - s) * 40}px 0px` }}>
              <Icon name="check" size={38} color={tech.gold} stroke={3} />
              {it}
            </div>
          );
        })}
      </div>
      {/* measuring tape wraps across the card on «مقاسك» */}
      <div style={{ position: "absolute", left: 180, top: 1215, width: 720 * tape, height: 56, rotate: "-4deg", transformOrigin: "100% 50%", translate: `${720 * (1 - tape)}px 0px`, background: `repeating-linear-gradient(90deg, ${tech.gold} 0 24px, #D9962B 24px 26px)`, borderRadius: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.4)", opacity: tape > 0 ? 1 : 0 }} />
      <Sfx name="pop" at={8} />
      <Sfx name="whoosh" at={tSize - 4} gain={0.8} />
    </ServiceScreen>
  );
};

// =============================================================== P8 · PROCESS
const p8 = S("P8-Process");
export const P8Process: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tIdea = cue(p8, "فكرتك");
  const tDeliver = cue(p8, "ونسلمك");
  const tProud = cue(p8, "يرفع");
  const steps: { icon: IconName; label: string; at: number; color: string }[] = [
    { icon: "bulb", label: "فكرتك", at: tIdea, color: tech.gold },
    { icon: "gear", label: "تنفيذ", at: Math.round((tIdea + tDeliver) / 2), color: tech.teal },
    { icon: "box", label: "تسليم", at: tDeliver, color: tech.coral },
  ];
  const line = interpolate(frame, [tIdea, tDeliver], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <TechBG glow={tech.gold} />
      <div style={{ position: "absolute", top: 300, left: 60, right: 60 }}>
        <KLine scene={p8} size={86} highlights={{ فكرتك: tech.gold, الراس: tech.teal }} />
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 830, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ position: "absolute", right: 0, width: `${line * 100}%`, height: "100%", borderRadius: 4, background: `linear-gradient(270deg, ${tech.gold}, ${tech.teal}, ${tech.coral})` }} />
      </div>
      <div dir="rtl" style={{ position: "absolute", left: 90, right: 90, top: 720, display: "flex", justifyContent: "space-between" }}>
        {steps.map((s) => {
          const p = spring({ frame: frame - s.at, fps, config: { damping: 10, stiffness: 160 } });
          return (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, scale: String(frame < s.at ? 0.6 : 0.6 + 0.4 * p), opacity: frame < s.at ? 0.25 : 1 }}>
              <div style={{ width: 220, height: 220, borderRadius: 70, display: "grid", placeItems: "center", background: `linear-gradient(${s.color}22, ${s.color}22), ${tech.panel}`, border: `3px solid ${s.color}`, boxShadow: frame >= s.at ? `0 0 50px ${s.color}55` : "none" }}>
                <Icon name={s.icon} size={120} color={s.color} stroke={1.8} />
              </div>
              <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 52, color: tech.text }}>{s.label}</div>
            </div>
          );
        })}
      </div>
      <IconBurst at={tProud} icons={["star", "sparkle", "heart", "rocket", "star", "sparkle"]} cy={1000} size={84} seed="pr" sides={{ yStart: 1110, yEnd: 1290 }} palette={[tech.gold, tech.teal]} />
      <SceneVoice scene={p8} />
      {steps.map((s) => (
        <Sfx key={s.label} name="pop" at={s.at} />
      ))}
      <Sfx name="success" at={tProud} />
    </AbsoluteFill>
  );
};

// =============================================================== P9 · CTA
const p9 = S("P9-CTA");
export const P9Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tName = cue(p9, "دبرها");
  const tIdea = cue(p9, "فكرتك");
  const tUrl = cue(p9, "علينا") + 24;
  const bar = interpolate(frame, [0, tName - 2], [0.82, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const logo = spring({ frame: frame - tName, fps, config: { damping: 11, stiffness: 160 } });
  const flash = interpolate(frame, [tName, tName + 10], [0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const url = spring({ frame: frame - tUrl, fps, config: { damping: 18 } });
  const orbit = frame / 90;
  const ring: IconName[] = ["play", "sparkle", "globe", "mic", "image", "cart", "user", "layers", "wand", "code", "music", "star"];
  return (
    <AbsoluteFill>
      <TechBG glow={tech.teal} glow2={tech.gold} />
      {/* export bar: the ad finishes rendering */}
      {frame < tName + 6 && (
        <div dir="rtl" style={{ position: "absolute", left: 140, right: 140, top: 860, opacity: interpolate(frame, [tName, tName + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.text, fontWeight: 700, fontSize: 34, color: tech.text, marginBottom: 14 }}>
            <span>جاري التصدير…</span>
            <span dir="ltr">{Math.round(bar * 100)}%</span>
          </div>
          <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.1)" }}>
            <div style={{ width: `${bar * 100}%`, height: "100%", borderRadius: 7, background: tech.teal, boxShadow: `0 0 20px ${tech.teal}` }} />
          </div>
        </div>
      )}
      {/* icon ring orbiting the logo */}
      {frame >= tName &&
        ring.map((ic, i) => {
          const a = orbit + (i / ring.length) * Math.PI * 2;
          const s = spring({ frame: frame - (tName + i * 2), fps, config: { damping: 14 } });
          const c = [tech.teal, tech.gold, tech.coral, tech.violet][i % 4];
          return (
            <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * 400 * s - 44, top: 640 + Math.sin(a) * 300 * s - 44, width: 88, height: 88, borderRadius: 26, display: "grid", placeItems: "center", background: `${c}22`, border: `2px solid ${c}55`, opacity: s }}>
              <Icon name={ic} size={48} color={c} stroke={1.8} />
            </div>
          );
        })}
      <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: frame < tName ? 0 : 1 }}>
        <Img src={staticFile("brand/logo-white.png")} style={{ width: 460, scale: String(0.7 + 0.3 * logo) }} />
      </div>
      <div style={{ position: "absolute", top: 1010, left: 60, right: 60 }}>
        <KLine scene={p9} size={110} from={1} highlights={{ علينا: tech.teal }} />
      </div>
      <div style={{ position: "absolute", top: 1230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 42px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: `2px solid ${tech.teal}66`, opacity: frame < tUrl ? 0 : Math.min(1, url * 1.5), translate: `0px ${(1 - url) * 30}px` }}>
          <Icon name="link" size={44} color={tech.teal} stroke={2.2} />
          <span dir="ltr" style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 50, color: tech.text }}>haxztd.zid.store</span>
        </div>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      <SceneVoice scene={p9} />
      <Sfx name="success" at={tName - 4} gain={0.7} />
      <Sfx name="impact" at={tName} />
      <Sfx name="pop" at={tIdea} />
      <Sfx name="pop" at={tUrl} />
    </AbsoluteFill>
  );
};
