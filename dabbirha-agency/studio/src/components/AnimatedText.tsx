import React from 'react';
import {spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {COLORS, CONTENT, FONT_FAMILY} from '../theme';

type Word = {text: string; highlight: boolean};

// "فرنك *محروق جداً* ؟" → كلمات، والمحاط بـ * يتلوّن ذهبي (يقبل أكثر من كلمة)
export const parseLine = (line: string): Word[] => {
  const words: Word[] = [];
  let on = false;
  for (const raw of line.trim().split(/\s+/)) {
    let t = raw;
    let hl = on;
    if (t.startsWith('*')) {
      on = true;
      hl = true;
      t = t.slice(1);
    }
    if (t.endsWith('*')) {
      on = false;
      t = t.slice(0, -1);
    }
    if (t) words.push({text: t, highlight: hl});
  }
  return words;
};

// حجم الخط حسب أطول سطر عشان ما يتقص (متوسط عرض الحرف العربي في Tajawal Bold ≈ 0.6 من حجم الخط — مقاس من رندر فعلي)
export const fitFontSize = (lines: string[], max: number, min = 64) => {
  const longest = Math.max(...lines.map((l) => l.replace(/\*/g, '').trim().length), 1);
  const size = Math.floor((CONTENT.width * 0.94) / (longest * 0.6));
  return Math.max(min, Math.min(max, size));
};

type Props = {
  lines: string[];
  maxFontSize?: number;
  weight?: number;
  delay?: number; // بالإطارات
  stagger?: number; // فرق الإطارات بين كل كلمة
  color?: string;
};

export const AnimatedText: React.FC<Props> = ({
  lines,
  maxFontSize = 96,
  weight = 800,
  delay = 0,
  stagger = 3,
  color = COLORS.white,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fontSize = fitFontSize(lines, maxFontSize);
  let index = 0;

  return (
    <div
      style={{
        direction: 'rtl',
        fontFamily: FONT_FAMILY,
        fontWeight: weight,
        fontSize,
        lineHeight: 1.35,
        color,
        textAlign: 'center',
        width: '100%',
      }}
    >
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: fontSize * 0.28,
          }}
        >
          {parseLine(line).map((w, wi) => {
            const start = delay + index++ * stagger;
            const s = spring({frame: frame - start, fps, config: {damping: 14, stiffness: 160, mass: 0.6}});
            const underline = interpolate(frame - start, [6, 16], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={wi}
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  opacity: s,
                  transform: `translateY(${(1 - s) * 40}px) scale(${0.85 + s * 0.15})`,
                  color: w.highlight ? COLORS.gold : undefined,
                }}
              >
                {w.text}
                {w.highlight && (
                  <span
                    style={{
                      position: 'absolute',
                      right: 0,
                      bottom: fontSize * 0.08,
                      height: fontSize * 0.12,
                      width: `${underline * 100}%`,
                      background: COLORS.goldSoft,
                      borderRadius: 999,
                      zIndex: -1,
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
