import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {SAFE, VIDEO} from '../theme';
import {useTheme} from '../ThemeContext';

// شريط تقدم رفيع يمتلئ من اليمين لليسار — يشجع على إكمال المشاهدة
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const theme = useTheme();
  const width = VIDEO.width - SAFE.left - SAFE.right;
  const progress = Math.min(1, frame / (durationInFrames - 1));
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left,
        top: VIDEO.height - SAFE.bottom - 30,
        width,
        height: 8,
        borderRadius: 999,
        background: 'rgba(245,245,240,0.12)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: width * progress,
          background: theme.accent,
          borderRadius: 999,
        }}
      />
    </div>
  );
};
