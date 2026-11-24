import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {useTheme} from '../ThemeContext';

// أيقونات خطية بسيطة على شبكة 24×24. كل عنصر يُرسم تدريجياً (pathLength=1).
// لإضافة أيقونة: أضفها هنا وفي ICONS داخل episode-schema.mjs.
type Shape =
  | {k: 'path'; d: string}
  | {k: 'circle'; cx: number; cy: number; r: number}
  | {k: 'rect'; x: number; y: number; w: number; h: number; rx?: number};

const p = (d: string): Shape => ({k: 'path', d});
const c = (cx: number, cy: number, r: number): Shape => ({k: 'circle', cx, cy, r});
const r = (x: number, y: number, w: number, h: number, rx = 1.5): Shape => ({k: 'rect', x, y, w, h, rx});

export const ICON_SHAPES: Record<string, Shape[]> = {
  oven: [r(3, 3, 18, 18, 2), p('M3 8h18'), r(6, 11, 12, 7, 1), c(7, 5.5, 0.6), c(10, 5.5, 0.6), p('M14 5.5h4')],
  lemon: [p('M5 15c-1.5-4 1-9 6-10.5S20 6 19.5 11 14 19.5 9.5 19 5.8 17 5 15z'), p('M5 15l-2 1.5'), p('M19.5 11l2-1.2'), p('M9 9.5c1.5-1 3.5-1.2 5-.5')],
  drop: [p('M12 3c3 4.2 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-6.8 6-11z'), p('M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5')],
  spray: [r(7, 9, 8, 12, 2), p('M9 9V6h4v3'), p('M13 6.5h3.5L18 5'), p('M19 8.5h2'), p('M18.5 11l1.5 1'), p('M18.5 6l1.5-1')],
  sparkle: [p('M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z'), p('M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z')],
  clock: [c(12, 12, 9), p('M12 7v5l3.5 2')],
  check: [c(12, 12, 9), p('M8 12.5l2.8 2.8L16.5 9.5')],
  bulb: [p('M9 17h6'), p('M10 20.5h4'), p('M8.5 14.5C6.8 13.3 6 11.6 6 9.8a6 6 0 0 1 12 0c0 1.8-.8 3.5-2.5 4.7V17h-7z')],
  alert: [p('M12 3.5L21.5 20h-19z'), p('M12 10v4.5'), c(12, 17.3, 0.6)],
  bookmark: [p('M6.5 3.5h11v17L12 16.5 6.5 20.5z')],
  shirt: [p('M8.5 3.5L3 6.5l2 4.2 2.2-1V20.5h9.6V9.7l2.2 1 2-4.2-5.5-3c-.6 1.6-1.9 2.5-3.5 2.5s-2.9-.9-3.5-2.5z')],
  brush: [p('M14 3.5l6.5 6.5'), p('M17.2 6.8L11 13'), p('M11 13c-2.5-1-5 .2-5.8 2.8L3.5 20.5l4.7-1.7c2.6-.8 3.8-3.3 2.8-5.8z')],
  fridge: [r(5.5, 2.5, 13, 19, 2), p('M5.5 10h13'), p('M8.5 5.5v2'), p('M8.5 12.5v3')],
  coin: [c(12, 12, 9), p('M14.8 9.2c-.6-.9-1.6-1.4-2.8-1.4-1.6 0-2.8.9-2.8 2.1s1.2 1.8 2.8 2.1 2.8.9 2.8 2.1-1.2 2.1-2.8 2.1c-1.2 0-2.3-.5-2.8-1.4'), p('M12 6v1.8'), p('M12 16.2V18')],
  sponge: [r(3.5, 7, 17, 11, 2.5), p('M3.5 11.5h17'), c(8, 15, 0.8), c(12.5, 14.5, 0.6), c(16, 15.5, 0.7)],
  home: [p('M3.5 11L12 4l8.5 7'), p('M6 9.2V20h12V9.2'), p('M10 20v-5.5h4V20')],
  box: [p('M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4z'), p('M3.5 7.5L12 11.5l8.5-4'), p('M12 11.5v9')],
  washer: [r(4, 2.5, 16, 19, 2), p('M4 7h16'), c(12, 14, 4.5), c(7, 4.8, 0.5), p('M10 4.8h7')],
  trash: [p('M4 6.5h16'), p('M9.5 6.5V4h5v2.5'), p('M6 6.5l1 14h10l1-14'), p('M10 10.5v6'), p('M14 10.5v6')],
  heart: [p('M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z')],
  shoe: [p('M3 18.5V9.5h3.5l2 3h3.5l4.5 2 3.5.7a1.5 1.5 0 0 1 1 1.4v1.9z'), p('M3 16h18'), p('M9.5 12.5l1-1.5'), p('M12.5 13l1-1.5')],
  paper: [p('M6 3h8.5L19 7.5V21H6z'), p('M14.5 3v4.5H19'), p('M9 9h3'), p('M9 12.5h7'), p('M9 16h7')],
  wrench: [p('M15 3.5a5 5 0 0 0-4.6 6.9L3.5 17.3a2.1 2.1 0 0 0 3 3l6.9-6.9A5 5 0 0 0 20.5 9l-3 3-3-1-1-3z')],
  bag: [r(3, 9, 18, 11, 2.5), p('M8.5 9V6.5A1.5 1.5 0 0 1 10 5h4a1.5 1.5 0 0 1 1.5 1.5V9'), p('M3 13.5h18')],
  gamepad: [p('M7.5 7h9a4.5 4.5 0 0 1 4.4 3.6l1 5.2a2.6 2.6 0 0 1-4.5 2.2L15.6 16H8.4l-1.8 2a2.6 2.6 0 0 1-4.5-2.2l1-5.2A4.5 4.5 0 0 1 7.5 7z'), p('M7.5 10v4'), p('M5.5 12h4'), c(15.5, 11, 0.7), c(17.8, 13, 0.7)],
  subtitles: [r(2.5, 4.5, 19, 15, 2.5), p('M6 12.5h5'), p('M13 12.5h5'), p('M6 15.5h8'), p('M16 15.5h2')],
  translate: [r(2.5, 3, 11, 10, 2), p('M5.5 10.5l2.5-5.5 2.5 5.5'), p('M6.5 8.7h3'), r(10.5, 11, 11, 10, 2), p('M14 15h4.5'), p('M17.5 15c0 2-1.3 3.5-3 4.3'), p('M15 17c.7 1 1.8 1.8 3.2 2.3')],
  textsize: [p('M3 19l5-13 5 13'), p('M4.8 14.5h6.4'), p('M14.5 19l3.2-8 3.3 8'), p('M15.6 16.3h4.2')],
  packet: [r(6, 3, 12, 18, 2), p('M6 6.5h12'), p('M6 17.5h12'), c(10, 10, 0.6), c(14, 10, 0.6), c(12, 12.3, 0.6), c(10, 14.6, 0.6), c(14, 14.6, 0.6)],
};

type Props = {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  delay?: number; // بالإطارات
  drawFrames?: number;
};

export const Icon: React.FC<Props> = ({
  name,
  size = 200,
  color,
  strokeWidth = 1.4,
  delay = 0,
  drawFrames = 20,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const shapes = ICON_SHAPES[name];
  if (!shapes) return null;

  const common = {
    fill: 'none',
    stroke: color ?? theme.accent,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    pathLength: 1,
    strokeDasharray: 1,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{overflow: 'visible'}}>
      {shapes.map((s, i) => {
        // كل جزء يبدأ بعد اللي قبله بشوي
        const start = delay + i * 3;
        const progress = interpolate(frame, [start, start + drawFrames], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        const props = {...common, strokeDashoffset: 1 - progress};
        if (s.k === 'path') return <path key={i} d={s.d} {...props} />;
        if (s.k === 'circle') return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} {...props} />;
        return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} {...props} />;
      })}
    </svg>
  );
};
