import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { colors, fonts } from "../theme";
import { Artboard, Browser, PhoneMock } from "./slides";

// Carousel v2 — "editorial" style: warm cream paper, deep navy ink, gold accent,
// huge outlined numerals and a before/after strip on every service slide.
// TikTok-safe: key content in x 70..930, y 200..1480.
const C = {
  cream: "#F6F1E7",
  paper: "#FFFDF8",
  ink: "#0D2447",
  gold: "#E3A63A",
  goldDeep: "#B87A14",
  teal: colors.teal,
  muted: "#6B7A90",
  line: "rgba(13,36,71,0.14)",
};
const display: React.CSSProperties = { fontFamily: fonts.display, fontWeight: 800 };
const text: React.CSSProperties = { fontFamily: fonts.text };

const Grain: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <AbsoluteFill style={{ backgroundImage: `radial-gradient(${dark ? "rgba(255,255,255,0.05)" : "rgba(13,36,71,0.05)"} 1.6px, transparent 2px)`, backgroundSize: "18px 18px" }} />
);

const Header: React.FC<{ n: number; dark?: boolean; numColor?: string }> = ({ n, dark, numColor = C.gold }) => {
  const fg = dark ? "#fff" : C.ink;
  return (
    <div dir="rtl" style={{ position: "absolute", top: 200, left: 80, right: 150, display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 22, borderBottom: `3px solid ${dark ? "rgba(255,255,255,0.18)" : C.line}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 62, height: 62, borderRadius: 31, background: "#fff", display: "grid", placeItems: "center", boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }}>
          <Img src={staticFile("brand/logo-color.png")} style={{ width: 52 }} />
        </div>
        <span style={{ ...display, fontSize: 34, color: fg }}>دبّرها</span>
        <span style={{ ...text, fontWeight: 600, fontSize: 26, color: dark ? "rgba(255,255,255,0.6)" : C.muted }}>للخدمات الإلكترونية</span>
      </div>
      <div dir="ltr" style={{ ...display, fontSize: 30, color: dark ? "rgba(255,255,255,0.55)" : C.muted }}>
        <span style={{ color: numColor }}>0{n}</span> / 05
      </div>
    </div>
  );
};

const Swipe: React.FC<{ dark?: boolean; label?: string }> = ({ dark, label = "اسحب" }) => (
  <div dir="rtl" style={{ position: "absolute", top: 1400, left: 80, right: 150, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14, ...display, fontSize: 34, color: dark ? "#fff" : C.ink }}>
    {label}
    <div style={{ width: 70, height: 70, borderRadius: 35, background: C.gold, display: "grid", placeItems: "center" }}>
      <svg width="34" height="24" viewBox="0 0 34 24">
        <path d="M32 12 H4 M14 2 L3 12 L14 22" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </div>
);

// ------------------------------------------------------------------ 1 · HOOK
export const V2Slide1: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
    <Grain dark />
    <div style={{ position: "absolute", right: -260, top: 820, width: 900, height: 900, borderRadius: "50%", border: `3px solid rgba(227,166,58,0.25)` }} />
    <div style={{ position: "absolute", right: -160, top: 920, width: 700, height: 700, borderRadius: "50%", border: `3px solid rgba(227,166,58,0.15)` }} />
    <Header n={1} dark />
    <div dir="rtl" style={{ position: "absolute", top: 380, left: 80, right: 150 }}>
      <div style={{ ...text, fontWeight: 700, fontSize: 40, color: C.gold }}>قبل لا تطلع من بيتك…</div>
      <div style={{ ...display, fontSize: 215, lineHeight: 1.05, color: C.gold, marginTop: 10, whiteSpace: "nowrap" }}>٣ أشياء</div>
      <div style={{ ...display, fontSize: 112, lineHeight: 1.12, color: "#fff", marginTop: 6 }}>
        تقدر تخلّصها
        <br />
        من جوالك
      </div>
    </div>
    {/* three fanned cards = the three services */}
    {[
      { icon: "code" as IconName, label: "حلول تقنية", rot: 6, x: 80, c: colors.teal },
      { icon: "palette" as IconName, label: "شعارات وتصاميم", rot: -3, x: 365, c: C.gold },
      { icon: "document" as IconName, label: "خدمات إلكترونية", rot: 5, x: 650, c: colors.primary },
    ].map((k, i) => (
      <div key={k.label} dir="rtl" style={{ position: "absolute", left: k.x, top: 1060 + (i % 2) * 30, width: 265, height: 280, borderRadius: 40, background: C.paper, rotate: `${k.rot}deg`, boxShadow: "0 30px 60px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 30 }}>
        <div style={{ width: 92, height: 92, borderRadius: 26, background: k.c, display: "grid", placeItems: "center" }}>
          <Icon name={k.icon} size={54} color="#fff" stroke={2} />
        </div>
        <div style={{ ...display, fontSize: 36, color: C.ink, lineHeight: 1.15 }}>{k.label}</div>
      </div>
    ))}
    <Swipe dark />
  </AbsoluteFill>
);

// ------------------------------------------------------------------ 2–4 · SERVICES (editorial + before/after)
type ServiceProps = {
  n: number;
  numeral: string;
  kicker: string;
  title: [string, string];
  accent: string;
  before: string;
  after: string;
  visual: React.ReactNode;
};

const Service: React.FC<ServiceProps> = ({ n, numeral, kicker, title, accent, before, after, visual }) => (
  <AbsoluteFill style={{ background: C.cream, overflow: "hidden" }}>
    <Grain />
    {/* giant outlined numeral */}
    <div style={{ position: "absolute", left: 30, top: 230, ...display, fontSize: 620, lineHeight: 1, color: "transparent", WebkitTextStroke: `4px ${accent}55` }}>{numeral}</div>
    <Header n={n} />
    <div dir="rtl" style={{ position: "absolute", top: 320, left: 80, right: 150 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 12, ...text, fontWeight: 700, fontSize: 32, color: accent }}>
        <span style={{ width: 40, height: 4, background: accent, display: "inline-block" }} />
        {kicker}
      </div>
      <div style={{ ...display, fontSize: 104, lineHeight: 1.1, color: C.ink, marginTop: 14 }}>
        {title[0]}
        <br />
        <span style={{ color: accent }}>{title[1]}</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 470, display: "grid", placeItems: "center" }}>{visual}</div>
    {/* before / after strip */}
    <div dir="rtl" style={{ position: "absolute", top: 1150, left: 80, right: 150, display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: 34, overflow: "hidden", boxShadow: "0 18px 40px rgba(13,36,71,0.12)" }}>
      <div style={{ background: C.paper, padding: "24px 28px" }}>
        <div style={{ ...text, fontWeight: 700, fontSize: 26, color: C.muted }}>قبل</div>
        <div style={{ position: "relative", display: "inline-block", ...display, fontSize: 40, color: "#9AA5B5", marginTop: 4 }}>
          {before}
          <div style={{ position: "absolute", left: -4, right: -4, top: "55%", height: 5, borderRadius: 3, background: "#D9534F", rotate: "-3deg" }} />
        </div>
      </div>
      <div style={{ background: C.ink, padding: "24px 28px" }}>
        <div style={{ ...text, fontWeight: 700, fontSize: 26, color: C.gold }}>مع دبّرها</div>
        <div style={{ ...display, fontSize: 40, color: "#fff", marginTop: 4 }}>{after}</div>
      </div>
    </div>
    <Swipe />
  </AbsoluteFill>
);

export const V2Slide2: React.FC = () => (
  <Service
    n={2}
    numeral="١"
    kicker="خدمات إلكترونية"
    title={["معاملاتك", "من جوالك"]}
    accent={colors.primary}
    before="مشوار وزحمة"
    after="طلب من جوالك"
    visual={
      <div style={{ scale: "0.56", marginTop: -60 }}>
        <PhoneMock />
      </div>
    }
  />
);

export const V2Slide3: React.FC = () => (
  <Service
    n={3}
    numeral="٢"
    kicker="شعارات وتصاميم"
    title={["فكرة مشروعك", "بشعار يمثّلها"]}
    accent={C.goldDeep}
    before="فكرة في بالك"
    after="شعار يعبّر عنك"
    visual={
      <div style={{ scale: "0.85" }}>
        <Artboard />
      </div>
    }
  />
);

export const V2Slide4: React.FC = () => (
  <Service
    n={4}
    numeral="٣"
    kicker="حلول تقنية وبرمجية"
    title={["من ورقة", "إلى موقع"]}
    accent={colors.teal}
    before="فكرة على ورق"
    after="موقع أو متجر"
    visual={
      <div style={{ scale: "0.85" }}>
        <Browser />
      </div>
    }
  />
);

// ------------------------------------------------------------------ 5 · CTA
export const V2Slide5: React.FC = () => (
  <AbsoluteFill style={{ background: C.gold, overflow: "hidden" }}>
    <Grain />
    <div style={{ position: "absolute", left: -200, top: 1050, width: 800, height: 800, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }} />
    <Header n={5} numColor={C.ink} />
    <div dir="rtl" style={{ position: "absolute", top: 340, left: 80, right: 150 }}>
      <div style={{ ...display, fontSize: 210, lineHeight: 1, color: C.ink }}>جاهز؟</div>
      <div style={{ ...display, fontSize: 84, lineHeight: 1.15, color: C.ink, marginTop: 20 }}>
        اطلب خدمتك
        <br />
        وخلّها علينا.
      </div>
      <div style={{ ...text, fontWeight: 600, fontSize: 38, lineHeight: 1.5, color: "rgba(13,36,71,0.8)", marginTop: 26 }}>
        ما لقيت خدمتك؟ اطلبها من <b style={{ color: C.ink }}>«خدمات أخرى»</b>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
        {[
          { t: "المصداقية", i: "shield" as IconName },
          { t: "سرعة الإنجاز", i: "rocket" as IconName },
        ].map((v) => (
          <div key={v.t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 26px", borderRadius: 999, background: "rgba(13,36,71,0.1)", ...text, fontWeight: 700, fontSize: 34, color: C.ink }}>
            <Icon name={v.i} size={38} color={C.ink} stroke={2} />
            {v.t}
          </div>
        ))}
      </div>
    </div>
    <div dir="rtl" style={{ position: "absolute", top: 1170, left: 80, right: 150, display: "flex", alignItems: "center", gap: 24, padding: "28px 34px", borderRadius: 40, background: C.ink, boxShadow: "0 24px 50px rgba(13,36,71,0.35)" }}>
      <div style={{ width: 96, height: 96, borderRadius: 48, background: C.gold, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <svg width="44" height="50" viewBox="0 0 120 130">
          <path d="M60 6 L112 62 L80 62 L80 124 L40 124 L40 62 L8 62 Z" fill={C.ink} />
        </svg>
      </div>
      <div>
        <div style={{ ...display, fontSize: 64, color: "#fff" }}>رابط المتجر في البايو</div>
        <div dir="ltr" style={{ ...text, fontWeight: 600, fontSize: 30, color: "rgba(255,255,255,0.6)", textAlign: "right" }}>haxztd.zid.store</div>
      </div>
    </div>
  </AbsoluteFill>
);
