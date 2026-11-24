import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

// خلفية كحلية مع توهج ذهبي يتحرك ببطء — ثابتة عبر كل المشاهد.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const glow = (x: number, y: number, size: number, opacity: number) => (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(232,176,75,${opacity}) 0%, rgba(232,176,75,0) 70%)`,
      }}
    />
  );
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${COLORS.navyLight} 0%, ${COLORS.navy} 65%)`,
        overflow: 'hidden',
      }}
    >
      {glow(780 + Math.sin(t * 0.5) * 60, 520 + Math.cos(t * 0.4) * 50, 900, 0.1)}
      {glow(260 + Math.cos(t * 0.35) * 70, 1450 + Math.sin(t * 0.45) * 60, 1000, 0.07)}
    </AbsoluteFill>
  );
};
