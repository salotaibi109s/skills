#!/usr/bin/env bash
# Rebuild the whole film from source. Run from the repository root.
#   bash film/tools/make_all.sh            # captures → timeline → audio → 4K master + 1080p preview
#   WITH_VO=1 bash film/tools/make_all.sh  # also (re)generate Nasser's voice via ElevenLabs first
set -euo pipefail
cd "$(dirname "$0")/.."
(cd demos/01_data_analysis && python3 generate_data.py && python3 analyze.py > /dev/null)
node tools/capture_demos.mjs
if [ "${WITH_VO:-0}" = "1" ]; then python3 tools/elevenlabs_vo.py; fi
python3 tools/build_timeline.py          # uses real voice timings when build/audio/vo/*.alignment.json exist
python3 tools/build_data.py
python3 tools/audio.py                   # score + sfx (+ voice, ducked) → build/audio/mix.wav
mkdir -p output
cd remotion
[ -d node_modules ] || npm install
node prepare.mjs
npx remotion render src/index.ts ClaudeBeyondTheChat ../output/claude_beyond_the_chat_4k.mp4 \
  --scale=2 --codec=h264 --crf=20 --audio-codec=aac --audio-bitrate=320k
cd ..
ffmpeg -y -v error -i output/claude_beyond_the_chat_4k.mp4 -vf scale=1920:1080:flags=lanczos \
  -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 192k -movflags +faststart output/claude_beyond_the_chat_1080p.mp4
python3 tools/split_scenes.py
echo "done → film/output/"
