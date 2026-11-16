/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Cloud sandbox: use the pre-installed Chromium when present (no browser download needed,
// and it trusts the sandbox's TLS proxy so Google Fonts load).
import { existsSync } from "node:fs";
const preinstalled = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
if (existsSync(preinstalled)) {
  Config.setBrowserExecutable(preinstalled);
  Config.setChromeMode("chrome-for-testing");
}
