import React from 'react';
import {AbsoluteFill, Sequence, Series} from 'remotion';
import {sceneFrames} from './episode-schema.mjs';
import {Background} from './components/Background';
import {ProgressBar} from './components/ProgressBar';
import {SafeZoneOverlay} from './components/SafeZoneOverlay';
import {SCENE_COMPONENTS, SceneData} from './components/Scenes';
import {Watermark} from './components/Watermark';

export type EpisodeData = {
  id: string;
  title: string;
  scenes: SceneData[];
};

export type EpisodeProps = EpisodeData & {showSafeZone?: boolean};

export const Episode: React.FC<EpisodeProps> = ({scenes, showSafeZone}) => {
  let step = 0;
  const outroIndex = scenes.findIndex((s) => s.type === 'outro');
  const beforeOutro = scenes.slice(0, outroIndex === -1 ? scenes.length : outroIndex);
  const watermarkFrames = beforeOutro.reduce((sum, s) => sum + sceneFrames(s), 0);

  return (
    <AbsoluteFill style={{backgroundColor: '#0F1B2D'}}>
      <Background />
      <Series>
        {scenes.map((scene, i) => {
          const frames = sceneFrames(scene);
          const Scene = SCENE_COMPONENTS[scene.type];
          const stepNumber = scene.type === 'step' ? ++step : undefined;
          return (
            <Series.Sequence key={i} durationInFrames={frames} name={`${i + 1}. ${scene.type}`}>
              <Scene scene={scene} durationInFrames={frames} stepNumber={stepNumber} />
            </Series.Sequence>
          );
        })}
      </Series>
      {watermarkFrames > 0 && (
        <Sequence durationInFrames={watermarkFrames} name="watermark">
          <Watermark />
        </Sequence>
      )}
      <ProgressBar />
      {showSafeZone && <SafeZoneOverlay />}
    </AbsoluteFill>
  );
};
