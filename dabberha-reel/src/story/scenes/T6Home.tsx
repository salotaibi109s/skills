import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain } from "../../components/Backdrop";
import { Icon, type IconName } from "../../components/Icons";
import { Phone } from "../../components/Phone";
import { fonts } from "../../theme";
import { Clock, Person, Plant } from "../art";
import { cue, getStoryScene, SceneVoice, Sfx, story } from "../base";
import { Captions } from "../Captions";

const scene = getStoryScene("T6-Home");

// Requests the store handles; anything not listed is ordered through «خدمات أخرى».
const CHIPS: { label: string; icon: IconName; side: "left" | "right"; y: number }[] = [
  { label: "تجديد الإقامات", icon: "id", side: "right", y: 430 },
  { label: "إصدار الجوازات", icon: "passport", side: "left", y: 520 },
  { label: "التقديم على الوظائف", icon: "briefcase", side: "right", y: 700 },
  { label: "الخدمات الدراسية", icon: "cap", side: "left", y: 790 },
  { label: "سداد الفواتير", icon: "bank", side: "right", y: 970 },
  { label: "عقود الإيجار", icon: "contract", side: "left", y: 1060 },
];

/** Same morning, at home: send the request to Dabberha and get on with the day. */
export const T6Home: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const tSend = cue(scene, "ترسل");
  const tReq = cue(scene, "طلبك");
  const tCarry = cue(scene, "وتكمّل");
  const tDone = cue(scene, "نخلّصها");

  // Room → phone: push into the phone in his hands, then the phone UI takes the frame.
  const zoom = interpolate(frame, [tSend - 24, tSend - 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.3, 1),
  });
  const ui = spring({ frame: frame - (tSend - 8), fps, config: { damping: 200 }, durationInFrames: 14 });

  return (
    <AbsoluteFill style={{ background: "#FBF6EE", overflow: "hidden" }}>
      {/* Living room */}
      <AbsoluteFill
        style={{
          scale: String(1 + zoom * 5),
          transformOrigin: "540px 1072px",
          opacity: 1 - interpolate(frame, [tSend - 10, tSend - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <Room frame={frame} />
      </AbsoluteFill>

      {/* Phone UI */}
      {frame >= tSend - 8 && (
        <AbsoluteFill style={{ background: `linear-gradient(180deg, #FBF6EE 0%, ${story.brand.ice} 100%)`, opacity: ui }}>
          {CHIPS.map((c, i) => (
            <Chip key={c.label} {...c} at={tCarry + i * 5} />
          ))}
          <div style={{ position: "absolute", left: (width - 450) / 2, top: 300, scale: String(0.9 + 0.1 * ui) }}>
            <Phone width={450}>
              <OrderScreen send={tSend} received={tReq + 6} working={tCarry} done={tDone} />
            </Phone>
          </div>
          {CHIPS.map((c, i) => (
            <Sfx key={c.label} name="pop" at={tCarry + i * 5} gain={0.6} />
          ))}
        </AbsoluteFill>
      )}

      <Grain width={width} height={height} opacity={0.05} />
      <Captions scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="notify" at={tSend} />
      <Sfx name="tick" at={tReq + 6} gain={2} />
      <Sfx name="success" at={tDone} />
    </AbsoluteFill>
  );
};

const Room: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill>
    {/* window with morning light */}
    <div style={{ position: "absolute", right: 80, top: 300, width: 380, height: 460, borderRadius: 20, background: "#E9DCC6", padding: 16 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 10, background: `linear-gradient(180deg, #CFE8F5 0%, #FFF3D9 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 40, top: 40, width: 90, height: 90, borderRadius: 45, background: "#FFE7A8" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 12, background: "#E9DCC6" }} />
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 300,
        width: 900,
        height: 1100,
        background: "linear-gradient(225deg, rgba(255,231,168,0.35) 0%, transparent 55%)",
      }}
    />
    {/* wall clock: calm morning */}
    <div style={{ position: "absolute", left: 120, top: 330 }}>
      <Clock hours={7 + 40 / 60} size={170} />
    </div>
    <Plant height={340} style={{ position: "absolute", left: 40, top: 860 }} />
    {/* floor */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1240, bottom: 0, background: "#E3D3BA" }} />
    {/* sofa back (brand teal), behind him */}
    <div style={{ position: "absolute", left: 230, top: 960, width: 620, height: 220, borderRadius: "40px 40px 20px 20px", background: story.brand.teal }} />
    {/* man on the sofa, phone in hand */}
    <Person kind="man" skin={story.skin[0]} height={560} holdingPhone style={{ position: "absolute", left: 423, top: 760 }} />
    {/* seat and arms, in front of him */}
    <div style={{ position: "absolute", left: 250, top: 1150, width: 580, height: 170, borderRadius: 20, background: "#0C868D" }} />
    <div style={{ position: "absolute", left: 190, top: 1060, width: 90, height: 260, borderRadius: 30, background: "#0B7D84" }} />
    <div style={{ position: "absolute", left: 800, top: 1060, width: 90, height: 260, borderRadius: 30, background: "#0B7D84" }} />
    {/* coffee with steam */}
    <div style={{ position: "absolute", left: 900, top: 1120, width: 120, height: 130, borderRadius: 14, background: "#C97B4A" }} />
    <div style={{ position: "absolute", left: 925, top: 1060, width: 70, height: 64, borderRadius: "8px 8px 22px 22px", background: "#fff" }} />
    {[0, 1].map((i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 945 + i * 20,
          top: 990 - ((frame * 0.8 + i * 20) % 40),
          width: 10,
          height: 50,
          borderRadius: 5,
          background: "rgba(255,255,255,0.8)",
          opacity: 0.6 - ((frame * 0.8 + i * 20) % 40) / 70,
          rotate: `${Math.sin(frame / 10 + i) * 12}deg`,
        }}
      />
    ))}
  </AbsoluteFill>
);

const OrderScreen: React.FC<{ send: number; received: number; working: number; done: number }> = ({ send, received, working, done }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sent = spring({ frame: frame - send, fps, config: { damping: 14 } });
  const doneS = spring({ frame: frame - done, fps, config: { damping: 12 } });
  const steps: { label: string; at: number; final?: boolean }[] = [
    { label: "تم استلام طلبك", at: received },
    { label: "جاري التنفيذ", at: working },
    { label: "تم الإنجاز", at: done, final: true },
  ];
  return (
    <AbsoluteFill dir="rtl" style={{ padding: "72px 26px 26px", display: "flex", flexDirection: "column", gap: 18, fontFamily: fonts.text, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("brand/logo-color.png")} style={{ width: 150 }} />
      </div>
      <div style={{ fontWeight: 700, fontSize: 30, color: story.inkSoft }}>طلب جديد</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 18px",
          borderRadius: 20,
          background: story.brand.ice,
          border: `2px solid ${story.brand.mist}`,
          translate: `0px ${-sent * 6}px`,
        }}
      >
        <Icon name="id" size={40} color={story.brand.teal} stroke={2} />
        <div style={{ fontWeight: 700, fontSize: 32, color: story.brand.textOnLight }}>تجديد إقامة</div>
      </div>
      <div
        style={{
          height: 70,
          borderRadius: 18,
          background: frame >= send ? story.brand.teal : story.brand.primary,
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          fontSize: 34,
          scale: String(frame >= send && frame < send + 6 ? 0.95 : 1),
        }}
      >
        {frame >= send ? "تم الإرسال" : "إرسال الطلب"}
      </div>
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 22 }}>
        {steps.map((s) => {
          const on = frame >= s.at;
          const p = spring({ frame: frame - s.at, fps, config: { damping: 14 } });
          const spinning = s.label === "جاري التنفيذ" && on && frame < done;
          return (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 16, opacity: on ? 1 : 0.3 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  display: "grid",
                  placeItems: "center",
                  background: on && !spinning ? (s.final ? "#22A06B" : story.brand.teal) : "#E6EBF0",
                  scale: String(on ? 0.7 + 0.3 * p : 1),
                }}
              >
                {spinning ? (
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      border: `4px solid ${story.brand.teal}`,
                      borderTopColor: "transparent",
                      rotate: `${frame * 14}deg`,
                    }}
                  />
                ) : on ? (
                  <Icon name="check" size={30} color="#fff" stroke={3} />
                ) : null}
              </div>
              <div style={{ fontWeight: 700, fontSize: 32, color: s.final && on ? "#22A06B" : story.brand.textOnLight }}>{s.label}</div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: "auto",
          padding: "22px 0",
          borderRadius: 20,
          background: "#22A06B",
          color: "#fff",
          textAlign: "center",
          fontWeight: 800,
          fontSize: 36,
          opacity: frame >= done ? 1 : 0,
          scale: String(0.8 + 0.2 * doneS),
        }}
      >
        طلبك جاهز
      </div>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{ label: string; icon: IconName; side: "left" | "right"; y: number; at: number }> = ({ label, icon, side, y, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 150 } });
  if (frame < at) return null;
  const float = Math.sin((frame + y) / 24) * 6;
  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        top: y + float,
        [side]: 40,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 18px",
        borderRadius: 999,
        background: "#fff",
        boxShadow: "0 16px 34px rgba(13,36,71,0.16)",
        border: `2px solid ${story.brand.mist}`,
        fontFamily: fonts.text,
        fontWeight: 700,
        fontSize: 28,
        color: story.brand.textOnLight,
        whiteSpace: "nowrap",
        zIndex: 3,
        translate: `${(side === "left" ? -1 : 1) * (1 - s) * 120}px 0px`,
        opacity: Math.min(1, s * 1.6),
        rotate: `${side === "left" ? -2 : 2}deg`,
      }}
    >
      <Icon name={icon} size={32} color={story.brand.teal} stroke={2} />
      {label}
    </div>
  );
};
