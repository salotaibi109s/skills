import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon } from "../components/Icons";
import { fonts } from "../theme";
import { bp, Converge, getBrandScene, Glass, Headline, PhoneX, SceneVoice, Sfx, spoken, Stage } from "./kit";

// ---------------------------------------------------------------- shared props
/** Over-the-shoulder silhouette of a Saudi professional (ghutra), rim-lit in blue. */
const Silhouette: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <svg width="760" height="900" viewBox="0 0 760 900" style={{ position: "absolute", right: -150, top: 1200, opacity, filter: "drop-shadow(0 0 18px rgba(61,139,255,0.55))" }}>
    <defs>
      <linearGradient id="silFill" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="#1A2C55" />
        <stop offset="1" stopColor="#070D1C" />
      </linearGradient>
      <linearGradient id="silRim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="rgba(120,200,255,0.95)" />
        <stop offset="0.5" stopColor="rgba(120,200,255,0.15)" />
        <stop offset="1" stopColor="rgba(120,200,255,0.6)" />
      </linearGradient>
    </defs>
    {/* thobe shoulders */}
    <path d="M30 900 C50 650 200 575 380 575 C560 575 710 650 740 900 Z" fill="url(#silFill)" stroke="url(#silRim)" strokeWidth="4" />
    {/* ghutra falling over the shoulders */}
    <path d="M232 440 C222 230 538 230 528 440 L612 650 C510 600 250 600 148 650 Z" fill="#203462" stroke="url(#silRim)" strokeWidth="4" />
    {/* ghutra top + agal, seen from behind */}
    <path d="M250 330 C250 170 510 170 510 330 C450 300 310 300 250 330 Z" fill="#2A4176" stroke="url(#silRim)" strokeWidth="4" />
    <path d="M262 262 C320 238 440 238 498 262" fill="none" stroke="#0A1226" strokeWidth="16" strokeLinecap="round" />
    <path d="M268 286 C326 262 434 262 492 286" fill="none" stroke="#0A1226" strokeWidth="12" strokeLinecap="round" />
  </svg>
);

const LogoDraft: React.FC<{ freeze?: boolean }> = ({ freeze }) => {
  const frame = useCurrentFrame();
  const d = freeze ? 0 : 1;
  return (
    <Glass style={{ width: 330, height: 300, padding: 26 }} tint={bp.coral}>
      <div dir="rtl" style={{ fontFamily: fonts.text, fontWeight: 600, fontSize: 24, color: "rgba(234,246,255,0.7)" }}>شعار — مسودة</div>
      <svg width="280" height="200" viewBox="0 0 280 200" style={{ marginTop: 6 }}>
        <circle cx="140" cy="100" r="62" fill="none" stroke="rgba(255,138,107,0.9)" strokeWidth="6" strokeDasharray="12 10" />
        <path d="M100 120 Q140 50 185 95" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={120 + Math.sin(frame / 10) * 6 * d} />
        <circle cx="185" cy="95" r="7" fill="#fff" />
        <rect x="176" y="86" width="18" height="18" fill="none" stroke={bp.electric} strokeWidth="3" />
      </svg>
    </Glass>
  );
};

const TechPanel: React.FC<{ freeze?: boolean }> = ({ freeze }) => {
  const frame = useCurrentFrame();
  return (
    <Glass style={{ width: 340, height: 300, padding: 22 }} tint={bp.electric}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />
        ))}
      </div>
      {[0.9, 0.6, 0.75, 0.4, 0.8, 0.55].map((w, i) => (
        <div key={i} style={{ height: 12, width: `${w * 100}%`, borderRadius: 6, marginBottom: 12, background: i === 3 ? "#FF5F57" : i % 2 ? "rgba(61,139,255,0.55)" : "rgba(43,196,196,0.5)" }} />
      ))}
      <div style={{ position: "absolute", left: 22, bottom: 20, rotate: `${freeze ? 0 : frame * 3}deg` }}>
        <Icon name="gear" size={56} color="rgba(234,246,255,0.8)" stroke={1.8} />
      </div>
    </Glass>
  );
};

const DocCard: React.FC = () => (
  <Glass style={{ width: 320, height: 330, padding: 24 }} tint={bp.tealBright}>
    <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.text, fontWeight: 700, fontSize: 26, color: "#EAF6FF" }}>
      <Icon name="document" size={34} color={bp.tealBright} stroke={2} />
      معاملة إلكترونية
    </div>
    {[1, 0.8, 0.9].map((w, i) => (
      <div key={i} style={{ marginTop: 20, height: 40, width: `${w * 100}%`, borderRadius: 10, border: "1.5px solid rgba(160,220,255,0.35)", background: "rgba(255,255,255,0.05)" }} />
    ))}
    <div dir="rtl" style={{ marginTop: 18, fontFamily: fonts.text, fontWeight: 600, fontSize: 22, color: bp.gold }}>بانتظار الإجراء…</div>
  </Glass>
);

const OBJ = {
  logo: { left: 70, top: 660, rot: -8, ry: 18 },
  tech: { left: 680, top: 640, rot: 7, ry: -18 },
  doc: { left: 80, top: 1060, rot: 5, ry: 14 },
};
const PHONE = { left: 390, top: 760, width: 300 };

const PhoneGlow: React.FC<{ pulse?: number }> = ({ pulse = 0 }) => (
  <PhoneX width={PHONE.width} glow={1 + Math.sin(Math.min(1, pulse) * Math.PI) * 0.8}>
    <AbsoluteFill style={{ background: `radial-gradient(70% 50% at 50% 40%, ${bp.electric}55 0%, #0B1530 75%)` }} />
    {[0, 1, 2].map((i) => (
      <div key={i} dir="rtl" style={{ position: "absolute", left: 18, right: 18, top: 90 + i * 74, height: 58, borderRadius: 16, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10, padding: "0 12px" }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: [bp.coral, bp.electric, bp.tealBright][i] }} />
        <div style={{ flex: 1, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.35)" }} />
      </div>
    ))}
  </PhoneX>
);

// ============================================================ B1 · THE PROBLEM
const b1 = getBrandScene("B1-Problem");

export const B1Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const tIdea = spoken(b1, "فكرة");
  const tService = spoken(b1, "خدمة");
  const tTx = spoken(b1, "معاملة");
  const tLast = b1.words[b1.words.length - 1].end;
  const push = interpolate(frame, [0, durationInFrames], [1, 1.14], { easing: Easing.inOut(Easing.quad) });
  const show = (at: number) => spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 120 } });
  const bob = (i: number) => Math.sin((frame + i * 40) / 22) * 10;

  return (
    <Stage focus={bp.electric}>
      <AbsoluteFill style={{ scale: String(push), transformOrigin: "540px 1000px" }}>
        {/* glass desk edge */}
        <div style={{ position: "absolute", left: -100, right: -100, top: 1330, height: 30, background: "linear-gradient(90deg, transparent, rgba(120,200,255,0.35), transparent)", filter: "blur(2px)" }} />
        <div style={{ position: "absolute", left: PHONE.left, top: PHONE.top }}>
          <PhoneGlow />
        </div>
        {([
          ["logo", tIdea, <LogoDraft key="l" />],
          ["tech", tService, <TechPanel key="t" />],
          ["doc", tTx, <DocCard key="d" />],
        ] as const).map(([k, at, el], i) => {
          const o = OBJ[k];
          const s = show(at);
          if (frame < at) return null;
          return (
            <div key={k} style={{ position: "absolute", left: o.left, top: o.top + bob(i), perspective: 1200, opacity: Math.min(1, s * 1.5) }}>
              <div style={{ transform: `rotateY(${o.ry}deg) rotate(${o.rot}deg) scale(${0.5 + 0.5 * s})`, transformOrigin: "50% 50%" }}>{el}</div>
            </div>
          );
        })}
        <Silhouette />
      </AbsoluteFill>

      {/* headlines */}
      <div style={{ position: "absolute", top: 290, left: 60, right: 60 }}>
        {frame < tService - 4 && <Headline size={110} words={[{ text: "عندك", at: b1.words[0].start }, { text: "فكرة؟", at: tIdea, color: bp.coral }]} out={tService - 12} />}
        {frame >= tService - 4 && frame < tTx - 4 && <Headline size={110} words={[{ text: "تحتاج", at: tService - 2 }, { text: "خدمة؟", at: tService + 4, color: bp.electric }]} out={tTx - 12} />}
        {frame >= tTx - 4 && frame < tLast + 4 && <Headline size={96} words={[{ text: "معاملة", at: tTx }, { text: "إلكترونية؟", at: spoken(b1, "إلكترونية"), color: bp.tealBright }]} out={tLast - 4} />}
        {frame >= tLast + 2 && (
          <Headline
            size={92}
            words={[
              { text: "ثلاثة", at: tLast + 4 },
              { text: "احتياجات…", at: tLast + 8 },
              { text: "ووقت", at: tLast + 14 },
              { text: "واحد!", at: tLast + 18, color: bp.gold },
            ]}
          />
        )}
      </div>
      <SceneVoice scene={b1} />
      <Sfx name="pulse" at={0} />
      <Sfx name="notify" at={tIdea} />
      <Sfx name="notify" at={tService} />
      <Sfx name="notify" at={tTx} />
      <Sfx name="pulse" at={tLast} gain={0.8} />
    </Stage>
  );
};

// ============================================================ B2 · DISCOVER
const b2 = getBrandScene("B2-Discover");
const PHONE_CX = PHONE.left + PHONE.width / 2;
const PHONE_CY = PHONE.top + (PHONE.width * 2.06) / 2;

export const B2Discover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tName = spoken(b2, "دبرها");
  const FREEZE = 6;
  const PULSE = 16;
  const DISSOLVE_END = 58;
  const PORTAL = 62;
  const pulse = interpolate(frame, [PULSE, PULSE + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const dissolve = interpolate(frame, [PULSE + 6, DISSOLVE_END - 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const portal = interpolate(frame, [PORTAL, tName], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const logo = spring({ frame: frame - tName, fps, config: { damping: 12, stiffness: 110 } });
  const flash = interpolate(frame, [tName - 1, tName, tName + 10], [0, 0.75, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagAt = tName + 18;

  return (
    <Stage focus={bp.tealBright} light={1 + portal}>
      {/* the B1 composition, frozen, dissolving into particles */}
      <AbsoluteFill style={{ scale: "1.14", transformOrigin: "540px 1000px", opacity: 1 - portal }}>
        {(["logo", "tech", "doc"] as const).map((k) => {
          const o = OBJ[k];
          const el = k === "logo" ? <LogoDraft freeze /> : k === "tech" ? <TechPanel freeze /> : <DocCard />;
          return (
            <div key={k} style={{ position: "absolute", left: o.left, top: o.top, perspective: 1200, opacity: 1 - dissolve, filter: dissolve > 0.02 ? `blur(${dissolve * 10}px) brightness(${1 + dissolve})` : undefined }}>
              <div style={{ transform: `rotateY(${o.ry}deg) rotate(${o.rot}deg)`, translate: frame < FREEZE ? `${Math.sin(frame * 3) * 3}px 0px` : undefined }}>{el}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: PHONE.left, top: PHONE.top }}>
          <PhoneGlow pulse={pulse} />
        </div>
        <Silhouette opacity={1 - dissolve * 0.8} />
      </AbsoluteFill>
      {/* light pulse ring from the phone */}
      {frame >= PULSE && frame < PULSE + 26 && (
        <div style={{ position: "absolute", left: PHONE_CX, top: PHONE_CY, width: 10, height: 10, translate: "-50% -50%", borderRadius: "50%", boxShadow: `0 0 0 ${pulse * 900}px rgba(140,210,255,${0.06 * (1 - pulse)}), 0 0 0 ${pulse * 300}px rgba(255,255,255,${0.12 * (1 - pulse)})` }} />
      )}
      <Converge start={PULSE + 4} end={DISSOLVE_END} tx={PHONE_CX} ty={PHONE_CY} count={120} spread={700} seed="b2" />
      {/* portal */}
      {frame >= PORTAL - 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
          {[0, 1, 2, 3].map((i) => {
            const r = 120 + portal * (500 + i * 180);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: r,
                  height: r,
                  borderRadius: "50%",
                  border: `${3 + i}px solid rgba(${i % 2 ? "61,139,255" : "43,196,196"},${0.6 - i * 0.12})`,
                  boxShadow: `0 0 40px rgba(61,139,255,0.5), inset 0 0 40px rgba(43,196,196,0.4)`,
                  rotate: `${frame * (i % 2 ? 2 : -2)}deg`,
                  opacity: 1 - logo * 0.6,
                }}
              />
            );
          })}
        </AbsoluteFill>
      )}
      {/* original logo, revealed in 3D */}
      {frame >= tName - 1 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", perspective: 1600 }}>
          <div style={{ transform: `rotateY(${(1 - logo) * 80}deg) scale(${0.6 + 0.4 * logo})`, filter: `drop-shadow(0 30px 60px rgba(0,0,0,0.6)) drop-shadow(0 0 60px rgba(61,139,255,0.55))`, marginTop: -120 }}>
            <Img src={staticFile("brand/logo-badge.png")} style={{ width: 560, height: 560, borderRadius: 280 }} />
          </div>
        </AbsoluteFill>
      )}
      <div style={{ position: "absolute", top: 1240, left: 60, right: 60 }}>
        <Headline size={78} words={[{ text: "وجهتك", at: tagAt }, { text: "للخدمات", at: tagAt + 5 }, { text: "الرقمية", at: tagAt + 10, color: bp.tealBright }]} />
      </div>
      <AbsoluteFill style={{ background: "#EAF6FF", opacity: flash, pointerEvents: "none" }} />
      <SceneVoice scene={b2} />
      <Sfx name="mech" at={FREEZE - 4} />
      <Sfx name="pulse" at={PULSE} />
      <Sfx name="particles" at={PULSE + 6} />
      <Sfx name="portal" at={PORTAL} />
      <Sfx name="impact" at={tName} />
    </Stage>
  );
};

// ============================================================ B3 · CREATIVE
const b3 = getBrandScene("B3-Creative");

/** An original abstract mark (not any real brand) drawn with a pen tool, then extruded. */
const MarkDraw: React.FC<{ draw: number; extrude: number }> = ({ draw, extrude }) => (
  <div style={{ position: "relative", width: 300, height: 300, transform: `rotateY(${Math.sin(extrude * Math.PI) * 25}deg)`, transformStyle: "preserve-3d" }}>
    {Array.from({ length: Math.round(extrude * 10) }).map((_, k) => (
      <svg key={k} width="300" height="300" viewBox="0 0 300 300" style={{ position: "absolute", inset: 0, transform: `translateZ(${-k * 3}px)`, opacity: 0.6 }}>
        <rect x="40" y="40" width="220" height="220" rx="64" fill="#0B2A55" />
      </svg>
    ))}
    <svg width="300" height="300" viewBox="0 0 300 300" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="markG" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={bp.electric} />
          <stop offset="1" stopColor={bp.tealBright} />
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="220" height="220" rx="64" fill={extrude > 0 ? "url(#markG)" : "none"} stroke="#fff" strokeWidth="5" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, draw * 1.4)} />
      <path d="M85 195 C120 120 170 175 215 100" fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, draw * 1.6 - 0.6)} />
      <circle cx="215" cy="100" r="14" fill="#fff" opacity={draw > 0.95 ? 1 : 0} />
      {draw < 1 && (
        <>
          <line x1="170" y1="160" x2="230" y2="80" stroke={bp.gold} strokeWidth="2" />
          <circle cx="170" cy="160" r="7" fill={bp.gold} />
          <circle cx="230" cy="80" r="7" fill={bp.gold} />
        </>
      )}
    </svg>
  </div>
);

export const B3Creative: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const tLogos = spoken(b3, "شعارات");
  const tDesigns = spoken(b3, "تصاميم");
  const tContent = spoken(b3, "ومحتوى");
  const tCreative = spoken(b3, "إبداعي");
  const draw = interpolate(frame, [b3.words[0].start, tLogos], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const extrude = interpolate(frame, [tLogos, tLogos + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fan = spring({ frame: frame - tDesigns, fps, config: { damping: 15 } });
  const posts = (k: number) => spring({ frame: frame - (tContent + k * 5), fps, config: { damping: 14 } });
  const orbit = interpolate(frame, [0, durationInFrames], [-10, 10]);
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 18 });

  return (
    <Stage focus={bp.coral}>
      {/* the studio: canvas + design pieces, slowly orbiting (tracking shot) */}
      <AbsoluteFill style={{ perspective: 1800 }}>
        <AbsoluteFill style={{ transform: `rotateY(${orbit}deg) translateZ(${(1 - enter) * -400}px)`, transformStyle: "preserve-3d" }}>
          {/* artboard */}
          <div style={{ position: "absolute", left: 190, top: 560, transform: `translateX(${fan * 160}px) rotateY(${-fan * 18}deg)`, transformStyle: "preserve-3d" }}>
            <Glass style={{ width: 700, height: 560, display: "grid", placeItems: "center" }} tint={bp.coral} sweepAt={tLogos}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <MarkDraw draw={draw} extrude={extrude} />
            </Glass>
          </div>
          {/* identity pieces fanning out on «تصاميم» */}
          {frame >= tDesigns &&
            [
              { x: 80, y: 600, r: -12, el: <IdentityCard /> },
              { x: 90, y: 940, r: 8, el: <Palette /> },
              { x: 60, y: 1180, r: -4, el: <Poster /> },
            ].map((p, k) => (
              <div key={k} style={{ position: "absolute", left: p.x, top: p.y, transform: `translateZ(${40 + k * 20}px) rotate(${p.r * fan}deg) scale(${fan})`, opacity: fan }}>
                {p.el}
              </div>
            ))}
          {/* social content tiles on «ومحتوى إبداعي» */}
          {frame >= tContent &&
            [0, 1, 2].map((k) => {
              const s = posts(k);
              return (
                <div key={k} style={{ position: "absolute", left: 600 + (k % 2) * 130, top: 1090 + k * 24, transform: `translateZ(${40 + k * 20}px) rotate(${(k - 1) * 6}deg) scale(${s})`, opacity: s }}>
                  <Glass style={{ width: 230, height: 230, display: "grid", placeItems: "center" }} tint={[bp.coral, bp.electric, bp.gold][k]} radius={28}>
                    <div style={{ position: "absolute", inset: 14, borderRadius: 18, background: `linear-gradient(135deg, ${[bp.coral, bp.electric, bp.tealBright][k]}, ${bp.brandNavy})` }} />
                    <Icon name={(["play", "image", "heart"] as const)[k]} size={80} color="#fff" stroke={1.8} />
                  </Glass>
                </div>
              );
            })}
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 290, left: 60, right: 60 }}>
        {frame < tLogos - 4 ? (
          <Headline size={72} words={b3.words.slice(0, 5).map((w) => ({ text: w.raw ?? w.text, at: w.start }))} out={tLogos - 10} />
        ) : (
          <Headline
            size={104}
            words={[
              { text: "شعارات", at: tLogos, color: bp.coral },
              { text: "تصاميم", at: tDesigns, color: "#FFFFFF" },
              { text: "محتوى", at: tContent, color: bp.gold },
              { text: "إبداعي", at: tCreative, color: bp.gold },
            ]}
          />
        )}
      </div>
      <SceneVoice scene={b3} />
      <Sfx name="ui" at={b3.words[0].start} />
      <Sfx name="mech" at={tLogos - 6} />
      <Sfx name="whoosh" at={tDesigns - 3} />
      <Sfx name="pop" at={tContent} />
      <Sfx name="pop" at={tContent + 5} />
      <Sfx name="pop" at={tContent + 10} />
    </Stage>
  );
};

const IdentityCard: React.FC = () => (
  <Glass style={{ width: 300, height: 180, padding: 22 }} tint={bp.electric} radius={22}>
    <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${bp.electric}, ${bp.tealBright})` }} />
    <div style={{ marginTop: 18, height: 12, width: "70%", borderRadius: 6, background: "rgba(255,255,255,0.6)" }} />
    <div style={{ marginTop: 10, height: 10, width: "45%", borderRadius: 5, background: "rgba(255,255,255,0.3)" }} />
  </Glass>
);
const Palette: React.FC = () => (
  <Glass style={{ width: 260, height: 150, padding: 18, display: "flex", gap: 10, alignItems: "center" }} tint={bp.gold} radius={22}>
    {[bp.brandNavy, bp.primary, bp.tealBright, bp.gold, bp.coral].map((c) => (
      <div key={c} style={{ flex: 1, height: 100, borderRadius: 12, background: c }} />
    ))}
  </Glass>
);
const Poster: React.FC = () => (
  <Glass style={{ width: 240, height: 300, padding: 16 }} tint={bp.coral} radius={22}>
    <div style={{ height: 170, borderRadius: 14, background: `linear-gradient(160deg, ${bp.coral}, ${bp.electric})` }} />
    <div style={{ marginTop: 16, height: 14, width: "80%", borderRadius: 7, background: "rgba(255,255,255,0.65)" }} />
    <div style={{ marginTop: 10, height: 10, width: "55%", borderRadius: 5, background: "rgba(255,255,255,0.3)" }} />
  </Glass>
);
