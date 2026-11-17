import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import {
  BUG,
  Bits,
  CANVAS_MONSTER,
  CHECK_COIN,
  cue,
  Dialog,
  getGameScene,
  HERO_A,
  HERO_B,
  LevelBG,
  pal,
  PAPER_MONSTER,
  PixelBox,
  PixelText,
  SceneVoice,
  Screen,
  Sfx,
  shakeAt,
  Sprite,
} from "./base";

const HERO_PS = 16; // hero sprite: 12×18 px → 192×288 on screen

// ============================================================ G1 · GAME OVER (the hook)
const g1 = getGameScene("G1-GameOver");

export const G1GameOver: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const SLAM = 8;
  const drop = interpolate(frame, [3, SLAM], [-700, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const staticNoise = frame < 4;
  const contAt = durationInFrames - 34;
  const count = Math.max(0, 9 - Math.floor((frame - contAt) / 6));
  const monsterHop = Math.abs(Math.sin(frame / 5)) * 40;
  return (
    <Screen bg={pal.black} wipeIn={false}>
      <AbsoluteFill style={{ translate: shakeAt(frame, SLAM, 30) }}>
        {/* TV static on the very first frames — a pattern interrupt */}
        {staticNoise &&
          Array.from({ length: 400 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: (i % 20) * 54, top: Math.floor(i / 20) * 96, width: 54, height: 96, background: random(`st${frame}-${i}`) > 0.5 ? "#D9D9D9" : "#1A1A1A" }} />
          ))}
        {!staticNoise && (
          <>
            <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", justifyContent: "center", translate: `0px ${drop}px` }}>
              <PixelText text="GAME OVER" px={22} scale={7.2} color={pal.red} shadow={pal.black} outline={pal.white} font="text" />
            </div>
            {/* the hero, knocked down; the paper monster celebrating */}
            <div style={{ position: "absolute", left: 180, top: 840, rotate: "-90deg", filter: "grayscale(0.6)" }}>
              <Sprite map={HERO_A} ps={20} />
            </div>
            <div style={{ position: "absolute", left: 640, top: 1140 - 240 - monsterHop }}>
              <Sprite map={PAPER_MONSTER} ps={20} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1140, height: 24, background: pal.navy }} />
            {frame >= contAt && (
              <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.floor(frame / 6) % 2 ? 1 : 0.4 }}>
                <PixelText text={`متابعة؟ ${count}`} px={18} scale={6} color={pal.gold} shadow={pal.black} />
              </div>
            )}
          </>
        )}
      </AbsoluteFill>
      <Dialog scene={g1} />
      <SceneVoice scene={g1} />
      <Sfx name="crash" at={SLAM} />
      <Sfx name="gameover" at={SLAM + 2} />
      <Sfx name="blip" at={contAt} />
    </Screen>
  );
};

// ============================================================ G2 · RETRY MENU
const g2 = getGameScene("G2-Menu");

export const G2Menu: React.FC = () => {
  const frame = useCurrentFrame();
  const tSame = cue(g2, "بنفس");
  const tOr = cue(g2, "ولا");
  const tRight = cue(g2, "صح");
  const sel = frame >= tOr ? 1 : 0;
  const picked = frame >= tRight;
  const flash = picked && frame < tRight + 4;
  const blink = Math.floor(frame / 7) % 2 === 0;
  const options = [
    { title: "نفس الطريقة", sub: "طابور + زحمة + راجعنا بكرة", color: pal.grey },
    { title: "دبّرها", sub: "من جوالك… وتخلص", color: pal.mint },
  ];
  return (
    <Screen bg={pal.night}>
      <div style={{ position: "absolute", top: 320, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <PixelText text="إعادة المحاولة؟" px={20} scale={6} color={pal.white} shadow={pal.black} outline={pal.navy} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 500 }}>
        <PixelBox style={{ padding: "34px 36px", display: "flex", flexDirection: "column", gap: 28 }}>
          {options.map((o, i) => {
            const active = sel === i && frame >= tSame;
            const chosen = picked && i === 1;
            return (
              <div key={o.title} dir="rtl" style={{ display: "flex", alignItems: "center", gap: 26, padding: "18px 20px", background: chosen && flash ? pal.white : active ? "rgba(127,240,216,0.12)" : "transparent", outline: active ? `6px solid ${o.color}` : "none" }}>
                <div style={{ width: 0, height: 0, borderTop: "22px solid transparent", borderBottom: "22px solid transparent", borderRight: `30px solid ${pal.gold}`, opacity: active && (blink || picked) ? 1 : 0 }} />
                {i === 1 && <Img src={staticFile("pixel/logo-40.png")} style={{ width: 160, imageRendering: "pixelated", background: pal.white, padding: 6 }} />}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <PixelText text={o.title} px={18} scale={5} color={i === 1 ? pal.mint : pal.white} shadow={pal.black} />
                  <PixelText text={o.sub} px={14} scale={3} color={o.color} />
                </div>
              </div>
            );
          })}
        </PixelBox>
      </div>
      <Dialog scene={g2} />
      <SceneVoice scene={g2} />
      <Sfx name="blip" at={tSame} />
      <Sfx name="blip" at={tOr} />
      <Sfx name="select" at={tRight} />
    </Screen>
  );
};

// ============================================================ G3 · POWER-UP + STATS
const g3 = getGameScene("G3-PowerUp");

export const G3PowerUp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tName = cue(g3, "دبرها");
  const tOpen = cue(g3, "تنفتح");
  const tAbil = cue(g3, "قدرات");
  const tTrust = cue(g3, "المصداقية");
  const tSpeed = cue(g3, "وسرعة");
  const GRAB = tName + 26;
  const itemY = interpolate(frame, [tName - 6, GRAB - 8], [260, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const jump = frame >= GRAB - 10 && frame < GRAB + 8 ? Math.sin(((frame - (GRAB - 10)) / 18) * Math.PI) * 180 : 0;
  const glow = frame >= GRAB ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
  const panel = spring({ frame: frame - (tAbil - 4), fps, config: { damping: 200 }, durationInFrames: 10 });
  const bar = (at: number) => interpolate(frame, [at, at + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stats = [
    { label: "المصداقية", at: tTrust, color: pal.teal },
    { label: "سرعة الإنجاز", at: tSpeed, color: pal.gold },
  ];
  return (
    <Screen>
      <LevelBG />
      {/* power-up item: the Dabbirha logo as a pixel crystal */}
      {frame >= tName - 6 && frame < GRAB && (
        <div style={{ position: "absolute", left: 460, top: itemY + Math.sin(frame / 4) * 10, padding: 10, background: pal.gold, border: `8px solid ${pal.black}`, boxShadow: `0 0 0 6px ${pal.white}` }}>
          <Img src={staticFile("pixel/logo-24.png")} style={{ width: 144, imageRendering: "pixelated", display: "block", background: pal.white }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 444, top: 852 - jump, filter: glow ? `drop-shadow(0 0 ${18 * glow}px ${pal.mint}) drop-shadow(0 0 ${8 * glow}px ${pal.gold})` : undefined }}>
        <Sprite map={Math.floor(frame / 8) % 2 ? HERO_A : HERO_B} ps={HERO_PS} />
      </div>
      <Bits at={GRAB} x={540} y={900} count={30} seed="pu" />
      {frame >= tOpen && frame < tAbil - 4 && (
        <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <PixelText text="تم تفعيل: دبّرها!" px={18} scale={6} color={pal.mint} shadow={pal.black} outline={pal.navy} />
        </div>
      )}
      {frame >= tAbil - 4 && (
        <div style={{ position: "absolute", left: 90, right: 90, top: 300, opacity: panel }}>
          <PixelBox style={{ padding: "30px 34px", display: "flex", flexDirection: "column", gap: 26 }}>
            <PixelText text="قدرات جديدة" px={16} scale={4} color={pal.gold} shadow={pal.black} />
            {stats.map((s) => (
              <div key={s.label} dir="rtl" style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 300, display: "flex", justifyContent: "flex-start" }}>
                  <PixelText text={s.label} px={16} scale={3.4} color={pal.white} />
                </div>
                <div style={{ flex: 1, height: 44, background: pal.black, border: `6px solid ${pal.white}`, display: "flex", gap: 4, padding: 4, direction: "rtl" }}>
                  {Array.from({ length: 10 }).map((_, k) => (
                    <div key={k} style={{ flex: 1, background: bar(s.at) * 10 > k ? s.color : "transparent" }} />
                  ))}
                </div>
                <div style={{ width: 120 }}>{bar(s.at) >= 1 && <PixelText text="MAX" px={14} scale={3.4} color={pal.gold} font="text" />}</div>
              </div>
            ))}
          </PixelBox>
        </div>
      )}
      <Dialog scene={g3} />
      <SceneVoice scene={g3} />
      <Sfx name="jump" at={GRAB - 10} />
      <Sfx name="powerup" at={GRAB} />
      <Sfx name="fill" at={tTrust} />
      <Sfx name="fill" at={tSpeed} />
    </Screen>
  );
};

// ============================================================ levels
const LevelHUD: React.FC<{ n: number; done: number }> = ({ n, done }) => (
  <div dir="rtl" style={{ position: "absolute", top: 268, left: 70, right: 70, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <PixelText text={`المرحلة ${n}`} px={16} scale={4} color={pal.white} shadow={pal.black} />
    <div style={{ display: "flex", gap: 14 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ opacity: i < done ? 1 : 0.25 }}>
          <Sprite map={CHECK_COIN} ps={6} />
        </div>
      ))}
    </div>
  </div>
);

const LevelBanner: React.FC<{ text: string; at: number; out: number }> = ({ text, at, out }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [at, at + 6, out, out + 6], [1100, 0, 0, -1100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < at || frame > out + 6) return null;
  return (
    <div style={{ position: "absolute", top: 560, left: 0, right: 0, height: 200, background: pal.black, borderTop: `10px solid ${pal.gold}`, borderBottom: `10px solid ${pal.gold}`, display: "flex", alignItems: "center", justifyContent: "center", translate: `${x}px 0px` }}>
      <PixelText text={text} px={18} scale={6} color={pal.gold} shadow={pal.red} />
    </div>
  );
};

/** Shared level: banner, run with parallax, enemy encounter, ✓ coin. */
const Level: React.FC<{
  scene: ReturnType<typeof getGameScene>;
  n: number;
  title: string;
  label: string;
  enemy: React.ReactNode;
  defeatAt: number;
  doneAt: number;
  defeat: "dash" | "stomp" | "paint";
  enemyAfter?: React.ReactNode;
  introWord?: string;
}> = ({ scene, n, title, label, enemy, defeatAt, doneAt, defeat, enemyAfter, introWord = "المرحلة" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bannerOut = cue(scene, introWord) + 30;
  const runStart = bannerOut - 4;
  const scroll = interpolate(frame, [runStart, defeatAt], [0, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const enemyX = interpolate(frame, [runStart, defeatAt - 6], [1100, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dashing = defeat === "dash" && frame >= defeatAt - 6 && frame < defeatAt + 6;
  const heroX = dashing ? interpolate(frame, [defeatAt - 6, defeatAt + 6], [600, 160]) : frame >= defeatAt + 6 && defeat === "dash" ? 160 : 600;
  const jump = defeat === "stomp" && frame >= defeatAt - 14 && frame < defeatAt ? Math.sin(((frame - (defeatAt - 14)) / 14) * Math.PI) * 260 : 0;
  const heroLeft = defeat === "stomp" ? interpolate(frame, [defeatAt - 14, defeatAt], [600, enemyX], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : heroX;
  const defeated = frame >= defeatAt;
  const coin = spring({ frame: frame - doneAt, fps, config: { damping: 9, stiffness: 160 } });
  const running = frame >= runStart && frame < defeatAt + 6;
  return (
    <Screen>
      <LevelBG scroll={scroll} />
      <LevelHUD n={n} done={frame >= doneAt ? n : n - 1} />
      {/* hero runs towards the left (Arabic reading direction) */}
      <div style={{ position: "absolute", left: heroLeft, top: 852 - jump, filter: dashing ? `drop-shadow(40px 0 0 rgba(127,240,216,0.5)) drop-shadow(80px 0 0 rgba(127,240,216,0.25))` : `drop-shadow(0 0 10px ${pal.mint})` }}>
        <Sprite map={running && Math.floor(frame / 4) % 2 ? HERO_B : HERO_A} ps={HERO_PS} flip />
      </div>
      {/* enemy + its label */}
      {!defeated && frame >= runStart && (
        <div style={{ position: "absolute", left: enemyX - 30, top: 870, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <PixelText text={label} px={14} scale={3.4} color={pal.white} shadow={pal.black} outline={pal.red} />
          {enemy}
        </div>
      )}
      {defeated && enemyAfter && <div style={{ position: "absolute", left: enemyX - 30, top: 920 }}>{enemyAfter}</div>}
      <Bits at={defeatAt} x={enemyX + 90} y={1000} count={34} colors={[pal.white, pal.gold, pal.red, pal.mint]} seed={`lv${n}`} />
      {frame >= doneAt && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, scale: String(coin) }}>
          <Sprite map={CHECK_COIN} ps={18} />
          <PixelText text="✓ تم" px={18} scale={5} color={pal.green} shadow={pal.black} outline={pal.white} font="text" />
        </div>
      )}
      <LevelBanner text={title} at={cue(scene, introWord) - 4} out={bannerOut} />
      <Dialog scene={scene} />
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={bannerOut} />
      <Sfx name={defeat === "stomp" ? "jump" : "dash"} at={defeat === "stomp" ? defeatAt - 14 : defeatAt - 6} />
      <Sfx name="hit" at={defeatAt} />
      <Sfx name="coin" at={doneAt} />
    </Screen>
  );
};

const g4 = getGameScene("G4-Level1");
export const G4Level1: React.FC = () => (
  <Level scene={g4} n={1} title="المرحلة 1" label="معاملة إلكترونية" enemy={<Sprite map={PAPER_MONSTER} ps={16} />} defeatAt={cue(g4, "الإلكترونية") + 14} doneAt={cue(g4, "خلصت")} defeat="dash" />
);

const g5 = getGameScene("G5-Level2");
export const G5Level2: React.FC = () => {
  const frame = useCurrentFrame();
  const paintAt = cue(g5, "شعارات");
  const done = cue(g5, "جاهزة");
  // the blank canvas fills, pixel by pixel, into an artwork
  const art = ["....GGGG....", "..GGTTTTGG..", ".GTTTTTWWTG.", ".GTTTTWWWTG.", "GTTTTTTWWWTG", "GTTTTTWWTWTG", "GTTTTWWTTTTG", "GTTTWWTTTTTG", ".GTWWTTTTTG.", ".GGTTTTTTGG.", "..GGGGGGGG..", "............"];
  const order = art.flatMap((r, y) => [...r].map((c, x) => ({ c, x, y }))).filter((p) => p.c !== ".");
  const p = interpolate(frame, [paintAt, done - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shown = Math.floor(order.length * p);
  const colors: Record<string, string> = { G: pal.gold, T: pal.teal, W: pal.white };
  const canvasArt = (
    <div style={{ position: "relative" }}>
      <Sprite map={CANVAS_MONSTER} ps={16} />
      <svg width={8 * 16} height={8 * 16} viewBox="0 0 12 12" shapeRendering="crispEdges" style={{ position: "absolute", left: 32, top: 32 }}>
        <rect width="12" height="12" fill="#F7F3EA" />
        {order.slice(0, shown).map((q, i) => (
          <rect key={i} x={q.x} y={q.y} width={1.02} height={1.02} fill={colors[q.c]} />
        ))}
      </svg>
    </div>
  );
  return (
    <Level
      scene={g5}
      n={2}
      title="المرحلة 2"
      label="شعار وتصاميم؟"
      enemy={frame < paintAt ? <Sprite map={CANVAS_MONSTER} ps={16} /> : canvasArt}
      enemyAfter={canvasArt}
      defeatAt={paintAt}
      doneAt={done}
      defeat="dash"
    />
  );
};

const g6 = getGameScene("G6-Level3");
export const G6Level3: React.FC = () => (
  <Level scene={g6} n={3} title="المرحلة 3" label="خلل تقني" enemy={<Sprite map={BUG} ps={16} />} defeatAt={cue(g6, "تقنية") + 6} doneAt={cue(g6, "تمت")} defeat="stomp" introWord="والثالثة" />
);

// ============================================================ G7 · SCORE
const g7 = getGameScene("G7-Score");

export const G7Score: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tTime = cue(g7, "وقتك");
  const tYou = cue(g7, "لك");
  const title = spring({ frame, fps, config: { damping: 10, stiffness: 160 } });
  const hand = interpolate(frame, [tTime, tYou + 10], [0, -720], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Screen bg={pal.night}>
      {/* pixel fireworks */}
      {[0, 1, 2, 3].map((k) => (
        <Bits key={k} at={8 + k * 14} x={200 + k * 220} y={420 + (k % 2) * 160} count={26} colors={[pal.gold, pal.pink, pal.mint, pal.white]} seed={`fw${k}`} />
      ))}
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", scale: String(title) }}>
        <PixelText text="مرحلة مكتملة!" px={20} scale={6} color={pal.gold} shadow={pal.red} outline={pal.black} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 600 }}>
        <PixelBox style={{ padding: "40px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <PixelText text="المهام" px={16} scale={4} color={pal.white} />
            {[0, 1, 2].map((i) => (
              <Sprite key={i} map={CHECK_COIN} ps={7} />
            ))}
          </div>
          {/* clock spinning backwards: time returned */}
          <div style={{ position: "relative", width: 220, height: 220, background: pal.white, border: `12px solid ${pal.black}`, borderRadius: 0, boxShadow: `0 0 0 8px ${pal.white}` }}>
            <div style={{ position: "absolute", left: 98, top: 30, width: 12, height: 80, background: pal.black, transformOrigin: "50% 100%", rotate: `${hand}deg` }} />
            <div style={{ position: "absolute", left: 98, top: 60, width: 12, height: 50, background: pal.red, transformOrigin: "50% 100%", rotate: `${hand / 12}deg` }} />
            <div style={{ position: "absolute", left: 92, top: 98, width: 24, height: 24, background: pal.black }} />
          </div>
          {frame >= tTime && <PixelText text="وقتك رجع لك!" px={18} scale={5} color={pal.mint} shadow={pal.black} />}
        </PixelBox>
      </div>
      <Dialog scene={g7} />
      <SceneVoice scene={g7} />
      <Sfx name="clear" at={2} />
      <Sfx name="powerup" at={tTime} gain={0.7} />
      <Sfx name="coin" at={tYou} />
    </Screen>
  );
};

// ============================================================ G8 · PRESS START (the logo "upgrades" to HD)
const g8 = getGameScene("G8-Start");

export const G8Start: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tName = cue(g8, "دبرها");
  const tPlay = cue(g8, "العبها");
  const tOrder = cue(g8, "اطلب");
  const stages = [24, 40, 64, 120];
  const step = Math.floor((frame - tName) / 4);
  const hd = step >= stages.length;
  const crt = interpolate(frame, [tName + 14, tName + 30], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(frame, [tName + 15, tName + 16, tName + 26], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgT = interpolate(frame, [tName + 14, tName + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line = spring({ frame: frame - tPlay, fps, config: { damping: 200 } });
  const order = spring({ frame: frame - tOrder, fps, config: { damping: 12 } });
  return (
    <Screen bg={pal.night} crt={crt} wipeOut={false}>
      {/* the world itself upgrades: night pixel → bright brand light */}
      <AbsoluteFill style={{ background: `radial-gradient(90% 60% at 50% 30%, #FFFFFF 0%, #EEF5F9 55%, #D5E4EF 100%)`, opacity: bgT }} />
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        {frame < tName ? (
          <Img src={staticFile("pixel/logo-24.png")} style={{ width: 620, imageRendering: "pixelated", background: "rgba(255,255,255,0.9)" }} />
        ) : hd ? (
          <Img src={staticFile("brand/logo-color.png")} style={{ width: 620, scale: String(spring({ frame: frame - (tName + 16), fps, config: { damping: 12 } }) * 0.08 + 0.92) }} />
        ) : (
          <Img src={staticFile(`pixel/logo-${stages[Math.max(0, step)]}.png`)} style={{ width: 620, imageRendering: "pixelated", background: `rgba(255,255,255,${0.9 - step * 0.2})` }} />
        )}
      </div>
      {frame >= tName && !hd && (
        <div style={{ position: "absolute", top: 820, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <PixelText text={`ترقية… ${[240, 480, 720, 1080][Math.max(0, step)]}p`} px={14} scale={4} color={pal.mint} shadow={pal.black} font="text" />
        </div>
      )}
      {frame >= tPlay && (
        <div dir="rtl" style={{ position: "absolute", top: 860, left: 60, right: 60, textAlign: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 108, color: "#0d2447", opacity: line, translate: `0px ${(1 - line) * 40}px` }}>
          العبها <span style={{ color: "#0e939a" }}>صح.</span>
        </div>
      )}
      {frame >= tOrder && (
        <div style={{ position: "absolute", top: 1060, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, scale: String(order) }}>
          {/* «press start» survives as the one pixel element: the call to action */}
          <div style={{ padding: "22px 46px", background: pal.black, border: `8px solid ${pal.gold}`, boxShadow: `10px 10px 0 ${pal.navy}`, opacity: Math.floor(frame / 9) % 2 ? 1 : 0.75 }}>
            <PixelText text="▶ اطلب خدمتك الحين" px={18} scale={4.2} color={pal.gold} font="text" />
          </div>
          <div dir="ltr" style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 52, color: "#0d2447" }}>haxztd.zid.store</div>
        </div>
      )}
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      <SceneVoice scene={g8} />
      <Sfx name="upgrade" at={tName} />
      <Sfx name="select" at={tOrder} />
    </Screen>
  );
};
