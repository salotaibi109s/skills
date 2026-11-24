import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useTheme} from '../ThemeContext';

// شرائح تنبثق وحدة وحدة؛ الشريحة "struck" تطلع آخر شي وتنشطب بخط أحمر.
export const Chips: React.FC<{chips: {text: string; struck?: boolean}[]}> = ({chips}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const theme = useTheme();
  const normal = chips.filter((c) => !c.struck);
  const struck = chips.filter((c) => c.struck);
  const ordered = [...normal, ...struck];
  return (
    <div
      style={{
        direction: 'rtl',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        width: '100%',
        fontFamily: theme.font,
      }}
    >
      {ordered.map((c, i) => {
        const at = c.struck ? normal.length * 1.5 + 6 : i * 1.5;
        const s = spring({frame: frame - at, fps, config: {damping: 13, stiffness: 220, mass: 0.6}});
        const strike = interpolate(frame - at, [6, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const red = '#FF3B4E';
        return (
          <div
            key={i}
            style={{
              position: 'relative',
              padding: c.struck ? '16px 34px 12px' : '12px 26px 9px',
              borderRadius: 999,
              fontSize: c.struck ? 52 : 36,
              fontWeight: c.struck ? theme.weight : 700,
              color: c.struck ? theme.ink : theme.muted,
              background: c.struck ? 'rgba(255,59,78,0.14)' : 'rgba(255,255,255,0.06)',
              border: `2px solid ${c.struck ? red : 'rgba(255,255,255,0.14)'}`,
              opacity: Math.min(1, s * 1.4),
              transform: `scale(${0.6 + 0.4 * s})`,
              lineHeight: 1.2,
            }}
          >
            {c.text}
            {c.struck && (
              <div
                style={{
                  position: 'absolute',
                  right: '8%',
                  top: '50%',
                  height: 7,
                  width: `${strike * 84}%`,
                  background: red,
                  borderRadius: 4,
                  transform: 'rotate(-8deg)',
                  boxShadow: `0 0 14px ${red}`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
