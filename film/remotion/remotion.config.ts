import { Config } from '@remotion/cli/config';
// Use the Chromium headless shell that ships with this environment when present.
import { existsSync } from 'node:fs';
const shell = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
if (existsSync(shell)) Config.setBrowserExecutable(shell);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(4);
