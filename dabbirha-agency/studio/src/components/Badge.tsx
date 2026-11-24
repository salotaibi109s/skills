import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../theme';

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
export const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);

// شارة ذهبية: رقم الخطوة أو كلمة قصيرة مثل "نصيحة"
export const Badge: React.FC<{label: string; round?: boolean; delay?: number}> = ({label, round, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 180}});
  return (
    <div
      style={{
        direction: 'rtl',
        fontFamily: FONT_FAMILY,
        fontWeight: 800,
        fontSize: round ? 72 : 46,
        lineHeight: 1,
        color: COLORS.navy,
        background: COLORS.gold,
        borderRadius: 999,
        width: round ? 124 : undefined,
        height: round ? 124 : undefined,
        padding: round ? 0 : '18px 40px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${s})`,
        boxShadow: '0 12px 40px rgba(232,176,75,0.35)',
      }}
    >
      {label}
    </div>
  );
};
