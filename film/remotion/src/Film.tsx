// Remotion wrapper around the deterministic canvas engine (film/engine).
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
// @ts-ignore — plain ES modules shared with the browser preview
import { createFilm } from '../../engine/scenes.js';
// @ts-ignore
import { createShort } from '../../engine/vertical.js';
// @ts-ignore
import { createBeforeAfter } from '../../engine/before_after.js';
// @ts-ignore
import { CAPTURES, FONT_FACES } from '../../engine/assets.js';
import data from '../public/data.json';

type Engine = { draw: (c: CanvasRenderingContext2D, cv: HTMLCanvasElement, t: number, o?: object) => void };
const enginePromises: Record<string, Promise<Engine>> = {};

function loadEngine(vertical: boolean, variant: string): Promise<Engine> {
  const key = variant || (vertical ? 'v' : 'h');
  if (enginePromises[key]) return enginePromises[key];
  enginePromises[key] = (async () => {
    await Promise.all(FONT_FACES.map(async ([fam, w, file]: [string, number, string]) => {
      const f = new FontFace(fam, `url(${staticFile('fonts/' + file)})`, { weight: String(w) });
      await f.load(); (document.fonts as any).add(f);
    }));
    const IMG: Record<string, HTMLImageElement> = {};
    await Promise.all(CAPTURES.map((n: string) => new Promise<void>((res) => {
      const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = staticFile(`captures/${n}.png`); IMG[n] = i;
    })));
    await Promise.all(CAPTURES.map((n: string) => IMG[n].decode().catch(() => undefined)));
    return (variant === 'ba' ? createBeforeAfter(data, IMG) : vertical ? createShort(data, IMG) : createFilm(data, IMG)) as Engine;
  })();
  return enginePromises[key];
}

export const Film: React.FC<{ subtitles: boolean; audio: boolean; vertical?: boolean; variant?: string }> = ({ subtitles, audio, vertical = false, variant = '' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<Engine | null>(null);
  const [handle] = useState(() => delayRender('loading film engine'));
  useEffect(() => { loadEngine(vertical, variant).then((e) => { setEngine(e); continueRender(handle); }); }, [handle, vertical, variant]);
  useLayoutEffect(() => {
    const cv = ref.current; if (!cv || !engine) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = vertical ? 1080 : 1920, h = vertical ? 1920 : 1080;
    if (cv.width !== w * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
    engine.draw(cv.getContext('2d')!, cv, frame / fps, { subtitles });
  }, [frame, fps, engine, subtitles, vertical]);
  const mix = variant === 'ba' ? (data as any).audio_ba?.mix : vertical ? (data as any).audio_short?.mix : (data as any).audio?.mix;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <canvas ref={ref} style={{ width: vertical ? 1080 : 1920, height: vertical ? 1920 : 1080 }} />
      {audio && mix ? <Audio src={staticFile('audio/' + mix)} /> : null}
    </AbsoluteFill>
  );
};
