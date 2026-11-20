import React from "react";
import { Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { ChatTurn, clamp, CommandChip, cue, ease, G, getP, GWords, SANS, Scene, SceneVoice, Sfx, usePop, type PSceneId } from "./base";
import { ShotAngles, ShotBillboard, ShotLife, ShotSocial, ShotStudio } from "./shots";

const PROMPTS = {
  billboard: "ضع هذا المنتج على لوحة إعلانية ضخمة في شارع مدينة ليلاً، بتصوير سينمائي واقعي.",
  social: "صمّم إعلان سوشال ميديا لهذا المنتج، مع عنوان جذاب وثلاث مميزات.",
  studio: "حوّل صورة المنتج إلى لقطة استوديو احترافية على قاعدة رخام، بإضاءة فخمة.",
  angles: "اعرض هذا المنتج من ٨ زوايا مختلفة على خلفية بيضاء، بنفس التفاصيل.",
  life: "ضع المنتج على تسريحة بجانب نافذة وقت الغروب، بتصوير واقعي.",
};
const LABELS = ["لوحة إعلانية", "إعلان سوشال", "لقطة استوديو", "٣٦٠ درجة", "لقطة من الحياة"];

const Line: React.FC<{ d: string[]; size?: number; color?: string; w?: number }> = ({ d, size = 48, color = G.ink, w = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    {d.map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);
const IC = {
  pen: ["M4 20l4-1 11-11-3-3L5 16z", "M14 6l3 3"],
  camera: ["M4 8h4l2-3h4l2 3h4v11H4z", "M12 17a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7z"],
  plus: ["M12 5v14", "M5 12h14"],
  bookmark: ["M6 4h12v17l-6-4-6 4z"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
};

// ============================================================ 1 · HOOK
export const P1Hook: React.FC = () => {
  const scene = getP("P1-Hook");
  const frame = useCurrentFrame();
  const tNo = cue(scene, "بدون");
  const tUp = cue(scene, "ارفع");
  const tCmd = cue(scene, "هالأوامر");
  const photo = usePop(2, 150, 16);
  const fly = ease(frame, tUp - 2, tUp + 18);
  const composer = usePop(tUp - 6, 180, 17);
  const NO = [
    { ic: IC.pen, t: "مصمم", x: 120, at: tNo },
    { ic: IC.camera, t: "تصوير", x: 740, at: cue(scene, "تصوير") },
  ];
  const noPops = [usePop(NO[0].at - 4, 240, 13), usePop(NO[1].at - 4, 240, 13)];
  return (
    <Scene intro={false}>
      {/* the plain phone photo */}
      <div style={{ position: "absolute", left: 540 - 50 - 260 + fly * 40, top: 240 + fly * 620, width: 520, height: 650, scale: String((0.85 + 0.15 * photo) * (1 - fly * 0.78)), rotate: `${(1 - fly) * -4}deg`, transformOrigin: "50% 50%", opacity: Math.min(1, photo * 1.5) * (1 - ease(frame, tUp + 14, tUp + 20)) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 36, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.18)", border: "8px solid #fff" }}>
          <Img src={staticFile("photos/bottle-frosted.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "30% 50%" }} />
        </div>
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 0, bottom: -64, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 30, color: G.gray, opacity: 1 - fly }}>صورة عادية من الجوال</div>
      </div>
      {/* no designer, no photo shoot */}
      {frame >= tNo - 4 &&
        frame < tUp + 4 &&
        NO.map((c, k) => {
          const p = noPops[k];
          const strike = ease(frame, c.at + 4, c.at + 12);
          return (
            <div key={c.t} style={{ position: "absolute", left: c.x - 80, top: 420, width: 160, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, scale: String(frame < c.at - 4 ? 0 : p), opacity: 1 - ease(frame, tUp - 4, tUp + 4) }}>
              <div style={{ position: "relative", width: 130, height: 130, borderRadius: 65, background: "#fff", border: `1.5px solid ${G.border}`, display: "grid", placeItems: "center", boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}>
                <Line d={c.ic} size={60} color={G.gray} />
                <div style={{ position: "absolute", left: 14, right: 14, top: 63, height: 5, borderRadius: 3, background: "#E5484D", rotate: "-40deg", scale: `${strike} 1` }} />
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: G.gray }}>{c.t}</div>
            </div>
          );
        })}
      {/* composer with the attached photo */}
      {frame >= tUp - 6 && (
        <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 1160, scale: String(0.9 + 0.1 * composer), opacity: Math.min(1, composer * 1.4) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 22px", borderRadius: 34, background: "#fff", border: `1.5px solid ${G.border}`, boxShadow: "0 14px 40px rgba(0,0,0,0.08)" }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, border: `1.5px solid ${G.border}`, display: "grid", placeItems: "center" }}>
              <Line d={IC.plus} size={30} color={G.ink} />
            </div>
            <Img src={staticFile("photos/bottle-frosted.jpg")} style={{ width: 86, height: 86, objectFit: "cover", objectPosition: "28% 55%", borderRadius: 16, opacity: ease(frame, tUp + 14, tUp + 22), scale: String(0.6 + 0.4 * ease(frame, tUp + 14, tUp + 22)) }} />
            <div style={{ flex: 1, fontFamily: SANS, fontSize: 32, color: G.muted }}>اسأل أي شيء</div>
            <div style={{ width: 58, height: 58, borderRadius: 29, background: G.ink, display: "grid", placeItems: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5" />
                <path d="M6 11l6-6 6 6" />
              </svg>
            </div>
          </div>
        </div>
      )}
      {/* the five commands */}
      {LABELS.map((l, i) => {
        const at = tCmd - 4 + i * 5;
        const p = usePop(at, 240, 13);
        if (frame < at) return null;
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div key={l} dir="rtl" style={{ position: "absolute", top: 380 + row * 150, left: i === 4 ? 300 : col ? 110 : 510, width: 400, display: "flex", justifyContent: "center", scale: String(p), translate: `0px ${(1 - p) * 120}px` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 30px 24px", borderRadius: 999, background: "#fff", border: `1.5px solid ${G.border}`, boxShadow: "0 12px 30px rgba(0,0,0,0.07)", fontFamily: SANS, fontWeight: 700, fontSize: 36, color: G.ink }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: G.green, color: "#fff", display: "grid", placeItems: "center", fontSize: 24 }}>{["١", "٢", "٣", "٤", "٥"][i]}</div>
              {l}
            </div>
          </div>
        );
      })}
      <GWords scene={scene} top={1420} size={60} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="pop" at={2} />
      <Sfx name="thud" at={tNo + 6} gain={0.6} />
      <Sfx name="thud" at={cue(scene, "تصوير") + 6} gain={0.6} />
      <Sfx name="whoosh" at={tUp - 2} />
      {LABELS.map((l, i) => (
        <Sfx key={l} name="pop" at={tCmd - 4 + i * 5} gain={0.7} />
      ))}
    </Scene>
  );
};

// ============================================================ 2–6 · THE FIVE COMMANDS
const CommandScene: React.FC<{ id: PSceneId; n: string; title: string; prompt: string; revealWord: string; Shot: React.FC }> = ({ id, n, title, prompt, revealWord, Shot }) => {
  const scene = getP(id);
  const revealAt = Math.max(46, cue(scene, revealWord) - 6);
  return (
    <Scene>
      <CommandChip n={n} title={title} />
      <ChatTurn prompt={prompt} revealAt={revealAt}>
        <Shot />
      </ChatTurn>
      <GWords scene={scene} top={1470} size={56} maxWords={5} />
      <SceneVoice scene={scene} />
    </Scene>
  );
};

export const P2Billboard: React.FC = () => <CommandScene id="P2-Billboard" n="١" title="لوحة إعلانية" prompt={PROMPTS.billboard} revealWord="لوحة" Shot={ShotBillboard} />;
export const P3Social: React.FC = () => <CommandScene id="P3-Social" n="٢" title="إعلان سوشال" prompt={PROMPTS.social} revealWord="جاهز" Shot={ShotSocial} />;
export const P4Studio: React.FC = () => <CommandScene id="P4-Studio" n="٣" title="لقطة استوديو" prompt={PROMPTS.studio} revealWord="لتصوير" Shot={ShotStudio} />;
export const P5Angles: React.FC = () => <CommandScene id="P5-Angles" n="٤" title="٣٦٠ درجة" prompt={PROMPTS.angles} revealWord="يعرض" Shot={ShotAngles} />;
export const P6Life: React.FC = () => <CommandScene id="P6-Life" n="٥" title="لقطة من الحياة" prompt={PROMPTS.life} revealWord="لقطة" Shot={ShotLife} />;

// ============================================================ 7 · TIP: SAVE THEM, AND CHECK THE TEXT
export const P7Tip: React.FC = () => {
  const scene = getP("P7-Tip");
  const frame = useCurrentFrame();
  const tCheck = cue(scene, "وقبل");
  const tFix = cue(scene, "الصورة");
  const list = usePop(cue(scene, "احفظ") - 4, 170, 17);
  const swap = ease(frame, tCheck - 4, tCheck + 10);
  const lens = usePop(cue(scene, "راجع"), 200, 14);
  const fixed = frame >= tFix;
  const fixP = usePop(tFix, 260, 12);
  return (
    <Scene>
      {/* saved commands */}
      <div dir="rtl" style={{ position: "absolute", left: 80, right: 140, top: 300, opacity: Math.min(1, list * 1.4) * (1 - swap), translate: `0px ${(1 - list) * 40 - swap * 60}px` }}>
        <div style={{ borderRadius: 30, background: "#fff", border: `1.5px solid ${G.border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.07)", padding: "26px 30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontWeight: 700, fontSize: 38, color: G.ink, marginBottom: 14 }}>
            <Line d={IC.bookmark} size={38} color={G.green} /> أوامري المحفوظة
          </div>
          {LABELS.map((l, i) => {
            const on = frame >= cue(scene, "الأوامر") + i * 5;
            return (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderTop: `1px solid ${G.border}`, opacity: on ? 1 : 0.25 }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: on ? G.green : G.soft2, display: "grid", placeItems: "center" }}>{on && <Line d={IC.check} size={24} color="#fff" w={2.6} />}</div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 34, color: G.ink }}>{l}</div>
              </div>
            );
          })}
        </div>
      </div>
      {/* check the text on the image */}
      {frame >= tCheck - 4 && (
        <div style={{ position: "absolute", left: 80, top: 300, width: 860, height: 960, borderRadius: 28, overflow: "hidden", opacity: swap, scale: String(0.94 + 0.06 * swap) }}>
          <ShotSocialWithTypo fixed={fixed} />
          {/* magnifier on the headline */}
          <div style={{ position: "absolute", left: 430 - 230, top: 150, width: 460, height: 130, borderRadius: 30, border: `5px solid ${fixed ? G.green : "#E5484D"}`, scale: String(lens), boxShadow: "0 0 0 2000px rgba(0,0,0,0.25)" }} />
          <div style={{ position: "absolute", left: 430 + 200, top: 110, width: 76, height: 76, borderRadius: 38, background: fixed ? G.green : "#E5484D", display: "grid", placeItems: "center", scale: String(fixed ? fixP : lens), fontFamily: SANS, fontWeight: 700, fontSize: 44, color: "#fff" }}>
            {fixed ? <Line d={IC.check} size={42} color="#fff" w={3} /> : "!"}
          </div>
        </div>
      )}
      <GWords scene={scene} top={1420} size={58} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="pop" at={cue(scene, "احفظ") - 4} />
      {LABELS.map((l, i) => (
        <Sfx key={l} name="tick" at={cue(scene, "الأوامر") + i * 5} gain={0.7} />
      ))}
      <Sfx name="whoosh" at={tCheck - 4} />
      <Sfx name="boing" at={cue(scene, "راجع")} gain={0.7} />
      <Sfx name="ding" at={tFix} />
    </Scene>
  );
};

/** The social ad again, but with the kind of spelling slip image tools often make in Arabic text. */
const ShotSocialWithTypo: React.FC<{ fixed: boolean }> = ({ fixed }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <ShotSocial />
    <div dir="rtl" style={{ position: "absolute", top: 172, left: 0, right: 0, height: 80, background: "#f6e7e0", display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 600, fontSize: 44, color: "#6b4a3c" }}>{fixed ? "فخامة تدوم معك" : "فخامه تدووم معاك"}</div>
  </div>
);

// ============================================================ 8 · CTA: FOLLOW
export const P8CTA: React.FC = () => {
  const scene = getP("P8-CTA");
  const frame = useCurrentFrame();
  const tFollow = cue(scene, "تابع");
  const logo = usePop(cue(scene, "وإذا") - 6, 150, 12, 0.9);
  const btn = usePop(tFollow - 4, 220, 13);
  const tap = tFollow + 14;
  const tapped = frame >= tap;
  const tapP = usePop(tap, 300, 11);
  const glow = 0.7 + 0.3 * Math.sin(frame / 8);
  return (
    <Scene>
      {Array.from({ length: 36 }).map((_, i) => {
        const t = frame - (cue(scene, "وإذا") - 6);
        const a = random(`a${i}`) * Math.PI * 2;
        const v = 6 + random(`v${i}`) * 12;
        const d = v * t * Math.exp(-t / 40);
        const sz = 6 + random(`s${i}`) * 8;
        return <div key={i} style={{ position: "absolute", left: 490 + Math.cos(a) * d, top: 620 + Math.sin(a) * d * 0.8, width: sz, height: sz, borderRadius: sz / 2, background: i % 2 ? G.green : "#C9C9C9", opacity: Math.max(0, 1 - t / 70) }} />;
      })}
      <div style={{ position: "absolute", left: 540 - 50 - 230, top: 380, width: 460, height: 460, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", scale: String(interpolate(logo, [0, 1], [0.3, 1])), opacity: Math.min(1, logo * 1.6), boxShadow: `0 0 ${50 + 40 * glow}px rgba(16,163,127,${0.18 + 0.12 * glow}), 0 24px 60px rgba(0,0,0,0.12)` }}>
        <Img src={staticFile("brand/logo-color.png")} style={{ width: 380 }} />
      </div>
      {frame >= tFollow - 4 && (
        <div style={{ position: "absolute", left: 0, right: 100, top: 940, display: "flex", justifyContent: "center", scale: String((0.85 + 0.15 * btn) * (tapped ? 1 - 0.06 * (1 - tapP) : 1)) }}>
          <div dir="rtl" style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "22px 56px 26px", borderRadius: 999, background: tapped ? G.green : G.ink, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 52 }}>
            <Line d={tapped ? IC.check : IC.plus} size={46} color="#fff" w={2.6} />
            {tapped ? "تمت المتابعة" : "تابع الحساب"}
            {/* tap ripple */}
            {frame >= tap && frame < tap + 16 && <div style={{ position: "absolute", left: "50%", top: "50%", width: 40 + (frame - tap) * 14, height: 40 + (frame - tap) * 14, marginLeft: -(20 + (frame - tap) * 7), marginTop: -(20 + (frame - tap) * 7), borderRadius: "50%", border: "3px solid rgba(255,255,255,0.8)", opacity: 1 - (frame - tap) / 16 }} />}
          </div>
        </div>
      )}
      {/* finger */}
      {frame >= tFollow && (
        <div style={{ position: "absolute", left: 560, top: interpolate(frame, [tFollow, tap, tap + 20], [1220, 1010, 1060], clamp), opacity: ease(frame, tFollow, tFollow + 6) * (1 - ease(frame, tap + 18, tap + 28)) }}>
          <svg width="90" height="110" viewBox="0 0 90 110">
            <path d="M30 50 V14 a8 8 0 0 1 16 0 V46 l18 4 a10 10 0 0 1 8 11 l-4 30 a12 12 0 0 1-12 10 H38 a12 12 0 0 1-10-5 L10 68 a7 7 0 0 1 10-10 z" fill="#fff" stroke={G.ink} strokeWidth="3.5" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <GWords scene={scene} top={1400} size={62} maxWords={5} />
      <SceneVoice scene={scene} />
      <Sfx name="impact" at={cue(scene, "وإذا") - 6} gain={0.6} />
      <Sfx name="sparkle" at={cue(scene, "وإذا")} />
      <Sfx name="pop" at={tFollow - 4} />
      <Sfx name="ding" at={tap} />
    </Scene>
  );
};
