import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { fonts } from "../theme";
import { Barcode, Caption, cue, getWhiteScene, Paper, sale, SceneVoice, Sfx, Sticker, Strike, useShake, useSwing, type WhiteSceneId } from "./base";

const display: React.CSSProperties = { fontFamily: fonts.display, fontWeight: 800 };

// ============================================================ W1 · HOOK — a flood of sale alerts, then the scratch
const ALERTS = [
  "خصم ٧٠٪ على كل شي!",
  "العرض ينتهي الليلة",
  "الجمعة البيضاء بدأت",
  "تخفيضات حصرية لك",
  "لا تفوّت العروض!",
  "اشترِ ١ واحصل على ٢",
  "آخر فرصة!",
  "كوبون جديد بانتظارك",
  "أسعار ما تتكرر",
  "سلتك تنتظرك",
  "خصم إضافي ٢٠٪",
  "شحن مجاني اليوم",
];

const Alert: React.FC<{ i: number; at: number; fall: number }> = ({ i, at, fall }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 180 } });
  const fromLeft = i % 2 === 0;
  const x = 60 + random(`ax${i}`) * 300;
  const y = 270 + ((i * 97) % 1100);
  const r = (random(`ar${i}`) - 0.5) * 22;
  const drop = fall > 0 ? fall * fall * (0.8 + random(`ad${i}`) * 0.8) * 2200 : 0;
  return (
    <div dir="rtl" style={{ position: "absolute", left: x + (1 - s) * (fromLeft ? -900 : 900), top: y + drop, width: 640, rotate: `${r + fall * (random(`af${i}`) - 0.5) * 80}deg`, display: "flex", alignItems: "center", gap: 20, padding: "22px 26px", borderRadius: 30, background: "rgba(255,255,255,0.97)", boxShadow: "0 18px 40px rgba(0,0,0,0.22)", fontFamily: fonts.text, filter: fall > 0 ? `grayscale(${Math.min(1, fall * 3)})` : undefined }}>
      <div style={{ width: 82, height: 82, borderRadius: 22, background: sale.red, color: "#fff", display: "grid", placeItems: "center", ...display, fontSize: 50, flexShrink: 0 }}>٪</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 26, color: "#888" }}>تنبيه · الآن</div>
        <div style={{ fontWeight: 800, fontSize: 40, color: sale.ink }}>{ALERTS[i % ALERTS.length]}</div>
      </div>
    </div>
  );
};

export const W1Hook: React.FC = () => {
  const scene = getWhiteScene("W1-Hook");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tBig = cue(scene, "تخفيض");
  const tFriday = cue(scene, "الجمعة");
  const tNot = cue(scene, "مو");
  const tPrices = cue(scene, "الأسعار");
  const scratch = tNot - 6;
  const fall = interpolate(frame, [scratch, scratch + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const shake = useShake([0, tBig, tFriday, scratch], 16);
  const buzz = frame < scratch ? Math.sin(frame * 2.2) * 4 : 0;
  const pop = (at: number) => spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 240, mass: 0.6 } });
  const before = frame < scratch;
  return (
    <AbsoluteFill style={{ translate: shake }}>
      <Paper color={before ? sale.paper : "#ECE8DF"} />
      <AbsoluteFill style={{ translate: `${buzz}px 0px` }}>
        {ALERTS.map((_, i) => (
          <Alert key={i} i={i} at={i * 6} fall={fall} />
        ))}
      </AbsoluteFill>
      {before ? (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {frame >= 8 && (
            <div style={{ ...display, fontSize: 120, background: sale.ink, color: "#fff", padding: "0 44px 16px", rotate: "-3deg", scale: String(interpolate(pop(8), [0, 1], [1.8, 1])) }}>
              أقوى <span style={{ color: sale.red, opacity: frame >= tBig ? 1 : 0 }}>تخفيض</span>
            </div>
          )}
          {frame >= tFriday - 2 && (
            <div style={{ ...display, fontSize: 92, background: sale.red, color: "#fff", padding: "0 40px 14px", rotate: "2deg", scale: String(interpolate(pop(tFriday - 2), [0, 1], [1.8, 1])) }}>
              في الجمعة البيضاء
            </div>
          )}
        </div>
      ) : (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", ...display, color: sale.ink }}>
          <div style={{ fontSize: 150, lineHeight: 1.1, marginBottom: 30, opacity: frame >= tNot ? 1 : 0, scale: String(interpolate(pop(tNot), [0, 1], [1.6, 1])) }}>مو على</div>
          <div style={{ position: "relative", display: "inline-block", fontSize: 170, lineHeight: 1.15, opacity: frame >= tPrices - 2 ? 1 : 0, scale: String(interpolate(pop(tPrices - 2), [0, 1], [1.6, 1])) }}>
            الأسعار
            <Strike at={tPrices + 8} width={560} height={90} len={5} />
          </div>
        </div>
      )}
      <SceneVoice scene={scene} />
      <Sfx name="pings" at={0} />
      <Sfx name="pings" at={40} gain={0.7} />
      <Sfx name="sticker" at={8} />
      <Sfx name="sticker" at={tFriday - 2} />
      <Sfx name="scratch" at={scratch} />
      <Sfx name="marker" at={tPrices + 7} />
    </AbsoluteFill>
  );
};

// ============================================================ W2 · TIME — % flips into a rewinding clock
export const W2Time: React.FC = () => {
  const scene = getWhiteScene("W2-Time");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tOn = cue(scene, "على");
  const tTime = cue(scene, "وقتك");
  const flipAt = tOn - 8;
  const inS = spring({ frame, fps, config: { damping: 12, stiffness: 160 } });
  const flip = interpolate(frame, [flipAt, flipAt + 8], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const showClock = flip >= 90;
  const rewind = frame > flipAt ? -(frame - flipAt) * 26 : 0;
  const stamp = spring({ frame: frame - tTime, fps, config: { damping: 9, stiffness: 240, mass: 0.6 } });
  const shake = useShake([tTime], 18);
  return (
    <AbsoluteFill style={{ background: sale.red, translate: shake }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 2.4px, transparent 3px)", backgroundSize: "24px 24px" }} />
      {/* speed rays */}
      <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${frame * 0.8}deg at 50% 44%, rgba(255,255,255,0.08) 0deg 8deg, transparent 8deg 20deg)` }} />
      <div style={{ position: "absolute", left: 540 - 300, top: 420, width: 600, height: 600, perspective: 1600 }}>
        <div style={{ width: "100%", height: "100%", rotate: `${(1 - inS) * -200}deg`, scale: String(inS), transform: `rotateY(${flip}deg)`, display: "grid", placeItems: "center" }}>
          {!showClock ? (
            <div style={{ ...display, fontSize: 560, lineHeight: 1, color: "#fff", textShadow: "0 20px 0 rgba(0,0,0,0.18)" }}>٪</div>
          ) : (
            <div style={{ transform: "rotateY(180deg)", width: 540, height: 540, borderRadius: "50%", background: "#fff", border: `26px solid ${sale.ink}`, position: "relative", boxShadow: "0 24px 0 rgba(0,0,0,0.18)" }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ position: "absolute", left: 244, top: 14, width: 4, height: 34, background: sale.ink, transformOrigin: "2px 230px", rotate: `${i * 30}deg` }} />
              ))}
              <div style={{ position: "absolute", left: 238, top: 90, width: 16, height: 170, borderRadius: 8, background: sale.ink, transformOrigin: "8px 160px", rotate: `${rewind / 12}deg` }} />
              <div style={{ position: "absolute", left: 241, top: 40, width: 10, height: 220, borderRadius: 5, background: sale.red, transformOrigin: "5px 210px", rotate: `${rewind}deg` }} />
              <div style={{ position: "absolute", left: 226, top: 226, width: 40, height: 40, borderRadius: 20, background: sale.ink }} />
            </div>
          )}
        </div>
      </div>
      <div dir="rtl" style={{ position: "absolute", left: 0, right: 0, top: 1090, textAlign: "center", ...display, color: "#fff" }}>
        {frame >= 6 && <div style={{ fontSize: 96, opacity: frame >= flipAt ? 0.75 : 1 }}>تخفيض…</div>}
        {frame >= tOn && (
          <div style={{ display: "inline-block", fontSize: 150, lineHeight: 1.1, background: sale.ink, padding: "0 50px 20px", rotate: "-3deg", scale: String(frame >= tTime ? interpolate(stamp, [0, 1], [1.7, 1]) : 0.9) }}>
            على <span style={{ color: sale.yellow, opacity: frame >= tTime ? 1 : 0 }}>وقتك!</span>
          </div>
        )}
      </div>
      <SceneVoice scene={scene} />
      <Sfx name="whoosh" at={0} />
      <Sfx name="tag" at={flipAt} />
      <Sfx name="impact" at={tTime} gain={0.8} />
    </AbsoluteFill>
  );
};

// ============================================================ W3–W5 · PRICE TAGS — the old "price" is struck, a sticker gives the new one
type TagProps = {
  id: WhiteSceneId;
  n: string;
  label: string;
  icon: IconName;
  oldText: string;
  newText: string;
  strikeWord: string;
  stickerWord: string;
  bg: "paper" | "ink" | "red";
};

const TagScene: React.FC<TagProps> = ({ id, n, label, icon, oldText, newText, strikeWord, stickerWord, bg }) => {
  const scene = getWhiteScene(id);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tStrike = cue(scene, strikeWord) - 4;
  const tSticker = cue(scene, stickerWord);
  const swing = useSwing(0, 30) + useSwing(tSticker, 6);
  const drop = spring({ frame, fps, config: { damping: 11, stiffness: 120 } });
  const shake = useShake([tSticker], 14);
  const dark = bg === "ink";
  const bgColor = bg === "paper" ? sale.paper : bg === "ink" ? sale.ink : sale.red;
  const tagColor = bg === "red" ? sale.paper : "#FFFFFF";
  const pinY = 250;
  return (
    <AbsoluteFill style={{ translate: shake }}>
      <Paper color={bgColor} dot={dark || bg === "red" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"} />
      {/* big outlined index number */}
      <div style={{ position: "absolute", left: 30, top: 900, ...display, fontSize: 680, lineHeight: 1, color: "transparent", WebkitTextStroke: `4px ${dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"}` }}>{n}</div>
      {/* the hanging tag */}
      <div style={{ position: "absolute", left: 540, top: pinY, width: 0, height: 0, rotate: `${swing}deg`, translate: `0px ${(1 - drop) * -900}px` }}>
        <div style={{ position: "absolute", left: -3, top: 0, width: 6, height: 150, background: dark ? "#DDD" : sale.ink }} />
        <div dir="rtl" style={{ position: "absolute", left: -330, top: 140, width: 660, height: 800, background: tagColor, clipPath: "polygon(25% 0, 75% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)", boxShadow: "0 30px 50px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", alignItems: "center", padding: "130px 50px 40px" }}>
          <div style={{ position: "absolute", top: 40, width: 44, height: 44, borderRadius: 22, background: bgColor, border: `6px solid ${dark ? "#DDD" : sale.ink}` }} />
          <div style={{ display: "flex", alignItems: "center", gap: 16, ...display, fontSize: 54, color: sale.ink, whiteSpace: "nowrap" }}>
            <Icon name={icon} size={70} color={sale.red} stroke={2.2} />
            {label}
          </div>
          <div style={{ width: "100%", borderTop: `5px dashed ${sale.ink}33`, margin: "34px 0 26px" }} />
          <div style={{ fontFamily: fonts.text, fontWeight: 700, fontSize: 34, color: "#777" }}>السعر القديم</div>
          <div style={{ position: "relative", ...display, fontSize: 112, color: sale.ink, marginTop: 4, opacity: frame >= tStrike ? 0.55 : 1 }}>
            {oldText}
            <Strike at={tStrike} width={oldText.length * 54} height={70} />
          </div>
          <div style={{ marginTop: "auto" }}>
            <Barcode width={380} height={90} seed={id} />
          </div>
        </div>
        <Sticker at={tSticker} shape="burst" size={400} rotate={-10} fontSize={newText.length > 6 ? 62 : 76} style={{ left: -20, top: 700 }}>
          {newText}
        </Sticker>
      </div>
      <Caption scene={scene} color={dark || bg === "red" ? "#fff" : sale.ink} accent={bg === "red" ? sale.yellow : sale.red} top={1370} size={60} />
      <SceneVoice scene={scene} />
      <Sfx name="tag" at={2} />
      <Sfx name="scanner" at={14} />
      <Sfx name="marker" at={tStrike} />
      <Sfx name="sticker" at={tSticker} />
    </AbsoluteFill>
  );
};

export const W3Gov: React.FC = () => <TagScene id="W3-Gov" n="١" label="معاملة إلكترونية" icon="document" oldText="يوم كامل" newText="من جوالك" strikeWord="صارت" stickerWord="جوالك" bg="paper" />;
export const W4Design: React.FC = () => <TagScene id="W4-Design" n="٢" label="شعار مشروعك" icon="palette" oldText="شهر حيرة" newText="جاهز" strikeWord="يجيك" stickerWord="جاهز" bg="ink" />;
export const W5Tech: React.FC = () => <TagScene id="W5-Tech" n="٣" label="موقع أو حل تقني" icon="code" oldText="فكرة بس" newText="تتنفّذ" strikeWord="تتنفذ" stickerWord="تتنفذ" bg="red" />;

// ============================================================ W6 · CART — scan the three, checkout, "the rest is on us"
const ITEMS: { icon: IconName; text: string }[] = [
  { icon: "document", text: "معاملة إلكترونية" },
  { icon: "palette", text: "تصميم شعار" },
  { icon: "code", text: "موقع أو حل تقني" },
];

export const W6Cart: React.FC = () => {
  const scene = getWhiteScene("W6-Cart");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tItems = [cue(scene, "حط"), cue(scene, "طلبك"), cue(scene, "السلة")];
  const tRest = cue(scene, "والباقي");
  const tUs = cue(scene, "علينا");
  const tap = tRest - 2;
  const cardIn = spring({ frame, fps, config: { damping: 14 } });
  const done = frame >= tap + 3;
  const fx = interpolate(frame, [tItems[2] + 6, tap], [880, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const fy = interpolate(frame, [tItems[2] + 6, tap], [1500, 1160], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const press = frame >= tap && frame < tap + 5 ? 0.94 : 1;
  const count = tItems.filter((t) => frame >= t).length;
  const shake = useShake([tUs], 12);
  return (
    <AbsoluteFill style={{ translate: shake }}>
      <Paper />
      <div dir="rtl" style={{ position: "absolute", left: 110, top: 300, width: 860, padding: "40px 40px 44px", borderRadius: 48, background: "#fff", boxShadow: "0 40px 80px rgba(0,0,0,0.18)", translate: `0px ${(1 - cardIn) * 900}px`, fontFamily: fonts.text }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
          <div style={{ position: "relative" }}>
            <Icon name="cart" size={70} color={sale.ink} stroke={2.2} />
            {count > 0 && <div style={{ position: "absolute", top: -12, left: -14, width: 44, height: 44, borderRadius: 22, background: sale.red, color: "#fff", ...display, fontSize: 30, display: "grid", placeItems: "center" }}>{count}</div>}
          </div>
          <div style={{ ...display, fontSize: 64, color: sale.ink }}>سلّتك</div>
        </div>
        {ITEMS.map((it, i) => {
          const s = spring({ frame: frame - tItems[i], fps, config: { damping: 12, stiffness: 200 } });
          if (frame < tItems[i]) return <div key={i} style={{ height: 150 }} />;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 132, marginBottom: 18, padding: "0 24px", borderRadius: 28, background: "#F6F4EF", scale: String(0.6 + 0.4 * s), translate: `${(1 - s) * -200}px 0px` }}>
              <div style={{ width: 88, height: 88, borderRadius: 22, background: sale.ink, display: "grid", placeItems: "center" }}>
                <Icon name={it.icon} size={52} color="#fff" stroke={2} />
              </div>
              <div style={{ flex: 1, fontWeight: 800, fontSize: 44, color: sale.ink }}>{it.text}</div>
              <div style={{ width: 60, height: 60, borderRadius: 30, background: sale.green, display: "grid", placeItems: "center" }}>
                <Icon name="check" size={36} color="#fff" stroke={3} />
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 16, height: 130, borderRadius: 34, background: done ? sale.green : sale.red, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, ...display, fontSize: 58, color: "#fff", scale: String(press), boxShadow: done ? `0 0 0 ${interpolate(frame, [tap + 3, tap + 20], [0, 40], { extrapolateRight: "clamp" })}px rgba(23,163,74,${interpolate(frame, [tap + 3, tap + 20], [0.4, 0], { extrapolateRight: "clamp" })})` : undefined }}>
          {done ? (
            <>
              <Icon name="check" size={60} color="#fff" stroke={3} /> تم الطلب
            </>
          ) : (
            "إتمام الطلب"
          )}
        </div>
      </div>
      {/* finger cursor */}
      {frame >= tItems[2] + 6 && frame < tap + 30 && (
        <div style={{ position: "absolute", left: fx, top: fy, width: 110, height: 110, borderRadius: 55, background: "rgba(18,18,18,0.18)", border: "6px solid rgba(18,18,18,0.6)", scale: String(press) }} />
      )}
      <Sticker at={tUs} shape="pill" color={sale.ink} rotate={-6} fontSize={78} style={{ left: 250, top: 1180 }}>
        والباقي علينا
      </Sticker>
      <SceneVoice scene={scene} />
      {tItems.map((t, i) => (
        <Sfx key={i} name="scanner" at={t} />
      ))}
      <Sfx name="pop" at={tap} />
      <Sfx name="ching" at={tap + 3} />
      <Sfx name="sticker" at={tUs} />
    </AbsoluteFill>
  );
};

// ============================================================ W7 · CTA — logo, promise, «رابط المتجر في البايو»
export const W7Cta: React.FC = () => {
  const scene = getWhiteScene("W7-CTA");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tBrand = cue(scene, "دبرها");
  const tName = cue(scene, "للخدمات");
  const tTrust = cue(scene, "المصداقية");
  const tSpeed = cue(scene, "وسرعة");
  const tLink = cue(scene, "ورابط");
  const tBio = cue(scene, "البايو");
  const logo = spring({ frame: frame - tBrand, fps, config: { damping: 11, stiffness: 160 } });
  const name = spring({ frame: frame - tName, fps, config: { damping: 200 } });
  const link = spring({ frame: frame - tLink, fps, config: { damping: 10, stiffness: 200, mass: 0.6 } });
  const bob = frame >= tLink ? Math.abs(Math.sin((frame - tLink) / 6)) * -26 : 0;
  const shake = useShake([tBrand, tLink], 14);
  return (
    <AbsoluteFill style={{ translate: shake }}>
      <Paper />
      <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${frame * 0.5}deg at 50% 32%, rgba(227,38,47,0.07) 0deg 8deg, transparent 8deg 20deg)` }} />
      {frame >= tBrand && (
        <div style={{ position: "absolute", left: 540 - 210, top: 290, width: 420, height: 420, borderRadius: 210, background: "#fff", boxShadow: "0 30px 60px rgba(0,0,0,0.15)", display: "grid", placeItems: "center", scale: String(interpolate(logo, [0, 1], [0.3, 1])), rotate: `${(1 - logo) * -40}deg` }}>
          <Img src={staticFile("brand/logo-color.png")} style={{ width: 340 }} />
        </div>
      )}
      {frame >= tName && (
        <div dir="rtl" style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", ...display, fontSize: 64, color: sale.ink, opacity: name, translate: `0px ${(1 - name) * 30}px` }}>
          دبّرها للخدمات الإلكترونية
        </div>
      )}
      <Sticker at={tTrust} shape="pill" color={sale.red} rotate={-5} fontSize={60} style={{ left: 520, top: 880 }}>
        المصداقية
      </Sticker>
      <Sticker at={tSpeed} shape="pill" color={sale.ink} rotate={4} fontSize={60} style={{ left: 90, top: 900 }}>
        سرعة الإنجاز
      </Sticker>
      {frame >= tLink && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1070, display: "flex", flexDirection: "column", alignItems: "center", scale: String(interpolate(link, [0, 1], [1.8, 1])), opacity: Math.min(1, link * 3) }}>
          <svg width="120" height="130" viewBox="0 0 120 130" style={{ translate: `0px ${bob}px` }}>
            <path d="M60 6 L112 62 L80 62 L80 124 L40 124 L40 62 L8 62 Z" fill={sale.red} stroke="#fff" strokeWidth="6" strokeLinejoin="round" />
          </svg>
          <div dir="rtl" style={{ marginTop: 14, padding: "14px 50px 24px", background: sale.ink, color: "#fff", ...display, fontSize: 84, rotate: "-2deg", boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}>
            رابط المتجر <span style={{ color: sale.yellow, opacity: frame >= tBio ? 1 : 0.25 }}>في البايو</span>
          </div>
          <div dir="ltr" style={{ marginTop: 26, fontFamily: fonts.text, fontWeight: 700, fontSize: 36, color: "#555" }}>haxztd.zid.store</div>
        </div>
      )}
      <SceneVoice scene={scene} />
      <Sfx name="impact" at={tBrand} />
      <Sfx name="pop" at={tTrust} />
      <Sfx name="sticker" at={tSpeed} />
      <Sfx name="whoosh" at={tLink - 4} />
      <Sfx name="sticker" at={tLink} />
      <Sfx name="pop" at={tBio} />
    </AbsoluteFill>
  );
};
