import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useTheme} from '../ThemeContext';

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
export const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);

// شارة ذهبية: رقم الخطوة أو كلمة قصيرة مثل "نصيحة"
export const Badge: React.FC<{label: string; round?: boolean; delay?: number}> = ({label, round, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const theme = useTheme();
  const s = spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 180}});
  return (
    <div
      style={{
        direction: 'rtl',
        fontFamily: theme.font,
        fontWeight: theme.weight,
        fontSize: round ? 72 : 46,
        lineHeight: 1,
        color: theme.onAccent,
        background: theme.accent,
        borderRadius: round ? theme.badgeRadius : 999,
        width: round ? (theme.badgeRadius === 999 ? 124 : 150) : undefined,
        // طابع يوتيوب: شارة مستطيلة مثل زر التشغيل
        height: round ? (theme.badgeRadius === 999 ? 124 : 104) : undefined,
        padding: round ? 0 : '18px 40px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${s})`,
        boxShadow: `0 12px 40px ${theme.accentSoft}`,
      }}
    >
      {label}
    </div>
  );
};
