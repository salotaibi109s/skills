"""Generate the narration with ElevenLabs (voice: Nasser AlJubaily – Authentic Saudi Pro).

Reads film/script/vo_request.json and writes, per scene:
  film/build/audio/vo/<scene>.mp3              the voice
  film/build/audio/vo/<scene>.alignment.json   character timings (used to sync picture + subtitles)

Key: ELEVENLABS_API_KEY in the environment, or a network secret for api.elevenlabs.io
(header xi-api-key) that the cloud proxy injects, in which case any placeholder works.
Never commit the key.

Usage: python3 film/tools/elevenlabs_vo.py [scene_id ...]
"""
import base64
import json
import os
import sys
import urllib.request
from pathlib import Path

F = Path(__file__).resolve().parent.parent
req = json.loads((F / "script/vo_request.json").read_text(encoding="utf-8"))
out = F / "build/audio/vo"
out.mkdir(parents=True, exist_ok=True)
key = os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")
only = set(sys.argv[1:])

for sc in req["scenes"]:
    if only and sc["id"] not in only:
        continue
    body = json.dumps({
        "text": sc["text"],
        "model_id": req["model_id"],
        "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.35, "use_speaker_boost": True},
    }).encode()
    r = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{req['voice_id']}/with-timestamps?output_format=mp3_44100_128",
        data=body, headers={"xi-api-key": key, "Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(r, timeout=300) as resp:
        data = json.loads(resp.read())
    (out / f"{sc['id']}.mp3").write_bytes(base64.b64decode(data["audio_base64"]))
    (out / f"{sc['id']}.alignment.json").write_text(json.dumps(data.get("alignment"), ensure_ascii=False), encoding="utf-8")
    print("voice ok:", sc["id"])
