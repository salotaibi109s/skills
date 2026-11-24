import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { C, CutIn, cue, display, getViralScene, Headline, Karaoke, Paper, SceneVoice, Sfx, text, usePop, useShake } from "./base";

const Barcode: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h}>
    {Array.from({ length: 34 }).map((_, i) => (
      <rect key={i} x={(i * w) / 34} y={0} width={i % 3 === 0 ? 7 : i % 2 ? 3 : 5} height={h} fill={C.ink} />
    ))}
  </svg>
);

/** Queue ticket — the hook's scroll-stopping object. */
const Ticket: React.FC<{ out?: number }> = ({ out = 1 }) => (
  <div dir="rtl" style={{ width: 520, height: 640, background: C.paper, borderRadius: 18, boxShadow: "0 40px 80px rgba(13,36,71,0.25)", padding: "44px 40px", display: "flex", flexDirection: "column", alignItems: "center", rotate: "-4deg", translate: `0px ${(1 - out) * 300}px`, maskImage: "radial-gradient(circle 22px at 0 50%, transparent 98%, #000) , radial-gradient(circle 22px at 100% 50%, transparent 98%, #000)", maskComposite: "intersect" }}>
    <div style={{ ...text, fontWeight: 700, fontSize: 34, color: C.muted }}>رقم الانتظار</div>
    <div style={{ ...display, fontSize: 250, lineHeight: 1.05, color: C.ink }}>٢٤٧</div>
    <div style={{ width: "100%", borderTop: `4px dashed ${C.ink}33`, margin: "14px 0 22px" }} />
    <div style={{ display: "flex", alignItems: "center", gap: 12, ...display, fontSize: 46, color: C.red }}>
      <Icon name="user" size={48} color={C.red} stroke={2.4} />
      قبلك ٨٣ عميل
    </div>
    <div style={{ marginTop: "auto" }}>
      <Barcode w={360} h={70} />
    </div>
  </div>
);

/** Calendar page with a "leave" stamp. */
const Calendar: React.FC<{ stampAt: number; label: string; color: string }> = ({ stampAt, label, color }) => {
  const frame = useCurrentFrame();
  const s = usePop(stampAt, 260);
  return (
    <div dir="rtl" style={{ width: 300, height: 330, borderRadius: 26, background: C.paper, boxShadow: "0 24px 50px rgba(13,36,71,0.2)", overflow: "hidden", rotate: "8deg" }}>
      <div style={{ height: 84, background: C.ink, color: "#fff", display: "grid", placeItems: "center", ...display, fontSize: 40 }}>الأحد</div>
      <div style={{ ...display, fontSize: 150, lineHeight: 1.4, textAlign: "center", color: C.ink }}>١٢</div>
      {frame >= stampAt && (
        <div style={{ position: "absolute", left: 30, top: 170, padding: "4px 26px 12px", border: `8px solid ${color}`, borderRadius: 16, color, ...display, fontSize: 58, rotate: "-16deg", scale: String(2.2 - 1.2 * s), opacity: Math.min(1, s * 2), background: "rgba(255,253,248,0.85)" }}>{label}</div>
      )}
    </div>
  );
};

// ============================================================ V1 · HOOK (0–3s)
export const V1Hook: React.FC = () => {
  const scene = getViralScene("V1-Hook");
  const frame = useCurrentFrame();
  const tLeave = cue(scene, "إجازة");
  const tTx = cue(scene, "معاملة");
  const out = interpolate(frame, [0, 8], [0.9, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const punch = interpolate(frame, [tTx, tTx + 4, tTx + 14], [1, 1.09, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = useShake([tLeave, tTx], 14);
  return (
    <AbsoluteFill style={{ translate: shake }}>
      <Paper />
      <AbsoluteFill style={{ scale: String(punch) }}>
        <div style={{ position: "absolute", left: 100, top: 480 }}>
          <Ticket out={out} />
        </div>
        <div style={{ position: "absolute", left: 650, top: 430, scale: "0.8", transformOrigin: "top left" }}>
          <Calendar stampAt={tLeave} label="إجازة" color={C.red} />
        </div>
        {/* clock spinning = time draining */}
        <div style={{ position: "absolute", left: 90, top: 1000, width: 180, height: 180, borderRadius: 90, background: C.paper, border: `10px solid ${C.ink}`, boxShadow: "0 18px 36px rgba(13,36,71,0.2)" }}>
          <div style={{ position: "absolute", left: 76, top: 22, width: 8, height: 64, borderRadius: 4, background: C.ink, transformOrigin: "4px 58px", rotate: `${frame * 22}deg` }} />
          <div style={{ position: "absolute", left: 77, top: 38, width: 6, height: 48, borderRadius: 3, background: C.red, transformOrigin: "3px 42px", rotate: `${frame * 3}deg` }} />
        </div>
      </AbsoluteFill>
      <Headline>
        لسّا تاخذ <span style={{ color: C.red }}>إجازة</span>
        <br />
        عشان معاملة؟
      </Headline>
      <Karaoke scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="print" at={0} />
      <Sfx name="stamp" at={tLeave} />
      <Sfx name="pop" at={tTx} />
    </AbsoluteFill>
  );
};

// ============================================================ V2 · PROMISE (open loop on #3)
const ServiceCard: React.FC<{ icon: IconName; n: string; at: number; locked?: boolean; glow?: number }> = ({ icon, n, at, locked, glow = 0 }) => {
  const frame = useCurrentFrame();
  const p = usePop(at);
  if (frame < at) return null;
  return (
    <div style={{ width: 250, height: 330, borderRadius: 36, background: locked ? C.ink : C.paper, boxShadow: `0 24px 50px rgba(13,36,71,0.18), 0 0 ${glow * 80}px rgba(227,166,58,${glow})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, scale: String(0.5 + 0.5 * p), translate: `0px ${(1 - p) * 120}px` }}>
      <div style={{ ...display, fontSize: 60, color: locked ? C.gold : C.muted }}>{n}</div>
      {locked ? (
        <div style={{ ...display, fontSize: 150, lineHeight: 1, color: C.gold }}>؟</div>
      ) : (
        <div style={{ width: 120, height: 120, borderRadius: 34, background: C.ink, display: "grid", placeItems: "center" }}>
          <Icon name={icon} size={72} color="#fff" stroke={2} />
        </div>
      )}
    </div>
  );
};

export const V2Promise: React.FC = () => {
  const scene = getViralScene("V2-Promise");
  const frame = useCurrentFrame();
  const tThree = cue(scene, "ثلاث");
  const tThings = cue(scene, "أشياء");
  const tPhone = cue(scene, "جوالك");
  const tThird = cue(scene, "والثالثة");
  const big = usePop(tThree, 260);
  const focus = interpolate(frame, [tThird - 4, tThird + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const shake = useShake([tThree], 12);
  return (
    <AbsoluteFill style={{ translate: shake }}>
      <Paper />
      <CutIn>
        <AbsoluteFill style={{ scale: String(1 + focus * 0.22), transformOrigin: "260px 900px" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", ...display, fontSize: 300, lineHeight: 1, color: C.gold, scale: String(interpolate(big, [0, 1], [2, 1])), opacity: Math.min(1, big * 2) * (1 - focus * 0.8) }}>٣</div>
          <div dir="rtl" style={{ position: "absolute", top: 720, left: 80, right: 120, display: "flex", justifyContent: "space-between" }}>
            <ServiceCard icon="document" n="١" at={tThings} />
            <ServiceCard icon="palette" n="٢" at={tThings + 8} />
            <ServiceCard icon="star" n="٣" at={tThings + 16} locked glow={focus} />
          </div>
        </AbsoluteFill>
      </CutIn>
      <Headline at={tThings}>
        ٣ أشياء <span style={{ color: C.goldDeep }}>من جوالك</span>
      </Headline>
      {frame >= tPhone && frame < tThird && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1100, textAlign: "center" }}>
          <span style={{ ...text, fontWeight: 700, fontSize: 36, color: C.muted }}>بدون مشوار · بدون طابور</span>
        </div>
      )}
      <Karaoke scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={0} />
      <Sfx name="stamp" at={tThree} gain={0.7} />
      <Sfx name="pop" at={tThings} />
      <Sfx name="pop" at={tThings + 8} />
      <Sfx name="pop" at={tThings + 16} />
      <Sfx name="riser" at={tThird - 10} />
    </AbsoluteFill>
  );
};

// ============================================================ V3 · ONE: e-services
const Phone: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: 430, height: 820, borderRadius: 64, padding: 14, background: "#0B1220", boxShadow: "0 40px 80px rgba(13,36,71,0.3)" }}>
    <div dir="rtl" style={{ width: "100%", height: "100%", borderRadius: 52, background: "#F4F8FC", padding: "70px 24px 24px", display: "flex", flexDirection: "column", gap: 16, ...text, overflow: "hidden" }}>{children}</div>
  </div>
);

export const V3One: React.FC = () => {
  const scene = getViralScene("V3-One");
  const frame = useCurrentFrame();
  const tSwitch = cue(scene, "الإلكترونية");
  const tOrder = cue(scene, "تطلبها");
  const tTrack = cue(scene, "ودبرها");
  const tDone = cue(scene, "عنك");
  const steps = [
    { t: "تم استلام الطلب", at: tOrder + 6, c: C.teal, i: "check" as IconName },
    { t: "جاري المتابعة", at: tTrack, c: C.gold, i: "clock" as IconName },
    { t: "تم الإنجاز", at: tDone, c: C.green, i: "check" as IconName },
  ];
  const press = frame >= tOrder && frame < tOrder + 5 ? 0.94 : 1;
  return (
    <AbsoluteFill>
      <Paper />
      <Headline>
        <span style={{ color: C.goldDeep }}>١</span> · معاملاتك الإلكترونية
      </Headline>
      {frame < tSwitch ? (
        <CutIn from="right">
          {/* the old way: a pile of papers and car keys, crossed out */}
          <div style={{ position: "absolute", left: 200, top: 520 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ position: "absolute", left: i * 24, top: i * 18, width: 440, height: 560, background: C.paper, borderRadius: 14, boxShadow: "0 16px 30px rgba(13,36,71,0.15)", rotate: `${(i - 1.5) * 5}deg` }}>
                {[0.8, 0.6, 0.9, 0.5].map((w, k) => (
                  <div key={k} style={{ margin: "40px 40px 0", height: 14, width: `${w * 80}%`, borderRadius: 7, background: "#E0D8C8" }} />
                ))}
              </div>
            ))}
          </div>
          <div dir="rtl" style={{ position: "absolute", left: 0, right: 0, top: 1110, textAlign: "center", ...display, fontSize: 56, color: C.red, textDecoration: "line-through", textDecorationThickness: 6 }}>مشوار · طابور · ورق</div>
        </CutIn>
      ) : (
        <CutIn from="left">
          <div style={{ position: "absolute", left: 325, top: 380, scale: "0.95" }}>
            <Phone>
              <div style={{ ...display, fontSize: 34, color: C.ink }}>طلبي</div>
              {steps.map((s) => {
                const on = frame >= s.at;
                return (
                  <div key={s.t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 16px", borderRadius: 22, background: "#fff", boxShadow: "0 6px 14px rgba(13,36,71,0.08)", opacity: on ? 1 : 0.35 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: on ? s.c : "#C9D2DE", display: "grid", placeItems: "center" }}>
                      <Icon name={s.i} size={30} color="#fff" stroke={2.6} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 30, color: C.ink }}>{s.t}</span>
                  </div>
                );
              })}
              <div style={{ marginTop: "auto", height: 84, borderRadius: 24, background: frame >= tOrder ? C.green : C.blue, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 32, scale: String(press) }}>{frame >= tOrder ? "تم إرسال الطلب" : "اطلب الخدمة"}</div>
            </Phone>
          </div>
        </CutIn>
      )}
      <Karaoke scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={0} />
      <Sfx name="whoosh" at={tSwitch} />
      <Sfx name="pop" at={tOrder} />
      <Sfx name="check" at={tOrder + 6} />
      <Sfx name="check" at={tTrack} />
      <Sfx name="ding" at={tDone} />
    </AbsoluteFill>
  );
};

// ============================================================ V4 · TWO: logo
export const V4Two: React.FC = () => {
  const scene = getViralScene("V4-Two");
  const frame = useCurrentFrame();
  const tIdea = cue(scene, "فكرة");
  const tDesign = cue(scene, "لتصميم");
  const tReady = cue(scene, "جاهز");
  const sketch = interpolate(frame, [8, tDesign - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const clean = interpolate(frame, [tDesign, tDesign + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const stamp = usePop(tReady, 260);
  const shake = useShake([tReady], 12);
  return (
    <AbsoluteFill style={{ translate: shake }}>
      <Paper />
      <Headline>
        <span style={{ color: C.goldDeep }}>٢</span> · شعار مشروعك
      </Headline>
      <CutIn from="right">
        <div style={{ position: "absolute", left: 170, top: 430, width: 740, height: 700, borderRadius: 36, background: frame < tDesign ? "#FBF7EE" : "#fff", boxShadow: "0 30px 60px rgba(13,36,71,0.18)", overflow: "hidden" }}>
          {frame < tDesign ? (
            <>
              {/* rough pencil sketch */}
              <svg width="740" height="700" viewBox="0 0 740 700">
                <path d="M210 470 C 230 250, 510 250, 530 470" stroke="#8A8F98" strokeWidth="6" fill="none" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - Math.min(1, sketch * 1.6)} strokeLinecap="round" />
                <path d="M200 480 C 240 270, 500 240, 540 460" stroke="#A8ADB5" strokeWidth="4" fill="none" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - Math.min(1, sketch * 1.4)} />
                <circle cx="370" cy="300" r="56" stroke="#8A8F98" strokeWidth="6" fill="none" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - Math.max(0, Math.min(1, sketch * 2 - 0.6))} />
              </svg>
              {frame >= tIdea && (
                <div dir="rtl" style={{ position: "absolute", right: 40, top: 40, padding: "10px 30px 16px", borderRadius: 999, background: C.ink, color: "#fff", ...display, fontSize: 44 }}>فكرة في راسك</div>
              )}
            </>
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", scale: String(0.8 + 0.2 * clean), opacity: clean }}>
              <svg width="420" height="420" viewBox="0 0 420 420">
                <circle cx="210" cy="210" r="190" fill={C.ink} />
                <path d="M110 290 C 130 120, 290 120, 310 290" stroke={C.gold} strokeWidth="26" fill="none" strokeLinecap="round" />
                <circle cx="210" cy="170" r="44" fill={C.teal} />
              </svg>
              <div style={{ position: "absolute", bottom: 50, ...display, fontSize: 52, color: C.ink }}>مشروعك</div>
            </div>
          )}
        </div>
        {frame >= tReady && (
          <div dir="rtl" style={{ position: "absolute", left: 120, top: 1000, padding: "8px 36px 16px", border: `8px solid ${C.green}`, borderRadius: 20, color: C.green, background: "rgba(255,253,248,0.9)", ...display, fontSize: 72, rotate: "-10deg", scale: String(2 - stamp), opacity: Math.min(1, stamp * 2) }}>جاهز ✓</div>
        )}
      </CutIn>
      <Karaoke scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={0} />
      <Sfx name="pen" at={8} />
      <Sfx name="whoosh" at={tDesign - 2} />
      <Sfx name="stamp" at={tReady} />
    </AbsoluteFill>
  );
};

// ============================================================ V5 · THREE: re-hook + «خدمات أخرى»
export const V5Three: React.FC = () => {
  const scene = getViralScene("V5-Three");
  const frame = useCurrentFrame();
  const tMost = cue(scene, "الأهم");
  const tYours = cue(scene, "خدمتك");
  const tNot = cue(scene, "موجودة");
  const tOrder = cue(scene, "اطلبها");
  const tOther = cue(scene, "خدمات");
  const unlock = usePop(tMost, 200);
  const typed = Math.max(0, Math.min(12, Math.floor((frame - tYours) / 2)));
  const query = "خدمة خاصة…".slice(0, typed);
  const btn = usePop(tOther, 240);
  const toastAt = tOther + 18;
  const toast = usePop(toastAt);
  const reHook = frame < tYours - 4;
  const shake = useShake([tMost], 16);
  return (
    <AbsoluteFill style={{ translate: shake }}>
      <Paper dark={reHook} />
      {reHook ? (
        <CutIn>
          {/* pattern interrupt: dark frame, lock opens */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
            <div style={{ ...display, fontSize: 340, lineHeight: 1, color: C.gold }}>٣</div>
            <svg width="200" height="230" viewBox="0 0 200 230">
              <path d={`M50 ${110 - unlock * 30} V70 a50 50 0 0 1 100 0 V110`} stroke={C.gold} strokeWidth="20" fill="none" strokeLinecap="round" />
              <rect x="20" y="105" width="160" height="120" rx="26" fill={C.gold} />
            </svg>
          </div>
          <Headline dark>
            بس الثالثة <span style={{ color: C.gold }}>هي الأهم</span>
          </Headline>
        </CutIn>
      ) : (
        <CutIn from="left">
          <Headline>
            <span style={{ color: C.goldDeep }}>٣</span> · «خدمات أخرى»
          </Headline>
          <div style={{ position: "absolute", left: 325, top: 380, scale: "0.95" }}>
            <Phone>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 22, background: "#fff", border: `3px solid ${C.blue}` }}>
                <Icon name="cursor" size={32} color={C.muted} stroke={2} />
                <span style={{ fontWeight: 700, fontSize: 30, color: query ? C.ink : C.muted }}>{query || "ابحث عن خدمة"}</span>
              </div>
              {frame >= tNot && (
                <div style={{ padding: "26px 18px", borderRadius: 22, background: "#fff", textAlign: "center" }}>
                  <div style={{ fontWeight: 800, fontSize: 34, color: C.ink }}>ما لقيت خدمتك؟</div>
                  <div style={{ fontWeight: 500, fontSize: 26, color: C.muted, marginTop: 6 }}>اطلبها وإحنا نتواصل معك</div>
                </div>
              )}
              {frame >= tOther && (
                <div style={{ height: 96, borderRadius: 26, background: C.gold, color: C.ink, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 38, scale: String(0.7 + 0.3 * btn), boxShadow: `0 0 ${30 + 30 * Math.sin(frame / 4)}px rgba(227,166,58,0.6)` }}>«خدمات أخرى»</div>
              )}
              {frame >= toastAt && (
                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 12, padding: "18px 16px", borderRadius: 22, background: C.green, color: "#fff", fontWeight: 800, fontSize: 30, scale: String(toast) }}>
                  <Icon name="check" size={34} color="#fff" stroke={3} /> تم استلام طلبك
                </div>
              )}
            </Phone>
          </div>
        </CutIn>
      )}
      <Karaoke scene={scene} dark={reHook} />
      <SceneVoice scene={scene} />
      <Sfx name="riser" at={0} gain={0.8} />
      <Sfx name="stamp" at={tMost} />
      <Sfx name="whoosh" at={tYours - 4} />
      <Sfx name="type" at={tYours} />
      <Sfx name="pop" at={tOther} />
      <Sfx name="ding" at={toastAt} />
      <Sfx name="pop" at={tOrder} gain={0.5} />
    </AbsoluteFill>
  );
};

// ============================================================ V6 · SAVE CTA + loop back to the hook
export const V6Save: React.FC = () => {
  const scene = getViralScene("V6-Save");
  const frame = useCurrentFrame();
  const tSave = cue(scene, "احفظ");
  const tKeep = cue(scene, "وخل");
  const mark = usePop(tSave, 240);
  const fill = interpolate(frame, [tSave + 6, tSave + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Paper />
      <CutIn>
        <Headline>
          احفظه <span style={{ color: C.goldDeep }}>للمعاملة الجاية</span>
        </Headline>
        {/* bookmark (save) */}
        <div style={{ position: "absolute", left: 150, top: 470, scale: String(0.4 + 0.6 * mark), rotate: `${(1 - mark) * -30}deg` }}>
          <svg width="260" height="330" viewBox="0 0 260 330">
            <path d="M30 20 h200 v290 l-100 -70 l-100 70 z" fill={fill > 0.5 ? C.gold : "none"} stroke={C.ink} strokeWidth="18" strokeLinejoin="round" />
          </svg>
        </div>
        {/* the calendar from the hook comes back — now the day is yours (loop) */}
        <div style={{ position: "absolute", left: 560, top: 520 }}>
          <Calendar stampAt={tKeep} label="لك ✓" color={C.green} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
          <div style={{ width: 84, height: 84, borderRadius: 42, background: "#fff", display: "grid", placeItems: "center", boxShadow: "0 8px 20px rgba(13,36,71,0.12)" }}>
            <Img src={staticFile("brand/logo-color.png")} style={{ width: 70 }} />
          </div>
          <div dir="rtl" style={{ ...text, fontWeight: 700, fontSize: 36, color: C.ink }}>
            دبّرها · <span style={{ color: C.muted }}>الرابط في البايو</span>
          </div>
        </div>
      </CutIn>
      <Karaoke scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={0} />
      <Sfx name="pop" at={tSave} />
      <Sfx name="stamp" at={tKeep} />
    </AbsoluteFill>
  );
};
