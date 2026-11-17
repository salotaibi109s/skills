import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { fonts } from "../theme";
import { Barcode, Paper, sale, Sticker, Strike } from "./base";

// Static White Friday design pack, rendered as stills at the last frame (all motion settled).
const display: React.CSSProperties = { fontFamily: fonts.display, fontWeight: 800 };

const Tag: React.FC<{ label: string; icon: IconName; oldText: string; newText: string; scale?: number; tilt?: number }> = ({ label, icon, oldText, newText, scale = 1, tilt = -4 }) => (
  <div style={{ position: "relative", width: 560, height: 680, scale: String(scale), rotate: `${tilt}deg` }}>
    <div dir="rtl" style={{ position: "absolute", inset: 0, background: "#fff", clipPath: "polygon(25% 0, 75% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)", display: "flex", flexDirection: "column", alignItems: "center", padding: "110px 40px 36px", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.25))" }}>
      <div style={{ position: "absolute", top: 34, width: 40, height: 40, borderRadius: 20, background: sale.paper, border: `6px solid ${sale.ink}` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, ...display, fontSize: 48, color: sale.ink, whiteSpace: "nowrap" }}>
        <Icon name={icon} size={58} color={sale.red} stroke={2.2} />
        {label}
      </div>
      <div style={{ width: "100%", borderTop: `5px dashed ${sale.ink}33`, margin: "28px 0 20px" }} />
      <div style={{ fontFamily: fonts.text, fontWeight: 700, fontSize: 30, color: "#777" }}>السعر القديم</div>
      <div style={{ position: "relative", ...display, fontSize: 96, color: sale.ink, opacity: 0.55 }}>
        {oldText}
        <Strike at={0} width={oldText.length * 46} height={60} />
      </div>
      <div style={{ marginTop: "auto" }}>
        <Barcode width={320} height={76} seed={label} />
      </div>
    </div>
    <Sticker at={0} shape="burst" size={330} rotate={-10} fontSize={newText.length > 6 ? 54 : 66} style={{ left: -90, top: 470 }}>
      {newText}
    </Sticker>
  </div>
);

const BioBanner: React.FC<{ size?: number }> = ({ size = 72 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <svg width="96" height="104" viewBox="0 0 120 130">
      <path d="M60 6 L112 62 L80 62 L80 124 L40 124 L40 62 L8 62 Z" fill={sale.red} stroke="#fff" strokeWidth="6" strokeLinejoin="round" />
    </svg>
    <div dir="rtl" style={{ marginTop: 10, padding: "10px 40px 20px", background: sale.ink, color: "#fff", ...display, fontSize: size, rotate: "-2deg", boxShadow: "0 18px 36px rgba(0,0,0,0.25)" }}>
      رابط المتجر <span style={{ color: sale.yellow }}>في البايو</span>
    </div>
  </div>
);

const Logo: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: "#fff", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", display: "grid", placeItems: "center" }}>
    <Img src={staticFile("brand/logo-color.png")} style={{ width: size * 0.8 }} />
  </div>
);

const Rays: React.FC<{ y: string }> = ({ y }) => <AbsoluteFill style={{ background: `repeating-conic-gradient(from 0deg at 50% ${y}, rgba(227,38,47,0.07) 0deg 8deg, transparent 8deg 20deg)` }} />;

/** Feed post 1080×1350. */
export const WhitePost: React.FC = () => (
  <AbsoluteFill>
    <Paper />
    <Rays y="55%" />
    <div dir="rtl" style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ ...display, fontSize: 92, background: sale.ink, color: "#fff", padding: "0 40px 14px", rotate: "-3deg" }}>
        أقوى <span style={{ color: sale.red }}>تخفيض</span>
      </div>
      <div style={{ ...display, fontSize: 70, background: sale.red, color: "#fff", padding: "0 36px 12px", rotate: "2deg" }}>في الجمعة البيضاء</div>
      <div style={{ ...display, fontSize: 84, color: sale.ink, marginTop: 6 }}>
        على <span style={{ color: sale.red }}>وقتك!</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 440, top: 545, scale: "0.78", transformOrigin: "top left" }}>
      <Tag label="معاملة إلكترونية" icon="document" oldText="يوم كامل" newText="من جوالك" />
    </div>
    <div style={{ position: "absolute", left: 60, top: 520, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <Logo size={240} />
      <div dir="rtl" style={{ ...display, fontSize: 36, color: sale.ink, textAlign: "center", lineHeight: 1.25 }}>
        دبّرها
        <br />
        للخدمات الإلكترونية
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1210, display: "flex", justifyContent: "center" }}>
      <div dir="rtl" style={{ padding: "10px 40px 18px", background: sale.ink, color: "#fff", ...display, fontSize: 60, rotate: "-2deg" }}>
        رابط المتجر <span style={{ color: sale.yellow }}>في البايو</span>
      </div>
    </div>
  </AbsoluteFill>
);

/** Story 1080×1920 — content kept inside the safe area (250..1520). */
export const WhiteStory: React.FC = () => (
  <AbsoluteFill>
    <Paper />
    <Rays y="45%" />
    <div dir="rtl" style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ ...display, fontSize: 70, background: sale.red, color: "#fff", padding: "0 34px 12px", rotate: "2deg" }}>الجمعة البيضاء</div>
      <div style={{ ...display, fontSize: 104, color: sale.ink, lineHeight: 1.15 }}>
        تخفيض… على <span style={{ color: sale.red }}>وقتك!</span>
      </div>
    </div>
    {[
      { icon: "document" as IconName, label: "معاملة إلكترونية", old: "يوم كامل", now: "من جوالك" },
      { icon: "palette" as IconName, label: "شعار مشروعك", old: "شهر حيرة", now: "جاهز" },
      { icon: "code" as IconName, label: "موقع أو حل تقني", old: "فكرة بس", now: "تتنفّذ" },
    ].map((r, i) => (
      <div key={r.label} dir="rtl" style={{ position: "absolute", left: 90, right: 90, top: 560 + i * 200, height: 168, display: "flex", alignItems: "center", gap: 22, padding: "0 30px", borderRadius: 34, background: "#fff", boxShadow: "0 16px 30px rgba(0,0,0,0.1)", rotate: `${i % 2 ? 1.2 : -1.2}deg` }}>
        <div style={{ width: 96, height: 96, borderRadius: 26, background: sale.ink, display: "grid", placeItems: "center" }}>
          <Icon name={r.icon} size={56} color="#fff" stroke={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...display, fontSize: 44, color: sale.ink }}>{r.label}</div>
          <div style={{ position: "relative", display: "inline-block", fontFamily: fonts.text, fontWeight: 700, fontSize: 34, color: "#888" }}>
            {r.old}
            <Strike at={0} width={r.old.length * 18} height={30} />
          </div>
        </div>
        <div style={{ padding: "8px 26px 14px", borderRadius: 999, background: sale.red, color: "#fff", ...display, fontSize: 44, rotate: "-6deg", border: "6px solid #fff", boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}>{r.now}</div>
      </div>
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1170, display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
      <BioBanner size={64} />
      <Logo size={190} />
    </div>
  </AbsoluteFill>
);

/** Reels cover 1080×1920: the hook frame, clean, inside the centre crop used by profile grids. */
export const WhiteCover: React.FC = () => (
  <AbsoluteFill>
    <Paper />
    <Rays y="50%" />
    <div dir="rtl" style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ ...display, fontSize: 120, background: sale.ink, color: "#fff", padding: "0 44px 16px", rotate: "-3deg" }}>
        أقوى <span style={{ color: sale.red }}>تخفيض</span>
      </div>
      <div style={{ ...display, fontSize: 92, background: sale.red, color: "#fff", padding: "0 40px 14px", rotate: "2deg" }}>في الجمعة البيضاء</div>
      <div style={{ position: "relative", ...display, fontSize: 130, color: sale.ink, marginTop: 30 }}>
        مو على الأسعار
        <Strike at={0} width={430} height={70} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1230, display: "flex", justifyContent: "center" }}>
      <Logo size={190} />
    </div>
  </AbsoluteFill>
);
