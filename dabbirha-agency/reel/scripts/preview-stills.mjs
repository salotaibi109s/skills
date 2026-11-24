// Renders preview stills of one composition at the given frames (bundles once).
//   node scripts/preview-stills.mjs <CompositionId> <outDir> <frame> [frame...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [id, outDir, ...frames] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const browserExecutable = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable, chromeMode: "chrome-for-testing" });
for (const f of frames.map(Number)) {
  const output = path.join(outDir, `f${String(f).padStart(4, "0")}.jpg`);
  await renderStill({ composition, serveUrl, output, frame: f, imageFormat: "jpeg", jpegQuality: 85, scale: 0.5, browserExecutable, chromeMode: "chrome-for-testing" });
  console.log(output);
}
