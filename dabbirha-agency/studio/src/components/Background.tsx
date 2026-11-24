import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useTheme} from '../ThemeContext';

const Glow: React.FC<{x: number; y: number; size: number; rgb: string; opacity: number}> = ({x, y, size, rgb, opacity}) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, rgba(${rgb},${opacity}) 0%, rgba(${rgb},0) 68%)`,
    }}
  />
);

// دبّرها: كحلي مع توهج ذهبي يتحرك ببطء
const DabbirhaBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${theme.bgLight} 0%, ${theme.bg} 65%)`, overflow: 'hidden'}}>
      <Glow x={780 + Math.sin(t * 0.5) * 60} y={520 + Math.cos(t * 0.4) * 50} size={900} rgb="232,176,75" opacity={0.1} />
      <Glow x={260 + Math.cos(t * 0.35) * 70} y={1450 + Math.sin(t * 0.45) * 60} size={1000} rgb="232,176,75" opacity={0.07} />
    </AbsoluteFill>
  );
};

// طابع يوتيوب: أسود مع توهج أحمر وبطاقات فيديو باهتة تنزلق في الخلفية (من dabberha-reel/src/yt/base.tsx)
const YoutubeBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const t = frame / 14;
  return (
    <AbsoluteFill style={{background: theme.bg, overflow: 'hidden'}}>
      <Glow x={540 + Math.sin(t / 5) * 260} y={380 + Math.cos(t / 6) * 160} size={1120} rgb="255,0,51" opacity={0.16} />
      <Glow x={540 + Math.cos(t / 7) * 300} y={1500 + Math.sin(t / 5) * 140} size={1200} rgb="255,255,255" opacity={0.05} />
      {Array.from({length: 12}).map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const y = ((row * 520 - frame * 0.6) % 2080 + 2080) % 2080 - 200;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 40 + col * 350,
              top: y,
              width: 300,
              height: 170,
              borderRadius: 14,
              border: '1.5px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.015)',
            }}
          />
        );
      })}
      <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};

export const Background: React.FC = () => {
  const theme = useTheme();
  return theme.name === 'youtube' ? <YoutubeBackground /> : <DabbirhaBackground />;
};
