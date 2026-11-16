import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { cue, film, FilmLook, FilmSubs, getFolderScene, SceneVoice, Sfx, shake, Spotlight } from "./base";
import { Folder, type StampMark } from "./Folder";

// ============================================================ F1 · HOOK
const s1 = getFolderScene("F1-Hook");

/**
 * 0–5 s. The folder drops through the lamp light in slow motion, speed-ramps
 * into a slam on «هذا», then a dolly-zoom (vertigo) while the title rises
 * *behind* the folder.
 */
export const F1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tThis = cue(s1, "هذا");
  const tFolder = cue(s1, "الملف");
  const tGreen = cue(s1, "الأخضر");
  const SLAM = tThis; // impact lands with the first word

  // Speed ramp: slow fall, then snap down in the last 3 frames.
  const fall = interpolate(frame, [0, SLAM - 3, SLAM], [-760, -260, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const tilt = interpolate(frame, [0, SLAM], [-14, 0], { extrapolateRight: "clamp" });
  const motionBlur = frame < SLAM ? interpolate(frame, [SLAM - 3, SLAM], [3, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const sh = shake(frame, SLAM, 26, 6);
  const squash = frame >= SLAM ? 1 - 0.08 * Math.exp(-(frame - SLAM) / 3) * Math.cos((frame - SLAM) / 1.5) : 1;

  // Dolly zoom: background grows while the folder holds its size (camera pulls back while zooming in).
  const dz = interpolate(frame, [tFolder - 4, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const bgScale = 1 + dz * 0.55;
  const fgScale = 1 - dz * 0.06;
  const lampFlicker = frame < 5 ? [0.2, 1, 0.3, 1, 0.8][frame] : 1;
  const title = (at: number) =>
    spring({ frame: frame - at, fps: 30, config: { damping: 200 }, durationInFrames: 14 });

  return (
    <AbsoluteFill style={{ background: film.dark, overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px`, rotate: `${sh.r}deg` }}>
        {/* background: wall + desk, scaled for the dolly zoom */}
        <AbsoluteFill style={{ scale: String(bgScale), transformOrigin: "50% 62%" }}>
          <AbsoluteFill style={{ background: "radial-gradient(70% 45% at 50% 40%, #2A2119 0%, #0D0B09 75%)" }} />
          <div style={{ position: "absolute", left: -200, right: -200, top: 1230, height: 900, background: `linear-gradient(180deg, ${film.deskLight} 0%, ${film.desk} 40%, #2B1C12 100%)` }} />
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: -200, right: -200, top: 1270 + i * 70, height: 2, background: "rgba(0,0,0,0.18)" }} />
          ))}
        </AbsoluteFill>
        <div style={{ opacity: lampFlicker }}>
          <Spotlight />
        </div>

        {/* title BEHIND the folder */}
        <div dir="rtl" lang="ar" style={{ position: "absolute", top: 470, left: 0, right: 0, textAlign: "center", fontFamily: fonts.display, fontWeight: 800, lineHeight: 1.05 }}>
          <div style={{ fontSize: 120, color: "rgba(255,240,215,0.92)", opacity: title(tFolder), translate: `0px ${(1 - title(tFolder)) * 80}px`, filter: `blur(${(1 - title(tFolder)) * 10}px)` }}>
            الملف العلاقي
          </div>
          <div
            style={{
              fontSize: 230,
              color: film.greenLight,
              textShadow: `0 0 60px rgba(73,174,102,0.55)`,
              opacity: title(tGreen),
              translate: `0px ${(1 - title(tGreen)) * 100}px`,
              filter: `blur(${(1 - title(tGreen)) * 12}px)`,
            }}
          >
            الأخضر
          </div>
        </div>

        {/* the folder */}
        <div
          style={{
            position: "absolute",
            left: 220,
            top: 760,
            translate: `0px ${fall}px`,
            rotate: `${tilt}deg`,
            scale: `${fgScale * (2 - squash)} ${fgScale * squash}`,
            transformOrigin: "50% 100%",
            filter: motionBlur > 0.5 ? `blur(${motionBlur}px)` : "drop-shadow(0 40px 40px rgba(0,0,0,0.6)) drop-shadow(0 -6px 30px rgba(255,214,150,0.25)) brightness(1.08)",
          }}
        >
          <Folder width={640} papers={frame < SLAM ? 0.4 : 1} />
        </div>
        {/* dust burst */}
        {frame >= SLAM && frame < SLAM + 40 && <DustBurst t={frame - SLAM} />}
      </AbsoluteFill>
      <FilmLook vignette={0.85} />
      <SceneVoice scene={s1} />
      <Sfx name="lamp" at={0} />
      <Sfx name="slam" at={SLAM} />
      <Sfx name="boom" at={SLAM} />
      <Sfx name="riser" at={tFolder - 4} gain={0.5} />
    </AbsoluteFill>
  );
};

const DustBurst: React.FC<{ t: number }> = ({ t }) => (
  <>
    {Array.from({ length: 26 }).map((_, i) => {
      const a = (random(`a${i}`) - 0.5) * Math.PI * 0.9 + (random(`side${i}`) > 0.5 ? 0 : Math.PI);
      const v = 6 + random(`v${i}`) * 14;
      const x = 540 + Math.cos(a) * v * t * 2.2;
      const y = 1250 - Math.abs(Math.sin(a)) * v * t * 0.9 + t * t * 0.18;
      const s = 18 + random(`s${i}`) * 40;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: s,
            height: s,
            borderRadius: s,
            background: "rgba(230,205,170,0.35)",
            filter: "blur(8px)",
            opacity: Math.max(0, 1 - t / 40),
          }}
        />
      );
    })}
  </>
);

// ============================================================ F2 · CAREER
const s2 = getFolderScene("F2-Career");

const STAMPS: (StampMark & { cueWord: string; offset: number })[] = [
  { text: "وارد", x: 0.3, y: 0.5, rot: -12, cueWord: "مكتب", offset: 0 },
  { text: "مراجعة", x: 0.68, y: 0.62, rot: 9, cueWord: "مكتب", offset: 9 },
  { text: "صادر", x: 0.42, y: 0.8, rot: -5, cueWord: "لمكتب", offset: 0 },
  { text: "يُحال", x: 0.74, y: 0.36, rot: 14, cueWord: "لمكتب", offset: 9 },
];

/** 5–17 s. Montage of the folder's career: the years, the stamps, the queues, the missing photo. */
export const F2Career: React.FC = () => {
  const frame = useCurrentFrame();
  const tYears = cue(s2, "عاش");
  const tOffice = cue(s2, "من");
  const tQueue = cue(s2, "ومن");
  const tPhoto = cue(s2, "وصورة");
  const tMissing = cue(s2, "ناقصة");
  const stampAt = STAMPS.map((s) => cue(s2, s.cueWord) + s.offset);

  const beat = frame < tOffice - 2 ? "years" : frame < tQueue - 2 ? "stamps" : frame < tPhoto - 2 ? "queue" : "photo";

  return (
    <AbsoluteFill style={{ background: film.dark, overflow: "hidden" }}>
      {beat === "years" && <Years from={tYears} to={tOffice - 2} />}
      {beat === "stamps" && <Stamps stampAt={stampAt} start={tOffice - 2} />}
      {beat === "queue" && <Queue start={tQueue - 2} />}
      {beat === "photo" && <MissingPhoto start={tPhoto - 2} missing={tMissing} />}
      <FilmLook />
      <FilmSubs scene={s2} />
      <SceneVoice scene={s2} />
      {stampAt.map((f, i) => (
        <Sfx key={i} name="stamp" at={f} />
      ))}
      <Sfx name="whoosh" at={tQueue - 4} />
      <Sfx name="zoom" at={tPhoto - 4} />
      <Sfx name="stamp" at={tMissing} gain={1.4} />
    </AbsoluteFill>
  );
};

const DeskBG: React.FC<{ light?: number }> = ({ light = 1 }) => (
  <>
    <AbsoluteFill style={{ background: `radial-gradient(80% 50% at 50% 35%, rgba(60,46,34,${light}) 0%, #0D0B09 80%)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1180, bottom: 0, background: `linear-gradient(180deg, ${film.deskLight}, #2B1C12)`, opacity: 0.9 * light }} />
  </>
);

const Years: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const year = Math.round(interpolate(frame, [from, to], [1420, 1445], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const push = interpolate(frame, [from, to], [1, 1.08]);
  return (
    <AbsoluteFill style={{ scale: String(push) }}>
      <DeskBG />
      <Spotlight />
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 210, color: "rgba(255,235,200,0.18)", direction: "rtl" }}>
        {year} هـ
      </div>
      <div style={{ position: "absolute", left: 240, top: 760, filter: `sepia(${interpolate(year, [1420, 1445], [0.6, 0])})` }}>
        <Folder width={600} />
      </div>
    </AbsoluteFill>
  );
};

const Stamps: React.FC<{ stampAt: number[]; start: number }> = ({ stampAt, start }) => {
  const frame = useCurrentFrame();
  const visible = STAMPS.filter((_, i) => frame >= stampAt[i]);
  const last = Math.max(...stampAt.filter((f) => f <= frame), -999);
  const sh = shake(frame, last, 10, 4);
  // top-down shot: folder lying on the desk, slow rotation
  const rot = interpolate(frame, [start, start + 60], [-6, 2], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
      <AbsoluteFill style={{ background: `radial-gradient(70% 55% at 50% 50%, ${film.deskLight} 0%, ${film.desk} 55%, #22160E 100%)` }} />
      <div style={{ position: "absolute", left: 120, top: 600, rotate: `${rot}deg`, scale: "1.3" }}>
        <Folder width={640} stamps={visible.map((s) => s)} />
      </div>
      {/* the stamp itself, slamming down */}
      {stampAt.map((f, i) => {
        const t = frame - f;
        if (t < -6 || t > 8) return null;
        const y = t < 0 ? interpolate(t, [-6, 0], [-500, 0]) : interpolate(t, [0, 8], [0, -400]);
        const s = STAMPS[i];
        return (
          <div key={i} style={{ position: "absolute", left: 120 + s.x * 832 - 70, top: 600 + s.y * 640 - 260 + y, width: 140, height: 220 }}>
            <div style={{ width: 70, height: 120, margin: "0 auto", borderRadius: "34px 34px 10px 10px", background: "#6B4A2E" }} />
            <div style={{ width: 140, height: 40, borderRadius: 8, background: "#3A2A1C" }} />
            <div style={{ width: 130, height: 16, margin: "0 auto", background: film.ink }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Queue: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  // tracking shot along an endless queue of green folders
  const track = interpolate(frame, [start, start + 75], [-700, -1500], { easing: Easing.inOut(Easing.quad), extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <DeskBG />
      <Spotlight x={540} on={0.6} />
      <div style={{ position: "absolute", top: 860, left: 0, translate: `${track}px 0px`, display: "flex", gap: 40, alignItems: "flex-end" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ filter: `blur(${Math.abs(i - 4) * 1.2}px) brightness(${i === 4 ? 1 : 0.65})` }}>
            <Folder width={i === 4 ? 420 : 380} label={i === 4 ? "معاملتك" : "معاملة"} />
            <div dir="rtl" style={{ textAlign: "center", marginTop: 18, fontFamily: fonts.display, fontWeight: 700, fontSize: 40, color: "rgba(255,235,200,0.7)" }}>
              {187 + i}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const MissingPhoto: React.FC<{ start: number; missing: number }> = ({ start, missing }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [start, start + 10], [1.6, 2.4], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const big = spring({ frame: frame - missing, fps: 30, config: { damping: 9, stiffness: 180 } });
  const flash = interpolate(frame, [missing, missing + 8], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sh = shake(frame, missing, 16, 5);
  return (
    <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
      <DeskBG />
      <Spotlight />
      <div style={{ position: "absolute", left: 230, top: 760, scale: String(zoom), transformOrigin: "78% 40%" }}>
        <Folder width={600} photo="missing" />
      </div>
      {frame >= missing && (
        <div
          dir="rtl"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 860,
            display: "flex",
            justifyContent: "center",
            scale: String(2.4 - 1.4 * big),
            rotate: "-10deg",
          }}
        >
          <div
            style={{
              padding: "10px 40px",
              border: `10px solid ${film.ink}`,
              borderRadius: 18,
              color: film.ink,
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 150,
              background: "rgba(255,240,230,0.85)",
            }}
          >
            ناقصة
          </div>
        </div>
      )}
      <AbsoluteFill style={{ background: film.ink, opacity: flash, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};
