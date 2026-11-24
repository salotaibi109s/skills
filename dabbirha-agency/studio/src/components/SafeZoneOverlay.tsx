import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SAFE, VIDEO} from '../theme';

// يظهر فقط في لقطات الفحص (showSafeZone) — أي نص فوق الأحمر = مشكلة
export const SafeZoneOverlay: React.FC = () => {
  const red = 'rgba(255, 40, 40, 0.28)';
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: SAFE.top, background: red}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: SAFE.bottom, background: red}} />
      <div
        style={{
          position: 'absolute',
          top: SAFE.top,
          right: 0,
          width: SAFE.right,
          height: VIDEO.height - SAFE.top - SAFE.bottom,
          background: red,
        }}
      />
    </AbsoluteFill>
  );
};
