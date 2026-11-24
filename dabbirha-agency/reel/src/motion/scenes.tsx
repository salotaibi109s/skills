import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { colors } from "../theme";
import { Cine, cue, DemoTag, display, getMotionScene, Leak, Photo, SceneVoice, Sfx, Steam, Subtitle, text, usePop, useShake } from "./base";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** A shot that only exists between two frames of the scene (hard cut in / out). */
const Shot: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

/** Offsets the inner clock so a Photo's camera move starts at the cut. */
const Local: React.FC<{ from: number; children: (f: number) => React.ReactNode }> = ({ from, children }) => {
  const frame = useCurrentFrame();
  return <>{children(frame - from)}</>;
};

/** Elegant word reveal: a right-to-left mask wipe with a soft blur. */
const Reveal: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; len?: number }> = ({ at, children, style, len = 16 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + len], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (frame < at) return null;
  return (
    <div dir="rtl" style={{ position: "absolute", clipPath: `inset(0 0 0 ${(1 - p) * 100}%)`, filter: `blur(${(1 - p) * 6}px)`, ...style }}>
      {children}
    </div>
  );
};

// ============================================================ M1 · HOOK: a dull real post with 3 likes
const Post: React.FC<{ flat: number; circle: number }> = ({ flat, circle }) => (
  <div dir="rtl" style={{ width: 780, borderRadius: 30, background: "#fff", overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.55)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 26px" }}>
      <div style={{ width: 66, height: 66, borderRadius: 33, background: "#5A3520", display: "grid", placeItems: "center", ...display, fontSize: 28, color: "#F5E6D3" }}>بُنّ</div>
      <div>
        <div style={{ ...text, fontWeight: 700, fontSize: 30, color: "#111" }}>مقهى بُنّ</div>
        <div style={{ ...text, fontSize: 24, color: "#999" }}>قبل شهر</div>
      </div>
    </div>
    <div style={{ height: 780, position: "relative", overflow: "hidden" }}>
      <Img src={staticFile("photos/cup-steam.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 70%", filter: `contrast(${1 - 0.35 * flat}) saturate(${1 - 0.8 * flat}) brightness(${1 + 0.25 * flat})` }} />
    </div>
    <div style={{ padding: "18px 26px 26px", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Icon name="heart" size={46} color="#222" stroke={2} />
        <span style={{ ...text, fontWeight: 800, fontSize: 34, color: "#111" }}>٣ إعجابات</span>
      </div>
      <div style={{ ...text, fontSize: 28, color: "#444", marginTop: 8 }}>قهوتنا لذيذة، تعالوا جربوا</div>
      {/* hand-drawn red circle around the likes */}
      <svg width="320" height="110" viewBox="0 0 320 110" style={{ position: "absolute", right: 0, top: 4, overflow: "visible" }}>
        <path d="M300 40 C 300 0, 30 0, 18 45 C 8 90, 290 100, 306 55 C 312 38, 290 22, 250 20" stroke="#E53935" strokeWidth="7" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - circle} />
      </svg>
    </div>
  </div>
);

export const M1Hook: React.FC = () => {
  const scene = getMotionScene("M1-Hook");
  const frame = useCurrentFrame();
  const tThree = cue(scene, "ثلاث");
  const zoom = interpolate(frame, [0, scene.durationInFrames], [1, 1.07]);
  const circle = interpolate(frame, [tThree, tThree + 12], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#121316" }}>
      <div style={{ position: "absolute", left: 150, top: 260, scale: String(zoom), transformOrigin: "390px 1000px" }}>
        <Post flat={0.75} circle={circle} />
      </div>
      <Cine amount={0.6} warm={0} />
      <Subtitle scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="sadtap" at={tThree + 6} />
    </AbsoluteFill>
  );
};

// ============================================================ M2 · TWIST: same cup, now graded and alive
export const M2Twist: React.FC = () => {
  const scene = getMotionScene("M2-Twist");
  const frame = useCurrentFrame();
  const tSame = cue(scene, "نفس");
  const tBut = cue(scene, "بس");
  const tMove = cue(scene, "يتحرك");
  // the post zooms into its own photo until the photo fills the frame
  const into = interpolate(frame, [tSame - 10, tBut], [1.07, 3.3], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const full = frame >= tBut;
  const grade = interpolate(frame, [tBut, tMove + 6], [0, 1], clamp);
  const flash = interpolate(frame, [tMove - 1, tMove, tMove + 8], [0, 0.8, 0], clamp);
  const shake = useShake([tMove], 10, 8);
  return (
    <AbsoluteFill style={{ background: "#0B0B0D", translate: shake }}>
      {!full ? (
        <div style={{ position: "absolute", left: 150, top: 260, scale: String(into), transformOrigin: "390px 500px" }}>
          <Post flat={0.75} circle={1} />
        </div>
      ) : (
        <Local from={tBut}>
          {() => (
            <>
              <Photo src="cup-steam.jpg" dur={scene.durationInFrames - tBut + 60} zoom={[1.0, 1.22]} cine={grade * 1.2} flat={0.75 * (1 - grade)} position="50% 72%" origin="50% 70%" />
              <Steam x={560} y={1060} w={360} h={700} opacity={0.55 * grade} />
              <Cine amount={grade} warm={0.8} />
            </>
          )}
        </Local>
      )}
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      <Subtitle scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={tSame - 8} />
      <Sfx name="impact" at={tMove} gain={0.7} />
      <Sfx name="steam" at={tMove + 4} />
    </AbsoluteFill>
  );
};

// ============================================================ M3 · CAFÉ mini-ad (real footage feel)
export const M3Cafe: React.FC = () => {
  const scene = getMotionScene("M3-Cafe");
  const tWrite = cue(scene, "يكتب");
  const tBeans = cue(scene, "والحبوب");
  const tIdea = cue(scene, "والفكرة");
  const tag = usePop(tIdea + 6, 180, 16);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Shot from={0} to={tBeans - 2}>
        <Local from={0}>
          {() => (
            <>
              <Photo src="barista.jpg" dur={tBeans} zoom={[1.08, 1.2]} tilt={[0, -40]} position="50% 60%" />
              <Steam x={600} y={1250} w={300} h={560} opacity={0.35} />
              <Cine warm={0.9} />
              <Reveal at={tWrite} len={20} style={{ left: 0, right: 0, top: 380, textAlign: "center", ...display, fontWeight: 600, fontSize: 200, color: "#F7EBDD", textShadow: "0 0 50px rgba(255,220,180,0.45)" }}>
                صباحك
              </Reveal>
            </>
          )}
        </Local>
      </Shot>
      <Shot from={tBeans - 2} to={tIdea - 2}>
        <Local from={tBeans - 2}>
          {(f) => (
            <>
              <AbsoluteFill style={{ rotate: `${f * 0.12}deg`, scale: "1.25" }}>
                <Photo src="beans.jpg" dur={tIdea - tBeans} zoom={[1.0, 1.12]} />
              </AbsoluteFill>
              <AbsoluteFill style={{ background: "radial-gradient(45% 30% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />
              <Cine warm={1} />
            </>
          )}
        </Local>
      </Shot>
      <Shot from={tIdea - 2} to={scene.durationInFrames}>
        <Local from={tIdea - 2}>
          {() => (
            <>
              <Photo src="cup-warm.jpg" dur={scene.durationInFrames - tIdea + 30} zoom={[1.1, 1.0]} position="50% 55%" />
              <Cine warm={1} />
              {/* café lockup like a real end card */}
              <div dir="rtl" style={{ position: "absolute", top: 330, left: 0, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: tag }}>
                <div style={{ width: 120, height: 2, background: "rgba(247,235,221,0.7)" }} />
                <div style={{ ...display, fontWeight: 600, fontSize: 54, letterSpacing: 4, color: "#F7EBDD" }}>مقهى بُنّ</div>
                <div style={{ width: 120, height: 2, background: "rgba(247,235,221,0.7)" }} />
              </div>
              <Reveal at={tIdea + 10} len={18} style={{ left: 0, right: 40, top: 520, textAlign: "center", ...display, fontWeight: 700, fontSize: 104, lineHeight: 1.15, color: "#fff", textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
                أول رشفة…
                <br />
                <span style={{ color: "#F2B46D" }}>تصحّيك</span>
              </Reveal>
            </>
          )}
        </Local>
      </Shot>
      <Leak at={tBeans - 2} />
      <Leak at={tIdea - 2} />
      <DemoTag name="مقهى بُنّ" />
      <Subtitle scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="steam" at={tWrite - 6} />
      <Sfx name="whoosh" at={tBeans - 4} />
      <Sfx name="beans" at={tBeans} />
      <Sfx name="whoosh" at={tIdea - 4} />
      <Sfx name="sweep" at={tIdea + 10} gain={0.7} />
    </AbsoluteFill>
  );
};

// ============================================================ M4 · EXPLAIN: what it is, and why it stops the thumb
const FeedTile: React.FC<{ src: string; blur?: number; glow?: boolean }> = ({ src, blur = 0, glow }) => (
  <div style={{ height: 520, margin: "0 0 16px", borderRadius: 26, overflow: "hidden", boxShadow: glow ? "0 0 0 5px #F2B46D, 0 0 60px rgba(242,180,109,0.6)" : undefined }}>
    <Img src={staticFile(`photos/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `blur(${blur}px) ${glow ? "contrast(1.15) saturate(1.15)" : "saturate(0.6) brightness(0.8)"}` }} />
  </div>
);

export const M4Explain: React.FC = () => {
  const scene = getMotionScene("M4-Explain");
  const frame = useCurrentFrame();
  const tMotion = cue(scene, "موشن");
  const tImg = cue(scene, "صور");
  const tWords = cue(scene, "وكلام");
  const tMove = cue(scene, "يتحرك");
  const tStop = cue(scene, "يوقف");
  const tMind = cue(scene, "ويعلق");
  const split = tStop - 22;
  const title = usePop(tMotion, 160, 16);
  const a = usePop(tImg, 200, 14);
  const b = usePop(tWords, 200, 14);
  const c = usePop(tMove, 200, 14);
  const scrollT = frame - split;
  const scroll = interpolate(scrollT, [0, 22, 26], [0, 2600, 2640], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blur = interpolate(scrollT, [0, 6, 18, 22], [0, 14, 14, 0], clamp);
  const mind = usePop(tMind, 180, 16);
  const tiles = ["box-closed.jpg", "bottle-frosted.jpg", "beans.jpg", "headphones.jpg", "phone-hand.jpg"];
  return (
    <AbsoluteFill style={{ background: "#0B0B0D" }}>
      {frame < split ? (
        <>
          <AbsoluteFill style={{ opacity: 0.35 }}>
            <Photo src="cup-warm.jpg" dur={split} zoom={[1.2, 1.3]} />
          </AbsoluteFill>
          <AbsoluteFill style={{ background: "rgba(8,8,10,0.6)" }} />
          <div dir="rtl" style={{ position: "absolute", top: 360, left: 0, right: 40, textAlign: "center", ...display, fontSize: 140, lineHeight: 1.05, color: "#fff", opacity: title, letterSpacing: interpolate(title, [0, 1], [30, 0]) }}>
            موشن <span style={{ color: "#F2B46D" }}>جرافيك</span>
          </div>
          <div dir="rtl" style={{ position: "absolute", top: 650, left: 80, right: 140, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {[
              { p: a, label: "صور", node: <Img src={staticFile("photos/cup-steam.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> },
              { p: b, label: "كلام", node: <div style={{ ...display, fontSize: 90, color: "#fff" }}>أبجد</div> },
              { p: c, label: "حركة", node: <div style={{ width: "100%", height: 6, background: "#F2B46D", translate: `${Math.sin(frame / 5) * 40}px 0px`, borderRadius: 3 }} /> },
            ].map((k) => (
              <div key={k.label} style={{ width: 240, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: k.p, translate: `0px ${(1 - k.p) * 40}px` }}>
                <div style={{ width: 240, height: 240, borderRadius: 28, overflow: "hidden", border: "2px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)", display: "grid", placeItems: "center", padding: 0 }}>{k.node}</div>
                <div style={{ ...text, fontWeight: 700, fontSize: 40, color: "rgba(255,255,255,0.85)" }}>{k.label}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Local from={split}>
          {() => (
            <>
              <AbsoluteFill style={{ opacity: 0.55 }}>
                <Photo src="phone-hand.jpg" dur={scene.durationInFrames - split} zoom={[1.15, 1.25]} />
              </AbsoluteFill>
              <AbsoluteFill style={{ background: "rgba(5,5,8,0.55)" }} />
              {/* the feed */}
              <div style={{ position: "absolute", left: 250, top: 260, width: 560, height: 1000, borderRadius: 54, border: "12px solid #1E1F25", background: "#000", overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.6)" }}>
                <div style={{ padding: 16, translate: `0px ${-scroll}px` }}>
                  {tiles.map((t) => (
                    <FeedTile key={t} src={t} blur={blur} />
                  ))}
                  <div style={{ position: "relative" }}>
                    <FeedTile src="cup-steam.jpg" glow />
                    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 520, borderRadius: 26, overflow: "hidden" }}>
                      <Steam x={290} y={430} w={240} h={420} opacity={0.6} />
                      <div dir="rtl" style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", ...display, fontWeight: 600, fontSize: 64, color: "#F7EBDD" }}>صباحك</div>
                    </div>
                  </div>
                </div>
              </div>
              <Reveal at={tStop - split + 6} style={{ left: 0, right: 60, top: 1150 }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ padding: "10px 36px 16px", borderRadius: 18, background: "#F2B46D", color: "#16110C", ...display, fontSize: 52 }}>وقّف السكرول</div>
                </div>
              </Reveal>
              {frame >= tMind && (
                <div dir="rtl" style={{ position: "absolute", left: 0, right: 60, top: 1230, textAlign: "center", ...text, fontWeight: 700, fontSize: 40, color: "#fff", opacity: mind }}>ويعلق ببالك</div>
              )}
            </>
          )}
        </Local>
      )}
      <Cine amount={0.8} />
      <Subtitle scene={scene} top={1340} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={tMotion - 6} />
      <Sfx name="pop" at={tImg} />
      <Sfx name="pop" at={tWords} />
      <Sfx name="pop" at={tMove} />
      <Sfx name="whoosh" at={split} />
      <Sfx name="impact" at={split + 22} gain={0.5} />
    </AbsoluteFill>
  );
};

// ============================================================ M5 · BRAND: the logo lands on a real bottle
export const M5Brand: React.FC = () => {
  const scene = getMotionScene("M5-Brand");
  const frame = useCurrentFrame();
  const tLogo = cue(scene, "شعارك");
  const tColors = cue(scene, "وألوانك");
  const label = interpolate(frame, [tLogo, tLogo + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sweep = interpolate(frame, [tLogo + 14, tLogo + 44], [-200, 500], clamp);
  // photo is 1400×933; cover-fit at height 1920 → ×2.058; bottle face centre at (440, 541)
  const k = 1920 / 933;
  const camZoom = interpolate(frame, [0, tColors], [1, 1.12], clamp);
  const palette = [
    { c: "#1C1C1C", n: "أسود" },
    { c: "#B8945A", n: "ذهبي" },
    { c: "#7A2E3A", n: "عنّابي" },
    { c: "#EFE6DA", n: "عاجي" },
  ];
  const swatch = usePop(tColors + 8, 160, 14);
  const tint = frame >= tColors ? palette[Math.floor((frame - tColors) / 12) % palette.length].c : "transparent";
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {frame < tColors - 2 ? (
        <AbsoluteFill style={{ scale: String(camZoom), transformOrigin: "540px 1113px" }}>
          <div style={{ position: "absolute", left: 540 - 440 * k, top: 0, width: 1400, height: 933, scale: String(k), transformOrigin: "0 0" }}>
            <Img src={staticFile("photos/bottle-blank.jpg")} style={{ width: 1400, height: 933, filter: "contrast(1.25) brightness(0.85)" }} />
            {/* label mapped onto the bottle face */}
            <div style={{ position: "absolute", left: 440 - 95, top: 541 - 62, width: 190, height: 124, rotate: "-18.3deg", opacity: label, overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "#141414", border: "2px solid #B8945A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                <div style={{ fontFamily: display.fontFamily, fontWeight: 600, fontSize: 44, color: "#D9B878", lineHeight: 1.1 }}>نَفَس</div>
                <div style={{ fontFamily: text.fontFamily, fontSize: 11, letterSpacing: 3, color: "rgba(217,184,120,0.8)" }}>EAU DE PARFUM</div>
              </div>
              <div style={{ position: "absolute", top: -20, bottom: -20, left: sweep * 0.4, width: 40, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", rotate: "15deg" }} />
            </div>
          </div>
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25), transparent 30%, transparent 70%, rgba(0,0,0,0.5))" }} />
        </AbsoluteFill>
      ) : (
        <Local from={tColors - 2}>
          {() => (
            <>
              <Photo src="bottle-frosted.jpg" dur={scene.durationInFrames - tColors + 10} zoom={[1.05, 1.14]} position="35% 50%" />
              <AbsoluteFill style={{ background: tint, mixBlendMode: "color", opacity: 0.35 }} />
              <div dir="rtl" style={{ position: "absolute", left: 0, right: 60, top: 1080, display: "flex", justifyContent: "center", gap: 24 }}>
                {palette.map((p, i) => (
                  <div key={p.c} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: swatch, translate: `0px ${(1 - swatch) * (40 + i * 20)}px` }}>
                    <div style={{ width: 110, height: 110, borderRadius: 55, background: p.c, border: "3px solid rgba(255,255,255,0.85)", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }} />
                    <div style={{ ...text, fontWeight: 700, fontSize: 28, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>{p.n}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Local>
      )}
      <Cine amount={0.9} warm={0.3} />
      <Leak at={tColors - 2} />
      <DemoTag name="عطر نَفَس" />
      <Subtitle scene={scene} accent="#D9B878" />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={0} />
      <Sfx name="impact" at={tLogo} gain={0.55} />
      <Sfx name="sweep" at={tLogo + 14} />
      <Sfx name="whoosh" at={tColors - 4} />
      <Sfx name="pop" at={tColors + 8} />
    </AbsoluteFill>
  );
};

// ============================================================ M6 · STORE: box → product → add to cart
export const M6Store: React.FC = () => {
  const scene = getMotionScene("M6-Store");
  const frame = useCurrentFrame();
  const tOpen = cue(scene, "ينفتح");
  const tClient = cue(scene, "زبونك");
  const tBuy = cue(scene, "شراء");
  const card = usePop(tClient + 4, 170, 15);
  const pressed = frame >= tBuy;
  const press = frame >= tBuy && frame < tBuy + 5 ? 0.93 : 1;
  const cx = interpolate(frame, [tClient + 10, tBuy - 2], [930, 640], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const cy = interpolate(frame, [tClient + 10, tBuy - 2], [1480, 1190], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Shot from={0} to={tOpen}>
        <Local from={0}>{() => <><Photo src="box-closed.jpg" dur={tOpen} zoom={[1.15, 1.35]} position="60% 50%" /><Cine amount={0.7} warm={0.8} /></>}</Local>
      </Shot>
      <Shot from={tOpen} to={tClient}>
        <Local from={tOpen}>{() => <><Photo src="box-open.jpg" dur={tClient - tOpen + 10} zoom={[1.3, 1.15]} position="55% 50%" /><Cine amount={0.6} warm={0.7} /></>}</Local>
      </Shot>
      <Shot from={tClient} to={scene.durationInFrames}>
        <Local from={tClient}>
          {() => (
            <>
              <Photo src="headphones.jpg" dur={scene.durationInFrames - tClient} zoom={[1.0, 1.08]} position="45% 50%" cine={0.4} />
              <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.18) 100%)" }} />
            </>
          )}
        </Local>
        {/* product card like a real store page */}
        <div dir="rtl" style={{ position: "absolute", left: 90, right: 150, top: 980, padding: "26px 30px", borderRadius: 30, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", boxShadow: "0 24px 60px rgba(0,0,0,0.18)", translate: `0px ${(1 - card) * 160}px`, opacity: card }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ ...display, fontSize: 46, color: "#16161A" }}>سماعة لمسة</div>
              <div style={{ ...text, fontSize: 28, color: "#F4A72C", marginTop: 2 }}>★★★★★</div>
            </div>
            <div style={{ padding: "6px 18px 10px", borderRadius: 999, background: "#16161A", color: "#fff", ...text, fontWeight: 700, fontSize: 26 }}>جديد</div>
          </div>
          <div style={{ marginTop: 18, height: 96, borderRadius: 22, background: pressed ? "#1E9E5A" : "#16161A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, ...display, fontSize: 40, scale: String(press) }}>
            <Icon name={pressed ? "check" : ("cart" as IconName)} size={42} color="#fff" stroke={2.4} />
            {pressed ? "تمت الإضافة" : "أضف للسلة"}
          </div>
        </div>
        <div style={{ position: "absolute", left: cx, top: cy, width: 86, height: 86, borderRadius: 43, background: "rgba(22,22,26,0.18)", border: "4px solid rgba(22,22,26,0.55)", scale: String(press) }} />
      </Shot>
      <Leak at={tOpen} />
      <Leak at={tClient} />
      <DemoTag name="متجر لمسة" dark={frame < tClient} />
      <Subtitle scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="box" at={tOpen} />
      <Sfx name="whoosh" at={tClient - 3} />
      <Sfx name="pop" at={tClient + 6} />
      <Sfx name="pop" at={tBuy} />
    </AbsoluteFill>
  );
};

// ============================================================ M7 · REVEAL: rewind → the edit timeline
export const M7Reveal: React.FC = () => {
  const scene = getMotionScene("M7-Reveal");
  const frame = useCurrentFrame();
  const tReveal = cue(scene, "موشن");
  const rewindEnd = 50;
  const shots = ["headphones.jpg", "box-open.jpg", "bottle-frosted.jpg", "bottle-blank.jpg", "phone-hand.jpg", "cup-warm.jpg", "beans.jpg", "barista.jpg", "cup-steam.jpg"];
  const tl = usePop(rewindEnd, 150, 15);
  const big = usePop(tReveal, 200, 13);
  const play = interpolate(frame, [rewindEnd + 6, scene.durationInFrames], [0, 1], clamp);
  const tracks = [
    { name: "المقهى", clips: ["barista.jpg", "beans.jpg", "cup-warm.jpg"], c: "#F2B46D" },
    { name: "البراند", clips: ["bottle-blank.jpg", "bottle-frosted.jpg"], c: "#D9B878" },
    { name: "المتجر", clips: ["box-closed.jpg", "box-open.jpg", "headphones.jpg"], c: "#7FC8F8" },
    { name: "النصوص", clips: [], c: "#FFFFFF" },
  ];
  return (
    <AbsoluteFill style={{ background: "#0B0B0D" }}>
      {frame < rewindEnd ? (
        <AbsoluteFill>
          <Photo src={shots[Math.floor(frame / 4) % shots.length]} dur={4} zoom={[1.1, 1.1]} cine={1} />
          <AbsoluteFill style={{ background: "rgba(0,0,0,0.25)" }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (i * 330 + frame * 55) % 1920, height: 8, background: "rgba(255,255,255,0.4)", filter: "blur(1px)" }} />
          ))}
          <div style={{ position: "absolute", left: 90, top: 260, ...display, fontSize: 60, color: "#fff", textShadow: "0 2px 10px #000" }}>◀◀</div>
        </AbsoluteFill>
      ) : (
        <>
          <div dir="rtl" style={{ position: "absolute", left: 60, right: 120, top: 640, borderRadius: 28, background: "#16171D", border: "2px solid #262833", padding: "22px", opacity: tl, translate: `0px ${(1 - tl) * 100}px` }}>
            {tracks.map((t) => (
              <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 14, height: 112 }}>
                <div style={{ width: 150, ...text, fontWeight: 700, fontSize: 30, color: "#C9CBD3" }}>{t.name}</div>
                <div style={{ flex: 1, height: 88, borderRadius: 12, background: "#20222B", display: "flex", gap: 6, padding: 4, overflow: "hidden" }}>
                  {t.clips.length ? (
                    t.clips.map((cl) => (
                      <div key={cl} style={{ flex: 1, borderRadius: 8, overflow: "hidden", border: `2px solid ${t.c}` }}>
                        <Img src={staticFile(`photos/${cl}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))
                  ) : (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 18, padding: "0 14px" }}>
                      {["صباحك", "نَفَس", "أضف للسلة"].map((w) => (
                        <div key={w} style={{ padding: "8px 14px", borderRadius: 8, border: "2px solid #fff", color: "#fff", ...text, fontWeight: 700, fontSize: 24 }}>{w}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div style={{ position: "absolute", top: 10, bottom: 10, right: `calc(186px + ${play * 68}%)`, width: 4, background: "#FF4D4D", boxShadow: "0 0 10px #FF4D4D" }} />
          </div>
          {frame >= tReveal && (
            <div dir="rtl" style={{ position: "absolute", left: 0, right: 40, top: 330, textAlign: "center", ...display, fontSize: 150, lineHeight: 1, color: "#fff", opacity: big, scale: String(interpolate(big, [0, 1], [1.4, 1])) }}>
              موشن <span style={{ color: "#F2B46D" }}>جرافيك</span>
            </div>
          )}
        </>
      )}
      <Cine amount={0.7} />
      <Subtitle scene={scene} top={1340} />
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
  const tLink = cue(scene, "والرابط");
  const logo = usePop(tBrand, 170, 14);
  const pill = usePop(tCreative, 200, 14);
  const line = usePop(tCreative + 16, 200, 16);
  const link = usePop(tLink, 200, 14);
  const cards = usePop(2, 120, 16);
  const away = interpolate(frame, [tBrand - 6, tBrand + 8], [0, 1], clamp);
  const bob = frame >= tLink ? Math.abs(Math.sin((frame - tLink) / 6)) * -16 : 0;
  const shake = useShake([tBrand], 10);
  const deck: { src: string; r: number; x: number }[] = [
    { src: "cup-warm.jpg", r: -10, x: -250 },
    { src: "bottle-frosted.jpg", r: 2, x: 0 },
    { src: "headphones.jpg", r: 12, x: 250 },
  ];
  return (
    <AbsoluteFill style={{ background: colors.night, translate: shake }}>
      <AbsoluteFill style={{ background: `radial-gradient(55% 35% at 50% 38%, rgba(33,100,155,${0.25 + 0.35 * logo}) 0%, transparent 70%)` }} />
      {/* the three ads as real cards, then they part for the logo */}
      {deck.map((d, i) => (
        <div key={d.src} style={{ position: "absolute", left: 540 - 40 - 150 + d.x * (1 + away * 0.9), top: 420 + (1 - cards) * 300 + away * 260 * (i === 1 ? 1.4 : 1), width: 300, height: 440, borderRadius: 26, overflow: "hidden", rotate: `${d.r * (1 + away)}deg`, opacity: cards * (1 - away * 0.75), boxShadow: "0 30px 60px rgba(0,0,0,0.5)", border: "3px solid rgba(255,255,255,0.12)" }}>
          <Img src={staticFile(`photos/${d.src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.1) saturate(1.1)" }} />
        </div>
      ))}
      {frame >= tBrand && (
        <div style={{ position: "absolute", left: 540 - 40 - 180, top: 330, width: 360, height: 360, borderRadius: 180, background: "#fff", display: "grid", placeItems: "center", scale: String(interpolate(logo, [0, 1], [0.4, 1])), opacity: Math.min(1, logo * 2), boxShadow: "0 0 90px rgba(43,196,196,0.45)" }}>
          <Img src={staticFile("brand/logo-color.png")} style={{ width: 290 }} />
        </div>
      )}
      {frame >= tCreative && (
        <div style={{ position: "absolute", left: 0, right: 80, top: 760, display: "flex", justifyContent: "center" }}>
          <div dir="rtl" style={{ padding: "14px 44px 22px", borderRadius: 999, background: `linear-gradient(135deg, ${colors.primary}, ${colors.teal})`, color: "#fff", ...display, fontSize: 64, opacity: Math.min(1, pill * 2), scale: String(interpolate(pill, [0, 1], [1.4, 1])) }}>الخدمات الإبداعية</div>
        </div>
      )}
      {frame >= tCreative + 16 && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 80, top: 890, textAlign: "center", ...text, fontWeight: 700, fontSize: 36, color: "rgba(255,255,255,0.8)", opacity: line }}>موشن جرافيك · إعلانات للمقاهي والبراندات والمتاجر</div>
      )}
      {frame >= tLink && (
        <div style={{ position: "absolute", left: 0, right: 80, top: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: Math.min(1, link * 2), scale: String(interpolate(link, [0, 1], [1.3, 1])) }}>
          <svg width="64" height="70" viewBox="0 0 120 130" style={{ translate: `0px ${bob}px` }}>
            <path d="M60 6 L112 62 L80 62 L80 124 L40 124 L40 62 L8 62 Z" fill="#F2B46D" />
          </svg>
          <div dir="rtl" style={{ padding: "12px 44px 20px", borderRadius: 24, background: "#F2B46D", color: colors.night, ...display, fontSize: 58 }}>الرابط في البايو</div>
        </div>
      )}
      <Cine amount={0.6} warm={0.2} />
      <Subtitle scene={scene} top={1340} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={2} />
      <Sfx name="impact" at={tBrand} />
      <Sfx name="sweep" at={tCreative} />
      <Sfx name="pop" at={tLink} />
    </AbsoluteFill>
  );
};
