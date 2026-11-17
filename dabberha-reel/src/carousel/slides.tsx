import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { colors, fonts } from "../theme";

// TikTok photo-carousel (1080×1920). Key content stays in x 70..920, y 200..1460,
// clear of TikTok's top bar, right-hand action column and bottom caption.
const display: React.CSSProperties = { fontFamily: fonts.display, fontWeight: 800 };
const text: React.CSSProperties = { fontFamily: fonts.text };

type Theme = "dark" | "light";

const Blob: React.FC<{ x: number; y: number; r: number; color: string; o?: number }> = ({ x, y, r, color, o = 0.5 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: color, opacity: o, filter: "blur(90px)" }} />
);

const Grid: React.FC<{ dark: boolean }> = ({ dark }) => (
  <AbsoluteFill style={{ backgroundImage: `linear-gradient(${dark ? "rgba(255,255,255,0.05)" : "rgba(13,36,71,0.05)"} 2px, transparent 2px), linear-gradient(90deg, ${dark ? "rgba(255,255,255,0.05)" : "rgba(13,36,71,0.05)"} 2px, transparent 2px)`, backgroundSize: "90px 90px", maskImage: "radial-gradient(70% 60% at 50% 40%, #000 30%, transparent 100%)" }} />
);

/** Shared slide frame: background, page counter, footer with logo, swipe cue. */
const Slide: React.FC<{ theme: Theme; n: number; accent: string; children: React.ReactNode; swipe?: boolean }> = ({ theme, n, accent, children, swipe = true }) => {
  const dark = theme === "dark";
  const fg = dark ? "#fff" : colors.textOnLight;
  return (
    <AbsoluteFill style={{ background: dark ? `linear-gradient(160deg, ${colors.night} 0%, ${colors.ink} 100%)` : `linear-gradient(170deg, #F7FAFD 0%, ${colors.ice} 100%)`, overflow: "hidden" }}>
      <Blob x={900} y={300} r={330} color={accent} o={dark ? 0.45 : 0.28} />
      <Blob x={120} y={1500} r={360} color={dark ? colors.primary : colors.teal} o={dark ? 0.4 : 0.18} />
      <Grid dark={dark} />
      {/* top: counter + brand chip */}
      <div dir="rtl" style={{ position: "absolute", top: 210, left: 80, right: 160, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 24px 12px 14px", borderRadius: 999, background: dark ? "rgba(255,255,255,0.08)" : "#fff", border: dark ? "2px solid rgba(255,255,255,0.12)" : "2px solid rgba(13,36,71,0.06)", boxShadow: dark ? undefined : "0 10px 24px rgba(13,36,71,0.06)" }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: "#fff", display: "grid", placeItems: "center" }}>
            <Img src={staticFile("brand/logo-color.png")} style={{ width: 46 }} />
          </div>
          <span style={{ ...text, fontWeight: 700, fontSize: 30, color: fg }}>دبّرها للخدمات الإلكترونية</span>
        </div>
        <div dir="ltr" style={{ ...display, fontSize: 32, color: dark ? "rgba(255,255,255,0.6)" : "rgba(13,36,71,0.45)" }}>
          <span style={{ color: accent }}>{n}</span> / 5
        </div>
      </div>
      {children}
      {/* bottom: progress dots + swipe cue */}
      <div dir="rtl" style={{ position: "absolute", top: 1400, left: 80, right: 160, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ width: i === n ? 46 : 14, height: 14, borderRadius: 7, background: i === n ? accent : dark ? "rgba(255,255,255,0.25)" : "rgba(13,36,71,0.18)" }} />
          ))}
        </div>
        {swipe && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, ...display, fontSize: 34, color: fg }}>
            اسحب
            <svg width="54" height="30" viewBox="0 0 54 30">
              <path d="M52 15 H6 M18 3 L4 15 L18 27" stroke={accent} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/** Glossy 3D-ish icon tile. */
export const Tile: React.FC<{ icon: IconName; size: number; from: string; to: string; rotate?: number; style?: React.CSSProperties }> = ({ icon, size, from, to, rotate = 0, style }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, background: `linear-gradient(145deg, ${from}, ${to})`, display: "grid", placeItems: "center", rotate: `${rotate}deg`, boxShadow: `0 ${size * 0.12}px ${size * 0.25}px rgba(0,0,0,0.25), inset 0 3px 0 rgba(255,255,255,0.35), inset 0 -${size * 0.06}px 0 rgba(0,0,0,0.18)`, ...style }}>
    <Icon name={icon} size={size * 0.52} color="#fff" stroke={2} />
  </div>
);

const Kicker: React.FC<{ children: React.ReactNode; color: string; dark?: boolean }> = ({ children, color, dark }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 24px 12px", borderRadius: 999, background: `${color}${dark ? "33" : "1F"}`, ...text, fontWeight: 700, fontSize: 32, color }}>{children}</div>
);

const Bullets: React.FC<{ items: string[]; color: string; dark?: boolean }> = ({ items, color, dark }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    {items.map((b) => (
      <div key={b} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 26px", borderRadius: 26, background: dark ? "rgba(255,255,255,0.07)" : "#fff", boxShadow: dark ? undefined : "0 10px 24px rgba(13,36,71,0.07)" }}>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: color, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon name="check" size={28} color="#fff" stroke={3} />
        </div>
        <span style={{ ...text, fontWeight: 700, fontSize: 38, color: dark ? "#fff" : colors.textOnLight }}>{b}</span>
      </div>
    ))}
  </div>
);

// ------------------------------------------------------------------ 1 · HOOK
export const Slide1: React.FC = () => (
  <Slide theme="dark" n={1} accent={colors.gold}>
    {/* floating tiles */}
    <Tile icon="document" size={170} from="#3B8FD0" to={colors.primary} rotate={-12} style={{ position: "absolute", left: 640, top: 360 }} />
    <Tile icon="palette" size={140} from="#F2BE5C" to={colors.gold} rotate={10} style={{ position: "absolute", left: 120, top: 400 }} />
    <Tile icon="code" size={150} from="#2FD0C8" to={colors.teal} rotate={8} style={{ position: "absolute", left: 700, top: 1110 }} />
    <Tile icon="sparkle" size={110} from="#8C7CF0" to="#5B4BD6" rotate={-10} style={{ position: "absolute", left: 130, top: 1150 }} />
    <div dir="rtl" style={{ position: "absolute", top: 640, left: 80, right: 160, textAlign: "right" }}>
      <Kicker color={colors.gold} dark>
        من جوالك… وأنت مرتاح
      </Kicker>
      <div style={{ ...display, fontSize: 118, lineHeight: 1.12, color: "#fff", marginTop: 26 }}>
        وش تقدر
        <br />
        تخلّص مع
        <br />
        <span style={{ background: `linear-gradient(90deg, ${colors.gold}, #FFD98A)`, WebkitBackgroundClip: "text", color: "transparent" }}>دبّرها؟</span>
      </div>
    </div>
  </Slide>
);

// ------------------------------------------------------------------ 2 · E-SERVICES
export const PhoneMock: React.FC = () => (
  <div style={{ width: 380, height: 640, borderRadius: 58, padding: 14, background: "#0B1220", boxShadow: "0 40px 80px rgba(13,36,71,0.35)", rotate: "-6deg" }}>
    <div dir="rtl" style={{ width: "100%", height: "100%", borderRadius: 46, background: "#F4F8FC", padding: "60px 20px 20px", display: "flex", flexDirection: "column", gap: 16, ...text }}>
      <div style={{ ...display, fontSize: 30, color: colors.textOnLight }}>طلبي</div>
      {[
        { t: "تم استلام الطلب", c: colors.teal, i: "check" as IconName },
        { t: "جاري التنفيذ", c: colors.gold, i: "clock" as IconName },
        { t: "تم الإنجاز", c: "#17A34A", i: "check" as IconName },
      ].map((s) => (
        <div key={s.t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 14px", borderRadius: 20, background: "#fff", boxShadow: "0 6px 14px rgba(13,36,71,0.08)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: s.c, display: "grid", placeItems: "center" }}>
            <Icon name={s.i} size={26} color="#fff" stroke={2.6} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 24, color: colors.textOnLight }}>{s.t}</span>
        </div>
      ))}
      <div style={{ marginTop: "auto", height: 66, borderRadius: 20, background: colors.primary, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 26 }}>اطلب الخدمة</div>
    </div>
  </div>
);

export const Slide2: React.FC = () => (
  <Slide theme="light" n={2} accent={colors.primary}>
    <div style={{ position: "absolute", left: 70, top: 330 }}>
      <PhoneMock />
    </div>
    <Tile icon="document" size={130} from="#3B8FD0" to={colors.primary} rotate={10} style={{ position: "absolute", left: 380, top: 300 }} />
    <div dir="rtl" style={{ position: "absolute", top: 330, left: 520, right: 160 }}>
      <Kicker color={colors.primary}>٠١ · خدمات إلكترونية</Kicker>
      <div style={{ ...display, fontSize: 82, lineHeight: 1.15, color: colors.textOnLight, marginTop: 20 }}>
        معاملاتك
        <br />
        <span style={{ color: colors.primary }}>من جوالك</span>
      </div>
      <div style={{ ...text, fontWeight: 500, fontSize: 32, lineHeight: 1.5, color: "#4A5D78", marginTop: 16 }}>بدون مشاوير… وبدون زحمة.</div>
    </div>
    <div dir="rtl" style={{ position: "absolute", top: 1010, left: 80, right: 160 }}>
      <Bullets color={colors.primary} items={["نقدّم طلبك ونتابعه عنك", "توفّر وقتك ومشوارك", "تعرف وين وصل طلبك"]} />
    </div>
  </Slide>
);

// ------------------------------------------------------------------ 3 · LOGOS & DESIGN
export const Artboard: React.FC = () => (
  <div style={{ position: "relative", width: 520, height: 470, borderRadius: 36, background: "#fff", boxShadow: "0 40px 80px rgba(13,36,71,0.18)", rotate: "4deg", overflow: "hidden" }}>
    <div style={{ height: 54, background: "#F1F4F9", display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
      {["#FF6159", "#FFBD2E", "#28C941"].map((c) => (
        <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
      ))}
    </div>
    <svg width="520" height="416" viewBox="0 0 520 416">
      <rect x="140" y="70" width="240" height="240" fill="none" stroke={colors.primary} strokeWidth="2" strokeDasharray="8 8" />
      <path d="M180 260 C 200 120, 320 120, 340 260" stroke={colors.gold} strokeWidth="16" fill="none" strokeLinecap="round" />
      <circle cx="260" cy="170" r="34" fill={colors.teal} />
      <line x1="180" y1="260" x2="150" y2="150" stroke={colors.primary} strokeWidth="2" />
      <line x1="340" y1="260" x2="370" y2="150" stroke={colors.primary} strokeWidth="2" />
      {[
        [180, 260],
        [340, 260],
        [150, 150],
        [370, 150],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 9} y={y - 9} width="18" height="18" fill="#fff" stroke={colors.primary} strokeWidth="3" />
      ))}
      {[colors.navy, colors.primary, colors.teal, colors.gold].map((c, i) => (
        <circle key={c} cx={170 + i * 60} cy={360} r="20" fill={c} />
      ))}
    </svg>
  </div>
);

export const Slide3: React.FC = () => (
  <Slide theme="light" n={3} accent={colors.gold}>
    <div dir="rtl" style={{ position: "absolute", top: 330, left: 80, right: 160 }}>
      <Kicker color="#B97A12">٠٢ · شعارات وتصاميم</Kicker>
      <div style={{ ...display, fontSize: 86, lineHeight: 1.15, color: colors.textOnLight, marginTop: 20 }}>
        هوية مشروعك
        <br />
        تبدأ من <span style={{ color: colors.gold }}>شعار</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 200, top: 650, scale: "0.9", transformOrigin: "top left" }}>
      <Artboard />
    </div>
    <Tile icon="palette" size={140} from="#F2BE5C" to={colors.gold} rotate={-10} style={{ position: "absolute", left: 110, top: 990 }} />
    <div dir="rtl" style={{ position: "absolute", top: 1160, left: 80, right: 160 }}>
      <Bullets color={colors.gold} items={["شعار يعبّر عن مشروعك", "تصاميم احترافية لمشروعك"]} />
    </div>
  </Slide>
);

// ------------------------------------------------------------------ 4 · TECH & CODE
export const Browser: React.FC = () => (
  <div style={{ width: 560, height: 470, borderRadius: 32, background: "#0B1220", boxShadow: "0 40px 80px rgba(13,36,71,0.3)", rotate: "-4deg", overflow: "hidden" }}>
    <div style={{ height: 50, background: "#141D2E", display: "flex", alignItems: "center", gap: 10, padding: "0 18px" }}>
      {["#FF6159", "#FFBD2E", "#28C941"].map((c) => (
        <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
      ))}
      <div style={{ flex: 1, height: 26, marginLeft: 16, borderRadius: 13, background: "#1E2A40" }} />
    </div>
    <div style={{ display: "flex", height: 420 }}>
      <div style={{ width: 250, padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
        {[0.9, 0.6, 0.8, 0.5, 0.7, 0.4, 0.75].map((w, i) => (
          <div key={i} style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 30 * w + 20, height: 12, borderRadius: 6, background: i % 3 === 0 ? colors.tealBright : i % 3 === 1 ? colors.gold : "#5B7AA8" }} />
            <div style={{ width: 120 * w, height: 12, borderRadius: 6, background: "#33445F" }} />
          </div>
        ))}
      </div>
      <div style={{ flex: 1, margin: 18, borderRadius: 18, background: "#F4F8FC", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ height: 90, borderRadius: 12, background: `linear-gradient(135deg, ${colors.primary}, ${colors.teal})` }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: 80, borderRadius: 10, background: "#fff", boxShadow: "0 4px 10px rgba(13,36,71,0.08)" }} />
          ))}
        </div>
        <div style={{ height: 36, borderRadius: 10, background: colors.navy }} />
      </div>
    </div>
  </div>
);

export const Slide4: React.FC = () => (
  <Slide theme="light" n={4} accent={colors.teal}>
    <div dir="rtl" style={{ position: "absolute", top: 330, left: 80, right: 160 }}>
      <Kicker color={colors.teal}>٠٣ · حلول تقنية وبرمجية</Kicker>
      <div style={{ ...display, fontSize: 86, lineHeight: 1.15, color: colors.textOnLight, marginTop: 20 }}>
        فكرتك تصير
        <br />
        <span style={{ color: colors.teal }}>واقع رقمي</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 160, top: 660, scale: "0.9", transformOrigin: "top left" }}>
      <Browser />
    </div>
    <Tile icon="code" size={140} from="#2FD0C8" to={colors.teal} rotate={10} style={{ position: "absolute", left: 640, top: 990 }} />
    <div dir="rtl" style={{ position: "absolute", top: 1160, left: 80, right: 160 }}>
      <Bullets color={colors.teal} items={["مواقع ومتاجر إلكترونية", "حلول برمجية لمشروعك"]} />
    </div>
  </Slide>
);

// ------------------------------------------------------------------ 5 · CTA
export const Slide5: React.FC = () => (
  <Slide theme="dark" n={5} accent={colors.tealBright} swipe={false}>
    <div style={{ position: "absolute", left: 540 - 80 - 170, top: 330, width: 340, height: 340, borderRadius: 170, background: "#fff", display: "grid", placeItems: "center", boxShadow: `0 0 0 18px rgba(255,255,255,0.06), 0 0 120px ${colors.tealBright}66` }}>
      <Img src={staticFile("brand/logo-color.png")} style={{ width: 280 }} />
    </div>
    <div dir="rtl" style={{ position: "absolute", top: 720, left: 80, right: 160, textAlign: "center" }}>
      <div style={{ ...display, fontSize: 70, lineHeight: 1.2, color: "#fff" }}>
        طلبك ما لقيته؟
        <br />
        اطلبه من <span style={{ color: colors.tealBright }}>«خدمات أخرى»</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 34 }}>
        {[
          { t: "المصداقية", i: "shield" as IconName },
          { t: "سرعة الإنجاز", i: "rocket" as IconName },
        ].map((v) => (
          <div key={v.t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 28px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.15)", ...text, fontWeight: 700, fontSize: 36, color: "#fff" }}>
            <Icon name={v.i} size={40} color={colors.gold} stroke={2} />
            {v.t}
          </div>
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", top: 1080, left: 80, right: 160, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <svg width="80" height="88" viewBox="0 0 120 130">
        <path d="M60 6 L112 62 L80 62 L80 124 L40 124 L40 62 L8 62 Z" fill={colors.gold} />
      </svg>
      <div dir="rtl" style={{ padding: "16px 50px 24px", borderRadius: 30, background: `linear-gradient(135deg, ${colors.primary}, ${colors.teal})`, ...display, fontSize: 70, color: "#fff", boxShadow: "0 20px 50px rgba(14,147,154,0.4)" }}>
        رابط المتجر في البايو
      </div>
      <div dir="ltr" style={{ ...text, fontWeight: 600, fontSize: 32, color: "rgba(255,255,255,0.6)" }}>haxztd.zid.store</div>
    </div>
  </Slide>
);

export const slides = [Slide1, Slide2, Slide3, Slide4, Slide5];
