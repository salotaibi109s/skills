import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {CONTENT, ENTER_FRAMES, EXIT_FRAMES} from '../theme';

// يحط المحتوى في وسط منطقة الأمان ويضيف دخول/خروج ناعم لكل مشهد
export const SceneShell: React.FC<{durationInFrames: number; children: React.ReactNode; gap?: number}> = ({
  durationInFrames,
  children,
  gap = 56,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, ENTER_FRAMES], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const exit = interpolate(frame, [durationInFrames - EXIT_FRAMES, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: CONTENT.top,
          left: CONTENT.left,
          width: CONTENT.width,
          height: CONTENT.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap,
          opacity: Math.min(enter, exit),
          transform: `translateY(${(1 - enter) * 30 - (1 - exit) * 40}px)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
