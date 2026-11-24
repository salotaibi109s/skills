import { loadFont as loadMessiri } from "@remotion/google-fonts/ElMessiri";
import { loadFont as loadTajawal } from "@remotion/google-fonts/Tajawal";
import { loadFont as loadAmiri } from "@remotion/google-fonts/Amiri";
import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../data/kids-timeline.json";
import { createSound } from "../components/Sound";
import { cue, findScene, type SceneTiming, type TimelineData, type Word } from "../lib/timing";
import { db } from "../theme";
import {
  ADULT,
  Bubble,
  Dots3,
  Fig,
  FLOOR,
  HEART,
  joints,
  KID,
  KNEEL,
  kneelY,
  lerpPose,
  reach,
  SIT,
  STAND,
  Stage,
  standY,
  walk,
  walkBob,
  type FigProps,
  type Pose,
  type Pt,
} from "./figure";

const TITLE = loadMessiri("normal", { weights: ["500", "700"], subsets: ["arabic"] }).fontFamily;
const SANS = loadTajawal("normal", { weights: ["500", "700", "800"], subsets: ["arabic"] }).fontFamily;
const AMIRI = loadAmiri("normal", { weights: ["400"], subsets: ["arabic"] }).fontFamily;

const T = data as TimelineData;
const get = (id: string) => findScene(T, id);
const { Sfx, SceneVoice } = createSound(T, "audio/kids", {
  whoosh: db(-17),
  pop: db(-15),
  tick: db(-15),
  chime: db(-11),
  pencil: db(-12),
  clap: db(-13),
  clink: db(-12),
  heart: db(-11),
});

const GREY = "#9A9A9A";
const AR = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

const useSpring = (at: number, stiffness = 180, damping = 15) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { stiffness, damping, mass: 0.7 } });
};
const ease = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) });

/** Step number, title and subtitle at the top of each step. */
const Header: React.FC<{ n?: number; title: string; sub?: React.ReactNode; dots?: number[] }> = ({ n, title, sub, dots }) => {
  const frame = useCurrentFrame();
  const a = useSpring(2);
  const b = useSpring(9);
  return (
    <div dir="rtl" style={{ position: "absolute", top: 205, left: 90, right: 130, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      {n !== undefined && (
        <div style={{ width: 92, height: 92, borderRadius: 46, border: "3px solid #fff", display: "grid", placeItems: "center", scale: String(a), fontFamily: TITLE, fontWeight: 700, fontSize: 50, color: "#fff", lineHeight: 1, paddingTop: 6 }}>
          {AR(n)}
        </div>
      )}
      <div style={{ marginTop: 22, fontFamily: TITLE, fontWeight: 700, fontSize: 88, lineHeight: 1.25, color: "#fff", opacity: a, translate: `0px ${(1 - a) * 30}px` }}>{title}</div>
      {sub && <div style={{ marginTop: 6, fontFamily: SANS, fontWeight: 500, fontSize: 44, color: GREY, opacity: b, translate: `0px ${(1 - b) * 20}px` }}>{sub}</div>}
      {dots && (
        <div style={{ marginTop: 22, display: "flex", gap: 16 }}>
          {dots.map((at, i) => {
            const on = frame >= at;
            const k = spring({ frame: frame - at, fps: 30, config: { stiffness: 260, damping: 12 } });
            return <div key={i} style={{ width: 22, height: 22, borderRadius: 11, border: "2.5px solid #fff", background: on ? "#fff" : "transparent", scale: String(on ? 0.8 + 0.2 * k : 0.8) }} />;
          })}
        </div>
      )}
    </div>
  );
};

/** Word-by-word captions: the spoken word is white and underlined, the rest of the phrase grey. */
const Captions: React.FC<{ scene: SceneTiming; maxWords?: number }> = ({ scene, maxWords = 4 }) => {
  const frame = useCurrentFrame();
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of scene.words) {
    cur.push(w);
    if (cur.length >= maxWords || /[،,.؟?!…:]$/.test(w.raw ?? w.text)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  let idx = -1;
  chunks.forEach((c, i) => {
    if (frame >= c[0].start - 2) idx = i;
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const lastEnd = scene.words[scene.words.length - 1].end;
  const out = interpolate(frame, [lastEnd + 6, lastEnd + 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div dir="rtl" style={{ position: "absolute", top: 1440, left: 90, right: 130, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.3em", fontFamily: SANS, fontWeight: 800, fontSize: 58, lineHeight: 1.5, opacity: out }}>
      {chunk.map((w, i) => {
        const on = frame >= w.start - 2;
        const active = on && (i === chunk.length - 1 || frame < chunk[i + 1].start - 2);
        const k = spring({ frame: frame - w.start + 2, fps: 30, config: { stiffness: 300, damping: 14 } });
        return (
          <span key={`${idx}-${i}`} style={{ position: "relative", display: "inline-block", color: active ? "#fff" : GREY, opacity: on ? 1 : 0, translate: `0px ${(1 - k) * 18}px` }}>
            {(w.raw ?? w.text).replace(/[«»]/g, "")}
            {active && <span style={{ position: "absolute", left: 0, right: 0, bottom: 6, height: 5, borderRadius: 3, background: "#fff" }} />}
          </span>
        );
      })}
    </div>
  );
};

const Shell: React.FC<{ id: string; children: React.ReactNode; captions?: boolean }> = ({ id, children, captions = true }) => {
  const sc = get(id);
  return (
    <AbsoluteFill>
      {children}
      {captions && <Captions scene={sc} />}
      <SceneVoice scene={sc} />
      <Sfx name="whoosh" at={0} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- scenes

const kidY = standY(KID);
const adultY = standY(ADULT);

const K0: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 5.2;
  const P: FigProps = { x: 430, y: adultY + walkBob(t, ADULT), s: ADULT, f: 1, pose: walk(t, 0.8) };
  const C: FigProps = { x: 640, y: kidY + walkBob(t + 1, KID), s: KID, f: 1, pose: walk(t + 1.1, 1), kid: true };
  const M: Pt = [528, 1040 + Math.sin(t) * 4];
  const p = { ...P, pose: reach(P, "aN", M, -1) };
  const c = { ...C, pose: reach(C, "aF", M, 1) };
  const dash = (frame * 9) % 120;
  return (
    <Shell id="K0-Hook">
      <Stage>
        {Array.from({ length: 11 }).map((_, i) => (
          <rect key={i} x={1080 - ((i * 120 + dash) % 1320)} y={FLOOR + 22} width={46} height={3} fill="#555" />
        ))}
        <Fig {...c} />
        <Fig {...p} />
      </Stage>
      <Header title="لحماية نفسية أطفالك" sub={<span style={{ color: "#fff", fontFamily: TITLE, fontWeight: 700, fontSize: 64 }}>٩ خطوات بسيطة</span>} />
    </Shell>
  );
};

const K1: React.FC = () => {
  const frame = useCurrentFrame();
  const sc = get("K1-Talk");
  const no = cue(sc, "بدون");
  const strike = cue(sc, "نصايح");
  const seatA = FLOOR - 80 * ADULT;
  const seatK = FLOOR - 80 * KID;
  const P: FigProps = { x: 330, y: seatA - 4, s: ADULT, f: 1, pose: SIT };
  const C: FigProps = { x: 760, y: seatK - 4, s: KID, f: -1, pose: SIT, kid: true };
  const talkP = Math.sin(frame / 9) > 0;
  const kA = interpolate(frame, [8, 16], [0, 1], { extrapolateRight: "clamp" }) * (frame < no - 4 ? 1 : 0);
  const kB = useSpring(no - 2, 220, 12);
  const sw = ease(frame, strike + 2, strike + 10);
  const chair = (x: number, seat: number, f: number, s: number) => (
    <g stroke="#bdbdbd" strokeWidth={5} strokeLinecap="round" fill="none">
      <line x1={x - 40 * s * f} y1={seat} x2={x + 52 * s * f} y2={seat} />
      <line x1={x - 36 * s * f} y1={seat} x2={x - 36 * s * f} y2={FLOOR} />
      <line x1={x + 48 * s * f} y1={seat} x2={x + 48 * s * f} y2={FLOOR} />
      <line x1={x - 40 * s * f} y1={seat} x2={x - 46 * s * f} y2={seat - 120 * s} />
    </g>
  );
  return (
    <Shell id="K1-Talk">
      <Stage>
        {chair(330, seatA, 1, ADULT)}
        {chair(760, seatK, -1, KID)}
        <Fig {...P} pose={{ ...SIT, head: talkP ? 4 : 0 }} />
        <Fig {...C} pose={{ ...SIT, head: talkP ? 0 : 5, aN: [30, 110 + Math.sin(frame / 5) * 8] }} />
        <Bubble x={talkP ? 440 : 680} y={talkP ? 700 : 820} w={170} k={kA} tail={talkP ? -40 : 40}>
          <Dots3 x={talkP ? 440 : 680} y={talkP ? 700 : 820} frame={frame} />
        </Bubble>
        <Bubble x={470} y={690} w={330} k={kB} tail={-80}>
          <text x={470} y={706} textAnchor="middle" direction="rtl" fontFamily={SANS} fontWeight={700} fontSize={46} fill="#fff">
            لازم تذاكر!
          </text>
          {sw > 0 && <line x1={330} y1={694} x2={330 + 280 * sw} y2={694} stroke="#fff" strokeWidth={7} strokeLinecap="round" />}
        </Bubble>
      </Stage>
      <Header n={1} title="٢٠ دقيقة سوالف" sub="كأنكم أصحاب… بدون نصايح" />
      <Sfx name="pop" at={no - 2} />
      <Sfx name="pencil" at={strike + 2} />
    </Shell>
  );
};

const K2: React.FC = () => {
  const frame = useCurrentFrame();
  const sc = get("K2-Love");
  const start = cue(sc, "تحبهم");
  const P: FigProps = { x: 410, y: kneelY(ADULT), s: ADULT, f: 1, pose: { ...KNEEL, aN: [60, 110], aF: [50, 100] } };
  const C: FigProps = { x: 700, y: kidY, s: KID, f: -1, pose: { ...STAND, head: Math.sin(frame / 10) * 3 }, kid: true };
  const jp = joints(P);
  const jc = joints(C);
  const N = 10;
  const every = 9;
  const hearts = Array.from({ length: N }).map((_, i) => start + i * every);
  const count = hearts.filter((h) => frame >= h + 14).length;
  return (
    <Shell id="K2-Love">
      <Stage>
        <Fig {...C} />
        <Fig {...P} />
        {hearts.map((h, i) => {
          const k = (frame - h) / 16;
          if (k < 0 || k > 1.25) return null;
          const from: Pt = [jp.head[0] + 50, jp.head[1] + 10];
          const to: Pt = [jc.head[0] - 10, jc.head[1] - 40 - (i % 3) * 30];
          const x = from[0] + (to[0] - from[0]) * Math.min(1, k);
          const y = from[1] + (to[1] - from[1]) * Math.min(1, k) - Math.sin(Math.min(1, k) * Math.PI) * 120;
          const sz = 46 * (k > 1 ? 1 + (k - 1) * 3 : 0.6 + 0.4 * k);
          return <path key={i} d={HEART} transform={`translate(${x} ${y}) scale(${sz})`} fill="#fff" opacity={k > 1 ? 1 - (k - 1) * 4 : 1} />;
        })}
        <g transform={`translate(${jc.head[0]} ${jc.head[1] - 150})`} opacity={count > 0 ? 1 : 0}>
          <text x={0} y={0} textAnchor="middle" direction="rtl" fontFamily={TITLE} fontWeight={700} fontSize={64} fill="#fff">
            {`${AR(Math.max(1, count))} / ١٠`}
          </text>
        </g>
      </Stage>
      <Header n={2} title="قل لهم: أحبك" sub="من ٥ إلى ١٠ مرات يومياً" />
      {hearts.filter((_, i) => i % 3 === 0).map((h, i) => (
        <Sfx key={i} name="heart" at={h + 12} gain={0.7} />
      ))}
    </Shell>
  );
};

const K3: React.FC = () => {
  const frame = useCurrentFrame();
  const sc = get("K3-Praise");
  const clapAt = cue(sc, "امدح");
  const dots = [0, 1, 2, 3, 4].map((i) => cue(sc, "خمس") - 10 + i * 7);
  // Kid puts a ball in the toy box.
  const bend = ease(frame, 4, 18) * (1 - ease(frame, 30, 42));
  const C: FigProps = { x: 720, y: kidY, s: KID, f: 1, pose: lerpPose(STAND, { lean: 38, head: 10, aN: [70, 60], aF: [60, 50], lN: [8, 0], lF: [-6, 0] }, bend), kid: true };
  const jc = joints(C);
  const ballY = frame < 22 ? jc.aN[2][1] : interpolate(frame, [22, 30], [jc.aN[2][1], FLOOR - 50], { extrapolateRight: "clamp" });
  const ballX = frame < 22 ? jc.aN[2][0] + 8 : 852;
  // Parent claps.
  const clap = frame > clapAt ? Math.abs(Math.sin((frame - clapAt) / 2.6)) : 1;
  const P: FigProps = { x: 330, y: adultY, s: ADULT, f: 1, pose: STAND };
  const jp = joints(P);
  const centre: Pt = [jp.sh[0] + 112, jp.sh[1] + 40];
  const near: Pt = [centre[0] + 6 + clap * 16, centre[1] - 4];
  const far: Pt = [centre[0] - 6 - clap * 16, centre[1] + 4];
  const pose: Pose = { ...STAND, ...{ aN: reach(P, "aN", near, -1).aN, aF: reach(P, "aF", far, -1).aF } };
  const kb = useSpring(clapAt + 4, 220, 12);
  return (
    <Shell id="K3-Praise">
      <Stage>
        <g stroke="#bdbdbd" strokeWidth={5} fill="none" strokeLinejoin="round">
          <rect x={800} y={FLOOR - 92} width={120} height={92} />
          <line x1={800} y1={FLOOR - 92} x2={780} y2={FLOOR - 120} />
          <line x1={920} y1={FLOOR - 92} x2={940} y2={FLOOR - 120} />
        </g>
        <circle cx={ballX} cy={ballY} r={14} fill="#fff" opacity={frame < 30 ? 1 : 0} />
        <Fig {...C} />
        <Fig {...P} pose={pose} />
        <Bubble x={470} y={720} w={230} k={kb} tail={-60}>
          <text x={470} y={737} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={50} fill="#fff">
            كفو!
          </text>
        </Bubble>
      </Stage>
      <Header n={3} title="امدح تصرّفه الحلو" sub="٥ مرات يومياً" dots={dots} />
      <Sfx name="clap" at={clapAt} />
      <Sfx name="pop" at={clapAt + 4} />
    </Shell>
  );
};

const K4: React.FC = () => {
  const frame = useCurrentFrame();
  const sc = get("K4-Looks");
  const C: FigProps = { x: 600, y: kidY, s: KID, f: -1, pose: { ...STAND, head: Math.sin(frame / 12) * 2 }, kid: true };
  const P: FigProps = { x: 330, y: kneelY(ADULT), s: ADULT, f: 1, pose: { ...KNEEL, aN: [40, 70] } };
  const jc = joints(C);
  const [hx, hy] = jc.head;
  const r = jc.hr;
  const labels: { w: string; at: number; pt: Pt; lx: number; ly: number }[] = [
    { w: "ابتسامته", at: cue(sc, "ابتسامته"), pt: [hx - r * 0.75, hy + r * 0.45], lx: 860, ly: 1040 },
    { w: "شعره", at: cue(sc, "شعره"), pt: [hx + r * 0.1, hy - r], lx: 860, ly: 780 },
    { w: "عيونه", at: cue(sc, "عيونه"), pt: [hx - r * 0.8, hy - r * 0.2], lx: 860, ly: 910 },
  ];
  return (
    <Shell id="K4-Looks">
      <Stage>
        <Fig {...P} />
        <Fig {...C} />
        {labels.map((l, i) => {
          const k = ease(frame, l.at - 4, l.at + 6);
          if (k <= 0) return null;
          const ex = l.lx - 100;
          return (
            <g key={i}>
              <circle cx={l.pt[0]} cy={l.pt[1]} r={8} fill="#fff" opacity={k} />
              <polyline points={`${l.pt[0]},${l.pt[1]} ${l.pt[0] + (ex - l.pt[0]) * k},${l.pt[1] + (l.ly - l.pt[1]) * k}`} stroke="#fff" strokeWidth={3} fill="none" />
              <text x={l.lx + 10} y={l.ly + 14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={44} fill="#fff" opacity={k}>
                {l.w}
              </text>
            </g>
          );
        })}
      </Stage>
      <Header n={4} title="امدح شكله" sub="ابتسامته · شعره · عيونه" dots={[0, 1, 2, 3, 4].map((i) => 18 + i * 6)} />
      {labels.map((l, i) => (
        <Sfx key={i} name="pop" at={l.at - 2} />
      ))}
    </Shell>
  );
};

const Tuft: React.FC<{ x: number }> = ({ x }) => (
  <path d={`M${x - 14} ${FLOOR} q4 -26 8 -30 M${x} ${FLOOR} q0 -34 2 -40 M${x + 14} ${FLOOR} q-4 -24 -8 -28`} stroke="#8a8a8a" strokeWidth={4} fill="none" strokeLinecap="round" />
);

const K5: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 5.2;
  const P: FigProps = { x: 420, y: adultY + walkBob(t, ADULT), s: ADULT, f: 1, pose: walk(t, 0.8) };
  const C: FigProps = { x: 630, y: kidY + walkBob(t + 1, KID), s: KID, f: 1, pose: walk(t + 1.1, 1), kid: true };
  const M: Pt = [518, 1040 + Math.sin(t) * 4];
  const p = { ...P, pose: reach(P, "aN", M, -1) };
  const c = { ...C, pose: reach(C, "aF", M, 1) };
  const off = frame * 5;
  const week = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
  return (
    <Shell id="K5-Out">
      <Stage>
        <polyline points={Array.from({ length: 60 }).map((_, i) => { const x = -40 + i * 20; return `${x},${FLOOR - 150 + 38 * Math.sin((x + off * 0.25) / 150) + 18 * Math.sin((x + off * 0.25) / 61)}`; }).join(" ")} stroke="#333" strokeWidth={4} fill="none" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Tuft key={i} x={1180 - ((i * 170 + off * 1.4) % 1360)} />
        ))}
        <circle cx={900} cy={720} r={40} fill="none" stroke="#fff" strokeWidth={4} />
        <Fig {...c} />
        <Fig {...p} />
      </Stage>
      <Header
        n={5}
        title="اطلعوا سوا"
        sub={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <span>مرتين بالأسبوع · ولو ٥ دقايق</span>
            <span style={{ display: "flex", gap: 10 }}>
              {week.map((d, i) => {
                const on = (i === 1 && frame > 20) || (i === 4 && frame > 32);
                return (
                  <span key={d} style={{ width: 50, height: 50, borderRadius: 12, border: "2.5px solid #fff", background: on ? "#fff" : "transparent", color: on ? "#000" : "#fff", display: "grid", placeItems: "center", fontSize: 26, fontWeight: 700 }}>
                    {d}
                  </span>
                );
              })}
            </span>
          </div>
        }
      />
      <Sfx name="tick" at={20} />
      <Sfx name="tick" at={32} />
    </Shell>
  );
};

const K6: React.FC = () => {
  const frame = useCurrentFrame();
  const sc = get("K6-Night");
  const say = cue(sc, "فرحت");
  const bedTop = FLOOR - 120;
  const C: FigProps = { x: 690, y: bedTop - 20, s: KID, f: -1, pose: { lean: 0, aN: [10, 40], aF: [6, 30], lN: [0, 0], lF: [2, 0] }, kid: true, rot: 90 };
  const P: FigProps = { x: 420, y: bedTop - 4, s: ADULT, f: 1, pose: SIT };
  const jp = joints(P);
  const pat = Math.sin(frame / 7) * 6;
  const pose = reach(P, "aN", [jp.sh[0] + 150, bedTop - 40 + pat], 1);
  const kb = useSpring(say - 2, 220, 12);
  const glow = 0.5 + 0.5 * Math.sin(frame / 12);
  return (
    <Shell id="K6-Night">
      <Stage>
        <g stroke="#bdbdbd" strokeWidth={5} fill="none" strokeLinejoin="round">
          <rect x={430} y={bedTop} width={520} height={60} />
          <line x1={440} y1={bedTop + 60} x2={440} y2={FLOOR} />
          <line x1={940} y1={bedTop + 60} x2={940} y2={FLOOR} />
          <line x1={950} y1={FLOOR} x2={950} y2={bedTop - 120} />
          <line x1={950} y1={bedTop - 120} x2={890} y2={bedTop - 120} />
          <rect x={110} y={560} width={210} height={250} />
          <line x1={215} y1={560} x2={215} y2={810} />
        </g>
        <path d="M262 615 a38 38 0 1 0 22 62 a30 30 0 1 1 -22 -62Z" fill="#fff" opacity={0.85 + 0.15 * glow} />
        <ellipse cx={880} cy={bedTop - 14} rx={52} ry={22} fill="#0b0b0b" stroke="#bdbdbd" strokeWidth={4} />
        <Fig {...C} />
        <rect x={560} y={bedTop - 62} width={290} height={64} rx={18} fill="#0b0b0b" stroke="#fff" strokeWidth={4} />
        <Fig {...P} pose={pose} />
        <Bubble x={560} y={720} w={520} h={100} k={kb} tail={-110}>
          <text x={560} y={738} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={44} fill="#fff">
            فرحت باللي سويته اليوم
          </text>
        </Bubble>
      </Stage>
      <Header n={6} title="قيم قبل النوم" sub="٣ دقايق يومياً" />
      <Sfx name="chime" at={say - 2} gain={0.8} />
    </Shell>
  );
};

const K7: React.FC = () => {
  const frame = useCurrentFrame();
  const top = FLOOR - 205;
  const seatA = FLOOR - 80 * ADULT;
  const seatK = FLOOR - 80 * KID - 30;
  const L: FigProps = { x: 230, y: seatA - 4, s: ADULT, f: 1, pose: SIT };
  const R: FigProps = { x: 860, y: seatK - 4, s: KID, f: -1, pose: SIT, kid: true };
  const B: FigProps = { x: 560, y: top + 40, s: ADULT * 0.92, f: -1, pose: { ...SIT, lean: 2 } };
  const jl = joints(L);
  const jr = joints(R);
  const eatL = reach(L, "aN", [jl.sh[0] + 140, top - 26 + Math.max(0, Math.sin(frame / 8)) * -20], 1);
  const eatR = reach(R, "aN", [jr.sh[0] - 100, top - 20], 1);
  const turn = Math.floor(frame / 26) % 3;
  const bubbleK = interpolate((frame % 26) / 26, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const bx = [330, 760, 560][turn];
  const by = [780, 860, 730][turn];
  return (
    <Shell id="K7-Dinner">
      <Stage>
        <Fig {...B} />
        <g stroke="#bdbdbd" strokeWidth={5} fill="#000" strokeLinejoin="round">
          <rect x={330} y={top} width={430} height={14} />
          <path d={`M345 ${top + 14} L345 ${top + 120} Q545 ${top + 140} 745 ${top + 120} L745 ${top + 14}`} />
          <line x1={370} y1={top + 125} x2={370} y2={FLOOR} />
          <line x1={720} y1={top + 125} x2={720} y2={FLOOR} />
        </g>
        {[420, 545, 670].map((x) => (
          <ellipse key={x} cx={x} cy={top - 6} rx={46} ry={9} fill="#000" stroke="#fff" strokeWidth={4} />
        ))}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${530 + i * 15} ${top - 20} q-10 -20 0 -40 q10 -20 0 -40`} stroke="#777" strokeWidth={3} fill="none" opacity={0.4 + 0.4 * Math.sin(frame / 8 + i)} />
        ))}
        <Fig {...L} pose={eatL} />
        <Fig {...R} pose={eatR} />
        <Bubble x={bx} y={by} w={150} h={80} k={bubbleK} tail={turn === 1 ? 30 : -30}>
          <Dots3 x={bx} y={by} frame={frame} />
        </Bubble>
      </Stage>
      <Header n={7} title="عشا العايلة" sub="مرتين بالأسبوع · سوالف بلا عجلة" />
      <Sfx name="clink" at={14} />
      <Sfx name="clink" at={52} gain={0.7} />
    </Shell>
  );
};

const K8: React.FC = () => {
  const frame = useCurrentFrame();
  const sc = get("K8-Listen");
  const a1 = cue(sc, "تناقش");
  const a2 = cue(sc, "تقاطع");
  const seatA = FLOOR - 80 * ADULT;
  const seatK = FLOOR - 80 * KID;
  const P: FigProps = { x: 330, y: seatA - 4, s: ADULT, f: 1, pose: { ...SIT, head: 10, lean: 4, aN: [40, 80] } };
  const C: FigProps = { x: 760, y: seatK - 4, s: KID, f: -1, pose: { ...SIT, aN: [40 + Math.sin(frame / 4) * 20, 120 + Math.sin(frame / 3) * 20], head: Math.sin(frame / 6) * 4 }, kid: true };
  const jc = joints(C);
  const b1 = useSpring(a1 - 3, 220, 12) * (1 - ease(frame, a2 - 6, a2 - 2));
  const b2 = useSpring(a2 - 3, 220, 12);
  const s1 = ease(frame, a1 + 3, a1 + 10);
  const s2 = ease(frame, a2 + 3, a2 + 10);
  const bench = (x1: number, x2: number, seat: number) => (
    <g stroke="#bdbdbd" strokeWidth={5} fill="none" strokeLinecap="round">
      <line x1={x1} y1={seat} x2={x2} y2={seat} />
      <line x1={x1 + 20} y1={seat} x2={x1 + 20} y2={FLOOR} />
      <line x1={x2 - 20} y1={seat} x2={x2 - 20} y2={FLOOR} />
    </g>
  );
  return (
    <Shell id="K8-Listen">
      <Stage>
        {bench(230, 430, seatA)}
        {bench(690, 850, seatK)}
        <Fig {...P} />
        <Fig {...C} />
        {[0, 1, 2].map((i) => {
          const ph = ((frame / 14 + i / 3) % 1);
          const r = 40 + ph * 90;
          return <path key={i} d={`M${jc.head[0] - r * 0.6} ${jc.head[1] - r * 0.8} A${r} ${r} 0 0 0 ${jc.head[0] - r * 0.6} ${jc.head[1] + r * 0.8}`} stroke="#fff" strokeWidth={4} fill="none" opacity={(1 - ph) * 0.8} />;
        })}
        {[{ k: b1, s: s1, w: "بس…" }, { k: b2, s: s2, w: "اسمع…" }].map((b, i) => (
          <Bubble key={i} x={450} y={700} w={240} k={b.k} tail={-50}>
            <text x={450} y={716} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={46} fill="#fff">
              {b.w}
            </text>
            {b.s > 0 && <line x1={350} y1={702} x2={350 + 200 * b.s} y2={702} stroke="#fff" strokeWidth={7} strokeLinecap="round" />}
          </Bubble>
        ))}
      </Stage>
      <Header n={8} title="كلّي آذان صاغية" sub="١–٣ دقايق يومياً · بدون مقاطعة" />
      <Sfx name="pencil" at={a1 + 3} />
      <Sfx name="pencil" at={a2 + 3} />
    </Shell>
  );
};

const K9: React.FC = () => {
  const frame = useCurrentFrame();
  const sc = get("K9-Touch");
  const steps = [
    { w: "راسه", m: "فخر", at: cue(sc, "راسه") },
    { w: "جبينه", m: "تهدئة", at: cue(sc, "جبينه") },
    { w: "خدوده", m: "شوق", at: cue(sc, "خدوده") },
    { w: "يده", m: "حب", at: cue(sc, "يده") },
    { w: "صدره", m: "إذا زعل", at: cue(sc, "امسح") },
  ];
  let i = -1;
  steps.forEach((s, k) => {
    if (frame >= s.at - 8) i = k;
  });
  const sad = ease(frame, cue(sc, "زعل") - 6, cue(sc, "زعل") + 4);
  const C: FigProps = { x: 640, y: kidY, s: KID, f: -1, pose: { ...STAND, head: -14 * sad }, kid: true };
  const jc = joints(C);
  const [hx, hy] = jc.head;
  const r = jc.hr;
  const hold: Pt = [560, 1085];
  const targets: Pt[] = [
    [hx + 4, hy - r - 6],
    [hx - r - 4, hy - r * 0.25],
    [hx - r * 0.9, hy + r * 0.35],
    hold,
    [jc.sh[0] - 22, jc.sh[1] + 34],
  ];
  const P: FigProps = { x: 400, y: adultY, s: ADULT, f: 1, pose: { ...STAND, lean: 6, head: 12 } };
  const rest: Pt = [joints(P).sh[0] + 30, joints(P).sh[1] + 170];
  const prev = i <= 0 ? rest : targets[i - 1];
  const cur = i < 0 ? rest : targets[i];
  const k = i < 0 ? 0 : ease(frame, steps[i].at - 8, steps[i].at + 2);
  const T: Pt = [prev[0] + (cur[0] - prev[0]) * k, prev[1] + (cur[1] - prev[1]) * k - Math.sin(k * Math.PI) * 30];
  const pose = reach(P, "aN", T, -1);
  const kidPose: Pose = i === 3 && k > 0.5 ? reach(C, "aN", hold, 1) : C.pose;
  const lab = i >= 0 ? steps[i] : null;
  const lk = i >= 0 ? ease(frame, steps[i].at - 4, steps[i].at + 4) : 0;
  const pulse = i >= 0 ? 1 - ease(frame, steps[i].at, steps[i].at + 14) : 0;
  return (
    <Shell id="K9-Touch">
      <Stage>
        <Fig {...C} pose={kidPose} />
        <Fig {...P} pose={pose} />
        {i >= 0 && <circle cx={cur[0]} cy={cur[1]} r={20 + (1 - pulse) * 50} fill="none" stroke="#fff" strokeWidth={3} opacity={pulse * 0.9} />}
      </Stage>
      <Header n={9} title="خمس لمسات يومية" dots={steps.map((s) => s.at)} />
      {lab && (
        <div dir="rtl" style={{ position: "absolute", top: 560, left: 90, right: 130, textAlign: "center", opacity: lk, translate: `0px ${(1 - lk) * 16}px` }}>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, color: GREY }}>{i === 3 ? "مسكة " : i === 4 ? "على " : "على "}{lab.w}</span>
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, color: GREY }}> ← </span>
          <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 60, color: "#fff" }}>{lab.m}</span>
        </div>
      )}
      {steps.map((s, k2) => (
        <Sfx key={k2} name="pop" at={s.at} gain={0.8} />
      ))}
    </Shell>
  );
};

const K10: React.FC = () => {
  const frame = useCurrentFrame();
  const sc = get("K10-Prophet");
  const lines = [
    { at: 0, node: <>وكان النبي <span style={{ fontFamily: AMIRI }}>ﷺ</span></>, size: 84, c: "#fff" },
    { at: cue(sc, "يقبل"), node: <>يقبّل فاطمة</>, size: 96, c: "#fff" },
    { at: cue(sc, "ويحضنها"), node: <>ويحضنها</>, size: 96, c: "#fff" },
    { at: cue(sc, "قدام"), node: <>قدّام الصحابة</>, size: 70, c: GREY },
  ];
  const glow = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });
  return (
    <Shell id="K10-Prophet" captions={false}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 40% at 50% 48%, rgba(255,255,255,${0.09 * glow}) 0%, rgba(0,0,0,0) 70%)` }} />
      <div dir="rtl" style={{ position: "absolute", top: 560, left: 90, right: 130, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {lines.map((l, i) => {
          const k = spring({ frame: frame - l.at + 2, fps: 30, config: { stiffness: 120, damping: 18 } });
          return (
            <div key={i} style={{ fontFamily: TITLE, fontWeight: 700, fontSize: l.size, color: l.c, lineHeight: 1.3, opacity: k, translate: `0px ${(1 - k) * 30}px`, filter: `blur(${(1 - k) * 8}px)` }}>
              {l.node}
            </div>
          );
        })}
      </div>
      <Sfx name="chime" at={cue(sc, "يقبل")} gain={0.7} />
    </Shell>
  );
};

const K11: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const hug = ease(frame, 2, 24);
  const P0: FigProps = { x: 450, y: kneelY(ADULT), s: ADULT, f: 1, pose: { ...KNEEL, lean: 6 * hug, head: 10 * hug } };
  const C0: FigProps = { x: 640 - 30 * hug, y: kidY, s: KID, f: -1, pose: { ...STAND, lean: 4 * hug, head: 8 * hug }, kid: true };
  const jp = joints(P0);
  const jc = joints(C0);
  const mix = (a: Pt, b: Pt): Pt => [a[0] + (b[0] - a[0]) * hug, a[1] + (b[1] - a[1]) * hug];
  const pRest: Pt = [jp.sh[0] + 20, jp.sh[1] + 150];
  const cRest: Pt = [jc.sh[0] - 6, jc.sh[1] + 110];
  const P = { ...P0, pose: { ...reach(P0, "aN", mix(pRest, [jc.sh[0] + 26, jc.sh[1] + 40]), -1), aF: reach(P0, "aF", mix(pRest, [jc.sh[0] + 20, jc.sh[1] + 70]), -1).aF } };
  const C = { ...C0, pose: { ...reach(C0, "aN", mix(cRest, [jp.neck[0] - 26, jp.neck[1] + 6]), -1), aF: reach(C0, "aF", mix(cRest, [jp.neck[0] - 20, jp.neck[1] + 20]), -1).aF } };
  const out = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const k = useSpring(6, 140, 18);
  const c = useSpring(26, 140, 18);
  return (
    <Shell id="K11-End" captions={false}>
      <AbsoluteFill style={{ opacity: out }}>
        <Stage zoom={[1.02, 1]}>
          <Fig {...C} />
          <Fig {...P} />
          <path d={HEART} transform={`translate(545 ${720 - hug * 20}) scale(${70 * hug})`} fill="#fff" opacity={hug} />
        </Stage>
        <div dir="rtl" style={{ position: "absolute", top: 260, left: 90, right: 130, textAlign: "center", fontFamily: TITLE, fontWeight: 700, fontSize: 84, color: "#fff", lineHeight: 1.3, opacity: k, translate: `0px ${(1 - k) * 30}px` }}>
          شاركها مع أحد يحتاجها
        </div>
        <div dir="rtl" style={{ position: "absolute", top: 1440, left: 90, right: 130, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 36, color: GREY, opacity: c }}>
          المحتوى: وليد الزهراني
        </div>
      </AbsoluteFill>
      <Sfx name="heart" at={14} />
    </Shell>
  );
};

const SCENES: { id: string; C: React.FC }[] = [
  { id: "K0-Hook", C: K0 },
  { id: "K1-Talk", C: K1 },
  { id: "K2-Love", C: K2 },
  { id: "K3-Praise", C: K3 },
  { id: "K4-Looks", C: K4 },
  { id: "K5-Out", C: K5 },
  { id: "K6-Night", C: K6 },
  { id: "K7-Dinner", C: K7 },
  { id: "K8-Listen", C: K8 },
  { id: "K9-Touch", C: K9 },
  { id: "K10-Prophet", C: K10 },
  { id: "K11-End", C: K11 },
];

/** 60 s black-and-white stick-figure explainer: nine daily habits that protect a child's mental health (Nasser VO). */
export const Kids: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(90% 60% at 50% 55%, #161616 0%, #000 75%)" }}>
    <TransitionSeries>
      {SCENES.flatMap(({ id, C }) => {
        const s = get(id);
        const items = [
          <TransitionSeries.Sequence key={id} name={id} durationInFrames={s.durationInFrames}>
            <C />
          </TransitionSeries.Sequence>,
        ];
        if (s.transitionFrames) items.push(<TransitionSeries.Transition key={`${id}-t`} presentation={fade()} timing={linearTiming({ durationInFrames: s.transitionFrames })} />);
        return items;
      })}
    </TransitionSeries>
    <Audio
      src={staticFile("audio/kids/music/piano.mp3")}
      volume={(f) => {
        const end = T.durationInFrames;
        const inVoice = T.voiceWindows.some(([a, b]) => f >= a - 4 && f <= b + 6);
        const fd = interpolate(f, [0, 6, end - 40, end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (inVoice ? db(-21) : db(-15)) * fd;
      }}
    />
  </AbsoluteFill>
);
