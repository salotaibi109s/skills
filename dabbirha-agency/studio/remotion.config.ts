import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// على جهاز فيه متصفح مخصص: BROWSER_EXECUTABLE=/path/to/chrome npm run studio
if (process.env.BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.BROWSER_EXECUTABLE);
}
