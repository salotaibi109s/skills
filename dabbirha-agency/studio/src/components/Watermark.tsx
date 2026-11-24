import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SAFE} from '../theme';
import {Logo} from './Logo';

// شعار صغير أعلى منطقة الأمان من اليسار (اليمين محجوز لأزرار التطبيق)
export const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 0.85], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: SAFE.top + 10, left: SAFE.left, opacity}}>
      <Logo size={38} />
    </div>
  );
};
