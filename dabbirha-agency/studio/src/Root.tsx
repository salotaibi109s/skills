import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {Episode, EpisodeData, EpisodeProps} from './Episode';
import {FPS, totalFrames, validateEpisode} from './episode-schema.mjs';
import {VIDEO} from './theme';

// كل ملف JSON في src/episodes يصير Composition تلقائياً باسم الـ id.
// الحلقات اللي فيها أخطاء تُتخطّى — شغّل `npm run check -- <id>` لعرض الأخطاء.
declare const require: {
  context: (dir: string, deep: boolean, filter: RegExp) => {keys(): string[]; (key: string): unknown};
};
const ctx = require.context('./episodes', false, /\.json$/);

const episodes: EpisodeData[] = ctx
  .keys()
  .map((key) => {
    const ep = ctx(key) as EpisodeData;
    const fileId = key.replace(/^\.\//, '').replace(/\.json$/, '');
    const errors = validateEpisode(ep, fileId);
    if (errors.length) {
      console.warn(`[dabbirha] تخطّي ${key}:\n- ${errors.join('\n- ')}`);
      return null;
    }
    return ep;
  })
  .filter((ep): ep is EpisodeData => ep !== null)
  .sort((a, b) => a.id.localeCompare(b.id));

export const RemotionRoot: React.FC = () => (
  <>
    {episodes.map((ep) => (
      <Composition
        key={ep.id}
        id={ep.id}
        component={Episode}
        durationInFrames={totalFrames(ep)}
        fps={FPS}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{...ep, showSafeZone: false}}
      />
    ))}
  </>
);
