import React from 'react';
import {AbsoluteFill, Audio, Sequence, Series, staticFile} from 'remotion';
import {sceneFrames} from './episode-schema.mjs';
import {Background} from './components/Background';
import {ProgressBar} from './components/ProgressBar';
import {SafeZoneOverlay} from './components/SafeZoneOverlay';
import {SCENE_COMPONENTS, SceneData} from './components/Scenes';
import {Watermark} from './components/Watermark';
import {Chapter, ChapterBar} from './components/ChapterBar';
import {toArabicDigits} from './components/Badge';
import {ThemeProvider, useTheme} from './ThemeContext';
import {ThemeName} from './themes';

export type EpisodeData = {
  id: string;
  title: string;
  theme?: ThemeName;
  scenes: SceneData[];
};

export type EpisodeProps = EpisodeData & {showSafeZone?: boolean};

const DEFAULT_CHAPTER: Record<SceneData['type'], string> = {
  hook: 'المقدمة',
  step: 'الخطوة',
  tip: 'نصيحة',
  result: 'النتيجة',
  outro: 'الختام',
};

const chaptersOf = (scenes: SceneData[]): Chapter[] => {
  let t = 0;
  let step = 0;
  return scenes.map((s) => {
    const from = t;
    t += sceneFrames(s);
    if (s.type === 'step') step++;
    const fallback = s.type === 'step' ? `الخطوة ${toArabicDigits(step)}` : s.type === 'tip' && s.icon === 'alert' ? 'تنبيه' : DEFAULT_CHAPTER[s.type];
    return {from, to: t, title: s.chapter ?? fallback};
  });
};

export const Episode: React.FC<EpisodeProps> = (props) => (
  <ThemeProvider name={props.theme}>
    <EpisodeBody {...props} />
  </ThemeProvider>
);

const EpisodeBody: React.FC<EpisodeProps> = ({scenes, showSafeZone}) => {
  const theme = useTheme();
  let step = 0;
  const outroIndex = scenes.findIndex((s) => s.type === 'outro');
  const beforeOutro = scenes.slice(0, outroIndex === -1 ? scenes.length : outroIndex);
  const watermarkFrames = beforeOutro.reduce((sum, s) => sum + sceneFrames(s), 0);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <Background />
      <Series>
        {scenes.map((scene, i) => {
          const frames = sceneFrames(scene);
          const Scene = SCENE_COMPONENTS[scene.type];
          const stepNumber = scene.type === 'step' ? ++step : undefined;
          return (
            <Series.Sequence key={i} durationInFrames={frames} name={`${i + 1}. ${scene.type}`}>
              <Scene scene={scene} durationInFrames={frames} stepNumber={stepNumber} />
              {scene.audio && <Audio src={staticFile(scene.audio)} />}
            </Series.Sequence>
          );
        })}
      </Series>
      {theme.chapters ? (
        <ChapterBar chapters={chaptersOf(scenes)} />
      ) : (
        <>
          {watermarkFrames > 0 && (
            <Sequence durationInFrames={watermarkFrames} name="watermark">
              <Watermark />
            </Sequence>
          )}
          <ProgressBar />
        </>
      )}
      {showSafeZone && <SafeZoneOverlay />}
    </AbsoluteFill>
  );
};
