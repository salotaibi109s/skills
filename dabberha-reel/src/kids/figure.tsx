import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Minimal white mannequin drawn with SVG strokes (black-and-white stick-figure style).
 * Angles are absolute in degrees: 0 = pointing down, 90 = pointing forward (the way the figure faces),
 * 180 = up, -90 = backward. "N" = near side (bright), "F" = far side (grey).
 */
export type Pose = {
  lean?: number;
  head?: number;
  aN: [number, number];
  aF: [number, number];
  lN: [number, number];
  lF: [number, number];
};
export type Pt = [number, number];
export type FigProps = { x: number; y: number; s?: number; f?: 1 | -1; pose: Pose; kid?: boolean; rot?: number };

export const FLOOR = 1270;
export const LEN = { thigh: 80, shin: 80, torso: 110, upper: 64, fore: 60, head: 27, neck: 12 };
export const ADULT = 1.62;
export const KID = 1.1;

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const dir = (a: number, f: number): Pt => [f * Math.sin(rad(a)), Math.cos(rad(a))];
const add = (p: Pt, v: Pt, k: number): Pt => [p[0] + v[0] * k, p[1] + v[1] * k];

export const STAND: Pose = { lean: 0, aN: [8, 4], aF: [-6, -2], lN: [3, 0], lF: [-3, 0] };
export const SIT: Pose = { lean: -4, aN: [18, 70], aF: [10, 60], lN: [90, 2], lF: [86, -2] };
export const KNEEL: Pose = { lean: 2, aN: [8, 4], aF: [-6, -2], lN: [92, 0], lF: [2, -88] };

/** Hip height above the floor for a standing figure of scale s. */
export const standY = (s: number) => FLOOR - (LEN.thigh + LEN.shin) * s;
export const kneelY = (s: number) => FLOOR - LEN.thigh * s;

export const joints = (p: FigProps) => {
  const s = p.s ?? 1;
  const f = p.f ?? 1;
  const lean = p.pose.lean ?? 0;
  const up: Pt = [f * Math.sin(rad(lean)), -Math.cos(rad(lean))];
  const hip: Pt = [p.x, p.y];
  const torso = LEN.torso * s;
  const sh = add(hip, up, torso * 0.9);
  const neck = add(hip, up, torso);
  const hr = LEN.head * s * (p.kid ? 1.22 : 1);
  const hl = lean + (p.pose.head ?? 0);
  const hu: Pt = [f * Math.sin(rad(hl)), -Math.cos(rad(hl))];
  const head = add(neck, hu, LEN.neck * s + hr);
  const limb = (o: Pt, a: [number, number], l1: number, l2: number): Pt[] => {
    const e = add(o, dir(a[0], f), l1);
    return [o, e, add(e, dir(a[1], f), l2)];
  };
  return {
    s,
    f,
    hip,
    sh,
    neck,
    head,
    hr,
    aN: limb(sh, p.pose.aN, LEN.upper * s, LEN.fore * s),
    aF: limb(sh, p.pose.aF, LEN.upper * s, LEN.fore * s),
    lN: limb(hip, p.pose.lN, LEN.thigh * s, LEN.shin * s),
    lF: limb(hip, p.pose.lF, LEN.thigh * s, LEN.shin * s),
  };
};

/** Two-bone IK: arm angles that put the hand on target T (bend flips the elbow side). */
export const ik = (S: Pt, T: Pt, l1: number, l2: number, f: number, bend = 1): [number, number] => {
  const dx = T[0] - S[0];
  const dy = T[1] - S[1];
  let d = Math.hypot(dx, dy);
  d = Math.max(Math.abs(l1 - l2) + 0.5, Math.min(d, l1 + l2 - 0.5));
  const base = deg(Math.atan2(f * dx, dy));
  const alpha = deg(Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
  const a1 = base + bend * alpha;
  const E = add(S, dir(a1, f), l1);
  const a2 = deg(Math.atan2(f * (T[0] - E[0]), T[1] - E[1]));
  return [a1, a2];
};

/** Pose with one arm solved to reach target T. */
export const reach = (p: FigProps, arm: "aN" | "aF", T: Pt, bend = 1): Pose => {
  const j = joints(p);
  const s = p.s ?? 1;
  return { ...p.pose, [arm]: ik(j.sh, T, LEN.upper * s, LEN.fore * s, p.f ?? 1, bend) };
};

export const walk = (t: number, amp = 1): Pose => {
  const leg = (ph: number): [number, number] => {
    const th = 24 * Math.sin(ph) * amp;
    return [th, th - 34 * Math.max(0, Math.cos(ph)) * amp];
  };
  return {
    lean: 3,
    aN: [-20 * Math.sin(t) * amp, -20 * Math.sin(t) * amp + 16],
    aF: [20 * Math.sin(t) * amp, 20 * Math.sin(t) * amp + 16],
    lN: leg(t),
    lF: leg(t + Math.PI),
  };
};
export const walkBob = (t: number, s: number) => -Math.abs(Math.cos(t)) * 6 * s;

export const lerpPose = (a: Pose, b: Pose, k: number): Pose => {
  const m = (x: number, y: number) => x + (y - x) * k;
  const mm = (x: [number, number], y: [number, number]): [number, number] => [m(x[0], y[0]), m(x[1], y[1])];
  return { lean: m(a.lean ?? 0, b.lean ?? 0), head: m(a.head ?? 0, b.head ?? 0), aN: mm(a.aN, b.aN), aF: mm(a.aF, b.aF), lN: mm(a.lN, b.lN), lF: mm(a.lF, b.lF) };
};

const NEAR = "#FFFFFF";
const BODY = "#ECECEC";
const FAR = "#858585";

export const Fig: React.FC<FigProps> = (p) => {
  const j = joints(p);
  const s = j.s;
  const line = (pts: Pt[], w: number, c: string) => (
    <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  );
  return (
    <g transform={p.rot ? `rotate(${p.rot} ${p.x} ${p.y})` : undefined}>
      {line(j.lF, 21 * s, FAR)}
      {line(j.aF, 16 * s, FAR)}
      {line([j.sh, j.neck], 12 * s, BODY)}
      {line([j.hip, j.sh], 38 * s, BODY)}
      <circle cx={j.head[0]} cy={j.head[1]} r={j.hr} fill="url(#headGrad)" />
      {line(j.lN, 21 * s, NEAR)}
      {line(j.aN, 16 * s, NEAR)}
    </g>
  );
};

export const HEART = "M0,0.38 C-0.55,0.02 -0.6,-0.42 -0.27,-0.5 C-0.1,-0.54 0,-0.42 0,-0.3 C0,-0.42 0.1,-0.54 0.27,-0.5 C0.6,-0.42 0.55,0.02 0,0.38Z";

/** Stage: spotlight floor line, the scene drawn once with a soft glow and once mirrored as a faint floor reflection. */
export const Stage: React.FC<{ children: React.ReactNode; floor?: boolean; zoom?: [number, number] }> = ({ children, floor = true, zoom = [1, 1.04] }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], zoom);
  return (
    <div style={{ position: "absolute", inset: 0, scale: String(z), transformOrigin: "50% 60%" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="headGrad" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#C9C9C9" />
          </radialGradient>
          <linearGradient id="floorGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity={0} />
            <stop offset="50%" stopColor="#fff" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="reflGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity={1} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <mask id="reflMask" maskUnits="userSpaceOnUse" x={0} y={FLOOR} width={1080} height={300}>
            <rect x={0} y={FLOOR} width={1080} height={220} fill="url(#reflGrad)" />
          </mask>
        </defs>
        {floor && (
          <>
            <ellipse cx={540} cy={FLOOR} rx={470} ry={70} fill="rgba(255,255,255,0.035)" />
            <rect x={40} y={FLOOR - 1} width={1000} height={2.5} fill="url(#floorGrad)" />
            <g mask="url(#reflMask)" opacity={0.13}>
              <g transform={`translate(0 ${2 * FLOOR}) scale(1 -1)`}>{children}</g>
            </g>
          </>
        )}
        <g style={{ filter: "drop-shadow(0 0 14px rgba(255,255,255,0.22))" }}>{children}</g>
      </svg>
    </div>
  );
};

/** Speech bubble (black fill, white outline) that pops from its tail point. */
export const Bubble: React.FC<{ x: number; y: number; w: number; h?: number; k: number; tail?: number; children?: React.ReactNode }> = ({ x, y, w, h = 92, k, tail = 0, children }) => {
  if (k <= 0.001) return null;
  const tx = x + tail;
  return (
    <g transform={`translate(${tx} ${y + h / 2 + 26}) scale(${k}) translate(${-tx} ${-(y + h / 2 + 26)})`} opacity={Math.min(1, k * 1.5)}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill="#000" stroke="#fff" strokeWidth={3.5} />
      <path d={`M${tx - 14} ${y + h / 2 - 2} L${tx} ${y + h / 2 + 26} L${tx + 14} ${y + h / 2 - 2}`} fill="#000" stroke="#fff" strokeWidth={3.5} strokeLinejoin="round" />
      <rect x={tx - 13} y={y + h / 2 - 5} width={26} height={6} fill="#000" />
      {children}
    </g>
  );
};

export const Dots3: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => (
  <>
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={x + (i - 1) * 30} cy={y - Math.max(0, Math.sin(frame / 4 - i * 0.9)) * 8} r={8} fill="#fff" />
    ))}
  </>
);
