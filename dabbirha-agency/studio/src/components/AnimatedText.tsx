import React from 'react';
import {spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {CONTENT} from '../theme';
import {useTheme} from '../ThemeContext';

type Word = {text: string; highlight: boolean};

// "فرنك *محروق جداً*؟" → كلمات، والمحاط بـ * يتلوّن ذهبي (يقبل أكثر من كلمة،
// والنجمة تقدر تجي قبل علامة ترقيم مثل *هالأكياس*!)
export const parseLine = (line: string): Word[] => {
  const words: Word[] = [];
  let on = false;
  for (const raw of line.trim().split(/\s+/)) {
    let highlight: boolean | null = null;
    let text = '';
    for (const ch of raw) {
      if (ch === '*') {
        on = !on;
        continue;
      }
      // لون الكلمة = حالة التمييز عند أول حرف فيها
      if (highlight === null) highlight = on;
      text += ch;
    }
    if (text) words.push({text, highlight: Boolean(highlight)});
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
  weight,
  delay = 0,
  stagger = 3,
  color,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const pill = theme.highlight === 'pill';
  const {fps} = useVideoConfig();
  const fontSize = fitFontSize(lines, maxFontSize);
  let index = 0;

  return (
    <div
      style={{
        direction: 'rtl',
        fontFamily: theme.font,
        fontWeight: weight ?? theme.weight,
        fontSize,
        lineHeight: 1.35,
        color: color ?? theme.ink,
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
                  color: w.highlight ? (pill ? theme.onAccent : theme.accent) : undefined,
                }}
              >
                {w.text}
                {w.highlight && !pill && (
                  <span
                    style={{
                      position: 'absolute',
                      right: 0,
                      bottom: fontSize * 0.08,
                      height: fontSize * 0.12,
                      width: `${underline * 100}%`,
                      background: theme.accentSoft,
                      borderRadius: 999,
                      zIndex: -1,
                    }}
                  />
                )}
                {w.highlight && pill && (
                  // طابع يوتيوب: الكلمة على خلفية حمراء
                  <span
                    style={{
                      position: 'absolute',
                      left: '-8%',
                      right: '-8%',
                      top: '8%',
                      bottom: '2%',
                      borderRadius: fontSize * 0.18,
                      background: theme.accent,
                      opacity: underline,
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
