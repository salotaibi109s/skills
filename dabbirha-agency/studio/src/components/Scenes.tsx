import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, COLORS, FONT_FAMILY} from '../theme';
import {AnimatedText} from './AnimatedText';
import {Badge, toArabicDigits} from './Badge';
import {Icon} from './Icon';
import {Logo} from './Logo';
import {SceneShell} from './SceneShell';

export type SceneData = {
  type: 'hook' | 'step' | 'tip' | 'result' | 'outro';
  durationSec: number;
  lines: string[];
  icon?: string;
  audio?: string; // تعليق صوتي يبدأ مع المشهد — مسار داخل public/
};

type SceneProps = {scene: SceneData; durationInFrames: number; stepNumber?: number};

// أيقونة تطفو بهدوء بعد ما تنرسم
const FloatingIcon: React.FC<{name: string; size: number; delay?: number}> = ({name, size, delay = 0}) => {
  const frame = useCurrentFrame();
  const y = Math.sin((frame - delay) / 14) * 8;
  return (
    <div style={{transform: `translateY(${y}px)`}}>
      <Icon name={name} size={size} delay={delay} />
    </div>
  );
};

export const HookScene: React.FC<SceneProps> = ({scene, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 9, stiffness: 140}});
  const ring = interpolate(frame % 45, [0, 45], [0.8, 1.5]);
  const ringOpacity = interpolate(frame % 45, [0, 45], [0.5, 0]);
  return (
    <SceneShell durationInFrames={durationInFrames} gap={90}>
      {scene.icon && (
        <div style={{position: 'relative', transform: `scale(${pop})`}}>
          <div
            style={{
              position: 'absolute',
              inset: -30,
              borderRadius: '50%',
              border: `6px solid ${COLORS.gold}`,
              transform: `scale(${ring})`,
              opacity: ringOpacity,
            }}
          />
          <Icon name={scene.icon} size={240} />
        </div>
      )}
      <AnimatedText lines={scene.lines} maxFontSize={118} delay={4} stagger={4} />
    </SceneShell>
  );
};

export const StepScene: React.FC<SceneProps> = ({scene, durationInFrames, stepNumber = 1}) => (
  <SceneShell durationInFrames={durationInFrames}>
    <Badge label={toArabicDigits(stepNumber)} round />
    {scene.icon && <FloatingIcon name={scene.icon} size={210} delay={4} />}
    <AnimatedText lines={scene.lines} maxFontSize={92} delay={8} />
  </SceneShell>
);

export const TipScene: React.FC<SceneProps> = ({scene, durationInFrames}) => (
  <SceneShell durationInFrames={durationInFrames} gap={48}>
    <Badge label={scene.icon === 'alert' ? 'تنبيه' : 'نصيحة'} />
    <div
      style={{
        width: '100%',
        border: `4px solid ${COLORS.gold}`,
        borderRadius: 48,
        padding: '56px 36px',
        background: 'rgba(232,176,75,0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 36,
      }}
    >
      <Icon name={scene.icon ?? 'bulb'} size={170} delay={4} />
      <AnimatedText lines={scene.lines} maxFontSize={84} delay={8} />
    </div>
  </SceneShell>
);

export const ResultScene: React.FC<SceneProps> = ({scene, durationInFrames}) => {
  const frame = useCurrentFrame();
  // نجوم صغيرة تلمع حول الأيقونة
  const sparkles = [
    {x: -170, y: -90, d: 6},
    {x: 160, y: -120, d: 10},
    {x: 190, y: 70, d: 14},
    {x: -150, y: 100, d: 18},
  ];
  return (
    <SceneShell durationInFrames={durationInFrames}>
      <Badge label="النتيجة" />
      <div style={{position: 'relative'}}>
        <Icon name={scene.icon ?? 'check'} size={230} delay={4} />
        {sparkles.map((s, i) => {
          const o = interpolate(frame - s.d, [0, 8, 24], [0, 1, 0.35], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div key={i} style={{position: 'absolute', left: 115 + s.x - 30, top: 115 + s.y - 30, opacity: o}}>
              <Icon name="sparkle" size={60} delay={s.d} drawFrames={10} strokeWidth={2} />
            </div>
          );
        })}
      </div>
      <AnimatedText lines={scene.lines} maxFontSize={96} delay={10} />
    </SceneShell>
  );
};

export const OutroScene: React.FC<SceneProps> = ({scene, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 12}});
  const pulse = 1 + Math.sin(frame / 6) * 0.04;
  return (
    <SceneShell durationInFrames={durationInFrames} gap={60}>
      <div style={{transform: `scale(${pop})`}}>
        <Logo size={96} />
      </div>
      <AnimatedText lines={scene.lines} maxFontSize={84} delay={8} />
      <div style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${pulse})`}}>
        <Icon name={scene.icon ?? 'bookmark'} size={80} delay={14} strokeWidth={2} />
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: 44,
            color: COLORS.muted,
            direction: 'ltr',
            opacity: interpolate(frame, [18, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}
        >
          {BRAND.handle}
        </span>
      </div>
    </SceneShell>
  );
};

export const SCENE_COMPONENTS: Record<SceneData['type'], React.FC<SceneProps>> = {
  hook: HookScene,
  step: StepScene,
  tip: TipScene,
  result: ResultScene,
  outro: OutroScene,
};
