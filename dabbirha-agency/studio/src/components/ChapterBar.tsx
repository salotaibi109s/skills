import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SAFE, VIDEO} from '../theme';
import {useTheme} from '../ThemeContext';

export type Chapter = {from: number; to: number; title: string};

// طابع يوتيوب: شريط تقدم مقسوم فصول (فصل لكل مشهد) مع نقطة ونص الفصل الحالي والوقت.
// يجي تحت هامش الأمان العلوي مباشرة عشان ما تغطيه واجهة التطبيق.
export const ChapterBar: React.FC<{chapters: Chapter[]}> = ({chapters}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const theme = useTheme();
  const left = SAFE.left;
  const width = VIDEO.width - SAFE.left - SAFE.right;
  const top = SAFE.top + 14;
  // اتجاه عربي: البداية من اليمين
  const x = (f: number) => left + width - (f / durationInFrames) * width;
  const now = [...chapters].reverse().find((c) => frame >= c.from) ?? chapters[0];
  const mm = (f: number) => {
    const s = Math.floor(f / fps);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };
  return (
    <>
      {chapters.map((c, i) => {
        const right = x(c.from) - (i ? 3 : 0);
        const leftEdge = x(c.to) + (i < chapters.length - 1 ? 3 : 0);
        const fill = Math.max(0, Math.min(1, (frame - c.from) / Math.max(1, c.to - c.from)));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: leftEdge,
              top,
              width: Math.max(0, right - leftEdge),
              height: 8,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.22)',
              overflow: 'hidden',
            }}
          >
            <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: theme.accent}} />
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: x(frame) - 11,
          top: top - 7,
          width: 22,
          height: 22,
          borderRadius: 11,
          background: theme.accent,
          boxShadow: `0 0 12px ${theme.accent}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left,
          top: top + 26,
          width,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: theme.font,
          fontSize: 30,
          color: theme.muted,
        }}
      >
        <div style={{direction: 'ltr', fontVariantNumeric: 'tabular-nums'}}>
          {mm(frame)} / {mm(durationInFrames)}
        </div>
        <div style={{direction: 'rtl', fontWeight: 700, color: theme.ink}}>{now?.title}</div>
      </div>
    </>
  );
};
