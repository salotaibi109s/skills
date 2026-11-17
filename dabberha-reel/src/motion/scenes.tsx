import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { colors } from "../theme";
import { cue, DemoTag, display, getMotionScene, SceneVoice, Sfx, Studio, Subtitle, text, usePop, useShake } from "./base";

// ------------------------------------------------------------------ shared art
const Cup: React.FC<{ w?: number; dull?: number }> = ({ w = 360, dull = 0 }) => (
  <svg width={w} height={w * 0.9} viewBox="0 0 400 360" style={{ overflow: "visible", filter: `saturate(${1 - dull}) brightness(${1 - dull * 0.15})` }}>
    <ellipse cx="200" cy="320" rx="190" ry="34" fill="#E9DCCB" />
    <ellipse cx="200" cy="312" rx="150" ry="22" fill="#D8C7B0" />
    <path d="M70 110 L330 110 L305 290 Q300 315 270 315 L130 315 Q100 315 95 290 Z" fill="#FFFFFF" />
    <path d="M70 110 L330 110 L322 165 L78 165 Z" fill="#F2ECE4" />
    <ellipse cx="200" cy="110" rx="130" ry="26" fill="#6B3A1E" />
    <ellipse cx="200" cy="106" rx="112" ry="18" fill="#8A4E2A" />
    <path d="M326 140 Q395 140 390 200 Q385 255 312 252" stroke="#FFFFFF" strokeWidth="26" fill="none" />
    <path d="M110 200 Q200 230 290 200" stroke="#C98A4B" strokeWidth="14" fill="none" strokeLinecap="round" />
  </svg>
);

const Bean: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <div style={{ width: 40 * s, height: 54 * s, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #9A5A2C, #3A1A0A)", rotate: `${rot}deg`, position: "relative" }}>
    <div style={{ position: "absolute", left: "46%", top: "8%", width: 4 * s, height: "84%", borderRadius: 2, background: "#1E0C04", rotate: "8deg" }} />
  </div>
);

// ============================================================ M1 · HOOK: a dull post with 3 likes
const Post: React.FC<{ likesZoom: number; dull: number }> = ({ likesZoom, dull }) => (
  <div dir="rtl" style={{ width: 760, borderRadius: 34, background: "#fff", overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.5)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 26px" }}>
      <div style={{ width: 70, height: 70, borderRadius: 35, background: "#6B3A1E", display: "grid", placeItems: "center", ...display, fontSize: 32, color: "#F5E6D3" }}>بُنّ</div>
      <div>
        <div style={{ ...text, fontWeight: 700, fontSize: 30, color: "#111" }}>مقهى بُنّ</div>
        <div style={{ ...text, fontSize: 24, color: "#999" }}>قبل شهر</div>
      </div>
    </div>
    <div style={{ height: 600, background: "#D9D4CC", display: "grid", placeItems: "center" }}>
      <Cup w={380} dull={dull} />
    </div>
    <div style={{ padding: "20px 26px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Icon name="heart" size={50} color="#222" stroke={2} />
        <span style={{ ...display, fontSize: 38, color: "#111", display: "inline-block", scale: String(likesZoom), transformOrigin: "right center" }}>٣ إعجابات</span>
      </div>
      <div style={{ ...text, fontSize: 30, color: "#333", marginTop: 10 }}>قهوتنا لذيذة ☕ تعالوا جربوا</div>
    </div>
  </div>
);

export const M1Hook: React.FC = () => {
  const scene = getMotionScene("M1-Hook");
  const frame = useCurrentFrame();
  const tThree = cue(scene, "ثلاث");
  const zoom = interpolate(frame, [0, scene.durationInFrames], [1, 1.06]);
  const sad = usePop(tThree);
  const likes = interpolate(frame, [tThree - 2, tThree + 6], [1, 1.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill>
      <Studio color="#16171C" />
      <div style={{ position: "absolute", left: 160, top: 300, scale: String(zoom), transformOrigin: "380px 700px" }}>
        <Post likesZoom={likes} dull={0.7} />
      </div>
      {frame >= tThree && (
        <div dir="rtl" style={{ position: "absolute", left: 300, top: 640, padding: "10px 34px 18px", borderRadius: 22, background: "#FF5A5A", ...display, fontSize: 64, color: "#fff", rotate: "-7deg", scale: String(0.6 + 0.4 * sad), opacity: sad, boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}>بعد شهر… ٣ بس!</div>
      )}
      <Subtitle scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="sadtap" at={tThree + 4} />
    </AbsoluteFill>
  );
};

// ============================================================ M2 · TWIST: the cup breaks out of the post
export const M2Twist: React.FC = () => {
  const scene = getMotionScene("M2-Twist");
  const frame = useCurrentFrame();
  const tCup = cue(scene, "الكوب");
  const tMove = cue(scene, "يتحرك");
  const push = interpolate(frame, [tCup - 6, tMove], [1, 1.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const wobble = frame > tCup + 20 && frame < tMove ? Math.sin(frame * 1.3) * 3 : 0;
  const broken = frame >= tMove;
  const t = frame - tMove;
  const out = usePop(tMove, 160, 12);
  const shake = useShake([tMove], 22, 10);
  const flash = interpolate(frame, [tMove - 1, tMove, tMove + 6], [0, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ translate: shake }}>
      <Studio color={broken ? "#1B0F0A" : "#16171C"} />
      {!broken ? (
        <div style={{ position: "absolute", left: 160, top: 300, scale: String(1.06 * push), transformOrigin: "380px 640px", rotate: `${wobble}deg` }}>
          <Post likesZoom={1} dull={interpolate(frame, [tCup, tMove], [0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        </div>
      ) : (
        <>
          {/* shards of the old post flying off */}
          {Array.from({ length: 18 }).map((_, i) => {
            const a = random(`a${i}`) * Math.PI * 2;
            const d = t * (18 + random(`d${i}`) * 26);
            return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * d - 60, top: 900 + Math.sin(a) * d - 60, width: 80 + random(`w${i}`) * 90, height: 60 + random(`h${i}`) * 90, background: i % 3 ? "#fff" : "#D9D4CC", clipPath: "polygon(0 0, 100% 20%, 70% 100%, 10% 80%)", rotate: `${t * (i % 2 ? 9 : -9)}deg`, opacity: Math.max(0, 1 - t / 30) }} />;
          })}
          {/* warm glow + the living cup */}
          <AbsoluteFill style={{ background: `radial-gradient(45% 30% at 50% 50%, rgba(217,137,74,${0.45 * out}) 0%, transparent 70%)` }} />
          <div style={{ position: "absolute", left: 540 - 230, top: 640, scale: String(0.6 + 0.6 * out), rotate: `${(1 - out) * -25}deg` }}>
            <Cup w={460} />
          </div>
        </>
      )}
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      <Subtitle scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={tCup - 4} />
      <Sfx name="shatter" at={tMove} />
    </AbsoluteFill>
  );
};

// ============================================================ M3 · CAFÉ mini-ad
export const M3Cafe: React.FC = () => {
  const scene = getMotionScene("M3-Cafe");
  const frame = useCurrentFrame();
  const tWrite = cue(scene, "يكتب");
  const tBeans = cue(scene, "والحبوب");
  const tIdea = cue(scene, "والفكرة");
  const tTwo = cue(scene, "ثانيتين");
  const word = usePop(tWrite, 120, 16);
  const beans = usePop(tBeans, 120, 14);
  const tag = usePop(tIdea, 240);
  const timer = usePop(tTwo, 260);
  return (
    <AbsoluteFill>
      <Studio color="#2B1A12" grid="rgba(245,230,211,0.04)" />
      <DemoTag name="مقهى بُنّ" />
      {/* steam strands */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2].map((i) => {
          const x = 470 + i * 70;
          const ph = frame / 10 + i;
          return <path key={i} d={`M${x} 900 C ${x - 40 + Math.sin(ph) * 30} 820, ${x + 40 + Math.cos(ph) * 30} 760, ${x + Math.sin(ph * 0.7) * 20} 660`} stroke="rgba(245,230,211,0.5)" strokeWidth={14} strokeLinecap="round" fill="none" style={{ filter: "blur(4px)" }} opacity={1 - word * 0.6} />;
        })}
      </svg>
      {/* the steam writes the word */}
      <div dir="rtl" style={{ position: "absolute", left: 0, right: 40, top: 420, textAlign: "center", ...display, fontSize: 190, color: "#F5E6D3", opacity: word, filter: `blur(${(1 - word) * 18}px)`, translate: `0px ${(1 - word) * 60}px`, textShadow: "0 0 40px rgba(245,230,211,0.35)" }}>صباحك</div>
      {/* beans orbit (3D ellipse: back half behind the cup) */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2 + frame / 14;
        const x = 540 + Math.cos(a) * 330 * beans - 20;
        const y = 1060 + Math.sin(a) * 90 * beans - 27;
        const front = Math.sin(a) > 0;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, zIndex: front ? 3 : 1, scale: String((front ? 1.15 : 0.8) * beans), opacity: beans }}>
            <Bean rot={frame * 4 + i * 36} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 540 - 210, top: 870, zIndex: 2 }}>
        <Cup w={420} />
      </div>
      {frame >= tIdea && (
        <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 735, display: "flex", justifyContent: "center", zIndex: 4 }}>
          <div style={{ padding: "10px 40px 18px", borderRadius: 999, background: "#D9894A", color: "#2B1A12", ...display, fontSize: 64, scale: String(interpolate(tag, [0, 1], [1.8, 1])), opacity: Math.min(1, tag * 2), rotate: "-3deg" }}>أول رشفة… تصحّيك</div>
        </div>
      )}
      {frame >= tTwo && (
        <div style={{ position: "absolute", left: 790, top: 1120, zIndex: 5, width: 150, height: 150, borderRadius: 75, background: "#F5E6D3", display: "grid", placeItems: "center", ...display, fontSize: 52, color: "#2B1A12", scale: String(timer), boxShadow: "0 12px 30px rgba(0,0,0,0.4)" }}>٢ث</div>
      )}
      <Subtitle scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="steam" at={tWrite - 8} />
      <Sfx name="beans" at={tBeans} />
      <Sfx name="pop" at={tIdea} />
      <Sfx name="pop" at={tTwo} />
    </AbsoluteFill>
  );
};

// ============================================================ M4 · EXPLAIN: what motion graphics is
export const M4Explain: React.FC = () => {
  const scene = getMotionScene("M4-Explain");
  const frame = useCurrentFrame();
  const tMotion = cue(scene, "الموشن");
  const tShapes = cue(scene, "رسوم");
  const tWords = cue(scene, "وكلمات");
  const tMove = cue(scene, "تتحرك");
  const tStop = cue(scene, "توقف");
  const tMem = cue(scene, "الذاكرة");
  const split = tStop - 14;
  const title = usePop(tMotion, 200);
  const eq = (at: number) => usePop(at, 240);
  const s1 = eq(tShapes);
  const s2 = eq(tWords);
  const s3 = eq(tMove);
  // feed scroll that halts on the moving post
  const scrollT = frame - split;
  const scroll = scrollT < 0 ? 0 : interpolate(scrollT, [0, 14, 16], [0, 1500, 1540], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const bulb = usePop(tMem, 200);
  const stopTag = usePop(tStop + 4);
  const morph = (frame / 20) % 3;
  return (
    <AbsoluteFill>
      <Studio />
      {frame < split ? (
        <>
          <div dir="rtl" style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", ...display, fontSize: 150, lineHeight: 1.05, color: "#fff", scale: String(0.6 + 0.4 * title), opacity: Math.min(1, title * 2) }}>
            موشن <span style={{ color: "#FFC94D" }}>جرافيك</span>
          </div>
          <div dir="rtl" style={{ position: "absolute", top: 640, left: 80, right: 140, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* shapes */}
            <div style={{ width: 210, height: 210, display: "grid", placeItems: "center", scale: String(s1), opacity: s1 }}>
              <div style={{ width: 150, height: 150, background: "#FF5A5A", borderRadius: morph < 1 ? 75 : morph < 2 ? 20 : 0, clipPath: morph >= 2 ? "polygon(50% 0, 100% 100%, 0 100%)" : undefined, rotate: `${frame * 2}deg` }} />
            </div>
            <div style={{ ...display, fontSize: 90, color: "#666", opacity: s2 }}>+</div>
            {/* words */}
            <div style={{ width: 210, height: 210, display: "grid", placeItems: "center", ...display, fontSize: 96, color: "#2EC4B6", scale: String(s2), opacity: s2 }}>أبجد</div>
            <div style={{ ...display, fontSize: 90, color: "#666", opacity: s3 }}>+</div>
            {/* motion */}
            <div style={{ width: 210, height: 210, position: "relative", scale: String(s3), opacity: s3 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ position: "absolute", left: 30 + ((frame * 6 + i * 50) % 150), top: 80, width: 50, height: 50, borderRadius: 25, background: "#FFC94D", opacity: 1 - i * 0.3 }} />
              ))}
            </div>
          </div>
          <div dir="rtl" style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 120, ...text, fontWeight: 700, fontSize: 36, color: "rgba(255,255,255,0.6)" }}>
            <span style={{ opacity: s1 }}>رسوم</span>
            <span style={{ opacity: s2 }}>كلمات</span>
            <span style={{ opacity: s3 }}>حركة</span>
          </div>
        </>
      ) : (
        <>
          {/* phone feed: static posts fly past, the moving one stops the thumb */}
          <div style={{ position: "absolute", left: 270, top: 250, width: 540, height: 1000, borderRadius: 60, border: "14px solid #2A2C35", background: "#0A0B0F", overflow: "hidden" }}>
            <div style={{ translate: `0px ${-scroll}px` }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ height: 300, margin: 14, borderRadius: 24, background: "#22242C", display: "grid", placeItems: "center" }}>
                  <div style={{ width: 120, height: 80, borderRadius: 12, background: "#33363F" }} />
                </div>
              ))}
              {/* the animated post */}
              <div style={{ height: 600, margin: 14, borderRadius: 24, background: "#2B1A12", position: "relative", overflow: "hidden", boxShadow: "0 0 0 4px #FFC94D" }}>
                <div style={{ position: "absolute", left: 120, top: 200, scale: "0.7", rotate: `${Math.sin(frame / 6) * 6}deg` }}>
                  <Cup w={360} />
                </div>
                {Array.from({ length: 6 }).map((_, i) => {
                  const a = (i / 6) * Math.PI * 2 + frame / 10;
                  return (
                    <div key={i} style={{ position: "absolute", left: 230 + Math.cos(a) * 190, top: 340 + Math.sin(a) * 60 }}>
                      <Bean s={0.7} rot={frame * 5 + i * 50} />
                    </div>
                  );
                })}
                <div dir="rtl" style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center", ...display, fontSize: 70, color: "#F5E6D3" }}>صباحك</div>
              </div>
            </div>
          </div>
          {/* thumb */}
          <div style={{ position: "absolute", left: 700, top: interpolate(scrollT, [0, 14], [1050, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), width: 120, height: 120, borderRadius: 60, background: "rgba(255,255,255,0.25)", border: "5px solid rgba(255,255,255,0.7)" }} />
          {frame >= tStop + 4 && (
            <div dir="rtl" style={{ position: "absolute", left: 90, top: 1080, padding: "8px 30px 14px", borderRadius: 999, background: "#FF5A5A", color: "#fff", ...display, fontSize: 48, rotate: "-5deg", scale: String(stopTag) }}>وقّف السكرول ✋</div>
          )}
          {frame >= tMem && (
            <div style={{ position: "absolute", left: 830, top: 300, width: 140, height: 140, borderRadius: 70, background: "#FFC94D", display: "grid", placeItems: "center", scale: String(bulb), boxShadow: `0 0 ${60 * bulb}px rgba(255,201,77,0.8)` }}>
              <Icon name="bulb" size={80} color="#1A1A1A" stroke={2.2} />
            </div>
          )}
        </>
      )}
      <Subtitle scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={tMotion - 4} />
      <Sfx name="pop" at={tShapes} />
      <Sfx name="pop" at={tWords} />
      <Sfx name="pop" at={tMove} />
      <Sfx name="whoosh" at={split} />
      <Sfx name="sadtap" at={tStop + 2} gain={0.5} />
      <Sfx name="pop" at={tMem} />
    </AbsoluteFill>
  );
};

// ============================================================ M5 · BRAND mini-ad (fictional perfume «نَفَس»)
export const M5Brand: React.FC = () => {
  const scene = getMotionScene("M5-Brand");
  const frame = useCurrentFrame();
  const tLogo = cue(scene, "شعارك");
  const tColors = cue(scene, "وألوانك");
  const sweep = interpolate(frame, [6, 40], [-300, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const parts = usePop(tLogo, 120, 14);
  const word = usePop(tLogo + 22, 200);
  const fan = usePop(tColors, 160, 13);
  const palette = ["#0A0A0A", "#D4AF37", "#7A1F2B", "#F3E9DC"];
  const bgIdx = frame >= tColors + 20 ? Math.floor((frame - tColors - 20) / 10) % palette.length : 0;
  const bg = frame >= tColors + 20 ? ["#0A0A0A", "#3A0E15", "#1A1408", "#0A0A0A"][bgIdx] : "#0A0A0A";
  return (
    <AbsoluteFill>
      <Studio color={bg} grid="rgba(212,175,55,0.05)" />
      <DemoTag name="عطر نَفَس" />
      {/* bottle with a light sweep */}
      <div style={{ position: "absolute", left: 120, top: 460, width: 300, height: 560, overflow: "hidden" }}>
        <svg width="300" height="560" viewBox="0 0 300 560">
          <rect x="105" y="0" width="90" height="80" rx="10" fill="#D4AF37" />
          <rect x="125" y="78" width="50" height="50" fill="#B8962E" />
          <rect x="20" y="126" width="260" height="430" rx="40" fill="rgba(212,175,55,0.18)" stroke="#D4AF37" strokeWidth="6" />
          <rect x="60" y="300" width="180" height="120" rx="8" fill="#0A0A0A" stroke="#D4AF37" strokeWidth="3" />
          <text x="150" y="375" textAnchor="middle" fill="#D4AF37" fontSize="44" fontFamily="serif">نَفَس</text>
        </svg>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: sweep, width: 90, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)", rotate: "18deg" }} />
      </div>
      {/* logo assembling from shapes */}
      <div style={{ position: "absolute", left: 500, top: 480, width: 420, height: 420 }}>
        <div style={{ position: "absolute", left: 60, top: 60, width: 300, height: 300, borderRadius: 150, border: "10px solid #D4AF37", translate: `${(1 - parts) * 300}px ${(1 - parts) * -200}px`, opacity: parts }} />
        <div style={{ position: "absolute", left: 200, top: 110, width: 20, height: 200, background: "#D4AF37", translate: `${(1 - parts) * -260}px 0px`, rotate: `${(1 - parts) * 180}deg`, opacity: parts }} />
        <div style={{ position: "absolute", left: 180, top: 150, width: 60, height: 60, background: "#F3E9DC", rotate: `${45 + (1 - parts) * 360}deg`, translate: `0px ${(1 - parts) * 300}px`, opacity: parts }} />
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", ...display, fontSize: 80, color: "#D4AF37", letterSpacing: 6, opacity: word, translate: `0px ${(1 - word) * 30}px` }}>نَفَس</div>
      </div>
      {/* palette fan */}
      {frame >= tColors && (
        <div style={{ position: "absolute", left: 540, top: 1250, width: 0, height: 0 }}>
          {palette.map((c, i) => (
            <div key={c} style={{ position: "absolute", left: -60, top: -250, width: 120, height: 250, borderRadius: 18, background: c, border: "4px solid rgba(255,255,255,0.25)", transformOrigin: "60px 250px", rotate: `${(i - 1.5) * 22 * fan}deg`, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
          ))}
        </div>
      )}
      <Subtitle scene={scene} accent="#D4AF37" />
      <SceneVoice scene={scene} />
      <Sfx name="sweep" at={6} />
      <Sfx name="whoosh" at={tLogo} />
      <Sfx name="impact" at={tLogo + 22} gain={0.6} />
      <Sfx name="pop" at={tColors} />
    </AbsoluteFill>
  );
};

// ============================================================ M6 · STORE mini-ad (fictional «متجر لمسة»)
export const M6Store: React.FC = () => {
  const scene = getMotionScene("M6-Store");
  const frame = useCurrentFrame();
  const tOpen = cue(scene, "ينفتح");
  const tClient = cue(scene, "عميلك");
  const tBuy = cue(scene, "شراء");
  const lid = interpolate(frame, [tOpen, tOpen + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  const rise = usePop(tOpen + 6, 140, 12);
  const cards = usePop(tClient, 160, 12);
  const cx = interpolate(frame, [tClient, tBuy - 2], [980, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const cy = interpolate(frame, [tClient, tBuy - 2], [1450, 1175], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const pressed = frame >= tBuy;
  const press = frame >= tBuy && frame < tBuy + 5 ? 0.92 : 1;
  const shake = useShake([tOpen], 10);
  return (
    <AbsoluteFill style={{ translate: shake }}>
      <Studio color="#FFF4EC" grid="rgba(255,107,91,0.06)" />
      <DemoTag name="متجر لمسة" dark={false} />
      {/* product rising from the box */}
      <div style={{ position: "absolute", left: 540 - 130, top: 720 - rise * 300, opacity: rise }}>
        <svg width="260" height="300" viewBox="0 0 260 300">
          <path d="M60 120 C60 40, 200 40, 200 120" stroke="#2EC4B6" strokeWidth="22" fill="none" strokeLinecap="round" />
          <rect x="30" y="110" width="70" height="120" rx="30" fill="#FF6B5B" />
          <rect x="160" y="110" width="70" height="120" rx="30" fill="#FF6B5B" />
        </svg>
        <div style={{ position: "absolute", top: -30, right: -40, padding: "6px 22px 10px", borderRadius: 999, background: "#2EC4B6", color: "#fff", ...display, fontSize: 36, rotate: "10deg" }}>جديد</div>
      </div>
      {/* the box */}
      <div style={{ position: "absolute", left: 540 - 220, top: 790, width: 440, height: 320 }}>
        <div style={{ position: "absolute", left: 0, top: 60, width: 440, height: 260, borderRadius: 18, background: "#F4A261", boxShadow: "0 30px 60px rgba(244,162,97,0.4)" }}>
          <div style={{ position: "absolute", left: 200, top: 0, width: 40, height: 260, background: "#FF6B5B" }} />
        </div>
        <div style={{ position: "absolute", left: -10, top: 30, width: 460, height: 70, borderRadius: 14, background: "#E76F51", rotate: `${-18 * lid}deg`, translate: `${-140 * lid}px ${-300 * lid}px`, opacity: 1 - 0.85 * lid }}>
          <div style={{ position: "absolute", left: 210, top: 0, width: 40, height: 70, background: "#FF6B5B" }} />
        </div>
      </div>
      {/* review / feature cards flying out */}
      {frame >= tClient &&
        [
          { t: "★★★★★", x: -330, y: -140, r: -10 },
          { t: "توصيل سريع", x: 300, y: -60, r: 8 },
          { t: "تغليف هدية", x: -300, y: 120, r: 6 },
        ].map((c, i) => (
          <div key={i} dir="rtl" style={{ position: "absolute", left: 540 + c.x * cards - 110, top: 760 + c.y * cards, padding: "14px 24px", borderRadius: 20, background: "#fff", boxShadow: "0 14px 30px rgba(0,0,0,0.12)", ...display, fontSize: 34, color: i === 0 ? "#F4A261" : "#2B2D42", rotate: `${c.r}deg`, opacity: cards }}>
            {c.t}
          </div>
        ))}
      {/* buy button + cursor */}
      <div dir="rtl" style={{ position: "absolute", left: 300, top: 1160, width: 480, height: 110, borderRadius: 30, background: pressed ? "#2EC4B6" : "#2B2D42", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 14, ...display, fontSize: 46, scale: String(press) }}>
        <Icon name={pressed ? "check" : "cart"} size={50} color="#fff" stroke={2.4} />
        {pressed ? "تمت الإضافة" : "أضف للسلة"}
      </div>
      <div style={{ position: "absolute", left: cx, top: cy, width: 90, height: 90, borderRadius: 45, background: "rgba(43,45,66,0.2)", border: "5px solid rgba(43,45,66,0.6)", scale: String(press) }} />
      <Subtitle scene={scene} accent="#FF6B5B" />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={0} />
      <Sfx name="box" at={tOpen} />
      <Sfx name="pop" at={tClient} />
      <Sfx name="pop" at={tBuy} />
    </AbsoluteFill>
  );
};

// ============================================================ M7 · REVEAL: rewind → it was all motion graphics
export const M7Reveal: React.FC = () => {
  const scene = getMotionScene("M7-Reveal");
  const frame = useCurrentFrame();
  const tReveal = cue(scene, "موشن");
  const rewindEnd = 40;
  const tl = usePop(rewindEnd, 160, 14);
  const big = usePop(tReveal, 220);
  const play = interpolate(frame, [rewindEnd + 6, scene.durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tracks: { name: string; color: string; icon: IconName }[] = [
    { name: "البخار", color: "#F5E6D3", icon: "sparkle" },
    { name: "الحبوب", color: "#D9894A", icon: "star" },
    { name: "الشعار", color: "#D4AF37", icon: "palette" },
    { name: "الصندوق", color: "#FF6B5B", icon: "box" },
    { name: "النصوص", color: "#2EC4B6", icon: "layers" },
  ];
  return (
    <AbsoluteFill>
      <Studio />
      {frame < rewindEnd ? (
        // fast rewind montage of the three mini-ads
        <AbsoluteFill style={{ filter: `hue-rotate(${frame * 9}deg)` }}>
          {[0, 1, 2].map((i) => {
            const k = Math.floor(frame / 5) % 3;
            if (k !== i) return null;
            return (
              <AbsoluteFill key={i} style={{ background: ["#FFF4EC", "#0A0A0A", "#2B1A12"][i], display: "grid", placeItems: "center" }}>
                {i === 2 ? <Cup w={420} /> : <div style={{ ...display, fontSize: 160, color: i ? "#D4AF37" : "#FF6B5B" }}>{i ? "نَفَس" : "لمسة"}</div>}
              </AbsoluteFill>
            );
          })}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (i * 260 + frame * 40) % 1920, height: 6, background: "rgba(255,255,255,0.35)" }} />
          ))}
          <div style={{ position: "absolute", left: 90, top: 260, ...display, fontSize: 64, color: "#fff", textShadow: "0 0 10px #000" }}>◀◀</div>
        </AbsoluteFill>
      ) : (
        <>
          {/* editor timeline */}
          <div dir="rtl" style={{ position: "absolute", left: 70, right: 130, top: 560, borderRadius: 30, background: "#1A1C24", border: "2px solid #2A2D38", padding: "26px 26px", opacity: tl, translate: `0px ${(1 - tl) * 120}px` }}>
            {tracks.map((t, i) => (
              <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 16, height: 86 }}>
                <div style={{ width: 210, display: "flex", alignItems: "center", gap: 10, ...text, fontWeight: 700, fontSize: 30, color: "#C9CBD3" }}>
                  <Icon name={t.icon} size={34} color={t.color} stroke={2} />
                  {t.name}
                </div>
                <div style={{ flex: 1, height: 46, borderRadius: 12, background: "#252834", position: "relative" }}>
                  <div style={{ position: "absolute", right: `${8 + i * 9}%`, width: `${40 + (i % 3) * 12}%`, top: 6, bottom: 6, borderRadius: 10, background: `${t.color}55`, border: `2px solid ${t.color}` }} />
                  {[0.2, 0.5, 0.8].map((k) => (
                    <div key={k} style={{ position: "absolute", right: `${(8 + i * 9) + k * (40 + (i % 3) * 12)}%`, top: 14, width: 16, height: 16, background: t.color, rotate: "45deg" }} />
                  ))}
                </div>
              </div>
            ))}
            {/* playhead */}
            <div style={{ position: "absolute", top: 10, bottom: 10, right: `calc(236px + ${play * 70}%)`, width: 4, background: "#FF5A5A" }} />
          </div>
          {frame >= tReveal && (
            <div dir="rtl" style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", ...display, fontSize: 150, lineHeight: 1, color: "#fff", scale: String(interpolate(big, [0, 1], [1.8, 1])), opacity: Math.min(1, big * 2), textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>
              موشن <span style={{ color: "#FFC94D" }}>جرافيك</span>
            </div>
          )}
        </>
      )}
      <Subtitle scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="rewind" at={0} />
      <Sfx name="clicks" at={rewindEnd + 2} />
      <Sfx name="impact" at={tReveal} gain={0.7} />
    </AbsoluteFill>
  );
};

// ============================================================ M8 · CTA: Dabbirha creative services
export const M8CTA: React.FC = () => {
  const scene = getMotionScene("M8-CTA");
  const frame = useCurrentFrame();
  const tBrand = cue(scene, "دبرها");
  const tCreative = cue(scene, "الخدمات");
  const tLink = cue(scene, "ورابط");
  const logo = usePop(tBrand, 180);
  const pill = usePop(tCreative, 220);
  const link = usePop(tLink, 220);
  const orbit = usePop(tCreative + 10, 120, 14);
  const intro = usePop(4);
  const sub = usePop(tCreative + 14);
  const bob = frame >= tLink ? Math.abs(Math.sin((frame - tLink) / 6)) * -18 : 0;
  const shake = useShake([tBrand], 14);
  const icons: { i: IconName; c: string }[] = [
    { i: "play", c: "#FFC94D" },
    { i: "sparkle", c: colors.tealBright },
    { i: "store", c: "#FF6B5B" },
  ];
  return (
    <AbsoluteFill style={{ translate: shake }}>
      <Studio color={colors.night} grid="rgba(43,196,196,0.06)" />
      <AbsoluteFill style={{ background: `radial-gradient(50% 30% at 50% 36%, rgba(33,100,155,${0.5 * logo}) 0%, transparent 70%)` }} />
      {frame < tBrand && (
        <div dir="rtl" style={{ position: "absolute", top: 520, left: 0, right: 40, textAlign: "center", ...display, fontSize: 130, color: "#fff", opacity: intro }}>والحلو؟</div>
      )}
      {frame >= tBrand && (
        <div style={{ position: "absolute", left: 540 - 40 - 190, top: 300, width: 380, height: 380, borderRadius: 190, background: "#fff", display: "grid", placeItems: "center", scale: String(interpolate(logo, [0, 1], [0.3, 1])), rotate: `${(1 - logo) * -60}deg`, boxShadow: `0 0 80px rgba(43,196,196,0.5)` }}>
          <Img src={staticFile("brand/logo-color.png")} style={{ width: 310 }} />
        </div>
      )}
      {/* orbiting creative icons */}
      {frame >= tCreative + 10 &&
        icons.map((ic, i) => {
          const a = (i / 3) * Math.PI * 2 + frame / 24;
          return (
            <div key={i} style={{ position: "absolute", left: 500 + Math.cos(a) * 300 * orbit - 50, top: 490 + Math.sin(a) * 240 * orbit - 50, width: 100, height: 100, borderRadius: 28, background: "#16223D", border: `3px solid ${ic.c}`, display: "grid", placeItems: "center", opacity: orbit }}>
              <Icon name={ic.i} size={56} color={ic.c} stroke={2} />
            </div>
          );
        })}
      {frame >= tCreative && (
        <div style={{ position: "absolute", left: 0, right: 80, top: 800, display: "flex", justifyContent: "center" }}>
          <div dir="rtl" style={{ padding: "14px 44px 22px", borderRadius: 999, background: `linear-gradient(135deg, ${colors.primary}, ${colors.teal})`, color: "#fff", ...display, fontSize: 66, scale: String(interpolate(pill, [0, 1], [1.6, 1])), opacity: Math.min(1, pill * 2), boxShadow: "0 18px 40px rgba(14,147,154,0.4)" }}>الخدمات الإبداعية ✨</div>
        </div>
      )}
      {frame >= tCreative + 14 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 80, top: 930, textAlign: "center", ...text, fontWeight: 700, fontSize: 38, color: "rgba(255,255,255,0.75)", opacity: sub }}>موشن جرافيك · إعلانات للمقاهي والبراندات والمتاجر</div>
      )}
      {frame >= tLink && (
        <div style={{ position: "absolute", left: 0, right: 80, top: 1040, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, scale: String(interpolate(link, [0, 1], [1.5, 1])), opacity: Math.min(1, link * 2) }}>
          <svg width="70" height="76" viewBox="0 0 120 130" style={{ translate: `0px ${bob}px` }}>
            <path d="M60 6 L112 62 L80 62 L80 124 L40 124 L40 62 L8 62 Z" fill="#FFC94D" />
          </svg>
          <div dir="rtl" style={{ padding: "12px 44px 20px", borderRadius: 26, background: "#FFC94D", color: colors.night, ...display, fontSize: 60 }}>رابط المتجر في البايو</div>
        </div>
      )}
      <Subtitle scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={2} />
      <Sfx name="impact" at={tBrand} />
      <Sfx name="sweep" at={tCreative} />
      <Sfx name="pop" at={tLink} />
    </AbsoluteFill>
  );
};
