import React from "react";
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame } from "remotion";
import data from "../data/cool-timeline.json";
import type { TimelineData } from "../lib/timing";
import { ar, BrandPill, Captions, clamp, ease, EndCard, jolt, makeStory, MusicBed, NameChip, pop, RedVignette, SANS, Voices } from "./kit";

/** «بيتك بدون مكيّف» — one mud house in the desert that keeps getting cooler, a thermometer on the side. */
export const cTimeline = data as TimelineData;
const { Sfx, SceneVoice, at, start, end } = makeStory(cTimeline, "audio/cool");

const K = {
  sky1: "#8FD0F5",
  sky2: "#F9E3B4",
  night1: "#0E1D3D",
  night2: "#2B3E6B",
  sand: "#E9C27E",
  sandDark: "#D3A25A",
  mud: "#C98D52",
  mudDark: "#9C6634",
  wood: "#7A4A22",
  ink: "#2A1C10",
  red: "#E0313F",
  orange: "#F2793A",
  blue: "#3DA9FC",
  green: "#2BB673",
};

const GROUND = 1460;
const HX = 540; // house centre
const HW = 520;
const HH = 380;
const TOP = GROUND - HH;

/** piecewise value from keyframes [frame, value] with eased steps */
const steps = (f: number, ks: [number, number][]) => {
  let v = ks[0][1];
  for (let i = 1; i < ks.length; i++) v += (ks[i][1] - ks[i - 1][1]) * ease(f, ks[i][0] - 2, ks[i][0] + 16);
  return v;
};

const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const L = f >= start("H15"); // loop: back to the bare house
  const tHouse = at("H01", "بيت");
  const tOven = at("H01", "فرن");
  const tNoon = at("H02", "الظهر");
  const tHeat = at("H02", "والحر");
  const tCook = at("H02", "تطبخ");
  const tWalls = at("H03", "الجدران");
  const tNight = at("H03", "بالليل");
  const tStill = at("H04", "واقف");
  const tTower = at("H05", "برج");
  const tBreeze = at("H05", "نسمة");
  const tHot = at("H06", "حار");
  const tCloth = at("H07", "قماش");
  const tEvap = at("H07", "يتبخّر");
  const tNeigh = at("H08", "الجيران");
  const tLook = at("H08", "يشوفونك");
  const tRoshan = at("H09", "شباك");
  const tNoLook = at("H09", "الشوف");
  const tSummer = at("H10", "الصيف");
  const tAC = at("H11", "مكيّف");
  const tEvery = at("H12", "كل");
  const tBill = at("H12", "الفاتورة");
  const tInsul = at("H13", "معزول");
  const tShade = at("H13", "وظل");
  const tVent = at("H13", "وتهوية");

  const house = L ? pop(f, start("H15") + 2, 30, 170, 13) : pop(f, tHouse - 4, 30, 170, 12);
  const night = L ? 0 : interpolate(f, [tNight - 4, tNight + 8, tNight + 40, tNight + 56], [0, 1, 1, 0], clamp);
  const sunBig = L ? 0 : Math.max(interpolate(f, [tNoon - 4, tNoon + 12, start("H03"), start("H03") + 12], [0, 1, 1, 0], clamp), interpolate(f, [tSummer - 4, tSummer + 12, start("H11") + 20, start("H11") + 40], [0, 1, 1, 0], clamp));
  const wallT = L ? 0 : ease(f, tWalls - 2, tWalls + 14);
  const tower = L ? 0 : ease(f, tTower - 4, tTower + 18);
  const breeze = !L && f >= tBreeze - 6 ? ease(f, tBreeze - 6, tBreeze + 10) : 0;
  const hot = L ? 0 : ease(f, tHot - 4, tHot + 6) * (1 - ease(f, tEvap - 2, tEvap + 12));
  const cloth = L ? 0 : ease(f, tCloth - 4, tCloth + 10);
  const neigh = L ? 0 : ease(f, tNeigh - 6, tNeigh + 14);
  const eyes = L ? 0 : ease(f, tLook - 4, tLook + 6) * (1 - ease(f, tNoLook - 2, tNoLook + 8));
  const roshan = L ? 0 : ease(f, tRoshan - 4, tRoshan + 12);
  const ac = L ? 0 : ease(f, tAC - 4, tAC + 12);
  const acN = L ? 0 : ease(f, tEvery - 4, tEvery + 10);
  const insul = L ? 0 : ease(f, tInsul - 4, tInsul + 12);
  const shade = L ? 0 : ease(f, tShade - 4, tShade + 12);
  const vent = L ? 0 : ease(f, tVent - 4, tVent + 12);
  const heatIn = L ? 0 : ease(f, tHeat - 4, tHeat + 8) * (1 - ease(f, tWalls, tWalls + 20));
  const ovenGlow = L ? ease(f, start("H15"), start("H15") + 20) * 0.3 : ease(f, tOven - 4, tOven + 8) * (1 - ease(f, tTower, tTower + 30));
  const stale = L ? 0 : ease(f, tStill - 4, tStill + 6) * (1 - ease(f, tBreeze, tBreeze + 14));
  const bill = !L && f >= tBill - 4 && f < start("H14") ? ease(f, tBill - 4, tBill + 8) * (1 - ease(f, tInsul, tInsul + 14)) : 0;

  const wallStroke = 10 + 26 * wallT;
  const skyTop = interpolate(night, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      {/* sky */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${K.sky1} 0%, ${K.sky2} 72%)` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${K.night1} 0%, ${K.night2} 72%)`, opacity: skyTop }} />
      <AbsoluteFill style={{ background: `rgba(255,120,40,${0.22 * sunBig})` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="ksun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF3B0" />
            <stop offset="70%" stopColor="#FFC23B" />
            <stop offset="100%" stopColor="rgba(255,170,40,0)" />
          </radialGradient>
          <pattern id="lattice" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="26" height="26" fill="#8A5428" />
            <rect x="6" y="6" width="14" height="14" fill="#3B2412" />
          </pattern>
          <pattern id="hatch" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="18" height="18" fill="#F4E6C8" />
            <rect width="6" height="18" fill="#D9C39A" />
          </pattern>
        </defs>

        {/* sun / moon */}
        <g opacity={1 - night} transform={`translate(860 640) scale(${1 + 0.7 * sunBig + 0.03 * Math.sin(f / 6)})`}>
          <circle r={150} fill="url(#ksun)" />
          <circle r={80} fill="#FFE27A" />
        </g>
        <g opacity={night}>
          <circle cx={820} cy={640} r={70} fill="#F4F1DE" />
          <circle cx={850} cy={620} r={64} fill={K.night1} />
          {Array.from({ length: 18 }).map((_, i) => (
            <circle key={i} cx={(i * 197) % 1040 + 20} cy={560 + ((i * 113) % 420)} r={3 + (i % 3)} fill="#fff" opacity={0.8} />
          ))}
        </g>

        {/* dunes + ground */}
        <path d={`M0 1300 C260 1220 420 1330 640 1270 C820 1220 960 1290 1080 1250 L1080 1920 L0 1920 Z`} fill={K.sandDark} />
        <rect x={0} y={GROUND} width={1080} height={460} fill={K.sand} />
        {Array.from({ length: 7 }).map((_, i) => (
          <path key={i} d={`M${(i * 173) % 1000} ${1560 + (i % 3) * 90} q40 -16 80 0`} stroke={K.sandDark} strokeWidth={6} fill="none" opacity={0.7} />
        ))}

        {/* neighbour */}
        {neigh > 0.01 && (
          <g transform={`translate(${1080 + 300 * (1 - neigh)} 0)`}>
            <rect x={-150} y={GROUND - 300} width={260} height={300} fill="#D9A46A" stroke={K.mudDark} strokeWidth={10} />
            <rect x={-120} y={GROUND - 230} width={90} height={90} rx={8} fill="#3B2412" />
            <g opacity={eyes}>
              <ellipse cx={-96} cy={GROUND - 186} rx={14} ry={eyes * 16} fill="#fff" />
              <ellipse cx={-56} cy={GROUND - 186} rx={14} ry={eyes * 16} fill="#fff" />
              <circle cx={-102 + Math.sin(f / 7) * 3} cy={GROUND - 186} r={7} fill={K.ink} />
              <circle cx={-62 + Math.sin(f / 7) * 3} cy={GROUND - 186} r={7} fill={K.ink} />
            </g>
            {f >= tNoLook && !L && (
              <text x={-75} y={GROUND - 260} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={64} fill={K.ink} opacity={ease(f, tNoLook, tNoLook + 8) * (1 - ease(f, start("H10"), start("H10") + 10))}>
                ؟
              </text>
            )}
            <g opacity={acN} transform={`translate(-150 ${GROUND - 200})`}>
              <rect x={-70} y={0} width={70} height={56} rx={8} fill="#EEF2F5" stroke="#9AA7B3" strokeWidth={5} />
              <circle cx={-35} cy={28} r={16} fill="none" stroke="#9AA7B3" strokeWidth={5} />
            </g>
          </g>
        )}

        {/* house */}
        <g transform={`translate(${HX} ${GROUND}) scale(${house}) translate(${-HX} ${-GROUND})`} opacity={Math.min(1, house * 1.5)}>
          {/* tower (wind catcher) */}
          {tower > 0.01 && (
            <g>
              <rect x={HX + 60} y={TOP - 300 * tower} width={150} height={300 * tower + 10} fill={K.mud} stroke={K.mudDark} strokeWidth={10} />
              {tower > 0.85 && (
                <>
                  {[0, 1, 2].map((i) => (
                    <rect key={i} x={HX + 78 + i * 42} y={TOP - 280} width={26} height={90} rx={4} fill="#3B2412" />
                  ))}
                  <rect x={HX + 48} y={TOP - 312} width={174} height={22} fill={K.mudDark} />
                </>
              )}
              {cloth > 0.01 && (
                <g opacity={cloth}>
                  <path d={`M${HX + 74} ${TOP - 286} L${HX + 196} ${TOP - 286} L${HX + 196} ${TOP - 286 + 110 * cloth} Q${HX + 135} ${TOP - 286 + 130 * cloth} ${HX + 74} ${TOP - 286 + 110 * cloth} Z`} fill="#6FB7E8" opacity={0.9} />
                  {[0, 1, 2].map((i) => {
                    const t = ((f + i * 13) % 36) / 36;
                    return <circle key={i} cx={HX + 100 + i * 36} cy={TOP - 160 + t * 60} r={7} fill={K.blue} opacity={1 - t} />;
                  })}
                </g>
              )}
            </g>
          )}
          {/* walls */}
          <rect x={HX - HW / 2} y={TOP} width={HW} height={HH} fill={K.mud} stroke={K.mudDark} strokeWidth={wallStroke} />
          {insul > 0.01 && <rect x={HX - HW / 2 - 18} y={TOP - 18} width={HW + 36} height={HH + 18} fill="none" stroke="url(#hatch)" strokeWidth={22 * insul} />}
          <rect x={HX - HW / 2 - 20} y={TOP - 26} width={HW + 40} height={30} fill={K.mudDark} />
          {/* door + inside glow */}
          <rect x={HX - 60} y={GROUND - 200} width={120} height={200} rx={60} fill="#3B2412" />
          <rect x={HX - 60} y={GROUND - 200} width={120} height={200} rx={60} fill={K.orange} opacity={ovenGlow * 0.8} />
          {/* window + roshan */}
          <rect x={HX - 210} y={TOP + 90} width={110} height={120} rx={10} fill="#3B2412" />
          {roshan > 0.01 && (
            <g transform={`translate(${HX - 155} ${TOP + 150}) scale(${0.5 + 0.5 * roshan}) translate(${-(HX - 155)} ${-(TOP + 150)})`} opacity={roshan}>
              <rect x={HX - 236} y={TOP + 62} width={162} height={176} rx={10} fill="url(#lattice)" stroke={K.wood} strokeWidth={10} />
              <rect x={HX - 246} y={TOP + 46} width={182} height={22} fill={K.wood} />
              <rect x={HX - 246} y={TOP + 232} width={182} height={22} fill={K.wood} />
            </g>
          )}
          {/* shade */}
          {shade > 0.01 && <path d={`M${HX - 250} ${TOP + 70} L${HX - 60} ${TOP + 70} L${HX - 40 - 30 * shade} ${TOP + 70 + 60 * shade} L${HX - 270} ${TOP + 70 + 60 * shade} Z`} fill="#E25A3A" stroke="#A73A22" strokeWidth={6} opacity={shade} />}
          {/* AC unit */}
          {ac > 0.01 && (
            <g opacity={ac} transform={`translate(${HX + 150} ${TOP + 120})`}>
              <rect x={-80} y={-40} width={160} height={100} rx={12} fill="#F2F5F8" stroke="#9AA7B3" strokeWidth={6} />
              <circle cx={-30} cy={10} r={30} fill="none" stroke="#9AA7B3" strokeWidth={6} />
              <g transform={`rotate(${f * 18} -30 10)`}>
                <path d="M-30 10 L-30 -14 M-30 10 L-8 22 M-30 10 L-52 22" stroke="#9AA7B3" strokeWidth={5} />
              </g>
              <rect x={20} y={-10} width={40} height={10} rx={4} fill="#9AA7B3" />
            </g>
          )}
        </g>

        {/* heat waves: oven */}
        {ovenGlow > 0.05 &&
          [0, 1, 2, 3].map((i) => {
            const t = ((f + i * 11) % 44) / 44;
            return <path key={i} d={`M${HX - 150 + i * 100} ${TOP - 40 - t * 140} q18 -20 0 -40 q-18 -20 0 -40`} stroke={K.orange} strokeWidth={9} fill="none" strokeLinecap="round" opacity={ovenGlow * (1 - t)} />;
          })}
        {/* heat arrows into the house */}
        {heatIn > 0.01 &&
          [0, 1, 2].map((i) => {
            const t = ((f + i * 14) % 42) / 42;
            const x0 = 820 - t * 230;
            const y0 = 760 + i * 110 + t * 220;
            return <path key={i} d={`M${x0} ${y0} l-70 30 m70 -30 l-20 -60`} stroke={K.red} strokeWidth={14} fill="none" strokeLinecap="round" opacity={heatIn * (1 - t * 0.6)} transform={`rotate(0)`} />;
          })}
        {/* night: walls release heat outwards */}
        {night > 0.05 &&
          [-1, 1].map((side) =>
            [0, 1].map((k) => {
              const t = ((f + k * 15) % 30) / 30;
              return <path key={`${side}${k}`} d={`M${HX + side * (HW / 2 + 30 + t * 90)} ${TOP + 120 + k * 120} l${side * 50} 0`} stroke={K.orange} strokeWidth={12} strokeLinecap="round" opacity={night * (1 - t)} />;
            }),
          )}
        {/* stale air */}
        {stale > 0.01 &&
          [0, 1, 2].map((i) => <path key={i} d={`M${HX - 40} ${GROUND - 160 + i * 40} q15 -12 30 0 q15 12 30 0`} stroke="#B9B2A6" strokeWidth={8} fill="none" opacity={stale} />)}
        {/* breeze into the tower and down */}
        {breeze > 0.01 &&
          !L &&
          Array.from({ length: 4 }).map((_, i) => {
            const t = ((f + i * 12) % 48) / 48;
            const col = hot > 0.5 ? K.orange : cloth > 0.5 && f >= tEvap ? K.blue : "#FFFFFF";
            const pts = [
              [120, TOP - 260],
              [HX + 70, TOP - 240],
              [HX + 135, TOP - 120],
              [HX + 40, GROUND - 120],
            ];
            const seg = Math.min(2, Math.floor(t * 3));
            const u = t * 3 - seg;
            const x = pts[seg][0] + (pts[seg + 1][0] - pts[seg][0]) * u;
            const y = pts[seg][1] + (pts[seg + 1][1] - pts[seg][1]) * u;
            return <path key={i} d={`M${x - 40} ${y} q20 -14 40 0 q20 14 40 0`} stroke={col} strokeWidth={10} fill="none" strokeLinecap="round" opacity={breeze * (1 - Math.abs(t - 0.5) * 0.8)} />;
          })}
        {/* vent: hot air leaves through the top */}
        {vent > 0.01 &&
          [0, 1].map((i) => {
            const t = ((f + i * 20) % 40) / 40;
            return <path key={i} d={`M${HX + 135} ${TOP - 330 - t * 120} l-20 30 m20 -30 l20 30`} stroke={K.orange} strokeWidth={10} fill="none" strokeLinecap="round" opacity={vent * (1 - t)} />;
          })}
        {/* AC cold air */}
        {ac > 0.01 &&
          [0, 1, 2].map((i) => {
            const t = ((f + i * 10) % 30) / 30;
            return <path key={i} d={`M${HX + 110 - t * 120} ${TOP + 200 + i * 26} l-40 0`} stroke={K.blue} strokeWidth={9} strokeLinecap="round" opacity={ac * (1 - t) * (1 - vent * 0.6)} />;
          })}
        {/* person cooking inside */}
        {f >= tCook - 4 && f < start("H03") + 20 && !L && (
          <g opacity={ease(f, tCook - 4, tCook + 6) * (1 - ease(f, start("H03"), start("H03") + 20))} transform={`translate(${HX} ${GROUND - 90})`}>
            <circle cx={0} cy={-50} r={34} fill="#E8B98E" />
            <rect x={-30} y={-16} width={60} height={90} rx={20} fill="#fff" />
            {[0, 1].map((i) => {
              const t = ((f + i * 14) % 28) / 28;
              return <path key={i} d="M0 -10 C8 4 8 10 0 14 C-8 10 -8 4 0 -10 Z" fill={K.blue} transform={`translate(${-40 + i * 80} ${-70 + t * 40})`} opacity={1 - t} />;
            })}
          </g>
        )}
        {/* the bill */}
        {bill > 0.01 && (
          <g opacity={bill} transform={`translate(780 ${1000 - 20 * Math.sin(f / 8)}) rotate(${-8 + Math.sin(f / 10) * 4}) scale(${pop(f, tBill - 2, 30, 240, 10)})`}>
            <rect x={-130} y={-160} width={260} height={320} rx={16} fill="#fff" stroke="#C9CED4" strokeWidth={6} />
            <text x={0} y={-90} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={46} fill={K.ink}>
              فاتورة
            </text>
            {[0, 1, 2].map((i) => (
              <rect key={i} x={-90} y={-50 + i * 40} width={180 - i * 30} height={14} rx={7} fill="#D7DCE1" />
            ))}
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${-70 + i * 70} 170 q24 -70 0 -110 q60 50 34 110 Z`} fill={i === 1 ? "#FFC23B" : K.orange} transform={`translate(0 ${Math.sin((f + i * 6) / 3) * 6})`} />
            ))}
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

/** Carrier card (scene H11). */
const CarrierCard: React.FC = () => {
  const f = useCurrentFrame();
  const a = start("H11");
  const tIdea = at("H11", "الفكرة");
  const tEng = at("H11", "مهندس");
  const tYear = at("H11", "سنة");
  const tHum = at("H11", "الرطوبة");
  const tPress = at("H11", "مطبعة");
  const tDev = at("H11", "جهاز");
  const tAC = at("H11", "مكيّف");
  if (f < a || f > tAC + 6) return null;
  const vis = ease(f, tEng - 6, tEng + 6) * (1 - ease(f, tAC - 6, tAC + 4));
  const bulb = pop(f, tIdea - 2, 30, 240, 10) * (1 - ease(f, tEng - 6, tEng));
  return (
    <AbsoluteFill>
      {bulb > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", scale: String(bulb) }}>
          <div style={{ width: 220, height: 220, borderRadius: "50%", background: "#FFE27A", boxShadow: "0 0 90px #FFD23F", display: "grid", placeItems: "center", fontSize: 140 }}>💡</div>
        </div>
      )}
      <div dir="rtl" style={{ position: "absolute", left: 110, right: 110, top: 640, padding: "36px 40px 44px", borderRadius: 40, background: "rgba(255,255,255,0.95)", boxShadow: "0 30px 80px rgba(0,0,0,0.3)", fontFamily: SANS, color: K.ink, opacity: vis, scale: String(0.9 + 0.1 * vis) }}>
        <div style={{ fontWeight: 700, fontSize: 76, textAlign: "center" }}>ويليس كارير</div>
        <div style={{ fontWeight: 700, fontSize: 64, textAlign: "center", color: K.red, opacity: ease(f, tYear, tYear + 8) }}>{ar(1902)}</div>
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: 30, fontSize: 40, fontWeight: 600 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: ease(f, tPress - 2, tPress + 8) }}>
            <span style={{ fontSize: 90 }}>🖨️</span>
            مطبعة
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: ease(f, tHum - 2, tHum + 8) }}>
            <span style={{ fontSize: 90 }}>💧</span>
            رطوبة ↓
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: ease(f, tDev - 2, tDev + 8) }}>
            <span style={{ fontSize: 90 }}>⚙️</span>
            جهاز
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Thermometer on the left. */
const Thermo: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0 || (f >= start("H14") && f < start("H15"))) return null;
  const L = f >= start("H15");
  const v = L
    ? 0.72
    : steps(f, [
        [0, 0.55],
        [at("H01", "فرن"), 0.72],
        [at("H02", "والحر"), 0.9],
        [at("H03", "بالليل"), 0.74],
        [at("H04", "واقف"), 0.82],
        [at("H05", "ملقف"), 0.68],
        [at("H06", "حار"), 0.8],
        [at("H07", "تبريد"), 0.55],
        [at("H10", "طوّل"), 0.92],
        [at("H11", "مكيّف"), 0.3],
        [at("H13", "وتهوية"), 0.38],
      ]);
  const col = v > 0.78 ? K.red : v > 0.6 ? K.orange : v > 0.42 ? "#F2C23B" : K.blue;
  return (
    <div style={{ position: "absolute", left: 56, top: 760, width: 90, height: 640 }}>
      <div style={{ position: "absolute", left: 25, top: 0, width: 40, height: 560, borderRadius: 20, background: "rgba(255,255,255,0.85)", border: "4px solid rgba(0,0,0,0.25)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 6, right: 6, bottom: 6, height: `${v * 100}%`, borderRadius: 14, background: col }} />
      </div>
      <div style={{ position: "absolute", left: 5, top: 540, width: 80, height: 80, borderRadius: "50%", background: col, border: "4px solid rgba(0,0,0,0.25)" }} />
    </div>
  );
};

// ------------------------------------------------------------ cover
const Cover: React.FC = () => (
  <AbsoluteFill>
    <CoverScene />
    <BrandPill />
    <div dir="rtl" style={{ position: "absolute", top: 250, left: 40, right: 40, textAlign: "center", fontFamily: SANS, fontWeight: 700 }}>
      <div style={{ fontSize: 140, color: "#fff", WebkitTextStroke: "5px rgba(0,0,0,0.85)", paintOrder: "stroke fill", lineHeight: 1.15 }}>بيت بارد</div>
      <div style={{ display: "inline-block", marginTop: 16, padding: "6px 36px 18px", borderRadius: 24, background: K.red, color: "#fff", fontSize: 76 }}>بدون مكيّف؟</div>
    </div>
  </AbsoluteFill>
);
/** The cover reuses the scene at a moment when the tower, cloth and roshan are all up. */
const CoverScene: React.FC = () => {
  const t = at("H09", "روشان") + 20;
  return <FrameAt frame={t} />;
};
const FrameAt: React.FC<{ frame: number }> = ({ frame }) => {
  // Render the persistent scene as it looks at `frame` by shifting the clock.
  return (
    <AbsoluteFill style={{ scale: "1.2", transformOrigin: "50% 80%" }}>
      <ShiftedClock frame={frame}>
        <Scene />
      </ShiftedClock>
    </AbsoluteFill>
  );
};
const ShiftedClock: React.FC<{ frame: number; children: React.ReactNode }> = ({ frame, children }) => <Freeze frame={frame}>{children}</Freeze>;

// ------------------------------------------------------------ main
export const CoolStory: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  const problems = [at("H02", "المشكلة"), at("H04", "بس"), at("H06", "بس"), at("H08", "وفجأة"), at("H10", "والمصيبة"), at("H12", "بس")];
  const j = problems.map((p) => jolt(f, p)).reduce((a, b) => (b.k > a.k ? b : a), { k: 0, sx: 0, sy: 0 });
  return (
    <AbsoluteFill style={{ background: K.sky1 }}>
      <AbsoluteFill style={{ translate: `${j.sx}px ${j.sy}px` }}>
        <AbsoluteFill style={{ scale: "1.2", transformOrigin: "50% 80%" }}>
          <Scene />
        </AbsoluteFill>
        <Thermo />
      </AbsoluteFill>
      <CarrierCard />
      <RedVignette k={j.k} />
      <NameChip text="هذا ملقف هوا" at={at("H05", "ملقف")} until={start("H06")} top={1600} />
      <NameChip text="تبريد بالتبخير" at={at("H07", "تبريد")} until={start("H08")} top={1600} color="#1F7FC4" />
      <NameChip text="هذا روشان" at={at("H09", "روشان")} until={start("H10")} top={1600} color="#7A4A22" />
      <NameChip text="أول مكيّف حديث" at={at("H11", "مكيّف")} until={start("H12")} top={1600} color="#1F7FC4" />
      <EndCard from={start("H14")} tFollow={at("H14", "تابع")} until={end("H14")} line="بيت بارد بأقل كهرباء" />
      <BrandPill />
      <Captions timeline={cTimeline} top={250} />

      <Voices timeline={cTimeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={cTimeline} src="audio/cool/music/calm.mp3" />
      {problems.map((p, i) => (
        <Sfx key={`g${i}`} name="glitch" at={p - 1} />
      ))}
      <Sfx name="pop" at={at("H01", "بيت") - 4} />
      <Sfx name="whoosh" at={at("H03", "الجدران")} />
      <Sfx name="swish" at={at("H03", "بالليل")} />
      <Sfx name="whoosh" at={at("H05", "برج") - 4} />
      <Sfx name="check" at={at("H05", "ملقف")} />
      <Sfx name="pop" at={at("H07", "قماش")} />
      <Sfx name="check" at={at("H07", "تبريد")} />
      <Sfx name="whoosh" at={at("H08", "الجيران") - 6} />
      <Sfx name="pop" at={at("H09", "شباك")} />
      <Sfx name="check" at={at("H09", "روشان")} />
      <Sfx name="riser" at={start("H11") - 6} />
      <Sfx name="ding" at={at("H11", "الفكرة")} />
      <Sfx name="pop" at={at("H11", "مهندس")} />
      <Sfx name="impact" at={at("H11", "مكيّف")} />
      <Sfx name="thud" at={at("H12", "الفاتورة")} />
      <Sfx name="pop" at={at("H13", "معزول")} />
      <Sfx name="pop" at={at("H13", "وظل")} />
      <Sfx name="sparkle" at={at("H13", "وتهوية")} />
      <Sfx name="riser" at={start("H14") - 10} />
      <Sfx name="pop" at={at("H14", "تابع")} />
      <Sfx name="whoosh" at={start("H15")} />
    </AbsoluteFill>
  );
};

export const CoolStoryThumb: React.FC = () => <Cover />;
