import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, Series, staticFile, useVideoConfig} from 'remotion';
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
  music?: string; // موسيقى خلفية من public/music
  sfxDefaults?: boolean; // مؤثر تلقائي لكل نوع مشهد
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

// المؤثر الافتراضي لكل نوع مشهد (لما sfxDefaults = true)
const SFX_BY_TYPE: Record<SceneData['type'], string> = {
  hook: 'impact',
  step: 'level',
  tip: 'glitch',
  result: 'check',
  outro: 'pass',
};

const db = (d: number) => Math.pow(10, d / 20);

// موسيقى خلفية هادية تحت صوت ناصر، تدخل وتطلع بنعومة
const MusicBed: React.FC<{name: string}> = ({name}) => {
  const {durationInFrames} = useVideoConfig();
  return (
    <Audio
      src={staticFile(`music/${name}.mp3`)}
      loop
      volume={(f) =>
        db(-21) *
        interpolate(f, [0, 12, durationInFrames - 40, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      }
    />
  );
};

export const Episode: React.FC<EpisodeProps> = (props) => (
  <ThemeProvider name={props.theme}>
    <EpisodeBody {...props} />
  </ThemeProvider>
);

const EpisodeBody: React.FC<EpisodeProps> = ({scenes, showSafeZone, music, sfxDefaults}) => {
  const theme = useTheme();
  let step = 0;
  const outroIndex = scenes.findIndex((s) => s.type === 'outro');
  const beforeOutro = scenes.slice(0, outroIndex === -1 ? scenes.length : outroIndex);
  const watermarkFrames = beforeOutro.reduce((sum, s) => sum + sceneFrames(s), 0);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <Background />
      {music && <MusicBed name={music} />}
      <Series>
        {scenes.map((scene, i) => {
          const frames = sceneFrames(scene);
          const Scene = SCENE_COMPONENTS[scene.type];
          const stepNumber = scene.type === 'step' ? ++step : undefined;
          return (
            <Series.Sequence key={i} durationInFrames={frames} name={`${i + 1}. ${scene.type}`}>
              <Scene scene={scene} durationInFrames={frames} stepNumber={stepNumber} />
              {scene.audio && <Audio src={staticFile(scene.audio)} />}
              {(() => {
                const fx = scene.sfx ?? (sfxDefaults ? SFX_BY_TYPE[scene.type] : undefined);
                return fx && fx !== 'none' ? <Audio src={staticFile(`sfx/${fx}.mp3`)} volume={db(-10)} /> : null;
              })()}
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
