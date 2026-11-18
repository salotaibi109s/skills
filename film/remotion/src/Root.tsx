import React from 'react';
import { Composition } from 'remotion';
import { Film } from './Film';
import data from '../public/data.json';

const fps = data.timeline.fps;
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ClaudeBeyondTheChat" component={Film} durationInFrames={Math.round(data.timeline.duration * fps)}
      fps={fps} width={1920} height={1080} defaultProps={{ subtitles: true, audio: true }} />
    <Composition id="ClaudeBeyondTheChatClean" component={Film} durationInFrames={Math.round(data.timeline.duration * fps)}
      fps={fps} width={1920} height={1080} defaultProps={{ subtitles: false, audio: true }} />
  </>
);
