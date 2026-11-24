import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain } from "../components/Backdrop";
import { glassStyle } from "../components/Glass";
import { Icon, type IconName } from "../components/Icons";
import { WordLine } from "../components/Kinetic";
import { Captions } from "../story/Captions";
import { colors, fonts } from "../theme";
import { cue, doorColors, getDoorsScene, hall, SceneVoice, Sfx } from "./base";
import { Door } from "./Door";
import { RoomScene } from "./RoomScene";

const DOORS: { color: string; number: string; name: string }[] = [
  { color: doorColors.gov, number: "1", name: "الخدمات الحكومية" },
  { color: doorColors.business, number: "2", name: "التجارة والعمل الحر" },
  { color: doorColors.creative, number: "3", name: "الإبداعية والتسويقية" },
  { color: doorColors.support, number: "4", name: "الدعم والتمويل" },
];

/** A row of the four doors, door 1 on the right (Arabic reading order). */
const DoorRow: React.FC<{ width: number; gap: number; open: (i: number) => number; lit: (i: number) => number; names?: boolean }> = ({
  width,
  gap,
  open,
  lit,
  names,
}) => (
  <div dir="rtl" style={{ display: "flex", gap, justifyContent: "center" }}>
    {DOORS.map((d, i) => (
      <div key={d.number} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <Door width={width} color={d.color} open={open(i)} lit={lit(i)} number={d.number} />
        {names && (
          <div dir="rtl" style={{ width: width + gap, textAlign: "center", fontFamily: fonts.text, fontWeight: 700, fontSize: 28, lineHeight: 1.3, color: hall.ink }}>
            {d.name}
          </div>
        )}
      </div>
    ))}
  </div>
);

// ---------------------------------------------------------------- D0
const s0 = getDoorsScene("D0-Welcome");

export const D0Welcome: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const tName = cue(s0, "دبرها");
  const tFour = cue(s0, "أربعة");
  const tServices = cue(s0, "خدماتك");
  const logo = spring({ frame: frame - (tName - 2), fps, config: { damping: 12, stiffness: 150 } });
  const litAt = (i: number) => tFour + i * 6;
  const push = interpolate(frame, [durationInFrames - 22, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const pulse = (i: number) =>
    frame >= tServices ? 1 + 0.08 * Math.max(0, Math.sin(((frame - tServices - i * 4) / 10) * Math.PI)) * (frame - tServices - i * 4 > 0 && frame - tServices - i * 4 < 10 ? 1 : 0) : 1;

  return (
    <AbsoluteFill style={{ background: hall.wall, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(1 + push * 1.6), transformOrigin: "936px 970px" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1230, bottom: 0, background: `linear-gradient(180deg, ${hall.floor}, ${hall.wallShade})` }} />
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Img
            src={staticFile("brand/logo-color.png")}
            style={{ width: 500, scale: String(0.7 + 0.3 * logo), opacity: frame < tName - 2 ? 0 : Math.min(1, logo * 1.5) }}
          />
        </div>
        <div style={{ position: "absolute", top: 780, left: 0, right: 0 }}>
          <DoorRowPulse pulse={pulse} litAt={litAt} />
        </div>
      </AbsoluteFill>
      <Grain width={width} height={height} opacity={0.045} />
      <Captions scene={s0} />
      <SceneVoice scene={s0} />
      <Sfx name="pop" at={tName - 2} gain={1.2} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} name="lights" at={litAt(i)} gain={0.8} />
      ))}
      <Sfx name="whoosh" at={durationInFrames - 6} />
    </AbsoluteFill>
  );
};

const DoorRowPulse: React.FC<{ pulse: (i: number) => number; litAt: (i: number) => number }> = ({ pulse, litAt }) => {
  const frame = useCurrentFrame();
  return (
    <div dir="rtl" style={{ display: "flex", gap: 34, justifyContent: "center" }}>
      {DOORS.map((d, i) => (
        <div key={d.number} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, scale: String(pulse(i)) }}>
          <Door width={200} color={d.color} open={0} lit={frame >= litAt(i) ? 1 : 0} number={d.number} />
          <div dir="rtl" style={{ width: 230, textAlign: "center", fontFamily: fonts.text, fontWeight: 700, fontSize: 28, lineHeight: 1.3, color: hall.ink, opacity: frame >= litAt(i) ? 1 : 0.25 }}>
            {d.name}
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------- D1–D4
// Names and prices as listed on haxztd.zid.store.
export const D1Government: React.FC = () => (
  <RoomScene
    scene={getDoorsScene("D1-Government")}
    number="1"
    doorLabel="الباب الأول"
    title="الخدمات الحكومية"
    color={doorColors.gov}
    openOn="الخدمات"
    items={[
      { cue: "أبشر", title: "أبشر أفراد", price: 49, icon: "id" },
      { cue: "قوى", title: "قوى أفراد", price: 49, icon: "briefcase" },
      { cue: "التأمينات", title: "التأمينات الاجتماعية", price: 49, icon: "shield" },
      { cue: "العدل", title: "وزارة العدل", price: 99, icon: "scale" },
      { cue: "الإيجار", title: "إصدار عقد تأجير", price: 299, icon: "contract" },
    ]}
  />
);

export const D2Business: React.FC = () => (
  <RoomScene
    scene={getDoorsScene("D2-Business")}
    number="2"
    doorLabel="الباب الثاني"
    title="التجارة والعمل الحر"
    color={doorColors.business}
    openOn="التجارة"
    items={[
      { cue: "وثيقة", title: "وثيقة العمل الحر", price: 149, icon: "document" },
      { cue: "وزارة", title: "خدمات وزارة التجارة", price: 99, icon: "building" },
      { cue: "ومتجرك", title: "متجر إلكتروني متكامل", price: 999, icon: "store" },
    ]}
  />
);

export const D3Creative: React.FC = () => {
  const scene = getDoorsScene("D3-Creative");
  return (
    <RoomScene
      scene={scene}
      number="3"
      doorLabel="الباب الثالث"
      title="الخدمات الإبداعية والتسويقية"
      color={doorColors.creative}
      openOn="الخدمات"
    >
      <CreativeRoom scene={scene} />
    </RoomScene>
  );
};

export const D4Support: React.FC = () => (
  <RoomScene
    scene={getDoorsScene("D4-Support")}
    number="4"
    doorLabel="الباب الرابع"
    title="الدعم والتمويل"
    color={doorColors.support}
    openOn="الدعم"
    items={[
      { cue: "الضمان", title: "الضمان الاجتماعي", price: 99, icon: "home" },
      { cue: "وحساب", title: "حساب المواطن", price: 49, icon: "family" },
      { cue: "وقرض", title: "قرض العمل الحر", price: 199, icon: "loan" },
    ]}
  />
);

/** No specific services are listed for this category on the store, so the room shows the idea, not a product list. */
const CreativeRoom: React.FC<{ scene: ReturnType<typeof getDoorsScene> }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tProject = cue(scene, "مشروعك");
  const tReach = cue(scene, "يوصل");
  const tShow = cue(scene, "ويبان");
  const card = spring({ frame: frame - (tProject - 4), fps, config: { damping: 14 } });
  const line = interpolate(frame, [tReach, tShow + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const glow = spring({ frame: frame - tShow, fps, config: { damping: 10 } });
  const icons: { icon: IconName; x: number; y: number; at: number }[] = [
    { icon: "palette", x: 120, y: 660, at: tProject - 30 },
    { icon: "megaphone", x: 830, y: 660, at: tProject - 20 },
    { icon: "chart", x: 830, y: 1060, at: tReach },
    { icon: "store", x: 110, y: 1080, at: tReach + 6 },
  ];
  return (
    <AbsoluteFill>
      {icons.map((it) => {
        const s = spring({ frame: frame - it.at, fps, config: { damping: 12, stiffness: 150 } });
        return (
          <div
            key={it.icon}
            style={{
              position: "absolute",
              left: it.x,
              top: it.y + Math.sin((frame + it.x) / 20) * 8,
              width: 130,
              height: 130,
              borderRadius: 36,
              background: "#fff",
              boxShadow: "0 20px 40px rgba(13,36,71,0.14)",
              display: "grid",
              placeItems: "center",
              scale: String(frame < it.at ? 0 : s),
              rotate: `${(it.x > 500 ? 1 : -1) * 6}deg`,
            }}
          >
            <Icon name={it.icon} size={70} color={doorColors.creative} stroke={1.8} />
          </div>
        );
      })}
      {/* "your project" card that gets reach and visibility */}
      <div
        style={{
          position: "absolute",
          left: 290,
          top: 700,
          width: 500,
          height: 420,
          borderRadius: 40,
          background: "#fff",
          boxShadow: `0 30px 60px rgba(13,36,71,0.16), 0 0 ${90 * glow}px rgba(224,112,90,${0.55 * glow})`,
          scale: String(frame < tProject - 4 ? 0 : 0.6 + 0.4 * card),
          padding: 34,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: `linear-gradient(135deg, ${doorColors.creative}, ${doorColors.business})` }} />
          <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 44, color: hall.ink }}>مشروعك</div>
        </div>
        <svg width="432" height="230" viewBox="0 0 432 230">
          <path d="M0 220 H432" stroke="#E6DED2" strokeWidth="3" />
          <path
            d="M10 200 C 80 190, 120 160, 170 150 S 260 110, 300 80 S 380 30, 422 18"
            fill="none"
            stroke={doorColors.creative}
            strokeWidth="10"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - line}
          />
        </svg>
      </div>
      <div style={{ position: "absolute", top: 1160, left: 80, right: 80 }}>
        <WordLine
          size={84}
          weight={800}
          color={hall.ink}
          words={[
            { text: "يوصل…", at: tReach },
            { text: "ويبان.", at: tShow, highlight: true },
          ]}
          highlightColor={doorColors.creative}
          mode="scale"
        />
      </div>
      <Sfx name="pop" at={tProject - 4} />
      <Sfx name="shimmer" at={tShow} gain={0.8} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- D5
const s5 = getDoorsScene("D5-Outro");

export const D5Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const tOpen = cue(s5, "مفتوحة");
  const tName = cue(s5, "دبرها");
  const tTrust = cue(s5, "المصداقية");
  const tSpeed = cue(s5, "وسرعة");
  const tDone = cue(s5, "الإنجاز");
  const tUrl = tDone + 14;
  const openAt = (i: number) => tOpen + i * 5;
  const logo = spring({ frame: frame - (tName - 2), fps, config: { damping: 11, stiffness: 160 } });
  const url = spring({ frame: frame - tUrl, fps, config: { damping: 18 } });
  const pull = interpolate(frame, [0, 30], [1.15, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ background: hall.wall, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(pull) }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1100, bottom: 0, background: `linear-gradient(180deg, ${hall.floor}, ${hall.wallShade})` }} />
        <div style={{ position: "absolute", top: 290, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Img src={staticFile("brand/logo-color.png")} style={{ width: 450, scale: String(0.75 + 0.25 * logo), opacity: frame < tName - 2 ? 0.25 : 1 }} />
        </div>
        <div style={{ position: "absolute", top: 720, left: 0, right: 0 }}>
          <DoorRow
            width={180}
            gap={36}
            open={(i) => interpolate(frame, [openAt(i), openAt(i) + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.2, 1) })}
            lit={() => 1}
          />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 1150, left: 80, right: 80 }}>
        <WordLine
          size={70}
          weight={800}
          color={hall.ink}
          words={[
            { text: "المصداقية", at: tTrust, highlight: true },
            { text: "وسرعة", at: tSpeed },
            { text: "الإنجاز", at: tDone, highlight: true },
          ]}
          highlightColor={colors.teal}
        />
      </div>
      <div style={{ position: "absolute", top: 1270, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
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
      <Grain width={width} height={height} opacity={0.045} />
      <SceneVoice scene={s5} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} name="door" at={openAt(i) - 4} gain={0.55} />
      ))}
      <Sfx name="pop" at={tName - 2} gain={1.2} />
      <Sfx name="shimmer" at={tDone} gain={0.7} />
      <Sfx name="pop" at={tUrl} />
    </AbsoluteFill>
  );
};
