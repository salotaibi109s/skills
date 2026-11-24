import React from 'react';
import {useTheme} from '../ThemeContext';

// شعار نصي: بيت صغير ذهبي + "دبّرها"
export const Logo: React.FC<{size?: number}> = ({size = 40}) => {
  const theme = useTheme();
  return (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: size * 0.3,
      direction: 'rtl',
      fontFamily: theme.font,
      fontWeight: theme.weight,
      fontSize: size,
      color: theme.ink,
      lineHeight: 1,
    }}
  >
    <svg width={size * 1.1} height={size * 1.1} viewBox="0 0 24 24">
      <path
        d="M3.5 11L12 4l8.5 7M6 9.2V20h12V9.2"
        fill="none"
        stroke={theme.accent}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={12} cy={14.5} r={2} fill={theme.accent} />
    </svg>
    <span>دبّرها</span>
  </div>
  );
};
