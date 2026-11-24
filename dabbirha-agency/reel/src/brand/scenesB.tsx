import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icon, type IconName } from "../components/Icons";
import { fonts } from "../theme";
import { bp, Converge, getBrandScene, Glass, Headline, PhoneX, SceneVoice, Sfx, spoken, Stage } from "./kit";

// ============================================================ B4 · TECHNOLOGY & SOFTWARE
const b4 = getBrandScene("B4-Tech");

const NODES = Array.from({ length: 26 }).map((_, i) => ({ x: 80 + random(`nx${i}`) * 920, y: 520 + random(`ny${i}`) * 820, z: random(`nz${i}`) }));
const EDGES = NODES.flatMap((a, i) =>
  NODES.slice(i + 1)
    .map((b, j) => ({ a: i, b: i + 1 + j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
    .filter((e) => e.d < 260),
);

const CodeScreen: React.FC<{ lines: number }> = ({ lines }) => {
  const code: [string, string][] = [
    ["const", " service = await dabbirha.build({"],
    ["  idea", ": yourIdea,"],
    ["  quality", ": \"premium\","],
    ["})", ""],
    ["deploy", "(service) // ✓"],
  ];
  return (
    <Glass style={{ width: 520, height: 330, padding: 26 }} tint={bp.electric}>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />
        ))}
      </div>
      <div dir="ltr" style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 24, lineHeight: 1.6, color: "#CFE6FF" }}>
        {code.slice(0, lines).map(([k, rest], i) => (
          <div key={i}>
            <span style={{ color: i === 4 ? bp.tealBright : "#7FB3FF" }}>{k}</span>
            <span>{rest}</span>
          </div>
        ))}
      </div>
    </Glass>
  );
};

const Dashboard: React.FC<{ grow: number }> = ({ grow }) => (
  <Glass style={{ width: 420, height: 300, padding: 24 }} tint={bp.tealBright}>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 170 }}>
      {[0.45, 0.7, 0.55, 0.9, 0.75, 1].map((h, i) => (
        <div key={i} style={{ flex: 1, height: `${h * grow * 100}%`, borderRadius: 8, background: `linear-gradient(180deg, ${bp.tealBright}, ${bp.electric})` }} />
      ))}
    </div>
    <div style={{ marginTop: 22, display: "flex", gap: 12 }}>
      {[0.6, 0.3].map((w, i) => (
        <div key={i} style={{ height: 14, width: `${w * 100}%`, borderRadius: 7, background: "rgba(255,255,255,0.3)" }} />
      ))}
    </div>
  </Glass>
);

const ApiCard: React.FC<{ ok: boolean }> = ({ ok }) => (
  <Glass style={{ width: 340, height: 200, padding: 24 }} tint={bp.gold}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <Icon name="code" size={50} color={bp.gold} stroke={2} />
      <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 26, color: "#fff" }}>API</div>
    </div>
    <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 18, height: 18, borderRadius: 9, background: ok ? "#28C840" : "#FEBC2E", boxShadow: `0 0 14px ${ok ? "#28C840" : "#FEBC2E"}` }} />
      <div dir="ltr" style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 24, color: "#CFE6FF" }}>{ok ? "200 OK" : "connecting…"}</div>
    </div>
  </Glass>
);

export const B4Tech: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const tTech = spoken(b4, "التقنية");
  const tCode = spoken(b4, "والبرمجية");
  const tSol = spoken(b4, "حلولا");
  const net = interpolate(frame, [0, tSol], [0, 1], { extrapolateRight: "clamp" });
  const dolly = interpolate(frame, [0, durationInFrames], [0, 1], { easing: Easing.inOut(Easing.quad) });
  const s = (at: number) => spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 110 } });
  // the B3 design cards morph into wireframes and dissolve at the top of the scene
  const wire = interpolate(frame, [0, 22], [1, 0], { extrapolateRight: "clamp" });

  return (
    <Stage focus={bp.electric}>
      {wire > 0 && (
        <AbsoluteFill style={{ opacity: wire, filter: `blur(${(1 - wire) * 8}px)` }}>
          {[{ x: 190, y: 560, w: 700, h: 560 }, { x: 80, y: 600, w: 300, h: 180 }, { x: 640, y: 1150, w: 230, h: 230 }].map((r, i) => (
            <div key={i} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 30, border: `2px dashed ${bp.electric}`, boxShadow: `0 0 30px ${bp.electric}55` }} />
          ))}
        </AbsoluteFill>
      )}
      {/* particle network */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, scale: String(1 + dolly * 0.25), transformOrigin: "540px 930px" }}>
        {EDGES.map((e, i) => {
          const p = Math.min(1, Math.max(0, net * 1.6 - (i / EDGES.length) * 0.6));
          const A = NODES[e.a];
          const B = NODES[e.b];
          return <line key={i} x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * p} y2={A.y + (B.y - A.y) * p} stroke="rgba(110,180,255,0.35)" strokeWidth={1.5} />;
        })}
        {NODES.map((n, i) => {
          const on = net * NODES.length > i;
          return <circle key={i} cx={n.x} cy={n.y} r={on ? 4 + n.z * 5 : 0} fill={i % 4 ? bp.electric : bp.tealBright} style={{ filter: "drop-shadow(0 0 8px rgba(61,139,255,0.9))" }} />;
        })}
      </svg>
      {/* floating screens with depth, camera dollying through */}
      <AbsoluteFill style={{ perspective: 1600 }}>
        {[
          { at: tTech, x: 110, y: 660, z: 20, ry: 16, el: <CodeScreen lines={Math.min(5, Math.max(0, Math.floor((frame - tTech) / 6)))} /> },
          { at: tCode, x: 580, y: 860, z: 0, ry: -18, el: <Dashboard grow={s(tCode)} /> },
          { at: tSol, x: 160, y: 1080, z: 40, ry: 10, el: <ApiCard ok={frame > tSol + 18} /> },
        ].map((p, i) => {
          const sp = s(p.at);
          if (frame < p.at) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y + Math.sin((frame + i * 30) / 26) * 8,
                transform: `translateZ(${p.z + dolly * 80 - (1 - sp) * 500}px) rotateY(${p.ry}deg)`,
                opacity: Math.min(1, sp * 1.4),
              }}
            >
              {p.el}
            </div>
          );
        })}
      </AbsoluteFill>
      {/* light trails */}
      {[0, 1, 2].map((i) => {
        const t = ((frame * (6 + i * 2) + i * 400) % 1600) - 300;
        return <div key={i} style={{ position: "absolute", top: 600 + i * 260, left: t, width: 260, height: 3, background: `linear-gradient(90deg, transparent, ${i % 2 ? bp.tealBright : bp.electric}, transparent)`, filter: "blur(1px)" }} />;
      })}
      <div style={{ position: "absolute", top: 290, left: 60, right: 60 }}>
        <Headline
          size={100}
          words={[
            { text: "تقنية", at: tTech, color: bp.electric },
            { text: "برمجة", at: tCode, color: "#FFFFFF" },
            { text: "حلول", at: tSol, color: bp.tealBright },
            { text: "رقمية", at: tSol + 4, color: bp.tealBright },
          ]}
        />
      </div>
      <SceneVoice scene={b4} />
      <Sfx name="whoosh" at={0} />
      <Sfx name="ui" at={tTech} />
      <Sfx name="ui" at={tCode} />
      <Sfx name="mech" at={tSol - 8} />
      <Sfx name="notify" at={tSol + 18} gain={0.8} />
    </Stage>
  );
};

// ============================================================ B5 · E-SERVICES
const b5 = getBrandScene("B5-EServices");

export const B5EServices: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tPlat = spoken(b5, "ولخدمات");
  const tTx = spoken(b5, "والمعاملات");
  const tBrand = spoken(b5, "دبرها");
  const tReach = spoken(b5, "لاحتياجك");
  const phoneIn = spring({ frame, fps, config: { damping: 16 }, durationInFrames: 24 });
  const s = (at: number) => spring({ frame: frame - at, fps, config: { damping: 14 } });
  const steps = [
    { label: "استلام الطلب", at: tTx },
    { label: "قيد التنفيذ", at: tBrand },
    { label: "مكتمل", at: tReach },
  ];
  const flow = interpolate(frame, [tTx, tReach], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const docs: { x: number; y: number; r: number; icon: IconName; at: number }[] = [
    { x: 60, y: 640, r: -10, icon: "document", at: tPlat + 6 },
    { x: 800, y: 600, r: 9, icon: "id", at: tPlat + 14 },
    { x: 70, y: 1080, r: 7, icon: "contract", at: tTx + 4 },
    { x: 810, y: 1060, r: -8, icon: "building", at: tTx + 12 },
  ];
  return (
    <Stage focus={bp.tealBright}>
      {/* floating digital documents, flowing into the phone */}
      {docs.map((d, i) => {
        const sp = s(d.at);
        const pull = interpolate(frame, [tBrand + i * 4, tBrand + 24 + i * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
        if (frame < d.at) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x + (540 - 105 - d.x) * pull,
              top: d.y + Math.sin((frame + i * 25) / 24) * 10 + (940 - d.y) * pull,
              rotate: `${d.r * (1 - pull)}deg`,
              scale: String((0.5 + 0.5 * sp) * (1 - pull * 0.8)),
              opacity: Math.min(1, sp * 1.5) * (1 - pull),
            }}
          >
            <Glass style={{ width: 210, height: 250, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }} tint="#FFFFFF" radius={26}>
              <Icon name={d.icon} size={70} color="#EAF6FF" stroke={1.7} />
              {[0.9, 0.7, 0.8].map((w, k) => (
                <div key={k} style={{ height: 10, width: `${w * 100}%`, borderRadius: 5, background: "rgba(234,246,255,0.45)" }} />
              ))}
            </Glass>
          </div>
        );
      })}
      {/* phone with a generic, organised transaction screen (no official identities) */}
      <div style={{ position: "absolute", left: 320, top: 560, scale: String(0.85 + 0.15 * phoneIn), opacity: phoneIn }}>
        <PhoneX width={440}>
          <AbsoluteFill dir="rtl" style={{ background: "linear-gradient(180deg, #F4F9FF 0%, #E3EEF9 100%)", padding: "78px 24px 24px", display: "flex", flexDirection: "column", gap: 16, fontFamily: fonts.text }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 800, fontSize: 32, color: bp.brandNavy }}>طلباتي</div>
              <Img src={staticFile("brand/logo-color.png")} style={{ width: 120, opacity: frame >= tBrand ? 1 : 0, scale: String(frame >= tBrand ? 0.7 + 0.3 * s(tBrand) : 0.7) }} />
            </div>
            {[
              { icon: "document" as IconName, t: "معاملة إلكترونية" },
              { icon: "id" as IconName, t: "خدمة منصة" },
              { icon: "contract" as IconName, t: "طلب خدمة" },
            ].map((r, k) => {
              const done = frame >= tReach + k * 4;
              return (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 16px", borderRadius: 20, background: "#fff", boxShadow: "0 8px 20px rgba(13,36,71,0.08)" }}>
                  <div style={{ width: 54, height: 54, borderRadius: 16, display: "grid", placeItems: "center", background: "rgba(33,100,155,0.1)" }}>
                    <Icon name={r.icon} size={32} color={bp.primary} stroke={2} />
                  </div>
                  <div style={{ flex: 1, fontWeight: 700, fontSize: 28, color: bp.brandNavy }}>{r.t}</div>
                  <div style={{ width: 40, height: 40, borderRadius: 20, display: "grid", placeItems: "center", background: done ? "#22A06B" : "#E6EBF0" }}>
                    {done ? <Icon name="check" size={26} color="#fff" stroke={3} /> : <div style={{ width: 20, height: 20, borderRadius: 10, border: `3px solid ${bp.primary}`, borderTopColor: "transparent", rotate: `${frame * 12}deg` }} />}
                  </div>
                </div>
              );
            })}
            {/* workflow */}
            <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", padding: "0 10px" }}>
              <div style={{ position: "absolute", left: 30, right: 30, top: 22, height: 6, borderRadius: 3, background: "#D5DEE8" }}>
                <div style={{ position: "absolute", right: 0, width: `${flow * 100}%`, height: "100%", borderRadius: 3, background: `linear-gradient(270deg, ${bp.primary}, ${bp.teal})` }} />
              </div>
              {steps.map((st, k) => {
                const on = frame >= st.at;
                return (
                  <div key={k} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 1 }}>
                    <div style={{ width: 50, height: 50, borderRadius: 25, background: on ? bp.teal : "#fff", border: `3px solid ${on ? bp.teal : "#C9D3DE"}`, display: "grid", placeItems: "center", scale: String(on ? 0.8 + 0.2 * s(st.at) : 0.8) }}>
                      {on && <Icon name="check" size={28} color="#fff" stroke={3} />}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 20, color: on ? bp.brandNavy : "#8A97A8" }}>{st.label}</div>
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
        </PhoneX>
      </div>
      <div style={{ position: "absolute", top: 290, left: 60, right: 60 }}>
        <Headline
          size={92}
          words={[
            { text: "خدمات", at: tPlat, color: "#FFFFFF" },
            { text: "إلكترونية", at: tPlat + 6, color: bp.tealBright },
            { text: "معاملات", at: tTx, color: "#FFFFFF" },
            { text: "حكومية", at: tTx + 6, color: bp.tealBright },
          ]}
        />
      </div>
      <SceneVoice scene={b5} />
      <Sfx name="whoosh" at={0} />
      {docs.map((d, i) => (
        <Sfx key={i} name="ui" at={d.at} />
      ))}
      <Sfx name="particles" at={tBrand} gain={0.7} />
      <Sfx name="notify" at={tReach} />
    </Stage>
  );
};

// ============================================================ B6 · ONE EXPERIENCE
const b6 = getBrandScene("B6-Unified");

const World: React.FC<{ icons: IconName[]; color: string; label: string }> = ({ icons, color, label }) => (
  <Glass style={{ width: 230, height: 230, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }} tint={color} radius={115}>
    <div style={{ display: "flex", gap: 8 }}>
      {icons.map((ic) => (
        <Icon key={ic} name={ic} size={50} color={color} stroke={1.8} />
      ))}
    </div>
    <div dir="rtl" style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 34, color: "#fff" }}>{label}</div>
  </Glass>
);

export const B6Unified: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tCre = spoken(b6, "إبداع");
  const tTech = spoken(b6, "تقنية");
  const tSvc = spoken(b6, "وخدمات");
  const tAll = spoken(b6, "كلها");
  const tOne = spoken(b6, "وجهة");
  const merge = interpolate(frame, [tAll, tAll + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const flash = interpolate(frame, [tAll + 17, tAll + 18, tAll + 30], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scroll = interpolate(frame, [10, tAll + 30], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const worlds = [
    { at: tCre, icons: ["palette", "image"] as IconName[], color: bp.coral, label: "إبداع" },
    { at: tTech, icons: ["code", "layers"] as IconName[], color: bp.electric, label: "تقنية" },
    { at: tSvc, icons: ["document", "check"] as IconName[], color: bp.tealBright, label: "خدمات" },
  ];
  const CX = 540;
  const CY = 930;
  return (
    <Stage focus={bp.electric} light={1.2}>
      <Converge start={tAll} end={tAll + 20} tx={CX} ty={CY} count={70} spread={420} seed="b6" />
      {/* orbiting worlds — drawn behind or in front of the phone by depth */}
      {(["back", "front"] as const).map((layer) => (
        <React.Fragment key={layer}>
          {layer === "front" && (
            <div style={{ position: "absolute", left: CX - 210, top: CY - 433, filter: `drop-shadow(0 0 ${40 + merge * 60}px rgba(61,139,255,0.6))` }}>
              <PhoneX width={420} glow={1 + merge}>
                {/* authentic screenshot of the Dabbirha store (top of the homepage) */}
                <AbsoluteFill style={{ background: "#F5F8FC" }} />
                <Img src={staticFile("site/site-hero.png")} style={{ position: "absolute", top: 30 + scroll, left: "-12%", width: "124%" }} />
              </PhoneX>
            </div>
          )}
          {worlds.map((w, i) => {
            const s = spring({ frame: frame - w.at, fps, config: { damping: 14 } });
            if (frame < w.at) return null;
            const ang = frame / 28 + (i * Math.PI * 2) / 3;
            const depth = Math.sin(ang); // >0 = front
            if ((layer === "front") !== depth > 0) return null;
            const r = 400 * (1 - merge);
            const x = CX + Math.cos(ang) * r;
            const y = CY + Math.sin(ang) * r * 0.32 + 300 * (1 - merge) * 0.3;
            const sc = (0.75 + 0.25 * (depth + 1) / 2) * s * (1 - merge * 0.9);
            return (
              <div key={i} style={{ position: "absolute", left: x - 115, top: y - 115, scale: String(sc), opacity: Math.min(1, s * 1.5) * (1 - merge * 0.6), filter: depth < 0 ? "blur(2px) brightness(0.7)" : undefined }}>
                <World icons={w.icons} color={w.color} label={w.label} />
              </div>
            );
          })}
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", top: 260, left: 60, right: 60 }}>
        <Headline size={96} words={[{ text: "وجهة", at: tOne, color: "#FFFFFF" }, { text: "واحدة", at: tOne + 5, color: bp.tealBright }]} />
      </div>
      <div style={{ position: "absolute", top: 1420, left: 60, right: 60 }}>
        <Headline size={58} words={[{ text: "احتياجاتك", at: tOne + 10 }, { text: "الرقمية", at: tOne + 14, color: bp.tealBright }, { text: "في", at: tOne + 18 }, { text: "مكان", at: tOne + 21 }, { text: "واحد", at: tOne + 24 }]} />
      </div>
      <AbsoluteFill style={{ background: "#EAF6FF", opacity: flash, pointerEvents: "none" }} />
      <SceneVoice scene={b6} />
      {worlds.map((w) => (
        <Sfx key={w.label} name="pop" at={w.at} />
      ))}
      <Sfx name="particles" at={tAll} />
      <Sfx name="riser" at={tAll - 12} gain={0.6} />
    </Stage>
  );
};

// ============================================================ B7 · GRAND FINALE
const b7 = getBrandScene("B7-Finale");

export const B7Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = spoken(b7, "تعقدها");
  const t2 = spoken(b7, "تشيل");
  const tName = spoken(b7, "دبرها");
  const logo = spring({ frame: frame - tName, fps, config: { damping: 12, stiffness: 120 } });
  const flash = interpolate(frame, [tName - 1, tName, tName + 9], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rays = interpolate(frame, [tName, tName + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const linesOut = tName - 2;
  const slogan = tName + 10;
  const cta = tName + 22;
  const url = tName + 30;
  return (
    <Stage focus={bp.tealBright} light={0.6 + rays}>
      <Converge start={0} end={tName} tx={540} ty={660} count={140} spread={900} seed="b7" />
      {/* light rays behind the logo */}
      {frame >= tName && (
        <div style={{ position: "absolute", left: 540 - 700, top: 660 - 700, width: 1400, height: 1400, borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, rgba(120,200,255,0.16) 0deg 4deg, transparent 4deg 18deg)", rotate: `${frame * 0.4}deg`, opacity: rays * 0.9, maskImage: "radial-gradient(circle, #000 0%, transparent 65%)", WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 65%)" }} />
      )}
      {/* the two lines before the reveal */}
      {frame < linesOut + 10 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 20, flexDirection: "column", paddingInline: 60 }}>
          <Headline size={104} words={[{ text: "لا", at: b7.words[0].start }, { text: "تعقّدها…", at: t1 }]} out={linesOut} />
          <Headline size={104} words={[{ text: "لا", at: b7.words[2].start }, { text: "تشيل", at: t2 }, { text: "همّ…", at: b7.words[4].start, color: bp.gold }]} out={linesOut} />
        </AbsoluteFill>
      )}
      {/* original logo */}
      {frame >= tName - 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", perspective: 1600 }}>
          <div style={{ transform: `rotateY(${(1 - logo) * -70}deg) scale(${0.5 + 0.5 * logo})`, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6)) drop-shadow(0 0 70px rgba(61,139,255,0.6))" }}>
            <Img src={staticFile("brand/logo-badge.png")} style={{ width: 520, height: 520, borderRadius: 260 }} />
          </div>
        </div>
      )}
      <div style={{ position: "absolute", top: 960, left: 50, right: 50 }}>
        <Headline size={70} words={[{ text: "كل", at: slogan }, { text: "ما", at: slogan + 2 }, { text: "تحتاجه", at: slogan + 4 }, { text: "رقمياً…", at: slogan + 7 }, { text: "دبّرها!", at: slogan + 11, color: bp.tealBright }]} />
      </div>
      {frame >= cta && (
        <div style={{ position: "absolute", top: 1110, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <div dir="rtl" style={{ padding: "18px 46px", borderRadius: 999, background: `linear-gradient(135deg, ${bp.teal}, ${bp.electric})`, color: "#fff", fontFamily: fonts.display, fontWeight: 800, fontSize: 46, boxShadow: `0 20px 50px rgba(61,139,255,0.45)`, scale: String(spring({ frame: frame - cta, fps, config: { damping: 12 } })) }}>
            اكتشف خدماتنا الآن
          </div>
        </div>
      )}
      {frame >= url && (
        <div style={{ position: "absolute", top: 1240, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: spring({ frame: frame - url, fps, config: { damping: 200 } }) }}>
          <div dir="ltr" style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.display, fontWeight: 700, fontSize: 48, color: "#EAF6FF" }}>
            <Icon name="link" size={42} color={bp.tealBright} stroke={2.2} />
            haxztd.zid.store
          </div>
        </div>
      )}
      <AbsoluteFill style={{ background: "#EAF6FF", opacity: flash, pointerEvents: "none" }} />
      <SceneVoice scene={b7} />
      <Sfx name="particles" at={0} />
      <Sfx name="riser" at={tName - 22} gain={0.8} />
      <Sfx name="impact" at={tName} />
      <Sfx name="pop" at={cta} />
    </Stage>
  );
};
