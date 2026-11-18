// Copy engine assets into Remotion's public/ folder (fonts, captures, data, audio).
import { cpSync, mkdirSync, existsSync } from 'node:fs';
const F = new URL('..', import.meta.url).pathname;
mkdirSync('public', { recursive: true });
cpSync(F + 'engine/fonts', 'public/fonts', { recursive: true });
cpSync(F + 'build/captures', 'public/captures', { recursive: true });
cpSync(F + 'engine/data.json', 'public/data.json');
if (existsSync(F + 'build/audio')) cpSync(F + 'build/audio', 'public/audio', { recursive: true });
console.log('public/ ready');
