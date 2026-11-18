// Remotion wrapper around the deterministic canvas engine (film/engine).
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
// @ts-ignore — plain ES modules shared with the browser preview
import { createFilm } from '../../engine/scenes.js';
// @ts-ignore
import { CAPTURES, FONT_FACES } from '../../engine/assets.js';
import data from '../public/data.json';

type Engine = { draw: (c: CanvasRenderingContext2D, cv: HTMLCanvasElement, t: number, o?: object) => void };
let enginePromise: Promise<Engine> | null = null;

function loadEngine(): Promise<Engine> {
  if (enginePromise) return enginePromise;
  enginePromise = (async () => {
    await Promise.all(FONT_FACES.map(async ([fam, w, file]: [string, number, string]) => {
      const f = new FontFace(fam, `url(${staticFile('fonts/' + file)})`, { weight: String(w) });
      await f.load(); (document.fonts as any).add(f);
    }));
    const IMG: Record<string, HTMLImageElement> = {};
    await Promise.all(CAPTURES.map((n: string) => new Promise<void>((res) => {
      const i = new Image(); i.onload = () => res(); i.onerror = () => res(); i.src = staticFile(`captures/${n}.png`); IMG[n] = i;
    })));
    await Promise.all(CAPTURES.map((n: string) => IMG[n].decode().catch(() => undefined)));
    return createFilm(data, IMG) as Engine;
  })();
  return enginePromise;
}

export const Film: React.FC<{ subtitles: boolean; audio: boolean }> = ({ subtitles, audio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<Engine | null>(null);
  const [handle] = useState(() => delayRender('loading film engine'));
  useEffect(() => { loadEngine().then((e) => { setEngine(e); continueRender(handle); }); }, [handle]);
  useLayoutEffect(() => {
    const cv = ref.current; if (!cv || !engine) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    if (cv.width !== 1920 * dpr) { cv.width = 1920 * dpr; cv.height = 1080 * dpr; }
    engine.draw(cv.getContext('2d')!, cv, frame / fps, { subtitles });
  }, [frame, fps, engine, subtitles]);
  const hasMix = (data as any).audio?.mix;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <canvas ref={ref} style={{ width: 1920, height: 1080 }} />
      {audio && hasMix ? <Audio src={staticFile('audio/' + (data as any).audio.mix)} /> : null}
    </AbsoluteFill>
  );
};
