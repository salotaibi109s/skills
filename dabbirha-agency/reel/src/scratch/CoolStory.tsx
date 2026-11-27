import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import data from "../data/cool-timeline.json";
import type { TimelineData } from "../lib/timing";
import { Calendar, Cam, Clouds, Dunes, Heat, Man, MudHouse, ShotPlayer, type ShotDef, SkyRect, Sun, Wind, WindTower, World } from "./art";
import { ar, BrandPill, Captions, clamp, ease, EndCard, makeStory, MusicBed, NameChip, pop, SANS, Voices } from "./kit";

/** «بيت بارد بدون مكيّف» — cooling a desert house from scratch, ~30 camera shots. */
export const cTimeline = data as TimelineData;
const { Sfx, SceneVoice, at, start } = makeStory(cTimeline, "audio/cool");
const T = cTimeline.durationInFrames;
const txt = { fontFamily: SANS, fontWeight: 700 } as const;
const K = { red: "#E0313F", orange: "#F2793A", blue: "#3DA9FC", mud: "#C98D52", mudDark: "#9C6634", wood: "#7A4A22" };

// ------------------------------------------------------------ reusable scenes
/** Desert with the house (exterior). */
const Exterior: React.FC<{ f: number; l: number; build?: number; tower?: number; roshan?: number; shade?: number; ac?: number; night?: number; heat?: number }> = ({ f, l, build = 1, tower = 0, roshan = 0, shade = 0, ac = 0, night = 0, heat = 0 }) => (
  <World w={1400} h={2000}>
    <SkyRect w={1400} h={1400} top="#5DB7EE" bottom="#F9E3B4" />
    <rect x={-1000} y={-1000} width={3400} height={2400} fill="#0E1D3D" opacity={night} />
    <Clouds f={l} y={260} w={1400} n={5} o={0.9 * (1 - night)} />
    <g opacity={1 - night}>
      <Sun x={1080} y={560} r={80} f={f} />
    </g>
    <Dunes y={1180} w={1400} />
    <g transform="translate(700 1500)">
      {/* rising walls: drawn as courses of bricks */}
      <clipPath id="buildClip">
        <rect x={-260} y={-320 * build - 40} width={520} height={320 * build + 40} />
      </clipPath>
      <g clipPath="url(#buildClip)">
        <MudHouse x={0} y={0} w={480} h={320} win={false} />
        {Array.from({ length: 8 }).map((_, r) => (
          <line key={r} x1={-240} x2={240} y1={-r * 40} y2={-r * 40} stroke={K.mudDark} strokeWidth={3} opacity={0.5} />
        ))}
      </g>
      {tower > 0 && <WindTower x={120} y={-320} grow={tower} />}
      <rect x={-200} y={-250} width={90} height={100} rx={8} fill="#3B2412" opacity={build > 0.9 ? 1 : 0} />
      {roshan > 0 && (
        <g opacity={roshan} transform={`translate(-155 -200) scale(${0.6 + 0.4 * roshan})`}>
          <rect x={-70} y={-80} width={140} height={160} rx={8} fill="url(#lat)" stroke={K.wood} strokeWidth={10} />
          <rect x={-80} y={-96} width={160} height={20} fill={K.wood} />
          <rect x={-80} y={76} width={160} height={20} fill={K.wood} />
        </g>
      )}
      {shade > 0 && <path d={`M-250 -300 L-60 -300 L${-40 - 20 * shade} ${-300 + 60 * shade} L${-270} ${-300 + 60 * shade} Z`} fill="#E25A3A" stroke="#A73A22" strokeWidth={6} opacity={shade} />}
      {ac > 0 && (
        <g opacity={ac} transform="translate(150 -170)">
          <rect x={-70} y={-40} width={140} height={90} rx={10} fill="#F2F5F8" stroke="#9AA7B3" strokeWidth={5} />
          <circle cx={-25} cy={5} r={26} fill="none" stroke="#9AA7B3" strokeWidth={5} />
        </g>
      )}
      <Heat x={0} y={-360} f={f} w={360} o={heat} />
    </g>
    <defs>
      <pattern id="lat" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="24" height="24" fill="#8A5428" />
        <rect x="6" y="6" width="12" height="12" fill="#3B2412" />
      </pattern>
    </defs>
  </World>
);

/** Cutaway of the room: walls, optional tower with airflow, the man inside. */
const Cutaway: React.FC<{
  f: number;
  wall?: number; // 0..1 thickness
  tower?: boolean;
  air?: "none" | "white" | "red" | "blue";
  cloth?: number;
  glow?: number; // orange heat inside
  cool?: number; // blue cool inside
  pose?: string;
  sweat?: boolean;
  night?: number;
  insul?: number;
  vent?: number;
  hand?: React.ReactNode;
}> = ({ f, wall = 0, tower, air = "none", cloth = 0, glow = 0, cool = 0, pose = "stand", sweat, night = 0, insul = 0, vent = 0, hand }) => {
  const wt = 26 + wall * 60;
  return (
    <World>
      <SkyRect h={1300} top="#5DB7EE" bottom="#F9E3B4" />
      <rect x={-600} y={-600} width={2300} height={2000} fill="#0E1D3D" opacity={night} />
      <Dunes y={1180} />
      {/* room */}
      <rect x={140} y={900} width={800} height={600} fill="#F3E2C4" />
      <rect x={140} y={900} width={800} height={600} fill={K.orange} opacity={glow * 0.35} />
      <rect x={140} y={900} width={800} height={600} fill={K.blue} opacity={cool * 0.25} />
      {/* walls in section */}
      <rect x={140 - wt} y={880} width={wt} height={620} fill={K.mud} stroke={K.mudDark} strokeWidth={5} />
      <rect x={940} y={880} width={wt} height={620} fill={K.mud} stroke={K.mudDark} strokeWidth={5} />
      <rect x={140 - wt} y={860} width={800 + 2 * wt} height={44} fill={K.mudDark} />
      {insul > 0 && (
        <g opacity={insul}>
          <rect x={140 - wt - 26} y={860} width={26} height={640} fill="#F4E6C8" stroke="#D9C39A" strokeWidth={4} />
          <rect x={940 + wt} y={860} width={26} height={640} fill="#F4E6C8" stroke="#D9C39A" strokeWidth={4} />
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d={`M${140 - wt - 26} ${880 + i * 52} l26 26 M${940 + wt} ${880 + i * 52} l26 26`} stroke="#C9A86E" strokeWidth={4} />
          ))}
        </g>
      )}
      {tower && (
        <g>
          <rect x={700} y={520} width={170} height={350} fill={K.mud} stroke={K.mudDark} strokeWidth={6} />
          <rect x={730} y={520} width={110} height={360} fill="#E9D6B3" />
          <rect x={686} y={500} width={198} height={26} fill={K.mudDark} />
          {cloth > 0 && (
            <g opacity={cloth}>
              <path d={`M732 560 L838 560 L838 ${560 + 160 * cloth} Q785 ${580 + 170 * cloth} 732 ${560 + 160 * cloth} Z`} fill="#6FB7E8" />
              {[0, 1, 2].map((i) => {
                const t = ((f + i * 12) % 34) / 34;
                return <circle key={i} cx={752 + i * 32} cy={730 + t * 140} r={7} fill={K.blue} opacity={1 - t} />;
              })}
            </g>
          )}
          {air !== "none" && (
            <Wind
              f={f}
              n={6}
              w={12}
              color={air === "red" ? K.red : air === "blue" ? K.blue : "#FFFFFF"}
              pts={[
                [380, 470],
                [785, 480],
                [785, 900],
                [600, 1240],
                [300, 1380],
              ]}
            />
          )}
        </g>
      )}
      {vent > 0 &&
        [0, 1].map((i) => {
          const t = ((f + i * 20) % 40) / 40;
          return <path key={i} d={`M${785} ${480 - t * 160} l-24 34 m24 -34 l24 34`} stroke={K.orange} strokeWidth={12} fill="none" strokeLinecap="round" opacity={vent * (1 - t)} />;
        })}
      <Heat x={540} y={1300} f={f} w={500} o={glow} />
      <Man x={420} y={1490} s={1} f={f} pose={pose as never} sweat={sweat} hand={hand} />
    </World>
  );
};

const Fan = <g transform="rotate(180)"><rect x={-6} y={-10} width={12} height={70} rx={5} fill="#7A4A22" /><path d="M-60 60 L60 60 L46 150 L-46 150 Z" fill="#C8202E" stroke="#8E1622" strokeWidth={5} /></g>;

const EARTH = 6000;
/** keeps the planet centred as the camera pulls out */
const lerpZ = (z: number) => 1000 - ((1 - z) / 0.94) * 406;

// ------------------------------------------------------------ shots
const shots: ShotDef[] = [
  {
    at: 0,
    name: "build",
    C: ({ l, d }) => {
      const f = l;
      const b = ease(f, at("H01", "بنيت") - 4, at("H01", "صار"));
      return (
        <Cam l={l} d={d} a={[700, 900, 0.72]} b={[760, 1350, 1.2]} w={1400} h={2000}>
          <Exterior f={f} l={l} build={Math.max(0.04, b)} />
          <World w={1400} h={2000}>
            <Man x={1080} y={1520} s={1} f={f} pose="carry" walk={b < 1} hand={<rect x={-50} y={-20} width={100} height={50} fill={K.mud} stroke={K.mudDark} strokeWidth={4} />} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H01", "صار"),
    name: "proud",
    C: ({ l, d }) => {
      const f = at("H01", "صار") + l;
      return (
        <Cam l={l} d={d} a={[500, 1250, 1.3]} b={[800, 1200, 1.0]} w={1400} h={2000} rot={[-2, 1]}>
          <Exterior f={f} l={l} />
          <World w={1400} h={2000}>
            <Man x={1100} y={1540} s={1.05} f={f} pose="point" flip />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H01", "صحيح"),
    name: "oven",
    C: ({ l, d }) => {
      const f = at("H01", "صحيح") + l;
      return (
        <Cam l={l} d={d} a={[540, 1000, 0.95]} b={[480, 1250, 1.35]}>
          <Cutaway f={f} glow={ease(f, at("H01", "فرن") - 6, at("H01", "فرن") + 8)} pose="hot" sweat />
        </Cam>
      );
    },
  },
  {
    at: at("H02", "المشكلة"),
    name: "sun",
    C: ({ l, d }) => {
      const f = at("H02", "المشكلة") + l;
      const z = interpolate(l, [0, d], [1, 1.6], clamp);
      return (
        <AbsoluteFill style={{ background: "linear-gradient(180deg,#2E7FD0,#9FD3F5)" }}>
          <World>
            <g transform={`translate(540 980) scale(${z})`}>
              <Sun x={0} y={0} r={170} f={f * 2} />
            </g>
            {Array.from({ length: 10 }).map((_, i) => {
              const t = ((f + i * 6) % 30) / 30;
              const a = (i / 10) * Math.PI * 2;
              return <line key={i} x1={540 + Math.cos(a) * (300 + t * 300)} y1={980 + Math.sin(a) * (300 + t * 300)} x2={540 + Math.cos(a) * (360 + t * 300)} y2={980 + Math.sin(a) * (360 + t * 300)} stroke="#FFE07A" strokeWidth={14} strokeLinecap="round" opacity={1 - t} />;
            })}
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("H02", "والحر"),
    name: "heat-in",
    C: ({ l, d }) => {
      const f = at("H02", "والحر") + l;
      return (
        <Cam l={l} d={d} a={[900, 1100, 1.5]} b={[620, 1150, 1.0]}>
          <Cutaway f={f} glow={0.6} pose="hot" sweat />
          <World>
            {Array.from({ length: 6 }).map((_, i) => {
              const t = ((f + i * 8) % 40) / 40;
              const y = 960 + i * 80;
              return <path key={i} d={`M${1220 - t * 360} ${y} l-60 0 m0 0 l24 -22 m-24 22 l24 22`} stroke={K.red} strokeWidth={14} fill="none" strokeLinecap="round" opacity={1 - t * 0.4} />;
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H02", "وأنت"),
    name: "cooking",
    C: ({ l, d }) => {
      const f = at("H02", "وأنت") + l;
      const egg = ease(f, at("H02", "تطبخ") - 4, at("H02", "تطبخ") + 10);
      return (
        <Cam l={l} d={d} a={[420, 1080, 1.6]} b={[520, 1250, 1.25]} rot={[2, -2]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#F7C9A0" />
            <rect x={-300} y={1500} width={1700} height={900} fill="#D9A46A" />
            <Heat x={540} y={1400} f={f} w={700} n={6} />
            <g transform={`translate(760 1530) scale(${egg})`}>
              <ellipse rx={110} ry={46} fill="#fff" />
              <circle cx={10} cy={-6} r={36} fill="#FFC23B" />
              {[0, 1, 2].map((i) => {
                const t = ((f + i * 9) % 26) / 26;
                return <circle key={i} cx={-80 + i * 80} cy={-30 - t * 70} r={8} fill="#fff" opacity={1 - t} />;
              })}
            </g>
            <Man x={420} y={1520} s={1.2} f={f} pose="hot" sweat />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H03", "فخلّيت"),
    name: "thick",
    C: ({ l, d }) => {
      const f = at("H03", "فخلّيت") + l;
      const w = ease(f, at("H03", "الجدران"), at("H03", "عريضة") + 14);
      return (
        <Cam l={l} d={d} a={[140, 1050, 1.6]} b={[300, 1150, 1.0]}>
          <Cutaway f={f} wall={w} pose="carry" glow={0.3 * (1 - w)} hand={<rect x={-50} y={-20} width={100} height={50} fill={K.mud} stroke={K.mudDark} strokeWidth={4} />} />
        </Cam>
      );
    },
  },
  {
    at: at("H03", "والطين"),
    name: "soak",
    C: ({ l, d }) => {
      const f = at("H03", "والطين") + l;
      return (
        <Cam l={l} d={d} a={[960, 1100, 1.7]} b={[880, 1100, 1.35]}>
          <Cutaway f={f} wall={1} pose="stand" />
          <World>
            {Array.from({ length: 16 }).map((_, i) => {
              const t = ((f + i * 5) % 50) / 50;
              const y = 920 + (i % 8) * 70;
              return <circle key={i} cx={1180 - t * 200} cy={y} r={12} fill={K.orange} opacity={t < 0.8 ? 1 : (1 - t) * 5} />;
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H03", "ويطلّعه"),
    name: "night",
    C: ({ l, d }) => {
      const f = at("H03", "ويطلّعه") + l;
      return (
        <Cam l={l} d={d} a={[960, 1100, 1.35]} b={[620, 1000, 0.95]}>
          <Cutaway f={f} wall={1} night={1} pose="stand" />
          <World>
            <circle cx={260} cy={420} r={70} fill="#F4F1DE" />
            <circle cx={290} cy={400} r={64} fill="#0E1D3D" />
            {Array.from({ length: 20 }).map((_, i) => (
              <circle key={i} cx={random(`n${i}`) * 1080} cy={150 + random(`m${i}`) * 650} r={3 + (i % 3)} fill="#fff" />
            ))}
            {Array.from({ length: 12 }).map((_, i) => {
              const t = ((f + i * 6) % 40) / 40;
              const y = 920 + (i % 6) * 100;
              return <circle key={i} cx={1010 + t * 220} cy={y} r={11} fill={K.orange} opacity={1 - t} />;
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H04", "بس"),
    name: "stuffy",
    C: ({ l, d }) => {
      const f = at("H04", "بس") + l;
      return (
        <Cam l={l} d={d} a={[420, 1050, 1.55]} b={[540, 1150, 1.1]} rot={[-2, 2]}>
          <Cutaway f={f} wall={1} pose="fan" sweat glow={0.25} hand={Fan} />
          <World>
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${620} ${1080 + i * 60} q24 -16 48 0 q24 16 48 0 q24 -16 48 0`} stroke="#B9B2A6" strokeWidth={9} fill="none" />
            ))}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H05", "فبنيت"),
    name: "tower-up",
    C: ({ l, d }) => {
      const f = at("H05", "فبنيت") + l;
      const tw = ease(f, at("H05", "برج") - 4, at("H05", "فوق") + 6);
      return (
        <Cam l={l} d={d} a={[760, 1250, 1.3]} b={[800, 950, 1.05]} w={1400} h={2000}>
          <Exterior f={f} l={l} tower={tw} />
        </Cam>
      );
    },
  },
  {
    at: at("H05", "أي"),
    name: "breeze",
    C: ({ l, d }) => {
      const f = at("H05", "أي") + l;
      return (
        <Cam l={l} d={d} a={[300, 1000, 0.8]} b={[820, 1000, 1.15]} w={1400} h={2000}>
          <Exterior f={f} l={l} tower={1} />
          <World w={1400} h={2000}>
            <Wind f={f} n={7} w={12} pts={[[-200, 1000], [300, 980], [700, 960], [820, 900]]} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H05", "ينزّلها"),
    name: "downdraft",
    C: ({ l, d }) => {
      const f = at("H05", "ينزّلها") + l;
      return (
        <Cam l={l} d={d} a={[785, 700, 1.4]} b={[560, 1100, 0.95]}>
          <Cutaway f={f} wall={1} tower air="white" pose="stand" />
        </Cam>
      );
    },
  },
  {
    at: at("H06", "بس"),
    name: "hot-air",
    C: ({ l, d }) => {
      const f = at("H06", "بس") + l;
      const hot = ease(f, at("H06", "حار") - 6, at("H06", "حار") + 4);
      return (
        <Cam l={l} d={d} a={[600, 1100, 1.05]} b={[420, 1250, 1.5]}>
          <Cutaway f={f} wall={1} tower air={hot > 0.5 ? "red" : "white"} pose={hot > 0.5 ? "hot" : "stand"} sweat={hot > 0.5} glow={hot * 0.4} />
        </Cam>
      );
    },
  },
  {
    at: at("H07", "فعلّقت"),
    name: "cloth",
    C: ({ l, d }) => {
      const f = at("H07", "فعلّقت") + l;
      const c = ease(f, at("H07", "قماش") - 4, at("H07", "مبلول") + 10);
      return (
        <Cam l={l} d={d} a={[785, 640, 1.9]} b={[785, 760, 1.5]}>
          <Cutaway f={f} wall={1} tower cloth={c} air="red" />
        </Cam>
      );
    },
  },
  {
    at: at("H07", "والموية"),
    name: "evaporate",
    C: ({ l }) => {
      const f = at("H07", "والموية") + l;
      const cool = ease(f, at("H07", "تبخّرت"), at("H07", "معها"));
      return (
        <AbsoluteFill style={{ background: "#E9D6B3" }}>
          <World>
            <rect x={200} y={500} width={680} height={700} rx={30} fill="#6FB7E8" />
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x={200} y={500 + i * 58} width={680} height={4} fill="#4E9AD0" />
            ))}
            {Array.from({ length: 24 }).map((_, i) => {
              const t = ((f + i * 4) % 50) / 50;
              return <circle key={i} cx={240 + random(`ev${i}`) * 600} cy={1150 - t * 900} r={10 + t * 14} fill="#fff" opacity={(1 - t) * 0.8} />;
            })}
            <Wind f={f} n={7} w={16} color={cool > 0.5 ? K.blue : K.red} pts={[[-100, 1400], [300, 1380], [700, 1420], [1200, 1400]]} />
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${1000} ${700 + i * 80} l40 0`} stroke={cool > 0.5 ? K.blue : K.red} strokeWidth={16} strokeLinecap="round" />
            ))}
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("H07", "هذا"),
    name: "cool-room",
    C: ({ l, d }) => {
      const f = at("H07", "هذا") + l;
      return (
        <Cam l={l} d={d} a={[420, 1300, 1.5]} b={[560, 1050, 0.95]}>
          <Cutaway f={f} wall={1} tower cloth={1} air="blue" pose="wave" cool={1} />
        </Cam>
      );
    },
  },
  {
    at: at("H08", "وفجأة"),
    name: "neighbour",
    C: ({ l, d }) => {
      const f = at("H08", "وفجأة") + l;
      const eyes = ease(f, at("H08", "يطالعونك") - 6, at("H08", "يطالعونك") + 4);
      return (
        <Cam l={l} d={d} a={[700, 1250, 0.85]} b={[1180, 1280, 1.7]} w={1400} h={2000}>
          <Exterior f={f} l={l} tower={1} />
          <World w={1400} h={2000}>
            <MudHouse x={1250} y={1500} w={300} h={300} tone={1} win={false} />
            <rect x={1170} y={1320} width={110} height={110} rx={10} fill="#3B2412" />
            <g opacity={eyes}>
              <ellipse cx={1200} cy={1370} rx={18} ry={20 * eyes} fill="#fff" />
              <ellipse cx={1250} cy={1370} rx={18} ry={20 * eyes} fill="#fff" />
              <circle cx={1192 + Math.sin(f / 6) * 4} cy={1372} r={9} fill="#1C120C" />
              <circle cx={1242 + Math.sin(f / 6) * 4} cy={1372} r={9} fill="#1C120C" />
            </g>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H09", "فركّبت"),
    name: "carve",
    C: ({ l, d }) => {
      const f = at("H09", "فركّبت") + l;
      const g = ease(f, at("H09", "شباك") - 6, at("H09", "مخرّم") + 16);
      const n = Math.floor(g * 14);
      return (
        <Cam l={l} d={d} a={[540, 900, 1.35]} b={[540, 1000, 1.05]} rot={[-3, 1]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#C98D52" />
            <rect x={240} y={560} width={600} height={720} rx={20} fill="#8A5428" stroke={K.wood} strokeWidth={18} />
            {Array.from({ length: n }).map((_, i) => (
              <g key={i}>
                <line x1={240 + i * 46} y1={560} x2={240 + i * 46 - 400} y2={960} stroke="#3B2412" strokeWidth={14} />
                <line x1={240 + i * 46} y1={560} x2={240 + i * 46 + 400} y2={960} stroke="#3B2412" strokeWidth={14} />
                <line x1={240 + i * 46} y1={1280} x2={240 + i * 46 - 400} y2={880} stroke="#3B2412" strokeWidth={14} />
                <line x1={240 + i * 46} y1={1280} x2={240 + i * 46 + 400} y2={880} stroke="#3B2412" strokeWidth={14} />
              </g>
            ))}
            <rect x={-300} y={420} width={540} height={1000} fill="#C98D52" />
            <rect x={840} y={420} width={540} height={1000} fill="#C98D52" />
            <rect x={200} y={520} width={680} height={50} fill={K.wood} />
            <rect x={200} y={1270} width={680} height={50} fill={K.wood} />
            <Man x={300} y={1700} s={1.1} f={f} pose="hammer" armSwing={28} hat="shmagh" hand={<rect x={-14} y={-10} width={28} height={110} rx={8} fill="#555E68" />} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H09", "يدخل"),
    name: "light",
    C: ({ l, d }) => {
      const f = at("H09", "يدخل") + l;
      return (
        <Cam l={l} d={d} a={[540, 1200, 1.3]} b={[540, 1000, 1.0]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#5A3A22" />
            <rect x={340} y={420} width={400} height={500} fill="url(#lat2)" stroke={K.wood} strokeWidth={16} />
            <path d="M340 920 L740 920 L1100 1700 L-20 1700 Z" fill="rgba(255,230,150,0.28)" />
            {Array.from({ length: 30 }).map((_, i) => (
              <rect key={i} x={60 + (i % 10) * 96} y={1300 + Math.floor(i / 10) * 120} width={50} height={50} fill="rgba(255,230,150,0.45)" transform={`rotate(45 ${85 + (i % 10) * 96} ${1325 + Math.floor(i / 10) * 120})`} />
            ))}
            <Wind f={f} n={5} w={10} pts={[[540, 700], [540, 1000], [400, 1300], [200, 1500]]} />
            <defs>
              <pattern id="lat2" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="30" height="30" fill="#FFE7A6" />
                <rect x="0" y="0" width="30" height="8" fill="#6B4423" />
                <rect x="0" y="0" width="8" height="30" fill="#6B4423" />
              </pattern>
            </defs>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H09", "وما"),
    name: "blocked",
    C: ({ l, d }) => {
      const f = at("H09", "وما") + l;
      return (
        <Cam l={l} d={d} a={[1180, 1350, 1.8]} b={[860, 1300, 1.05]} w={1400} h={2000}>
          <Exterior f={f} l={l} tower={1} roshan={1} />
          <World w={1400} h={2000}>
            <MudHouse x={1250} y={1500} w={300} h={300} tone={1} win={false} />
            <rect x={1170} y={1320} width={110} height={110} rx={10} fill="#3B2412" />
            <text x={1225} y={1300} textAnchor="middle" {...txt} fontSize={110} fill="#2A1C10" opacity={ease(f, at("H09", "يبان") - 2, at("H09", "يبان") + 8)}>
              ؟
            </text>
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H10", "والمصيبة"),
    name: "summer",
    C: ({ l, d }) => {
      const f = at("H10", "والمصيبة") + l;
      const n = 6 + Math.min(3, Math.floor(l / 8));
      return (
        <Cam l={l} d={d} a={[540, 960, 1.0]} b={[540, 960, 1.3]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#F2793A" />
            <Sun x={540} y={700} r={200} f={f * 3} />
            <Calendar x={540} y={1300} s={1.6} n={n} label="شهر" />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H11", "وهنا"),
    name: "idea",
    C: ({ l }) => {
      const f = at("H11", "وهنا") + l;
      const b = pop(f, at("H11", "الفكرة") - 2, 30, 220, 9);
      return (
        <AbsoluteFill style={{ background: "#1C2333" }}>
          <World>
            <g transform={`translate(540 960) scale(${b})`}>
              <circle r={320} fill="rgba(255,214,90,0.25)" />
              <circle r={190} fill="#FFE07A" />
              <rect x={-80} y={170} width={160} height={110} rx={20} fill="#9AA7B3" />
              {Array.from({ length: 12 }).map((_, i) => (
                <rect key={i} x={-8} y={-360} width={16} height={70} rx={8} fill="#FFE07A" transform={`rotate(${i * 30 + f})`} />
              ))}
            </g>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: at("H11", "مهندس"),
    name: "carrier",
    C: ({ l, d }) => {
      const f = at("H11", "مهندس") + l;
      const year = pop(f, at("H11", "سنة"), 30, 200, 11);
      const press = ease(f, at("H11", "مطبعة") - 6, at("H11", "مطبعة") + 6);
      const hum = ease(f, at("H11", "الرطوبة") - 4, at("H11", "الرطوبة") + 8);
      return (
        <Cam l={l} d={d} a={[360, 1050, 1.35]} b={[620, 1050, 1.0]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#D8CDB8" />
            {Array.from({ length: 7 }).map((_, i) => (
              <rect key={i} x={i * 180 - 60} y={-300} width={14} height={2500} fill="#C7BBA3" />
            ))}
            <rect x={-300} y={1450} width={1700} height={1000} fill="#8C8072" />
            <Man x={300} y={1470} s={1.05} f={f} hat="none" thobe="#2F3640" pose="think" />
            <g transform="translate(300 900)">
              <rect x={-170} y={-50} width={340} height={90} rx={45} fill="#2A1C10" />
              <text x={0} y={18} textAnchor="middle" {...txt} fontSize={52} fill="#fff">
                ويليس كارير
              </text>
            </g>
            <g transform={`translate(540 560) scale(${year})`}>
              <text x={0} y={0} textAnchor="middle" {...txt} fontSize={170} fill="#fff" stroke="#2A1C10" strokeWidth={10} paintOrder="stroke">
                {ar(1902)}
              </text>
            </g>
            <g opacity={press} transform="translate(780 1200)">
              <rect x={-200} y={-160} width={400} height={300} rx={16} fill="#4A5560" />
              <circle cx={-90} cy={-40} r={70} fill="#2E363E" stroke="#9AA7B3" strokeWidth={8} />
              <circle cx={90} cy={-40} r={70} fill="#2E363E" stroke="#9AA7B3" strokeWidth={8} />
              {[0, 1, 2].map((i) => (
                <path key={i} d={`M${-150 + i * 100} 160 q30 ${-30 - hum * 40} 60 0`} fill="#fff" stroke="#C9CED4" strokeWidth={4} transform={`rotate(${hum * (i - 1) * 12})`} />
              ))}
            </g>
            {hum > 0 &&
              Array.from({ length: 8 }).map((_, i) => {
                const t = ((f + i * 6) % 36) / 36;
                return <path key={i} d="M0 -16 C10 0 12 10 0 16 C-12 10 -10 0 0 -16 Z" fill={K.blue} transform={`translate(${620 + (i % 4) * 100} ${900 + t * 120})`} opacity={hum * (1 - t)} />;
              })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H11", "فسوّى"),
    name: "machine",
    C: ({ l, d }) => {
      const f = at("H11", "فسوّى") + l;
      return (
        <Cam l={l} d={d} a={[540, 1100, 1.5]} b={[540, 1000, 1.05]} rot={[2, 0]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#2E363E" />
            <rect x={240} y={700} width={600} height={620} rx={24} fill="#5C6670" stroke="#9AA7B3" strokeWidth={10} />
            {Array.from({ length: 7 }).map((_, i) => (
              <path key={i} d={`M300 ${780 + i * 70} q60 -30 120 0 q60 30 120 0 q60 -30 120 0 q60 30 120 0`} stroke="#B87333" strokeWidth={14} fill="none" />
            ))}
            <g transform={`translate(540 1420) rotate(${f * 14})`}>
              <circle r={90} fill="#3B434B" />
              {[0, 1, 2, 3].map((i) => (
                <ellipse key={i} rx={20} ry={80} fill="#9AA7B3" transform={`rotate(${i * 90})`} />
              ))}
            </g>
            <Wind f={f} n={6} w={14} color={K.red} pts={[[-100, 900], [240, 900]]} />
            <Wind f={f} n={6} w={14} color={K.blue} pts={[[840, 1100], [1200, 1100]]} />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H11", "هذا"),
    name: "ac",
    C: ({ l, d }) => {
      const f = at("H11", "هذا") + l;
      return (
        <Cam l={l} d={d} a={[540, 760, 1.6]} b={[540, 1100, 1.0]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#EAF3F8" />
            <rect x={-300} y={1500} width={1700} height={900} fill="#C9D3D9" />
            <rect x={240} y={640} width={600} height={190} rx={30} fill="#FBFDFF" stroke="#C3CDD5" strokeWidth={8} />
            <rect x={280} y={780} width={520} height={20} rx={10} fill="#C3CDD5" />
            <circle cx={790} cy={690} r={10} fill="#2BB673" />
            {Array.from({ length: 5 }).map((_, i) => {
              const t = ((f + i * 8) % 40) / 40;
              return <path key={i} d={`M${300 + i * 110} ${840 + t * 300} q20 20 0 40`} stroke={K.blue} strokeWidth={12} fill="none" strokeLinecap="round" opacity={1 - t} />;
            })}
            <Man x={540} y={1520} s={1.1} f={f} pose="wave" />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H12", "وصار"),
    name: "city",
    C: ({ l, d }) => {
      const f = at("H12", "وصار") + l;
      const tE = at("H12", "كل");
      return (
        <Cam l={l} d={d} a={[700, 1300, 1.4]} b={[700, 1100, 0.75]} w={1400} h={2000}>
          <World w={1400} h={2000}>
            <SkyRect w={1400} h={1300} />
            <Dunes y={1100} w={1400} />
            {Array.from({ length: 12 }).map((_, i) => {
              const x = 150 + (i % 4) * 360;
              const y = 1300 + Math.floor(i / 4) * 260;
              const p = pop(f, tE - 6 + i * 2, 30, 240, 11);
              return (
                <g key={i}>
                  <MudHouse x={x} y={y} s={0.55} tone={i % 3} />
                  <g transform={`translate(${x + 60} ${y - 120}) scale(${p})`}>
                    <rect x={-40} y={-26} width={80} height={52} rx={6} fill="#F2F5F8" stroke="#9AA7B3" strokeWidth={4} />
                    <circle cx={-12} cy={0} r={14} fill="none" stroke="#9AA7B3" strokeWidth={4} />
                  </g>
                </g>
              );
            })}
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H12", "بس"),
    name: "bill",
    C: ({ l, d }) => {
      const f = at("H12", "بس") + l;
      return (
        <Cam l={l} d={d} a={[600, 900, 1.5]} b={[540, 1100, 1.0]} rot={[4, -2]}>
          <World>
            <rect x={-300} y={-300} width={1700} height={2500} fill="#F3E2C4" />
            <g transform="translate(640 860) rotate(-6)">
              <rect x={-230} y={-300} width={460} height={600} rx={20} fill="#fff" stroke="#C9CED4" strokeWidth={8} />
              <text x={0} y={-190} textAnchor="middle" {...txt} fontSize={80} fill="#2A1C10">
                فاتورة
              </text>
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={-170} y={-120 + i * 60} width={340 - i * 50} height={22} rx={11} fill="#D7DCE1" />
              ))}
              <text x={0} y={200} textAnchor="middle" {...txt} fontSize={90} fill={K.red}>
                ↑↑↑
              </text>
              {Array.from({ length: 5 }).map((_, i) => (
                <path key={i} d={`M${-180 + i * 90} 320 q40 -130 0 -200 q110 90 60 200 Z`} fill={i % 2 ? "#FFC23B" : K.orange} transform={`translate(0 ${Math.sin((f + i * 5) / 3) * 10})`} />
              ))}
            </g>
            <Man x={260} y={1560} s={1.15} f={f} pose="hot" sweat />
          </World>
        </Cam>
      );
    },
  },
  {
    at: at("H13", "فرجعنا"),
    name: "smart",
    C: ({ l, d }) => {
      const f = at("H13", "فرجعنا") + l;
      const ins = ease(f, at("H13", "جدار") - 4, at("H13", "معزول") + 8);
      const vent = ease(f, at("H13", "تهوية") - 4, at("H13", "تهوية") + 10);
      return (
        <Cam l={l} d={d} a={[540, 1100, 0.95]} b={[700, 800, 1.35]}>
          <Cutaway f={f} wall={1} tower insul={ins} vent={vent} air={vent > 0.5 ? "blue" : "none"} cloth={1} cool={0.6} pose="wave" />
        </Cam>
      );
    },
  },
  {
    at: at("H13", "وظل"),
    name: "shade",
    C: ({ l, d }) => {
      const f = at("H13", "وظل") + l;
      const sh = ease(f, at("H13", "وظل"), at("H13", "الشباك") + 10);
      return (
        <Cam l={l} d={d} a={[540, 1300, 1.6]} b={[760, 1150, 1.0]} w={1400} h={2000}>
          <Exterior f={f} l={l} tower={1} roshan={1} shade={sh} />
        </Cam>
      );
    },
  },
  {
    at: at("H13", "تهوية"),
    name: "vent",
    C: ({ l, d }) => {
      const f = at("H13", "تهوية") + l;
      return (
        <Cam l={l} d={d} a={[785, 560, 1.5]} b={[560, 1050, 0.95]}>
          <Cutaway f={f} wall={1} tower insul={1} vent={1} air="blue" cloth={1} cool={0.8} pose="wave" />
        </Cam>
      );
    },
  },
  {
    at: at("H14", "ودبّرتها"),
    name: "pullout",
    C: ({ l, d }) => {
      const t = ease(l, 0, Math.min(d, 80));
      const z = interpolate(t, [0, 1], [1, 0.06]);
      return (
        <AbsoluteFill style={{ background: "#071026" }}>
          <World>
            {Array.from({ length: 40 }).map((_, i) => (
              <circle key={i} cx={random(`st${i}`) * 1080} cy={random(`sy${i}`) * 1920} r={2 + random(`sr${i}`) * 3} fill="#fff" opacity={0.8} />
            ))}
            <g transform={`translate(540 ${lerpZ(z)}) scale(${z}) translate(-540 -1000)`}>
              <circle cx={540} cy={1100 + EARTH} r={EARTH * 1.04} fill="rgba(120,200,255,0.25)" />
              <clipPath id="earthClip">
                <circle cx={540} cy={1100 + EARTH} r={EARTH} />
              </clipPath>
              <circle cx={540} cy={1100 + EARTH} r={EARTH} fill="#2E7FC4" />
              <g clipPath="url(#earthClip)">
                <ellipse cx={540} cy={1100 + EARTH * 0.3} rx={EARTH * 0.55} ry={EARTH * 0.42} fill="#E9C27E" />
                <ellipse cx={540 + EARTH * 0.55} cy={1100 + EARTH * 0.95} rx={EARTH * 0.3} ry={EARTH * 0.2} fill="#6DBE5A" />
                <ellipse cx={540 - EARTH * 0.6} cy={1100 + EARTH * 1.2} rx={EARTH * 0.25} ry={EARTH * 0.3} fill="#E3B877" />
              </g>
              <MudHouse x={540} y={1100} w={480} h={320} />
              <WindTower x={660} y={780} />
              <MudHouse x={60} y={1100} w={320} h={260} tone={1} />
              <MudHouse x={1020} y={1100} w={320} h={260} tone={2} />
            </g>
          </World>
        </AbsoluteFill>
      );
    },
  },
  {
    at: start("H15"),
    name: "loop",
    C: ({ l, d }) => {
      const f = start("H15") + l;
      return (
        <Cam l={l} d={d} a={[700, 900, 0.72]} b={[760, 1250, 1.05]} w={1400} h={2000}>
          <Exterior f={f} l={l} build={Math.max(0.04, ease(f, at("H15", "بنيت") - 4, at("H15", "طين") + 10))} />
          <World w={1400} h={2000}>
            <Man x={1080} y={1520} s={1} f={f} pose="carry" walk hand={<rect x={-50} y={-20} width={100} height={50} fill={K.mud} stroke={K.mudDark} strokeWidth={4} />} />
          </World>
        </Cam>
      );
    },
  },
];

/** Thermometer HUD on the left. */
const Thermo: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0 || f >= at("H14", "ودبّرتها")) return null;
  const ks: [number, number][] = [
    [0, 0.55],
    [at("H01", "فرن"), 0.75],
    [at("H02", "والحر"), 0.92],
    [at("H03", "بالليل"), 0.72],
    [at("H04", "واقف"), 0.82],
    [at("H05", "ملقف"), 0.66],
    [at("H06", "حار"), 0.8],
    [at("H07", "تبريد"), 0.52],
    [at("H10", "طوّل"), 0.95],
    [at("H11", "مكيّف"), 0.28],
    [at("H13", "تهوية"), 0.38],
  ];
  let v = ks[0][1];
  for (let i = 1; i < ks.length; i++) v += (ks[i][1] - ks[i - 1][1]) * ease(f, ks[i][0] - 2, ks[i][0] + 16);
  const col = v > 0.78 ? K.red : v > 0.6 ? K.orange : v > 0.42 ? "#F2C23B" : K.blue;
  return (
    <div style={{ position: "absolute", left: 40, top: 640, width: 80, height: 520 }}>
      <div style={{ position: "absolute", left: 22, top: 0, width: 36, height: 450, borderRadius: 18, background: "rgba(255,255,255,0.9)", border: "4px solid rgba(0,0,0,0.3)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 5, right: 5, bottom: 5, height: `${v * 100}%`, borderRadius: 12, background: col }} />
      </div>
      <div style={{ position: "absolute", left: 4, top: 430, width: 72, height: 72, borderRadius: "50%", background: col, border: "4px solid rgba(0,0,0,0.3)" }} />
    </div>
  );
};

// ------------------------------------------------------------ cover
const Cover: React.FC = () => (
  <AbsoluteFill>
    <Cam l={0} d={1} a={[720, 1250, 1.05]} b={[720, 1250, 1.05]} w={1400} h={2000}>
      <Exterior f={0} l={0} tower={1} roshan={1} heat={0} />
      <World w={1400} h={2000}>
        <Man x={1080} y={1540} s={1} f={0} pose="wave" />
      </World>
    </Cam>
    <BrandPill />
    <div dir="rtl" style={{ position: "absolute", top: 250, left: 40, right: 40, textAlign: "center", ...txt }}>
      <div style={{ fontSize: 150, color: "#fff", WebkitTextStroke: "6px rgba(0,0,0,0.85)", paintOrder: "stroke fill", lineHeight: 1.15 }}>بيت بارد</div>
      <div style={{ display: "inline-block", marginTop: 16, padding: "6px 36px 18px", borderRadius: 24, background: K.red, color: "#fff", fontSize: 76 }}>بدون مكيّف؟</div>
    </div>
  </AbsoluteFill>
);

// ------------------------------------------------------------ main
export const CoolStory: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) return <Cover />;
  const probs = [at("H02", "المشكلة"), at("H04", "بس"), at("H06", "بس"), at("H08", "وفجأة"), at("H10", "والمصيبة"), at("H12", "بس")];
  const shake = probs.reduce((k, p) => Math.max(k, interpolate(f, [p - 1, p + 2, p + 14], [0, 1, 0], clamp)), 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ translate: `${Math.sin(f * 2.7) * 12 * shake}px ${Math.cos(f * 3.1) * 9 * shake}px` }}>
        <ShotPlayer f={f} shots={shots} total={T} />
        <Thermo />
      </AbsoluteFill>
      {shake > 0.02 && <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% 50%, transparent 50%, rgba(220,20,40,${0.5 * shake}) 100%)` }} />}
      <NameChip text="هذا ملقف هوا" at={at("H05", "ملقف")} until={start("H06")} top={1600} />
      <NameChip text="تبريد بالتبخير" at={at("H07", "تبريد")} until={start("H08")} top={1600} color="#1F7FC4" />
      <NameChip text="هذا روشان" at={at("H09", "روشان")} until={start("H10")} top={1600} color="#7A4A22" />
      <NameChip text="أول مكيّف حديث" at={at("H11", "مكيّف")} until={start("H12")} top={1600} color="#1F7FC4" />
      <EndCard from={at("H14", "وإذا") - 6} tFollow={at("H14", "تابع")} until={start("H15")} line="بيت بارد بأقل كهرباء" />
      <BrandPill />
      <Captions timeline={cTimeline} top={250} />

      <Voices timeline={cTimeline} SceneVoice={SceneVoice} />
      <MusicBed timeline={cTimeline} src="audio/cool/music/calm.mp3" />
      {shots.slice(1).map((s, i) => (
        <Sfx key={`w${i}`} name="swish" at={s.at - 2} gain={0.7} />
      ))}
      {probs.map((p, i) => (
        <Sfx key={`g${i}`} name="glitch" at={p - 1} />
      ))}
      <Sfx name="pop" at={at("H01", "بيت") - 4} />
      <Sfx name="check" at={at("H05", "ملقف")} />
      <Sfx name="check" at={at("H07", "تبريد")} />
      <Sfx name="tick" at={at("H09", "شباك")} />
      <Sfx name="check" at={at("H09", "روشان")} />
      <Sfx name="ding" at={at("H11", "الفكرة")} />
      <Sfx name="impact" at={at("H11", "مكيّف")} />
      <Sfx name="thud" at={at("H12", "الفاتورة")} />
      <Sfx name="sparkle" at={at("H13", "تهوية")} />
      <Sfx name="riser" at={at("H14", "ودبّرتها") - 6} />
      <Sfx name="pop" at={at("H14", "تابع")} />
    </AbsoluteFill>
  );
};

export const CoolStoryThumb: React.FC = () => <Cover />;
